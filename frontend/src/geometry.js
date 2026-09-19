import * as THREE from 'three';

export function geometryDefaults(o){
 o.rotation??=0;o.rotation_axes??=['z','x','y'];o.rotation_angles??=[0,0,0];
 o.make_ellipsoid??=false;o.radius_2??=.5;o.radius_3??=.5;o.inner_radius_2??=.3;
 o.theta_start??=0;o.theta_stop??=360;o.vertices??=[[-.5,-.5],[.5,-.5],[0,.5]];
 return o;
}
export function rotationMatrix(o){
 const r=new THREE.Matrix4().makeRotationZ((o.rotation||0)*Math.PI/180);
 (o.rotation_axes||['z','x','y']).forEach((axis,i)=>{
  if(axis==='none')return;
  const v=new THREE.Vector3();v.setComponent('xyz'.indexOf(axis),1);
  r.premultiply(new THREE.Matrix4().makeRotationAxis(v,(o.rotation_angles?.[i]||0)*Math.PI/180));
 });return r;
}
function localGeometry(o){
 const rx=o.radius,ry=o.make_ellipsoid?o.radius_2:rx,rz=o.make_ellipsoid?o.radius_3:rx;
 if(o.kind==='rectangle')return new THREE.BoxGeometry(...o.size);
 if(o.kind==='sphere')return new THREE.SphereGeometry(1,48,32).scale(rx,ry,rz);
 if(o.kind==='circle')return new THREE.CylinderGeometry(1,1,o.size[2],96).rotateX(Math.PI/2).scale(rx,ry,1);
 let shape;
 if(o.kind==='polygon')shape=new THREE.Shape(o.vertices.map(v=>new THREE.Vector2(...v)));
 else if(o.kind==='ring'){
  const delta=(o.theta_stop??360)-(o.theta_start??0),span=((delta%360)+360)%360||360;
  const full=span===360,count=Math.max(3,Math.ceil(96*span/360));
  const arc=(a,b)=>Array.from({length:full?count:count+1},(_,i)=>{
   const theta=((o.theta_start??0)+span*i/count)*Math.PI/180,c=Math.cos(theta),s=Math.sin(theta);
   const radius=1/Math.sqrt((c/a)**2+(s/b)**2);return new THREE.Vector2(radius*c,radius*s);
  });
  const outer=arc(rx,ry),inner=o.inner_radius>0?arc(o.inner_radius,o.make_ellipsoid?o.inner_radius_2:o.inner_radius):[];
  if(full){shape=new THREE.Shape(outer);if(inner.length)shape.holes.push(new THREE.Path(inner.reverse()));}
  else shape=new THREE.Shape([...outer,...(inner.length?inner.reverse():[new THREE.Vector2(0,0)])]);
 }
 if(!shape)throw Error('Unsupported CAD solid: '+o.kind);
 return new THREE.ExtrudeGeometry(shape,{depth:o.size[2],steps:1,bevelEnabled:false}).translate(0,0,-o.size[2]/2);
}
// Tessellation is display-only. The Python solver uses analytic membership.
const cache=new Map();
function entry(o){
 geometryDefaults(o);
 const key=JSON.stringify([o.kind,o.size,o.radius,o.inner_radius,o.make_ellipsoid,o.radius_2,o.radius_3,o.inner_radius_2,o.theta_start,o.theta_stop,o.vertices,o.rotation,o.rotation_axes,o.rotation_angles]);
 if(cache.has(key))return cache.get(key);
 const geometry=localGeometry(o).applyMatrix4(rotationMatrix(o));
 const flat=geometry.index?geometry.toNonIndexed():geometry.clone();
 const edges=new THREE.EdgesGeometry(geometry,20);
 const data={geometry,points:Array.from(flat.attributes.position.array),edges:Array.from(edges.attributes.position.array),projections:{}};
 flat.dispose();edges.dispose();cache.set(key,data);
 if(cache.size>128){const oldest=cache.keys().next().value;cache.get(oldest).geometry.dispose();cache.delete(oldest);}
 return data;
}
export function structureGeometry(o){return entry(o).geometry.clone();}
export function projectedGeometry(o,axes){
 const data=entry(o),key=axes.join('');if(data.projections[key])return data.projections[key];
 const triangles=[],edges=[];let low=Infinity,high=-Infinity;
 for(let i=0;i<data.points.length;i+=9){
  const p=[0,3,6].map(j=>[data.points[i+j+axes[0]],data.points[i+j+axes[1]]]);
  const area=(p[1][0]-p[0][0])*(p[2][1]-p[0][1])-(p[1][1]-p[0][1])*(p[2][0]-p[0][0]);
  if(Math.abs(area)<1e-18)continue;if(area<0)[p[1],p[2]]=[p[2],p[1]];triangles.push(p);
  for(const v of p){low=Math.min(low,v[1]);high=Math.max(high,v[1]);}
 }
 for(let i=0;i<data.edges.length;i+=6)edges.push([0,3].map(j=>[data.edges[i+j+axes[0]],data.edges[i+j+axes[1]]]));
 return data.projections[key]={triangles,edges,low,high};
}
export function hitProjected(o,point,axes,tol){
 const q=[point[0]-o.center[axes[0]],point[1]-o.center[axes[1]]],d=projectedGeometry(o,axes);
 if(d.triangles.some(p=>p.every((a,i)=>{const b=p[(i+1)%3];return (b[0]-a[0])*(q[1]-a[1])-(b[1]-a[1])*(q[0]-a[0])>=-1e-12;})))return true;
 return d.edges.some(([a,b])=>{const dx=b[0]-a[0],dy=b[1]-a[1],length=dx*dx+dy*dy,t=length?Math.max(0,Math.min(1,((q[0]-a[0])*dx+(q[1]-a[1])*dy)/length)):0;return Math.hypot(q[0]-a[0]-t*dx,q[1]-a[1]-t*dy)<=tol;});
}

