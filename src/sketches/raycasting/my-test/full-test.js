import helpers from './full-helpers';

export default /* glsl */ `
#define MAX_STEPS 100
#define MAX_DIST 100.
#define SURF_DIST .001

uniform vec2 resolution;

varying vec2 vUv;

float refractionPower = 0.77;
float lightChannelDelta = 0.02;
float morphPower = 0.999;
vec3[2] lights;
vec3[2] projectedLights;

struct Scene {
  vec3 outerSize;
  float outerRadius;
  vec3 light[2];
  vec3 projectedLight[2];
  mat4 localToWorld;
  mat4 worldToLocal;
} scene;

${helpers}

float sdBox(vec3 point, vec3 position, vec3 size) {
  point = abs(point) - size;
  float morphAmount = 0.2;
  return length(max(point, 0.))+min(max(point.x, max(point.y, point.z)), 0.) - morphAmount;
}

float sdSphere( vec3 p, float s )
{
  return length( p ) - s;
}

float getDist(vec3 point) {
  float box = sdBox(point, vec3(0.), vec3(1.));
  // float s = sdSphere(point, 1.0);

  return box;
}

float rayMarch(vec3 ro, vec3 rd, float sign) {
  float dO=0.;
    
  for(int i=0; i<MAX_STEPS; i++) {
    vec3 p = ro + rd*dO;
      float dS = getDist(p) * sign;
      dO += dS;
      if(dO>MAX_DIST || abs(dS)<SURF_DIST) break;
  }
    
  return dO;
}

vec3 getNormal(vec3 point) {
  float d = getDist(point);
  vec2 e = vec2(.001, 0);
  
  vec3 n = d - vec3(
      getDist(point - e.xyy),
      getDist(point - e.yxy),
      getDist(point - e.yyx));
  
  return normalize(n);
}

vec3 getRayDir(vec2 uv, vec3 p, vec3 l, float z) {
  vec3 f = normalize(l-p),
      r = normalize(cross(vec3(0,1,0), f)),
      u = cross(f,r),
      c = f*z,
      i = c + -uv.x*r + uv.y*u,
      d = normalize(i);
  return d;
}

vec4 rayFromInside = vec4(10., -1., 0., 1.);

float traceOuter1(vec3 rayOrigin, vec3 rayDirection, float eta) {
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

float traceOuter2(vec3 rayOrigin, vec3 rayDirection, float eta) {
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

    power += traceOuter1(pos + rayFromInside.x * reflection, -reflection, eta) * 0.8;
  }

  return power;
}

float traceOuter3(vec3 rayOrigin, vec3 rayDirection, float eta) {
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

    power += traceOuter2(pos + rayFromInside.x * reflection, -reflection, eta) * 0.8;
  }
  return power;
}

float traceOuter4(vec3 rayOrigin, vec3 rayDirection, float eta) {
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

    power += traceOuter3(pos + rayFromInside.x * reflection, -reflection, eta) * 0.8;
  }
  return power;
}

float traceOuter5(vec3 rayOrigin, vec3 rayDirection, float eta) {
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

    power += traceOuter4(pos + rayFromInside.x * reflection, -reflection, eta) * 0.8;
  }
  return power;
}

vec3 trace(vec3 rayOrigin, vec3 rayDirection) {
  // rayDirection = normalize(rayDirection);
  vec3 power = vec3(0., 0., 0.);
  // float d = roundedboxIntersectModified(rayOrigin, rayDirection, scene.outerSize, scene.outerRadius);
  float d = rayMarch(rayOrigin, rayDirection, 1.0);
  
  if(d < MAX_DIST) {
    // vec3 pos = rayOrigin + rayDirection * d;
    // // vec3 nor = roundedboxNormal(pos, scene.outerSize, scene.outerRadius);
    // vec3 nor = getNormal(pos);

    // float refractionPowerR = refractionPower + lightChannelDelta;
    // float refractionPowerB = refractionPower - lightChannelDelta;
    // vec3 refractionR = refract(rayDirection, nor, refractionPowerR);
    // vec3 refractionG = refract(rayDirection, nor, refractionPower);
    // vec3 refractionB = refract(rayDirection, nor, refractionPowerB);

    // power.r = traceOuter5(pos + refractionR * rayFromInside.x, -refractionR, refractionPowerR);
    // power.g = traceOuter5(pos + refractionG * rayFromInside.x, -refractionG, refractionPower);
    // power.b = traceOuter5(pos + refractionB * rayFromInside.x, -refractionB, refractionPowerB);

    power += 1.0;
  }

  return power;
}

uniform vec3 camPos;

// void main() {
//   scene.localToWorld = rotateBox(normalize(vec3(0., 0., 1.)), 0.7853981633974483);
//   scene.worldToLocal = inverse(scene.localToWorld);

//   scene.outerSize = vec3(morphPower);
//   scene.outerRadius = 1. - morphPower;

//   float ratio = resolution.x / resolution.y;
//   vec2 uv = vUv - 0.5;
//   uv.x *= ratio;

//   vec3 power = vec3(0.);

//   // vec3 rayOrigin = cameraPosition;
//   vec3 rayOrigin = camPos;
//   vec3 ww = normalize(-rayOrigin);
//   vec3 uu = normalize(cross(ww, vec3(0., 1., 0.)));
//   vec3 vv = cross(uu, ww);

//   vec3 rayOriginLocal = ptransform(scene.worldToLocal, rayOrigin);

//   scene.light[0] = vec3(.2, 2., -.8);
//   scene.light[1] = vec3(.2, -2., -.8);
//   vec3 dir;

//   scene.light[0] = scene.light[0].x * uu + scene.light[0].y * vv + scene.light[0].z * ww;
//   scene.light[0] = ptransform(scene.worldToLocal, scene.light[0]);
//   dir = normalize(-scene.light[0]);
//   scene.projectedLight[0] = scene.light[0] + dir * roundedboxIntersectModified(scene.light[0], dir, scene.outerSize, scene.outerRadius);

//   scene.light[1] = scene.light[1].x * uu + scene.light[1].y * vv + scene.light[1].z * ww;
//   scene.light[1] = ptransform(scene.worldToLocal, scene.light[1]);
//   dir = normalize(-scene.light[1]);
//   scene.projectedLight[1] = scene.light[1] + dir * roundedboxIntersectModified(scene.light[1], dir, scene.outerSize, scene.outerRadius);

//   vec2 p = (2. * gl_FragCoord.xy - resolution) / resolution.y;

//   // vec3 rayDirection = normalize(p.x * uu + p.y * vv + 3. * ww);
//   vec3 rayDirection = getRayDir(uv, cameraPosition, vec3(0.), 1.);
//   vec3 rayDirectionLocal = ntransform(scene.worldToLocal, rayDirection);

//   // power += trace(rayOriginLocal, rayDirectionLocal);
//   power += trace(rayOrigin, rayDirection);

//   // if(dot(power, power) == 0.0) power += 1.0;

//   power = clamp(power, 0., 1.);

//   gl_FragColor = vec4(power, 1.);
// }

void main() {
  float ratio = resolution.x / resolution.y;
  vec2 uv = vUv - 0.5;
  uv.x *= ratio;
  
  vec3 power = vec3(0.);

  vec3 ro = camPos;
  vec3 rd = getRayDir(uv, ro, vec3(0.), 1.);

  vec3 ww = normalize(-ro);
  vec3 uu = normalize(cross(ww, vec3(0., 1., 0.)));
  vec3 vv = cross(uu, ww);

  float d = rayMarch(ro, rd, 1.);

  lights[0] = vec3(.2, 2., -.8);
  lights[0] = lights[0].x * uu + lights[0].y * vv + lights[0].z * ww;
  // lights[1] = vec3(.2, -2., -.8);
  lights[1] = getRayDir(vec2(-0.1, -0.2), ro, vec3(0.), 1.);

  vec3 dir;
  dir = normalize(-lights[0]);
  projectedLights[0] = lights[0] + dir * d;
  dir = normalize(-lights[1]);
  scene.projectedLight[1] = lights[1] + dir * d;

  if(d < MAX_DIST) {
    vec3 p = ro + rd * d;
    vec3 n = getNormal(p);

    float diff = dot(n, normalize(lights[0] - p));
    diff = smoothstep(0.96, 1.0, diff);

    power += 1.0;

    power -= diff;
  }

  gl_FragColor = vec4(power, 1.0);
}
`;
