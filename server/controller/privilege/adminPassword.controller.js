
const { logger: { logger }, handler: { successResponseHandler, errorResponseHandler } } = require('../../../config');
const { auditLogger } = require('../../middleware/auditlog.middleware');

/**
 * models.
*/

const { AdminPassword } = require('../../model');


exports.addAdminPassword = async (req, res) => {
  try {
    let exist = await AdminPassword.findOne({}).lean()
    let response
    if (exist) {
      response = await AdminPassword.findByIdAndUpdate(exist._id, req.body, { new: true })
    } else {
      let newAdminPassword = new AdminPassword(req.body);
      response = await newAdminPassword.save();
    }
    auditLogger(req, 'Success')
    successResponseHandler(res, response, "successfully added new admin password !!");
  } catch (error) {
    logger.error(error);
    auditLogger(req, 'Failed')
    return errorResponseHandler(res, error, "Sorry Unable to change password !");
  }
};


exports.getAdminPassword = (req, res) => {
  AdminPassword.findOne({})
    .then(response => {
      successResponseHandler(res, response, "successfully get admin password !!");
    }).catch(error => {
      logger.error(error);
      errorResponseHandler(res, error, "Exception while getting admin password !");
    });
};


exports.verifyAdminPassword = async (req, res) => {
  try {
    await AdminPassword.findOne({ password: req.body.password }).then(async user => {
      if (!user) return errorResponseHandler(res, '', "Your entered password is wrong !");
      else return successResponseHandler(res, '', "Successfully verified password !!");
    });
  } catch (error) {
    logger.error(error);
    errorResponseHandler(res, error, "Exception while veryfying password !");
  }
}