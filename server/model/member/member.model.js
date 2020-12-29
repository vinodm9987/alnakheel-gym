const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const memberSchema = new Schema({

    /** 
     * general information of member
    */

    memberId: Number, dateOfBirth: Date, nationality: String,

    mobileNo: { type: String, required: [true, 'Mobile no is required !'] },

    gender: { type: String, enum: ['Male', "Female", "Other"], required: [true, 'Gender no is required !'] },

    questions: { levelQuestion: String, exercisingQuestion: String, goalQuestion: String },

    walletPoints: { type: Number, default: 0 },

    branch: { type: Schema.Types.ObjectId, ref: "Branch" },

    personalId: String, height: Number, startWeight: Number,

    weight: Number, goal: Number, admissionDate: Date, emergencyNumber: String,

    credentialId: { type: Schema.Types.ObjectId, ref: "Credential" },

    relationship: { type: String, trim: true },

    notes: { type: String },

    /** 
     * package information of member
    */

    isPackageSelected: { type: Boolean, default: true },

    packageDetails: [{

        /** 
         * packages fields
        */

        startDate: Date, endDate: Date, extendDate: Date, isFreeze: Boolean,

        packages: { type: Schema.Types.ObjectId, ref: "Package" },

        isExpiredPackage: { type: Boolean, default: false },

        packageRenewal: { type: Boolean, default: false },

        paidStatus: { type: String, enum: ["Paid", "UnPaid"], default: "UnPaid" },

        paidType: { type: String, enum: ["Online", "Offline"] },

        cardNumber: String, cashAmount: Number, cardAmount: Number, vatAmount: Number, discount: Number,

        digitalAmount: Number,

        totalAmount: Number, actualAmount: Number, paypalObject: Object, freezeDate: Date, reactivationDate: Date,

        /** 
         * trainer fields
        */

        trainerFees: { type: Schema.Types.ObjectId, ref: "TrainerFees" },

        trainer: { type: Schema.Types.ObjectId, ref: "Employee" },

        isExpiredTrainer: { type: Boolean, default: false },

        trainerStart: Date, trainerEnd: Date, trainerExtend: Date,

        orderNo: String,

        doneBy: { type: Schema.Types.ObjectId, ref: "Credential" },

        dateOfPurchase: Date,

        timeOfPurchase: Date,

    }],

    /** 
     * biometric information of member
    */

    doneFingerAuth: { type: Boolean, default: false },

    biometricTemplate: { template0: String, template1: String, fingerIndex: Number },

    status: { type: Boolean, default: true }




}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }, { strict: false });


module.exports = mongoose.model('Member', memberSchema);