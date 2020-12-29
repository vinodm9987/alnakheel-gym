const {
    getAllMember, createNewMember, generateToken, getMemberByCredentialId,
    updateMember, updateMemberAndAddPackage, createNewMemberByAdmin, getFirstRegisterMembers, payAtGymMobile,
    updateMemberDetails, getAllActiveMember, getAllActiveMemberOfTrainer, getMemberById,
    getActiveRegisterMembers, getBioStarToken, addMemberFingerPrint, excludeMemberFingerPrint, getAllPendingMember,
    updateFingerPrint, startPackage, updateMemberProfile, blackListUser, getActiveStatusRegisterMembers,
    getActiveStatusNotExpiredRegisterMembers,
    getExpiredMembers, getAboutToExpireMembers, getClassesMembers,
    getCprData, getMemberByMemberId
} = require('../controller/member/member.controller');


const { addWaterInTake, getMemberWaterInTake, updateMemberWaterInTake } = require('../controller/member/waterInTake.controller');


const { addMemberReminder, getMemberReminderByDate } = require('../controller/member/memberReminder.controller');


const { applyFreezeMember, applyFreezeAllMember, getPendingFreezeMember,
    freezeMember, getFreezeHistory, removeMemberFreeze } = require('../controller/member/memberFreeze.controller');


exports.routes = (express, app) => {


    const router = express.Router();


    router.post('/getAllMember', getAllMember);

    router.get('/getMemberById/:id', getMemberById);

    router.post('/getAllActiveMember', getAllActiveMember);

    router.post('/getExpiredMembers', getExpiredMembers);

    router.post('/getAboutToExpireMembers', getAboutToExpireMembers);

    router.get('/getMemberByCredentialId/:id', getMemberByCredentialId);

    router.get('/getAllActiveMemberOfTrainer/:employeeId', getAllActiveMemberOfTrainer);

    router.post('/getFirstRegisterMembers', getFirstRegisterMembers);

    router.post('/updateMemberProfile/:id', updateMemberProfile);

    router.post('/getActiveRegisterMembers', getActiveRegisterMembers);

    router.post('/getActiveStatusRegisterMembers', getActiveStatusRegisterMembers);

    router.post('/getActiveStatusNotExpiredRegisterMembers', getActiveStatusNotExpiredRegisterMembers);

    router.post('/getAllPendingMember', getAllPendingMember);

    router.post('/createNewMember', createNewMember);

    router.post('/generateToken', generateToken);

    router.post('/updateMember', updateMember);

    router.post('/updateMemberAndAddPackage', updateMemberAndAddPackage);

    router.post('/payAtGymMobile/:id', payAtGymMobile);

    router.post('/createNewMemberByAdmin', createNewMemberByAdmin);

    router.post('/updateMemberDetails/:id', updateMemberDetails);

    router.post('/getClassesMembers', getClassesMembers)




    /**
     * BIOSTAR AUTH APIS
    */


    router.get("/getBioStarToken", getBioStarToken);

    router.post('/addMemberFingerPrint', addMemberFingerPrint);

    router.post('/excludeMemberFingerPrint', excludeMemberFingerPrint);

    router.post('/updateFingerPrint', updateFingerPrint);

    router.post('/startPackage', startPackage);

    router.post('/blackListUser/:id', blackListUser);



    /**
     * WATER IN TAKE
    */

    router.post('/addWaterInTake', addWaterInTake);

    router.post('/getMemberWaterInTake', getMemberWaterInTake);

    router.post('/updateMemberWaterInTake', updateMemberWaterInTake);





    /**
     * REMINDER
    */

    router.post('/addMemberReminder', addMemberReminder);

    router.post('/getMemberReminderByDate', getMemberReminderByDate);



    /**
     * FREEZE MEMBERS
    */

    router.post('/applyFreezeMember', applyFreezeMember);

    router.post('/applyFreezeAllMember', applyFreezeAllMember);

    router.post('/getPendingFreezeMember', getPendingFreezeMember);

    router.post('/freezeMember', freezeMember);

    router.post('/getFreezeHistory', getFreezeHistory);

    router.post('/removeMemberFreeze', removeMemberFreeze);



    /**
     * MEMBER CPR
    */

    router.get('/getCprData', getCprData);

    router.post('/getMemberByMemberId', getMemberByMemberId)




    app.use('/api/member/', router);

};