import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const mouse = new THREE.Vector2(1, 1);

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
renderer.setClearColor(0xdddddd);

const orbField = new THREE.Object3D();

const orbRadius = 30;
const orbDetails = 10;
const orbGeo = new THREE.IcosahedronGeometry(orbRadius, orbDetails);
const orbGhostGeo = new THREE.IcosahedronGeometry(orbRadius, orbDetails);

const orbMat = new THREE.MeshNormalMaterial({
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
    const amp = orb.geometry.type === 'IcosahedronGeometry' ? 2 : 3;

    const xSin = Math.sin(vector.x / 10) * 10;
    let distance = Math.floor(
      Math.sin((vector.y / 2 + xSin + time * 1000) / 2 + 1) / 2
    );

    if (distance !== 0) distance = -0.6;

    distance = (distance + 1) / 2;
    vector.multiplyScalar(distance * amp);

    mesh.geometry.attributes.position.setXYZ(i, vector.x, vector.y, vector.z);
  }

  mesh.geometry.attributes.position.needsUpdate = true;
}

function render() {
  time += 0.00012;

  orb.material.wireframe = false;

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
