const randomToken = require('rand-token');
const CONFIG = require('../config');

const BASE58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
const BASE62 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

const DEFAULT_TOKEN_SIZE = 64;

const generateToken = (size) => {
    return randomToken.generate(size || DEFAULT_TOKEN_SIZE, BASE62);
};

const generateUserPassword = () => {
    return randomToken.generate(8, BASE58);
};

const generateRandomInt = (max, min) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
const generateTicketToken = async (user) => {
    const id = user._id.toString();
    let lastFive = id.substr(id.length - 5).toUpperCase();
    const currentDate = new Date();
    const expiration = Math.floor(
        currentDate.setSeconds(currentDate.getSeconds() + CONFIG.settings.ticket_jwt_lifetime).valueOf() / 1000,
    );
    return { text: `${generateToken(5).toUpperCase()}${lastFive}`, expiration: new Date(expiration * 1000) };
};
module.exports = {
    generateTicketToken,
    generateRandomInt,
    generateToken,
    generateUserPassword,
};
