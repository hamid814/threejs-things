import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';

const canvas = document.getElementById('webgl');

const stats = new Stats();
document.body.appendChild(stats.domElement);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas,
  preserveDrawingBuffer: true,
});
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

function render() {
  renderer.render(scene, camera);

  stats.update();

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

// screenshot
document.addEventListener('keydown', (e) => {
  if (e.key === 'p') {
    saveAsImage();
  }
});
var strDownloadMime = 'image/octet-stream';
function saveAsImage() {
  try {
    var strMime = 'image/jpeg';
    var imgData = renderer.domElement.toDataURL(strMime);

    var scripts = document.getElementsByTagName('script');
    var lastScript = scripts[scripts.length - 1];
    var scriptName = new URL(lastScript.src).pathname.slice(1, -3);

    saveFile(imgData.replace(strMime, strDownloadMime), scriptName + '.jpg');
  } catch (e) {
    console.log(e);
    return;
  }
}
var saveFile = function (strData, filename) {
  var link = document.createElement('a');
  if (typeof link.download === 'string') {
    document.body.appendChild(link); //Firefox requires the link to be in the body
    link.download = filename;
    link.href = strData;
    link.click();
    document.body.removeChild(link); //remove the link when done
  } else {
    location.replace(uri);
  }
};