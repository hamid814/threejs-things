varying vec2 vUv;

void main() {
  vUv = uv;

  gl_Position = projectionMatrix * modelMatrix * viewMatrix * vec4(position, 1.0);
}