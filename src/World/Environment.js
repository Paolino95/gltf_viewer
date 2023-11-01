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

        this.environmentMap = {};
        this.environmentMap.texture = this.resources.items.default;

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

            // this.debugFolder
            //     .addBinding(this.scene, 'background', {
            //         label: 'Background Color',
            //         color: { type: 'float' },
            //     })
            //     .on('change', e => {
            //         this.scene.background = e.value;
            //         this.updateMaterials();
            //     });

            this.debugFolder
                .addButton({ title: 'update hdr' })
                .on('click', () => {
                    this.resources.inputButton.click();
                });
        }

        this.resources.on('updateHdr', url => {
            this.updateEnvironmentMap(url);
        });
    }

    setEnvironmentMap() {
        this.environmentMap.intensity = sceneParams.envMapIntensity;
        this.environmentMap.texture.mapping = EquirectangularReflectionMapping;

        this.scene.background = this.environmentMap.texture;
        this.scene.environment = this.environmentMap.texture;

        this.updateMaterials();
    }

    updateEnvironmentMap = hdrName => {
        const self = this;

        this.resources.loaders.rgbeLoader.load(hdrName, texture => {
            self.environmentMap.texture = texture;
            self.setEnvironmentMap();
        });
    };

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
}
