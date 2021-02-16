/**
 * utils.
*/

const { logger: { logger }, handler: { successResponseHandler, errorResponseHandler } } = require('../../../config');

const { Formate: { setTime } } = require('../../utils');

const { checkIsMemberFreezable } = require('../../worker/freeze')

const { freezeMember } = require('../../biostar');


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
        const exist = await MemberFreezing.find({ memberId: req.body.memberId, typeOfFreeze: "Pending" }).count();
        req.responseData = exist;
        if (!isFreezable) return errorResponseHandler(res, 'error', 'Member do not have package for freeze ')
        if (exist) {
            auditLogger(req, 'Success');
            return errorResponseHandler(res, exist, "member is already under pending freeze date , kindly updated it.!")
        } else {
            const newRecord = new MemberFreezing(req.body);
            const newResponse = await newRecord.save()
            auditLogger(req, 'Success')
            return successResponseHandler(res, newResponse, "successfully freeze Member !")
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
            obj["memberId"] = req.body.members[i];
            const exist = await MemberFreezing.find({ memberId: obj.memberId, typeOfFreeze: "Pending" }).count()
            if (exist) errorCount++
            else response.push(obj)
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
        queryCond["typeOfFreeze"] = { $in: ["Pending", "Froze"] };
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

exports.getFreezeHistory = async (req, res) => {
    try {
        let queryCond = {};
        queryCond["typeOfFreeze"] = { $in: ["Canceled", "Froze"] };
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



exports.memberFreezeUpdate = async (req, res) => {
    req.body["fromDate"] && (req.body["fromDate"] = setTime(req.body.fromDate));
    req.body["toDate"] && (req.body["toDate"] = setTime(req.body.toDate));
    req.body["reactivationDate"] && (req.body["reactivationDate"] = setTime(req.body.reactivationDate))
    if (req.body.fromDate) {
        let memberInfo = await Member.findById(req.body.memberId).lean();
        const isFreezable = checkIsMemberFreezable(memberInfo.packageDetails, req.body.toDate);
        if (!isFreezable) return errorResponseHandler(res, isFreezable, 'Member do not have package for freeze');
    }
    MemberFreezing.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(response => {
            return successResponseHandler(res, response, "successfully updated freeze Member !")
        }).catch(error => {
            logger.error(error);
            errorResponseHandler(res, error, "failed to update freeze Member !");
        });
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






exports.cancelFreeze = async (req, res) => {
    try {
        const userData = await Member.findById(req.body.memberId)
            .populate('credentialId packageDetails.packages');
        let largestEndDate = new Date().getTime();
        for (const [i] of userData.packageDetails.entries()) {
            let temp = await cancelFreezeUpdate(userData, i, largestEndDate, req.body.returningDate);
            largestEndDate = new Date(temp) > new Date(largestEndDate) ? new Date(temp) : largestEndDate;
        };
        await MemberFreezing.findByIdAndUpdate(req.body.id, { typeOfFreeze: 'Canceled', returningDate: setTime(req.body.returningDate) });
        await freezeMember(userData.memberId, req.body.returningDate, largestEndDate);
        return successResponseHandler(res, '', "success");
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










