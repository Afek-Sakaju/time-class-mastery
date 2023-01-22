const Time = require('../time/time');
const { MAX_CLOCK_SECONDS, MIN_CLOCK_SECONDS } = require('./utils/consts');

class Clock extends Time {
    static MAX_SECONDS = MAX_CLOCK_SECONDS;
    static MIN_SECONDS = MIN_CLOCK_SECONDS;

    constructor(
        { seconds = null, minutes = null, hours = null } = {},
        autoStart = true
    ) {
        super({ seconds, minutes, hours });

        this.interval = null;

        if (autoStart) this.start();
    }

    validateLimiter() {
        if (this.tSeconds > Clock.MAX_SECONDS) {
            this.tSeconds = Clock.MAX_SECONDS;
        } else if (this.tSeconds < Clock.MIN_SECONDS) {
            this.tSeconds = Clock.MIN_SECONDS;
        }
    }

    start() {
        if (this.interval) return;

        this.interval = setInterval(() => {
            super.addSeconds(1);
            if (this.tSeconds === MAX_CLOCK_SECONDS) this.pause();
        }, 1000);
    }

    pause() {
        clearInterval(this.interval);
    }
}

module.exports = Clock;
