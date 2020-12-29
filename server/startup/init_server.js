const { Designation, Credential, SystemYear } = require('../model');
const { config: { DESIGNATION, ADMIN_PASSWORD } } = require('../../config');
const { Formate: { setTime } } = require('../utils');

module.exports = {

    initialSetupForDesignation: async () => {
        for (let i = 0; i < DESIGNATION.length; i++) {
            await Designation.findOneAndUpdate({ designationName: DESIGNATION[i] }, { status: true }, { upsert: true });
        }
    },


    initialSetupForAdmin: async () => {
        const adminId = await Designation.findOne({ designationName: "System Admin" }).lean();
        let isExists = await Credential.findOne({ designation: adminId._id }).count();
        if (!isExists && adminId) {
            let admin = new Credential({
                userName: "System Admin", email: "admin@pixel.com",
                designation: adminId._id,
            });
            admin.setPassword(ADMIN_PASSWORD);
            await admin.save();
        }
    },

    initialSetupForSystemYear: async () => {
        let isExists = await SystemYear.find({}).count();
        if (!isExists) {
            let year = new SystemYear({
                year: setTime(new Date())
            });
            await year.save();
        }
    }

};