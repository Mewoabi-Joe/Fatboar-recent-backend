const validator = require('../validators/accountValidator');
const controller = require('../controllers/accountController');
const { authenticateUser } = require('../middlewares/authenticate');
module.exports = (router) => {
    router
        .route('/confirmEmail/send')
        .post(validator.sendConfirmEmail, authenticateUser('status email  email_status'), controller.sendConfirmEmail);
    router
        .route('/mailChimp')
        .post(validator.mailChimp, authenticateUser('', ['Owner', 'Admin']), controller.mailChimp);
    router.route('/sendinblue').post(validator.mailChimp, controller.sendinblue);
    router.route('/confirmEmail').get(validator.confirmEmail, controller.confirmEmail);
};
