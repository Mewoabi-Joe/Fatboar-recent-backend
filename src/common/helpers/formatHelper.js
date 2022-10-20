const parseNumber = (value) => {
    const number = Number(value);
    return isNaN(number) ? undefined : number;
};

module.exports = {
    parseNumber,
};
