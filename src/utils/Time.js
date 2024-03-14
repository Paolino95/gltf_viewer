import EventEmitter from './EventEmitter.js';
import { size } from 'lodash-es';
export default class Time extends EventEmitter {
    constructor() {
        super();

        // Setup
        this.start = Date.now();
        this.current = this.start;
        this.elapsed = 0;
        this.tick = 0;
        this.delta = 16;
        this.callbacks = {};

        requestAnimationFrame(() => {
            this.updateTick();
        });
    }

    next() {
        this.tick += 1;
    }

    updateTick() {
        const currentTime = Date.now();
        this.delta = currentTime - this.current;
        this.current = currentTime;
        this.elapsed = this.current - this.start;

        this.next();
        this.trigger('tick');

        requestAnimationFrame(() => {
            this.updateTick();
        });
    }

    hasCallbacks() {
        return size(this.callbacks) > 0;
    }

    onNextTick(callback) {
        const nextTick = this.tick + 1;

        if (!(nextTick in this.callbacks)) {
            this.callbacks[nextTick] = [];
        }

        this.callbacks[nextTick].push(callback);
    }

    manageCallbacks() {
        if (!(this.tick in this.callbacks)) return;

        const callbacks = this.callbacks[this.tick];

        callbacks.forEach(callback => {
            callback();
        });

        delete this.callbacks[this.tick];
    }
}
