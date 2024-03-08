import { TextureLoader, CubeTextureLoader } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

import to from 'await-to-js';
import axios from 'axios';

import EventEmitter from './EventEmitter.js';

export default class Resources extends EventEmitter {
    constructor(sources) {
        super();

        this.sources = sources;

        this.items = {};
        this.toLoad = this.sources.filter(source => source.default).length;
        this.loaded = 0;
        this.pathModelsOrigin = 'assets/models';

        this.inputButton = document.querySelector('#file-input');

        this.setLoaders();
        this.startLoading();

        // Drag&Drop event
        window.addEventListener('drop', e => {
            e.preventDefault();

            const blobData = this.handleFileDrop(e);
            this.notifyCorrectUpdate(blobData);
        });

        window.addEventListener('dragover', e => {
            e.preventDefault();
        });

        // Input event
        this.inputButton.addEventListener('change', e => {
            e.preventDefault();

            const blobData = this.handleFileInput(e);
            this.notifyCorrectUpdate(blobData);

            this.inputButton.value = '';
        });
    }

    setLoaders() {
        this.loaders = {};
        this.loaders.gltfLoader = new GLTFLoader();
        this.loaders.dracoLoader = new DRACOLoader();
        this.loaders.dracoLoader.setDecoderPath('draco/');
        this.loaders.gltfLoader.setDRACOLoader(this.loaders.dracoLoader);
        this.loaders.textureLoader = new TextureLoader();
        this.loaders.cubeTextureLoader = new CubeTextureLoader();
        this.loaders.rgbeLoader = new RGBELoader();
    }

    async startLoading() {
        // Load each source
        for (const source of this.sources) {
            if (source.default && source.default === true) {
                switch (source.type) {
                    case 'gltfModel':
                        const pathModelsSource = `${this.pathModelsOrigin}/${source.name}/${source.name}.glb`;

                        this.loaders.gltfLoader.load(pathModelsSource, file => {
                            this.sourceLoaded(source, file);
                        });

                        const pathInfoSource = `${this.pathModelsOrigin}/${source.name}/info.json`;

                        const [err, res] = await to(axios(pathInfoSource));

                        if (err) {
                            console.log('Info.json missing');
                        } else {
                            this.sourceLoaded({ name: 'info' }, res.data, true);
                        }

                        break;

                    case 'hdrTexture':
                        this.loaders.rgbeLoader.load(source.path, file => {
                            this.sourceLoaded(source, file);
                        });
                        break;

                    case 'texture':
                        this.loaders.textureLoader.load(source.path, file => {
                            this.sourceLoaded(source, file);
                        });
                        break;

                    case 'cubeTexture':
                        this.loaders.cubeTextureLoader.load(
                            source.path,
                            file => {
                                this.sourceLoaded(source, file);
                            }
                        );
                        break;
                    default:
                        break;
                }
            }
        }
    }

    sourceLoaded(source, file, isInfo = false) {
        this.items[source.name] = file;

        if (!isInfo) this.loaded++;

        if (this.loaded === this.toLoad) {
            this.trigger('ready');
        }
    }

    handleFileInput = e => {
        const files = e.target.files;

        if (!files) return;

        const file = files[0];

        if (!file) return;

        const type = file.name.split('.').pop();
        return { url: URL.createObjectURL(file), type };
    };

    handleFileDrop = e => {
        const files = e.dataTransfer.files;

        if (!files) return;

        const file = files[0];

        if (!file) return;

        const type = file.name.split('.').pop();
        return { url: URL.createObjectURL(file), type };
    };

    notifyCorrectUpdate = data => {
        const { url, type } = data;

        switch (type) {
            case 'hdr':
                this.trigger('updateHdr', [url]);
                break;

            case 'glb':
                this.trigger('updateGlb', [url]);
                break;
            default:
                break;
        }
    };
}
