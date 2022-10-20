const validator = require('../validators/meValidator');
const controller = require('../controllers/meController');

const { authenticateUser } = require('../middlewares/authenticate');

module.exports = (router) => {
    router
        .route('/')
        .get(
            validator.getInfos,
            authenticateUser('username  email email_status  personal_information  _owner  provider'),
            controller.getInfos,
        );

    router
        .route('/updateInfos')
        .put(
            validator.updateInfos,
            authenticateUser('username email email_status personal_information '),
            controller.updateInfos,
        );

    router.route('/delete').delete(validator.deleteUser, authenticateUser('status'), controller.deleteUser);
};
