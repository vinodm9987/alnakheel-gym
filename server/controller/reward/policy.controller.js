/**  
 * utils.
*/

const { logger: { logger }, handler: { successResponseHandler, errorResponseHandler } } = require('../../../config');
const { Formate: { setTime } } = require('../../utils');


/**
 * models.
*/

const { RewardPolicy } = require('../../model');
const { auditLogger } = require('../../middleware/auditlog.middleware');




/**
 *****  RewardPolicy controller  *****
*/


exports.addNewPolicy = async (req, res) => {
    const { policyCategory } = req.body;
    req.body["startDate"] = setTime(req.body.startDate);
    req.body["endDate"] = setTime(req.body.endDate);
    let isExists = await RewardPolicy.findOne({ policyCategory }).lean();
    if (policyCategory === "Referral" && isExists) {
        auditLogger(req, 'Failed')
        return errorResponseHandler(res, 'error', "Referral is already exists , kindly update that ! ");
    } else {
        let newPolicy = new RewardPolicy(req.body);
        newPolicy.save().then((response) => {
            auditLogger(req, 'Success')
            return successResponseHandler(res, response, "successfully add new policy")
        }).catch(error => {
            logger.error(error);
            auditLogger(req, 'Failed')
            errorResponseHandler(res, error, "error ocurred while create new policy");
        });
    }
};





exports.updatePolicy = async (req, res) => {
    const { policyCategory, startDate, endDate } = req.body;
    if (startDate) req.body["startDate"] = setTime(req.body.startDate);
    if (endDate) req.body["endDate"] = setTime(req.body.endDate);
    const isExists = await RewardPolicy.findOne({ policyCategory }).lean();
    if (policyCategory === "Referral" && isExists && isExists._id.toString() !== req.params.id) {
        return errorResponseHandler(res, 'error', "Referral is already exists , kindly update that ! ");
    } else {
        req.responseData = await RewardPolicy.findById(req.params.id).lean()
        RewardPolicy.findByIdAndUpdate(req.params.id, req.body, { new: true }).then((response) => {
            auditLogger(req, 'Success')
            return successResponseHandler(res, response, "successfully update new policy");
        }).catch(error => {
            logger.error(error);
            auditLogger(req, 'Failed')
            return errorResponseHandler(res, error, "error ocurred while update policy");
        });
    }
};




exports.getAllPolicy = (req, res) => {
    RewardPolicy.find({ status: true, endDate: { $gte: setTime(new Date()) }, memberDashBoard: 'Yes' })
        .then((response) => {
            successResponseHandler(res, response, "successfully get all policy");
        }).catch(error => {
            logger.error(error);
            errorResponseHandler(res, error, "error ocurred getting all policy");
        });
};




exports.getAllPolicyForAdmin = (req, res) => {
    RewardPolicy.find({})
        .then((response) => {
            successResponseHandler(res, response, "successfully get all policy");
        }).catch(error => {
            logger.error(error);
            errorResponseHandler(res, error, "error ocurred getting all policy");
        });
};



exports.getPolicyById = (req, res) => {
    RewardPolicy.findById(req.params.id)
        .then((response) => {
            successResponseHandler(res, response, "successfully get all policy");
        }).catch(error => {
            logger.error(error);
            errorResponseHandler(res, error, "error ocurred getting all policy");
        });
};


