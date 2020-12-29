const { getUserNotification, deleteNotification, readNotification } = require('../controller/notification')


exports.routes = (express, app) => {

    const router = express.Router();


    router.post('/getUserNotification', getUserNotification);

    router.post('/readNotification', readNotification);

    router.post('/deleteNotification', deleteNotification);


    app.use('/api/notification/', router);
};