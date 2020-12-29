/**
 * utils.
*/

const { logger: { logger }, handler: { successResponseHandler, errorResponseHandler } } = require('../../../config');
const { Formate: { setTime } } = require('../../utils');
const { makeCode } = require('../../utils/id_generator.util');
const { redeemCompleted } = require('../../notification/helper')

/**
 * models.
*/

const { MemberTransaction, MemberCode, Member, GiftCard, RewardPolicy } = require('../../model');



/**
 ******************************** MEMBER CONTROLLER ********************************
*/



/**
 *  refer to friend api for member
*/

exports.referFriend = async (req, res) => {
    const { _id } = await RewardPolicy.findOne({ policyCategory: 'Referral' }).lean();
    const { member, referPolicy } = req.body;
    let isExists = await MemberCode.findOne({ member, referPolicy: _id }).lean();
    if (isExists) return successResponseHandler(res, isExists, "successfully get member code");
    else {
        let newCode = new MemberCode({ member, referPolicy: _id, code: makeCode(6) });
        newCode.save().then(response => {
            return successResponseHandler(res, response, "successfully added new code");
        }).catch(error => {
            logger.error(error);
            return errorResponseHandler(res, error, 'failed to generate code !');
        });
    }
};





/**
 *  get to all transaction for admin of redeem and earned
*/


exports.getAllTransactionsForAdmin = async (req, res) => {
    try {
        let queryCond = {};
        if (req.body.rewardType) queryCond["rewardType"] = req.body.rewardType;
        if (req.body.branch) queryCond["branch"] = req.body.branch;
        const response = await MemberTransaction.find(queryCond)
            .populate('member branch giftCard policy')
            .populate({ path: "member", populate: { path: "credentialId" } }).sort({ date: 'desc' }).lean();
        const newResponse = response.filter(doc => {
            if (req.body.search) {
                let search = req.body.search.toLowerCase();
                let temp1 = doc.member.credentialId.userName.toLowerCase();
                let temp2 = doc.member.memberId.toString();
                let temp3 = doc.branch.branchName.toLowerCase();
                if (temp1.includes(search) || temp2.includes(search) || temp3.includes(search)) {
                    return doc;
                }
            } else {
                return doc;
            }
        });
        return successResponseHandler(res, newResponse, "successfully get transaction !")
    } catch (error) {
        logger.error(error);
        return errorResponseHandler(res, error, "Failed to get transaction!")
    }
};


exports.checkReferralCodeValidity = async (req, res) => {
    const isValid = await MemberCode.findOne({ code: req.body.code })
    if (isValid) {
        return successResponseHandler(res, isValid, "successfully get member code")
    } else {
        return errorResponseHandler(res, 'error', " Referral code is InValid ");
    }
};




/**
 *    get to all transaction for member of redeem and earned
*/


exports.getMemberTransaction = async (req, res) => {
    MemberTransaction.find({ member: req.body.member })
        .populate('giftCard policy')
        .sort({ date: 'desc' })
        .then((response) => {
            return successResponseHandler(res, response, "successfully get transaction !")
        }).catch((error) => {
            logger.error(error);
            return errorResponseHandler(res, error, "Failed to get transaction!")
        })
};











/**
 ******************************** GIFT CARD CONTROLLER ********************************
*/








/**
 *  redeem gift card done by member
*/


exports.redeemOffer = async (req, res) => {
    try {
        const isEligible = await Member.findById(req.body.member).lean();
        const policy = await GiftCard.findById(req.body.giftCard).lean();
        if (isEligible.walletPoints < policy.points) return errorResponseHandler(res, 'error', "you don't have enough points ! ");
        const { walletPoints, branch } = await Member.findByIdAndUpdate(req.body.member, { $inc: { walletPoints: -policy.points } }, { new: true })
        let newTransaction = new MemberTransaction({
            date: setTime(new Date()), point: policy.points,
            balancePoint: walletPoints, pointType: "-",
            member: req.body.member, rewardType: "Redeem",
            redeemCode: makeCode(7), redeemStatus: "Pending",
            branch, giftCard: req.body.giftCard,
        });
        const response = await newTransaction.save();
        await redeemCompleted(isEligible.userId, policy.points)
        return successResponseHandler(res, response, "successfully redeem gift !");
    } catch (error) {
        logger.error(error);
        return errorResponseHandler(res, error, "Failed to redeem gift!")
    }
};


/**
 *  get gift card code redeem code for member
*/

exports.getRedeemCode = (req, res) => {
    MemberTransaction.findOne({ member: req.body.member, giftCard: req.body.giftCard, isOld: true })
        .then(response => {
            return successResponseHandler(res, response, "successfully get redeem code !");
        }).catch(error => {
            logger.error(error);
            return errorResponseHandler(res, error, "error while get redeem code !");
        });
}


/**
 *  get gift amount by redeem code
*/

exports.getAmountByRedeemCode = (req, res) => {
    MemberTransaction.findOne({ redeemCode: req.body.code, member: req.body.memberId, })
        .populate('giftCard')
        .then(response => {
            return successResponseHandler(res, response, "successfully get redeem code !")
        }).catch(error => {
            logger.error(error);
            return errorResponseHandler(res, error, "failed to get redeem code data !");
        })
}


/**
 *  gift card code use by member
*/


exports.useRedeemCode = async (req, res) => {
    try {
        const { giftCard, _id } = await MemberTransaction.findOne({ redeemCode: req.body.code });
        const isExpired = await GiftCard.findOne({ _id: giftCard, endDate: { $gte: setTime(new Date()) }, status: true }).lean();
        if (!isExpired) return errorResponseHandler(res, 'error', "You gift card has expired or deactivated by admin kindly contact to gym !");
        const response = await MemberTransaction.findByIdAndUpdate(_id, { redeemStatus: 'Completed', isOld: false });
        return successResponseHandler(res, response, "successfully redeem your gift card!")
    } catch (error) {
        logger.error(error);
        return errorResponseHandler(res, error, "Failed to redeem your gift card !")
    }
};


/**
 *  cancel the redeem transaction of member
*/

exports.cancelRedeem = async (req, res) => {
    try {
        const { giftCard, point, member } = await MemberTransaction.findById(req.body.transactionId);
        const isExpired = await GiftCard.findOne({ _id: giftCard, endDate: { $gte: setTime(new Date()) }, status: true }).lean();
        if (!isExpired) return errorResponseHandler(res, 'error', "You gift card has expired or deactivated by admin kindly contact to gym !");
        const checkIsComplete = await MemberTransaction.findOne({ _id: req.body.transactionId, redeemStatus: 'Completed', }).count();
        if (checkIsComplete) return errorResponseHandler(res, 'error', 'You already used it')
        await MemberTransaction.findByIdAndUpdate(req.body.transactionId, { redeemStatus: 'Completed', isOld: false });
        const { walletPoints, branch } = await Member.findByIdAndUpdate(member, { $inc: { walletPoints: +point } }, { new: true });
        let newTransaction = new MemberTransaction({
            date: setTime(new Date()), point: point, isOld: false,
            balancePoint: walletPoints, pointType: "+",
            member, rewardType: "Redeem", branch, giftCard,
            redeemStatus: "Completed",
        });
        const response = await newTransaction.save();
        return successResponseHandler(res, response, "successfully canceled redeem !");
    } catch (error) {
        logger.error(error);
        return errorResponseHandler(res, error, "Failed to canceled redeem !")
    }
}
