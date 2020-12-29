const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const periodSchema = new Schema({

    periodName: {
        type: String,
        unique: true
    },

    periodDays: {
        type: Number
    },

    status: {
        type: Boolean,
        default: true
    }


}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }, { strict: false });


module.exports = mongoose.model('Period', periodSchema);