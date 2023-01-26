const Time = require('../time/time');

class Stopper extends Time {
    static MAX_STOPPER_SECONDS = 86399; // 23:59:59

    constructor(autoStart = false) {
        super({ seconds, minutes, hours });

        this.interval = null;
        this.isStopped = false;

        if (autoStart) this.start();
    }

    start() {
        if (this.interval) return;
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

    resetStopper() {
        // name changed from "reset" to prevent override
        super.reset();
        // it isn't forsure neccesary because i can just call reset method...
    }

    stop() {
        this.pause();
        this.isStopped = true;
    }
}

module.exports = Stopper;
