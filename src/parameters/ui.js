import {
    PP_EFFECT_BLOOM,
    PP_EFFECT_FXAA,
    ENV_BACKGROUND_COLOR,
    ENV_BACKGROUND_TEXTURE,
    MOD_1,
    MOD_2,
    MOD_3,
    MOD_4,
    HDR_1,
    HDR_2,
} from '@/constants';

export const postProcessingEffects = {
    bloomParams: {
        id: PP_EFFECT_BLOOM,
        text: 'Bloom',
        parametersTitle: 'Bloom Parameters',
        active: false,
        parameters: {
            threshold: {
                value: 1.0,
                min: 0.0,
                max: 1.0,
                step: 0.1,
            },
            strength: {
                value: 0.15,
                min: 0.0,
                max: 3.0,
                step: 0.1,
            },
            radius: {
                value: 0.0,
                min: 0.0,
                max: 1.0,
                step: 0.1,
            },
        },
    },
    fxaaParams: {
        id: PP_EFFECT_FXAA,
        text: 'FXAA',
        active: false,
    },
};

export const toneMappingParams = {
    exposure: 1,
};

export const sceneParams = {
    backgroundColor: 'rgb(255, 255, 255)',
    backgroundBlur: 0.5,
    backgroundIntensity: 1,
    envMapIntensity: 1,
};

export const backgroundOptionsList = {
    color: {
        id: ENV_BACKGROUND_COLOR,
        text: 'Color',
    },
    texture: {
        id: ENV_BACKGROUND_TEXTURE,
        text: 'Texture',
    },
};

export const modelList = {
    Fiat: {
        id: MOD_1,
        text: 'Fiat 500',
    },
    iqos: {
        id: MOD_2,
        text: 'Iqos',
    },
    glass: {
        id: MOD_3,
        text: 'Glass',
    },
    lampadario: {
        id: MOD_4,
        text: 'Lampadario',
    },
};

export const hdrList = {
    default: {
        id: HDR_1,
        text: 'Default',
    },
    graveyard: {
        id: HDR_2,
        text: 'Graveyard',
    },
};

export const helpersParams = {
    axesHelper: false,
};
