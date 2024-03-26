import { AnimationMixer, LoopOnce } from 'three';
import { gltfViewer } from '@/GltfViewer.js';

export default class Animations {
    constructor(onAnimationChange) {
        this.scene = gltfViewer.scene;
        this.resources = gltfViewer.resources;
        this.model = gltfViewer.world.model;
        this.debug = gltfViewer.debug;
        this.time = gltfViewer.time;

        this.animation = {};
        this.onAnimationChange = onAnimationChange;

        // Resource
        this.resource = this.model.resource;
        this.setAnimations();
    }

    setAnimations() {
        // Actions
        this.animation.actions = {};
        this.animation.mixers = [];

        this.resource.forEach(model => {
            // Mixer
            const mixer = new AnimationMixer(model.scene);

            mixer.addEventListener('finished', e => {
                this.onAnimationChange(e);

                e.direction === 1
                    ? (this.animation.actions[e.action._clip.name].timeScale =
                          -1)
                    : (this.animation.actions[
                          e.action._clip.name
                      ].timeScale = 1);
            });

            this.animation.mixers.push(mixer);

            for (let i = 0; i < model.animations.length; i++) {
                const animation = model.animations[i];

                if (animation && !this.animation.actions[animation.name]) {
                    this.animation.actions[animation.name] = mixer.clipAction(
                        model.animations[i]
                    );
                }
            }
        });

        // Debug
        if (
            this.debug.active &&
            Object.keys(this.animation.actions).length > 0
        ) {
            this.animationFolder = this.debug.pane.addFolder({
                title: 'Animations',
                expanded: false,
            });

            this.resource.forEach(model => {
                for (let j = 0; j < model.animations.length; j++) {
                    const animation = model.animations[j];

                    const animationFolder = this.animationFolder.addFolder({
                        title: animation.name,
                    });
                    animationFolder
                        .addButton({ title: 'play' })
                        .on('click', () => this.playAnimation(animation.name));
                    animationFolder
                        .addButton({ title: 'pause' })
                        .on('click', () => this.pausedAnimation());
                }
            });

            this.animationFolder
                .addButton({ title: 'Reset Animations' })
                .on('click', () => this.resetAnimations());
        }
    }

    playForwardAnimation(name) {
        this.animation.actions.current = this.animation.actions[name]
            ? this.animation.actions[name]
            : undefined;

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

        if (this.animation.actions.current) {
            this.animation.actions.current.paused = false;
            this.animation.actions.current.timeScale = -1;
            this.animation.actions.current.clampWhenFinished = true;
            this.animation.actions.current.setLoop(LoopOnce);
            this.animation.actions.current.play(name);
        }
    }

    playAnimation(name) {
        this.animation.actions.current = this.animation.actions[name]
            ? this.animation.actions[name]
            : undefined;

        this.animation.actions.current.paused = false;
        this.animation.actions.current.clampWhenFinished = true;
        this.animation.actions.current.setLoop(LoopOnce);
        this.animation.actions.current.play();
    }

    pausedAnimation() {
        if (this.animation.actions.current)
            this.animation.actions.current.paused = true;
    }

    resetAnimation(name) {
        const animation = this.animation.actions[name];

        if (animation.timeScale === -1) {
            this.playBackwardAnimation(name);
        }
    }

    resetAnimations() {
        for (let i = 0; i < this.animation.actions; i++) {
            const animation = this.animation.actions[i];

            if (animation) {
                animation.reset();
            }
        }
    }

    update() {
        for (const mixer of this.animation.mixers) {
            mixer.update(this.time.delta * 0.001);
        }
    }
}
