import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import noise from '../../glsl-util/perlin/noise4D';

const canvas = document.getElementById('webgl');

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas,
  preserveDrawingBuffer: true,
});
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

renderer.setClearColor(0xffffff);

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

const vertexShader = `
// #define M_PI 3.1415926535897932384626433832795;

varying vec3 vPosition;
varying vec2 vUv;
varying float test;
uniform float time;

const float PI = 3.1415926535897932384626433832795;

${noise}

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

void main() {
  vUv = uv;
  vPosition = position;
 
  float timePower1 = (sin(2.0 * PI * time + 3.0 * PI / 2.0) + 1.0) / 2.0;
  float timePower2 = (sin(2.0 * PI * time + 1.0 * PI / 2.0) + 1.0) / 2.0;
  
  float slowTime1 = floor(time);
  float slowTime2 = floor(time + 10.5);

  vec3 p = position;
  
  vec4 p11 = vec4(p.x * 1.0 + slowTime1, p.y * 1.0 + slowTime1, p.z * 1.0 + slowTime1, slowTime1);
  vec4 p12 = vec4(p.x * 2.0 + slowTime1, p.y * 2.0 + slowTime1, p.z * 2.0 + slowTime1, slowTime1);
  vec4 p13 = vec4(p.x * 4.0 + slowTime1, p.y * 4.0 + slowTime1, p.z * 4.0 + slowTime1, slowTime1);

  vec4 p21 = vec4(p.x * 1.0 + slowTime2, p.y * 1.0 + slowTime2, p.z * 1.0 + slowTime2, slowTime2);
  vec4 p22 = vec4(p.x * 2.0 + slowTime2, p.y * 2.0 + slowTime2, p.z * 2.0 + slowTime2, slowTime2);
  vec4 p23 = vec4(p.x * 4.0 + slowTime2, p.y * 4.0 + slowTime2, p.z * 4.0 + slowTime2, slowTime2);
  
  float noiseValue1 = 1.0 * noise(p11) +  0.5 * noise(p12) + 0.25 * noise(p13);
  noiseValue1 *= timePower1;
  float noiseValue2 = 1.0 * noise(p21) +  0.5 * noise(p22) + 0.25 * noise(p23);
  noiseValue2 *= timePower2;
  
  float noiseValue = noiseValue1 + noiseValue2;
  
  // float noiseValue = noise(vec3(p.x + slowTime, p.y, p.z)) * timePower1 + noise(vec3(p.x + slowTime2, p.y, p.z)) * timePower2;
  
  test = map(noiseValue, 0.0, 1.0, 1.0, 0.0);
  // test = noiseValue;
  
  float noiseAmp = map(noiseValue, 0.0, 1.0, 1.0, 1.2);
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position * noiseAmp, 1.0);
  }
`;

const fragmentShader = `
  varying float test;

  void main() {
    gl_FragColor = vec4(test, test / 2.0, 0.0, 1.0);
  }
`;

const orbGeo = new THREE.IcosahedronGeometry(1.6, 64);
const orbMat = new THREE.ShaderMaterial({
  uniforms: {
    time: { value: 500 },
  },
  vertexShader,
  fragmentShader,
});

const orb = new THREE.Mesh(orbGeo, orbMat);

scene.add(orb);

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

			gl_FragColor = texture2D(tDiffuse, doubleUv);
		}`,
};

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

      float numStep = 10.0;
      
      float shiftX = floor(vUv.y * numStep) / numStep * sin(time * 4.0);
      float shiftY = floor(vUv.x * numStep) / numStep * cos(time * 4.0);
      
      shiftedUv.x = shift(shiftedUv.x, shiftX, 1.0);
      shiftedUv.y = shift(shiftedUv.y, shiftY, 1.0);
      
			gl_FragColor = texture2D(tDiffuse, shiftedUv);
		}`,
};

const composer = new EffectComposer(renderer);

const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const shiftPass = new ShaderPass(shiftShader);
shiftPass.enabled = false;
composer.addPass(shiftPass);

const mirrorPass = new ShaderPass(mirrorShader);
mirrorPass.enabled = false;
composer.addPass(mirrorPass);

let time = 500;

function render() {
  time += 0.006;

  orb.material.uniforms.time.value = time;
  shiftPass.uniforms.time.value = time / 2;

  // renderer.render(scene, camera);
  composer.render();

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
