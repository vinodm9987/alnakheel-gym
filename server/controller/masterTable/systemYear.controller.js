/**  
 * utils.
*/

const { logger: { logger }, handler: { successResponseHandler, errorResponseHandler } } = require('../../../config')

/**
 * models.
*/

const { SystemYear } = require('../../model');



exports.getSystemYear = (req, res) => {
  SystemYear.findOne({})
    .then(response => {
      successResponseHandler(res, response, "successfully get system year !!");
    }).catch(error => {
      logger.error(error);
      errorResponseHandler(res, error, "Exception while getting system year !");
    });
};