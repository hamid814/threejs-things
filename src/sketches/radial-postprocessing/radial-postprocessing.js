import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import noise from '../../glsl-util/perlin/noise4D';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const canvas = document.getElementById('webgl');

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas,
  preserveDrawingBuffer: true,
});
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  innerWidth / innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 2);
camera.lookAt(0, 0, 0);

new OrbitControls(camera, renderer.domElement);

const vertexShader = `
  varying vec2 vUv;

  
  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    
    vUv = uv;
  }
  `;

const fragmentShader = `
  uniform float uTime;

  varying vec2 vUv;
  
  ${noise}
  
  void main() {
    float noiseValue = noise(vec3(vUv.x * 20.0, vUv.y * 20.0, uTime));
    
    noiseValue = sin(noiseValue * 10.0);
    
    noiseValue = step(noiseValue, -0.1);

    vec3 color = noiseValue == 0.0 ? vec3(1.0, 0.7, 0.2) : vec3(0.3, 0.2, 0.1);

    gl_FragColor = vec4(color, 1.0);
  }
`;

const planeGeo = new THREE.PlaneGeometry(3.5, 3.5);
const planeMat = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
  },
  vertexShader,
  fragmentShader,
  side: 2,
});

const plane = new THREE.Mesh(planeGeo, planeMat);

scene.add(plane);

const radialShader = {
  uniforms: {
    tDiffuse: { value: null },
    ratio: { value: innerWidth / innerHeight },
    width: { value: innerWidth },
  },
  vertexShader: `
    varying vec2 vUv;
  
    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); 

      vUv = uv;
    }
  `,
  fragmentShader: `
    #define PI 3.1415926538
  
    uniform sampler2D tDiffuse;
    uniform float ratio;
    uniform float width;
    
    varying vec2 vUv;
  
    vec2 rotateUV(vec2 uv, float rotation, vec2 mid) {
          return vec2(
            cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
            cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
          );
      }
    
    void main() {
      float lvl = 6.0;
      
      vec2 ratioUv = vUv;
      ratioUv.x *= ratio;
      float shiftRatio = ratio / 2.0 - 0.5;
      ratioUv.x -= shiftRatio;
      
      float dist = distance(ratioUv, vec2(0.5));

      float angle = atan(ratioUv.x - 0.5, ratioUv.y - 0.5);
      angle /= PI * 2.0;
      angle += 0.5;
      angle *= lvl * 2.0;
      if(mod(angle, 2.0) < 1.0) {
        angle = mod(angle, 1.0);
      } else {
        angle = 1.0 - mod(angle, 1.0);
      }
      
      vec2 arbUV = vec2(0.0, dist) + 0.5;
      
      float rotationValue = angle * PI * 2.0 / (lvl * 2.0);
      // float rotationValue = angle;
      
      vec2 rotatedArbUV = rotateUV(arbUV, rotationValue, vec2(0.5));

      vec2 repeatedUv = rotatedArbUV;
      repeatedUv.x = mod(rotatedArbUV.x, 1.0);
      if (rotatedArbUV.x > 1.0) repeatedUv.x = 1.0 - repeatedUv.x;
      repeatedUv.y = mod(rotatedArbUV.y, 1.0);
      if (rotatedArbUV.y > 1.0) repeatedUv.y = 1.0 - repeatedUv.y;
      
      vec4 texel = texture2D( tDiffuse, repeatedUv );
      
      gl_FragColor = texel;
      // gl_FragColor = vec4(repeatedUv.x, 0.0, 0.0, 1.0);
    }
  `,
};

const composer = new EffectComposer(renderer);

const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const radialPass = new ShaderPass(radialShader);
composer.addPass(radialPass);

let time = 15;

function render() {
  composer.render();

  plane.material.uniforms.uTime.value = time;
  time += 0.006;

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

document.body.addEventListener('mousemove', () => {
  time -= 0.01;
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
