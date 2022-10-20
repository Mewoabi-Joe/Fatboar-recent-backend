const util = require('util');
const jwt = require('jsonwebtoken');
const jwt_sign = util.promisify(jwt.sign);
const jwt_verify = util.promisify(jwt.verify);

const CONFIG = require('../config');

const signUserAuthToken = async (user) => {
    const { secret } = CONFIG.authentication_credentials.jwt;

    if (!secret) {
        throw new Error('JWT secret missing in config');
    }

    const currentDate = new Date();
    const expiration = Math.floor(
        currentDate.setSeconds(currentDate.getSeconds() + CONFIG.settings.user_auth_jwt_lifetime).valueOf() / 1000,
    );

    const payload = {
        type: 'userAuth',
        userId: user._id,
        exp: expiration,
    };

    return {
        authToken: await jwt_sign(payload, secret),
        authExpiration: new Date(expiration * 1000),
    };
};

const verifyUserAuthToken = async (token) => {
    const { secret } = CONFIG.authentication_credentials.jwt;

    if (!secret) {
        throw new Error('JWT secret missing in config');
    }

    try {
        const decoded = await jwt_verify(token, secret);

        if (decoded.type !== 'userAuth') {
            return null;
        }

        return decoded;
    } catch (e) {
        return null;
    }
};

const signUserRefreshToken = async (user) => {
    const { secret } = CONFIG.authentication_credentials.jwt;

    if (!secret) {
        throw new Error('JWT secret missing in config');
    }

    const currentDate = new Date();
    const expiration = Math.floor(
        currentDate.setSeconds(currentDate.getSeconds() + CONFIG.settings.user_refresh_jwt_lifetime).valueOf() / 1000,
    );

    const payload = {
        type: 'userRefresh',
        userId: user._id,
        exp: expiration,
    };

    return {
        refreshToken: await jwt_sign(payload, secret),
        refreshExpiration: new Date(expiration * 1000),
    };
};

const verifyUserRefreshToken = async (token) => {
    const { secret } = CONFIG.authentication_credentials.jwt;

    if (!secret) {
        throw new Error('JWT secret missing in config');
    }

    try {
        const decoded = await jwt_verify(token, secret);

        if (decoded.type !== 'userRefresh') {
            return null;
        }

        return decoded;
    } catch (e) {
        return null;
    }
};

module.exports = {
    signUserAuthToken,
    verifyUserAuthToken,
    signUserRefreshToken,
    verifyUserRefreshToken,
};
