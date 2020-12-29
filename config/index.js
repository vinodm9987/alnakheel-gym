module.exports = {
    config: require('./dev.config'),
    biostar: require('./biostar.config'),
    logger: require('./logger.config'),
    upload: require('./multer.config'),
    handler: require('./handlers.config'),
    redisConfig: require('./redis.config')
};