export function geometryControls(o,numeric){
 geometryDefaults(o);let html='';
 if(['circle','sphere','ring'].includes(o.kind)){
  html+=`<label class="enabled-row"><input type="checkbox" data-path="make_ellipsoid" ${o.make_ellipsoid?'checked':''}> Elliptical radii</label>`;
  if(o.make_ellipsoid)html+=numeric('radius 2','radius_2',o.radius_2,'µm',{min:.001})+(o.kind==='sphere'?numeric('radius 3','radius_3',o.radius_3,'µm',{min:.001}):'')+(o.kind==='ring'?numeric('inner radius 2','inner_radius_2',o.inner_radius_2,'µm',{min:0}):'');
 }
 if(o.kind==='ring')html+=numeric('theta start','theta_start',o.theta_start,'deg')+numeric('theta stop','theta_stop',o.theta_stop,'deg')+'<p class="property-help">Counterclockwise arc in the local XY plane, wrapping through 360°. Angles are polar angles even for elliptical rings.</p>';
 if(o.kind==='polygon')html+=`<button data-action="geometry-vertices">Edit polygon vertices</button><p class="property-help">${o.vertices.length} local XY vertices, extruded along local z. One simple contour without holes.</p>`;
 return html;
}
export function rotationControls(o,numeric,dropdown){
 geometryDefaults(o);
 return numeric('z rotation','rotation',o.rotation,'deg')+o.rotation_axes.map((axis,i)=>dropdown(['first','second','third'][i]+' axis',`rotation_axes.${i}`,axis,['none','x','y','z'])+numeric('rotation '+(i+1),`rotation_angles.${i}`,o.rotation_angles[i],'deg')).join('')+'<p class="property-help">Right-handed rotations about fixed world axes. Apply the legacy z angle, then rotations 1, 2 and 3 about the object center. CAD views show projections. A 2D calculation samples z = 0.</p>';
}
export function setupGeometryEditor({state,api,esc,commit}){
 const dialog=document.createElement('dialog');dialog.className='geometry-dialog';document.body.append(dialog);
 return {open(id){
  const obj=state.project.structures.find(o=>o.id===id);if(!obj||obj.kind!=='polygon')return;
  dialog.innerHTML=`<div class="fsp-heading"><h2>Polygon vertices</h2><button data-dismiss>Close</button></div><p>Local x, y pairs in µm, one pair per line. Clockwise or counterclockwise. Do not repeat the first vertex.</p><textarea aria-label="Polygon vertices" rows="12" style="width:100%;font-family:monospace">${esc(obj.vertices.map(v=>v.join(', ')).join('\n'))}</textarea><p role="alert"></p><button data-apply>Apply vertices</button>`;
  dialog.querySelector('[data-dismiss]').onclick=()=>dialog.close();
  dialog.querySelector('[data-apply]').onclick=async()=>{
   try{
    const vertices=dialog.querySelector('textarea').value.trim().split(/\r?\n/).map(line=>line.trim().split(/[\s,]+/).map(Number));
    if(vertices.some(v=>v.length!==2||v.some(n=>!Number.isFinite(n))))throw Error('Each row needs two finite numbers.');
    const p=structuredClone(state.project);p.structures.find(o=>o.id===id).vertices=vertices;
    const checked=await api('/validate',p);commit(checked.project);dialog.close();
   }catch(e){dialog.querySelector('[role="alert"]').textContent=e.message;}
  };dialog.showModal();
 }};
}
