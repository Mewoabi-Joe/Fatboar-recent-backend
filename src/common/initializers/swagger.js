const swaggerUi = require('swagger-ui-express');
const logger = require('winston');
const CONFIG = require('../config');

module.exports = (ms) => {
    try {
        logger.info('[SWAGGER] Initializing');

        const { app, serviceName } = ms;

        const swaggerSpec = require('../../microservices/' + serviceName + '/swagger/swagger.js');

        swaggerSpec.info = {
            title: CONFIG.project_name + ' - ' + serviceName.toUpperCase(),
            version: CONFIG.version,
            ...swaggerSpec.info,
        };

        logger.info('[SWAGGER] Expose /docs');

        app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    } catch (err) {
        logger.error(err.stack);
        ms.error = true;
    }
};
