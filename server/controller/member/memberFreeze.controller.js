/**  
 * utils.
*/

const { logger: { logger }, handler: { successResponseHandler, errorResponseHandler } } = require('../../../config');

const { Formate: { setTime } } = require('../../utils');

const { bioStarToken } = require('../../biostar');

const { setConnection, jobs, startWorker, workerEvent,
    connectQueue, addQueued } = require('../../worker/freeze')

/**  
 * models.
*/

const { MemberFreezing, Member } = require('../../model');





/**
 *  Member Freezing Controller
*/



exports.applyFreezeMember = async (req, res) => {
    try {
        req.body["fromDate"] = setTime(req.body.fromDate);
        req.body["toDate"] = setTime(req.body.toDate);
        req.body["reactivationDate"] = setTime(req.body.reactivationDate)
        const exist = await MemberFreezing.find({ memberId: req.body.memberId, status: "Pending" }).count()
        if (exist) {
            const response = await MemberFreezing.findOneAndUpdate({ memberId: req.body.memberId, status: "Pending" }, req.body, { returnNewDocuments: true })
            return successResponseHandler(res, response, "successfully updated freeze Member !")
        } else {
            const completeExist = await MemberFreezing.find({ memberId: req.body.memberId, status: "Completed", toDate: { $gte: req.body.fromDate } }).count()
            if (!completeExist) {
                const newRecord = new MemberFreezing(req.body);
                const newResponse = await newRecord.save()
                return successResponseHandler(res, newResponse, "successfully freeze Member !")
            } else {
                return errorResponseHandler(res, 'error', "Sorry you have already freezed for this period!");
            }
        }
    } catch (error) {
        logger.error(error);
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
            return successResponseHandler(res, newResponse, `${response.length} out of ${req.body.members.length} members successfully freezed !`)
        } else {
            return errorResponseHandler(res, error, `${errorCount} out of ${req.body.members.length} members not freezed !`)
        }
    } catch (error) {
        logger.error(error);
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
        let newResponse = response.filter(doc => {
            if (search) {
                let temp = doc.memberId.credentialId.email.toLowerCase()
                let temp1 = doc.memberId.credentialId.userName.toLowerCase()
                let temp2 = doc.memberId.memberId.toString()
                if (temp.includes(search) || temp1.includes(search) || temp2.includes(search)) return doc
            } else {
                return doc;
            }
        });
        return successResponseHandler(res, newResponse, "successfully getting pending Member!");
    } catch (error) {
        logger.error(error);
        errorResponseHandler(res, error, "failed to get pending freeze Member !");
    }
};






exports.removeMemberFreeze = (req, res) => {
    MemberFreezing.findOneAndDelete({ _id: req.body._id })
        .then((response) => {
            return successResponseHandler(res, response, "successfully removed freeze Member !")
        }).catch((error) => {
            logger.error(error);
            return errorResponseHandler(res, error, "failed to remove freeze Member !");
        });
};




exports.freezeMember = async (req, res) => {
    const connection = setConnection();
    const job = jobs();
    const queue = await connectQueue(connection, job);
    const worker = await startWorker(connection, job)
    workerEvent(worker);
    const { member } = req.body;
    const users = member.map(doc => { return doc.member });
    for (let i = 0; i < member.length; i++) {
        let startDate = new Date(member[i].reactivation).toISOString();
        let largest = setTime(new Date());
        member[i].packageDetails.forEach(async (doc, index) => {
            let temp = await memberFreeze(doc, largest, member[i].days, member[i]._id, startDate);
            largest = new Date(temp) > new Date(largest) ? new Date(temp) : largest;
            if (index === member[i].packageDetails.length - 1) {
                if (i === member.length - 1) {
                    await addQueued(queue, "notification", [users]);
                }
                const headers = await bioStarToken();
                await addQueued(queue, "biostar", [member[i].memberId, startDate, new Date(largest).toISOString(), headers]);
            }
        });
    }
    worker.start();
    successResponseHandler(res, [], "successfully freeze member !");
};



const memberFreeze = async (doc, largest, days, _id, reactivationDate) => {
    const freezeDate = setTime(new Date());
    if (!doc.isExpiredPackage && doc.extendDate) {
        await Member.update({ "packageDetails._id": doc._id }, {
            $set: {
                "packageDetails.$.extendDate": new Date(doc.extendDate).setDate(new Date(doc.extendDate).getDate() + days),
                "packageDetails.$.reactivationDate": reactivationDate, "packageDetails.$.freezeDate": freezeDate
            }
        });
        await MemberFreezing.findByIdAndUpdate(_id, { status: "Completed" })
        if (new Date(doc.extendDate) > new Date(largest)) { largest = new Date(doc.extendDate).setDate(new Date(doc.extendDate).getDate() + days) }
    } else if (!doc.isExpiredPackage && doc.endDate) {
        await Member.update({ "packageDetails._id": doc._id }, {
            $set: {
                "packageDetails.$.extendDate": new Date(new Date(doc.endDate).setDate(new Date(doc.endDate).getDate() + days)),
                "packageDetails.$.reactivationDate": reactivationDate, "packageDetails.$.freezeDate": freezeDate
            }
        });
        await MemberFreezing.findByIdAndUpdate(_id, { status: "Completed" })
        if (new Date(doc.endDate) > new Date(largest)) { largest = new Date(new Date(doc.endDate).setDate(new Date(doc.endDate).getDate() + days)); }
    }
    if (!doc.isExpiredTrainer && doc.trainerExtend) {
        await Member.update({ "packageDetails._id": doc._id }, { $set: { "packageDetails.$.trainerExtend": new Date(doc.trainerExtend).setDate(new Date(doc.trainerExtend).getDate() + days) } });
    } else if (!doc.isExpiredTrainer && doc.trainerEnd) {
        await Member.update({ "packageDetails._id": doc._id }, { $set: { "packageDetails.$.trainerExtend": new Date(doc.trainerEnd).setDate(new Date(doc.trainerEnd).getDate() + days) } });
    }
    return largest;
};








exports.getFreezeHistory = async (req, res) => {
    try {
        let queryCond = {};
        queryCond["status"] = "Completed";
        if (req.body.date) queryCond["reactivationDate"] = setTime(req.body.date);
        const response = await MemberFreezing.find(queryCond).populate('memberId')
            .populate({ path: 'memberId', populate: { path: 'credentialId' } }).lean();
        const search = req.body.search.toLowerCase();
        let newResponse = response.filter(doc => {
            if (search) {
                let temp = doc.memberId.credentialId.email.toLowerCase();
                let temp1 = doc.memberId.credentialId.userName.toLowerCase();
                let temp2 = doc.memberId.memberId.toString();
                if (temp.includes(search) || temp1.includes(search) || temp2.includes(search))
                    return doc
            } else {
                return doc;
            }
        });
        return successResponseHandler(res, newResponse, 'successfully get freeze history !');
    } catch (error) {
        logger.error(error);
        return errorResponseHandler(res, error, 'failed to get freeze history!');
    }
};