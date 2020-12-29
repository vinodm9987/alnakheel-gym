const { getAllUser, createAdmin, login, forgotPassword, updateSystemAdmin, getAllAdmin, changePassword, updateNotification,
    addReactToken, getUserById, getAllUserFilterByDesignationAndSearch, resetPassword } = require('../controller/credential/credential.controller')

exports.routes = (express, app) => {

    const router = express.Router();

    router.post('/login', login)

    router.get('/getAllUser', getAllUser)

    router.get('/getUserById/:id', getUserById)

    router.get('/getAllAdmin', getAllAdmin)

    router.post('/createAdmin', createAdmin)

    router.post('/changePassword', changePassword)

    router.post('/forgotPassword', forgotPassword)

    router.post('/addReactToken/:id', addReactToken)

    router.post('/resetPassword/:id', resetPassword)

    router.post('/updateSystemAdmin/:id', updateSystemAdmin)

    router.post('/updateNotification', updateNotification);

    router.post('/getAllUserFilterByDesignationAndSearch', getAllUserFilterByDesignationAndSearch)

    app.use('/api/credential/', router);

}