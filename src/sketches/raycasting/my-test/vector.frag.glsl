varying vec2 vUv;
uniform vec2 resolution;

void main() {
  vec2 uv = vUv - 0.5;
  uv.x *= resolution.x / resolution.y;

  float i = 0.0;
  float n = 0.0;
  float r = 0.0;

  vec2 incident = vec2(0.1, -0.1);
  vec2 normal = vec2(0.0, 1.0) * 0.25;
  // vec2 rfr = refract(normalize(incident), normalize(normal), 0.77);
  vec2 rfr = reflect(normalize(incident), normalize(normal));

  if(normalize(vec2(uv.x, uv.y)) == normalize(incident) && length(vec2(uv.x, uv.y)) <= length(incident)) {
    i = 1.0;
  }
  if(distance(uv, incident) <= 0.007) {
    i = 1.0;
  }

  if(normalize(vec2(uv.x, uv.y)) == normalize(normal) && length(vec2(uv.x, uv.y)) <= length(normal)) {
    n = 1.0;
  }
  if(distance(uv, normal) <= 0.007) {
    n = 1.0;
  }

  if(normalize(vec2(uv.x, uv.y)) == normalize(rfr) && length(vec2(uv.x, uv.y)) <= length(rfr)) {
    r = 1.0;
  }
  if(distance(uv, normalize(rfr) * 0.2) <= 0.007) {
    r = 1.0;
  }

  if(distance(uv, vec2(0.)) <= 0.007) {
    i = 1.0;
    n = 1.0;
    r = 1.0;
  }

  // s = distance(vec2(uv.x, uv.y), vec2(0.0));
  gl_FragColor = vec4(i, n, r, 1.0);
  // gl_FragColor = vec4(vec3(vUv.x), 1.0);
}