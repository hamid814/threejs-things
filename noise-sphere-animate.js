!function(){"use strict";var e,n={5915:function(e,n,t){var r=t(2212),o=t(21),i=t.n(o),a=t(6358),s=t(3379),d=t.n(s),c=t(6027),u=(d()(c.Z,{insert:"head",singleton:!1}),c.Z.locals,{x:0,y:0,z:0,rotationX:0,rotationY:0,rotationZ:0,volumeX:1,volumeY:1,volumeZ:1,timeSpeed:2e-4,noiseFactor:5,isOrbitAnimating:!1}),l=document.getElementById("webgl"),p=new r.WebGLRenderer({antialias:!0,canvas:l,preserveDrawingBuffer:!0});p.setSize(innerWidth,innerHeight),document.body.appendChild(p.domElement);var m=new(i()),f=new r.Vector2(1,1),v=new r.Scene,h=new r.PerspectiveCamera(45,innerWidth/innerHeight,.1,1e3);h.position.set(0,60,130),h.lookAt(0,0,0);var g=new r.Object3D,w=new r.IcosahedronGeometry(30,10),y=new r.IcosahedronGeometry(30,10),b=new r.MeshStandardMaterial({color:new r.Color(1,.9,.2),roughness:.25,metalness:.8,flatShading:!0}),O=new r.Mesh(w,b),x=new r.Mesh(y,b),E=new r.PointLight(16777215,2.2);E.position.set(0,30,40),g.add(E);var j=new r.PointLight(16777215,1.7);j.position.set(60,30,0),g.add(j);var k=new r.PointLight(16777215,1.7);k.position.set(-60,30,0),g.add(k),g.add(O),v.add(g);var L=new r.GridHelper(200,5);v.add(L);var M=0;!function e(){M+=u.timeSpeed;var n=(Math.sin(2*M*30)+1)/2,t=(Math.cos(2*M*30)+1)/2,o=(Math.cos(2*M*10)+1)/2;O.material.color=new r.Color(n,t,o),function(e,n){for(var t=x.geometry.attributes.position,o=new r.Vector3,i=0;i<t.count;i++){o.fromBufferAttribute(t,i);var a=(m.noise3D(o.x/u.noiseFactor+7*n,o.y/u.noiseFactor+8*n,o.z/u.noiseFactor+9*n)+1)/2*.8+0;o.multiplyScalar(2*a),e.geometry.attributes.position.setXYZ(i,o.x,o.y,o.z)}e.geometry.attributes.position.needsUpdate=!0}(O,M),p.render(v,h),requestAnimationFrame(e)}(),p.domElement.addEventListener("mousemove",(function(e){f.x=e.clientX/window.innerWidth*2-1,f.y=-e.clientY/window.innerHeight*2+1,E.position.x=25*f.x,E.position.y=8*(f.y+5)}));var C=!0;document.body.addEventListener("click",(function(){var e=a.ZP.timeline({paused:!0}),n=C?100:5;C=!C,e.to(u,{duration:3,noiseFactor:n,ease:"linear"}),e.to(u,{duration:0,isOrbitAnimating:!1}),u.isOrbitAnimating||(e.play(),u.isOrbitAnimating=!0)})),window.addEventListener("resize",(function(){var e=innerWidth,n=innerHeight;p.setSize(e,n),h.aspect=e/n,h.updateProjectionMatrix()})),document.addEventListener("keydown",(function(e){"p"===e.key&&function(){try{var e="image/jpeg",n=p.domElement.toDataURL(e),t=document.getElementsByTagName("script"),r=t[t.length-1],o=new URL(r.src).pathname.slice(1,-3);S(n.replace(e,P),o+".jpg")}catch(e){return void console.log(e)}}()}));var P="image/octet-stream",S=function(e,n){var t=document.createElement("a");"string"==typeof t.download?(document.body.appendChild(t),t.download=n,t.href=e,t.click(),document.body.removeChild(t)):location.replace(uri)}},6027:function(e,n,t){var r=t(3645),o=t.n(r)()((function(e){return e[1]}));o.push([e.id,"#panel {\r\n  position: absolute;\r\n  color: #eee;\r\n  padding: 20px;\r\n  border: 1px solid #eee;\r\n  margin: 20px;\r\n  cursor: default;\r\n}\r\n",""]),n.Z=o}},t={};function r(e){var o=t[e];if(void 0!==o)return o.exports;var i=t[e]={id:e,exports:{}};return n[e](i,i.exports,r),i.exports}r.m=n,e=[],r.O=function(n,t,o,i){if(!t){var a=1/0;for(c=0;c<e.length;c++){t=e[c][0],o=e[c][1],i=e[c][2];for(var s=!0,d=0;d<t.length;d++)(!1&i||a>=i)&&Object.keys(r.O).every((function(e){return r.O[e](t[d])}))?t.splice(d--,1):(s=!1,i<a&&(a=i));s&&(e.splice(c--,1),n=o())}return n}i=i||0;for(var c=e.length;c>0&&e[c-1][2]>i;c--)e[c]=e[c-1];e[c]=[t,o,i]},r.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(n,{a:n}),n},r.d=function(e,n){for(var t in n)r.o(n,t)&&!r.o(e,t)&&Object.defineProperty(e,t,{enumerable:!0,get:n[t]})},r.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},function(){var e={693:0};r.O.j=function(n){return 0===e[n]};var n=function(n,t){var o,i,a=t[0],s=t[1],d=t[2],c=0;for(o in s)r.o(s,o)&&(r.m[o]=s[o]);if(d)var u=d(r);for(n&&n(t);c<a.length;c++)i=a[c],r.o(e,i)&&e[i]&&e[i][0](),e[a[c]]=0;return r.O(u)},t=self.webpackChunkthreejs_things=self.webpackChunkthreejs_things||[];t.forEach(n.bind(null,0)),t.push=n.bind(null,t.push.bind(t))}();var o=r.O(void 0,[6358,9616],(function(){return r(5915)}));o=r.O(o)}();