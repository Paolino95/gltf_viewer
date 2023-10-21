import { Pane } from 'tweakpane';
import * as EssentialsPlugin from '@tweakpane/plugin-essentials';
// import { sceneParams } from '../params';

export default class Debug {
    constructor(containerElement, title = 'Viewer Controls') {
        this.active = window.location.hash === '#debug';

        if (this.active) {
            this.pane = new Pane({
                container: document.querySelector(containerElement),
                title,
            });

            this.pane.registerPlugin(EssentialsPlugin);

            // this.sceneParamsFolder = this.pane.addFolder({
            //     title: 'Scene Params',
            // });

            // this.bloomParamsFolder = this.pane.addFolder({
            //     disabled: !sceneParams.bloom,
            //     title: 'Model Bloom Params',
            // });

            // this.toneMappingFolder = this.pane.addFolder({
            //     title: 'Tone Mapping Params',
            // });
        }
    }
}
