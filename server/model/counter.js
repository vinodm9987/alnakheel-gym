const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const counterSchema = new Schema({

    memberCounter: {
        type: Number
    }

}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }, { strict: false });

module.exports = mongoose.model('Counter', counterSchema);
