var unprocessableEntityMW = require('unprocessable-entity-mw');
var notFoundMW            = require('not-found-mw');
var internalErrorMW       = require('internal-error-mw');
var SwaggerExpress        = require('swagger-express-mw');
var app                   = require('express')();
var logger                = require('logger-initializer');

module.exports = app; // for testing

var config = {
  appRoot: __dirname // required config
};

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  logger = logger(swaggerExpress.config.logger.logLevel);

  // install middleware
  swaggerExpress.register(app);

  app.use(notFoundMW);
  app.use(unprocessableEntityMW);
  app.use(internalErrorMW);

  var port = process.env.PORT || 10010;
  app.listen(port);

  logger.info('Email templates microservice started on port ' + port);
});
