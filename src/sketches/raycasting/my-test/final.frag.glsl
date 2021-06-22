#define MAX_STEPS 100
#define MAX_DIST 100.
#define SURF_DIST .001

uniform vec3 camPos;
uniform vec2 resolution;

vec3[2] lights;

mat2 rotate(float a) {
  float s = sin(a);
  float c = cos(a);
  return mat2(c, s, -s, c);
}

float sdBox(vec3 point, vec3 position, vec3 size) {
  // point.xz *= rotate(uTime / 3.0);
  // point.xy *= rotate(3.1415 * 0.25);
  point += position;
  point = abs(point) - size;
  float morphAmount = 0.2;
  return length(max(point, 0.)) + min(max(point.x, max(point.y, point.z)), 0.) - morphAmount;
}

float sdSphere(vec3 p, float s) {
  return length(p) - s;
}

float getDist(vec3 point) {
  float box = sdBox(point, vec3(0.), vec3(1.));
  // float s = sdSphere(point, 1.0);

  return box;
}

float rayMarch(vec3 ro, vec3 rd, float sign) {
  // rd = normalize(rd);
  float dO = 0.;

  for(int i = 0; i < MAX_STEPS; i++) {
    vec3 p = ro + rd * dO;
    float dS = getDist(p) * sign;
    dO += dS;
    if(dO > MAX_DIST || abs(dS) < SURF_DIST)
      break;
  }

  return dO;
}

vec3 getNormal(vec3 point) {
  float d = getDist(point);
  vec2 e = vec2(.001, 0);

  vec3 n = d - vec3(getDist(point - e.xyy), getDist(point - e.yxy), getDist(point - e.yyx));

  return normalize(n);
}

void main() {
  vec3 power = vec3(0.);

  vec2 uv = gl_FragCoord.xy / resolution - 0.5;
  uv.x *= resolution.x / resolution.y;

  vec3 rayOrigin = camPos;
  vec3 camForward = normalize(vec3(0.) - camPos);
  vec3 camRight = normalize(cross(camForward, vec3(0., 1., 0.)));
  vec3 camUp = normalize(cross(camRight, camForward));

  vec3 rayDirection = uv.x * camRight + uv.y * camUp + camForward;

  lights[0] = vec3(-0.2, 0.8, 0.0);
  lights[1] = vec3(0.2, -0.8, 0.0);

  lights[0] = rayOrigin + lights[0].x * camRight + lights[0].y * camUp + lights[0].z * camForward;
  lights[1] = rayOrigin + lights[1].x * camRight + lights[1].y * camUp + lights[1].z * camForward;

  float dist = rayMarch(rayOrigin, rayDirection, 1.0);

  if(dist < MAX_DIST) {
    vec3 point = rayOrigin + rayDirection * dist;
    vec3 normal = getNormal(point);

    float diff;
    diff = dot(normal, normalize(lights[0] - point));
    diff = smoothstep(0.99, 1.0, diff);
    power += diff;

    diff = dot(normal, normalize(lights[1] - point));
    diff = smoothstep(0.99, 1.0, diff);
    power += diff;

    power += 0.05;
  }

  gl_FragColor = vec4(power, 1.0);
}