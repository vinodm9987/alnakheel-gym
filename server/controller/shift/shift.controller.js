/**  
 * utils.
*/

const { logger: { logger }, handler: { successResponseHandler, errorResponseHandler } } = require('../../../config')

/**
 * models.
*/

const { Shift } = require('../../model');

/**
 * get all Shift
*/


exports.getAllShiftForAdmin = (req, res) => {
  Shift.find({}).populate('branch')
    .then(response => {
      successResponseHandler(res, response, "successfully get all Shift !!");
    }).catch(error => {
      logger.error(error);
      errorResponseHandler(res, error, "Exception while getting all Shift !");
    });
};





/**
* get all active Shift
*/


exports.getAllShift = (req, res) => {
  Shift.find({ status: true }).populate('branch')
    .then(response => {
      successResponseHandler(res, response, "successfully get all active Shift !!");
    }).catch(error => {
      logger.error(error);
      errorResponseHandler(res, error, "Exception while getting all active Shift !");
    });
};



/**
* get all active Shift By Branch
*/


exports.getAllShiftByBranch = async (req, res) => {
  try {
    let response = await Shift.find({ status: true, branch: req.body.branch }).populate('branch').lean()
    let currentTime = new Date(new Date().setFullYear(2020, 11, 9))
    response = response.filter(doc => {
      if (req.body.notExpired) {
        if (new Date(doc.toTime.setFullYear(2020, 11, 9)) > currentTime) {
          return doc
        }
      } else {
        return doc
      }
    })
    successResponseHandler(res, response, "successfully get all active Shift by branch !!");
  } catch (error) {
    logger.error(error);
    errorResponseHandler(res, error, "Exception while getting all active Shift by branch !");
  }
};




/**
*  create new Shift 
*/


exports.addShift = async (req, res) => {
  try {
    let newShift = new Shift(req.body);
    let response = await newShift.save();
    let newResponse = await Shift.findById(response._id).populate('branch')
    successResponseHandler(res, newResponse, "successfully added new Shift !!");
  } catch (error) {
    logger.error(error);
    if (error.message.indexOf('duplicate key error') !== -1)
      return errorResponseHandler(res, error, "Shift name for Branch is already exist !");
    else
      return errorResponseHandler(res, error, "Exception occurred !");
  }
};





/**
*  update Shift 
*/


exports.updateShift = (req, res) => {
  Shift.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('branch')
    .then(response => {
      return successResponseHandler(res, response, "successfully updated Shift !!");
    }).catch(error => {
      logger.error(error);
      if (error.message.indexOf('duplicate key error') !== -1)
        return errorResponseHandler(res, error, "Shift name is already exist !");
      else
        return errorResponseHandler(res, error, "Exception occurred !");
    });
};
