const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stockSellSchema = new Schema({

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

    customerDetails: {

        typeOfCustomer: {
            type: String,
            enum: ["General", "Member"]
        },

        member: {
            type: Schema.Types.ObjectId,
            ref: "Member"
        }

    },

    branch: {
        type: Schema.Types.ObjectId,
        ref: "Branch"
    },

    paymentType: {
        type: String,
        enum: ["Online", "POS"]
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

    totalAmount: {
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

    orderNo: {
        type: String,
    },

    chequeAmount: Number,
    chequeNumber: String,
    bankName: String,
    chequeDate: Date,

    doneBy: { type: Schema.Types.ObjectId, ref: "Credential" }

}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }, { strict: false });


module.exports = mongoose.model('StockSells', stockSellSchema);