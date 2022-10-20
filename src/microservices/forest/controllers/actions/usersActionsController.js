const { response200, response400 } = require('../../../../common/helpers/expressResHelper');
const { sendResetPasswordEmail, sendWelcomEmail } = require('../../../../common/helpers/userHelper');

const User = require('../../../../common/models/User');
const { hashPassword } = require('../../../../common/helpers/cryptoHelper');

const create = async (req, res) => {
    const { userName, email, password, type, _owner, send_invite_email } = req.body.data.attributes.values;

    const isEmailUsed = await User.findOne({ email: email }, '_id');

    if (isEmailUsed) {
        response400(res, { error: 'Email is already used' });
        return;
    }
    if (userName) {
        const isUsernameUsed = await User.findOne({ username: userName }, '_id');

        if (isUsernameUsed) {
            response400(res, { error: 'userName is already used' });
            return;
        }
    }

    let owner;

    if (type === 'Admin') {
        if (!_owner) {
            response400(res, { error: 'Owner is required for type User Admin' });
            return;
        }

        owner = await User.findOne({ _id: _owner, type: 'Owner', status: 'Active' }, '_id');

        if (!owner) {
            response400(res, { error: 'Owner not found or not valid' });
            return;
        }
    }
    const password_hash = await hashPassword(password);
    const user = new User({
        email: email,
        status: 'Active',
        password_hash: password_hash,
        type: type,
        creation_ip: req.clientIp,
        _owner: owner,
    });

    if (userName) {
        user.username = userName;
    }
    await user.save();

    await sendWelcomEmail(user);
    response200(res, { success: 'User created' + (!send_invite_email ? '' : ' and invitation email sent') });
};

const sendResetPasswordUserEmail = async (req, res) => {
    const user = await User.findById(req.body.data.attributes.ids[0], '_id status');

    if (!user || user.status !== 'Active') {
        return response400(res, { error: 'User must be in active' });
    }

    if (await sendResetPasswordEmail(user._id)) {
        response200(res, { success: 'Reset password email sent' });
    } else {
        response400(res, { error: 'Email sending failed' });
    }
};

module.exports = { create, sendResetPasswordUserEmail };
