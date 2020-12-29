const { getMemberWeights, addMemberWeight } = require('../controller/bmi/memberBmi.controller');

exports.routes = (express, app) => {

    const router = express.Router();

    router.post('/getMemberWeights', getMemberWeights);

    router.post('/addMemberWeight', addMemberWeight);

    app.use('/api/bmi/', router);

};