import {
    NoToneMapping,
    LinearToneMapping,
    ReinhardToneMapping,
    CineonToneMapping,
    ACESFilmicToneMapping,
    NoColorSpace,
    SRGBColorSpace,
    LinearSRGBColorSpace,
    DisplayP3ColorSpace,
    LinearDisplayP3ColorSpace,
    BasicShadowMap,
    PCFShadowMap,
    PCFSoftShadowMap,
    VSMShadowMap,
    WebGLRenderer,
} from 'three';
import Experience from '@/Experience.js';

import { DEBUG_EXPANDED_TAB } from '@/constants';

export default class Renderer {
    constructor() {
        this.experience = new Experience();
        this.canvas = this.experience.canvas;
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.camera = this.experience.camera;
        this.debug = this.experience.debug;

        this.setInstance();

        // Debug Folder
        if (this.debug.active) {
            this.debugFolder = this.debug.pane.addFolder({
                title: 'Renderer Parameters',
                expanded: DEBUG_EXPANDED_TAB['RENDERER_PARAMETERS'].expanded,
            });

            this.debugFolder
                .addBlade({
                    view: 'list',
                    label: 'toneMapping',
                    options: [
                        { text: 'NoToneMapping', value: NoToneMapping },
                        { text: 'LinearToneMapping', value: LinearToneMapping },
                        {
                            text: 'ReinhardToneMapping',
                            value: ReinhardToneMapping,
                        },
                        { text: 'CineonToneMapping', value: CineonToneMapping },
                        {
                            text: 'ACESFilmicToneMapping',
                            value: ACESFilmicToneMapping,
                        },
                    ],
                    value: this.instance.toneMapping,
                })
                .on('change', e => (this.instance.toneMapping = e.value));

            this.debugFolder
                .addBlade({
                    view: 'list',
                    label: 'shadowMap Type',
                    options: [
                        { text: 'BasicShadowMap', value: BasicShadowMap },
                        { text: 'PCFShadowMap', value: PCFShadowMap },
                        {
                            text: 'PCFSoftShadowMap',
                            value: PCFSoftShadowMap,
                        },
                        { text: 'VSMShadowMap', value: VSMShadowMap },
                    ],
                    value: this.instance.shadowMap.type,
                })
                .on(
                    'change',
                    e => (this.instance.shadowMap.type = Number(e.value))
                );

            this.debugFolder
                .addBlade({
                    view: 'list',
                    label: 'outputColorSpace',
                    options: [
                        {
                            text: 'NoColorSpace',
                            value: NoColorSpace,
                        },
                        { text: 'srgb', value: SRGBColorSpace },
                        { text: 'srgb-linear', value: LinearSRGBColorSpace },
                        {
                            text: 'display-p3',
                            value: DisplayP3ColorSpace,
                        },
                        {
                            text: 'display-p3-linear',
                            value: LinearDisplayP3ColorSpace,
                        },
                    ],
                    value: this.instance.outputColorSpace,
                })
                .on('change', e => (this.instance.outputColorSpace = e.value));

            this.debugFolder
                .addBinding(this.instance, 'toneMappingExposure')
                .on(
                    'change',
                    e => (this.instance.toneMappingExposure = Number(e.value))
                );
        }
    }

    setInstance() {
        this.instance = new WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
        });
        this.instance.toneMapping = LinearToneMapping;
        this.instance.toneMappingExposure = 1;
        this.instance.outputColorSpace = SRGBColorSpace;
        this.instance.setSize(this.sizes.width, this.sizes.height);
        this.instance.setPixelRatio(this.sizes.pixelRatio);
    }

    resize() {
        this.instance.setSize(this.sizes.width, this.sizes.height);
        this.instance.setPixelRatio(this.sizes.pixelRatio);
    }

    update() {
        this.instance.render(this.scene, this.camera.instance);
    }
}
