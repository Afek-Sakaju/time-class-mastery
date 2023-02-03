const Time = require('../time/time');

class Clock extends Time {
    static MAX_CLOCK_SECONDS = 86399; // 23:59:59
    static MIN_CLOCK_SECONDS = 0; // 00:00:00

    constructor({ seconds = null, minutes = null, hours = null } = {}, autoStart = true) {
        super({ seconds, minutes, hours });

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
