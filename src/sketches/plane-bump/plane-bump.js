import * as THREE from 'three';
import './style/style.css';

const canvas = document.getElementById('webgl');

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas,
  preserveDrawingBuffer: true,
});
renderer.setSize(innerWidth, innerHeight);

let plane;

const scene = new THREE.Scene();

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2(0.0, 0.0);

renderer.domElement.addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  plane.material.uniforms.mouse.value = mouse;
});

const camera = new THREE.PerspectiveCamera(
  45,
  innerWidth / innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 30);

const planeGeo = new THREE.PlaneGeometry(50, 50, 50, 50);

const vertexShader = `
  uniform vec2 bumpPos;
  uniform vec2 mouse;
  uniform float frq;

  float radius = 0.1;
  
  float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
  }
  
  void main() {
    float dist = distance(bumpPos, uv);

    // float xa = (uv.x + 1.0) / 2.0;
    // float ya = (uv.y + 1.0) / 2.0;
    // float xDist = xa - mouse.x;
    // float yDist = ya - mouse.y;
    // float dist = sqrt(xDist * xDist + yDist * yDist);
    
    // float dist = distance(mouse, uv);

    float xDirection;
    float yDirection;
    float magnetude = 2.0;

    if (bumpPos.x < uv.x) {xDirection = 1.0;} else {xDirection = -1.0;}
    if (bumpPos.y < uv.y) {yDirection = 1.0;} else {yDirection = -1.0;}
    float val = dist < radius ? map(dist, 0.0, radius, 1.7, 0.0) : 0.0;
    // val = sin(val) * cos(val);
    // val = (sin(val) + 1.0) / 2.0;
    val = sin(val);
    
    vec3 newPos = position;
    // newPos.x = position.x + val * xDirection * magnetude;
    // newPos.y = position.y + val * yDirection * magnetude;
    newPos.z = position.z + val * magnetude;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
  }`;

const planeMat = new THREE.ShaderMaterial({
  uniforms: {
    bumpPos: { value: { x: 0, y: 0 } },
    mouse: { value: { x: 0, y: 0 } },
    color: { value: new THREE.Color(0x9966cc) },
    frq: { value: 1.5 },
  },
  vertexShader,
  fragmentShader: `uniform vec3 color;void main () {gl_FragColor = vec4(color, 1.0);}`,
  wireframe: true,
  side: 2,
});

plane = new THREE.Mesh(planeGeo, planeMat);
scene.add(plane);

function render() {
  renderer.render(scene, camera);
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);
  if (intersects[0]) {
    const placeOnPlane = intersects[0].uv;
    plane.material.uniforms.bumpPos.value = {
      y: placeOnPlane.y,
      x: placeOnPlane.x,
    };
  }

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
