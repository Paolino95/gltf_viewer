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

        // connection variables
        this.hostUrl;
        this.host;  // host will be received in base 64
        this.token = "null";  // custom received token parameter
        this.fts = "null";

        this.setInstance();
        this.setPointer();

        // instanced functions
        this.onPointerMove = this.onPointerMove.bind(this);
        this.onDocumentDoubleClick = this.onDocumentDoubleClick.bind(this);
        this.highlightMesh = this.highlightMesh.bind(this);
        this.restoreMeshMaterial = this.restoreMeshMaterial.bind(this);
        // this.catchHostCall = this.catchHostCall.bind(this);
        this.getURLParameter = this.getURLParameter.bind(this);
        this.catchHostCall();

        // listeners
        document.addEventListener('dblclick', this.onDocumentDoubleClick, false);

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
        // calculate pointer position in normalized device coordinates (-1 to +1) for both components
        this.pointer.x = (mouseX / this.sizes.width) * 2 - 1;
        this.pointer.y = -(mouseY / this.sizes.height) * 2 + 1;
    }

    onDocumentDoubleClick(e) {
        e.preventDefault();
       
        // raycast to pick intersected meshes
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
                meshCounter < intersects.length - 1 &&
                meshCounter < 5 &&
                scm.includes(this.selectedMesh.name) === false                 
            ) {
                meshCounter++;
                this.selectedMesh = intersects[meshCounter].object;
            }
            
            // if such a compatible mesh is found...
            if (scm.includes(this.selectedMesh.name)) {
                // if old material is not null, give old mesh the old material
                if (this.lastMaterial !== null)
                    this.restoreMeshMaterial(this.lastSelectedMesh, this.lastMaterial);
                // store old mesh
                this.lastSelectedMesh = intersects[meshCounter].object;
                // store old mesh material
                this.lastMaterial = intersects[meshCounter].object.material;
                // change new mesh material
                    this.highlightMesh(intersects[meshCounter]);

                // notify BOK of selected mesh
                // 
                this.sendMessage(SELECTABLE_CAR_MESHES[this.selectedMesh.name].name);
                // 
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
        mesh.object.material = new MeshStandardMaterial({color: 0x00ff00, wireframe: true });
    }

    restoreMeshMaterial(mesh, oldMaterial) {
        mesh.material = oldMaterial;

        //  FUTURE UPGRADE: will be called when new page is opened (BOK call)
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

        window.open(this.host + "?token=" + this.token + "&fts=" + "&nlu=" + btoa(meshName));

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

    catchHostCall() {
        this.token = this.getURLParameter("token");
        this.host = this.getURLParameter("host") ? atob(this.getURLParameter("host")) : window.location.origin + "/progetto-leonardo-web/";
        console.log("Host: ", this.host);
        console.log("Token: ", this.token);
    }

    checkFtsFormat(curretnFts) {
        if(curretnFts !== null) {
            this.fts = btoa(curretnFts)
        }
    }

    getURLParameter(sParam) {
        var sPageURL = window.location.search.substring(1);
        var sURLVariables = sPageURL.split('&');
        let output = false;
        let sParameterName = null;
        for (var i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] == sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }

        return false;
    }

    dispose() {
        window.removeEventListener('mousemove', this.onPointerMove);
        window.removeEventListener('mousedown', this.onDocumentMouseDown);
        window.removeEventListener('mouseup', this.onDocumentMouseUp);
    }
}
