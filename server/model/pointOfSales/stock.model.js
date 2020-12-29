const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const { config: { DB } } = require('../../../config')
const connection = mongoose.createConnection(DB);
autoIncrement.initialize(connection);
const Schema = mongoose.Schema;

const stockSchema = new Schema({

    itemName: {
        type: String,
    },

    itemCode: {
        type: Number,
    },

    purchaseDate: {
        type: Date,
    },

    quantity: {
        type: Number,
    },

    originalQuantity: {
        type: Number
    },

    costPerUnit: {
        type: Number,
    },

    sellingPrice: {
        type: Number,
    },

    supplierName: {
        type: Schema.Types.ObjectId,
        ref: "Supplier"
    },

    expiryDate: {
        type: Date,
    },

    branch: {
        type: Schema.Types.ObjectId,
        ref: "Branch"
    },

    vat: {
        type: Schema.Types.ObjectId,
        ref: "Vat"
    },

    image: {
        type: Object,
    },

    description: {
        type: String,
    },

    status: {
        type: Boolean,
        default: true
    },

    noOfTimeSell: {
        type: Number,
        default: 0
    },

    offerDetails: {

        isOffer: {
            type: Boolean,
            default: false
        },

        offerDetails: {
            type: Schema.Types.ObjectId,
            ref: 'OfferStock'
        }
    }

}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }, { strict: false });

stockSchema.index({ 'itemName': 1, 'branch': 1 }, { unique: true });

module.exports = mongoose.model('Stocks', stockSchema);