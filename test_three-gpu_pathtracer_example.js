import * as THREE from 'three';
import { FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
    PathTracingRenderer,
    PhysicalPathTracingMaterial,
    PhysicalCamera,
    PathTracingSceneGenerator,
} from 'three-gpu-pathtracer';

import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

let renderer, controls, pathTracer, blitQuad, camera, scene, samplesEl;

let tiles = 2;
let resolutionScale = Math.max(1 / window.devicePixelRatio, 0.5);

// adjust performance parameters for mobile
const aspectRatio = window.innerWidth / window.innerHeight;
if (aspectRatio < 0.65) {
    resolutionScale = 1 / window.devicePixelRatio;
    tiles = 3;
}

init();

async function init() {
    samplesEl = document.getElementById('samples');

    // init renderer, camera, controls, scene
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.toneMapping = THREE.LinearToneMapping;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0, 0);
    document.body.appendChild(renderer.domElement);

    camera = new PhysicalCamera(75, 1, 0.025, 500);
    camera.position.set(0, 0, 1);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.update();

    scene = new THREE.Scene();
    scene.backgroundBlurriness = 0.05;

    // init path tracer
    pathTracer = new PathTracingRenderer(renderer);
    pathTracer.material = new PhysicalPathTracingMaterial();
    pathTracer.material.filterGlossyFactor = 0.5;
    pathTracer.material.backgroundBlur = 0.05;
    pathTracer.tiles.set(tiles, tiles);
    pathTracer.camera = camera;

    blitQuad = new FullScreenQuad(
        new THREE.MeshBasicMaterial({
            map: pathTracer.target.texture,
            blending: THREE.CustomBlending,
        })
    );

    controls.addEventListener('change', () => {
        pathTracer.reset();
    });

    // load the envmap and model
    const envMapPromise = new RGBELoader()
        .setDataType(THREE.FloatType)
        .loadAsync('/assets/environment/default.hdr')
        .then(texture => {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            scene.background = texture;
            scene.environment = texture;
            pathTracer.material.envMapInfo.updateFrom(texture);
        });

    const generator = new PathTracingSceneGenerator();

    const gltfLoader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('draco/');
    gltfLoader.setDRACOLoader(dracoLoader);

    const gltfPromise = gltfLoader
        .loadAsync('/assets/models/Glass_Holder.glb')
        .then(gltf => {
            return generator.generate(gltf.scene);
        })
        .then(result => {
            // recenterModel(result.scene);
            console.log({ result });
            scene.add(result.scene);

            const { bvh, textures, materials } = result;
            const geometry = bvh.geometry;
            const material = pathTracer.material;

            material.bvh.updateFrom(bvh);
            material.attributesArray.updateFrom(
                geometry.attributes.normal,
                geometry.attributes.tangent,
                geometry.attributes.uv,
                geometry.attributes.color
            );
            material.materialIndexAttribute.updateFrom(
                geometry.attributes.materialIndex
            );
            material.textures.setTextures(renderer, 2048, 2048, textures);
            material.materials.updateFrom(materials, textures);

            // generator.dispose();
        });

    // wait for the scene to be rady
    await Promise.all([gltfPromise, envMapPromise]);

    // document.getElementById( 'loading' ).remove();
    window.addEventListener('resize', onResize);

    onResize();
    animate();
}

function onResize() {
    // update rendering resolution
    const w = window.innerWidth;
    const h = window.innerHeight;
    const scale = resolutionScale;
    const dpr = window.devicePixelRatio;

    pathTracer.setSize(w * scale * dpr, h * scale * dpr);
    pathTracer.reset();

    renderer.setSize(w, h);
    renderer.setPixelRatio(window.devicePixelRatio * scale);

    const aspect = w / h;
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
}

function animate() {
    requestAnimationFrame(animate);

    camera.updateMatrixWorld();
    pathTracer.update();

    if (pathTracer.samples < 1) {
        renderer.render(scene, camera);
    }

    renderer.autoClear = false;
    blitQuad.material.map = pathTracer.target.texture;
    blitQuad.render(renderer);
    renderer.autoClear = true;

    samplesEl.innerText = `Samples: ${Math.floor(pathTracer.samples)}`;
}

function recenterModel(modelScene) {
    const modelBox = new THREE.Box3().setFromObject(modelScene);
    const boxCenter = modelBox.getCenter(new THREE.Vector3());

    modelScene.position.x += modelScene.position.x - boxCenter.x;
    modelScene.position.y += modelScene.position.y - boxCenter.y;
    modelScene.position.z += modelScene.position.z - boxCenter.z;
}
