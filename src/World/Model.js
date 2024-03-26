import { Box3, Vector3, Mesh, AnimationMixer } from 'three';
import Experience from '@/Experience.js';
import { sceneParams, modelList } from '@/parameters/ui.js';
import { DEBUG_EXPANDED_TAB, MOD_1, MOD_2, MOD_3 } from '@/constants';
import { constructList } from '@/utils/functions';

import { PathTracingSceneGenerator } from 'three-gpu-pathtracer';

export default class Model {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.time = this.experience.time;
        this.debug = this.experience.debug;
        this.renderer = this.experience.renderer;
        this.pathTracer = this.experience.pathTracer;
        // Resource
        const { name, model } = this.defaultModel();
        this.resource = model;

        // Debug
        if (this.debug.active) {
            this.debugFolder = this.debug.pane.addFolder({
                title: 'Model Parameters',
                expanded: DEBUG_EXPANDED_TAB['MODEL_PARAMETERS'].expanded,
            });

            this.modelList = this.debugFolder
                .addBlade({
                    view: 'list',
                    label: 'Selected Model',
                    options: constructList(modelList),
                    value: name,
                })
                .on('change', e => {
                    const path = this.resources.sources.filter(
                        source => source.name === e.value
                    )[0].path;
                    this.updateModel(path);
                });

            this.animationsSelector = this.debugFolder
                .addBlade({
                    view: 'list',
                    label: 'Selected Animation',
                    options: [],
                    value: '',
                })
                .on('change', e => {});

            this.debugFolder
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

    defaultModel() {
        for (const source of this.resources.sources) {
            if (
                source.type === 'gltfModel' &&
                source.default &&
                source.default === true
            ) {
                return {
                    name: source.name,
                    model: this.resources.items[source.name],
                };
            }
        }
    }

    setModel() {
        this.model = this.resource.scene;

        if (this.pathTracer && this.pathTracer.instance) {
            this.generator = new PathTracingSceneGenerator();

            const result = this.generator.generate(this.model);

            const { bvh, textures, materials } = result;
            const geometry = bvh.geometry;
            const material = this.pathTracer.instance.material;

            material.bvh.updateFrom(bvh);
            material.attributesArray.updateFrom(
                geometry.attributes.normal,
                geometry.attributes.tangent,
                geometry.attributes.uv,
                geometry.attributes.color
            );
            material.materialIndexAttribute.updateFrom(
                geometry.attributes.materialIndex
            );
            material.textures.setTextures(
                this.renderer.instance,
                2048,
                2048,
                textures
            );
            material.materials.updateFrom(materials, textures);
        } else {
            this.model = this.resource.scene;
            this.scene.add(this.model);

            this.model.traverse(child => {
                if (child instanceof Mesh) {
                    child.castShadow = true;
                    child.material.envMapIntensity =
                        sceneParams.envMapIntensity;
                }
            });
        }

        // this.recenterModel(this.model);
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
            self.setAnimation();
        });
    };

    setAnimation() {
        this.animation = {};

        // Mixer
        this.animation.mixer = new AnimationMixer(this.model);

        // Actions
        this.animation.actions = {};

        for (let i = 0; i < this.resource.animations.length; i++) {
            const currentAnimation = this.resource.animations[i];

            if (!this.animation.actions[currentAnimation])
                this.animation.actions[currentAnimation.name] =
                    this.animation.mixer.clipAction(currentAnimation);
        }

        this.animation.actions.current =
            Object.keys(this.animation.actions).length > 0
                ? Object.values(this.animation.actions)[0]
                : undefined;

        if (this.animation.actions.current) {
            this.animation.actions.current.play();
        }

        // Play the action
        this.animation.play = name => {
            const newAction = this.animation.actions[name];
            const oldAction = this.animation.actions.current;

            newAction.reset();
            newAction.play();
            newAction.crossFadeFrom(oldAction, 1);

            this.animation.actions.current = newAction;
        };

        const self = this;

        // Debug
        if (
            this.debug.active &&
            Object.keys(this.animation.actions).length > 1
        ) {
            const debugObject = {};
            this.animationsSelector.options = [];
            this.animationsSelector.value = '';
            this.animationsSelector.hidden = false;

            for (let i = 0; i < this.resource.animations.length; i++) {
                const currentAnimation = this.resource.animations[i];

                debugObject[currentAnimation.name] = () => {
                    this.animation.play(currentAnimation.name);
                };

                self.animationsSelector.options.push({
                    text: currentAnimation.name,
                    value: debugObject[currentAnimation.name],
                });

                self.animationsSelector.value =
                    debugObject[currentAnimation.name];
            }

            this.debug.pane.refresh();
        } else {
            if (this.animationsSelector) this.animationsSelector.hidden = true;
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
