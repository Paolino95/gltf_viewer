import {
    Mesh,
    Color,
    MeshStandardMaterial,
    EquirectangularReflectionMapping,
} from 'three';
import { experience } from '@/Experience.js';
import {
    sceneParams,
    backgroundOptionsList,
    hdrList,
} from '@/parameters/ui.js';
import { constructList } from '@/utils/functions';

import {
    ENV_BACKGROUND_COLOR,
    ENV_BACKGROUND_TEXTURE,
    DEBUG_EXPANDED_TAB,
    HDR_1,
    HDR_2,
    HDR_3,
} from '@/constants';

export default class Environment {
    constructor() {
        this.scene = experience.scene;
        this.resources = experience.resources;
        this.debug = experience.debug;

        this.environmentMap = {};
        this.environmentMap.texture = this.defaultEnvironmentMap().hdr;

        this.setBackgroundType(ENV_BACKGROUND_COLOR);
        this.setEnvironmentMap();

        // Debug Folder
        if (this.debug.active) {
            this.debugFolder = this.debug.pane.addFolder({
                title: 'environment',
                expanded: DEBUG_EXPANDED_TAB['ENVIRONMENT_PARAMETERS'].expanded,
            });

            this.modelList = this.debugFolder
                .addBlade({
                    view: 'list',
                    label: 'Select Hdr',
                    options: constructList(hdrList),
                    value: this.defaultEnvironmentMap().name,
                })
                .on('change', async e => {
                    const path = this.resources.sources.filter(
                        source => source.name === e.value
                    )[0].path;
                    this.updateEnvironmentMap(path);
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

    defaultEnvironmentMap() {
        for (const source of this.resources.sources) {
            if (
                source.type === 'hdrTexture' &&
                source.default === true &&
                [HDR_1, HDR_2, HDR_3].includes(source.name)
            ) {
                return {
                    name: source.name,
                    hdr: this.resources.items[source.name],
                };
            }
        }
    }

    setEnvironmentMap() {
        this.environmentMap.intensity = sceneParams.envMapIntensity;
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
                    sceneParams.backgroundColor == 'transparent'
                        ? null
                        : new Color(sceneParams.backgroundColor);
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
