!function(){"use strict";var e,t={8621:function(e,t,o){var n=o(2212),r=o(21),i=o.n(r),a=o(6358),s=!0,c={x:0,y:0,z:0,rotationX:0,rotationY:0,rotationZ:0,volumeX:1,volumeY:1,volumeZ:1,camX:0,camY:60,camZ:130,lookX:0,lookY:0,lookZ:0,orbitSpeed:.002,timeSpeed:2e-4,p:1,noiseFactor:1},u=new(i()),d=new n.Vector2(1,1),l=new n.Raycaster,m=new n.Scene,p=new n.PerspectiveCamera(45,innerWidth/innerHeight,.1,1e3);p.position.set(0,60,130),p.up.set(0,100,0);var v=new n.WebGLRenderer({antialias:!0});v.setSize(innerWidth,innerHeight),document.body.appendChild(v.domElement);var f=new n.Object3D,y=new n.IcosahedronGeometry(30,10),h=new n.IcosahedronGeometry(30,10),b=new n.MeshStandardMaterial({color:new n.Color(1,.9,.2),roughness:.25,metalness:.8,flatShading:!0}),w=new n.Mesh(y,b),g=new n.Mesh(h,b),k=new n.PointLight(16777215,2.2);k.position.set(0,30,40),f.add(k);var O=new n.PointLight(16777215,1.7);O.position.set(60,30,0),f.add(O);var x=new n.PointLight(16777215,1.7);x.position.set(-60,30,0),f.add(x),f.add(w),m.add(f);var Z=new n.GridHelper(200,5);m.add(Z);var X=0;!function e(){w.geometry.parameters.p=c.p,s&&(X+=c.timeSpeed);var t=(Math.sin(2*X*30)+1)/2,o=(Math.cos(2*X*30)+1)/2,r=(Math.cos(2*X*10)+1)/2;w.material.color=new n.Color(t,o,r),s&&p.lookAt(c.lookX,c.lookY,c.lookZ),s&&p.position.set(c.camX,c.camY,c.camZ),w.material.wireframe=!1,l.setFromCamera(d,p),l.intersectObjects(m.children).forEach((function(e){"IcosahedronGeometry"===e.object.geometry.type&&(e.object.material.wireframe=!0)})),function(e,t){for(var o=g.geometry.attributes.position,r=new n.Vector3,i=0;i<o.count;i++){r.fromBufferAttribute(o,i);var a="IcosahedronGeometry"===w.geometry.type?2:3,s=(u.noise3D(r.x/c.noiseFactor+7*t,r.y/c.noiseFactor+8*t,r.z/c.noiseFactor+9*t)+1)/2*.8+0;r.multiplyScalar(s*a),r.multiply({x:c.volumeX,y:c.volumeY,z:c.volumeZ}),e.geometry.attributes.position.setXYZ(i,r.x,r.y,r.z)}e.geometry.attributes.position.needsUpdate=!0}(w,X),v.render(m,p),f.rotation.set(c.rotationX,c.rotationY,c.rotationZ),s&&f.position.set(c.x,c.y,c.z),requestAnimationFrame(e)}(),v.domElement.addEventListener("mousemove",(function(e){d.x=e.clientX/window.innerWidth*2-1,d.y=-e.clientY/window.innerHeight*2+1,k.position.x=25*d.x,k.position.y=8*(d.y+5)}));var Y=!1;function P(){var e=a.ZP.timeline({paused:!0}),t=Y?100:5,o=Y?5:100;Y=!Y,e.to(c,{duration:1.5,orbitSpeed:.05,timeSpeed:.003,noiseFactor:t,ease:"Power2.easeInOut"}),e.to(c,{duration:1,orbitSpeed:.002,noiseFactor:o,timeSpeed:2e-4,ease:"Power2.easeOut"}),e.to(c,{duration:0,isOrbitAnimating:!1}),c.isOrbitAnimating||(e.play(),c.isOrbitAnimating=!0)}document.body.addEventListener("touchmove",P),document.body.addEventListener("wheel",P);var S=document.createElement("button");S.innerText="click",S.style.border="none",S.style.background="#6c9",S.style.padding="10px",S.style.borderRadius="10px",S.style.position="absolute",S.style.left="0px",S.style.top="0px",S.style.cursor="pointer";var j=!0;S.addEventListener("click",(function(){j?(a.ZP.to(c,1.5,{x:100,z:-170,rotationX:.6,rotationZ:.6,volumeY:-.15,camX:100,camZ:-100,lookX:150,lookZ:-150,ease:"Power3.inOut"}),setTimeout((function(){s=!1}),1500)):(s=!0,a.ZP.to(c,1.5,{x:0,y:0,z:0,rotationX:0,rotationY:0,rotationZ:0,volumeX:1,volumeY:1,volumeZ:1,camX:0,camY:60,camZ:130,lookX:0,lookY:0,lookZ:0,ease:"power3.inOut"})),j=!j})),document.body.appendChild(S)}},o={};function n(e){var r=o[e];if(void 0!==r)return r.exports;var i=o[e]={exports:{}};return t[e](i,i.exports,n),i.exports}n.m=t,e=[],n.O=function(t,o,r,i){if(!o){var a=1/0;for(u=0;u<e.length;u++){o=e[u][0],r=e[u][1],i=e[u][2];for(var s=!0,c=0;c<o.length;c++)(!1&i||a>=i)&&Object.keys(n.O).every((function(e){return n.O[e](o[c])}))?o.splice(c--,1):(s=!1,i<a&&(a=i));s&&(e.splice(u--,1),t=r())}return t}i=i||0;for(var u=e.length;u>0&&e[u-1][2]>i;u--)e[u]=e[u-1];e[u]=[o,r,i]},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,{a:t}),t},n.d=function(e,t){for(var o in t)n.o(t,o)&&!n.o(e,o)&&Object.defineProperty(e,o,{enumerable:!0,get:t[o]})},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},function(){var e={567:0};n.O.j=function(t){return 0===e[t]};var t=function(t,o){var r,i,a=o[0],s=o[1],c=o[2],u=0;for(r in s)n.o(s,r)&&(n.m[r]=s[r]);if(c)var d=c(n);for(t&&t(o);u<a.length;u++)i=a[u],n.o(e,i)&&e[i]&&e[i][0](),e[a[u]]=0;return n.O(d)},o=self.webpackChunkthreejs_things=self.webpackChunkthreejs_things||[];o.forEach(t.bind(null,0)),o.push=t.bind(null,o.push.bind(o))}();var r=n.O(void 0,[9148,6788],(function(){return n(8621)}));r=n.O(r)}();