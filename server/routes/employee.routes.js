const { createNewEmployee, getAllActiveEmployee, getEmployeeById, getAllEmployee,
    getAllEmployeeByFilter, updateEmployee, getTrainerByBranch, getActiveTrainer,
    updateEmployeeFingerPrint, updateEmployeeFaceRecognition,
    updateStatusOfEmployee, getAllMemberOfTrainer, updateEmployeeProfile, trainerRating } = require('../controller/employee/employee.controller')


exports.routes = (express, app) => {

    const router = express.Router();

    router.get('/getAllEmployee', getAllEmployee)

    router.get('/getEmployeeById/:id', getEmployeeById)

    router.post('/getAllMemberOfTrainer/:trainerId', getAllMemberOfTrainer)

    router.get('/getActiveTrainer', getActiveTrainer)

    router.get('/getAllActiveEmployee', getAllActiveEmployee)

    router.post('/createNewEmployee', createNewEmployee)

    router.post('/updateEmployeeFingerPrint', updateEmployeeFingerPrint)

    router.post('/updateEmployeeFaceRecognition', updateEmployeeFaceRecognition)

    router.post('/updateEmployee', updateEmployee)

    router.post('/trainerRating', trainerRating);

    router.post('/getAllEmployeeByFilter', getAllEmployeeByFilter);

    router.post('/updateStatusOfEmployee/:id', updateStatusOfEmployee)

    router.post('/updateEmployeeProfile/:id', updateEmployeeProfile)

    router.get('/getTrainerByBranch/:id', getTrainerByBranch)

    app.use('/api/employee/', router);
}