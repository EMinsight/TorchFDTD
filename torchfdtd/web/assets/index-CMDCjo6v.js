(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Sc=(n,e,t=[])=>{const i=document.createElementNS("http://www.w3.org/2000/svg",n);return Object.keys(e).forEach(s=>{i.setAttribute(s,String(e[s]))}),t.length&&t.forEach(s=>{const r=Sc(...s);i.appendChild(r)}),i};var Td=([n,e,t])=>Sc(n,e,t);/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ad=n=>Array.from(n.attributes).reduce((e,t)=>(e[t.name]=t.value,e),{}),Cd=n=>typeof n=="string"?n:!n||!n.class?"":n.class&&typeof n.class=="string"?n.class.split(" "):n.class&&Array.isArray(n.class)?n.class:"",Rd=n=>n.flatMap(Cd).map(t=>t.trim()).filter(Boolean).filter((t,i,s)=>s.indexOf(t)===i).join(" "),Pd=n=>n.replace(/(\w)(\w*)(_|-|\s*)/g,(e,t,i)=>t.toUpperCase()+i.toLowerCase()),Yo=(n,{nameAttr:e,icons:t,attrs:i})=>{var _;const s=n.getAttribute(e);if(s==null)return;const r=Pd(s),a=t[r];if(!a)return console.warn(`${n.outerHTML} icon name was not found in the provided icons object.`);const o=Ad(n),[l,c,d]=a,u={...c,"data-lucide":s,...i,...o},h=Rd(["lucide",`lucide-${s}`,o,i]);h&&Object.assign(u,{class:h});const m=Td([l,u,d]);return(_=n.parentNode)==null?void 0:_.replaceChild(m,n)};/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ht={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"};/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ld=["svg",ht,[["path",{d:"M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Dd=["svg",ht,[["path",{d:"M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"}],["path",{d:"m3.3 7 8.7 5 8.7-5"}],["path",{d:"M12 22V12"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Id=["svg",ht,[["path",{d:"M12 16v5"}],["path",{d:"M16 14v7"}],["path",{d:"M20 10v11"}],["path",{d:"m22 3-8.646 8.646a.5.5 0 0 1-.708 0L9.354 8.354a.5.5 0 0 0-.707 0L2 15"}],["path",{d:"M4 18v3"}],["path",{d:"M8 14v7"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ud=["svg",ht,[["circle",{cx:"12",cy:"12",r:"10"}],["circle",{cx:"12",cy:"12",r:"1"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Nd=["svg",ht,[["circle",{cx:"12",cy:"12",r:"10"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fd=["svg",ht,[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Od=["svg",ht,[["ellipse",{cx:"12",cy:"5",rx:"9",ry:"3"}],["path",{d:"M3 5v14a9 3 0 0 0 18 0V5"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zd=["svg",ht,[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}],["polyline",{points:"7 10 12 15 17 10"}],["line",{x1:"12",x2:"12",y1:"15",y2:"3"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const kd=["svg",ht,[["path",{d:"M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4"}],["path",{d:"m5 12-3 3 3 3"}],["path",{d:"m9 18 3-3-3-3"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Bd=["svg",ht,[["path",{d:"m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Hd=["svg",ht,[["circle",{cx:"12",cy:"12",r:"3"}],["line",{x1:"3",x2:"9",y1:"12",y2:"12"}],["line",{x1:"15",x2:"21",y1:"12",y2:"12"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gd=["svg",ht,[["path",{d:"M8 3H5a2 2 0 0 0-2 2v3"}],["path",{d:"M21 8V5a2 2 0 0 0-2-2h-3"}],["path",{d:"M3 16v3a2 2 0 0 0 2 2h3"}],["path",{d:"M16 21h3a2 2 0 0 0 2-2v-3"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vd=["svg",ht,[["path",{d:"M18 8L22 12L18 16"}],["path",{d:"M2 12H22"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $d=["svg",ht,[["circle",{cx:"12",cy:"12",r:"3"}],["circle",{cx:"19",cy:"5",r:"2"}],["circle",{cx:"5",cy:"19",r:"2"}],["path",{d:"M10.4 21.9a10 10 0 0 0 9.941-15.416"}],["path",{d:"M13.5 2.1a10 10 0 0 0-9.841 15.416"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Wd=["svg",ht,[["path",{d:"M13 7 8.7 2.7a2.41 2.41 0 0 0-3.4 0L2.7 5.3a2.41 2.41 0 0 0 0 3.4L7 13"}],["path",{d:"m8 6 2-2"}],["path",{d:"m18 16 2-2"}],["path",{d:"m17 11 4.3 4.3c.94.94.94 2.46 0 3.4l-2.6 2.6c-.94.94-2.46.94-3.4 0L11 17"}],["path",{d:"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"}],["path",{d:"m15 5 4 4"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jd=["svg",ht,[["polygon",{points:"6 3 20 12 6 21 6 3"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xd=["svg",ht,[["path",{d:"M4.9 19.1C1 15.2 1 8.8 4.9 4.9"}],["path",{d:"M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"}],["circle",{cx:"12",cy:"12",r:"2"}],["path",{d:"M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"}],["path",{d:"M19.1 4.9C23 8.8 23 15.1 19.1 19"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qd=["svg",ht,[["path",{d:"m15 14 5-5-5-5"}],["path",{d:"M20 9H9.5A5.5 5.5 0 0 0 4 14.5A5.5 5.5 0 0 0 9.5 20H13"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Yd=["svg",ht,[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"}],["path",{d:"M21 3v5h-5"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"}],["path",{d:"M8 16H3v5"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zd=["svg",ht,[["path",{d:"M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"}],["path",{d:"M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"}],["path",{d:"M7 3v4a1 1 0 0 0 1 1h7"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Jd=["svg",ht,[["path",{d:"M3 7V5a2 2 0 0 1 2-2h2"}],["path",{d:"M17 3h2a2 2 0 0 1 2 2v2"}],["path",{d:"M21 17v2a2 2 0 0 1-2 2h-2"}],["path",{d:"M7 21H5a2 2 0 0 1-2-2v-2"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Kd=["svg",ht,[["path",{d:"M20 7h-9"}],["path",{d:"M14 17H5"}],["circle",{cx:"17",cy:"17",r:"3"}],["circle",{cx:"7",cy:"7",r:"3"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qd=["svg",ht,[["path",{d:"M8.3 10a.7.7 0 0 1-.626-1.079L11.4 3a.7.7 0 0 1 1.198-.043L16.3 8.9a.7.7 0 0 1-.572 1.1Z"}],["rect",{x:"3",y:"14",width:"7",height:"7",rx:"1"}],["circle",{cx:"17.5",cy:"17.5",r:"3.5"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const eu=["svg",ht,[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const tu=["svg",ht,[["polyline",{points:"4 17 10 11 4 5"}],["line",{x1:"12",x2:"20",y1:"19",y2:"19"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const nu=["svg",ht,[["path",{d:"M3 6h18"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"}],["line",{x1:"10",x2:"10",y1:"11",y2:"17"}],["line",{x1:"14",x2:"14",y1:"11",y2:"17"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const iu=["svg",ht,[["path",{d:"M9 14 4 9l5-5"}],["path",{d:"M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const su=["svg",ht,[["path",{d:"M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"}],["path",{d:"M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"}],["path",{d:"M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ru=({icons:n={},nameAttr:e="data-lucide",attrs:t={}}={})=>{if(!Object.values(n).length)throw new Error(`Please provide an icons object.
If you want to use all the icons you can import it like:
 \`import { createIcons, icons } from 'lucide';
lucide.createIcons({icons});\``);if(typeof document>"u")throw new Error("`createIcons()` only works in a browser environment.");const i=document.querySelectorAll(`[${e}]`);if(Array.from(i).forEach(s=>Yo(s,{nameAttr:e,icons:n,attrs:t})),e==="data-lucide"){const s=document.querySelectorAll("[icon-name]");s.length>0&&(console.warn("[Lucide] Some icons were found with the now deprecated icon-name attribute. These will still be replaced for backwards compatibility, but will no longer be supported in v1.0 and you should switch to data-lucide"),Array.from(s).forEach(r=>Yo(r,{nameAttr:"icon-name",icons:n,attrs:t})))}};/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const To="180",$i={ROTATE:0,DOLLY:1,PAN:2},Bi={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},au=0,Zo=1,ou=2,Ec=1,lu=2,Fn=3,ei=0,Kt=1,fn=2,Kn=0,Wi=1,Jo=2,Ko=3,Qo=4,cu=5,mi=100,du=101,uu=102,hu=103,pu=104,fu=200,mu=201,gu=202,_u=203,Ra=204,Pa=205,vu=206,xu=207,yu=208,bu=209,Mu=210,Su=211,Eu=212,wu=213,Tu=214,La=0,Da=1,Ia=2,Xi=3,Ua=4,Na=5,Fa=6,Oa=7,wc=0,Au=1,Cu=2,Qn=0,Ru=1,Pu=2,Lu=3,Du=4,Iu=5,Uu=6,Nu=7,Tc=300,qi=301,Yi=302,za=303,ka=304,Ur=306,Ba=1e3,vi=1001,Ha=1002,gn=1003,Fu=1004,Hs=1005,En=1006,Gr=1007,xi=1008,An=1009,Ac=1010,Cc=1011,ws=1012,Ao=1013,yi=1014,zn=1015,Is=1016,Co=1017,Ro=1018,Ts=1020,Rc=35902,Pc=35899,Lc=1021,Dc=1022,mn=1023,As=1026,Cs=1027,Ic=1028,Po=1029,Uc=1030,Lo=1031,Do=1033,yr=33776,br=33777,Mr=33778,Sr=33779,Ga=35840,Va=35841,$a=35842,Wa=35843,ja=36196,Xa=37492,qa=37496,Ya=37808,Za=37809,Ja=37810,Ka=37811,Qa=37812,eo=37813,to=37814,no=37815,io=37816,so=37817,ro=37818,ao=37819,oo=37820,lo=37821,co=36492,uo=36494,ho=36495,po=36283,fo=36284,mo=36285,go=36286,Ou=3200,zu=3201,Nc=0,ku=1,Jn="",ln="srgb",Zi="srgb-linear",Ar="linear",ot="srgb",wi=7680,el=519,Bu=512,Hu=513,Gu=514,Fc=515,Vu=516,$u=517,Wu=518,ju=519,tl=35044,nl="300 es",wn=2e3,Cr=2001;class Si{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const s=i[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const s=i.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}}const Ht=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],xs=Math.PI/180,_o=180/Math.PI;function es(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Ht[n&255]+Ht[n>>8&255]+Ht[n>>16&255]+Ht[n>>24&255]+"-"+Ht[e&255]+Ht[e>>8&255]+"-"+Ht[e>>16&15|64]+Ht[e>>24&255]+"-"+Ht[t&63|128]+Ht[t>>8&255]+"-"+Ht[t>>16&255]+Ht[t>>24&255]+Ht[i&255]+Ht[i>>8&255]+Ht[i>>16&255]+Ht[i>>24&255]).toLowerCase()}function je(n,e,t){return Math.max(e,Math.min(t,n))}function Xu(n,e){return(n%e+e)%e}function Vr(n,e,t){return(1-t)*n+t*e}function ss(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function Yt(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const qu={DEG2RAD:xs};class oe{constructor(e=0,t=0){oe.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6],this.y=s[1]*t+s[4]*i+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=je(this.x,e.x,t.x),this.y=je(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=je(this.x,e,t),this.y=je(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(je(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(je(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*i-a*s+e.x,this.y=r*s+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class zt{constructor(e=0,t=0,i=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=s}static slerpFlat(e,t,i,s,r,a,o){let l=i[s+0],c=i[s+1],d=i[s+2],u=i[s+3];const h=r[a+0],m=r[a+1],_=r[a+2],x=r[a+3];if(o===0){e[t+0]=l,e[t+1]=c,e[t+2]=d,e[t+3]=u;return}if(o===1){e[t+0]=h,e[t+1]=m,e[t+2]=_,e[t+3]=x;return}if(u!==x||l!==h||c!==m||d!==_){let f=1-o;const p=l*h+c*m+d*_+u*x,y=p>=0?1:-1,v=1-p*p;if(v>Number.EPSILON){const E=Math.sqrt(v),T=Math.atan2(E,p*y);f=Math.sin(f*T)/E,o=Math.sin(o*T)/E}const g=o*y;if(l=l*f+h*g,c=c*f+m*g,d=d*f+_*g,u=u*f+x*g,f===1-o){const E=1/Math.sqrt(l*l+c*c+d*d+u*u);l*=E,c*=E,d*=E,u*=E}}e[t]=l,e[t+1]=c,e[t+2]=d,e[t+3]=u}static multiplyQuaternionsFlat(e,t,i,s,r,a){const o=i[s],l=i[s+1],c=i[s+2],d=i[s+3],u=r[a],h=r[a+1],m=r[a+2],_=r[a+3];return e[t]=o*_+d*u+l*m-c*h,e[t+1]=l*_+d*h+c*u-o*m,e[t+2]=c*_+d*m+o*h-l*u,e[t+3]=d*_-o*u-l*h-c*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,s){return this._x=e,this._y=t,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(i/2),d=o(s/2),u=o(r/2),h=l(i/2),m=l(s/2),_=l(r/2);switch(a){case"XYZ":this._x=h*d*u+c*m*_,this._y=c*m*u-h*d*_,this._z=c*d*_+h*m*u,this._w=c*d*u-h*m*_;break;case"YXZ":this._x=h*d*u+c*m*_,this._y=c*m*u-h*d*_,this._z=c*d*_-h*m*u,this._w=c*d*u+h*m*_;break;case"ZXY":this._x=h*d*u-c*m*_,this._y=c*m*u+h*d*_,this._z=c*d*_+h*m*u,this._w=c*d*u-h*m*_;break;case"ZYX":this._x=h*d*u-c*m*_,this._y=c*m*u+h*d*_,this._z=c*d*_-h*m*u,this._w=c*d*u+h*m*_;break;case"YZX":this._x=h*d*u+c*m*_,this._y=c*m*u+h*d*_,this._z=c*d*_-h*m*u,this._w=c*d*u-h*m*_;break;case"XZY":this._x=h*d*u-c*m*_,this._y=c*m*u-h*d*_,this._z=c*d*_+h*m*u,this._w=c*d*u+h*m*_;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,s=Math.sin(i);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],s=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],d=t[6],u=t[10],h=i+o+u;if(h>0){const m=.5/Math.sqrt(h+1);this._w=.25/m,this._x=(d-l)*m,this._y=(r-c)*m,this._z=(a-s)*m}else if(i>o&&i>u){const m=2*Math.sqrt(1+i-o-u);this._w=(d-l)/m,this._x=.25*m,this._y=(s+a)/m,this._z=(r+c)/m}else if(o>u){const m=2*Math.sqrt(1+o-i-u);this._w=(r-c)/m,this._x=(s+a)/m,this._y=.25*m,this._z=(l+d)/m}else{const m=2*Math.sqrt(1+u-i-o);this._w=(a-s)/m,this._x=(r+c)/m,this._y=(l+d)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(je(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const s=Math.min(1,t/i);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,s=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,d=t._w;return this._x=i*d+a*o+s*c-r*l,this._y=s*d+a*l+r*o-i*c,this._z=r*d+a*c+i*l-s*o,this._w=a*d-i*o-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const i=this._x,s=this._y,r=this._z,a=this._w;let o=a*e._w+i*e._x+s*e._y+r*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=i,this._y=s,this._z=r,this;const l=1-o*o;if(l<=Number.EPSILON){const m=1-t;return this._w=m*a+t*this._w,this._x=m*i+t*this._x,this._y=m*s+t*this._y,this._z=m*r+t*this._z,this.normalize(),this}const c=Math.sqrt(l),d=Math.atan2(c,o),u=Math.sin((1-t)*d)/c,h=Math.sin(t*d)/c;return this._w=a*u+this._w*h,this._x=i*u+this._x*h,this._y=s*u+this._y*h,this._z=r*u+this._z*h,this._onChangeCallback(),this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class D{constructor(e=0,t=0,i=0){D.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(il.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(il.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6]*s,this.y=r[1]*t+r[4]*i+r[7]*s,this.z=r[2]*t+r[5]*i+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*i+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*i+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*i+r[10]*s+r[14])*a,this}applyQuaternion(e){const t=this.x,i=this.y,s=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*s-o*i),d=2*(o*t-r*s),u=2*(r*i-a*t);return this.x=t+l*c+a*u-o*d,this.y=i+l*d+o*c-r*u,this.z=s+l*u+r*d-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*i+r[8]*s,this.y=r[1]*t+r[5]*i+r[9]*s,this.z=r[2]*t+r[6]*i+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=je(this.x,e.x,t.x),this.y=je(this.y,e.y,t.y),this.z=je(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=je(this.x,e,t),this.y=je(this.y,e,t),this.z=je(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(je(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,s=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=s*l-r*o,this.y=r*a-i*l,this.z=i*o-s*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return $r.copy(this).projectOnVector(e),this.sub($r)}reflect(e){return this.sub($r.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(je(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,s=this.z-e.z;return t*t+i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const s=Math.sin(t)*e;return this.x=s*Math.sin(i),this.y=Math.cos(t)*e,this.z=s*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const $r=new D,il=new zt;class $e{constructor(e,t,i,s,r,a,o,l,c){$e.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,a,o,l,c)}set(e,t,i,s,r,a,o,l,c){const d=this.elements;return d[0]=e,d[1]=s,d[2]=o,d[3]=t,d[4]=r,d[5]=l,d[6]=i,d[7]=a,d[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,r=this.elements,a=i[0],o=i[3],l=i[6],c=i[1],d=i[4],u=i[7],h=i[2],m=i[5],_=i[8],x=s[0],f=s[3],p=s[6],y=s[1],v=s[4],g=s[7],E=s[2],T=s[5],S=s[8];return r[0]=a*x+o*y+l*E,r[3]=a*f+o*v+l*T,r[6]=a*p+o*g+l*S,r[1]=c*x+d*y+u*E,r[4]=c*f+d*v+u*T,r[7]=c*p+d*g+u*S,r[2]=h*x+m*y+_*E,r[5]=h*f+m*v+_*T,r[8]=h*p+m*g+_*S,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],d=e[8];return t*a*d-t*o*c-i*r*d+i*o*l+s*r*c-s*a*l}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],d=e[8],u=d*a-o*c,h=o*l-d*r,m=c*r-a*l,_=t*u+i*h+s*m;if(_===0)return this.set(0,0,0,0,0,0,0,0,0);const x=1/_;return e[0]=u*x,e[1]=(s*c-d*i)*x,e[2]=(o*i-s*a)*x,e[3]=h*x,e[4]=(d*t-s*l)*x,e[5]=(s*r-o*t)*x,e[6]=m*x,e[7]=(i*l-c*t)*x,e[8]=(a*t-i*r)*x,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,s,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(i*l,i*c,-i*(l*a+c*o)+a+e,-s*c,s*l,-s*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(Wr.makeScale(e,t)),this}rotate(e){return this.premultiply(Wr.makeRotation(-e)),this}translate(e,t){return this.premultiply(Wr.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<9;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Wr=new $e;function Oc(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function Rr(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function Yu(){const n=Rr("canvas");return n.style.display="block",n}const sl={};function Rs(n){n in sl||(sl[n]=!0,console.warn(n))}function Zu(n,e,t){return new Promise(function(i,s){function r(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:i()}}setTimeout(r,t)})}const rl=new $e().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),al=new $e().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Ju(){const n={enabled:!0,workingColorSpace:Zi,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===ot&&(s.r=kn(s.r),s.g=kn(s.g),s.b=kn(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===ot&&(s.r=ji(s.r),s.g=ji(s.g),s.b=ji(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Jn?Ar:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Rs("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Rs("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[Zi]:{primaries:e,whitePoint:i,transfer:Ar,toXYZ:rl,fromXYZ:al,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:ln},outputColorSpaceConfig:{drawingBufferColorSpace:ln}},[ln]:{primaries:e,whitePoint:i,transfer:ot,toXYZ:rl,fromXYZ:al,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:ln}}}),n}const tt=Ju();function kn(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function ji(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let Ti;class Ku{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{Ti===void 0&&(Ti=Rr("canvas")),Ti.width=e.width,Ti.height=e.height;const s=Ti.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),i=Ti}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Rr("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const s=i.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=kn(r[a]/255)*255;return i.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(kn(t[i]/255)*255):t[i]=kn(t[i]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Qu=0;class Io{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Qu++}),this.uuid=es(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(jr(s[a].image)):r.push(jr(s[a]))}else r=jr(s);i.url=r}return t||(e.images[this.uuid]=i),i}}function jr(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?Ku.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let eh=0;const Xr=new D;class Qt extends Si{constructor(e=Qt.DEFAULT_IMAGE,t=Qt.DEFAULT_MAPPING,i=vi,s=vi,r=En,a=xi,o=mn,l=An,c=Qt.DEFAULT_ANISOTROPY,d=Jn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:eh++}),this.uuid=es(),this.name="",this.source=new Io(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new oe(0,0),this.repeat=new oe(1,1),this.center=new oe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new $e,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Xr).x}get height(){return this.source.getSize(Xr).y}get depth(){return this.source.getSize(Xr).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const i=e[t];if(i===void 0){console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Tc)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Ba:e.x=e.x-Math.floor(e.x);break;case vi:e.x=e.x<0?0:1;break;case Ha:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Ba:e.y=e.y-Math.floor(e.y);break;case vi:e.y=e.y<0?0:1;break;case Ha:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Qt.DEFAULT_IMAGE=null;Qt.DEFAULT_MAPPING=Tc;Qt.DEFAULT_ANISOTROPY=1;class Tt{constructor(e=0,t=0,i=0,s=1){Tt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,s){return this.x=e,this.y=t,this.z=i,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*i+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*i+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*i+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,s,r;const l=e.elements,c=l[0],d=l[4],u=l[8],h=l[1],m=l[5],_=l[9],x=l[2],f=l[6],p=l[10];if(Math.abs(d-h)<.01&&Math.abs(u-x)<.01&&Math.abs(_-f)<.01){if(Math.abs(d+h)<.1&&Math.abs(u+x)<.1&&Math.abs(_+f)<.1&&Math.abs(c+m+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const v=(c+1)/2,g=(m+1)/2,E=(p+1)/2,T=(d+h)/4,S=(u+x)/4,A=(_+f)/4;return v>g&&v>E?v<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(v),s=T/i,r=S/i):g>E?g<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(g),i=T/s,r=A/s):E<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(E),i=S/r,s=A/r),this.set(i,s,r,t),this}let y=Math.sqrt((f-_)*(f-_)+(u-x)*(u-x)+(h-d)*(h-d));return Math.abs(y)<.001&&(y=1),this.x=(f-_)/y,this.y=(u-x)/y,this.z=(h-d)/y,this.w=Math.acos((c+m+p-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=je(this.x,e.x,t.x),this.y=je(this.y,e.y,t.y),this.z=je(this.z,e.z,t.z),this.w=je(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=je(this.x,e,t),this.y=je(this.y,e,t),this.z=je(this.z,e,t),this.w=je(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(je(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class th extends Si{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:En,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new Tt(0,0,e,t),this.scissorTest=!1,this.viewport=new Tt(0,0,e,t);const s={width:e,height:t,depth:i.depth},r=new Qt(s);this.textures=[];const a=i.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(e={}){const t={minFilter:En,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=i,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new Io(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class bi extends th{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class zc extends Qt{constructor(e=null,t=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=gn,this.minFilter=gn,this.wrapR=vi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class nh extends Qt{constructor(e=null,t=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=gn,this.minFilter=gn,this.wrapR=vi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Us{constructor(e=new D(1/0,1/0,1/0),t=new D(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(un.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(un.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=un.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const r=i.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,un):un.fromBufferAttribute(r,a),un.applyMatrix4(e.matrixWorld),this.expandByPoint(un);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Gs.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Gs.copy(i.boundingBox)),Gs.applyMatrix4(e.matrixWorld),this.union(Gs)}const s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,un),un.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(rs),Vs.subVectors(this.max,rs),Ai.subVectors(e.a,rs),Ci.subVectors(e.b,rs),Ri.subVectors(e.c,rs),Gn.subVectors(Ci,Ai),Vn.subVectors(Ri,Ci),ri.subVectors(Ai,Ri);let t=[0,-Gn.z,Gn.y,0,-Vn.z,Vn.y,0,-ri.z,ri.y,Gn.z,0,-Gn.x,Vn.z,0,-Vn.x,ri.z,0,-ri.x,-Gn.y,Gn.x,0,-Vn.y,Vn.x,0,-ri.y,ri.x,0];return!qr(t,Ai,Ci,Ri,Vs)||(t=[1,0,0,0,1,0,0,0,1],!qr(t,Ai,Ci,Ri,Vs))?!1:($s.crossVectors(Gn,Vn),t=[$s.x,$s.y,$s.z],qr(t,Ai,Ci,Ri,Vs))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,un).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(un).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Pn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Pn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Pn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Pn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Pn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Pn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Pn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Pn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Pn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Pn=[new D,new D,new D,new D,new D,new D,new D,new D],un=new D,Gs=new Us,Ai=new D,Ci=new D,Ri=new D,Gn=new D,Vn=new D,ri=new D,rs=new D,Vs=new D,$s=new D,ai=new D;function qr(n,e,t,i,s){for(let r=0,a=n.length-3;r<=a;r+=3){ai.fromArray(n,r);const o=s.x*Math.abs(ai.x)+s.y*Math.abs(ai.y)+s.z*Math.abs(ai.z),l=e.dot(ai),c=t.dot(ai),d=i.dot(ai);if(Math.max(-Math.max(l,c,d),Math.min(l,c,d))>o)return!1}return!0}const ih=new Us,as=new D,Yr=new D;class Nr{constructor(e=new D,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):ih.setFromPoints(e).getCenter(i);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,i.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;as.subVectors(e,this.center);const t=as.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),s=(i-this.radius)*.5;this.center.addScaledVector(as,s/i),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Yr.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(as.copy(e.center).add(Yr)),this.expandByPoint(as.copy(e.center).sub(Yr))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}const Ln=new D,Zr=new D,Ws=new D,$n=new D,Jr=new D,js=new D,Kr=new D;class Fr{constructor(e=new D,t=new D(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Ln)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Ln.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Ln.copy(this.origin).addScaledVector(this.direction,t),Ln.distanceToSquared(e))}distanceSqToSegment(e,t,i,s){Zr.copy(e).add(t).multiplyScalar(.5),Ws.copy(t).sub(e).normalize(),$n.copy(this.origin).sub(Zr);const r=e.distanceTo(t)*.5,a=-this.direction.dot(Ws),o=$n.dot(this.direction),l=-$n.dot(Ws),c=$n.lengthSq(),d=Math.abs(1-a*a);let u,h,m,_;if(d>0)if(u=a*l-o,h=a*o-l,_=r*d,u>=0)if(h>=-_)if(h<=_){const x=1/d;u*=x,h*=x,m=u*(u+a*h+2*o)+h*(a*u+h+2*l)+c}else h=r,u=Math.max(0,-(a*h+o)),m=-u*u+h*(h+2*l)+c;else h=-r,u=Math.max(0,-(a*h+o)),m=-u*u+h*(h+2*l)+c;else h<=-_?(u=Math.max(0,-(-a*r+o)),h=u>0?-r:Math.min(Math.max(-r,-l),r),m=-u*u+h*(h+2*l)+c):h<=_?(u=0,h=Math.min(Math.max(-r,-l),r),m=h*(h+2*l)+c):(u=Math.max(0,-(a*r+o)),h=u>0?r:Math.min(Math.max(-r,-l),r),m=-u*u+h*(h+2*l)+c);else h=a>0?-r:r,u=Math.max(0,-(a*h+o)),m=-u*u+h*(h+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Zr).addScaledVector(Ws,h),m}intersectSphere(e,t){Ln.subVectors(e.center,this.origin);const i=Ln.dot(this.direction),s=Ln.dot(Ln)-i*i,r=e.radius*e.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=i-a,l=i+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,s,r,a,o,l;const c=1/this.direction.x,d=1/this.direction.y,u=1/this.direction.z,h=this.origin;return c>=0?(i=(e.min.x-h.x)*c,s=(e.max.x-h.x)*c):(i=(e.max.x-h.x)*c,s=(e.min.x-h.x)*c),d>=0?(r=(e.min.y-h.y)*d,a=(e.max.y-h.y)*d):(r=(e.max.y-h.y)*d,a=(e.min.y-h.y)*d),i>a||r>s||((r>i||isNaN(i))&&(i=r),(a<s||isNaN(s))&&(s=a),u>=0?(o=(e.min.z-h.z)*u,l=(e.max.z-h.z)*u):(o=(e.max.z-h.z)*u,l=(e.min.z-h.z)*u),i>l||o>s)||((o>i||i!==i)&&(i=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(i>=0?i:s,t)}intersectsBox(e){return this.intersectBox(e,Ln)!==null}intersectTriangle(e,t,i,s,r){Jr.subVectors(t,e),js.subVectors(i,e),Kr.crossVectors(Jr,js);let a=this.direction.dot(Kr),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;$n.subVectors(this.origin,e);const l=o*this.direction.dot(js.crossVectors($n,js));if(l<0)return null;const c=o*this.direction.dot(Jr.cross($n));if(c<0||l+c>a)return null;const d=-o*$n.dot(Kr);return d<0?null:this.at(d/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class dt{constructor(e,t,i,s,r,a,o,l,c,d,u,h,m,_,x,f){dt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,a,o,l,c,d,u,h,m,_,x,f)}set(e,t,i,s,r,a,o,l,c,d,u,h,m,_,x,f){const p=this.elements;return p[0]=e,p[4]=t,p[8]=i,p[12]=s,p[1]=r,p[5]=a,p[9]=o,p[13]=l,p[2]=c,p[6]=d,p[10]=u,p[14]=h,p[3]=m,p[7]=_,p[11]=x,p[15]=f,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new dt().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,i=e.elements,s=1/Pi.setFromMatrixColumn(e,0).length(),r=1/Pi.setFromMatrixColumn(e,1).length(),a=1/Pi.setFromMatrixColumn(e,2).length();return t[0]=i[0]*s,t[1]=i[1]*s,t[2]=i[2]*s,t[3]=0,t[4]=i[4]*r,t[5]=i[5]*r,t[6]=i[6]*r,t[7]=0,t[8]=i[8]*a,t[9]=i[9]*a,t[10]=i[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,s=e.y,r=e.z,a=Math.cos(i),o=Math.sin(i),l=Math.cos(s),c=Math.sin(s),d=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){const h=a*d,m=a*u,_=o*d,x=o*u;t[0]=l*d,t[4]=-l*u,t[8]=c,t[1]=m+_*c,t[5]=h-x*c,t[9]=-o*l,t[2]=x-h*c,t[6]=_+m*c,t[10]=a*l}else if(e.order==="YXZ"){const h=l*d,m=l*u,_=c*d,x=c*u;t[0]=h+x*o,t[4]=_*o-m,t[8]=a*c,t[1]=a*u,t[5]=a*d,t[9]=-o,t[2]=m*o-_,t[6]=x+h*o,t[10]=a*l}else if(e.order==="ZXY"){const h=l*d,m=l*u,_=c*d,x=c*u;t[0]=h-x*o,t[4]=-a*u,t[8]=_+m*o,t[1]=m+_*o,t[5]=a*d,t[9]=x-h*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const h=a*d,m=a*u,_=o*d,x=o*u;t[0]=l*d,t[4]=_*c-m,t[8]=h*c+x,t[1]=l*u,t[5]=x*c+h,t[9]=m*c-_,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const h=a*l,m=a*c,_=o*l,x=o*c;t[0]=l*d,t[4]=x-h*u,t[8]=_*u+m,t[1]=u,t[5]=a*d,t[9]=-o*d,t[2]=-c*d,t[6]=m*u+_,t[10]=h-x*u}else if(e.order==="XZY"){const h=a*l,m=a*c,_=o*l,x=o*c;t[0]=l*d,t[4]=-u,t[8]=c*d,t[1]=h*u+x,t[5]=a*d,t[9]=m*u-_,t[2]=_*u-m,t[6]=o*d,t[10]=x*u+h}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(sh,e,rh)}lookAt(e,t,i){const s=this.elements;return nn.subVectors(e,t),nn.lengthSq()===0&&(nn.z=1),nn.normalize(),Wn.crossVectors(i,nn),Wn.lengthSq()===0&&(Math.abs(i.z)===1?nn.x+=1e-4:nn.z+=1e-4,nn.normalize(),Wn.crossVectors(i,nn)),Wn.normalize(),Xs.crossVectors(nn,Wn),s[0]=Wn.x,s[4]=Xs.x,s[8]=nn.x,s[1]=Wn.y,s[5]=Xs.y,s[9]=nn.y,s[2]=Wn.z,s[6]=Xs.z,s[10]=nn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,r=this.elements,a=i[0],o=i[4],l=i[8],c=i[12],d=i[1],u=i[5],h=i[9],m=i[13],_=i[2],x=i[6],f=i[10],p=i[14],y=i[3],v=i[7],g=i[11],E=i[15],T=s[0],S=s[4],A=s[8],M=s[12],b=s[1],R=s[5],U=s[9],L=s[13],k=s[2],F=s[6],O=s[10],H=s[14],$=s[3],ee=s[7],pe=s[11],ge=s[15];return r[0]=a*T+o*b+l*k+c*$,r[4]=a*S+o*R+l*F+c*ee,r[8]=a*A+o*U+l*O+c*pe,r[12]=a*M+o*L+l*H+c*ge,r[1]=d*T+u*b+h*k+m*$,r[5]=d*S+u*R+h*F+m*ee,r[9]=d*A+u*U+h*O+m*pe,r[13]=d*M+u*L+h*H+m*ge,r[2]=_*T+x*b+f*k+p*$,r[6]=_*S+x*R+f*F+p*ee,r[10]=_*A+x*U+f*O+p*pe,r[14]=_*M+x*L+f*H+p*ge,r[3]=y*T+v*b+g*k+E*$,r[7]=y*S+v*R+g*F+E*ee,r[11]=y*A+v*U+g*O+E*pe,r[15]=y*M+v*L+g*H+E*ge,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],s=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],d=e[2],u=e[6],h=e[10],m=e[14],_=e[3],x=e[7],f=e[11],p=e[15];return _*(+r*l*u-s*c*u-r*o*h+i*c*h+s*o*m-i*l*m)+x*(+t*l*m-t*c*h+r*a*h-s*a*m+s*c*d-r*l*d)+f*(+t*c*u-t*o*m-r*a*u+i*a*m+r*o*d-i*c*d)+p*(-s*o*d-t*l*u+t*o*h+s*a*u-i*a*h+i*l*d)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],d=e[8],u=e[9],h=e[10],m=e[11],_=e[12],x=e[13],f=e[14],p=e[15],y=u*f*c-x*h*c+x*l*m-o*f*m-u*l*p+o*h*p,v=_*h*c-d*f*c-_*l*m+a*f*m+d*l*p-a*h*p,g=d*x*c-_*u*c+_*o*m-a*x*m-d*o*p+a*u*p,E=_*u*l-d*x*l-_*o*h+a*x*h+d*o*f-a*u*f,T=t*y+i*v+s*g+r*E;if(T===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const S=1/T;return e[0]=y*S,e[1]=(x*h*r-u*f*r-x*s*m+i*f*m+u*s*p-i*h*p)*S,e[2]=(o*f*r-x*l*r+x*s*c-i*f*c-o*s*p+i*l*p)*S,e[3]=(u*l*r-o*h*r-u*s*c+i*h*c+o*s*m-i*l*m)*S,e[4]=v*S,e[5]=(d*f*r-_*h*r+_*s*m-t*f*m-d*s*p+t*h*p)*S,e[6]=(_*l*r-a*f*r-_*s*c+t*f*c+a*s*p-t*l*p)*S,e[7]=(a*h*r-d*l*r+d*s*c-t*h*c-a*s*m+t*l*m)*S,e[8]=g*S,e[9]=(_*u*r-d*x*r-_*i*m+t*x*m+d*i*p-t*u*p)*S,e[10]=(a*x*r-_*o*r+_*i*c-t*x*c-a*i*p+t*o*p)*S,e[11]=(d*o*r-a*u*r-d*i*c+t*u*c+a*i*m-t*o*m)*S,e[12]=E*S,e[13]=(d*x*s-_*u*s+_*i*h-t*x*h-d*i*f+t*u*f)*S,e[14]=(_*o*s-a*x*s-_*i*l+t*x*l+a*i*f-t*o*f)*S,e[15]=(a*u*s-d*o*s+d*i*l-t*u*l-a*i*h+t*o*h)*S,this}scale(e){const t=this.elements,i=e.x,s=e.y,r=e.z;return t[0]*=i,t[4]*=s,t[8]*=r,t[1]*=i,t[5]*=s,t[9]*=r,t[2]*=i,t[6]*=s,t[10]*=r,t[3]*=i,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,s))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),s=Math.sin(t),r=1-i,a=e.x,o=e.y,l=e.z,c=r*a,d=r*o;return this.set(c*a+i,c*o-s*l,c*l+s*o,0,c*o+s*l,d*o+i,d*l-s*a,0,c*l-s*o,d*l+s*a,r*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,s,r,a){return this.set(1,i,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,i){const s=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,d=a+a,u=o+o,h=r*c,m=r*d,_=r*u,x=a*d,f=a*u,p=o*u,y=l*c,v=l*d,g=l*u,E=i.x,T=i.y,S=i.z;return s[0]=(1-(x+p))*E,s[1]=(m+g)*E,s[2]=(_-v)*E,s[3]=0,s[4]=(m-g)*T,s[5]=(1-(h+p))*T,s[6]=(f+y)*T,s[7]=0,s[8]=(_+v)*S,s[9]=(f-y)*S,s[10]=(1-(h+x))*S,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,i){const s=this.elements;let r=Pi.set(s[0],s[1],s[2]).length();const a=Pi.set(s[4],s[5],s[6]).length(),o=Pi.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],hn.copy(this);const c=1/r,d=1/a,u=1/o;return hn.elements[0]*=c,hn.elements[1]*=c,hn.elements[2]*=c,hn.elements[4]*=d,hn.elements[5]*=d,hn.elements[6]*=d,hn.elements[8]*=u,hn.elements[9]*=u,hn.elements[10]*=u,t.setFromRotationMatrix(hn),i.x=r,i.y=a,i.z=o,this}makePerspective(e,t,i,s,r,a,o=wn,l=!1){const c=this.elements,d=2*r/(t-e),u=2*r/(i-s),h=(t+e)/(t-e),m=(i+s)/(i-s);let _,x;if(l)_=r/(a-r),x=a*r/(a-r);else if(o===wn)_=-(a+r)/(a-r),x=-2*a*r/(a-r);else if(o===Cr)_=-a/(a-r),x=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=d,c[4]=0,c[8]=h,c[12]=0,c[1]=0,c[5]=u,c[9]=m,c[13]=0,c[2]=0,c[6]=0,c[10]=_,c[14]=x,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,i,s,r,a,o=wn,l=!1){const c=this.elements,d=2/(t-e),u=2/(i-s),h=-(t+e)/(t-e),m=-(i+s)/(i-s);let _,x;if(l)_=1/(a-r),x=a/(a-r);else if(o===wn)_=-2/(a-r),x=-(a+r)/(a-r);else if(o===Cr)_=-1/(a-r),x=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=d,c[4]=0,c[8]=0,c[12]=h,c[1]=0,c[5]=u,c[9]=0,c[13]=m,c[2]=0,c[6]=0,c[10]=_,c[14]=x,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<16;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}}const Pi=new D,hn=new dt,sh=new D(0,0,0),rh=new D(1,1,1),Wn=new D,Xs=new D,nn=new D,ol=new dt,ll=new zt;class _n{constructor(e=0,t=0,i=0,s=_n.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,s=this._order){return this._x=e,this._y=t,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const s=e.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],d=s[9],u=s[2],h=s[6],m=s[10];switch(t){case"XYZ":this._y=Math.asin(je(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-d,m),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(h,c),this._z=0);break;case"YXZ":this._x=Math.asin(-je(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(o,m),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(je(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-u,m),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-je(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(h,m),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(je(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-d,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,m));break;case"XZY":this._z=Math.asin(-je(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(h,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-d,m),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return ol.makeRotationFromQuaternion(e),this.setFromRotationMatrix(ol,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return ll.setFromEuler(this),this.setFromQuaternion(ll,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}_n.DEFAULT_ORDER="XYZ";class Uo{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let ah=0;const cl=new D,Li=new zt,Dn=new dt,qs=new D,os=new D,oh=new D,lh=new zt,dl=new D(1,0,0),ul=new D(0,1,0),hl=new D(0,0,1),pl={type:"added"},ch={type:"removed"},Di={type:"childadded",child:null},Qr={type:"childremoved",child:null};class Ct extends Si{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:ah++}),this.uuid=es(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Ct.DEFAULT_UP.clone();const e=new D,t=new _n,i=new zt,s=new D(1,1,1);function r(){i.setFromEuler(t,!1)}function a(){t.setFromQuaternion(i,void 0,!1)}t._onChange(r),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new dt},normalMatrix:{value:new $e}}),this.matrix=new dt,this.matrixWorld=new dt,this.matrixAutoUpdate=Ct.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Ct.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Uo,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Li.setFromAxisAngle(e,t),this.quaternion.multiply(Li),this}rotateOnWorldAxis(e,t){return Li.setFromAxisAngle(e,t),this.quaternion.premultiply(Li),this}rotateX(e){return this.rotateOnAxis(dl,e)}rotateY(e){return this.rotateOnAxis(ul,e)}rotateZ(e){return this.rotateOnAxis(hl,e)}translateOnAxis(e,t){return cl.copy(e).applyQuaternion(this.quaternion),this.position.add(cl.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(dl,e)}translateY(e){return this.translateOnAxis(ul,e)}translateZ(e){return this.translateOnAxis(hl,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Dn.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?qs.copy(e):qs.set(e,t,i);const s=this.parent;this.updateWorldMatrix(!0,!1),os.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Dn.lookAt(os,qs,this.up):Dn.lookAt(qs,os,this.up),this.quaternion.setFromRotationMatrix(Dn),s&&(Dn.extractRotation(s.matrixWorld),Li.setFromRotationMatrix(Dn),this.quaternion.premultiply(Li.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(pl),Di.child=e,this.dispatchEvent(Di),Di.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(ch),Qr.child=e,this.dispatchEvent(Qr),Qr.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Dn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Dn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Dn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(pl),Di.child=e,this.dispatchEvent(Di),Di.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,s=this.children.length;i<s;i++){const a=this.children[i].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(os,e,oh),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(os,lh,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,d=l.length;c<d;c++){const u=l[c];r(e.shapes,u)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];s.animations.push(r(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),d=a(e.images),u=a(e.shapes),h=a(e.skeletons),m=a(e.animations),_=a(e.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),d.length>0&&(i.images=d),u.length>0&&(i.shapes=u),h.length>0&&(i.skeletons=h),m.length>0&&(i.animations=m),_.length>0&&(i.nodes=_)}return i.object=s,i;function a(o){const l=[];for(const c in o){const d=o[c];delete d.metadata,l.push(d)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const s=e.children[i];this.add(s.clone())}return this}}Ct.DEFAULT_UP=new D(0,1,0);Ct.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ct.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const pn=new D,In=new D,ea=new D,Un=new D,Ii=new D,Ui=new D,fl=new D,ta=new D,na=new D,ia=new D,sa=new Tt,ra=new Tt,aa=new Tt;class dn{constructor(e=new D,t=new D,i=new D){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,s){s.subVectors(i,t),pn.subVectors(e,t),s.cross(pn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,i,s,r){pn.subVectors(s,t),In.subVectors(i,t),ea.subVectors(e,t);const a=pn.dot(pn),o=pn.dot(In),l=pn.dot(ea),c=In.dot(In),d=In.dot(ea),u=a*c-o*o;if(u===0)return r.set(0,0,0),null;const h=1/u,m=(c*l-o*d)*h,_=(a*d-o*l)*h;return r.set(1-m-_,_,m)}static containsPoint(e,t,i,s){return this.getBarycoord(e,t,i,s,Un)===null?!1:Un.x>=0&&Un.y>=0&&Un.x+Un.y<=1}static getInterpolation(e,t,i,s,r,a,o,l){return this.getBarycoord(e,t,i,s,Un)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Un.x),l.addScaledVector(a,Un.y),l.addScaledVector(o,Un.z),l)}static getInterpolatedAttribute(e,t,i,s,r,a){return sa.setScalar(0),ra.setScalar(0),aa.setScalar(0),sa.fromBufferAttribute(e,t),ra.fromBufferAttribute(e,i),aa.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(sa,r.x),a.addScaledVector(ra,r.y),a.addScaledVector(aa,r.z),a}static isFrontFacing(e,t,i,s){return pn.subVectors(i,t),In.subVectors(e,t),pn.cross(In).dot(s)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,s){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,i,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return pn.subVectors(this.c,this.b),In.subVectors(this.a,this.b),pn.cross(In).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return dn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return dn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,s,r){return dn.getInterpolation(e,this.a,this.b,this.c,t,i,s,r)}containsPoint(e){return dn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return dn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,s=this.b,r=this.c;let a,o;Ii.subVectors(s,i),Ui.subVectors(r,i),ta.subVectors(e,i);const l=Ii.dot(ta),c=Ui.dot(ta);if(l<=0&&c<=0)return t.copy(i);na.subVectors(e,s);const d=Ii.dot(na),u=Ui.dot(na);if(d>=0&&u<=d)return t.copy(s);const h=l*u-d*c;if(h<=0&&l>=0&&d<=0)return a=l/(l-d),t.copy(i).addScaledVector(Ii,a);ia.subVectors(e,r);const m=Ii.dot(ia),_=Ui.dot(ia);if(_>=0&&m<=_)return t.copy(r);const x=m*c-l*_;if(x<=0&&c>=0&&_<=0)return o=c/(c-_),t.copy(i).addScaledVector(Ui,o);const f=d*_-m*u;if(f<=0&&u-d>=0&&m-_>=0)return fl.subVectors(r,s),o=(u-d)/(u-d+(m-_)),t.copy(s).addScaledVector(fl,o);const p=1/(f+x+h);return a=x*p,o=h*p,t.copy(i).addScaledVector(Ii,a).addScaledVector(Ui,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const kc={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},jn={h:0,s:0,l:0},Ys={h:0,s:0,l:0};function oa(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class Xe{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=ln){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,tt.colorSpaceToWorking(this,t),this}setRGB(e,t,i,s=tt.workingColorSpace){return this.r=e,this.g=t,this.b=i,tt.colorSpaceToWorking(this,s),this}setHSL(e,t,i,s=tt.workingColorSpace){if(e=Xu(e,1),t=je(t,0,1),i=je(i,0,1),t===0)this.r=this.g=this.b=i;else{const r=i<=.5?i*(1+t):i+t-i*t,a=2*i-r;this.r=oa(a,r,e+1/3),this.g=oa(a,r,e),this.b=oa(a,r,e-1/3)}return tt.colorSpaceToWorking(this,s),this}setStyle(e,t=ln){function i(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=ln){const i=kc[e.toLowerCase()];return i!==void 0?this.setHex(i,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=kn(e.r),this.g=kn(e.g),this.b=kn(e.b),this}copyLinearToSRGB(e){return this.r=ji(e.r),this.g=ji(e.g),this.b=ji(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=ln){return tt.workingToColorSpace(Gt.copy(this),e),Math.round(je(Gt.r*255,0,255))*65536+Math.round(je(Gt.g*255,0,255))*256+Math.round(je(Gt.b*255,0,255))}getHexString(e=ln){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=tt.workingColorSpace){tt.workingToColorSpace(Gt.copy(this),t);const i=Gt.r,s=Gt.g,r=Gt.b,a=Math.max(i,s,r),o=Math.min(i,s,r);let l,c;const d=(o+a)/2;if(o===a)l=0,c=0;else{const u=a-o;switch(c=d<=.5?u/(a+o):u/(2-a-o),a){case i:l=(s-r)/u+(s<r?6:0);break;case s:l=(r-i)/u+2;break;case r:l=(i-s)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=d,e}getRGB(e,t=tt.workingColorSpace){return tt.workingToColorSpace(Gt.copy(this),t),e.r=Gt.r,e.g=Gt.g,e.b=Gt.b,e}getStyle(e=ln){tt.workingToColorSpace(Gt.copy(this),e);const t=Gt.r,i=Gt.g,s=Gt.b;return e!==ln?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(e,t,i){return this.getHSL(jn),this.setHSL(jn.h+e,jn.s+t,jn.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(jn),e.getHSL(Ys);const i=Vr(jn.h,Ys.h,t),s=Vr(jn.s,Ys.s,t),r=Vr(jn.l,Ys.l,t);return this.setHSL(i,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*i+r[6]*s,this.g=r[1]*t+r[4]*i+r[7]*s,this.b=r[2]*t+r[5]*i+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Gt=new Xe;Xe.NAMES=kc;let dh=0;class ts extends Si{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:dh++}),this.uuid=es(),this.name="",this.type="Material",this.blending=Wi,this.side=ei,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ra,this.blendDst=Pa,this.blendEquation=mi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Xe(0,0,0),this.blendAlpha=0,this.depthFunc=Xi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=el,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=wi,this.stencilZFail=wi,this.stencilZPass=wi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Wi&&(i.blending=this.blending),this.side!==ei&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Ra&&(i.blendSrc=this.blendSrc),this.blendDst!==Pa&&(i.blendDst=this.blendDst),this.blendEquation!==mi&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Xi&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==el&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==wi&&(i.stencilFail=this.stencilFail),this.stencilZFail!==wi&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==wi&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(t){const r=s(e.textures),a=s(e.images);r.length>0&&(i.textures=r),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const s=t.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=t[r].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class Or extends ts{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Xe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new _n,this.combine=wc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Rt=new D,Zs=new oe;let uh=0;class Tn{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:uh++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=tl,this.updateRanges=[],this.gpuType=zn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[i+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Zs.fromBufferAttribute(this,t),Zs.applyMatrix3(e),this.setXY(t,Zs.x,Zs.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)Rt.fromBufferAttribute(this,t),Rt.applyMatrix3(e),this.setXYZ(t,Rt.x,Rt.y,Rt.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)Rt.fromBufferAttribute(this,t),Rt.applyMatrix4(e),this.setXYZ(t,Rt.x,Rt.y,Rt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Rt.fromBufferAttribute(this,t),Rt.applyNormalMatrix(e),this.setXYZ(t,Rt.x,Rt.y,Rt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Rt.fromBufferAttribute(this,t),Rt.transformDirection(e),this.setXYZ(t,Rt.x,Rt.y,Rt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=ss(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Yt(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=ss(t,this.array)),t}setX(e,t){return this.normalized&&(t=Yt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=ss(t,this.array)),t}setY(e,t){return this.normalized&&(t=Yt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=ss(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Yt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=ss(t,this.array)),t}setW(e,t){return this.normalized&&(t=Yt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=Yt(t,this.array),i=Yt(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,s){return e*=this.itemSize,this.normalized&&(t=Yt(t,this.array),i=Yt(i,this.array),s=Yt(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this}setXYZW(e,t,i,s,r){return e*=this.itemSize,this.normalized&&(t=Yt(t,this.array),i=Yt(i,this.array),s=Yt(s,this.array),r=Yt(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==tl&&(e.usage=this.usage),e}}class Bc extends Tn{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class Hc extends Tn{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class rt extends Tn{constructor(e,t,i){super(new Float32Array(e),t,i)}}let hh=0;const on=new dt,la=new Ct,Ni=new D,sn=new Us,ls=new Us,Ut=new D;class Ft extends Si{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:hh++}),this.uuid=es(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Oc(e)?Hc:Bc)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const r=new $e().getNormalMatrix(e);i.applyNormalMatrix(r),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return on.makeRotationFromQuaternion(e),this.applyMatrix4(on),this}rotateX(e){return on.makeRotationX(e),this.applyMatrix4(on),this}rotateY(e){return on.makeRotationY(e),this.applyMatrix4(on),this}rotateZ(e){return on.makeRotationZ(e),this.applyMatrix4(on),this}translate(e,t,i){return on.makeTranslation(e,t,i),this.applyMatrix4(on),this}scale(e,t,i){return on.makeScale(e,t,i),this.applyMatrix4(on),this}lookAt(e){return la.lookAt(e),la.updateMatrix(),this.applyMatrix4(la.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ni).negate(),this.translate(Ni.x,Ni.y,Ni.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let s=0,r=e.length;s<r;s++){const a=e[s];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new rt(i,3))}else{const i=Math.min(e.length,t.count);for(let s=0;s<i;s++){const r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Us);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new D(-1/0,-1/0,-1/0),new D(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,s=t.length;i<s;i++){const r=t[i];sn.setFromBufferAttribute(r),this.morphTargetsRelative?(Ut.addVectors(this.boundingBox.min,sn.min),this.boundingBox.expandByPoint(Ut),Ut.addVectors(this.boundingBox.max,sn.max),this.boundingBox.expandByPoint(Ut)):(this.boundingBox.expandByPoint(sn.min),this.boundingBox.expandByPoint(sn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Nr);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new D,1/0);return}if(e){const i=this.boundingSphere.center;if(sn.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];ls.setFromBufferAttribute(o),this.morphTargetsRelative?(Ut.addVectors(sn.min,ls.min),sn.expandByPoint(Ut),Ut.addVectors(sn.max,ls.max),sn.expandByPoint(Ut)):(sn.expandByPoint(ls.min),sn.expandByPoint(ls.max))}sn.getCenter(i);let s=0;for(let r=0,a=e.count;r<a;r++)Ut.fromBufferAttribute(e,r),s=Math.max(s,i.distanceToSquared(Ut));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],l=this.morphTargetsRelative;for(let c=0,d=o.count;c<d;c++)Ut.fromBufferAttribute(o,c),l&&(Ni.fromBufferAttribute(e,c),Ut.add(Ni)),s=Math.max(s,i.distanceToSquared(Ut))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Tn(new Float32Array(4*i.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let A=0;A<i.count;A++)o[A]=new D,l[A]=new D;const c=new D,d=new D,u=new D,h=new oe,m=new oe,_=new oe,x=new D,f=new D;function p(A,M,b){c.fromBufferAttribute(i,A),d.fromBufferAttribute(i,M),u.fromBufferAttribute(i,b),h.fromBufferAttribute(r,A),m.fromBufferAttribute(r,M),_.fromBufferAttribute(r,b),d.sub(c),u.sub(c),m.sub(h),_.sub(h);const R=1/(m.x*_.y-_.x*m.y);isFinite(R)&&(x.copy(d).multiplyScalar(_.y).addScaledVector(u,-m.y).multiplyScalar(R),f.copy(u).multiplyScalar(m.x).addScaledVector(d,-_.x).multiplyScalar(R),o[A].add(x),o[M].add(x),o[b].add(x),l[A].add(f),l[M].add(f),l[b].add(f))}let y=this.groups;y.length===0&&(y=[{start:0,count:e.count}]);for(let A=0,M=y.length;A<M;++A){const b=y[A],R=b.start,U=b.count;for(let L=R,k=R+U;L<k;L+=3)p(e.getX(L+0),e.getX(L+1),e.getX(L+2))}const v=new D,g=new D,E=new D,T=new D;function S(A){E.fromBufferAttribute(s,A),T.copy(E);const M=o[A];v.copy(M),v.sub(E.multiplyScalar(E.dot(M))).normalize(),g.crossVectors(T,M);const R=g.dot(l[A])<0?-1:1;a.setXYZW(A,v.x,v.y,v.z,R)}for(let A=0,M=y.length;A<M;++A){const b=y[A],R=b.start,U=b.count;for(let L=R,k=R+U;L<k;L+=3)S(e.getX(L+0)),S(e.getX(L+1)),S(e.getX(L+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Tn(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let h=0,m=i.count;h<m;h++)i.setXYZ(h,0,0,0);const s=new D,r=new D,a=new D,o=new D,l=new D,c=new D,d=new D,u=new D;if(e)for(let h=0,m=e.count;h<m;h+=3){const _=e.getX(h+0),x=e.getX(h+1),f=e.getX(h+2);s.fromBufferAttribute(t,_),r.fromBufferAttribute(t,x),a.fromBufferAttribute(t,f),d.subVectors(a,r),u.subVectors(s,r),d.cross(u),o.fromBufferAttribute(i,_),l.fromBufferAttribute(i,x),c.fromBufferAttribute(i,f),o.add(d),l.add(d),c.add(d),i.setXYZ(_,o.x,o.y,o.z),i.setXYZ(x,l.x,l.y,l.z),i.setXYZ(f,c.x,c.y,c.z)}else for(let h=0,m=t.count;h<m;h+=3)s.fromBufferAttribute(t,h+0),r.fromBufferAttribute(t,h+1),a.fromBufferAttribute(t,h+2),d.subVectors(a,r),u.subVectors(s,r),d.cross(u),i.setXYZ(h+0,d.x,d.y,d.z),i.setXYZ(h+1,d.x,d.y,d.z),i.setXYZ(h+2,d.x,d.y,d.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)Ut.fromBufferAttribute(e,t),Ut.normalize(),e.setXYZ(t,Ut.x,Ut.y,Ut.z)}toNonIndexed(){function e(o,l){const c=o.array,d=o.itemSize,u=o.normalized,h=new c.constructor(l.length*d);let m=0,_=0;for(let x=0,f=l.length;x<f;x++){o.isInterleavedBufferAttribute?m=l[x]*o.data.stride+o.offset:m=l[x]*d;for(let p=0;p<d;p++)h[_++]=c[m++]}return new Tn(h,d,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Ft,i=this.index.array,s=this.attributes;for(const o in s){const l=s[o],c=e(l,i);t.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let d=0,u=c.length;d<u;d++){const h=c[d],m=e(h,i);l.push(m)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],d=[];for(let u=0,h=c.length;u<h;u++){const m=c[u];d.push(m.toJSON(e.data))}d.length>0&&(s[l]=d,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const s=e.attributes;for(const c in s){const d=s[c];this.setAttribute(c,d.clone(t))}const r=e.morphAttributes;for(const c in r){const d=[],u=r[c];for(let h=0,m=u.length;h<m;h++)d.push(u[h].clone(t));this.morphAttributes[c]=d}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,d=a.length;c<d;c++){const u=a[c];this.addGroup(u.start,u.count,u.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const ml=new dt,oi=new Fr,Js=new Nr,gl=new D,Ks=new D,Qs=new D,er=new D,ca=new D,tr=new D,_l=new D,nr=new D;class be extends Ct{constructor(e=new Ft,t=new Or){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,a=i.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(r&&o){tr.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const d=o[l],u=r[l];d!==0&&(ca.fromBufferAttribute(u,e),a?tr.addScaledVector(ca,d):tr.addScaledVector(ca.sub(t),d))}t.add(tr)}return t}raycast(e,t){const i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Js.copy(i.boundingSphere),Js.applyMatrix4(r),oi.copy(e.ray).recast(e.near),!(Js.containsPoint(oi.origin)===!1&&(oi.intersectSphere(Js,gl)===null||oi.origin.distanceToSquared(gl)>(e.far-e.near)**2))&&(ml.copy(r).invert(),oi.copy(e.ray).applyMatrix4(ml),!(i.boundingBox!==null&&oi.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,oi)))}_computeIntersections(e,t,i){let s;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,d=r.attributes.uv1,u=r.attributes.normal,h=r.groups,m=r.drawRange;if(o!==null)if(Array.isArray(a))for(let _=0,x=h.length;_<x;_++){const f=h[_],p=a[f.materialIndex],y=Math.max(f.start,m.start),v=Math.min(o.count,Math.min(f.start+f.count,m.start+m.count));for(let g=y,E=v;g<E;g+=3){const T=o.getX(g),S=o.getX(g+1),A=o.getX(g+2);s=ir(this,p,e,i,c,d,u,T,S,A),s&&(s.faceIndex=Math.floor(g/3),s.face.materialIndex=f.materialIndex,t.push(s))}}else{const _=Math.max(0,m.start),x=Math.min(o.count,m.start+m.count);for(let f=_,p=x;f<p;f+=3){const y=o.getX(f),v=o.getX(f+1),g=o.getX(f+2);s=ir(this,a,e,i,c,d,u,y,v,g),s&&(s.faceIndex=Math.floor(f/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let _=0,x=h.length;_<x;_++){const f=h[_],p=a[f.materialIndex],y=Math.max(f.start,m.start),v=Math.min(l.count,Math.min(f.start+f.count,m.start+m.count));for(let g=y,E=v;g<E;g+=3){const T=g,S=g+1,A=g+2;s=ir(this,p,e,i,c,d,u,T,S,A),s&&(s.faceIndex=Math.floor(g/3),s.face.materialIndex=f.materialIndex,t.push(s))}}else{const _=Math.max(0,m.start),x=Math.min(l.count,m.start+m.count);for(let f=_,p=x;f<p;f+=3){const y=f,v=f+1,g=f+2;s=ir(this,a,e,i,c,d,u,y,v,g),s&&(s.faceIndex=Math.floor(f/3),t.push(s))}}}}function ph(n,e,t,i,s,r,a,o){let l;if(e.side===Kt?l=i.intersectTriangle(a,r,s,!0,o):l=i.intersectTriangle(s,r,a,e.side===ei,o),l===null)return null;nr.copy(o),nr.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(nr);return c<t.near||c>t.far?null:{distance:c,point:nr.clone(),object:n}}function ir(n,e,t,i,s,r,a,o,l,c){n.getVertexPosition(o,Ks),n.getVertexPosition(l,Qs),n.getVertexPosition(c,er);const d=ph(n,e,t,i,Ks,Qs,er,_l);if(d){const u=new D;dn.getBarycoord(_l,Ks,Qs,er,u),s&&(d.uv=dn.getInterpolatedAttribute(s,o,l,c,u,new oe)),r&&(d.uv1=dn.getInterpolatedAttribute(r,o,l,c,u,new oe)),a&&(d.normal=dn.getInterpolatedAttribute(a,o,l,c,u,new D),d.normal.dot(i.direction)>0&&d.normal.multiplyScalar(-1));const h={a:o,b:l,c,normal:new D,materialIndex:0};dn.getNormal(Ks,Qs,er,h.normal),d.face=h,d.barycoord=u}return d}class St extends Ft{constructor(e=1,t=1,i=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],d=[],u=[];let h=0,m=0;_("z","y","x",-1,-1,i,t,e,a,r,0),_("z","y","x",1,-1,i,t,-e,a,r,1),_("x","z","y",1,1,e,i,t,s,a,2),_("x","z","y",1,-1,e,i,-t,s,a,3),_("x","y","z",1,-1,e,t,i,s,r,4),_("x","y","z",-1,-1,e,t,-i,s,r,5),this.setIndex(l),this.setAttribute("position",new rt(c,3)),this.setAttribute("normal",new rt(d,3)),this.setAttribute("uv",new rt(u,2));function _(x,f,p,y,v,g,E,T,S,A,M){const b=g/S,R=E/A,U=g/2,L=E/2,k=T/2,F=S+1,O=A+1;let H=0,$=0;const ee=new D;for(let pe=0;pe<O;pe++){const ge=pe*R-L;for(let Oe=0;Oe<F;Oe++){const qe=Oe*b-U;ee[x]=qe*y,ee[f]=ge*v,ee[p]=k,c.push(ee.x,ee.y,ee.z),ee[x]=0,ee[f]=0,ee[p]=T>0?1:-1,d.push(ee.x,ee.y,ee.z),u.push(Oe/S),u.push(1-pe/A),H+=1}}for(let pe=0;pe<A;pe++)for(let ge=0;ge<S;ge++){const Oe=h+ge+F*pe,qe=h+ge+F*(pe+1),Qe=h+(ge+1)+F*(pe+1),Ke=h+(ge+1)+F*pe;l.push(Oe,qe,Ke),l.push(qe,Qe,Ke),$+=6}o.addGroup(m,$,M),m+=$,h+=H}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new St(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Ji(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const s=n[t][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=s.clone():Array.isArray(s)?e[t][i]=s.slice():e[t][i]=s}}return e}function jt(n){const e={};for(let t=0;t<n.length;t++){const i=Ji(n[t]);for(const s in i)e[s]=i[s]}return e}function fh(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function Gc(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:tt.workingColorSpace}const mh={clone:Ji,merge:jt};var gh=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,_h=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class ti extends ts{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=gh,this.fragmentShader=_h,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Ji(e.uniforms),this.uniformsGroups=fh(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class Vc extends Ct{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new dt,this.projectionMatrix=new dt,this.projectionMatrixInverse=new dt,this.coordinateSystem=wn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Xn=new D,vl=new oe,xl=new oe;class cn extends Vc{constructor(e=50,t=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=_o*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(xs*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return _o*2*Math.atan(Math.tan(xs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){Xn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Xn.x,Xn.y).multiplyScalar(-e/Xn.z),Xn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Xn.x,Xn.y).multiplyScalar(-e/Xn.z)}getViewSize(e,t){return this.getViewBounds(e,vl,xl),t.subVectors(xl,vl)}setViewOffset(e,t,i,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(xs*.5*this.fov)/this.zoom,i=2*t,s=this.aspect*i,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,t-=a.offsetY*i/c,s*=a.width/l,i*=a.height/c}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Fi=-90,Oi=1;class vh extends Ct{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new cn(Fi,Oi,e,t);s.layers=this.layers,this.add(s);const r=new cn(Fi,Oi,e,t);r.layers=this.layers,this.add(r);const a=new cn(Fi,Oi,e,t);a.layers=this.layers,this.add(a);const o=new cn(Fi,Oi,e,t);o.layers=this.layers,this.add(o);const l=new cn(Fi,Oi,e,t);l.layers=this.layers,this.add(l);const c=new cn(Fi,Oi,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,s,r,a,o,l]=t;for(const c of t)this.remove(c);if(e===wn)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Cr)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,d]=this.children,u=e.getRenderTarget(),h=e.getActiveCubeFace(),m=e.getActiveMipmapLevel(),_=e.xr.enabled;e.xr.enabled=!1;const x=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,s),e.render(t,r),e.setRenderTarget(i,1,s),e.render(t,a),e.setRenderTarget(i,2,s),e.render(t,o),e.setRenderTarget(i,3,s),e.render(t,l),e.setRenderTarget(i,4,s),e.render(t,c),i.texture.generateMipmaps=x,e.setRenderTarget(i,5,s),e.render(t,d),e.setRenderTarget(u,h,m),e.xr.enabled=_,i.texture.needsPMREMUpdate=!0}}class $c extends Qt{constructor(e=[],t=qi,i,s,r,a,o,l,c,d){super(e,t,i,s,r,a,o,l,c,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class xh extends bi{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},s=[i,i,i,i,i,i];this.texture=new $c(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new St(5,5,5),r=new ti({name:"CubemapFromEquirect",uniforms:Ji(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Kt,blending:Kn});r.uniforms.tEquirect.value=t;const a=new be(s,r),o=t.minFilter;return t.minFilter===xi&&(t.minFilter=En),new vh(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,i=!0,s=!0){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,i,s);e.setRenderTarget(r)}}class ps extends Ct{constructor(){super(),this.isGroup=!0,this.type="Group"}}const yh={type:"move"};class da{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ps,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ps,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new D,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new D),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ps,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new D,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new D),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let s=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const x of e.hand.values()){const f=t.getJointPose(x,i),p=this._getHandJoint(c,x);f!==null&&(p.matrix.fromArray(f.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=f.radius),p.visible=f!==null}const d=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],h=d.position.distanceTo(u.position),m=.02,_=.005;c.inputState.pinching&&h>m+_?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&h<=m-_&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,i),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(s=t.getPose(e.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(yh)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new ps;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}class bh extends Ct{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new _n,this.environmentIntensity=1,this.environmentRotation=new _n,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}const ua=new D,Mh=new D,Sh=new $e;class Zn{constructor(e=new D(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,s){return this.normal.set(e,t,i),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const s=ua.subVectors(i,t).cross(Mh.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const i=e.delta(ua),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(i,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||Sh.getNormalMatrix(e),s=this.coplanarPoint(ua).applyMatrix4(e),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const li=new Nr,Eh=new oe(.5,.5),sr=new D;class No{constructor(e=new Zn,t=new Zn,i=new Zn,s=new Zn,r=new Zn,a=new Zn){this.planes=[e,t,i,s,r,a]}set(e,t,i,s,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=wn,i=!1){const s=this.planes,r=e.elements,a=r[0],o=r[1],l=r[2],c=r[3],d=r[4],u=r[5],h=r[6],m=r[7],_=r[8],x=r[9],f=r[10],p=r[11],y=r[12],v=r[13],g=r[14],E=r[15];if(s[0].setComponents(c-a,m-d,p-_,E-y).normalize(),s[1].setComponents(c+a,m+d,p+_,E+y).normalize(),s[2].setComponents(c+o,m+u,p+x,E+v).normalize(),s[3].setComponents(c-o,m-u,p-x,E-v).normalize(),i)s[4].setComponents(l,h,f,g).normalize(),s[5].setComponents(c-l,m-h,p-f,E-g).normalize();else if(s[4].setComponents(c-l,m-h,p-f,E-g).normalize(),t===wn)s[5].setComponents(c+l,m+h,p+f,E+g).normalize();else if(t===Cr)s[5].setComponents(l,h,f,g).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),li.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),li.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(li)}intersectsSprite(e){li.center.set(0,0,0);const t=Eh.distanceTo(e.center);return li.radius=.7071067811865476+t,li.applyMatrix4(e.matrixWorld),this.intersectsSphere(li)}intersectsSphere(e){const t=this.planes,i=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const s=t[i];if(sr.x=s.normal.x>0?e.max.x:e.min.x,sr.y=s.normal.y>0?e.max.y:e.min.y,sr.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(sr)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Ki extends ts{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Xe(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Pr=new D,Lr=new D,yl=new dt,cs=new Fr,rr=new Nr,ha=new D,bl=new D;class On extends Ct{constructor(e=new Ft,t=new Ki){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[0];for(let s=1,r=t.count;s<r;s++)Pr.fromBufferAttribute(t,s-1),Lr.fromBufferAttribute(t,s),i[s]=i[s-1],i[s]+=Pr.distanceTo(Lr);e.setAttribute("lineDistance",new rt(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const i=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),rr.copy(i.boundingSphere),rr.applyMatrix4(s),rr.radius+=r,e.ray.intersectsSphere(rr)===!1)return;yl.copy(s).invert(),cs.copy(e.ray).applyMatrix4(yl);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,d=i.index,h=i.attributes.position;if(d!==null){const m=Math.max(0,a.start),_=Math.min(d.count,a.start+a.count);for(let x=m,f=_-1;x<f;x+=c){const p=d.getX(x),y=d.getX(x+1),v=ar(this,e,cs,l,p,y,x);v&&t.push(v)}if(this.isLineLoop){const x=d.getX(_-1),f=d.getX(m),p=ar(this,e,cs,l,x,f,_-1);p&&t.push(p)}}else{const m=Math.max(0,a.start),_=Math.min(h.count,a.start+a.count);for(let x=m,f=_-1;x<f;x+=c){const p=ar(this,e,cs,l,x,x+1,x);p&&t.push(p)}if(this.isLineLoop){const x=ar(this,e,cs,l,_-1,m,_-1);x&&t.push(x)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function ar(n,e,t,i,s,r,a){const o=n.geometry.attributes.position;if(Pr.fromBufferAttribute(o,s),Lr.fromBufferAttribute(o,r),t.distanceSqToSegment(Pr,Lr,ha,bl)>i)return;ha.applyMatrix4(n.matrixWorld);const c=e.ray.origin.distanceTo(ha);if(!(c<e.near||c>e.far))return{distance:c,point:bl.clone().applyMatrix4(n.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:n}}const Ml=new D,Sl=new D;class Dr extends On{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[];for(let s=0,r=t.count;s<r;s+=2)Ml.fromBufferAttribute(t,s),Sl.fromBufferAttribute(t,s+1),i[s]=s===0?0:i[s-1],i[s+1]=i[s]+Ml.distanceTo(Sl);e.setAttribute("lineDistance",new rt(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Wc extends Qt{constructor(e,t,i=yi,s,r,a,o=gn,l=gn,c,d=As,u=1){if(d!==As&&d!==Cs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const h={width:e,height:t,depth:u};super(h,s,r,a,o,l,d,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Io(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class jc extends Qt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class Ot extends Ft{constructor(e=1,t=1,i=1,s=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};const c=this;s=Math.floor(s),r=Math.floor(r);const d=[],u=[],h=[],m=[];let _=0;const x=[],f=i/2;let p=0;y(),a===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(d),this.setAttribute("position",new rt(u,3)),this.setAttribute("normal",new rt(h,3)),this.setAttribute("uv",new rt(m,2));function y(){const g=new D,E=new D;let T=0;const S=(t-e)/i;for(let A=0;A<=r;A++){const M=[],b=A/r,R=b*(t-e)+e;for(let U=0;U<=s;U++){const L=U/s,k=L*l+o,F=Math.sin(k),O=Math.cos(k);E.x=R*F,E.y=-b*i+f,E.z=R*O,u.push(E.x,E.y,E.z),g.set(F,S,O).normalize(),h.push(g.x,g.y,g.z),m.push(L,1-b),M.push(_++)}x.push(M)}for(let A=0;A<s;A++)for(let M=0;M<r;M++){const b=x[M][A],R=x[M+1][A],U=x[M+1][A+1],L=x[M][A+1];(e>0||M!==0)&&(d.push(b,R,L),T+=3),(t>0||M!==r-1)&&(d.push(R,U,L),T+=3)}c.addGroup(p,T,0),p+=T}function v(g){const E=_,T=new oe,S=new D;let A=0;const M=g===!0?e:t,b=g===!0?1:-1;for(let U=1;U<=s;U++)u.push(0,f*b,0),h.push(0,b,0),m.push(.5,.5),_++;const R=_;for(let U=0;U<=s;U++){const k=U/s*l+o,F=Math.cos(k),O=Math.sin(k);S.x=M*O,S.y=f*b,S.z=M*F,u.push(S.x,S.y,S.z),h.push(0,b,0),T.x=F*.5+.5,T.y=O*.5*b+.5,m.push(T.x,T.y),_++}for(let U=0;U<s;U++){const L=E+U,k=R+U;g===!0?d.push(k,k+1,L):d.push(k+1,k,L),A+=3}c.addGroup(p,A,g===!0?1:2),p+=A}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ot(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Fo extends Ft{constructor(e=[],t=[],i=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:i,detail:s};const r=[],a=[];o(s),c(i),d(),this.setAttribute("position",new rt(r,3)),this.setAttribute("normal",new rt(r.slice(),3)),this.setAttribute("uv",new rt(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(y){const v=new D,g=new D,E=new D;for(let T=0;T<t.length;T+=3)m(t[T+0],v),m(t[T+1],g),m(t[T+2],E),l(v,g,E,y)}function l(y,v,g,E){const T=E+1,S=[];for(let A=0;A<=T;A++){S[A]=[];const M=y.clone().lerp(g,A/T),b=v.clone().lerp(g,A/T),R=T-A;for(let U=0;U<=R;U++)U===0&&A===T?S[A][U]=M:S[A][U]=M.clone().lerp(b,U/R)}for(let A=0;A<T;A++)for(let M=0;M<2*(T-A)-1;M++){const b=Math.floor(M/2);M%2===0?(h(S[A][b+1]),h(S[A+1][b]),h(S[A][b])):(h(S[A][b+1]),h(S[A+1][b+1]),h(S[A+1][b]))}}function c(y){const v=new D;for(let g=0;g<r.length;g+=3)v.x=r[g+0],v.y=r[g+1],v.z=r[g+2],v.normalize().multiplyScalar(y),r[g+0]=v.x,r[g+1]=v.y,r[g+2]=v.z}function d(){const y=new D;for(let v=0;v<r.length;v+=3){y.x=r[v+0],y.y=r[v+1],y.z=r[v+2];const g=f(y)/2/Math.PI+.5,E=p(y)/Math.PI+.5;a.push(g,1-E)}_(),u()}function u(){for(let y=0;y<a.length;y+=6){const v=a[y+0],g=a[y+2],E=a[y+4],T=Math.max(v,g,E),S=Math.min(v,g,E);T>.9&&S<.1&&(v<.2&&(a[y+0]+=1),g<.2&&(a[y+2]+=1),E<.2&&(a[y+4]+=1))}}function h(y){r.push(y.x,y.y,y.z)}function m(y,v){const g=y*3;v.x=e[g+0],v.y=e[g+1],v.z=e[g+2]}function _(){const y=new D,v=new D,g=new D,E=new D,T=new oe,S=new oe,A=new oe;for(let M=0,b=0;M<r.length;M+=9,b+=6){y.set(r[M+0],r[M+1],r[M+2]),v.set(r[M+3],r[M+4],r[M+5]),g.set(r[M+6],r[M+7],r[M+8]),T.set(a[b+0],a[b+1]),S.set(a[b+2],a[b+3]),A.set(a[b+4],a[b+5]),E.copy(y).add(v).add(g).divideScalar(3);const R=f(E);x(T,b+0,y,R),x(S,b+2,v,R),x(A,b+4,g,R)}}function x(y,v,g,E){E<0&&y.x===1&&(a[v]=y.x-1),g.x===0&&g.z===0&&(a[v]=E/2/Math.PI+.5)}function f(y){return Math.atan2(y.z,-y.x)}function p(y){return Math.atan2(-y.y,Math.sqrt(y.x*y.x+y.z*y.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Fo(e.vertices,e.indices,e.radius,e.details)}}const or=new D,lr=new D,pa=new D,cr=new dn;class vo extends Ft{constructor(e=null,t=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:e,thresholdAngle:t},e!==null){const s=Math.pow(10,4),r=Math.cos(xs*t),a=e.getIndex(),o=e.getAttribute("position"),l=a?a.count:o.count,c=[0,0,0],d=["a","b","c"],u=new Array(3),h={},m=[];for(let _=0;_<l;_+=3){a?(c[0]=a.getX(_),c[1]=a.getX(_+1),c[2]=a.getX(_+2)):(c[0]=_,c[1]=_+1,c[2]=_+2);const{a:x,b:f,c:p}=cr;if(x.fromBufferAttribute(o,c[0]),f.fromBufferAttribute(o,c[1]),p.fromBufferAttribute(o,c[2]),cr.getNormal(pa),u[0]=`${Math.round(x.x*s)},${Math.round(x.y*s)},${Math.round(x.z*s)}`,u[1]=`${Math.round(f.x*s)},${Math.round(f.y*s)},${Math.round(f.z*s)}`,u[2]=`${Math.round(p.x*s)},${Math.round(p.y*s)},${Math.round(p.z*s)}`,!(u[0]===u[1]||u[1]===u[2]||u[2]===u[0]))for(let y=0;y<3;y++){const v=(y+1)%3,g=u[y],E=u[v],T=cr[d[y]],S=cr[d[v]],A=`${g}_${E}`,M=`${E}_${g}`;M in h&&h[M]?(pa.dot(h[M].normal)<=r&&(m.push(T.x,T.y,T.z),m.push(S.x,S.y,S.z)),h[M]=null):A in h||(h[A]={index0:c[y],index1:c[v],normal:pa.clone()})}}for(const _ in h)if(h[_]){const{index0:x,index1:f}=h[_];or.fromBufferAttribute(o,x),lr.fromBufferAttribute(o,f),m.push(or.x,or.y,or.z),m.push(lr.x,lr.y,lr.z)}this.setAttribute("position",new rt(m,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}}class Cn{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(e,t){const i=this.getUtoTmapping(e);return this.getPoint(i,t)}getPoints(e=5){const t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return t}getSpacedPoints(e=5){const t=[];for(let i=0;i<=e;i++)t.push(this.getPointAt(i/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let i,s=this.getPoint(0),r=0;t.push(0);for(let a=1;a<=e;a++)i=this.getPoint(a/e),r+=i.distanceTo(s),t.push(r),s=i;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){const i=this.getLengths();let s=0;const r=i.length;let a;t?a=t:a=e*i[r-1];let o=0,l=r-1,c;for(;o<=l;)if(s=Math.floor(o+(l-o)/2),c=i[s]-a,c<0)o=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,i[s]===a)return s/(r-1);const d=i[s],h=i[s+1]-d,m=(a-d)/h;return(s+m)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);const a=this.getPoint(s),o=this.getPoint(r),l=t||(a.isVector2?new oe:new D);return l.copy(o).sub(a).normalize(),l}getTangentAt(e,t){const i=this.getUtoTmapping(e);return this.getTangent(i,t)}computeFrenetFrames(e,t=!1){const i=new D,s=[],r=[],a=[],o=new D,l=new dt;for(let m=0;m<=e;m++){const _=m/e;s[m]=this.getTangentAt(_,new D)}r[0]=new D,a[0]=new D;let c=Number.MAX_VALUE;const d=Math.abs(s[0].x),u=Math.abs(s[0].y),h=Math.abs(s[0].z);d<=c&&(c=d,i.set(1,0,0)),u<=c&&(c=u,i.set(0,1,0)),h<=c&&i.set(0,0,1),o.crossVectors(s[0],i).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let m=1;m<=e;m++){if(r[m]=r[m-1].clone(),a[m]=a[m-1].clone(),o.crossVectors(s[m-1],s[m]),o.length()>Number.EPSILON){o.normalize();const _=Math.acos(je(s[m-1].dot(s[m]),-1,1));r[m].applyMatrix4(l.makeRotationAxis(o,_))}a[m].crossVectors(s[m],r[m])}if(t===!0){let m=Math.acos(je(r[0].dot(r[e]),-1,1));m/=e,s[0].dot(o.crossVectors(r[0],r[e]))>0&&(m=-m);for(let _=1;_<=e;_++)r[_].applyMatrix4(l.makeRotationAxis(s[_],m*_)),a[_].crossVectors(s[_],r[_])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class Oo extends Cn{constructor(e=0,t=0,i=1,s=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=i,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(e,t=new oe){const i=t,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);const o=this.aStartAngle+e*r;let l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const d=Math.cos(this.aRotation),u=Math.sin(this.aRotation),h=l-this.aX,m=c-this.aY;l=h*d-m*u+this.aX,c=h*u+m*d+this.aY}return i.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class wh extends Oo{constructor(e,t,i,s,r,a){super(e,t,i,i,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function zo(){let n=0,e=0,t=0,i=0;function s(r,a,o,l){n=r,e=o,t=-3*r+3*a-2*o-l,i=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){s(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,d,u){let h=(a-r)/c-(o-r)/(c+d)+(o-a)/d,m=(o-a)/d-(l-a)/(d+u)+(l-o)/u;h*=d,m*=d,s(a,o,h,m)},calc:function(r){const a=r*r,o=a*r;return n+e*r+t*a+i*o}}}const dr=new D,fa=new zo,ma=new zo,ga=new zo;class Th extends Cn{constructor(e=[],t=!1,i="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=i,this.tension=s}getPoint(e,t=new D){const i=t,s=this.points,r=s.length,a=(r-(this.closed?0:1))*e;let o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,d;this.closed||o>0?c=s[(o-1)%r]:(dr.subVectors(s[0],s[1]).add(s[0]),c=dr);const u=s[o%r],h=s[(o+1)%r];if(this.closed||o+2<r?d=s[(o+2)%r]:(dr.subVectors(s[r-1],s[r-2]).add(s[r-1]),d=dr),this.curveType==="centripetal"||this.curveType==="chordal"){const m=this.curveType==="chordal"?.5:.25;let _=Math.pow(c.distanceToSquared(u),m),x=Math.pow(u.distanceToSquared(h),m),f=Math.pow(h.distanceToSquared(d),m);x<1e-4&&(x=1),_<1e-4&&(_=x),f<1e-4&&(f=x),fa.initNonuniformCatmullRom(c.x,u.x,h.x,d.x,_,x,f),ma.initNonuniformCatmullRom(c.y,u.y,h.y,d.y,_,x,f),ga.initNonuniformCatmullRom(c.z,u.z,h.z,d.z,_,x,f)}else this.curveType==="catmullrom"&&(fa.initCatmullRom(c.x,u.x,h.x,d.x,this.tension),ma.initCatmullRom(c.y,u.y,h.y,d.y,this.tension),ga.initCatmullRom(c.z,u.z,h.z,d.z,this.tension));return i.set(fa.calc(l),ma.calc(l),ga.calc(l)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){const s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const s=e.points[t];this.points.push(new D().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function El(n,e,t,i,s){const r=(i-e)*.5,a=(s-t)*.5,o=n*n,l=n*o;return(2*t-2*i+r+a)*l+(-3*t+3*i-2*r-a)*o+r*n+t}function Ah(n,e){const t=1-n;return t*t*e}function Ch(n,e){return 2*(1-n)*n*e}function Rh(n,e){return n*n*e}function ys(n,e,t,i){return Ah(n,e)+Ch(n,t)+Rh(n,i)}function Ph(n,e){const t=1-n;return t*t*t*e}function Lh(n,e){const t=1-n;return 3*t*t*n*e}function Dh(n,e){return 3*(1-n)*n*n*e}function Ih(n,e){return n*n*n*e}function bs(n,e,t,i,s){return Ph(n,e)+Lh(n,t)+Dh(n,i)+Ih(n,s)}class Xc extends Cn{constructor(e=new oe,t=new oe,i=new oe,s=new oe){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=i,this.v3=s}getPoint(e,t=new oe){const i=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return i.set(bs(e,s.x,r.x,a.x,o.x),bs(e,s.y,r.y,a.y,o.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class Uh extends Cn{constructor(e=new D,t=new D,i=new D,s=new D){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=i,this.v3=s}getPoint(e,t=new D){const i=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return i.set(bs(e,s.x,r.x,a.x,o.x),bs(e,s.y,r.y,a.y,o.y),bs(e,s.z,r.z,a.z,o.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class qc extends Cn{constructor(e=new oe,t=new oe){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new oe){const i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new oe){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Nh extends Cn{constructor(e=new D,t=new D){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new D){const i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new D){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Yc extends Cn{constructor(e=new oe,t=new oe,i=new oe){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new oe){const i=t,s=this.v0,r=this.v1,a=this.v2;return i.set(ys(e,s.x,r.x,a.x),ys(e,s.y,r.y,a.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Fh extends Cn{constructor(e=new D,t=new D,i=new D){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new D){const i=t,s=this.v0,r=this.v1,a=this.v2;return i.set(ys(e,s.x,r.x,a.x),ys(e,s.y,r.y,a.y),ys(e,s.z,r.z,a.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Zc extends Cn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new oe){const i=t,s=this.points,r=(s.length-1)*e,a=Math.floor(r),o=r-a,l=s[a===0?a:a-1],c=s[a],d=s[a>s.length-2?s.length-1:a+1],u=s[a>s.length-3?s.length-1:a+2];return i.set(El(o,l.x,c.x,d.x,u.x),El(o,l.y,c.y,d.y,u.y)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const s=e.points[t];this.points.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){const s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const s=e.points[t];this.points.push(new oe().fromArray(s))}return this}}var xo=Object.freeze({__proto__:null,ArcCurve:wh,CatmullRomCurve3:Th,CubicBezierCurve:Xc,CubicBezierCurve3:Uh,EllipseCurve:Oo,LineCurve:qc,LineCurve3:Nh,QuadraticBezierCurve:Yc,QuadraticBezierCurve3:Fh,SplineCurve:Zc});class Oh extends Cn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const i=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new xo[i](t,e))}return this}getPoint(e,t){const i=e*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=i){const a=s[r]-i,o=this.curves[r],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,t)}r++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let i=0,s=this.curves.length;i<s;i++)t+=this.curves[i].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let i;for(let s=0,r=this.curves;s<r.length;s++){const a=r[s],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,l=a.getPoints(o);for(let c=0;c<l.length;c++){const d=l[c];i&&i.equals(d)||(t.push(d),i=d)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){const s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,i=this.curves.length;t<i;t++){const s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){const s=e.curves[t];this.curves.push(new xo[s.type]().fromJSON(s))}return this}}class yo extends Oh{constructor(e){super(),this.type="Path",this.currentPoint=new oe,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,i=e.length;t<i;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const i=new qc(this.currentPoint.clone(),new oe(e,t));return this.curves.push(i),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,i,s){const r=new Yc(this.currentPoint.clone(),new oe(e,t),new oe(i,s));return this.curves.push(r),this.currentPoint.set(i,s),this}bezierCurveTo(e,t,i,s,r,a){const o=new Xc(this.currentPoint.clone(),new oe(e,t),new oe(i,s),new oe(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),i=new Zc(t);return this.curves.push(i),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,i,s,r,a){const o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+o,t+l,i,s,r,a),this}absarc(e,t,i,s,r,a){return this.absellipse(e,t,i,i,s,r,a),this}ellipse(e,t,i,s,r,a,o,l){const c=this.currentPoint.x,d=this.currentPoint.y;return this.absellipse(e+c,t+d,i,s,r,a,o,l),this}absellipse(e,t,i,s,r,a,o,l){const c=new Oo(e,t,i,s,r,a,o,l);if(this.curves.length>0){const u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);const d=c.getPoint(1);return this.currentPoint.copy(d),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class Er extends yo{constructor(e){super(e),this.uuid=es(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let i=0,s=this.holes.length;i<s;i++)t[i]=this.holes[i].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){const s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,i=this.holes.length;t<i;t++){const s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){const s=e.holes[t];this.holes.push(new yo().fromJSON(s))}return this}}function zh(n,e,t=2){const i=e&&e.length,s=i?e[0]*t:n.length;let r=Jc(n,0,s,t,!0);const a=[];if(!r||r.next===r.prev)return a;let o,l,c;if(i&&(r=Vh(n,e,r,t)),n.length>80*t){o=1/0,l=1/0;let d=-1/0,u=-1/0;for(let h=t;h<s;h+=t){const m=n[h],_=n[h+1];m<o&&(o=m),_<l&&(l=_),m>d&&(d=m),_>u&&(u=_)}c=Math.max(d-o,u-l),c=c!==0?32767/c:0}return Ps(r,a,t,o,l,c,0),a}function Jc(n,e,t,i,s){let r;if(s===ep(n,e,t,i)>0)for(let a=e;a<t;a+=i)r=wl(a/i|0,n[a],n[a+1],r);else for(let a=t-i;a>=e;a-=i)r=wl(a/i|0,n[a],n[a+1],r);return r&&Qi(r,r.next)&&(Ds(r),r=r.next),r}function Mi(n,e){if(!n)return n;e||(e=n);let t=n,i;do if(i=!1,!t.steiner&&(Qi(t,t.next)||Et(t.prev,t,t.next)===0)){if(Ds(t),t=e=t.prev,t===t.next)break;i=!0}else t=t.next;while(i||t!==e);return e}function Ps(n,e,t,i,s,r,a){if(!n)return;!a&&r&&qh(n,i,s,r);let o=n;for(;n.prev!==n.next;){const l=n.prev,c=n.next;if(r?Bh(n,i,s,r):kh(n)){e.push(l.i,n.i,c.i),Ds(n),n=c.next,o=c.next;continue}if(n=c,n===o){a?a===1?(n=Hh(Mi(n),e),Ps(n,e,t,i,s,r,2)):a===2&&Gh(n,e,t,i,s,r):Ps(Mi(n),e,t,i,s,r,1);break}}}function kh(n){const e=n.prev,t=n,i=n.next;if(Et(e,t,i)>=0)return!1;const s=e.x,r=t.x,a=i.x,o=e.y,l=t.y,c=i.y,d=Math.min(s,r,a),u=Math.min(o,l,c),h=Math.max(s,r,a),m=Math.max(o,l,c);let _=i.next;for(;_!==e;){if(_.x>=d&&_.x<=h&&_.y>=u&&_.y<=m&&fs(s,o,r,l,a,c,_.x,_.y)&&Et(_.prev,_,_.next)>=0)return!1;_=_.next}return!0}function Bh(n,e,t,i){const s=n.prev,r=n,a=n.next;if(Et(s,r,a)>=0)return!1;const o=s.x,l=r.x,c=a.x,d=s.y,u=r.y,h=a.y,m=Math.min(o,l,c),_=Math.min(d,u,h),x=Math.max(o,l,c),f=Math.max(d,u,h),p=bo(m,_,e,t,i),y=bo(x,f,e,t,i);let v=n.prevZ,g=n.nextZ;for(;v&&v.z>=p&&g&&g.z<=y;){if(v.x>=m&&v.x<=x&&v.y>=_&&v.y<=f&&v!==s&&v!==a&&fs(o,d,l,u,c,h,v.x,v.y)&&Et(v.prev,v,v.next)>=0||(v=v.prevZ,g.x>=m&&g.x<=x&&g.y>=_&&g.y<=f&&g!==s&&g!==a&&fs(o,d,l,u,c,h,g.x,g.y)&&Et(g.prev,g,g.next)>=0))return!1;g=g.nextZ}for(;v&&v.z>=p;){if(v.x>=m&&v.x<=x&&v.y>=_&&v.y<=f&&v!==s&&v!==a&&fs(o,d,l,u,c,h,v.x,v.y)&&Et(v.prev,v,v.next)>=0)return!1;v=v.prevZ}for(;g&&g.z<=y;){if(g.x>=m&&g.x<=x&&g.y>=_&&g.y<=f&&g!==s&&g!==a&&fs(o,d,l,u,c,h,g.x,g.y)&&Et(g.prev,g,g.next)>=0)return!1;g=g.nextZ}return!0}function Hh(n,e){let t=n;do{const i=t.prev,s=t.next.next;!Qi(i,s)&&Qc(i,t,t.next,s)&&Ls(i,s)&&Ls(s,i)&&(e.push(i.i,t.i,s.i),Ds(t),Ds(t.next),t=n=s),t=t.next}while(t!==n);return Mi(t)}function Gh(n,e,t,i,s,r){let a=n;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&Jh(a,o)){let l=ed(a,o);a=Mi(a,a.next),l=Mi(l,l.next),Ps(a,e,t,i,s,r,0),Ps(l,e,t,i,s,r,0);return}o=o.next}a=a.next}while(a!==n)}function Vh(n,e,t,i){const s=[];for(let r=0,a=e.length;r<a;r++){const o=e[r]*i,l=r<a-1?e[r+1]*i:n.length,c=Jc(n,o,l,i,!1);c===c.next&&(c.steiner=!0),s.push(Zh(c))}s.sort($h);for(let r=0;r<s.length;r++)t=Wh(s[r],t);return t}function $h(n,e){let t=n.x-e.x;if(t===0&&(t=n.y-e.y,t===0)){const i=(n.next.y-n.y)/(n.next.x-n.x),s=(e.next.y-e.y)/(e.next.x-e.x);t=i-s}return t}function Wh(n,e){const t=jh(n,e);if(!t)return e;const i=ed(t,n);return Mi(i,i.next),Mi(t,t.next)}function jh(n,e){let t=e;const i=n.x,s=n.y;let r=-1/0,a;if(Qi(n,t))return t;do{if(Qi(n,t.next))return t.next;if(s<=t.y&&s>=t.next.y&&t.next.y!==t.y){const u=t.x+(s-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(u<=i&&u>r&&(r=u,a=t.x<t.next.x?t:t.next,u===i))return a}t=t.next}while(t!==e);if(!a)return null;const o=a,l=a.x,c=a.y;let d=1/0;t=a;do{if(i>=t.x&&t.x>=l&&i!==t.x&&Kc(s<c?i:r,s,l,c,s<c?r:i,s,t.x,t.y)){const u=Math.abs(s-t.y)/(i-t.x);Ls(t,n)&&(u<d||u===d&&(t.x>a.x||t.x===a.x&&Xh(a,t)))&&(a=t,d=u)}t=t.next}while(t!==o);return a}function Xh(n,e){return Et(n.prev,n,e.prev)<0&&Et(e.next,n,n.next)<0}function qh(n,e,t,i){let s=n;do s.z===0&&(s.z=bo(s.x,s.y,e,t,i)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==n);s.prevZ.nextZ=null,s.prevZ=null,Yh(s)}function Yh(n){let e,t=1;do{let i=n,s;n=null;let r=null;for(e=0;i;){e++;let a=i,o=0;for(let c=0;c<t&&(o++,a=a.nextZ,!!a);c++);let l=t;for(;o>0||l>0&&a;)o!==0&&(l===0||!a||i.z<=a.z)?(s=i,i=i.nextZ,o--):(s=a,a=a.nextZ,l--),r?r.nextZ=s:n=s,s.prevZ=r,r=s;i=a}r.nextZ=null,t*=2}while(e>1);return n}function bo(n,e,t,i,s){return n=(n-t)*s|0,e=(e-i)*s|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,n|e<<1}function Zh(n){let e=n,t=n;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==n);return t}function Kc(n,e,t,i,s,r,a,o){return(s-a)*(e-o)>=(n-a)*(r-o)&&(n-a)*(i-o)>=(t-a)*(e-o)&&(t-a)*(r-o)>=(s-a)*(i-o)}function fs(n,e,t,i,s,r,a,o){return!(n===a&&e===o)&&Kc(n,e,t,i,s,r,a,o)}function Jh(n,e){return n.next.i!==e.i&&n.prev.i!==e.i&&!Kh(n,e)&&(Ls(n,e)&&Ls(e,n)&&Qh(n,e)&&(Et(n.prev,n,e.prev)||Et(n,e.prev,e))||Qi(n,e)&&Et(n.prev,n,n.next)>0&&Et(e.prev,e,e.next)>0)}function Et(n,e,t){return(e.y-n.y)*(t.x-e.x)-(e.x-n.x)*(t.y-e.y)}function Qi(n,e){return n.x===e.x&&n.y===e.y}function Qc(n,e,t,i){const s=hr(Et(n,e,t)),r=hr(Et(n,e,i)),a=hr(Et(t,i,n)),o=hr(Et(t,i,e));return!!(s!==r&&a!==o||s===0&&ur(n,t,e)||r===0&&ur(n,i,e)||a===0&&ur(t,n,i)||o===0&&ur(t,e,i))}function ur(n,e,t){return e.x<=Math.max(n.x,t.x)&&e.x>=Math.min(n.x,t.x)&&e.y<=Math.max(n.y,t.y)&&e.y>=Math.min(n.y,t.y)}function hr(n){return n>0?1:n<0?-1:0}function Kh(n,e){let t=n;do{if(t.i!==n.i&&t.next.i!==n.i&&t.i!==e.i&&t.next.i!==e.i&&Qc(t,t.next,n,e))return!0;t=t.next}while(t!==n);return!1}function Ls(n,e){return Et(n.prev,n,n.next)<0?Et(n,e,n.next)>=0&&Et(n,n.prev,e)>=0:Et(n,e,n.prev)<0||Et(n,n.next,e)<0}function Qh(n,e){let t=n,i=!1;const s=(n.x+e.x)/2,r=(n.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&s<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(i=!i),t=t.next;while(t!==n);return i}function ed(n,e){const t=Mo(n.i,n.x,n.y),i=Mo(e.i,e.x,e.y),s=n.next,r=e.prev;return n.next=e,e.prev=n,t.next=s,s.prev=t,i.next=t,t.prev=i,r.next=i,i.prev=r,i}function wl(n,e,t,i){const s=Mo(n,e,t);return i?(s.next=i.next,s.prev=i,i.next.prev=s,i.next=s):(s.prev=s,s.next=s),s}function Ds(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function Mo(n,e,t){return{i:n,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function ep(n,e,t,i){let s=0;for(let r=e,a=t-i;r<t;r+=i)s+=(n[a]-n[r])*(n[r+1]+n[a+1]),a=r;return s}class tp{static triangulate(e,t,i=2){return zh(e,t,i)}}class Hi{static area(e){const t=e.length;let i=0;for(let s=t-1,r=0;r<t;s=r++)i+=e[s].x*e[r].y-e[r].x*e[s].y;return i*.5}static isClockWise(e){return Hi.area(e)<0}static triangulateShape(e,t){const i=[],s=[],r=[];Tl(e),Al(i,e);let a=e.length;t.forEach(Tl);for(let l=0;l<t.length;l++)s.push(a),a+=t[l].length,Al(i,t[l]);const o=tp.triangulate(i,s);for(let l=0;l<o.length;l+=3)r.push(o.slice(l,l+3));return r}}function Tl(n){const e=n.length;e>2&&n[e-1].equals(n[0])&&n.pop()}function Al(n,e){for(let t=0;t<e.length;t++)n.push(e[t].x),n.push(e[t].y)}class ko extends Ft{constructor(e=new Er([new oe(.5,.5),new oe(-.5,.5),new oe(-.5,-.5),new oe(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];const i=this,s=[],r=[];for(let o=0,l=e.length;o<l;o++){const c=e[o];a(c)}this.setAttribute("position",new rt(s,3)),this.setAttribute("uv",new rt(r,2)),this.computeVertexNormals();function a(o){const l=[],c=t.curveSegments!==void 0?t.curveSegments:12,d=t.steps!==void 0?t.steps:1,u=t.depth!==void 0?t.depth:1;let h=t.bevelEnabled!==void 0?t.bevelEnabled:!0,m=t.bevelThickness!==void 0?t.bevelThickness:.2,_=t.bevelSize!==void 0?t.bevelSize:m-.1,x=t.bevelOffset!==void 0?t.bevelOffset:0,f=t.bevelSegments!==void 0?t.bevelSegments:3;const p=t.extrudePath,y=t.UVGenerator!==void 0?t.UVGenerator:np;let v,g=!1,E,T,S,A;p&&(v=p.getSpacedPoints(d),g=!0,h=!1,E=p.computeFrenetFrames(d,!1),T=new D,S=new D,A=new D),h||(f=0,m=0,_=0,x=0);const M=o.extractPoints(c);let b=M.shape;const R=M.holes;if(!Hi.isClockWise(b)){b=b.reverse();for(let ne=0,K=R.length;ne<K;ne++){const J=R[ne];Hi.isClockWise(J)&&(R[ne]=J.reverse())}}function L(ne){const J=10000000000000001e-36;let Z=ne[0];for(let ue=1;ue<=ne.length;ue++){const se=ue%ne.length,he=ne[se],He=he.x-Z.x,ke=he.y-Z.y,P=He*He+ke*ke,w=Math.max(Math.abs(he.x),Math.abs(he.y),Math.abs(Z.x),Math.abs(Z.y)),V=J*w*w;if(P<=V){ne.splice(se,1),ue--;continue}Z=he}}L(b),R.forEach(L);const k=R.length,F=b;for(let ne=0;ne<k;ne++){const K=R[ne];b=b.concat(K)}function O(ne,K,J){return K||console.error("THREE.ExtrudeGeometry: vec does not exist"),ne.clone().addScaledVector(K,J)}const H=b.length;function $(ne,K,J){let Z,ue,se;const he=ne.x-K.x,He=ne.y-K.y,ke=J.x-ne.x,P=J.y-ne.y,w=he*he+He*He,V=he*P-He*ke;if(Math.abs(V)>Number.EPSILON){const X=Math.sqrt(w),te=Math.sqrt(ke*ke+P*P),q=K.x-He/X,Pe=K.y+he/X,de=J.x-P/te,Ae=J.y+ke/te,Ce=((de-q)*P-(Ae-Pe)*ke)/(he*P-He*ke);Z=q+he*Ce-ne.x,ue=Pe+He*Ce-ne.y;const re=Z*Z+ue*ue;if(re<=2)return new oe(Z,ue);se=Math.sqrt(re/2)}else{let X=!1;he>Number.EPSILON?ke>Number.EPSILON&&(X=!0):he<-Number.EPSILON?ke<-Number.EPSILON&&(X=!0):Math.sign(He)===Math.sign(P)&&(X=!0),X?(Z=-He,ue=he,se=Math.sqrt(w)):(Z=he,ue=He,se=Math.sqrt(w/2))}return new oe(Z/se,ue/se)}const ee=[];for(let ne=0,K=F.length,J=K-1,Z=ne+1;ne<K;ne++,J++,Z++)J===K&&(J=0),Z===K&&(Z=0),ee[ne]=$(F[ne],F[J],F[Z]);const pe=[];let ge,Oe=ee.concat();for(let ne=0,K=k;ne<K;ne++){const J=R[ne];ge=[];for(let Z=0,ue=J.length,se=ue-1,he=Z+1;Z<ue;Z++,se++,he++)se===ue&&(se=0),he===ue&&(he=0),ge[Z]=$(J[Z],J[se],J[he]);pe.push(ge),Oe=Oe.concat(ge)}let qe;if(f===0)qe=Hi.triangulateShape(F,R);else{const ne=[],K=[];for(let J=0;J<f;J++){const Z=J/f,ue=m*Math.cos(Z*Math.PI/2),se=_*Math.sin(Z*Math.PI/2)+x;for(let he=0,He=F.length;he<He;he++){const ke=O(F[he],ee[he],se);De(ke.x,ke.y,-ue),Z===0&&ne.push(ke)}for(let he=0,He=k;he<He;he++){const ke=R[he];ge=pe[he];const P=[];for(let w=0,V=ke.length;w<V;w++){const X=O(ke[w],ge[w],se);De(X.x,X.y,-ue),Z===0&&P.push(X)}Z===0&&K.push(P)}}qe=Hi.triangulateShape(ne,K)}const Qe=qe.length,Ke=_+x;for(let ne=0;ne<H;ne++){const K=h?O(b[ne],Oe[ne],Ke):b[ne];g?(S.copy(E.normals[0]).multiplyScalar(K.x),T.copy(E.binormals[0]).multiplyScalar(K.y),A.copy(v[0]).add(S).add(T),De(A.x,A.y,A.z)):De(K.x,K.y,0)}for(let ne=1;ne<=d;ne++)for(let K=0;K<H;K++){const J=h?O(b[K],Oe[K],Ke):b[K];g?(S.copy(E.normals[ne]).multiplyScalar(J.x),T.copy(E.binormals[ne]).multiplyScalar(J.y),A.copy(v[ne]).add(S).add(T),De(A.x,A.y,A.z)):De(J.x,J.y,u/d*ne)}for(let ne=f-1;ne>=0;ne--){const K=ne/f,J=m*Math.cos(K*Math.PI/2),Z=_*Math.sin(K*Math.PI/2)+x;for(let ue=0,se=F.length;ue<se;ue++){const he=O(F[ue],ee[ue],Z);De(he.x,he.y,u+J)}for(let ue=0,se=R.length;ue<se;ue++){const he=R[ue];ge=pe[ue];for(let He=0,ke=he.length;He<ke;He++){const P=O(he[He],ge[He],Z);g?De(P.x,P.y+v[d-1].y,v[d-1].x+J):De(P.x,P.y,u+J)}}}Y(),ie();function Y(){const ne=s.length/3;if(h){let K=0,J=H*K;for(let Z=0;Z<Qe;Z++){const ue=qe[Z];Te(ue[2]+J,ue[1]+J,ue[0]+J)}K=d+f*2,J=H*K;for(let Z=0;Z<Qe;Z++){const ue=qe[Z];Te(ue[0]+J,ue[1]+J,ue[2]+J)}}else{for(let K=0;K<Qe;K++){const J=qe[K];Te(J[2],J[1],J[0])}for(let K=0;K<Qe;K++){const J=qe[K];Te(J[0]+H*d,J[1]+H*d,J[2]+H*d)}}i.addGroup(ne,s.length/3-ne,0)}function ie(){const ne=s.length/3;let K=0;Se(F,K),K+=F.length;for(let J=0,Z=R.length;J<Z;J++){const ue=R[J];Se(ue,K),K+=ue.length}i.addGroup(ne,s.length/3-ne,1)}function Se(ne,K){let J=ne.length;for(;--J>=0;){const Z=J;let ue=J-1;ue<0&&(ue=ne.length-1);for(let se=0,he=d+f*2;se<he;se++){const He=H*se,ke=H*(se+1),P=K+Z+He,w=K+ue+He,V=K+ue+ke,X=K+Z+ke;Ye(P,w,V,X)}}}function De(ne,K,J){l.push(ne),l.push(K),l.push(J)}function Te(ne,K,J){mt(ne),mt(K),mt(J);const Z=s.length/3,ue=y.generateTopUV(i,s,Z-3,Z-2,Z-1);I(ue[0]),I(ue[1]),I(ue[2])}function Ye(ne,K,J,Z){mt(ne),mt(K),mt(Z),mt(K),mt(J),mt(Z);const ue=s.length/3,se=y.generateSideWallUV(i,s,ue-6,ue-3,ue-2,ue-1);I(se[0]),I(se[1]),I(se[3]),I(se[1]),I(se[2]),I(se[3])}function mt(ne){s.push(l[ne*3+0]),s.push(l[ne*3+1]),s.push(l[ne*3+2])}function I(ne){r.push(ne.x),r.push(ne.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes,i=this.parameters.options;return ip(t,i,e)}static fromJSON(e,t){const i=[];for(let r=0,a=e.shapes.length;r<a;r++){const o=t[e.shapes[r]];i.push(o)}const s=e.options.extrudePath;return s!==void 0&&(e.options.extrudePath=new xo[s.type]().fromJSON(s)),new ko(i,e.options)}}const np={generateTopUV:function(n,e,t,i,s){const r=e[t*3],a=e[t*3+1],o=e[i*3],l=e[i*3+1],c=e[s*3],d=e[s*3+1];return[new oe(r,a),new oe(o,l),new oe(c,d)]},generateSideWallUV:function(n,e,t,i,s,r){const a=e[t*3],o=e[t*3+1],l=e[t*3+2],c=e[i*3],d=e[i*3+1],u=e[i*3+2],h=e[s*3],m=e[s*3+1],_=e[s*3+2],x=e[r*3],f=e[r*3+1],p=e[r*3+2];return Math.abs(o-d)<Math.abs(a-c)?[new oe(a,1-l),new oe(c,1-u),new oe(h,1-_),new oe(x,1-p)]:[new oe(o,1-l),new oe(d,1-u),new oe(m,1-_),new oe(f,1-p)]}};function ip(n,e,t){if(t.shapes=[],Array.isArray(n))for(let i=0,s=n.length;i<s;i++){const r=n[i];t.shapes.push(r.uuid)}else t.shapes.push(n.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}class Gi extends Fo{constructor(e=1,t=0){const i=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],s=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(i,s,e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Gi(e.radius,e.detail)}}class Ns extends Ft{constructor(e=1,t=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:s};const r=e/2,a=t/2,o=Math.floor(i),l=Math.floor(s),c=o+1,d=l+1,u=e/o,h=t/l,m=[],_=[],x=[],f=[];for(let p=0;p<d;p++){const y=p*h-a;for(let v=0;v<c;v++){const g=v*u-r;_.push(g,-y,0),x.push(0,0,1),f.push(v/o),f.push(1-p/l)}}for(let p=0;p<l;p++)for(let y=0;y<o;y++){const v=y+c*p,g=y+c*(p+1),E=y+1+c*(p+1),T=y+1+c*p;m.push(v,g,T),m.push(g,E,T)}this.setIndex(m),this.setAttribute("position",new rt(_,3)),this.setAttribute("normal",new rt(x,3)),this.setAttribute("uv",new rt(f,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ns(e.width,e.height,e.widthSegments,e.heightSegments)}}class Fs extends Ft{constructor(e=1,t=32,i=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));const l=Math.min(a+o,Math.PI);let c=0;const d=[],u=new D,h=new D,m=[],_=[],x=[],f=[];for(let p=0;p<=i;p++){const y=[],v=p/i;let g=0;p===0&&a===0?g=.5/t:p===i&&l===Math.PI&&(g=-.5/t);for(let E=0;E<=t;E++){const T=E/t;u.x=-e*Math.cos(s+T*r)*Math.sin(a+v*o),u.y=e*Math.cos(a+v*o),u.z=e*Math.sin(s+T*r)*Math.sin(a+v*o),_.push(u.x,u.y,u.z),h.copy(u).normalize(),x.push(h.x,h.y,h.z),f.push(T+g,1-v),y.push(c++)}d.push(y)}for(let p=0;p<i;p++)for(let y=0;y<t;y++){const v=d[p][y+1],g=d[p][y],E=d[p+1][y],T=d[p+1][y+1];(p!==0||a>0)&&m.push(v,g,T),(p!==i-1||l<Math.PI)&&m.push(g,E,T)}this.setIndex(m),this.setAttribute("position",new rt(_,3)),this.setAttribute("normal",new rt(x,3)),this.setAttribute("uv",new rt(f,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Fs(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class gi extends Ft{constructor(e=1,t=.4,i=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:i,tubularSegments:s,arc:r},i=Math.floor(i),s=Math.floor(s);const a=[],o=[],l=[],c=[],d=new D,u=new D,h=new D;for(let m=0;m<=i;m++)for(let _=0;_<=s;_++){const x=_/s*r,f=m/i*Math.PI*2;u.x=(e+t*Math.cos(f))*Math.cos(x),u.y=(e+t*Math.cos(f))*Math.sin(x),u.z=t*Math.sin(f),o.push(u.x,u.y,u.z),d.x=e*Math.cos(x),d.y=e*Math.sin(x),h.subVectors(u,d).normalize(),l.push(h.x,h.y,h.z),c.push(_/s),c.push(m/i)}for(let m=1;m<=i;m++)for(let _=1;_<=s;_++){const x=(s+1)*m+_-1,f=(s+1)*(m-1)+_-1,p=(s+1)*(m-1)+_,y=(s+1)*m+_;a.push(x,f,y),a.push(f,p,y)}this.setIndex(a),this.setAttribute("position",new rt(o,3)),this.setAttribute("normal",new rt(l,3)),this.setAttribute("uv",new rt(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new gi(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class sp extends ts{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Xe(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Xe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Nc,this.normalScale=new oe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new _n,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class rp extends ts{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Ou,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class ap extends ts{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class td extends Ct{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Xe(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class op extends td{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Ct.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Xe(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const _a=new dt,Cl=new D,Rl=new D;class lp{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new oe(512,512),this.mapType=An,this.map=null,this.mapPass=null,this.matrix=new dt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new No,this._frameExtents=new oe(1,1),this._viewportCount=1,this._viewports=[new Tt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,i=this.matrix;Cl.setFromMatrixPosition(e.matrixWorld),t.position.copy(Cl),Rl.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Rl),t.updateMatrixWorld(),_a.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(_a,t.coordinateSystem,t.reversedDepth),t.reversedDepth?i.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(_a)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class nd extends Vc{constructor(e=-1,t=1,i=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=i-e,a=i+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=d*this.view.offsetY,l=o-d*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class cp extends lp{constructor(){super(new nd(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class dp extends td{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ct.DEFAULT_UP),this.updateMatrix(),this.target=new Ct,this.shadow=new cp}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class up extends cn{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}const Pl=new dt;class id{constructor(e,t,i=0,s=1/0){this.ray=new Fr(e,t),this.near=i,this.far=s,this.camera=null,this.layers=new Uo,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Pl.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Pl),this}intersectObject(e,t=!0,i=[]){return So(e,this,i,t),i.sort(Ll),i}intersectObjects(e,t=!0,i=[]){for(let s=0,r=e.length;s<r;s++)So(e[s],this,i,t);return i.sort(Ll),i}}function Ll(n,e){return n.distance-e.distance}function So(n,e,t,i){let s=!0;if(n.layers.test(e.layers)&&n.raycast(e,t)===!1&&(s=!1),s===!0&&i===!0){const r=n.children;for(let a=0,o=r.length;a<o;a++)So(r[a],e,t,!0)}}class Dl{constructor(e=1,t=0,i=0){this.radius=e,this.phi=t,this.theta=i}set(e,t,i){return this.radius=e,this.phi=t,this.theta=i,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=je(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,i){return this.radius=Math.sqrt(e*e+t*t+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,i),this.phi=Math.acos(je(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class hp extends Dr{constructor(e=10,t=10,i=4473924,s=8947848){i=new Xe(i),s=new Xe(s);const r=t/2,a=e/t,o=e/2,l=[],c=[];for(let h=0,m=0,_=-o;h<=t;h++,_+=a){l.push(-o,0,_,o,0,_),l.push(_,0,-o,_,0,o);const x=h===r?i:s;x.toArray(c,m),m+=3,x.toArray(c,m),m+=3,x.toArray(c,m),m+=3,x.toArray(c,m),m+=3}const d=new Ft;d.setAttribute("position",new rt(l,3)),d.setAttribute("color",new rt(c,3));const u=new Ki({vertexColors:!0,toneMapped:!1});super(d,u),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}class pp extends Dr{constructor(e=1){const t=[0,0,0,e,0,0,0,0,0,0,e,0,0,0,0,0,0,e],i=[1,0,0,1,.6,0,0,1,0,.6,1,0,0,0,1,0,.6,1],s=new Ft;s.setAttribute("position",new rt(t,3)),s.setAttribute("color",new rt(i,3));const r=new Ki({vertexColors:!0,toneMapped:!1});super(s,r),this.type="AxesHelper"}setColors(e,t,i){const s=new Xe,r=this.geometry.attributes.color.array;return s.set(e),s.toArray(r,0),s.toArray(r,3),s.set(t),s.toArray(r,6),s.toArray(r,9),s.set(i),s.toArray(r,12),s.toArray(r,15),this.geometry.attributes.color.needsUpdate=!0,this}dispose(){this.geometry.dispose(),this.material.dispose()}}class sd extends Si{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){if(e===void 0){console.warn("THREE.Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}}function Il(n,e,t,i){const s=fp(i);switch(t){case Lc:return n*e;case Ic:return n*e/s.components*s.byteLength;case Po:return n*e/s.components*s.byteLength;case Uc:return n*e*2/s.components*s.byteLength;case Lo:return n*e*2/s.components*s.byteLength;case Dc:return n*e*3/s.components*s.byteLength;case mn:return n*e*4/s.components*s.byteLength;case Do:return n*e*4/s.components*s.byteLength;case yr:case br:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Mr:case Sr:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Va:case Wa:return Math.max(n,16)*Math.max(e,8)/4;case Ga:case $a:return Math.max(n,8)*Math.max(e,8)/2;case ja:case Xa:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case qa:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Ya:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Za:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case Ja:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case Ka:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case Qa:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case eo:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case to:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case no:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case io:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case so:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case ro:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case ao:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case oo:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case lo:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case co:case uo:case ho:return Math.ceil(n/4)*Math.ceil(e/4)*16;case po:case fo:return Math.ceil(n/4)*Math.ceil(e/4)*8;case mo:case go:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function fp(n){switch(n){case An:case Ac:return{byteLength:1,components:1};case ws:case Cc:case Is:return{byteLength:2,components:1};case Co:case Ro:return{byteLength:2,components:4};case yi:case Ao:case zn:return{byteLength:4,components:1};case Rc:case Pc:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:To}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=To);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function rd(){let n=null,e=!1,t=null,i=null;function s(r,a){t(r,a),i=n.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(i=n.requestAnimationFrame(s),e=!0)},stop:function(){n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){n=r}}}function mp(n){const e=new WeakMap;function t(o,l){const c=o.array,d=o.usage,u=c.byteLength,h=n.createBuffer();n.bindBuffer(l,h),n.bufferData(l,c,d),o.onUploadCallback();let m;if(c instanceof Float32Array)m=n.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)m=n.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?m=n.HALF_FLOAT:m=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)m=n.SHORT;else if(c instanceof Uint32Array)m=n.UNSIGNED_INT;else if(c instanceof Int32Array)m=n.INT;else if(c instanceof Int8Array)m=n.BYTE;else if(c instanceof Uint8Array)m=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)m=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:h,type:m,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:u}}function i(o,l,c){const d=l.array,u=l.updateRanges;if(n.bindBuffer(c,o),u.length===0)n.bufferSubData(c,0,d);else{u.sort((m,_)=>m.start-_.start);let h=0;for(let m=1;m<u.length;m++){const _=u[h],x=u[m];x.start<=_.start+_.count+1?_.count=Math.max(_.count,x.start+x.count-_.start):(++h,u[h]=x)}u.length=h+1;for(let m=0,_=u.length;m<_;m++){const x=u[m];n.bufferSubData(c,x.start*d.BYTES_PER_ELEMENT,d,x.start,x.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(n.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const d=e.get(o);(!d||d.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var gp=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,_p=`#ifdef USE_ALPHAHASH
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
#endif`,vp=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,xp=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,yp=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,bp=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Mp=`#ifdef USE_AOMAP
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
#endif`,Sp=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Ep=`#ifdef USE_BATCHING
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
#endif`,wp=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Tp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Ap=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Cp=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Rp=`#ifdef USE_IRIDESCENCE
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
#endif`,Pp=`#ifdef USE_BUMPMAP
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
#endif`,Lp=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Dp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Ip=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Up=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Np=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Fp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Op=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,zp=`#if defined( USE_COLOR_ALPHA )
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
#endif`,kp=`#define PI 3.141592653589793
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
} // validated`,Bp=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Hp=`vec3 transformedNormal = objectNormal;
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
#endif`,Gp=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Vp=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,$p=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Wp=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,jp="gl_FragColor = linearToOutputTexel( gl_FragColor );",Xp=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,qp=`#ifdef USE_ENVMAP
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
#endif`,Yp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Zp=`#ifdef USE_ENVMAP
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
#endif`,Jp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Kp=`#ifdef USE_ENVMAP
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
#endif`,Qp=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,ef=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,tf=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,nf=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,sf=`#ifdef USE_GRADIENTMAP
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
}`,rf=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,af=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,of=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,lf=`uniform bool receiveShadow;
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
#endif`,cf=`#ifdef USE_ENVMAP
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
#endif`,df=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,uf=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,hf=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,pf=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,ff=`PhysicalMaterial material;
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
#endif`,mf=`struct PhysicalMaterial {
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
}`,gf=`
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
#endif`,_f=`#if defined( RE_IndirectDiffuse )
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
#endif`,vf=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,xf=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,yf=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,bf=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Mf=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Sf=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Ef=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,wf=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Tf=`#if defined( USE_POINTS_UV )
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
#endif`,Af=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Cf=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Rf=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Pf=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Lf=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Df=`#ifdef USE_MORPHTARGETS
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
#endif`,If=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Uf=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Nf=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,Ff=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Of=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,zf=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,kf=`#ifdef USE_NORMALMAP
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
#endif`,Bf=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Hf=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Gf=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Vf=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,$f=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Wf=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,jf=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Xf=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,qf=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Yf=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Zf=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Jf=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Kf=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Qf=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,em=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,tm=`float getShadowMask() {
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
}`,nm=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,im=`#ifdef USE_SKINNING
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
#endif`,sm=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,rm=`#ifdef USE_SKINNING
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
#endif`,am=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,om=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,lm=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,cm=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,dm=`#ifdef USE_TRANSMISSION
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
#endif`,um=`#ifdef USE_TRANSMISSION
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
#endif`,hm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,pm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,fm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,mm=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const gm=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,_m=`uniform sampler2D t2D;
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
}`,vm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,xm=`#ifdef ENVMAP_TYPE_CUBE
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
}`,ym=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,bm=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Mm=`#include <common>
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
}`,Sm=`#if DEPTH_PACKING == 3200
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
}`,Em=`#define DISTANCE
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
}`,wm=`#define DISTANCE
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
}`,Tm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Am=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Cm=`uniform float scale;
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
}`,Rm=`uniform vec3 diffuse;
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
}`,Pm=`#include <common>
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
}`,Lm=`uniform vec3 diffuse;
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
}`,Dm=`#define LAMBERT
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
}`,Im=`#define LAMBERT
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
}`,Um=`#define MATCAP
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
}`,Nm=`#define MATCAP
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
}`,Fm=`#define NORMAL
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
}`,Om=`#define NORMAL
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
}`,zm=`#define PHONG
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
}`,km=`#define PHONG
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
}`,Bm=`#define STANDARD
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
}`,Hm=`#define STANDARD
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
}`,Gm=`#define TOON
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
}`,Vm=`#define TOON
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
}`,$m=`uniform float size;
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
}`,Wm=`uniform vec3 diffuse;
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
}`,jm=`#include <common>
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
}`,Xm=`uniform vec3 color;
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
}`,qm=`uniform float rotation;
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
}`,Ym=`uniform vec3 diffuse;
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
}`,We={alphahash_fragment:gp,alphahash_pars_fragment:_p,alphamap_fragment:vp,alphamap_pars_fragment:xp,alphatest_fragment:yp,alphatest_pars_fragment:bp,aomap_fragment:Mp,aomap_pars_fragment:Sp,batching_pars_vertex:Ep,batching_vertex:wp,begin_vertex:Tp,beginnormal_vertex:Ap,bsdfs:Cp,iridescence_fragment:Rp,bumpmap_pars_fragment:Pp,clipping_planes_fragment:Lp,clipping_planes_pars_fragment:Dp,clipping_planes_pars_vertex:Ip,clipping_planes_vertex:Up,color_fragment:Np,color_pars_fragment:Fp,color_pars_vertex:Op,color_vertex:zp,common:kp,cube_uv_reflection_fragment:Bp,defaultnormal_vertex:Hp,displacementmap_pars_vertex:Gp,displacementmap_vertex:Vp,emissivemap_fragment:$p,emissivemap_pars_fragment:Wp,colorspace_fragment:jp,colorspace_pars_fragment:Xp,envmap_fragment:qp,envmap_common_pars_fragment:Yp,envmap_pars_fragment:Zp,envmap_pars_vertex:Jp,envmap_physical_pars_fragment:cf,envmap_vertex:Kp,fog_vertex:Qp,fog_pars_vertex:ef,fog_fragment:tf,fog_pars_fragment:nf,gradientmap_pars_fragment:sf,lightmap_pars_fragment:rf,lights_lambert_fragment:af,lights_lambert_pars_fragment:of,lights_pars_begin:lf,lights_toon_fragment:df,lights_toon_pars_fragment:uf,lights_phong_fragment:hf,lights_phong_pars_fragment:pf,lights_physical_fragment:ff,lights_physical_pars_fragment:mf,lights_fragment_begin:gf,lights_fragment_maps:_f,lights_fragment_end:vf,logdepthbuf_fragment:xf,logdepthbuf_pars_fragment:yf,logdepthbuf_pars_vertex:bf,logdepthbuf_vertex:Mf,map_fragment:Sf,map_pars_fragment:Ef,map_particle_fragment:wf,map_particle_pars_fragment:Tf,metalnessmap_fragment:Af,metalnessmap_pars_fragment:Cf,morphinstance_vertex:Rf,morphcolor_vertex:Pf,morphnormal_vertex:Lf,morphtarget_pars_vertex:Df,morphtarget_vertex:If,normal_fragment_begin:Uf,normal_fragment_maps:Nf,normal_pars_fragment:Ff,normal_pars_vertex:Of,normal_vertex:zf,normalmap_pars_fragment:kf,clearcoat_normal_fragment_begin:Bf,clearcoat_normal_fragment_maps:Hf,clearcoat_pars_fragment:Gf,iridescence_pars_fragment:Vf,opaque_fragment:$f,packing:Wf,premultiplied_alpha_fragment:jf,project_vertex:Xf,dithering_fragment:qf,dithering_pars_fragment:Yf,roughnessmap_fragment:Zf,roughnessmap_pars_fragment:Jf,shadowmap_pars_fragment:Kf,shadowmap_pars_vertex:Qf,shadowmap_vertex:em,shadowmask_pars_fragment:tm,skinbase_vertex:nm,skinning_pars_vertex:im,skinning_vertex:sm,skinnormal_vertex:rm,specularmap_fragment:am,specularmap_pars_fragment:om,tonemapping_fragment:lm,tonemapping_pars_fragment:cm,transmission_fragment:dm,transmission_pars_fragment:um,uv_pars_fragment:hm,uv_pars_vertex:pm,uv_vertex:fm,worldpos_vertex:mm,background_vert:gm,background_frag:_m,backgroundCube_vert:vm,backgroundCube_frag:xm,cube_vert:ym,cube_frag:bm,depth_vert:Mm,depth_frag:Sm,distanceRGBA_vert:Em,distanceRGBA_frag:wm,equirect_vert:Tm,equirect_frag:Am,linedashed_vert:Cm,linedashed_frag:Rm,meshbasic_vert:Pm,meshbasic_frag:Lm,meshlambert_vert:Dm,meshlambert_frag:Im,meshmatcap_vert:Um,meshmatcap_frag:Nm,meshnormal_vert:Fm,meshnormal_frag:Om,meshphong_vert:zm,meshphong_frag:km,meshphysical_vert:Bm,meshphysical_frag:Hm,meshtoon_vert:Gm,meshtoon_frag:Vm,points_vert:$m,points_frag:Wm,shadow_vert:jm,shadow_frag:Xm,sprite_vert:qm,sprite_frag:Ym},me={common:{diffuse:{value:new Xe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new $e},alphaMap:{value:null},alphaMapTransform:{value:new $e},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new $e}},envmap:{envMap:{value:null},envMapRotation:{value:new $e},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new $e}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new $e}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new $e},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new $e},normalScale:{value:new oe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new $e},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new $e}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new $e}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new $e}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Xe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Xe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new $e},alphaTest:{value:0},uvTransform:{value:new $e}},sprite:{diffuse:{value:new Xe(16777215)},opacity:{value:1},center:{value:new oe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new $e},alphaMap:{value:null},alphaMapTransform:{value:new $e},alphaTest:{value:0}}},Mn={basic:{uniforms:jt([me.common,me.specularmap,me.envmap,me.aomap,me.lightmap,me.fog]),vertexShader:We.meshbasic_vert,fragmentShader:We.meshbasic_frag},lambert:{uniforms:jt([me.common,me.specularmap,me.envmap,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.fog,me.lights,{emissive:{value:new Xe(0)}}]),vertexShader:We.meshlambert_vert,fragmentShader:We.meshlambert_frag},phong:{uniforms:jt([me.common,me.specularmap,me.envmap,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.fog,me.lights,{emissive:{value:new Xe(0)},specular:{value:new Xe(1118481)},shininess:{value:30}}]),vertexShader:We.meshphong_vert,fragmentShader:We.meshphong_frag},standard:{uniforms:jt([me.common,me.envmap,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.roughnessmap,me.metalnessmap,me.fog,me.lights,{emissive:{value:new Xe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:We.meshphysical_vert,fragmentShader:We.meshphysical_frag},toon:{uniforms:jt([me.common,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.gradientmap,me.fog,me.lights,{emissive:{value:new Xe(0)}}]),vertexShader:We.meshtoon_vert,fragmentShader:We.meshtoon_frag},matcap:{uniforms:jt([me.common,me.bumpmap,me.normalmap,me.displacementmap,me.fog,{matcap:{value:null}}]),vertexShader:We.meshmatcap_vert,fragmentShader:We.meshmatcap_frag},points:{uniforms:jt([me.points,me.fog]),vertexShader:We.points_vert,fragmentShader:We.points_frag},dashed:{uniforms:jt([me.common,me.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:We.linedashed_vert,fragmentShader:We.linedashed_frag},depth:{uniforms:jt([me.common,me.displacementmap]),vertexShader:We.depth_vert,fragmentShader:We.depth_frag},normal:{uniforms:jt([me.common,me.bumpmap,me.normalmap,me.displacementmap,{opacity:{value:1}}]),vertexShader:We.meshnormal_vert,fragmentShader:We.meshnormal_frag},sprite:{uniforms:jt([me.sprite,me.fog]),vertexShader:We.sprite_vert,fragmentShader:We.sprite_frag},background:{uniforms:{uvTransform:{value:new $e},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:We.background_vert,fragmentShader:We.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new $e}},vertexShader:We.backgroundCube_vert,fragmentShader:We.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:We.cube_vert,fragmentShader:We.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:We.equirect_vert,fragmentShader:We.equirect_frag},distanceRGBA:{uniforms:jt([me.common,me.displacementmap,{referencePosition:{value:new D},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:We.distanceRGBA_vert,fragmentShader:We.distanceRGBA_frag},shadow:{uniforms:jt([me.lights,me.fog,{color:{value:new Xe(0)},opacity:{value:1}}]),vertexShader:We.shadow_vert,fragmentShader:We.shadow_frag}};Mn.physical={uniforms:jt([Mn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new $e},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new $e},clearcoatNormalScale:{value:new oe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new $e},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new $e},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new $e},sheen:{value:0},sheenColor:{value:new Xe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new $e},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new $e},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new $e},transmissionSamplerSize:{value:new oe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new $e},attenuationDistance:{value:0},attenuationColor:{value:new Xe(0)},specularColor:{value:new Xe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new $e},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new $e},anisotropyVector:{value:new oe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new $e}}]),vertexShader:We.meshphysical_vert,fragmentShader:We.meshphysical_frag};const pr={r:0,b:0,g:0},ci=new _n,Zm=new dt;function Jm(n,e,t,i,s,r,a){const o=new Xe(0);let l=r===!0?0:1,c,d,u=null,h=0,m=null;function _(v){let g=v.isScene===!0?v.background:null;return g&&g.isTexture&&(g=(v.backgroundBlurriness>0?t:e).get(g)),g}function x(v){let g=!1;const E=_(v);E===null?p(o,l):E&&E.isColor&&(p(E,1),g=!0);const T=n.xr.getEnvironmentBlendMode();T==="additive"?i.buffers.color.setClear(0,0,0,1,a):T==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(n.autoClear||g)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function f(v,g){const E=_(g);E&&(E.isCubeTexture||E.mapping===Ur)?(d===void 0&&(d=new be(new St(1,1,1),new ti({name:"BackgroundCubeMaterial",uniforms:Ji(Mn.backgroundCube.uniforms),vertexShader:Mn.backgroundCube.vertexShader,fragmentShader:Mn.backgroundCube.fragmentShader,side:Kt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),d.geometry.deleteAttribute("normal"),d.geometry.deleteAttribute("uv"),d.onBeforeRender=function(T,S,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(d.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(d)),ci.copy(g.backgroundRotation),ci.x*=-1,ci.y*=-1,ci.z*=-1,E.isCubeTexture&&E.isRenderTargetTexture===!1&&(ci.y*=-1,ci.z*=-1),d.material.uniforms.envMap.value=E,d.material.uniforms.flipEnvMap.value=E.isCubeTexture&&E.isRenderTargetTexture===!1?-1:1,d.material.uniforms.backgroundBlurriness.value=g.backgroundBlurriness,d.material.uniforms.backgroundIntensity.value=g.backgroundIntensity,d.material.uniforms.backgroundRotation.value.setFromMatrix4(Zm.makeRotationFromEuler(ci)),d.material.toneMapped=tt.getTransfer(E.colorSpace)!==ot,(u!==E||h!==E.version||m!==n.toneMapping)&&(d.material.needsUpdate=!0,u=E,h=E.version,m=n.toneMapping),d.layers.enableAll(),v.unshift(d,d.geometry,d.material,0,0,null)):E&&E.isTexture&&(c===void 0&&(c=new be(new Ns(2,2),new ti({name:"BackgroundMaterial",uniforms:Ji(Mn.background.uniforms),vertexShader:Mn.background.vertexShader,fragmentShader:Mn.background.fragmentShader,side:ei,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=E,c.material.uniforms.backgroundIntensity.value=g.backgroundIntensity,c.material.toneMapped=tt.getTransfer(E.colorSpace)!==ot,E.matrixAutoUpdate===!0&&E.updateMatrix(),c.material.uniforms.uvTransform.value.copy(E.matrix),(u!==E||h!==E.version||m!==n.toneMapping)&&(c.material.needsUpdate=!0,u=E,h=E.version,m=n.toneMapping),c.layers.enableAll(),v.unshift(c,c.geometry,c.material,0,0,null))}function p(v,g){v.getRGB(pr,Gc(n)),i.buffers.color.setClear(pr.r,pr.g,pr.b,g,a)}function y(){d!==void 0&&(d.geometry.dispose(),d.material.dispose(),d=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(v,g=1){o.set(v),l=g,p(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(v){l=v,p(o,l)},render:x,addToRenderList:f,dispose:y}}function Km(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=h(null);let r=s,a=!1;function o(b,R,U,L,k){let F=!1;const O=u(L,U,R);r!==O&&(r=O,c(r.object)),F=m(b,L,U,k),F&&_(b,L,U,k),k!==null&&e.update(k,n.ELEMENT_ARRAY_BUFFER),(F||a)&&(a=!1,g(b,R,U,L),k!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(k).buffer))}function l(){return n.createVertexArray()}function c(b){return n.bindVertexArray(b)}function d(b){return n.deleteVertexArray(b)}function u(b,R,U){const L=U.wireframe===!0;let k=i[b.id];k===void 0&&(k={},i[b.id]=k);let F=k[R.id];F===void 0&&(F={},k[R.id]=F);let O=F[L];return O===void 0&&(O=h(l()),F[L]=O),O}function h(b){const R=[],U=[],L=[];for(let k=0;k<t;k++)R[k]=0,U[k]=0,L[k]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:R,enabledAttributes:U,attributeDivisors:L,object:b,attributes:{},index:null}}function m(b,R,U,L){const k=r.attributes,F=R.attributes;let O=0;const H=U.getAttributes();for(const $ in H)if(H[$].location>=0){const pe=k[$];let ge=F[$];if(ge===void 0&&($==="instanceMatrix"&&b.instanceMatrix&&(ge=b.instanceMatrix),$==="instanceColor"&&b.instanceColor&&(ge=b.instanceColor)),pe===void 0||pe.attribute!==ge||ge&&pe.data!==ge.data)return!0;O++}return r.attributesNum!==O||r.index!==L}function _(b,R,U,L){const k={},F=R.attributes;let O=0;const H=U.getAttributes();for(const $ in H)if(H[$].location>=0){let pe=F[$];pe===void 0&&($==="instanceMatrix"&&b.instanceMatrix&&(pe=b.instanceMatrix),$==="instanceColor"&&b.instanceColor&&(pe=b.instanceColor));const ge={};ge.attribute=pe,pe&&pe.data&&(ge.data=pe.data),k[$]=ge,O++}r.attributes=k,r.attributesNum=O,r.index=L}function x(){const b=r.newAttributes;for(let R=0,U=b.length;R<U;R++)b[R]=0}function f(b){p(b,0)}function p(b,R){const U=r.newAttributes,L=r.enabledAttributes,k=r.attributeDivisors;U[b]=1,L[b]===0&&(n.enableVertexAttribArray(b),L[b]=1),k[b]!==R&&(n.vertexAttribDivisor(b,R),k[b]=R)}function y(){const b=r.newAttributes,R=r.enabledAttributes;for(let U=0,L=R.length;U<L;U++)R[U]!==b[U]&&(n.disableVertexAttribArray(U),R[U]=0)}function v(b,R,U,L,k,F,O){O===!0?n.vertexAttribIPointer(b,R,U,k,F):n.vertexAttribPointer(b,R,U,L,k,F)}function g(b,R,U,L){x();const k=L.attributes,F=U.getAttributes(),O=R.defaultAttributeValues;for(const H in F){const $=F[H];if($.location>=0){let ee=k[H];if(ee===void 0&&(H==="instanceMatrix"&&b.instanceMatrix&&(ee=b.instanceMatrix),H==="instanceColor"&&b.instanceColor&&(ee=b.instanceColor)),ee!==void 0){const pe=ee.normalized,ge=ee.itemSize,Oe=e.get(ee);if(Oe===void 0)continue;const qe=Oe.buffer,Qe=Oe.type,Ke=Oe.bytesPerElement,Y=Qe===n.INT||Qe===n.UNSIGNED_INT||ee.gpuType===Ao;if(ee.isInterleavedBufferAttribute){const ie=ee.data,Se=ie.stride,De=ee.offset;if(ie.isInstancedInterleavedBuffer){for(let Te=0;Te<$.locationSize;Te++)p($.location+Te,ie.meshPerAttribute);b.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=ie.meshPerAttribute*ie.count)}else for(let Te=0;Te<$.locationSize;Te++)f($.location+Te);n.bindBuffer(n.ARRAY_BUFFER,qe);for(let Te=0;Te<$.locationSize;Te++)v($.location+Te,ge/$.locationSize,Qe,pe,Se*Ke,(De+ge/$.locationSize*Te)*Ke,Y)}else{if(ee.isInstancedBufferAttribute){for(let ie=0;ie<$.locationSize;ie++)p($.location+ie,ee.meshPerAttribute);b.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=ee.meshPerAttribute*ee.count)}else for(let ie=0;ie<$.locationSize;ie++)f($.location+ie);n.bindBuffer(n.ARRAY_BUFFER,qe);for(let ie=0;ie<$.locationSize;ie++)v($.location+ie,ge/$.locationSize,Qe,pe,ge*Ke,ge/$.locationSize*ie*Ke,Y)}}else if(O!==void 0){const pe=O[H];if(pe!==void 0)switch(pe.length){case 2:n.vertexAttrib2fv($.location,pe);break;case 3:n.vertexAttrib3fv($.location,pe);break;case 4:n.vertexAttrib4fv($.location,pe);break;default:n.vertexAttrib1fv($.location,pe)}}}}y()}function E(){A();for(const b in i){const R=i[b];for(const U in R){const L=R[U];for(const k in L)d(L[k].object),delete L[k];delete R[U]}delete i[b]}}function T(b){if(i[b.id]===void 0)return;const R=i[b.id];for(const U in R){const L=R[U];for(const k in L)d(L[k].object),delete L[k];delete R[U]}delete i[b.id]}function S(b){for(const R in i){const U=i[R];if(U[b.id]===void 0)continue;const L=U[b.id];for(const k in L)d(L[k].object),delete L[k];delete U[b.id]}}function A(){M(),a=!0,r!==s&&(r=s,c(r.object))}function M(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:A,resetDefaultState:M,dispose:E,releaseStatesOfGeometry:T,releaseStatesOfProgram:S,initAttributes:x,enableAttribute:f,disableUnusedAttributes:y}}function Qm(n,e,t){let i;function s(c){i=c}function r(c,d){n.drawArrays(i,c,d),t.update(d,i,1)}function a(c,d,u){u!==0&&(n.drawArraysInstanced(i,c,d,u),t.update(d,i,u))}function o(c,d,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,d,0,u);let m=0;for(let _=0;_<u;_++)m+=d[_];t.update(m,i,1)}function l(c,d,u,h){if(u===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let _=0;_<c.length;_++)a(c[_],d[_],h[_]);else{m.multiDrawArraysInstancedWEBGL(i,c,0,d,0,h,0,u);let _=0;for(let x=0;x<u;x++)_+=d[x]*h[x];t.update(_,i,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function eg(n,e,t,i){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const S=e.get("EXT_texture_filter_anisotropic");s=n.getParameter(S.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(S){return!(S!==mn&&i.convert(S)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(S){const A=S===Is&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(S!==An&&i.convert(S)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&S!==zn&&!A)}function l(S){if(S==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";S="mediump"}return S==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const d=l(c);d!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",d,"instead."),c=d);const u=t.logarithmicDepthBuffer===!0,h=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),m=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),_=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=n.getParameter(n.MAX_TEXTURE_SIZE),f=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),p=n.getParameter(n.MAX_VERTEX_ATTRIBS),y=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),v=n.getParameter(n.MAX_VARYING_VECTORS),g=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),E=_>0,T=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:u,reversedDepthBuffer:h,maxTextures:m,maxVertexTextures:_,maxTextureSize:x,maxCubemapSize:f,maxAttributes:p,maxVertexUniforms:y,maxVaryings:v,maxFragmentUniforms:g,vertexTextures:E,maxSamples:T}}function tg(n){const e=this;let t=null,i=0,s=!1,r=!1;const a=new Zn,o=new $e,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,h){const m=u.length!==0||h||i!==0||s;return s=h,i=u.length,m},this.beginShadows=function(){r=!0,d(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,h){t=d(u,h,0)},this.setState=function(u,h,m){const _=u.clippingPlanes,x=u.clipIntersection,f=u.clipShadows,p=n.get(u);if(!s||_===null||_.length===0||r&&!f)r?d(null):c();else{const y=r?0:i,v=y*4;let g=p.clippingState||null;l.value=g,g=d(_,h,v,m);for(let E=0;E!==v;++E)g[E]=t[E];p.clippingState=g,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=y}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function d(u,h,m,_){const x=u!==null?u.length:0;let f=null;if(x!==0){if(f=l.value,_!==!0||f===null){const p=m+x*4,y=h.matrixWorldInverse;o.getNormalMatrix(y),(f===null||f.length<p)&&(f=new Float32Array(p));for(let v=0,g=m;v!==x;++v,g+=4)a.copy(u[v]).applyMatrix4(y,o),a.normal.toArray(f,g),f[g+3]=a.constant}l.value=f,l.needsUpdate=!0}return e.numPlanes=x,e.numIntersection=0,f}}function ng(n){let e=new WeakMap;function t(a,o){return o===za?a.mapping=qi:o===ka&&(a.mapping=Yi),a}function i(a){if(a&&a.isTexture){const o=a.mapping;if(o===za||o===ka)if(e.has(a)){const l=e.get(a).texture;return t(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new xh(l.height);return c.fromEquirectangularTexture(n,a),e.set(a,c),a.addEventListener("dispose",s),t(c.texture,a.mapping)}else return null}}return a}function s(a){const o=a.target;o.removeEventListener("dispose",s);const l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function r(){e=new WeakMap}return{get:i,dispose:r}}const Vi=4,Ul=[.125,.215,.35,.446,.526,.582],_i=20,va=new nd,Nl=new Xe;let xa=null,ya=0,ba=0,Ma=!1;const pi=(1+Math.sqrt(5))/2,zi=1/pi,Fl=[new D(-pi,zi,0),new D(pi,zi,0),new D(-zi,0,pi),new D(zi,0,pi),new D(0,pi,-zi),new D(0,pi,zi),new D(-1,1,-1),new D(1,1,-1),new D(-1,1,1),new D(1,1,1)],ig=new D;class Ol{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,i=.1,s=100,r={}){const{size:a=256,position:o=ig}=r;xa=this._renderer.getRenderTarget(),ya=this._renderer.getActiveCubeFace(),ba=this._renderer.getActiveMipmapLevel(),Ma=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,i,s,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Bl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=kl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(xa,ya,ba),this._renderer.xr.enabled=Ma,e.scissorTest=!1,fr(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===qi||e.mapping===Yi?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),xa=this._renderer.getRenderTarget(),ya=this._renderer.getActiveCubeFace(),ba=this._renderer.getActiveMipmapLevel(),Ma=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:En,minFilter:En,generateMipmaps:!1,type:Is,format:mn,colorSpace:Zi,depthBuffer:!1},s=zl(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=zl(e,t,i);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=sg(r)),this._blurMaterial=rg(r,e,t)}return s}_compileMaterial(e){const t=new be(this._lodPlanes[0],e);this._renderer.compile(t,va)}_sceneToCubeUV(e,t,i,s,r){const l=new cn(90,1,t,i),c=[1,-1,1,1,1,1],d=[1,1,1,-1,-1,-1],u=this._renderer,h=u.autoClear,m=u.toneMapping;u.getClearColor(Nl),u.toneMapping=Qn,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null));const x=new Or({name:"PMREM.Background",side:Kt,depthWrite:!1,depthTest:!1}),f=new be(new St,x);let p=!1;const y=e.background;y?y.isColor&&(x.color.copy(y),e.background=null,p=!0):(x.color.copy(Nl),p=!0);for(let v=0;v<6;v++){const g=v%3;g===0?(l.up.set(0,c[v],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+d[v],r.y,r.z)):g===1?(l.up.set(0,0,c[v]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+d[v],r.z)):(l.up.set(0,c[v],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+d[v]));const E=this._cubeSize;fr(s,g*E,v>2?E:0,E,E),u.setRenderTarget(s),p&&u.render(f,l),u.render(e,l)}f.geometry.dispose(),f.material.dispose(),u.toneMapping=m,u.autoClear=h,e.background=y}_textureToCubeUV(e,t){const i=this._renderer,s=e.mapping===qi||e.mapping===Yi;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Bl()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=kl());const r=s?this._cubemapMaterial:this._equirectMaterial,a=new be(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=e;const l=this._cubeSize;fr(t,0,0,3*l,2*l),i.setRenderTarget(t),i.render(a,va)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const a=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=Fl[(s-r-1)%Fl.length];this._blur(e,r-1,r,a,o)}t.autoClear=i}_blur(e,t,i,s,r){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,i,s,"latitudinal",r),this._halfBlur(a,e,i,i,s,"longitudinal",r)}_halfBlur(e,t,i,s,r,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const d=3,u=new be(this._lodPlanes[s],c),h=c.uniforms,m=this._sizeLods[i]-1,_=isFinite(r)?Math.PI/(2*m):2*Math.PI/(2*_i-1),x=r/_,f=isFinite(r)?1+Math.floor(d*x):_i;f>_i&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${f} samples when the maximum is set to ${_i}`);const p=[];let y=0;for(let S=0;S<_i;++S){const A=S/x,M=Math.exp(-A*A/2);p.push(M),S===0?y+=M:S<f&&(y+=2*M)}for(let S=0;S<p.length;S++)p[S]=p[S]/y;h.envMap.value=e.texture,h.samples.value=f,h.weights.value=p,h.latitudinal.value=a==="latitudinal",o&&(h.poleAxis.value=o);const{_lodMax:v}=this;h.dTheta.value=_,h.mipInt.value=v-i;const g=this._sizeLods[s],E=3*g*(s>v-Vi?s-v+Vi:0),T=4*(this._cubeSize-g);fr(t,E,T,3*g,2*g),l.setRenderTarget(t),l.render(u,va)}}function sg(n){const e=[],t=[],i=[];let s=n;const r=n-Vi+1+Ul.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);t.push(o);let l=1/o;a>n-Vi?l=Ul[a-n+Vi-1]:a===0&&(l=0),i.push(l);const c=1/(o-2),d=-c,u=1+c,h=[d,d,u,d,u,u,d,d,u,u,d,u],m=6,_=6,x=3,f=2,p=1,y=new Float32Array(x*_*m),v=new Float32Array(f*_*m),g=new Float32Array(p*_*m);for(let T=0;T<m;T++){const S=T%3*2/3-1,A=T>2?0:-1,M=[S,A,0,S+2/3,A,0,S+2/3,A+1,0,S,A,0,S+2/3,A+1,0,S,A+1,0];y.set(M,x*_*T),v.set(h,f*_*T);const b=[T,T,T,T,T,T];g.set(b,p*_*T)}const E=new Ft;E.setAttribute("position",new Tn(y,x)),E.setAttribute("uv",new Tn(v,f)),E.setAttribute("faceIndex",new Tn(g,p)),e.push(E),s>Vi&&s--}return{lodPlanes:e,sizeLods:t,sigmas:i}}function zl(n,e,t){const i=new bi(n,e,t);return i.texture.mapping=Ur,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function fr(n,e,t,i,s){n.viewport.set(e,t,i,s),n.scissor.set(e,t,i,s)}function rg(n,e,t){const i=new Float32Array(_i),s=new D(0,1,0);return new ti({name:"SphericalGaussianBlur",defines:{n:_i,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Bo(),fragmentShader:`

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
		`,blending:Kn,depthTest:!1,depthWrite:!1})}function kl(){return new ti({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Bo(),fragmentShader:`

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
		`,blending:Kn,depthTest:!1,depthWrite:!1})}function Bl(){return new ti({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Bo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Kn,depthTest:!1,depthWrite:!1})}function Bo(){return`

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
	`}function ag(n){let e=new WeakMap,t=null;function i(o){if(o&&o.isTexture){const l=o.mapping,c=l===za||l===ka,d=l===qi||l===Yi;if(c||d){let u=e.get(o);const h=u!==void 0?u.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==h)return t===null&&(t=new Ol(n)),u=c?t.fromEquirectangular(o,u):t.fromCubemap(o,u),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),u.texture;if(u!==void 0)return u.texture;{const m=o.image;return c&&m&&m.height>0||d&&m&&s(m)?(t===null&&(t=new Ol(n)),u=c?t.fromEquirectangular(o):t.fromCubemap(o),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),o.addEventListener("dispose",r),u.texture):null}}}return o}function s(o){let l=0;const c=6;for(let d=0;d<c;d++)o[d]!==void 0&&l++;return l===c}function r(o){const l=o.target;l.removeEventListener("dispose",r);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:a}}function og(n){const e={};function t(i){if(e[i]!==void 0)return e[i];let s;switch(i){case"WEBGL_depth_texture":s=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=n.getExtension(i)}return e[i]=s,s}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const s=t(i);return s===null&&Rs("THREE.WebGLRenderer: "+i+" extension not supported."),s}}}function lg(n,e,t,i){const s={},r=new WeakMap;function a(u){const h=u.target;h.index!==null&&e.remove(h.index);for(const _ in h.attributes)e.remove(h.attributes[_]);h.removeEventListener("dispose",a),delete s[h.id];const m=r.get(h);m&&(e.remove(m),r.delete(h)),i.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,t.memory.geometries--}function o(u,h){return s[h.id]===!0||(h.addEventListener("dispose",a),s[h.id]=!0,t.memory.geometries++),h}function l(u){const h=u.attributes;for(const m in h)e.update(h[m],n.ARRAY_BUFFER)}function c(u){const h=[],m=u.index,_=u.attributes.position;let x=0;if(m!==null){const y=m.array;x=m.version;for(let v=0,g=y.length;v<g;v+=3){const E=y[v+0],T=y[v+1],S=y[v+2];h.push(E,T,T,S,S,E)}}else if(_!==void 0){const y=_.array;x=_.version;for(let v=0,g=y.length/3-1;v<g;v+=3){const E=v+0,T=v+1,S=v+2;h.push(E,T,T,S,S,E)}}else return;const f=new(Oc(h)?Hc:Bc)(h,1);f.version=x;const p=r.get(u);p&&e.remove(p),r.set(u,f)}function d(u){const h=r.get(u);if(h){const m=u.index;m!==null&&h.version<m.version&&c(u)}else c(u);return r.get(u)}return{get:o,update:l,getWireframeAttribute:d}}function cg(n,e,t){let i;function s(h){i=h}let r,a;function o(h){r=h.type,a=h.bytesPerElement}function l(h,m){n.drawElements(i,m,r,h*a),t.update(m,i,1)}function c(h,m,_){_!==0&&(n.drawElementsInstanced(i,m,r,h*a,_),t.update(m,i,_))}function d(h,m,_){if(_===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,m,0,r,h,0,_);let f=0;for(let p=0;p<_;p++)f+=m[p];t.update(f,i,1)}function u(h,m,_,x){if(_===0)return;const f=e.get("WEBGL_multi_draw");if(f===null)for(let p=0;p<h.length;p++)c(h[p]/a,m[p],x[p]);else{f.multiDrawElementsInstancedWEBGL(i,m,0,r,h,0,x,0,_);let p=0;for(let y=0;y<_;y++)p+=m[y]*x[y];t.update(p,i,1)}}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=d,this.renderMultiDrawInstances=u}function dg(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,a,o){switch(t.calls++,a){case n.TRIANGLES:t.triangles+=o*(r/3);break;case n.LINES:t.lines+=o*(r/2);break;case n.LINE_STRIP:t.lines+=o*(r-1);break;case n.LINE_LOOP:t.lines+=o*r;break;case n.POINTS:t.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:i}}function ug(n,e,t){const i=new WeakMap,s=new Tt;function r(a,o,l){const c=a.morphTargetInfluences,d=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=d!==void 0?d.length:0;let h=i.get(o);if(h===void 0||h.count!==u){let b=function(){A.dispose(),i.delete(o),o.removeEventListener("dispose",b)};var m=b;h!==void 0&&h.texture.dispose();const _=o.morphAttributes.position!==void 0,x=o.morphAttributes.normal!==void 0,f=o.morphAttributes.color!==void 0,p=o.morphAttributes.position||[],y=o.morphAttributes.normal||[],v=o.morphAttributes.color||[];let g=0;_===!0&&(g=1),x===!0&&(g=2),f===!0&&(g=3);let E=o.attributes.position.count*g,T=1;E>e.maxTextureSize&&(T=Math.ceil(E/e.maxTextureSize),E=e.maxTextureSize);const S=new Float32Array(E*T*4*u),A=new zc(S,E,T,u);A.type=zn,A.needsUpdate=!0;const M=g*4;for(let R=0;R<u;R++){const U=p[R],L=y[R],k=v[R],F=E*T*4*R;for(let O=0;O<U.count;O++){const H=O*M;_===!0&&(s.fromBufferAttribute(U,O),S[F+H+0]=s.x,S[F+H+1]=s.y,S[F+H+2]=s.z,S[F+H+3]=0),x===!0&&(s.fromBufferAttribute(L,O),S[F+H+4]=s.x,S[F+H+5]=s.y,S[F+H+6]=s.z,S[F+H+7]=0),f===!0&&(s.fromBufferAttribute(k,O),S[F+H+8]=s.x,S[F+H+9]=s.y,S[F+H+10]=s.z,S[F+H+11]=k.itemSize===4?s.w:1)}}h={count:u,texture:A,size:new oe(E,T)},i.set(o,h),o.addEventListener("dispose",b)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",a.morphTexture,t);else{let _=0;for(let f=0;f<c.length;f++)_+=c[f];const x=o.morphTargetsRelative?1:1-_;l.getUniforms().setValue(n,"morphTargetBaseInfluence",x),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",h.texture,t),l.getUniforms().setValue(n,"morphTargetsTextureSize",h.size)}return{update:r}}function hg(n,e,t,i){let s=new WeakMap;function r(l){const c=i.render.frame,d=l.geometry,u=e.get(l,d);if(s.get(u)!==c&&(e.update(u),s.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),s.get(l)!==c&&(t.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,n.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){const h=l.skeleton;s.get(h)!==c&&(h.update(),s.set(h,c))}return u}function a(){s=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:a}}const ad=new Qt,Hl=new Wc(1,1),od=new zc,ld=new nh,cd=new $c,Gl=[],Vl=[],$l=new Float32Array(16),Wl=new Float32Array(9),jl=new Float32Array(4);function ns(n,e,t){const i=n[0];if(i<=0||i>0)return n;const s=e*t;let r=Gl[s];if(r===void 0&&(r=new Float32Array(s),Gl[s]=r),e!==0){i.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,n[a].toArray(r,o)}return r}function Dt(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function It(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function zr(n,e){let t=Vl[e];t===void 0&&(t=new Int32Array(e),Vl[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function pg(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function fg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Dt(t,e))return;n.uniform2fv(this.addr,e),It(t,e)}}function mg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Dt(t,e))return;n.uniform3fv(this.addr,e),It(t,e)}}function gg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Dt(t,e))return;n.uniform4fv(this.addr,e),It(t,e)}}function _g(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Dt(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),It(t,e)}else{if(Dt(t,i))return;jl.set(i),n.uniformMatrix2fv(this.addr,!1,jl),It(t,i)}}function vg(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Dt(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),It(t,e)}else{if(Dt(t,i))return;Wl.set(i),n.uniformMatrix3fv(this.addr,!1,Wl),It(t,i)}}function xg(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Dt(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),It(t,e)}else{if(Dt(t,i))return;$l.set(i),n.uniformMatrix4fv(this.addr,!1,$l),It(t,i)}}function yg(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function bg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Dt(t,e))return;n.uniform2iv(this.addr,e),It(t,e)}}function Mg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Dt(t,e))return;n.uniform3iv(this.addr,e),It(t,e)}}function Sg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Dt(t,e))return;n.uniform4iv(this.addr,e),It(t,e)}}function Eg(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function wg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Dt(t,e))return;n.uniform2uiv(this.addr,e),It(t,e)}}function Tg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Dt(t,e))return;n.uniform3uiv(this.addr,e),It(t,e)}}function Ag(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Dt(t,e))return;n.uniform4uiv(this.addr,e),It(t,e)}}function Cg(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_2D_SHADOW?(Hl.compareFunction=Fc,r=Hl):r=ad,t.setTexture2D(e||r,s)}function Rg(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture3D(e||ld,s)}function Pg(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTextureCube(e||cd,s)}function Lg(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture2DArray(e||od,s)}function Dg(n){switch(n){case 5126:return pg;case 35664:return fg;case 35665:return mg;case 35666:return gg;case 35674:return _g;case 35675:return vg;case 35676:return xg;case 5124:case 35670:return yg;case 35667:case 35671:return bg;case 35668:case 35672:return Mg;case 35669:case 35673:return Sg;case 5125:return Eg;case 36294:return wg;case 36295:return Tg;case 36296:return Ag;case 35678:case 36198:case 36298:case 36306:case 35682:return Cg;case 35679:case 36299:case 36307:return Rg;case 35680:case 36300:case 36308:case 36293:return Pg;case 36289:case 36303:case 36311:case 36292:return Lg}}function Ig(n,e){n.uniform1fv(this.addr,e)}function Ug(n,e){const t=ns(e,this.size,2);n.uniform2fv(this.addr,t)}function Ng(n,e){const t=ns(e,this.size,3);n.uniform3fv(this.addr,t)}function Fg(n,e){const t=ns(e,this.size,4);n.uniform4fv(this.addr,t)}function Og(n,e){const t=ns(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function zg(n,e){const t=ns(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function kg(n,e){const t=ns(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function Bg(n,e){n.uniform1iv(this.addr,e)}function Hg(n,e){n.uniform2iv(this.addr,e)}function Gg(n,e){n.uniform3iv(this.addr,e)}function Vg(n,e){n.uniform4iv(this.addr,e)}function $g(n,e){n.uniform1uiv(this.addr,e)}function Wg(n,e){n.uniform2uiv(this.addr,e)}function jg(n,e){n.uniform3uiv(this.addr,e)}function Xg(n,e){n.uniform4uiv(this.addr,e)}function qg(n,e,t){const i=this.cache,s=e.length,r=zr(t,s);Dt(i,r)||(n.uniform1iv(this.addr,r),It(i,r));for(let a=0;a!==s;++a)t.setTexture2D(e[a]||ad,r[a])}function Yg(n,e,t){const i=this.cache,s=e.length,r=zr(t,s);Dt(i,r)||(n.uniform1iv(this.addr,r),It(i,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||ld,r[a])}function Zg(n,e,t){const i=this.cache,s=e.length,r=zr(t,s);Dt(i,r)||(n.uniform1iv(this.addr,r),It(i,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||cd,r[a])}function Jg(n,e,t){const i=this.cache,s=e.length,r=zr(t,s);Dt(i,r)||(n.uniform1iv(this.addr,r),It(i,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||od,r[a])}function Kg(n){switch(n){case 5126:return Ig;case 35664:return Ug;case 35665:return Ng;case 35666:return Fg;case 35674:return Og;case 35675:return zg;case 35676:return kg;case 5124:case 35670:return Bg;case 35667:case 35671:return Hg;case 35668:case 35672:return Gg;case 35669:case 35673:return Vg;case 5125:return $g;case 36294:return Wg;case 36295:return jg;case 36296:return Xg;case 35678:case 36198:case 36298:case 36306:case 35682:return qg;case 35679:case 36299:case 36307:return Yg;case 35680:case 36300:case 36308:case 36293:return Zg;case 36289:case 36303:case 36311:case 36292:return Jg}}class Qg{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=Dg(t.type)}}class e_{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Kg(t.type)}}class t_{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(e,t[o.id],i)}}}const Sa=/(\w+)(\])?(\[|\.)?/g;function Xl(n,e){n.seq.push(e),n.map[e.id]=e}function n_(n,e,t){const i=n.name,s=i.length;for(Sa.lastIndex=0;;){const r=Sa.exec(i),a=Sa.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){Xl(t,c===void 0?new Qg(o,n,e):new e_(o,n,e));break}else{let u=t.map[o];u===void 0&&(u=new t_(o),Xl(t,u)),t=u}}}class wr{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<i;++s){const r=e.getActiveUniform(t,s),a=e.getUniformLocation(t,r.name);n_(r,a,this)}}setValue(e,t,i,s){const r=this.map[t];r!==void 0&&r.setValue(e,i,s)}setOptional(e,t,i){const s=t[i];s!==void 0&&this.setValue(e,i,s)}static upload(e,t,i,s){for(let r=0,a=t.length;r!==a;++r){const o=t[r],l=i[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){const i=[];for(let s=0,r=e.length;s!==r;++s){const a=e[s];a.id in t&&i.push(a)}return i}}function ql(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const i_=37297;let s_=0;function r_(n,e){const t=n.split(`
`),i=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){const o=a+1;i.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return i.join(`
`)}const Yl=new $e;function a_(n){tt._getMatrix(Yl,tt.workingColorSpace,n);const e=`mat3( ${Yl.elements.map(t=>t.toFixed(4))} )`;switch(tt.getTransfer(n)){case Ar:return[e,"LinearTransferOETF"];case ot:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function Zl(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),r=(n.getShaderInfoLog(e)||"").trim();if(i&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+r_(n.getShaderSource(e),o)}else return r}function o_(n,e){const t=a_(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function l_(n,e){let t;switch(e){case Ru:t="Linear";break;case Pu:t="Reinhard";break;case Lu:t="Cineon";break;case Du:t="ACESFilmic";break;case Uu:t="AgX";break;case Nu:t="Neutral";break;case Iu:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const mr=new D;function c_(){tt.getLuminanceCoefficients(mr);const n=mr.x.toFixed(4),e=mr.y.toFixed(4),t=mr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function d_(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ms).join(`
`)}function u_(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function h_(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const r=n.getActiveAttrib(e,s),a=r.name;let o=1;r.type===n.FLOAT_MAT2&&(o=2),r.type===n.FLOAT_MAT3&&(o=3),r.type===n.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:n.getAttribLocation(e,a),locationSize:o}}return t}function ms(n){return n!==""}function Jl(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Kl(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const p_=/^[ \t]*#include +<([\w\d./]+)>/gm;function Eo(n){return n.replace(p_,m_)}const f_=new Map;function m_(n,e){let t=We[e];if(t===void 0){const i=f_.get(e);if(i!==void 0)t=We[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return Eo(t)}const g_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Ql(n){return n.replace(g_,__)}function __(n,e,t,i){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function ec(n){let e=`precision ${n.precision} float;
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
#define LOW_PRECISION`),e}function v_(n){let e="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===Ec?e="SHADOWMAP_TYPE_PCF":n.shadowMapType===lu?e="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===Fn&&(e="SHADOWMAP_TYPE_VSM"),e}function x_(n){let e="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case qi:case Yi:e="ENVMAP_TYPE_CUBE";break;case Ur:e="ENVMAP_TYPE_CUBE_UV";break}return e}function y_(n){let e="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case Yi:e="ENVMAP_MODE_REFRACTION";break}return e}function b_(n){let e="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case wc:e="ENVMAP_BLENDING_MULTIPLY";break;case Au:e="ENVMAP_BLENDING_MIX";break;case Cu:e="ENVMAP_BLENDING_ADD";break}return e}function M_(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function S_(n,e,t,i){const s=n.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=v_(t),c=x_(t),d=y_(t),u=b_(t),h=M_(t),m=d_(t),_=u_(r),x=s.createProgram();let f,p,y=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(ms).join(`
`),f.length>0&&(f+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(ms).join(`
`),p.length>0&&(p+=`
`)):(f=[ec(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+d:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ms).join(`
`),p=[ec(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+d:"",t.envMap?"#define "+u:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Qn?"#define TONE_MAPPING":"",t.toneMapping!==Qn?We.tonemapping_pars_fragment:"",t.toneMapping!==Qn?l_("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",We.colorspace_pars_fragment,o_("linearToOutputTexel",t.outputColorSpace),c_(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(ms).join(`
`)),a=Eo(a),a=Jl(a,t),a=Kl(a,t),o=Eo(o),o=Jl(o,t),o=Kl(o,t),a=Ql(a),o=Ql(o),t.isRawShaderMaterial!==!0&&(y=`#version 300 es
`,f=[m,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+f,p=["#define varying in",t.glslVersion===nl?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===nl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const v=y+f+a,g=y+p+o,E=ql(s,s.VERTEX_SHADER,v),T=ql(s,s.FRAGMENT_SHADER,g);s.attachShader(x,E),s.attachShader(x,T),t.index0AttributeName!==void 0?s.bindAttribLocation(x,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(x,0,"position"),s.linkProgram(x);function S(R){if(n.debug.checkShaderErrors){const U=s.getProgramInfoLog(x)||"",L=s.getShaderInfoLog(E)||"",k=s.getShaderInfoLog(T)||"",F=U.trim(),O=L.trim(),H=k.trim();let $=!0,ee=!0;if(s.getProgramParameter(x,s.LINK_STATUS)===!1)if($=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,x,E,T);else{const pe=Zl(s,E,"vertex"),ge=Zl(s,T,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(x,s.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+F+`
`+pe+`
`+ge)}else F!==""?console.warn("THREE.WebGLProgram: Program Info Log:",F):(O===""||H==="")&&(ee=!1);ee&&(R.diagnostics={runnable:$,programLog:F,vertexShader:{log:O,prefix:f},fragmentShader:{log:H,prefix:p}})}s.deleteShader(E),s.deleteShader(T),A=new wr(s,x),M=h_(s,x)}let A;this.getUniforms=function(){return A===void 0&&S(this),A};let M;this.getAttributes=function(){return M===void 0&&S(this),M};let b=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return b===!1&&(b=s.getProgramParameter(x,i_)),b},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(x),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=s_++,this.cacheKey=e,this.usedTimes=1,this.program=x,this.vertexShader=E,this.fragmentShader=T,this}let E_=0;class w_{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(i),a=this._getShaderCacheForMaterial(e);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new T_(e),t.set(e,i)),i}}class T_{constructor(e){this.id=E_++,this.code=e,this.usedTimes=0}}function A_(n,e,t,i,s,r,a){const o=new Uo,l=new w_,c=new Set,d=[],u=s.logarithmicDepthBuffer,h=s.vertexTextures;let m=s.precision;const _={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(M){return c.add(M),M===0?"uv":`uv${M}`}function f(M,b,R,U,L){const k=U.fog,F=L.geometry,O=M.isMeshStandardMaterial?U.environment:null,H=(M.isMeshStandardMaterial?t:e).get(M.envMap||O),$=H&&H.mapping===Ur?H.image.height:null,ee=_[M.type];M.precision!==null&&(m=s.getMaxPrecision(M.precision),m!==M.precision&&console.warn("THREE.WebGLProgram.getParameters:",M.precision,"not supported, using",m,"instead."));const pe=F.morphAttributes.position||F.morphAttributes.normal||F.morphAttributes.color,ge=pe!==void 0?pe.length:0;let Oe=0;F.morphAttributes.position!==void 0&&(Oe=1),F.morphAttributes.normal!==void 0&&(Oe=2),F.morphAttributes.color!==void 0&&(Oe=3);let qe,Qe,Ke,Y;if(ee){const nt=Mn[ee];qe=nt.vertexShader,Qe=nt.fragmentShader}else qe=M.vertexShader,Qe=M.fragmentShader,l.update(M),Ke=l.getVertexShaderID(M),Y=l.getFragmentShaderID(M);const ie=n.getRenderTarget(),Se=n.state.buffers.depth.getReversed(),De=L.isInstancedMesh===!0,Te=L.isBatchedMesh===!0,Ye=!!M.map,mt=!!M.matcap,I=!!H,ne=!!M.aoMap,K=!!M.lightMap,J=!!M.bumpMap,Z=!!M.normalMap,ue=!!M.displacementMap,se=!!M.emissiveMap,he=!!M.metalnessMap,He=!!M.roughnessMap,ke=M.anisotropy>0,P=M.clearcoat>0,w=M.dispersion>0,V=M.iridescence>0,X=M.sheen>0,te=M.transmission>0,q=ke&&!!M.anisotropyMap,Pe=P&&!!M.clearcoatMap,de=P&&!!M.clearcoatNormalMap,Ae=P&&!!M.clearcoatRoughnessMap,Ce=V&&!!M.iridescenceMap,re=V&&!!M.iridescenceThicknessMap,xe=X&&!!M.sheenColorMap,Fe=X&&!!M.sheenRoughnessMap,Le=!!M.specularMap,_e=!!M.specularColorMap,Ve=!!M.specularIntensityMap,z=te&&!!M.transmissionMap,ce=te&&!!M.thicknessMap,fe=!!M.gradientMap,Ee=!!M.alphaMap,ae=M.alphaTest>0,Q=!!M.alphaHash,Re=!!M.extensions;let Ge=Qn;M.toneMapped&&(ie===null||ie.isXRRenderTarget===!0)&&(Ge=n.toneMapping);const gt={shaderID:ee,shaderType:M.type,shaderName:M.name,vertexShader:qe,fragmentShader:Qe,defines:M.defines,customVertexShaderID:Ke,customFragmentShaderID:Y,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:m,batching:Te,batchingColor:Te&&L._colorsTexture!==null,instancing:De,instancingColor:De&&L.instanceColor!==null,instancingMorph:De&&L.morphTexture!==null,supportsVertexTextures:h,outputColorSpace:ie===null?n.outputColorSpace:ie.isXRRenderTarget===!0?ie.texture.colorSpace:Zi,alphaToCoverage:!!M.alphaToCoverage,map:Ye,matcap:mt,envMap:I,envMapMode:I&&H.mapping,envMapCubeUVHeight:$,aoMap:ne,lightMap:K,bumpMap:J,normalMap:Z,displacementMap:h&&ue,emissiveMap:se,normalMapObjectSpace:Z&&M.normalMapType===ku,normalMapTangentSpace:Z&&M.normalMapType===Nc,metalnessMap:he,roughnessMap:He,anisotropy:ke,anisotropyMap:q,clearcoat:P,clearcoatMap:Pe,clearcoatNormalMap:de,clearcoatRoughnessMap:Ae,dispersion:w,iridescence:V,iridescenceMap:Ce,iridescenceThicknessMap:re,sheen:X,sheenColorMap:xe,sheenRoughnessMap:Fe,specularMap:Le,specularColorMap:_e,specularIntensityMap:Ve,transmission:te,transmissionMap:z,thicknessMap:ce,gradientMap:fe,opaque:M.transparent===!1&&M.blending===Wi&&M.alphaToCoverage===!1,alphaMap:Ee,alphaTest:ae,alphaHash:Q,combine:M.combine,mapUv:Ye&&x(M.map.channel),aoMapUv:ne&&x(M.aoMap.channel),lightMapUv:K&&x(M.lightMap.channel),bumpMapUv:J&&x(M.bumpMap.channel),normalMapUv:Z&&x(M.normalMap.channel),displacementMapUv:ue&&x(M.displacementMap.channel),emissiveMapUv:se&&x(M.emissiveMap.channel),metalnessMapUv:he&&x(M.metalnessMap.channel),roughnessMapUv:He&&x(M.roughnessMap.channel),anisotropyMapUv:q&&x(M.anisotropyMap.channel),clearcoatMapUv:Pe&&x(M.clearcoatMap.channel),clearcoatNormalMapUv:de&&x(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Ae&&x(M.clearcoatRoughnessMap.channel),iridescenceMapUv:Ce&&x(M.iridescenceMap.channel),iridescenceThicknessMapUv:re&&x(M.iridescenceThicknessMap.channel),sheenColorMapUv:xe&&x(M.sheenColorMap.channel),sheenRoughnessMapUv:Fe&&x(M.sheenRoughnessMap.channel),specularMapUv:Le&&x(M.specularMap.channel),specularColorMapUv:_e&&x(M.specularColorMap.channel),specularIntensityMapUv:Ve&&x(M.specularIntensityMap.channel),transmissionMapUv:z&&x(M.transmissionMap.channel),thicknessMapUv:ce&&x(M.thicknessMap.channel),alphaMapUv:Ee&&x(M.alphaMap.channel),vertexTangents:!!F.attributes.tangent&&(Z||ke),vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!F.attributes.color&&F.attributes.color.itemSize===4,pointsUvs:L.isPoints===!0&&!!F.attributes.uv&&(Ye||Ee),fog:!!k,useFog:M.fog===!0,fogExp2:!!k&&k.isFogExp2,flatShading:M.flatShading===!0&&M.wireframe===!1,sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:Se,skinning:L.isSkinnedMesh===!0,morphTargets:F.morphAttributes.position!==void 0,morphNormals:F.morphAttributes.normal!==void 0,morphColors:F.morphAttributes.color!==void 0,morphTargetsCount:ge,morphTextureStride:Oe,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:M.dithering,shadowMapEnabled:n.shadowMap.enabled&&R.length>0,shadowMapType:n.shadowMap.type,toneMapping:Ge,decodeVideoTexture:Ye&&M.map.isVideoTexture===!0&&tt.getTransfer(M.map.colorSpace)===ot,decodeVideoTextureEmissive:se&&M.emissiveMap.isVideoTexture===!0&&tt.getTransfer(M.emissiveMap.colorSpace)===ot,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===fn,flipSided:M.side===Kt,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionClipCullDistance:Re&&M.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Re&&M.extensions.multiDraw===!0||Te)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()};return gt.vertexUv1s=c.has(1),gt.vertexUv2s=c.has(2),gt.vertexUv3s=c.has(3),c.clear(),gt}function p(M){const b=[];if(M.shaderID?b.push(M.shaderID):(b.push(M.customVertexShaderID),b.push(M.customFragmentShaderID)),M.defines!==void 0)for(const R in M.defines)b.push(R),b.push(M.defines[R]);return M.isRawShaderMaterial===!1&&(y(b,M),v(b,M),b.push(n.outputColorSpace)),b.push(M.customProgramCacheKey),b.join()}function y(M,b){M.push(b.precision),M.push(b.outputColorSpace),M.push(b.envMapMode),M.push(b.envMapCubeUVHeight),M.push(b.mapUv),M.push(b.alphaMapUv),M.push(b.lightMapUv),M.push(b.aoMapUv),M.push(b.bumpMapUv),M.push(b.normalMapUv),M.push(b.displacementMapUv),M.push(b.emissiveMapUv),M.push(b.metalnessMapUv),M.push(b.roughnessMapUv),M.push(b.anisotropyMapUv),M.push(b.clearcoatMapUv),M.push(b.clearcoatNormalMapUv),M.push(b.clearcoatRoughnessMapUv),M.push(b.iridescenceMapUv),M.push(b.iridescenceThicknessMapUv),M.push(b.sheenColorMapUv),M.push(b.sheenRoughnessMapUv),M.push(b.specularMapUv),M.push(b.specularColorMapUv),M.push(b.specularIntensityMapUv),M.push(b.transmissionMapUv),M.push(b.thicknessMapUv),M.push(b.combine),M.push(b.fogExp2),M.push(b.sizeAttenuation),M.push(b.morphTargetsCount),M.push(b.morphAttributeCount),M.push(b.numDirLights),M.push(b.numPointLights),M.push(b.numSpotLights),M.push(b.numSpotLightMaps),M.push(b.numHemiLights),M.push(b.numRectAreaLights),M.push(b.numDirLightShadows),M.push(b.numPointLightShadows),M.push(b.numSpotLightShadows),M.push(b.numSpotLightShadowsWithMaps),M.push(b.numLightProbes),M.push(b.shadowMapType),M.push(b.toneMapping),M.push(b.numClippingPlanes),M.push(b.numClipIntersection),M.push(b.depthPacking)}function v(M,b){o.disableAll(),b.supportsVertexTextures&&o.enable(0),b.instancing&&o.enable(1),b.instancingColor&&o.enable(2),b.instancingMorph&&o.enable(3),b.matcap&&o.enable(4),b.envMap&&o.enable(5),b.normalMapObjectSpace&&o.enable(6),b.normalMapTangentSpace&&o.enable(7),b.clearcoat&&o.enable(8),b.iridescence&&o.enable(9),b.alphaTest&&o.enable(10),b.vertexColors&&o.enable(11),b.vertexAlphas&&o.enable(12),b.vertexUv1s&&o.enable(13),b.vertexUv2s&&o.enable(14),b.vertexUv3s&&o.enable(15),b.vertexTangents&&o.enable(16),b.anisotropy&&o.enable(17),b.alphaHash&&o.enable(18),b.batching&&o.enable(19),b.dispersion&&o.enable(20),b.batchingColor&&o.enable(21),b.gradientMap&&o.enable(22),M.push(o.mask),o.disableAll(),b.fog&&o.enable(0),b.useFog&&o.enable(1),b.flatShading&&o.enable(2),b.logarithmicDepthBuffer&&o.enable(3),b.reversedDepthBuffer&&o.enable(4),b.skinning&&o.enable(5),b.morphTargets&&o.enable(6),b.morphNormals&&o.enable(7),b.morphColors&&o.enable(8),b.premultipliedAlpha&&o.enable(9),b.shadowMapEnabled&&o.enable(10),b.doubleSided&&o.enable(11),b.flipSided&&o.enable(12),b.useDepthPacking&&o.enable(13),b.dithering&&o.enable(14),b.transmission&&o.enable(15),b.sheen&&o.enable(16),b.opaque&&o.enable(17),b.pointsUvs&&o.enable(18),b.decodeVideoTexture&&o.enable(19),b.decodeVideoTextureEmissive&&o.enable(20),b.alphaToCoverage&&o.enable(21),M.push(o.mask)}function g(M){const b=_[M.type];let R;if(b){const U=Mn[b];R=mh.clone(U.uniforms)}else R=M.uniforms;return R}function E(M,b){let R;for(let U=0,L=d.length;U<L;U++){const k=d[U];if(k.cacheKey===b){R=k,++R.usedTimes;break}}return R===void 0&&(R=new S_(n,b,M,r),d.push(R)),R}function T(M){if(--M.usedTimes===0){const b=d.indexOf(M);d[b]=d[d.length-1],d.pop(),M.destroy()}}function S(M){l.remove(M)}function A(){l.dispose()}return{getParameters:f,getProgramCacheKey:p,getUniforms:g,acquireProgram:E,releaseProgram:T,releaseShaderCache:S,programs:d,dispose:A}}function C_(){let n=new WeakMap;function e(a){return n.has(a)}function t(a){let o=n.get(a);return o===void 0&&(o={},n.set(a,o)),o}function i(a){n.delete(a)}function s(a,o,l){n.get(a)[o]=l}function r(){n=new WeakMap}return{has:e,get:t,remove:i,update:s,dispose:r}}function R_(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.z!==e.z?n.z-e.z:n.id-e.id}function tc(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function nc(){const n=[];let e=0;const t=[],i=[],s=[];function r(){e=0,t.length=0,i.length=0,s.length=0}function a(u,h,m,_,x,f){let p=n[e];return p===void 0?(p={id:u.id,object:u,geometry:h,material:m,groupOrder:_,renderOrder:u.renderOrder,z:x,group:f},n[e]=p):(p.id=u.id,p.object=u,p.geometry=h,p.material=m,p.groupOrder=_,p.renderOrder=u.renderOrder,p.z=x,p.group=f),e++,p}function o(u,h,m,_,x,f){const p=a(u,h,m,_,x,f);m.transmission>0?i.push(p):m.transparent===!0?s.push(p):t.push(p)}function l(u,h,m,_,x,f){const p=a(u,h,m,_,x,f);m.transmission>0?i.unshift(p):m.transparent===!0?s.unshift(p):t.unshift(p)}function c(u,h){t.length>1&&t.sort(u||R_),i.length>1&&i.sort(h||tc),s.length>1&&s.sort(h||tc)}function d(){for(let u=e,h=n.length;u<h;u++){const m=n[u];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:i,transparent:s,init:r,push:o,unshift:l,finish:d,sort:c}}function P_(){let n=new WeakMap;function e(i,s){const r=n.get(i);let a;return r===void 0?(a=new nc,n.set(i,[a])):s>=r.length?(a=new nc,r.push(a)):a=r[s],a}function t(){n=new WeakMap}return{get:e,dispose:t}}function L_(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new D,color:new Xe};break;case"SpotLight":t={position:new D,direction:new D,color:new Xe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new D,color:new Xe,distance:0,decay:0};break;case"HemisphereLight":t={direction:new D,skyColor:new Xe,groundColor:new Xe};break;case"RectAreaLight":t={color:new Xe,position:new D,halfWidth:new D,halfHeight:new D};break}return n[e.id]=t,t}}}function D_(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new oe};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new oe};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new oe,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let I_=0;function U_(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function N_(n){const e=new L_,t=D_(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new D);const s=new D,r=new dt,a=new dt;function o(c){let d=0,u=0,h=0;for(let M=0;M<9;M++)i.probe[M].set(0,0,0);let m=0,_=0,x=0,f=0,p=0,y=0,v=0,g=0,E=0,T=0,S=0;c.sort(U_);for(let M=0,b=c.length;M<b;M++){const R=c[M],U=R.color,L=R.intensity,k=R.distance,F=R.shadow&&R.shadow.map?R.shadow.map.texture:null;if(R.isAmbientLight)d+=U.r*L,u+=U.g*L,h+=U.b*L;else if(R.isLightProbe){for(let O=0;O<9;O++)i.probe[O].addScaledVector(R.sh.coefficients[O],L);S++}else if(R.isDirectionalLight){const O=e.get(R);if(O.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){const H=R.shadow,$=t.get(R);$.shadowIntensity=H.intensity,$.shadowBias=H.bias,$.shadowNormalBias=H.normalBias,$.shadowRadius=H.radius,$.shadowMapSize=H.mapSize,i.directionalShadow[m]=$,i.directionalShadowMap[m]=F,i.directionalShadowMatrix[m]=R.shadow.matrix,y++}i.directional[m]=O,m++}else if(R.isSpotLight){const O=e.get(R);O.position.setFromMatrixPosition(R.matrixWorld),O.color.copy(U).multiplyScalar(L),O.distance=k,O.coneCos=Math.cos(R.angle),O.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),O.decay=R.decay,i.spot[x]=O;const H=R.shadow;if(R.map&&(i.spotLightMap[E]=R.map,E++,H.updateMatrices(R),R.castShadow&&T++),i.spotLightMatrix[x]=H.matrix,R.castShadow){const $=t.get(R);$.shadowIntensity=H.intensity,$.shadowBias=H.bias,$.shadowNormalBias=H.normalBias,$.shadowRadius=H.radius,$.shadowMapSize=H.mapSize,i.spotShadow[x]=$,i.spotShadowMap[x]=F,g++}x++}else if(R.isRectAreaLight){const O=e.get(R);O.color.copy(U).multiplyScalar(L),O.halfWidth.set(R.width*.5,0,0),O.halfHeight.set(0,R.height*.5,0),i.rectArea[f]=O,f++}else if(R.isPointLight){const O=e.get(R);if(O.color.copy(R.color).multiplyScalar(R.intensity),O.distance=R.distance,O.decay=R.decay,R.castShadow){const H=R.shadow,$=t.get(R);$.shadowIntensity=H.intensity,$.shadowBias=H.bias,$.shadowNormalBias=H.normalBias,$.shadowRadius=H.radius,$.shadowMapSize=H.mapSize,$.shadowCameraNear=H.camera.near,$.shadowCameraFar=H.camera.far,i.pointShadow[_]=$,i.pointShadowMap[_]=F,i.pointShadowMatrix[_]=R.shadow.matrix,v++}i.point[_]=O,_++}else if(R.isHemisphereLight){const O=e.get(R);O.skyColor.copy(R.color).multiplyScalar(L),O.groundColor.copy(R.groundColor).multiplyScalar(L),i.hemi[p]=O,p++}}f>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=me.LTC_FLOAT_1,i.rectAreaLTC2=me.LTC_FLOAT_2):(i.rectAreaLTC1=me.LTC_HALF_1,i.rectAreaLTC2=me.LTC_HALF_2)),i.ambient[0]=d,i.ambient[1]=u,i.ambient[2]=h;const A=i.hash;(A.directionalLength!==m||A.pointLength!==_||A.spotLength!==x||A.rectAreaLength!==f||A.hemiLength!==p||A.numDirectionalShadows!==y||A.numPointShadows!==v||A.numSpotShadows!==g||A.numSpotMaps!==E||A.numLightProbes!==S)&&(i.directional.length=m,i.spot.length=x,i.rectArea.length=f,i.point.length=_,i.hemi.length=p,i.directionalShadow.length=y,i.directionalShadowMap.length=y,i.pointShadow.length=v,i.pointShadowMap.length=v,i.spotShadow.length=g,i.spotShadowMap.length=g,i.directionalShadowMatrix.length=y,i.pointShadowMatrix.length=v,i.spotLightMatrix.length=g+E-T,i.spotLightMap.length=E,i.numSpotLightShadowsWithMaps=T,i.numLightProbes=S,A.directionalLength=m,A.pointLength=_,A.spotLength=x,A.rectAreaLength=f,A.hemiLength=p,A.numDirectionalShadows=y,A.numPointShadows=v,A.numSpotShadows=g,A.numSpotMaps=E,A.numLightProbes=S,i.version=I_++)}function l(c,d){let u=0,h=0,m=0,_=0,x=0;const f=d.matrixWorldInverse;for(let p=0,y=c.length;p<y;p++){const v=c[p];if(v.isDirectionalLight){const g=i.directional[u];g.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),g.direction.sub(s),g.direction.transformDirection(f),u++}else if(v.isSpotLight){const g=i.spot[m];g.position.setFromMatrixPosition(v.matrixWorld),g.position.applyMatrix4(f),g.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),g.direction.sub(s),g.direction.transformDirection(f),m++}else if(v.isRectAreaLight){const g=i.rectArea[_];g.position.setFromMatrixPosition(v.matrixWorld),g.position.applyMatrix4(f),a.identity(),r.copy(v.matrixWorld),r.premultiply(f),a.extractRotation(r),g.halfWidth.set(v.width*.5,0,0),g.halfHeight.set(0,v.height*.5,0),g.halfWidth.applyMatrix4(a),g.halfHeight.applyMatrix4(a),_++}else if(v.isPointLight){const g=i.point[h];g.position.setFromMatrixPosition(v.matrixWorld),g.position.applyMatrix4(f),h++}else if(v.isHemisphereLight){const g=i.hemi[x];g.direction.setFromMatrixPosition(v.matrixWorld),g.direction.transformDirection(f),x++}}}return{setup:o,setupView:l,state:i}}function ic(n){const e=new N_(n),t=[],i=[];function s(d){c.camera=d,t.length=0,i.length=0}function r(d){t.push(d)}function a(d){i.push(d)}function o(){e.setup(t)}function l(d){e.setupView(t,d)}const c={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:o,setupLightsView:l,pushLight:r,pushShadow:a}}function F_(n){let e=new WeakMap;function t(s,r=0){const a=e.get(s);let o;return a===void 0?(o=new ic(n),e.set(s,[o])):r>=a.length?(o=new ic(n),a.push(o)):o=a[r],o}function i(){e=new WeakMap}return{get:t,dispose:i}}const O_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,z_=`uniform sampler2D shadow_pass;
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
}`;function k_(n,e,t){let i=new No;const s=new oe,r=new oe,a=new Tt,o=new rp({depthPacking:zu}),l=new ap,c={},d=t.maxTextureSize,u={[ei]:Kt,[Kt]:ei,[fn]:fn},h=new ti({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new oe},radius:{value:4}},vertexShader:O_,fragmentShader:z_}),m=h.clone();m.defines.HORIZONTAL_PASS=1;const _=new Ft;_.setAttribute("position",new Tn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const x=new be(_,h),f=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Ec;let p=this.type;this.render=function(T,S,A){if(f.enabled===!1||f.autoUpdate===!1&&f.needsUpdate===!1||T.length===0)return;const M=n.getRenderTarget(),b=n.getActiveCubeFace(),R=n.getActiveMipmapLevel(),U=n.state;U.setBlending(Kn),U.buffers.depth.getReversed()===!0?U.buffers.color.setClear(0,0,0,0):U.buffers.color.setClear(1,1,1,1),U.buffers.depth.setTest(!0),U.setScissorTest(!1);const L=p!==Fn&&this.type===Fn,k=p===Fn&&this.type!==Fn;for(let F=0,O=T.length;F<O;F++){const H=T[F],$=H.shadow;if($===void 0){console.warn("THREE.WebGLShadowMap:",H,"has no shadow.");continue}if($.autoUpdate===!1&&$.needsUpdate===!1)continue;s.copy($.mapSize);const ee=$.getFrameExtents();if(s.multiply(ee),r.copy($.mapSize),(s.x>d||s.y>d)&&(s.x>d&&(r.x=Math.floor(d/ee.x),s.x=r.x*ee.x,$.mapSize.x=r.x),s.y>d&&(r.y=Math.floor(d/ee.y),s.y=r.y*ee.y,$.mapSize.y=r.y)),$.map===null||L===!0||k===!0){const ge=this.type!==Fn?{minFilter:gn,magFilter:gn}:{};$.map!==null&&$.map.dispose(),$.map=new bi(s.x,s.y,ge),$.map.texture.name=H.name+".shadowMap",$.camera.updateProjectionMatrix()}n.setRenderTarget($.map),n.clear();const pe=$.getViewportCount();for(let ge=0;ge<pe;ge++){const Oe=$.getViewport(ge);a.set(r.x*Oe.x,r.y*Oe.y,r.x*Oe.z,r.y*Oe.w),U.viewport(a),$.updateMatrices(H,ge),i=$.getFrustum(),g(S,A,$.camera,H,this.type)}$.isPointLightShadow!==!0&&this.type===Fn&&y($,A),$.needsUpdate=!1}p=this.type,f.needsUpdate=!1,n.setRenderTarget(M,b,R)};function y(T,S){const A=e.update(x);h.defines.VSM_SAMPLES!==T.blurSamples&&(h.defines.VSM_SAMPLES=T.blurSamples,m.defines.VSM_SAMPLES=T.blurSamples,h.needsUpdate=!0,m.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new bi(s.x,s.y)),h.uniforms.shadow_pass.value=T.map.texture,h.uniforms.resolution.value=T.mapSize,h.uniforms.radius.value=T.radius,n.setRenderTarget(T.mapPass),n.clear(),n.renderBufferDirect(S,null,A,h,x,null),m.uniforms.shadow_pass.value=T.mapPass.texture,m.uniforms.resolution.value=T.mapSize,m.uniforms.radius.value=T.radius,n.setRenderTarget(T.map),n.clear(),n.renderBufferDirect(S,null,A,m,x,null)}function v(T,S,A,M){let b=null;const R=A.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(R!==void 0)b=R;else if(b=A.isPointLight===!0?l:o,n.localClippingEnabled&&S.clipShadows===!0&&Array.isArray(S.clippingPlanes)&&S.clippingPlanes.length!==0||S.displacementMap&&S.displacementScale!==0||S.alphaMap&&S.alphaTest>0||S.map&&S.alphaTest>0||S.alphaToCoverage===!0){const U=b.uuid,L=S.uuid;let k=c[U];k===void 0&&(k={},c[U]=k);let F=k[L];F===void 0&&(F=b.clone(),k[L]=F,S.addEventListener("dispose",E)),b=F}if(b.visible=S.visible,b.wireframe=S.wireframe,M===Fn?b.side=S.shadowSide!==null?S.shadowSide:S.side:b.side=S.shadowSide!==null?S.shadowSide:u[S.side],b.alphaMap=S.alphaMap,b.alphaTest=S.alphaToCoverage===!0?.5:S.alphaTest,b.map=S.map,b.clipShadows=S.clipShadows,b.clippingPlanes=S.clippingPlanes,b.clipIntersection=S.clipIntersection,b.displacementMap=S.displacementMap,b.displacementScale=S.displacementScale,b.displacementBias=S.displacementBias,b.wireframeLinewidth=S.wireframeLinewidth,b.linewidth=S.linewidth,A.isPointLight===!0&&b.isMeshDistanceMaterial===!0){const U=n.properties.get(b);U.light=A}return b}function g(T,S,A,M,b){if(T.visible===!1)return;if(T.layers.test(S.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&b===Fn)&&(!T.frustumCulled||i.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(A.matrixWorldInverse,T.matrixWorld);const L=e.update(T),k=T.material;if(Array.isArray(k)){const F=L.groups;for(let O=0,H=F.length;O<H;O++){const $=F[O],ee=k[$.materialIndex];if(ee&&ee.visible){const pe=v(T,ee,M,b);T.onBeforeShadow(n,T,S,A,L,pe,$),n.renderBufferDirect(A,null,L,pe,T,$),T.onAfterShadow(n,T,S,A,L,pe,$)}}}else if(k.visible){const F=v(T,k,M,b);T.onBeforeShadow(n,T,S,A,L,F,null),n.renderBufferDirect(A,null,L,F,T,null),T.onAfterShadow(n,T,S,A,L,F,null)}}const U=T.children;for(let L=0,k=U.length;L<k;L++)g(U[L],S,A,M,b)}function E(T){T.target.removeEventListener("dispose",E);for(const A in c){const M=c[A],b=T.target.uuid;b in M&&(M[b].dispose(),delete M[b])}}}const B_={[La]:Da,[Ia]:Fa,[Ua]:Oa,[Xi]:Na,[Da]:La,[Fa]:Ia,[Oa]:Ua,[Na]:Xi};function H_(n,e){function t(){let z=!1;const ce=new Tt;let fe=null;const Ee=new Tt(0,0,0,0);return{setMask:function(ae){fe!==ae&&!z&&(n.colorMask(ae,ae,ae,ae),fe=ae)},setLocked:function(ae){z=ae},setClear:function(ae,Q,Re,Ge,gt){gt===!0&&(ae*=Ge,Q*=Ge,Re*=Ge),ce.set(ae,Q,Re,Ge),Ee.equals(ce)===!1&&(n.clearColor(ae,Q,Re,Ge),Ee.copy(ce))},reset:function(){z=!1,fe=null,Ee.set(-1,0,0,0)}}}function i(){let z=!1,ce=!1,fe=null,Ee=null,ae=null;return{setReversed:function(Q){if(ce!==Q){const Re=e.get("EXT_clip_control");Q?Re.clipControlEXT(Re.LOWER_LEFT_EXT,Re.ZERO_TO_ONE_EXT):Re.clipControlEXT(Re.LOWER_LEFT_EXT,Re.NEGATIVE_ONE_TO_ONE_EXT),ce=Q;const Ge=ae;ae=null,this.setClear(Ge)}},getReversed:function(){return ce},setTest:function(Q){Q?ie(n.DEPTH_TEST):Se(n.DEPTH_TEST)},setMask:function(Q){fe!==Q&&!z&&(n.depthMask(Q),fe=Q)},setFunc:function(Q){if(ce&&(Q=B_[Q]),Ee!==Q){switch(Q){case La:n.depthFunc(n.NEVER);break;case Da:n.depthFunc(n.ALWAYS);break;case Ia:n.depthFunc(n.LESS);break;case Xi:n.depthFunc(n.LEQUAL);break;case Ua:n.depthFunc(n.EQUAL);break;case Na:n.depthFunc(n.GEQUAL);break;case Fa:n.depthFunc(n.GREATER);break;case Oa:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}Ee=Q}},setLocked:function(Q){z=Q},setClear:function(Q){ae!==Q&&(ce&&(Q=1-Q),n.clearDepth(Q),ae=Q)},reset:function(){z=!1,fe=null,Ee=null,ae=null,ce=!1}}}function s(){let z=!1,ce=null,fe=null,Ee=null,ae=null,Q=null,Re=null,Ge=null,gt=null;return{setTest:function(nt){z||(nt?ie(n.STENCIL_TEST):Se(n.STENCIL_TEST))},setMask:function(nt){ce!==nt&&!z&&(n.stencilMask(nt),ce=nt)},setFunc:function(nt,Rn,xn){(fe!==nt||Ee!==Rn||ae!==xn)&&(n.stencilFunc(nt,Rn,xn),fe=nt,Ee=Rn,ae=xn)},setOp:function(nt,Rn,xn){(Q!==nt||Re!==Rn||Ge!==xn)&&(n.stencilOp(nt,Rn,xn),Q=nt,Re=Rn,Ge=xn)},setLocked:function(nt){z=nt},setClear:function(nt){gt!==nt&&(n.clearStencil(nt),gt=nt)},reset:function(){z=!1,ce=null,fe=null,Ee=null,ae=null,Q=null,Re=null,Ge=null,gt=null}}}const r=new t,a=new i,o=new s,l=new WeakMap,c=new WeakMap;let d={},u={},h=new WeakMap,m=[],_=null,x=!1,f=null,p=null,y=null,v=null,g=null,E=null,T=null,S=new Xe(0,0,0),A=0,M=!1,b=null,R=null,U=null,L=null,k=null;const F=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let O=!1,H=0;const $=n.getParameter(n.VERSION);$.indexOf("WebGL")!==-1?(H=parseFloat(/^WebGL (\d)/.exec($)[1]),O=H>=1):$.indexOf("OpenGL ES")!==-1&&(H=parseFloat(/^OpenGL ES (\d)/.exec($)[1]),O=H>=2);let ee=null,pe={};const ge=n.getParameter(n.SCISSOR_BOX),Oe=n.getParameter(n.VIEWPORT),qe=new Tt().fromArray(ge),Qe=new Tt().fromArray(Oe);function Ke(z,ce,fe,Ee){const ae=new Uint8Array(4),Q=n.createTexture();n.bindTexture(z,Q),n.texParameteri(z,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(z,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Re=0;Re<fe;Re++)z===n.TEXTURE_3D||z===n.TEXTURE_2D_ARRAY?n.texImage3D(ce,0,n.RGBA,1,1,Ee,0,n.RGBA,n.UNSIGNED_BYTE,ae):n.texImage2D(ce+Re,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,ae);return Q}const Y={};Y[n.TEXTURE_2D]=Ke(n.TEXTURE_2D,n.TEXTURE_2D,1),Y[n.TEXTURE_CUBE_MAP]=Ke(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),Y[n.TEXTURE_2D_ARRAY]=Ke(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),Y[n.TEXTURE_3D]=Ke(n.TEXTURE_3D,n.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),ie(n.DEPTH_TEST),a.setFunc(Xi),J(!1),Z(Zo),ie(n.CULL_FACE),ne(Kn);function ie(z){d[z]!==!0&&(n.enable(z),d[z]=!0)}function Se(z){d[z]!==!1&&(n.disable(z),d[z]=!1)}function De(z,ce){return u[z]!==ce?(n.bindFramebuffer(z,ce),u[z]=ce,z===n.DRAW_FRAMEBUFFER&&(u[n.FRAMEBUFFER]=ce),z===n.FRAMEBUFFER&&(u[n.DRAW_FRAMEBUFFER]=ce),!0):!1}function Te(z,ce){let fe=m,Ee=!1;if(z){fe=h.get(ce),fe===void 0&&(fe=[],h.set(ce,fe));const ae=z.textures;if(fe.length!==ae.length||fe[0]!==n.COLOR_ATTACHMENT0){for(let Q=0,Re=ae.length;Q<Re;Q++)fe[Q]=n.COLOR_ATTACHMENT0+Q;fe.length=ae.length,Ee=!0}}else fe[0]!==n.BACK&&(fe[0]=n.BACK,Ee=!0);Ee&&n.drawBuffers(fe)}function Ye(z){return _!==z?(n.useProgram(z),_=z,!0):!1}const mt={[mi]:n.FUNC_ADD,[du]:n.FUNC_SUBTRACT,[uu]:n.FUNC_REVERSE_SUBTRACT};mt[hu]=n.MIN,mt[pu]=n.MAX;const I={[fu]:n.ZERO,[mu]:n.ONE,[gu]:n.SRC_COLOR,[Ra]:n.SRC_ALPHA,[Mu]:n.SRC_ALPHA_SATURATE,[yu]:n.DST_COLOR,[vu]:n.DST_ALPHA,[_u]:n.ONE_MINUS_SRC_COLOR,[Pa]:n.ONE_MINUS_SRC_ALPHA,[bu]:n.ONE_MINUS_DST_COLOR,[xu]:n.ONE_MINUS_DST_ALPHA,[Su]:n.CONSTANT_COLOR,[Eu]:n.ONE_MINUS_CONSTANT_COLOR,[wu]:n.CONSTANT_ALPHA,[Tu]:n.ONE_MINUS_CONSTANT_ALPHA};function ne(z,ce,fe,Ee,ae,Q,Re,Ge,gt,nt){if(z===Kn){x===!0&&(Se(n.BLEND),x=!1);return}if(x===!1&&(ie(n.BLEND),x=!0),z!==cu){if(z!==f||nt!==M){if((p!==mi||g!==mi)&&(n.blendEquation(n.FUNC_ADD),p=mi,g=mi),nt)switch(z){case Wi:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Jo:n.blendFunc(n.ONE,n.ONE);break;case Ko:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Qo:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",z);break}else switch(z){case Wi:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Jo:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case Ko:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Qo:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",z);break}y=null,v=null,E=null,T=null,S.set(0,0,0),A=0,f=z,M=nt}return}ae=ae||ce,Q=Q||fe,Re=Re||Ee,(ce!==p||ae!==g)&&(n.blendEquationSeparate(mt[ce],mt[ae]),p=ce,g=ae),(fe!==y||Ee!==v||Q!==E||Re!==T)&&(n.blendFuncSeparate(I[fe],I[Ee],I[Q],I[Re]),y=fe,v=Ee,E=Q,T=Re),(Ge.equals(S)===!1||gt!==A)&&(n.blendColor(Ge.r,Ge.g,Ge.b,gt),S.copy(Ge),A=gt),f=z,M=!1}function K(z,ce){z.side===fn?Se(n.CULL_FACE):ie(n.CULL_FACE);let fe=z.side===Kt;ce&&(fe=!fe),J(fe),z.blending===Wi&&z.transparent===!1?ne(Kn):ne(z.blending,z.blendEquation,z.blendSrc,z.blendDst,z.blendEquationAlpha,z.blendSrcAlpha,z.blendDstAlpha,z.blendColor,z.blendAlpha,z.premultipliedAlpha),a.setFunc(z.depthFunc),a.setTest(z.depthTest),a.setMask(z.depthWrite),r.setMask(z.colorWrite);const Ee=z.stencilWrite;o.setTest(Ee),Ee&&(o.setMask(z.stencilWriteMask),o.setFunc(z.stencilFunc,z.stencilRef,z.stencilFuncMask),o.setOp(z.stencilFail,z.stencilZFail,z.stencilZPass)),se(z.polygonOffset,z.polygonOffsetFactor,z.polygonOffsetUnits),z.alphaToCoverage===!0?ie(n.SAMPLE_ALPHA_TO_COVERAGE):Se(n.SAMPLE_ALPHA_TO_COVERAGE)}function J(z){b!==z&&(z?n.frontFace(n.CW):n.frontFace(n.CCW),b=z)}function Z(z){z!==au?(ie(n.CULL_FACE),z!==R&&(z===Zo?n.cullFace(n.BACK):z===ou?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):Se(n.CULL_FACE),R=z}function ue(z){z!==U&&(O&&n.lineWidth(z),U=z)}function se(z,ce,fe){z?(ie(n.POLYGON_OFFSET_FILL),(L!==ce||k!==fe)&&(n.polygonOffset(ce,fe),L=ce,k=fe)):Se(n.POLYGON_OFFSET_FILL)}function he(z){z?ie(n.SCISSOR_TEST):Se(n.SCISSOR_TEST)}function He(z){z===void 0&&(z=n.TEXTURE0+F-1),ee!==z&&(n.activeTexture(z),ee=z)}function ke(z,ce,fe){fe===void 0&&(ee===null?fe=n.TEXTURE0+F-1:fe=ee);let Ee=pe[fe];Ee===void 0&&(Ee={type:void 0,texture:void 0},pe[fe]=Ee),(Ee.type!==z||Ee.texture!==ce)&&(ee!==fe&&(n.activeTexture(fe),ee=fe),n.bindTexture(z,ce||Y[z]),Ee.type=z,Ee.texture=ce)}function P(){const z=pe[ee];z!==void 0&&z.type!==void 0&&(n.bindTexture(z.type,null),z.type=void 0,z.texture=void 0)}function w(){try{n.compressedTexImage2D(...arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function V(){try{n.compressedTexImage3D(...arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function X(){try{n.texSubImage2D(...arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function te(){try{n.texSubImage3D(...arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function q(){try{n.compressedTexSubImage2D(...arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function Pe(){try{n.compressedTexSubImage3D(...arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function de(){try{n.texStorage2D(...arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function Ae(){try{n.texStorage3D(...arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function Ce(){try{n.texImage2D(...arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function re(){try{n.texImage3D(...arguments)}catch(z){console.error("THREE.WebGLState:",z)}}function xe(z){qe.equals(z)===!1&&(n.scissor(z.x,z.y,z.z,z.w),qe.copy(z))}function Fe(z){Qe.equals(z)===!1&&(n.viewport(z.x,z.y,z.z,z.w),Qe.copy(z))}function Le(z,ce){let fe=c.get(ce);fe===void 0&&(fe=new WeakMap,c.set(ce,fe));let Ee=fe.get(z);Ee===void 0&&(Ee=n.getUniformBlockIndex(ce,z.name),fe.set(z,Ee))}function _e(z,ce){const Ee=c.get(ce).get(z);l.get(ce)!==Ee&&(n.uniformBlockBinding(ce,Ee,z.__bindingPointIndex),l.set(ce,Ee))}function Ve(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),a.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),d={},ee=null,pe={},u={},h=new WeakMap,m=[],_=null,x=!1,f=null,p=null,y=null,v=null,g=null,E=null,T=null,S=new Xe(0,0,0),A=0,M=!1,b=null,R=null,U=null,L=null,k=null,qe.set(0,0,n.canvas.width,n.canvas.height),Qe.set(0,0,n.canvas.width,n.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:ie,disable:Se,bindFramebuffer:De,drawBuffers:Te,useProgram:Ye,setBlending:ne,setMaterial:K,setFlipSided:J,setCullFace:Z,setLineWidth:ue,setPolygonOffset:se,setScissorTest:he,activeTexture:He,bindTexture:ke,unbindTexture:P,compressedTexImage2D:w,compressedTexImage3D:V,texImage2D:Ce,texImage3D:re,updateUBOMapping:Le,uniformBlockBinding:_e,texStorage2D:de,texStorage3D:Ae,texSubImage2D:X,texSubImage3D:te,compressedTexSubImage2D:q,compressedTexSubImage3D:Pe,scissor:xe,viewport:Fe,reset:Ve}}function G_(n,e,t,i,s,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new oe,d=new WeakMap;let u;const h=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function _(P,w){return m?new OffscreenCanvas(P,w):Rr("canvas")}function x(P,w,V){let X=1;const te=ke(P);if((te.width>V||te.height>V)&&(X=V/Math.max(te.width,te.height)),X<1)if(typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&P instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&P instanceof ImageBitmap||typeof VideoFrame<"u"&&P instanceof VideoFrame){const q=Math.floor(X*te.width),Pe=Math.floor(X*te.height);u===void 0&&(u=_(q,Pe));const de=w?_(q,Pe):u;return de.width=q,de.height=Pe,de.getContext("2d").drawImage(P,0,0,q,Pe),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+te.width+"x"+te.height+") to ("+q+"x"+Pe+")."),de}else return"data"in P&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+te.width+"x"+te.height+")."),P;return P}function f(P){return P.generateMipmaps}function p(P){n.generateMipmap(P)}function y(P){return P.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:P.isWebGL3DRenderTarget?n.TEXTURE_3D:P.isWebGLArrayRenderTarget||P.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function v(P,w,V,X,te=!1){if(P!==null){if(n[P]!==void 0)return n[P];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+P+"'")}let q=w;if(w===n.RED&&(V===n.FLOAT&&(q=n.R32F),V===n.HALF_FLOAT&&(q=n.R16F),V===n.UNSIGNED_BYTE&&(q=n.R8)),w===n.RED_INTEGER&&(V===n.UNSIGNED_BYTE&&(q=n.R8UI),V===n.UNSIGNED_SHORT&&(q=n.R16UI),V===n.UNSIGNED_INT&&(q=n.R32UI),V===n.BYTE&&(q=n.R8I),V===n.SHORT&&(q=n.R16I),V===n.INT&&(q=n.R32I)),w===n.RG&&(V===n.FLOAT&&(q=n.RG32F),V===n.HALF_FLOAT&&(q=n.RG16F),V===n.UNSIGNED_BYTE&&(q=n.RG8)),w===n.RG_INTEGER&&(V===n.UNSIGNED_BYTE&&(q=n.RG8UI),V===n.UNSIGNED_SHORT&&(q=n.RG16UI),V===n.UNSIGNED_INT&&(q=n.RG32UI),V===n.BYTE&&(q=n.RG8I),V===n.SHORT&&(q=n.RG16I),V===n.INT&&(q=n.RG32I)),w===n.RGB_INTEGER&&(V===n.UNSIGNED_BYTE&&(q=n.RGB8UI),V===n.UNSIGNED_SHORT&&(q=n.RGB16UI),V===n.UNSIGNED_INT&&(q=n.RGB32UI),V===n.BYTE&&(q=n.RGB8I),V===n.SHORT&&(q=n.RGB16I),V===n.INT&&(q=n.RGB32I)),w===n.RGBA_INTEGER&&(V===n.UNSIGNED_BYTE&&(q=n.RGBA8UI),V===n.UNSIGNED_SHORT&&(q=n.RGBA16UI),V===n.UNSIGNED_INT&&(q=n.RGBA32UI),V===n.BYTE&&(q=n.RGBA8I),V===n.SHORT&&(q=n.RGBA16I),V===n.INT&&(q=n.RGBA32I)),w===n.RGB&&(V===n.UNSIGNED_INT_5_9_9_9_REV&&(q=n.RGB9_E5),V===n.UNSIGNED_INT_10F_11F_11F_REV&&(q=n.R11F_G11F_B10F)),w===n.RGBA){const Pe=te?Ar:tt.getTransfer(X);V===n.FLOAT&&(q=n.RGBA32F),V===n.HALF_FLOAT&&(q=n.RGBA16F),V===n.UNSIGNED_BYTE&&(q=Pe===ot?n.SRGB8_ALPHA8:n.RGBA8),V===n.UNSIGNED_SHORT_4_4_4_4&&(q=n.RGBA4),V===n.UNSIGNED_SHORT_5_5_5_1&&(q=n.RGB5_A1)}return(q===n.R16F||q===n.R32F||q===n.RG16F||q===n.RG32F||q===n.RGBA16F||q===n.RGBA32F)&&e.get("EXT_color_buffer_float"),q}function g(P,w){let V;return P?w===null||w===yi||w===Ts?V=n.DEPTH24_STENCIL8:w===zn?V=n.DEPTH32F_STENCIL8:w===ws&&(V=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):w===null||w===yi||w===Ts?V=n.DEPTH_COMPONENT24:w===zn?V=n.DEPTH_COMPONENT32F:w===ws&&(V=n.DEPTH_COMPONENT16),V}function E(P,w){return f(P)===!0||P.isFramebufferTexture&&P.minFilter!==gn&&P.minFilter!==En?Math.log2(Math.max(w.width,w.height))+1:P.mipmaps!==void 0&&P.mipmaps.length>0?P.mipmaps.length:P.isCompressedTexture&&Array.isArray(P.image)?w.mipmaps.length:1}function T(P){const w=P.target;w.removeEventListener("dispose",T),A(w),w.isVideoTexture&&d.delete(w)}function S(P){const w=P.target;w.removeEventListener("dispose",S),b(w)}function A(P){const w=i.get(P);if(w.__webglInit===void 0)return;const V=P.source,X=h.get(V);if(X){const te=X[w.__cacheKey];te.usedTimes--,te.usedTimes===0&&M(P),Object.keys(X).length===0&&h.delete(V)}i.remove(P)}function M(P){const w=i.get(P);n.deleteTexture(w.__webglTexture);const V=P.source,X=h.get(V);delete X[w.__cacheKey],a.memory.textures--}function b(P){const w=i.get(P);if(P.depthTexture&&(P.depthTexture.dispose(),i.remove(P.depthTexture)),P.isWebGLCubeRenderTarget)for(let X=0;X<6;X++){if(Array.isArray(w.__webglFramebuffer[X]))for(let te=0;te<w.__webglFramebuffer[X].length;te++)n.deleteFramebuffer(w.__webglFramebuffer[X][te]);else n.deleteFramebuffer(w.__webglFramebuffer[X]);w.__webglDepthbuffer&&n.deleteRenderbuffer(w.__webglDepthbuffer[X])}else{if(Array.isArray(w.__webglFramebuffer))for(let X=0;X<w.__webglFramebuffer.length;X++)n.deleteFramebuffer(w.__webglFramebuffer[X]);else n.deleteFramebuffer(w.__webglFramebuffer);if(w.__webglDepthbuffer&&n.deleteRenderbuffer(w.__webglDepthbuffer),w.__webglMultisampledFramebuffer&&n.deleteFramebuffer(w.__webglMultisampledFramebuffer),w.__webglColorRenderbuffer)for(let X=0;X<w.__webglColorRenderbuffer.length;X++)w.__webglColorRenderbuffer[X]&&n.deleteRenderbuffer(w.__webglColorRenderbuffer[X]);w.__webglDepthRenderbuffer&&n.deleteRenderbuffer(w.__webglDepthRenderbuffer)}const V=P.textures;for(let X=0,te=V.length;X<te;X++){const q=i.get(V[X]);q.__webglTexture&&(n.deleteTexture(q.__webglTexture),a.memory.textures--),i.remove(V[X])}i.remove(P)}let R=0;function U(){R=0}function L(){const P=R;return P>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+P+" texture units while this GPU supports only "+s.maxTextures),R+=1,P}function k(P){const w=[];return w.push(P.wrapS),w.push(P.wrapT),w.push(P.wrapR||0),w.push(P.magFilter),w.push(P.minFilter),w.push(P.anisotropy),w.push(P.internalFormat),w.push(P.format),w.push(P.type),w.push(P.generateMipmaps),w.push(P.premultiplyAlpha),w.push(P.flipY),w.push(P.unpackAlignment),w.push(P.colorSpace),w.join()}function F(P,w){const V=i.get(P);if(P.isVideoTexture&&he(P),P.isRenderTargetTexture===!1&&P.isExternalTexture!==!0&&P.version>0&&V.__version!==P.version){const X=P.image;if(X===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(X.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Y(V,P,w);return}}else P.isExternalTexture&&(V.__webglTexture=P.sourceTexture?P.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,V.__webglTexture,n.TEXTURE0+w)}function O(P,w){const V=i.get(P);if(P.isRenderTargetTexture===!1&&P.version>0&&V.__version!==P.version){Y(V,P,w);return}t.bindTexture(n.TEXTURE_2D_ARRAY,V.__webglTexture,n.TEXTURE0+w)}function H(P,w){const V=i.get(P);if(P.isRenderTargetTexture===!1&&P.version>0&&V.__version!==P.version){Y(V,P,w);return}t.bindTexture(n.TEXTURE_3D,V.__webglTexture,n.TEXTURE0+w)}function $(P,w){const V=i.get(P);if(P.version>0&&V.__version!==P.version){ie(V,P,w);return}t.bindTexture(n.TEXTURE_CUBE_MAP,V.__webglTexture,n.TEXTURE0+w)}const ee={[Ba]:n.REPEAT,[vi]:n.CLAMP_TO_EDGE,[Ha]:n.MIRRORED_REPEAT},pe={[gn]:n.NEAREST,[Fu]:n.NEAREST_MIPMAP_NEAREST,[Hs]:n.NEAREST_MIPMAP_LINEAR,[En]:n.LINEAR,[Gr]:n.LINEAR_MIPMAP_NEAREST,[xi]:n.LINEAR_MIPMAP_LINEAR},ge={[Bu]:n.NEVER,[ju]:n.ALWAYS,[Hu]:n.LESS,[Fc]:n.LEQUAL,[Gu]:n.EQUAL,[Wu]:n.GEQUAL,[Vu]:n.GREATER,[$u]:n.NOTEQUAL};function Oe(P,w){if(w.type===zn&&e.has("OES_texture_float_linear")===!1&&(w.magFilter===En||w.magFilter===Gr||w.magFilter===Hs||w.magFilter===xi||w.minFilter===En||w.minFilter===Gr||w.minFilter===Hs||w.minFilter===xi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(P,n.TEXTURE_WRAP_S,ee[w.wrapS]),n.texParameteri(P,n.TEXTURE_WRAP_T,ee[w.wrapT]),(P===n.TEXTURE_3D||P===n.TEXTURE_2D_ARRAY)&&n.texParameteri(P,n.TEXTURE_WRAP_R,ee[w.wrapR]),n.texParameteri(P,n.TEXTURE_MAG_FILTER,pe[w.magFilter]),n.texParameteri(P,n.TEXTURE_MIN_FILTER,pe[w.minFilter]),w.compareFunction&&(n.texParameteri(P,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(P,n.TEXTURE_COMPARE_FUNC,ge[w.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(w.magFilter===gn||w.minFilter!==Hs&&w.minFilter!==xi||w.type===zn&&e.has("OES_texture_float_linear")===!1)return;if(w.anisotropy>1||i.get(w).__currentAnisotropy){const V=e.get("EXT_texture_filter_anisotropic");n.texParameterf(P,V.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(w.anisotropy,s.getMaxAnisotropy())),i.get(w).__currentAnisotropy=w.anisotropy}}}function qe(P,w){let V=!1;P.__webglInit===void 0&&(P.__webglInit=!0,w.addEventListener("dispose",T));const X=w.source;let te=h.get(X);te===void 0&&(te={},h.set(X,te));const q=k(w);if(q!==P.__cacheKey){te[q]===void 0&&(te[q]={texture:n.createTexture(),usedTimes:0},a.memory.textures++,V=!0),te[q].usedTimes++;const Pe=te[P.__cacheKey];Pe!==void 0&&(te[P.__cacheKey].usedTimes--,Pe.usedTimes===0&&M(w)),P.__cacheKey=q,P.__webglTexture=te[q].texture}return V}function Qe(P,w,V){return Math.floor(Math.floor(P/V)/w)}function Ke(P,w,V,X){const q=P.updateRanges;if(q.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,w.width,w.height,V,X,w.data);else{q.sort((re,xe)=>re.start-xe.start);let Pe=0;for(let re=1;re<q.length;re++){const xe=q[Pe],Fe=q[re],Le=xe.start+xe.count,_e=Qe(Fe.start,w.width,4),Ve=Qe(xe.start,w.width,4);Fe.start<=Le+1&&_e===Ve&&Qe(Fe.start+Fe.count-1,w.width,4)===_e?xe.count=Math.max(xe.count,Fe.start+Fe.count-xe.start):(++Pe,q[Pe]=Fe)}q.length=Pe+1;const de=n.getParameter(n.UNPACK_ROW_LENGTH),Ae=n.getParameter(n.UNPACK_SKIP_PIXELS),Ce=n.getParameter(n.UNPACK_SKIP_ROWS);n.pixelStorei(n.UNPACK_ROW_LENGTH,w.width);for(let re=0,xe=q.length;re<xe;re++){const Fe=q[re],Le=Math.floor(Fe.start/4),_e=Math.ceil(Fe.count/4),Ve=Le%w.width,z=Math.floor(Le/w.width),ce=_e,fe=1;n.pixelStorei(n.UNPACK_SKIP_PIXELS,Ve),n.pixelStorei(n.UNPACK_SKIP_ROWS,z),t.texSubImage2D(n.TEXTURE_2D,0,Ve,z,ce,fe,V,X,w.data)}P.clearUpdateRanges(),n.pixelStorei(n.UNPACK_ROW_LENGTH,de),n.pixelStorei(n.UNPACK_SKIP_PIXELS,Ae),n.pixelStorei(n.UNPACK_SKIP_ROWS,Ce)}}function Y(P,w,V){let X=n.TEXTURE_2D;(w.isDataArrayTexture||w.isCompressedArrayTexture)&&(X=n.TEXTURE_2D_ARRAY),w.isData3DTexture&&(X=n.TEXTURE_3D);const te=qe(P,w),q=w.source;t.bindTexture(X,P.__webglTexture,n.TEXTURE0+V);const Pe=i.get(q);if(q.version!==Pe.__version||te===!0){t.activeTexture(n.TEXTURE0+V);const de=tt.getPrimaries(tt.workingColorSpace),Ae=w.colorSpace===Jn?null:tt.getPrimaries(w.colorSpace),Ce=w.colorSpace===Jn||de===Ae?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,w.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,w.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ce);let re=x(w.image,!1,s.maxTextureSize);re=He(w,re);const xe=r.convert(w.format,w.colorSpace),Fe=r.convert(w.type);let Le=v(w.internalFormat,xe,Fe,w.colorSpace,w.isVideoTexture);Oe(X,w);let _e;const Ve=w.mipmaps,z=w.isVideoTexture!==!0,ce=Pe.__version===void 0||te===!0,fe=q.dataReady,Ee=E(w,re);if(w.isDepthTexture)Le=g(w.format===Cs,w.type),ce&&(z?t.texStorage2D(n.TEXTURE_2D,1,Le,re.width,re.height):t.texImage2D(n.TEXTURE_2D,0,Le,re.width,re.height,0,xe,Fe,null));else if(w.isDataTexture)if(Ve.length>0){z&&ce&&t.texStorage2D(n.TEXTURE_2D,Ee,Le,Ve[0].width,Ve[0].height);for(let ae=0,Q=Ve.length;ae<Q;ae++)_e=Ve[ae],z?fe&&t.texSubImage2D(n.TEXTURE_2D,ae,0,0,_e.width,_e.height,xe,Fe,_e.data):t.texImage2D(n.TEXTURE_2D,ae,Le,_e.width,_e.height,0,xe,Fe,_e.data);w.generateMipmaps=!1}else z?(ce&&t.texStorage2D(n.TEXTURE_2D,Ee,Le,re.width,re.height),fe&&Ke(w,re,xe,Fe)):t.texImage2D(n.TEXTURE_2D,0,Le,re.width,re.height,0,xe,Fe,re.data);else if(w.isCompressedTexture)if(w.isCompressedArrayTexture){z&&ce&&t.texStorage3D(n.TEXTURE_2D_ARRAY,Ee,Le,Ve[0].width,Ve[0].height,re.depth);for(let ae=0,Q=Ve.length;ae<Q;ae++)if(_e=Ve[ae],w.format!==mn)if(xe!==null)if(z){if(fe)if(w.layerUpdates.size>0){const Re=Il(_e.width,_e.height,w.format,w.type);for(const Ge of w.layerUpdates){const gt=_e.data.subarray(Ge*Re/_e.data.BYTES_PER_ELEMENT,(Ge+1)*Re/_e.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,ae,0,0,Ge,_e.width,_e.height,1,xe,gt)}w.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,ae,0,0,0,_e.width,_e.height,re.depth,xe,_e.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,ae,Le,_e.width,_e.height,re.depth,0,_e.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else z?fe&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,ae,0,0,0,_e.width,_e.height,re.depth,xe,Fe,_e.data):t.texImage3D(n.TEXTURE_2D_ARRAY,ae,Le,_e.width,_e.height,re.depth,0,xe,Fe,_e.data)}else{z&&ce&&t.texStorage2D(n.TEXTURE_2D,Ee,Le,Ve[0].width,Ve[0].height);for(let ae=0,Q=Ve.length;ae<Q;ae++)_e=Ve[ae],w.format!==mn?xe!==null?z?fe&&t.compressedTexSubImage2D(n.TEXTURE_2D,ae,0,0,_e.width,_e.height,xe,_e.data):t.compressedTexImage2D(n.TEXTURE_2D,ae,Le,_e.width,_e.height,0,_e.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):z?fe&&t.texSubImage2D(n.TEXTURE_2D,ae,0,0,_e.width,_e.height,xe,Fe,_e.data):t.texImage2D(n.TEXTURE_2D,ae,Le,_e.width,_e.height,0,xe,Fe,_e.data)}else if(w.isDataArrayTexture)if(z){if(ce&&t.texStorage3D(n.TEXTURE_2D_ARRAY,Ee,Le,re.width,re.height,re.depth),fe)if(w.layerUpdates.size>0){const ae=Il(re.width,re.height,w.format,w.type);for(const Q of w.layerUpdates){const Re=re.data.subarray(Q*ae/re.data.BYTES_PER_ELEMENT,(Q+1)*ae/re.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,Q,re.width,re.height,1,xe,Fe,Re)}w.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,re.width,re.height,re.depth,xe,Fe,re.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,Le,re.width,re.height,re.depth,0,xe,Fe,re.data);else if(w.isData3DTexture)z?(ce&&t.texStorage3D(n.TEXTURE_3D,Ee,Le,re.width,re.height,re.depth),fe&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,re.width,re.height,re.depth,xe,Fe,re.data)):t.texImage3D(n.TEXTURE_3D,0,Le,re.width,re.height,re.depth,0,xe,Fe,re.data);else if(w.isFramebufferTexture){if(ce)if(z)t.texStorage2D(n.TEXTURE_2D,Ee,Le,re.width,re.height);else{let ae=re.width,Q=re.height;for(let Re=0;Re<Ee;Re++)t.texImage2D(n.TEXTURE_2D,Re,Le,ae,Q,0,xe,Fe,null),ae>>=1,Q>>=1}}else if(Ve.length>0){if(z&&ce){const ae=ke(Ve[0]);t.texStorage2D(n.TEXTURE_2D,Ee,Le,ae.width,ae.height)}for(let ae=0,Q=Ve.length;ae<Q;ae++)_e=Ve[ae],z?fe&&t.texSubImage2D(n.TEXTURE_2D,ae,0,0,xe,Fe,_e):t.texImage2D(n.TEXTURE_2D,ae,Le,xe,Fe,_e);w.generateMipmaps=!1}else if(z){if(ce){const ae=ke(re);t.texStorage2D(n.TEXTURE_2D,Ee,Le,ae.width,ae.height)}fe&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,xe,Fe,re)}else t.texImage2D(n.TEXTURE_2D,0,Le,xe,Fe,re);f(w)&&p(X),Pe.__version=q.version,w.onUpdate&&w.onUpdate(w)}P.__version=w.version}function ie(P,w,V){if(w.image.length!==6)return;const X=qe(P,w),te=w.source;t.bindTexture(n.TEXTURE_CUBE_MAP,P.__webglTexture,n.TEXTURE0+V);const q=i.get(te);if(te.version!==q.__version||X===!0){t.activeTexture(n.TEXTURE0+V);const Pe=tt.getPrimaries(tt.workingColorSpace),de=w.colorSpace===Jn?null:tt.getPrimaries(w.colorSpace),Ae=w.colorSpace===Jn||Pe===de?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,w.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,w.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ae);const Ce=w.isCompressedTexture||w.image[0].isCompressedTexture,re=w.image[0]&&w.image[0].isDataTexture,xe=[];for(let Q=0;Q<6;Q++)!Ce&&!re?xe[Q]=x(w.image[Q],!0,s.maxCubemapSize):xe[Q]=re?w.image[Q].image:w.image[Q],xe[Q]=He(w,xe[Q]);const Fe=xe[0],Le=r.convert(w.format,w.colorSpace),_e=r.convert(w.type),Ve=v(w.internalFormat,Le,_e,w.colorSpace),z=w.isVideoTexture!==!0,ce=q.__version===void 0||X===!0,fe=te.dataReady;let Ee=E(w,Fe);Oe(n.TEXTURE_CUBE_MAP,w);let ae;if(Ce){z&&ce&&t.texStorage2D(n.TEXTURE_CUBE_MAP,Ee,Ve,Fe.width,Fe.height);for(let Q=0;Q<6;Q++){ae=xe[Q].mipmaps;for(let Re=0;Re<ae.length;Re++){const Ge=ae[Re];w.format!==mn?Le!==null?z?fe&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Re,0,0,Ge.width,Ge.height,Le,Ge.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Re,Ve,Ge.width,Ge.height,0,Ge.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):z?fe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Re,0,0,Ge.width,Ge.height,Le,_e,Ge.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Re,Ve,Ge.width,Ge.height,0,Le,_e,Ge.data)}}}else{if(ae=w.mipmaps,z&&ce){ae.length>0&&Ee++;const Q=ke(xe[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,Ee,Ve,Q.width,Q.height)}for(let Q=0;Q<6;Q++)if(re){z?fe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,0,0,xe[Q].width,xe[Q].height,Le,_e,xe[Q].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,Ve,xe[Q].width,xe[Q].height,0,Le,_e,xe[Q].data);for(let Re=0;Re<ae.length;Re++){const gt=ae[Re].image[Q].image;z?fe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Re+1,0,0,gt.width,gt.height,Le,_e,gt.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Re+1,Ve,gt.width,gt.height,0,Le,_e,gt.data)}}else{z?fe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,0,0,Le,_e,xe[Q]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,Ve,Le,_e,xe[Q]);for(let Re=0;Re<ae.length;Re++){const Ge=ae[Re];z?fe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Re+1,0,0,Le,_e,Ge.image[Q]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Re+1,Ve,Le,_e,Ge.image[Q])}}}f(w)&&p(n.TEXTURE_CUBE_MAP),q.__version=te.version,w.onUpdate&&w.onUpdate(w)}P.__version=w.version}function Se(P,w,V,X,te,q){const Pe=r.convert(V.format,V.colorSpace),de=r.convert(V.type),Ae=v(V.internalFormat,Pe,de,V.colorSpace),Ce=i.get(w),re=i.get(V);if(re.__renderTarget=w,!Ce.__hasExternalTextures){const xe=Math.max(1,w.width>>q),Fe=Math.max(1,w.height>>q);te===n.TEXTURE_3D||te===n.TEXTURE_2D_ARRAY?t.texImage3D(te,q,Ae,xe,Fe,w.depth,0,Pe,de,null):t.texImage2D(te,q,Ae,xe,Fe,0,Pe,de,null)}t.bindFramebuffer(n.FRAMEBUFFER,P),se(w)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,X,te,re.__webglTexture,0,ue(w)):(te===n.TEXTURE_2D||te>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&te<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,X,te,re.__webglTexture,q),t.bindFramebuffer(n.FRAMEBUFFER,null)}function De(P,w,V){if(n.bindRenderbuffer(n.RENDERBUFFER,P),w.depthBuffer){const X=w.depthTexture,te=X&&X.isDepthTexture?X.type:null,q=g(w.stencilBuffer,te),Pe=w.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,de=ue(w);se(w)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,de,q,w.width,w.height):V?n.renderbufferStorageMultisample(n.RENDERBUFFER,de,q,w.width,w.height):n.renderbufferStorage(n.RENDERBUFFER,q,w.width,w.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,Pe,n.RENDERBUFFER,P)}else{const X=w.textures;for(let te=0;te<X.length;te++){const q=X[te],Pe=r.convert(q.format,q.colorSpace),de=r.convert(q.type),Ae=v(q.internalFormat,Pe,de,q.colorSpace),Ce=ue(w);V&&se(w)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Ce,Ae,w.width,w.height):se(w)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Ce,Ae,w.width,w.height):n.renderbufferStorage(n.RENDERBUFFER,Ae,w.width,w.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function Te(P,w){if(w&&w.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(n.FRAMEBUFFER,P),!(w.depthTexture&&w.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const X=i.get(w.depthTexture);X.__renderTarget=w,(!X.__webglTexture||w.depthTexture.image.width!==w.width||w.depthTexture.image.height!==w.height)&&(w.depthTexture.image.width=w.width,w.depthTexture.image.height=w.height,w.depthTexture.needsUpdate=!0),F(w.depthTexture,0);const te=X.__webglTexture,q=ue(w);if(w.depthTexture.format===As)se(w)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,te,0,q):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,te,0);else if(w.depthTexture.format===Cs)se(w)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,te,0,q):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,te,0);else throw new Error("Unknown depthTexture format")}function Ye(P){const w=i.get(P),V=P.isWebGLCubeRenderTarget===!0;if(w.__boundDepthTexture!==P.depthTexture){const X=P.depthTexture;if(w.__depthDisposeCallback&&w.__depthDisposeCallback(),X){const te=()=>{delete w.__boundDepthTexture,delete w.__depthDisposeCallback,X.removeEventListener("dispose",te)};X.addEventListener("dispose",te),w.__depthDisposeCallback=te}w.__boundDepthTexture=X}if(P.depthTexture&&!w.__autoAllocateDepthBuffer){if(V)throw new Error("target.depthTexture not supported in Cube render targets");const X=P.texture.mipmaps;X&&X.length>0?Te(w.__webglFramebuffer[0],P):Te(w.__webglFramebuffer,P)}else if(V){w.__webglDepthbuffer=[];for(let X=0;X<6;X++)if(t.bindFramebuffer(n.FRAMEBUFFER,w.__webglFramebuffer[X]),w.__webglDepthbuffer[X]===void 0)w.__webglDepthbuffer[X]=n.createRenderbuffer(),De(w.__webglDepthbuffer[X],P,!1);else{const te=P.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,q=w.__webglDepthbuffer[X];n.bindRenderbuffer(n.RENDERBUFFER,q),n.framebufferRenderbuffer(n.FRAMEBUFFER,te,n.RENDERBUFFER,q)}}else{const X=P.texture.mipmaps;if(X&&X.length>0?t.bindFramebuffer(n.FRAMEBUFFER,w.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,w.__webglFramebuffer),w.__webglDepthbuffer===void 0)w.__webglDepthbuffer=n.createRenderbuffer(),De(w.__webglDepthbuffer,P,!1);else{const te=P.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,q=w.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,q),n.framebufferRenderbuffer(n.FRAMEBUFFER,te,n.RENDERBUFFER,q)}}t.bindFramebuffer(n.FRAMEBUFFER,null)}function mt(P,w,V){const X=i.get(P);w!==void 0&&Se(X.__webglFramebuffer,P,P.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),V!==void 0&&Ye(P)}function I(P){const w=P.texture,V=i.get(P),X=i.get(w);P.addEventListener("dispose",S);const te=P.textures,q=P.isWebGLCubeRenderTarget===!0,Pe=te.length>1;if(Pe||(X.__webglTexture===void 0&&(X.__webglTexture=n.createTexture()),X.__version=w.version,a.memory.textures++),q){V.__webglFramebuffer=[];for(let de=0;de<6;de++)if(w.mipmaps&&w.mipmaps.length>0){V.__webglFramebuffer[de]=[];for(let Ae=0;Ae<w.mipmaps.length;Ae++)V.__webglFramebuffer[de][Ae]=n.createFramebuffer()}else V.__webglFramebuffer[de]=n.createFramebuffer()}else{if(w.mipmaps&&w.mipmaps.length>0){V.__webglFramebuffer=[];for(let de=0;de<w.mipmaps.length;de++)V.__webglFramebuffer[de]=n.createFramebuffer()}else V.__webglFramebuffer=n.createFramebuffer();if(Pe)for(let de=0,Ae=te.length;de<Ae;de++){const Ce=i.get(te[de]);Ce.__webglTexture===void 0&&(Ce.__webglTexture=n.createTexture(),a.memory.textures++)}if(P.samples>0&&se(P)===!1){V.__webglMultisampledFramebuffer=n.createFramebuffer(),V.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,V.__webglMultisampledFramebuffer);for(let de=0;de<te.length;de++){const Ae=te[de];V.__webglColorRenderbuffer[de]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,V.__webglColorRenderbuffer[de]);const Ce=r.convert(Ae.format,Ae.colorSpace),re=r.convert(Ae.type),xe=v(Ae.internalFormat,Ce,re,Ae.colorSpace,P.isXRRenderTarget===!0),Fe=ue(P);n.renderbufferStorageMultisample(n.RENDERBUFFER,Fe,xe,P.width,P.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+de,n.RENDERBUFFER,V.__webglColorRenderbuffer[de])}n.bindRenderbuffer(n.RENDERBUFFER,null),P.depthBuffer&&(V.__webglDepthRenderbuffer=n.createRenderbuffer(),De(V.__webglDepthRenderbuffer,P,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(q){t.bindTexture(n.TEXTURE_CUBE_MAP,X.__webglTexture),Oe(n.TEXTURE_CUBE_MAP,w);for(let de=0;de<6;de++)if(w.mipmaps&&w.mipmaps.length>0)for(let Ae=0;Ae<w.mipmaps.length;Ae++)Se(V.__webglFramebuffer[de][Ae],P,w,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+de,Ae);else Se(V.__webglFramebuffer[de],P,w,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+de,0);f(w)&&p(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Pe){for(let de=0,Ae=te.length;de<Ae;de++){const Ce=te[de],re=i.get(Ce);let xe=n.TEXTURE_2D;(P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(xe=P.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(xe,re.__webglTexture),Oe(xe,Ce),Se(V.__webglFramebuffer,P,Ce,n.COLOR_ATTACHMENT0+de,xe,0),f(Ce)&&p(xe)}t.unbindTexture()}else{let de=n.TEXTURE_2D;if((P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(de=P.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(de,X.__webglTexture),Oe(de,w),w.mipmaps&&w.mipmaps.length>0)for(let Ae=0;Ae<w.mipmaps.length;Ae++)Se(V.__webglFramebuffer[Ae],P,w,n.COLOR_ATTACHMENT0,de,Ae);else Se(V.__webglFramebuffer,P,w,n.COLOR_ATTACHMENT0,de,0);f(w)&&p(de),t.unbindTexture()}P.depthBuffer&&Ye(P)}function ne(P){const w=P.textures;for(let V=0,X=w.length;V<X;V++){const te=w[V];if(f(te)){const q=y(P),Pe=i.get(te).__webglTexture;t.bindTexture(q,Pe),p(q),t.unbindTexture()}}}const K=[],J=[];function Z(P){if(P.samples>0){if(se(P)===!1){const w=P.textures,V=P.width,X=P.height;let te=n.COLOR_BUFFER_BIT;const q=P.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Pe=i.get(P),de=w.length>1;if(de)for(let Ce=0;Ce<w.length;Ce++)t.bindFramebuffer(n.FRAMEBUFFER,Pe.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ce,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,Pe.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ce,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,Pe.__webglMultisampledFramebuffer);const Ae=P.texture.mipmaps;Ae&&Ae.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Pe.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Pe.__webglFramebuffer);for(let Ce=0;Ce<w.length;Ce++){if(P.resolveDepthBuffer&&(P.depthBuffer&&(te|=n.DEPTH_BUFFER_BIT),P.stencilBuffer&&P.resolveStencilBuffer&&(te|=n.STENCIL_BUFFER_BIT)),de){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,Pe.__webglColorRenderbuffer[Ce]);const re=i.get(w[Ce]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,re,0)}n.blitFramebuffer(0,0,V,X,0,0,V,X,te,n.NEAREST),l===!0&&(K.length=0,J.length=0,K.push(n.COLOR_ATTACHMENT0+Ce),P.depthBuffer&&P.resolveDepthBuffer===!1&&(K.push(q),J.push(q),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,J)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,K))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),de)for(let Ce=0;Ce<w.length;Ce++){t.bindFramebuffer(n.FRAMEBUFFER,Pe.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ce,n.RENDERBUFFER,Pe.__webglColorRenderbuffer[Ce]);const re=i.get(w[Ce]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,Pe.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ce,n.TEXTURE_2D,re,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Pe.__webglMultisampledFramebuffer)}else if(P.depthBuffer&&P.resolveDepthBuffer===!1&&l){const w=P.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[w])}}}function ue(P){return Math.min(s.maxSamples,P.samples)}function se(P){const w=i.get(P);return P.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&w.__useRenderToTexture!==!1}function he(P){const w=a.render.frame;d.get(P)!==w&&(d.set(P,w),P.update())}function He(P,w){const V=P.colorSpace,X=P.format,te=P.type;return P.isCompressedTexture===!0||P.isVideoTexture===!0||V!==Zi&&V!==Jn&&(tt.getTransfer(V)===ot?(X!==mn||te!==An)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",V)),w}function ke(P){return typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement?(c.width=P.naturalWidth||P.width,c.height=P.naturalHeight||P.height):typeof VideoFrame<"u"&&P instanceof VideoFrame?(c.width=P.displayWidth,c.height=P.displayHeight):(c.width=P.width,c.height=P.height),c}this.allocateTextureUnit=L,this.resetTextureUnits=U,this.setTexture2D=F,this.setTexture2DArray=O,this.setTexture3D=H,this.setTextureCube=$,this.rebindTextures=mt,this.setupRenderTarget=I,this.updateRenderTargetMipmap=ne,this.updateMultisampleRenderTarget=Z,this.setupDepthRenderbuffer=Ye,this.setupFrameBufferTexture=Se,this.useMultisampledRTT=se}function V_(n,e){function t(i,s=Jn){let r;const a=tt.getTransfer(s);if(i===An)return n.UNSIGNED_BYTE;if(i===Co)return n.UNSIGNED_SHORT_4_4_4_4;if(i===Ro)return n.UNSIGNED_SHORT_5_5_5_1;if(i===Rc)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===Pc)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===Ac)return n.BYTE;if(i===Cc)return n.SHORT;if(i===ws)return n.UNSIGNED_SHORT;if(i===Ao)return n.INT;if(i===yi)return n.UNSIGNED_INT;if(i===zn)return n.FLOAT;if(i===Is)return n.HALF_FLOAT;if(i===Lc)return n.ALPHA;if(i===Dc)return n.RGB;if(i===mn)return n.RGBA;if(i===As)return n.DEPTH_COMPONENT;if(i===Cs)return n.DEPTH_STENCIL;if(i===Ic)return n.RED;if(i===Po)return n.RED_INTEGER;if(i===Uc)return n.RG;if(i===Lo)return n.RG_INTEGER;if(i===Do)return n.RGBA_INTEGER;if(i===yr||i===br||i===Mr||i===Sr)if(a===ot)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===yr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===br)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Mr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Sr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===yr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===br)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Mr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Sr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Ga||i===Va||i===$a||i===Wa)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===Ga)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Va)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===$a)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Wa)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===ja||i===Xa||i===qa)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(i===ja||i===Xa)return a===ot?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===qa)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===Ya||i===Za||i===Ja||i===Ka||i===Qa||i===eo||i===to||i===no||i===io||i===so||i===ro||i===ao||i===oo||i===lo)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(i===Ya)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Za)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Ja)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Ka)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Qa)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===eo)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===to)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===no)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===io)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===so)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===ro)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===ao)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===oo)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===lo)return a===ot?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===co||i===uo||i===ho)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(i===co)return a===ot?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===uo)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===ho)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===po||i===fo||i===mo||i===go)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(i===po)return r.COMPRESSED_RED_RGTC1_EXT;if(i===fo)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===mo)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===go)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Ts?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}const $_=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,W_=`
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

}`;class j_{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const i=new jc(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new ti({vertexShader:$_,fragmentShader:W_,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new be(new Ns(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class X_ extends Si{constructor(e,t){super();const i=this;let s=null,r=1,a=null,o="local-floor",l=1,c=null,d=null,u=null,h=null,m=null,_=null;const x=typeof XRWebGLBinding<"u",f=new j_,p={},y=t.getContextAttributes();let v=null,g=null;const E=[],T=[],S=new oe;let A=null;const M=new cn;M.viewport=new Tt;const b=new cn;b.viewport=new Tt;const R=[M,b],U=new up;let L=null,k=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let ie=E[Y];return ie===void 0&&(ie=new da,E[Y]=ie),ie.getTargetRaySpace()},this.getControllerGrip=function(Y){let ie=E[Y];return ie===void 0&&(ie=new da,E[Y]=ie),ie.getGripSpace()},this.getHand=function(Y){let ie=E[Y];return ie===void 0&&(ie=new da,E[Y]=ie),ie.getHandSpace()};function F(Y){const ie=T.indexOf(Y.inputSource);if(ie===-1)return;const Se=E[ie];Se!==void 0&&(Se.update(Y.inputSource,Y.frame,c||a),Se.dispatchEvent({type:Y.type,data:Y.inputSource}))}function O(){s.removeEventListener("select",F),s.removeEventListener("selectstart",F),s.removeEventListener("selectend",F),s.removeEventListener("squeeze",F),s.removeEventListener("squeezestart",F),s.removeEventListener("squeezeend",F),s.removeEventListener("end",O),s.removeEventListener("inputsourceschange",H);for(let Y=0;Y<E.length;Y++){const ie=T[Y];ie!==null&&(T[Y]=null,E[Y].disconnect(ie))}L=null,k=null,f.reset();for(const Y in p)delete p[Y];e.setRenderTarget(v),m=null,h=null,u=null,s=null,g=null,Ke.stop(),i.isPresenting=!1,e.setPixelRatio(A),e.setSize(S.width,S.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){r=Y,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){o=Y,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(Y){c=Y},this.getBaseLayer=function(){return h!==null?h:m},this.getBinding=function(){return u===null&&x&&(u=new XRWebGLBinding(s,t)),u},this.getFrame=function(){return _},this.getSession=function(){return s},this.setSession=async function(Y){if(s=Y,s!==null){if(v=e.getRenderTarget(),s.addEventListener("select",F),s.addEventListener("selectstart",F),s.addEventListener("selectend",F),s.addEventListener("squeeze",F),s.addEventListener("squeezestart",F),s.addEventListener("squeezeend",F),s.addEventListener("end",O),s.addEventListener("inputsourceschange",H),y.xrCompatible!==!0&&await t.makeXRCompatible(),A=e.getPixelRatio(),e.getSize(S),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let Se=null,De=null,Te=null;y.depth&&(Te=y.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Se=y.stencil?Cs:As,De=y.stencil?Ts:yi);const Ye={colorFormat:t.RGBA8,depthFormat:Te,scaleFactor:r};u=this.getBinding(),h=u.createProjectionLayer(Ye),s.updateRenderState({layers:[h]}),e.setPixelRatio(1),e.setSize(h.textureWidth,h.textureHeight,!1),g=new bi(h.textureWidth,h.textureHeight,{format:mn,type:An,depthTexture:new Wc(h.textureWidth,h.textureHeight,De,void 0,void 0,void 0,void 0,void 0,void 0,Se),stencilBuffer:y.stencil,colorSpace:e.outputColorSpace,samples:y.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1})}else{const Se={antialias:y.antialias,alpha:!0,depth:y.depth,stencil:y.stencil,framebufferScaleFactor:r};m=new XRWebGLLayer(s,t,Se),s.updateRenderState({baseLayer:m}),e.setPixelRatio(1),e.setSize(m.framebufferWidth,m.framebufferHeight,!1),g=new bi(m.framebufferWidth,m.framebufferHeight,{format:mn,type:An,colorSpace:e.outputColorSpace,stencilBuffer:y.stencil,resolveDepthBuffer:m.ignoreDepthValues===!1,resolveStencilBuffer:m.ignoreDepthValues===!1})}g.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),Ke.setContext(s),Ke.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return f.getDepthTexture()};function H(Y){for(let ie=0;ie<Y.removed.length;ie++){const Se=Y.removed[ie],De=T.indexOf(Se);De>=0&&(T[De]=null,E[De].disconnect(Se))}for(let ie=0;ie<Y.added.length;ie++){const Se=Y.added[ie];let De=T.indexOf(Se);if(De===-1){for(let Ye=0;Ye<E.length;Ye++)if(Ye>=T.length){T.push(Se),De=Ye;break}else if(T[Ye]===null){T[Ye]=Se,De=Ye;break}if(De===-1)break}const Te=E[De];Te&&Te.connect(Se)}}const $=new D,ee=new D;function pe(Y,ie,Se){$.setFromMatrixPosition(ie.matrixWorld),ee.setFromMatrixPosition(Se.matrixWorld);const De=$.distanceTo(ee),Te=ie.projectionMatrix.elements,Ye=Se.projectionMatrix.elements,mt=Te[14]/(Te[10]-1),I=Te[14]/(Te[10]+1),ne=(Te[9]+1)/Te[5],K=(Te[9]-1)/Te[5],J=(Te[8]-1)/Te[0],Z=(Ye[8]+1)/Ye[0],ue=mt*J,se=mt*Z,he=De/(-J+Z),He=he*-J;if(ie.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(He),Y.translateZ(he),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),Te[10]===-1)Y.projectionMatrix.copy(ie.projectionMatrix),Y.projectionMatrixInverse.copy(ie.projectionMatrixInverse);else{const ke=mt+he,P=I+he,w=ue-He,V=se+(De-He),X=ne*I/P*ke,te=K*I/P*ke;Y.projectionMatrix.makePerspective(w,V,X,te,ke,P),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function ge(Y,ie){ie===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(ie.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(s===null)return;let ie=Y.near,Se=Y.far;f.texture!==null&&(f.depthNear>0&&(ie=f.depthNear),f.depthFar>0&&(Se=f.depthFar)),U.near=b.near=M.near=ie,U.far=b.far=M.far=Se,(L!==U.near||k!==U.far)&&(s.updateRenderState({depthNear:U.near,depthFar:U.far}),L=U.near,k=U.far),U.layers.mask=Y.layers.mask|6,M.layers.mask=U.layers.mask&3,b.layers.mask=U.layers.mask&5;const De=Y.parent,Te=U.cameras;ge(U,De);for(let Ye=0;Ye<Te.length;Ye++)ge(Te[Ye],De);Te.length===2?pe(U,M,b):U.projectionMatrix.copy(M.projectionMatrix),Oe(Y,U,De)};function Oe(Y,ie,Se){Se===null?Y.matrix.copy(ie.matrixWorld):(Y.matrix.copy(Se.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(ie.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(ie.projectionMatrix),Y.projectionMatrixInverse.copy(ie.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=_o*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return U},this.getFoveation=function(){if(!(h===null&&m===null))return l},this.setFoveation=function(Y){l=Y,h!==null&&(h.fixedFoveation=Y),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=Y)},this.hasDepthSensing=function(){return f.texture!==null},this.getDepthSensingMesh=function(){return f.getMesh(U)},this.getCameraTexture=function(Y){return p[Y]};let qe=null;function Qe(Y,ie){if(d=ie.getViewerPose(c||a),_=ie,d!==null){const Se=d.views;m!==null&&(e.setRenderTargetFramebuffer(g,m.framebuffer),e.setRenderTarget(g));let De=!1;Se.length!==U.cameras.length&&(U.cameras.length=0,De=!0);for(let I=0;I<Se.length;I++){const ne=Se[I];let K=null;if(m!==null)K=m.getViewport(ne);else{const Z=u.getViewSubImage(h,ne);K=Z.viewport,I===0&&(e.setRenderTargetTextures(g,Z.colorTexture,Z.depthStencilTexture),e.setRenderTarget(g))}let J=R[I];J===void 0&&(J=new cn,J.layers.enable(I),J.viewport=new Tt,R[I]=J),J.matrix.fromArray(ne.transform.matrix),J.matrix.decompose(J.position,J.quaternion,J.scale),J.projectionMatrix.fromArray(ne.projectionMatrix),J.projectionMatrixInverse.copy(J.projectionMatrix).invert(),J.viewport.set(K.x,K.y,K.width,K.height),I===0&&(U.matrix.copy(J.matrix),U.matrix.decompose(U.position,U.quaternion,U.scale)),De===!0&&U.cameras.push(J)}const Te=s.enabledFeatures;if(Te&&Te.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&x){u=i.getBinding();const I=u.getDepthInformation(Se[0]);I&&I.isValid&&I.texture&&f.init(I,s.renderState)}if(Te&&Te.includes("camera-access")&&x){e.state.unbindTexture(),u=i.getBinding();for(let I=0;I<Se.length;I++){const ne=Se[I].camera;if(ne){let K=p[ne];K||(K=new jc,p[ne]=K);const J=u.getCameraImage(ne);K.sourceTexture=J}}}}for(let Se=0;Se<E.length;Se++){const De=T[Se],Te=E[Se];De!==null&&Te!==void 0&&Te.update(De,ie,c||a)}qe&&qe(Y,ie),ie.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:ie}),_=null}const Ke=new rd;Ke.setAnimationLoop(Qe),this.setAnimationLoop=function(Y){qe=Y},this.dispose=function(){}}}const di=new _n,q_=new dt;function Y_(n,e){function t(f,p){f.matrixAutoUpdate===!0&&f.updateMatrix(),p.value.copy(f.matrix)}function i(f,p){p.color.getRGB(f.fogColor.value,Gc(n)),p.isFog?(f.fogNear.value=p.near,f.fogFar.value=p.far):p.isFogExp2&&(f.fogDensity.value=p.density)}function s(f,p,y,v,g){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(f,p):p.isMeshToonMaterial?(r(f,p),u(f,p)):p.isMeshPhongMaterial?(r(f,p),d(f,p)):p.isMeshStandardMaterial?(r(f,p),h(f,p),p.isMeshPhysicalMaterial&&m(f,p,g)):p.isMeshMatcapMaterial?(r(f,p),_(f,p)):p.isMeshDepthMaterial?r(f,p):p.isMeshDistanceMaterial?(r(f,p),x(f,p)):p.isMeshNormalMaterial?r(f,p):p.isLineBasicMaterial?(a(f,p),p.isLineDashedMaterial&&o(f,p)):p.isPointsMaterial?l(f,p,y,v):p.isSpriteMaterial?c(f,p):p.isShadowMaterial?(f.color.value.copy(p.color),f.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(f,p){f.opacity.value=p.opacity,p.color&&f.diffuse.value.copy(p.color),p.emissive&&f.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(f.map.value=p.map,t(p.map,f.mapTransform)),p.alphaMap&&(f.alphaMap.value=p.alphaMap,t(p.alphaMap,f.alphaMapTransform)),p.bumpMap&&(f.bumpMap.value=p.bumpMap,t(p.bumpMap,f.bumpMapTransform),f.bumpScale.value=p.bumpScale,p.side===Kt&&(f.bumpScale.value*=-1)),p.normalMap&&(f.normalMap.value=p.normalMap,t(p.normalMap,f.normalMapTransform),f.normalScale.value.copy(p.normalScale),p.side===Kt&&f.normalScale.value.negate()),p.displacementMap&&(f.displacementMap.value=p.displacementMap,t(p.displacementMap,f.displacementMapTransform),f.displacementScale.value=p.displacementScale,f.displacementBias.value=p.displacementBias),p.emissiveMap&&(f.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,f.emissiveMapTransform)),p.specularMap&&(f.specularMap.value=p.specularMap,t(p.specularMap,f.specularMapTransform)),p.alphaTest>0&&(f.alphaTest.value=p.alphaTest);const y=e.get(p),v=y.envMap,g=y.envMapRotation;v&&(f.envMap.value=v,di.copy(g),di.x*=-1,di.y*=-1,di.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(di.y*=-1,di.z*=-1),f.envMapRotation.value.setFromMatrix4(q_.makeRotationFromEuler(di)),f.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,f.reflectivity.value=p.reflectivity,f.ior.value=p.ior,f.refractionRatio.value=p.refractionRatio),p.lightMap&&(f.lightMap.value=p.lightMap,f.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,f.lightMapTransform)),p.aoMap&&(f.aoMap.value=p.aoMap,f.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,f.aoMapTransform))}function a(f,p){f.diffuse.value.copy(p.color),f.opacity.value=p.opacity,p.map&&(f.map.value=p.map,t(p.map,f.mapTransform))}function o(f,p){f.dashSize.value=p.dashSize,f.totalSize.value=p.dashSize+p.gapSize,f.scale.value=p.scale}function l(f,p,y,v){f.diffuse.value.copy(p.color),f.opacity.value=p.opacity,f.size.value=p.size*y,f.scale.value=v*.5,p.map&&(f.map.value=p.map,t(p.map,f.uvTransform)),p.alphaMap&&(f.alphaMap.value=p.alphaMap,t(p.alphaMap,f.alphaMapTransform)),p.alphaTest>0&&(f.alphaTest.value=p.alphaTest)}function c(f,p){f.diffuse.value.copy(p.color),f.opacity.value=p.opacity,f.rotation.value=p.rotation,p.map&&(f.map.value=p.map,t(p.map,f.mapTransform)),p.alphaMap&&(f.alphaMap.value=p.alphaMap,t(p.alphaMap,f.alphaMapTransform)),p.alphaTest>0&&(f.alphaTest.value=p.alphaTest)}function d(f,p){f.specular.value.copy(p.specular),f.shininess.value=Math.max(p.shininess,1e-4)}function u(f,p){p.gradientMap&&(f.gradientMap.value=p.gradientMap)}function h(f,p){f.metalness.value=p.metalness,p.metalnessMap&&(f.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,f.metalnessMapTransform)),f.roughness.value=p.roughness,p.roughnessMap&&(f.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,f.roughnessMapTransform)),p.envMap&&(f.envMapIntensity.value=p.envMapIntensity)}function m(f,p,y){f.ior.value=p.ior,p.sheen>0&&(f.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),f.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(f.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,f.sheenColorMapTransform)),p.sheenRoughnessMap&&(f.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,f.sheenRoughnessMapTransform))),p.clearcoat>0&&(f.clearcoat.value=p.clearcoat,f.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(f.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,f.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(f.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,f.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(f.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,f.clearcoatNormalMapTransform),f.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Kt&&f.clearcoatNormalScale.value.negate())),p.dispersion>0&&(f.dispersion.value=p.dispersion),p.iridescence>0&&(f.iridescence.value=p.iridescence,f.iridescenceIOR.value=p.iridescenceIOR,f.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],f.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(f.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,f.iridescenceMapTransform)),p.iridescenceThicknessMap&&(f.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,f.iridescenceThicknessMapTransform))),p.transmission>0&&(f.transmission.value=p.transmission,f.transmissionSamplerMap.value=y.texture,f.transmissionSamplerSize.value.set(y.width,y.height),p.transmissionMap&&(f.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,f.transmissionMapTransform)),f.thickness.value=p.thickness,p.thicknessMap&&(f.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,f.thicknessMapTransform)),f.attenuationDistance.value=p.attenuationDistance,f.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(f.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(f.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,f.anisotropyMapTransform))),f.specularIntensity.value=p.specularIntensity,f.specularColor.value.copy(p.specularColor),p.specularColorMap&&(f.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,f.specularColorMapTransform)),p.specularIntensityMap&&(f.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,f.specularIntensityMapTransform))}function _(f,p){p.matcap&&(f.matcap.value=p.matcap)}function x(f,p){const y=e.get(p).light;f.referencePosition.value.setFromMatrixPosition(y.matrixWorld),f.nearDistance.value=y.shadow.camera.near,f.farDistance.value=y.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function Z_(n,e,t,i){let s={},r={},a=[];const o=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(y,v){const g=v.program;i.uniformBlockBinding(y,g)}function c(y,v){let g=s[y.id];g===void 0&&(_(y),g=d(y),s[y.id]=g,y.addEventListener("dispose",f));const E=v.program;i.updateUBOMapping(y,E);const T=e.render.frame;r[y.id]!==T&&(h(y),r[y.id]=T)}function d(y){const v=u();y.__bindingPointIndex=v;const g=n.createBuffer(),E=y.__size,T=y.usage;return n.bindBuffer(n.UNIFORM_BUFFER,g),n.bufferData(n.UNIFORM_BUFFER,E,T),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,v,g),g}function u(){for(let y=0;y<o;y++)if(a.indexOf(y)===-1)return a.push(y),y;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(y){const v=s[y.id],g=y.uniforms,E=y.__cache;n.bindBuffer(n.UNIFORM_BUFFER,v);for(let T=0,S=g.length;T<S;T++){const A=Array.isArray(g[T])?g[T]:[g[T]];for(let M=0,b=A.length;M<b;M++){const R=A[M];if(m(R,T,M,E)===!0){const U=R.__offset,L=Array.isArray(R.value)?R.value:[R.value];let k=0;for(let F=0;F<L.length;F++){const O=L[F],H=x(O);typeof O=="number"||typeof O=="boolean"?(R.__data[0]=O,n.bufferSubData(n.UNIFORM_BUFFER,U+k,R.__data)):O.isMatrix3?(R.__data[0]=O.elements[0],R.__data[1]=O.elements[1],R.__data[2]=O.elements[2],R.__data[3]=0,R.__data[4]=O.elements[3],R.__data[5]=O.elements[4],R.__data[6]=O.elements[5],R.__data[7]=0,R.__data[8]=O.elements[6],R.__data[9]=O.elements[7],R.__data[10]=O.elements[8],R.__data[11]=0):(O.toArray(R.__data,k),k+=H.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,U,R.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function m(y,v,g,E){const T=y.value,S=v+"_"+g;if(E[S]===void 0)return typeof T=="number"||typeof T=="boolean"?E[S]=T:E[S]=T.clone(),!0;{const A=E[S];if(typeof T=="number"||typeof T=="boolean"){if(A!==T)return E[S]=T,!0}else if(A.equals(T)===!1)return A.copy(T),!0}return!1}function _(y){const v=y.uniforms;let g=0;const E=16;for(let S=0,A=v.length;S<A;S++){const M=Array.isArray(v[S])?v[S]:[v[S]];for(let b=0,R=M.length;b<R;b++){const U=M[b],L=Array.isArray(U.value)?U.value:[U.value];for(let k=0,F=L.length;k<F;k++){const O=L[k],H=x(O),$=g%E,ee=$%H.boundary,pe=$+ee;g+=ee,pe!==0&&E-pe<H.storage&&(g+=E-pe),U.__data=new Float32Array(H.storage/Float32Array.BYTES_PER_ELEMENT),U.__offset=g,g+=H.storage}}}const T=g%E;return T>0&&(g+=E-T),y.__size=g,y.__cache={},this}function x(y){const v={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(v.boundary=4,v.storage=4):y.isVector2?(v.boundary=8,v.storage=8):y.isVector3||y.isColor?(v.boundary=16,v.storage=12):y.isVector4?(v.boundary=16,v.storage=16):y.isMatrix3?(v.boundary=48,v.storage=48):y.isMatrix4?(v.boundary=64,v.storage=64):y.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",y),v}function f(y){const v=y.target;v.removeEventListener("dispose",f);const g=a.indexOf(v.__bindingPointIndex);a.splice(g,1),n.deleteBuffer(s[v.id]),delete s[v.id],delete r[v.id]}function p(){for(const y in s)n.deleteBuffer(s[y]);a=[],s={},r={}}return{bind:l,update:c,dispose:p}}class J_{constructor(e={}){const{canvas:t=Yu(),context:i=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:h=!1}=e;this.isWebGLRenderer=!0;let m;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=i.getContextAttributes().alpha}else m=a;const _=new Uint32Array(4),x=new Int32Array(4);let f=null,p=null;const y=[],v=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Qn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const g=this;let E=!1;this._outputColorSpace=ln;let T=0,S=0,A=null,M=-1,b=null;const R=new Tt,U=new Tt;let L=null;const k=new Xe(0);let F=0,O=t.width,H=t.height,$=1,ee=null,pe=null;const ge=new Tt(0,0,O,H),Oe=new Tt(0,0,O,H);let qe=!1;const Qe=new No;let Ke=!1,Y=!1;const ie=new dt,Se=new D,De=new Tt,Te={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Ye=!1;function mt(){return A===null?$:1}let I=i;function ne(C,B){return t.getContext(C,B)}try{const C={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:d,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${To}`),t.addEventListener("webglcontextlost",fe,!1),t.addEventListener("webglcontextrestored",Ee,!1),t.addEventListener("webglcontextcreationerror",ae,!1),I===null){const B="webgl2";if(I=ne(B,C),I===null)throw ne(B)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(C){throw console.error("THREE.WebGLRenderer: "+C.message),C}let K,J,Z,ue,se,he,He,ke,P,w,V,X,te,q,Pe,de,Ae,Ce,re,xe,Fe,Le,_e,Ve;function z(){K=new og(I),K.init(),Le=new V_(I,K),J=new eg(I,K,e,Le),Z=new H_(I,K),J.reversedDepthBuffer&&h&&Z.buffers.depth.setReversed(!0),ue=new dg(I),se=new C_,he=new G_(I,K,Z,se,J,Le,ue),He=new ng(g),ke=new ag(g),P=new mp(I),_e=new Km(I,P),w=new lg(I,P,ue,_e),V=new hg(I,w,P,ue),re=new ug(I,J,he),de=new tg(se),X=new A_(g,He,ke,K,J,_e,de),te=new Y_(g,se),q=new P_,Pe=new F_(K),Ce=new Jm(g,He,ke,Z,V,m,l),Ae=new k_(g,V,J),Ve=new Z_(I,ue,J,Z),xe=new Qm(I,K,ue),Fe=new cg(I,K,ue),ue.programs=X.programs,g.capabilities=J,g.extensions=K,g.properties=se,g.renderLists=q,g.shadowMap=Ae,g.state=Z,g.info=ue}z();const ce=new X_(g,I);this.xr=ce,this.getContext=function(){return I},this.getContextAttributes=function(){return I.getContextAttributes()},this.forceContextLoss=function(){const C=K.get("WEBGL_lose_context");C&&C.loseContext()},this.forceContextRestore=function(){const C=K.get("WEBGL_lose_context");C&&C.restoreContext()},this.getPixelRatio=function(){return $},this.setPixelRatio=function(C){C!==void 0&&($=C,this.setSize(O,H,!1))},this.getSize=function(C){return C.set(O,H)},this.setSize=function(C,B,W=!0){if(ce.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}O=C,H=B,t.width=Math.floor(C*$),t.height=Math.floor(B*$),W===!0&&(t.style.width=C+"px",t.style.height=B+"px"),this.setViewport(0,0,C,B)},this.getDrawingBufferSize=function(C){return C.set(O*$,H*$).floor()},this.setDrawingBufferSize=function(C,B,W){O=C,H=B,$=W,t.width=Math.floor(C*W),t.height=Math.floor(B*W),this.setViewport(0,0,C,B)},this.getCurrentViewport=function(C){return C.copy(R)},this.getViewport=function(C){return C.copy(ge)},this.setViewport=function(C,B,W,j){C.isVector4?ge.set(C.x,C.y,C.z,C.w):ge.set(C,B,W,j),Z.viewport(R.copy(ge).multiplyScalar($).round())},this.getScissor=function(C){return C.copy(Oe)},this.setScissor=function(C,B,W,j){C.isVector4?Oe.set(C.x,C.y,C.z,C.w):Oe.set(C,B,W,j),Z.scissor(U.copy(Oe).multiplyScalar($).round())},this.getScissorTest=function(){return qe},this.setScissorTest=function(C){Z.setScissorTest(qe=C)},this.setOpaqueSort=function(C){ee=C},this.setTransparentSort=function(C){pe=C},this.getClearColor=function(C){return C.copy(Ce.getClearColor())},this.setClearColor=function(){Ce.setClearColor(...arguments)},this.getClearAlpha=function(){return Ce.getClearAlpha()},this.setClearAlpha=function(){Ce.setClearAlpha(...arguments)},this.clear=function(C=!0,B=!0,W=!0){let j=0;if(C){let G=!1;if(A!==null){const le=A.texture.format;G=le===Do||le===Lo||le===Po}if(G){const le=A.texture.type,ve=le===An||le===yi||le===ws||le===Ts||le===Co||le===Ro,we=Ce.getClearColor(),Me=Ce.getClearAlpha(),Ne=we.r,ze=we.g,Ie=we.b;ve?(_[0]=Ne,_[1]=ze,_[2]=Ie,_[3]=Me,I.clearBufferuiv(I.COLOR,0,_)):(x[0]=Ne,x[1]=ze,x[2]=Ie,x[3]=Me,I.clearBufferiv(I.COLOR,0,x))}else j|=I.COLOR_BUFFER_BIT}B&&(j|=I.DEPTH_BUFFER_BIT),W&&(j|=I.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),I.clear(j)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",fe,!1),t.removeEventListener("webglcontextrestored",Ee,!1),t.removeEventListener("webglcontextcreationerror",ae,!1),Ce.dispose(),q.dispose(),Pe.dispose(),se.dispose(),He.dispose(),ke.dispose(),V.dispose(),_e.dispose(),Ve.dispose(),X.dispose(),ce.dispose(),ce.removeEventListener("sessionstart",xn),ce.removeEventListener("sessionend",Vo),ii.stop()};function fe(C){C.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),E=!0}function Ee(){console.log("THREE.WebGLRenderer: Context Restored."),E=!1;const C=ue.autoReset,B=Ae.enabled,W=Ae.autoUpdate,j=Ae.needsUpdate,G=Ae.type;z(),ue.autoReset=C,Ae.enabled=B,Ae.autoUpdate=W,Ae.needsUpdate=j,Ae.type=G}function ae(C){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",C.statusMessage)}function Q(C){const B=C.target;B.removeEventListener("dispose",Q),Re(B)}function Re(C){Ge(C),se.remove(C)}function Ge(C){const B=se.get(C).programs;B!==void 0&&(B.forEach(function(W){X.releaseProgram(W)}),C.isShaderMaterial&&X.releaseShaderCache(C))}this.renderBufferDirect=function(C,B,W,j,G,le){B===null&&(B=Te);const ve=G.isMesh&&G.matrixWorld.determinant()<0,we=yd(C,B,W,j,G);Z.setMaterial(j,ve);let Me=W.index,Ne=1;if(j.wireframe===!0){if(Me=w.getWireframeAttribute(W),Me===void 0)return;Ne=2}const ze=W.drawRange,Ie=W.attributes.position;let Ze=ze.start*Ne,at=(ze.start+ze.count)*Ne;le!==null&&(Ze=Math.max(Ze,le.start*Ne),at=Math.min(at,(le.start+le.count)*Ne)),Me!==null?(Ze=Math.max(Ze,0),at=Math.min(at,Me.count)):Ie!=null&&(Ze=Math.max(Ze,0),at=Math.min(at,Ie.count));const wt=at-Ze;if(wt<0||wt===1/0)return;_e.setup(G,j,we,W,Me);let vt,pt=xe;if(Me!==null&&(vt=P.get(Me),pt=Fe,pt.setIndex(vt)),G.isMesh)j.wireframe===!0?(Z.setLineWidth(j.wireframeLinewidth*mt()),pt.setMode(I.LINES)):pt.setMode(I.TRIANGLES);else if(G.isLine){let Ue=j.linewidth;Ue===void 0&&(Ue=1),Z.setLineWidth(Ue*mt()),G.isLineSegments?pt.setMode(I.LINES):G.isLineLoop?pt.setMode(I.LINE_LOOP):pt.setMode(I.LINE_STRIP)}else G.isPoints?pt.setMode(I.POINTS):G.isSprite&&pt.setMode(I.TRIANGLES);if(G.isBatchedMesh)if(G._multiDrawInstances!==null)Rs("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),pt.renderMultiDrawInstances(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount,G._multiDrawInstances);else if(K.get("WEBGL_multi_draw"))pt.renderMultiDraw(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount);else{const Ue=G._multiDrawStarts,bt=G._multiDrawCounts,et=G._multiDrawCount,en=Me?P.get(Me).bytesPerElement:1,Ei=se.get(j).currentProgram.getUniforms();for(let tn=0;tn<et;tn++)Ei.setValue(I,"_gl_DrawID",tn),pt.render(Ue[tn]/en,bt[tn])}else if(G.isInstancedMesh)pt.renderInstances(Ze,wt,G.count);else if(W.isInstancedBufferGeometry){const Ue=W._maxInstanceCount!==void 0?W._maxInstanceCount:1/0,bt=Math.min(W.instanceCount,Ue);pt.renderInstances(Ze,wt,bt)}else pt.render(Ze,wt)};function gt(C,B,W){C.transparent===!0&&C.side===fn&&C.forceSinglePass===!1?(C.side=Kt,C.needsUpdate=!0,Bs(C,B,W),C.side=ei,C.needsUpdate=!0,Bs(C,B,W),C.side=fn):Bs(C,B,W)}this.compile=function(C,B,W=null){W===null&&(W=C),p=Pe.get(W),p.init(B),v.push(p),W.traverseVisible(function(G){G.isLight&&G.layers.test(B.layers)&&(p.pushLight(G),G.castShadow&&p.pushShadow(G))}),C!==W&&C.traverseVisible(function(G){G.isLight&&G.layers.test(B.layers)&&(p.pushLight(G),G.castShadow&&p.pushShadow(G))}),p.setupLights();const j=new Set;return C.traverse(function(G){if(!(G.isMesh||G.isPoints||G.isLine||G.isSprite))return;const le=G.material;if(le)if(Array.isArray(le))for(let ve=0;ve<le.length;ve++){const we=le[ve];gt(we,W,G),j.add(we)}else gt(le,W,G),j.add(le)}),p=v.pop(),j},this.compileAsync=function(C,B,W=null){const j=this.compile(C,B,W);return new Promise(G=>{function le(){if(j.forEach(function(ve){se.get(ve).currentProgram.isReady()&&j.delete(ve)}),j.size===0){G(C);return}setTimeout(le,10)}K.get("KHR_parallel_shader_compile")!==null?le():setTimeout(le,10)})};let nt=null;function Rn(C){nt&&nt(C)}function xn(){ii.stop()}function Vo(){ii.start()}const ii=new rd;ii.setAnimationLoop(Rn),typeof self<"u"&&ii.setContext(self),this.setAnimationLoop=function(C){nt=C,ce.setAnimationLoop(C),C===null?ii.stop():ii.start()},ce.addEventListener("sessionstart",xn),ce.addEventListener("sessionend",Vo),this.render=function(C,B){if(B!==void 0&&B.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(E===!0)return;if(C.matrixWorldAutoUpdate===!0&&C.updateMatrixWorld(),B.parent===null&&B.matrixWorldAutoUpdate===!0&&B.updateMatrixWorld(),ce.enabled===!0&&ce.isPresenting===!0&&(ce.cameraAutoUpdate===!0&&ce.updateCamera(B),B=ce.getCamera()),C.isScene===!0&&C.onBeforeRender(g,C,B,A),p=Pe.get(C,v.length),p.init(B),v.push(p),ie.multiplyMatrices(B.projectionMatrix,B.matrixWorldInverse),Qe.setFromProjectionMatrix(ie,wn,B.reversedDepth),Y=this.localClippingEnabled,Ke=de.init(this.clippingPlanes,Y),f=q.get(C,y.length),f.init(),y.push(f),ce.enabled===!0&&ce.isPresenting===!0){const le=g.xr.getDepthSensingMesh();le!==null&&Br(le,B,-1/0,g.sortObjects)}Br(C,B,0,g.sortObjects),f.finish(),g.sortObjects===!0&&f.sort(ee,pe),Ye=ce.enabled===!1||ce.isPresenting===!1||ce.hasDepthSensing()===!1,Ye&&Ce.addToRenderList(f,C),this.info.render.frame++,Ke===!0&&de.beginShadows();const W=p.state.shadowsArray;Ae.render(W,C,B),Ke===!0&&de.endShadows(),this.info.autoReset===!0&&this.info.reset();const j=f.opaque,G=f.transmissive;if(p.setupLights(),B.isArrayCamera){const le=B.cameras;if(G.length>0)for(let ve=0,we=le.length;ve<we;ve++){const Me=le[ve];Wo(j,G,C,Me)}Ye&&Ce.render(C);for(let ve=0,we=le.length;ve<we;ve++){const Me=le[ve];$o(f,C,Me,Me.viewport)}}else G.length>0&&Wo(j,G,C,B),Ye&&Ce.render(C),$o(f,C,B);A!==null&&S===0&&(he.updateMultisampleRenderTarget(A),he.updateRenderTargetMipmap(A)),C.isScene===!0&&C.onAfterRender(g,C,B),_e.resetDefaultState(),M=-1,b=null,v.pop(),v.length>0?(p=v[v.length-1],Ke===!0&&de.setGlobalState(g.clippingPlanes,p.state.camera)):p=null,y.pop(),y.length>0?f=y[y.length-1]:f=null};function Br(C,B,W,j){if(C.visible===!1)return;if(C.layers.test(B.layers)){if(C.isGroup)W=C.renderOrder;else if(C.isLOD)C.autoUpdate===!0&&C.update(B);else if(C.isLight)p.pushLight(C),C.castShadow&&p.pushShadow(C);else if(C.isSprite){if(!C.frustumCulled||Qe.intersectsSprite(C)){j&&De.setFromMatrixPosition(C.matrixWorld).applyMatrix4(ie);const ve=V.update(C),we=C.material;we.visible&&f.push(C,ve,we,W,De.z,null)}}else if((C.isMesh||C.isLine||C.isPoints)&&(!C.frustumCulled||Qe.intersectsObject(C))){const ve=V.update(C),we=C.material;if(j&&(C.boundingSphere!==void 0?(C.boundingSphere===null&&C.computeBoundingSphere(),De.copy(C.boundingSphere.center)):(ve.boundingSphere===null&&ve.computeBoundingSphere(),De.copy(ve.boundingSphere.center)),De.applyMatrix4(C.matrixWorld).applyMatrix4(ie)),Array.isArray(we)){const Me=ve.groups;for(let Ne=0,ze=Me.length;Ne<ze;Ne++){const Ie=Me[Ne],Ze=we[Ie.materialIndex];Ze&&Ze.visible&&f.push(C,ve,Ze,W,De.z,Ie)}}else we.visible&&f.push(C,ve,we,W,De.z,null)}}const le=C.children;for(let ve=0,we=le.length;ve<we;ve++)Br(le[ve],B,W,j)}function $o(C,B,W,j){const G=C.opaque,le=C.transmissive,ve=C.transparent;p.setupLightsView(W),Ke===!0&&de.setGlobalState(g.clippingPlanes,W),j&&Z.viewport(R.copy(j)),G.length>0&&ks(G,B,W),le.length>0&&ks(le,B,W),ve.length>0&&ks(ve,B,W),Z.buffers.depth.setTest(!0),Z.buffers.depth.setMask(!0),Z.buffers.color.setMask(!0),Z.setPolygonOffset(!1)}function Wo(C,B,W,j){if((W.isScene===!0?W.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[j.id]===void 0&&(p.state.transmissionRenderTarget[j.id]=new bi(1,1,{generateMipmaps:!0,type:K.has("EXT_color_buffer_half_float")||K.has("EXT_color_buffer_float")?Is:An,minFilter:xi,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:tt.workingColorSpace}));const le=p.state.transmissionRenderTarget[j.id],ve=j.viewport||R;le.setSize(ve.z*g.transmissionResolutionScale,ve.w*g.transmissionResolutionScale);const we=g.getRenderTarget(),Me=g.getActiveCubeFace(),Ne=g.getActiveMipmapLevel();g.setRenderTarget(le),g.getClearColor(k),F=g.getClearAlpha(),F<1&&g.setClearColor(16777215,.5),g.clear(),Ye&&Ce.render(W);const ze=g.toneMapping;g.toneMapping=Qn;const Ie=j.viewport;if(j.viewport!==void 0&&(j.viewport=void 0),p.setupLightsView(j),Ke===!0&&de.setGlobalState(g.clippingPlanes,j),ks(C,W,j),he.updateMultisampleRenderTarget(le),he.updateRenderTargetMipmap(le),K.has("WEBGL_multisampled_render_to_texture")===!1){let Ze=!1;for(let at=0,wt=B.length;at<wt;at++){const vt=B[at],pt=vt.object,Ue=vt.geometry,bt=vt.material,et=vt.group;if(bt.side===fn&&pt.layers.test(j.layers)){const en=bt.side;bt.side=Kt,bt.needsUpdate=!0,jo(pt,W,j,Ue,bt,et),bt.side=en,bt.needsUpdate=!0,Ze=!0}}Ze===!0&&(he.updateMultisampleRenderTarget(le),he.updateRenderTargetMipmap(le))}g.setRenderTarget(we,Me,Ne),g.setClearColor(k,F),Ie!==void 0&&(j.viewport=Ie),g.toneMapping=ze}function ks(C,B,W){const j=B.isScene===!0?B.overrideMaterial:null;for(let G=0,le=C.length;G<le;G++){const ve=C[G],we=ve.object,Me=ve.geometry,Ne=ve.group;let ze=ve.material;ze.allowOverride===!0&&j!==null&&(ze=j),we.layers.test(W.layers)&&jo(we,B,W,Me,ze,Ne)}}function jo(C,B,W,j,G,le){C.onBeforeRender(g,B,W,j,G,le),C.modelViewMatrix.multiplyMatrices(W.matrixWorldInverse,C.matrixWorld),C.normalMatrix.getNormalMatrix(C.modelViewMatrix),G.onBeforeRender(g,B,W,j,C,le),G.transparent===!0&&G.side===fn&&G.forceSinglePass===!1?(G.side=Kt,G.needsUpdate=!0,g.renderBufferDirect(W,B,j,G,C,le),G.side=ei,G.needsUpdate=!0,g.renderBufferDirect(W,B,j,G,C,le),G.side=fn):g.renderBufferDirect(W,B,j,G,C,le),C.onAfterRender(g,B,W,j,G,le)}function Bs(C,B,W){B.isScene!==!0&&(B=Te);const j=se.get(C),G=p.state.lights,le=p.state.shadowsArray,ve=G.state.version,we=X.getParameters(C,G.state,le,B,W),Me=X.getProgramCacheKey(we);let Ne=j.programs;j.environment=C.isMeshStandardMaterial?B.environment:null,j.fog=B.fog,j.envMap=(C.isMeshStandardMaterial?ke:He).get(C.envMap||j.environment),j.envMapRotation=j.environment!==null&&C.envMap===null?B.environmentRotation:C.envMapRotation,Ne===void 0&&(C.addEventListener("dispose",Q),Ne=new Map,j.programs=Ne);let ze=Ne.get(Me);if(ze!==void 0){if(j.currentProgram===ze&&j.lightsStateVersion===ve)return qo(C,we),ze}else we.uniforms=X.getUniforms(C),C.onBeforeCompile(we,g),ze=X.acquireProgram(we,Me),Ne.set(Me,ze),j.uniforms=we.uniforms;const Ie=j.uniforms;return(!C.isShaderMaterial&&!C.isRawShaderMaterial||C.clipping===!0)&&(Ie.clippingPlanes=de.uniform),qo(C,we),j.needsLights=Md(C),j.lightsStateVersion=ve,j.needsLights&&(Ie.ambientLightColor.value=G.state.ambient,Ie.lightProbe.value=G.state.probe,Ie.directionalLights.value=G.state.directional,Ie.directionalLightShadows.value=G.state.directionalShadow,Ie.spotLights.value=G.state.spot,Ie.spotLightShadows.value=G.state.spotShadow,Ie.rectAreaLights.value=G.state.rectArea,Ie.ltc_1.value=G.state.rectAreaLTC1,Ie.ltc_2.value=G.state.rectAreaLTC2,Ie.pointLights.value=G.state.point,Ie.pointLightShadows.value=G.state.pointShadow,Ie.hemisphereLights.value=G.state.hemi,Ie.directionalShadowMap.value=G.state.directionalShadowMap,Ie.directionalShadowMatrix.value=G.state.directionalShadowMatrix,Ie.spotShadowMap.value=G.state.spotShadowMap,Ie.spotLightMatrix.value=G.state.spotLightMatrix,Ie.spotLightMap.value=G.state.spotLightMap,Ie.pointShadowMap.value=G.state.pointShadowMap,Ie.pointShadowMatrix.value=G.state.pointShadowMatrix),j.currentProgram=ze,j.uniformsList=null,ze}function Xo(C){if(C.uniformsList===null){const B=C.currentProgram.getUniforms();C.uniformsList=wr.seqWithValue(B.seq,C.uniforms)}return C.uniformsList}function qo(C,B){const W=se.get(C);W.outputColorSpace=B.outputColorSpace,W.batching=B.batching,W.batchingColor=B.batchingColor,W.instancing=B.instancing,W.instancingColor=B.instancingColor,W.instancingMorph=B.instancingMorph,W.skinning=B.skinning,W.morphTargets=B.morphTargets,W.morphNormals=B.morphNormals,W.morphColors=B.morphColors,W.morphTargetsCount=B.morphTargetsCount,W.numClippingPlanes=B.numClippingPlanes,W.numIntersection=B.numClipIntersection,W.vertexAlphas=B.vertexAlphas,W.vertexTangents=B.vertexTangents,W.toneMapping=B.toneMapping}function yd(C,B,W,j,G){B.isScene!==!0&&(B=Te),he.resetTextureUnits();const le=B.fog,ve=j.isMeshStandardMaterial?B.environment:null,we=A===null?g.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:Zi,Me=(j.isMeshStandardMaterial?ke:He).get(j.envMap||ve),Ne=j.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,ze=!!W.attributes.tangent&&(!!j.normalMap||j.anisotropy>0),Ie=!!W.morphAttributes.position,Ze=!!W.morphAttributes.normal,at=!!W.morphAttributes.color;let wt=Qn;j.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(wt=g.toneMapping);const vt=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,pt=vt!==void 0?vt.length:0,Ue=se.get(j),bt=p.state.lights;if(Ke===!0&&(Y===!0||C!==b)){const $t=C===b&&j.id===M;de.setState(j,C,$t)}let et=!1;j.version===Ue.__version?(Ue.needsLights&&Ue.lightsStateVersion!==bt.state.version||Ue.outputColorSpace!==we||G.isBatchedMesh&&Ue.batching===!1||!G.isBatchedMesh&&Ue.batching===!0||G.isBatchedMesh&&Ue.batchingColor===!0&&G.colorTexture===null||G.isBatchedMesh&&Ue.batchingColor===!1&&G.colorTexture!==null||G.isInstancedMesh&&Ue.instancing===!1||!G.isInstancedMesh&&Ue.instancing===!0||G.isSkinnedMesh&&Ue.skinning===!1||!G.isSkinnedMesh&&Ue.skinning===!0||G.isInstancedMesh&&Ue.instancingColor===!0&&G.instanceColor===null||G.isInstancedMesh&&Ue.instancingColor===!1&&G.instanceColor!==null||G.isInstancedMesh&&Ue.instancingMorph===!0&&G.morphTexture===null||G.isInstancedMesh&&Ue.instancingMorph===!1&&G.morphTexture!==null||Ue.envMap!==Me||j.fog===!0&&Ue.fog!==le||Ue.numClippingPlanes!==void 0&&(Ue.numClippingPlanes!==de.numPlanes||Ue.numIntersection!==de.numIntersection)||Ue.vertexAlphas!==Ne||Ue.vertexTangents!==ze||Ue.morphTargets!==Ie||Ue.morphNormals!==Ze||Ue.morphColors!==at||Ue.toneMapping!==wt||Ue.morphTargetsCount!==pt)&&(et=!0):(et=!0,Ue.__version=j.version);let en=Ue.currentProgram;et===!0&&(en=Bs(j,B,G));let Ei=!1,tn=!1,is=!1;const Mt=en.getUniforms(),rn=Ue.uniforms;if(Z.useProgram(en.program)&&(Ei=!0,tn=!0,is=!0),j.id!==M&&(M=j.id,tn=!0),Ei||b!==C){Z.buffers.depth.getReversed()&&C.reversedDepth!==!0&&(C._reversedDepth=!0,C.updateProjectionMatrix()),Mt.setValue(I,"projectionMatrix",C.projectionMatrix),Mt.setValue(I,"viewMatrix",C.matrixWorldInverse);const qt=Mt.map.cameraPosition;qt!==void 0&&qt.setValue(I,Se.setFromMatrixPosition(C.matrixWorld)),J.logarithmicDepthBuffer&&Mt.setValue(I,"logDepthBufFC",2/(Math.log(C.far+1)/Math.LN2)),(j.isMeshPhongMaterial||j.isMeshToonMaterial||j.isMeshLambertMaterial||j.isMeshBasicMaterial||j.isMeshStandardMaterial||j.isShaderMaterial)&&Mt.setValue(I,"isOrthographic",C.isOrthographicCamera===!0),b!==C&&(b=C,tn=!0,is=!0)}if(G.isSkinnedMesh){Mt.setOptional(I,G,"bindMatrix"),Mt.setOptional(I,G,"bindMatrixInverse");const $t=G.skeleton;$t&&($t.boneTexture===null&&$t.computeBoneTexture(),Mt.setValue(I,"boneTexture",$t.boneTexture,he))}G.isBatchedMesh&&(Mt.setOptional(I,G,"batchingTexture"),Mt.setValue(I,"batchingTexture",G._matricesTexture,he),Mt.setOptional(I,G,"batchingIdTexture"),Mt.setValue(I,"batchingIdTexture",G._indirectTexture,he),Mt.setOptional(I,G,"batchingColorTexture"),G._colorsTexture!==null&&Mt.setValue(I,"batchingColorTexture",G._colorsTexture,he));const an=W.morphAttributes;if((an.position!==void 0||an.normal!==void 0||an.color!==void 0)&&re.update(G,W,en),(tn||Ue.receiveShadow!==G.receiveShadow)&&(Ue.receiveShadow=G.receiveShadow,Mt.setValue(I,"receiveShadow",G.receiveShadow)),j.isMeshGouraudMaterial&&j.envMap!==null&&(rn.envMap.value=Me,rn.flipEnvMap.value=Me.isCubeTexture&&Me.isRenderTargetTexture===!1?-1:1),j.isMeshStandardMaterial&&j.envMap===null&&B.environment!==null&&(rn.envMapIntensity.value=B.environmentIntensity),tn&&(Mt.setValue(I,"toneMappingExposure",g.toneMappingExposure),Ue.needsLights&&bd(rn,is),le&&j.fog===!0&&te.refreshFogUniforms(rn,le),te.refreshMaterialUniforms(rn,j,$,H,p.state.transmissionRenderTarget[C.id]),wr.upload(I,Xo(Ue),rn,he)),j.isShaderMaterial&&j.uniformsNeedUpdate===!0&&(wr.upload(I,Xo(Ue),rn,he),j.uniformsNeedUpdate=!1),j.isSpriteMaterial&&Mt.setValue(I,"center",G.center),Mt.setValue(I,"modelViewMatrix",G.modelViewMatrix),Mt.setValue(I,"normalMatrix",G.normalMatrix),Mt.setValue(I,"modelMatrix",G.matrixWorld),j.isShaderMaterial||j.isRawShaderMaterial){const $t=j.uniformsGroups;for(let qt=0,Hr=$t.length;qt<Hr;qt++){const si=$t[qt];Ve.update(si,en),Ve.bind(si,en)}}return en}function bd(C,B){C.ambientLightColor.needsUpdate=B,C.lightProbe.needsUpdate=B,C.directionalLights.needsUpdate=B,C.directionalLightShadows.needsUpdate=B,C.pointLights.needsUpdate=B,C.pointLightShadows.needsUpdate=B,C.spotLights.needsUpdate=B,C.spotLightShadows.needsUpdate=B,C.rectAreaLights.needsUpdate=B,C.hemisphereLights.needsUpdate=B}function Md(C){return C.isMeshLambertMaterial||C.isMeshToonMaterial||C.isMeshPhongMaterial||C.isMeshStandardMaterial||C.isShadowMaterial||C.isShaderMaterial&&C.lights===!0}this.getActiveCubeFace=function(){return T},this.getActiveMipmapLevel=function(){return S},this.getRenderTarget=function(){return A},this.setRenderTargetTextures=function(C,B,W){const j=se.get(C);j.__autoAllocateDepthBuffer=C.resolveDepthBuffer===!1,j.__autoAllocateDepthBuffer===!1&&(j.__useRenderToTexture=!1),se.get(C.texture).__webglTexture=B,se.get(C.depthTexture).__webglTexture=j.__autoAllocateDepthBuffer?void 0:W,j.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(C,B){const W=se.get(C);W.__webglFramebuffer=B,W.__useDefaultFramebuffer=B===void 0};const Sd=I.createFramebuffer();this.setRenderTarget=function(C,B=0,W=0){A=C,T=B,S=W;let j=!0,G=null,le=!1,ve=!1;if(C){const Me=se.get(C);if(Me.__useDefaultFramebuffer!==void 0)Z.bindFramebuffer(I.FRAMEBUFFER,null),j=!1;else if(Me.__webglFramebuffer===void 0)he.setupRenderTarget(C);else if(Me.__hasExternalTextures)he.rebindTextures(C,se.get(C.texture).__webglTexture,se.get(C.depthTexture).__webglTexture);else if(C.depthBuffer){const Ie=C.depthTexture;if(Me.__boundDepthTexture!==Ie){if(Ie!==null&&se.has(Ie)&&(C.width!==Ie.image.width||C.height!==Ie.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");he.setupDepthRenderbuffer(C)}}const Ne=C.texture;(Ne.isData3DTexture||Ne.isDataArrayTexture||Ne.isCompressedArrayTexture)&&(ve=!0);const ze=se.get(C).__webglFramebuffer;C.isWebGLCubeRenderTarget?(Array.isArray(ze[B])?G=ze[B][W]:G=ze[B],le=!0):C.samples>0&&he.useMultisampledRTT(C)===!1?G=se.get(C).__webglMultisampledFramebuffer:Array.isArray(ze)?G=ze[W]:G=ze,R.copy(C.viewport),U.copy(C.scissor),L=C.scissorTest}else R.copy(ge).multiplyScalar($).floor(),U.copy(Oe).multiplyScalar($).floor(),L=qe;if(W!==0&&(G=Sd),Z.bindFramebuffer(I.FRAMEBUFFER,G)&&j&&Z.drawBuffers(C,G),Z.viewport(R),Z.scissor(U),Z.setScissorTest(L),le){const Me=se.get(C.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_CUBE_MAP_POSITIVE_X+B,Me.__webglTexture,W)}else if(ve){const Me=B;for(let Ne=0;Ne<C.textures.length;Ne++){const ze=se.get(C.textures[Ne]);I.framebufferTextureLayer(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0+Ne,ze.__webglTexture,W,Me)}}else if(C!==null&&W!==0){const Me=se.get(C.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,Me.__webglTexture,W)}M=-1},this.readRenderTargetPixels=function(C,B,W,j,G,le,ve,we=0){if(!(C&&C.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Me=se.get(C).__webglFramebuffer;if(C.isWebGLCubeRenderTarget&&ve!==void 0&&(Me=Me[ve]),Me){Z.bindFramebuffer(I.FRAMEBUFFER,Me);try{const Ne=C.textures[we],ze=Ne.format,Ie=Ne.type;if(!J.textureFormatReadable(ze)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!J.textureTypeReadable(Ie)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}B>=0&&B<=C.width-j&&W>=0&&W<=C.height-G&&(C.textures.length>1&&I.readBuffer(I.COLOR_ATTACHMENT0+we),I.readPixels(B,W,j,G,Le.convert(ze),Le.convert(Ie),le))}finally{const Ne=A!==null?se.get(A).__webglFramebuffer:null;Z.bindFramebuffer(I.FRAMEBUFFER,Ne)}}},this.readRenderTargetPixelsAsync=async function(C,B,W,j,G,le,ve,we=0){if(!(C&&C.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Me=se.get(C).__webglFramebuffer;if(C.isWebGLCubeRenderTarget&&ve!==void 0&&(Me=Me[ve]),Me)if(B>=0&&B<=C.width-j&&W>=0&&W<=C.height-G){Z.bindFramebuffer(I.FRAMEBUFFER,Me);const Ne=C.textures[we],ze=Ne.format,Ie=Ne.type;if(!J.textureFormatReadable(ze))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!J.textureTypeReadable(Ie))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Ze=I.createBuffer();I.bindBuffer(I.PIXEL_PACK_BUFFER,Ze),I.bufferData(I.PIXEL_PACK_BUFFER,le.byteLength,I.STREAM_READ),C.textures.length>1&&I.readBuffer(I.COLOR_ATTACHMENT0+we),I.readPixels(B,W,j,G,Le.convert(ze),Le.convert(Ie),0);const at=A!==null?se.get(A).__webglFramebuffer:null;Z.bindFramebuffer(I.FRAMEBUFFER,at);const wt=I.fenceSync(I.SYNC_GPU_COMMANDS_COMPLETE,0);return I.flush(),await Zu(I,wt,4),I.bindBuffer(I.PIXEL_PACK_BUFFER,Ze),I.getBufferSubData(I.PIXEL_PACK_BUFFER,0,le),I.deleteBuffer(Ze),I.deleteSync(wt),le}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(C,B=null,W=0){const j=Math.pow(2,-W),G=Math.floor(C.image.width*j),le=Math.floor(C.image.height*j),ve=B!==null?B.x:0,we=B!==null?B.y:0;he.setTexture2D(C,0),I.copyTexSubImage2D(I.TEXTURE_2D,W,0,0,ve,we,G,le),Z.unbindTexture()};const Ed=I.createFramebuffer(),wd=I.createFramebuffer();this.copyTextureToTexture=function(C,B,W=null,j=null,G=0,le=null){le===null&&(G!==0?(Rs("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),le=G,G=0):le=0);let ve,we,Me,Ne,ze,Ie,Ze,at,wt;const vt=C.isCompressedTexture?C.mipmaps[le]:C.image;if(W!==null)ve=W.max.x-W.min.x,we=W.max.y-W.min.y,Me=W.isBox3?W.max.z-W.min.z:1,Ne=W.min.x,ze=W.min.y,Ie=W.isBox3?W.min.z:0;else{const an=Math.pow(2,-G);ve=Math.floor(vt.width*an),we=Math.floor(vt.height*an),C.isDataArrayTexture?Me=vt.depth:C.isData3DTexture?Me=Math.floor(vt.depth*an):Me=1,Ne=0,ze=0,Ie=0}j!==null?(Ze=j.x,at=j.y,wt=j.z):(Ze=0,at=0,wt=0);const pt=Le.convert(B.format),Ue=Le.convert(B.type);let bt;B.isData3DTexture?(he.setTexture3D(B,0),bt=I.TEXTURE_3D):B.isDataArrayTexture||B.isCompressedArrayTexture?(he.setTexture2DArray(B,0),bt=I.TEXTURE_2D_ARRAY):(he.setTexture2D(B,0),bt=I.TEXTURE_2D),I.pixelStorei(I.UNPACK_FLIP_Y_WEBGL,B.flipY),I.pixelStorei(I.UNPACK_PREMULTIPLY_ALPHA_WEBGL,B.premultiplyAlpha),I.pixelStorei(I.UNPACK_ALIGNMENT,B.unpackAlignment);const et=I.getParameter(I.UNPACK_ROW_LENGTH),en=I.getParameter(I.UNPACK_IMAGE_HEIGHT),Ei=I.getParameter(I.UNPACK_SKIP_PIXELS),tn=I.getParameter(I.UNPACK_SKIP_ROWS),is=I.getParameter(I.UNPACK_SKIP_IMAGES);I.pixelStorei(I.UNPACK_ROW_LENGTH,vt.width),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,vt.height),I.pixelStorei(I.UNPACK_SKIP_PIXELS,Ne),I.pixelStorei(I.UNPACK_SKIP_ROWS,ze),I.pixelStorei(I.UNPACK_SKIP_IMAGES,Ie);const Mt=C.isDataArrayTexture||C.isData3DTexture,rn=B.isDataArrayTexture||B.isData3DTexture;if(C.isDepthTexture){const an=se.get(C),$t=se.get(B),qt=se.get(an.__renderTarget),Hr=se.get($t.__renderTarget);Z.bindFramebuffer(I.READ_FRAMEBUFFER,qt.__webglFramebuffer),Z.bindFramebuffer(I.DRAW_FRAMEBUFFER,Hr.__webglFramebuffer);for(let si=0;si<Me;si++)Mt&&(I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,se.get(C).__webglTexture,G,Ie+si),I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,se.get(B).__webglTexture,le,wt+si)),I.blitFramebuffer(Ne,ze,ve,we,Ze,at,ve,we,I.DEPTH_BUFFER_BIT,I.NEAREST);Z.bindFramebuffer(I.READ_FRAMEBUFFER,null),Z.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else if(G!==0||C.isRenderTargetTexture||se.has(C)){const an=se.get(C),$t=se.get(B);Z.bindFramebuffer(I.READ_FRAMEBUFFER,Ed),Z.bindFramebuffer(I.DRAW_FRAMEBUFFER,wd);for(let qt=0;qt<Me;qt++)Mt?I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,an.__webglTexture,G,Ie+qt):I.framebufferTexture2D(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,an.__webglTexture,G),rn?I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,$t.__webglTexture,le,wt+qt):I.framebufferTexture2D(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,$t.__webglTexture,le),G!==0?I.blitFramebuffer(Ne,ze,ve,we,Ze,at,ve,we,I.COLOR_BUFFER_BIT,I.NEAREST):rn?I.copyTexSubImage3D(bt,le,Ze,at,wt+qt,Ne,ze,ve,we):I.copyTexSubImage2D(bt,le,Ze,at,Ne,ze,ve,we);Z.bindFramebuffer(I.READ_FRAMEBUFFER,null),Z.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else rn?C.isDataTexture||C.isData3DTexture?I.texSubImage3D(bt,le,Ze,at,wt,ve,we,Me,pt,Ue,vt.data):B.isCompressedArrayTexture?I.compressedTexSubImage3D(bt,le,Ze,at,wt,ve,we,Me,pt,vt.data):I.texSubImage3D(bt,le,Ze,at,wt,ve,we,Me,pt,Ue,vt):C.isDataTexture?I.texSubImage2D(I.TEXTURE_2D,le,Ze,at,ve,we,pt,Ue,vt.data):C.isCompressedTexture?I.compressedTexSubImage2D(I.TEXTURE_2D,le,Ze,at,vt.width,vt.height,pt,vt.data):I.texSubImage2D(I.TEXTURE_2D,le,Ze,at,ve,we,pt,Ue,vt);I.pixelStorei(I.UNPACK_ROW_LENGTH,et),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,en),I.pixelStorei(I.UNPACK_SKIP_PIXELS,Ei),I.pixelStorei(I.UNPACK_SKIP_ROWS,tn),I.pixelStorei(I.UNPACK_SKIP_IMAGES,is),le===0&&B.generateMipmaps&&I.generateMipmap(bt),Z.unbindTexture()},this.initRenderTarget=function(C){se.get(C).__webglFramebuffer===void 0&&he.setupRenderTarget(C)},this.initTexture=function(C){C.isCubeTexture?he.setTextureCube(C,0):C.isData3DTexture?he.setTexture3D(C,0):C.isDataArrayTexture||C.isCompressedArrayTexture?he.setTexture2DArray(C,0):he.setTexture2D(C,0),Z.unbindTexture()},this.resetState=function(){T=0,S=0,A=null,Z.reset(),_e.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return wn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=tt._getDrawingBufferColorSpace(e),t.unpackColorSpace=tt._getUnpackColorSpace()}}const sc={type:"change"},Ho={type:"start"},dd={type:"end"},gr=new Fr,rc=new Zn,K_=Math.cos(70*qu.DEG2RAD),Lt=new D,Zt=2*Math.PI,lt={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},Ea=1e-6;class Q_ extends sd{constructor(e,t=null){super(e,t),this.state=lt.NONE,this.target=new D,this.cursor=new D,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:$i.ROTATE,MIDDLE:$i.DOLLY,RIGHT:$i.PAN},this.touches={ONE:Bi.ROTATE,TWO:Bi.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new D,this._lastQuaternion=new zt,this._lastTargetPosition=new D,this._quat=new zt().setFromUnitVectors(e.up,new D(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Dl,this._sphericalDelta=new Dl,this._scale=1,this._panOffset=new D,this._rotateStart=new oe,this._rotateEnd=new oe,this._rotateDelta=new oe,this._panStart=new oe,this._panEnd=new oe,this._panDelta=new oe,this._dollyStart=new oe,this._dollyEnd=new oe,this._dollyDelta=new oe,this._dollyDirection=new D,this._mouse=new oe,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=tv.bind(this),this._onPointerDown=ev.bind(this),this._onPointerUp=nv.bind(this),this._onContextMenu=cv.bind(this),this._onMouseWheel=rv.bind(this),this._onKeyDown=av.bind(this),this._onTouchStart=ov.bind(this),this._onTouchMove=lv.bind(this),this._onMouseDown=iv.bind(this),this._onMouseMove=sv.bind(this),this._interceptControlDown=dv.bind(this),this._interceptControlUp=uv.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(sc),this.update(),this.state=lt.NONE}update(e=null){const t=this.object.position;Lt.copy(t).sub(this.target),Lt.applyQuaternion(this._quat),this._spherical.setFromVector3(Lt),this.autoRotate&&this.state===lt.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(i)&&isFinite(s)&&(i<-Math.PI?i+=Zt:i>Math.PI&&(i-=Zt),s<-Math.PI?s+=Zt:s>Math.PI&&(s-=Zt),i<=s?this._spherical.theta=Math.max(i,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+s)/2?Math.max(i,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const a=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=a!=this._spherical.radius}if(Lt.setFromSpherical(this._spherical),Lt.applyQuaternion(this._quatInverse),t.copy(this.target).add(Lt),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let a=null;if(this.object.isPerspectiveCamera){const o=Lt.length();a=this._clampDistance(o*this._scale);const l=o-a;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),r=!!l}else if(this.object.isOrthographicCamera){const o=new D(this._mouse.x,this._mouse.y,0);o.unproject(this.object);const l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=l!==this.object.zoom;const c=new D(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(o),this.object.updateMatrixWorld(),a=Lt.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;a!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(a).add(this.object.position):(gr.origin.copy(this.object.position),gr.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(gr.direction))<K_?this.object.lookAt(this.target):(rc.setFromNormalAndCoplanarPoint(this.object.up,this.target),gr.intersectPlane(rc,this.target))))}else if(this.object.isOrthographicCamera){const a=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),a!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>Ea||8*(1-this._lastQuaternion.dot(this.object.quaternion))>Ea||this._lastTargetPosition.distanceToSquared(this.target)>Ea?(this.dispatchEvent(sc),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?Zt/60*this.autoRotateSpeed*e:Zt/60/60*this.autoRotateSpeed}_getZoomScale(e){const t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){Lt.setFromMatrixColumn(t,0),Lt.multiplyScalar(-e),this._panOffset.add(Lt)}_panUp(e,t){this.screenSpacePanning===!0?Lt.setFromMatrixColumn(t,1):(Lt.setFromMatrixColumn(t,0),Lt.crossVectors(this.object.up,Lt)),Lt.multiplyScalar(e),this._panOffset.add(Lt)}_pan(e,t){const i=this.domElement;if(this.object.isPerspectiveCamera){const s=this.object.position;Lt.copy(s).sub(this.target);let r=Lt.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*r/i.clientHeight,this.object.matrix),this._panUp(2*t*r/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const i=this.domElement.getBoundingClientRect(),s=e-i.left,r=t-i.top,a=i.width,o=i.height;this._mouse.x=s/a*2-1,this._mouse.y=-(r/o)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(Zt*this._rotateDelta.x/t.clientHeight),this._rotateUp(Zt*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(Zt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-Zt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(Zt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-Zt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._rotateStart.set(i,s)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panStart.set(i,s)}}_handleTouchStartDolly(e){const t=this._getSecondPointerPosition(e),i=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(i*i+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const i=this._getSecondPointerPosition(e),s=.5*(e.pageX+i.x),r=.5*(e.pageY+i.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(Zt*this._rotateDelta.x/t.clientHeight),this._rotateUp(Zt*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panEnd.set(i,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const t=this._getSecondPointerPosition(e),i=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(i*i+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const a=(e.pageX+t.x)*.5,o=(e.pageY+t.y)*.5;this._updateZoomParameters(a,o)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new oe,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){const t=e.deltaMode,i={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}}function ev(n){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(n.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(n)&&(this._addPointer(n),n.pointerType==="touch"?this._onTouchStart(n):this._onMouseDown(n)))}function tv(n){this.enabled!==!1&&(n.pointerType==="touch"?this._onTouchMove(n):this._onMouseMove(n))}function nv(n){switch(this._removePointer(n),this._pointers.length){case 0:this.domElement.releasePointerCapture(n.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(dd),this.state=lt.NONE;break;case 1:const e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function iv(n){let e;switch(n.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case $i.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(n),this.state=lt.DOLLY;break;case $i.ROTATE:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=lt.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=lt.ROTATE}break;case $i.PAN:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=lt.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=lt.PAN}break;default:this.state=lt.NONE}this.state!==lt.NONE&&this.dispatchEvent(Ho)}function sv(n){switch(this.state){case lt.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(n);break;case lt.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(n);break;case lt.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(n);break}}function rv(n){this.enabled===!1||this.enableZoom===!1||this.state!==lt.NONE||(n.preventDefault(),this.dispatchEvent(Ho),this._handleMouseWheel(this._customWheelEvent(n)),this.dispatchEvent(dd))}function av(n){this.enabled!==!1&&this._handleKeyDown(n)}function ov(n){switch(this._trackPointer(n),this._pointers.length){case 1:switch(this.touches.ONE){case Bi.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(n),this.state=lt.TOUCH_ROTATE;break;case Bi.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(n),this.state=lt.TOUCH_PAN;break;default:this.state=lt.NONE}break;case 2:switch(this.touches.TWO){case Bi.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(n),this.state=lt.TOUCH_DOLLY_PAN;break;case Bi.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(n),this.state=lt.TOUCH_DOLLY_ROTATE;break;default:this.state=lt.NONE}break;default:this.state=lt.NONE}this.state!==lt.NONE&&this.dispatchEvent(Ho)}function lv(n){switch(this._trackPointer(n),this.state){case lt.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(n),this.update();break;case lt.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(n),this.update();break;case lt.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(n),this.update();break;case lt.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(n),this.update();break;default:this.state=lt.NONE}}function cv(n){this.enabled!==!1&&n.preventDefault()}function dv(n){n.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function uv(n){n.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const ui=new id,Vt=new D,qn=new D,xt=new zt,ac={X:new D(1,0,0),Y:new D(0,1,0),Z:new D(0,0,1)},wa={type:"change"},oc={type:"mouseDown",mode:null},lc={type:"mouseUp",mode:null},cc={type:"objectChange"};class hv extends sd{constructor(e,t=null){super(void 0,t);const i=new vv(this);this._root=i;const s=new xv;this._gizmo=s,i.add(s);const r=new yv;this._plane=r,i.add(r);const a=this;function o(v,g){let E=g;Object.defineProperty(a,v,{get:function(){return E!==void 0?E:g},set:function(T){E!==T&&(E=T,r[v]=T,s[v]=T,a.dispatchEvent({type:v+"-changed",value:T}),a.dispatchEvent(wa))}}),a[v]=g,r[v]=g,s[v]=g}o("camera",e),o("object",void 0),o("enabled",!0),o("axis",null),o("mode","translate"),o("translationSnap",null),o("rotationSnap",null),o("scaleSnap",null),o("space","world"),o("size",1),o("dragging",!1),o("showX",!0),o("showY",!0),o("showZ",!0),o("minX",-1/0),o("maxX",1/0),o("minY",-1/0),o("maxY",1/0),o("minZ",-1/0),o("maxZ",1/0);const l=new D,c=new D,d=new zt,u=new zt,h=new D,m=new zt,_=new D,x=new D,f=new D,p=0,y=new D;o("worldPosition",l),o("worldPositionStart",c),o("worldQuaternion",d),o("worldQuaternionStart",u),o("cameraPosition",h),o("cameraQuaternion",m),o("pointStart",_),o("pointEnd",x),o("rotationAxis",f),o("rotationAngle",p),o("eye",y),this._offset=new D,this._startNorm=new D,this._endNorm=new D,this._cameraScale=new D,this._parentPosition=new D,this._parentQuaternion=new zt,this._parentQuaternionInv=new zt,this._parentScale=new D,this._worldScaleStart=new D,this._worldQuaternionInv=new zt,this._worldScale=new D,this._positionStart=new D,this._quaternionStart=new zt,this._scaleStart=new D,this._getPointer=pv.bind(this),this._onPointerDown=mv.bind(this),this._onPointerHover=fv.bind(this),this._onPointerMove=gv.bind(this),this._onPointerUp=_v.bind(this),t!==null&&this.connect(t)}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointermove",this._onPointerHover),this.domElement.addEventListener("pointerup",this._onPointerUp),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerHover),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.style.touchAction="auto"}getHelper(){return this._root}pointerHover(e){if(this.object===void 0||this.dragging===!0)return;e!==null&&ui.setFromCamera(e,this.camera);const t=Ta(this._gizmo.picker[this.mode],ui);t?this.axis=t.object.name:this.axis=null}pointerDown(e){if(!(this.object===void 0||this.dragging===!0||e!=null&&e.button!==0)&&this.axis!==null){e!==null&&ui.setFromCamera(e,this.camera);const t=Ta(this._plane,ui,!0);t&&(this.object.updateMatrixWorld(),this.object.parent.updateMatrixWorld(),this._positionStart.copy(this.object.position),this._quaternionStart.copy(this.object.quaternion),this._scaleStart.copy(this.object.scale),this.object.matrixWorld.decompose(this.worldPositionStart,this.worldQuaternionStart,this._worldScaleStart),this.pointStart.copy(t.point).sub(this.worldPositionStart)),this.dragging=!0,oc.mode=this.mode,this.dispatchEvent(oc)}}pointerMove(e){const t=this.axis,i=this.mode,s=this.object;let r=this.space;if(i==="scale"?r="local":(t==="E"||t==="XYZE"||t==="XYZ")&&(r="world"),s===void 0||t===null||this.dragging===!1||e!==null&&e.button!==-1)return;e!==null&&ui.setFromCamera(e,this.camera);const a=Ta(this._plane,ui,!0);if(a){if(this.pointEnd.copy(a.point).sub(this.worldPositionStart),i==="translate")this._offset.copy(this.pointEnd).sub(this.pointStart),r==="local"&&t!=="XYZ"&&this._offset.applyQuaternion(this._worldQuaternionInv),t.indexOf("X")===-1&&(this._offset.x=0),t.indexOf("Y")===-1&&(this._offset.y=0),t.indexOf("Z")===-1&&(this._offset.z=0),r==="local"&&t!=="XYZ"?this._offset.applyQuaternion(this._quaternionStart).divide(this._parentScale):this._offset.applyQuaternion(this._parentQuaternionInv).divide(this._parentScale),s.position.copy(this._offset).add(this._positionStart),this.translationSnap&&(r==="local"&&(s.position.applyQuaternion(xt.copy(this._quaternionStart).invert()),t.search("X")!==-1&&(s.position.x=Math.round(s.position.x/this.translationSnap)*this.translationSnap),t.search("Y")!==-1&&(s.position.y=Math.round(s.position.y/this.translationSnap)*this.translationSnap),t.search("Z")!==-1&&(s.position.z=Math.round(s.position.z/this.translationSnap)*this.translationSnap),s.position.applyQuaternion(this._quaternionStart)),r==="world"&&(s.parent&&s.position.add(Vt.setFromMatrixPosition(s.parent.matrixWorld)),t.search("X")!==-1&&(s.position.x=Math.round(s.position.x/this.translationSnap)*this.translationSnap),t.search("Y")!==-1&&(s.position.y=Math.round(s.position.y/this.translationSnap)*this.translationSnap),t.search("Z")!==-1&&(s.position.z=Math.round(s.position.z/this.translationSnap)*this.translationSnap),s.parent&&s.position.sub(Vt.setFromMatrixPosition(s.parent.matrixWorld)))),s.position.x=Math.max(this.minX,Math.min(this.maxX,s.position.x)),s.position.y=Math.max(this.minY,Math.min(this.maxY,s.position.y)),s.position.z=Math.max(this.minZ,Math.min(this.maxZ,s.position.z));else if(i==="scale"){if(t.search("XYZ")!==-1){let o=this.pointEnd.length()/this.pointStart.length();this.pointEnd.dot(this.pointStart)<0&&(o*=-1),qn.set(o,o,o)}else Vt.copy(this.pointStart),qn.copy(this.pointEnd),Vt.applyQuaternion(this._worldQuaternionInv),qn.applyQuaternion(this._worldQuaternionInv),qn.divide(Vt),t.search("X")===-1&&(qn.x=1),t.search("Y")===-1&&(qn.y=1),t.search("Z")===-1&&(qn.z=1);s.scale.copy(this._scaleStart).multiply(qn),this.scaleSnap&&(t.search("X")!==-1&&(s.scale.x=Math.round(s.scale.x/this.scaleSnap)*this.scaleSnap||this.scaleSnap),t.search("Y")!==-1&&(s.scale.y=Math.round(s.scale.y/this.scaleSnap)*this.scaleSnap||this.scaleSnap),t.search("Z")!==-1&&(s.scale.z=Math.round(s.scale.z/this.scaleSnap)*this.scaleSnap||this.scaleSnap))}else if(i==="rotate"){this._offset.copy(this.pointEnd).sub(this.pointStart);const o=20/this.worldPosition.distanceTo(Vt.setFromMatrixPosition(this.camera.matrixWorld));let l=!1;t==="XYZE"?(this.rotationAxis.copy(this._offset).cross(this.eye).normalize(),this.rotationAngle=this._offset.dot(Vt.copy(this.rotationAxis).cross(this.eye))*o):(t==="X"||t==="Y"||t==="Z")&&(this.rotationAxis.copy(ac[t]),Vt.copy(ac[t]),r==="local"&&Vt.applyQuaternion(this.worldQuaternion),Vt.cross(this.eye),Vt.length()===0?l=!0:this.rotationAngle=this._offset.dot(Vt.normalize())*o),(t==="E"||l)&&(this.rotationAxis.copy(this.eye),this.rotationAngle=this.pointEnd.angleTo(this.pointStart),this._startNorm.copy(this.pointStart).normalize(),this._endNorm.copy(this.pointEnd).normalize(),this.rotationAngle*=this._endNorm.cross(this._startNorm).dot(this.eye)<0?1:-1),this.rotationSnap&&(this.rotationAngle=Math.round(this.rotationAngle/this.rotationSnap)*this.rotationSnap),r==="local"&&t!=="E"&&t!=="XYZE"?(s.quaternion.copy(this._quaternionStart),s.quaternion.multiply(xt.setFromAxisAngle(this.rotationAxis,this.rotationAngle)).normalize()):(this.rotationAxis.applyQuaternion(this._parentQuaternionInv),s.quaternion.copy(xt.setFromAxisAngle(this.rotationAxis,this.rotationAngle)),s.quaternion.multiply(this._quaternionStart).normalize())}this.dispatchEvent(wa),this.dispatchEvent(cc)}}pointerUp(e){e!==null&&e.button!==0||(this.dragging&&this.axis!==null&&(lc.mode=this.mode,this.dispatchEvent(lc)),this.dragging=!1,this.axis=null)}dispose(){this.disconnect(),this._root.dispose()}attach(e){return this.object=e,this._root.visible=!0,this}detach(){return this.object=void 0,this.axis=null,this._root.visible=!1,this}reset(){this.enabled&&this.dragging&&(this.object.position.copy(this._positionStart),this.object.quaternion.copy(this._quaternionStart),this.object.scale.copy(this._scaleStart),this.dispatchEvent(wa),this.dispatchEvent(cc),this.pointStart.copy(this.pointEnd))}getRaycaster(){return ui}getMode(){return this.mode}setMode(e){this.mode=e}setTranslationSnap(e){this.translationSnap=e}setRotationSnap(e){this.rotationSnap=e}setScaleSnap(e){this.scaleSnap=e}setSize(e){this.size=e}setSpace(e){this.space=e}setColors(e,t,i,s){const r=this._gizmo.materialLib;r.xAxis.color.set(e),r.yAxis.color.set(t),r.zAxis.color.set(i),r.active.color.set(s),r.xAxisTransparent.color.set(e),r.yAxisTransparent.color.set(t),r.zAxisTransparent.color.set(i),r.activeTransparent.color.set(s),r.xAxis._color&&r.xAxis._color.set(e),r.yAxis._color&&r.yAxis._color.set(t),r.zAxis._color&&r.zAxis._color.set(i),r.active._color&&r.active._color.set(s),r.xAxisTransparent._color&&r.xAxisTransparent._color.set(e),r.yAxisTransparent._color&&r.yAxisTransparent._color.set(t),r.zAxisTransparent._color&&r.zAxisTransparent._color.set(i),r.activeTransparent._color&&r.activeTransparent._color.set(s)}}function pv(n){if(this.domElement.ownerDocument.pointerLockElement)return{x:0,y:0,button:n.button};{const e=this.domElement.getBoundingClientRect();return{x:(n.clientX-e.left)/e.width*2-1,y:-(n.clientY-e.top)/e.height*2+1,button:n.button}}}function fv(n){if(this.enabled)switch(n.pointerType){case"mouse":case"pen":this.pointerHover(this._getPointer(n));break}}function mv(n){this.enabled&&(document.pointerLockElement||this.domElement.setPointerCapture(n.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.pointerHover(this._getPointer(n)),this.pointerDown(this._getPointer(n)))}function gv(n){this.enabled&&this.pointerMove(this._getPointer(n))}function _v(n){this.enabled&&(this.domElement.releasePointerCapture(n.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.pointerUp(this._getPointer(n)))}function Ta(n,e,t){const i=e.intersectObject(n,!0);for(let s=0;s<i.length;s++)if(i[s].object.visible||t)return i[s];return!1}const _r=new _n,ft=new D(0,1,0),dc=new D(0,0,0),uc=new dt,vr=new zt,Tr=new zt,yn=new D,hc=new dt,gs=new D(1,0,0),fi=new D(0,1,0),_s=new D(0,0,1),xr=new D,ds=new D,us=new D;class vv extends Ct{constructor(e){super(),this.isTransformControlsRoot=!0,this.controls=e,this.visible=!1}updateMatrixWorld(e){const t=this.controls;t.object!==void 0&&(t.object.updateMatrixWorld(),t.object.parent===null?console.error("TransformControls: The attached 3D object must be a part of the scene graph."):t.object.parent.matrixWorld.decompose(t._parentPosition,t._parentQuaternion,t._parentScale),t.object.matrixWorld.decompose(t.worldPosition,t.worldQuaternion,t._worldScale),t._parentQuaternionInv.copy(t._parentQuaternion).invert(),t._worldQuaternionInv.copy(t.worldQuaternion).invert()),t.camera.updateMatrixWorld(),t.camera.matrixWorld.decompose(t.cameraPosition,t.cameraQuaternion,t._cameraScale),t.camera.isOrthographicCamera?t.camera.getWorldDirection(t.eye).negate():t.eye.copy(t.cameraPosition).sub(t.worldPosition).normalize(),super.updateMatrixWorld(e)}dispose(){this.traverse(function(e){e.geometry&&e.geometry.dispose(),e.material&&e.material.dispose()})}}class xv extends Ct{constructor(){super(),this.isTransformControlsGizmo=!0,this.type="TransformControlsGizmo";const e=new Or({depthTest:!1,depthWrite:!1,fog:!1,toneMapped:!1,transparent:!0}),t=new Ki({depthTest:!1,depthWrite:!1,fog:!1,toneMapped:!1,transparent:!0}),i=e.clone();i.opacity=.15;const s=t.clone();s.opacity=.5;const r=e.clone();r.color.setHex(16711680);const a=e.clone();a.color.setHex(65280);const o=e.clone();o.color.setHex(255);const l=e.clone();l.color.setHex(16711680),l.opacity=.5;const c=e.clone();c.color.setHex(65280),c.opacity=.5;const d=e.clone();d.color.setHex(255),d.opacity=.5;const u=e.clone();u.opacity=.25;const h=e.clone();h.color.setHex(16776960),h.opacity=.25;const m=e.clone();m.color.setHex(16776960);const _=e.clone();_.color.setHex(7895160),this.materialLib={xAxis:r,yAxis:a,zAxis:o,active:m,xAxisTransparent:l,yAxisTransparent:c,zAxisTransparent:d,activeTransparent:h};const x=new Ot(0,.04,.1,12);x.translate(0,.05,0);const f=new St(.08,.08,.08);f.translate(0,.04,0);const p=new Ft;p.setAttribute("position",new rt([0,0,0,1,0,0],3));const y=new Ot(.0075,.0075,.5,3);y.translate(0,.25,0);function v(F,O){const H=new gi(F,.0075,3,64,O*Math.PI*2);return H.rotateY(Math.PI/2),H.rotateX(Math.PI/2),H}function g(){const F=new Ft;return F.setAttribute("position",new rt([0,0,0,1,1,1],3)),F}const E={X:[[new be(x,r),[.5,0,0],[0,0,-Math.PI/2]],[new be(x,r),[-.5,0,0],[0,0,Math.PI/2]],[new be(y,r),[0,0,0],[0,0,-Math.PI/2]]],Y:[[new be(x,a),[0,.5,0]],[new be(x,a),[0,-.5,0],[Math.PI,0,0]],[new be(y,a)]],Z:[[new be(x,o),[0,0,.5],[Math.PI/2,0,0]],[new be(x,o),[0,0,-.5],[-Math.PI/2,0,0]],[new be(y,o),null,[Math.PI/2,0,0]]],XYZ:[[new be(new Gi(.1,0),u),[0,0,0]]],XY:[[new be(new St(.15,.15,.01),d),[.15,.15,0]]],YZ:[[new be(new St(.15,.15,.01),l),[0,.15,.15],[0,Math.PI/2,0]]],XZ:[[new be(new St(.15,.15,.01),c),[.15,0,.15],[-Math.PI/2,0,0]]]},T={X:[[new be(new Ot(.2,0,.6,4),i),[.3,0,0],[0,0,-Math.PI/2]],[new be(new Ot(.2,0,.6,4),i),[-.3,0,0],[0,0,Math.PI/2]]],Y:[[new be(new Ot(.2,0,.6,4),i),[0,.3,0]],[new be(new Ot(.2,0,.6,4),i),[0,-.3,0],[0,0,Math.PI]]],Z:[[new be(new Ot(.2,0,.6,4),i),[0,0,.3],[Math.PI/2,0,0]],[new be(new Ot(.2,0,.6,4),i),[0,0,-.3],[-Math.PI/2,0,0]]],XYZ:[[new be(new Gi(.2,0),i)]],XY:[[new be(new St(.2,.2,.01),i),[.15,.15,0]]],YZ:[[new be(new St(.2,.2,.01),i),[0,.15,.15],[0,Math.PI/2,0]]],XZ:[[new be(new St(.2,.2,.01),i),[.15,0,.15],[-Math.PI/2,0,0]]]},S={START:[[new be(new Gi(.01,2),s),null,null,null,"helper"]],END:[[new be(new Gi(.01,2),s),null,null,null,"helper"]],DELTA:[[new On(g(),s),null,null,null,"helper"]],X:[[new On(p,s),[-1e3,0,0],null,[1e6,1,1],"helper"]],Y:[[new On(p,s),[0,-1e3,0],[0,0,Math.PI/2],[1e6,1,1],"helper"]],Z:[[new On(p,s),[0,0,-1e3],[0,-Math.PI/2,0],[1e6,1,1],"helper"]]},A={XYZE:[[new be(v(.5,1),_),null,[0,Math.PI/2,0]]],X:[[new be(v(.5,.5),r)]],Y:[[new be(v(.5,.5),a),null,[0,0,-Math.PI/2]]],Z:[[new be(v(.5,.5),o),null,[0,Math.PI/2,0]]],E:[[new be(v(.75,1),h),null,[0,Math.PI/2,0]]]},M={AXIS:[[new On(p,s),[-1e3,0,0],null,[1e6,1,1],"helper"]]},b={XYZE:[[new be(new Fs(.25,10,8),i)]],X:[[new be(new gi(.5,.1,4,24),i),[0,0,0],[0,-Math.PI/2,-Math.PI/2]]],Y:[[new be(new gi(.5,.1,4,24),i),[0,0,0],[Math.PI/2,0,0]]],Z:[[new be(new gi(.5,.1,4,24),i),[0,0,0],[0,0,-Math.PI/2]]],E:[[new be(new gi(.75,.1,2,24),i)]]},R={X:[[new be(f,r),[.5,0,0],[0,0,-Math.PI/2]],[new be(y,r),[0,0,0],[0,0,-Math.PI/2]],[new be(f,r),[-.5,0,0],[0,0,Math.PI/2]]],Y:[[new be(f,a),[0,.5,0]],[new be(y,a)],[new be(f,a),[0,-.5,0],[0,0,Math.PI]]],Z:[[new be(f,o),[0,0,.5],[Math.PI/2,0,0]],[new be(y,o),[0,0,0],[Math.PI/2,0,0]],[new be(f,o),[0,0,-.5],[-Math.PI/2,0,0]]],XY:[[new be(new St(.15,.15,.01),d),[.15,.15,0]]],YZ:[[new be(new St(.15,.15,.01),l),[0,.15,.15],[0,Math.PI/2,0]]],XZ:[[new be(new St(.15,.15,.01),c),[.15,0,.15],[-Math.PI/2,0,0]]],XYZ:[[new be(new St(.1,.1,.1),u)]]},U={X:[[new be(new Ot(.2,0,.6,4),i),[.3,0,0],[0,0,-Math.PI/2]],[new be(new Ot(.2,0,.6,4),i),[-.3,0,0],[0,0,Math.PI/2]]],Y:[[new be(new Ot(.2,0,.6,4),i),[0,.3,0]],[new be(new Ot(.2,0,.6,4),i),[0,-.3,0],[0,0,Math.PI]]],Z:[[new be(new Ot(.2,0,.6,4),i),[0,0,.3],[Math.PI/2,0,0]],[new be(new Ot(.2,0,.6,4),i),[0,0,-.3],[-Math.PI/2,0,0]]],XY:[[new be(new St(.2,.2,.01),i),[.15,.15,0]]],YZ:[[new be(new St(.2,.2,.01),i),[0,.15,.15],[0,Math.PI/2,0]]],XZ:[[new be(new St(.2,.2,.01),i),[.15,0,.15],[-Math.PI/2,0,0]]],XYZ:[[new be(new St(.2,.2,.2),i),[0,0,0]]]},L={X:[[new On(p,s),[-1e3,0,0],null,[1e6,1,1],"helper"]],Y:[[new On(p,s),[0,-1e3,0],[0,0,Math.PI/2],[1e6,1,1],"helper"]],Z:[[new On(p,s),[0,0,-1e3],[0,-Math.PI/2,0],[1e6,1,1],"helper"]]};function k(F){const O=new Ct;for(const H in F)for(let $=F[H].length;$--;){const ee=F[H][$][0].clone(),pe=F[H][$][1],ge=F[H][$][2],Oe=F[H][$][3],qe=F[H][$][4];ee.name=H,ee.tag=qe,pe&&ee.position.set(pe[0],pe[1],pe[2]),ge&&ee.rotation.set(ge[0],ge[1],ge[2]),Oe&&ee.scale.set(Oe[0],Oe[1],Oe[2]),ee.updateMatrix();const Qe=ee.geometry.clone();Qe.applyMatrix4(ee.matrix),ee.geometry=Qe,ee.renderOrder=1/0,ee.position.set(0,0,0),ee.rotation.set(0,0,0),ee.scale.set(1,1,1),O.add(ee)}return O}this.gizmo={},this.picker={},this.helper={},this.add(this.gizmo.translate=k(E)),this.add(this.gizmo.rotate=k(A)),this.add(this.gizmo.scale=k(R)),this.add(this.picker.translate=k(T)),this.add(this.picker.rotate=k(b)),this.add(this.picker.scale=k(U)),this.add(this.helper.translate=k(S)),this.add(this.helper.rotate=k(M)),this.add(this.helper.scale=k(L)),this.picker.translate.visible=!1,this.picker.rotate.visible=!1,this.picker.scale.visible=!1}updateMatrixWorld(e){const i=(this.mode==="scale"?"local":this.space)==="local"?this.worldQuaternion:Tr;this.gizmo.translate.visible=this.mode==="translate",this.gizmo.rotate.visible=this.mode==="rotate",this.gizmo.scale.visible=this.mode==="scale",this.helper.translate.visible=this.mode==="translate",this.helper.rotate.visible=this.mode==="rotate",this.helper.scale.visible=this.mode==="scale";let s=[];s=s.concat(this.picker[this.mode].children),s=s.concat(this.gizmo[this.mode].children),s=s.concat(this.helper[this.mode].children);for(let r=0;r<s.length;r++){const a=s[r];a.visible=!0,a.rotation.set(0,0,0),a.position.copy(this.worldPosition);let o;if(this.camera.isOrthographicCamera?o=(this.camera.top-this.camera.bottom)/this.camera.zoom:o=this.worldPosition.distanceTo(this.cameraPosition)*Math.min(1.9*Math.tan(Math.PI*this.camera.fov/360)/this.camera.zoom,7),a.scale.set(1,1,1).multiplyScalar(o*this.size/4),a.tag==="helper"){a.visible=!1,a.name==="AXIS"?(a.visible=!!this.axis,this.axis==="X"&&(xt.setFromEuler(_r.set(0,0,0)),a.quaternion.copy(i).multiply(xt),Math.abs(ft.copy(gs).applyQuaternion(i).dot(this.eye))>.9&&(a.visible=!1)),this.axis==="Y"&&(xt.setFromEuler(_r.set(0,0,Math.PI/2)),a.quaternion.copy(i).multiply(xt),Math.abs(ft.copy(fi).applyQuaternion(i).dot(this.eye))>.9&&(a.visible=!1)),this.axis==="Z"&&(xt.setFromEuler(_r.set(0,Math.PI/2,0)),a.quaternion.copy(i).multiply(xt),Math.abs(ft.copy(_s).applyQuaternion(i).dot(this.eye))>.9&&(a.visible=!1)),this.axis==="XYZE"&&(xt.setFromEuler(_r.set(0,Math.PI/2,0)),ft.copy(this.rotationAxis),a.quaternion.setFromRotationMatrix(uc.lookAt(dc,ft,fi)),a.quaternion.multiply(xt),a.visible=this.dragging),this.axis==="E"&&(a.visible=!1)):a.name==="START"?(a.position.copy(this.worldPositionStart),a.visible=this.dragging):a.name==="END"?(a.position.copy(this.worldPosition),a.visible=this.dragging):a.name==="DELTA"?(a.position.copy(this.worldPositionStart),a.quaternion.copy(this.worldQuaternionStart),Vt.set(1e-10,1e-10,1e-10).add(this.worldPositionStart).sub(this.worldPosition).multiplyScalar(-1),Vt.applyQuaternion(this.worldQuaternionStart.clone().invert()),a.scale.copy(Vt),a.visible=this.dragging):(a.quaternion.copy(i),this.dragging?a.position.copy(this.worldPositionStart):a.position.copy(this.worldPosition),this.axis&&(a.visible=this.axis.search(a.name)!==-1));continue}a.quaternion.copy(i),this.mode==="translate"||this.mode==="scale"?(a.name==="X"&&Math.abs(ft.copy(gs).applyQuaternion(i).dot(this.eye))>.99&&(a.scale.set(1e-10,1e-10,1e-10),a.visible=!1),a.name==="Y"&&Math.abs(ft.copy(fi).applyQuaternion(i).dot(this.eye))>.99&&(a.scale.set(1e-10,1e-10,1e-10),a.visible=!1),a.name==="Z"&&Math.abs(ft.copy(_s).applyQuaternion(i).dot(this.eye))>.99&&(a.scale.set(1e-10,1e-10,1e-10),a.visible=!1),a.name==="XY"&&Math.abs(ft.copy(_s).applyQuaternion(i).dot(this.eye))<.2&&(a.scale.set(1e-10,1e-10,1e-10),a.visible=!1),a.name==="YZ"&&Math.abs(ft.copy(gs).applyQuaternion(i).dot(this.eye))<.2&&(a.scale.set(1e-10,1e-10,1e-10),a.visible=!1),a.name==="XZ"&&Math.abs(ft.copy(fi).applyQuaternion(i).dot(this.eye))<.2&&(a.scale.set(1e-10,1e-10,1e-10),a.visible=!1)):this.mode==="rotate"&&(vr.copy(i),ft.copy(this.eye).applyQuaternion(xt.copy(i).invert()),a.name.search("E")!==-1&&a.quaternion.setFromRotationMatrix(uc.lookAt(this.eye,dc,fi)),a.name==="X"&&(xt.setFromAxisAngle(gs,Math.atan2(-ft.y,ft.z)),xt.multiplyQuaternions(vr,xt),a.quaternion.copy(xt)),a.name==="Y"&&(xt.setFromAxisAngle(fi,Math.atan2(ft.x,ft.z)),xt.multiplyQuaternions(vr,xt),a.quaternion.copy(xt)),a.name==="Z"&&(xt.setFromAxisAngle(_s,Math.atan2(ft.y,ft.x)),xt.multiplyQuaternions(vr,xt),a.quaternion.copy(xt))),a.visible=a.visible&&(a.name.indexOf("X")===-1||this.showX),a.visible=a.visible&&(a.name.indexOf("Y")===-1||this.showY),a.visible=a.visible&&(a.name.indexOf("Z")===-1||this.showZ),a.visible=a.visible&&(a.name.indexOf("E")===-1||this.showX&&this.showY&&this.showZ),a.material._color=a.material._color||a.material.color.clone(),a.material._opacity=a.material._opacity||a.material.opacity,a.material.color.copy(a.material._color),a.material.opacity=a.material._opacity,this.enabled&&this.axis&&(a.name===this.axis?(a.material.color.copy(this.materialLib.active.color),a.material.opacity=1):this.axis.split("").some(function(l){return a.name===l})&&(a.material.color.copy(this.materialLib.active.color),a.material.opacity=1))}super.updateMatrixWorld(e)}}class yv extends be{constructor(){super(new Ns(1e5,1e5,2,2),new Or({visible:!1,wireframe:!0,side:fn,transparent:!0,opacity:.1,toneMapped:!1})),this.isTransformControlsPlane=!0,this.type="TransformControlsPlane"}updateMatrixWorld(e){let t=this.space;switch(this.position.copy(this.worldPosition),this.mode==="scale"&&(t="local"),xr.copy(gs).applyQuaternion(t==="local"?this.worldQuaternion:Tr),ds.copy(fi).applyQuaternion(t==="local"?this.worldQuaternion:Tr),us.copy(_s).applyQuaternion(t==="local"?this.worldQuaternion:Tr),ft.copy(ds),this.mode){case"translate":case"scale":switch(this.axis){case"X":ft.copy(this.eye).cross(xr),yn.copy(xr).cross(ft);break;case"Y":ft.copy(this.eye).cross(ds),yn.copy(ds).cross(ft);break;case"Z":ft.copy(this.eye).cross(us),yn.copy(us).cross(ft);break;case"XY":yn.copy(us);break;case"YZ":yn.copy(xr);break;case"XZ":ft.copy(us),yn.copy(ds);break;case"XYZ":case"E":yn.set(0,0,0);break}break;case"rotate":default:yn.set(0,0,0)}yn.length()===0?this.quaternion.copy(this.cameraQuaternion):(hc.lookAt(Vt.set(0,0,0),yn,ft),this.quaternion.setFromRotationMatrix(hc)),super.updateMatrixWorld(e)}}function pc(n,e,t){var s,r;if(n.dimension==="2d"&&e===2)return 0;if(n.mesh_type==="explicit"&&((s=n.mesh_coordinates)!=null&&s[e])){const a=n.mesh_coordinates[e];let o=0,l=a.length-1;for(;l-o>1;){const c=o+l>>1;a[c]<t?o=c:l=c}return Math.abs(a[o]-t)<=Math.abs(a[l]-t)?a[o]:a[l]}const i=((r=n.mesh_steps)==null?void 0:r[e])??n.mesh;return Math.round(t/i)*i}function bv(n,e,t){var a,o,l;if(n.dimension==="2d"&&e===2)return 0;const i=(a=n.boundaries)==null?void 0:a["xyz"[e]+"_"+t];if(i&&i.kind!=="pml")return 0;const s=(i==null?void 0:i.layers)??n.pml_cells,r=(o=n.mesh_coordinates)==null?void 0:o[e];return n.mesh_type==="explicit"&&r?t==="min"?r[s]-r[0]:r.at(-1)-r.at(-s-1):s*(((l=n.mesh_steps)==null?void 0:l[e])??n.mesh)}function Mv(n,e,t,i){n.mesh_type??(n.mesh_type="uniform"),n.material_sampling??(n.material_sampling="cell"),n.interface_method??(n.interface_method="staircase"),n.subpixel_quadrature??(n.subpixel_quadrature=8),n.mesh_max??(n.mesh_max=.15),n.mesh_grading??(n.mesh_grading=1.25),n.mesh_ppw??(n.mesh_ppw=24),n.mesh_auto_refine??(n.mesh_auto_refine=!0),n.mesh_refinements??(n.mesh_refinements=[]);const s=n.mesh_type==="graded",r=n.mesh_type==="explicit",a=!!n.mesh_steps;return t("mesh type","mesh_type",n.mesh_type,[["uniform","Uniform"],["graded","Graded · local refinement"],...r?[["explicit","Explicit node arrays"]]:[]])+(r?'<p class="property-help">Frozen node arrays. Geometry edits keep these nodes. Edit the arrays or select a generated mesh to change the grid.</p>':`<label class="enabled-row"><input type="checkbox" data-axis-steps ${a?"checked":""}> Independent axis spacing</label>`+(a?n.mesh_steps.map((o,l)=>e("d"+"xyz"[l],`mesh_steps.${l}`,o,"µm",{min:.001})).join(""):e(s?"fine mesh step":"dx = dy = dz","mesh",n.mesh,"µm",{min:.001})))+t("interface method","interface_method",n.interface_method,[["staircase","Staircase"],["subpixel","Subpixel · experimental dielectric"]])+t("interface sampling","material_sampling",n.material_sampling,s||r||a||n.interface_method==="subpixel"?[["yee","Yee component locations"]]:[["cell","Cell centers (legacy)"],["yee","Yee component locations"]])+(n.interface_method==="subpixel"?e("face quadrature order","subpixel_quadrature",n.subpixel_quadrature,"",{min:2,max:32,step:1})+'<p class="property-help">Lossless dielectrics and constant spacing on each axis only. Compare quadrature orders and mesh refinement. Curved-interface accuracy is under validation, especially at high index contrast.</p>':"")+`<label class="enabled-row"><input type="checkbox" data-fixed-dt ${n.time_step_override?"checked":""}> Set a smaller fixed time step</label>`+(n.time_step_override?e("time step","time_step_override",n.time_step_override*1e15,"fs",{min:1e-6,scale:1e-15}):"")+(s?e("maximum step","mesh_max",n.mesh_max,"µm",{min:n.mesh})+e("grading factor","mesh_grading",n.mesh_grading,"",{min:1.05})+e("background cells / λ","mesh_ppw",n.mesh_ppw,"",{min:6})+`<label class="enabled-row"><input type="checkbox" data-path="mesh_auto_refine" ${n.mesh_auto_refine?"checked":""}> Refine structures, sources and monitors</label><p class="property-help">Fine spacing is retained in refinement regions and PML. The wavelength setting caps the background step. The timestep stays fixed by the fine spacing.</p>`+n.mesh_refinements.map((o,l)=>`<details class="boundary-options"><summary>${i(o.name)}</summary><label class="enabled-row"><input type="checkbox" data-path="mesh_refinements.${l}.enabled" ${o.enabled?"checked":""}> Enabled</label>${o.center.map((c,d)=>e("xyz"[d],`mesh_refinements.${l}.center.${d}`,c,"µm")).join("")}${o.size.map((c,d)=>e("xyz"[d]+" span",`mesh_refinements.${l}.size.${d}`,c,"µm",{min:.001})).join("")}<button data-action="mesh-remove" data-index="${l}">Remove refinement</button></details>`).join("")+'<button data-action="mesh-add">+ Add refinement region</button><button data-action="mesh-freeze">Freeze automatic refinements</button>':"")+`<button data-action="mesh-nodes">Edit explicit node arrays</button><button data-action="mesh-preview">Preview simulation mesh</button><p class="property-help">Yee sampling places materials at each electric field component. ${n.interface_method==="subpixel"?"Subpixel also couples neighboring components across interfaces. The permittivity image shows only the reciprocal diagonal of that operator.":"Staircase interfaces follow the grid."} Test mesh convergence for the required accuracy.</p>`}function Sv({state:n,api:e,esc:t,commit:i}){const s=document.createElement("dialog");s.className="mesh-dialog",document.body.append(s);let r,a="xy";const o=c=>s.querySelector(c);function l(){const c=o("canvas"),d=c.getContext("2d");c.width=1e3,c.height=600;const[u,h]=[...a].map(S=>"xyz".indexOf(S)),m=r.nodes_um,_=m[u],x=m[h],f=_.at(-1)-_[0],p=x.at(-1)-x[0],y=Math.min(880/f,480/p),v=(1e3-f*y)/2,g=(600-p*y)/2,E=S=>v+(S-_[0])*y,T=S=>g+(x.at(-1)-S)*y;d.fillStyle="#101c2b",d.fillRect(0,0,1e3,600);for(const S of r.refinements)d.fillStyle="rgba(71,191,169,.13)",d.fillRect(E(S.center[u]-S.size[u]/2),T(S.center[h]+S.size[h]/2),S.size[u]*y,S.size[h]*y);d.save(),d.beginPath(),d.rect(v,g,f*y,p*y),d.clip(),d.strokeStyle="#7087a56e",d.lineWidth=.7,d.beginPath();for(const S of _)d.moveTo(E(S),g),d.lineTo(E(S),g+p*y);for(const S of x)d.moveTo(v,T(S)),d.lineTo(v+f*y,T(S));d.stroke();for(const S of r.structures)d.strokeStyle="#ecb86a",d.lineWidth=2,d.strokeRect(E(S.center[u]-S.size[u]/2),T(S.center[h]+S.size[h]/2),S.size[u]*y,S.size[h]*y);d.restore(),d.fillStyle="#d9e7f5",d.font="15px system-ui",d.textAlign="center",d.fillText(`${a[0]} (µm) · ${_[0].toPrecision(4)} … ${_.at(-1).toPrecision(4)}`,500,585),d.save(),d.translate(20,300),d.rotate(-Math.PI/2),d.fillText(`${a[1]} (µm) · ${x[0].toPrecision(4)} … ${x.at(-1).toPrecision(4)}`,0,0),d.restore()}return{async open(){r=await e("/mesh/preview",n.project);const c=r.summary;s.innerHTML=`<div class="fsp-heading"><h2>Simulation mesh</h2><button data-dismiss>Close</button></div><div class="mesh-metrics"><strong>${c.shape.join(" × ")} cells</strong><span>${c.cell_reduction_percent.toFixed(1)}% fewer cells than uniform</span><span>~${c.estimated_memory_mb} MB · Δt ${c.dt_fs.toFixed(4)} fs</span></div><label>Projection <select aria-label="Mesh projection">${(n.project.region.dimension==="2d"?["xy"]:["xy","xz","yz"]).map(d=>`<option>${d}</option>`).join("")}</select></label><canvas aria-label="Simulation mesh grid"></canvas><p>Gold: structure bounds. Green: refinement bounds projected onto this view. Grid lines show actual cell boundaries${r.preview_decimated?" (preview decimated to 1,000 lines per axis)":""}. Refinements extend across coordinate planes.</p><p>Step range: ${c.axis_min_step_um.map((d,u)=>`${"xyz"[u]} ${d.toPrecision(4)}–${c.axis_max_step_um[u].toPrecision(4)} µm`).join(" · ")}. Largest adjacent ratio: ${c.max_adjacent_ratio.toFixed(3)}.</p>`,a="xy",o("[data-dismiss]").onclick=()=>s.close(),o("select").onchange=d=>{a=d.target.value,l()},s.showModal(),l()},async freeze(){const c=await e("/mesh/freeze",n.project);i(c)},async editNodes(){const{nodes_um:c}=await e("/mesh/coordinates",n.project);s.innerHTML='<div class="fsp-heading"><h2>Explicit mesh nodes</h2><button data-dismiss>Close</button></div><p>Coordinates in µm. Each axis must increase strictly and be centered on zero. Array endpoints set the domain spans. In 2D, z needs exactly two endpoints. Changing geometry will keep this grid.</p>'+c.map((d,u)=>`<label>${"xyz"[u]} nodes (µm)<textarea aria-label="${"xyz"[u]} mesh nodes" data-node-axis="${u}" rows="5" style="width:100%">${d.join(", ")}</textarea></label>`).join("")+'<p data-node-error role="alert"></p><button data-apply-nodes>Apply node arrays</button>',o("[data-dismiss]").onclick=()=>s.close(),o("[data-apply-nodes]").onclick=async()=>{try{const d=[...s.querySelectorAll("[data-node-axis]")].map(m=>m.value.trim().split(/[\s,]+/).filter(Boolean).map(Number));if(d.some(m=>m.length<2||m.some(_=>!Number.isFinite(_))))throw Error("Enter at least two finite numbers for each axis.");const u=structuredClone(n.project);Object.assign(u.region,{mesh_type:"explicit",mesh_steps:null,mesh_coordinates:d,size:d.map(m=>m.at(-1)-m[0]),material_sampling:"yee",mesh_auto_refine:!1});const h=await e("/validate",u);i(h.project),s.close()}catch(d){o("[data-node-error]").textContent=d.message}},s.showModal()},add(){const c=structuredClone(n.project);c.region.mesh_refinements.push({name:`Refinement ${c.region.mesh_refinements.length+1}`,center:[0,0,0],size:[1,1,1],enabled:!0}),i(c)},remove(c){const d=structuredClone(n.project);d.region.mesh_refinements.splice(c,1),i(d)}}}function kr(n){return n.rotation??(n.rotation=0),n.rotation_axes??(n.rotation_axes=["z","x","y"]),n.rotation_angles??(n.rotation_angles=[0,0,0]),n.make_ellipsoid??(n.make_ellipsoid=!1),n.radius_2??(n.radius_2=.5),n.radius_3??(n.radius_3=.5),n.inner_radius_2??(n.inner_radius_2=.3),n.theta_start??(n.theta_start=0),n.theta_stop??(n.theta_stop=360),n.vertices??(n.vertices=[[-.5,-.5],[.5,-.5],[0,.5]]),n}function Ev(n){const e=new dt().makeRotationZ((n.rotation||0)*Math.PI/180);return(n.rotation_axes||["z","x","y"]).forEach((t,i)=>{var r;if(t==="none")return;const s=new D;s.setComponent("xyz".indexOf(t),1),e.premultiply(new dt().makeRotationAxis(s,(((r=n.rotation_angles)==null?void 0:r[i])||0)*Math.PI/180))}),e}function wv(n){const e=n.radius,t=n.make_ellipsoid?n.radius_2:e,i=n.make_ellipsoid?n.radius_3:e;if(n.kind==="rectangle")return new St(...n.size);if(n.kind==="sphere")return new Fs(1,48,32).scale(e,t,i);if(n.kind==="circle")return new Ot(1,1,n.size[2],96).rotateX(Math.PI/2).scale(e,t,1);let s;if(n.kind==="polygon")s=new Er(n.vertices.map(r=>new oe(...r)));else if(n.kind==="ring"){const r=(n.theta_stop??360)-(n.theta_start??0),a=(r%360+360)%360||360,o=a===360,l=Math.max(3,Math.ceil(96*a/360)),c=(h,m)=>Array.from({length:o?l:l+1},(_,x)=>{const f=((n.theta_start??0)+a*x/l)*Math.PI/180,p=Math.cos(f),y=Math.sin(f),v=1/Math.sqrt((p/h)**2+(y/m)**2);return new oe(v*p,v*y)}),d=c(e,t),u=n.inner_radius>0?c(n.inner_radius,n.make_ellipsoid?n.inner_radius_2:n.inner_radius):[];o?(s=new Er(d),u.length&&s.holes.push(new yo(u.reverse()))):s=new Er([...d,...u.length?u.reverse():[new oe(0,0)]])}if(!s)throw Error("Unsupported CAD solid: "+n.kind);return new ko(s,{depth:n.size[2],steps:1,bevelEnabled:!1}).translate(0,0,-n.size[2]/2)}const hi=new Map;function ud(n){kr(n);const e=JSON.stringify([n.kind,n.size,n.radius,n.inner_radius,n.make_ellipsoid,n.radius_2,n.radius_3,n.inner_radius_2,n.theta_start,n.theta_stop,n.vertices,n.rotation,n.rotation_axes,n.rotation_angles]);if(hi.has(e))return hi.get(e);const t=wv(n).applyMatrix4(Ev(n)),i=t.index?t.toNonIndexed():t.clone(),s=new vo(t,20),r={geometry:t,points:Array.from(i.attributes.position.array),edges:Array.from(s.attributes.position.array),projections:{}};if(i.dispose(),s.dispose(),hi.set(e,r),hi.size>128){const a=hi.keys().next().value;hi.get(a).geometry.dispose(),hi.delete(a)}return r}function Tv(n){return ud(n).geometry.clone()}function hd(n,e){const t=ud(n),i=e.join("");if(t.projections[i])return t.projections[i];const s=[],r=[];let a=1/0,o=-1/0;for(let l=0;l<t.points.length;l+=9){const c=[0,3,6].map(u=>[t.points[l+u+e[0]],t.points[l+u+e[1]]]),d=(c[1][0]-c[0][0])*(c[2][1]-c[0][1])-(c[1][1]-c[0][1])*(c[2][0]-c[0][0]);if(!(Math.abs(d)<1e-18)){d<0&&([c[1],c[2]]=[c[2],c[1]]),s.push(c);for(const u of c)a=Math.min(a,u[1]),o=Math.max(o,u[1])}}for(let l=0;l<t.edges.length;l+=6)r.push([0,3].map(c=>[t.edges[l+c+e[0]],t.edges[l+c+e[1]]]));return t.projections[i]={triangles:s,edges:r,low:a,high:o}}function Av(n,e,t,i){const s=[e[0]-n.center[t[0]],e[1]-n.center[t[1]]],r=hd(n,t);return r.triangles.some(a=>a.every((o,l)=>{const c=a[(l+1)%3];return(c[0]-o[0])*(s[1]-o[1])-(c[1]-o[1])*(s[0]-o[0])>=-1e-12}))?!0:r.edges.some(([a,o])=>{const l=o[0]-a[0],c=o[1]-a[1],d=l*l+c*c,u=d?Math.max(0,Math.min(1,((s[0]-a[0])*l+(s[1]-a[1])*c)/d)):0;return Math.hypot(s[0]-a[0]-u*l,s[1]-a[1]-u*c)<=i})}function Cv(n,e){kr(n);let t="";return["circle","sphere","ring"].includes(n.kind)&&(t+=`<label class="enabled-row"><input type="checkbox" data-path="make_ellipsoid" ${n.make_ellipsoid?"checked":""}> Elliptical radii</label>`,n.make_ellipsoid&&(t+=e("radius 2","radius_2",n.radius_2,"µm",{min:.001})+(n.kind==="sphere"?e("radius 3","radius_3",n.radius_3,"µm",{min:.001}):"")+(n.kind==="ring"?e("inner radius 2","inner_radius_2",n.inner_radius_2,"µm",{min:0}):""))),n.kind==="ring"&&(t+=e("theta start","theta_start",n.theta_start,"deg")+e("theta stop","theta_stop",n.theta_stop,"deg")+'<p class="property-help">Counterclockwise arc in the local XY plane, wrapping through 360°. Angles are polar angles even for elliptical rings.</p>'),n.kind==="polygon"&&(t+=`<button data-action="geometry-vertices">Edit polygon vertices</button><p class="property-help">${n.vertices.length} local XY vertices, extruded along local z. One simple contour without holes.</p>`),t}function Rv(n,e,t){return kr(n),e("z rotation","rotation",n.rotation,"deg")+n.rotation_axes.map((i,s)=>t(["first","second","third"][s]+" axis",`rotation_axes.${s}`,i,["none","x","y","z"])+e("rotation "+(s+1),`rotation_angles.${s}`,n.rotation_angles[s],"deg")).join("")+'<p class="property-help">Right-handed rotations about fixed world axes. Apply the legacy z angle, then rotations 1, 2 and 3 about the object center. CAD views show projections. A 2D calculation samples z = 0.</p>'}function Pv({state:n,api:e,esc:t,commit:i}){const s=document.createElement("dialog");return s.className="geometry-dialog",document.body.append(s),{open(r){const a=n.project.structures.find(o=>o.id===r);!a||a.kind!=="polygon"||(s.innerHTML=`<div class="fsp-heading"><h2>Polygon vertices</h2><button data-dismiss>Close</button></div><p>Local x, y pairs in µm, one pair per line. Clockwise or counterclockwise. Do not repeat the first vertex.</p><textarea aria-label="Polygon vertices" rows="12" style="width:100%;font-family:monospace">${t(a.vertices.map(o=>o.join(", ")).join(`
`))}</textarea><p role="alert"></p><button data-apply>Apply vertices</button>`,s.querySelector("[data-dismiss]").onclick=()=>s.close(),s.querySelector("[data-apply]").onclick=async()=>{try{const o=s.querySelector("textarea").value.trim().split(/\r?\n/).map(d=>d.trim().split(/[\s,]+/).map(Number));if(o.some(d=>d.length!==2||d.some(u=>!Number.isFinite(u))))throw Error("Each row needs two finite numbers.");const l=structuredClone(n.project);l.structures.find(d=>d.id===r).vertices=o;const c=await e("/validate",l);i(c.project),s.close()}catch(o){s.querySelector('[role="alert"]').textContent=o.message}},s.showModal())}}}const Nn={region:"#d2a129",source:"#d44955",monitor:"#e3a72c",selected:"#187be7"};class Lv{constructor(e,t,i,s,r){this.state=t,this.select=i,this.change=s,this.edited=r,this.zoom={xy:1,xz:1,yz:1},this.canvases={},e.innerHTML=["xy","perspective","xz","yz"].map(a=>`<div class="viewport ${a}" data-view="${a}"><div class="view-label">${a==="perspective"?"Perspective":a.toUpperCase()+" plane"}<span>${a==="perspective"?"Orbit · left drag / Pan · right drag":"Select · drag to move / scroll to zoom"}</span></div>${a!=="perspective"?"<canvas></canvas>":'<div class="three-view"></div>'}</div>`).join("");for(const[a,o]of Object.entries({xy:[0,1],xz:[0,2],yz:[1,2]})){const l=e.querySelector(`.${a} canvas`);this.canvases[a]={canvas:l,axes:o},l.addEventListener("wheel",c=>{c.preventDefault(),this.zoom[a]=Math.max(.5,Math.min(8,this.zoom[a]*Math.exp(-c.deltaY*.001))),this.draw2d(a)},{passive:!1}),l.addEventListener("pointerdown",c=>this.down(c,a)),l.addEventListener("pointermove",c=>this.move(c,a)),l.addEventListener("pointerup",c=>this.up(c,a)),l.addEventListener("dblclick",()=>{var c;return(c=document.querySelector("#properties input"))==null?void 0:c.focus()})}this.initThree(e.querySelector(".three-view")),this.resizeObserver=new ResizeObserver(()=>this.render()),this.resizeObserver.observe(e)}objects(){const e=this.state.project;return[...e.structures.map(t=>({...t,category:"structure"})),...e.sources.map(t=>({...t,category:"source"})),...e.monitors.map(t=>({...t,category:"monitor"}))]}bounds(e){return e.kind==="sphere"?[e.radius*2,e.radius*2,e.radius*2]:["circle","ring"].includes(e.kind)?[e.radius*2,e.radius*2,e.size[2]]:e.size||[.12,.12,.12]}metrics(e){const{canvas:t,axes:i}=this.canvases[e],s=t.getBoundingClientRect(),r=this.state.project.region.size;return{w:s.width,h:s.height,scale:Math.min((s.width-65)/r[i[0]],(s.height-50)/r[i[1]])*.84*this.zoom[e],axes:i}}world(e,t){const{canvas:i}=this.canvases[t],s=i.getBoundingClientRect(),r=this.metrics(t);return[(e.clientX-s.left-r.w/2)/r.scale,-(e.clientY-s.top-r.h/2)/r.scale]}hit(e,t,i,s){if(e.category==="structure")return Av(e,t,i,s);const r=this.bounds(e);let a=t[0]-e.center[i[0]],o=t[1]-e.center[i[1]];if(i[0]===0&&i[1]===1&&e.category==="structure"){if(["circle","sphere","ring"].includes(e.kind)){const c=Math.hypot(a,o);return c<=e.radius+s&&(e.kind!=="ring"||c>=e.inner_radius-s)}const l=(e.rotation||0)*Math.PI/180;[a,o]=[Math.cos(l)*a+Math.sin(l)*o,-Math.sin(l)*a+Math.cos(l)*o]}return Math.abs(a)<=Math.max(r[i[0]]/2,s)&&Math.abs(o)<=Math.max(r[i[1]]/2,s)}down(e,t){if(e.button!==0)return;const i=this.metrics(t),s=this.world(e,t),a=this.objects().filter(o=>o.enabled).reverse().find(o=>this.hit(o,s,i.axes,7/i.scale));this.select((a==null?void 0:a.id)||"fdtd"),a&&this.state.mode==="layout"&&(this.drag={id:a.id,start:s,center:[...a.center],axes:i.axes,name:t,moved:!1},e.target.setPointerCapture(e.pointerId))}move(e,t){if(!this.drag||this.drag.name!==t)return;const i=this.world(e,t),s=this.drag,r=this.state.project,a=[...s.center];s.axes.forEach((o,l)=>{if(o===2&&r.region.dimension==="2d")return;const c=s.center[o]+i[l]-s.start[l];a[o]=this.state.snap?pc(r.region,o,c):c}),!(!s.moved&&Math.hypot(i[0]-s.start[0],i[1]-s.start[1])<.02)&&(s.moved||this.edited(),s.moved=!0,this.change(s.id,{center:a},!1),this.render())}up(){var e;(e=this.drag)!=null&&e.moved&&this.change(this.drag.id,{},!0),this.drag=null}draw2d(e){const{canvas:t,axes:i}=this.canvases[e],s=this.metrics(e),r=this.state.project;if(s.w<1||s.h<1)return;const a=window.devicePixelRatio||1;t.width=s.w*a,t.height=s.h*a;const o=t.getContext("2d");o.scale(a,a),o.fillStyle="#fafbfd",o.fillRect(0,0,s.w,s.h);const l=S=>s.w/2+S*s.scale,c=S=>s.h/2-S*s.scale,d=45/s.scale,u=10**Math.floor(Math.log10(d)),h=[1,2,5,10].find(S=>S*u>=d)*u,m=Math.max(0,-Math.floor(Math.log10(h)));o.font="10px ui-monospace, monospace",o.textAlign="center";for(let S=0;S<2;S++){const A=(S===0?s.w:s.h)/s.scale;for(let M=Math.ceil(-A/2/h)*h;M<=A/2;M+=h){const b=S===0?l(M):c(M);o.strokeStyle=Math.abs(M)<1e-7?"#bac8d8":"#e6ebf2",o.lineWidth=1,o.beginPath(),S===0?(o.moveTo(b,0),o.lineTo(b,s.h),o.fillStyle="#8b98a9",o.fillText(M.toFixed(m),b,s.h-9)):(o.moveTo(0,b),o.lineTo(s.w,b),o.fillStyle="#8b98a9",o.fillText(M.toFixed(m),18,b-4)),o.stroke()}}const _=r.region.size[i[0]]*s.scale,x=r.region.size[i[1]]*s.scale,f=s.w/2-_/2,p=s.h/2-x/2;o.fillStyle="#f0c85612",o.fillRect(f,p,_,x),o.strokeStyle=Nn.region,o.setLineDash([6,4]),o.strokeRect(f,p,_,x),o.setLineDash([]);const y=(S,A)=>bv(r.region,S,A)*s.scale,v=y(i[0],"min"),g=y(i[0],"max"),E=y(i[1],"min"),T=y(i[1],"max");o.fillStyle="#d8ae3d12",o.fillRect(f,p,_,T),o.fillRect(f,p+x-E,_,E),o.fillRect(f,p,v,x),o.fillRect(f+_-g,p,g,x);for(const S of this.objects()){if(!S.enabled)continue;const A=this.bounds(S),M=l(S.center[i[0]]),b=c(S.center[i[1]]),R=Math.max(A[i[0]]*s.scale,3),U=Math.max(A[i[1]]*s.scale,3),L=S.id===this.state.selected,k=r.materials.find(F=>F.name===S.material);if(o.save(),o.translate(M,b),o.strokeStyle=L?Nn.selected:S.category==="source"?Nn.source:S.category==="monitor"?Nn.monitor:(k==null?void 0:k.color)||"#69a1e8",o.lineWidth=L?2:1.5,o.fillStyle=S.kind==="tfsf"?"#3ba89710":S.category==="structure"?((k==null?void 0:k.color)||"#69a1e8")+"55":"#ffffff88",o.beginPath(),S.kind==="tfsf"&&o.setLineDash([5,3]),S.category==="structure"){const F=hd(S,i);for(const O of F.triangles){o.moveTo(O[0][0]*s.scale,-O[0][1]*s.scale);for(const H of O.slice(1))o.lineTo(H[0]*s.scale,-H[1]*s.scale);o.closePath()}o.fill(),o.beginPath();for(const[O,H]of F.edges)o.moveTo(O[0]*s.scale,-O[1]*s.scale),o.lineTo(H[0]*s.scale,-H[1]*s.scale);o.stroke(),L&&(o.fillStyle=Nn.selected,o.font="11px Inter,Segoe UI,sans-serif",o.fillText(S.name,0,-F.high*s.scale-9))}else S.category==="monitor"&&S.kind!=="field"?(o.moveTo(-7,0),o.lineTo(7,0),o.moveTo(0,-7),o.lineTo(0,7),o.stroke(),o.beginPath(),o.arc(0,0,4,0,2*Math.PI),o.stroke()):S.category==="source"&&S.kind==="point"?(o.arc(0,0,5,0,2*Math.PI),o.fillStyle=Nn.source,o.fill(),o.stroke()):(e==="xy"&&["circle","ring"].includes(S.kind)||S.kind==="sphere"?(o.ellipse(0,0,R/2,U/2,0,0,Math.PI*2),S.kind==="ring"&&o.ellipse(0,0,S.inner_radius*s.scale,S.inner_radius*s.scale,0,0,Math.PI*2,!0)):o.rect(-R/2,-U/2,R,U),o.fill("evenodd"),o.stroke());L&&S.category!=="structure"&&(o.fillStyle="#187be7",o.font="11px Inter,Segoe UI,sans-serif",o.fillText(S.name,0,-U/2-9)),o.restore()}o.fillStyle="#617187",o.textAlign="right",o.font="10px Segoe UI",o.fillText(`${"xyz"[i[0]]} / ${"xyz"[i[1]]} (µm)`,s.w-10,s.h-9),r.region.dimension==="2d"&&e!=="xy"&&(o.fillStyle="#8591a2",o.textAlign="left",o.fillText("2D: simulation at z = 0",10,18))}initThree(e){this.host=e,this.scene=new bh,this.scene.background=new Xe("#f3f6fa"),this.camera=new cn(40,1,.01,1e3),this.camera.up.set(0,0,1),this.camera.position.set(10,-12,10),this.renderer=new J_({antialias:!0}),this.renderer.setPixelRatio(Math.min(devicePixelRatio,2)),e.appendChild(this.renderer.domElement),this.orbit=new Q_(this.camera,this.renderer.domElement),this.orbit.enableDamping=!0,this.scene.add(new op(16777215,10728907,2.5));const t=new dp(16777215,2);t.position.set(5,-3,8),this.scene.add(t),this.scene.add(new pp(1.5)),this.group=new ps,this.scene.add(this.group),this.transform=new hv(this.camera,this.renderer.domElement),this.scene.add(this.transform.getHelper()),this.transform.addEventListener("dragging-changed",r=>{this.orbit.enabled=!r.value,r.value?this.edited():this.transform.object&&this.change(this.transform.object.userData.id,{},!0)}),this.transform.addEventListener("objectChange",()=>{const r=this.transform.object;if(!r)return;let a=r.position.toArray();this.state.snap&&(a=a.map((o,l)=>pc(this.state.project.region,l,o))),this.change(r.userData.id,{center:a},!1);for(const o of Object.keys(this.canvases))this.draw2d(o)});let i;this.renderer.domElement.addEventListener("pointerdown",r=>{i=[r.clientX,r.clientY]}),this.renderer.domElement.addEventListener("pointerup",r=>{if(!i||Math.hypot(r.clientX-i[0],r.clientY-i[1])>4||this.transform.axis)return;const a=e.getBoundingClientRect(),o=new id;o.setFromCamera(new oe((r.clientX-a.left)/a.width*2-1,-(r.clientY-a.top)/a.height*2+1),this.camera);const l=o.intersectObjects(this.group.children,!0).find(c=>c.object.userData.id);l&&this.select(l.object.userData.id)});const s=()=>{requestAnimationFrame(s),this.orbit.update(),this.renderer.render(this.scene,this.camera)};s()}renderThree(){var a;if(this.transform.dragging)return;this.transform.detach(),this.group.traverse(o=>{var l;if((l=o.geometry)==null||l.dispose(),o.material)for(const c of Array.isArray(o.material)?o.material:[o.material])c.dispose()}),this.group.clear();const e=this.state.project,t=new Dr(new vo(new St(...e.region.size)),new Ki({color:Nn.region}));this.group.add(t);const i=new hp(Math.max(...e.region.size)*1.4,20,"#b7c5d5","#dfe6ee");i.rotateX(Math.PI/2),i.position.z=-e.region.size[2]/2,this.group.add(i);for(const o of this.objects()){if(!o.enabled)continue;let l;o.category==="structure"?l=Tv(o):o.category==="monitor"&&o.kind!=="field"||o.kind==="point"?l=new Fs(.07,12,8):l=new St(...(o.size||[.1,.1,.1]).map(u=>Math.max(u,.02)));const c=o.category==="source"?Nn.source:o.category==="monitor"?Nn.monitor:((a=e.materials.find(u=>u.name===o.material))==null?void 0:a.color)||"#69a1e8",d=new be(l,new sp({color:c,transparent:!0,opacity:o.kind==="tfsf"?.08:o.category==="structure"?.66:.9,roughness:.5,metalness:.08,side:fn}));d.position.fromArray(o.center),d.userData.id=o.id,d.add(new Dr(new vo(l),new Ki({color:o.id===this.state.selected?"#147be7":c,transparent:!0,opacity:.7}))),this.group.add(d),o.id===this.state.selected&&this.state.mode==="layout"&&(this.transform.attach(d),this.transform.showZ=e.region.dimension!=="2d",this.transform.setTranslationSnap(this.state.snap&&!e.region.mesh_steps&&e.region.mesh_type!=="explicit"?e.region.mesh:null))}const{width:s,height:r}=this.host.getBoundingClientRect();s>0&&r>0&&(this.camera.aspect=s/r,this.camera.updateProjectionMatrix(),this.renderer.setSize(s,r))}fit(){this.zoom={xy:1,xz:1,yz:1};const e=Math.max(...this.state.project.region.size);this.camera.position.set(e*1.15,-e*1.4,e*1.05),this.orbit.target.set(0,0,0),this.render()}render(){for(const e of Object.keys(this.canvases))this.draw2d(e);this.renderThree()}}function Dv(n,e,t,i,s=null,r="reduced field"){const a=n.getBoundingClientRect(),o=devicePixelRatio||1;n.width=a.width*o,n.height=a.height*o;const l=n.getContext("2d");if(l.scale(o,o),l.fillStyle="#f8fafc",l.fillRect(0,0,a.width,a.height),!(e!=null&&e.length)){l.fillStyle="#718196",l.font="14px Segoe UI",l.textAlign="center",l.fillText("Run a simulation to visualize the field",a.width/2,a.height/2);return}const c=e.length,d=e[0].length,u=document.createElement("canvas");u.width=c,u.height=d;const h=u.getContext("2d"),m=h.createImageData(c,d);let _=s||Math.max(...e.flat().map(Math.abs),1e-20);for(let g=0;g<c;g++)for(let E=0;E<d;E++){const T=Math.max(-1,Math.min(1,e[g][E]/_)),S=((d-1-E)*c+g)*4;m.data[S]=T>0?250:Math.round(246+T*210),m.data[S+1]=Math.round(248-Math.abs(T)*184),m.data[S+2]=T<0?250:Math.round(248-T*207),m.data[S+3]=255}h.putImageData(m,0,0);const x=Math.min((a.width-110)/t[0],(a.height-80)/t[1]),f=t[0]*x,p=t[1]*x,y=(a.width-f)/2,v=(a.height-p)/2;l.imageSmoothingEnabled=!1,l.drawImage(u,y,v,f,p),l.strokeStyle="#c4cfdb",l.strokeRect(y,v,f,p),l.fillStyle="#607086",l.font="11px ui-monospace,monospace",l.textAlign="center",l.fillText(`${-t[0]/2}`,y,v+p+18),l.fillText("0",y+f/2,v+p+18),l.fillText(`${t[0]/2} µm`,y+f,v+p+18),l.textAlign="right",l.fillText(`${t[1]/2}`,y-8,v+8),l.fillText(`${-t[1]/2}`,y-8,v+p),l.textAlign="left",l.fillText(`${i} · ±${_.toExponential(2)} (${r})`,y,v-13)}function Os(n,e,t=!1,i=!1){const s=n.getBoundingClientRect(),r=devicePixelRatio||1;n.width=s.width*r,n.height=s.height*r;const a=n.getContext("2d");if(a.scale(r,r),a.clearRect(0,0,s.width,s.height),!(e!=null&&e.length)){a.fillStyle="#8491a2",a.font="12px Segoe UI",a.fillText("Point monitor signals appear after a run.",30,35);return}const o=g=>t?i?g.wavelength_um:g.frequency_thz:g.time_fs,l=s.width-75,c=s.height-48,d=55,u=15,h=e.flatMap(g=>t?g.spectrum:g.signal),m=e.flatMap(o),_=h.reduce((g,E)=>Number.isFinite(E)?Math.max(g,Math.abs(E)):g,0)||1,x=t?m.reduce((g,E)=>Math.min(g,E),1/0):0,f=m.reduce((g,E)=>Math.max(g,E),x+1e-6),p=t&&!e.some(g=>g.signed)?0:-_;a.strokeStyle="#e0e6ed",a.font="10px monospace",a.fillStyle="#738197";for(let g=0;g<=4;g++){const E=u+g*c/4;a.beginPath(),a.moveTo(d,E),a.lineTo(d+l,E),a.stroke(),a.fillText((_-(_-p)*g/4).toExponential(1),2,E+3),a.fillText((x+(f-x)*g/4).toFixed(i&&t?2:0),d+l*g/4-7,u+c+17)}e.forEach((g,E)=>{const T=o(g),S=t?g.spectrum:g.signal;a.strokeStyle=["#237ddd","#e39127","#875adb","#22a184"][E%4],a.beginPath();let A=!1;T.forEach((M,b)=>{if(!Number.isFinite(S[b])){A=!1;return}const R=d+(M-x)/(f-x)*l,U=u+(_-S[b])/(_-p)*c;A?a.lineTo(R,U):a.moveTo(R,U),A=!0}),a.stroke(),T.length===1&&(a.beginPath(),a.arc(d,u+(_-S[0])/(_-p)*c,3,0,2*Math.PI),a.fillStyle=a.strokeStyle,a.fill()),a.fillStyle=a.strokeStyle,a.fillText(g.name,d+10+E*120,12),!t&&g.window&&(a.strokeStyle="#24a79b",a.setLineDash([3,3]),a.beginPath(),T.forEach((M,b)=>{const R=d+(M-x)/(f-x)*l,U=u+(1-g.window[b])*c/2;b?a.lineTo(R,U):a.moveTo(R,U)}),a.stroke(),a.setLineDash([]))});const y=e[0],v=y.spectrum_settings;a.fillStyle="#728296",a.textAlign="right",a.fillText(t?y.spectrum_label||`${i?"Wavelength (µm)":"Frequency (THz)"} · ${(v==null?void 0:v.apodization)||"hann"} · |${(v==null?void 0:v.sampling)==="fft"?"FFT":"DFT"}| (${y.spectrum_units||"reduced field"})`:y.time_label||`Time (fs) · real field${y.window?"; dashed: window (0–1)":""}`,s.width-20,s.height-3)}function Iv({esc:n,toast:e,log:t}){const i=document.createElement("dialog");i.id="fsp-dialog",document.body.append(i);const s=document.createElement("input");s.type="file",s.accept=".fsp",s.hidden=!0,document.body.append(s);let r=null,a="",o=!1,l="",c=new Map;async function d(g,E){const T=await fetch("/api/fsp"+g,E),S=await T.json();if(!T.ok)throw Error(typeof S.detail=="string"?S.detail:JSON.stringify(S.detail));return S}function u(){if(!(r!=null&&r.inspection))return[];const g=r.inspection;return[...g.objects.map(E=>({...E,editable:!0})),...Object.entries(g.globals).map(([E,T])=>({id:"Global "+E,...T})),...Object.entries(g.referenced_materials).map(([E,T])=>({id:"Material: "+E,...T}))]}function h(){return u().find(g=>g.id===a)}function m(g,E){return JSON.stringify([g,E])}function _(g){i.querySelector("#fsp-status").textContent=g}function x(){const g=r==null?void 0:r.inspection;i.innerHTML=`<div class="fsp-heading"><div><h2>FSP project inspector</h2><span>${n((r==null?void 0:r.filename)||"Open a Lumerical project")}</span></div><button data-fsp="close" aria-label="Close FSP inspector">Close</button></div>
   <p class="fsp-notice">Installed Lumerical bridge · <strong>Native GPU execution unavailable</strong><br>Original settings are retained. Values below use Lumerical SI units: metres, seconds and Hz. Edited exports clear saved simulation results.</p>
   <div class="fsp-toolbar"><button data-fsp="open" ${o?"disabled":""}>Open .fsp</button><button data-fsp="original" ${!g||o?"disabled":""}>Download original .fsp</button><button data-fsp="archive" ${!g||o?"disabled":""}>Preservation archive</button><button data-fsp="export" ${!c.size||o?"disabled":""}>Save edited .fsp <span id="fsp-patch-count">(${c.size})</span></button></div>
   <div id="fsp-status" role="status">${o?"Reading with Lumerical…":g?`${g.objects.length} objects · Lumerical ${n(g.bridge.vendor_version)} · ${c.size} pending edits`:"Select an FSP file. The GPU workstation reads it in a separate Lumerical session."}</div>
   <div class="fsp-body"><div id="fsp-tree">${u().map(E=>`<button data-fsp-object="${n(E.id)}" class="${a===E.id?"active":""}"><span>${n(E.id)}</span><small>${n(E.properties.type||"Settings")}</small></button>`).join("")}</div><section class="fsp-details"><input id="fsp-filter" placeholder="Filter properties (e.g. wavelength, pml, apodization)" aria-label="Filter FSP properties" value="${n(l)}"><div id="fsp-properties"></div></section></div>
   ${g?`<details class="fsp-diagnostics"><summary>Native compatibility: ${g.native_execution.issues.length} unresolved items</summary><ul>${g.native_execution.issues.map(E=>`<li><b>${n(E.object_id||"Project")}</b>: ${n(E.message)}</li>`).join("")}${g.read_diagnostics.map(E=>`<li>${n(E.object_id)}: ${n(E.message)}</li>`).join("")}</ul></details>`:""}`,f(),i.querySelector("#fsp-filter").oninput=E=>{l=E.target.value,f()}}function f(){const g=h(),E=i.querySelector("#fsp-properties");if(!g){E.innerHTML="<p>Select an object to inspect its complete property list.</p>";return}const T=Object.entries(g.properties).filter(([S])=>S.toLowerCase().includes(l.toLowerCase()));E.innerHTML=`<h3>${n(g.id)}</h3>${T.map(([S,A])=>{const M=c.get(m(g.id,S)),b=M?M.value:A,R=g.editable&&!["name","type","script","setup script","analysis script"].includes(S)&&["number","string","boolean"].includes(typeof b)&&!String(b).includes(`
`)&&String(b).length<2e3,U=typeof b=="object"?JSON.stringify(b,null,2):String(b);return`<label class="fsp-property ${M?"modified":""}"><span>${n(S)}</span>${R?`<input data-fsp-property="${n(S)}" aria-label="FSP ${n(S)}" type="${typeof b=="number"?"number":typeof b=="boolean"?"checkbox":"text"}" step="any" ${typeof b=="boolean"?b?"checked":"":`value="${n(U)}"`} ${o?"disabled":""}>`:`<pre>${n(U)}</pre>`}</label>`}).join("")}${Object.entries(g.read_errors||{}).map(([S,A])=>`<p class="error">${n(S)}: ${n(A)}</p>`).join("")}`,E.querySelectorAll("[data-fsp-property]").forEach(S=>S.onchange=()=>{const A=S.dataset.fspProperty,M=S.type==="number"?Number(S.value):S.type==="checkbox"?S.checked:S.value;if(S.type==="number"&&(!S.value||!Number.isFinite(M))){e("Enter a finite number."),f();return}M===g.properties[A]?c.delete(m(g.id,A)):c.set(m(g.id,A),{object_id:g.id,property:A,value:M}),S.closest("label").classList.toggle("modified",c.has(m(g.id,A))),i.querySelector("#fsp-patch-count").textContent=`(${c.size})`,i.querySelector('[data-fsp="export"]').disabled=!c.size||o,_(`${c.size} pending edits. Save edited .fsp verifies each saved value in Lumerical.`)})}async function p(g){for(;;){const E=await d("/"+g);if(_(E.status==="queued"?"Waiting for Lumerical bridge…":"Reading and verifying project settings…"),E.status==="failed")throw Error(E.error);if(E.status==="ready")return E;await new Promise(T=>setTimeout(T,700))}}function y(g){const E=document.createElement("a");E.href="/api/fsp/"+r.id+"/"+g,E.download="",E.click()}async function v(g){var E,T;if(!o){o=!0,c.clear(),l="",a="",r=null,x(),i.open||i.showModal();try{_("Uploading "+g.name+"…");const S=await d("/import",{method:"POST",headers:{"Content-Type":"application/octet-stream","X-Filename":encodeURIComponent(g.name)},body:g});r=await p(S.id),a=((E=r.inspection.objects.find(A=>A.properties.type==="FDTD"))==null?void 0:E.id)||((T=r.inspection.objects[0])==null?void 0:T.id),t("Inspected "+g.name+" through Lumerical. Native GPU execution of this FSP remains unavailable.")}catch(S){e(S.message),t("FSP: "+S.message,"error")}finally{o=!1,x()}}}return s.onchange=()=>{const g=s.files[0];s.value="",g&&v(g)},i.addEventListener("click",async g=>{const E=g.target.closest("button");if(!E||E.disabled)return;if(E.dataset.fspObject){a=E.dataset.fspObject,x();return}const T=E.dataset.fsp;if(T==="close"){i.close();return}if(T==="open"){s.click();return}if(T==="original"){y("download");return}if(T==="archive"){y("archive");return}if(T==="export"){o=!0,x();try{const S=await d("/"+r.id+"/export",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({patches:[...c.values()]})}),A=await p(S.id),M=document.createElement("a");M.href="/api/fsp/"+A.id+"/download",M.download="",M.click(),c.clear(),r=A,t("Saved "+A.filename+" and verified "+A.export_verification.patches.length+" property edits by reopening in Lumerical.")}catch(S){e(S.message),t("FSP export failed: "+S.message,"error")}finally{o=!1,x()}}}),{openFile:v,open(){x(),i.open||i.showModal()}}}function Uv({esc:n,toast:e,log:t,loadProject:i,getProject:s}){const r=document.createElement("dialog");r.id="fsp-native-dialog",document.body.append(r);const a=document.createElement("input");a.type="file",a.accept=".fsp",a.id="fsp-native-input",a.hidden=!0,document.body.append(a);let o=null,l=null,c=!1,d="";function u(){var g,E,T,S;const x=o==null?void 0:o.conversion,f=x==null?void 0:x.project,p=s(),y=[...(p==null?void 0:p.structures)||[],...(p==null?void 0:p.sources)||[],...(p==null?void 0:p.monitors)||[]],v=A=>{const M=y.find(b=>A.startsWith(b.id+"."));return M?M.name+": "+A.slice(M.id.length+1):A};r.innerHTML=`<div class="fsp-heading"><div><h2>Import FSP for GPU</h2><span>${n((o==null?void 0:o.filename)||"Independent scene import")}</span></div><button data-native="close">Close</button></div>
   <p>Reads supported layout settings without Lumerical. The original FSP is retained. A converted scene uses the native solver and its documented numerical definitions.</p>
   <div class="fsp-toolbar"><button data-native="open" ${c?"disabled":""}>Choose .fsp</button><button data-native="load" ${!f||c?"disabled":""}>Open converted scene</button>${x?'<button data-native="original">Download original .fsp</button><button data-native="report">Conversion report</button>':""}<button data-native="export" ${!f||c?"disabled":""}>Export current scene</button></div>
   <p id="fsp-native-status" role="status">${c?"Processing FSP settings…":d?n(d):l?"Scene export verified · download below":x?f?"Ready to open · review calculation differences below":"Cannot run this FSP yet · unsupported settings below":"Choose an FSP file to check and convert."}</p>
   ${l?`<p><button data-native="edited">Download edited .fsp</button> <button data-native="write-report">Scene export report</button></p>${l.export_verification.native_only_settings.length?`<details><summary>Native JSON retains additional settings</summary><ul>${l.export_verification.native_only_settings.map(A=>`<li>${n(v(A))}</li>`).join("")}</ul></details>`:""}`:""}
   ${(g=l==null?void 0:l.export_verification.structure_list)!=null&&g.changed?`<p data-native-structure-export>Structure list saved: ${l.export_verification.structure_list.added.length} added · ${l.export_verification.structure_list.removed.length} removed · ${l.export_verification.structure_list.output_order.length} total. Native order and material priority verified. Reimport the edited file to use its updated object IDs. New object records have not been verified in external readers.</p>`:""}
   ${(E=l==null?void 0:l.export_verification.source_list)!=null&&E.changed?`<p data-native-source-export>Source list saved: ${l.export_verification.source_list.added.length} added · ${l.export_verification.source_list.removed.length} removed · ${l.export_verification.source_list.output_order.length} total. Native waveforms and order verified.</p>`:""}
   ${(T=l==null?void 0:l.export_verification.monitor_list)!=null&&T.changed?`<p data-native-monitor-export>Monitor list saved: ${l.export_verification.monitor_list.added.length} added · ${l.export_verification.monitor_list.removed.length} removed · ${l.export_verification.monitor_list.output_order.length} outputs. ${l.export_verification.monitor_list.splits.length} component records separated. Native sampling and output order verified. Reimport the edited file before further FSP edits. External reader acceptance is unverified.</p>`:""}
   ${(S=l==null?void 0:l.export_verification.mesh_export)!=null&&S.nodes_changed?`<p data-native-mesh-export>Mesh updated: ${l.export_verification.mesh_export.shape_before.join(" × ")} → ${l.export_verification.mesh_export.shape_after.join(" × ")} cells. Native reimport verified. External remeshing has not been verified.</p>`:""}
   ${f?'<p class="property-help">Exports mapped primitive, electric source and monitor additions, deletions, duplicates and order, source pulses, monitor spectra, duration, PML/Periodic settings and uniform mesh spacing/spans. New sources need explicit or ranged pulse settings. New time monitors need FFT with no apodization. Uniform isotropic export requires Cell centers sampling, and independent unequal axis spacing requires Yee sampling. Edited graded/explicit meshes and groups are not exported yet. Save native JSON to retain every native option and inheritance link.</p>':""}
   ${f?`<p>Original import: <b>${f.region.dimension.toUpperCase()}</b> · ${f.structures.length} structures · ${f.sources.length} sources · ${f.monitors.length} monitors · ${f.region.steps} steps</p>`:""}
   ${x?`<div class="native-issues">${x.issues.map(A=>`<p class="${A.severity==="error"?"error":"warning"}"><b>${n(A.object_id)}</b><br>${n(A.message)}</p>`).join("")}</div><p class="property-help">Coordinate origin in the source FSP: ${x.origin_m.map(A=>(A*1e6).toPrecision(5)).join(", ")} µm. Differences and source fingerprint remain in the saved native project.</p>`:""}`}async function h(x,f){const p=await fetch("/api/fsp"+x,f),y=await p.json();if(!p.ok)throw Error(y.detail||"FSP conversion failed");return y}async function m(x){for(;;){const f=await h("/"+x);if(f.status==="failed")throw Error(f.error);if(f.status==="ready")return f;await new Promise(p=>setTimeout(p,400))}}async function _(x){if(!c){o=null,l=null,d="",c=!0,u(),r.open||r.showModal();try{const f=await h("/native-import",{method:"POST",headers:{"Content-Type":"application/octet-stream","X-Filename":encodeURIComponent(x.name)},body:x});o=await m(f.id),t(x.name+": "+(o.conversion.project?"native scene conversion ready.":"native execution blocked by unsupported settings."),o.conversion.project?"info":"warning")}catch(f){d=f.message,e(d),t("FSP conversion: "+d,"error")}finally{c=!1,u()}}}return a.onchange=()=>{const x=a.files[0];a.value="",x&&_(x)},r.onclick=async x=>{var p,y;const f=(p=x.target.closest("[data-native]"))==null?void 0:p.dataset.native;if(f==="close"&&r.close(),f==="open"&&a.click(),f==="load"&&(o!=null&&o.conversion.project))try{await i(o.conversion.project),r.close()}catch(v){e(v.message)}if(f==="original"||f==="report"){const v=document.createElement("a");v.href="/api/fsp/"+o.id+(f==="original"?"/download":"/conversion"),v.download="",v.click()}if(f==="edited"||f==="write-report"){const v=document.createElement("a");v.href="/api/fsp/"+l.id+(f==="edited"?"/download":"/write-report"),v.download="",v.click()}if(f==="export"&&!c){c=!0,d="",l=null,u();try{const v=await h("/"+o.id+"/native-scene-export",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(s())});l=await m(v.id),t("Independent scene export verified."+((y=l.export_verification.mesh_export)!=null&&y.nodes_changed?" Mesh nodes updated.":""))}catch(v){d=v.message,e(d),t("FSP scene export: "+d,"error")}finally{c=!1,u()}}},{open(){u(),r.open||r.showModal()},openFile:_}}function Nv({esc:n,toast:e,log:t,getProject:i,loadProject:s}){const r=document.createElement("dialog");r.id="gds-dialog",r.className="gds-dialog",document.body.append(r);let a=null,o=null,l=null,c=!1;async function d(f,p){const y=await fetch("/api/gds/"+f,p),v=await y.json();if(!y.ok)throw Error(typeof v.detail=="string"?v.detail:JSON.stringify(v.detail));return v}function u(){return JSON.stringify([...r.querySelectorAll("input,select,textarea")].map(f=>[f.value,f.checked]))}function h(){o=null,r.querySelector('[data-gds="apply"]').disabled=!0,r.querySelector('[data-gds="report"]').disabled=!0}function m(f){r.querySelector("#gds-status").textContent=f}function _(f,p){const y=URL.createObjectURL(new Blob([JSON.stringify(p,null,2)],{type:"application/json"})),v=document.createElement("a");v.href=y,v.download=f,v.click(),setTimeout(()=>URL.revokeObjectURL(y),1e3)}function x(){const f=[...new Set(((a==null?void 0:a.cells)||[]).flatMap(p=>p.geometry_pairs.map(y=>y.join("/"))))].sort();r.innerHTML=`<div class="fsp-heading"><h2>Import GDS geometry</h2><button data-gds="close">Close</button></div>
   <p>Select a cell and explicitly assign each included layer its physical Z bounds (µm) and an existing project material. No sources or fabrication materials are inferred.</p>
   <input id="gds-input" aria-label="GDS file" type="file" accept=".gds,.gdsii"><p id="gds-status" role="status">${a?n(a.filename):"Choose a GDSII file (maximum 32 MB)."}</p>
   ${a?`<label>Cell <select id="gds-cell">${a.cells.map(p=>`<option>${n(p.name)}</option>`).join("")}</select></label>
   <p>Pairs below include all library cells. Select pairs present in the selected cell hierarchy. Duplicate a row to extrude the same pair at multiple Z intervals.</p>
   <table><thead><tr><th>Include</th><th>Layer / datatype</th><th>Z min (µm)</th><th>Z max (µm)</th><th>Material</th><th></th></tr></thead><tbody id="gds-stack">${f.map(p=>`<tr data-pair="${p}"><td><input type="checkbox" aria-label="Include ${p}"></td><td>${p}</td><td><input size="8" type="number" step="any" aria-label="Z min ${p}"></td><td><input size="8" type="number" step="any" aria-label="Z max ${p}"></td><td><select aria-label="Material ${p}"><option value="">Select material</option>${i().materials.map(y=>`<option value="${n(y.name)}">${n(y.name)}</option>`).join("")}</select></td><td><button data-gds="duplicate">Duplicate</button></td></tr>`).join("")}</tbody></table>
   <p><label>Unmapped geometry <select id="gds-unmapped"><option value="error">Reject (strict)</option><option value="report">Omit and record in report</option></select></label></p>
   <p><label><input id="gds-replace" type="checkbox"> Replace current structures (sources, monitors and materials stay in the project)</label></p>
   <details><summary>Optional TEXT port metadata contracts</summary><p>JSON array using layer, datatype (= TEXTTYPE), z_min, z_max, width_um and normal_xy. Metadata only, no source/detector integration. Available TEXT pairs: ${n(JSON.stringify([...new Set(a.cells.flatMap(p=>p.text_pairs.map(y=>y.join("/"))))]))}</p><textarea id="gds-ports" aria-label="Port contracts" rows="3" style="width:100%">[]</textarea></details>
   <button data-gds="preview">Preview conversion</button>`:""}
   <button data-gds="apply" disabled>Apply imported geometry</button><button data-gds="report" disabled>Download report</button><pre id="gds-report" style="max-height:240px;overflow:auto;white-space:pre-wrap"></pre>`,r.querySelector("#gds-input").onchange=async p=>{const y=p.target.files[0];if(!(!y||c)){c=!0,h(),m("Inspecting GDS…");try{a=await d("inspect",{method:"POST",headers:{"Content-Type":"application/octet-stream","X-Filename":encodeURIComponent(y.name)},body:y}),x()}catch(v){m(v.message)}finally{c=!1}}}}return r.addEventListener("input",f=>{f.target.id!=="gds-input"&&h()}),r.addEventListener("click",async f=>{var y;const p=(y=f.target.closest("[data-gds]"))==null?void 0:y.dataset.gds;if(!(!p||c)){if(p==="close"){r.close();return}if(p==="duplicate"){const v=f.target.closest("tr");v.after(v.cloneNode(!0)),h();return}if(p==="report"){_("gds-import-report.json",o.report);return}c=!0;try{if(p==="preview"){h();const v=[];for(const E of r.querySelectorAll("#gds-stack tr")){const T=E.querySelectorAll("input");if(!T[0].checked)continue;if(!T[1].value||!T[2].value||!E.querySelector("select").value)throw Error("Every included row needs explicit Z bounds and material.");const[S,A]=E.dataset.pair.split("/").map(Number);v.push({layer:S,datatype:A,z_min:Number(T[1].value),z_max:Number(T[2].value),material:E.querySelector("select").value})}l=JSON.stringify(i());const g=u();if(m("Converting and validating native geometry…"),o=await d(a.id+"/convert",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({project:JSON.parse(l),cell:r.querySelector("#gds-cell").value,layers:v,port_layers:JSON.parse(r.querySelector("#gds-ports").value),unmapped:r.querySelector("#gds-unmapped").value,replace_geometry:r.querySelector("#gds-replace").checked})}),g!==u())throw h(),Error("Import settings changed during conversion. Preview again.");r.querySelector("#gds-report").textContent=JSON.stringify(o.report,null,2),m("Ready to apply. Review the report and bounds; the FDTD region is unchanged."),r.querySelector('[data-gds="apply"]').disabled=!1,r.querySelector('[data-gds="report"]').disabled=!1}else if(p==="apply"){if(l!==JSON.stringify(i()))throw h(),Error("Project changed after preview. Preview again before applying.");await s(o.project),r.close(),t("Imported GDS native geometry. Port metadata is available in the separate conversion report."),e("GDS geometry imported")}}catch(v){m(v.message)}finally{c=!1}}}),{open(){a=null,o=null,x(),r.showModal()}}}const pd={wavelength:1.55,pulse:"gaussian",pulse_cycles:3,time_definition:"cycles",pulse_length:2e-14,pulse_offset:5e-14,signal:null,wavelength_start:1.3,wavelength_stop:1.8,optimize_for_short_pulse:!0,eliminate_discontinuities:!1,chirp_bandwidth_hz:1e14};function Fv(n,e,t){const i=n.theta!=null,s=n.injection==="oneway";return(i?s?'<p class="property-help">Electric polarization. Its magnetic partner is generated automatically.</p>':`<label class="property-row"><span>field type</span><select aria-label="field type" data-source-family><option value="E" ${n.component[0]==="E"?"selected":""}>Electric</option><option value="H" ${n.component[0]==="H"?"selected":""}>Magnetic</option></select></label>`:t("polarization","component",n.component,s?["Ex","Ey","Ez"].filter(a=>a[1]!==n.normal):["Ex","Ey","Ez","Hx","Hy","Hz"]))+`<label class="enabled-row"><input type="checkbox" data-source-vector ${i?"checked":""}> Use theta / phi orientation</label>`+(i?e("theta","theta",n.theta,"deg",{min:0,max:180})+e("phi","phi",n.phi??0,"deg")+'<p class="property-help">Theta is measured from +z. Phi turns from +x toward +y. The source has unit vector (sin θ cos φ, sin θ sin φ, cos θ).</p>':"")}function Ov(n,e,t,i){return n.kind==="tfsf"?i("propagation axis","normal",n.normal??"x",e.dimension==="2d"?["x","y"]:["x","y","z"])+i("direction","direction",n.direction??"+",[["+","Forward (+axis)"],["-","Backward (-axis)"]])+t("incident PML layers","incident_pml_cells",n.incident_pml_cells??96,"",{min:32,max:512,step:1})+'<p class="property-help">Normal-incidence TFSF box. Inside contains total fields and outside contains scattered fields. Keep the scatterer away from every face, with homogeneous background on the faces and PML on all active domain boundaries.</p>':n.kind!=="plane"?"":i("injection","injection",n.injection??"soft",[["soft","Soft sheet / bidirectional"],["oneway","One-way plane / normal incidence"]])+(n.injection==="oneway"?i("propagation axis","normal",n.normal??"x",e.dimension==="2d"?["x","y"]:["x","y","z"])+i("direction","direction",n.direction??"+",[["+","Forward (+axis)"],["-","Backward (-axis)"]])+t("incident PML layers","incident_pml_cells",n.incident_pml_cells??96,"",{min:32,max:512,step:1}):"")+'<p class="property-help">Selecting one-way fills the transverse cell, sets its boundaries to Periodic and the propagation boundaries to PML. Place its full plane in homogeneous background. This source does not select a waveguide mode or an oblique angle.</p>'}function fc(n,e,{boundaries:t=!1}={}){if(n.kind==="tfsf"){e.dimension==="2d"&&n.normal==="z"&&(n.normal="x"),(n.component[0]!=="E"||n.component[1]===n.normal)&&(n.component=n.normal==="z"?"Ex":"Ez",n.theta=null,n.phi=0);return}if(n.injection!=="oneway")return;n.normal??(n.normal="x"),n.direction??(n.direction="+"),e.dimension==="2d"&&n.normal==="z"&&(n.normal="x");const i="xyz".indexOf(n.normal),s=e.dimension==="2d"?2:3;n.size=[0,0,0];for(let r=0;r<s;r++)if(r!==i&&(n.center[r]=0,n.size[r]=Math.ceil(e.size[r]/e.mesh-1e-12)*e.mesh),t){for(const a of["min","max"])e.boundaries["xyz"[r]+"_"+a].kind=r===i?"pml":"periodic";e.bloch_phase[r]=0}(n.component[0]!=="E"||n.component[1]===n.normal)&&(n.component="E"+(i===2?"x":"z"),n.theta=null,n.phi=0)}function Go(n){const e=299792458/(n.wavelength_stop*1e-6),t=299792458/(n.wavelength_start*1e-6),i=(e+t)/2,s=(n.optimize_for_short_pulse?2:8)/(t+.01*e),r=s/(2*Math.sqrt(Math.log(2)));return{wavelength:299792458/i*1e6,length:s,offset:1.1*Math.sqrt(2*Math.log(1e4))*r,span:t-e,chirped:t-e>Math.sqrt(Math.log(2))/(Math.PI*r)}}function fd(n,e,t){const i=["wavelength","frequency"].includes(n.time_definition),s=i?Go(n):null;n[e]=t,e==="pulse"&&t==="broadband"&&!i&&(n.time_definition="wavelength",n.eliminate_discontinuities=!0),(e==="pulse"&&t!=="broadband"&&i||e==="time_definition"&&t==="standard"&&i)&&(n.time_definition="standard",n.wavelength=s.wavelength,n.pulse_length=s.length,n.pulse_offset=s.offset,n.chirp_bandwidth_hz=Math.max(s.span,1),e==="time_definition"&&!s.chirped&&(n.pulse="gaussian"))}function md(n,e,t,i=""){for(const[l,c]of Object.entries(pd))n[l]??(n[l]=c);const s=n.pulse==="broadband",r=["wavelength","frequency"].includes(n.time_definition),a=(l,c)=>`<label class="enabled-row"><input type="checkbox" aria-label="${i}${l}" data-path="${c}" ${n[c]?"checked":""}> ${l}</label>`;let o=t("pulse","pulse",n.pulse,[["gaussian","Gaussian"],["broadband","Broadband / automatic range"],["continuous","Continuous wave"],...n.signal?[["sampled","User time signal"]]:[]]);if(n.pulse==="sampled")return e("wavelength","wavelength",n.wavelength,"µm",{min:.001})+o+`<p class="property-help">${n.signal.time_s.length.toLocaleString()} time/amplitude/phase samples. Time in seconds, phase in radians.</p>`;if(o+=t("time definition","time_definition",n.time_definition,s?[["wavelength","Wavelength range"],["frequency","Frequency range"],["standard","Time domain"]]:[["cycles","Pulse cycles"],["standard","Standard time domain"]]),r){n.time_definition==="wavelength"?o+=e("wavelength start","wavelength_start",n.wavelength_start,"µm",{min:.001})+e("wavelength stop","wavelength_stop",n.wavelength_stop,"µm",{min:.001}):o+=e("frequency start","wavelength_stop",299.792458/n.wavelength_stop,"THz",{min:.001,reciprocal:299.792458})+e("frequency stop","wavelength_start",299.792458/n.wavelength_start,"THz",{min:.001,reciprocal:299.792458});const l=Go(n);o+=a("Optimize for short pulse","optimize_for_short_pulse")+`<p class="property-help" data-source-band-summary>${l.chirped?"Chirped":"Standard"} Gaussian · center ${l.wavelength.toFixed(5)} µm · power FWHM ${(l.length*1e15).toFixed(4)} fs · offset ${(l.offset*1e15).toFixed(4)} fs. The spectrum extends beyond the requested range.</p>`}else o+=e("wavelength","wavelength",n.wavelength,"µm",{min:.001}),o+=n.time_definition==="standard"?e("pulselength (power FWHM)","pulse_length",n.pulse_length*1e15,"fs",{min:.001,scale:1e-15})+(n.pulse!=="continuous"?e("offset","pulse_offset",n.pulse_offset*1e15,"fs",{min:0,scale:1e-15}):""):e("pulse width","pulse_cycles",n.pulse_cycles,"cycles",{min:1}),s&&(o+=e("chirp bandwidth","chirp_bandwidth_hz",n.chirp_bandwidth_hz*1e-12,"THz",{min:.001,scale:1e12}));return n.pulse!=="continuous"&&(o+=a("Eliminate discontinuities","eliminate_discontinuities")),o}function zv(n,e="signal.csv"){var s;if(e.toLowerCase().endsWith(".json"))return JSON.parse(n);const t=n.replace(/^\uFEFF/,"").trim().split(/\r?\n/).filter(r=>r.trim());if(((s=t.shift())==null?void 0:s.trim())!=="time_s,amplitude,phase_rad")throw Error("CSV header must be time_s,amplitude,phase_rad. Use seconds and unwrapped radians.");const i={time_s:[],amplitude:[],phase_rad:[]};return t.forEach((r,a)=>{const o=r.split(",");if(o.length!==3||o.some(l=>!l.trim()||!Number.isFinite(Number(l))))throw Error(`Invalid numeric data on CSV row ${a+2}.`);Object.keys(i).forEach((l,c)=>i[l].push(Number(o[c])))}),i}function kv({state:n,api:e,esc:t,commit:i,toast:s}){const r=document.createElement("dialog");r.className="source-dialog",document.body.append(r);const a=y=>r.querySelector(y),o=()=>r.close(),l=y=>{r.innerHTML=y,r.showModal(),r.querySelectorAll("[data-source-close]").forEach(v=>v.onclick=o)},c=y=>{a('[role="alert"]').textContent=y.message},d=y=>{const v=["time_s,amplitude,phase_rad",...y.time_s.map((T,S)=>[T,y.amplitude[S],y.phase_rad[S]].join(","))].join(`
`),g=URL.createObjectURL(new Blob([v],{type:"text/csv"})),E=document.createElement("a");E.href=g,E.download="source-signal.csv",E.click(),setTimeout(()=>URL.revokeObjectURL(g),1e3)},u=y=>y?`${y.time_s.length.toLocaleString()} samples · ${(y.time_s[0]*1e15).toFixed(3)}–${(y.time_s.at(-1)*1e15).toFixed(3)} fs`:"No time signal loaded",h=y=>y?`<table><thead><tr><th>Time (fs)</th><th>Amplitude</th><th>Phase (rad)</th></tr></thead><tbody>${y.time_s.slice(0,6).map((v,g)=>`<tr><td>${(v*1e15).toPrecision(6)}</td><td>${y.amplitude[g].toPrecision(6)}</td><td>${y.phase_rad[g].toPrecision(6)}</td></tr>`).join("")}</tbody></table>`:"",m='<label class="signal-file">Load time signal (CSV or JSON)<input type="file" accept=".csv,.json" aria-label="Time signal file"></label><p class="property-help">CSV: time_s,amplitude,phase_rad. Time is in seconds; phase is unwrapped radians. JSON uses arrays with the same names. 2–100,000 strictly increasing times. Amplitude and phase are interpolated separately; injection is zero outside the table.</p>';async function _(y,v,g){if(y.size>16e6)throw Error("Time signal file exceeds 16 MB.");const E=zv(await y.text(),y.name);return g.signal=E,g.pulse="sampled",["wavelength","frequency"].includes(g.time_definition)&&(g.time_definition="standard"),(await e("/validate",v)).project}async function x(y){if(n.mode!=="layout")return;let v=structuredClone(n.project),g=v.sources.find(T=>T.id===y);if(!g||g.use_global_source)throw Error("Edit the global source settings for an inherited signal.");l(`<h2>Time signal · ${t(g.name)}</h2>${m}<div class="signal-summary"></div><div class="signal-table"></div><p role="alert" class="error"></p><div class="dialog-actions"><button data-export>Download CSV</button><button data-source-close>Cancel</button><button data-apply class="primary">Apply time signal</button></div>`);const E=()=>{a(".signal-summary").textContent=u(g.signal),a(".signal-table").innerHTML=h(g.signal),a("[data-export]").disabled=!g.signal,a("[data-apply]").disabled=!g.signal};E(),a('[type="file"]').onchange=async T=>{const S=T.target.files[0];if(S)try{const A=structuredClone(v),M=A.sources.find(R=>R.id===y);v=await _(S,A,M),g=v.sources.find(R=>R.id===y),a('[role="alert"]').textContent="",E()}catch(A){c(A)}finally{a('[type="file"]').value=""}},a("[data-export]").onclick=()=>d(g.signal),a("[data-apply]").onclick=async()=>{try{g.pulse="sampled",["wavelength","frequency"].includes(g.time_definition)&&(g.time_definition="standard");const T=await e("/validate",v);i(T.project),o()}catch(T){c(T)}}}async function f(){if(n.mode!=="layout")return;let y=structuredClone(n.project);y.global_source??(y.global_source=structuredClone(pd));const v=(T,S,A,M="",b={})=>{const R={wavelength:"wavelength (µm)","pulselength (power FWHM)":"pulselength (fs)",offset:"offset (fs)","pulse width":"pulse cycles"}[T]||T;return`<label class="property-row"><span>${T}</span><input aria-label="global ${R}" data-path="${S}" type="number" step="any" data-scale="${b.scale||1}" ${b.reciprocal?`data-reciprocal="${b.reciprocal}"`:""} value="${A}"><small>${M}</small></label>`},g=(T,S,A,M)=>`<label class="property-row"><span>${T}</span><select aria-label="global ${T}" data-path="${S}">${M.map(([b,R])=>`<option value="${b}" ${b===A?"selected":""}>${R}</option>`).join("")}</select></label>`,E=()=>{const T=y.global_source;r.innerHTML=`<h2>Global source settings</h2><p>Shared temporal settings for sources with “Use global source settings” enabled. Each source keeps its own amplitude, phase and position.</p>${md(T,v,g,"global ")}${m}<div class="signal-summary">${u(T.signal)}</div><p role="alert" class="error"></p><div class="dialog-actions"><button data-export ${T.signal?"":"disabled"}>Download signal CSV</button><button data-source-close>Cancel</button><button data-apply class="primary">Apply global settings</button></div>`,a("[data-source-close]").onclick=o,r.querySelectorAll("[data-path]").forEach(S=>S.onchange=()=>{const A=S.type==="checkbox"?S.checked:S.type==="number"?S.dataset.reciprocal?Number(S.dataset.reciprocal)/Number(S.value):Number(S.value)*Number(S.dataset.scale||1):S.value;if(fd(T,S.dataset.path,A),S.type!=="number")E();else if(a("[data-source-band-summary]")){const M=Go(T);a("[data-source-band-summary]").textContent=`${M.chirped?"Chirped":"Standard"} Gaussian · center ${M.wavelength.toFixed(5)} µm · power FWHM ${(M.length*1e15).toFixed(4)} fs · offset ${(M.offset*1e15).toFixed(4)} fs. The spectrum extends beyond the requested range.`}}),a('[type="file"]').onchange=async S=>{const A=S.target.files[0];if(A)try{const M=structuredClone(y);y=await _(A,M,M.global_source),E()}catch(M){c(M)}},a("[data-export]").onclick=()=>d(T.signal),a("[data-apply]").onclick=async()=>{try{const S=await e("/validate",y);i(S.project),o()}catch(S){c(S)}}};E(),r.showModal()}async function p(y){const v=structuredClone(n.project);l('<h2>Source time signal and spectrum</h2><p>Computing the injection at the current mesh time step…</p><p role="alert" class="error"></p><div class="dialog-actions"><button data-source-close>Close</button></div>');try{const g=await e("/sources/"+encodeURIComponent(y)+"/preview",v);if(!r.open)return;r.innerHTML=`<h2>Source preview · ${t(g.name)}</h2><p>${g.inherited?"Global":"Local"} pulse settings · ${g.enabled?"Enabled":"Disabled: zero injection"} · Δt ${g.dt_fs.toFixed(5)} fs · ${g.signal.length.toLocaleString()} samples</p>${g.pulse_parameters?`<p>${g.pulse_parameters.chirped?"Chirped":"Unchirped"} carrier · center ${g.pulse_parameters.center_wavelength_um.toFixed(5)} µm · power FWHM ${(g.pulse_parameters.pulse_length_s*1e15).toFixed(4)} fs</p>`:""}<div class="source-plot-tabs"><button data-mode="time" class="active">Time signal</button><button data-mode="spectrum">Spectrum</button><select aria-label="Source spectrum axis" hidden><option value="frequency">Frequency</option><option value="wavelength">Wavelength</option></select></div><canvas aria-label="Source waveform"></canvas><p>${t(g.note)}</p><div class="dialog-actions"><button data-source-close>Close</button></div>`;let E=!1;const T=()=>Os(a("canvas"),[g],E,a("select").value==="wavelength");r.querySelectorAll("[data-mode]").forEach(S=>S.onclick=()=>{E=S.dataset.mode==="spectrum",a("select").hidden=!E,r.querySelectorAll("[data-mode]").forEach(A=>A.classList.toggle("active",A===S)),T()}),a("select").onchange=T,a("[data-source-close]").onclick=o,T()}catch(g){r.open?c(g):s(g.message)}}return{signal:x,globals:f,preview:p}}function Bv({host:n,material:e,editable:t,api:i,esc:s,begin:r,current:a,invalidate:o,timestep:l,use:c}){var x,f,p;const d=y=>n.querySelector(y),u=e.fit_band_um||[((x=e.samples)==null?void 0:x.wavelength_um[0])||"",((f=e.samples)==null?void 0:f.wavelength_um.at(-1))||""];n.innerHTML=`<details class="material-fit"><summary>Measured optical data · import and fit</summary>
 <p>Supply your own passive isotropic n/k or complex permittivity samples. The table and its reference are saved with the project.</p>
 <fieldset ${t?"":"disabled"}>
 <div class="fit-controls"><label>Columns <select aria-label="Optical data columns"><option value="nk">Wavelength, n, k</option><option value="epsilon">Wavelength, ε real, ε imaginary</option></select></label>
 <label>Wavelength unit <select aria-label="Optical wavelength unit"><option value="um">µm</option><option value="nm">nm</option><option value="m">m</option></select></label>
 <label>CSV / text file <input aria-label="Optical data file" type="file" accept=".csv,.txt,.tsv"></label></div>
 <textarea aria-label="Optical data table" rows="5" placeholder="wavelength_um,n,k&#10;1.0,1.50,0.01&#10;1.5,1.49,0.01&#10;2.0,1.48,0.01"></textarea>
 <label class="fit-reference">Data reference <input aria-label="Optical data reference" maxlength="2000" value="${s(((p=e.samples)==null?void 0:p.reference)||"")}" placeholder="Citation or measurement description"></label>
 <button data-import>Import data</button><span data-data-status>${e.samples?`${e.samples.wavelength_um.length} samples retained`:"No samples imported"}</span>
 <div class="fit-controls"><label>Fit start (µm) <input aria-label="Fit wavelength start" type="number" step="any" min="0" value="${u[0]}"></label>
 <label>Fit stop (µm) <input aria-label="Fit wavelength stop" type="number" step="any" min="0" value="${u[1]}"></label>
 <label>Maximum poles <input aria-label="Maximum fit poles" type="number" min="1" max="16" value="6"></label>
 <label>RMS tolerance <input aria-label="Fit tolerance" type="number" min="0" max="1" step="any" value="0.001"></label>
 <label>Response <select aria-label="Fit response"><option value="analytic">Continuous material</option><option value="ade">FDTD at current timestep</option></select></label>
 <label><input aria-label="Include Drude pole" type="checkbox" checked> Include Drude pole</label></div>
 <button data-fit ${e.samples?"":"disabled"}>Fit optical data</button> <button data-use-fit disabled>Use fitted material</button>
 </fieldset><p class="fit-status" role="status">Fit accuracy applies inside the sampled band. Device accuracy also requires time and mesh convergence.</p>
 <canvas aria-label="Measured and fitted optical response"></canvas></details>`;let h=null;const m=y=>{d(".fit-status").textContent=y};function _(){h=null,d("[data-use-fit]").disabled=!0,o(),m("Inputs changed. Fit again to update the candidate.");const y=d("canvas");y.getContext("2d").clearRect(0,0,y.width,y.height)}return n.querySelectorAll("input,select,textarea").forEach(y=>y.oninput=_),n.querySelectorAll('textarea,[aria-label="Optical data columns"],[aria-label="Optical wavelength unit"],[aria-label="Optical data file"]').forEach(y=>y.addEventListener("input",()=>{d("[data-fit]").disabled=!0})),d('[aria-label="Optical data file"]').onchange=async y=>{const v=r(),g=y.target.files[0];if(g){if(g.size>2e6){m("Optical data file exceeds 2 MB.");return}try{const E=await g.text();if(!a(v))return;d("textarea").value=E,d('[aria-label="Optical data reference"]').value=g.name,_()}catch(E){a(v)&&m(E.message)}}},d("[data-import]").onclick=async()=>{const y=r();m("Reading optical samples…");try{const v=await i("/materials/data",{text:d("textarea").value,kind:d('[aria-label="Optical data columns"]').value,unit:d('[aria-label="Optical wavelength unit"]').value,reference:d('[aria-label="Optical data reference"]').value});if(!a(y))return;e.samples=v,e.fit_band_um=null,e.fit_dt_s=null,h=null,d('[aria-label="Fit wavelength start"]').value=v.wavelength_um[0],d('[aria-label="Fit wavelength stop"]').value=v.wavelength_um.at(-1),d("[data-data-status]").textContent=`${v.wavelength_um.length} samples · ${v.wavelength_um[0]}–${v.wavelength_um.at(-1)} µm`,d("[data-fit]").disabled=!t,d("[data-use-fit]").disabled=!0,o(),m("Data imported. Fit to create simulation coefficients.")}catch(v){a(y)&&m(v.message)}},d("[data-fit]").onclick=async()=>{const y=r();h=null,d("[data-use-fit]").disabled=!0,m("Fitting passive oscillators…");try{const v={max_poles:Number(d('[aria-label="Maximum fit poles"]').value),tolerance:Number(d('[aria-label="Fit tolerance"]').value),wavelength_range_um:[Number(d('[aria-label="Fit wavelength start"]').value),Number(d('[aria-label="Fit wavelength stop"]').value)],include_drude:d('[aria-label="Include Drude pole"]').checked,target:d('[aria-label="Fit response"]').value},g=structuredClone(e.samples);if(g.reference=d('[aria-label="Optical data reference"]').value,v.dt_s=await l(),!a(y))return;const E=await i("/materials/fit",{data:g,options:v,name:e.name,color:e.color});if(!a(y))return;h=E;const T=E.report,S=T.target==="ade"?"numerical":"fitted";Os(d("canvas"),[["measured_n","n (data)"],["measured_k","k (data)"],[`${S}_n`,"n (fit)"],[`${S}_k`,"k (fit)"]].map(([A,M])=>({name:M,wavelength_um:T.wavelength_um,spectrum:T[A],spectrum_label:"Wavelength (µm) · measured and fitted n + i k"})),!0,!0),m(`${T.converged?"Tolerance met":"Tolerance NOT met"} · ${T.pole_count} poles · ${T.sample_count} samples · analytic RMS ${T.analytic.normalized_rms.toExponential(3)} · FDTD RMS ${T.ade.normalized_rms.toExponential(3)} at Δt ${(T.dt_s*1e15).toPrecision(5)} fs · ${T.seconds.toFixed(2)} s. ${T.converged?"Use fitted material, then Apply materials to save.":"Adjust the fit band or pole limit. Current coefficients have not changed."}`),d("[data-use-fit]").disabled=!t||!T.converged}catch(v){a(y)&&m(v.message)}},d("[data-use-fit]").onclick=()=>{h!=null&&h.report.converged&&c(h.material)},{invalidate(){h=null,d("[data-use-fit]").disabled=!0,m("Material parameters changed. Fit again to update the candidate.")}}}const mc={model:"dielectric",index:1.5,color:"#60bdaa",epsilon_inf:1,plasma_rad_s:2e15,collision_rad_s:1e14,resonance_rad_s:2e15,linewidth_rad_s:1e14,delta_epsilon:1,poles:[],epsilon_tensor:[2.25,2.25,2.25,0,0,0]};function Hv({state:n,api:e,esc:t,toast:i,commit:s}){const r=document.createElement("dialog");r.className="material-dialog",document.body.append(r);let a,o=0,l=0,c;r.onclose=()=>{l++};const d=v=>r.querySelector(v),u=(v,g,E="",T=0)=>`<label class="material-field"><span>${v}</span><input aria-label="${v}" data-material-field="${g}" type="${g==="name"?"text":g==="color"?"color":"number"}" value="${t(a.materials[o][g])}" ${g==="name"?'maxlength="100"':`min="${T}" step="any"`}><small>${E}</small></label>`,h=()=>({resonance_rad_s:2e15,strength_rad_s_squared:4e30,damping_rad_s:1e14});function m(v){return`<div class="pole-editor">${v.poles.map((g,E)=>`<details open class="boundary-options"><summary>Pole ${E+1}</summary>${[["Resonance","resonance_rad_s","rad/s",0],["Oscillator strength","strength_rad_s_squared","rad²/s²",1e-30],["Damping","damping_rad_s","rad/s",0]].map(([T,S,A,M])=>`<label class="material-field"><span>${T}</span><input aria-label="Pole ${E+1} ${T}" type="number" min="${M}" step="any" data-pole-index="${E}" data-pole-field="${S}" value="${t(g[S])}"><small>${A}</small></label>`).join("")}<button data-remove-pole="${E}" ${v.poles.length<2?"disabled":""}>Remove pole ${E+1}</button></details>`).join("")}<button data-add-pole ${v.poles.length>=16?"disabled":""}>+ Add pole</button><p>Set resonance to zero for a Drude pole. Strength must be positive and damping nonnegative. Measured optical samples can be fitted below.</p></div>`}function _(v){return`<div class="tensor-material-editor"><p>Real symmetric relative permittivity in the Cartesian x, y, z basis. Principal permittivities must be at least 1.</p>${["xx","yy","zz","xy","xz","yz"].map((g,E)=>`<label class="material-field"><span>ε${g}</span><input aria-label="Tensor epsilon ${g}" data-tensor-index="${E}" type="number" step="any" value="${t(v.epsilon_tensor[E])}"><small>relative</small></label>`).join("")}<p>Uniform 3D grid, resident FP32, point sources and monitors. Periodic/Bloch boundaries or PML with a fixed isotropic exterior. Geometry is sampled at common nodes.</p><button data-tensor-sampling>Use supported tensor sampling</button><p>This stages staircase geometry and Yee field sampling. Apply materials saves both changes.</p></div>`}function x(){return"Tensor material: six Cartesian coefficients are used directly. Scalar n / k and isotropic optical-data fitting do not apply."}function f(){l++;const v=a.materials[o];Object.entries(mc).forEach(([g,E])=>v[g]??(v[g]=structuredClone(E))),r.innerHTML=`<div class="fsp-heading"><h2>Material database</h2><button data-dismiss>Close</button></div><p>Dielectric, full symmetric tensor, Drude, Lorentz and multiple passive poles.</p><div class="material-workspace"><aside><select size="8" aria-label="Material list">${a.materials.map((g,E)=>`<option value="${E}" ${E===o?"selected":""}>${t(g.name)}</option>`).join("")}</select><button data-add-material>+ Add material</button></aside><section><fieldset ${n.mode!=="layout"?"disabled":""}>${u("Material name","name")}${u("Display color","color")}<label class="material-field"><span>Material model</span><select aria-label="Material model" data-material-field="model">${[["dielectric","Dielectric"],["tensor","Symmetric dielectric tensor"],["drude","Plasma (Drude)"],["lorentz","Lorentz"],["multipole","Multiple Drude / Lorentz poles"]].map(([g,E])=>`<option value="${g}" ${v.model===g?"selected":""}>${E}</option>`).join("")}</select></label>${v.model==="tensor"?_(v):v.model==="dielectric"?u("Refractive index","index","",1):u("Permittivity (epsilon infinity)","epsilon_inf","",1)}${v.model==="drude"?u("Plasma resonance","plasma_rad_s","rad/s")+u("Plasma collision","collision_rad_s","rad/s"):v.model==="lorentz"?u("Lorentz permittivity","delta_epsilon")+u("Lorentz resonance","resonance_rad_s","rad/s")+u("Lorentz linewidth","linewidth_rad_s","rad/s"):v.model==="multipole"?m(v):""}</fieldset><p class="material-formula">${v.model==="tensor"?"ε = [[εxx, εxy, εxz], [εxy, εyy, εyz], [εxz, εyz, εzz]]":v.model==="dielectric"?"ε = n²":v.model==="drude"?"ε(ω) = ε∞ − ωp² / (ω² + i γ ω)":v.model==="multipole"?"ε(ω) = ε∞ + Σ Aⱼ / (ωⱼ² − ω² − i γⱼ ω)":"ε(ω) = ε∞ + Δε ω₀² / (ω₀² − ω² − 2 i δ ω)"}${v.model==="tensor"?"":"<br>Frequency parameters above are angular frequencies, in rad/s."}</p></section></div><div data-optical-fit></div><div class="material-range"><label>Wavelength start (µm) <input aria-label="Material wavelength start" type="number" value="1.3" min="0.001" step=".01"></label><label>Wavelength stop (µm) <input aria-label="Material wavelength stop" type="number" value="1.8" min="0.001" step=".01"></label><button data-preview>Plot n / k</button></div><canvas></canvas><p class="material-status" role="status">Preview includes the current simulation timestep.</p><div class="dialog-actions"><button data-apply ${n.mode!=="layout"?"disabled":""}>Apply materials</button><button data-dismiss>Cancel</button></div>`,c=v.model==="tensor"?null:Bv({host:d("[data-optical-fit]"),material:v,editable:n.mode==="layout",api:e,esc:t,begin:()=>++l,current:g=>g===l&&r.open,invalidate:p,timestep:async()=>(await e("/validate",a)).dt_fs*1e-15,use:g=>{a.materials[o]=g,f(),y()}}),d('[aria-label="Material list"]').onchange=g=>{o=+g.target.value,f()},d("[data-add-material]").disabled=n.mode!=="layout",d("[data-add-material]").onclick=()=>{let g=a.materials.length;for(;a.materials.some(E=>E.name===`Custom material ${g}`);)g++;a.materials.push({...structuredClone(mc),name:`Custom material ${g}`}),o=a.materials.length-1,f()},r.querySelectorAll("[data-material-field]").forEach(g=>g.onchange=()=>{const E=g.dataset.materialField,T=v.name;if(E==="name"&&(!g.value.trim()||a.materials.some((S,A)=>A!==o&&S.name===g.value))){g.value=T,d(".material-status").textContent="Material names must be nonempty and unique.";return}v[E]=["name","model","color"].includes(E)?g.value:Number(g.value),E==="name"&&a.structures.forEach(S=>{S.material===T&&(S.material=v.name)}),E==="model"&&v.model==="multipole"&&!v.poles.length&&v.poles.push(h()),E==="model"||E==="name"?f():p()}),r.querySelectorAll(".material-range input").forEach(g=>g.onchange=p),r.querySelectorAll("[data-dismiss]").forEach(g=>g.onclick=()=>r.close()),d("[data-add-pole]")&&(d("[data-add-pole]").onclick=()=>{v.poles.length<16&&(v.poles.push(h()),f())}),r.querySelectorAll("[data-remove-pole]").forEach(g=>g.onclick=()=>{v.poles.splice(+g.dataset.removePole,1),f()}),r.querySelectorAll("[data-pole-field]").forEach(g=>g.onchange=()=>{v.poles[+g.dataset.poleIndex][g.dataset.poleField]=Number(g.value),p()}),r.querySelectorAll("[data-material-field],[data-pole-field]").forEach(g=>g.addEventListener("input",p)),r.querySelectorAll("[data-tensor-index]").forEach(g=>{g.onchange=()=>{v.epsilon_tensor[+g.dataset.tensorIndex]=Number(g.value),p()},g.addEventListener("input",p)}),d("[data-tensor-sampling]")&&(d("[data-tensor-sampling]").onclick=()=>{a.region.interface_method="staircase",a.region.material_sampling="yee",p(),d(".material-status").textContent="Staircase geometry and Yee field sampling staged. Apply materials to save."}),d("[data-preview]").disabled=v.model==="tensor",d(".material-range").hidden=v.model==="tensor",d(".material-range + canvas").hidden=v.model==="tensor",v.model==="tensor"&&(d(".material-status").textContent=x()),d("[data-preview]").onclick=y,d("[data-apply]").onclick=async()=>{try{const g=await e("/validate",a);s(g.project),r.close()}catch(g){d(".material-status").textContent=g.message,i(g.message)}}}function p(){l++,c==null||c.invalidate();const v=d(".material-range + canvas");v.getContext("2d").clearRect(0,0,v.width,v.height),d(".material-status").textContent=a.materials[o].model==="tensor"?x():"Parameters changed. Select Plot n / k to refresh."}async function y(){if(a.materials[o].model==="tensor"){d(".material-status").textContent=x();return}const v=++l;try{const g=Number(d('[aria-label="Material wavelength start"]').value),E=Number(d('[aria-label="Material wavelength stop"]').value),T=(await e("/validate",a)).dt_fs;if(v!==l)return;const S=await e(`/materials/preview?wavelength_start=${g}&wavelength_stop=${E}&dt_fs=${T}`,a.materials[o]);if(v!==l)return;Os(d(".material-range + canvas"),["n","k","numerical_n","numerical_k"].map((A,M)=>({name:["n (analytic)","k (analytic)","n (ADE)","k (ADE)"][M],wavelength_um:S.wavelength_um,spectrum:S[A],spectrum_label:"Wavelength (µm) · complex index n + i k"})),!0,!0),d(".material-status").textContent=`${S.wavelength_um.length} wavelengths · analytic response and ADE at Δt = ${T.toPrecision(5)} fs. Positive k means absorption.${S.samples?` Retained samples: analytic RMS ${S.samples.analytic.normalized_rms.toExponential(3)}, FDTD RMS ${S.samples.ade.normalized_rms.toExponential(3)}.`:""}`}catch(g){v===l&&(d(".material-status").textContent=g.message)}}return{open(){a=structuredClone(n.project),o=0,f(),r.showModal()}}}function Gv({api:n,esc:e}){const t=document.createElement("dialog");t.className="capability-dialog",document.body.append(t);let i;const s=a=>t.querySelector(a);function r(){const a=s("[data-search]").value.toLowerCase(),o=s("[data-status]").value,l=s("[data-category]").value,c=s("[data-priority]").value,d=i.features.filter(u=>(!o||u.native===o)&&(!l||u.category===l)&&(!c||u.product_priority===c)&&(!s("[data-remaining]").checked||u.remaining)&&[u.name,u.category,u.scope,u.workstream_title].join(" ").toLowerCase().includes(a)).sort((u,h)=>u.delivery_rank-h.delivery_rank||u.name.localeCompare(h.name));s(".capability-count").textContent=`${d.length.toLocaleString()} / ${i.features.length.toLocaleString()} entries`,s("tbody").innerHTML=d.map(u=>`<tr><td>${u.native==="implemented"?"☑":"☐"}</td><td><b>${e(u.product_priority)}</b><small>${e(i.decision_labels[u.decision])}</small></td><td><small>${e(u.workstream_title)} · ${e(u.category)}</small>${u.reference?`<a href="${e(u.reference)}" target="_blank" rel="noopener">${e(u.name)}</a>`:`<span>${e(u.name)}</span>`}</td>${["native","python","ui","fsp"].map(h=>`<td><span class="cap-status ${u[h]}">${e(i.status_labels[u[h]])}</span></td>`).join("")}<td>${e(u.scope)}<small>${e(u.priority_reason)}</small>${u.evidence.length?`<small>${u.evidence.map(e).join(" · ")}</small>`:""}</td></tr>`).join("")}return{async open(){i=await n("/capabilities"),t.innerHTML=`<div class="fsp-heading"><h2>Feature priorities and checklist</h2><button data-close-panel>Close</button></div><p>${e(i.priority_note)}</p><p>${Object.entries(i.remaining_priority_counts).sort().map(([a,o])=>`${e(a)}: ${o} remaining entries`).join(" · ")}</p><div class="capability-filters"><input data-search aria-label="Search capabilities" placeholder="Search feature or property"><select data-priority aria-label="Capability priority"><option value="">All priorities</option>${Object.entries(i.priority_labels).map(([a,o])=>`<option value="${a}">${e(o)}</option>`).join("")}</select><select data-status aria-label="Capability status"><option value="">All statuses</option>${Object.entries(i.status_labels).map(([a,o])=>`<option value="${a}">${e(o)}</option>`).join("")}</select><select data-category aria-label="Capability category"><option value="">All categories</option>${[...new Set(i.features.map(a=>a.category))].map(a=>`<option>${e(a)}</option>`).join("")}</select><label><input data-remaining type="checkbox" aria-label="Remaining work only"> Remaining work only</label><a href="/api/capabilities" target="_blank">JSON</a><span class="capability-count"></span></div><div class="capability-table"><table><thead><tr><th></th><th>Priority</th><th>Feature / property</th><th>Native engine</th><th>Python</th><th>UI</th><th>Independent FSP</th><th>Scope / reason / evidence</th></tr></thead><tbody></tbody></table></div>`,s("[data-close-panel]").onclick=()=>t.close(),s("[data-search]").oninput=r;for(const a of["data-status","data-category","data-priority","data-remaining"])s("["+a+"]").onchange=r;r(),t.showModal()}}}function Vv({esc:n}){const e=document.createElement("dialog");e.className="inverse-design-dialog",document.body.append(e);const t=A=>e.querySelector(A),i="torchfdtd.periodicDesign.v1",s=i+".job";let r,a=localStorage.getItem(s),o,l=!1,c=null,d=!1,u=!1;async function h(A,M){var U;const b=await fetch("/api/"+A,M===void 0?{}:{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(M)}),R=(U=b.headers.get("content-type"))!=null&&U.includes("json")?await b.json():await b.text();if(!b.ok)throw Error(typeof R.detail=="string"?R.detail:JSON.stringify(R.detail||R));return R}function m(){localStorage.setItem(i,JSON.stringify(r))}function _(A,M,b="application/json"){const R=URL.createObjectURL(new Blob([A],{type:b})),U=document.createElement("a");U.href=R,U.download=M,U.click(),setTimeout(()=>URL.revokeObjectURL(R),1e3)}function x(A){t("[data-design-status]").textContent=A.message}const f=(A,M,b,R="any")=>`<label>${A}<input aria-label="${A}" data-key="${M}" type="number" step="${R}" value="${n(b)}"></label>`,p=(A,M,b)=>`<label>${A}<select aria-label="${A}" data-key="${M}">${b.map(([R,U])=>`<option value="${R}" ${r[M]===R?"selected":""}>${U}</option>`).join("")}</select></label>`;function y(){var L;const A=d&&((L=c==null?void 0:c.progress)!=null&&L.density_preview)?c.progress.density_preview:r.initial_density,M=t("[data-density]"),b=M.getContext("2d"),R=A.length,U=A[0].length;b.clearRect(0,0,M.width,M.height);for(let k=0;k<R;k++)for(let F=0;F<U;F++){const O=Math.max(0,Math.min(1,Number(A[k][F])));b.fillStyle=`rgb(${Math.round(18+207*O)},${Math.round(39+190*O)},${Math.round(65+95*O)})`,b.fillRect(k*M.width/R,(U-1-F)*M.height/U,Math.ceil(M.width/R),Math.ceil(M.height/U))}t("[data-density-caption]").textContent=(d?"Latest evaluated density":"Initial density")+` · x: ${R}, y: ${U} · 0 background / 1 design material`}function v(A){l=A,e.querySelectorAll("fieldset").forEach(M=>M.disabled=A),t("[data-start-design]").disabled=A,t("[data-plan-design]").disabled=A,t("[data-stop-design]").disabled=!A,t("[data-load-design]").disabled=A,t("[data-use-seed]").disabled=A||!(c!=null&&c.summary)}function g(){e.innerHTML=`<div class="fsp-heading"><div><h2>Inverse design · periodic layer</h2><p>FP32 · Torch adjoint · automatic memory placement</p></div><button data-close-design>Close</button></div>
  <p class="design-scope">Optimize a continuous density layer at one wavelength. This setup is separate from the CAD scene. Fixed materials, periodic x/y boundaries and PML in z. Mesh convergence and fabrication constraints require separate validation.</p>
  <div class="design-grid"><section class="design-settings"><fieldset><legend>Structure & illumination</legend>
   ${f("Wavelength (µm)","wavelength_um",r.wavelength_um)}
   ${f("Period x (µm)","period_um.0",r.period_um[0])}${f("Period y (µm)","period_um.1",r.period_um[1])}
   ${f("Layer height (µm)","height_um",r.height_um)}${f("Detector offset (µm)","detector_offset_um",r.detector_offset_um)}
   ${f("Background index","background_index",r.background_index)}${f("Design index","design_index",r.design_index)}
   ${f("Incidence θ (degrees)","theta_deg",r.theta_deg)}${f("Azimuth φ (degrees)","phi_deg",r.phi_deg)}
   ${f("Mesh (µm)","mesh_um",r.mesh_um)}${f("Time steps","steps",r.steps,1)}${f("PML cells","pml_cells",r.pml_cells,1)}
  </fieldset><fieldset><legend>Objective & optimizer</legend><p>Maximize weighted quadrant power, averaged over two polarizations.</p>
   ${["R","G2","G1","B"].map((b,R)=>f(b+" weight","objective_weights."+R,r.objective_weights[R])).join("")}
   ${f("Adam updates","iterations",r.iterations,1)}${f("Learning rate","learning_rate",r.learning_rate)}
  </fieldset><fieldset><legend>Memory & execution</legend>
   ${p("Compute device","device",[["cpu","CPU"],["cuda","CUDA GPU"]])}
   ${p("Execution mode","execution",[["auto","Automatic"],["resident","Resident"],["recorded","Boundary-history adjoint"],["dram","DRAM streaming"],["file","File streaming"]])}
   ${f("GPU budget (GiB)","gpu_budget_gib",r.gpu_budget_gib)}${f("DRAM budget (GiB)","host_budget_gib",r.host_budget_gib)}
   ${r.execution==="recorded"?`
    ${p("Boundary history","recorded_trace_storage",[["cpu","CPU RAM"],["device","Compute device"]])}
    ${f("Transfer block (steps)","recorded_trace_chunk_steps",r.recorded_trace_chunk_steps,1)}
    ${f("Fixed collar (cells)","recorded_collar_cells",r.recorded_collar_cells,1)}
    <p data-recorded-scope>Reconstruct the lossless design interior from boundary history. Fields remain on the compute device. The layer and source must fit inside the fixed exterior collar. CUDA with CPU history uses asynchronous transfers.</p>
   `:`${f("Checkpoints","checkpoints",r.checkpoints,1)}${f("Maximum slab width","slab_width",r.slab_width,1)}${f("Temporal depth","temporal_depth",r.temporal_depth,1)}
    <details><summary>Optional file backing</summary><label>State directory<input aria-label="State directory" data-key="state_directory" value="${n(r.state_directory||"")}"></label>
    ${f("File budget (GiB)","disk_budget_gib",r.disk_budget_gib??"")}${f("Keep disk free (GiB)","disk_free_reserve_gib",r.disk_free_reserve_gib)}<p>Used only when explicitly configured. Default free-space reserve: 100 GiB.</p></details>`}
  </fieldset></section>
  <section class="design-density"><h3>Design region</h3><canvas data-density width="512" height="512" aria-label="Density editor"></canvas><p data-density-caption></p>
   <fieldset><legend>Initial density</legend><div class="design-density-tools"><label>x pixels<input aria-label="Density x pixels" data-nx type="number" value="${r.initial_density.length}" min="1" max="1024"></label><label>y pixels<input aria-label="Density y pixels" data-ny type="number" value="${r.initial_density[0].length}" min="1" max="1024"></label><label>Paint value<input aria-label="Density paint value" data-paint type="number" value="0.5" min="0" max="1" step="0.1"></label></div><button data-reset-density>Fill / resize initial density</button><button data-show-initial>Show initial density</button><p>Click or drag to paint. x increases right and y increases upward.</p></fieldset>
   <div class="design-file-tools"><button data-save-design>Save setup JSON</button><button data-load-design>Load setup JSON</button><button data-export-design>Export Python</button><input data-import-design type="file" accept=".json" hidden></div>
   <button data-use-seed disabled>Use evaluated result as new seed</button>
  </section>
  <section class="design-run"><h3>Execution plan</h3><button data-plan-design>Check memory</button><p data-plan-summary>No fields or trial simulations are run by the memory check.</p>
   <div class="design-run-buttons"><button data-start-design>Run inverse design</button><button data-stop-design disabled>Stop</button></div><p data-design-status role="status">Ready</p><p class="design-stop-note">Stop takes effect between solver calls. Closing this panel keeps the job running.</p>
   <h3>Evaluated objective</h3><table><thead><tr><th>Update</th><th>Score ↑</th><th>Gradient L2</th></tr></thead><tbody data-design-history></tbody></table><a data-design-download hidden>Download evaluated designs</a>
  </section></div>`,t("[data-close-design]").onclick=()=>e.close(),e.querySelectorAll("[data-key]").forEach(b=>b.onchange=()=>{const[R,U]=b.dataset.key.split(".");let L=b.type==="number"?b.value===""?null:Number(b.value):b.value;R==="state_directory"&&!L&&(L=null),U!==void 0?r[R][Number(U)]=L:r[R]=L,m(),d=!1,R==="execution"?g():y(),t("[data-plan-summary]").textContent="Settings changed. Check memory before running."}),t("[data-reset-density]").onclick=()=>{try{const b=Number(t("[data-nx]").value),R=Number(t("[data-ny]").value),U=Number(t("[data-paint]").value);if(!Number.isInteger(b)||!Number.isInteger(R)||b<1||R<1||b*R>1048576||U<0||U>1)throw Error("Use positive pixel counts and a density in [0,1].");r.initial_density=Array.from({length:b},()=>Array(R).fill(U)),m(),d=!1,y(),t("[data-plan-summary]").textContent="Settings changed. Check memory before running."}catch(b){x(b)}},t("[data-show-initial]").onclick=()=>{d=!1,y()};const A=t("[data-density]");function M(b){if(l||d)return;const R=A.getBoundingClientRect(),U=r.initial_density,L=Number(t("[data-paint]").value);if(!Number.isFinite(L)||L<0||L>1)return;const k=Math.min(U.length-1,Math.max(0,Math.floor((b.clientX-R.left)/R.width*U.length))),F=Math.min(U[0].length-1,Math.max(0,U[0].length-1-Math.floor((b.clientY-R.top)/R.height*U[0].length)));U[k][F]=L,y()}A.onpointerdown=b=>{u=!0,A.setPointerCapture(b.pointerId),M(b)},A.onpointermove=b=>{u&&M(b)},A.onpointerup=()=>{u=!1,m()},t("[data-plan-design]").onclick=async()=>{try{const b=await h("design/plan",r);E(b)}catch(b){x(b)}},t("[data-start-design]").onclick=async()=>{try{v(!0),c=null,a=(await h("design/jobs",r)).id,localStorage.setItem(s,a),await S()}catch(b){v(!1),x(b)}},t("[data-stop-design]").onclick=async()=>{try{await h("jobs/"+a+"/cancel",{}),t("[data-design-status]").textContent="Stop requested. Waiting for the current solver call."}catch(b){x(b)}},t("[data-save-design]").onclick=()=>_(JSON.stringify(r,null,2),"periodic-design.json"),t("[data-export-design]").onclick=async()=>{try{_(await h("design/python",r),"periodic_design.py","text/x-python")}catch(b){x(b)}},t("[data-load-design]").onclick=()=>t("[data-import-design]").click(),t("[data-import-design]").onchange=async b=>{try{const R=b.target.files[0];if(!R)return;const U=JSON.parse(await R.text());r=await h("design/config",U),m(),d=!1,c=null,a=null,localStorage.removeItem(s),g()}catch(R){x(R)}},t("[data-use-seed]").onclick=async()=>{try{const b=await h("design/jobs/"+a+"/download");if(!b.last_evaluated)throw Error("No evaluated density is available.");r={...b.config,initial_density:b.last_evaluated.density},m(),d=!1,c=null,a=null,localStorage.removeItem(s),g()}catch(b){x(b)}},y(),v(l),c&&T(c)}function E(A){var b;const M=((b=A.selection)==null?void 0:b.mode)||A.execution;t("[data-plan-summary]").textContent=`${A.device==="cuda"?"CUDA GPU":"CPU"} · ${M} · FP32
GPU ${(A.gpu_reservation_bytes/1024**3).toFixed(3)} GiB · DRAM ${(A.total_host_reservation_bytes/1024**3).toFixed(3)} GiB · file ${(A.disk_reservation_bytes/1024**3).toFixed(3)} GiB reserved. No calibration solves.`}function T(A){var U;c=A;const M=A.progress||{};v(["queued","running"].includes(A.status));const b=JSON.stringify(A.config)===JSON.stringify(r);t("[data-design-status]").textContent=A.error||`${l&&A.cancel_requested?"Stopping":A.status} · ${M.stage||"waiting"} · ${M.updates_completed||0} / ${((U=A.config)==null?void 0:U.iterations)||r.iterations} updates`,M.plan&&b?E(M.plan):b||(t("[data-plan-summary]").textContent="Settings differ from the displayed run. Check memory for this setup."),t("[data-design-history]").innerHTML=(M.history||[]).map(L=>`<tr><td>${L.update}</td><td>${L.objective.toPrecision(7)}</td><td>${L.gradient_l2===void 0?"—":L.gradient_l2.toExponential(3)}</td></tr>`).join(""),M.density_preview&&b&&(d=!0,y());const R=t("[data-design-download]");R.hidden=!A.summary,R.href="/api/design/jobs/"+a+"/download"}async function S(){clearTimeout(o);try{const A=await h("jobs/"+a);T(A),l&&e.open&&(o=setTimeout(S,1500))}catch(A){v(!1),x(A)}}return e.addEventListener("close",()=>clearTimeout(o)),{async open(){if(!r){const A=await h("design/defaults");try{const M=JSON.parse(localStorage.getItem(i));r=M?await h("design/config",M):A}catch{r=A}if(!localStorage.getItem(i)){const M=await h("health");r.device=M.cuda?"cuda":"cpu"}}g(),e.showModal(),a&&await S()}}}function $v(n,e){const t={auto_shutoff:!1,decay_threshold:1e-6,check_interval:50,consecutive_checks:3,min_steps:100,source_tail_amplitude:1e-8,after_source_s:0,divergence_check:!0,growth_limit:1e6,field_limit:null};n.run_control??(n.run_control={});const i=n.run_control;for(const[r,a]of Object.entries(t))i[r]===void 0&&(i[r]=a);const s=(r,a,o="",l={})=>e(r,"run_control."+a,i[a],o,l);return`<label class="enabled-row"><input aria-label="Automatic decay shutoff" type="checkbox" data-path="run_control.auto_shutoff" ${i.auto_shutoff?"checked":""}> Automatic decay shutoff</label>`+s("decay threshold","decay_threshold","",{min:1e-15})+s("check every","check_interval","steps",{min:1,step:1})+s("consecutive low checks","consecutive_checks","",{min:2,step:1})+s("minimum time steps","min_steps","",{min:10,step:1})+s("source tail cutoff","source_tail_amplitude","",{min:1e-15})+e("wait after source","run_control.after_source_s",i.after_source_s*1e15,"fs",{min:0,scale:1e-15})+`<label class="enabled-row"><input aria-label="Divergence checking" type="checkbox" data-path="run_control.divergence_check" ${i.divergence_check?"checked":""}> Divergence checking</label>`+s("post-source growth limit","growth_limit","",{min:1.01})+`<label class="enabled-row"><input aria-label="Absolute field limit" type="checkbox" data-run-field-limit ${i.field_limit!==null?"checked":""}> Absolute field limit</label>`+(i.field_limit!==null?s("maximum field magnitude","field_limit","",{min:1e-30}):"")+'<p class="property-help">Decay threshold and growth limit are ratios of the whole-domain state norm. Source tail cutoff is a relative envelope amplitude. Absolute field limits use reduced field units. All finite sources must finish before decay checks. Continuous sources disable automatic termination. Confirm spectra with a longer run.</p>'}async function Wv({state:n,api:e,esc:t,toast:i}){const s=n.job;if(!s)throw Error("Complete a 3D run with a six-field frequency plane first.");const[r,a]=await Promise.all([e(`/jobs/${s}/diffraction-monitors`),e("/jobs")]);if(!r.length)throw Error("Add a full-cell frequency monitor and record all six E/H fields, then rerun.");const o=document.createElement("dialog");o.className="radiation-dialog monitor-dialog",o.style.width="min(1000px,92vw)",document.body.append(o);const l=h=>o.querySelector(h);o.innerHTML=`<div class="fsp-heading"><h2>Diffraction orders</h2><button data-close>Close</button></div>
 <p>Requires a complete periodic unit-cell plane with six collocated E/H fields in a homogeneous lossless isotropic medium outside PML. This is not an isolated-object far-field projection.</p>
 <label>Stored plane <select aria-label="Diffraction plane">${r.map(h=>`<option value="${t(h.id)}">${t(h.name)} (+${h.normal})</option>`).join("")}</select></label>
 <label>Frequency <select aria-label="Diffraction frequency"></select></label>
 <label>Exterior refractive index <input aria-label="Exterior refractive index" type="number" min="0.001" max="20" step="0.01" value="1"></label>
 <label>Integer orders (m,n per line)<textarea aria-label="Diffraction orders" rows="3">0,0</textarea></label>
 <label>Matched reference <select aria-label="Diffraction reference"><option value="">Raw directional powers only</option>${a.filter(h=>h.id!==s&&h.status==="completed").map(h=>`<option value="${t(h.id)}">${t(h.name)} (${t(h.id.slice(0,8))})</option>`).join("")}</select></label>
 <label><input type="checkbox" aria-label="Subtract incident diffraction fields"> Subtract matched incident fields before normalized power</label>
 <label><input type="checkbox" aria-label="Confirm diffraction exterior"> I confirm both planes are in the declared homogeneous, lossless isotropic exterior, outside PML.</label>
 <button data-calculate>Calculate diffraction</button><p role="status"></p><div data-results></div>`;let c=0;function d(){c++,l("[data-results]").innerHTML="",l('[role="status"]').textContent="",l("[data-calculate]").disabled=!1}function u(){const h=r.find(m=>m.id===l('[aria-label="Diffraction plane"]').value);l('[aria-label="Diffraction frequency"]').innerHTML=h.frequency_thz.map((m,_)=>`<option value="${_}">${m.toPrecision(7)} THz</option>`).join(""),l("[data-results]").innerHTML=""}l('[aria-label="Diffraction plane"]').onchange=u,u(),o.querySelectorAll("input,select,textarea").forEach(h=>{h.addEventListener("input",d),h.addEventListener("change",d)}),l("[data-close]").onclick=()=>o.close(),o.addEventListener("close",()=>{c++,o.remove()},{once:!0}),l("[data-calculate]").onclick=async()=>{const h=++c,m=l("[data-calculate]");m.disabled=!0,l("[data-results]").innerHTML="";try{const _=l('[aria-label="Diffraction orders"]').value.trim().split(/\n+/).map(y=>y.trim().split(/[\s,]+/).map(Number));if(!_.length||_.some(y=>y.length!==2||y.some(v=>!Number.isInteger(v))))throw Error("Enter one pair of integers per line, for example 0,0.");const x=l('[aria-label="Diffraction reference"]').value,f=await e(`/jobs/${s}/diffraction`,{monitor:l('[aria-label="Diffraction plane"]').value,frequency_index:Number(l('[aria-label="Diffraction frequency"]').value),orders:_,refractive_index:Number(l('[aria-label="Exterior refractive index"]').value),reference:x||null,subtract_incident:l('[aria-label="Subtract incident diffraction fields"]').checked,confirm_homogeneous_exterior:l('[aria-label="Confirm diffraction exterior"]').checked});if(h!==c)return;const p=y=>Number(y).toExponential(6);l('[role="status"]').textContent=`${f.frequency_thz.toPrecision(7)} THz; orders along ${f.transverse_axes.join(", ")}. ${f.normalized?"Reference-normalized efficiencies shown alongside raw directional powers.":"Raw directional powers only, not efficiencies."}`,l("[data-results]").innerHTML=`<table style="width:100%;text-align:left;border-spacing:8px"><thead><tr><th>Order</th><th>Type</th><th>+ normal raw power</th><th>- normal raw power</th>${f.normalized?"<th>Forward efficiency</th><th>Backward efficiency</th>":""}</tr></thead><tbody>${f.orders.map((y,v)=>`<tr><td>${y.join(", ")}</td><td>${f.propagating[v]?"Propagating":"Evanescent (zero real power)"}</td><td>${p(f.forward_power[v])}</td><td>${p(f.backward_power[v])}</td>${f.normalized?`<td>${p(f.forward_efficiency[v])}</td><td>${p(f.backward_efficiency[v])}</td>`:""}</tr>`).join("")}</tbody></table><p>Raw units: ${t(f.units)}. ${t(f.note)}${f.subtract_incident?" Normalized columns use incident-subtracted fields; raw columns retain total fields.":""}</p>`}catch(_){h===c&&(l('[role="status"]').textContent=_.message,i(_.message))}finally{h===c&&(m.disabled=!1)}},o.showModal()}function gd(n,e,t,{plane:i=!1,prefix:s="spectrum."}={}){const r=n.sampling,a=[...i?[]:[["fft","FFT bins"]],["frequency","Uniform frequency"],["wavelength","Uniform wavelength"],["chebyshev","Chebyshev nodes"],["custom","Custom frequencies"]];return t("sample spacing",s+"sampling",r,a)+(r==="custom"?`<label class="monitor-custom">Frequencies (THz)<textarea data-frequency-table data-prefix="${s}" aria-label="Custom frequencies (THz)">${(n.custom_frequencies_hz||[]).map(o=>o*1e-12).join(`
`)}</textarea></label>`:r!=="fft"?`<label class="enabled-row"><input type="checkbox" data-path="${s}use_source_limits" ${n.use_source_limits?"checked":""}> Use source wavelength limits</label><fieldset ${n.use_source_limits?"disabled":""}>`+e("minimum wavelength",s+"wavelength_start",n.wavelength_start,"µm",{min:.001})+e("maximum wavelength",s+"wavelength_stop",n.wavelength_stop,"µm",{min:.001})+"</fieldset>"+e("frequency points",s+"frequency_points",n.frequency_points,"",{min:1,step:1})+(r==="chebyshev"?t("Chebyshev node rule",s+"chebyshev_nodes",n.chebyshev_nodes||"roots",[["roots","Roots (interior)"],["lobatto","Lobatto (include endpoints)"]])+`<label class="enabled-row"><input type="checkbox" data-path="${s}chebyshev_wavelength" ${n.chebyshev_wavelength?"checked":""}> Chebyshev nodes in wavelength</label>`:""):"")}function jv(n,e,t,i){const s=n.record_fields??["Ex","Ey","Ez","Hx","Hy","Hz"],r=n.record_poynting??["x","y","z"],a=n.downsample_xyz??[n.downsample||1,n.downsample||1,n.downsample||1],o=(l,c,d)=>c.map(u=>`<label class="enabled-row"><input type="checkbox" data-record-family="${l}" value="${u}" ${d.includes(u)?"checked":""}> Record ${l==="record_poynting"?"P"+u:u}</label>`).join("");return i("normal axis","normal",n.normal,e.dimension==="2d"?["x","y"]:["x","y","z"])+["x","y","z"].filter(l=>l!==n.normal&&(e.dimension==="3d"||l!=="z")).map(l=>t("downsample "+l,"downsample_xyz."+"xyz".indexOf(l),a["xyz".indexOf(l)],"",{min:1,max:32,step:1})).join("")+i("spatial interpolation","spatial_interpolation",n.spatial_interpolation||"specified",[["specified","Specified plane"],["nearest","Nearest normal mesh node"]])+i("DFT accumulation precision","dft_precision",n.dft_precision||"field",[["field","Match solver precision"],["float64","Double precision"]])+o("record_fields",["Ex","Ey","Ez","Hx","Hy","Hz"],s)+o("record_poynting",["x","y","z"],r)+`<label class="enabled-row"><input type="checkbox" data-path="record_flux" ${n.record_flux!==!1?"checked":""}> Record signed flux</label><p class="property-help">Only fields required by the selected outputs are accumulated. Flux alone requires four tangential E/H components. Incident subtraction also requires storing those fields.</p><button data-action="flux-results">Open flux results</button>`}function Xv({state:n,api:e,esc:t,toast:i,commit:s,numeric:r,dropdown:a}){const o=document.createElement("dialog");o.className="monitor-dialog",document.body.append(o);const l=u=>o.querySelector(u);let c=0;function d(){o.querySelectorAll("[data-dismiss]").forEach(u=>u.onclick=()=>{c++,o.close()})}return{globals(){const u=structuredClone(n.project);u.global_monitor??(u.global_monitor={sampling:"frequency",wavelength_start:1.3,wavelength_stop:1.8,frequency_points:101,apodization:"none",apodization_center:2e-14,apodization_time_width:1e-14,custom_frequencies_hz:[],chebyshev_wavelength:!1});function h(){const m=u.global_monitor;o.innerHTML=`<div class="fsp-heading"><h2>Global monitor settings</h2><button data-dismiss>Close</button></div><fieldset ${n.mode!=="layout"?"disabled":""}>${gd(m,r,a,{plane:!0,prefix:""})}${a("apodization","apodization",m.apodization,["none","start","end","full"])}${r("apodization center","apodization_center",m.apodization_center*1e15,"fs",{scale:1e-15})}${r("apodization time width","apodization_time_width",m.apodization_time_width*1e15,"fs",{scale:1e-15})}<button data-apply>Apply monitor settings</button></fieldset><p class="monitor-status"></p>`,d(),o.querySelectorAll("[data-path]").forEach(x=>x.onchange=()=>{var f;m[x.dataset.path]=x.type==="checkbox"?x.checked:x.type==="number"?Number(x.value)*Number(x.dataset.scale||1):x.value,["sampling","use_source_limits"].includes(x.dataset.path)&&(m.sampling==="custom"&&!((f=m.custom_frequencies_hz)!=null&&f.length)&&(m.custom_frequencies_hz=[2e14]),h())});const _=l("[data-frequency-table]");_&&(_.onchange=()=>{m.custom_frequencies_hz=_.value.trim().split(/[\s,;]+/).filter(Boolean).map(x=>Number(x)*1e12)}),l("[data-apply]").onclick=async()=>{try{const x=await e("/validate",u);s(x.project),o.close()}catch(x){l(".monitor-status").textContent=x.message}}}h(),o.showModal()},async flux(){if(!n.job)throw Error("Run a project with a frequency monitor first.");const u=await e("/jobs/"+n.job),h=u.flux_monitors||[],m=await e("/jobs");o.innerHTML=`<div class="fsp-heading"><h2>Frequency fields / power flux</h2><button data-dismiss>Close</button></div><label>Monitor <select aria-label="Flux monitor">${h.map(x=>`<option value="${t(x.id)}">${t(x.name)} · +${x.normal}</option>`).join("")}</select></label><label>Reference run <select aria-label="Flux reference"><option value="">Raw signed flux</option>${m.filter(x=>x.id!==n.job&&x.flux_monitors.length).map(x=>`<option value="${x.id}">${t(x.name)} · ${x.id.slice(0,8)}</option>`).join("")}</select></label><label class="enabled-row"><input type="checkbox" aria-label="Subtract incident fields"> Subtract reference E/H before computing flux (reflection)</label><button data-plot-flux>Plot flux</button><button data-diffraction>Diffraction orders</button><a href="/api/jobs/${n.job}/flux.csv">Export raw flux CSV</a><canvas></canvas><p class="monitor-status"></p><p>Flux is signed along the positive monitor normal. A reflected wave can be negative. Reference normalization requires identical sources, mesh, duration and unapodized monitors. For an air reference, freeze graded refinements before removing structures, then run both scenes with the same monitor IDs. Absolute watt calibration is not provided.</p>`,d();async function _(){const x=++c;try{const f=h.find(g=>g.id===l('[aria-label="Flux monitor"]').value),p=l('[aria-label="Flux reference"]').value,y=l('[aria-label="Subtract incident fields"]').checked;let v={...f,spectrum:f.flux,signed:!0,spectrum_label:`Wavelength (µm) · signed flux (${f.units})`};if(p){const g=await e(`/jobs/${n.job}/normalize-flux?reference=${encodeURIComponent(p)}&monitor=${encodeURIComponent(f.id)}&subtract_incident=${y}`);if(x!==c)return;v={...f,...g,spectrum:g.ratio,signed:!0,spectrum_label:"Wavelength (µm) · signed normalized flux"},l(".monitor-status").textContent=`${g.valid.filter(Boolean).length}/${g.valid.length} frequencies above the reference threshold. Reflection is negative for propagation opposite the positive normal.`}else l(".monitor-status").textContent=`${f.points} spatial samples · collocated E/H · ${f.flux.length} frequencies. Raw reduced flux is not normalized transmission.`;Os(l("canvas"),[v],!0,!0)}catch(f){x===c&&(l(".monitor-status").textContent=f.message,i(f.message))}}l("[data-diffraction]").onclick=async()=>{try{await Wv({state:n,api:e,esc:t,toast:i}),o.close()}catch(x){i(x.message)}},l("[data-plot-flux]").onclick=_,l("[data-plot-flux]").disabled=!h.length,o.showModal(),h.length?await _():l(".monitor-status").textContent="No raw flux recorded. Diffraction orders can use a stored six-field plane."}}}function qv({state:n,api:e,esc:t,commit:i}){const s=document.createElement("dialog");s.className="boundary-dialog",document.body.append(s);const r=[["pml","PML"],["periodic","Periodic"],["bloch","Bloch"],["pec","PEC"],["antisymmetric","Anti-symmetric (PEC)"],["pmc","PMC"],["symmetric","Symmetric (PMC)"]],a=["x_min","x_max","y_min","y_max","z_min","z_max"];function o(){if(n.mode!=="layout")throw Error("Switch to Layout before editing boundaries.");const l=n.project,c=structuredClone(l);s.innerHTML=`<h2>Boundary conditions</h2><p>Apply the complete face configuration in one edit.</p><div class="dialog-buttons"><button data-boundary-preset="pmc">All PMC</button><button data-boundary-preset="pec">All PEC</button><button data-boundary-preset="pml">All PML</button></div>${a.map(u=>`<label class="property-row"><span>${t(u.replace("_"," "))}</span><select aria-label="${t(u.replace("_"," "))} boundary" data-face="${u}" ${u.startsWith("z_")&&c.region.dimension==="2d"?"disabled":""}>${r.map(([h,m])=>`<option value="${h}" ${c.region.boundaries[u].kind===h?"selected":""}>${m}</option>`).join("")}</select></label>`).join("")}<p class="property-help">PMC and magnetic symmetry support PEC/PMC walls and restricted endpoint CPML. Use real FP32, fixed Yee meshes, point electric sources and point E/H monitors. Mixed CPML additionally requires uniform equal-spacing axes and a fixed isotropic PML exterior. Periodic/Bloch mixing is unsupported. Active PML faces must have equal layers and sigma scale, kappa 1, alpha 0, polynomial 3 and alpha polynomial 0.</p><p class="property-help">Face selections change kinds only. The explicit profile button below also sets active PML parameters. Source, material and mesh settings are preserved. Bloch phases are cleared on axes changed away from Bloch.</p><button data-endpoint-profile>Set supported endpoint CPML profile</button><p class="property-help">Profile button: selected PML faces use default region layers, sigma scale 1, kappa 1, alpha 0, cubic grading. Endpoint target sampling differs from ordinary scalar-Yee PML. Keep sources/monitors outside PML and material in PML plus one cell equal to background.</p><p data-boundary-status role="status" aria-live="polite"></p><div class="dialog-actions"><button data-boundary-apply>Apply boundaries</button><button data-boundary-close>Cancel</button></div>`;const d=[...s.querySelectorAll("[data-face]")];s.querySelectorAll("[data-boundary-preset]").forEach(u=>u.onclick=()=>d.filter(h=>!h.disabled).forEach(h=>h.value=u.dataset.boundaryPreset)),s.querySelector("[data-endpoint-profile]").onclick=()=>{const u=d.filter(h=>!h.disabled&&h.value==="pml");u.forEach(h=>Object.assign(c.region.boundaries[h.dataset.face],{layers:null,sigma_scale:1,kappa:1,alpha:0,polynomial:3,alpha_polynomial:0})),s.querySelector("[data-boundary-status]").textContent=u.length?"Supported endpoint CPML profile staged for "+u.length+" selected PML faces. Apply to validate.":"Select at least one PML face first."},s.querySelector("[data-boundary-close]").onclick=()=>s.close(),s.querySelector("[data-boundary-apply]").onclick=async()=>{const u=[...s.querySelectorAll("button,select")],h=u.map(_=>_.disabled);u.forEach(_=>_.disabled=!0);const m=s.querySelector("[data-boundary-status]");m.textContent="Validating boundaries and project…";try{d.forEach(x=>c.region.boundaries[x.dataset.face].kind=x.value);for(const[x,f]of["x","y","z"].map((p,y)=>[p,y]))c.region.boundaries[x+"_min"].kind!=="bloch"&&c.region.boundaries[x+"_max"].kind!=="bloch"&&(c.region.bloch_phase[f]=0);const _=await e("/validate",c);if(n.project!==l||n.mode!=="layout")throw Error("The project changed. Close this dialog and open it again.");i(_.project),s.close()}catch(_){m.textContent=_.message}finally{u.forEach((_,x)=>_.disabled=h[x])}},s.showModal()}return{open:o}}const Ms=n=>structuredClone(n),Nt=n=>String(n??"").replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e]),vs=1024**3,Yv={validating:"Checking setup",preparing_modes:"Preparing port modes",admitting_material:"Checking material and memory limits",rasterizing:"Sampling project materials",calibration_and_forward:"Calibrating ports and solving fields",backward:"Calculating material derivatives",completed:"Results ready"},_d=n=>(n.sources||[]).find(e=>e.enabled!==!1);async function Yn(n,e){var s;const t=await fetch("/api/"+n,e===void 0?{}:{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)}),i=(s=t.headers.get("content-type"))!=null&&s.includes("json")?await t.json():await t.text();if(!t.ok)throw Error(typeof i.detail=="string"?i.detail:JSON.stringify(i.detail||i));return i}function gc(n,e,t="application/json"){const i=URL.createObjectURL(new Blob([n],{type:t})),s=document.createElement("a");s.href=i,s.download=e,s.click(),setTimeout(()=>URL.revokeObjectURL(i),1e3)}function Zv(n){var o,l,c;const e=_d(n),t=(e==null?void 0:e.normal)||"x",i="xyz".indexOf(t),s=((l=(o=n.region)==null?void 0:o.size)==null?void 0:l[i])||4,r=((c=n.region)==null?void 0:c.mesh)||.1,a=d=>Math.round(d/r)*r;return{version:1,project:Ms(n),normal:t,ports:[{name:"left",coordinate_um:a(-s*.15),source_coordinate_um:a(-s*.25),direction:1,mode_indices:[0]},{name:"right",coordinate_um:a(s*.15),source_coordinate_um:a(s*.25),direction:-1,mode_indices:[0]}],num_modes:1,open_ports:null,execution:{device:"cpu",checkpoints:4,gpu_budget_bytes:null,host_budget_bytes:8*vs,resident_budget_bytes:null,network_budget_bytes:256*1024**2,output_budget_bytes:64*1024**2},objective:{output_channel:["right",0],input_channel:["left",0],quantity:"power"},differentiate_materials:[]}}function Jv(n){var i;if((n==null?void 0:n.version)!==1||!((i=n.project)!=null&&i.region)||!Array.isArray(n.ports)||n.ports.length!==2||!n.execution||!["x","y","z"].includes(n.normal))throw Error("Choose a version 1 mode-network setup, not a Project file.");if(n.ports.some(s=>typeof s.name!="string"||!Array.isArray(s.mode_indices)))throw Error("The setup needs two named ports with mode lists.");if(!Array.isArray(n.differentiate_materials))throw Error("The setup needs a material selection list.");const e=s=>typeof s=="number"&&Number.isFinite(s);if(!Array.isArray(n.project.materials)||n.project.materials.some(s=>!s||typeof s.name!="string")||!Array.isArray(n.project.sources)||n.project.sources.some(s=>!s||typeof s!="object"))throw Error("The setup contains an invalid Project.");if(!Number.isInteger(n.num_modes)||n.num_modes<1||n.ports.some(s=>!e(s.coordinate_um)||!e(s.source_coordinate_um)||![1,-1].includes(s.direction)||!s.mode_indices.length||s.mode_indices.some(r=>!Number.isInteger(r)||r<0)))throw Error("Check the port coordinates, directions and mode indices.");const t=n.execution;if(!["cpu","cuda"].includes(t.device)||!Number.isInteger(t.checkpoints)||t.checkpoints<0||["host_budget_bytes","network_budget_bytes","output_budget_bytes"].some(s=>!e(t[s])||t[s]<=0)||["gpu_budget_bytes","resident_budget_bytes"].some(s=>t[s]!==null&&(!e(t[s])||t[s]<=0)))throw Error("The setup contains invalid execution limits.");if(n.open_ports!==null&&(!n.open_ports||!e(n.open_ports.cladding_epsilon)||!e(n.open_ports.mode_budget_bytes)||!e(n.open_ports.confinement_tolerance)||n.open_ports.target_neff!==null&&!e(n.open_ports.target_neff)))throw Error("The setup contains invalid open-guide settings.");if(n.objective!==null&&(!n.objective||!["real","imag","power"].includes(n.objective.quantity)||["input_channel","output_channel"].some(s=>!Array.isArray(n.objective[s])||n.objective[s].length!==2)))throw Error("The setup contains an invalid S objective.");return Ms(n)}async function Kv(n,{toast:e=()=>{}}={}){if(!(n!=null&&n.region))throw Error("Open a project before setting up mode ports.");let t=Zv(n),i=0,s=!1,r=null,a=!1,o=null,l=null;const c=new Set,d=document.createElement("dialog");d.className="mode-network-dialog",document.body.append(d);const u=L=>d.querySelector(L),h=L=>{u("[data-status]").textContent=L},m=L=>{h(L.message),e(L.message)},_=()=>t.ports.flatMap(L=>L.mode_indices.map(k=>[L.name,k])),x=()=>_d(t.project),f=(L,k,F,{type:O="number",optional:H=!1,step:$="any"}={})=>`<label>${Nt(L)}<input aria-label="${Nt(L)}" data-path="${k}" type="${O}" value="${Nt(F??"")}" ${O==="number"?`step="${$}"`:""} ${H?"data-optional":""}></label>`,p=(L,k,F,O)=>`<label>${Nt(L)}<select aria-label="${Nt(L)}" data-path="${k}">${O.map(([H,$])=>`<option value="${Nt(H)}" ${String(F)===String(H)?"selected":""}>${Nt($)}</option>`).join("")}</select></label>`;function y(){u("[data-run]").disabled=a||!!r||c.size>0;for(const L of["validate","python","export"])u(`[data-${L}]`).disabled=c.size>0;u("[data-cancel]").disabled=!r&&!a}function v(){i++,l=null,u("[data-results]").replaceChildren(),u("[data-downloads]").replaceChildren(),h(r?"Setup changed. The earlier run is still active; its result will not replace this setup.":"Setup changed. Validate before running.")}function g(L,k){const F=L.split(".");let O=t;for(const H of F.slice(0,-1))O=O[H];O[F.at(-1)]=k}function E(){const L=_().map(k=>[JSON.stringify(k),`${k[0]} · mode ${k[1]}`]);return`<label><input type="checkbox" data-objective ${t.objective?"checked":""}> Evaluate a selected S entry</label>${t.objective?p("S quantity","objective.quantity",t.objective.quantity,[["power","Power |S|²"],["real","Real S"],["imag","Imaginary S"]])+p("Output channel","objective.output_channel",JSON.stringify(t.objective.output_channel),L)+p("Input channel","objective.input_channel",JSON.stringify(t.objective.input_channel),L):""}`}function T(){const L=x(),k=t.project.materials||[];d.innerHTML=`<header><div><h2>Mode ports</h2><p>Two opposing fixed-mode ports · ${Nt(t.normal)} direction</p></div><button data-close>Close</button></header>
   <p>Closing this window cancels its active run. This setup uses its own copy of the current project. Main-scene edits do not change it. Mode profiles and port sections stay fixed; selected material derivatives apply only in the allowed interior.</p>
   <div class="mode-network-grid"><fieldset><legend>Port phase planes</legend>${t.ports.map((F,O)=>`<section class="mode-port-row"><h3>${O?"Right port · inward −":"Left port · inward +"}</h3>${f(`${O?"Right":"Left"} port name`,`ports.${O}.name`,F.name,{type:"text"})}${f(`${O?"Right":"Left"} phase plane (µm)`,`ports.${O}.coordinate_um`,F.coordinate_um)}${f(`${O?"Right":"Left"} source plane (µm)`,`ports.${O}.source_coordinate_um`,F.source_coordinate_um)}${f(`${O?"Right":"Left"} mode indices`,`ports.${O}.mode_indices`,F.mode_indices.join(", "),{type:"text"})}</section>`).join("")}
   ${f("Number of solved modes","num_modes",t.num_modes,{step:1})}<p>Phase planes and sources must align with the grid. Sources lie outside the two phase planes.</p></fieldset>
   <fieldset><legend>Guide and illumination</legend>${p("Transverse boundary","boundary",t.open_ports?"open":"periodic",[["periodic","Periodic cell"],["open","Open guide with PML"]])}
   ${t.open_ports?f("Cladding permittivity","open_ports.cladding_epsilon",t.open_ports.cladding_epsilon)+f("Target effective index","open_ports.target_neff",t.open_ports.target_neff,{optional:!0})+f("Mode budget (GiB)","open_ports.mode_budget_bytes",t.open_ports.mode_budget_bytes/vs)+f("Maximum tail fraction","open_ports.confinement_tolerance",t.open_ports.confinement_tolerance):""}
   <p>Propagation normal: <strong>${Nt(t.normal)}</strong>, from the enabled source. Boundary choices must match the project.</p>
   ${L?f("Carrier wavelength (µm)","carrier",L.wavelength)+f("Pulse cycles","cycles",L.pulse_cycles??2):"<p>Add one enabled plane source in the main project, then reopen this setup.</p>"}
   ${f("Time steps","project.region.steps",t.project.region.steps,{step:1})}<p>Requires one soft Gaussian plane source. Material, source and boundary support are checked by validation.</p></fieldset>
   <fieldset><legend>Execution</legend>${p("Compute device","execution.device",t.execution.device,[["cpu","CPU"],["cuda","CUDA GPU"]])}${f("Checkpoints","execution.checkpoints",t.execution.checkpoints,{step:1})}
   ${[["Host budget (GiB)","host_budget_bytes"],["GPU budget (GiB)","gpu_budget_bytes"],["Resident budget (GiB)","resident_budget_bytes"],["Network budget (GiB)","network_budget_bytes"],["Output budget (GiB)","output_budget_bytes"]].map(([F,O])=>f(F,`execution.${O}`,t.execution[O]==null?null:t.execution[O]/vs,{optional:["gpu_budget_bytes","resident_budget_bytes"].includes(O)})).join("")}<p>Blank GPU or resident limits use backend defaults. Limits include the separately admitted solver and fixed mode preparation.</p></fieldset>
   <fieldset><legend>Objective and material derivatives</legend><div data-objective-controls>${E()}</div><h3>Differentiate permittivity</h3>${k.map(F=>`<label class="mode-material"><input type="checkbox" data-material="${Nt(F.name)}" ${t.differentiate_materials.includes(F.name)?"checked":""}> ${Nt(F.name)} <small>${Nt(F.model||"dielectric")}</small></label>`).join("")||"<p>No named materials in this project.</p>"}<p>Choose an objective to request material derivatives. Fixed source, port and PML regions are excluded. This does not differentiate the eigenmodes.</p></fieldset></div>
   <div class="mode-network-actions"><button data-import>Import setup</button><button data-export>Export setup JSON</button><button data-python>Export Python</button><input data-file type="file" accept=".json,application/json" hidden><button data-validate>Validate setup</button><button data-run>Run mode network</button><button data-cancel>Cancel run</button></div>
   <p data-status role="status">Ready to validate. Validation does not run the field simulation.</p><div data-results></div><div data-downloads></div>`,S(),y()}function S(){d.querySelectorAll("[data-path]").forEach(L=>{const k=F=>{try{const O=L.dataset.path;let H=L.value;if(L.type==="number"){if(H===""&&L.hasAttribute("data-optional"))H=null;else{if(H.trim()===""||!Number.isFinite(Number(H)))throw Error("Enter a finite number.");H=Number(H)}O.endsWith("_bytes")&&H!==null&&(H=Math.round(H*vs))}if(O==="boundary")t.open_ports=H==="open"?{cladding_epsilon:(t.project.region.background_index||1)**2,mode_budget_bytes:2*vs,target_neff:null,confinement_tolerance:1e-4}:null;else if(O.endsWith("mode_indices")){if(H=H.split(",").map($=>$.trim()),H.some($=>!/^\d+$/.test($)))throw Error("Enter nonnegative mode indices separated by commas.");g(O,H.map(Number))}else O.startsWith("objective.")&&O.endsWith("_channel")?g(O,JSON.parse(H)):O==="carrier"?x().wavelength=H:O==="cycles"?x().pulse_cycles=H:g(O,H);if(O.startsWith("ports.")&&t.objective){const $=_();t.objective.output_channel=$.find(ee=>JSON.stringify(ee)===JSON.stringify(t.objective.output_channel))||$.at(-1),t.objective.input_channel=$.find(ee=>JSON.stringify(ee)===JSON.stringify(t.objective.input_channel))||$[0]}c.delete(O),v(),y(),F&&c.size===0&&(O==="boundary"||O.startsWith("ports."))&&(T(),h("Setup changed. Validate before running."))}catch(O){c.add(L.dataset.path),v(),y(),m(O)}};L.addEventListener("input",()=>k(!1)),L.addEventListener("change",()=>k(!0))}),u("[data-objective]").onchange=L=>{t.objective=L.target.checked?{output_channel:_().at(-1),input_channel:_()[0],quantity:"power"}:null,v(),T()},d.querySelectorAll("[data-material]").forEach(L=>L.onchange=()=>{t.differentiate_materials=[...d.querySelectorAll("[data-material]:checked")].map(k=>k.dataset.material),v()}),u("[data-close]").onclick=()=>d.close(),u("[data-export]").onclick=()=>gc(JSON.stringify(t,null,2),"mode-network-v1.json"),u("[data-import]").onclick=()=>u("[data-file]").click(),u("[data-file]").onchange=async L=>{const k=L.target.files[0];if(!k)return;const F=++i;try{const O=Jv(JSON.parse(await k.text()));if(s||F!==i)return;t=O,c.clear(),v(),T(),h("Setup imported. Validate before running.")}catch(O){!s&&F===i&&m(O)}finally{L.target.value=""}},u("[data-validate]").onclick=()=>A(),u("[data-python]").onclick=async()=>{const L=i,k=Ms(t);try{const F=await Yn("mode-networks/python",k);if(s||L!==i)return;const O=typeof F=="string"?F:F.python;if(typeof O!="string")throw Error("Python export returned no source.");gc(O,"mode_network.py","text/x-python"),h("Python exported for this setup.")}catch(F){!s&&L===i&&m(F)}},u("[data-run]").onclick=R,u("[data-cancel]").onclick=U}async function A(){const L=i,k=Ms(t);h("Validating setup…");try{const F=await Yn("mode-networks/validate",k);if(s||L!==i)return;l=JSON.stringify(k),h(`Setup validated. ${F.summary||"Ready for an explicitly requested run."}`)}catch(F){!s&&L===i&&m(F)}}function M(L){if(!Array.isArray(L.channels)||!Array.isArray(L.s_real)||!Array.isArray(L.s_imag))throw Error("The completed job has no S matrix.");const k=O=>`${O[0]} · ${O[1]}`,F=O=>Number(O).toPrecision(6);u("[data-results]").innerHTML=`<h3>Complex S matrix</h3><p>Rows: outgoing channel. Columns: incident channel. Phase planes: ${Nt((L.phase_planes_um||[]).join(", "))} µm.</p><div class="mode-network-table"><table><thead><tr><th>Output / input</th>${L.channels.map(O=>`<th>${Nt(k(O))}</th>`).join("")}</tr></thead><tbody>${L.channels.map((O,H)=>`<tr><th>${Nt(k(O))}</th>${L.channels.map(($,ee)=>{const pe=L.s_real[H][ee],ge=L.s_imag[H][ee];return`<td>${F(pe)} ${ge<0?"−":"+"} ${F(Math.abs(ge))}i<small>|S|² ${F(pe*pe+ge*ge)}</small></td>`}).join("")}</tr>`).join("")}</tbody></table></div><p>Selected objective: ${L.objective==null?"Not requested":F(L.objective)}</p><h3>Material permittivity derivatives</h3>${Object.entries(L.material_gradients||{}).length?`<table><thead><tr><th>Material</th><th>d objective / d epsilon</th></tr></thead><tbody>${Object.entries(L.material_gradients).map(([O,H])=>`<tr><td>${Nt(O)}</td><td>${F(H)}</td></tr>`).join("")}</tbody></table>`:"<p>No material derivatives requested.</p>"}<details><summary>Run identity and preparation</summary><p>Request digest: <code data-request-digest>${Nt(L.request_digest||"Unavailable")}</code></p><pre>${Nt(JSON.stringify({modes:L.mode_summaries,admission:L.admission},null,2))}</pre></details>`}async function b(L){var k,F,O;if(!(s||r!==L))try{const H=await Yn(`mode-network-jobs/${encodeURIComponent(L.id)}`);if(s||r!==L)return;const $=["completed","failed","cancelled","canceled"].includes(H.status);if(L.generation===i){const ee=typeof H.progress=="string"?H.progress:((k=H.progress)==null?void 0:k.message)||Yv[(F=H.progress)==null?void 0:F.phase]||((O=H.progress)==null?void 0:O.phase);h(`${H.status}${ee?" · "+ee:""}`),H.status==="completed"&&(M(H.result),u("[data-downloads]").innerHTML=`<a href="/api/mode-network-jobs/${encodeURIComponent(L.id)}/download" download>Download NPZ</a> <a href="/api/mode-network-jobs/${encodeURIComponent(L.id)}/s.csv" download>Download S CSV</a>`),H.status==="failed"&&h(`Failed: ${typeof H.error=="string"?H.error:JSON.stringify(H.error||"See server log")}`)}else h($?"Earlier run finished. Validate and run the edited setup when ready.":"Earlier setup is still running. Cancel it before starting this setup.");if($){r=null,y();return}o=setTimeout(()=>b(L),750)}catch(H){!s&&r===L&&(m(H),o=setTimeout(()=>b(L),2e3))}}async function R(){if(r||a)return;const L=i,k=Ms(t);a=!0,y();try{if(l!==JSON.stringify(k)&&(h("Validating before submission…"),await Yn("mode-networks/validate",k)),s||L!==i)return;h("Submitting to the shared queue…");const F=await Yn("mode-network-jobs",k);if(!F.id)throw Error("Job submission returned no identifier.");if(s||L!==i){await Yn(`mode-network-jobs/${encodeURIComponent(F.id)}/cancel`,{});return}r={id:F.id,generation:L},h(F.status||"queued"),b(r)}catch(F){!s&&L===i&&m(F)}finally{a=!1,s||y()}}async function U(){if(a&&!r){i++,h("Submission cancelled. Any accepted worker will be stopped.");return}if(!r)return;const L=r;try{await Yn(`mode-network-jobs/${encodeURIComponent(L.id)}/cancel`,{}),!s&&r===L&&h("Cancellation requested. Waiting for the worker to stop.")}catch(k){s||m(k)}}return d.addEventListener("close",()=>{s=!0,i++,clearTimeout(o),r&&Yn(`mode-network-jobs/${encodeURIComponent(r.id)}/cancel`,{}).catch(()=>{}),d.remove()},{once:!0}),T(),d.showModal(),d}const Qv={Waves:su,FolderOpen:Bd,Save:Zd,FileCode2:kd,Box:Dd,Cylinder:Od,Circle:Nd,Orbit:$d,Scan:Jd,Radio:Xd,MoveRight:Vd,Activity:Ld,Copy:Fd,Trash2:nu,Maximize:Gd,PencilRuler:Wd,Play:jd,Square:eu,Settings2:Kd,Undo2:iu,Redo2:qd,GitCommitHorizontal:Hd,CircleDot:Ud,Shapes:Qd,ChartNoAxesCombined:Id,Terminal:tu,Download:zd,RefreshCw:Yd};try{for(const n of Object.keys(localStorage)){if(!n.startsWith("photonweave."))continue;const e="torchfdtd."+n.slice(12);localStorage.getItem(e)===null&&localStorage.setItem(e,localStorage.getItem(n))}}catch{}const ye=n=>document.querySelector(n),ni=n=>[...document.querySelectorAll(n)],ut=n=>String(n).replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e]),Be=n=>`<i data-lucide="${n}"></i>`,N={project:null,selected:"fdtd",mode:"layout",snap:!0,history:[],future:[],job:null,results:null,frame:0,tab:"geometry",bottom:"messages",dirty:!1};let st,bn,_c,ki,Jt;const Aa=[];ye("#app").innerHTML=`
<header><div class="brand"><span class="brand-mark">${Be("waves")}</span><strong>TorchFDTD</strong><span class="product">Workbench</span></div><div class="project-title" id="project-title"></div><div class="connection" id="connection"><span class="dot"></span>Connecting to solver…</div></header>
<nav class="menubar"><button data-action="new">File</button><button data-action="undo">Edit</button><button data-action="fit">View</button><button data-action="materials">Materials</button><button data-action="region">Simulation</button><button data-action="inverse-design">Inverse design</button><button data-action="mode-ports">Mode ports</button><button data-action="capabilities">Feature checklist</button><button data-action="flux-results">Flux results</button><button data-action="help">Help</button><span class="version">DEVELOPMENT</span></nav>
<div class="ribbon-tabs"><button class="active" data-ribbon="design">Design</button><button data-ribbon="simulation">FDTD</button><button data-ribbon="view">View</button><span class="ribbon-note">Geometry and wavelength in µm</span></div>
<div class="ribbon">
 <div class="tool-group"><div class="tool-row"><button class="tool" data-action="open">${Be("folder-open")}<span>Open</span></button><button class="tool" data-action="save">${Be("save")}<span>Save</span></button><button class="tool" data-action="fsp">${Be("folder-open")}<span>FSP inspect</span></button><button class="tool editable" data-action="fsp-native">${Be("folder-open")}<span>FSP → GPU</span></button><button class="tool editable" data-action="gds">${Be("folder-open")}<span>GDS</span></button><button class="tool" data-action="python">${Be("file-code-2")}<span>Python</span></button></div><label>Project</label></div>
 <div class="tool-group"><div class="tool-row"><button class="tool editable" data-add="rectangle">${Be("box")}<span>Rectangle</span></button><button class="tool editable" data-add="circle">${Be("cylinder")}<span>Circle</span></button><button class="tool editable" data-add="ring">${Be("circle")}<span>Ring</span></button><button class="tool editable" data-add="sphere">${Be("orbit")}<span>Sphere</span></button><button class="tool editable" data-add="polygon">${Be("shapes")}<span>Polygon</span></button></div><label>Structures</label></div>
 <div class="tool-group"><div class="tool-row"><button class="tool" data-action="region">${Be("scan")}<span>FDTD region</span></button><button class="tool editable" data-add="point">${Be("radio")}<span>Dipole</span></button><button class="tool editable" data-add="plane">${Be("move-right")}<span>Sheet source</span></button><button class="tool editable" data-add="tfsf">${Be("scan")}<span>TFSF box</span></button><button class="tool editable" data-add="monitor">${Be("activity")}<span>Time monitor</span></button><button class="tool editable" data-add="field">${Be("activity")}<span>DFT / Flux</span></button></div><label>Simulation objects</label></div>
 <div class="tool-group"><div class="tool-row"><button class="tool editable" data-action="duplicate">${Be("copy")}<span>Duplicate</span></button><button class="tool editable" data-action="delete">${Be("trash-2")}<span>Delete</span></button><button class="tool" data-action="fit">${Be("maximize")}<span>Fit view</span></button></div><label>Edit & view</label></div>
 <div class="tool-group run-tools"><div class="tool-row"><button class="tool" id="layout-button" data-action="layout">${Be("pencil-ruler")}<span>Layout</span></button><button class="tool run" id="run-button" data-action="run">${Be("play")}<span>Run</span></button><button class="tool stop" id="stop-button" data-action="stop" disabled>${Be("square")}<span>Stop</span></button></div><label>Run simulation</label></div>
</div>
<main>
 <aside class="left-panel"><div class="panel-heading">Objects Tree <span id="object-count"></span></div><div class="tree-tools"><button data-action="region" title="Edit selected object">${Be("settings-2")}</button><button data-action="undo" title="Undo (Ctrl+Z)">${Be("undo-2")}</button><button data-action="redo" title="Redo (Ctrl+Y)">${Be("redo-2")}</button><label><input type="checkbox" id="snap" checked> Snap</label></div><div id="tree"></div><div class="panel-heading results-heading">Results View</div><div id="results-tree" class="results-tree"><div class="muted empty-hint">Select Run to calculate fields<br>and monitor signals.</div></div><div class="left-footer"><span class="eyebrow">EXAMPLE PROJECTS</span><button data-example="waveguide">${Be("git-commit-horizontal")}SiN waveguide<span>2D</span></button><button data-example="scatterer">${Be("circle-dot")}Cylinder scattering<span>2D</span></button><button data-example="3d">${Be("orbit")}Dielectric sphere<span>3D</span></button><button data-example="pmc">${Be("box")}PMC cavity<span>3D</span></button></div></aside>
 <section class="workspace"><div class="workspace-tabs"><button class="active" data-tab="geometry">${Be("shapes")} Layout editor</button><button data-tab="fields">${Be("chart-no-axes-combined")} Field visualizer</button><span class="mode-badge" id="mode-badge">LAYOUT</span></div><div id="viewports" class="viewports"></div><div id="field-view" hidden><div class="field-tools"><strong id="field-label">Ez · XY plane</strong><span id="frame-label">No data</span><button data-action="playback" title="Animate stored frames">${Be("play")}</button><input type="range" id="frame-slider" min="0" max="0" value="0"><button data-action="download">${Be("download")} NPZ</button></div><canvas id="field-canvas"></canvas><div class="plot-title"><strong>Point monitor</strong><select id="plot-monitor" aria-label="Plot monitor"></select><select id="plot-axis" aria-label="Spectrum axis" hidden><option value="frequency">Frequency</option><option value="wavelength">Wavelength</option></select><button data-plot="time" class="active">Time signal</button><button data-plot="spectrum">Field spectrum</button><button data-action="csv">${Be("download")} CSV</button></div><canvas id="monitor-canvas"></canvas></div>
 <section class="bottom-panel"><div class="bottom-tabs"><button class="active" data-bottom="messages">${Be("terminal")} Simulation log <span id="log-count"></span></button><button data-bottom="python">${Be("file-code-2")} Python script</button><div class="bottom-actions"><button data-action="export-python">Export .py</button></div></div><div id="messages" role="log"></div><textarea id="python-editor" spellcheck="false" readonly hidden aria-label="Generated Python script"></textarea></section></section>
 <aside class="right-panel"><div class="panel-heading">Object properties <span id="property-type"></span></div><div id="properties"></div><div class="mesh-card"><div><span class="eyebrow">SIMULATION SUMMARY</span><button data-action="validate" title="Validate mesh and geometry">${Be("refresh-cw")}</button></div><div id="mesh-summary">Validating project…</div></div></aside>
</main>
<footer><span id="status-text"><span class="dot"></span>Ready</span><span id="footer-grid"></span><div class="progress-track"><div id="progress-bar"></div></div><span id="progress-label"></span><span id="footer-device">Solver connecting</span></footer>
<input id="file-input" type="file" accept=".json,.fsp" hidden><dialog id="dialog"><div id="dialog-content"></div></dialog><div id="toast" role="alert" hidden></div>`;function zs(){ru({icons:Qv,attrs:{"stroke-width":1.65}})}function At(n,e="info"){Aa.push({text:n,kind:e,time:new Date().toLocaleTimeString("en-GB")}),ye("#messages").innerHTML=Aa.slice(-100).map(t=>`<div class="log ${t.kind}"><time>${t.time}</time><span>${ut(t.text)}</span></div>`).join(""),ye("#messages").scrollTop=ye("#messages").scrollHeight,ye("#log-count").textContent=Aa.length}function Bt(n){ye("#toast").textContent=n,ye("#toast").hidden=!1,setTimeout(()=>ye("#toast").hidden=!0,5e3)}async function yt(n,e){var i;const t=await fetch("/api"+n,e===void 0?{}:{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});if(!t.ok){let s;try{s=await t.json()}catch{throw Error(`Server returned ${t.status}`)}throw Error(Array.isArray(s.detail)?s.detail.map(r=>r.loc.join(".")+": "+r.msg).join(`
`):s.detail||`Server returned ${t.status}`)}return(i=t.headers.get("content-type"))!=null&&i.includes("json")?t.json():t.text()}function Ss(){return[...N.project.structures,...N.project.sources,...N.project.monitors].find(n=>n.id===N.selected)}function wo(n){return N.project.structures.some(e=>e.id===n)?"structures":N.project.sources.some(e=>e.id===n)?"sources":"monitors"}function _t(){N.history.push(JSON.stringify(N.project)),N.history.length>80&&N.history.shift(),N.future=[]}function ct(){N.dirty=!0;try{localStorage.setItem("torchfdtd.project.v1",JSON.stringify(N.project))}catch{Bt("Browser storage is full. Use Save to keep this project before closing or reloading."),At("Automatic browser save failed. Export this project with Save to retain the current settings.","warning")}}function e0(n,e,t=!0){Object.assign([...N.project.structures,...N.project.sources,...N.project.monitors].find(i=>i.id===n)||{},e),t&&(ct(),kt(),Xt(),it())}function Sn(n){N.selected=n,Xt(),kt(),st==null||st.render()}function vn(n){N.mode=n,ye("#mode-badge").textContent=n.toUpperCase(),ye("#mode-badge").className="mode-badge "+n,ni(".editable").forEach(e=>e.disabled=n!=="layout"),ye("#run-button").disabled=n!=="layout",ye("#stop-button").disabled=n!=="running",ye("#layout-button").disabled=n==="running",ni("[data-example]").forEach(e=>e.disabled=n==="running"),kt(),st==null||st.render()}function Xt(){const n=N.project;ye("#project-title").textContent=n.name,ye("#object-count").textContent=n.structures.length+n.sources.length+n.monitors.length+1;const e=(t,i,s="")=>`<button class="tree-row ${N.selected===t.id?"selected":""} ${s}" data-select="${ut(t.id)}"><span class="tree-icon">${Be(i)}</span><span>${ut(t.name)}</span>${t.enabled===!1?"<small>off</small>":""}</button>`;ye("#tree").innerHTML=`<div class="tree-root">${Be("folder-open")} model</div>${e({id:"fdtd",name:"FDTD"},"scan","region-row")}<div class="tree-group">Structures <span>${n.structures.length}</span></div>${n.structures.map(t=>e(t,{rectangle:"box",circle:"cylinder",ring:"circle",sphere:"orbit",polygon:"shapes"}[t.kind])).join("")}<div class="tree-group">Sources <span>${n.sources.length}</span></div>${n.sources.map(t=>e(t,"radio","source-row")).join("")}<div class="tree-group">Monitors <span>${n.monitors.length}</span></div>${n.monitors.map(t=>e(t,"activity","monitor-row")).join("")}`,zs()}function Je(n,e,t,i="",s={}){var r;return`<label class="property-row"><span>${n}</span><div><input aria-label="${n}" data-path="${e}" data-scale="${s.scale||1}" ${s.reciprocal?`data-reciprocal="${s.reciprocal}"`:""} type="number" value="${Number(((r=t.toPrecision)==null?void 0:r.call(t,12))??t)}" step="${s.step||"any"}" ${s.min!==void 0?`min="${s.min}"`:""}><small>${i}</small></div></label>`}function Pt(n,e,t,i){return`<label class="property-row"><span>${n}</span><select aria-label="${n}" data-path="${e}">${i.map(s=>{const[r,a]=Array.isArray(s)?s:[s,s];return`<option value="${ut(r)}" ${r===t?"selected":""}>${ut(a)}</option>`}).join("")}</select></label>`}function Wt(n,e){return`<section class="property-section"><h3>${n}</h3>${e}</section>`}function kt(){var s,r;if(!N.project)return;const n=N.project,e=Ss(),t=n.region;ye("#property-type").textContent=e?e.kind||"monitor":"solver";let i="";if(!e)i=`<div class="object-title">${Be("scan")}<div><strong>FDTD</strong><small>Simulation region</small></div></div>`,i+=Wt("General",Pt("dimension","dimension",t.dimension,[["2d","2D (XY)"],["3d","3D"]])+Pt("resource","backend",t.backend,[["auto","GPU if available"],["cuda","GPU · CUDA"],["cpu","CPU"]])+Pt("precision","precision",t.precision,["float32","float64"])+Pt("CUDA kernel","cuda_kernel",t.cuda_kernel||"torch",[["torch","PyTorch reference"],["fused","Fused Yee / CPML (experimental)"]])+Pt("Frequency monitor kernel","cuda_monitor_kernel",t.cuda_monitor_kernel||"torch",[["torch","PyTorch reference"],["fused","Shared CUDA plane DFT (experimental)"]])),i+=Wt("Geometry",t.size.map((a,o)=>Je("xyz"[o]+" span","size."+o,a,"µm",{min:.01})).join("")),i+=Wt("Mesh settings",Mv(t,Je,Pt,ut)),i+=Wt("Boundary conditions",Je("PML layers","pml_cells",t.pml_cells,"cells",{step:1,min:3})+["x","y",...t.dimension==="3d"?["z"]:[]].map((a,o)=>["min","max"].map(c=>{const d=a+"_"+c,u=t.boundaries[d];return Pt(a+" "+c+" bc","boundaries."+d+".kind",u.kind,[["pml","PML"],["periodic","Periodic"],["bloch","Bloch"],["pec","PEC"],["antisymmetric","Anti-symmetric (PEC)"],["pmc","PMC"],["symmetric","Symmetric (PMC)"]])+(u.kind==="pml"?`<details class="boundary-options"><summary>${a} ${c} PML settings</summary>${Je(a+" "+c+" layers","boundaries."+d+".layers",u.layers??t.pml_cells,"cells",{step:1,min:3})}<label class="enabled-row"><input type="checkbox" data-boundary-default="${d}" ${u.layers===null?"checked":""}> Use default layers</label>${Je("sigma scale","boundaries."+d+".sigma_scale",u.sigma_scale)}${Je("kappa","boundaries."+d+".kappa",u.kappa)}${Je("alpha","boundaries."+d+".alpha",u.alpha)}${Je("polynomial","boundaries."+d+".polynomial",u.polynomial)}${Je("alpha polynomial","boundaries."+d+".alpha_polynomial",u.alpha_polynomial)}</details>`:"")}).join("")+(t.boundaries[a+"_min"].kind==="bloch"?Je("Bloch phase "+a,"bloch_phase."+o,t.bloch_phase[o],"rad"):"")).join("")+Je("background index","background_index",t.background_index,"",{min:1})+'<button data-action="boundary-editor">Edit six faces together</button><p class="property-help">Cyclic boundaries are paired. Bloch phase is the phase gained over one positive unit-cell translation. PMC and magnetic symmetry support PEC/PMC walls or restricted endpoint CPML with point sources/monitors. Use the six-face editor for the supported CPML profile.</p>'),i+=Wt("Simulation time",Je("dt stability factor","courant_factor",t.courant_factor??.99,"",{min:.01})+Je("time steps","steps",t.steps,"",{step:1,min:10})+Je("snapshot every","snapshot_interval",t.snapshot_interval,"steps",{step:1,min:1})),i+=Wt("Termination and diagnostics",$v(t,Je)),i+=Wt("Field output",Pt("component","field",t.field,["Ex","Ey","Ez","Hx","Hy","Hz"])+Pt("plane normal","slice_axis",t.slice_axis,t.dimension==="2d"?["z"]:["x","y","z"])+Je("plane position","slice_position",t.slice_position,"µm")+Pt("field display","complex_display",t.complex_display,[["real","Real"],["imag","Imaginary"],["magnitude","Magnitude"],["phase","Phase (rad)"]]));else{const a=wo(e.id),o=a==="structures",l=a==="sources";i=`<div class="object-title">${Be(o?"box":l?"radio":"activity")}<div><strong>${ut(e.name)}</strong><small>${o?e.kind:l?e.kind+" source":e.kind==="field"?"Frequency / flux monitor":"Point time monitor"}</small></div></div><label class="property-row name-row"><span>name</span><input aria-label="name" data-path="name" value="${ut(e.name)}"></label><label class="enabled-row"><input type="checkbox" data-path="enabled" ${e.enabled?"checked":""}> Enabled in simulation</label>`;const c=e.kind==="field"?[0,1,2].filter(d=>d!=="xyz".indexOf(e.normal)&&(t.dimension==="3d"||d<2)):e.kind==="tfsf"?[0,1,2].filter(d=>t.dimension==="3d"||d<2):e.kind==="rectangle"||e.kind==="plane"?[0,1,2]:["circle","ring","polygon"].includes(e.kind)?[2]:[];if(i+=Wt("Geometry",e.center.map((d,u)=>Je("xyz"[u],"center."+u,d,"µm")).join("")+c.map(d=>Je("xyz"[d]+" span","size."+d,e.size[d],"µm",{min:o?.001:0})).join("")+(["circle","sphere","ring"].includes(e.kind)?Je("radius","radius",e.radius,"µm",{min:.001}):"")+(e.kind==="ring"?Je("inner radius","inner_radius",e.inner_radius,"µm",{min:0}):"")+(o?Cv(e,Je):"")),o&&(i+=Wt("Material",Pt("material","material",e.material,n.materials.map(d=>d.name))+`<div class="static-row">refractive index <b>${(((s=n.materials.find(d=>d.name===e.material))==null?void 0:s.model)||"dielectric")==="dielectric"?(r=n.materials.find(d=>d.name===e.material))==null?void 0:r.index:"dispersive"}</b></div>`+Je("mesh order","mesh_order",e.mesh_order,"",{step:1,min:1})+'<p class="property-help">Lower order takes priority in overlaps. Open Materials to edit dielectric, Drude or Lorentz parameters and inspect n/k.</p>'),i+=Wt("Rotation",Rv(e,Je,Pt))),o){const d=n.structures.findIndex(u=>u.id===e.id);i+=Wt("Structure order",`<button data-action="structure-earlier" ${d===0?"disabled":""}>Move earlier in tree</button><button data-action="structure-later" ${d===n.structures.length-1?"disabled":""}>Move later in tree</button><p class="property-help">When mesh orders are equal, the later structure takes priority in overlaps.</p>`)}if(l){e.time_definition??(e.time_definition="cycles"),e.pulse_length??(e.pulse_length=2e-14),e.pulse_offset??(e.pulse_offset=5e-14),e.phase??(e.phase=0);const d=e.use_global_source?n.global_source:e;i+=Wt("Source settings",Ov(e,t,Je,Pt)+Fv(e,Je,Pt)+`<label class="enabled-row"><input type="checkbox" data-path="use_global_source" ${e.use_global_source?"checked":""} ${n.global_source?"":"disabled"}> Use global source settings</label><button data-action="global-source">Edit global source settings</button>${n.global_source?"":'<p class="property-help">Imported global settings are unavailable. Configure them before enabling inheritance.</p>'}`+(d?`<fieldset ${e.use_global_source?"disabled":""}>`+md(d,Je,Pt)+'<button data-action="source-signal">Load / edit time signal</button></fieldset>':"")+Je("phase","phase",e.phase,"deg")+Je("amplitude","amplitude",e.amplitude,"",{min:.001})+`<button data-action="source-preview">Preview time signal / spectrum</button><p class="property-help">${e.kind==="tfsf"?"Closed box with six-face E/H corrections and a live incident Yee line. Source preview shows the incident field at the entry face.":e.injection==="oneway"?"Normal-incidence discrete E/H plane with an eight-cell incident-line delay. Amplitude scales the incident-line soft drive. Source preview includes both corrections.":e.kind==="plane"?"Bidirectional E/H sheet. Bloch axes apply the unit-cell phase across the sheet.":"Reduced electric or magnetic point excitation. Magnetic sources use the H half-step time. Vector orientation may excite both 2D polarizations."}</p>`)}if(!o&&!l){e.spectrum??(e.spectrum={sampling:"fft",wavelength_start:1.3,wavelength_stop:1.8,frequency_points:101,apodization:"hann",apodization_center:2e-14,apodization_time_width:1e-14});const d=e.use_global_monitor?n.global_monitor:e.spectrum,u=e.use_global_monitor&&e.inherit_apodization!==!1,h=u?d:e.spectrum;i+=Wt("Monitor settings",(e.kind==="field"?jv(e,t,Je,Pt):Pt("component","component",e.component,["Ex","Ey","Ez","Hx","Hy","Hz"])+'<p class="property-help">Records one Yee field component at every time step. DFT downsampling affects spectral processing only.</p>')+Je("DFT time downsample","time_downsample",e.time_downsample||1,"",{min:1,step:1})+`<label class="enabled-row"><input type="checkbox" data-path="use_global_monitor" ${e.use_global_monitor?"checked":""}> Use global monitor settings</label>${e.use_global_monitor?`<label class="enabled-row"><input type="checkbox" data-path="inherit_apodization" ${u?"checked":""}> Inherit global apodization</label>`:""}<button data-action="global-monitor">Edit global monitor settings</button>`),i+=Wt("Frequency / wavelength",`<fieldset ${e.use_global_monitor?"disabled":""}>`+gd(d,Je,Pt,{plane:e.kind==="field"})+'</fieldset><p class="property-help">DFT values are unnormalized field integrals. Power ratios require a matching air reference.</p>'),i+=Wt("Apodization",`<fieldset ${u?"disabled":""}>`+Pt("apodization","spectrum.apodization",h.apodization,[["none","None"],["start","Start"],["end","End"],["full","Full"],...e.kind==="field"?[]:[["hann","Hann (legacy FFT)"]]])+(["start","end","full"].includes(h.apodization)?Je("apodization center","spectrum.apodization_center",h.apodization_center*1e15,"fs",{min:0,scale:1e-15})+Je("apodization time width","spectrum.apodization_time_width",h.apodization_time_width*1e15,"fs",{min:.001,scale:1e-15})+'<p class="property-help">Width is the intensity FWHM of the Gaussian window. Apodized spectra are not normalized transmission or absolute intensity.</p>':"")+"</fieldset>")}}ye("#properties").innerHTML=`<fieldset ${N.mode!=="layout"?"disabled":""}>${i}</fieldset>`,zs(),t0(),ye("#properties").querySelectorAll("[data-path]").forEach(a=>a.addEventListener("change",()=>{var u;if(N.mode!=="layout")return;_t();const o=Ss()||n.region,l=a.dataset.path.split(".");l[0]==="downsample_xyz"&&!o.downsample_xyz&&(o.downsample_xyz=[o.downsample||1,o.downsample||1,o.downsample||1]);let c=o;for(const h of l.slice(0,-1))c=c[h];const d=a.type==="checkbox"?a.checked:a.type==="number"?a.dataset.reciprocal?Number(a.dataset.reciprocal)/Number(a.value):Number(a.value)*Number(a.dataset.scale||1):a.value;if(l.length===1&&n.sources.includes(o)?fd(o,l[0],d):c[l.at(-1)]=d,o===t&&l[0]==="mesh_type"&&d==="graded"&&(t.material_sampling="yee",t.mesh_max=Math.max(t.mesh_max,t.mesh)),o===t&&l[0]==="interface_method"&&d==="subpixel"&&(t.material_sampling="yee"),o===t&&l[0]==="mesh_type"&&d!=="explicit"&&(t.mesh_coordinates=null),n.sources.includes(o)&&["injection","normal"].includes(l[0])&&fc(o,t,{boundaries:!0}),o.kind==="field"&&l[0]==="normal"){const h=o.size.indexOf(0),m="xyz".indexOf(d);h!==m&&(o.size[h]=Math.min(1,t.size[h]/2),o.size[m]=0)}if(l.join(".")==="spectrum.sampling"&&d==="custom"&&!((u=o.spectrum.custom_frequencies_hz)!=null&&u.length)&&(o.spectrum.custom_frequencies_hz=[2e14]),l.join(".")==="spectrum.sampling"&&a.value!=="fft"&&o.spectrum.apodization==="hann"&&(o.spectrum.apodization="none"),l.join(".")==="spectrum.sampling"&&d==="fft"&&(o.spectrum.use_source_limits=!1),o===t&&l[0]==="boundaries"&&l[2]==="kind"){const[h,m]=l[1].split("_"),_=a.value,x=h+"_"+(m==="min"?"max":"min");(["periodic","bloch"].includes(_)||["periodic","bloch"].includes(t.boundaries[x].kind))&&(t.boundaries[x].kind=_),_!=="bloch"&&(t.bloch_phase["xyz".indexOf(h)]=0)}o===t&&l[0]==="dimension"&&t.dimension==="2d"&&(t.slice_axis="z",t.slice_position=0,t.bloch_phase[2]=0,t.boundaries.z_min.kind="pml",t.boundaries.z_max.kind="pml",n.sources.forEach(h=>h.center[2]=0),n.monitors.forEach(h=>{h.center[2]=0,h.kind==="field"&&h.normal==="z"&&(h.normal="x",h.size[0]=0,h.size[2]=1)})),o===t&&l[0]==="dimension"&&t.mesh_type==="explicit"&&(t.mesh_type="uniform",t.mesh_coordinates=null),o===t&&["size","mesh","dimension"].includes(l[0])&&n.sources.forEach(h=>fc(h,t)),ct(),Xt(),st.render(),kt(),it()})),ye("#properties").querySelectorAll("[data-record-family]").forEach(a=>a.onchange=()=>{if(N.mode!=="layout")return;_t();const o=a.dataset.recordFamily,l=o==="record_fields"?["Ex","Ey","Ez","Hx","Hy","Hz"]:["x","y","z"],c=new Set(e[o]??l);a.checked?c.add(a.value):c.delete(a.value),e[o]=l.filter(d=>c.has(d)),ct(),kt(),it()}),ye("#properties").querySelectorAll("[data-source-vector]").forEach(a=>a.onchange=()=>{N.mode==="layout"&&(_t(),e.theta=a.checked?e.component[1]==="z"?0:90:null,e.phi=e.component[1]==="y"?90:0,ct(),kt(),st.render(),it())}),ye("#properties").querySelectorAll("[data-source-family]").forEach(a=>a.onchange=()=>{N.mode==="layout"&&(_t(),e.component=a.value+e.component[1],ct(),kt(),st.render(),it())}),ye("#properties").querySelectorAll("[data-frequency-table]").forEach(a=>a.onchange=()=>{N.mode==="layout"&&(_t(),e.spectrum.custom_frequencies_hz=a.value.trim().split(/[\s,;]+/).filter(Boolean).map(o=>Number(o)*1e12),ct(),it())}),ye("#properties").querySelectorAll("[data-run-field-limit]").forEach(a=>a.onchange=()=>{N.mode==="layout"&&(_t(),t.run_control.field_limit=a.checked?1e6:null,ct(),kt(),it())}),ye("#properties").querySelectorAll("[data-axis-steps]").forEach(a=>a.onchange=()=>{N.mode==="layout"&&(_t(),t.mesh_steps=a.checked?[t.mesh,t.mesh,t.mesh]:null,a.checked&&(t.material_sampling="yee"),ct(),kt(),st.render(),it())}),ye("#properties").querySelectorAll("[data-fixed-dt]").forEach(a=>a.onchange=()=>{N.mode==="layout"&&(_t(),t.time_step_override=a.checked?((Jt==null?void 0:Jt.dt_fs)??.01)*5e-16:null,ct(),kt(),it())})}function t0(){ni("[data-boundary-default]").forEach(n=>n.onchange=()=>{if(N.mode!=="layout")return;_t();const e=N.project.region;e.boundaries[n.dataset.boundaryDefault].layers=n.checked?null:e.pml_cells,ct(),kt(),st.render(),it()})}async function it(){try{return Jt=await yt("/validate",N.project),ye("#mesh-summary").innerHTML=`<strong>${Jt.shape.join(" × ")}</strong><span>${Jt.cells.toLocaleString()} cells · ~${Number(Jt.estimated_memory_mb).toFixed(1)} MB</span>${Jt.mesh_type==="graded"?`<span>${Jt.cell_reduction_percent.toFixed(1)}% fewer cells than uniform</span>`:""}<span>Δt ${Jt.dt_fs.toFixed(4)} fs · ${Jt.duration_fs.toFixed(1)} fs total</span>${Jt.warnings.map(n=>`<p class="warning">${ut(n)}</p>`).join("")}`,ye("#footer-grid").textContent=Jt.shape.join(" × ")+" cells",!0}catch(n){return ye("#mesh-summary").innerHTML=`<p class="warning error">${ut(n.message)}</p>`,!1}}function n0(n){var s;if(N.mode!=="layout"||!N.project||!st)return;_t();const e=crypto.randomUUID(),t={id:e,name:n+"_"+(N.project.structures.length+N.project.sources.length+N.project.monitors.length+1),center:[0,0,0],enabled:!0};if(["rectangle","circle","ring","sphere","polygon"].includes(n))N.project.structures.push(kr({...t,kind:n,size:[1,1,.5],radius:.5,inner_radius:.3,rotation:0,material:((s=N.project.materials.find(r=>r.name.startsWith("SiN")))==null?void 0:s.name)||N.project.materials[0].name,mesh_order:2}));else if(n==="field")N.project.monitors.push({...t,kind:"field",component:"Ez",normal:"x",size:[0,Math.min(1,N.project.region.size[1]/3),N.project.import_provenance&&N.project.region.dimension==="2d"?1:Math.min(1,N.project.region.size[2]/3)],downsample:1,use_global_monitor:!1,spectrum:{sampling:"frequency",wavelength_start:1.3,wavelength_stop:1.8,frequency_points:41,apodization:"none",apodization_center:2e-14,apodization_time_width:1e-14}});else if(n==="monitor")N.project.monitors.push({...t,component:"Ez",...N.project.import_provenance?{spectrum:{sampling:"fft",apodization:"none"}}:{}});else if(n==="tfsf"){const r=N.project.region,a=r.dimension==="2d"?2:3,o=r.size.map((l,c)=>c>=a?0:Math.max(3*r.mesh,Math.min(2,l-2*(Math.max(r.boundaries["xyz"[c]+"_min"].layers??r.pml_cells,r.boundaries["xyz"[c]+"_max"].layers??r.pml_cells)+3)*r.mesh)));N.project.sources.push({...t,kind:n,injection:"oneway",normal:"x",direction:"+",size:o,component:"Ez",wavelength:1.55,amplitude:1,pulse:"gaussian",pulse_cycles:3,incident_pml_cells:96})}else N.project.sources.push({...t,kind:n,size:[0,1,0],component:"Ez",wavelength:1.55,amplitude:1,pulse:"gaussian",pulse_cycles:3});const i=N.project.sources.find(r=>r.id===e);i&&N.project.import_provenance&&Object.assign(i,{time_definition:"standard",pulse_length:2e-14,pulse_offset:5e-14}),ct(),Sn(e),it(),At("Added "+t.name+". Drag in a viewport or edit its properties.")}function vc(n,e,t="application/json"){const i=URL.createObjectURL(new Blob([n],{type:t})),s=document.createElement("a");s.href=i,s.download=e,s.click(),setTimeout(()=>URL.revokeObjectURL(i),1e3)}function Bn(n){N.tab=n,ni("[data-tab]").forEach(e=>e.classList.toggle("active",e.dataset.tab===n)),ye("#viewports").hidden=n!=="geometry",ye("#field-view").hidden=n!=="fields",n==="geometry"?st.render():Hn()}function vd(n){N.bottom=n,ni("[data-bottom]").forEach(e=>e.classList.toggle("active",e.dataset.bottom===n)),ye("#messages").hidden=n!=="messages",ye("#python-editor").hidden=n!=="python",n==="python"&&yt("/python",N.project).then(e=>ye("#python-editor").value=e).catch(e=>Bt(e.message))}function Hn(){var a,o,l;const n=N.project.region,e="xyz".indexOf(n.slice_axis),t=(((o=(a=N.results)==null?void 0:a.summary)==null?void 0:o.actual_size_um)||n.size).filter((c,d)=>d!==e),i=N.results,s=(i==null?void 0:i.frames[N.frame])||N.liveFrame;ye("#field-label").textContent=n.field+" · "+n.complex_display+" · "+["YZ","XZ","XY"][e]+" plane",ye("#frame-label").textContent=i?"Step "+i.frame_steps[N.frame]:"Live field",ye("#frame-slider").max=Math.max(0,((i==null?void 0:i.frames.length)||1)-1),ye("#frame-slider").value=N.frame;const r=N.monitors||[];r.some(c=>c.id===N.plotMonitor)||(N.plotMonitor=(l=r[0])==null?void 0:l.id),ye("#plot-monitor").innerHTML=r.map(c=>`<option value="${ut(c.id)}" ${c.id===N.plotMonitor?"selected":""}>${ut(c.name)} · ${c.component}</option>`).join(""),ye("#plot-axis").hidden=!N.spectrum,Dv(ye("#field-canvas"),s,t,n.field+" "+n.complex_display,n.complex_display==="phase"?Math.PI:i==null?void 0:i.max,n.complex_display==="phase"?"rad":"reduced field"),Os(ye("#monitor-canvas"),r.filter(c=>c.id===N.plotMonitor),N.spectrum,ye("#plot-axis").value==="wavelength")}async function i0(){if(N.mode==="layout"){if(!await it()){Bt("Fix the highlighted project settings before running.");return}try{N.results=null,N.monitors=null,N.liveFrame=null;const n=await yt("/jobs",N.project);N.job=n.id,localStorage.setItem("torchfdtd.activeJob",n.id),vn("running"),Bn("fields"),At("Submitted "+N.project.name+" · "+N.project.region.backend+" · "+N.project.region.precision),Jt.warnings.forEach(e=>At(e,"warning")),Ir()}catch(n){At(n.message,"error"),Bt(n.message)}}}async function Ir(){try{const n=await yt("/jobs/"+N.job),e=n.progress,t=Math.round(100*e.step/e.total);if(ye("#progress-bar").style.width=t+"%",ye("#progress-label").textContent=t+"%",ye("#status-text").textContent=n.status==="queued"?"Queued on solver":n.status==="running"?"Calculating fields…":n.status,N.liveFrame=e.frame,N.tab==="fields"&&Hn(),["completed","cancelled","failed"].includes(n.status)){if(n.status==="failed"){localStorage.removeItem("torchfdtd.activeJob"),vn("analysis"),At(n.error,"error"),Bt(n.error);return}ye("#status-text").textContent="Calculation complete · loading field results…";const i=await yt("/jobs/"+N.job+"/fields");let s=1e-20;i.frames.forEach(r=>r.forEach(a=>a.forEach(o=>s=Math.max(s,Math.abs(o))))),i.max=s,N.results=i,N.frame=Math.max(0,i.frames.length-1),N.monitors=n.monitors,localStorage.removeItem("torchfdtd.activeJob"),vn("analysis"),ye("#status-text").textContent=n.status,ye("#results-tree").innerHTML=`<button data-tab="fields">${Be("chart-no-axes-combined")} ${ut(N.project.region.field)} field snapshots</button>${n.monitors.map(r=>`<button data-tab="fields">${Be("activity")} ${ut(r.name)} · ${r.component}</button>`).join("")}<div class="run-summary"><b>${n.summary.seconds.toFixed(2)} s</b> solver loop<br>${n.summary.backend.toUpperCase()}${n.summary.cuda_graph?" · CUDA graph":""}${n.summary.cuda_kernel==="fused"?" · fused Yee / CPML":""}${n.summary.cuda_monitor_kernel==="fused"?" · shared plane DFT":""}<br>${n.summary.mcells_per_second.toFixed(1)} Mcells/s<br>${n.summary.gpu?ut(n.summary.gpu):"CPU"}<br>${n.summary.auto_shutoff?"Decay threshold reached":n.summary.cancelled?"Cancelled":"Step limit reached"}<br>${n.summary.steps} / ${n.summary.requested_steps??n.summary.steps} steps</div>`,zs(),Hn(),At(`${n.status}: ${n.summary.steps} steps in ${n.summary.seconds.toFixed(3)} s, ${n.summary.mcells_per_second.toFixed(1)} Mcells/s. Setup ${n.summary.setup_seconds.toFixed(2)} s.`),n.summary.warnings.forEach(r=>At(r,"warning"));return}_c=setTimeout(Ir,400)}catch(n){At("Connection lost: "+n.message+". Retrying the same job…","warning"),_c=setTimeout(Ir,2e3)}}function xc(n){ye("#dialog-content").innerHTML=n+'<div class="dialog-actions"><button data-close>Close</button></div>',ye("#dialog").showModal(),zs()}function yc(){a0.open()}const xd=Iv({esc:ut,toast:Bt,log:At}),s0=Uv({esc:ut,toast:Bt,log:At,getProject:()=>N.project,loadProject:async n=>{if(N.mode==="running")throw Error("Wait for the active simulation to finish before opening a scene.");const e=await yt("/validate",n);_t(),N.project=e.project,N.selected="fdtd",N.results=null,N.monitors=null,N.liveFrame=null,N.job=null,ye("#results-tree").innerHTML='<div class="muted empty-hint">Run to calculate the imported scene.</div>',ct(),vn("layout"),Bn("geometry"),Xt(),st.fit(),await it(),At("Opened independently converted FSP scene. Conversion differences are retained with the project.")}}),r0=Nv({esc:ut,toast:Bt,log:At,getProject:()=>N.project,loadProject:async n=>{if(N.mode!=="layout")throw Error("Switch to Layout before importing geometry.");const e=await yt("/validate",n);_t(),N.project=e.project,N.selected="fdtd",N.results=null,N.monitors=null,N.liveFrame=null,N.job=null,ye("#results-tree").innerHTML='<div class="muted empty-hint">Run to calculate the imported scene.</div>',ct(),vn("layout"),Bn("geometry"),Xt(),st.fit(),await it()}}),a0=Hv({state:N,api:yt,esc:ut,toast:Bt,commit:n=>{if(N.mode!=="layout")throw Error("Switch to Layout before editing.");_t(),N.project=n,ct(),kt(),Xt(),st.render(),it()}}),hs=Sv({state:N,api:yt,esc:ut,commit:n=>{if(N.mode!=="layout")throw Error("Switch to Layout before editing.");_t(),N.project=n,ct(),kt(),st.render(),it()}}),Ca=kv({state:N,api:yt,esc:ut,toast:Bt,commit:n=>{if(N.mode!=="layout")throw Error("Switch to Layout before editing.");_t(),N.project=n,ct(),kt(),Xt(),st.render(),it()}}),o0=Pv({state:N,api:yt,esc:ut,commit:n=>{if(N.mode!=="layout")throw Error("Switch to Layout before editing.");_t(),N.project=n,ct(),kt(),Xt(),st.render(),it()}}),l0=Gv({api:yt,esc:ut}),c0=Vv({esc:ut}),bc=Xv({state:N,api:yt,esc:ut,toast:Bt,numeric:Je,dropdown:Pt,commit:n=>{if(N.mode!=="layout")throw Error("Switch to Layout before editing.");_t(),N.project=n,ct(),kt(),Xt(),st.render(),it()}}),d0=qv({state:N,api:yt,esc:ut,commit:n=>{if(N.mode!=="layout")throw Error("Switch to Layout before editing.");_t(),N.project=n,ct(),kt(),Xt(),st.render(),it()}}),Es={"boundary-editor":()=>d0.open(),gds:()=>{N.mode==="layout"&&r0.open()},"geometry-vertices":()=>o0.open(N.selected),capabilities:()=>l0.open(),"inverse-design":()=>c0.open(),"global-monitor":()=>bc.globals(),"flux-results":()=>bc.flux(),"mesh-preview":()=>hs.open(),"mesh-freeze":()=>hs.freeze(),"mesh-nodes":()=>hs.editNodes(),"mesh-add":()=>hs.add(),"mesh-remove":n=>hs.remove(Number(n.dataset.index)),"global-source":()=>Ca.globals(),"source-signal":()=>Ca.signal(N.selected),"source-preview":()=>Ca.preview(N.selected),fsp:()=>xd.open(),"fsp-native":()=>{N.mode==="layout"&&s0.open()},new:()=>{N.mode!=="running"&&xc('<h2>Project files</h2><p>Save your current project before opening another design.</p><div class="dialog-buttons"><button data-action="save">Save current project</button><button data-action="open">Open project (.json)</button><button data-action="blank">New empty project</button></div>')},blank:async()=>{if(N.mode==="running")return;_t();const n=await yt("/examples/waveguide");n.name="Untitled",n.structures=[],n.sources=[],n.monitors=[],N.project=n,N.selected="fdtd",N.results=null,N.monitors=null,N.liveFrame=null,ct(),vn("layout"),Bn("geometry"),Xt(),it(),ye("#dialog").close()},save:()=>{vc(JSON.stringify(N.project,null,2),N.project.name.replace(/[^a-z0-9]/gi,"_")+".json"),N.dirty=!1,At("Project saved as JSON. Load the same file from Python with Project.load().")},open:()=>{N.mode!=="running"&&ye("#file-input").click()},region:()=>Sn("fdtd"),fit:()=>st.fit(),materials:yc,undo:()=>{N.mode!=="layout"||!N.history.length||(N.future.push(JSON.stringify(N.project)),N.project=JSON.parse(N.history.pop()),ct(),Sn("fdtd"),it())},redo:()=>{N.mode!=="layout"||!N.future.length||(N.history.push(JSON.stringify(N.project)),N.project=JSON.parse(N.future.pop()),ct(),Sn("fdtd"),it())},delete:()=>{if(N.mode!=="layout"||!Ss())return;_t();const n=wo(N.selected);N.project[n]=N.project[n].filter(e=>e.id!==N.selected),ct(),Sn("fdtd"),it()},duplicate:()=>{if(N.mode!=="layout"||!Ss())return;_t();const n=structuredClone(Ss());n.id=crypto.randomUUID(),n.name+="_copy",n.center[0]+=.2,N.project[wo(N.selected)].push(n),ct(),Sn(n.id),it()},"structure-earlier":()=>Mc(-1),"structure-later":()=>Mc(1),layout:()=>{N.mode!=="running"&&(N.results=null,N.liveFrame=null,N.monitors=null,N.job=null,ye("#results-tree").innerHTML='<div class="muted empty-hint">Run again to calculate this layout.</div>',vn("layout"),Bn("geometry"),At("Layout mode. Prior result downloads remain on the solver; the current visualizer was cleared."))},run:i0,stop:async()=>{N.job&&(await yt("/jobs/"+N.job+"/cancel",{}),At("Stop requested. Waiting for the current time step to finish."))},validate:it,python:()=>vd("python"),"export-python":async()=>{vc(await yt("/python",N.project),"simulation.py","text/x-python")},"mode-ports":()=>Kv(N.project,{toast:Bt}),download:()=>{N.results?window.location.href="/api/jobs/"+N.job+"/download":Bt("Run the simulation first.")},csv:()=>{N.results?window.location.href="/api/jobs/"+N.job+(N.spectrum?"/spectra.csv":"/monitors.csv"):Bt("Run the simulation first.")},playback:()=>{var n;if(ki){clearInterval(ki),ki=null;return}(n=N.results)!=null&&n.frames.length&&(ki=setInterval(()=>{if(!N.results){clearInterval(ki),ki=null;return}N.frame=(N.frame+1)%N.results.frames.length,Hn()},80))},"add-material":()=>{_t(),N.project.materials.push({name:"Custom dielectric "+N.project.materials.length,index:1.5,color:"#60bdaa"}),ct(),ye("#dialog").close(),yc()},help:()=>xc("<h2>From Lumerical to TorchFDTD</h2><p>The workbench follows the familiar Objects Tree, CAD views, FDTD region and Layout / Analysis workflow.</p><ol><li>Add a Rectangle, Circle, Ring or Sphere from the Design ribbon.</li><li>Select an object in the tree or any viewport. Drag to move. Edit x, y, z, spans, material and mesh order in Object properties.</li><li>Select FDTD to set dimension, mesh, PML and simulation time steps.</li><li>Add a dipole or bidirectional sheet source and point time monitors.</li><li>Run on the connected solver. Inspect field snapshots, time traces and field spectra.</li><li>Switch to Layout to edit, or export JSON, Python and NPZ results.</li></ol><p><b>Shortcuts:</b> Ctrl+S save · Ctrl+O open · Ctrl+D duplicate · Delete remove · Ctrl+Z undo · Ctrl+Y redo · F fit.</p><p>This is an independent open-source workbench. The FSP inspector reads and edits .fsp settings through an installed, licensed Lumerical API. FSP → GPU independently imports a verified subset of layout settings and displays unsupported settings and numerical differences. Arbitrary FSP execution and .lsf execution remain unimplemented. See Feature checklist for the supported physics and execution modes. PMC cavities currently use point electric sources and point monitors. General material, port and boundary combinations remain under development.</p>")};function Mc(n){if(N.mode!=="layout")return;const e=N.project.structures,t=e.findIndex(s=>s.id===N.selected),i=t+n;t<0||i<0||i>=e.length||(_t(),[e[t],e[i]]=[e[i],e[t]],ct(),Sn(N.selected),it())}document.addEventListener("click",async n=>{var t;const e=n.target.closest("button");if(!(!e||e.disabled||!N.project||!st))try{if(e.dataset.action&&await((t=Es[e.dataset.action])==null?void 0:t.call(Es,e)),e.dataset.add&&n0(e.dataset.add),e.dataset.select&&Sn(e.dataset.select),e.dataset.tab&&Bn(e.dataset.tab),e.dataset.bottom&&vd(e.dataset.bottom),e.dataset.plot&&(N.spectrum=e.dataset.plot==="spectrum",ni("[data-plot]").forEach(i=>i.classList.toggle("active",i===e)),Hn()),e.dataset.example){if(N.mode==="running")return;_t(),N.project=await yt("/examples/"+e.dataset.example),N.results=null,N.monitors=null,N.liveFrame=null,N.selected="fdtd",ct(),vn("layout"),Bn("geometry"),Xt(),st.fit(),it(),At("Opened example: "+N.project.name)}e.dataset.ribbon&&(ni("[data-ribbon]").forEach(i=>i.classList.toggle("active",i===e)),e.dataset.ribbon==="simulation"&&Sn("fdtd"),e.dataset.ribbon==="view"&&st.fit()),e.hasAttribute("data-close")&&ye("#dialog").close()}catch(i){Bt(i.message),At(i.message,"error")}});ye("#file-input").onchange=async n=>{const e=n.target.files[0];if(e){if(e.name.toLowerCase().endsWith(".fsp")){n.target.value="",ye("#dialog").close(),await xd.openFile(e);return}try{const t=JSON.parse(await e.text()),i=await yt("/validate",t);_t(),N.project=i.project,N.selected="fdtd",N.results=null,N.monitors=null,N.liveFrame=null,ct(),vn("layout"),Bn("geometry"),Xt(),st.fit(),it(),ye("#dialog").close(),At("Opened "+e.name)}catch(t){Bt(t.message)}n.target.value=""}};ye("#snap").onchange=n=>N.snap=n.target.checked;ye("#frame-slider").oninput=n=>{N.frame=Number(n.target.value),Hn()};document.addEventListener("keydown",n=>{if(!N.project||!st||document.querySelector("dialog[open]")||["INPUT","TEXTAREA","SELECT"].includes(document.activeElement.tagName))return;const e=n.key.toLowerCase();n.ctrlKey&&["s","o","d","z","y"].includes(e)?(n.preventDefault(),Es[{s:"save",o:"open",d:"duplicate",z:"undo",y:"redo"}[e]]()):n.key==="Delete"?Es.delete():e==="f"&&st.fit()});ye("#plot-monitor").onchange=n=>{N.plotMonitor=n.target.value,Hn()};ye("#plot-axis").onchange=()=>Hn();window.addEventListener("resize",()=>{N.tab==="fields"&&Hn()});async function u0(){try{bn=await yt("/health"),ye(".version").textContent="DEVELOPMENT"+(bn.version?" · "+bn.version:""),ye("#connection").innerHTML=`<span class="dot"></span>${bn.cuda?ut(bn.gpu):"CPU solver"} <small>${ut(bn.hostname)}</small>`,ye("#footer-device").textContent=bn.cuda?"CUDA · "+bn.gpu_memory_gb+" GB":"CPU";const n=localStorage.getItem("torchfdtd.project.v1");try{N.project=n?(await yt("/validate",JSON.parse(n))).project:await yt("/examples/waveguide")}catch{N.project=await yt("/examples/waveguide")}st=new Lv(ye("#viewports"),N,Sn,e0,_t),Xt(),vn("layout"),st.fit(),await it(),At("Connected to "+bn.hostname+" · "+bn.engine+"."),At("Select an object to edit. Add structures, configure FDTD and Run. Python and JSON use the same project model.");const e=localStorage.getItem("torchfdtd.activeJob");if(e)try{const t=await yt("/jobs/"+e);N.project=t.project,N.job=e,vn("running"),Xt(),Bn("fields"),Ir()}catch{localStorage.removeItem("torchfdtd.activeJob")}}catch(n){ye("#connection").textContent="Solver unavailable",At(n.message,"error"),Bt("Cannot connect to the solver. Start torchfdtd serve and reload.")}zs()}ni(".editable").forEach(n=>n.disabled=!0);ye("#run-button").disabled=!0;u0();
