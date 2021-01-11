
const { logger: { logger }, handler: { successResponseHandler, errorResponseHandler } } = require('../../../config');
const { Formate: { setTime } } = require('../../utils');



/**  
 * models.
*/


const { MemberReminder } = require('../../model');
const { auditLogger } = require('../../middleware/auditlog.middleware');




exports.addMemberReminder = async (req, res) => {
    req.body["date"] = setTime(req.body.date)
    let isExists = await MemberReminder.findOne({ memberId: req.body.memberId, date: req.body.date }).lean();
    if (isExists) {
        req.responseData = await MemberReminder.findById(isExists._id).lean()
        MemberReminder.findByIdAndUpdate(isExists._id, req.body, { new: true })
            .then(response => {
                auditLogger(req, 'Success')
                successResponseHandler(res, response, 'successfully added reminder')
            }).catch(error => {
                logger.error(error);
                auditLogger(req, 'Failed')
                errorResponseHandler(res, error, 'Something went wrong !')
            });
    } else {
        let newReminder = new MemberReminder(req.body);
        newReminder.save().then((response) => {
            auditLogger(req, 'Success')
            successResponseHandler(res, response, 'successfully added reminder')
        }).catch(error => {
            logger.error(error);
            auditLogger(req, 'Failed')
            errorResponseHandler(res, error, 'Something went wrong !')
        })
    }
};


exports.getMemberReminderByDate = (req, res) => {
    MemberReminder.find({ memberId: req.body.memberId, date: setTime(req.body.date) })
        .then((response) => {
            successResponseHandler(res, response, 'successfully added reminder')
        }).catch(error => {
            logger.error(error);
            errorResponseHandler(res, error, 'Something went wrong !')
        })
};