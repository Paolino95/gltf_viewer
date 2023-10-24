import { Pane } from 'tweakpane';
import * as EssentialsPlugin from '@tweakpane/plugin-essentials';

export default class Debug {
    constructor(containerElement, title = 'Viewer Controls') {
        this.active = window.location.hash === '#debug';

        if (this.active) {
            this.pane = new Pane({
                container: containerElement,
                title,
            });

            this.pane.registerPlugin(EssentialsPlugin);

            // Add a FPS graph
            this.fpsGraph = this.pane.addBlade({
                view: 'fpsgraph',
                label: 'fps',
            });
        }
    }
}
