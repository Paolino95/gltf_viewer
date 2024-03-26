import { gltfViewer } from '@/GltfViewer.js';
import Environment from './Environment.js';
import Model from './Model.js';
import Floor from './Floor.js';
import Lights from './Lights.js';
import Animations from '../managers/Animations.js';
import EventEmitter from '../utils/EventEmitter.js';

export default class World extends EventEmitter {
    constructor(callbacks = {}) {
        super();

        const { onSceneReady, onBaseSceneReady, onAnimationChange } = callbacks;

        this.scene = gltfViewer.scene;
        this.resources = gltfViewer.resources;
        this.time = gltfViewer.time;
        this.onSceneReady = onSceneReady;
        this.onBaseSceneReady = onBaseSceneReady;

        // Wait for resources
        this.resources.on('baseResourceSceneReady', () => {
            // Setup
            this.lights = new Lights();
            this.model = new Model();
            this.floor = new Floor();
            this.environment = new Environment();
            this.trigger('baseSceneReady');
            this.onBaseSceneReady();
        });

        this.resources.on('totalResourceSceneReady', () => {
            this.time.onNextTick(() => {
                this.trigger('ready');
                this.onSceneReady();
                this.animations = new Animations(onAnimationChange);
            });
        });
    }

    update() {
        if (this.animations) this.animations.update();
    }
}
