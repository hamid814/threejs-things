import gsap from 'gsap';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const vars = {
  rotationX: 0,
  rotationY: 0,
  rotationZ: 0,
  wx: 0, // world x rotation
  wy: 0, // world y rotation
  wz: 0, // world z rotation
};

let tl;

/**
 * uncomment to use gsap to render every n seconds with new vars
 * make sure to comment the initial render function
 */
// function tick() {
//   if (tl) {
//     if (tl.isActive()) {
//       console.log('h');
//       tl.pause();

//       setTimeout(() => {
//         tl.play();
//         render();
//       }, 600);
//     }
//   }
// }
// gsap.ticker.add(tick);

setTimeout(() => {
  tl = gsap.timeline({ paused: true });

  tl.to(vars, {
    rotationX: Math.PI,
    duration: 1,
    ease: 'power4.easeInOut',
  });
  tl.to(vars, {
    rotationY: Math.PI,
    duration: 1,
    ease: 'power4.easeInOut',
  });
  tl.to(vars, {
    rotationZ: Math.PI,
    duration: 1,
    ease: 'power4.easeInOut',
  });
  tl.to(vars, {
    rotationX: Math.PI * 0.195,
    rotationZ: Math.PI / 4,
    duration: 1,
    ease: 'power4.easeInOut',
  });
  tl.to(vars, {
    wy: (Math.PI * 2) / 3,
    duration: 1,
    ease: 'power4.easeInOut',
  });
  tl.to(vars, {
    wy: 0,
    rotationX: 0,
    rotationZ: 0,
    duration: 1,
    ease: 'power4.easeInOut',
  });

  tl.play();
}, 500);

const canvas = document.getElementById('webgl');

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas,
  preserveDrawingBuffer: true,
});
renderer.setSize(innerWidth, innerHeight);
renderer.setClearColor(0xffffff);
renderer.setPixelRatio(Math.min(2, devicePixelRatio));

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  innerWidth / innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 2.5);
camera.lookAt(0, 0, 0);

new OrbitControls(camera, renderer.domElement);

// cube world
const cw = new THREE.Group();

const cubeGeo = new THREE.BoxGeometry();
const edges = new THREE.EdgesGeometry(cubeGeo);
const line = new THREE.LineSegments(
  edges,
  new THREE.LineBasicMaterial({ color: 0x000000 })
);
cw.add(line);

scene.add(cw);

let num = 0;
const render = () => {
  renderer.render(scene, camera);

  line.rotation.x = vars.rotationX;
  line.rotation.y = vars.rotationY;
  line.rotation.z = vars.rotationZ;
  cw.rotation.x = vars.wx;
  cw.rotation.y = vars.wy;
  cw.rotation.z = vars.wz;

  requestAnimationFrame(render);

  // saveAsImage();

  num++;
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

    saveFile(
      imgData.replace(strMime, strDownloadMime),
      'cube-' + String(num) + '.jpg'
    );
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

render();
