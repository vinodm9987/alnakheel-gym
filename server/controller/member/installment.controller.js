const {
    logger: { logger },
    handler: { successResponseHandler, errorResponseHandler },
} = require('../../../config');
const { Formate: { setTime }, IdGenerator: { generateOrderId } } = require('../../utils');


const { Member, Employee } = require('../../model');


const { disableMember } = require('../../biostar')

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
                            const monthConditions = typeof req.body.month === 'number' ? req.body.month === todayMonth : false;
                            const yearConditions = typeof req.body.year === 'number' ? req.body.year === thisYear : false;
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
        const member = await Member.findByIdAndUpdate(req.body.memberId, { status: true });
        await disableMember(member.memberId, 'AC')
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
            if (packages._id.toString() === req.body.packagesDetailsId) {
                for (const [j, trainer] of member.packageDetails[i].trainerDetails.entries()) {
                    if (trainer._id.toString() === req.body.trainerDetailsId) {
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

exports.payPackageInstallments = async (req, res) => {
    try {
        const dueDate = setTime(req.body.dueDate);
        const member = await Member.findByIdAndUpdate(req.body.memberId, { status: true });
        await disableMember(member.memberId, 'AC')
        let obj = Object.assign({}, {});
        for (const [i, packages] of member.packageDetails.entries()) {
            if (packages._id.toString() === req.body.packagesDetailsId && packages.Installments) {
                for (const [k, installment] of member.packageDetails[i].Installments.entries()) {
                    if (installment._id.toString() === req.body.installmentId) {
                        obj['dateOfPaid'] = setTime(new Date());
                        obj['timeOfPaid'] = new Date();
                        obj['cardNumber'] = req.body.cardNumber;
                        obj['cashAmount'] = req.body.cashAmount;
                        obj['cardAmount'] = req.body.cardAmount;
                        obj['vatAmount'] = req.body.vatAmount;
                        obj['discount'] = req.body.discount;
                        obj['digitalAmount'] = req.body.digitalAmount;
                        obj['chequeAmount'] = req.body.chequeAmount;
                        obj['chequeNumber'] = req.body.chequeNumber;
                        obj['bankName'] = req.body.bankName;
                        obj['chequeDate'] = req.body.chequeDate;
                        obj['totalAmount'] = req.body.totalAmount;
                        obj['actualAmount'] = req.body.actualAmount;
                        obj['paidStatus'] = 'Paid';
                        obj['dueDate'] = dueDate;
                        obj['installmentName'] = req.body.installmentName;
                        obj["orderNo"] = generateOrderId()
                        if (req.headers.userid) obj["doneBy"] = req.headers.userid;
                        member.packageDetails[i].Installments[k] = obj
                    }
                }
            }
        }
        await member.save();
        const response = await Member.findById(req.body.memberId)
            .populate('credentialId branch packageDetails.packages packageDetails.doneBy')
        return successResponseHandler(res, { ...response, ...{ displayReceipt: true, orderNo: obj.orderNo } }, "success");
    } catch (error) {
        logger.error(error);
        return errorResponseHandler(res, error, 'failed');
    }
};


exports.payTrainerInstallments = async (req, res) => {
    try {
        const dueDate = setTime(req.body.dueDate);
        const member = await Member.findById(req.body.memberId);
        let obj = Object.assign({}, {});
        for (const [i, packages] of member.packageDetails.entries()) {
            if (packages._id.toString() === req.body.packagesDetailsId) {
                for (const [j, trainer] of member.packageDetails[i].trainerDetails.entries()) {
                    if (trainer._id.toString() === req.body.trainerDetailsId) {
                        for (const [k, installment] of member.packageDetails[i].trainerDetails[j].Installments.entries()) {
                            if (installment._id.toString() === req.body.installmentId) {
                                obj['dateOfPaid'] = setTime(new Date());
                                obj['timeOfPaid'] = new Date();
                                obj['cardNumber'] = req.body.cardNumber;
                                obj['cashAmount'] = req.body.cashAmount;
                                obj['cardAmount'] = req.body.cardAmount;
                                obj['vatAmount'] = req.body.vatAmount;
                                obj['discount'] = req.body.discount;
                                obj['digitalAmount'] = req.body.digitalAmount;
                                obj['chequeAmount'] = req.body.chequeAmount;
                                obj['chequeNumber'] = req.body.chequeNumber;
                                obj['bankName'] = req.body.bankName;
                                obj['chequeDate'] = req.body.chequeDate;
                                obj['totalAmount'] = req.body.totalAmount;
                                obj['actualAmount'] = req.body.actualAmount;
                                obj['paidStatus'] = 'Paid';
                                obj['dueDate'] = dueDate;
                                obj['installmentName'] = req.body.installmentName;
                                obj["orderNo"] = generateOrderId()
                                if (req.headers.userid) obj["doneBy"] = req.headers.userid;
                                member.packageDetails[i].trainerDetails[j].Installments[k] = obj
                            }
                        }
                    }
                }
            }
        }
        await member.save();
        const response = await Member.findById(req.body.memberId)
            .populate('credentialId branch')
            .populate('packageDetails.doneBy')
        return successResponseHandler(res, { ...response, ...{ displayReceipt: true, orderNo: obj.orderNo } }, "success");
    } catch (error) {
        logger.error(error);
        return errorResponseHandler(res, error, 'failed');
    }
};