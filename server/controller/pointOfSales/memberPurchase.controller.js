/**  
 * utils.
*/
const { Formate: { setTime } } = require('../../utils');

const { logger: { logger }, handler: { successResponseHandler, errorResponseHandler } } = require('../../../config')

/**
 * models.
*/

const { MemberCart } = require('../../model');
const { auditLogger } = require('../../middleware/auditlog.middleware');




/**
 * add to cart for member
*/


exports.addToCart = async (req, res) => {
    try {
        req.body["dateOfCart"] = setTime(req.body.dateOfCart);
        let newStocks = new MemberCart(req.body);
        let response = await newStocks.save();
        let newResponse = await MemberCart.findById(response._id).populate('stockId')
            .populate({ path: 'stockId', populate: { path: 'offerDetails.offerDetails vat' } })
        auditLogger(req, 'Success')
        return successResponseHandler(res, newResponse, "successfully added to cart !")
    } catch (error) {
        logger.error(error);
        auditLogger(req, 'Failed')
        return errorResponseHandler(res, error, "Exception occurred !");
    }
};



/**
 * remove cart for member either single by Id or multiple
*/

exports.removeCart = async (req, res) => {
    try {
        let queryCond = {}
        let response = null
        if (req.body.cartId) {
            queryCond["_id"] = req.body.cartId
            response = await MemberCart.findOneAndDelete(queryCond)
        } else if (req.body.member && req.body.stockId) {
            queryCond["stockId"] = req.body.stockId
            queryCond["member"] = req.body.member
            response = await MemberCart.deleteMany(queryCond)
        }
        auditLogger(req, 'Success')
        return successResponseHandler(res, response, "successfully remove cart !")
    } catch (error) {
        logger.error(error);
        auditLogger(req, 'Failed')
        return errorResponseHandler(res, error, "Exception occurred !");
    }
};



/**
 * update cart for member
*/

exports.updateCart = async (req, res) => {
    req.responseData = await MemberCart.findById(req.params.id).lean()
    MemberCart.findByIdAndUpdate(req.params.id, { $inc: { addedQuantity: req.body.addedQuantity } }, { new: true }).populate('stockId')
        .populate({ path: 'stockId', populate: { path: 'offerDetails.offerDetails vat' } })
        .then(response => {
            auditLogger(req, 'Success')
            return successResponseHandler(res, response, "successfully update cart !")
        }).catch(error => {
            logger.error(error);
            auditLogger(req, 'Failed')
            return errorResponseHandler(res, error, "Exception occurred !");
        });
};


/**
 * update cart for member from shopping item
*/

exports.updateCartQuantity = async (req, res) => {
    req.responseData = await MemberCart.findById(req.params.id).lean()
    MemberCart.findByIdAndUpdate(req.params.id, { addedQuantity: req.body.addedQuantity }, { new: true }).populate('stockId')
        .populate({ path: 'stockId', populate: { path: 'offerDetails.offerDetails' } })
        .then(response => {
            auditLogger(req, 'Success')
            return successResponseHandler(res, response, "successfully update cart !")
        }).catch(error => {
            logger.error(error);
            auditLogger(req, 'Failed')
            return errorResponseHandler(res, error, "Exception occurred !");
        });
};



/**
 * get cart of member
*/

exports.getCartOfMember = (req, res) => {
    MemberCart.find({ member: req.params.id }).populate('stockId')
        .populate({ path: 'stockId', populate: { path: 'offerDetails.offerDetails vat' } })
        .then(response => {
            return successResponseHandler(res, response, "successfully get cart of member !")
        }).catch(error => {
            logger.error(error);
            return errorResponseHandler(res, error, "Exception occurred !");
        });
};



