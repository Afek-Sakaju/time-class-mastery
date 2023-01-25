const Time = require('../time/time');

class Countdown extends Time {
    static MAX_COUNTDOWN_SECONDS = 86399; // 23:59:59
    static MIN_COUNTDOWN_SECONDS = 0; // 00:00:00

    constructor(
        { seconds = null, minutes = null, hours = null } = {},
        autoStart = false
    ) {
        super({ seconds, minutes, hours });

        this.initialSeconds = null;
        this.interval = null;

        if (autoStart) this.start();
    }

    validateLimiter() {
        if (this.tSeconds > Countdown.MAX_COUNTDOWN_SECONDS) {
            this.tSeconds = Countdown.MAX_COUNTDOWN_SECONDS;
        } else if (this.tSeconds < Countdown.MIN_COUNTDOWN_SECONDS) {
            this.tSeconds = Countdown.MIN_COUNTDOWN_SECONDS;
        }
    }

    start() {
        if (this.interval) return;

        this.initialSeconds = this.tSeconds;
        this.interval = setInterval(() => {
            super.subSeconds(1);
            if (this.tSeconds === Countdown.MIN_COUNTDOWN_SECONDS) this.pause();
        }, 1000);
    }

    pause() {
        clearInterval(this.interval);
    }

    stop() {
        clearInterval(this.interval);
        this.tSeconds = this.initialSeconds;
    }
}

module.exports = Countdown;
