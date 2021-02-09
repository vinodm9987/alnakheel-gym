/**
 * utils.
*/

const { logger: { logger }, handler: { successResponseHandler, errorResponseHandler } } = require('../../../config');

const { Formate: { setTime, checkDateInBetween } } = require('../../utils');

const { memberFreezeNotification, freezeMemberInBioStar, checkIsMemberFreezable } = require('../../worker/freeze')

const { freezeMember } = require('../../biostar')
/**
 * models.
*/

const { MemberFreezing, Member } = require('../../model');
const { auditLogger } = require('../../middleware/auditlog.middleware');



const memberSearch = (response, search) => {
    let newResponse = response.filter((doc) => {
        if (search) {
            let temp = doc.credentialId.email ? doc.credentialId.email.toLowerCase() : '';
            let temp1 = doc.credentialId.userName.toLowerCase();
            let temp2 = doc.personalId.toLowerCase();
            let temp3 = doc.mobileNo.toString();
            if (temp.includes(search) || temp1.includes(search) ||
                temp2.includes(search) || temp3.includes(search)) {
                return doc
            }
        } else {
            return doc;
        }
    })
    return newResponse;
};




/**
 *  Member Freezing Controller
*/



exports.applyFreezeMember = async (req, res) => {
    try {
        req.body["fromDate"] = setTime(req.body.fromDate);
        req.body["toDate"] = setTime(req.body.toDate);
        req.body["reactivationDate"] = setTime(req.body.reactivationDate)
        let memberInfo = await Member.findById(req.body.memberId).lean();
        const isFreezable = checkIsMemberFreezable(memberInfo.packageDetails, req.body.toDate);
        const exist = await MemberFreezing.find({ memberId: req.body.memberId, status: "Pending" }).count();
        if (!isFreezable) return errorResponseHandler(res, 'error', 'Member do not have package on freeze date')
        if (exist) {
            req.responseData = await MemberFreezing.findOne({ memberId: req.body.memberId }).lean()
            const response = await MemberFreezing.findOneAndUpdate({ memberId: req.body.memberId, status: "Pending" }, req.body, { returnNewDocuments: true })
            auditLogger(req, 'Success')
            return successResponseHandler(res, response, "successfully updated freeze Member !")
        } else {
            const completeExist = await MemberFreezing.find({ memberId: req.body.memberId, status: "Completed", toDate: { $gte: req.body.fromDate } }).count()
            if (!completeExist) {
                const newRecord = new MemberFreezing(req.body);
                const newResponse = await newRecord.save()
                auditLogger(req, 'Success')
                return successResponseHandler(res, newResponse, "successfully freeze Member !")
            } else {
                auditLogger(req, 'Failed')
                return errorResponseHandler(res, 'error', "Sorry you have already freezed for this period!");
            }
        }
    } catch (error) {
        logger.error(error);
        auditLogger(req, 'Failed')
        return errorResponseHandler(res, error, "failed to freeze Member !");
    }
};



exports.applyFreezeAllMember = async (req, res) => {
    try {
        req.body["fromDate"] = setTime(req.body.fromDate);
        req.body["toDate"] = setTime(req.body.toDate);
        req.body["reactivationDate"] = setTime(req.body.reactivationDate)
        let response = [], errorCount = 0
        for (let i = 0; i < req.body.members.length; i++) {
            let obj = Object.assign({}, req.body);
            delete obj["members"];
            obj["memberId"] = req.body.members[i];
            const exist = await MemberFreezing.find({ memberId: obj.memberId, status: "Pending" }).count()
            if (exist) {
                const expiredExist = await MemberFreezing.find({ memberId: obj.memberId, status: "Pending", toDate: { $lt: setTime(new Date()) } }).count()
                if (expiredExist) {
                    await MemberFreezing.findOneAndUpdate({ memberId: obj.memberId, status: "Pending", toDate: { $lt: setTime(new Date()) } }, obj, { returnNewDocuments: true })
                } else {
                    errorCount++
                }
            } else {
                const completeExist = await MemberFreezing.find({ memberId: obj.memberId, status: "Completed", toDate: { $gte: obj.fromDate } }).count()
                if (!completeExist) {
                    response.push(obj)
                } else {
                    errorCount++
                }
            }
        }
        const newResponse = MemberFreezing.insertMany(response)
        if (response.length) {
            auditLogger(req, 'Success')
            return successResponseHandler(res, newResponse, `${response.length} out of ${req.body.members.length} members successfully freezed !`)
        } else {
            auditLogger(req, 'Failed')
            return errorResponseHandler(res, 'error', `${errorCount} out of ${req.body.members.length} members not freezed !`)
        }
    } catch (error) {
        logger.error(error);
        auditLogger(req, 'Failed')
        return errorResponseHandler(res, error, "failed to freeze Member !");
    }
};



