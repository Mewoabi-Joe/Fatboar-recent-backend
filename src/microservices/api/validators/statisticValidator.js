const { celebrate, Joi } = require('celebrate');

const getStatistic = celebrate({
    params: Joi.object().keys({}),
});

const getCarWinner = celebrate({
    params: Joi.object().keys({}),
});
module.exports = { getStatistic, getCarWinner };
