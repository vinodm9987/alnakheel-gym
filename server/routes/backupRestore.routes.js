const { processBackup, getAllManualBackup, processRestore, getAllRestore } = require('../controller/backupRestore/backupRestore.controller')


exports.routes = (express, app) => {

  const router = express.Router();

  router.post('/processBackup', processBackup);


  router.post('/getAllManualBackup', getAllManualBackup);


  router.post('/processRestore', processRestore);


  router.post('/getAllRestore', getAllRestore);


  app.use('/api/backupRestore/', router);
};