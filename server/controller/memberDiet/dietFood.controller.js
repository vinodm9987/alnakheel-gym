/**  
 * utils.
*/

const { logger: { logger }, handler: { successResponseHandler, errorResponseHandler } } = require('../../../config')

/**
 * models.
*/

const { DietFood } = require('../../model');


/**
 * get all DietFood
*/


exports.getAllDietFoodForAdmin = (req, res) => {
    DietFood.find({})
        .then(response => {
            successResponseHandler(res, response, "successfully get all DietFood !!");
        }).catch(error => {
            logger.error(error);
            errorResponseHandler(res, error, "Exception while getting all DietFood !");
        });
};





/**
 * get all active DietFood
*/


exports.getAllDietFood = (req, res) => {
    DietFood.find({ status: true })
        .then(response => {
            successResponseHandler(res, response, "successfully get all active DietFood !!");
        }).catch(error => {
            logger.error(error);
            errorResponseHandler(res, error, "Exception while getting all active DietFood !");
        });
};



/**
 * get all active DietFood
*/


exports.getDietFoodById = (req, res) => {
    DietFood.findById(req.params.id)
        .then(response => {
            successResponseHandler(res, response, "successfully get  DietFood by id !!");
        }).catch(error => {
            logger.error(error);
            errorResponseHandler(res, error, "Exception while getting  DietFood by id !");
        });
};




/**
 *  create new DietFood 
*/


exports.addDietFood = (req, res) => {
    let newDietFood = new DietFood(req.body);
    newDietFood.save().then(response => {
        return successResponseHandler(res, response, "successfully added new DietFood !!");
    }).catch(error => {
        logger.error(error);
        if (error.message.indexOf('duplicate key error') !== -1)
            return errorResponseHandler(res, error, "DietFood name is already exist !");
        else
            return errorResponseHandler(res, error, "Exception occurred !");
    });
};





/**
 *  update DietFood 
*/


exports.updateDietFood = (req, res) => {
    DietFood.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(response => {
            return successResponseHandler(res, response, "successfully updated DietFood !!");
        }).catch(error => {
            logger.error(error);
            if (error.message.indexOf('duplicate key error') !== -1)
                return errorResponseHandler(res, error, "DietFood name is already exist !");
            else
                return errorResponseHandler(res, error, "Exception occurred !");
        });
};