exports.getPendingFreezeMember = async (req, res) => {
    try {
        let queryCond = {};
        queryCond["status"] = "Pending";
        if (req.body.date) queryCond["fromDate"] = setTime(req.body.date);
        let search = req.body.search.toLowerCase()
        let response = await MemberFreezing.find(queryCond)
            .populate('memberId')
            .populate({ path: 'memberId', populate: { path: 'credentialId' } }).lean()
        let newResponse = memberSearch(response, search);
        return successResponseHandler(res, newResponse, "successfully getting pending Member!");
    } catch (error) {
        logger.error(error);
        errorResponseHandler(res, error, "failed to get pending freeze Member !");
    }
};






exports.removeMemberFreeze = (req, res) => {
    MemberFreezing.findOneAndDelete({ _id: req.body._id })
        .then((response) => {
            auditLogger(req, 'Success')
            return successResponseHandler(res, response, "successfully removed freeze Member !")
        }).catch((error) => {
            logger.error(error);
            auditLogger(req, 'Failed')
            return errorResponseHandler(res, error, "failed to remove freeze Member !");
        });
};




exports.freezeMember = async (req, res) => {
    const { member } = req.body;
    const users = member.map(doc => { return doc.member });
    for (const item of member) {
        let memberInfo = await Member.findById(item.member);
        let startDate = new Date(item.reactivation).toISOString();
        let largest = setTime(new Date());
        let today = new Date(setTime(new Date())).getTime();
        for (const [i] of memberInfo.packageDetails.entries()) {
            let temp = await memberFreeze(memberInfo, i, largest, item.days, item._id, startDate);
            largest = new Date(temp) > new Date(largest) ? new Date(temp) : largest;
        }
        let checkLargest = new Date(largest).getTime();
        if (today !== checkLargest) {
            await freezeMember(item.memberId, startDate, largest);
        }
    }
    await memberFreezeNotification(users);
    return successResponseHandler(res, [], "successfully freeze member !");
};



const memberFreeze = async (member, packageIndex, largest, days, _id, reactivationDate) => {
    try {
        const today = setTime(new Date());
        const memberPackageData = member.packageDetails[packageIndex];
        const notStartedPackage = new Date(memberPackageData.startDate) > new Date(today) && checkDateInBetween(reactivationDate, memberPackageData.startDate, memberPackageData.endDate);
        if (new Date(memberPackageData.startDate) >= new Date(reactivationDate)) return largest;  // handle package is not started and reactivation date is not lie in between startDate and endDate
        if (!memberPackageData.isExpiredPackage && notStartedPackage) {  // handle package is not started and reactivation date lie in between startDate and endDate
            memberPackageData.endDate = new Date(new Date(memberPackageData.endDate).setDate(new Date(memberPackageData.endDate).getDate() + days));
            memberPackageData.startDate = new Date(new Date(memberPackageData.startDate).setDate(new Date(memberPackageData.startDate).getDate() + days));
            await MemberFreezing.findByIdAndUpdate(_id, { status: "Completed" })
            if (new Date(memberPackageData.endDate) > new Date(largest)) { largest = new Date(memberPackageData.extendDate) }
        }
        else if (!memberPackageData.isExpiredPackage && memberPackageData.extendDate && memberPackageData.extendDate > new Date(today)) {   // handle package should not expire and it already freeze earlier
            memberPackageData.extendDate = new Date(memberPackageData.extendDate).setDate(new Date(memberPackageData.extendDate).getDate() + days);
            memberPackageData.reactivationDate = reactivationDate; memberPackageData.freezeDate = today;
            await MemberFreezing.findByIdAndUpdate(_id, { status: "Completed" })
            if (new Date(memberPackageData.extendDate) > new Date(largest)) { largest = new Date(memberPackageData.extendDate) }
        } else if (!memberPackageData.isExpiredPackage && memberPackageData.endDate > new Date(today)) {  // handle package should not expire
            memberPackageData.extendDate = new Date(memberPackageData.endDate).setDate(new Date(memberPackageData.endDate).getDate() + days);
            memberPackageData.reactivationDate = reactivationDate; memberPackageData.freezeDate = today;
            await MemberFreezing.findByIdAndUpdate(_id, { status: "Completed" })
            if (new Date(memberPackageData.extendDate) > new Date(largest)) { largest = new Date(memberPackageData.extendDate) }
        }
        if (!memberPackageData.isExpiredPackage) {
            for (const [j, trainer] of memberPackageData.trainerDetails.entries()) {
                if (!trainer.isExpiredTrainer && trainer.trainerExtend && trainer.trainerExtend > new Date(today)) {
                    memberPackageData.trainerDetails[j].trainerExtend = new Date(trainer.trainerExtend).setDate(new Date(trainer.trainerExtend).getDate() + days);
                } else if (!trainer.isExpiredTrainer && trainer.trainerEnd && trainer.trainerEnd > new Date(today)) {
                    memberPackageData.trainerDetails[j].trainerExtend = new Date(trainer.trainerEnd).setDate(new Date(trainer.trainerEnd).getDate() + days);
                } else if (!trainer.isExpiredTrainer && trainer.trainerEnd && trainer.trainerStart > new Date(today)) {
                    memberPackageData.trainerDetails[j].trainerEnd = new Date(trainer.trainerEnd).setDate(new Date(trainer.trainerEnd).getDate() + days);
                    memberPackageData.trainerDetails[j].trainerStart = new Date(trainer.trainerStart).setDate(new Date(trainer.trainerStart).getDate() + days)
                }
            }
        }
        await member.save();
        return largest;
    } catch (error) {
        logger.error(error);
    }
};






