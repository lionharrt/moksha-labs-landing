import * as THREE from "three/webgpu";

import { SkyMesh } from "three/addons/objects/SkyMesh.js";

let container;
let camera, scene, renderer, sun;

init();

function init() {
  container = document.getElementById("container");

  //

  renderer = new THREE.WebGPURenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setAnimationLoop(render);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.5;
  container.appendChild(renderer.domElement);

  //

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    55,
    window.innerWidth / window.innerHeight,
    1,
    20000
  );
  camera.position.set(30, 30, 100);

  //

  sun = new THREE.Vector3();

  // Skybox

  const sky = new SkyMesh();
  sky.scale.setScalar(10000);
  scene.add(sky);

  sky.turbidity.value = 10;
  sky.rayleigh.value = 2;
  sky.mieCoefficient.value = 0.005;
  sky.mieDirectionalG.value = 0.8;
  //

  sun.position.set(0, 0, 100);
  scene.add(sun);
}

function render() {
  renderer.render(scene, camera);
}
