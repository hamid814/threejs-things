export default /* glsl */ `
float sdHexPrism( vec3 p, vec2 h ){
  vec3 q = abs(p);
  return max(q.z-h.y,max((q.x*0.866025+q.y*0.5),q.y)-h.x);
}
float sdCapsule( vec3 p, vec3 a, vec3 b, float r )
{
  vec3 pa = p - a, ba = b - a;
  float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
  return length( pa - ba*h ) - r;
}
float sdTorus( vec3 p, vec2 t )
{
  vec2 q = vec2(length(p.xz)-t.x,p.y);
  return length(q)-t.y;
}

mat4 rotateBox(in vec3 v, in float angle) {
    float s = sin(angle);
    float c = cos(angle);
    float ic = 1. - c;
  
    return mat4(v.x * v.x * ic + c,       v.y * v.x * ic - s * v.z, v.z * v.x * ic + s * v.y, 0.,
                v.x * v.y * ic + s * v.z, v.y * v.y * ic + c,       v.z * v.y * ic - s * v.x, 0.,
                v.x * v.z * ic - s * v.y, v.y * v.z * ic + s * v.x, v.z * v.z * ic + c,       0.,
                0.,                       0.,                       0.,                       1.);
}

vec3 ptransform(in mat4 mat, in vec3 v) {
    return (mat * vec4(v, 1.)).xyz;
}

vec3 ntransform(in mat4 mat, in vec3 v) {
    return (mat * vec4(v, 0.)).xyz;
}
`;
