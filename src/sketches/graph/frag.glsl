uniform vec2 resolution;

varying vec2 vUv;

void main() {
  float ratio = resolution.x / resolution.y;
  vec2 uv = vUv - 0.5;
  uv.x *= ratio;
  
  float x = uv.x * 5.0;
  float y = uv.y * 5.0;
  
  float s = 0.0;
  
  if( y >= abs(x * 2.0) && pow(x - 1.0, 2.0) + pow(y - 1.0, 2.0) <= 1.0) s = 1.0;
  if( y >= abs(x * 0.5) && pow(x + 1.0, 2.0) + pow(y - 1.0, 2.0) <= 1.0) s = 1.0;
  if(-y >= abs(x * 0.5) && pow(x - 1.0, 2.0) + pow(y + 1.0, 2.0) <= 1.0) s = 1.0;
  if(-y >= abs(x * 2.0) && pow(x + 1.0, 2.0) + pow(y + 1.0, 2.0) <= 1.0) s = 1.0;
  
  gl_FragColor = vec4(s, s, s, 1.0);
}