import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import vs from './vert.glsl';
// import fs from './frag.glsl';
import fs from './my-frag.glsl';
import fullFrag from './full-test';
import finalFrag from './final.frag.glsl';
import testFrag from './test.frag.glsl';
import vectorFrag from './vector.frag.glsl';

let pass;

const canvas = document.getElementById('webgl');

const renderer = new THREE.WebGLRenderer({
  antialias: false,
  canvas,
  preserveDrawingBuffer: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.prepend(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  20,
  innerWidth / innerHeight,
  0.1,
  10
);
camera.position.set(0, 0, 4.5);
camera.lookAt(0, 0, 0);

new OrbitControls(camera, renderer.domElement);

const loader = new THREE.CubeTextureLoader();

const url = '../../../textures/pearl/pearl.jpg';
const urls = [url, url, url, url, url, url];

const img = loader.load(urls, (t) => {
  pass.uniforms.bg.value = t;
  console.log(t);
  render();
});

const composer = new EffectComposer(renderer);

pass = new ShaderPass({
  uniforms: {
    uTime: { value: 0 },
    resolution: { value: { x: innerWidth, y: innerHeight } },
    camPos: { value: camera.position },
    worldToCamera: { value: camera.matrixWorld },
    bg: { value: img },
  },
  vertexShader: vs,
  fragmentShader: finalFrag,
  // fragmentShader: testFrag,
  // fragmentShader: fs,
  // fragmentShader: fullFrag,
  // fragmentShader: vectorFrag,
});

composer.addPass(pass);

let time = 0;

function render() {
  composer.render();
  // renderer.render(scene, camera);

  time += 0.03;

  pass.uniforms.uTime.value = time;
  pass.uniforms.camPos.value = camera.position;
  pass.uniforms.worldToCamera.value = camera.matrixWorld;

  requestAnimationFrame(render);
}

// render();

window.addEventListener('resize', function () {
  renderer.setSize(window.innerWidth, window.innerHeight);
  pass.uniforms.resolution.value = { x: innerWidth, y: innerHeight };
});
