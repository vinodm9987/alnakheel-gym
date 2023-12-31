/** 
 * BIO STAR LOGIN URL
*/
const { formateBioStarDate, formateBioEndDateDate } = require('../server/utils/timeFormate.util');


exports.BIO_STAR_LOGIN_URL = "http://127.0.0.1:8795/v2/login";


/** 
 * BIO STAR LOGIN BODY
*/

exports.BIO_STAR_LOGIN_BODY = { "name": "test", "user_id": "1", "password": "pixel1234" };


/** 
 * BIO STAR SCHEDULE OBJECT
*/

exports.getScheduleObject = (packageName, startTime, endTime) => {
    return {
        "daily_schedules": [
            {
                "day_index": 0,
                "time_segments": [
                    {
                        "start_time": startTime, "end_time": endTime
                    }
                ],
            },
            {
                "day_index": 1,
                "time_segments": [
                    {
                        "start_time": startTime, "end_time": endTime
                    }
                ],
            },
            {
                "day_index": 2,
                "time_segments": [
                    {
                        "start_time": startTime, "end_time": endTime
                    }
                ],
            },

            {
                "day_index": 3,
                "time_segments": [
                    {
                        "start_time": startTime, "end_time": endTime
                    }
                ],
            }, {
                "day_index": 4,
                "time_segments": [
                    {
                        "start_time": startTime, "end_time": endTime
                    }
                ],
            },
            {
                "day_index": 5,
                "time_segments": [
                    {
                        "start_time": startTime, "end_time": endTime
                    }
                ],
            },
            {
                "day_index": 6,
                "time_segments": [
                    {
                        "start_time": startTime, "end_time": endTime
                    }
                ],
            }
        ],
        "description": `${packageName} for user only`,
        "holiday_schedules": [],
        "name": packageName,
        "schedule_period": 0,
        "start_date": new Date().toISOString()
    }
};


/** 
 * BIO STAR ACCESS LEVEL OBJECT
*/

exports.getAccessLevelObject = (packageName, scheduleName, scheduleId) => {
    return {
        "description": ` this is the ${packageName} module`,
        "items": [{
            "door_list": [{ "id": 1, "name": "Demo Door" }],
            "schedule": { "id": scheduleId, "name": scheduleName }
        }],
        "name": `${packageName} access level`
    }
}



/** 
 * BIO STAR ACCESS LEVEL OBJECT
*/

exports.getUserGroupObject = (packageName) => {
    return {
        "name": packageName,
        "parent": {
            "id": 1,
            "name": packageName
        }
    }
}


/** 
 * BIO STAR ACCESS GROUP OBJECT
*/

exports.getAccessGroupObject = (packageName, accessLevelData, userGroupId) => {
    return {
        "access_levels": [{
            "id": accessLevelData.id,
            "name": accessLevelData.name
        }],
        "description": `this is ${packageName} access group`,
        "name": `${packageName} access group`,
        "user_groups": [{
            "id": userGroupId
        }],
        "users": []
    }
};


/** 
 * BIO STAR USER OBJECT
*/

exports.getUserObject = (data) => {
    const { accessGroupName, accessGroupId, endDate, memberId, name, email,
        phoneNumber, newPhoto, startDate, userGroupId
    } = data;
    return {
        "access_groups": [{ "name": accessGroupName, "id": accessGroupId }],
        "email": email,
        "expiry_datetime": formateBioEndDateDate(endDate),
        "login_id": `${name.replace(/\s/g, "")}${memberId}`,
        "name": name,
        "password": "ANujm4467@gmail.com",
        "permission": { "id": "2", "name": "User Operator", "description": "this is a permission for User Operators" },
        "disabled": "false",
        "phone_number": phoneNumber,

        "status": "true",
        "photo": newPhoto,
        "photo_exists": true,
        "start_datetime": formateBioStarDate(startDate),
        "user_group": { "id": userGroupId },
        "user_id": memberId,
        "security_level": "LOW"
    }
};


