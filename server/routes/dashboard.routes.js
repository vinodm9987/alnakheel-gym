const { getMemberDashBoard, getPackageDistribution, getMostSellingStock,
    getAllBranchSales, getMemberAttendanceDashboard, getIndividualMemberAttendance } = require('../controller/dashboard/adminDashboard.controller');

exports.routes = (express, app) => {

    const router = express.Router();

    router.post('/getMemberDashBoard', getMemberDashBoard);

    router.post('/getPackageDistribution', getPackageDistribution);

    router.post('/getMostSellingStock', getMostSellingStock);

    router.post('/getAllBranchSales', getAllBranchSales);

    router.post('/getMemberAttendanceDashboard', getMemberAttendanceDashboard);

    router.post('/getIndividualMemberAttendance', getIndividualMemberAttendance);


    app.use('/api/dashboard/', router);

};