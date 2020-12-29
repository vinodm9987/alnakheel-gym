const { getReport } = require('../controller/report/report.controller');


exports.routes = (express, app) => {


  const router = express.Router();

  /** 
   * SHIFT ROUTES
  */

  router.post('/getReport', getReport);

  app.use('/api/report/', router);

}