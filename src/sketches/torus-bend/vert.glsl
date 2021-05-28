#define PI 3.1415926538

#pragma glslify: noise = require(../../glsl-util/perlin/3d)
#pragma glslify: rotate = require(../../glsl-util/rotation/rotate)
#pragma glslify: rotateZ = require(../../glsl-util/rotation/rotateZ)

uniform float uTime;

attribute vec3 aCenter;

varying vec2 vUv;
varying float vTest;

void main() {
  vUv = uv;

  mat2 sth = mat2(0.0, -1.0, 1.0, 0.0);

  float time = uTime * 3.0;
  vec3 center = aCenter;

  vec3 prep = rotateZ(center, PI / 2.0);

  float noiseValue = sin(noise(center * 1.0 + time) * 3.0);

  vec3 pos = position;
  pos -= center;
  pos = rotate(pos, prep, noiseValue * 1.0);
  pos += center;

  vec4 modelViewPosition = viewMatrix * modelMatrix * vec4(pos, 1.0);

  gl_PointSize = 30.0;
  gl_PointSize *= (1.0 / -modelViewPosition.z);

  gl_Position = projectionMatrix * modelViewPosition;

  vTest = center.x;
}