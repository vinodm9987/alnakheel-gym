/**  
 * utils.
*/

const crypto = require('crypto')
const { logger: { logger }, upload: { uploadAvatar }, handler: { successResponseHandler, errorResponseHandler }, config: { DESIGNATION } } = require('../../../config')
const { Mailer: { sendMailForPassword } } = require('../../utils')

/**  
 * models.
*/


const { Credential, Designation, Employee, Member } = require('../../model');
const { auditLogger } = require('../../middleware/auditlog.middleware');




/**
 * get all users
*/


exports.getAllUser = (req, res) => {
    Credential.find()
        .populate('userId designation')
        .then(response => {
            successResponseHandler(res, response, "successfully get all user !!");
        }).catch(error => {
            logger.error(error);
            errorResponseHandler(res, error, "Exception while getting all user !");
        });
};


/**
 * get all users by Designation and Search on User Privileges
*/


exports.getAllUserFilterByDesignationAndSearch = async (req, res) => {
    try {
        let queryCond = {}
        let designation = await Designation.find({ designationName: { $nin: DESIGNATION.slice(0, 2) } })
        let designationId = designation.map((doc => { return doc._id }))
        if (req.body.designation) {
            queryCond["designation"] = req.body.designation
        } else {
            queryCond["designation"] = designationId
        }
        let response = await Credential.find(queryCond).populate('userId designation webModule mobileModule report').lean()
        if (req.body.search) {
            let search = req.body.search.toLowerCase()
            response = response.filter(doc => {
                if (doc.userName.toLowerCase().includes(search)) {
                    return doc
                }
            })
            return successResponseHandler(res, { response, designation }, "successfully get all Users !!");
        } else {
            return successResponseHandler(res, { response, designation }, "successfully get all Users !!");
        }
    } catch (error) {
        logger.error(error);
        errorResponseHandler(res, error, "Exception while getting all Users !");
    }
};


/**
 * get user by Id
*/


exports.getUserById = (req, res) => {
    Credential.findById(req.params.id)
        .populate('userId designation webModule report')
        .populate({ path: 'userId', populate: { path: 'packageDetails.trainer', populate: { path: "credentialId" } } })
        .populate({ path: 'userId', populate: { path: 'branch' } })
        .then(response => {
            successResponseHandler(res, response, "successfully get user !!");
        }).catch(error => {
            logger.error(error);
            errorResponseHandler(res, error, "Exception while getting user !");
        });
};




/**
 * get all admin
*/


exports.getAllAdmin = async (req, res) => {
    try {
        let adminDesignation = await Designation.findOne({ designationName: DESIGNATION[1] })
        let response = await Credential.find({ designation: adminDesignation._id.toString() }).populate('userId designation');
        return successResponseHandler(res, response, "successfully get all user !!");
    } catch (error) {
        logger.error(error);
        errorResponseHandler(res, error, "Exception while getting all user !");
    }
};






/**
 *  create new admin user 
*/

exports.createAdmin = (req, res) => {
    uploadAvatar(req, res, async (err, result) => {
        if (err) return errorResponseHandler(res, err, "while uploading profile error occurred !");
        let adminDesignation = await Designation.findOne({ designationName: DESIGNATION[1] })
        let data = JSON.parse(req.body.data)
        let newUser = new Credential(data);
        newUser["avatar"] = req.files[0]
        newUser["designation"] = adminDesignation._id
        newUser.setPassword(data.password);
        newUser.save().then((response) => {
            return successResponseHandler(res, response, "successfully added new admin !!");
        }).catch(error => {
            logger.error(error);
            if (error.message.indexOf('duplicate key error') !== -1)
                return errorResponseHandler(res, error, "Email is already exist !");
            if (error.errors['userName'])
                return errorResponseHandler(res, error, error.errors['userName'].message);
            if (error.errors['email'])
                return errorResponseHandler(res, error, error.errors['email'].message);
            else
                return errorResponseHandler(res, error, "Exception occurred !");
        });
    });
};







/**
 *  create new admin user 
*/

