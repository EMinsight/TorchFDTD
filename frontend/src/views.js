import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { TransformControls } from 'three/addons/controls/TransformControls.js';
import {snapMesh,pmlThickness} from './mesh.js';
import {structureGeometry,projectedGeometry,hitProjected} from './geometry.js';

const colors = { region: '#d2a129', source: '#d44955', monitor: '#e3a72c', selected: '#187be7' };
export class Views {
  constructor(container, state, select, change, edited) {
    this.state = state; this.select = select; this.change = change; this.edited = edited;
    this.zoom = {xy: 1, xz: 1, yz: 1}; this.canvases = {};
    container.innerHTML = ['xy','perspective','xz','yz'].map(name => `<div class="viewport ${name}" data-view="${name}"><div class="view-label">${name === 'perspective' ? 'Perspective' : name.toUpperCase() + ' plane'}<span>${name === 'perspective' ? 'Orbit · left drag / Pan · right drag' : 'Select · drag to move / scroll to zoom'}</span></div>${name !== 'perspective' ? '<canvas></canvas>' : '<div class="three-view"></div>'}</div>`).join('');
    for (const [name,axes] of Object.entries({xy:[0,1],xz:[0,2],yz:[1,2]})) {
      const canvas = container.querySelector(`.${name} canvas`);
      this.canvases[name] = {canvas,axes};
      canvas.addEventListener('wheel', e=>{e.preventDefault(); this.zoom[name]=Math.max(.5, Math.min(8,this.zoom[name]*Math.exp(-e.deltaY*.001)));this.draw2d(name);},{passive:false});
      canvas.addEventListener('pointerdown', e=>this.down(e,name));
      canvas.addEventListener('pointermove', e=>this.move(e,name));
      canvas.addEventListener('pointerup', e=>this.up(e,name));
      canvas.addEventListener('dblclick', ()=>document.querySelector('#properties input')?.focus());
    }
    this.initThree(container.querySelector('.three-view'));
    this.resizeObserver = new ResizeObserver(()=>this.render()); this.resizeObserver.observe(container);
  }
  objects() {
    const p=this.state.project;
    return [...p.structures.map(o=>({...o,category:'structure'})),...p.sources.map(o=>({...o,category:'source'})),...p.monitors.map(o=>({...o,category:'monitor'}))];
  }
  bounds(o) { return o.kind==='sphere' ? [o.radius*2,o.radius*2,o.radius*2] : ['circle','ring'].includes(o.kind) ? [o.radius*2,o.radius*2,o.size[2]] : o.size || [.12,.12,.12]; }
  metrics(name) {
    const {canvas,axes}=this.canvases[name], rect=canvas.getBoundingClientRect(), size=this.state.project.region.size;
    return {w:rect.width,h:rect.height, scale:Math.min((rect.width-65)/size[axes[0]],(rect.height-50)/size[axes[1]])*.84*this.zoom[name], axes};
  }
  world(e,name) { const {canvas}=this.canvases[name],r=canvas.getBoundingClientRect(),m=this.metrics(name);return [(e.clientX-r.left-m.w/2)/m.scale,-(e.clientY-r.top-m.h/2)/m.scale]; }
  hit(o,point,axes,tol) {
    if(o.category==='structure')return hitProjected(o,point,axes,tol);
    const s=this.bounds(o); let u=point[0]-o.center[axes[0]],v=point[1]-o.center[axes[1]];
    if (axes[0]===0&&axes[1]===1&&o.category==='structure') {
      if (['circle','sphere','ring'].includes(o.kind)) { const d=Math.hypot(u,v); return d<=o.radius+tol&&(o.kind!=='ring'||d>=o.inner_radius-tol); }
      const a=(o.rotation||0)*Math.PI/180; [u,v]=[Math.cos(a)*u+Math.sin(a)*v,-Math.sin(a)*u+Math.cos(a)*v];
    }
    return Math.abs(u)<=Math.max(s[axes[0]]/2,tol)&&Math.abs(v)<=Math.max(s[axes[1]]/2,tol);
  }
  down(e,name) {
    if (e.button!==0) return;
    const m=this.metrics(name), point=this.world(e,name), objects=this.objects().filter(o=>o.enabled);
    const hit=objects.reverse().find(o=>this.hit(o,point,m.axes,7/m.scale));
    const extend=e.ctrlKey||e.metaKey;
    this.select(hit?.id||'fdtd',extend);
    if (hit&&!extend&&this.state.mode==='layout') { this.drag={id:hit.id,start:point,center:[...hit.center],axes:m.axes,name,moved:false}; e.target.setPointerCapture(e.pointerId); }
  }
  move(e,name) {
    if (!this.drag||this.drag.name!==name) return;
    const point=this.world(e,name),d=this.drag,p=this.state.project;
    const center=[...d.center];
    d.axes.forEach((a,i)=>{if(a===2&&p.region.dimension==='2d')return;const val=d.center[a]+point[i]-d.start[i]; center[a]=this.state.snap ? snapMesh(p.region,a,val) : val;});
    if (!d.moved && Math.hypot(point[0]-d.start[0],point[1]-d.start[1])<.02) return;
    if(!d.moved)this.edited(); d.moved=true;
    this.change(d.id,{center},false); this.render();
  }
  up() {if(this.drag?.moved)this.change(this.drag.id,{},true);this.drag=null;}
  draw2d(name) {
    const {canvas,axes}=this.canvases[name],m=this.metrics(name),p=this.state.project;
    if(m.w<1||m.h<1)return;
    const dpr=window.devicePixelRatio||1;canvas.width=m.w*dpr;canvas.height=m.h*dpr;
    const ctx=canvas.getContext('2d');ctx.scale(dpr,dpr);ctx.fillStyle='#fafbfd';ctx.fillRect(0,0,m.w,m.h);
    const tx=x=>m.w/2+x*m.scale,ty=y=>m.h/2-y*m.scale;
    const desired=45/m.scale,base=10**Math.floor(Math.log10(desired));
    const spacing=[1,2,5,10].find(v=>v*base>=desired)*base,decimals=Math.max(0,-Math.floor(Math.log10(spacing)));
    ctx.font='10px ui-monospace, monospace';ctx.textAlign='center';
    for(let axis=0;axis<2;axis++) {
      const span=(axis===0?m.w:m.h)/m.scale;
      for(let v=Math.ceil(-span/2/spacing)*spacing;v<=span/2;v+=spacing) {
        const at=axis===0?tx(v):ty(v);ctx.strokeStyle=Math.abs(v)<1e-7?'#bac8d8':'#e6ebf2';ctx.lineWidth=1;ctx.beginPath();
        if(axis===0){ctx.moveTo(at,0);ctx.lineTo(at,m.h);ctx.fillStyle='#8b98a9';ctx.fillText(v.toFixed(decimals),at,m.h-9);}
        else{ctx.moveTo(0,at);ctx.lineTo(m.w,at);ctx.fillStyle='#8b98a9';ctx.fillText(v.toFixed(decimals),18,at-4);}
        ctx.stroke();
      }
    }
    const rw=p.region.size[axes[0]]*m.scale,rh=p.region.size[axes[1]]*m.scale,px=m.w/2-rw/2,py=m.h/2-rh/2;
    ctx.fillStyle='#f0c85612';ctx.fillRect(px,py,rw,rh);ctx.strokeStyle=colors.region;ctx.setLineDash([6,4]);ctx.strokeRect(px,py,rw,rh);ctx.setLineDash([]);
    const layer=(axis,side)=>pmlThickness(p.region,axis,side)*m.scale;
    const left=layer(axes[0],'min'),right=layer(axes[0],'max'),bottom=layer(axes[1],'min'),top=layer(axes[1],'max');
    ctx.fillStyle='#d8ae3d12';ctx.fillRect(px,py,rw,top);ctx.fillRect(px,py+rh-bottom,rw,bottom);ctx.fillRect(px,py,left,rh);ctx.fillRect(px+rw-right,py,right,rh);
    for(const o of this.objects()) {
      if(!o.enabled)continue;
      const s=this.bounds(o),x=tx(o.center[axes[0]]),y=ty(o.center[axes[1]]),w=Math.max(s[axes[0]]*m.scale,3),h=Math.max(s[axes[1]]*m.scale,3);
      const selected=o.id===this.state.selected||this.state.multi?.includes(o.id), mat=p.materials.find(a=>a.name===o.material);
      ctx.save();ctx.translate(x,y);
      ctx.strokeStyle=selected?colors.selected:o.category==='source'?colors.source:o.category==='monitor'?colors.monitor:mat?.color||'#69a1e8';ctx.lineWidth=selected?2:1.5;
      ctx.fillStyle=o.kind==='tfsf'?'#3ba89710':o.category==='structure'?(mat?.color||'#69a1e8')+'55':'#ffffff88';ctx.beginPath();
      if(o.kind==='tfsf')ctx.setLineDash([5,3]);
      if(o.category==='structure'){
        const d=projectedGeometry(o,axes);
        for(const points of d.triangles){ctx.moveTo(points[0][0]*m.scale,-points[0][1]*m.scale);for(const v of points.slice(1))ctx.lineTo(v[0]*m.scale,-v[1]*m.scale);ctx.closePath();}
        ctx.fill();ctx.beginPath();
        for(const [a,b] of d.edges){ctx.moveTo(a[0]*m.scale,-a[1]*m.scale);ctx.lineTo(b[0]*m.scale,-b[1]*m.scale);}ctx.stroke();
        if(selected){ctx.fillStyle=colors.selected;ctx.font='11px Inter,Segoe UI,sans-serif';ctx.fillText(o.name,0,-d.high*m.scale-9);}
      }
      else if(o.category==='monitor'&&o.kind!=='field'){ctx.moveTo(-7,0);ctx.lineTo(7,0);ctx.moveTo(0,-7);ctx.lineTo(0,7);ctx.stroke();ctx.beginPath();ctx.arc(0,0,4,0,2*Math.PI);ctx.stroke();}
      else if(o.category==='source'&&o.kind==='point'){ctx.arc(0,0,5,0,2*Math.PI);ctx.fillStyle=colors.source;ctx.fill();ctx.stroke();}
      else {
        if((name==='xy'&&['circle','ring'].includes(o.kind))||o.kind==='sphere'){ctx.ellipse(0,0,w/2,h/2,0,0,Math.PI*2);if(o.kind==='ring'){ctx.ellipse(0,0,o.inner_radius*m.scale,o.inner_radius*m.scale,0,0,Math.PI*2,true);}}
        else ctx.rect(-w/2,-h/2,w,h);
        ctx.fill('evenodd');ctx.stroke();
        if(o.category==='source'&&o.kind==='plane'){
          // Propagation arrows along the sheet normal: one for a one-way plane, both ways for a soft sheet.
          const zero=o.size.findIndex((v,i)=>v===0&&(p.region.dimension==='3d'||i<2)),normal=o.injection==='oneway'?(o.normal||'x'):(zero>=0?'xyz'[zero]:o.normal||'x'),a='xyz'.indexOf(normal);
          if(axes.includes(a)){const horizontal=axes[0]===a,signs=o.injection==='oneway'?[o.direction==='-'?-1:1]:[1,-1];ctx.lineWidth=1.5;ctx.fillStyle=ctx.strokeStyle;
            for(const sign of signs){const dx=horizontal?sign:0,dy=horizontal?0:-sign,L=16;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(dx*L,dy*L);ctx.stroke();ctx.beginPath();ctx.moveTo(dx*L,dy*L);ctx.lineTo(dx*(L-6)+dy*4,dy*(L-6)-dx*4);ctx.lineTo(dx*(L-6)-dy*4,dy*(L-6)+dx*4);ctx.closePath();ctx.fill();}}
        }
      }
      if(selected&&o.category!=='structure'){ctx.fillStyle='#187be7';ctx.font='11px Inter,Segoe UI,sans-serif';ctx.fillText(o.name,0,-h/2-9);}
      ctx.restore();
    }
    ctx.fillStyle='#617187';ctx.textAlign='right';ctx.font='10px Segoe UI';ctx.fillText(`${'xyz'[axes[0]]} / ${'xyz'[axes[1]]} (µm)`,m.w-10,m.h-9);
    if(p.region.dimension==='2d'&&name!=='xy'){ctx.fillStyle='#8591a2';ctx.textAlign='left';ctx.fillText('2D: simulation at z = 0',10,18);}
  }
  initThree(host) {
    this.host=host;this.scene=new THREE.Scene();this.scene.background=new THREE.Color('#f3f6fa');
    this.camera=new THREE.PerspectiveCamera(40,1,.01,1000);this.camera.up.set(0,0,1);this.camera.position.set(10,-12,10);
    this.renderer=new THREE.WebGLRenderer({antialias:true});this.renderer.setPixelRatio(Math.min(devicePixelRatio,2));host.appendChild(this.renderer.domElement);
    this.orbit=new OrbitControls(this.camera,this.renderer.domElement);this.orbit.enableDamping=true;
    this.scene.add(new THREE.HemisphereLight(0xffffff,0xa3b5cb,2.5));const light=new THREE.DirectionalLight(0xffffff,2);light.position.set(5,-3,8);this.scene.add(light);
    this.scene.add(new THREE.AxesHelper(1.5));this.group=new THREE.Group();this.scene.add(this.group);
    this.transform=new TransformControls(this.camera,this.renderer.domElement);this.scene.add(this.transform.getHelper());
    this.transform.addEventListener('dragging-changed',e=>{this.orbit.enabled=!e.value;if(e.value)this.edited();else if(this.transform.object)this.change(this.transform.object.userData.id,{},true);});
    this.transform.addEventListener('objectChange',()=>{const obj=this.transform.object;if(!obj)return;let center=obj.position.toArray();if(this.state.snap)center=center.map((x,a)=>snapMesh(this.state.project.region,a,x));this.change(obj.userData.id,{center},false);for(const n of Object.keys(this.canvases))this.draw2d(n);});
    let start;
    this.renderer.domElement.addEventListener('pointerdown',e=>{start=[e.clientX,e.clientY];});
    this.renderer.domElement.addEventListener('pointerup',e=>{
      if(!start||Math.hypot(e.clientX-start[0],e.clientY-start[1])>4||this.transform.axis)return;
      const r=host.getBoundingClientRect(),ray=new THREE.Raycaster();ray.setFromCamera(new THREE.Vector2((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1),this.camera);
      const hit=ray.intersectObjects(this.group.children,true).find(x=>x.object.userData.id);if(hit)this.select(hit.object.userData.id);
    });
    const animate=()=>{requestAnimationFrame(animate);this.orbit.update();this.renderer.render(this.scene,this.camera);};animate();
  }
  renderThree() {
    if(this.transform.dragging)return;
    this.transform.detach();
    this.group.traverse(o=>{o.geometry?.dispose();if(o.material){for(const mat of Array.isArray(o.material)?o.material:[o.material])mat.dispose();}});this.group.clear();
    const p=this.state.project;
    const box=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(...p.region.size)),new THREE.LineBasicMaterial({color:colors.region}));this.group.add(box);
    const grid=new THREE.GridHelper(Math.max(...p.region.size)*1.4,20,'#b7c5d5','#dfe6ee');grid.rotateX(Math.PI/2);grid.position.z=-p.region.size[2]/2;this.group.add(grid);
    for(const o of this.objects()) {
      if(!o.enabled)continue;
      let geometry;
      if(o.category==='structure')geometry=structureGeometry(o);
      else if((o.category==='monitor'&&o.kind!=='field')||o.kind==='point')geometry=new THREE.SphereGeometry(.07,12,8);
      else geometry=new THREE.BoxGeometry(...(o.size||[.1,.1,.1]).map(v=>Math.max(v,.02)));
      const color=o.category==='source'?colors.source:o.category==='monitor'?colors.monitor:p.materials.find(m=>m.name===o.material)?.color||'#69a1e8';
      const mesh=new THREE.Mesh(geometry,new THREE.MeshStandardMaterial({color,transparent:true,opacity:o.kind==='tfsf'?.08:o.category==='structure'?.66:.9,roughness:.5,metalness:.08,side:THREE.DoubleSide}));
      mesh.position.fromArray(o.center);mesh.userData.id=o.id;
      mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(geometry),new THREE.LineBasicMaterial({color:o.id===this.state.selected||this.state.multi?.includes(o.id)?'#147be7':color,transparent:true,opacity:.7})));
      this.group.add(mesh);
      if(o.id===this.state.selected&&this.state.mode==='layout'){this.transform.attach(mesh);this.transform.showZ=p.region.dimension!=='2d';this.transform.setTranslationSnap(this.state.snap&&!p.region.mesh_steps&&p.region.mesh_type!=='explicit'?p.region.mesh:null);}
    }
    const {width,height}=this.host.getBoundingClientRect();if(width>0&&height>0){this.camera.aspect=width/height;this.camera.updateProjectionMatrix();this.renderer.setSize(width,height);}
  }
  fit(){this.zoom={xy:1,xz:1,yz:1};const s=Math.max(...this.state.project.region.size);this.camera.position.set(s*1.15,-s*1.4,s*1.05);this.orbit.target.set(0,0,0);this.render();}
  render(){for(const n of Object.keys(this.canvases))this.draw2d(n);this.renderThree();}
}

