const sgMail = require('@sendgrid/mail')

const { config: { EMAIL, TWILLIO: { MAIL_API } }, logger: { logger } } = require('../../config');

const { MailerHtml: { verifyCode, passwordGenerated } } = require('../constant')


sgMail.setApiKey(MAIL_API);

exports.sendMail = (email, code, options = {}) => {

  let mailOptions = {
    from: EMAIL,
    to: email,
    subject: 'SkoolGo password System',
    text: 'this is your verification code for gym got ',
    html: verifyCode(code)
  }

  sgMail.send(mailOptions)
    .then((response) => { logger.info(response) })
    .catch(async error => {
      logger.error(error);
    })
};


exports.sendMailForPassword = (email, password, userName, options = {}) => {
  let mailOptions = {
    from: EMAIL,
    to: email,
    subject: 'SkoolGo password System',
    text: 'this is your password for gym go login',
    html: passwordGenerated(password, userName)
  };

  sgMail.send(mailOptions)
    .then((response) => { logger.info(response) })
    .catch(async error => {
      logger.error(error);
    })
}


exports.sendBulkMail = (subject, body, emails) => {
  const mailOptions = { from: EMAIL, to: emails, subject: subject, text: body };
  sgMail.send(mailOptions)
    .then((response) => { logger.info(response) })
    .catch(async error => {
      logger.error(error);
    })
}
