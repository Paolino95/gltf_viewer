import { AxesHelper } from 'three';
import Experience from '@/Experience.js';

// Params
import { helpersParams } from '@/parameters/ui';

export default class Helpers {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.debug = this.experience.debug;

        // Debug Folder
        if (this.debug.active) {
            this.debugFolder = this.debug.pane.addFolder({
                title: 'Helpers',
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
        this.experience.scene.add(this.helpers.axesHelper);
    }
}