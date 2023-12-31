const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MemberFreezeSchema = new Schema({

    memberId: { type: Schema.Types.ObjectId, ref: "Member" },

    fromDate: Date, toDate: Date, noOfDays: Number,

    reactivationDate: Date, reason: String,

    totalAmount: Number, actualAmount: Number, cashAmount: Number, cardAmount: Number,

    cardNumber: String, vatAmount: Number, returningDate: Date,

    status: { type: Boolean, default: true },

    typeOfFreeze: { type: String, enum: ['Pending', 'Froze', 'Canceled'], default: 'Pending' },

    orderNo: String,

    doneBy: { type: Schema.Types.ObjectId, ref: "Credential" },

}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }, { strict: false });


module.exports = mongoose.model('MemberFreeze', MemberFreezeSchema);