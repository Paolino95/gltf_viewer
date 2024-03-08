import { CircleGeometry, ShadowMaterial, Mesh } from 'three';
import { experience } from '@/Experience.js';

export default class Floor {
    constructor() {
        this.scene = experience.scene;
        this.resources = experience.resources;

        this.setGeometry();
        this.setMaterial();
        this.setMesh();
    }

    setGeometry() {
        this.geometry = new CircleGeometry(30, 64);
    }

    setMaterial() {
        this.material = new ShadowMaterial();
        this.material.opacity = 0.5;
        this.material.receiveShadow = true;
    }

    setMesh() {
        this.mesh = new Mesh(this.geometry, this.material);
        this.mesh.rotation.x = -Math.PI * 0.5;
        this.mesh.position.y = -0.15;
        this.mesh.receiveShadow = true;
        this.scene.add(this.mesh);
    }
}
