const { getAnnouncementById, getAllAnnouncement, addAnnouncement,
    getAllAnnouncementForAdmin, updateAnnouncement, addMemberRead } = require('../controller/announcement/announcement.controller')


exports.routes = (express, app) => {

    const router = express.Router();

    router.get('/getAnnouncementById/:id', getAnnouncementById);


    router.post('/addAnnouncement', addAnnouncement);


    router.post('/addMemberRead', addMemberRead);


    router.post('/getAllAnnouncementForAdmin', getAllAnnouncementForAdmin);


    router.post('/getAllAnnouncement', getAllAnnouncement);


    router.put('/updateAnnouncement/:id', updateAnnouncement);


    app.use('/api/announcement/', router);

};