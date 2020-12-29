const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const memberPurchaseSchema = new Schema({

    dateOfCart: {
        type: Date
    },


    stockId: {
        type: Schema.Types.ObjectId,
        ref: 'Stocks'
    },

    member: {
        type: Schema.Types.ObjectId,
        ref: 'Member'
    },

    addedQuantity: {
        type: Number
    }

}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }, { strict: false });


module.exports = mongoose.model('MemberCart', memberPurchaseSchema);