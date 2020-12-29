/**  
 * utils.
*/

const { logger: { logger }, handler: { successResponseHandler, errorResponseHandler } } = require('../../../config')
const { Formate: { setTime } } = require('../../utils')
/**
 * models.
*/

const { EmployeeShift } = require('../../model');


/**
* get all EmployeeShift
*/


exports.getAllEmployeeShift = async (req, res) => {
  try {
    req.body["date"] = setTime(req.body.date);
    let response = await EmployeeShift.find()
      .populate('employee branch shift')
      .populate({ path: 'employee', populate: { path: "credentialId" } })
      .populate({ path: 'employee', populate: { path: "branch" } }).lean()
    let newResponse = response.filter(doc => {
      let temp1 = doc.employee.credentialId.userName.toLowerCase();
      let temp2 = doc.employee.credentialId.email.toLowerCase();
      if (req.body.date && req.body.search) {
        if ((doc.fromDate <= new Date(req.body.date) && doc.toDate >= new Date(req.body.date))
          && (temp1.includes(req.body.search) || temp2.includes(req.body.search))) {
          return doc
        }
      } else if (req.body.date && !req.body.search) {
        if (doc.fromDate <= new Date(req.body.date) && doc.toDate >= new Date(req.body.date)) {
          return doc
        }
      } else if (req.body.search && !req.body.date) {
        if (temp1.includes(req.body.search.toLowerCase()) || temp2.includes(req.body.search.toLowerCase())) {
          return doc
        }
      } else {
        return doc
      }
    })
    return successResponseHandler(res, newResponse, "successfully get all active EmployeeShift !!");
  } catch (error) {
    logger.error(error);
    errorResponseHandler(res, error, "Exception while getting all active EmployeeShift !");
  }
};




/**
*  create new EmployeeShift 
*/


exports.addEmployeeShift = async (req, res) => {
  try {
    req.body['fromDate'] = setTime(req.body.fromDate)
    req.body['toDate'] = setTime(req.body.toDate)
    let newEmployeeShift = new EmployeeShift(req.body);
    let response = await newEmployeeShift.save();
    let newResponse = await EmployeeShift.findById(response._id)
      .populate('employee branch shift')
      .populate({ path: 'employee', populate: { path: "credentialId" } })
      .populate({ path: 'employee', populate: { path: "branch" } })
    return successResponseHandler(res, newResponse, "successfully added new EmployeeShift !!")
  } catch (error) {
    logger.error(error);
    if (error.message.indexOf('duplicate key error') !== -1)
      return errorResponseHandler(res, error, "EmployeeShift name is already exist !");
    else
      return errorResponseHandler(res, error, "Exception occurred !");
  }
};





/**
*  update EmployeeShift 
*/


exports.updateEmployeeShift = (req, res) => {
  req.body['fromDate'] = setTime(req.body.fromDate)
  req.body['toDate'] = setTime(req.body.toDate)
  EmployeeShift.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .populate('employee branch shift')
    .populate({ path: 'employee', populate: { path: "credentialId" } })
    .populate({ path: 'employee', populate: { path: "branch" } })
    .then(response => {
      return successResponseHandler(res, response, "successfully updated EmployeeShift !!");
    }).catch(error => {
      logger.error(error);
      if (error.message.indexOf('duplicate key error') !== -1)
        return errorResponseHandler(res, error, "EmployeeShift name is already exist !");
      else
        return errorResponseHandler(res, error, "Exception occurred !");
    });
};



/**
 * get all shifts of Employee by Employee Id and Branch
 */

exports.getAllEmployeeShiftByIdAndBranch = (req, res) => {
  EmployeeShift.find({ "employee": req.body.employeeId, "branch": req.body.branch })
    .populate('shift')
    .then(response => {
      successResponseHandler(res, response, "successfully get all shifts of Employee !!");
    }).catch(error => {
      logger.error(error);
      errorResponseHandler(res, error, "Exception while getting all shifts of Employee !");
    });
}


exports.getAllEmployeeShiftByShiftAndBranchAndEmployee = async (req, res) => {
  try {
    req.body["date"] = setTime(req.body.date);
    let response = await EmployeeShift.find({ "employee": { $in: req.body.trainerIds }, "branch": req.body.branch, shift: req.body.shift })
      .populate('shift')
      .populate({ path: 'employee', populate: { path: "credentialId" } }).lean()
    let newResponse = response.filter(doc => {
      if (doc.fromDate <= new Date(req.body.date) && doc.toDate >= new Date(req.body.date)) return doc
    })
    return successResponseHandler(res, newResponse, "successfully get all active EmployeeShift !!");
  } catch (error) {
    logger.error(error);
    errorResponseHandler(res, error, "Exception while getting all shifts of Employee !");
  }
}