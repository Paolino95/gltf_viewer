import { Vector2 } from 'three';

// EffectComposer
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';

// Effects
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

// Shaders
// import { ColorCorrectionShader } from 'three/addons/shaders/ColorCorrectionShader.js';
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';

import { postProcessingEffects } from '@/parameters/ui';
import Experience from '@/Experience.js';

export default class Composer {
    constructor() {
        this.experience = new Experience();
        this.canvas = this.experience.canvas;
        this.scene = this.experience.scene;
        this.sizes = this.experience.sizes;
        this.camera = this.experience.camera.instance;
        this.renderer = this.experience.renderer.instance;
        this.debug = this.experience.debug;

        const effectsList = this.constructList(postProcessingEffects);
        // Debug Folder
        if (this.debug.active) {
            this.debugFolder = this.debug.pane.addFolder({
                title: 'Post Processing Effects',
            });

            this.effectsList = this.debugFolder
                .addBlade({
                    view: 'list',
                    label: 'effect',
                    options: effectsList,
                    value: 'Nessuno',
                })
                .on('change', e => this.switchEffect(e.value));
        }

        this.setInstance();

        // Add other Post Processing Effects
        this.setFXAAPass();
        this.setBloomPass();
    }

    constructList(list) {
        const result = [];

        result.push({ text: 'Nessuno', value: 'Nessuno' });

        for (const effect in list)
            result.push({ text: list[effect].id, value: list[effect].id });

        return result;
    }

    switchEffect = effect => {
        switch (effect) {
            case value:
                break;

            default:
                break;
        }
    };

    setInstance() {
        this.instance = new EffectComposer(this.renderer);
        this.effects = {};
        this.effects.renderPass = new RenderPass(this.scene, this.camera);
        this.effects.outputPass = new OutputPass();

        this.instance.addPass(this.effects.renderPass);
        this.instance.addPass(this.effects.outputPass);
    }

    setBloomPass = () => {
        this.effects.bloomPass = new UnrealBloomPass(
            new Vector2(window.innerWidth, window.innerHeight),
            postProcessingEffects.bloomParams.parameters.strength.value,
            postProcessingEffects.bloomParams.parameters.radius.value,
            postProcessingEffects.bloomParams.parameters.threshold.value
        );
    };

    setBloomPassParameters = () => {
        // Debug
        if (this.debug.active && this.effectsList.value === 'Bloom') {
            // Parameters
            this.bloomParamsFolder = this.debugFolder.addFolder({
                title: postProcessingEffects.bloomParams.parametersTitle,
                disabled: !postProcessingEffects.bloomParams.active,
                expanded: false,
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

    updateBloomPass = toggle => {
        if (toggle) {
            this.instance.insertPass(
                this.effects.bloomPass,
                this.instance.passes.length
            );
        } else {
            this.instance.removePass(this.effects.bloomPass);
        }
    };

    setFXAAPass = () => {
        this.effects.fxaaPass = new ShaderPass(FXAAShader);

        this.effects.fxaaPass.material.uniforms['resolution'].value.x =
            1 / (this.canvas.offsetWidth * this.sizes.pixelRatio);
        this.effects.fxaaPass.material.uniforms['resolution'].value.y =
            1 / (this.canvas.offsetHeight * this.sizes.pixelRatio);

        // Debug
        if (this.debug.active) {
            this.debugFolder
                .addBinding(postProcessingEffects.fxaaParams, 'active', {
                    label: postProcessingEffects.fxaaParams.title,
                })
                .on('change', e => {
                    this.updateFxaaPass(e.value);
                });
        }
    };

    updateFxaaPass = toggle => {
        if (toggle) {
            this.instance.addPass(this.effects.fxaaPass);
        } else {
            this.instance.removePass(this.effects.fxaaPass);
        }
    };

    resize() {
        this.instance.setSize(this.sizes.width, this.sizes.height);
        this.instance.setPixelRatio(this.sizes.pixelRatio);
    }

    update() {
        this.instance.render();
    }
}
