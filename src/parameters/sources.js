import { MOD_1, MOD_2, MOD_3, MOD_4, HDR_1, HDR_2, HDR_3, HDR_4 } from '../constants';

export default [
    {
        name: HDR_1,
        type: 'hdrTexture',
        path: 'assets/environment/graveyard.pathways_2k.hdr',
        default: false,
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
        name: HDR_4,
        type: 'hdrTexture',
        path: 'assets/environment/industrial_2.hdr',
        default: true,
    },
    {
        name: MOD_1,
        type: 'gltfModel',
        default: true,
    },
    {
        name: MOD_2,
        type: 'gltfModel',
        default: false,
    },
    {
        name: MOD_3,
        type: 'gltfModel',
        default: false,
    },
    {
        name: MOD_4,
        type: 'gltfModel',
        default: false,
    },
];
