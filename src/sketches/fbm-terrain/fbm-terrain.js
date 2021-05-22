import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import vs from './vert.glsl';
import fs from './frag.glsl';
import fs2 from './frag2.glsl';

const canvas = document.getElementById('webgl');

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas,
  preserveDrawingBuffer: true,
});
renderer.setSize(innerWidth, innerHeight);
renderer.setClearColor(0x333333);
renderer.setPixelRatio(Math.min(2, devicePixelRatio));

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  innerWidth / innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 2);
camera.lookAt(0, 0, 0);

new OrbitControls(camera, renderer.domElement);

const planeGeo = new THREE.PlaneBufferGeometry(1, 1, 3000, 3000);
const shaderMat = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
  },
  vertexShader: vs,
  fragmentShader: fs,
  side: 2,
});
// const shaderMat2 = new THREE.ShaderMaterial({
//   uniforms: {
//     uTime: { value: 0 },
//   },
//   vertexShader: vs,
//   fragmentShader: fs2,
//   side: 2,
// });

const plane = new THREE.Mesh(planeGeo, shaderMat);
// const plane2 = new THREE.Mesh(planeGeo, shaderMat2);

plane.rotation.y = Math.PI;

plane.position.x = -0.5;
// plane2.position.x = 0.5;

scene.add(plane);
// scene.add(plane2);

let time = 0;

const render = () => {
  renderer.render(scene, camera);

  plane.material.uniforms.uTime.value = time;
  // plane2.material.uniforms.uTime.value = time;

  time += 0.03;

  // saveAsImage();
  // requestAnimationFrame(render);
};

window.addEventListener('resize', () => {
  const w = innerWidth;
  const h = innerHeight;

  renderer.setSize(w, h);

  camera.aspect = w / h;
  camera.updateProjectionMatrix();
});

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

    saveFile(imgData.replace(strMime, strDownloadMime), 'fmb-terrain.jpg');
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

render();
