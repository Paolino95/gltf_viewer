import { Vector2 } from 'three';

// Effects
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { postProcessingEffects } from '../parameters/ui';
import Experience from '../Experience.js';

export default class Composer {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.sizes = this.experience.sizes;
        this.camera = this.experience.camera.instance;
        this.renderer = this.experience.renderer.instance;
        this.debug = this.experience.debug;

        // Debug Folder
        if (this.debug.active) {
            this.debugFolder = this.debug.pane.addFolder({
                title: 'Post Processing Effects',
            });
        }

        this.setInstance();

        // Add other Post Processing Effects
        this.setBloomPass();
    }

    setInstance() {
        this.instance = new EffectComposer(this.renderer);
        this.effects = {};
        this.effects.renderScene = new RenderPass(this.scene, this.camera);
        this.effects.outputPass = new OutputPass();

        this.instance.addPass(this.effects.renderScene);
        this.instance.addPass(this.effects.outputPass);
    }

    setBloomPass = () => {
        this.effects.bloomPass = new UnrealBloomPass(
            new Vector2(window.innerWidth, window.innerHeight),
            postProcessingEffects.bloomParams.parameters.strength.value,
            postProcessingEffects.bloomParams.parameters.radius.value,
            postProcessingEffects.bloomParams.parameters.threshold.value
        );

        // Debug
        if (this.debug.active) {
            // Parameters
            this.bloomParamsFolder = null;
            this.debugFolder
                .addBinding(postProcessingEffects.bloomParams, 'active', {
                    label: postProcessingEffects.bloomParams.title,
                })
                .on('change', e => {
                    this.updateBloomPass(e.value);
                    this.bloomParamsFolder.disabled =
                        !this.bloomParamsFolder.disabled;
                    this.bloomParamsFolder.expanded =
                        !this.bloomParamsFolder.disabled;
                });

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
        toggle
            ? this.instance.insertPass(
                  this.effects.bloomPass,
                  this.instance.passes.length - 1
              )
            : this.instance.removePass(this.effects.bloomPass);
    };

    resize() {
        this.instance.setSize(this.sizes.width, this.sizes.height);
        this.instance.setPixelRatio(this.sizes.pixelRatio);
    }

    update() {
        this.instance.render();
    }
}
