const Time = require('../time/time');
const { assertBoolean } = require('../../utils/validators');
const { TIME_24H, TIME_ZERO } = require('../../utils/consts');

class Clock extends Time {
    static MAX_CLOCK_SECONDS = TIME_24H;
    static MIN_CLOCK_SECONDS = TIME_ZERO;

    constructor({ seconds = null, minutes = null, hours = null } = {}, autoStart = true) {
        super({ seconds, minutes, hours });

        assertBoolean(autoStart);
        this.intervalId = null;

        if (autoStart) this.start();
    }

    validateLimiter() {
        if (this.tSeconds > Clock.MAX_CLOCK_SECONDS) {
            this.tSeconds %= Clock.MAX_CLOCK_SECONDS + 1;
        } else if (this.tSeconds < Clock.MIN_CLOCK_SECONDS) {
            this.tSeconds = Clock.MIN_CLOCK_SECONDS;
        }
    }

    start() {
        if (this.intervalId) return;

        this.intervalId = setInterval(() => {
            if (this.tSeconds === Clock.MAX_CLOCK_SECONDS) this.reset();
            else super.addSeconds(1);
        }, 1000);
    }

    pause() {
        clearInterval(this.intervalId);
        this.intervalId = null;
    }

    gt(clock) {
        return this.tSeconds > clock.totalSeconds || false;
    }

    gte(clock) {
        return this.tSeconds >= clock.totalSeconds || false;
    }

    lt(clock) {
        return this.tSeconds < clock.totalSeconds || false;
    }

    lte(clock) {
        return this.tSeconds <= clock.totalSeconds || false;
    }
}

module.exports = Clock;
