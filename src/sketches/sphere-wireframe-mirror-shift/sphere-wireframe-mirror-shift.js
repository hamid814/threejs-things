import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

const renderer = new THREE.WebGLRenderer({ antialias: true });
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

const vertexShader = `
  varying vec3 vPosition;
  varying vec2 vUv;
  varying float test;
  uniform float time;

  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
  vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

  float noise(vec3 P){
    vec3 Pi0 = floor(P); // Integer part for indexing
    vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
    Pi0 = mod(Pi0, 289.0);
    Pi1 = mod(Pi1, 289.0);
    vec3 Pf0 = fract(P); // Fractional part for interpolation
    vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
    vec4 iy = vec4(Pi0.yy, Pi1.yy);
    vec4 iz0 = Pi0.zzzz;
    vec4 iz1 = Pi1.zzzz;

    vec4 ixy = permute(permute(ix) + iy);
    vec4 ixy0 = permute(ixy + iz0);
    vec4 ixy1 = permute(ixy + iz1);

    vec4 gx0 = ixy0 / 7.0;
    vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
    gx0 = fract(gx0);
    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
    vec4 sz0 = step(gz0, vec4(0.0));
    gx0 -= sz0 * (step(0.0, gx0) - 0.5);
    gy0 -= sz0 * (step(0.0, gy0) - 0.5);

    vec4 gx1 = ixy1 / 7.0;
    vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
    gx1 = fract(gx1);
    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
    vec4 sz1 = step(gz1, vec4(0.0));
    gx1 -= sz1 * (step(0.0, gx1) - 0.5);
    gy1 -= sz1 * (step(0.0, gy1) - 0.5);

    vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
    vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
    vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
    vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
    vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
    vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
    vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
    vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
    g000 *= norm0.x;
    g010 *= norm0.y;
    g100 *= norm0.z;
    g110 *= norm0.w;
    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
    g001 *= norm1.x;
    g011 *= norm1.y;
    g101 *= norm1.z;
    g111 *= norm1.w;

    float n000 = dot(g000, Pf0);
    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
    float n111 = dot(g111, Pf1);

    vec3 fade_xyz = fade(Pf0);
    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
    return 1.0 * n_xyz;
  }

  float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
  }
  
  void main() {
    vUv = uv;
    vPosition = position;
    float slowTime = time * 5.0;

    // vec3 sth = vec3(position.x * 2.0, position.y * 2.0 + slowTime, position.z * 2.0);
    // float noiseValue = noise(sth);

    vec3 p = position;
    
    float noiseFactor = (sin(slowTime * 0.2) * 1.0) + 2.0;
    float noisePower = (cos(slowTime * 0.2 + 0.5) * 0.15) + 0.85;
    
    vec3 p1 = vec3(p.x * 1.0 + slowTime, p.y * 1.0 + slowTime, p.z * 1.0 + slowTime);
    vec3 p2 = vec3(p.x * 2.0 + slowTime, p.y * 2.0 + slowTime, p.z * 2.0 + slowTime);
    vec3 p3 = vec3(p.x * 4.0 + slowTime, p.y * 4.0 + slowTime, p.z * 4.0 + slowTime);
    
    // float noiseValue = 0.0 * noise(p1) + 0.0 * noise(p2) + 0.3 * noise(p3);
    float noiseValue = noisePower * noise(vec3(p.x * noiseFactor + slowTime, p.y * noiseFactor + slowTime, p.z * noiseFactor + slowTime));
    
    test = map(noiseValue, 0.0, 1.0, 0.6, 1.0);
    test = noiseValue - 0.1;
    
    float noiseAmp = map(noiseValue, 0.0, 1.0, 0.8, 1.2);
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position * noiseAmp * 1.5, 1.0);
  }
`;

const fragmentShader = `
  uniform float time;
  varying vec3 vPosition;
  varying vec2 vUv;
  varying float test;

  float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
  }

  void main() {
  	float r = map(test, -0.1, 0.0, 0.6, 1.0);

    r = clamp(r, 0.6, 1.0);

    float g = map(r, 0.6, 1.0, 1.0, 0.6);

    gl_FragColor = vec4(vec3(r, g, g), 1.0);
  }
`;

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
// shiftPass.enabled = false;
composer.addPass(shiftPass);

const mirrorPass = new ShaderPass(mirrorShader);
// mirrorPass.enabled = false;
composer.addPass(mirrorPass);

let time = 0;

function render() {
  // renderer.render(scene, camera);
  composer.render();

  orb.material.uniforms.time.value = time;
  shiftPass.uniforms.time.value = time;
  time += 0.003;

  // orb.rotation.x += 0.01;
  // orb.rotation.y += 0.015;
  // orb.rotation.z += 0.005;

  requestAnimationFrame(render);
}

render();
