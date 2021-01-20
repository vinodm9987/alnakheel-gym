const { getMemberDashBoard, getPackageDistribution, getMostSellingStock, getDashboardTotalSales,
    getAllBranchSales, getMemberAttendanceDashboard, getIndividualMemberAttendance } = require('../controller/dashboard/adminDashboard.controller');

exports.routes = (express, app) => {

    const router = express.Router();

    router.post('/getMemberDashBoard', getMemberDashBoard);

    router.post('/getPackageDistribution', getPackageDistribution);

    router.post('/getMostSellingStock', getMostSellingStock);

    router.post('/getAllBranchSales', getAllBranchSales);

    router.post('/getMemberAttendanceDashboard', getMemberAttendanceDashboard);

    router.post('/getIndividualMemberAttendance', getIndividualMemberAttendance);

    router.post('/getDashboardTotalSales', getDashboardTotalSales);


    app.use('/api/dashboard/', router);

};