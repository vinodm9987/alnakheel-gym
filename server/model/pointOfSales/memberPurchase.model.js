const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const memberPurchaseSchema = new Schema({

    dateOfPurchase: {
        type: Date
    },

    timeOfPurchase: {
        type: Date
    },

    purchaseStock: [{

        stockId: {
            type: Schema.Types.ObjectId,
            ref: 'Stocks'
        },

        quantity: {
            type: Number,
        },

        amount: {
            type: Number,
        },

    }],

    totalAmount: {
        type: Number,
    },

    paypalObject: {
        type: Object
    },

    paymentType: {
        type: String,
        enum: ["Online", "POS"]
    },

    branch: {
        type: Schema.Types.ObjectId,
        ref: "Branch"
    },

    discount: {
        type: Number,
    },

    giftcard: {
        type: Number,
    },

    vatAmount: {
        type: Number,
    },

    actualAmount: {
        type: Number,
    },

    cashAmount: {
        type: Number,
        default: 0,
    },

    cardAmount: {
        type: Number,
        default: 0,
    },

    digitalAmount: {
        type: Number,
        default: 0,
    },

}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }, { strict: false });


module.exports = mongoose.model('MemberPurchase', memberPurchaseSchema);