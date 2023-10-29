import {
    Mesh,
    Color,
    MeshStandardMaterial,
    EquirectangularReflectionMapping,
} from 'three';
import Experience from '@/Experience.js';
import { sceneParams } from '@/parameters/ui.js';

export default class Environment {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.debug = this.experience.debug;

        this.setEnvironmentMap();

        // Debug Folder
        if (this.debug.active) {
            this.debugFolder = this.debug.pane.addFolder({
                title: 'environment',
            });

            this.debugFolder
                .addBinding(this.environmentMap, 'intensity', {
                    min: 0,
                    max: 4,
                    step: 0.1,
                })
                .on('change', this.updateMaterials);

            this.debugFolder
                .addBinding(this.scene, 'background', {
                    label: 'Background Color',
                    color: { type: 'float' },
                })
                .on('change', e => {
                    this.scene.background = e.value;
                    this.updateMaterials();
                });
        }

        this.resources.on('updateHdr', url => {
            this.updateHdr(url);
        });
    }

    setEnvironmentMap() {
        this.environmentMap = {};
        this.environmentMap.intensity = sceneParams.envMapIntensity;
        this.environmentMap.texture = this.resources.items.default;
        this.environmentMap.texture.mapping = EquirectangularReflectionMapping;

        this.scene.background = new Color(0x000000);
        this.scene.environment = this.environmentMap.texture;

        this.updateMaterials();
    }

    updateMaterials = () => {
        this.scene.traverse(child => {
            if (
                child instanceof Mesh &&
                child.material instanceof MeshStandardMaterial
            ) {
                child.material.envMap = this.environmentMap.texture;
                child.material.envMapIntensity = this.environmentMap.intensity;
                child.material.needsUpdate = true;
            }
        });
    };

    updateHdr = hdrName => {
        this.resources.loaders.rgbeLoader.load(hdrName, texture => {
            this.environmentMap.texture.mapping =
                EquirectangularReflectionMapping;

            this.scene.environment = texture;
        });
    };
}
