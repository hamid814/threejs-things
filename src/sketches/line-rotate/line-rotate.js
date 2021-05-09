import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import noise from '../../glsl-util/perlin/noise4D';
import rotation from '../../glsl-util/shaders/rotate';

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setClearColor(0x333333);
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
  #define PI 3.1415926535897932384626433832795

  uniform float uTime;

  attribute vec3 color;
  attribute vec3 length;
  attribute float isHead;
  // attribute vec3 empty;

  varying vec3 vColor;
  varying vec3 vLength;
  
  ${noise}

  ${rotation}
  
  void main() {
    float t = uTime / 10.0;
    
    vec3 pos = position;
    
    float noiseAmp = noise(pos + t);
    
    pos.x = length.x / 2.0;
    pos.x *= isHead;

    mat3 rotationMat = rotation3dZ(PI * sin(noiseAmp));
    
    pos = rotationMat * pos;

    
    gl_Position = projectionMatrix * modelMatrix * viewMatrix * vec4(
      pos,
      1.0);

    vColor = color;
    vLength = length;
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  varying vec3 vLength;

  void main() {
    gl_FragColor = vec4(vColor, 1.0);
  }
`;

const material = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
  },
  vertexShader,
  fragmentShader,
});

const linesCount = 1;

const positions = new Float32Array(linesCount * 2 * 3);
const colors = new Float32Array(linesCount * 2 * 3);

const length = new Float32Array(linesCount * 2 * 3);
const isHead = new Float32Array(linesCount * 2);

for (let i = 0; i < linesCount; i++) {
  const i6 = i * 6;
  const i2 = i * 2;

  length[i6] = 1;
  length[i6 + 1] = 1;
  length[i6 + 2] = 1;
  length[i6 + 3] = 1;
  length[i6 + 4] = 1;
  length[i6 + 5] = 1;

  colors[i6] = 1.0;
  colors[i6 + 1] = 0.2;
  colors[i6 + 2] = 0.0;
  colors[i6 + 3] = 0.0;
  colors[i6 + 4] = 0.5;
  colors[i6 + 5] = 1.0;

  isHead[i2] = 1;
  isHead[i2 + 1] = -1;
}

const geometry = new THREE.BufferGeometry();

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
geometry.setAttribute('length', new THREE.BufferAttribute(length, 3));
geometry.setAttribute('isHead', new THREE.BufferAttribute(isHead, 1));

const line = new THREE.LineSegments(geometry, material);

scene.add(line);

const boxGeo = new THREE.BoxGeometry(1, 1, 1);
const edges = new THREE.EdgesGeometry(boxGeo);
const edgesLine = new THREE.LineSegments(
  edges,
  new THREE.LineBasicMaterial({ color: 0xffffff })
);
scene.add(edgesLine);

let time = 0;

function render() {
  renderer.render(scene, camera);

  time += 0.05;

  line.material.uniforms.uTime.value = time;

  requestAnimationFrame(render);
}

render();

console.log('gl lines:', renderer.info.render.lines);
