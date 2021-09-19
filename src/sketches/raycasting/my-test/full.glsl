#define MAX_STEPS 100
#define MAX_DIST 100.
#define SURF_DIST 0.001

uniform vec3 camPos;
uniform vec2 resolution;
uniform vec2 mouse;

float morphPower = 0.9;
float refractionPower = 0.77;
float lightChannelDelta = 0.02;

vec3 size = vec3(0.9);
float radius = 0.1;

struct Scene {
  vec3 light[2];
  vec3 projectedLight[2];
} scene;

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

float capIntersect(in vec3 ro, in vec3 rd, in vec3 pa, in vec3 pb, in float ra) {
  vec3 ba = pb - pa;
  vec3 oa = ro - pa;
  float baba = dot(ba, ba);
  float bard = dot(ba, rd);
  float baoa = dot(ba, oa);
  float rdoa = dot(rd, oa);
  float oaoa = dot(oa, oa);
  float a = baba - bard * bard;
  float b = baba * rdoa - baoa * bard;
  float c = baba * oaoa - baoa * baoa - ra * ra * baba;
  float h = b * b - a * c;
  if(h >= 0.0) {
    float t = (-b - sqrt(h)) / a;
    float y = baoa + t * bard;
      // body
    if(y > 0.0 && y < baba)
      return t;
      // caps
    vec3 oc = (y <= 0.0) ? oa : ro - pb;
    b = dot(rd, oc);
    c = dot(oc, oc) - ra * ra;
    h = b * b - c;
    if(h > 0.0)
      return -b - sqrt(h);
  }
  return 1e15;
}

float roundedboxIntersectModified(in vec3 rayOrigin, in vec3 rayDirection, in float signIn) {
  // bounding box
  vec3 m = 1. / rayDirection;
  vec3 n = m * rayOrigin;
  vec3 k = abs(m) * (size + radius);
  vec3 t1 = -n - k;
  vec3 t2 = -n + k;
  float tN = max(max(t1.x, t1.y), t1.z);
  float tF = min(min(t2.x, t2.y), t2.z);
  if(tN > tF || tF < 0.0) {
    return 1e15;
  }
  float t = tN;

  // convert to first octant
  vec3 pos = rayOrigin + t * rayDirection;
  vec3 s = sign(pos);
  vec3 ro = rayOrigin * s;
  vec3 rd = rayDirection * s;
  pos *= s;

  // faces
  pos -= size;
  pos = max(pos.xyz, pos.yzx);
  if(min(min(pos.x, pos.y), pos.z) < 0.) {
    return t;
  }

  t = capIntersect(ro, rd, vec3(size.x, -size.y, size.z), vec3(size.x, size.y, size.z), radius);
  t = min(t, capIntersect(ro, rd, vec3(size.x, size.y, -size.z), vec3(size.x, size.y, size.z), radius));
  t = min(t, capIntersect(ro, rd, vec3(-size.x, size.y, size.z), vec3(size.x, size.y, size.z), radius));

  return t;
}

// normal of a rounded box
vec3 roundedboxNormal(in vec3 pos) {
  // return getNormal(pos);
  return normalize(sign(pos) * max(abs(pos) - size, 0.));
}

float traceOuter1(vec3 rayOrigin, vec3 rayDirection, float eta) {
  rayDirection = normalize(rayDirection);
  float power = 0.;
  // float d = roundedboxIntersectModified(rayOrigin, rayDirection, -1.0);
  float d = rayMarch(rayOrigin, rayDirection, -1.0);
  if(d < MAX_DIST) {
    vec3 pos = rayOrigin + rayDirection * d;
    // vec3 nor = -roundedboxNormal(pos);
    vec3 nor = -getNormal(pos);

    rayDirection = -rayDirection;
    vec3 reflection = reflect(rayDirection, nor);
    vec3 refraction = refract(rayDirection, nor, eta);

    vec3 nrefl = normalize(reflection);
    float reflectedLight = smoothstep(.95, 1., dot(normalize(scene.projectedLight[0] - pos), nrefl)) +
      smoothstep(.75, 1., dot(normalize(scene.projectedLight[1] - pos), nrefl));
    power += reflectedLight;

    float refractedLights[2];
    refractedLights[0] = dot(normalize(scene.light[0] - pos), normalize(refraction));
    refractedLights[1] = dot(normalize(scene.light[1] - pos), normalize(refraction));
    float refractedLight = (smoothstep(.0, 1., refractedLights[0]) + smoothstep(.0, 1., refractedLights[1]));
    power += refractedLight;
  }
  return power;
}

