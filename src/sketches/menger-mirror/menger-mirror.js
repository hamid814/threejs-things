import * as THREE from 'three';
import { Menger, V, isCube } from '../../menger/mener-builder';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

let mesh;

const indexArray = [
  0,
  2,
  1,
  2,
  3,
  1,
  4,
  6,
  5,
  6,
  7,
  5,
  8,
  10,
  9,
  10,
  11,
  9,
  12,
  14,
  13,
  14,
  15,
  13,
  16,
  18,
  17,
  18,
  19,
  17,
  20,
  22,
  21,
  22,
  23,
  21,
];

// indexs for each face in a cube
const facesArray = {
  11: [0, 1, 2, 3, 4, 5],
  10: [6, 7, 8, 9, 10, 11],
  21: [12, 13, 14, 15, 16, 17],
  20: [18, 19, 20, 21, 22, 23],
  31: [24, 25, 26, 27, 28, 29],
  30: [30, 31, 32, 33, 34, 35],
};

const canvas = document.getElementById('webgl');

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas,
  preserveDrawingBuffer: true,
});
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(2, devicePixelRatio));
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.OrthographicCamera(-10, 10, 8, -8, 1, 1000);
camera.lookAt(0, 0, 0);
camera.position.set(0, 30, 30);
scene.add(camera);

// const camera = new THREE.PerspectiveCamera(
//   45,
//   innerWidth / innerHeight,
//   0.1,
//   1000
// );
// camera.position.set(0, 40, 40);
// camera.lookAt(0, 0, 0);

// scene.add(new THREE.AxesHelper());

new OrbitControls(camera, renderer.domElement);

const light1 = new THREE.PointLight(0x666688, 3);
light1.position.set(150, 150, 150);
scene.add(light1);

const light2 = new THREE.PointLight(0x886666, 3);
light2.position.set(-150, 150, -150);
scene.add(light2);

const light3 = new THREE.PointLight(0x668866, 3);
light3.position.set(0, -150, 0);
scene.add(light3);

const cubeGeo = new THREE.BoxGeometry();
const cubeMat = new THREE.MeshNormalMaterial();

const menger = new Menger(2, 3, new V(0, 0, 0));

function createUsingBuffer(menger) {
  const size = menger.cubeMagnetude;

  const positions = menger.getPositions();

  console.log('faces: ', menger.facesCount);
  console.log('cubes count:', positions.length);

  const bufferGeo = new THREE.BufferGeometry();

  // two triangles for each face and three vertex each triangle and three ( xyz ) for each vertex
  const positionArray = new Float32Array(menger.facesCount * 2 * 3 * 3);
  const normalArray = new Float32Array(menger.facesCount * 2 * 3 * 3);

  const positionBA = new THREE.BufferAttribute(positionArray, 3);
  const normalBA = new THREE.BufferAttribute(normalArray, 3);

  let itteration = 0;

  const cube = new THREE.Mesh(cubeGeo, cubeMat);

  const cubePositionAttr = cube.geometry.attributes.position;
  const cubeNormalAttr = cube.geometry.attributes.normal;

  for (let i = 0; i < positions.length; i++) {
    const pos = positions[i].position;
    const faces = positions[i].faces;

    for (let j = 0; j < faces.length; j++) {
      const faceId = faces[j];
      const faceIndexes = facesArray[faceId];

      for (let k = 0; k < faceIndexes.length; k++) {
        let index = faceIndexes[k];
        index = indexArray[index];

        // size = menger.cubeSize
        const x = cubePositionAttr.array[index * 3] * size + pos.x;
        const y = cubePositionAttr.array[index * 3 + 1] * size + pos.y;
        const z = cubePositionAttr.array[index * 3 + 2] * size + pos.z;
        const nx = cubeNormalAttr.array[index * 3];
        const ny = cubeNormalAttr.array[index * 3 + 1];
        const nz = cubeNormalAttr.array[index * 3 + 2];

        positionBA.setXYZ(itteration, x, y, z);
        normalBA.setXYZ(itteration, nx, ny, nz);

        itteration++;
      }
    }
  }

  bufferGeo.setAttribute('position', positionBA);
  bufferGeo.setAttribute('normal', normalBA);

  mesh = new THREE.Mesh(bufferGeo, cubeMat);

  scene.add(mesh);
}

const mirrorShader = {
  uniforms: {
    tDiffuse: { value: null },
    opacity: { value: 1.0 },
  },

  vertexShader: `
		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,
  fragmentShader: `
		uniform sampler2D tDiffuse;
		varying vec2 vUv;

    float map(float value, float min1, float max1, float min2, float max2) {
      return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
    }
    
		void main() {
      vec2 doubleUv = vUv * 2.0;

      if(vUv.x > 0.5) doubleUv.x = map(doubleUv.x - 1.0, 0.0, 1.0, 1.0, 0.0);
      
      if (vUv.y > 0.5) doubleUv.y = map(doubleUv.y - 1.0, 0.0, 1.0, 1.0, 0.0);

			vec4 vertex_Color = texture2D(tDiffuse, doubleUv);

      // vertex_Color.r = map(vertex_Color.r, 0.0, 1.0, 0.3, 0.8);
      
      gl_FragColor = vec4(vertex_Color.r, vertex_Color.g, vertex_Color.b, 1.0);
		}`,
};

const composer = new EffectComposer(renderer);

const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const mirrorPass = new ShaderPass(mirrorShader);
// mirrorPass.enabled = false;
composer.addPass(mirrorPass);

function render() {
  // renderer.render(scene, camera);
  composer.render();

  // mesh.rotation.x += 0.001;
  mesh.rotation.y += 0.005;
  // mesh.rotation.z += 0.002;

  requestAnimationFrame(render);
}

createUsingBuffer(menger);

render();

window.addEventListener('resize', () => window.location.reload());

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