exports.updateSystemAdmin = (req, res) => {
    let password;
    uploadAvatar(req, res, async (error, result) => {
        if (error) return errorResponseHandler(res, error, "while uploading profile error occurred !");
        let data = JSON.parse(req.body.data)
        if (req.files.length !== 0) data["avatar"] = req.files[0]
        if (data.password) password = data.password
        Credential.findByIdAndUpdate(req.params.id, data, { new: true }).then(async (response) => {
            if (password) {
                const salt = crypto.randomBytes(16).toString('hex');
                const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);
                await Credential.findByIdAndUpdate(response.id, { hash, salt })
            }
            return successResponseHandler(res, response, "successfully updated new admin !!");
        }).catch(error => {
            logger.error(error);
            if (error.message.indexOf('duplicate key error') !== -1)
                return errorResponseHandler(res, error, "Email is already exist !");
            if (error.errors['userName'])
                return errorResponseHandler(res, error, error.errors['userName'].message);
            if (error.errors['email'])
                return errorResponseHandler(res, error, error.errors['email'].message);
            else
                return errorResponseHandler(res, error, "Exception occurred !");
        });
    });
};







/**
 *  login for user 
*/

exports.login = async (req, res) => {
    Credential.findOne({ email: req.body.email.toLowerCase() }).then(async user => {
        if (!user) return errorResponseHandler(res, '', "Email does not exist !");
        const emp = await Employee.findById(user.userId);
        const member = await Member.findById(user.userId)
        if (!user.validPassword(req.body.password)) {
            auditLogger(req, 'Failed')
            return errorResponseHandler(res, '', "Your entered password is wrong !")
        }
        else if ((emp && !emp.status) || (member && !member.status)) {
            auditLogger(req, 'Failed')
            return errorResponseHandler(res, '', 'You are disable kindly contact to gym for more info !')
        }
        else {
            auditLogger(req, 'Success')
            return successResponseHandler(res, user.generateToken(), "successfully login !")
        }
    }).catch(error => {
        auditLogger(req, 'Failed')
        logger.error(error);
        return errorResponseHandler(res, error, "failed to login !");
    });
};

exports.logout = async (req, res) => {
    if (req.headers.userid) {
        const isExist = await Credential.findByIdy(req.headers.userid).lean();
        if (isExist) { auditLogger(req, 'Success') }
        else
            return successResponseHandler(res, '', "successfully logout !")
    } else {
        return successResponseHandler(res, '', "successfully logout !")

    }

}







/**
 *  forget password for members
*/


exports.forgotPassword = (req, res) => {
    Credential.findOne({ email: req.body.email.toLowerCase() }).then(async user => {
        if (user) {
            const password = Math.random().toString(36).slice(-8);
            const salt = crypto.randomBytes(16).toString('hex');
            const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);
            await Credential.findByIdAndUpdate(user.id, { hash, salt })
            await sendMailForPassword(req.body.email, password, user.userName);
            return successResponseHandler(res, '', "your password has been send to registered email");
        } else {
            return errorResponseHandler(res, 'error', "This email is not exist !");
        }
    }).catch(error => {
        logger.error(error);
        return errorResponseHandler(res, error, "Exception occurred !");
    });
};


exports.changePassword = (req, res) => {
    const { newPassword, oldPassword, confirmPassword } = req.body;
    if (newPassword !== confirmPassword)
        return errorResponseHandler(res, 'error', "password does not match !");
    Credential.findById(req.body.id).then(async user => {
        if (!user.validPassword(oldPassword))
            return errorResponseHandler(res, '', "Enter old password is wrong !");
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = crypto.pbkdf2Sync(newPassword, salt, 1000, 64, `sha512`).toString(`hex`);
        const response = await Credential.findByIdAndUpdate(user.id, { hash, salt });
        return successResponseHandler(res, response, "you password has been changed !");
    })
}


exports.addReactToken = (req, res) => {
    Credential.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(response => {
            successResponseHandler(res, response, "successfully added token !!");
        }).catch(error => {
            logger.error(error);
            errorResponseHandler(res, error, "Exception while added token !");
        });
}



exports.resetPassword = async (req, res) => {
    try {
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = crypto.pbkdf2Sync(req.body.password, salt, 1000, 64, `sha512`).toString(`hex`);
        const response = await Credential.findByIdAndUpdate(req.params.id, { hash, salt })
        return successResponseHandler(res, response, "successfully reset password !");
    }
    catch (error) {
        logger.error(error);
        return errorResponseHandler(res, error, "Exception occurred !");
    }
}


exports.updateNotification = (req, res) => {
    Credential.findByIdAndUpdate(req.body.id, { notification: req.body.notification }, { new: true })
        .then(response => {
            successResponseHandler(res, response, "successfully remove token !!");
        }).catch(error => {
            logger.error(error);
            errorResponseHandler(res, error, "Exception while remove token !");
        });
};