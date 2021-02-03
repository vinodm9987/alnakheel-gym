/**
 * utils.
*/

const { logger: { logger }, upload: { uploadAvatar }, handler: { successResponseHandler, errorResponseHandler } } = require('../../../config');

const { Formate: { setTime } } = require('../../utils')

/**
 * models.
*/

const { Package, Period } = require('../../model');
const { auditLogger } = require('../../middleware/auditlog.middleware');
const { addPackage, updatePackage } = require('../../biostar');





/**
 * get all packages
*/


exports.getAllPackage = (req, res) => {
    Package.find({})
        .populate('period accessBranches salesBranches')
        .then(response => {
            successResponseHandler(res, response, "successfully get all packages !!");
        }).catch(error => {
            logger.error(error);
            errorResponseHandler(res, error, "Exception while getting all packages !");
        });
};






/**
 * get all active packages
*/


exports.getAllActivePackage = (req, res) => {
    Package.find({ endDate: { $gte: setTime(new Date()) } })
        .populate('period accessBranches salesBranches')
        .then(response => {
            successResponseHandler(res, response, "successfully get all active packages !!");
        }).catch(error => {
            logger.error(error);
            errorResponseHandler(res, error, "Exception while getting all active packages !");
        });
};




/**
 * get  packages by id
*/


exports.getPackageById = (req, res) => {
    Package.findById(req.params.id)
        .populate('period accessBranches salesBranches')
        .then(response => {
            successResponseHandler(res, response, "successfully  packages by id !!");
        }).catch(error => {
            logger.error(error);
            errorResponseHandler(res, error, "Exception while getting package by id !");
        });
};




/**
 *  create new package
*/


exports.addPackage = async (req, res) => {
    uploadAvatar(req, res, async (error, data) => {
        if (error)
            return errorResponseHandler(res, error, "while uploading image error occurred !");
        try {
            const { packageName, amount, period, startDate, endDate, description, color, fromTime, toTime, salesBranches, accessBranches } = JSON.parse(req.body.data)
            let newPackage = new Package({ packageName, amount, period, startDate, endDate, description, color, fromTime, toTime, salesBranches, accessBranches });
            newPackage["startDate"] = setTime(startDate);
            newPackage["endDate"] = setTime(endDate);
            newPackage["image"] = req.files[0];
            newPackage["bioStarInfo"] =  await addPackage(packageName, 0, 1439);
            let response = await newPackage.save()
            let newResponse = await Package.findById(response._id).populate('accessBranches salesBranches').lean()
            let periodData = await Period.findById(response.period).lean()
            newResponse["period"] = periodData
            auditLogger(req, 'Success')
            return successResponseHandler(res, newResponse, "Successfully added package !");
        } catch (error) {
            logger.error(error);
            auditLogger(req, 'Failed')
            if (error.message.indexOf('duplicate key error') !== -1)
                return errorResponseHandler(res, error, "Package name is already exist !");
            if (error.errors['packageName'])
                return errorResponseHandler(res, error, error.errors['packageName'].message);
            if (error.errors['amount'])
                return errorResponseHandler(res, error, error.errors['amount'].message);
            if (error.errors['startDate'])
                return errorResponseHandler(res, error, error.errors['startDate'].message);
            if (error.errors['endDate'])
                return errorResponseHandler(res, error, error.errors['endDate'].message);
            if (error.errors['fromTime'])
                return errorResponseHandler(res, error, error.errors['fromTime'].message);
            if (error.errors['toTime'])
                return errorResponseHandler(res, error, error.errors['toTime'].message);
            else
                return errorResponseHandler(res, error, "Exception occurred !");
        }
    });
};








/**
 *  update new package
*/

exports.updatePackage = async (req, res) => {
    uploadAvatar(req, res, async (error, data) => {
        if (error)
            return errorResponseHandler(res, error, "while uploading image error occurred !");
        try {
            const { packageName, amount, period, startDate, endDate, description, salesBranches, accessBranches, color, fromTime, toTime } = JSON.parse(req.body.data)
            const data = { packageName, amount, period, startDate, endDate, description, color, fromTime, toTime, salesBranches, accessBranches }
            const packageData = await Package.findById(req.params.id).lean()
            data["startDate"] = setTime(startDate);
            data["endDate"] = setTime(endDate);
            if (req.files.length > 0) data["image"] = req.files[0];
            req.responseData = await Package.findById(req.params.id).lean()
            const response = await Package.findByIdAndUpdate(req.params.id, data, { new: true }).populate('period accessBranches salesBranches').lean()
            auditLogger(req, 'Success')
            return successResponseHandler(res, response, "successfully update the package !!");
        } catch (error) {
            logger.error(error);
            auditLogger(req, 'Failed')
            if (error.message.indexOf('duplicate key error') !== -1)
                return errorResponseHandler(res, error, "Package name is already exist !");
            if (error.errors['packageName'])
                return errorResponseHandler(res, error, error.errors['packageName'].message);
            if (error.errors['amount'])
                return errorResponseHandler(res, error, error.errors['amount'].message);
            if (error.errors['startDate'])
                return errorResponseHandler(res, error, error.errors['startDate'].message);
            if (error.errors['endDate'])
                return errorResponseHandler(res, error, error.errors['endDate'].message);
            if (error.errors['fromTime'])
                return errorResponseHandler(res, error, error.errors['fromTime'].message);
            if (error.errors['toTime'])
                return errorResponseHandler(res, error, error.errors['toTime'].message);
            else
                return errorResponseHandler(res, error, "Exception occurred !");
        }
    });
};




/**
 *  delete package
*/

exports.deletePackage = async (req, res) => {
    const packages = await Package.findById(req.params.id).lean();
    const today = new Date();
    const packageDate = Date(packages["endDate"]);
    if (today > packageDate) {
        Package.findOneAndDelete(req.params.id).then(response => {
            return successResponseHandler(res, response, "successfully deleted package !!");
        }).catch(error => {
            return errorResponseHandler(res, error, "Exception occurred !")
        })
    } else {
        return errorResponseHandler(res, '', "Sorry you can't delete package because it's not expire yet !");
    };
};
