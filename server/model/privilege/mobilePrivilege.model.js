const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const privilegeSchema = new Schema({

    moduleName: {
        type: String,
        trim: true,
        unique: true
    },

    components: {
        type: String,
        trim: true,
        unique: true
    },

    read: {
        type: Boolean
    },

    write: {
        type: Boolean
    },

    type: {
        type: String
    },

    userId: {
        type: Schema.Types.ObjectId,
        ref: "Credential"
    }

}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }, { strict: false });


module.exports = mongoose.model('MobilePrivilege', privilegeSchema);