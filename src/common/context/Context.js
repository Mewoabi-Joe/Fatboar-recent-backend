const data = {};

class Context {
    static set(key, value) {
        data[key] = value;
    }

    static get(key) {
        return data[key];
    }
}

module.exports = Context;
