const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const branchPasswordSchema = new Schema({

    salt: String,

    hash: String

}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }, { strict: false });

module.exports = mongoose.model('BranchPassword', branchPasswordSchema);
