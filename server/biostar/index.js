
const axios = require("axios")


const {
    logger: { logger },
    biostar: {
        getScheduleObject, getAccessLevelObject, getUserGroupObject, getAccessGroupObject, fingerPrintBody,
        getUserObject, fingerPrintObj, getUpdateUserObject, getUserDisableObject, getUserFreezeObject,
        BIO_STAR_LOGIN_URL, BIO_STAR_LOGIN_BODY, BIO_STAR_SCHEDULE_URL, BIO_STAR_USER_GROUP_URL,
        BIO_STAR_ACCESS_LEVEL_URL, BIO_STAR_ACCESS_GROUP_URL, BIO_STAR_USER_REGISTRATION_URL,
        BIO_STAR_IP, BIO_STAR_MACHINE_ID, faceRecognitionObj
    }
} = require('../../config')


const bioStarLogin = async () => {
    try {
        let response = await axios.post(BIO_STAR_LOGIN_URL, BIO_STAR_LOGIN_BODY)
        return {
            'Content-Type': 'application/json',
            token: response.headers["set-token"].toString()
        }
    } catch (error) {
        logger.error(error.response.data);
        console.error("TCL: exports.bioStarLogin -> error", error.message);
    }
};



exports.bioStarToken = async () => {
    try {
        let response = await axios.post(BIO_STAR_LOGIN_URL, BIO_STAR_LOGIN_BODY)
        return {
            'Content-Type': 'application/json',
            token: response.headers["set-token"].toString()
        }
    } catch (error) {
        logger.error(error.response.data);
        console.error("TCL: exports.bioStarLogin -> error", error.message);
    }
};





exports.addPackage = async (packageName, startTime, endTime) => {
    try {
        const headers = await bioStarLogin();
        const scheduleResponse = await axios.post(BIO_STAR_SCHEDULE_URL, getScheduleObject(packageName, startTime, endTime), { headers })
        const scheduleData = await axios.get(`${BIO_STAR_SCHEDULE_URL}/${scheduleResponse.data.id}`, { headers })
        const accessLevelResponse = await axios.post(BIO_STAR_ACCESS_LEVEL_URL, getAccessLevelObject(packageName, scheduleData.data.name, scheduleData.data.id), { headers })
        const accessLevelData = await axios.get(`${BIO_STAR_ACCESS_LEVEL_URL}/${accessLevelResponse.data.id}`, { headers })
        const userGroupResponse = await axios.post(`${BIO_STAR_USER_GROUP_URL}`, getUserGroupObject(packageName), { headers })
        const accessGroupResponse = await axios.post(`${BIO_STAR_ACCESS_GROUP_URL}`, getAccessGroupObject(packageName, accessLevelData.data, userGroupResponse.data.id), { headers })
        const accessGroupData = await axios.get(`${BIO_STAR_ACCESS_GROUP_URL}/${accessGroupResponse.data.id}`, { headers })
        return {
            scheduleId: scheduleData.data.id,
            accessLevelId: accessLevelResponse.data.id,
            accessGroupId: accessGroupData.data.id,
            accessGroupName: accessGroupData.data.name,
            userGroupId: userGroupResponse.data.id
        };
    } catch (error) {
        logger.error(error.response);
        console.error("TCL: exports.bioStarLogin -> error", error.response);
    }
};


