const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const { config: { DB } } = require('../../../config')
const connection = mongoose.createConnection(DB);
autoIncrement.initialize(connection);
const Schema = mongoose.Schema;

const AssetsSchema = new Schema({

    assetsCode: {
        type: Number,
        unique: true,
    },

    assetName: String,

    brandName: String,

    modelNumber: String,

    serialNumber: {
        type: String,
        unique: true,
    },

    dateOfPurchase: Date,

    warranty: Number,

    originalValue: Number,

    description: String,

    assetImage: Object,

    vat: {
        type: Schema.Types.ObjectId,
        ref: "Vat"
    },

    supplierName: {
        type: Schema.Types.ObjectId,
        ref: "Supplier"
    },

    assetBranch: {
        type: Schema.Types.ObjectId,
        ref: "Branch"
    },

    isContracted: {
        type: Boolean,
        default: false
    },

    contractor: [{

        current: Boolean,

        contractId: {
            type: Schema.Types.ObjectId,
            ref: "Contract"
        }
    }],

    repairLog: [{

        technicianName: String,

        mobileNo: String,

        amount: String,

        contractRepair: Boolean,

        maintainStatus: {
            type: String,
            enum: ["Pending", "Completed", "Under Repair"],
            default: "Pending"
        },

        comments: String,

        repairDateTime: Date
    }],

    status: {
        type: Boolean,
        default: true
    }

}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }, { strict: false });

AssetsSchema.plugin(autoIncrement.plugin, { model: 'Assets', field: 'assetsCode', startAt: 1, incrementBy: 1 });

module.exports = mongoose.model('Assets', AssetsSchema);