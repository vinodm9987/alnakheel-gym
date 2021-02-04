/**
 * utils.
*/
const sharp = require('sharp');
var fs = require('fs'),
    xml2js = require('xml2js');

const { logger: { logger }, upload: { uploadAvatar },
    handler: { successResponseHandler, errorResponseHandler },
    config: { DESIGNATION, } } = require('../../../config')


const { Mailer: { sendMail, }, Formate: { setTime, convertToDate }, IdGenerator: { createId, generateOrderId },
    Referral: { updateTransaction, addPointOfPolicy, checkExpiry, pendingPaymentToGetPoint, checkExpiryOfPolicy, addPointOfReferral } } = require('../../utils');


const { updateMemberInBioStar, bioStarToken, disableMember,
    getFaceRecognitionTemplate, addMemberInBioStar, updateFaceRecognition } = require('../../biostar');


const { newMemberAssign } = require('../../notification/helper');

const { memberEntranceStatus } = require('../../socket/emitter');



/**
 * models.
*/


const { Credential, Member, Designation, Employee,
    MemberCode, MemberClass, AdminPassword } = require('../../model');

const { auditLogger } = require('../../middleware/auditlog.middleware');



const memberSearch = (response, search) => {
    let newResponse = response.filter((doc) => {
        if (search) {
            let temp = doc.credentialId.email ? doc.credentialId.email.toLowerCase() : '';
            let temp1 = doc.credentialId.userName.toLowerCase();
            let temp2 = doc.personalId.toLowerCase();
            let temp3 = doc.mobileNo.toString();
            if (temp.includes(search) || temp1.includes(search) ||
                temp2.includes(search) || temp3.includes(search)) {
                return doc
            }
        } else {
            return doc;
        }
    })
    return newResponse;
};





exports.updateMemberProfile = (req, res) => {
    uploadAvatar(req, res, async (error, result) => {
        if (error) return errorResponseHandler(res, error, "while uploading profile error occurred !");
        if (req.files.length > 0) await Credential.findByIdAndUpdate(req.params.id, { avatar: req.files[0] })
        req.responseData = await Member.findOne({ credentialId: req.params.id }).populate('credentialId').lean()
        Member.findOneAndUpdate({ credentialId: req.params.id }, JSON.parse(req.body.data))
            .then(response => {
                auditLogger(req, 'Success')
                successResponseHandler(res, response, "successfully updated member !!");
            }).catch(error => {
                logger.default.error(error);
                auditLogger(req, 'Failed')
                errorResponseHandler(res, error, "Exception while updating member !");
            });
    });
};





/**
 * get all members
*/


exports.getAllMember = async (req, res) => {
    try {
        let search = ''
        if (req.body.search) search = req.body.search.toLowerCase()
        let queryCond = {};
        if (req.body.branch) queryCond["branch"] = req.body.branch
        let response = await Member.find(queryCond).populate('credentialId branch')
            .populate("packageDetails.packages").lean()
        let newResponse = memberSearch(response, search);
        successResponseHandler(res, newResponse, "successfully get all member details !!");
    }
    catch (error) {
        logger.error(error);
        errorResponseHandler(res, error, "Exception while getting all member details !");
    }
};




/**
 * get all actives members
*/


exports.getAllActiveMember = (req, res) => {
    let queryCond = {}
    queryCond["status"] = true
    if (req.body.branch) queryCond["branch"] = req.body.branch;
    Member.find(queryCond)
        .populate('credentialId')
        .then(response => {
            successResponseHandler(res, response, "successfully get all active user !!");
        }).catch(error => {
            logger.default.error(error);
            errorResponseHandler(res, error, "Exception while getting all active user !");
        });
};



/**
 * get all actives members of trainer
*/

exports.getAllActiveMemberOfTrainer = async (req, res) => {
    Member.find({ status: true, "packageDetails.trainer": req.params.employeeId }).then(response => {
        successResponseHandler(res, response, "successfully get all member of trainer !!");
    }).catch(error => {
        logger.default.error(error);
        errorResponseHandler(res, error, "Exception while getting all member of trainer !");
    });
}






/**
 *  create new member 
*/

