/**  
 * utils.
*/

const { logger: { logger }, handler: { successResponseHandler, errorResponseHandler } } = require('../../../config')
const { Formate: { setTime } } = require('../../utils')


/**
 * models.
*/

const { GiftCard } = require('../../model');
const { auditLogger } = require('../../middleware/auditlog.middleware');




/**
 *****  Giftcard controller  *****
*/


exports.addGiftcard = async (req, res) => {
  try {
    req.body["startDate"] = setTime(req.body.startDate);
    req.body["endDate"] = setTime(req.body.endDate);
    const newGiftcard = new GiftCard(req.body);
    const response = await newGiftcard.save();
    auditLogger(req, 'Success')
    successResponseHandler(res, response, "successfully create new giftcard");
  } catch (error) {
    logger.error(error);
    auditLogger(req, 'Failed')
    errorResponseHandler(res, error, "error ocurred while create giftcard");
  };
};






exports.updateGiftcard = async (req, res) => {
  const { startDate, endDate } = req.body
  if (startDate) req.body["startDate"] = setTime(req.body.startDate);
  if (endDate) req.body["endDate"] = setTime(req.body.endDate);
  req.responseData = await GiftCard.findById(req.params.id).lean()
  GiftCard.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((response) => {
      auditLogger(req, 'Success')
      successResponseHandler(res, response, "successfully update new giftcard");
    }).catch(error => {
      logger.error(error);
      auditLogger(req, 'Failed')
      errorResponseHandler(res, error, "error ocurred while update giftcard");
    });
};




exports.getAllGiftcardForAdmin = (req, res) => {
  GiftCard.find({})
    .then((response) => {
      successResponseHandler(res, response, "successfully get all giftcard");
    }).catch(error => {
      logger.error(error);
      errorResponseHandler(res, error, "error ocurred getting all giftcard");
    });
};




exports.getAllGiftcard = (req, res) => {
  let queryCond = { endDate: { $gte: setTime(new Date()) } }
  queryCond["status"] = true
  GiftCard.find(queryCond)
    .then((response) => {
      successResponseHandler(res, response, "successfully get all giftcard");
    }).catch(error => {
      logger.error(error);
      errorResponseHandler(res, error, "error ocurred getting all giftcard");
    });
};





exports.getGiftcardById = (req, res) => {
  GiftCard.findById(req.params.id)
    .then((response) => {
      successResponseHandler(res, response, "successfully get  giftcard by id");
    }).catch(error => {
      logger.error(error);
      errorResponseHandler(res, error, "error ocurred getting  giftcard by id");
    });
};



