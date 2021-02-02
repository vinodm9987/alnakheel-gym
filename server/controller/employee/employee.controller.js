/**
 * utils.
*/


const { logger: { logger }, upload: { uploadAvatar }, handler: { successResponseHandler, errorResponseHandler }, config: { DESIGNATION } } = require('../../../config')
const { Mailer: { sendMail } } = require('../../utils')



/**
 * models.
*/

const { Employee, Credential, Designation, Member, AdminPassword, EmployeePackage } = require('../../model');
const { auditLogger } = require('../../middleware/auditlog.middleware');
const { employeeBioStarObject } = require('../../service/branch.service');
const { addMemberInBioStar, getFaceRecognitionTemplate, updateFaceRecognition } = require('../../biostar')







/**
 *
 * EMPLOYEES APIS
 *
 */


exports.updateEmployeeProfile = async (req, res) => {
    uploadAvatar(req, res, async (error, result) => {
        if (error) {
            auditLogger(req, 'Failed')
            return errorResponseHandler(res, error, "while uploading profile error occurred !");
        }
        if (req.files.length > 0) {
            await Credential.findByIdAndUpdate(req.params.id, { avatar: req.files[0] })
        }
        req.responseData = await Employee.findById({ credentialId: req.params.id }).populate('credentialId').lean()
        Employee.findOneAndUpdate({ credentialId: req.params.id }, JSON.parse(req.body.data))
            .then(response => {
                auditLogger(req, 'Success')
                successResponseHandler(res, response, "successfully updated employee !!");
            }).catch(error => {
                logger.default.error(error);
                auditLogger(req, 'Failed')
                errorResponseHandler(res, error, "Exception while updating employee !");
            });

    });
};







/**
 *  get all employee employee
*/



exports.getAllEmployee = (req, res) => {
    Employee.find({})
        .populate('credentialId')
        .then(response => {
            successResponseHandler(res, response, "successfully get all Employee !!");
        }).catch(error => {
            logger.default.error(error);
            errorResponseHandler(res, error, "Exception while getting all Employee !");
        });
};


/**
 *  get all employee by filter
*/



exports.getAllEmployeeByFilter = async (req, res) => {
    try {
        let queryCond = {}
        if (req.body.designation) { queryCond["designation"] = req.body.designation }
        let response = await Employee.find(queryCond).populate('credentialId').lean();
        let search = req.body.search.toLowerCase()
        if (search) {
            let newResponse = response.filter(doc => {
                let empId = doc.employeeId.toString()
                if (doc.credentialId.userName.toLowerCase().includes(search)
                    || doc.credentialId.email.toLowerCase().includes(search)
                    || empId.includes(search)) {
                    return doc
                }
            })
            return successResponseHandler(res, newResponse, "successfully get all Employee !!");
        } else {
            return successResponseHandler(res, response, "successfully get all Employee !!");
        }
    } catch (error) {
        logger.error(error);
        errorResponseHandler(res, error, "Exception while getting all Employee !");
    }
};


/**
 *  get all active employee employee
*/



exports.getAllActiveEmployee = (req, res) => {
    Employee.find({ status: true })
        .populate('credentialId branch')
        .then(response => {
            successResponseHandler(res, response, "successfully get all active Employee !!");
        }).catch(error => {
            logger.default.error(error);
            errorResponseHandler(res, error, "Exception while getting all active Employee !");
        });
};








/**
 * get  employee by id
*/


exports.getEmployeeById = (req, res) => {
    Employee.findById(req.params.id)
        .populate('credentialId branch designation')
        .then(response => {
            successResponseHandler(res, response, "successfully  employee  by id !!");
        }).catch(error => {
            logger.default.error(error);
            errorResponseHandler(res, error, "Exception while getting employee by id !");
        });
};






/**
 *  create new employee
*/

