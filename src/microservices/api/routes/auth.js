const validator = require('../validators/authValidator');
const controller = require('../controllers/authController');
module.exports = (router) => {
    router.route('/login').post(validator.login, controller.login);

    router.route('/loginSocial').post(validator.loginSocial, controller.loginSocial);

    router.route('/refreshToken').post(validator.refreshToken, controller.refreshToken);

    router.route('/requestResetPassword').get(validator.requestResetPassword, controller.requestResetPassword);

    router.route('/resetPassword').post(validator.resetPassword, controller.resetPassword);
};
