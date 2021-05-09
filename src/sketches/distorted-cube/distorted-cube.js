import * as THREE from 'three';
import SimplexNoise from 'simplex-noise';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const noise = new SimplexNoise();

const mouse = new THREE.Vector2();

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  innerWidth / innerHeight,
  0.1,
  1000
);
camera.position.set(0, 60, 130);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setClearColor(0x222222);
document.body.appendChild(renderer.domElement);

const light = new THREE.PointLight(0x00ffff, 2.2);
light.position.set(0, 30, 40);
scene.add(light);

const light2 = new THREE.PointLight(0xff00ff, 2.2);
light2.position.set(30, 30, 0);
scene.add(light2);

const light3 = new THREE.PointLight(0xffff00, 2.2);
light3.position.set(-30, 30, 0);
scene.add(light3);

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

const orbGeo = new THREE.BoxGeometry(60, 60, 60, 20, 20, 20);
const orbGhostGeo = new THREE.BoxGeometry(60, 60, 60, 10, 10, 10);
const orbMat = new THREE.MeshStandardMaterial({
  color: new THREE.Color(0.8, 0.65, 0.65),
  roughness: 0.3,
  metalness: 0.8,
  flatShading: true,
});
const orb = new THREE.Mesh(orbGeo, orbMat);
const orbGhost = new THREE.Mesh(orbGhostGeo, orbMat);

const gridHelper = new THREE.GridHelper(200, 5);
scene.add(gridHelper);

scene.add(orb);

let time = 0;

function noisify(mesh, time) {
  const position = orbGhost.geometry.attributes.position;
  const vector = new THREE.Vector3();

  for (let i = 0; i < position.count; i++) {
    vector.fromBufferAttribute(position, i);
    const amp = 1;
    const distance =
      ((noise.noise3D(
        vector.x / 20 + time * 7,
        vector.y / 20 + time * 8,
        vector.z / 20 + time * 9
      ) +
        1) /
        2) *
        0.4 +
      0.9;
    vector.multiplyScalar(distance * amp);
    mesh.geometry.attributes.position.setXYZ(i, vector.x, vector.y, vector.z);
  }

  mesh.geometry.attributes.position.needsUpdate = true;
}

noisify(orb, time);

function render() {
  time += 0.0002;

  const col1 = (Math.sin(time * 30) + 1) / 2;
  const col2 = (Math.cos(time * 30) + 1) / 2;
  const col3 = (Math.cos(time * 10) + 1) / 2;
  orb.material.color = new THREE.Color(col1, col2, col3);

  controls.update();
  renderer.render(scene, camera);
  orb.rotation.y += 0.005;

  requestAnimationFrame(render);
}

render();

renderer.domElement.addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  light.position.x = mouse.x * 25;
  light.position.y = mouse.y * 25;
});
