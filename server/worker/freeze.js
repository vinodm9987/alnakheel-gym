const { logger: { logger } } = require('../../config')
const { DetailsIcon } = require('../constant/mobileIcon');
const { Credential, MemberFreezing } = require('../model')
const { FreezeAccept, } = require('../constant/messageRedirect');
const { mobileObject, webObject } = require('../notification/service');
const { Details } = require('../constant/webIcon');
const { notificationObjectWithoutToken } = require("../utils/notification")
const { createBroadcastForMember } = require('../notification/service')
const { getAllBranch } = require('../service/branch.service');
const { freezeMember } = require('../biostar');
const { Formate: { setTime, checkDateInBetween } } = require('../utils');



module.exports = {


  freezeMemberInBioStar: async (memberId, startDate, endDate) => {
    try {
      const branches = await getAllBranch();
      for (const branch of branches) {
        await freezeMember(branch.bioStarIp, memberId, startDate, endDate);
      }
    } catch (error) {
      logger.error(error);
    }
  },


  memberFreezeNotification: async (members) => {
    const users = await Credential.find({ userId: { $in: members } }).lean();
    const { name, backgroundColor, color } = DetailsIcon;
    const { title, webPath, mobileCompo } = FreezeAccept();
    const mobile = mobileObject(title, mobileCompo, "_id", name, color, backgroundColor);
    const web = webObject(title, webPath, "_id", Details);
    const message = notificationObjectWithoutToken('Point Redeem', title, { mobileCompo });
    await createBroadcastForMember(mobile, web, message, users);
  },

  checkIsMemberFreezable: (packagesDetails, to) => {
    const toTime = new Date(setTime(to)).getTime();
    let isFreezable = false;
    for (const packages of packagesDetails) {
      let packagesEnd = packages.extendDate ?
        new Date(setTime(packages.extendDate)).getTime() :
        new Date(setTime(packages.endDate)).getTime();
      if (packagesEnd > toTime) {
        isFreezable = true;
      } else {
        isFreezable = false;
      }
      return isFreezable;
    }
  },

  memberFreeze: async (member, packageIndex, largest, days, _id, reactivationDate) => {
    try {
      const today = setTime(new Date());
      const memberPackageData = member.packageDetails[packageIndex];
      const notStartedPackage = new Date(memberPackageData.startDate) > new Date(today) && checkDateInBetween(reactivationDate, memberPackageData.startDate, memberPackageData.endDate);
      if (new Date(memberPackageData.startDate) >= new Date(reactivationDate)) return largest;  // handle package is not started and reactivation date is not lie in between startDate and endDate
      if (!memberPackageData.isExpiredPackage && notStartedPackage) {  // handle package is not started and reactivation date lie in between startDate and endDate
        memberPackageData.endDate = new Date(new Date(memberPackageData.endDate).setDate(new Date(memberPackageData.endDate).getDate() + days));
        memberPackageData.startDate = new Date(new Date(memberPackageData.startDate).setDate(new Date(memberPackageData.startDate).getDate() + days));
        await MemberFreezing.findByIdAndUpdate(_id, { typeOfFreeze: "Froze" })
        if (new Date(memberPackageData.endDate) > new Date(largest)) { largest = new Date(memberPackageData.extendDate) }
      }
      else if (!memberPackageData.isExpiredPackage && memberPackageData.extendDate && memberPackageData.extendDate > new Date(today)) {   // handle package should not expire and it already freeze earlier
        memberPackageData.extendDate = new Date(memberPackageData.extendDate).setDate(new Date(memberPackageData.extendDate).getDate() + days);
        memberPackageData.reactivationDate = reactivationDate; memberPackageData.freezeDate = today;
        await MemberFreezing.findByIdAndUpdate(_id, { typeOfFreeze: "Froze" })
        if (new Date(memberPackageData.extendDate) > new Date(largest)) { largest = new Date(memberPackageData.extendDate) }
      } else if (!memberPackageData.isExpiredPackage && memberPackageData.endDate > new Date(today)) {  // handle package should not expire
        memberPackageData.extendDate = new Date(memberPackageData.endDate).setDate(new Date(memberPackageData.endDate).getDate() + days);
        memberPackageData.reactivationDate = reactivationDate; memberPackageData.freezeDate = today;
        await MemberFreezing.findByIdAndUpdate(_id, { typeOfFreeze: "Froze" })
        if (new Date(memberPackageData.extendDate) > new Date(largest)) { largest = new Date(memberPackageData.extendDate) }
      }
      if (!memberPackageData.isExpiredPackage) {
        for (const [j, trainer] of memberPackageData.trainerDetails.entries()) {
          if (!trainer.isExpiredTrainer && trainer.trainerExtend && trainer.trainerExtend > new Date(today)) {
            memberPackageData.trainerDetails[j].trainerExtend = new Date(trainer.trainerExtend).setDate(new Date(trainer.trainerExtend).getDate() + days);
          } else if (!trainer.isExpiredTrainer && trainer.trainerEnd && trainer.trainerEnd > new Date(today)) {
            memberPackageData.trainerDetails[j].trainerExtend = new Date(trainer.trainerEnd).setDate(new Date(trainer.trainerEnd).getDate() + days);
          } else if (!trainer.isExpiredTrainer && trainer.trainerEnd && trainer.trainerStart > new Date(today)) {
            memberPackageData.trainerDetails[j].trainerEnd = new Date(trainer.trainerEnd).setDate(new Date(trainer.trainerEnd).getDate() + days);
            memberPackageData.trainerDetails[j].trainerStart = new Date(trainer.trainerStart).setDate(new Date(trainer.trainerStart).getDate() + days)
          }
        }
      }
      await member.save();
      return largest;
    } catch (error) {
      logger.error(error);
    }
  }



}