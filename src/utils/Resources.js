import { TextureLoader, CubeTextureLoader } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

import to from 'await-to-js';
import axios from 'axios';

import EventEmitter from './EventEmitter.js';

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

        this.items = {};
        this.loaded = 0;
        this.inputButton = document.querySelector('#file-input');

        //  Paths
        this.assetsModelsUrl = `${assetsBaseUrl}/models`;
        this.assetsHdrUrl = `${assetsBaseUrl}/hdrs`;

        this.modelName = model;
        this.hdrName = hdr;

        this.setLoaders(useDracoCompression, dracoDecoderPath);

        this.loadModel();
        this.loadHdr();

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

    async loadModel() {
        const pathModelsSource = `${this.assetsModelsUrl}/${this.modelName}/${this.modelName}.glb`;
        this.loaders.gltfLoader.load(pathModelsSource, file => {
            this.sourceLoaded(this.modelName, file);
        });

        const pathInfoSource = `${this.assetsModelsUrl}/${this.modelName}/info.json`;

        const [err, res] = await to(axios(pathInfoSource));

        if (err) {
            console.log('Info.json missing');
        } else {
            this.sourceLoaded('info', res.data, true);
        }
    }

    loadHdr() {
        const pathHdrsSource = `${this.assetsHdrUrl}/${this.hdrName}/${this.hdrName}.hdr`;
        this.loaders.rgbeLoader.load(pathHdrsSource, file => {
            this.sourceLoaded(this.hdrName, file);
        });
    }

    sourceLoaded(name, file, isInfo = false) {
        this.items[name] = file;

        if (!isInfo) this.loaded++;

        if (this.loaded === 2) {
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
