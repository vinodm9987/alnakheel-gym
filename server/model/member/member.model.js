const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const memberSchema = new Schema({

    /** 
     * general information of member
     */

    memberId: Number,

    dateOfBirth: Date,

    nationality: String,

    mobileNo: { type: String, required: [true, 'Mobile no is required !'] },

    gender: { type: String, enum: ['Male', "Female", "Other"], required: [true, 'Gender no is required !'] },

    questions: { levelQuestion: String, exercisingQuestion: String, goalQuestion: String },

    walletPoints: { type: Number, default: 0 },

    personalId: String,
    height: Number,
    startWeight: Number,

    weight: Number,
    goal: Number,
    admissionDate: Date,
    emergencyNumber: String,

    credentialId: { type: Schema.Types.ObjectId, ref: "Credential" },

    relationship: { type: String, trim: true },

    notes: { type: String },

    branch: { type: Schema.Types.ObjectId, ref: "Branch" },


    /** 
     * package information of member
     */

    isPackageSelected: { type: Boolean, default: true },

    packageDetails: [{

        /** 
         * packages fields
         */

        startDate: Date,
        endDate: Date,
        extendDate: Date,
        isFreeze: Boolean,

        packages: { type: Schema.Types.ObjectId, ref: "Package" },

        isExpiredPackage: { type: Boolean, default: false },

        packageRenewal: { type: Boolean, default: false },

        paidStatus: { type: String, enum: ["Paid", "UnPaid", "Installment"], default: "UnPaid" },

        paidType: { type: String, enum: ["Online", "Offline"] },
        dateOfPaid: Date,
        timeOfPaid: Date,

        cardNumber: String,
        cashAmount: Number,
        cardAmount: Number,
        vatAmount: Number,
        discount: Number,

        digitalAmount: Number,
        chequeAmount: Number,
        chequeNumber: String,
        bankName: String,
        chequeDate: Date,

        totalAmount: Number,
        actualAmount: Number,
        paypalObject: Object,
        freezeDate: Date,
        reactivationDate: Date,

        orderNo: String,
        doneBy: { type: Schema.Types.ObjectId, ref: "Credential" },

        Installments: [{

            installmentName: String,

            paidStatus: { type: String, enum: ["Paid", "UnPaid"], default: "UnPaid" },

            dueDate: Date,
            dateOfPaid: Date,
            timeOfPaid: Date,

            paidType: { type: String, enum: ["Online", "Offline"] },

            cardNumber: String,
            cashAmount: Number,

            cardAmount: Number,
            vatAmount: Number,
            discount: Number,

            digitalAmount: Number,
            chequeAmount: Number,

            chequeNumber: String,
            bankName: String,
            chequeDate: Date,

            totalAmount: Number,
            actualAmount: Number,
            orderNo: String,
            doneBy: { type: Schema.Types.ObjectId, ref: "Credential" },

        }],

        /** 
         * trainer fields
         */

        trainerDetails: [{

            trainerFees: { type: Schema.Types.ObjectId, ref: "TrainerFees" },

            trainer: { type: Schema.Types.ObjectId, ref: "Employee" },

            isExpiredTrainer: { type: Boolean, default: false },

            paidStatus: { type: String, enum: ["Paid", "UnPaid", "Installment"], default: "UnPaid" },

            trainerStart: Date,
            trainerEnd: Date,
            trainerExtend: Date,

            orderNo: String,
            doneBy: { type: Schema.Types.ObjectId, ref: "Credential" },

            paidType: { type: String, enum: ["Online", "Offline"] },
            dateOfPaid: Date,

            cardNumber: String,
            cashAmount: Number,
            cardAmount: Number,
            vatAmount: Number,
            discount: Number,

            digitalAmount: Number,
            chequeAmount: Number,
            chequeNumber: String,
            bankName: String,
            chequeDate: Date,

            totalAmount: Number,
            actualAmount: Number,

            Installments: [{

                installmentName: String,

                paidStatus: { type: String, enum: ["Paid", "UnPaid"], default: "UnPaid" },

                dueDate: Date,
                dateOfPaid: Date,
                timeOfPaid: Date,

                paidType: { type: String, enum: ["Online", "Offline"] },

                cardNumber: String,
                cashAmount: Number,
                cardAmount: Number,
                vatAmount: Number,
                discount: Number,

                digitalAmount: Number,
                chequeAmount: Number,
                chequeNumber: String,
                bankName: String,
                chequeDate: Date,

                totalAmount: Number,
                actualAmount: Number,
                orderNo: String,
                doneBy: { type: Schema.Types.ObjectId, ref: "Credential" },

            }],

        }],

    }],

    /** 
     * biometric information of member
     */

    doneFingerAuth: { type: Boolean, default: false },

    faceRecognitionTemplate: {
        type: Object
    },

    status: { type: Boolean, default: true }




}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }, { strict: false });


module.exports = mongoose.model('Member', memberSchema);