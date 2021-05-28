import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import vs from './vert.glsl';
import fs from './frag.glsl';

const canvas = document.getElementById('webgl');

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas,
  preserveDrawingBuffer: true,
});
renderer.setSize(innerWidth, innerHeight);
renderer.setClearColor(0xeeeeee);
renderer.setPixelRatio(Math.min(2, devicePixelRatio));

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  innerWidth / innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 5);
camera.lookAt(0, 0, 0);

const light = new THREE.PointLight();
light.position.set(5, 5, 5);
scene.add(light);

const light2 = new THREE.PointLight();
light2.position.set(-5, -5, -5);
scene.add(light2);

new OrbitControls(camera, renderer.domElement);

const orbGeo = new THREE.IcosahedronGeometry(1, 2);
const shaderMat = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
  },
  vertexShader: vs,
  fragmentShader: fs,
  // wireframe: true,
});
const phongMat = new THREE.MeshPhongMaterial({
  color: 0xcc3344,
  flatShading: true,
  side: 0,
});

phongMat.onBeforeCompile = (shader) => {
  const replacement = /* glsl */ `
    gl_FragColor = vec4(outgoingLight.g, outgoingLight.g, outgoingLight.g, 1.0);
  `;

  // shader.fragmentShader = shader.fragmentShader.replace(
  //   'gl_FragColor = vec4( outgoingLight, diffuseColor.a );',
  //   replacement
  // );
};

const orb = new THREE.Mesh(orbGeo, shaderMat);

scene.add(orb);

let time = 0;

const render = () => {
  renderer.render(scene, camera);

  time += 0.003;

  // orb.rotation.y += 0.01;

  requestAnimationFrame(render);
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

render();
