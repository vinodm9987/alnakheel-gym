const { Notification } = require('../model');
const { emitNotification, } = require('./emitter');
const { notification: { readRequest } } = require('./events');

module.exports = {

    readRequest: async (socket) => {
        socket.on(readRequest, async ({ ids, userId }) => {
            await Notification.update({ _id: { $in: ids } }, { $set: { read: true } }, { multi: true });
            const response = await Notification.find({ userId }).lean();
            emitNotification(response, userId);
        })
    }

}