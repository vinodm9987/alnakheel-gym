const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MemberFreezeSchema = new Schema({

    memberId: { type: Schema.Types.ObjectId, ref: "Member" },

    fromDate: Date, toDate: Date, noOfDays: Number,

    status: { type: String, enum: ["Pending", "Completed"], default: "Pending" },

    reactivationDate: Date, reason: String,

    totalAmount: Number, actualAmount: Number, cashAmount: Number, cardAmount: Number,

    cardNumber: String, vatAmount: Number,

    typeOfFreeze: { type: String, enum: ['Froze', 'Canceled', "Both"], default: 'Froze' },


}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }, { strict: false });


module.exports = mongoose.model('MemberFreeze', MemberFreezeSchema);