const Time = require('../time/time');

class Clock extends Time {
    static MAX_CLOCK_SECONDS = 86399; // 23:59:59
    static MIN_CLOCK_SECONDS = 0; // 00:00:00

    constructor(
        { seconds = null, minutes = null, hours = null } = {},
        autoStart = true
    ) {
        super({ seconds, minutes, hours });

        this.intervalId = null;

        if (autoStart) this.start();
    }

    validateLimiter() {
        if (this.tSeconds > Clock.MAX_CLOCK_SECONDS) {
            this.tSeconds = Clock.MAX_CLOCK_SECONDS;
        } else if (this.tSeconds < Clock.MIN_CLOCK_SECONDS) {
            this.tSeconds = Clock.MIN_CLOCK_SECONDS;
        }
    }

    start() {
        // maybe i should check for existance of active interval

        this.intervalId = setInterval(() => {
            if (this.tSeconds === Clock.MAX_CLOCK_SECONDS) this.pause();
            super.addSeconds(1);
        }, 1000);
    }

    pause() {
        clearInterval(this.intervalId);
    }
}

module.exports = Clock;
