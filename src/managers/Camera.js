import Experience from '@/Experience.js';
import CameraControls from 'camera-controls';

import {
    Vector2,
    Vector3,
    Vector4,
    Quaternion,
    Matrix4,
    Spherical,
    Box3,
    Sphere,
    Raycaster,
    PerspectiveCamera,
} from 'three';

const subsetOfTHREE = {
    Vector2: Vector2,
    Vector3: Vector3,
    Vector4: Vector4,
    Quaternion: Quaternion,
    Matrix4: Matrix4,
    Spherical: Spherical,
    Box3: Box3,
    Sphere: Sphere,
    Raycaster: Raycaster,
};

CameraControls.install({ THREE: subsetOfTHREE });

export default class Camera {
    constructor() {
        this.experience = new Experience();
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.time = this.experience.time;
        this.interactionEvents = this.experience.interactionEvents;
        this.canvas = this.experience.canvas;

        this.setInstance();
        this.setControls();

        this.interactionEvents.on('onDoubleClick', () => {
            this.moveCameraOn();
        });
    }

    setInstance() {
        this.instance = new PerspectiveCamera(
            35,
            this.sizes.width / this.sizes.height,
            0.1,
            100
        );
        // starting position
        this.instance.position.set(-7, 1.5, 10);
        this.instance.lookAt(0, 0, 0);
    }

    setControls() {
        this.controls = new CameraControls(this.instance, this.canvas);
        this.controls.smoothTime = 0.3;
        this.controls.azimuthRotateSpeed = 0.5;
        this.controls.draggingSmoothTime = 0.2;
    }

    resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height;
        this.instance.updateProjectionMatrix();
    }

    update() {
        this.controls.update(this.time.delta);
    }

    moveCameraOn() {
        //
    }
}
