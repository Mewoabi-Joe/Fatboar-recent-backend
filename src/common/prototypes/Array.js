Array.prototype.asyncForEach = async function (callback) {
    for (let index = 0; index < this.length; index++) {
        await callback(this[index], index, this);
    }
};

Array.prototype.distinct = function () {
    let j = {};
    this.forEach(function (v) {
        j[v + '::' + typeof v] = v;
    });
    return Object.keys(j).map(function (v) {
        return j[v];
    });
};

Array.prototype.sum = function () {
    let sum = 0;
    this.forEach((item) => {
        sum += item || 0;
    });
    return sum;
};
