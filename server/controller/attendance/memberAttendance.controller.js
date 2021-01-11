/**
 * utils.
*/

const { logger: { logger }, handler: { successResponseHandler, errorResponseHandler } } = require('../../../config')
const { Formate: { setTime } } = require('../../utils')
const { gymTimeSpent } = require('../../notification/helper')
const { memberOut, appointmentStatus, memberEntranceStatus } = require('../../socket/emitter')
const { createTrafficData, addMemberInTraffic, calculateTraffic } = require('../../service/memberTraffic')
/**
 * models.
*/

const { MemberAttendance, Member, MemberAppointment, TrafficStatistics } = require('../../model');
const { auditLogger } = require('../../middleware/auditlog.middleware')





exports.addMemberAttendance = async (req, res) => {
  try {
    let isExistsTraffic = '';
    let memberInfo = await Member.findOne({ memberId: +req.body.memberId })
      .populate('credentialId')
      .populate({ path: "packageDetails.packages", populate: { path: "period" } }).lean()
    memberInfo["fingerScanStatus"] = req.body.fingerScanStatus
    req.headers.userid = memberInfo.credentialId._id
    auditLogger(req, 'Success')
    memberEntranceStatus(memberInfo)
    const memberId = await Member.findOne({ memberId: +req.body.memberId });
    const isExists = await MemberAttendance.findOne({ memberId: memberId._id, date: setTime(new Date()) });
    const trafficExist = await TrafficStatistics.findOne({ date: setTime(new Date()), branch: memberId.branch });
    const trafficMemberExists = await TrafficStatistics.findOne({ date: setTime(new Date()), branch: memberId.branch, 'members.member': memberId._id }).lean();
    if (trafficMemberExists) {
      await calculateTraffic(TrafficStatistics, trafficMemberExists._id, memberId._id)
    }
    if (!trafficExist) {
      const { error, response } = await createTrafficData(TrafficStatistics, memberId.branch, new Date().getDay(), setTime(new Date()));
      if (error) {
        logger.error(response)
      } else {
        isExistsTraffic = response;
      }
    }
    if (isExists) {
      let response = await MemberAttendance.findByIdAndUpdate(isExists._id, { timeOut: new Date(), branch: memberId.branch }, { new: true })
        .populate('branch')
        .populate({ path: 'memberId', populate: { path: "credentialId" } }).lean();
      memberOut(response);
      await gymTimeSpent(response.memberId, response.timeIn, response.timeOut);
      successResponseHandler(res, response, 'successfully added attendance !');
    } else {
      let newAttendance = new MemberAttendance(req.body);
      newAttendance["memberId"] = memberId._id;
      newAttendance["date"] = setTime(new Date());
      newAttendance["timeIn"] = new Date();
      newAttendance["branch"] = memberId.branch;
      let response = await newAttendance.save();
      const member = await MemberAttendance.findById(response._id).populate('branch')
        .populate({ path: 'memberId', populate: { path: "credentialId" } }).lean();
      memberOut(member);
      await addMemberInTraffic(TrafficStatistics, trafficExist, memberId._id, isExistsTraffic)
      const memberAppointmentExists = await MemberAppointment
        .findOne({ member: memberId._id, date: setTime(new Date()), branch: memberId.branch })
      if (memberAppointmentExists) {
        let memberAppointment = await MemberAppointment
          .findByIdAndUpdate(memberAppointmentExists._id, { status: 'Attended' }, { new: true })
          .populate({ path: 'member', populate: { path: "credentialId" } })
          .populate({ path: 'trainer', populate: { path: "credentialId" } }).lean();
        appointmentStatus(memberAppointment);
      }
      successResponseHandler(res, response, 'successfully added attendance !');
    }
  } catch (error) {
    logger.error(error);
    errorResponseHandler(res, error, "Exception while adding attendance !");
  }
};




exports.getMemberAttendance = async (req, res) => {
  MemberAttendance.find({ memberId: req.body.memberId, date: { $gte: setTime(req.body.from), $lte: setTime(req.body.to) } })
    .then(response => {
      successResponseHandler(res, response, "successfully get member attendance ! ");
    }).catch(error => {
      logger.error(error);
      errorResponseHandler(res, error, "Exception while adding attendance !");
    })
};



exports.getMemberAttendanceForAdmin = async (req, res) => {
  try {
    let queryCond = {}
    if (req.body.branch && req.body.branch !== 'all') queryCond["branch"] = req.body.branch
    if (req.body.date) queryCond["date"] = setTime(req.body.date)
    let response = await MemberAttendance.find(queryCond).populate('memberId branch')
      .populate({ path: 'memberId', populate: { path: "credentialId" } }).lean();
    let newResponse = response.filter(doc => {
      if (req.body.search) {
        let search = req.body.search.toLowerCase();
        let temp1 = doc.memberId.credentialId.userName.toLowerCase();
        let temp2 = doc.memberId.credentialId.email.toLowerCase();
        let temp3 = doc.memberId.memberId.toString();
        if (temp1.includes(search) || temp2.includes(search) || temp3.includes(search)) {
          return doc;
        }
      } else {
        return doc;
      }
    });
    successResponseHandler(res, newResponse, 'successfully get all attendance  !');
  } catch (error) {
    logger.error(error);
    errorResponseHandler(res, error, "Exception while getMemberAttendanceForAdmin !");
  }
};


exports.getAttendanceDetails = async (req, res) => {
  try {
    let queryCond1 = {}, queryCond2 = {}, queryCond3 = {}, queryCond4 = {}
    if (req.body.branch && req.body.branch !== 'all') {
      queryCond1["branch"] = req.body.branch
      queryCond2["branch"] = req.body.branch
      queryCond3["branch"] = req.body.branch
      queryCond4["branch"] = req.body.branch
    }
    queryCond1["date"] = setTime(new Date())
    queryCond2["date"] = setTime(new Date())
    queryCond2["timeOut"] = null
    queryCond3["doneFingerAuth"] = true
    queryCond4["admissionDate"] = setTime(new Date())
    let todayCheck = await MemberAttendance.find(queryCond1).count();
    let inTheGym = await MemberAttendance.find(queryCond2).count();
    let totalMember = await Member.find(queryCond3).count();
    let todayEnroll = await Member.find(queryCond4).count();
    successResponseHandler(res, { todayCheck, inTheGym, todayEnroll, totalMember }, "successfully get data !");
  } catch (error) {
    logger.error(error);
    errorResponseHandler(res, error, "Exception while getMemberAttendanceForAdmin !");
  }
};


