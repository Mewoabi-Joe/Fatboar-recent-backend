const {
    response400WithMessage,
    response404WithMessage,
    response200,
    response204,
} = require('../../../common/helpers/expressResHelper');
const User = require('../../../common/models/User');

const verifyUsername = async (req, res) => {
    const isUsernameUsed = await User.findOne({ username: req.params.username, type: 'Owner' }, '_id');

    if (isUsernameUsed) {
        response200(res, { isExist: true, id: isUsernameUsed._id });
        return;
    }

    response204(res, { isExist: false });
};
const deleteOwner = async (req, res) => {
    if (!req.me._owner) {
        return response400WithMessage(res, "Vous n'avez pas encore de propriétaire");
    }
    req.me._owner = null;
    req.me.save();
    response200(res);
};

const addOwner = async (req, res) => {
    const user = await User.findOne({ username: req.body.username }, ' _id ');
    if (!user) {
        return response404WithMessage(res, 'Propriétaire introuvable');
    }
    if (req.me._owner) {
        return response400WithMessage(res, 'Vous avez déjà le propriétaire');
    }
    req.me._owner = user._id;
    req.me.save();
    response200(res);
};

module.exports = { addOwner, deleteOwner, verifyUsername };
