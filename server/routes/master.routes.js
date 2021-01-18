const { updatePackage, deletePackage, addPackage,
    getAllPackage, getPackageById, getAllActivePackage,getAllPackageBySalesBranch } = require('../controller/masterTable/package.controller')

const { updatePeriod, addPeriod,
    getAllPeriod, getAllPeriodForAdmin } = require('../controller/masterTable/period.controller')

const { updateDesignation, addDesignation, getAllDesignation,
    getAllDesignationForAdmin, getDesignationById, getDesignationForFilter } = require('../controller/masterTable/designation.controller')

const { updateBranch, addBranch, getAllBranch,
    getAllBranchForAdmin, getBranchById } = require('../controller/masterTable/branch.controller')

const { getAllTrainerFees, getTrainerFeesById, addTrainerFees,
    updateTrainerFees, getAllTrainerFeesForAdmin, getUniqueTrainerByBranch, getPeriodOfTrainer } = require('../controller/masterTable/trainerFees.controller')

const { updateCurrency, addCurrency, getAllCurrencyForAdmin,
    getDefaultCurrency, updateDefaultCurrency } = require('../controller/masterTable/currency.controller')

const { getSystemYear } = require('../controller/masterTable/systemYear.controller')

const { getAuditLogs } = require('../controller/masterTable/auditLog.controller')


exports.routes = (express, app) => {

    const router = express.Router();

    /** 
     * PACKAGE ROUTES
    */



    router.get('/getAllPackage', getAllPackage);

    router.post('/getAllPackageBySalesBranch', getAllPackageBySalesBranch);

    router.get('/getAllActivePackage', getAllActivePackage);

    router.get('/getPackageById/:id', getPackageById);

    router.post('/addPackage', addPackage);

    router.put('/updatePackage/:id', updatePackage);

    router.delete('/deletePackage/:id', deletePackage);


    /** 
    * DESIGNATION ROUTES
    */



    router.get('/getAllDesignation', getAllDesignation);

    router.get('/getDesignationForFilter', getDesignationForFilter);

    router.get('/getDesignationById/:id', getDesignationById);

    router.get('/getAllDesignationForAdmin', getAllDesignationForAdmin);

    router.post('/addDesignation', addDesignation);

    router.put('/updateDesignation/:id', updateDesignation);




    /** 
    * PERIOD ROUTES
    */


    router.get('/getAllPeriod', getAllPeriod);

    router.get('/getAllPeriodForAdmin', getAllPeriodForAdmin);

    router.post('/addPeriod', addPeriod);

    router.put('/updatePeriod/:id', updatePeriod);




    /** 
     * BRANCH ROUTES
    */


    router.get('/getAllBranch', getAllBranch);

    router.get('/getBranchById/:id', getBranchById);

    router.get('/getAllBranchForAdmin', getAllBranchForAdmin);

    router.post('/addBranch', addBranch);

    router.put('/updateBranch/:id', updateBranch);



    /** 
     *  TRAINER FEES ROUTES
    */



    router.get('/getAllTrainerFees', getAllTrainerFees);

    router.post('/getAllTrainerFeesForAdmin', getAllTrainerFeesForAdmin);

    router.get('/getTrainerFeesById/:id', getTrainerFeesById);

    router.get('/getAllDesignationForAdmin', getAllDesignationForAdmin);

    router.get('/getUniqueTrainerByBranch/:branchId', getUniqueTrainerByBranch);

    router.post('/getPeriodOfTrainer', getPeriodOfTrainer);

    router.post('/addTrainerFees', addTrainerFees);

    router.put('/updateTrainerFees/:id', updateTrainerFees);



    /** 
     *  CURRENCY ROUTES
    */


    router.get('/getAllCurrencyForAdmin', getAllCurrencyForAdmin);

    router.post('/addCurrency', addCurrency);

    router.put('/updateCurrency/:id', updateCurrency);

    router.get('/getDefaultCurrency', getDefaultCurrency)

    router.put('/updateDefaultCurrency/:id', updateDefaultCurrency);


    /** 
     *  SYSTEM YEAR
    */

    router.get('/getSystemYear', getSystemYear)


    /** 
     *  AUDIT LOG
    */

    router.post('/getAuditLogs', getAuditLogs)


    app.use('/api/master/', router);

};