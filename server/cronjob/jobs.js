const { logger: { logger } } = require('../../config');

const { memberExpired, memberAboutToExpiry, stockExpired, stockExpiry,
    contractExpired, contractExpiry, employeeVisaExpiry, freezeAction,
    assetsExpiry, assetsExpired } = require('../notification/helper');

const { Member, Stocks, Contract, Employee, MemberFreezing, Assets } = require('../model');

const { Formate: { setTime, formateBioStarDate } } = require('../utils');

const { memberFreezeNotification, memberFreeze } = require('../worker/freeze')

const { freezeMember, disableMember, updateMemberInBioStar } = require('../biostar');


module.exports = {

    checkPackageExpiry: async () => {
        try {
            const members = await Member.find({ doneFingerAuth: true })
                .populate("credentialId packageDetails.packages");
            const today = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
            for (const [i, member] of members.entries()) {
                for (const [j, packages] of member.packageDetails.entries()) {
                    let extendDate = packages["extendDate"], endDate = packages["endDate"], isPackageExpired = packages["isExpiredPackage"];
                    if (!isPackageExpired && extendDate && new Date(extendDate).getTime() <= today) {
                        await Member.findOneAndUpdate({ "packageDetails._id": packages._id }, { "packageDetails.$.isExpiredPackage": true })
                        await memberExpired(member.credentialId._id);
                    } else if (!isPackageExpired && endDate && new Date(endDate).getTime() <= today) {
                        await Member.findOneAndUpdate({ "packageDetails._id": packages._id }, { "packageDetails.$.isExpiredPackage": true });
                        await memberExpired(member.credentialId._id);
                    } else if (!isPackageExpired && extendDate && today === new Date(extendDate).setDate(new Date(extendDate).getDate() - 1)) {
                        await memberAboutToExpiry(member.credentialId._id);
                    } else if (!isPackageExpired && endDate && today === new Date(endDate).setDate(new Date(endDate).getDate() - 1)) {
                        await memberAboutToExpiry(member.credentialId._id);
                    }
                    for (const [k, trainer] of packages.trainerDetails.entries()) {
                        let isExpiredTrainer = trainer.isExpiredTrainer, trainerEnd = trainer.trainerEnd, trainerExtend = trainer.trainerExtend;
                        if (!isExpiredTrainer && trainerExtend && new Date(trainerExtend).setTime() <= today) {
                            members[i].packageDetails[j].trainerDetails[k].isExpiredTrainer = true;
                            await members[i].save();
                        }
                        else if (!isExpiredTrainer && trainerEnd && new Date(trainerEnd).getTime() <= today) {
                            members[i].packageDetails[j].trainerDetails[k].isExpiredTrainer = true;
                            await members[i].save();
                        }
                    }
                }
            }
        } catch (error) {
            logger.error(error);
        }
    },


    checkStockExpiry: async () => {
        const response = await Stocks.find({ status: true }).populate('branch').lean();
        for (let i = 0; i < response.length; i++) {
            const { itemName, branch: { branchName } } = response[i];
            const today = new Date().setHours(0, 0, 0, 0);
            const expiryDate = new Date(setTime(response[i].expiryDate)).getTime();
            let expiryMonth = new Date(setTime(response[i].expiryDate))
                .setMonth(new Date(response[i].expiryDate).getMonth() - 1);
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
        const response = await Assets.find({ status: true }).populate('assetBranch').lean();
        for (let i = 0; i < response.length; i++) {
            const { _id, warranty, dateOfPurchase, assetName, assetBranch: { branchName } } = response[i];
            const today = new Date().setHours(0, 0, 0, 0);
            let warrantyDate = new Date(new Date(dateOfPurchase).setMonth(new Date(dateOfPurchase).getMonth() + +warranty));
            let warrantyMonthDate = new Date(new Date(warrantyDate).setMonth(new Date(warrantyDate).getMonth() - 1));
            if (warrantyMonthDate === today) { await assetsExpiry(assetName, branchName, _id) };
            if (warrantyDate === today) { await assetsExpired(assetName, branchName, _id) };
        };
    },


    checkContractExpiry: async () => {
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
        const response = await Employee.find({}).populate("credentialId").lean();
        for (let i = 0; i < response.length; i++) {
            const { _id, visaDetails, credentialId: { userName } } = response[i];
            const today = new Date().setHours(0, 0, 0, 0);
            if (visaDetails && visaDetails.expiryDate) {
                let expiryMonth = new Date(visaDetails.expiryDate).setHours(0, 0, 0, 0);
                if (expiryMonth === today) {
                    try { await employeeVisaExpiry(userName, _id) }
                    catch (error) { logger.error(error); }
                }
            }
        }
    },



    upgradeMember: async () => {
        const response = await Member.find({ doneFingerAuth: true })
            .populate("credentialId packageDetails.packages").lean();
        const today = new Date().setHours(0, 0, 0, 0);
        for (const member of response) {
            for (const packages of member.packageDetails) {
                if (new Date(packages.startDate).setHours(0, 0, 0, 0) === today) {
                    const endDate = packages.extendDate ? packages.extendDate : packages.endDate
                    const obj = module.exports.makeBioStarObject
                        (member, packages.packages.bioStarInfo, packages.startDate, endDate);
                    await updateMemberInBioStar(obj)
                }
            }
        }
    },


    makeBioStarObject: (userData, bioStarInfo, startDate, endDate) => {
        let obj = {
            accessGroupName: bioStarInfo.accessGroupName,
            accessGroupId: bioStarInfo.accessGroupId,
            userGroupId: bioStarInfo.userGroupId,
            endDate: formateBioStarDate(endDate),
            memberId: userData.memberId,
            name: userData.credentialId.userName,
            email: userData.credentialId.email,
            phoneNumber: userData.mobileNo,
            startDate: formateBioStarDate(startDate),
        };
        return obj;
    },


    freezeMember: async () => {
        const today = new Date(new Date().setHours(0, 0, 0, 0));
        const member = await MemberFreezing.find({ typeOfFreeze: 'Pending', status: true, fromDate: today }).lean();
        const users = member.map(doc => { return doc.memberId });
        for (const item of member) {
            let memberInfo = await Member.findById(item.memberId);
            let startDate = new Date(item.reactivationDate).toISOString();
            let largest = setTime(new Date());
            let today = new Date(setTime(new Date())).getTime();
            for (const [i] of memberInfo.packageDetails.entries()) {
                let temp = await memberFreeze(memberInfo, i, largest, item.noOfDays, item._id, startDate);
                largest = new Date(temp) > new Date(largest) ? new Date(temp) : largest;
            }
            let checkLargest = new Date(largest).getTime();
            if (today !== checkLargest) {
                await freezeMember(memberInfo.memberId, startDate, largest);
            }
        }
        await memberFreezeNotification(users);
    },

    checkInstallmentsPending: async () => {
        try {
            const members = await Member.find({ status: true, doneFingerAuth: true });
            const today = new Date(setTime(new Date())).getTime();
            for (const [i, member] of members.entries()) {
                for (const packages of member.packageDetails) {
                    if (packages.Installments && packages.Installments.length) {
                        for (const installment of packages.Installments) {
                            let dueDate = new Date(setTime(installment.dueDate)).getTime();
                            if (dueDate === today && installment.paidStatus === 'UnPaid') {
                                members[i].status = false;
                                await members[i].save();
                                await disableMember(members[i].memberId, 'IN');
                            }
                        }
                    }
                }
            }
        } catch (error) {
            logger.error(error);
        }

    }


};