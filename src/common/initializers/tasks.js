const logger = require('winston');
const requiredir = require('require-dir');

module.exports = (ms) => {
    try {
        const { serviceName } = ms;

        logger.info('[TASKS] Run tasks');

        const path = '../../microservices/' + serviceName + '/tasks/';
        const dirs = requiredir(path);

        // Run all tasks
        Object.keys(dirs).forEach((task) => {
            require(path + task)();
        });
    } catch (err) {
        logger.error(err.stack);
        ms.error = true;
    }
};
