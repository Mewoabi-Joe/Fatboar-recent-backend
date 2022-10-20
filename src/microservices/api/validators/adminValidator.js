const { celebrate, Joi } = require('celebrate');

const winner = celebrate({
    params: Joi.object().keys({}),
});
const byIdentifier = celebrate({
    params: Joi.object().keys({
        identifier: Joi.string().required(),
    }),
});
const byId = celebrate({
    params: Joi.object().keys({
        id: Joi.objectId().required(),
    }),
});
const users = celebrate({
    query: Joi.object().keys({
        limit: Joi.number().integer(),
        offset: Joi.number().integer(),
    }),
});
const tickets = celebrate({
    query: Joi.object().keys({
        limit: Joi.number().integer(),
        offset: Joi.number().integer(),
        status: Joi.string().valid(['Pending', 'Used']),
    }),
});

module.exports = { byIdentifier, byId, users, tickets, winner };