exports.cancelFreeze = async (req, res) => {
    try {
        const userData = await Member.findById(req.body.memberId)
            .populate('credentialId packageDetails.packages');
        let largestEndDate = new Date().getTime();
        for (const [i] of userData.packageDetails.entries()) {
            let temp = await cancelFreezeUpdate(userData, i, largestEndDate, req.body.returningDate);
            largestEndDate = new Date(temp) > new Date(largestEndDate) ? new Date(temp) : largestEndDate;
        };
        const newCancelFreeze = new MemberFreezing(req.body);
        newCancelFreeze['typeOfFreeze'] = 'Canceled';
        newCancelFreeze['returningDate'] = setTime(req.body.returningDate);
        const response = await newCancelFreeze.save();
        await freezeMember(userData.memberId, req.body.returningDate, largestEndDate);
        return successResponseHandler(res, response, "success");
    } catch (error) {
        logger.error(error);
        return errorResponseHandler(res, error, 'failed to get freeze history!');
    }
};

const cancelFreezeUpdate = async (member, i, largest, returningDate) => {
    const packages = member.packageDetails[i];
    const today = setTime(new Date());
    if (!packages.isExpiredPackage && packages.extendDate && new Date(packages.extendDate) > new Date(today)) {
        const differentDate = new Date(new Date(packages.reactivationDate).setDate(new Date(packages.reactivationDate).getDate() - new Date(returningDate).getDate())).getDate()
        const newExtendedDate = new Date(packages.extendDate).setDate(new Date(packages.extendDate).getDate() - differentDate);
        member.packageDetails[i].extendDate = setTime(newExtendedDate);
        member.packageDetails[i].reactivationDate = setTime(returningDate);
        for (const [j, trainer] of packages.trainerDetails.entries()) {
            if (!trainer.isExpiredTrainer && trainer.trainerExtend && trainer.trainerExtend > new Date(today)) {
                const newExtendedDate = new Date(trainer.trainerExtend).setDate(new Date(trainer.trainerExtend).getDate() - differentDate);
                packages.trainerDetails[j].trainerExtend = setTime(newExtendedDate);
            }
        }
        if (new Date(newExtendedDate) > new Date(largest)) largest = newExtendedDate;
    }
    await member.save();
    return largest;
};










exports.getFreezeHistory = async (req, res) => {
    try {
        let queryCond = {};
        queryCond["status"] = "Completed";
        if (req.body.date) queryCond["reactivationDate"] = setTime(req.body.date);
        if (req.body.typeOfFreeze) queryCond["typeOfFreeze"] = req.body.typeOfFreeze;
        const response = await MemberFreezing.find(queryCond).populate('memberId')
            .populate({ path: 'memberId', populate: { path: 'credentialId' } }).lean();
        const search = req.body.search.toLowerCase();
        let newResponse = memberSearch(response, search);
        return successResponseHandler(res, newResponse, 'successfully get freeze history !');
    } catch (error) {
        logger.error(error);
        return errorResponseHandler(res, error, 'failed to get freeze history!');
    }
};