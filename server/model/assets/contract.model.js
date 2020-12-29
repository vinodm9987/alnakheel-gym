const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ContractSchema = new Schema({

    contractName: {
        type: String,
        unique: true,
    },

    poNumber: Number,

    contractStart: Date,

    contractEnd: Date,

    contractAmount: Number,

    document: Object,

    contractor: {
        type: Schema.Types.ObjectId,
        ref: "Supplier"
    },

    assets: [{
        type: Schema.Types.ObjectId,
        ref: "Assets"
    }]

}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }, { strict: false });


module.exports = mongoose.model('Contract', ContractSchema);