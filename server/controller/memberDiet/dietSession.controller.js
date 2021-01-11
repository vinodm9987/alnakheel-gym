/**  
 * utils.
*/

const { logger: { logger }, handler: { successResponseHandler, errorResponseHandler } } = require('../../../config');
const { auditLogger } = require('../../middleware/auditlog.middleware');

/**
 * models.
*/

const { DietSession } = require('../../model');


/**
 * get all DietSession
*/


exports.getAllDietSessionForAdmin = (req, res) => {
    DietSession.find({})
        .then(response => {
            successResponseHandler(res, response, "successfully get all DietSession !!");
        }).catch(error => {
            logger.error(error);
            errorResponseHandler(res, error, "Exception while getting all DietSession !");
        });
};





/**
 * get all active DietSession
*/


exports.getAllDietSession = (req, res) => {
    DietSession.find({ status: true })
        .then(response => {
            successResponseHandler(res, response, "successfully get all active DietSession !!");
        }).catch(error => {
            logger.error(error);
            errorResponseHandler(res, error, "Exception while getting all active DietSession !");
        });
};



/**
 * get all active DietSession
*/


exports.getDietSessionById = (req, res) => {
    DietSession.findById(req.params.id)
        .then(response => {
            successResponseHandler(res, response, "successfully get  DietSession by id !!");
        }).catch(error => {
            logger.error(error);
            errorResponseHandler(res, error, "Exception while getting  DietSession by id !");
        });
};




/**
 *  create new DietSession 
*/


exports.addDietSession = (req, res) => {
    let newDietSession = new DietSession(req.body);
    newDietSession.save().then(response => {
        auditLogger(req, 'Success')
        return successResponseHandler(res, response, "successfully added new DietSession !!");
    }).catch(error => {
        logger.error(error);
        auditLogger(req, 'Failed')
        if (error.message.indexOf('duplicate key error') !== -1)
            return errorResponseHandler(res, error, "DietSession name is already exist !");
        else
            return errorResponseHandler(res, error, "Exception occurred !");
    });
};





/**
 *  update DietSession 
*/


exports.updateDietSession = async (req, res) => {
    req.responseData = await DietSession.findById(req.params.id).lean()
    DietSession.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(response => {
            auditLogger(req, 'Success')
            return successResponseHandler(res, response, "successfully updated DietSession !!");
        }).catch(error => {
            logger.error(error);
            auditLogger(req, 'Failed')
            if (error.message.indexOf('duplicate key error') !== -1)
                return errorResponseHandler(res, error, "DietSession name is already exist !");
            else
                return errorResponseHandler(res, error, "Exception occurred !");
        });
};

