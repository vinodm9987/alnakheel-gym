const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MoneyCollectionSchema = new Schema({

  branch: { type: Schema.Types.ObjectId, ref: 'Branch' },

  date: Date,

  collectMoneyHistory: String,

  original: {
    totalAmount: Number,
    collections: [{
      collectionName: String,
      total: Number, cash: Number, card: Number, digital: Number
    }]
  },

  remain: {
    totalAmount: Number,
    collections: [{
      collectionName: String,
      total: Number, cash: Number, card: Number, digital: Number
    }]
  },

  taken: [{
    totalAmount: Number,
    collections: [{
      collectionName: String,
      total: Number, cash: Number, card: Number, digital: Number
    }],
    collectedBy: { type: Schema.Types.ObjectId, ref: 'Credential' },
    dateOfTaken: Date,
    timeOfTaken: Date
  }],

}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }, { strict: false });

module.exports = mongoose.model('MoneyCollection', MoneyCollectionSchema);