const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const workoutAttendanceSchema = new Schema({

    workout: [{
        type: Schema.Types.ObjectId,
        ref: 'Workouts'
    }],

    memberId: {
        type: Schema.Types.ObjectId,
        ref: 'Member'
    },

    date: {
        type: Date
    }

}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }, { strict: false });


module.exports = mongoose.model('WorkoutAttendance', workoutAttendanceSchema);