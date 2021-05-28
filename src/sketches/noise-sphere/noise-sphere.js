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
document.body.appendChild(renderer.domElement);

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

const light = new THREE.PointLight(0xffffff, 2.2);
light.position.set(0, 30, 40);
scene.add(light);

const light2 = new THREE.PointLight(0xffffff, 2.2);
light2.position.set(30, 30, 0);
scene.add(light2);

const light3 = new THREE.PointLight(0xffffff, 2.2);
light3.position.set(-30, 30, 0);
scene.add(light3);

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

const orbRadius = 30;
const orbDetails = 10;
const orbGeo = new THREE.IcosahedronGeometry(orbRadius, orbDetails);
const orbGhostGeo = new THREE.IcosahedronGeometry(orbRadius, orbDetails);
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

function render() {
  time += 0.0002;

  const col1 = (Math.sin(time * 30) + 1) / 2;
  const col2 = (Math.cos(time * 30) + 1) / 2;
  const col3 = (Math.cos(time * 10) + 1) / 2;
  orb.material.color = new THREE.Color(col1, col2, col3);

  controls.update();
  noisify(orb, time);
  renderer.render(scene, camera);

  requestAnimationFrame(render);
}

render();

renderer.domElement.addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  light.position.x = mouse.x * 25;
  light.position.y = mouse.y * 25;
});

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
