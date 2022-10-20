Number.prototype.toDigit = function (n) {
    return ('0'.repeat(n) + this).slice(-n);
};
