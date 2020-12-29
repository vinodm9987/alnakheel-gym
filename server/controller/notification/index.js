/**  
 * utils.
*/

const { logger: { logger }, handler: { successResponseHandler, errorResponseHandler } } = require('../../../config')

/**
 * models.
*/

const { Notification } = require('../../model');


/**
 *  notification apis
*/


exports.getUserNotification = (req, res) => {
    Notification.find({ userId: req.body.userId, notificationType: req.body.notificationType })
    .sort({created_at: -1})
    .then(response => {
        return successResponseHandler(res, response, "user all mobile notifications ! ")
    }).catch(error => {
        logger.error(error);
        return errorResponseHandler(res, error, "failed to get notifications");
    });
}




exports.deleteNotification = async (req, res) => {
    Notification.remove({ userId: req.body.userId, }).then((response) => {
        return successResponseHandler(res, response, "successfully clear all !");
    }).catch(error => {
        logger.error(error);
        return errorResponseHandler(res, error, "failed to get notifications");
    });
};

exports.readNotification = (req, res) => {
    Notification.update({ _id: { $in: req.body.ids } }, { $set: { read: true } }, { multi: true })
        .then((response) => {
            return successResponseHandler(res, response, "successfully read !");
        }).catch(error => {
            logger.error(error);
            return errorResponseHandler(res, error, "failed to read notifications !");
        });
};