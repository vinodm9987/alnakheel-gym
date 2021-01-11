const { Messaging } = require('../../model');

const { SMS: { sendBulkMessage }, Mailer: { sendBulkMail } } = require('../../utils')

const { logger: { logger }, handler: { successResponseHandler, errorResponseHandler } } = require('../../../config');

const { setTime } = require('../../utils/timeFormate.util');
const { auditLogger } = require('../../middleware/auditlog.middleware');


exports.sendSms = async (req, res) => {
  const { message, numbers } = req.body
  req.body['status'] = "Success";
  req.body['date'] = setTime(new Date());
  req.body['time'] = new Date();
  const newMessage = new Messaging(req.body);
  await sendBulkMessage(message, numbers, newMessage._id);
  newMessage.save()
    .then(response => {
      auditLogger(req, 'Success')
      successResponseHandler(res, response, "successfully send message")
    })
    .catch((error) => {
      logger.error(error);
      auditLogger(req, 'Failed')
      errorResponseHandler(res, error)
    });
}




exports.sendMail = async (req, res) => {
  const { subject, emailMessage, emails } = req.body;
  req.body['status'] = "Success";
  req.body['date'] = setTime(new Date());
  req.body['time'] = new Date();
  const newMessage = new Messaging(req.body);
  await sendBulkMail(subject, emailMessage, emails, newMessage._id);
  newMessage.save()
    .then(response => {
      auditLogger(req, 'Success')
      successResponseHandler(res, response, "successfully send mail")
    })
    .catch((error) => {
      logger.error(error);
      auditLogger(req, 'Failed')
      errorResponseHandler(res, error)
    })
}



exports.getMessages = async (req, res) => {
  let query = {};
  const { messageCategory, memberCategory } = req.body;
  (messageCategory && messageCategory !== 'all') && (query['messageCategory'] = messageCategory);
  (memberCategory && memberCategory !== 'all') && (query['memberCategory'] = memberCategory);
  Messaging.find(query).populate('members')
    .populate({ path: 'members', populate: { path: 'credentialId' } })
    .then((response) => successResponseHandler(res, response, 'successfully sent all mails !'))
    .catch(error => {
      logger.error(error);
      errorResponseHandler(res, error, 'failed to send all mails')
    })
}

