import { Box3, Vector3, Mesh, AnimationMixer } from 'three';
import Experience from '@/Experience.js';
import { sceneParams } from '@/parameters/ui.js';

export default class Model {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.time = this.experience.time;
        this.debug = this.experience.debug;

        // Resource
        this.resource = this.resources.items.model;

        // Debug
        if (this.debug.active) {
            this.debug.pane
                .addButton({ title: 'update Model' })
                .on('click', () => {
                    this.resources.inputButton.click();
                });
        }

        this.setModel();
        this.setAnimation();

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
                child.material.envMapIntensity = sceneParams.envMapIntensity;
            }
        });

        this.recenterModel(this.model);
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

    setAnimation() {
        this.animation = {};

        // Mixer
        this.animation.mixer = new AnimationMixer(this.model);

        // Actions
        this.animation.actions = {};

        for (let i = 0; this.resource.animations.length; i++) {
            if (this.animation.actions[animation.name])
                this.animation.actions[animation.name] =
                    this.animation.mixer.clipAction(
                        this.resource.animations[i]
                    );
        }

        this.animation.actions.current = this.animation.actions[0]
            ? this.animation.actions[0]
            : undefined;
        if (this.animation.actions.current)
            this.animation.actions.current.play();

        // Play the action
        this.animation.play = name => {
            const newAction = this.animation.actions[name];
            const oldAction = this.animation.actions.current;

            newAction.reset();
            newAction.play();
            newAction.crossFadeFrom(oldAction, 1);

            this.animation.actions.current = newAction;
        };

        // Debug
        if (this.debug.active) {
            const debugObject = {};

            for (let i = 0; this.resource.animations.length; i++) {
                if (this.animation.actions[animation.name])
                    debugObject[animation.name] = this.animation.play(
                        animation.name
                    );

                this.debugFolder.add(debugObject, animation.name);
            }
        }
    }

    update() {
        this.animation.mixer.update(this.time.delta * 0.001);
    }

    recenterModel(modelScene) {
        const modelBox = new Box3().setFromObject(modelScene);
        const boxCenter = modelBox.getCenter(new Vector3());

        modelScene.position.x += modelScene.position.x - boxCenter.x;
        modelScene.position.y += modelScene.position.y - boxCenter.y;
        modelScene.position.z += modelScene.position.z - boxCenter.z;
    }
}
