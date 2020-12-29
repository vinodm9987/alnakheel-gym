const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({

    eventTitle: String,

    startDate: Date,

    endDate: Date,

}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }, { strict: false });


module.exports = mongoose.model('Event', EventSchema);