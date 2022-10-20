const validator = require('../validators/ownerValidator');
const controller = require('../controllers/ownerController');

const { authenticateUser } = require('../middlewares/authenticate');

module.exports = (router) => {
    router.route('/addOwner').post(validator.addOwner, authenticateUser('_owner ', ['Admin']), controller.addOwner);

    router
        .route('/verifyUsername/:username')
        .get(validator.verifyUsername, authenticateUser(), controller.verifyUsername);
    router
        .route('/deleteOwner')
        .delete(validator.deleteOwner, authenticateUser('status _owner', ['Admin']), controller.deleteOwner);
};
