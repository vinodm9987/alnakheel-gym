const { getPackageInstallment, getTrainerInstallment, changeDueDateOfTrainerInstallment, changeDueDateOfPackageInstallment } = require('../controller/member/installment.controller')


exports.routes = (express, app) => {

    const router = express.Router();

    router.post('/getPackageInstallment', getPackageInstallment);

    router.post('/getTrainerInstallment', getTrainerInstallment);

    router.post('/changeDueDateOfTrainerInstallment', changeDueDateOfTrainerInstallment);

    router.post('/changeDueDateOfPackageInstallment', changeDueDateOfPackageInstallment);

    app.use('/api/installment/', router);
};