const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoomSchema = new Schema({

    roomName: {
        type: String,
    },

    branch: {
        type: Schema.Types.ObjectId,
        ref: "Branch"
    },

    status: {
        type: Boolean,
        default: true
    }

}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }, { strict: false });

RoomSchema.index({ 'roomName': 1, 'branch': 1 }, { unique: true });


module.exports = mongoose.model('Room', RoomSchema);