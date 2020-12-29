const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const memberDietSchema = new Schema({

    member: {
        type: Schema.Types.ObjectId,
        ref: "Member"
    },

    dateOfDiet: {
        type: Date
    },

    dietPlanSession: {
        type: Schema.Types.ObjectId,
        ref: 'DietSession'
    },

    dietPlan: [{

        foodItem: {
            type: Schema.Types.ObjectId,
            ref: 'DietFood'
        },

        measureValue: {
            type: Number
        },

        calories: {
            type: Number
        },

        specifications: {
            type: String
        }

    }]

}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }, { strict: false });


module.exports = mongoose.model('MemberDiets', memberDietSchema);