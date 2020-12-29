const { getAllRoomForAdmin, getAllRoom, getRoomById, addRoom, updateRoom, getAllRoomByBranch,
    getAllClassesForAdmin, getAllActiveClasses, addNewClasses, updateClasses, getMyClasses,
    getAllClassesByBranch, purchaseClassByAdmin, getClassById, purchaseClassByMember,
    getClassesScheduleByDates, getCustomerClassesScheduleByDates, getCustomerClassesDetails, startClass } = require('../controller/classes/classes.controller');


exports.routes = (express, app) => {


    const router = express.Router();

    /** 
     * ******************* ROOM ROUTER ********************
    */


    router.get('/getAllRoomForAdmin', getAllRoomForAdmin);

    router.get('/getAllRoom', getAllRoom);

    router.get('/getRoomById/:id', getRoomById);

    router.post('/addRoom', addRoom);

    router.put('/updateRoom/:id', updateRoom);

    router.post('/getAllRoomByBranch', getAllRoomByBranch)




    /** 
     * ******************* ADMIN CLASSES ROUTER ********************
    */


    router.post('/getAllClassesForAdmin', getAllClassesForAdmin);

    router.get('/getAllActiveClasses', getAllActiveClasses);

    router.get('/getClassById/:id', getClassById);

    router.post('/addNewClasses', addNewClasses);

    router.put('/updateClasses/:id', updateClasses)

    router.post('/getAllClassesByBranch', getAllClassesByBranch)

    router.post('/purchaseClassByAdmin', purchaseClassByAdmin)

    router.post('/getClassesScheduleByDates', getClassesScheduleByDates)


    /** 
     * ******************* MEMBER CLASSES ROUTER ********************
    */

    router.post('/purchaseClassByMember', purchaseClassByMember)

    router.post('/getCustomerClassesScheduleByDates', getCustomerClassesScheduleByDates)

    router.post('/getCustomerClassesDetails', getCustomerClassesDetails)


    /** 
     * ******************* TRAINER CLASSES  ROUTER ********************
    */

    router.post('/getMyClasses', getMyClasses);


    /**
     * BIOSTAR AUTH APIS
    */

    router.post('/startClass', startClass);




    app.use('/api/classes/', router);

};