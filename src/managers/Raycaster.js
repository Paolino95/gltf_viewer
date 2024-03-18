import { DoubleSide, MeshStandardMaterial, Raycaster } from 'three';
import { experience } from '@/Experience.js';
import { RAYCASTER_MAX_DISTANCE } from '../constants';

export default class Raycast {
    constructor() {
        this.camera = experience.camera;
        this.debug = experience.debug;
        this.scene = experience.scene;
        this.sizes = experience.sizes;
        this.canvas = experience.canvas;
        this.mouse = experience.mouse;
        this.interactionEvents = experience.interactionEvents;
        this.resources = experience.resources;
        this.bok = experience.bok;
        this.world = experience.world;

        // variables buffers
        this.lastSelectedMesh = null;
        this.lastMaterial = null;

        this.highlightMaterial = new MeshStandardMaterial({
            color: 0x00ff00,
            transparent: true,
            opacity: 0.5,
            side: DoubleSide,
        });

        this.setInstance();

        this.highlightMesh = this.highlightMesh.bind(this);
        this.restoreMeshMaterial = this.restoreMeshMaterial.bind(this);

        this.interactionEvents.on('onDoubleClick', () => {
            this.sendBok();
        });
    }

    setInstance() {
        this.instance = new Raycaster();
    }

    getIntersects() {
        this.instance.setFromCamera(this.mouse.pointer, this.camera.instance);
        const intersects = this.instance.intersectObjects(this.scene.children);

        return intersects;
    }

    sendBok() {
        const intersects = this.getIntersects();
        console.log({ intersects });
        if (intersects.length > 0) {
            let meshCounter = 0;
            // take the first intersected mesh
            let selectedMesh = intersects[meshCounter].object;

            const selectedCompatibleMeshes = Object.keys(
                this.resources.items.info?.bokInteraction
            );
            // find the first compatible mesh among the first N intersected
            while (
                meshCounter < intersects.length - 1 &&
                meshCounter < RAYCASTER_MAX_DISTANCE &&
                selectedCompatibleMeshes.includes(selectedMesh.name) === false
            ) {
                meshCounter++;
                selectedMesh = intersects[meshCounter].object;
                console.log({ selectedMesh });
            }

            // if such a compatible mesh is found...
            if (selectedCompatibleMeshes.includes(selectedMesh.name)) {
                this.bok.sendMessage(
                    this.resources.items.info?.bokInteraction[selectedMesh.name]
                        .name
                );
            }
        }
    }

    toggleHighlightMesh(meshName) {
        const mesh = this.scene.getObjectByName(meshName);

        // if old material is not null, give old mesh the old material
        if (mesh.material === this.highlightMaterial) {
            this.restoreMeshMaterial(mesh, this.lastMaterial);
        } else {
            // store old mesh
            this.lastSelectedMesh = mesh;
            // store old mesh material
            this.lastMaterial = mesh.material;
            // change new mesh material
            this.highlightMesh(mesh);
        }
    }

    highlightMesh(mesh) {
        mesh.material = this.highlightMaterial;
    }

    restoreMeshMaterial(mesh, oldMaterial) {
        mesh.material = oldMaterial;
    }
}
