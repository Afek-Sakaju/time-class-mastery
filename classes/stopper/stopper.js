const Time = require('../time/time');

class Stopper extends Time {
    static MAX_STOPPER_SECONDS = 86399; // 23:59:59
    static MIN_STOPPER_SECONDS = 0; // 00:00:00

    constructor(autoStart = false) {
        super();

        this.interval = null;
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

        this.interval = setInterval(() => {
            super.addSeconds(1);
            if (this.tSeconds === Stopper.MAX_STOPPER_SECONDS) this.pause();
        }, 1000);
    }

    pause() {
        clearInterval(this.interval);
    }

    stop() {
        this.pause();
        this.isStopped = true;
    }
}

module.exports = Stopper;
