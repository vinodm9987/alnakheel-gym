const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VatSchema = new Schema({

    vatName: {
        type: String,
    },

    branch: {
        type: Schema.Types.ObjectId,
        ref: 'Branch'
    },

    taxPercent: {
        type: Number,
    },

    defaultVat: {
        type: Boolean,
        default: false
    },

    status: {
        type: Boolean,
        default: true
    }

}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }, { strict: false });

VatSchema.index({ 'vatName': 1, 'taxPercent': 1, 'branch': 1 }, { unique: true });

module.exports = mongoose.model('Vat', VatSchema);