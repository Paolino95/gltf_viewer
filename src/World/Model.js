import {
    Box3,
    Vector3,
    Mesh,
    AnimationMixer,
    SpriteMaterial,
    TextureLoader,
    Sprite,
    LoopOnce,
    AdditiveBlending,
} from 'three';
import { experience } from '@/Experience.js';
import { sceneParams, modelList } from '@/parameters/ui.js';
import { DEBUG_EXPANDED_TAB, MOD_1, MOD_2, MOD_3 } from '@/constants';
import { constructList } from '@/utils/functions';

export default class Model {
    constructor() {
        this.scene = experience.scene;
        this.resources = experience.resources;
        this.time = experience.time;
        this.debug = experience.debug;

        // Resource
        this.resource = this.defaultModel().model;

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
                    value: this.defaultModel().name,
                })
                .on('change', e => {
                    const path = this.resources.sources.filter(
                        source => source.name === e.value
                    )[0].path;
                    this.updateModel(path);
                });

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
                source.default === true &&
                source.name === (MOD_1 || MOD_2 || MOD_3)
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
        // this.model.rotation.y = Math.PI;
        this.scene.add(this.model);

        this.model.traverse(child => {
            if (child instanceof Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                child.material.envMapIntensity = sceneParams.envMapIntensity;
            }
        });

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
        });
    };

    setAnimation() {
        this.animation = {};

        // Mixer
        this.animation.mixer = new AnimationMixer(this.model);

        // Actions
        this.animation.actions = {};
        for (let i = 0; i < this.resource.animations.length; i++) {
            const animation = this.resource.animations[i];

            if (animation && !this.animation.actions[animation.name]) {
                this.animation.actions[animation.name] =
                    this.animation.mixer.clipAction(
                        this.resource.animations[i]
                    );
            }
        }

        console.log(this.animation.actions);

        // Debug
        if (this.debug.active) {
            const debugObject = {};

            for (let i = 0; i < this.resource.animations.length; i++) {
                const animation = this.resource.animations[i];

                if (animation && !debugObject[animation.name]) {
                    debugObject[animation.name] = () =>
                        this.animation.play(animation.name);
                }

                // this.debugFolder.addBinding(debugObject, animation.name);
            }
        }
    }

    // Play the action
    play(name) {
        const newAction = this.animation.actions[name];
        const oldAction = this.animation.actions.current;

        newAction.reset();
        newAction.play();
        newAction.crossFadeFrom(oldAction, 1);

        this.animation.actions.current = newAction;
    }

    playForwardAnimation(name) {
        this.animation.actions.current = this.animation.actions[name]
            ? this.animation.actions[name]
            : undefined;
        this.animation.actions.current = this.animation.actions[name];
        if (this.animation.actions.current) {
            this.animation.actions.current.paused = false;
            this.animation.actions.current.timeScale = 1;
            this.animation.actions.current.clampWhenFinished = true;
            this.animation.actions.current.setLoop(LoopOnce);
            this.animation.actions.current.play(name);
        }
    }

    playBackwardAnimation(name) {
        this.animation.actions.current = this.animation.actions[name]
            ? this.animation.actions[name]
            : undefined;

        this.animation.actions.current.paused = false;
        this.animation.actions.current.timeScale = -1;
        this.animation.actions.current.clampWhenFinished = true;
        this.animation.actions.current.setLoop(LoopOnce);
        this.animation.actions.current.play();
    }

    update() {
        this.animation.mixer.update(this.time.delta * 0.001);
    }

    // WIP - highlight of selectable meshes in the rendered model
    highlightSelectablesMeshes() {
        var spriteMaterial = new SpriteMaterial({
            map: new TextureLoader().load('assets/images/glow.png'),
            color: 0x00ff00,
            transparent: false,
            blending: AdditiveBlending,
        });
        var sprite = new Sprite(spriteMaterial);
        sprite.scale.set(0.5, 0.5, 1.0);

        this.scene.add(sprite);

        let sprites = [];

        this.model.traverse(object => {
            if (
                object.isMesh &&
                Object.keys(this.resources.items.info?.bokInteraction).includes(
                    object.name
                )
            ) {
                console.log(object.name, object);

                // NOT WORKING !!   -->   position is not retreived correctly?
                var mySprite = new Sprite(spriteMaterial);
                mySprite.position.copy(object.position);
                this.scene.add(mySprite);
                sprites.push(mySprite);
            }
        });
    }

    recenterModel(modelScene) {
        const modelBox = new Box3().setFromObject(modelScene);
        const boxCenter = modelBox.getCenter(new Vector3());

        modelScene.position.x += modelScene.position.x - boxCenter.x;
        modelScene.position.y += modelScene.position.y - boxCenter.y;
        modelScene.position.z += modelScene.position.z - boxCenter.z;
    }
}
