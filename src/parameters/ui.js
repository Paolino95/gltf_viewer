import {
    PP_EFFECT_BLOOM,
    PP_EFFECT_FXAA,
    ENV_BACKGROUND_COLOR,
    ENV_BACKGROUND_TEXTURE,
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
    backgroundColor: 'transparent',
    backgroundBlur: 0.5,
    backgroundIntensity: 1,
    envMapIntensity: 0.6,
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

export const helpersParams = {
    axesHelper: false,
};
