#pragma glslify: noise = require(../../../glsl-util/perlin/3d)

uniform float ratio;
uniform float uTime;

varying vec2 vUv;

void main() {
  float time = uTime * 7.0;
  float timeStep = 0.08;

  float timeN5 = time - 5.0 * timeStep;
  float timeN4 = time - 4.0 * timeStep;
  float timeN3 = time - 3.0 * timeStep;
  float timeN2 = time - 2.0 * timeStep;
  float timeN1 = time - 1.0 * timeStep;

  float timeP1 = time + 0.0 * timeStep;
  float timeP2 = time + 1.0 * timeStep;
  float timeP3 = time + 2.0 * timeStep;
  float timeP4 = time + 3.0 * timeStep;
  float timeP5 = time + 4.0 * timeStep;

  vec2 ratioUV = vUv;
  ratioUV.x *= ratio;
  float shiftRatio = ratio / 2.0 - 0.5;
  ratioUV.x -= shiftRatio;

  vec2 noiseUV = ratioUV / 0.4;

  float rad = 0.02;

  float noiseN5 = noise(vec3(noiseUV.x, noiseUV.y, timeN5)) * 0.16 + 1.0 * rad;
  float noiseN4 = noise(vec3(noiseUV.x, noiseUV.y, timeN4)) * 0.16 + 2.0 * rad;
  float noiseN3 = noise(vec3(noiseUV.x, noiseUV.y, timeN3)) * 0.16 + 3.0 * rad;
  float noiseN2 = noise(vec3(noiseUV.x, noiseUV.y, timeN2)) * 0.16 + 4.0 * rad;
  float noiseN1 = noise(vec3(noiseUV.x, noiseUV.y, timeN1)) * 0.16 + 5.0 * rad;

  float noiseP1 = noise(vec3(noiseUV.x, noiseUV.y, timeP1)) * 0.16 + 6.0 * rad;
  float noiseP2 = noise(vec3(noiseUV.x, noiseUV.y, timeP2)) * 0.16 + 7.0 * rad;
  float noiseP3 = noise(vec3(noiseUV.x, noiseUV.y, timeP3)) * 0.16 + 8.0 * rad;
  float noiseP4 = noise(vec3(noiseUV.x, noiseUV.y, timeP4)) * 0.16 + 9.0 * rad;
  float noiseP5 = noise(vec3(noiseUV.x, noiseUV.y, timeP5)) * 0.16 + 10.0 * rad;

  float dist = 0.05;

  float b1 = step(abs(distance(ratioUV, vec2(0.5 + 0.0 * dist, 0.5)) - noiseN1), 0.002);
  float b2 = step(abs(distance(ratioUV, vec2(0.5 + 1.0 * dist, 0.5)) - noiseN2), 0.002);
  float b3 = step(abs(distance(ratioUV, vec2(0.5 + 2.0 * dist, 0.5)) - noiseN3), 0.002);
  float b4 = step(abs(distance(ratioUV, vec2(0.5 + 3.0 * dist, 0.5)) - noiseN4), 0.002);
  float b5 = step(abs(distance(ratioUV, vec2(0.5 + 4.0 * dist, 0.5)) - noiseN5), 0.002);

  float r1 = step(abs(distance(ratioUV, vec2(0.5 - 1.0 * dist, 0.5)) - noiseP1), 0.002);
  float r2 = step(abs(distance(ratioUV, vec2(0.5 - 2.0 * dist, 0.5)) - noiseP2), 0.002);
  float r3 = step(abs(distance(ratioUV, vec2(0.5 - 3.0 * dist, 0.5)) - noiseP3), 0.002);
  float r4 = step(abs(distance(ratioUV, vec2(0.5 - 4.0 * dist, 0.5)) - noiseP4), 0.002);
  float r5 = step(abs(distance(ratioUV, vec2(0.5 - 5.0 * dist, 0.5)) - noiseP5), 0.002);

  float r = r1 / 5.0 + r2 / 5.0 + r3 / 5.0 + r4 / 5.0 + r5 / 5.0;

  float b = b1 / 5.0 + b2 / 5.0 + b3 / 5.0 + b4 / 5.0 + b5 / 5.0;

  // gl_FragColor = vec4(r, 1.0 - step(r + b, 1.0), b, 1.0);

  float s = r1 + r2 + r3 + r4 + r5 + b1 + b2 + b3 + b4 + b5;
  gl_FragColor = vec4(s, s, s, 1.0);
}