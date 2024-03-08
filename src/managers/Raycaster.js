import { DoubleSide, MeshStandardMaterial, Raycaster } from 'three';
import Experience from '@/Experience.js';
import { RAYCASTER_MAX_DISTANCE } from '../constants';

export default class Raycast {
    constructor() {
        // imported parameters
        this.experience = new Experience();
        this.camera = this.experience.camera;
        this.debug = this.experience.debug;
        this.scene = this.experience.scene;
        this.sizes = this.experience.sizes;
        this.canvas = this.experience.canvas;
        this.mouse = this.experience.mouse;
        this.interactionEvents = this.experience.interactionEvents;
        this.resources = this.experience.resources;
        this.bok = this.experience.bok;
        this.selectedMesh = null;

        // variables buffers
        this.lastSelectedMesh = null;
        this.lastMaterial = null;

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
        // raycast to pick intersected meshes
        this.instance.setFromCamera(this.mouse.pointer, this.camera.instance);
        const intersects = this.instance.intersectObjects(this.scene.children);

        if (intersects.length > 0) {
            let meshCounter = 0;
            // take the first intersected mesh
            this.selectedMesh = intersects[meshCounter].object;

            const selectedCompatibleMeshes = Object.keys(
                this.resources.items.info?.bokInteraction
            );
            // find the first compatible mesh among the first N intersected
            while (
                meshCounter < intersects.length - 1 &&
                meshCounter < RAYCASTER_MAX_DISTANCE &&
                selectedCompatibleMeshes.includes(this.selectedMesh.name) ===
                    false
            ) {
                meshCounter++;
                this.selectedMesh = intersects[meshCounter].object;
            }

            // if such a compatible mesh is found...
            if (selectedCompatibleMeshes.includes(this.selectedMesh.name)) {
                // if old material is not null, give old mesh the old material
                if (this.lastMaterial !== null)
                    this.restoreMeshMaterial(
                        this.lastSelectedMesh,
                        this.lastMaterial
                    );
                // store old mesh
                this.lastSelectedMesh = intersects[meshCounter].object;
                // store old mesh material
                this.lastMaterial = intersects[meshCounter].object.material;
                // change new mesh material
                this.highlightMesh(intersects[meshCounter]);

                // notify BOK of selected mesh
                if (!this.debug.active) {
                    this.bok.sendMessage(
                        this.resources.items.info?.bokInteraction[
                            this.selectedMesh.name
                        ].name
                    );
                }
            } else {
                // if doubleclicked on no compatible mesh, restore material
                if (this.lastMaterial !== null)
                    this.lastSelectedMesh.material = this.lastMaterial;
            }
        } else {
            // if doubleclicked outside of 3d model, restore material
            if (this.lastMaterial !== null)
                this.lastSelectedMesh.material = this.lastMaterial;
        }
    }

    highlightMesh(mesh) {
        mesh.object.material = new MeshStandardMaterial({
            color: 0x00ff00,
            transparent: true,
            opacity: 0.4,
            side: DoubleSide,
        });
    }

    restoreMeshMaterial(mesh, oldMaterial) {
        mesh.material = oldMaterial;

        //  FUTURE UPGRADE: will be called when new page is opened (BOK call)
    }
}
