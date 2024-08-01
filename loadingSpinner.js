class LoadingSpinner {
    constructor(message = 'Loading', interval = 100) {
        this.message = message;
        this.interval = interval;
        this.frames = ['|', '/', '-', '\\'];
        this.currentFrame = 0;
        this.spinnerInterval = null;
    }

    start() {
        if (this.spinnerInterval) return;

        this.spinnerInterval = setInterval(() => {
            process.stdout.write(`\r${this.frames[this.currentFrame++ % this.frames.length]} ${this.message}...`);
        }, this.interval);
    }

    stop() {
        if (this.spinnerInterval) {
            clearInterval(this.spinnerInterval);
            this.spinnerInterval = null;
            process.stdout.write(`\r${' '.repeat(this.message.length + 10)}\r`);
            console.log('')
        }
    }
}

export { LoadingSpinner };