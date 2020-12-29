const { addMemberAttendance, getMemberAttendance, getMemberAttendanceForAdmin, getAttendanceDetails } = require('../controller/attendance/memberAttendance.controller');

exports.routes = (express, app) => {

    const router = express.Router();

    router.post('/getAttendanceDetails', getAttendanceDetails);

    router.post('/addMemberAttendance', addMemberAttendance);

    router.post('/getMemberAttendance', getMemberAttendance);

    router.post('/getMemberAttendanceForAdmin', getMemberAttendanceForAdmin);


    app.use('/api/attendance/', router);

};