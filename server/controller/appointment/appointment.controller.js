/**
 * utils.
*/

const { logger: { logger }, handler: { successResponseHandler, errorResponseHandler } } = require('../../../config');
const { Formate: { setTime } } = require('../../utils');

/**
 * models.
*/

const { MemberAppointment, VisitorAppointment, Branch, TrafficStatistics, Shift } = require('../../model');




/**
 ***** Appointment controller  *****
*/


exports.bookAppointment = async (req, res) => {
  req.body["date"] = setTime(req.body.date);
  if (req.headers.userid) {
    req.body["doneBy"] = req.headers.userid
  }
  if (req.body.appointmentFor === 'member') {
    let queryCond = {}
    if (req.body.branch && req.body.branch !== 'all') queryCond["branch"] = req.body.branch
    if (req.body.date) queryCond["date"] = setTime(req.body.date)
    if (req.body.schedule) queryCond["schedule"] = req.body.schedule
    let { capacity } = await Branch.findById(req.body.branch).lean();
    let occupied = await MemberAppointment.find(queryCond).count()
    if (+occupied >= +capacity) {
      return errorResponseHandler(res, 'error', "All appointments have been done for this schedule !");
    } else {
      const newAppointment = new MemberAppointment(req.body);
      newAppointment.save()
        .then((response) => {
          successResponseHandler(res, response, "successfully add new appointment");
        }).catch(error => {
          logger.error(error);
          if (error.message.indexOf('duplicate key error') !== -1)
            return errorResponseHandler(res, error, "Sorry you have already booked appointment for this schedule !");
          else
            return errorResponseHandler(res, error, "error ocurred while creating new appointment");
        });
    }
  } else {
    const newAppointment = new VisitorAppointment(req.body);
    newAppointment.save()
      .then((response) => {
        successResponseHandler(res, response, "successfully add new appointment");
      }).catch(error => {
        logger.error(error);
        errorResponseHandler(res, error, "error ocurred while creating new appointment");
      });
  }
};

exports.getAppointmentRequests = async (req, res) => {
  try {
    if (req.body.appointmentFor === 'member') {
      let queryCond = {}
      if (req.body.branch && req.body.branch !== 'all') queryCond["branch"] = req.body.branch
      if (req.body.date) queryCond["date"] = setTime(req.body.date)
      let response = await MemberAppointment.find(queryCond)
        .populate('branch')
        .populate({ path: 'member', populate: { path: "credentialId" } })
        .populate({ path: 'trainer', populate: { path: "credentialId" } }).lean();
      let newResponse = response.filter(doc => {
        if (req.body.search) {
          let search = req.body.search.toLowerCase();
          let temp1 = doc.member.credentialId.userName.toLowerCase();
          let temp2 = doc.member.credentialId.email.toLowerCase();
          let temp3 = doc.member.memberId.toString();
          if (temp1.includes(search) || temp2.includes(search) || temp3.includes(search)) {
            return doc;
          }
        } else {
          return doc;
        }
      });
      successResponseHandler(res, newResponse, 'successfully get all appointments  !');
    } else {
      let queryCond = {}
      if (req.body.branch && req.body.branch !== 'all') queryCond["branch"] = req.body.branch
      if (req.body.date) queryCond["date"] = setTime(req.body.date)
      let response = await VisitorAppointment.find(queryCond)
        .populate('branch')
        .lean();
      let newResponse = response.filter(doc => {
        if (req.body.search) {
          let search = req.body.search.toLowerCase();
          let temp1 = doc.visitorName.toLowerCase();
          if (temp1.includes(search)) {
            return doc;
          }
        } else {
          return doc;
        }
      });
      successResponseHandler(res, newResponse, 'successfully get all appointments  !');
    }
  } catch (error) {
    logger.error(error);
    errorResponseHandler(res, error, "Exception while getting appointments !");
  }
}



/**
 *
 * Member Appointment controller
 *
 *
*/


exports.getMemberAppointmentHistory = async (req, res) => {
  try {
    let queryCond = { "member": req.body.memberId }
    if (req.body.date) queryCond["date"] = setTime(req.body.date)
    let response = await MemberAppointment.find(queryCond)
      .populate({ path: 'member', populate: { path: "credentialId" } })
      .populate({ path: 'trainer', populate: { path: "credentialId" } }).lean();
    successResponseHandler(res, response, 'successfully get all appointments  !');
  } catch (error) {
    logger.error(error);
    errorResponseHandler(res, error, "Exception while getting appointments !");
  }
};




exports.getMemberTraffics = async (req, res) => {
  try {
    let conditions = {};
    let fromTime = 1, toTime = 24, hours = {}, hoursAvg = {};
    if (req.body.branch && req.body.branch !== 'All') conditions["branch"] = req.body.branch;
    if (req.body.date) conditions["date"] = setTime(req.body.date);
    conditions["days"] = req.body.day;
    if (req.body.schedule) {
      const shift = await Shift.findById(req.body.schedule).lean();
      fromTime = new Date(shift.fromTime).getHours(); toTime = new Date(shift.toTime).getHours();
    }
    const response = await TrafficStatistics.find(conditions)
      .populate('branch').lean();
    for (let i = 0; i < response.length; i++) {
      for (const [key, value] of Object.entries(response[i])) {
        if (!isNaN(key) && +key >= fromTime && +key <= toTime) {
          if (hours[key]) {
            hours[key].push(value);
            let sum = hours[key].reduce((a, b) => a + b, 0);
            hoursAvg[key] = sum / hours[key].length;
          } else {
            hours[key] = [];
            hours[key].push(value);
            hoursAvg[key] = value;
          }
        }
      }
      if (i === response.length - 1) {
        return successResponseHandler(res, hoursAvg, "success")
      }
    }
  } catch (error) {
    logger.error(error);
    errorResponseHandler(res, error, "error");
  }
};
