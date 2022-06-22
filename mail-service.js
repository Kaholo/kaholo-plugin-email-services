const path = require("path");

const FIELDS_WITH_MULTILINE_SUPPORT = ["bcc", "to", "cc"];

const NEW_LINE_WITH_OPTIONAL_COMMA_REGEX = /(?:,\s*)?\n/g;
const COMMA_WITH_WHITESPACE_REGEX = /\s*,\s*/g;

function sendWithTransport(transporter, {
  attachmentPaths,
  ...mailOptions
}) {
  const correctedMailOptions = { ...mailOptions };

  FIELDS_WITH_MULTILINE_SUPPORT.forEach((field) => {
    if (correctedMailOptions[field]) {
      correctedMailOptions[field] = correctedMailOptions[field]
        .trim()
        .replace(NEW_LINE_WITH_OPTIONAL_COMMA_REGEX, ", ")
        .replace(COMMA_WITH_WHITESPACE_REGEX, ", ");
    }
  });

  if (attachmentPaths.length) {
    correctedMailOptions.attachments = attachmentPaths.map((attachmentPath) => ({
      filename: path.basename(attachmentPath),
      path: attachmentPath,
    }));
  }

  return transporter.sendMail(correctedMailOptions);
}

module.exports = {
  sendWithTransport,
};
