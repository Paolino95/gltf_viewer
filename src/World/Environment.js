import {
    Mesh,
    MeshStandardMaterial,
    EquirectangularReflectionMapping,
} from 'three';
import Experience from '../Experience.js';
import { sceneParams } from '../parameters/ui.js';

export default class Environment {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.debug = this.experience.debug;

        // Debug Folder
        if (this.debug.active) {
            this.debugFolder = this.debug.pane.addFolder({
                title: 'environment',
            });
        }

        this.setEnvironmentMap();
    }

    setEnvironmentMap() {
        this.environmentMap = {};
        this.environmentMap.intensity = sceneParams.envMapIntensity;
        this.environmentMap.texture = this.resources.items.default;
        this.environmentMap.texture.mapping = EquirectangularReflectionMapping;

        this.scene.environment = this.environmentMap.texture;

        this.environmentMap.updateMaterials = () => {
            this.scene.traverse(child => {
                if (
                    child instanceof Mesh &&
                    child.material instanceof MeshStandardMaterial
                ) {
                    child.material.envMap = this.environmentMap.texture;
                    child.material.envMapIntensity =
                        this.environmentMap.intensity;
                    child.material.needsUpdate = true;
                }
            });
        };

        this.environmentMap.updateMaterials();

        // Debug
        if (this.debug.active) {
            this.debugFolder
                .addBinding(this.environmentMap, 'intensity', {
                    min: 0,
                    max: 4,
                    step: 0.1,
                })
                .on('change', this.environmentMap.updateMaterials);
        }
    }
}