float traceOuter2(vec3 rayOrigin, vec3 rayDirection, float eta) {
  rayDirection = normalize(rayDirection);
  float power = 0.;
  // float d = roundedboxIntersectModified(rayOrigin, rayDirection, -1.0);
  float d = rayMarch(rayOrigin, rayDirection, -1.0);
  if(d < MAX_DIST) {
    vec3 pos = rayOrigin + rayDirection * d;
    // vec3 nor = -roundedboxNormal(pos);
    vec3 nor = -getNormal(pos);

    rayDirection = -rayDirection;
    vec3 reflection = reflect(rayDirection, nor);
    vec3 refraction = refract(rayDirection, nor, eta);

    vec3 nrefl = normalize(reflection);
    float reflectedLight = smoothstep(.95, 1., dot(normalize(scene.projectedLight[0] - pos), nrefl)) +
      smoothstep(.75, 1., dot(normalize(scene.projectedLight[1] - pos), nrefl));
    power += reflectedLight;

    float refractedLights[2];
    refractedLights[0] = dot(normalize(scene.light[0] - pos), normalize(refraction));
    refractedLights[1] = dot(normalize(scene.light[1] - pos), normalize(refraction));
    float refractedLight = (smoothstep(.0, 1., refractedLights[0]) + smoothstep(.0, 1., refractedLights[1]));
    power += refractedLight;

    power += traceOuter1(pos + reflection, -reflection, eta) * 0.8;
  }
  return power;
}

float traceOuter3(vec3 rayOrigin, vec3 rayDirection, float eta) {
  rayDirection = normalize(rayDirection);
  float power = 0.;
  // float d = roundedboxIntersectModified(rayOrigin, rayDirection, -1.0);
  float d = rayMarch(rayOrigin, rayDirection, -1.0);
  if(d < MAX_DIST) {
    vec3 pos = rayOrigin + rayDirection * d;
    // vec3 nor = -roundedboxNormal(pos);
    vec3 nor = -getNormal(pos);

    rayDirection = -rayDirection;
    vec3 reflection = reflect(rayDirection, nor);
    vec3 refraction = refract(rayDirection, nor, eta);

    vec3 nrefl = normalize(reflection);
    float reflectedLight = smoothstep(.95, 1., dot(normalize(scene.projectedLight[0] - pos), nrefl)) +
      smoothstep(.75, 1., dot(normalize(scene.projectedLight[1] - pos), nrefl));
    power += reflectedLight;

    float refractedLights[2];
    refractedLights[0] = dot(normalize(scene.light[0] - pos), normalize(refraction));
    refractedLights[1] = dot(normalize(scene.light[1] - pos), normalize(refraction));
    float refractedLight = (smoothstep(.0, 1., refractedLights[0]) + smoothstep(.0, 1., refractedLights[1]));
    power += refractedLight;

    power += traceOuter2(pos + reflection, -reflection, eta) * 0.8;
  }
  return power;
}

float traceOuter4(vec3 rayOrigin, vec3 rayDirection, float eta) {
  rayDirection = normalize(rayDirection);
  float power = 0.;
  // float d = roundedboxIntersectModified(rayOrigin, rayDirection, -1.0);
  float d = rayMarch(rayOrigin, rayDirection, -1.0);
  if(d < MAX_DIST) {
    vec3 pos = rayOrigin + rayDirection * d;
    // vec3 nor = -roundedboxNormal(pos);
    vec3 nor = -getNormal(pos);

    rayDirection = -rayDirection;
    vec3 reflection = reflect(rayDirection, nor);
    vec3 refraction = refract(rayDirection, nor, eta);

    vec3 nrefl = normalize(reflection);
    float reflectedLight = smoothstep(.95, 1., dot(normalize(scene.projectedLight[0] - pos), nrefl)) +
      smoothstep(.75, 1., dot(normalize(scene.projectedLight[1] - pos), nrefl));
    power += reflectedLight;

    float refractedLights[2];
    refractedLights[0] = dot(normalize(scene.light[0] - pos), normalize(refraction));
    refractedLights[1] = dot(normalize(scene.light[1] - pos), normalize(refraction));
    float refractedLight = (smoothstep(.0, 1., refractedLights[0]) + smoothstep(.0, 1., refractedLights[1]));
    power += refractedLight;

    power += traceOuter3(pos + reflection, -reflection, eta) * 0.8;
  }
  return power;
}

