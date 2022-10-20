const forest = require('forest-express-mongoose');

const controller = require('../../controllers/actions/usersActionsController');

module.exports = (router) => {
    router.use(forest.ensureAuthenticated);

    router.route('/').post(controller.create);

    router.route('/sendResetPasswordUserEmail').post(controller.sendResetPasswordUserEmail);
};
