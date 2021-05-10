import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const canvas = document.getElementById('webgl');

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas,
  preserveDrawingBuffer: true,
});
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
camera.position.set(0, 0, 4);
camera.lookAt(0, 0, 0);

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

const material = new THREE.ShaderMaterial({
  vertexShader: `
    varying vec2 vUv;
  
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = 60.0;
      gl_PointSize *= (1.0 / -(modelViewMatrix * vec4(position, 1.0)).z);
      
      vUv = uv;
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
  
    void main() {
      float dist = 1.0 - step(0.5, distance(gl_PointCoord, vec2(0.5)));

      if (dist == 0.0) discard;
      
      gl_FragColor = vec4(dist, 1.0, 0.0, 1.0);
    }
  `,
});

const geometry = new THREE.BufferGeometry();

const first = new THREE.Vector3(1, 1, 1);
const second = new THREE.Vector3(-1, -1, -1);

const positions = new THREE.BufferAttribute(new Float32Array(15), 3);

const distance = first.distanceTo(second);
const vec = new THREE.Vector3()
  .subVectors(first, second)
  .normalize()
  .multiplyScalar(Math.random())
  .multiplyScalar(distance)
  .add(second);

const vec2 = new THREE.Vector3()
  .subVectors(first, second)
  .normalize()
  .multiplyScalar(Math.random())
  .multiplyScalar(distance)
  .add(second);

const vec3 = new THREE.Vector3()
  .subVectors(first, second)
  .normalize()
  .multiplyScalar(Math.random())
  .multiplyScalar(distance)
  .add(second);

positions.setXYZ(0, first.x, first.y, first.z);
positions.setXYZ(1, second.x, second.y, second.z);
positions.setXYZ(2, vec.x, vec.y, vec.z);
positions.setXYZ(3, vec2.x, vec2.y, vec2.z);
positions.setXYZ(4, vec3.x, vec3.y, vec3.z);

geometry.setAttribute('position', positions);

const points = new THREE.Points(geometry, material);

scene.add(points);

const boxGeo = new THREE.BoxGeometry(2, 2, 2);
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

  requestAnimationFrame(render);
}

render();

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