exports.updatePackage = async (packageName, startTime, endTime, bioStarData) => {
    try {
        const headers = await bioStarLogin();
        const { scheduleId, accessLevelId, userGroupId, accessGroupId, accessGroupName } = bioStarData;
        const accessGroup = { id: accessLevelId, name: packageName }
        await axios.put(`${BIO_STAR_SCHEDULE_URL}/${scheduleId}`, getScheduleObject(packageName, startTime, endTime), { headers });
        await axios.put(`${BIO_STAR_ACCESS_LEVEL_URL}/${accessLevelId}`, getAccessLevelObject(packageName, packageName, scheduleId), { headers });
        await axios.put(`${BIO_STAR_USER_GROUP_URL}/${userGroupId}`, getUserGroupObject(packageName), { headers });
        await axios.put(`${BIO_STAR_ACCESS_GROUP_URL}/${accessGroupId}`, getAccessGroupObject(packageName, accessGroup, userGroupId), { headers })
        return {
            scheduleId: scheduleId,
            accessLevelId: accessLevelId,
            accessGroupId: accessGroupId,
            accessGroupName: accessGroupName,
            userGroupId: userGroupId
        }
    } catch (error) {
        logger.error(error.response);
        console.error("TCL: exports.bioStarLogin -> error", error.response);
    }
};




exports.addClass = async (className) => {
    try {
        const headers = await bioStarLogin();
        const scheduleResponse = await axios.post(BIO_STAR_SCHEDULE_URL, getScheduleObject(className), { headers })
        const scheduleData = await axios.get(`${BIO_STAR_SCHEDULE_URL}/${scheduleResponse.data.id}`, { headers })
        const accessLevelResponse = await axios.post(BIO_STAR_ACCESS_LEVEL_URL, getAccessLevelObject(className, scheduleData.data.name, scheduleData.data.id), { headers })
        const accessLevelData = await axios.get(`${BIO_STAR_ACCESS_LEVEL_URL}/${accessLevelResponse.data.id}`, { headers })
        const userGroupResponse = await axios.post(`${BIO_STAR_USER_GROUP_URL}`, getUserGroupObject(className), { headers })
        const accessGroupResponse = await axios.post(`${BIO_STAR_ACCESS_GROUP_URL}`, getAccessGroupObject(className, accessLevelData.data, userGroupResponse.data.id), { headers })
        const accessGroupData = await axios.get(`${BIO_STAR_ACCESS_GROUP_URL}/${accessGroupResponse.data.id}`, { headers })
        return {
            scheduleId: scheduleData.data.id,
            accessLevelId: accessLevelResponse.data.id,
            accessGroupId: accessGroupData.data.id,
            accessGroupName: accessGroupData.data.name,
            userGroupId: userGroupResponse.data.id
        };
    } catch (error) {
        logger.error(error.response);
        console.error("TCL: exports.bioStarLogin -> error", error.response);
    }
};


exports.updateClass = async (className, bioStarData) => {
    try {
        const headers = await bioStarLogin();
        const { scheduleId, accessLevelId, userGroupId, accessGroupId, accessGroupName } = bioStarData;
        const accessGroup = { id: accessLevelId, name: className }
        await axios.put(`${BIO_STAR_SCHEDULE_URL}/${scheduleId}`, getScheduleObject(className), { headers });
        await axios.put(`${BIO_STAR_ACCESS_LEVEL_URL}/${accessLevelId}`, getAccessLevelObject(className, className, scheduleId), { headers });
        await axios.put(`${BIO_STAR_USER_GROUP_URL}/${userGroupId}`, getUserGroupObject(className), { headers });
        await axios.put(`${BIO_STAR_ACCESS_GROUP_URL}/${accessGroupId}`, getAccessGroupObject(className, accessGroup, userGroupId), { headers })
        return {
            scheduleId: scheduleId,
            accessLevelId: accessLevelId,
            accessGroupId: accessGroupId,
            accessGroupName: accessGroupName,
            userGroupId: userGroupId
        }
    } catch (error) {
        logger.error(error.response);
        console.error("TCL: exports.bioStarLogin -> error", error.response);
    }
};



exports.addMemberInBioStar = async (data) => {
    try {
        const headers = await bioStarLogin();
        const userResponse = await axios.post(`${BIO_STAR_USER_REGISTRATION_URL}`, getUserObject(data), { headers })
        await axios.put(`${BIO_STAR_USER_REGISTRATION_URL}/${data.memberId}/face_templates`, faceRecognitionObj(data.raw_image, data.templates), { headers })
        return userResponse
    } catch (error) {
        logger.error(error.response);
        console.error("TCL: exports.bioStarLogin -> error", error.response.data);
    }
};


