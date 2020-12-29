const { getAllWorkouts, getWorkoutById, getAllWorkoutForAdmin, addWorkout, updateWorkout,
    updateWorkoutStatus, getAllWorkoutByFilter, getAllWorkoutByWorkoutCategory } = require('../controller/workouts/workout.controller');

const { getAllWorkoutLevelForAdmin, getAllWorkoutLevel, getWorkoutLevelById,
    addWorkoutLevel, updateWorkoutLevel } = require('../controller/workouts/workoutLevel.controller');

const { getAllMemberWorkout, addMemberWorkout, getMemberWorkoutByDate, getMemberWorkoutByDateForTrainer,
    updateMemberWorkoutById, getMemberWorkoutById, addMemberWorkoutAttendees, getMemberWorkoutExist } = require('../controller/workouts/memberWorkout.controller');


exports.routes = (express, app) => {


    const router = express.Router();

    /** 
     * WORKOUTS ROUTES
    */

    router.get('/getAllWorkouts', getAllWorkouts);

    router.get('/getAllWorkoutForAdmin', getAllWorkoutForAdmin);

    router.get('/getWorkoutById/:id', getWorkoutById);

    router.post('/getAllWorkoutByFilter', getAllWorkoutByFilter);

    router.post('/addWorkout', addWorkout);

    router.put('/updateWorkout/:id', updateWorkout);

    router.put('/updateWorkoutStatus/:id', updateWorkoutStatus)

    router.post('/getAllWorkoutByWorkoutCategory', getAllWorkoutByWorkoutCategory);



    /** 
     * WORKOUTS ROUTES
    */

    router.get('/getAllWorkoutLevel', getAllWorkoutLevel);

    router.get('/getAllWorkoutLevelForAdmin', getAllWorkoutLevelForAdmin);

    router.get('/getWorkoutLevelById/:id', getWorkoutLevelById);

    router.post('/addWorkoutLevel', addWorkoutLevel);

    router.put('/updateWorkoutLevel/:id', updateWorkoutLevel);



    /** 
     * MEMBER WORKOUTS ROUTES
    */

    router.get('/getAllMemberWorkout', getAllMemberWorkout);

    router.get('/getMemberWorkoutById/:id', getMemberWorkoutById);

    router.post('/addMemberWorkout', addMemberWorkout);

    router.post('/getMemberWorkoutByDate', getMemberWorkoutByDate);

    router.post('/getMemberWorkoutByDateForTrainer', getMemberWorkoutByDateForTrainer);

    router.put('/updateMemberWorkoutById/:id', updateMemberWorkoutById);





    /** 
     * MEMBER WORKOUTS ATTENDANCE ROUTES
    */


    router.post('/addMemberWorkoutAttendees', addMemberWorkoutAttendees);

    router.post('/getMemberWorkoutExist', getMemberWorkoutExist);


    app.use('/api/workout/', router);

}