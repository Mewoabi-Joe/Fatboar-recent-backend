const convertMillisecondsToReadableTime = (ms) => {
    let day, hour, minute, second;
    second = Math.floor(ms / 1000);
    minute = Math.floor(second / 60);
    second = second % 60;
    hour = Math.floor(minute / 60);
    minute = minute % 60;
    day = Math.floor(hour / 24);
    hour = hour % 24;

    return (
        (day > 1 ? day + ' days ' : day === 1 ? '1 day ' : '') +
        (hour > 1 ? hour + ' hours ' : hour === 1 ? '1 hour ' : '') +
        (minute > 1 ? minute + ' minutes ' : minute === 1 ? '1 minute ' : '') +
        (second > 1 ? second + ' seconds ' : second === 1 ? '1 second ' : '')
    ).trim();
};

module.exports = {
    convertMillisecondsToReadableTime,
};
