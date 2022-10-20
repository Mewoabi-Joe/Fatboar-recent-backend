const {
    response200WithDataAndMessage,
    response200WithMessage,
    response201WithMessage,
    response400WithMessage,
    response404WithMessage,
} = require('../../../common/helpers/expressResHelper');

const { sendConfirmationEmail } = require('../../../common/helpers/userHelper');
const { sendResetPasswordEmail, retrieveAndCheckVerificationToken } = require('../../../common/helpers/userHelper');
const { run } = require('../../../common/helpers/mailchimp');
const User = require('../../../common/models/User');

const sendConfirmEmail = async (req, res) => {
    if (!req.me) {
        response404WithMessage(res, 'Utilisateur non trouvé');
        return;
    }

    if (req.me.email_status === 'Confirmed') {
        response400WithMessage(res, 'E-mail déjà confirmé');
        return;
    }

    await sendConfirmationEmail(req.me);

    response201WithMessage(res, 'Email envoyé');
};

const confirmEmail = async (req, res) => {
    const userVerificationToken = await retrieveAndCheckVerificationToken(req.query.t, 'Email');

    if (!userVerificationToken) {
        return response400WithMessage(res, 'Token de vérification non valide');
    }
    const user = await User.findOne(userVerificationToken._user, '_id password_hash');

    if (!user) {
        response404WithMessage(res, 'Utilisateur non trouvé');
        return;
    }

    if (user.email_status === 'Confirmed') {
        response400WithMessage(res, 'E-mail déjà confirmé');
        return;
    }

    userVerificationToken.status = 'Used';
    user.email_status = 'Confirmed';
    await userVerificationToken.save();
    await user.save();

    response200WithMessage(res, 'Courriel confirmé');
};

const mailChimp = async (req, res) => {
    const { email, text, subject, from_email } = req.body;
    const response = await run(email, text, subject, from_email);
    response200WithDataAndMessage(res, { response }, 'ok');
};
const sendinblue = async (req, res) => {
    const { userId } = req.body;
    const response = await sendResetPasswordEmail(userId);
    response200WithDataAndMessage(res, { response }, 'ok');
};
module.exports = { sendConfirmEmail, confirmEmail, mailChimp, sendinblue };
