import { experience } from '@/Experience.js';
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
        this.sizes = experience.sizes;
        this.scene = experience.scene;
        this.time = experience.time;
        this.interactionEvents = experience.interactionEvents;
        this.canvas = experience.canvas;

        this.raycaster = null;

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
        this.controls.smoothTime = 0.8;
        this.controls.azimuthRotateSpeed = 0.5;
        this.controls.draggingSmoothTime = 0.4;
    }

    resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height;
        this.instance.updateProjectionMatrix();
    }

    update() {
        this.controls.update(1 / this.time.delta);
    }

    moveCameraOn() {
        this.raycaster = this.experience.raycaster;
        const intersects = this.raycaster.getIntersects();

        if (intersects.length === 0) return;

        console.log('name', intersects[0].object.name);
        const object = intersects[0].object;

        const target = object.getWorldPosition(new Vector3());

        console.log(target);

        this.controls.setLookAt(
            target.x,
            target.y,
            target.z + 3,
            target.x,
            target.y,
            target.z,
            true
        );
    }
}
