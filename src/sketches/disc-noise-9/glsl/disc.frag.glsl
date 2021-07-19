#pragma glslify: noise = require(../../../glsl-util/perlin/3d)

uniform float ratio;
uniform float uTime;
uniform float noiseFactor;

varying vec2 vUv;

void main() {
  float time = uTime * 5.0;
  float timeStep = 0.08;
  
  float timeN3 = time - 3.0 * timeStep;
  float timeN2 = time - 2.0 * timeStep;
  float timeN1 = time - 1.0 * timeStep;
  
  float timeP1 = time + 1.0 * timeStep;
  float timeP2 = time + 2.0 * timeStep;
  float timeP3 = time + 3.0 * timeStep;
  
  vec2 ratioUV = vUv;
  ratioUV.x *= ratio;
  float shiftRatio = ratio / 2.0 - 0.5;
  ratioUV.x -= shiftRatio;

  vec2 noiseUV = ratioUV / 0.02;

  float noiseN3 = noise(vec3(noiseUV.x, noiseUV.y, timeN3)) * 1.16 + 0.35;
  float noiseN2 = noise(vec3(noiseUV.x, noiseUV.y, timeN2)) * 1.16 + 0.35;
  float noiseN1 = noise(vec3(noiseUV.x, noiseUV.y, timeN1)) * 1.16 + 0.35;

  float noiseP1 = noise(vec3(noiseUV.x, noiseUV.y, timeP1)) * 1.16 + 0.35;
  float noiseP2 = noise(vec3(noiseUV.x, noiseUV.y, timeP2)) * 1.16 + 0.35;
  float noiseP3 = noise(vec3(noiseUV.x, noiseUV.y, timeP3)) * 1.16 + 0.35;

  float b1 = 1.0 - step(abs(sin(distance(ratioUV, vec2(0.5)) * 70.0) - noiseN1), 0.58);
  float b2 = 1.0 - step(abs(sin(distance(ratioUV, vec2(0.5)) * 70.0) - noiseN2), 0.58);
  float b3 = 1.0 - step(abs(sin(distance(ratioUV, vec2(0.5)) * 70.0) - noiseN3), 0.58);

  float r1 = 1.0 - step(abs(sin(distance(ratioUV, vec2(0.5)) * 70.0) - noiseP1), 0.58);
  float r2 = 1.0 - step(abs(sin(distance(ratioUV, vec2(0.5)) * 70.0) - noiseP2), 0.58);
  float r3 = 1.0 - step(abs(sin(distance(ratioUV, vec2(0.5)) * 70.0) - noiseP3), 0.58);

  float r = r1 / 3.0 + r2 / 3.0 + r3 / 3.0; 

  float b = b1 / 3.0 + b2 / 3.0 + b3 / 3.0; 

  gl_FragColor = vec4(r, 1.0 - step(r + b, 1.0), b, 1.0);
}