const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RestoreSchema = new Schema({

  restoreName: String,

  restoreDestination: String,

  dateOfRestore: Date,

  timeOfRestore: Date,

  status: { type: String, enum: ["Failed", "Success"] }

}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }, { strict: false });

module.exports = mongoose.model('Restore', RestoreSchema);