const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const workoutLevel = new Schema({

    workout: [{
        type: Schema.Types.ObjectId,
        ref: 'Workouts'
    }],

    levelName: {
        type: String,
        unique: true
    },

    status: {
        type: Boolean,
        default: true
    }

}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }, { strict: false });


module.exports = mongoose.model('WorkoutLevel', workoutLevel);