exports.createNewMember = (req, res) => {
    uploadAvatar(req, res, async (error, data) => {
        if (error)
            return errorResponseHandler(res, error, "while uploading profile error occurred !");
        try {
            const memberDesignation = await Designation.findOne({ designationName: DESIGNATION[2] })
            const { mobileNo, gender, dateOfBirth, nationality, userName, email, password, referralCode,
                personalId, height, weight, questions, relationship, emergencyNumber, goal } = JSON.parse(req.body.data);
            if (referralCode) {
                const isExist = await MemberCode.findOne({ code: referralCode }).count();
                if (!isExist) return errorResponseHandler(res, 'error', 'referral code is wrong !');
                let isExpired = await checkExpiry(referralCode);
                if (!isExpired) return errorResponseHandler(res, error, "referral code is expired !");
            }
            const member = new Member({
                mobileNo, gender, dateOfBirth, nationality, personalId, height, weight, questions,
                isPackageSelected: false, emergencyNumber, relationship, startWeight: weight, goal
            });
            const credential = new Credential({
                userName, email, designation: memberDesignation._id,
                userId: member._id, designationName: DESIGNATION[2]
            });
            credential["avatar"] = req.files[0];
            credential.setPassword(password);
            const newResponse = await credential.save();
            member["credentialId"] = newResponse._id
            member["admissionDate"] = setTime(new Date())
            const response = await member.save();
            if (referralCode) { await pendingPaymentToGetPoint(referralCode, response._id) }
            return successResponseHandler(res, response, "successfully added new member !!");
        } catch (error) {
            logger.error(error);
            if (error.message.indexOf('duplicate key error') !== -1)
                return errorResponseHandler(res, error, "Email is already exist !");
            else
                return errorResponseHandler(res, error, "Exception occurred !");
        };
    });
};



/**
 *  create new member by admin
*/

