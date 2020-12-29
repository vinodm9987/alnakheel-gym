const { logger: { logger }, config: { TWILLIO: { ACCOUNT_ID, AUTH_TOKEN, SERVICE_ID } } } = require('../../config');

const twillio = require('twilio')(ACCOUNT_ID, AUTH_TOKEN);


const { Messaging } = require('../model')


exports.sendBulkMessage = (body, toBinding, messageId) => {
  twillio.notify.services(SERVICE_ID)
    .notifications.create({ toBinding, body })
    .then(notification => {
      logger.info(notification);
    })
    .catch(async error => {
      logger.error(error);
      await Messaging.findByIdAndUpdate(messageId, { status: "Failed" });
    });
}



