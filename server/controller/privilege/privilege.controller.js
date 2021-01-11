/**  
 * utils.
*/

const { logger: { logger }, handler: { successResponseHandler, errorResponseHandler } } = require('../../../config');
const { auditLogger } = require('../../middleware/auditlog.middleware');

/**
 * models.
*/

const { WebPrivilege, MobilePrivilege, Credential, ReportPrivilege } = require('../../model');



exports.assignViewForWeb = async (req, res) => {
    try {
        const { userId, moduleName, component } = req.body
        let isExistingModules = await WebPrivilege.findOne({ moduleName: moduleName, userId: userId });
        if (isExistingModules) {
            if (component._id) {
                let response = await WebPrivilege.findOneAndUpdate({ "component._id": component._id }, { $set: { "component.$.read": component.read, "component.$.write": component.write } }, { new: true });
                auditLogger(req, 'Success')
                successResponseHandler(res, response, "successfully assign view !")
            } else {
                let response = await WebPrivilege.findByIdAndUpdate(isExistingModules._id, { $push: { component } }, { new: true });
                auditLogger(req, 'Success')
                successResponseHandler(res, response, "successfully assign view !")
            }
        } else {
            let newWebPrivileges = new WebPrivilege(req.body);
            let response = await newWebPrivileges.save();
            await Credential.findByIdAndUpdate(userId, { $push: { webModule: response._id } })
            auditLogger(req, 'Success')
            successResponseHandler(res, response, "successfully assign view !")
        }
    } catch (error) {
        if (error.code === "11000") {
            auditLogger(req, 'Failed')
            errorResponseHandler(res, error, "module or component is already assign !");
        } else {
            logger.error(error);
            auditLogger(req, 'Failed')
            errorResponseHandler(res, error, "Exception while assign view !");
        }
    }
};




exports.assignViewForMobile = async (req, res) => {
    try {
        let newMobilePrivileges = new MobilePrivilege(req.body);
        let response = await newMobilePrivileges.save();
        await Credential.findByIdAndUpdate(req.body.userId, { $push: { mobileModule: response._id } })
        successResponseHandler(res, response, "successfully assign view !")
    } catch (error) {
        if (error.code === "11000") {
            errorResponseHandler(res, error, "module or component is already assign !");
        } else {
            logger.error(error);
            errorResponseHandler(res, error, "Exception while assign view !");
        }
    }
};



exports.assignReport = async (req, res) => {
    try {
        const { userId, reportType, reportName } = req.body
        let isExistingReport = await ReportPrivilege.findOne({ reportType: reportType, userId: userId });
        if (isExistingReport) {
            if (reportName._id) {
                let response = await ReportPrivilege.findOneAndUpdate({ "reportName._id": reportName._id }, { $set: { "reportName.$.read": reportName.read } }, { new: true });
                auditLogger(req, 'Success')
                successResponseHandler(res, response, "successfully assign report !")
            } else {
                let response = await ReportPrivilege.findByIdAndUpdate(isExistingReport._id, { $push: { reportName } }, { new: true });
                auditLogger(req, 'Success')
                successResponseHandler(res, response, "successfully assign report !")
            }
        } else {
            let newReportPrivileges = new ReportPrivilege(req.body);
            let response = await newReportPrivileges.save();
            await Credential.findByIdAndUpdate(userId, { $push: { report: response._id } })
            auditLogger(req, 'Success')
            successResponseHandler(res, response, "successfully assign report !")
        }
    } catch (error) {
        if (error.code === "11000") {
            auditLogger(req, 'Failed')
            errorResponseHandler(res, error, "report is already assign !");
        } else {
            logger.error(error);
            auditLogger(req, 'Failed')
            errorResponseHandler(res, error, "Exception while assign report !");
        }
    }
};