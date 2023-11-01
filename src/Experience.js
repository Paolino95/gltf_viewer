import { Scene, Mesh } from 'three';

import Debug from '@/utils/Debug.js';
import Sizes from '@/utils/Sizes.js';
import Time from '@/utils/Time.js';
import Camera from '@/managers/Camera.js';
import Renderer from '@/managers/Renderer.js';
import Composer from '@/managers/Composer.js';
import World from '@/World/World.js';
import Resources from '@/utils/Resources.js';
import Helpers from '@/managers/Helpers';

import sources from '@/parameters/sources.js';

let instance = null;

export default class Experience {
    constructor(_canvas, _canvasContainer, _controlsContainer) {
        // Singleton
        if (instance) {
            return instance;
        }
        instance = this;

        // Global access
        window.experience = this;

        // Options
        this.canvas = _canvas;
        this.canvasContainer = _canvasContainer;

        // Setup
        this.debug = new Debug(_controlsContainer);
        this.sizes = new Sizes(this.canvasContainer);
        this.time = new Time();
        this.scene = new Scene();
        this.resources = new Resources(sources);
        this.camera = new Camera();
        this.renderer = new Renderer();
        this.world = new World();
        this.composer = new Composer(this.renderer, this.scene, this.camera);
        this.helpers = new Helpers();

        // Resize event
        this.sizes.on('resize', () => {
            this.resize();
        });

        // Time tick event
        this.time.on('tick', () => {
            this.update();
        });
    }

    resize() {
        this.camera.resize();
        this.renderer.resize();
        this.composer.resize();
    }

    update() {
        if (this.debug.active) this.debug.fpsGraph.begin();

        this.camera.update();
        this.world.update();

        if (this.composer === null) {
            this.renderer.update();
        } else {
            this.composer.update();
        }

        if (this.debug.active) this.debug.fpsGraph.end();
    }

    destroy() {
        this.sizes.off('resize');
        this.time.off('tick');

        // Traverse the whole scene
        this.scene.traverse(child => {
            // Test if it's a mesh
            if (child instanceof Mesh) {
                child.geometry.dispose();

                // Loop through the material properties
                for (const key in child.material) {
                    const value = child.material[key];

                    // Test if there is a dispose function
                    if (value && typeof value.dispose === 'function') {
                        value.dispose();
                    }
                }
            }
        });

        this.camera.controls.dispose();
        this.renderer.instance.dispose();
        this.composer.instance.dispose();

        if (this.debug.active) this.debug.ui.destroy();
    }
}
