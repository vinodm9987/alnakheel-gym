module.exports = {

  createTrafficData: async (Traffic, branch, days, date) => {
    try {
      const traffic = new Traffic({ branch, days, date });
      const response = await traffic.save();
      return { error: false, response };
    } catch (error) {
      return { error: true, response: error };
    }
  },

  addMemberInTraffic: async (Traffic, trafficSecondId, member, trafficId) => {
    try {
      const _id = trafficId ? trafficId._id : trafficSecondId._id;
      const response = await Traffic.findByIdAndUpdate(_id, { $push: { members: { member, status: 'CheckIn', timeIn: new Date() } } }).lean();
      return { error: false, response };
    } catch (error) {
      return { error: true, response: error };
    }
  },


  calculateTraffic: async (Traffic, id, memberId) => {
    const temp = await Traffic.update({ _id: id, 'members.member': memberId }, {
      'members.$.status': 'CheckOut', 'members.$.timeOut': new Date()
    }).lean();
    const data = await Traffic.findById(id).lean();
    const memberData = data.members.filter(doc => doc.member.toString() === memberId.toString())[0];
    const inHour = new Date(memberData.timeIn).getHours();
    const outHour = new Date(memberData.timeOut).getHours();
    let body = { $inc: '' };
    for (let i = inHour; i <= outHour; i++) {
      let hour = Object.assign({}, {});
      hour[i] = 1;
      body['$inc'] = hour;
      if (i === outHour) {
        await Traffic.findByIdAndUpdate(id, body).lean();
      }
    }
  }

}
