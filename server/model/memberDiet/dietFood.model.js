const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dietFoodSchema = new Schema({

    itemName: {
        type: String,
        unique: true
    },

    measurement: {
        type: String,
        enum: ["Qty", "Grams"]
    },

    measurementValue: {
        type: Number
    },

    calories: {
        type: Number
    },

    image: {
        type: Object
    },

    status: {
        type: Boolean,
        default: true
    }

}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }, { strict: false });


module.exports = mongoose.model('DietFood', dietFoodSchema);