#pragma glslify: noise = require('../../glsl-util/perlin/3d')

uniform vec2 resolution;
uniform vec2 offset;
uniform float zoom;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution - 0.5;
  uv.x *= resolution.x / resolution.y;

  uv -= offset / 200.0;

  float s = 0.0;

  float nv = noise(vec3(uv * zoom, 0.0));

  s = step(mod(nv * 20.0, 1.0), 0.9);

  gl_FragColor = vec4(vec3(s), 1.0);
}