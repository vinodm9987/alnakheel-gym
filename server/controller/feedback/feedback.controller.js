/**  
 * utils.
*/

const { logger: { logger }, handler: { successResponseHandler, errorResponseHandler } } = require('../../../config')
const { Formate: { setTime } } = require('../../utils')
const { newFeedbackAdmin, feedbackReply } = require('../../notification/helper')

/**
 * models.
*/


const { Feedback } = require('../../model');





/**
 ******** feedback controller ********
*/




exports.addFeedback = (req, res) => {
    req.body["date"] = setTime(new Date());
    req.body["time"] = new Date();
    let newFeedback = new Feedback(req.body);
    newFeedback.save().then(async (response) => {
        await newFeedbackAdmin();
        successResponseHandler(res, response, "successfully added new feedback !");
    }).catch((error) => {
        logger.error(error);
        return errorResponseHandler(res, error, "Exception while adding new feedback!");
    })
};



exports.getMemberFeedback = (req, res) => {
    Feedback.find({ member: req.body.member })
        .then((response) => {
            successResponseHandler(res, response, "successfully get member feedback !")
        }).catch((error) => {
            logger.error(error);
            return errorResponseHandler(res, error, "Exception while getting member feedback!");
        });
};


exports.getFeedbackById = (req, res) => {
    Feedback.findById(req.params.id)
        .then((response) => {
            successResponseHandler(res, response, "successfully get feedback by id !")
        }).catch((error) => {
            logger.error(error);
            return errorResponseHandler(res, error, "Exception while getting feedback by id!");
        });
};



exports.updateFeedback = (req, res) => {
    Feedback.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('member')
        .populate({ path: "member", populate: { path: "credentialId" } })
        .then(async (response) => {
            await feedbackReply(response.member);
            successResponseHandler(res, response, "successfully update feedback !")
        }).catch((error) => {
            logger.error(error);
            return errorResponseHandler(res, error, "Exception while update feedback !");
        });
};


exports.getFeedbackList = async (req, res) => {
    try {
        const { branch, date, mode, type, search } = req.body;
        let queryCond = {}
        let complaint = { pending: 0, completed: 0 }
        let suggestion = { pending: 0, completed: 0 }
        if (branch && branch !== 'all') queryCond["branch"] = branch;
        if (mode && mode !== 'all') queryCond["mode"] = mode;
        if (type && type !== 'all') queryCond["optionType"] = type;
        if (date) queryCond["date"] = setTime(date);
        const response = await Feedback.find(queryCond).populate('member')
            .populate({ path: "member", populate: { path: "credentialId" } }).lean();
        const newResponse = response.filter(doc => {
            if (doc.optionType === "Suggestions") { doc.status === "Pending" ? suggestion.pending++ : suggestion.completed++ }
            if (doc.optionType === "Complaints") { doc.status === "Pending" ? complaint.pending++ : complaint.completed++ }
            if (search) {
                let Search = search.toLowerCase();
                let temp1 = doc.member.credentialId.userName.toLowerCase()
                let temp2 = doc.member.memberId.toString();
                let temp3 = doc.description;
                if (temp1.includes(Search) || temp2.includes(Search) || temp3.includes(Search)) return doc
            } else {
                return doc;
            }
        });
        return successResponseHandler(res, { newResponse, complaint, suggestion }, 'successfully get feedback !');
    } catch (error) {
        logger.error(error);
        return errorResponseHandler(res, error, "Exception while getting feedback !");
    }
};






