// import { PerspectiveCamera } from 'three';
import { PhysicalCamera } from 'three-gpu-pathtracer';
import Experience from '@/Experience.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export default class Camera {
    constructor() {
        this.experience = new Experience();
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;
        this.pathTracer = this.experience.pathTracer;

        this.setInstance();
        this.setControls();

        this.controls.addEventListener('change', () => {
            if (this.pathTracer) this.pathTracer.reset();
        });
    }

    setInstance() {
        this.instance = new PhysicalCamera(
            35,
            this.sizes.width / this.sizes.height,
            0.1,
            100
        );

        this.instance.position.set(0, 0, 2);
    }

    setControls() {
        this.controls = new OrbitControls(this.instance, this.canvas);
        this.controls.enableDamping = true;
    }

    resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height;
        this.instance.updateProjectionMatrix();
    }

    update() {
        this.instance.updateMatrixWorld();
        this.controls.update();
    }
}
