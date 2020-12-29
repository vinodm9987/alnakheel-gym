const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminPasswordSchema = new Schema({

  password: {
    type: String,
    trim: true,
  }

}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }, { strict: false });

module.exports = mongoose.model('AdminPassword', adminPasswordSchema);