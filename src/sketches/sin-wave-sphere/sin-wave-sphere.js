import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';

const positions = {
  x: 0,
  y: 0,
  z: 0,
  rotationX: 0,
  rotationY: 0,
  rotationZ: 0,
  volumeX: 1,
  volumeY: 1,
  volumeZ: 1,
  camX: 0,
  camY: 60,
  camZ: 130,
  lookX: 0,
  lookY: 0,
  lookZ: 0,
  orbitSpeed: 0.002,
  timeSpeed: 0.0002,
  p: 1,
  noiseFactor: 1,
};

const mouse = new THREE.Vector2(1, 1);
const raycaster = new THREE.Raycaster();

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  innerWidth / innerHeight,
  0.1,
  1000
);
camera.position.set(0, 60, 130);
camera.up.set(0, 100, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

const stats = new Stats();
// document.body.appendChild(stats.domElement);

const orbField = new THREE.Object3D();

const orbRadius = 30;
const orbDetails = 32;
const orbGeo = new THREE.IcosahedronGeometry(orbRadius, orbDetails);
const orbGhostGeo = new THREE.IcosahedronGeometry(orbRadius, orbDetails);

const orbMat = new THREE.MeshStandardMaterial({
  color: new THREE.Color(1, 0.9, 0.2),
  roughness: 0.25,
  metalness: 0.8,
  flatShading: true,
});

const orb = new THREE.Mesh(orbGeo, orbMat);
const orbGhost = new THREE.Mesh(orbGhostGeo, orbMat);

const light = new THREE.PointLight(0xffffff, 2.2);
light.position.set(0, 30, 40);
orbField.add(light);

const light2 = new THREE.PointLight(0xffffff, 1.7);
light2.position.set(60, 30, 0);
orbField.add(light2);

const light3 = new THREE.PointLight(0xffffff, 1.7);
light3.position.set(-60, 30, 0);
orbField.add(light3);

orbField.add(orb);

scene.add(orbField);

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

const gridHelper = new THREE.GridHelper(200, 5);
scene.add(gridHelper);

let time = 0;

function noisify(mesh, time) {
  const position = orbGhost.geometry.attributes.position;
  const vector = new THREE.Vector3();

  for (let i = 0; i < position.count; i++) {
    vector.fromBufferAttribute(position, i);
    const amp = orb.geometry.type === 'IcosahedronGeometry' ? 1 : 3;

    const xSin = Math.sin(vector.x / 10) * 10;
    let distance = Math.sin((vector.y + xSin + time * 1000) / 2 + 1) / 2;
    distance = (distance + 1) / 5 + 0.8;

    vector.multiplyScalar(distance * amp);

    mesh.geometry.attributes.position.setXYZ(i, vector.x, vector.y, vector.z);
  }

  mesh.geometry.attributes.position.needsUpdate = true;
}

function render() {
  stats.update();

  time += positions.timeSpeed;

  const col1 = (Math.sin(time * 2 * 30) + 1) / 2;
  const col2 = (Math.cos(time * 2 * 30) + 1) / 2;
  const col3 = (Math.cos(time * 2 * 10) + 1) / 2;
  orb.material.color = new THREE.Color(col1, col2, col3);

  orb.material.wireframe = false;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);
  intersects.forEach((object) => {
    if (object.object.geometry.type === 'IcosahedronGeometry') {
      object.object.material.wireframe = true;
    }
  });

  noisify(orb, time);

  renderer.render(scene, camera);

  requestAnimationFrame(render);
}

render();

renderer.domElement.addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  light.position.x = mouse.x * 25;
  light.position.y = (mouse.y + 5) * 8;
});
