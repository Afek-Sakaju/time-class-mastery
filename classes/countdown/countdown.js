const Time = require('../time/time');

class Countdown extends Time {
    static MAX_COUNTDOWN_SECONDS = 359999; // 23:59:59
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
        const isFinishedCountdown = this.tSeconds === Countdown.MIN_COUNTDOWN_SECONDS;
        if (isFinishedCountdown || this.intervalId) return;

        if (this.isStopped) {
            super.reset();
            this.isStopped = false;
        }

        this.initialSeconds = this.tSeconds;

        this.intervalId = setInterval(
            (() => {
                if (this.tSeconds === Countdown.MIN_COUNTDOWN_SECONDS) {
                    callBack();
                    this.pause();
                } else this.subSeconds(1);
            }).bind(this),
            1000
        );
    }
    //    TypeError: this.callBack is not a function

    pause() {
        clearInterval(this.intervalId);
        this.intervalId = null;
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
