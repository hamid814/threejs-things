uniform vec3 camPos;
uniform vec2 resolution;
uniform vec2 mouse;

float morphPower = 0.9;
float refractionPower = 0.77;
float lightChannelDelta = 0.02;

struct Scene {
  vec3 outerSize;
  float outerRadius;
  vec3 innerSize;
  float innerRadius;

  vec3 light[2];
  vec3 projectedLight[2];
} scene;

mat4 rotateBox(in vec3 v, in float angle) {
  float s = sin(angle);
  float c = cos(angle);
  float ic = 1. - c;

  return mat4(v.x * v.x * ic + c, v.y * v.x * ic - s * v.z, v.z * v.x * ic + s * v.y, 0., v.x * v.y * ic + s * v.z, v.y * v.y * ic + c, v.z * v.y * ic - s * v.x, 0., v.x * v.z * ic - s * v.y, v.y * v.z * ic + s * v.x, v.z * v.z * ic + c, 0., 0., 0., 0., 1.);
}

vec3 ptransform(in mat4 mat, in vec3 v) {
  return (mat * vec4(v, 1.)).xyz;
}

vec3 ntransform(in mat4 mat, in vec3 v) {
  return (mat * vec4(v, 0.)).xyz;
}

/**
 * https://iquilezles.org/www/articles/intersectors/intersectors.htm
 * Thank you, Inigo Quilez!
 */

float plaIntersect(in vec3 ro, in vec3 rd, in vec4 p) {
  return -(dot(ro, p.xyz) + p.w) / dot(rd, p.xyz);
}

