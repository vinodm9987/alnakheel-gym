const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ManualBackupSchema = new Schema({

  backupName: String,

  backupDestination: String,

  dateOfBackup: Date,

  timeOfBackup: Date,

  status: { type: String, enum: ["Failed", "Success"] }

}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }, { strict: false });

module.exports = mongoose.model('ManualBackup', ManualBackupSchema);