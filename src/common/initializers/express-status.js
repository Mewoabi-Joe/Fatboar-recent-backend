const logger = require('winston');
const CONFIG = require('../config');

module.exports = (ms) => {
    try {
        logger.info('[EXPRESS STATUS] Initializing status route');

        const { app, serviceName } = ms;

        const startDate = new Date();

        app.get('/status', (req, res) => {
            const currentDate = new Date();

            const uptimeData = convertMS(currentDate.getTime() - startDate.getTime());
            const uptime =
                (uptimeData.day > 0 ? uptimeData.day + ' days ' : '') +
                (uptimeData.hour > 0 ? uptimeData.hour + ' hours ' : '') +
                (uptimeData.minute > 0 ? uptimeData.minute + ' minutes ' : '') +
                (uptimeData.seconds > 0 ? uptimeData.seconds + ' seconds' : '');

            res.status(200).json({
                status: 'UP',
                service: serviceName,
                env_type: CONFIG.env_type,
                env_name: CONFIG.env_name,
                node_env: CONFIG.node_env,
                uptime: uptime,
                uptime_ms: currentDate.getTime() - startDate.getTime(),
                date: currentDate.toString(),
                date_iso: currentDate.toISOString(),
                remote_ip: req.clientIp,
            });
        });
    } catch (err) {
        logger.error(err.stack);
        ms.error = true;
    }
};

const convertMS = (milliseconds) => {
    let day, hour, minute, seconds;
    seconds = Math.floor(milliseconds / 1000);
    minute = Math.floor(seconds / 60);
    seconds = seconds % 60;
    hour = Math.floor(minute / 60);
    minute = minute % 60;
    day = Math.floor(hour / 24);
    hour = hour % 24;
    return {
        day: day,
        hour: hour,
        minute: minute,
        seconds: seconds,
    };
};
