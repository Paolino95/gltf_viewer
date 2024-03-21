import { AxesHelper } from 'three';
import { gltfViewer } from '@/GltfViewer.js';

// Params
import { helpersParams } from '@/parameters/ui';

export default class Helpers {
    constructor() {
        this.scene = gltfViewer.scene;
        this.debug = gltfViewer.debug;

        // Debug Folder
        if (this.debug.active) {
            this.debugFolder = this.debug.pane.addFolder({
                title: 'Helpers',
                expanded: false,
            });

            this.debugFolder
                .addBinding(helpersParams, 'axesHelper')
                .on('change', e => (this.helpers.axesHelper.visible = e.value));
        }

        this.setInstance();
    }

    setInstance() {
        this.helpers = {};
        this.helpers.axesHelper = new AxesHelper(1);
        this.scene.add(this.helpers.axesHelper);
        this.helpers.axesHelper.visible = helpersParams.axesHelper;
    }
}
