module.exports = {
  getEmailTemplatesBySlugHandler: getEmailTemplatesBySlugHandler,
  updateEmailTemplatesHandler   : updateEmailTemplatesHandler
};


function getEmailTemplatesBySlugHandler(req, res) {
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

function updateEmailTemplatesHandler(req, res) {
  var burnedResponse = {
    status  : 'OK',
    message : 'Email template successfully updated'
  };

  res.json(burnedResponse);
}