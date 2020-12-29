const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const currencySchema = new Schema({

    countryName: {
        type: String,
        unique: true
    },

    currencyCode: {
        type: String
    },

    status: {
        type: Boolean,
        default: true
    },

    isDefault: {
        type: Boolean,
        default: false
    }


}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }, { strict: false });


module.exports = mongoose.model('Currency', currencySchema);