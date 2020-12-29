const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AnnouncementSchema = new Schema({

    description: String, startDate: Date,

    endDate: Date, color: String, title: String,

    users: [{
        user: { type: Schema.Types.ObjectId, ref: "Credential" },
        read: { type: Boolean }
    }],

    status: { type: Boolean, default: true },

}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }, { strict: false });


module.exports = mongoose.model('Announcement', AnnouncementSchema);