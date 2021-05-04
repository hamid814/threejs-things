import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import vertexShader from './shaders/orb.vert.glsl';
import fragmentShader from './shaders/orb.frag.glsl';

const canvas = document.getElementById('webgl');

const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
renderer.setSize(innerWidth, innerHeight);
renderer.setClearColor(0xffffff);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  innerWidth / innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 5);
camera.lookAt(0, 0, 0);

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

const orbGeo = new THREE.IcosahedronGeometry(1.6, 32, 16);
const orbMat = new THREE.ShaderMaterial({
  uniforms: {
    time: { value: 0 },
  },
  vertexShader,
  fragmentShader,
});

const orb = new THREE.Mesh(orbGeo, orbMat);
scene.add(orb);

window.addEventListener('resize', () => {
  renderer.setSize(innerWidth, innerHeight);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
});

let time = 0;

function render() {
  renderer.render(scene, camera);

  orb.material.uniforms.time.value = time;
  time += 0.001;

  requestAnimationFrame(render);
}

render();
