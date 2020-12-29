const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MemberCodeSchema = new Schema({

    member: { type: Schema.Types.ObjectId, ref: "Member" },

    referPolicy: { type: Schema.Types.ObjectId, ref: "RewardPolicy" },

    code: { type: String, trim: true, unique: true },

    joinMember: [{
        member: { type: Schema.Types.ObjectId, ref: "Member" },
        status: { type: String, enum: ["Join", "First Transaction"] }
    }]

}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }, { strict: false });



MemberCodeSchema.index({ member: 1, referPolicy: 1 }, { unique: true })


module.exports = mongoose.model('MemberCode', MemberCodeSchema);