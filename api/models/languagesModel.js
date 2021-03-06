var logger  = require('logger-initializer')();
var Promise = require('bluebird');
var async   = require('async');
var _       = require('lodash');
var pool    = require('./connectionPool').pool1;
var moment  = require('moment');

/**
 * Get all languages from a given template
 * @param  {integer} templateId The template id
 * @return {Promise}            The promise to resolve
 */
function getLanguages(templateId) {
  logger.info('Getting languages from template id ' + templateId + ' from database');

  var resolver    = Promise.pending();
  var selectQuery = 'SELECT L.code FROM Languages AS L ' +
                    'INNER JOIN Templates_Languages AS TL ON TL.languages_id = L.id ' +
                    'WHERE TL.templates_id = ' + templateId + ';';
  var connection;

  logger.debug(selectQuery);

  pool.getConnectionAsync()
    .then(function runQuery(_connection) {
      connection = Promise.promisifyAll(_connection);
      return connection.queryAsync(selectQuery);
    })
    .then(function handleResult(rows) {
      connection.release();
      logger.info('Languages found', rows[0]);
      var languages = [];
      _.forEach(rows[0], function processLanguages(language) {
        languages.push(language.code);
      });
      resolver.resolve(languages);
    })
    .catch(function handleError(error) {
      resolver.reject(error);
    })
    .done();

  return resolver.promise;
}

/**
 * Get a language from database based on the given code
 * @param  {string}   code The language code
 * @return {Promise}       The promise to resolve
 */
function getLanguage(code) {
  logger.info('Getting language ' + code + ' from database');

  var resolver            = Promise.pending();
  var selectLanguageQuery = 'SELECT * FROM Languages WHERE code = "' + code + '";';
  var connection;

  logger.debug(selectLanguageQuery);

  pool.getConnectionAsync()
    .then(function runQuery(_connection) {
      connection = Promise.promisifyAll(_connection);
      return connection.queryAsync(selectLanguageQuery);
    })
    .then(function handleResult(rows) {
      connection.release();
      logger.info('Language found', rows[0]);
      if (rows[0][0]) {
        resolver.resolve(rows[0][0]);
      } else {
        resolver.resolve(null);
      }
    })
    .catch(function handleError(error) {
      resolver.reject(error);
    })
    .done();

  return resolver.promise;
}

/**
 * Insert a language to database
 * @param  {string}   code The language code
 * @return {Promise}       The promise to resolve
 */
function insertLanguage(code) {
  logger.info('Inserting language ' + code + ' to database');

  var resolver            = Promise.pending();
  var insertLanguageQuery = 'INSERT INTO Languages(code) VALUES("' + code + '");';
  var connection;

  logger.debug(insertLanguageQuery);

  pool.getConnectionAsync()
    .then(function runQuery(_connection) {
      connection = Promise.promisifyAll(_connection);
      return connection.queryAsync(insertLanguageQuery);
    })
    .then(function handleResult(rows) {
      connection.release();
      logger.info('Language inserted: ' + rows[0].insertId);
      resolver.resolve(rows[0].insertId);
    })
    .catch(function handleError(error) {
      resolver.reject(error);
    })
    .done();

  return resolver.promise;
}

/**
 * Inserts an array of languages and return the ids
 * If the language alredy exists, it will return the id
 * @param  {array}  languages The languages to insert
 * @return {Promise}          The promise to resolve
 */
function insertLanguages(languages) {
  logger.info('Inserting languages into database');

  var resolver      = Promise.pending();
  var languagesIds  = [];

  async.each(languages, function (languageCode, callback) {

    getLanguage(languageCode)
      .then(function (language) {
        if (!!language) {
          return language.id;
        }
        return insertLanguage(languageCode);
      })
      .then(function handleResult(id) {
        languagesIds.push(id);
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
    languagesIds.sort(function (a, b) { return a - b; });
    resolver.resolve(languagesIds);
  });

  return resolver.promise;
}

module.exports = {
  insertLanguages : insertLanguages,
  insertLanguage  : insertLanguage,
  getLanguage     : getLanguage,
  getLanguages    : getLanguages
};