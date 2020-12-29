const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TrafficStatisticsSchema = new Schema({

  branch: { type: Schema.Types.ObjectId, ref: "Branch" },
  days: { type: Number, enum: [0, 1, 2, 3, 4, 5, 6] },
  members: [{
    member: { type: Schema.Types.ObjectId, ref: "Members" },
    status: { type: String, enum: ["CheckIn", "CheckOut"] },
    timeIn: Date, timeOut: Date
  }],
  date: Date,
  1: { type: Number, default: 0 },
  2: { type: Number, default: 0 },
  3: { type: Number, default: 0 },
  4: { type: Number, default: 0 },
  5: { type: Number, default: 0 },
  6: { type: Number, default: 0 },
  7: { type: Number, default: 0 },
  8: { type: Number, default: 0 },
  9: { type: Number, default: 0 },
  10: { type: Number, default: 0 },
  11: { type: Number, default: 0 },
  12: { type: Number, default: 0 },
  13: { type: Number, default: 0 },
  14: { type: Number, default: 0 },
  15: { type: Number, default: 0 },
  16: { type: Number, default: 0 },
  17: { type: Number, default: 0 },
  18: { type: Number, default: 0 },
  19: { type: Number, default: 0 },
  20: { type: Number, default: 0 },
  21: { type: Number, default: 0 },
  22: { type: Number, default: 0 },
  23: { type: Number, default: 0 },
  24: { type: Number, default: 0 },

}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }, { strict: false });


module.exports = mongoose.model('TrafficStatistics', TrafficStatisticsSchema);
