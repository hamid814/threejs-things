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
  const timeline = gsap.timeline();

  timeline.to(positions, 1.5, {
    x: 100,
    z: -160,
    camX: 100,
    camZ: -100,
    lookX: 150,
    lookZ: -150,
    rotationX: 0.6,
    rotationZ: 0.6,
    volumeX: 0.25,
    volumeY: 0.25,
    volumeZ: 0.25,
    ease: 'power3.inOut',
  });
  setTimeout(() => {
    animating = false;
  }, 1500);
}

const canvas = document.getElementById('webgl');

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas,
  preserveDrawingBuffer: true,
});
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

const noise = new SimplexNoise();

const mouse = new THREE.Vector2(1, 1);

const scene = new THREE.Scene();

const fogColor = new THREE.Color(0.1, 0.1, 0.1);
scene.background = fogColor;
scene.add(new THREE.AmbientLight(fogColor, 2.5));
scene.fog = new THREE.Fog(fogColor, 10, 160);

const camera = new THREE.PerspectiveCamera(
  45,
  innerWidth / innerHeight,
  0.1,
  1000
);
camera.position.set(0, 60, 130);
camera.up.set(0, 100, 0);

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

const light = new THREE.PointLight(0x66cc99, 2.2);
light.position.set(0, 30, 40);
orbField.add(light);

const light2 = new THREE.PointLight(0xcc9966, 1.7);
light2.position.set(30, 30, 0);
orbField.add(light2);

const light3 = new THREE.PointLight(0x6699cc, 1.7);
light3.position.set(-30, 30, 0);
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
    const amp = 1;
    const distance =
      ((noise.noise3D(
        vector.x / 20 + time * 7,
        vector.y / 20 + time * 8,
        vector.z / 20 + time * 9
      ) +
        1) /
        2) *
        0.4 +
      0.8;
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
  if (animating) time += 0.0002;

  const col1 = (Math.sin(time * 2 * 30) + 1) / 2;
  const col2 = (Math.cos(time * 2 * 30) + 1) / 2;
  const col3 = (Math.cos(time * 2 * 10) + 1) / 2;
  orb.material.color = new THREE.Color(col1, col2, col3);

  if (animating)
    camera.lookAt(positions.lookX, positions.lookY, positions.lookZ);
  if (animating)
    camera.position.set(positions.camX, positions.camY, positions.camZ);

  orb.material.wireframe = false;

  noisify(orb, time);
  orbField.rotation.set(
    positions.rotationX,
    positions.rotationY,
    positions.rotationZ
  );
  if (animating) orb.rotation.y += 0.002;
  if (animating) orbField.position.set(positions.x, positions.y, positions.z);

  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

render();

document.body.addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  light.position.x = mouse.x * 25;
  light.position.y = (mouse.y + 5) * 8;
});

const btn = document.createElement('button');
btn.classList = 'selectable';
btn.innerText = 'click';
btn.style.border = 'none';
btn.style.background = '#6c9';
btn.style.padding = '10px';
btn.style.borderRadius = '10px';
btn.style.position = 'absolute';
btn.style.left = '0px';
btn.style.top = '0px';

let isHome = true;

btn.addEventListener('click', () => {
  isHome ? goPage() : goHome();
  isHome = !isHome;
});

document.body.appendChild(btn);

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
