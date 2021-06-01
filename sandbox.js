!function(){"use strict";var n,e={467:function(n,e,t){var o=t(2212),r=t(2886),i=document.getElementById("webgl"),a=new o.WebGLRenderer({antialias:!0,canvas:i,preserveDrawingBuffer:!0});a.setSize(innerWidth,innerHeight),a.setPixelRatio(Math.min(2,devicePixelRatio)),a.setClearColor(1184274),document.body.appendChild(a.domElement);var c=new o.Scene,x=new o.PerspectiveCamera(45,innerWidth/innerHeight,.1,1e3);x.position.set(0,3,4),x.lookAt(0,0,0),new r.OrbitControls(x,a.domElement).update();for(var s="\n  #define PI 3.1415926535897932384626433832795\n\n  uniform float uTime;\n\n  attribute float a_IsHead;\n  attribute float a_Length;\n  attribute vec3 a_Origin;\n  attribute vec3 a_End;\n  attribute vec3 a_Random;\n  \n  ".concat("\nvec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}\nfloat permute(float x){return floor(mod(((x*34.0)+1.0)*x, 289.0));}\nvec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}\nfloat taylorInvSqrt(float r){return 1.79284291400159 - 0.85373472095314 * r;}\nvec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}\n\nvec4 grad4(float j, vec4 ip){\n  const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);\n  vec4 p,s;\n\n  p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;\n  p.w = 1.5 - dot(abs(p.xyz), ones.xyz);\n  s = vec4(lessThan(p, vec4(0.0)));\n  p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www; \n\n  return p;\n}\n\nfloat noise(vec3 P){\n  vec3 Pi0 = floor(P); // Integer part for indexing\n  vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1\n  Pi0 = mod(Pi0, 289.0);\n  Pi1 = mod(Pi1, 289.0);\n  vec3 Pf0 = fract(P); // Fractional part for interpolation\n  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0\n  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);\n  vec4 iy = vec4(Pi0.yy, Pi1.yy);\n  vec4 iz0 = Pi0.zzzz;\n  vec4 iz1 = Pi1.zzzz;\n\n  vec4 ixy = permute(permute(ix) + iy);\n  vec4 ixy0 = permute(ixy + iz0);\n  vec4 ixy1 = permute(ixy + iz1);\n\n  vec4 gx0 = ixy0 / 7.0;\n  vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;\n  gx0 = fract(gx0);\n  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);\n  vec4 sz0 = step(gz0, vec4(0.0));\n  gx0 -= sz0 * (step(0.0, gx0) - 0.5);\n  gy0 -= sz0 * (step(0.0, gy0) - 0.5);\n\n  vec4 gx1 = ixy1 / 7.0;\n  vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;\n  gx1 = fract(gx1);\n  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);\n  vec4 sz1 = step(gz1, vec4(0.0));\n  gx1 -= sz1 * (step(0.0, gx1) - 0.5);\n  gy1 -= sz1 * (step(0.0, gy1) - 0.5);\n\n  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);\n  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);\n  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);\n  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);\n  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);\n  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);\n  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);\n  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);\n\n  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));\n  g000 *= norm0.x;\n  g010 *= norm0.y;\n  g100 *= norm0.z;\n  g110 *= norm0.w;\n  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));\n  g001 *= norm1.x;\n  g011 *= norm1.y;\n  g101 *= norm1.z;\n  g111 *= norm1.w;\n\n  float n000 = dot(g000, Pf0);\n  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));\n  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));\n  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));\n  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));\n  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));\n  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));\n  float n111 = dot(g111, Pf1);\n\n  vec3 fade_xyz = fade(Pf0);\n  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);\n  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);\n  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); \n  return 2.2 * n_xyz;\n}\n\nfloat noise(vec4 v){\n  const vec2  C = vec2( 0.138196601125010504,  // (5 - sqrt(5))/20  G4\n                        0.309016994374947451); // (sqrt(5) - 1)/4   F4\n// First corner\n  vec4 i  = floor(v + dot(v, C.yyyy) );\n  vec4 x0 = v -   i + dot(i, C.xxxx);\n\n// Other corners\n\n// Rank sorting originally contributed by Bill Licea-Kane, AMD (formerly ATI)\n  vec4 i0;\n\n  vec3 isX = step( x0.yzw, x0.xxx );\n  vec3 isYZ = step( x0.zww, x0.yyz );\n//  i0.x = dot( isX, vec3( 1.0 ) );\n  i0.x = isX.x + isX.y + isX.z;\n  i0.yzw = 1.0 - isX;\n\n//  i0.y += dot( isYZ.xy, vec2( 1.0 ) );\n  i0.y += isYZ.x + isYZ.y;\n  i0.zw += 1.0 - isYZ.xy;\n\n  i0.z += isYZ.z;\n  i0.w += 1.0 - isYZ.z;\n\n  // i0 now contains the unique values 0,1,2,3 in each channel\n  vec4 i3 = clamp( i0, 0.0, 1.0 );\n  vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );\n  vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );\n\n  //  x0 = x0 - 0.0 + 0.0 * C \n  vec4 x1 = x0 - i1 + 1.0 * C.xxxx;\n  vec4 x2 = x0 - i2 + 2.0 * C.xxxx;\n  vec4 x3 = x0 - i3 + 3.0 * C.xxxx;\n  vec4 x4 = x0 - 1.0 + 4.0 * C.xxxx;\n\n// Permutations\n  i = mod(i, 289.0); \n  float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);\n  vec4 j1 = permute( permute( permute( permute (\n             i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))\n           + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))\n           + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))\n           + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));\n// Gradients\n// ( 7*7*6 points uniformly over a cube, mapped onto a 4-octahedron.)\n// 7*7*6 = 294, which is close to the ring size 17*17 = 289.\n\n  vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;\n\n  vec4 p0 = grad4(j0,   ip);\n  vec4 p1 = grad4(j1.x, ip);\n  vec4 p2 = grad4(j1.y, ip);\n  vec4 p3 = grad4(j1.z, ip);\n  vec4 p4 = grad4(j1.w, ip);\n\n// Normalise gradients\n  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));\n  p0 *= norm.x;\n  p1 *= norm.y;\n  p2 *= norm.z;\n  p3 *= norm.w;\n  p4 *= taylorInvSqrt(dot(p4,p4));\n\n// Mix contributions from the five corners\n  vec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);\n  vec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)            ), 0.0);\n  m0 = m0 * m0;\n  m1 = m1 * m1;\n  return 49.0 * ( dot(m0*m0, vec3( dot( p0, x0 ), dot( p1, x1 ), dot( p2, x2 )))\n               + dot(m1*m1, vec2( dot( p3, x3 ), dot( p4, x4 ) ) ) ) ;\n\n}\n","\n  \n  ").concat("\nmat3 rotation3dX(float angle) {\n\tfloat s = sin(angle);\n\tfloat c = cos(angle);\n\n\treturn mat3(\n\t\t1.0, 0.0, 0.0,\n\t\t0.0, c, s,\n\t\t0.0, -s, c\n\t);\n}\n  \nmat3 rotation3dY(float angle) {\n\tfloat s = sin(angle);\n\tfloat c = cos(angle);\n\n\treturn mat3(\n\t\tc, 0.0, -s,\n\t\t0.0, 1.0, 0.0,\n\t\ts, 0.0, c\n\t);\n}\n\nmat3 rotation3dZ(float angle) {\n\tfloat s = sin(angle);\n\tfloat c = cos(angle);\n\n\treturn mat3(\n\t\tc, s, 0.0,\n\t\t-s, c, 0.0,\n\t\t0.0, 0.0, 1.0\n\t);\n}\n\nmat4 rotation3d(vec3 axis, float angle) {\n  axis = normalize(axis);\n  float s = sin(angle);\n  float c = cos(angle);\n  float oc = 1.0 - c;\n\n  return mat4(\n\t\toc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,\n    oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,\n    oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,\n\t\t0.0,                                0.0,                                0.0,                                1.0\n\t);\n}\n\nmat2 rotation2d(float angle) {\n\tfloat s = sin(angle);\n\tfloat c = cos(angle);\n\n\treturn mat2(\n\t\tc, -s,\n\t\ts, c\n\t);\n}\n\nvec3 rotateX(vec3 v, float angle) {\n\treturn rotation3dX(angle) * v;\n}\n\nvec3 rotateY(vec3 v, float angle) {\n\treturn rotation3dY(angle) * v;\n}\n\nvec3 rotateZ(vec3 v, float angle) {\n\treturn rotation3dZ(angle) * v;\n}\n\nvec3 rotate(vec3 v, vec3 axis, float angle) {\n\treturn (rotation3d(axis, angle) * vec4(v, 1.0)).xyz;\n}\n\nvec2 rotate(vec2 v, float angle) {\n\treturn rotation2d(angle) * v;\n}\n","\n  \n  void main() {\n    vec3 direction = a_Origin - a_End;\n    direction = normalize(direction);\n    \n    vec3 randomDirection = direction + a_Random * 0.2;\n    \n    float t = uTime / 0.5;\n    \n    vec3 pos = position;\n    \n    float noiseAmp = noise(pos / 3.0 + t);\n    \n    pos +=  randomDirection * a_IsHead * a_Length / 2.0;\n    \n    pos -= position;\n    pos = rotate(pos, direction, noiseAmp * 3.0);\n    pos += position;\n    \n    \n    gl_Position = projectionMatrix * modelMatrix * viewMatrix * vec4(\n      pos,\n      1.0\n      );\n    }\n    "),v=new o.ShaderMaterial({uniforms:{uTime:{value:0}},vertexShader:s,fragmentShader:"\n    void main() {\n      gl_FragColor = vec4(1.0, 0.3, 0.2, 1.0);\n  }\n"}),l=new o.Vector3,g=new o.Vector3,y=[{x:-2,y:1,z:1},{x:-2,y:1,z:-1},{x:-1,y:1,z:1},{x:-1,y:1,z:-1},{x:0,y:1,z:1},{x:0,y:1,z:-1},{x:2,y:1,z:1},{x:2,y:1,z:-1},{x:1,y:1,z:1},{x:1,y:1,z:-1},{x:1,y:1,z:-1},{x:-1,y:1,z:-1},{x:-1,y:1,z:-1},{x:-1,y:-1,z:-1},{x:-1,y:-1,z:-1},{x:-1,y:-1,z:1},{x:-1,y:-1,z:1},{x:1,y:-1,z:1},{x:1,y:-1,z:1},{x:1,y:1,z:1}],d=[],f=0;f<y.length/2;f++){var m=2*f,u=y[m],z=y[m+1];l.set(u.x,u.y,u.z),g.set(z.x,z.y,z.z);for(var p=l.distanceTo(g),w=Math.floor(3*p),h=0;h<w;h++){var P=new o.Vector3;P.subVectors(g,l).normalize().multiplyScalar(Math.random()).multiplyScalar(p).add(l);var b=(new o.Vector3).copy(l),_=(new o.Vector3).copy(g);P.origin=b,P.end=_,d.push(P)}}new o.PointsMaterial({size:.1});var A=new o.BufferGeometry,X=new Float32Array(3*d.length),Y=new o.BufferAttribute(X,3);d.forEach((function(n,e){Y.setXYZ(e,n.x,n.y,n.z)})),A.setAttribute("position",Y),new o.PointsMaterial({size:.05,color:"red"});var Z=new o.BufferGeometry,j=new Float32Array(3*y.length),C=new o.BufferAttribute(j,3);y.forEach((function(n,e){C.setXYZ(e,n.x,n.y,n.z)})),Z.setAttribute("position",C);var B=new Float32Array(2*d.length*3),E=new Float32Array(2*d.length),M=new Float32Array(2*d.length),O=new Float32Array(2*d.length*3),S=new Float32Array(2*d.length*3),F=new Float32Array(2*d.length*3),I=new o.BufferAttribute(B,3),L=new o.BufferAttribute(E,1),k=new o.BufferAttribute(M,1),q=new o.BufferAttribute(O,3),R=new o.BufferAttribute(S,3),G=new o.BufferAttribute(F,3);d.forEach((function(n,e){var t=2*e;I.setXYZ(t,n.x,n.y,n.z),I.setXYZ(t+1,n.x,n.y,n.z),q.setXYZ(t,n.origin.x,n.origin.y,n.origin.z),q.setXYZ(t+1,n.origin.x,n.origin.y,n.origin.z),R.setXYZ(t,n.end.x,n.end.y,n.end.z),R.setXYZ(t+1,n.end.x,n.end.y,n.end.z);var o=Math.random(),r=Math.random(),i=Math.random();G.setXYZ(t,o,r,i),G.setXYZ(t+1,o,r,i),L.setX(t,.4),L.setX(t+1,.4),k.setX(t,1),k.setX(t+1,-1)}));var T=new o.BufferGeometry;T.setAttribute("position",I),T.setAttribute("a_Length",L),T.setAttribute("a_IsHead",k),T.setAttribute("a_Origin",q),T.setAttribute("a_End",R),T.setAttribute("a_Random",G);var H=new o.LineSegments(T,v);c.add(H);var V=new o.BoxGeometry(2,3,.3),D=new o.EdgesGeometry(V),W=(new o.LineSegments(D,new o.LineBasicMaterial({color:16777215})),0);!function n(){a.render(c,x),W+=.005,H.material.uniforms.uTime.value=W,requestAnimationFrame(n)}(),console.log(a.info.render.lines-12),window.addEventListener("resize",(function(){var n=innerWidth,e=innerHeight;a.setSize(n,e),x.aspect=n/e,x.updateProjectionMatrix()})),document.addEventListener("keydown",(function(n){"p"===n.key&&function(){try{var n="image/jpeg",e=a.domElement.toDataURL(n),t=document.getElementsByTagName("script"),o=t[t.length-1],r=new URL(o.src).pathname.slice(1,-3);U(e.replace(n,N),r+".jpg")}catch(n){return void console.log(n)}}()}));var N="image/octet-stream",U=function(n,e){var t=document.createElement("a");"string"==typeof t.download?(document.body.appendChild(t),t.download=e,t.href=n,t.click(),document.body.removeChild(t)):location.replace(uri)}}},t={};function o(n){var r=t[n];if(void 0!==r)return r.exports;var i=t[n]={exports:{}};return e[n](i,i.exports,o),i.exports}o.m=e,n=[],o.O=function(e,t,r,i){if(!t){var a=1/0;for(s=0;s<n.length;s++){t=n[s][0],r=n[s][1],i=n[s][2];for(var c=!0,x=0;x<t.length;x++)(!1&i||a>=i)&&Object.keys(o.O).every((function(n){return o.O[n](t[x])}))?t.splice(x--,1):(c=!1,i<a&&(a=i));c&&(n.splice(s--,1),e=r())}return e}i=i||0;for(var s=n.length;s>0&&n[s-1][2]>i;s--)n[s]=n[s-1];n[s]=[t,r,i]},o.d=function(n,e){for(var t in e)o.o(e,t)&&!o.o(n,t)&&Object.defineProperty(n,t,{enumerable:!0,get:e[t]})},o.o=function(n,e){return Object.prototype.hasOwnProperty.call(n,e)},function(){var n={9451:0};o.O.j=function(e){return 0===n[e]};var e=function(e,t){var r,i,a=t[0],c=t[1],x=t[2],s=0;for(r in c)o.o(c,r)&&(o.m[r]=c[r]);if(x)var v=x(o);for(e&&e(t);s<a.length;s++)i=a[s],o.o(n,i)&&n[i]&&n[i][0](),n[a[s]]=0;return o.O(v)},t=self.webpackChunkthreejs_things=self.webpackChunkthreejs_things||[];t.forEach(e.bind(null,0)),t.push=e.bind(null,t.push.bind(t))}();var r=o.O(void 0,[2886,5035],(function(){return o(467)}));r=o.O(r)}();