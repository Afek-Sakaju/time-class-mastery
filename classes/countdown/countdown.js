const Time = require('../time/time');

class Countdown extends Time {
    static MAX_COUNTDOWN_SECONDS = 86399; // 23:59:59
    static MIN_COUNTDOWN_SECONDS = 0; // 00:00:00

    constructor({ seconds = null, minutes = null, hours = null } = {}) {
        super({ seconds, minutes, hours });

        this.initialSeconds = null;
        this.intervalId = null;
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
        if (this.tSeconds === Countdown.MIN_COUNTDOWN_SECONDS) return;
        // maybe i should check for existance of active interval
        if (this.isStopped) {
            super.reset();
            this.isStopped = false;
        }

        this.initialSeconds = this.tSeconds;
        this.intervalId = setInterval(() => {
            super.subSeconds(1);
            if (this.tSeconds === Countdown.MIN_COUNTDOWN_SECONDS) {
                callBack();
                this.pause();
            }
        }, 1000);
    }

    pause() {
        clearInterval(this.intervalId);
    }

    reset() {
        this.tSeconds = this.initialSeconds;
    }

    stop() {
        this.pause();
        this.isStopped = true;
    }
}

module.exports = Countdown;
