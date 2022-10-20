const microservice = require('../../common/initializers/microservice');
const mongoose = require('../../common/initializers/mongoose');
const express = require('../../common/initializers/express');
const expressStatus = require('../../common/initializers/express-status');
const expressBasicAuth = require('../../common/initializers/express-basic-auth');
const expressRoutes = require('../../common/initializers/express-routes');
const expressErrors = require('../../common/initializers/express-errors');
const http = require('../../common/initializers/http');
const swagger = require('../../common/initializers/swagger');
const healthCheck = require('../../common/initializers/health-check');

const initializers = [
    mongoose,
    express,
    expressStatus,
    expressBasicAuth,
    expressRoutes,
    expressErrors,
    swagger,
    http,
    healthCheck,
];

microservice.init('api', initializers);
