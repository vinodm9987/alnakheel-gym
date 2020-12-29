const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({

    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },

    date: {
        type: Date
    },

    time: {
        type: Date
    },

    title: {
        type: String
    },

    description: {
        type: String
    },

    mobileCompo: {
        type: String
    },

    read: {
        type: Boolean,
        default: false
    },

    webPath: {
        type: String
    },

    notificationType: {
        type: String,
        enum: ["Web", "Mobile"]
    },

    icon: {
        type: String
    },

    backgroundColor: {
        type: String
    },

    color: {
        type: String
    },

    webIcon: {
        type: Object
    },

}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }, { strict: false });


module.exports = mongoose.model('Notification', NotificationSchema);
