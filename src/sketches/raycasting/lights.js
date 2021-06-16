const e = 2;

const declareLights = /* glsl */ `
  vec3 light[${e}];
  vec3 projectedLight[${e}];
`;

const initLights = function () {
  var t = /* glsl */ `
      // scene.light[0] = vec3(.0,  2., -.02);
      // scene.light[1] = vec3(.02, -2., -.0);
      scene.light[0] = vec3(.2,  2., -.8);
      scene.light[1] = vec3(.2, -2., -.8);
      vec3 dir;
    `;

  for (let n = 0; n < e; n++)
    t += /* glsl */ `
    scene.light[${n}] = scene.light[${n}].x * uu + scene.light[${n}].y * vv + scene.light[${n}].z * ww;
    scene.light[${n}] = ptransform(scene.worldToLocal, scene.light[${n}]);
    dir = normalize(-scene.light[${n}]);
    scene.projectedLight[${n}] = scene.light[${n}] + dir * roundedboxIntersectModified(scene.light[${n}], dir, scene.outerSize, scene.outerRadius);
    `;
  return t;
};

const reflectedLight = /* glsl */ `
vec3 nrefl = normalize(reflection);
float reflectedLight = 
  smoothstep(.95, 1., dot(normalize(scene.projectedLight[0] - pos), nrefl)) +
  smoothstep(.75, 1., dot(normalize(scene.projectedLight[1] - pos), nrefl))
`;

const refractedLight = /* glsl */ `
float refractedLights[2];
refractedLights[0] = dot(normalize(scene.light[0] - pos), normalize(refraction));
refractedLights[1] = dot(normalize(scene.light[1] - pos), normalize(refraction));
float refractedLight = (
      smoothstep(.0, 1., refractedLights[0])
  + smoothstep(.0, 1., refractedLights[1])
)
`;

export default {
  refractedLight,
  reflectedLight,
  initLights,
  declareLights,
};
