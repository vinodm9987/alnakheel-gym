/**
 * utils.
*/

const { logger: { logger }, handler: { successResponseHandler, errorResponseHandler }, upload: { uploadAvatar } } = require('../../../config');
const { auditLogger } = require('../../middleware/auditlog.middleware');


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
    uploadAvatar(req, res, async (err, result) => {
        if (err) return errorResponseHandler(res, err, "while uploading photo error occurred !");
        let data = JSON.parse(req.body.data)
        let newBranch = new Branch(data);
        newBranch["avatar"] = req.files[0]
        newBranch.save().then(response => {
            auditLogger(req, 'Success')
            return successResponseHandler(res, response, "successfully added new Branch !!");
        }).catch(error => {
            logger.error(error);
            auditLogger(req, 'Failed')
            if (error.message.indexOf('duplicate key error') !== -1)
                return errorResponseHandler(res, error, "Branch name is already exist !");
            else
                return errorResponseHandler(res, error, "Exception occurred !");
        });
    });
};





/**
 *  update Branch
*/


exports.updateBranch = async (req, res) => {
    uploadAvatar(req, res, async (error, result) => {
        if (error) return errorResponseHandler(res, error, "while uploading photo error occurred !");
        let data = (req.body && req.body.data) ? JSON.parse(req.body.data) : req.body
        if (req.files && req.files.length !== 0) data["avatar"] = req.files[0]
        req.responseData = await Branch.findById(req.params.id).lean()
        Branch.findByIdAndUpdate(req.params.id, data, { new: true })
            .then(response => {
                auditLogger(req, 'Success')
                return successResponseHandler(res, response, "successfully updated Branch !!");
            }).catch(error => {
                logger.error(error);
                auditLogger(req, 'Failed')
                if (error.message.indexOf('duplicate key error') !== -1)
                    return errorResponseHandler(res, error, "Branch name is already exist !");
                else
                    return errorResponseHandler(res, error, "Exception occurred !");
            });
    });
};

