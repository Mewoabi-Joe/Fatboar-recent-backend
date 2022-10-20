const crypto = require('crypto');
const bcrypt = require('bcrypt');

const getShortHash = (str, size = 8) => {
    return crypto.createHash('md5').update(str).digest('hex').substr(0, size);
};

const getSha256Base64Hash = (str) => {
    return crypto.createHash('sha256').update(str).digest('base64');
};

const hashPassword = async (password) => {
    return bcrypt.hash(password, 10);
};

const comparePassword = async (password, password_hash) => {
    if (!password_hash) {
        return false;
    }

    return bcrypt.compare(password, password_hash);
};

module.exports = {
    getShortHash,
    getSha256Base64Hash,
    hashPassword,
    comparePassword,
};
