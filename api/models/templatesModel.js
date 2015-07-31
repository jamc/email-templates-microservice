var logger            = require('logger-initializer')();
var Promise           = require('bluebird');
var createSlug        = require('slug');
var pool              = require('./connectionPool').pool1;
var attachmentsModel  = require('./attachmentsModel');
var languagesModel    = require('./languagesModel');
var moment            = require('moment');
var _                 = require('lodash');
var async             = require('async');

/**
 * Inserts a template to database
 * @param  {object} templateInfo The template information
 * @return {Promise}             The promise to resolve
 */
function insertTemplate(templateInfo) {
  logger.info('Inserting a template into database');

  var resolver    = Promise.pending();
  var slug        = createSlug(templateInfo.name, {lower: true});
  var insertQuery = 'INSERT INTO Templates' +
                    '(slug, name, subject, html, text, created_at) ' +
                    'VALUES (' +
                    '"' + slug + '", ' +
                    '"' + templateInfo.name + '", ' +
                    '"' + templateInfo.subject + '", ' +
                    '"' + templateInfo.html + '", ' +
                    '"' + templateInfo.text + '", ' +
                    '"' + moment().format('YYYY-MM-DD HH:mm:ss') + '");';
  var connection;

  logger.debug(insertQuery);

  pool.getConnectionAsync()
    .then(function runQuery(_connection) {
      connection = Promise.promisifyAll(_connection);
      return connection.queryAsync(insertQuery);
    })
    .then(function handleResult(rows) {
      connection.release();

      var insertedResponse = {
        id    : rows[0].insertId,
        slug  : slug
      };
      logger.debug('Template inserted to database: ' + insertedResponse);
      resolver.resolve(insertedResponse);
    })
    .catch(function handleError(error) {
      resolver.reject(error);
    })
    .done();

  return resolver.promise;
}

/**
 * Get all templates by slug
 * @param  {string} fields Comma separated string with the fields to return,
 *                         the default is all fields
 * @return {Promise}       The promise to resolve
 */
function getTemplates(fields) {
  logger.info('Getting all templates from database');

  var resolver    = Promise.pending();
  var selectQuery = generateSelectQuery(['slug'], ['slug']);
  var templates   = [];
  var connection;

  logger.debug(selectQuery);

  pool.getConnectionAsync()
    .then(function runQuery(_connection) {
      connection = Promise.promisifyAll(_connection);
      return connection.queryAsync(selectQuery);
    })
    .then(function handleResult(rows) {
      connection.release();
      async.each(rows[0], function getTemplateBySlug(template, callback) {
        getTemplate(template.slug, fields)
          .then(function handleTemplatesResult(template) {
            templates.push(template);
            callback();
          })
          .catch(function handleError(error) {
            callback(error);
          })
          .done();
      }, function(error){
        if (error) {
          resolver.reject(error);
        }
        logger.debug('Templates obtained: ' + templates.length);
        resolver.resolve(templates);
      });
    })
    .catch(function handleError(error) {
      resolver.reject(error);
    })
    .done();

  return resolver.promise;
}

/**
 * Creates a select query for the Templates table
 * @param  {array}  receivedFields  The fields to query
 * @param  {array}  supportedFields The supported fields to return
 * @param  {string} slug            The template slug, if not defined
 *                                  there will not be WHERE clause
 * @return {string}                 The select query
 */
function generateSelectQuery(receivedFields, supportedFields, slug) {
  var selectQuery = 'SELECT id';
  _.forEach(receivedFields, function (receivedField) {
    if (supportedFields.indexOf(receivedField) !== -1) {
      if (receivedField === 'createdAt') {
        selectQuery += ', ' + 'created_at';
      } else if (receivedField === 'updatedAt') {
        selectQuery += ', ' + 'updated_at';
      } else {
        selectQuery += ', ' + receivedField;
      }
    }
  });
  selectQuery += ' FROM Templates';
  if (!!slug) {
    selectQuery += '  WHERE slug = "' + slug + '"';
  }
  selectQuery += ';';
  return selectQuery;
}

/**
 * Get a template by slug
 * @param  {string} slug   The template slug
 * @param  {string} fields Comma separated string with the fields to return,
 *                         the default is all fields
 * @return {Promise}       The promise to resolve
 */
function getTemplate(slug, fields) {
  logger.info('Getting a template from database');

  var supportedFields = ['slug', 'name', 'subject', 'html', 'text', 'createdAt', 'updatedAt'];
  var receivedFields  = supportedFields.concat(['attachments', 'lan']);
  var resolver        = Promise.pending();
  var connection, template;

  if (!!fields) {
    receivedFields  = fields.split(',');
  }

  var getAttachments = (receivedFields.indexOf('attachments') !== -1);
  var getLanguages   = (receivedFields.indexOf('lan') !== -1);
  var selectQuery    = generateSelectQuery(receivedFields, supportedFields, slug);

  logger.debug(selectQuery);

  pool.getConnectionAsync()
    .then(function selectTemplate(_connection) {
      connection = Promise.promisifyAll(_connection);
      return connection.queryAsync(selectQuery);
    })
    .then(function getAttachLang(rows) {
      connection.release();

      template = rows[0][0];
      logger.debug('Template found: ', template);

      if (!template) {
        return resolver.resolve(null);
      }

      var nextFunctions = [];
      if (getAttachments) {
        nextFunctions.push(attachmentsModel.getAttachments(template.id));
      }
      if (getLanguages) {
        nextFunctions.push(languagesModel.getLanguages(template.id));
      }

      return Promise.all(nextFunctions);
    })
    .then(function handleResults(results) {
      delete template.id;
      if (template.created_at) {
        template.createdAt = template.created_at;
        delete template.created_at;
      }
      if (template.updated_at) {
        template.updatedAt = template.updated_at;
        delete template.updated_at;
      }
      if (getAttachments) {
        template.attachments = results[0];
      }
      if (getLanguages) {
        template.lan = results[results.length - 1];
      }
      resolver.resolve(template);
    })
    .catch(function handleError(error) {
      resolver.reject(error);
    })
    .done();

  return resolver.promise;
}

module.exports = {
  insertTemplate  : insertTemplate,
  getTemplate     : getTemplate,
  getTemplates    : getTemplates
};