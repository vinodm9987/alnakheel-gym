/**  
 * utils.
*/

const { logger: { logger }, handler: { successResponseHandler, errorResponseHandler } } = require('../../../config');
const { Formate: { setTime } } = require('../../utils');
const { announcementNotification } = require('../../notification/helper')

/**
 * models.
*/

const { Announcement } = require('../../model');
const { auditLogger } = require('../../middleware/auditlog.middleware');




/**
 *****  Announcement controller  *****
*/


exports.addAnnouncement = (req, res) => {
    req.body["startDate"] = setTime(req.body.startDate);
    req.body["endDate"] = setTime(req.body.endDate);
    const newAnnouncement = new Announcement(req.body);
    newAnnouncement.save()
        .then(async (response) => {
            auditLogger(req, 'Success')
            successResponseHandler(res, response, "successfully add new announcement");
            await announcementNotification();
        }).catch(error => {
            logger.error(error);
            auditLogger(req, 'Failed')
            errorResponseHandler(res, error, "error ocurred while creating new announcement");
        });
};






exports.updateAnnouncement = async (req, res) => {
    const { startDate, endDate } = req.body
    if (startDate) req.body["startDate"] = setTime(req.body.startDate);
    if (endDate) req.body["endDate"] = setTime(req.body.endDate);
    req.responseData = await Announcement.findById(req.params.id).lean()
    Announcement.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then((response) => {
            auditLogger(req, 'Success')
            successResponseHandler(res, response, "successfully update Announcement");
        }).catch(error => {
            logger.error(error);
            auditLogger(req, 'Failed')
            errorResponseHandler(res, error, "error ocurred while update Announcement");
        });
};




exports.getAllAnnouncementForAdmin = async (req, res) => {
    try {
        let response = await Announcement.find({}).lean();
        let newResponse = response.filter(doc => {
            if (req.body.search) {
                let search = req.body.search.toLowerCase()
                let temp1 = doc.title.toLowerCase();
                let temp2 = doc.description.toLowerCase();
                if (temp1.includes(search) ||
                    temp2.includes(search)) {
                    return doc;
                }
            } else {
                return doc;
            }
        });
        successResponseHandler(res, newResponse, "successfully get all Announcement");
    } catch (error) {
        logger.error(error);
        errorResponseHandler(res, error, "Exception while get all Announcement !");
    }
};





exports.getAllAnnouncement = async (req, res) => {
    try {
        let queryCond = { endDate: { $gte: setTime(new Date()) } }
        queryCond["status"] = true
        let response = await Announcement.find(queryCond).sort({ created_at: -1 }).lean();
        let newResponse = response.filter(doc => {
            if (req.body.search) {
                let search = req.body.search.toLowerCase()
                let temp1 = doc.title.toLowerCase();
                let temp2 = doc.description.toLowerCase();
                if (temp1.includes(search) ||
                    temp2.includes(search)) {
                    return doc;
                }
            } else {
                return doc;
            }
        });
        successResponseHandler(res, newResponse, "successfully get all Announcement");
    } catch (error) {
        logger.error(error);
        errorResponseHandler(res, error, "Exception while get all Announcement !");
    }
};





exports.getAnnouncementById = (req, res) => {
    Announcement.findById(req.params.id)
        .then((response) => {
            successResponseHandler(res, response, "successfully get  Announcement details");
        }).catch(error => {
            logger.error(error);
            errorResponseHandler(res, error, "error ocurred getting  Announcement by id");
        });
};



exports.addMemberRead = async (req, res) => {
    const isExist = await Announcement.findOne({ _id: req.body.id, 'members.user': req.body.user }).lean();
    if (isExist) return successResponseHandler(res, isExist, "successfully added read");
    Announcement.findByIdAndUpdate(req.body.id, { $push: { users: { user: req.body.user, read: true } } })
        .then(response => {
            return successResponseHandler(res, response, "successfully added read !");
        }).catch(error => {
            logger.error(error);
            return errorResponseHandler(res, error, "failed to add read !");
        })
};


