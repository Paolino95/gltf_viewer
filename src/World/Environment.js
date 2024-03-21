import {
    Mesh,
    Color,
    MeshStandardMaterial,
    EquirectangularReflectionMapping,
} from 'three';
import { gltfViewer } from '@/GltfViewer.js';
import { backgroundOptionsList } from '@/parameters/ui.js';
import { constructList } from '@/utils/functions';

import {
    ENV_BACKGROUND_COLOR,
    ENV_BACKGROUND_TRANSPARENT,
    ENV_BACKGROUND_TEXTURE,
    ENV_MAP_INTENSITY,
    DEFAULT_ENV_MAP_COLOR,
} from '@/constants';

export default class Environment {
    constructor() {
        this.scene = gltfViewer.scene;
        this.resources = gltfViewer.resources;
        this.debug = gltfViewer.debug;

        this.environmentMap = {};
        this.environmentMap.texture =
            this.resources.items[this.resources.hdrName];

        this.setBackgroundType(ENV_BACKGROUND_COLOR);
        this.setEnvironmentMap();

        // Debug Folder
        if (this.debug.active) {
            this.debugFolder = this.debug.pane.addFolder({
                title: 'environment',
                expanded: false,
            });

            this.debugFolder
                .addBinding(this.environmentMap, 'intensity', {
                    min: 0,
                    max: 4,
                    step: 0.1,
                })
                .on('change', this.updateMaterials);

            this.backgroundOptionsList = this.debugFolder
                .addBlade({
                    view: 'list',
                    label: 'background',
                    options: constructList(backgroundOptionsList),
                    value: ENV_BACKGROUND_COLOR,
                })
                .on('change', e => {
                    this.setBackgroundType(e.value);
                    this.updateMaterials();
                });

            this.backgroundColorToggle = this.debugFolder
                .addBinding(this.scene, 'background', {
                    label: 'Background Color',
                    color: { type: 'float' },
                })
                .on('change', e => {
                    sceneParams.backgroundColor = e.value;
                    this.scene.background = e.value;
                    this.updateMaterials();
                });

            this.debugFolder
                .addButton({ title: 'update hdr' })
                .on('click', () => {
                    this.resources.inputButton.click();
                });
        }

        this.resources.on('updateHdr', url => {
            this.updateEnvironmentMap(url);
        });
    }

    setEnvironmentMap() {
        this.environmentMap.intensity = ENV_MAP_INTENSITY;
        this.environmentMap.texture.mapping = EquirectangularReflectionMapping;

        this.scene.environment = this.environmentMap.texture;

        this.updateMaterials();
        this.setTextureBackground();
    }

    updateEnvironmentMap = path => {
        const self = this;

        this.resources.loaders.rgbeLoader.load(path, texture => {
            self.environmentMap.texture = texture;
            self.setEnvironmentMap();
        });
    };

    updateMaterials = () => {
        this.scene.traverse(child => {
            if (
                child instanceof Mesh &&
                child.material instanceof MeshStandardMaterial
            ) {
                child.material.envMap = this.environmentMap.texture;
                child.material.envMapIntensity = this.environmentMap.intensity;
                child.material.needsUpdate = true;
            }
        });
    };

    setBackgroundType = type => {
        this.setHiddenParameters();

        switch (type) {
            case ENV_BACKGROUND_COLOR:
                if (this.backgroundColorToggle)
                    this.backgroundColorToggle.hidden = false;
                this.scene.background =
                    DEFAULT_ENV_MAP_COLOR === ENV_BACKGROUND_TRANSPARENT
                        ? null
                        : new Color(ENV_BACKGROUND_COLOR);
                break;

            case ENV_BACKGROUND_TEXTURE:
                this.setTextureBackground();
                break;
            default:
                break;
        }
    };

    setTextureBackground = () => {
        if (
            this.backgroundOptionsList &&
            this.backgroundOptionsList.value === ENV_BACKGROUND_TEXTURE
        ) {
            this.scene.background = this.environmentMap.texture;
        }
    };

    setHiddenParameters = () => {
        if (this.backgroundColorToggle)
            this.backgroundColorToggle.hidden = true;
    };
}
