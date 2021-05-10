import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import noise from '../../glsl-util/perlin/noise4D';

const canvas = document.getElementById('webgl');

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas,
  preserveDrawingBuffer: true,
});
renderer.setSize(innerWidth, innerHeight);
renderer.setClearColor(0xaaaaaa);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  innerWidth / innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 4);
camera.lookAt(0, 0, 0);

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

const vertexShader = `
  uniform float uTime;

  attribute vec3 color;
  attribute vec3 test;

  varying vec3 vColor;
  varying vec3 vTest;
  
  ${noise}
  
  void main() {
    float t = uTime / 10.0;
    
    float posAmp = noise(test + t);
    
    vec3 pos = position * 2.0 - 1.0;

    pos *= posAmp + 1.0;
    
    gl_Position = projectionMatrix * modelMatrix * viewMatrix * vec4(
      pos,
      1.0);

    vColor = color;
    vTest = test;
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  varying vec3 vTest;

  void main() {
    gl_FragColor = vec4(vTest, 1.0);
  }
`;

const material = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
  },
  vertexShader,
  fragmentShader,
});

const linesCount = 3000;

const positions = new Float32Array(linesCount * 2 * 3);
const test = new Float32Array(linesCount * 2 * 3);

for (let i = 0; i < linesCount; i++) {
  const i6 = i * 6;

  const r1 = Math.random();
  const r2 = Math.random();
  const r3 = Math.random();
  const r4 = Math.random();
  const r5 = Math.random();
  const r6 = Math.random();

  positions[i6] = r1;
  positions[i6 + 1] = r2;
  positions[i6 + 2] = r3;
  positions[i6 + 3] = r4;
  positions[i6 + 4] = r5;
  positions[i6 + 5] = r6;

  const testColorR = Math.random();
  const testColorG = Math.random();
  const testColorB = Math.random();

  test[i6] = testColorR;
  test[i6 + 1] = testColorG;
  test[i6 + 2] = testColorB;
  test[i6 + 3] = testColorR;
  test[i6 + 4] = testColorG;
  test[i6 + 5] = testColorB;
}

const geometry = new THREE.BufferGeometry();

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('test', new THREE.BufferAttribute(test, 3));

console.log(geometry.attributes);

const line = new THREE.LineSegments(geometry, material);

scene.add(line);

let time = 0;

function render() {
  renderer.render(scene, camera);

  time += 0.05;

  line.material.uniforms.uTime.value = time;

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
