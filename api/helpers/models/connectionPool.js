var mysql   = require('mysql');
var logger  = require('logger-initializer')();
var Promise = require('bluebird');

module.exports = {
  init: function(name, options) {
    logger.info('Database connections pool initialized');
    return module.exports[name] = Promise.promisifyAll(mysql.createPool(options));
  }
};