const { Designation, Credential, SystemYear, BranchPassword, EmployeePackage } = require('../model');
const { addPackage } = require('../biostar');
const { config: { DESIGNATION, ADMIN_PASSWORD } } = require('../../config');
const { getAllBranch } = require('../service/branch.service');
const { Formate: { setTime } } = require('../utils');
const crypto = require('crypto')


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
    },

    createPasswordForBranch: async () => {
        const isExists = await BranchPassword.findOne({}).lean();
        if (isExists) return;
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = crypto.pbkdf2Sync('sk12345', salt, 1000, 64, `sha512`).toString(`hex`);
        const newPassword = new BranchPassword({ salt, hash });
        const response = await newPassword.save();
        return response;
    },

    matchBranchPassword: async (password) => {
        const branchPassword = await BranchPassword.findOne({}).lean();
        const hash = crypto.pbkdf2Sync(password, branchPassword.salt, 1000, 64, `sha512`).toString(`hex`);
        return branchPassword.hash === hash;
    },

    createEmployeePackage: async () => {
        let isExist = await EmployeePackage.findOne({}).lean();
        if (!isExist) {
            let { scheduleId, accessLevelId, accessGroupId, accessGroupName, userGroupId } = await addPackage('Employee Package', 0, 1439);
            let obj = { scheduleId, accessLevelId, accessGroupId, accessGroupName, userGroupId };
            let newPackage = new EmployeePackage(obj);
            await newPackage.save();
        }
    },

};