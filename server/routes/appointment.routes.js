const { bookAppointment, getAppointmentRequests,
  getMemberAppointmentHistory, getMemberTraffics } = require('../controller/appointment/appointment.controller')


exports.routes = (express, app) => {

  const router = express.Router();

  router.post('/bookAppointment', bookAppointment);

  router.post('/getAppointmentRequests', getAppointmentRequests);

  router.post('/getMemberAppointmentHistory', getMemberAppointmentHistory);

  router.post('/getMemberTraffics', getMemberTraffics);

  app.use('/api/appointment/', router);


};
