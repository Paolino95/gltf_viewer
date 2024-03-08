import { Vector2 } from 'three';
import EventEmitter from './EventEmitter';
import Experience from '../Experience';

export default class Mouse extends EventEmitter {
    constructor(container) {
        super();

        this.pointer = new Vector2();
        this.experience = new Experience();
        this.sizes = this.experience.sizes;
        this.canvas = this.experience.canvas;

        this.canvasRect = this.canvas.getBoundingClientRect();

        container.addEventListener('mousemove', event => {
            const mouseX = event.clientX - this.canvasRect.left;
            const mouseY = event.clientY - this.canvasRect.top;

            this.pointer.x = (mouseX / this.sizes.width) * 2 - 1;
            this.pointer.y = -(mouseY / this.sizes.height) * 2 + 1;

            this.trigger('mousemove');
        });
    }
}
