!function(){"use strict";var e,n={5081:function(e,n,t){var o=t(2212),r=t(21),i=t.n(r),a=t(5260),d=t(6426),s=t(7503),u=t(1073),l=t(5980),c=t(4486),p=t(1331),m=t(5102),v=t(6358),w=t(3379),f=t.n(w),h=t(5074),g=(f()(h.Z,{insert:"head",singleton:!1}),h.Z.locals,{rotationX:0,rotationY:0,rotationZ:0,volumeX:1,volumeY:1,volumeZ:1,camX:0,camY:60,camZ:130,lookX:0,lookY:0,lookZ:0,orbitSpeed:.002,timeSpeed:2e-4,noiseFactor:60}),b=document.getElementById("webgl"),y=new o.WebGLRenderer({antialias:!0,canvas:b,preserveDrawingBuffer:!0});y.setSize(innerWidth,innerHeight),document.body.appendChild(y.domElement);var x=new(i()),O=new o.Vector2(1,1),P=new o.Scene,S=new o.PerspectiveCamera(45,innerWidth/innerHeight,.1,1e3);S.position.set(0,60,130),S.lookAt(0,0,0),S.up.set(0,100,0);var k=new o.Object3D,L=new o.IcosahedronGeometry(30,10),E=new o.IcosahedronGeometry(30,10),j=new o.MeshStandardMaterial({color:new o.Color(1,.9,.2),roughness:.25,metalness:.8,flatShading:!0,wireframe:!1}),C=new o.Mesh(L,j),Z=new o.Mesh(E,j),H=new o.PointLight(16777215,2.2);H.position.set(0,30,40),k.add(H),new o.PointLightHelper(H,5);var z=new o.PointLight(16777215,1.7);z.position.set(30,30,0),k.add(z);var F=new o.PointLightHelper(z,5);P.add(F);var M=new o.PointLight(16777215,1.7);M.position.set(-30,30,0),k.add(M);var X=new o.PointLightHelper(M,5);P.add(X),k.add(C),P.add(k);var Y=new o.GridHelper(200,5);P.add(Y);var A=new a.xC(y),W=new d.C(P,S);A.addPass(W),(new s.t).enabled=!0,(new c.C).enabled=!0,new u._(new o.Vector2,1,5).enabled=!0;var I=new l.T(p.u);I.enabled=!0,A.addPass(I);var _=new l.T(m.g);_.uniforms.resolution.value=new o.Vector2(window.innerWidth,window.innerHeight),_.uniforms.resolution.value.multiplyScalar(window.devicePixelRatio),_.uniforms.pixelSize.value=1;var B=0;!function e(){B+=g.timeSpeed;var n=parseInt((Math.sin(5e-4*window.performance.now())+1)/2*10)/30;I.uniforms.amount.value=n,function(e,n){for(var t=Z.geometry.attributes.position,r=new o.Vector3,i=0;i<t.count;i++){r.fromBufferAttribute(t,i);var a=(x.noise3D(r.x/g.noiseFactor+7*n,r.y/g.noiseFactor+8*n,r.z/g.noiseFactor+9*n)+1)/2*.8+0;r.multiplyScalar(2*a),r.multiply({x:g.volumeX,y:g.volumeY,z:g.volumeZ}),e.geometry.attributes.position.setXYZ(i,r.x,r.y,r.z)}e.geometry.attributes.position.needsUpdate=!0}(C,B),A.render(),requestAnimationFrame(e)}(),document.body.addEventListener("click",(function(){var e=v.ZP.timeline({paused:!0});e.to(g,{duration:5,orbitSpeed:.05,timeSpeed:.003,noiseFactor:10,ease:"Power3.easeInOut"}),e.to(g,{duration:1,orbitSpeed:.002,timeSpeed:2e-4,noiseFactor:60,ease:"Power3.easeOut"}),e.to(g,{duration:0,isOrbitAnimating:!1}),g.isOrbitAnimating||(e.play(),g.isOrbitAnimating=!0)})),y.domElement.addEventListener("mousemove",(function(e){O.x=e.clientX/window.innerWidth*2-1,O.y=-e.clientY/window.innerHeight*2+1,H.position.x=25*O.x,H.position.y=8*(O.y+5)})),window.addEventListener("resize",(function(){var e=innerWidth,n=innerHeight;y.setSize(e,n),S.aspect=e/n,S.updateProjectionMatrix()})),document.addEventListener("keydown",(function(e){"p"===e.key&&function(){try{var e="image/jpeg",n=y.domElement.toDataURL(e),t=document.getElementsByTagName("script"),o=t[t.length-1],r=new URL(o.src).pathname.slice(1,-3);G(n.replace(e,D),r+".jpg")}catch(e){return void console.log(e)}}()}));var D="image/octet-stream",G=function(e,n){var t=document.createElement("a");"string"==typeof t.download?(document.body.appendChild(t),t.download=n,t.href=e,t.click(),document.body.removeChild(t)):location.replace(uri)}},5074:function(e,n,t){var o=t(3645),r=t.n(o)()((function(e){return e[1]}));r.push([e.id,".panel {\r\n  color: #eee;\r\n  border: 1px solid #eee;\r\n  position: absolute;\r\n  left: 0;\r\n  top: 0;\r\n  padding: 20px;\r\n  margin: 20px;\r\n}\r\n",""]),n.Z=r}},t={};function o(e){var r=t[e];if(void 0!==r)return r.exports;var i=t[e]={id:e,exports:{}};return n[e](i,i.exports,o),i.exports}o.m=n,e=[],o.O=function(n,t,r,i){if(!t){var a=1/0;for(u=0;u<e.length;u++){t=e[u][0],r=e[u][1],i=e[u][2];for(var d=!0,s=0;s<t.length;s++)(!1&i||a>=i)&&Object.keys(o.O).every((function(e){return o.O[e](t[s])}))?t.splice(s--,1):(d=!1,i<a&&(a=i));d&&(e.splice(u--,1),n=r())}return n}i=i||0;for(var u=e.length;u>0&&e[u-1][2]>i;u--)e[u]=e[u-1];e[u]=[t,r,i]},o.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(n,{a:n}),n},o.d=function(e,n){for(var t in n)o.o(n,t)&&!o.o(e,t)&&Object.defineProperty(e,t,{enumerable:!0,get:n[t]})},o.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},function(){var e={5258:0};o.O.j=function(n){return 0===e[n]};var n=function(n,t){var r,i,a=t[0],d=t[1],s=t[2],u=0;for(r in d)o.o(d,r)&&(o.m[r]=d[r]);if(s)var l=s(o);for(n&&n(t);u<a.length;u++)i=a[u],o.o(e,i)&&e[i]&&e[i][0](),e[a[u]]=0;return o.O(l)},t=self.webpackChunkthreejs_things=self.webpackChunkthreejs_things||[];t.forEach(n.bind(null,0)),t.push=n.bind(null,t.push.bind(t))}();var r=o.O(void 0,[6358,6089],(function(){return o(5081)}));r=o.O(r)}();