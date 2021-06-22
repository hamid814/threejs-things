import lights from './lights';

const e = 6;
const n = 0.8;

const o = /* glsl */ `
vec4 rayFromOutside = vec4(0., 1., 1., 0.);
vec4 rayFromInside = vec4(10., -1., 0., 1.);
`;

const t = /* glsl */ `vec3 rayOrigin, vec3 rayDirection, float eta, vec4 sign`;

const i = /* glsl */ `
  vec3 trace(vec3 rayOrigin, vec3 rayDirection) {
    rayDirection = normalize(rayDirection);
    vec3 power = vec3(0., 0., 0.);
    float d = roundedboxIntersectModified(rayOrigin, rayDirection, scene.outerSize, scene.outerRadius);
    if (d < 1e14) {
        vec3 pos = rayOrigin + rayDirection * d;
      vec3 nor = roundedboxNormal(pos, scene.outerSize, scene.outerRadius);
      
      float refractionPowerR = refractionPower + lightChannelDelta;
      float refractionPowerB = refractionPower - lightChannelDelta;
      vec3 refractionR = refract(rayDirection, nor, refractionPowerR);
      vec3 refractionG = refract(rayDirection, nor, refractionPower);
      vec3 refractionB = refract(rayDirection, nor, refractionPowerB);

      power.r = traceOuter${
        e - 1
      }(pos + refractionR * rayFromInside.x, -refractionR, refractionPowerR, rayFromInside);
      power.g = traceOuter${
        e - 1
      }(pos + refractionG * rayFromInside.x, -refractionG, refractionPower , rayFromInside);
      power.b = traceOuter${
        e - 1
      }(pos + refractionB * rayFromInside.x, -refractionB, refractionPowerB, rayFromInside);
    }
  return power;
}
`;
const c = function (e) {
  return /* glsl */ `
  float traceOuter${e}(${t}) {
      rayDirection = normalize(rayDirection);
      float power = 0.;
      float d = roundedboxIntersectModified(rayOrigin, rayDirection, scene.outerSize, scene.outerRadius);
      if (d < 1e14) {
        vec3 pos = rayOrigin + rayDirection * d;
        vec3 nor = -roundedboxNormal(pos, scene.outerSize, scene.outerRadius);
    
        rayDirection = -rayDirection;
        vec3 reflection = reflect(rayDirection, nor);
        vec3 refraction = refract(rayDirection, nor, eta);
    
        ${lights.reflectedLight};
      power += reflectedLight;
  
      ${lights.refractedLight};
      power += refractedLight;
      
      power += 
        traceOuter${
          e - 1
        }(pos + rayFromInside.x * reflection, -reflection, eta, rayFromInside)
      * ${n};
    }
    return power;
  }`;
};
const a = /* glsl */ `
float traceOuter1(${t}) {
    rayDirection = normalize(rayDirection);
  float power = 0.;
  float d = roundedboxIntersectModified(rayOrigin, rayDirection, scene.outerSize, scene.outerRadius);
  if (d < 1e14) {
      vec3 pos = rayOrigin + rayDirection * d;
    vec3 nor = -roundedboxNormal(pos, scene.outerSize, scene.outerRadius);

    rayDirection = -rayDirection;
    vec3 reflection = reflect(rayDirection, nor);
    vec3 refraction = refract(rayDirection, nor, eta);

    ${lights.reflectedLight};
    power += reflectedLight;

    ${lights.refractedLight};
    power += refractedLight;
  }
  return power;
}
`;

const f = function (e) {
  return /* Glsl */ `
  float traceInner${e}(${t}) {
      rayDirection = normalize(rayDirection);
    float power = 0.;
    float d = roundedboxIntersectModified(rayOrigin, rayDirection, scene.innerSize, scene.innerRadius);
    if (d < 1e14) {
        power += .001;
      vec3 pos = rayOrigin + rayDirection * d;
      vec3 nor = sign.y * roundedboxNormal(pos, scene.innerSize, scene.innerRadius);
      rayDirection *= sign.y;
      vec3 reflection = reflect(rayDirection, nor);
      vec3 refraction = refract(rayDirection, nor, eta);
  
      ${lights.reflectedLight};
      power += reflectedLight;
  
      vec3 rayOuter = sign.z * reflection + sign.w * refraction;
      vec3 rayInner = sign.w * reflection + sign.z * refraction;
  
      // power += traceOuter${
        e - 1
      }(pos + rayFromInside.x * rayOuter, rayFromInside.y * rayOuter, eta, rayFromInside) * ${n};
      power += traceInner${
        e - 1
      }(pos + rayFromInside.x * rayInner, rayFromInside.y * rayInner, eta, rayFromInside) * ${n};
    }
    return power;
  }
  `;
};

const s = /*glsl */ `
float traceInner1(${t}) {
    rayDirection = normalize(rayDirection);
  float power = 0.;
  float d = roundedboxIntersectModified(rayOrigin, rayDirection, scene.innerSize, scene.innerRadius);
  if (d < 1e14) {
      power += .001;
    vec3 pos = rayOrigin + rayDirection * d;
    vec3 nor = sign.y * roundedboxNormal(pos, scene.innerSize, scene.innerRadius);
    rayDirection *= sign.y;
    vec3 reflection = reflect(rayDirection, nor);
    vec3 refraction = refract(rayDirection, nor, eta);

    ${lights.reflectedLight};
    power += reflectedLight;

  }
  return power;
}
`;

const d = function () {
  let final = o;

  for (let n = 1; n <= e; n++) {
    final += /* glsl */ `
      float traceInner${n}(${t});
    `;
  }

  final += a;

  for (var d = 2; d < e; d++) {
    final += c(d, d == e);
  }

  final += i;
  final += s;

  for (var y = 2; y <= e; y++) {
    final += f(y, y == e ? '' : '-');
  }

  return final;
};
export default d;
