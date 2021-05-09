import * as THREE from 'three';
import noise from '../../glsl-util/perlin/noise4D';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(2, devicePixelRatio));
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  innerWidth / innerHeight,
  0.1,
  1000
);
camera.lookAt(0, 0, 0);
camera.position.set(0, 0, 1);

const contolrs = new OrbitControls(camera, renderer.domElement);
contolrs.update();

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
    
    noiseValue = sin(noiseValue * 15.0);
    
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
      angle *= 6.0 * 2.0;
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

const radialPass = new ShaderPass(radialShader);
composer.addPass(radialPass);

const mirrorPass = new ShaderPass(mirrorShader);
composer.addPass(mirrorPass);

let time = 20;

const render = () => {
  composer.render();

  plane.material.uniforms.uTime.value = time;

  time += 0.003;

  requestAnimationFrame(render);
};

render();

document.addEventListener('mousemove', () => {
  time -= 0.01;
});
