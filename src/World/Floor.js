import { CircleGeometry, ShadowMaterial, Mesh } from 'three';
import { gltfViewer } from '@/GltfViewer.js';

import {
    FLOOR_POSITION_X,
    FLOOR_POSITION_Y,
    FLOOR_POSITION_Z,
    FLOOR_ROTATION_X,
    FLOOR_ROTATION_Y,
    FLOOR_ROTATION_Z,
    FLOOR_SHADOW_MATERIAL_OPACITY,
    FLOOR_RADIUS,
    FLOOR_SEGMENTS,
} from '@/constants';

export default class Floor {
    constructor() {
        this.scene = gltfViewer.scene;
        this.resources = gltfViewer.resources;

        this.setGeometry();
        this.setMaterial();
        this.setMesh();
    }

    setGeometry() {
        this.geometry = new CircleGeometry(FLOOR_RADIUS, FLOOR_SEGMENTS);
    }

    setMaterial() {
        this.material = new ShadowMaterial();
        this.material.opacity = FLOOR_SHADOW_MATERIAL_OPACITY;
        this.material.receiveShadow = true;
    }

    setMesh() {
        this.mesh = new Mesh(this.geometry, this.material);

        this.mesh.position.x = FLOOR_POSITION_X;
        this.mesh.position.y = FLOOR_POSITION_Y;
        this.mesh.position.z = FLOOR_POSITION_Z;

        this.mesh.rotation.x = FLOOR_ROTATION_X;
        this.mesh.rotation.y = FLOOR_ROTATION_Y;
        this.mesh.rotation.z = FLOOR_ROTATION_Z;

        this.mesh.receiveShadow = true;
        this.scene.add(this.mesh);
    }
}
