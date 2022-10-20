const {
    response201WithData,
    response400WithMessage,
    response201WithMessage,
    response200WithMessage,
    response500WithMessage,
} = require('../../../common/helpers/expressResHelper');

const { sendResetPasswordEmail, retrieveAndCheckVerificationToken } = require('../../../common/helpers/userHelper');

const {
    signUserAuthToken,
    signUserRefreshToken,
    verifyUserRefreshToken,
} = require('../../../common/helpers/jwtHelper');
const { comparePassword, hashPassword } = require('../../../common/helpers/cryptoHelper');
const { validateAndNormalizeEmail } = require('../../../common/helpers/validationHelper');
const User = require('../../../common/models/User');
const loginSocial = async (req, res) => {
    const { email, fullName, provider } = req.body;

    let filters = {
        status: 'Active',
    };
    const emailIsvalide = await validateAndNormalizeEmail(email);
    if (!emailIsvalide) {
        response400WithMessage(res, "Échec de l'authentification e-mail non valide");
        return;
    }
    filters.email = email;

    const user = await User.findOne(filters, '_id  email username type personal_information');
    if (!user) {
        response400WithMessage(res, 'login.failed');
        return;
    }

    user.last_authentication_date = req.currentDate;
    user.creation_ip = req.clientIp;
    user.provider = provider;

    if (fullName) {
        user.personal_information.full_name = fullName;
    }
    await user.save();

    const { authToken, authExpiration } = await signUserAuthToken(user);
    const { refreshToken, refreshExpiration } = await signUserRefreshToken(user);

    response201WithData(res, {
        user: {
            id: user._id,
            type: user.type,
            username: user.username,
            email: user.email,
        },
        authToken,
        authExpiration,
        refreshToken,
        refreshExpiration,
    });
};
const login = async (req, res) => {
    let filters = {
        status: 'Active',
    };
    const email = await validateAndNormalizeEmail(req.body.identifier);
    if (email) {
        filters.email = email;
    } else {
        filters.username = req.body.identifier;
    }
    const user = await User.findOne(filters, '_id username email type password_hash');
    if (!user || !(await comparePassword(req.body.password, user.password_hash))) {
        response400WithMessage(res, 'login.failed');
        return;
    }

    user.last_authentication_date = req.currentDate;
    user.creation_ip = req.clientIp;
    await user.save();

    const { authToken, authExpiration } = await signUserAuthToken(user);
    const { refreshToken, refreshExpiration } = await signUserRefreshToken(user);

    response201WithData(res, {
        user: {
            id: user._id,
            type: user.type,
            username: user.username,
            email: user.email,
        },
        authToken,
        authExpiration,
        refreshToken,
        refreshExpiration,
    });
};

const refreshToken = async (req, res) => {
    const decodedRefreshToken = await verifyUserRefreshToken(req.body.refreshToken);

    if (!decodedRefreshToken) {
        response400WithMessage(res, "Échec de l'actualisation du token");
        return;
    }

    const user = await User.findOne({ status: 'Active', _id: decodedRefreshToken.userId }, '_id username email type');

    if (!user) {
        response400WithMessage(res, "Échec de l'actualisation du token");
        return;
    }

    user.last_authentication_date = req.currentDate;
    user.creation_ip = req.clientIp;
    await user.save();

    const { authToken, authExpiration } = await signUserAuthToken(user);
    const { refreshToken, refreshExpiration } = await signUserRefreshToken(user);

    response201WithData(res, {
        user: {
            id: user._id,
            type: user.type,
            username: user.username,
            email: user.email,
        },
        authToken,
        authExpiration,
        refreshToken,
        refreshExpiration,
    });
};

const resetPassword = async (req, res) => {
    const { password, verificationToken } = req.body;

    const userVerificationToken = await retrieveAndCheckVerificationToken(verificationToken, 'ResetPassword');

    if (!userVerificationToken) {
        return response400WithMessage(res, 'Token  de vérification non valide');
    }

    const user = await User.findOne(userVerificationToken._user, '_id password_hash email');
    if (!user) {
        return response400WithMessage(res, 'Utilisateur non trouvé');
    }
    userVerificationToken.status = 'Used';
    user.password_hash = await hashPassword(password);

    await userVerificationToken.save();
    await user.save();
    response201WithMessage(res, 'Mot de passe mis à jour');
};

const requestResetPassword = async (req, res) => {
    const { email } = req.query;

    const user = await User.findOne({ email: email, status: 'Active' }, '_id');

    if (!user) {
        return response400WithMessage(res, 'Utilisateur introuvable ou non actif');
    }

    if (await sendResetPasswordEmail(user)) {
        response200WithMessage(res, 'E-mail de réinitialisation du mot de passe envoyé');
    } else {
        response500WithMessage(res, "Échec de l'envoi de l'e-mail de réinitialisation du mot de passe");
    }
};
module.exports = { login, refreshToken, resetPassword, loginSocial, requestResetPassword };
