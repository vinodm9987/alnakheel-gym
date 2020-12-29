/**  
 * utils.
*/

const { logger: { logger }, upload: { uploadAvatar }, handler: { successResponseHandler, errorResponseHandler } } = require('../../../config');
const { Formate: { setTime }, IdGenerator: { createId, generateOrderId }, Referral: { addPointOfPolicy, checkExpiryOfPolicy, completeGiftRedeem } } = require('../../utils');
const { classCapacity, classFullBooked } = require('../../notification/helper')

const { newClassAssign, newClassCreate } = require('../../notification/helper');

/**
 * models.
*/

const { Classes, Room, MemberClass, Member } = require('../../model');

const { addClass, updateClass } = require('../../biostar');




/** 
 * ******************* ROOM CONTROLLER ********************
*/





exports.getAllRoomForAdmin = (req, res) => {
  Room.find({})
    .populate('branch')
    .then(response => {
      successResponseHandler(res, response, "successfully get all Room !!");
    }).catch(error => {
      logger.error(error);
      errorResponseHandler(res, error, "Exception while getting all Room !");
    });
};




exports.getAllRoom = (req, res) => {
  Room.find({ status: true })
    .then(response => {
      successResponseHandler(res, response, "successfully get all active Room !!");
    }).catch(error => {
      logger.error(error);
      errorResponseHandler(res, error, "Exception while getting all active Room !");
    });
};




exports.getRoomById = (req, res) => {
  Room.findById(req.params.id)
    .then(response => {
      successResponseHandler(res, response, "successfully get  Room by id !!");
    }).catch(error => {
      logger.error(error);
      errorResponseHandler(res, error, "Exception while getting  Room by id !");
    });
};




exports.addRoom = async (req, res) => {
  try {
    let newRoom = new Room(req.body);
    let response = await newRoom.save();
    let newResponse = await Room.findById(response._id)
      .populate('branch')
    return successResponseHandler(res, newResponse, "successfully added new Room !!");
  } catch (error) {
    logger.error(error);
    if (error.message.indexOf('duplicate key error') !== -1)
      return errorResponseHandler(res, error, "Room name is already exist !");
    else
      return errorResponseHandler(res, error, "Exception occurred !");
  }
};




exports.updateRoom = (req, res) => {
  Room.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .populate('branch')
    .then(response => {
      return successResponseHandler(res, response, "successfully updated Room !!");
    }).catch(error => {
      logger.error(error);
      if (error.message.indexOf('duplicate key error') !== -1)
        return errorResponseHandler(res, error, "Room name is already exist !");
      else
        return errorResponseHandler(res, error, "Exception occurred !");
    });
};


exports.getAllRoomByBranch = (req, res) => {
  Room.find({ status: true, branch: req.body.branch })
    .then(response => {
      successResponseHandler(res, response, "successfully get all Room !!");
    }).catch(error => {
      logger.error(error);
      errorResponseHandler(res, error, "Exception while getting all Room !");
    });
}









/**
 ********************** CLASSES CONTROLLER FOR ADMIN *********************
*/







exports.getAllClassesForAdmin = async (req, res) => {

  try {
    let response = await Classes.find({})
      .populate('branch room')
      .populate({ path: 'trainer', populate: { path: "credentialId" } })
      .populate({ path: 'trainer', populate: { path: "branch" } }).lean();
    let newResponse = response.filter(doc => {
      if (req.body.search) {
        let search = req.body.search.toLowerCase()
        let temp1 = doc.className.toLowerCase()
        if (temp1.includes(search)) {
          return doc;
        }
      } else {
        return doc;
      }
    });
    successResponseHandler(res, newResponse, "successfully get all classes !!");
  } catch (error) {
    logger.error(error);
    errorResponseHandler(res, error, "Exception while getting all classes !");
  }
};




exports.getAllActiveClasses = (req, res) => {
  Classes.find({ endDate: { $lte: setTime(new Date()) } })
    .populate('members trainer branchName room')
    .then(response => {
      successResponseHandler(res, response, "successfully get all active classes !!");
    }).catch(error => {
      logger.error(error);
      errorResponseHandler(res, error, "Exception while getting all active classes !");
    });
};



exports.getClassById = (req, res) => {
  Classes.findById(req.params.id)
    .populate('branch room members vat')
    .populate({ path: 'trainer', populate: { path: "credentialId" } })
    .populate({ path: 'members', populate: { path: "member", populate: { path: "credentialId" } } })
    .then(response => {
      successResponseHandler(res, response, "successfully get Class by id !!");
    }).catch(error => {
      logger.error(error);
      errorResponseHandler(res, error, "Exception while getting Class by id !");
    });
};




