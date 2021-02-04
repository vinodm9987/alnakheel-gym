const { getPackageInstallment, getTrainerInstallment } = require('../controller/member/installment.controller')


exports.routes = (express, app) => {

    const router = express.Router();

    router.post('/getPackageInstallment', getPackageInstallment);

    router.post('/getTrainerInstallment', getTrainerInstallment);

    app.use('/api/installment/', router);
};