const winston = require("winston");
const mkdirp = require("mkdirp");
class Logger {
    constructor() {
        this.myCustomLevels = {
            levels: {
                logging: 1,
                error: 2,
                info: 3
            }
        };
        this.logFormatter = function (options) {
            return options.message;
        };
        this.logger = new (winston.Logger)({
            levels: this.myCustomLevels.levels,
            transports: [
                new (winston.transports.File)({
                    level: 'error',
                    name: 'error-file',
                    filename: 'logs/error.log',
                }),
                new (winston.transports.File)({
                    level: 'info',
                    filename: 'logs/access.log'
                }),
                new (winston.transports.File)({
                    level: 'logging',
                    name: 'logging-file',
                    filename: 'logs/logging.log',
                    formatter: this.logFormatter,
                    json: false,
                    maxsize: '100000000'
                })
            ]
        });
        this.createLogDir();
    }
    createLogDir() {
        mkdirp('logs', function (err) {
            if (err != null) {
                this.logger.error('error while creating logs folder');
            }
        });
    }
}

module.exports.logger = new Logger().logger;