exports.addNewClasses = (req, res) => {
  uploadAvatar(req, res, async (error, result) => {
    if (error)
      return errorResponseHandler(res, error, "while uploading image error occurred !");
    try {
      let data = JSON.parse(req.body.data);
      data["startDate"] = setTime(data.startDate);
      data["endDate"] = setTime(data.endDate);
      data["image"] = req.files[0];
      data["bioStarInfo"] = await addClass(data.className);
      let newClasses = new Classes(data);
      let response = await newClasses.save();
      let newResponse = await Classes.findById(response._id)
        .populate('branch room')
        .populate({ path: 'trainer', populate: { path: "credentialId" } })
        .populate({ path: 'trainer', populate: { path: "branch" } });
      await newClassAssign(data.trainer);
      await newClassCreate(data.className);
      successResponseHandler(res, newResponse, "successfully added new classes !!");
    } catch (error) {
      logger.error(error);
      if (error.message.indexOf('duplicate key error') !== -1)
        return errorResponseHandler(res, error, "classes name is already exist !");
      if (error.endTime)
        return errorResponseHandler(res, error, "End time is required !");
      if (error.startTime)
        return errorResponseHandler(res, error, "Start Time is required !");
      if (error.capacity)
        return errorResponseHandler(res, error, "capacity is required !");
      if (error.room)
        return errorResponseHandler(res, error, "Room name is required  !");
      if (error.endDate)
        return errorResponseHandler(res, error, "End Date is required !");
      if (error.startDate)
        return errorResponseHandler(res, error, "Start Date is required  !");
      else
        return errorResponseHandler(res, error, "Exception occurred !");
    }
  })
};


exports.updateClasses = async (req, res) => {
  uploadAvatar(req, res, async (error, result) => {
    if (error)
      return errorResponseHandler(res, error, "while uploading image error occurred !");
    try {
      let data = JSON.parse(req.body.data);
      data["startDate"] = setTime(data.startDate);
      data["endDate"] = setTime(data.endDate);
      if (req.files.length !== 0) {
        data["image"] = req.files[0]
      }
      const classData = await Classes.findById(req.params.id).lean()
      data['bioStarInfo'] = await updateClass(data.className, classData.bioStarInfo)
      const response = await Classes.findByIdAndUpdate(req.params.id, data, { new: true })
        .populate('branch room')
        .populate({ path: 'trainer', populate: { path: "credentialId" } })
        .populate({ path: 'trainer', populate: { path: "branch" } }).lean()
      return successResponseHandler(res, response, "successfully update the Class !!");
    } catch (error) {
      logger.error(error);
      if (error.message.indexOf('duplicate key error') !== -1)
        return errorResponseHandler(res, error, "classes name is already exist !");
      if (error.endTime)
        return errorResponseHandler(res, error, "End time is required !");
      if (error.startTime)
        return errorResponseHandler(res, error, "Start Time is required !");
      if (error.capacity)
        return errorResponseHandler(res, error, "capacity is required !");
      if (error.room)
        return errorResponseHandler(res, error, "Room name is required  !");
      if (error.endDate)
        return errorResponseHandler(res, error, "End Date is required !");
      if (error.startDate)
        return errorResponseHandler(res, error, "Start Date is required  !");
      else
        return errorResponseHandler(res, error, "Exception occurred !");
    }
  })
};


exports.getAllClassesByBranch = async (req, res) => {
  try {
    let queryCond = { endDate: { $gte: setTime(new Date()) } }
    if (req.body.branch) queryCond["branch"] = req.body.branch
    if (req.body.trainer) queryCond["trainer"] = req.body.trainer
    let response = await Classes.find(queryCond)
      .populate('vat')
      .populate({ path: 'trainer', populate: { path: "credentialId" } })
      .lean()
    if (req.body.date) {
      let date = setTime(new Date(req.body.date))
      response = response.filter(doc => {
        if (doc.startDate <= new Date(date) && doc.endDate >= new Date(date)) {
          return doc
        }
      })
      return successResponseHandler(res, response, "successfully get all Classes !!");
    } else {
      return successResponseHandler(res, response, "successfully get all Classes !!");
    }
  } catch (error) {
    logger.error(error);
    errorResponseHandler(res, error, "Exception while getting all Classes !");
  }
}


