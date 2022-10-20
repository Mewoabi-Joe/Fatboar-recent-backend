let { Joi } = require('celebrate');
const joiObjectId = require('joi-objectid');

Joi.objectId = joiObjectId(Joi);

const JoiGeojson = Joi.extend((joi) => ({
    base: joi.array().length(2).items(joi.number()),
    name: 'geojson',
    language: {
        coordinate: 'must be a valid geojson coordinate',
    },
    rules: [
        {
            name: 'coordinate',
            validate(params, value, state, options) {
                const latitude = value[0];
                const longitude = value[1];

                if (latitude < -180 || latitude > 180) {
                    return this.createError('geojson.coordinate', {}, state, options);
                }

                if (longitude < -90 || longitude > 90) {
                    return this.createError('geojson.coordinate', {}, state, options);
                }

                return value;
            },
        },
    ],
}));

Joi.geojson = () => JoiGeojson.geojson();
