const {

  postCharge

} = require('../controller/stripe/stripe.controller');




exports.routes = (express, app) => {

  const router = express.Router();


  router.post('/charge', postCharge)



  app.use('/api/stripe/', router);

};