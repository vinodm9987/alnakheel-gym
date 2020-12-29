const { setTime } = require('../utils/timeFormate.util');

const { sendNotification, sendMultipleNotification } = require('../utils/notification')

const { logger: { logger }, config: { NO_MOBILE_VIEW } } = require('../../config');

const { Notification, Credential, Designation } = require('../model');

const { emitNotification } = require('../socket/emitter');

module.exports = {

    createNotification: async (mobile, web, message) => {
        try {
            const { notification } = await Credential.findById(web.userId).lean();
            if (notification) {
                const newMobile = new Notification(mobile);
                const newWeb = new Notification(web);
                await newMobile.save();
                await newWeb.save();
                await sendNotification(message);
                const newResponse = await Notification.find({ userId: web.userId }).lean();
                emitNotification(newResponse, web.userId.toString());
            }
        } catch (error) {
            logger.error(error)
        }
    },


    webObject: (title, webPath, userId = "", webIcon) => {
        return {
            title, webPath, userId, webIcon,
            time: new Date(),
            date: setTime(new Date()),
            notificationType: "Web"
        };
    },

    mobileObject: (title, mobileCompo, userId, icon, color, backgroundColor) => {
        return {
            title, mobileCompo, userId,
            icon, color, backgroundColor,
            time: new Date(),
            date: setTime(new Date()),
            notificationType: "Mobile"
        };
    },

    createForAllEmployees: async (webObject) => {
        const designations = await Designation.find({ designationName: { $in: NO_MOBILE_VIEW } }, { _id: 1 }).lean();
        const designationId = designations.map(doc => doc._id);
        const users = await Credential.find({ designation: { $in: designationId }, notification: true }).lean();
        let array = [];
        for (let i = 0; i < users.length; i++) {
            if (users[i].notification) {
                let newWeb = Object.assign({}, webObject);
                newWeb["userId"] = users[i]._id;
                array.push(newWeb);
            }
        }
        const response = await Notification.insertMany(array);
        users.forEach(async doc => {
            if (doc.notification) {
                const newResponse = await Notification.find({ userId: doc._id })
                emitNotification(newResponse, doc._id.toString());
            }
        });
        return response;
    },

    createBroadcast: async (webObject, mobileObject, message, designation, ) => {
        let queryCond = {};
        if (designation !== 'all') queryCond["designationName"] = designation;
        const users = await Credential.find(queryCond).lean();
        let token = [], array = [];
        for (let i = 0; i < users.length; i++) {
            if (users[i].reactToken && users[i].notification) {
                token.push(users[i].reactToken);
                let obj1 = Object.assign({}, mobileObject);
                obj1["userId"] = users[i]._id;
                array.push(obj1);
                let obj3 = Object.assign({}, webObject);
                obj3["userId"] = users[i]._id;
                array.push(obj3);
            } else if (users[i].notification) {
                let obj2 = Object.assign({}, webObject);
                obj2["userId"] = users[i]._id;
                array.push(obj2);
            }
        }
        const response = await Notification.insertMany(array);
        users.forEach(async doc => {
            if (doc.notification) {
                const newResponse = await Notification.find({ userId: doc._id })
                emitNotification(newResponse, doc._id.toString());
            }
        });
        await sendMultipleNotification(message, token);
        return response;
    },

    createBroadcastForMember: async (webObject, mobileObject, message, users) => {
        let token = [], array = [];
        for (let i = 0; i < users.length; i++) {
            if (users[i].reactToken && users[i].notification) {
                token.push(users[i].reactToken);
                let obj1 = Object.assign({}, mobileObject);
                obj1["userId"] = users[i]._id;
                array.push(obj1);
                let obj3 = Object.assign({}, webObject);
                obj3["userId"] = users[i]._id;
                array.push(obj3);
            } else if (users[i].notification) {
                let obj2 = Object.assign({}, webObject);
                obj2["userId"] = users[i]._id;
                array.push(obj2);
            }
        }
        const response = await Notification.insertMany(array);
        users.forEach(async doc => {
            if (doc.notification) {
                const newResponse = await Notification.find({ userId: doc._id })
                emitNotification(newResponse, doc._id.toString());
            }
        });
        await sendMultipleNotification(message, token);
        return response;
    }

};