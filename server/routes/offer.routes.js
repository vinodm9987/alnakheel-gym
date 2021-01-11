const { getAllOffer, getOfferById,
    addOffer, updateOffer, getAllOfferForAdmin } = require('../controller/offer/offer.controller')


exports.routes = (express, app) => {

    const router = express.Router();

    router.get('/getAllOfferForAdmin', getAllOfferForAdmin)


    router.get('/getAllOffer', getAllOffer)


    router.get('/getOfferById/:id', getOfferById)


    router.post('/addOffer', addOffer)


    router.put('/updateOffer/:id', updateOffer)


    app.use('/api/offer/', router);
}