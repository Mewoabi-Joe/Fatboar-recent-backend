const { response401WithMessage, response403WithMessage } = require('../../../common/helpers/expressResHelper');
const { verifyUserAuthToken } = require('../../../common/helpers/jwtHelper');

const User = require('../../../common/models/User');

const authenticateUser = (fields = '', restrictedTypes) => {
    return async (req, res, next) => {
        if (!req.headers.authorization) {
            response401WithMessage(res, "Le token d'autorisation 'JWT' est requis");
            return;
        }

        const token = req.headers.authorization.replace('JWT ', '');

        const decodedAuthToken = await verifyUserAuthToken(token);

        if (!decodedAuthToken) {
            response401WithMessage(res, "Le token d'autorisation JWT n'est pas valide");
            return;
        }

        const user = await User.findOne(
            {
                status: 'Active',
                _id: decodedAuthToken.userId,
            },
            '_id type ' + fields,
        );

        if (!user) {
            response401WithMessage(res, "Le token d'autorisation JWT n'est pas valide ou l'utilisateur est bloqué");
            return;
        }

        if (restrictedTypes && !restrictedTypes.includes(user.type)) {
            response403WithMessage(
                res,
                'Cette ressource est uniquement disponible pour les utilisateurs de type : ' + restrictedTypes,
            );
            return;
        }

        req.userAuth = decodedAuthToken;
        req.me = user;

        next();
    };
};

module.exports = { authenticateUser };
