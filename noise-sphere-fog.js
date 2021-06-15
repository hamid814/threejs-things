!function(){"use strict";var e,t={6501:function(e,t,o){var n=o(2212),r=o(21),i=o.n(r),a=o(6358),l=!0,c={x:0,y:0,z:0,rotationX:0,rotationY:0,rotationZ:0,volumeX:1,volumeY:1,volumeZ:1,camX:0,camY:60,camZ:130,lookX:0,lookY:0,lookZ:0},s=document.getElementById("webgl"),u=new n.WebGLRenderer({antialias:!0,canvas:s,preserveDrawingBuffer:!0});u.setSize(innerWidth,innerHeight),document.body.appendChild(u.domElement);var d=new(i()),m=new n.Vector2(1,1),p=new n.Scene,v=new n.Color(.1,.1,.1);p.background=v,p.add(new n.AmbientLight(v,2.5)),p.fog=new n.Fog(v,10,160);var f=new n.PerspectiveCamera(45,innerWidth/innerHeight,.1,1e3);f.position.set(0,60,130),f.up.set(0,100,0);var h=new n.Object3D,y=new n.IcosahedronGeometry(30,10),w=new n.IcosahedronGeometry(30,10),g=new n.MeshStandardMaterial({color:new n.Color(1,.9,.2),roughness:.25,metalness:.8,flatShading:!0}),b=new n.Mesh(y,g),k=new n.Mesh(w,g),x=new n.PointLight(6737049,2.2);x.position.set(0,30,40),h.add(x);var Z=new n.PointLight(13408614,1.7);Z.position.set(30,30,0),h.add(Z);var X=new n.PointLight(6724044,1.7);X.position.set(-30,30,0),h.add(X),h.add(b),p.add(h);var Y=new n.GridHelper(200,5);p.add(Y);var O=0;!function e(){l&&(O+=2e-4);var t=(Math.sin(2*O*30)+1)/2,o=(Math.cos(2*O*30)+1)/2,r=(Math.cos(2*O*10)+1)/2;b.material.color=new n.Color(t,o,r),l&&f.lookAt(c.lookX,c.lookY,c.lookZ),l&&f.position.set(c.camX,c.camY,c.camZ),b.material.wireframe=!1,function(e,t){for(var o=k.geometry.attributes.position,r=new n.Vector3,i=0;i<o.count;i++){r.fromBufferAttribute(o,i);var a=(d.noise3D(r.x/20+7*t,r.y/20+8*t,r.z/20+9*t)+1)/2*.4+.8;r.multiplyScalar(1*a),r.multiply({x:c.volumeX,y:c.volumeY,z:c.volumeZ}),e.geometry.attributes.position.setXYZ(i,r.x,r.y,r.z)}e.geometry.attributes.position.needsUpdate=!0}(b,O),h.rotation.set(c.rotationX,c.rotationY,c.rotationZ),l&&(b.rotation.y+=.002),l&&h.position.set(c.x,c.y,c.z),u.render(p,f),requestAnimationFrame(e)}(),document.body.addEventListener("mousemove",(function(e){m.x=e.clientX/window.innerWidth*2-1,m.y=-e.clientY/window.innerHeight*2+1,x.position.x=25*m.x,x.position.y=8*(m.y+5)}));var L=document.createElement("button");L.classList="selectable",L.innerText="click",L.style.border="none",L.style.background="#6c9",L.style.padding="10px",L.style.borderRadius="10px",L.style.position="absolute",L.style.left="0px",L.style.top="0px";var E=!0;L.addEventListener("click",(function(){E?(a.ZP.timeline().to(c,1.5,{x:100,z:-160,camX:100,camZ:-100,lookX:150,lookZ:-150,rotationX:.6,rotationZ:.6,volumeX:.25,volumeY:.25,volumeZ:.25,ease:"power3.inOut"}),setTimeout((function(){l=!1}),1500)):(l=!0,a.ZP.to(c,1.5,{x:0,y:0,z:0,rotationX:0,rotationY:0,rotationZ:0,volumeX:1,volumeY:1,volumeZ:1,camX:0,camY:60,camZ:130,lookX:0,lookY:0,lookZ:0,ease:"power3.inOut"})),E=!E})),document.body.appendChild(L),window.addEventListener("resize",(function(){var e=innerWidth,t=innerHeight;u.setSize(e,t),f.aspect=e/t,f.updateProjectionMatrix()})),document.addEventListener("keydown",(function(e){"p"===e.key&&function(){try{var e="image/jpeg",t=u.domElement.toDataURL(e),o=document.getElementsByTagName("script"),n=o[o.length-1],r=new URL(n.src).pathname.slice(1,-3);z(t.replace(e,j),r+".jpg")}catch(e){return void console.log(e)}}()}));var j="image/octet-stream",z=function(e,t){var o=document.createElement("a");"string"==typeof o.download?(document.body.appendChild(o),o.download=t,o.href=e,o.click(),document.body.removeChild(o)):location.replace(uri)}}},o={};function n(e){var r=o[e];if(void 0!==r)return r.exports;var i=o[e]={exports:{}};return t[e](i,i.exports,n),i.exports}n.m=t,e=[],n.O=function(t,o,r,i){if(!o){var a=1/0;for(s=0;s<e.length;s++){o=e[s][0],r=e[s][1],i=e[s][2];for(var l=!0,c=0;c<o.length;c++)(!1&i||a>=i)&&Object.keys(n.O).every((function(e){return n.O[e](o[c])}))?o.splice(c--,1):(l=!1,i<a&&(a=i));l&&(e.splice(s--,1),t=r())}return t}i=i||0;for(var s=e.length;s>0&&e[s-1][2]>i;s--)e[s]=e[s-1];e[s]=[o,r,i]},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,{a:t}),t},n.d=function(e,t){for(var o in t)n.o(t,o)&&!n.o(e,o)&&Object.defineProperty(e,o,{enumerable:!0,get:t[o]})},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},function(){var e={8380:0};n.O.j=function(t){return 0===e[t]};var t=function(t,o){var r,i,a=o[0],l=o[1],c=o[2],s=0;for(r in l)n.o(l,r)&&(n.m[r]=l[r]);if(c)var u=c(n);for(t&&t(o);s<a.length;s++)i=a[s],n.o(e,i)&&e[i]&&e[i][0](),e[a[s]]=0;return n.O(u)},o=self.webpackChunkthreejs_things=self.webpackChunkthreejs_things||[];o.forEach(t.bind(null,0)),o.push=t.bind(null,o.push.bind(o))}();var r=n.O(void 0,[9148,6788],(function(){return n(6501)}));r=n.O(r)}();