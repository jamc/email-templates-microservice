var logger  = require('logger-initializer')();
var Promise = require('bluebird');
var async   = require('async');
var pool    = Promise.promisifyAll(require('./connectionPool').pool1);
var moment  = require('moment');

/**
 * Insert a templates languages relation to database
 * @param  {integer} templateId The template id
 * @param  {integer} languageId The language id
 * @return {Promise}            The promise to resolve
 */
function insertTemplateLanguage(templateId, languageId) {
  logger.info('Inserting template language relation ' + templateId + ' - ' + languageId + ' into database');

  var resolver    = Promise.pending();
  var insertQuery = 'INSERT INTO Templates_Languages(templates_id, languages_id) ' +
                    'VALUES(' + templateId + ', ' + languageId + ');';
  var connection;

  logger.debug(insertQuery);

  pool.getConnectionAsync()
    .then(function runQuery(_connection) {
      connection = Promise.promisifyAll(_connection);
      return connection.queryAsync(insertQuery);
    })
    .then(function handleResult(rows) {
      connection.release();
      logger.info('Template language relation inserted: ' + rows[0]);
      resolver.resolve(true);
    })
    .catch(function handleError(error) {
      resolver.reject(error);
    })
    .done();

  return resolver.promise;
}

/**
 * Inserts an array of templates languages relations into database
 * @param  {array}  templatesLanguages Array of ordered pairs being the first 
 *                                     one the templateId and the second the languageId
 * @return {Promise}                   The promise to resolve
 */
function insertTemplatesLanguages(templatesLanguages) {
  logger.info('Inserting templates languages relations into database');

  var resolver      = Promise.pending();

  async.each(templatesLanguages, function (templateLanguage, callback) {

    insertTemplateLanguage(templateLanguage[0], templateLanguage[1])
      .then(function handleResult() {
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
    resolver.resolve(true);
  });

  return resolver.promise;
}

module.exports = {
  insertTemplatesLanguages  : insertTemplatesLanguages,
  insertTemplateLanguage    : insertTemplateLanguage
};