const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const designationSchema = new Schema({

    designationName: {
        type: String,
        unique: true
    },

    status: {
        type: Boolean,
        default: true
    }


}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }, { strict: false });


module.exports = mongoose.model('Designation', designationSchema);