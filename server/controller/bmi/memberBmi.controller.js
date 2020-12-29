/**
 * utils
*/

const { logger: { logger }, handler: { successResponseHandler, errorResponseHandler } } = require('../../../config')
const { Formate: { setTime } } = require('../../utils')


/**
 * models.
*/


const { MemberBmi } = require('../../model');




exports.getMemberWeights = async (req, res) => {
    MemberBmi.find({ memberId: req.body.memberId, date: { $gte: setTime(req.body.from), $lte: setTime(req.body.to) } })
        .then(response => {
            successResponseHandler(res, response, "successfully get member attendance !");
        }).catch(error => {
            logger.error(error);
            errorResponseHandler(res, error, "Exception while adding attendance !");
        });
};



exports.addMemberWeight = async (req, res) => {
    let isExists = await MemberBmi.findOne({ date: setTime(req.body.date), memberId: req.body.memberId }).lean()
    if (isExists) {
        req.body["date"] = setTime(req.body.date)
        let response = await MemberBmi.findByIdAndUpdate(isExists._id, req.body, { new: true })
        successResponseHandler(res, response, "successfully added member weight")
    } else {
        let newMemberWeightData = new MemberBmi(req.body);
        newMemberWeightData["date"] = setTime(req.body.date)
        newMemberWeightData.save()
            .then(response => {
                successResponseHandler(res, response, "successfully added member weight !");
            }).catch(error => {
                logger.error(error);
                errorResponseHandler(res, error, "Exception while added member weight !");
            });
    }
};