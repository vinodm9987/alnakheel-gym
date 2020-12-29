const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const MemberTransactionSchema = new Schema({

    date: Date, point: Number, balancePoint: Number,

    pointType: { type: String, enum: ["-", "+"] },

    member: { type: Schema.Types.ObjectId, ref: "Member" },

    rewardType: { type: String, enum: ['Earn', 'Redeem'] },

    redeemCode: { type: String },

    redeemStatus: { type: String, enum: ['Pending', 'Completed'] },

    branch: { type: Schema.Types.ObjectId, ref: "Branch" },

    giftCard: { type: Schema.Types.ObjectId, ref: "GiftCard" },

    policy: { type: Schema.Types.ObjectId, ref: "RewardPolicy" },

    isOld: { type: Boolean, default: true }

}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }, { strict: false });



module.exports = mongoose.model('MemberTransaction', MemberTransactionSchema);