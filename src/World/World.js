import Experience from '@/Experience.js';
import Environment from './Environment.js';
import Model from './Model.js';
import { Mesh, PlaneGeometry, ShadowMaterial, DirectionalLight } from 'three';

export default class World {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;

        // Wait for resources
        this.resources.on('ready', () => {
            // Setup
            this.model = new Model();
            this.environment = new Environment();
        });

        this.addGenericFloor();
        this.addGenericLight();
    }

    addGenericFloor() {
        const floorGeometry = new PlaneGeometry(100, 100);
        const floorMaterial = new ShadowMaterial();
        floorMaterial.opacity = 0.3;
        const floor = new Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI/2;
        floor.position.set(0,-1.4,0);
        floor.receiveShadow = true;
        this.scene.add(floor);
    }

    addGenericLight() {
        const light = new DirectionalLight(0xffffff, 3);
        light.position.set(10,20,10);
        light.lookAt(0,0,0);
        light.castShadow = true;
        light.shadow.mapSize.width = 1024;
        light.shadow.mapSize.height = 1024;
        light.shadow.radius = 50;
        light.shadow.blurSamples = 50;
        light.shadow.bias = -0.00001;
        this.scene.add(light);

        // const light2 = new PointLight(0xffffff, 10);
        // light2.position.set(10,20,1);
        // light2.castShadow = true;
        // light2.shadow.mapSize.width = 2048;
        // light2.shadow.mapSize.height = 2048;
        // light2.shadow.radius = 100;
        // light2.shadow.blurSamples = 25;
        // this.scene.add(light2);
    }

    update() {
        if (this.model) this.model.update();
    }
}
