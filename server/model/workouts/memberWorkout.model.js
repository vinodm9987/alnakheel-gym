const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const memberWorkoutSchema = new Schema({

    member: {
        type: Schema.Types.ObjectId,
        ref: "Member"
    },

    workoutCategories: {
        type: String,
        enum: ["Cardio", "Workouts"]
    },

    workoutsLevel: {
        type: Schema.Types.ObjectId,
        ref: "WorkoutLevel"
    },

    dateOfWorkout: {
        type: Date
    },

    workouts: [{

        workout: {
            type: Schema.Types.ObjectId,
            ref: 'Workouts'
        },

        sets: {
            type: Number
        },

        reps: {
            type: Number
        },

        weight: {
            type: Number
        },

        distance: {
            type: Number
        },

        time: {
            type: String
        }

    }],

    note: {
        type: String
    }


}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }, { strict: false });


module.exports = mongoose.model('MemberWorkout', memberWorkoutSchema);