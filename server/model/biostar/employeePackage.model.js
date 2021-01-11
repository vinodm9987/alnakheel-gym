const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmployeePackageSchema = new Schema({

  branch: {
    type: Schema.Types.ObjectId,
    ref: "Branch"
  },

  accessLevelId: String,

  accessGroupId: String,

  userGroupId: String,

  scheduleId: String,

  accessGroupName: String,


}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }, { strict: false });


module.exports = mongoose.model('EmployeePackage', EmployeePackageSchema);
