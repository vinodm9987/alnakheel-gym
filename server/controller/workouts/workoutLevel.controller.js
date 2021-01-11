/**  
 * utils.
*/

const { logger: { logger }, handler: { successResponseHandler, errorResponseHandler } } = require('../../../config');
const { auditLogger } = require('../../middleware/auditlog.middleware');

/**
 * models.
*/

const { WorkoutLevel } = require('../../model');


/**
 * get all WorkoutLevel
*/


exports.getAllWorkoutLevelForAdmin = (req, res) => {
    WorkoutLevel.find({})
        .populate('workout')
        .then(response => {
            successResponseHandler(res, response, "successfully get all WorkoutLevel !!");
        }).catch(error => {
            logger.error(error);
            errorResponseHandler(res, error, "Exception while getting all WorkoutLevel !");
        });
};





/**
 * get all active WorkoutLevel
*/


exports.getAllWorkoutLevel = (req, res) => {
    WorkoutLevel.find({ status: true })
        .populate('workout')
        .then(response => {
            successResponseHandler(res, response, "successfully get all active WorkoutLevel !!");
        }).catch(error => {
            logger.error(error);
            errorResponseHandler(res, error, "Exception while getting all active WorkoutLevel !");
        });
};



/**
 * get all active WorkoutLevel
*/


exports.getWorkoutLevelById = (req, res) => {
    WorkoutLevel.findById(req.params.id)
        .then(response => {
            successResponseHandler(res, response, "successfully get  WorkoutLevel by id !!");
        }).catch(error => {
            logger.error(error);
            errorResponseHandler(res, error, "Exception while getting  WorkoutLevel by id !");
        });
};




/**
 *  create new WorkoutLevel 
*/


exports.addWorkoutLevel = (req, res) => {
    let newWorkoutLevel = new WorkoutLevel(req.body);
    newWorkoutLevel.save().then(response => {
        auditLogger(req, 'Success')
        return successResponseHandler(res, response, "successfully added new WorkoutLevel !!");
    }).catch(error => {
        logger.error(error);
        auditLogger(req, 'Failed')
        if (error.message.indexOf('duplicate key error') !== -1)
            return errorResponseHandler(res, error, "WorkoutLevel name is already exist !");
        else
            return errorResponseHandler(res, error, "Exception occurred !");
    });
};





/**
 *  update WorkoutLevel 
*/


exports.updateWorkoutLevel = async (req, res) => {
    req.responseData = await WorkoutLevel.findById(req.params.id).lean()
    WorkoutLevel.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(response => {
            auditLogger(req, 'Success')
            return successResponseHandler(res, response, "successfully updated WorkoutLevel !!");
        }).catch(error => {
            logger.error(error);
            auditLogger(req, 'Failed')
            if (error.message.indexOf('duplicate key error') !== -1)
                return errorResponseHandler(res, error, "WorkoutLevel name is already exist !");
            else
                return errorResponseHandler(res, error, "Exception occurred !");
        });
};

