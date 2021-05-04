import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass';

let plane;

const canvas = document.getElementById('webgl');

const scene = new THREE.Scene();

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2(0.0, 0.0);

const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
renderer.setSize(innerWidth, innerHeight);

document.body.appendChild(renderer.domElement);

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

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

Object.assign(THREE.PlaneGeometry.prototype, {
  toGrid: function () {
    let segmentsX = this.parameters.widthSegments || 1;
    let segmentsY = this.parameters.heightSegments || 1;
    let indices = [];
    for (let i = 0; i < segmentsY + 1; i++) {
      let index11 = 0;
      let index12 = 0;
      for (let j = 0; j < segmentsX; j++) {
        index11 = (segmentsX + 1) * i + j;
        index12 = index11 + 1;
        let index21 = index11;
        let index22 = index11 + (segmentsX + 1);
        indices.push(index11, index12);
        if (index22 < (segmentsX + 1) * (segmentsY + 1) - 1) {
          indices.push(index21, index22);
        }
      }
      if (index12 + segmentsX + 1 <= (segmentsX + 1) * (segmentsY + 1) - 1) {
        indices.push(index12, index12 + segmentsX + 1);
      }
    }
    // this.setIndex(indices);
    return this;
  },
});

const planeGeo = new THREE.PlaneGeometry(50, 50, 50, 50).toGrid();

const vertexShader = `
  uniform vec2 bumpPos;
  uniform vec2 mouse;
  uniform float time;
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
    newPos.z = position.z + val * magnetude * frq;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
  }`;

const planeMat = new THREE.ShaderMaterial({
  uniforms: {
    bumpPos: { value: { x: 0, y: 0 } },
    mouse: { value: { x: 0, y: 0 } },
    color: { value: new THREE.Color(0x9966cc) },
    time: { value: 1 },
    frq: { value: 1.5 },
  },
  vertexShader,
  fragmentShader: `uniform vec3 color;void main () {gl_FragColor = vec4(color, 1.0);}`,
  wireframe: true,
  side: 2,
});

plane = new THREE.Mesh(planeGeo, planeMat);
// plane.rotation.x = Math.PI * 0.5;
scene.add(plane);

const composer = new EffectComposer(renderer);

const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

// const customPP = new ShaderPass(customShader);
// composer.addPass(customPP);
const glitchPass = new GlitchPass();
composer.addPass(glitchPass);

let time = 0;

function render() {
  // controls.update();
  renderer.render(scene, camera);
  // composer.render();
  // customShader.uniforms.mouse.value = { x: mouse.x, y: mouse.y };
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);
  // console.log(intersects[0].uv);
  if (intersects[0]) {
    const placeOnPlane = intersects[0].uv;
    plane.material.uniforms.bumpPos.value = {
      y: placeOnPlane.y,
      x: placeOnPlane.x,
    };
  }

  plane.material.uniforms.time.value = time;

  time += 0.03;

  requestAnimationFrame(render);
}

render();
