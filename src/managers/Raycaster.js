import {
    MeshStandardMaterial,
    Raycaster,
    Vector2,
} from 'three';
import Experience from '@/Experience.js';
import {
    BACKEND_URL,
    CLIENT_NAME,
    CONNECTION_PARAMETER_TOKEN,
    CONNECTION_TOKEN,
    SELECTABLE_CAR_MESHES,
} from '../constants';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

export default class Raycast {
    constructor() {
        // imported parameters
        this.experience = new Experience();
        this.camera = this.experience.camera;
        this.debug = this.experience.debug;
        this.scene = this.experience.scene;
        this.sizes = this.experience.sizes;
        this.canvas = this.experience.canvas;
        this.selectedMesh = null;

        // mouse click time tracking
        this.clickStart = null;

        // variables buffers
        this.lastSelectedMesh = null;
        this.lastMaterial = null;

        this.setInstance();
        this.setPointer();

        this.onPointerMove = this.onPointerMove.bind(this);
        this.onDocumentMouseDown = this.onDocumentMouseDown.bind(this);
        this.onDocumentMouseUp = this.onDocumentMouseUp.bind(this);

        // listeners
        document.addEventListener('mousedown', this.onDocumentMouseDown, false);
        document.addEventListener('mouseup', this.onDocumentMouseUp, false);

        this.canvasRect = this.canvas.getBoundingClientRect();
        window.addEventListener('pointermove', this.onPointerMove);
    }

    setInstance() {
        this.instance = new Raycaster();
    }

    setPointer() {
        this.pointer = new Vector2();
    }

    onPointerMove(event) {
        const mouseX = event.clientX - this.canvasRect.left;
        const mouseY = event.clientY - this.canvasRect.top;
        // calculate pointer position in normalized device coordinates
        // (-1 to +1) for both components
        this.pointer.x = (mouseX / this.sizes.width) * 2 - 1;
        this.pointer.y = -(mouseY / this.sizes.height) * 2 + 1;
    }

    onDocumentMouseDown(e) {
        e.preventDefault();
        // console.log('Click down...');
        this.clickStart = Date.now();
    }

    onDocumentMouseUp(e) {
        e.preventDefault();
        // console.log('... CLICK UP');
        let delay = Date.now() - this.clickStart;
        // console.log(delay);
        if (delay <= 300) {
            this.instance.setFromCamera(this.pointer, this.camera.instance);
            var intersects = this.instance.intersectObjects(
                this.scene.children
            );
            if (intersects.length > 0) {
                let meshCounter = 0;
                // take the first intersected mesh
                this.selectedMesh = intersects[meshCounter].object;

                const scm = Object.keys(SELECTABLE_CAR_MESHES);

                // find the first compatible mesh among the first N intersected
                while (
                    scm.includes(this.selectedMesh.name) === false &&
                    meshCounter < 5
                ) {
                    meshCounter++;
                    this.selectedMesh = intersects[meshCounter].object;
                }

                // if such a compatible mesh is found...
                if (scm.includes(this.selectedMesh.name)) {
                    // console.log(intersects[meshCounter].object.name);
                    // if old material is not null, give old mesh the old material
                    if (this.lastMaterial !== null)
                        this.lastSelectedMesh.material = this.lastMaterial;
                    // store old mesh
                    this.lastSelectedMesh = intersects[meshCounter].object;
                    // store old mesh material
                    this.lastMaterial = intersects[meshCounter].object.material;
                    // change new mesh material
                    intersects[meshCounter].object.material =
                        new MeshStandardMaterial({
                            color: 0x00ff00,
                            wireframe: true,
                        });

                    // this.sendMessage(SELECTABLE_CAR_MESHES[this.selectedMesh.name].name);
                } else {
                    if (this.lastMaterial !== null)
                        this.lastSelectedMesh.material = this.lastMaterial;
                }
            } else {
                if (this.lastMaterial !== null)
                        this.lastSelectedMesh.material = this.lastMaterial;
            }
        }
    }

    sendMessage(meshName) {
        // const uuid = uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
        // const data = JSON.stringify({
        // data: {
        //     IDQueryParameter: uuid,
        //     JsonData: '{"FTS":null,"NluQuestion":"' + meshName + '"}',
        //     ConnectionToken: CONNECTION_TOKEN,
        //     ConnectionExecuted: 'true',
        // },
        // customParameters: {
        //         ClientName: CLIENT_NAME,
        //         Token: CONNECTION_PARAMETER_TOKEN,
        //     }
        // });

        window.open(BACKEND_URL + "?fts=" + btoa(JSON.stringify('null')) + "&nlu=" + btoa(JSON.stringify('{"FTS":null,"NluQuestion":"' + meshName + '"}')));

        // const instance = axios.create({
        //     baseURL: BACKEND_URL,
        //     headers: {
        //         'Access-Control-Allow-Origin': '*',
        //         'Content-Type': 'application/json',
        //     },
        // });

        // instance
        //     .post(BACKEND_URL, {
        //         data: {
        //             IDQueryParameter: uuid,
        //             JsonData: '{"FTS":null,"NluQuestion":"' + meshName + '"}',
        //             ConnectionToken: CONNECTION_TOKEN,
        //             ConnectionExecuted: 'true',
        //         },
        //         customParameters: {
        //             ClientName: CLIENT_NAME,
        //             Token: CONNECTION_PARAMETER_TOKEN,
        //         },
        //     })
        //     .then(function (response) {
        //         // handle success
        //         console.log(response);
        //     })
        //     .catch(function (error) {
        //         // handle error
        //         console.log(error);
        //     })
        //     .finally(function () {
        //         // always executed
        //         console.log('end');
        //     });
    }

    dispose() {
        window.removeEventListener('mousemove', this.onPointerMove);
        window.removeEventListener('mousedown', this.onDocumentMouseDown);
        window.removeEventListener('mouseup', this.onDocumentMouseUp);
    }
}
