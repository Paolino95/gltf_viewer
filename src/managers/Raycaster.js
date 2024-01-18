import { MeshBasicMaterial, Raycaster, Vector2 } from 'three';
import Experience from '@/Experience.js';

export default class Raycast {
    constructor() {
        // imported parameters
        this.experience = new Experience();
        this.camera = this.experience.camera;
        this.debug = this.experience.debug;
        this.scene = this.experience.scene;
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
        document.addEventListener( 'mousedown', this.onDocumentMouseDown, false );
        document.addEventListener( 'mouseup', this.onDocumentMouseUp, false );
        window.addEventListener( 'pointermove', this.onPointerMove );
    }

    setInstance() {
        this.instance = new Raycaster();
    }

    setPointer() {
        this.pointer = new Vector2();
    }
    
    onPointerMove( event ) {
        // calculate pointer position in normalized device coordinates
        // (-1 to +1) for both components
        this.pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        this.pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    
    }
    
    onDocumentMouseDown(e) {
        e.preventDefault();
        console.log('Click down...');
        this.clickStart = Date.now()
    }

    onDocumentMouseUp(e) {
        e.preventDefault();
        console.log('... CLICK UP');
        let delay = Date.now() - this.clickStart;
        console.log(delay);
        if(delay <= 300) {

            this.instance.setFromCamera( this.pointer, this.camera.instance );
            var intersects = this.instance.intersectObjects( this.scene.children );
            this.selectedMesh = intersects[0].object;
            // if(intersects.length > 0) {
            //     console.log(intersects[0].object);

            //     // if old material is not null, give old mesh the old material
            //     if(this.lastMaterial !== null) this.lastSelectedMesh.material = this.lastMaterial;
            //     // store old mesh
            //     this.lastSelectedMesh = intersects[0].object;
            //     // store old mesh material
            //     this.lastMaterial = intersects[0].object.material;
            //     // change new mesh material
            //     intersects[0].object.material = new MeshBasicMaterial({color: 0x00ff00});
            // }   
        }

    }

    dispose() {
        window.removeEventListener('mousemove', this.onPointerMove);
        window.removeEventListener('mousedown', this.onDocumentMouseDown);
        window.removeEventListener('mouseup', this.onDocumentMouseUp);
    }
    
}