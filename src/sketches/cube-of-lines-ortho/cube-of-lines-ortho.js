import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import noise from '../../glsl-util/perlin/noise4D';
import rotation from '../../glsl-util/shaders/rotate';

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setClearColor(0x121212);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const w = innerWidth;
const h = innerHeight;

let wh = w / h;
let hw = h / w;

const ocamera = new THREE.OrthographicCamera(
  wh * 2,
  -wh * 2,
  hw * 2,
  -hw * 2,
  1,
  7
);
ocamera.position.set(4, 4, 4);
ocamera.lookAt(0, 0, 0);
scene.add(ocamera);

const camera = new THREE.PerspectiveCamera(
  45,
  innerWidth / innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 4);
camera.lookAt(0, 0, 0);

const controls = new OrbitControls(ocamera, renderer.domElement);
controls.update();

// scene.add(new THREE.AxesHelper(0.7));

const vertexShader = `
  #define PI 3.1415926535897932384626433832795

  uniform float uTime;

  attribute float aIsHead;
  attribute float aLength;

  varying float v_noise;

  ${noise}

  ${rotation}
  
  void main() {
    float t = uTime / 10.0;
    
    vec3 pos = position;

    float noiseAmp = noise(pos / 3.0 + t);
    
    pos.y += aIsHead * aLength / 2.0;

    pos -= position;
    mat3 rotationMat = rotation3dZ(PI * sin(noiseAmp));
    
    pos = rotationMat * pos;
    pos += position;

    gl_Position = projectionMatrix * modelMatrix * viewMatrix * vec4(
      pos,
      1.0
    );

    v_noise = noiseAmp;
  }
`;

const fragmentShader = `
  varying float v_noise;

  void main() {
    gl_FragColor = vec4(0.6 + v_noise, 0.3, 0.2, 0.1);
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
const linesLength = 0.1;
const edgesCount = 15;
const edgesWidth = 1;

const positions = new Float32Array(Math.pow(edgesCount, 3) * 6);
const colors = new Float32Array(linesCount * 2 * 3);
const length = new Float32Array(Math.pow(edgesCount, 3) * 2);
const isHead = new Float32Array(Math.pow(edgesCount, 3) * 2);

for (let x = 0; x < edgesCount; x++) {
  const uvX = x / (edgesCount - 1);
  const posX = (uvX * 2.0 - 1.0) * edgesWidth;

  for (let y = 0; y < edgesCount; y++) {
    const uvY = y / (edgesCount - 1);
    const posY = (uvY * 2.0 - 1.0) * edgesWidth;
    for (let z = 0; z < edgesCount; z++) {
      const uvZ = z / (edgesCount - 1);
      const posZ = (uvZ * 2.0 - 1.0) * edgesWidth;

      const i = x * edgesCount * edgesCount + y * edgesCount + z;
      const i6 = i * 6;
      const i2 = i * 2;

      positions[i6] = posX;
      positions[i6 + 1] = posY;
      positions[i6 + 2] = posZ;
      positions[i6 + 3] = posX;
      positions[i6 + 4] = posY;
      positions[i6 + 5] = posZ;

      isHead[i2] = 1;
      isHead[i2 + 1] = -1;

      length[i2] = linesLength;
      length[i2 + 1] = linesLength;
    }
  }
}

const geometry = new THREE.BufferGeometry();

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
geometry.setAttribute('aLength', new THREE.BufferAttribute(length, 1));
geometry.setAttribute('aIsHead', new THREE.BufferAttribute(isHead, 1));

const line = new THREE.LineSegments(geometry, material);

scene.add(line);

const boxGeo = new THREE.BoxGeometry(1, 1, 1);
const edges = new THREE.EdgesGeometry(boxGeo);
const edgesLine = new THREE.LineSegments(
  edges,
  new THREE.LineBasicMaterial({ color: 0xffffff })
);
scene.add(edgesLine);

const sin = Math.sin;
const cos = Math.cos;

let time = 0;
let rotationTime = 0;
const camerarotationMatrix = new THREE.Matrix3();
const camPos = new THREE.Vector3(4, 4, 4);

function render() {
  renderer.render(scene, ocamera);

  edgesLine.rotation.y -= 0.015;

  camPos.set(4, 4, 4);

  camerarotationMatrix.set(
    cos(rotationTime),
    0,
    -sin(rotationTime),
    0,
    1,
    0,
    sin(rotationTime),
    0,
    cos(rotationTime)
  );
  camPos.applyMatrix3(camerarotationMatrix);
  ocamera.position.copy(camPos);
  ocamera.lookAt(0, 0, 0);

  time += 0.05;
  rotationTime += 0.007;

  line.material.uniforms.uTime.value = time;

  requestAnimationFrame(render);
}

render();
