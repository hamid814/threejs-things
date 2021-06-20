import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import discVS from './glsl/disc.vert.glsl';
import discFS from './glsl/disc.frag.glsl';

const canvas = document.getElementById('webgl');

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas,
  preserveDrawingBuffer: true,
});
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(2, devicePixelRatio));

const discShader = {
  uniforms: {
    tDiffuse: { value: null },
    ratio: { value: innerWidth / innerHeight },
    uTime: { value: 0 },
  },
  vertexShader: discVS,
  fragmentShader: discFS,
};

const composer = new EffectComposer(renderer);

const discPass = new ShaderPass(discShader);
composer.addPass(discPass);

let time = 0;

const render = () => {
  composer.render();

  time += 0.003;

  discPass.uniforms.uTime.value = time;

  requestAnimationFrame(render);
};

window.addEventListener('resize', () => {
  const w = innerWidth;
  const h = innerHeight;

  renderer.setSize(w, h);
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

render();
