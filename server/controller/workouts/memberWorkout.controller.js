/**
 * utils.
*/

const { logger: { logger }, handler: { successResponseHandler, errorResponseHandler } } = require('../../../config')
const { Formate: { setTime } } = require('../../utils')
const { newWorkOut } = require('../../notification/helper')

/**
 * models.
*/

const { MemberWorkout, WorkoutAttendance } = require('../../model');
const { auditLogger } = require('../../middleware/auditlog.middleware');



/**
 * get all  MemberWorkout
*/


exports.getAllMemberWorkout = (req, res) => {
    MemberWorkout.find()
        .then(response => {
            successResponseHandler(res, response, "successfully get all active MemberWorkout !!");
        }).catch(error => {
            logger.error(error);
            errorResponseHandler(res, error, "Exception while getting all active MemberWorkout !");
        });
};




/**
 * get  MemberWorkout by id
*/


exports.getMemberWorkoutById = (req, res) => {
    MemberWorkout.findById(req.params.id)
        .then(response => {
            successResponseHandler(res, response, "successfully get  MemberWorkout by id !!");
        }).catch(error => {
            logger.error(error);
            errorResponseHandler(res, error, "Exception while getting  MemberWorkout by id !");
        });
};



/**
 *  create new Member Workout 
*/


exports.addMemberWorkout = async (req, res) => {
    try {
        let response;
        const data = req.body.map(doc => { doc.dateOfWorkout = setTime(doc.dateOfWorkout); return doc });
        for (let i = 0; i < data.length; i++) {
            const { member, dateOfWorkout, workoutCategories } = data[i];
            response = await MemberWorkout.findOneAndUpdate({ member, dateOfWorkout, workoutCategories }, data[i], { upsert: true });
        }
        await newWorkOut(req.body[0].member);
        auditLogger(req, 'Success')
        return successResponseHandler(res, response, "successfully added new Member Workout !!");
    } catch (error) {
        logger.error(error);
        auditLogger(req, 'Failed')
        if (error.message.indexOf('duplicate key error') !== -1)
            return errorResponseHandler(res, error, "WorkoutLevel name is already exist !");
        else
            return errorResponseHandler(res, error, "Exception occurred !");
    }
};




exports.updateMemberWorkoutById = async (req, res) => {
    req.body.dateOfWorkout = setTime(req.body.dateOfWorkout)
    req.responseData = await MemberWorkout.findById(req.params.id).lean()
    MemberWorkout.findByIdAndUpdate(req.params.id, req.body)
        .then(response => {
            auditLogger(req, 'Success')
            successResponseHandler(res, response, "successfully update  MemberWorkout by id !!");
        }).catch(error => {
            logger.error(error);
            auditLogger(req, 'Failed')
            errorResponseHandler(res, error, "Exception while updating  MemberWorkout by id !");
        });
};


exports.getMemberWorkoutByDateForTrainer = (req, res) => {
    let queryCond = {}
    let query = req.body
    if (query.member) queryCond["member"] = query.member
    if (query.dateOfWorkout) queryCond["dateOfWorkout"] = setTime(query.dateOfWorkout)
    if (query.workoutCategories) queryCond["workoutCategories"] = query.workoutCategories
    if (query.workoutsLevel) queryCond["workoutsLevel"] = query.workoutsLevel
    MemberWorkout.findOne(queryCond)
        .populate('workouts.workout')
        .then(response => {
            successResponseHandler(res, response, "successfully get  MemberWorkout by date !!");
        }).catch(error => {
            logger.error(error);
            errorResponseHandler(res, error, "Exception while getting  MemberWorkout by date !");
        });
};



exports.getMemberWorkoutByDate = (req, res) => {
    MemberWorkout.find({ member: req.body.member, dateOfWorkout: setTime(req.body.dateOfWorkout) })
        .populate('workoutsLevel workouts.workout')
        .then(response => {
            successResponseHandler(res, response, "successfully get  MemberWorkout by date !!");
        }).catch(error => {
            logger.error(error);
            errorResponseHandler(res, error, "Exception while getting  MemberWorkout by date !");
        });
};





/**
 * get  MemberWorkout attendance
*/


exports.getMemberWorkoutExist = (req, res) => {
    WorkoutAttendance.find({ member: req.body.member, date: setTime(req.body.date) }).count()
        .then(response => {
            successResponseHandler(res, response, "successfully get  MemberWorkout by id !!");
        }).catch(error => {
            logger.error(error);
            errorResponseHandler(res, error, "Exception while getting  MemberWorkout by id !");
        });
};



/**
 *  create new Member Workout 
*/


exports.addMemberWorkoutAttendees = (req, res) => {
    req.body["date"] = setTime(req.body.date)
    let newAttendance = new WorkoutAttendance(req.body)
    newAttendance.save().then(response => {
        successResponseHandler(res, response, "successfully added  MemberWorkout attendance !!");
    }).catch(error => {
        logger.error(error);
        errorResponseHandler(res, error, "Exception while getting  MemberWorkout attendance !");
    })
};
