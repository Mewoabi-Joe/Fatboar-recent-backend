const { celebrate, Joi } = require('celebrate');
const { NAME_PATTERN } = require('../../../common/consts/userConst');
const deleteOwner = celebrate({
    params: Joi.object().keys({}),
});
const verifyUsername = celebrate({
    params: Joi.object().keys({
        username: Joi.string().regex(NAME_PATTERN).required(),
    }),
});
const addOwner = celebrate({
    body: Joi.object().keys({
        username: Joi.string().regex(NAME_PATTERN).required(),
    }),
});

module.exports = { addOwner, deleteOwner, verifyUsername };
