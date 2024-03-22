import { DoubleSide, MeshStandardMaterial, Raycaster } from 'three';
import { gltfViewer } from '@/GltfViewer.js';
import { RAYCASTER_MAX_DISTANCE } from '@/constants';

export default class Raycast {
    constructor() {
        this.camera = gltfViewer.camera;
        this.debug = gltfViewer.debug;
        this.scene = gltfViewer.scene;
        this.sizes = gltfViewer.sizes;
        this.canvas = gltfViewer.canvas;
        this.mouse = gltfViewer.mouse;
        this.interactionEvents = gltfViewer.interactionEvents;
        this.resources = gltfViewer.resources;
        this.bok = gltfViewer.bok;
        this.world = gltfViewer.world;

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
        if (!this.resources.items.info) {
            return;
        }

        const intersects = this.getIntersects();

        if (intersects.length > 0) {
            let meshCounter = 0;
            // take the first intersected mesh
            let selectedMesh = intersects[meshCounter].object;

            const selectedCompatibleMeshes = Object.keys(
                this.resources.items.info.bokInteraction
            );
            // find the first compatible mesh among the first N intersected
            while (
                meshCounter < intersects.length - 1 &&
                meshCounter < RAYCASTER_MAX_DISTANCE &&
                selectedCompatibleMeshes.includes(selectedMesh.name) === false
            ) {
                meshCounter++;
                selectedMesh = intersects[meshCounter].object;
            }

            // if such a compatible mesh is found...
            if (selectedCompatibleMeshes.includes(selectedMesh.name)) {
                this.bok.sendMessage(
                    this.resources.items.info.bokInteraction[selectedMesh.name]
                        .name
                );
            }
        }
    }

    toggleHighlightMesh(meshName) {
        this.restoreMeshMaterial();

        const mesh = this.scene.getObjectByName(meshName);
        this.highlightMesh(mesh);
    }

    highlightMesh(mesh) {
        // store old data
        this.lastSelectedMesh = mesh;
        this.lastMaterial = mesh.material;

        // change new mesh material
        mesh.material = this.highlightMaterial;
    }

    restoreMeshMaterial() {
        if (this.lastSelectedMesh) {
            this.lastSelectedMesh.material = this.lastMaterial;
        }
    }
}
