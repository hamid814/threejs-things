import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import noise from '../../glsl-util/perlin/noise4D';
import rotation from '../../glsl-util/shaders/rotate';

const canvas = document.getElementById('webgl');

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas,
  preserveDrawingBuffer: true,
});
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(2, devicePixelRatio));
renderer.setClearColor(0x121212);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  innerWidth / innerHeight,
  0.1,
  1000
);
camera.position.set(0, 3, 4);
camera.lookAt(0, 0, 0);

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

// scene.add(new THREE.AxesHelper(0.7));

const vertexShader = `
  #define PI 3.1415926535897932384626433832795

  uniform float uTime;

  attribute float a_IsHead;
  attribute float a_Length;
  attribute vec3 a_Origin;
  attribute vec3 a_End;
  attribute vec3 a_Random;
  
  ${noise}
  
  ${rotation}
  
  void main() {
    vec3 direction = a_Origin - a_End;
    direction = normalize(direction);
    
    vec3 randomDirection = direction + a_Random * 0.2;
    
    float t = uTime / 0.5;
    
    vec3 pos = position;
    
    float noiseAmp = noise(pos / 3.0 + t);
    
    pos +=  randomDirection * a_IsHead * a_Length / 2.0;
    
    pos -= position;
    pos = rotate(pos, direction, noiseAmp * 3.0);
    pos += position;
    
    
    gl_Position = projectionMatrix * modelMatrix * viewMatrix * vec4(
      pos,
      1.0
      );
    }
    `;

const fragmentShader = `
    void main() {
      gl_FragColor = vec4(1.0, 0.3, 0.2, 1.0);
  }
`;

const material = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
  },
  vertexShader,
  fragmentShader,
});

const point1 = new THREE.Vector3();
const point2 = new THREE.Vector3();

const linesPerUnit = 3;
const lineLength = 0.4;

const initialPoints = [
  {
    x: -2,
    y: 1,
    z: 1,
  },
  {
    x: -2,
    y: 1,
    z: -1,
  },
  {
    x: -1,
    y: 1,
    z: 1,
  },
  {
    x: -1,
    y: 1,
    z: -1,
  },
  {
    x: 0,
    y: 1,
    z: 1,
  },
  {
    x: 0,
    y: 1,
    z: -1,
  },
  {
    x: 2,
    y: 1,
    z: 1,
  },
  {
    x: 2,
    y: 1,
    z: -1,
  },
  {
    x: 1,
    y: 1,
    z: 1,
  },
  {
    x: 1,
    y: 1,
    z: -1,
  },
  {
    x: 1,
    y: 1,
    z: -1,
  },
  {
    x: -1,
    y: 1,
    z: -1,
  },
  {
    x: -1,
    y: 1,
    z: -1,
  },
  {
    x: -1,
    y: -1,
    z: -1,
  },
  {
    x: -1,
    y: -1,
    z: -1,
  },
  {
    x: -1,
    y: -1,
    z: 1,
  },
  {
    x: -1,
    y: -1,
    z: 1,
  },
  {
    x: 1,
    y: -1,
    z: 1,
  },
  {
    x: 1,
    y: -1,
    z: 1,
  },
  {
    x: 1,
    y: 1,
    z: 1,
  },
];

const diffusedPoints = [];

for (let i = 0; i < initialPoints.length / 2; i++) {
  const i2 = i * 2;

  const point1XYZ = initialPoints[i2];
  const point2XYZ = initialPoints[i2 + 1];

  point1.set(point1XYZ.x, point1XYZ.y, point1XYZ.z);
  point2.set(point2XYZ.x, point2XYZ.y, point2XYZ.z);

  const distance = point1.distanceTo(point2);

  const linesNum = Math.floor(distance * linesPerUnit);

  for (let j = 0; j < linesNum; j++) {
    const point = new THREE.Vector3();

    point
      .subVectors(point2, point1)
      .normalize()
      .multiplyScalar(Math.random())
      // .multiplyScalar((i + 1) / distance)
      .multiplyScalar(distance)
      .add(point1);

    const origin = new THREE.Vector3().copy(point1);
    const end = new THREE.Vector3().copy(point2);

    point.origin = origin;
    point.end = end;

    diffusedPoints.push(point);
  }
}

