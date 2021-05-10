import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const canvas = document.getElementById('webgl');

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