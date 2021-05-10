import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const canvas = document.getElementById('webgl');

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas,
  preserveDrawingBuffer: true,
});
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  innerWidth / innerHeight,
  0.1,
  1000
);
camera.lookAt(0, 0, 0);
camera.position.set(0, 0, 5);

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

const pyramidGeo = new THREE.BufferGeometry();
const pyramidPositions = new Float32Array(36);

const dot1 = {
  x: 0,
  y: 1,
  z: 0,
};
// const dot2 = {
//   x: Math.sqrt(2 / 9) * -1,
//   y: Math.sqrt(2 / 3) * -1,
//   z: -1 / 3,
// };
// const dot3 = {
//   x: Math.sqrt(2 / 9) * -1,
//   y: Math.sqrt(2 / 3),
//   z: 1 / 3,
// };
// const dot4 = {
//   x: Math.sqrt(8 / 9),
//   y: 0,
//   z: -1 / 3,
// };
const dot2 = {
  x: 0,
  y: -0.3338068592,
  z: -0.9426414911,
};
const dot3 = {
  x: 0.7698002133,
  y: -0.3338068592,
  z: 0.5440410025,
};
const dot4 = {
  x: -0.7698002133,
  y: -0.3338068592,
  z: 0.5440410025,
};

pyramidPositions[0] = dot1.x;
pyramidPositions[1] = dot1.y;
pyramidPositions[2] = dot1.z;
pyramidPositions[3] = dot2.x;
pyramidPositions[4] = dot2.y;
pyramidPositions[5] = dot2.z;

pyramidPositions[6] = dot1.x;
pyramidPositions[7] = dot1.y;
pyramidPositions[8] = dot1.z;
pyramidPositions[9] = dot3.x;
pyramidPositions[10] = dot3.y;
pyramidPositions[11] = dot3.z;

pyramidPositions[12] = dot1.x;
pyramidPositions[13] = dot1.y;
pyramidPositions[14] = dot1.z;
pyramidPositions[15] = dot4.x;
pyramidPositions[16] = dot4.y;
pyramidPositions[17] = dot4.z;

pyramidPositions[18] = dot2.x;
pyramidPositions[19] = dot2.y;
pyramidPositions[20] = dot2.z;
pyramidPositions[21] = dot3.x;
pyramidPositions[22] = dot3.y;
pyramidPositions[23] = dot3.z;

pyramidPositions[24] = dot2.x;
pyramidPositions[25] = dot2.y;
pyramidPositions[26] = dot2.z;
pyramidPositions[27] = dot4.x;
pyramidPositions[28] = dot4.y;
pyramidPositions[29] = dot4.z;

pyramidPositions[30] = dot3.x;
pyramidPositions[31] = dot3.y;
pyramidPositions[32] = dot3.z;
pyramidPositions[33] = dot4.x;
pyramidPositions[34] = dot4.y;
pyramidPositions[35] = dot4.z;

pyramidGeo.setAttribute(
  'position',
  new THREE.BufferAttribute(pyramidPositions, 3)
);

// scene.add(
//   new THREE.Mesh(
//     new THREE.SphereGeometry(1, 32, 32),
//     new THREE.MeshBasicMaterial({ wireframe: true, color: 'red' })
//   )
// );

// scene.add(new THREE.AxesHelper(3));

const mat = new THREE.MeshBasicMaterial({
  wireframe: true,
  color: 'pink',
});
const mat1 = new THREE.LineBasicMaterial({
  // color: 'red',
});
const mat2 = new THREE.LineBasicMaterial({
  // color: 'green',
});
const mat3 = new THREE.LineBasicMaterial({
  // color: 'blue',
});
const mat4 = new THREE.LineBasicMaterial({
  // color: 'yellow',
});
const mat5 = new THREE.LineBasicMaterial({
  // color: 'white',
});

const PI2 = Math.PI * 2;

// mesh 1
const mesh1 = new THREE.LineSegments(pyramidGeo, mat1);

mesh1.rotation.y = PI2 * 0;
mesh1.rotation.x = 0.65;
mesh1.rotation.z = 0.65;

scene.add(mesh1);

// mesh 2
const mesh2 = new THREE.LineSegments(pyramidGeo, mat2);

mesh2.rotation.y = PI2 * 0.2;
mesh2.rotation.x = 0.65;
mesh2.rotation.z = 0.65;

scene.add(mesh2);

// mesh 3
const mesh3 = new THREE.LineSegments(pyramidGeo, mat3);

mesh3.rotation.y = PI2 * 0.4;
mesh3.rotation.x = 0.65;
mesh3.rotation.z = 0.65;

scene.add(mesh3);

// mesh 4
const mesh4 = new THREE.LineSegments(pyramidGeo, mat4);

mesh4.rotation.y = PI2 * 0.6;
mesh4.rotation.x = 0.65;
mesh4.rotation.z = 0.65;

scene.add(mesh4);

// mesh 5
const mesh5 = new THREE.LineSegments(pyramidGeo, mat5);

mesh5.rotation.y = PI2 * 0.8;
mesh5.rotation.x = 0.65;
mesh5.rotation.z = 0.65;

scene.add(mesh5);

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
