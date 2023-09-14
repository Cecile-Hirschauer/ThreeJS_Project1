import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import dat from "dat.gui/src/dat";

const renderer = new THREE.WebGLRenderer();

// enable shadows
renderer.shadowMap.enabled = true;

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

// Camera positioning
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

// Sets orbit control to move the camera around
const orbit = new OrbitControls(camera, renderer.domElement);

// camera.position.z = 5;
// camera.position.y = 2;
camera.position.set(-10, 30, 30);
orbit.update();

const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00});
const box = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(box);

// Create a plane that receives shadows (but does not cast them)
const planeGeometry = new THREE.PlaneGeometry(30, 30);
const planeMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);
plane.rotation.x = -0.5 * Math.PI;
plane.receiveShadow = true;

// add grid helper
const gridHelper = new THREE.GridHelper(30);
scene.add(gridHelper);

// Sets the x, y, and z axes with each having a length of 4
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// create a sphere
const sphereGeometry = new THREE.SphereGeometry(4, 50, 50);
const sphereMaterial = new THREE.MeshStandardMaterial({
    color: 0x0000ff,
    wireframe: false
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);
sphere.position.set(-10, 10, 0)
sphere.castShadow = true;

// create an ambient light
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const directionLight = new THREE.DirectionalLight(0xffffff, 0.8);
scene.add(directionLight);
directionLight.position.set(-30, 50, 0);
directionLight.castShadow = true;
directionLight.shadow.camera.bottom = -12;

const directionalLightHelper = new THREE.DirectionalLightHelper(directionLight, 5);
scene.add(directionalLightHelper);

const directionalLightShadowsHelper = new THREE.CameraHelper(directionLight.shadow.camera);
scene.add(directionalLightShadowsHelper);

// create a spotlight
const spotlight = new THREE.SpotLight(0xffffff, 0.8);
scene.add(spotlight);
spotlight.position.set(-100, 100, 0);
const spotlightHelper = new THREE.SpotLightHelper(spotlight);
scene.add(spotlightHelper);

// data entry with dat.gui
const gui = new dat.GUI();
const options = {
    sphereColor: '#ffea00',
    wireframe: false,
    speed: 0.01,
};
gui.addColor(options, 'sphereColor').onChange((e) => {
    sphereMaterial.color.set(e);
})

gui.add(options, 'wireframe').onChange((e) => {
    sphere.material.wireframe = e;
});
gui.add(options, 'speed', 0, 0.1);
let stop = 0;

const animate = function (time) {
    box.rotation.x = time / 2000
    box.rotation.y = time / 1000;

    stop += options.speed;
    sphere.position.y = 10 * Math.abs(Math.sin(stop));

    renderer.render(scene, camera);
};

renderer.setAnimationLoop(animate);

renderer.render(scene, camera);