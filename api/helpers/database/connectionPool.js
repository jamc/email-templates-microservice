var mysql   = require('mysql');
var logger  = require('logger-initializer')();

module.exports = {
  init: function(name, options) {
    logger.info('Database connections pool initialized');
    return module.exports[name] = mysql.createPool(options);
  }
};