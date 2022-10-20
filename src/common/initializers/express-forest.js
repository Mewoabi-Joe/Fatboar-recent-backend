const logger = require('winston');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const jwt = require('express-jwt');
const cookieParser = require('cookie-parser');

const CONFIG = require('../config');

module.exports = async (ms) => {
    const { app, serviceName } = ms;

    logger.info('[EXPRESS FOREST] Initializing forest');
    const node_env = CONFIG.node_env;
    let envSecret;
    let authSecret;
    if (node_env === 'local') {
        process.env.APPLICATION_URL = CONFIG.services.forest.http.local_external_url;
        envSecret = CONFIG.authentication_credentials.forest.local.env_secret;
        authSecret = CONFIG.authentication_credentials.forest.local.auth_secret;
    }
    if (node_env === 'dev') {
        process.env.APPLICATION_URL = CONFIG.services.forest.http.staging_external_url;
        process.env.DATABASE_URL = CONFIG.authentication_credentials.forest.dev.DATABASE_URL;
        envSecret = CONFIG.authentication_credentials.forest.dev.env_secret;
        authSecret = CONFIG.authentication_credentials.forest.dev.auth_secret;
    }
    if (node_env === 'prod') {
        process.env.APPLICATION_URL = CONFIG.services.forest.http.prod_external_url;
        process.env.DATABASE_URL = CONFIG.authentication_credentials.forest.prod.DATABASE_URL;
        envSecret = CONFIG.authentication_credentials.forest.prod.env_secret;
        authSecret = CONFIG.authentication_credentials.forest.prod.auth_secret;
    }
    if (!node_env || !envSecret || !authSecret) {
        throw new Error('Microservice needs forest credentials');
    }
    const forest = require('forest-express-mongoose');

    let allowedOrigins = [/\.forestadmin\.com$/, /localhost:\d{4}$/];

    const corsConfig = {
        origin: allowedOrigins,
        maxAge: 86400,
        credentials: true,
    };

    app.use(
        '/forest/authentication',
        cors({
            ...corsConfig,
            origin: corsConfig.origin.concat('null'),
        }),
    );

    app.use(cors(corsConfig));

    app.use(cookieParser());
    app.use(
        jwt({
            secret: authSecret,
            credentialsRequired: false,
            algorithms: ['HS256'],
        }),
    );

    app.use('/forest', (req, res, next) => {
        if (forest.PUBLIC_ROUTES.includes(req.url)) {
            return next();
        }
        return forest.ensureAuthenticated(req, res, next);
    });

    app.use(
        await forest.init({
            configDir: path.join(__dirname, '../../microservices/' + serviceName + '/forest'),
            envSecret: envSecret,
            authSecret: authSecret,
            objectMapping: mongoose,
            connections: { default: mongoose.connections[0] },
        }),
    );

    app.use(forest.errorHandler());
};
