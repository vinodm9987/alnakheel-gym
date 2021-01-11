const { assignViewForWeb, assignViewForMobile, assignReport } = require('../controller/privilege/privilege.controller');

const { addAdminPassword, getAdminPassword, verifyAdminPassword } = require('../controller/privilege/adminPassword.controller');




exports.routes = (express, app) => {


    const router = express.Router();

    /** 
     * PRIVILEGE ROUTES
    */

    router.post('/assignViewForWeb', assignViewForWeb);

    router.post('/assignViewForMobile', assignViewForMobile);

    router.post('/assignReport', assignReport);





    router.post('/addAdminPassword', addAdminPassword);

    router.get('/getAdminPassword', getAdminPassword);

    router.post('/verifyAdminPassword', verifyAdminPassword);




    app.use('/api/privilege/', router);

}