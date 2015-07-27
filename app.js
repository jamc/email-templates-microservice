var SwaggerExpress        = require('swagger-express-mw');
var app                   = require('express')();
var logger                = require('logger-initializer');

var config = {
  appRoot: __dirname
};

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // Initialize logger
  var logger = require('logger-initializer')(swaggerExpress.config.logger.logLevel);

  // Initialize database connections pool
  var databasePool = require('./api/helpers/models/connectionPool');
  databasePool.init('pool1', swaggerExpress.config.database);

  // Install Swagger Express Middleware
  swaggerExpress.register(app);

  // Register middlewares
  app.use(require('not-found-mw'));
  app.use(require('unprocessable-entity-mw'));
  app.use(require('internal-error-mw'));

  var port = process.env.PORT || 10010;
  app.listen(port);

  logger.info('Email templates microservice started on port ' + port);
});
