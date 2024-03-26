import { TextureLoader, CubeTextureLoader } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { gltfViewer } from '@/GltfViewer.js';

import EventEmitter from './EventEmitter.js';

import { RESOURCES_MAX_PRIORITY } from '@/constants';
export default class Resources extends EventEmitter {
    constructor(options) {
        super();

        const {
            assetsBaseUrl,
            useDracoCompression,
            dracoDecoderPath,
            hdr,
            model,
        } = options;

        this.server = gltfViewer.server;

        this.items = {};
        this.baseLength = 2;
        this.totalLength = 2;
        this.loaded = 0;

        this.inputButton = document.querySelector('#file-input');

        //  Paths
        this.assetsModelsUrl = `${assetsBaseUrl}/models`;
        this.assetsHdrUrl = `${assetsBaseUrl}/hdrs`;

        this.modelName = model;
        this.hdrName = hdr;
        this.highPriorityModels = [];
        this.lowerPriorityModels = [];

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
        this.inputButton?.addEventListener('change', e => {
            e.preventDefault();

            const blobData = this.handleFileInput(e);
            this.notifyCorrectUpdate(blobData);

            this.inputButton.value = '';
        });

        this.setLoaders(useDracoCompression, dracoDecoderPath);
        this.setBaseResources();
    }

    setLoaders(useDracoCompression, dracoDecoderPath) {
        this.loaders = {};
        this.loaders.gltfLoader = new GLTFLoader();
        if (useDracoCompression) {
            this.loaders.dracoLoader = new DRACOLoader();
            this.loaders.dracoLoader.setDecoderPath(dracoDecoderPath);
            this.loaders.gltfLoader.setDRACOLoader(this.loaders.dracoLoader);
        }
        this.loaders.textureLoader = new TextureLoader();
        this.loaders.cubeTextureLoader = new CubeTextureLoader();
        this.loaders.rgbeLoader = new RGBELoader();
    }

    async setBaseResources() {
        await this.loadModelsInfo();
        this.loadHdr();

        if (this.items.info) {
            if (
                this.items.info.multipleModel === true &&
                this.items.info.models
            ) {
                this.highPriorityModels = this.items.info.models.filter(
                    model => model.priority === RESOURCES_MAX_PRIORITY
                );

                this.lowerPriorityModels = this.items.info.models.filter(
                    model => model.priority !== RESOURCES_MAX_PRIORITY
                );

                this.baseLength += this.highPriorityModels.length;
                this.totalLength =
                    this.totalLength +
                    this.highPriorityModels.length +
                    this.lowerPriorityModels.length;

                await this.loadModel(this.highPriorityModels);
            } else {
                this.baseLength += 1;
                this.totalLength += 1;
                this.loadModel();
            }
            return;
        }

        this.loadModel();
    }

    async loadModelsInfo() {
        const pathInfoSource = `${this.assetsModelsUrl}/${this.modelName}/info.json`;

        const [err, res] = await this.server.axiosCall({ url: pathInfoSource });

        if (err) {
            console.log('Info.json missing');
        } else {
            this.sourceLoaded('info', res.data);
        }
    }

    async loadModel(models = undefined) {
        let pathModelsSource = '';

        if (!models) {
            pathModelsSource = `${this.assetsModelsUrl}/${this.modelName}/${this.modelName}.glb`;

            this.loaders.gltfLoader.load(pathModelsSource, file => {
                this.sourceLoaded(this.modelName, file);
            });

            return;
        }

        for (const model in models) {
            pathModelsSource = `${this.assetsModelsUrl}/${this.modelName}/${models[model].id}.glb`;

            this.loaders.gltfLoader.load(pathModelsSource, file => {
                this.sourceLoaded(models[model].id, file);
            });
        }
    }

    loadHdr() {
        const pathHdrsSource = `${this.assetsHdrUrl}/${this.hdrName}/${this.hdrName}.hdr`;
        this.loaders.rgbeLoader.load(pathHdrsSource, file => {
            this.sourceLoaded(this.hdrName, file);
        });
    }

    sourceLoaded(name, file) {
        this.items[name] = file;

        this.loaded++;

        if (this.loaded === this.baseLength) {
            this.trigger('baseResourceSceneReady');
        }

        if (this.loaded === this.totalLength) {
            this.trigger('totalResourceSceneReady');
            return;
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
