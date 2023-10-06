import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { LifeBoard } from './LifeBoard';

export class World {
    constructor(width, height, debug) {

        this.width = width;
        this.height = height;
        this.debug = debug;

        this.frames = 0;
        this.skipFrame = 10;

        console.log("START WORLD");

        this.makeScene();
        
        this.makeCamera();
        
        this.makeLights();

        if (this.debug) {
            this.makeHelpers();
        }

        this.createBoard();

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        this.animate();

    }

    createBoard() {
        this.lifeBoard = new LifeBoard(this.width, this.height);
        this.lifeBoard.position.set(-this.width * 0.5, 0, -this.height * 0.5);
        this.scene.add(this.lifeBoard);
    }

    makeHelpers() {
        //DirectionalLight Helper
        let directionalLightHelper = new THREE.DirectionalLightHelper(this.directionalLight, 5);
        this.scene.add(directionalLightHelper);
        
        //HemiLight Helper
        let hemiLightHelper = new THREE.HemisphereLightHelper(this.hemiLight, 10);
        this.scene.add(hemiLightHelper);
        
        //Stats
        this.stats = new Stats();
        let container = document.getElementById('app');
        container.appendChild(this.stats.dom);

        //Create a helper for the shadow camera (optional)
        let helper = new THREE.CameraHelper(this.directionalLight.shadow.camera);
        this.scene.add(helper);
    }

    makeLights() {

        //Hemi light
        this.hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1.5);
        this.hemiLight.color.setHSL(0.6, 1, 1);
        this.hemiLight.groundColor.setHSL(0.095, 1, 0.75);
        this.hemiLight.position.set(0, 50, 0);
        this.scene.add(this.hemiLight);

        //Directional
        this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        this.directionalLight.position.set(40, 40, 40);
        this.directionalLight.castShadow = true;

        //Set up shadow properties for the light
        this.directionalLight.shadow.mapSize.width = 2048;  // default
        this.directionalLight.shadow.mapSize.height = 2048; // default
        this.directionalLight.shadow.camera.near = 0.5;    // default

        var d = 100;
        
        this.directionalLight.shadow.camera.left = -d;
        this.directionalLight.shadow.camera.right = d;
        this.directionalLight.shadow.camera.top = d;
        this.directionalLight.shadow.camera.bottom = -d;
        this.directionalLight.shadow.camera.far = 150;


        this.scene.add(this.directionalLight);

    }

    makeCamera() {
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(20, 40, 0);

    }

    makeScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xbfd1e5);

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
    }

    animate() {

        this.controls.update();

        if (this.frames % this.skipFrame == 0) {
            this.lifeBoard.update();
        }

        if (this.debug) {
            this.stats.update();
        }
        this.frames++;

        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.animate.bind(this));
    }

    reset() {

        this.scene.remove(this.lifeBoard);
        this.createBoard();
    }

    changeSpeed(value) {
        this.skipFrame = value;
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}