import { Mesh } from 'three';
import { ENV_MAP_INTENSITY } from '@/constants';
import { gltfViewer } from '@/GltfViewer.js';

export default class Model {
    constructor() {
        this.scene = gltfViewer.scene;
        this.resources = gltfViewer.resources;
        this.debug = gltfViewer.debug;

        // Resource
        this.resource = this.resources.items[this.resources.modelName];

        console.log(this.resources.items, this.resources.modelName);

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

        this.setModel();

        this.resources.on('updateGlb', url => {
            this.updateModel(url);
        });
    }

    setModel() {
        this.model = this.resource.scene;
        this.scene.add(this.model);

        this.model.traverse(child => {
            if (child instanceof Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                child.material.envMapIntensity = ENV_MAP_INTENSITY;
            }
        });
    }

    updateModel = modelName => {
        const self = this;

        this.scene.traverse(function (child) {
            if (child.isMesh) {
                self.scene.remove(child.parent);
            }
        });

        this.resources.loaders.gltfLoader.load(modelName, function (gltf) {
            self.resource = gltf;
            self.setModel();
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
