const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OfferStockSchema = new Schema({

    offerName: String,

    offerPercentage: Number,

    startDate: Date,

    endDate: Date,

    product: { type: Schema.Types.ObjectId, ref: 'Stocks' },

    status: { type: Boolean, default: true },

}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }, { strict: false });


module.exports = mongoose.model('OfferStock', OfferStockSchema);