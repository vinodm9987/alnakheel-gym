const { addVat, updateVat, getAllVatForAdmin, getDefaultVat, updateDefaultVat, getAllVat } = require('../controller/financeReporting')


exports.routes = (express, app) => {

    const router = express.Router();

    router.post('/addVat', addVat);

    router.post('/getAllVatForAdmin', getAllVatForAdmin);

    router.post('/getAllVat', getAllVat);

    router.post('/getDefaultVat', getDefaultVat);

    router.put('/updateVat/:id', updateVat);

    router.put('/updateDefaultVat/:id', updateDefaultVat);


    app.use('/api/finance/', router);
}