/**  
 * utils.
*/

const { logger: { logger }, handler: { successResponseHandler, errorResponseHandler } } = require('../../../config')
const { Formate: { setTime } } = require('../../utils')


/**
 * models.
*/

const { Offer, Stocks } = require('../../model');

const { salesOffer } = require('../../notification/helper');
const { auditLogger } = require('../../middleware/auditlog.middleware');


/**
 *****  Offer controller  *****
*/


exports.addOffer = async (req, res) => {
    try {
        req.body["startDate"] = setTime(req.body.startDate);
        req.body["endDate"] = setTime(req.body.endDate);
        const newOffer = new Offer(req.body);
        const response = await newOffer.save();
        const offerDetails = { isOffer: true, offerDetails: response._id };
        await Stocks.findByIdAndUpdate(req.body.product, { offerDetails }, { new: true });
        const newResponse = await Offer.findById(response._id).populate('product')
        await salesOffer()
        auditLogger(req, 'Success')
        successResponseHandler(res, newResponse, "successfully create new offer");
    } catch (error) {
        logger.error(error);
        auditLogger(req, 'Failed')
        errorResponseHandler(res, error, "error ocurred while create offer");
    };
};






exports.updateOffer = async (req, res) => {
    const { startDate, endDate } = req.body
    if (startDate) req.body["startDate"] = setTime(req.body.startDate);
    if (endDate) req.body["endDate"] = setTime(req.body.endDate);
    req.responseData = await Offer.findById(req.params.id).lean()
    Offer.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .populate('product')
        .then(async (response) => {
        const offerDetails = { isOffer: true, offerDetails: response._id };
        await Stocks.findByIdAndUpdate(req.body.product, { offerDetails }, { new: true });
        auditLogger(req, 'Success')
            successResponseHandler(res, response, "successfully update new offer");
        }).catch(error => {
            logger.error(error);
            auditLogger(req, 'Failed')
            errorResponseHandler(res, error, "error ocurred while update offer");
        });
};




exports.getAllOfferForAdmin = (req, res) => {
    Offer.find({}).populate('product')
        .then((response) => {
            successResponseHandler(res, response, "successfully get all offer");
        }).catch(error => {
            logger.error(error);
            errorResponseHandler(res, error, "error ocurred getting all offer");
        });
};




exports.getAllOffer = (req, res) => {
    let queryCond = { endDate: { $gte: setTime(new Date()) } }
    queryCond["status"] = true
    Offer.find(queryCond)
        .populate('product')
        .then((response) => {
            successResponseHandler(res, response, "successfully get all offer");
        }).catch(error => {
            logger.error(error);
            errorResponseHandler(res, error, "error ocurred getting all offer");
        });
};





exports.getOfferById = (req, res) => {
    Offer.findById(req.params.id)
        .then((response) => {
            successResponseHandler(res, response, "successfully get  offer by id");
        }).catch(error => {
            logger.error(error);
            errorResponseHandler(res, error, "error ocurred getting  offer by id");
        });
};

