const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const RewardPolicySchema = new Schema({

    policyName: String, description: String, amount: Number,

    noOfPoints: Number, startDate: Date, endDate: Date,

    memberDashBoard: { type: String, enum: ['Yes', 'No'] },

    policyCategory: { type: String, enum: ['Amount', 'Referral'] },

    status: { type: Boolean, default: true }

}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }, { strict: false });



module.exports = mongoose.model('RewardPolicy', RewardPolicySchema);