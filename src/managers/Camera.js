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
    constructor(onResetCamera) {
        this.sizes = experience.sizes;
        this.scene = experience.scene;
        this.time = experience.time;
        this.interactionEvents = experience.interactionEvents;
        this.canvas = experience.canvas;

        this.onResetCamera = onResetCamera;

        this.raycaster = null;

        this.setInstance();
        this.setControls();

        this.interactionEvents.on('onDoubleClick', () => {
            this.resetCamera();
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
        this.instance.position.set(-5, 3.5, -18);
        this.instance.lookAt(0, 1, 0);
    }

    setControls() {
        this.controls = new CameraControls(this.instance, this.canvas);
        this.controls.smoothTime = 0.8;
        this.controls.maxPolarAngle = Math.PI / 2;
        this.controls.minDistance = 4;
        this.controls.maxDistance = 25;
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
        // TEMP - ASSEGNAMENTO DEL RAYCASTER
        //
        // NEXT  -->  moveCameraOn( selectedMesh )  -->  la funzione moveCameraOn sarà chiamata solo con la mesh da inquadrare come argomento
        //
        this.raycaster = experience.raycaster;
        const intersects = this.raycaster.getIntersects();

        if (intersects.length === 0 || !intersects[0].object.name) {
            // reset camera
            this.controls.reset(true);
            return;
        }

        const object = intersects[0].object;
        //
        // TEMP - FINE

        const target = object.getWorldPosition(new Vector3());

        const cameraOffsetDirection = this.instance
            .getWorldDirection(new Vector3())
            .multiplyScalar(-1);

        const cameraDistance = 2.5;

        const position = new Vector3().addVectors(
            target,
            cameraOffsetDirection.multiplyScalar(cameraDistance)
        );

        this.controls.setLookAt(
            position.x,
            position.y,
            position.z,
            target.x,
            target.y,
            target.z,
            true
        );
    }

    resetCamera() {
        this.raycaster = experience.raycaster;
        const intersects = this.raycaster.getIntersects();

        if (intersects.length === 0 || !intersects[0].object.name) {
            // reset camera
            this.controls.reset(true);
            this.onResetCamera(true);
            return;
        }

        this.onResetCamera(false);
    }
}