float traceOuter5(vec3 rayOrigin, vec3 rayDirection, float eta) {
  rayDirection = normalize(rayDirection);
  float power = 0.;
  // float d = roundedboxIntersectModified(rayOrigin, rayDirection, -1.0);
  float d = rayMarch(rayOrigin, rayDirection, -1.0);
  if(d < MAX_DIST) {
    vec3 pos = rayOrigin + rayDirection * d;
    // vec3 nor = -roundedboxNormal(pos);
    vec3 nor = -getNormal(pos);

    rayDirection = -rayDirection;
    vec3 reflection = reflect(rayDirection, nor);
    vec3 refraction = refract(rayDirection, nor, eta);

    vec3 nrefl = normalize(reflection);
    float reflectedLight = smoothstep(.95, 1., dot(normalize(scene.projectedLight[0] - pos), nrefl)) +
      smoothstep(.75, 1., dot(normalize(scene.projectedLight[1] - pos), nrefl));
    power += reflectedLight;

    float refractedLights[2];
    refractedLights[0] = dot(normalize(scene.light[0] - pos), normalize(refraction));
    refractedLights[1] = dot(normalize(scene.light[1] - pos), normalize(refraction));
    float refractedLight = (smoothstep(.0, 1., refractedLights[0]) + smoothstep(.0, 1., refractedLights[1]));
    power += refractedLight;

    power += traceOuter4(pos + reflection, -reflection, eta) * 0.8;
  }
  return power;
}

float getDiff(vec3 point, vec3 normal) {
  return max(0.0, dot(normalize(scene.light[0] - point), normal));
}

vec3 trace(vec3 rayOrigin, vec3 rayDirection) {
  rayDirection = normalize(rayDirection);
  vec3 power = vec3(0., 0., 0.);
  // float d = roundedboxIntersectModified(rayOrigin, rayDirection, 1.0);
  float d = rayMarch(rayOrigin, rayDirection, 1.0);
  if(d < MAX_DIST) {
    vec3 pos = rayOrigin + rayDirection * d;
    // vec3 nor = roundedboxNormal(pos);
    vec3 nor = getNormal(pos);

    float refractionPowerR = refractionPower + lightChannelDelta;
    float refractionPowerB = refractionPower - lightChannelDelta;
    vec3 refractionR = refract(rayDirection, nor, refractionPowerR);
    vec3 refractionG = refract(rayDirection, nor, refractionPower);
    vec3 refractionB = refract(rayDirection, nor, refractionPowerB);

    power += traceOuter5(pos + refractionR, -refractionR, refractionPowerR);
    // power.g = traceOuter5(pos + refractionG, -refractionG, refractionPower);
    // power.b = traceOuter5(pos + refractionB, -refractionB, refractionPowerB);

    // power += getDiff(pos, nor);
  }
  return power;
}

void rotateLights(vec3 rayOrigin, vec3 camRight, vec3 camUp, vec3 camForward) {
  vec3 dir;

  scene.light[0] = scene.light[0].x * camRight + scene.light[0].y * camUp + scene.light[0].z * camForward;
  dir = normalize(-scene.light[0]);
  // scene.projectedLight[0] = scene.light[0] + dir * roundedboxIntersectModified(scene.light[0], dir, 1.0);
  scene.projectedLight[0] = scene.light[0] + dir * rayMarch(scene.light[0], dir, 1.0);

  scene.light[1] = scene.light[1].x * camRight + scene.light[1].y * camUp + scene.light[1].z * camForward;
  dir = normalize(-scene.light[1]);
  // scene.projectedLight[1] = scene.light[1] + dir * roundedboxIntersectModified(scene.light[1], dir, 1.0);
  scene.projectedLight[1] = scene.light[1] + dir * rayMarch(scene.light[1], dir, 1.0);
}

void main() {
  vec3 power = vec3(0.);

  vec3 rayOrigin = camPos;
  vec3 camForward = normalize(-rayOrigin);
  vec3 camRight = normalize(cross(camForward, vec3(0., 1., 0.)));
  vec3 camUp = cross(camRight, camForward);

  scene.light[0] = vec3(.2, 2., -.8);
  scene.light[1] = vec3(.2, -2., -.8);

  rotateLights(rayOrigin, camRight, camUp, camForward);

  vec2 uv = (2. * gl_FragCoord.xy - resolution) / resolution.y;

  vec3 rayDirection = normalize(uv.x * camRight + uv.y * camUp + 3. * camForward);

  power += trace(rayOrigin, rayDirection);

  power = clamp(power, 0., 1.);

  // power = pow(power, vec3(0.4545));

  gl_FragColor = vec4(power, 1.);
}