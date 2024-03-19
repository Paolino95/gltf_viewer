import { experience } from '@/Experience.js';

const canvas = document.querySelector('#container3D');
const container = document.querySelector('#container');
const controlsContainer = document.querySelector('#tweakContainer');

experience.setup({
    canvas,
    container,
    controlsContainer,
    options: {
        assetsBaseUrl: 'assets',
        useDracoCompression: true,
        dracoDecoderPath: '../libs/draco/gltf/',
    },
    callbacks: {
        onHotspotsUpdated: hotspots => {
            clearHotspots();
            drawHotspots(hotspots);
        },
        onSceneReady: async () => {
            console.log('Scene Ready');
        },
        onResetCamera: isCameraReset => {
            console.log('isCameraReset', isCameraReset);
        },
        onAnimationChange: animationDataEvent => {
            console.log('animationDataEvent', animationDataEvent);
        },
    },
    events: {},
});

window.experience = experience;

const clearHotspots = () => {
    const hotspots = container.querySelectorAll('.hotspot');

    hotspots.forEach(hotspot => {
        container.removeChild(hotspot);
    });
};

const drawHotspots = hotspots => {
    hotspots.forEach(hotspot => drawHotspot(hotspot));
};

const drawHotspot = hotspot => {
    const { id, coords, isInFront, userData } = hotspot;
    const { color = 'orange', size = '20px' } = userData;

    const hotspotElement = document.createElement('div');

    hotspotElement.dataset.hotspot = id;
    hotspotElement.classList.add('hotspot');

    hotspotElement.style.position = 'absolute';
    hotspotElement.style.left = `${coords.x}px`;
    hotspotElement.style.top = `${coords.y}px`;
    hotspotElement.style.transform = 'translate(-50%, -50%)';
    hotspotElement.style.width = size;
    hotspotElement.style.height = size;
    hotspotElement.style.backgroundColor = color;
    hotspotElement.style.opacity = isInFront ? 0.75 : 0.15;
    hotspotElement.style.borderRadius = '50%';
    hotspotElement.style.pointerEvents = 'none';

    container.appendChild(hotspotElement);
};
