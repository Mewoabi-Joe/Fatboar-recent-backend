const { celebrate, Joi } = require('celebrate');

const getTicket = celebrate({
    params: Joi.object().keys({}),
});
const getHistoric = celebrate({
    params: Joi.object().keys({}),
});
const getLegalNotice = celebrate({
    params: Joi.object().keys({}),
});

const checkTicket = celebrate({
    body: Joi.object().keys({
        token: Joi.string().required(),
    }),
});

module.exports = { getTicket, checkTicket, getHistoric, getLegalNotice };
