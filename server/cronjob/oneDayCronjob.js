const cronjob = require('node-cron');

const { logger: { logger } } = require('../../config');

const { checkPackageExpiry, checkStockExpiry,
    upgradeMember, checkAssetsExpiry,
    checkContractExpiry, checkVisaExpiry,
    freezeMember, checkInstallmentsPending } = require('./jobs')


exports.oneDayCronJob = () => {

    cronjob.schedule("00 */22 * * *", async () => {
        try {
            await upgradeMember();
        } catch (error) {
            logger.error(error);
        }
    });

    cronjob.schedule("00 */22 * * *", async () => {
        try {
            await checkStockExpiry();
        } catch (error) {
            logger.error(error);
        }
    });

    cronjob.schedule("00 */22 * * *", async () => {
        try {
            await checkContractExpiry();
        } catch (error) {
            logger.error(error);
        }
    });

    cronjob.schedule("00 */22 * * *", async () => {
        try {
            await checkVisaExpiry();
        } catch (error) {
            logger.error(error);
        }
    });

    cronjob.schedule("00 */22 * * *", async () => {
        try {
            await checkPackageExpiry();
        } catch (error) {
            logger.error(error);
        }
    });

    cronjob.schedule("00 */22 * * *", async () => {
        try {
            await checkAssetsExpiry();
        } catch (error) {
            logger.error(error);
        }
    });

    cronjob.schedule("00 */22 * * *", async () => {
        try {
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


