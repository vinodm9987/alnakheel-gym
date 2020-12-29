const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GiftCardSchema = new Schema({

  title: String,

  points: Number,

  amount: Number,

  startDate: Date,

  endDate: Date,

  description: String,

  image: Number,

  status: { type: Boolean, default: true },

}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }, { strict: false });


module.exports = mongoose.model('GiftCard', GiftCardSchema);