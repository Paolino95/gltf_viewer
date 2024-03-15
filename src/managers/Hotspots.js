import { Vector2, Vector3 } from 'three';

import { experience } from '@/Experience.js';

export default class Hotspots {
    constructor(onHotspotsUpdated) {
        this.onHotspotsUpdated = onHotspotsUpdated;

        this.camera = experience.camera;
        this.scene = experience.scene;
        this.sizes = experience.sizes;
        this.raycaster = experience.raycaster;
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
        const { id, target, userData } = hotspot;

        const coords = this.computeCoords(target);

        if (!coords) return;

        // const isInFront = this.computeIsInFront(target, coords);
        const isInFront = true;

        const oldIsInFront = this.hotspots[i]?.isInFront;

        this.hotspots[i] = {
            id,
            coords,
            isInFront: isInFront ?? oldIsInFront,
            userData,
        };
    }

    computeCoords(target) {
        const { type, value } = target;

        if (type === 'mesh') return this.computeMeshCoords(value);

        if (type === 'position') return this.computePositionCoords(value);
    }

    computeMeshCoords(meshName) {
        const mesh = this.scene.getObjectByName(meshName);

        if (!mesh) return;

        const vector = new Vector3();
        mesh.updateMatrixWorld();
        vector.setFromMatrixPosition(mesh.matrixWorld);

        const coords = this.toScreenPosition(vector, this.camera.instance);

        return coords;
    }

    computePositionCoords(position) {
        const vector = new Vector3(position[0], position[1], position[2]);

        const coords = this.toScreenPosition(vector, this.camera.instance);

        return coords;
    }

    // 2024-03-14 11:26:20 - Tommaso Iacolettig
    // Questo potrebbe essere un metodo utils
    toScreenPosition(vector, camera) {
        const semiWidth = this.sizes.width / 2;
        const semiHeight = this.sizes.height / 2;

        vector.project(camera);

        vector.x = vector.x * semiWidth + semiWidth;
        vector.y = -(vector.y * semiHeight) + semiHeight;

        return {
            x: vector.x,
            y: vector.y,
        };
    }

    computeIsInFront(target, coords) {
        if (this.i % 10 !== 0) return;

        const { type, value } = target;

        if (type === 'mesh') return this.computeMeshIsInFront(value, coords);

        if (type === 'position')
            return this.computePositionIsInFront(value, coords);
    }

    computeMeshIsInFront(meshName, coords) {
        // 2024-03-14 11:27:03 - Tommaso Iacolettig
        // Questo potrebbe essere un metodo utils
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

        const isInFront = intersects[0].object.name === meshName;

        return isInFront;
    }

    computePositionIsInFront(position, coords) {
        return true;
    }

    update() {
        this.computeHotspots();

        const clonedHotspots = structuredClone(this.hotspots);
        this.onHotspotsUpdated(clonedHotspots);

        this.i++;
    }

    dispose() {
        this.onHotspotsUpdated = null;

        this.camera = null;
        this.scene = null;
        this.sizes = null;
        this.raycaster = null;
        this.resources = null;

        this.hotspots = null;
        this.i = null;
    }
}
