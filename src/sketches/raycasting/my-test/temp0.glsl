float traceOuter1(vec3 rayOrigin, vec3 rayDirection) {
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