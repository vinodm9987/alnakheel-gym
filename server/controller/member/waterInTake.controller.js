
const { logger: { logger }, handler: { successResponseHandler, errorResponseHandler } } = require('../../../config')
const { Formate: { setTime } } = require('../../utils')



/**  
 * models.
*/


const { WaterInTake } = require('../../model');
const { auditLogger } = require('../../middleware/auditlog.middleware');




exports.addWaterInTake = async (req, res) => {
    let isExists = await WaterInTake.findOne({ memberId: req.body.memberId, date: setTime(req.body.date) });
    let record = { date: req.body.date, consume: req.body.consume }
    if (isExists) {
        if (+req.body.consume + +isExists.consume > +isExists.target) {
            auditLogger(req, 'Failed')
            errorResponseHandler(res, 'error', 'you already drink sufficient water !')
        } else {
            let response = await WaterInTake.findByIdAndUpdate(isExists._id, { consume: +req.body.consume + +isExists.consume, $push: { record: record } }, { new: true }).lean()
            auditLogger(req, 'Success')
            successResponseHandler(res, response, 'successfully added water consumption')
        }
    } else {
        let newRecord = new WaterInTake(req.body);
        newRecord["record"] = record
        newRecord["date"] = setTime(req.body.date)
        newRecord.save().then(response => {
            auditLogger(req, 'Success')
            successResponseHandler(res, response, 'successfully added water consumption')
        }).catch(error => {
            logger.error(error);
            auditLogger(req, 'Failed')
            errorResponseHandler(res, error, 'Something went wrong !')
        })
    }
};




exports.getMemberWaterInTake = async (req, res) => {
    WaterInTake.find({ memberId: req.body.memberId, date: { $gte: setTime(req.body.from), $lte: setTime(req.body.to) } })
        .then(response => {
            successResponseHandler(res, response, "successfully get water in take !");
        }).catch(error => {
            logger.error(error);
            errorResponseHandler(res, error, "Exception while water in take !");
        });
};



exports.updateMemberWaterInTake = (req, res) => {
    WaterInTake.findOneAndUpdate({ memberId: req.body.memberId, date: setTime(req.body.date) }, { target: req.body.target })
        .then((response) => {
            auditLogger(req, 'Success')
            return successResponseHandler(res, response, 'successfully updated  water in take')
        }).catch(error => {
            logger.error(error);
            auditLogger(req, 'Failed')
            return errorResponseHandler(res, error, 'Something went wrong !')
        })
};
