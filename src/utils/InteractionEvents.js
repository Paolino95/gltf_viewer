import EventEmitter from './EventEmitter.js';

export default class InteractionEvents extends EventEmitter {
    constructor() {
        super();

        // Setup
        window.addEventListener('pointermove', e => {
            e.preventDefault();
            this.trigger('onPointerMove', [e]);
        });

        // window.addEventListener('dblclick', e => {
        //     e.preventDefault();
        //     this.trigger('onDoubleClick');
        // });
    }
}
