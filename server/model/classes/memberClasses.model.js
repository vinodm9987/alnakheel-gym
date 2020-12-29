const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MemberClassesSchema = new Schema({

    member: {
        type: Schema.Types.ObjectId,
        ref: "Member"
    },

    dateOfPurchase: {
        type: Date
    },

    paymentStatus: {
        type: String,
        enum: ["Paid", "Un Paid"],
        default: "Un Paid"
    },

    mode: {
        type: String,
        enum: ["Online", "Pay at Gym"]
    },

    totalAmount: {
        type: Number
    },

    cashAmount: {
        type: Number
    },

    cardAmount: {
        type: Number
    },

    digitalAmount: {
        type: Number
    },

    amount: {
        type: Number
    },

    cardNumber: {
        type: Number
    },

    vatAmount: Number,

    classId: {
        type: Schema.Types.ObjectId,
        ref: "Classes"
    },

    classStartDate: Date,

    orderNo: String,

    doneBy: { type: Schema.Types.ObjectId, ref: "Credential" }

}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }, { strict: false });

MemberClassesSchema.index({ 'classId': 1, 'member': 1 }, { unique: true });

module.exports = mongoose.model('MemberClasses', MemberClassesSchema);