export function drawField(canvas, frame, size, label, maxValue=null, unit='reduced field') {
  const rect=canvas.getBoundingClientRect(),dpr=devicePixelRatio||1;canvas.width=rect.width*dpr;canvas.height=rect.height*dpr;
  const ctx=canvas.getContext('2d');ctx.scale(dpr,dpr);ctx.fillStyle='#f8fafc';ctx.fillRect(0,0,rect.width,rect.height);
  if(!frame?.length){ctx.fillStyle='#718196';ctx.font='14px Segoe UI';ctx.textAlign='center';ctx.fillText('Run a simulation to visualize the field',rect.width/2,rect.height/2);return;}
  const nx=frame.length,ny=frame[0].length,off=document.createElement('canvas');off.width=nx;off.height=ny;const oc=off.getContext('2d'),im=oc.createImageData(nx,ny);
  let vmax=maxValue||Math.max(...frame.flat().map(Math.abs),1e-20);
  for(let x=0;x<nx;x++)for(let y=0;y<ny;y++){const v=Math.max(-1,Math.min(1,frame[x][y]/vmax)),i=((ny-1-y)*nx+x)*4;im.data[i]=v>0?250:Math.round(246+v*210);im.data[i+1]=Math.round(248-Math.abs(v)*184);im.data[i+2]=v<0?250:Math.round(248-v*207);im.data[i+3]=255;}
  oc.putImageData(im,0,0);const scale=Math.min((rect.width-110)/size[0],(rect.height-80)/size[1]),w=size[0]*scale,h=size[1]*scale,left=(rect.width-w)/2,top=(rect.height-h)/2;
  ctx.imageSmoothingEnabled=false;ctx.drawImage(off,left,top,w,h);ctx.strokeStyle='#c4cfdb';ctx.strokeRect(left,top,w,h);
  ctx.fillStyle='#607086';ctx.font='11px ui-monospace,monospace';ctx.textAlign='center';ctx.fillText(`${-size[0]/2}`,left,top+h+18);ctx.fillText('0',left+w/2,top+h+18);ctx.fillText(`${size[0]/2} µm`,left+w,top+h+18);
  ctx.textAlign='right';ctx.fillText(`${size[1]/2}`,left-8,top+8);ctx.fillText(`${-size[1]/2}`,left-8,top+h);ctx.textAlign='left';ctx.fillText(`${label} · ±${vmax.toExponential(2)} (${unit})`,left,top-13);
}

