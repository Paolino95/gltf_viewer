import EventEmitter from './EventEmitter.js';

export default class InteractionEvents extends EventEmitter {
    constructor(events) {
        super();

        const { pointerMove, doubleClick } = events;

        // Setup
        if (pointerMove)
            window.addEventListener('pointermove', e => {
                e.preventDefault();
                this.trigger('onPointerMove', [e]);
            });

        if (doubleClick)
            window.addEventListener('dblclick', e => {
                e.preventDefault();
                this.trigger('onDoubleClick');
            });
    }
}
