const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const branchSchema = new Schema({

    branchName: {
        type: String,
        unique: true
    },

    geoCode: {
        type: String,
    },

    address: {
        type: String
    },

    status: {
        type: Boolean,
        default: true
    },

    email: {
        type: String
    },

    mobile: {
        type: String
    },

    capacity: {
        type: Number
    }


}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }, { strict: false });


module.exports = mongoose.model('Branch', branchSchema);