const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmployeeShiftSchema = new Schema({

    employee: {
        type: Schema.Types.ObjectId,
        ref: "Employee"
    },

    shift: {
        type: Schema.Types.ObjectId,
        ref: "Shift"
    },

    branch: {
        type: Schema.Types.ObjectId,
        ref: "Branch"
    },

    fromDate: {
        type: Date
    },

    toDate: {
        type: Date
    }

}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }, { strict: false });


module.exports = mongoose.model('EmployeeShift', EmployeeShiftSchema);