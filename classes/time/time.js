const {
    convertSecondsToHoursUnit,
    convertSecondsToMinutesUnit,
    convertSecondsToSecondsUnit,
    timeUnitsToTotalSeconds,
    currentTimeToTotalSeconds,
    hoursToTotalSeconds,
    minutesToTotalSeconds,
} = require('../../utils/calculators');
const { TIME_100H } = require('../../utils/consts');
const { assertNumber } = require('../../utils/validators');

class Time {
    static MAX_TIME = TIME_100H;
    static MIN_TIME = -TIME_100H;

    constructor({ seconds = null, minutes = null, hours = null } = {}) {
        assertNumber(seconds, true);
        assertNumber(minutes, true);
        assertNumber(hours, true);

        const shouldSetToCurrentTime =
            seconds === null && minutes === null && hours === null;

        this.tSeconds = shouldSetToCurrentTime // tSeconds refers to = totalSeconds
            ? currentTimeToTotalSeconds()
            : timeUnitsToTotalSeconds({ seconds, minutes, hours });

        this.validateLimiter();
    }

    validateLimiter() {
        if (this.tSeconds > Time.MAX_TIME) {
            this.tSeconds = Time.MAX_TIME;
        } else if (this.tSeconds < Time.MIN_TIME) {
            this.tSeconds = Time.MIN_TIME;
        }
    }

    get hours() {
        return convertSecondsToHoursUnit(this.tSeconds);
    }

    set hours(hours) {
        assertNumber(hours);

        this.tSeconds = timeUnitsToTotalSeconds({
            hours: hours,
            minutes: this.minutes,
            seconds: this.seconds,
        });

        this.validateLimiter();
    }

    get minutes() {
        return convertSecondsToMinutesUnit(this.tSeconds);
    }

    set minutes(minutes) {
        assertNumber(minutes);

        this.tSeconds = timeUnitsToTotalSeconds({
            seconds: this.seconds,
            minutes,
            hours: this.hours,
        });

        this.validateLimiter();
    }

    get seconds() {
        return convertSecondsToSecondsUnit(this.tSeconds);
    }

    set seconds(seconds) {
        assertNumber(seconds);

        this.tSeconds = timeUnitsToTotalSeconds({
            hours: this.hours,
            minutes: this.minutes,
            seconds: seconds,
        });

        this.validateLimiter();
    }

    get totalSeconds() {
        return this.tSeconds;
    }

    addHours(hours) {
        assertNumber(hours);
        this.tSeconds += hoursToTotalSeconds(hours);
        this.validateLimiter();
    }

    addMinutes(minutes) {
        assertNumber(minutes);
        this.tSeconds += minutesToTotalSeconds(minutes);
        this.validateLimiter();
    }

    addSeconds(seconds) {
        assertNumber(seconds);
        this.tSeconds += seconds;
        this.validateLimiter();
    }

    subHours(hours) {
        assertNumber(hours);
        this.tSeconds -= hoursToTotalSeconds(hours);
        this.validateLimiter();
    }

    subMinutes(minutes) {
        assertNumber(minutes);
        this.tSeconds -= minutesToTotalSeconds(minutes);
        this.validateLimiter();
    }

    subSeconds(seconds) {
        assertNumber(seconds);
        this.tSeconds -= seconds;
        this.validateLimiter();
    }

    resetHours() {
        this.hours = 0;
    }

    resetMinutes() {
        this.minutes = 0;
    }

    resetSeconds() {
        this.seconds = 0;
    }

    reset() {
        this.tSeconds = 0;
    }

    addTime(time2) {
        if (!(time2 instanceof Time)) {
            throw Error('Invalid time input');
        }

        this.tSeconds += time2.totalSeconds;
        this.validateLimiter();
    }

    subTime(time2) {
        if (!(time2 instanceof Time)) {
            throw Error('Invalid time input');
        }

        this.tSeconds -= time2.totalSeconds;
        this.validateLimiter();
    }

    toString(format = 'HH:MM:SS') {
        if (typeof format !== 'string') {
            throw Error('Format options must contain one of the following: HH/MM/SS');
        }
        const sign = this.tSeconds >= 0;

        return (
            (sign ? '' : '-') +
            format
                .replace('MM', `${Math.abs(this.minutes)}`.padStart(2, '0'))
                .replace('SS', `${Math.abs(this.seconds)}`.padStart(2, '0'))
                .replace('HH', `${Math.abs(this.hours)}`.padStart(2, '0'))
        );
    }
}

module.exports = Time;
