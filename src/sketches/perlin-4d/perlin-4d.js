import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import noise from '../../glsl-util/perlin/noise4D';

const renderer = new THREE.WebGLRenderer({ antialias: true });
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
camera.position.set(0, 0, 2);
camera.lookAt(0, 0, 0);

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

const vertexShader = `
  attribute vec3 color;
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vColor;
  
  ${noise}
  
  void main() {
    vUv = uv;
    vColor = color;
    
    vec3 pos = position;

    float t = uTime * 0.15;
    
    float noiseValue = noise(vec4(pos * 2.0, uTime * 0.15));

    float size = 1.0;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

    gl_PointSize = noiseValue * 15.0 * size;

    vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize *= (1.0 / -modelViewPosition.z);
  }
  `;

const fragmentShader = `
  uniform float uTime;
  varying vec3 vColor;

  void main() {
    float strength = distance(gl_PointCoord, vec2(0.5));
    strength = 1.0 - step(0.5, strength);

    gl_FragColor = vec4(vec3(vColor), strength);
  }
`;

const Geo = new THREE.BufferGeometry();

const pointsCount = 200000;
const positions = new Float32Array(pointsCount * 3);
const colors = new Float32Array(pointsCount * 3);

for (let i = 1; i < pointsCount; i++) {
  const i3 = i * 3;

  const randomX = Math.random();
  const randomY = Math.random();
  const randomZ = Math.random();

  const randomR = Math.random();
  const randomG = Math.random();
  const randomB = Math.random();

  positions[i3] = randomX - 0.5;
  positions[i3 + 1] = randomY - 0.5;
  positions[i3 + 2] = randomZ - 0.5;

  colors[i3] = randomR;
  colors[i3 + 1] = randomG;
  colors[i3 + 2] = randomB;
}

Geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
Geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const Mat = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  side: 2,
  transparent: true,
  uniforms: {
    uTime: { value: 0 },
  },
});

const dots = new THREE.Points(Geo, Mat);

scene.add(dots);

let time = 0;

function render() {
  renderer.render(scene, camera);

  time += 0.05;

  dots.material.uniforms.uTime.value = time;

  requestAnimationFrame(render);
}

render();
