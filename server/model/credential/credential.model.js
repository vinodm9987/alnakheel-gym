const { config: { SECRET } } = require('../../../config');
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const credentialSchema = new Schema({

    userName: {
        type: String,
        trim: true,
        index: true,
        required: [true, "User name is required !"],
    },

    email: {
        type: String,
        trim: true,
        index: true,
        lowercase: true,
        required: [true, "Email is required !"],
        unique: [true, "Email address is already exist !"]
    },


    designation: {
        type: Schema.Types.ObjectId,
        ref: 'Designation'
    },

    designationName: {
        type: String
    },

    userId: {
        type: Schema.Types.ObjectId,
        refPath: "designationName"
    },

    hash: String,

    salt: String,

    avatar: Object,

    reactToken: String,

    doneFingerAuth: {
        type: Boolean,
        default: false
    },

    notification: {
        type: Boolean,
        default: true
    },

    webModule: [{
        type: Schema.Types.ObjectId,
        ref: "WebPrivilege"
    }],

    mobileModule: [{
        type: Schema.Types.ObjectId,
        ref: "MobilePrivilege"
    }]

}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }, { strict: false });



credentialSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`);
};

credentialSchema.methods.validPassword = function (password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, `sha512`).toString(`hex`);
    return this.hash === hash;
};

credentialSchema.methods.generateToken = function () {
    let token = jwt.sign({
        email: this.email,
        doneFingerAuth: this.doneFingerAuth,
        designation: this.designation,
        userId: this.userId ? this.userId : '',
        package: this.package ? this.package : "",
        credential: this._id.toString(),
        userName: this.userName,
        avatarPath: this.avatar ? this.avatar.path : ""
    },
        SECRET,
        { expiresIn: 60 * 60 * 24 });
    return token
};


credentialSchema.methods.decode = function (token) {
    let data = jwt.decode(token);
    return data
};

module.exports = mongoose.model('Credential', credentialSchema);