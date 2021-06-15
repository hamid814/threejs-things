#define PI 3.1415926538

#pragma glslify: noise = require(../../glsl-util/perlin/3d)

uniform float uTime;

varying vec2 vUv;
varying float vNoiseR;
varying float vNoiseB;

void main() {
  vUv = uv;

  mat2 sth = mat2(0.0, -1.0, 1.0, 0.0);

  float time = uTime * 3.0;

  float timeStep = 0.04;

  float timeP1 = time + timeStep * 1.0;
  float timeP2 = time + timeStep * 2.0;
  float timeP3 = time + timeStep * 3.0;
  
  float timeN1 = time - timeStep * 1.0;
  float timeN2 = time - timeStep * 2.0;
  float timeN3 = time - timeStep * 3.0;
  
  vec2 continiuosUv = vUv - 0.5;
  continiuosUv.x = abs(continiuosUv.x);
  continiuosUv.y = abs(continiuosUv.y);
  
  vec2 noiseUv = continiuosUv * 4.0;

  vec3 noiseField = vec3(noiseUv.x, noiseUv.y, 0.0);
  
  float r1 = 1.0 - smoothstep(0.0, 1.0, noise(vec3(noiseField + timeP1)));
  float r2 = 1.0 - smoothstep(0.0, 1.0, noise(vec3(noiseField + timeP2)));
  float r3 = 1.0 - smoothstep(0.0, 1.0, noise(vec3(noiseField + timeP3)));

  float b1 = 1.0 - smoothstep(0.0, 1.0, noise(vec3(noiseField + timeN1)));
  float b2 = 1.0 - smoothstep(0.0, 1.0, noise(vec3(noiseField + timeN2)));
  float b3 = 1.0 - smoothstep(0.0, 1.0, noise(vec3(noiseField + timeN3)));

  float r = r1 / 3.0 + r2 / 3.0 + r3 / 3.0;
  float b = b1 / 3.0 + b2 / 3.0 + b3 / 3.0;

  float finaleNoise = r + b;

  vec3 pos = position;

  pos += finaleNoise / 10.0;

  vec4 modelViewPosition = viewMatrix * modelMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * modelViewPosition;

  vNoiseR = r;
  vNoiseB = b;
}