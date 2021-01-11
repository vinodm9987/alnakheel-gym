/**
 * utils.
*/

const { logger: { logger }, handler: { successResponseHandler, errorResponseHandler }, config: { DB } } = require('../../../config')
const { Formate: { setTime } } = require('../../utils')


/**
 * models.
*/

const { ManualBackup, Restore } = require('../../model');


var backup = require('mongodb-backup-4x');
var restore = require('mongodb-restore');
const { auditLogger } = require('../../middleware/auditlog.middleware');



exports.processBackup = async (req, res) => {
  try {
    let folderName = `${req.body.backupName} ${new Date().toDateString()}`.split(' ').join('_')
    req.body["dateOfBackup"] = setTime(new Date())
    req.body["timeOfBackup"] = new Date()
    let folderPath = `${String.raw`${req.body.backupDestination}`}/${folderName}`
    req.body["backupDestination"] = folderPath
    backup({
      uri: DB, // mongodb://<dbuser>:<dbpassword>@<dbdomain>.mongolab.com:<dbport>/<dbdatabase>
      root: folderPath, // write files into this dir
      callback: function (err) {
        if (err) {
          req.body["status"] = 'Failed'
          let response = new ManualBackup(req.body)
          response.save().then(response => {
            auditLogger(req, 'Failed')
            errorResponseHandler(res, 'error', "Backup Failed !");
          }).catch(error => {
            logger.error(error);
            auditLogger(req, 'Failed')
            errorResponseHandler(res, error, "Exception while Backup !");
          })
        } else {
          req.body["status"] = 'Success'
          let response = new ManualBackup(req.body)
          response.save().then(response => {
            auditLogger(req, 'Success')
            successResponseHandler(res, response, "Successfully Backup");
          }).catch(error => {
            logger.error(error);
            auditLogger(req, 'Failed')
            errorResponseHandler(res, error, "Exception while Backup !");
          })
        }
      }
    });
  } catch (error) {
    logger.error(error);
    auditLogger(req, 'Failed')
    errorResponseHandler(res, error, "Exception while Backup !");
  }
};


exports.getAllManualBackup = async (req, res) => {
  ManualBackup.find({})
    .then(response => {
      successResponseHandler(res, response, "successfully get all manual backups");
    }).catch(error => {
      logger.error(error);
      errorResponseHandler(res, error, "Exception while get all manual backups !");
    });
};


exports.processRestore = async (req, res) => {
  try {
    req.body["dateOfRestore"] = setTime(new Date())
    req.body["timeOfRestore"] = new Date()
    restore({
      uri: DB, // mongodb://<dbuser>:<dbpassword>@<dbdomain>.mongolab.com:<dbport>/<dbdatabase>
      root: req.body.restoreDestination, // write files from this dir
      callback: function (err) {
        if (err) {
          req.body["status"] = 'Failed'
          let response = new Restore(req.body)
          response.save().then(response => {
            auditLogger(req, 'Failed')
            errorResponseHandler(res, 'error', "Restore Failed !");
          }).catch(error => {
            logger.error(error);
            auditLogger(req, 'Failed')
            errorResponseHandler(res, error, "Exception while Restore !");
          })
        } else {
          req.body["status"] = 'Success'
          let response = new Restore(req.body)
          response.save().then(response => {
            auditLogger(req, 'Success')
            successResponseHandler(res, response, "Successfully Restore");
          }).catch(error => {
            logger.error(error);
            auditLogger(req, 'Failed')
            errorResponseHandler(res, error, "Exception while Restore !");
          })
        }
      }
    });
  } catch (error) {
    logger.error(error);
    auditLogger(req, 'Failed')
    errorResponseHandler(res, error, "Exception while Restore !");
  }
};


exports.getAllRestore = async (req, res) => {
  Restore.find({})
    .then(response => {
      successResponseHandler(res, response, "successfully get all restores");
    }).catch(error => {
      logger.error(error);
      errorResponseHandler(res, error, "Exception while get all restores !");
    });
};