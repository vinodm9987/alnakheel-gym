const fcm = require('fcm-notification');
const path = require('../../server/firebase.json');
const FCM = new fcm(path);
const { logger: { logger } } = require('../../config')


exports.sendNotification = (message) => {
    FCM.send(message, (err, response) => {
        if (err) {
            console.log("TCL: exports.sendNotification -> err", err)
            logger.error(err);
        } else {
            return response
        }
    });
};

exports.sendMultipleNotification = (message, tokens) => {
    FCM.sendToMultipleToken(message, tokens, (err, response) => {
        if (err) {
            console.log("TCL: exports.sendNotification -> err", err)
            logger.error(err);
        } else {
            return response
        }
    });
};

exports.notificationObject = (token, title, body) => {
    return {
        data: { score: '850', time: '2:45' },
        notification: { title, body, image: 'https://images.pexels.com/photos/416528/pexels-photo-416528.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' },
        token
    }
};



exports.notificationObjectWithoutImg = (title, body, data, token) => {
    return {
        data, token,
        notification: { title, body },
    }
};



exports.notificationObjectWithoutToken = (title, body, data) => {
    return {
        data, notification: { title, body },
    }
};