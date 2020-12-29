const { getAllShiftForAdmin, getAllShift, addShift, updateShift, getAllShiftByBranch } = require('../controller/shift/shift.controller');


const { getAllEmployeeShift, addEmployeeShift, updateEmployeeShift, getAllEmployeeShiftByIdAndBranch,
  getAllEmployeeShiftByShiftAndBranchAndEmployee } = require('../controller/shift/employeeShift.controller');

exports.routes = (express, app) => {


  const router = express.Router();

  /** 
   * SHIFT ROUTES
  */

  router.get('/getAllShift', getAllShift);

  router.post('/getAllShiftByBranch', getAllShiftByBranch);

  router.get('/getAllShiftForAdmin', getAllShiftForAdmin);

  router.post('/addShift', addShift);

  router.put('/updateShift/:id', updateShift);



  /** 
   * EMPLOYEE SHIFT ROUTES
  */

  router.post('/getAllEmployeeShift', getAllEmployeeShift);

  router.post('/addEmployeeShift', addEmployeeShift);

  router.put('/updateEmployeeShift/:id', updateEmployeeShift);

  router.post('/getAllEmployeeShiftByIdAndBranch', getAllEmployeeShiftByIdAndBranch);

  router.post('/getAllEmployeeShiftByShiftAndBranchAndEmployee', getAllEmployeeShiftByShiftAndBranchAndEmployee);

  app.use('/api/shift/', router);

}