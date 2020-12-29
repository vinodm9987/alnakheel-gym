const { getAllDietFood, getAllDietFoodForAdmin, getDietFoodById, addDietFood, updateDietFood } = require('../controller/memberDiet/dietFood.controller');

const { getAllDietSession, getAllDietSessionForAdmin, getDietSessionById, addDietSession, updateDietSession } = require('../controller/memberDiet/dietSession.controller');

const { getMemberDietByMemberId, getMemberDietById, addMemberDiet, updateMemberDietById, getMemberDietByDate } = require('../controller/memberDiet/memberDiet.controller');


exports.routes = (express, app) => {


    const router = express.Router();

    /** 
     * DIET FOOD ROUTES
    */

    router.get('/getAllDietFood', getAllDietFood);

    router.get('/getAllDietFoodForAdmin', getAllDietFoodForAdmin);

    router.get('/getDietFoodById/:id', getDietFoodById);

    router.post('/addDietFood', addDietFood);

    router.put('/updateDietFood/:id', updateDietFood);


    /** 
     * DIET SESSION ROUTES
    */

    router.get('/getAllDietSession', getAllDietSession);

    router.get('/getAllDietSessionForAdmin', getAllDietSessionForAdmin);

    router.get('/getDietSessionById/:id', getDietSessionById);

    router.post('/addDietSession', addDietSession);

    router.put('/updateDietSession/:id', updateDietSession);




    /** 
     * MEMBER DIET  ROUTES
    */

    router.get('/getMemberDietByMemberId/:id', getMemberDietByMemberId);

    router.get('/getMemberDietById/:id', getMemberDietById);

    router.post('/addMemberDiet', addMemberDiet);

    router.post('/getMemberDietByDate', getMemberDietByDate);

    router.put('/updateMemberDietById/:id', updateMemberDietById);



    app.use('/api/diet/', router);

}