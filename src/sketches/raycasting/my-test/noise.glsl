#pragma glslify: noise = require(../../../glsl-util/perlin/2d)

uniform vec3 camPos;
uniform vec2 resolution;
uniform float uTime;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution - 0.5;
  uv.x *= resolution.x / resolution.y;
  float x = uv.x;
  float y = uv.y;

  float s = 0.0;

  if(y == 0.0) {
    s += 1.0;
  }

  float nv = noise(uv * length(camPos));

  if(step(0.2, nv) == 1.0) {
    s += 1.0;
  }

  gl_FragColor = vec4(vec3(s), 1.0);
}