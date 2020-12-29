/**  
 * utils.
*/

const { logger: { logger }, upload: { uploadAvatar }, handler: { successResponseHandler, errorResponseHandler }, } = require('../../../config')


/**
 * models.
*/

const { Workout } = require('../../model');



/**
 * get all  Workout
*/


exports.getAllWorkoutForAdmin = (req, res) => {
    Workout.find()
        .then(response => {
            successResponseHandler(res, response, "successfully get all active Workout !!");
        }).catch(error => {
            logger.error(error);
            errorResponseHandler(res, error, "Exception while getting all active Workout !");
        });
};


exports.getAllWorkoutByFilter = async (req, res) => {
    try {
        let queryCond = {}
        queryCond["workoutCategories"] = 'Workouts'
        if (req.body.workoutCategories) {
            queryCond["workoutCategories"] = req.body.workoutCategories
        }
        let response = await Workout.find(queryCond).lean()
        let newResponse = response.filter(doc => {
            let search = req.body.search.toLowerCase()
            if (search) {
                let temp = doc.workoutName.toLowerCase()
                let temp1 = doc.instructions.toLowerCase()
                if (temp.includes(search) || temp1.includes(search)) {
                    return doc
                }
            } else {
                return doc;
            }
        });
        successResponseHandler(res, newResponse, "successfully get all  Workout by filter !!");
    } catch (error) {
        logger.error(error);
        errorResponseHandler(res, error, "Exception while getting all active Workout !");
    }
};


exports.getAllWorkoutByWorkoutCategory = async (req, res) => {
    Workout.find({ status: true, workoutCategories: req.body.workoutCategories })
        .then(response => {
            successResponseHandler(res, response, "successfully get all active Workout !!");
        }).catch(error => {
            logger.error(error);
            errorResponseHandler(res, error, "Exception while getting all active Workout !");
        });
};



/**
 * get all active Workout
*/
exports.getAllWorkouts = (req, res) => {
    Workout.find({ status: true })
        .then(response => {
            successResponseHandler(res, response, "successfully get all active Workout !!");
        }).catch(error => {
            logger.error(error);
            errorResponseHandler(res, error, "Exception while getting all active Workout !");
        });
};



/**
 * get  Workout by id
*/


exports.getWorkoutById = (req, res) => {
    Workout.findById(req.params.id)
        .then(response => {
            successResponseHandler(res, response, "successfully get  Workout by id !!");
        }).catch(error => {
            logger.error(error);
            errorResponseHandler(res, error, "Exception while getting  Workout by id !");
        });
};




/**
 *  create new Workout 
*/


exports.addWorkout = (req, res) => {
    uploadAvatar(req, res, async (error, data) => {
        if (error)
            return errorResponseHandler(res, error, "while uploading profile error occurred !");
        try {
            const data = JSON.parse(req.body.data);
            const newWorkout = new Workout(data);
            if (req.files) {
                for (let i in req.files) {
                    if (req.files[i].fieldname === "workoutsImages") newWorkout["workoutsImages"] = req.files[i]
                    if (req.files[i].fieldname === "workoutsVideo") newWorkout["workoutsVideo"] = req.files[i]
                }
            }
            const response = await newWorkout.save();
            return successResponseHandler(res, response, "successfully added new Workout !!");
        } catch (error) {
            logger.error(error);
            if (error.message.indexOf('duplicate key error') !== -1)
                return errorResponseHandler(res, error, "Workout name is already exist !");
            else
                return errorResponseHandler(res, error, "Exception occurred !");
        };
    });
};





/**
 *  update Workout 
*/


exports.updateWorkout = (req, res) => {
    uploadAvatar(req, res, async (error, data) => {
        if (error)
            return errorResponseHandler(res, error, "while uploading profile error occurred !");
        try {
            const data = JSON.parse(req.body.data);
            if (req.files) {
                for (let i in req.files) {
                    if (req.files[i].fieldname === "workoutsImages") data["workoutsImages"] = req.files[i]
                    if (req.files[i].fieldname === "workoutsVideo") data["workoutsVideo"] = req.files[i]
                }
            }
            const response = await Workout.findByIdAndUpdate(req.params.id, data, { new: true })
            return successResponseHandler(res, response, "successfully updated workout !!");
        } catch (error) {
            logger.error(error);
            if (error.message.indexOf('duplicate key error') !== -1)
                return errorResponseHandler(res, error, "Workout name is already exist !");
            else
                return errorResponseHandler(res, error, "Exception occurred !");
        };
    })
};


/**
 *  update Workout Status
*/


exports.updateWorkoutStatus = (req, res) => {
    Workout.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(response => {
            return successResponseHandler(res, response, "successfully updated workout !!");
        }).catch(error => {
            logger.error(error);
            if (error.message.indexOf('duplicate key error') !== -1)
                return errorResponseHandler(res, error, "Period name is already exist !");
            else
                return errorResponseHandler(res, error, "Exception occurred !");
        });
};



