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
camera.position.set(0, 0, 130);

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

const orbGeo = new THREE.IcosahedronGeometry(30, 1);
// const orbGeo = new THREE.SphereGeometry(30, 32, 32);
// const orbGeo = new THREE.PlaneGeometry(30, 32, 32, 32);
// const orbGeo = new THREE.BoxGeometry(30, 30, 30, 32, 32, 32);
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
