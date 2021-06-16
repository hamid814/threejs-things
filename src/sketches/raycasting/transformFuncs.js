export default /* glsl */ `
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
