/**  
 * utils.
*/

const { logger: { logger }, handler: { successResponseHandler, errorResponseHandler } } = require('../../../config')


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
        return successResponseHandler(res, response, "successfully added new Period !!");
    }).catch(error => {
        logger.error(error);
        if (error.message.indexOf('duplicate key error') !== -1)
            return errorResponseHandler(res, error, "Period name is already exist !");
        else
            return errorResponseHandler(res, error, "Exception occurred !");
    });
};





/**
 *  create new period 
*/


exports.updatePeriod = (req, res) => {
    Period.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(response => {
            return successResponseHandler(res, response, "successfully updated new Period !!");
        }).catch(error => {
            logger.error(error);
            if (error.message.indexOf('duplicate key error') !== -1)
                return errorResponseHandler(res, error, "Period name is already exist !");
            else
                return errorResponseHandler(res, error, "Exception occurred !");
        });
};

