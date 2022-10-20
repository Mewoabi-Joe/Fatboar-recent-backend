const validator = require('../validators/gamesValidator');
const controller = require('../controllers/gamesController');

const { authenticateUser } = require('../middlewares/authenticate');

module.exports = (router) => {
    router
        .route('/')
        .get(
            validator.getTicket,
            authenticateUser('_counter _ticket _owner', ['Owner', 'Admin']),
            controller.getTicket,
        );
    router
        .route('/historic')
        .get(validator.getHistoric, authenticateUser('_counteur _ticket _owner'), controller.getHistoric);

    router.route('/checkTicket').post(validator.checkTicket, authenticateUser('_ticket'), controller.checkTicket);
};
