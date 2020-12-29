const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessagingSchema = new Schema({

  messageCategory: { type: String, enum: ['SMS', 'Email'] },

  memberCategory: { type: String, enum: [ 'All', 'Pending Members', 'Active Members', 'Expired Member', 'New Members'] },

  members: [{ type: Schema.Types.ObjectId, ref: "Member" }],

  message: String, subject: String, emailMessage: String,

  date: Date, time: Date, status: { type: String, enum: ['Success', 'Failed'] }

}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }, { strict: false });


module.exports = mongoose.model('Messaging', MessagingSchema);
