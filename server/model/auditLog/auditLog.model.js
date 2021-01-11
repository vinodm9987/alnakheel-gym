const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const auditLogSchema = new Schema({

  userId: { type: Schema.Types.ObjectId, ref: "Credential" },

  method: { type: String },

  date: { type: Date },

  time: { type: Date },

  ip: { type: String },

  ipLocation: { type: Schema.Types.Mixed },

  requestData: { type: Schema.Types.Mixed },

  responseData: { type: Schema.Types.Mixed },

  event: { type: String },

  status: { type: String },

}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }, { strict: false });



module.exports = mongoose.model('AuditLog', auditLogSchema);