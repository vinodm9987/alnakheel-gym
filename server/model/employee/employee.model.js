const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const { config: { DB } } = require('../../../config')
const connection = mongoose.createConnection(DB);
autoIncrement.initialize(connection);
const Schema = mongoose.Schema;


const employeeSchema = new Schema({

    designation: {
        type: Schema.Types.ObjectId,
        ref: 'Designation'
    },

    mobileNo: {
        type: String,
    },

    employeeType: {
        type: String,
        enum: ["Full Time", "Part Time"]
    },


    rating: [{

        member: {
            type: Schema.Types.ObjectId,
            ref: "Member"
        },
        star: {
            type: Number,
        }

    }],

    ratingAvg: {
        type: Number,
        default: 0
    },

    personalId: {
        type: String
    },

    branch: [{
        type: Schema.Types.ObjectId,
        ref: 'Branch'
    }],

    gender: {
        type: String,
        enum: ['Male', 'Female', "Others"]
    },

    address: {
        type: String,
        trim: true,
    },

    nationality: {
        type: String,
        trim: true,
    },

    dateOfBirth: {
        type: Date,
    },

    joiningDate: {
        type: Date,
    },

    visaDetails: {
        visaNumber: String,
        issueDate: Date,
        expiryDate: Date,
        passportNo: String
    },

    credentialId: {
        type: Schema.Types.ObjectId,
        ref: "Credential"
    },

    status: {
        type: Boolean,
        default: true
    },

    employeeId: {
        type: Number
    }

}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }, { strict: false });


employeeSchema.plugin(autoIncrement.plugin, { model: 'Employee', field: 'employeeId', startAt: 1, incrementBy: 1 });


module.exports = mongoose.model('Employee', employeeSchema);