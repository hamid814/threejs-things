import * as THREE from 'three';
import noise from '../../glsl-util/perlin/noise4D';

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(2, devicePixelRatio));
renderer.setClearColor(0xcccccc);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  innerWidth / innerHeight,
  0.1,
  1000
);
camera.lookAt(0, 0, 0);
camera.position.set(0, 0, 5);

const vertexShader = `
  uniform float uTime;

  varying vec2 vUv;

  ${noise}
  
  void main() {
    float noiseValue = noise(vec3(uv.x * 5.0, uv.y * 5.0, uTime));
    
    noiseValue = sin(noiseValue * 50.0);

    noiseValue = step(noiseValue, -0.1);

    vec3 pos = position;

    pos.z = noiseValue;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

    vUv.x = noiseValue;
  }
  `;

const fragmentShader = `
  uniform float uTime;

  varying vec2 vUv;
  
  float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
  }
  
  void main() {
    float max = -0.35;
    float min = 0.45;
    
    float r = map(vUv.x, min, max, 1.0, 0.4);
    float b = map(vUv.x, min, max, 0.0, 0.2);
    
    vec3 color = vec3(r, 0.6, b);
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

const planeGeo = new THREE.PlaneGeometry(3.5, 3.5, 500, 500);
const planeMat = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
  },
  vertexShader,
  fragmentShader,
  side: 2,
});

const plane = new THREE.Mesh(planeGeo, planeMat);

plane.rotation.y = Math.PI;

scene.add(plane);

let time = 0;

const render = () => {
  renderer.render(scene, camera);

  plane.material.uniforms.uTime.value = time;

  time += 0.003;

  requestAnimationFrame(render);
};

render();

document.addEventListener('mousemove', (e) => {
  const x = (e.clientX - innerWidth / 2) / (innerWidth / 2);
  const y = (e.clientY - innerHeight / 2) / (innerHeight / 2);

  plane.rotation.y = Math.PI + x / 5;
  plane.rotation.x = y / 5;
});
