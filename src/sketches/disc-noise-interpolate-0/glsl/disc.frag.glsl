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

  vec2 noiseUV = ratioUV / 0.3;

  float noiseN5 = noise(vec3(noiseUV.x, noiseUV.y, timeN5)) * 1.16 + 0.65;
  float noiseN4 = noise(vec3(noiseUV.x, noiseUV.y, timeN4)) * 1.16 + 0.65;
  float noiseN3 = noise(vec3(noiseUV.x, noiseUV.y, timeN3)) * 1.16 + 0.65;
  float noiseN2 = noise(vec3(noiseUV.x, noiseUV.y, timeN2)) * 1.16 + 0.65;
  float noiseN1 = noise(vec3(noiseUV.x, noiseUV.y, timeN1)) * 1.16 + 0.65;

  float noiseP1 = noise(vec3(noiseUV.x, noiseUV.y, timeP1)) * 1.16 + 0.65;
  float noiseP2 = noise(vec3(noiseUV.x, noiseUV.y, timeP2)) * 1.16 + 0.65;
  float noiseP3 = noise(vec3(noiseUV.x, noiseUV.y, timeP3)) * 1.16 + 0.65;
  float noiseP4 = noise(vec3(noiseUV.x, noiseUV.y, timeP4)) * 1.16 + 0.65;
  float noiseP5 = noise(vec3(noiseUV.x, noiseUV.y, timeP5)) * 1.16 + 0.65;

  float b1 = smoothstep(0.0, 1.0, abs(sin(distance(ratioUV, vec2(0.5)) * 70.0) - noiseN1));
  float b2 = smoothstep(0.0, 1.0, abs(sin(distance(ratioUV, vec2(0.5)) * 70.0) - noiseN2));
  float b3 = smoothstep(0.0, 1.0, abs(sin(distance(ratioUV, vec2(0.5)) * 70.0) - noiseN3));
  float b4 = smoothstep(0.0, 1.0, abs(sin(distance(ratioUV, vec2(0.5)) * 70.0) - noiseN4));
  float b5 = smoothstep(0.0, 1.0, abs(sin(distance(ratioUV, vec2(0.5)) * 70.0) - noiseN5));

  float r1 = smoothstep(0.0, 1.0, abs(sin(distance(ratioUV, vec2(0.5)) * 70.0) - noiseP1));
  float r2 = smoothstep(0.0, 1.0, abs(sin(distance(ratioUV, vec2(0.5)) * 70.0) - noiseP2));
  float r3 = smoothstep(0.0, 1.0, abs(sin(distance(ratioUV, vec2(0.5)) * 70.0) - noiseP3));
  float r4 = smoothstep(0.0, 1.0, abs(sin(distance(ratioUV, vec2(0.5)) * 70.0) - noiseP4));
  float r5 = smoothstep(0.0, 1.0, abs(sin(distance(ratioUV, vec2(0.5)) * 70.0) - noiseP5));

  float r = r1 / 5.0 + r2 / 5.0 + r3 / 5.0 + r4 / 5.0 + r5 / 5.0; 

  float b = b1 / 5.0 + b2 / 5.0 + b3 / 5.0 + b4 / 5.0 + b5 / 5.0; 

  gl_FragColor = vec4(r, 1.0 - step(r + b, 1.0), b, 1.0);
  gl_FragColor = vec4(r + b, r + b, r + b, 1.0);
}