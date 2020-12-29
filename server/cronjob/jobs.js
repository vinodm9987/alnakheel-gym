const { logger: { logger } } = require('../../config');

const { packageExpired, memberExpired, memberAboutToExpiry,
    packageExpiry, stockExpired, stockExpiry, contractExpired,
    contractExpiry, employeeVisaExpiry, freezeAction, assetsExpiry,
    assetsExpired } = require('../notification/helper');

const { Member, Stocks, Contract, Employee, MemberFreezing, Assets } = require('../model');

const { Formate: { setTime } } = require('../utils');

module.exports = {

    checkPackageExpiry: async () => {
        const response = await Member.find({ doneFingerAuth: true }).populate("credentialId packageDetails.packages").lean();
        const today = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
        for (let i = 0; i < response.length; i++) {
            response[i].packageDetails.forEach(async doc => {
                if (!doc["isExpiredPackage"] && doc["extendDate"] && new Date(doc["extendDate"]).getTime() <= today) {
                    try {
                        await Member.findOneAndUpdate({ "packageDetails._id": doc._id }, { "packageDetails.$.isExpiredPackage": true })
                        await packageExpired(doc.packages.packageName, response[i].credentialId._id, response[i].credentialId.reactToken)
                        await memberExpired(response[i].credentialId._id)
                    } catch (error) {
                        logger.error(error);
                    }
                } else if (!doc["isExpiredPackage"] && doc["endDate"] && new Date(doc["endDate"]).getTime() <= today) {
                    try {
                        await Member.findOneAndUpdate({ "packageDetails._id": doc._id }, { "packageDetails.$.isExpiredPackage": true });
                        await packageExpired(doc.packages.packageName, response[i].credentialId._id, response[i].credentialId.reactToken)
                        await memberExpired(response[i].credentialId._id);
                    } catch (error) {
                        logger.error(error);
                    }
                } else if (!doc["isExpiredTrainer"] && doc["trainerExtend"] && new Date(doc["trainerExtend"]).getTime() <= today) {
                    try {
                        await Member.findOneAndUpdate({ "packageDetails._id": doc._id }, { "packageDetails.$.isExpiredTrainer": true })
                    } catch (error) {
                        logger.error(error);
                    }
                } else if (!doc["isExpiredTrainer"] && doc["trainerEnd"] && new Date(doc["trainerEnd"]).getTime() <= today) {
                    try {
                        await Member.findOneAndUpdate({ "packageDetails._id": doc._id }, { "packageDetails.$.isExpiredTrainer": true })
                    } catch (error) { logger.error(error); }
                } else if (!doc["isExpiredPackage"] && doc["extendDate"] && new Date(doc["extendDate"]).getTime() === new Date(doc["extendDate"]).setDate(new Date(doc["extendDate"]).getDate() - 2)) {
                    try {
                        await memberAboutToExpiry(response[i].credentialId._id);
                        await packageExpiry(doc.packages.packageName, response[i].credentialId._id, response[i].credentialId.reactToken)
                    } catch (error) { logger.error(error); }

                } else if (!doc["isExpiredPackage"] && doc["endDate"] && new Date(doc["endDate"]).getTime() === new Date(doc["extendDate"]).setDate(new Date(doc["extendDate"]).getDate() - 2)) {
                    try {
                        await memberAboutToExpiry(response[i].credentialId._id);
                        await packageExpiry(doc.packages.packageName, response[i].credentialId._id, response[i].credentialId.reactToken)
                    } catch (error) { logger.error(error); }
                }
            });
        }
    },


    checkStockExpiry: async () => {
        console.log("********************************* job run today at 2 " + new Date());
        const response = await Stocks.find({ status: true }).populate('branch').lean();
        for (let i = 0; i < response.length; i++) {
            const { itemName, branch: { branchName } } = response[i];
            const today = new Date().setHours(0, 0, 0, 0);
            let expiryMonth = new Date(response[i].expiryDate).setMonth(new Date(response[i].expiryDate).getMonth() - 1);
            let expiryDate = new Date(response[i].expiryDate).getTime();
            if (expiryMonth === today) {
                try { await stockExpired(itemName, branchName) }
                catch (error) { logger.error(error); }
            } else if (expiryDate === today) {
                try { await stockExpiry(itemName, branchName) }
                catch (error) { logger.error(error); }
            }
        }
    },

    checkAssetsExpiry: async () => {
        console.log("*************************** job run today at 3 " + new Date());
        const response = await Assets.find({ status: true }).populate('branch').lean();
        for (let i = 0; i < response.length; i++) {
            const { _id, warranty, dateOfPurchase, assetName, branch: { branchName } } = response[i];
            const today = new Date().setHours(0, 0, 0, 0);
            let warrantyDate = new Date(new Date(dateOfPurchase).setMonth(new Date(dateOfPurchase).getMonth() + +warranty));
            let warrantyMonthDate = new Date(new Date(warrantyDate).setMonth(new Date(warrantyDate).getMonth() - 1));
            if (warrantyMonthDate === today) { await assetsExpiry(assetName, branchName, _id) };
            if (warrantyDate === today) { await assetsExpired(assetName, branchName, _id) };
        };
    },


    checkContractExpiry: async () => {
        console.log("*************************** job run today at 4 " + new Date());
        const response = await Contract.find({}).lean();
        for (let i = 0; i < response.length; i++) {
            const today = new Date().setHours(0, 0, 0, 0);
            let { contractName, _id } = response[i];
            let expiryMonth = new Date(response[i].contractEnd).setMonth(new Date(response[i].contractEnd).getMonth() - 1);
            let expiryDate = new Date(response[i].contractEnd).getTime();
            if (today === expiryDate) {
                try { await contractExpiry(contractName, _id); }
                catch (error) { logger.error(error); }
            } else if (expiryMonth === today) {
                try { await contractExpired(contractName, _id); }
                catch (error) { logger.error(error); }
            }
        }
    },

    checkVisaExpiry: async () => {
        console.log("*************************** job run today at 5 " + new Date());
        const response = await Employee.find({}).populate("credentialId").lean();
        for (let i = 0; i < response.length; i++) {
            const { _id, visaDetails, credentialId: { userName } } = response[i];
            const pastMonth = new Date().setHours(0, 0, 0, 0);;
            if (visaDetails.expiryDate) {
                let expiryMonth = new Date(visaDetails.expiryDate).setMonth(new Date(visaDetails.expiryDate).getMonth() - 1);
                if (expiryMonth === pastMonth) {
                    try { await employeeVisaExpiry(userName, _id) }
                    catch (error) { logger.error(error); }
                }
            }
        }
    },

    checkFreezeMember: async () => {
        const response = await MemberFreezing.find({ fromDate: setTime(new Date()) }).count();
        await freezeAction(response)
    }

};