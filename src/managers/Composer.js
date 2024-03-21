import { Vector2 } from 'three';

// EffectComposer
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';

// Effects
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

// Shaders
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';

import { postProcessingEffects } from '@/parameters/ui';
import {
    PP_EFFECT_NO_EFFECTS,
    PP_EFFECT_BLOOM,
    PP_EFFECT_FXAA,
} from '@/constants';
import { constructList } from '@/utils/functions';

import { gltfViewer } from '@/GltfViewer.js';

export default class Composer {
    constructor(initialValue) {
        this.canvas = gltfViewer.canvas;
        this.scene = gltfViewer.scene;
        this.sizes = gltfViewer.sizes;
        this.camera = gltfViewer.camera.instance;
        this.renderer = gltfViewer.renderer.instance;
        this.debug = gltfViewer.debug;

        // Debug Folder
        if (this.debug.active) {
            this.debugFolder = this.debug.pane.addFolder({
                title: 'Post Processing Effects',
                expanded: false,
            });

            this.effectsList = this.debugFolder
                .addBlade({
                    view: 'list',
                    label: 'effect',
                    options: this.constructEffectList(postProcessingEffects),
                    value: initialValue,
                })
                .on('change', e => this.switchEffect(e.value));
        }

        this.setInstance();

        // Add other Post Processing Effects
        this.setFXAAPass();
        this.setBloomPass();
        this.switchEffect(initialValue);
    }

    setInstance() {
        this.instance = new EffectComposer(this.renderer);
        this.effects = {};
        this.effects.renderPass = new RenderPass(this.scene, this.camera);
        this.effects.outputPass = new OutputPass();

        this.instance.addPass(this.effects.renderPass);
        this.instance.addPass(this.effects.outputPass);
    }

    constructEffectList(list) {
        const result = constructList(list);

        result.push({
            text: PP_EFFECT_NO_EFFECTS,
            value: PP_EFFECT_NO_EFFECTS,
        });
        return result;
    }

    switchEffect = effect => {
        this.resetEffects();
        this.setHiddenParameters();

        switch (effect) {
            case PP_EFFECT_BLOOM:
                this.setBloomPassParameters();
                this.instance.insertPass(
                    this.effects.bloomPass,
                    this.instance.passes.length - 1
                );
                break;

            case PP_EFFECT_FXAA:
                this.instance.addPass(this.effects.fxaaPass);
                break;
            default:
                break;
        }
    };

    setBloomPass = () => {
        this.effects.bloomPass = new UnrealBloomPass(
            new Vector2(window.innerWidth, window.innerHeight),
            postProcessingEffects.bloomParams.parameters.strength.value,
            postProcessingEffects.bloomParams.parameters.radius.value,
            postProcessingEffects.bloomParams.parameters.threshold.value
        );
    };

    setBloomPassParameters = () => {
        if (this.bloomParamsFolder) this.bloomParamsFolder.hidden = false;
        // Debug
        if (
            this.debug.active &&
            this.effectsList.value === PP_EFFECT_BLOOM &&
            !this.bloomParamsFolder
        ) {
            // Parameters
            this.bloomParamsFolder = this.debugFolder.addFolder({
                title: postProcessingEffects.bloomParams.parametersTitle,
                expanded: true,
            });

            for (const parameter in postProcessingEffects.bloomParams
                .parameters) {
                this.bloomParamsFolder
                    .addBlade({
                        view: 'slider',
                        label: parameter,
                        min: postProcessingEffects.bloomParams.parameters[
                            parameter
                        ].min,
                        max: postProcessingEffects.bloomParams.parameters[
                            parameter
                        ].max,
                        step: postProcessingEffects.bloomParams.parameters[
                            parameter
                        ].step,
                        value: postProcessingEffects.bloomParams.parameters[
                            parameter
                        ].value,
                    })
                    .on(
                        'change',
                        e =>
                            (this.effects.bloomPass[parameter] = Number(
                                e.value
                            ))
                    );
            }
        }
    };

    setFXAAPass = () => {
        this.effects.fxaaPass = new ShaderPass(FXAAShader);

        this.effects.fxaaPass.material.uniforms['resolution'].value.x =
            1 / (this.canvas.offsetWidth * this.sizes.pixelRatio);
        this.effects.fxaaPass.material.uniforms['resolution'].value.y =
            1 / (this.canvas.offsetHeight * this.sizes.pixelRatio);
    };

    resetEffects = () => {
        this.instance = new EffectComposer(this.renderer);
        this.instance.addPass(this.effects.renderPass);
        this.instance.addPass(this.effects.outputPass);
    };

    setHiddenParameters = () => {
        if (this.bloomParamsFolder) this.bloomParamsFolder.hidden = true;
    };

    resize() {
        this.instance.setSize(this.sizes.width, this.sizes.height);
        this.instance.setPixelRatio(this.sizes.pixelRatio);
    }

    update() {
        this.instance.render();
    }
}
