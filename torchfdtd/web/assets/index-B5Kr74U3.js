(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vc=(n,e,t=[])=>{const i=document.createElementNS("http://www.w3.org/2000/svg",n);return Object.keys(e).forEach(s=>{i.setAttribute(s,String(e[s]))}),t.length&&t.forEach(s=>{const r=vc(...s);i.appendChild(r)}),i};var yd=([n,e,t])=>vc(n,e,t);/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const bd=n=>Array.from(n.attributes).reduce((e,t)=>(e[t.name]=t.value,e),{}),Md=n=>typeof n=="string"?n:!n||!n.class?"":n.class&&typeof n.class=="string"?n.class.split(" "):n.class&&Array.isArray(n.class)?n.class:"",Sd=n=>n.flatMap(Md).map(t=>t.trim()).filter(Boolean).filter((t,i,s)=>s.indexOf(t)===i).join(" "),Ed=n=>n.replace(/(\w)(\w*)(_|-|\s*)/g,(e,t,i)=>t.toUpperCase()+i.toLowerCase()),Wo=(n,{nameAttr:e,icons:t,attrs:i})=>{var _;const s=n.getAttribute(e);if(s==null)return;const r=Ed(s),a=t[r];if(!a)return console.warn(`${n.outerHTML} icon name was not found in the provided icons object.`);const o=bd(n),[l,c,d]=a,u={...c,"data-lucide":s,...i,...o},h=Sd(["lucide",`lucide-${s}`,o,i]);h&&Object.assign(u,{class:h});const m=yd([l,u,d]);return(_=n.parentNode)==null?void 0:_.replaceChild(m,n)};/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ht={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"};/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wd=["svg",ht,[["path",{d:"M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Td=["svg",ht,[["path",{d:"M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"}],["path",{d:"m3.3 7 8.7 5 8.7-5"}],["path",{d:"M12 22V12"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ad=["svg",ht,[["path",{d:"M12 16v5"}],["path",{d:"M16 14v7"}],["path",{d:"M20 10v11"}],["path",{d:"m22 3-8.646 8.646a.5.5 0 0 1-.708 0L9.354 8.354a.5.5 0 0 0-.707 0L2 15"}],["path",{d:"M4 18v3"}],["path",{d:"M8 14v7"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Cd=["svg",ht,[["circle",{cx:"12",cy:"12",r:"10"}],["circle",{cx:"12",cy:"12",r:"1"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Rd=["svg",ht,[["circle",{cx:"12",cy:"12",r:"10"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Pd=["svg",ht,[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ld=["svg",ht,[["ellipse",{cx:"12",cy:"5",rx:"9",ry:"3"}],["path",{d:"M3 5v14a9 3 0 0 0 18 0V5"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Dd=["svg",ht,[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}],["polyline",{points:"7 10 12 15 17 10"}],["line",{x1:"12",x2:"12",y1:"15",y2:"3"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Id=["svg",ht,[["path",{d:"M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4"}],["path",{d:"m5 12-3 3 3 3"}],["path",{d:"m9 18 3-3-3-3"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ud=["svg",ht,[["path",{d:"m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Nd=["svg",ht,[["circle",{cx:"12",cy:"12",r:"3"}],["line",{x1:"3",x2:"9",y1:"12",y2:"12"}],["line",{x1:"15",x2:"21",y1:"12",y2:"12"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fd=["svg",ht,[["path",{d:"M8 3H5a2 2 0 0 0-2 2v3"}],["path",{d:"M21 8V5a2 2 0 0 0-2-2h-3"}],["path",{d:"M3 16v3a2 2 0 0 0 2 2h3"}],["path",{d:"M16 21h3a2 2 0 0 0 2-2v-3"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Od=["svg",ht,[["path",{d:"M18 8L22 12L18 16"}],["path",{d:"M2 12H22"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zd=["svg",ht,[["circle",{cx:"12",cy:"12",r:"3"}],["circle",{cx:"19",cy:"5",r:"2"}],["circle",{cx:"5",cy:"19",r:"2"}],["path",{d:"M10.4 21.9a10 10 0 0 0 9.941-15.416"}],["path",{d:"M13.5 2.1a10 10 0 0 0-9.841 15.416"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Bd=["svg",ht,[["path",{d:"M13 7 8.7 2.7a2.41 2.41 0 0 0-3.4 0L2.7 5.3a2.41 2.41 0 0 0 0 3.4L7 13"}],["path",{d:"m8 6 2-2"}],["path",{d:"m18 16 2-2"}],["path",{d:"m17 11 4.3 4.3c.94.94.94 2.46 0 3.4l-2.6 2.6c-.94.94-2.46.94-3.4 0L11 17"}],["path",{d:"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"}],["path",{d:"m15 5 4 4"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const kd=["svg",ht,[["polygon",{points:"6 3 20 12 6 21 6 3"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Hd=["svg",ht,[["path",{d:"M4.9 19.1C1 15.2 1 8.8 4.9 4.9"}],["path",{d:"M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"}],["circle",{cx:"12",cy:"12",r:"2"}],["path",{d:"M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"}],["path",{d:"M19.1 4.9C23 8.8 23 15.1 19.1 19"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gd=["svg",ht,[["path",{d:"m15 14 5-5-5-5"}],["path",{d:"M20 9H9.5A5.5 5.5 0 0 0 4 14.5A5.5 5.5 0 0 0 9.5 20H13"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vd=["svg",ht,[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"}],["path",{d:"M21 3v5h-5"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"}],["path",{d:"M8 16H3v5"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $d=["svg",ht,[["path",{d:"M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"}],["path",{d:"M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"}],["path",{d:"M7 3v4a1 1 0 0 0 1 1h7"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Wd=["svg",ht,[["path",{d:"M3 7V5a2 2 0 0 1 2-2h2"}],["path",{d:"M17 3h2a2 2 0 0 1 2 2v2"}],["path",{d:"M21 17v2a2 2 0 0 1-2 2h-2"}],["path",{d:"M7 21H5a2 2 0 0 1-2-2v-2"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jd=["svg",ht,[["path",{d:"M20 7h-9"}],["path",{d:"M14 17H5"}],["circle",{cx:"17",cy:"17",r:"3"}],["circle",{cx:"7",cy:"7",r:"3"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xd=["svg",ht,[["path",{d:"M8.3 10a.7.7 0 0 1-.626-1.079L11.4 3a.7.7 0 0 1 1.198-.043L16.3 8.9a.7.7 0 0 1-.572 1.1Z"}],["rect",{x:"3",y:"14",width:"7",height:"7",rx:"1"}],["circle",{cx:"17.5",cy:"17.5",r:"3.5"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qd=["svg",ht,[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Yd=["svg",ht,[["polyline",{points:"4 17 10 11 4 5"}],["line",{x1:"12",x2:"20",y1:"19",y2:"19"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zd=["svg",ht,[["path",{d:"M3 6h18"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"}],["line",{x1:"10",x2:"10",y1:"11",y2:"17"}],["line",{x1:"14",x2:"14",y1:"11",y2:"17"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Jd=["svg",ht,[["path",{d:"M9 14 4 9l5-5"}],["path",{d:"M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Kd=["svg",ht,[["path",{d:"M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"}],["path",{d:"M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"}],["path",{d:"M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qd=({icons:n={},nameAttr:e="data-lucide",attrs:t={}}={})=>{if(!Object.values(n).length)throw new Error(`Please provide an icons object.
If you want to use all the icons you can import it like:
 \`import { createIcons, icons } from 'lucide';
lucide.createIcons({icons});\``);if(typeof document>"u")throw new Error("`createIcons()` only works in a browser environment.");const i=document.querySelectorAll(`[${e}]`);if(Array.from(i).forEach(s=>Wo(s,{nameAttr:e,icons:n,attrs:t})),e==="data-lucide"){const s=document.querySelectorAll("[icon-name]");s.length>0&&(console.warn("[Lucide] Some icons were found with the now deprecated icon-name attribute. These will still be replaced for backwards compatibility, but will no longer be supported in v1.0 and you should switch to data-lucide"),Array.from(s).forEach(r=>Wo(r,{nameAttr:"icon-name",icons:n,attrs:t})))}};/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Mo="180",Gi={ROTATE:0,DOLLY:1,PAN:2},zi={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},eu=0,jo=1,tu=2,xc=1,nu=2,Nn=3,Kn=0,Jt=1,fn=2,Zn=0,Vi=1,Xo=2,qo=3,Yo=4,iu=5,fi=100,su=101,ru=102,au=103,ou=104,lu=200,cu=201,du=202,uu=203,wa=204,Ta=205,hu=206,fu=207,pu=208,mu=209,gu=210,_u=211,vu=212,xu=213,yu=214,Aa=0,Ca=1,Ra=2,Wi=3,Pa=4,La=5,Da=6,Ia=7,yc=0,bu=1,Mu=2,Jn=0,Su=1,Eu=2,wu=3,Tu=4,Au=5,Cu=6,Ru=7,bc=300,ji=301,Xi=302,Ua=303,Na=304,Pr=306,Fa=1e3,gi=1001,Oa=1002,mn=1003,Pu=1004,Os=1005,Sn=1006,zr=1007,_i=1008,Tn=1009,Mc=1010,Sc=1011,bs=1012,So=1013,vi=1014,On=1015,Rs=1016,Eo=1017,wo=1018,Ms=1020,Ec=35902,wc=35899,Tc=1021,Ac=1022,pn=1023,Ss=1026,Es=1027,Cc=1028,To=1029,Rc=1030,Ao=1031,Co=1033,gr=33776,_r=33777,vr=33778,xr=33779,za=35840,Ba=35841,ka=35842,Ha=35843,Ga=36196,Va=37492,$a=37496,Wa=37808,ja=37809,Xa=37810,qa=37811,Ya=37812,Za=37813,Ja=37814,Ka=37815,Qa=37816,eo=37817,to=37818,no=37819,io=37820,so=37821,ro=36492,ao=36494,oo=36495,lo=36283,co=36284,uo=36285,ho=36286,Lu=3200,Du=3201,Pc=0,Iu=1,Yn="",on="srgb",qi="srgb-linear",Sr="linear",ot="srgb",Si=7680,Zo=519,Uu=512,Nu=513,Fu=514,Lc=515,Ou=516,zu=517,Bu=518,ku=519,Jo=35044,Ko="300 es",En=2e3,Er=2001;class bi{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const s=i[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const s=i.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}}const Bt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],gs=Math.PI/180,fo=180/Math.PI;function Ki(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Bt[n&255]+Bt[n>>8&255]+Bt[n>>16&255]+Bt[n>>24&255]+"-"+Bt[e&255]+Bt[e>>8&255]+"-"+Bt[e>>16&15|64]+Bt[e>>24&255]+"-"+Bt[t&63|128]+Bt[t>>8&255]+"-"+Bt[t>>16&255]+Bt[t>>24&255]+Bt[i&255]+Bt[i>>8&255]+Bt[i>>16&255]+Bt[i>>24&255]).toLowerCase()}function je(n,e,t){return Math.max(e,Math.min(t,n))}function Hu(n,e){return(n%e+e)%e}function Br(n,e,t){return(1-t)*n+t*e}function ns(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function qt(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const Gu={DEG2RAD:gs};class oe{constructor(e=0,t=0){oe.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6],this.y=s[1]*t+s[4]*i+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=je(this.x,e.x,t.x),this.y=je(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=je(this.x,e,t),this.y=je(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(je(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(je(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*i-a*s+e.x,this.y=r*s+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Ot{constructor(e=0,t=0,i=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=s}static slerpFlat(e,t,i,s,r,a,o){let l=i[s+0],c=i[s+1],d=i[s+2],u=i[s+3];const h=r[a+0],m=r[a+1],_=r[a+2],x=r[a+3];if(o===0){e[t+0]=l,e[t+1]=c,e[t+2]=d,e[t+3]=u;return}if(o===1){e[t+0]=h,e[t+1]=m,e[t+2]=_,e[t+3]=x;return}if(u!==x||l!==h||c!==m||d!==_){let p=1-o;const f=l*h+c*m+d*_+u*x,y=f>=0?1:-1,v=1-f*f;if(v>Number.EPSILON){const E=Math.sqrt(v),T=Math.atan2(E,f*y);p=Math.sin(p*T)/E,o=Math.sin(o*T)/E}const g=o*y;if(l=l*p+h*g,c=c*p+m*g,d=d*p+_*g,u=u*p+x*g,p===1-o){const E=1/Math.sqrt(l*l+c*c+d*d+u*u);l*=E,c*=E,d*=E,u*=E}}e[t]=l,e[t+1]=c,e[t+2]=d,e[t+3]=u}static multiplyQuaternionsFlat(e,t,i,s,r,a){const o=i[s],l=i[s+1],c=i[s+2],d=i[s+3],u=r[a],h=r[a+1],m=r[a+2],_=r[a+3];return e[t]=o*_+d*u+l*m-c*h,e[t+1]=l*_+d*h+c*u-o*m,e[t+2]=c*_+d*m+o*h-l*u,e[t+3]=d*_-o*u-l*h-c*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,s){return this._x=e,this._y=t,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(i/2),d=o(s/2),u=o(r/2),h=l(i/2),m=l(s/2),_=l(r/2);switch(a){case"XYZ":this._x=h*d*u+c*m*_,this._y=c*m*u-h*d*_,this._z=c*d*_+h*m*u,this._w=c*d*u-h*m*_;break;case"YXZ":this._x=h*d*u+c*m*_,this._y=c*m*u-h*d*_,this._z=c*d*_-h*m*u,this._w=c*d*u+h*m*_;break;case"ZXY":this._x=h*d*u-c*m*_,this._y=c*m*u+h*d*_,this._z=c*d*_+h*m*u,this._w=c*d*u-h*m*_;break;case"ZYX":this._x=h*d*u-c*m*_,this._y=c*m*u+h*d*_,this._z=c*d*_-h*m*u,this._w=c*d*u+h*m*_;break;case"YZX":this._x=h*d*u+c*m*_,this._y=c*m*u+h*d*_,this._z=c*d*_-h*m*u,this._w=c*d*u-h*m*_;break;case"XZY":this._x=h*d*u-c*m*_,this._y=c*m*u-h*d*_,this._z=c*d*_+h*m*u,this._w=c*d*u+h*m*_;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,s=Math.sin(i);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],s=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],d=t[6],u=t[10],h=i+o+u;if(h>0){const m=.5/Math.sqrt(h+1);this._w=.25/m,this._x=(d-l)*m,this._y=(r-c)*m,this._z=(a-s)*m}else if(i>o&&i>u){const m=2*Math.sqrt(1+i-o-u);this._w=(d-l)/m,this._x=.25*m,this._y=(s+a)/m,this._z=(r+c)/m}else if(o>u){const m=2*Math.sqrt(1+o-i-u);this._w=(r-c)/m,this._x=(s+a)/m,this._y=.25*m,this._z=(l+d)/m}else{const m=2*Math.sqrt(1+u-i-o);this._w=(a-s)/m,this._x=(r+c)/m,this._y=(l+d)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(je(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const s=Math.min(1,t/i);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,s=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,d=t._w;return this._x=i*d+a*o+s*c-r*l,this._y=s*d+a*l+r*o-i*c,this._z=r*d+a*c+i*l-s*o,this._w=a*d-i*o-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const i=this._x,s=this._y,r=this._z,a=this._w;let o=a*e._w+i*e._x+s*e._y+r*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=i,this._y=s,this._z=r,this;const l=1-o*o;if(l<=Number.EPSILON){const m=1-t;return this._w=m*a+t*this._w,this._x=m*i+t*this._x,this._y=m*s+t*this._y,this._z=m*r+t*this._z,this.normalize(),this}const c=Math.sqrt(l),d=Math.atan2(c,o),u=Math.sin((1-t)*d)/c,h=Math.sin(t*d)/c;return this._w=a*u+this._w*h,this._x=i*u+this._x*h,this._y=s*u+this._y*h,this._z=r*u+this._z*h,this._onChangeCallback(),this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class L{constructor(e=0,t=0,i=0){L.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Qo.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Qo.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6]*s,this.y=r[1]*t+r[4]*i+r[7]*s,this.z=r[2]*t+r[5]*i+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*i+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*i+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*i+r[10]*s+r[14])*a,this}applyQuaternion(e){const t=this.x,i=this.y,s=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*s-o*i),d=2*(o*t-r*s),u=2*(r*i-a*t);return this.x=t+l*c+a*u-o*d,this.y=i+l*d+o*c-r*u,this.z=s+l*u+r*d-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*i+r[8]*s,this.y=r[1]*t+r[5]*i+r[9]*s,this.z=r[2]*t+r[6]*i+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=je(this.x,e.x,t.x),this.y=je(this.y,e.y,t.y),this.z=je(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=je(this.x,e,t),this.y=je(this.y,e,t),this.z=je(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(je(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,s=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=s*l-r*o,this.y=r*a-i*l,this.z=i*o-s*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return kr.copy(this).projectOnVector(e),this.sub(kr)}reflect(e){return this.sub(kr.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(je(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,s=this.z-e.z;return t*t+i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const s=Math.sin(t)*e;return this.x=s*Math.sin(i),this.y=Math.cos(t)*e,this.z=s*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const kr=new L,Qo=new Ot;class $e{constructor(e,t,i,s,r,a,o,l,c){$e.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,a,o,l,c)}set(e,t,i,s,r,a,o,l,c){const d=this.elements;return d[0]=e,d[1]=s,d[2]=o,d[3]=t,d[4]=r,d[5]=l,d[6]=i,d[7]=a,d[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,r=this.elements,a=i[0],o=i[3],l=i[6],c=i[1],d=i[4],u=i[7],h=i[2],m=i[5],_=i[8],x=s[0],p=s[3],f=s[6],y=s[1],v=s[4],g=s[7],E=s[2],T=s[5],S=s[8];return r[0]=a*x+o*y+l*E,r[3]=a*p+o*v+l*T,r[6]=a*f+o*g+l*S,r[1]=c*x+d*y+u*E,r[4]=c*p+d*v+u*T,r[7]=c*f+d*g+u*S,r[2]=h*x+m*y+_*E,r[5]=h*p+m*v+_*T,r[8]=h*f+m*g+_*S,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],d=e[8];return t*a*d-t*o*c-i*r*d+i*o*l+s*r*c-s*a*l}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],d=e[8],u=d*a-o*c,h=o*l-d*r,m=c*r-a*l,_=t*u+i*h+s*m;if(_===0)return this.set(0,0,0,0,0,0,0,0,0);const x=1/_;return e[0]=u*x,e[1]=(s*c-d*i)*x,e[2]=(o*i-s*a)*x,e[3]=h*x,e[4]=(d*t-s*l)*x,e[5]=(s*r-o*t)*x,e[6]=m*x,e[7]=(i*l-c*t)*x,e[8]=(a*t-i*r)*x,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,s,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(i*l,i*c,-i*(l*a+c*o)+a+e,-s*c,s*l,-s*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(Hr.makeScale(e,t)),this}rotate(e){return this.premultiply(Hr.makeRotation(-e)),this}translate(e,t){return this.premultiply(Hr.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<9;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Hr=new $e;function Dc(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function wr(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function Vu(){const n=wr("canvas");return n.style.display="block",n}const el={};function ws(n){n in el||(el[n]=!0,console.warn(n))}function $u(n,e,t){return new Promise(function(i,s){function r(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:i()}}setTimeout(r,t)})}const tl=new $e().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),nl=new $e().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Wu(){const n={enabled:!0,workingColorSpace:qi,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===ot&&(s.r=zn(s.r),s.g=zn(s.g),s.b=zn(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===ot&&(s.r=$i(s.r),s.g=$i(s.g),s.b=$i(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Yn?Sr:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return ws("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return ws("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[qi]:{primaries:e,whitePoint:i,transfer:Sr,toXYZ:tl,fromXYZ:nl,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:on},outputColorSpaceConfig:{drawingBufferColorSpace:on}},[on]:{primaries:e,whitePoint:i,transfer:ot,toXYZ:tl,fromXYZ:nl,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:on}}}),n}const tt=Wu();function zn(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function $i(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let Ei;class ju{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{Ei===void 0&&(Ei=wr("canvas")),Ei.width=e.width,Ei.height=e.height;const s=Ei.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),i=Ei}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=wr("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const s=i.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=zn(r[a]/255)*255;return i.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(zn(t[i]/255)*255):t[i]=zn(t[i]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Xu=0;class Ro{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Xu++}),this.uuid=Ki(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(Gr(s[a].image)):r.push(Gr(s[a]))}else r=Gr(s);i.url=r}return t||(e.images[this.uuid]=i),i}}function Gr(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?ju.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let qu=0;const Vr=new L;class Kt extends bi{constructor(e=Kt.DEFAULT_IMAGE,t=Kt.DEFAULT_MAPPING,i=gi,s=gi,r=Sn,a=_i,o=pn,l=Tn,c=Kt.DEFAULT_ANISOTROPY,d=Yn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:qu++}),this.uuid=Ki(),this.name="",this.source=new Ro(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new oe(0,0),this.repeat=new oe(1,1),this.center=new oe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new $e,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Vr).x}get height(){return this.source.getSize(Vr).y}get depth(){return this.source.getSize(Vr).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const i=e[t];if(i===void 0){console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==bc)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Fa:e.x=e.x-Math.floor(e.x);break;case gi:e.x=e.x<0?0:1;break;case Oa:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Fa:e.y=e.y-Math.floor(e.y);break;case gi:e.y=e.y<0?0:1;break;case Oa:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Kt.DEFAULT_IMAGE=null;Kt.DEFAULT_MAPPING=bc;Kt.DEFAULT_ANISOTROPY=1;class Tt{constructor(e=0,t=0,i=0,s=1){Tt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,s){return this.x=e,this.y=t,this.z=i,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*i+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*i+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*i+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,s,r;const l=e.elements,c=l[0],d=l[4],u=l[8],h=l[1],m=l[5],_=l[9],x=l[2],p=l[6],f=l[10];if(Math.abs(d-h)<.01&&Math.abs(u-x)<.01&&Math.abs(_-p)<.01){if(Math.abs(d+h)<.1&&Math.abs(u+x)<.1&&Math.abs(_+p)<.1&&Math.abs(c+m+f-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const v=(c+1)/2,g=(m+1)/2,E=(f+1)/2,T=(d+h)/4,S=(u+x)/4,A=(_+p)/4;return v>g&&v>E?v<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(v),s=T/i,r=S/i):g>E?g<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(g),i=T/s,r=A/s):E<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(E),i=S/r,s=A/r),this.set(i,s,r,t),this}let y=Math.sqrt((p-_)*(p-_)+(u-x)*(u-x)+(h-d)*(h-d));return Math.abs(y)<.001&&(y=1),this.x=(p-_)/y,this.y=(u-x)/y,this.z=(h-d)/y,this.w=Math.acos((c+m+f-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=je(this.x,e.x,t.x),this.y=je(this.y,e.y,t.y),this.z=je(this.z,e.z,t.z),this.w=je(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=je(this.x,e,t),this.y=je(this.y,e,t),this.z=je(this.z,e,t),this.w=je(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(je(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Yu extends bi{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Sn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new Tt(0,0,e,t),this.scissorTest=!1,this.viewport=new Tt(0,0,e,t);const s={width:e,height:t,depth:i.depth},r=new Kt(s);this.textures=[];const a=i.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(e={}){const t={minFilter:Sn,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=i,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new Ro(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class xi extends Yu{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class Ic extends Kt{constructor(e=null,t=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=mn,this.minFilter=mn,this.wrapR=gi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Zu extends Kt{constructor(e=null,t=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=mn,this.minFilter=mn,this.wrapR=gi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Ps{constructor(e=new L(1/0,1/0,1/0),t=new L(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(dn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(dn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=dn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const r=i.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,dn):dn.fromBufferAttribute(r,a),dn.applyMatrix4(e.matrixWorld),this.expandByPoint(dn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),zs.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),zs.copy(i.boundingBox)),zs.applyMatrix4(e.matrixWorld),this.union(zs)}const s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,dn),dn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(is),Bs.subVectors(this.max,is),wi.subVectors(e.a,is),Ti.subVectors(e.b,is),Ai.subVectors(e.c,is),Hn.subVectors(Ti,wi),Gn.subVectors(Ai,Ti),ii.subVectors(wi,Ai);let t=[0,-Hn.z,Hn.y,0,-Gn.z,Gn.y,0,-ii.z,ii.y,Hn.z,0,-Hn.x,Gn.z,0,-Gn.x,ii.z,0,-ii.x,-Hn.y,Hn.x,0,-Gn.y,Gn.x,0,-ii.y,ii.x,0];return!$r(t,wi,Ti,Ai,Bs)||(t=[1,0,0,0,1,0,0,0,1],!$r(t,wi,Ti,Ai,Bs))?!1:(ks.crossVectors(Hn,Gn),t=[ks.x,ks.y,ks.z],$r(t,wi,Ti,Ai,Bs))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,dn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(dn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Rn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Rn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Rn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Rn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Rn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Rn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Rn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Rn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Rn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Rn=[new L,new L,new L,new L,new L,new L,new L,new L],dn=new L,zs=new Ps,wi=new L,Ti=new L,Ai=new L,Hn=new L,Gn=new L,ii=new L,is=new L,Bs=new L,ks=new L,si=new L;function $r(n,e,t,i,s){for(let r=0,a=n.length-3;r<=a;r+=3){si.fromArray(n,r);const o=s.x*Math.abs(si.x)+s.y*Math.abs(si.y)+s.z*Math.abs(si.z),l=e.dot(si),c=t.dot(si),d=i.dot(si);if(Math.max(-Math.max(l,c,d),Math.min(l,c,d))>o)return!1}return!0}const Ju=new Ps,ss=new L,Wr=new L;class Lr{constructor(e=new L,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):Ju.setFromPoints(e).getCenter(i);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,i.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ss.subVectors(e,this.center);const t=ss.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),s=(i-this.radius)*.5;this.center.addScaledVector(ss,s/i),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Wr.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ss.copy(e.center).add(Wr)),this.expandByPoint(ss.copy(e.center).sub(Wr))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}const Pn=new L,jr=new L,Hs=new L,Vn=new L,Xr=new L,Gs=new L,qr=new L;class Dr{constructor(e=new L,t=new L(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Pn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Pn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Pn.copy(this.origin).addScaledVector(this.direction,t),Pn.distanceToSquared(e))}distanceSqToSegment(e,t,i,s){jr.copy(e).add(t).multiplyScalar(.5),Hs.copy(t).sub(e).normalize(),Vn.copy(this.origin).sub(jr);const r=e.distanceTo(t)*.5,a=-this.direction.dot(Hs),o=Vn.dot(this.direction),l=-Vn.dot(Hs),c=Vn.lengthSq(),d=Math.abs(1-a*a);let u,h,m,_;if(d>0)if(u=a*l-o,h=a*o-l,_=r*d,u>=0)if(h>=-_)if(h<=_){const x=1/d;u*=x,h*=x,m=u*(u+a*h+2*o)+h*(a*u+h+2*l)+c}else h=r,u=Math.max(0,-(a*h+o)),m=-u*u+h*(h+2*l)+c;else h=-r,u=Math.max(0,-(a*h+o)),m=-u*u+h*(h+2*l)+c;else h<=-_?(u=Math.max(0,-(-a*r+o)),h=u>0?-r:Math.min(Math.max(-r,-l),r),m=-u*u+h*(h+2*l)+c):h<=_?(u=0,h=Math.min(Math.max(-r,-l),r),m=h*(h+2*l)+c):(u=Math.max(0,-(a*r+o)),h=u>0?r:Math.min(Math.max(-r,-l),r),m=-u*u+h*(h+2*l)+c);else h=a>0?-r:r,u=Math.max(0,-(a*h+o)),m=-u*u+h*(h+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(jr).addScaledVector(Hs,h),m}intersectSphere(e,t){Pn.subVectors(e.center,this.origin);const i=Pn.dot(this.direction),s=Pn.dot(Pn)-i*i,r=e.radius*e.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=i-a,l=i+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,s,r,a,o,l;const c=1/this.direction.x,d=1/this.direction.y,u=1/this.direction.z,h=this.origin;return c>=0?(i=(e.min.x-h.x)*c,s=(e.max.x-h.x)*c):(i=(e.max.x-h.x)*c,s=(e.min.x-h.x)*c),d>=0?(r=(e.min.y-h.y)*d,a=(e.max.y-h.y)*d):(r=(e.max.y-h.y)*d,a=(e.min.y-h.y)*d),i>a||r>s||((r>i||isNaN(i))&&(i=r),(a<s||isNaN(s))&&(s=a),u>=0?(o=(e.min.z-h.z)*u,l=(e.max.z-h.z)*u):(o=(e.max.z-h.z)*u,l=(e.min.z-h.z)*u),i>l||o>s)||((o>i||i!==i)&&(i=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(i>=0?i:s,t)}intersectsBox(e){return this.intersectBox(e,Pn)!==null}intersectTriangle(e,t,i,s,r){Xr.subVectors(t,e),Gs.subVectors(i,e),qr.crossVectors(Xr,Gs);let a=this.direction.dot(qr),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Vn.subVectors(this.origin,e);const l=o*this.direction.dot(Gs.crossVectors(Vn,Gs));if(l<0)return null;const c=o*this.direction.dot(Xr.cross(Vn));if(c<0||l+c>a)return null;const d=-o*Vn.dot(qr);return d<0?null:this.at(d/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class dt{constructor(e,t,i,s,r,a,o,l,c,d,u,h,m,_,x,p){dt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,a,o,l,c,d,u,h,m,_,x,p)}set(e,t,i,s,r,a,o,l,c,d,u,h,m,_,x,p){const f=this.elements;return f[0]=e,f[4]=t,f[8]=i,f[12]=s,f[1]=r,f[5]=a,f[9]=o,f[13]=l,f[2]=c,f[6]=d,f[10]=u,f[14]=h,f[3]=m,f[7]=_,f[11]=x,f[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new dt().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,i=e.elements,s=1/Ci.setFromMatrixColumn(e,0).length(),r=1/Ci.setFromMatrixColumn(e,1).length(),a=1/Ci.setFromMatrixColumn(e,2).length();return t[0]=i[0]*s,t[1]=i[1]*s,t[2]=i[2]*s,t[3]=0,t[4]=i[4]*r,t[5]=i[5]*r,t[6]=i[6]*r,t[7]=0,t[8]=i[8]*a,t[9]=i[9]*a,t[10]=i[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,s=e.y,r=e.z,a=Math.cos(i),o=Math.sin(i),l=Math.cos(s),c=Math.sin(s),d=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){const h=a*d,m=a*u,_=o*d,x=o*u;t[0]=l*d,t[4]=-l*u,t[8]=c,t[1]=m+_*c,t[5]=h-x*c,t[9]=-o*l,t[2]=x-h*c,t[6]=_+m*c,t[10]=a*l}else if(e.order==="YXZ"){const h=l*d,m=l*u,_=c*d,x=c*u;t[0]=h+x*o,t[4]=_*o-m,t[8]=a*c,t[1]=a*u,t[5]=a*d,t[9]=-o,t[2]=m*o-_,t[6]=x+h*o,t[10]=a*l}else if(e.order==="ZXY"){const h=l*d,m=l*u,_=c*d,x=c*u;t[0]=h-x*o,t[4]=-a*u,t[8]=_+m*o,t[1]=m+_*o,t[5]=a*d,t[9]=x-h*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const h=a*d,m=a*u,_=o*d,x=o*u;t[0]=l*d,t[4]=_*c-m,t[8]=h*c+x,t[1]=l*u,t[5]=x*c+h,t[9]=m*c-_,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const h=a*l,m=a*c,_=o*l,x=o*c;t[0]=l*d,t[4]=x-h*u,t[8]=_*u+m,t[1]=u,t[5]=a*d,t[9]=-o*d,t[2]=-c*d,t[6]=m*u+_,t[10]=h-x*u}else if(e.order==="XZY"){const h=a*l,m=a*c,_=o*l,x=o*c;t[0]=l*d,t[4]=-u,t[8]=c*d,t[1]=h*u+x,t[5]=a*d,t[9]=m*u-_,t[2]=_*u-m,t[6]=o*d,t[10]=x*u+h}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Ku,e,Qu)}lookAt(e,t,i){const s=this.elements;return tn.subVectors(e,t),tn.lengthSq()===0&&(tn.z=1),tn.normalize(),$n.crossVectors(i,tn),$n.lengthSq()===0&&(Math.abs(i.z)===1?tn.x+=1e-4:tn.z+=1e-4,tn.normalize(),$n.crossVectors(i,tn)),$n.normalize(),Vs.crossVectors(tn,$n),s[0]=$n.x,s[4]=Vs.x,s[8]=tn.x,s[1]=$n.y,s[5]=Vs.y,s[9]=tn.y,s[2]=$n.z,s[6]=Vs.z,s[10]=tn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,r=this.elements,a=i[0],o=i[4],l=i[8],c=i[12],d=i[1],u=i[5],h=i[9],m=i[13],_=i[2],x=i[6],p=i[10],f=i[14],y=i[3],v=i[7],g=i[11],E=i[15],T=s[0],S=s[4],A=s[8],M=s[12],b=s[1],R=s[5],I=s[9],B=s[13],H=s[2],k=s[6],$=s[10],q=s[14],W=s[3],ie=s[7],pe=s[11],be=s[15];return r[0]=a*T+o*b+l*H+c*W,r[4]=a*S+o*R+l*k+c*ie,r[8]=a*A+o*I+l*$+c*pe,r[12]=a*M+o*B+l*q+c*be,r[1]=d*T+u*b+h*H+m*W,r[5]=d*S+u*R+h*k+m*ie,r[9]=d*A+u*I+h*$+m*pe,r[13]=d*M+u*B+h*q+m*be,r[2]=_*T+x*b+p*H+f*W,r[6]=_*S+x*R+p*k+f*ie,r[10]=_*A+x*I+p*$+f*pe,r[14]=_*M+x*B+p*q+f*be,r[3]=y*T+v*b+g*H+E*W,r[7]=y*S+v*R+g*k+E*ie,r[11]=y*A+v*I+g*$+E*pe,r[15]=y*M+v*B+g*q+E*be,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],s=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],d=e[2],u=e[6],h=e[10],m=e[14],_=e[3],x=e[7],p=e[11],f=e[15];return _*(+r*l*u-s*c*u-r*o*h+i*c*h+s*o*m-i*l*m)+x*(+t*l*m-t*c*h+r*a*h-s*a*m+s*c*d-r*l*d)+p*(+t*c*u-t*o*m-r*a*u+i*a*m+r*o*d-i*c*d)+f*(-s*o*d-t*l*u+t*o*h+s*a*u-i*a*h+i*l*d)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],d=e[8],u=e[9],h=e[10],m=e[11],_=e[12],x=e[13],p=e[14],f=e[15],y=u*p*c-x*h*c+x*l*m-o*p*m-u*l*f+o*h*f,v=_*h*c-d*p*c-_*l*m+a*p*m+d*l*f-a*h*f,g=d*x*c-_*u*c+_*o*m-a*x*m-d*o*f+a*u*f,E=_*u*l-d*x*l-_*o*h+a*x*h+d*o*p-a*u*p,T=t*y+i*v+s*g+r*E;if(T===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const S=1/T;return e[0]=y*S,e[1]=(x*h*r-u*p*r-x*s*m+i*p*m+u*s*f-i*h*f)*S,e[2]=(o*p*r-x*l*r+x*s*c-i*p*c-o*s*f+i*l*f)*S,e[3]=(u*l*r-o*h*r-u*s*c+i*h*c+o*s*m-i*l*m)*S,e[4]=v*S,e[5]=(d*p*r-_*h*r+_*s*m-t*p*m-d*s*f+t*h*f)*S,e[6]=(_*l*r-a*p*r-_*s*c+t*p*c+a*s*f-t*l*f)*S,e[7]=(a*h*r-d*l*r+d*s*c-t*h*c-a*s*m+t*l*m)*S,e[8]=g*S,e[9]=(_*u*r-d*x*r-_*i*m+t*x*m+d*i*f-t*u*f)*S,e[10]=(a*x*r-_*o*r+_*i*c-t*x*c-a*i*f+t*o*f)*S,e[11]=(d*o*r-a*u*r-d*i*c+t*u*c+a*i*m-t*o*m)*S,e[12]=E*S,e[13]=(d*x*s-_*u*s+_*i*h-t*x*h-d*i*p+t*u*p)*S,e[14]=(_*o*s-a*x*s-_*i*l+t*x*l+a*i*p-t*o*p)*S,e[15]=(a*u*s-d*o*s+d*i*l-t*u*l-a*i*h+t*o*h)*S,this}scale(e){const t=this.elements,i=e.x,s=e.y,r=e.z;return t[0]*=i,t[4]*=s,t[8]*=r,t[1]*=i,t[5]*=s,t[9]*=r,t[2]*=i,t[6]*=s,t[10]*=r,t[3]*=i,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,s))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),s=Math.sin(t),r=1-i,a=e.x,o=e.y,l=e.z,c=r*a,d=r*o;return this.set(c*a+i,c*o-s*l,c*l+s*o,0,c*o+s*l,d*o+i,d*l-s*a,0,c*l-s*o,d*l+s*a,r*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,s,r,a){return this.set(1,i,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,i){const s=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,d=a+a,u=o+o,h=r*c,m=r*d,_=r*u,x=a*d,p=a*u,f=o*u,y=l*c,v=l*d,g=l*u,E=i.x,T=i.y,S=i.z;return s[0]=(1-(x+f))*E,s[1]=(m+g)*E,s[2]=(_-v)*E,s[3]=0,s[4]=(m-g)*T,s[5]=(1-(h+f))*T,s[6]=(p+y)*T,s[7]=0,s[8]=(_+v)*S,s[9]=(p-y)*S,s[10]=(1-(h+x))*S,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,i){const s=this.elements;let r=Ci.set(s[0],s[1],s[2]).length();const a=Ci.set(s[4],s[5],s[6]).length(),o=Ci.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],un.copy(this);const c=1/r,d=1/a,u=1/o;return un.elements[0]*=c,un.elements[1]*=c,un.elements[2]*=c,un.elements[4]*=d,un.elements[5]*=d,un.elements[6]*=d,un.elements[8]*=u,un.elements[9]*=u,un.elements[10]*=u,t.setFromRotationMatrix(un),i.x=r,i.y=a,i.z=o,this}makePerspective(e,t,i,s,r,a,o=En,l=!1){const c=this.elements,d=2*r/(t-e),u=2*r/(i-s),h=(t+e)/(t-e),m=(i+s)/(i-s);let _,x;if(l)_=r/(a-r),x=a*r/(a-r);else if(o===En)_=-(a+r)/(a-r),x=-2*a*r/(a-r);else if(o===Er)_=-a/(a-r),x=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=d,c[4]=0,c[8]=h,c[12]=0,c[1]=0,c[5]=u,c[9]=m,c[13]=0,c[2]=0,c[6]=0,c[10]=_,c[14]=x,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,i,s,r,a,o=En,l=!1){const c=this.elements,d=2/(t-e),u=2/(i-s),h=-(t+e)/(t-e),m=-(i+s)/(i-s);let _,x;if(l)_=1/(a-r),x=a/(a-r);else if(o===En)_=-2/(a-r),x=-(a+r)/(a-r);else if(o===Er)_=-1/(a-r),x=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=d,c[4]=0,c[8]=0,c[12]=h,c[1]=0,c[5]=u,c[9]=0,c[13]=m,c[2]=0,c[6]=0,c[10]=_,c[14]=x,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<16;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}}const Ci=new L,un=new dt,Ku=new L(0,0,0),Qu=new L(1,1,1),$n=new L,Vs=new L,tn=new L,il=new dt,sl=new Ot;class gn{constructor(e=0,t=0,i=0,s=gn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,s=this._order){return this._x=e,this._y=t,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const s=e.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],d=s[9],u=s[2],h=s[6],m=s[10];switch(t){case"XYZ":this._y=Math.asin(je(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-d,m),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(h,c),this._z=0);break;case"YXZ":this._x=Math.asin(-je(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(o,m),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(je(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-u,m),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-je(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(h,m),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(je(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-d,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,m));break;case"XZY":this._z=Math.asin(-je(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(h,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-d,m),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return il.makeRotationFromQuaternion(e),this.setFromRotationMatrix(il,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return sl.setFromEuler(this),this.setFromQuaternion(sl,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}gn.DEFAULT_ORDER="XYZ";class Po{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let eh=0;const rl=new L,Ri=new Ot,Ln=new dt,$s=new L,rs=new L,th=new L,nh=new Ot,al=new L(1,0,0),ol=new L(0,1,0),ll=new L(0,0,1),cl={type:"added"},ih={type:"removed"},Pi={type:"childadded",child:null},Yr={type:"childremoved",child:null};class Ct extends bi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:eh++}),this.uuid=Ki(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Ct.DEFAULT_UP.clone();const e=new L,t=new gn,i=new Ot,s=new L(1,1,1);function r(){i.setFromEuler(t,!1)}function a(){t.setFromQuaternion(i,void 0,!1)}t._onChange(r),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new dt},normalMatrix:{value:new $e}}),this.matrix=new dt,this.matrixWorld=new dt,this.matrixAutoUpdate=Ct.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Ct.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Po,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Ri.setFromAxisAngle(e,t),this.quaternion.multiply(Ri),this}rotateOnWorldAxis(e,t){return Ri.setFromAxisAngle(e,t),this.quaternion.premultiply(Ri),this}rotateX(e){return this.rotateOnAxis(al,e)}rotateY(e){return this.rotateOnAxis(ol,e)}rotateZ(e){return this.rotateOnAxis(ll,e)}translateOnAxis(e,t){return rl.copy(e).applyQuaternion(this.quaternion),this.position.add(rl.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(al,e)}translateY(e){return this.translateOnAxis(ol,e)}translateZ(e){return this.translateOnAxis(ll,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Ln.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?$s.copy(e):$s.set(e,t,i);const s=this.parent;this.updateWorldMatrix(!0,!1),rs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ln.lookAt(rs,$s,this.up):Ln.lookAt($s,rs,this.up),this.quaternion.setFromRotationMatrix(Ln),s&&(Ln.extractRotation(s.matrixWorld),Ri.setFromRotationMatrix(Ln),this.quaternion.premultiply(Ri.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(cl),Pi.child=e,this.dispatchEvent(Pi),Pi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(ih),Yr.child=e,this.dispatchEvent(Yr),Yr.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Ln.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Ln.multiply(e.parent.matrixWorld)),e.applyMatrix4(Ln),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(cl),Pi.child=e,this.dispatchEvent(Pi),Pi.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,s=this.children.length;i<s;i++){const a=this.children[i].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(rs,e,th),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(rs,nh,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,d=l.length;c<d;c++){const u=l[c];r(e.shapes,u)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];s.animations.push(r(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),d=a(e.images),u=a(e.shapes),h=a(e.skeletons),m=a(e.animations),_=a(e.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),d.length>0&&(i.images=d),u.length>0&&(i.shapes=u),h.length>0&&(i.skeletons=h),m.length>0&&(i.animations=m),_.length>0&&(i.nodes=_)}return i.object=s,i;function a(o){const l=[];for(const c in o){const d=o[c];delete d.metadata,l.push(d)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const s=e.children[i];this.add(s.clone())}return this}}Ct.DEFAULT_UP=new L(0,1,0);Ct.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ct.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const hn=new L,Dn=new L,Zr=new L,In=new L,Li=new L,Di=new L,dl=new L,Jr=new L,Kr=new L,Qr=new L,ea=new Tt,ta=new Tt,na=new Tt;class cn{constructor(e=new L,t=new L,i=new L){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,s){s.subVectors(i,t),hn.subVectors(e,t),s.cross(hn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,i,s,r){hn.subVectors(s,t),Dn.subVectors(i,t),Zr.subVectors(e,t);const a=hn.dot(hn),o=hn.dot(Dn),l=hn.dot(Zr),c=Dn.dot(Dn),d=Dn.dot(Zr),u=a*c-o*o;if(u===0)return r.set(0,0,0),null;const h=1/u,m=(c*l-o*d)*h,_=(a*d-o*l)*h;return r.set(1-m-_,_,m)}static containsPoint(e,t,i,s){return this.getBarycoord(e,t,i,s,In)===null?!1:In.x>=0&&In.y>=0&&In.x+In.y<=1}static getInterpolation(e,t,i,s,r,a,o,l){return this.getBarycoord(e,t,i,s,In)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,In.x),l.addScaledVector(a,In.y),l.addScaledVector(o,In.z),l)}static getInterpolatedAttribute(e,t,i,s,r,a){return ea.setScalar(0),ta.setScalar(0),na.setScalar(0),ea.fromBufferAttribute(e,t),ta.fromBufferAttribute(e,i),na.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(ea,r.x),a.addScaledVector(ta,r.y),a.addScaledVector(na,r.z),a}static isFrontFacing(e,t,i,s){return hn.subVectors(i,t),Dn.subVectors(e,t),hn.cross(Dn).dot(s)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,s){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,i,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return hn.subVectors(this.c,this.b),Dn.subVectors(this.a,this.b),hn.cross(Dn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return cn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return cn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,s,r){return cn.getInterpolation(e,this.a,this.b,this.c,t,i,s,r)}containsPoint(e){return cn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return cn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,s=this.b,r=this.c;let a,o;Li.subVectors(s,i),Di.subVectors(r,i),Jr.subVectors(e,i);const l=Li.dot(Jr),c=Di.dot(Jr);if(l<=0&&c<=0)return t.copy(i);Kr.subVectors(e,s);const d=Li.dot(Kr),u=Di.dot(Kr);if(d>=0&&u<=d)return t.copy(s);const h=l*u-d*c;if(h<=0&&l>=0&&d<=0)return a=l/(l-d),t.copy(i).addScaledVector(Li,a);Qr.subVectors(e,r);const m=Li.dot(Qr),_=Di.dot(Qr);if(_>=0&&m<=_)return t.copy(r);const x=m*c-l*_;if(x<=0&&c>=0&&_<=0)return o=c/(c-_),t.copy(i).addScaledVector(Di,o);const p=d*_-m*u;if(p<=0&&u-d>=0&&m-_>=0)return dl.subVectors(r,s),o=(u-d)/(u-d+(m-_)),t.copy(s).addScaledVector(dl,o);const f=1/(p+x+h);return a=x*f,o=h*f,t.copy(i).addScaledVector(Li,a).addScaledVector(Di,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Uc={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Wn={h:0,s:0,l:0},Ws={h:0,s:0,l:0};function ia(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class Xe{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=on){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,tt.colorSpaceToWorking(this,t),this}setRGB(e,t,i,s=tt.workingColorSpace){return this.r=e,this.g=t,this.b=i,tt.colorSpaceToWorking(this,s),this}setHSL(e,t,i,s=tt.workingColorSpace){if(e=Hu(e,1),t=je(t,0,1),i=je(i,0,1),t===0)this.r=this.g=this.b=i;else{const r=i<=.5?i*(1+t):i+t-i*t,a=2*i-r;this.r=ia(a,r,e+1/3),this.g=ia(a,r,e),this.b=ia(a,r,e-1/3)}return tt.colorSpaceToWorking(this,s),this}setStyle(e,t=on){function i(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=on){const i=Uc[e.toLowerCase()];return i!==void 0?this.setHex(i,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=zn(e.r),this.g=zn(e.g),this.b=zn(e.b),this}copyLinearToSRGB(e){return this.r=$i(e.r),this.g=$i(e.g),this.b=$i(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=on){return tt.workingToColorSpace(kt.copy(this),e),Math.round(je(kt.r*255,0,255))*65536+Math.round(je(kt.g*255,0,255))*256+Math.round(je(kt.b*255,0,255))}getHexString(e=on){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=tt.workingColorSpace){tt.workingToColorSpace(kt.copy(this),t);const i=kt.r,s=kt.g,r=kt.b,a=Math.max(i,s,r),o=Math.min(i,s,r);let l,c;const d=(o+a)/2;if(o===a)l=0,c=0;else{const u=a-o;switch(c=d<=.5?u/(a+o):u/(2-a-o),a){case i:l=(s-r)/u+(s<r?6:0);break;case s:l=(r-i)/u+2;break;case r:l=(i-s)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=d,e}getRGB(e,t=tt.workingColorSpace){return tt.workingToColorSpace(kt.copy(this),t),e.r=kt.r,e.g=kt.g,e.b=kt.b,e}getStyle(e=on){tt.workingToColorSpace(kt.copy(this),e);const t=kt.r,i=kt.g,s=kt.b;return e!==on?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(e,t,i){return this.getHSL(Wn),this.setHSL(Wn.h+e,Wn.s+t,Wn.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(Wn),e.getHSL(Ws);const i=Br(Wn.h,Ws.h,t),s=Br(Wn.s,Ws.s,t),r=Br(Wn.l,Ws.l,t);return this.setHSL(i,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*i+r[6]*s,this.g=r[1]*t+r[4]*i+r[7]*s,this.b=r[2]*t+r[5]*i+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const kt=new Xe;Xe.NAMES=Uc;let sh=0;class Qi extends bi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:sh++}),this.uuid=Ki(),this.name="",this.type="Material",this.blending=Vi,this.side=Kn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=wa,this.blendDst=Ta,this.blendEquation=fi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Xe(0,0,0),this.blendAlpha=0,this.depthFunc=Wi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Zo,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Si,this.stencilZFail=Si,this.stencilZPass=Si,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Vi&&(i.blending=this.blending),this.side!==Kn&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==wa&&(i.blendSrc=this.blendSrc),this.blendDst!==Ta&&(i.blendDst=this.blendDst),this.blendEquation!==fi&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Wi&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Zo&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Si&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Si&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Si&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(t){const r=s(e.textures),a=s(e.images);r.length>0&&(i.textures=r),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const s=t.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=t[r].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class Ir extends Qi{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Xe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new gn,this.combine=yc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Rt=new L,js=new oe;let rh=0;class wn{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:rh++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=Jo,this.updateRanges=[],this.gpuType=On,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[i+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)js.fromBufferAttribute(this,t),js.applyMatrix3(e),this.setXY(t,js.x,js.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)Rt.fromBufferAttribute(this,t),Rt.applyMatrix3(e),this.setXYZ(t,Rt.x,Rt.y,Rt.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)Rt.fromBufferAttribute(this,t),Rt.applyMatrix4(e),this.setXYZ(t,Rt.x,Rt.y,Rt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Rt.fromBufferAttribute(this,t),Rt.applyNormalMatrix(e),this.setXYZ(t,Rt.x,Rt.y,Rt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Rt.fromBufferAttribute(this,t),Rt.transformDirection(e),this.setXYZ(t,Rt.x,Rt.y,Rt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=ns(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=qt(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=ns(t,this.array)),t}setX(e,t){return this.normalized&&(t=qt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=ns(t,this.array)),t}setY(e,t){return this.normalized&&(t=qt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=ns(t,this.array)),t}setZ(e,t){return this.normalized&&(t=qt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=ns(t,this.array)),t}setW(e,t){return this.normalized&&(t=qt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=qt(t,this.array),i=qt(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,s){return e*=this.itemSize,this.normalized&&(t=qt(t,this.array),i=qt(i,this.array),s=qt(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this}setXYZW(e,t,i,s,r){return e*=this.itemSize,this.normalized&&(t=qt(t,this.array),i=qt(i,this.array),s=qt(s,this.array),r=qt(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Jo&&(e.usage=this.usage),e}}class Nc extends wn{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class Fc extends wn{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class rt extends wn{constructor(e,t,i){super(new Float32Array(e),t,i)}}let ah=0;const an=new dt,sa=new Ct,Ii=new L,nn=new Ps,as=new Ps,Ut=new L;class Nt extends bi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:ah++}),this.uuid=Ki(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Dc(e)?Fc:Nc)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const r=new $e().getNormalMatrix(e);i.applyNormalMatrix(r),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return an.makeRotationFromQuaternion(e),this.applyMatrix4(an),this}rotateX(e){return an.makeRotationX(e),this.applyMatrix4(an),this}rotateY(e){return an.makeRotationY(e),this.applyMatrix4(an),this}rotateZ(e){return an.makeRotationZ(e),this.applyMatrix4(an),this}translate(e,t,i){return an.makeTranslation(e,t,i),this.applyMatrix4(an),this}scale(e,t,i){return an.makeScale(e,t,i),this.applyMatrix4(an),this}lookAt(e){return sa.lookAt(e),sa.updateMatrix(),this.applyMatrix4(sa.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ii).negate(),this.translate(Ii.x,Ii.y,Ii.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let s=0,r=e.length;s<r;s++){const a=e[s];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new rt(i,3))}else{const i=Math.min(e.length,t.count);for(let s=0;s<i;s++){const r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ps);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new L(-1/0,-1/0,-1/0),new L(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,s=t.length;i<s;i++){const r=t[i];nn.setFromBufferAttribute(r),this.morphTargetsRelative?(Ut.addVectors(this.boundingBox.min,nn.min),this.boundingBox.expandByPoint(Ut),Ut.addVectors(this.boundingBox.max,nn.max),this.boundingBox.expandByPoint(Ut)):(this.boundingBox.expandByPoint(nn.min),this.boundingBox.expandByPoint(nn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Lr);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new L,1/0);return}if(e){const i=this.boundingSphere.center;if(nn.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];as.setFromBufferAttribute(o),this.morphTargetsRelative?(Ut.addVectors(nn.min,as.min),nn.expandByPoint(Ut),Ut.addVectors(nn.max,as.max),nn.expandByPoint(Ut)):(nn.expandByPoint(as.min),nn.expandByPoint(as.max))}nn.getCenter(i);let s=0;for(let r=0,a=e.count;r<a;r++)Ut.fromBufferAttribute(e,r),s=Math.max(s,i.distanceToSquared(Ut));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],l=this.morphTargetsRelative;for(let c=0,d=o.count;c<d;c++)Ut.fromBufferAttribute(o,c),l&&(Ii.fromBufferAttribute(e,c),Ut.add(Ii)),s=Math.max(s,i.distanceToSquared(Ut))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new wn(new Float32Array(4*i.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let A=0;A<i.count;A++)o[A]=new L,l[A]=new L;const c=new L,d=new L,u=new L,h=new oe,m=new oe,_=new oe,x=new L,p=new L;function f(A,M,b){c.fromBufferAttribute(i,A),d.fromBufferAttribute(i,M),u.fromBufferAttribute(i,b),h.fromBufferAttribute(r,A),m.fromBufferAttribute(r,M),_.fromBufferAttribute(r,b),d.sub(c),u.sub(c),m.sub(h),_.sub(h);const R=1/(m.x*_.y-_.x*m.y);isFinite(R)&&(x.copy(d).multiplyScalar(_.y).addScaledVector(u,-m.y).multiplyScalar(R),p.copy(u).multiplyScalar(m.x).addScaledVector(d,-_.x).multiplyScalar(R),o[A].add(x),o[M].add(x),o[b].add(x),l[A].add(p),l[M].add(p),l[b].add(p))}let y=this.groups;y.length===0&&(y=[{start:0,count:e.count}]);for(let A=0,M=y.length;A<M;++A){const b=y[A],R=b.start,I=b.count;for(let B=R,H=R+I;B<H;B+=3)f(e.getX(B+0),e.getX(B+1),e.getX(B+2))}const v=new L,g=new L,E=new L,T=new L;function S(A){E.fromBufferAttribute(s,A),T.copy(E);const M=o[A];v.copy(M),v.sub(E.multiplyScalar(E.dot(M))).normalize(),g.crossVectors(T,M);const R=g.dot(l[A])<0?-1:1;a.setXYZW(A,v.x,v.y,v.z,R)}for(let A=0,M=y.length;A<M;++A){const b=y[A],R=b.start,I=b.count;for(let B=R,H=R+I;B<H;B+=3)S(e.getX(B+0)),S(e.getX(B+1)),S(e.getX(B+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new wn(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let h=0,m=i.count;h<m;h++)i.setXYZ(h,0,0,0);const s=new L,r=new L,a=new L,o=new L,l=new L,c=new L,d=new L,u=new L;if(e)for(let h=0,m=e.count;h<m;h+=3){const _=e.getX(h+0),x=e.getX(h+1),p=e.getX(h+2);s.fromBufferAttribute(t,_),r.fromBufferAttribute(t,x),a.fromBufferAttribute(t,p),d.subVectors(a,r),u.subVectors(s,r),d.cross(u),o.fromBufferAttribute(i,_),l.fromBufferAttribute(i,x),c.fromBufferAttribute(i,p),o.add(d),l.add(d),c.add(d),i.setXYZ(_,o.x,o.y,o.z),i.setXYZ(x,l.x,l.y,l.z),i.setXYZ(p,c.x,c.y,c.z)}else for(let h=0,m=t.count;h<m;h+=3)s.fromBufferAttribute(t,h+0),r.fromBufferAttribute(t,h+1),a.fromBufferAttribute(t,h+2),d.subVectors(a,r),u.subVectors(s,r),d.cross(u),i.setXYZ(h+0,d.x,d.y,d.z),i.setXYZ(h+1,d.x,d.y,d.z),i.setXYZ(h+2,d.x,d.y,d.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)Ut.fromBufferAttribute(e,t),Ut.normalize(),e.setXYZ(t,Ut.x,Ut.y,Ut.z)}toNonIndexed(){function e(o,l){const c=o.array,d=o.itemSize,u=o.normalized,h=new c.constructor(l.length*d);let m=0,_=0;for(let x=0,p=l.length;x<p;x++){o.isInterleavedBufferAttribute?m=l[x]*o.data.stride+o.offset:m=l[x]*d;for(let f=0;f<d;f++)h[_++]=c[m++]}return new wn(h,d,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Nt,i=this.index.array,s=this.attributes;for(const o in s){const l=s[o],c=e(l,i);t.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let d=0,u=c.length;d<u;d++){const h=c[d],m=e(h,i);l.push(m)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],d=[];for(let u=0,h=c.length;u<h;u++){const m=c[u];d.push(m.toJSON(e.data))}d.length>0&&(s[l]=d,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const s=e.attributes;for(const c in s){const d=s[c];this.setAttribute(c,d.clone(t))}const r=e.morphAttributes;for(const c in r){const d=[],u=r[c];for(let h=0,m=u.length;h<m;h++)d.push(u[h].clone(t));this.morphAttributes[c]=d}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,d=a.length;c<d;c++){const u=a[c];this.addGroup(u.start,u.count,u.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const ul=new dt,ri=new Dr,Xs=new Lr,hl=new L,qs=new L,Ys=new L,Zs=new L,ra=new L,Js=new L,fl=new L,Ks=new L;class ye extends Ct{constructor(e=new Nt,t=new Ir){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,a=i.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(r&&o){Js.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const d=o[l],u=r[l];d!==0&&(ra.fromBufferAttribute(u,e),a?Js.addScaledVector(ra,d):Js.addScaledVector(ra.sub(t),d))}t.add(Js)}return t}raycast(e,t){const i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Xs.copy(i.boundingSphere),Xs.applyMatrix4(r),ri.copy(e.ray).recast(e.near),!(Xs.containsPoint(ri.origin)===!1&&(ri.intersectSphere(Xs,hl)===null||ri.origin.distanceToSquared(hl)>(e.far-e.near)**2))&&(ul.copy(r).invert(),ri.copy(e.ray).applyMatrix4(ul),!(i.boundingBox!==null&&ri.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,ri)))}_computeIntersections(e,t,i){let s;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,d=r.attributes.uv1,u=r.attributes.normal,h=r.groups,m=r.drawRange;if(o!==null)if(Array.isArray(a))for(let _=0,x=h.length;_<x;_++){const p=h[_],f=a[p.materialIndex],y=Math.max(p.start,m.start),v=Math.min(o.count,Math.min(p.start+p.count,m.start+m.count));for(let g=y,E=v;g<E;g+=3){const T=o.getX(g),S=o.getX(g+1),A=o.getX(g+2);s=Qs(this,f,e,i,c,d,u,T,S,A),s&&(s.faceIndex=Math.floor(g/3),s.face.materialIndex=p.materialIndex,t.push(s))}}else{const _=Math.max(0,m.start),x=Math.min(o.count,m.start+m.count);for(let p=_,f=x;p<f;p+=3){const y=o.getX(p),v=o.getX(p+1),g=o.getX(p+2);s=Qs(this,a,e,i,c,d,u,y,v,g),s&&(s.faceIndex=Math.floor(p/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let _=0,x=h.length;_<x;_++){const p=h[_],f=a[p.materialIndex],y=Math.max(p.start,m.start),v=Math.min(l.count,Math.min(p.start+p.count,m.start+m.count));for(let g=y,E=v;g<E;g+=3){const T=g,S=g+1,A=g+2;s=Qs(this,f,e,i,c,d,u,T,S,A),s&&(s.faceIndex=Math.floor(g/3),s.face.materialIndex=p.materialIndex,t.push(s))}}else{const _=Math.max(0,m.start),x=Math.min(l.count,m.start+m.count);for(let p=_,f=x;p<f;p+=3){const y=p,v=p+1,g=p+2;s=Qs(this,a,e,i,c,d,u,y,v,g),s&&(s.faceIndex=Math.floor(p/3),t.push(s))}}}}function oh(n,e,t,i,s,r,a,o){let l;if(e.side===Jt?l=i.intersectTriangle(a,r,s,!0,o):l=i.intersectTriangle(s,r,a,e.side===Kn,o),l===null)return null;Ks.copy(o),Ks.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(Ks);return c<t.near||c>t.far?null:{distance:c,point:Ks.clone(),object:n}}function Qs(n,e,t,i,s,r,a,o,l,c){n.getVertexPosition(o,qs),n.getVertexPosition(l,Ys),n.getVertexPosition(c,Zs);const d=oh(n,e,t,i,qs,Ys,Zs,fl);if(d){const u=new L;cn.getBarycoord(fl,qs,Ys,Zs,u),s&&(d.uv=cn.getInterpolatedAttribute(s,o,l,c,u,new oe)),r&&(d.uv1=cn.getInterpolatedAttribute(r,o,l,c,u,new oe)),a&&(d.normal=cn.getInterpolatedAttribute(a,o,l,c,u,new L),d.normal.dot(i.direction)>0&&d.normal.multiplyScalar(-1));const h={a:o,b:l,c,normal:new L,materialIndex:0};cn.getNormal(qs,Ys,Zs,h.normal),d.face=h,d.barycoord=u}return d}class St extends Nt{constructor(e=1,t=1,i=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],d=[],u=[];let h=0,m=0;_("z","y","x",-1,-1,i,t,e,a,r,0),_("z","y","x",1,-1,i,t,-e,a,r,1),_("x","z","y",1,1,e,i,t,s,a,2),_("x","z","y",1,-1,e,i,-t,s,a,3),_("x","y","z",1,-1,e,t,i,s,r,4),_("x","y","z",-1,-1,e,t,-i,s,r,5),this.setIndex(l),this.setAttribute("position",new rt(c,3)),this.setAttribute("normal",new rt(d,3)),this.setAttribute("uv",new rt(u,2));function _(x,p,f,y,v,g,E,T,S,A,M){const b=g/S,R=E/A,I=g/2,B=E/2,H=T/2,k=S+1,$=A+1;let q=0,W=0;const ie=new L;for(let pe=0;pe<$;pe++){const be=pe*R-B;for(let Oe=0;Oe<k;Oe++){const qe=Oe*b-I;ie[x]=qe*y,ie[p]=be*v,ie[f]=H,c.push(ie.x,ie.y,ie.z),ie[x]=0,ie[p]=0,ie[f]=T>0?1:-1,d.push(ie.x,ie.y,ie.z),u.push(Oe/S),u.push(1-pe/A),q+=1}}for(let pe=0;pe<A;pe++)for(let be=0;be<S;be++){const Oe=h+be+k*pe,qe=h+be+k*(pe+1),Qe=h+(be+1)+k*(pe+1),Ke=h+(be+1)+k*pe;l.push(Oe,qe,Ke),l.push(qe,Qe,Ke),W+=6}o.addGroup(m,W,M),m+=W,h+=q}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new St(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Yi(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const s=n[t][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=s.clone():Array.isArray(s)?e[t][i]=s.slice():e[t][i]=s}}return e}function Wt(n){const e={};for(let t=0;t<n.length;t++){const i=Yi(n[t]);for(const s in i)e[s]=i[s]}return e}function lh(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function Oc(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:tt.workingColorSpace}const ch={clone:Yi,merge:Wt};var dh=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,uh=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Qn extends Qi{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=dh,this.fragmentShader=uh,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Yi(e.uniforms),this.uniformsGroups=lh(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class zc extends Ct{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new dt,this.projectionMatrix=new dt,this.projectionMatrixInverse=new dt,this.coordinateSystem=En,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const jn=new L,pl=new oe,ml=new oe;class ln extends zc{constructor(e=50,t=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=fo*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(gs*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return fo*2*Math.atan(Math.tan(gs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){jn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(jn.x,jn.y).multiplyScalar(-e/jn.z),jn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(jn.x,jn.y).multiplyScalar(-e/jn.z)}getViewSize(e,t){return this.getViewBounds(e,pl,ml),t.subVectors(ml,pl)}setViewOffset(e,t,i,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(gs*.5*this.fov)/this.zoom,i=2*t,s=this.aspect*i,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,t-=a.offsetY*i/c,s*=a.width/l,i*=a.height/c}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Ui=-90,Ni=1;class hh extends Ct{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new ln(Ui,Ni,e,t);s.layers=this.layers,this.add(s);const r=new ln(Ui,Ni,e,t);r.layers=this.layers,this.add(r);const a=new ln(Ui,Ni,e,t);a.layers=this.layers,this.add(a);const o=new ln(Ui,Ni,e,t);o.layers=this.layers,this.add(o);const l=new ln(Ui,Ni,e,t);l.layers=this.layers,this.add(l);const c=new ln(Ui,Ni,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,s,r,a,o,l]=t;for(const c of t)this.remove(c);if(e===En)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Er)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,d]=this.children,u=e.getRenderTarget(),h=e.getActiveCubeFace(),m=e.getActiveMipmapLevel(),_=e.xr.enabled;e.xr.enabled=!1;const x=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,s),e.render(t,r),e.setRenderTarget(i,1,s),e.render(t,a),e.setRenderTarget(i,2,s),e.render(t,o),e.setRenderTarget(i,3,s),e.render(t,l),e.setRenderTarget(i,4,s),e.render(t,c),i.texture.generateMipmaps=x,e.setRenderTarget(i,5,s),e.render(t,d),e.setRenderTarget(u,h,m),e.xr.enabled=_,i.texture.needsPMREMUpdate=!0}}class Bc extends Kt{constructor(e=[],t=ji,i,s,r,a,o,l,c,d){super(e,t,i,s,r,a,o,l,c,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class fh extends xi{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},s=[i,i,i,i,i,i];this.texture=new Bc(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new St(5,5,5),r=new Qn({name:"CubemapFromEquirect",uniforms:Yi(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Jt,blending:Zn});r.uniforms.tEquirect.value=t;const a=new ye(s,r),o=t.minFilter;return t.minFilter===_i&&(t.minFilter=Sn),new hh(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,i=!0,s=!0){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,i,s);e.setRenderTarget(r)}}class us extends Ct{constructor(){super(),this.isGroup=!0,this.type="Group"}}const ph={type:"move"};class aa{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new us,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new us,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new L,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new L),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new us,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new L,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new L),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let s=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const x of e.hand.values()){const p=t.getJointPose(x,i),f=this._getHandJoint(c,x);p!==null&&(f.matrix.fromArray(p.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=p.radius),f.visible=p!==null}const d=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],h=d.position.distanceTo(u.position),m=.02,_=.005;c.inputState.pinching&&h>m+_?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&h<=m-_&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,i),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(s=t.getPose(e.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(ph)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new us;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}class mh extends Ct{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new gn,this.environmentIntensity=1,this.environmentRotation=new gn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}const oa=new L,gh=new L,_h=new $e;class qn{constructor(e=new L(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,s){return this.normal.set(e,t,i),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const s=oa.subVectors(i,t).cross(gh.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const i=e.delta(oa),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(i,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||_h.getNormalMatrix(e),s=this.coplanarPoint(oa).applyMatrix4(e),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ai=new Lr,vh=new oe(.5,.5),er=new L;class Lo{constructor(e=new qn,t=new qn,i=new qn,s=new qn,r=new qn,a=new qn){this.planes=[e,t,i,s,r,a]}set(e,t,i,s,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=En,i=!1){const s=this.planes,r=e.elements,a=r[0],o=r[1],l=r[2],c=r[3],d=r[4],u=r[5],h=r[6],m=r[7],_=r[8],x=r[9],p=r[10],f=r[11],y=r[12],v=r[13],g=r[14],E=r[15];if(s[0].setComponents(c-a,m-d,f-_,E-y).normalize(),s[1].setComponents(c+a,m+d,f+_,E+y).normalize(),s[2].setComponents(c+o,m+u,f+x,E+v).normalize(),s[3].setComponents(c-o,m-u,f-x,E-v).normalize(),i)s[4].setComponents(l,h,p,g).normalize(),s[5].setComponents(c-l,m-h,f-p,E-g).normalize();else if(s[4].setComponents(c-l,m-h,f-p,E-g).normalize(),t===En)s[5].setComponents(c+l,m+h,f+p,E+g).normalize();else if(t===Er)s[5].setComponents(l,h,p,g).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ai.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),ai.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ai)}intersectsSprite(e){ai.center.set(0,0,0);const t=vh.distanceTo(e.center);return ai.radius=.7071067811865476+t,ai.applyMatrix4(e.matrixWorld),this.intersectsSphere(ai)}intersectsSphere(e){const t=this.planes,i=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const s=t[i];if(er.x=s.normal.x>0?e.max.x:e.min.x,er.y=s.normal.y>0?e.max.y:e.min.y,er.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(er)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Zi extends Qi{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Xe(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Tr=new L,Ar=new L,gl=new dt,os=new Dr,tr=new Lr,la=new L,_l=new L;class Fn extends Ct{constructor(e=new Nt,t=new Zi){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[0];for(let s=1,r=t.count;s<r;s++)Tr.fromBufferAttribute(t,s-1),Ar.fromBufferAttribute(t,s),i[s]=i[s-1],i[s]+=Tr.distanceTo(Ar);e.setAttribute("lineDistance",new rt(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const i=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),tr.copy(i.boundingSphere),tr.applyMatrix4(s),tr.radius+=r,e.ray.intersectsSphere(tr)===!1)return;gl.copy(s).invert(),os.copy(e.ray).applyMatrix4(gl);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,d=i.index,h=i.attributes.position;if(d!==null){const m=Math.max(0,a.start),_=Math.min(d.count,a.start+a.count);for(let x=m,p=_-1;x<p;x+=c){const f=d.getX(x),y=d.getX(x+1),v=nr(this,e,os,l,f,y,x);v&&t.push(v)}if(this.isLineLoop){const x=d.getX(_-1),p=d.getX(m),f=nr(this,e,os,l,x,p,_-1);f&&t.push(f)}}else{const m=Math.max(0,a.start),_=Math.min(h.count,a.start+a.count);for(let x=m,p=_-1;x<p;x+=c){const f=nr(this,e,os,l,x,x+1,x);f&&t.push(f)}if(this.isLineLoop){const x=nr(this,e,os,l,_-1,m,_-1);x&&t.push(x)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function nr(n,e,t,i,s,r,a){const o=n.geometry.attributes.position;if(Tr.fromBufferAttribute(o,s),Ar.fromBufferAttribute(o,r),t.distanceSqToSegment(Tr,Ar,la,_l)>i)return;la.applyMatrix4(n.matrixWorld);const c=e.ray.origin.distanceTo(la);if(!(c<e.near||c>e.far))return{distance:c,point:_l.clone().applyMatrix4(n.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:n}}const vl=new L,xl=new L;class Cr extends Fn{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[];for(let s=0,r=t.count;s<r;s+=2)vl.fromBufferAttribute(t,s),xl.fromBufferAttribute(t,s+1),i[s]=s===0?0:i[s-1],i[s+1]=i[s]+vl.distanceTo(xl);e.setAttribute("lineDistance",new rt(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class kc extends Kt{constructor(e,t,i=vi,s,r,a,o=mn,l=mn,c,d=Ss,u=1){if(d!==Ss&&d!==Es)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const h={width:e,height:t,depth:u};super(h,s,r,a,o,l,d,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Ro(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class Hc extends Kt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class Ft extends Nt{constructor(e=1,t=1,i=1,s=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};const c=this;s=Math.floor(s),r=Math.floor(r);const d=[],u=[],h=[],m=[];let _=0;const x=[],p=i/2;let f=0;y(),a===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(d),this.setAttribute("position",new rt(u,3)),this.setAttribute("normal",new rt(h,3)),this.setAttribute("uv",new rt(m,2));function y(){const g=new L,E=new L;let T=0;const S=(t-e)/i;for(let A=0;A<=r;A++){const M=[],b=A/r,R=b*(t-e)+e;for(let I=0;I<=s;I++){const B=I/s,H=B*l+o,k=Math.sin(H),$=Math.cos(H);E.x=R*k,E.y=-b*i+p,E.z=R*$,u.push(E.x,E.y,E.z),g.set(k,S,$).normalize(),h.push(g.x,g.y,g.z),m.push(B,1-b),M.push(_++)}x.push(M)}for(let A=0;A<s;A++)for(let M=0;M<r;M++){const b=x[M][A],R=x[M+1][A],I=x[M+1][A+1],B=x[M][A+1];(e>0||M!==0)&&(d.push(b,R,B),T+=3),(t>0||M!==r-1)&&(d.push(R,I,B),T+=3)}c.addGroup(f,T,0),f+=T}function v(g){const E=_,T=new oe,S=new L;let A=0;const M=g===!0?e:t,b=g===!0?1:-1;for(let I=1;I<=s;I++)u.push(0,p*b,0),h.push(0,b,0),m.push(.5,.5),_++;const R=_;for(let I=0;I<=s;I++){const H=I/s*l+o,k=Math.cos(H),$=Math.sin(H);S.x=M*$,S.y=p*b,S.z=M*k,u.push(S.x,S.y,S.z),h.push(0,b,0),T.x=k*.5+.5,T.y=$*.5*b+.5,m.push(T.x,T.y),_++}for(let I=0;I<s;I++){const B=E+I,H=R+I;g===!0?d.push(H,H+1,B):d.push(H+1,H,B),A+=3}c.addGroup(f,A,g===!0?1:2),f+=A}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ft(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Do extends Nt{constructor(e=[],t=[],i=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:i,detail:s};const r=[],a=[];o(s),c(i),d(),this.setAttribute("position",new rt(r,3)),this.setAttribute("normal",new rt(r.slice(),3)),this.setAttribute("uv",new rt(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(y){const v=new L,g=new L,E=new L;for(let T=0;T<t.length;T+=3)m(t[T+0],v),m(t[T+1],g),m(t[T+2],E),l(v,g,E,y)}function l(y,v,g,E){const T=E+1,S=[];for(let A=0;A<=T;A++){S[A]=[];const M=y.clone().lerp(g,A/T),b=v.clone().lerp(g,A/T),R=T-A;for(let I=0;I<=R;I++)I===0&&A===T?S[A][I]=M:S[A][I]=M.clone().lerp(b,I/R)}for(let A=0;A<T;A++)for(let M=0;M<2*(T-A)-1;M++){const b=Math.floor(M/2);M%2===0?(h(S[A][b+1]),h(S[A+1][b]),h(S[A][b])):(h(S[A][b+1]),h(S[A+1][b+1]),h(S[A+1][b]))}}function c(y){const v=new L;for(let g=0;g<r.length;g+=3)v.x=r[g+0],v.y=r[g+1],v.z=r[g+2],v.normalize().multiplyScalar(y),r[g+0]=v.x,r[g+1]=v.y,r[g+2]=v.z}function d(){const y=new L;for(let v=0;v<r.length;v+=3){y.x=r[v+0],y.y=r[v+1],y.z=r[v+2];const g=p(y)/2/Math.PI+.5,E=f(y)/Math.PI+.5;a.push(g,1-E)}_(),u()}function u(){for(let y=0;y<a.length;y+=6){const v=a[y+0],g=a[y+2],E=a[y+4],T=Math.max(v,g,E),S=Math.min(v,g,E);T>.9&&S<.1&&(v<.2&&(a[y+0]+=1),g<.2&&(a[y+2]+=1),E<.2&&(a[y+4]+=1))}}function h(y){r.push(y.x,y.y,y.z)}function m(y,v){const g=y*3;v.x=e[g+0],v.y=e[g+1],v.z=e[g+2]}function _(){const y=new L,v=new L,g=new L,E=new L,T=new oe,S=new oe,A=new oe;for(let M=0,b=0;M<r.length;M+=9,b+=6){y.set(r[M+0],r[M+1],r[M+2]),v.set(r[M+3],r[M+4],r[M+5]),g.set(r[M+6],r[M+7],r[M+8]),T.set(a[b+0],a[b+1]),S.set(a[b+2],a[b+3]),A.set(a[b+4],a[b+5]),E.copy(y).add(v).add(g).divideScalar(3);const R=p(E);x(T,b+0,y,R),x(S,b+2,v,R),x(A,b+4,g,R)}}function x(y,v,g,E){E<0&&y.x===1&&(a[v]=y.x-1),g.x===0&&g.z===0&&(a[v]=E/2/Math.PI+.5)}function p(y){return Math.atan2(y.z,-y.x)}function f(y){return Math.atan2(-y.y,Math.sqrt(y.x*y.x+y.z*y.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Do(e.vertices,e.indices,e.radius,e.details)}}const ir=new L,sr=new L,ca=new L,rr=new cn;class po extends Nt{constructor(e=null,t=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:e,thresholdAngle:t},e!==null){const s=Math.pow(10,4),r=Math.cos(gs*t),a=e.getIndex(),o=e.getAttribute("position"),l=a?a.count:o.count,c=[0,0,0],d=["a","b","c"],u=new Array(3),h={},m=[];for(let _=0;_<l;_+=3){a?(c[0]=a.getX(_),c[1]=a.getX(_+1),c[2]=a.getX(_+2)):(c[0]=_,c[1]=_+1,c[2]=_+2);const{a:x,b:p,c:f}=rr;if(x.fromBufferAttribute(o,c[0]),p.fromBufferAttribute(o,c[1]),f.fromBufferAttribute(o,c[2]),rr.getNormal(ca),u[0]=`${Math.round(x.x*s)},${Math.round(x.y*s)},${Math.round(x.z*s)}`,u[1]=`${Math.round(p.x*s)},${Math.round(p.y*s)},${Math.round(p.z*s)}`,u[2]=`${Math.round(f.x*s)},${Math.round(f.y*s)},${Math.round(f.z*s)}`,!(u[0]===u[1]||u[1]===u[2]||u[2]===u[0]))for(let y=0;y<3;y++){const v=(y+1)%3,g=u[y],E=u[v],T=rr[d[y]],S=rr[d[v]],A=`${g}_${E}`,M=`${E}_${g}`;M in h&&h[M]?(ca.dot(h[M].normal)<=r&&(m.push(T.x,T.y,T.z),m.push(S.x,S.y,S.z)),h[M]=null):A in h||(h[A]={index0:c[y],index1:c[v],normal:ca.clone()})}}for(const _ in h)if(h[_]){const{index0:x,index1:p}=h[_];ir.fromBufferAttribute(o,x),sr.fromBufferAttribute(o,p),m.push(ir.x,ir.y,ir.z),m.push(sr.x,sr.y,sr.z)}this.setAttribute("position",new rt(m,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}}class An{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(e,t){const i=this.getUtoTmapping(e);return this.getPoint(i,t)}getPoints(e=5){const t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return t}getSpacedPoints(e=5){const t=[];for(let i=0;i<=e;i++)t.push(this.getPointAt(i/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let i,s=this.getPoint(0),r=0;t.push(0);for(let a=1;a<=e;a++)i=this.getPoint(a/e),r+=i.distanceTo(s),t.push(r),s=i;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){const i=this.getLengths();let s=0;const r=i.length;let a;t?a=t:a=e*i[r-1];let o=0,l=r-1,c;for(;o<=l;)if(s=Math.floor(o+(l-o)/2),c=i[s]-a,c<0)o=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,i[s]===a)return s/(r-1);const d=i[s],h=i[s+1]-d,m=(a-d)/h;return(s+m)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);const a=this.getPoint(s),o=this.getPoint(r),l=t||(a.isVector2?new oe:new L);return l.copy(o).sub(a).normalize(),l}getTangentAt(e,t){const i=this.getUtoTmapping(e);return this.getTangent(i,t)}computeFrenetFrames(e,t=!1){const i=new L,s=[],r=[],a=[],o=new L,l=new dt;for(let m=0;m<=e;m++){const _=m/e;s[m]=this.getTangentAt(_,new L)}r[0]=new L,a[0]=new L;let c=Number.MAX_VALUE;const d=Math.abs(s[0].x),u=Math.abs(s[0].y),h=Math.abs(s[0].z);d<=c&&(c=d,i.set(1,0,0)),u<=c&&(c=u,i.set(0,1,0)),h<=c&&i.set(0,0,1),o.crossVectors(s[0],i).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let m=1;m<=e;m++){if(r[m]=r[m-1].clone(),a[m]=a[m-1].clone(),o.crossVectors(s[m-1],s[m]),o.length()>Number.EPSILON){o.normalize();const _=Math.acos(je(s[m-1].dot(s[m]),-1,1));r[m].applyMatrix4(l.makeRotationAxis(o,_))}a[m].crossVectors(s[m],r[m])}if(t===!0){let m=Math.acos(je(r[0].dot(r[e]),-1,1));m/=e,s[0].dot(o.crossVectors(r[0],r[e]))>0&&(m=-m);for(let _=1;_<=e;_++)r[_].applyMatrix4(l.makeRotationAxis(s[_],m*_)),a[_].crossVectors(s[_],r[_])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class Io extends An{constructor(e=0,t=0,i=1,s=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=i,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(e,t=new oe){const i=t,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);const o=this.aStartAngle+e*r;let l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const d=Math.cos(this.aRotation),u=Math.sin(this.aRotation),h=l-this.aX,m=c-this.aY;l=h*d-m*u+this.aX,c=h*u+m*d+this.aY}return i.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class xh extends Io{constructor(e,t,i,s,r,a){super(e,t,i,i,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function Uo(){let n=0,e=0,t=0,i=0;function s(r,a,o,l){n=r,e=o,t=-3*r+3*a-2*o-l,i=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){s(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,d,u){let h=(a-r)/c-(o-r)/(c+d)+(o-a)/d,m=(o-a)/d-(l-a)/(d+u)+(l-o)/u;h*=d,m*=d,s(a,o,h,m)},calc:function(r){const a=r*r,o=a*r;return n+e*r+t*a+i*o}}}const ar=new L,da=new Uo,ua=new Uo,ha=new Uo;class yh extends An{constructor(e=[],t=!1,i="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=i,this.tension=s}getPoint(e,t=new L){const i=t,s=this.points,r=s.length,a=(r-(this.closed?0:1))*e;let o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,d;this.closed||o>0?c=s[(o-1)%r]:(ar.subVectors(s[0],s[1]).add(s[0]),c=ar);const u=s[o%r],h=s[(o+1)%r];if(this.closed||o+2<r?d=s[(o+2)%r]:(ar.subVectors(s[r-1],s[r-2]).add(s[r-1]),d=ar),this.curveType==="centripetal"||this.curveType==="chordal"){const m=this.curveType==="chordal"?.5:.25;let _=Math.pow(c.distanceToSquared(u),m),x=Math.pow(u.distanceToSquared(h),m),p=Math.pow(h.distanceToSquared(d),m);x<1e-4&&(x=1),_<1e-4&&(_=x),p<1e-4&&(p=x),da.initNonuniformCatmullRom(c.x,u.x,h.x,d.x,_,x,p),ua.initNonuniformCatmullRom(c.y,u.y,h.y,d.y,_,x,p),ha.initNonuniformCatmullRom(c.z,u.z,h.z,d.z,_,x,p)}else this.curveType==="catmullrom"&&(da.initCatmullRom(c.x,u.x,h.x,d.x,this.tension),ua.initCatmullRom(c.y,u.y,h.y,d.y,this.tension),ha.initCatmullRom(c.z,u.z,h.z,d.z,this.tension));return i.set(da.calc(l),ua.calc(l),ha.calc(l)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){const s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const s=e.points[t];this.points.push(new L().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function yl(n,e,t,i,s){const r=(i-e)*.5,a=(s-t)*.5,o=n*n,l=n*o;return(2*t-2*i+r+a)*l+(-3*t+3*i-2*r-a)*o+r*n+t}function bh(n,e){const t=1-n;return t*t*e}function Mh(n,e){return 2*(1-n)*n*e}function Sh(n,e){return n*n*e}function _s(n,e,t,i){return bh(n,e)+Mh(n,t)+Sh(n,i)}function Eh(n,e){const t=1-n;return t*t*t*e}function wh(n,e){const t=1-n;return 3*t*t*n*e}function Th(n,e){return 3*(1-n)*n*n*e}function Ah(n,e){return n*n*n*e}function vs(n,e,t,i,s){return Eh(n,e)+wh(n,t)+Th(n,i)+Ah(n,s)}class Gc extends An{constructor(e=new oe,t=new oe,i=new oe,s=new oe){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=i,this.v3=s}getPoint(e,t=new oe){const i=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return i.set(vs(e,s.x,r.x,a.x,o.x),vs(e,s.y,r.y,a.y,o.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class Ch extends An{constructor(e=new L,t=new L,i=new L,s=new L){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=i,this.v3=s}getPoint(e,t=new L){const i=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return i.set(vs(e,s.x,r.x,a.x,o.x),vs(e,s.y,r.y,a.y,o.y),vs(e,s.z,r.z,a.z,o.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class Vc extends An{constructor(e=new oe,t=new oe){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new oe){const i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new oe){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Rh extends An{constructor(e=new L,t=new L){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new L){const i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new L){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class $c extends An{constructor(e=new oe,t=new oe,i=new oe){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new oe){const i=t,s=this.v0,r=this.v1,a=this.v2;return i.set(_s(e,s.x,r.x,a.x),_s(e,s.y,r.y,a.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Ph extends An{constructor(e=new L,t=new L,i=new L){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new L){const i=t,s=this.v0,r=this.v1,a=this.v2;return i.set(_s(e,s.x,r.x,a.x),_s(e,s.y,r.y,a.y),_s(e,s.z,r.z,a.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Wc extends An{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new oe){const i=t,s=this.points,r=(s.length-1)*e,a=Math.floor(r),o=r-a,l=s[a===0?a:a-1],c=s[a],d=s[a>s.length-2?s.length-1:a+1],u=s[a>s.length-3?s.length-1:a+2];return i.set(yl(o,l.x,c.x,d.x,u.x),yl(o,l.y,c.y,d.y,u.y)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const s=e.points[t];this.points.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){const s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const s=e.points[t];this.points.push(new oe().fromArray(s))}return this}}var mo=Object.freeze({__proto__:null,ArcCurve:xh,CatmullRomCurve3:yh,CubicBezierCurve:Gc,CubicBezierCurve3:Ch,EllipseCurve:Io,LineCurve:Vc,LineCurve3:Rh,QuadraticBezierCurve:$c,QuadraticBezierCurve3:Ph,SplineCurve:Wc});class Lh extends An{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const i=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new mo[i](t,e))}return this}getPoint(e,t){const i=e*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=i){const a=s[r]-i,o=this.curves[r],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,t)}r++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let i=0,s=this.curves.length;i<s;i++)t+=this.curves[i].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let i;for(let s=0,r=this.curves;s<r.length;s++){const a=r[s],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,l=a.getPoints(o);for(let c=0;c<l.length;c++){const d=l[c];i&&i.equals(d)||(t.push(d),i=d)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){const s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,i=this.curves.length;t<i;t++){const s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){const s=e.curves[t];this.curves.push(new mo[s.type]().fromJSON(s))}return this}}class go extends Lh{constructor(e){super(),this.type="Path",this.currentPoint=new oe,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,i=e.length;t<i;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const i=new Vc(this.currentPoint.clone(),new oe(e,t));return this.curves.push(i),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,i,s){const r=new $c(this.currentPoint.clone(),new oe(e,t),new oe(i,s));return this.curves.push(r),this.currentPoint.set(i,s),this}bezierCurveTo(e,t,i,s,r,a){const o=new Gc(this.currentPoint.clone(),new oe(e,t),new oe(i,s),new oe(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),i=new Wc(t);return this.curves.push(i),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,i,s,r,a){const o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+o,t+l,i,s,r,a),this}absarc(e,t,i,s,r,a){return this.absellipse(e,t,i,i,s,r,a),this}ellipse(e,t,i,s,r,a,o,l){const c=this.currentPoint.x,d=this.currentPoint.y;return this.absellipse(e+c,t+d,i,s,r,a,o,l),this}absellipse(e,t,i,s,r,a,o,l){const c=new Io(e,t,i,s,r,a,o,l);if(this.curves.length>0){const u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);const d=c.getPoint(1);return this.currentPoint.copy(d),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class yr extends go{constructor(e){super(e),this.uuid=Ki(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let i=0,s=this.holes.length;i<s;i++)t[i]=this.holes[i].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){const s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,i=this.holes.length;t<i;t++){const s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){const s=e.holes[t];this.holes.push(new go().fromJSON(s))}return this}}function Dh(n,e,t=2){const i=e&&e.length,s=i?e[0]*t:n.length;let r=jc(n,0,s,t,!0);const a=[];if(!r||r.next===r.prev)return a;let o,l,c;if(i&&(r=Oh(n,e,r,t)),n.length>80*t){o=1/0,l=1/0;let d=-1/0,u=-1/0;for(let h=t;h<s;h+=t){const m=n[h],_=n[h+1];m<o&&(o=m),_<l&&(l=_),m>d&&(d=m),_>u&&(u=_)}c=Math.max(d-o,u-l),c=c!==0?32767/c:0}return Ts(r,a,t,o,l,c,0),a}function jc(n,e,t,i,s){let r;if(s===qh(n,e,t,i)>0)for(let a=e;a<t;a+=i)r=bl(a/i|0,n[a],n[a+1],r);else for(let a=t-i;a>=e;a-=i)r=bl(a/i|0,n[a],n[a+1],r);return r&&Ji(r,r.next)&&(Cs(r),r=r.next),r}function yi(n,e){if(!n)return n;e||(e=n);let t=n,i;do if(i=!1,!t.steiner&&(Ji(t,t.next)||Et(t.prev,t,t.next)===0)){if(Cs(t),t=e=t.prev,t===t.next)break;i=!0}else t=t.next;while(i||t!==e);return e}function Ts(n,e,t,i,s,r,a){if(!n)return;!a&&r&&Gh(n,i,s,r);let o=n;for(;n.prev!==n.next;){const l=n.prev,c=n.next;if(r?Uh(n,i,s,r):Ih(n)){e.push(l.i,n.i,c.i),Cs(n),n=c.next,o=c.next;continue}if(n=c,n===o){a?a===1?(n=Nh(yi(n),e),Ts(n,e,t,i,s,r,2)):a===2&&Fh(n,e,t,i,s,r):Ts(yi(n),e,t,i,s,r,1);break}}}function Ih(n){const e=n.prev,t=n,i=n.next;if(Et(e,t,i)>=0)return!1;const s=e.x,r=t.x,a=i.x,o=e.y,l=t.y,c=i.y,d=Math.min(s,r,a),u=Math.min(o,l,c),h=Math.max(s,r,a),m=Math.max(o,l,c);let _=i.next;for(;_!==e;){if(_.x>=d&&_.x<=h&&_.y>=u&&_.y<=m&&hs(s,o,r,l,a,c,_.x,_.y)&&Et(_.prev,_,_.next)>=0)return!1;_=_.next}return!0}function Uh(n,e,t,i){const s=n.prev,r=n,a=n.next;if(Et(s,r,a)>=0)return!1;const o=s.x,l=r.x,c=a.x,d=s.y,u=r.y,h=a.y,m=Math.min(o,l,c),_=Math.min(d,u,h),x=Math.max(o,l,c),p=Math.max(d,u,h),f=_o(m,_,e,t,i),y=_o(x,p,e,t,i);let v=n.prevZ,g=n.nextZ;for(;v&&v.z>=f&&g&&g.z<=y;){if(v.x>=m&&v.x<=x&&v.y>=_&&v.y<=p&&v!==s&&v!==a&&hs(o,d,l,u,c,h,v.x,v.y)&&Et(v.prev,v,v.next)>=0||(v=v.prevZ,g.x>=m&&g.x<=x&&g.y>=_&&g.y<=p&&g!==s&&g!==a&&hs(o,d,l,u,c,h,g.x,g.y)&&Et(g.prev,g,g.next)>=0))return!1;g=g.nextZ}for(;v&&v.z>=f;){if(v.x>=m&&v.x<=x&&v.y>=_&&v.y<=p&&v!==s&&v!==a&&hs(o,d,l,u,c,h,v.x,v.y)&&Et(v.prev,v,v.next)>=0)return!1;v=v.prevZ}for(;g&&g.z<=y;){if(g.x>=m&&g.x<=x&&g.y>=_&&g.y<=p&&g!==s&&g!==a&&hs(o,d,l,u,c,h,g.x,g.y)&&Et(g.prev,g,g.next)>=0)return!1;g=g.nextZ}return!0}function Nh(n,e){let t=n;do{const i=t.prev,s=t.next.next;!Ji(i,s)&&qc(i,t,t.next,s)&&As(i,s)&&As(s,i)&&(e.push(i.i,t.i,s.i),Cs(t),Cs(t.next),t=n=s),t=t.next}while(t!==n);return yi(t)}function Fh(n,e,t,i,s,r){let a=n;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&Wh(a,o)){let l=Yc(a,o);a=yi(a,a.next),l=yi(l,l.next),Ts(a,e,t,i,s,r,0),Ts(l,e,t,i,s,r,0);return}o=o.next}a=a.next}while(a!==n)}function Oh(n,e,t,i){const s=[];for(let r=0,a=e.length;r<a;r++){const o=e[r]*i,l=r<a-1?e[r+1]*i:n.length,c=jc(n,o,l,i,!1);c===c.next&&(c.steiner=!0),s.push($h(c))}s.sort(zh);for(let r=0;r<s.length;r++)t=Bh(s[r],t);return t}function zh(n,e){let t=n.x-e.x;if(t===0&&(t=n.y-e.y,t===0)){const i=(n.next.y-n.y)/(n.next.x-n.x),s=(e.next.y-e.y)/(e.next.x-e.x);t=i-s}return t}function Bh(n,e){const t=kh(n,e);if(!t)return e;const i=Yc(t,n);return yi(i,i.next),yi(t,t.next)}function kh(n,e){let t=e;const i=n.x,s=n.y;let r=-1/0,a;if(Ji(n,t))return t;do{if(Ji(n,t.next))return t.next;if(s<=t.y&&s>=t.next.y&&t.next.y!==t.y){const u=t.x+(s-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(u<=i&&u>r&&(r=u,a=t.x<t.next.x?t:t.next,u===i))return a}t=t.next}while(t!==e);if(!a)return null;const o=a,l=a.x,c=a.y;let d=1/0;t=a;do{if(i>=t.x&&t.x>=l&&i!==t.x&&Xc(s<c?i:r,s,l,c,s<c?r:i,s,t.x,t.y)){const u=Math.abs(s-t.y)/(i-t.x);As(t,n)&&(u<d||u===d&&(t.x>a.x||t.x===a.x&&Hh(a,t)))&&(a=t,d=u)}t=t.next}while(t!==o);return a}function Hh(n,e){return Et(n.prev,n,e.prev)<0&&Et(e.next,n,n.next)<0}function Gh(n,e,t,i){let s=n;do s.z===0&&(s.z=_o(s.x,s.y,e,t,i)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==n);s.prevZ.nextZ=null,s.prevZ=null,Vh(s)}function Vh(n){let e,t=1;do{let i=n,s;n=null;let r=null;for(e=0;i;){e++;let a=i,o=0;for(let c=0;c<t&&(o++,a=a.nextZ,!!a);c++);let l=t;for(;o>0||l>0&&a;)o!==0&&(l===0||!a||i.z<=a.z)?(s=i,i=i.nextZ,o--):(s=a,a=a.nextZ,l--),r?r.nextZ=s:n=s,s.prevZ=r,r=s;i=a}r.nextZ=null,t*=2}while(e>1);return n}function _o(n,e,t,i,s){return n=(n-t)*s|0,e=(e-i)*s|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,n|e<<1}function $h(n){let e=n,t=n;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==n);return t}function Xc(n,e,t,i,s,r,a,o){return(s-a)*(e-o)>=(n-a)*(r-o)&&(n-a)*(i-o)>=(t-a)*(e-o)&&(t-a)*(r-o)>=(s-a)*(i-o)}function hs(n,e,t,i,s,r,a,o){return!(n===a&&e===o)&&Xc(n,e,t,i,s,r,a,o)}function Wh(n,e){return n.next.i!==e.i&&n.prev.i!==e.i&&!jh(n,e)&&(As(n,e)&&As(e,n)&&Xh(n,e)&&(Et(n.prev,n,e.prev)||Et(n,e.prev,e))||Ji(n,e)&&Et(n.prev,n,n.next)>0&&Et(e.prev,e,e.next)>0)}function Et(n,e,t){return(e.y-n.y)*(t.x-e.x)-(e.x-n.x)*(t.y-e.y)}function Ji(n,e){return n.x===e.x&&n.y===e.y}function qc(n,e,t,i){const s=lr(Et(n,e,t)),r=lr(Et(n,e,i)),a=lr(Et(t,i,n)),o=lr(Et(t,i,e));return!!(s!==r&&a!==o||s===0&&or(n,t,e)||r===0&&or(n,i,e)||a===0&&or(t,n,i)||o===0&&or(t,e,i))}function or(n,e,t){return e.x<=Math.max(n.x,t.x)&&e.x>=Math.min(n.x,t.x)&&e.y<=Math.max(n.y,t.y)&&e.y>=Math.min(n.y,t.y)}function lr(n){return n>0?1:n<0?-1:0}function jh(n,e){let t=n;do{if(t.i!==n.i&&t.next.i!==n.i&&t.i!==e.i&&t.next.i!==e.i&&qc(t,t.next,n,e))return!0;t=t.next}while(t!==n);return!1}function As(n,e){return Et(n.prev,n,n.next)<0?Et(n,e,n.next)>=0&&Et(n,n.prev,e)>=0:Et(n,e,n.prev)<0||Et(n,n.next,e)<0}function Xh(n,e){let t=n,i=!1;const s=(n.x+e.x)/2,r=(n.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&s<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(i=!i),t=t.next;while(t!==n);return i}function Yc(n,e){const t=vo(n.i,n.x,n.y),i=vo(e.i,e.x,e.y),s=n.next,r=e.prev;return n.next=e,e.prev=n,t.next=s,s.prev=t,i.next=t,t.prev=i,r.next=i,i.prev=r,i}function bl(n,e,t,i){const s=vo(n,e,t);return i?(s.next=i.next,s.prev=i,i.next.prev=s,i.next=s):(s.prev=s,s.next=s),s}function Cs(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function vo(n,e,t){return{i:n,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function qh(n,e,t,i){let s=0;for(let r=e,a=t-i;r<t;r+=i)s+=(n[a]-n[r])*(n[r+1]+n[a+1]),a=r;return s}class Yh{static triangulate(e,t,i=2){return Dh(e,t,i)}}class Bi{static area(e){const t=e.length;let i=0;for(let s=t-1,r=0;r<t;s=r++)i+=e[s].x*e[r].y-e[r].x*e[s].y;return i*.5}static isClockWise(e){return Bi.area(e)<0}static triangulateShape(e,t){const i=[],s=[],r=[];Ml(e),Sl(i,e);let a=e.length;t.forEach(Ml);for(let l=0;l<t.length;l++)s.push(a),a+=t[l].length,Sl(i,t[l]);const o=Yh.triangulate(i,s);for(let l=0;l<o.length;l+=3)r.push(o.slice(l,l+3));return r}}function Ml(n){const e=n.length;e>2&&n[e-1].equals(n[0])&&n.pop()}function Sl(n,e){for(let t=0;t<e.length;t++)n.push(e[t].x),n.push(e[t].y)}class No extends Nt{constructor(e=new yr([new oe(.5,.5),new oe(-.5,.5),new oe(-.5,-.5),new oe(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];const i=this,s=[],r=[];for(let o=0,l=e.length;o<l;o++){const c=e[o];a(c)}this.setAttribute("position",new rt(s,3)),this.setAttribute("uv",new rt(r,2)),this.computeVertexNormals();function a(o){const l=[],c=t.curveSegments!==void 0?t.curveSegments:12,d=t.steps!==void 0?t.steps:1,u=t.depth!==void 0?t.depth:1;let h=t.bevelEnabled!==void 0?t.bevelEnabled:!0,m=t.bevelThickness!==void 0?t.bevelThickness:.2,_=t.bevelSize!==void 0?t.bevelSize:m-.1,x=t.bevelOffset!==void 0?t.bevelOffset:0,p=t.bevelSegments!==void 0?t.bevelSegments:3;const f=t.extrudePath,y=t.UVGenerator!==void 0?t.UVGenerator:Zh;let v,g=!1,E,T,S,A;f&&(v=f.getSpacedPoints(d),g=!0,h=!1,E=f.computeFrenetFrames(d,!1),T=new L,S=new L,A=new L),h||(p=0,m=0,_=0,x=0);const M=o.extractPoints(c);let b=M.shape;const R=M.holes;if(!Bi.isClockWise(b)){b=b.reverse();for(let te=0,K=R.length;te<K;te++){const J=R[te];Bi.isClockWise(J)&&(R[te]=J.reverse())}}function B(te){const J=10000000000000001e-36;let Z=te[0];for(let ue=1;ue<=te.length;ue++){const se=ue%te.length,he=te[se],He=he.x-Z.x,Be=he.y-Z.y,P=He*He+Be*Be,w=Math.max(Math.abs(he.x),Math.abs(he.y),Math.abs(Z.x),Math.abs(Z.y)),z=J*w*w;if(P<=z){te.splice(se,1),ue--;continue}Z=he}}B(b),R.forEach(B);const H=R.length,k=b;for(let te=0;te<H;te++){const K=R[te];b=b.concat(K)}function $(te,K,J){return K||console.error("THREE.ExtrudeGeometry: vec does not exist"),te.clone().addScaledVector(K,J)}const q=b.length;function W(te,K,J){let Z,ue,se;const he=te.x-K.x,He=te.y-K.y,Be=J.x-te.x,P=J.y-te.y,w=he*he+He*He,z=he*P-He*Be;if(Math.abs(z)>Number.EPSILON){const j=Math.sqrt(w),ee=Math.sqrt(Be*Be+P*P),X=K.x-He/j,Pe=K.y+he/j,de=J.x-P/ee,Ae=J.y+Be/ee,Ce=((de-X)*P-(Ae-Pe)*Be)/(he*P-He*Be);Z=X+he*Ce-te.x,ue=Pe+He*Ce-te.y;const re=Z*Z+ue*ue;if(re<=2)return new oe(Z,ue);se=Math.sqrt(re/2)}else{let j=!1;he>Number.EPSILON?Be>Number.EPSILON&&(j=!0):he<-Number.EPSILON?Be<-Number.EPSILON&&(j=!0):Math.sign(He)===Math.sign(P)&&(j=!0),j?(Z=-He,ue=he,se=Math.sqrt(w)):(Z=he,ue=He,se=Math.sqrt(w/2))}return new oe(Z/se,ue/se)}const ie=[];for(let te=0,K=k.length,J=K-1,Z=te+1;te<K;te++,J++,Z++)J===K&&(J=0),Z===K&&(Z=0),ie[te]=W(k[te],k[J],k[Z]);const pe=[];let be,Oe=ie.concat();for(let te=0,K=H;te<K;te++){const J=R[te];be=[];for(let Z=0,ue=J.length,se=ue-1,he=Z+1;Z<ue;Z++,se++,he++)se===ue&&(se=0),he===ue&&(he=0),be[Z]=W(J[Z],J[se],J[he]);pe.push(be),Oe=Oe.concat(be)}let qe;if(p===0)qe=Bi.triangulateShape(k,R);else{const te=[],K=[];for(let J=0;J<p;J++){const Z=J/p,ue=m*Math.cos(Z*Math.PI/2),se=_*Math.sin(Z*Math.PI/2)+x;for(let he=0,He=k.length;he<He;he++){const Be=$(k[he],ie[he],se);De(Be.x,Be.y,-ue),Z===0&&te.push(Be)}for(let he=0,He=H;he<He;he++){const Be=R[he];be=pe[he];const P=[];for(let w=0,z=Be.length;w<z;w++){const j=$(Be[w],be[w],se);De(j.x,j.y,-ue),Z===0&&P.push(j)}Z===0&&K.push(P)}}qe=Bi.triangulateShape(te,K)}const Qe=qe.length,Ke=_+x;for(let te=0;te<q;te++){const K=h?$(b[te],Oe[te],Ke):b[te];g?(S.copy(E.normals[0]).multiplyScalar(K.x),T.copy(E.binormals[0]).multiplyScalar(K.y),A.copy(v[0]).add(S).add(T),De(A.x,A.y,A.z)):De(K.x,K.y,0)}for(let te=1;te<=d;te++)for(let K=0;K<q;K++){const J=h?$(b[K],Oe[K],Ke):b[K];g?(S.copy(E.normals[te]).multiplyScalar(J.x),T.copy(E.binormals[te]).multiplyScalar(J.y),A.copy(v[te]).add(S).add(T),De(A.x,A.y,A.z)):De(J.x,J.y,u/d*te)}for(let te=p-1;te>=0;te--){const K=te/p,J=m*Math.cos(K*Math.PI/2),Z=_*Math.sin(K*Math.PI/2)+x;for(let ue=0,se=k.length;ue<se;ue++){const he=$(k[ue],ie[ue],Z);De(he.x,he.y,u+J)}for(let ue=0,se=R.length;ue<se;ue++){const he=R[ue];be=pe[ue];for(let He=0,Be=he.length;He<Be;He++){const P=$(he[He],be[He],Z);g?De(P.x,P.y+v[d-1].y,v[d-1].x+J):De(P.x,P.y,u+J)}}}Y(),ne();function Y(){const te=s.length/3;if(h){let K=0,J=q*K;for(let Z=0;Z<Qe;Z++){const ue=qe[Z];Te(ue[2]+J,ue[1]+J,ue[0]+J)}K=d+p*2,J=q*K;for(let Z=0;Z<Qe;Z++){const ue=qe[Z];Te(ue[0]+J,ue[1]+J,ue[2]+J)}}else{for(let K=0;K<Qe;K++){const J=qe[K];Te(J[2],J[1],J[0])}for(let K=0;K<Qe;K++){const J=qe[K];Te(J[0]+q*d,J[1]+q*d,J[2]+q*d)}}i.addGroup(te,s.length/3-te,0)}function ne(){const te=s.length/3;let K=0;Se(k,K),K+=k.length;for(let J=0,Z=R.length;J<Z;J++){const ue=R[J];Se(ue,K),K+=ue.length}i.addGroup(te,s.length/3-te,1)}function Se(te,K){let J=te.length;for(;--J>=0;){const Z=J;let ue=J-1;ue<0&&(ue=te.length-1);for(let se=0,he=d+p*2;se<he;se++){const He=q*se,Be=q*(se+1),P=K+Z+He,w=K+ue+He,z=K+ue+Be,j=K+Z+Be;Ye(P,w,z,j)}}}function De(te,K,J){l.push(te),l.push(K),l.push(J)}function Te(te,K,J){mt(te),mt(K),mt(J);const Z=s.length/3,ue=y.generateTopUV(i,s,Z-3,Z-2,Z-1);D(ue[0]),D(ue[1]),D(ue[2])}function Ye(te,K,J,Z){mt(te),mt(K),mt(Z),mt(K),mt(J),mt(Z);const ue=s.length/3,se=y.generateSideWallUV(i,s,ue-6,ue-3,ue-2,ue-1);D(se[0]),D(se[1]),D(se[3]),D(se[1]),D(se[2]),D(se[3])}function mt(te){s.push(l[te*3+0]),s.push(l[te*3+1]),s.push(l[te*3+2])}function D(te){r.push(te.x),r.push(te.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes,i=this.parameters.options;return Jh(t,i,e)}static fromJSON(e,t){const i=[];for(let r=0,a=e.shapes.length;r<a;r++){const o=t[e.shapes[r]];i.push(o)}const s=e.options.extrudePath;return s!==void 0&&(e.options.extrudePath=new mo[s.type]().fromJSON(s)),new No(i,e.options)}}const Zh={generateTopUV:function(n,e,t,i,s){const r=e[t*3],a=e[t*3+1],o=e[i*3],l=e[i*3+1],c=e[s*3],d=e[s*3+1];return[new oe(r,a),new oe(o,l),new oe(c,d)]},generateSideWallUV:function(n,e,t,i,s,r){const a=e[t*3],o=e[t*3+1],l=e[t*3+2],c=e[i*3],d=e[i*3+1],u=e[i*3+2],h=e[s*3],m=e[s*3+1],_=e[s*3+2],x=e[r*3],p=e[r*3+1],f=e[r*3+2];return Math.abs(o-d)<Math.abs(a-c)?[new oe(a,1-l),new oe(c,1-u),new oe(h,1-_),new oe(x,1-f)]:[new oe(o,1-l),new oe(d,1-u),new oe(m,1-_),new oe(p,1-f)]}};function Jh(n,e,t){if(t.shapes=[],Array.isArray(n))for(let i=0,s=n.length;i<s;i++){const r=n[i];t.shapes.push(r.uuid)}else t.shapes.push(n.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}class ki extends Do{constructor(e=1,t=0){const i=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],s=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(i,s,e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new ki(e.radius,e.detail)}}class Ls extends Nt{constructor(e=1,t=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:s};const r=e/2,a=t/2,o=Math.floor(i),l=Math.floor(s),c=o+1,d=l+1,u=e/o,h=t/l,m=[],_=[],x=[],p=[];for(let f=0;f<d;f++){const y=f*h-a;for(let v=0;v<c;v++){const g=v*u-r;_.push(g,-y,0),x.push(0,0,1),p.push(v/o),p.push(1-f/l)}}for(let f=0;f<l;f++)for(let y=0;y<o;y++){const v=y+c*f,g=y+c*(f+1),E=y+1+c*(f+1),T=y+1+c*f;m.push(v,g,T),m.push(g,E,T)}this.setIndex(m),this.setAttribute("position",new rt(_,3)),this.setAttribute("normal",new rt(x,3)),this.setAttribute("uv",new rt(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ls(e.width,e.height,e.widthSegments,e.heightSegments)}}class Ds extends Nt{constructor(e=1,t=32,i=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));const l=Math.min(a+o,Math.PI);let c=0;const d=[],u=new L,h=new L,m=[],_=[],x=[],p=[];for(let f=0;f<=i;f++){const y=[],v=f/i;let g=0;f===0&&a===0?g=.5/t:f===i&&l===Math.PI&&(g=-.5/t);for(let E=0;E<=t;E++){const T=E/t;u.x=-e*Math.cos(s+T*r)*Math.sin(a+v*o),u.y=e*Math.cos(a+v*o),u.z=e*Math.sin(s+T*r)*Math.sin(a+v*o),_.push(u.x,u.y,u.z),h.copy(u).normalize(),x.push(h.x,h.y,h.z),p.push(T+g,1-v),y.push(c++)}d.push(y)}for(let f=0;f<i;f++)for(let y=0;y<t;y++){const v=d[f][y+1],g=d[f][y],E=d[f+1][y],T=d[f+1][y+1];(f!==0||a>0)&&m.push(v,g,T),(f!==i-1||l<Math.PI)&&m.push(g,E,T)}this.setIndex(m),this.setAttribute("position",new rt(_,3)),this.setAttribute("normal",new rt(x,3)),this.setAttribute("uv",new rt(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ds(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class pi extends Nt{constructor(e=1,t=.4,i=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:i,tubularSegments:s,arc:r},i=Math.floor(i),s=Math.floor(s);const a=[],o=[],l=[],c=[],d=new L,u=new L,h=new L;for(let m=0;m<=i;m++)for(let _=0;_<=s;_++){const x=_/s*r,p=m/i*Math.PI*2;u.x=(e+t*Math.cos(p))*Math.cos(x),u.y=(e+t*Math.cos(p))*Math.sin(x),u.z=t*Math.sin(p),o.push(u.x,u.y,u.z),d.x=e*Math.cos(x),d.y=e*Math.sin(x),h.subVectors(u,d).normalize(),l.push(h.x,h.y,h.z),c.push(_/s),c.push(m/i)}for(let m=1;m<=i;m++)for(let _=1;_<=s;_++){const x=(s+1)*m+_-1,p=(s+1)*(m-1)+_-1,f=(s+1)*(m-1)+_,y=(s+1)*m+_;a.push(x,p,y),a.push(p,f,y)}this.setIndex(a),this.setAttribute("position",new rt(o,3)),this.setAttribute("normal",new rt(l,3)),this.setAttribute("uv",new rt(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new pi(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class Kh extends Qi{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Xe(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Xe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Pc,this.normalScale=new oe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new gn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Qh extends Qi{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Lu,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class ef extends Qi{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class Zc extends Ct{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Xe(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class tf extends Zc{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Ct.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Xe(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const fa=new dt,El=new L,wl=new L;class nf{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new oe(512,512),this.mapType=Tn,this.map=null,this.mapPass=null,this.matrix=new dt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Lo,this._frameExtents=new oe(1,1),this._viewportCount=1,this._viewports=[new Tt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,i=this.matrix;El.setFromMatrixPosition(e.matrixWorld),t.position.copy(El),wl.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(wl),t.updateMatrixWorld(),fa.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(fa,t.coordinateSystem,t.reversedDepth),t.reversedDepth?i.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(fa)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class Jc extends zc{constructor(e=-1,t=1,i=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=i-e,a=i+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=d*this.view.offsetY,l=o-d*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class sf extends nf{constructor(){super(new Jc(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class rf extends Zc{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ct.DEFAULT_UP),this.updateMatrix(),this.target=new Ct,this.shadow=new sf}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class af extends ln{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}const Tl=new dt;class Kc{constructor(e,t,i=0,s=1/0){this.ray=new Dr(e,t),this.near=i,this.far=s,this.camera=null,this.layers=new Po,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Tl.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Tl),this}intersectObject(e,t=!0,i=[]){return xo(e,this,i,t),i.sort(Al),i}intersectObjects(e,t=!0,i=[]){for(let s=0,r=e.length;s<r;s++)xo(e[s],this,i,t);return i.sort(Al),i}}function Al(n,e){return n.distance-e.distance}function xo(n,e,t,i){let s=!0;if(n.layers.test(e.layers)&&n.raycast(e,t)===!1&&(s=!1),s===!0&&i===!0){const r=n.children;for(let a=0,o=r.length;a<o;a++)xo(r[a],e,t,!0)}}class Cl{constructor(e=1,t=0,i=0){this.radius=e,this.phi=t,this.theta=i}set(e,t,i){return this.radius=e,this.phi=t,this.theta=i,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=je(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,i){return this.radius=Math.sqrt(e*e+t*t+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,i),this.phi=Math.acos(je(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class of extends Cr{constructor(e=10,t=10,i=4473924,s=8947848){i=new Xe(i),s=new Xe(s);const r=t/2,a=e/t,o=e/2,l=[],c=[];for(let h=0,m=0,_=-o;h<=t;h++,_+=a){l.push(-o,0,_,o,0,_),l.push(_,0,-o,_,0,o);const x=h===r?i:s;x.toArray(c,m),m+=3,x.toArray(c,m),m+=3,x.toArray(c,m),m+=3,x.toArray(c,m),m+=3}const d=new Nt;d.setAttribute("position",new rt(l,3)),d.setAttribute("color",new rt(c,3));const u=new Zi({vertexColors:!0,toneMapped:!1});super(d,u),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}class lf extends Cr{constructor(e=1){const t=[0,0,0,e,0,0,0,0,0,0,e,0,0,0,0,0,0,e],i=[1,0,0,1,.6,0,0,1,0,.6,1,0,0,0,1,0,.6,1],s=new Nt;s.setAttribute("position",new rt(t,3)),s.setAttribute("color",new rt(i,3));const r=new Zi({vertexColors:!0,toneMapped:!1});super(s,r),this.type="AxesHelper"}setColors(e,t,i){const s=new Xe,r=this.geometry.attributes.color.array;return s.set(e),s.toArray(r,0),s.toArray(r,3),s.set(t),s.toArray(r,6),s.toArray(r,9),s.set(i),s.toArray(r,12),s.toArray(r,15),this.geometry.attributes.color.needsUpdate=!0,this}dispose(){this.geometry.dispose(),this.material.dispose()}}class Qc extends bi{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){if(e===void 0){console.warn("THREE.Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}}function Rl(n,e,t,i){const s=cf(i);switch(t){case Tc:return n*e;case Cc:return n*e/s.components*s.byteLength;case To:return n*e/s.components*s.byteLength;case Rc:return n*e*2/s.components*s.byteLength;case Ao:return n*e*2/s.components*s.byteLength;case Ac:return n*e*3/s.components*s.byteLength;case pn:return n*e*4/s.components*s.byteLength;case Co:return n*e*4/s.components*s.byteLength;case gr:case _r:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case vr:case xr:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Ba:case Ha:return Math.max(n,16)*Math.max(e,8)/4;case za:case ka:return Math.max(n,8)*Math.max(e,8)/2;case Ga:case Va:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case $a:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Wa:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case ja:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case Xa:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case qa:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case Ya:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case Za:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case Ja:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case Ka:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case Qa:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case eo:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case to:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case no:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case io:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case so:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case ro:case ao:case oo:return Math.ceil(n/4)*Math.ceil(e/4)*16;case lo:case co:return Math.ceil(n/4)*Math.ceil(e/4)*8;case uo:case ho:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function cf(n){switch(n){case Tn:case Mc:return{byteLength:1,components:1};case bs:case Sc:case Rs:return{byteLength:2,components:1};case Eo:case wo:return{byteLength:2,components:4};case vi:case So:case On:return{byteLength:4,components:1};case Ec:case wc:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Mo}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Mo);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function ed(){let n=null,e=!1,t=null,i=null;function s(r,a){t(r,a),i=n.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(i=n.requestAnimationFrame(s),e=!0)},stop:function(){n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){n=r}}}function df(n){const e=new WeakMap;function t(o,l){const c=o.array,d=o.usage,u=c.byteLength,h=n.createBuffer();n.bindBuffer(l,h),n.bufferData(l,c,d),o.onUploadCallback();let m;if(c instanceof Float32Array)m=n.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)m=n.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?m=n.HALF_FLOAT:m=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)m=n.SHORT;else if(c instanceof Uint32Array)m=n.UNSIGNED_INT;else if(c instanceof Int32Array)m=n.INT;else if(c instanceof Int8Array)m=n.BYTE;else if(c instanceof Uint8Array)m=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)m=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:h,type:m,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:u}}function i(o,l,c){const d=l.array,u=l.updateRanges;if(n.bindBuffer(c,o),u.length===0)n.bufferSubData(c,0,d);else{u.sort((m,_)=>m.start-_.start);let h=0;for(let m=1;m<u.length;m++){const _=u[h],x=u[m];x.start<=_.start+_.count+1?_.count=Math.max(_.count,x.start+x.count-_.start):(++h,u[h]=x)}u.length=h+1;for(let m=0,_=u.length;m<_;m++){const x=u[m];n.bufferSubData(c,x.start*d.BYTES_PER_ELEMENT,d,x.start,x.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(n.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const d=e.get(o);(!d||d.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var uf=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,hf=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,ff=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,pf=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,mf=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,gf=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,_f=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,vf=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,xf=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,yf=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,bf=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Mf=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Sf=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Ef=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,wf=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Tf=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Af=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Cf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Rf=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Pf=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Lf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Df=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,If=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,Uf=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Nf=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Ff=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Of=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,zf=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Bf=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,kf=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Hf="gl_FragColor = linearToOutputTexel( gl_FragColor );",Gf=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Vf=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,$f=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Wf=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,jf=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Xf=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,qf=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Yf=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Zf=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Jf=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Kf=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Qf=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,ep=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,tp=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,np=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,ip=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,sp=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,rp=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,ap=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,op=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,lp=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,cp=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,dp=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,up=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,hp=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,fp=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,pp=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,mp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,gp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,_p=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,vp=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,xp=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,yp=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,bp=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Mp=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Sp=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Ep=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,wp=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Tp=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Ap=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Cp=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Rp=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Pp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Lp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Dp=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Ip=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Up=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Np=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Fp=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Op=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,zp=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Bp=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,kp=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Hp=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Gp=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Vp=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,$p=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Wp=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,jp=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,Xp=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,qp=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Yp=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Zp=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Jp=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Kp=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Qp=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,em=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,tm=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,nm=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,im=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,sm=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,rm=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,am=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,om=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,lm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,cm=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const dm=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,um=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,hm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,fm=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,pm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,mm=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,gm=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,_m=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,vm=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,xm=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,ym=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,bm=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Mm=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Sm=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Em=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,wm=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Tm=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Am=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Cm=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Rm=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Pm=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Lm=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Dm=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Im=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Um=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Nm=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Fm=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Om=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,zm=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Bm=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,km=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Hm=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Gm=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Vm=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,We={alphahash_fragment:uf,alphahash_pars_fragment:hf,alphamap_fragment:ff,alphamap_pars_fragment:pf,alphatest_fragment:mf,alphatest_pars_fragment:gf,aomap_fragment:_f,aomap_pars_fragment:vf,batching_pars_vertex:xf,batching_vertex:yf,begin_vertex:bf,beginnormal_vertex:Mf,bsdfs:Sf,iridescence_fragment:Ef,bumpmap_pars_fragment:wf,clipping_planes_fragment:Tf,clipping_planes_pars_fragment:Af,clipping_planes_pars_vertex:Cf,clipping_planes_vertex:Rf,color_fragment:Pf,color_pars_fragment:Lf,color_pars_vertex:Df,color_vertex:If,common:Uf,cube_uv_reflection_fragment:Nf,defaultnormal_vertex:Ff,displacementmap_pars_vertex:Of,displacementmap_vertex:zf,emissivemap_fragment:Bf,emissivemap_pars_fragment:kf,colorspace_fragment:Hf,colorspace_pars_fragment:Gf,envmap_fragment:Vf,envmap_common_pars_fragment:$f,envmap_pars_fragment:Wf,envmap_pars_vertex:jf,envmap_physical_pars_fragment:ip,envmap_vertex:Xf,fog_vertex:qf,fog_pars_vertex:Yf,fog_fragment:Zf,fog_pars_fragment:Jf,gradientmap_pars_fragment:Kf,lightmap_pars_fragment:Qf,lights_lambert_fragment:ep,lights_lambert_pars_fragment:tp,lights_pars_begin:np,lights_toon_fragment:sp,lights_toon_pars_fragment:rp,lights_phong_fragment:ap,lights_phong_pars_fragment:op,lights_physical_fragment:lp,lights_physical_pars_fragment:cp,lights_fragment_begin:dp,lights_fragment_maps:up,lights_fragment_end:hp,logdepthbuf_fragment:fp,logdepthbuf_pars_fragment:pp,logdepthbuf_pars_vertex:mp,logdepthbuf_vertex:gp,map_fragment:_p,map_pars_fragment:vp,map_particle_fragment:xp,map_particle_pars_fragment:yp,metalnessmap_fragment:bp,metalnessmap_pars_fragment:Mp,morphinstance_vertex:Sp,morphcolor_vertex:Ep,morphnormal_vertex:wp,morphtarget_pars_vertex:Tp,morphtarget_vertex:Ap,normal_fragment_begin:Cp,normal_fragment_maps:Rp,normal_pars_fragment:Pp,normal_pars_vertex:Lp,normal_vertex:Dp,normalmap_pars_fragment:Ip,clearcoat_normal_fragment_begin:Up,clearcoat_normal_fragment_maps:Np,clearcoat_pars_fragment:Fp,iridescence_pars_fragment:Op,opaque_fragment:zp,packing:Bp,premultiplied_alpha_fragment:kp,project_vertex:Hp,dithering_fragment:Gp,dithering_pars_fragment:Vp,roughnessmap_fragment:$p,roughnessmap_pars_fragment:Wp,shadowmap_pars_fragment:jp,shadowmap_pars_vertex:Xp,shadowmap_vertex:qp,shadowmask_pars_fragment:Yp,skinbase_vertex:Zp,skinning_pars_vertex:Jp,skinning_vertex:Kp,skinnormal_vertex:Qp,specularmap_fragment:em,specularmap_pars_fragment:tm,tonemapping_fragment:nm,tonemapping_pars_fragment:im,transmission_fragment:sm,transmission_pars_fragment:rm,uv_pars_fragment:am,uv_pars_vertex:om,uv_vertex:lm,worldpos_vertex:cm,background_vert:dm,background_frag:um,backgroundCube_vert:hm,backgroundCube_frag:fm,cube_vert:pm,cube_frag:mm,depth_vert:gm,depth_frag:_m,distanceRGBA_vert:vm,distanceRGBA_frag:xm,equirect_vert:ym,equirect_frag:bm,linedashed_vert:Mm,linedashed_frag:Sm,meshbasic_vert:Em,meshbasic_frag:wm,meshlambert_vert:Tm,meshlambert_frag:Am,meshmatcap_vert:Cm,meshmatcap_frag:Rm,meshnormal_vert:Pm,meshnormal_frag:Lm,meshphong_vert:Dm,meshphong_frag:Im,meshphysical_vert:Um,meshphysical_frag:Nm,meshtoon_vert:Fm,meshtoon_frag:Om,points_vert:zm,points_frag:Bm,shadow_vert:km,shadow_frag:Hm,sprite_vert:Gm,sprite_frag:Vm},me={common:{diffuse:{value:new Xe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new $e},alphaMap:{value:null},alphaMapTransform:{value:new $e},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new $e}},envmap:{envMap:{value:null},envMapRotation:{value:new $e},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new $e}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new $e}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new $e},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new $e},normalScale:{value:new oe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new $e},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new $e}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new $e}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new $e}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Xe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Xe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new $e},alphaTest:{value:0},uvTransform:{value:new $e}},sprite:{diffuse:{value:new Xe(16777215)},opacity:{value:1},center:{value:new oe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new $e},alphaMap:{value:null},alphaMapTransform:{value:new $e},alphaTest:{value:0}}},bn={basic:{uniforms:Wt([me.common,me.specularmap,me.envmap,me.aomap,me.lightmap,me.fog]),vertexShader:We.meshbasic_vert,fragmentShader:We.meshbasic_frag},lambert:{uniforms:Wt([me.common,me.specularmap,me.envmap,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.fog,me.lights,{emissive:{value:new Xe(0)}}]),vertexShader:We.meshlambert_vert,fragmentShader:We.meshlambert_frag},phong:{uniforms:Wt([me.common,me.specularmap,me.envmap,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.fog,me.lights,{emissive:{value:new Xe(0)},specular:{value:new Xe(1118481)},shininess:{value:30}}]),vertexShader:We.meshphong_vert,fragmentShader:We.meshphong_frag},standard:{uniforms:Wt([me.common,me.envmap,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.roughnessmap,me.metalnessmap,me.fog,me.lights,{emissive:{value:new Xe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:We.meshphysical_vert,fragmentShader:We.meshphysical_frag},toon:{uniforms:Wt([me.common,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.gradientmap,me.fog,me.lights,{emissive:{value:new Xe(0)}}]),vertexShader:We.meshtoon_vert,fragmentShader:We.meshtoon_frag},matcap:{uniforms:Wt([me.common,me.bumpmap,me.normalmap,me.displacementmap,me.fog,{matcap:{value:null}}]),vertexShader:We.meshmatcap_vert,fragmentShader:We.meshmatcap_frag},points:{uniforms:Wt([me.points,me.fog]),vertexShader:We.points_vert,fragmentShader:We.points_frag},dashed:{uniforms:Wt([me.common,me.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:We.linedashed_vert,fragmentShader:We.linedashed_frag},depth:{uniforms:Wt([me.common,me.displacementmap]),vertexShader:We.depth_vert,fragmentShader:We.depth_frag},normal:{uniforms:Wt([me.common,me.bumpmap,me.normalmap,me.displacementmap,{opacity:{value:1}}]),vertexShader:We.meshnormal_vert,fragmentShader:We.meshnormal_frag},sprite:{uniforms:Wt([me.sprite,me.fog]),vertexShader:We.sprite_vert,fragmentShader:We.sprite_frag},background:{uniforms:{uvTransform:{value:new $e},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:We.background_vert,fragmentShader:We.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new $e}},vertexShader:We.backgroundCube_vert,fragmentShader:We.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:We.cube_vert,fragmentShader:We.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:We.equirect_vert,fragmentShader:We.equirect_frag},distanceRGBA:{uniforms:Wt([me.common,me.displacementmap,{referencePosition:{value:new L},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:We.distanceRGBA_vert,fragmentShader:We.distanceRGBA_frag},shadow:{uniforms:Wt([me.lights,me.fog,{color:{value:new Xe(0)},opacity:{value:1}}]),vertexShader:We.shadow_vert,fragmentShader:We.shadow_frag}};bn.physical={uniforms:Wt([bn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new $e},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new $e},clearcoatNormalScale:{value:new oe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new $e},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new $e},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new $e},sheen:{value:0},sheenColor:{value:new Xe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new $e},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new $e},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new $e},transmissionSamplerSize:{value:new oe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new $e},attenuationDistance:{value:0},attenuationColor:{value:new Xe(0)},specularColor:{value:new Xe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new $e},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new $e},anisotropyVector:{value:new oe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new $e}}]),vertexShader:We.meshphysical_vert,fragmentShader:We.meshphysical_frag};const cr={r:0,b:0,g:0},oi=new gn,$m=new dt;function Wm(n,e,t,i,s,r,a){const o=new Xe(0);let l=r===!0?0:1,c,d,u=null,h=0,m=null;function _(v){let g=v.isScene===!0?v.background:null;return g&&g.isTexture&&(g=(v.backgroundBlurriness>0?t:e).get(g)),g}function x(v){let g=!1;const E=_(v);E===null?f(o,l):E&&E.isColor&&(f(E,1),g=!0);const T=n.xr.getEnvironmentBlendMode();T==="additive"?i.buffers.color.setClear(0,0,0,1,a):T==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(n.autoClear||g)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function p(v,g){const E=_(g);E&&(E.isCubeTexture||E.mapping===Pr)?(d===void 0&&(d=new ye(new St(1,1,1),new Qn({name:"BackgroundCubeMaterial",uniforms:Yi(bn.backgroundCube.uniforms),vertexShader:bn.backgroundCube.vertexShader,fragmentShader:bn.backgroundCube.fragmentShader,side:Jt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),d.geometry.deleteAttribute("normal"),d.geometry.deleteAttribute("uv"),d.onBeforeRender=function(T,S,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(d.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(d)),oi.copy(g.backgroundRotation),oi.x*=-1,oi.y*=-1,oi.z*=-1,E.isCubeTexture&&E.isRenderTargetTexture===!1&&(oi.y*=-1,oi.z*=-1),d.material.uniforms.envMap.value=E,d.material.uniforms.flipEnvMap.value=E.isCubeTexture&&E.isRenderTargetTexture===!1?-1:1,d.material.uniforms.backgroundBlurriness.value=g.backgroundBlurriness,d.material.uniforms.backgroundIntensity.value=g.backgroundIntensity,d.material.uniforms.backgroundRotation.value.setFromMatrix4($m.makeRotationFromEuler(oi)),d.material.toneMapped=tt.getTransfer(E.colorSpace)!==ot,(u!==E||h!==E.version||m!==n.toneMapping)&&(d.material.needsUpdate=!0,u=E,h=E.version,m=n.toneMapping),d.layers.enableAll(),v.unshift(d,d.geometry,d.material,0,0,null)):E&&E.isTexture&&(c===void 0&&(c=new ye(new Ls(2,2),new Qn({name:"BackgroundMaterial",uniforms:Yi(bn.background.uniforms),vertexShader:bn.background.vertexShader,fragmentShader:bn.background.fragmentShader,side:Kn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=E,c.material.uniforms.backgroundIntensity.value=g.backgroundIntensity,c.material.toneMapped=tt.getTransfer(E.colorSpace)!==ot,E.matrixAutoUpdate===!0&&E.updateMatrix(),c.material.uniforms.uvTransform.value.copy(E.matrix),(u!==E||h!==E.version||m!==n.toneMapping)&&(c.material.needsUpdate=!0,u=E,h=E.version,m=n.toneMapping),c.layers.enableAll(),v.unshift(c,c.geometry,c.material,0,0,null))}function f(v,g){v.getRGB(cr,Oc(n)),i.buffers.color.setClear(cr.r,cr.g,cr.b,g,a)}function y(){d!==void 0&&(d.geometry.dispose(),d.material.dispose(),d=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(v,g=1){o.set(v),l=g,f(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(v){l=v,f(o,l)},render:x,addToRenderList:p,dispose:y}}function jm(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=h(null);let r=s,a=!1;function o(b,R,I,B,H){let k=!1;const $=u(B,I,R);r!==$&&(r=$,c(r.object)),k=m(b,B,I,H),k&&_(b,B,I,H),H!==null&&e.update(H,n.ELEMENT_ARRAY_BUFFER),(k||a)&&(a=!1,g(b,R,I,B),H!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(H).buffer))}function l(){return n.createVertexArray()}function c(b){return n.bindVertexArray(b)}function d(b){return n.deleteVertexArray(b)}function u(b,R,I){const B=I.wireframe===!0;let H=i[b.id];H===void 0&&(H={},i[b.id]=H);let k=H[R.id];k===void 0&&(k={},H[R.id]=k);let $=k[B];return $===void 0&&($=h(l()),k[B]=$),$}function h(b){const R=[],I=[],B=[];for(let H=0;H<t;H++)R[H]=0,I[H]=0,B[H]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:R,enabledAttributes:I,attributeDivisors:B,object:b,attributes:{},index:null}}function m(b,R,I,B){const H=r.attributes,k=R.attributes;let $=0;const q=I.getAttributes();for(const W in q)if(q[W].location>=0){const pe=H[W];let be=k[W];if(be===void 0&&(W==="instanceMatrix"&&b.instanceMatrix&&(be=b.instanceMatrix),W==="instanceColor"&&b.instanceColor&&(be=b.instanceColor)),pe===void 0||pe.attribute!==be||be&&pe.data!==be.data)return!0;$++}return r.attributesNum!==$||r.index!==B}function _(b,R,I,B){const H={},k=R.attributes;let $=0;const q=I.getAttributes();for(const W in q)if(q[W].location>=0){let pe=k[W];pe===void 0&&(W==="instanceMatrix"&&b.instanceMatrix&&(pe=b.instanceMatrix),W==="instanceColor"&&b.instanceColor&&(pe=b.instanceColor));const be={};be.attribute=pe,pe&&pe.data&&(be.data=pe.data),H[W]=be,$++}r.attributes=H,r.attributesNum=$,r.index=B}function x(){const b=r.newAttributes;for(let R=0,I=b.length;R<I;R++)b[R]=0}function p(b){f(b,0)}function f(b,R){const I=r.newAttributes,B=r.enabledAttributes,H=r.attributeDivisors;I[b]=1,B[b]===0&&(n.enableVertexAttribArray(b),B[b]=1),H[b]!==R&&(n.vertexAttribDivisor(b,R),H[b]=R)}function y(){const b=r.newAttributes,R=r.enabledAttributes;for(let I=0,B=R.length;I<B;I++)R[I]!==b[I]&&(n.disableVertexAttribArray(I),R[I]=0)}function v(b,R,I,B,H,k,$){$===!0?n.vertexAttribIPointer(b,R,I,H,k):n.vertexAttribPointer(b,R,I,B,H,k)}function g(b,R,I,B){x();const H=B.attributes,k=I.getAttributes(),$=R.defaultAttributeValues;for(const q in k){const W=k[q];if(W.location>=0){let ie=H[q];if(ie===void 0&&(q==="instanceMatrix"&&b.instanceMatrix&&(ie=b.instanceMatrix),q==="instanceColor"&&b.instanceColor&&(ie=b.instanceColor)),ie!==void 0){const pe=ie.normalized,be=ie.itemSize,Oe=e.get(ie);if(Oe===void 0)continue;const qe=Oe.buffer,Qe=Oe.type,Ke=Oe.bytesPerElement,Y=Qe===n.INT||Qe===n.UNSIGNED_INT||ie.gpuType===So;if(ie.isInterleavedBufferAttribute){const ne=ie.data,Se=ne.stride,De=ie.offset;if(ne.isInstancedInterleavedBuffer){for(let Te=0;Te<W.locationSize;Te++)f(W.location+Te,ne.meshPerAttribute);b.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=ne.meshPerAttribute*ne.count)}else for(let Te=0;Te<W.locationSize;Te++)p(W.location+Te);n.bindBuffer(n.ARRAY_BUFFER,qe);for(let Te=0;Te<W.locationSize;Te++)v(W.location+Te,be/W.locationSize,Qe,pe,Se*Ke,(De+be/W.locationSize*Te)*Ke,Y)}else{if(ie.isInstancedBufferAttribute){for(let ne=0;ne<W.locationSize;ne++)f(W.location+ne,ie.meshPerAttribute);b.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=ie.meshPerAttribute*ie.count)}else for(let ne=0;ne<W.locationSize;ne++)p(W.location+ne);n.bindBuffer(n.ARRAY_BUFFER,qe);for(let ne=0;ne<W.locationSize;ne++)v(W.location+ne,be/W.locationSize,Qe,pe,be*Ke,be/W.locationSize*ne*Ke,Y)}}else if($!==void 0){const pe=$[q];if(pe!==void 0)switch(pe.length){case 2:n.vertexAttrib2fv(W.location,pe);break;case 3:n.vertexAttrib3fv(W.location,pe);break;case 4:n.vertexAttrib4fv(W.location,pe);break;default:n.vertexAttrib1fv(W.location,pe)}}}}y()}function E(){A();for(const b in i){const R=i[b];for(const I in R){const B=R[I];for(const H in B)d(B[H].object),delete B[H];delete R[I]}delete i[b]}}function T(b){if(i[b.id]===void 0)return;const R=i[b.id];for(const I in R){const B=R[I];for(const H in B)d(B[H].object),delete B[H];delete R[I]}delete i[b.id]}function S(b){for(const R in i){const I=i[R];if(I[b.id]===void 0)continue;const B=I[b.id];for(const H in B)d(B[H].object),delete B[H];delete I[b.id]}}function A(){M(),a=!0,r!==s&&(r=s,c(r.object))}function M(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:A,resetDefaultState:M,dispose:E,releaseStatesOfGeometry:T,releaseStatesOfProgram:S,initAttributes:x,enableAttribute:p,disableUnusedAttributes:y}}function Xm(n,e,t){let i;function s(c){i=c}function r(c,d){n.drawArrays(i,c,d),t.update(d,i,1)}function a(c,d,u){u!==0&&(n.drawArraysInstanced(i,c,d,u),t.update(d,i,u))}function o(c,d,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,d,0,u);let m=0;for(let _=0;_<u;_++)m+=d[_];t.update(m,i,1)}function l(c,d,u,h){if(u===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let _=0;_<c.length;_++)a(c[_],d[_],h[_]);else{m.multiDrawArraysInstancedWEBGL(i,c,0,d,0,h,0,u);let _=0;for(let x=0;x<u;x++)_+=d[x]*h[x];t.update(_,i,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function qm(n,e,t,i){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const S=e.get("EXT_texture_filter_anisotropic");s=n.getParameter(S.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(S){return!(S!==pn&&i.convert(S)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(S){const A=S===Rs&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(S!==Tn&&i.convert(S)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&S!==On&&!A)}function l(S){if(S==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";S="mediump"}return S==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const d=l(c);d!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",d,"instead."),c=d);const u=t.logarithmicDepthBuffer===!0,h=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),m=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),_=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=n.getParameter(n.MAX_TEXTURE_SIZE),p=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),f=n.getParameter(n.MAX_VERTEX_ATTRIBS),y=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),v=n.getParameter(n.MAX_VARYING_VECTORS),g=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),E=_>0,T=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:u,reversedDepthBuffer:h,maxTextures:m,maxVertexTextures:_,maxTextureSize:x,maxCubemapSize:p,maxAttributes:f,maxVertexUniforms:y,maxVaryings:v,maxFragmentUniforms:g,vertexTextures:E,maxSamples:T}}function Ym(n){const e=this;let t=null,i=0,s=!1,r=!1;const a=new qn,o=new $e,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,h){const m=u.length!==0||h||i!==0||s;return s=h,i=u.length,m},this.beginShadows=function(){r=!0,d(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,h){t=d(u,h,0)},this.setState=function(u,h,m){const _=u.clippingPlanes,x=u.clipIntersection,p=u.clipShadows,f=n.get(u);if(!s||_===null||_.length===0||r&&!p)r?d(null):c();else{const y=r?0:i,v=y*4;let g=f.clippingState||null;l.value=g,g=d(_,h,v,m);for(let E=0;E!==v;++E)g[E]=t[E];f.clippingState=g,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=y}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function d(u,h,m,_){const x=u!==null?u.length:0;let p=null;if(x!==0){if(p=l.value,_!==!0||p===null){const f=m+x*4,y=h.matrixWorldInverse;o.getNormalMatrix(y),(p===null||p.length<f)&&(p=new Float32Array(f));for(let v=0,g=m;v!==x;++v,g+=4)a.copy(u[v]).applyMatrix4(y,o),a.normal.toArray(p,g),p[g+3]=a.constant}l.value=p,l.needsUpdate=!0}return e.numPlanes=x,e.numIntersection=0,p}}function Zm(n){let e=new WeakMap;function t(a,o){return o===Ua?a.mapping=ji:o===Na&&(a.mapping=Xi),a}function i(a){if(a&&a.isTexture){const o=a.mapping;if(o===Ua||o===Na)if(e.has(a)){const l=e.get(a).texture;return t(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new fh(l.height);return c.fromEquirectangularTexture(n,a),e.set(a,c),a.addEventListener("dispose",s),t(c.texture,a.mapping)}else return null}}return a}function s(a){const o=a.target;o.removeEventListener("dispose",s);const l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function r(){e=new WeakMap}return{get:i,dispose:r}}const Hi=4,Pl=[.125,.215,.35,.446,.526,.582],mi=20,pa=new Jc,Ll=new Xe;let ma=null,ga=0,_a=0,va=!1;const ui=(1+Math.sqrt(5))/2,Fi=1/ui,Dl=[new L(-ui,Fi,0),new L(ui,Fi,0),new L(-Fi,0,ui),new L(Fi,0,ui),new L(0,ui,-Fi),new L(0,ui,Fi),new L(-1,1,-1),new L(1,1,-1),new L(-1,1,1),new L(1,1,1)],Jm=new L;class Il{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,i=.1,s=100,r={}){const{size:a=256,position:o=Jm}=r;ma=this._renderer.getRenderTarget(),ga=this._renderer.getActiveCubeFace(),_a=this._renderer.getActiveMipmapLevel(),va=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,i,s,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Fl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Nl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(ma,ga,_a),this._renderer.xr.enabled=va,e.scissorTest=!1,dr(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===ji||e.mapping===Xi?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),ma=this._renderer.getRenderTarget(),ga=this._renderer.getActiveCubeFace(),_a=this._renderer.getActiveMipmapLevel(),va=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:Sn,minFilter:Sn,generateMipmaps:!1,type:Rs,format:pn,colorSpace:qi,depthBuffer:!1},s=Ul(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Ul(e,t,i);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Km(r)),this._blurMaterial=Qm(r,e,t)}return s}_compileMaterial(e){const t=new ye(this._lodPlanes[0],e);this._renderer.compile(t,pa)}_sceneToCubeUV(e,t,i,s,r){const l=new ln(90,1,t,i),c=[1,-1,1,1,1,1],d=[1,1,1,-1,-1,-1],u=this._renderer,h=u.autoClear,m=u.toneMapping;u.getClearColor(Ll),u.toneMapping=Jn,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null));const x=new Ir({name:"PMREM.Background",side:Jt,depthWrite:!1,depthTest:!1}),p=new ye(new St,x);let f=!1;const y=e.background;y?y.isColor&&(x.color.copy(y),e.background=null,f=!0):(x.color.copy(Ll),f=!0);for(let v=0;v<6;v++){const g=v%3;g===0?(l.up.set(0,c[v],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+d[v],r.y,r.z)):g===1?(l.up.set(0,0,c[v]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+d[v],r.z)):(l.up.set(0,c[v],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+d[v]));const E=this._cubeSize;dr(s,g*E,v>2?E:0,E,E),u.setRenderTarget(s),f&&u.render(p,l),u.render(e,l)}p.geometry.dispose(),p.material.dispose(),u.toneMapping=m,u.autoClear=h,e.background=y}_textureToCubeUV(e,t){const i=this._renderer,s=e.mapping===ji||e.mapping===Xi;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Fl()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Nl());const r=s?this._cubemapMaterial:this._equirectMaterial,a=new ye(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=e;const l=this._cubeSize;dr(t,0,0,3*l,2*l),i.setRenderTarget(t),i.render(a,pa)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const a=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=Dl[(s-r-1)%Dl.length];this._blur(e,r-1,r,a,o)}t.autoClear=i}_blur(e,t,i,s,r){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,i,s,"latitudinal",r),this._halfBlur(a,e,i,i,s,"longitudinal",r)}_halfBlur(e,t,i,s,r,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const d=3,u=new ye(this._lodPlanes[s],c),h=c.uniforms,m=this._sizeLods[i]-1,_=isFinite(r)?Math.PI/(2*m):2*Math.PI/(2*mi-1),x=r/_,p=isFinite(r)?1+Math.floor(d*x):mi;p>mi&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${mi}`);const f=[];let y=0;for(let S=0;S<mi;++S){const A=S/x,M=Math.exp(-A*A/2);f.push(M),S===0?y+=M:S<p&&(y+=2*M)}for(let S=0;S<f.length;S++)f[S]=f[S]/y;h.envMap.value=e.texture,h.samples.value=p,h.weights.value=f,h.latitudinal.value=a==="latitudinal",o&&(h.poleAxis.value=o);const{_lodMax:v}=this;h.dTheta.value=_,h.mipInt.value=v-i;const g=this._sizeLods[s],E=3*g*(s>v-Hi?s-v+Hi:0),T=4*(this._cubeSize-g);dr(t,E,T,3*g,2*g),l.setRenderTarget(t),l.render(u,pa)}}function Km(n){const e=[],t=[],i=[];let s=n;const r=n-Hi+1+Pl.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);t.push(o);let l=1/o;a>n-Hi?l=Pl[a-n+Hi-1]:a===0&&(l=0),i.push(l);const c=1/(o-2),d=-c,u=1+c,h=[d,d,u,d,u,u,d,d,u,u,d,u],m=6,_=6,x=3,p=2,f=1,y=new Float32Array(x*_*m),v=new Float32Array(p*_*m),g=new Float32Array(f*_*m);for(let T=0;T<m;T++){const S=T%3*2/3-1,A=T>2?0:-1,M=[S,A,0,S+2/3,A,0,S+2/3,A+1,0,S,A,0,S+2/3,A+1,0,S,A+1,0];y.set(M,x*_*T),v.set(h,p*_*T);const b=[T,T,T,T,T,T];g.set(b,f*_*T)}const E=new Nt;E.setAttribute("position",new wn(y,x)),E.setAttribute("uv",new wn(v,p)),E.setAttribute("faceIndex",new wn(g,f)),e.push(E),s>Hi&&s--}return{lodPlanes:e,sizeLods:t,sigmas:i}}function Ul(n,e,t){const i=new xi(n,e,t);return i.texture.mapping=Pr,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function dr(n,e,t,i,s){n.viewport.set(e,t,i,s),n.scissor.set(e,t,i,s)}function Qm(n,e,t){const i=new Float32Array(mi),s=new L(0,1,0);return new Qn({name:"SphericalGaussianBlur",defines:{n:mi,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Fo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Zn,depthTest:!1,depthWrite:!1})}function Nl(){return new Qn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Fo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Zn,depthTest:!1,depthWrite:!1})}function Fl(){return new Qn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Fo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Zn,depthTest:!1,depthWrite:!1})}function Fo(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function eg(n){let e=new WeakMap,t=null;function i(o){if(o&&o.isTexture){const l=o.mapping,c=l===Ua||l===Na,d=l===ji||l===Xi;if(c||d){let u=e.get(o);const h=u!==void 0?u.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==h)return t===null&&(t=new Il(n)),u=c?t.fromEquirectangular(o,u):t.fromCubemap(o,u),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),u.texture;if(u!==void 0)return u.texture;{const m=o.image;return c&&m&&m.height>0||d&&m&&s(m)?(t===null&&(t=new Il(n)),u=c?t.fromEquirectangular(o):t.fromCubemap(o),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),o.addEventListener("dispose",r),u.texture):null}}}return o}function s(o){let l=0;const c=6;for(let d=0;d<c;d++)o[d]!==void 0&&l++;return l===c}function r(o){const l=o.target;l.removeEventListener("dispose",r);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:a}}function tg(n){const e={};function t(i){if(e[i]!==void 0)return e[i];let s;switch(i){case"WEBGL_depth_texture":s=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=n.getExtension(i)}return e[i]=s,s}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const s=t(i);return s===null&&ws("THREE.WebGLRenderer: "+i+" extension not supported."),s}}}function ng(n,e,t,i){const s={},r=new WeakMap;function a(u){const h=u.target;h.index!==null&&e.remove(h.index);for(const _ in h.attributes)e.remove(h.attributes[_]);h.removeEventListener("dispose",a),delete s[h.id];const m=r.get(h);m&&(e.remove(m),r.delete(h)),i.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,t.memory.geometries--}function o(u,h){return s[h.id]===!0||(h.addEventListener("dispose",a),s[h.id]=!0,t.memory.geometries++),h}function l(u){const h=u.attributes;for(const m in h)e.update(h[m],n.ARRAY_BUFFER)}function c(u){const h=[],m=u.index,_=u.attributes.position;let x=0;if(m!==null){const y=m.array;x=m.version;for(let v=0,g=y.length;v<g;v+=3){const E=y[v+0],T=y[v+1],S=y[v+2];h.push(E,T,T,S,S,E)}}else if(_!==void 0){const y=_.array;x=_.version;for(let v=0,g=y.length/3-1;v<g;v+=3){const E=v+0,T=v+1,S=v+2;h.push(E,T,T,S,S,E)}}else return;const p=new(Dc(h)?Fc:Nc)(h,1);p.version=x;const f=r.get(u);f&&e.remove(f),r.set(u,p)}function d(u){const h=r.get(u);if(h){const m=u.index;m!==null&&h.version<m.version&&c(u)}else c(u);return r.get(u)}return{get:o,update:l,getWireframeAttribute:d}}function ig(n,e,t){let i;function s(h){i=h}let r,a;function o(h){r=h.type,a=h.bytesPerElement}function l(h,m){n.drawElements(i,m,r,h*a),t.update(m,i,1)}function c(h,m,_){_!==0&&(n.drawElementsInstanced(i,m,r,h*a,_),t.update(m,i,_))}function d(h,m,_){if(_===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,m,0,r,h,0,_);let p=0;for(let f=0;f<_;f++)p+=m[f];t.update(p,i,1)}function u(h,m,_,x){if(_===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let f=0;f<h.length;f++)c(h[f]/a,m[f],x[f]);else{p.multiDrawElementsInstancedWEBGL(i,m,0,r,h,0,x,0,_);let f=0;for(let y=0;y<_;y++)f+=m[y]*x[y];t.update(f,i,1)}}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=d,this.renderMultiDrawInstances=u}function sg(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,a,o){switch(t.calls++,a){case n.TRIANGLES:t.triangles+=o*(r/3);break;case n.LINES:t.lines+=o*(r/2);break;case n.LINE_STRIP:t.lines+=o*(r-1);break;case n.LINE_LOOP:t.lines+=o*r;break;case n.POINTS:t.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:i}}function rg(n,e,t){const i=new WeakMap,s=new Tt;function r(a,o,l){const c=a.morphTargetInfluences,d=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=d!==void 0?d.length:0;let h=i.get(o);if(h===void 0||h.count!==u){let b=function(){A.dispose(),i.delete(o),o.removeEventListener("dispose",b)};var m=b;h!==void 0&&h.texture.dispose();const _=o.morphAttributes.position!==void 0,x=o.morphAttributes.normal!==void 0,p=o.morphAttributes.color!==void 0,f=o.morphAttributes.position||[],y=o.morphAttributes.normal||[],v=o.morphAttributes.color||[];let g=0;_===!0&&(g=1),x===!0&&(g=2),p===!0&&(g=3);let E=o.attributes.position.count*g,T=1;E>e.maxTextureSize&&(T=Math.ceil(E/e.maxTextureSize),E=e.maxTextureSize);const S=new Float32Array(E*T*4*u),A=new Ic(S,E,T,u);A.type=On,A.needsUpdate=!0;const M=g*4;for(let R=0;R<u;R++){const I=f[R],B=y[R],H=v[R],k=E*T*4*R;for(let $=0;$<I.count;$++){const q=$*M;_===!0&&(s.fromBufferAttribute(I,$),S[k+q+0]=s.x,S[k+q+1]=s.y,S[k+q+2]=s.z,S[k+q+3]=0),x===!0&&(s.fromBufferAttribute(B,$),S[k+q+4]=s.x,S[k+q+5]=s.y,S[k+q+6]=s.z,S[k+q+7]=0),p===!0&&(s.fromBufferAttribute(H,$),S[k+q+8]=s.x,S[k+q+9]=s.y,S[k+q+10]=s.z,S[k+q+11]=H.itemSize===4?s.w:1)}}h={count:u,texture:A,size:new oe(E,T)},i.set(o,h),o.addEventListener("dispose",b)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",a.morphTexture,t);else{let _=0;for(let p=0;p<c.length;p++)_+=c[p];const x=o.morphTargetsRelative?1:1-_;l.getUniforms().setValue(n,"morphTargetBaseInfluence",x),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",h.texture,t),l.getUniforms().setValue(n,"morphTargetsTextureSize",h.size)}return{update:r}}function ag(n,e,t,i){let s=new WeakMap;function r(l){const c=i.render.frame,d=l.geometry,u=e.get(l,d);if(s.get(u)!==c&&(e.update(u),s.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),s.get(l)!==c&&(t.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,n.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){const h=l.skeleton;s.get(h)!==c&&(h.update(),s.set(h,c))}return u}function a(){s=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:a}}const td=new Kt,Ol=new kc(1,1),nd=new Ic,id=new Zu,sd=new Bc,zl=[],Bl=[],kl=new Float32Array(16),Hl=new Float32Array(9),Gl=new Float32Array(4);function es(n,e,t){const i=n[0];if(i<=0||i>0)return n;const s=e*t;let r=zl[s];if(r===void 0&&(r=new Float32Array(s),zl[s]=r),e!==0){i.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,n[a].toArray(r,o)}return r}function Dt(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function It(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function Ur(n,e){let t=Bl[e];t===void 0&&(t=new Int32Array(e),Bl[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function og(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function lg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Dt(t,e))return;n.uniform2fv(this.addr,e),It(t,e)}}function cg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Dt(t,e))return;n.uniform3fv(this.addr,e),It(t,e)}}function dg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Dt(t,e))return;n.uniform4fv(this.addr,e),It(t,e)}}function ug(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Dt(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),It(t,e)}else{if(Dt(t,i))return;Gl.set(i),n.uniformMatrix2fv(this.addr,!1,Gl),It(t,i)}}function hg(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Dt(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),It(t,e)}else{if(Dt(t,i))return;Hl.set(i),n.uniformMatrix3fv(this.addr,!1,Hl),It(t,i)}}function fg(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Dt(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),It(t,e)}else{if(Dt(t,i))return;kl.set(i),n.uniformMatrix4fv(this.addr,!1,kl),It(t,i)}}function pg(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function mg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Dt(t,e))return;n.uniform2iv(this.addr,e),It(t,e)}}function gg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Dt(t,e))return;n.uniform3iv(this.addr,e),It(t,e)}}function _g(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Dt(t,e))return;n.uniform4iv(this.addr,e),It(t,e)}}function vg(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function xg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Dt(t,e))return;n.uniform2uiv(this.addr,e),It(t,e)}}function yg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Dt(t,e))return;n.uniform3uiv(this.addr,e),It(t,e)}}function bg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Dt(t,e))return;n.uniform4uiv(this.addr,e),It(t,e)}}function Mg(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_2D_SHADOW?(Ol.compareFunction=Lc,r=Ol):r=td,t.setTexture2D(e||r,s)}function Sg(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture3D(e||id,s)}function Eg(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTextureCube(e||sd,s)}function wg(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture2DArray(e||nd,s)}function Tg(n){switch(n){case 5126:return og;case 35664:return lg;case 35665:return cg;case 35666:return dg;case 35674:return ug;case 35675:return hg;case 35676:return fg;case 5124:case 35670:return pg;case 35667:case 35671:return mg;case 35668:case 35672:return gg;case 35669:case 35673:return _g;case 5125:return vg;case 36294:return xg;case 36295:return yg;case 36296:return bg;case 35678:case 36198:case 36298:case 36306:case 35682:return Mg;case 35679:case 36299:case 36307:return Sg;case 35680:case 36300:case 36308:case 36293:return Eg;case 36289:case 36303:case 36311:case 36292:return wg}}function Ag(n,e){n.uniform1fv(this.addr,e)}function Cg(n,e){const t=es(e,this.size,2);n.uniform2fv(this.addr,t)}function Rg(n,e){const t=es(e,this.size,3);n.uniform3fv(this.addr,t)}function Pg(n,e){const t=es(e,this.size,4);n.uniform4fv(this.addr,t)}function Lg(n,e){const t=es(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function Dg(n,e){const t=es(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function Ig(n,e){const t=es(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function Ug(n,e){n.uniform1iv(this.addr,e)}function Ng(n,e){n.uniform2iv(this.addr,e)}function Fg(n,e){n.uniform3iv(this.addr,e)}function Og(n,e){n.uniform4iv(this.addr,e)}function zg(n,e){n.uniform1uiv(this.addr,e)}function Bg(n,e){n.uniform2uiv(this.addr,e)}function kg(n,e){n.uniform3uiv(this.addr,e)}function Hg(n,e){n.uniform4uiv(this.addr,e)}function Gg(n,e,t){const i=this.cache,s=e.length,r=Ur(t,s);Dt(i,r)||(n.uniform1iv(this.addr,r),It(i,r));for(let a=0;a!==s;++a)t.setTexture2D(e[a]||td,r[a])}function Vg(n,e,t){const i=this.cache,s=e.length,r=Ur(t,s);Dt(i,r)||(n.uniform1iv(this.addr,r),It(i,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||id,r[a])}function $g(n,e,t){const i=this.cache,s=e.length,r=Ur(t,s);Dt(i,r)||(n.uniform1iv(this.addr,r),It(i,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||sd,r[a])}function Wg(n,e,t){const i=this.cache,s=e.length,r=Ur(t,s);Dt(i,r)||(n.uniform1iv(this.addr,r),It(i,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||nd,r[a])}function jg(n){switch(n){case 5126:return Ag;case 35664:return Cg;case 35665:return Rg;case 35666:return Pg;case 35674:return Lg;case 35675:return Dg;case 35676:return Ig;case 5124:case 35670:return Ug;case 35667:case 35671:return Ng;case 35668:case 35672:return Fg;case 35669:case 35673:return Og;case 5125:return zg;case 36294:return Bg;case 36295:return kg;case 36296:return Hg;case 35678:case 36198:case 36298:case 36306:case 35682:return Gg;case 35679:case 36299:case 36307:return Vg;case 35680:case 36300:case 36308:case 36293:return $g;case 36289:case 36303:case 36311:case 36292:return Wg}}class Xg{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=Tg(t.type)}}class qg{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=jg(t.type)}}class Yg{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(e,t[o.id],i)}}}const xa=/(\w+)(\])?(\[|\.)?/g;function Vl(n,e){n.seq.push(e),n.map[e.id]=e}function Zg(n,e,t){const i=n.name,s=i.length;for(xa.lastIndex=0;;){const r=xa.exec(i),a=xa.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){Vl(t,c===void 0?new Xg(o,n,e):new qg(o,n,e));break}else{let u=t.map[o];u===void 0&&(u=new Yg(o),Vl(t,u)),t=u}}}class br{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<i;++s){const r=e.getActiveUniform(t,s),a=e.getUniformLocation(t,r.name);Zg(r,a,this)}}setValue(e,t,i,s){const r=this.map[t];r!==void 0&&r.setValue(e,i,s)}setOptional(e,t,i){const s=t[i];s!==void 0&&this.setValue(e,i,s)}static upload(e,t,i,s){for(let r=0,a=t.length;r!==a;++r){const o=t[r],l=i[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){const i=[];for(let s=0,r=e.length;s!==r;++s){const a=e[s];a.id in t&&i.push(a)}return i}}function $l(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const Jg=37297;let Kg=0;function Qg(n,e){const t=n.split(`
`),i=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){const o=a+1;i.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return i.join(`
`)}const Wl=new $e;function e_(n){tt._getMatrix(Wl,tt.workingColorSpace,n);const e=`mat3( ${Wl.elements.map(t=>t.toFixed(4))} )`;switch(tt.getTransfer(n)){case Sr:return[e,"LinearTransferOETF"];case ot:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function jl(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),r=(n.getShaderInfoLog(e)||"").trim();if(i&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+Qg(n.getShaderSource(e),o)}else return r}function t_(n,e){const t=e_(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function n_(n,e){let t;switch(e){case Su:t="Linear";break;case Eu:t="Reinhard";break;case wu:t="Cineon";break;case Tu:t="ACESFilmic";break;case Cu:t="AgX";break;case Ru:t="Neutral";break;case Au:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const ur=new L;function i_(){tt.getLuminanceCoefficients(ur);const n=ur.x.toFixed(4),e=ur.y.toFixed(4),t=ur.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function s_(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(fs).join(`
`)}function r_(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function a_(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const r=n.getActiveAttrib(e,s),a=r.name;let o=1;r.type===n.FLOAT_MAT2&&(o=2),r.type===n.FLOAT_MAT3&&(o=3),r.type===n.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:n.getAttribLocation(e,a),locationSize:o}}return t}function fs(n){return n!==""}function Xl(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function ql(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const o_=/^[ \t]*#include +<([\w\d./]+)>/gm;function yo(n){return n.replace(o_,c_)}const l_=new Map;function c_(n,e){let t=We[e];if(t===void 0){const i=l_.get(e);if(i!==void 0)t=We[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return yo(t)}const d_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Yl(n){return n.replace(d_,u_)}function u_(n,e,t,i){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Zl(n){let e=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?e+=`
#define HIGH_PRECISION`:n.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function h_(n){let e="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===xc?e="SHADOWMAP_TYPE_PCF":n.shadowMapType===nu?e="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===Nn&&(e="SHADOWMAP_TYPE_VSM"),e}function f_(n){let e="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case ji:case Xi:e="ENVMAP_TYPE_CUBE";break;case Pr:e="ENVMAP_TYPE_CUBE_UV";break}return e}function p_(n){let e="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case Xi:e="ENVMAP_MODE_REFRACTION";break}return e}function m_(n){let e="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case yc:e="ENVMAP_BLENDING_MULTIPLY";break;case bu:e="ENVMAP_BLENDING_MIX";break;case Mu:e="ENVMAP_BLENDING_ADD";break}return e}function g_(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function __(n,e,t,i){const s=n.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=h_(t),c=f_(t),d=p_(t),u=m_(t),h=g_(t),m=s_(t),_=r_(r),x=s.createProgram();let p,f,y=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(fs).join(`
`),p.length>0&&(p+=`
`),f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(fs).join(`
`),f.length>0&&(f+=`
`)):(p=[Zl(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+d:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(fs).join(`
`),f=[Zl(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+d:"",t.envMap?"#define "+u:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Jn?"#define TONE_MAPPING":"",t.toneMapping!==Jn?We.tonemapping_pars_fragment:"",t.toneMapping!==Jn?n_("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",We.colorspace_pars_fragment,t_("linearToOutputTexel",t.outputColorSpace),i_(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(fs).join(`
`)),a=yo(a),a=Xl(a,t),a=ql(a,t),o=yo(o),o=Xl(o,t),o=ql(o,t),a=Yl(a),o=Yl(o),t.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,p=[m,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,f=["#define varying in",t.glslVersion===Ko?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Ko?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);const v=y+p+a,g=y+f+o,E=$l(s,s.VERTEX_SHADER,v),T=$l(s,s.FRAGMENT_SHADER,g);s.attachShader(x,E),s.attachShader(x,T),t.index0AttributeName!==void 0?s.bindAttribLocation(x,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(x,0,"position"),s.linkProgram(x);function S(R){if(n.debug.checkShaderErrors){const I=s.getProgramInfoLog(x)||"",B=s.getShaderInfoLog(E)||"",H=s.getShaderInfoLog(T)||"",k=I.trim(),$=B.trim(),q=H.trim();let W=!0,ie=!0;if(s.getProgramParameter(x,s.LINK_STATUS)===!1)if(W=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,x,E,T);else{const pe=jl(s,E,"vertex"),be=jl(s,T,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(x,s.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+k+`
`+pe+`
`+be)}else k!==""?console.warn("THREE.WebGLProgram: Program Info Log:",k):($===""||q==="")&&(ie=!1);ie&&(R.diagnostics={runnable:W,programLog:k,vertexShader:{log:$,prefix:p},fragmentShader:{log:q,prefix:f}})}s.deleteShader(E),s.deleteShader(T),A=new br(s,x),M=a_(s,x)}let A;this.getUniforms=function(){return A===void 0&&S(this),A};let M;this.getAttributes=function(){return M===void 0&&S(this),M};let b=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return b===!1&&(b=s.getProgramParameter(x,Jg)),b},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(x),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Kg++,this.cacheKey=e,this.usedTimes=1,this.program=x,this.vertexShader=E,this.fragmentShader=T,this}let v_=0;class x_{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(i),a=this._getShaderCacheForMaterial(e);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new y_(e),t.set(e,i)),i}}class y_{constructor(e){this.id=v_++,this.code=e,this.usedTimes=0}}function b_(n,e,t,i,s,r,a){const o=new Po,l=new x_,c=new Set,d=[],u=s.logarithmicDepthBuffer,h=s.vertexTextures;let m=s.precision;const _={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(M){return c.add(M),M===0?"uv":`uv${M}`}function p(M,b,R,I,B){const H=I.fog,k=B.geometry,$=M.isMeshStandardMaterial?I.environment:null,q=(M.isMeshStandardMaterial?t:e).get(M.envMap||$),W=q&&q.mapping===Pr?q.image.height:null,ie=_[M.type];M.precision!==null&&(m=s.getMaxPrecision(M.precision),m!==M.precision&&console.warn("THREE.WebGLProgram.getParameters:",M.precision,"not supported, using",m,"instead."));const pe=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,be=pe!==void 0?pe.length:0;let Oe=0;k.morphAttributes.position!==void 0&&(Oe=1),k.morphAttributes.normal!==void 0&&(Oe=2),k.morphAttributes.color!==void 0&&(Oe=3);let qe,Qe,Ke,Y;if(ie){const nt=bn[ie];qe=nt.vertexShader,Qe=nt.fragmentShader}else qe=M.vertexShader,Qe=M.fragmentShader,l.update(M),Ke=l.getVertexShaderID(M),Y=l.getFragmentShaderID(M);const ne=n.getRenderTarget(),Se=n.state.buffers.depth.getReversed(),De=B.isInstancedMesh===!0,Te=B.isBatchedMesh===!0,Ye=!!M.map,mt=!!M.matcap,D=!!q,te=!!M.aoMap,K=!!M.lightMap,J=!!M.bumpMap,Z=!!M.normalMap,ue=!!M.displacementMap,se=!!M.emissiveMap,he=!!M.metalnessMap,He=!!M.roughnessMap,Be=M.anisotropy>0,P=M.clearcoat>0,w=M.dispersion>0,z=M.iridescence>0,j=M.sheen>0,ee=M.transmission>0,X=Be&&!!M.anisotropyMap,Pe=P&&!!M.clearcoatMap,de=P&&!!M.clearcoatNormalMap,Ae=P&&!!M.clearcoatRoughnessMap,Ce=z&&!!M.iridescenceMap,re=z&&!!M.iridescenceThicknessMap,ve=j&&!!M.sheenColorMap,Fe=j&&!!M.sheenRoughnessMap,Le=!!M.specularMap,ge=!!M.specularColorMap,Ve=!!M.specularIntensityMap,N=ee&&!!M.transmissionMap,ce=ee&&!!M.thicknessMap,fe=!!M.gradientMap,Ee=!!M.alphaMap,ae=M.alphaTest>0,Q=!!M.alphaHash,Re=!!M.extensions;let Ge=Jn;M.toneMapped&&(ne===null||ne.isXRRenderTarget===!0)&&(Ge=n.toneMapping);const gt={shaderID:ie,shaderType:M.type,shaderName:M.name,vertexShader:qe,fragmentShader:Qe,defines:M.defines,customVertexShaderID:Ke,customFragmentShaderID:Y,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:m,batching:Te,batchingColor:Te&&B._colorsTexture!==null,instancing:De,instancingColor:De&&B.instanceColor!==null,instancingMorph:De&&B.morphTexture!==null,supportsVertexTextures:h,outputColorSpace:ne===null?n.outputColorSpace:ne.isXRRenderTarget===!0?ne.texture.colorSpace:qi,alphaToCoverage:!!M.alphaToCoverage,map:Ye,matcap:mt,envMap:D,envMapMode:D&&q.mapping,envMapCubeUVHeight:W,aoMap:te,lightMap:K,bumpMap:J,normalMap:Z,displacementMap:h&&ue,emissiveMap:se,normalMapObjectSpace:Z&&M.normalMapType===Iu,normalMapTangentSpace:Z&&M.normalMapType===Pc,metalnessMap:he,roughnessMap:He,anisotropy:Be,anisotropyMap:X,clearcoat:P,clearcoatMap:Pe,clearcoatNormalMap:de,clearcoatRoughnessMap:Ae,dispersion:w,iridescence:z,iridescenceMap:Ce,iridescenceThicknessMap:re,sheen:j,sheenColorMap:ve,sheenRoughnessMap:Fe,specularMap:Le,specularColorMap:ge,specularIntensityMap:Ve,transmission:ee,transmissionMap:N,thicknessMap:ce,gradientMap:fe,opaque:M.transparent===!1&&M.blending===Vi&&M.alphaToCoverage===!1,alphaMap:Ee,alphaTest:ae,alphaHash:Q,combine:M.combine,mapUv:Ye&&x(M.map.channel),aoMapUv:te&&x(M.aoMap.channel),lightMapUv:K&&x(M.lightMap.channel),bumpMapUv:J&&x(M.bumpMap.channel),normalMapUv:Z&&x(M.normalMap.channel),displacementMapUv:ue&&x(M.displacementMap.channel),emissiveMapUv:se&&x(M.emissiveMap.channel),metalnessMapUv:he&&x(M.metalnessMap.channel),roughnessMapUv:He&&x(M.roughnessMap.channel),anisotropyMapUv:X&&x(M.anisotropyMap.channel),clearcoatMapUv:Pe&&x(M.clearcoatMap.channel),clearcoatNormalMapUv:de&&x(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Ae&&x(M.clearcoatRoughnessMap.channel),iridescenceMapUv:Ce&&x(M.iridescenceMap.channel),iridescenceThicknessMapUv:re&&x(M.iridescenceThicknessMap.channel),sheenColorMapUv:ve&&x(M.sheenColorMap.channel),sheenRoughnessMapUv:Fe&&x(M.sheenRoughnessMap.channel),specularMapUv:Le&&x(M.specularMap.channel),specularColorMapUv:ge&&x(M.specularColorMap.channel),specularIntensityMapUv:Ve&&x(M.specularIntensityMap.channel),transmissionMapUv:N&&x(M.transmissionMap.channel),thicknessMapUv:ce&&x(M.thicknessMap.channel),alphaMapUv:Ee&&x(M.alphaMap.channel),vertexTangents:!!k.attributes.tangent&&(Z||Be),vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,pointsUvs:B.isPoints===!0&&!!k.attributes.uv&&(Ye||Ee),fog:!!H,useFog:M.fog===!0,fogExp2:!!H&&H.isFogExp2,flatShading:M.flatShading===!0&&M.wireframe===!1,sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:Se,skinning:B.isSkinnedMesh===!0,morphTargets:k.morphAttributes.position!==void 0,morphNormals:k.morphAttributes.normal!==void 0,morphColors:k.morphAttributes.color!==void 0,morphTargetsCount:be,morphTextureStride:Oe,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:M.dithering,shadowMapEnabled:n.shadowMap.enabled&&R.length>0,shadowMapType:n.shadowMap.type,toneMapping:Ge,decodeVideoTexture:Ye&&M.map.isVideoTexture===!0&&tt.getTransfer(M.map.colorSpace)===ot,decodeVideoTextureEmissive:se&&M.emissiveMap.isVideoTexture===!0&&tt.getTransfer(M.emissiveMap.colorSpace)===ot,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===fn,flipSided:M.side===Jt,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionClipCullDistance:Re&&M.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Re&&M.extensions.multiDraw===!0||Te)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()};return gt.vertexUv1s=c.has(1),gt.vertexUv2s=c.has(2),gt.vertexUv3s=c.has(3),c.clear(),gt}function f(M){const b=[];if(M.shaderID?b.push(M.shaderID):(b.push(M.customVertexShaderID),b.push(M.customFragmentShaderID)),M.defines!==void 0)for(const R in M.defines)b.push(R),b.push(M.defines[R]);return M.isRawShaderMaterial===!1&&(y(b,M),v(b,M),b.push(n.outputColorSpace)),b.push(M.customProgramCacheKey),b.join()}function y(M,b){M.push(b.precision),M.push(b.outputColorSpace),M.push(b.envMapMode),M.push(b.envMapCubeUVHeight),M.push(b.mapUv),M.push(b.alphaMapUv),M.push(b.lightMapUv),M.push(b.aoMapUv),M.push(b.bumpMapUv),M.push(b.normalMapUv),M.push(b.displacementMapUv),M.push(b.emissiveMapUv),M.push(b.metalnessMapUv),M.push(b.roughnessMapUv),M.push(b.anisotropyMapUv),M.push(b.clearcoatMapUv),M.push(b.clearcoatNormalMapUv),M.push(b.clearcoatRoughnessMapUv),M.push(b.iridescenceMapUv),M.push(b.iridescenceThicknessMapUv),M.push(b.sheenColorMapUv),M.push(b.sheenRoughnessMapUv),M.push(b.specularMapUv),M.push(b.specularColorMapUv),M.push(b.specularIntensityMapUv),M.push(b.transmissionMapUv),M.push(b.thicknessMapUv),M.push(b.combine),M.push(b.fogExp2),M.push(b.sizeAttenuation),M.push(b.morphTargetsCount),M.push(b.morphAttributeCount),M.push(b.numDirLights),M.push(b.numPointLights),M.push(b.numSpotLights),M.push(b.numSpotLightMaps),M.push(b.numHemiLights),M.push(b.numRectAreaLights),M.push(b.numDirLightShadows),M.push(b.numPointLightShadows),M.push(b.numSpotLightShadows),M.push(b.numSpotLightShadowsWithMaps),M.push(b.numLightProbes),M.push(b.shadowMapType),M.push(b.toneMapping),M.push(b.numClippingPlanes),M.push(b.numClipIntersection),M.push(b.depthPacking)}function v(M,b){o.disableAll(),b.supportsVertexTextures&&o.enable(0),b.instancing&&o.enable(1),b.instancingColor&&o.enable(2),b.instancingMorph&&o.enable(3),b.matcap&&o.enable(4),b.envMap&&o.enable(5),b.normalMapObjectSpace&&o.enable(6),b.normalMapTangentSpace&&o.enable(7),b.clearcoat&&o.enable(8),b.iridescence&&o.enable(9),b.alphaTest&&o.enable(10),b.vertexColors&&o.enable(11),b.vertexAlphas&&o.enable(12),b.vertexUv1s&&o.enable(13),b.vertexUv2s&&o.enable(14),b.vertexUv3s&&o.enable(15),b.vertexTangents&&o.enable(16),b.anisotropy&&o.enable(17),b.alphaHash&&o.enable(18),b.batching&&o.enable(19),b.dispersion&&o.enable(20),b.batchingColor&&o.enable(21),b.gradientMap&&o.enable(22),M.push(o.mask),o.disableAll(),b.fog&&o.enable(0),b.useFog&&o.enable(1),b.flatShading&&o.enable(2),b.logarithmicDepthBuffer&&o.enable(3),b.reversedDepthBuffer&&o.enable(4),b.skinning&&o.enable(5),b.morphTargets&&o.enable(6),b.morphNormals&&o.enable(7),b.morphColors&&o.enable(8),b.premultipliedAlpha&&o.enable(9),b.shadowMapEnabled&&o.enable(10),b.doubleSided&&o.enable(11),b.flipSided&&o.enable(12),b.useDepthPacking&&o.enable(13),b.dithering&&o.enable(14),b.transmission&&o.enable(15),b.sheen&&o.enable(16),b.opaque&&o.enable(17),b.pointsUvs&&o.enable(18),b.decodeVideoTexture&&o.enable(19),b.decodeVideoTextureEmissive&&o.enable(20),b.alphaToCoverage&&o.enable(21),M.push(o.mask)}function g(M){const b=_[M.type];let R;if(b){const I=bn[b];R=ch.clone(I.uniforms)}else R=M.uniforms;return R}function E(M,b){let R;for(let I=0,B=d.length;I<B;I++){const H=d[I];if(H.cacheKey===b){R=H,++R.usedTimes;break}}return R===void 0&&(R=new __(n,b,M,r),d.push(R)),R}function T(M){if(--M.usedTimes===0){const b=d.indexOf(M);d[b]=d[d.length-1],d.pop(),M.destroy()}}function S(M){l.remove(M)}function A(){l.dispose()}return{getParameters:p,getProgramCacheKey:f,getUniforms:g,acquireProgram:E,releaseProgram:T,releaseShaderCache:S,programs:d,dispose:A}}function M_(){let n=new WeakMap;function e(a){return n.has(a)}function t(a){let o=n.get(a);return o===void 0&&(o={},n.set(a,o)),o}function i(a){n.delete(a)}function s(a,o,l){n.get(a)[o]=l}function r(){n=new WeakMap}return{has:e,get:t,remove:i,update:s,dispose:r}}function S_(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.z!==e.z?n.z-e.z:n.id-e.id}function Jl(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function Kl(){const n=[];let e=0;const t=[],i=[],s=[];function r(){e=0,t.length=0,i.length=0,s.length=0}function a(u,h,m,_,x,p){let f=n[e];return f===void 0?(f={id:u.id,object:u,geometry:h,material:m,groupOrder:_,renderOrder:u.renderOrder,z:x,group:p},n[e]=f):(f.id=u.id,f.object=u,f.geometry=h,f.material=m,f.groupOrder=_,f.renderOrder=u.renderOrder,f.z=x,f.group=p),e++,f}function o(u,h,m,_,x,p){const f=a(u,h,m,_,x,p);m.transmission>0?i.push(f):m.transparent===!0?s.push(f):t.push(f)}function l(u,h,m,_,x,p){const f=a(u,h,m,_,x,p);m.transmission>0?i.unshift(f):m.transparent===!0?s.unshift(f):t.unshift(f)}function c(u,h){t.length>1&&t.sort(u||S_),i.length>1&&i.sort(h||Jl),s.length>1&&s.sort(h||Jl)}function d(){for(let u=e,h=n.length;u<h;u++){const m=n[u];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:i,transparent:s,init:r,push:o,unshift:l,finish:d,sort:c}}function E_(){let n=new WeakMap;function e(i,s){const r=n.get(i);let a;return r===void 0?(a=new Kl,n.set(i,[a])):s>=r.length?(a=new Kl,r.push(a)):a=r[s],a}function t(){n=new WeakMap}return{get:e,dispose:t}}function w_(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new L,color:new Xe};break;case"SpotLight":t={position:new L,direction:new L,color:new Xe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new L,color:new Xe,distance:0,decay:0};break;case"HemisphereLight":t={direction:new L,skyColor:new Xe,groundColor:new Xe};break;case"RectAreaLight":t={color:new Xe,position:new L,halfWidth:new L,halfHeight:new L};break}return n[e.id]=t,t}}}function T_(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new oe};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new oe};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new oe,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let A_=0;function C_(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function R_(n){const e=new w_,t=T_(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new L);const s=new L,r=new dt,a=new dt;function o(c){let d=0,u=0,h=0;for(let M=0;M<9;M++)i.probe[M].set(0,0,0);let m=0,_=0,x=0,p=0,f=0,y=0,v=0,g=0,E=0,T=0,S=0;c.sort(C_);for(let M=0,b=c.length;M<b;M++){const R=c[M],I=R.color,B=R.intensity,H=R.distance,k=R.shadow&&R.shadow.map?R.shadow.map.texture:null;if(R.isAmbientLight)d+=I.r*B,u+=I.g*B,h+=I.b*B;else if(R.isLightProbe){for(let $=0;$<9;$++)i.probe[$].addScaledVector(R.sh.coefficients[$],B);S++}else if(R.isDirectionalLight){const $=e.get(R);if($.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){const q=R.shadow,W=t.get(R);W.shadowIntensity=q.intensity,W.shadowBias=q.bias,W.shadowNormalBias=q.normalBias,W.shadowRadius=q.radius,W.shadowMapSize=q.mapSize,i.directionalShadow[m]=W,i.directionalShadowMap[m]=k,i.directionalShadowMatrix[m]=R.shadow.matrix,y++}i.directional[m]=$,m++}else if(R.isSpotLight){const $=e.get(R);$.position.setFromMatrixPosition(R.matrixWorld),$.color.copy(I).multiplyScalar(B),$.distance=H,$.coneCos=Math.cos(R.angle),$.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),$.decay=R.decay,i.spot[x]=$;const q=R.shadow;if(R.map&&(i.spotLightMap[E]=R.map,E++,q.updateMatrices(R),R.castShadow&&T++),i.spotLightMatrix[x]=q.matrix,R.castShadow){const W=t.get(R);W.shadowIntensity=q.intensity,W.shadowBias=q.bias,W.shadowNormalBias=q.normalBias,W.shadowRadius=q.radius,W.shadowMapSize=q.mapSize,i.spotShadow[x]=W,i.spotShadowMap[x]=k,g++}x++}else if(R.isRectAreaLight){const $=e.get(R);$.color.copy(I).multiplyScalar(B),$.halfWidth.set(R.width*.5,0,0),$.halfHeight.set(0,R.height*.5,0),i.rectArea[p]=$,p++}else if(R.isPointLight){const $=e.get(R);if($.color.copy(R.color).multiplyScalar(R.intensity),$.distance=R.distance,$.decay=R.decay,R.castShadow){const q=R.shadow,W=t.get(R);W.shadowIntensity=q.intensity,W.shadowBias=q.bias,W.shadowNormalBias=q.normalBias,W.shadowRadius=q.radius,W.shadowMapSize=q.mapSize,W.shadowCameraNear=q.camera.near,W.shadowCameraFar=q.camera.far,i.pointShadow[_]=W,i.pointShadowMap[_]=k,i.pointShadowMatrix[_]=R.shadow.matrix,v++}i.point[_]=$,_++}else if(R.isHemisphereLight){const $=e.get(R);$.skyColor.copy(R.color).multiplyScalar(B),$.groundColor.copy(R.groundColor).multiplyScalar(B),i.hemi[f]=$,f++}}p>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=me.LTC_FLOAT_1,i.rectAreaLTC2=me.LTC_FLOAT_2):(i.rectAreaLTC1=me.LTC_HALF_1,i.rectAreaLTC2=me.LTC_HALF_2)),i.ambient[0]=d,i.ambient[1]=u,i.ambient[2]=h;const A=i.hash;(A.directionalLength!==m||A.pointLength!==_||A.spotLength!==x||A.rectAreaLength!==p||A.hemiLength!==f||A.numDirectionalShadows!==y||A.numPointShadows!==v||A.numSpotShadows!==g||A.numSpotMaps!==E||A.numLightProbes!==S)&&(i.directional.length=m,i.spot.length=x,i.rectArea.length=p,i.point.length=_,i.hemi.length=f,i.directionalShadow.length=y,i.directionalShadowMap.length=y,i.pointShadow.length=v,i.pointShadowMap.length=v,i.spotShadow.length=g,i.spotShadowMap.length=g,i.directionalShadowMatrix.length=y,i.pointShadowMatrix.length=v,i.spotLightMatrix.length=g+E-T,i.spotLightMap.length=E,i.numSpotLightShadowsWithMaps=T,i.numLightProbes=S,A.directionalLength=m,A.pointLength=_,A.spotLength=x,A.rectAreaLength=p,A.hemiLength=f,A.numDirectionalShadows=y,A.numPointShadows=v,A.numSpotShadows=g,A.numSpotMaps=E,A.numLightProbes=S,i.version=A_++)}function l(c,d){let u=0,h=0,m=0,_=0,x=0;const p=d.matrixWorldInverse;for(let f=0,y=c.length;f<y;f++){const v=c[f];if(v.isDirectionalLight){const g=i.directional[u];g.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),g.direction.sub(s),g.direction.transformDirection(p),u++}else if(v.isSpotLight){const g=i.spot[m];g.position.setFromMatrixPosition(v.matrixWorld),g.position.applyMatrix4(p),g.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),g.direction.sub(s),g.direction.transformDirection(p),m++}else if(v.isRectAreaLight){const g=i.rectArea[_];g.position.setFromMatrixPosition(v.matrixWorld),g.position.applyMatrix4(p),a.identity(),r.copy(v.matrixWorld),r.premultiply(p),a.extractRotation(r),g.halfWidth.set(v.width*.5,0,0),g.halfHeight.set(0,v.height*.5,0),g.halfWidth.applyMatrix4(a),g.halfHeight.applyMatrix4(a),_++}else if(v.isPointLight){const g=i.point[h];g.position.setFromMatrixPosition(v.matrixWorld),g.position.applyMatrix4(p),h++}else if(v.isHemisphereLight){const g=i.hemi[x];g.direction.setFromMatrixPosition(v.matrixWorld),g.direction.transformDirection(p),x++}}}return{setup:o,setupView:l,state:i}}function Ql(n){const e=new R_(n),t=[],i=[];function s(d){c.camera=d,t.length=0,i.length=0}function r(d){t.push(d)}function a(d){i.push(d)}function o(){e.setup(t)}function l(d){e.setupView(t,d)}const c={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:o,setupLightsView:l,pushLight:r,pushShadow:a}}function P_(n){let e=new WeakMap;function t(s,r=0){const a=e.get(s);let o;return a===void 0?(o=new Ql(n),e.set(s,[o])):r>=a.length?(o=new Ql(n),a.push(o)):o=a[r],o}function i(){e=new WeakMap}return{get:t,dispose:i}}const L_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,D_=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function I_(n,e,t){let i=new Lo;const s=new oe,r=new oe,a=new Tt,o=new Qh({depthPacking:Du}),l=new ef,c={},d=t.maxTextureSize,u={[Kn]:Jt,[Jt]:Kn,[fn]:fn},h=new Qn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new oe},radius:{value:4}},vertexShader:L_,fragmentShader:D_}),m=h.clone();m.defines.HORIZONTAL_PASS=1;const _=new Nt;_.setAttribute("position",new wn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const x=new ye(_,h),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=xc;let f=this.type;this.render=function(T,S,A){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||T.length===0)return;const M=n.getRenderTarget(),b=n.getActiveCubeFace(),R=n.getActiveMipmapLevel(),I=n.state;I.setBlending(Zn),I.buffers.depth.getReversed()===!0?I.buffers.color.setClear(0,0,0,0):I.buffers.color.setClear(1,1,1,1),I.buffers.depth.setTest(!0),I.setScissorTest(!1);const B=f!==Nn&&this.type===Nn,H=f===Nn&&this.type!==Nn;for(let k=0,$=T.length;k<$;k++){const q=T[k],W=q.shadow;if(W===void 0){console.warn("THREE.WebGLShadowMap:",q,"has no shadow.");continue}if(W.autoUpdate===!1&&W.needsUpdate===!1)continue;s.copy(W.mapSize);const ie=W.getFrameExtents();if(s.multiply(ie),r.copy(W.mapSize),(s.x>d||s.y>d)&&(s.x>d&&(r.x=Math.floor(d/ie.x),s.x=r.x*ie.x,W.mapSize.x=r.x),s.y>d&&(r.y=Math.floor(d/ie.y),s.y=r.y*ie.y,W.mapSize.y=r.y)),W.map===null||B===!0||H===!0){const be=this.type!==Nn?{minFilter:mn,magFilter:mn}:{};W.map!==null&&W.map.dispose(),W.map=new xi(s.x,s.y,be),W.map.texture.name=q.name+".shadowMap",W.camera.updateProjectionMatrix()}n.setRenderTarget(W.map),n.clear();const pe=W.getViewportCount();for(let be=0;be<pe;be++){const Oe=W.getViewport(be);a.set(r.x*Oe.x,r.y*Oe.y,r.x*Oe.z,r.y*Oe.w),I.viewport(a),W.updateMatrices(q,be),i=W.getFrustum(),g(S,A,W.camera,q,this.type)}W.isPointLightShadow!==!0&&this.type===Nn&&y(W,A),W.needsUpdate=!1}f=this.type,p.needsUpdate=!1,n.setRenderTarget(M,b,R)};function y(T,S){const A=e.update(x);h.defines.VSM_SAMPLES!==T.blurSamples&&(h.defines.VSM_SAMPLES=T.blurSamples,m.defines.VSM_SAMPLES=T.blurSamples,h.needsUpdate=!0,m.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new xi(s.x,s.y)),h.uniforms.shadow_pass.value=T.map.texture,h.uniforms.resolution.value=T.mapSize,h.uniforms.radius.value=T.radius,n.setRenderTarget(T.mapPass),n.clear(),n.renderBufferDirect(S,null,A,h,x,null),m.uniforms.shadow_pass.value=T.mapPass.texture,m.uniforms.resolution.value=T.mapSize,m.uniforms.radius.value=T.radius,n.setRenderTarget(T.map),n.clear(),n.renderBufferDirect(S,null,A,m,x,null)}function v(T,S,A,M){let b=null;const R=A.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(R!==void 0)b=R;else if(b=A.isPointLight===!0?l:o,n.localClippingEnabled&&S.clipShadows===!0&&Array.isArray(S.clippingPlanes)&&S.clippingPlanes.length!==0||S.displacementMap&&S.displacementScale!==0||S.alphaMap&&S.alphaTest>0||S.map&&S.alphaTest>0||S.alphaToCoverage===!0){const I=b.uuid,B=S.uuid;let H=c[I];H===void 0&&(H={},c[I]=H);let k=H[B];k===void 0&&(k=b.clone(),H[B]=k,S.addEventListener("dispose",E)),b=k}if(b.visible=S.visible,b.wireframe=S.wireframe,M===Nn?b.side=S.shadowSide!==null?S.shadowSide:S.side:b.side=S.shadowSide!==null?S.shadowSide:u[S.side],b.alphaMap=S.alphaMap,b.alphaTest=S.alphaToCoverage===!0?.5:S.alphaTest,b.map=S.map,b.clipShadows=S.clipShadows,b.clippingPlanes=S.clippingPlanes,b.clipIntersection=S.clipIntersection,b.displacementMap=S.displacementMap,b.displacementScale=S.displacementScale,b.displacementBias=S.displacementBias,b.wireframeLinewidth=S.wireframeLinewidth,b.linewidth=S.linewidth,A.isPointLight===!0&&b.isMeshDistanceMaterial===!0){const I=n.properties.get(b);I.light=A}return b}function g(T,S,A,M,b){if(T.visible===!1)return;if(T.layers.test(S.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&b===Nn)&&(!T.frustumCulled||i.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(A.matrixWorldInverse,T.matrixWorld);const B=e.update(T),H=T.material;if(Array.isArray(H)){const k=B.groups;for(let $=0,q=k.length;$<q;$++){const W=k[$],ie=H[W.materialIndex];if(ie&&ie.visible){const pe=v(T,ie,M,b);T.onBeforeShadow(n,T,S,A,B,pe,W),n.renderBufferDirect(A,null,B,pe,T,W),T.onAfterShadow(n,T,S,A,B,pe,W)}}}else if(H.visible){const k=v(T,H,M,b);T.onBeforeShadow(n,T,S,A,B,k,null),n.renderBufferDirect(A,null,B,k,T,null),T.onAfterShadow(n,T,S,A,B,k,null)}}const I=T.children;for(let B=0,H=I.length;B<H;B++)g(I[B],S,A,M,b)}function E(T){T.target.removeEventListener("dispose",E);for(const A in c){const M=c[A],b=T.target.uuid;b in M&&(M[b].dispose(),delete M[b])}}}const U_={[Aa]:Ca,[Ra]:Da,[Pa]:Ia,[Wi]:La,[Ca]:Aa,[Da]:Ra,[Ia]:Pa,[La]:Wi};function N_(n,e){function t(){let N=!1;const ce=new Tt;let fe=null;const Ee=new Tt(0,0,0,0);return{setMask:function(ae){fe!==ae&&!N&&(n.colorMask(ae,ae,ae,ae),fe=ae)},setLocked:function(ae){N=ae},setClear:function(ae,Q,Re,Ge,gt){gt===!0&&(ae*=Ge,Q*=Ge,Re*=Ge),ce.set(ae,Q,Re,Ge),Ee.equals(ce)===!1&&(n.clearColor(ae,Q,Re,Ge),Ee.copy(ce))},reset:function(){N=!1,fe=null,Ee.set(-1,0,0,0)}}}function i(){let N=!1,ce=!1,fe=null,Ee=null,ae=null;return{setReversed:function(Q){if(ce!==Q){const Re=e.get("EXT_clip_control");Q?Re.clipControlEXT(Re.LOWER_LEFT_EXT,Re.ZERO_TO_ONE_EXT):Re.clipControlEXT(Re.LOWER_LEFT_EXT,Re.NEGATIVE_ONE_TO_ONE_EXT),ce=Q;const Ge=ae;ae=null,this.setClear(Ge)}},getReversed:function(){return ce},setTest:function(Q){Q?ne(n.DEPTH_TEST):Se(n.DEPTH_TEST)},setMask:function(Q){fe!==Q&&!N&&(n.depthMask(Q),fe=Q)},setFunc:function(Q){if(ce&&(Q=U_[Q]),Ee!==Q){switch(Q){case Aa:n.depthFunc(n.NEVER);break;case Ca:n.depthFunc(n.ALWAYS);break;case Ra:n.depthFunc(n.LESS);break;case Wi:n.depthFunc(n.LEQUAL);break;case Pa:n.depthFunc(n.EQUAL);break;case La:n.depthFunc(n.GEQUAL);break;case Da:n.depthFunc(n.GREATER);break;case Ia:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}Ee=Q}},setLocked:function(Q){N=Q},setClear:function(Q){ae!==Q&&(ce&&(Q=1-Q),n.clearDepth(Q),ae=Q)},reset:function(){N=!1,fe=null,Ee=null,ae=null,ce=!1}}}function s(){let N=!1,ce=null,fe=null,Ee=null,ae=null,Q=null,Re=null,Ge=null,gt=null;return{setTest:function(nt){N||(nt?ne(n.STENCIL_TEST):Se(n.STENCIL_TEST))},setMask:function(nt){ce!==nt&&!N&&(n.stencilMask(nt),ce=nt)},setFunc:function(nt,Cn,vn){(fe!==nt||Ee!==Cn||ae!==vn)&&(n.stencilFunc(nt,Cn,vn),fe=nt,Ee=Cn,ae=vn)},setOp:function(nt,Cn,vn){(Q!==nt||Re!==Cn||Ge!==vn)&&(n.stencilOp(nt,Cn,vn),Q=nt,Re=Cn,Ge=vn)},setLocked:function(nt){N=nt},setClear:function(nt){gt!==nt&&(n.clearStencil(nt),gt=nt)},reset:function(){N=!1,ce=null,fe=null,Ee=null,ae=null,Q=null,Re=null,Ge=null,gt=null}}}const r=new t,a=new i,o=new s,l=new WeakMap,c=new WeakMap;let d={},u={},h=new WeakMap,m=[],_=null,x=!1,p=null,f=null,y=null,v=null,g=null,E=null,T=null,S=new Xe(0,0,0),A=0,M=!1,b=null,R=null,I=null,B=null,H=null;const k=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let $=!1,q=0;const W=n.getParameter(n.VERSION);W.indexOf("WebGL")!==-1?(q=parseFloat(/^WebGL (\d)/.exec(W)[1]),$=q>=1):W.indexOf("OpenGL ES")!==-1&&(q=parseFloat(/^OpenGL ES (\d)/.exec(W)[1]),$=q>=2);let ie=null,pe={};const be=n.getParameter(n.SCISSOR_BOX),Oe=n.getParameter(n.VIEWPORT),qe=new Tt().fromArray(be),Qe=new Tt().fromArray(Oe);function Ke(N,ce,fe,Ee){const ae=new Uint8Array(4),Q=n.createTexture();n.bindTexture(N,Q),n.texParameteri(N,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(N,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Re=0;Re<fe;Re++)N===n.TEXTURE_3D||N===n.TEXTURE_2D_ARRAY?n.texImage3D(ce,0,n.RGBA,1,1,Ee,0,n.RGBA,n.UNSIGNED_BYTE,ae):n.texImage2D(ce+Re,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,ae);return Q}const Y={};Y[n.TEXTURE_2D]=Ke(n.TEXTURE_2D,n.TEXTURE_2D,1),Y[n.TEXTURE_CUBE_MAP]=Ke(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),Y[n.TEXTURE_2D_ARRAY]=Ke(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),Y[n.TEXTURE_3D]=Ke(n.TEXTURE_3D,n.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),ne(n.DEPTH_TEST),a.setFunc(Wi),J(!1),Z(jo),ne(n.CULL_FACE),te(Zn);function ne(N){d[N]!==!0&&(n.enable(N),d[N]=!0)}function Se(N){d[N]!==!1&&(n.disable(N),d[N]=!1)}function De(N,ce){return u[N]!==ce?(n.bindFramebuffer(N,ce),u[N]=ce,N===n.DRAW_FRAMEBUFFER&&(u[n.FRAMEBUFFER]=ce),N===n.FRAMEBUFFER&&(u[n.DRAW_FRAMEBUFFER]=ce),!0):!1}function Te(N,ce){let fe=m,Ee=!1;if(N){fe=h.get(ce),fe===void 0&&(fe=[],h.set(ce,fe));const ae=N.textures;if(fe.length!==ae.length||fe[0]!==n.COLOR_ATTACHMENT0){for(let Q=0,Re=ae.length;Q<Re;Q++)fe[Q]=n.COLOR_ATTACHMENT0+Q;fe.length=ae.length,Ee=!0}}else fe[0]!==n.BACK&&(fe[0]=n.BACK,Ee=!0);Ee&&n.drawBuffers(fe)}function Ye(N){return _!==N?(n.useProgram(N),_=N,!0):!1}const mt={[fi]:n.FUNC_ADD,[su]:n.FUNC_SUBTRACT,[ru]:n.FUNC_REVERSE_SUBTRACT};mt[au]=n.MIN,mt[ou]=n.MAX;const D={[lu]:n.ZERO,[cu]:n.ONE,[du]:n.SRC_COLOR,[wa]:n.SRC_ALPHA,[gu]:n.SRC_ALPHA_SATURATE,[pu]:n.DST_COLOR,[hu]:n.DST_ALPHA,[uu]:n.ONE_MINUS_SRC_COLOR,[Ta]:n.ONE_MINUS_SRC_ALPHA,[mu]:n.ONE_MINUS_DST_COLOR,[fu]:n.ONE_MINUS_DST_ALPHA,[_u]:n.CONSTANT_COLOR,[vu]:n.ONE_MINUS_CONSTANT_COLOR,[xu]:n.CONSTANT_ALPHA,[yu]:n.ONE_MINUS_CONSTANT_ALPHA};function te(N,ce,fe,Ee,ae,Q,Re,Ge,gt,nt){if(N===Zn){x===!0&&(Se(n.BLEND),x=!1);return}if(x===!1&&(ne(n.BLEND),x=!0),N!==iu){if(N!==p||nt!==M){if((f!==fi||g!==fi)&&(n.blendEquation(n.FUNC_ADD),f=fi,g=fi),nt)switch(N){case Vi:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Xo:n.blendFunc(n.ONE,n.ONE);break;case qo:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Yo:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}else switch(N){case Vi:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Xo:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case qo:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Yo:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}y=null,v=null,E=null,T=null,S.set(0,0,0),A=0,p=N,M=nt}return}ae=ae||ce,Q=Q||fe,Re=Re||Ee,(ce!==f||ae!==g)&&(n.blendEquationSeparate(mt[ce],mt[ae]),f=ce,g=ae),(fe!==y||Ee!==v||Q!==E||Re!==T)&&(n.blendFuncSeparate(D[fe],D[Ee],D[Q],D[Re]),y=fe,v=Ee,E=Q,T=Re),(Ge.equals(S)===!1||gt!==A)&&(n.blendColor(Ge.r,Ge.g,Ge.b,gt),S.copy(Ge),A=gt),p=N,M=!1}function K(N,ce){N.side===fn?Se(n.CULL_FACE):ne(n.CULL_FACE);let fe=N.side===Jt;ce&&(fe=!fe),J(fe),N.blending===Vi&&N.transparent===!1?te(Zn):te(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.blendColor,N.blendAlpha,N.premultipliedAlpha),a.setFunc(N.depthFunc),a.setTest(N.depthTest),a.setMask(N.depthWrite),r.setMask(N.colorWrite);const Ee=N.stencilWrite;o.setTest(Ee),Ee&&(o.setMask(N.stencilWriteMask),o.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),o.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass)),se(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?ne(n.SAMPLE_ALPHA_TO_COVERAGE):Se(n.SAMPLE_ALPHA_TO_COVERAGE)}function J(N){b!==N&&(N?n.frontFace(n.CW):n.frontFace(n.CCW),b=N)}function Z(N){N!==eu?(ne(n.CULL_FACE),N!==R&&(N===jo?n.cullFace(n.BACK):N===tu?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):Se(n.CULL_FACE),R=N}function ue(N){N!==I&&($&&n.lineWidth(N),I=N)}function se(N,ce,fe){N?(ne(n.POLYGON_OFFSET_FILL),(B!==ce||H!==fe)&&(n.polygonOffset(ce,fe),B=ce,H=fe)):Se(n.POLYGON_OFFSET_FILL)}function he(N){N?ne(n.SCISSOR_TEST):Se(n.SCISSOR_TEST)}function He(N){N===void 0&&(N=n.TEXTURE0+k-1),ie!==N&&(n.activeTexture(N),ie=N)}function Be(N,ce,fe){fe===void 0&&(ie===null?fe=n.TEXTURE0+k-1:fe=ie);let Ee=pe[fe];Ee===void 0&&(Ee={type:void 0,texture:void 0},pe[fe]=Ee),(Ee.type!==N||Ee.texture!==ce)&&(ie!==fe&&(n.activeTexture(fe),ie=fe),n.bindTexture(N,ce||Y[N]),Ee.type=N,Ee.texture=ce)}function P(){const N=pe[ie];N!==void 0&&N.type!==void 0&&(n.bindTexture(N.type,null),N.type=void 0,N.texture=void 0)}function w(){try{n.compressedTexImage2D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function z(){try{n.compressedTexImage3D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function j(){try{n.texSubImage2D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function ee(){try{n.texSubImage3D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function X(){try{n.compressedTexSubImage2D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Pe(){try{n.compressedTexSubImage3D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function de(){try{n.texStorage2D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Ae(){try{n.texStorage3D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Ce(){try{n.texImage2D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function re(){try{n.texImage3D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function ve(N){qe.equals(N)===!1&&(n.scissor(N.x,N.y,N.z,N.w),qe.copy(N))}function Fe(N){Qe.equals(N)===!1&&(n.viewport(N.x,N.y,N.z,N.w),Qe.copy(N))}function Le(N,ce){let fe=c.get(ce);fe===void 0&&(fe=new WeakMap,c.set(ce,fe));let Ee=fe.get(N);Ee===void 0&&(Ee=n.getUniformBlockIndex(ce,N.name),fe.set(N,Ee))}function ge(N,ce){const Ee=c.get(ce).get(N);l.get(ce)!==Ee&&(n.uniformBlockBinding(ce,Ee,N.__bindingPointIndex),l.set(ce,Ee))}function Ve(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),a.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),d={},ie=null,pe={},u={},h=new WeakMap,m=[],_=null,x=!1,p=null,f=null,y=null,v=null,g=null,E=null,T=null,S=new Xe(0,0,0),A=0,M=!1,b=null,R=null,I=null,B=null,H=null,qe.set(0,0,n.canvas.width,n.canvas.height),Qe.set(0,0,n.canvas.width,n.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:ne,disable:Se,bindFramebuffer:De,drawBuffers:Te,useProgram:Ye,setBlending:te,setMaterial:K,setFlipSided:J,setCullFace:Z,setLineWidth:ue,setPolygonOffset:se,setScissorTest:he,activeTexture:He,bindTexture:Be,unbindTexture:P,compressedTexImage2D:w,compressedTexImage3D:z,texImage2D:Ce,texImage3D:re,updateUBOMapping:Le,uniformBlockBinding:ge,texStorage2D:de,texStorage3D:Ae,texSubImage2D:j,texSubImage3D:ee,compressedTexSubImage2D:X,compressedTexSubImage3D:Pe,scissor:ve,viewport:Fe,reset:Ve}}function F_(n,e,t,i,s,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new oe,d=new WeakMap;let u;const h=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function _(P,w){return m?new OffscreenCanvas(P,w):wr("canvas")}function x(P,w,z){let j=1;const ee=Be(P);if((ee.width>z||ee.height>z)&&(j=z/Math.max(ee.width,ee.height)),j<1)if(typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&P instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&P instanceof ImageBitmap||typeof VideoFrame<"u"&&P instanceof VideoFrame){const X=Math.floor(j*ee.width),Pe=Math.floor(j*ee.height);u===void 0&&(u=_(X,Pe));const de=w?_(X,Pe):u;return de.width=X,de.height=Pe,de.getContext("2d").drawImage(P,0,0,X,Pe),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ee.width+"x"+ee.height+") to ("+X+"x"+Pe+")."),de}else return"data"in P&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ee.width+"x"+ee.height+")."),P;return P}function p(P){return P.generateMipmaps}function f(P){n.generateMipmap(P)}function y(P){return P.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:P.isWebGL3DRenderTarget?n.TEXTURE_3D:P.isWebGLArrayRenderTarget||P.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function v(P,w,z,j,ee=!1){if(P!==null){if(n[P]!==void 0)return n[P];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+P+"'")}let X=w;if(w===n.RED&&(z===n.FLOAT&&(X=n.R32F),z===n.HALF_FLOAT&&(X=n.R16F),z===n.UNSIGNED_BYTE&&(X=n.R8)),w===n.RED_INTEGER&&(z===n.UNSIGNED_BYTE&&(X=n.R8UI),z===n.UNSIGNED_SHORT&&(X=n.R16UI),z===n.UNSIGNED_INT&&(X=n.R32UI),z===n.BYTE&&(X=n.R8I),z===n.SHORT&&(X=n.R16I),z===n.INT&&(X=n.R32I)),w===n.RG&&(z===n.FLOAT&&(X=n.RG32F),z===n.HALF_FLOAT&&(X=n.RG16F),z===n.UNSIGNED_BYTE&&(X=n.RG8)),w===n.RG_INTEGER&&(z===n.UNSIGNED_BYTE&&(X=n.RG8UI),z===n.UNSIGNED_SHORT&&(X=n.RG16UI),z===n.UNSIGNED_INT&&(X=n.RG32UI),z===n.BYTE&&(X=n.RG8I),z===n.SHORT&&(X=n.RG16I),z===n.INT&&(X=n.RG32I)),w===n.RGB_INTEGER&&(z===n.UNSIGNED_BYTE&&(X=n.RGB8UI),z===n.UNSIGNED_SHORT&&(X=n.RGB16UI),z===n.UNSIGNED_INT&&(X=n.RGB32UI),z===n.BYTE&&(X=n.RGB8I),z===n.SHORT&&(X=n.RGB16I),z===n.INT&&(X=n.RGB32I)),w===n.RGBA_INTEGER&&(z===n.UNSIGNED_BYTE&&(X=n.RGBA8UI),z===n.UNSIGNED_SHORT&&(X=n.RGBA16UI),z===n.UNSIGNED_INT&&(X=n.RGBA32UI),z===n.BYTE&&(X=n.RGBA8I),z===n.SHORT&&(X=n.RGBA16I),z===n.INT&&(X=n.RGBA32I)),w===n.RGB&&(z===n.UNSIGNED_INT_5_9_9_9_REV&&(X=n.RGB9_E5),z===n.UNSIGNED_INT_10F_11F_11F_REV&&(X=n.R11F_G11F_B10F)),w===n.RGBA){const Pe=ee?Sr:tt.getTransfer(j);z===n.FLOAT&&(X=n.RGBA32F),z===n.HALF_FLOAT&&(X=n.RGBA16F),z===n.UNSIGNED_BYTE&&(X=Pe===ot?n.SRGB8_ALPHA8:n.RGBA8),z===n.UNSIGNED_SHORT_4_4_4_4&&(X=n.RGBA4),z===n.UNSIGNED_SHORT_5_5_5_1&&(X=n.RGB5_A1)}return(X===n.R16F||X===n.R32F||X===n.RG16F||X===n.RG32F||X===n.RGBA16F||X===n.RGBA32F)&&e.get("EXT_color_buffer_float"),X}function g(P,w){let z;return P?w===null||w===vi||w===Ms?z=n.DEPTH24_STENCIL8:w===On?z=n.DEPTH32F_STENCIL8:w===bs&&(z=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):w===null||w===vi||w===Ms?z=n.DEPTH_COMPONENT24:w===On?z=n.DEPTH_COMPONENT32F:w===bs&&(z=n.DEPTH_COMPONENT16),z}function E(P,w){return p(P)===!0||P.isFramebufferTexture&&P.minFilter!==mn&&P.minFilter!==Sn?Math.log2(Math.max(w.width,w.height))+1:P.mipmaps!==void 0&&P.mipmaps.length>0?P.mipmaps.length:P.isCompressedTexture&&Array.isArray(P.image)?w.mipmaps.length:1}function T(P){const w=P.target;w.removeEventListener("dispose",T),A(w),w.isVideoTexture&&d.delete(w)}function S(P){const w=P.target;w.removeEventListener("dispose",S),b(w)}function A(P){const w=i.get(P);if(w.__webglInit===void 0)return;const z=P.source,j=h.get(z);if(j){const ee=j[w.__cacheKey];ee.usedTimes--,ee.usedTimes===0&&M(P),Object.keys(j).length===0&&h.delete(z)}i.remove(P)}function M(P){const w=i.get(P);n.deleteTexture(w.__webglTexture);const z=P.source,j=h.get(z);delete j[w.__cacheKey],a.memory.textures--}function b(P){const w=i.get(P);if(P.depthTexture&&(P.depthTexture.dispose(),i.remove(P.depthTexture)),P.isWebGLCubeRenderTarget)for(let j=0;j<6;j++){if(Array.isArray(w.__webglFramebuffer[j]))for(let ee=0;ee<w.__webglFramebuffer[j].length;ee++)n.deleteFramebuffer(w.__webglFramebuffer[j][ee]);else n.deleteFramebuffer(w.__webglFramebuffer[j]);w.__webglDepthbuffer&&n.deleteRenderbuffer(w.__webglDepthbuffer[j])}else{if(Array.isArray(w.__webglFramebuffer))for(let j=0;j<w.__webglFramebuffer.length;j++)n.deleteFramebuffer(w.__webglFramebuffer[j]);else n.deleteFramebuffer(w.__webglFramebuffer);if(w.__webglDepthbuffer&&n.deleteRenderbuffer(w.__webglDepthbuffer),w.__webglMultisampledFramebuffer&&n.deleteFramebuffer(w.__webglMultisampledFramebuffer),w.__webglColorRenderbuffer)for(let j=0;j<w.__webglColorRenderbuffer.length;j++)w.__webglColorRenderbuffer[j]&&n.deleteRenderbuffer(w.__webglColorRenderbuffer[j]);w.__webglDepthRenderbuffer&&n.deleteRenderbuffer(w.__webglDepthRenderbuffer)}const z=P.textures;for(let j=0,ee=z.length;j<ee;j++){const X=i.get(z[j]);X.__webglTexture&&(n.deleteTexture(X.__webglTexture),a.memory.textures--),i.remove(z[j])}i.remove(P)}let R=0;function I(){R=0}function B(){const P=R;return P>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+P+" texture units while this GPU supports only "+s.maxTextures),R+=1,P}function H(P){const w=[];return w.push(P.wrapS),w.push(P.wrapT),w.push(P.wrapR||0),w.push(P.magFilter),w.push(P.minFilter),w.push(P.anisotropy),w.push(P.internalFormat),w.push(P.format),w.push(P.type),w.push(P.generateMipmaps),w.push(P.premultiplyAlpha),w.push(P.flipY),w.push(P.unpackAlignment),w.push(P.colorSpace),w.join()}function k(P,w){const z=i.get(P);if(P.isVideoTexture&&he(P),P.isRenderTargetTexture===!1&&P.isExternalTexture!==!0&&P.version>0&&z.__version!==P.version){const j=P.image;if(j===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(j.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Y(z,P,w);return}}else P.isExternalTexture&&(z.__webglTexture=P.sourceTexture?P.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,z.__webglTexture,n.TEXTURE0+w)}function $(P,w){const z=i.get(P);if(P.isRenderTargetTexture===!1&&P.version>0&&z.__version!==P.version){Y(z,P,w);return}t.bindTexture(n.TEXTURE_2D_ARRAY,z.__webglTexture,n.TEXTURE0+w)}function q(P,w){const z=i.get(P);if(P.isRenderTargetTexture===!1&&P.version>0&&z.__version!==P.version){Y(z,P,w);return}t.bindTexture(n.TEXTURE_3D,z.__webglTexture,n.TEXTURE0+w)}function W(P,w){const z=i.get(P);if(P.version>0&&z.__version!==P.version){ne(z,P,w);return}t.bindTexture(n.TEXTURE_CUBE_MAP,z.__webglTexture,n.TEXTURE0+w)}const ie={[Fa]:n.REPEAT,[gi]:n.CLAMP_TO_EDGE,[Oa]:n.MIRRORED_REPEAT},pe={[mn]:n.NEAREST,[Pu]:n.NEAREST_MIPMAP_NEAREST,[Os]:n.NEAREST_MIPMAP_LINEAR,[Sn]:n.LINEAR,[zr]:n.LINEAR_MIPMAP_NEAREST,[_i]:n.LINEAR_MIPMAP_LINEAR},be={[Uu]:n.NEVER,[ku]:n.ALWAYS,[Nu]:n.LESS,[Lc]:n.LEQUAL,[Fu]:n.EQUAL,[Bu]:n.GEQUAL,[Ou]:n.GREATER,[zu]:n.NOTEQUAL};function Oe(P,w){if(w.type===On&&e.has("OES_texture_float_linear")===!1&&(w.magFilter===Sn||w.magFilter===zr||w.magFilter===Os||w.magFilter===_i||w.minFilter===Sn||w.minFilter===zr||w.minFilter===Os||w.minFilter===_i)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(P,n.TEXTURE_WRAP_S,ie[w.wrapS]),n.texParameteri(P,n.TEXTURE_WRAP_T,ie[w.wrapT]),(P===n.TEXTURE_3D||P===n.TEXTURE_2D_ARRAY)&&n.texParameteri(P,n.TEXTURE_WRAP_R,ie[w.wrapR]),n.texParameteri(P,n.TEXTURE_MAG_FILTER,pe[w.magFilter]),n.texParameteri(P,n.TEXTURE_MIN_FILTER,pe[w.minFilter]),w.compareFunction&&(n.texParameteri(P,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(P,n.TEXTURE_COMPARE_FUNC,be[w.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(w.magFilter===mn||w.minFilter!==Os&&w.minFilter!==_i||w.type===On&&e.has("OES_texture_float_linear")===!1)return;if(w.anisotropy>1||i.get(w).__currentAnisotropy){const z=e.get("EXT_texture_filter_anisotropic");n.texParameterf(P,z.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(w.anisotropy,s.getMaxAnisotropy())),i.get(w).__currentAnisotropy=w.anisotropy}}}function qe(P,w){let z=!1;P.__webglInit===void 0&&(P.__webglInit=!0,w.addEventListener("dispose",T));const j=w.source;let ee=h.get(j);ee===void 0&&(ee={},h.set(j,ee));const X=H(w);if(X!==P.__cacheKey){ee[X]===void 0&&(ee[X]={texture:n.createTexture(),usedTimes:0},a.memory.textures++,z=!0),ee[X].usedTimes++;const Pe=ee[P.__cacheKey];Pe!==void 0&&(ee[P.__cacheKey].usedTimes--,Pe.usedTimes===0&&M(w)),P.__cacheKey=X,P.__webglTexture=ee[X].texture}return z}function Qe(P,w,z){return Math.floor(Math.floor(P/z)/w)}function Ke(P,w,z,j){const X=P.updateRanges;if(X.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,w.width,w.height,z,j,w.data);else{X.sort((re,ve)=>re.start-ve.start);let Pe=0;for(let re=1;re<X.length;re++){const ve=X[Pe],Fe=X[re],Le=ve.start+ve.count,ge=Qe(Fe.start,w.width,4),Ve=Qe(ve.start,w.width,4);Fe.start<=Le+1&&ge===Ve&&Qe(Fe.start+Fe.count-1,w.width,4)===ge?ve.count=Math.max(ve.count,Fe.start+Fe.count-ve.start):(++Pe,X[Pe]=Fe)}X.length=Pe+1;const de=n.getParameter(n.UNPACK_ROW_LENGTH),Ae=n.getParameter(n.UNPACK_SKIP_PIXELS),Ce=n.getParameter(n.UNPACK_SKIP_ROWS);n.pixelStorei(n.UNPACK_ROW_LENGTH,w.width);for(let re=0,ve=X.length;re<ve;re++){const Fe=X[re],Le=Math.floor(Fe.start/4),ge=Math.ceil(Fe.count/4),Ve=Le%w.width,N=Math.floor(Le/w.width),ce=ge,fe=1;n.pixelStorei(n.UNPACK_SKIP_PIXELS,Ve),n.pixelStorei(n.UNPACK_SKIP_ROWS,N),t.texSubImage2D(n.TEXTURE_2D,0,Ve,N,ce,fe,z,j,w.data)}P.clearUpdateRanges(),n.pixelStorei(n.UNPACK_ROW_LENGTH,de),n.pixelStorei(n.UNPACK_SKIP_PIXELS,Ae),n.pixelStorei(n.UNPACK_SKIP_ROWS,Ce)}}function Y(P,w,z){let j=n.TEXTURE_2D;(w.isDataArrayTexture||w.isCompressedArrayTexture)&&(j=n.TEXTURE_2D_ARRAY),w.isData3DTexture&&(j=n.TEXTURE_3D);const ee=qe(P,w),X=w.source;t.bindTexture(j,P.__webglTexture,n.TEXTURE0+z);const Pe=i.get(X);if(X.version!==Pe.__version||ee===!0){t.activeTexture(n.TEXTURE0+z);const de=tt.getPrimaries(tt.workingColorSpace),Ae=w.colorSpace===Yn?null:tt.getPrimaries(w.colorSpace),Ce=w.colorSpace===Yn||de===Ae?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,w.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,w.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ce);let re=x(w.image,!1,s.maxTextureSize);re=He(w,re);const ve=r.convert(w.format,w.colorSpace),Fe=r.convert(w.type);let Le=v(w.internalFormat,ve,Fe,w.colorSpace,w.isVideoTexture);Oe(j,w);let ge;const Ve=w.mipmaps,N=w.isVideoTexture!==!0,ce=Pe.__version===void 0||ee===!0,fe=X.dataReady,Ee=E(w,re);if(w.isDepthTexture)Le=g(w.format===Es,w.type),ce&&(N?t.texStorage2D(n.TEXTURE_2D,1,Le,re.width,re.height):t.texImage2D(n.TEXTURE_2D,0,Le,re.width,re.height,0,ve,Fe,null));else if(w.isDataTexture)if(Ve.length>0){N&&ce&&t.texStorage2D(n.TEXTURE_2D,Ee,Le,Ve[0].width,Ve[0].height);for(let ae=0,Q=Ve.length;ae<Q;ae++)ge=Ve[ae],N?fe&&t.texSubImage2D(n.TEXTURE_2D,ae,0,0,ge.width,ge.height,ve,Fe,ge.data):t.texImage2D(n.TEXTURE_2D,ae,Le,ge.width,ge.height,0,ve,Fe,ge.data);w.generateMipmaps=!1}else N?(ce&&t.texStorage2D(n.TEXTURE_2D,Ee,Le,re.width,re.height),fe&&Ke(w,re,ve,Fe)):t.texImage2D(n.TEXTURE_2D,0,Le,re.width,re.height,0,ve,Fe,re.data);else if(w.isCompressedTexture)if(w.isCompressedArrayTexture){N&&ce&&t.texStorage3D(n.TEXTURE_2D_ARRAY,Ee,Le,Ve[0].width,Ve[0].height,re.depth);for(let ae=0,Q=Ve.length;ae<Q;ae++)if(ge=Ve[ae],w.format!==pn)if(ve!==null)if(N){if(fe)if(w.layerUpdates.size>0){const Re=Rl(ge.width,ge.height,w.format,w.type);for(const Ge of w.layerUpdates){const gt=ge.data.subarray(Ge*Re/ge.data.BYTES_PER_ELEMENT,(Ge+1)*Re/ge.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,ae,0,0,Ge,ge.width,ge.height,1,ve,gt)}w.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,ae,0,0,0,ge.width,ge.height,re.depth,ve,ge.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,ae,Le,ge.width,ge.height,re.depth,0,ge.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else N?fe&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,ae,0,0,0,ge.width,ge.height,re.depth,ve,Fe,ge.data):t.texImage3D(n.TEXTURE_2D_ARRAY,ae,Le,ge.width,ge.height,re.depth,0,ve,Fe,ge.data)}else{N&&ce&&t.texStorage2D(n.TEXTURE_2D,Ee,Le,Ve[0].width,Ve[0].height);for(let ae=0,Q=Ve.length;ae<Q;ae++)ge=Ve[ae],w.format!==pn?ve!==null?N?fe&&t.compressedTexSubImage2D(n.TEXTURE_2D,ae,0,0,ge.width,ge.height,ve,ge.data):t.compressedTexImage2D(n.TEXTURE_2D,ae,Le,ge.width,ge.height,0,ge.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):N?fe&&t.texSubImage2D(n.TEXTURE_2D,ae,0,0,ge.width,ge.height,ve,Fe,ge.data):t.texImage2D(n.TEXTURE_2D,ae,Le,ge.width,ge.height,0,ve,Fe,ge.data)}else if(w.isDataArrayTexture)if(N){if(ce&&t.texStorage3D(n.TEXTURE_2D_ARRAY,Ee,Le,re.width,re.height,re.depth),fe)if(w.layerUpdates.size>0){const ae=Rl(re.width,re.height,w.format,w.type);for(const Q of w.layerUpdates){const Re=re.data.subarray(Q*ae/re.data.BYTES_PER_ELEMENT,(Q+1)*ae/re.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,Q,re.width,re.height,1,ve,Fe,Re)}w.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,re.width,re.height,re.depth,ve,Fe,re.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,Le,re.width,re.height,re.depth,0,ve,Fe,re.data);else if(w.isData3DTexture)N?(ce&&t.texStorage3D(n.TEXTURE_3D,Ee,Le,re.width,re.height,re.depth),fe&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,re.width,re.height,re.depth,ve,Fe,re.data)):t.texImage3D(n.TEXTURE_3D,0,Le,re.width,re.height,re.depth,0,ve,Fe,re.data);else if(w.isFramebufferTexture){if(ce)if(N)t.texStorage2D(n.TEXTURE_2D,Ee,Le,re.width,re.height);else{let ae=re.width,Q=re.height;for(let Re=0;Re<Ee;Re++)t.texImage2D(n.TEXTURE_2D,Re,Le,ae,Q,0,ve,Fe,null),ae>>=1,Q>>=1}}else if(Ve.length>0){if(N&&ce){const ae=Be(Ve[0]);t.texStorage2D(n.TEXTURE_2D,Ee,Le,ae.width,ae.height)}for(let ae=0,Q=Ve.length;ae<Q;ae++)ge=Ve[ae],N?fe&&t.texSubImage2D(n.TEXTURE_2D,ae,0,0,ve,Fe,ge):t.texImage2D(n.TEXTURE_2D,ae,Le,ve,Fe,ge);w.generateMipmaps=!1}else if(N){if(ce){const ae=Be(re);t.texStorage2D(n.TEXTURE_2D,Ee,Le,ae.width,ae.height)}fe&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,ve,Fe,re)}else t.texImage2D(n.TEXTURE_2D,0,Le,ve,Fe,re);p(w)&&f(j),Pe.__version=X.version,w.onUpdate&&w.onUpdate(w)}P.__version=w.version}function ne(P,w,z){if(w.image.length!==6)return;const j=qe(P,w),ee=w.source;t.bindTexture(n.TEXTURE_CUBE_MAP,P.__webglTexture,n.TEXTURE0+z);const X=i.get(ee);if(ee.version!==X.__version||j===!0){t.activeTexture(n.TEXTURE0+z);const Pe=tt.getPrimaries(tt.workingColorSpace),de=w.colorSpace===Yn?null:tt.getPrimaries(w.colorSpace),Ae=w.colorSpace===Yn||Pe===de?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,w.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,w.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ae);const Ce=w.isCompressedTexture||w.image[0].isCompressedTexture,re=w.image[0]&&w.image[0].isDataTexture,ve=[];for(let Q=0;Q<6;Q++)!Ce&&!re?ve[Q]=x(w.image[Q],!0,s.maxCubemapSize):ve[Q]=re?w.image[Q].image:w.image[Q],ve[Q]=He(w,ve[Q]);const Fe=ve[0],Le=r.convert(w.format,w.colorSpace),ge=r.convert(w.type),Ve=v(w.internalFormat,Le,ge,w.colorSpace),N=w.isVideoTexture!==!0,ce=X.__version===void 0||j===!0,fe=ee.dataReady;let Ee=E(w,Fe);Oe(n.TEXTURE_CUBE_MAP,w);let ae;if(Ce){N&&ce&&t.texStorage2D(n.TEXTURE_CUBE_MAP,Ee,Ve,Fe.width,Fe.height);for(let Q=0;Q<6;Q++){ae=ve[Q].mipmaps;for(let Re=0;Re<ae.length;Re++){const Ge=ae[Re];w.format!==pn?Le!==null?N?fe&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Re,0,0,Ge.width,Ge.height,Le,Ge.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Re,Ve,Ge.width,Ge.height,0,Ge.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):N?fe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Re,0,0,Ge.width,Ge.height,Le,ge,Ge.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Re,Ve,Ge.width,Ge.height,0,Le,ge,Ge.data)}}}else{if(ae=w.mipmaps,N&&ce){ae.length>0&&Ee++;const Q=Be(ve[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,Ee,Ve,Q.width,Q.height)}for(let Q=0;Q<6;Q++)if(re){N?fe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,0,0,ve[Q].width,ve[Q].height,Le,ge,ve[Q].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,Ve,ve[Q].width,ve[Q].height,0,Le,ge,ve[Q].data);for(let Re=0;Re<ae.length;Re++){const gt=ae[Re].image[Q].image;N?fe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Re+1,0,0,gt.width,gt.height,Le,ge,gt.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Re+1,Ve,gt.width,gt.height,0,Le,ge,gt.data)}}else{N?fe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,0,0,Le,ge,ve[Q]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,Ve,Le,ge,ve[Q]);for(let Re=0;Re<ae.length;Re++){const Ge=ae[Re];N?fe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Re+1,0,0,Le,ge,Ge.image[Q]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Re+1,Ve,Le,ge,Ge.image[Q])}}}p(w)&&f(n.TEXTURE_CUBE_MAP),X.__version=ee.version,w.onUpdate&&w.onUpdate(w)}P.__version=w.version}function Se(P,w,z,j,ee,X){const Pe=r.convert(z.format,z.colorSpace),de=r.convert(z.type),Ae=v(z.internalFormat,Pe,de,z.colorSpace),Ce=i.get(w),re=i.get(z);if(re.__renderTarget=w,!Ce.__hasExternalTextures){const ve=Math.max(1,w.width>>X),Fe=Math.max(1,w.height>>X);ee===n.TEXTURE_3D||ee===n.TEXTURE_2D_ARRAY?t.texImage3D(ee,X,Ae,ve,Fe,w.depth,0,Pe,de,null):t.texImage2D(ee,X,Ae,ve,Fe,0,Pe,de,null)}t.bindFramebuffer(n.FRAMEBUFFER,P),se(w)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,j,ee,re.__webglTexture,0,ue(w)):(ee===n.TEXTURE_2D||ee>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&ee<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,j,ee,re.__webglTexture,X),t.bindFramebuffer(n.FRAMEBUFFER,null)}function De(P,w,z){if(n.bindRenderbuffer(n.RENDERBUFFER,P),w.depthBuffer){const j=w.depthTexture,ee=j&&j.isDepthTexture?j.type:null,X=g(w.stencilBuffer,ee),Pe=w.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,de=ue(w);se(w)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,de,X,w.width,w.height):z?n.renderbufferStorageMultisample(n.RENDERBUFFER,de,X,w.width,w.height):n.renderbufferStorage(n.RENDERBUFFER,X,w.width,w.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,Pe,n.RENDERBUFFER,P)}else{const j=w.textures;for(let ee=0;ee<j.length;ee++){const X=j[ee],Pe=r.convert(X.format,X.colorSpace),de=r.convert(X.type),Ae=v(X.internalFormat,Pe,de,X.colorSpace),Ce=ue(w);z&&se(w)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Ce,Ae,w.width,w.height):se(w)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Ce,Ae,w.width,w.height):n.renderbufferStorage(n.RENDERBUFFER,Ae,w.width,w.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function Te(P,w){if(w&&w.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(n.FRAMEBUFFER,P),!(w.depthTexture&&w.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const j=i.get(w.depthTexture);j.__renderTarget=w,(!j.__webglTexture||w.depthTexture.image.width!==w.width||w.depthTexture.image.height!==w.height)&&(w.depthTexture.image.width=w.width,w.depthTexture.image.height=w.height,w.depthTexture.needsUpdate=!0),k(w.depthTexture,0);const ee=j.__webglTexture,X=ue(w);if(w.depthTexture.format===Ss)se(w)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,ee,0,X):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,ee,0);else if(w.depthTexture.format===Es)se(w)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,ee,0,X):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,ee,0);else throw new Error("Unknown depthTexture format")}function Ye(P){const w=i.get(P),z=P.isWebGLCubeRenderTarget===!0;if(w.__boundDepthTexture!==P.depthTexture){const j=P.depthTexture;if(w.__depthDisposeCallback&&w.__depthDisposeCallback(),j){const ee=()=>{delete w.__boundDepthTexture,delete w.__depthDisposeCallback,j.removeEventListener("dispose",ee)};j.addEventListener("dispose",ee),w.__depthDisposeCallback=ee}w.__boundDepthTexture=j}if(P.depthTexture&&!w.__autoAllocateDepthBuffer){if(z)throw new Error("target.depthTexture not supported in Cube render targets");const j=P.texture.mipmaps;j&&j.length>0?Te(w.__webglFramebuffer[0],P):Te(w.__webglFramebuffer,P)}else if(z){w.__webglDepthbuffer=[];for(let j=0;j<6;j++)if(t.bindFramebuffer(n.FRAMEBUFFER,w.__webglFramebuffer[j]),w.__webglDepthbuffer[j]===void 0)w.__webglDepthbuffer[j]=n.createRenderbuffer(),De(w.__webglDepthbuffer[j],P,!1);else{const ee=P.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,X=w.__webglDepthbuffer[j];n.bindRenderbuffer(n.RENDERBUFFER,X),n.framebufferRenderbuffer(n.FRAMEBUFFER,ee,n.RENDERBUFFER,X)}}else{const j=P.texture.mipmaps;if(j&&j.length>0?t.bindFramebuffer(n.FRAMEBUFFER,w.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,w.__webglFramebuffer),w.__webglDepthbuffer===void 0)w.__webglDepthbuffer=n.createRenderbuffer(),De(w.__webglDepthbuffer,P,!1);else{const ee=P.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,X=w.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,X),n.framebufferRenderbuffer(n.FRAMEBUFFER,ee,n.RENDERBUFFER,X)}}t.bindFramebuffer(n.FRAMEBUFFER,null)}function mt(P,w,z){const j=i.get(P);w!==void 0&&Se(j.__webglFramebuffer,P,P.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),z!==void 0&&Ye(P)}function D(P){const w=P.texture,z=i.get(P),j=i.get(w);P.addEventListener("dispose",S);const ee=P.textures,X=P.isWebGLCubeRenderTarget===!0,Pe=ee.length>1;if(Pe||(j.__webglTexture===void 0&&(j.__webglTexture=n.createTexture()),j.__version=w.version,a.memory.textures++),X){z.__webglFramebuffer=[];for(let de=0;de<6;de++)if(w.mipmaps&&w.mipmaps.length>0){z.__webglFramebuffer[de]=[];for(let Ae=0;Ae<w.mipmaps.length;Ae++)z.__webglFramebuffer[de][Ae]=n.createFramebuffer()}else z.__webglFramebuffer[de]=n.createFramebuffer()}else{if(w.mipmaps&&w.mipmaps.length>0){z.__webglFramebuffer=[];for(let de=0;de<w.mipmaps.length;de++)z.__webglFramebuffer[de]=n.createFramebuffer()}else z.__webglFramebuffer=n.createFramebuffer();if(Pe)for(let de=0,Ae=ee.length;de<Ae;de++){const Ce=i.get(ee[de]);Ce.__webglTexture===void 0&&(Ce.__webglTexture=n.createTexture(),a.memory.textures++)}if(P.samples>0&&se(P)===!1){z.__webglMultisampledFramebuffer=n.createFramebuffer(),z.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,z.__webglMultisampledFramebuffer);for(let de=0;de<ee.length;de++){const Ae=ee[de];z.__webglColorRenderbuffer[de]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,z.__webglColorRenderbuffer[de]);const Ce=r.convert(Ae.format,Ae.colorSpace),re=r.convert(Ae.type),ve=v(Ae.internalFormat,Ce,re,Ae.colorSpace,P.isXRRenderTarget===!0),Fe=ue(P);n.renderbufferStorageMultisample(n.RENDERBUFFER,Fe,ve,P.width,P.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+de,n.RENDERBUFFER,z.__webglColorRenderbuffer[de])}n.bindRenderbuffer(n.RENDERBUFFER,null),P.depthBuffer&&(z.__webglDepthRenderbuffer=n.createRenderbuffer(),De(z.__webglDepthRenderbuffer,P,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(X){t.bindTexture(n.TEXTURE_CUBE_MAP,j.__webglTexture),Oe(n.TEXTURE_CUBE_MAP,w);for(let de=0;de<6;de++)if(w.mipmaps&&w.mipmaps.length>0)for(let Ae=0;Ae<w.mipmaps.length;Ae++)Se(z.__webglFramebuffer[de][Ae],P,w,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+de,Ae);else Se(z.__webglFramebuffer[de],P,w,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+de,0);p(w)&&f(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Pe){for(let de=0,Ae=ee.length;de<Ae;de++){const Ce=ee[de],re=i.get(Ce);let ve=n.TEXTURE_2D;(P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(ve=P.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(ve,re.__webglTexture),Oe(ve,Ce),Se(z.__webglFramebuffer,P,Ce,n.COLOR_ATTACHMENT0+de,ve,0),p(Ce)&&f(ve)}t.unbindTexture()}else{let de=n.TEXTURE_2D;if((P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(de=P.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(de,j.__webglTexture),Oe(de,w),w.mipmaps&&w.mipmaps.length>0)for(let Ae=0;Ae<w.mipmaps.length;Ae++)Se(z.__webglFramebuffer[Ae],P,w,n.COLOR_ATTACHMENT0,de,Ae);else Se(z.__webglFramebuffer,P,w,n.COLOR_ATTACHMENT0,de,0);p(w)&&f(de),t.unbindTexture()}P.depthBuffer&&Ye(P)}function te(P){const w=P.textures;for(let z=0,j=w.length;z<j;z++){const ee=w[z];if(p(ee)){const X=y(P),Pe=i.get(ee).__webglTexture;t.bindTexture(X,Pe),f(X),t.unbindTexture()}}}const K=[],J=[];function Z(P){if(P.samples>0){if(se(P)===!1){const w=P.textures,z=P.width,j=P.height;let ee=n.COLOR_BUFFER_BIT;const X=P.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Pe=i.get(P),de=w.length>1;if(de)for(let Ce=0;Ce<w.length;Ce++)t.bindFramebuffer(n.FRAMEBUFFER,Pe.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ce,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,Pe.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ce,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,Pe.__webglMultisampledFramebuffer);const Ae=P.texture.mipmaps;Ae&&Ae.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Pe.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Pe.__webglFramebuffer);for(let Ce=0;Ce<w.length;Ce++){if(P.resolveDepthBuffer&&(P.depthBuffer&&(ee|=n.DEPTH_BUFFER_BIT),P.stencilBuffer&&P.resolveStencilBuffer&&(ee|=n.STENCIL_BUFFER_BIT)),de){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,Pe.__webglColorRenderbuffer[Ce]);const re=i.get(w[Ce]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,re,0)}n.blitFramebuffer(0,0,z,j,0,0,z,j,ee,n.NEAREST),l===!0&&(K.length=0,J.length=0,K.push(n.COLOR_ATTACHMENT0+Ce),P.depthBuffer&&P.resolveDepthBuffer===!1&&(K.push(X),J.push(X),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,J)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,K))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),de)for(let Ce=0;Ce<w.length;Ce++){t.bindFramebuffer(n.FRAMEBUFFER,Pe.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ce,n.RENDERBUFFER,Pe.__webglColorRenderbuffer[Ce]);const re=i.get(w[Ce]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,Pe.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ce,n.TEXTURE_2D,re,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Pe.__webglMultisampledFramebuffer)}else if(P.depthBuffer&&P.resolveDepthBuffer===!1&&l){const w=P.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[w])}}}function ue(P){return Math.min(s.maxSamples,P.samples)}function se(P){const w=i.get(P);return P.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&w.__useRenderToTexture!==!1}function he(P){const w=a.render.frame;d.get(P)!==w&&(d.set(P,w),P.update())}function He(P,w){const z=P.colorSpace,j=P.format,ee=P.type;return P.isCompressedTexture===!0||P.isVideoTexture===!0||z!==qi&&z!==Yn&&(tt.getTransfer(z)===ot?(j!==pn||ee!==Tn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",z)),w}function Be(P){return typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement?(c.width=P.naturalWidth||P.width,c.height=P.naturalHeight||P.height):typeof VideoFrame<"u"&&P instanceof VideoFrame?(c.width=P.displayWidth,c.height=P.displayHeight):(c.width=P.width,c.height=P.height),c}this.allocateTextureUnit=B,this.resetTextureUnits=I,this.setTexture2D=k,this.setTexture2DArray=$,this.setTexture3D=q,this.setTextureCube=W,this.rebindTextures=mt,this.setupRenderTarget=D,this.updateRenderTargetMipmap=te,this.updateMultisampleRenderTarget=Z,this.setupDepthRenderbuffer=Ye,this.setupFrameBufferTexture=Se,this.useMultisampledRTT=se}function O_(n,e){function t(i,s=Yn){let r;const a=tt.getTransfer(s);if(i===Tn)return n.UNSIGNED_BYTE;if(i===Eo)return n.UNSIGNED_SHORT_4_4_4_4;if(i===wo)return n.UNSIGNED_SHORT_5_5_5_1;if(i===Ec)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===wc)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===Mc)return n.BYTE;if(i===Sc)return n.SHORT;if(i===bs)return n.UNSIGNED_SHORT;if(i===So)return n.INT;if(i===vi)return n.UNSIGNED_INT;if(i===On)return n.FLOAT;if(i===Rs)return n.HALF_FLOAT;if(i===Tc)return n.ALPHA;if(i===Ac)return n.RGB;if(i===pn)return n.RGBA;if(i===Ss)return n.DEPTH_COMPONENT;if(i===Es)return n.DEPTH_STENCIL;if(i===Cc)return n.RED;if(i===To)return n.RED_INTEGER;if(i===Rc)return n.RG;if(i===Ao)return n.RG_INTEGER;if(i===Co)return n.RGBA_INTEGER;if(i===gr||i===_r||i===vr||i===xr)if(a===ot)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===gr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===_r)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===vr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===xr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===gr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===_r)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===vr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===xr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===za||i===Ba||i===ka||i===Ha)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===za)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Ba)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===ka)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Ha)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Ga||i===Va||i===$a)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(i===Ga||i===Va)return a===ot?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===$a)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===Wa||i===ja||i===Xa||i===qa||i===Ya||i===Za||i===Ja||i===Ka||i===Qa||i===eo||i===to||i===no||i===io||i===so)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(i===Wa)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===ja)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Xa)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===qa)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Ya)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Za)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Ja)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Ka)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Qa)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===eo)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===to)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===no)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===io)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===so)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===ro||i===ao||i===oo)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(i===ro)return a===ot?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===ao)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===oo)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===lo||i===co||i===uo||i===ho)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(i===lo)return r.COMPRESSED_RED_RGTC1_EXT;if(i===co)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===uo)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===ho)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Ms?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}const z_=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,B_=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class k_{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const i=new Hc(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new Qn({vertexShader:z_,fragmentShader:B_,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new ye(new Ls(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class H_ extends bi{constructor(e,t){super();const i=this;let s=null,r=1,a=null,o="local-floor",l=1,c=null,d=null,u=null,h=null,m=null,_=null;const x=typeof XRWebGLBinding<"u",p=new k_,f={},y=t.getContextAttributes();let v=null,g=null;const E=[],T=[],S=new oe;let A=null;const M=new ln;M.viewport=new Tt;const b=new ln;b.viewport=new Tt;const R=[M,b],I=new af;let B=null,H=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let ne=E[Y];return ne===void 0&&(ne=new aa,E[Y]=ne),ne.getTargetRaySpace()},this.getControllerGrip=function(Y){let ne=E[Y];return ne===void 0&&(ne=new aa,E[Y]=ne),ne.getGripSpace()},this.getHand=function(Y){let ne=E[Y];return ne===void 0&&(ne=new aa,E[Y]=ne),ne.getHandSpace()};function k(Y){const ne=T.indexOf(Y.inputSource);if(ne===-1)return;const Se=E[ne];Se!==void 0&&(Se.update(Y.inputSource,Y.frame,c||a),Se.dispatchEvent({type:Y.type,data:Y.inputSource}))}function $(){s.removeEventListener("select",k),s.removeEventListener("selectstart",k),s.removeEventListener("selectend",k),s.removeEventListener("squeeze",k),s.removeEventListener("squeezestart",k),s.removeEventListener("squeezeend",k),s.removeEventListener("end",$),s.removeEventListener("inputsourceschange",q);for(let Y=0;Y<E.length;Y++){const ne=T[Y];ne!==null&&(T[Y]=null,E[Y].disconnect(ne))}B=null,H=null,p.reset();for(const Y in f)delete f[Y];e.setRenderTarget(v),m=null,h=null,u=null,s=null,g=null,Ke.stop(),i.isPresenting=!1,e.setPixelRatio(A),e.setSize(S.width,S.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){r=Y,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){o=Y,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(Y){c=Y},this.getBaseLayer=function(){return h!==null?h:m},this.getBinding=function(){return u===null&&x&&(u=new XRWebGLBinding(s,t)),u},this.getFrame=function(){return _},this.getSession=function(){return s},this.setSession=async function(Y){if(s=Y,s!==null){if(v=e.getRenderTarget(),s.addEventListener("select",k),s.addEventListener("selectstart",k),s.addEventListener("selectend",k),s.addEventListener("squeeze",k),s.addEventListener("squeezestart",k),s.addEventListener("squeezeend",k),s.addEventListener("end",$),s.addEventListener("inputsourceschange",q),y.xrCompatible!==!0&&await t.makeXRCompatible(),A=e.getPixelRatio(),e.getSize(S),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let Se=null,De=null,Te=null;y.depth&&(Te=y.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Se=y.stencil?Es:Ss,De=y.stencil?Ms:vi);const Ye={colorFormat:t.RGBA8,depthFormat:Te,scaleFactor:r};u=this.getBinding(),h=u.createProjectionLayer(Ye),s.updateRenderState({layers:[h]}),e.setPixelRatio(1),e.setSize(h.textureWidth,h.textureHeight,!1),g=new xi(h.textureWidth,h.textureHeight,{format:pn,type:Tn,depthTexture:new kc(h.textureWidth,h.textureHeight,De,void 0,void 0,void 0,void 0,void 0,void 0,Se),stencilBuffer:y.stencil,colorSpace:e.outputColorSpace,samples:y.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1})}else{const Se={antialias:y.antialias,alpha:!0,depth:y.depth,stencil:y.stencil,framebufferScaleFactor:r};m=new XRWebGLLayer(s,t,Se),s.updateRenderState({baseLayer:m}),e.setPixelRatio(1),e.setSize(m.framebufferWidth,m.framebufferHeight,!1),g=new xi(m.framebufferWidth,m.framebufferHeight,{format:pn,type:Tn,colorSpace:e.outputColorSpace,stencilBuffer:y.stencil,resolveDepthBuffer:m.ignoreDepthValues===!1,resolveStencilBuffer:m.ignoreDepthValues===!1})}g.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),Ke.setContext(s),Ke.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return p.getDepthTexture()};function q(Y){for(let ne=0;ne<Y.removed.length;ne++){const Se=Y.removed[ne],De=T.indexOf(Se);De>=0&&(T[De]=null,E[De].disconnect(Se))}for(let ne=0;ne<Y.added.length;ne++){const Se=Y.added[ne];let De=T.indexOf(Se);if(De===-1){for(let Ye=0;Ye<E.length;Ye++)if(Ye>=T.length){T.push(Se),De=Ye;break}else if(T[Ye]===null){T[Ye]=Se,De=Ye;break}if(De===-1)break}const Te=E[De];Te&&Te.connect(Se)}}const W=new L,ie=new L;function pe(Y,ne,Se){W.setFromMatrixPosition(ne.matrixWorld),ie.setFromMatrixPosition(Se.matrixWorld);const De=W.distanceTo(ie),Te=ne.projectionMatrix.elements,Ye=Se.projectionMatrix.elements,mt=Te[14]/(Te[10]-1),D=Te[14]/(Te[10]+1),te=(Te[9]+1)/Te[5],K=(Te[9]-1)/Te[5],J=(Te[8]-1)/Te[0],Z=(Ye[8]+1)/Ye[0],ue=mt*J,se=mt*Z,he=De/(-J+Z),He=he*-J;if(ne.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(He),Y.translateZ(he),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),Te[10]===-1)Y.projectionMatrix.copy(ne.projectionMatrix),Y.projectionMatrixInverse.copy(ne.projectionMatrixInverse);else{const Be=mt+he,P=D+he,w=ue-He,z=se+(De-He),j=te*D/P*Be,ee=K*D/P*Be;Y.projectionMatrix.makePerspective(w,z,j,ee,Be,P),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function be(Y,ne){ne===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(ne.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(s===null)return;let ne=Y.near,Se=Y.far;p.texture!==null&&(p.depthNear>0&&(ne=p.depthNear),p.depthFar>0&&(Se=p.depthFar)),I.near=b.near=M.near=ne,I.far=b.far=M.far=Se,(B!==I.near||H!==I.far)&&(s.updateRenderState({depthNear:I.near,depthFar:I.far}),B=I.near,H=I.far),I.layers.mask=Y.layers.mask|6,M.layers.mask=I.layers.mask&3,b.layers.mask=I.layers.mask&5;const De=Y.parent,Te=I.cameras;be(I,De);for(let Ye=0;Ye<Te.length;Ye++)be(Te[Ye],De);Te.length===2?pe(I,M,b):I.projectionMatrix.copy(M.projectionMatrix),Oe(Y,I,De)};function Oe(Y,ne,Se){Se===null?Y.matrix.copy(ne.matrixWorld):(Y.matrix.copy(Se.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(ne.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(ne.projectionMatrix),Y.projectionMatrixInverse.copy(ne.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=fo*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return I},this.getFoveation=function(){if(!(h===null&&m===null))return l},this.setFoveation=function(Y){l=Y,h!==null&&(h.fixedFoveation=Y),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=Y)},this.hasDepthSensing=function(){return p.texture!==null},this.getDepthSensingMesh=function(){return p.getMesh(I)},this.getCameraTexture=function(Y){return f[Y]};let qe=null;function Qe(Y,ne){if(d=ne.getViewerPose(c||a),_=ne,d!==null){const Se=d.views;m!==null&&(e.setRenderTargetFramebuffer(g,m.framebuffer),e.setRenderTarget(g));let De=!1;Se.length!==I.cameras.length&&(I.cameras.length=0,De=!0);for(let D=0;D<Se.length;D++){const te=Se[D];let K=null;if(m!==null)K=m.getViewport(te);else{const Z=u.getViewSubImage(h,te);K=Z.viewport,D===0&&(e.setRenderTargetTextures(g,Z.colorTexture,Z.depthStencilTexture),e.setRenderTarget(g))}let J=R[D];J===void 0&&(J=new ln,J.layers.enable(D),J.viewport=new Tt,R[D]=J),J.matrix.fromArray(te.transform.matrix),J.matrix.decompose(J.position,J.quaternion,J.scale),J.projectionMatrix.fromArray(te.projectionMatrix),J.projectionMatrixInverse.copy(J.projectionMatrix).invert(),J.viewport.set(K.x,K.y,K.width,K.height),D===0&&(I.matrix.copy(J.matrix),I.matrix.decompose(I.position,I.quaternion,I.scale)),De===!0&&I.cameras.push(J)}const Te=s.enabledFeatures;if(Te&&Te.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&x){u=i.getBinding();const D=u.getDepthInformation(Se[0]);D&&D.isValid&&D.texture&&p.init(D,s.renderState)}if(Te&&Te.includes("camera-access")&&x){e.state.unbindTexture(),u=i.getBinding();for(let D=0;D<Se.length;D++){const te=Se[D].camera;if(te){let K=f[te];K||(K=new Hc,f[te]=K);const J=u.getCameraImage(te);K.sourceTexture=J}}}}for(let Se=0;Se<E.length;Se++){const De=T[Se],Te=E[Se];De!==null&&Te!==void 0&&Te.update(De,ne,c||a)}qe&&qe(Y,ne),ne.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:ne}),_=null}const Ke=new ed;Ke.setAnimationLoop(Qe),this.setAnimationLoop=function(Y){qe=Y},this.dispose=function(){}}}const li=new gn,G_=new dt;function V_(n,e){function t(p,f){p.matrixAutoUpdate===!0&&p.updateMatrix(),f.value.copy(p.matrix)}function i(p,f){f.color.getRGB(p.fogColor.value,Oc(n)),f.isFog?(p.fogNear.value=f.near,p.fogFar.value=f.far):f.isFogExp2&&(p.fogDensity.value=f.density)}function s(p,f,y,v,g){f.isMeshBasicMaterial||f.isMeshLambertMaterial?r(p,f):f.isMeshToonMaterial?(r(p,f),u(p,f)):f.isMeshPhongMaterial?(r(p,f),d(p,f)):f.isMeshStandardMaterial?(r(p,f),h(p,f),f.isMeshPhysicalMaterial&&m(p,f,g)):f.isMeshMatcapMaterial?(r(p,f),_(p,f)):f.isMeshDepthMaterial?r(p,f):f.isMeshDistanceMaterial?(r(p,f),x(p,f)):f.isMeshNormalMaterial?r(p,f):f.isLineBasicMaterial?(a(p,f),f.isLineDashedMaterial&&o(p,f)):f.isPointsMaterial?l(p,f,y,v):f.isSpriteMaterial?c(p,f):f.isShadowMaterial?(p.color.value.copy(f.color),p.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function r(p,f){p.opacity.value=f.opacity,f.color&&p.diffuse.value.copy(f.color),f.emissive&&p.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(p.map.value=f.map,t(f.map,p.mapTransform)),f.alphaMap&&(p.alphaMap.value=f.alphaMap,t(f.alphaMap,p.alphaMapTransform)),f.bumpMap&&(p.bumpMap.value=f.bumpMap,t(f.bumpMap,p.bumpMapTransform),p.bumpScale.value=f.bumpScale,f.side===Jt&&(p.bumpScale.value*=-1)),f.normalMap&&(p.normalMap.value=f.normalMap,t(f.normalMap,p.normalMapTransform),p.normalScale.value.copy(f.normalScale),f.side===Jt&&p.normalScale.value.negate()),f.displacementMap&&(p.displacementMap.value=f.displacementMap,t(f.displacementMap,p.displacementMapTransform),p.displacementScale.value=f.displacementScale,p.displacementBias.value=f.displacementBias),f.emissiveMap&&(p.emissiveMap.value=f.emissiveMap,t(f.emissiveMap,p.emissiveMapTransform)),f.specularMap&&(p.specularMap.value=f.specularMap,t(f.specularMap,p.specularMapTransform)),f.alphaTest>0&&(p.alphaTest.value=f.alphaTest);const y=e.get(f),v=y.envMap,g=y.envMapRotation;v&&(p.envMap.value=v,li.copy(g),li.x*=-1,li.y*=-1,li.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(li.y*=-1,li.z*=-1),p.envMapRotation.value.setFromMatrix4(G_.makeRotationFromEuler(li)),p.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=f.reflectivity,p.ior.value=f.ior,p.refractionRatio.value=f.refractionRatio),f.lightMap&&(p.lightMap.value=f.lightMap,p.lightMapIntensity.value=f.lightMapIntensity,t(f.lightMap,p.lightMapTransform)),f.aoMap&&(p.aoMap.value=f.aoMap,p.aoMapIntensity.value=f.aoMapIntensity,t(f.aoMap,p.aoMapTransform))}function a(p,f){p.diffuse.value.copy(f.color),p.opacity.value=f.opacity,f.map&&(p.map.value=f.map,t(f.map,p.mapTransform))}function o(p,f){p.dashSize.value=f.dashSize,p.totalSize.value=f.dashSize+f.gapSize,p.scale.value=f.scale}function l(p,f,y,v){p.diffuse.value.copy(f.color),p.opacity.value=f.opacity,p.size.value=f.size*y,p.scale.value=v*.5,f.map&&(p.map.value=f.map,t(f.map,p.uvTransform)),f.alphaMap&&(p.alphaMap.value=f.alphaMap,t(f.alphaMap,p.alphaMapTransform)),f.alphaTest>0&&(p.alphaTest.value=f.alphaTest)}function c(p,f){p.diffuse.value.copy(f.color),p.opacity.value=f.opacity,p.rotation.value=f.rotation,f.map&&(p.map.value=f.map,t(f.map,p.mapTransform)),f.alphaMap&&(p.alphaMap.value=f.alphaMap,t(f.alphaMap,p.alphaMapTransform)),f.alphaTest>0&&(p.alphaTest.value=f.alphaTest)}function d(p,f){p.specular.value.copy(f.specular),p.shininess.value=Math.max(f.shininess,1e-4)}function u(p,f){f.gradientMap&&(p.gradientMap.value=f.gradientMap)}function h(p,f){p.metalness.value=f.metalness,f.metalnessMap&&(p.metalnessMap.value=f.metalnessMap,t(f.metalnessMap,p.metalnessMapTransform)),p.roughness.value=f.roughness,f.roughnessMap&&(p.roughnessMap.value=f.roughnessMap,t(f.roughnessMap,p.roughnessMapTransform)),f.envMap&&(p.envMapIntensity.value=f.envMapIntensity)}function m(p,f,y){p.ior.value=f.ior,f.sheen>0&&(p.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),p.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(p.sheenColorMap.value=f.sheenColorMap,t(f.sheenColorMap,p.sheenColorMapTransform)),f.sheenRoughnessMap&&(p.sheenRoughnessMap.value=f.sheenRoughnessMap,t(f.sheenRoughnessMap,p.sheenRoughnessMapTransform))),f.clearcoat>0&&(p.clearcoat.value=f.clearcoat,p.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(p.clearcoatMap.value=f.clearcoatMap,t(f.clearcoatMap,p.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,t(f.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(p.clearcoatNormalMap.value=f.clearcoatNormalMap,t(f.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===Jt&&p.clearcoatNormalScale.value.negate())),f.dispersion>0&&(p.dispersion.value=f.dispersion),f.iridescence>0&&(p.iridescence.value=f.iridescence,p.iridescenceIOR.value=f.iridescenceIOR,p.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(p.iridescenceMap.value=f.iridescenceMap,t(f.iridescenceMap,p.iridescenceMapTransform)),f.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=f.iridescenceThicknessMap,t(f.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),f.transmission>0&&(p.transmission.value=f.transmission,p.transmissionSamplerMap.value=y.texture,p.transmissionSamplerSize.value.set(y.width,y.height),f.transmissionMap&&(p.transmissionMap.value=f.transmissionMap,t(f.transmissionMap,p.transmissionMapTransform)),p.thickness.value=f.thickness,f.thicknessMap&&(p.thicknessMap.value=f.thicknessMap,t(f.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=f.attenuationDistance,p.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(p.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(p.anisotropyMap.value=f.anisotropyMap,t(f.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=f.specularIntensity,p.specularColor.value.copy(f.specularColor),f.specularColorMap&&(p.specularColorMap.value=f.specularColorMap,t(f.specularColorMap,p.specularColorMapTransform)),f.specularIntensityMap&&(p.specularIntensityMap.value=f.specularIntensityMap,t(f.specularIntensityMap,p.specularIntensityMapTransform))}function _(p,f){f.matcap&&(p.matcap.value=f.matcap)}function x(p,f){const y=e.get(f).light;p.referencePosition.value.setFromMatrixPosition(y.matrixWorld),p.nearDistance.value=y.shadow.camera.near,p.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function $_(n,e,t,i){let s={},r={},a=[];const o=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(y,v){const g=v.program;i.uniformBlockBinding(y,g)}function c(y,v){let g=s[y.id];g===void 0&&(_(y),g=d(y),s[y.id]=g,y.addEventListener("dispose",p));const E=v.program;i.updateUBOMapping(y,E);const T=e.render.frame;r[y.id]!==T&&(h(y),r[y.id]=T)}function d(y){const v=u();y.__bindingPointIndex=v;const g=n.createBuffer(),E=y.__size,T=y.usage;return n.bindBuffer(n.UNIFORM_BUFFER,g),n.bufferData(n.UNIFORM_BUFFER,E,T),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,v,g),g}function u(){for(let y=0;y<o;y++)if(a.indexOf(y)===-1)return a.push(y),y;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(y){const v=s[y.id],g=y.uniforms,E=y.__cache;n.bindBuffer(n.UNIFORM_BUFFER,v);for(let T=0,S=g.length;T<S;T++){const A=Array.isArray(g[T])?g[T]:[g[T]];for(let M=0,b=A.length;M<b;M++){const R=A[M];if(m(R,T,M,E)===!0){const I=R.__offset,B=Array.isArray(R.value)?R.value:[R.value];let H=0;for(let k=0;k<B.length;k++){const $=B[k],q=x($);typeof $=="number"||typeof $=="boolean"?(R.__data[0]=$,n.bufferSubData(n.UNIFORM_BUFFER,I+H,R.__data)):$.isMatrix3?(R.__data[0]=$.elements[0],R.__data[1]=$.elements[1],R.__data[2]=$.elements[2],R.__data[3]=0,R.__data[4]=$.elements[3],R.__data[5]=$.elements[4],R.__data[6]=$.elements[5],R.__data[7]=0,R.__data[8]=$.elements[6],R.__data[9]=$.elements[7],R.__data[10]=$.elements[8],R.__data[11]=0):($.toArray(R.__data,H),H+=q.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,I,R.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function m(y,v,g,E){const T=y.value,S=v+"_"+g;if(E[S]===void 0)return typeof T=="number"||typeof T=="boolean"?E[S]=T:E[S]=T.clone(),!0;{const A=E[S];if(typeof T=="number"||typeof T=="boolean"){if(A!==T)return E[S]=T,!0}else if(A.equals(T)===!1)return A.copy(T),!0}return!1}function _(y){const v=y.uniforms;let g=0;const E=16;for(let S=0,A=v.length;S<A;S++){const M=Array.isArray(v[S])?v[S]:[v[S]];for(let b=0,R=M.length;b<R;b++){const I=M[b],B=Array.isArray(I.value)?I.value:[I.value];for(let H=0,k=B.length;H<k;H++){const $=B[H],q=x($),W=g%E,ie=W%q.boundary,pe=W+ie;g+=ie,pe!==0&&E-pe<q.storage&&(g+=E-pe),I.__data=new Float32Array(q.storage/Float32Array.BYTES_PER_ELEMENT),I.__offset=g,g+=q.storage}}}const T=g%E;return T>0&&(g+=E-T),y.__size=g,y.__cache={},this}function x(y){const v={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(v.boundary=4,v.storage=4):y.isVector2?(v.boundary=8,v.storage=8):y.isVector3||y.isColor?(v.boundary=16,v.storage=12):y.isVector4?(v.boundary=16,v.storage=16):y.isMatrix3?(v.boundary=48,v.storage=48):y.isMatrix4?(v.boundary=64,v.storage=64):y.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",y),v}function p(y){const v=y.target;v.removeEventListener("dispose",p);const g=a.indexOf(v.__bindingPointIndex);a.splice(g,1),n.deleteBuffer(s[v.id]),delete s[v.id],delete r[v.id]}function f(){for(const y in s)n.deleteBuffer(s[y]);a=[],s={},r={}}return{bind:l,update:c,dispose:f}}class W_{constructor(e={}){const{canvas:t=Vu(),context:i=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:h=!1}=e;this.isWebGLRenderer=!0;let m;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=i.getContextAttributes().alpha}else m=a;const _=new Uint32Array(4),x=new Int32Array(4);let p=null,f=null;const y=[],v=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Jn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const g=this;let E=!1;this._outputColorSpace=on;let T=0,S=0,A=null,M=-1,b=null;const R=new Tt,I=new Tt;let B=null;const H=new Xe(0);let k=0,$=t.width,q=t.height,W=1,ie=null,pe=null;const be=new Tt(0,0,$,q),Oe=new Tt(0,0,$,q);let qe=!1;const Qe=new Lo;let Ke=!1,Y=!1;const ne=new dt,Se=new L,De=new Tt,Te={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Ye=!1;function mt(){return A===null?W:1}let D=i;function te(C,F){return t.getContext(C,F)}try{const C={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:d,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Mo}`),t.addEventListener("webglcontextlost",fe,!1),t.addEventListener("webglcontextrestored",Ee,!1),t.addEventListener("webglcontextcreationerror",ae,!1),D===null){const F="webgl2";if(D=te(F,C),D===null)throw te(F)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(C){throw console.error("THREE.WebGLRenderer: "+C.message),C}let K,J,Z,ue,se,he,He,Be,P,w,z,j,ee,X,Pe,de,Ae,Ce,re,ve,Fe,Le,ge,Ve;function N(){K=new tg(D),K.init(),Le=new O_(D,K),J=new qm(D,K,e,Le),Z=new N_(D,K),J.reversedDepthBuffer&&h&&Z.buffers.depth.setReversed(!0),ue=new sg(D),se=new M_,he=new F_(D,K,Z,se,J,Le,ue),He=new Zm(g),Be=new eg(g),P=new df(D),ge=new jm(D,P),w=new ng(D,P,ue,ge),z=new ag(D,w,P,ue),re=new rg(D,J,he),de=new Ym(se),j=new b_(g,He,Be,K,J,ge,de),ee=new V_(g,se),X=new E_,Pe=new P_(K),Ce=new Wm(g,He,Be,Z,z,m,l),Ae=new I_(g,z,J),Ve=new $_(D,ue,J,Z),ve=new Xm(D,K,ue),Fe=new ig(D,K,ue),ue.programs=j.programs,g.capabilities=J,g.extensions=K,g.properties=se,g.renderLists=X,g.shadowMap=Ae,g.state=Z,g.info=ue}N();const ce=new H_(g,D);this.xr=ce,this.getContext=function(){return D},this.getContextAttributes=function(){return D.getContextAttributes()},this.forceContextLoss=function(){const C=K.get("WEBGL_lose_context");C&&C.loseContext()},this.forceContextRestore=function(){const C=K.get("WEBGL_lose_context");C&&C.restoreContext()},this.getPixelRatio=function(){return W},this.setPixelRatio=function(C){C!==void 0&&(W=C,this.setSize($,q,!1))},this.getSize=function(C){return C.set($,q)},this.setSize=function(C,F,G=!0){if(ce.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}$=C,q=F,t.width=Math.floor(C*W),t.height=Math.floor(F*W),G===!0&&(t.style.width=C+"px",t.style.height=F+"px"),this.setViewport(0,0,C,F)},this.getDrawingBufferSize=function(C){return C.set($*W,q*W).floor()},this.setDrawingBufferSize=function(C,F,G){$=C,q=F,W=G,t.width=Math.floor(C*G),t.height=Math.floor(F*G),this.setViewport(0,0,C,F)},this.getCurrentViewport=function(C){return C.copy(R)},this.getViewport=function(C){return C.copy(be)},this.setViewport=function(C,F,G,V){C.isVector4?be.set(C.x,C.y,C.z,C.w):be.set(C,F,G,V),Z.viewport(R.copy(be).multiplyScalar(W).round())},this.getScissor=function(C){return C.copy(Oe)},this.setScissor=function(C,F,G,V){C.isVector4?Oe.set(C.x,C.y,C.z,C.w):Oe.set(C,F,G,V),Z.scissor(I.copy(Oe).multiplyScalar(W).round())},this.getScissorTest=function(){return qe},this.setScissorTest=function(C){Z.setScissorTest(qe=C)},this.setOpaqueSort=function(C){ie=C},this.setTransparentSort=function(C){pe=C},this.getClearColor=function(C){return C.copy(Ce.getClearColor())},this.setClearColor=function(){Ce.setClearColor(...arguments)},this.getClearAlpha=function(){return Ce.getClearAlpha()},this.setClearAlpha=function(){Ce.setClearAlpha(...arguments)},this.clear=function(C=!0,F=!0,G=!0){let V=0;if(C){let O=!1;if(A!==null){const le=A.texture.format;O=le===Co||le===Ao||le===To}if(O){const le=A.texture.type,_e=le===Tn||le===vi||le===bs||le===Ms||le===Eo||le===wo,we=Ce.getClearColor(),Me=Ce.getClearAlpha(),Ne=we.r,ze=we.g,Ie=we.b;_e?(_[0]=Ne,_[1]=ze,_[2]=Ie,_[3]=Me,D.clearBufferuiv(D.COLOR,0,_)):(x[0]=Ne,x[1]=ze,x[2]=Ie,x[3]=Me,D.clearBufferiv(D.COLOR,0,x))}else V|=D.COLOR_BUFFER_BIT}F&&(V|=D.DEPTH_BUFFER_BIT),G&&(V|=D.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),D.clear(V)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",fe,!1),t.removeEventListener("webglcontextrestored",Ee,!1),t.removeEventListener("webglcontextcreationerror",ae,!1),Ce.dispose(),X.dispose(),Pe.dispose(),se.dispose(),He.dispose(),Be.dispose(),z.dispose(),ge.dispose(),Ve.dispose(),j.dispose(),ce.dispose(),ce.removeEventListener("sessionstart",vn),ce.removeEventListener("sessionend",Bo),ti.stop()};function fe(C){C.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),E=!0}function Ee(){console.log("THREE.WebGLRenderer: Context Restored."),E=!1;const C=ue.autoReset,F=Ae.enabled,G=Ae.autoUpdate,V=Ae.needsUpdate,O=Ae.type;N(),ue.autoReset=C,Ae.enabled=F,Ae.autoUpdate=G,Ae.needsUpdate=V,Ae.type=O}function ae(C){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",C.statusMessage)}function Q(C){const F=C.target;F.removeEventListener("dispose",Q),Re(F)}function Re(C){Ge(C),se.remove(C)}function Ge(C){const F=se.get(C).programs;F!==void 0&&(F.forEach(function(G){j.releaseProgram(G)}),C.isShaderMaterial&&j.releaseShaderCache(C))}this.renderBufferDirect=function(C,F,G,V,O,le){F===null&&(F=Te);const _e=O.isMesh&&O.matrixWorld.determinant()<0,we=pd(C,F,G,V,O);Z.setMaterial(V,_e);let Me=G.index,Ne=1;if(V.wireframe===!0){if(Me=w.getWireframeAttribute(G),Me===void 0)return;Ne=2}const ze=G.drawRange,Ie=G.attributes.position;let Ze=ze.start*Ne,at=(ze.start+ze.count)*Ne;le!==null&&(Ze=Math.max(Ze,le.start*Ne),at=Math.min(at,(le.start+le.count)*Ne)),Me!==null?(Ze=Math.max(Ze,0),at=Math.min(at,Me.count)):Ie!=null&&(Ze=Math.max(Ze,0),at=Math.min(at,Ie.count));const wt=at-Ze;if(wt<0||wt===1/0)return;ge.setup(O,V,we,G,Me);let vt,ft=ve;if(Me!==null&&(vt=P.get(Me),ft=Fe,ft.setIndex(vt)),O.isMesh)V.wireframe===!0?(Z.setLineWidth(V.wireframeLinewidth*mt()),ft.setMode(D.LINES)):ft.setMode(D.TRIANGLES);else if(O.isLine){let Ue=V.linewidth;Ue===void 0&&(Ue=1),Z.setLineWidth(Ue*mt()),O.isLineSegments?ft.setMode(D.LINES):O.isLineLoop?ft.setMode(D.LINE_LOOP):ft.setMode(D.LINE_STRIP)}else O.isPoints?ft.setMode(D.POINTS):O.isSprite&&ft.setMode(D.TRIANGLES);if(O.isBatchedMesh)if(O._multiDrawInstances!==null)ws("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),ft.renderMultiDrawInstances(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount,O._multiDrawInstances);else if(K.get("WEBGL_multi_draw"))ft.renderMultiDraw(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount);else{const Ue=O._multiDrawStarts,bt=O._multiDrawCounts,et=O._multiDrawCount,Qt=Me?P.get(Me).bytesPerElement:1,Mi=se.get(V).currentProgram.getUniforms();for(let en=0;en<et;en++)Mi.setValue(D,"_gl_DrawID",en),ft.render(Ue[en]/Qt,bt[en])}else if(O.isInstancedMesh)ft.renderInstances(Ze,wt,O.count);else if(G.isInstancedBufferGeometry){const Ue=G._maxInstanceCount!==void 0?G._maxInstanceCount:1/0,bt=Math.min(G.instanceCount,Ue);ft.renderInstances(Ze,wt,bt)}else ft.render(Ze,wt)};function gt(C,F,G){C.transparent===!0&&C.side===fn&&C.forceSinglePass===!1?(C.side=Jt,C.needsUpdate=!0,Fs(C,F,G),C.side=Kn,C.needsUpdate=!0,Fs(C,F,G),C.side=fn):Fs(C,F,G)}this.compile=function(C,F,G=null){G===null&&(G=C),f=Pe.get(G),f.init(F),v.push(f),G.traverseVisible(function(O){O.isLight&&O.layers.test(F.layers)&&(f.pushLight(O),O.castShadow&&f.pushShadow(O))}),C!==G&&C.traverseVisible(function(O){O.isLight&&O.layers.test(F.layers)&&(f.pushLight(O),O.castShadow&&f.pushShadow(O))}),f.setupLights();const V=new Set;return C.traverse(function(O){if(!(O.isMesh||O.isPoints||O.isLine||O.isSprite))return;const le=O.material;if(le)if(Array.isArray(le))for(let _e=0;_e<le.length;_e++){const we=le[_e];gt(we,G,O),V.add(we)}else gt(le,G,O),V.add(le)}),f=v.pop(),V},this.compileAsync=function(C,F,G=null){const V=this.compile(C,F,G);return new Promise(O=>{function le(){if(V.forEach(function(_e){se.get(_e).currentProgram.isReady()&&V.delete(_e)}),V.size===0){O(C);return}setTimeout(le,10)}K.get("KHR_parallel_shader_compile")!==null?le():setTimeout(le,10)})};let nt=null;function Cn(C){nt&&nt(C)}function vn(){ti.stop()}function Bo(){ti.start()}const ti=new ed;ti.setAnimationLoop(Cn),typeof self<"u"&&ti.setContext(self),this.setAnimationLoop=function(C){nt=C,ce.setAnimationLoop(C),C===null?ti.stop():ti.start()},ce.addEventListener("sessionstart",vn),ce.addEventListener("sessionend",Bo),this.render=function(C,F){if(F!==void 0&&F.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(E===!0)return;if(C.matrixWorldAutoUpdate===!0&&C.updateMatrixWorld(),F.parent===null&&F.matrixWorldAutoUpdate===!0&&F.updateMatrixWorld(),ce.enabled===!0&&ce.isPresenting===!0&&(ce.cameraAutoUpdate===!0&&ce.updateCamera(F),F=ce.getCamera()),C.isScene===!0&&C.onBeforeRender(g,C,F,A),f=Pe.get(C,v.length),f.init(F),v.push(f),ne.multiplyMatrices(F.projectionMatrix,F.matrixWorldInverse),Qe.setFromProjectionMatrix(ne,En,F.reversedDepth),Y=this.localClippingEnabled,Ke=de.init(this.clippingPlanes,Y),p=X.get(C,y.length),p.init(),y.push(p),ce.enabled===!0&&ce.isPresenting===!0){const le=g.xr.getDepthSensingMesh();le!==null&&Fr(le,F,-1/0,g.sortObjects)}Fr(C,F,0,g.sortObjects),p.finish(),g.sortObjects===!0&&p.sort(ie,pe),Ye=ce.enabled===!1||ce.isPresenting===!1||ce.hasDepthSensing()===!1,Ye&&Ce.addToRenderList(p,C),this.info.render.frame++,Ke===!0&&de.beginShadows();const G=f.state.shadowsArray;Ae.render(G,C,F),Ke===!0&&de.endShadows(),this.info.autoReset===!0&&this.info.reset();const V=p.opaque,O=p.transmissive;if(f.setupLights(),F.isArrayCamera){const le=F.cameras;if(O.length>0)for(let _e=0,we=le.length;_e<we;_e++){const Me=le[_e];Ho(V,O,C,Me)}Ye&&Ce.render(C);for(let _e=0,we=le.length;_e<we;_e++){const Me=le[_e];ko(p,C,Me,Me.viewport)}}else O.length>0&&Ho(V,O,C,F),Ye&&Ce.render(C),ko(p,C,F);A!==null&&S===0&&(he.updateMultisampleRenderTarget(A),he.updateRenderTargetMipmap(A)),C.isScene===!0&&C.onAfterRender(g,C,F),ge.resetDefaultState(),M=-1,b=null,v.pop(),v.length>0?(f=v[v.length-1],Ke===!0&&de.setGlobalState(g.clippingPlanes,f.state.camera)):f=null,y.pop(),y.length>0?p=y[y.length-1]:p=null};function Fr(C,F,G,V){if(C.visible===!1)return;if(C.layers.test(F.layers)){if(C.isGroup)G=C.renderOrder;else if(C.isLOD)C.autoUpdate===!0&&C.update(F);else if(C.isLight)f.pushLight(C),C.castShadow&&f.pushShadow(C);else if(C.isSprite){if(!C.frustumCulled||Qe.intersectsSprite(C)){V&&De.setFromMatrixPosition(C.matrixWorld).applyMatrix4(ne);const _e=z.update(C),we=C.material;we.visible&&p.push(C,_e,we,G,De.z,null)}}else if((C.isMesh||C.isLine||C.isPoints)&&(!C.frustumCulled||Qe.intersectsObject(C))){const _e=z.update(C),we=C.material;if(V&&(C.boundingSphere!==void 0?(C.boundingSphere===null&&C.computeBoundingSphere(),De.copy(C.boundingSphere.center)):(_e.boundingSphere===null&&_e.computeBoundingSphere(),De.copy(_e.boundingSphere.center)),De.applyMatrix4(C.matrixWorld).applyMatrix4(ne)),Array.isArray(we)){const Me=_e.groups;for(let Ne=0,ze=Me.length;Ne<ze;Ne++){const Ie=Me[Ne],Ze=we[Ie.materialIndex];Ze&&Ze.visible&&p.push(C,_e,Ze,G,De.z,Ie)}}else we.visible&&p.push(C,_e,we,G,De.z,null)}}const le=C.children;for(let _e=0,we=le.length;_e<we;_e++)Fr(le[_e],F,G,V)}function ko(C,F,G,V){const O=C.opaque,le=C.transmissive,_e=C.transparent;f.setupLightsView(G),Ke===!0&&de.setGlobalState(g.clippingPlanes,G),V&&Z.viewport(R.copy(V)),O.length>0&&Ns(O,F,G),le.length>0&&Ns(le,F,G),_e.length>0&&Ns(_e,F,G),Z.buffers.depth.setTest(!0),Z.buffers.depth.setMask(!0),Z.buffers.color.setMask(!0),Z.setPolygonOffset(!1)}function Ho(C,F,G,V){if((G.isScene===!0?G.overrideMaterial:null)!==null)return;f.state.transmissionRenderTarget[V.id]===void 0&&(f.state.transmissionRenderTarget[V.id]=new xi(1,1,{generateMipmaps:!0,type:K.has("EXT_color_buffer_half_float")||K.has("EXT_color_buffer_float")?Rs:Tn,minFilter:_i,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:tt.workingColorSpace}));const le=f.state.transmissionRenderTarget[V.id],_e=V.viewport||R;le.setSize(_e.z*g.transmissionResolutionScale,_e.w*g.transmissionResolutionScale);const we=g.getRenderTarget(),Me=g.getActiveCubeFace(),Ne=g.getActiveMipmapLevel();g.setRenderTarget(le),g.getClearColor(H),k=g.getClearAlpha(),k<1&&g.setClearColor(16777215,.5),g.clear(),Ye&&Ce.render(G);const ze=g.toneMapping;g.toneMapping=Jn;const Ie=V.viewport;if(V.viewport!==void 0&&(V.viewport=void 0),f.setupLightsView(V),Ke===!0&&de.setGlobalState(g.clippingPlanes,V),Ns(C,G,V),he.updateMultisampleRenderTarget(le),he.updateRenderTargetMipmap(le),K.has("WEBGL_multisampled_render_to_texture")===!1){let Ze=!1;for(let at=0,wt=F.length;at<wt;at++){const vt=F[at],ft=vt.object,Ue=vt.geometry,bt=vt.material,et=vt.group;if(bt.side===fn&&ft.layers.test(V.layers)){const Qt=bt.side;bt.side=Jt,bt.needsUpdate=!0,Go(ft,G,V,Ue,bt,et),bt.side=Qt,bt.needsUpdate=!0,Ze=!0}}Ze===!0&&(he.updateMultisampleRenderTarget(le),he.updateRenderTargetMipmap(le))}g.setRenderTarget(we,Me,Ne),g.setClearColor(H,k),Ie!==void 0&&(V.viewport=Ie),g.toneMapping=ze}function Ns(C,F,G){const V=F.isScene===!0?F.overrideMaterial:null;for(let O=0,le=C.length;O<le;O++){const _e=C[O],we=_e.object,Me=_e.geometry,Ne=_e.group;let ze=_e.material;ze.allowOverride===!0&&V!==null&&(ze=V),we.layers.test(G.layers)&&Go(we,F,G,Me,ze,Ne)}}function Go(C,F,G,V,O,le){C.onBeforeRender(g,F,G,V,O,le),C.modelViewMatrix.multiplyMatrices(G.matrixWorldInverse,C.matrixWorld),C.normalMatrix.getNormalMatrix(C.modelViewMatrix),O.onBeforeRender(g,F,G,V,C,le),O.transparent===!0&&O.side===fn&&O.forceSinglePass===!1?(O.side=Jt,O.needsUpdate=!0,g.renderBufferDirect(G,F,V,O,C,le),O.side=Kn,O.needsUpdate=!0,g.renderBufferDirect(G,F,V,O,C,le),O.side=fn):g.renderBufferDirect(G,F,V,O,C,le),C.onAfterRender(g,F,G,V,O,le)}function Fs(C,F,G){F.isScene!==!0&&(F=Te);const V=se.get(C),O=f.state.lights,le=f.state.shadowsArray,_e=O.state.version,we=j.getParameters(C,O.state,le,F,G),Me=j.getProgramCacheKey(we);let Ne=V.programs;V.environment=C.isMeshStandardMaterial?F.environment:null,V.fog=F.fog,V.envMap=(C.isMeshStandardMaterial?Be:He).get(C.envMap||V.environment),V.envMapRotation=V.environment!==null&&C.envMap===null?F.environmentRotation:C.envMapRotation,Ne===void 0&&(C.addEventListener("dispose",Q),Ne=new Map,V.programs=Ne);let ze=Ne.get(Me);if(ze!==void 0){if(V.currentProgram===ze&&V.lightsStateVersion===_e)return $o(C,we),ze}else we.uniforms=j.getUniforms(C),C.onBeforeCompile(we,g),ze=j.acquireProgram(we,Me),Ne.set(Me,ze),V.uniforms=we.uniforms;const Ie=V.uniforms;return(!C.isShaderMaterial&&!C.isRawShaderMaterial||C.clipping===!0)&&(Ie.clippingPlanes=de.uniform),$o(C,we),V.needsLights=gd(C),V.lightsStateVersion=_e,V.needsLights&&(Ie.ambientLightColor.value=O.state.ambient,Ie.lightProbe.value=O.state.probe,Ie.directionalLights.value=O.state.directional,Ie.directionalLightShadows.value=O.state.directionalShadow,Ie.spotLights.value=O.state.spot,Ie.spotLightShadows.value=O.state.spotShadow,Ie.rectAreaLights.value=O.state.rectArea,Ie.ltc_1.value=O.state.rectAreaLTC1,Ie.ltc_2.value=O.state.rectAreaLTC2,Ie.pointLights.value=O.state.point,Ie.pointLightShadows.value=O.state.pointShadow,Ie.hemisphereLights.value=O.state.hemi,Ie.directionalShadowMap.value=O.state.directionalShadowMap,Ie.directionalShadowMatrix.value=O.state.directionalShadowMatrix,Ie.spotShadowMap.value=O.state.spotShadowMap,Ie.spotLightMatrix.value=O.state.spotLightMatrix,Ie.spotLightMap.value=O.state.spotLightMap,Ie.pointShadowMap.value=O.state.pointShadowMap,Ie.pointShadowMatrix.value=O.state.pointShadowMatrix),V.currentProgram=ze,V.uniformsList=null,ze}function Vo(C){if(C.uniformsList===null){const F=C.currentProgram.getUniforms();C.uniformsList=br.seqWithValue(F.seq,C.uniforms)}return C.uniformsList}function $o(C,F){const G=se.get(C);G.outputColorSpace=F.outputColorSpace,G.batching=F.batching,G.batchingColor=F.batchingColor,G.instancing=F.instancing,G.instancingColor=F.instancingColor,G.instancingMorph=F.instancingMorph,G.skinning=F.skinning,G.morphTargets=F.morphTargets,G.morphNormals=F.morphNormals,G.morphColors=F.morphColors,G.morphTargetsCount=F.morphTargetsCount,G.numClippingPlanes=F.numClippingPlanes,G.numIntersection=F.numClipIntersection,G.vertexAlphas=F.vertexAlphas,G.vertexTangents=F.vertexTangents,G.toneMapping=F.toneMapping}function pd(C,F,G,V,O){F.isScene!==!0&&(F=Te),he.resetTextureUnits();const le=F.fog,_e=V.isMeshStandardMaterial?F.environment:null,we=A===null?g.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:qi,Me=(V.isMeshStandardMaterial?Be:He).get(V.envMap||_e),Ne=V.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,ze=!!G.attributes.tangent&&(!!V.normalMap||V.anisotropy>0),Ie=!!G.morphAttributes.position,Ze=!!G.morphAttributes.normal,at=!!G.morphAttributes.color;let wt=Jn;V.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(wt=g.toneMapping);const vt=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,ft=vt!==void 0?vt.length:0,Ue=se.get(V),bt=f.state.lights;if(Ke===!0&&(Y===!0||C!==b)){const Vt=C===b&&V.id===M;de.setState(V,C,Vt)}let et=!1;V.version===Ue.__version?(Ue.needsLights&&Ue.lightsStateVersion!==bt.state.version||Ue.outputColorSpace!==we||O.isBatchedMesh&&Ue.batching===!1||!O.isBatchedMesh&&Ue.batching===!0||O.isBatchedMesh&&Ue.batchingColor===!0&&O.colorTexture===null||O.isBatchedMesh&&Ue.batchingColor===!1&&O.colorTexture!==null||O.isInstancedMesh&&Ue.instancing===!1||!O.isInstancedMesh&&Ue.instancing===!0||O.isSkinnedMesh&&Ue.skinning===!1||!O.isSkinnedMesh&&Ue.skinning===!0||O.isInstancedMesh&&Ue.instancingColor===!0&&O.instanceColor===null||O.isInstancedMesh&&Ue.instancingColor===!1&&O.instanceColor!==null||O.isInstancedMesh&&Ue.instancingMorph===!0&&O.morphTexture===null||O.isInstancedMesh&&Ue.instancingMorph===!1&&O.morphTexture!==null||Ue.envMap!==Me||V.fog===!0&&Ue.fog!==le||Ue.numClippingPlanes!==void 0&&(Ue.numClippingPlanes!==de.numPlanes||Ue.numIntersection!==de.numIntersection)||Ue.vertexAlphas!==Ne||Ue.vertexTangents!==ze||Ue.morphTargets!==Ie||Ue.morphNormals!==Ze||Ue.morphColors!==at||Ue.toneMapping!==wt||Ue.morphTargetsCount!==ft)&&(et=!0):(et=!0,Ue.__version=V.version);let Qt=Ue.currentProgram;et===!0&&(Qt=Fs(V,F,O));let Mi=!1,en=!1,ts=!1;const Mt=Qt.getUniforms(),sn=Ue.uniforms;if(Z.useProgram(Qt.program)&&(Mi=!0,en=!0,ts=!0),V.id!==M&&(M=V.id,en=!0),Mi||b!==C){Z.buffers.depth.getReversed()&&C.reversedDepth!==!0&&(C._reversedDepth=!0,C.updateProjectionMatrix()),Mt.setValue(D,"projectionMatrix",C.projectionMatrix),Mt.setValue(D,"viewMatrix",C.matrixWorldInverse);const Xt=Mt.map.cameraPosition;Xt!==void 0&&Xt.setValue(D,Se.setFromMatrixPosition(C.matrixWorld)),J.logarithmicDepthBuffer&&Mt.setValue(D,"logDepthBufFC",2/(Math.log(C.far+1)/Math.LN2)),(V.isMeshPhongMaterial||V.isMeshToonMaterial||V.isMeshLambertMaterial||V.isMeshBasicMaterial||V.isMeshStandardMaterial||V.isShaderMaterial)&&Mt.setValue(D,"isOrthographic",C.isOrthographicCamera===!0),b!==C&&(b=C,en=!0,ts=!0)}if(O.isSkinnedMesh){Mt.setOptional(D,O,"bindMatrix"),Mt.setOptional(D,O,"bindMatrixInverse");const Vt=O.skeleton;Vt&&(Vt.boneTexture===null&&Vt.computeBoneTexture(),Mt.setValue(D,"boneTexture",Vt.boneTexture,he))}O.isBatchedMesh&&(Mt.setOptional(D,O,"batchingTexture"),Mt.setValue(D,"batchingTexture",O._matricesTexture,he),Mt.setOptional(D,O,"batchingIdTexture"),Mt.setValue(D,"batchingIdTexture",O._indirectTexture,he),Mt.setOptional(D,O,"batchingColorTexture"),O._colorsTexture!==null&&Mt.setValue(D,"batchingColorTexture",O._colorsTexture,he));const rn=G.morphAttributes;if((rn.position!==void 0||rn.normal!==void 0||rn.color!==void 0)&&re.update(O,G,Qt),(en||Ue.receiveShadow!==O.receiveShadow)&&(Ue.receiveShadow=O.receiveShadow,Mt.setValue(D,"receiveShadow",O.receiveShadow)),V.isMeshGouraudMaterial&&V.envMap!==null&&(sn.envMap.value=Me,sn.flipEnvMap.value=Me.isCubeTexture&&Me.isRenderTargetTexture===!1?-1:1),V.isMeshStandardMaterial&&V.envMap===null&&F.environment!==null&&(sn.envMapIntensity.value=F.environmentIntensity),en&&(Mt.setValue(D,"toneMappingExposure",g.toneMappingExposure),Ue.needsLights&&md(sn,ts),le&&V.fog===!0&&ee.refreshFogUniforms(sn,le),ee.refreshMaterialUniforms(sn,V,W,q,f.state.transmissionRenderTarget[C.id]),br.upload(D,Vo(Ue),sn,he)),V.isShaderMaterial&&V.uniformsNeedUpdate===!0&&(br.upload(D,Vo(Ue),sn,he),V.uniformsNeedUpdate=!1),V.isSpriteMaterial&&Mt.setValue(D,"center",O.center),Mt.setValue(D,"modelViewMatrix",O.modelViewMatrix),Mt.setValue(D,"normalMatrix",O.normalMatrix),Mt.setValue(D,"modelMatrix",O.matrixWorld),V.isShaderMaterial||V.isRawShaderMaterial){const Vt=V.uniformsGroups;for(let Xt=0,Or=Vt.length;Xt<Or;Xt++){const ni=Vt[Xt];Ve.update(ni,Qt),Ve.bind(ni,Qt)}}return Qt}function md(C,F){C.ambientLightColor.needsUpdate=F,C.lightProbe.needsUpdate=F,C.directionalLights.needsUpdate=F,C.directionalLightShadows.needsUpdate=F,C.pointLights.needsUpdate=F,C.pointLightShadows.needsUpdate=F,C.spotLights.needsUpdate=F,C.spotLightShadows.needsUpdate=F,C.rectAreaLights.needsUpdate=F,C.hemisphereLights.needsUpdate=F}function gd(C){return C.isMeshLambertMaterial||C.isMeshToonMaterial||C.isMeshPhongMaterial||C.isMeshStandardMaterial||C.isShadowMaterial||C.isShaderMaterial&&C.lights===!0}this.getActiveCubeFace=function(){return T},this.getActiveMipmapLevel=function(){return S},this.getRenderTarget=function(){return A},this.setRenderTargetTextures=function(C,F,G){const V=se.get(C);V.__autoAllocateDepthBuffer=C.resolveDepthBuffer===!1,V.__autoAllocateDepthBuffer===!1&&(V.__useRenderToTexture=!1),se.get(C.texture).__webglTexture=F,se.get(C.depthTexture).__webglTexture=V.__autoAllocateDepthBuffer?void 0:G,V.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(C,F){const G=se.get(C);G.__webglFramebuffer=F,G.__useDefaultFramebuffer=F===void 0};const _d=D.createFramebuffer();this.setRenderTarget=function(C,F=0,G=0){A=C,T=F,S=G;let V=!0,O=null,le=!1,_e=!1;if(C){const Me=se.get(C);if(Me.__useDefaultFramebuffer!==void 0)Z.bindFramebuffer(D.FRAMEBUFFER,null),V=!1;else if(Me.__webglFramebuffer===void 0)he.setupRenderTarget(C);else if(Me.__hasExternalTextures)he.rebindTextures(C,se.get(C.texture).__webglTexture,se.get(C.depthTexture).__webglTexture);else if(C.depthBuffer){const Ie=C.depthTexture;if(Me.__boundDepthTexture!==Ie){if(Ie!==null&&se.has(Ie)&&(C.width!==Ie.image.width||C.height!==Ie.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");he.setupDepthRenderbuffer(C)}}const Ne=C.texture;(Ne.isData3DTexture||Ne.isDataArrayTexture||Ne.isCompressedArrayTexture)&&(_e=!0);const ze=se.get(C).__webglFramebuffer;C.isWebGLCubeRenderTarget?(Array.isArray(ze[F])?O=ze[F][G]:O=ze[F],le=!0):C.samples>0&&he.useMultisampledRTT(C)===!1?O=se.get(C).__webglMultisampledFramebuffer:Array.isArray(ze)?O=ze[G]:O=ze,R.copy(C.viewport),I.copy(C.scissor),B=C.scissorTest}else R.copy(be).multiplyScalar(W).floor(),I.copy(Oe).multiplyScalar(W).floor(),B=qe;if(G!==0&&(O=_d),Z.bindFramebuffer(D.FRAMEBUFFER,O)&&V&&Z.drawBuffers(C,O),Z.viewport(R),Z.scissor(I),Z.setScissorTest(B),le){const Me=se.get(C.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_CUBE_MAP_POSITIVE_X+F,Me.__webglTexture,G)}else if(_e){const Me=F;for(let Ne=0;Ne<C.textures.length;Ne++){const ze=se.get(C.textures[Ne]);D.framebufferTextureLayer(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0+Ne,ze.__webglTexture,G,Me)}}else if(C!==null&&G!==0){const Me=se.get(C.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,Me.__webglTexture,G)}M=-1},this.readRenderTargetPixels=function(C,F,G,V,O,le,_e,we=0){if(!(C&&C.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Me=se.get(C).__webglFramebuffer;if(C.isWebGLCubeRenderTarget&&_e!==void 0&&(Me=Me[_e]),Me){Z.bindFramebuffer(D.FRAMEBUFFER,Me);try{const Ne=C.textures[we],ze=Ne.format,Ie=Ne.type;if(!J.textureFormatReadable(ze)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!J.textureTypeReadable(Ie)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}F>=0&&F<=C.width-V&&G>=0&&G<=C.height-O&&(C.textures.length>1&&D.readBuffer(D.COLOR_ATTACHMENT0+we),D.readPixels(F,G,V,O,Le.convert(ze),Le.convert(Ie),le))}finally{const Ne=A!==null?se.get(A).__webglFramebuffer:null;Z.bindFramebuffer(D.FRAMEBUFFER,Ne)}}},this.readRenderTargetPixelsAsync=async function(C,F,G,V,O,le,_e,we=0){if(!(C&&C.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Me=se.get(C).__webglFramebuffer;if(C.isWebGLCubeRenderTarget&&_e!==void 0&&(Me=Me[_e]),Me)if(F>=0&&F<=C.width-V&&G>=0&&G<=C.height-O){Z.bindFramebuffer(D.FRAMEBUFFER,Me);const Ne=C.textures[we],ze=Ne.format,Ie=Ne.type;if(!J.textureFormatReadable(ze))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!J.textureTypeReadable(Ie))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Ze=D.createBuffer();D.bindBuffer(D.PIXEL_PACK_BUFFER,Ze),D.bufferData(D.PIXEL_PACK_BUFFER,le.byteLength,D.STREAM_READ),C.textures.length>1&&D.readBuffer(D.COLOR_ATTACHMENT0+we),D.readPixels(F,G,V,O,Le.convert(ze),Le.convert(Ie),0);const at=A!==null?se.get(A).__webglFramebuffer:null;Z.bindFramebuffer(D.FRAMEBUFFER,at);const wt=D.fenceSync(D.SYNC_GPU_COMMANDS_COMPLETE,0);return D.flush(),await $u(D,wt,4),D.bindBuffer(D.PIXEL_PACK_BUFFER,Ze),D.getBufferSubData(D.PIXEL_PACK_BUFFER,0,le),D.deleteBuffer(Ze),D.deleteSync(wt),le}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(C,F=null,G=0){const V=Math.pow(2,-G),O=Math.floor(C.image.width*V),le=Math.floor(C.image.height*V),_e=F!==null?F.x:0,we=F!==null?F.y:0;he.setTexture2D(C,0),D.copyTexSubImage2D(D.TEXTURE_2D,G,0,0,_e,we,O,le),Z.unbindTexture()};const vd=D.createFramebuffer(),xd=D.createFramebuffer();this.copyTextureToTexture=function(C,F,G=null,V=null,O=0,le=null){le===null&&(O!==0?(ws("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),le=O,O=0):le=0);let _e,we,Me,Ne,ze,Ie,Ze,at,wt;const vt=C.isCompressedTexture?C.mipmaps[le]:C.image;if(G!==null)_e=G.max.x-G.min.x,we=G.max.y-G.min.y,Me=G.isBox3?G.max.z-G.min.z:1,Ne=G.min.x,ze=G.min.y,Ie=G.isBox3?G.min.z:0;else{const rn=Math.pow(2,-O);_e=Math.floor(vt.width*rn),we=Math.floor(vt.height*rn),C.isDataArrayTexture?Me=vt.depth:C.isData3DTexture?Me=Math.floor(vt.depth*rn):Me=1,Ne=0,ze=0,Ie=0}V!==null?(Ze=V.x,at=V.y,wt=V.z):(Ze=0,at=0,wt=0);const ft=Le.convert(F.format),Ue=Le.convert(F.type);let bt;F.isData3DTexture?(he.setTexture3D(F,0),bt=D.TEXTURE_3D):F.isDataArrayTexture||F.isCompressedArrayTexture?(he.setTexture2DArray(F,0),bt=D.TEXTURE_2D_ARRAY):(he.setTexture2D(F,0),bt=D.TEXTURE_2D),D.pixelStorei(D.UNPACK_FLIP_Y_WEBGL,F.flipY),D.pixelStorei(D.UNPACK_PREMULTIPLY_ALPHA_WEBGL,F.premultiplyAlpha),D.pixelStorei(D.UNPACK_ALIGNMENT,F.unpackAlignment);const et=D.getParameter(D.UNPACK_ROW_LENGTH),Qt=D.getParameter(D.UNPACK_IMAGE_HEIGHT),Mi=D.getParameter(D.UNPACK_SKIP_PIXELS),en=D.getParameter(D.UNPACK_SKIP_ROWS),ts=D.getParameter(D.UNPACK_SKIP_IMAGES);D.pixelStorei(D.UNPACK_ROW_LENGTH,vt.width),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,vt.height),D.pixelStorei(D.UNPACK_SKIP_PIXELS,Ne),D.pixelStorei(D.UNPACK_SKIP_ROWS,ze),D.pixelStorei(D.UNPACK_SKIP_IMAGES,Ie);const Mt=C.isDataArrayTexture||C.isData3DTexture,sn=F.isDataArrayTexture||F.isData3DTexture;if(C.isDepthTexture){const rn=se.get(C),Vt=se.get(F),Xt=se.get(rn.__renderTarget),Or=se.get(Vt.__renderTarget);Z.bindFramebuffer(D.READ_FRAMEBUFFER,Xt.__webglFramebuffer),Z.bindFramebuffer(D.DRAW_FRAMEBUFFER,Or.__webglFramebuffer);for(let ni=0;ni<Me;ni++)Mt&&(D.framebufferTextureLayer(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,se.get(C).__webglTexture,O,Ie+ni),D.framebufferTextureLayer(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,se.get(F).__webglTexture,le,wt+ni)),D.blitFramebuffer(Ne,ze,_e,we,Ze,at,_e,we,D.DEPTH_BUFFER_BIT,D.NEAREST);Z.bindFramebuffer(D.READ_FRAMEBUFFER,null),Z.bindFramebuffer(D.DRAW_FRAMEBUFFER,null)}else if(O!==0||C.isRenderTargetTexture||se.has(C)){const rn=se.get(C),Vt=se.get(F);Z.bindFramebuffer(D.READ_FRAMEBUFFER,vd),Z.bindFramebuffer(D.DRAW_FRAMEBUFFER,xd);for(let Xt=0;Xt<Me;Xt++)Mt?D.framebufferTextureLayer(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,rn.__webglTexture,O,Ie+Xt):D.framebufferTexture2D(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,rn.__webglTexture,O),sn?D.framebufferTextureLayer(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,Vt.__webglTexture,le,wt+Xt):D.framebufferTexture2D(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,Vt.__webglTexture,le),O!==0?D.blitFramebuffer(Ne,ze,_e,we,Ze,at,_e,we,D.COLOR_BUFFER_BIT,D.NEAREST):sn?D.copyTexSubImage3D(bt,le,Ze,at,wt+Xt,Ne,ze,_e,we):D.copyTexSubImage2D(bt,le,Ze,at,Ne,ze,_e,we);Z.bindFramebuffer(D.READ_FRAMEBUFFER,null),Z.bindFramebuffer(D.DRAW_FRAMEBUFFER,null)}else sn?C.isDataTexture||C.isData3DTexture?D.texSubImage3D(bt,le,Ze,at,wt,_e,we,Me,ft,Ue,vt.data):F.isCompressedArrayTexture?D.compressedTexSubImage3D(bt,le,Ze,at,wt,_e,we,Me,ft,vt.data):D.texSubImage3D(bt,le,Ze,at,wt,_e,we,Me,ft,Ue,vt):C.isDataTexture?D.texSubImage2D(D.TEXTURE_2D,le,Ze,at,_e,we,ft,Ue,vt.data):C.isCompressedTexture?D.compressedTexSubImage2D(D.TEXTURE_2D,le,Ze,at,vt.width,vt.height,ft,vt.data):D.texSubImage2D(D.TEXTURE_2D,le,Ze,at,_e,we,ft,Ue,vt);D.pixelStorei(D.UNPACK_ROW_LENGTH,et),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,Qt),D.pixelStorei(D.UNPACK_SKIP_PIXELS,Mi),D.pixelStorei(D.UNPACK_SKIP_ROWS,en),D.pixelStorei(D.UNPACK_SKIP_IMAGES,ts),le===0&&F.generateMipmaps&&D.generateMipmap(bt),Z.unbindTexture()},this.initRenderTarget=function(C){se.get(C).__webglFramebuffer===void 0&&he.setupRenderTarget(C)},this.initTexture=function(C){C.isCubeTexture?he.setTextureCube(C,0):C.isData3DTexture?he.setTexture3D(C,0):C.isDataArrayTexture||C.isCompressedArrayTexture?he.setTexture2DArray(C,0):he.setTexture2D(C,0),Z.unbindTexture()},this.resetState=function(){T=0,S=0,A=null,Z.reset(),ge.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return En}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=tt._getDrawingBufferColorSpace(e),t.unpackColorSpace=tt._getUnpackColorSpace()}}const ec={type:"change"},Oo={type:"start"},rd={type:"end"},hr=new Dr,tc=new qn,j_=Math.cos(70*Gu.DEG2RAD),Lt=new L,Yt=2*Math.PI,lt={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},ya=1e-6;class X_ extends Qc{constructor(e,t=null){super(e,t),this.state=lt.NONE,this.target=new L,this.cursor=new L,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Gi.ROTATE,MIDDLE:Gi.DOLLY,RIGHT:Gi.PAN},this.touches={ONE:zi.ROTATE,TWO:zi.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new L,this._lastQuaternion=new Ot,this._lastTargetPosition=new L,this._quat=new Ot().setFromUnitVectors(e.up,new L(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Cl,this._sphericalDelta=new Cl,this._scale=1,this._panOffset=new L,this._rotateStart=new oe,this._rotateEnd=new oe,this._rotateDelta=new oe,this._panStart=new oe,this._panEnd=new oe,this._panDelta=new oe,this._dollyStart=new oe,this._dollyEnd=new oe,this._dollyDelta=new oe,this._dollyDirection=new L,this._mouse=new oe,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=Y_.bind(this),this._onPointerDown=q_.bind(this),this._onPointerUp=Z_.bind(this),this._onContextMenu=iv.bind(this),this._onMouseWheel=Q_.bind(this),this._onKeyDown=ev.bind(this),this._onTouchStart=tv.bind(this),this._onTouchMove=nv.bind(this),this._onMouseDown=J_.bind(this),this._onMouseMove=K_.bind(this),this._interceptControlDown=sv.bind(this),this._interceptControlUp=rv.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(ec),this.update(),this.state=lt.NONE}update(e=null){const t=this.object.position;Lt.copy(t).sub(this.target),Lt.applyQuaternion(this._quat),this._spherical.setFromVector3(Lt),this.autoRotate&&this.state===lt.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(i)&&isFinite(s)&&(i<-Math.PI?i+=Yt:i>Math.PI&&(i-=Yt),s<-Math.PI?s+=Yt:s>Math.PI&&(s-=Yt),i<=s?this._spherical.theta=Math.max(i,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+s)/2?Math.max(i,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const a=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=a!=this._spherical.radius}if(Lt.setFromSpherical(this._spherical),Lt.applyQuaternion(this._quatInverse),t.copy(this.target).add(Lt),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let a=null;if(this.object.isPerspectiveCamera){const o=Lt.length();a=this._clampDistance(o*this._scale);const l=o-a;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),r=!!l}else if(this.object.isOrthographicCamera){const o=new L(this._mouse.x,this._mouse.y,0);o.unproject(this.object);const l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=l!==this.object.zoom;const c=new L(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(o),this.object.updateMatrixWorld(),a=Lt.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;a!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(a).add(this.object.position):(hr.origin.copy(this.object.position),hr.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(hr.direction))<j_?this.object.lookAt(this.target):(tc.setFromNormalAndCoplanarPoint(this.object.up,this.target),hr.intersectPlane(tc,this.target))))}else if(this.object.isOrthographicCamera){const a=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),a!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>ya||8*(1-this._lastQuaternion.dot(this.object.quaternion))>ya||this._lastTargetPosition.distanceToSquared(this.target)>ya?(this.dispatchEvent(ec),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?Yt/60*this.autoRotateSpeed*e:Yt/60/60*this.autoRotateSpeed}_getZoomScale(e){const t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){Lt.setFromMatrixColumn(t,0),Lt.multiplyScalar(-e),this._panOffset.add(Lt)}_panUp(e,t){this.screenSpacePanning===!0?Lt.setFromMatrixColumn(t,1):(Lt.setFromMatrixColumn(t,0),Lt.crossVectors(this.object.up,Lt)),Lt.multiplyScalar(e),this._panOffset.add(Lt)}_pan(e,t){const i=this.domElement;if(this.object.isPerspectiveCamera){const s=this.object.position;Lt.copy(s).sub(this.target);let r=Lt.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*r/i.clientHeight,this.object.matrix),this._panUp(2*t*r/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const i=this.domElement.getBoundingClientRect(),s=e-i.left,r=t-i.top,a=i.width,o=i.height;this._mouse.x=s/a*2-1,this._mouse.y=-(r/o)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(Yt*this._rotateDelta.x/t.clientHeight),this._rotateUp(Yt*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(Yt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-Yt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(Yt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-Yt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._rotateStart.set(i,s)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panStart.set(i,s)}}_handleTouchStartDolly(e){const t=this._getSecondPointerPosition(e),i=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(i*i+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const i=this._getSecondPointerPosition(e),s=.5*(e.pageX+i.x),r=.5*(e.pageY+i.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(Yt*this._rotateDelta.x/t.clientHeight),this._rotateUp(Yt*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panEnd.set(i,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const t=this._getSecondPointerPosition(e),i=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(i*i+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const a=(e.pageX+t.x)*.5,o=(e.pageY+t.y)*.5;this._updateZoomParameters(a,o)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new oe,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){const t=e.deltaMode,i={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}}function q_(n){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(n.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(n)&&(this._addPointer(n),n.pointerType==="touch"?this._onTouchStart(n):this._onMouseDown(n)))}function Y_(n){this.enabled!==!1&&(n.pointerType==="touch"?this._onTouchMove(n):this._onMouseMove(n))}function Z_(n){switch(this._removePointer(n),this._pointers.length){case 0:this.domElement.releasePointerCapture(n.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(rd),this.state=lt.NONE;break;case 1:const e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function J_(n){let e;switch(n.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case Gi.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(n),this.state=lt.DOLLY;break;case Gi.ROTATE:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=lt.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=lt.ROTATE}break;case Gi.PAN:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=lt.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=lt.PAN}break;default:this.state=lt.NONE}this.state!==lt.NONE&&this.dispatchEvent(Oo)}function K_(n){switch(this.state){case lt.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(n);break;case lt.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(n);break;case lt.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(n);break}}function Q_(n){this.enabled===!1||this.enableZoom===!1||this.state!==lt.NONE||(n.preventDefault(),this.dispatchEvent(Oo),this._handleMouseWheel(this._customWheelEvent(n)),this.dispatchEvent(rd))}function ev(n){this.enabled!==!1&&this._handleKeyDown(n)}function tv(n){switch(this._trackPointer(n),this._pointers.length){case 1:switch(this.touches.ONE){case zi.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(n),this.state=lt.TOUCH_ROTATE;break;case zi.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(n),this.state=lt.TOUCH_PAN;break;default:this.state=lt.NONE}break;case 2:switch(this.touches.TWO){case zi.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(n),this.state=lt.TOUCH_DOLLY_PAN;break;case zi.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(n),this.state=lt.TOUCH_DOLLY_ROTATE;break;default:this.state=lt.NONE}break;default:this.state=lt.NONE}this.state!==lt.NONE&&this.dispatchEvent(Oo)}function nv(n){switch(this._trackPointer(n),this.state){case lt.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(n),this.update();break;case lt.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(n),this.update();break;case lt.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(n),this.update();break;case lt.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(n),this.update();break;default:this.state=lt.NONE}}function iv(n){this.enabled!==!1&&n.preventDefault()}function sv(n){n.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function rv(n){n.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const ci=new Kc,Ht=new L,Xn=new L,xt=new Ot,nc={X:new L(1,0,0),Y:new L(0,1,0),Z:new L(0,0,1)},ba={type:"change"},ic={type:"mouseDown",mode:null},sc={type:"mouseUp",mode:null},rc={type:"objectChange"};class av extends Qc{constructor(e,t=null){super(void 0,t);const i=new hv(this);this._root=i;const s=new fv;this._gizmo=s,i.add(s);const r=new pv;this._plane=r,i.add(r);const a=this;function o(v,g){let E=g;Object.defineProperty(a,v,{get:function(){return E!==void 0?E:g},set:function(T){E!==T&&(E=T,r[v]=T,s[v]=T,a.dispatchEvent({type:v+"-changed",value:T}),a.dispatchEvent(ba))}}),a[v]=g,r[v]=g,s[v]=g}o("camera",e),o("object",void 0),o("enabled",!0),o("axis",null),o("mode","translate"),o("translationSnap",null),o("rotationSnap",null),o("scaleSnap",null),o("space","world"),o("size",1),o("dragging",!1),o("showX",!0),o("showY",!0),o("showZ",!0),o("minX",-1/0),o("maxX",1/0),o("minY",-1/0),o("maxY",1/0),o("minZ",-1/0),o("maxZ",1/0);const l=new L,c=new L,d=new Ot,u=new Ot,h=new L,m=new Ot,_=new L,x=new L,p=new L,f=0,y=new L;o("worldPosition",l),o("worldPositionStart",c),o("worldQuaternion",d),o("worldQuaternionStart",u),o("cameraPosition",h),o("cameraQuaternion",m),o("pointStart",_),o("pointEnd",x),o("rotationAxis",p),o("rotationAngle",f),o("eye",y),this._offset=new L,this._startNorm=new L,this._endNorm=new L,this._cameraScale=new L,this._parentPosition=new L,this._parentQuaternion=new Ot,this._parentQuaternionInv=new Ot,this._parentScale=new L,this._worldScaleStart=new L,this._worldQuaternionInv=new Ot,this._worldScale=new L,this._positionStart=new L,this._quaternionStart=new Ot,this._scaleStart=new L,this._getPointer=ov.bind(this),this._onPointerDown=cv.bind(this),this._onPointerHover=lv.bind(this),this._onPointerMove=dv.bind(this),this._onPointerUp=uv.bind(this),t!==null&&this.connect(t)}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointermove",this._onPointerHover),this.domElement.addEventListener("pointerup",this._onPointerUp),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerHover),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.style.touchAction="auto"}getHelper(){return this._root}pointerHover(e){if(this.object===void 0||this.dragging===!0)return;e!==null&&ci.setFromCamera(e,this.camera);const t=Ma(this._gizmo.picker[this.mode],ci);t?this.axis=t.object.name:this.axis=null}pointerDown(e){if(!(this.object===void 0||this.dragging===!0||e!=null&&e.button!==0)&&this.axis!==null){e!==null&&ci.setFromCamera(e,this.camera);const t=Ma(this._plane,ci,!0);t&&(this.object.updateMatrixWorld(),this.object.parent.updateMatrixWorld(),this._positionStart.copy(this.object.position),this._quaternionStart.copy(this.object.quaternion),this._scaleStart.copy(this.object.scale),this.object.matrixWorld.decompose(this.worldPositionStart,this.worldQuaternionStart,this._worldScaleStart),this.pointStart.copy(t.point).sub(this.worldPositionStart)),this.dragging=!0,ic.mode=this.mode,this.dispatchEvent(ic)}}pointerMove(e){const t=this.axis,i=this.mode,s=this.object;let r=this.space;if(i==="scale"?r="local":(t==="E"||t==="XYZE"||t==="XYZ")&&(r="world"),s===void 0||t===null||this.dragging===!1||e!==null&&e.button!==-1)return;e!==null&&ci.setFromCamera(e,this.camera);const a=Ma(this._plane,ci,!0);if(a){if(this.pointEnd.copy(a.point).sub(this.worldPositionStart),i==="translate")this._offset.copy(this.pointEnd).sub(this.pointStart),r==="local"&&t!=="XYZ"&&this._offset.applyQuaternion(this._worldQuaternionInv),t.indexOf("X")===-1&&(this._offset.x=0),t.indexOf("Y")===-1&&(this._offset.y=0),t.indexOf("Z")===-1&&(this._offset.z=0),r==="local"&&t!=="XYZ"?this._offset.applyQuaternion(this._quaternionStart).divide(this._parentScale):this._offset.applyQuaternion(this._parentQuaternionInv).divide(this._parentScale),s.position.copy(this._offset).add(this._positionStart),this.translationSnap&&(r==="local"&&(s.position.applyQuaternion(xt.copy(this._quaternionStart).invert()),t.search("X")!==-1&&(s.position.x=Math.round(s.position.x/this.translationSnap)*this.translationSnap),t.search("Y")!==-1&&(s.position.y=Math.round(s.position.y/this.translationSnap)*this.translationSnap),t.search("Z")!==-1&&(s.position.z=Math.round(s.position.z/this.translationSnap)*this.translationSnap),s.position.applyQuaternion(this._quaternionStart)),r==="world"&&(s.parent&&s.position.add(Ht.setFromMatrixPosition(s.parent.matrixWorld)),t.search("X")!==-1&&(s.position.x=Math.round(s.position.x/this.translationSnap)*this.translationSnap),t.search("Y")!==-1&&(s.position.y=Math.round(s.position.y/this.translationSnap)*this.translationSnap),t.search("Z")!==-1&&(s.position.z=Math.round(s.position.z/this.translationSnap)*this.translationSnap),s.parent&&s.position.sub(Ht.setFromMatrixPosition(s.parent.matrixWorld)))),s.position.x=Math.max(this.minX,Math.min(this.maxX,s.position.x)),s.position.y=Math.max(this.minY,Math.min(this.maxY,s.position.y)),s.position.z=Math.max(this.minZ,Math.min(this.maxZ,s.position.z));else if(i==="scale"){if(t.search("XYZ")!==-1){let o=this.pointEnd.length()/this.pointStart.length();this.pointEnd.dot(this.pointStart)<0&&(o*=-1),Xn.set(o,o,o)}else Ht.copy(this.pointStart),Xn.copy(this.pointEnd),Ht.applyQuaternion(this._worldQuaternionInv),Xn.applyQuaternion(this._worldQuaternionInv),Xn.divide(Ht),t.search("X")===-1&&(Xn.x=1),t.search("Y")===-1&&(Xn.y=1),t.search("Z")===-1&&(Xn.z=1);s.scale.copy(this._scaleStart).multiply(Xn),this.scaleSnap&&(t.search("X")!==-1&&(s.scale.x=Math.round(s.scale.x/this.scaleSnap)*this.scaleSnap||this.scaleSnap),t.search("Y")!==-1&&(s.scale.y=Math.round(s.scale.y/this.scaleSnap)*this.scaleSnap||this.scaleSnap),t.search("Z")!==-1&&(s.scale.z=Math.round(s.scale.z/this.scaleSnap)*this.scaleSnap||this.scaleSnap))}else if(i==="rotate"){this._offset.copy(this.pointEnd).sub(this.pointStart);const o=20/this.worldPosition.distanceTo(Ht.setFromMatrixPosition(this.camera.matrixWorld));let l=!1;t==="XYZE"?(this.rotationAxis.copy(this._offset).cross(this.eye).normalize(),this.rotationAngle=this._offset.dot(Ht.copy(this.rotationAxis).cross(this.eye))*o):(t==="X"||t==="Y"||t==="Z")&&(this.rotationAxis.copy(nc[t]),Ht.copy(nc[t]),r==="local"&&Ht.applyQuaternion(this.worldQuaternion),Ht.cross(this.eye),Ht.length()===0?l=!0:this.rotationAngle=this._offset.dot(Ht.normalize())*o),(t==="E"||l)&&(this.rotationAxis.copy(this.eye),this.rotationAngle=this.pointEnd.angleTo(this.pointStart),this._startNorm.copy(this.pointStart).normalize(),this._endNorm.copy(this.pointEnd).normalize(),this.rotationAngle*=this._endNorm.cross(this._startNorm).dot(this.eye)<0?1:-1),this.rotationSnap&&(this.rotationAngle=Math.round(this.rotationAngle/this.rotationSnap)*this.rotationSnap),r==="local"&&t!=="E"&&t!=="XYZE"?(s.quaternion.copy(this._quaternionStart),s.quaternion.multiply(xt.setFromAxisAngle(this.rotationAxis,this.rotationAngle)).normalize()):(this.rotationAxis.applyQuaternion(this._parentQuaternionInv),s.quaternion.copy(xt.setFromAxisAngle(this.rotationAxis,this.rotationAngle)),s.quaternion.multiply(this._quaternionStart).normalize())}this.dispatchEvent(ba),this.dispatchEvent(rc)}}pointerUp(e){e!==null&&e.button!==0||(this.dragging&&this.axis!==null&&(sc.mode=this.mode,this.dispatchEvent(sc)),this.dragging=!1,this.axis=null)}dispose(){this.disconnect(),this._root.dispose()}attach(e){return this.object=e,this._root.visible=!0,this}detach(){return this.object=void 0,this.axis=null,this._root.visible=!1,this}reset(){this.enabled&&this.dragging&&(this.object.position.copy(this._positionStart),this.object.quaternion.copy(this._quaternionStart),this.object.scale.copy(this._scaleStart),this.dispatchEvent(ba),this.dispatchEvent(rc),this.pointStart.copy(this.pointEnd))}getRaycaster(){return ci}getMode(){return this.mode}setMode(e){this.mode=e}setTranslationSnap(e){this.translationSnap=e}setRotationSnap(e){this.rotationSnap=e}setScaleSnap(e){this.scaleSnap=e}setSize(e){this.size=e}setSpace(e){this.space=e}setColors(e,t,i,s){const r=this._gizmo.materialLib;r.xAxis.color.set(e),r.yAxis.color.set(t),r.zAxis.color.set(i),r.active.color.set(s),r.xAxisTransparent.color.set(e),r.yAxisTransparent.color.set(t),r.zAxisTransparent.color.set(i),r.activeTransparent.color.set(s),r.xAxis._color&&r.xAxis._color.set(e),r.yAxis._color&&r.yAxis._color.set(t),r.zAxis._color&&r.zAxis._color.set(i),r.active._color&&r.active._color.set(s),r.xAxisTransparent._color&&r.xAxisTransparent._color.set(e),r.yAxisTransparent._color&&r.yAxisTransparent._color.set(t),r.zAxisTransparent._color&&r.zAxisTransparent._color.set(i),r.activeTransparent._color&&r.activeTransparent._color.set(s)}}function ov(n){if(this.domElement.ownerDocument.pointerLockElement)return{x:0,y:0,button:n.button};{const e=this.domElement.getBoundingClientRect();return{x:(n.clientX-e.left)/e.width*2-1,y:-(n.clientY-e.top)/e.height*2+1,button:n.button}}}function lv(n){if(this.enabled)switch(n.pointerType){case"mouse":case"pen":this.pointerHover(this._getPointer(n));break}}function cv(n){this.enabled&&(document.pointerLockElement||this.domElement.setPointerCapture(n.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.pointerHover(this._getPointer(n)),this.pointerDown(this._getPointer(n)))}function dv(n){this.enabled&&this.pointerMove(this._getPointer(n))}function uv(n){this.enabled&&(this.domElement.releasePointerCapture(n.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.pointerUp(this._getPointer(n)))}function Ma(n,e,t){const i=e.intersectObject(n,!0);for(let s=0;s<i.length;s++)if(i[s].object.visible||t)return i[s];return!1}const fr=new gn,pt=new L(0,1,0),ac=new L(0,0,0),oc=new dt,pr=new Ot,Mr=new Ot,xn=new L,lc=new dt,ps=new L(1,0,0),hi=new L(0,1,0),ms=new L(0,0,1),mr=new L,ls=new L,cs=new L;class hv extends Ct{constructor(e){super(),this.isTransformControlsRoot=!0,this.controls=e,this.visible=!1}updateMatrixWorld(e){const t=this.controls;t.object!==void 0&&(t.object.updateMatrixWorld(),t.object.parent===null?console.error("TransformControls: The attached 3D object must be a part of the scene graph."):t.object.parent.matrixWorld.decompose(t._parentPosition,t._parentQuaternion,t._parentScale),t.object.matrixWorld.decompose(t.worldPosition,t.worldQuaternion,t._worldScale),t._parentQuaternionInv.copy(t._parentQuaternion).invert(),t._worldQuaternionInv.copy(t.worldQuaternion).invert()),t.camera.updateMatrixWorld(),t.camera.matrixWorld.decompose(t.cameraPosition,t.cameraQuaternion,t._cameraScale),t.camera.isOrthographicCamera?t.camera.getWorldDirection(t.eye).negate():t.eye.copy(t.cameraPosition).sub(t.worldPosition).normalize(),super.updateMatrixWorld(e)}dispose(){this.traverse(function(e){e.geometry&&e.geometry.dispose(),e.material&&e.material.dispose()})}}class fv extends Ct{constructor(){super(),this.isTransformControlsGizmo=!0,this.type="TransformControlsGizmo";const e=new Ir({depthTest:!1,depthWrite:!1,fog:!1,toneMapped:!1,transparent:!0}),t=new Zi({depthTest:!1,depthWrite:!1,fog:!1,toneMapped:!1,transparent:!0}),i=e.clone();i.opacity=.15;const s=t.clone();s.opacity=.5;const r=e.clone();r.color.setHex(16711680);const a=e.clone();a.color.setHex(65280);const o=e.clone();o.color.setHex(255);const l=e.clone();l.color.setHex(16711680),l.opacity=.5;const c=e.clone();c.color.setHex(65280),c.opacity=.5;const d=e.clone();d.color.setHex(255),d.opacity=.5;const u=e.clone();u.opacity=.25;const h=e.clone();h.color.setHex(16776960),h.opacity=.25;const m=e.clone();m.color.setHex(16776960);const _=e.clone();_.color.setHex(7895160),this.materialLib={xAxis:r,yAxis:a,zAxis:o,active:m,xAxisTransparent:l,yAxisTransparent:c,zAxisTransparent:d,activeTransparent:h};const x=new Ft(0,.04,.1,12);x.translate(0,.05,0);const p=new St(.08,.08,.08);p.translate(0,.04,0);const f=new Nt;f.setAttribute("position",new rt([0,0,0,1,0,0],3));const y=new Ft(.0075,.0075,.5,3);y.translate(0,.25,0);function v(k,$){const q=new pi(k,.0075,3,64,$*Math.PI*2);return q.rotateY(Math.PI/2),q.rotateX(Math.PI/2),q}function g(){const k=new Nt;return k.setAttribute("position",new rt([0,0,0,1,1,1],3)),k}const E={X:[[new ye(x,r),[.5,0,0],[0,0,-Math.PI/2]],[new ye(x,r),[-.5,0,0],[0,0,Math.PI/2]],[new ye(y,r),[0,0,0],[0,0,-Math.PI/2]]],Y:[[new ye(x,a),[0,.5,0]],[new ye(x,a),[0,-.5,0],[Math.PI,0,0]],[new ye(y,a)]],Z:[[new ye(x,o),[0,0,.5],[Math.PI/2,0,0]],[new ye(x,o),[0,0,-.5],[-Math.PI/2,0,0]],[new ye(y,o),null,[Math.PI/2,0,0]]],XYZ:[[new ye(new ki(.1,0),u),[0,0,0]]],XY:[[new ye(new St(.15,.15,.01),d),[.15,.15,0]]],YZ:[[new ye(new St(.15,.15,.01),l),[0,.15,.15],[0,Math.PI/2,0]]],XZ:[[new ye(new St(.15,.15,.01),c),[.15,0,.15],[-Math.PI/2,0,0]]]},T={X:[[new ye(new Ft(.2,0,.6,4),i),[.3,0,0],[0,0,-Math.PI/2]],[new ye(new Ft(.2,0,.6,4),i),[-.3,0,0],[0,0,Math.PI/2]]],Y:[[new ye(new Ft(.2,0,.6,4),i),[0,.3,0]],[new ye(new Ft(.2,0,.6,4),i),[0,-.3,0],[0,0,Math.PI]]],Z:[[new ye(new Ft(.2,0,.6,4),i),[0,0,.3],[Math.PI/2,0,0]],[new ye(new Ft(.2,0,.6,4),i),[0,0,-.3],[-Math.PI/2,0,0]]],XYZ:[[new ye(new ki(.2,0),i)]],XY:[[new ye(new St(.2,.2,.01),i),[.15,.15,0]]],YZ:[[new ye(new St(.2,.2,.01),i),[0,.15,.15],[0,Math.PI/2,0]]],XZ:[[new ye(new St(.2,.2,.01),i),[.15,0,.15],[-Math.PI/2,0,0]]]},S={START:[[new ye(new ki(.01,2),s),null,null,null,"helper"]],END:[[new ye(new ki(.01,2),s),null,null,null,"helper"]],DELTA:[[new Fn(g(),s),null,null,null,"helper"]],X:[[new Fn(f,s),[-1e3,0,0],null,[1e6,1,1],"helper"]],Y:[[new Fn(f,s),[0,-1e3,0],[0,0,Math.PI/2],[1e6,1,1],"helper"]],Z:[[new Fn(f,s),[0,0,-1e3],[0,-Math.PI/2,0],[1e6,1,1],"helper"]]},A={XYZE:[[new ye(v(.5,1),_),null,[0,Math.PI/2,0]]],X:[[new ye(v(.5,.5),r)]],Y:[[new ye(v(.5,.5),a),null,[0,0,-Math.PI/2]]],Z:[[new ye(v(.5,.5),o),null,[0,Math.PI/2,0]]],E:[[new ye(v(.75,1),h),null,[0,Math.PI/2,0]]]},M={AXIS:[[new Fn(f,s),[-1e3,0,0],null,[1e6,1,1],"helper"]]},b={XYZE:[[new ye(new Ds(.25,10,8),i)]],X:[[new ye(new pi(.5,.1,4,24),i),[0,0,0],[0,-Math.PI/2,-Math.PI/2]]],Y:[[new ye(new pi(.5,.1,4,24),i),[0,0,0],[Math.PI/2,0,0]]],Z:[[new ye(new pi(.5,.1,4,24),i),[0,0,0],[0,0,-Math.PI/2]]],E:[[new ye(new pi(.75,.1,2,24),i)]]},R={X:[[new ye(p,r),[.5,0,0],[0,0,-Math.PI/2]],[new ye(y,r),[0,0,0],[0,0,-Math.PI/2]],[new ye(p,r),[-.5,0,0],[0,0,Math.PI/2]]],Y:[[new ye(p,a),[0,.5,0]],[new ye(y,a)],[new ye(p,a),[0,-.5,0],[0,0,Math.PI]]],Z:[[new ye(p,o),[0,0,.5],[Math.PI/2,0,0]],[new ye(y,o),[0,0,0],[Math.PI/2,0,0]],[new ye(p,o),[0,0,-.5],[-Math.PI/2,0,0]]],XY:[[new ye(new St(.15,.15,.01),d),[.15,.15,0]]],YZ:[[new ye(new St(.15,.15,.01),l),[0,.15,.15],[0,Math.PI/2,0]]],XZ:[[new ye(new St(.15,.15,.01),c),[.15,0,.15],[-Math.PI/2,0,0]]],XYZ:[[new ye(new St(.1,.1,.1),u)]]},I={X:[[new ye(new Ft(.2,0,.6,4),i),[.3,0,0],[0,0,-Math.PI/2]],[new ye(new Ft(.2,0,.6,4),i),[-.3,0,0],[0,0,Math.PI/2]]],Y:[[new ye(new Ft(.2,0,.6,4),i),[0,.3,0]],[new ye(new Ft(.2,0,.6,4),i),[0,-.3,0],[0,0,Math.PI]]],Z:[[new ye(new Ft(.2,0,.6,4),i),[0,0,.3],[Math.PI/2,0,0]],[new ye(new Ft(.2,0,.6,4),i),[0,0,-.3],[-Math.PI/2,0,0]]],XY:[[new ye(new St(.2,.2,.01),i),[.15,.15,0]]],YZ:[[new ye(new St(.2,.2,.01),i),[0,.15,.15],[0,Math.PI/2,0]]],XZ:[[new ye(new St(.2,.2,.01),i),[.15,0,.15],[-Math.PI/2,0,0]]],XYZ:[[new ye(new St(.2,.2,.2),i),[0,0,0]]]},B={X:[[new Fn(f,s),[-1e3,0,0],null,[1e6,1,1],"helper"]],Y:[[new Fn(f,s),[0,-1e3,0],[0,0,Math.PI/2],[1e6,1,1],"helper"]],Z:[[new Fn(f,s),[0,0,-1e3],[0,-Math.PI/2,0],[1e6,1,1],"helper"]]};function H(k){const $=new Ct;for(const q in k)for(let W=k[q].length;W--;){const ie=k[q][W][0].clone(),pe=k[q][W][1],be=k[q][W][2],Oe=k[q][W][3],qe=k[q][W][4];ie.name=q,ie.tag=qe,pe&&ie.position.set(pe[0],pe[1],pe[2]),be&&ie.rotation.set(be[0],be[1],be[2]),Oe&&ie.scale.set(Oe[0],Oe[1],Oe[2]),ie.updateMatrix();const Qe=ie.geometry.clone();Qe.applyMatrix4(ie.matrix),ie.geometry=Qe,ie.renderOrder=1/0,ie.position.set(0,0,0),ie.rotation.set(0,0,0),ie.scale.set(1,1,1),$.add(ie)}return $}this.gizmo={},this.picker={},this.helper={},this.add(this.gizmo.translate=H(E)),this.add(this.gizmo.rotate=H(A)),this.add(this.gizmo.scale=H(R)),this.add(this.picker.translate=H(T)),this.add(this.picker.rotate=H(b)),this.add(this.picker.scale=H(I)),this.add(this.helper.translate=H(S)),this.add(this.helper.rotate=H(M)),this.add(this.helper.scale=H(B)),this.picker.translate.visible=!1,this.picker.rotate.visible=!1,this.picker.scale.visible=!1}updateMatrixWorld(e){const i=(this.mode==="scale"?"local":this.space)==="local"?this.worldQuaternion:Mr;this.gizmo.translate.visible=this.mode==="translate",this.gizmo.rotate.visible=this.mode==="rotate",this.gizmo.scale.visible=this.mode==="scale",this.helper.translate.visible=this.mode==="translate",this.helper.rotate.visible=this.mode==="rotate",this.helper.scale.visible=this.mode==="scale";let s=[];s=s.concat(this.picker[this.mode].children),s=s.concat(this.gizmo[this.mode].children),s=s.concat(this.helper[this.mode].children);for(let r=0;r<s.length;r++){const a=s[r];a.visible=!0,a.rotation.set(0,0,0),a.position.copy(this.worldPosition);let o;if(this.camera.isOrthographicCamera?o=(this.camera.top-this.camera.bottom)/this.camera.zoom:o=this.worldPosition.distanceTo(this.cameraPosition)*Math.min(1.9*Math.tan(Math.PI*this.camera.fov/360)/this.camera.zoom,7),a.scale.set(1,1,1).multiplyScalar(o*this.size/4),a.tag==="helper"){a.visible=!1,a.name==="AXIS"?(a.visible=!!this.axis,this.axis==="X"&&(xt.setFromEuler(fr.set(0,0,0)),a.quaternion.copy(i).multiply(xt),Math.abs(pt.copy(ps).applyQuaternion(i).dot(this.eye))>.9&&(a.visible=!1)),this.axis==="Y"&&(xt.setFromEuler(fr.set(0,0,Math.PI/2)),a.quaternion.copy(i).multiply(xt),Math.abs(pt.copy(hi).applyQuaternion(i).dot(this.eye))>.9&&(a.visible=!1)),this.axis==="Z"&&(xt.setFromEuler(fr.set(0,Math.PI/2,0)),a.quaternion.copy(i).multiply(xt),Math.abs(pt.copy(ms).applyQuaternion(i).dot(this.eye))>.9&&(a.visible=!1)),this.axis==="XYZE"&&(xt.setFromEuler(fr.set(0,Math.PI/2,0)),pt.copy(this.rotationAxis),a.quaternion.setFromRotationMatrix(oc.lookAt(ac,pt,hi)),a.quaternion.multiply(xt),a.visible=this.dragging),this.axis==="E"&&(a.visible=!1)):a.name==="START"?(a.position.copy(this.worldPositionStart),a.visible=this.dragging):a.name==="END"?(a.position.copy(this.worldPosition),a.visible=this.dragging):a.name==="DELTA"?(a.position.copy(this.worldPositionStart),a.quaternion.copy(this.worldQuaternionStart),Ht.set(1e-10,1e-10,1e-10).add(this.worldPositionStart).sub(this.worldPosition).multiplyScalar(-1),Ht.applyQuaternion(this.worldQuaternionStart.clone().invert()),a.scale.copy(Ht),a.visible=this.dragging):(a.quaternion.copy(i),this.dragging?a.position.copy(this.worldPositionStart):a.position.copy(this.worldPosition),this.axis&&(a.visible=this.axis.search(a.name)!==-1));continue}a.quaternion.copy(i),this.mode==="translate"||this.mode==="scale"?(a.name==="X"&&Math.abs(pt.copy(ps).applyQuaternion(i).dot(this.eye))>.99&&(a.scale.set(1e-10,1e-10,1e-10),a.visible=!1),a.name==="Y"&&Math.abs(pt.copy(hi).applyQuaternion(i).dot(this.eye))>.99&&(a.scale.set(1e-10,1e-10,1e-10),a.visible=!1),a.name==="Z"&&Math.abs(pt.copy(ms).applyQuaternion(i).dot(this.eye))>.99&&(a.scale.set(1e-10,1e-10,1e-10),a.visible=!1),a.name==="XY"&&Math.abs(pt.copy(ms).applyQuaternion(i).dot(this.eye))<.2&&(a.scale.set(1e-10,1e-10,1e-10),a.visible=!1),a.name==="YZ"&&Math.abs(pt.copy(ps).applyQuaternion(i).dot(this.eye))<.2&&(a.scale.set(1e-10,1e-10,1e-10),a.visible=!1),a.name==="XZ"&&Math.abs(pt.copy(hi).applyQuaternion(i).dot(this.eye))<.2&&(a.scale.set(1e-10,1e-10,1e-10),a.visible=!1)):this.mode==="rotate"&&(pr.copy(i),pt.copy(this.eye).applyQuaternion(xt.copy(i).invert()),a.name.search("E")!==-1&&a.quaternion.setFromRotationMatrix(oc.lookAt(this.eye,ac,hi)),a.name==="X"&&(xt.setFromAxisAngle(ps,Math.atan2(-pt.y,pt.z)),xt.multiplyQuaternions(pr,xt),a.quaternion.copy(xt)),a.name==="Y"&&(xt.setFromAxisAngle(hi,Math.atan2(pt.x,pt.z)),xt.multiplyQuaternions(pr,xt),a.quaternion.copy(xt)),a.name==="Z"&&(xt.setFromAxisAngle(ms,Math.atan2(pt.y,pt.x)),xt.multiplyQuaternions(pr,xt),a.quaternion.copy(xt))),a.visible=a.visible&&(a.name.indexOf("X")===-1||this.showX),a.visible=a.visible&&(a.name.indexOf("Y")===-1||this.showY),a.visible=a.visible&&(a.name.indexOf("Z")===-1||this.showZ),a.visible=a.visible&&(a.name.indexOf("E")===-1||this.showX&&this.showY&&this.showZ),a.material._color=a.material._color||a.material.color.clone(),a.material._opacity=a.material._opacity||a.material.opacity,a.material.color.copy(a.material._color),a.material.opacity=a.material._opacity,this.enabled&&this.axis&&(a.name===this.axis?(a.material.color.copy(this.materialLib.active.color),a.material.opacity=1):this.axis.split("").some(function(l){return a.name===l})&&(a.material.color.copy(this.materialLib.active.color),a.material.opacity=1))}super.updateMatrixWorld(e)}}class pv extends ye{constructor(){super(new Ls(1e5,1e5,2,2),new Ir({visible:!1,wireframe:!0,side:fn,transparent:!0,opacity:.1,toneMapped:!1})),this.isTransformControlsPlane=!0,this.type="TransformControlsPlane"}updateMatrixWorld(e){let t=this.space;switch(this.position.copy(this.worldPosition),this.mode==="scale"&&(t="local"),mr.copy(ps).applyQuaternion(t==="local"?this.worldQuaternion:Mr),ls.copy(hi).applyQuaternion(t==="local"?this.worldQuaternion:Mr),cs.copy(ms).applyQuaternion(t==="local"?this.worldQuaternion:Mr),pt.copy(ls),this.mode){case"translate":case"scale":switch(this.axis){case"X":pt.copy(this.eye).cross(mr),xn.copy(mr).cross(pt);break;case"Y":pt.copy(this.eye).cross(ls),xn.copy(ls).cross(pt);break;case"Z":pt.copy(this.eye).cross(cs),xn.copy(cs).cross(pt);break;case"XY":xn.copy(cs);break;case"YZ":xn.copy(mr);break;case"XZ":pt.copy(cs),xn.copy(ls);break;case"XYZ":case"E":xn.set(0,0,0);break}break;case"rotate":default:xn.set(0,0,0)}xn.length()===0?this.quaternion.copy(this.cameraQuaternion):(lc.lookAt(Ht.set(0,0,0),xn,pt),this.quaternion.setFromRotationMatrix(lc)),super.updateMatrixWorld(e)}}function cc(n,e,t){var s,r;if(n.dimension==="2d"&&e===2)return 0;if(n.mesh_type==="explicit"&&((s=n.mesh_coordinates)!=null&&s[e])){const a=n.mesh_coordinates[e];let o=0,l=a.length-1;for(;l-o>1;){const c=o+l>>1;a[c]<t?o=c:l=c}return Math.abs(a[o]-t)<=Math.abs(a[l]-t)?a[o]:a[l]}const i=((r=n.mesh_steps)==null?void 0:r[e])??n.mesh;return Math.round(t/i)*i}function mv(n,e,t){var a,o,l;if(n.dimension==="2d"&&e===2)return 0;const i=(a=n.boundaries)==null?void 0:a["xyz"[e]+"_"+t];if(i&&i.kind!=="pml")return 0;const s=(i==null?void 0:i.layers)??n.pml_cells,r=(o=n.mesh_coordinates)==null?void 0:o[e];return n.mesh_type==="explicit"&&r?t==="min"?r[s]-r[0]:r.at(-1)-r.at(-s-1):s*(((l=n.mesh_steps)==null?void 0:l[e])??n.mesh)}function gv(n,e,t,i){n.mesh_type??(n.mesh_type="uniform"),n.material_sampling??(n.material_sampling="cell"),n.interface_method??(n.interface_method="staircase"),n.subpixel_quadrature??(n.subpixel_quadrature=8),n.mesh_max??(n.mesh_max=.15),n.mesh_grading??(n.mesh_grading=1.25),n.mesh_ppw??(n.mesh_ppw=24),n.mesh_auto_refine??(n.mesh_auto_refine=!0),n.mesh_refinements??(n.mesh_refinements=[]);const s=n.mesh_type==="graded",r=n.mesh_type==="explicit",a=!!n.mesh_steps;return t("mesh type","mesh_type",n.mesh_type,[["uniform","Uniform"],["graded","Graded · local refinement"],...r?[["explicit","Explicit node arrays"]]:[]])+(r?'<p class="property-help">Frozen node arrays. Geometry edits keep these nodes. Edit the arrays or select a generated mesh to change the grid.</p>':`<label class="enabled-row"><input type="checkbox" data-axis-steps ${a?"checked":""}> Independent axis spacing</label>`+(a?n.mesh_steps.map((o,l)=>e("d"+"xyz"[l],`mesh_steps.${l}`,o,"µm",{min:.001})).join(""):e(s?"fine mesh step":"dx = dy = dz","mesh",n.mesh,"µm",{min:.001})))+t("interface method","interface_method",n.interface_method,[["staircase","Staircase"],["subpixel","Subpixel · experimental dielectric"]])+t("interface sampling","material_sampling",n.material_sampling,s||r||a||n.interface_method==="subpixel"?[["yee","Yee component locations"]]:[["cell","Cell centers (legacy)"],["yee","Yee component locations"]])+(n.interface_method==="subpixel"?e("face quadrature order","subpixel_quadrature",n.subpixel_quadrature,"",{min:2,max:32,step:1})+'<p class="property-help">Lossless dielectrics and constant spacing on each axis only. Compare quadrature orders and mesh refinement. Curved-interface accuracy is under validation, especially at high index contrast.</p>':"")+`<label class="enabled-row"><input type="checkbox" data-fixed-dt ${n.time_step_override?"checked":""}> Set a smaller fixed time step</label>`+(n.time_step_override?e("time step","time_step_override",n.time_step_override*1e15,"fs",{min:1e-6,scale:1e-15}):"")+(s?e("maximum step","mesh_max",n.mesh_max,"µm",{min:n.mesh})+e("grading factor","mesh_grading",n.mesh_grading,"",{min:1.05})+e("background cells / λ","mesh_ppw",n.mesh_ppw,"",{min:6})+`<label class="enabled-row"><input type="checkbox" data-path="mesh_auto_refine" ${n.mesh_auto_refine?"checked":""}> Refine structures, sources and monitors</label><p class="property-help">Fine spacing is retained in refinement regions and PML. The wavelength setting caps the background step. The timestep stays fixed by the fine spacing.</p>`+n.mesh_refinements.map((o,l)=>`<details class="boundary-options"><summary>${i(o.name)}</summary><label class="enabled-row"><input type="checkbox" data-path="mesh_refinements.${l}.enabled" ${o.enabled?"checked":""}> Enabled</label>${o.center.map((c,d)=>e("xyz"[d],`mesh_refinements.${l}.center.${d}`,c,"µm")).join("")}${o.size.map((c,d)=>e("xyz"[d]+" span",`mesh_refinements.${l}.size.${d}`,c,"µm",{min:.001})).join("")}<button data-action="mesh-remove" data-index="${l}">Remove refinement</button></details>`).join("")+'<button data-action="mesh-add">+ Add refinement region</button><button data-action="mesh-freeze">Freeze automatic refinements</button>':"")+`<button data-action="mesh-nodes">Edit explicit node arrays</button><button data-action="mesh-preview">Preview simulation mesh</button><p class="property-help">Yee sampling places materials at each electric field component. ${n.interface_method==="subpixel"?"Subpixel also couples neighboring components across interfaces. The permittivity image shows only the reciprocal diagonal of that operator.":"Staircase interfaces follow the grid."} Test mesh convergence for the required accuracy.</p>`}function _v({state:n,api:e,esc:t,commit:i}){const s=document.createElement("dialog");s.className="mesh-dialog",document.body.append(s);let r,a="xy";const o=c=>s.querySelector(c);function l(){const c=o("canvas"),d=c.getContext("2d");c.width=1e3,c.height=600;const[u,h]=[...a].map(S=>"xyz".indexOf(S)),m=r.nodes_um,_=m[u],x=m[h],p=_.at(-1)-_[0],f=x.at(-1)-x[0],y=Math.min(880/p,480/f),v=(1e3-p*y)/2,g=(600-f*y)/2,E=S=>v+(S-_[0])*y,T=S=>g+(x.at(-1)-S)*y;d.fillStyle="#101c2b",d.fillRect(0,0,1e3,600);for(const S of r.refinements)d.fillStyle="rgba(71,191,169,.13)",d.fillRect(E(S.center[u]-S.size[u]/2),T(S.center[h]+S.size[h]/2),S.size[u]*y,S.size[h]*y);d.save(),d.beginPath(),d.rect(v,g,p*y,f*y),d.clip(),d.strokeStyle="#7087a56e",d.lineWidth=.7,d.beginPath();for(const S of _)d.moveTo(E(S),g),d.lineTo(E(S),g+f*y);for(const S of x)d.moveTo(v,T(S)),d.lineTo(v+p*y,T(S));d.stroke();for(const S of r.structures)d.strokeStyle="#ecb86a",d.lineWidth=2,d.strokeRect(E(S.center[u]-S.size[u]/2),T(S.center[h]+S.size[h]/2),S.size[u]*y,S.size[h]*y);d.restore(),d.fillStyle="#d9e7f5",d.font="15px system-ui",d.textAlign="center",d.fillText(`${a[0]} (µm) · ${_[0].toPrecision(4)} … ${_.at(-1).toPrecision(4)}`,500,585),d.save(),d.translate(20,300),d.rotate(-Math.PI/2),d.fillText(`${a[1]} (µm) · ${x[0].toPrecision(4)} … ${x.at(-1).toPrecision(4)}`,0,0),d.restore()}return{async open(){r=await e("/mesh/preview",n.project);const c=r.summary;s.innerHTML=`<div class="fsp-heading"><h2>Simulation mesh</h2><button data-dismiss>Close</button></div><div class="mesh-metrics"><strong>${c.shape.join(" × ")} cells</strong><span>${c.cell_reduction_percent.toFixed(1)}% fewer cells than uniform</span><span>~${c.estimated_memory_mb} MB · Δt ${c.dt_fs.toFixed(4)} fs</span></div><label>Projection <select aria-label="Mesh projection">${(n.project.region.dimension==="2d"?["xy"]:["xy","xz","yz"]).map(d=>`<option>${d}</option>`).join("")}</select></label><canvas aria-label="Simulation mesh grid"></canvas><p>Gold: structure bounds. Green: refinement bounds projected onto this view. Grid lines show actual cell boundaries${r.preview_decimated?" (preview decimated to 1,000 lines per axis)":""}. Refinements extend across coordinate planes.</p><p>Step range: ${c.axis_min_step_um.map((d,u)=>`${"xyz"[u]} ${d.toPrecision(4)}–${c.axis_max_step_um[u].toPrecision(4)} µm`).join(" · ")}. Largest adjacent ratio: ${c.max_adjacent_ratio.toFixed(3)}.</p>`,a="xy",o("[data-dismiss]").onclick=()=>s.close(),o("select").onchange=d=>{a=d.target.value,l()},s.showModal(),l()},async freeze(){const c=await e("/mesh/freeze",n.project);i(c)},async editNodes(){const{nodes_um:c}=await e("/mesh/coordinates",n.project);s.innerHTML='<div class="fsp-heading"><h2>Explicit mesh nodes</h2><button data-dismiss>Close</button></div><p>Coordinates in µm. Each axis must increase strictly and be centered on zero. Array endpoints set the domain spans. In 2D, z needs exactly two endpoints. Changing geometry will keep this grid.</p>'+c.map((d,u)=>`<label>${"xyz"[u]} nodes (µm)<textarea aria-label="${"xyz"[u]} mesh nodes" data-node-axis="${u}" rows="5" style="width:100%">${d.join(", ")}</textarea></label>`).join("")+'<p data-node-error role="alert"></p><button data-apply-nodes>Apply node arrays</button>',o("[data-dismiss]").onclick=()=>s.close(),o("[data-apply-nodes]").onclick=async()=>{try{const d=[...s.querySelectorAll("[data-node-axis]")].map(m=>m.value.trim().split(/[\s,]+/).filter(Boolean).map(Number));if(d.some(m=>m.length<2||m.some(_=>!Number.isFinite(_))))throw Error("Enter at least two finite numbers for each axis.");const u=structuredClone(n.project);Object.assign(u.region,{mesh_type:"explicit",mesh_steps:null,mesh_coordinates:d,size:d.map(m=>m.at(-1)-m[0]),material_sampling:"yee",mesh_auto_refine:!1});const h=await e("/validate",u);i(h.project),s.close()}catch(d){o("[data-node-error]").textContent=d.message}},s.showModal()},add(){const c=structuredClone(n.project);c.region.mesh_refinements.push({name:`Refinement ${c.region.mesh_refinements.length+1}`,center:[0,0,0],size:[1,1,1],enabled:!0}),i(c)},remove(c){const d=structuredClone(n.project);d.region.mesh_refinements.splice(c,1),i(d)}}}function Nr(n){return n.rotation??(n.rotation=0),n.rotation_axes??(n.rotation_axes=["z","x","y"]),n.rotation_angles??(n.rotation_angles=[0,0,0]),n.make_ellipsoid??(n.make_ellipsoid=!1),n.radius_2??(n.radius_2=.5),n.radius_3??(n.radius_3=.5),n.inner_radius_2??(n.inner_radius_2=.3),n.theta_start??(n.theta_start=0),n.theta_stop??(n.theta_stop=360),n.vertices??(n.vertices=[[-.5,-.5],[.5,-.5],[0,.5]]),n}function vv(n){const e=new dt().makeRotationZ((n.rotation||0)*Math.PI/180);return(n.rotation_axes||["z","x","y"]).forEach((t,i)=>{var r;if(t==="none")return;const s=new L;s.setComponent("xyz".indexOf(t),1),e.premultiply(new dt().makeRotationAxis(s,(((r=n.rotation_angles)==null?void 0:r[i])||0)*Math.PI/180))}),e}function xv(n){const e=n.radius,t=n.make_ellipsoid?n.radius_2:e,i=n.make_ellipsoid?n.radius_3:e;if(n.kind==="rectangle")return new St(...n.size);if(n.kind==="sphere")return new Ds(1,48,32).scale(e,t,i);if(n.kind==="circle")return new Ft(1,1,n.size[2],96).rotateX(Math.PI/2).scale(e,t,1);let s;if(n.kind==="polygon")s=new yr(n.vertices.map(r=>new oe(...r)));else if(n.kind==="ring"){const r=(n.theta_stop??360)-(n.theta_start??0),a=(r%360+360)%360||360,o=a===360,l=Math.max(3,Math.ceil(96*a/360)),c=(h,m)=>Array.from({length:o?l:l+1},(_,x)=>{const p=((n.theta_start??0)+a*x/l)*Math.PI/180,f=Math.cos(p),y=Math.sin(p),v=1/Math.sqrt((f/h)**2+(y/m)**2);return new oe(v*f,v*y)}),d=c(e,t),u=n.inner_radius>0?c(n.inner_radius,n.make_ellipsoid?n.inner_radius_2:n.inner_radius):[];o?(s=new yr(d),u.length&&s.holes.push(new go(u.reverse()))):s=new yr([...d,...u.length?u.reverse():[new oe(0,0)]])}if(!s)throw Error("Unsupported CAD solid: "+n.kind);return new No(s,{depth:n.size[2],steps:1,bevelEnabled:!1}).translate(0,0,-n.size[2]/2)}const di=new Map;function ad(n){Nr(n);const e=JSON.stringify([n.kind,n.size,n.radius,n.inner_radius,n.make_ellipsoid,n.radius_2,n.radius_3,n.inner_radius_2,n.theta_start,n.theta_stop,n.vertices,n.rotation,n.rotation_axes,n.rotation_angles]);if(di.has(e))return di.get(e);const t=xv(n).applyMatrix4(vv(n)),i=t.index?t.toNonIndexed():t.clone(),s=new po(t,20),r={geometry:t,points:Array.from(i.attributes.position.array),edges:Array.from(s.attributes.position.array),projections:{}};if(i.dispose(),s.dispose(),di.set(e,r),di.size>128){const a=di.keys().next().value;di.get(a).geometry.dispose(),di.delete(a)}return r}function yv(n){return ad(n).geometry.clone()}function od(n,e){const t=ad(n),i=e.join("");if(t.projections[i])return t.projections[i];const s=[],r=[];let a=1/0,o=-1/0;for(let l=0;l<t.points.length;l+=9){const c=[0,3,6].map(u=>[t.points[l+u+e[0]],t.points[l+u+e[1]]]),d=(c[1][0]-c[0][0])*(c[2][1]-c[0][1])-(c[1][1]-c[0][1])*(c[2][0]-c[0][0]);if(!(Math.abs(d)<1e-18)){d<0&&([c[1],c[2]]=[c[2],c[1]]),s.push(c);for(const u of c)a=Math.min(a,u[1]),o=Math.max(o,u[1])}}for(let l=0;l<t.edges.length;l+=6)r.push([0,3].map(c=>[t.edges[l+c+e[0]],t.edges[l+c+e[1]]]));return t.projections[i]={triangles:s,edges:r,low:a,high:o}}function bv(n,e,t,i){const s=[e[0]-n.center[t[0]],e[1]-n.center[t[1]]],r=od(n,t);return r.triangles.some(a=>a.every((o,l)=>{const c=a[(l+1)%3];return(c[0]-o[0])*(s[1]-o[1])-(c[1]-o[1])*(s[0]-o[0])>=-1e-12}))?!0:r.edges.some(([a,o])=>{const l=o[0]-a[0],c=o[1]-a[1],d=l*l+c*c,u=d?Math.max(0,Math.min(1,((s[0]-a[0])*l+(s[1]-a[1])*c)/d)):0;return Math.hypot(s[0]-a[0]-u*l,s[1]-a[1]-u*c)<=i})}function Mv(n,e){Nr(n);let t="";return["circle","sphere","ring"].includes(n.kind)&&(t+=`<label class="enabled-row"><input type="checkbox" data-path="make_ellipsoid" ${n.make_ellipsoid?"checked":""}> Elliptical radii</label>`,n.make_ellipsoid&&(t+=e("radius 2","radius_2",n.radius_2,"µm",{min:.001})+(n.kind==="sphere"?e("radius 3","radius_3",n.radius_3,"µm",{min:.001}):"")+(n.kind==="ring"?e("inner radius 2","inner_radius_2",n.inner_radius_2,"µm",{min:0}):""))),n.kind==="ring"&&(t+=e("theta start","theta_start",n.theta_start,"deg")+e("theta stop","theta_stop",n.theta_stop,"deg")+'<p class="property-help">Counterclockwise arc in the local XY plane, wrapping through 360°. Angles are polar angles even for elliptical rings.</p>'),n.kind==="polygon"&&(t+=`<button data-action="geometry-vertices">Edit polygon vertices</button><p class="property-help">${n.vertices.length} local XY vertices, extruded along local z. One simple contour without holes.</p>`),t}function Sv(n,e,t){return Nr(n),e("z rotation","rotation",n.rotation,"deg")+n.rotation_axes.map((i,s)=>t(["first","second","third"][s]+" axis",`rotation_axes.${s}`,i,["none","x","y","z"])+e("rotation "+(s+1),`rotation_angles.${s}`,n.rotation_angles[s],"deg")).join("")+'<p class="property-help">Right-handed rotations about fixed world axes. Apply the legacy z angle, then rotations 1, 2 and 3 about the object center. CAD views show projections. A 2D calculation samples z = 0.</p>'}function Ev({state:n,api:e,esc:t,commit:i}){const s=document.createElement("dialog");return s.className="geometry-dialog",document.body.append(s),{open(r){const a=n.project.structures.find(o=>o.id===r);!a||a.kind!=="polygon"||(s.innerHTML=`<div class="fsp-heading"><h2>Polygon vertices</h2><button data-dismiss>Close</button></div><p>Local x, y pairs in µm, one pair per line. Clockwise or counterclockwise. Do not repeat the first vertex.</p><textarea aria-label="Polygon vertices" rows="12" style="width:100%;font-family:monospace">${t(a.vertices.map(o=>o.join(", ")).join(`
`))}</textarea><p role="alert"></p><button data-apply>Apply vertices</button>`,s.querySelector("[data-dismiss]").onclick=()=>s.close(),s.querySelector("[data-apply]").onclick=async()=>{try{const o=s.querySelector("textarea").value.trim().split(/\r?\n/).map(d=>d.trim().split(/[\s,]+/).map(Number));if(o.some(d=>d.length!==2||d.some(u=>!Number.isFinite(u))))throw Error("Each row needs two finite numbers.");const l=structuredClone(n.project);l.structures.find(d=>d.id===r).vertices=o;const c=await e("/validate",l);i(c.project),s.close()}catch(o){s.querySelector('[role="alert"]').textContent=o.message}},s.showModal())}}}const Un={region:"#d2a129",source:"#d44955",monitor:"#e3a72c",selected:"#187be7"};class wv{constructor(e,t,i,s,r){this.state=t,this.select=i,this.change=s,this.edited=r,this.zoom={xy:1,xz:1,yz:1},this.canvases={},e.innerHTML=["xy","perspective","xz","yz"].map(a=>`<div class="viewport ${a}" data-view="${a}"><div class="view-label">${a==="perspective"?"Perspective":a.toUpperCase()+" plane"}<span>${a==="perspective"?"Orbit · left drag / Pan · right drag":"Select · drag to move / scroll to zoom"}</span></div>${a!=="perspective"?"<canvas></canvas>":'<div class="three-view"></div>'}</div>`).join("");for(const[a,o]of Object.entries({xy:[0,1],xz:[0,2],yz:[1,2]})){const l=e.querySelector(`.${a} canvas`);this.canvases[a]={canvas:l,axes:o},l.addEventListener("wheel",c=>{c.preventDefault(),this.zoom[a]=Math.max(.5,Math.min(8,this.zoom[a]*Math.exp(-c.deltaY*.001))),this.draw2d(a)},{passive:!1}),l.addEventListener("pointerdown",c=>this.down(c,a)),l.addEventListener("pointermove",c=>this.move(c,a)),l.addEventListener("pointerup",c=>this.up(c,a)),l.addEventListener("dblclick",()=>{var c;return(c=document.querySelector("#properties input"))==null?void 0:c.focus()})}this.initThree(e.querySelector(".three-view")),this.resizeObserver=new ResizeObserver(()=>this.render()),this.resizeObserver.observe(e)}objects(){const e=this.state.project;return[...e.structures.map(t=>({...t,category:"structure"})),...e.sources.map(t=>({...t,category:"source"})),...e.monitors.map(t=>({...t,category:"monitor"}))]}bounds(e){return e.kind==="sphere"?[e.radius*2,e.radius*2,e.radius*2]:["circle","ring"].includes(e.kind)?[e.radius*2,e.radius*2,e.size[2]]:e.size||[.12,.12,.12]}metrics(e){const{canvas:t,axes:i}=this.canvases[e],s=t.getBoundingClientRect(),r=this.state.project.region.size;return{w:s.width,h:s.height,scale:Math.min((s.width-65)/r[i[0]],(s.height-50)/r[i[1]])*.84*this.zoom[e],axes:i}}world(e,t){const{canvas:i}=this.canvases[t],s=i.getBoundingClientRect(),r=this.metrics(t);return[(e.clientX-s.left-r.w/2)/r.scale,-(e.clientY-s.top-r.h/2)/r.scale]}hit(e,t,i,s){if(e.category==="structure")return bv(e,t,i,s);const r=this.bounds(e);let a=t[0]-e.center[i[0]],o=t[1]-e.center[i[1]];if(i[0]===0&&i[1]===1&&e.category==="structure"){if(["circle","sphere","ring"].includes(e.kind)){const c=Math.hypot(a,o);return c<=e.radius+s&&(e.kind!=="ring"||c>=e.inner_radius-s)}const l=(e.rotation||0)*Math.PI/180;[a,o]=[Math.cos(l)*a+Math.sin(l)*o,-Math.sin(l)*a+Math.cos(l)*o]}return Math.abs(a)<=Math.max(r[i[0]]/2,s)&&Math.abs(o)<=Math.max(r[i[1]]/2,s)}down(e,t){if(e.button!==0)return;const i=this.metrics(t),s=this.world(e,t),a=this.objects().filter(o=>o.enabled).reverse().find(o=>this.hit(o,s,i.axes,7/i.scale));this.select((a==null?void 0:a.id)||"fdtd"),a&&this.state.mode==="layout"&&(this.drag={id:a.id,start:s,center:[...a.center],axes:i.axes,name:t,moved:!1},e.target.setPointerCapture(e.pointerId))}move(e,t){if(!this.drag||this.drag.name!==t)return;const i=this.world(e,t),s=this.drag,r=this.state.project,a=[...s.center];s.axes.forEach((o,l)=>{if(o===2&&r.region.dimension==="2d")return;const c=s.center[o]+i[l]-s.start[l];a[o]=this.state.snap?cc(r.region,o,c):c}),!(!s.moved&&Math.hypot(i[0]-s.start[0],i[1]-s.start[1])<.02)&&(s.moved||this.edited(),s.moved=!0,this.change(s.id,{center:a},!1),this.render())}up(){var e;(e=this.drag)!=null&&e.moved&&this.change(this.drag.id,{},!0),this.drag=null}draw2d(e){const{canvas:t,axes:i}=this.canvases[e],s=this.metrics(e),r=this.state.project;if(s.w<1||s.h<1)return;const a=window.devicePixelRatio||1;t.width=s.w*a,t.height=s.h*a;const o=t.getContext("2d");o.scale(a,a),o.fillStyle="#fafbfd",o.fillRect(0,0,s.w,s.h);const l=S=>s.w/2+S*s.scale,c=S=>s.h/2-S*s.scale,d=45/s.scale,u=10**Math.floor(Math.log10(d)),h=[1,2,5,10].find(S=>S*u>=d)*u,m=Math.max(0,-Math.floor(Math.log10(h)));o.font="10px ui-monospace, monospace",o.textAlign="center";for(let S=0;S<2;S++){const A=(S===0?s.w:s.h)/s.scale;for(let M=Math.ceil(-A/2/h)*h;M<=A/2;M+=h){const b=S===0?l(M):c(M);o.strokeStyle=Math.abs(M)<1e-7?"#bac8d8":"#e6ebf2",o.lineWidth=1,o.beginPath(),S===0?(o.moveTo(b,0),o.lineTo(b,s.h),o.fillStyle="#8b98a9",o.fillText(M.toFixed(m),b,s.h-9)):(o.moveTo(0,b),o.lineTo(s.w,b),o.fillStyle="#8b98a9",o.fillText(M.toFixed(m),18,b-4)),o.stroke()}}const _=r.region.size[i[0]]*s.scale,x=r.region.size[i[1]]*s.scale,p=s.w/2-_/2,f=s.h/2-x/2;o.fillStyle="#f0c85612",o.fillRect(p,f,_,x),o.strokeStyle=Un.region,o.setLineDash([6,4]),o.strokeRect(p,f,_,x),o.setLineDash([]);const y=(S,A)=>mv(r.region,S,A)*s.scale,v=y(i[0],"min"),g=y(i[0],"max"),E=y(i[1],"min"),T=y(i[1],"max");o.fillStyle="#d8ae3d12",o.fillRect(p,f,_,T),o.fillRect(p,f+x-E,_,E),o.fillRect(p,f,v,x),o.fillRect(p+_-g,f,g,x);for(const S of this.objects()){if(!S.enabled)continue;const A=this.bounds(S),M=l(S.center[i[0]]),b=c(S.center[i[1]]),R=Math.max(A[i[0]]*s.scale,3),I=Math.max(A[i[1]]*s.scale,3),B=S.id===this.state.selected,H=r.materials.find(k=>k.name===S.material);if(o.save(),o.translate(M,b),o.strokeStyle=B?Un.selected:S.category==="source"?Un.source:S.category==="monitor"?Un.monitor:(H==null?void 0:H.color)||"#69a1e8",o.lineWidth=B?2:1.5,o.fillStyle=S.kind==="tfsf"?"#3ba89710":S.category==="structure"?((H==null?void 0:H.color)||"#69a1e8")+"55":"#ffffff88",o.beginPath(),S.kind==="tfsf"&&o.setLineDash([5,3]),S.category==="structure"){const k=od(S,i);for(const $ of k.triangles){o.moveTo($[0][0]*s.scale,-$[0][1]*s.scale);for(const q of $.slice(1))o.lineTo(q[0]*s.scale,-q[1]*s.scale);o.closePath()}o.fill(),o.beginPath();for(const[$,q]of k.edges)o.moveTo($[0]*s.scale,-$[1]*s.scale),o.lineTo(q[0]*s.scale,-q[1]*s.scale);o.stroke(),B&&(o.fillStyle=Un.selected,o.font="11px Inter,Segoe UI,sans-serif",o.fillText(S.name,0,-k.high*s.scale-9))}else S.category==="monitor"&&S.kind!=="field"?(o.moveTo(-7,0),o.lineTo(7,0),o.moveTo(0,-7),o.lineTo(0,7),o.stroke(),o.beginPath(),o.arc(0,0,4,0,2*Math.PI),o.stroke()):S.category==="source"&&S.kind==="point"?(o.arc(0,0,5,0,2*Math.PI),o.fillStyle=Un.source,o.fill(),o.stroke()):(e==="xy"&&["circle","ring"].includes(S.kind)||S.kind==="sphere"?(o.ellipse(0,0,R/2,I/2,0,0,Math.PI*2),S.kind==="ring"&&o.ellipse(0,0,S.inner_radius*s.scale,S.inner_radius*s.scale,0,0,Math.PI*2,!0)):o.rect(-R/2,-I/2,R,I),o.fill("evenodd"),o.stroke());B&&S.category!=="structure"&&(o.fillStyle="#187be7",o.font="11px Inter,Segoe UI,sans-serif",o.fillText(S.name,0,-I/2-9)),o.restore()}o.fillStyle="#617187",o.textAlign="right",o.font="10px Segoe UI",o.fillText(`${"xyz"[i[0]]} / ${"xyz"[i[1]]} (µm)`,s.w-10,s.h-9),r.region.dimension==="2d"&&e!=="xy"&&(o.fillStyle="#8591a2",o.textAlign="left",o.fillText("2D: simulation at z = 0",10,18))}initThree(e){this.host=e,this.scene=new mh,this.scene.background=new Xe("#f3f6fa"),this.camera=new ln(40,1,.01,1e3),this.camera.up.set(0,0,1),this.camera.position.set(10,-12,10),this.renderer=new W_({antialias:!0}),this.renderer.setPixelRatio(Math.min(devicePixelRatio,2)),e.appendChild(this.renderer.domElement),this.orbit=new X_(this.camera,this.renderer.domElement),this.orbit.enableDamping=!0,this.scene.add(new tf(16777215,10728907,2.5));const t=new rf(16777215,2);t.position.set(5,-3,8),this.scene.add(t),this.scene.add(new lf(1.5)),this.group=new us,this.scene.add(this.group),this.transform=new av(this.camera,this.renderer.domElement),this.scene.add(this.transform.getHelper()),this.transform.addEventListener("dragging-changed",r=>{this.orbit.enabled=!r.value,r.value?this.edited():this.transform.object&&this.change(this.transform.object.userData.id,{},!0)}),this.transform.addEventListener("objectChange",()=>{const r=this.transform.object;if(!r)return;let a=r.position.toArray();this.state.snap&&(a=a.map((o,l)=>cc(this.state.project.region,l,o))),this.change(r.userData.id,{center:a},!1);for(const o of Object.keys(this.canvases))this.draw2d(o)});let i;this.renderer.domElement.addEventListener("pointerdown",r=>{i=[r.clientX,r.clientY]}),this.renderer.domElement.addEventListener("pointerup",r=>{if(!i||Math.hypot(r.clientX-i[0],r.clientY-i[1])>4||this.transform.axis)return;const a=e.getBoundingClientRect(),o=new Kc;o.setFromCamera(new oe((r.clientX-a.left)/a.width*2-1,-(r.clientY-a.top)/a.height*2+1),this.camera);const l=o.intersectObjects(this.group.children,!0).find(c=>c.object.userData.id);l&&this.select(l.object.userData.id)});const s=()=>{requestAnimationFrame(s),this.orbit.update(),this.renderer.render(this.scene,this.camera)};s()}renderThree(){var a;if(this.transform.dragging)return;this.transform.detach(),this.group.traverse(o=>{var l;if((l=o.geometry)==null||l.dispose(),o.material)for(const c of Array.isArray(o.material)?o.material:[o.material])c.dispose()}),this.group.clear();const e=this.state.project,t=new Cr(new po(new St(...e.region.size)),new Zi({color:Un.region}));this.group.add(t);const i=new of(Math.max(...e.region.size)*1.4,20,"#b7c5d5","#dfe6ee");i.rotateX(Math.PI/2),i.position.z=-e.region.size[2]/2,this.group.add(i);for(const o of this.objects()){if(!o.enabled)continue;let l;o.category==="structure"?l=yv(o):o.category==="monitor"&&o.kind!=="field"||o.kind==="point"?l=new Ds(.07,12,8):l=new St(...(o.size||[.1,.1,.1]).map(u=>Math.max(u,.02)));const c=o.category==="source"?Un.source:o.category==="monitor"?Un.monitor:((a=e.materials.find(u=>u.name===o.material))==null?void 0:a.color)||"#69a1e8",d=new ye(l,new Kh({color:c,transparent:!0,opacity:o.kind==="tfsf"?.08:o.category==="structure"?.66:.9,roughness:.5,metalness:.08,side:fn}));d.position.fromArray(o.center),d.userData.id=o.id,d.add(new Cr(new po(l),new Zi({color:o.id===this.state.selected?"#147be7":c,transparent:!0,opacity:.7}))),this.group.add(d),o.id===this.state.selected&&this.state.mode==="layout"&&(this.transform.attach(d),this.transform.showZ=e.region.dimension!=="2d",this.transform.setTranslationSnap(this.state.snap&&!e.region.mesh_steps&&e.region.mesh_type!=="explicit"?e.region.mesh:null))}const{width:s,height:r}=this.host.getBoundingClientRect();s>0&&r>0&&(this.camera.aspect=s/r,this.camera.updateProjectionMatrix(),this.renderer.setSize(s,r))}fit(){this.zoom={xy:1,xz:1,yz:1};const e=Math.max(...this.state.project.region.size);this.camera.position.set(e*1.15,-e*1.4,e*1.05),this.orbit.target.set(0,0,0),this.render()}render(){for(const e of Object.keys(this.canvases))this.draw2d(e);this.renderThree()}}function Tv(n,e,t,i,s=null,r="reduced field"){const a=n.getBoundingClientRect(),o=devicePixelRatio||1;n.width=a.width*o,n.height=a.height*o;const l=n.getContext("2d");if(l.scale(o,o),l.fillStyle="#f8fafc",l.fillRect(0,0,a.width,a.height),!(e!=null&&e.length)){l.fillStyle="#718196",l.font="14px Segoe UI",l.textAlign="center",l.fillText("Run a simulation to visualize the field",a.width/2,a.height/2);return}const c=e.length,d=e[0].length,u=document.createElement("canvas");u.width=c,u.height=d;const h=u.getContext("2d"),m=h.createImageData(c,d);let _=s||Math.max(...e.flat().map(Math.abs),1e-20);for(let g=0;g<c;g++)for(let E=0;E<d;E++){const T=Math.max(-1,Math.min(1,e[g][E]/_)),S=((d-1-E)*c+g)*4;m.data[S]=T>0?250:Math.round(246+T*210),m.data[S+1]=Math.round(248-Math.abs(T)*184),m.data[S+2]=T<0?250:Math.round(248-T*207),m.data[S+3]=255}h.putImageData(m,0,0);const x=Math.min((a.width-110)/t[0],(a.height-80)/t[1]),p=t[0]*x,f=t[1]*x,y=(a.width-p)/2,v=(a.height-f)/2;l.imageSmoothingEnabled=!1,l.drawImage(u,y,v,p,f),l.strokeStyle="#c4cfdb",l.strokeRect(y,v,p,f),l.fillStyle="#607086",l.font="11px ui-monospace,monospace",l.textAlign="center",l.fillText(`${-t[0]/2}`,y,v+f+18),l.fillText("0",y+p/2,v+f+18),l.fillText(`${t[0]/2} µm`,y+p,v+f+18),l.textAlign="right",l.fillText(`${t[1]/2}`,y-8,v+8),l.fillText(`${-t[1]/2}`,y-8,v+f),l.textAlign="left",l.fillText(`${i} · ±${_.toExponential(2)} (${r})`,y,v-13)}function Is(n,e,t=!1,i=!1){const s=n.getBoundingClientRect(),r=devicePixelRatio||1;n.width=s.width*r,n.height=s.height*r;const a=n.getContext("2d");if(a.scale(r,r),a.clearRect(0,0,s.width,s.height),!(e!=null&&e.length)){a.fillStyle="#8491a2",a.font="12px Segoe UI",a.fillText("Point monitor signals appear after a run.",30,35);return}const o=g=>t?i?g.wavelength_um:g.frequency_thz:g.time_fs,l=s.width-75,c=s.height-48,d=55,u=15,h=e.flatMap(g=>t?g.spectrum:g.signal),m=e.flatMap(o),_=h.reduce((g,E)=>Number.isFinite(E)?Math.max(g,Math.abs(E)):g,0)||1,x=t?m.reduce((g,E)=>Math.min(g,E),1/0):0,p=m.reduce((g,E)=>Math.max(g,E),x+1e-6),f=t&&!e.some(g=>g.signed)?0:-_;a.strokeStyle="#e0e6ed",a.font="10px monospace",a.fillStyle="#738197";for(let g=0;g<=4;g++){const E=u+g*c/4;a.beginPath(),a.moveTo(d,E),a.lineTo(d+l,E),a.stroke(),a.fillText((_-(_-f)*g/4).toExponential(1),2,E+3),a.fillText((x+(p-x)*g/4).toFixed(i&&t?2:0),d+l*g/4-7,u+c+17)}e.forEach((g,E)=>{const T=o(g),S=t?g.spectrum:g.signal;a.strokeStyle=["#237ddd","#e39127","#875adb","#22a184"][E%4],a.beginPath();let A=!1;T.forEach((M,b)=>{if(!Number.isFinite(S[b])){A=!1;return}const R=d+(M-x)/(p-x)*l,I=u+(_-S[b])/(_-f)*c;A?a.lineTo(R,I):a.moveTo(R,I),A=!0}),a.stroke(),T.length===1&&(a.beginPath(),a.arc(d,u+(_-S[0])/(_-f)*c,3,0,2*Math.PI),a.fillStyle=a.strokeStyle,a.fill()),a.fillStyle=a.strokeStyle,a.fillText(g.name,d+10+E*120,12),!t&&g.window&&(a.strokeStyle="#24a79b",a.setLineDash([3,3]),a.beginPath(),T.forEach((M,b)=>{const R=d+(M-x)/(p-x)*l,I=u+(1-g.window[b])*c/2;b?a.lineTo(R,I):a.moveTo(R,I)}),a.stroke(),a.setLineDash([]))});const y=e[0],v=y.spectrum_settings;a.fillStyle="#728296",a.textAlign="right",a.fillText(t?y.spectrum_label||`${i?"Wavelength (µm)":"Frequency (THz)"} · ${(v==null?void 0:v.apodization)||"hann"} · |${(v==null?void 0:v.sampling)==="fft"?"FFT":"DFT"}| (${y.spectrum_units||"reduced field"})`:y.time_label||`Time (fs) · real field${y.window?"; dashed: window (0–1)":""}`,s.width-20,s.height-3)}function Av({esc:n,toast:e,log:t}){const i=document.createElement("dialog");i.id="fsp-dialog",document.body.append(i);const s=document.createElement("input");s.type="file",s.accept=".fsp",s.hidden=!0,document.body.append(s);let r=null,a="",o=!1,l="",c=new Map;async function d(g,E){const T=await fetch("/api/fsp"+g,E),S=await T.json();if(!T.ok)throw Error(typeof S.detail=="string"?S.detail:JSON.stringify(S.detail));return S}function u(){if(!(r!=null&&r.inspection))return[];const g=r.inspection;return[...g.objects.map(E=>({...E,editable:!0})),...Object.entries(g.globals).map(([E,T])=>({id:"Global "+E,...T})),...Object.entries(g.referenced_materials).map(([E,T])=>({id:"Material: "+E,...T}))]}function h(){return u().find(g=>g.id===a)}function m(g,E){return JSON.stringify([g,E])}function _(g){i.querySelector("#fsp-status").textContent=g}function x(){const g=r==null?void 0:r.inspection;i.innerHTML=`<div class="fsp-heading"><div><h2>FSP project inspector</h2><span>${n((r==null?void 0:r.filename)||"Open a Lumerical project")}</span></div><button data-fsp="close" aria-label="Close FSP inspector">Close</button></div>
   <p class="fsp-notice">Installed Lumerical bridge · <strong>Native GPU execution unavailable</strong><br>Original settings are retained. Values below use Lumerical SI units: metres, seconds and Hz. Edited exports clear saved simulation results.</p>
   <div class="fsp-toolbar"><button data-fsp="open" ${o?"disabled":""}>Open .fsp</button><button data-fsp="original" ${!g||o?"disabled":""}>Download original .fsp</button><button data-fsp="archive" ${!g||o?"disabled":""}>Preservation archive</button><button data-fsp="export" ${!c.size||o?"disabled":""}>Save edited .fsp <span id="fsp-patch-count">(${c.size})</span></button></div>
   <div id="fsp-status" role="status">${o?"Reading with Lumerical…":g?`${g.objects.length} objects · Lumerical ${n(g.bridge.vendor_version)} · ${c.size} pending edits`:"Select an FSP file. The GPU workstation reads it in a separate Lumerical session."}</div>
   <div class="fsp-body"><div id="fsp-tree">${u().map(E=>`<button data-fsp-object="${n(E.id)}" class="${a===E.id?"active":""}"><span>${n(E.id)}</span><small>${n(E.properties.type||"Settings")}</small></button>`).join("")}</div><section class="fsp-details"><input id="fsp-filter" placeholder="Filter properties (e.g. wavelength, pml, apodization)" aria-label="Filter FSP properties" value="${n(l)}"><div id="fsp-properties"></div></section></div>
   ${g?`<details class="fsp-diagnostics"><summary>Native compatibility: ${g.native_execution.issues.length} unresolved items</summary><ul>${g.native_execution.issues.map(E=>`<li><b>${n(E.object_id||"Project")}</b>: ${n(E.message)}</li>`).join("")}${g.read_diagnostics.map(E=>`<li>${n(E.object_id)}: ${n(E.message)}</li>`).join("")}</ul></details>`:""}`,p(),i.querySelector("#fsp-filter").oninput=E=>{l=E.target.value,p()}}function p(){const g=h(),E=i.querySelector("#fsp-properties");if(!g){E.innerHTML="<p>Select an object to inspect its complete property list.</p>";return}const T=Object.entries(g.properties).filter(([S])=>S.toLowerCase().includes(l.toLowerCase()));E.innerHTML=`<h3>${n(g.id)}</h3>${T.map(([S,A])=>{const M=c.get(m(g.id,S)),b=M?M.value:A,R=g.editable&&!["name","type","script","setup script","analysis script"].includes(S)&&["number","string","boolean"].includes(typeof b)&&!String(b).includes(`
`)&&String(b).length<2e3,I=typeof b=="object"?JSON.stringify(b,null,2):String(b);return`<label class="fsp-property ${M?"modified":""}"><span>${n(S)}</span>${R?`<input data-fsp-property="${n(S)}" aria-label="FSP ${n(S)}" type="${typeof b=="number"?"number":typeof b=="boolean"?"checkbox":"text"}" step="any" ${typeof b=="boolean"?b?"checked":"":`value="${n(I)}"`} ${o?"disabled":""}>`:`<pre>${n(I)}</pre>`}</label>`}).join("")}${Object.entries(g.read_errors||{}).map(([S,A])=>`<p class="error">${n(S)}: ${n(A)}</p>`).join("")}`,E.querySelectorAll("[data-fsp-property]").forEach(S=>S.onchange=()=>{const A=S.dataset.fspProperty,M=S.type==="number"?Number(S.value):S.type==="checkbox"?S.checked:S.value;if(S.type==="number"&&(!S.value||!Number.isFinite(M))){e("Enter a finite number."),p();return}M===g.properties[A]?c.delete(m(g.id,A)):c.set(m(g.id,A),{object_id:g.id,property:A,value:M}),S.closest("label").classList.toggle("modified",c.has(m(g.id,A))),i.querySelector("#fsp-patch-count").textContent=`(${c.size})`,i.querySelector('[data-fsp="export"]').disabled=!c.size||o,_(`${c.size} pending edits. Save edited .fsp verifies each saved value in Lumerical.`)})}async function f(g){for(;;){const E=await d("/"+g);if(_(E.status==="queued"?"Waiting for Lumerical bridge…":"Reading and verifying project settings…"),E.status==="failed")throw Error(E.error);if(E.status==="ready")return E;await new Promise(T=>setTimeout(T,700))}}function y(g){const E=document.createElement("a");E.href="/api/fsp/"+r.id+"/"+g,E.download="",E.click()}async function v(g){var E,T;if(!o){o=!0,c.clear(),l="",a="",r=null,x(),i.open||i.showModal();try{_("Uploading "+g.name+"…");const S=await d("/import",{method:"POST",headers:{"Content-Type":"application/octet-stream","X-Filename":encodeURIComponent(g.name)},body:g});r=await f(S.id),a=((E=r.inspection.objects.find(A=>A.properties.type==="FDTD"))==null?void 0:E.id)||((T=r.inspection.objects[0])==null?void 0:T.id),t("Inspected "+g.name+" through Lumerical. Native GPU execution of this FSP remains unavailable.")}catch(S){e(S.message),t("FSP: "+S.message,"error")}finally{o=!1,x()}}}return s.onchange=()=>{const g=s.files[0];s.value="",g&&v(g)},i.addEventListener("click",async g=>{const E=g.target.closest("button");if(!E||E.disabled)return;if(E.dataset.fspObject){a=E.dataset.fspObject,x();return}const T=E.dataset.fsp;if(T==="close"){i.close();return}if(T==="open"){s.click();return}if(T==="original"){y("download");return}if(T==="archive"){y("archive");return}if(T==="export"){o=!0,x();try{const S=await d("/"+r.id+"/export",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({patches:[...c.values()]})}),A=await f(S.id),M=document.createElement("a");M.href="/api/fsp/"+A.id+"/download",M.download="",M.click(),c.clear(),r=A,t("Saved "+A.filename+" and verified "+A.export_verification.patches.length+" property edits by reopening in Lumerical.")}catch(S){e(S.message),t("FSP export failed: "+S.message,"error")}finally{o=!1,x()}}}),{openFile:v,open(){x(),i.open||i.showModal()}}}function Cv({esc:n,toast:e,log:t,loadProject:i,getProject:s}){const r=document.createElement("dialog");r.id="fsp-native-dialog",document.body.append(r);const a=document.createElement("input");a.type="file",a.accept=".fsp",a.id="fsp-native-input",a.hidden=!0,document.body.append(a);let o=null,l=null,c=!1,d="";function u(){var g,E,T,S;const x=o==null?void 0:o.conversion,p=x==null?void 0:x.project,f=s(),y=[...(f==null?void 0:f.structures)||[],...(f==null?void 0:f.sources)||[],...(f==null?void 0:f.monitors)||[]],v=A=>{const M=y.find(b=>A.startsWith(b.id+"."));return M?M.name+": "+A.slice(M.id.length+1):A};r.innerHTML=`<div class="fsp-heading"><div><h2>Import FSP for GPU</h2><span>${n((o==null?void 0:o.filename)||"Independent scene import")}</span></div><button data-native="close">Close</button></div>
   <p>Reads supported layout settings without Lumerical. The original FSP is retained. A converted scene uses the native solver and its documented numerical definitions.</p>
   <div class="fsp-toolbar"><button data-native="open" ${c?"disabled":""}>Choose .fsp</button><button data-native="load" ${!p||c?"disabled":""}>Open converted scene</button>${x?'<button data-native="original">Download original .fsp</button><button data-native="report">Conversion report</button>':""}<button data-native="export" ${!p||c?"disabled":""}>Export current scene</button></div>
   <p id="fsp-native-status" role="status">${c?"Processing FSP settings…":d?n(d):l?"Scene export verified · download below":x?p?"Ready to open · review calculation differences below":"Cannot run this FSP yet · unsupported settings below":"Choose an FSP file to check and convert."}</p>
   ${l?`<p><button data-native="edited">Download edited .fsp</button> <button data-native="write-report">Scene export report</button></p>${l.export_verification.native_only_settings.length?`<details><summary>Native JSON retains additional settings</summary><ul>${l.export_verification.native_only_settings.map(A=>`<li>${n(v(A))}</li>`).join("")}</ul></details>`:""}`:""}
   ${(g=l==null?void 0:l.export_verification.structure_list)!=null&&g.changed?`<p data-native-structure-export>Structure list saved: ${l.export_verification.structure_list.added.length} added · ${l.export_verification.structure_list.removed.length} removed · ${l.export_verification.structure_list.output_order.length} total. Native order and material priority verified. Reimport the edited file to use its updated object IDs. New object records have not been verified in external readers.</p>`:""}
   ${(E=l==null?void 0:l.export_verification.source_list)!=null&&E.changed?`<p data-native-source-export>Source list saved: ${l.export_verification.source_list.added.length} added · ${l.export_verification.source_list.removed.length} removed · ${l.export_verification.source_list.output_order.length} total. Native waveforms and order verified.</p>`:""}
   ${(T=l==null?void 0:l.export_verification.monitor_list)!=null&&T.changed?`<p data-native-monitor-export>Monitor list saved: ${l.export_verification.monitor_list.added.length} added · ${l.export_verification.monitor_list.removed.length} removed · ${l.export_verification.monitor_list.output_order.length} outputs. ${l.export_verification.monitor_list.splits.length} component records separated. Native sampling and output order verified. Reimport the edited file before further FSP edits. External reader acceptance is unverified.</p>`:""}
   ${(S=l==null?void 0:l.export_verification.mesh_export)!=null&&S.nodes_changed?`<p data-native-mesh-export>Mesh updated: ${l.export_verification.mesh_export.shape_before.join(" × ")} → ${l.export_verification.mesh_export.shape_after.join(" × ")} cells. Native reimport verified. External remeshing has not been verified.</p>`:""}
   ${p?'<p class="property-help">Exports mapped primitive, electric source and monitor additions, deletions, duplicates and order, source pulses, monitor spectra, duration, PML/Periodic settings and uniform mesh spacing/spans. New sources need explicit or ranged pulse settings. New time monitors need FFT with no apodization. Uniform isotropic export requires Cell centers sampling, and independent unequal axis spacing requires Yee sampling. Edited graded/explicit meshes and groups are not exported yet. Save native JSON to retain every native option and inheritance link.</p>':""}
   ${p?`<p>Original import: <b>${p.region.dimension.toUpperCase()}</b> · ${p.structures.length} structures · ${p.sources.length} sources · ${p.monitors.length} monitors · ${p.region.steps} steps</p>`:""}
   ${x?`<div class="native-issues">${x.issues.map(A=>`<p class="${A.severity==="error"?"error":"warning"}"><b>${n(A.object_id)}</b><br>${n(A.message)}</p>`).join("")}</div><p class="property-help">Coordinate origin in the source FSP: ${x.origin_m.map(A=>(A*1e6).toPrecision(5)).join(", ")} µm. Differences and source fingerprint remain in the saved native project.</p>`:""}`}async function h(x,p){const f=await fetch("/api/fsp"+x,p),y=await f.json();if(!f.ok)throw Error(y.detail||"FSP conversion failed");return y}async function m(x){for(;;){const p=await h("/"+x);if(p.status==="failed")throw Error(p.error);if(p.status==="ready")return p;await new Promise(f=>setTimeout(f,400))}}async function _(x){if(!c){o=null,l=null,d="",c=!0,u(),r.open||r.showModal();try{const p=await h("/native-import",{method:"POST",headers:{"Content-Type":"application/octet-stream","X-Filename":encodeURIComponent(x.name)},body:x});o=await m(p.id),t(x.name+": "+(o.conversion.project?"native scene conversion ready.":"native execution blocked by unsupported settings."),o.conversion.project?"info":"warning")}catch(p){d=p.message,e(d),t("FSP conversion: "+d,"error")}finally{c=!1,u()}}}return a.onchange=()=>{const x=a.files[0];a.value="",x&&_(x)},r.onclick=async x=>{var f,y;const p=(f=x.target.closest("[data-native]"))==null?void 0:f.dataset.native;if(p==="close"&&r.close(),p==="open"&&a.click(),p==="load"&&(o!=null&&o.conversion.project))try{await i(o.conversion.project),r.close()}catch(v){e(v.message)}if(p==="original"||p==="report"){const v=document.createElement("a");v.href="/api/fsp/"+o.id+(p==="original"?"/download":"/conversion"),v.download="",v.click()}if(p==="edited"||p==="write-report"){const v=document.createElement("a");v.href="/api/fsp/"+l.id+(p==="edited"?"/download":"/write-report"),v.download="",v.click()}if(p==="export"&&!c){c=!0,d="",l=null,u();try{const v=await h("/"+o.id+"/native-scene-export",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(s())});l=await m(v.id),t("Independent scene export verified."+((y=l.export_verification.mesh_export)!=null&&y.nodes_changed?" Mesh nodes updated.":""))}catch(v){d=v.message,e(d),t("FSP scene export: "+d,"error")}finally{c=!1,u()}}},{open(){u(),r.open||r.showModal()},openFile:_}}function Rv({esc:n,toast:e,log:t,getProject:i,loadProject:s}){const r=document.createElement("dialog");r.id="gds-dialog",r.className="gds-dialog",document.body.append(r);let a=null,o=null,l=null,c=!1;async function d(p,f){const y=await fetch("/api/gds/"+p,f),v=await y.json();if(!y.ok)throw Error(typeof v.detail=="string"?v.detail:JSON.stringify(v.detail));return v}function u(){return JSON.stringify([...r.querySelectorAll("input,select,textarea")].map(p=>[p.value,p.checked]))}function h(){o=null,r.querySelector('[data-gds="apply"]').disabled=!0,r.querySelector('[data-gds="report"]').disabled=!0}function m(p){r.querySelector("#gds-status").textContent=p}function _(p,f){const y=URL.createObjectURL(new Blob([JSON.stringify(f,null,2)],{type:"application/json"})),v=document.createElement("a");v.href=y,v.download=p,v.click(),setTimeout(()=>URL.revokeObjectURL(y),1e3)}function x(){const p=[...new Set(((a==null?void 0:a.cells)||[]).flatMap(f=>f.geometry_pairs.map(y=>y.join("/"))))].sort();r.innerHTML=`<div class="fsp-heading"><h2>Import GDS geometry</h2><button data-gds="close">Close</button></div>
   <p>Select a cell and explicitly assign each included layer its physical Z bounds (µm) and an existing project material. No sources or fabrication materials are inferred.</p>
   <input id="gds-input" aria-label="GDS file" type="file" accept=".gds,.gdsii"><p id="gds-status" role="status">${a?n(a.filename):"Choose a GDSII file (maximum 32 MB)."}</p>
   ${a?`<label>Cell <select id="gds-cell">${a.cells.map(f=>`<option>${n(f.name)}</option>`).join("")}</select></label>
   <p>Pairs below include all library cells. Select pairs present in the selected cell hierarchy. Duplicate a row to extrude the same pair at multiple Z intervals.</p>
   <table><thead><tr><th>Include</th><th>Layer / datatype</th><th>Z min (µm)</th><th>Z max (µm)</th><th>Material</th><th></th></tr></thead><tbody id="gds-stack">${p.map(f=>`<tr data-pair="${f}"><td><input type="checkbox" aria-label="Include ${f}"></td><td>${f}</td><td><input size="8" type="number" step="any" aria-label="Z min ${f}"></td><td><input size="8" type="number" step="any" aria-label="Z max ${f}"></td><td><select aria-label="Material ${f}"><option value="">Select material</option>${i().materials.map(y=>`<option value="${n(y.name)}">${n(y.name)}</option>`).join("")}</select></td><td><button data-gds="duplicate">Duplicate</button></td></tr>`).join("")}</tbody></table>
   <p><label>Unmapped geometry <select id="gds-unmapped"><option value="error">Reject (strict)</option><option value="report">Omit and record in report</option></select></label></p>
   <p><label><input id="gds-replace" type="checkbox"> Replace current structures (sources, monitors and materials stay in the project)</label></p>
   <details><summary>Optional TEXT port metadata contracts</summary><p>JSON array using layer, datatype (= TEXTTYPE), z_min, z_max, width_um and normal_xy. Metadata only, no source/detector integration. Available TEXT pairs: ${n(JSON.stringify([...new Set(a.cells.flatMap(f=>f.text_pairs.map(y=>y.join("/"))))]))}</p><textarea id="gds-ports" aria-label="Port contracts" rows="3" style="width:100%">[]</textarea></details>
   <button data-gds="preview">Preview conversion</button>`:""}
   <button data-gds="apply" disabled>Apply imported geometry</button><button data-gds="report" disabled>Download report</button><pre id="gds-report" style="max-height:240px;overflow:auto;white-space:pre-wrap"></pre>`,r.querySelector("#gds-input").onchange=async f=>{const y=f.target.files[0];if(!(!y||c)){c=!0,h(),m("Inspecting GDS…");try{a=await d("inspect",{method:"POST",headers:{"Content-Type":"application/octet-stream","X-Filename":encodeURIComponent(y.name)},body:y}),x()}catch(v){m(v.message)}finally{c=!1}}}}return r.addEventListener("input",p=>{p.target.id!=="gds-input"&&h()}),r.addEventListener("click",async p=>{var y;const f=(y=p.target.closest("[data-gds]"))==null?void 0:y.dataset.gds;if(!(!f||c)){if(f==="close"){r.close();return}if(f==="duplicate"){const v=p.target.closest("tr");v.after(v.cloneNode(!0)),h();return}if(f==="report"){_("gds-import-report.json",o.report);return}c=!0;try{if(f==="preview"){h();const v=[];for(const E of r.querySelectorAll("#gds-stack tr")){const T=E.querySelectorAll("input");if(!T[0].checked)continue;if(!T[1].value||!T[2].value||!E.querySelector("select").value)throw Error("Every included row needs explicit Z bounds and material.");const[S,A]=E.dataset.pair.split("/").map(Number);v.push({layer:S,datatype:A,z_min:Number(T[1].value),z_max:Number(T[2].value),material:E.querySelector("select").value})}l=JSON.stringify(i());const g=u();if(m("Converting and validating native geometry…"),o=await d(a.id+"/convert",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({project:JSON.parse(l),cell:r.querySelector("#gds-cell").value,layers:v,port_layers:JSON.parse(r.querySelector("#gds-ports").value),unmapped:r.querySelector("#gds-unmapped").value,replace_geometry:r.querySelector("#gds-replace").checked})}),g!==u())throw h(),Error("Import settings changed during conversion. Preview again.");r.querySelector("#gds-report").textContent=JSON.stringify(o.report,null,2),m("Ready to apply. Review the report and bounds; the FDTD region is unchanged."),r.querySelector('[data-gds="apply"]').disabled=!1,r.querySelector('[data-gds="report"]').disabled=!1}else if(f==="apply"){if(l!==JSON.stringify(i()))throw h(),Error("Project changed after preview. Preview again before applying.");await s(o.project),r.close(),t("Imported GDS native geometry. Port metadata is available in the separate conversion report."),e("GDS geometry imported")}}catch(v){m(v.message)}finally{c=!1}}}),{open(){a=null,o=null,x(),r.showModal()}}}const ld={wavelength:1.55,pulse:"gaussian",pulse_cycles:3,time_definition:"cycles",pulse_length:2e-14,pulse_offset:5e-14,signal:null,wavelength_start:1.3,wavelength_stop:1.8,optimize_for_short_pulse:!0,eliminate_discontinuities:!1,chirp_bandwidth_hz:1e14};function Pv(n,e,t){const i=n.theta!=null,s=n.injection==="oneway";return(i?s?'<p class="property-help">Electric polarization. Its magnetic partner is generated automatically.</p>':`<label class="property-row"><span>field type</span><select aria-label="field type" data-source-family><option value="E" ${n.component[0]==="E"?"selected":""}>Electric</option><option value="H" ${n.component[0]==="H"?"selected":""}>Magnetic</option></select></label>`:t("polarization","component",n.component,s?["Ex","Ey","Ez"].filter(a=>a[1]!==n.normal):["Ex","Ey","Ez","Hx","Hy","Hz"]))+`<label class="enabled-row"><input type="checkbox" data-source-vector ${i?"checked":""}> Use theta / phi orientation</label>`+(i?e("theta","theta",n.theta,"deg",{min:0,max:180})+e("phi","phi",n.phi??0,"deg")+'<p class="property-help">Theta is measured from +z. Phi turns from +x toward +y. The source has unit vector (sin θ cos φ, sin θ sin φ, cos θ).</p>':"")}function Lv(n,e,t,i){return n.kind==="tfsf"?i("propagation axis","normal",n.normal??"x",e.dimension==="2d"?["x","y"]:["x","y","z"])+i("direction","direction",n.direction??"+",[["+","Forward (+axis)"],["-","Backward (-axis)"]])+t("incident PML layers","incident_pml_cells",n.incident_pml_cells??96,"",{min:32,max:512,step:1})+'<p class="property-help">Normal-incidence TFSF box. Inside contains total fields and outside contains scattered fields. Keep the scatterer away from every face, with homogeneous background on the faces and PML on all active domain boundaries.</p>':n.kind!=="plane"?"":i("injection","injection",n.injection??"soft",[["soft","Soft sheet / bidirectional"],["oneway","One-way plane / normal incidence"]])+(n.injection==="oneway"?i("propagation axis","normal",n.normal??"x",e.dimension==="2d"?["x","y"]:["x","y","z"])+i("direction","direction",n.direction??"+",[["+","Forward (+axis)"],["-","Backward (-axis)"]])+t("incident PML layers","incident_pml_cells",n.incident_pml_cells??96,"",{min:32,max:512,step:1}):"")+'<p class="property-help">Selecting one-way fills the transverse cell, sets its boundaries to Periodic and the propagation boundaries to PML. Place its full plane in homogeneous background. This source does not select a waveguide mode or an oblique angle.</p>'}function dc(n,e,{boundaries:t=!1}={}){if(n.kind==="tfsf"){e.dimension==="2d"&&n.normal==="z"&&(n.normal="x"),(n.component[0]!=="E"||n.component[1]===n.normal)&&(n.component=n.normal==="z"?"Ex":"Ez",n.theta=null,n.phi=0);return}if(n.injection!=="oneway")return;n.normal??(n.normal="x"),n.direction??(n.direction="+"),e.dimension==="2d"&&n.normal==="z"&&(n.normal="x");const i="xyz".indexOf(n.normal),s=e.dimension==="2d"?2:3;n.size=[0,0,0];for(let r=0;r<s;r++)if(r!==i&&(n.center[r]=0,n.size[r]=Math.ceil(e.size[r]/e.mesh-1e-12)*e.mesh),t){for(const a of["min","max"])e.boundaries["xyz"[r]+"_"+a].kind=r===i?"pml":"periodic";e.bloch_phase[r]=0}(n.component[0]!=="E"||n.component[1]===n.normal)&&(n.component="E"+(i===2?"x":"z"),n.theta=null,n.phi=0)}function zo(n){const e=299792458/(n.wavelength_stop*1e-6),t=299792458/(n.wavelength_start*1e-6),i=(e+t)/2,s=(n.optimize_for_short_pulse?2:8)/(t+.01*e),r=s/(2*Math.sqrt(Math.log(2)));return{wavelength:299792458/i*1e6,length:s,offset:1.1*Math.sqrt(2*Math.log(1e4))*r,span:t-e,chirped:t-e>Math.sqrt(Math.log(2))/(Math.PI*r)}}function cd(n,e,t){const i=["wavelength","frequency"].includes(n.time_definition),s=i?zo(n):null;n[e]=t,e==="pulse"&&t==="broadband"&&!i&&(n.time_definition="wavelength",n.eliminate_discontinuities=!0),(e==="pulse"&&t!=="broadband"&&i||e==="time_definition"&&t==="standard"&&i)&&(n.time_definition="standard",n.wavelength=s.wavelength,n.pulse_length=s.length,n.pulse_offset=s.offset,n.chirp_bandwidth_hz=Math.max(s.span,1),e==="time_definition"&&!s.chirped&&(n.pulse="gaussian"))}function dd(n,e,t,i=""){for(const[l,c]of Object.entries(ld))n[l]??(n[l]=c);const s=n.pulse==="broadband",r=["wavelength","frequency"].includes(n.time_definition),a=(l,c)=>`<label class="enabled-row"><input type="checkbox" aria-label="${i}${l}" data-path="${c}" ${n[c]?"checked":""}> ${l}</label>`;let o=t("pulse","pulse",n.pulse,[["gaussian","Gaussian"],["broadband","Broadband / automatic range"],["continuous","Continuous wave"],...n.signal?[["sampled","User time signal"]]:[]]);if(n.pulse==="sampled")return e("wavelength","wavelength",n.wavelength,"µm",{min:.001})+o+`<p class="property-help">${n.signal.time_s.length.toLocaleString()} time/amplitude/phase samples. Time in seconds, phase in radians.</p>`;if(o+=t("time definition","time_definition",n.time_definition,s?[["wavelength","Wavelength range"],["frequency","Frequency range"],["standard","Time domain"]]:[["cycles","Pulse cycles"],["standard","Standard time domain"]]),r){n.time_definition==="wavelength"?o+=e("wavelength start","wavelength_start",n.wavelength_start,"µm",{min:.001})+e("wavelength stop","wavelength_stop",n.wavelength_stop,"µm",{min:.001}):o+=e("frequency start","wavelength_stop",299.792458/n.wavelength_stop,"THz",{min:.001,reciprocal:299.792458})+e("frequency stop","wavelength_start",299.792458/n.wavelength_start,"THz",{min:.001,reciprocal:299.792458});const l=zo(n);o+=a("Optimize for short pulse","optimize_for_short_pulse")+`<p class="property-help" data-source-band-summary>${l.chirped?"Chirped":"Standard"} Gaussian · center ${l.wavelength.toFixed(5)} µm · power FWHM ${(l.length*1e15).toFixed(4)} fs · offset ${(l.offset*1e15).toFixed(4)} fs. The spectrum extends beyond the requested range.</p>`}else o+=e("wavelength","wavelength",n.wavelength,"µm",{min:.001}),o+=n.time_definition==="standard"?e("pulselength (power FWHM)","pulse_length",n.pulse_length*1e15,"fs",{min:.001,scale:1e-15})+(n.pulse!=="continuous"?e("offset","pulse_offset",n.pulse_offset*1e15,"fs",{min:0,scale:1e-15}):""):e("pulse width","pulse_cycles",n.pulse_cycles,"cycles",{min:1}),s&&(o+=e("chirp bandwidth","chirp_bandwidth_hz",n.chirp_bandwidth_hz*1e-12,"THz",{min:.001,scale:1e12}));return n.pulse!=="continuous"&&(o+=a("Eliminate discontinuities","eliminate_discontinuities")),o}function Dv(n,e="signal.csv"){var s;if(e.toLowerCase().endsWith(".json"))return JSON.parse(n);const t=n.replace(/^\uFEFF/,"").trim().split(/\r?\n/).filter(r=>r.trim());if(((s=t.shift())==null?void 0:s.trim())!=="time_s,amplitude,phase_rad")throw Error("CSV header must be time_s,amplitude,phase_rad. Use seconds and unwrapped radians.");const i={time_s:[],amplitude:[],phase_rad:[]};return t.forEach((r,a)=>{const o=r.split(",");if(o.length!==3||o.some(l=>!l.trim()||!Number.isFinite(Number(l))))throw Error(`Invalid numeric data on CSV row ${a+2}.`);Object.keys(i).forEach((l,c)=>i[l].push(Number(o[c])))}),i}function Iv({state:n,api:e,esc:t,commit:i,toast:s}){const r=document.createElement("dialog");r.className="source-dialog",document.body.append(r);const a=y=>r.querySelector(y),o=()=>r.close(),l=y=>{r.innerHTML=y,r.showModal(),r.querySelectorAll("[data-source-close]").forEach(v=>v.onclick=o)},c=y=>{a('[role="alert"]').textContent=y.message},d=y=>{const v=["time_s,amplitude,phase_rad",...y.time_s.map((T,S)=>[T,y.amplitude[S],y.phase_rad[S]].join(","))].join(`
`),g=URL.createObjectURL(new Blob([v],{type:"text/csv"})),E=document.createElement("a");E.href=g,E.download="source-signal.csv",E.click(),setTimeout(()=>URL.revokeObjectURL(g),1e3)},u=y=>y?`${y.time_s.length.toLocaleString()} samples · ${(y.time_s[0]*1e15).toFixed(3)}–${(y.time_s.at(-1)*1e15).toFixed(3)} fs`:"No time signal loaded",h=y=>y?`<table><thead><tr><th>Time (fs)</th><th>Amplitude</th><th>Phase (rad)</th></tr></thead><tbody>${y.time_s.slice(0,6).map((v,g)=>`<tr><td>${(v*1e15).toPrecision(6)}</td><td>${y.amplitude[g].toPrecision(6)}</td><td>${y.phase_rad[g].toPrecision(6)}</td></tr>`).join("")}</tbody></table>`:"",m='<label class="signal-file">Load time signal (CSV or JSON)<input type="file" accept=".csv,.json" aria-label="Time signal file"></label><p class="property-help">CSV: time_s,amplitude,phase_rad. Time is in seconds; phase is unwrapped radians. JSON uses arrays with the same names. 2–100,000 strictly increasing times. Amplitude and phase are interpolated separately; injection is zero outside the table.</p>';async function _(y,v,g){if(y.size>16e6)throw Error("Time signal file exceeds 16 MB.");const E=Dv(await y.text(),y.name);return g.signal=E,g.pulse="sampled",["wavelength","frequency"].includes(g.time_definition)&&(g.time_definition="standard"),(await e("/validate",v)).project}async function x(y){if(n.mode!=="layout")return;let v=structuredClone(n.project),g=v.sources.find(T=>T.id===y);if(!g||g.use_global_source)throw Error("Edit the global source settings for an inherited signal.");l(`<h2>Time signal · ${t(g.name)}</h2>${m}<div class="signal-summary"></div><div class="signal-table"></div><p role="alert" class="error"></p><div class="dialog-actions"><button data-export>Download CSV</button><button data-source-close>Cancel</button><button data-apply class="primary">Apply time signal</button></div>`);const E=()=>{a(".signal-summary").textContent=u(g.signal),a(".signal-table").innerHTML=h(g.signal),a("[data-export]").disabled=!g.signal,a("[data-apply]").disabled=!g.signal};E(),a('[type="file"]').onchange=async T=>{const S=T.target.files[0];if(S)try{const A=structuredClone(v),M=A.sources.find(R=>R.id===y);v=await _(S,A,M),g=v.sources.find(R=>R.id===y),a('[role="alert"]').textContent="",E()}catch(A){c(A)}finally{a('[type="file"]').value=""}},a("[data-export]").onclick=()=>d(g.signal),a("[data-apply]").onclick=async()=>{try{g.pulse="sampled",["wavelength","frequency"].includes(g.time_definition)&&(g.time_definition="standard");const T=await e("/validate",v);i(T.project),o()}catch(T){c(T)}}}async function p(){if(n.mode!=="layout")return;let y=structuredClone(n.project);y.global_source??(y.global_source=structuredClone(ld));const v=(T,S,A,M="",b={})=>{const R={wavelength:"wavelength (µm)","pulselength (power FWHM)":"pulselength (fs)",offset:"offset (fs)","pulse width":"pulse cycles"}[T]||T;return`<label class="property-row"><span>${T}</span><input aria-label="global ${R}" data-path="${S}" type="number" step="any" data-scale="${b.scale||1}" ${b.reciprocal?`data-reciprocal="${b.reciprocal}"`:""} value="${A}"><small>${M}</small></label>`},g=(T,S,A,M)=>`<label class="property-row"><span>${T}</span><select aria-label="global ${T}" data-path="${S}">${M.map(([b,R])=>`<option value="${b}" ${b===A?"selected":""}>${R}</option>`).join("")}</select></label>`,E=()=>{const T=y.global_source;r.innerHTML=`<h2>Global source settings</h2><p>Shared temporal settings for sources with “Use global source settings” enabled. Each source keeps its own amplitude, phase and position.</p>${dd(T,v,g,"global ")}${m}<div class="signal-summary">${u(T.signal)}</div><p role="alert" class="error"></p><div class="dialog-actions"><button data-export ${T.signal?"":"disabled"}>Download signal CSV</button><button data-source-close>Cancel</button><button data-apply class="primary">Apply global settings</button></div>`,a("[data-source-close]").onclick=o,r.querySelectorAll("[data-path]").forEach(S=>S.onchange=()=>{const A=S.type==="checkbox"?S.checked:S.type==="number"?S.dataset.reciprocal?Number(S.dataset.reciprocal)/Number(S.value):Number(S.value)*Number(S.dataset.scale||1):S.value;if(cd(T,S.dataset.path,A),S.type!=="number")E();else if(a("[data-source-band-summary]")){const M=zo(T);a("[data-source-band-summary]").textContent=`${M.chirped?"Chirped":"Standard"} Gaussian · center ${M.wavelength.toFixed(5)} µm · power FWHM ${(M.length*1e15).toFixed(4)} fs · offset ${(M.offset*1e15).toFixed(4)} fs. The spectrum extends beyond the requested range.`}}),a('[type="file"]').onchange=async S=>{const A=S.target.files[0];if(A)try{const M=structuredClone(y);y=await _(A,M,M.global_source),E()}catch(M){c(M)}},a("[data-export]").onclick=()=>d(T.signal),a("[data-apply]").onclick=async()=>{try{const S=await e("/validate",y);i(S.project),o()}catch(S){c(S)}}};E(),r.showModal()}async function f(y){const v=structuredClone(n.project);l('<h2>Source time signal and spectrum</h2><p>Computing the injection at the current mesh time step…</p><p role="alert" class="error"></p><div class="dialog-actions"><button data-source-close>Close</button></div>');try{const g=await e("/sources/"+encodeURIComponent(y)+"/preview",v);if(!r.open)return;r.innerHTML=`<h2>Source preview · ${t(g.name)}</h2><p>${g.inherited?"Global":"Local"} pulse settings · ${g.enabled?"Enabled":"Disabled: zero injection"} · Δt ${g.dt_fs.toFixed(5)} fs · ${g.signal.length.toLocaleString()} samples</p>${g.pulse_parameters?`<p>${g.pulse_parameters.chirped?"Chirped":"Unchirped"} carrier · center ${g.pulse_parameters.center_wavelength_um.toFixed(5)} µm · power FWHM ${(g.pulse_parameters.pulse_length_s*1e15).toFixed(4)} fs</p>`:""}<div class="source-plot-tabs"><button data-mode="time" class="active">Time signal</button><button data-mode="spectrum">Spectrum</button><select aria-label="Source spectrum axis" hidden><option value="frequency">Frequency</option><option value="wavelength">Wavelength</option></select></div><canvas aria-label="Source waveform"></canvas><p>${t(g.note)}</p><div class="dialog-actions"><button data-source-close>Close</button></div>`;let E=!1;const T=()=>Is(a("canvas"),[g],E,a("select").value==="wavelength");r.querySelectorAll("[data-mode]").forEach(S=>S.onclick=()=>{E=S.dataset.mode==="spectrum",a("select").hidden=!E,r.querySelectorAll("[data-mode]").forEach(A=>A.classList.toggle("active",A===S)),T()}),a("select").onchange=T,a("[data-source-close]").onclick=o,T()}catch(g){r.open?c(g):s(g.message)}}return{signal:x,globals:p,preview:f}}function Uv({host:n,material:e,editable:t,api:i,esc:s,begin:r,current:a,invalidate:o,timestep:l,use:c}){var x,p,f;const d=y=>n.querySelector(y),u=e.fit_band_um||[((x=e.samples)==null?void 0:x.wavelength_um[0])||"",((p=e.samples)==null?void 0:p.wavelength_um.at(-1))||""];n.innerHTML=`<details class="material-fit"><summary>Measured optical data · import and fit</summary>
 <p>Supply your own passive isotropic n/k or complex permittivity samples. The table and its reference are saved with the project.</p>
 <fieldset ${t?"":"disabled"}>
 <div class="fit-controls"><label>Columns <select aria-label="Optical data columns"><option value="nk">Wavelength, n, k</option><option value="epsilon">Wavelength, ε real, ε imaginary</option></select></label>
 <label>Wavelength unit <select aria-label="Optical wavelength unit"><option value="um">µm</option><option value="nm">nm</option><option value="m">m</option></select></label>
 <label>CSV / text file <input aria-label="Optical data file" type="file" accept=".csv,.txt,.tsv"></label></div>
 <textarea aria-label="Optical data table" rows="5" placeholder="wavelength_um,n,k&#10;1.0,1.50,0.01&#10;1.5,1.49,0.01&#10;2.0,1.48,0.01"></textarea>
 <label class="fit-reference">Data reference <input aria-label="Optical data reference" maxlength="2000" value="${s(((f=e.samples)==null?void 0:f.reference)||"")}" placeholder="Citation or measurement description"></label>
 <button data-import>Import data</button><span data-data-status>${e.samples?`${e.samples.wavelength_um.length} samples retained`:"No samples imported"}</span>
 <div class="fit-controls"><label>Fit start (µm) <input aria-label="Fit wavelength start" type="number" step="any" min="0" value="${u[0]}"></label>
 <label>Fit stop (µm) <input aria-label="Fit wavelength stop" type="number" step="any" min="0" value="${u[1]}"></label>
 <label>Maximum poles <input aria-label="Maximum fit poles" type="number" min="1" max="16" value="6"></label>
 <label>RMS tolerance <input aria-label="Fit tolerance" type="number" min="0" max="1" step="any" value="0.001"></label>
 <label>Response <select aria-label="Fit response"><option value="analytic">Continuous material</option><option value="ade">FDTD at current timestep</option></select></label>
 <label><input aria-label="Include Drude pole" type="checkbox" checked> Include Drude pole</label></div>
 <button data-fit ${e.samples?"":"disabled"}>Fit optical data</button> <button data-use-fit disabled>Use fitted material</button>
 </fieldset><p class="fit-status" role="status">Fit accuracy applies inside the sampled band. Device accuracy also requires time and mesh convergence.</p>
 <canvas aria-label="Measured and fitted optical response"></canvas></details>`;let h=null;const m=y=>{d(".fit-status").textContent=y};function _(){h=null,d("[data-use-fit]").disabled=!0,o(),m("Inputs changed. Fit again to update the candidate.");const y=d("canvas");y.getContext("2d").clearRect(0,0,y.width,y.height)}return n.querySelectorAll("input,select,textarea").forEach(y=>y.oninput=_),n.querySelectorAll('textarea,[aria-label="Optical data columns"],[aria-label="Optical wavelength unit"],[aria-label="Optical data file"]').forEach(y=>y.addEventListener("input",()=>{d("[data-fit]").disabled=!0})),d('[aria-label="Optical data file"]').onchange=async y=>{const v=r(),g=y.target.files[0];if(g){if(g.size>2e6){m("Optical data file exceeds 2 MB.");return}try{const E=await g.text();if(!a(v))return;d("textarea").value=E,d('[aria-label="Optical data reference"]').value=g.name,_()}catch(E){a(v)&&m(E.message)}}},d("[data-import]").onclick=async()=>{const y=r();m("Reading optical samples…");try{const v=await i("/materials/data",{text:d("textarea").value,kind:d('[aria-label="Optical data columns"]').value,unit:d('[aria-label="Optical wavelength unit"]').value,reference:d('[aria-label="Optical data reference"]').value});if(!a(y))return;e.samples=v,e.fit_band_um=null,e.fit_dt_s=null,h=null,d('[aria-label="Fit wavelength start"]').value=v.wavelength_um[0],d('[aria-label="Fit wavelength stop"]').value=v.wavelength_um.at(-1),d("[data-data-status]").textContent=`${v.wavelength_um.length} samples · ${v.wavelength_um[0]}–${v.wavelength_um.at(-1)} µm`,d("[data-fit]").disabled=!t,d("[data-use-fit]").disabled=!0,o(),m("Data imported. Fit to create simulation coefficients.")}catch(v){a(y)&&m(v.message)}},d("[data-fit]").onclick=async()=>{const y=r();h=null,d("[data-use-fit]").disabled=!0,m("Fitting passive oscillators…");try{const v={max_poles:Number(d('[aria-label="Maximum fit poles"]').value),tolerance:Number(d('[aria-label="Fit tolerance"]').value),wavelength_range_um:[Number(d('[aria-label="Fit wavelength start"]').value),Number(d('[aria-label="Fit wavelength stop"]').value)],include_drude:d('[aria-label="Include Drude pole"]').checked,target:d('[aria-label="Fit response"]').value},g=structuredClone(e.samples);if(g.reference=d('[aria-label="Optical data reference"]').value,v.dt_s=await l(),!a(y))return;const E=await i("/materials/fit",{data:g,options:v,name:e.name,color:e.color});if(!a(y))return;h=E;const T=E.report,S=T.target==="ade"?"numerical":"fitted";Is(d("canvas"),[["measured_n","n (data)"],["measured_k","k (data)"],[`${S}_n`,"n (fit)"],[`${S}_k`,"k (fit)"]].map(([A,M])=>({name:M,wavelength_um:T.wavelength_um,spectrum:T[A],spectrum_label:"Wavelength (µm) · measured and fitted n + i k"})),!0,!0),m(`${T.converged?"Tolerance met":"Tolerance NOT met"} · ${T.pole_count} poles · ${T.sample_count} samples · analytic RMS ${T.analytic.normalized_rms.toExponential(3)} · FDTD RMS ${T.ade.normalized_rms.toExponential(3)} at Δt ${(T.dt_s*1e15).toPrecision(5)} fs · ${T.seconds.toFixed(2)} s. ${T.converged?"Use fitted material, then Apply materials to save.":"Adjust the fit band or pole limit. Current coefficients have not changed."}`),d("[data-use-fit]").disabled=!t||!T.converged}catch(v){a(y)&&m(v.message)}},d("[data-use-fit]").onclick=()=>{h!=null&&h.report.converged&&c(h.material)},{invalidate(){h=null,d("[data-use-fit]").disabled=!0,m("Material parameters changed. Fit again to update the candidate.")}}}const uc={model:"dielectric",index:1.5,color:"#60bdaa",epsilon_inf:1,plasma_rad_s:2e15,collision_rad_s:1e14,resonance_rad_s:2e15,linewidth_rad_s:1e14,delta_epsilon:1,poles:[],epsilon_tensor:[2.25,2.25,2.25,0,0,0]};function Nv({state:n,api:e,esc:t,toast:i,commit:s}){const r=document.createElement("dialog");r.className="material-dialog",document.body.append(r);let a,o=0,l=0,c;r.onclose=()=>{l++};const d=v=>r.querySelector(v),u=(v,g,E="",T=0)=>`<label class="material-field"><span>${v}</span><input aria-label="${v}" data-material-field="${g}" type="${g==="name"?"text":g==="color"?"color":"number"}" value="${t(a.materials[o][g])}" ${g==="name"?'maxlength="100"':`min="${T}" step="any"`}><small>${E}</small></label>`,h=()=>({resonance_rad_s:2e15,strength_rad_s_squared:4e30,damping_rad_s:1e14});function m(v){return`<div class="pole-editor">${v.poles.map((g,E)=>`<details open class="boundary-options"><summary>Pole ${E+1}</summary>${[["Resonance","resonance_rad_s","rad/s",0],["Oscillator strength","strength_rad_s_squared","rad²/s²",1e-30],["Damping","damping_rad_s","rad/s",0]].map(([T,S,A,M])=>`<label class="material-field"><span>${T}</span><input aria-label="Pole ${E+1} ${T}" type="number" min="${M}" step="any" data-pole-index="${E}" data-pole-field="${S}" value="${t(g[S])}"><small>${A}</small></label>`).join("")}<button data-remove-pole="${E}" ${v.poles.length<2?"disabled":""}>Remove pole ${E+1}</button></details>`).join("")}<button data-add-pole ${v.poles.length>=16?"disabled":""}>+ Add pole</button><p>Set resonance to zero for a Drude pole. Strength must be positive and damping nonnegative. Measured optical samples can be fitted below.</p></div>`}function _(v){return`<div class="tensor-material-editor"><p>Real symmetric relative permittivity in the Cartesian x, y, z basis. Principal permittivities must be at least 1.</p>${["xx","yy","zz","xy","xz","yz"].map((g,E)=>`<label class="material-field"><span>ε${g}</span><input aria-label="Tensor epsilon ${g}" data-tensor-index="${E}" type="number" step="any" value="${t(v.epsilon_tensor[E])}"><small>relative</small></label>`).join("")}<p>Uniform 3D grid, resident FP32, point sources and monitors. Periodic/Bloch boundaries or PML with a fixed isotropic exterior. Geometry is sampled at common nodes.</p><button data-tensor-sampling>Use supported tensor sampling</button><p>This stages staircase geometry and Yee field sampling. Apply materials saves both changes.</p></div>`}function x(){return"Tensor material: six Cartesian coefficients are used directly. Scalar n / k and isotropic optical-data fitting do not apply."}function p(){l++;const v=a.materials[o];Object.entries(uc).forEach(([g,E])=>v[g]??(v[g]=structuredClone(E))),r.innerHTML=`<div class="fsp-heading"><h2>Material database</h2><button data-dismiss>Close</button></div><p>Dielectric, full symmetric tensor, Drude, Lorentz and multiple passive poles.</p><div class="material-workspace"><aside><select size="8" aria-label="Material list">${a.materials.map((g,E)=>`<option value="${E}" ${E===o?"selected":""}>${t(g.name)}</option>`).join("")}</select><button data-add-material>+ Add material</button></aside><section><fieldset ${n.mode!=="layout"?"disabled":""}>${u("Material name","name")}${u("Display color","color")}<label class="material-field"><span>Material model</span><select aria-label="Material model" data-material-field="model">${[["dielectric","Dielectric"],["tensor","Symmetric dielectric tensor"],["drude","Plasma (Drude)"],["lorentz","Lorentz"],["multipole","Multiple Drude / Lorentz poles"]].map(([g,E])=>`<option value="${g}" ${v.model===g?"selected":""}>${E}</option>`).join("")}</select></label>${v.model==="tensor"?_(v):v.model==="dielectric"?u("Refractive index","index","",1):u("Permittivity (epsilon infinity)","epsilon_inf","",1)}${v.model==="drude"?u("Plasma resonance","plasma_rad_s","rad/s")+u("Plasma collision","collision_rad_s","rad/s"):v.model==="lorentz"?u("Lorentz permittivity","delta_epsilon")+u("Lorentz resonance","resonance_rad_s","rad/s")+u("Lorentz linewidth","linewidth_rad_s","rad/s"):v.model==="multipole"?m(v):""}</fieldset><p class="material-formula">${v.model==="tensor"?"ε = [[εxx, εxy, εxz], [εxy, εyy, εyz], [εxz, εyz, εzz]]":v.model==="dielectric"?"ε = n²":v.model==="drude"?"ε(ω) = ε∞ − ωp² / (ω² + i γ ω)":v.model==="multipole"?"ε(ω) = ε∞ + Σ Aⱼ / (ωⱼ² − ω² − i γⱼ ω)":"ε(ω) = ε∞ + Δε ω₀² / (ω₀² − ω² − 2 i δ ω)"}${v.model==="tensor"?"":"<br>Frequency parameters above are angular frequencies, in rad/s."}</p></section></div><div data-optical-fit></div><div class="material-range"><label>Wavelength start (µm) <input aria-label="Material wavelength start" type="number" value="1.3" min="0.001" step=".01"></label><label>Wavelength stop (µm) <input aria-label="Material wavelength stop" type="number" value="1.8" min="0.001" step=".01"></label><button data-preview>Plot n / k</button></div><canvas></canvas><p class="material-status" role="status">Preview includes the current simulation timestep.</p><div class="dialog-actions"><button data-apply ${n.mode!=="layout"?"disabled":""}>Apply materials</button><button data-dismiss>Cancel</button></div>`,c=v.model==="tensor"?null:Uv({host:d("[data-optical-fit]"),material:v,editable:n.mode==="layout",api:e,esc:t,begin:()=>++l,current:g=>g===l&&r.open,invalidate:f,timestep:async()=>(await e("/validate",a)).dt_fs*1e-15,use:g=>{a.materials[o]=g,p(),y()}}),d('[aria-label="Material list"]').onchange=g=>{o=+g.target.value,p()},d("[data-add-material]").disabled=n.mode!=="layout",d("[data-add-material]").onclick=()=>{let g=a.materials.length;for(;a.materials.some(E=>E.name===`Custom material ${g}`);)g++;a.materials.push({...structuredClone(uc),name:`Custom material ${g}`}),o=a.materials.length-1,p()},r.querySelectorAll("[data-material-field]").forEach(g=>g.onchange=()=>{const E=g.dataset.materialField,T=v.name;if(E==="name"&&(!g.value.trim()||a.materials.some((S,A)=>A!==o&&S.name===g.value))){g.value=T,d(".material-status").textContent="Material names must be nonempty and unique.";return}v[E]=["name","model","color"].includes(E)?g.value:Number(g.value),E==="name"&&a.structures.forEach(S=>{S.material===T&&(S.material=v.name)}),E==="model"&&v.model==="multipole"&&!v.poles.length&&v.poles.push(h()),E==="model"||E==="name"?p():f()}),r.querySelectorAll(".material-range input").forEach(g=>g.onchange=f),r.querySelectorAll("[data-dismiss]").forEach(g=>g.onclick=()=>r.close()),d("[data-add-pole]")&&(d("[data-add-pole]").onclick=()=>{v.poles.length<16&&(v.poles.push(h()),p())}),r.querySelectorAll("[data-remove-pole]").forEach(g=>g.onclick=()=>{v.poles.splice(+g.dataset.removePole,1),p()}),r.querySelectorAll("[data-pole-field]").forEach(g=>g.onchange=()=>{v.poles[+g.dataset.poleIndex][g.dataset.poleField]=Number(g.value),f()}),r.querySelectorAll("[data-material-field],[data-pole-field]").forEach(g=>g.addEventListener("input",f)),r.querySelectorAll("[data-tensor-index]").forEach(g=>{g.onchange=()=>{v.epsilon_tensor[+g.dataset.tensorIndex]=Number(g.value),f()},g.addEventListener("input",f)}),d("[data-tensor-sampling]")&&(d("[data-tensor-sampling]").onclick=()=>{a.region.interface_method="staircase",a.region.material_sampling="yee",f(),d(".material-status").textContent="Staircase geometry and Yee field sampling staged. Apply materials to save."}),d("[data-preview]").disabled=v.model==="tensor",d(".material-range").hidden=v.model==="tensor",d(".material-range + canvas").hidden=v.model==="tensor",v.model==="tensor"&&(d(".material-status").textContent=x()),d("[data-preview]").onclick=y,d("[data-apply]").onclick=async()=>{try{const g=await e("/validate",a);s(g.project),r.close()}catch(g){d(".material-status").textContent=g.message,i(g.message)}}}function f(){l++,c==null||c.invalidate();const v=d(".material-range + canvas");v.getContext("2d").clearRect(0,0,v.width,v.height),d(".material-status").textContent=a.materials[o].model==="tensor"?x():"Parameters changed. Select Plot n / k to refresh."}async function y(){if(a.materials[o].model==="tensor"){d(".material-status").textContent=x();return}const v=++l;try{const g=Number(d('[aria-label="Material wavelength start"]').value),E=Number(d('[aria-label="Material wavelength stop"]').value),T=(await e("/validate",a)).dt_fs;if(v!==l)return;const S=await e(`/materials/preview?wavelength_start=${g}&wavelength_stop=${E}&dt_fs=${T}`,a.materials[o]);if(v!==l)return;Is(d(".material-range + canvas"),["n","k","numerical_n","numerical_k"].map((A,M)=>({name:["n (analytic)","k (analytic)","n (ADE)","k (ADE)"][M],wavelength_um:S.wavelength_um,spectrum:S[A],spectrum_label:"Wavelength (µm) · complex index n + i k"})),!0,!0),d(".material-status").textContent=`${S.wavelength_um.length} wavelengths · analytic response and ADE at Δt = ${T.toPrecision(5)} fs. Positive k means absorption.${S.samples?` Retained samples: analytic RMS ${S.samples.analytic.normalized_rms.toExponential(3)}, FDTD RMS ${S.samples.ade.normalized_rms.toExponential(3)}.`:""}`}catch(g){v===l&&(d(".material-status").textContent=g.message)}}return{open(){a=structuredClone(n.project),o=0,p(),r.showModal()}}}function Fv({api:n,esc:e}){const t=document.createElement("dialog");t.className="capability-dialog",document.body.append(t);let i;const s=a=>t.querySelector(a);function r(){const a=s("[data-search]").value.toLowerCase(),o=s("[data-status]").value,l=s("[data-category]").value,c=s("[data-priority]").value,d=i.features.filter(u=>(!o||u.native===o)&&(!l||u.category===l)&&(!c||u.product_priority===c)&&(!s("[data-remaining]").checked||u.remaining)&&[u.name,u.category,u.scope,u.workstream_title].join(" ").toLowerCase().includes(a)).sort((u,h)=>u.delivery_rank-h.delivery_rank||u.name.localeCompare(h.name));s(".capability-count").textContent=`${d.length.toLocaleString()} / ${i.features.length.toLocaleString()} entries`,s("tbody").innerHTML=d.map(u=>`<tr><td>${u.native==="implemented"?"☑":"☐"}</td><td><b>${e(u.product_priority)}</b><small>${e(i.decision_labels[u.decision])}</small></td><td><small>${e(u.workstream_title)} · ${e(u.category)}</small>${u.reference?`<a href="${e(u.reference)}" target="_blank" rel="noopener">${e(u.name)}</a>`:`<span>${e(u.name)}</span>`}</td>${["native","python","ui","fsp"].map(h=>`<td><span class="cap-status ${u[h]}">${e(i.status_labels[u[h]])}</span></td>`).join("")}<td>${e(u.scope)}<small>${e(u.priority_reason)}</small>${u.evidence.length?`<small>${u.evidence.map(e).join(" · ")}</small>`:""}</td></tr>`).join("")}return{async open(){i=await n("/capabilities"),t.innerHTML=`<div class="fsp-heading"><h2>Feature priorities and checklist</h2><button data-close-panel>Close</button></div><p>${e(i.priority_note)}</p><p>${Object.entries(i.remaining_priority_counts).sort().map(([a,o])=>`${e(a)}: ${o} remaining entries`).join(" · ")}</p><div class="capability-filters"><input data-search aria-label="Search capabilities" placeholder="Search feature or property"><select data-priority aria-label="Capability priority"><option value="">All priorities</option>${Object.entries(i.priority_labels).map(([a,o])=>`<option value="${a}">${e(o)}</option>`).join("")}</select><select data-status aria-label="Capability status"><option value="">All statuses</option>${Object.entries(i.status_labels).map(([a,o])=>`<option value="${a}">${e(o)}</option>`).join("")}</select><select data-category aria-label="Capability category"><option value="">All categories</option>${[...new Set(i.features.map(a=>a.category))].map(a=>`<option>${e(a)}</option>`).join("")}</select><label><input data-remaining type="checkbox" aria-label="Remaining work only"> Remaining work only</label><a href="/api/capabilities" target="_blank">JSON</a><span class="capability-count"></span></div><div class="capability-table"><table><thead><tr><th></th><th>Priority</th><th>Feature / property</th><th>Native engine</th><th>Python</th><th>UI</th><th>Independent FSP</th><th>Scope / reason / evidence</th></tr></thead><tbody></tbody></table></div>`,s("[data-close-panel]").onclick=()=>t.close(),s("[data-search]").oninput=r;for(const a of["data-status","data-category","data-priority","data-remaining"])s("["+a+"]").onchange=r;r(),t.showModal()}}}function Ov({esc:n}){const e=document.createElement("dialog");e.className="inverse-design-dialog",document.body.append(e);const t=A=>e.querySelector(A),i="torchfdtd.periodicDesign.v1",s=i+".job";let r,a=localStorage.getItem(s),o,l=!1,c=null,d=!1,u=!1;async function h(A,M){var I;const b=await fetch("/api/"+A,M===void 0?{}:{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(M)}),R=(I=b.headers.get("content-type"))!=null&&I.includes("json")?await b.json():await b.text();if(!b.ok)throw Error(typeof R.detail=="string"?R.detail:JSON.stringify(R.detail||R));return R}function m(){localStorage.setItem(i,JSON.stringify(r))}function _(A,M,b="application/json"){const R=URL.createObjectURL(new Blob([A],{type:b})),I=document.createElement("a");I.href=R,I.download=M,I.click(),setTimeout(()=>URL.revokeObjectURL(R),1e3)}function x(A){t("[data-design-status]").textContent=A.message}const p=(A,M,b,R="any")=>`<label>${A}<input aria-label="${A}" data-key="${M}" type="number" step="${R}" value="${n(b)}"></label>`,f=(A,M,b)=>`<label>${A}<select aria-label="${A}" data-key="${M}">${b.map(([R,I])=>`<option value="${R}" ${r[M]===R?"selected":""}>${I}</option>`).join("")}</select></label>`;function y(){var B;const A=d&&((B=c==null?void 0:c.progress)!=null&&B.density_preview)?c.progress.density_preview:r.initial_density,M=t("[data-density]"),b=M.getContext("2d"),R=A.length,I=A[0].length;b.clearRect(0,0,M.width,M.height);for(let H=0;H<R;H++)for(let k=0;k<I;k++){const $=Math.max(0,Math.min(1,Number(A[H][k])));b.fillStyle=`rgb(${Math.round(18+207*$)},${Math.round(39+190*$)},${Math.round(65+95*$)})`,b.fillRect(H*M.width/R,(I-1-k)*M.height/I,Math.ceil(M.width/R),Math.ceil(M.height/I))}t("[data-density-caption]").textContent=(d?"Latest evaluated density":"Initial density")+` · x: ${R}, y: ${I} · 0 background / 1 design material`}function v(A){l=A,e.querySelectorAll("fieldset").forEach(M=>M.disabled=A),t("[data-start-design]").disabled=A,t("[data-plan-design]").disabled=A,t("[data-stop-design]").disabled=!A,t("[data-load-design]").disabled=A,t("[data-use-seed]").disabled=A||!(c!=null&&c.summary)}function g(){e.innerHTML=`<div class="fsp-heading"><div><h2>Inverse design · periodic layer</h2><p>FP32 · Torch adjoint · automatic memory placement</p></div><button data-close-design>Close</button></div>
  <p class="design-scope">Optimize a continuous density layer at one wavelength. This setup is separate from the CAD scene. Fixed materials, periodic x/y boundaries and PML in z. Mesh convergence and fabrication constraints require separate validation.</p>
  <div class="design-grid"><section class="design-settings"><fieldset><legend>Structure & illumination</legend>
   ${p("Wavelength (µm)","wavelength_um",r.wavelength_um)}
   ${p("Period x (µm)","period_um.0",r.period_um[0])}${p("Period y (µm)","period_um.1",r.period_um[1])}
   ${p("Layer height (µm)","height_um",r.height_um)}${p("Detector offset (µm)","detector_offset_um",r.detector_offset_um)}
   ${p("Background index","background_index",r.background_index)}${p("Design index","design_index",r.design_index)}
   ${p("Incidence θ (degrees)","theta_deg",r.theta_deg)}${p("Azimuth φ (degrees)","phi_deg",r.phi_deg)}
   ${p("Mesh (µm)","mesh_um",r.mesh_um)}${p("Time steps","steps",r.steps,1)}${p("PML cells","pml_cells",r.pml_cells,1)}
  </fieldset><fieldset><legend>Objective & optimizer</legend><p>Maximize weighted quadrant power, averaged over two polarizations.</p>
   ${["R","G2","G1","B"].map((b,R)=>p(b+" weight","objective_weights."+R,r.objective_weights[R])).join("")}
   ${p("Adam updates","iterations",r.iterations,1)}${p("Learning rate","learning_rate",r.learning_rate)}
  </fieldset><fieldset><legend>Memory & execution</legend>
   ${f("Compute device","device",[["cpu","CPU"],["cuda","CUDA GPU"]])}
   ${f("Execution mode","execution",[["auto","Automatic"],["resident","Resident"],["recorded","Boundary-history adjoint"],["dram","DRAM streaming"],["file","File streaming"]])}
   ${p("GPU budget (GiB)","gpu_budget_gib",r.gpu_budget_gib)}${p("DRAM budget (GiB)","host_budget_gib",r.host_budget_gib)}
   ${r.execution==="recorded"?`
    ${f("Boundary history","recorded_trace_storage",[["cpu","CPU RAM"],["device","Compute device"]])}
    ${p("Transfer block (steps)","recorded_trace_chunk_steps",r.recorded_trace_chunk_steps,1)}
    ${p("Fixed collar (cells)","recorded_collar_cells",r.recorded_collar_cells,1)}
    <p data-recorded-scope>Reconstruct the lossless design interior from boundary history. Fields remain on the compute device. The layer and source must fit inside the fixed exterior collar. CUDA with CPU history uses asynchronous transfers.</p>
   `:`${p("Checkpoints","checkpoints",r.checkpoints,1)}${p("Maximum slab width","slab_width",r.slab_width,1)}${p("Temporal depth","temporal_depth",r.temporal_depth,1)}
    <details><summary>Optional file backing</summary><label>State directory<input aria-label="State directory" data-key="state_directory" value="${n(r.state_directory||"")}"></label>
    ${p("File budget (GiB)","disk_budget_gib",r.disk_budget_gib??"")}${p("Keep disk free (GiB)","disk_free_reserve_gib",r.disk_free_reserve_gib)}<p>Used only when explicitly configured. Default free-space reserve: 100 GiB.</p></details>`}
  </fieldset></section>
  <section class="design-density"><h3>Design region</h3><canvas data-density width="512" height="512" aria-label="Density editor"></canvas><p data-density-caption></p>
   <fieldset><legend>Initial density</legend><div class="design-density-tools"><label>x pixels<input aria-label="Density x pixels" data-nx type="number" value="${r.initial_density.length}" min="1" max="1024"></label><label>y pixels<input aria-label="Density y pixels" data-ny type="number" value="${r.initial_density[0].length}" min="1" max="1024"></label><label>Paint value<input aria-label="Density paint value" data-paint type="number" value="0.5" min="0" max="1" step="0.1"></label></div><button data-reset-density>Fill / resize initial density</button><button data-show-initial>Show initial density</button><p>Click or drag to paint. x increases right and y increases upward.</p></fieldset>
   <div class="design-file-tools"><button data-save-design>Save setup JSON</button><button data-load-design>Load setup JSON</button><button data-export-design>Export Python</button><input data-import-design type="file" accept=".json" hidden></div>
   <button data-use-seed disabled>Use evaluated result as new seed</button>
  </section>
  <section class="design-run"><h3>Execution plan</h3><button data-plan-design>Check memory</button><p data-plan-summary>No fields or trial simulations are run by the memory check.</p>
   <div class="design-run-buttons"><button data-start-design>Run inverse design</button><button data-stop-design disabled>Stop</button></div><p data-design-status role="status">Ready</p><p class="design-stop-note">Stop takes effect between solver calls. Closing this panel keeps the job running.</p>
   <h3>Evaluated objective</h3><table><thead><tr><th>Update</th><th>Score ↑</th><th>Gradient L2</th></tr></thead><tbody data-design-history></tbody></table><a data-design-download hidden>Download evaluated designs</a>
  </section></div>`,t("[data-close-design]").onclick=()=>e.close(),e.querySelectorAll("[data-key]").forEach(b=>b.onchange=()=>{const[R,I]=b.dataset.key.split(".");let B=b.type==="number"?b.value===""?null:Number(b.value):b.value;R==="state_directory"&&!B&&(B=null),I!==void 0?r[R][Number(I)]=B:r[R]=B,m(),d=!1,R==="execution"?g():y(),t("[data-plan-summary]").textContent="Settings changed. Check memory before running."}),t("[data-reset-density]").onclick=()=>{try{const b=Number(t("[data-nx]").value),R=Number(t("[data-ny]").value),I=Number(t("[data-paint]").value);if(!Number.isInteger(b)||!Number.isInteger(R)||b<1||R<1||b*R>1048576||I<0||I>1)throw Error("Use positive pixel counts and a density in [0,1].");r.initial_density=Array.from({length:b},()=>Array(R).fill(I)),m(),d=!1,y(),t("[data-plan-summary]").textContent="Settings changed. Check memory before running."}catch(b){x(b)}},t("[data-show-initial]").onclick=()=>{d=!1,y()};const A=t("[data-density]");function M(b){if(l||d)return;const R=A.getBoundingClientRect(),I=r.initial_density,B=Number(t("[data-paint]").value);if(!Number.isFinite(B)||B<0||B>1)return;const H=Math.min(I.length-1,Math.max(0,Math.floor((b.clientX-R.left)/R.width*I.length))),k=Math.min(I[0].length-1,Math.max(0,I[0].length-1-Math.floor((b.clientY-R.top)/R.height*I[0].length)));I[H][k]=B,y()}A.onpointerdown=b=>{u=!0,A.setPointerCapture(b.pointerId),M(b)},A.onpointermove=b=>{u&&M(b)},A.onpointerup=()=>{u=!1,m()},t("[data-plan-design]").onclick=async()=>{try{const b=await h("design/plan",r);E(b)}catch(b){x(b)}},t("[data-start-design]").onclick=async()=>{try{v(!0),c=null,a=(await h("design/jobs",r)).id,localStorage.setItem(s,a),await S()}catch(b){v(!1),x(b)}},t("[data-stop-design]").onclick=async()=>{try{await h("jobs/"+a+"/cancel",{}),t("[data-design-status]").textContent="Stop requested. Waiting for the current solver call."}catch(b){x(b)}},t("[data-save-design]").onclick=()=>_(JSON.stringify(r,null,2),"periodic-design.json"),t("[data-export-design]").onclick=async()=>{try{_(await h("design/python",r),"periodic_design.py","text/x-python")}catch(b){x(b)}},t("[data-load-design]").onclick=()=>t("[data-import-design]").click(),t("[data-import-design]").onchange=async b=>{try{const R=b.target.files[0];if(!R)return;const I=JSON.parse(await R.text());r=await h("design/config",I),m(),d=!1,c=null,a=null,localStorage.removeItem(s),g()}catch(R){x(R)}},t("[data-use-seed]").onclick=async()=>{try{const b=await h("design/jobs/"+a+"/download");if(!b.last_evaluated)throw Error("No evaluated density is available.");r={...b.config,initial_density:b.last_evaluated.density},m(),d=!1,c=null,a=null,localStorage.removeItem(s),g()}catch(b){x(b)}},y(),v(l),c&&T(c)}function E(A){var b;const M=((b=A.selection)==null?void 0:b.mode)||A.execution;t("[data-plan-summary]").textContent=`${A.device==="cuda"?"CUDA GPU":"CPU"} · ${M} · FP32
GPU ${(A.gpu_reservation_bytes/1024**3).toFixed(3)} GiB · DRAM ${(A.total_host_reservation_bytes/1024**3).toFixed(3)} GiB · file ${(A.disk_reservation_bytes/1024**3).toFixed(3)} GiB reserved. No calibration solves.`}function T(A){var I;c=A;const M=A.progress||{};v(["queued","running"].includes(A.status));const b=JSON.stringify(A.config)===JSON.stringify(r);t("[data-design-status]").textContent=A.error||`${l&&A.cancel_requested?"Stopping":A.status} · ${M.stage||"waiting"} · ${M.updates_completed||0} / ${((I=A.config)==null?void 0:I.iterations)||r.iterations} updates`,M.plan&&b?E(M.plan):b||(t("[data-plan-summary]").textContent="Settings differ from the displayed run. Check memory for this setup."),t("[data-design-history]").innerHTML=(M.history||[]).map(B=>`<tr><td>${B.update}</td><td>${B.objective.toPrecision(7)}</td><td>${B.gradient_l2===void 0?"—":B.gradient_l2.toExponential(3)}</td></tr>`).join(""),M.density_preview&&b&&(d=!0,y());const R=t("[data-design-download]");R.hidden=!A.summary,R.href="/api/design/jobs/"+a+"/download"}async function S(){clearTimeout(o);try{const A=await h("jobs/"+a);T(A),l&&e.open&&(o=setTimeout(S,1500))}catch(A){v(!1),x(A)}}return e.addEventListener("close",()=>clearTimeout(o)),{async open(){if(!r){const A=await h("design/defaults");try{const M=JSON.parse(localStorage.getItem(i));r=M?await h("design/config",M):A}catch{r=A}if(!localStorage.getItem(i)){const M=await h("health");r.device=M.cuda?"cuda":"cpu"}}g(),e.showModal(),a&&await S()}}}function zv(n,e){const t={auto_shutoff:!1,decay_threshold:1e-6,check_interval:50,consecutive_checks:3,min_steps:100,source_tail_amplitude:1e-8,after_source_s:0,divergence_check:!0,growth_limit:1e6,field_limit:null};n.run_control??(n.run_control={});const i=n.run_control;for(const[r,a]of Object.entries(t))i[r]===void 0&&(i[r]=a);const s=(r,a,o="",l={})=>e(r,"run_control."+a,i[a],o,l);return`<label class="enabled-row"><input aria-label="Automatic decay shutoff" type="checkbox" data-path="run_control.auto_shutoff" ${i.auto_shutoff?"checked":""}> Automatic decay shutoff</label>`+s("decay threshold","decay_threshold","",{min:1e-15})+s("check every","check_interval","steps",{min:1,step:1})+s("consecutive low checks","consecutive_checks","",{min:2,step:1})+s("minimum time steps","min_steps","",{min:10,step:1})+s("source tail cutoff","source_tail_amplitude","",{min:1e-15})+e("wait after source","run_control.after_source_s",i.after_source_s*1e15,"fs",{min:0,scale:1e-15})+`<label class="enabled-row"><input aria-label="Divergence checking" type="checkbox" data-path="run_control.divergence_check" ${i.divergence_check?"checked":""}> Divergence checking</label>`+s("post-source growth limit","growth_limit","",{min:1.01})+`<label class="enabled-row"><input aria-label="Absolute field limit" type="checkbox" data-run-field-limit ${i.field_limit!==null?"checked":""}> Absolute field limit</label>`+(i.field_limit!==null?s("maximum field magnitude","field_limit","",{min:1e-30}):"")+'<p class="property-help">Decay threshold and growth limit are ratios of the whole-domain state norm. Source tail cutoff is a relative envelope amplitude. Absolute field limits use reduced field units. All finite sources must finish before decay checks. Continuous sources disable automatic termination. Confirm spectra with a longer run.</p>'}async function Bv({state:n,api:e,esc:t,toast:i}){const s=n.job;if(!s)throw Error("Complete a 3D run with a six-field frequency plane first.");const[r,a]=await Promise.all([e(`/jobs/${s}/diffraction-monitors`),e("/jobs")]);if(!r.length)throw Error("Add a full-cell frequency monitor and record all six E/H fields, then rerun.");const o=document.createElement("dialog");o.className="radiation-dialog monitor-dialog",o.style.width="min(1000px,92vw)",document.body.append(o);const l=h=>o.querySelector(h);o.innerHTML=`<div class="fsp-heading"><h2>Diffraction orders</h2><button data-close>Close</button></div>
 <p>Requires a complete periodic unit-cell plane with six collocated E/H fields in a homogeneous lossless isotropic medium outside PML. This is not an isolated-object far-field projection.</p>
 <label>Stored plane <select aria-label="Diffraction plane">${r.map(h=>`<option value="${t(h.id)}">${t(h.name)} (+${h.normal})</option>`).join("")}</select></label>
 <label>Frequency <select aria-label="Diffraction frequency"></select></label>
 <label>Exterior refractive index <input aria-label="Exterior refractive index" type="number" min="0.001" max="20" step="0.01" value="1"></label>
 <label>Integer orders (m,n per line)<textarea aria-label="Diffraction orders" rows="3">0,0</textarea></label>
 <label>Matched reference <select aria-label="Diffraction reference"><option value="">Raw directional powers only</option>${a.filter(h=>h.id!==s&&h.status==="completed").map(h=>`<option value="${t(h.id)}">${t(h.name)} (${t(h.id.slice(0,8))})</option>`).join("")}</select></label>
 <label><input type="checkbox" aria-label="Subtract incident diffraction fields"> Subtract matched incident fields before normalized power</label>
 <label><input type="checkbox" aria-label="Confirm diffraction exterior"> I confirm both planes are in the declared homogeneous, lossless isotropic exterior, outside PML.</label>
 <button data-calculate>Calculate diffraction</button><p role="status"></p><div data-results></div>`;let c=0;function d(){c++,l("[data-results]").innerHTML="",l('[role="status"]').textContent="",l("[data-calculate]").disabled=!1}function u(){const h=r.find(m=>m.id===l('[aria-label="Diffraction plane"]').value);l('[aria-label="Diffraction frequency"]').innerHTML=h.frequency_thz.map((m,_)=>`<option value="${_}">${m.toPrecision(7)} THz</option>`).join(""),l("[data-results]").innerHTML=""}l('[aria-label="Diffraction plane"]').onchange=u,u(),o.querySelectorAll("input,select,textarea").forEach(h=>{h.addEventListener("input",d),h.addEventListener("change",d)}),l("[data-close]").onclick=()=>o.close(),o.addEventListener("close",()=>{c++,o.remove()},{once:!0}),l("[data-calculate]").onclick=async()=>{const h=++c,m=l("[data-calculate]");m.disabled=!0,l("[data-results]").innerHTML="";try{const _=l('[aria-label="Diffraction orders"]').value.trim().split(/\n+/).map(y=>y.trim().split(/[\s,]+/).map(Number));if(!_.length||_.some(y=>y.length!==2||y.some(v=>!Number.isInteger(v))))throw Error("Enter one pair of integers per line, for example 0,0.");const x=l('[aria-label="Diffraction reference"]').value,p=await e(`/jobs/${s}/diffraction`,{monitor:l('[aria-label="Diffraction plane"]').value,frequency_index:Number(l('[aria-label="Diffraction frequency"]').value),orders:_,refractive_index:Number(l('[aria-label="Exterior refractive index"]').value),reference:x||null,subtract_incident:l('[aria-label="Subtract incident diffraction fields"]').checked,confirm_homogeneous_exterior:l('[aria-label="Confirm diffraction exterior"]').checked});if(h!==c)return;const f=y=>Number(y).toExponential(6);l('[role="status"]').textContent=`${p.frequency_thz.toPrecision(7)} THz; orders along ${p.transverse_axes.join(", ")}. ${p.normalized?"Reference-normalized efficiencies shown alongside raw directional powers.":"Raw directional powers only, not efficiencies."}`,l("[data-results]").innerHTML=`<table style="width:100%;text-align:left;border-spacing:8px"><thead><tr><th>Order</th><th>Type</th><th>+ normal raw power</th><th>- normal raw power</th>${p.normalized?"<th>Forward efficiency</th><th>Backward efficiency</th>":""}</tr></thead><tbody>${p.orders.map((y,v)=>`<tr><td>${y.join(", ")}</td><td>${p.propagating[v]?"Propagating":"Evanescent (zero real power)"}</td><td>${f(p.forward_power[v])}</td><td>${f(p.backward_power[v])}</td>${p.normalized?`<td>${f(p.forward_efficiency[v])}</td><td>${f(p.backward_efficiency[v])}</td>`:""}</tr>`).join("")}</tbody></table><p>Raw units: ${t(p.units)}. ${t(p.note)}${p.subtract_incident?" Normalized columns use incident-subtracted fields; raw columns retain total fields.":""}</p>`}catch(_){h===c&&(l('[role="status"]').textContent=_.message,i(_.message))}finally{h===c&&(m.disabled=!1)}},o.showModal()}function ud(n,e,t,{plane:i=!1,prefix:s="spectrum."}={}){const r=n.sampling,a=[...i?[]:[["fft","FFT bins"]],["frequency","Uniform frequency"],["wavelength","Uniform wavelength"],["chebyshev","Chebyshev nodes"],["custom","Custom frequencies"]];return t("sample spacing",s+"sampling",r,a)+(r==="custom"?`<label class="monitor-custom">Frequencies (THz)<textarea data-frequency-table data-prefix="${s}" aria-label="Custom frequencies (THz)">${(n.custom_frequencies_hz||[]).map(o=>o*1e-12).join(`
`)}</textarea></label>`:r!=="fft"?`<label class="enabled-row"><input type="checkbox" data-path="${s}use_source_limits" ${n.use_source_limits?"checked":""}> Use source wavelength limits</label><fieldset ${n.use_source_limits?"disabled":""}>`+e("minimum wavelength",s+"wavelength_start",n.wavelength_start,"µm",{min:.001})+e("maximum wavelength",s+"wavelength_stop",n.wavelength_stop,"µm",{min:.001})+"</fieldset>"+e("frequency points",s+"frequency_points",n.frequency_points,"",{min:1,step:1})+(r==="chebyshev"?t("Chebyshev node rule",s+"chebyshev_nodes",n.chebyshev_nodes||"roots",[["roots","Roots (interior)"],["lobatto","Lobatto (include endpoints)"]])+`<label class="enabled-row"><input type="checkbox" data-path="${s}chebyshev_wavelength" ${n.chebyshev_wavelength?"checked":""}> Chebyshev nodes in wavelength</label>`:""):"")}function kv(n,e,t,i){const s=n.record_fields??["Ex","Ey","Ez","Hx","Hy","Hz"],r=n.record_poynting??["x","y","z"],a=n.downsample_xyz??[n.downsample||1,n.downsample||1,n.downsample||1],o=(l,c,d)=>c.map(u=>`<label class="enabled-row"><input type="checkbox" data-record-family="${l}" value="${u}" ${d.includes(u)?"checked":""}> Record ${l==="record_poynting"?"P"+u:u}</label>`).join("");return i("normal axis","normal",n.normal,e.dimension==="2d"?["x","y"]:["x","y","z"])+["x","y","z"].filter(l=>l!==n.normal&&(e.dimension==="3d"||l!=="z")).map(l=>t("downsample "+l,"downsample_xyz."+"xyz".indexOf(l),a["xyz".indexOf(l)],"",{min:1,max:32,step:1})).join("")+i("spatial interpolation","spatial_interpolation",n.spatial_interpolation||"specified",[["specified","Specified plane"],["nearest","Nearest normal mesh node"]])+i("DFT accumulation precision","dft_precision",n.dft_precision||"field",[["field","Match solver precision"],["float64","Double precision"]])+o("record_fields",["Ex","Ey","Ez","Hx","Hy","Hz"],s)+o("record_poynting",["x","y","z"],r)+`<label class="enabled-row"><input type="checkbox" data-path="record_flux" ${n.record_flux!==!1?"checked":""}> Record signed flux</label><p class="property-help">Only fields required by the selected outputs are accumulated. Flux alone requires four tangential E/H components. Incident subtraction also requires storing those fields.</p><button data-action="flux-results">Open flux results</button>`}function Hv({state:n,api:e,esc:t,toast:i,commit:s,numeric:r,dropdown:a}){const o=document.createElement("dialog");o.className="monitor-dialog",document.body.append(o);const l=u=>o.querySelector(u);let c=0;function d(){o.querySelectorAll("[data-dismiss]").forEach(u=>u.onclick=()=>{c++,o.close()})}return{globals(){const u=structuredClone(n.project);u.global_monitor??(u.global_monitor={sampling:"frequency",wavelength_start:1.3,wavelength_stop:1.8,frequency_points:101,apodization:"none",apodization_center:2e-14,apodization_time_width:1e-14,custom_frequencies_hz:[],chebyshev_wavelength:!1});function h(){const m=u.global_monitor;o.innerHTML=`<div class="fsp-heading"><h2>Global monitor settings</h2><button data-dismiss>Close</button></div><fieldset ${n.mode!=="layout"?"disabled":""}>${ud(m,r,a,{plane:!0,prefix:""})}${a("apodization","apodization",m.apodization,["none","start","end","full"])}${r("apodization center","apodization_center",m.apodization_center*1e15,"fs",{scale:1e-15})}${r("apodization time width","apodization_time_width",m.apodization_time_width*1e15,"fs",{scale:1e-15})}<button data-apply>Apply monitor settings</button></fieldset><p class="monitor-status"></p>`,d(),o.querySelectorAll("[data-path]").forEach(x=>x.onchange=()=>{var p;m[x.dataset.path]=x.type==="checkbox"?x.checked:x.type==="number"?Number(x.value)*Number(x.dataset.scale||1):x.value,["sampling","use_source_limits"].includes(x.dataset.path)&&(m.sampling==="custom"&&!((p=m.custom_frequencies_hz)!=null&&p.length)&&(m.custom_frequencies_hz=[2e14]),h())});const _=l("[data-frequency-table]");_&&(_.onchange=()=>{m.custom_frequencies_hz=_.value.trim().split(/[\s,;]+/).filter(Boolean).map(x=>Number(x)*1e12)}),l("[data-apply]").onclick=async()=>{try{const x=await e("/validate",u);s(x.project),o.close()}catch(x){l(".monitor-status").textContent=x.message}}}h(),o.showModal()},async flux(){if(!n.job)throw Error("Run a project with a frequency monitor first.");const u=await e("/jobs/"+n.job),h=u.flux_monitors||[],m=await e("/jobs");o.innerHTML=`<div class="fsp-heading"><h2>Frequency fields / power flux</h2><button data-dismiss>Close</button></div><label>Monitor <select aria-label="Flux monitor">${h.map(x=>`<option value="${t(x.id)}">${t(x.name)} · +${x.normal}</option>`).join("")}</select></label><label>Reference run <select aria-label="Flux reference"><option value="">Raw signed flux</option>${m.filter(x=>x.id!==n.job&&x.flux_monitors.length).map(x=>`<option value="${x.id}">${t(x.name)} · ${x.id.slice(0,8)}</option>`).join("")}</select></label><label class="enabled-row"><input type="checkbox" aria-label="Subtract incident fields"> Subtract reference E/H before computing flux (reflection)</label><button data-plot-flux>Plot flux</button><button data-diffraction>Diffraction orders</button><a href="/api/jobs/${n.job}/flux.csv">Export raw flux CSV</a><canvas></canvas><p class="monitor-status"></p><p>Flux is signed along the positive monitor normal. A reflected wave can be negative. Reference normalization requires identical sources, mesh, duration and unapodized monitors. For an air reference, freeze graded refinements before removing structures, then run both scenes with the same monitor IDs. Absolute watt calibration is not provided.</p>`,d();async function _(){const x=++c;try{const p=h.find(g=>g.id===l('[aria-label="Flux monitor"]').value),f=l('[aria-label="Flux reference"]').value,y=l('[aria-label="Subtract incident fields"]').checked;let v={...p,spectrum:p.flux,signed:!0,spectrum_label:`Wavelength (µm) · signed flux (${p.units})`};if(f){const g=await e(`/jobs/${n.job}/normalize-flux?reference=${encodeURIComponent(f)}&monitor=${encodeURIComponent(p.id)}&subtract_incident=${y}`);if(x!==c)return;v={...p,...g,spectrum:g.ratio,signed:!0,spectrum_label:"Wavelength (µm) · signed normalized flux"},l(".monitor-status").textContent=`${g.valid.filter(Boolean).length}/${g.valid.length} frequencies above the reference threshold. Reflection is negative for propagation opposite the positive normal.`}else l(".monitor-status").textContent=`${p.points} spatial samples · collocated E/H · ${p.flux.length} frequencies. Raw reduced flux is not normalized transmission.`;Is(l("canvas"),[v],!0,!0)}catch(p){x===c&&(l(".monitor-status").textContent=p.message,i(p.message))}}l("[data-diffraction]").onclick=async()=>{try{await Bv({state:n,api:e,esc:t,toast:i}),o.close()}catch(x){i(x.message)}},l("[data-plot-flux]").onclick=_,l("[data-plot-flux]").disabled=!h.length,o.showModal(),h.length?await _():l(".monitor-status").textContent="No raw flux recorded. Diffraction orders can use a stored six-field plane."}}}function Gv({state:n,api:e,esc:t,commit:i}){const s=document.createElement("dialog");s.className="boundary-dialog",document.body.append(s);const r=[["pml","PML"],["periodic","Periodic"],["bloch","Bloch"],["pec","PEC"],["antisymmetric","Anti-symmetric (PEC)"],["pmc","PMC"],["symmetric","Symmetric (PMC)"]],a=["x_min","x_max","y_min","y_max","z_min","z_max"];function o(){if(n.mode!=="layout")throw Error("Switch to Layout before editing boundaries.");const l=n.project,c=structuredClone(l);s.innerHTML=`<h2>Boundary conditions</h2><p>Apply the complete face configuration in one edit.</p><div class="dialog-buttons"><button data-boundary-preset="pmc">All PMC</button><button data-boundary-preset="pec">All PEC</button><button data-boundary-preset="pml">All PML</button></div>${a.map(u=>`<label class="property-row"><span>${t(u.replace("_"," "))}</span><select aria-label="${t(u.replace("_"," "))} boundary" data-face="${u}" ${u.startsWith("z_")&&c.region.dimension==="2d"?"disabled":""}>${r.map(([h,m])=>`<option value="${h}" ${c.region.boundaries[u].kind===h?"selected":""}>${m}</option>`).join("")}</select></label>`).join("")}<p class="property-help">PMC and magnetic symmetry support PEC/PMC walls and restricted endpoint CPML. Use real FP32, fixed Yee meshes, point electric sources and point E/H monitors. Mixed CPML additionally requires uniform equal-spacing axes and a fixed isotropic PML exterior. Periodic/Bloch mixing is unsupported. Active PML faces must have equal layers and sigma scale, kappa 1, alpha 0, polynomial 3 and alpha polynomial 0.</p><p class="property-help">Face selections change kinds only. The explicit profile button below also sets active PML parameters. Source, material and mesh settings are preserved. Bloch phases are cleared on axes changed away from Bloch.</p><button data-endpoint-profile>Set supported endpoint CPML profile</button><p class="property-help">Profile button: selected PML faces use default region layers, sigma scale 1, kappa 1, alpha 0, cubic grading. Endpoint target sampling differs from ordinary scalar-Yee PML. Keep sources/monitors outside PML and material in PML plus one cell equal to background.</p><p data-boundary-status role="status" aria-live="polite"></p><div class="dialog-actions"><button data-boundary-apply>Apply boundaries</button><button data-boundary-close>Cancel</button></div>`;const d=[...s.querySelectorAll("[data-face]")];s.querySelectorAll("[data-boundary-preset]").forEach(u=>u.onclick=()=>d.filter(h=>!h.disabled).forEach(h=>h.value=u.dataset.boundaryPreset)),s.querySelector("[data-endpoint-profile]").onclick=()=>{const u=d.filter(h=>!h.disabled&&h.value==="pml");u.forEach(h=>Object.assign(c.region.boundaries[h.dataset.face],{layers:null,sigma_scale:1,kappa:1,alpha:0,polynomial:3,alpha_polynomial:0})),s.querySelector("[data-boundary-status]").textContent=u.length?"Supported endpoint CPML profile staged for "+u.length+" selected PML faces. Apply to validate.":"Select at least one PML face first."},s.querySelector("[data-boundary-close]").onclick=()=>s.close(),s.querySelector("[data-boundary-apply]").onclick=async()=>{const u=[...s.querySelectorAll("button,select")],h=u.map(_=>_.disabled);u.forEach(_=>_.disabled=!0);const m=s.querySelector("[data-boundary-status]");m.textContent="Validating boundaries and project…";try{d.forEach(x=>c.region.boundaries[x.dataset.face].kind=x.value);for(const[x,p]of["x","y","z"].map((f,y)=>[f,y]))c.region.boundaries[x+"_min"].kind!=="bloch"&&c.region.boundaries[x+"_max"].kind!=="bloch"&&(c.region.bloch_phase[p]=0);const _=await e("/validate",c);if(n.project!==l||n.mode!=="layout")throw Error("The project changed. Close this dialog and open it again.");i(_.project),s.close()}catch(_){m.textContent=_.message}finally{u.forEach((_,x)=>_.disabled=h[x])}},s.showModal()}return{open:o}}const Vv={Waves:Kd,FolderOpen:Ud,Save:$d,FileCode2:Id,Box:Td,Cylinder:Ld,Circle:Rd,Orbit:zd,Scan:Wd,Radio:Hd,MoveRight:Od,Activity:wd,Copy:Pd,Trash2:Zd,Maximize:Fd,PencilRuler:Bd,Play:kd,Square:qd,Settings2:jd,Undo2:Jd,Redo2:Gd,GitCommitHorizontal:Nd,CircleDot:Cd,Shapes:Xd,ChartNoAxesCombined:Ad,Terminal:Yd,Download:Dd,RefreshCw:Vd};try{for(const n of Object.keys(localStorage)){if(!n.startsWith("photonweave."))continue;const e="torchfdtd."+n.slice(12);localStorage.getItem(e)===null&&localStorage.setItem(e,localStorage.getItem(n))}}catch{}const xe=n=>document.querySelector(n),ei=n=>[...document.querySelectorAll(n)],ut=n=>String(n).replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e]),ke=n=>`<i data-lucide="${n}"></i>`,U={project:null,selected:"fdtd",mode:"layout",snap:!0,history:[],future:[],job:null,results:null,frame:0,tab:"geometry",bottom:"messages",dirty:!1};let st,yn,hc,Oi,Zt;const Sa=[];xe("#app").innerHTML=`
<header><div class="brand"><span class="brand-mark">${ke("waves")}</span><strong>TorchFDTD</strong><span class="product">Workbench</span></div><div class="project-title" id="project-title"></div><div class="connection" id="connection"><span class="dot"></span>Connecting to solver…</div></header>
<nav class="menubar"><button data-action="new">File</button><button data-action="undo">Edit</button><button data-action="fit">View</button><button data-action="materials">Materials</button><button data-action="region">Simulation</button><button data-action="inverse-design">Inverse design</button><button data-action="capabilities">Feature checklist</button><button data-action="flux-results">Flux results</button><button data-action="help">Help</button><span class="version">DEVELOPMENT</span></nav>
<div class="ribbon-tabs"><button class="active" data-ribbon="design">Design</button><button data-ribbon="simulation">FDTD</button><button data-ribbon="view">View</button><span class="ribbon-note">Geometry and wavelength in µm</span></div>
<div class="ribbon">
 <div class="tool-group"><div class="tool-row"><button class="tool" data-action="open">${ke("folder-open")}<span>Open</span></button><button class="tool" data-action="save">${ke("save")}<span>Save</span></button><button class="tool" data-action="fsp">${ke("folder-open")}<span>FSP inspect</span></button><button class="tool editable" data-action="fsp-native">${ke("folder-open")}<span>FSP → GPU</span></button><button class="tool editable" data-action="gds">${ke("folder-open")}<span>GDS</span></button><button class="tool" data-action="python">${ke("file-code-2")}<span>Python</span></button></div><label>Project</label></div>
 <div class="tool-group"><div class="tool-row"><button class="tool editable" data-add="rectangle">${ke("box")}<span>Rectangle</span></button><button class="tool editable" data-add="circle">${ke("cylinder")}<span>Circle</span></button><button class="tool editable" data-add="ring">${ke("circle")}<span>Ring</span></button><button class="tool editable" data-add="sphere">${ke("orbit")}<span>Sphere</span></button><button class="tool editable" data-add="polygon">${ke("shapes")}<span>Polygon</span></button></div><label>Structures</label></div>
 <div class="tool-group"><div class="tool-row"><button class="tool" data-action="region">${ke("scan")}<span>FDTD region</span></button><button class="tool editable" data-add="point">${ke("radio")}<span>Dipole</span></button><button class="tool editable" data-add="plane">${ke("move-right")}<span>Sheet source</span></button><button class="tool editable" data-add="tfsf">${ke("scan")}<span>TFSF box</span></button><button class="tool editable" data-add="monitor">${ke("activity")}<span>Time monitor</span></button><button class="tool editable" data-add="field">${ke("activity")}<span>DFT / Flux</span></button></div><label>Simulation objects</label></div>
 <div class="tool-group"><div class="tool-row"><button class="tool editable" data-action="duplicate">${ke("copy")}<span>Duplicate</span></button><button class="tool editable" data-action="delete">${ke("trash-2")}<span>Delete</span></button><button class="tool" data-action="fit">${ke("maximize")}<span>Fit view</span></button></div><label>Edit & view</label></div>
 <div class="tool-group run-tools"><div class="tool-row"><button class="tool" id="layout-button" data-action="layout">${ke("pencil-ruler")}<span>Layout</span></button><button class="tool run" id="run-button" data-action="run">${ke("play")}<span>Run</span></button><button class="tool stop" id="stop-button" data-action="stop" disabled>${ke("square")}<span>Stop</span></button></div><label>Run simulation</label></div>
</div>
<main>
 <aside class="left-panel"><div class="panel-heading">Objects Tree <span id="object-count"></span></div><div class="tree-tools"><button data-action="region" title="Edit selected object">${ke("settings-2")}</button><button data-action="undo" title="Undo (Ctrl+Z)">${ke("undo-2")}</button><button data-action="redo" title="Redo (Ctrl+Y)">${ke("redo-2")}</button><label><input type="checkbox" id="snap" checked> Snap</label></div><div id="tree"></div><div class="panel-heading results-heading">Results View</div><div id="results-tree" class="results-tree"><div class="muted empty-hint">Select Run to calculate fields<br>and monitor signals.</div></div><div class="left-footer"><span class="eyebrow">EXAMPLE PROJECTS</span><button data-example="waveguide">${ke("git-commit-horizontal")}SiN waveguide<span>2D</span></button><button data-example="scatterer">${ke("circle-dot")}Cylinder scattering<span>2D</span></button><button data-example="3d">${ke("orbit")}Dielectric sphere<span>3D</span></button><button data-example="pmc">${ke("box")}PMC cavity<span>3D</span></button></div></aside>
 <section class="workspace"><div class="workspace-tabs"><button class="active" data-tab="geometry">${ke("shapes")} Layout editor</button><button data-tab="fields">${ke("chart-no-axes-combined")} Field visualizer</button><span class="mode-badge" id="mode-badge">LAYOUT</span></div><div id="viewports" class="viewports"></div><div id="field-view" hidden><div class="field-tools"><strong id="field-label">Ez · XY plane</strong><span id="frame-label">No data</span><button data-action="playback" title="Animate stored frames">${ke("play")}</button><input type="range" id="frame-slider" min="0" max="0" value="0"><button data-action="download">${ke("download")} NPZ</button></div><canvas id="field-canvas"></canvas><div class="plot-title"><strong>Point monitor</strong><select id="plot-monitor" aria-label="Plot monitor"></select><select id="plot-axis" aria-label="Spectrum axis" hidden><option value="frequency">Frequency</option><option value="wavelength">Wavelength</option></select><button data-plot="time" class="active">Time signal</button><button data-plot="spectrum">Field spectrum</button><button data-action="csv">${ke("download")} CSV</button></div><canvas id="monitor-canvas"></canvas></div>
 <section class="bottom-panel"><div class="bottom-tabs"><button class="active" data-bottom="messages">${ke("terminal")} Simulation log <span id="log-count"></span></button><button data-bottom="python">${ke("file-code-2")} Python script</button><div class="bottom-actions"><button data-action="export-python">Export .py</button></div></div><div id="messages" role="log"></div><textarea id="python-editor" spellcheck="false" readonly hidden aria-label="Generated Python script"></textarea></section></section>
 <aside class="right-panel"><div class="panel-heading">Object properties <span id="property-type"></span></div><div id="properties"></div><div class="mesh-card"><div><span class="eyebrow">SIMULATION SUMMARY</span><button data-action="validate" title="Validate mesh and geometry">${ke("refresh-cw")}</button></div><div id="mesh-summary">Validating project…</div></div></aside>
</main>
<footer><span id="status-text"><span class="dot"></span>Ready</span><span id="footer-grid"></span><div class="progress-track"><div id="progress-bar"></div></div><span id="progress-label"></span><span id="footer-device">Solver connecting</span></footer>
<input id="file-input" type="file" accept=".json,.fsp" hidden><dialog id="dialog"><div id="dialog-content"></div></dialog><div id="toast" role="alert" hidden></div>`;function Us(){Qd({icons:Vv,attrs:{"stroke-width":1.65}})}function At(n,e="info"){Sa.push({text:n,kind:e,time:new Date().toLocaleTimeString("en-GB")}),xe("#messages").innerHTML=Sa.slice(-100).map(t=>`<div class="log ${t.kind}"><time>${t.time}</time><span>${ut(t.text)}</span></div>`).join(""),xe("#messages").scrollTop=xe("#messages").scrollHeight,xe("#log-count").textContent=Sa.length}function Gt(n){xe("#toast").textContent=n,xe("#toast").hidden=!1,setTimeout(()=>xe("#toast").hidden=!0,5e3)}async function yt(n,e){var i;const t=await fetch("/api"+n,e===void 0?{}:{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});if(!t.ok){let s;try{s=await t.json()}catch{throw Error(`Server returned ${t.status}`)}throw Error(Array.isArray(s.detail)?s.detail.map(r=>r.loc.join(".")+": "+r.msg).join(`
`):s.detail||`Server returned ${t.status}`)}return(i=t.headers.get("content-type"))!=null&&i.includes("json")?t.json():t.text()}function xs(){return[...U.project.structures,...U.project.sources,...U.project.monitors].find(n=>n.id===U.selected)}function bo(n){return U.project.structures.some(e=>e.id===n)?"structures":U.project.sources.some(e=>e.id===n)?"sources":"monitors"}function _t(){U.history.push(JSON.stringify(U.project)),U.history.length>80&&U.history.shift(),U.future=[]}function ct(){U.dirty=!0;try{localStorage.setItem("torchfdtd.project.v1",JSON.stringify(U.project))}catch{Gt("Browser storage is full. Use Save to keep this project before closing or reloading."),At("Automatic browser save failed. Export this project with Save to retain the current settings.","warning")}}function $v(n,e,t=!0){Object.assign([...U.project.structures,...U.project.sources,...U.project.monitors].find(i=>i.id===n)||{},e),t&&(ct(),zt(),jt(),it())}function Mn(n){U.selected=n,jt(),zt(),st==null||st.render()}function _n(n){U.mode=n,xe("#mode-badge").textContent=n.toUpperCase(),xe("#mode-badge").className="mode-badge "+n,ei(".editable").forEach(e=>e.disabled=n!=="layout"),xe("#run-button").disabled=n!=="layout",xe("#stop-button").disabled=n!=="running",xe("#layout-button").disabled=n==="running",ei("[data-example]").forEach(e=>e.disabled=n==="running"),zt(),st==null||st.render()}function jt(){const n=U.project;xe("#project-title").textContent=n.name,xe("#object-count").textContent=n.structures.length+n.sources.length+n.monitors.length+1;const e=(t,i,s="")=>`<button class="tree-row ${U.selected===t.id?"selected":""} ${s}" data-select="${ut(t.id)}"><span class="tree-icon">${ke(i)}</span><span>${ut(t.name)}</span>${t.enabled===!1?"<small>off</small>":""}</button>`;xe("#tree").innerHTML=`<div class="tree-root">${ke("folder-open")} model</div>${e({id:"fdtd",name:"FDTD"},"scan","region-row")}<div class="tree-group">Structures <span>${n.structures.length}</span></div>${n.structures.map(t=>e(t,{rectangle:"box",circle:"cylinder",ring:"circle",sphere:"orbit",polygon:"shapes"}[t.kind])).join("")}<div class="tree-group">Sources <span>${n.sources.length}</span></div>${n.sources.map(t=>e(t,"radio","source-row")).join("")}<div class="tree-group">Monitors <span>${n.monitors.length}</span></div>${n.monitors.map(t=>e(t,"activity","monitor-row")).join("")}`,Us()}function Je(n,e,t,i="",s={}){var r;return`<label class="property-row"><span>${n}</span><div><input aria-label="${n}" data-path="${e}" data-scale="${s.scale||1}" ${s.reciprocal?`data-reciprocal="${s.reciprocal}"`:""} type="number" value="${Number(((r=t.toPrecision)==null?void 0:r.call(t,12))??t)}" step="${s.step||"any"}" ${s.min!==void 0?`min="${s.min}"`:""}><small>${i}</small></div></label>`}function Pt(n,e,t,i){return`<label class="property-row"><span>${n}</span><select aria-label="${n}" data-path="${e}">${i.map(s=>{const[r,a]=Array.isArray(s)?s:[s,s];return`<option value="${ut(r)}" ${r===t?"selected":""}>${ut(a)}</option>`}).join("")}</select></label>`}function $t(n,e){return`<section class="property-section"><h3>${n}</h3>${e}</section>`}function zt(){var s,r;if(!U.project)return;const n=U.project,e=xs(),t=n.region;xe("#property-type").textContent=e?e.kind||"monitor":"solver";let i="";if(!e)i=`<div class="object-title">${ke("scan")}<div><strong>FDTD</strong><small>Simulation region</small></div></div>`,i+=$t("General",Pt("dimension","dimension",t.dimension,[["2d","2D (XY)"],["3d","3D"]])+Pt("resource","backend",t.backend,[["auto","GPU if available"],["cuda","GPU · CUDA"],["cpu","CPU"]])+Pt("precision","precision",t.precision,["float32","float64"])+Pt("CUDA kernel","cuda_kernel",t.cuda_kernel||"torch",[["torch","PyTorch reference"],["fused","Fused Yee / CPML (experimental)"]])+Pt("Frequency monitor kernel","cuda_monitor_kernel",t.cuda_monitor_kernel||"torch",[["torch","PyTorch reference"],["fused","Shared CUDA plane DFT (experimental)"]])),i+=$t("Geometry",t.size.map((a,o)=>Je("xyz"[o]+" span","size."+o,a,"µm",{min:.01})).join("")),i+=$t("Mesh settings",gv(t,Je,Pt,ut)),i+=$t("Boundary conditions",Je("PML layers","pml_cells",t.pml_cells,"cells",{step:1,min:3})+["x","y",...t.dimension==="3d"?["z"]:[]].map((a,o)=>["min","max"].map(c=>{const d=a+"_"+c,u=t.boundaries[d];return Pt(a+" "+c+" bc","boundaries."+d+".kind",u.kind,[["pml","PML"],["periodic","Periodic"],["bloch","Bloch"],["pec","PEC"],["antisymmetric","Anti-symmetric (PEC)"],["pmc","PMC"],["symmetric","Symmetric (PMC)"]])+(u.kind==="pml"?`<details class="boundary-options"><summary>${a} ${c} PML settings</summary>${Je(a+" "+c+" layers","boundaries."+d+".layers",u.layers??t.pml_cells,"cells",{step:1,min:3})}<label class="enabled-row"><input type="checkbox" data-boundary-default="${d}" ${u.layers===null?"checked":""}> Use default layers</label>${Je("sigma scale","boundaries."+d+".sigma_scale",u.sigma_scale)}${Je("kappa","boundaries."+d+".kappa",u.kappa)}${Je("alpha","boundaries."+d+".alpha",u.alpha)}${Je("polynomial","boundaries."+d+".polynomial",u.polynomial)}${Je("alpha polynomial","boundaries."+d+".alpha_polynomial",u.alpha_polynomial)}</details>`:"")}).join("")+(t.boundaries[a+"_min"].kind==="bloch"?Je("Bloch phase "+a,"bloch_phase."+o,t.bloch_phase[o],"rad"):"")).join("")+Je("background index","background_index",t.background_index,"",{min:1})+'<button data-action="boundary-editor">Edit six faces together</button><p class="property-help">Cyclic boundaries are paired. Bloch phase is the phase gained over one positive unit-cell translation. PMC and magnetic symmetry support PEC/PMC walls or restricted endpoint CPML with point sources/monitors. Use the six-face editor for the supported CPML profile.</p>'),i+=$t("Simulation time",Je("dt stability factor","courant_factor",t.courant_factor??.99,"",{min:.01})+Je("time steps","steps",t.steps,"",{step:1,min:10})+Je("snapshot every","snapshot_interval",t.snapshot_interval,"steps",{step:1,min:1})),i+=$t("Termination and diagnostics",zv(t,Je)),i+=$t("Field output",Pt("component","field",t.field,["Ex","Ey","Ez","Hx","Hy","Hz"])+Pt("plane normal","slice_axis",t.slice_axis,t.dimension==="2d"?["z"]:["x","y","z"])+Je("plane position","slice_position",t.slice_position,"µm")+Pt("field display","complex_display",t.complex_display,[["real","Real"],["imag","Imaginary"],["magnitude","Magnitude"],["phase","Phase (rad)"]]));else{const a=bo(e.id),o=a==="structures",l=a==="sources";i=`<div class="object-title">${ke(o?"box":l?"radio":"activity")}<div><strong>${ut(e.name)}</strong><small>${o?e.kind:l?e.kind+" source":e.kind==="field"?"Frequency / flux monitor":"Point time monitor"}</small></div></div><label class="property-row name-row"><span>name</span><input aria-label="name" data-path="name" value="${ut(e.name)}"></label><label class="enabled-row"><input type="checkbox" data-path="enabled" ${e.enabled?"checked":""}> Enabled in simulation</label>`;const c=e.kind==="field"?[0,1,2].filter(d=>d!=="xyz".indexOf(e.normal)&&(t.dimension==="3d"||d<2)):e.kind==="tfsf"?[0,1,2].filter(d=>t.dimension==="3d"||d<2):e.kind==="rectangle"||e.kind==="plane"?[0,1,2]:["circle","ring","polygon"].includes(e.kind)?[2]:[];if(i+=$t("Geometry",e.center.map((d,u)=>Je("xyz"[u],"center."+u,d,"µm")).join("")+c.map(d=>Je("xyz"[d]+" span","size."+d,e.size[d],"µm",{min:o?.001:0})).join("")+(["circle","sphere","ring"].includes(e.kind)?Je("radius","radius",e.radius,"µm",{min:.001}):"")+(e.kind==="ring"?Je("inner radius","inner_radius",e.inner_radius,"µm",{min:0}):"")+(o?Mv(e,Je):"")),o&&(i+=$t("Material",Pt("material","material",e.material,n.materials.map(d=>d.name))+`<div class="static-row">refractive index <b>${(((s=n.materials.find(d=>d.name===e.material))==null?void 0:s.model)||"dielectric")==="dielectric"?(r=n.materials.find(d=>d.name===e.material))==null?void 0:r.index:"dispersive"}</b></div>`+Je("mesh order","mesh_order",e.mesh_order,"",{step:1,min:1})+'<p class="property-help">Lower order takes priority in overlaps. Open Materials to edit dielectric, Drude or Lorentz parameters and inspect n/k.</p>'),i+=$t("Rotation",Sv(e,Je,Pt))),o){const d=n.structures.findIndex(u=>u.id===e.id);i+=$t("Structure order",`<button data-action="structure-earlier" ${d===0?"disabled":""}>Move earlier in tree</button><button data-action="structure-later" ${d===n.structures.length-1?"disabled":""}>Move later in tree</button><p class="property-help">When mesh orders are equal, the later structure takes priority in overlaps.</p>`)}if(l){e.time_definition??(e.time_definition="cycles"),e.pulse_length??(e.pulse_length=2e-14),e.pulse_offset??(e.pulse_offset=5e-14),e.phase??(e.phase=0);const d=e.use_global_source?n.global_source:e;i+=$t("Source settings",Lv(e,t,Je,Pt)+Pv(e,Je,Pt)+`<label class="enabled-row"><input type="checkbox" data-path="use_global_source" ${e.use_global_source?"checked":""} ${n.global_source?"":"disabled"}> Use global source settings</label><button data-action="global-source">Edit global source settings</button>${n.global_source?"":'<p class="property-help">Imported global settings are unavailable. Configure them before enabling inheritance.</p>'}`+(d?`<fieldset ${e.use_global_source?"disabled":""}>`+dd(d,Je,Pt)+'<button data-action="source-signal">Load / edit time signal</button></fieldset>':"")+Je("phase","phase",e.phase,"deg")+Je("amplitude","amplitude",e.amplitude,"",{min:.001})+`<button data-action="source-preview">Preview time signal / spectrum</button><p class="property-help">${e.kind==="tfsf"?"Closed box with six-face E/H corrections and a live incident Yee line. Source preview shows the incident field at the entry face.":e.injection==="oneway"?"Normal-incidence discrete E/H plane with an eight-cell incident-line delay. Amplitude scales the incident-line soft drive. Source preview includes both corrections.":e.kind==="plane"?"Bidirectional E/H sheet. Bloch axes apply the unit-cell phase across the sheet.":"Reduced electric or magnetic point excitation. Magnetic sources use the H half-step time. Vector orientation may excite both 2D polarizations."}</p>`)}if(!o&&!l){e.spectrum??(e.spectrum={sampling:"fft",wavelength_start:1.3,wavelength_stop:1.8,frequency_points:101,apodization:"hann",apodization_center:2e-14,apodization_time_width:1e-14});const d=e.use_global_monitor?n.global_monitor:e.spectrum,u=e.use_global_monitor&&e.inherit_apodization!==!1,h=u?d:e.spectrum;i+=$t("Monitor settings",(e.kind==="field"?kv(e,t,Je,Pt):Pt("component","component",e.component,["Ex","Ey","Ez","Hx","Hy","Hz"])+'<p class="property-help">Records one Yee field component at every time step. DFT downsampling affects spectral processing only.</p>')+Je("DFT time downsample","time_downsample",e.time_downsample||1,"",{min:1,step:1})+`<label class="enabled-row"><input type="checkbox" data-path="use_global_monitor" ${e.use_global_monitor?"checked":""}> Use global monitor settings</label>${e.use_global_monitor?`<label class="enabled-row"><input type="checkbox" data-path="inherit_apodization" ${u?"checked":""}> Inherit global apodization</label>`:""}<button data-action="global-monitor">Edit global monitor settings</button>`),i+=$t("Frequency / wavelength",`<fieldset ${e.use_global_monitor?"disabled":""}>`+ud(d,Je,Pt,{plane:e.kind==="field"})+'</fieldset><p class="property-help">DFT values are unnormalized field integrals. Power ratios require a matching air reference.</p>'),i+=$t("Apodization",`<fieldset ${u?"disabled":""}>`+Pt("apodization","spectrum.apodization",h.apodization,[["none","None"],["start","Start"],["end","End"],["full","Full"],...e.kind==="field"?[]:[["hann","Hann (legacy FFT)"]]])+(["start","end","full"].includes(h.apodization)?Je("apodization center","spectrum.apodization_center",h.apodization_center*1e15,"fs",{min:0,scale:1e-15})+Je("apodization time width","spectrum.apodization_time_width",h.apodization_time_width*1e15,"fs",{min:.001,scale:1e-15})+'<p class="property-help">Width is the intensity FWHM of the Gaussian window. Apodized spectra are not normalized transmission or absolute intensity.</p>':"")+"</fieldset>")}}xe("#properties").innerHTML=`<fieldset ${U.mode!=="layout"?"disabled":""}>${i}</fieldset>`,Us(),Wv(),xe("#properties").querySelectorAll("[data-path]").forEach(a=>a.addEventListener("change",()=>{var u;if(U.mode!=="layout")return;_t();const o=xs()||n.region,l=a.dataset.path.split(".");l[0]==="downsample_xyz"&&!o.downsample_xyz&&(o.downsample_xyz=[o.downsample||1,o.downsample||1,o.downsample||1]);let c=o;for(const h of l.slice(0,-1))c=c[h];const d=a.type==="checkbox"?a.checked:a.type==="number"?a.dataset.reciprocal?Number(a.dataset.reciprocal)/Number(a.value):Number(a.value)*Number(a.dataset.scale||1):a.value;if(l.length===1&&n.sources.includes(o)?cd(o,l[0],d):c[l.at(-1)]=d,o===t&&l[0]==="mesh_type"&&d==="graded"&&(t.material_sampling="yee",t.mesh_max=Math.max(t.mesh_max,t.mesh)),o===t&&l[0]==="interface_method"&&d==="subpixel"&&(t.material_sampling="yee"),o===t&&l[0]==="mesh_type"&&d!=="explicit"&&(t.mesh_coordinates=null),n.sources.includes(o)&&["injection","normal"].includes(l[0])&&dc(o,t,{boundaries:!0}),o.kind==="field"&&l[0]==="normal"){const h=o.size.indexOf(0),m="xyz".indexOf(d);h!==m&&(o.size[h]=Math.min(1,t.size[h]/2),o.size[m]=0)}if(l.join(".")==="spectrum.sampling"&&d==="custom"&&!((u=o.spectrum.custom_frequencies_hz)!=null&&u.length)&&(o.spectrum.custom_frequencies_hz=[2e14]),l.join(".")==="spectrum.sampling"&&a.value!=="fft"&&o.spectrum.apodization==="hann"&&(o.spectrum.apodization="none"),l.join(".")==="spectrum.sampling"&&d==="fft"&&(o.spectrum.use_source_limits=!1),o===t&&l[0]==="boundaries"&&l[2]==="kind"){const[h,m]=l[1].split("_"),_=a.value,x=h+"_"+(m==="min"?"max":"min");(["periodic","bloch"].includes(_)||["periodic","bloch"].includes(t.boundaries[x].kind))&&(t.boundaries[x].kind=_),_!=="bloch"&&(t.bloch_phase["xyz".indexOf(h)]=0)}o===t&&l[0]==="dimension"&&t.dimension==="2d"&&(t.slice_axis="z",t.slice_position=0,t.bloch_phase[2]=0,t.boundaries.z_min.kind="pml",t.boundaries.z_max.kind="pml",n.sources.forEach(h=>h.center[2]=0),n.monitors.forEach(h=>{h.center[2]=0,h.kind==="field"&&h.normal==="z"&&(h.normal="x",h.size[0]=0,h.size[2]=1)})),o===t&&l[0]==="dimension"&&t.mesh_type==="explicit"&&(t.mesh_type="uniform",t.mesh_coordinates=null),o===t&&["size","mesh","dimension"].includes(l[0])&&n.sources.forEach(h=>dc(h,t)),ct(),jt(),st.render(),zt(),it()})),xe("#properties").querySelectorAll("[data-record-family]").forEach(a=>a.onchange=()=>{if(U.mode!=="layout")return;_t();const o=a.dataset.recordFamily,l=o==="record_fields"?["Ex","Ey","Ez","Hx","Hy","Hz"]:["x","y","z"],c=new Set(e[o]??l);a.checked?c.add(a.value):c.delete(a.value),e[o]=l.filter(d=>c.has(d)),ct(),zt(),it()}),xe("#properties").querySelectorAll("[data-source-vector]").forEach(a=>a.onchange=()=>{U.mode==="layout"&&(_t(),e.theta=a.checked?e.component[1]==="z"?0:90:null,e.phi=e.component[1]==="y"?90:0,ct(),zt(),st.render(),it())}),xe("#properties").querySelectorAll("[data-source-family]").forEach(a=>a.onchange=()=>{U.mode==="layout"&&(_t(),e.component=a.value+e.component[1],ct(),zt(),st.render(),it())}),xe("#properties").querySelectorAll("[data-frequency-table]").forEach(a=>a.onchange=()=>{U.mode==="layout"&&(_t(),e.spectrum.custom_frequencies_hz=a.value.trim().split(/[\s,;]+/).filter(Boolean).map(o=>Number(o)*1e12),ct(),it())}),xe("#properties").querySelectorAll("[data-run-field-limit]").forEach(a=>a.onchange=()=>{U.mode==="layout"&&(_t(),t.run_control.field_limit=a.checked?1e6:null,ct(),zt(),it())}),xe("#properties").querySelectorAll("[data-axis-steps]").forEach(a=>a.onchange=()=>{U.mode==="layout"&&(_t(),t.mesh_steps=a.checked?[t.mesh,t.mesh,t.mesh]:null,a.checked&&(t.material_sampling="yee"),ct(),zt(),st.render(),it())}),xe("#properties").querySelectorAll("[data-fixed-dt]").forEach(a=>a.onchange=()=>{U.mode==="layout"&&(_t(),t.time_step_override=a.checked?((Zt==null?void 0:Zt.dt_fs)??.01)*5e-16:null,ct(),zt(),it())})}function Wv(){ei("[data-boundary-default]").forEach(n=>n.onchange=()=>{if(U.mode!=="layout")return;_t();const e=U.project.region;e.boundaries[n.dataset.boundaryDefault].layers=n.checked?null:e.pml_cells,ct(),zt(),st.render(),it()})}async function it(){try{return Zt=await yt("/validate",U.project),xe("#mesh-summary").innerHTML=`<strong>${Zt.shape.join(" × ")}</strong><span>${Zt.cells.toLocaleString()} cells · ~${Number(Zt.estimated_memory_mb).toFixed(1)} MB</span>${Zt.mesh_type==="graded"?`<span>${Zt.cell_reduction_percent.toFixed(1)}% fewer cells than uniform</span>`:""}<span>Δt ${Zt.dt_fs.toFixed(4)} fs · ${Zt.duration_fs.toFixed(1)} fs total</span>${Zt.warnings.map(n=>`<p class="warning">${ut(n)}</p>`).join("")}`,xe("#footer-grid").textContent=Zt.shape.join(" × ")+" cells",!0}catch(n){return xe("#mesh-summary").innerHTML=`<p class="warning error">${ut(n.message)}</p>`,!1}}function jv(n){var s;if(U.mode!=="layout"||!U.project||!st)return;_t();const e=crypto.randomUUID(),t={id:e,name:n+"_"+(U.project.structures.length+U.project.sources.length+U.project.monitors.length+1),center:[0,0,0],enabled:!0};if(["rectangle","circle","ring","sphere","polygon"].includes(n))U.project.structures.push(Nr({...t,kind:n,size:[1,1,.5],radius:.5,inner_radius:.3,rotation:0,material:((s=U.project.materials.find(r=>r.name.startsWith("SiN")))==null?void 0:s.name)||U.project.materials[0].name,mesh_order:2}));else if(n==="field")U.project.monitors.push({...t,kind:"field",component:"Ez",normal:"x",size:[0,Math.min(1,U.project.region.size[1]/3),U.project.import_provenance&&U.project.region.dimension==="2d"?1:Math.min(1,U.project.region.size[2]/3)],downsample:1,use_global_monitor:!1,spectrum:{sampling:"frequency",wavelength_start:1.3,wavelength_stop:1.8,frequency_points:41,apodization:"none",apodization_center:2e-14,apodization_time_width:1e-14}});else if(n==="monitor")U.project.monitors.push({...t,component:"Ez",...U.project.import_provenance?{spectrum:{sampling:"fft",apodization:"none"}}:{}});else if(n==="tfsf"){const r=U.project.region,a=r.dimension==="2d"?2:3,o=r.size.map((l,c)=>c>=a?0:Math.max(3*r.mesh,Math.min(2,l-2*(Math.max(r.boundaries["xyz"[c]+"_min"].layers??r.pml_cells,r.boundaries["xyz"[c]+"_max"].layers??r.pml_cells)+3)*r.mesh)));U.project.sources.push({...t,kind:n,injection:"oneway",normal:"x",direction:"+",size:o,component:"Ez",wavelength:1.55,amplitude:1,pulse:"gaussian",pulse_cycles:3,incident_pml_cells:96})}else U.project.sources.push({...t,kind:n,size:[0,1,0],component:"Ez",wavelength:1.55,amplitude:1,pulse:"gaussian",pulse_cycles:3});const i=U.project.sources.find(r=>r.id===e);i&&U.project.import_provenance&&Object.assign(i,{time_definition:"standard",pulse_length:2e-14,pulse_offset:5e-14}),ct(),Mn(e),it(),At("Added "+t.name+". Drag in a viewport or edit its properties.")}function fc(n,e,t="application/json"){const i=URL.createObjectURL(new Blob([n],{type:t})),s=document.createElement("a");s.href=i,s.download=e,s.click(),setTimeout(()=>URL.revokeObjectURL(i),1e3)}function Bn(n){U.tab=n,ei("[data-tab]").forEach(e=>e.classList.toggle("active",e.dataset.tab===n)),xe("#viewports").hidden=n!=="geometry",xe("#field-view").hidden=n!=="fields",n==="geometry"?st.render():kn()}function hd(n){U.bottom=n,ei("[data-bottom]").forEach(e=>e.classList.toggle("active",e.dataset.bottom===n)),xe("#messages").hidden=n!=="messages",xe("#python-editor").hidden=n!=="python",n==="python"&&yt("/python",U.project).then(e=>xe("#python-editor").value=e).catch(e=>Gt(e.message))}function kn(){var a,o,l;const n=U.project.region,e="xyz".indexOf(n.slice_axis),t=(((o=(a=U.results)==null?void 0:a.summary)==null?void 0:o.actual_size_um)||n.size).filter((c,d)=>d!==e),i=U.results,s=(i==null?void 0:i.frames[U.frame])||U.liveFrame;xe("#field-label").textContent=n.field+" · "+n.complex_display+" · "+["YZ","XZ","XY"][e]+" plane",xe("#frame-label").textContent=i?"Step "+i.frame_steps[U.frame]:"Live field",xe("#frame-slider").max=Math.max(0,((i==null?void 0:i.frames.length)||1)-1),xe("#frame-slider").value=U.frame;const r=U.monitors||[];r.some(c=>c.id===U.plotMonitor)||(U.plotMonitor=(l=r[0])==null?void 0:l.id),xe("#plot-monitor").innerHTML=r.map(c=>`<option value="${ut(c.id)}" ${c.id===U.plotMonitor?"selected":""}>${ut(c.name)} · ${c.component}</option>`).join(""),xe("#plot-axis").hidden=!U.spectrum,Tv(xe("#field-canvas"),s,t,n.field+" "+n.complex_display,n.complex_display==="phase"?Math.PI:i==null?void 0:i.max,n.complex_display==="phase"?"rad":"reduced field"),Is(xe("#monitor-canvas"),r.filter(c=>c.id===U.plotMonitor),U.spectrum,xe("#plot-axis").value==="wavelength")}async function Xv(){if(U.mode==="layout"){if(!await it()){Gt("Fix the highlighted project settings before running.");return}try{U.results=null,U.monitors=null,U.liveFrame=null;const n=await yt("/jobs",U.project);U.job=n.id,localStorage.setItem("torchfdtd.activeJob",n.id),_n("running"),Bn("fields"),At("Submitted "+U.project.name+" · "+U.project.region.backend+" · "+U.project.region.precision),Zt.warnings.forEach(e=>At(e,"warning")),Rr()}catch(n){At(n.message,"error"),Gt(n.message)}}}async function Rr(){try{const n=await yt("/jobs/"+U.job),e=n.progress,t=Math.round(100*e.step/e.total);if(xe("#progress-bar").style.width=t+"%",xe("#progress-label").textContent=t+"%",xe("#status-text").textContent=n.status==="queued"?"Queued on solver":n.status==="running"?"Calculating fields…":n.status,U.liveFrame=e.frame,U.tab==="fields"&&kn(),["completed","cancelled","failed"].includes(n.status)){if(n.status==="failed"){localStorage.removeItem("torchfdtd.activeJob"),_n("analysis"),At(n.error,"error"),Gt(n.error);return}xe("#status-text").textContent="Calculation complete · loading field results…";const i=await yt("/jobs/"+U.job+"/fields");let s=1e-20;i.frames.forEach(r=>r.forEach(a=>a.forEach(o=>s=Math.max(s,Math.abs(o))))),i.max=s,U.results=i,U.frame=Math.max(0,i.frames.length-1),U.monitors=n.monitors,localStorage.removeItem("torchfdtd.activeJob"),_n("analysis"),xe("#status-text").textContent=n.status,xe("#results-tree").innerHTML=`<button data-tab="fields">${ke("chart-no-axes-combined")} ${ut(U.project.region.field)} field snapshots</button>${n.monitors.map(r=>`<button data-tab="fields">${ke("activity")} ${ut(r.name)} · ${r.component}</button>`).join("")}<div class="run-summary"><b>${n.summary.seconds.toFixed(2)} s</b> solver loop<br>${n.summary.backend.toUpperCase()}${n.summary.cuda_graph?" · CUDA graph":""}${n.summary.cuda_kernel==="fused"?" · fused Yee / CPML":""}${n.summary.cuda_monitor_kernel==="fused"?" · shared plane DFT":""}<br>${n.summary.mcells_per_second.toFixed(1)} Mcells/s<br>${n.summary.gpu?ut(n.summary.gpu):"CPU"}<br>${n.summary.auto_shutoff?"Decay threshold reached":n.summary.cancelled?"Cancelled":"Step limit reached"}<br>${n.summary.steps} / ${n.summary.requested_steps??n.summary.steps} steps</div>`,Us(),kn(),At(`${n.status}: ${n.summary.steps} steps in ${n.summary.seconds.toFixed(3)} s, ${n.summary.mcells_per_second.toFixed(1)} Mcells/s. Setup ${n.summary.setup_seconds.toFixed(2)} s.`),n.summary.warnings.forEach(r=>At(r,"warning"));return}hc=setTimeout(Rr,400)}catch(n){At("Connection lost: "+n.message+". Retrying the same job…","warning"),hc=setTimeout(Rr,2e3)}}function pc(n){xe("#dialog-content").innerHTML=n+'<div class="dialog-actions"><button data-close>Close</button></div>',xe("#dialog").showModal(),Us()}function mc(){Zv.open()}const fd=Av({esc:ut,toast:Gt,log:At}),qv=Cv({esc:ut,toast:Gt,log:At,getProject:()=>U.project,loadProject:async n=>{if(U.mode==="running")throw Error("Wait for the active simulation to finish before opening a scene.");const e=await yt("/validate",n);_t(),U.project=e.project,U.selected="fdtd",U.results=null,U.monitors=null,U.liveFrame=null,U.job=null,xe("#results-tree").innerHTML='<div class="muted empty-hint">Run to calculate the imported scene.</div>',ct(),_n("layout"),Bn("geometry"),jt(),st.fit(),await it(),At("Opened independently converted FSP scene. Conversion differences are retained with the project.")}}),Yv=Rv({esc:ut,toast:Gt,log:At,getProject:()=>U.project,loadProject:async n=>{if(U.mode!=="layout")throw Error("Switch to Layout before importing geometry.");const e=await yt("/validate",n);_t(),U.project=e.project,U.selected="fdtd",U.results=null,U.monitors=null,U.liveFrame=null,U.job=null,xe("#results-tree").innerHTML='<div class="muted empty-hint">Run to calculate the imported scene.</div>',ct(),_n("layout"),Bn("geometry"),jt(),st.fit(),await it()}}),Zv=Nv({state:U,api:yt,esc:ut,toast:Gt,commit:n=>{if(U.mode!=="layout")throw Error("Switch to Layout before editing.");_t(),U.project=n,ct(),zt(),jt(),st.render(),it()}}),ds=_v({state:U,api:yt,esc:ut,commit:n=>{if(U.mode!=="layout")throw Error("Switch to Layout before editing.");_t(),U.project=n,ct(),zt(),st.render(),it()}}),Ea=Iv({state:U,api:yt,esc:ut,toast:Gt,commit:n=>{if(U.mode!=="layout")throw Error("Switch to Layout before editing.");_t(),U.project=n,ct(),zt(),jt(),st.render(),it()}}),Jv=Ev({state:U,api:yt,esc:ut,commit:n=>{if(U.mode!=="layout")throw Error("Switch to Layout before editing.");_t(),U.project=n,ct(),zt(),jt(),st.render(),it()}}),Kv=Fv({api:yt,esc:ut}),Qv=Ov({esc:ut}),gc=Hv({state:U,api:yt,esc:ut,toast:Gt,numeric:Je,dropdown:Pt,commit:n=>{if(U.mode!=="layout")throw Error("Switch to Layout before editing.");_t(),U.project=n,ct(),zt(),jt(),st.render(),it()}}),e0=Gv({state:U,api:yt,esc:ut,commit:n=>{if(U.mode!=="layout")throw Error("Switch to Layout before editing.");_t(),U.project=n,ct(),zt(),jt(),st.render(),it()}}),ys={"boundary-editor":()=>e0.open(),gds:()=>{U.mode==="layout"&&Yv.open()},"geometry-vertices":()=>Jv.open(U.selected),capabilities:()=>Kv.open(),"inverse-design":()=>Qv.open(),"global-monitor":()=>gc.globals(),"flux-results":()=>gc.flux(),"mesh-preview":()=>ds.open(),"mesh-freeze":()=>ds.freeze(),"mesh-nodes":()=>ds.editNodes(),"mesh-add":()=>ds.add(),"mesh-remove":n=>ds.remove(Number(n.dataset.index)),"global-source":()=>Ea.globals(),"source-signal":()=>Ea.signal(U.selected),"source-preview":()=>Ea.preview(U.selected),fsp:()=>fd.open(),"fsp-native":()=>{U.mode==="layout"&&qv.open()},new:()=>{U.mode!=="running"&&pc('<h2>Project files</h2><p>Save your current project before opening another design.</p><div class="dialog-buttons"><button data-action="save">Save current project</button><button data-action="open">Open project (.json)</button><button data-action="blank">New empty project</button></div>')},blank:async()=>{if(U.mode==="running")return;_t();const n=await yt("/examples/waveguide");n.name="Untitled",n.structures=[],n.sources=[],n.monitors=[],U.project=n,U.selected="fdtd",U.results=null,U.monitors=null,U.liveFrame=null,ct(),_n("layout"),Bn("geometry"),jt(),it(),xe("#dialog").close()},save:()=>{fc(JSON.stringify(U.project,null,2),U.project.name.replace(/[^a-z0-9]/gi,"_")+".json"),U.dirty=!1,At("Project saved as JSON. Load the same file from Python with Project.load().")},open:()=>{U.mode!=="running"&&xe("#file-input").click()},region:()=>Mn("fdtd"),fit:()=>st.fit(),materials:mc,undo:()=>{U.mode!=="layout"||!U.history.length||(U.future.push(JSON.stringify(U.project)),U.project=JSON.parse(U.history.pop()),ct(),Mn("fdtd"),it())},redo:()=>{U.mode!=="layout"||!U.future.length||(U.history.push(JSON.stringify(U.project)),U.project=JSON.parse(U.future.pop()),ct(),Mn("fdtd"),it())},delete:()=>{if(U.mode!=="layout"||!xs())return;_t();const n=bo(U.selected);U.project[n]=U.project[n].filter(e=>e.id!==U.selected),ct(),Mn("fdtd"),it()},duplicate:()=>{if(U.mode!=="layout"||!xs())return;_t();const n=structuredClone(xs());n.id=crypto.randomUUID(),n.name+="_copy",n.center[0]+=.2,U.project[bo(U.selected)].push(n),ct(),Mn(n.id),it()},"structure-earlier":()=>_c(-1),"structure-later":()=>_c(1),layout:()=>{U.mode!=="running"&&(U.results=null,U.liveFrame=null,U.monitors=null,U.job=null,xe("#results-tree").innerHTML='<div class="muted empty-hint">Run again to calculate this layout.</div>',_n("layout"),Bn("geometry"),At("Layout mode. Prior result downloads remain on the solver; the current visualizer was cleared."))},run:Xv,stop:async()=>{U.job&&(await yt("/jobs/"+U.job+"/cancel",{}),At("Stop requested. Waiting for the current time step to finish."))},validate:it,python:()=>hd("python"),"export-python":async()=>{fc(await yt("/python",U.project),"simulation.py","text/x-python")},download:()=>{U.results?window.location.href="/api/jobs/"+U.job+"/download":Gt("Run the simulation first.")},csv:()=>{U.results?window.location.href="/api/jobs/"+U.job+(U.spectrum?"/spectra.csv":"/monitors.csv"):Gt("Run the simulation first.")},playback:()=>{var n;if(Oi){clearInterval(Oi),Oi=null;return}(n=U.results)!=null&&n.frames.length&&(Oi=setInterval(()=>{if(!U.results){clearInterval(Oi),Oi=null;return}U.frame=(U.frame+1)%U.results.frames.length,kn()},80))},"add-material":()=>{_t(),U.project.materials.push({name:"Custom dielectric "+U.project.materials.length,index:1.5,color:"#60bdaa"}),ct(),xe("#dialog").close(),mc()},help:()=>pc("<h2>From Lumerical to TorchFDTD</h2><p>The workbench follows the familiar Objects Tree, CAD views, FDTD region and Layout / Analysis workflow.</p><ol><li>Add a Rectangle, Circle, Ring or Sphere from the Design ribbon.</li><li>Select an object in the tree or any viewport. Drag to move. Edit x, y, z, spans, material and mesh order in Object properties.</li><li>Select FDTD to set dimension, mesh, PML and simulation time steps.</li><li>Add a dipole or bidirectional sheet source and point time monitors.</li><li>Run on the connected solver. Inspect field snapshots, time traces and field spectra.</li><li>Switch to Layout to edit, or export JSON, Python and NPZ results.</li></ol><p><b>Shortcuts:</b> Ctrl+S save · Ctrl+O open · Ctrl+D duplicate · Delete remove · Ctrl+Z undo · Ctrl+Y redo · F fit.</p><p>This is an independent open-source workbench. The FSP inspector reads and edits .fsp settings through an installed, licensed Lumerical API. FSP → GPU independently imports a verified subset of layout settings and displays unsupported settings and numerical differences. Arbitrary FSP execution and .lsf execution remain unimplemented. See Feature checklist for the supported physics and execution modes. PMC cavities currently use point electric sources and point monitors. General material, port and boundary combinations remain under development.</p>")};function _c(n){if(U.mode!=="layout")return;const e=U.project.structures,t=e.findIndex(s=>s.id===U.selected),i=t+n;t<0||i<0||i>=e.length||(_t(),[e[t],e[i]]=[e[i],e[t]],ct(),Mn(U.selected),it())}document.addEventListener("click",async n=>{var t;const e=n.target.closest("button");if(!(!e||e.disabled||!U.project||!st))try{if(e.dataset.action&&await((t=ys[e.dataset.action])==null?void 0:t.call(ys,e)),e.dataset.add&&jv(e.dataset.add),e.dataset.select&&Mn(e.dataset.select),e.dataset.tab&&Bn(e.dataset.tab),e.dataset.bottom&&hd(e.dataset.bottom),e.dataset.plot&&(U.spectrum=e.dataset.plot==="spectrum",ei("[data-plot]").forEach(i=>i.classList.toggle("active",i===e)),kn()),e.dataset.example){if(U.mode==="running")return;_t(),U.project=await yt("/examples/"+e.dataset.example),U.results=null,U.monitors=null,U.liveFrame=null,U.selected="fdtd",ct(),_n("layout"),Bn("geometry"),jt(),st.fit(),it(),At("Opened example: "+U.project.name)}e.dataset.ribbon&&(ei("[data-ribbon]").forEach(i=>i.classList.toggle("active",i===e)),e.dataset.ribbon==="simulation"&&Mn("fdtd"),e.dataset.ribbon==="view"&&st.fit()),e.hasAttribute("data-close")&&xe("#dialog").close()}catch(i){Gt(i.message),At(i.message,"error")}});xe("#file-input").onchange=async n=>{const e=n.target.files[0];if(e){if(e.name.toLowerCase().endsWith(".fsp")){n.target.value="",xe("#dialog").close(),await fd.openFile(e);return}try{const t=JSON.parse(await e.text()),i=await yt("/validate",t);_t(),U.project=i.project,U.selected="fdtd",U.results=null,U.monitors=null,U.liveFrame=null,ct(),_n("layout"),Bn("geometry"),jt(),st.fit(),it(),xe("#dialog").close(),At("Opened "+e.name)}catch(t){Gt(t.message)}n.target.value=""}};xe("#snap").onchange=n=>U.snap=n.target.checked;xe("#frame-slider").oninput=n=>{U.frame=Number(n.target.value),kn()};document.addEventListener("keydown",n=>{if(!U.project||!st||document.querySelector("dialog[open]")||["INPUT","TEXTAREA","SELECT"].includes(document.activeElement.tagName))return;const e=n.key.toLowerCase();n.ctrlKey&&["s","o","d","z","y"].includes(e)?(n.preventDefault(),ys[{s:"save",o:"open",d:"duplicate",z:"undo",y:"redo"}[e]]()):n.key==="Delete"?ys.delete():e==="f"&&st.fit()});xe("#plot-monitor").onchange=n=>{U.plotMonitor=n.target.value,kn()};xe("#plot-axis").onchange=()=>kn();window.addEventListener("resize",()=>{U.tab==="fields"&&kn()});async function t0(){try{yn=await yt("/health"),xe(".version").textContent="DEVELOPMENT"+(yn.version?" · "+yn.version:""),xe("#connection").innerHTML=`<span class="dot"></span>${yn.cuda?ut(yn.gpu):"CPU solver"} <small>${ut(yn.hostname)}</small>`,xe("#footer-device").textContent=yn.cuda?"CUDA · "+yn.gpu_memory_gb+" GB":"CPU";const n=localStorage.getItem("torchfdtd.project.v1");try{U.project=n?(await yt("/validate",JSON.parse(n))).project:await yt("/examples/waveguide")}catch{U.project=await yt("/examples/waveguide")}st=new wv(xe("#viewports"),U,Mn,$v,_t),jt(),_n("layout"),st.fit(),await it(),At("Connected to "+yn.hostname+" · "+yn.engine+"."),At("Select an object to edit. Add structures, configure FDTD and Run. Python and JSON use the same project model.");const e=localStorage.getItem("torchfdtd.activeJob");if(e)try{const t=await yt("/jobs/"+e);U.project=t.project,U.job=e,_n("running"),jt(),Bn("fields"),Rr()}catch{localStorage.removeItem("torchfdtd.activeJob")}}catch(n){xe("#connection").textContent="Solver unavailable",At(n.message,"error"),Gt("Cannot connect to the solver. Start torchfdtd serve and reload.")}Us()}ei(".editable").forEach(n=>n.disabled=!0);xe("#run-button").disabled=!0;t0();
