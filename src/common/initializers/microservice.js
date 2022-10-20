require('../prototypes');
const logger = require('winston');
const loggerInit = require('./logger');
const figletHelper = require('../helpers/figletHelper');

module.exports.init = async (serviceName, initializers) => {
    figletHelper.showServiceTitle(serviceName);

    let ms = {
        serviceName: serviceName,
    };

    loggerInit(ms);

    logger.info('-------- ' + serviceName.toUpperCase() + ' --------');
    logger.info('[' + serviceName.toUpperCase() + '] Starting initialization');

    await initializers.asyncForEach(async (item) => {
        if (ms.error) {
            return;
        }

        await item(ms);
    });

    if (ms.error) {
        logger.info('[' + serviceName.toUpperCase() + '] Initialisation FAILED');
    } else {
        logger.info('[' + serviceName.toUpperCase() + '] Initialized SUCCESSFULLY');
    }
};
