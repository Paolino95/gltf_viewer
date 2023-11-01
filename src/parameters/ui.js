import { PP_EFFECT_BLOOM, PP_EFFECT_FXAA } from '@/constants';

export const postProcessingEffects = {
    bloomParams: {
        id: PP_EFFECT_BLOOM,
        title: 'Bloom',
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
        title: 'FXAA',
        active: false,
    },
};

export const toneMappingParams = {
    exposure: 1,
};

export const sceneParams = {
    backgroundBlur: 0.5,
    backgroundIntensity: 1,
    envMapIntensity: 1,
};

export const helpersParams = {
    axesHelper: true,
};
