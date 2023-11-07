import Experience from '@/Experience.js';
import Environment from './Environment.js';
import Model from './Model.js';

export default class World {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;

        // Wait for resources
        this.resources.on('ready', () => {
            // Setup
            this.model = new Model();
            this.environment = new Environment();

            this.resources.trigger('isWorldUploadEnded');
        });
    }

    update() {
        if (this.model) this.model.update();
    }
}
