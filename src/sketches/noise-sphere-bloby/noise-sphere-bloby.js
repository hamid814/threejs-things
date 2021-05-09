import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import SimplexNoise from 'simplex-noise';
import gsap from 'gsap';

const options = {
  timeSpeed: 0.0002,
  noiseFactor: 60,
  isAnimating: false,
};

const noise = new SimplexNoise();

const mouse = new THREE.Vector2(1, 1);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  innerWidth / innerHeight,
  0.1,
  1000
);
camera.position.set(0, 60, 130);
camera.lookAt(0, 0, 0);
camera.up.set(0, 100, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setClearColor(0x121212);
document.body.appendChild(renderer.domElement);

new OrbitControls(camera, renderer.domElement);

const orbRadius = 30;
const orbDetails = 10;
const orbGeo = new THREE.IcosahedronGeometry(orbRadius, orbDetails);
const orbGhostGeo = new THREE.IcosahedronGeometry(orbRadius, orbDetails);
const orbMat = new THREE.MeshStandardMaterial({
  color: new THREE.Color(0.4, 0.3, 0.2),
  roughness: 0.25,
  metalness: 0.8,
  flatShading: true,
});
const orb = new THREE.Mesh(orbGeo, orbMat);
const orbGhost = new THREE.Mesh(orbGhostGeo, orbMat);

const light = new THREE.PointLight(0xffffff, 2.2);
light.position.set(0, 30, 40);
scene.add(light);

const light2 = new THREE.PointLight(0xffffff, 1.7);
light2.position.set(30, 30, 0);
scene.add(light2);

const light3 = new THREE.PointLight(0xffffff, 1.7);
light3.position.set(-30, 30, 0);
scene.add(light3);

scene.add(orb);

const gridHelper = new THREE.GridHelper(200, 5);
scene.add(gridHelper);

function noisify(mesh, time) {
  const position = orbGhost.geometry.attributes.position;
  const vector = new THREE.Vector3();

  for (let i = 0; i < position.count; i++) {
    vector.fromBufferAttribute(position, i);
    const amp = 2;
    const distance =
      ((noise.noise3D(
        vector.x / options.noiseFactor + time * 7,
        vector.y / options.noiseFactor + time * 8,
        vector.z / options.noiseFactor + time * 9
      ) +
        1) /
        2) *
        0.8 +
      0.0;
    vector.multiplyScalar(distance * amp);
    mesh.geometry.attributes.position.setXYZ(i, vector.x, vector.y, vector.z);
  }

  mesh.geometry.attributes.position.needsUpdate = true;
}

let time = 0;

function render() {
  time += options.timeSpeed;

  noisify(orb, time);

  renderer.render(scene, camera);

  requestAnimationFrame(render);
}

render();

function animateOrb() {
  const timeline = gsap.timeline({ paused: true });

  timeline.to(options, {
    duration: 2.5,
    timeSpeed: 0.004,
    ease: 'Power3.easeInOut',
  });
  timeline.to(options, {
    duration: 1,
    timeSpeed: 0.0002,
    ease: 'Power3.easeOut',
  });
  timeline.to(options, { duration: 0, isAnimating: false });

  if (!options.isAnimating) {
    timeline.play();
    options.isAnimating = true;
  }
}

document.body.addEventListener('click', animateOrb);

renderer.domElement.addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  light.position.x = mouse.x * 25;
  light.position.y = (mouse.y + 5) * 8;
});
