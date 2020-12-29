
/**  
 * service and constant.
*/

const { Announcement, Packages, Members, Classes, TimeMobile, Stock, DetailsIcon } = require('../constant/mobileIcon');

const { AnnouncementWeb, Package, Stocks, Member,
    ClassWeb, Product, Feedback, Details, TimeWeb } = require('../constant/webIcon');

const { NewAnnouncement, NewMemberRegister, MemberPackageExpired,
    PackageExpiry, MemberPackageExpiry, PackageExpired, ClassCapacity,
    ClassFullBooked, StockExpiry, StockExpired, StockQuantity,
    StockFinish, MemberOrderOnline, AssetsExpiry, AssetsExpired,
    ContractExpiry, ContractExpired, EmployeeVisaExpiry, NewFeedback,
    FreezeAction, NewEvent, NewMemberAssign, NewClassAssign, FeedbackReply,
    NewClassCreate, ClassRegistration, GymTimeSpent, SalesOffer,
    NewDietPlan, NewWorkOut, PointEarn, RedeemCompleted, FreezeAccept, PackageRenewal } = require('../constant/messageRedirect');

const { createForAllEmployees, createNotification, createBroadcast,
    mobileObject, webObject } = require('../notification/service');

const { notificationObjectWithoutToken, notificationObjectWithoutImg } = require("../utils/notification")


/**  
 * utils.
*/

const { logger: { logger }, } = require('../../config')


const { Credential } = require("../model")


