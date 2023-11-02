import {
    PathTracingRenderer,
    PhysicalPathTracingMaterial,
} from 'three-gpu-pathtracer';
import { MeshBasicMaterial, CustomBlending } from 'three';

import Experience from '@/Experience.js';
import { FullScreenQuad } from 'three/addons/postprocessing/Pass.js';

export default class PathTracer {
    constructor() {
        this.experience = new Experience();
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.camera = this.experience.camera;
        this.resources = this.experience.resources;
        this.renderer = this.experience.renderer;

        this.tiles = 2;

        // Wait for resources
        this.resources.on('ready', () => {
            // Setup

            this.setInstance();
        });
    }

    setInstance() {
        this.instance = new PathTracingRenderer(this.renderer.instance);
        this.instance.material = new PhysicalPathTracingMaterial();
        this.instance.material.filterGlossyFactor = 0.5;
        this.instance.material.backgroundBlur = 0.05;
        this.instance.tiles.set(this.tiles, this.tiles);
        this.instance.camera = this.camera.instance;

        this.blitQuad = new FullScreenQuad(
            new MeshBasicMaterial({
                map: this.instance.target.texture,
                blending: CustomBlending,
            })
        );
    }

    resize() {
        this.instance.setSize(
            this.sizes.width * this.resolutionScale * this.sizes.pixelRatio,
            this.sizes.height * this.resolutionScale * this.sizes.pixelRatio
        );
        this.instance.reset();
    }

    update() {
        this.instance.update();

        if (this.instance.samples < 1) {
            this.renderer.update();
        }

        this.renderer.instance.autoClear = false;
        this.blitQuad.material.map = this.instance.target.texture;
        this.blitQuad.render(this.renderer.instance);
        this.renderer.instance.autoClear = true;
    }
}
