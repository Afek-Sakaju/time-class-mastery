const Time = require('../time/time');
const { MAX_CLOCK_SECONDS, MIN_CLOCK_SECONDS } = require('./utils/consts');

class Clock extends Time {
    constructor(
        { seconds = null, minutes = null, hours = null } = {},
        autoStart = true
    ) {
        super({ seconds, minutes, hours });

        this.interval = null;

        if (autoStart) this.start();
    }

    validateLimiter() {
        if (this.tSeconds > MAX_CLOCK_SECONDS) {
            this.tSeconds = MAX_CLOCK_SECONDS;
        } else if (this.tSeconds < MIN_CLOCK_SECONDS) {
            this.tSeconds = MIN_CLOCK_SECONDS;
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
