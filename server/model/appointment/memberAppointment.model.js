const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MemberAppointmentSchema = new Schema({

  appointmentFor: { type: String, enum: ["member", "visitor"] },

  member: { type: Schema.Types.ObjectId, ref: "Member" },

  date: Date,

  schedule: { type: Schema.Types.ObjectId, ref: "Shift" },

  branch: { type: Schema.Types.ObjectId, ref: "Branch" },

  fromTime: Date,

  toTime: Date,

  trainer: { type: Schema.Types.ObjectId, ref: "Employee" },

  status: { type: String, enum: ["Missed", "Attended"] },

  doneBy: { type: Schema.Types.ObjectId, ref: "Credential" }

}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }, { strict: false });

MemberAppointmentSchema.index({ 'member': 1, 'date': 1, 'schedule': 1 }, { unique: true });

module.exports = mongoose.model('MemberAppointment', MemberAppointmentSchema);