exports.getUpdateUserObject = (data) => {
    const { accessGroupName, accessGroupId, endDate, name, email,
        phoneNumber, template0, template1, newPhoto, startDate, userGroupId
    } = data;
    return {
        "access_groups": [{ "name": accessGroupName, "id": accessGroupId }],
        "email": email,
        "expiry_datetime": formateBioEndDateDate(endDate),
        "name": name,
        "password": "ANujm4467@gmail.com",
        "permission": { "id": "2", "name": "User Operator", "description": "this is a permission for User Operators" },
        "disabled": "false",
        "phone_number": phoneNumber,
        "fingerprint_templates": [{
            "finger_mask": "false",
            "isNew": "true",
            "template0": template0,
            "template1": template1
        }],
        "status": "true",
        "photo": newPhoto,
        "photo_exists": true,
        "start_datetime": formateBioStarDate(startDate),
        "user_group": { "id": userGroupId },
        "security_level": "LOW"
    }
};



exports.getFingerPrintUrl = (userId) => {
    return `http://127.0.0.1:8795/v2/users/${userId}/fingerprint_templates`
};


exports.fingerPrintObj = (template0, template1) => {
    return {
        "fingerprint_template_list": [
            {
                "is_prepare_for_duress": false,
                "template0": template0,
                "template1": template1
            }
        ]
    }
};


exports.faceRecognitionObj = (raw_image, templates) => {
    return {
        "face_template_list": [
            {
                "raw_image": raw_image,
                "templates": templates
            }
        ]
    }
};




exports.getUserDisableObject = (data, status) => {
    return {
        "user_group": data.user_group,
        "access_groups": data.access_groups,
        "start_datetime": formateBioStarDate(data.start_datetime),
        "expiry_datetime": formateBioEndDateDate(data.expiry_datetime),
        "security_level": data.security_level,
        "status": status,
        "name": data.name,
        "email": data.email,
        "password": "ANujm4467@gmail.com"
    }
};




exports.getUserFreezeObject = (data, startDate, endDate) => {
    return {
        "user_group": data.user_group,
        "access_groups": data.access_groups,
        "start_datetime": formateBioStarDate(startDate),
        "expiry_datetime": formateBioEndDateDate(endDate),
        "security_level": data.security_level,
        "status": 'AC',
        "name": data.name,
        "email": data.email,
        "password": "ANujm4467@gmail.com"
    }
};



exports.getUserFreezeCancelObject = (data) => {
    return {
        "user_group": data.user_group,
        "access_groups": data.access_groups,
        "start_datetime": formateBioStarDate(data.startDate),
        "expiry_datetime": formateBioEndDateDate(data.endDate),
        "security_level": data.security_level,
        "status": 'AC',
        "name": data.name,
        "email": data.email,
        "password": "ANujm4467@gmail.com"
    }
};


/**
 * BIO STAR SCHEDULE POST URL
*/


exports.BIO_STAR_SCHEDULE_URL = "http://127.0.0.1:8795/v2/schedules";



/**
 * BIO STAR ACCESS LEVEL POST URL
*/


exports.BIO_STAR_ACCESS_LEVEL_URL = "http://127.0.0.1:8795/v2/access_levels";



/**
 * BIO STAR USER GROUP URL
*/


exports.BIO_STAR_USER_GROUP_URL = "http://127.0.0.1:8795/v2/user_groups";



/**
 * BIO STAR ACCESS GROUP URL
*/


exports.BIO_STAR_ACCESS_GROUP_URL = "http://127.0.0.1:8795/v2/access_groups";



/**
 * BIO STAR USER REGISTRATION SERVICE URL
*/

exports.BIO_STAR_USER_REGISTRATION_URL = "http://127.0.0.1:8795/v2/users";



exports.BIO_STAR_IP = "http://127.0.0.1:8795/v2";


exports.BIO_STAR_MACHINE_ID = "542352209";


exports.fingerPrintBody = { enroll_quality: 0, retrieve_raw_image: true };