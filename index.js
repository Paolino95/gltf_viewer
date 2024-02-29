import Experience from './src/Experience.js';
import { createApp } from "vue";
import AnimationButton from './src/components/AnimationButton.vue';

new Experience(
    document.querySelector('#container3D'),
    document.querySelector('#container'),
    document.querySelector('#tweakContainer')
);
