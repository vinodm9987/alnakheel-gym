const { getAllSuppliersForAdmin, getAllSuppliers, getASuppliersById, addNewSupplier, updateSupplier,
    getAllAssetsForAdmin, getAllAssets, addNewAssets, getAssetsById, updateAssets, addNewRepair,
    updateRepairLog, getAllContractForAdmin, addContract, updateAssetsStatus, getAssetsBySupplier,
    updateContract, updateStatusOfContract, getContractById
} = require('../controller/assets/asset.controller');



exports.routes = (express, app) => {


    const router = express.Router();

    /** 
     * ******************* SUPPLIER ROUTER ********************
    */


    router.post('/getAllSuppliersForAdmin', getAllSuppliersForAdmin);

    router.get('/getAllSuppliers', getAllSuppliers);

    router.get('/getASuppliersById/:id', getASuppliersById);

    router.post('/addNewSupplier', addNewSupplier);

    router.put('/updateSupplier/:id', updateSupplier);





    /** 
     * ******************* ASSETS ROUTER ********************
    */


    router.post('/getAllAssetsForAdmin', getAllAssetsForAdmin);

    router.get('/getAllAssets', getAllAssets);

    router.get('/getAssetsById/:id', getAssetsById);

    router.post('/addNewAssets', addNewAssets);

    router.put('/updateAssets/:id', updateAssets)

    router.put('/updateAssetsStatus/:id', updateAssetsStatus)

    router.put('/addNewRepair/:id', addNewRepair)

    router.post('/updateRepairLog', updateRepairLog)

    router.post('/getAssetsBySupplier', getAssetsBySupplier)



    /** 
     * ******************* CONTRACTOR ROUTER ********************
    */



    router.post('/getAllContractForAdmin', getAllContractForAdmin);

    router.put('/updateStatusOfContract/:id', updateStatusOfContract)

    router.put('/updateContract/:id', updateContract)

    router.post('/addContract', addContract);

    router.get('/getContractById/:id', getContractById);


    app.use('/api/asset/', router);

};