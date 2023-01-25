const Time = require('../time/time');

class Countdown extends Time {
    static MAX_COUNTDOWN_SECONDS = 86399; // 23:59:59
    static MIN_COUNTDOWN_SECONDS = 0; // 00:00:00

    constructor({ seconds = null, minutes = null, hours = null } = {}) {
        super({ seconds, minutes, hours });

        this.initialSeconds = null;
        this.interval = null;
        this.isStopped = false;
    }

    validateLimiter() {
        if (this.tSeconds > Countdown.MAX_COUNTDOWN_SECONDS) {
            this.tSeconds = Countdown.MAX_COUNTDOWN_SECONDS;
        } else if (this.tSeconds < Countdown.MIN_COUNTDOWN_SECONDS) {
            this.tSeconds = Countdown.MIN_COUNTDOWN_SECONDS;
        }
    }

    start(callBack) {
        if (this.interval) this.pause();
        if (this.isStopped) {
            this.tSeconds = this.initialSeconds;
            this.isStopped = false;
        }

        this.initialSeconds = this.tSeconds;
        this.interval = setInterval(() => {
            super.subSeconds(1);
            if (this.tSeconds === Countdown.MIN_COUNTDOWN_SECONDS) {
                callBack();
                this.pause();
            }
        }, 1000);
    }

    pause() {
        clearInterval(this.interval);
    }

    resetCountdown() {
        // name changed from "reset" to prevent override
        this.tSeconds = this.initialSeconds;
    }

    stop() {
        clearInterval(this.interval);
        this.isStopped = true;
    }
}

module.exports = Countdown;
