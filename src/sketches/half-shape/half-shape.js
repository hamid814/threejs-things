import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  innerWidth / innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 130);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

// const orbGeo = new THREE.IcosahedronGeometry(30, 1);
// const orbGeo = new THREE.SphereGeometry(30, 32, 32);
// const orbGeo = new THREE.PlaneGeometry(30, 32, 32, 32);
const orbGeo = new THREE.BoxGeometry(30, 30, 30, 32, 32, 32);
const orbMat = new THREE.MeshBasicMaterial({
  color: 0x66cc99,
  wireframe: true,
});

const orb = new THREE.Mesh(orbGeo, orbMat);

scene.add(orb);

let time = 0;
const drawRangeMax = orb.geometry.attributes.position.count;

function render() {
  time += 0.0011;

  controls.update();
  renderer.render(scene, camera);
  orb.geometry.drawRange.count = Math.floor(
    ((Math.sin(time) + 1) / 2) * drawRangeMax
  );

  requestAnimationFrame(render);
}

render();
