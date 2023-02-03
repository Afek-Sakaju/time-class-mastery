const Time = require('../time/time');
const { validateBoolean } = require('../../utils/validators');

class Stopper extends Time {
    static MAX_STOPPER_SECONDS = 359999; // 99:59:59
    static MIN_STOPPER_SECONDS = 0; // 00:00:00

    constructor(autoStart = false) {
        super();

        validateBoolean(autoStart);
        super.reset();
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
