import { gltfViewer } from '@/GltfViewer.js';
import CameraControls from 'camera-controls';
import {
    CAMERA_FOV,
    CAMERA_ASPECT,
    CAMERA_NEAR,
    CAMERA_FAR,
    CAMERA_POSITION_X,
    CAMERA_POSITION_Y,
    CAMERA_POSITION_Z,
    CAMERA_SET_LOOT_AT_X,
    CAMERA_SET_LOOT_AT_Y,
    CAMERA_SET_LOOT_AT_Z,
    CAMERA_CONTROLS_SMOOTH_TIME,
    CAMERA_CONTROLS_MAX_POLAR_ANGLE,
    CAMERA_CONTROLS_MIN_DISTANCE,
    CAMERA_CONTROLS_MAX_DISTANCE,
    CAMERA_CONTROLS_AZIMUTH_ROTATE_SPEED,
    CAMERA_CONTROLS_DRAGGING_SMOOTH_TIME,
    CAMERA_MAX_CAMERA_DISTANCE_MOVE_ON,
} from '@/constants';

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
        this.sizes = gltfViewer.sizes;
        this.scene = gltfViewer.scene;
        this.time = gltfViewer.time;
        this.interactionEvents = gltfViewer.interactionEvents;
        this.canvas = gltfViewer.canvas;

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
            CAMERA_FOV,
            this.sizes.width / this.sizes.height,
            CAMERA_ASPECT,
            CAMERA_NEAR,
            CAMERA_FAR
        );
        // starting position
        this.instance.position.set(
            CAMERA_POSITION_X,
            CAMERA_POSITION_Y,
            CAMERA_POSITION_Z
        );
        this.instance.lookAt(
            CAMERA_SET_LOOT_AT_X,
            CAMERA_SET_LOOT_AT_Y,
            CAMERA_SET_LOOT_AT_Z
        );
    }

    setControls() {
        this.controls = new CameraControls(this.instance, this.canvas);
        this.controls.smoothTime = CAMERA_CONTROLS_SMOOTH_TIME;
        this.controls.maxPolarAngle = CAMERA_CONTROLS_MAX_POLAR_ANGLE;
        this.controls.minDistance = CAMERA_CONTROLS_MIN_DISTANCE;
        this.controls.maxDistance = CAMERA_CONTROLS_MAX_DISTANCE;
        this.controls.azimuthRotateSpeed = CAMERA_CONTROLS_AZIMUTH_ROTATE_SPEED;
        this.controls.draggingSmoothTime = CAMERA_CONTROLS_DRAGGING_SMOOTH_TIME;
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
        this.raycaster = gltfViewer.raycaster;
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

        const cameraDistance = CAMERA_MAX_CAMERA_DISTANCE_MOVE_ON;

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
        this.raycaster = gltfViewer.raycaster;
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
