class LoadingSpinner {
    private message = 'Loading';
    private interval = 100;
    private frames = ['|', '/', '-', '\\'];
    private currentFrame = 0;
    private spinnerInterval: NodeJS.Timeout | null = null;

    constructor(message = 'Loading', interval = 100) {
        Object.assign(this, { message, interval })
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