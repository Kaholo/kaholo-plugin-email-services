const kaholoPluginLibrary = require("@kaholo/plugin-library");
const MailService = require("./mail-service");

function send({
  service,
  username,
  password,
  apiKey,
  to,
  from,
  subject,
  cc,
  bcc,
  text,
  html,
  attachmentPaths,
}) {
  const mailService = new MailService(service, username, password, apiKey);

  return mailService.send({
    to,
    from,
    subject,
    cc,
    bcc,
    text,
    html,
    attachmentPaths,
  });
}

module.exports = kaholoPluginLibrary.bootstrap({
  send,
});
