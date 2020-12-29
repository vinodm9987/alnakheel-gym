const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ClassesSchema = new Schema({

  className: {
    type: String,
    unique: true,
    required: true
  },

  branch: {
    type: Schema.Types.ObjectId,
    ref: "Branch"
  },

  trainer: {
    type: Schema.Types.ObjectId,
    ref: "Employee",
    required: true
  },

  amount: {
    type: Number,
    required: true,
  },

  room: {
    type: Schema.Types.ObjectId,
    ref: "Room",
    required: true
  },

  capacity: {
    type: Number,
    min: 1,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  occupied: {
    type: Number
  },

  image: {
    type: Object
  },

  color: {
    type: String
  },

  startDate: {
    type: Date,
    required: true
  },

  startTime: {
    type: Date,
    required: true
  },

  endDate: {
    type: Date,
    required: true
  },

  endTime: {
    type: Date,
    required: true
  },

  classDays: [{
    type: Date
  }],

  vat: {
    type: Schema.Types.ObjectId,
    ref: "Vat"
  },

  members: [{
    type: Schema.Types.ObjectId,
    ref: "MemberClasses"
  }],

  bioStarInfo: {
    scheduleId: String,
    accessLevelId: String,
    accessGroupId: String,
    accessGroupName: String,
    userGroupId: String,
  }

}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }, { strict: false });


module.exports = mongoose.model('Classes', ClassesSchema);
