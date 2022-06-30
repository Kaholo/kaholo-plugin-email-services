const nodemailerSendgrid = require("nodemailer-sendgrid");
const nodemailer = require("nodemailer");
const path = require("path");

const NEW_LINE_WITH_OPTIONAL_COMMA_REGEX = /(?:,\s*)?\n/g;
const COMMA_WITH_WHITESPACE_REGEX = /\s*,\s*/g;

class MailService {
  static FIELDS_WITH_MULTILINE_SUPPORT = ["bcc", "to", "cc"];

  constructor(service, username, password, apiKey) {
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

    this.transport = nodemailer.createTransport(transportCreationOptions);
  }

  send({
    to,
    from,
    subject,
    cc,
    bcc,
    text,
    html,
    attachmentPaths,
  }) {
    const correctedMailOptions = {
      to,
      from,
      subject,
      cc,
      bcc,
      text,
      html,
    };

    MailService.FIELDS_WITH_MULTILINE_SUPPORT.forEach((field) => {
      if (correctedMailOptions[field]) {
        correctedMailOptions[field] = correctedMailOptions[field]
          .trim()
          .replace(NEW_LINE_WITH_OPTIONAL_COMMA_REGEX, ", ")
          .replace(COMMA_WITH_WHITESPACE_REGEX, ", ");
      }
    });

    if (attachmentPaths?.length) {
      correctedMailOptions.attachments = attachmentPaths.map((attachmentPath) => ({
        filename: path.basename(attachmentPath),
        path: attachmentPath,
      }));
    }

    return this.transport.sendMail(correctedMailOptions);
  }
}

module.exports = MailService;
