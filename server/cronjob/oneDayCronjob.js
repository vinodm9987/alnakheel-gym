const cronjob = require('node-cron');

const { logger: { logger } } = require('../../config');

const { checkPackageExpiry, checkStockExpiry,
    upgradeMember, checkAssetsExpiry,
    checkContractExpiry, checkVisaExpiry,
    freezeMember, checkInstallmentsPending } = require('./jobs')


exports.oneDayCronJob = () => {

    cronjob.schedule("00 */22 * * *", async () => {
        try {
            await checkPackageExpiry();
            await checkStockExpiry();
            await checkContractExpiry();
            await checkVisaExpiry();
            await checkAssetsExpiry();
            await upgradeMember();
            await checkInstallmentsPending();
        } catch (error) {
            logger.error(error);
        }
    });

    cronjob.schedule("00 */1 * * *", async () => {
        try {
            await freezeMember();
        } catch (error) {
            logger.error(error);
        }
    });


};


