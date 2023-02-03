const Time = require('../time/time');

class Countdown extends Time {
    static MAX_COUNTDOWN_SECONDS = 359999; // 23:59:59
    static MIN_COUNTDOWN_SECONDS = 0; // 00:00:00

    constructor({ seconds = null, minutes = null, hours = null } = {}) {
        super({ seconds, minutes, hours });

        this.callBack = null;
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

        this.callBack = callBack;
        this.initialSeconds = this.tSeconds;
        const intervalFunc = () => {
            if (this.tSeconds === Countdown.MIN_COUNTDOWN_SECONDS) {
                this.callBack();
                this.pause();
            } else super.subSeconds(1);
        };

        this.intervalId = setInterval(intervalFunc.bind(this), 1000);
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
