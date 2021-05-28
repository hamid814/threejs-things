#pragma glslify: rotation3dY = require(./rotation3dY)

vec3 rotateY(vec3 v, float angle) {
	return rotation3dY(angle) * v;
}

#pragma glslify: export(rotateY)