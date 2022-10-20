const validator = require('../validators/registerValidator');
const controller = require('../controllers/registerController');

module.exports = (router) => {
    router.route('/').post(validator.register, controller.register);
    router.route('/social').post(validator.registerSocial, controller.registerSocial);
    router.route('/verifyUsername/:username').get(validator.verifyUsername, controller.verifyUsername);
    router.route('/verifyEmail/:email').get(validator.verifyEmail, controller.verifyEmail);
};
