import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import noise from '../../glsl-util/perlin/noise4D';
import rotate from '../../glsl-util/shaders/rotate';

const renderer = new THREE.WebGLRenderer({ antialias: true });
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
    float noiseValue = noise(vec3(vUv.x * 15.0, vUv.y * 15.0, uTime));
    
    noiseValue = sin(noiseValue * 10.0);
    
    noiseValue = step(noiseValue, -0.1);

    vec3 color = noiseValue == 0.0 ? vec3(1.0, 0.3, 0.0) : vec3(0.4, 0.3, 0.2);

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
    
    varying vec2 vUv;

    ${rotate}
  
    vec2 rotateUV(vec2 uv, float rotation, vec2 mid)
      {
          return vec2(
            cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
            cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
          );
      }
    
    void main() {
      float dist = distance(vUv, vec2(0.5));

      float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
      angle /= PI * 2.0;
      angle += 0.5;
      angle *= 12.0;
      if(mod(angle, 2.0) < 1.0) {
        angle = mod(angle, 1.0);
      } else {
        angle = 1.0 - mod(angle, 1.0);
      }
      
      vec2 arbUV = vec2(0.0, dist) + 0.5;

      vec2 rotatedArbUV = rotateUV(arbUV, angle, vec2(0.5));

      vec4 texel = texture2D( tDiffuse, rotatedArbUV );
      
      gl_FragColor = texel;
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
  time += 0.0006;

  requestAnimationFrame(render);
}

render();
