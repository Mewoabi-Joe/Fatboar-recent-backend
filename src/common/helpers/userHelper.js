const User = require('../../common/models/User');
const CONFIG = require('../config');
const { generateToken } = require('./randomHelper');
const { sendUserResetPasswordEmail, sendUserConfirmationEmail, sendUserWelcomeEmail } = require('./sendinblueHelper');
const { getSha256Base64Hash } = require('./cryptoHelper');
const UserVerificationToken = require('../../common/models/UserVerificationToken');

const createVerificationToken = async (user, type) => {
    const token = generateToken(20);
    const token_hash = getSha256Base64Hash(token);
    const t = new Date();
    const verificationToken = new UserVerificationToken({
        _user: user,
        token_hash: token_hash,
        status: 'Valid',
        type: type,
        expiration_date: t.setSeconds(t.getSeconds() + CONFIG.settings.user_verification_token_lifetime),
    });

    await verificationToken.save();

    return token;
};

const retrieveAndCheckVerificationToken = async (token, type) => {
    const token_hash = getSha256Base64Hash(token);

    const verificationToken = await UserVerificationToken.findOne(
        {
            token_hash: token_hash,
            type: type,
            expiration_date: { $gte: new Date() },
            status: 'Valid',
        },
        '_user status',
    );

    return verificationToken || null;
};

const sendResetPasswordEmail = async (userId) => {
    const user = await User.findById(userId, 'name email status');

    if (!user || user.status !== 'Active') {
        return false;
    }

    const verificationToken = await createVerificationToken(user, 'ResetPassword');

    const inviteLink = CONFIG.settings.angular_app_url + '/account/resetPassword?t=' + verificationToken;

    return await sendUserResetPasswordEmail(user.email, user.name, inviteLink);
};
const sendConfirmationEmail = async (user) => {
    if (!user || user.status !== 'Active') {
        return false;
    }
    const verificationToken = await createVerificationToken(user, 'Email');
    const confirmUrl = CONFIG.settings.angular_app_url + '/account/confirmEmail/?t=' + verificationToken;
    return await sendUserConfirmationEmail(user.email, user.name, confirmUrl);
};

const sendWelcomEmail = async (user) => {
    if (!user || user.status !== 'Active') {
        return false;
    }
    const verificationToken = await createVerificationToken(user, 'Email');
    const confirmUrl = CONFIG.settings.angular_app_url + '/account/confirmEmail/?t=' + verificationToken;
    return await sendUserWelcomeEmail(user.email, user.name, confirmUrl);
};

module.exports = {
    createVerificationToken,
    retrieveAndCheckVerificationToken,
    sendResetPasswordEmail,
    sendConfirmationEmail,
    sendWelcomEmail,
};
