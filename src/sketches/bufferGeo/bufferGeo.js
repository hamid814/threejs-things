import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';

const stats = new Stats();
document.body.appendChild(stats.domElement);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  innerWidth / innerHeight,
  0.1,
  1000
);
camera.position.set(55, 55, 55);
// camera.position.set(0, 3, 3);
camera.lookAt(0, 0, 0);

scene.add(new THREE.AxesHelper());

const cubesCount = 1000;
const cubesVerts = new Float32Array(cubesCount * 72);
const cubesIndex = new Uint16Array(cubesCount * 36);

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

const finalGeo = new THREE.BufferGeometry();
const vec = new THREE.Vector3();

function addCube() {
  const geo = new THREE.BoxGeometry(1, 1, 1);

  for (let i = 0; i < cubesCount; i++) {
    // instead of creating a new geometry, we just clone the bufferGeometry instance
    const geometry = geo.clone();
    geometry.applyMatrix4(
      new THREE.Matrix4().makeTranslation(
        Math.random() * 50,
        Math.random() * 50,
        0
      )
    );
    geometry.rotateX(Math.random() * 1);
    geometry.rotateY(Math.random() * 1);
    for (let j = 0; j < 24; j++) {
      vec.fromBufferAttribute(geometry.attributes.position, j);
      cubesVerts[j * 3 + i * 72] = vec.x;
      cubesVerts[j * 3 + i * 72 + 1] = vec.y;
      cubesVerts[j * 3 + i * 72 + 2] = vec.z;
    }
    for (let k = 0; k < 36; k++) {
      const x = geometry.index.array[k];

      cubesIndex[k + i * 36] = x + i * 24;
    }
  }
  finalGeo.setAttribute('position', new THREE.BufferAttribute(cubesVerts, 3));
  finalGeo.setIndex(new THREE.BufferAttribute(cubesIndex, 1));
  finalGeo.computeVertexNormals();

  const mesh = new THREE.Mesh(finalGeo, new THREE.MeshNormalMaterial());
  scene.add(mesh);
}

addCube();

// scene.add(
//   new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshNormalMaterial())
// );

function render() {
  renderer.render(scene, camera);

  stats.update();

  requestAnimationFrame(render);
}

render();
