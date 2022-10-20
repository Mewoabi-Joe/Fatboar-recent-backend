const { Joi } = require('celebrate');
const normalizeEmail = require('normalize-email');
const CONFIG = require('../config');

const validateNumber = (value, lenght) => {
    return value.length === lenght && !isNaN(value);
};

const validateAndNormalizeEmail = async (value) => {
    try {
        const email = await Joi.string().email().validate(value);
        return normalizeEmail(email);
    } catch (err) {
        return null;
    }
};

const validateAndNormalizeBirthDate = (value) => {
    const birthDate = new Date(value).withoutTime();
    const limit = new Date().withoutTime().addYears(CONFIG.settings.minimum_age_of_use * -1);

    if (birthDate > limit) {
        return;
    }

    return birthDate;
};
const isSIRET = (siret) => {
    return verify(siret, 14);
};

const isSIREN = (siren) => {
    return verify(siren, 9);
};

function verify(number, size) {
    if (isNaN(number) || number.length !== size) return false;
    let bal = 0;
    let total = 0;
    for (let i = size - 1; i >= 0; i--) {
        let step = (number.charCodeAt(i) - 48) * (bal + 1);
        /*if (step>9) { step -= 9; }
         total += step;*/
        total += step > 9 ? step - 9 : step;
        bal = 1 - bal;
    }
    return total % 10 === 0;
}
module.exports = {
    validateNumber,
    validateAndNormalizeEmail,
    validateAndNormalizeBirthDate,
    isSIREN,
    isSIRET,
};
