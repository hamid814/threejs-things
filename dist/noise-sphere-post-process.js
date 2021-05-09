!function(){"use strict";var e,t={6828:function(e,t,o){var n=o(2212),i=o(21),r=o.n(i),a=o(5260),s=o(6426),u=o(7503),d=o(1073),l=o(5980),c=o(4486),m=o(1331),p=o(5102),v=o(6358),w=!0,f={x:0,y:0,z:0,rotationX:0,rotationY:0,rotationZ:0,volumeX:1,volumeY:1,volumeZ:1,camX:0,camY:60,camZ:130,lookX:0,lookY:0,lookZ:0,orbitSpeed:.002,timeSpeed:2e-4,noiseFactor:60},h=new(r()),y=new n.Vector2(1,1),b=new n.Raycaster,g=new n.Scene,x=new n.PerspectiveCamera(45,innerWidth/innerHeight,.1,1e3);x.position.set(0,60,130),x.lookAt(0,0,0),x.up.set(0,100,0);var k=new n.WebGLRenderer({antialias:!0});k.setSize(innerWidth,innerHeight),document.body.appendChild(k.domElement);var O=new n.Object3D,Z=new n.IcosahedronGeometry(30,10),P=new n.IcosahedronGeometry(30,10),X=new n.MeshStandardMaterial({color:new n.Color(1,.9,.2),roughness:.25,metalness:.8,flatShading:!0,wireframe:!1}),S=new n.Mesh(Z,X),Y=new n.Mesh(P,X),L=new n.PointLight(16777215,2.2);L.position.set(0,30,40),O.add(L),new n.PointLightHelper(L,5);var j=new n.PointLight(16777215,1.7);j.position.set(30,30,0),O.add(j);var C=new n.PointLightHelper(j,5);g.add(C);var z=new n.PointLight(16777215,1.7);z.position.set(-30,30,0),O.add(z);var E=new n.PointLightHelper(z,5);g.add(E),O.add(S),g.add(O);var M=new n.GridHelper(200,5);g.add(M);var F=new a.xC(k),H=new s.C(g,x);F.addPass(H),(new u.t).enabled=!0,(new c.C).enabled=!0,new d._(new n.Vector2,1,5).enabled=!0;var A=new l.T(m.u);A.enabled=!0,F.addPass(A);var G=new l.T(p.g);G.uniforms.resolution.value=new n.Vector2(window.innerWidth,window.innerHeight),G.uniforms.resolution.value.multiplyScalar(window.devicePixelRatio),G.uniforms.pixelSize.value=1,S.geometry.attributes.position.count;var I=0;function W(){var e=v.ZP.timeline({paused:!0});e.to(f,{duration:5,orbitSpeed:.05,timeSpeed:.003,noiseFactor:10,ease:"Power3.easeInOut"}),e.to(f,{duration:1,orbitSpeed:.002,timeSpeed:2e-4,noiseFactor:60,ease:"Power3.easeOut"}),e.to(f,{duration:0,isOrbitAnimating:!1}),f.isOrbitAnimating||(e.play(),f.isOrbitAnimating=!0)}!function e(){w&&(I+=f.timeSpeed),Math.sin(2*I*30),Math.cos(2*I*30),Math.cos(2*I*10);var t=parseInt((Math.sin(5e-4*window.performance.now())+1)/2*10)/30;A.uniforms.amount.value=t,w&&x.lookAt(f.lookX,f.lookY,f.lookZ),w&&x.position.set(f.camX,f.camY,f.camZ),S.material.wireframe=!1,b.setFromCamera(y,x),b.intersectObjects(g.children).forEach((function(e){"IcosahedronGeometry"===e.object.geometry.type&&(e.object.material.wireframe=!0)})),function(e,t){for(var o=Y.geometry.attributes.position,i=new n.Vector3,r=0;r<o.count;r++){i.fromBufferAttribute(o,r);var a=(h.noise3D(i.x/f.noiseFactor+7*t,i.y/f.noiseFactor+8*t,i.z/f.noiseFactor+9*t)+1)/2*.8+0;i.multiplyScalar(2*a),i.multiply({x:f.volumeX,y:f.volumeY,z:f.volumeZ}),e.geometry.attributes.position.setXYZ(r,i.x,i.y,i.z)}e.geometry.attributes.position.needsUpdate=!0}(S,I),F.render(),O.rotation.set(f.rotationX,f.rotationY,f.rotationZ),w&&(S.rotation.y+=f.orbitSpeed),w&&O.position.set(f.x,f.y,f.z),requestAnimationFrame(e)}(),document.body.addEventListener("touchmove",W),document.body.addEventListener("wheel",W),k.domElement.addEventListener("mousemove",(function(e){y.x=e.clientX/window.innerWidth*2-1,y.y=-e.clientY/window.innerHeight*2+1,L.position.x=25*y.x,L.position.y=8*(y.y+5)}));var _=document.createElement("button");_.innerText="click",_.style.border="none",_.style.background="#6c9",_.style.padding="10px",_.style.borderRadius="10px",_.style.position="absolute",_.style.left="0px",_.style.top="0px",_.style.cursor="pointer";var R=!0;_.addEventListener("click",(function(){R?(v.ZP.to(f,1.5,{x:100,z:-170,rotationX:.6,rotationZ:.6,volumeY:-.15,camX:100,camZ:-100,lookX:150,lookZ:-150,ease:"power3.inOut"}),setTimeout((function(){w=!1}),1500)):(w=!0,v.ZP.to(f,1.5,{x:0,y:0,z:0,rotationX:0,rotationY:0,rotationZ:0,volumeX:1,volumeY:1,volumeZ:1,camX:0,camY:60,camZ:130,lookX:0,lookY:0,lookZ:0,ease:"power3.inOut"})),R=!R})),document.body.appendChild(_)}},o={};function n(e){var i=o[e];if(void 0!==i)return i.exports;var r=o[e]={exports:{}};return t[e](r,r.exports,n),r.exports}n.m=t,e=[],n.O=function(t,o,i,r){if(!o){var a=1/0;for(d=0;d<e.length;d++){o=e[d][0],i=e[d][1],r=e[d][2];for(var s=!0,u=0;u<o.length;u++)(!1&r||a>=r)&&Object.keys(n.O).every((function(e){return n.O[e](o[u])}))?o.splice(u--,1):(s=!1,r<a&&(a=r));s&&(e.splice(d--,1),t=i())}return t}r=r||0;for(var d=e.length;d>0&&e[d-1][2]>r;d--)e[d]=e[d-1];e[d]=[o,i,r]},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,{a:t}),t},n.d=function(e,t){for(var o in t)n.o(t,o)&&!n.o(e,o)&&Object.defineProperty(e,o,{enumerable:!0,get:t[o]})},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},function(){var e={2707:0};n.O.j=function(t){return 0===e[t]};var t=function(t,o){var i,r,a=o[0],s=o[1],u=o[2],d=0;for(i in s)n.o(s,i)&&(n.m[i]=s[i]);if(u)var l=u(n);for(t&&t(o);d<a.length;d++)r=a[d],n.o(e,r)&&e[r]&&e[r][0](),e[a[d]]=0;return n.O(l)},o=self.webpackChunkthreejs_things=self.webpackChunkthreejs_things||[];o.forEach(t.bind(null,0)),o.push=t.bind(null,o.push.bind(o))}();var i=n.O(void 0,[9148,7214],(function(){return n(6828)}));i=n.O(i)}();