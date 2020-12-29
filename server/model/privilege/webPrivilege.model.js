const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const privilegeSchema = new Schema({

    moduleName: {
        type: String,
        trim: true,
    },

    icon: {
        type: String
    },

    component: [{

        componentName: {
            type: String,
            trim: true,
        },

        componentPath: {
            type: String,
            trim: true,
        },

        route: {
            type: String,
            trim: true,
        },

        read: {
            type: Boolean
        },

        write: {
            type: Boolean
        }
    }],

    userId: {
        type: Schema.Types.ObjectId,
        ref: "Credential"
    }


}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }, { strict: false });

privilegeSchema.index({ 'moduleName': 1, 'userId': 1 }, { unique: true });

module.exports = mongoose.model('WebPrivilege', privilegeSchema);