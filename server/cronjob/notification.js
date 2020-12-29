const { FireBase: { sendNotification, notificationObject } } = require('../utils');
const cronjob = require('node-cron');

const { MemberReminder } = require('../model')


exports.notificationCronjob = () => {
    cronjob.schedule("* * * * *", async () => {
        let response = await MemberReminder.find().populate('memberId').populate({ path: "memberId", populate: { path: "credentialId" } }).lean();
        for (let index = 0; index < response.length; index++) {
            if (response[index].remindType === 'time') {
               for (let i = 0; i < response[index].reminderArray.length; i++) {
                   if(new Date(response[index].reminderArray[i]).setMilliseconds(0) === new Date(new Date().setMilliseconds(0)).setSeconds(0)){
                    let token = response[index].memberId.credentialId.reactToken
                    let obj = notificationObject(token, 'Stay Hydrated', "It's the right time to drink water !");
                    await sendNotification(obj);
                   }
               }
            } else if (response[index].remindType === 'interval') {
                for (let j = 0; j < response[index].intervalTime.length; j++) {
                    if (new Date(response[index].intervalTime[j]).setMilliseconds(0) === new Date(new Date().setMilliseconds(0)).setSeconds(0) ) {
                        let token = response[index].memberId.credentialId.reactToken
                        let obj = notificationObject(token, 'Stay Hydrated', "It's the right time to drink water !");
                        await sendNotification(obj);
                    }
                }
            }
        }
    });
}
