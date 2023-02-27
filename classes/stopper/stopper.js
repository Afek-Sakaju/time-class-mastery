const Time = require('../time/time');
const { assertBoolean } = require('../../utils/validators');
const { TIME_100H, TIME_ZERO } = require('../../utils/consts');

class Stopper extends Time {
    static MAX_STOPPER_SECONDS = TIME_100H;
    static MIN_STOPPER_SECONDS = TIME_ZERO;

    constructor(autoStart = false) {
        super({ seconds: 0, minutes: 0, hours: 0 });

        assertBoolean(autoStart);
        this.intervalId = null;
        this.isStopped = false;

        if (autoStart) this.start();
    }

    validateLimiter() {
        if (this.tSeconds > Stopper.MAX_STOPPER_SECONDS) {
            this.tSeconds = Stopper.MAX_STOPPER_SECONDS;
        } else if (this.tSeconds < Stopper.MIN_STOPPER_SECONDS) {
            this.tSeconds = Stopper.MIN_STOPPER_SECONDS;
        }
    }

    start() {
        const isStopperFinished = this.tSeconds === Stopper.MAX_STOPPER_SECONDS;

        if (isStopperFinished || this.intervalId) return;

        if (this.isStopped) {
            super.reset();
            this.isStopped = false;
        }

        this.intervalId = setInterval(() => {
            if (this.tSeconds === Stopper.MAX_STOPPER_SECONDS) this.pause();
            else super.addSeconds(1);
        }, 1000);
    }

    pause() {
        clearInterval(this.intervalId);
        this.intervalId = null;
    }

    stop() {
        this.pause();
        this.isStopped = true;
    }
}

module.exports = Stopper;
