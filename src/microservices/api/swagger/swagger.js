const commonSwagger = require('../../../common/swagger/swagger');
const securityDefinitions = require('../../../common/swagger/securityDefinitions');
const routes = require('./routes');
module.exports = {
    ...commonSwagger,
    securityDefinitions,
    paths: routes,
    info: {},
};
