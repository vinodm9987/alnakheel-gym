const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const privilegeSchema = new Schema({

  reportType: {
    type: String,
    trim: true,
  },

  reportName: [{

    name: {
      type: String,
      trim: true,
    },

    headers: Array,

    description: String,

    read: {
      type: Boolean
    }
  }],

  userId: {
    type: Schema.Types.ObjectId,
    ref: "Credential"
  }


}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }, { strict: false });

privilegeSchema.index({ 'reportType': 1, 'userId': 1 }, { unique: true });

module.exports = mongoose.model('ReportPrivilege', privilegeSchema);