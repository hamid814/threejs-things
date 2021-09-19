import gsap from 'gsap';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import Stats from 'three/examples/jsm/libs/stats.module';
import vs from './vert.glsl';
// import fs from './frag.glsl';
import fullFrag from './full-test';
import finalFrag from './final.frag.glsl';
import fullGLSL from './full.glsl';
import speedrun from './speedrun.glsl';

let pass;

const values = {
  // boxSize: new THREE.Vector3(1.5, 0.3, 0.3),
  boxSize: new THREE.Vector3(1.5, 1.5, 1),
};

setTimeout(() => {
  gsap.to(pass.uniforms.mirrorRadius, {
    duration: 1,
    value: 1,
    ease: 'power4',
  });
}, 2000);

const canvas = document.getElementById('webgl');

const renderer = new THREE.WebGLRenderer({
  antialias: false,
  canvas,
  preserveDrawingBuffer: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.prepend(renderer.domElement);

const stats = Stats();
document.body.appendChild(stats.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  20,
  innerWidth / innerHeight,
  0.1,
  10
);
camera.position.set(0, 0, 4);
camera.lookAt(0, 0, 0);

new OrbitControls(camera, renderer.domElement);

const loader = new THREE.TextureLoader();
const cubeLoader = new THREE.CubeTextureLoader();

// const url = '../../../textures/text/awesome.jpg';
const url = '../../../textures/text/awesome.jpg';
const urls = [url, url, url, url, url, url];

// const img = loader.load(url, (t) => {
//   pass.uniforms.bg.value = t;
//   render();
// });
const img = cubeLoader.load(urls, (t) => {
  pass.uniforms.bg.value = t;
  render();
});

const composer = new EffectComposer(renderer);

pass = new ShaderPass({
  uniforms: {
    uTime: { value: 0 },
    resolution: { value: { x: innerWidth, y: innerHeight } },
    camPos: { value: camera.position },
    worldToCamera: { value: camera.matrixWorld },
    boxSize: { value: values.boxSize },
    LCD: { value: 0.02 },
    mirrorRadius: { value: 0 },
    bg: { value: img },
  },
  vertexShader: vs,
  // fragmentShader: finalFrag,
  // fragmentShader: fullFrag,
  fragmentShader: fullGLSL,
  // fragmentShader: speedrun,
});

composer.addPass(pass);

let time = 0;
let num = 0;

function render() {
  stats.update();

  composer.render();
  // renderer.render(scene, camera);

  time += 0.025;

  pass.uniforms.uTime.value = time;
  pass.uniforms.camPos.value = camera.position;
  pass.uniforms.worldToCamera.value = camera.matrixWorld;
  pass.uniforms.LCD.value = 0.02;
  pass.uniforms.boxSize.value = values.boxSize;

  requestAnimationFrame(render);

  // saveAsImage();
  // if (time < Math.PI * 2) {
  //   setTimeout(() => {
  //     render();
  //   }, 500);
  // }
  num++;
}

// render();

setTimeout(() => {
  const tl = gsap.timeline();

  tl.to(values.boxSize, {
    duration: 1,
    y: 1.5,
    ease: 'power4',
  });

  tl.to(values.boxSize, {
    duration: 0.5,
    z: 1.0,
    ease: 'power4',
  });
}, 500);

window.addEventListener('resize', function () {
  renderer.setSize(window.innerWidth, window.innerHeight);
  pass.uniforms.resolution.value = { x: innerWidth, y: innerHeight };
});

// save image
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
      `glass${String(num)}.jpg`
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
