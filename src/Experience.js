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
import PathTracer from '@/managers/PathTracer';
import sources from '@/parameters/sources.js';

import { RENDERER_COMPOSER, RENDERER_PATH_TRACER } from '@/constants';

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
        this.pathTracer = new PathTracer();
        this.helpers = new Helpers();

        this.rendererInUse = RENDERER_COMPOSER;

        // Resize event
        this.sizes.on('resize', () => {
            this.resize();
        });

        // Time tick event
        this.time.on('tick', () => {
            this.update();
        });

        this.camera.on('OrbitsChange', () => {
            if (this.pathTracer && this.rendererInUse === RENDERER_PATH_TRACER)
                this.pathTracer.instance.reset();
        });
    }

    resize() {
        this.camera.resize();
        this.renderer.resize();
        this.composer.resize();
        if (this.pathTracer && this.rendererInUse === RENDERER_PATH_TRACER)
            this.pathTracer.resize();
    }

    update() {
        if (this.debug.active) this.debug.fpsGraph.begin();

        this.camera.update();
        this.world.update();

        if (
            this.composer.instance &&
            this.rendererInUse === RENDERER_COMPOSER
        ) {
            this.composer.update();
        } else {
            this.renderer.update();
        }

        if (this.pathTracer && this.rendererInUse === RENDERER_PATH_TRACER)
            this.pathTracer.update();

        if (this.debug.active) this.debug.fpsGraph.end();
    }

    dispose() {
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
        this.pathTracer.instance.dispose();

        if (this.debug.active) this.debug.pane.dispose();
    }
}
