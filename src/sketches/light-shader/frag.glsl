uniform float uTime;
uniform samplerCube worldTexture;
uniform vec3 objectColor;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;

vec3 lightPos = vec3(0.0, 0.0, 3.0);
vec3 lightColor = vec3(1.0, 0.95, 0.9);
// vec3 lightColor = vec3(1.0, 1.0, 1.0);

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
  vec3 lightDir = normalize(lightPos - vWorldPosition);

  // flat shading
  vec3 xTangent = dFdx(vWorldPosition);
  vec3 yTangent = dFdy(vWorldPosition);
  vec3 faceNormal = normalize(cross(xTangent, yTangent));

  float diffuse = dot(lightDir, faceNormal);
  diffuse = max(0.0, diffuse);

  vec3 viewDir = normalize(cameraPosition - vWorldPosition);
  vec3 specularLight = vec3(lightDir.x, lightDir.y, lightDir.z);
  vec3 reflectionDir = reflect(-specularLight, faceNormal);

  float specularStrength = 1.0;
  float specular = dot(viewDir, -reflectionDir);
  // specular = abs(specular);
  specular = max(0.0, specular);
  specular = pow(specular, 2.0);

  float mappedH = map(specular, 0.0, 1.0, -0.25, 0.6);
  // float mappedH = map(specular, 0.0, 1.0, 0.6, 1.0);
  float mappedV = map(specular, 0.0, 1.0, 0.0, 0.5);

  vec3 finalSpecular = specularStrength * hsv2rgb(vec3(mappedH, 1.0, mappedV)) * lightColor;
  // vec3 finalSpecular = specularStrength * specular * lightColor;

  vec3 finalLightColor = objectColor * (diffuse * 0.5 + finalSpecular * 1.5);

  vec3 sampleDir = reflect(-cameraPosition, faceNormal);
  // vec3 sampleDir = refract(cameraPosition, vNormal, 1.0);
  vec3 envColor = textureCube(worldTexture, sampleDir).rgb;

  vec3 finalColor = envColor * 0.9 + finalLightColor;

  // gl_FragColor = vec4(finalColor, 1.0);
  // gl_FragColor = vec4(envColor, 1.0);
  gl_FragColor = vec4(finalLightColor, 1.0);
  // gl_FragColor = vec4(finalSpecular, 1.0);
}