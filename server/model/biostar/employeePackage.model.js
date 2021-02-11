const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmployeePackageSchema = new Schema({

  accessLevelId: String,

}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }, { strict: false });


module.exports = mongoose.model('EmployeePackage', EmployeePackageSchema);
