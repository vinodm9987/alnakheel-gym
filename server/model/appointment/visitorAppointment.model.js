const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VisitorAppointmentSchema = new Schema({

  appointmentFor: { type: String, enum: ["member", "visitor"] },

  visitorName: String,

  mobileNo: String,

  purposeOfVisit: String,

  date: Date,

  branch: { type: Schema.Types.ObjectId, ref: "Branch" },

  fromTime: Date,

  toTime: Date,

  doneBy: { type: Schema.Types.ObjectId, ref: "Credential" }

}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }, { strict: false });


module.exports = mongoose.model('VisitorAppointment', VisitorAppointmentSchema);