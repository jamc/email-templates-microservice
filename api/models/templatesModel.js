var logger      = require('logger-initializer')();
var Promise     = require('bluebird');
var createSlug  = require('slug');
var pool        = require('./connectionPool').pool1;
var moment      = require('moment');

module.exports = {
  insertTemplates: insertTemplates
};

/**
 * Inserts a template to database
 * @param  {object} templateInfo The template information
 * @return {Promise}             The promise to resolve
 */
function insertTemplates(templateInfo) {
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
      logger.info('Template inserted to database: ' + insertedResponse);
      resolver.resolve(insertedResponse);
    })
    .catch(function handleError(error) {
      resolver.reject(error);
    })
    .done();

  return resolver.promise;
}