const logger = require('winston');
const auth = require('basic-auth');
const bcrypt = require('bcryptjs');

/*eslint node/no-unpublished-require:0*/
const CONFIG = require('../config');

module.exports = (ms) => {
    try {
        logger.info('[EXPRESS BASIC AUTH] Initializing');

        if (!CONFIG.authentication_credentials.basic_auth) {
            throw new Error('Microservice needs basic auth credentials');
        }

        if (!CONFIG.services.api.http.protected_routes) {
            throw new Error('Microservice needs protected_routes config');
        }

        const { app } = ms;

        const authorizedUsers = CONFIG.authentication_credentials.basic_auth;

        app.use(CONFIG.services.api.http.protected_routes, async (req, res, next) => {
            const user = auth(req);

            if (
                !user ||
                !authorizedUsers[user.name] ||
                !(await bcrypt.compare(user.pass, authorizedUsers[user.name]))
            ) {
                res.set('WWW-Authenticate', 'Basic');
                return res.status(401).send();
            }
            return next();
        });
    } catch (err) {
        logger.error(err.stack);
        ms.error = true;
    }
};
