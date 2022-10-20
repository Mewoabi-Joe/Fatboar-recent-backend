const { celebrate, Joi } = require('celebrate');

const sendConfirmEmail = celebrate({
    params: Joi.object().keys({}),
});
const mailChimp = celebrate({
    params: Joi.object().keys({}),
});
const sendinblue = celebrate({
    params: Joi.object().keys({}),
});

const confirmEmail = celebrate({
    query: Joi.object().keys({
        t: Joi.string().required(),
    }),
});

module.exports = { sendConfirmEmail, confirmEmail, mailChimp, sendinblue };
