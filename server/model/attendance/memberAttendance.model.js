const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MemberAttendanceSchema = new Schema({

    memberId: {
        type: Schema.Types.ObjectId,
        ref: "Member"
    },

    branch: {
        type: Schema.Types.ObjectId,
        ref: "Branch"
    },

    date: {
        type: Date
    },

    timeIn: {
        type: Date
    },

    timeOut: {
        type: Date,
        default: null
    }

}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }, { strict: false });


module.exports = mongoose.model('MemberAttendance', MemberAttendanceSchema);