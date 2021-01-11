const { getMoneyCollection, addMoneyCollection,
  getMoneyCollectionHistory, getMoneyCollectionById } = require('../controller/moneyCollection/moneyCollection.controller')


exports.routes = (express, app) => {

  const router = express.Router();

  router.post('/getMoneyCollection', getMoneyCollection);

  router.post('/addMoneyCollection', addMoneyCollection);

  router.post('/getMoneyCollectionHistory', getMoneyCollectionHistory);

  router.get('/getMoneyCollectionById/:id', getMoneyCollectionById);


  app.use('/api/moneyCollection/', router);
};