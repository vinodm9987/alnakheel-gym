const { setTime } = require('../utils/timeFormate.util');
const { MemberCode, RewardPolicy, MemberTransaction, Member } = require('../model');
const { logger: { logger }, } = require('../../config')
const { getNoPointToIncrease } = require('../utils/id_generator.util');
const { pointEarn } = require('../notification/helper');


module.exports = {

    addPointOfReferral: async (code, receiverMember) => {
        try {
            const { member, referPolicy, _id } = await MemberCode.findOne({ code }).lean();
            const { noOfPoints } = await RewardPolicy.findById(referPolicy).lean();
            const { walletPoints, branch } = await Member.findByIdAndUpdate(member, { $inc: { walletPoints: noOfPoints } }, { new: true }).lean();
            const senderObj = {
                date: new Date(), balancePoint: walletPoints,
                point: noOfPoints, pointType: "+", member,
                rewardType: "Earn", branch, policy: referPolicy
            };
            const senderTransaction = new MemberTransaction(senderObj);
            await senderTransaction.save();
            await pointEarn(member, noOfPoints, "Referral");
            const receiver = await Member.findByIdAndUpdate(receiverMember, { $inc: { walletPoints: noOfPoints } }, { new: true }).lean();
            const receiverObject = {
                date: new Date(), balancePoint: receiver.walletPoints,
                point: noOfPoints, pointType: "+", member: receiverMember,
                rewardType: "Earn", branch: receiver.branch, policy: referPolicy
            }
            const receiverTransaction = new MemberTransaction(receiverObject);
            await receiverTransaction.save();
            await MemberCode.findByIdAndUpdate(_id, { $push: { joinMember: { member: receiverMember, status: 'First Transaction' } } });
            await pointEarn(receiverMember, noOfPoints, "Referral");
        } catch (error) {
            logger.error(error);
        }
    },

    checkExpiry: async (code) => {
        const { referPolicy } = await MemberCode.findOne({ code }).lean();
        const count = await RewardPolicy.findOne({ _id: referPolicy, status: true, endDate: { $gte: setTime(new Date()) } }).count();
        return count;
    },

    pendingPaymentToGetPoint: async (code, receiverMember) => {
        try {
            const { _id } = await MemberCode.findOne({ code }).lean();
            await MemberCode.findByIdAndUpdate(_id, { $push: { joinMember: { member: receiverMember, status: 'Join' } } });
        } catch (error) {
            logger.error(error);
        }
    },

    updateTransaction: async ({ member, referPolicy, _id }, receiverMember) => {
        try {
            const { noOfPoints } = await RewardPolicy.findById(referPolicy).lean();
            await Member.update({ _id: { $in: [member] } }, { $inc: { walletPoints: +noOfPoints } }, { multi: true });
            const senderData = await Member.findById(member).lean();
            const senderObj = {
                date: new Date(), balancePoint: senderData["walletPoints"],
                point: noOfPoints, pointType: "+", member,
                rewardType: "Earn", branch: senderData["branch"], policy: referPolicy
            };
            const senderTransaction = new MemberTransaction(senderObj);
            await senderTransaction.save();
            await pointEarn(member, noOfPoints, "Referral");
            const receiver = await Member.findByIdAndUpdate(receiverMember, { $inc: { walletPoints: noOfPoints } }, { new: true }).lean();
            const receiverObject = {
                date: new Date(), balancePoint: receiver.walletPoints,
                point: noOfPoints, pointType: "+", member: receiverMember,
                rewardType: "Earn", branch: receiver.branch, policy: referPolicy
            }
            const receiverTransaction = new MemberTransaction(receiverObject);
            await receiverTransaction.save();
            await MemberCode.update({ _id, "joinMember.member": receiverMember }, { $set: { "joinMember.$.status": "First Transaction" } });
            await pointEarn(receiverMember, noOfPoints, "Referral");
            return noOfPoints;
        } catch (error) {
            logger.error(error);
        }
    },

    checkExpiryOfPolicy: async () => {
        const count = await RewardPolicy.findOne({ status: true, endDate: { $gte: setTime(new Date()) }, policyCategory: "Amount" }).count();
        return count;
    },

    addPointOfPolicy: async (amount, member) => {
        const data = await RewardPolicy.findOne({ status: true, endDate: { $gte: setTime(new Date()) }, policyCategory: "Amount" });
        if (+data.amount <= amount) {
            const walletPoints = getNoPointToIncrease(+data.amount, data.noOfPoints, amount);
            await Member.update({ _id: { $in: [member] } }, { $inc: { walletPoints } }, { multi: true });
            const memberData = await Member.findById(member).lean();
            const senderObj = {
                date: new Date(), balancePoint: memberData["walletPoints"],
                point: walletPoints, pointType: "+", member,
                rewardType: "Earn", branch: memberData["branch"], policy: data._id
            };
            const senderTransaction = new MemberTransaction(senderObj);
            await senderTransaction.save();
            await pointEarn(member, walletPoints, "Policy");
        }
    },

    completeGiftRedeem: async (id) => {
        const response = await MemberTransaction.findByIdAndUpdate(id, { redeemStatus: 'Completed' });
        return response;
    }


};