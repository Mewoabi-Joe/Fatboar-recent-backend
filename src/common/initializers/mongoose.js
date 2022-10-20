const logger = require('winston');
const mongoose = require('mongoose');
const requiredir = require('require-dir');

const CONFIG = require('../config');

module.exports = (ms) => {
    try {
        logger.info('[MONGOOSE] Connection to mongodb');
        const node_env = CONFIG.node_env;
        const { host, staging_host, prod_host, port, db, user, password } = CONFIG.authentication_credentials.mongodb;

        //Initially line of code below was absent
        let mongoUrl;

        let hostName = null;
        if (node_env === 'local') {
            //Initially 1st line below was present and second line absent
            // hostName = host;
            mongoUrl = `mongodb://${hostName}:${port}/${db}`;
        }
        if (node_env === 'dev') {
            hostName = staging_host;
            //Initially line below was  absent
            // mongoUrl = `mongodb+srv://${user}:${password}@final-db.acehnqi.mongodb.net/?retryWrites=true&w=majority`;
            // mongoUrl = `mongodb+srv://${user}:${password}@burgercluster.3bkb75m.mongodb.net/burgerdb?retryWrites=true&w=majority`;
            mongoUrl = `mongodb+srv://${user}:${password}@cluster0.iyzanqc.mongodb.net/?retryWrites=true&w=majority`;
        }
        if (node_env === 'prod') {
            hostName = prod_host;
        }
        if (!node_env || !hostName || !port || !db || !user || !password) {
            throw new Error('Microservice needs mongodb credentials');
        }
        //initially commented code below was present
        // const mongoUrl = `mongodb://${hostName}:${port}/${db}`;
        const options = {
            //initially user and password were given
            // user: user,
            // pass: password,
            useNewUrlParser: true,
            useFindAndModify: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
        };
        mongoose.Promise = global.Promise;
        const connectWithRetry = () => {
            return mongoose.connect(mongoUrl, options, (err) => {
                if (err) {
                    logger.info('Failed to connect to mongo on startup - retrying in 5 sec', err);
                    setTimeout(connectWithRetry, 5000);
                }
            });
        };
        connectWithRetry();
        logger.info('[MONGOOSE] Load models');

        const path = '../models/';
        const dirs = requiredir(path);

        // Load all models
        Object.keys(dirs).forEach((model) => {
            require(path + model);
        });
    } catch (err) {
        logger.error(err.stack);
        ms.error = true;
    }
};
