import EventEmitter from './EventEmitter.js';

export default class Sizes extends EventEmitter {
    constructor(container) {
        super();

        // Setup
        this.width = container.clientWidth;
        this.height = container.clientHeight;
        this.pixelRatio = Math.min(window.devicePixelRatio, 2);

        // Resize event
        window.addEventListener('resize', () => {
            this.width = container.clientWidth;
            this.height = container.clientHeight;
            this.pixelRatio = Math.min(window.devicePixelRatio, 2);

            this.trigger('resize');
        });
    }
}
