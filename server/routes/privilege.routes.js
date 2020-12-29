const { assignViewForWeb, assignViewForMobile } = require('../controller/privilege/privilege.controller');

const { addAdminPassword, getAdminPassword } = require('../controller/privilege/adminPassword.controller');




exports.routes = (express, app) => {


    const router = express.Router();

    /** 
     * PRIVILEGE ROUTES
    */

    router.post('/assignViewForWeb', assignViewForWeb);

    router.post('/assignViewForMobile', assignViewForMobile);





    router.post('/addAdminPassword', addAdminPassword);

    router.get('/getAdminPassword', getAdminPassword);




    app.use('/api/privilege/', router);

}