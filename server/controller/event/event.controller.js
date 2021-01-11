/**  
 * utils.
*/

const { logger: { logger }, handler: { successResponseHandler, errorResponseHandler } } = require('../../../config')
const { Formate: { setTime } } = require('../../utils')
const { eventNotification } = require('../../notification/helper')

/**
 * models.
*/

const { Event } = require('../../model');
const { auditLogger } = require('../../middleware/auditlog.middleware');




/**
 *****  Event controller  *****
*/


exports.addEvent = (req, res) => {
    req.body["startDate"] = setTime(req.body.startDate);
    req.body["endDate"] = setTime(req.body.endDate);
    const newEvent = new Event(req.body);
    newEvent.save()
        .then(async (response) => {
            auditLogger(req, 'Success')
            successResponseHandler(res, response, "successfully add new Event");
            await eventNotification();
        }).catch(error => {
            logger.error(error);
            auditLogger(req, 'Failed')
            errorResponseHandler(res, error, "error ocurred while creating new Event");
        });
};






exports.updateEvent = async (req, res) => {
    const { startDate, endDate } = req.body
    if (startDate) req.body["startDate"] = setTime(req.body.startDate);
    if (endDate) req.body["endDate"] = setTime(req.body.endDate);
    req.responseData = await Event.findById(req.params.id).lean()
    Event.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then((response) => {
            auditLogger(req, 'Success')
            successResponseHandler(res, response, "successfully update Event");
        }).catch(error => {
            logger.error(error);
            auditLogger(req, 'Failed')
            errorResponseHandler(res, error, "error ocurred while update Event");
        });
};




exports.getAllEventForAdmin = (req, res) => {
    Event.find({}).then((response) => {
        successResponseHandler(res, response, "successfully get all Event");
    }).catch(error => {
        logger.error(error);
        errorResponseHandler(res, error, "error ocurred getting all Event");
    });
};





exports.getAllEvent = (req, res) => {
    Event.find({ status: true }).then((response) => {
        successResponseHandler(res, response, "successfully get all Event");
    }).catch(error => {
        logger.error(error);
        errorResponseHandler(res, error, "error ocurred getting all Event");
    });
};





exports.getEventById = (req, res) => {
    Event.findById(req.params.id)
        .then((response) => {
            successResponseHandler(res, response, "successfully get  Event by id");
        }).catch(error => {
            logger.error(error);
            errorResponseHandler(res, error, "error ocurred getting  Event by id");
        });
};





exports.getEventsByDate = async (req, res) => {
    try {
        let response = await Event.find({}).lean()
        if (req.body.date) {
            let date = setTime(new Date(req.body.date))
            response = response.filter(doc => {
                if (setTime(doc.startDate) <= date && setTime(doc.endDate) >= date) {
                    return doc
                }
            })
            return successResponseHandler(res, response, "successfully get all Event !!");
        } else if (req.body.month) {
            let date = setTime(new Date(req.body.month))
            response = response.filter(doc => {
                if ((doc.startDate.getMonth() === new Date(date).getMonth() && doc.startDate.getFullYear() === new Date(date).getFullYear()) ||
                    (doc.endDate.getMonth() === new Date(date).getMonth() && doc.endDate.getFullYear() === new Date(date).getFullYear())) {
                    return doc
                }
            })
            return successResponseHandler(res, response, "successfully get all Event !!");
        } else {
            return successResponseHandler(res, response, "successfully get all Event !!");
        }
    } catch (error) {
        logger.error(error);
        errorResponseHandler(res, error, "Exception while getting all Event !");
    }
}

