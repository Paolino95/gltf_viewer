import { Vector2, Vector3 } from 'three';

import { experience } from '@/Experience.js';

export default class Hotspots {
    constructor(onHotspotsUpdated) {
        this.onHotspotsUpdated = onHotspotsUpdated;

        this.camera = experience.camera;
        this.scene = experience.scene;
        this.sizes = experience.sizes;
        this.resources = experience.resources;

        this.hotspots = [];
        this.i = 0;
    }

    computeHotspots() {
        const hotspots = this.resources.items.info?.hotspots;

        if (!hotspots) return;

        hotspots.forEach((hotspot, i) => this.computeHotspot(hotspot, i));
    }

    computeHotspot(hotspot, i) {
        const mesh = this.scene.getObjectByName(hotspot);

        if (!mesh) return;

        const coords = this.toScreenPosition(mesh, this.camera.instance);
        // const isInFront = this.isInFront(mesh, coords);
        const isInFront = true;

        const oldIsInFront = this.hotspots[i]?.isInFront;

        this.hotspots[i] = {
            name: hotspot,
            coords,
            isInFront: isInFront ?? oldIsInFront,
        };
    }

    isInFront(mesh, coords) {
        if (this.i % 10 !== 0) return;

        const normalizedX = (coords.x / this.sizes.width) * 2.0 - 1;
        const normalizedY = -(coords.y / this.sizes.height) * 2.0 + 1;

        const normalizedCoords = new Vector2(normalizedX, normalizedY);

        this.raycaster.instance.setFromCamera(
            normalizedCoords,
            this.camera.instance
        );

        const intersects = this.raycaster.instance.intersectObjects(
            this.scene.children
        );

        if (intersects.length === 0) return;

        const isInFront = intersects[0].object === mesh;

        return isInFront;
    }

    toScreenPosition(obj, camera) {
        const vector = new Vector3();

        const semiWidth = this.sizes.width / 2;
        const semiHeight = this.sizes.height / 2;

        obj.updateMatrixWorld();
        vector.setFromMatrixPosition(obj.matrixWorld);
        vector.project(camera);

        vector.x = vector.x * semiWidth + semiWidth;
        vector.y = -(vector.y * semiHeight) + semiHeight;

        return {
            x: vector.x,
            y: vector.y,
        };
    }

    update() {
        this.computeHotspots();

        this.onHotspotsUpdated(this.hotspots);

        this.i++;
    }

    dispose() {
        this.camera = null;
        this.scene = null;
        this.sizes = null;

        this.hotspots = null;
        this.i = null;
    }
}
