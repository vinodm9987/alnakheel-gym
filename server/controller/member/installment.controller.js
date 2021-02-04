const {
    logger: { logger },
    handler: { successResponseHandler, errorResponseHandler },
} = require('../../../config');
const { Formate: { setTime } } = require('../../utils');


const { Member, Employee } = require('../../model');




exports.getPackageInstallment = async (req, res) => {
    try {
        const members = await Member.find({})
            .populate('credentialId packageDetails.packages').lean();
        let response = [];
        for (const member of members) {
            for (const packages of member.packageDetails) {
                if (packages.Installments && packages.Installments.length) {
                    for (const installment of packages.Installments) {
                        const dueDate = new Date(setTime(installment.dueDate)).getTime();
                        const todayMonth = new Date(dueDate).getMonth();
                        const thisYear = new Date(dueDate).getFullYear();
                        const monthConditions = typeof req.body.month === 'number' ? req.body.month === todayMonth : true;
                        const yearConditions = typeof req.body.year === 'number' ? req.body.year === thisYear : true;
                        if (monthConditions && yearConditions && installment.paidStatus !== 'Paid') {
                            const memberObj = Object.assign({}, member);
                            delete memberObj.packageDetails;
                            memberObj['packageAmount'] = installment.actualAmount;
                            memberObj['dueDate'] = installment.dueDate;
                            memberObj['packages'] = packages.packages;
                            memberObj['packagesDetailsId'] = packages._id;
                            memberObj['installmentName'] = installment.installmentName;
                            memberObj['installmentId'] = installment._id.toString();
                            response.push(memberObj);
                        }
                    }
                }
            }
        }
        return successResponseHandler(res, response, 'success');
    } catch (error) {
        logger.error(error);
        return errorResponseHandler(res, error, 'failed');
    }
};


exports.getTrainerInstallment = async (req, res) => {
    try {
        const members = await Member.find({})
            .populate('credentialId  packageDetails.packages')
            .select({ faceRecognitionTemplate: 0 }).lean();
        let response = [];
        for (const member of members) {
            for (const packages of member.packageDetails) {
                if (packages.trainerDetails && packages.trainerDetails.length) {
                    for (const trainer of packages.trainerDetails) {
                        const trainerData = await Employee.findById(trainer.trainer)
                            .populate('credentialId')
                            .select({ faceRecognitionTemplate: 0 }).lean();
                        for (const installment of trainer.Installments) {
                            const dueDate = new Date(setTime(installment.dueDate));
                            const todayMonth = new Date(dueDate).getMonth();
                            const thisYear = new Date(dueDate).getFullYear();
                            const monthConditions = req.body.month ? req.body.month === todayMonth : true;
                            const yearConditions = req.body.year ? req.body.year === thisYear : true;
                            if (monthConditions && yearConditions && installment.paidStatus !== 'Paid') {
                                const memberObj = Object.assign({}, member);
                                delete memberObj.packageDetails;
                                memberObj['trainerAmount'] = installment.actualAmount;
                                memberObj['dueDate'] = installment.dueDate;
                                memberObj['packagesDetailsId'] = packages._id;
                                memberObj['trainerDetailsId'] = trainer._id;
                                memberObj['installmentName'] = installment.installmentName;
                                memberObj['installmentId'] = installment._id.toString();
                                memberObj['trainerData'] = trainerData;
                                response.push(memberObj);
                            }
                        }
                    }
                }
            }
        }
        return successResponseHandler(res, response, 'success');
    } catch (error) {
        logger.error(error);
        return errorResponseHandler(res, error, 'failed');
    }
};



exports.changeDueDateOfPackageInstallment = async (req, res) => {
    try {
        const dueDate = setTime(req.body.dueDate);
        const member = await Member.findById(req.body.memberId);
        for (const [i, packages] of member.packageDetails.entries()) {
            if (packages._id.toString() === req.body.packagesDetailsId) {
                for (const [j, installment] of member.packageDetails[i].Installments.entries()) {
                    if (installment._id.toString() === req.body.installmentId) {
                        member.packageDetails[i].Installments[j].dueDate = dueDate;
                    }
                }
            }
        }
        const response = await member.save();
        return successResponseHandler(res, response, "success");
    } catch (error) {
        logger.error(error);
        return errorResponseHandler(res, error, 'failed');
    }
};


exports.changeDueDateOfTrainerInstallment = async (req, res) => {
    try {
        const dueDate = setTime(req.body.dueDate);
        const member = await Member.findById(req.body.memberId);
        for (const [i, packages] of member.packageDetails.entries()) {
            if (packages[i]._id.toString() === req.body.packagesDetailsId) {
                for (const [j, trainer] of member.packageDetails[i].trainerDetails.entries()) {
                    if (trainer[j]._id.toString() === req.body.trainerDetailsId) {
                        for (const [k, installment] of member.packageDetails[i].trainerDetails[j].Installments.entries()) {
                            if (installment._id.toString() === req.body.installmentId) {
                                member.packageDetails[i].trainerDetails[j].Installments[k].dueDate = dueDate;
                            }
                        }
                    }
                }
            }
        }
        const response = await member.save();
        return successResponseHandler(res, response, "success");
    } catch (error) {
        logger.error(error);
        return errorResponseHandler(res, error, 'failed');
    }

};