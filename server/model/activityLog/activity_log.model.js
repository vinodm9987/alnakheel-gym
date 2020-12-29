const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ActivityLogSchema = new Schema({

    collectionType: {
        type: 'String',
    },

    referenceDocument: {
        type: Schema.Types.Mixed
    },

    action: {
        type: 'String',
    },

    message: {
        type: 'String'
    },

    loggedBy: {

    },

    createdAt: {
        type: 'Date'
    },

    role: {
        type: String
    }

}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }, { strict: false });

module.exports = mongoose.model("ActivityLog", ActivityLogSchema);