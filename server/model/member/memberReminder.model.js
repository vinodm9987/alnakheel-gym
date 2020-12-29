const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WaterInTakeSchema = new Schema({

    memberId: {
        type: Schema.Types.ObjectId,
        ref: "Member"
    },

    date: {
        type: Date,
    },

    from: {
        type: Date
    },

    to: {
        type: Date
    },

    remindType: {
        enum: ['time', 'interval'],
        type: String
    },

    interval: {
        type: Number
    },

    intervalTime: [{
        type: Date
    }],

    reminderArray: [{
        type: Date
    }]

}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }, { strict: false });


module.exports = mongoose.model('MemberReminder', WaterInTakeSchema);