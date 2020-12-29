/**  
 * utils.
*/

const { logger: { logger }, handler: { successResponseHandler, errorResponseHandler } } = require('../../../config')
const { Formate: { setTime }, Referral: { addPointOfPolicy, checkExpiryOfPolicy, completeGiftRedeem }, IdGenerator: { generateOrderId } } = require('../../utils')
const { stockQuantity, stockFinish } = require('../../notification/helper');


/**
 * models.
*/

const { StockSell, MemberPurchase, Stocks } = require('../../model');


/**
 * get all StockSell
*/


exports.getAllStockSell = (req, res) => {
    StockSell.find({})
        .then(response => {
            successResponseHandler(res, response, "successfully get all StockSell !!");
        }).catch(error => {
            logger.error(error);
            errorResponseHandler(res, error, "Exception while getting all StockSell !");
        });
};







/**
 * get all active StockSell
*/


exports.getStockSellById = (req, res) => {
    StockSell.findById(req.params.id).populate('purchaseStock.stockId')
        .then(response => {
            successResponseHandler(res, response, "successfully get  StockSell by id !!");
        }).catch(error => {
            logger.error(error);
            errorResponseHandler(res, error, "Exception while getting  StockSell by id !");
        });
};




/**
 *  create new StockSell 
*/


exports.addStockSell = async (req, res) => {
    let stocks = req.body.purchaseStock
    if (req.headers.userid) {
        req.body["doneBy"] = req.headers.userid
    }
    req.body["orderNo"] = generateOrderId()
    if (req.body.customerDetails.typeOfCustomer === "Member") {
        let obj = {}
        let transactionId;
        obj["dateOfPurchase"] = setTime(new Date())
        obj["timeOfPurchase"] = new Date()
        obj["purchaseStock"] = req.body.purchaseStock
        obj["paymentType"] = "POS"
        if (req.body.memberTransactionId) transactionId = req.body.memberTransactionId;
        let newMemberPurchase = new MemberPurchase(obj)
        await newMemberPurchase.save()
        req.body["paymentType"] = "POS"
        let newStockSell = new StockSell(req.body);
        newStockSell["dateOfPurchase"] = setTime(new Date())
        newStockSell.save().then(async response => {
            for (let i = 0; i < stocks.length; i++) {
                // notification logics
                const stock = await Stocks.findByIdAndUpdate(stocks[i].stockId, { $inc: { quantity: -stocks[i].quantity, noOfTimeSell: 1 } }, { new: true })
                    .populate('branch').lean();
                if (+stock.quantity === Math.round(+stock.originalQuantity / 100 * 90)) { await stockQuantity(stock.itemName, stock.branch.branchName) }
                if (+stock.quantity === 0) { await stockFinish(stock.itemName, stock.branch.branchName) }
            }
            // policy logics
            const policy = await checkExpiryOfPolicy();
            if (transactionId) await completeGiftRedeem(transactionId);
            if (policy) await addPointOfPolicy(req.body.totalAmount, req.body.customerDetails.member);
            return successResponseHandler(res, response, "successfully added new StockSell !!");
        }).catch(error => {
            logger.error(error);
            return errorResponseHandler(res, error, "Exception occurred !");
        });
    } else {
        req.body["paymentType"] = "POS"
        let newStockSell = new StockSell(req.body);
        newStockSell["dateOfPurchase"] = setTime(new Date())
        newStockSell.save().then(async response => {
            for (let i = 0; i < stocks.length; i++) {
                await Stocks.findByIdAndUpdate(stocks[i].stockId, { $inc: { quantity: -stocks[i].quantity, noOfTimeSell: 1 } })
            }
            return successResponseHandler(res, response, "successfully added new StockSell !!");
        }).catch(error => {
            logger.error(error);
            return errorResponseHandler(res, error, "Exception occurred !");
        });
    }
};





/**
 *  update StockSell 
*/


exports.updateStockSell = (req, res) => {
    StockSell.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then(response => {
            return successResponseHandler(res, response, "successfully updated StockSell !!");
        }).catch(error => {
            logger.error(error);
            return errorResponseHandler(res, error, "Exception occurred !");
        });
};




/**
 *  get order history 
*/

exports.getOrderHistory = async (req, res) => {
    try {
        let search = ''
        let queryCond = {}
        if (req.body.mode) {
            queryCond["paymentType"] = req.body.mode
        }
        if (req.body && req.body.search) {
            search = req.body.search.toLowerCase()
        }
        let response = await StockSell.find(queryCond)
            .populate('branch doneBy')
            .populate('purchaseStock.stockId')
            .populate({ path: "customerDetails.member", populate: { path: "credentialId" } }).lean()
        let newResponse = response.filter(doc => {
            if (search) {
                let temp = doc.customerDetails.member ? doc.customerDetails.member.credentialId.userName.toLowerCase() : 'general'
                let temp1 = doc.customerDetails.member ? doc.customerDetails.member.credentialId.email.toLowerCase() : 'na'
                if (temp.includes(search) || temp1.includes(search)) return doc
            } else {
                return doc
            }
        })
        successResponseHandler(res, newResponse, "successfully get order history !!");
    } catch (error) {
        logger.error(error);
        errorResponseHandler(res, error, "Exception while getting order history !");
    }
}



exports.getCustomerOrderHistory = async (req, res) => {
    try {
        let search = ''
        let queryCond = {}
        queryCond["customerDetails.member"] = req.body.memberId
        if (req.body.mode) {
            queryCond["paymentType"] = req.body.mode
        }
        if (req.body && req.body.search) {
            search = req.body.search.toLowerCase()
        }
        let response = await StockSell.find(queryCond)
            .populate('branch doneBy')
            .populate('purchaseStock.stockId')
            .populate({ path: "customerDetails.member", populate: { path: "credentialId" } }).lean()
        let newResponse = response.filter(doc => {
            if (search) {
                let temp = doc.customerDetails.member ? doc.customerDetails.member.credentialId.userName.toLowerCase() : 'general'
                let temp1 = doc.customerDetails.member ? doc.customerDetails.member.credentialId.email.toLowerCase() : 'na'
                if (temp.includes(search) || temp1.includes(search)) return doc
            } else {
                return doc
            }
        })
        successResponseHandler(res, newResponse, "successfully get order history !!");
    } catch (error) {
        logger.error(error);
        errorResponseHandler(res, error, "Exception while getting order history !");
    }
}