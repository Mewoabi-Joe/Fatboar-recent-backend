const fs = require('fs');

const getFileTextOrNullSync = (path) => {
    try {
        return fs.readFileSync(path, 'utf8');
    } catch (e) {
        return null;
    }
};

module.exports = {
    getFileTextOrNullSync,
};
