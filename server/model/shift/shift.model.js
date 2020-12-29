const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shiftSchema = new Schema({

  shiftName: {
    type: String,
  },

  fromTime: {
    type: Date
  },

  toTime: {
    type: Date
  },

  color: {
    type: String
  },

  branch: {
    type: Schema.Types.ObjectId,
    ref: "Branch"
  },

  status: {
    type: Boolean,
    default: true
  }

}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }, { strict: false });

shiftSchema.index({ 'shiftName': 1, 'branch': 1 }, { unique: true });

module.exports = mongoose.model('Shift', shiftSchema);