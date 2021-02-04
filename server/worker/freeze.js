const { logger: { logger } } = require('../../config')
const { DetailsIcon } = require('../constant/mobileIcon');
const { Credential } = require('../model')
const { FreezeAccept, } = require('../constant/messageRedirect');
const { mobileObject, webObject } = require('../notification/service');
const { Details } = require('../constant/webIcon');
const { notificationObjectWithoutToken } = require("../utils/notification")
const { createBroadcastForMember } = require('../notification/service')
const { getAllBranch } = require('../service/branch.service');
const { freezeMember } = require('../biostar');


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



}