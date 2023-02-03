const Time = require('../time/time');

class Stopper extends Time {
    static MAX_STOPPER_SECONDS = 359999; // 99:59:59
    static MIN_STOPPER_SECONDS = 0; // 00:00:00

    constructor(autoStart = false) {
        super();

        this.intervalId = null;
        this.isStopped = false;
        this.tSeconds = 0;

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
        if (this.tSeconds === Stopper.MAX_STOPPER_SECONDS) return;
        if (this.isStopped) {
            this.reset();
            this.isStopped = false;
        }

        this.intervalId = setInterval(() => {
            super.addSeconds(1);
            if (this.tSeconds === Stopper.MAX_STOPPER_SECONDS) this.pause();
        }, 1000);
    }

    pause() {
        clearInterval(this.intervalId);
    }

    stop() {
        this.pause();
        this.isStopped = true;
    }
}

module.exports = Stopper;
