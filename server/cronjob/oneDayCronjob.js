const cronjob = require('node-cron');

const { logger: { logger } } = require('../../config');

const { checkPackageExpiry, checkStockExpiry, upgradeMember, checkAssetsExpiry,
    checkContractExpiry, checkVisaExpiry, checkFreezeMember } = require('./jobs')

//
exports.oneDayCronJob = () => {
    cronjob.schedule("00 */22 * * *", async () => {
        try {
            await checkPackageExpiry();
            await checkStockExpiry();
            await checkContractExpiry();
            await checkVisaExpiry();
            await checkFreezeMember();
            await checkAssetsExpiry();
            await upgradeMember();
        } catch (error) {
            logger.error(error);
        }
    });
};