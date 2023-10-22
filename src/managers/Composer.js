import { Vector2 } from 'three';

// Effects
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { bloomParams } from '../params';
import Experience from '../Experience.js';

export class Composer {
    constructor() {
        this.experience = new Experience();
        this.renderer = this.experience.renderer;
        this.scene = this.experience.scene;
        this.camera = this.experience.camera;

        this.setInstance();
    }

    setInstance() {
        this.instance = new EffectComposer(this.renderer);
        this.effects = {};
        this.effects.renderScene = new RenderPass(this.scene, this.camera);
        this.effects.outputPass = new OutputPass();

        this.instance.addPass(this.effects.renderScene);
        this.instance.addPass(this.effects.outputPass);
    }

    toggleUnrealBloomPass = toggle => {
        if (!this.effects.bloomParams)
            this.effects.bloomParams = new UnrealBloomPass(
                new Vector2(window.innerWidth, window.innerHeight),
                bloomParams.strength,
                bloomParams.radius,
                bloomParams.threshold
            );

        toggle
            ? this.instance.insertPass(effect, this.instance.passes.length - 1)
            : this.instance.removePass(effect);
    };
}
