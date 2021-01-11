/**  
 * utils.
*/

const { logger: { logger }, handler: { successResponseHandler, errorResponseHandler } } = require('../../../config');

/**
 * models.
*/

const { AuditLog } = require('../../model');
const { setTime } = require('../../utils/timeFormate.util');


/**
 * get all AuditLog
*/


exports.getAuditLogs = async (req, res) => {
  try {
    let response = await AuditLog.find({}).populate('userId')
      .populate({ path: 'userId', populate: { path: 'designation' } }).lean();
    let search = req.body.search.toLowerCase()
    let newResponse = response.filter((doc) => {
      if (search) {
        let temp = doc.userId.email.toLowerCase()
        let temp1 = doc.userId.userName.toLowerCase()
        // let temp3 = doc.mobileNo.toString()
        if (temp.includes(search) || temp1.includes(search)) {
          return doc
        }
      } else {
        return doc;
      }
    })
    newResponse = newResponse.filter(doc => {
      if (req.body.fromDate && req.body.toDate) {
        if (new Date(setTime(req.body.fromDate)) <= doc.date && new Date(setTime(req.body.toDate)) >= doc.date) {
          return doc
        }
      } else {
        return doc
      }
    })
    successResponseHandler(res, newResponse, "successfully get all audit logs !!");
  } catch (err) {
    logger.error(error);
    errorResponseHandler(res, error, "Exception while getting audit logs!");
  }
};