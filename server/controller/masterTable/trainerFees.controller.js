/**  
 * utils.
*/

const { logger: { logger }, handler: { successResponseHandler, errorResponseHandler } } = require('../../../config');

/**
 * models.
*/

const { TrainerFees, Employee } = require('../../model');


/**
 * get all TrainerFees
*/


exports.getAllTrainerFeesForAdmin = async (req, res) => {
    try {
        let queryCond = {}
        if (req.body.branchFilter) {
            queryCond["branch"] = req.body.branchFilter
        }
        let response = await TrainerFees.find(queryCond)
            .populate('trainerName period branch')
            .populate({ path: "trainerName", populate: { path: "credentialId" } })
            .populate({ path: "trainerName", populate: { path: "branch" } }).lean()
        if (req.body.search) {
            let search = req.body.search.toLowerCase()
            let newResponse = response.filter(doc => {
                let empId = doc.trainerName.employeeId.toString()
                if (doc.trainerName.credentialId.userName.toLowerCase().includes(search) || doc.trainerName.credentialId.email.toLowerCase().includes(search) || empId.includes(search)) {
                    return doc
                }
            })
            return successResponseHandler(res, newResponse, "successfully get all TrainerFees !!");
        } else {
            return successResponseHandler(res, response, "successfully get all TrainerFees !!");
        }
    } catch (error) {
        logger.error(error);
        errorResponseHandler(res, error, "Exception while getting all TrainerFees !");
    }
};





/**
 * get all active TrainerFees
*/


exports.getAllTrainerFees = (req, res) => {
    TrainerFees.find({ status: true })
        .populate('trainerName period branch')
        .populate({ path: "trainerName", populate: { path: "credentialId" } })
        .populate({ path: "trainerName", populate: { path: "branch" } })
        .then(response => {
            successResponseHandler(res, response, "successfully get all active TrainerFees !!");
        }).catch(error => {
            logger.error(error);
            errorResponseHandler(res, error, "Exception while getting all active TrainerFees !");
        });
};





/**
 * get  TrainerFees by id
*/


exports.getTrainerFeesById = (req, res) => {
    TrainerFees.findById(req.params.id)
        .then(response => {
            successResponseHandler(res, response, "successfully get  TrainerFees by id !!");
        }).catch(error => {
            logger.error(error);
            errorResponseHandler(res, error, "Exception while getting  TrainerFees by id !");
        });
};





/**
 *  create new TrainerFees 
*/


exports.addTrainerFees = async (req, res) => {
    try {
        let newTrainerFees = new TrainerFees(req.body);
        let response = await newTrainerFees.save();
        let newResponse = await TrainerFees.findById(response._id).populate('trainerName period branch')
            .populate({ path: "trainerName", populate: { path: "credentialId" } })
            .populate({ path: "trainerName", populate: { path: "branch" } })
        return successResponseHandler(res, newResponse, "successfully added new fees !")
    } catch (error) {
        logger.error(error);
        if (error.message.indexOf('duplicate key error') !== -1)
            return errorResponseHandler(res, error, "Trainer name is already exist !");
        else
            return errorResponseHandler(res, error, "Exception occurred !");
    }
};



/**
 *  update TrainerFees 
*/


exports.updateTrainerFees = (req, res) => {
    TrainerFees.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .populate('trainerName period branch')
        .populate({ path: "trainerName", populate: { path: "credentialId" } })
        .populate({ path: "trainerName", populate: { path: "branch" } })
        .then(response => {
            return successResponseHandler(res, response, "successfully updated TrainerFees !!");
        }).catch(error => {
            logger.error(error);
            if (error.message.indexOf('duplicate key error') !== -1)
                return errorResponseHandler(res, error, "Trainer name is already exist !");
            else
                return errorResponseHandler(res, error, "Exception occurred !");
        });
};




/**
 *  get trainer by branch
*/

exports.getUniqueTrainerByBranch = async (req, res) => {
    try {
        let trainer = await TrainerFees.find({ branch: req.params.branchId, status: true }).distinct('trainerName').lean()
        let response = await Employee.find({ '_id': { $in: trainer }, status: true }).populate('credentialId')
        return successResponseHandler(res, response, "successfully get unique trainer by branch !!");
    } catch (error) {
        logger.error(error);
        errorResponseHandler(res, error, "Exception while getting  getUniqueTrainerByBranch !");
    };
}




exports.getPeriodOfTrainer = (req, res) => {
    TrainerFees.find({ trainerName: req.body.trainerName, branch: req.body.branch, status: true })
        .populate('period')
        .then(response => {
            return successResponseHandler(res, response, "successfully updated TrainerFees !!");
        }).catch(error => {
            logger.error(error);
            return errorResponseHandler(res, error, "Exception occurred !");
        });
}