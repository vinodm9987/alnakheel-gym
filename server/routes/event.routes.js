const { getAllEvent, getEventById, updateEvent, addEvent,
    getAllEventForAdmin, getEventsByDate } = require('../controller/event/event.controller')


exports.routes = (express, app) => {

    const router = express.Router();


    router.get('/getEventById/:id', getEventById);


    router.post('/addEvent', addEvent);


    router.get('/getAllEventForAdmin', getAllEventForAdmin);


    router.get('/getAllEvent', getAllEvent);


    router.put('/updateEvent/:id', updateEvent);


    router.post('/getEventsByDate', getEventsByDate);


    app.use('/api/event/', router);
};