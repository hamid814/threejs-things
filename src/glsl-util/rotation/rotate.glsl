#pragma glslify: rotation3d = require(./rotation3d)
#pragma glslify: rotation2d = require(./rotation2d)

vec3 rotate(vec3 v, vec3 axis, float angle) {
	return (rotation3d(axis, angle) * vec4(v, 1.0)).xyz;
}

vec2 rotate(vec2 v, float angle) {
	return rotation2d(angle) * v;
}

#pragma glslify: export(rotate)