import EventEmitter from './EventEmitter.js';

export default class Time extends EventEmitter {
    constructor() {
        super();

        // Setup
        this.start = Date.now();
        this.current = this.start;
        this.elapsed = 0;
        this.tick = 0;
        this.delta = 16;

        window.requestAnimationFrame(() => {
            this.updateTick();
        });
    }

    updateTick() {
        const currentTime = Date.now();
        this.delta = currentTime - this.current;
        this.current = currentTime;
        this.elapsed = this.current - this.start;

        this.tick = this.tick + 1;
        this.trigger('tick');

        window.requestAnimationFrame(() => {
            this.updateTick();
        });
    }

    // onNextTick(callback) {
    //     this.tick = this.tick + 1;

    // }
}
