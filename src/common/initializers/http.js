const http = require('http');
const logger = require('winston');

const CONFIG = require('../config');

const listen = async (server, port) => {
    return new Promise((resolve) => {
        server.listen(port, () => {
            resolve();
        });
    });
};

module.exports = async (ms) => {
    try {
        logger.info('[HTTP] Initializing');

        const { app, serviceName } = ms;

        const httpConfig = CONFIG.services[serviceName].http;

        if (!httpConfig) {
            throw new Error('Microservice need http config');
        }

        const server = http.createServer(app);

        //Initially line below
        // await listen(server, 3000);
        await listen(server, process.env.PORT || 3000);

        logger.info('[HTTP] Listening');

        ms.server = server;
    } catch (err) {
        logger.error(err.stack);
        ms.error = true;
    }
};
