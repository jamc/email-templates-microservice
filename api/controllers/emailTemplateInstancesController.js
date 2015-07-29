/**
 * Creates an email temaplate instance
 * @param  {object}   req   Express request object
 * @param  {object}   res   Express response object
 * @param  {function} next  Express next function
 */
function createEmailTemplateInstancesHandler(req, res) {
  var burnedResponse = {
    subject : 'Welcome to Fleetster',
    html    : '<h1>Welcome First Last</h1>',
    text    : 'Welcome First Last',
    attachments: [
      {
        type    : 'text/plain',
        name    : 'myfile.txt',
        content : 'ZXhhbXBsZSBmaWxl'
      }
    ]
  };

  res.json(burnedResponse);
}

module.exports = {
  createEmailTemplateInstancesHandler : createEmailTemplateInstancesHandler
};