exports.createNewEmployee = (req, res) => {
    uploadAvatar(req, res, async (error, data) => {
        if (error)
            return errorResponseHandler(res, error, "while uploading profile error occurred !");
        try {
            const { userName, email, designation, doneFingerAuth } = JSON.parse(req.body.data);
            const employee = new Employee(JSON.parse(req.body.data));
            const credential = new Credential({ userName, email, designation, userId: employee._id, designationName: DESIGNATION[3], doneFingerAuth })
            const { raw_image, templates } = await getFaceRecognitionTemplate();
            const password = Math.random().toString(36).slice(-8);
            credential.setPassword(password);
            credential["avatar"] = req.files[0]
            const newResponse = await credential.save();
            employee["credentialId"] = newResponse._id;
            employee['faceRecognitionTemplate'] = { raw_image, templates };
            const employeeData = await employee.save();
            const bioStarInfo = await EmployeePackage.findOne({}).lean();
            const bioObject = employeeBioStarObject(bioStarInfo, employeeData, newResponse);
            await addMemberInBioStar(bioObject)
            await sendMail(email, password);
            await auditLogger(req, 'Success')
            return successResponseHandler(res, employeeData, "successfully added new employee !!");
        } catch (error) {
            logger.error(error);
            auditLogger(req, 'Failed')
            if (error.message.indexOf('duplicate key error') !== -1)
                return errorResponseHandler(res, error, "Email is already exist !");
            else
                return errorResponseHandler(res, error, "Exception occurred !");
        };
    });
};




exports.updateEmployeeFaceRecognition = async (req, res) => {
    try {
        await AdminPassword.findOne({ password: req.body.password }).then(async user => {
            if (!user) return errorResponseHandler(res, '', "Your entered password is wrong !");
            else {
                const { raw_image, templates } = await getFaceRecognitionTemplate();
                const userData = await Employee.findById(req.body.employeeId).lean()
                const bioObject = { raw_image, templates, memberId: 'e' + userData.employeeId }
                await updateFaceRecognition(bioObject);
                await Employee.findByIdAndUpdate(req.body.employeeId, { faceRecognitionTemplate: bioObject }, { new: true })
                const newResponse = await Employee.findById(req.body.employeeId).populate('credentialId branch designation').lean()
                successResponseHandler(res, newResponse, "successfully save the transaction !!");
            }
        });
    } catch (error) {
        logger.error(error);
        errorResponseHandler(res, error, "Exception while send code !");
    }
};



exports.updateEmployee = (req, res) => {
    uploadAvatar(req, res, async (error, data) => {
        if (error) {
            auditLogger(req, 'Failed')
            return errorResponseHandler(res, error, "while uploading profile error occurred !");
        }
        try {
            const { mobileNo, gender, dateOfBirth, joiningDate, userName, email, personalId, branch, designation, visaDetails, address, employeeType, employeeId, credentialId, nationality } = JSON.parse(req.body.data);
            let newObj = { mobileNo, gender, dateOfBirth, joiningDate, employeeType, personalId, branch, designation, address, visaDetails, nationality }
            req.responseData = await Employee.findById(employeeId).populate('credentialId').lean()
            if (userName || email || designation) {
                let obj = { userName, email, designation }
                if (req.files.length > 0) {
                    obj["avatar"] = req.files[0]
                }
                await Credential.findByIdAndUpdate(credentialId, obj)
            }
            const response = await Employee.findByIdAndUpdate(employeeId, newObj, { new: true });
            auditLogger(req, 'Success')
            return successResponseHandler(res, response, "successfully updated  employee !!");
        } catch (error) {
            logger.error(error);
            auditLogger(req, 'Failed')
            if (error.message.indexOf('duplicate key error') !== -1)
                return errorResponseHandler(res, error, "Email is already exist !");
            else
                return errorResponseHandler(res, error, "Exception occurred !");
        };
    });
};




/**
 *
 * TRAINER APIS
 *
 */





