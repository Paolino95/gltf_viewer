import { experience } from '@/Experience.js';

const canvas = document.querySelector('#container3D');
const container = document.querySelector('#container');
const controlsContainer = document.querySelector('#tweakContainer');

experience.setup({
    canvas,
    container,
    controlsContainer,
    callbacks: {
        onHotspotsUpdated: hotspots => {
            // console.log('hotspots updated', hotspots);

            clearHotspots();
            drawHotspots(hotspots);
        },
    },
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
    const { name, coords, isInFront } = hotspot;

    const hotspotElement = document.createElement('div');

    hotspotElement.dataset.hotspot = name;
    hotspotElement.classList.add('hotspot');

    hotspotElement.style.position = 'absolute';
    hotspotElement.style.left = `${coords.x}px`;
    hotspotElement.style.top = `${coords.y}px`;
    hotspotElement.style.transform = 'translate(-50%, -50%)';
    hotspotElement.style.width = '20px';
    hotspotElement.style.height = '20px';
    hotspotElement.style.backgroundColor = 'orange';
    hotspotElement.style.opacity = isInFront ? 0.75 : 0.15;
    hotspotElement.style.borderRadius = '50%';
    hotspotElement.style.pointerEvents = 'none';

    container.appendChild(hotspotElement);
};