// ------------------------------------
// DRAW DIFFUSED POINTS
const pMaterial = new THREE.PointsMaterial({ size: 0.1 });
const pGeometry = new THREE.BufferGeometry();

const array = new Float32Array(diffusedPoints.length * 3);

const ba = new THREE.BufferAttribute(array, 3);

diffusedPoints.forEach((point, i) => {
  ba.setXYZ(i, point.x, point.y, point.z);
});

pGeometry.setAttribute('position', ba);

// scene.add(new THREE.Points(pGeometry, pMaterial));

// ------------------------------------

// ------------------------------------
// DRAW INITIAL POINTS
const initialMaterial = new THREE.PointsMaterial({ size: 0.05, color: 'red' });
const initialGeometry = new THREE.BufferGeometry();

const initialArray = new Float32Array(initialPoints.length * 3);

const initialBA = new THREE.BufferAttribute(initialArray, 3);

initialPoints.forEach((point, i) => {
  initialBA.setXYZ(i, point.x, point.y, point.z);
});

initialGeometry.setAttribute('position', initialBA);

// scene.add(new THREE.Points(initialGeometry, initialMaterial));

// ------------------------------------

const pointsArray = new Float32Array(diffusedPoints.length * 2 * 3);
const pointsLengthArray = new Float32Array(diffusedPoints.length * 2);
const pointsIsHeadArray = new Float32Array(diffusedPoints.length * 2);
const pointsOriginArray = new Float32Array(diffusedPoints.length * 2 * 3);
const pointsEndArray = new Float32Array(diffusedPoints.length * 2 * 3);
const pointsRandomArray = new Float32Array(diffusedPoints.length * 2 * 3);

const pointsBA = new THREE.BufferAttribute(pointsArray, 3);
const pointsLengthBA = new THREE.BufferAttribute(pointsLengthArray, 1);
const pointsIsHeadBA = new THREE.BufferAttribute(pointsIsHeadArray, 1);
const pointsOriginBA = new THREE.BufferAttribute(pointsOriginArray, 3);
const pointsEndBA = new THREE.BufferAttribute(pointsEndArray, 3);
const pointsRandomBA = new THREE.BufferAttribute(pointsRandomArray, 3);

diffusedPoints.forEach((point, i) => {
  const i2 = i * 2;

  pointsBA.setXYZ(i2, point.x, point.y, point.z);
  pointsBA.setXYZ(i2 + 1, point.x, point.y, point.z);

  pointsOriginBA.setXYZ(i2, point.origin.x, point.origin.y, point.origin.z);
  pointsOriginBA.setXYZ(i2 + 1, point.origin.x, point.origin.y, point.origin.z);
  pointsEndBA.setXYZ(i2, point.end.x, point.end.y, point.end.z);
  pointsEndBA.setXYZ(i2 + 1, point.end.x, point.end.y, point.end.z);

  const randomX = Math.random();
  const randomY = Math.random();
  const randomZ = Math.random();

  pointsRandomBA.setXYZ(i2, randomX, randomY, randomZ);
  pointsRandomBA.setXYZ(i2 + 1, randomX, randomY, randomZ);

  pointsLengthBA.setX(i2, lineLength);
  pointsLengthBA.setX(i2 + 1, lineLength);

  pointsIsHeadBA.setX(i2, 1);
  pointsIsHeadBA.setX(i2 + 1, -1);
});

const geometry = new THREE.BufferGeometry();

geometry.setAttribute('position', pointsBA);
geometry.setAttribute('a_Length', pointsLengthBA);
geometry.setAttribute('a_IsHead', pointsIsHeadBA);
geometry.setAttribute('a_Origin', pointsOriginBA);
geometry.setAttribute('a_End', pointsEndBA);
geometry.setAttribute('a_Random', pointsRandomBA);

const line = new THREE.LineSegments(geometry, material);

scene.add(line);

const boxGeo = new THREE.BoxGeometry(2, 3, 0.3);
const edges = new THREE.EdgesGeometry(boxGeo);
const edgesLine = new THREE.LineSegments(
  edges,
  new THREE.LineBasicMaterial({ color: 0xffffff })
);
// scene.add(edgesLine);

let time = 0;

function render() {
  renderer.render(scene, camera);

  time += 0.005;

  line.material.uniforms.uTime.value = time;

  requestAnimationFrame(render);
}

render();

console.log(renderer.info.render.lines - 12);

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
