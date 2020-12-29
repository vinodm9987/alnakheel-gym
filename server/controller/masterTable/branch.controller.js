/**  
 * utils.
*/

const { logger: { logger }, handler: { successResponseHandler, errorResponseHandler } } = require('../../../config')

/**
 * models.
*/

const { Branch } = require('../../model');


/**
 * get all Branch
*/


exports.getAllBranchForAdmin = (req, res) => {
    Branch.find({})
        .then(response => {
            successResponseHandler(res, response, "successfully get all Branch !!");
        }).catch(error => {
            logger.error(error);
            errorResponseHandler(res, error, "Exception while getting all Branch !");
        });
};





/**
 * get all active Branch
*/


exports.getAllBranch = (req, res) => {
    Branch.find({ status: true })
        .then(response => {
            successResponseHandler(res, response, "successfully get all active Branch !!");
        }).catch(error => {
            logger.error(error);
            errorResponseHandler(res, error, "Exception while getting all active Branch !");
        });
};



/**
 * get all active Branch
*/


exports.getBranchById = (req, res) => {
    Branch.findById(req.params.id)
        .then(response => {
            successResponseHandler(res, response, "successfully get  Branch by id !!");
        }).catch(error => {
            logger.error(error);
            errorResponseHandler(res, error, "Exception while getting  Branch by id !");
        });
};




/**
 *  create new Branch 
*/


exports.addBranch = (req, res) => {
    let newBranch = new Branch(req.body);
    newBranch.save().then(response => {
        return successResponseHandler(res, response, "successfully added new Branch !!");
    }).catch(error => {
        logger.error(error);
        if (error.message.indexOf('duplicate key error') !== -1)
            return errorResponseHandler(res, error, "Branch name is already exist !");
        else
            return errorResponseHandler(res, error, "Exception occurred !");
    });
};





/**
 *  update Branch 
*/


exports.updateBranch = (req, res) => {
    Branch.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(response => {
            return successResponseHandler(res, response, "successfully updated Branch !!");
        }).catch(error => {
            logger.error(error);
            if (error.message.indexOf('duplicate key error') !== -1)
                return errorResponseHandler(res, error, "Branch name is already exist !");
            else
                return errorResponseHandler(res, error, "Exception occurred !");
        });
};