export function drawPlot(canvas, monitors, spectrum=false, wavelength=false) {
  const rect=canvas.getBoundingClientRect(),dpr=devicePixelRatio||1;canvas.width=rect.width*dpr;canvas.height=rect.height*dpr;const c=canvas.getContext('2d');c.scale(dpr,dpr);c.clearRect(0,0,rect.width,rect.height);
  if(!monitors?.length){c.fillStyle='#8491a2';c.font='12px Segoe UI';c.fillText('Point monitor signals appear after a run.',30,35);return;}
  const xdata=m=>spectrum?(wavelength?m.wavelength_um:m.frequency_thz):m.time_fs;
  const w=rect.width-75,h=rect.height-48,left=55,top=15,ys=monitors.flatMap(m=>spectrum?m.spectrum:m.signal),xs=monitors.flatMap(xdata),ymax=ys.reduce((m,y)=>Number.isFinite(y)?Math.max(m,Math.abs(y)):m,0)||1,xmin=spectrum?xs.reduce((m,x)=>Math.min(m,x),Infinity):0,xmax=xs.reduce((m,x)=>Math.max(m,x),xmin+1e-6),ymin=spectrum&&!monitors.some(m=>m.signed)?0:-ymax;
  c.strokeStyle='#e0e6ed';c.font='10px monospace';c.fillStyle='#738197';
  for(let i=0;i<=4;i++){const y=top+i*h/4;c.beginPath();c.moveTo(left,y);c.lineTo(left+w,y);c.stroke();c.fillText((ymax-(ymax-ymin)*i/4).toExponential(1),2,y+3);c.fillText((xmin+(xmax-xmin)*i/4).toFixed(wavelength&&spectrum?2:0),left+w*i/4-7,top+h+17);}
  monitors.forEach((m,k)=>{const x=xdata(m),y=spectrum?m.spectrum:m.signal;c.strokeStyle=['#237ddd','#e39127','#875adb','#22a184'][k%4];c.beginPath();let pen=false;x.forEach((v,i)=>{if(!Number.isFinite(y[i])){pen=false;return;}const px=left+(v-xmin)/(xmax-xmin)*w,py=top+(ymax-y[i])/(ymax-ymin)*h;pen?c.lineTo(px,py):c.moveTo(px,py);pen=true;});c.stroke();if(x.length===1){c.beginPath();c.arc(left,top+(ymax-y[0])/(ymax-ymin)*h,3,0,2*Math.PI);c.fillStyle=c.strokeStyle;c.fill();}c.fillStyle=c.strokeStyle;c.fillText(m.name,left+10+k*120,12);
  if(!spectrum&&m.window){c.strokeStyle='#24a79b';c.setLineDash([3,3]);c.beginPath();x.forEach((v,i)=>{const px=left+(v-xmin)/(xmax-xmin)*w,py=top+(1-m.window[i])*h/2;i?c.lineTo(px,py):c.moveTo(px,py);});c.stroke();c.setLineDash([]);}
  });
  const m=monitors[0],settings=m.spectrum_settings;
  c.fillStyle='#728296';c.textAlign='right';c.fillText(spectrum?(m.spectrum_label||`${wavelength?'Wavelength (µm)':'Frequency (THz)'} · ${settings?.apodization||'hann'} · |${settings?.sampling==='fft'?'FFT':'DFT'}| (${m.spectrum_units||'reduced field'})`):(m.time_label||`Time (fs) · real field${m.window?'; dashed: window (0–1)':''}`),rect.width-20,rect.height-3);
}
