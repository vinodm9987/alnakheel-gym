/**
 * utils.
*/

const { logger: { logger }, handler: { successResponseHandler, errorResponseHandler } } = require('../../../config')
const { Formate: { setTime } } = require('../../utils');
const { newDietPlan } = require('../../notification/helper')

/**
 * models.
*/

const { MemberDiet } = require('../../model');



/**
 * get all  MemberDiet
*/


exports.getMemberDietByMemberId = (req, res) => {
    MemberDiet.findOne({ member: req.body.member })
        .then(response => {
            successResponseHandler(res, response, "successfully get all  MemberDiet !!");
        }).catch(error => {
            logger.error(error);
            errorResponseHandler(res, error, "Exception while getting all  MemberDiet !");
        });
};




/**
 * get  MemberDiet by id
*/


exports.getMemberDietById = (req, res) => {
    MemberDiet.findById(req.params.id).populate('dietPlan.foodItem dietPlanSession')
        .then(response => {
            successResponseHandler(res, response, "successfully get  MemberDiet by id !!");
        }).catch(error => {
            logger.error(error);
            errorResponseHandler(res, error, "Exception while getting  MemberDiet by id !");
        });
};



/**
 *  create new Member Workout 
*/


exports.addMemberDiet = async (req, res) => {
    try {
        const data = req.body.map(doc => { doc.dateOfDiet = setTime(doc.dateOfDiet); return doc });
        let response;
        for (let i = 0; i < data.length; i++) {
            const { member, dateOfDiet, dietPlanSession } = data[i];
            response = await MemberDiet.findOneAndUpdate({ member, dateOfDiet, dietPlanSession }, data[i], { upsert: true });
        }
        await newDietPlan(req.body[0].member);
        return successResponseHandler(res, response, "successfully added new MemberDiet !!");
    } catch (error) {
        logger.error(error);
        if (error.message.indexOf('duplicate key error') !== -1)
            return errorResponseHandler(res, error, "WorkoutLevel name is already exist !");
        else
            return errorResponseHandler(res, error, "Exception occurred !");
    }
};




exports.updateMemberDietById = (req, res) => {
    req.body.dateOfDiet = setTime(req.body.dateOfDiet)
    MemberDiet.findByIdAndUpdate(req.params.id, req.body)
        .then(response => {
            successResponseHandler(res, response, "successfully update  MemberDiet by id !!");
        }).catch(error => {
            logger.error(error);
            errorResponseHandler(res, error, "Exception while updating  MemberDiet by id !");
        });
};



exports.getMemberDietByDate = (req, res) => {
    let queryCond = {}
    let query = req.body
    if (query.member) queryCond["member"] = query.member
    if (query.dateOfDiet) queryCond["dateOfDiet"] = setTime(query.dateOfDiet)
    if (query.dietPlanSession) queryCond["dietPlanSession"] = query.dietPlanSession

    MemberDiet.find(queryCond)
        .populate('dietPlan.foodItem dietPlanSession')
        .then(response => {
            successResponseHandler(res, response, "successfully get  MemberDiet by date !!");
        }).catch(error => {
            logger.error(error);
            errorResponseHandler(res, error, "Exception while getting  MemberDiet by date !");
        });
};