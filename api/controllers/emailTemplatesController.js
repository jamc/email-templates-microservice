var Promise = require('bluebird');
var logger  = require('logger-initializer')();
var _       = require('lodash');

var templatesModel          = require('../models/templatesModel');
var languagesModel          = require('../models/languagesModel');
var templatesLanguagesModel = require('../models/templatesLanguagesModel');
var attachmentsModel        = require('../models/attachmentsModel');

/**
 * Responds the requested email template if exists
 * @param  {object}   req   Express request object
 * @param  {object}   res   Express response object
 * @param  {function} next  Express next function
 */
function getEmailTemplatesBySlugHandler(req, res, next) {

  var params = req.swagger.params;

  templatesModel.getTemplate(params.slug.value, params.fields.value)
    .then(function handleResult(template) {
      var responseBody = template;
      if (!template) {
        res.status(404);
        responseBody = {
          status  : 'Not Found',
          message : 'The requested resource does not exists'
        };
      }
      res.json(responseBody);
    })
    .catch(function handleError(err) {
      next(err);
    });
}

/**
 * Updates the email template information
 * @param  {object}   req   Express request object
 * @param  {object}   res   Express response object
 * @param  {function} next  Express next function
 */
function updateEmailTemplatesHandler(req, res) {
  var burnedResponse = {
    status  : 'OK',
    message : 'Email template successfully updated'
  };

  res.json(burnedResponse);
}

/**
 * Deletes an email temaplate
 * @param  {object}   req   Express request object
 * @param  {object}   res   Express response object
 * @param  {function} next  Express next function
 */
function deleteEmailTemplatesHandler(req, res) {
  var burnedResponse = {
    status  : 'OK',
    message : 'Email template successfully deleted'
  };

  res.json(burnedResponse);
}

/**
 * Gets a collection of email templates
 * @param  {object}   req   Express request object
 * @param  {object}   res   Express response object
 * @param  {function} next  Express next function
 */
function getEmailTemplatesCollectionHandler(req, res, next) {
  var params = req.swagger.params;

  templatesModel.getTemplates(params.fields.value)
    .then(function handleResult(templates) {
      res.json(templates);
    })
    .catch(function handleError(err) {
      next(err);
    });
}

/**
 * Creates an email temaplate
 * @param  {object}   req   Express request object
 * @param  {object}   res   Express response object
 * @param  {function} next  Express next function
 */
function createEmailTemplatesHandler(req, res, next) {

  var template;

  templatesModel.insertTemplate(req.body)
    .then(function insertLanguages(templateInfo) {
      template = templateInfo;
      return languagesModel.insertLanguages(req.body.lan);
    })
    .then(function insertTemplatesLanguages(languagesIds) {
      var relations = [];
      _.forEach(languagesIds, function (languageId) {
        relations.push([template.id, languageId]);
      });
      return templatesLanguagesModel.insertTemplatesLanguages(relations);
    })
    .then(function insertAttachments() {
      if (!req.body.attachments) {
        return;
      }
      return attachmentsModel.insertAttachments(template.id, req.body.attachments);
    })
    .then(function handleResults() {
      var creationResponse = {
        status  : 'Created',
        message : 'Email template successfully created',
        slug    : template.slug
      };

      logger.info('Sending 201 to client');

      res.status(201);
      res.json(creationResponse);
    })
    .catch(function errorOcurred(error) {
      next(error);
    })
    .done();
}

module.exports = {
  getEmailTemplatesBySlugHandler      : getEmailTemplatesBySlugHandler,
  updateEmailTemplatesHandler         : updateEmailTemplatesHandler,
  deleteEmailTemplatesHandler         : deleteEmailTemplatesHandler,
  getEmailTemplatesCollectionHandler  : getEmailTemplatesCollectionHandler,
  createEmailTemplatesHandler         : createEmailTemplatesHandler
};