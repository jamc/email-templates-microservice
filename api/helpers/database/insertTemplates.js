var logger      = require('logger-initializer')();
var Promise     = require('bluebird');
var createSlug  = require('slug');
var pool        = require('./connectionPool').pool1;
var moment      = require('moment');

module.exports = function insertTemplates(templateInfo) {
  logger.info('Inserting a template into database');

  var resolver    = Promise.pending();
  var slug        = createSlug(templateInfo.name, {lower: true});
  var createQuery = 'INSERT INTO Templates' +
                    '(slug, name, subject, html, text, created_at) ' +
                    'VALUES (' +
                    '"' + slug + '", ' +
                    '"' + templateInfo.name + '", ' +
                    '"' + templateInfo.subject + '", ' +
                    '"' + templateInfo.html + '", ' +
                    '"' + templateInfo.text + '", ' +
                    '"' + moment().format('YYYY-MM-DD HH:mm:ss') + '");';

  logger.debug(createQuery);

  pool.getConnection(function(error, connection) {
    if (error) {
      return resolver.reject(error);
    }
    connection.query(createQuery, function(error, rows) {
      if (error) {
        return resolver.reject(error);
      }
      connection.release();
      logger.info('Template inserted to database: ' + slug);
      resolver.resolve(slug);
    });
  });
  return resolver.promise;
};