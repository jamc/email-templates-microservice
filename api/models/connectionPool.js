var mysql   = require('mysql');
var logger  = require('logger-initializer')();
var Promise = require('bluebird');

module.exports = {
  init: function (name, options) {
    logger.info('Database connections pool initialized');
    module.exports[name] = Promise.promisifyAll(mysql.createPool(options));
    return module.exports[name];
  }
};