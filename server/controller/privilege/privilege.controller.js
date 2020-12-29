/**  
 * utils.
*/

const { logger: { logger }, handler: { successResponseHandler, errorResponseHandler } } = require('../../../config')

/**
 * models.
*/

const { WebPrivilege, MobilePrivilege, Credential } = require('../../model');



exports.assignViewForWeb = async (req, res) => {
    try {
        const { userId, moduleName, component } = req.body
        let isExistingModules = await WebPrivilege.findOne({ moduleName: moduleName, userId: userId });
        if (isExistingModules) {
            if (component._id) {
                let response = await WebPrivilege.findOneAndUpdate({ "component._id": component._id }, { $set: { "component.$.read": component.read, "component.$.write": component.write } }, { new: true });
                successResponseHandler(res, response, "successfully assign view !")
            } else {
                let response = await WebPrivilege.findByIdAndUpdate(isExistingModules._id, { $push: { component } }, { new: true });
                successResponseHandler(res, response, "successfully assign view !")
            }
        } else {
            let newWebPrivileges = new WebPrivilege(req.body);
            let response = await newWebPrivileges.save();
            await Credential.findByIdAndUpdate(userId, { $push: { webModule: response._id } })
            successResponseHandler(res, response, "successfully assign view !")
        }
    } catch (error) {
        if (error.code === "11000") {
            errorResponseHandler(res, error, "module or component is already assign !");
        } else {
            logger.error(error);
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