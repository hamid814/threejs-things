import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import vs from './vert.glsl';
import fs from './frag.glsl';

const canvas = document.getElementById('webgl');

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas,
  preserveDrawingBuffer: true,
});
renderer.setSize(innerWidth, innerHeight);
renderer.setClearColor(0xddbb99);
renderer.setPixelRatio(Math.min(2, devicePixelRatio));

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  innerWidth / innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 5);
camera.lookAt(0, 0, 0);

scene.add(new THREE.AxesHelper(4));

const light = new THREE.PointLight();
light.position.set(0, 0, 2);
scene.add(light);

new OrbitControls(camera, renderer.domElement);

const loader = new THREE.CubeTextureLoader();
const urls = [
  '../../textures/cube/Bridge2/posx.jpg',
  '../../textures/cube/Bridge2/negx.jpg',
  '../../textures/cube/Bridge2/posy.jpg',
  '../../textures/cube/Bridge2/negy.jpg',
  '../../textures/cube/Bridge2/posz.jpg',
  '../../textures/cube/Bridge2/negz.jpg',
];
const worldTexture = loader.load(urls);

const orbGeo = new THREE.IcosahedronGeometry(1, 15);
// const orbGeo = createBoxWithRoundedEdges(1, 1, 1, 0.2, 30);
// const orbGeo = new THREE.BoxGeometry(1.4, 1.4, 1.4, 10, 10, 10);
const shaderMat = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    viewPos: { value: camera.position },
    worldTexture: { value: worldTexture },
    objectColor: { value: new THREE.Color(1, 1, 1) },
  },
  vertexShader: vs,
  fragmentShader: fs,
  // side: 1,
  // wireframe: true,
});
const phongMat = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  roughness: 0.7,
  metalness: 0.3,
  flatShading: true,
  // side: 1,
});

phongMat.onBeforeCompile = (shader) => {
  const replacement = /* glsl */ `
    gl_FragColor = vec4(outgoingLight.r, outgoingLight.g, outgoingLight.b, 1.0);
  `;

  // shader.fragmentShader = shader.fragmentShader.replace(
  //   'gl_FragColor = vec4( outgoingLight, diffuseColor.a );',
  //   replacement
  // );
};

// const orb = new THREE.Mesh(orbGeo, phongMat);
const orb = new THREE.Mesh(orbGeo, shaderMat);
// orb.position.set(5, 5, 5);
// orb.scale.set(2, 2, 1);

scene.add(orb);

// scene.background = worldTexture;

let time = 0;

const render = () => {
  renderer.render(scene, camera);

  time += 0.03;

  // orb.material.uniforms.viewPos.value = camera.position;
  orb.material.uniforms.uTime.value = time;

  // orb.rotation.y += 0.015;

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

    saveFile(imgData.replace(strMime, strDownloadMime), 'sketch.jpg');
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

// noisify(orb, 10);

render();