exports.createNewMemberByAdmin = (req, res) => {
    uploadAvatar(req, res, async (error, data) => {
        if (error) return errorResponseHandler(res, error, "while uploading profile error occurred !");
        try {
            const memberDesignation = await Designation.findOne({ designationName: DESIGNATION[2] })
            const { mobileNo, gender, dateOfBirth, nationality, userName, email, personalId, branch,
                height, weight, packageDetails, questions, relationship, emergencyNumber, referralCode, notes } = JSON.parse(req.body.data);
            if (req.headers.userid) {
                packageDetails[0]["doneBy"] = req.headers.userid;
            }
            if (packageDetails[0].Installments && packageDetails[0].Installments.length) {
                packageDetails[0].Installments[0].dateOfPaid = setTime(new Date())
            } else {
                packageDetails[0]["dateOfPaid"] = setTime(new Date())
            }
            packageDetails[0]["startDate"] = setTime(packageDetails[0].startDate);
            packageDetails[0]["endDate"] = setTime(packageDetails[0].endDate);
            packageDetails[0]["orderNo"] = generateOrderId()
            packageDetails[0]["timeOfPaid"] = new Date()
            if (referralCode) {
                let isExpired = await checkExpiry(referralCode);
                if (!isExpired) return errorResponseHandler(res, error, "referral code is expired !")
            }
            const { memberCounter } = await createId('memberCounter');
            const member = new Member({
                mobileNo, gender, dateOfBirth, nationality, personalId, height, weight, branch,
                packageDetails, questions, relationship, emergencyNumber, startWeight: weight, notes
            });
            const credential = new Credential({
                userName, email, designation: memberDesignation._id,
                userId: member._id, designationName: DESIGNATION[2]
            });
            const password = Math.random().toString(36).slice(-8);
            member["admissionDate"] = setTime(new Date());
            member["memberId"] = memberCounter;
            credential["avatar"] = req.files[0];
            credential.setPassword(password);
            const newResponse = await credential.save();
            member["credentialId"] = newResponse._id;
            const response = await member.save();
            if (referralCode) await addPointOfReferral(referralCode, response._id);
            const policy = await checkExpiryOfPolicy();
            if (policy) await addPointOfPolicy(packageDetails[0].totalAmount, response._id);
            await sendMail(email, password);
            const newMemberResponse = await Member.findById(response._id)
                .populate('credentialId branch').populate('packageDetails.doneBy')
            await auditLogger(req, 'Success')
            return successResponseHandler(res, { ...newMemberResponse, ...{ displayReceipt: true } }, "successfully added new member !!");
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





exports.addMemberFaceRecognition = async (req, res) => {
    try {
        const { raw_image, templates } = await getFaceRecognitionTemplate()
        const bioObject = { raw_image, templates }
        await Credential.findOneAndUpdate({ userId: req.body.memberId }, { doneFingerAuth: true })
        await Member.findByIdAndUpdate(req.body.memberId, { doneFingerAuth: true, faceRecognitionTemplate: bioObject }, { new: true })
        const userData = await Member.findById(req.body.memberId).populate('credentialId packageDetails.packages').lean();
        const photo = sharp(userData.credentialId.avatar.path).rotate().resize(200).toBuffer()
        let obj = {
            accessGroupName: userData.packageDetails[0].packages.bioStarInfo.accessGroupName,
            accessGroupId: userData.packageDetails[0].packages.bioStarInfo.accessGroupId,
            userGroupId: userData.packageDetails[0].packages.bioStarInfo.userGroupId,
            endDate: userData.packageDetails[0].endDate,
            memberId: userData.memberId,
            name: userData.credentialId.userName,
            email: userData.credentialId.email,
            newPhoto: photo.toString('base64').replace('data:image/png;base64,', ''),
            phoneNumber: userData.mobileNo,
            startDate: userData.packageDetails[0].startDate,
            templates, raw_image
        };
        await addMemberInBioStar(obj);
        const newResponse = await Member.findById(req.body.memberId).populate('credentialId branch')
            .populate({ path: "packageDetails.trainerDetails.trainer", populate: { path: "credentialId" } })
            .populate({ path: "packageDetails.packages", populate: { path: "period" } })
            .populate({ path: "packageDetails.trainerDetails.trainerFees", populate: { path: "period" } }).lean()
        successResponseHandler(res, newResponse, "successfully save the transaction !!");
    } catch (error) {
        logger.error(error);
        errorResponseHandler(res, error, "Exception while adding fingerprint !");
    }
};


exports.updateFaceRecognition = async (req, res) => {
    try {
        await AdminPassword.findOne({ password: req.body.password }).then(async user => {
            if (!user) return errorResponseHandler(res, '', "Your entered password is wrong !");
            else {
                const { raw_image, templates } = await getFaceRecognitionTemplate()
                const userData = await Member.findById(req.body.memberId).lean()
                const bioObject = { raw_image, templates, memberId: userData.memberId, }
                await updateFaceRecognition(bioObject)
                await Member.findByIdAndUpdate(req.body.memberId, { biometricTemplate: bioObject }, { new: true })
                const newResponse = await Member.findById(req.body.memberId).populate('credentialId branch')
                    .populate({ path: "packageDetails.trainerDetails.trainer", populate: { path: "credentialId" } })
                    .populate({ path: "packageDetails.packages", populate: { path: "period" } })
                    .populate({ path: "packageDetails.trainerDetails.trainerFees", populate: { path: "period" } }).lean()
                return successResponseHandler(res, newResponse, "successfully save the transaction !!");
            }
        });
    } catch (error) {
        logger.error(error);
        errorResponseHandler(res, error, "Exception while send code !");
    }
};



/**
 *  purchase new package
*/


exports.updateMemberDetails = async (req, res) => {
    let isUsedReferralCode = await MemberCode.findOne({ "joinMember.member": req.params.id, "joinMember.status": "Join" }).lean();
    if (isUsedReferralCode) req.body["walletPoints"] = await updateTransaction(isUsedReferralCode, req.params.id);
    let memberAllClassResponse = await MemberClass.find({ member: req.params.id }).populate('classId').lean()
    if (req.body.packageDetails.length === 1 && memberAllClassResponse.length === 0) {
        const { memberCounter } = await createId('memberCounter');
        req.body["memberId"] = memberCounter;
    }
    if (req.headers.userid) {
        req.body.packageDetails[req.body.index]["doneBy"] = req.headers.userid
    }
    req.body.packageDetails[req.body.index]["orderNo"] = generateOrderId()
    req.body.packageDetails[req.body.index]["dateOfPurchase"] = setTime(new Date())
    req.body.packageDetails[req.body.index]["timeOfPurchase"] = new Date()
    const amount = req.body.transactionAmount;
    req.responseData = await Member.findById(req.params.id).populate('credentialId').lean()
    Member.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .populate('credentialId branch')
        .populate('packageDetails.packages packageDetails.trainerFees packageDetails.trainer')
        .populate({ path: "packageDetails.trainer", populate: { path: "credentialId" } })
        .populate({ path: "packageDetails.packages", populate: { path: "period" } })
        .populate({ path: "packageDetails.trainerFees", populate: { path: "period" } })
        .then(async response => {
            const policy = await checkExpiryOfPolicy();
            if (policy) await addPointOfPolicy(amount, response._id);
            auditLogger(req, 'Success')
            return successResponseHandler(res, response, "successfully update member details !!");
        }).catch(error => {
            logger.error(error);
            auditLogger(req, 'Failed')
            errorResponseHandler(res, error, "Exception while updating  member details !");
        });
};







/**
 *  update member info
*/
exports.updateMember = (req, res) => {
    uploadAvatar(req, res, async (error, data) => {
        if (error)
            return errorResponseHandler(res, error, "while uploading profile error occurred !");
        try {
            const { mobileNo, gender, dateOfBirth, nationality, userName, email, personalId, branch, height, weight, emergencyNumber, relationship, memberId, credentialId, notes } = JSON.parse(req.body.data);
            let newObj = { mobileNo, gender, dateOfBirth, nationality, personalId, branch, height, weight, emergencyNumber, relationship, notes };
            req.responseData = await Member.findById(memberId).populate('credentialId').lean()
            if (userName || email) {
                let obj = { userName, email }
                if (req.files.length > 0) obj["avatar"] = req.files[0];
                await Credential.findByIdAndUpdate(credentialId, obj)
            }
            const response = await Member.findByIdAndUpdate(memberId, newObj, { new: true })
                .populate('credentialId branch')
                .populate('packageDetails.packages packageDetails.trainerFees packageDetails.trainer')
                .populate({ path: "packageDetails.trainer", populate: { path: "credentialId" } })
                .populate({ path: "packageDetails.packages", populate: { path: "period" } });
            auditLogger(req, 'Success')
            return successResponseHandler(res, response, "successfully updated Member !!");
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
 *  update member and add package for the first time
*/
exports.updateMemberAndAddPackage = (req, res) => {
    uploadAvatar(req, res, async (error, data) => {
        if (error)
            return errorResponseHandler(res, error, "while uploading profile error occurred !");
        try {
            const { mobileNo, gender, dateOfBirth, nationality, userName, email, personalId, branch, height, weight, emergencyNumber,
                relationship, memberId, credentialId, notes, packageDetails } = JSON.parse(req.body.data);
            if (req.headers.userid) {
                packageDetails[0]["doneBy"] = req.headers.userid
            }
            packageDetails[0]["orderNo"] = generateOrderId()
            packageDetails[0]["dateOfPurchase"] = setTime(new Date())
            packageDetails[0]["timeOfPurchase"] = new Date()
            let isUsedReferralCode = await MemberCode.findOne({ "joinMember.member": memberId, "joinMember.status": "Join" }).lean();
            if (isUsedReferralCode) req.body["walletPoints"] = await updateTransaction(isUsedReferralCode, memberId);
            let memberAllClassResponse = await MemberClass.find({ member: req.params.id }).populate('classId').lean()
            let newObj = {
                mobileNo, gender, dateOfBirth, nationality, personalId, branch, height, weight, emergencyNumber, relationship, notes,
                packageDetails, isPackageSelected: true
            }
            if (memberAllClassResponse.length === 0) {
                const { memberCounter } = await createId('memberCounter');
                newObj["memberId"] = memberCounter
            }
            req.responseData = await Member.findById(memberId).populate('credentialId').lean()
            if (userName || email) {
                let obj = { userName, email }
                if (req.files.length > 0) obj["avatar"] = req.files[0];
                await Credential.findByIdAndUpdate(credentialId, obj)
            }
            const response = await Member.findByIdAndUpdate(memberId, newObj, { new: true })
                .populate('credentialId branch')
                .populate('packageDetails.doneBy')
            const policy = await checkExpiryOfPolicy();
            if (policy) await addPointOfPolicy(packageDetails[0].totalAmount, response._id);
            auditLogger(req, 'Success')
            return successResponseHandler(res, { ...response, ...{ displayReceipt: true } }, "successfully updated Member !!");
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
 * get member details by credential id
*/


exports.getMemberByCredentialId = (req, res) => {
    if (req.params.id !== "undefined") {
        Member.findOne({ credentialId: req.params.id })
            .populate('credentialId branch packageDetails.trainerFees')
            .populate({ path: "packageDetails.trainerFees", populate: { path: "period" } })
            .then(response => {
                successResponseHandler(res, response, "successfully get all member details !!");
            }).catch(error => {
                logger.error(error);
                errorResponseHandler(res, error, "Exception while getting all member details !");
            });
    }
};




/**
 * get member details by member id
*/


exports.getMemberById = (req, res) => {
    Member.findById(req.params.id)
        .populate('credentialId branch')
        .populate('packageDetails.packages')
        .populate({ path: "packageDetails.trainerDetails.trainer", populate: { path: "credentialId" } })
        .populate({ path: "packageDetails.packages", populate: { path: "period" } })
        .populate({ path: "packageDetails.trainerDetails.trainerFees", populate: { path: "period" } })
        .then(response => {
            successResponseHandler(res, response, "successfully get  member details by id !!");
        }).catch(error => {
            logger.error(error);
            errorResponseHandler(res, error, "Exception while getting  member details by id !");
        });
};








/**
 *  get all first registered member
*/

exports.getFirstRegisterMembers = async (req, res) => {
    try {
        let search = req.body.search.toLowerCase()
        let queryCond = {};
        queryCond["doneFingerAuth"] = false;
        queryCond["isPackageSelected"] = true;
        if (req.body.branch) queryCond["branch"] = req.body.branch;
        let response = await Member.find(queryCond)
            .populate('credentialId branch').populate("packageDetails.packages").lean()
        let newResponse = response.filter((doc) => {
            if (search) {
                let temp = doc.credentialId.email.toLowerCase()
                let temp1 = doc.credentialId.userName.toLowerCase()
                let temp2 = doc.memberId ? doc.memberId.toString() : ''
                let temp3 = doc.mobileNo ? doc.mobileNo.toString() : ''
                if (temp.includes(search) || temp1.includes(search) || temp2.includes(search) || temp3.includes(search)) {
                    return doc
                }
            } else {
                return doc;
            }
        })
        successResponseHandler(res, newResponse, "successfully get all member details !!");
    }
    catch (error) {
        logger.error(error);
        errorResponseHandler(res, error, "Exception while getting all member details !");
    }

};




/**
 *  get all pending registration
*/

exports.getAllPendingMember = async (req, res) => {
    try {
        let search = req.body.search.toLowerCase()
        let queryCond = {};
        queryCond["doneFingerAuth"] = false;
        queryCond["isPackageSelected"] = false;
        if (req.body.branch) queryCond["branch"] = req.body.branch
        let response = await Member.find(queryCond).populate('credentialId branch').populate("packageDetails.packages").lean()
        let newResponse = memberSearch(response, search);
        return successResponseHandler(res, newResponse, "successfully get all member details !!");
    }
    catch (error) {
        logger.error(error);
        errorResponseHandler(res, error, "Exception while getting all member details !");
    }

};






/**
 *  get all active registered member
*/

exports.getActiveRegisterMembers = async (req, res) => {
    try {
        let search = req.body.search.toLowerCase()
        let queryCond = { 'packageDetails.isExpiredPackage': false };
        queryCond["doneFingerAuth"] = true;
        if (req.body.branch) queryCond["branch"] = req.body.branch;
        let response = await Member.find(queryCond).populate('credentialId branch').populate("packageDetails.packages").lean()
        let newResponse = memberSearch(response, search);
        return successResponseHandler(res, newResponse, "successfully get all member details !!");
    }
    catch (error) {
        logger.error(error);
        errorResponseHandler(res, error, "Exception while getting all member details !");
    }

};




/**
 *  get all active registered member with Status flag
*/

exports.getActiveStatusRegisterMembers = async (req, res) => {
    try {
        let search = req.body.search.toLowerCase()
        let queryCond = {};
        queryCond["doneFingerAuth"] = true;
        queryCond["status"] = true;
        if (req.body.branch) queryCond["branch"] = req.body.branch;
        let response = await Member.find(queryCond)
            .populate('credentialId').populate("packageDetails.packages")
            .populate({ path: 'packageDetails.trainer', populate: { path: "credentialId" } }).lean()
        let newResponse = memberSearch(response, search);
        return successResponseHandler(res, newResponse, "successfully get all member details !!");
    }
    catch (error) {
        logger.error(error);
        errorResponseHandler(res, error, "Exception while getting all member details !");
    }
};



/**
 *  get all active registered member with Status flag and  not expired also
*/

exports.getActiveStatusNotExpiredRegisterMembers = async (req, res) => {
    try {
        let search = req.body.search.toLowerCase()
        let queryCond = { 'packageDetails.isExpiredPackage': false };
        queryCond['packageDetails.startDate'] = { '$exists': true }
        queryCond["doneFingerAuth"] = true;
        queryCond["status"] = true;
        if (req.body.branch) queryCond["branch"] = req.body.branch;
        let response = await Member.find(queryCond)
            .populate('credentialId').populate("packageDetails.packages")
            .populate({ path: 'packageDetails.trainer', populate: { path: "credentialId" } }).lean()
        let newResponse = memberSearch(response, search);
        return successResponseHandler(res, newResponse, "successfully get all member details !!");
    }
    catch (error) {
        logger.error(error);
        errorResponseHandler(res, error, "Exception while getting all member details !");
    }
};



/**
 * generate token for verification
*/


exports.generateToken = async (req, res) => {
    try {
        const email = await Credential.findOne({ email: req.body.email }).lean();
        if (email) errorResponseHandler(res, 'error', 'Email is already in use !')
        else {
            const code = Math.floor(1000 + Math.random() * 9000);
            await sendMail(req.body.email, code)
            successResponseHandler(res, { code }, "successfully send code !!");
        }
    }
    catch (error) {
        logger.error(error);
        errorResponseHandler(res, error, "Exception while send code !");
    }
};





/**
 * paypal apis for payment
 *
*/

exports.payAtGymMobile = async (req, res) => {
    let queryCond = {}
    if (req.headers.userid) req.body.packageDetails["doneBy"] = req.headers.userid;
    req.body.packageDetails["startDate"] = setTime(req.body.packageDetails.startDate);
    req.body.packageDetails["endDate"] = setTime(req.body.packageDetails.endDate);
    req.body.packageDetails["orderNo"] = generateOrderId()
    req.body.packageDetails["dateOfPaid"] = setTime(new Date());
    req.body.packageDetails["timeOfPaid"] = new Date();
    if (req.body.packageDetails.Installments) {
        req.body.packageDetails.Installments.map(doc => {
            doc.dateOfPaid = setTime(new Date())
            doc.timeOfPaid = new Date();
            return doc;
        });
    }
    req.responseData = await Member.findById(req.params.id).populate('credentialId').lean()
    Member.findByIdAndUpdate(req.params.id, { $push: { packageDetails: req.body.packageDetails }, $set: queryCond })
        .populate('credentialId branch')
        .populate('packageDetails.doneBy')
        .then(response => {
            auditLogger(req, 'Success')
            successResponseHandler(res, { ...response, ...{ displayReceipt: true } }, "successfully save the transaction !!");
        }).catch(error => {
            logger.error(error);
            auditLogger(req, 'Failed')
            errorResponseHandler(res, error, "Exception while saving the transaction !");
        });
};






/**
 * add trainer in package for member
 *
*/

exports.bookTrainer = async (req, res) => {
    try {
        let trainerDetails = req.body.trainerDetails;
        trainerDetails['trainerStart'] = setTime(trainerDetails['trainerStart']);
        trainerDetails['trainerEnd'] = setTime(trainerDetails['trainerEnd']);
        trainerDetails["dateOfPaid"] = setTime(new Date());
        trainerDetails["timeOfPaid"] = new Date();
        if (trainerDetails.Installments) {
            req.body.trainerDetails.Installments.forEach(doc => {
                doc.dateOfPaid = setTime(new Date())
                doc.timeOfPaid = new Date();
            });
        }
        const member = await Member.findById(req.body.memberId);
        for (const [i, packages] of member.packageDetails.entries()) {
            if (req.body.packageDetailsId === packages._id.toString()) {
                member.packageDetails[i].trainerDetails.push(trainerDetails);
            }
        }
        const response = await member.save();
        return successResponseHandler(res, response, "success");
    } catch (error) {
        logger.error(error);
        return errorResponseHandler(res, error, "failed");
    }
};





/**
 * BIOSTAR AUTH APIS
*/



exports.getBioStarToken = async (req, res) => {
    try {
        let tokenData = await bioStarToken()
        successResponseHandler(res, tokenData, "successfully save the transaction !!");
    } catch (error) {
        logger.error(error);
        errorResponseHandler(res, error, "Exception while send code !");
    }
}




/**
 *  start the package of member
*/


exports.startPackage = async (req, res) => {
    try {
        req.body["startDate"] = setTime(req.body.startDate);
        req.body["endDate"] = setTime(req.body.endDate);
        req.body["trainerStart"] = setTime(req.body.trainerStart);
        req.body["trainerEnd"] = setTime(req.body.trainerEnd);
        await Member.update({ 'packageDetails._id': req.body.packageDetailId }, {
            $set: {
                'packageDetails.$.startDate': req.body.startDate, 'packageDetails.$.endDate': req.body.endDate,
                'packageDetails.$.trainerDetails.$.trainerStart': req.body.trainerStart, 'packageDetails.$.trainerDetails.$.trainerEnd': req.body.trainerEnd
            }
        });
        let memberAllClassResponse = await MemberClass.find({ member: req.body.memberId }).populate('classId').lean()
        const userData = await Member.findById(req.body.memberId).populate('credentialId packageDetails.packages').lean();
        const photo = sharp(userData.credentialId.avatar.path).rotate().resize(200).toBuffer()
        let obj = {
            accessGroupName: userData.packageDetails[0].packages.bioStarInfo.accessGroupName,
            accessGroupId: userData.packageDetails[0].packages.bioStarInfo.accessGroupId,
            userGroupId: userData.packageDetails[0].packages.bioStarInfo.userGroupId,
            endDate: req.body.endDate,
            memberId: userData.memberId,
            name: userData.credentialId.userName,
            email: userData.credentialId.email,
            newPhoto: photo.toString('base64').replace('data:image/png;base64,', ''),
            phoneNumber: userData.mobileNo,
            template0: userData.biometricTemplate.template0,
            template1: userData.biometricTemplate.template1,
            startDate: req.body.startDate
        }
        // if (memberAllClassResponse.length === 0) {
        //     if (userData.packageDetails.length )
        //     new Date(fromTime.setFullYear(2020, 11, 9))
        //     obj = {
        //         ...obj, ...{
        //             accessGroupName: userData.packageDetails[0].packages.bioStarInfo.accessGroupName,
        //             accessGroupId: userData.packageDetails[0].packages.bioStarInfo.accessGroupId,
        //             userGroupId: userData.packageDetails[0].packages.bioStarInfo.userGroupId
        //         }
        //     }
        // }
        userData.packageDetails.forEach(packageDetail => {
            if (new Date(packageDetail.endDate) > new Date(req.body.endDate)) obj.endDate = packageDetail.endDate
        })
        memberAllClassResponse.forEach(memberClass => {
            if (new Date(memberClass.classId.startDate) < new Date(obj.startDate)) obj.startDate = memberClass.classId.startDate
            if (new Date(memberClass.classId.endDate) > new Date(obj.endDate)) obj.endDate = memberClass.classId.endDate
        })
        if (userData.packageDetails.length > 1) await updateMemberInBioStar(obj);
        else await addMemberInBioStar(obj);
        const newResponse = await Member.findById(req.body.memberId).populate('credentialId branch')
            .populate({ path: "packageDetails.trainerDetails.trainer", populate: { path: "credentialId" } })
            .populate({ path: "packageDetails.packages", populate: { path: "period" } })
            .populate({ path: "packageDetails.trainerDetails.trainerFees", populate: { path: "period" } }).lean()
        if (req.body.trainer) { await newMemberAssign(req.body.trainer); }
        successResponseHandler(res, newResponse, "successfully save the transaction !!");
    } catch (error) {
        logger.error(error);
        errorResponseHandler(res, error, "Exception while send code !");
    }
};

/**
 * black list user from account
*/


exports.blackListUser = async (req, res) => {
    try {
        if (req.body.memberId) {
            let status;
            if (req.body.status) status = "IN"
            else status = 'AC';
            await disableMember(req.body.memberId, status)
            req.responseData = await Member.findById(req.params.id).populate('credentialId').lean()
            let response = await Member.findByIdAndUpdate(req.params.id, { status: !req.body.status })
            auditLogger(req, 'Success')
            successResponseHandler(res, response, "successfully operation done on member")
        } else {
            let response = await Employee.findByIdAndUpdate(req.params.id, { status: !req.body.status })
            successResponseHandler(res, response, "successfully operation done on Employee")
        }
    } catch (error) {
        logger.error(error);
        auditLogger(req, 'Failed')
        errorResponseHandler(res, error, "Exception while operation on user !");
    }
};



/**
 * expire list of member
*/

exports.getExpiredMembers = async (req, res) => {
    try {
        let queryCond = {};
        if (req.body.branch) queryCond["branch"] = req.body.branch;
        queryCond['packageDetails.isExpiredPackage'] = true;
        let search = req.body.search.toLowerCase()
        let response = await Member.find(queryCond)
            .populate('credentialId').populate("packageDetails.packages branch").lean()
        let newResponse = response.filter(doc => {
            if (search) {
                let temp = doc.credentialId.email.toLowerCase()
                let temp1 = doc.credentialId.userName.toLowerCase()
                let temp2 = doc.memberId ? doc.memberId.toString() : ''
                let temp3 = doc.mobileNo ? doc.mobileNo.toString() : ''
                if (temp.includes(search) || temp1.includes(search) || temp2.includes(search) || temp3.includes(search)) return doc
            } else {
                return doc;
            }
        });
        return successResponseHandler(res, newResponse, "successfully get expired member !!");
    }
    catch (error) {
        logger.error(error);
        errorResponseHandler(res, error, "Failed to get expired members!");
    }
}


exports.getAboutToExpireMembers = async (req, res) => {
    try {
        let queryCond = {};
        let search = req.body.search.toLowerCase()
        if (req.body.trainer) queryCond["packageDetails"] = { $elemMatch: { trainer: req.body.trainer } };
        if (req.body.branch) queryCond["branch"] = req.body.branch;
        const members = await Member.find(queryCond).populate('credentialId packageDetails.packages branch');
        const expiredMembers = [];
        for (let i = 0; i < members.length; i++) {
            let aboutToExpire = false;
            for (let j = 0; j < members[i].packageDetails.length; j++) {
                let endDate = members[i].packageDetails[j].endDate
                let today = new Date(new Date().setHours(0, 0, 0, 0));
                if (members[i].packageDetails[j].extendDate) {
                    endDate = members[i].packageDetails[j].extendDate;
                }
                if (new Date(convertToDate(endDate)).setDate(new Date(convertToDate(endDate)).getDate() - 2) <= today && today < new Date(convertToDate(endDate))) {
                    aboutToExpire = true;
                }
            }
            if (aboutToExpire) {
                expiredMembers.push(members[i])
            }
        }
        let newResponse = expiredMembers.filter(doc => {
            if (search) {
                let temp = doc.credentialId.email.toLowerCase()
                let temp1 = doc.credentialId.userName.toLowerCase()
                let temp2 = doc.memberId ? doc.memberId.toString() : ''
                let temp3 = doc.mobileNo ? doc.mobileNo.toString() : ''
                if (temp.includes(search) || temp1.includes(search) || temp2.includes(search) || temp3.includes(search)) return doc
            } else {
                return doc;
            }
        });
        return successResponseHandler(res, newResponse, "sucessfully get members !")
    } catch (error) {
        logger.error(error);
        errorResponseHandler(res, error, "Failed to get expired members!")
    }
};


exports.getClassesMembers = async (req, res) => {
    try {
        let search = req.body.search.toLowerCase()
        let queryCond = {};
        queryCond["doneFingerAuth"] = false;
        queryCond["isPackageSelected"] = false;
        if (req.body.branch) queryCond["branch"] = req.body.branch
        let pendingMember = await Member.find(queryCond).populate('credentialId branch').lean()
        pendingMember = memberSearch(pendingMember, search);
        let pendingMemberClasses = []
        for (let i = 0; i < pendingMember.length; i++) {
            let classesDetails = await MemberClass.find({ 'member': pendingMember[i]._id.toString() }).populate('classId').lean()
            if (classesDetails.length > 0) {
                pendingMemberClasses.push({ ...pendingMember[i], ...{ classesDetails } })
            }
        }
        return successResponseHandler(res, pendingMemberClasses, "successfully get all member details !!");
    } catch (error) {
        logger.error(error);
        errorResponseHandler(res, error, "Failed to get classes members!")
    }
};


exports.getCprData = async (req, res) => {
    try {
        const myFileURL = new URL('file:///C:/Users/Administrator/AppData/Local/Temp/2/eRevealerGcc.xml');
        var parser = new xml2js.Parser();
        fs.readFile(myFileURL, (err, data) => {
            parser.parseString(data, (err, result) => {
                res.json(result)
            });
        });
    } catch (error) {
        logger.error(error);
        errorResponseHandler(res, error, "Failed to get details from Card!")
    }
};


exports.getMemberByMemberId = async (req, res) => {
    try {
        let memberInfo = await Member.findOne({ memberId: +req.body.memberId })
            .populate('credentialId')
            .populate({ path: "packageDetails.packages", populate: { path: "period" } }).lean()
        memberInfo["fingerScanStatus"] = req.body.fingerScanStatus
        req.headers.userid = memberInfo.credentialId._id
        auditLogger(req, 'Failed')
        memberEntranceStatus(memberInfo)
        successResponseHandler(res, memberInfo, 'successfully get member details !');
    } catch (error) {
        logger.error(error);
        errorResponseHandler(res, error, "Exception while getting member details !");
    }
}