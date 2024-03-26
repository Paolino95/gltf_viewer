import { Mesh } from 'three';
import { ENV_MAP_INTENSITY } from '@/constants';
import { gltfViewer } from '@/GltfViewer.js';

import { RESOURCES_MAX_PRIORITY } from '@/constants';

export default class Model {
    constructor() {
        this.scene = gltfViewer.scene;
        this.resources = gltfViewer.resources;
        this.debug = gltfViewer.debug;
        this.world = gltfViewer.world;

        this.resource = [];

        // Debug
        if (this.debug.active) {
            this.debugFolder = this.debug.pane.addFolder({
                title: 'Model Parameters',
                expanded: false,
            });

            this.debugFolder
                .addButton({ title: 'update Model' })
                .on('click', () => {
                    this.resources.inputButton.click();
                });
        }

        this.resources.on('updateGlb', url => {
            this.updateModels(url);
        });

        this.world.on('baseSceneReady', () => {
            if (
                !this.resources.items.info ||
                !this.resources.items.info.multipleModel
            ) {
                this.resource.push(
                    this.resources.items[this.resources.modelName]
                );
                this.setModels(this.resource);
                return;
            }

            this.computeHighPriorityModelResources();
            this.resources.loadModel(this.resources.lowerPriorityModels);
        });

        this.world.on('ready', () => {
            if (
                this.resources.items.info &&
                this.resources.items.info.multipleModel
            ) {
                this.computeLowerPriorityModelResources();
                return;
            }
        });
    }

    computeHighPriorityModelResources() {
        const resource = [];

        if (
            !this.resources.items.info ||
            !this.resources.items.info.multipleModel
        ) {
            resource.push(this.resources.items[this.resources.modelName]);
            this.resource.push(this.resources.items[this.resources.modelName]);
            this.setModels(resource);
            return;
        }

        const highPriorityModels = this.resources.items.info.models.filter(
            model => model.priority === RESOURCES_MAX_PRIORITY
        );

        for (const model in highPriorityModels) {
            const id = highPriorityModels[model].id;

            this.resource.push(this.resources.items[id]);
            resource.push(this.resources.items[id]);
        }

        this.setModels(resource);
        return;
    }

    computeLowerPriorityModelResources() {
        const resource = [];

        const lowerPriorityModels = this.resources.items.info.models.filter(
            model => model.priority !== RESOURCES_MAX_PRIORITY
        );

        for (const model in lowerPriorityModels) {
            const id = lowerPriorityModels[model].id;

            this.resource.push(this.resources.items[id]);
            resource.push(this.resources.items[id]);
        }

        this.setModels(resource);
        return;
    }

    setModels(resource) {
        resource.forEach(model => {
            this.scene.add(model.scene);
        });

        this.scene.traverse(child => {
            if (child instanceof Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                child.material.envMapIntensity = ENV_MAP_INTENSITY;
            }
        });
    }

    updateModels = modelName => {
        const self = this;

        this.scene.traverse(function (child) {
            if (child.isMesh) {
                self.scene.remove(child.parent);
            }
        });

        this.resources.loaders.gltfLoader.load(modelName, function (gltf) {
            self.resource = gltf;
            self.setModels();
        });
    };

    recenterModel(modelScene) {
        const modelBox = new Box3().setFromObject(modelScene);
        const boxCenter = modelBox.getCenter(new Vector3());

        modelScene.position.x += modelScene.position.x - boxCenter.x;
        modelScene.position.y += modelScene.position.y - boxCenter.y;
        modelScene.position.z += modelScene.position.z - boxCenter.z;
    }
}