exports.purchaseClassByAdmin = async (req, res) => {
  try {
    let { occupied, capacity, branch, className } = await Classes.findById(req.body.classId).lean();
    const isExist = await MemberClass.findOne({ member: req.body.member, classId: req.body.classId });
    if (+occupied >= +capacity) {
      return errorResponseHandler(res, 'error', "All seats has been occupied !");
    } else if (isExist) {
      return errorResponseHandler(res, 'error', "You already booked classes !");
    } else {
      if (req.headers.userid) {
        req.body["doneBy"] = req.headers.userid
      }
      req.body["orderNo"] = generateOrderId()
      let memberAllClassResponse = await MemberClass.find({ member: req.body.member })
        .populate('classId').lean()
      const userData = await Member.findById(req.body.member).populate('credentialId packageDetails.packages').lean();
      if (memberAllClassResponse.length === 0 && userData.packageDetails.length === 0) {
        const { memberCounter } = await createId('memberCounter');
        await Member.update({ "_id": req.body.member }, { $set: { "memberId": memberCounter } })
      }
      req.body["dateOfPurchase"] = setTime(new Date());
      req.body["paymentStatus"] = "Paid"
      req.body["mode"] = "Pay at Gym"
      let newClass = new MemberClass(req.body);
      let response = await newClass.save();
      let queryCond = { "$push": { members: response._id } }
      queryCond["$inc"] = { occupied: 1 }
      let newResponse = await Classes.findByIdAndUpdate(req.body.classId, queryCond, { new: true })
      // policy logics here 
      const policy = await checkExpiryOfPolicy();
      if (req.body.memberTransactionId) await completeGiftRedeem(req.body.memberTransactionId);
      if (policy) await addPointOfPolicy(req.body.amount, req.body.member);
      //notification logics here
      if (+occupied === Math.round(+capacity / 100 * 90)) { classCapacity(req.body.userId, branch, className) }
      if (+newResponse.occupied === +newResponse.capacity) { classFullBooked(req.body.userId, branch, className) }
      return successResponseHandler(res, newResponse, "successfully assign classes to customer !!");
    }
  } catch (error) {
    logger.error(error);
    return errorResponseHandler(res, error, "Exception occurred (Already Assigned) !");
  }
};



exports.getClassesScheduleByDates = async (req, res) => {
  try {
    let queryCond = { endDate: { $gte: setTime(new Date()) } }
    if (req.body.branch) queryCond["branch"] = req.body.branch
    let response = await Classes.find(queryCond)
      .populate('branch vat')
      .populate({ path: 'trainer', populate: { path: 'credentialId' } })
      .populate({ path: 'members', populate: { path: 'member', populate: { path: "credentialId" } } })
      .lean()
    let classes = []
    response.forEach(doc => {
      doc.classDays.forEach(day => {
        classes.push({ ...doc, ...{ classDays: day } })
      })
    })
    let newResponse = classes.filter(doc => {
      if (new Date(setTime(req.body.startDate)) <= new Date(setTime(doc.classDays)) && new Date(setTime(req.body.endDate)) >= new Date(setTime(doc.classDays))) {
        return doc
      }
    })
    return successResponseHandler(res, newResponse, "successfully get all Classes !!");
  } catch (error) {
    logger.error(error);
    return errorResponseHandler(res, error, "Exception occurred !");
  }
}






/*
 * ********************* CLASSES CONTROLLER FOR MEMBER *********************
*/






exports.getCustomerClassesScheduleByDates = async (req, res) => {
  try {
    let response = await MemberClass.find({ member: req.body.member, paymentStatus: 'Paid' })
      .populate('classId')
      .populate({ path: 'classId', populate: { path: 'trainer', populate: { path: 'credentialId' } } })
      .lean()
    let classes = []
    response.forEach(doc => {
      doc.classId.classDays.forEach(day => {
        classes.push({ ...doc.classId, ...{ classDays: day } })
      })
    })
    let newResponse = classes.filter(doc => {
      if (new Date(setTime(req.body.startDate)) <= doc.classDays && new Date(setTime(req.body.endDate)) >= doc.classDays) {
        return doc
      }
    })
    return successResponseHandler(res, newResponse, "successfully get all Classes !!");
  } catch (error) {
    logger.error(error);
    return errorResponseHandler(res, error, "Exception occurred !");
  }
}


