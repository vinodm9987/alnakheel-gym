const { sendSms, sendMail, getMessages } = require('../controller/messaging');




exports.routes = (express, app) => {


  const router = express.Router();

  /**
   * SMS AND MAILING
  */

  router.post('/sendSms', sendSms);

  router.post('/sendMail', sendMail);

  router.post('/getMessages', getMessages);



  app.use('/api/messaging/', router);

}
