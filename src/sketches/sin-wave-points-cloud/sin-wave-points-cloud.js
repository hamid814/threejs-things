import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

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

const orbRadius = 30;
const orbDetails = 10;
const orbGeo = new THREE.IcosahedronGeometry(orbRadius, orbDetails);
const orbGhostGeo = new THREE.IcosahedronGeometry(orbRadius, orbDetails);

const orbMat = new THREE.PointsMaterial();

const orb = new THREE.Points(orbGeo, orbMat);
const orbGhost = new THREE.Points(orbGhostGeo, orbMat);

scene.add(orb);

new OrbitControls(camera, renderer.domElement);

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
  time += 0.0002;

  const col1 = (Math.sin((time / 10) * 2 * 30) + 1) / 2;
  const col2 = (Math.cos((time / 10) * 2 * 30) + 1) / 2;
  const col3 = (Math.cos((time / 10) * 2 * 10) + 1) / 2;
  orb.material.color = new THREE.Color(col1, col2, col3);

  noisify(orb, time);

  renderer.render(scene, camera);

  requestAnimationFrame(render);
}

render();
