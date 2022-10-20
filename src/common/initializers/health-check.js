const logger = require('winston');
const http = require('http');
const mongoose = require('mongoose');

const CONFIG = require('../config');

const { convertMillisecondsToReadableTime } = require('../helpers/dateHelper');

const listen = async (server, port) => {
    return new Promise((resolve, reject) => {
        server.listen(port, (err) => {
            err ? reject(err) : resolve();
        });
    });
};

module.exports = async (ms) => {
    logger.info('[HEALTH CHECK] Initializing');

    const { serviceName } = ms;

    const startDate = new Date();

    const server = http.createServer((req, res) => {
        const currentDate = new Date();

        const uptimeMs = currentDate.getTime() - startDate.getTime();
        const uptime = convertMillisecondsToReadableTime(uptimeMs);

        const data = {
            status: 'UP',
            service: serviceName,
            env_type: CONFIG.env_type,
            env_name: CONFIG.env_name,
            uptime: uptime,
            uptime_ms: uptimeMs,
            date: currentDate.toString(),
            date_iso: currentDate.toISOString(),
            remote_ip: req.socket.remoteAddress,
            is_mongo_connected: mongoose.connection.readyState === 1,
        };

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
    });

    //initially 5000
    // await listen(server, 5000);
    await listen(server, 6000);

    logger.info('[HEALTH CHECK] Listening');
};
