const microservice = require('../../common/initializers/microservice');
const mongoose = require('../../common/initializers/mongoose');
const express = require('../../common/initializers/express');
const expressStatus = require('../../common/initializers/express-status');
const expressForest = require('../../common/initializers/express-forest');
const expressRoutes = require('../../common/initializers/express-routes');
const expressErrors = require('../../common/initializers/express-errors');
const http = require('../../common/initializers/http');
const healthCheck = require('../../common/initializers/health-check');

const initializers = [mongoose, express, expressStatus, expressForest, expressRoutes, expressErrors, http, healthCheck];

microservice.init('forest', initializers);
