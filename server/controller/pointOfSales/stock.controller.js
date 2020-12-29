/**  
 * utils.
*/

const { logger: { logger }, upload: { uploadAvatar }, handler: { successResponseHandler, errorResponseHandler } } = require('../../../config')

/**
 * models.
*/

const { Stocks } = require('../../model');


/**
 * get all Stocks
*/




exports.getAllStocksForAdmin = async (req, res) => {
    try {
        const response = await Stocks.find({}).populate('branch supplierName');
        const search = req.body.search.toLowerCase()
        let newResponse = response.filter(doc => {
            if (search) {
                let temp = doc.itemName.toLowerCase()
                if (temp.includes(search)) return doc
            } else {
                return doc
            }
        })
        return successResponseHandler(res, newResponse, 'successfully ')
    } catch (error) {
        logger.error(error);
        return errorResponseHandler(res, error, 'failed to  !')
    }
}



/**
 * get all active Stocks
*/


exports.getAllStocks = async (req, res) => {
    try {
        let search = ''
        let queryCond = {}
        queryCond["status"] = true;
        queryCond["quantity"] = { $gt: 0 }
        queryCond["expiryDate"] = { $gte: new Date() }
        if (req.body.branch) {
            queryCond["branch"] = req.body.branch
        }
        if (req.body && req.body.search) {
            search = req.body.search.toLowerCase()
        }
        let response = await Stocks.find(queryCond).populate('branch offerDetails.offerDetails supplierName vat').lean()
        let newResponse = response.filter(doc => {
            if (search) {
                let temp = doc.itemName.toLowerCase()
                if (temp.includes(search)) return doc
            } else {
                return doc
            }
        })
        successResponseHandler(res, newResponse, "successfully get all active Stocks !!");
    } catch (error) {
        logger.error(error);
        errorResponseHandler(res, error, "Exception while getting all active Stocks !");
    }
};



/**
 * get all active Stocks
*/


exports.getStocksById = (req, res) => {
    Stocks.findById(req.params.id).populate('branch offerDetails.offerDetails supplierName vat')
        .then(response => {
            return successResponseHandler(res, response, "successfully get  Stocks by id !!");
        }).catch(error => {
            logger.error(error);
            return errorResponseHandler(res, error, "Exception while getting  Stocks by id !");
        });
};




/**
 *  create new Stocks 
*/


exports.addStocks = (req, res) => {
    uploadAvatar(req, res, async (error, result) => {
        if (error)
            return errorResponseHandler(res, error, "while uploading image error occurred !");
        try {
            let data = JSON.parse(req.body.data)
            let newStocks = new Stocks(data);
            newStocks["image"] = req.files[0]
            newStocks["originalQuantity"] = data["quantity"];
            let response = await newStocks.save()
            let newResponse = await Stocks.findById(response._id).populate('branch supplierName')
            return successResponseHandler(res, newResponse, "successfully added new stock !")
        } catch (error) {
            logger.error(error);
            if (error.message.indexOf('duplicate key error') !== -1)
                return errorResponseHandler(res, error, "Stocks name is already exist !");
            else
                return errorResponseHandler(res, error, "Exception occurred !");
        }
    });
};





/**
 *  update Stocks 
*/


exports.updateStocks = (req, res) => {
    uploadAvatar(req, res, async (error, result) => {
        if (error) return errorResponseHandler(res, error, "while uploading image error occurred !");
        let data = JSON.parse(req.body.data)
        if (req.files.length !== 0) { data["image"] = req.files[0] }
        let { quantity, originalQuantity } = await Stocks.findById(req.params.id).lean()
        if (data.quantity === 0 || data.quantity) data["originalQuantity"] = data.quantity - quantity + originalQuantity;
        Stocks.findByIdAndUpdate(req.params.id, data, { new: true }).populate('branch supplierName')
            .then(response => {
                return successResponseHandler(res, response, "successfully updated Stocks !!");
            }).catch(error => {
                logger.error(error);
                if (error.message.indexOf('duplicate key error') !== -1)
                    return errorResponseHandler(res, error, "Stocks name is already exist !");
                else
                    return errorResponseHandler(res, error, "Exception occurred !");
            });
    });
};



/**
 *  update Stock Status
*/


exports.updateStockStatus = (req, res) => {
    Stocks.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('branch supplierName')
        .then(response => {
            return successResponseHandler(res, response, "successfully updated Stocks !!");
        }).catch(error => {
            logger.error(error);
            if (error.message.indexOf('duplicate key error') !== -1)
                return errorResponseHandler(res, error, "Stocks name is already exist !");
            else
                return errorResponseHandler(res, error, "Exception occurred !");
        });
};