import * as THREE from 'three';
import SimplexNoise from 'simplex-noise';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass';
import { DotScreenPass } from 'three/examples/jsm/postprocessing/DotScreenPass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass';
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader';
import { PixelShader } from 'three/examples/jsm/shaders/PixelShader';
import gsap from 'gsap';

import './style/style.css';

let animating = true;

const positions = {
  rotationX: 0,
  rotationY: 0,
  rotationZ: 0,
  volumeX: 1,
  volumeY: 1,
  volumeZ: 1,
  camX: 0,
  camY: 60,
  camZ: 130,
  lookX: 0,
  lookY: 0,
  lookZ: 0,
  orbitSpeed: 0.002,
  timeSpeed: 0.0002,
  noiseFactor: 60,
};

const canvas = document.getElementById('webgl');

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas,
  preserveDrawingBuffer: true,
});
renderer.setSize(innerWidth, innerHeight);
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

const orbField = new THREE.Object3D();

const orbRadius = 30;
const orbDetails = 10;
const orbGeo = new THREE.IcosahedronGeometry(orbRadius, orbDetails);
const orbGhostGeo = new THREE.IcosahedronGeometry(orbRadius, orbDetails);
// const orbGeo = new THREE.BoxGeometry(60, 60, 60, 20, 20, 20);
// const orbGhostGeo = new THREE.BoxGeometry(60, 60, 60, 5, 5, 5);
const orbMat = new THREE.MeshStandardMaterial({
  color: new THREE.Color(1, 0.9, 0.2),
  roughness: 0.25,
  metalness: 0.8,
  flatShading: true,
  wireframe: false,
});
const orb = new THREE.Mesh(orbGeo, orbMat);
const orbGhost = new THREE.Mesh(orbGhostGeo, orbMat);

const light = new THREE.PointLight(0xffffff, 2.2);
light.position.set(0, 30, 40);
orbField.add(light);

const lightHepler = new THREE.PointLightHelper(light, 5);
// scene.add(lightHepler);

const light2 = new THREE.PointLight(0xffffff, 1.7);
light2.position.set(30, 30, 0);
orbField.add(light2);

const lightHepler2 = new THREE.PointLightHelper(light2, 5);
scene.add(lightHepler2);

const light3 = new THREE.PointLight(0xffffff, 1.7);
light3.position.set(-30, 30, 0);
orbField.add(light3);

const lightHepler3 = new THREE.PointLightHelper(light3, 5);
scene.add(lightHepler3);

orbField.add(orb);

scene.add(orbField);

const gridHelper = new THREE.GridHelper(200, 5);
scene.add(gridHelper);

const composer = new EffectComposer(renderer);

const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const filmPass = new FilmPass();
filmPass.enabled = true;
// composer.addPass(filmPass);

const glitchPass = new GlitchPass();
glitchPass.enabled = true;
// composer.addPass(glitchPass);

const dotScreenPass = new DotScreenPass(new THREE.Vector2(), 1, 5);
dotScreenPass.enabled = true;
// composer.addPass(dotScreenPass);

// console.log(RGBShiftShader.uniforms.amount);
// RGBShiftShader.uniforms.amount.value = -0.3;

const RGBShiftPass = new ShaderPass(RGBShiftShader);
RGBShiftPass.enabled = true;
composer.addPass(RGBShiftPass);

const pixelPass = new ShaderPass(PixelShader);
// pixelPass.enabled = true;
pixelPass.uniforms['resolution'].value = new THREE.Vector2(
  window.innerWidth,
  window.innerHeight
);
pixelPass.uniforms['resolution'].value.multiplyScalar(window.devicePixelRatio);
pixelPass.uniforms['pixelSize'].value = 1;
// composer.addPass(pixelPass);

function noisify(mesh, time) {
  const position = orbGhost.geometry.attributes.position;
  const vector = new THREE.Vector3();

  for (let i = 0; i < position.count; i++) {
    vector.fromBufferAttribute(position, i);
    const amp = 2;
    const distance =
      ((noise.noise3D(
        vector.x / positions.noiseFactor + time * 7,
        vector.y / positions.noiseFactor + time * 8,
        vector.z / positions.noiseFactor + time * 9
      ) +
        1) /
        2) *
        0.8 +
      0.0;
    vector.multiplyScalar(distance * amp);
    vector.multiply({
      x: positions.volumeX,
      y: positions.volumeY,
      z: positions.volumeZ,
    });
    mesh.geometry.attributes.position.setXYZ(i, vector.x, vector.y, vector.z);
  }

  mesh.geometry.attributes.position.needsUpdate = true;
}

let time = 0;

function render() {
  if (animating) time += positions.timeSpeed;

  // rgb shift shader uniform change
  const RGBShiftValue =
    parseInt(((Math.sin(window.performance.now() * 0.0005) + 1) / 2) * 10) / 30;
  RGBShiftPass.uniforms.amount.value = RGBShiftValue;

  noisify(orb, time);

  // renderer.render(scene, camera);
  composer.render();

  requestAnimationFrame(render);
}

render();

function animateOrb() {
  const timeline = gsap.timeline({ paused: true });

  timeline.to(positions, {
    duration: 5,
    orbitSpeed: 0.05,
    timeSpeed: 0.003,
    noiseFactor: 10,
    ease: 'Power3.easeInOut',
  });
  timeline.to(positions, {
    duration: 1,
    orbitSpeed: 0.002,
    timeSpeed: 0.0002,
    noiseFactor: 60,
    ease: 'Power3.easeOut',
  });
  timeline.to(positions, { duration: 0, isOrbitAnimating: false });

  if (!positions.isOrbitAnimating) {
    timeline.play();
    positions.isOrbitAnimating = true;
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
