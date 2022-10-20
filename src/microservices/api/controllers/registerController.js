const {
    response204,
    response200,
    response201WithData,
    response400WithMessage,
} = require('../../../common/helpers/expressResHelper');
const { validateAndNormalizeEmail } = require('../../../common/helpers/validationHelper');

const { hashPassword } = require('../../../common/helpers/cryptoHelper');
const { sendWelcomEmail } = require('../../../common/helpers/userHelper');
const User = require('../../../common/models/User');
const Address = require('../../../common/models/Address');

const register = async (req, res) => {
    console.log('inRegister', req.body);
    if (!req.body.isLegalNoticeAccepted && req.body.type === 'User') {
        response400WithMessage(res, 'Vous devez accepter les mentions légales');
        return;
    }
    const email = await validateAndNormalizeEmail(req.body.email);
    if (!email) {
        response400WithMessage(res, "L'email n'est pas valide");
        return;
    }

    const isEmailUsed = await User.findOne({ email: email }, '_id');
    if (isEmailUsed) {
        response400WithMessage(res, 'Cet adresse mail est déjà utilisée');
        return;
    }
    const isUsernameUsed = await User.findOne({ username: req.body.username }, '_id');

    if (isUsernameUsed) {
        response400WithMessage(res, "Le nom d'utilisateur est déjà utilisé");
        return;
    }
    const newAddress = new Address({
        full_name: req.body.fullName,
        address1: req.body.address.address1,
        address2: req.body.address.address2,
        zip: req.body.address.zip,
        city: req.body.address.city,
        state: req.body.address.state,
        creation_ip: req.clientIp,
    });

    await newAddress.save();
    const password_hash = await hashPassword(req.body.password);
    const newUser = new User({
        username: req.body.username,
        email: email,
        email_status: 'Unconfirmed',
        password_hash: password_hash,
        news_lettre: req.body.newsLettre,
        status: 'Active',
        type: req.body.type,
        personal_information: {
            full_name: req.body.fullName,
            _address: newAddress,
        },
        creation_ip: req.clientIp,
    });

    await newUser.save();

    response201WithData(res, {
        id: newUser._id,
        username: newUser.username,
        status: newUser.status,
    });

    await sendWelcomEmail(newUser);
};
const registerSocial = async (req, res) => {
    const { email, fullName, provider, newsLettre, type, isLegalNoticeAccepted } = req.body;
    if (!isLegalNoticeAccepted) {
        response400WithMessage(res, 'Vous devez accepter les mentions légales');
        return;
    }
    const validateEmail = await validateAndNormalizeEmail(email);
    if (!validateEmail) {
        response400WithMessage(res, 'Email is not valid');
        return;
    }

    const isEmailUsed = await User.findOne({ email: validateEmail }, '_id');
    if (isEmailUsed) {
        response400WithMessage(res, 'Cet adresse mail est déjà utilisée');
        return;
    }

    const newAddress = new Address({
        full_name: fullName,
        creation_ip: req.clientIp,
    });

    await newAddress.save();
    const newUser = new User({
        email: email,
        email_status: 'Unconfirmed',
        news_lettre: newsLettre,
        status: 'Active',
        provider: provider,
        type: type,
        personal_information: {
            full_name: fullName,
            _address: newAddress,
        },
        creation_ip: req.clientIp,
    });

    await newUser.save();

    response201WithData(res, {
        id: newUser._id,
        email: newUser.email,
        status: newUser.status,
    });

    sendWelcomEmail(newUser);
};

const verifyUsername = async (req, res) => {
    const isUsernameUsed = await User.findOne({ username: req.params.username }, '_id');

    if (isUsernameUsed) {
        response204(res, { isExist: true });
        return;
    }

    response200(res, { isExist: false });
};

const verifyEmail = async (req, res) => {
    const email = await validateAndNormalizeEmail(req.params.email);

    if (!email) {
        response204(res, { isExist: true });
        return;
    }

    const isEmailUsed = await User.findOne({ email: email }, '_id');
    if (isEmailUsed) {
        response204(res, { isExist: true });
        return;
    }

    response200(res, { isExist: false });
};
module.exports = { register, verifyUsername, verifyEmail, registerSocial };
