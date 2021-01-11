const { AuditLog, Credential } = require('../model');
const geoip = require('geoip-lite');
const { setTime } = require('../utils/timeFormate.util');
const { logger: { logger } } = require('../../config');
const { getUpdatedValue, getFormattedObject } = require('../utils/auditLogDiff');


exports.auditLogger =  async (req, status) => {
  try {
    const { newValues, oldValues } = getUpdatedValue((req.body && req.body.data) ? JSON.parse(req.body.data) : req.body, req.responseData)
    if (req.headers.userid && req.originalUrl !== '/api/credential/login') {
      await AuditLog.create({
        ip: req.ip.substr(0, 7) == "::ffff:" ? req.ip.substr(7) : req.ip,
        ipLocation: JSON.stringify(geoip.lookup(req.ip)),
        method: (oldValues && Object.keys(oldValues).length !== 0) ? "PUT" : req.method,
        event: req.body && req.body.fingerScanStatus ? '/a/b/fingerScan' : req.originalUrl,
        host: req.hostname,
        requestData: newValues,
        responseData: oldValues,
        date: setTime(new Date()),
        time: new Date(),
        userId: req.headers.userid,
        status
      }, (err, result) => {
        if (err)
          console.log('Logger Error' + err);
      });
    } else {
      switch (req.originalUrl) {
        case '/api/credential/login':
          let user = await Credential.findOne({ email: req.body.email.toLowerCase() }).lean();
          await AuditLog.create({
            ip: req.ip.substr(0, 7) == "::ffff:" ? req.ip.substr(7) : req.ip,
            ipLocation: JSON.stringify(geoip.lookup(req.ip)),
            method: req.method,
            event: req.originalUrl,
            host: req.hostname,
            requestData: getFormattedObject(req.body),
            date: setTime(new Date()),
            time: new Date(),
            userId: user._id,
            status
          }, (err, result) => {
            if (err)
              console.log('Logger Error' + err);
          });
          break;
        default: console.log('Authorized Token not Found!!');
          break;
      }
    }
  } catch (err) {
    logger.error(err);
  }
}