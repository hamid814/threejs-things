import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

// shaders
import vs from './vert.glsl';
import fs from './frag.glsl';

const canvas = document.getElementById('webgl');

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas,
  preserveDrawingBuffer: true,
});
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);
renderer.setClearColor(0x999999);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  innerWidth / innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 5);
camera.lookAt(0, 0, 0);

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

const vertexShader = vs;
const fragmentShader = fs;

const orbGeo = new THREE.IcosahedronGeometry(1.4, 32);
const orbMat = new THREE.ShaderMaterial({
  uniforms: {
    time: { value: 0 },
  },
  vertexShader,
  fragmentShader,
  side: 2,
  wireframe: true,
});

const orb = new THREE.Mesh(orbGeo, orbMat);
scene.add(orb);

const shiftShader = {
  uniforms: {
    tDiffuse: { value: null },
    time: { value: 0.0 },
  },

  vertexShader: `
		varying vec2 vUv;

		void main() {
			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,
  fragmentShader: `
		uniform sampler2D tDiffuse;
    uniform float time;
		varying vec2 vUv;

    float map(float value, float min1, float max1, float min2, float max2) {
      return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
    }

    float shift(float value, float shift, float max) {
      return value < shift ? max - shift + value : value - shift;
    }
    
		void main() {
      vec2 shiftedUv = vUv;

      float numStep = 2.0;
      
      float dude = floor(vUv.y * 10.0) / 10.0 * sin(time * 3.0);
      float dude2 = floor(vUv.x * 10.0) / 10.0 * cos(time * 3.0);
      
      shiftedUv.x = shift(shiftedUv.x, dude, 1.0);
      shiftedUv.y = shift(shiftedUv.y, dude2, 1.0);
      
			gl_FragColor = texture2D(tDiffuse, shiftedUv);
		}`,
};

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

const shiftPass = new ShaderPass(shiftShader);
composer.addPass(shiftPass);

const mirrorPass = new ShaderPass(mirrorShader);
composer.addPass(mirrorPass);

let time = 0;

function render() {
  composer.render();

  orb.material.uniforms.time.value = time;
  shiftPass.uniforms.time.value = time;
  time += 0.003;

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
