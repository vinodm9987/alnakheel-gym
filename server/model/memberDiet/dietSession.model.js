const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dietSessionSchema = new Schema({

    sessionName: {
        type: String,
        unique: true
    },

    fromTime: {
        type: Date
    },

    toTime: {
        type: Date
    },

    status: {
        type: Boolean,
        default: true
    }

}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }, { strict: false });


module.exports = mongoose.model('DietSession', dietSessionSchema);