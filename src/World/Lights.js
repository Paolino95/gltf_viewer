import { CameraHelper, DirectionalLight, AmbientLight } from 'three';
import Experience from '@/Experience.js';

export default class Floor {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;

        this.addDirectionalLight();
        this.addAmbientLight();
    }

    addDirectionalLight() {
        const light = new DirectionalLight(0xffffff, 2);
        light.position.set(2, 5, 2);
        light.lookAt(0, 0, 0);
        light.castShadow = true;
        light.shadow.mapSize.width = 1024;
        light.shadow.mapSize.height = 1024;
        light.shadow.camera.right = 10;
        light.shadow.camera.left = -10;
        light.shadow.camera.top = 10;
        light.shadow.camera.bottom = -10;
        light.shadow.bias = -0.0001;

        this.scene.add(light);

        // const helper = new CameraHelper(light.shadow.camera);
        // this.scene.add(helper);
    }

    addAmbientLight() {
        const light = new AmbientLight(0x040404, 1);
        this.scene.add(light);
    }
}
