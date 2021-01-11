/**  
 * utils.
*/

const { logger: { logger }, handler: { successResponseHandler, errorResponseHandler } } = require('../../../config');
const { auditLogger } = require('../../middleware/auditlog.middleware');


/**
 * models.
*/

const { Period } = require('../../model');








/**
 * get all period
*/


exports.getAllPeriodForAdmin = (req, res) => {
    Period.find({})
        .then(response => {
            successResponseHandler(res, response, "successfully get all Period !!");
        }).catch(error => {
            logger.error(error);
            errorResponseHandler(res, error, "Exception while getting all Period !");
        });
};




/**
 * get all active period
*/


exports.getAllPeriod = (req, res) => {
    Period.find({ status: true })
        .then(response => {
            successResponseHandler(res, response, "successfully get all Period !!");
        }).catch(error => {
            logger.error(error);
            errorResponseHandler(res, error, "Exception while getting all Period !");
        });
};






/**
 *  create new period 
*/


exports.addPeriod = (req, res) => {
    let newPeriod = new Period(req.body);
    newPeriod.save().then(response => {
        auditLogger(req, 'Success')
        return successResponseHandler(res, response, "successfully added new Period !!");
    }).catch(error => {
        logger.error(error);
        auditLogger(req, 'Failed')
        if (error.message.indexOf('duplicate key error') !== -1)
            return errorResponseHandler(res, error, "Period name is already exist !");
        else
            return errorResponseHandler(res, error, "Exception occurred !");
    });
};





/**
 *  create new period 
*/


exports.updatePeriod = async (req, res) => {
    req.responseData = await Period.findById(req.params.id).lean()
    Period.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(response => {
            auditLogger(req, 'Success')
            return successResponseHandler(res, response, "successfully updated new Period !!");
        }).catch(error => {
            logger.error(error);
            auditLogger(req, 'Failed')
            if (error.message.indexOf('duplicate key error') !== -1)
                return errorResponseHandler(res, error, "Period name is already exist !");
            else
                return errorResponseHandler(res, error, "Exception occurred !");
        });
};

