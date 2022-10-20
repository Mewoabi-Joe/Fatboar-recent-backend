const { celebrate, Joi } = require('celebrate');
const { PASSWORD_PATTERN } = require('../../../common/consts/userConst');
const CONFIG = require('../../../common/config');
const login = celebrate({
    body: Joi.object().keys({
        identifier: Joi.string().required(),
        password: Joi.string().required(),
    }),
});
const loginSocial = celebrate({
    body: Joi.object().keys({
        email: Joi.string().email().required(),
        fullName: Joi.string().required(),
        provider: Joi.string().valid(CONFIG.settings.provider_type).required(),
    }),
});

const refreshToken = celebrate({
    body: Joi.object().keys({
        refreshToken: Joi.string().required(),
    }),
});

const requestResetPassword = celebrate({
    query: Joi.object().keys({
        email: Joi.string().required(),
    }),
});

const resetPassword = celebrate({
    body: Joi.object().keys({
        password: Joi.string().regex(PASSWORD_PATTERN).required(),
        verificationToken: Joi.string().required(),
    }),
});
module.exports = { login, refreshToken, resetPassword, loginSocial, requestResetPassword };