module.exports = {


    newMemberRegister: async (userId) => {
        try {
            const { title, webPath } = NewMemberRegister();
            const obj = webObject(title, webPath, userId, Member);
            const response = await createForAllEmployees(obj);
            return response;
        } catch (error) {
            logger.error(error);
        }
    },

    memberExpired: async (userId) => {
        try {
            const { title, webPath } = MemberPackageExpired();
            const obj = webObject(title, webPath, userId, Member);
            const response = await createForAllEmployees(obj);
            return response;
        } catch (error) {
            logger.error(error);
        }
    },

    memberAboutToExpiry: async (userId) => {
        try {
            const { title, webPath } = MemberPackageExpiry();
            const obj = webObject(title, webPath, userId, Member);
            const response = await createForAllEmployees(obj);
            return response;
        } catch (error) {
            logger.error(error);
        }
    },

    classCapacity: async (userId, branch, className) => {
        try {
            const { title, webPath } = ClassCapacity(className, branch, ClassWeb);
            const obj = webObject(title, webPath, userId);
            const response = await createForAllEmployees(obj);
            return response;
        } catch (error) { logger.error(error); }
    },

    classFullBooked: async (userId, branch, className) => {
        try {
            const { title, webPath } = ClassFullBooked(className, branch, ClassWeb);
            const obj = webObject(title, webPath, userId);
            const response = await createForAllEmployees(obj);
            return response;
        } catch (error) { logger.error(error); }
    },

    stockExpiry: async (stockName, branch, userId = "") => {
        try {
            const { title, webPath } = StockExpiry(stockName, branch);
            const obj = webObject(title, webPath, userId, Stocks);
            const response = await createForAllEmployees(obj);
            return response;
        } catch (error) { logger.error(error); }
    },

    stockExpired: async (stockName, branch, userId = "") => {
        try {
            const { title, webPath } = StockExpired(stockName, branch);
            const obj = webObject(title, webPath, userId, Stocks);
            const response = await createForAllEmployees(obj);
            return response;
        } catch (error) { logger.error(error); }
    },

    stockQuantity: async (stockName, branch) => {
        try {
            const { title, webPath } = StockQuantity(stockName, branch);
            const obj = webObject(title, webPath, "", Stocks);
            const response = await createForAllEmployees(obj);
            return response;
        } catch (error) { logger.error(error); }
    },

    stockFinish: async (stockName, branch) => {
        try {
            const { title, webPath } = StockFinish(stockName, branch);
            const obj = webObject(title, webPath, "", Stocks);
            const response = await createForAllEmployees(obj);
            return response;
        } catch (error) { logger.error(error); }
    },

    memberOrderOnline: async () => {
        try {
            const { title, webPath } = MemberOrderOnline();
            const obj = webObject(title, webPath, "", Member);
            const response = await createForAllEmployees(obj);
            return response;
        } catch (error) { logger.error(error); }
    },

    assetsExpiry: async (assetName, branch, id) => {
        try {
            const { title, webPath } = AssetsExpiry(assetName, branch, id);
            const obj = webObject(title, webPath, "", Product);
            const response = await createForAllEmployees(obj);
            return response;
        } catch (error) { logger.error(error); }
    },

    assetsExpired: async (assetName, branch, id) => {
        try {
            const { title, webPath } = AssetsExpired(assetName, branch, id);
            const obj = webObject(title, webPath, "", Product);
            const response = await createForAllEmployees(obj);
            return response;
        } catch (error) { logger.error(error); }
    },

    contractExpiry: async (contract, contractId) => {
        try {
            const { title, webPath } = ContractExpiry(contract, contractId);
            const obj = webObject(title, webPath, "", Product);
            const response = await createForAllEmployees(obj);
            return response;
        } catch (error) { logger.error(error); }
    },

    contractExpired: async (contract, contractId) => {
        try {
            const { title, webPath } = ContractExpired(contract, contractId);
            const obj = webObject(title, webPath, "", Product);
            const response = await createForAllEmployees(obj);
            return response;
        } catch (error) { logger.error(error); }
    },

    employeeVisaExpiry: async (name, id) => {
        try {
            const { title, webPath } = EmployeeVisaExpiry(name, id);
            const obj = webObject(title, webPath, "", Details);
            const response = await createForAllEmployees(obj);
            return response;
        } catch (error) { logger.error(error); }
    },

    newFeedbackAdmin: async () => {
        try {
            const { title, webPath } = NewFeedback();
            const obj = webObject(title, webPath, "", Feedback);
            const response = await createForAllEmployees(obj);
            return response;
        } catch (error) { logger.error(error); }
    },

    freezeAction: async (count) => {
        try {
            if (count) {
                const { title, webPath } = FreezeAction(count);
                const obj = webObject(title, webPath, "", Details);
                const response = await createForAllEmployees(obj);
                return response;
            }
        } catch (error) { logger.error(error); }
    },



    /**
     * Common broadcast 
    */


    announcementNotification: async () => {
        try {
            const { title, webPath, mobileCompo } = NewAnnouncement();
            const { name, color, backgroundColor } = Announcement;
            const web = webObject(title, webPath, "", AnnouncementWeb);
            const mobile = mobileObject(title, mobileCompo, "", name, color, backgroundColor);
            const message = notificationObjectWithoutToken("Announcement", title, { mobileCompo })
            await createBroadcast(web, mobile, message, "all");
        } catch (error) {
            logger.error(error);
        }
    },

    eventNotification: async () => {
        try {
            const { title, webPath, mobileCompo } = NewEvent();
            const { name, color, backgroundColor } = Announcement;
            const web = webObject(title, webPath, "", AnnouncementWeb);
            const mobile = mobileObject(title, mobileCompo, "", name, color, backgroundColor);
            const message = notificationObjectWithoutToken("Event", title, { mobileCompo })
            await createBroadcast(web, mobile, message, "all");
        } catch (error) {
            logger.error(error);
        }
    },

    newClassCreate: async (className) => {
        const { title, webPath, mobileCompo } = NewClassCreate(className);
        const { name, backgroundColor, color } = Classes;
        const web = webObject(title, webPath, "", ClassWeb);
        const mobile = mobileObject(title, mobileCompo, "", name, color, backgroundColor);
        const message = notificationObjectWithoutToken("New Class", title, { mobileCompo })
        await createBroadcast(web, mobile, message, "Member");
    },

    salesOffer: async () => {
        const { title, webPath, mobileCompo } = SalesOffer();
        const { name, backgroundColor, color } = Stock;
        const web = webObject(title, webPath, "", Stocks);
        const mobile = mobileObject(title, mobileCompo, "", name, color, backgroundColor);
        const message = notificationObjectWithoutToken("New Offer", title, { mobileCompo })
        await createBroadcast(web, mobile, message, "Member");
    },




    /**
     * Trainer 
    */

    newMemberAssign: async (userId) => {
        try {
            const { reactToken, _id } = await Credential.findOne({ userId }).lean();
            const { title, webPath, mobileCompo } = NewMemberAssign();
            const { name, color, backgroundColor } = Members;
            const web = webObject(title, webPath, _id, Member);
            const mobile = mobileObject(title, mobileCompo, _id, name, color, backgroundColor);
            const message = notificationObjectWithoutImg("Member", title, { mobileCompo }, reactToken);
            await createNotification(mobile, web, message)
        } catch (error) { logger.error(error); }
    },

    newClassAssign: async (userId,) => {
        try {
            const { reactToken } = await Credential.findById(userId).lean();
            const { title, webPath, mobileCompo } = NewClassAssign();
            const { name, color, backgroundColor } = Classes;
            const web = webObject(title, webPath, ClassWeb);
            const mobile = mobileObject(title, mobileCompo, userId, name, color, backgroundColor);
            const message = notificationObjectWithoutImg("Classes", title, { mobileCompo }, reactToken);
            await createNotification(mobile, web, message)
        } catch (error) { logger.error(error); }
    },








    /**
     * Member 
    */


    packageExpired: async (packageName, userId, token) => {
        try {
            const { name, backgroundColor, color } = Packages;
            const { title, webPath, mobileCompo } = PackageExpired(packageName);
            const mobile = mobileObject(title, mobileCompo, userId, name, color, backgroundColor);
            const web = webObject(title, webPath, userId, Package);
            const message = notificationObjectWithoutImg('Packages', title, { mobileCompo }, token)
            await createNotification(mobile, web, message);
        } catch (error) {
            logger.error(error);
        }
    },

    packageExpiry: async (packageName, userId, token) => {
        const { name, backgroundColor, color } = Packages;
        const { title, webPath, mobileCompo } = PackageExpiry(packageName);
        const mobile = mobileObject(title, mobileCompo, userId, name, color, backgroundColor);
        const web = webObject(title, webPath, userId, Package);
        const message = notificationObjectWithoutImg('Packages', title, { mobileCompo }, token)
        await createNotification(mobile, web, message);
    },


    classRegistration: async (className, userId) => {
        try {
            const { reactToken } = await Credential.findById(userId).lean();
            const { name, backgroundColor, color } = Classes;
            const { title, webPath, mobileCompo } = ClassRegistration(className);
            const mobile = mobileObject(title, mobileCompo, userId, name, color, backgroundColor);
            const web = webObject(title, webPath, userId, ClassWeb);
            const message = notificationObjectWithoutImg('Class Registration', title, { mobileCompo }, reactToken)
            await createNotification(mobile, web, message);
        } catch (error) { logger.error(error); }

    },


    gymTimeSpent: async (memberId, timeIn, timeOut) => {
        try {
            const minutes = ((new Date(timeOut).getTime() - new Date(timeIn).getTime()) / 60000).toFixed(2);
            const { reactToken, _id } = await Credential.findOne({ userId: memberId }).lean();
            const { name, backgroundColor, color } = TimeMobile;
            const { title, webPath, mobileCompo } = GymTimeSpent(minutes);
            const mobile = mobileObject(title, mobileCompo, _id, name, color, backgroundColor);
            const web = webObject(title, webPath, _id, TimeWeb);
            const message = notificationObjectWithoutImg('Gym Out', title, { mobileCompo }, reactToken)
            await createNotification(mobile, web, message);
        } catch (error) { logger.error(error); }
    },

    feedbackReply: async (userId) => {
        try {
            const { reactToken } = await Credential.findOne({ userId }).lean();
            const { name, backgroundColor, color } = DetailsIcon;
            const { title, webPath, mobileCompo } = FeedbackReply();
            const mobile = mobileObject(title, mobileCompo, userId, name, color, backgroundColor);
            const web = webObject(title, webPath, userId, Details);
            const message = notificationObjectWithoutImg('Class Registration', title, { mobileCompo }, reactToken);
            await createNotification(mobile, web, message);
        } catch (error) { logger.error(error); }
    },

    newDietPlan: async (memberId) => {
        try {
            const { reactToken, _id } = await Credential.findOne({ userId: memberId }).lean();
            const { name, backgroundColor, color } = DetailsIcon;
            const { title, webPath, mobileCompo } = NewDietPlan();
            const mobile = mobileObject(title, mobileCompo, _id, name, color, backgroundColor);
            const web = webObject(title, webPath, _id, Details);
            const message = notificationObjectWithoutImg('New Diet Plan', title, { mobileCompo }, reactToken);
            await createNotification(mobile, web, message);
        } catch (error) { logger.error(error); }
    },

    newWorkOut: async (userId) => {
        try {
            const { reactToken, _id } = await Credential.findOne({ userId }).lean();
            const { name, backgroundColor, color } = DetailsIcon;
            const { title, webPath, mobileCompo } = NewWorkOut();
            const mobile = mobileObject(title, mobileCompo, _id, name, color, backgroundColor);
            const web = webObject(title, webPath, _id, Details);
            const message = notificationObjectWithoutImg('New Workout', title, { mobileCompo }, reactToken);
            await createNotification(mobile, web, message);
        } catch (error) { logger.error(error); }
    },

    pointEarn: async (userId, point, type) => {
        try {
            const { reactToken, _id } = await Credential.findOne({ userId }).lean();
            const { name, backgroundColor, color } = DetailsIcon;
            const { title, webPath, mobileCompo } = PointEarn(point, type);
            const mobile = mobileObject(title, mobileCompo, _id, name, color, backgroundColor);
            const web = webObject(title, webPath, _id, Details);
            const message = notificationObjectWithoutImg('Point Earn', title, { mobileCompo }, reactToken);
            await createNotification(mobile, web, message);
        } catch (error) { logger.error(error); }
    },

    redeemCompleted: async (userId, point) => {
        try {
            const { reactToken } = await Credential.findById(userId).lean();
            const { name, backgroundColor, color } = DetailsIcon;
            const { title, webPath, mobileCompo } = RedeemCompleted(point);
            const mobile = mobileObject(title, mobileCompo, userId, name, color, backgroundColor);
            const web = webObject(title, webPath, userId, Details);
            const message = notificationObjectWithoutImg('Point Redeem', title, { mobileCompo }, reactToken);
            await createNotification(mobile, web, message);
        } catch (error) { logger.error(error); }
    },

    freezeAccept: async (userId) => {
        try {
            const { reactToken, _id } = await Credential.findOne({ userId }).lean();
            const { name, backgroundColor, color } = DetailsIcon;
            const { title, webPath, mobileCompo } = FreezeAccept();
            const mobile = mobileObject(title, mobileCompo, _id, name, color, backgroundColor);
            const web = webObject(title, webPath, _id, Details);
            const message = notificationObjectWithoutImg('Point Redeem', title, { mobileCompo }, reactToken);
            await createNotification(mobile, web, message);
        } catch (error) { logger.error(error); }
    },

    packageRenewal: async (packages, userId) => {
        try {
            const { reactToken, _id } = await Credential.findById(userId).lean();
            const { name, backgroundColor, color } = Packages;
            const { title, webPath, mobileCompo } = PackageRenewal(packages);
            const mobile = mobileObject(title, mobileCompo, _id, name, color, backgroundColor);
            const web = webObject(title, webPath, _id, Package);
            const message = notificationObjectWithoutImg('Package Renew', title, { mobileCompo }, reactToken);
            await createNotification(mobile, web, message);
        } catch (error) { logger.error(error); }
    }




}