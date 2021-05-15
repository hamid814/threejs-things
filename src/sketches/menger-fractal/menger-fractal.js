import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

const canvas = document.getElementById('webgl');

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas,
  preserveDrawingBuffer: true,
});
renderer.setSize(innerWidth, innerHeight);
renderer.setClearColor(0xeeeeee);
renderer.setPixelRatio(2);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
camera.position.set(0, 0, 1.3);
camera.lookAt(0, 0, 0);

const offset = new THREE.Vector2();
let zoom = 1;

let mosueIsPressed = false;
let prevX = 0;
let prevY = 0;

renderer.domElement.addEventListener('wheel', (e) => {
  zoom += e.deltaY / 100;
});

renderer.domElement.addEventListener('mousedown', (e) => {
  mosueIsPressed = true;
  prevX = e.clientX;
  prevY = e.clientY;
});

renderer.domElement.addEventListener('mouseup', (e) => {
  mosueIsPressed = false;
});

renderer.domElement.addEventListener('mousemove', (e) => {
  if (mosueIsPressed) {
    const newX = e.clientX;
    const newY = e.clientY;

    const offX = newX - prevX;
    const offY = newY - prevY;

    prevX = newX;
    prevY = newY;

    offset.x += offX;
    offset.y -= offY;
  }
});

const scene = new THREE.Scene();

const fractalShader = {
  uniforms: {
    tDiffuse: { value: null },
    ratio: { value: innerWidth / innerHeight },
    zoom: { value: zoom },
    offset: { value: offset },
  },
  vertexShader: `
    varying vec2 vUv;
  
    void main() {
      vUv = uv;
  
      gl_Position = projectionMatrix * modelMatrix * viewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float ratio;
    uniform vec2 offset;
    uniform float zoom;
  
    varying vec2 vUv;
  
    bool isCenterLinear(float x, float w) {
      bool res = false;
  
      float offX = x / (w / 3.0) - 1.0;
      
      float moded = mod(offX, 2.0);
      
      if (ceil(moded) == 1.0) {
        res = true;
      }
  
      return res;
    }
    
    bool isCenterSquare(float x, float y, float width) {
      return isCenterLinear(x, width) && isCenterLinear(y, width);
    }
    
    void main() {
      vec2 offsetUv = vUv;
      offsetUv -= offset / 1300.0;

      vec2 zoomUv = offsetUv;
      zoomUv *= mod(zoom / 30.0, 1.0 - 0.3333333) + 0.3333333;
      
      vec2 ratioUv = zoomUv;
      ratioUv.x *= ratio;
      
      vec2 newUv = ratioUv * 27.0;
      float width = 50.0;
  
      float s = 1.0;
      
      for (int i = 1; i <= 27 * 27; i *= 3) {
        float i_float = float(i);
        
        if(isCenterSquare(newUv.x, newUv.y, width / i_float)) {
          s = 0.0;
          break;
        }
      }
      
      gl_FragColor = vec4(s, s, s, 1.0);
    }
  `,
};

const composer = new EffectComposer(renderer);

const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const fractalPass = new ShaderPass(fractalShader);
composer.addPass(fractalPass);

let time = 0;

const render = () => {
  time += 0.005;

  fractalPass.uniforms.offset.value = offset;
  fractalPass.uniforms.zoom.value = zoom;

  composer.render();

  requestAnimationFrame(render);
};

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

    saveFile(imgData.replace(strMime, strDownloadMime), 'menger-fractal.jpg');
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
