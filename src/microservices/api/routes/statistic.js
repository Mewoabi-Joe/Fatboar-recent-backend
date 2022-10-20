const validator = require('../validators/statisticValidator');
const controller = require('../controllers/statisticController');

const { authenticateUser } = require('../middlewares/authenticate');

module.exports = (router) => {
    router
        .route('/')
        .get(validator.getStatistic, authenticateUser('_owner', ['Owner', 'Admin']), controller.getStatistic);
    router
        .route('/getCarWinner')
        .get(validator.getCarWinner, authenticateUser('_owner', ['Owner', 'Admin']), controller.getCarWinner);
};
