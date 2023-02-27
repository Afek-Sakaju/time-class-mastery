const Time = require('../time/time');
const { TIME_100H, TIME_ZERO } = require('../../utils/consts');

class Countdown extends Time {
    static MAX_COUNTDOWN_SECONDS = TIME_100H;
    static MIN_COUNTDOWN_SECONDS = TIME_ZERO;

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
