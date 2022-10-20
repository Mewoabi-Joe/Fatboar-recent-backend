const logger = require('winston');
require('winston-daily-rotate-file');

const CONFIG = require('../config');

const customLevels = {
    levels: {
        error: 0,
        warn: 1,
        http: 2,
        info: 3,
        debug: 4,
    },
    colors: {
        error: 'red',
        warn: 'orange',
        http: 'gray',
        info: 'blue',
        debug: 'green',
    },
};

const customFormat = logger.format.combine(logger.format.timestamp(), logger.format.json());

module.exports = (ms) => {
    try {
        logger.clear();

        logger.configure({
            levels: customLevels.levels,
            exitOnError: false,
        });

        logger.addColors(customLevels.colors);

        logger.stream = {
            write: (message) => {
                logger.http(message.replace('\n', ''));
            },
        };

        //Initially present
        // if (CONFIG.logs.file) {
        //     const transportDailyFile = new logger.transports.DailyRotateFile({
        //         level: 'info',
        //         format: customFormat,
        //         filename: '%DATE%.log',
        //         dirname: '/srv/logs',
        //         datePattern: 'YYYY-MM-DD',
        //         maxFiles: '365d',
        //         handleExceptions: true,
        //     });

        //     logger.add(transportDailyFile);
        // }

        if (CONFIG.logs.console) {
            const transportConsole = new logger.transports.Console({
                format: logger.format.simple(),
                handleExceptions: true,
                colorize: true,
            });

            logger.add(transportConsole);
        }
    } catch (err) {
        logger.error(err.stack);
        ms.error = true;
    }
};
