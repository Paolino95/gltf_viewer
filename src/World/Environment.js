import {
    Mesh,
    MeshStandardMaterial,
    EquirectangularReflectionMapping,
} from 'three';
import Experience from '../Experience.js';

export default class Environment {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.debug = this.experience.debug;

        // Debug
        if (this.debug.active) {
            // this.debugFolder = this.debug.ui.addFolder('environment');
        }

        this.setEnvironmentMap();
    }

    setEnvironmentMap() {
        this.environmentMap = {};
        this.environmentMap.intensity = 1;
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
                .add(this.environmentMap, 'intensity')
                .name('envMapIntensity')
                .min(0)
                .max(4)
                .step(0.001)
                .onChange(this.environmentMap.updateMaterials);
        }
    }
}
