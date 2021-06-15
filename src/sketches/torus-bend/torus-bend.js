import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import vs from './vert.glsl';
import noiseVS from './noise.vert.glsl';
import fs from './frag.glsl';

const canvas = document.getElementById('webgl');

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas,
  preserveDrawingBuffer: true,
});
renderer.setSize(innerWidth, innerHeight);
renderer.setClearColor(0xcc4433);
renderer.setPixelRatio(Math.min(2, devicePixelRatio));

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  innerWidth / innerHeight,
  0.1,
  1000
);
camera.position.set(0, 3, 3);
camera.lookAt(0, 0, 0);

// scene.add(new THREE.AxesHelper());

new OrbitControls(camera, renderer.domElement);

let p = 1024;
let q = 100;
let radius = 1;
let innerRadius = 0.4;

const torusGeo = new THREE.BufferGeometry();
const torusMat = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    totalP: { value: p },
  },
  // vertexShader: /* glsl */ `
  //   attribute vec3 aCenter;

  //   varying vec2 vUv;
  //   varying vec3 vCenter;

  //   void main() {
  //     vUv = uv;
  //     vCenter = aCenter;

  //     gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
  //   }
  // `,
  vertexShader: noiseVS,
  fragmentShader: fs,
  side: 2,
});

// create the geometry
const positionBuffer = new Float32Array(p * q * 3 * 2 * 3);
const centerBuffer = new Float32Array(p * q * 3 * 2 * 3);
const uvBuffer = new Float32Array(p * q * 2 * 2 * 3);
const positionBA = new THREE.BufferAttribute(positionBuffer, 3);
const centerBA = new THREE.BufferAttribute(centerBuffer, 3);
const uvBA = new THREE.BufferAttribute(uvBuffer, 2);

const sin = Math.sin;
const cos = Math.cos;

function createMatrix(a) {
  const mat = new THREE.Matrix3();

  mat.set(cos(a), -sin(a), 0, sin(a), cos(a), 0, 0, 0, 1);

  return mat;
}

for (let i = 0; i < p; i++) {
  const nextI = i === p - 1 ? 0 : i + 1;
  const iPhase = (Math.PI * 2) / p;

  const ix = cos(i * iPhase);
  const iy = sin(i * iPhase);

  for (let j = 0; j < q; j++) {
    const nextJ = j === q - 1 ? 0 : j + 1;
    const jPhase = (Math.PI * 2) / q;

    let angle, rotationMatrix, jx, jy, jz;

    // calc current point
    angle = i * iPhase;
    rotationMatrix = createMatrix(angle);

    jx = cos(j * jPhase) * innerRadius + radius;
    jy = -0.002;
    jz = sin(j * jPhase) * innerRadius;

    const currentPoint = new THREE.Vector3(jx, jy, jz);
    currentPoint.applyMatrix3(rotationMatrix);

    // calc next poitn in this ring
    angle = i * iPhase;
    rotationMatrix = createMatrix(angle);

    jx = cos(nextJ * jPhase) * innerRadius + radius;
    jy = -0.002;
    jz = sin(nextJ * jPhase) * innerRadius;

    const nextPointInRing = new THREE.Vector3(jx, jy, jz);
    nextPointInRing.applyMatrix3(rotationMatrix);

    // calc this point in next ring
    angle = nextI * iPhase;
    rotationMatrix = createMatrix(angle);

    jx = cos(j * jPhase) * innerRadius + radius;
    jy = 0.002;
    jz = sin(j * jPhase) * innerRadius;

    const nextRingParallelPoint = new THREE.Vector3(jx, jy, jz);
    nextRingParallelPoint.applyMatrix3(rotationMatrix);

    // calc next point in next ring
    angle = nextI * iPhase;
    rotationMatrix = createMatrix(angle);

    jx = cos(nextJ * jPhase) * innerRadius + radius;
    jy = 0.002;
    jz = sin(nextJ * jPhase) * innerRadius;

    const nextRingNextPoint = new THREE.Vector3(jx, jy, jz);
    nextRingNextPoint.applyMatrix3(rotationMatrix);

    // calc inedxes and fill the pisotion
    const index = (j + i * q) * 6;

    positionBA.setXYZ(index, currentPoint.x, currentPoint.y, currentPoint.z);
    positionBA.setXYZ(
      index + 1,
      nextPointInRing.x,
      nextPointInRing.y,
      nextPointInRing.z
    );
    positionBA.setXYZ(
      index + 2,
      nextRingParallelPoint.x,
      nextRingParallelPoint.y,
      nextRingParallelPoint.z
    );
    positionBA.setXYZ(
      index + 3,
      nextPointInRing.x,
      nextPointInRing.y,
      nextPointInRing.z
    );
    positionBA.setXYZ(
      index + 4,
      nextRingParallelPoint.x,
      nextRingParallelPoint.y,
      nextRingParallelPoint.z
    );
    positionBA.setXYZ(
      index + 5,
      nextRingNextPoint.x,
      nextRingNextPoint.y,
      nextRingNextPoint.z
    );

    centerBA.setXYZ(index, ix, iy, 0);
    centerBA.setXYZ(index + 1, ix, iy, 0);
    centerBA.setXYZ(index + 2, ix, iy, 0);
    centerBA.setXYZ(index + 3, ix, iy, 0);
    centerBA.setXYZ(index + 4, ix, iy, 0);
    centerBA.setXYZ(index + 5, ix, iy, 0);

    uvBA.setXY(index, i / (p - 1), j / (q - 1));
    uvBA.setXY(index + 1, i / (p - 1), j / (q - 1));
    uvBA.setXY(index + 2, i / (p - 1), j / (q - 1));
    uvBA.setXY(index + 3, i / (p - 1), j / (q - 1));
    uvBA.setXY(index + 4, i / (p - 1), j / (q - 1));
    uvBA.setXY(index + 5, i / (p - 1), j / (q - 1));
  }
}

torusGeo.setAttribute('position', positionBA);
torusGeo.setAttribute('aCenter', centerBA);
torusGeo.setAttribute('uv', uvBA);

console.log(torusGeo.attributes);

const torus = new THREE.Mesh(torusGeo, torusMat);

torus.rotation.x = Math.PI * 0.5;

// scene.add(torus);

const testTorusGeo = new THREE.TorusGeometry(1, 0.5, 100, 100);

const testTorus = new THREE.Mesh(testTorusGeo, torusMat);

testTorus.rotation.x = Math.PI * 0.5;

scene.add(testTorus);

let time = 0;

const render = () => {
  renderer.render(scene, camera);

  torus.material.uniforms.uTime.value = time;

  time += 0.003;

  // torus.rotateZ(0.05);

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

    saveFile(imgData.replace(strMime, strDownloadMime), 'torus-bend.jpg');
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
