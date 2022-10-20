const { celebrate, Joi } = require('celebrate');
const { NAME_PATTERN, PASSWORD_PATTERN } = require('../../../common/consts/userConst');
//NUMBER_PATTERN
const CONFIG = require('../../../common/config');
const register = celebrate({
    body: Joi.object().keys({
        username: Joi.string().regex(NAME_PATTERN).required(),
        email: Joi.string().email().required(),
        fullName: Joi.string().required(),
        // siret: Joi.string().length(CONFIG.settings.siret_number).regex(NUMBER_PATTERN).empty(['', null]),
        // siren: Joi.string().length(CONFIG.settings.siren_number).regex(NUMBER_PATTERN).empty(['', null]),
        type: Joi.string().valid(CONFIG.settings.account_type).required(),
        address: Joi.object()
            .required()
            .keys({
                address1: Joi.string().required(),
                address2: Joi.string().empty(['', null]),
                zip: Joi.string().required(),
                city: Joi.string().required(),
                state: Joi.string().empty(['', null]), //... validation des pays et des états
            }),
        password: Joi.string().regex(PASSWORD_PATTERN).required(),
        isLegalNoticeAccepted: Joi.boolean().required(),
        newsLettre: Joi.boolean().required(),
    }),
});
const registerSocial = celebrate({
    body: Joi.object().keys({
        email: Joi.string().email().required(),
        fullName: Joi.string().required(),
        type: Joi.string().valid(['Admin', 'User']).required(),
        isLegalNoticeAccepted: Joi.boolean().required(),
        provider: Joi.string().valid(CONFIG.settings.provider_type).required(),
        newsLettre: Joi.boolean().required(),
    }),
});

const verifyEmail = celebrate({
    params: Joi.object().keys({
        email: Joi.string().email().required(),
    }),
});
const verifyUsername = celebrate({
    params: Joi.object().keys({
        username: Joi.string().regex(NAME_PATTERN).required(),
    }),
});
module.exports = { register, verifyEmail, verifyUsername, registerSocial };
