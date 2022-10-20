Date.prototype.addYears = function (n) {
    const d = new Date(this);
    d.setFullYear(d.getFullYear() + n);
    return d;
};
Date.prototype.addDays = function (days) {
    const d = new Date(this);
    d.setDate(d.getDate() + days);
    return d;
};

Date.prototype.addHours = function (h) {
    const d = new Date(this);
    d.setTime(d.getTime() + h * 60 * 60 * 1000);
    return d;
};

Date.prototype.addMinutes = function (m) {
    const d = new Date(this);
    d.setTime(d.getTime() + m * 60 * 1000);
    return d;
};

Date.prototype.withoutTime = function () {
    const d = new Date(this);
    d.setHours(0, 0, 0, 0);
    return d;
};
