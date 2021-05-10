import * as THREE from 'three';
import SimplexNoise from 'simplex-noise';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const canvas = document.getElementById('webgl');

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas,
  preserveDrawingBuffer: true,
});
renderer.setSize(innerWidth, innerHeight);
renderer.setClearColor(0x222222);
document.body.appendChild(renderer.domElement);

const noise = new SimplexNoise();

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  innerWidth / innerHeight,
  0.1,
  1000
);
camera.position.set(0, 60, 130);
camera.up.set(0, 100, 0);

const orbField = new THREE.Object3D();

const orbRadius = 30;
const orbDetails = 16;
const orbGeo = new THREE.IcosahedronGeometry(orbRadius, orbDetails);
const orbGhostGeo = new THREE.IcosahedronGeometry(orbRadius, orbDetails);

const orbMat = new THREE.PointsMaterial();

const orb = new THREE.Points(orbGeo, orbMat);
const orbGhost = new THREE.Points(orbGhostGeo, orbMat);

orbField.add(orb);

scene.add(orbField);

new OrbitControls(camera, renderer.domElement);

const gridHelper = new THREE.GridHelper(200, 5);
scene.add(gridHelper);

let time = 0;

function noisify(mesh, time) {
  const position = orbGhost.geometry.attributes.position;
  const vector = new THREE.Vector3();

  for (let i = 0; i < position.count; i++) {
    vector.fromBufferAttribute(position, i);

    const noiseValue = noise.noise3D(
      vector.x / 20 + time * 7,
      vector.y / 20 + time * 8,
      vector.z / 20 + time * 9
    );

    let distance = (noiseValue + 7) / 7;

    vector.multiplyScalar(distance);

    mesh.geometry.attributes.position.setXYZ(i, vector.x, vector.y, vector.z);
  }

  mesh.geometry.attributes.position.needsUpdate = true;
}

function render() {
  time += 0.001;

  const col1 = (Math.sin((time / 10) * 2 * 30) + 1) / 2;
  const col2 = (Math.cos((time / 10) * 2 * 30) + 1) / 2;
  const col3 = (Math.cos((time / 10) * 2 * 10) + 1) / 2;
  orb.material.color = new THREE.Color(col1, col2, col3);

  noisify(orb, time);

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
