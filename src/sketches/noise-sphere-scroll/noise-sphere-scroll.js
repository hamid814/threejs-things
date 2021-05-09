import * as THREE from 'three';
import SimplexNoise from 'simplex-noise';
import gsap from 'gsap';

let animating = true;

const positions = {
  x: 0,
  y: 0,
  z: 0,
  rotationX: 0,
  rotationY: 0,
  rotationZ: 0,
  volumeX: 1,
  volumeY: 1,
  volumeZ: 1,
  camX: 0,
  camY: 60,
  camZ: 130,
  lookX: 0,
  lookY: 0,
  lookZ: 0,
  orbitSpeed: 0.002,
  timeSpeed: 0.0002,
  p: 1,
  noiseFactor: 1,
};

function goHome() {
  animating = true;
  gsap.to(positions, 1.5, {
    x: 0,
    y: 0,
    z: 0,
    rotationX: 0,
    rotationY: 0,
    rotationZ: 0,
    volumeX: 1,
    volumeY: 1,
    volumeZ: 1,
    camX: 0,
    camY: 60,
    camZ: 130,
    lookX: 0,
    lookY: 0,
    lookZ: 0,
    ease: 'power3.inOut',
  });
}

function goPage() {
  gsap.to(positions, 1.5, {
    x: 100,
    z: -170,
    rotationX: 0.6,
    rotationZ: 0.6,
    volumeY: -0.15,
    camX: 100,
    camZ: -100,
    lookX: 150,
    lookZ: -150,
    ease: 'Power3.inOut',
  });
  setTimeout(() => {
    animating = false;
  }, 1500);
}

const noise = new SimplexNoise();

const mouse = new THREE.Vector2(1, 1);
const raycaster = new THREE.Raycaster();

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  innerWidth / innerHeight,
  0.1,
  1000
);
camera.position.set(0, 60, 130);
camera.up.set(0, 100, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

const orbField = new THREE.Object3D();

const orbRadius = 30;
const orbDetails = 10;
const orbGeo = new THREE.IcosahedronGeometry(orbRadius, orbDetails);
const orbGhostGeo = new THREE.IcosahedronGeometry(orbRadius, orbDetails);
const orbMat = new THREE.MeshStandardMaterial({
  color: new THREE.Color(1, 0.9, 0.2),
  roughness: 0.25,
  metalness: 0.8,
  flatShading: true,
});
const orb = new THREE.Mesh(orbGeo, orbMat);
const orbGhost = new THREE.Mesh(orbGhostGeo, orbMat);

const light = new THREE.PointLight(0xffffff, 2.2);
light.position.set(0, 30, 40);
orbField.add(light);

const light2 = new THREE.PointLight(0xffffff, 1.7);
light2.position.set(60, 30, 0);
orbField.add(light2);

const light3 = new THREE.PointLight(0xffffff, 1.7);
light3.position.set(-60, 30, 0);
orbField.add(light3);

orbField.add(orb);

scene.add(orbField);

const gridHelper = new THREE.GridHelper(200, 5);
scene.add(gridHelper);

let time = 0;

function noisify(mesh, time) {
  const position = orbGhost.geometry.attributes.position;
  const vector = new THREE.Vector3();

  for (let i = 0; i < position.count; i++) {
    vector.fromBufferAttribute(position, i);
    const amp = orb.geometry.type === 'IcosahedronGeometry' ? 2 : 3;
    const distance =
      ((noise.noise3D(
        vector.x / positions.noiseFactor + time * 7,
        vector.y / positions.noiseFactor + time * 8,
        vector.z / positions.noiseFactor + time * 9
      ) +
        1) /
        2) *
        0.8 +
      0.0;
    vector.multiplyScalar(distance * amp);
    vector.multiply({
      x: positions.volumeX,
      y: positions.volumeY,
      z: positions.volumeZ,
    });
    mesh.geometry.attributes.position.setXYZ(i, vector.x, vector.y, vector.z);
  }

  mesh.geometry.attributes.position.needsUpdate = true;
}

function render() {
  orb.geometry.parameters.p = positions.p;

  if (animating) time += positions.timeSpeed;

  const col1 = (Math.sin(time * 2 * 30) + 1) / 2;
  const col2 = (Math.cos(time * 2 * 30) + 1) / 2;
  const col3 = (Math.cos(time * 2 * 10) + 1) / 2;
  orb.material.color = new THREE.Color(col1, col2, col3);

  if (animating)
    camera.lookAt(positions.lookX, positions.lookY, positions.lookZ);
  if (animating)
    camera.position.set(positions.camX, positions.camY, positions.camZ);

  orb.material.wireframe = false;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);
  intersects.forEach((object) => {
    if (object.object.geometry.type === 'IcosahedronGeometry') {
      object.object.material.wireframe = true;
    }
  });

  noisify(orb, time);

  renderer.render(scene, camera);

  orbField.rotation.set(
    positions.rotationX,
    positions.rotationY,
    positions.rotationZ
  );
  // if (animating) orb.rotation.y += positions.orbitSpeed;
  if (animating) orbField.position.set(positions.x, positions.y, positions.z);

  requestAnimationFrame(render);
}

render();

renderer.domElement.addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  light.position.x = mouse.x * 25;
  light.position.y = (mouse.y + 5) * 8;
});

let noiseIsBig = false;

function animateOrb() {
  const timeline = gsap.timeline({ paused: true });

  const noiseFactor1 = noiseIsBig ? 100 : 5;
  const noiseFactor2 = noiseIsBig ? 5 : 100;

  noiseIsBig = !noiseIsBig;

  timeline.to(positions, {
    duration: 1.5,
    orbitSpeed: 0.05,
    timeSpeed: 0.003,
    noiseFactor: noiseFactor1,
    ease: 'Power2.easeInOut',
  });
  timeline.to(positions, {
    duration: 1,
    orbitSpeed: 0.002,
    noiseFactor: noiseFactor2,
    timeSpeed: 0.0002,
    ease: 'Power2.easeOut',
  });
  timeline.to(positions, { duration: 0, isOrbitAnimating: false });

  if (!positions.isOrbitAnimating) {
    timeline.play();
    positions.isOrbitAnimating = true;
  }
}

document.body.addEventListener('touchmove', animateOrb);
document.body.addEventListener('wheel', animateOrb);

const btn = document.createElement('button');
btn.innerText = 'click';
btn.style.border = 'none';
btn.style.background = '#6c9';
btn.style.padding = '10px';
btn.style.borderRadius = '10px';
btn.style.position = 'absolute';
btn.style.left = '0px';
btn.style.top = '0px';
btn.style.cursor = 'pointer';

let isHome = true;

btn.addEventListener('click', () => {
  isHome ? goPage() : goHome();
  isHome = !isHome;
});

document.body.appendChild(btn);
