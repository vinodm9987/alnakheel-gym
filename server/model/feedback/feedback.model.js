const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FeedBackSchema = new Schema({

    member: {
        type: Schema.Types.ObjectId,
        ref: "Member"
    },

    optionType: {
        type: String,
        enum: ["Suggestions", "Complaints"]
    },

    description: {
        type: String
    },

    branch: {
        type: Schema.Types.ObjectId,
        ref: "Branch"
    },

    date: {
        type: Date
    },

    time: {
        type: Date
    },

    mode: {
        type: String,
        enum: ["Manual", "Online"],
        default: "Online"
    },

    status: {
        type: String,
        enum: ["Pending", "Completed"],
        default: "Pending"
    },

    adminComment: {
        type: String
    }

}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }, { strict: false });


module.exports = mongoose.model('FeedBack', FeedBackSchema);