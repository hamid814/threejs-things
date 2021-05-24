#pragma glslify: noise = require(../../../glsl-util/perlin/3d)

uniform float ratio;
uniform float uTime;

varying vec2 vUv;

void main() {
  float time = uTime * 3.0;
  
  vec2 ratioUV = vUv;
  ratioUV.x *= ratio;
  float shiftRatio = ratio / 2.0 - 0.5;
  ratioUV.x -= shiftRatio;

  vec2 noiseUV = ratioUV * 2.0;

  float noiseValue = noise(vec3(noiseUV.x, noiseUV.y, time)) - 0.0;

  float strength = 1.0 - step(abs(distance(ratioUV, vec2(0.5)) - 0.35), 0.05 * noiseValue + 0.025);

  gl_FragColor = vec4(strength, strength, strength, 1.0);
}