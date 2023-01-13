const Time = require('../time/time');
const {
    MAX_STOPPER_SECONDS,
    MIN_STOPPER_SECONDS,
} = require('../stopper/utils/consts');

class Stopper extends Time {
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
        if (this.tSeconds > MAX_STOPPER_SECONDS) {
            this.tSeconds = MAX_STOPPER_SECONDS;
        } else if (this.tSeconds < MIN_STOPPER_SECONDS) {
            this.tSeconds = MIN_STOPPER_SECONDS;
        }
    }

    start() {
        if (this.interval) return;

        this.initialSeconds = this.tSeconds;
        this.interval = setInterval(() => {
            super.subSeconds(1);
            if (this.tSeconds === MIN_STOPPER_SECONDS) this.pause();
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

module.exports = Stopper;