// vec2 boxIntersection( vec3 ro, vec3 rd, vec3 boxSize, out vec3 outNormal ) 
float boxIntersection(vec3 ro, vec3 rd, vec3 boxSize) {
  vec3 m = 1.0 / rd; // can precompute if traversing a set of aligned boxes
  vec3 n = m * ro;   // can precompute if traversing a set of aligned boxes
  vec3 k = abs(m) * boxSize;
  vec3 t1 = -n - k;
  vec3 t2 = -n + k;
  float tN = max(max(t1.x, t1.y), t1.z);
  float tF = min(min(t2.x, t2.y), t2.z);
  if(tN > tF || tF < 0.0)
    return 0.; // no intersection
    // outNormal = -sign(rdd)*step(t1.yzx,t1.xyz)*step(t1.zxy,t1.xyz);
  return 1.;
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

float roundedboxIntersectModified(in vec3 rayOrigin, in vec3 rayDirection, in vec3 size, in float rad) {
  // bounding box
  vec3 m = 1. / rayDirection;
  vec3 n = m * rayOrigin;
  vec3 k = abs(m) * (size + rad);
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

  t = capIntersect(ro, rd, vec3(size.x, -size.y, size.z), vec3(size.x, size.y, size.z), rad);
  t = min(t, capIntersect(ro, rd, vec3(size.x, size.y, -size.z), vec3(size.x, size.y, size.z), rad));
  t = min(t, capIntersect(ro, rd, vec3(-size.x, size.y, size.z), vec3(size.x, size.y, size.z), rad));

  return t;
}

float rand(vec2 n) {
  return fract(sin(dot(n, vec2(12.9898, 4.1414))));
}

// normal of a rounded box
vec3 roundedboxNormal(in vec3 pos, in vec3 siz, in float rad) {
  return normalize(sign(pos) * max(abs(pos) - siz, 0.));
    // return normalize(sign(pos) * max(abs(pos) - siz, 0.) + rand(vec2(pos.x, pos.y * pos.z)) * .0006 - .0003);
}

vec4 rayFromOutside = vec4(0., 1., 1., 0.);
vec4 rayFromInside = vec4(10., -1., 0., 1.);

float traceOuter1(vec3 rayOrigin, vec3 rayDirection, float eta, vec4 sign) {
  rayDirection = normalize(rayDirection);
  float power = 0.;
  float d = roundedboxIntersectModified(rayOrigin, rayDirection, scene.outerSize, scene.outerRadius);
  if(d < 1e14) {
    vec3 pos = rayOrigin + rayDirection * d;
    vec3 nor = -roundedboxNormal(pos, scene.outerSize, scene.outerRadius);

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

float traceOuter2(vec3 rayOrigin, vec3 rayDirection, float eta, vec4 sign) {
  rayDirection = normalize(rayDirection);
  float power = 0.;
  float d = roundedboxIntersectModified(rayOrigin, rayDirection, scene.outerSize, scene.outerRadius);
  if(d < 1e14) {
    vec3 pos = rayOrigin + rayDirection * d;
    vec3 nor = -roundedboxNormal(pos, scene.outerSize, scene.outerRadius);

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

    power += traceOuter1(pos + rayFromInside.x * reflection, -reflection, eta, rayFromInside) * 0.8;
  }
  return power;
}
float traceOuter3(vec3 rayOrigin, vec3 rayDirection, float eta, vec4 sign) {
  rayDirection = normalize(rayDirection);
  float power = 0.;
  float d = roundedboxIntersectModified(rayOrigin, rayDirection, scene.outerSize, scene.outerRadius);
  if(d < 1e14) {
    vec3 pos = rayOrigin + rayDirection * d;
    vec3 nor = -roundedboxNormal(pos, scene.outerSize, scene.outerRadius);

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

    power += traceOuter2(pos + rayFromInside.x * reflection, -reflection, eta, rayFromInside) * 0.8;
  }
  return power;
}
float traceOuter4(vec3 rayOrigin, vec3 rayDirection, float eta, vec4 sign) {
  rayDirection = normalize(rayDirection);
  float power = 0.;
  float d = roundedboxIntersectModified(rayOrigin, rayDirection, scene.outerSize, scene.outerRadius);
  if(d < 1e14) {
    vec3 pos = rayOrigin + rayDirection * d;
    vec3 nor = -roundedboxNormal(pos, scene.outerSize, scene.outerRadius);

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

    power += traceOuter3(pos + rayFromInside.x * reflection, -reflection, eta, rayFromInside) * 0.8;
  }
  return power;
}
float traceOuter5(vec3 rayOrigin, vec3 rayDirection, float eta, vec4 sign) {
  rayDirection = normalize(rayDirection);
  float power = 0.;
  float d = roundedboxIntersectModified(rayOrigin, rayDirection, scene.outerSize, scene.outerRadius);
  if(d < 1e14) {
    vec3 pos = rayOrigin + rayDirection * d;
    vec3 nor = -roundedboxNormal(pos, scene.outerSize, scene.outerRadius);

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

    power += traceOuter4(pos + rayFromInside.x * reflection, -reflection, eta, rayFromInside) * 0.8;
  }
  return power;
}
vec3 trace(vec3 rayOrigin, vec3 rayDirection) {
  rayDirection = normalize(rayDirection);
  vec3 power = vec3(0., 0., 0.);
  float d = roundedboxIntersectModified(rayOrigin, rayDirection, scene.outerSize, scene.outerRadius);
  if(d < 1e14) {
    vec3 pos = rayOrigin + rayDirection * d;
    vec3 nor = roundedboxNormal(pos, scene.outerSize, scene.outerRadius);

    float refractionPowerR = refractionPower + lightChannelDelta;
    float refractionPowerB = refractionPower - lightChannelDelta;
    vec3 refractionR = refract(rayDirection, nor, refractionPowerR);
    vec3 refractionG = refract(rayDirection, nor, refractionPower);
    vec3 refractionB = refract(rayDirection, nor, refractionPowerB);

    power.r += traceOuter5(pos + refractionR * rayFromInside.x, -refractionR, refractionPowerR, rayFromInside);
    power.g += traceOuter5(pos + refractionG * rayFromInside.x, -refractionG, refractionPower, rayFromInside);
    power.b += traceOuter5(pos + refractionB * rayFromInside.x, -refractionB, refractionPowerB, rayFromInside);

    power.r = traceOuter5(pos + refractionR * rayFromInside.x, -refractionR, refractionPowerR, rayFromInside);
    power.g = traceOuter5(pos + refractionG * rayFromInside.x, -refractionG, refractionPower, rayFromInside);
    power.b = traceOuter5(pos + refractionB * rayFromInside.x, -refractionB, refractionPowerB, rayFromInside);

  }
  return power;
}

void main() {
  float innerFactor = mix(.5, .375, morphPower);
  scene.outerSize = vec3(morphPower);
  scene.outerRadius = 1. - morphPower;
  scene.innerSize = vec3(scene.outerRadius * innerFactor);
  scene.innerRadius = morphPower * innerFactor;

  vec3 power = vec3(0.);

  vec3 rayOrigin = camPos;
  vec3 ww = normalize(-rayOrigin);
  vec3 uu = normalize(cross(ww, vec3(0., 1., 0.)));
  vec3 vv = cross(uu, ww);

  scene.light[0] = vec3(.2, 2., -.8);
  scene.light[1] = vec3(.2, -2., -.8);
  vec3 dir;

  scene.light[0] = scene.light[0].x * uu + scene.light[0].y * vv + scene.light[0].z * ww;
  dir = normalize(-scene.light[0]);
  scene.projectedLight[0] = scene.light[0] + dir * roundedboxIntersectModified(scene.light[0], dir, scene.outerSize, scene.outerRadius);

  scene.light[1] = scene.light[1].x * uu + scene.light[1].y * vv + scene.light[1].z * ww;
  dir = normalize(-scene.light[1]);
  scene.projectedLight[1] = scene.light[1] + dir * roundedboxIntersectModified(scene.light[1], dir, scene.outerSize, scene.outerRadius);

  vec2 p = (2. * gl_FragCoord.xy - resolution) / resolution.y;

  vec3 rayDirection = normalize(p.x * uu + p.y * vv + 3. * ww);

  power += trace(rayOrigin, rayDirection);

  power = clamp(power, 0., 1.);

  gl_FragColor = vec4(power, 1.);
}