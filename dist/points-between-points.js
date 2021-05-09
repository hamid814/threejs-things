!function(){"use strict";var e,n={1578:function(e,n,t){var r=t(2212),i=t(2886),o=new r.WebGLRenderer({antialias:!0});o.setSize(innerWidth,innerHeight),o.setClearColor(11184810),document.body.appendChild(o.domElement);var a=new r.Scene,l=new r.PerspectiveCamera(45,innerWidth/innerHeight,.1,1e3);l.position.set(0,0,4),l.lookAt(0,0,0),new i.OrbitControls(l,o.domElement).update();var s=new r.ShaderMaterial({vertexShader:"\n    varying vec2 vUv;\n  \n    void main() {\n      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n      gl_PointSize = 60.0;\n      gl_PointSize *= (1.0 / -(modelViewMatrix * vec4(position, 1.0)).z);\n      \n      vUv = uv;\n    }\n  ",fragmentShader:"\n    varying vec2 vUv;\n  \n    void main() {\n      float dist = 1.0 - step(0.5, distance(gl_PointCoord, vec2(0.5)));\n\n      if (dist == 0.0) discard;\n      \n      gl_FragColor = vec4(dist, 1.0, 0.0, 1.0);\n    }\n  "}),c=new r.BufferGeometry,d=new r.Vector3(1,1,1),u=new r.Vector3(-1,-1,-1),v=new r.BufferAttribute(new Float32Array(15),3),f=d.distanceTo(u),m=(new r.Vector3).subVectors(d,u).normalize().multiplyScalar(Math.random()).multiplyScalar(f).add(u),p=(new r.Vector3).subVectors(d,u).normalize().multiplyScalar(Math.random()).multiplyScalar(f).add(u),h=(new r.Vector3).subVectors(d,u).normalize().multiplyScalar(Math.random()).multiplyScalar(f).add(u);v.setXYZ(0,d.x,d.y,d.z),v.setXYZ(1,u.x,u.y,u.z),v.setXYZ(2,m.x,m.y,m.z),v.setXYZ(3,p.x,p.y,p.z),v.setXYZ(4,h.x,h.y,h.z),c.setAttribute("position",v);var w=new r.Points(c,s);a.add(w);var y=new r.BoxGeometry(2,2,2),g=new r.EdgesGeometry(y),b=new r.LineSegments(g,new r.LineBasicMaterial({color:16777215}));a.add(b),function e(){o.render(a,l),requestAnimationFrame(e)}()}},t={};function r(e){var i=t[e];if(void 0!==i)return i.exports;var o=t[e]={exports:{}};return n[e](o,o.exports,r),o.exports}r.m=n,e=[],r.O=function(n,t,i,o){if(!t){var a=1/0;for(c=0;c<e.length;c++){t=e[c][0],i=e[c][1],o=e[c][2];for(var l=!0,s=0;s<t.length;s++)(!1&o||a>=o)&&Object.keys(r.O).every((function(e){return r.O[e](t[s])}))?t.splice(s--,1):(l=!1,o<a&&(a=o));l&&(e.splice(c--,1),n=i())}return n}o=o||0;for(var c=e.length;c>0&&e[c-1][2]>o;c--)e[c]=e[c-1];e[c]=[t,i,o]},r.d=function(e,n){for(var t in n)r.o(n,t)&&!r.o(e,t)&&Object.defineProperty(e,t,{enumerable:!0,get:n[t]})},r.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},function(){var e={5933:0};r.O.j=function(n){return 0===e[n]};var n=function(n,t){var i,o,a=t[0],l=t[1],s=t[2],c=0;for(i in l)r.o(l,i)&&(r.m[i]=l[i]);if(s)var d=s(r);for(n&&n(t);c<a.length;c++)o=a[c],r.o(e,o)&&e[o]&&e[o][0](),e[a[c]]=0;return r.O(d)},t=self.webpackChunkthreejs_things=self.webpackChunkthreejs_things||[];t.forEach(n.bind(null,0)),t.push=n.bind(null,t.push.bind(t))}();var i=r.O(void 0,[2886,5605],(function(){return r(1578)}));i=r.O(i)}();