import { AxesHelper, CameraHelper } from 'three';
import { gltfViewer } from '@/GltfViewer.js';

import { HELPER_AXES_VISIBILITY, HELPER_DL_VISIBILITY } from '@/constants';

export default class Helpers {
    constructor() {
        this.scene = gltfViewer.scene;
        this.debug = gltfViewer.debug;
        this.world = gltfViewer.world;

        this.helpersObject = {
            axesHelperVisibility: HELPER_AXES_VISIBILITY,
            directionalLightHelperVisibility: HELPER_DL_VISIBILITY,
        };

        // Debug Folder
        if (this.debug.active) {
            this.debugFolder = this.debug.pane.addFolder({
                title: 'Helpers',
                expanded: false,
            });

            this.debugFolder
                .addBinding(this.helpersObject, 'axesHelperVisibility', {
                    label: 'Axes Helper',
                })
                .on('change', e => (this.helpers.axesHelper.visible = e.value));

            this.debugFolder
                .addBinding(
                    this.helpersObject,
                    'directionalLightHelperVisibility',
                    { label: 'Directional Light Helper' }
                )
                .on('change', e => (this.helpers.dlHelper.visible = e.value));
        }

        this.world.on('baseSceneReady', () => {
            this.setInstance();
        });
    }

    setInstance() {
        this.helpers = {};
        this.helpers.axesHelper = new AxesHelper(5);
        this.helpers.dlHelper = new CameraHelper(
            this.world.lights.directionalLight.shadow.camera
        );
        this.scene.add(this.helpers.axesHelper, this.helpers.dlHelper);
        this.helpers.axesHelper.visible =
            this.helpersObject.axesHelperVisibility;
        this.helpers.dlHelper.visible =
            this.helpersObject.directionalLightHelperVisibility;
    }

    update() {
        if (
            this.helpers &&
            this.helpers.dlHelper &&
            this.helpers.dlHelper.visible === true
        )
            this.helpers.dlHelper.update();
    }
}
