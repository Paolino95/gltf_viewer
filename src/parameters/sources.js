import { MOD_1, MOD_2, MOD_3, HDR_1, HDR_2 } from '../constants';

export default [
    {
        name: HDR_1,
        type: 'hdrTexture',
        path: 'assets/environment/default.hdr',
        default: true,
    },
    {
        name: HDR_2,
        type: 'hdrTexture',
        path: 'assets/environment/graveyard.pathways_2k.hdr',
        default: false,
    },
    {
        name: MOD_1,
        type: 'gltfModel',
        path: 'assets/models/Lampadario.glb',
        default: true,
    },
    {
        name: MOD_2,
        type: 'gltfModel',
        path: 'assets/models/iqos_model.glb',
    },
    {
        name: MOD_3,
        type: 'gltfModel',
        path: 'assets/models/Glass_Holder.glb',
    },
];
