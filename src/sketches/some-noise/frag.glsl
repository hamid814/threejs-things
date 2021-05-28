#pragma glslify: noise = require(../../glsl-util/perlin/3d)

uniform float uTime;
uniform float ratio;

varying vec2 vUv;

void main() {
  vec2 ratioUv = vUv;
  ratioUv.x *= ratio;
  float shiftRatio = ratio / 2.0 - 0.5;
  ratioUv.x -= shiftRatio;
  
  float time = uTime * 3.0;
  
  vec2 rUv = ratioUv * 8.0 + 2.0;
  vec2 gUv = ratioUv * 8.0 + 0.0;
  vec2 bUv = ratioUv * 8.0 - 2.0;
  
  float r = 1.0 - smoothstep(0.0, 0.08, noise(vec3(rUv, time)));
  float g = 1.0 - smoothstep(0.0, 0.08, noise(vec3(bUv, time)));
  float b = 1.0 - smoothstep(0.0, 0.08, noise(vec3(gUv, time)));
  
  gl_FragColor = vec4(r, g, b, 1.0);
}