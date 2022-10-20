const { celebrate, Joi } = require('celebrate');
const { NAME_PATTERN } = require('../../../common/consts/userConst');

const getInfos = celebrate({
    params: Joi.object().keys({}),
});

const deleteUser = celebrate({
    params: Joi.object().keys({}),
});

const updateInfos = celebrate({
    body: Joi.object().keys({
        username: Joi.string().empty(['', null]).regex(NAME_PATTERN),
        fullName: Joi.string().empty(['', null]),
        address: Joi.object()
            .empty(['', null])
            .keys({
                address1: Joi.string().empty(['', null]),
                address2: Joi.string().empty(['', null]),
                zip: Joi.string().empty(['', null]),
                city: Joi.string().empty(['', null]),
                state: Joi.string().empty(['', null]), //... validation des pays et des états
                country: Joi.string().empty(['', null]),
            }),
    }),
});

module.exports = { getInfos, updateInfos, deleteUser };
