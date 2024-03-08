import { experience } from '@/Experience.js';
import Environment from './Environment.js';
import Model from './Model.js';
import Floor from './Floor.js';
import Lights from './Lights.js';

export default class World {
    constructor() {
        this.scene = experience.scene;
        this.resources = experience.resources;

        // Wait for resources
        this.resources.on('ready', () => {
            // Setup
            this.lights = new Lights();
            this.model = new Model();
            this.floor = new Floor();
            this.environment = new Environment();
        });
    }

    update() {
        if (this.model) this.model.update();
    }
}
