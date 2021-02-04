
const { logger: { logger }, handler: { successResponseHandler, errorResponseHandler },
} = require('../../../config');
const { Formate: { setTime } } = require('../../utils');


const { Member, } = require('../../model');




exports.getPackageInstallment = async (req, res) => {
    try {
        const members = await Member.find({})
            .populate('credentialId packageDetails.packages').lean();
        const today = new Date(setTime(new Date())).getTime();
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
                            memberObj['packages'] = packages;
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
            .populate('credentialId  packageDetails.packages').lean();
        let response = [];
        for (const member of members) {
            for (const packages of member.packageDetails) {
                if (packages.trainerDetails && packages.trainerDetails.length) {
                    for (const trainer of packages.trainerDetails) {
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
                                memberObj['packages'] = packages;
                                memberObj['installmentId'] = installment._id.toString();
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
