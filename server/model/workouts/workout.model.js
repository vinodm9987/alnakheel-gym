const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const workoutSchema = new Schema({

    workoutName: {
        type: String,
        unique: true
    },

    instructions: {
        type: String
    },

    workoutsImages: {
        type: Object
    },

    workoutsVideo: {
        type: Object
    },

    workoutCategories: {
        type: String,
        enum: ["Cardio", "Workouts"]
    },

    status: {
        type: Boolean,
        default: true
    }

}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }, { strict: false });


module.exports = mongoose.model('Workouts', workoutSchema);