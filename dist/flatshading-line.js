!function(){"use strict";var e,n={2727:function(e,n,t){var r=t(2212),i=t(21),o=t.n(i),a=t(2886),s=new(o()),u=new r.Vector2,d=new r.Scene,c=new r.PerspectiveCamera(45,innerWidth/innerHeight,.1,1e3);c.position.set(0,60,130);var f=new r.WebGLRenderer({antialias:!0});f.setSize(innerWidth,innerHeight),document.body.appendChild(f.domElement);var l=new r.PointLight(16777215,2.2);l.position.set(0,30,40),d.add(l);var h=new r.PointLight(16777215,2.2);h.position.set(30,30,0),d.add(h);var p=new r.PointLight(16777215,2.2);p.position.set(-30,30,0),d.add(p);var v=new a.OrbitControls(c,f.domElement);v.update();var m=60,w=new r.BoxGeometry(m,m,m,20,20,20),y=new r.BoxGeometry(m,m,m,10,10,10),g=new r.MeshNormalMaterial({flatShading:!0,wireframe:!0}),b=new r.Mesh(w,g),O=new r.Mesh(y,g),x=new r.GridHelper(200,5);d.add(x),d.add(b);var M=0;!function e(){!function(e,n){for(var t=O.geometry.attributes.position,i=new r.Vector3,o=0;o<t.count;o++){i.fromBufferAttribute(t,o);var a=(s.noise3D(i.x/20+7*n,i.y/20+8*n,i.z/20+9*n)+1)/2*.4+.9;i.multiplyScalar(1*a),e.geometry.attributes.position.setXYZ(o,i.x,i.y,i.z)}e.geometry.attributes.position.needsUpdate=!0}(b,M+=2e-4);var n=(Math.sin(30*M)+1)/2,t=(Math.cos(30*M)+1)/2,i=(Math.cos(10*M)+1)/2;b.material.color=new r.Color(n,t,i),v.update(),f.render(d,c),b.rotation.y+=.005,requestAnimationFrame(e)}(),f.domElement.addEventListener("mousemove",(function(e){u.x=e.clientX/window.innerWidth*2-1,u.y=-e.clientY/window.innerHeight*2+1,l.position.x=25*u.x,l.position.y=25*u.y}))}},t={};function r(e){var i=t[e];if(void 0!==i)return i.exports;var o=t[e]={exports:{}};return n[e](o,o.exports,r),o.exports}r.m=n,e=[],r.O=function(n,t,i,o){if(!t){var a=1/0;for(d=0;d<e.length;d++){t=e[d][0],i=e[d][1],o=e[d][2];for(var s=!0,u=0;u<t.length;u++)(!1&o||a>=o)&&Object.keys(r.O).every((function(e){return r.O[e](t[u])}))?t.splice(u--,1):(s=!1,o<a&&(a=o));s&&(e.splice(d--,1),n=i())}return n}o=o||0;for(var d=e.length;d>0&&e[d-1][2]>o;d--)e[d]=e[d-1];e[d]=[t,i,o]},r.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(n,{a:n}),n},r.d=function(e,n){for(var t in n)r.o(n,t)&&!r.o(e,t)&&Object.defineProperty(e,t,{enumerable:!0,get:n[t]})},r.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},function(){var e={4343:0};r.O.j=function(n){return 0===e[n]};var n=function(n,t){var i,o,a=t[0],s=t[1],u=t[2],d=0;for(i in s)r.o(s,i)&&(r.m[i]=s[i]);if(u)var c=u(r);for(n&&n(t);d<a.length;d++)o=a[d],r.o(e,o)&&e[o]&&e[o][0](),e[a[d]]=0;return r.O(c)},t=self.webpackChunkthreejs_things=self.webpackChunkthreejs_things||[];t.forEach(n.bind(null,0)),t.push=n.bind(null,t.push.bind(t))}();var i=r.O(void 0,[2886,825],(function(){return r(2727)}));i=r.O(i)}();