exports.updateFaceRecognition = async (data) => {
    try {
        const headers = await bioStarLogin();
        const response = await axios.put(`${BIO_STAR_USER_REGISTRATION_URL}/${data.memberId}/face_templates`, faceRecognitionObj(data.raw_image, data.templates), { headers })
        return response;
    } catch (error) {
        logger.error(error.response);
        console.error("TCL: exports.bioStarLogin -> error", error.response.data);
    }
};



exports.updateMemberInBioStar = async (data) => {
    try {
        const headers = await bioStarLogin();
        const userResponse = await axios.put(`${BIO_STAR_USER_REGISTRATION_URL}/${data.memberId}`, getUpdateUserObject(data), { headers })
        return userResponse
    } catch (error) {
        logger.error(error.response);
        console.error("TCL: exports.bioStarLogin -> error", error.response.data);
    }
};


exports.updateFingerPrint = async (data) => {
    try {
        const headers = await bioStarLogin();
        const response = await axios.put(`${BIO_STAR_USER_REGISTRATION_URL}/${data.memberId}/fingerprint_templates`, fingerPrintObj(data.template0, data.template1), { headers })
        return response
    } catch (error) {
        logger.error(error.response);
        console.error("TCL: exports.bioStarLogin -> error", error.response.data);
    }
}



exports.disableMember = async (memberId, status) => {
    try {
        const headers = await bioStarLogin();
        const response = await axios.get(`${BIO_STAR_USER_REGISTRATION_URL}/${memberId}`, { headers });
        const object = getUserDisableObject(response.data, status)
        const newResponse = await axios.put(`${BIO_STAR_USER_REGISTRATION_URL}/${memberId}`, object, { headers });
        return newResponse
    } catch (error) {
        logger.error(error.response.data);
        console.error("TCL: exports.bioStarLogin -> error", error.response.data);
    }
}



exports.freezeMember = async (memberId, startDate, endDate) => {
    try {
        const headers = await bioStarLogin();
        const response = await axios.get(`${BIO_STAR_USER_REGISTRATION_URL}/${memberId}`, { headers });
        const object = getUserFreezeObject(response.data, startDate, endDate);
        const newResponse = await axios.put(`${BIO_STAR_USER_REGISTRATION_URL}/${memberId}`, object, { headers });
        return newResponse;
    } catch (error) {
        logger.error(error.response.data);
        console.error("TCL: exports.bioStarLogin -> error", error.response.data);
    }
};

exports.getFingerPrintTemplate = async () => {
    try {
        const headers = await bioStarLogin();
        const template0 = await axios.post(`${BIO_STAR_IP}/devices/${BIO_STAR_MACHINE_ID}/scan_fingerprint`, fingerPrintBody, { headers });
        const template1 = await axios.post(`${BIO_STAR_IP}/devices/${BIO_STAR_MACHINE_ID}/scan_fingerprint`, fingerPrintBody, { headers });
        return { template0: template0.data.template0, template1: template1.data.template0 }
    } catch (error) {
        logger.error(error.response.data);
        console.error("TCL: exports.bioStarLogin -> error", error.response.data);
    }
}


exports.getFaceRecognitionTemplate = async () => {
    try {
        const headers = await bioStarLogin();
        const response = await axios.post(`${BIO_STAR_IP}/devices/${BIO_STAR_MACHINE_ID}/scan_face`, { "pose_sensitivity": 0 }, { headers });
        return { raw_image: response.data.raw_image, templates: response.data.templates }
    } catch (error) {
        logger.error(error.response.data);
        console.error("TCL: exports.bioStarLogin -> error", error.response.data);
    }
};