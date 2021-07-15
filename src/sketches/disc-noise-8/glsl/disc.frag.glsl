#pragma glslify: noise = require(../../../glsl-util/perlin/3d)

uniform float ratio;
uniform float uTime;
uniform float noiseFactor;

varying vec2 vUv;

void main() {
  float time = uTime * 5.0;
  float timeStep = 0.08;
  
  float timeN5 = time - 5.0 * timeStep;
  float timeN4 = time - 4.0 * timeStep;
  float timeN3 = time - 3.0 * timeStep;
  float timeN2 = time - 2.0 * timeStep;
  float timeN1 = time - 1.0 * timeStep;
  
  float timeP1 = time + 1.0 * timeStep;
  float timeP2 = time + 2.0 * timeStep;
  float timeP3 = time + 3.0 * timeStep;
  float timeP4 = time + 4.0 * timeStep;
  float timeP5 = time + 5.0 * timeStep;
  
  vec2 ratioUV = vUv;
  ratioUV.x *= ratio;
  float shiftRatio = ratio / 2.0 - 0.5;
  ratioUV.x -= shiftRatio;

  vec2 noiseUV = ratioUV / noiseFactor;

  float noiseN5 = noise(vec3(noiseUV.x, noiseUV.y, timeN5)) * 0.16 + 0.35;
  float noiseN4 = noise(vec3(noiseUV.x, noiseUV.y, timeN4)) * 0.16 + 0.35;
  float noiseN3 = noise(vec3(noiseUV.x, noiseUV.y, timeN3)) * 0.16 + 0.35;
  float noiseN2 = noise(vec3(noiseUV.x, noiseUV.y, timeN2)) * 0.16 + 0.35;
  float noiseN1 = noise(vec3(noiseUV.x, noiseUV.y, timeN1)) * 0.16 + 0.35;

  float noiseP1 = noise(vec3(noiseUV.x, noiseUV.y, timeP1)) * 0.16 + 0.35;
  float noiseP2 = noise(vec3(noiseUV.x, noiseUV.y, timeP2)) * 0.16 + 0.35;
  float noiseP3 = noise(vec3(noiseUV.x, noiseUV.y, timeP3)) * 0.16 + 0.35;
  float noiseP4 = noise(vec3(noiseUV.x, noiseUV.y, timeP4)) * 0.16 + 0.35;
  float noiseP5 = noise(vec3(noiseUV.x, noiseUV.y, timeP5)) * 0.16 + 0.35;

  float b1 = 1.0 - step(abs(distance(ratioUV, vec2(0.5)) - noiseN1), 0.08);
  float b2 = 1.0 - step(abs(distance(ratioUV, vec2(0.5)) - noiseN2), 0.08);
  float b3 = 1.0 - step(abs(distance(ratioUV, vec2(0.5)) - noiseN3), 0.08);
  float b4 = 1.0 - step(abs(distance(ratioUV, vec2(0.5)) - noiseN4), 0.08);
  float b5 = 1.0 - step(abs(distance(ratioUV, vec2(0.5)) - noiseN5), 0.08);

  float r1 = 1.0 - step(abs(distance(ratioUV, vec2(0.5)) - noiseP1), 0.08);
  float r2 = 1.0 - step(abs(distance(ratioUV, vec2(0.5)) - noiseP2), 0.08);
  float r3 = 1.0 - step(abs(distance(ratioUV, vec2(0.5)) - noiseP3), 0.08);
  float r4 = 1.0 - step(abs(distance(ratioUV, vec2(0.5)) - noiseP4), 0.08);
  float r5 = 1.0 - step(abs(distance(ratioUV, vec2(0.5)) - noiseP5), 0.08);

  float r = r1 / 5.0 + r2 / 5.0 + r3 / 5.0 + r4 / 5.0 + r5 / 5.0; 

  float b = b1 / 5.0 + b2 / 5.0 + b3 / 5.0 + b4 / 5.0 + b5 / 5.0; 

  gl_FragColor = vec4(r, 1.0 - step(r + b, 1.0), b, 1.0);
  gl_FragColor = vec4(r5, 1.0 - step(r5 + b1, 1.0), b1, 1.0);
}