
const { logger: { logger }, handler: { successResponseHandler, errorResponseHandler } } = require('../../../config')

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
    successResponseHandler(res, response, "successfully added new admin password !!");
  } catch (error) {
    logger.error(error);
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