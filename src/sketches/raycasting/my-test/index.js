import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import vs from './vert.glsl';
// import fs from './frag.glsl';
import fs from './my-frag.glsl';
import fullFrag from './full.glsl';
import finalFrag from './final.frag.glsl';
import testFrag from './test.frag.glsl';

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
camera.position.set(0, 0, 6);
camera.lookAt(0, 0, 0);

// scene.add(new THREE.AxesHelper());

new OrbitControls(camera, renderer.domElement);

const composer = new EffectComposer(renderer);

const pass = new ShaderPass({
  uniforms: {
    uTime: { value: 0 },
    resolution: { value: { x: innerWidth, y: innerHeight } },
    camPos: { value: camera.position },
  },
  vertexShader: vs,
  // fragmentShader: finalFrag,
  fragmentShader: testFrag,
  // fragmentShader: fs,
  // fragmentShader: fullFrag,
});

composer.addPass(pass);

let time = 0;

function render() {
  composer.render();
  // renderer.render(scene, camera);

  time += 0.03;

  pass.uniforms.uTime.value = time;
  pass.uniforms.camPos.value = camera.position;

  requestAnimationFrame(render);
}

render();

window.addEventListener('resize', function () {
  renderer.setSize(window.innerWidth, window.innerHeight);
  pass.uniforms.resolution.value = { x: innerWidth, y: innerHeight };
});
