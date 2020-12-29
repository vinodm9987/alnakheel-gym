const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WaterInTakeSchema = new Schema({

    memberId: {
        type: Schema.Types.ObjectId,
        ref: "Member"
    },

    target: {
        type: Number
    },

    date: {
        type: Date
    },

    consume: {
        type: Number
    },

    record: [{
        date: Date,
        consume: Number
    }]

}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }, { strict: false });


module.exports = mongoose.model('WaterInTake', WaterInTakeSchema);