const {
    convertSecondsToHoursUnit,
    convertSecondsToMinutesUnit,
    convertSecondsToSecondsUnit,
    timeUnitsToTotalSeconds,
    currentTimeToTotalSeconds,
    hoursToTotalSeconds,
    minutesToTotalSeconds,
} = require('./utils/calculators');
const { validateNumber } = require('./utils/validators');
const { MAX_TIME_SECONDS, MIN_TIME_SECONDS } = require('./utils/consts');

class Time {
    #seconds;

    constructor({ seconds = null, minutes = null, hours = null } = {}) {
        validateNumber(seconds, true);
        validateNumber(minutes, true);
        validateNumber(hours, true);

        const shouldSetToCurrentTime =
            seconds === null && minutes === null && hours === null;

        this.#seconds = shouldSetToCurrentTime
            ? currentTimeToTotalSeconds()
            : timeUnitsToTotalSeconds({ seconds, minutes, hours });

        this.validateLimiter();
    }

    validateLimiter() {
        if (this.#seconds > MAX_TIME_SECONDS) {
            this.#seconds = MAX_TIME_SECONDS;
        } else if (this.#seconds < MIN_TIME_SECONDS) {
            this.#seconds = MIN_TIME_SECONDS;
        }
    }

    get hours() {
        return convertSecondsToHoursUnit(this.#seconds);
    }

    set hours(hours) {
        validateNumber(hours);

        this.#seconds = timeUnitsToTotalSeconds({
            hours: hours,
            minutes: this.minutes,
            seconds: this.seconds,
        });

        this.validateLimiter();
    }

    get minutes() {
        return convertSecondsToMinutesUnit(this.#seconds);
    }

    set minutes(minutes) {
        validateNumber(minutes);

        this.#seconds = timeUnitsToTotalSeconds({
            seconds: this.seconds,
            minutes,
            hours: this.hours,
        });

        this.validateLimiter();
    }

    get seconds() {
        return convertSecondsToSecondsUnit(this.#seconds);
    }

    set seconds(seconds) {
        validateNumber(seconds);

        this.#seconds = timeUnitsToTotalSeconds({
            hours: this.hours,
            minutes: this.minutes,
            seconds: seconds,
        });

        this.validateLimiter();
    }

    get totalSeconds() {
        return this.#seconds;
    }

    addHours(hours) {
        validateNumber(hours);
        this.#seconds += hoursToTotalSeconds(hours);
        this.validateLimiter();
    }

    addMinutes(minutes) {
        validateNumber(minutes);
        this.#seconds += minutesToTotalSeconds(minutes);
        this.validateLimiter();
    }

    addSeconds(seconds) {
        validateNumber(seconds);
        this.#seconds += seconds;
        this.validateLimiter();
    }

    subHours(hours) {
        validateNumber(hours);
        this.#seconds -= hoursToTotalSeconds(hours);
        this.validateLimiter();
    }

    subMinutes(minutes) {
        validateNumber(minutes);
        this.#seconds -= minutesToTotalSeconds(minutes);
        this.validateLimiter();
    }

    subSeconds(seconds) {
        validateNumber(seconds);
        this.#seconds -= seconds;
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
        this.#seconds = 0;
    }

    addTime(time2) {
        if (!(time2 instanceof Time)) {
            throw Error('Invalid time input');
        }

        this.#seconds += time2.totalSeconds;
        this.validateLimiter();
    }

    subTime(time2) {
        if (!(time2 instanceof Time)) {
            throw Error('Invalid time input');
        }

        this.#seconds -= time2.totalSeconds;
        this.validateLimiter();
    }

    toString(format = 'HH:MM:SS') {
        if (typeof format !== 'string') {
            throw Error(
                'Format options must contain one of the following: HH/MM/SS'
            );
        }
        const sign = this.#seconds >= 0;

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