exports.getTrainerByBranch = async (req, res) => {
    let designation = await Designation.findOne({ designationName: DESIGNATION[4] }).lean()
    Employee.find({ branch: req.params.id, designation: designation._id, status: true }).populate('credentialId branch')
        .then(response => {
            successResponseHandler(res, response, "successfully get all  trainer by branch !!");
        }).catch(error => {
            logger.default.error(error);
            errorResponseHandler(res, error, "Exception while getting all  trainer by branch !");
        });
}


exports.getActiveTrainer = async (req, res) => {
    let designation = await Designation.findOne({ designationName: DESIGNATION[4] }).lean()
    Employee.find({ designation: designation._id, status: true }).populate('credentialId branch')
        .then(response => {
            successResponseHandler(res, response, "successfully get all active  trainer  !!");
        }).catch(error => {
            logger.default.error(error);
            errorResponseHandler(res, error, "Exception while getting all active  trainer  !");
        });
}



exports.updateStatusOfEmployee = async (req, res) => {
    req.responseData = await Employee.findById(req.params.id).lean()
    Employee.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true }).then(response => {
        auditLogger(req, 'Success')
        successResponseHandler(res, response, "successfully updated status of employee  !!");
    }).catch(error => {
        logger.default.error(error);
        auditLogger(req, 'Failed')
        errorResponseHandler(res, error, "Exception while updating status of employee !");
    });
}


exports.getAllMemberOfTrainer = async (req, res) => {
    try {
        let queryCond = { 'packageDetails.isExpiredPackage': false };
        queryCond['packageDetails.startDate'] = { '$exists': true }
        queryCond["doneFingerAuth"] = true;
        queryCond["status"] = true
        if (req.params.trainerId && req.params.trainerId !== 'undefined') {
            queryCond["packageDetails"] = { $elemMatch: { trainerDetails: { $elemMatch: { trainer: req.params.trainerId } } } }
        }
        let response = await Member.find(queryCond)
            .populate('credentialId')
            .populate('packageDetails.packages')
            .populate({ path: 'packageDetails.packages', populate: { path: 'period' } })
            .lean()
        let newResponse = response.filter(doc => {
            if (req.body.search) {
                let search = req.body.search.toLowerCase()
                let temp = doc.credentialId.email.toLowerCase()
                let temp1 = doc.credentialId.userName.toLowerCase()
                let temp2 = doc.memberId.toString()
                if (temp.includes(search) || temp1.includes(search) || temp2.includes(search)) return doc
            } else {
                return doc;
            }
        });
        successResponseHandler(res, newResponse, "successfully get all active  trainer  !!");
    }
    catch (error) {
        logger.error(error);
        errorResponseHandler(res, error, "Exception while getting all active  trainer  !");
    }
};


exports.trainerRating = async (req, res) => {
    try {
        let queryCond = { _id: req.body.employeeId, 'rating.member': req.body.rating.member };
        let isExists = await Employee.find(queryCond);
        if (isExists.length !== 0) {
            let response = await Employee.findOneAndUpdate(queryCond,
                { $set: { 'rating.$.star': req.body.rating.star } }, { new: true }).lean();
            let sum = 0;
            let length = response.rating.length;
            response.rating.forEach(doc => { sum += parseInt(doc.star) });
            let ratingAvg = sum / length;
            let newResponse = await Employee.findByIdAndUpdate(req.body.employeeId, { ratingAvg: ratingAvg }, { new: true }).lean();
            successResponseHandler(res, newResponse, "successfully give the ratings ! ");
        } else {
            let response = await Employee.findByIdAndUpdate(req.body.employeeId,
                { $push: { rating: req.body.rating } }, { new: true }).lean();
            let sum = 0;
            let length = response.rating.length;
            response.rating.forEach(doc => { sum += parseInt(doc.star) });
            let ratingAvg = sum / length;
            let newResponse = await Employee.findByIdAndUpdate(req.body.employeeId, { ratingAvg: ratingAvg }, { new: true }).lean();
            successResponseHandler(res, newResponse, "successfully give the ratings ! ");
        }
    } catch (error) {
        console.log("TCL: exports.trainerRating -> error", error)
        logger.error(error);
    }
};