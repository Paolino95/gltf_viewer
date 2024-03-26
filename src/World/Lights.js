import { DirectionalLight, AmbientLight, CameraHelper } from 'three';
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
        this.debug = gltfViewer.debug;

        // Debug
        if (this.debug.active) {
            this.debugFolder = this.debug.pane.addFolder({
                title: 'Lights Parameters',
                expanded: false,
            });
        }

        this.addDirectionalLight();
        this.addAmbientLight();
    }

    addDirectionalLight() {
        this.directionalLightObject = {
            color: DL_COLOR,
            intensity: DL_INTENSITY,
            positionX: DL_POSITION_X,
            positionY: DL_POSITION_Y,
            positionZ: DL_POSITION_Z,
            lookAtX: DL_LOOK_AT_X,
            lookAtY: DL_LOOK_AT_Y,
            lookAtZ: DL_LOOK_AT_Z,
            shadowCameraRight: DL_SHADOW_CAMERA_RIGHT,
            shadowCameraLeft: DL_SHADOW_CAMERA_LEFT,
            shadowCameraTop: DL_SHADOW_CAMERA_TOP,
            shadowCameraBottom: DL_SHADOW_CAMERA_BOTTOM,
            bias: DL_SHADOW_BIAS,
        };

        this.directionalLight = new DirectionalLight(DL_COLOR, DL_INTENSITY);
        this.directionalLight.position.set(
            DL_POSITION_X,
            DL_POSITION_Y,
            DL_POSITION_Z
        );
        this.directionalLight.lookAt(DL_LOOK_AT_X, DL_LOOK_AT_Y, DL_LOOK_AT_Z);
        this.directionalLight.castShadow = true;
        this.directionalLight.shadow.mapSize.width = DL_MAP_SIZE_W;
        this.directionalLight.shadow.mapSize.height = DL_MAP_SIZE_H;
        this.directionalLight.shadow.camera.right = DL_SHADOW_CAMERA_RIGHT;
        this.directionalLight.shadow.camera.left = DL_SHADOW_CAMERA_LEFT;
        this.directionalLight.shadow.camera.top = DL_SHADOW_CAMERA_TOP;
        this.directionalLight.shadow.camera.bottom = DL_SHADOW_CAMERA_BOTTOM;
        this.directionalLight.shadow.bias = DL_SHADOW_BIAS;

        this.scene.add(this.directionalLight);

        // Debug
        if (this.debug.active) {
            this.debugDL = this.debugFolder.addFolder({
                title: 'Directional Light Parameters',
                expanded: false,
            });

            this.debugDL
                .addBinding(this.directionalLightObject, 'color', {
                    view: 'color',
                })
                .on('change', e => {
                    this.directionalLight.color.setHex(e.value);
                });

            this.debugDL
                .addBinding(this.directionalLightObject, 'intensity', {
                    min: 0,
                    max: 100,
                    step: 0.1,
                })
                .on('change', e => (this.directionalLight.intensity = e.value));

            this.debugDL
                .addBinding(this.directionalLightObject, 'positionX', {
                    min: -50,
                    max: 50,
                    step: 1,
                })
                .on(
                    'change',
                    e => (this.directionalLight.position.x = e.value)
                );

            this.debugDL
                .addBinding(this.directionalLightObject, 'positionY', {
                    min: -50,
                    max: 50,
                    step: 1,
                })
                .on(
                    'change',
                    e => (this.directionalLight.position.y = e.value)
                );

            this.debugDL
                .addBinding(this.directionalLightObject, 'positionZ', {
                    min: -50,
                    max: 50,
                    step: 1,
                })
                .on(
                    'change',
                    e => (this.directionalLight.position.z = e.value)
                );

            this.debugDL
                .addBinding(this.directionalLightObject, 'shadowCameraRight', {
                    min: -50,
                    max: 50,
                    step: 1,
                })
                .on(
                    'change',
                    e => (this.directionalLight.shadow.camera.right = e.value)
                );

            this.debugDL
                .addBinding(this.directionalLightObject, 'shadowCameraLeft', {
                    min: -50,
                    max: 50,
                    step: 1,
                })
                .on(
                    'change',
                    e => (this.directionalLight.shadow.camera.left = e.value)
                );

            this.debugDL
                .addBinding(this.directionalLightObject, 'shadowCameraTop', {
                    min: -50,
                    max: 50,
                    step: 1,
                })
                .on(
                    'change',
                    e => (this.directionalLight.shadow.camera.top = e.value)
                );

            this.debugDL
                .addBinding(this.directionalLightObject, 'shadowCameraBottom', {
                    min: -50,
                    max: 50,
                    step: 1,
                })
                .on(
                    'change',
                    e => (this.directionalLight.shadow.camera.bottom = e.value)
                );

            this.debugDL
                .addBinding(this.directionalLightObject, 'bias', {
                    min: 0,
                    max: 0.01,
                    step: 0.0001,
                })
                .on(
                    'change',
                    e => (this.directionalLight.shadow.bias = e.value)
                );
        }
    }

    addAmbientLight() {
        this.ambientLight = new AmbientLight(AL_COLOR, AL_INTENSITY);
        this.scene.add(this.ambientLight);

        // Debug
        if (this.debug.active) {
            this.ambientLightDebugObject = {
                color: AL_COLOR,
                intensity: AL_INTENSITY,
            };

            this.debugAL = this.debugFolder.addFolder({
                title: 'Ambient Light Parameters',
                expanded: false,
            });

            this.debugAL
                .addBinding(this.ambientLightDebugObject, 'color', {
                    view: 'color',
                })
                .on('change', e => {
                    this.ambientLight.color.setHex(e.value);
                });

            this.debugAL
                .addBinding(this.ambientLightDebugObject, 'intensity', {
                    min: 0,
                    max: 3,
                    step: 0.1,
                })
                .on('change', e => (this.ambientLight.intensity = e.value));
        }
    }
}
