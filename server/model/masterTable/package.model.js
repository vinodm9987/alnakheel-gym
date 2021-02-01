const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const packageSchema = new Schema({

    packageName: {
        type: String,
        unique: true,
        required: [true, "Package name is required !"]
    },

    amount: {
        type: Number,
        required: [true, "Amount is required !"]
    },

    period: {
        type: Schema.Types.ObjectId,
        ref: "Period"
    },

    description: {
        type: String
    },

    color: {
        type: String
    },

    image: {
        type: Object
    },

    startDate: {
        type: Date,
        required: [true, 'Start date is required !']
    },

    endDate: {
        type: Date,
        required: [true, 'End date is required !']
    },

    fromTime: {
        type: Date,
        required: [true, 'From time is required !']
    },

    toTime: {
        type: Date,
        required: [true, 'To time is required !']
    },

    bioStarInfo: {
        scheduleId: String,
        accessLevelId: String,
        accessGroupId: String,
        accessGroupName: String,
        userGroupId: String,
    }

}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }, { strict: false });


module.exports = mongoose.model('Package', packageSchema);