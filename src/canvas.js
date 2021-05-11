import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const canvas = document.getElementById('webgl');

const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
renderer.setPixelRatio(Math.min(2, devicePixelRatio));
renderer.setClearColor(0xdddddd);
renderer.setSize(innerWidth, innerHeight);

const camera = new THREE.PerspectiveCamera(
  45,
  innerWidth / innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 10);
camera.lookAt(0, 0, 0);

new OrbitControls(camera, renderer.domElement);

const scene = new THREE.Scene();

for (let i = 0; i < 100; i++) {
  const width = 3.5;

  const cubeGeo = new THREE.BoxGeometry(width, width, width);
  const cubeMat = new THREE.MeshBasicMaterial({
    color: 0xdddddd,
  });

  const cube = new THREE.Mesh(cubeGeo, cubeMat);

  const edges = new THREE.EdgesGeometry(cubeGeo);
  const line = new THREE.LineSegments(
    edges,
    new THREE.LineBasicMaterial({ color: 0x333333 })
  );

  line.rotation.x = cube.rotation.x = Math.random() * Math.PI;
  line.rotation.y = cube.rotation.y = Math.random() * Math.PI;
  line.rotation.z = cube.rotation.z = Math.random() * Math.PI;

  scene.add(cube);
  scene.add(line);
}

function render() {
  renderer.render(scene, camera);

  requestAnimationFrame(render);
}

render();

window.addEventListener('resize', () => {
  const w = innerWidth;
  const h = innerHeight;

  renderer.setSize(w, h);

  camera.aspect = w / h;
  camera.updateProjectionMatrix();
});
