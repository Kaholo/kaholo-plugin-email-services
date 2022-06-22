const kaholoPluginLibrary = require("@kaholo/plugin-library");
const nodemailerSendgrid = require("nodemailer-sendgrid");
const nodemailer = require("nodemailer");
const { sendWithTransport } = require("./mail-service");

function send({
  service,
  username,
  password,
  apiKey,
  ...mailingDetails
}) {
  let transportCreationOptions;

  if (service === "SendGrid") {
    transportCreationOptions = nodemailerSendgrid({
      apiKey,
    });
  } else {
    transportCreationOptions = { service };

    if (apiKey) {
      transportCreationOptions.auth = { api_key: apiKey };
    } else {
      transportCreationOptions.auth = {
        user: username,
        pass: password,
      };
    }
  }

  const transport = nodemailer.createTransport(transportCreationOptions);
  return sendWithTransport(transport, mailingDetails);
}

module.exports = kaholoPluginLibrary.bootstrap({
  send,
});
