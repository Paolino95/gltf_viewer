export const postProcessingEffects = {
    bloomParams: {
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
};

export const toneMappingParams = {
    exposure: 1,
};

export const hdrList = {
    hdri_lampadario_13: 'hdri_lampadario_13.hdr',
    hdri_lampadario_05: 'hdri_lampadario_05.hdr',
};

export const sceneParams = {
    backgroundBlur: 0.5,
    backgroundIntensity: 1,
    envMapIntensity: 1,
    bloom: true,
    hdr: Object.values(hdrList)[0],
};
