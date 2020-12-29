/**  
 * utils.
*/

const { logger: { logger }, handler: { successResponseHandler, errorResponseHandler }, config: { DESIGNATION } } = require('../../../config')

/**
 * models.
*/

const { Designation } = require('../../model');


/**
 * get all designation
*/


exports.getAllDesignationForAdmin = (req, res) => {
    Designation.find({})
        .then(response => {
            successResponseHandler(res, response, "successfully get all designation !!");
        }).catch(error => {
            logger.error(error);
            errorResponseHandler(res, error, "Exception while getting all designation !");
        });
};





/**
 * get all active designation
*/


exports.getAllDesignation = (req, res) => {
    Designation.find({ status: true })
        .then(response => {
            successResponseHandler(res, response, "successfully get all active designation !!");
        }).catch(error => {
            logger.error(error);
            errorResponseHandler(res, error, "Exception while getting all active designation !");
        });
};



/**
 * get all designation
*/


exports.getDesignationForFilter = async (req, res) => {
    try {
        let response = await Designation.find({ designationName: { $nin: DESIGNATION.slice(0, 3) }, status: true })
        successResponseHandler(res, response, "successfully get all designation !!");
    } catch (error) {
        logger.error(error);
        errorResponseHandler(res, error, "Exception while getting all designation !");
    }

};



/**
 * get  designation by id
*/


exports.getDesignationById = (req, res) => {
    Designation.findById(req.params.id)
        .then(response => {
            successResponseHandler(res, response, "successfully get  designation by id !!");
        }).catch(error => {
            logger.error(error);
            errorResponseHandler(res, error, "Exception while getting  designation by id !");
        });
};





/**
 *  create new designation 
*/


exports.addDesignation = (req, res) => {
    let newDesignation = new Designation(req.body);
    newDesignation.save().then(response => {
        return successResponseHandler(res, response, "successfully added new Designation !!");
    }).catch(error => {
        logger.error(error);
        if (error.message.indexOf('duplicate key error') !== -1)
            return errorResponseHandler(res, error, "Designation name is already exist !");
        else
            return errorResponseHandler(res, error, "Exception occurred !");
    });
};





/**
 *  update designation 
*/


exports.updateDesignation = (req, res) => {
    Designation.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(response => {
            return successResponseHandler(res, response, "successfully updated Designation !!");
        }).catch(error => {
            logger.error(error);
            if (error.message.indexOf('duplicate key error') !== -1)
                return errorResponseHandler(res, error, "Designation name is already exist !");
            else
                return errorResponseHandler(res, error, "Exception occurred !");
        });
};

