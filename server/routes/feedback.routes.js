const { addFeedback, getMemberFeedback, getFeedbackById, updateFeedback, getFeedbackList } = require('../controller/feedback/feedback.controller')


exports.routes = (express, app) => {

    const router = express.Router();


    router.post('/addFeedback', addFeedback);


    router.get('/getFeedbackById/:id', getFeedbackById);


    router.post('/getFeedbackList', getFeedbackList);


    router.post('/getMemberFeedback', getMemberFeedback);


    router.put('/updateFeedback/:id', updateFeedback);


    app.use('/api/feedback/', router);
}