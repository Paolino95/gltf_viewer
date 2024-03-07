import {
    MOD_1,
    MOD_2,
    MOD_3,
    MOD_4,
    MOD_5,
    HDR_1,
    HDR_2,
    HDR_3,
} from '../constants';

export default [
    {
        name: HDR_1,
        type: 'hdrTexture',
        path: 'assets/environment/graveyard.pathways_2k.hdr',
        default: true,
    },
    {
        name: HDR_2,
        type: 'hdrTexture',
        path: 'assets/environment/default.hdr',
        default: false,
    },
    {
        name: HDR_3,
        type: 'hdrTexture',
        path: 'assets/environment/industrial.hdr',
        default: false,
    },
    {
        name: MOD_1,
        type: 'gltfModel',
        path: 'assets/models/laser_genius.glb',
        default: true,
    },
    {
        name: MOD_2,
        type: 'gltfModel',
        path: 'assets/models/iqos_model.glb',
        default: false,
    },
    {
        name: MOD_3,
        type: 'gltfModel',
        path: 'assets/models/Glass_Holder.glb',
        default: false,
    },
    {
        name: MOD_4,
        type: 'gltfModel',
        path: 'assets/models/Lampadario.glb',
        default: false,
    },
    {
        name: MOD_5,
        type: 'gltfModel',
        path: 'assets/models/fiat_500_modified.glb',
        default: false,
    },
];
