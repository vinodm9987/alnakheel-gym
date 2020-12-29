const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const trainerFeesSchema = new Schema({

    trainerName: {
        type: Schema.Types.ObjectId,
        ref: 'Employee',
    },

    period: {
        type: Schema.Types.ObjectId,
        ref: "Period"
    },

    branch: {
        type: Schema.Types.ObjectId,
        ref: 'Branch'
    },

    amount: {
        type: Number,
        required: [true, "Amount is required !"]
    },

    status: {
        type: Boolean,
        default: true
    }


}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }, { strict: false });


trainerFeesSchema.index({ 'trainerName': 1, 'period': 1, 'branch': 1 }, { unique: true });


module.exports = mongoose.model('TrainerFees', trainerFeesSchema);