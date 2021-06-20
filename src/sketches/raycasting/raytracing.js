import * as THREE from 'three';
import transformFuncs from './transformFuncs';
import lights from './lights';
import tracerFuncs from './tracerFuncs';
import intersectionsFuncs from './intersectionsFuncs';

var v = 9.5;

const vertexShader = /* glsl */ `
    varying vec2 vUv;
    
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
    }
    `;
const fragmentShader = /* glsl */ `
varying vec2 vUv;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float morphPower;
uniform float refractionPower;
uniform float lightChannelDelta;
uniform float angle;

struct Scene {
  vec3 outerSize;
  float outerRadius;
  vec3 innerSize;
  float innerRadius;
  ${lights.declareLights}
  mat4 localToWorld;
  mat4 worldToLocal;
} scene;
      
${transformFuncs} 

${intersectionsFuncs} 
    
${tracerFuncs()}
      
void main() {
  scene.localToWorld = rotateBox(normalize(vec3(0., 0., 1.)), ${
    0.25 * Math.PI
  }); 
  scene.worldToLocal = inverse(scene.localToWorld);

  float innerFactor = mix(.5, .375, morphPower);
  scene.outerSize = vec3(morphPower);
  scene.outerRadius = 1. - morphPower;
  scene.innerSize = vec3(scene.outerRadius * innerFactor);
  scene.innerRadius = morphPower * innerFactor;

  // scene.innerSize = vec3(morphPower * innerFactor);
  // scene.innerRadius = scene.outerRadius * innerFactor;

  vec3 power = vec3(0.);
  
  // vec3 rayOrigin = vec3(${v} * cos(angle), 0., ${v} * sin(angle));
  vec3 rayOrigin = cameraPosition;
  vec3 ww = normalize(-rayOrigin);
  vec3 uu = normalize(cross(ww, vec3(0., 1., 0.)));
  vec3 vv = cross(uu, ww);

  vec3 rayOriginLocal = ptransform(scene.worldToLocal, rayOrigin);

  ${lights.initLights()}
  
  #if AA > 1
    for (int m = 0; m < AA; m++)
    for (int n = 0; n < AA; n++)
    {
    vec2 o = vec2(float(m), float(n)) / float(AA) - .5;
    vec2 p = (2. * (gl_FragCoord.xy + o) - resolution) / resolution.y;
  #else    
    vec2 p = (2. * gl_FragCoord.xy - resolution) / resolution.y;
  #endif
  
    vec3 rayDirection = normalize(p.x * uu + p.y * vv + 3. * ww);
    vec3 rayDirectionLocal = ntransform(scene.worldToLocal, rayDirection);
  
    power += 1.0;
    power -= trace(rayOriginLocal, rayDirectionLocal);
  
    #if AA > 1
  }
  power /= float(AA * AA);
  #endif

  power = clamp(power, 0., 1.);
  
  // power = mix(vec3(1.), power, power);

  gl_FragColor = vec4(power, 1.);
}
`;

const RaytracingMaterial = function (params) {
  const { resolution } = params;

  const shaderMaterial = new THREE.ShaderMaterial({
    defines: { AA: 2 },
    uniforms: {
      refractionPower: { value: 0.77 },
      lightChannelDelta: { value: 0.02 },
      morphPower: { value: 0.95 },
      angle: { value: 0.75 * Math.PI },
      resolution: { value: resolution },
      mouse: { value: new THREE.Vector2(0.61, 0.01) },
    },
    vertexShader,
    fragmentShader,
  });

  return shaderMaterial;
};

export default RaytracingMaterial;
