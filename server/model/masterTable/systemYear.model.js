const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const systemYearSchema = new Schema({

  year: {
    type: Date
  }

}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }, { strict: false });


module.exports = mongoose.model('SystemYear', systemYearSchema);