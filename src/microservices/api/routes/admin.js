const validator = require('../validators/adminValidator');
const controller = require('../controllers/adminController');

const { authenticateUser } = require('../middlewares/authenticate');

module.exports = (router) => {
    router
        .route('/users')
        .get(
            validator.users,
            authenticateUser('username  email  personal_information  _owner', ['Owner', 'Admin']),
            controller.users,
        );
    router
        .route('/tickets')
        .get(
            validator.tickets,
            authenticateUser('username  email  personal_information  _owner', ['Owner', 'Admin']),
            controller.tickets,
        );
    router.route('/winner').get(validator.winner, authenticateUser(' _owner', ['Owner', 'Admin']), controller.winner);

    router
        .route('/byId/:id')
        .get(validator.byId, authenticateUser('username  email  personal_information  _owner'), controller.byId);
    router
        .route('/byIdentifier/:identifier')
        .get(
            validator.byIdentifier,
            authenticateUser('username  email  personal_information  _owner'),
            controller.byIdentifier,
        );
};
