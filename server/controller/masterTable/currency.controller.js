/**  
 * utils.
*/

const { logger: { logger }, handler: { successResponseHandler, errorResponseHandler } } = require('../../../config');
const { auditLogger } = require('../../middleware/auditlog.middleware');

/**
 * models.
*/

const { Currency } = require('../../model');


/**
 * get all currency
*/


exports.getAllCurrencyForAdmin = (req, res) => {
  Currency.find({})
    .then(response => {
      successResponseHandler(res, response, "successfully get all currency !!");
    }).catch(error => {
      logger.error(error);
      errorResponseHandler(res, error, "Exception while getting all currency !");
    });
};




/**
 *  create new currency 
*/


exports.addCurrency = (req, res) => {
  Currency.estimatedDocumentCount().then(count => {
    if (count === 0) {
      let newCurrency = new Currency({ ...req.body, ...{ isDefault: true } });
      newCurrency.save().then(response => {
        auditLogger(req, 'Success')
        return successResponseHandler(res, response, "successfully added new Currency !!");
      }).catch(error => {
        logger.error(error);
        auditLogger(req, 'Failed')
        if (error.message.indexOf('duplicate key error') !== -1)
          return errorResponseHandler(res, error, "Currency name is already exist !");
        else
          return errorResponseHandler(res, error, "Exception occurred !");
      });
    } else {
      let newCurrency = new Currency(req.body);
      newCurrency.save().then(response => {
        auditLogger(req, 'Success')
        return successResponseHandler(res, response, "successfully added new Currency !!");
      }).catch(error => {
        logger.error(error);
        auditLogger(req, 'Failed')
        if (error.message.indexOf('duplicate key error') !== -1)
          return errorResponseHandler(res, error, "Currency name is already exist !");
        else
          return errorResponseHandler(res, error, "Exception occurred !");
      });
    }
  })
};



/**
 *  update currency 
*/


exports.updateCurrency = async (req, res) => {
  req.responseData = await Currency.findById(req.params.id).lean()
  Currency.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean()
    .then(response => {
      auditLogger(req, 'Success')
      return successResponseHandler(res, response, "successfully updated Currency !!");
    }).catch(error => {
      logger.error(error);
      auditLogger(req, 'Failed')
      if (error.message.indexOf('duplicate key error') !== -1)
        return errorResponseHandler(res, error, "Currency name is already exist !");
      else
        return errorResponseHandler(res, error, "Exception occurred !");
    });
};



/**
 *  update default currency 
*/


exports.updateDefaultCurrency = async (req, res) => {
  try {
    await Currency.findByIdAndUpdate(req.params.id, { isDefault: true }, { new: true })
    await Currency.updateMany({ _id: { $ne: req.params.id } }, { isDefault: false })
    const response = await Currency.find({})
    auditLogger(req, 'Success')
    return successResponseHandler(res, response, "successfully updated Currency !!");
  } catch (error) {
    logger.error(error);
    auditLogger(req, 'Failed')
    if (error.message.indexOf('duplicate key error') !== -1)
      return errorResponseHandler(res, error, "Currency name is already exist !");
    else
      return errorResponseHandler(res, error, "Exception occurred !");
  }
};



/**
 * get default currency
*/


exports.getDefaultCurrency = (req, res) => {
  Currency.findOne({ isDefault: true }).select({ "currencyCode": 1, "_id": 0 })
    .then(response => {
      successResponseHandler(res, response && response.currencyCode, "successfully get default currency !!");
    }).catch(error => {
      logger.error(error);
      errorResponseHandler(res, error, "Exception while getting default currency !");
    });
};
