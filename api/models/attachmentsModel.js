var logger  = require('logger-initializer')();
var Promise = require('bluebird');
var async   = require('async');
var _       = require('lodash');
var pool    = require('./connectionPool').pool1;
var moment  = require('moment');

/**
 * Insert an attachment to database
 * @param  {integer} templateId  The template id of the attachment
 * @param  {string}  name        The file name
 * @param  {string}  type        The file type
 * @param  {string}  content     The file string representation
 * @return {Promise}             The promise to resolve
 */
function insertAttachment(templateId, name, type, content) {
  logger.info('Inserting attachment ' + name + ' into database');

  var resolver    = Promise.pending();
  var insertQuery = 'INSERT INTO Attachments(templates_id, name, type, content) ' +
                    'VALUES (' + templateId + ', "' + name + '", "' + type + '", "' + content + '");';
  var connection;

  logger.debug(insertQuery);

  pool.getConnectionAsync()
    .then(function runQuery(_connection) {
      connection = Promise.promisifyAll(_connection);
      return connection.queryAsync(insertQuery);
    })
    .then(function handleResult(rows) {
      connection.release();
      logger.info('Attachment inserted: ' + rows[0].insertId);
      resolver.resolve(rows[0].insertId);
    })
    .catch(function handleError(error) {
      resolver.reject(error);
    })
    .done();

  return resolver.promise;
}

/**
 * Inserts an array of attachments and return the ids
 * @param  {integer} templateId  The template id of the attachments
 * @param  {array}   attachments The languages to insert
 * @return {Promise}             The promise to resolve
 */
function insertAttachments(templateId, attachments) {
  logger.info('Inserting attachments into database');

  var resolver       = Promise.pending();
  var attachmentsIds = [];

  async.each(attachments, function (attachment, callback) {

    insertAttachment(templateId, attachment.name, attachment.type, attachment.content)
      .then(function handleResult(id) {
        attachmentsIds.push(id);
        return callback();
      })
      .catch(function (error) {
        callback(error);
      })
      .done();

  }, function (error) {
    if (error) {
      return resolver.reject(error);
    }
    attachmentsIds.sort(function (a, b) { return a - b; });
    resolver.resolve(attachmentsIds);
  });

  return resolver.promise;
}

/**
 * Gets all the attachments from a template
 * @param  {integer} templateId The template id
 * @return {Promise}            The promise to resolve
 */
function getAttachments(templateId) {
  logger.info('Getting attachments from database');

  var resolver      = Promise.pending();
  var selectQuery   = 'SELECT name, type, content FROM Attachments WHERE templates_id = ' + templateId + ';';
  var connection;

  logger.debug(selectQuery);

  pool.getConnectionAsync()
    .then(function runTemplateQuery(_connection) {
      connection = Promise.promisifyAll(_connection);
      return connection.queryAsync(selectQuery);
    })
    .then(function handleResult(rows) {
      connection.release();

      logger.debug('Attachments found: ', rows[0].length);
      var attachments = [];
      _.forEach(rows[0], function bufferToString(attachment) {
        attachment.content = attachment.content.toString();
        attachments.push(attachment);
      });
      resolver.resolve(attachments);
    })
    .catch(function handleError(error) {
      resolver.reject(error);
    })
    .done();

  return resolver.promise;
}

module.exports = {
  insertAttachments : insertAttachments,
  insertAttachment  : insertAttachment,
  getAttachments    : getAttachments
};