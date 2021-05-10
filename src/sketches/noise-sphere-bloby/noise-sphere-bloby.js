import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import SimplexNoise from 'simplex-noise';
import gsap from 'gsap';

import './style/style.css';

const options = {
  timeSpeed: 0.0002,
  noiseFactor: 60,
  isAnimating: false,
};

const canvas = document.getElementById('webgl');

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas,
  preserveDrawingBuffer: true,
});
renderer.setSize(innerWidth, innerHeight);
renderer.setClearColor(0x121212);
document.body.appendChild(renderer.domElement);

const noise = new SimplexNoise();

const mouse = new THREE.Vector2(1, 1);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  innerWidth / innerHeight,
  0.1,
  1000
);
camera.position.set(0, 60, 130);
camera.lookAt(0, 0, 0);
camera.up.set(0, 100, 0);

new OrbitControls(camera, renderer.domElement);

const orbRadius = 30;
const orbDetails = 10;
const orbGeo = new THREE.IcosahedronGeometry(orbRadius, orbDetails);
const orbGhostGeo = new THREE.IcosahedronGeometry(orbRadius, orbDetails);
const orbMat = new THREE.MeshStandardMaterial({
  color: new THREE.Color(0.4, 0.3, 0.2),
  roughness: 0.25,
  metalness: 0.8,
  flatShading: true,
});
const orb = new THREE.Mesh(orbGeo, orbMat);
const orbGhost = new THREE.Mesh(orbGhostGeo, orbMat);

const light = new THREE.PointLight(0xffffff, 2.2);
light.position.set(0, 30, 40);
scene.add(light);

const light2 = new THREE.PointLight(0xffffff, 1.7);
light2.position.set(30, 30, 0);
scene.add(light2);

const light3 = new THREE.PointLight(0xffffff, 1.7);
light3.position.set(-30, 30, 0);
scene.add(light3);

scene.add(orb);

const gridHelper = new THREE.GridHelper(200, 5);
scene.add(gridHelper);

function noisify(mesh, time) {
  const position = orbGhost.geometry.attributes.position;
  const vector = new THREE.Vector3();

  for (let i = 0; i < position.count; i++) {
    vector.fromBufferAttribute(position, i);
    const amp = 2;
    const distance =
      ((noise.noise3D(
        vector.x / options.noiseFactor + time * 7,
        vector.y / options.noiseFactor + time * 8,
        vector.z / options.noiseFactor + time * 9
      ) +
        1) /
        2) *
        0.8 +
      0.0;
    vector.multiplyScalar(distance * amp);
    mesh.geometry.attributes.position.setXYZ(i, vector.x, vector.y, vector.z);
  }

  mesh.geometry.attributes.position.needsUpdate = true;
}

let time = 0;

function render() {
  time += options.timeSpeed;

  noisify(orb, time);

  renderer.render(scene, camera);

  requestAnimationFrame(render);
}

render();

function animateOrb() {
  const timeline = gsap.timeline({ paused: true });

  timeline.to(options, {
    duration: 2.5,
    timeSpeed: 0.004,
    ease: 'Power3.easeInOut',
  });
  timeline.to(options, {
    duration: 1,
    timeSpeed: 0.0002,
    ease: 'Power3.easeOut',
  });
  timeline.to(options, { duration: 0, isAnimating: false });

  if (!options.isAnimating) {
    timeline.play();
    options.isAnimating = true;
  }
}

document.body.addEventListener('click', animateOrb);

renderer.domElement.addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  light.position.x = mouse.x * 25;
  light.position.y = (mouse.y + 5) * 8;
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
