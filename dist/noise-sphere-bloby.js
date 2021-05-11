!function(){"use strict";var e,n={8505:function(e,n,t){var r=t(2212),o=t(2886),i=t(21),a=t.n(i),s=t(6358),d=t(3379),u=t.n(d),c=t(726),l=(u()(c.Z,{insert:"head",singleton:!1}),c.Z.locals,{timeSpeed:2e-4,noiseFactor:60,isAnimating:!1}),p=document.getElementById("webgl"),m=new r.WebGLRenderer({antialias:!0,canvas:p,preserveDrawingBuffer:!0});m.setSize(innerWidth,innerHeight),m.setClearColor(1184274),document.body.appendChild(m.domElement);var f=new(a()),h=new r.Vector2(1,1),v=new r.Scene,g=new r.PerspectiveCamera(45,innerWidth/innerHeight,.1,1e3);g.position.set(0,60,130),g.lookAt(0,0,0),g.up.set(0,100,0),new o.OrbitControls(g,m.domElement);var w=new r.IcosahedronGeometry(30,10),y=new r.IcosahedronGeometry(30,10),b=new r.MeshStandardMaterial({color:new r.Color(.4,.3,.2),roughness:.25,metalness:.8,flatShading:!0}),O=new r.Mesh(w,b),x=new r.Mesh(y,b),E=new r.PointLight(16777215,2.2);E.position.set(0,30,40),v.add(E);var k=new r.PointLight(16777215,1.7);k.position.set(30,30,0),v.add(k);var C=new r.PointLight(16777215,1.7);C.position.set(-30,30,0),v.add(C),v.add(O);var L=new r.GridHelper(200,5);v.add(L);var P=0;!function e(){P+=l.timeSpeed,function(e,n){for(var t=x.geometry.attributes.position,o=new r.Vector3,i=0;i<t.count;i++){o.fromBufferAttribute(t,i);var a=(f.noise3D(o.x/l.noiseFactor+7*n,o.y/l.noiseFactor+8*n,o.z/l.noiseFactor+9*n)+1)/2*.8+0;o.multiplyScalar(2*a),e.geometry.attributes.position.setXYZ(i,o.x,o.y,o.z)}e.geometry.attributes.position.needsUpdate=!0}(O,P),m.render(v,g),requestAnimationFrame(e)}(),document.body.addEventListener("click",(function(){var e=s.ZP.timeline({paused:!0});e.to(l,{duration:2.5,timeSpeed:.004,ease:"Power3.easeInOut"}),e.to(l,{duration:1,timeSpeed:2e-4,ease:"Power3.easeOut"}),e.to(l,{duration:0,isAnimating:!1}),l.isAnimating||(e.play(),l.isAnimating=!0)})),m.domElement.addEventListener("mousemove",(function(e){h.x=e.clientX/window.innerWidth*2-1,h.y=-e.clientY/window.innerHeight*2+1,E.position.x=25*h.x,E.position.y=8*(h.y+5)})),window.addEventListener("resize",(function(){var e=innerWidth,n=innerHeight;m.setSize(e,n),g.aspect=e/n,g.updateProjectionMatrix()})),document.addEventListener("keydown",(function(e){"p"===e.key&&function(){try{var e="image/jpeg",n=m.domElement.toDataURL(e),t=document.getElementsByTagName("script"),r=t[t.length-1],o=new URL(r.src).pathname.slice(1,-3);j(n.replace(e,S),o+".jpg")}catch(e){return void console.log(e)}}()}));var S="image/octet-stream",j=function(e,n){var t=document.createElement("a");"string"==typeof t.download?(document.body.appendChild(t),t.download=n,t.href=e,t.click(),document.body.removeChild(t)):location.replace(uri)}},726:function(e,n,t){var r=t(3645),o=t.n(r)()((function(e){return e[1]}));o.push([e.id,"#panel {\r\n  position: absolute;\r\n  color: #eee;\r\n  padding: 20px;\r\n  border: 1px solid #eee;\r\n  margin: 20px;\r\n  cursor: default;\r\n}\r\n",""]),n.Z=o}},t={};function r(e){var o=t[e];if(void 0!==o)return o.exports;var i=t[e]={id:e,exports:{}};return n[e](i,i.exports,r),i.exports}r.m=n,e=[],r.O=function(n,t,o,i){if(!t){var a=1/0;for(u=0;u<e.length;u++){t=e[u][0],o=e[u][1],i=e[u][2];for(var s=!0,d=0;d<t.length;d++)(!1&i||a>=i)&&Object.keys(r.O).every((function(e){return r.O[e](t[d])}))?t.splice(d--,1):(s=!1,i<a&&(a=i));s&&(e.splice(u--,1),n=o())}return n}i=i||0;for(var u=e.length;u>0&&e[u-1][2]>i;u--)e[u]=e[u-1];e[u]=[t,o,i]},r.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(n,{a:n}),n},r.d=function(e,n){for(var t in n)r.o(n,t)&&!r.o(e,t)&&Object.defineProperty(e,t,{enumerable:!0,get:n[t]})},r.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},function(){var e={8333:0};r.O.j=function(n){return 0===e[n]};var n=function(n,t){var o,i,a=t[0],s=t[1],d=t[2],u=0;for(o in s)r.o(s,o)&&(r.m[o]=s[o]);if(d)var c=d(r);for(n&&n(t);u<a.length;u++)i=a[u],r.o(e,i)&&e[i]&&e[i][0](),e[a[u]]=0;return r.O(c)},t=self.webpackChunkthreejs_things=self.webpackChunkthreejs_things||[];t.forEach(n.bind(null,0)),t.push=n.bind(null,t.push.bind(t))}();var o=r.O(void 0,[2886,9148,1215],(function(){return r(8505)}));o=r.O(o)}();