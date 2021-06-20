#define MAX_STEPS 100
#define MAX_DIST 100.
#define SURF_DIST .001
#define IOR 1.45
#define LCD 0.1 // light channel delta

uniform vec3 camPos;
uniform vec2 resolution;
uniform float uTime;

varying vec2 vUv;

// sphere
vec3 spherePos = vec3(0.0, 0.0, 0.0);
float sphereRadius = 1.0;
// box
vec3 box1Pos = vec3(0.0, 0.0, 0.0);
vec3 box1Size = vec3(1.0, 1.0, 1.0);
vec3 box2Pos = vec3(3.0, 0.0, 0.0);
vec3 box2Size = vec3(1.0, 1.0, 1.0);
vec3 box3Pos = vec3(0.0, 3.0, 0.0);
vec3 box3Size = vec3(1.0, 1.0, 1.0);
vec3 box4Pos = vec3(0.0, 0.0, 3.0);
vec3 box4Size = vec3(1.0, 1.0, 1.0);
// light
vec3 lightPos = vec3(5.0, 0.0, 10.0);

mat2 Rot(float a) {
  float s = sin(a), c = cos(a);
  return mat2(c, -s, s, c);
}

float sdSphere(vec3 p) {
  float sphereDist = length(p - spherePos) - sphereRadius;

  return sphereDist;
}

float sdPlane(vec3 p) {
  // p.xz *= Rot(uTime);
  float d = dot(p, normalize(vec3(0.0, 0.0, 1.0)));

  return d;
}

float sdBox(vec3 p, vec3 position, vec3 size) {
  // p.xz *= Rot(uTime / 3.0);
  // p.xy *= Rot(3.14 * 0.25);
  // p.zy *= Rot(3.14 * 0.25);
  p -= position;
  p = abs(p) - size;
  float morphAmount = 0.3;
  return length(max(p, 0.)) + min(max(p.x, max(p.y, p.z)), 0.) - morphAmount;
}

float GetDist(vec3 p) {
  float box1Dist = sdBox(p, box1Pos, box1Size);
  float box2Dist = sdBox(p, box2Pos, box2Size);
  float box3Dist = sdBox(p, box3Pos, box3Size);
  float box4Dist = sdBox(p, box4Pos, box4Size);
  // bd = abs(bd) - 0.2;
  // float sd = sdSphere(p);
  float pd = sdPlane(p);

  float boxDist = min(box4Dist, min(box3Dist, min(box1Dist, box2Dist)));
  box1Dist = abs(box1Dist) - 0.05;
  return max(box1Dist, pd);
  // return min(box1Dist, MAX_DIST);
  // return max(bd, pd);
}

float RayMarch(vec3 ro, vec3 rd, float inside) {
  float dO = 0.;

  for(int i = 0; i < MAX_STEPS; i++) {
    vec3 p = ro + rd * dO;
    float dS = GetDist(p) * inside;
    dO += dS;
    if(dO > MAX_DIST || abs(dS) < SURF_DIST)
      break;
  }

  return dO;
}

vec3 GetNormal(vec3 p) {
  float d = GetDist(p);
  vec2 e = vec2(.001, 0);

  vec3 n = d - vec3(GetDist(p - e.xyy), GetDist(p - e.yxy), GetDist(p - e.yyx));

  return normalize(n);
}

vec3 GetRayDir(vec2 uv, vec3 p, vec3 l, float z) {
  vec3 f = normalize(l - p), r = normalize(cross(vec3(0, 1, 0), f)), u = cross(f, r), c = f * z, i = c + -uv.x * r + uv.y * u, d = normalize(i);
  return d;
}

void main() {
  float ratio = resolution.x / resolution.y;
  vec2 uv = vUv - 0.5;
  uv.x *= ratio;

  vec3 ro = camPos;
  vec3 rd = GetRayDir(uv, camPos, vec3(0., 0., 0.), 1.0);

  // get light behind camera
  vec3 lightDir = GetRayDir(vec2(0.0, -50.5), camPos, vec3(0.0), -1.0);
  lightPos = ro + lightDir * 1.0;

  vec3 color = vec3(0.);

  float d = RayMarch(camPos, rd, 1.0);

  if(d < MAX_DIST) {
    vec3 point = ro + rd * d;
    vec3 normal = GetNormal(point);

      // calc diffuse light
    float dif = dot(normal, normalize(lightPos - point));
    dif = smoothstep(0.95, 1.0, dif);
    dif *= 0.3;

    color += dif;

    // vec3 viewDir = normalize(ro - point);
    // vec3 reflectDir = reflect(lightPos, normal);
    // reflectDir = normalize(reflectDir);
    // float specular = dot(viewDir, -reflectDir);
    // specular = max(0.0, specular);
    // specular = pow(specular, 1024.0);

    // color += specular;
  }

  // color = rd;

  gl_FragColor = vec4(color, 1.0);
}