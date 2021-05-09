import * as THREE from 'three';
import noise from '../../glsl-util/perlin/noise4D';

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(2, devicePixelRatio));
renderer.setClearColor(0xbbbbbb);
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
  varying vec2 vUv;

  
  void main() {
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

    vUv = uv;
  }
  `;

const fragmentShader = `
  uniform float uTime;

  varying vec2 vUv;
  
  ${noise}
  
  void main() {
    float noiseValue = noise(vec3(vUv.x * 15.0, vUv.y * 15.0, uTime));

    noiseValue = step(noiseValue, -0.1);

    vec3 color = noiseValue == 0.0 ? vec3(1.0, 0.7, 0.0) : vec3(0.4, 0.3, 0.2);
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

const planeGeo = new THREE.PlaneGeometry(3.5, 3.5);
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
