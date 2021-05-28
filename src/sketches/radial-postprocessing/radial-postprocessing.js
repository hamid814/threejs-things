import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import radialVS from './radial.vert.glsl';
import radialFS from './radial.frag.glsl';
import planeVS from './plane.vert.glsl';
import planeFS from './plane.frag.glsl';

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
camera.position.set(0, 0, 2);
camera.lookAt(0, 0, 0);

const planeGeo = new THREE.PlaneGeometry(3.5, 3.5);
const planeMat = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
  },
  vertexShader: planeVS,
  fragmentShader: planeFS,
  side: 2,
});

const plane = new THREE.Mesh(planeGeo, planeMat);

scene.add(plane);

const radialShader = {
  uniforms: {
    tDiffuse: { value: null },
    ratio: { value: innerWidth / innerHeight },
    width: { value: innerWidth },
  },
  vertexShader: radialVS,
  fragmentShader: radialFS,
};

const composer = new EffectComposer(renderer);

const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const radialPass = new ShaderPass(radialShader);
composer.addPass(radialPass);

let time = 15;

function render() {
  composer.render();

  plane.material.uniforms.uTime.value = time;
  time += 0.006;

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

document.body.addEventListener('mousemove', () => {
  time -= 0.01;
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

    saveFile(
      imgData.replace(strMime, strDownloadMime),
      'radial-postprocessing.jpg'
    );
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
