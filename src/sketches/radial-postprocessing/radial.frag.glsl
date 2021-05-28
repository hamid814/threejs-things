#define PI 3.1415926538

uniform sampler2D tDiffuse;
uniform float ratio;
uniform float width;

varying vec2 vUv;

vec2 rotateUV(vec2 uv, float rotation, vec2 mid) {
      return vec2(
        cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
        cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
      );
  }

void main() {
  float lvl = 6.0;
  
  vec2 ratioUv = vUv;
  ratioUv.x *= ratio;
  float shiftRatio = ratio / 2.0 - 0.5;
  ratioUv.x -= shiftRatio;
  
  float dist = distance(ratioUv, vec2(0.5));

  float angle = atan(ratioUv.x - 0.5, ratioUv.y - 0.5);
  angle /= PI * 2.0;
  angle += 0.5;
  angle *= lvl * 2.0;
  if(mod(angle, 2.0) < 1.0) {
    angle = mod(angle, 1.0);
  } else {
    angle = 1.0 - mod(angle, 1.0);
  }
  
  vec2 arbUV = vec2(0.0, dist) + 0.5;
  
  float rotationValue = angle * PI * 2.0 / (lvl * 2.0);
  
  vec2 rotatedArbUV = rotateUV(arbUV, rotationValue, vec2(0.5));

  vec2 repeatedUv = rotatedArbUV;
  repeatedUv.x = mod(rotatedArbUV.x, 1.0);
  if (rotatedArbUV.x > 1.0) repeatedUv.x = 1.0 - repeatedUv.x;
  repeatedUv.y = mod(rotatedArbUV.y, 1.0);
  if (rotatedArbUV.y > 1.0) repeatedUv.y = 1.0 - repeatedUv.y;
  
  vec4 texel = texture2D( tDiffuse, repeatedUv );
  
  gl_FragColor = texel;
}