#define MAX_STEPS 100
#define MAX_DIST 100.
#define SURF_DIST 0.001
#define IOR 1.45
#define RFL_STEPS 3

uniform vec3 camPos;
uniform vec2 resolution;

vec3[2] lights;

float sdBox(vec3 point) {
  point = abs(point) - vec3(1.0);

  float morphAmount = 0.1;
  return length(max(point, 0.)) + min(max(point.x, max(point.y, point.z)), 0.) - morphAmount;
}

float getDist(vec3 point) {
  float box = sdBox(point);

  return box;
}

float rayMarch(vec3 ro, vec3 rd, float sign) {
  float d = 0.0;

  for(int i = 0; i < MAX_STEPS; i++) {
    vec3 p = ro + rd * d;
    float dist = getDist(p) * sign;
    d += dist;
    if(d > MAX_DIST || abs(dist) < SURF_DIST) {
      break;
    }
  }

  return d;
}

vec3 getNormal(vec3 point) {
  float d = getDist(point);
  vec2 e = vec2(.001, 0);

  vec3 n = d - vec3(getDist(point - e.xyy), getDist(point - e.yxy), getDist(point - e.yyx));

  return normalize(n);
}

void rotateLights(vec3 rayOrigin, vec3 camRight, vec3 camUp, vec3 camForward) {
  lights[0] = rayOrigin + lights[0].x * camRight + lights[0].y * camUp + lights[0].z * camForward;
  lights[1] = rayOrigin + lights[1].x * camRight + lights[1].y * camUp + lights[1].z * camForward;
}

float getDiff(vec3 point, vec3 normal) {
  return max(0.0, dot(normalize(lights[0] - point), normal));
}

float getLight(vec3 origin, vec3 direction) {
  float power = 0.0;

  vec3 point;
  vec3 nor;
  float dist;
  vec3 dir;
  float light;

  // get the point inside
  dist = rayMarch(origin, direction, -1.0);
  point = origin + direction * dist;

  // get normal
  nor = -getNormal(point);

  // get light
  light = max(0.0, dot(normalize(lights[0] - point), nor));
  power += smoothstep(0.98, 1.0, light);
  // power += step(0.98, light);

  // reflect
  dir = reflect(direction, nor);
  dir = normalize(dir);
  point += dir * 0.1;

  // get the point
  dist = rayMarch(point, dir, -1.0);
  point = point + dir * dist;

  // get normal
  nor = -getNormal(point);

  // get light
  light = max(0.0, dot(normalize(lights[0] - point), nor));
  power += smoothstep(0.96, 1.0, light);

  // reflect
  dir = reflect(dir, nor);
  dir = normalize(dir);
  point += dir * 0.1;

  //get point
  dist = rayMarch(point, dir, -1.0);
  point = point + dir * dist;

  // get normal
  nor = -getNormal(point);

  // get light
  light = max(0.0, dot(normalize(lights[0] - point), nor));
  power += smoothstep(0.96, 1.0, light);

  // reflect
  dir = reflect(dir, nor);
  dir = normalize(dir);
  point += dir * 0.1;

  //get point
  dist = rayMarch(point, dir, -1.0);
  point = point + dir * dist;

  // get normal
  nor = -getNormal(point);

  // get light
  light = max(0.0, dot(normalize(lights[0] - point), nor));
  power += smoothstep(0.96, 1.0, light);

  return power;
}

void main() {
  vec2 uv = (2. * gl_FragCoord.xy - resolution) / resolution.y;
  uv *= 0.5;

  vec3 power = vec3(0.);

  vec3 rayOrigin = camPos;
  vec3 camForward = normalize(vec3(0.) - camPos);
  vec3 camRight = normalize(cross(camForward, vec3(0., 1., 0.)));
  vec3 camUp = normalize(cross(camRight, camForward));

  lights[0] = vec3(-0.2, 1.5, 0.0);
  lights[1] = vec3(0.2, -1.6, 0.0);

  rotateLights(rayOrigin, camRight, camUp, camForward);

  vec3 rayDirection = uv.x * camRight + uv.y * camUp + camForward;

  float dist = rayMarch(rayOrigin, rayDirection, 1.0);

  if(dist < MAX_DIST) {
    vec3 point = rayOrigin + rayDirection * dist;
    vec3 normal = getNormal(point);

    vec3 rfrR = refract(rayDirection, normal, 1.0 / IOR - 0.02);
    vec3 rfrG = refract(rayDirection, normal, 1.0 / IOR);
    vec3 rfrB = refract(rayDirection, normal, 1.0 / IOR + 0.02);

    float lightR = getLight(point + rfrR, rfrR);
    // float lightG = getLight(point + rfrG, rfrG);
    // float lightB = getLight(point + rfrB, rfrB);

    power += lightR;
    // power.g += lightG;
    // power.b += lightB;

    // power += getDiff(point, normal);
  }

  power = clamp(power, 0.0, 1.0);

  gl_FragColor = vec4(power, 1.0);
}