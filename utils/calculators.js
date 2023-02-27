module.exports.convertSecondsToHoursUnit = function (sec) {
    return parseInt(`${sec / 60 / 60}`);
};

module.exports.convertSecondsToMinutesUnit = function (sec) {
    return parseInt(`${(sec / 60) % 60}`);
};

module.exports.convertSecondsToSecondsUnit = function (sec) {
    return parseInt(`${sec % 60}`);
};

const hoursToTotalSeconds = (module.exports.hoursToTotalSeconds = function (hours) {
    return hours * 3600;
});

const minutesToTotalSeconds = (module.exports.minutesToTotalSeconds = function (minutes) {
    return minutes * 60;
});

const timeUnitsToTotalSeconds = (module.exports.timeUnitsToTotalSeconds = function ({
    seconds,
    minutes,
    hours,
} = {}) {
    seconds = seconds ?? 0;
    minutes = minutes ?? 0;
    hours = hours ?? 0;

    return seconds + minutesToTotalSeconds(minutes) + hoursToTotalSeconds(hours);
});

module.exports.currentTimeToTotalSeconds = function () {
    const now = new Date();

    return timeUnitsToTotalSeconds({
        hours: now.getHours(),
        minutes: now.getMinutes(),
        seconds: now.getSeconds(),
    });
};