exports.getCustomerClassesDetails = async (req, res) => {
  try {
    let response = await MemberClass.find({ member: req.body.member, paymentStatus: 'Paid' })
      .populate('classId member')
      .populate({ path: 'classId', populate: { path: 'trainer', populate: { path: 'credentialId' } } })
      .lean()
    return successResponseHandler(res, response, "successfully get all Classes !!");
  } catch (error) {
    logger.error(error);
    return errorResponseHandler(res, error, "Exception occurred !");
  }
}


exports.purchaseClassByMember = async (req, res) => {
  try {
    let { occupied, capacity } = await Classes.findById(req.body.classId).lean();
    if (+occupied >= +capacity) {
      return errorResponseHandler(res, 'error', "All seats has been occupied !");
    } else {
      if (req.headers.userid) {
        req.body["doneBy"] = req.headers.userid
      }
      req.body["orderNo"] = generateOrderId()
      req.body["dateOfPurchase"] = setTime(new Date());
      let newClass = new MemberClass(req.body);
      let response = await newClass.save();
      let queryCond = { "$push": { members: response._id } }
      let newResponse = await Classes.findByIdAndUpdate(req.body.classId, queryCond, { new: true })
      return successResponseHandler(res, newResponse, "successfully assign classes to customer !!");
    }
  } catch (error) {
    logger.error(error);
    return errorResponseHandler(res, error, "Exception occurred (Already Assigned) !");
  }
};





/*
 * ********************* CLASSES CONTROLLER FOR TRAINER *********************
*/



exports.getMyClasses = (req, res) => {
  Classes.find({ trainer: req.body.trainer })
    .populate({ path: 'members', populate: { path: 'member', populate: { path: "credentialId" } } })
    .then(response => {
      return successResponseHandler(res, response, "successfully get classes !")
    }).catch(error => {
      logger.error(error);
      return errorResponseHandler(res, error, "failed to get classes !");
    });
};


/** 
 *  start the class of member
*/


exports.startClass = async (req, res) => {
  try {
    req.body["classStartDate"] = setTime(req.body.classStartDate);
    const memberClassResponse = await MemberClass.findOneAndUpdate({ '_id': req.body.memberClassId },
      { $set: { 'classStartDate': req.body.classStartDate } },
      { returnNewDocument: true }
    ).populate('classId').lean()
    let memberAllClassResponse = await MemberClass.find({ member: req.body.memberId })
      .populate('classId').lean()
    const userData = await Member.findById(req.body.memberId).populate('credentialId packageDetails.packages').lean();
    const photo = sharp(userData.credentialId.avatar.path).rotate().resize(200).toBuffer()
    let obj = {
      accessGroupName: memberClassResponse.classId.bioStarInfo.accessGroupName,
      accessGroupId: memberClassResponse.classId.bioStarInfo.accessGroupId,
      userGroupId: memberClassResponse.classId.bioStarInfo.userGroupId,
      endDate: memberClassResponse.classId.endDate,
      memberId: userData.memberId,
      name: userData.credentialId.userName,
      email: userData.credentialId.email,
      newPhoto: photo.toString('base64').replace('data:image/png;base64,', ''),
      phoneNumber: userData.mobileNo,
      template0: userData.biometricTemplate.template0,
      template1: userData.biometricTemplate.template1,
      startDate: memberClassResponse.classId.startDate
    }
    memberAllClassResponse.forEach(memberClass => {
      if (new Date(memberClass.classId.startDate) < new Date(obj.startDate)) obj.startDate = memberClass.classId.startDate
      if (new Date(memberClass.classId.endDate) > new Date(obj.endDate)) obj.endDate = memberClass.classId.endDate
    })
    userData.packageDetails.forEach(memberPackage => {
      if (new Date(memberPackage.startDate) < new Date(obj.startDate)) obj.startDate = memberPackage.startDate
      if (new Date(memberPackage.endDate) > new Date(obj.endDate)) obj.endDate = memberPackage.endDate
    })
    if (memberAllClassResponse.length > 1) await updateMemberInBioStar(obj);
    else await addMemberInBioStar(obj);
    let newResponse = await MemberClass.find({ member: req.body.memberId, paymentStatus: 'Paid' })
      .populate('classId member')
      .populate({ path: 'classId', populate: { path: 'trainer', populate: { path: 'credentialId' } } })
      .lean()
    successResponseHandler(res, newResponse, "successfull !!");
  } catch (error) {
    logger.error(error);
    errorResponseHandler(res, error, "Exception while send code !");
  }
};