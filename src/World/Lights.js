import { DirectionalLight, AmbientLight } from 'three';
import { gltfViewer } from '@/GltfViewer.js';

import {
    DL_COLOR,
    DL_INTENSITY,
    DL_POSITION_X,
    DL_POSITION_Y,
    DL_POSITION_Z,
    DL_LOOK_AT_X,
    DL_LOOK_AT_Y,
    DL_LOOK_AT_Z,
    DL_MAP_SIZE_W,
    DL_MAP_SIZE_H,
    DL_SHADOW_CAMERA_RIGHT,
    DL_SHADOW_CAMERA_LEFT,
    DL_SHADOW_CAMERA_TOP,
    DL_SHADOW_CAMERA_BOTTOM,
    DL_SHADOW_BIAS,
    AL_COLOR,
    AL_INTENSITY,
} from '@/constants';

export default class Floor {
    constructor() {
        this.scene = gltfViewer.scene;

        this.addDirectionalLight();
        this.addAmbientLight();
    }

    addDirectionalLight() {
        const light = new DirectionalLight(DL_COLOR, DL_INTENSITY);
        light.position.set(DL_POSITION_X, DL_POSITION_Y, DL_POSITION_Z);
        light.lookAt(DL_LOOK_AT_X, DL_LOOK_AT_Y, DL_LOOK_AT_Z);
        light.castShadow = true;
        light.shadow.mapSize.width = DL_MAP_SIZE_W;
        light.shadow.mapSize.height = DL_MAP_SIZE_H;
        light.shadow.camera.right = DL_SHADOW_CAMERA_RIGHT;
        light.shadow.camera.left = DL_SHADOW_CAMERA_LEFT;
        light.shadow.camera.top = DL_SHADOW_CAMERA_TOP;
        light.shadow.camera.bottom = DL_SHADOW_CAMERA_BOTTOM;
        light.shadow.bias = DL_SHADOW_BIAS;

        this.scene.add(light);

        // const helper = new CameraHelper(light.shadow.camera);
        // this.scene.add(helper);
    }

    addAmbientLight() {
        const light = new AmbientLight(AL_COLOR, AL_INTENSITY);
        this.scene.add(light);
    }
}
