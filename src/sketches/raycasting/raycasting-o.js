import * as THREE from 'three';
import RaytracingMaterial from './raytracing';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

var mesh,
  camera,
  scene,
  renderer,
  mouse = { x: 0.5, y: 0.2 },
  changingMorph = true,
  angle = 0,
  u = 0,
  morphPower = 0,
  m = 0,
  lightChannelDelta = 0.02,
  w = 0.02,
  refractionPower = 0.77,
  f = 0.77;

function init() {
  scene = new THREE.Scene();

  renderer = new THREE.WebGLRenderer({
    antialias: false,
    canvas: document.getElementById('webgl'),
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  // renderer.setClearColor(0xffffff);
  document.body.prepend(renderer.domElement);

  // camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1);
  camera = new THREE.PerspectiveCamera(10, innerWidth / innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 6);
  camera.lookAt(0, 0, 0);

  new OrbitControls(camera, renderer.domElement);

  mesh = new THREE.Mesh(
    new THREE.BoxBufferGeometry(1, 1, 1),
    new RaytracingMaterial({
      resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
    })
  );

  window.addEventListener('resize', function () {
    mesh.material.uniforms.resolution.value.x = window.innerWidth;
    mesh.material.uniforms.resolution.value.y = window.innerHeight;

    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  window.addEventListener('mousemove', function (e) {
    const x = e.clientX;
    const y = e.clientY;

    mouse.x = x / window.innerWidth;
    mouse.y = y / window.innerHeight;

    if (!changingMorph) {
      mesh.material.uniforms.mouse.value.x = mouse.x;
      mesh.material.uniforms.mouse.value.y = mouse.y;
    }
  });

  window.addEventListener('click', () => (changingMorph = !changingMorph));

  requestAnimationFrame(render);
}

function render(time) {
  if (changingMorph) {
    u = 2 * mouse.x * Math.PI;
    m = Math.min(0.99, Math.max(0.01, 1.2 * mouse.y - 0.05));
  } else {
    (f = 0.5 * mouse.x + 0.5), (w = 0.1 * mouse.y);
    var a = 0.5 * (Math.sin(0.001 * time) + 1);
    (m = Math.max(0.01, Math.min(0.99, a))),
      (u = 2 * Math.PI - ((0.001 * time) % (2 * Math.PI)));
  }

  var s = u - angle;

  Math.abs(s) > Math.PI && (angle += 2 * Math.PI * Math.sign(s));

  angle += 0.03 * (u - angle);
  morphPower += 0.03 * (m - morphPower);
  lightChannelDelta += 0.1 * (w - lightChannelDelta);
  refractionPower += 0.1 * (f - refractionPower);

  // mesh.material.uniforms.angle.value = angle;
  mesh.material.uniforms.morphPower.value = 0.9;
  // mesh.material.uniforms.lightChannelDelta.value = 0.0;
  // mesh.material.uniforms.refractionPower.value = 0.8;

  renderer.render(mesh, camera);
  requestAnimationFrame(render);
}

init();
