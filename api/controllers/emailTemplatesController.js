module.exports = {
  getEmailTemplatesBySlugHandler      : getEmailTemplatesBySlugHandler,
  updateEmailTemplatesHandler         : updateEmailTemplatesHandler,
  deleteEmailTemplatesHandler         : deleteEmailTemplatesHandler,
  getEmailTemplatesCollectionHandler  : getEmailTemplatesCollectionHandler,
  createEmailTemplatesHandler         : createEmailTemplatesHandler
};

/**
 * Responds the requested email template if exists
 * @param  {object}   req   Express request object
 * @param  {object}   res   Express response object
 * @param  {function} next  Express next function
 */
function getEmailTemplatesBySlugHandler(req, res, next) {
  var burnedResponse = {
    name    : 'Welcome Email',
    slug    : 'welcome-email',
    subject : 'Welcome to Fleetster',
    html    : '<h1>Welcome {{firstName}} {{lastName}}</h1>',
    text    : 'Welcome {{firstName}} {{lastName}}',
    lan     : [
      'en-GB'
    ],
    attachments: [
      {
        type    : 'text/plain',
        name    : 'myfile.txt',
        content : 'ZXhhbXBsZSBmaWxl'
      }
    ],
    createdAt: '2015-07-16T09:35:00z',
    updatedAt: '2015-07-16T09:35:00z'
  };

  res.json(burnedResponse);
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
function getEmailTemplatesCollectionHandler(req, res) {
  var burnedResponse = [
    {
      name    : 'Welcome Email',
      slug    : 'welcome-email',
      subject : 'Welcome to Fleetster',
      html    : '<h1>Welcome {{firstName}} {{lastName}}</h1>',
      text    : 'Welcome {{firstName}} {{lastName}}',
      lan     : [
        'en-GB'
      ],
      attachments: [
        {
          type    : 'text/plain',
          name    : 'myfile.txt',
          content : 'ZXhhbXBsZSBmaWxl'
        }
      ],
      createdAt: '2015-07-16T09:35:00z',
      updatedAt: '2015-07-16T09:35:00z'
    }
  ];

  res.json(burnedResponse);
}

/**
 * Creates an email temaplate
 * @param  {object}   req   Express request object
 * @param  {object}   res   Express response object
 * @param  {function} next  Express next function
 */
function createEmailTemplatesHandler(req, res) {
  var burnedResponse = {
    status  : 'Created',
    message : 'Email template successfully created',
    slug    : 'welcome-email'
  };

  res.status(201);
  res.json(burnedResponse);
}