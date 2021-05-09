import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(
  45,
  innerWidth / innerHeight,
  0.1,
  1000
);

camera.position.set(0, 0, 3);
camera.lookAt(0, 0, 0);

// scene.add(new THREE.AxesHelper());

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

const cube = new THREE.Object3D();

for (let i = 1; i <= 10; i++) {
  const p = new THREE.Group();
  p.position.y = i;
  const g = new THREE.GridHelper();
  p.add(g);
  cube.add(p);
}
for (let i = 1; i <= 11; i++) {
  const p = new THREE.Group();
  p.position.x = i - 6;
  p.position.y = 5;
  p.rotation.z = Math.PI * 0.5;
  const g = new THREE.GridHelper();
  p.add(g);
  cube.add(p);
}
for (let i = 1; i <= 11; i++) {
  const p = new THREE.Group();
  p.position.z = i - 6;
  p.position.y = 5;
  p.rotation.x = Math.PI * 0.5;
  const g = new THREE.GridHelper();
  p.add(g);
  cube.add(p);
}

scene.add(cube);

let time = 0;

function render() {
  time += 0.012;
  renderer.render(scene, camera);

  cube.position.y = (Math.sin(time) + 1) * 2 * 2 - 9.5;
  cube.rotation.y += 0.01;
  cube.rotation.x += 0.01;
  cube.rotation.z += 0.01;

  requestAnimationFrame(render);
}

render();
