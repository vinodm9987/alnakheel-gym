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
    }

}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }, { strict: false });


module.exports = mongoose.model('MemberPurchase', memberPurchaseSchema);