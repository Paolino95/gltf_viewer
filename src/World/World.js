import { gltfViewer } from '@/GltfViewer.js';
import Environment from './Environment.js';
import Model from './Model.js';
import Floor from './Floor.js';
import Lights from './Lights.js';
import EventEmitter from '../utils/EventEmitter.js';

export default class World extends EventEmitter {
    constructor(callbacks = {}) {
        super();

        const { onSceneReady, onAnimationChange } = callbacks;

        this.scene = gltfViewer.scene;
        this.resources = gltfViewer.resources;
        this.time = gltfViewer.time;
        this.onSceneReady = onSceneReady;

        // Wait for resources
        this.resources.on('ready', () => {
            // Setup
            this.lights = new Lights();
            this.model = new Model(onAnimationChange);
            this.floor = new Floor();
            this.environment = new Environment();

            this.time.onNextTick(() => {
                this.onSceneReady();
            });
        });
    }

    update() {
        if (this.model) this.model.update();
    }
}
