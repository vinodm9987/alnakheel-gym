const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const { config: { DB } } = require('../../../config')
const connection = mongoose.createConnection(DB);
autoIncrement.initialize(connection);
const Schema = mongoose.Schema;


const SupplierSchema = new Schema({

    supplierName: {
        type: String,
        unique: true,
    },

    supplierCode: Number,

    mobileNumber: String,

    phoneNumber: Number,

    country: String,

    address: String,

    email: String,

    bankName: String,

    accountNumber: Number,

    ibanCode: String,

    swiftCode: String,

    currency: String,

    status: {
        type: Boolean,
        default: true
    }

}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }, { strict: false });

SupplierSchema.plugin(autoIncrement.plugin, { model: 'Supplier', field: 'supplierCode', startAt: 1, incrementBy: 1 });

module.exports = mongoose.model('Supplier', SupplierSchema);