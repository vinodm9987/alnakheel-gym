const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MemberBmiSchema = new Schema({

    memberId: {
        type: Schema.Types.ObjectId,
        ref: "Member"
    },

    date: {
        type: Date
    },

    weight: {
        type: Number
    }

}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }, { strict: false });


module.exports = mongoose.model('MemberBmi', MemberBmiSchema);