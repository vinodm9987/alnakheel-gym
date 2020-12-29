/**  
 * utils.
*/

const { logger: { logger }, handler: { successResponseHandler, errorResponseHandler } } = require('../../../config')

/**
 * models.
*/

const { Vat } = require('../../model');




/**
 *****  Vat controller  *****
*/


exports.addVat = async (req, res) => {
    try {
        let newVat = new Vat(req.body);
        let response = await newVat.save();
        let newResponse = await Vat.findById(response._id).populate('branch')
        return successResponseHandler(res, newResponse, "successfully added new Vat !!");
    } catch (error) {
        logger.error(error);
        if (error.message.indexOf('duplicate key error') !== -1)
            return errorResponseHandler(res, error, "Vat name and value is already exist !");
        else
            return errorResponseHandler(res, error, "Exception occurred !");
    }
};






exports.updateVat = async (req, res) => {
    Vat.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('branch')
        .then(response => {
            return successResponseHandler(res, response, "successfully updated Vat !!");
        }).catch(error => {
            logger.error(error);
            if (error.message.indexOf('duplicate key error') !== -1)
                return errorResponseHandler(res, error, "Vat name and value is already exist !");
            else
                return errorResponseHandler(res, error, "Exception occurred !");
        });
};



exports.updateDefaultVat = async (req, res) => {
    try {
        const updatedVat = await Vat.findByIdAndUpdate(req.params.id, { defaultVat: true }, { new: true })
        await Vat.updateMany({ _id: { $ne: req.params.id }, branch: updatedVat.branch }, { defaultVat: false })
        const response = await Vat.find({}).populate('branch')
        return successResponseHandler(res, response, "successfully updated Vat !!");
    } catch (error) {
        logger.error(error);
        if (error.message.indexOf('duplicate key error') !== -1)
            return errorResponseHandler(res, error, "Vat name and value is already exist !");
        else
            return errorResponseHandler(res, error, "Exception occurred !");
    }
};




exports.getAllVatForAdmin = (req, res) => {
    Vat.find({})
        .populate('branch')
        .then((response) => {
            successResponseHandler(res, response, "successfully get all Vat");
        }).catch(error => {
            logger.error(error);
            errorResponseHandler(res, error, "error ocurred getting all Vat");
        });
};


exports.getAllVat = (req, res) => {
    Vat.find({ status: true, branch: req.body.branch }).then((response) => {
        successResponseHandler(res, response, "successfully get all Vat");
    }).catch(error => {
        logger.error(error);
        errorResponseHandler(res, error, "error ocurred getting all Vat");
    });
};





exports.getDefaultVat = (req, res) => {
    Vat.find({ branch: req.body.branch, status: true, defaultVat: true }).then((response) => {
        successResponseHandler(res, response, "successfully get defaultVat ");
    }).catch(error => {
        logger.error(error);
        errorResponseHandler(res, error, "error ocurred getting defaultVat");
    });
};



