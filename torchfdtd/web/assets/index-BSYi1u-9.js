(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const r of a.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function t(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function i(s){if(s.ep)return;s.ep=!0;const a=t(s);fetch(s.href,a)}})();/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Tc=(n,e,t=[])=>{const i=document.createElementNS("http://www.w3.org/2000/svg",n);return Object.keys(e).forEach(s=>{i.setAttribute(s,String(e[s]))}),t.length&&t.forEach(s=>{const a=Tc(...s);i.appendChild(a)}),i};var Rd=([n,e,t])=>Tc(n,e,t);/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Pd=n=>Array.from(n.attributes).reduce((e,t)=>(e[t.name]=t.value,e),{}),Ld=n=>typeof n=="string"?n:!n||!n.class?"":n.class&&typeof n.class=="string"?n.class.split(" "):n.class&&Array.isArray(n.class)?n.class:"",Dd=n=>n.flatMap(Ld).map(t=>t.trim()).filter(Boolean).filter((t,i,s)=>s.indexOf(t)===i).join(" "),Id=n=>n.replace(/(\w)(\w*)(_|-|\s*)/g,(e,t,i)=>t.toUpperCase()+i.toLowerCase()),Jo=(n,{nameAttr:e,icons:t,attrs:i})=>{var _;const s=n.getAttribute(e);if(s==null)return;const a=Id(s),r=t[a];if(!r)return console.warn(`${n.outerHTML} icon name was not found in the provided icons object.`);const o=Pd(n),[l,c,d]=r,u={...c,"data-lucide":s,...i,...o},h=Dd(["lucide",`lucide-${s}`,o,i]);h&&Object.assign(u,{class:h});const m=Rd([l,u,d]);return(_=n.parentNode)==null?void 0:_.replaceChild(m,n)};/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ht={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"};/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ud=["svg",ht,[["path",{d:"M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Nd=["svg",ht,[["path",{d:"M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"}],["path",{d:"m3.3 7 8.7 5 8.7-5"}],["path",{d:"M12 22V12"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fd=["svg",ht,[["path",{d:"M12 16v5"}],["path",{d:"M16 14v7"}],["path",{d:"M20 10v11"}],["path",{d:"m22 3-8.646 8.646a.5.5 0 0 1-.708 0L9.354 8.354a.5.5 0 0 0-.707 0L2 15"}],["path",{d:"M4 18v3"}],["path",{d:"M8 14v7"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Od=["svg",ht,[["circle",{cx:"12",cy:"12",r:"10"}],["circle",{cx:"12",cy:"12",r:"1"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zd=["svg",ht,[["circle",{cx:"12",cy:"12",r:"10"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const kd=["svg",ht,[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Bd=["svg",ht,[["ellipse",{cx:"12",cy:"5",rx:"9",ry:"3"}],["path",{d:"M3 5v14a9 3 0 0 0 18 0V5"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Hd=["svg",ht,[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}],["polyline",{points:"7 10 12 15 17 10"}],["line",{x1:"12",x2:"12",y1:"15",y2:"3"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gd=["svg",ht,[["path",{d:"M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4"}],["path",{d:"m5 12-3 3 3 3"}],["path",{d:"m9 18 3-3-3-3"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vd=["svg",ht,[["path",{d:"m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $d=["svg",ht,[["circle",{cx:"12",cy:"12",r:"3"}],["line",{x1:"3",x2:"9",y1:"12",y2:"12"}],["line",{x1:"15",x2:"21",y1:"12",y2:"12"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Wd=["svg",ht,[["path",{d:"M8 3H5a2 2 0 0 0-2 2v3"}],["path",{d:"M21 8V5a2 2 0 0 0-2-2h-3"}],["path",{d:"M3 16v3a2 2 0 0 0 2 2h3"}],["path",{d:"M16 21h3a2 2 0 0 0 2-2v-3"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jd=["svg",ht,[["path",{d:"M18 8L22 12L18 16"}],["path",{d:"M2 12H22"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xd=["svg",ht,[["circle",{cx:"12",cy:"12",r:"3"}],["circle",{cx:"19",cy:"5",r:"2"}],["circle",{cx:"5",cy:"19",r:"2"}],["path",{d:"M10.4 21.9a10 10 0 0 0 9.941-15.416"}],["path",{d:"M13.5 2.1a10 10 0 0 0-9.841 15.416"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qd=["svg",ht,[["path",{d:"M13 7 8.7 2.7a2.41 2.41 0 0 0-3.4 0L2.7 5.3a2.41 2.41 0 0 0 0 3.4L7 13"}],["path",{d:"m8 6 2-2"}],["path",{d:"m18 16 2-2"}],["path",{d:"m17 11 4.3 4.3c.94.94.94 2.46 0 3.4l-2.6 2.6c-.94.94-2.46.94-3.4 0L11 17"}],["path",{d:"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"}],["path",{d:"m15 5 4 4"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Yd=["svg",ht,[["polygon",{points:"6 3 20 12 6 21 6 3"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zd=["svg",ht,[["path",{d:"M4.9 19.1C1 15.2 1 8.8 4.9 4.9"}],["path",{d:"M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"}],["circle",{cx:"12",cy:"12",r:"2"}],["path",{d:"M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"}],["path",{d:"M19.1 4.9C23 8.8 23 15.1 19.1 19"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Jd=["svg",ht,[["path",{d:"m15 14 5-5-5-5"}],["path",{d:"M20 9H9.5A5.5 5.5 0 0 0 4 14.5A5.5 5.5 0 0 0 9.5 20H13"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Kd=["svg",ht,[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"}],["path",{d:"M21 3v5h-5"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"}],["path",{d:"M8 16H3v5"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qd=["svg",ht,[["path",{d:"M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"}],["path",{d:"M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"}],["path",{d:"M7 3v4a1 1 0 0 0 1 1h7"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const eu=["svg",ht,[["path",{d:"M3 7V5a2 2 0 0 1 2-2h2"}],["path",{d:"M17 3h2a2 2 0 0 1 2 2v2"}],["path",{d:"M21 17v2a2 2 0 0 1-2 2h-2"}],["path",{d:"M7 21H5a2 2 0 0 1-2-2v-2"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const tu=["svg",ht,[["path",{d:"M20 7h-9"}],["path",{d:"M14 17H5"}],["circle",{cx:"17",cy:"17",r:"3"}],["circle",{cx:"7",cy:"7",r:"3"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const nu=["svg",ht,[["path",{d:"M8.3 10a.7.7 0 0 1-.626-1.079L11.4 3a.7.7 0 0 1 1.198-.043L16.3 8.9a.7.7 0 0 1-.572 1.1Z"}],["rect",{x:"3",y:"14",width:"7",height:"7",rx:"1"}],["circle",{cx:"17.5",cy:"17.5",r:"3.5"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const iu=["svg",ht,[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const su=["svg",ht,[["polyline",{points:"4 17 10 11 4 5"}],["line",{x1:"12",x2:"20",y1:"19",y2:"19"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const au=["svg",ht,[["path",{d:"M3 6h18"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"}],["line",{x1:"10",x2:"10",y1:"11",y2:"17"}],["line",{x1:"14",x2:"14",y1:"11",y2:"17"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ru=["svg",ht,[["path",{d:"M9 14 4 9l5-5"}],["path",{d:"M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ou=["svg",ht,[["path",{d:"M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"}],["path",{d:"M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"}],["path",{d:"M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const lu=({icons:n={},nameAttr:e="data-lucide",attrs:t={}}={})=>{if(!Object.values(n).length)throw new Error(`Please provide an icons object.
If you want to use all the icons you can import it like:
 \`import { createIcons, icons } from 'lucide';
lucide.createIcons({icons});\``);if(typeof document>"u")throw new Error("`createIcons()` only works in a browser environment.");const i=document.querySelectorAll(`[${e}]`);if(Array.from(i).forEach(s=>Jo(s,{nameAttr:e,icons:n,attrs:t})),e==="data-lucide"){const s=document.querySelectorAll("[icon-name]");s.length>0&&(console.warn("[Lucide] Some icons were found with the now deprecated icon-name attribute. These will still be replaced for backwards compatibility, but will no longer be supported in v1.0 and you should switch to data-lucide"),Array.from(s).forEach(a=>Jo(a,{nameAttr:"icon-name",icons:n,attrs:t})))}};/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Co="180",$i={ROTATE:0,DOLLY:1,PAN:2},Bi={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},cu=0,Ko=1,du=2,Ac=1,uu=2,Fn=3,ei=0,Kt=1,fn=2,Kn=0,Wi=1,Qo=2,el=3,tl=4,hu=5,mi=100,pu=101,fu=102,mu=103,gu=104,_u=200,vu=201,xu=202,yu=203,Lr=204,Dr=205,bu=206,Mu=207,Su=208,Eu=209,wu=210,Tu=211,Au=212,Cu=213,Ru=214,Ir=0,Ur=1,Nr=2,Xi=3,Fr=4,Or=5,zr=6,kr=7,Cc=0,Pu=1,Lu=2,Qn=0,Du=1,Iu=2,Uu=3,Nu=4,Fu=5,Ou=6,zu=7,Rc=300,qi=301,Yi=302,Br=303,Hr=304,Ua=306,Gr=1e3,vi=1001,Vr=1002,gn=1003,ku=1004,Hs=1005,En=1006,Ga=1007,xi=1008,An=1009,Pc=1010,Lc=1011,ws=1012,Ro=1013,yi=1014,zn=1015,Is=1016,Po=1017,Lo=1018,Ts=1020,Dc=35902,Ic=35899,Uc=1021,Nc=1022,mn=1023,As=1026,Cs=1027,Fc=1028,Do=1029,Oc=1030,Io=1031,Uo=1033,ya=33776,ba=33777,Ma=33778,Sa=33779,$r=35840,Wr=35841,jr=35842,Xr=35843,qr=36196,Yr=37492,Zr=37496,Jr=37808,Kr=37809,Qr=37810,eo=37811,to=37812,no=37813,io=37814,so=37815,ao=37816,ro=37817,oo=37818,lo=37819,co=37820,uo=37821,ho=36492,po=36494,fo=36495,mo=36283,go=36284,_o=36285,vo=36286,Bu=3200,Hu=3201,zc=0,Gu=1,Jn="",ln="srgb",Zi="srgb-linear",Aa="linear",ot="srgb",wi=7680,nl=519,Vu=512,$u=513,Wu=514,kc=515,ju=516,Xu=517,qu=518,Yu=519,il=35044,sl="300 es",wn=2e3,Ca=2001;class Si{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const s=i[e];if(s!==void 0){const a=s.indexOf(t);a!==-1&&s.splice(a,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const s=i.slice(0);for(let a=0,r=s.length;a<r;a++)s[a].call(this,e);e.target=null}}}const Ht=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],xs=Math.PI/180,xo=180/Math.PI;function es(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Ht[n&255]+Ht[n>>8&255]+Ht[n>>16&255]+Ht[n>>24&255]+"-"+Ht[e&255]+Ht[e>>8&255]+"-"+Ht[e>>16&15|64]+Ht[e>>24&255]+"-"+Ht[t&63|128]+Ht[t>>8&255]+"-"+Ht[t>>16&255]+Ht[t>>24&255]+Ht[i&255]+Ht[i>>8&255]+Ht[i>>16&255]+Ht[i>>24&255]).toLowerCase()}function je(n,e,t){return Math.max(e,Math.min(t,n))}function Zu(n,e){return(n%e+e)%e}function Va(n,e,t){return(1-t)*n+t*e}function ss(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function Yt(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const Ju={DEG2RAD:xs};class oe{constructor(e=0,t=0){oe.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6],this.y=s[1]*t+s[4]*i+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=je(this.x,e.x,t.x),this.y=je(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=je(this.x,e,t),this.y=je(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(je(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(je(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),s=Math.sin(t),a=this.x-e.x,r=this.y-e.y;return this.x=a*i-r*s+e.x,this.y=a*s+r*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class zt{constructor(e=0,t=0,i=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=s}static slerpFlat(e,t,i,s,a,r,o){let l=i[s+0],c=i[s+1],d=i[s+2],u=i[s+3];const h=a[r+0],m=a[r+1],_=a[r+2],x=a[r+3];if(o===0){e[t+0]=l,e[t+1]=c,e[t+2]=d,e[t+3]=u;return}if(o===1){e[t+0]=h,e[t+1]=m,e[t+2]=_,e[t+3]=x;return}if(u!==x||l!==h||c!==m||d!==_){let f=1-o;const p=l*h+c*m+d*_+u*x,M=p>=0?1:-1,v=1-p*p;if(v>Number.EPSILON){const w=Math.sqrt(v),A=Math.atan2(w,p*M);f=Math.sin(f*A)/w,o=Math.sin(o*A)/w}const g=o*M;if(l=l*f+h*g,c=c*f+m*g,d=d*f+_*g,u=u*f+x*g,f===1-o){const w=1/Math.sqrt(l*l+c*c+d*d+u*u);l*=w,c*=w,d*=w,u*=w}}e[t]=l,e[t+1]=c,e[t+2]=d,e[t+3]=u}static multiplyQuaternionsFlat(e,t,i,s,a,r){const o=i[s],l=i[s+1],c=i[s+2],d=i[s+3],u=a[r],h=a[r+1],m=a[r+2],_=a[r+3];return e[t]=o*_+d*u+l*m-c*h,e[t+1]=l*_+d*h+c*u-o*m,e[t+2]=c*_+d*m+o*h-l*u,e[t+3]=d*_-o*u-l*h-c*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,s){return this._x=e,this._y=t,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,s=e._y,a=e._z,r=e._order,o=Math.cos,l=Math.sin,c=o(i/2),d=o(s/2),u=o(a/2),h=l(i/2),m=l(s/2),_=l(a/2);switch(r){case"XYZ":this._x=h*d*u+c*m*_,this._y=c*m*u-h*d*_,this._z=c*d*_+h*m*u,this._w=c*d*u-h*m*_;break;case"YXZ":this._x=h*d*u+c*m*_,this._y=c*m*u-h*d*_,this._z=c*d*_-h*m*u,this._w=c*d*u+h*m*_;break;case"ZXY":this._x=h*d*u-c*m*_,this._y=c*m*u+h*d*_,this._z=c*d*_+h*m*u,this._w=c*d*u-h*m*_;break;case"ZYX":this._x=h*d*u-c*m*_,this._y=c*m*u+h*d*_,this._z=c*d*_-h*m*u,this._w=c*d*u+h*m*_;break;case"YZX":this._x=h*d*u+c*m*_,this._y=c*m*u+h*d*_,this._z=c*d*_-h*m*u,this._w=c*d*u-h*m*_;break;case"XZY":this._x=h*d*u-c*m*_,this._y=c*m*u-h*d*_,this._z=c*d*_+h*m*u,this._w=c*d*u+h*m*_;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+r)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,s=Math.sin(i);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],s=t[4],a=t[8],r=t[1],o=t[5],l=t[9],c=t[2],d=t[6],u=t[10],h=i+o+u;if(h>0){const m=.5/Math.sqrt(h+1);this._w=.25/m,this._x=(d-l)*m,this._y=(a-c)*m,this._z=(r-s)*m}else if(i>o&&i>u){const m=2*Math.sqrt(1+i-o-u);this._w=(d-l)/m,this._x=.25*m,this._y=(s+r)/m,this._z=(a+c)/m}else if(o>u){const m=2*Math.sqrt(1+o-i-u);this._w=(a-c)/m,this._x=(s+r)/m,this._y=.25*m,this._z=(l+d)/m}else{const m=2*Math.sqrt(1+u-i-o);this._w=(r-s)/m,this._x=(a+c)/m,this._y=(l+d)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(je(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const s=Math.min(1,t/i);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,s=e._y,a=e._z,r=e._w,o=t._x,l=t._y,c=t._z,d=t._w;return this._x=i*d+r*o+s*c-a*l,this._y=s*d+r*l+a*o-i*c,this._z=a*d+r*c+i*l-s*o,this._w=r*d-i*o-s*l-a*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const i=this._x,s=this._y,a=this._z,r=this._w;let o=r*e._w+i*e._x+s*e._y+a*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=r,this._x=i,this._y=s,this._z=a,this;const l=1-o*o;if(l<=Number.EPSILON){const m=1-t;return this._w=m*r+t*this._w,this._x=m*i+t*this._x,this._y=m*s+t*this._y,this._z=m*a+t*this._z,this.normalize(),this}const c=Math.sqrt(l),d=Math.atan2(c,o),u=Math.sin((1-t)*d)/c,h=Math.sin(t*d)/c;return this._w=r*u+this._w*h,this._x=i*u+this._x*h,this._y=s*u+this._y*h,this._z=a*u+this._z*h,this._onChangeCallback(),this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),a=Math.sqrt(i);return this.set(s*Math.sin(e),s*Math.cos(e),a*Math.sin(t),a*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class D{constructor(e=0,t=0,i=0){D.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(al.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(al.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,s=this.z,a=e.elements;return this.x=a[0]*t+a[3]*i+a[6]*s,this.y=a[1]*t+a[4]*i+a[7]*s,this.z=a[2]*t+a[5]*i+a[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,a=e.elements,r=1/(a[3]*t+a[7]*i+a[11]*s+a[15]);return this.x=(a[0]*t+a[4]*i+a[8]*s+a[12])*r,this.y=(a[1]*t+a[5]*i+a[9]*s+a[13])*r,this.z=(a[2]*t+a[6]*i+a[10]*s+a[14])*r,this}applyQuaternion(e){const t=this.x,i=this.y,s=this.z,a=e.x,r=e.y,o=e.z,l=e.w,c=2*(r*s-o*i),d=2*(o*t-a*s),u=2*(a*i-r*t);return this.x=t+l*c+r*u-o*d,this.y=i+l*d+o*c-a*u,this.z=s+l*u+a*d-r*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,s=this.z,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*s,this.y=a[1]*t+a[5]*i+a[9]*s,this.z=a[2]*t+a[6]*i+a[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=je(this.x,e.x,t.x),this.y=je(this.y,e.y,t.y),this.z=je(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=je(this.x,e,t),this.y=je(this.y,e,t),this.z=je(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(je(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,s=e.y,a=e.z,r=t.x,o=t.y,l=t.z;return this.x=s*l-a*o,this.y=a*r-i*l,this.z=i*o-s*r,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return $a.copy(this).projectOnVector(e),this.sub($a)}reflect(e){return this.sub($a.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(je(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,s=this.z-e.z;return t*t+i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const s=Math.sin(t)*e;return this.x=s*Math.sin(i),this.y=Math.cos(t)*e,this.z=s*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const $a=new D,al=new zt;class $e{constructor(e,t,i,s,a,r,o,l,c){$e.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,s,a,r,o,l,c)}set(e,t,i,s,a,r,o,l,c){const d=this.elements;return d[0]=e,d[1]=s,d[2]=o,d[3]=t,d[4]=a,d[5]=l,d[6]=i,d[7]=r,d[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,a=this.elements,r=i[0],o=i[3],l=i[6],c=i[1],d=i[4],u=i[7],h=i[2],m=i[5],_=i[8],x=s[0],f=s[3],p=s[6],M=s[1],v=s[4],g=s[7],w=s[2],A=s[5],y=s[8];return a[0]=r*x+o*M+l*w,a[3]=r*f+o*v+l*A,a[6]=r*p+o*g+l*y,a[1]=c*x+d*M+u*w,a[4]=c*f+d*v+u*A,a[7]=c*p+d*g+u*y,a[2]=h*x+m*M+_*w,a[5]=h*f+m*v+_*A,a[8]=h*p+m*g+_*y,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],s=e[2],a=e[3],r=e[4],o=e[5],l=e[6],c=e[7],d=e[8];return t*r*d-t*o*c-i*a*d+i*o*l+s*a*c-s*r*l}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],a=e[3],r=e[4],o=e[5],l=e[6],c=e[7],d=e[8],u=d*r-o*c,h=o*l-d*a,m=c*a-r*l,_=t*u+i*h+s*m;if(_===0)return this.set(0,0,0,0,0,0,0,0,0);const x=1/_;return e[0]=u*x,e[1]=(s*c-d*i)*x,e[2]=(o*i-s*r)*x,e[3]=h*x,e[4]=(d*t-s*l)*x,e[5]=(s*a-o*t)*x,e[6]=m*x,e[7]=(i*l-c*t)*x,e[8]=(r*t-i*a)*x,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,s,a,r,o){const l=Math.cos(a),c=Math.sin(a);return this.set(i*l,i*c,-i*(l*r+c*o)+r+e,-s*c,s*l,-s*(-c*r+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(Wa.makeScale(e,t)),this}rotate(e){return this.premultiply(Wa.makeRotation(-e)),this}translate(e,t){return this.premultiply(Wa.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<9;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Wa=new $e;function Bc(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function Ra(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function Ku(){const n=Ra("canvas");return n.style.display="block",n}const rl={};function Rs(n){n in rl||(rl[n]=!0,console.warn(n))}function Qu(n,e,t){return new Promise(function(i,s){function a(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(a,t);break;default:i()}}setTimeout(a,t)})}const ol=new $e().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),ll=new $e().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function eh(){const n={enabled:!0,workingColorSpace:Zi,spaces:{},convert:function(s,a,r){return this.enabled===!1||a===r||!a||!r||(this.spaces[a].transfer===ot&&(s.r=kn(s.r),s.g=kn(s.g),s.b=kn(s.b)),this.spaces[a].primaries!==this.spaces[r].primaries&&(s.applyMatrix3(this.spaces[a].toXYZ),s.applyMatrix3(this.spaces[r].fromXYZ)),this.spaces[r].transfer===ot&&(s.r=ji(s.r),s.g=ji(s.g),s.b=ji(s.b))),s},workingToColorSpace:function(s,a){return this.convert(s,this.workingColorSpace,a)},colorSpaceToWorking:function(s,a){return this.convert(s,a,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Jn?Aa:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,a=this.workingColorSpace){return s.fromArray(this.spaces[a].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,a,r){return s.copy(this.spaces[a].toXYZ).multiply(this.spaces[r].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,a){return Rs("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(s,a)},toWorkingColorSpace:function(s,a){return Rs("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(s,a)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[Zi]:{primaries:e,whitePoint:i,transfer:Aa,toXYZ:ol,fromXYZ:ll,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:ln},outputColorSpaceConfig:{drawingBufferColorSpace:ln}},[ln]:{primaries:e,whitePoint:i,transfer:ot,toXYZ:ol,fromXYZ:ll,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:ln}}}),n}const tt=eh();function kn(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function ji(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let Ti;class th{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{Ti===void 0&&(Ti=Ra("canvas")),Ti.width=e.width,Ti.height=e.height;const s=Ti.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),i=Ti}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Ra("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const s=i.getImageData(0,0,e.width,e.height),a=s.data;for(let r=0;r<a.length;r++)a[r]=kn(a[r]/255)*255;return i.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(kn(t[i]/255)*255):t[i]=kn(t[i]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let nh=0;class No{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:nh++}),this.uuid=es(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let a;if(Array.isArray(s)){a=[];for(let r=0,o=s.length;r<o;r++)s[r].isDataTexture?a.push(ja(s[r].image)):a.push(ja(s[r]))}else a=ja(s);i.url=a}return t||(e.images[this.uuid]=i),i}}function ja(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?th.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let ih=0;const Xa=new D;class Qt extends Si{constructor(e=Qt.DEFAULT_IMAGE,t=Qt.DEFAULT_MAPPING,i=vi,s=vi,a=En,r=xi,o=mn,l=An,c=Qt.DEFAULT_ANISOTROPY,d=Jn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:ih++}),this.uuid=es(),this.name="",this.source=new No(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=a,this.minFilter=r,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new oe(0,0),this.repeat=new oe(1,1),this.center=new oe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new $e,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Xa).x}get height(){return this.source.getSize(Xa).y}get depth(){return this.source.getSize(Xa).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const i=e[t];if(i===void 0){console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Rc)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Gr:e.x=e.x-Math.floor(e.x);break;case vi:e.x=e.x<0?0:1;break;case Vr:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Gr:e.y=e.y-Math.floor(e.y);break;case vi:e.y=e.y<0?0:1;break;case Vr:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Qt.DEFAULT_IMAGE=null;Qt.DEFAULT_MAPPING=Rc;Qt.DEFAULT_ANISOTROPY=1;class Tt{constructor(e=0,t=0,i=0,s=1){Tt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,s){return this.x=e,this.y=t,this.z=i,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,a=this.w,r=e.elements;return this.x=r[0]*t+r[4]*i+r[8]*s+r[12]*a,this.y=r[1]*t+r[5]*i+r[9]*s+r[13]*a,this.z=r[2]*t+r[6]*i+r[10]*s+r[14]*a,this.w=r[3]*t+r[7]*i+r[11]*s+r[15]*a,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,s,a;const l=e.elements,c=l[0],d=l[4],u=l[8],h=l[1],m=l[5],_=l[9],x=l[2],f=l[6],p=l[10];if(Math.abs(d-h)<.01&&Math.abs(u-x)<.01&&Math.abs(_-f)<.01){if(Math.abs(d+h)<.1&&Math.abs(u+x)<.1&&Math.abs(_+f)<.1&&Math.abs(c+m+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const v=(c+1)/2,g=(m+1)/2,w=(p+1)/2,A=(d+h)/4,y=(u+x)/4,E=(_+f)/4;return v>g&&v>w?v<.01?(i=0,s=.707106781,a=.707106781):(i=Math.sqrt(v),s=A/i,a=y/i):g>w?g<.01?(i=.707106781,s=0,a=.707106781):(s=Math.sqrt(g),i=A/s,a=E/s):w<.01?(i=.707106781,s=.707106781,a=0):(a=Math.sqrt(w),i=y/a,s=E/a),this.set(i,s,a,t),this}let M=Math.sqrt((f-_)*(f-_)+(u-x)*(u-x)+(h-d)*(h-d));return Math.abs(M)<.001&&(M=1),this.x=(f-_)/M,this.y=(u-x)/M,this.z=(h-d)/M,this.w=Math.acos((c+m+p-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=je(this.x,e.x,t.x),this.y=je(this.y,e.y,t.y),this.z=je(this.z,e.z,t.z),this.w=je(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=je(this.x,e,t),this.y=je(this.y,e,t),this.z=je(this.z,e,t),this.w=je(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(je(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class sh extends Si{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:En,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new Tt(0,0,e,t),this.scissorTest=!1,this.viewport=new Tt(0,0,e,t);const s={width:e,height:t,depth:i.depth},a=new Qt(s);this.textures=[];const r=i.count;for(let o=0;o<r;o++)this.textures[o]=a.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(e={}){const t={minFilter:En,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let s=0,a=this.textures.length;s<a;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=i,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new No(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class bi extends sh{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class Hc extends Qt{constructor(e=null,t=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=gn,this.minFilter=gn,this.wrapR=vi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class ah extends Qt{constructor(e=null,t=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=gn,this.minFilter=gn,this.wrapR=vi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Us{constructor(e=new D(1/0,1/0,1/0),t=new D(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(un.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(un.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=un.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const a=i.getAttribute("position");if(t===!0&&a!==void 0&&e.isInstancedMesh!==!0)for(let r=0,o=a.count;r<o;r++)e.isMesh===!0?e.getVertexPosition(r,un):un.fromBufferAttribute(a,r),un.applyMatrix4(e.matrixWorld),this.expandByPoint(un);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Gs.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Gs.copy(i.boundingBox)),Gs.applyMatrix4(e.matrixWorld),this.union(Gs)}const s=e.children;for(let a=0,r=s.length;a<r;a++)this.expandByObject(s[a],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,un),un.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(as),Vs.subVectors(this.max,as),Ai.subVectors(e.a,as),Ci.subVectors(e.b,as),Ri.subVectors(e.c,as),Gn.subVectors(Ci,Ai),Vn.subVectors(Ri,Ci),ai.subVectors(Ai,Ri);let t=[0,-Gn.z,Gn.y,0,-Vn.z,Vn.y,0,-ai.z,ai.y,Gn.z,0,-Gn.x,Vn.z,0,-Vn.x,ai.z,0,-ai.x,-Gn.y,Gn.x,0,-Vn.y,Vn.x,0,-ai.y,ai.x,0];return!qa(t,Ai,Ci,Ri,Vs)||(t=[1,0,0,0,1,0,0,0,1],!qa(t,Ai,Ci,Ri,Vs))?!1:($s.crossVectors(Gn,Vn),t=[$s.x,$s.y,$s.z],qa(t,Ai,Ci,Ri,Vs))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,un).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(un).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Pn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Pn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Pn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Pn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Pn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Pn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Pn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Pn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Pn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Pn=[new D,new D,new D,new D,new D,new D,new D,new D],un=new D,Gs=new Us,Ai=new D,Ci=new D,Ri=new D,Gn=new D,Vn=new D,ai=new D,as=new D,Vs=new D,$s=new D,ri=new D;function qa(n,e,t,i,s){for(let a=0,r=n.length-3;a<=r;a+=3){ri.fromArray(n,a);const o=s.x*Math.abs(ri.x)+s.y*Math.abs(ri.y)+s.z*Math.abs(ri.z),l=e.dot(ri),c=t.dot(ri),d=i.dot(ri);if(Math.max(-Math.max(l,c,d),Math.min(l,c,d))>o)return!1}return!0}const rh=new Us,rs=new D,Ya=new D;class Na{constructor(e=new D,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):rh.setFromPoints(e).getCenter(i);let s=0;for(let a=0,r=e.length;a<r;a++)s=Math.max(s,i.distanceToSquared(e[a]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;rs.subVectors(e,this.center);const t=rs.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),s=(i-this.radius)*.5;this.center.addScaledVector(rs,s/i),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Ya.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(rs.copy(e.center).add(Ya)),this.expandByPoint(rs.copy(e.center).sub(Ya))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}const Ln=new D,Za=new D,Ws=new D,$n=new D,Ja=new D,js=new D,Ka=new D;class Fa{constructor(e=new D,t=new D(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Ln)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Ln.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Ln.copy(this.origin).addScaledVector(this.direction,t),Ln.distanceToSquared(e))}distanceSqToSegment(e,t,i,s){Za.copy(e).add(t).multiplyScalar(.5),Ws.copy(t).sub(e).normalize(),$n.copy(this.origin).sub(Za);const a=e.distanceTo(t)*.5,r=-this.direction.dot(Ws),o=$n.dot(this.direction),l=-$n.dot(Ws),c=$n.lengthSq(),d=Math.abs(1-r*r);let u,h,m,_;if(d>0)if(u=r*l-o,h=r*o-l,_=a*d,u>=0)if(h>=-_)if(h<=_){const x=1/d;u*=x,h*=x,m=u*(u+r*h+2*o)+h*(r*u+h+2*l)+c}else h=a,u=Math.max(0,-(r*h+o)),m=-u*u+h*(h+2*l)+c;else h=-a,u=Math.max(0,-(r*h+o)),m=-u*u+h*(h+2*l)+c;else h<=-_?(u=Math.max(0,-(-r*a+o)),h=u>0?-a:Math.min(Math.max(-a,-l),a),m=-u*u+h*(h+2*l)+c):h<=_?(u=0,h=Math.min(Math.max(-a,-l),a),m=h*(h+2*l)+c):(u=Math.max(0,-(r*a+o)),h=u>0?a:Math.min(Math.max(-a,-l),a),m=-u*u+h*(h+2*l)+c);else h=r>0?-a:a,u=Math.max(0,-(r*h+o)),m=-u*u+h*(h+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Za).addScaledVector(Ws,h),m}intersectSphere(e,t){Ln.subVectors(e.center,this.origin);const i=Ln.dot(this.direction),s=Ln.dot(Ln)-i*i,a=e.radius*e.radius;if(s>a)return null;const r=Math.sqrt(a-s),o=i-r,l=i+r;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,s,a,r,o,l;const c=1/this.direction.x,d=1/this.direction.y,u=1/this.direction.z,h=this.origin;return c>=0?(i=(e.min.x-h.x)*c,s=(e.max.x-h.x)*c):(i=(e.max.x-h.x)*c,s=(e.min.x-h.x)*c),d>=0?(a=(e.min.y-h.y)*d,r=(e.max.y-h.y)*d):(a=(e.max.y-h.y)*d,r=(e.min.y-h.y)*d),i>r||a>s||((a>i||isNaN(i))&&(i=a),(r<s||isNaN(s))&&(s=r),u>=0?(o=(e.min.z-h.z)*u,l=(e.max.z-h.z)*u):(o=(e.max.z-h.z)*u,l=(e.min.z-h.z)*u),i>l||o>s)||((o>i||i!==i)&&(i=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(i>=0?i:s,t)}intersectsBox(e){return this.intersectBox(e,Ln)!==null}intersectTriangle(e,t,i,s,a){Ja.subVectors(t,e),js.subVectors(i,e),Ka.crossVectors(Ja,js);let r=this.direction.dot(Ka),o;if(r>0){if(s)return null;o=1}else if(r<0)o=-1,r=-r;else return null;$n.subVectors(this.origin,e);const l=o*this.direction.dot(js.crossVectors($n,js));if(l<0)return null;const c=o*this.direction.dot(Ja.cross($n));if(c<0||l+c>r)return null;const d=-o*$n.dot(Ka);return d<0?null:this.at(d/r,a)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class dt{constructor(e,t,i,s,a,r,o,l,c,d,u,h,m,_,x,f){dt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,s,a,r,o,l,c,d,u,h,m,_,x,f)}set(e,t,i,s,a,r,o,l,c,d,u,h,m,_,x,f){const p=this.elements;return p[0]=e,p[4]=t,p[8]=i,p[12]=s,p[1]=a,p[5]=r,p[9]=o,p[13]=l,p[2]=c,p[6]=d,p[10]=u,p[14]=h,p[3]=m,p[7]=_,p[11]=x,p[15]=f,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new dt().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,i=e.elements,s=1/Pi.setFromMatrixColumn(e,0).length(),a=1/Pi.setFromMatrixColumn(e,1).length(),r=1/Pi.setFromMatrixColumn(e,2).length();return t[0]=i[0]*s,t[1]=i[1]*s,t[2]=i[2]*s,t[3]=0,t[4]=i[4]*a,t[5]=i[5]*a,t[6]=i[6]*a,t[7]=0,t[8]=i[8]*r,t[9]=i[9]*r,t[10]=i[10]*r,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,s=e.y,a=e.z,r=Math.cos(i),o=Math.sin(i),l=Math.cos(s),c=Math.sin(s),d=Math.cos(a),u=Math.sin(a);if(e.order==="XYZ"){const h=r*d,m=r*u,_=o*d,x=o*u;t[0]=l*d,t[4]=-l*u,t[8]=c,t[1]=m+_*c,t[5]=h-x*c,t[9]=-o*l,t[2]=x-h*c,t[6]=_+m*c,t[10]=r*l}else if(e.order==="YXZ"){const h=l*d,m=l*u,_=c*d,x=c*u;t[0]=h+x*o,t[4]=_*o-m,t[8]=r*c,t[1]=r*u,t[5]=r*d,t[9]=-o,t[2]=m*o-_,t[6]=x+h*o,t[10]=r*l}else if(e.order==="ZXY"){const h=l*d,m=l*u,_=c*d,x=c*u;t[0]=h-x*o,t[4]=-r*u,t[8]=_+m*o,t[1]=m+_*o,t[5]=r*d,t[9]=x-h*o,t[2]=-r*c,t[6]=o,t[10]=r*l}else if(e.order==="ZYX"){const h=r*d,m=r*u,_=o*d,x=o*u;t[0]=l*d,t[4]=_*c-m,t[8]=h*c+x,t[1]=l*u,t[5]=x*c+h,t[9]=m*c-_,t[2]=-c,t[6]=o*l,t[10]=r*l}else if(e.order==="YZX"){const h=r*l,m=r*c,_=o*l,x=o*c;t[0]=l*d,t[4]=x-h*u,t[8]=_*u+m,t[1]=u,t[5]=r*d,t[9]=-o*d,t[2]=-c*d,t[6]=m*u+_,t[10]=h-x*u}else if(e.order==="XZY"){const h=r*l,m=r*c,_=o*l,x=o*c;t[0]=l*d,t[4]=-u,t[8]=c*d,t[1]=h*u+x,t[5]=r*d,t[9]=m*u-_,t[2]=_*u-m,t[6]=o*d,t[10]=x*u+h}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(oh,e,lh)}lookAt(e,t,i){const s=this.elements;return nn.subVectors(e,t),nn.lengthSq()===0&&(nn.z=1),nn.normalize(),Wn.crossVectors(i,nn),Wn.lengthSq()===0&&(Math.abs(i.z)===1?nn.x+=1e-4:nn.z+=1e-4,nn.normalize(),Wn.crossVectors(i,nn)),Wn.normalize(),Xs.crossVectors(nn,Wn),s[0]=Wn.x,s[4]=Xs.x,s[8]=nn.x,s[1]=Wn.y,s[5]=Xs.y,s[9]=nn.y,s[2]=Wn.z,s[6]=Xs.z,s[10]=nn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,a=this.elements,r=i[0],o=i[4],l=i[8],c=i[12],d=i[1],u=i[5],h=i[9],m=i[13],_=i[2],x=i[6],f=i[10],p=i[14],M=i[3],v=i[7],g=i[11],w=i[15],A=s[0],y=s[4],E=s[8],S=s[12],b=s[1],R=s[5],I=s[9],L=s[13],z=s[2],N=s[6],F=s[10],B=s[14],$=s[3],K=s[7],ue=s[11],ge=s[15];return a[0]=r*A+o*b+l*z+c*$,a[4]=r*y+o*R+l*N+c*K,a[8]=r*E+o*I+l*F+c*ue,a[12]=r*S+o*L+l*B+c*ge,a[1]=d*A+u*b+h*z+m*$,a[5]=d*y+u*R+h*N+m*K,a[9]=d*E+u*I+h*F+m*ue,a[13]=d*S+u*L+h*B+m*ge,a[2]=_*A+x*b+f*z+p*$,a[6]=_*y+x*R+f*N+p*K,a[10]=_*E+x*I+f*F+p*ue,a[14]=_*S+x*L+f*B+p*ge,a[3]=M*A+v*b+g*z+w*$,a[7]=M*y+v*R+g*N+w*K,a[11]=M*E+v*I+g*F+w*ue,a[15]=M*S+v*L+g*B+w*ge,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],s=e[8],a=e[12],r=e[1],o=e[5],l=e[9],c=e[13],d=e[2],u=e[6],h=e[10],m=e[14],_=e[3],x=e[7],f=e[11],p=e[15];return _*(+a*l*u-s*c*u-a*o*h+i*c*h+s*o*m-i*l*m)+x*(+t*l*m-t*c*h+a*r*h-s*r*m+s*c*d-a*l*d)+f*(+t*c*u-t*o*m-a*r*u+i*r*m+a*o*d-i*c*d)+p*(-s*o*d-t*l*u+t*o*h+s*r*u-i*r*h+i*l*d)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],a=e[3],r=e[4],o=e[5],l=e[6],c=e[7],d=e[8],u=e[9],h=e[10],m=e[11],_=e[12],x=e[13],f=e[14],p=e[15],M=u*f*c-x*h*c+x*l*m-o*f*m-u*l*p+o*h*p,v=_*h*c-d*f*c-_*l*m+r*f*m+d*l*p-r*h*p,g=d*x*c-_*u*c+_*o*m-r*x*m-d*o*p+r*u*p,w=_*u*l-d*x*l-_*o*h+r*x*h+d*o*f-r*u*f,A=t*M+i*v+s*g+a*w;if(A===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const y=1/A;return e[0]=M*y,e[1]=(x*h*a-u*f*a-x*s*m+i*f*m+u*s*p-i*h*p)*y,e[2]=(o*f*a-x*l*a+x*s*c-i*f*c-o*s*p+i*l*p)*y,e[3]=(u*l*a-o*h*a-u*s*c+i*h*c+o*s*m-i*l*m)*y,e[4]=v*y,e[5]=(d*f*a-_*h*a+_*s*m-t*f*m-d*s*p+t*h*p)*y,e[6]=(_*l*a-r*f*a-_*s*c+t*f*c+r*s*p-t*l*p)*y,e[7]=(r*h*a-d*l*a+d*s*c-t*h*c-r*s*m+t*l*m)*y,e[8]=g*y,e[9]=(_*u*a-d*x*a-_*i*m+t*x*m+d*i*p-t*u*p)*y,e[10]=(r*x*a-_*o*a+_*i*c-t*x*c-r*i*p+t*o*p)*y,e[11]=(d*o*a-r*u*a-d*i*c+t*u*c+r*i*m-t*o*m)*y,e[12]=w*y,e[13]=(d*x*s-_*u*s+_*i*h-t*x*h-d*i*f+t*u*f)*y,e[14]=(_*o*s-r*x*s-_*i*l+t*x*l+r*i*f-t*o*f)*y,e[15]=(r*u*s-d*o*s+d*i*l-t*u*l-r*i*h+t*o*h)*y,this}scale(e){const t=this.elements,i=e.x,s=e.y,a=e.z;return t[0]*=i,t[4]*=s,t[8]*=a,t[1]*=i,t[5]*=s,t[9]*=a,t[2]*=i,t[6]*=s,t[10]*=a,t[3]*=i,t[7]*=s,t[11]*=a,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,s))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),s=Math.sin(t),a=1-i,r=e.x,o=e.y,l=e.z,c=a*r,d=a*o;return this.set(c*r+i,c*o-s*l,c*l+s*o,0,c*o+s*l,d*o+i,d*l-s*r,0,c*l-s*o,d*l+s*r,a*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,s,a,r){return this.set(1,i,a,0,e,1,r,0,t,s,1,0,0,0,0,1),this}compose(e,t,i){const s=this.elements,a=t._x,r=t._y,o=t._z,l=t._w,c=a+a,d=r+r,u=o+o,h=a*c,m=a*d,_=a*u,x=r*d,f=r*u,p=o*u,M=l*c,v=l*d,g=l*u,w=i.x,A=i.y,y=i.z;return s[0]=(1-(x+p))*w,s[1]=(m+g)*w,s[2]=(_-v)*w,s[3]=0,s[4]=(m-g)*A,s[5]=(1-(h+p))*A,s[6]=(f+M)*A,s[7]=0,s[8]=(_+v)*y,s[9]=(f-M)*y,s[10]=(1-(h+x))*y,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,i){const s=this.elements;let a=Pi.set(s[0],s[1],s[2]).length();const r=Pi.set(s[4],s[5],s[6]).length(),o=Pi.set(s[8],s[9],s[10]).length();this.determinant()<0&&(a=-a),e.x=s[12],e.y=s[13],e.z=s[14],hn.copy(this);const c=1/a,d=1/r,u=1/o;return hn.elements[0]*=c,hn.elements[1]*=c,hn.elements[2]*=c,hn.elements[4]*=d,hn.elements[5]*=d,hn.elements[6]*=d,hn.elements[8]*=u,hn.elements[9]*=u,hn.elements[10]*=u,t.setFromRotationMatrix(hn),i.x=a,i.y=r,i.z=o,this}makePerspective(e,t,i,s,a,r,o=wn,l=!1){const c=this.elements,d=2*a/(t-e),u=2*a/(i-s),h=(t+e)/(t-e),m=(i+s)/(i-s);let _,x;if(l)_=a/(r-a),x=r*a/(r-a);else if(o===wn)_=-(r+a)/(r-a),x=-2*r*a/(r-a);else if(o===Ca)_=-r/(r-a),x=-r*a/(r-a);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=d,c[4]=0,c[8]=h,c[12]=0,c[1]=0,c[5]=u,c[9]=m,c[13]=0,c[2]=0,c[6]=0,c[10]=_,c[14]=x,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,i,s,a,r,o=wn,l=!1){const c=this.elements,d=2/(t-e),u=2/(i-s),h=-(t+e)/(t-e),m=-(i+s)/(i-s);let _,x;if(l)_=1/(r-a),x=r/(r-a);else if(o===wn)_=-2/(r-a),x=-(r+a)/(r-a);else if(o===Ca)_=-1/(r-a),x=-a/(r-a);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=d,c[4]=0,c[8]=0,c[12]=h,c[1]=0,c[5]=u,c[9]=0,c[13]=m,c[2]=0,c[6]=0,c[10]=_,c[14]=x,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<16;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}}const Pi=new D,hn=new dt,oh=new D(0,0,0),lh=new D(1,1,1),Wn=new D,Xs=new D,nn=new D,cl=new dt,dl=new zt;class _n{constructor(e=0,t=0,i=0,s=_n.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,s=this._order){return this._x=e,this._y=t,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const s=e.elements,a=s[0],r=s[4],o=s[8],l=s[1],c=s[5],d=s[9],u=s[2],h=s[6],m=s[10];switch(t){case"XYZ":this._y=Math.asin(je(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-d,m),this._z=Math.atan2(-r,a)):(this._x=Math.atan2(h,c),this._z=0);break;case"YXZ":this._x=Math.asin(-je(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(o,m),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,a),this._z=0);break;case"ZXY":this._x=Math.asin(je(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-u,m),this._z=Math.atan2(-r,c)):(this._y=0,this._z=Math.atan2(l,a));break;case"ZYX":this._y=Math.asin(-je(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(h,m),this._z=Math.atan2(l,a)):(this._x=0,this._z=Math.atan2(-r,c));break;case"YZX":this._z=Math.asin(je(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-d,c),this._y=Math.atan2(-u,a)):(this._x=0,this._y=Math.atan2(o,m));break;case"XZY":this._z=Math.asin(-je(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(h,c),this._y=Math.atan2(o,a)):(this._x=Math.atan2(-d,m),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return cl.makeRotationFromQuaternion(e),this.setFromRotationMatrix(cl,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return dl.setFromEuler(this),this.setFromQuaternion(dl,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}_n.DEFAULT_ORDER="XYZ";class Fo{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let ch=0;const ul=new D,Li=new zt,Dn=new dt,qs=new D,os=new D,dh=new D,uh=new zt,hl=new D(1,0,0),pl=new D(0,1,0),fl=new D(0,0,1),ml={type:"added"},hh={type:"removed"},Di={type:"childadded",child:null},Qa={type:"childremoved",child:null};class Ct extends Si{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:ch++}),this.uuid=es(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Ct.DEFAULT_UP.clone();const e=new D,t=new _n,i=new zt,s=new D(1,1,1);function a(){i.setFromEuler(t,!1)}function r(){t.setFromQuaternion(i,void 0,!1)}t._onChange(a),i._onChange(r),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new dt},normalMatrix:{value:new $e}}),this.matrix=new dt,this.matrixWorld=new dt,this.matrixAutoUpdate=Ct.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Ct.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Fo,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Li.setFromAxisAngle(e,t),this.quaternion.multiply(Li),this}rotateOnWorldAxis(e,t){return Li.setFromAxisAngle(e,t),this.quaternion.premultiply(Li),this}rotateX(e){return this.rotateOnAxis(hl,e)}rotateY(e){return this.rotateOnAxis(pl,e)}rotateZ(e){return this.rotateOnAxis(fl,e)}translateOnAxis(e,t){return ul.copy(e).applyQuaternion(this.quaternion),this.position.add(ul.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(hl,e)}translateY(e){return this.translateOnAxis(pl,e)}translateZ(e){return this.translateOnAxis(fl,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Dn.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?qs.copy(e):qs.set(e,t,i);const s=this.parent;this.updateWorldMatrix(!0,!1),os.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Dn.lookAt(os,qs,this.up):Dn.lookAt(qs,os,this.up),this.quaternion.setFromRotationMatrix(Dn),s&&(Dn.extractRotation(s.matrixWorld),Li.setFromRotationMatrix(Dn),this.quaternion.premultiply(Li.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(ml),Di.child=e,this.dispatchEvent(Di),Di.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(hh),Qa.child=e,this.dispatchEvent(Qa),Qa.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Dn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Dn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Dn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(ml),Di.child=e,this.dispatchEvent(Di),Di.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,s=this.children.length;i<s;i++){const r=this.children[i].getObjectByProperty(e,t);if(r!==void 0)return r}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const s=this.children;for(let a=0,r=s.length;a<r;a++)s[a].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(os,e,dh),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(os,uh,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const s=this.children;for(let a=0,r=s.length;a<r;a++)s[a].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function a(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=a(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,d=l.length;c<d;c++){const u=l[c];a(e.shapes,u)}else a(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(a(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(a(e.materials,this.material[l]));s.material=o}else s.material=a(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];s.animations.push(a(e.animations,l))}}if(t){const o=r(e.geometries),l=r(e.materials),c=r(e.textures),d=r(e.images),u=r(e.shapes),h=r(e.skeletons),m=r(e.animations),_=r(e.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),d.length>0&&(i.images=d),u.length>0&&(i.shapes=u),h.length>0&&(i.skeletons=h),m.length>0&&(i.animations=m),_.length>0&&(i.nodes=_)}return i.object=s,i;function r(o){const l=[];for(const c in o){const d=o[c];delete d.metadata,l.push(d)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const s=e.children[i];this.add(s.clone())}return this}}Ct.DEFAULT_UP=new D(0,1,0);Ct.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ct.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const pn=new D,In=new D,er=new D,Un=new D,Ii=new D,Ui=new D,gl=new D,tr=new D,nr=new D,ir=new D,sr=new Tt,ar=new Tt,rr=new Tt;class dn{constructor(e=new D,t=new D,i=new D){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,s){s.subVectors(i,t),pn.subVectors(e,t),s.cross(pn);const a=s.lengthSq();return a>0?s.multiplyScalar(1/Math.sqrt(a)):s.set(0,0,0)}static getBarycoord(e,t,i,s,a){pn.subVectors(s,t),In.subVectors(i,t),er.subVectors(e,t);const r=pn.dot(pn),o=pn.dot(In),l=pn.dot(er),c=In.dot(In),d=In.dot(er),u=r*c-o*o;if(u===0)return a.set(0,0,0),null;const h=1/u,m=(c*l-o*d)*h,_=(r*d-o*l)*h;return a.set(1-m-_,_,m)}static containsPoint(e,t,i,s){return this.getBarycoord(e,t,i,s,Un)===null?!1:Un.x>=0&&Un.y>=0&&Un.x+Un.y<=1}static getInterpolation(e,t,i,s,a,r,o,l){return this.getBarycoord(e,t,i,s,Un)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(a,Un.x),l.addScaledVector(r,Un.y),l.addScaledVector(o,Un.z),l)}static getInterpolatedAttribute(e,t,i,s,a,r){return sr.setScalar(0),ar.setScalar(0),rr.setScalar(0),sr.fromBufferAttribute(e,t),ar.fromBufferAttribute(e,i),rr.fromBufferAttribute(e,s),r.setScalar(0),r.addScaledVector(sr,a.x),r.addScaledVector(ar,a.y),r.addScaledVector(rr,a.z),r}static isFrontFacing(e,t,i,s){return pn.subVectors(i,t),In.subVectors(e,t),pn.cross(In).dot(s)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,s){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,i,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return pn.subVectors(this.c,this.b),In.subVectors(this.a,this.b),pn.cross(In).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return dn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return dn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,s,a){return dn.getInterpolation(e,this.a,this.b,this.c,t,i,s,a)}containsPoint(e){return dn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return dn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,s=this.b,a=this.c;let r,o;Ii.subVectors(s,i),Ui.subVectors(a,i),tr.subVectors(e,i);const l=Ii.dot(tr),c=Ui.dot(tr);if(l<=0&&c<=0)return t.copy(i);nr.subVectors(e,s);const d=Ii.dot(nr),u=Ui.dot(nr);if(d>=0&&u<=d)return t.copy(s);const h=l*u-d*c;if(h<=0&&l>=0&&d<=0)return r=l/(l-d),t.copy(i).addScaledVector(Ii,r);ir.subVectors(e,a);const m=Ii.dot(ir),_=Ui.dot(ir);if(_>=0&&m<=_)return t.copy(a);const x=m*c-l*_;if(x<=0&&c>=0&&_<=0)return o=c/(c-_),t.copy(i).addScaledVector(Ui,o);const f=d*_-m*u;if(f<=0&&u-d>=0&&m-_>=0)return gl.subVectors(a,s),o=(u-d)/(u-d+(m-_)),t.copy(s).addScaledVector(gl,o);const p=1/(f+x+h);return r=x*p,o=h*p,t.copy(i).addScaledVector(Ii,r).addScaledVector(Ui,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Gc={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},jn={h:0,s:0,l:0},Ys={h:0,s:0,l:0};function or(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class Xe{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=ln){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,tt.colorSpaceToWorking(this,t),this}setRGB(e,t,i,s=tt.workingColorSpace){return this.r=e,this.g=t,this.b=i,tt.colorSpaceToWorking(this,s),this}setHSL(e,t,i,s=tt.workingColorSpace){if(e=Zu(e,1),t=je(t,0,1),i=je(i,0,1),t===0)this.r=this.g=this.b=i;else{const a=i<=.5?i*(1+t):i+t-i*t,r=2*i-a;this.r=or(r,a,e+1/3),this.g=or(r,a,e),this.b=or(r,a,e-1/3)}return tt.colorSpaceToWorking(this,s),this}setStyle(e,t=ln){function i(a){a!==void 0&&parseFloat(a)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let a;const r=s[1],o=s[2];switch(r){case"rgb":case"rgba":if(a=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(a[4]),this.setRGB(Math.min(255,parseInt(a[1],10))/255,Math.min(255,parseInt(a[2],10))/255,Math.min(255,parseInt(a[3],10))/255,t);if(a=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(a[4]),this.setRGB(Math.min(100,parseInt(a[1],10))/100,Math.min(100,parseInt(a[2],10))/100,Math.min(100,parseInt(a[3],10))/100,t);break;case"hsl":case"hsla":if(a=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(a[4]),this.setHSL(parseFloat(a[1])/360,parseFloat(a[2])/100,parseFloat(a[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const a=s[1],r=a.length;if(r===3)return this.setRGB(parseInt(a.charAt(0),16)/15,parseInt(a.charAt(1),16)/15,parseInt(a.charAt(2),16)/15,t);if(r===6)return this.setHex(parseInt(a,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=ln){const i=Gc[e.toLowerCase()];return i!==void 0?this.setHex(i,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=kn(e.r),this.g=kn(e.g),this.b=kn(e.b),this}copyLinearToSRGB(e){return this.r=ji(e.r),this.g=ji(e.g),this.b=ji(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=ln){return tt.workingToColorSpace(Gt.copy(this),e),Math.round(je(Gt.r*255,0,255))*65536+Math.round(je(Gt.g*255,0,255))*256+Math.round(je(Gt.b*255,0,255))}getHexString(e=ln){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=tt.workingColorSpace){tt.workingToColorSpace(Gt.copy(this),t);const i=Gt.r,s=Gt.g,a=Gt.b,r=Math.max(i,s,a),o=Math.min(i,s,a);let l,c;const d=(o+r)/2;if(o===r)l=0,c=0;else{const u=r-o;switch(c=d<=.5?u/(r+o):u/(2-r-o),r){case i:l=(s-a)/u+(s<a?6:0);break;case s:l=(a-i)/u+2;break;case a:l=(i-s)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=d,e}getRGB(e,t=tt.workingColorSpace){return tt.workingToColorSpace(Gt.copy(this),t),e.r=Gt.r,e.g=Gt.g,e.b=Gt.b,e}getStyle(e=ln){tt.workingToColorSpace(Gt.copy(this),e);const t=Gt.r,i=Gt.g,s=Gt.b;return e!==ln?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(e,t,i){return this.getHSL(jn),this.setHSL(jn.h+e,jn.s+t,jn.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(jn),e.getHSL(Ys);const i=Va(jn.h,Ys.h,t),s=Va(jn.s,Ys.s,t),a=Va(jn.l,Ys.l,t);return this.setHSL(i,s,a),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,s=this.b,a=e.elements;return this.r=a[0]*t+a[3]*i+a[6]*s,this.g=a[1]*t+a[4]*i+a[7]*s,this.b=a[2]*t+a[5]*i+a[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Gt=new Xe;Xe.NAMES=Gc;let ph=0;class ts extends Si{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:ph++}),this.uuid=es(),this.name="",this.type="Material",this.blending=Wi,this.side=ei,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Lr,this.blendDst=Dr,this.blendEquation=mi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Xe(0,0,0),this.blendAlpha=0,this.depthFunc=Xi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=nl,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=wi,this.stencilZFail=wi,this.stencilZPass=wi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Wi&&(i.blending=this.blending),this.side!==ei&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==Lr&&(i.blendSrc=this.blendSrc),this.blendDst!==Dr&&(i.blendDst=this.blendDst),this.blendEquation!==mi&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Xi&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==nl&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==wi&&(i.stencilFail=this.stencilFail),this.stencilZFail!==wi&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==wi&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(a){const r=[];for(const o in a){const l=a[o];delete l.metadata,r.push(l)}return r}if(t){const a=s(e.textures),r=s(e.images);a.length>0&&(i.textures=a),r.length>0&&(i.images=r)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const s=t.length;i=new Array(s);for(let a=0;a!==s;++a)i[a]=t[a].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class Oa extends ts{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Xe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new _n,this.combine=Cc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Rt=new D,Zs=new oe;let fh=0;class Tn{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:fh++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=il,this.updateRanges=[],this.gpuType=zn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let s=0,a=this.itemSize;s<a;s++)this.array[e+s]=t.array[i+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Zs.fromBufferAttribute(this,t),Zs.applyMatrix3(e),this.setXY(t,Zs.x,Zs.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)Rt.fromBufferAttribute(this,t),Rt.applyMatrix3(e),this.setXYZ(t,Rt.x,Rt.y,Rt.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)Rt.fromBufferAttribute(this,t),Rt.applyMatrix4(e),this.setXYZ(t,Rt.x,Rt.y,Rt.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Rt.fromBufferAttribute(this,t),Rt.applyNormalMatrix(e),this.setXYZ(t,Rt.x,Rt.y,Rt.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Rt.fromBufferAttribute(this,t),Rt.transformDirection(e),this.setXYZ(t,Rt.x,Rt.y,Rt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=ss(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Yt(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=ss(t,this.array)),t}setX(e,t){return this.normalized&&(t=Yt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=ss(t,this.array)),t}setY(e,t){return this.normalized&&(t=Yt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=ss(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Yt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=ss(t,this.array)),t}setW(e,t){return this.normalized&&(t=Yt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=Yt(t,this.array),i=Yt(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,s){return e*=this.itemSize,this.normalized&&(t=Yt(t,this.array),i=Yt(i,this.array),s=Yt(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this}setXYZW(e,t,i,s,a){return e*=this.itemSize,this.normalized&&(t=Yt(t,this.array),i=Yt(i,this.array),s=Yt(s,this.array),a=Yt(a,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this.array[e+3]=a,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==il&&(e.usage=this.usage),e}}class Vc extends Tn{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class $c extends Tn{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class at extends Tn{constructor(e,t,i){super(new Float32Array(e),t,i)}}let mh=0;const on=new dt,lr=new Ct,Ni=new D,sn=new Us,ls=new Us,Ut=new D;class Ft extends Si{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:mh++}),this.uuid=es(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Bc(e)?$c:Vc)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const a=new $e().getNormalMatrix(e);i.applyNormalMatrix(a),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return on.makeRotationFromQuaternion(e),this.applyMatrix4(on),this}rotateX(e){return on.makeRotationX(e),this.applyMatrix4(on),this}rotateY(e){return on.makeRotationY(e),this.applyMatrix4(on),this}rotateZ(e){return on.makeRotationZ(e),this.applyMatrix4(on),this}translate(e,t,i){return on.makeTranslation(e,t,i),this.applyMatrix4(on),this}scale(e,t,i){return on.makeScale(e,t,i),this.applyMatrix4(on),this}lookAt(e){return lr.lookAt(e),lr.updateMatrix(),this.applyMatrix4(lr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ni).negate(),this.translate(Ni.x,Ni.y,Ni.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let s=0,a=e.length;s<a;s++){const r=e[s];i.push(r.x,r.y,r.z||0)}this.setAttribute("position",new at(i,3))}else{const i=Math.min(e.length,t.count);for(let s=0;s<i;s++){const a=e[s];t.setXYZ(s,a.x,a.y,a.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Us);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new D(-1/0,-1/0,-1/0),new D(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,s=t.length;i<s;i++){const a=t[i];sn.setFromBufferAttribute(a),this.morphTargetsRelative?(Ut.addVectors(this.boundingBox.min,sn.min),this.boundingBox.expandByPoint(Ut),Ut.addVectors(this.boundingBox.max,sn.max),this.boundingBox.expandByPoint(Ut)):(this.boundingBox.expandByPoint(sn.min),this.boundingBox.expandByPoint(sn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Na);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new D,1/0);return}if(e){const i=this.boundingSphere.center;if(sn.setFromBufferAttribute(e),t)for(let a=0,r=t.length;a<r;a++){const o=t[a];ls.setFromBufferAttribute(o),this.morphTargetsRelative?(Ut.addVectors(sn.min,ls.min),sn.expandByPoint(Ut),Ut.addVectors(sn.max,ls.max),sn.expandByPoint(Ut)):(sn.expandByPoint(ls.min),sn.expandByPoint(ls.max))}sn.getCenter(i);let s=0;for(let a=0,r=e.count;a<r;a++)Ut.fromBufferAttribute(e,a),s=Math.max(s,i.distanceToSquared(Ut));if(t)for(let a=0,r=t.length;a<r;a++){const o=t[a],l=this.morphTargetsRelative;for(let c=0,d=o.count;c<d;c++)Ut.fromBufferAttribute(o,c),l&&(Ni.fromBufferAttribute(e,c),Ut.add(Ni)),s=Math.max(s,i.distanceToSquared(Ut))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,s=t.normal,a=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Tn(new Float32Array(4*i.count),4));const r=this.getAttribute("tangent"),o=[],l=[];for(let E=0;E<i.count;E++)o[E]=new D,l[E]=new D;const c=new D,d=new D,u=new D,h=new oe,m=new oe,_=new oe,x=new D,f=new D;function p(E,S,b){c.fromBufferAttribute(i,E),d.fromBufferAttribute(i,S),u.fromBufferAttribute(i,b),h.fromBufferAttribute(a,E),m.fromBufferAttribute(a,S),_.fromBufferAttribute(a,b),d.sub(c),u.sub(c),m.sub(h),_.sub(h);const R=1/(m.x*_.y-_.x*m.y);isFinite(R)&&(x.copy(d).multiplyScalar(_.y).addScaledVector(u,-m.y).multiplyScalar(R),f.copy(u).multiplyScalar(m.x).addScaledVector(d,-_.x).multiplyScalar(R),o[E].add(x),o[S].add(x),o[b].add(x),l[E].add(f),l[S].add(f),l[b].add(f))}let M=this.groups;M.length===0&&(M=[{start:0,count:e.count}]);for(let E=0,S=M.length;E<S;++E){const b=M[E],R=b.start,I=b.count;for(let L=R,z=R+I;L<z;L+=3)p(e.getX(L+0),e.getX(L+1),e.getX(L+2))}const v=new D,g=new D,w=new D,A=new D;function y(E){w.fromBufferAttribute(s,E),A.copy(w);const S=o[E];v.copy(S),v.sub(w.multiplyScalar(w.dot(S))).normalize(),g.crossVectors(A,S);const R=g.dot(l[E])<0?-1:1;r.setXYZW(E,v.x,v.y,v.z,R)}for(let E=0,S=M.length;E<S;++E){const b=M[E],R=b.start,I=b.count;for(let L=R,z=R+I;L<z;L+=3)y(e.getX(L+0)),y(e.getX(L+1)),y(e.getX(L+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new Tn(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let h=0,m=i.count;h<m;h++)i.setXYZ(h,0,0,0);const s=new D,a=new D,r=new D,o=new D,l=new D,c=new D,d=new D,u=new D;if(e)for(let h=0,m=e.count;h<m;h+=3){const _=e.getX(h+0),x=e.getX(h+1),f=e.getX(h+2);s.fromBufferAttribute(t,_),a.fromBufferAttribute(t,x),r.fromBufferAttribute(t,f),d.subVectors(r,a),u.subVectors(s,a),d.cross(u),o.fromBufferAttribute(i,_),l.fromBufferAttribute(i,x),c.fromBufferAttribute(i,f),o.add(d),l.add(d),c.add(d),i.setXYZ(_,o.x,o.y,o.z),i.setXYZ(x,l.x,l.y,l.z),i.setXYZ(f,c.x,c.y,c.z)}else for(let h=0,m=t.count;h<m;h+=3)s.fromBufferAttribute(t,h+0),a.fromBufferAttribute(t,h+1),r.fromBufferAttribute(t,h+2),d.subVectors(r,a),u.subVectors(s,a),d.cross(u),i.setXYZ(h+0,d.x,d.y,d.z),i.setXYZ(h+1,d.x,d.y,d.z),i.setXYZ(h+2,d.x,d.y,d.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)Ut.fromBufferAttribute(e,t),Ut.normalize(),e.setXYZ(t,Ut.x,Ut.y,Ut.z)}toNonIndexed(){function e(o,l){const c=o.array,d=o.itemSize,u=o.normalized,h=new c.constructor(l.length*d);let m=0,_=0;for(let x=0,f=l.length;x<f;x++){o.isInterleavedBufferAttribute?m=l[x]*o.data.stride+o.offset:m=l[x]*d;for(let p=0;p<d;p++)h[_++]=c[m++]}return new Tn(h,d,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Ft,i=this.index.array,s=this.attributes;for(const o in s){const l=s[o],c=e(l,i);t.setAttribute(o,c)}const a=this.morphAttributes;for(const o in a){const l=[],c=a[o];for(let d=0,u=c.length;d<u;d++){const h=c[d],m=e(h,i);l.push(m)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const r=this.groups;for(let o=0,l=r.length;o<l;o++){const c=r[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const s={};let a=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],d=[];for(let u=0,h=c.length;u<h;u++){const m=c[u];d.push(m.toJSON(e.data))}d.length>0&&(s[l]=d,a=!0)}a&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const r=this.groups;r.length>0&&(e.data.groups=JSON.parse(JSON.stringify(r)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const s=e.attributes;for(const c in s){const d=s[c];this.setAttribute(c,d.clone(t))}const a=e.morphAttributes;for(const c in a){const d=[],u=a[c];for(let h=0,m=u.length;h<m;h++)d.push(u[h].clone(t));this.morphAttributes[c]=d}this.morphTargetsRelative=e.morphTargetsRelative;const r=e.groups;for(let c=0,d=r.length;c<d;c++){const u=r[c];this.addGroup(u.start,u.count,u.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const _l=new dt,oi=new Fa,Js=new Na,vl=new D,Ks=new D,Qs=new D,ea=new D,cr=new D,ta=new D,xl=new D,na=new D;class be extends Ct{constructor(e=new Ft,t=new Oa){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,r=s.length;a<r;a++){const o=s[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}getVertexPosition(e,t){const i=this.geometry,s=i.attributes.position,a=i.morphAttributes.position,r=i.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(a&&o){ta.set(0,0,0);for(let l=0,c=a.length;l<c;l++){const d=o[l],u=a[l];d!==0&&(cr.fromBufferAttribute(u,e),r?ta.addScaledVector(cr,d):ta.addScaledVector(cr.sub(t),d))}t.add(ta)}return t}raycast(e,t){const i=this.geometry,s=this.material,a=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Js.copy(i.boundingSphere),Js.applyMatrix4(a),oi.copy(e.ray).recast(e.near),!(Js.containsPoint(oi.origin)===!1&&(oi.intersectSphere(Js,vl)===null||oi.origin.distanceToSquared(vl)>(e.far-e.near)**2))&&(_l.copy(a).invert(),oi.copy(e.ray).applyMatrix4(_l),!(i.boundingBox!==null&&oi.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,oi)))}_computeIntersections(e,t,i){let s;const a=this.geometry,r=this.material,o=a.index,l=a.attributes.position,c=a.attributes.uv,d=a.attributes.uv1,u=a.attributes.normal,h=a.groups,m=a.drawRange;if(o!==null)if(Array.isArray(r))for(let _=0,x=h.length;_<x;_++){const f=h[_],p=r[f.materialIndex],M=Math.max(f.start,m.start),v=Math.min(o.count,Math.min(f.start+f.count,m.start+m.count));for(let g=M,w=v;g<w;g+=3){const A=o.getX(g),y=o.getX(g+1),E=o.getX(g+2);s=ia(this,p,e,i,c,d,u,A,y,E),s&&(s.faceIndex=Math.floor(g/3),s.face.materialIndex=f.materialIndex,t.push(s))}}else{const _=Math.max(0,m.start),x=Math.min(o.count,m.start+m.count);for(let f=_,p=x;f<p;f+=3){const M=o.getX(f),v=o.getX(f+1),g=o.getX(f+2);s=ia(this,r,e,i,c,d,u,M,v,g),s&&(s.faceIndex=Math.floor(f/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(r))for(let _=0,x=h.length;_<x;_++){const f=h[_],p=r[f.materialIndex],M=Math.max(f.start,m.start),v=Math.min(l.count,Math.min(f.start+f.count,m.start+m.count));for(let g=M,w=v;g<w;g+=3){const A=g,y=g+1,E=g+2;s=ia(this,p,e,i,c,d,u,A,y,E),s&&(s.faceIndex=Math.floor(g/3),s.face.materialIndex=f.materialIndex,t.push(s))}}else{const _=Math.max(0,m.start),x=Math.min(l.count,m.start+m.count);for(let f=_,p=x;f<p;f+=3){const M=f,v=f+1,g=f+2;s=ia(this,r,e,i,c,d,u,M,v,g),s&&(s.faceIndex=Math.floor(f/3),t.push(s))}}}}function gh(n,e,t,i,s,a,r,o){let l;if(e.side===Kt?l=i.intersectTriangle(r,a,s,!0,o):l=i.intersectTriangle(s,a,r,e.side===ei,o),l===null)return null;na.copy(o),na.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(na);return c<t.near||c>t.far?null:{distance:c,point:na.clone(),object:n}}function ia(n,e,t,i,s,a,r,o,l,c){n.getVertexPosition(o,Ks),n.getVertexPosition(l,Qs),n.getVertexPosition(c,ea);const d=gh(n,e,t,i,Ks,Qs,ea,xl);if(d){const u=new D;dn.getBarycoord(xl,Ks,Qs,ea,u),s&&(d.uv=dn.getInterpolatedAttribute(s,o,l,c,u,new oe)),a&&(d.uv1=dn.getInterpolatedAttribute(a,o,l,c,u,new oe)),r&&(d.normal=dn.getInterpolatedAttribute(r,o,l,c,u,new D),d.normal.dot(i.direction)>0&&d.normal.multiplyScalar(-1));const h={a:o,b:l,c,normal:new D,materialIndex:0};dn.getNormal(Ks,Qs,ea,h.normal),d.face=h,d.barycoord=u}return d}class St extends Ft{constructor(e=1,t=1,i=1,s=1,a=1,r=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:s,heightSegments:a,depthSegments:r};const o=this;s=Math.floor(s),a=Math.floor(a),r=Math.floor(r);const l=[],c=[],d=[],u=[];let h=0,m=0;_("z","y","x",-1,-1,i,t,e,r,a,0),_("z","y","x",1,-1,i,t,-e,r,a,1),_("x","z","y",1,1,e,i,t,s,r,2),_("x","z","y",1,-1,e,i,-t,s,r,3),_("x","y","z",1,-1,e,t,i,s,a,4),_("x","y","z",-1,-1,e,t,-i,s,a,5),this.setIndex(l),this.setAttribute("position",new at(c,3)),this.setAttribute("normal",new at(d,3)),this.setAttribute("uv",new at(u,2));function _(x,f,p,M,v,g,w,A,y,E,S){const b=g/y,R=w/E,I=g/2,L=w/2,z=A/2,N=y+1,F=E+1;let B=0,$=0;const K=new D;for(let ue=0;ue<F;ue++){const ge=ue*R-L;for(let Oe=0;Oe<N;Oe++){const qe=Oe*b-I;K[x]=qe*M,K[f]=ge*v,K[p]=z,c.push(K.x,K.y,K.z),K[x]=0,K[f]=0,K[p]=A>0?1:-1,d.push(K.x,K.y,K.z),u.push(Oe/y),u.push(1-ue/E),B+=1}}for(let ue=0;ue<E;ue++)for(let ge=0;ge<y;ge++){const Oe=h+ge+N*ue,qe=h+ge+N*(ue+1),Qe=h+(ge+1)+N*(ue+1),Ke=h+(ge+1)+N*ue;l.push(Oe,qe,Ke),l.push(qe,Qe,Ke),$+=6}o.addGroup(m,$,S),m+=$,h+=B}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new St(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Ji(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const s=n[t][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=s.clone():Array.isArray(s)?e[t][i]=s.slice():e[t][i]=s}}return e}function jt(n){const e={};for(let t=0;t<n.length;t++){const i=Ji(n[t]);for(const s in i)e[s]=i[s]}return e}function _h(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function Wc(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:tt.workingColorSpace}const vh={clone:Ji,merge:jt};var xh=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,yh=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class ti extends ts{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=xh,this.fragmentShader=yh,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Ji(e.uniforms),this.uniformsGroups=_h(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const r=this.uniforms[s].value;r&&r.isTexture?t.uniforms[s]={type:"t",value:r.toJSON(e).uuid}:r&&r.isColor?t.uniforms[s]={type:"c",value:r.getHex()}:r&&r.isVector2?t.uniforms[s]={type:"v2",value:r.toArray()}:r&&r.isVector3?t.uniforms[s]={type:"v3",value:r.toArray()}:r&&r.isVector4?t.uniforms[s]={type:"v4",value:r.toArray()}:r&&r.isMatrix3?t.uniforms[s]={type:"m3",value:r.toArray()}:r&&r.isMatrix4?t.uniforms[s]={type:"m4",value:r.toArray()}:t.uniforms[s]={value:r}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class jc extends Ct{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new dt,this.projectionMatrix=new dt,this.projectionMatrixInverse=new dt,this.coordinateSystem=wn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Xn=new D,yl=new oe,bl=new oe;class cn extends jc{constructor(e=50,t=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=xo*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(xs*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return xo*2*Math.atan(Math.tan(xs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){Xn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Xn.x,Xn.y).multiplyScalar(-e/Xn.z),Xn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Xn.x,Xn.y).multiplyScalar(-e/Xn.z)}getViewSize(e,t){return this.getViewBounds(e,yl,bl),t.subVectors(bl,yl)}setViewOffset(e,t,i,s,a,r){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=a,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(xs*.5*this.fov)/this.zoom,i=2*t,s=this.aspect*i,a=-.5*s;const r=this.view;if(this.view!==null&&this.view.enabled){const l=r.fullWidth,c=r.fullHeight;a+=r.offsetX*s/l,t-=r.offsetY*i/c,s*=r.width/l,i*=r.height/c}const o=this.filmOffset;o!==0&&(a+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(a,a+s,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Fi=-90,Oi=1;class bh extends Ct{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new cn(Fi,Oi,e,t);s.layers=this.layers,this.add(s);const a=new cn(Fi,Oi,e,t);a.layers=this.layers,this.add(a);const r=new cn(Fi,Oi,e,t);r.layers=this.layers,this.add(r);const o=new cn(Fi,Oi,e,t);o.layers=this.layers,this.add(o);const l=new cn(Fi,Oi,e,t);l.layers=this.layers,this.add(l);const c=new cn(Fi,Oi,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,s,a,r,o,l]=t;for(const c of t)this.remove(c);if(e===wn)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),a.up.set(0,0,-1),a.lookAt(0,1,0),r.up.set(0,0,1),r.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Ca)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),a.up.set(0,0,1),a.lookAt(0,1,0),r.up.set(0,0,-1),r.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[a,r,o,l,c,d]=this.children,u=e.getRenderTarget(),h=e.getActiveCubeFace(),m=e.getActiveMipmapLevel(),_=e.xr.enabled;e.xr.enabled=!1;const x=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,s),e.render(t,a),e.setRenderTarget(i,1,s),e.render(t,r),e.setRenderTarget(i,2,s),e.render(t,o),e.setRenderTarget(i,3,s),e.render(t,l),e.setRenderTarget(i,4,s),e.render(t,c),i.texture.generateMipmaps=x,e.setRenderTarget(i,5,s),e.render(t,d),e.setRenderTarget(u,h,m),e.xr.enabled=_,i.texture.needsPMREMUpdate=!0}}class Xc extends Qt{constructor(e=[],t=qi,i,s,a,r,o,l,c,d){super(e,t,i,s,a,r,o,l,c,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Mh extends bi{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},s=[i,i,i,i,i,i];this.texture=new Xc(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new St(5,5,5),a=new ti({name:"CubemapFromEquirect",uniforms:Ji(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Kt,blending:Kn});a.uniforms.tEquirect.value=t;const r=new be(s,a),o=t.minFilter;return t.minFilter===xi&&(t.minFilter=En),new bh(1,10,this).update(e,r),t.minFilter=o,r.geometry.dispose(),r.material.dispose(),this}clear(e,t=!0,i=!0,s=!0){const a=e.getRenderTarget();for(let r=0;r<6;r++)e.setRenderTarget(this,r),e.clear(t,i,s);e.setRenderTarget(a)}}class ps extends Ct{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Sh={type:"move"};class dr{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new ps,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new ps,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new D,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new D),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new ps,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new D,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new D),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let s=null,a=null,r=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){r=!0;for(const x of e.hand.values()){const f=t.getJointPose(x,i),p=this._getHandJoint(c,x);f!==null&&(p.matrix.fromArray(f.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=f.radius),p.visible=f!==null}const d=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],h=d.position.distanceTo(u.position),m=.02,_=.005;c.inputState.pinching&&h>m+_?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&h<=m-_&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(a=t.getPose(e.gripSpace,i),a!==null&&(l.matrix.fromArray(a.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,a.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(a.linearVelocity)):l.hasLinearVelocity=!1,a.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(a.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(s=t.getPose(e.targetRaySpace,i),s===null&&a!==null&&(s=a),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Sh)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=a!==null),c!==null&&(c.visible=r!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new ps;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}class Eh extends Ct{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new _n,this.environmentIntensity=1,this.environmentRotation=new _n,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}const ur=new D,wh=new D,Th=new $e;class Zn{constructor(e=new D(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,s){return this.normal.set(e,t,i),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const s=ur.subVectors(i,t).cross(wh.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const i=e.delta(ur),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const a=-(e.start.dot(this.normal)+this.constant)/s;return a<0||a>1?null:t.copy(e.start).addScaledVector(i,a)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||Th.getNormalMatrix(e),s=this.coplanarPoint(ur).applyMatrix4(e),a=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(a),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const li=new Na,Ah=new oe(.5,.5),sa=new D;class Oo{constructor(e=new Zn,t=new Zn,i=new Zn,s=new Zn,a=new Zn,r=new Zn){this.planes=[e,t,i,s,a,r]}set(e,t,i,s,a,r){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(s),o[4].copy(a),o[5].copy(r),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=wn,i=!1){const s=this.planes,a=e.elements,r=a[0],o=a[1],l=a[2],c=a[3],d=a[4],u=a[5],h=a[6],m=a[7],_=a[8],x=a[9],f=a[10],p=a[11],M=a[12],v=a[13],g=a[14],w=a[15];if(s[0].setComponents(c-r,m-d,p-_,w-M).normalize(),s[1].setComponents(c+r,m+d,p+_,w+M).normalize(),s[2].setComponents(c+o,m+u,p+x,w+v).normalize(),s[3].setComponents(c-o,m-u,p-x,w-v).normalize(),i)s[4].setComponents(l,h,f,g).normalize(),s[5].setComponents(c-l,m-h,p-f,w-g).normalize();else if(s[4].setComponents(c-l,m-h,p-f,w-g).normalize(),t===wn)s[5].setComponents(c+l,m+h,p+f,w+g).normalize();else if(t===Ca)s[5].setComponents(l,h,f,g).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),li.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),li.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(li)}intersectsSprite(e){li.center.set(0,0,0);const t=Ah.distanceTo(e.center);return li.radius=.7071067811865476+t,li.applyMatrix4(e.matrixWorld),this.intersectsSphere(li)}intersectsSphere(e){const t=this.planes,i=e.center,s=-e.radius;for(let a=0;a<6;a++)if(t[a].distanceToPoint(i)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const s=t[i];if(sa.x=s.normal.x>0?e.max.x:e.min.x,sa.y=s.normal.y>0?e.max.y:e.min.y,sa.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(sa)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Ki extends ts{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Xe(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Pa=new D,La=new D,Ml=new dt,cs=new Fa,aa=new Na,hr=new D,Sl=new D;class On extends Ct{constructor(e=new Ft,t=new Ki){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[0];for(let s=1,a=t.count;s<a;s++)Pa.fromBufferAttribute(t,s-1),La.fromBufferAttribute(t,s),i[s]=i[s-1],i[s]+=Pa.distanceTo(La);e.setAttribute("lineDistance",new at(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const i=this.geometry,s=this.matrixWorld,a=e.params.Line.threshold,r=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),aa.copy(i.boundingSphere),aa.applyMatrix4(s),aa.radius+=a,e.ray.intersectsSphere(aa)===!1)return;Ml.copy(s).invert(),cs.copy(e.ray).applyMatrix4(Ml);const o=a/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,d=i.index,h=i.attributes.position;if(d!==null){const m=Math.max(0,r.start),_=Math.min(d.count,r.start+r.count);for(let x=m,f=_-1;x<f;x+=c){const p=d.getX(x),M=d.getX(x+1),v=ra(this,e,cs,l,p,M,x);v&&t.push(v)}if(this.isLineLoop){const x=d.getX(_-1),f=d.getX(m),p=ra(this,e,cs,l,x,f,_-1);p&&t.push(p)}}else{const m=Math.max(0,r.start),_=Math.min(h.count,r.start+r.count);for(let x=m,f=_-1;x<f;x+=c){const p=ra(this,e,cs,l,x,x+1,x);p&&t.push(p)}if(this.isLineLoop){const x=ra(this,e,cs,l,_-1,m,_-1);x&&t.push(x)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,r=s.length;a<r;a++){const o=s[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}}function ra(n,e,t,i,s,a,r){const o=n.geometry.attributes.position;if(Pa.fromBufferAttribute(o,s),La.fromBufferAttribute(o,a),t.distanceSqToSegment(Pa,La,hr,Sl)>i)return;hr.applyMatrix4(n.matrixWorld);const c=e.ray.origin.distanceTo(hr);if(!(c<e.near||c>e.far))return{distance:c,point:Sl.clone().applyMatrix4(n.matrixWorld),index:r,face:null,faceIndex:null,barycoord:null,object:n}}const El=new D,wl=new D;class Da extends On{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[];for(let s=0,a=t.count;s<a;s+=2)El.fromBufferAttribute(t,s),wl.fromBufferAttribute(t,s+1),i[s]=s===0?0:i[s-1],i[s+1]=i[s]+El.distanceTo(wl);e.setAttribute("lineDistance",new at(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class qc extends Qt{constructor(e,t,i=yi,s,a,r,o=gn,l=gn,c,d=As,u=1){if(d!==As&&d!==Cs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const h={width:e,height:t,depth:u};super(h,s,a,r,o,l,d,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new No(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class Yc extends Qt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class Ot extends Ft{constructor(e=1,t=1,i=1,s=32,a=1,r=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:s,heightSegments:a,openEnded:r,thetaStart:o,thetaLength:l};const c=this;s=Math.floor(s),a=Math.floor(a);const d=[],u=[],h=[],m=[];let _=0;const x=[],f=i/2;let p=0;M(),r===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(d),this.setAttribute("position",new at(u,3)),this.setAttribute("normal",new at(h,3)),this.setAttribute("uv",new at(m,2));function M(){const g=new D,w=new D;let A=0;const y=(t-e)/i;for(let E=0;E<=a;E++){const S=[],b=E/a,R=b*(t-e)+e;for(let I=0;I<=s;I++){const L=I/s,z=L*l+o,N=Math.sin(z),F=Math.cos(z);w.x=R*N,w.y=-b*i+f,w.z=R*F,u.push(w.x,w.y,w.z),g.set(N,y,F).normalize(),h.push(g.x,g.y,g.z),m.push(L,1-b),S.push(_++)}x.push(S)}for(let E=0;E<s;E++)for(let S=0;S<a;S++){const b=x[S][E],R=x[S+1][E],I=x[S+1][E+1],L=x[S][E+1];(e>0||S!==0)&&(d.push(b,R,L),A+=3),(t>0||S!==a-1)&&(d.push(R,I,L),A+=3)}c.addGroup(p,A,0),p+=A}function v(g){const w=_,A=new oe,y=new D;let E=0;const S=g===!0?e:t,b=g===!0?1:-1;for(let I=1;I<=s;I++)u.push(0,f*b,0),h.push(0,b,0),m.push(.5,.5),_++;const R=_;for(let I=0;I<=s;I++){const z=I/s*l+o,N=Math.cos(z),F=Math.sin(z);y.x=S*F,y.y=f*b,y.z=S*N,u.push(y.x,y.y,y.z),h.push(0,b,0),A.x=N*.5+.5,A.y=F*.5*b+.5,m.push(A.x,A.y),_++}for(let I=0;I<s;I++){const L=w+I,z=R+I;g===!0?d.push(z,z+1,L):d.push(z+1,z,L),E+=3}c.addGroup(p,E,g===!0?1:2),p+=E}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ot(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class zo extends Ft{constructor(e=[],t=[],i=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:i,detail:s};const a=[],r=[];o(s),c(i),d(),this.setAttribute("position",new at(a,3)),this.setAttribute("normal",new at(a.slice(),3)),this.setAttribute("uv",new at(r,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(M){const v=new D,g=new D,w=new D;for(let A=0;A<t.length;A+=3)m(t[A+0],v),m(t[A+1],g),m(t[A+2],w),l(v,g,w,M)}function l(M,v,g,w){const A=w+1,y=[];for(let E=0;E<=A;E++){y[E]=[];const S=M.clone().lerp(g,E/A),b=v.clone().lerp(g,E/A),R=A-E;for(let I=0;I<=R;I++)I===0&&E===A?y[E][I]=S:y[E][I]=S.clone().lerp(b,I/R)}for(let E=0;E<A;E++)for(let S=0;S<2*(A-E)-1;S++){const b=Math.floor(S/2);S%2===0?(h(y[E][b+1]),h(y[E+1][b]),h(y[E][b])):(h(y[E][b+1]),h(y[E+1][b+1]),h(y[E+1][b]))}}function c(M){const v=new D;for(let g=0;g<a.length;g+=3)v.x=a[g+0],v.y=a[g+1],v.z=a[g+2],v.normalize().multiplyScalar(M),a[g+0]=v.x,a[g+1]=v.y,a[g+2]=v.z}function d(){const M=new D;for(let v=0;v<a.length;v+=3){M.x=a[v+0],M.y=a[v+1],M.z=a[v+2];const g=f(M)/2/Math.PI+.5,w=p(M)/Math.PI+.5;r.push(g,1-w)}_(),u()}function u(){for(let M=0;M<r.length;M+=6){const v=r[M+0],g=r[M+2],w=r[M+4],A=Math.max(v,g,w),y=Math.min(v,g,w);A>.9&&y<.1&&(v<.2&&(r[M+0]+=1),g<.2&&(r[M+2]+=1),w<.2&&(r[M+4]+=1))}}function h(M){a.push(M.x,M.y,M.z)}function m(M,v){const g=M*3;v.x=e[g+0],v.y=e[g+1],v.z=e[g+2]}function _(){const M=new D,v=new D,g=new D,w=new D,A=new oe,y=new oe,E=new oe;for(let S=0,b=0;S<a.length;S+=9,b+=6){M.set(a[S+0],a[S+1],a[S+2]),v.set(a[S+3],a[S+4],a[S+5]),g.set(a[S+6],a[S+7],a[S+8]),A.set(r[b+0],r[b+1]),y.set(r[b+2],r[b+3]),E.set(r[b+4],r[b+5]),w.copy(M).add(v).add(g).divideScalar(3);const R=f(w);x(A,b+0,M,R),x(y,b+2,v,R),x(E,b+4,g,R)}}function x(M,v,g,w){w<0&&M.x===1&&(r[v]=M.x-1),g.x===0&&g.z===0&&(r[v]=w/2/Math.PI+.5)}function f(M){return Math.atan2(M.z,-M.x)}function p(M){return Math.atan2(-M.y,Math.sqrt(M.x*M.x+M.z*M.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new zo(e.vertices,e.indices,e.radius,e.details)}}const oa=new D,la=new D,pr=new D,ca=new dn;class yo extends Ft{constructor(e=null,t=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:e,thresholdAngle:t},e!==null){const s=Math.pow(10,4),a=Math.cos(xs*t),r=e.getIndex(),o=e.getAttribute("position"),l=r?r.count:o.count,c=[0,0,0],d=["a","b","c"],u=new Array(3),h={},m=[];for(let _=0;_<l;_+=3){r?(c[0]=r.getX(_),c[1]=r.getX(_+1),c[2]=r.getX(_+2)):(c[0]=_,c[1]=_+1,c[2]=_+2);const{a:x,b:f,c:p}=ca;if(x.fromBufferAttribute(o,c[0]),f.fromBufferAttribute(o,c[1]),p.fromBufferAttribute(o,c[2]),ca.getNormal(pr),u[0]=`${Math.round(x.x*s)},${Math.round(x.y*s)},${Math.round(x.z*s)}`,u[1]=`${Math.round(f.x*s)},${Math.round(f.y*s)},${Math.round(f.z*s)}`,u[2]=`${Math.round(p.x*s)},${Math.round(p.y*s)},${Math.round(p.z*s)}`,!(u[0]===u[1]||u[1]===u[2]||u[2]===u[0]))for(let M=0;M<3;M++){const v=(M+1)%3,g=u[M],w=u[v],A=ca[d[M]],y=ca[d[v]],E=`${g}_${w}`,S=`${w}_${g}`;S in h&&h[S]?(pr.dot(h[S].normal)<=a&&(m.push(A.x,A.y,A.z),m.push(y.x,y.y,y.z)),h[S]=null):E in h||(h[E]={index0:c[M],index1:c[v],normal:pr.clone()})}}for(const _ in h)if(h[_]){const{index0:x,index1:f}=h[_];oa.fromBufferAttribute(o,x),la.fromBufferAttribute(o,f),m.push(oa.x,oa.y,oa.z),m.push(la.x,la.y,la.z)}this.setAttribute("position",new at(m,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}}class Cn{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(e,t){const i=this.getUtoTmapping(e);return this.getPoint(i,t)}getPoints(e=5){const t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return t}getSpacedPoints(e=5){const t=[];for(let i=0;i<=e;i++)t.push(this.getPointAt(i/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let i,s=this.getPoint(0),a=0;t.push(0);for(let r=1;r<=e;r++)i=this.getPoint(r/e),a+=i.distanceTo(s),t.push(a),s=i;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){const i=this.getLengths();let s=0;const a=i.length;let r;t?r=t:r=e*i[a-1];let o=0,l=a-1,c;for(;o<=l;)if(s=Math.floor(o+(l-o)/2),c=i[s]-r,c<0)o=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,i[s]===r)return s/(a-1);const d=i[s],h=i[s+1]-d,m=(r-d)/h;return(s+m)/(a-1)}getTangent(e,t){let s=e-1e-4,a=e+1e-4;s<0&&(s=0),a>1&&(a=1);const r=this.getPoint(s),o=this.getPoint(a),l=t||(r.isVector2?new oe:new D);return l.copy(o).sub(r).normalize(),l}getTangentAt(e,t){const i=this.getUtoTmapping(e);return this.getTangent(i,t)}computeFrenetFrames(e,t=!1){const i=new D,s=[],a=[],r=[],o=new D,l=new dt;for(let m=0;m<=e;m++){const _=m/e;s[m]=this.getTangentAt(_,new D)}a[0]=new D,r[0]=new D;let c=Number.MAX_VALUE;const d=Math.abs(s[0].x),u=Math.abs(s[0].y),h=Math.abs(s[0].z);d<=c&&(c=d,i.set(1,0,0)),u<=c&&(c=u,i.set(0,1,0)),h<=c&&i.set(0,0,1),o.crossVectors(s[0],i).normalize(),a[0].crossVectors(s[0],o),r[0].crossVectors(s[0],a[0]);for(let m=1;m<=e;m++){if(a[m]=a[m-1].clone(),r[m]=r[m-1].clone(),o.crossVectors(s[m-1],s[m]),o.length()>Number.EPSILON){o.normalize();const _=Math.acos(je(s[m-1].dot(s[m]),-1,1));a[m].applyMatrix4(l.makeRotationAxis(o,_))}r[m].crossVectors(s[m],a[m])}if(t===!0){let m=Math.acos(je(a[0].dot(a[e]),-1,1));m/=e,s[0].dot(o.crossVectors(a[0],a[e]))>0&&(m=-m);for(let _=1;_<=e;_++)a[_].applyMatrix4(l.makeRotationAxis(s[_],m*_)),r[_].crossVectors(s[_],a[_])}return{tangents:s,normals:a,binormals:r}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class ko extends Cn{constructor(e=0,t=0,i=1,s=1,a=0,r=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=i,this.yRadius=s,this.aStartAngle=a,this.aEndAngle=r,this.aClockwise=o,this.aRotation=l}getPoint(e,t=new oe){const i=t,s=Math.PI*2;let a=this.aEndAngle-this.aStartAngle;const r=Math.abs(a)<Number.EPSILON;for(;a<0;)a+=s;for(;a>s;)a-=s;a<Number.EPSILON&&(r?a=0:a=s),this.aClockwise===!0&&!r&&(a===s?a=-s:a=a-s);const o=this.aStartAngle+e*a;let l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const d=Math.cos(this.aRotation),u=Math.sin(this.aRotation),h=l-this.aX,m=c-this.aY;l=h*d-m*u+this.aX,c=h*u+m*d+this.aY}return i.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class Ch extends ko{constructor(e,t,i,s,a,r){super(e,t,i,i,s,a,r),this.isArcCurve=!0,this.type="ArcCurve"}}function Bo(){let n=0,e=0,t=0,i=0;function s(a,r,o,l){n=a,e=o,t=-3*a+3*r-2*o-l,i=2*a-2*r+o+l}return{initCatmullRom:function(a,r,o,l,c){s(r,o,c*(o-a),c*(l-r))},initNonuniformCatmullRom:function(a,r,o,l,c,d,u){let h=(r-a)/c-(o-a)/(c+d)+(o-r)/d,m=(o-r)/d-(l-r)/(d+u)+(l-o)/u;h*=d,m*=d,s(r,o,h,m)},calc:function(a){const r=a*a,o=r*a;return n+e*a+t*r+i*o}}}const da=new D,fr=new Bo,mr=new Bo,gr=new Bo;class Rh extends Cn{constructor(e=[],t=!1,i="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=i,this.tension=s}getPoint(e,t=new D){const i=t,s=this.points,a=s.length,r=(a-(this.closed?0:1))*e;let o=Math.floor(r),l=r-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/a)+1)*a:l===0&&o===a-1&&(o=a-2,l=1);let c,d;this.closed||o>0?c=s[(o-1)%a]:(da.subVectors(s[0],s[1]).add(s[0]),c=da);const u=s[o%a],h=s[(o+1)%a];if(this.closed||o+2<a?d=s[(o+2)%a]:(da.subVectors(s[a-1],s[a-2]).add(s[a-1]),d=da),this.curveType==="centripetal"||this.curveType==="chordal"){const m=this.curveType==="chordal"?.5:.25;let _=Math.pow(c.distanceToSquared(u),m),x=Math.pow(u.distanceToSquared(h),m),f=Math.pow(h.distanceToSquared(d),m);x<1e-4&&(x=1),_<1e-4&&(_=x),f<1e-4&&(f=x),fr.initNonuniformCatmullRom(c.x,u.x,h.x,d.x,_,x,f),mr.initNonuniformCatmullRom(c.y,u.y,h.y,d.y,_,x,f),gr.initNonuniformCatmullRom(c.z,u.z,h.z,d.z,_,x,f)}else this.curveType==="catmullrom"&&(fr.initCatmullRom(c.x,u.x,h.x,d.x,this.tension),mr.initCatmullRom(c.y,u.y,h.y,d.y,this.tension),gr.initCatmullRom(c.z,u.z,h.z,d.z,this.tension));return i.set(fr.calc(l),mr.calc(l),gr.calc(l)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){const s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const s=e.points[t];this.points.push(new D().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function Tl(n,e,t,i,s){const a=(i-e)*.5,r=(s-t)*.5,o=n*n,l=n*o;return(2*t-2*i+a+r)*l+(-3*t+3*i-2*a-r)*o+a*n+t}function Ph(n,e){const t=1-n;return t*t*e}function Lh(n,e){return 2*(1-n)*n*e}function Dh(n,e){return n*n*e}function ys(n,e,t,i){return Ph(n,e)+Lh(n,t)+Dh(n,i)}function Ih(n,e){const t=1-n;return t*t*t*e}function Uh(n,e){const t=1-n;return 3*t*t*n*e}function Nh(n,e){return 3*(1-n)*n*n*e}function Fh(n,e){return n*n*n*e}function bs(n,e,t,i,s){return Ih(n,e)+Uh(n,t)+Nh(n,i)+Fh(n,s)}class Zc extends Cn{constructor(e=new oe,t=new oe,i=new oe,s=new oe){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=i,this.v3=s}getPoint(e,t=new oe){const i=t,s=this.v0,a=this.v1,r=this.v2,o=this.v3;return i.set(bs(e,s.x,a.x,r.x,o.x),bs(e,s.y,a.y,r.y,o.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class Oh extends Cn{constructor(e=new D,t=new D,i=new D,s=new D){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=i,this.v3=s}getPoint(e,t=new D){const i=t,s=this.v0,a=this.v1,r=this.v2,o=this.v3;return i.set(bs(e,s.x,a.x,r.x,o.x),bs(e,s.y,a.y,r.y,o.y),bs(e,s.z,a.z,r.z,o.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class Jc extends Cn{constructor(e=new oe,t=new oe){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new oe){const i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new oe){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class zh extends Cn{constructor(e=new D,t=new D){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new D){const i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new D){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Kc extends Cn{constructor(e=new oe,t=new oe,i=new oe){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new oe){const i=t,s=this.v0,a=this.v1,r=this.v2;return i.set(ys(e,s.x,a.x,r.x),ys(e,s.y,a.y,r.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class kh extends Cn{constructor(e=new D,t=new D,i=new D){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new D){const i=t,s=this.v0,a=this.v1,r=this.v2;return i.set(ys(e,s.x,a.x,r.x),ys(e,s.y,a.y,r.y),ys(e,s.z,a.z,r.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Qc extends Cn{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new oe){const i=t,s=this.points,a=(s.length-1)*e,r=Math.floor(a),o=a-r,l=s[r===0?r:r-1],c=s[r],d=s[r>s.length-2?s.length-1:r+1],u=s[r>s.length-3?s.length-1:r+2];return i.set(Tl(o,l.x,c.x,d.x,u.x),Tl(o,l.y,c.y,d.y,u.y)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const s=e.points[t];this.points.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){const s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const s=e.points[t];this.points.push(new oe().fromArray(s))}return this}}var bo=Object.freeze({__proto__:null,ArcCurve:Ch,CatmullRomCurve3:Rh,CubicBezierCurve:Zc,CubicBezierCurve3:Oh,EllipseCurve:ko,LineCurve:Jc,LineCurve3:zh,QuadraticBezierCurve:Kc,QuadraticBezierCurve3:kh,SplineCurve:Qc});class Bh extends Cn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const i=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new bo[i](t,e))}return this}getPoint(e,t){const i=e*this.getLength(),s=this.getCurveLengths();let a=0;for(;a<s.length;){if(s[a]>=i){const r=s[a]-i,o=this.curves[a],l=o.getLength(),c=l===0?0:1-r/l;return o.getPointAt(c,t)}a++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let i=0,s=this.curves.length;i<s;i++)t+=this.curves[i].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let i;for(let s=0,a=this.curves;s<a.length;s++){const r=a[s],o=r.isEllipseCurve?e*2:r.isLineCurve||r.isLineCurve3?1:r.isSplineCurve?e*r.points.length:e,l=r.getPoints(o);for(let c=0;c<l.length;c++){const d=l[c];i&&i.equals(d)||(t.push(d),i=d)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){const s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,i=this.curves.length;t<i;t++){const s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){const s=e.curves[t];this.curves.push(new bo[s.type]().fromJSON(s))}return this}}class Mo extends Bh{constructor(e){super(),this.type="Path",this.currentPoint=new oe,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,i=e.length;t<i;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const i=new Jc(this.currentPoint.clone(),new oe(e,t));return this.curves.push(i),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,i,s){const a=new Kc(this.currentPoint.clone(),new oe(e,t),new oe(i,s));return this.curves.push(a),this.currentPoint.set(i,s),this}bezierCurveTo(e,t,i,s,a,r){const o=new Zc(this.currentPoint.clone(),new oe(e,t),new oe(i,s),new oe(a,r));return this.curves.push(o),this.currentPoint.set(a,r),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),i=new Qc(t);return this.curves.push(i),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,i,s,a,r){const o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+o,t+l,i,s,a,r),this}absarc(e,t,i,s,a,r){return this.absellipse(e,t,i,i,s,a,r),this}ellipse(e,t,i,s,a,r,o,l){const c=this.currentPoint.x,d=this.currentPoint.y;return this.absellipse(e+c,t+d,i,s,a,r,o,l),this}absellipse(e,t,i,s,a,r,o,l){const c=new ko(e,t,i,s,a,r,o,l);if(this.curves.length>0){const u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);const d=c.getPoint(1);return this.currentPoint.copy(d),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class Ea extends Mo{constructor(e){super(e),this.uuid=es(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let i=0,s=this.holes.length;i<s;i++)t[i]=this.holes[i].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){const s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,i=this.holes.length;t<i;t++){const s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){const s=e.holes[t];this.holes.push(new Mo().fromJSON(s))}return this}}function Hh(n,e,t=2){const i=e&&e.length,s=i?e[0]*t:n.length;let a=ed(n,0,s,t,!0);const r=[];if(!a||a.next===a.prev)return r;let o,l,c;if(i&&(a=jh(n,e,a,t)),n.length>80*t){o=1/0,l=1/0;let d=-1/0,u=-1/0;for(let h=t;h<s;h+=t){const m=n[h],_=n[h+1];m<o&&(o=m),_<l&&(l=_),m>d&&(d=m),_>u&&(u=_)}c=Math.max(d-o,u-l),c=c!==0?32767/c:0}return Ps(a,r,t,o,l,c,0),r}function ed(n,e,t,i,s){let a;if(s===ip(n,e,t,i)>0)for(let r=e;r<t;r+=i)a=Al(r/i|0,n[r],n[r+1],a);else for(let r=t-i;r>=e;r-=i)a=Al(r/i|0,n[r],n[r+1],a);return a&&Qi(a,a.next)&&(Ds(a),a=a.next),a}function Mi(n,e){if(!n)return n;e||(e=n);let t=n,i;do if(i=!1,!t.steiner&&(Qi(t,t.next)||Et(t.prev,t,t.next)===0)){if(Ds(t),t=e=t.prev,t===t.next)break;i=!0}else t=t.next;while(i||t!==e);return e}function Ps(n,e,t,i,s,a,r){if(!n)return;!r&&a&&Jh(n,i,s,a);let o=n;for(;n.prev!==n.next;){const l=n.prev,c=n.next;if(a?Vh(n,i,s,a):Gh(n)){e.push(l.i,n.i,c.i),Ds(n),n=c.next,o=c.next;continue}if(n=c,n===o){r?r===1?(n=$h(Mi(n),e),Ps(n,e,t,i,s,a,2)):r===2&&Wh(n,e,t,i,s,a):Ps(Mi(n),e,t,i,s,a,1);break}}}function Gh(n){const e=n.prev,t=n,i=n.next;if(Et(e,t,i)>=0)return!1;const s=e.x,a=t.x,r=i.x,o=e.y,l=t.y,c=i.y,d=Math.min(s,a,r),u=Math.min(o,l,c),h=Math.max(s,a,r),m=Math.max(o,l,c);let _=i.next;for(;_!==e;){if(_.x>=d&&_.x<=h&&_.y>=u&&_.y<=m&&fs(s,o,a,l,r,c,_.x,_.y)&&Et(_.prev,_,_.next)>=0)return!1;_=_.next}return!0}function Vh(n,e,t,i){const s=n.prev,a=n,r=n.next;if(Et(s,a,r)>=0)return!1;const o=s.x,l=a.x,c=r.x,d=s.y,u=a.y,h=r.y,m=Math.min(o,l,c),_=Math.min(d,u,h),x=Math.max(o,l,c),f=Math.max(d,u,h),p=So(m,_,e,t,i),M=So(x,f,e,t,i);let v=n.prevZ,g=n.nextZ;for(;v&&v.z>=p&&g&&g.z<=M;){if(v.x>=m&&v.x<=x&&v.y>=_&&v.y<=f&&v!==s&&v!==r&&fs(o,d,l,u,c,h,v.x,v.y)&&Et(v.prev,v,v.next)>=0||(v=v.prevZ,g.x>=m&&g.x<=x&&g.y>=_&&g.y<=f&&g!==s&&g!==r&&fs(o,d,l,u,c,h,g.x,g.y)&&Et(g.prev,g,g.next)>=0))return!1;g=g.nextZ}for(;v&&v.z>=p;){if(v.x>=m&&v.x<=x&&v.y>=_&&v.y<=f&&v!==s&&v!==r&&fs(o,d,l,u,c,h,v.x,v.y)&&Et(v.prev,v,v.next)>=0)return!1;v=v.prevZ}for(;g&&g.z<=M;){if(g.x>=m&&g.x<=x&&g.y>=_&&g.y<=f&&g!==s&&g!==r&&fs(o,d,l,u,c,h,g.x,g.y)&&Et(g.prev,g,g.next)>=0)return!1;g=g.nextZ}return!0}function $h(n,e){let t=n;do{const i=t.prev,s=t.next.next;!Qi(i,s)&&nd(i,t,t.next,s)&&Ls(i,s)&&Ls(s,i)&&(e.push(i.i,t.i,s.i),Ds(t),Ds(t.next),t=n=s),t=t.next}while(t!==n);return Mi(t)}function Wh(n,e,t,i,s,a){let r=n;do{let o=r.next.next;for(;o!==r.prev;){if(r.i!==o.i&&ep(r,o)){let l=id(r,o);r=Mi(r,r.next),l=Mi(l,l.next),Ps(r,e,t,i,s,a,0),Ps(l,e,t,i,s,a,0);return}o=o.next}r=r.next}while(r!==n)}function jh(n,e,t,i){const s=[];for(let a=0,r=e.length;a<r;a++){const o=e[a]*i,l=a<r-1?e[a+1]*i:n.length,c=ed(n,o,l,i,!1);c===c.next&&(c.steiner=!0),s.push(Qh(c))}s.sort(Xh);for(let a=0;a<s.length;a++)t=qh(s[a],t);return t}function Xh(n,e){let t=n.x-e.x;if(t===0&&(t=n.y-e.y,t===0)){const i=(n.next.y-n.y)/(n.next.x-n.x),s=(e.next.y-e.y)/(e.next.x-e.x);t=i-s}return t}function qh(n,e){const t=Yh(n,e);if(!t)return e;const i=id(t,n);return Mi(i,i.next),Mi(t,t.next)}function Yh(n,e){let t=e;const i=n.x,s=n.y;let a=-1/0,r;if(Qi(n,t))return t;do{if(Qi(n,t.next))return t.next;if(s<=t.y&&s>=t.next.y&&t.next.y!==t.y){const u=t.x+(s-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(u<=i&&u>a&&(a=u,r=t.x<t.next.x?t:t.next,u===i))return r}t=t.next}while(t!==e);if(!r)return null;const o=r,l=r.x,c=r.y;let d=1/0;t=r;do{if(i>=t.x&&t.x>=l&&i!==t.x&&td(s<c?i:a,s,l,c,s<c?a:i,s,t.x,t.y)){const u=Math.abs(s-t.y)/(i-t.x);Ls(t,n)&&(u<d||u===d&&(t.x>r.x||t.x===r.x&&Zh(r,t)))&&(r=t,d=u)}t=t.next}while(t!==o);return r}function Zh(n,e){return Et(n.prev,n,e.prev)<0&&Et(e.next,n,n.next)<0}function Jh(n,e,t,i){let s=n;do s.z===0&&(s.z=So(s.x,s.y,e,t,i)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==n);s.prevZ.nextZ=null,s.prevZ=null,Kh(s)}function Kh(n){let e,t=1;do{let i=n,s;n=null;let a=null;for(e=0;i;){e++;let r=i,o=0;for(let c=0;c<t&&(o++,r=r.nextZ,!!r);c++);let l=t;for(;o>0||l>0&&r;)o!==0&&(l===0||!r||i.z<=r.z)?(s=i,i=i.nextZ,o--):(s=r,r=r.nextZ,l--),a?a.nextZ=s:n=s,s.prevZ=a,a=s;i=r}a.nextZ=null,t*=2}while(e>1);return n}function So(n,e,t,i,s){return n=(n-t)*s|0,e=(e-i)*s|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,n|e<<1}function Qh(n){let e=n,t=n;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==n);return t}function td(n,e,t,i,s,a,r,o){return(s-r)*(e-o)>=(n-r)*(a-o)&&(n-r)*(i-o)>=(t-r)*(e-o)&&(t-r)*(a-o)>=(s-r)*(i-o)}function fs(n,e,t,i,s,a,r,o){return!(n===r&&e===o)&&td(n,e,t,i,s,a,r,o)}function ep(n,e){return n.next.i!==e.i&&n.prev.i!==e.i&&!tp(n,e)&&(Ls(n,e)&&Ls(e,n)&&np(n,e)&&(Et(n.prev,n,e.prev)||Et(n,e.prev,e))||Qi(n,e)&&Et(n.prev,n,n.next)>0&&Et(e.prev,e,e.next)>0)}function Et(n,e,t){return(e.y-n.y)*(t.x-e.x)-(e.x-n.x)*(t.y-e.y)}function Qi(n,e){return n.x===e.x&&n.y===e.y}function nd(n,e,t,i){const s=ha(Et(n,e,t)),a=ha(Et(n,e,i)),r=ha(Et(t,i,n)),o=ha(Et(t,i,e));return!!(s!==a&&r!==o||s===0&&ua(n,t,e)||a===0&&ua(n,i,e)||r===0&&ua(t,n,i)||o===0&&ua(t,e,i))}function ua(n,e,t){return e.x<=Math.max(n.x,t.x)&&e.x>=Math.min(n.x,t.x)&&e.y<=Math.max(n.y,t.y)&&e.y>=Math.min(n.y,t.y)}function ha(n){return n>0?1:n<0?-1:0}function tp(n,e){let t=n;do{if(t.i!==n.i&&t.next.i!==n.i&&t.i!==e.i&&t.next.i!==e.i&&nd(t,t.next,n,e))return!0;t=t.next}while(t!==n);return!1}function Ls(n,e){return Et(n.prev,n,n.next)<0?Et(n,e,n.next)>=0&&Et(n,n.prev,e)>=0:Et(n,e,n.prev)<0||Et(n,n.next,e)<0}function np(n,e){let t=n,i=!1;const s=(n.x+e.x)/2,a=(n.y+e.y)/2;do t.y>a!=t.next.y>a&&t.next.y!==t.y&&s<(t.next.x-t.x)*(a-t.y)/(t.next.y-t.y)+t.x&&(i=!i),t=t.next;while(t!==n);return i}function id(n,e){const t=Eo(n.i,n.x,n.y),i=Eo(e.i,e.x,e.y),s=n.next,a=e.prev;return n.next=e,e.prev=n,t.next=s,s.prev=t,i.next=t,t.prev=i,a.next=i,i.prev=a,i}function Al(n,e,t,i){const s=Eo(n,e,t);return i?(s.next=i.next,s.prev=i,i.next.prev=s,i.next=s):(s.prev=s,s.next=s),s}function Ds(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function Eo(n,e,t){return{i:n,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function ip(n,e,t,i){let s=0;for(let a=e,r=t-i;a<t;a+=i)s+=(n[r]-n[a])*(n[a+1]+n[r+1]),r=a;return s}class sp{static triangulate(e,t,i=2){return Hh(e,t,i)}}class Hi{static area(e){const t=e.length;let i=0;for(let s=t-1,a=0;a<t;s=a++)i+=e[s].x*e[a].y-e[a].x*e[s].y;return i*.5}static isClockWise(e){return Hi.area(e)<0}static triangulateShape(e,t){const i=[],s=[],a=[];Cl(e),Rl(i,e);let r=e.length;t.forEach(Cl);for(let l=0;l<t.length;l++)s.push(r),r+=t[l].length,Rl(i,t[l]);const o=sp.triangulate(i,s);for(let l=0;l<o.length;l+=3)a.push(o.slice(l,l+3));return a}}function Cl(n){const e=n.length;e>2&&n[e-1].equals(n[0])&&n.pop()}function Rl(n,e){for(let t=0;t<e.length;t++)n.push(e[t].x),n.push(e[t].y)}class Ho extends Ft{constructor(e=new Ea([new oe(.5,.5),new oe(-.5,.5),new oe(-.5,-.5),new oe(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];const i=this,s=[],a=[];for(let o=0,l=e.length;o<l;o++){const c=e[o];r(c)}this.setAttribute("position",new at(s,3)),this.setAttribute("uv",new at(a,2)),this.computeVertexNormals();function r(o){const l=[],c=t.curveSegments!==void 0?t.curveSegments:12,d=t.steps!==void 0?t.steps:1,u=t.depth!==void 0?t.depth:1;let h=t.bevelEnabled!==void 0?t.bevelEnabled:!0,m=t.bevelThickness!==void 0?t.bevelThickness:.2,_=t.bevelSize!==void 0?t.bevelSize:m-.1,x=t.bevelOffset!==void 0?t.bevelOffset:0,f=t.bevelSegments!==void 0?t.bevelSegments:3;const p=t.extrudePath,M=t.UVGenerator!==void 0?t.UVGenerator:ap;let v,g=!1,w,A,y,E;p&&(v=p.getSpacedPoints(d),g=!0,h=!1,w=p.computeFrenetFrames(d,!1),A=new D,y=new D,E=new D),h||(f=0,m=0,_=0,x=0);const S=o.extractPoints(c);let b=S.shape;const R=S.holes;if(!Hi.isClockWise(b)){b=b.reverse();for(let ne=0,Q=R.length;ne<Q;ne++){const J=R[ne];Hi.isClockWise(J)&&(R[ne]=J.reverse())}}function L(ne){const J=10000000000000001e-36;let Z=ne[0];for(let he=1;he<=ne.length;he++){const se=he%ne.length,pe=ne[se],He=pe.x-Z.x,ke=pe.y-Z.y,P=He*He+ke*ke,T=Math.max(Math.abs(pe.x),Math.abs(pe.y),Math.abs(Z.x),Math.abs(Z.y)),V=J*T*T;if(P<=V){ne.splice(se,1),he--;continue}Z=pe}}L(b),R.forEach(L);const z=R.length,N=b;for(let ne=0;ne<z;ne++){const Q=R[ne];b=b.concat(Q)}function F(ne,Q,J){return Q||console.error("THREE.ExtrudeGeometry: vec does not exist"),ne.clone().addScaledVector(Q,J)}const B=b.length;function $(ne,Q,J){let Z,he,se;const pe=ne.x-Q.x,He=ne.y-Q.y,ke=J.x-ne.x,P=J.y-ne.y,T=pe*pe+He*He,V=pe*P-He*ke;if(Math.abs(V)>Number.EPSILON){const X=Math.sqrt(T),te=Math.sqrt(ke*ke+P*P),q=Q.x-He/X,Pe=Q.y+pe/X,de=J.x-P/te,Ae=J.y+ke/te,Ce=((de-q)*P-(Ae-Pe)*ke)/(pe*P-He*ke);Z=q+pe*Ce-ne.x,he=Pe+He*Ce-ne.y;const ae=Z*Z+he*he;if(ae<=2)return new oe(Z,he);se=Math.sqrt(ae/2)}else{let X=!1;pe>Number.EPSILON?ke>Number.EPSILON&&(X=!0):pe<-Number.EPSILON?ke<-Number.EPSILON&&(X=!0):Math.sign(He)===Math.sign(P)&&(X=!0),X?(Z=-He,he=pe,se=Math.sqrt(T)):(Z=pe,he=He,se=Math.sqrt(T/2))}return new oe(Z/se,he/se)}const K=[];for(let ne=0,Q=N.length,J=Q-1,Z=ne+1;ne<Q;ne++,J++,Z++)J===Q&&(J=0),Z===Q&&(Z=0),K[ne]=$(N[ne],N[J],N[Z]);const ue=[];let ge,Oe=K.concat();for(let ne=0,Q=z;ne<Q;ne++){const J=R[ne];ge=[];for(let Z=0,he=J.length,se=he-1,pe=Z+1;Z<he;Z++,se++,pe++)se===he&&(se=0),pe===he&&(pe=0),ge[Z]=$(J[Z],J[se],J[pe]);ue.push(ge),Oe=Oe.concat(ge)}let qe;if(f===0)qe=Hi.triangulateShape(N,R);else{const ne=[],Q=[];for(let J=0;J<f;J++){const Z=J/f,he=m*Math.cos(Z*Math.PI/2),se=_*Math.sin(Z*Math.PI/2)+x;for(let pe=0,He=N.length;pe<He;pe++){const ke=F(N[pe],K[pe],se);De(ke.x,ke.y,-he),Z===0&&ne.push(ke)}for(let pe=0,He=z;pe<He;pe++){const ke=R[pe];ge=ue[pe];const P=[];for(let T=0,V=ke.length;T<V;T++){const X=F(ke[T],ge[T],se);De(X.x,X.y,-he),Z===0&&P.push(X)}Z===0&&Q.push(P)}}qe=Hi.triangulateShape(ne,Q)}const Qe=qe.length,Ke=_+x;for(let ne=0;ne<B;ne++){const Q=h?F(b[ne],Oe[ne],Ke):b[ne];g?(y.copy(w.normals[0]).multiplyScalar(Q.x),A.copy(w.binormals[0]).multiplyScalar(Q.y),E.copy(v[0]).add(y).add(A),De(E.x,E.y,E.z)):De(Q.x,Q.y,0)}for(let ne=1;ne<=d;ne++)for(let Q=0;Q<B;Q++){const J=h?F(b[Q],Oe[Q],Ke):b[Q];g?(y.copy(w.normals[ne]).multiplyScalar(J.x),A.copy(w.binormals[ne]).multiplyScalar(J.y),E.copy(v[ne]).add(y).add(A),De(E.x,E.y,E.z)):De(J.x,J.y,u/d*ne)}for(let ne=f-1;ne>=0;ne--){const Q=ne/f,J=m*Math.cos(Q*Math.PI/2),Z=_*Math.sin(Q*Math.PI/2)+x;for(let he=0,se=N.length;he<se;he++){const pe=F(N[he],K[he],Z);De(pe.x,pe.y,u+J)}for(let he=0,se=R.length;he<se;he++){const pe=R[he];ge=ue[he];for(let He=0,ke=pe.length;He<ke;He++){const P=F(pe[He],ge[He],Z);g?De(P.x,P.y+v[d-1].y,v[d-1].x+J):De(P.x,P.y,u+J)}}}Y(),ie();function Y(){const ne=s.length/3;if(h){let Q=0,J=B*Q;for(let Z=0;Z<Qe;Z++){const he=qe[Z];Te(he[2]+J,he[1]+J,he[0]+J)}Q=d+f*2,J=B*Q;for(let Z=0;Z<Qe;Z++){const he=qe[Z];Te(he[0]+J,he[1]+J,he[2]+J)}}else{for(let Q=0;Q<Qe;Q++){const J=qe[Q];Te(J[2],J[1],J[0])}for(let Q=0;Q<Qe;Q++){const J=qe[Q];Te(J[0]+B*d,J[1]+B*d,J[2]+B*d)}}i.addGroup(ne,s.length/3-ne,0)}function ie(){const ne=s.length/3;let Q=0;Se(N,Q),Q+=N.length;for(let J=0,Z=R.length;J<Z;J++){const he=R[J];Se(he,Q),Q+=he.length}i.addGroup(ne,s.length/3-ne,1)}function Se(ne,Q){let J=ne.length;for(;--J>=0;){const Z=J;let he=J-1;he<0&&(he=ne.length-1);for(let se=0,pe=d+f*2;se<pe;se++){const He=B*se,ke=B*(se+1),P=Q+Z+He,T=Q+he+He,V=Q+he+ke,X=Q+Z+ke;Ye(P,T,V,X)}}}function De(ne,Q,J){l.push(ne),l.push(Q),l.push(J)}function Te(ne,Q,J){mt(ne),mt(Q),mt(J);const Z=s.length/3,he=M.generateTopUV(i,s,Z-3,Z-2,Z-1);U(he[0]),U(he[1]),U(he[2])}function Ye(ne,Q,J,Z){mt(ne),mt(Q),mt(Z),mt(Q),mt(J),mt(Z);const he=s.length/3,se=M.generateSideWallUV(i,s,he-6,he-3,he-2,he-1);U(se[0]),U(se[1]),U(se[3]),U(se[1]),U(se[2]),U(se[3])}function mt(ne){s.push(l[ne*3+0]),s.push(l[ne*3+1]),s.push(l[ne*3+2])}function U(ne){a.push(ne.x),a.push(ne.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes,i=this.parameters.options;return rp(t,i,e)}static fromJSON(e,t){const i=[];for(let a=0,r=e.shapes.length;a<r;a++){const o=t[e.shapes[a]];i.push(o)}const s=e.options.extrudePath;return s!==void 0&&(e.options.extrudePath=new bo[s.type]().fromJSON(s)),new Ho(i,e.options)}}const ap={generateTopUV:function(n,e,t,i,s){const a=e[t*3],r=e[t*3+1],o=e[i*3],l=e[i*3+1],c=e[s*3],d=e[s*3+1];return[new oe(a,r),new oe(o,l),new oe(c,d)]},generateSideWallUV:function(n,e,t,i,s,a){const r=e[t*3],o=e[t*3+1],l=e[t*3+2],c=e[i*3],d=e[i*3+1],u=e[i*3+2],h=e[s*3],m=e[s*3+1],_=e[s*3+2],x=e[a*3],f=e[a*3+1],p=e[a*3+2];return Math.abs(o-d)<Math.abs(r-c)?[new oe(r,1-l),new oe(c,1-u),new oe(h,1-_),new oe(x,1-p)]:[new oe(o,1-l),new oe(d,1-u),new oe(m,1-_),new oe(f,1-p)]}};function rp(n,e,t){if(t.shapes=[],Array.isArray(n))for(let i=0,s=n.length;i<s;i++){const a=n[i];t.shapes.push(a.uuid)}else t.shapes.push(n.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}class Gi extends zo{constructor(e=1,t=0){const i=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],s=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(i,s,e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Gi(e.radius,e.detail)}}class Ns extends Ft{constructor(e=1,t=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:s};const a=e/2,r=t/2,o=Math.floor(i),l=Math.floor(s),c=o+1,d=l+1,u=e/o,h=t/l,m=[],_=[],x=[],f=[];for(let p=0;p<d;p++){const M=p*h-r;for(let v=0;v<c;v++){const g=v*u-a;_.push(g,-M,0),x.push(0,0,1),f.push(v/o),f.push(1-p/l)}}for(let p=0;p<l;p++)for(let M=0;M<o;M++){const v=M+c*p,g=M+c*(p+1),w=M+1+c*(p+1),A=M+1+c*p;m.push(v,g,A),m.push(g,w,A)}this.setIndex(m),this.setAttribute("position",new at(_,3)),this.setAttribute("normal",new at(x,3)),this.setAttribute("uv",new at(f,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ns(e.width,e.height,e.widthSegments,e.heightSegments)}}class Fs extends Ft{constructor(e=1,t=32,i=16,s=0,a=Math.PI*2,r=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:s,phiLength:a,thetaStart:r,thetaLength:o},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));const l=Math.min(r+o,Math.PI);let c=0;const d=[],u=new D,h=new D,m=[],_=[],x=[],f=[];for(let p=0;p<=i;p++){const M=[],v=p/i;let g=0;p===0&&r===0?g=.5/t:p===i&&l===Math.PI&&(g=-.5/t);for(let w=0;w<=t;w++){const A=w/t;u.x=-e*Math.cos(s+A*a)*Math.sin(r+v*o),u.y=e*Math.cos(r+v*o),u.z=e*Math.sin(s+A*a)*Math.sin(r+v*o),_.push(u.x,u.y,u.z),h.copy(u).normalize(),x.push(h.x,h.y,h.z),f.push(A+g,1-v),M.push(c++)}d.push(M)}for(let p=0;p<i;p++)for(let M=0;M<t;M++){const v=d[p][M+1],g=d[p][M],w=d[p+1][M],A=d[p+1][M+1];(p!==0||r>0)&&m.push(v,g,A),(p!==i-1||l<Math.PI)&&m.push(g,w,A)}this.setIndex(m),this.setAttribute("position",new at(_,3)),this.setAttribute("normal",new at(x,3)),this.setAttribute("uv",new at(f,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Fs(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class gi extends Ft{constructor(e=1,t=.4,i=12,s=48,a=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:i,tubularSegments:s,arc:a},i=Math.floor(i),s=Math.floor(s);const r=[],o=[],l=[],c=[],d=new D,u=new D,h=new D;for(let m=0;m<=i;m++)for(let _=0;_<=s;_++){const x=_/s*a,f=m/i*Math.PI*2;u.x=(e+t*Math.cos(f))*Math.cos(x),u.y=(e+t*Math.cos(f))*Math.sin(x),u.z=t*Math.sin(f),o.push(u.x,u.y,u.z),d.x=e*Math.cos(x),d.y=e*Math.sin(x),h.subVectors(u,d).normalize(),l.push(h.x,h.y,h.z),c.push(_/s),c.push(m/i)}for(let m=1;m<=i;m++)for(let _=1;_<=s;_++){const x=(s+1)*m+_-1,f=(s+1)*(m-1)+_-1,p=(s+1)*(m-1)+_,M=(s+1)*m+_;r.push(x,f,M),r.push(f,p,M)}this.setIndex(r),this.setAttribute("position",new at(o,3)),this.setAttribute("normal",new at(l,3)),this.setAttribute("uv",new at(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new gi(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class op extends ts{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Xe(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Xe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=zc,this.normalScale=new oe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new _n,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class lp extends ts{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Bu,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class cp extends ts{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class sd extends Ct{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Xe(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class dp extends sd{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Ct.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Xe(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const _r=new dt,Pl=new D,Ll=new D;class up{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new oe(512,512),this.mapType=An,this.map=null,this.mapPass=null,this.matrix=new dt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Oo,this._frameExtents=new oe(1,1),this._viewportCount=1,this._viewports=[new Tt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,i=this.matrix;Pl.setFromMatrixPosition(e.matrixWorld),t.position.copy(Pl),Ll.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Ll),t.updateMatrixWorld(),_r.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(_r,t.coordinateSystem,t.reversedDepth),t.reversedDepth?i.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(_r)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class ad extends jc{constructor(e=-1,t=1,i=1,s=-1,a=.1,r=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=s,this.near=a,this.far=r,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,s,a,r){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=a,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let a=i-e,r=i+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;a+=c*this.view.offsetX,r=a+c*this.view.width,o-=d*this.view.offsetY,l=o-d*this.view.height}this.projectionMatrix.makeOrthographic(a,r,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class hp extends up{constructor(){super(new ad(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class pp extends sd{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ct.DEFAULT_UP),this.updateMatrix(),this.target=new Ct,this.shadow=new hp}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class fp extends cn{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}const Dl=new dt;class rd{constructor(e,t,i=0,s=1/0){this.ray=new Fa(e,t),this.near=i,this.far=s,this.camera=null,this.layers=new Fo,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Dl.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Dl),this}intersectObject(e,t=!0,i=[]){return wo(e,this,i,t),i.sort(Il),i}intersectObjects(e,t=!0,i=[]){for(let s=0,a=e.length;s<a;s++)wo(e[s],this,i,t);return i.sort(Il),i}}function Il(n,e){return n.distance-e.distance}function wo(n,e,t,i){let s=!0;if(n.layers.test(e.layers)&&n.raycast(e,t)===!1&&(s=!1),s===!0&&i===!0){const a=n.children;for(let r=0,o=a.length;r<o;r++)wo(a[r],e,t,!0)}}class Ul{constructor(e=1,t=0,i=0){this.radius=e,this.phi=t,this.theta=i}set(e,t,i){return this.radius=e,this.phi=t,this.theta=i,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=je(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,i){return this.radius=Math.sqrt(e*e+t*t+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,i),this.phi=Math.acos(je(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class mp extends Da{constructor(e=10,t=10,i=4473924,s=8947848){i=new Xe(i),s=new Xe(s);const a=t/2,r=e/t,o=e/2,l=[],c=[];for(let h=0,m=0,_=-o;h<=t;h++,_+=r){l.push(-o,0,_,o,0,_),l.push(_,0,-o,_,0,o);const x=h===a?i:s;x.toArray(c,m),m+=3,x.toArray(c,m),m+=3,x.toArray(c,m),m+=3,x.toArray(c,m),m+=3}const d=new Ft;d.setAttribute("position",new at(l,3)),d.setAttribute("color",new at(c,3));const u=new Ki({vertexColors:!0,toneMapped:!1});super(d,u),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}class gp extends Da{constructor(e=1){const t=[0,0,0,e,0,0,0,0,0,0,e,0,0,0,0,0,0,e],i=[1,0,0,1,.6,0,0,1,0,.6,1,0,0,0,1,0,.6,1],s=new Ft;s.setAttribute("position",new at(t,3)),s.setAttribute("color",new at(i,3));const a=new Ki({vertexColors:!0,toneMapped:!1});super(s,a),this.type="AxesHelper"}setColors(e,t,i){const s=new Xe,a=this.geometry.attributes.color.array;return s.set(e),s.toArray(a,0),s.toArray(a,3),s.set(t),s.toArray(a,6),s.toArray(a,9),s.set(i),s.toArray(a,12),s.toArray(a,15),this.geometry.attributes.color.needsUpdate=!0,this}dispose(){this.geometry.dispose(),this.material.dispose()}}class od extends Si{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){if(e===void 0){console.warn("THREE.Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}}function Nl(n,e,t,i){const s=_p(i);switch(t){case Uc:return n*e;case Fc:return n*e/s.components*s.byteLength;case Do:return n*e/s.components*s.byteLength;case Oc:return n*e*2/s.components*s.byteLength;case Io:return n*e*2/s.components*s.byteLength;case Nc:return n*e*3/s.components*s.byteLength;case mn:return n*e*4/s.components*s.byteLength;case Uo:return n*e*4/s.components*s.byteLength;case ya:case ba:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Ma:case Sa:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Wr:case Xr:return Math.max(n,16)*Math.max(e,8)/4;case $r:case jr:return Math.max(n,8)*Math.max(e,8)/2;case qr:case Yr:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Zr:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Jr:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Kr:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case Qr:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case eo:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case to:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case no:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case io:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case so:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case ao:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case ro:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case oo:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case lo:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case co:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case uo:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case ho:case po:case fo:return Math.ceil(n/4)*Math.ceil(e/4)*16;case mo:case go:return Math.ceil(n/4)*Math.ceil(e/4)*8;case _o:case vo:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function _p(n){switch(n){case An:case Pc:return{byteLength:1,components:1};case ws:case Lc:case Is:return{byteLength:2,components:1};case Po:case Lo:return{byteLength:2,components:4};case yi:case Ro:case zn:return{byteLength:4,components:1};case Dc:case Ic:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Co}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Co);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function ld(){let n=null,e=!1,t=null,i=null;function s(a,r){t(a,r),i=n.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(i=n.requestAnimationFrame(s),e=!0)},stop:function(){n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(a){t=a},setContext:function(a){n=a}}}function vp(n){const e=new WeakMap;function t(o,l){const c=o.array,d=o.usage,u=c.byteLength,h=n.createBuffer();n.bindBuffer(l,h),n.bufferData(l,c,d),o.onUploadCallback();let m;if(c instanceof Float32Array)m=n.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)m=n.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?m=n.HALF_FLOAT:m=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)m=n.SHORT;else if(c instanceof Uint32Array)m=n.UNSIGNED_INT;else if(c instanceof Int32Array)m=n.INT;else if(c instanceof Int8Array)m=n.BYTE;else if(c instanceof Uint8Array)m=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)m=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:h,type:m,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:u}}function i(o,l,c){const d=l.array,u=l.updateRanges;if(n.bindBuffer(c,o),u.length===0)n.bufferSubData(c,0,d);else{u.sort((m,_)=>m.start-_.start);let h=0;for(let m=1;m<u.length;m++){const _=u[h],x=u[m];x.start<=_.start+_.count+1?_.count=Math.max(_.count,x.start+x.count-_.start):(++h,u[h]=x)}u.length=h+1;for(let m=0,_=u.length;m<_;m++){const x=u[m];n.bufferSubData(c,x.start*d.BYTES_PER_ELEMENT,d,x.start,x.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function a(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(n.deleteBuffer(l.buffer),e.delete(o))}function r(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const d=e.get(o);(!d||d.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:s,remove:a,update:r}}var xp=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,yp=`#ifdef USE_ALPHAHASH
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
#endif`,bp=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Mp=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Sp=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Ep=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,wp=`#ifdef USE_AOMAP
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
#endif`,Tp=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Ap=`#ifdef USE_BATCHING
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
#endif`,Cp=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Rp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Pp=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Lp=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Dp=`#ifdef USE_IRIDESCENCE
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
#endif`,Ip=`#ifdef USE_BUMPMAP
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
#endif`,Up=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Np=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Fp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Op=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,zp=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,kp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Bp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Hp=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Gp=`#define PI 3.141592653589793
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
} // validated`,Vp=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,$p=`vec3 transformedNormal = objectNormal;
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
#endif`,Wp=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,jp=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Xp=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,qp=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Yp="gl_FragColor = linearToOutputTexel( gl_FragColor );",Zp=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Jp=`#ifdef USE_ENVMAP
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
#endif`,Kp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Qp=`#ifdef USE_ENVMAP
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
#endif`,ef=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,tf=`#ifdef USE_ENVMAP
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
#endif`,nf=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,sf=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,af=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,rf=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,of=`#ifdef USE_GRADIENTMAP
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
}`,lf=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,cf=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,df=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,uf=`uniform bool receiveShadow;
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
#endif`,hf=`#ifdef USE_ENVMAP
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
#endif`,pf=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,ff=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,mf=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,gf=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,_f=`PhysicalMaterial material;
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
#endif`,vf=`struct PhysicalMaterial {
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
}`,xf=`
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
#endif`,yf=`#if defined( RE_IndirectDiffuse )
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
#endif`,bf=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Mf=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Sf=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Ef=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,wf=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Tf=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Af=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Cf=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Rf=`#if defined( USE_POINTS_UV )
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
#endif`,Pf=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Lf=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Df=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,If=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Uf=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Nf=`#ifdef USE_MORPHTARGETS
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
#endif`,Ff=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Of=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,zf=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,kf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Bf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Hf=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Gf=`#ifdef USE_NORMALMAP
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
#endif`,Vf=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,$f=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Wf=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,jf=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Xf=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,qf=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Yf=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Zf=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Jf=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Kf=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Qf=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,em=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,tm=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,nm=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,im=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,sm=`float getShadowMask() {
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
}`,am=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,rm=`#ifdef USE_SKINNING
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
#endif`,om=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,lm=`#ifdef USE_SKINNING
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
#endif`,cm=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,dm=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,um=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,hm=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,pm=`#ifdef USE_TRANSMISSION
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
#endif`,fm=`#ifdef USE_TRANSMISSION
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
#endif`,mm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,gm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,_m=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,vm=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const xm=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,ym=`uniform sampler2D t2D;
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
}`,bm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Mm=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Sm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Em=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,wm=`#include <common>
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
}`,Tm=`#if DEPTH_PACKING == 3200
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
}`,Am=`#define DISTANCE
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
}`,Cm=`#define DISTANCE
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
}`,Rm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Pm=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Lm=`uniform float scale;
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
}`,Dm=`uniform vec3 diffuse;
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
}`,Im=`#include <common>
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
}`,Um=`uniform vec3 diffuse;
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
}`,Nm=`#define LAMBERT
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
}`,Fm=`#define LAMBERT
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
}`,Om=`#define MATCAP
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
}`,zm=`#define MATCAP
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
}`,km=`#define NORMAL
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
}`,Bm=`#define NORMAL
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
}`,Hm=`#define PHONG
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
}`,Gm=`#define PHONG
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
}`,Vm=`#define STANDARD
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
}`,$m=`#define STANDARD
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
}`,Wm=`#define TOON
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
}`,jm=`#define TOON
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
}`,Xm=`uniform float size;
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
}`,qm=`uniform vec3 diffuse;
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
}`,Ym=`#include <common>
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
}`,Zm=`uniform vec3 color;
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
}`,Jm=`uniform float rotation;
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
}`,Km=`uniform vec3 diffuse;
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
}`,We={alphahash_fragment:xp,alphahash_pars_fragment:yp,alphamap_fragment:bp,alphamap_pars_fragment:Mp,alphatest_fragment:Sp,alphatest_pars_fragment:Ep,aomap_fragment:wp,aomap_pars_fragment:Tp,batching_pars_vertex:Ap,batching_vertex:Cp,begin_vertex:Rp,beginnormal_vertex:Pp,bsdfs:Lp,iridescence_fragment:Dp,bumpmap_pars_fragment:Ip,clipping_planes_fragment:Up,clipping_planes_pars_fragment:Np,clipping_planes_pars_vertex:Fp,clipping_planes_vertex:Op,color_fragment:zp,color_pars_fragment:kp,color_pars_vertex:Bp,color_vertex:Hp,common:Gp,cube_uv_reflection_fragment:Vp,defaultnormal_vertex:$p,displacementmap_pars_vertex:Wp,displacementmap_vertex:jp,emissivemap_fragment:Xp,emissivemap_pars_fragment:qp,colorspace_fragment:Yp,colorspace_pars_fragment:Zp,envmap_fragment:Jp,envmap_common_pars_fragment:Kp,envmap_pars_fragment:Qp,envmap_pars_vertex:ef,envmap_physical_pars_fragment:hf,envmap_vertex:tf,fog_vertex:nf,fog_pars_vertex:sf,fog_fragment:af,fog_pars_fragment:rf,gradientmap_pars_fragment:of,lightmap_pars_fragment:lf,lights_lambert_fragment:cf,lights_lambert_pars_fragment:df,lights_pars_begin:uf,lights_toon_fragment:pf,lights_toon_pars_fragment:ff,lights_phong_fragment:mf,lights_phong_pars_fragment:gf,lights_physical_fragment:_f,lights_physical_pars_fragment:vf,lights_fragment_begin:xf,lights_fragment_maps:yf,lights_fragment_end:bf,logdepthbuf_fragment:Mf,logdepthbuf_pars_fragment:Sf,logdepthbuf_pars_vertex:Ef,logdepthbuf_vertex:wf,map_fragment:Tf,map_pars_fragment:Af,map_particle_fragment:Cf,map_particle_pars_fragment:Rf,metalnessmap_fragment:Pf,metalnessmap_pars_fragment:Lf,morphinstance_vertex:Df,morphcolor_vertex:If,morphnormal_vertex:Uf,morphtarget_pars_vertex:Nf,morphtarget_vertex:Ff,normal_fragment_begin:Of,normal_fragment_maps:zf,normal_pars_fragment:kf,normal_pars_vertex:Bf,normal_vertex:Hf,normalmap_pars_fragment:Gf,clearcoat_normal_fragment_begin:Vf,clearcoat_normal_fragment_maps:$f,clearcoat_pars_fragment:Wf,iridescence_pars_fragment:jf,opaque_fragment:Xf,packing:qf,premultiplied_alpha_fragment:Yf,project_vertex:Zf,dithering_fragment:Jf,dithering_pars_fragment:Kf,roughnessmap_fragment:Qf,roughnessmap_pars_fragment:em,shadowmap_pars_fragment:tm,shadowmap_pars_vertex:nm,shadowmap_vertex:im,shadowmask_pars_fragment:sm,skinbase_vertex:am,skinning_pars_vertex:rm,skinning_vertex:om,skinnormal_vertex:lm,specularmap_fragment:cm,specularmap_pars_fragment:dm,tonemapping_fragment:um,tonemapping_pars_fragment:hm,transmission_fragment:pm,transmission_pars_fragment:fm,uv_pars_fragment:mm,uv_pars_vertex:gm,uv_vertex:_m,worldpos_vertex:vm,background_vert:xm,background_frag:ym,backgroundCube_vert:bm,backgroundCube_frag:Mm,cube_vert:Sm,cube_frag:Em,depth_vert:wm,depth_frag:Tm,distanceRGBA_vert:Am,distanceRGBA_frag:Cm,equirect_vert:Rm,equirect_frag:Pm,linedashed_vert:Lm,linedashed_frag:Dm,meshbasic_vert:Im,meshbasic_frag:Um,meshlambert_vert:Nm,meshlambert_frag:Fm,meshmatcap_vert:Om,meshmatcap_frag:zm,meshnormal_vert:km,meshnormal_frag:Bm,meshphong_vert:Hm,meshphong_frag:Gm,meshphysical_vert:Vm,meshphysical_frag:$m,meshtoon_vert:Wm,meshtoon_frag:jm,points_vert:Xm,points_frag:qm,shadow_vert:Ym,shadow_frag:Zm,sprite_vert:Jm,sprite_frag:Km},me={common:{diffuse:{value:new Xe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new $e},alphaMap:{value:null},alphaMapTransform:{value:new $e},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new $e}},envmap:{envMap:{value:null},envMapRotation:{value:new $e},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new $e}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new $e}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new $e},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new $e},normalScale:{value:new oe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new $e},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new $e}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new $e}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new $e}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Xe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Xe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new $e},alphaTest:{value:0},uvTransform:{value:new $e}},sprite:{diffuse:{value:new Xe(16777215)},opacity:{value:1},center:{value:new oe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new $e},alphaMap:{value:null},alphaMapTransform:{value:new $e},alphaTest:{value:0}}},Mn={basic:{uniforms:jt([me.common,me.specularmap,me.envmap,me.aomap,me.lightmap,me.fog]),vertexShader:We.meshbasic_vert,fragmentShader:We.meshbasic_frag},lambert:{uniforms:jt([me.common,me.specularmap,me.envmap,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.fog,me.lights,{emissive:{value:new Xe(0)}}]),vertexShader:We.meshlambert_vert,fragmentShader:We.meshlambert_frag},phong:{uniforms:jt([me.common,me.specularmap,me.envmap,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.fog,me.lights,{emissive:{value:new Xe(0)},specular:{value:new Xe(1118481)},shininess:{value:30}}]),vertexShader:We.meshphong_vert,fragmentShader:We.meshphong_frag},standard:{uniforms:jt([me.common,me.envmap,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.roughnessmap,me.metalnessmap,me.fog,me.lights,{emissive:{value:new Xe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:We.meshphysical_vert,fragmentShader:We.meshphysical_frag},toon:{uniforms:jt([me.common,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.gradientmap,me.fog,me.lights,{emissive:{value:new Xe(0)}}]),vertexShader:We.meshtoon_vert,fragmentShader:We.meshtoon_frag},matcap:{uniforms:jt([me.common,me.bumpmap,me.normalmap,me.displacementmap,me.fog,{matcap:{value:null}}]),vertexShader:We.meshmatcap_vert,fragmentShader:We.meshmatcap_frag},points:{uniforms:jt([me.points,me.fog]),vertexShader:We.points_vert,fragmentShader:We.points_frag},dashed:{uniforms:jt([me.common,me.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:We.linedashed_vert,fragmentShader:We.linedashed_frag},depth:{uniforms:jt([me.common,me.displacementmap]),vertexShader:We.depth_vert,fragmentShader:We.depth_frag},normal:{uniforms:jt([me.common,me.bumpmap,me.normalmap,me.displacementmap,{opacity:{value:1}}]),vertexShader:We.meshnormal_vert,fragmentShader:We.meshnormal_frag},sprite:{uniforms:jt([me.sprite,me.fog]),vertexShader:We.sprite_vert,fragmentShader:We.sprite_frag},background:{uniforms:{uvTransform:{value:new $e},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:We.background_vert,fragmentShader:We.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new $e}},vertexShader:We.backgroundCube_vert,fragmentShader:We.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:We.cube_vert,fragmentShader:We.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:We.equirect_vert,fragmentShader:We.equirect_frag},distanceRGBA:{uniforms:jt([me.common,me.displacementmap,{referencePosition:{value:new D},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:We.distanceRGBA_vert,fragmentShader:We.distanceRGBA_frag},shadow:{uniforms:jt([me.lights,me.fog,{color:{value:new Xe(0)},opacity:{value:1}}]),vertexShader:We.shadow_vert,fragmentShader:We.shadow_frag}};Mn.physical={uniforms:jt([Mn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new $e},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new $e},clearcoatNormalScale:{value:new oe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new $e},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new $e},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new $e},sheen:{value:0},sheenColor:{value:new Xe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new $e},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new $e},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new $e},transmissionSamplerSize:{value:new oe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new $e},attenuationDistance:{value:0},attenuationColor:{value:new Xe(0)},specularColor:{value:new Xe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new $e},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new $e},anisotropyVector:{value:new oe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new $e}}]),vertexShader:We.meshphysical_vert,fragmentShader:We.meshphysical_frag};const pa={r:0,b:0,g:0},ci=new _n,Qm=new dt;function eg(n,e,t,i,s,a,r){const o=new Xe(0);let l=a===!0?0:1,c,d,u=null,h=0,m=null;function _(v){let g=v.isScene===!0?v.background:null;return g&&g.isTexture&&(g=(v.backgroundBlurriness>0?t:e).get(g)),g}function x(v){let g=!1;const w=_(v);w===null?p(o,l):w&&w.isColor&&(p(w,1),g=!0);const A=n.xr.getEnvironmentBlendMode();A==="additive"?i.buffers.color.setClear(0,0,0,1,r):A==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,r),(n.autoClear||g)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function f(v,g){const w=_(g);w&&(w.isCubeTexture||w.mapping===Ua)?(d===void 0&&(d=new be(new St(1,1,1),new ti({name:"BackgroundCubeMaterial",uniforms:Ji(Mn.backgroundCube.uniforms),vertexShader:Mn.backgroundCube.vertexShader,fragmentShader:Mn.backgroundCube.fragmentShader,side:Kt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),d.geometry.deleteAttribute("normal"),d.geometry.deleteAttribute("uv"),d.onBeforeRender=function(A,y,E){this.matrixWorld.copyPosition(E.matrixWorld)},Object.defineProperty(d.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(d)),ci.copy(g.backgroundRotation),ci.x*=-1,ci.y*=-1,ci.z*=-1,w.isCubeTexture&&w.isRenderTargetTexture===!1&&(ci.y*=-1,ci.z*=-1),d.material.uniforms.envMap.value=w,d.material.uniforms.flipEnvMap.value=w.isCubeTexture&&w.isRenderTargetTexture===!1?-1:1,d.material.uniforms.backgroundBlurriness.value=g.backgroundBlurriness,d.material.uniforms.backgroundIntensity.value=g.backgroundIntensity,d.material.uniforms.backgroundRotation.value.setFromMatrix4(Qm.makeRotationFromEuler(ci)),d.material.toneMapped=tt.getTransfer(w.colorSpace)!==ot,(u!==w||h!==w.version||m!==n.toneMapping)&&(d.material.needsUpdate=!0,u=w,h=w.version,m=n.toneMapping),d.layers.enableAll(),v.unshift(d,d.geometry,d.material,0,0,null)):w&&w.isTexture&&(c===void 0&&(c=new be(new Ns(2,2),new ti({name:"BackgroundMaterial",uniforms:Ji(Mn.background.uniforms),vertexShader:Mn.background.vertexShader,fragmentShader:Mn.background.fragmentShader,side:ei,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=w,c.material.uniforms.backgroundIntensity.value=g.backgroundIntensity,c.material.toneMapped=tt.getTransfer(w.colorSpace)!==ot,w.matrixAutoUpdate===!0&&w.updateMatrix(),c.material.uniforms.uvTransform.value.copy(w.matrix),(u!==w||h!==w.version||m!==n.toneMapping)&&(c.material.needsUpdate=!0,u=w,h=w.version,m=n.toneMapping),c.layers.enableAll(),v.unshift(c,c.geometry,c.material,0,0,null))}function p(v,g){v.getRGB(pa,Wc(n)),i.buffers.color.setClear(pa.r,pa.g,pa.b,g,r)}function M(){d!==void 0&&(d.geometry.dispose(),d.material.dispose(),d=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(v,g=1){o.set(v),l=g,p(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(v){l=v,p(o,l)},render:x,addToRenderList:f,dispose:M}}function tg(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=h(null);let a=s,r=!1;function o(b,R,I,L,z){let N=!1;const F=u(L,I,R);a!==F&&(a=F,c(a.object)),N=m(b,L,I,z),N&&_(b,L,I,z),z!==null&&e.update(z,n.ELEMENT_ARRAY_BUFFER),(N||r)&&(r=!1,g(b,R,I,L),z!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(z).buffer))}function l(){return n.createVertexArray()}function c(b){return n.bindVertexArray(b)}function d(b){return n.deleteVertexArray(b)}function u(b,R,I){const L=I.wireframe===!0;let z=i[b.id];z===void 0&&(z={},i[b.id]=z);let N=z[R.id];N===void 0&&(N={},z[R.id]=N);let F=N[L];return F===void 0&&(F=h(l()),N[L]=F),F}function h(b){const R=[],I=[],L=[];for(let z=0;z<t;z++)R[z]=0,I[z]=0,L[z]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:R,enabledAttributes:I,attributeDivisors:L,object:b,attributes:{},index:null}}function m(b,R,I,L){const z=a.attributes,N=R.attributes;let F=0;const B=I.getAttributes();for(const $ in B)if(B[$].location>=0){const ue=z[$];let ge=N[$];if(ge===void 0&&($==="instanceMatrix"&&b.instanceMatrix&&(ge=b.instanceMatrix),$==="instanceColor"&&b.instanceColor&&(ge=b.instanceColor)),ue===void 0||ue.attribute!==ge||ge&&ue.data!==ge.data)return!0;F++}return a.attributesNum!==F||a.index!==L}function _(b,R,I,L){const z={},N=R.attributes;let F=0;const B=I.getAttributes();for(const $ in B)if(B[$].location>=0){let ue=N[$];ue===void 0&&($==="instanceMatrix"&&b.instanceMatrix&&(ue=b.instanceMatrix),$==="instanceColor"&&b.instanceColor&&(ue=b.instanceColor));const ge={};ge.attribute=ue,ue&&ue.data&&(ge.data=ue.data),z[$]=ge,F++}a.attributes=z,a.attributesNum=F,a.index=L}function x(){const b=a.newAttributes;for(let R=0,I=b.length;R<I;R++)b[R]=0}function f(b){p(b,0)}function p(b,R){const I=a.newAttributes,L=a.enabledAttributes,z=a.attributeDivisors;I[b]=1,L[b]===0&&(n.enableVertexAttribArray(b),L[b]=1),z[b]!==R&&(n.vertexAttribDivisor(b,R),z[b]=R)}function M(){const b=a.newAttributes,R=a.enabledAttributes;for(let I=0,L=R.length;I<L;I++)R[I]!==b[I]&&(n.disableVertexAttribArray(I),R[I]=0)}function v(b,R,I,L,z,N,F){F===!0?n.vertexAttribIPointer(b,R,I,z,N):n.vertexAttribPointer(b,R,I,L,z,N)}function g(b,R,I,L){x();const z=L.attributes,N=I.getAttributes(),F=R.defaultAttributeValues;for(const B in N){const $=N[B];if($.location>=0){let K=z[B];if(K===void 0&&(B==="instanceMatrix"&&b.instanceMatrix&&(K=b.instanceMatrix),B==="instanceColor"&&b.instanceColor&&(K=b.instanceColor)),K!==void 0){const ue=K.normalized,ge=K.itemSize,Oe=e.get(K);if(Oe===void 0)continue;const qe=Oe.buffer,Qe=Oe.type,Ke=Oe.bytesPerElement,Y=Qe===n.INT||Qe===n.UNSIGNED_INT||K.gpuType===Ro;if(K.isInterleavedBufferAttribute){const ie=K.data,Se=ie.stride,De=K.offset;if(ie.isInstancedInterleavedBuffer){for(let Te=0;Te<$.locationSize;Te++)p($.location+Te,ie.meshPerAttribute);b.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=ie.meshPerAttribute*ie.count)}else for(let Te=0;Te<$.locationSize;Te++)f($.location+Te);n.bindBuffer(n.ARRAY_BUFFER,qe);for(let Te=0;Te<$.locationSize;Te++)v($.location+Te,ge/$.locationSize,Qe,ue,Se*Ke,(De+ge/$.locationSize*Te)*Ke,Y)}else{if(K.isInstancedBufferAttribute){for(let ie=0;ie<$.locationSize;ie++)p($.location+ie,K.meshPerAttribute);b.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=K.meshPerAttribute*K.count)}else for(let ie=0;ie<$.locationSize;ie++)f($.location+ie);n.bindBuffer(n.ARRAY_BUFFER,qe);for(let ie=0;ie<$.locationSize;ie++)v($.location+ie,ge/$.locationSize,Qe,ue,ge*Ke,ge/$.locationSize*ie*Ke,Y)}}else if(F!==void 0){const ue=F[B];if(ue!==void 0)switch(ue.length){case 2:n.vertexAttrib2fv($.location,ue);break;case 3:n.vertexAttrib3fv($.location,ue);break;case 4:n.vertexAttrib4fv($.location,ue);break;default:n.vertexAttrib1fv($.location,ue)}}}}M()}function w(){E();for(const b in i){const R=i[b];for(const I in R){const L=R[I];for(const z in L)d(L[z].object),delete L[z];delete R[I]}delete i[b]}}function A(b){if(i[b.id]===void 0)return;const R=i[b.id];for(const I in R){const L=R[I];for(const z in L)d(L[z].object),delete L[z];delete R[I]}delete i[b.id]}function y(b){for(const R in i){const I=i[R];if(I[b.id]===void 0)continue;const L=I[b.id];for(const z in L)d(L[z].object),delete L[z];delete I[b.id]}}function E(){S(),r=!0,a!==s&&(a=s,c(a.object))}function S(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:E,resetDefaultState:S,dispose:w,releaseStatesOfGeometry:A,releaseStatesOfProgram:y,initAttributes:x,enableAttribute:f,disableUnusedAttributes:M}}function ng(n,e,t){let i;function s(c){i=c}function a(c,d){n.drawArrays(i,c,d),t.update(d,i,1)}function r(c,d,u){u!==0&&(n.drawArraysInstanced(i,c,d,u),t.update(d,i,u))}function o(c,d,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,d,0,u);let m=0;for(let _=0;_<u;_++)m+=d[_];t.update(m,i,1)}function l(c,d,u,h){if(u===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let _=0;_<c.length;_++)r(c[_],d[_],h[_]);else{m.multiDrawArraysInstancedWEBGL(i,c,0,d,0,h,0,u);let _=0;for(let x=0;x<u;x++)_+=d[x]*h[x];t.update(_,i,1)}}this.setMode=s,this.render=a,this.renderInstances=r,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function ig(n,e,t,i){let s;function a(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const y=e.get("EXT_texture_filter_anisotropic");s=n.getParameter(y.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function r(y){return!(y!==mn&&i.convert(y)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(y){const E=y===Is&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(y!==An&&i.convert(y)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&y!==zn&&!E)}function l(y){if(y==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";y="mediump"}return y==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const d=l(c);d!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",d,"instead."),c=d);const u=t.logarithmicDepthBuffer===!0,h=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),m=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),_=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=n.getParameter(n.MAX_TEXTURE_SIZE),f=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),p=n.getParameter(n.MAX_VERTEX_ATTRIBS),M=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),v=n.getParameter(n.MAX_VARYING_VECTORS),g=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),w=_>0,A=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:l,textureFormatReadable:r,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:u,reversedDepthBuffer:h,maxTextures:m,maxVertexTextures:_,maxTextureSize:x,maxCubemapSize:f,maxAttributes:p,maxVertexUniforms:M,maxVaryings:v,maxFragmentUniforms:g,vertexTextures:w,maxSamples:A}}function sg(n){const e=this;let t=null,i=0,s=!1,a=!1;const r=new Zn,o=new $e,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,h){const m=u.length!==0||h||i!==0||s;return s=h,i=u.length,m},this.beginShadows=function(){a=!0,d(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(u,h){t=d(u,h,0)},this.setState=function(u,h,m){const _=u.clippingPlanes,x=u.clipIntersection,f=u.clipShadows,p=n.get(u);if(!s||_===null||_.length===0||a&&!f)a?d(null):c();else{const M=a?0:i,v=M*4;let g=p.clippingState||null;l.value=g,g=d(_,h,v,m);for(let w=0;w!==v;++w)g[w]=t[w];p.clippingState=g,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=M}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function d(u,h,m,_){const x=u!==null?u.length:0;let f=null;if(x!==0){if(f=l.value,_!==!0||f===null){const p=m+x*4,M=h.matrixWorldInverse;o.getNormalMatrix(M),(f===null||f.length<p)&&(f=new Float32Array(p));for(let v=0,g=m;v!==x;++v,g+=4)r.copy(u[v]).applyMatrix4(M,o),r.normal.toArray(f,g),f[g+3]=r.constant}l.value=f,l.needsUpdate=!0}return e.numPlanes=x,e.numIntersection=0,f}}function ag(n){let e=new WeakMap;function t(r,o){return o===Br?r.mapping=qi:o===Hr&&(r.mapping=Yi),r}function i(r){if(r&&r.isTexture){const o=r.mapping;if(o===Br||o===Hr)if(e.has(r)){const l=e.get(r).texture;return t(l,r.mapping)}else{const l=r.image;if(l&&l.height>0){const c=new Mh(l.height);return c.fromEquirectangularTexture(n,r),e.set(r,c),r.addEventListener("dispose",s),t(c.texture,r.mapping)}else return null}}return r}function s(r){const o=r.target;o.removeEventListener("dispose",s);const l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function a(){e=new WeakMap}return{get:i,dispose:a}}const Vi=4,Fl=[.125,.215,.35,.446,.526,.582],_i=20,vr=new ad,Ol=new Xe;let xr=null,yr=0,br=0,Mr=!1;const pi=(1+Math.sqrt(5))/2,zi=1/pi,zl=[new D(-pi,zi,0),new D(pi,zi,0),new D(-zi,0,pi),new D(zi,0,pi),new D(0,pi,-zi),new D(0,pi,zi),new D(-1,1,-1),new D(1,1,-1),new D(-1,1,1),new D(1,1,1)],rg=new D;class kl{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,i=.1,s=100,a={}){const{size:r=256,position:o=rg}=a;xr=this._renderer.getRenderTarget(),yr=this._renderer.getActiveCubeFace(),br=this._renderer.getActiveMipmapLevel(),Mr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(r);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,i,s,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Gl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Hl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(xr,yr,br),this._renderer.xr.enabled=Mr,e.scissorTest=!1,fa(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===qi||e.mapping===Yi?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),xr=this._renderer.getRenderTarget(),yr=this._renderer.getActiveCubeFace(),br=this._renderer.getActiveMipmapLevel(),Mr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:En,minFilter:En,generateMipmaps:!1,type:Is,format:mn,colorSpace:Zi,depthBuffer:!1},s=Bl(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Bl(e,t,i);const{_lodMax:a}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=og(a)),this._blurMaterial=lg(a,e,t)}return s}_compileMaterial(e){const t=new be(this._lodPlanes[0],e);this._renderer.compile(t,vr)}_sceneToCubeUV(e,t,i,s,a){const l=new cn(90,1,t,i),c=[1,-1,1,1,1,1],d=[1,1,1,-1,-1,-1],u=this._renderer,h=u.autoClear,m=u.toneMapping;u.getClearColor(Ol),u.toneMapping=Qn,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null));const x=new Oa({name:"PMREM.Background",side:Kt,depthWrite:!1,depthTest:!1}),f=new be(new St,x);let p=!1;const M=e.background;M?M.isColor&&(x.color.copy(M),e.background=null,p=!0):(x.color.copy(Ol),p=!0);for(let v=0;v<6;v++){const g=v%3;g===0?(l.up.set(0,c[v],0),l.position.set(a.x,a.y,a.z),l.lookAt(a.x+d[v],a.y,a.z)):g===1?(l.up.set(0,0,c[v]),l.position.set(a.x,a.y,a.z),l.lookAt(a.x,a.y+d[v],a.z)):(l.up.set(0,c[v],0),l.position.set(a.x,a.y,a.z),l.lookAt(a.x,a.y,a.z+d[v]));const w=this._cubeSize;fa(s,g*w,v>2?w:0,w,w),u.setRenderTarget(s),p&&u.render(f,l),u.render(e,l)}f.geometry.dispose(),f.material.dispose(),u.toneMapping=m,u.autoClear=h,e.background=M}_textureToCubeUV(e,t){const i=this._renderer,s=e.mapping===qi||e.mapping===Yi;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Gl()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Hl());const a=s?this._cubemapMaterial:this._equirectMaterial,r=new be(this._lodPlanes[0],a),o=a.uniforms;o.envMap.value=e;const l=this._cubeSize;fa(t,0,0,3*l,2*l),i.setRenderTarget(t),i.render(r,vr)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const s=this._lodPlanes.length;for(let a=1;a<s;a++){const r=Math.sqrt(this._sigmas[a]*this._sigmas[a]-this._sigmas[a-1]*this._sigmas[a-1]),o=zl[(s-a-1)%zl.length];this._blur(e,a-1,a,r,o)}t.autoClear=i}_blur(e,t,i,s,a){const r=this._pingPongRenderTarget;this._halfBlur(e,r,t,i,s,"latitudinal",a),this._halfBlur(r,e,i,i,s,"longitudinal",a)}_halfBlur(e,t,i,s,a,r,o){const l=this._renderer,c=this._blurMaterial;r!=="latitudinal"&&r!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const d=3,u=new be(this._lodPlanes[s],c),h=c.uniforms,m=this._sizeLods[i]-1,_=isFinite(a)?Math.PI/(2*m):2*Math.PI/(2*_i-1),x=a/_,f=isFinite(a)?1+Math.floor(d*x):_i;f>_i&&console.warn(`sigmaRadians, ${a}, is too large and will clip, as it requested ${f} samples when the maximum is set to ${_i}`);const p=[];let M=0;for(let y=0;y<_i;++y){const E=y/x,S=Math.exp(-E*E/2);p.push(S),y===0?M+=S:y<f&&(M+=2*S)}for(let y=0;y<p.length;y++)p[y]=p[y]/M;h.envMap.value=e.texture,h.samples.value=f,h.weights.value=p,h.latitudinal.value=r==="latitudinal",o&&(h.poleAxis.value=o);const{_lodMax:v}=this;h.dTheta.value=_,h.mipInt.value=v-i;const g=this._sizeLods[s],w=3*g*(s>v-Vi?s-v+Vi:0),A=4*(this._cubeSize-g);fa(t,w,A,3*g,2*g),l.setRenderTarget(t),l.render(u,vr)}}function og(n){const e=[],t=[],i=[];let s=n;const a=n-Vi+1+Fl.length;for(let r=0;r<a;r++){const o=Math.pow(2,s);t.push(o);let l=1/o;r>n-Vi?l=Fl[r-n+Vi-1]:r===0&&(l=0),i.push(l);const c=1/(o-2),d=-c,u=1+c,h=[d,d,u,d,u,u,d,d,u,u,d,u],m=6,_=6,x=3,f=2,p=1,M=new Float32Array(x*_*m),v=new Float32Array(f*_*m),g=new Float32Array(p*_*m);for(let A=0;A<m;A++){const y=A%3*2/3-1,E=A>2?0:-1,S=[y,E,0,y+2/3,E,0,y+2/3,E+1,0,y,E,0,y+2/3,E+1,0,y,E+1,0];M.set(S,x*_*A),v.set(h,f*_*A);const b=[A,A,A,A,A,A];g.set(b,p*_*A)}const w=new Ft;w.setAttribute("position",new Tn(M,x)),w.setAttribute("uv",new Tn(v,f)),w.setAttribute("faceIndex",new Tn(g,p)),e.push(w),s>Vi&&s--}return{lodPlanes:e,sizeLods:t,sigmas:i}}function Bl(n,e,t){const i=new bi(n,e,t);return i.texture.mapping=Ua,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function fa(n,e,t,i,s){n.viewport.set(e,t,i,s),n.scissor.set(e,t,i,s)}function lg(n,e,t){const i=new Float32Array(_i),s=new D(0,1,0);return new ti({name:"SphericalGaussianBlur",defines:{n:_i,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Go(),fragmentShader:`

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
		`,blending:Kn,depthTest:!1,depthWrite:!1})}function Hl(){return new ti({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Go(),fragmentShader:`

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
		`,blending:Kn,depthTest:!1,depthWrite:!1})}function Gl(){return new ti({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Go(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Kn,depthTest:!1,depthWrite:!1})}function Go(){return`

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
	`}function cg(n){let e=new WeakMap,t=null;function i(o){if(o&&o.isTexture){const l=o.mapping,c=l===Br||l===Hr,d=l===qi||l===Yi;if(c||d){let u=e.get(o);const h=u!==void 0?u.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==h)return t===null&&(t=new kl(n)),u=c?t.fromEquirectangular(o,u):t.fromCubemap(o,u),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),u.texture;if(u!==void 0)return u.texture;{const m=o.image;return c&&m&&m.height>0||d&&m&&s(m)?(t===null&&(t=new kl(n)),u=c?t.fromEquirectangular(o):t.fromCubemap(o),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),o.addEventListener("dispose",a),u.texture):null}}}return o}function s(o){let l=0;const c=6;for(let d=0;d<c;d++)o[d]!==void 0&&l++;return l===c}function a(o){const l=o.target;l.removeEventListener("dispose",a);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function r(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:r}}function dg(n){const e={};function t(i){if(e[i]!==void 0)return e[i];let s;switch(i){case"WEBGL_depth_texture":s=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=n.getExtension(i)}return e[i]=s,s}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const s=t(i);return s===null&&Rs("THREE.WebGLRenderer: "+i+" extension not supported."),s}}}function ug(n,e,t,i){const s={},a=new WeakMap;function r(u){const h=u.target;h.index!==null&&e.remove(h.index);for(const _ in h.attributes)e.remove(h.attributes[_]);h.removeEventListener("dispose",r),delete s[h.id];const m=a.get(h);m&&(e.remove(m),a.delete(h)),i.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,t.memory.geometries--}function o(u,h){return s[h.id]===!0||(h.addEventListener("dispose",r),s[h.id]=!0,t.memory.geometries++),h}function l(u){const h=u.attributes;for(const m in h)e.update(h[m],n.ARRAY_BUFFER)}function c(u){const h=[],m=u.index,_=u.attributes.position;let x=0;if(m!==null){const M=m.array;x=m.version;for(let v=0,g=M.length;v<g;v+=3){const w=M[v+0],A=M[v+1],y=M[v+2];h.push(w,A,A,y,y,w)}}else if(_!==void 0){const M=_.array;x=_.version;for(let v=0,g=M.length/3-1;v<g;v+=3){const w=v+0,A=v+1,y=v+2;h.push(w,A,A,y,y,w)}}else return;const f=new(Bc(h)?$c:Vc)(h,1);f.version=x;const p=a.get(u);p&&e.remove(p),a.set(u,f)}function d(u){const h=a.get(u);if(h){const m=u.index;m!==null&&h.version<m.version&&c(u)}else c(u);return a.get(u)}return{get:o,update:l,getWireframeAttribute:d}}function hg(n,e,t){let i;function s(h){i=h}let a,r;function o(h){a=h.type,r=h.bytesPerElement}function l(h,m){n.drawElements(i,m,a,h*r),t.update(m,i,1)}function c(h,m,_){_!==0&&(n.drawElementsInstanced(i,m,a,h*r,_),t.update(m,i,_))}function d(h,m,_){if(_===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,m,0,a,h,0,_);let f=0;for(let p=0;p<_;p++)f+=m[p];t.update(f,i,1)}function u(h,m,_,x){if(_===0)return;const f=e.get("WEBGL_multi_draw");if(f===null)for(let p=0;p<h.length;p++)c(h[p]/r,m[p],x[p]);else{f.multiDrawElementsInstancedWEBGL(i,m,0,a,h,0,x,0,_);let p=0;for(let M=0;M<_;M++)p+=m[M]*x[M];t.update(p,i,1)}}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=d,this.renderMultiDrawInstances=u}function pg(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(a,r,o){switch(t.calls++,r){case n.TRIANGLES:t.triangles+=o*(a/3);break;case n.LINES:t.lines+=o*(a/2);break;case n.LINE_STRIP:t.lines+=o*(a-1);break;case n.LINE_LOOP:t.lines+=o*a;break;case n.POINTS:t.points+=o*a;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",r);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:i}}function fg(n,e,t){const i=new WeakMap,s=new Tt;function a(r,o,l){const c=r.morphTargetInfluences,d=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=d!==void 0?d.length:0;let h=i.get(o);if(h===void 0||h.count!==u){let b=function(){E.dispose(),i.delete(o),o.removeEventListener("dispose",b)};var m=b;h!==void 0&&h.texture.dispose();const _=o.morphAttributes.position!==void 0,x=o.morphAttributes.normal!==void 0,f=o.morphAttributes.color!==void 0,p=o.morphAttributes.position||[],M=o.morphAttributes.normal||[],v=o.morphAttributes.color||[];let g=0;_===!0&&(g=1),x===!0&&(g=2),f===!0&&(g=3);let w=o.attributes.position.count*g,A=1;w>e.maxTextureSize&&(A=Math.ceil(w/e.maxTextureSize),w=e.maxTextureSize);const y=new Float32Array(w*A*4*u),E=new Hc(y,w,A,u);E.type=zn,E.needsUpdate=!0;const S=g*4;for(let R=0;R<u;R++){const I=p[R],L=M[R],z=v[R],N=w*A*4*R;for(let F=0;F<I.count;F++){const B=F*S;_===!0&&(s.fromBufferAttribute(I,F),y[N+B+0]=s.x,y[N+B+1]=s.y,y[N+B+2]=s.z,y[N+B+3]=0),x===!0&&(s.fromBufferAttribute(L,F),y[N+B+4]=s.x,y[N+B+5]=s.y,y[N+B+6]=s.z,y[N+B+7]=0),f===!0&&(s.fromBufferAttribute(z,F),y[N+B+8]=s.x,y[N+B+9]=s.y,y[N+B+10]=s.z,y[N+B+11]=z.itemSize===4?s.w:1)}}h={count:u,texture:E,size:new oe(w,A)},i.set(o,h),o.addEventListener("dispose",b)}if(r.isInstancedMesh===!0&&r.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",r.morphTexture,t);else{let _=0;for(let f=0;f<c.length;f++)_+=c[f];const x=o.morphTargetsRelative?1:1-_;l.getUniforms().setValue(n,"morphTargetBaseInfluence",x),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",h.texture,t),l.getUniforms().setValue(n,"morphTargetsTextureSize",h.size)}return{update:a}}function mg(n,e,t,i){let s=new WeakMap;function a(l){const c=i.render.frame,d=l.geometry,u=e.get(l,d);if(s.get(u)!==c&&(e.update(u),s.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),s.get(l)!==c&&(t.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,n.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){const h=l.skeleton;s.get(h)!==c&&(h.update(),s.set(h,c))}return u}function r(){s=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:a,dispose:r}}const cd=new Qt,Vl=new qc(1,1),dd=new Hc,ud=new ah,hd=new Xc,$l=[],Wl=[],jl=new Float32Array(16),Xl=new Float32Array(9),ql=new Float32Array(4);function ns(n,e,t){const i=n[0];if(i<=0||i>0)return n;const s=e*t;let a=$l[s];if(a===void 0&&(a=new Float32Array(s),$l[s]=a),e!==0){i.toArray(a,0);for(let r=1,o=0;r!==e;++r)o+=t,n[r].toArray(a,o)}return a}function Dt(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function It(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function za(n,e){let t=Wl[e];t===void 0&&(t=new Int32Array(e),Wl[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function gg(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function _g(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Dt(t,e))return;n.uniform2fv(this.addr,e),It(t,e)}}function vg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Dt(t,e))return;n.uniform3fv(this.addr,e),It(t,e)}}function xg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Dt(t,e))return;n.uniform4fv(this.addr,e),It(t,e)}}function yg(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Dt(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),It(t,e)}else{if(Dt(t,i))return;ql.set(i),n.uniformMatrix2fv(this.addr,!1,ql),It(t,i)}}function bg(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Dt(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),It(t,e)}else{if(Dt(t,i))return;Xl.set(i),n.uniformMatrix3fv(this.addr,!1,Xl),It(t,i)}}function Mg(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Dt(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),It(t,e)}else{if(Dt(t,i))return;jl.set(i),n.uniformMatrix4fv(this.addr,!1,jl),It(t,i)}}function Sg(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function Eg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Dt(t,e))return;n.uniform2iv(this.addr,e),It(t,e)}}function wg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Dt(t,e))return;n.uniform3iv(this.addr,e),It(t,e)}}function Tg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Dt(t,e))return;n.uniform4iv(this.addr,e),It(t,e)}}function Ag(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function Cg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Dt(t,e))return;n.uniform2uiv(this.addr,e),It(t,e)}}function Rg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Dt(t,e))return;n.uniform3uiv(this.addr,e),It(t,e)}}function Pg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Dt(t,e))return;n.uniform4uiv(this.addr,e),It(t,e)}}function Lg(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let a;this.type===n.SAMPLER_2D_SHADOW?(Vl.compareFunction=kc,a=Vl):a=cd,t.setTexture2D(e||a,s)}function Dg(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture3D(e||ud,s)}function Ig(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTextureCube(e||hd,s)}function Ug(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture2DArray(e||dd,s)}function Ng(n){switch(n){case 5126:return gg;case 35664:return _g;case 35665:return vg;case 35666:return xg;case 35674:return yg;case 35675:return bg;case 35676:return Mg;case 5124:case 35670:return Sg;case 35667:case 35671:return Eg;case 35668:case 35672:return wg;case 35669:case 35673:return Tg;case 5125:return Ag;case 36294:return Cg;case 36295:return Rg;case 36296:return Pg;case 35678:case 36198:case 36298:case 36306:case 35682:return Lg;case 35679:case 36299:case 36307:return Dg;case 35680:case 36300:case 36308:case 36293:return Ig;case 36289:case 36303:case 36311:case 36292:return Ug}}function Fg(n,e){n.uniform1fv(this.addr,e)}function Og(n,e){const t=ns(e,this.size,2);n.uniform2fv(this.addr,t)}function zg(n,e){const t=ns(e,this.size,3);n.uniform3fv(this.addr,t)}function kg(n,e){const t=ns(e,this.size,4);n.uniform4fv(this.addr,t)}function Bg(n,e){const t=ns(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function Hg(n,e){const t=ns(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function Gg(n,e){const t=ns(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function Vg(n,e){n.uniform1iv(this.addr,e)}function $g(n,e){n.uniform2iv(this.addr,e)}function Wg(n,e){n.uniform3iv(this.addr,e)}function jg(n,e){n.uniform4iv(this.addr,e)}function Xg(n,e){n.uniform1uiv(this.addr,e)}function qg(n,e){n.uniform2uiv(this.addr,e)}function Yg(n,e){n.uniform3uiv(this.addr,e)}function Zg(n,e){n.uniform4uiv(this.addr,e)}function Jg(n,e,t){const i=this.cache,s=e.length,a=za(t,s);Dt(i,a)||(n.uniform1iv(this.addr,a),It(i,a));for(let r=0;r!==s;++r)t.setTexture2D(e[r]||cd,a[r])}function Kg(n,e,t){const i=this.cache,s=e.length,a=za(t,s);Dt(i,a)||(n.uniform1iv(this.addr,a),It(i,a));for(let r=0;r!==s;++r)t.setTexture3D(e[r]||ud,a[r])}function Qg(n,e,t){const i=this.cache,s=e.length,a=za(t,s);Dt(i,a)||(n.uniform1iv(this.addr,a),It(i,a));for(let r=0;r!==s;++r)t.setTextureCube(e[r]||hd,a[r])}function e_(n,e,t){const i=this.cache,s=e.length,a=za(t,s);Dt(i,a)||(n.uniform1iv(this.addr,a),It(i,a));for(let r=0;r!==s;++r)t.setTexture2DArray(e[r]||dd,a[r])}function t_(n){switch(n){case 5126:return Fg;case 35664:return Og;case 35665:return zg;case 35666:return kg;case 35674:return Bg;case 35675:return Hg;case 35676:return Gg;case 5124:case 35670:return Vg;case 35667:case 35671:return $g;case 35668:case 35672:return Wg;case 35669:case 35673:return jg;case 5125:return Xg;case 36294:return qg;case 36295:return Yg;case 36296:return Zg;case 35678:case 36198:case 36298:case 36306:case 35682:return Jg;case 35679:case 36299:case 36307:return Kg;case 35680:case 36300:case 36308:case 36293:return Qg;case 36289:case 36303:case 36311:case 36292:return e_}}class n_{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=Ng(t.type)}}class i_{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=t_(t.type)}}class s_{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const s=this.seq;for(let a=0,r=s.length;a!==r;++a){const o=s[a];o.setValue(e,t[o.id],i)}}}const Sr=/(\w+)(\])?(\[|\.)?/g;function Yl(n,e){n.seq.push(e),n.map[e.id]=e}function a_(n,e,t){const i=n.name,s=i.length;for(Sr.lastIndex=0;;){const a=Sr.exec(i),r=Sr.lastIndex;let o=a[1];const l=a[2]==="]",c=a[3];if(l&&(o=o|0),c===void 0||c==="["&&r+2===s){Yl(t,c===void 0?new n_(o,n,e):new i_(o,n,e));break}else{let u=t.map[o];u===void 0&&(u=new s_(o),Yl(t,u)),t=u}}}class wa{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<i;++s){const a=e.getActiveUniform(t,s),r=e.getUniformLocation(t,a.name);a_(a,r,this)}}setValue(e,t,i,s){const a=this.map[t];a!==void 0&&a.setValue(e,i,s)}setOptional(e,t,i){const s=t[i];s!==void 0&&this.setValue(e,i,s)}static upload(e,t,i,s){for(let a=0,r=t.length;a!==r;++a){const o=t[a],l=i[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){const i=[];for(let s=0,a=e.length;s!==a;++s){const r=e[s];r.id in t&&i.push(r)}return i}}function Zl(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const r_=37297;let o_=0;function l_(n,e){const t=n.split(`
`),i=[],s=Math.max(e-6,0),a=Math.min(e+6,t.length);for(let r=s;r<a;r++){const o=r+1;i.push(`${o===e?">":" "} ${o}: ${t[r]}`)}return i.join(`
`)}const Jl=new $e;function c_(n){tt._getMatrix(Jl,tt.workingColorSpace,n);const e=`mat3( ${Jl.elements.map(t=>t.toFixed(4))} )`;switch(tt.getTransfer(n)){case Aa:return[e,"LinearTransferOETF"];case ot:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function Kl(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),a=(n.getShaderInfoLog(e)||"").trim();if(i&&a==="")return"";const r=/ERROR: 0:(\d+)/.exec(a);if(r){const o=parseInt(r[1]);return t.toUpperCase()+`

`+a+`

`+l_(n.getShaderSource(e),o)}else return a}function d_(n,e){const t=c_(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function u_(n,e){let t;switch(e){case Du:t="Linear";break;case Iu:t="Reinhard";break;case Uu:t="Cineon";break;case Nu:t="ACESFilmic";break;case Ou:t="AgX";break;case zu:t="Neutral";break;case Fu:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const ma=new D;function h_(){tt.getLuminanceCoefficients(ma);const n=ma.x.toFixed(4),e=ma.y.toFixed(4),t=ma.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function p_(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ms).join(`
`)}function f_(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function m_(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const a=n.getActiveAttrib(e,s),r=a.name;let o=1;a.type===n.FLOAT_MAT2&&(o=2),a.type===n.FLOAT_MAT3&&(o=3),a.type===n.FLOAT_MAT4&&(o=4),t[r]={type:a.type,location:n.getAttribLocation(e,r),locationSize:o}}return t}function ms(n){return n!==""}function Ql(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function ec(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const g_=/^[ \t]*#include +<([\w\d./]+)>/gm;function To(n){return n.replace(g_,v_)}const __=new Map;function v_(n,e){let t=We[e];if(t===void 0){const i=__.get(e);if(i!==void 0)t=We[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return To(t)}const x_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function tc(n){return n.replace(x_,y_)}function y_(n,e,t,i){let s="";for(let a=parseInt(e);a<parseInt(t);a++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+a+" ]").replace(/UNROLLED_LOOP_INDEX/g,a);return s}function nc(n){let e=`precision ${n.precision} float;
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
#define LOW_PRECISION`),e}function b_(n){let e="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===Ac?e="SHADOWMAP_TYPE_PCF":n.shadowMapType===uu?e="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===Fn&&(e="SHADOWMAP_TYPE_VSM"),e}function M_(n){let e="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case qi:case Yi:e="ENVMAP_TYPE_CUBE";break;case Ua:e="ENVMAP_TYPE_CUBE_UV";break}return e}function S_(n){let e="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case Yi:e="ENVMAP_MODE_REFRACTION";break}return e}function E_(n){let e="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case Cc:e="ENVMAP_BLENDING_MULTIPLY";break;case Pu:e="ENVMAP_BLENDING_MIX";break;case Lu:e="ENVMAP_BLENDING_ADD";break}return e}function w_(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function T_(n,e,t,i){const s=n.getContext(),a=t.defines;let r=t.vertexShader,o=t.fragmentShader;const l=b_(t),c=M_(t),d=S_(t),u=E_(t),h=w_(t),m=p_(t),_=f_(a),x=s.createProgram();let f,p,M=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(ms).join(`
`),f.length>0&&(f+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(ms).join(`
`),p.length>0&&(p+=`
`)):(f=[nc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+d:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ms).join(`
`),p=[nc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+d:"",t.envMap?"#define "+u:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Qn?"#define TONE_MAPPING":"",t.toneMapping!==Qn?We.tonemapping_pars_fragment:"",t.toneMapping!==Qn?u_("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",We.colorspace_pars_fragment,d_("linearToOutputTexel",t.outputColorSpace),h_(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(ms).join(`
`)),r=To(r),r=Ql(r,t),r=ec(r,t),o=To(o),o=Ql(o,t),o=ec(o,t),r=tc(r),o=tc(o),t.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,f=[m,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+f,p=["#define varying in",t.glslVersion===sl?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===sl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const v=M+f+r,g=M+p+o,w=Zl(s,s.VERTEX_SHADER,v),A=Zl(s,s.FRAGMENT_SHADER,g);s.attachShader(x,w),s.attachShader(x,A),t.index0AttributeName!==void 0?s.bindAttribLocation(x,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(x,0,"position"),s.linkProgram(x);function y(R){if(n.debug.checkShaderErrors){const I=s.getProgramInfoLog(x)||"",L=s.getShaderInfoLog(w)||"",z=s.getShaderInfoLog(A)||"",N=I.trim(),F=L.trim(),B=z.trim();let $=!0,K=!0;if(s.getProgramParameter(x,s.LINK_STATUS)===!1)if($=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,x,w,A);else{const ue=Kl(s,w,"vertex"),ge=Kl(s,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(x,s.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+N+`
`+ue+`
`+ge)}else N!==""?console.warn("THREE.WebGLProgram: Program Info Log:",N):(F===""||B==="")&&(K=!1);K&&(R.diagnostics={runnable:$,programLog:N,vertexShader:{log:F,prefix:f},fragmentShader:{log:B,prefix:p}})}s.deleteShader(w),s.deleteShader(A),E=new wa(s,x),S=m_(s,x)}let E;this.getUniforms=function(){return E===void 0&&y(this),E};let S;this.getAttributes=function(){return S===void 0&&y(this),S};let b=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return b===!1&&(b=s.getProgramParameter(x,r_)),b},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(x),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=o_++,this.cacheKey=e,this.usedTimes=1,this.program=x,this.vertexShader=w,this.fragmentShader=A,this}let A_=0;class C_{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,s=this._getShaderStage(t),a=this._getShaderStage(i),r=this._getShaderCacheForMaterial(e);return r.has(s)===!1&&(r.add(s),s.usedTimes++),r.has(a)===!1&&(r.add(a),a.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new R_(e),t.set(e,i)),i}}class R_{constructor(e){this.id=A_++,this.code=e,this.usedTimes=0}}function P_(n,e,t,i,s,a,r){const o=new Fo,l=new C_,c=new Set,d=[],u=s.logarithmicDepthBuffer,h=s.vertexTextures;let m=s.precision;const _={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(S){return c.add(S),S===0?"uv":`uv${S}`}function f(S,b,R,I,L){const z=I.fog,N=L.geometry,F=S.isMeshStandardMaterial?I.environment:null,B=(S.isMeshStandardMaterial?t:e).get(S.envMap||F),$=B&&B.mapping===Ua?B.image.height:null,K=_[S.type];S.precision!==null&&(m=s.getMaxPrecision(S.precision),m!==S.precision&&console.warn("THREE.WebGLProgram.getParameters:",S.precision,"not supported, using",m,"instead."));const ue=N.morphAttributes.position||N.morphAttributes.normal||N.morphAttributes.color,ge=ue!==void 0?ue.length:0;let Oe=0;N.morphAttributes.position!==void 0&&(Oe=1),N.morphAttributes.normal!==void 0&&(Oe=2),N.morphAttributes.color!==void 0&&(Oe=3);let qe,Qe,Ke,Y;if(K){const nt=Mn[K];qe=nt.vertexShader,Qe=nt.fragmentShader}else qe=S.vertexShader,Qe=S.fragmentShader,l.update(S),Ke=l.getVertexShaderID(S),Y=l.getFragmentShaderID(S);const ie=n.getRenderTarget(),Se=n.state.buffers.depth.getReversed(),De=L.isInstancedMesh===!0,Te=L.isBatchedMesh===!0,Ye=!!S.map,mt=!!S.matcap,U=!!B,ne=!!S.aoMap,Q=!!S.lightMap,J=!!S.bumpMap,Z=!!S.normalMap,he=!!S.displacementMap,se=!!S.emissiveMap,pe=!!S.metalnessMap,He=!!S.roughnessMap,ke=S.anisotropy>0,P=S.clearcoat>0,T=S.dispersion>0,V=S.iridescence>0,X=S.sheen>0,te=S.transmission>0,q=ke&&!!S.anisotropyMap,Pe=P&&!!S.clearcoatMap,de=P&&!!S.clearcoatNormalMap,Ae=P&&!!S.clearcoatRoughnessMap,Ce=V&&!!S.iridescenceMap,ae=V&&!!S.iridescenceThicknessMap,xe=X&&!!S.sheenColorMap,Fe=X&&!!S.sheenRoughnessMap,Le=!!S.specularMap,_e=!!S.specularColorMap,Ve=!!S.specularIntensityMap,k=te&&!!S.transmissionMap,ce=te&&!!S.thicknessMap,fe=!!S.gradientMap,Ee=!!S.alphaMap,re=S.alphaTest>0,ee=!!S.alphaHash,Re=!!S.extensions;let Ge=Qn;S.toneMapped&&(ie===null||ie.isXRRenderTarget===!0)&&(Ge=n.toneMapping);const gt={shaderID:K,shaderType:S.type,shaderName:S.name,vertexShader:qe,fragmentShader:Qe,defines:S.defines,customVertexShaderID:Ke,customFragmentShaderID:Y,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:m,batching:Te,batchingColor:Te&&L._colorsTexture!==null,instancing:De,instancingColor:De&&L.instanceColor!==null,instancingMorph:De&&L.morphTexture!==null,supportsVertexTextures:h,outputColorSpace:ie===null?n.outputColorSpace:ie.isXRRenderTarget===!0?ie.texture.colorSpace:Zi,alphaToCoverage:!!S.alphaToCoverage,map:Ye,matcap:mt,envMap:U,envMapMode:U&&B.mapping,envMapCubeUVHeight:$,aoMap:ne,lightMap:Q,bumpMap:J,normalMap:Z,displacementMap:h&&he,emissiveMap:se,normalMapObjectSpace:Z&&S.normalMapType===Gu,normalMapTangentSpace:Z&&S.normalMapType===zc,metalnessMap:pe,roughnessMap:He,anisotropy:ke,anisotropyMap:q,clearcoat:P,clearcoatMap:Pe,clearcoatNormalMap:de,clearcoatRoughnessMap:Ae,dispersion:T,iridescence:V,iridescenceMap:Ce,iridescenceThicknessMap:ae,sheen:X,sheenColorMap:xe,sheenRoughnessMap:Fe,specularMap:Le,specularColorMap:_e,specularIntensityMap:Ve,transmission:te,transmissionMap:k,thicknessMap:ce,gradientMap:fe,opaque:S.transparent===!1&&S.blending===Wi&&S.alphaToCoverage===!1,alphaMap:Ee,alphaTest:re,alphaHash:ee,combine:S.combine,mapUv:Ye&&x(S.map.channel),aoMapUv:ne&&x(S.aoMap.channel),lightMapUv:Q&&x(S.lightMap.channel),bumpMapUv:J&&x(S.bumpMap.channel),normalMapUv:Z&&x(S.normalMap.channel),displacementMapUv:he&&x(S.displacementMap.channel),emissiveMapUv:se&&x(S.emissiveMap.channel),metalnessMapUv:pe&&x(S.metalnessMap.channel),roughnessMapUv:He&&x(S.roughnessMap.channel),anisotropyMapUv:q&&x(S.anisotropyMap.channel),clearcoatMapUv:Pe&&x(S.clearcoatMap.channel),clearcoatNormalMapUv:de&&x(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Ae&&x(S.clearcoatRoughnessMap.channel),iridescenceMapUv:Ce&&x(S.iridescenceMap.channel),iridescenceThicknessMapUv:ae&&x(S.iridescenceThicknessMap.channel),sheenColorMapUv:xe&&x(S.sheenColorMap.channel),sheenRoughnessMapUv:Fe&&x(S.sheenRoughnessMap.channel),specularMapUv:Le&&x(S.specularMap.channel),specularColorMapUv:_e&&x(S.specularColorMap.channel),specularIntensityMapUv:Ve&&x(S.specularIntensityMap.channel),transmissionMapUv:k&&x(S.transmissionMap.channel),thicknessMapUv:ce&&x(S.thicknessMap.channel),alphaMapUv:Ee&&x(S.alphaMap.channel),vertexTangents:!!N.attributes.tangent&&(Z||ke),vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!N.attributes.color&&N.attributes.color.itemSize===4,pointsUvs:L.isPoints===!0&&!!N.attributes.uv&&(Ye||Ee),fog:!!z,useFog:S.fog===!0,fogExp2:!!z&&z.isFogExp2,flatShading:S.flatShading===!0&&S.wireframe===!1,sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:Se,skinning:L.isSkinnedMesh===!0,morphTargets:N.morphAttributes.position!==void 0,morphNormals:N.morphAttributes.normal!==void 0,morphColors:N.morphAttributes.color!==void 0,morphTargetsCount:ge,morphTextureStride:Oe,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:S.dithering,shadowMapEnabled:n.shadowMap.enabled&&R.length>0,shadowMapType:n.shadowMap.type,toneMapping:Ge,decodeVideoTexture:Ye&&S.map.isVideoTexture===!0&&tt.getTransfer(S.map.colorSpace)===ot,decodeVideoTextureEmissive:se&&S.emissiveMap.isVideoTexture===!0&&tt.getTransfer(S.emissiveMap.colorSpace)===ot,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===fn,flipSided:S.side===Kt,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionClipCullDistance:Re&&S.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Re&&S.extensions.multiDraw===!0||Te)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()};return gt.vertexUv1s=c.has(1),gt.vertexUv2s=c.has(2),gt.vertexUv3s=c.has(3),c.clear(),gt}function p(S){const b=[];if(S.shaderID?b.push(S.shaderID):(b.push(S.customVertexShaderID),b.push(S.customFragmentShaderID)),S.defines!==void 0)for(const R in S.defines)b.push(R),b.push(S.defines[R]);return S.isRawShaderMaterial===!1&&(M(b,S),v(b,S),b.push(n.outputColorSpace)),b.push(S.customProgramCacheKey),b.join()}function M(S,b){S.push(b.precision),S.push(b.outputColorSpace),S.push(b.envMapMode),S.push(b.envMapCubeUVHeight),S.push(b.mapUv),S.push(b.alphaMapUv),S.push(b.lightMapUv),S.push(b.aoMapUv),S.push(b.bumpMapUv),S.push(b.normalMapUv),S.push(b.displacementMapUv),S.push(b.emissiveMapUv),S.push(b.metalnessMapUv),S.push(b.roughnessMapUv),S.push(b.anisotropyMapUv),S.push(b.clearcoatMapUv),S.push(b.clearcoatNormalMapUv),S.push(b.clearcoatRoughnessMapUv),S.push(b.iridescenceMapUv),S.push(b.iridescenceThicknessMapUv),S.push(b.sheenColorMapUv),S.push(b.sheenRoughnessMapUv),S.push(b.specularMapUv),S.push(b.specularColorMapUv),S.push(b.specularIntensityMapUv),S.push(b.transmissionMapUv),S.push(b.thicknessMapUv),S.push(b.combine),S.push(b.fogExp2),S.push(b.sizeAttenuation),S.push(b.morphTargetsCount),S.push(b.morphAttributeCount),S.push(b.numDirLights),S.push(b.numPointLights),S.push(b.numSpotLights),S.push(b.numSpotLightMaps),S.push(b.numHemiLights),S.push(b.numRectAreaLights),S.push(b.numDirLightShadows),S.push(b.numPointLightShadows),S.push(b.numSpotLightShadows),S.push(b.numSpotLightShadowsWithMaps),S.push(b.numLightProbes),S.push(b.shadowMapType),S.push(b.toneMapping),S.push(b.numClippingPlanes),S.push(b.numClipIntersection),S.push(b.depthPacking)}function v(S,b){o.disableAll(),b.supportsVertexTextures&&o.enable(0),b.instancing&&o.enable(1),b.instancingColor&&o.enable(2),b.instancingMorph&&o.enable(3),b.matcap&&o.enable(4),b.envMap&&o.enable(5),b.normalMapObjectSpace&&o.enable(6),b.normalMapTangentSpace&&o.enable(7),b.clearcoat&&o.enable(8),b.iridescence&&o.enable(9),b.alphaTest&&o.enable(10),b.vertexColors&&o.enable(11),b.vertexAlphas&&o.enable(12),b.vertexUv1s&&o.enable(13),b.vertexUv2s&&o.enable(14),b.vertexUv3s&&o.enable(15),b.vertexTangents&&o.enable(16),b.anisotropy&&o.enable(17),b.alphaHash&&o.enable(18),b.batching&&o.enable(19),b.dispersion&&o.enable(20),b.batchingColor&&o.enable(21),b.gradientMap&&o.enable(22),S.push(o.mask),o.disableAll(),b.fog&&o.enable(0),b.useFog&&o.enable(1),b.flatShading&&o.enable(2),b.logarithmicDepthBuffer&&o.enable(3),b.reversedDepthBuffer&&o.enable(4),b.skinning&&o.enable(5),b.morphTargets&&o.enable(6),b.morphNormals&&o.enable(7),b.morphColors&&o.enable(8),b.premultipliedAlpha&&o.enable(9),b.shadowMapEnabled&&o.enable(10),b.doubleSided&&o.enable(11),b.flipSided&&o.enable(12),b.useDepthPacking&&o.enable(13),b.dithering&&o.enable(14),b.transmission&&o.enable(15),b.sheen&&o.enable(16),b.opaque&&o.enable(17),b.pointsUvs&&o.enable(18),b.decodeVideoTexture&&o.enable(19),b.decodeVideoTextureEmissive&&o.enable(20),b.alphaToCoverage&&o.enable(21),S.push(o.mask)}function g(S){const b=_[S.type];let R;if(b){const I=Mn[b];R=vh.clone(I.uniforms)}else R=S.uniforms;return R}function w(S,b){let R;for(let I=0,L=d.length;I<L;I++){const z=d[I];if(z.cacheKey===b){R=z,++R.usedTimes;break}}return R===void 0&&(R=new T_(n,b,S,a),d.push(R)),R}function A(S){if(--S.usedTimes===0){const b=d.indexOf(S);d[b]=d[d.length-1],d.pop(),S.destroy()}}function y(S){l.remove(S)}function E(){l.dispose()}return{getParameters:f,getProgramCacheKey:p,getUniforms:g,acquireProgram:w,releaseProgram:A,releaseShaderCache:y,programs:d,dispose:E}}function L_(){let n=new WeakMap;function e(r){return n.has(r)}function t(r){let o=n.get(r);return o===void 0&&(o={},n.set(r,o)),o}function i(r){n.delete(r)}function s(r,o,l){n.get(r)[o]=l}function a(){n=new WeakMap}return{has:e,get:t,remove:i,update:s,dispose:a}}function D_(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.z!==e.z?n.z-e.z:n.id-e.id}function ic(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function sc(){const n=[];let e=0;const t=[],i=[],s=[];function a(){e=0,t.length=0,i.length=0,s.length=0}function r(u,h,m,_,x,f){let p=n[e];return p===void 0?(p={id:u.id,object:u,geometry:h,material:m,groupOrder:_,renderOrder:u.renderOrder,z:x,group:f},n[e]=p):(p.id=u.id,p.object=u,p.geometry=h,p.material=m,p.groupOrder=_,p.renderOrder=u.renderOrder,p.z=x,p.group=f),e++,p}function o(u,h,m,_,x,f){const p=r(u,h,m,_,x,f);m.transmission>0?i.push(p):m.transparent===!0?s.push(p):t.push(p)}function l(u,h,m,_,x,f){const p=r(u,h,m,_,x,f);m.transmission>0?i.unshift(p):m.transparent===!0?s.unshift(p):t.unshift(p)}function c(u,h){t.length>1&&t.sort(u||D_),i.length>1&&i.sort(h||ic),s.length>1&&s.sort(h||ic)}function d(){for(let u=e,h=n.length;u<h;u++){const m=n[u];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:i,transparent:s,init:a,push:o,unshift:l,finish:d,sort:c}}function I_(){let n=new WeakMap;function e(i,s){const a=n.get(i);let r;return a===void 0?(r=new sc,n.set(i,[r])):s>=a.length?(r=new sc,a.push(r)):r=a[s],r}function t(){n=new WeakMap}return{get:e,dispose:t}}function U_(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new D,color:new Xe};break;case"SpotLight":t={position:new D,direction:new D,color:new Xe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new D,color:new Xe,distance:0,decay:0};break;case"HemisphereLight":t={direction:new D,skyColor:new Xe,groundColor:new Xe};break;case"RectAreaLight":t={color:new Xe,position:new D,halfWidth:new D,halfHeight:new D};break}return n[e.id]=t,t}}}function N_(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new oe};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new oe};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new oe,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let F_=0;function O_(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function z_(n){const e=new U_,t=N_(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new D);const s=new D,a=new dt,r=new dt;function o(c){let d=0,u=0,h=0;for(let S=0;S<9;S++)i.probe[S].set(0,0,0);let m=0,_=0,x=0,f=0,p=0,M=0,v=0,g=0,w=0,A=0,y=0;c.sort(O_);for(let S=0,b=c.length;S<b;S++){const R=c[S],I=R.color,L=R.intensity,z=R.distance,N=R.shadow&&R.shadow.map?R.shadow.map.texture:null;if(R.isAmbientLight)d+=I.r*L,u+=I.g*L,h+=I.b*L;else if(R.isLightProbe){for(let F=0;F<9;F++)i.probe[F].addScaledVector(R.sh.coefficients[F],L);y++}else if(R.isDirectionalLight){const F=e.get(R);if(F.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){const B=R.shadow,$=t.get(R);$.shadowIntensity=B.intensity,$.shadowBias=B.bias,$.shadowNormalBias=B.normalBias,$.shadowRadius=B.radius,$.shadowMapSize=B.mapSize,i.directionalShadow[m]=$,i.directionalShadowMap[m]=N,i.directionalShadowMatrix[m]=R.shadow.matrix,M++}i.directional[m]=F,m++}else if(R.isSpotLight){const F=e.get(R);F.position.setFromMatrixPosition(R.matrixWorld),F.color.copy(I).multiplyScalar(L),F.distance=z,F.coneCos=Math.cos(R.angle),F.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),F.decay=R.decay,i.spot[x]=F;const B=R.shadow;if(R.map&&(i.spotLightMap[w]=R.map,w++,B.updateMatrices(R),R.castShadow&&A++),i.spotLightMatrix[x]=B.matrix,R.castShadow){const $=t.get(R);$.shadowIntensity=B.intensity,$.shadowBias=B.bias,$.shadowNormalBias=B.normalBias,$.shadowRadius=B.radius,$.shadowMapSize=B.mapSize,i.spotShadow[x]=$,i.spotShadowMap[x]=N,g++}x++}else if(R.isRectAreaLight){const F=e.get(R);F.color.copy(I).multiplyScalar(L),F.halfWidth.set(R.width*.5,0,0),F.halfHeight.set(0,R.height*.5,0),i.rectArea[f]=F,f++}else if(R.isPointLight){const F=e.get(R);if(F.color.copy(R.color).multiplyScalar(R.intensity),F.distance=R.distance,F.decay=R.decay,R.castShadow){const B=R.shadow,$=t.get(R);$.shadowIntensity=B.intensity,$.shadowBias=B.bias,$.shadowNormalBias=B.normalBias,$.shadowRadius=B.radius,$.shadowMapSize=B.mapSize,$.shadowCameraNear=B.camera.near,$.shadowCameraFar=B.camera.far,i.pointShadow[_]=$,i.pointShadowMap[_]=N,i.pointShadowMatrix[_]=R.shadow.matrix,v++}i.point[_]=F,_++}else if(R.isHemisphereLight){const F=e.get(R);F.skyColor.copy(R.color).multiplyScalar(L),F.groundColor.copy(R.groundColor).multiplyScalar(L),i.hemi[p]=F,p++}}f>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=me.LTC_FLOAT_1,i.rectAreaLTC2=me.LTC_FLOAT_2):(i.rectAreaLTC1=me.LTC_HALF_1,i.rectAreaLTC2=me.LTC_HALF_2)),i.ambient[0]=d,i.ambient[1]=u,i.ambient[2]=h;const E=i.hash;(E.directionalLength!==m||E.pointLength!==_||E.spotLength!==x||E.rectAreaLength!==f||E.hemiLength!==p||E.numDirectionalShadows!==M||E.numPointShadows!==v||E.numSpotShadows!==g||E.numSpotMaps!==w||E.numLightProbes!==y)&&(i.directional.length=m,i.spot.length=x,i.rectArea.length=f,i.point.length=_,i.hemi.length=p,i.directionalShadow.length=M,i.directionalShadowMap.length=M,i.pointShadow.length=v,i.pointShadowMap.length=v,i.spotShadow.length=g,i.spotShadowMap.length=g,i.directionalShadowMatrix.length=M,i.pointShadowMatrix.length=v,i.spotLightMatrix.length=g+w-A,i.spotLightMap.length=w,i.numSpotLightShadowsWithMaps=A,i.numLightProbes=y,E.directionalLength=m,E.pointLength=_,E.spotLength=x,E.rectAreaLength=f,E.hemiLength=p,E.numDirectionalShadows=M,E.numPointShadows=v,E.numSpotShadows=g,E.numSpotMaps=w,E.numLightProbes=y,i.version=F_++)}function l(c,d){let u=0,h=0,m=0,_=0,x=0;const f=d.matrixWorldInverse;for(let p=0,M=c.length;p<M;p++){const v=c[p];if(v.isDirectionalLight){const g=i.directional[u];g.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),g.direction.sub(s),g.direction.transformDirection(f),u++}else if(v.isSpotLight){const g=i.spot[m];g.position.setFromMatrixPosition(v.matrixWorld),g.position.applyMatrix4(f),g.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),g.direction.sub(s),g.direction.transformDirection(f),m++}else if(v.isRectAreaLight){const g=i.rectArea[_];g.position.setFromMatrixPosition(v.matrixWorld),g.position.applyMatrix4(f),r.identity(),a.copy(v.matrixWorld),a.premultiply(f),r.extractRotation(a),g.halfWidth.set(v.width*.5,0,0),g.halfHeight.set(0,v.height*.5,0),g.halfWidth.applyMatrix4(r),g.halfHeight.applyMatrix4(r),_++}else if(v.isPointLight){const g=i.point[h];g.position.setFromMatrixPosition(v.matrixWorld),g.position.applyMatrix4(f),h++}else if(v.isHemisphereLight){const g=i.hemi[x];g.direction.setFromMatrixPosition(v.matrixWorld),g.direction.transformDirection(f),x++}}}return{setup:o,setupView:l,state:i}}function ac(n){const e=new z_(n),t=[],i=[];function s(d){c.camera=d,t.length=0,i.length=0}function a(d){t.push(d)}function r(d){i.push(d)}function o(){e.setup(t)}function l(d){e.setupView(t,d)}const c={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:o,setupLightsView:l,pushLight:a,pushShadow:r}}function k_(n){let e=new WeakMap;function t(s,a=0){const r=e.get(s);let o;return r===void 0?(o=new ac(n),e.set(s,[o])):a>=r.length?(o=new ac(n),r.push(o)):o=r[a],o}function i(){e=new WeakMap}return{get:t,dispose:i}}const B_=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,H_=`uniform sampler2D shadow_pass;
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
}`;function G_(n,e,t){let i=new Oo;const s=new oe,a=new oe,r=new Tt,o=new lp({depthPacking:Hu}),l=new cp,c={},d=t.maxTextureSize,u={[ei]:Kt,[Kt]:ei,[fn]:fn},h=new ti({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new oe},radius:{value:4}},vertexShader:B_,fragmentShader:H_}),m=h.clone();m.defines.HORIZONTAL_PASS=1;const _=new Ft;_.setAttribute("position",new Tn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const x=new be(_,h),f=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Ac;let p=this.type;this.render=function(A,y,E){if(f.enabled===!1||f.autoUpdate===!1&&f.needsUpdate===!1||A.length===0)return;const S=n.getRenderTarget(),b=n.getActiveCubeFace(),R=n.getActiveMipmapLevel(),I=n.state;I.setBlending(Kn),I.buffers.depth.getReversed()===!0?I.buffers.color.setClear(0,0,0,0):I.buffers.color.setClear(1,1,1,1),I.buffers.depth.setTest(!0),I.setScissorTest(!1);const L=p!==Fn&&this.type===Fn,z=p===Fn&&this.type!==Fn;for(let N=0,F=A.length;N<F;N++){const B=A[N],$=B.shadow;if($===void 0){console.warn("THREE.WebGLShadowMap:",B,"has no shadow.");continue}if($.autoUpdate===!1&&$.needsUpdate===!1)continue;s.copy($.mapSize);const K=$.getFrameExtents();if(s.multiply(K),a.copy($.mapSize),(s.x>d||s.y>d)&&(s.x>d&&(a.x=Math.floor(d/K.x),s.x=a.x*K.x,$.mapSize.x=a.x),s.y>d&&(a.y=Math.floor(d/K.y),s.y=a.y*K.y,$.mapSize.y=a.y)),$.map===null||L===!0||z===!0){const ge=this.type!==Fn?{minFilter:gn,magFilter:gn}:{};$.map!==null&&$.map.dispose(),$.map=new bi(s.x,s.y,ge),$.map.texture.name=B.name+".shadowMap",$.camera.updateProjectionMatrix()}n.setRenderTarget($.map),n.clear();const ue=$.getViewportCount();for(let ge=0;ge<ue;ge++){const Oe=$.getViewport(ge);r.set(a.x*Oe.x,a.y*Oe.y,a.x*Oe.z,a.y*Oe.w),I.viewport(r),$.updateMatrices(B,ge),i=$.getFrustum(),g(y,E,$.camera,B,this.type)}$.isPointLightShadow!==!0&&this.type===Fn&&M($,E),$.needsUpdate=!1}p=this.type,f.needsUpdate=!1,n.setRenderTarget(S,b,R)};function M(A,y){const E=e.update(x);h.defines.VSM_SAMPLES!==A.blurSamples&&(h.defines.VSM_SAMPLES=A.blurSamples,m.defines.VSM_SAMPLES=A.blurSamples,h.needsUpdate=!0,m.needsUpdate=!0),A.mapPass===null&&(A.mapPass=new bi(s.x,s.y)),h.uniforms.shadow_pass.value=A.map.texture,h.uniforms.resolution.value=A.mapSize,h.uniforms.radius.value=A.radius,n.setRenderTarget(A.mapPass),n.clear(),n.renderBufferDirect(y,null,E,h,x,null),m.uniforms.shadow_pass.value=A.mapPass.texture,m.uniforms.resolution.value=A.mapSize,m.uniforms.radius.value=A.radius,n.setRenderTarget(A.map),n.clear(),n.renderBufferDirect(y,null,E,m,x,null)}function v(A,y,E,S){let b=null;const R=E.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(R!==void 0)b=R;else if(b=E.isPointLight===!0?l:o,n.localClippingEnabled&&y.clipShadows===!0&&Array.isArray(y.clippingPlanes)&&y.clippingPlanes.length!==0||y.displacementMap&&y.displacementScale!==0||y.alphaMap&&y.alphaTest>0||y.map&&y.alphaTest>0||y.alphaToCoverage===!0){const I=b.uuid,L=y.uuid;let z=c[I];z===void 0&&(z={},c[I]=z);let N=z[L];N===void 0&&(N=b.clone(),z[L]=N,y.addEventListener("dispose",w)),b=N}if(b.visible=y.visible,b.wireframe=y.wireframe,S===Fn?b.side=y.shadowSide!==null?y.shadowSide:y.side:b.side=y.shadowSide!==null?y.shadowSide:u[y.side],b.alphaMap=y.alphaMap,b.alphaTest=y.alphaToCoverage===!0?.5:y.alphaTest,b.map=y.map,b.clipShadows=y.clipShadows,b.clippingPlanes=y.clippingPlanes,b.clipIntersection=y.clipIntersection,b.displacementMap=y.displacementMap,b.displacementScale=y.displacementScale,b.displacementBias=y.displacementBias,b.wireframeLinewidth=y.wireframeLinewidth,b.linewidth=y.linewidth,E.isPointLight===!0&&b.isMeshDistanceMaterial===!0){const I=n.properties.get(b);I.light=E}return b}function g(A,y,E,S,b){if(A.visible===!1)return;if(A.layers.test(y.layers)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&b===Fn)&&(!A.frustumCulled||i.intersectsObject(A))){A.modelViewMatrix.multiplyMatrices(E.matrixWorldInverse,A.matrixWorld);const L=e.update(A),z=A.material;if(Array.isArray(z)){const N=L.groups;for(let F=0,B=N.length;F<B;F++){const $=N[F],K=z[$.materialIndex];if(K&&K.visible){const ue=v(A,K,S,b);A.onBeforeShadow(n,A,y,E,L,ue,$),n.renderBufferDirect(E,null,L,ue,A,$),A.onAfterShadow(n,A,y,E,L,ue,$)}}}else if(z.visible){const N=v(A,z,S,b);A.onBeforeShadow(n,A,y,E,L,N,null),n.renderBufferDirect(E,null,L,N,A,null),A.onAfterShadow(n,A,y,E,L,N,null)}}const I=A.children;for(let L=0,z=I.length;L<z;L++)g(I[L],y,E,S,b)}function w(A){A.target.removeEventListener("dispose",w);for(const E in c){const S=c[E],b=A.target.uuid;b in S&&(S[b].dispose(),delete S[b])}}}const V_={[Ir]:Ur,[Nr]:zr,[Fr]:kr,[Xi]:Or,[Ur]:Ir,[zr]:Nr,[kr]:Fr,[Or]:Xi};function $_(n,e){function t(){let k=!1;const ce=new Tt;let fe=null;const Ee=new Tt(0,0,0,0);return{setMask:function(re){fe!==re&&!k&&(n.colorMask(re,re,re,re),fe=re)},setLocked:function(re){k=re},setClear:function(re,ee,Re,Ge,gt){gt===!0&&(re*=Ge,ee*=Ge,Re*=Ge),ce.set(re,ee,Re,Ge),Ee.equals(ce)===!1&&(n.clearColor(re,ee,Re,Ge),Ee.copy(ce))},reset:function(){k=!1,fe=null,Ee.set(-1,0,0,0)}}}function i(){let k=!1,ce=!1,fe=null,Ee=null,re=null;return{setReversed:function(ee){if(ce!==ee){const Re=e.get("EXT_clip_control");ee?Re.clipControlEXT(Re.LOWER_LEFT_EXT,Re.ZERO_TO_ONE_EXT):Re.clipControlEXT(Re.LOWER_LEFT_EXT,Re.NEGATIVE_ONE_TO_ONE_EXT),ce=ee;const Ge=re;re=null,this.setClear(Ge)}},getReversed:function(){return ce},setTest:function(ee){ee?ie(n.DEPTH_TEST):Se(n.DEPTH_TEST)},setMask:function(ee){fe!==ee&&!k&&(n.depthMask(ee),fe=ee)},setFunc:function(ee){if(ce&&(ee=V_[ee]),Ee!==ee){switch(ee){case Ir:n.depthFunc(n.NEVER);break;case Ur:n.depthFunc(n.ALWAYS);break;case Nr:n.depthFunc(n.LESS);break;case Xi:n.depthFunc(n.LEQUAL);break;case Fr:n.depthFunc(n.EQUAL);break;case Or:n.depthFunc(n.GEQUAL);break;case zr:n.depthFunc(n.GREATER);break;case kr:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}Ee=ee}},setLocked:function(ee){k=ee},setClear:function(ee){re!==ee&&(ce&&(ee=1-ee),n.clearDepth(ee),re=ee)},reset:function(){k=!1,fe=null,Ee=null,re=null,ce=!1}}}function s(){let k=!1,ce=null,fe=null,Ee=null,re=null,ee=null,Re=null,Ge=null,gt=null;return{setTest:function(nt){k||(nt?ie(n.STENCIL_TEST):Se(n.STENCIL_TEST))},setMask:function(nt){ce!==nt&&!k&&(n.stencilMask(nt),ce=nt)},setFunc:function(nt,Rn,xn){(fe!==nt||Ee!==Rn||re!==xn)&&(n.stencilFunc(nt,Rn,xn),fe=nt,Ee=Rn,re=xn)},setOp:function(nt,Rn,xn){(ee!==nt||Re!==Rn||Ge!==xn)&&(n.stencilOp(nt,Rn,xn),ee=nt,Re=Rn,Ge=xn)},setLocked:function(nt){k=nt},setClear:function(nt){gt!==nt&&(n.clearStencil(nt),gt=nt)},reset:function(){k=!1,ce=null,fe=null,Ee=null,re=null,ee=null,Re=null,Ge=null,gt=null}}}const a=new t,r=new i,o=new s,l=new WeakMap,c=new WeakMap;let d={},u={},h=new WeakMap,m=[],_=null,x=!1,f=null,p=null,M=null,v=null,g=null,w=null,A=null,y=new Xe(0,0,0),E=0,S=!1,b=null,R=null,I=null,L=null,z=null;const N=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let F=!1,B=0;const $=n.getParameter(n.VERSION);$.indexOf("WebGL")!==-1?(B=parseFloat(/^WebGL (\d)/.exec($)[1]),F=B>=1):$.indexOf("OpenGL ES")!==-1&&(B=parseFloat(/^OpenGL ES (\d)/.exec($)[1]),F=B>=2);let K=null,ue={};const ge=n.getParameter(n.SCISSOR_BOX),Oe=n.getParameter(n.VIEWPORT),qe=new Tt().fromArray(ge),Qe=new Tt().fromArray(Oe);function Ke(k,ce,fe,Ee){const re=new Uint8Array(4),ee=n.createTexture();n.bindTexture(k,ee),n.texParameteri(k,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(k,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Re=0;Re<fe;Re++)k===n.TEXTURE_3D||k===n.TEXTURE_2D_ARRAY?n.texImage3D(ce,0,n.RGBA,1,1,Ee,0,n.RGBA,n.UNSIGNED_BYTE,re):n.texImage2D(ce+Re,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,re);return ee}const Y={};Y[n.TEXTURE_2D]=Ke(n.TEXTURE_2D,n.TEXTURE_2D,1),Y[n.TEXTURE_CUBE_MAP]=Ke(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),Y[n.TEXTURE_2D_ARRAY]=Ke(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),Y[n.TEXTURE_3D]=Ke(n.TEXTURE_3D,n.TEXTURE_3D,1,1),a.setClear(0,0,0,1),r.setClear(1),o.setClear(0),ie(n.DEPTH_TEST),r.setFunc(Xi),J(!1),Z(Ko),ie(n.CULL_FACE),ne(Kn);function ie(k){d[k]!==!0&&(n.enable(k),d[k]=!0)}function Se(k){d[k]!==!1&&(n.disable(k),d[k]=!1)}function De(k,ce){return u[k]!==ce?(n.bindFramebuffer(k,ce),u[k]=ce,k===n.DRAW_FRAMEBUFFER&&(u[n.FRAMEBUFFER]=ce),k===n.FRAMEBUFFER&&(u[n.DRAW_FRAMEBUFFER]=ce),!0):!1}function Te(k,ce){let fe=m,Ee=!1;if(k){fe=h.get(ce),fe===void 0&&(fe=[],h.set(ce,fe));const re=k.textures;if(fe.length!==re.length||fe[0]!==n.COLOR_ATTACHMENT0){for(let ee=0,Re=re.length;ee<Re;ee++)fe[ee]=n.COLOR_ATTACHMENT0+ee;fe.length=re.length,Ee=!0}}else fe[0]!==n.BACK&&(fe[0]=n.BACK,Ee=!0);Ee&&n.drawBuffers(fe)}function Ye(k){return _!==k?(n.useProgram(k),_=k,!0):!1}const mt={[mi]:n.FUNC_ADD,[pu]:n.FUNC_SUBTRACT,[fu]:n.FUNC_REVERSE_SUBTRACT};mt[mu]=n.MIN,mt[gu]=n.MAX;const U={[_u]:n.ZERO,[vu]:n.ONE,[xu]:n.SRC_COLOR,[Lr]:n.SRC_ALPHA,[wu]:n.SRC_ALPHA_SATURATE,[Su]:n.DST_COLOR,[bu]:n.DST_ALPHA,[yu]:n.ONE_MINUS_SRC_COLOR,[Dr]:n.ONE_MINUS_SRC_ALPHA,[Eu]:n.ONE_MINUS_DST_COLOR,[Mu]:n.ONE_MINUS_DST_ALPHA,[Tu]:n.CONSTANT_COLOR,[Au]:n.ONE_MINUS_CONSTANT_COLOR,[Cu]:n.CONSTANT_ALPHA,[Ru]:n.ONE_MINUS_CONSTANT_ALPHA};function ne(k,ce,fe,Ee,re,ee,Re,Ge,gt,nt){if(k===Kn){x===!0&&(Se(n.BLEND),x=!1);return}if(x===!1&&(ie(n.BLEND),x=!0),k!==hu){if(k!==f||nt!==S){if((p!==mi||g!==mi)&&(n.blendEquation(n.FUNC_ADD),p=mi,g=mi),nt)switch(k){case Wi:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Qo:n.blendFunc(n.ONE,n.ONE);break;case el:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case tl:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",k);break}else switch(k){case Wi:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Qo:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case el:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case tl:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",k);break}M=null,v=null,w=null,A=null,y.set(0,0,0),E=0,f=k,S=nt}return}re=re||ce,ee=ee||fe,Re=Re||Ee,(ce!==p||re!==g)&&(n.blendEquationSeparate(mt[ce],mt[re]),p=ce,g=re),(fe!==M||Ee!==v||ee!==w||Re!==A)&&(n.blendFuncSeparate(U[fe],U[Ee],U[ee],U[Re]),M=fe,v=Ee,w=ee,A=Re),(Ge.equals(y)===!1||gt!==E)&&(n.blendColor(Ge.r,Ge.g,Ge.b,gt),y.copy(Ge),E=gt),f=k,S=!1}function Q(k,ce){k.side===fn?Se(n.CULL_FACE):ie(n.CULL_FACE);let fe=k.side===Kt;ce&&(fe=!fe),J(fe),k.blending===Wi&&k.transparent===!1?ne(Kn):ne(k.blending,k.blendEquation,k.blendSrc,k.blendDst,k.blendEquationAlpha,k.blendSrcAlpha,k.blendDstAlpha,k.blendColor,k.blendAlpha,k.premultipliedAlpha),r.setFunc(k.depthFunc),r.setTest(k.depthTest),r.setMask(k.depthWrite),a.setMask(k.colorWrite);const Ee=k.stencilWrite;o.setTest(Ee),Ee&&(o.setMask(k.stencilWriteMask),o.setFunc(k.stencilFunc,k.stencilRef,k.stencilFuncMask),o.setOp(k.stencilFail,k.stencilZFail,k.stencilZPass)),se(k.polygonOffset,k.polygonOffsetFactor,k.polygonOffsetUnits),k.alphaToCoverage===!0?ie(n.SAMPLE_ALPHA_TO_COVERAGE):Se(n.SAMPLE_ALPHA_TO_COVERAGE)}function J(k){b!==k&&(k?n.frontFace(n.CW):n.frontFace(n.CCW),b=k)}function Z(k){k!==cu?(ie(n.CULL_FACE),k!==R&&(k===Ko?n.cullFace(n.BACK):k===du?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):Se(n.CULL_FACE),R=k}function he(k){k!==I&&(F&&n.lineWidth(k),I=k)}function se(k,ce,fe){k?(ie(n.POLYGON_OFFSET_FILL),(L!==ce||z!==fe)&&(n.polygonOffset(ce,fe),L=ce,z=fe)):Se(n.POLYGON_OFFSET_FILL)}function pe(k){k?ie(n.SCISSOR_TEST):Se(n.SCISSOR_TEST)}function He(k){k===void 0&&(k=n.TEXTURE0+N-1),K!==k&&(n.activeTexture(k),K=k)}function ke(k,ce,fe){fe===void 0&&(K===null?fe=n.TEXTURE0+N-1:fe=K);let Ee=ue[fe];Ee===void 0&&(Ee={type:void 0,texture:void 0},ue[fe]=Ee),(Ee.type!==k||Ee.texture!==ce)&&(K!==fe&&(n.activeTexture(fe),K=fe),n.bindTexture(k,ce||Y[k]),Ee.type=k,Ee.texture=ce)}function P(){const k=ue[K];k!==void 0&&k.type!==void 0&&(n.bindTexture(k.type,null),k.type=void 0,k.texture=void 0)}function T(){try{n.compressedTexImage2D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function V(){try{n.compressedTexImage3D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function X(){try{n.texSubImage2D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function te(){try{n.texSubImage3D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function q(){try{n.compressedTexSubImage2D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function Pe(){try{n.compressedTexSubImage3D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function de(){try{n.texStorage2D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function Ae(){try{n.texStorage3D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function Ce(){try{n.texImage2D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function ae(){try{n.texImage3D(...arguments)}catch(k){console.error("THREE.WebGLState:",k)}}function xe(k){qe.equals(k)===!1&&(n.scissor(k.x,k.y,k.z,k.w),qe.copy(k))}function Fe(k){Qe.equals(k)===!1&&(n.viewport(k.x,k.y,k.z,k.w),Qe.copy(k))}function Le(k,ce){let fe=c.get(ce);fe===void 0&&(fe=new WeakMap,c.set(ce,fe));let Ee=fe.get(k);Ee===void 0&&(Ee=n.getUniformBlockIndex(ce,k.name),fe.set(k,Ee))}function _e(k,ce){const Ee=c.get(ce).get(k);l.get(ce)!==Ee&&(n.uniformBlockBinding(ce,Ee,k.__bindingPointIndex),l.set(ce,Ee))}function Ve(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),r.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),d={},K=null,ue={},u={},h=new WeakMap,m=[],_=null,x=!1,f=null,p=null,M=null,v=null,g=null,w=null,A=null,y=new Xe(0,0,0),E=0,S=!1,b=null,R=null,I=null,L=null,z=null,qe.set(0,0,n.canvas.width,n.canvas.height),Qe.set(0,0,n.canvas.width,n.canvas.height),a.reset(),r.reset(),o.reset()}return{buffers:{color:a,depth:r,stencil:o},enable:ie,disable:Se,bindFramebuffer:De,drawBuffers:Te,useProgram:Ye,setBlending:ne,setMaterial:Q,setFlipSided:J,setCullFace:Z,setLineWidth:he,setPolygonOffset:se,setScissorTest:pe,activeTexture:He,bindTexture:ke,unbindTexture:P,compressedTexImage2D:T,compressedTexImage3D:V,texImage2D:Ce,texImage3D:ae,updateUBOMapping:Le,uniformBlockBinding:_e,texStorage2D:de,texStorage3D:Ae,texSubImage2D:X,texSubImage3D:te,compressedTexSubImage2D:q,compressedTexSubImage3D:Pe,scissor:xe,viewport:Fe,reset:Ve}}function W_(n,e,t,i,s,a,r){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new oe,d=new WeakMap;let u;const h=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function _(P,T){return m?new OffscreenCanvas(P,T):Ra("canvas")}function x(P,T,V){let X=1;const te=ke(P);if((te.width>V||te.height>V)&&(X=V/Math.max(te.width,te.height)),X<1)if(typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&P instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&P instanceof ImageBitmap||typeof VideoFrame<"u"&&P instanceof VideoFrame){const q=Math.floor(X*te.width),Pe=Math.floor(X*te.height);u===void 0&&(u=_(q,Pe));const de=T?_(q,Pe):u;return de.width=q,de.height=Pe,de.getContext("2d").drawImage(P,0,0,q,Pe),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+te.width+"x"+te.height+") to ("+q+"x"+Pe+")."),de}else return"data"in P&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+te.width+"x"+te.height+")."),P;return P}function f(P){return P.generateMipmaps}function p(P){n.generateMipmap(P)}function M(P){return P.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:P.isWebGL3DRenderTarget?n.TEXTURE_3D:P.isWebGLArrayRenderTarget||P.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function v(P,T,V,X,te=!1){if(P!==null){if(n[P]!==void 0)return n[P];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+P+"'")}let q=T;if(T===n.RED&&(V===n.FLOAT&&(q=n.R32F),V===n.HALF_FLOAT&&(q=n.R16F),V===n.UNSIGNED_BYTE&&(q=n.R8)),T===n.RED_INTEGER&&(V===n.UNSIGNED_BYTE&&(q=n.R8UI),V===n.UNSIGNED_SHORT&&(q=n.R16UI),V===n.UNSIGNED_INT&&(q=n.R32UI),V===n.BYTE&&(q=n.R8I),V===n.SHORT&&(q=n.R16I),V===n.INT&&(q=n.R32I)),T===n.RG&&(V===n.FLOAT&&(q=n.RG32F),V===n.HALF_FLOAT&&(q=n.RG16F),V===n.UNSIGNED_BYTE&&(q=n.RG8)),T===n.RG_INTEGER&&(V===n.UNSIGNED_BYTE&&(q=n.RG8UI),V===n.UNSIGNED_SHORT&&(q=n.RG16UI),V===n.UNSIGNED_INT&&(q=n.RG32UI),V===n.BYTE&&(q=n.RG8I),V===n.SHORT&&(q=n.RG16I),V===n.INT&&(q=n.RG32I)),T===n.RGB_INTEGER&&(V===n.UNSIGNED_BYTE&&(q=n.RGB8UI),V===n.UNSIGNED_SHORT&&(q=n.RGB16UI),V===n.UNSIGNED_INT&&(q=n.RGB32UI),V===n.BYTE&&(q=n.RGB8I),V===n.SHORT&&(q=n.RGB16I),V===n.INT&&(q=n.RGB32I)),T===n.RGBA_INTEGER&&(V===n.UNSIGNED_BYTE&&(q=n.RGBA8UI),V===n.UNSIGNED_SHORT&&(q=n.RGBA16UI),V===n.UNSIGNED_INT&&(q=n.RGBA32UI),V===n.BYTE&&(q=n.RGBA8I),V===n.SHORT&&(q=n.RGBA16I),V===n.INT&&(q=n.RGBA32I)),T===n.RGB&&(V===n.UNSIGNED_INT_5_9_9_9_REV&&(q=n.RGB9_E5),V===n.UNSIGNED_INT_10F_11F_11F_REV&&(q=n.R11F_G11F_B10F)),T===n.RGBA){const Pe=te?Aa:tt.getTransfer(X);V===n.FLOAT&&(q=n.RGBA32F),V===n.HALF_FLOAT&&(q=n.RGBA16F),V===n.UNSIGNED_BYTE&&(q=Pe===ot?n.SRGB8_ALPHA8:n.RGBA8),V===n.UNSIGNED_SHORT_4_4_4_4&&(q=n.RGBA4),V===n.UNSIGNED_SHORT_5_5_5_1&&(q=n.RGB5_A1)}return(q===n.R16F||q===n.R32F||q===n.RG16F||q===n.RG32F||q===n.RGBA16F||q===n.RGBA32F)&&e.get("EXT_color_buffer_float"),q}function g(P,T){let V;return P?T===null||T===yi||T===Ts?V=n.DEPTH24_STENCIL8:T===zn?V=n.DEPTH32F_STENCIL8:T===ws&&(V=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):T===null||T===yi||T===Ts?V=n.DEPTH_COMPONENT24:T===zn?V=n.DEPTH_COMPONENT32F:T===ws&&(V=n.DEPTH_COMPONENT16),V}function w(P,T){return f(P)===!0||P.isFramebufferTexture&&P.minFilter!==gn&&P.minFilter!==En?Math.log2(Math.max(T.width,T.height))+1:P.mipmaps!==void 0&&P.mipmaps.length>0?P.mipmaps.length:P.isCompressedTexture&&Array.isArray(P.image)?T.mipmaps.length:1}function A(P){const T=P.target;T.removeEventListener("dispose",A),E(T),T.isVideoTexture&&d.delete(T)}function y(P){const T=P.target;T.removeEventListener("dispose",y),b(T)}function E(P){const T=i.get(P);if(T.__webglInit===void 0)return;const V=P.source,X=h.get(V);if(X){const te=X[T.__cacheKey];te.usedTimes--,te.usedTimes===0&&S(P),Object.keys(X).length===0&&h.delete(V)}i.remove(P)}function S(P){const T=i.get(P);n.deleteTexture(T.__webglTexture);const V=P.source,X=h.get(V);delete X[T.__cacheKey],r.memory.textures--}function b(P){const T=i.get(P);if(P.depthTexture&&(P.depthTexture.dispose(),i.remove(P.depthTexture)),P.isWebGLCubeRenderTarget)for(let X=0;X<6;X++){if(Array.isArray(T.__webglFramebuffer[X]))for(let te=0;te<T.__webglFramebuffer[X].length;te++)n.deleteFramebuffer(T.__webglFramebuffer[X][te]);else n.deleteFramebuffer(T.__webglFramebuffer[X]);T.__webglDepthbuffer&&n.deleteRenderbuffer(T.__webglDepthbuffer[X])}else{if(Array.isArray(T.__webglFramebuffer))for(let X=0;X<T.__webglFramebuffer.length;X++)n.deleteFramebuffer(T.__webglFramebuffer[X]);else n.deleteFramebuffer(T.__webglFramebuffer);if(T.__webglDepthbuffer&&n.deleteRenderbuffer(T.__webglDepthbuffer),T.__webglMultisampledFramebuffer&&n.deleteFramebuffer(T.__webglMultisampledFramebuffer),T.__webglColorRenderbuffer)for(let X=0;X<T.__webglColorRenderbuffer.length;X++)T.__webglColorRenderbuffer[X]&&n.deleteRenderbuffer(T.__webglColorRenderbuffer[X]);T.__webglDepthRenderbuffer&&n.deleteRenderbuffer(T.__webglDepthRenderbuffer)}const V=P.textures;for(let X=0,te=V.length;X<te;X++){const q=i.get(V[X]);q.__webglTexture&&(n.deleteTexture(q.__webglTexture),r.memory.textures--),i.remove(V[X])}i.remove(P)}let R=0;function I(){R=0}function L(){const P=R;return P>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+P+" texture units while this GPU supports only "+s.maxTextures),R+=1,P}function z(P){const T=[];return T.push(P.wrapS),T.push(P.wrapT),T.push(P.wrapR||0),T.push(P.magFilter),T.push(P.minFilter),T.push(P.anisotropy),T.push(P.internalFormat),T.push(P.format),T.push(P.type),T.push(P.generateMipmaps),T.push(P.premultiplyAlpha),T.push(P.flipY),T.push(P.unpackAlignment),T.push(P.colorSpace),T.join()}function N(P,T){const V=i.get(P);if(P.isVideoTexture&&pe(P),P.isRenderTargetTexture===!1&&P.isExternalTexture!==!0&&P.version>0&&V.__version!==P.version){const X=P.image;if(X===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(X.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Y(V,P,T);return}}else P.isExternalTexture&&(V.__webglTexture=P.sourceTexture?P.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,V.__webglTexture,n.TEXTURE0+T)}function F(P,T){const V=i.get(P);if(P.isRenderTargetTexture===!1&&P.version>0&&V.__version!==P.version){Y(V,P,T);return}t.bindTexture(n.TEXTURE_2D_ARRAY,V.__webglTexture,n.TEXTURE0+T)}function B(P,T){const V=i.get(P);if(P.isRenderTargetTexture===!1&&P.version>0&&V.__version!==P.version){Y(V,P,T);return}t.bindTexture(n.TEXTURE_3D,V.__webglTexture,n.TEXTURE0+T)}function $(P,T){const V=i.get(P);if(P.version>0&&V.__version!==P.version){ie(V,P,T);return}t.bindTexture(n.TEXTURE_CUBE_MAP,V.__webglTexture,n.TEXTURE0+T)}const K={[Gr]:n.REPEAT,[vi]:n.CLAMP_TO_EDGE,[Vr]:n.MIRRORED_REPEAT},ue={[gn]:n.NEAREST,[ku]:n.NEAREST_MIPMAP_NEAREST,[Hs]:n.NEAREST_MIPMAP_LINEAR,[En]:n.LINEAR,[Ga]:n.LINEAR_MIPMAP_NEAREST,[xi]:n.LINEAR_MIPMAP_LINEAR},ge={[Vu]:n.NEVER,[Yu]:n.ALWAYS,[$u]:n.LESS,[kc]:n.LEQUAL,[Wu]:n.EQUAL,[qu]:n.GEQUAL,[ju]:n.GREATER,[Xu]:n.NOTEQUAL};function Oe(P,T){if(T.type===zn&&e.has("OES_texture_float_linear")===!1&&(T.magFilter===En||T.magFilter===Ga||T.magFilter===Hs||T.magFilter===xi||T.minFilter===En||T.minFilter===Ga||T.minFilter===Hs||T.minFilter===xi)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(P,n.TEXTURE_WRAP_S,K[T.wrapS]),n.texParameteri(P,n.TEXTURE_WRAP_T,K[T.wrapT]),(P===n.TEXTURE_3D||P===n.TEXTURE_2D_ARRAY)&&n.texParameteri(P,n.TEXTURE_WRAP_R,K[T.wrapR]),n.texParameteri(P,n.TEXTURE_MAG_FILTER,ue[T.magFilter]),n.texParameteri(P,n.TEXTURE_MIN_FILTER,ue[T.minFilter]),T.compareFunction&&(n.texParameteri(P,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(P,n.TEXTURE_COMPARE_FUNC,ge[T.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(T.magFilter===gn||T.minFilter!==Hs&&T.minFilter!==xi||T.type===zn&&e.has("OES_texture_float_linear")===!1)return;if(T.anisotropy>1||i.get(T).__currentAnisotropy){const V=e.get("EXT_texture_filter_anisotropic");n.texParameterf(P,V.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(T.anisotropy,s.getMaxAnisotropy())),i.get(T).__currentAnisotropy=T.anisotropy}}}function qe(P,T){let V=!1;P.__webglInit===void 0&&(P.__webglInit=!0,T.addEventListener("dispose",A));const X=T.source;let te=h.get(X);te===void 0&&(te={},h.set(X,te));const q=z(T);if(q!==P.__cacheKey){te[q]===void 0&&(te[q]={texture:n.createTexture(),usedTimes:0},r.memory.textures++,V=!0),te[q].usedTimes++;const Pe=te[P.__cacheKey];Pe!==void 0&&(te[P.__cacheKey].usedTimes--,Pe.usedTimes===0&&S(T)),P.__cacheKey=q,P.__webglTexture=te[q].texture}return V}function Qe(P,T,V){return Math.floor(Math.floor(P/V)/T)}function Ke(P,T,V,X){const q=P.updateRanges;if(q.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,T.width,T.height,V,X,T.data);else{q.sort((ae,xe)=>ae.start-xe.start);let Pe=0;for(let ae=1;ae<q.length;ae++){const xe=q[Pe],Fe=q[ae],Le=xe.start+xe.count,_e=Qe(Fe.start,T.width,4),Ve=Qe(xe.start,T.width,4);Fe.start<=Le+1&&_e===Ve&&Qe(Fe.start+Fe.count-1,T.width,4)===_e?xe.count=Math.max(xe.count,Fe.start+Fe.count-xe.start):(++Pe,q[Pe]=Fe)}q.length=Pe+1;const de=n.getParameter(n.UNPACK_ROW_LENGTH),Ae=n.getParameter(n.UNPACK_SKIP_PIXELS),Ce=n.getParameter(n.UNPACK_SKIP_ROWS);n.pixelStorei(n.UNPACK_ROW_LENGTH,T.width);for(let ae=0,xe=q.length;ae<xe;ae++){const Fe=q[ae],Le=Math.floor(Fe.start/4),_e=Math.ceil(Fe.count/4),Ve=Le%T.width,k=Math.floor(Le/T.width),ce=_e,fe=1;n.pixelStorei(n.UNPACK_SKIP_PIXELS,Ve),n.pixelStorei(n.UNPACK_SKIP_ROWS,k),t.texSubImage2D(n.TEXTURE_2D,0,Ve,k,ce,fe,V,X,T.data)}P.clearUpdateRanges(),n.pixelStorei(n.UNPACK_ROW_LENGTH,de),n.pixelStorei(n.UNPACK_SKIP_PIXELS,Ae),n.pixelStorei(n.UNPACK_SKIP_ROWS,Ce)}}function Y(P,T,V){let X=n.TEXTURE_2D;(T.isDataArrayTexture||T.isCompressedArrayTexture)&&(X=n.TEXTURE_2D_ARRAY),T.isData3DTexture&&(X=n.TEXTURE_3D);const te=qe(P,T),q=T.source;t.bindTexture(X,P.__webglTexture,n.TEXTURE0+V);const Pe=i.get(q);if(q.version!==Pe.__version||te===!0){t.activeTexture(n.TEXTURE0+V);const de=tt.getPrimaries(tt.workingColorSpace),Ae=T.colorSpace===Jn?null:tt.getPrimaries(T.colorSpace),Ce=T.colorSpace===Jn||de===Ae?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,T.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,T.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ce);let ae=x(T.image,!1,s.maxTextureSize);ae=He(T,ae);const xe=a.convert(T.format,T.colorSpace),Fe=a.convert(T.type);let Le=v(T.internalFormat,xe,Fe,T.colorSpace,T.isVideoTexture);Oe(X,T);let _e;const Ve=T.mipmaps,k=T.isVideoTexture!==!0,ce=Pe.__version===void 0||te===!0,fe=q.dataReady,Ee=w(T,ae);if(T.isDepthTexture)Le=g(T.format===Cs,T.type),ce&&(k?t.texStorage2D(n.TEXTURE_2D,1,Le,ae.width,ae.height):t.texImage2D(n.TEXTURE_2D,0,Le,ae.width,ae.height,0,xe,Fe,null));else if(T.isDataTexture)if(Ve.length>0){k&&ce&&t.texStorage2D(n.TEXTURE_2D,Ee,Le,Ve[0].width,Ve[0].height);for(let re=0,ee=Ve.length;re<ee;re++)_e=Ve[re],k?fe&&t.texSubImage2D(n.TEXTURE_2D,re,0,0,_e.width,_e.height,xe,Fe,_e.data):t.texImage2D(n.TEXTURE_2D,re,Le,_e.width,_e.height,0,xe,Fe,_e.data);T.generateMipmaps=!1}else k?(ce&&t.texStorage2D(n.TEXTURE_2D,Ee,Le,ae.width,ae.height),fe&&Ke(T,ae,xe,Fe)):t.texImage2D(n.TEXTURE_2D,0,Le,ae.width,ae.height,0,xe,Fe,ae.data);else if(T.isCompressedTexture)if(T.isCompressedArrayTexture){k&&ce&&t.texStorage3D(n.TEXTURE_2D_ARRAY,Ee,Le,Ve[0].width,Ve[0].height,ae.depth);for(let re=0,ee=Ve.length;re<ee;re++)if(_e=Ve[re],T.format!==mn)if(xe!==null)if(k){if(fe)if(T.layerUpdates.size>0){const Re=Nl(_e.width,_e.height,T.format,T.type);for(const Ge of T.layerUpdates){const gt=_e.data.subarray(Ge*Re/_e.data.BYTES_PER_ELEMENT,(Ge+1)*Re/_e.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,re,0,0,Ge,_e.width,_e.height,1,xe,gt)}T.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,re,0,0,0,_e.width,_e.height,ae.depth,xe,_e.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,re,Le,_e.width,_e.height,ae.depth,0,_e.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else k?fe&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,re,0,0,0,_e.width,_e.height,ae.depth,xe,Fe,_e.data):t.texImage3D(n.TEXTURE_2D_ARRAY,re,Le,_e.width,_e.height,ae.depth,0,xe,Fe,_e.data)}else{k&&ce&&t.texStorage2D(n.TEXTURE_2D,Ee,Le,Ve[0].width,Ve[0].height);for(let re=0,ee=Ve.length;re<ee;re++)_e=Ve[re],T.format!==mn?xe!==null?k?fe&&t.compressedTexSubImage2D(n.TEXTURE_2D,re,0,0,_e.width,_e.height,xe,_e.data):t.compressedTexImage2D(n.TEXTURE_2D,re,Le,_e.width,_e.height,0,_e.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):k?fe&&t.texSubImage2D(n.TEXTURE_2D,re,0,0,_e.width,_e.height,xe,Fe,_e.data):t.texImage2D(n.TEXTURE_2D,re,Le,_e.width,_e.height,0,xe,Fe,_e.data)}else if(T.isDataArrayTexture)if(k){if(ce&&t.texStorage3D(n.TEXTURE_2D_ARRAY,Ee,Le,ae.width,ae.height,ae.depth),fe)if(T.layerUpdates.size>0){const re=Nl(ae.width,ae.height,T.format,T.type);for(const ee of T.layerUpdates){const Re=ae.data.subarray(ee*re/ae.data.BYTES_PER_ELEMENT,(ee+1)*re/ae.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,ee,ae.width,ae.height,1,xe,Fe,Re)}T.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,ae.width,ae.height,ae.depth,xe,Fe,ae.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,Le,ae.width,ae.height,ae.depth,0,xe,Fe,ae.data);else if(T.isData3DTexture)k?(ce&&t.texStorage3D(n.TEXTURE_3D,Ee,Le,ae.width,ae.height,ae.depth),fe&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,ae.width,ae.height,ae.depth,xe,Fe,ae.data)):t.texImage3D(n.TEXTURE_3D,0,Le,ae.width,ae.height,ae.depth,0,xe,Fe,ae.data);else if(T.isFramebufferTexture){if(ce)if(k)t.texStorage2D(n.TEXTURE_2D,Ee,Le,ae.width,ae.height);else{let re=ae.width,ee=ae.height;for(let Re=0;Re<Ee;Re++)t.texImage2D(n.TEXTURE_2D,Re,Le,re,ee,0,xe,Fe,null),re>>=1,ee>>=1}}else if(Ve.length>0){if(k&&ce){const re=ke(Ve[0]);t.texStorage2D(n.TEXTURE_2D,Ee,Le,re.width,re.height)}for(let re=0,ee=Ve.length;re<ee;re++)_e=Ve[re],k?fe&&t.texSubImage2D(n.TEXTURE_2D,re,0,0,xe,Fe,_e):t.texImage2D(n.TEXTURE_2D,re,Le,xe,Fe,_e);T.generateMipmaps=!1}else if(k){if(ce){const re=ke(ae);t.texStorage2D(n.TEXTURE_2D,Ee,Le,re.width,re.height)}fe&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,xe,Fe,ae)}else t.texImage2D(n.TEXTURE_2D,0,Le,xe,Fe,ae);f(T)&&p(X),Pe.__version=q.version,T.onUpdate&&T.onUpdate(T)}P.__version=T.version}function ie(P,T,V){if(T.image.length!==6)return;const X=qe(P,T),te=T.source;t.bindTexture(n.TEXTURE_CUBE_MAP,P.__webglTexture,n.TEXTURE0+V);const q=i.get(te);if(te.version!==q.__version||X===!0){t.activeTexture(n.TEXTURE0+V);const Pe=tt.getPrimaries(tt.workingColorSpace),de=T.colorSpace===Jn?null:tt.getPrimaries(T.colorSpace),Ae=T.colorSpace===Jn||Pe===de?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,T.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,T.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ae);const Ce=T.isCompressedTexture||T.image[0].isCompressedTexture,ae=T.image[0]&&T.image[0].isDataTexture,xe=[];for(let ee=0;ee<6;ee++)!Ce&&!ae?xe[ee]=x(T.image[ee],!0,s.maxCubemapSize):xe[ee]=ae?T.image[ee].image:T.image[ee],xe[ee]=He(T,xe[ee]);const Fe=xe[0],Le=a.convert(T.format,T.colorSpace),_e=a.convert(T.type),Ve=v(T.internalFormat,Le,_e,T.colorSpace),k=T.isVideoTexture!==!0,ce=q.__version===void 0||X===!0,fe=te.dataReady;let Ee=w(T,Fe);Oe(n.TEXTURE_CUBE_MAP,T);let re;if(Ce){k&&ce&&t.texStorage2D(n.TEXTURE_CUBE_MAP,Ee,Ve,Fe.width,Fe.height);for(let ee=0;ee<6;ee++){re=xe[ee].mipmaps;for(let Re=0;Re<re.length;Re++){const Ge=re[Re];T.format!==mn?Le!==null?k?fe&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Re,0,0,Ge.width,Ge.height,Le,Ge.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Re,Ve,Ge.width,Ge.height,0,Ge.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):k?fe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Re,0,0,Ge.width,Ge.height,Le,_e,Ge.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Re,Ve,Ge.width,Ge.height,0,Le,_e,Ge.data)}}}else{if(re=T.mipmaps,k&&ce){re.length>0&&Ee++;const ee=ke(xe[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,Ee,Ve,ee.width,ee.height)}for(let ee=0;ee<6;ee++)if(ae){k?fe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,0,0,xe[ee].width,xe[ee].height,Le,_e,xe[ee].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,Ve,xe[ee].width,xe[ee].height,0,Le,_e,xe[ee].data);for(let Re=0;Re<re.length;Re++){const gt=re[Re].image[ee].image;k?fe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Re+1,0,0,gt.width,gt.height,Le,_e,gt.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Re+1,Ve,gt.width,gt.height,0,Le,_e,gt.data)}}else{k?fe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,0,0,Le,_e,xe[ee]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,0,Ve,Le,_e,xe[ee]);for(let Re=0;Re<re.length;Re++){const Ge=re[Re];k?fe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Re+1,0,0,Le,_e,Ge.image[ee]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ee,Re+1,Ve,Le,_e,Ge.image[ee])}}}f(T)&&p(n.TEXTURE_CUBE_MAP),q.__version=te.version,T.onUpdate&&T.onUpdate(T)}P.__version=T.version}function Se(P,T,V,X,te,q){const Pe=a.convert(V.format,V.colorSpace),de=a.convert(V.type),Ae=v(V.internalFormat,Pe,de,V.colorSpace),Ce=i.get(T),ae=i.get(V);if(ae.__renderTarget=T,!Ce.__hasExternalTextures){const xe=Math.max(1,T.width>>q),Fe=Math.max(1,T.height>>q);te===n.TEXTURE_3D||te===n.TEXTURE_2D_ARRAY?t.texImage3D(te,q,Ae,xe,Fe,T.depth,0,Pe,de,null):t.texImage2D(te,q,Ae,xe,Fe,0,Pe,de,null)}t.bindFramebuffer(n.FRAMEBUFFER,P),se(T)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,X,te,ae.__webglTexture,0,he(T)):(te===n.TEXTURE_2D||te>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&te<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,X,te,ae.__webglTexture,q),t.bindFramebuffer(n.FRAMEBUFFER,null)}function De(P,T,V){if(n.bindRenderbuffer(n.RENDERBUFFER,P),T.depthBuffer){const X=T.depthTexture,te=X&&X.isDepthTexture?X.type:null,q=g(T.stencilBuffer,te),Pe=T.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,de=he(T);se(T)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,de,q,T.width,T.height):V?n.renderbufferStorageMultisample(n.RENDERBUFFER,de,q,T.width,T.height):n.renderbufferStorage(n.RENDERBUFFER,q,T.width,T.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,Pe,n.RENDERBUFFER,P)}else{const X=T.textures;for(let te=0;te<X.length;te++){const q=X[te],Pe=a.convert(q.format,q.colorSpace),de=a.convert(q.type),Ae=v(q.internalFormat,Pe,de,q.colorSpace),Ce=he(T);V&&se(T)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Ce,Ae,T.width,T.height):se(T)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Ce,Ae,T.width,T.height):n.renderbufferStorage(n.RENDERBUFFER,Ae,T.width,T.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function Te(P,T){if(T&&T.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(n.FRAMEBUFFER,P),!(T.depthTexture&&T.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const X=i.get(T.depthTexture);X.__renderTarget=T,(!X.__webglTexture||T.depthTexture.image.width!==T.width||T.depthTexture.image.height!==T.height)&&(T.depthTexture.image.width=T.width,T.depthTexture.image.height=T.height,T.depthTexture.needsUpdate=!0),N(T.depthTexture,0);const te=X.__webglTexture,q=he(T);if(T.depthTexture.format===As)se(T)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,te,0,q):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,te,0);else if(T.depthTexture.format===Cs)se(T)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,te,0,q):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,te,0);else throw new Error("Unknown depthTexture format")}function Ye(P){const T=i.get(P),V=P.isWebGLCubeRenderTarget===!0;if(T.__boundDepthTexture!==P.depthTexture){const X=P.depthTexture;if(T.__depthDisposeCallback&&T.__depthDisposeCallback(),X){const te=()=>{delete T.__boundDepthTexture,delete T.__depthDisposeCallback,X.removeEventListener("dispose",te)};X.addEventListener("dispose",te),T.__depthDisposeCallback=te}T.__boundDepthTexture=X}if(P.depthTexture&&!T.__autoAllocateDepthBuffer){if(V)throw new Error("target.depthTexture not supported in Cube render targets");const X=P.texture.mipmaps;X&&X.length>0?Te(T.__webglFramebuffer[0],P):Te(T.__webglFramebuffer,P)}else if(V){T.__webglDepthbuffer=[];for(let X=0;X<6;X++)if(t.bindFramebuffer(n.FRAMEBUFFER,T.__webglFramebuffer[X]),T.__webglDepthbuffer[X]===void 0)T.__webglDepthbuffer[X]=n.createRenderbuffer(),De(T.__webglDepthbuffer[X],P,!1);else{const te=P.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,q=T.__webglDepthbuffer[X];n.bindRenderbuffer(n.RENDERBUFFER,q),n.framebufferRenderbuffer(n.FRAMEBUFFER,te,n.RENDERBUFFER,q)}}else{const X=P.texture.mipmaps;if(X&&X.length>0?t.bindFramebuffer(n.FRAMEBUFFER,T.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,T.__webglFramebuffer),T.__webglDepthbuffer===void 0)T.__webglDepthbuffer=n.createRenderbuffer(),De(T.__webglDepthbuffer,P,!1);else{const te=P.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,q=T.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,q),n.framebufferRenderbuffer(n.FRAMEBUFFER,te,n.RENDERBUFFER,q)}}t.bindFramebuffer(n.FRAMEBUFFER,null)}function mt(P,T,V){const X=i.get(P);T!==void 0&&Se(X.__webglFramebuffer,P,P.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),V!==void 0&&Ye(P)}function U(P){const T=P.texture,V=i.get(P),X=i.get(T);P.addEventListener("dispose",y);const te=P.textures,q=P.isWebGLCubeRenderTarget===!0,Pe=te.length>1;if(Pe||(X.__webglTexture===void 0&&(X.__webglTexture=n.createTexture()),X.__version=T.version,r.memory.textures++),q){V.__webglFramebuffer=[];for(let de=0;de<6;de++)if(T.mipmaps&&T.mipmaps.length>0){V.__webglFramebuffer[de]=[];for(let Ae=0;Ae<T.mipmaps.length;Ae++)V.__webglFramebuffer[de][Ae]=n.createFramebuffer()}else V.__webglFramebuffer[de]=n.createFramebuffer()}else{if(T.mipmaps&&T.mipmaps.length>0){V.__webglFramebuffer=[];for(let de=0;de<T.mipmaps.length;de++)V.__webglFramebuffer[de]=n.createFramebuffer()}else V.__webglFramebuffer=n.createFramebuffer();if(Pe)for(let de=0,Ae=te.length;de<Ae;de++){const Ce=i.get(te[de]);Ce.__webglTexture===void 0&&(Ce.__webglTexture=n.createTexture(),r.memory.textures++)}if(P.samples>0&&se(P)===!1){V.__webglMultisampledFramebuffer=n.createFramebuffer(),V.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,V.__webglMultisampledFramebuffer);for(let de=0;de<te.length;de++){const Ae=te[de];V.__webglColorRenderbuffer[de]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,V.__webglColorRenderbuffer[de]);const Ce=a.convert(Ae.format,Ae.colorSpace),ae=a.convert(Ae.type),xe=v(Ae.internalFormat,Ce,ae,Ae.colorSpace,P.isXRRenderTarget===!0),Fe=he(P);n.renderbufferStorageMultisample(n.RENDERBUFFER,Fe,xe,P.width,P.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+de,n.RENDERBUFFER,V.__webglColorRenderbuffer[de])}n.bindRenderbuffer(n.RENDERBUFFER,null),P.depthBuffer&&(V.__webglDepthRenderbuffer=n.createRenderbuffer(),De(V.__webglDepthRenderbuffer,P,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(q){t.bindTexture(n.TEXTURE_CUBE_MAP,X.__webglTexture),Oe(n.TEXTURE_CUBE_MAP,T);for(let de=0;de<6;de++)if(T.mipmaps&&T.mipmaps.length>0)for(let Ae=0;Ae<T.mipmaps.length;Ae++)Se(V.__webglFramebuffer[de][Ae],P,T,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+de,Ae);else Se(V.__webglFramebuffer[de],P,T,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+de,0);f(T)&&p(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Pe){for(let de=0,Ae=te.length;de<Ae;de++){const Ce=te[de],ae=i.get(Ce);let xe=n.TEXTURE_2D;(P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(xe=P.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(xe,ae.__webglTexture),Oe(xe,Ce),Se(V.__webglFramebuffer,P,Ce,n.COLOR_ATTACHMENT0+de,xe,0),f(Ce)&&p(xe)}t.unbindTexture()}else{let de=n.TEXTURE_2D;if((P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(de=P.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(de,X.__webglTexture),Oe(de,T),T.mipmaps&&T.mipmaps.length>0)for(let Ae=0;Ae<T.mipmaps.length;Ae++)Se(V.__webglFramebuffer[Ae],P,T,n.COLOR_ATTACHMENT0,de,Ae);else Se(V.__webglFramebuffer,P,T,n.COLOR_ATTACHMENT0,de,0);f(T)&&p(de),t.unbindTexture()}P.depthBuffer&&Ye(P)}function ne(P){const T=P.textures;for(let V=0,X=T.length;V<X;V++){const te=T[V];if(f(te)){const q=M(P),Pe=i.get(te).__webglTexture;t.bindTexture(q,Pe),p(q),t.unbindTexture()}}}const Q=[],J=[];function Z(P){if(P.samples>0){if(se(P)===!1){const T=P.textures,V=P.width,X=P.height;let te=n.COLOR_BUFFER_BIT;const q=P.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Pe=i.get(P),de=T.length>1;if(de)for(let Ce=0;Ce<T.length;Ce++)t.bindFramebuffer(n.FRAMEBUFFER,Pe.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ce,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,Pe.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ce,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,Pe.__webglMultisampledFramebuffer);const Ae=P.texture.mipmaps;Ae&&Ae.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Pe.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Pe.__webglFramebuffer);for(let Ce=0;Ce<T.length;Ce++){if(P.resolveDepthBuffer&&(P.depthBuffer&&(te|=n.DEPTH_BUFFER_BIT),P.stencilBuffer&&P.resolveStencilBuffer&&(te|=n.STENCIL_BUFFER_BIT)),de){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,Pe.__webglColorRenderbuffer[Ce]);const ae=i.get(T[Ce]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,ae,0)}n.blitFramebuffer(0,0,V,X,0,0,V,X,te,n.NEAREST),l===!0&&(Q.length=0,J.length=0,Q.push(n.COLOR_ATTACHMENT0+Ce),P.depthBuffer&&P.resolveDepthBuffer===!1&&(Q.push(q),J.push(q),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,J)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,Q))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),de)for(let Ce=0;Ce<T.length;Ce++){t.bindFramebuffer(n.FRAMEBUFFER,Pe.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ce,n.RENDERBUFFER,Pe.__webglColorRenderbuffer[Ce]);const ae=i.get(T[Ce]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,Pe.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Ce,n.TEXTURE_2D,ae,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Pe.__webglMultisampledFramebuffer)}else if(P.depthBuffer&&P.resolveDepthBuffer===!1&&l){const T=P.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[T])}}}function he(P){return Math.min(s.maxSamples,P.samples)}function se(P){const T=i.get(P);return P.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&T.__useRenderToTexture!==!1}function pe(P){const T=r.render.frame;d.get(P)!==T&&(d.set(P,T),P.update())}function He(P,T){const V=P.colorSpace,X=P.format,te=P.type;return P.isCompressedTexture===!0||P.isVideoTexture===!0||V!==Zi&&V!==Jn&&(tt.getTransfer(V)===ot?(X!==mn||te!==An)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",V)),T}function ke(P){return typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement?(c.width=P.naturalWidth||P.width,c.height=P.naturalHeight||P.height):typeof VideoFrame<"u"&&P instanceof VideoFrame?(c.width=P.displayWidth,c.height=P.displayHeight):(c.width=P.width,c.height=P.height),c}this.allocateTextureUnit=L,this.resetTextureUnits=I,this.setTexture2D=N,this.setTexture2DArray=F,this.setTexture3D=B,this.setTextureCube=$,this.rebindTextures=mt,this.setupRenderTarget=U,this.updateRenderTargetMipmap=ne,this.updateMultisampleRenderTarget=Z,this.setupDepthRenderbuffer=Ye,this.setupFrameBufferTexture=Se,this.useMultisampledRTT=se}function j_(n,e){function t(i,s=Jn){let a;const r=tt.getTransfer(s);if(i===An)return n.UNSIGNED_BYTE;if(i===Po)return n.UNSIGNED_SHORT_4_4_4_4;if(i===Lo)return n.UNSIGNED_SHORT_5_5_5_1;if(i===Dc)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===Ic)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===Pc)return n.BYTE;if(i===Lc)return n.SHORT;if(i===ws)return n.UNSIGNED_SHORT;if(i===Ro)return n.INT;if(i===yi)return n.UNSIGNED_INT;if(i===zn)return n.FLOAT;if(i===Is)return n.HALF_FLOAT;if(i===Uc)return n.ALPHA;if(i===Nc)return n.RGB;if(i===mn)return n.RGBA;if(i===As)return n.DEPTH_COMPONENT;if(i===Cs)return n.DEPTH_STENCIL;if(i===Fc)return n.RED;if(i===Do)return n.RED_INTEGER;if(i===Oc)return n.RG;if(i===Io)return n.RG_INTEGER;if(i===Uo)return n.RGBA_INTEGER;if(i===ya||i===ba||i===Ma||i===Sa)if(r===ot)if(a=e.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(i===ya)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===ba)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Ma)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Sa)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=e.get("WEBGL_compressed_texture_s3tc"),a!==null){if(i===ya)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===ba)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Ma)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Sa)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===$r||i===Wr||i===jr||i===Xr)if(a=e.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(i===$r)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Wr)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===jr)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Xr)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===qr||i===Yr||i===Zr)if(a=e.get("WEBGL_compressed_texture_etc"),a!==null){if(i===qr||i===Yr)return r===ot?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(i===Zr)return r===ot?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===Jr||i===Kr||i===Qr||i===eo||i===to||i===no||i===io||i===so||i===ao||i===ro||i===oo||i===lo||i===co||i===uo)if(a=e.get("WEBGL_compressed_texture_astc"),a!==null){if(i===Jr)return r===ot?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Kr)return r===ot?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Qr)return r===ot?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===eo)return r===ot?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===to)return r===ot?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===no)return r===ot?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===io)return r===ot?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===so)return r===ot?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===ao)return r===ot?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===ro)return r===ot?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===oo)return r===ot?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===lo)return r===ot?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===co)return r===ot?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===uo)return r===ot?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===ho||i===po||i===fo)if(a=e.get("EXT_texture_compression_bptc"),a!==null){if(i===ho)return r===ot?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===po)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===fo)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===mo||i===go||i===_o||i===vo)if(a=e.get("EXT_texture_compression_rgtc"),a!==null){if(i===mo)return a.COMPRESSED_RED_RGTC1_EXT;if(i===go)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===_o)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===vo)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Ts?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}const X_=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,q_=`
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

}`;class Y_{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const i=new Yc(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new ti({vertexShader:X_,fragmentShader:q_,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new be(new Ns(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class Z_ extends Si{constructor(e,t){super();const i=this;let s=null,a=1,r=null,o="local-floor",l=1,c=null,d=null,u=null,h=null,m=null,_=null;const x=typeof XRWebGLBinding<"u",f=new Y_,p={},M=t.getContextAttributes();let v=null,g=null;const w=[],A=[],y=new oe;let E=null;const S=new cn;S.viewport=new Tt;const b=new cn;b.viewport=new Tt;const R=[S,b],I=new fp;let L=null,z=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let ie=w[Y];return ie===void 0&&(ie=new dr,w[Y]=ie),ie.getTargetRaySpace()},this.getControllerGrip=function(Y){let ie=w[Y];return ie===void 0&&(ie=new dr,w[Y]=ie),ie.getGripSpace()},this.getHand=function(Y){let ie=w[Y];return ie===void 0&&(ie=new dr,w[Y]=ie),ie.getHandSpace()};function N(Y){const ie=A.indexOf(Y.inputSource);if(ie===-1)return;const Se=w[ie];Se!==void 0&&(Se.update(Y.inputSource,Y.frame,c||r),Se.dispatchEvent({type:Y.type,data:Y.inputSource}))}function F(){s.removeEventListener("select",N),s.removeEventListener("selectstart",N),s.removeEventListener("selectend",N),s.removeEventListener("squeeze",N),s.removeEventListener("squeezestart",N),s.removeEventListener("squeezeend",N),s.removeEventListener("end",F),s.removeEventListener("inputsourceschange",B);for(let Y=0;Y<w.length;Y++){const ie=A[Y];ie!==null&&(A[Y]=null,w[Y].disconnect(ie))}L=null,z=null,f.reset();for(const Y in p)delete p[Y];e.setRenderTarget(v),m=null,h=null,u=null,s=null,g=null,Ke.stop(),i.isPresenting=!1,e.setPixelRatio(E),e.setSize(y.width,y.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){a=Y,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){o=Y,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||r},this.setReferenceSpace=function(Y){c=Y},this.getBaseLayer=function(){return h!==null?h:m},this.getBinding=function(){return u===null&&x&&(u=new XRWebGLBinding(s,t)),u},this.getFrame=function(){return _},this.getSession=function(){return s},this.setSession=async function(Y){if(s=Y,s!==null){if(v=e.getRenderTarget(),s.addEventListener("select",N),s.addEventListener("selectstart",N),s.addEventListener("selectend",N),s.addEventListener("squeeze",N),s.addEventListener("squeezestart",N),s.addEventListener("squeezeend",N),s.addEventListener("end",F),s.addEventListener("inputsourceschange",B),M.xrCompatible!==!0&&await t.makeXRCompatible(),E=e.getPixelRatio(),e.getSize(y),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let Se=null,De=null,Te=null;M.depth&&(Te=M.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Se=M.stencil?Cs:As,De=M.stencil?Ts:yi);const Ye={colorFormat:t.RGBA8,depthFormat:Te,scaleFactor:a};u=this.getBinding(),h=u.createProjectionLayer(Ye),s.updateRenderState({layers:[h]}),e.setPixelRatio(1),e.setSize(h.textureWidth,h.textureHeight,!1),g=new bi(h.textureWidth,h.textureHeight,{format:mn,type:An,depthTexture:new qc(h.textureWidth,h.textureHeight,De,void 0,void 0,void 0,void 0,void 0,void 0,Se),stencilBuffer:M.stencil,colorSpace:e.outputColorSpace,samples:M.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1})}else{const Se={antialias:M.antialias,alpha:!0,depth:M.depth,stencil:M.stencil,framebufferScaleFactor:a};m=new XRWebGLLayer(s,t,Se),s.updateRenderState({baseLayer:m}),e.setPixelRatio(1),e.setSize(m.framebufferWidth,m.framebufferHeight,!1),g=new bi(m.framebufferWidth,m.framebufferHeight,{format:mn,type:An,colorSpace:e.outputColorSpace,stencilBuffer:M.stencil,resolveDepthBuffer:m.ignoreDepthValues===!1,resolveStencilBuffer:m.ignoreDepthValues===!1})}g.isXRRenderTarget=!0,this.setFoveation(l),c=null,r=await s.requestReferenceSpace(o),Ke.setContext(s),Ke.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return f.getDepthTexture()};function B(Y){for(let ie=0;ie<Y.removed.length;ie++){const Se=Y.removed[ie],De=A.indexOf(Se);De>=0&&(A[De]=null,w[De].disconnect(Se))}for(let ie=0;ie<Y.added.length;ie++){const Se=Y.added[ie];let De=A.indexOf(Se);if(De===-1){for(let Ye=0;Ye<w.length;Ye++)if(Ye>=A.length){A.push(Se),De=Ye;break}else if(A[Ye]===null){A[Ye]=Se,De=Ye;break}if(De===-1)break}const Te=w[De];Te&&Te.connect(Se)}}const $=new D,K=new D;function ue(Y,ie,Se){$.setFromMatrixPosition(ie.matrixWorld),K.setFromMatrixPosition(Se.matrixWorld);const De=$.distanceTo(K),Te=ie.projectionMatrix.elements,Ye=Se.projectionMatrix.elements,mt=Te[14]/(Te[10]-1),U=Te[14]/(Te[10]+1),ne=(Te[9]+1)/Te[5],Q=(Te[9]-1)/Te[5],J=(Te[8]-1)/Te[0],Z=(Ye[8]+1)/Ye[0],he=mt*J,se=mt*Z,pe=De/(-J+Z),He=pe*-J;if(ie.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(He),Y.translateZ(pe),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),Te[10]===-1)Y.projectionMatrix.copy(ie.projectionMatrix),Y.projectionMatrixInverse.copy(ie.projectionMatrixInverse);else{const ke=mt+pe,P=U+pe,T=he-He,V=se+(De-He),X=ne*U/P*ke,te=Q*U/P*ke;Y.projectionMatrix.makePerspective(T,V,X,te,ke,P),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function ge(Y,ie){ie===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(ie.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(s===null)return;let ie=Y.near,Se=Y.far;f.texture!==null&&(f.depthNear>0&&(ie=f.depthNear),f.depthFar>0&&(Se=f.depthFar)),I.near=b.near=S.near=ie,I.far=b.far=S.far=Se,(L!==I.near||z!==I.far)&&(s.updateRenderState({depthNear:I.near,depthFar:I.far}),L=I.near,z=I.far),I.layers.mask=Y.layers.mask|6,S.layers.mask=I.layers.mask&3,b.layers.mask=I.layers.mask&5;const De=Y.parent,Te=I.cameras;ge(I,De);for(let Ye=0;Ye<Te.length;Ye++)ge(Te[Ye],De);Te.length===2?ue(I,S,b):I.projectionMatrix.copy(S.projectionMatrix),Oe(Y,I,De)};function Oe(Y,ie,Se){Se===null?Y.matrix.copy(ie.matrixWorld):(Y.matrix.copy(Se.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(ie.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(ie.projectionMatrix),Y.projectionMatrixInverse.copy(ie.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=xo*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return I},this.getFoveation=function(){if(!(h===null&&m===null))return l},this.setFoveation=function(Y){l=Y,h!==null&&(h.fixedFoveation=Y),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=Y)},this.hasDepthSensing=function(){return f.texture!==null},this.getDepthSensingMesh=function(){return f.getMesh(I)},this.getCameraTexture=function(Y){return p[Y]};let qe=null;function Qe(Y,ie){if(d=ie.getViewerPose(c||r),_=ie,d!==null){const Se=d.views;m!==null&&(e.setRenderTargetFramebuffer(g,m.framebuffer),e.setRenderTarget(g));let De=!1;Se.length!==I.cameras.length&&(I.cameras.length=0,De=!0);for(let U=0;U<Se.length;U++){const ne=Se[U];let Q=null;if(m!==null)Q=m.getViewport(ne);else{const Z=u.getViewSubImage(h,ne);Q=Z.viewport,U===0&&(e.setRenderTargetTextures(g,Z.colorTexture,Z.depthStencilTexture),e.setRenderTarget(g))}let J=R[U];J===void 0&&(J=new cn,J.layers.enable(U),J.viewport=new Tt,R[U]=J),J.matrix.fromArray(ne.transform.matrix),J.matrix.decompose(J.position,J.quaternion,J.scale),J.projectionMatrix.fromArray(ne.projectionMatrix),J.projectionMatrixInverse.copy(J.projectionMatrix).invert(),J.viewport.set(Q.x,Q.y,Q.width,Q.height),U===0&&(I.matrix.copy(J.matrix),I.matrix.decompose(I.position,I.quaternion,I.scale)),De===!0&&I.cameras.push(J)}const Te=s.enabledFeatures;if(Te&&Te.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&x){u=i.getBinding();const U=u.getDepthInformation(Se[0]);U&&U.isValid&&U.texture&&f.init(U,s.renderState)}if(Te&&Te.includes("camera-access")&&x){e.state.unbindTexture(),u=i.getBinding();for(let U=0;U<Se.length;U++){const ne=Se[U].camera;if(ne){let Q=p[ne];Q||(Q=new Yc,p[ne]=Q);const J=u.getCameraImage(ne);Q.sourceTexture=J}}}}for(let Se=0;Se<w.length;Se++){const De=A[Se],Te=w[Se];De!==null&&Te!==void 0&&Te.update(De,ie,c||r)}qe&&qe(Y,ie),ie.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:ie}),_=null}const Ke=new ld;Ke.setAnimationLoop(Qe),this.setAnimationLoop=function(Y){qe=Y},this.dispose=function(){}}}const di=new _n,J_=new dt;function K_(n,e){function t(f,p){f.matrixAutoUpdate===!0&&f.updateMatrix(),p.value.copy(f.matrix)}function i(f,p){p.color.getRGB(f.fogColor.value,Wc(n)),p.isFog?(f.fogNear.value=p.near,f.fogFar.value=p.far):p.isFogExp2&&(f.fogDensity.value=p.density)}function s(f,p,M,v,g){p.isMeshBasicMaterial||p.isMeshLambertMaterial?a(f,p):p.isMeshToonMaterial?(a(f,p),u(f,p)):p.isMeshPhongMaterial?(a(f,p),d(f,p)):p.isMeshStandardMaterial?(a(f,p),h(f,p),p.isMeshPhysicalMaterial&&m(f,p,g)):p.isMeshMatcapMaterial?(a(f,p),_(f,p)):p.isMeshDepthMaterial?a(f,p):p.isMeshDistanceMaterial?(a(f,p),x(f,p)):p.isMeshNormalMaterial?a(f,p):p.isLineBasicMaterial?(r(f,p),p.isLineDashedMaterial&&o(f,p)):p.isPointsMaterial?l(f,p,M,v):p.isSpriteMaterial?c(f,p):p.isShadowMaterial?(f.color.value.copy(p.color),f.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function a(f,p){f.opacity.value=p.opacity,p.color&&f.diffuse.value.copy(p.color),p.emissive&&f.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(f.map.value=p.map,t(p.map,f.mapTransform)),p.alphaMap&&(f.alphaMap.value=p.alphaMap,t(p.alphaMap,f.alphaMapTransform)),p.bumpMap&&(f.bumpMap.value=p.bumpMap,t(p.bumpMap,f.bumpMapTransform),f.bumpScale.value=p.bumpScale,p.side===Kt&&(f.bumpScale.value*=-1)),p.normalMap&&(f.normalMap.value=p.normalMap,t(p.normalMap,f.normalMapTransform),f.normalScale.value.copy(p.normalScale),p.side===Kt&&f.normalScale.value.negate()),p.displacementMap&&(f.displacementMap.value=p.displacementMap,t(p.displacementMap,f.displacementMapTransform),f.displacementScale.value=p.displacementScale,f.displacementBias.value=p.displacementBias),p.emissiveMap&&(f.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,f.emissiveMapTransform)),p.specularMap&&(f.specularMap.value=p.specularMap,t(p.specularMap,f.specularMapTransform)),p.alphaTest>0&&(f.alphaTest.value=p.alphaTest);const M=e.get(p),v=M.envMap,g=M.envMapRotation;v&&(f.envMap.value=v,di.copy(g),di.x*=-1,di.y*=-1,di.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(di.y*=-1,di.z*=-1),f.envMapRotation.value.setFromMatrix4(J_.makeRotationFromEuler(di)),f.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,f.reflectivity.value=p.reflectivity,f.ior.value=p.ior,f.refractionRatio.value=p.refractionRatio),p.lightMap&&(f.lightMap.value=p.lightMap,f.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,f.lightMapTransform)),p.aoMap&&(f.aoMap.value=p.aoMap,f.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,f.aoMapTransform))}function r(f,p){f.diffuse.value.copy(p.color),f.opacity.value=p.opacity,p.map&&(f.map.value=p.map,t(p.map,f.mapTransform))}function o(f,p){f.dashSize.value=p.dashSize,f.totalSize.value=p.dashSize+p.gapSize,f.scale.value=p.scale}function l(f,p,M,v){f.diffuse.value.copy(p.color),f.opacity.value=p.opacity,f.size.value=p.size*M,f.scale.value=v*.5,p.map&&(f.map.value=p.map,t(p.map,f.uvTransform)),p.alphaMap&&(f.alphaMap.value=p.alphaMap,t(p.alphaMap,f.alphaMapTransform)),p.alphaTest>0&&(f.alphaTest.value=p.alphaTest)}function c(f,p){f.diffuse.value.copy(p.color),f.opacity.value=p.opacity,f.rotation.value=p.rotation,p.map&&(f.map.value=p.map,t(p.map,f.mapTransform)),p.alphaMap&&(f.alphaMap.value=p.alphaMap,t(p.alphaMap,f.alphaMapTransform)),p.alphaTest>0&&(f.alphaTest.value=p.alphaTest)}function d(f,p){f.specular.value.copy(p.specular),f.shininess.value=Math.max(p.shininess,1e-4)}function u(f,p){p.gradientMap&&(f.gradientMap.value=p.gradientMap)}function h(f,p){f.metalness.value=p.metalness,p.metalnessMap&&(f.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,f.metalnessMapTransform)),f.roughness.value=p.roughness,p.roughnessMap&&(f.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,f.roughnessMapTransform)),p.envMap&&(f.envMapIntensity.value=p.envMapIntensity)}function m(f,p,M){f.ior.value=p.ior,p.sheen>0&&(f.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),f.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(f.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,f.sheenColorMapTransform)),p.sheenRoughnessMap&&(f.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,f.sheenRoughnessMapTransform))),p.clearcoat>0&&(f.clearcoat.value=p.clearcoat,f.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(f.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,f.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(f.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,f.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(f.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,f.clearcoatNormalMapTransform),f.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Kt&&f.clearcoatNormalScale.value.negate())),p.dispersion>0&&(f.dispersion.value=p.dispersion),p.iridescence>0&&(f.iridescence.value=p.iridescence,f.iridescenceIOR.value=p.iridescenceIOR,f.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],f.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(f.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,f.iridescenceMapTransform)),p.iridescenceThicknessMap&&(f.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,f.iridescenceThicknessMapTransform))),p.transmission>0&&(f.transmission.value=p.transmission,f.transmissionSamplerMap.value=M.texture,f.transmissionSamplerSize.value.set(M.width,M.height),p.transmissionMap&&(f.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,f.transmissionMapTransform)),f.thickness.value=p.thickness,p.thicknessMap&&(f.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,f.thicknessMapTransform)),f.attenuationDistance.value=p.attenuationDistance,f.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(f.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(f.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,f.anisotropyMapTransform))),f.specularIntensity.value=p.specularIntensity,f.specularColor.value.copy(p.specularColor),p.specularColorMap&&(f.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,f.specularColorMapTransform)),p.specularIntensityMap&&(f.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,f.specularIntensityMapTransform))}function _(f,p){p.matcap&&(f.matcap.value=p.matcap)}function x(f,p){const M=e.get(p).light;f.referencePosition.value.setFromMatrixPosition(M.matrixWorld),f.nearDistance.value=M.shadow.camera.near,f.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function Q_(n,e,t,i){let s={},a={},r=[];const o=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(M,v){const g=v.program;i.uniformBlockBinding(M,g)}function c(M,v){let g=s[M.id];g===void 0&&(_(M),g=d(M),s[M.id]=g,M.addEventListener("dispose",f));const w=v.program;i.updateUBOMapping(M,w);const A=e.render.frame;a[M.id]!==A&&(h(M),a[M.id]=A)}function d(M){const v=u();M.__bindingPointIndex=v;const g=n.createBuffer(),w=M.__size,A=M.usage;return n.bindBuffer(n.UNIFORM_BUFFER,g),n.bufferData(n.UNIFORM_BUFFER,w,A),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,v,g),g}function u(){for(let M=0;M<o;M++)if(r.indexOf(M)===-1)return r.push(M),M;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(M){const v=s[M.id],g=M.uniforms,w=M.__cache;n.bindBuffer(n.UNIFORM_BUFFER,v);for(let A=0,y=g.length;A<y;A++){const E=Array.isArray(g[A])?g[A]:[g[A]];for(let S=0,b=E.length;S<b;S++){const R=E[S];if(m(R,A,S,w)===!0){const I=R.__offset,L=Array.isArray(R.value)?R.value:[R.value];let z=0;for(let N=0;N<L.length;N++){const F=L[N],B=x(F);typeof F=="number"||typeof F=="boolean"?(R.__data[0]=F,n.bufferSubData(n.UNIFORM_BUFFER,I+z,R.__data)):F.isMatrix3?(R.__data[0]=F.elements[0],R.__data[1]=F.elements[1],R.__data[2]=F.elements[2],R.__data[3]=0,R.__data[4]=F.elements[3],R.__data[5]=F.elements[4],R.__data[6]=F.elements[5],R.__data[7]=0,R.__data[8]=F.elements[6],R.__data[9]=F.elements[7],R.__data[10]=F.elements[8],R.__data[11]=0):(F.toArray(R.__data,z),z+=B.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,I,R.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function m(M,v,g,w){const A=M.value,y=v+"_"+g;if(w[y]===void 0)return typeof A=="number"||typeof A=="boolean"?w[y]=A:w[y]=A.clone(),!0;{const E=w[y];if(typeof A=="number"||typeof A=="boolean"){if(E!==A)return w[y]=A,!0}else if(E.equals(A)===!1)return E.copy(A),!0}return!1}function _(M){const v=M.uniforms;let g=0;const w=16;for(let y=0,E=v.length;y<E;y++){const S=Array.isArray(v[y])?v[y]:[v[y]];for(let b=0,R=S.length;b<R;b++){const I=S[b],L=Array.isArray(I.value)?I.value:[I.value];for(let z=0,N=L.length;z<N;z++){const F=L[z],B=x(F),$=g%w,K=$%B.boundary,ue=$+K;g+=K,ue!==0&&w-ue<B.storage&&(g+=w-ue),I.__data=new Float32Array(B.storage/Float32Array.BYTES_PER_ELEMENT),I.__offset=g,g+=B.storage}}}const A=g%w;return A>0&&(g+=w-A),M.__size=g,M.__cache={},this}function x(M){const v={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(v.boundary=4,v.storage=4):M.isVector2?(v.boundary=8,v.storage=8):M.isVector3||M.isColor?(v.boundary=16,v.storage=12):M.isVector4?(v.boundary=16,v.storage=16):M.isMatrix3?(v.boundary=48,v.storage=48):M.isMatrix4?(v.boundary=64,v.storage=64):M.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",M),v}function f(M){const v=M.target;v.removeEventListener("dispose",f);const g=r.indexOf(v.__bindingPointIndex);r.splice(g,1),n.deleteBuffer(s[v.id]),delete s[v.id],delete a[v.id]}function p(){for(const M in s)n.deleteBuffer(s[M]);r=[],s={},a={}}return{bind:l,update:c,dispose:p}}class ev{constructor(e={}){const{canvas:t=Ku(),context:i=null,depth:s=!0,stencil:a=!1,alpha:r=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:h=!1}=e;this.isWebGLRenderer=!0;let m;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=i.getContextAttributes().alpha}else m=r;const _=new Uint32Array(4),x=new Int32Array(4);let f=null,p=null;const M=[],v=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Qn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const g=this;let w=!1;this._outputColorSpace=ln;let A=0,y=0,E=null,S=-1,b=null;const R=new Tt,I=new Tt;let L=null;const z=new Xe(0);let N=0,F=t.width,B=t.height,$=1,K=null,ue=null;const ge=new Tt(0,0,F,B),Oe=new Tt(0,0,F,B);let qe=!1;const Qe=new Oo;let Ke=!1,Y=!1;const ie=new dt,Se=new D,De=new Tt,Te={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Ye=!1;function mt(){return E===null?$:1}let U=i;function ne(C,H){return t.getContext(C,H)}try{const C={alpha:!0,depth:s,stencil:a,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:d,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Co}`),t.addEventListener("webglcontextlost",fe,!1),t.addEventListener("webglcontextrestored",Ee,!1),t.addEventListener("webglcontextcreationerror",re,!1),U===null){const H="webgl2";if(U=ne(H,C),U===null)throw ne(H)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(C){throw console.error("THREE.WebGLRenderer: "+C.message),C}let Q,J,Z,he,se,pe,He,ke,P,T,V,X,te,q,Pe,de,Ae,Ce,ae,xe,Fe,Le,_e,Ve;function k(){Q=new dg(U),Q.init(),Le=new j_(U,Q),J=new ig(U,Q,e,Le),Z=new $_(U,Q),J.reversedDepthBuffer&&h&&Z.buffers.depth.setReversed(!0),he=new pg(U),se=new L_,pe=new W_(U,Q,Z,se,J,Le,he),He=new ag(g),ke=new cg(g),P=new vp(U),_e=new tg(U,P),T=new ug(U,P,he,_e),V=new mg(U,T,P,he),ae=new fg(U,J,pe),de=new sg(se),X=new P_(g,He,ke,Q,J,_e,de),te=new K_(g,se),q=new I_,Pe=new k_(Q),Ce=new eg(g,He,ke,Z,V,m,l),Ae=new G_(g,V,J),Ve=new Q_(U,he,J,Z),xe=new ng(U,Q,he),Fe=new hg(U,Q,he),he.programs=X.programs,g.capabilities=J,g.extensions=Q,g.properties=se,g.renderLists=q,g.shadowMap=Ae,g.state=Z,g.info=he}k();const ce=new Z_(g,U);this.xr=ce,this.getContext=function(){return U},this.getContextAttributes=function(){return U.getContextAttributes()},this.forceContextLoss=function(){const C=Q.get("WEBGL_lose_context");C&&C.loseContext()},this.forceContextRestore=function(){const C=Q.get("WEBGL_lose_context");C&&C.restoreContext()},this.getPixelRatio=function(){return $},this.setPixelRatio=function(C){C!==void 0&&($=C,this.setSize(F,B,!1))},this.getSize=function(C){return C.set(F,B)},this.setSize=function(C,H,W=!0){if(ce.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}F=C,B=H,t.width=Math.floor(C*$),t.height=Math.floor(H*$),W===!0&&(t.style.width=C+"px",t.style.height=H+"px"),this.setViewport(0,0,C,H)},this.getDrawingBufferSize=function(C){return C.set(F*$,B*$).floor()},this.setDrawingBufferSize=function(C,H,W){F=C,B=H,$=W,t.width=Math.floor(C*W),t.height=Math.floor(H*W),this.setViewport(0,0,C,H)},this.getCurrentViewport=function(C){return C.copy(R)},this.getViewport=function(C){return C.copy(ge)},this.setViewport=function(C,H,W,j){C.isVector4?ge.set(C.x,C.y,C.z,C.w):ge.set(C,H,W,j),Z.viewport(R.copy(ge).multiplyScalar($).round())},this.getScissor=function(C){return C.copy(Oe)},this.setScissor=function(C,H,W,j){C.isVector4?Oe.set(C.x,C.y,C.z,C.w):Oe.set(C,H,W,j),Z.scissor(I.copy(Oe).multiplyScalar($).round())},this.getScissorTest=function(){return qe},this.setScissorTest=function(C){Z.setScissorTest(qe=C)},this.setOpaqueSort=function(C){K=C},this.setTransparentSort=function(C){ue=C},this.getClearColor=function(C){return C.copy(Ce.getClearColor())},this.setClearColor=function(){Ce.setClearColor(...arguments)},this.getClearAlpha=function(){return Ce.getClearAlpha()},this.setClearAlpha=function(){Ce.setClearAlpha(...arguments)},this.clear=function(C=!0,H=!0,W=!0){let j=0;if(C){let G=!1;if(E!==null){const le=E.texture.format;G=le===Uo||le===Io||le===Do}if(G){const le=E.texture.type,ve=le===An||le===yi||le===ws||le===Ts||le===Po||le===Lo,we=Ce.getClearColor(),Me=Ce.getClearAlpha(),Ne=we.r,ze=we.g,Ie=we.b;ve?(_[0]=Ne,_[1]=ze,_[2]=Ie,_[3]=Me,U.clearBufferuiv(U.COLOR,0,_)):(x[0]=Ne,x[1]=ze,x[2]=Ie,x[3]=Me,U.clearBufferiv(U.COLOR,0,x))}else j|=U.COLOR_BUFFER_BIT}H&&(j|=U.DEPTH_BUFFER_BIT),W&&(j|=U.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),U.clear(j)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",fe,!1),t.removeEventListener("webglcontextrestored",Ee,!1),t.removeEventListener("webglcontextcreationerror",re,!1),Ce.dispose(),q.dispose(),Pe.dispose(),se.dispose(),He.dispose(),ke.dispose(),V.dispose(),_e.dispose(),Ve.dispose(),X.dispose(),ce.dispose(),ce.removeEventListener("sessionstart",xn),ce.removeEventListener("sessionend",Wo),ii.stop()};function fe(C){C.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),w=!0}function Ee(){console.log("THREE.WebGLRenderer: Context Restored."),w=!1;const C=he.autoReset,H=Ae.enabled,W=Ae.autoUpdate,j=Ae.needsUpdate,G=Ae.type;k(),he.autoReset=C,Ae.enabled=H,Ae.autoUpdate=W,Ae.needsUpdate=j,Ae.type=G}function re(C){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",C.statusMessage)}function ee(C){const H=C.target;H.removeEventListener("dispose",ee),Re(H)}function Re(C){Ge(C),se.remove(C)}function Ge(C){const H=se.get(C).programs;H!==void 0&&(H.forEach(function(W){X.releaseProgram(W)}),C.isShaderMaterial&&X.releaseShaderCache(C))}this.renderBufferDirect=function(C,H,W,j,G,le){H===null&&(H=Te);const ve=G.isMesh&&G.matrixWorld.determinant()<0,we=Sd(C,H,W,j,G);Z.setMaterial(j,ve);let Me=W.index,Ne=1;if(j.wireframe===!0){if(Me=T.getWireframeAttribute(W),Me===void 0)return;Ne=2}const ze=W.drawRange,Ie=W.attributes.position;let Ze=ze.start*Ne,rt=(ze.start+ze.count)*Ne;le!==null&&(Ze=Math.max(Ze,le.start*Ne),rt=Math.min(rt,(le.start+le.count)*Ne)),Me!==null?(Ze=Math.max(Ze,0),rt=Math.min(rt,Me.count)):Ie!=null&&(Ze=Math.max(Ze,0),rt=Math.min(rt,Ie.count));const wt=rt-Ze;if(wt<0||wt===1/0)return;_e.setup(G,j,we,W,Me);let vt,pt=xe;if(Me!==null&&(vt=P.get(Me),pt=Fe,pt.setIndex(vt)),G.isMesh)j.wireframe===!0?(Z.setLineWidth(j.wireframeLinewidth*mt()),pt.setMode(U.LINES)):pt.setMode(U.TRIANGLES);else if(G.isLine){let Ue=j.linewidth;Ue===void 0&&(Ue=1),Z.setLineWidth(Ue*mt()),G.isLineSegments?pt.setMode(U.LINES):G.isLineLoop?pt.setMode(U.LINE_LOOP):pt.setMode(U.LINE_STRIP)}else G.isPoints?pt.setMode(U.POINTS):G.isSprite&&pt.setMode(U.TRIANGLES);if(G.isBatchedMesh)if(G._multiDrawInstances!==null)Rs("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),pt.renderMultiDrawInstances(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount,G._multiDrawInstances);else if(Q.get("WEBGL_multi_draw"))pt.renderMultiDraw(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount);else{const Ue=G._multiDrawStarts,bt=G._multiDrawCounts,et=G._multiDrawCount,en=Me?P.get(Me).bytesPerElement:1,Ei=se.get(j).currentProgram.getUniforms();for(let tn=0;tn<et;tn++)Ei.setValue(U,"_gl_DrawID",tn),pt.render(Ue[tn]/en,bt[tn])}else if(G.isInstancedMesh)pt.renderInstances(Ze,wt,G.count);else if(W.isInstancedBufferGeometry){const Ue=W._maxInstanceCount!==void 0?W._maxInstanceCount:1/0,bt=Math.min(W.instanceCount,Ue);pt.renderInstances(Ze,wt,bt)}else pt.render(Ze,wt)};function gt(C,H,W){C.transparent===!0&&C.side===fn&&C.forceSinglePass===!1?(C.side=Kt,C.needsUpdate=!0,Bs(C,H,W),C.side=ei,C.needsUpdate=!0,Bs(C,H,W),C.side=fn):Bs(C,H,W)}this.compile=function(C,H,W=null){W===null&&(W=C),p=Pe.get(W),p.init(H),v.push(p),W.traverseVisible(function(G){G.isLight&&G.layers.test(H.layers)&&(p.pushLight(G),G.castShadow&&p.pushShadow(G))}),C!==W&&C.traverseVisible(function(G){G.isLight&&G.layers.test(H.layers)&&(p.pushLight(G),G.castShadow&&p.pushShadow(G))}),p.setupLights();const j=new Set;return C.traverse(function(G){if(!(G.isMesh||G.isPoints||G.isLine||G.isSprite))return;const le=G.material;if(le)if(Array.isArray(le))for(let ve=0;ve<le.length;ve++){const we=le[ve];gt(we,W,G),j.add(we)}else gt(le,W,G),j.add(le)}),p=v.pop(),j},this.compileAsync=function(C,H,W=null){const j=this.compile(C,H,W);return new Promise(G=>{function le(){if(j.forEach(function(ve){se.get(ve).currentProgram.isReady()&&j.delete(ve)}),j.size===0){G(C);return}setTimeout(le,10)}Q.get("KHR_parallel_shader_compile")!==null?le():setTimeout(le,10)})};let nt=null;function Rn(C){nt&&nt(C)}function xn(){ii.stop()}function Wo(){ii.start()}const ii=new ld;ii.setAnimationLoop(Rn),typeof self<"u"&&ii.setContext(self),this.setAnimationLoop=function(C){nt=C,ce.setAnimationLoop(C),C===null?ii.stop():ii.start()},ce.addEventListener("sessionstart",xn),ce.addEventListener("sessionend",Wo),this.render=function(C,H){if(H!==void 0&&H.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(w===!0)return;if(C.matrixWorldAutoUpdate===!0&&C.updateMatrixWorld(),H.parent===null&&H.matrixWorldAutoUpdate===!0&&H.updateMatrixWorld(),ce.enabled===!0&&ce.isPresenting===!0&&(ce.cameraAutoUpdate===!0&&ce.updateCamera(H),H=ce.getCamera()),C.isScene===!0&&C.onBeforeRender(g,C,H,E),p=Pe.get(C,v.length),p.init(H),v.push(p),ie.multiplyMatrices(H.projectionMatrix,H.matrixWorldInverse),Qe.setFromProjectionMatrix(ie,wn,H.reversedDepth),Y=this.localClippingEnabled,Ke=de.init(this.clippingPlanes,Y),f=q.get(C,M.length),f.init(),M.push(f),ce.enabled===!0&&ce.isPresenting===!0){const le=g.xr.getDepthSensingMesh();le!==null&&Ba(le,H,-1/0,g.sortObjects)}Ba(C,H,0,g.sortObjects),f.finish(),g.sortObjects===!0&&f.sort(K,ue),Ye=ce.enabled===!1||ce.isPresenting===!1||ce.hasDepthSensing()===!1,Ye&&Ce.addToRenderList(f,C),this.info.render.frame++,Ke===!0&&de.beginShadows();const W=p.state.shadowsArray;Ae.render(W,C,H),Ke===!0&&de.endShadows(),this.info.autoReset===!0&&this.info.reset();const j=f.opaque,G=f.transmissive;if(p.setupLights(),H.isArrayCamera){const le=H.cameras;if(G.length>0)for(let ve=0,we=le.length;ve<we;ve++){const Me=le[ve];Xo(j,G,C,Me)}Ye&&Ce.render(C);for(let ve=0,we=le.length;ve<we;ve++){const Me=le[ve];jo(f,C,Me,Me.viewport)}}else G.length>0&&Xo(j,G,C,H),Ye&&Ce.render(C),jo(f,C,H);E!==null&&y===0&&(pe.updateMultisampleRenderTarget(E),pe.updateRenderTargetMipmap(E)),C.isScene===!0&&C.onAfterRender(g,C,H),_e.resetDefaultState(),S=-1,b=null,v.pop(),v.length>0?(p=v[v.length-1],Ke===!0&&de.setGlobalState(g.clippingPlanes,p.state.camera)):p=null,M.pop(),M.length>0?f=M[M.length-1]:f=null};function Ba(C,H,W,j){if(C.visible===!1)return;if(C.layers.test(H.layers)){if(C.isGroup)W=C.renderOrder;else if(C.isLOD)C.autoUpdate===!0&&C.update(H);else if(C.isLight)p.pushLight(C),C.castShadow&&p.pushShadow(C);else if(C.isSprite){if(!C.frustumCulled||Qe.intersectsSprite(C)){j&&De.setFromMatrixPosition(C.matrixWorld).applyMatrix4(ie);const ve=V.update(C),we=C.material;we.visible&&f.push(C,ve,we,W,De.z,null)}}else if((C.isMesh||C.isLine||C.isPoints)&&(!C.frustumCulled||Qe.intersectsObject(C))){const ve=V.update(C),we=C.material;if(j&&(C.boundingSphere!==void 0?(C.boundingSphere===null&&C.computeBoundingSphere(),De.copy(C.boundingSphere.center)):(ve.boundingSphere===null&&ve.computeBoundingSphere(),De.copy(ve.boundingSphere.center)),De.applyMatrix4(C.matrixWorld).applyMatrix4(ie)),Array.isArray(we)){const Me=ve.groups;for(let Ne=0,ze=Me.length;Ne<ze;Ne++){const Ie=Me[Ne],Ze=we[Ie.materialIndex];Ze&&Ze.visible&&f.push(C,ve,Ze,W,De.z,Ie)}}else we.visible&&f.push(C,ve,we,W,De.z,null)}}const le=C.children;for(let ve=0,we=le.length;ve<we;ve++)Ba(le[ve],H,W,j)}function jo(C,H,W,j){const G=C.opaque,le=C.transmissive,ve=C.transparent;p.setupLightsView(W),Ke===!0&&de.setGlobalState(g.clippingPlanes,W),j&&Z.viewport(R.copy(j)),G.length>0&&ks(G,H,W),le.length>0&&ks(le,H,W),ve.length>0&&ks(ve,H,W),Z.buffers.depth.setTest(!0),Z.buffers.depth.setMask(!0),Z.buffers.color.setMask(!0),Z.setPolygonOffset(!1)}function Xo(C,H,W,j){if((W.isScene===!0?W.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[j.id]===void 0&&(p.state.transmissionRenderTarget[j.id]=new bi(1,1,{generateMipmaps:!0,type:Q.has("EXT_color_buffer_half_float")||Q.has("EXT_color_buffer_float")?Is:An,minFilter:xi,samples:4,stencilBuffer:a,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:tt.workingColorSpace}));const le=p.state.transmissionRenderTarget[j.id],ve=j.viewport||R;le.setSize(ve.z*g.transmissionResolutionScale,ve.w*g.transmissionResolutionScale);const we=g.getRenderTarget(),Me=g.getActiveCubeFace(),Ne=g.getActiveMipmapLevel();g.setRenderTarget(le),g.getClearColor(z),N=g.getClearAlpha(),N<1&&g.setClearColor(16777215,.5),g.clear(),Ye&&Ce.render(W);const ze=g.toneMapping;g.toneMapping=Qn;const Ie=j.viewport;if(j.viewport!==void 0&&(j.viewport=void 0),p.setupLightsView(j),Ke===!0&&de.setGlobalState(g.clippingPlanes,j),ks(C,W,j),pe.updateMultisampleRenderTarget(le),pe.updateRenderTargetMipmap(le),Q.has("WEBGL_multisampled_render_to_texture")===!1){let Ze=!1;for(let rt=0,wt=H.length;rt<wt;rt++){const vt=H[rt],pt=vt.object,Ue=vt.geometry,bt=vt.material,et=vt.group;if(bt.side===fn&&pt.layers.test(j.layers)){const en=bt.side;bt.side=Kt,bt.needsUpdate=!0,qo(pt,W,j,Ue,bt,et),bt.side=en,bt.needsUpdate=!0,Ze=!0}}Ze===!0&&(pe.updateMultisampleRenderTarget(le),pe.updateRenderTargetMipmap(le))}g.setRenderTarget(we,Me,Ne),g.setClearColor(z,N),Ie!==void 0&&(j.viewport=Ie),g.toneMapping=ze}function ks(C,H,W){const j=H.isScene===!0?H.overrideMaterial:null;for(let G=0,le=C.length;G<le;G++){const ve=C[G],we=ve.object,Me=ve.geometry,Ne=ve.group;let ze=ve.material;ze.allowOverride===!0&&j!==null&&(ze=j),we.layers.test(W.layers)&&qo(we,H,W,Me,ze,Ne)}}function qo(C,H,W,j,G,le){C.onBeforeRender(g,H,W,j,G,le),C.modelViewMatrix.multiplyMatrices(W.matrixWorldInverse,C.matrixWorld),C.normalMatrix.getNormalMatrix(C.modelViewMatrix),G.onBeforeRender(g,H,W,j,C,le),G.transparent===!0&&G.side===fn&&G.forceSinglePass===!1?(G.side=Kt,G.needsUpdate=!0,g.renderBufferDirect(W,H,j,G,C,le),G.side=ei,G.needsUpdate=!0,g.renderBufferDirect(W,H,j,G,C,le),G.side=fn):g.renderBufferDirect(W,H,j,G,C,le),C.onAfterRender(g,H,W,j,G,le)}function Bs(C,H,W){H.isScene!==!0&&(H=Te);const j=se.get(C),G=p.state.lights,le=p.state.shadowsArray,ve=G.state.version,we=X.getParameters(C,G.state,le,H,W),Me=X.getProgramCacheKey(we);let Ne=j.programs;j.environment=C.isMeshStandardMaterial?H.environment:null,j.fog=H.fog,j.envMap=(C.isMeshStandardMaterial?ke:He).get(C.envMap||j.environment),j.envMapRotation=j.environment!==null&&C.envMap===null?H.environmentRotation:C.envMapRotation,Ne===void 0&&(C.addEventListener("dispose",ee),Ne=new Map,j.programs=Ne);let ze=Ne.get(Me);if(ze!==void 0){if(j.currentProgram===ze&&j.lightsStateVersion===ve)return Zo(C,we),ze}else we.uniforms=X.getUniforms(C),C.onBeforeCompile(we,g),ze=X.acquireProgram(we,Me),Ne.set(Me,ze),j.uniforms=we.uniforms;const Ie=j.uniforms;return(!C.isShaderMaterial&&!C.isRawShaderMaterial||C.clipping===!0)&&(Ie.clippingPlanes=de.uniform),Zo(C,we),j.needsLights=wd(C),j.lightsStateVersion=ve,j.needsLights&&(Ie.ambientLightColor.value=G.state.ambient,Ie.lightProbe.value=G.state.probe,Ie.directionalLights.value=G.state.directional,Ie.directionalLightShadows.value=G.state.directionalShadow,Ie.spotLights.value=G.state.spot,Ie.spotLightShadows.value=G.state.spotShadow,Ie.rectAreaLights.value=G.state.rectArea,Ie.ltc_1.value=G.state.rectAreaLTC1,Ie.ltc_2.value=G.state.rectAreaLTC2,Ie.pointLights.value=G.state.point,Ie.pointLightShadows.value=G.state.pointShadow,Ie.hemisphereLights.value=G.state.hemi,Ie.directionalShadowMap.value=G.state.directionalShadowMap,Ie.directionalShadowMatrix.value=G.state.directionalShadowMatrix,Ie.spotShadowMap.value=G.state.spotShadowMap,Ie.spotLightMatrix.value=G.state.spotLightMatrix,Ie.spotLightMap.value=G.state.spotLightMap,Ie.pointShadowMap.value=G.state.pointShadowMap,Ie.pointShadowMatrix.value=G.state.pointShadowMatrix),j.currentProgram=ze,j.uniformsList=null,ze}function Yo(C){if(C.uniformsList===null){const H=C.currentProgram.getUniforms();C.uniformsList=wa.seqWithValue(H.seq,C.uniforms)}return C.uniformsList}function Zo(C,H){const W=se.get(C);W.outputColorSpace=H.outputColorSpace,W.batching=H.batching,W.batchingColor=H.batchingColor,W.instancing=H.instancing,W.instancingColor=H.instancingColor,W.instancingMorph=H.instancingMorph,W.skinning=H.skinning,W.morphTargets=H.morphTargets,W.morphNormals=H.morphNormals,W.morphColors=H.morphColors,W.morphTargetsCount=H.morphTargetsCount,W.numClippingPlanes=H.numClippingPlanes,W.numIntersection=H.numClipIntersection,W.vertexAlphas=H.vertexAlphas,W.vertexTangents=H.vertexTangents,W.toneMapping=H.toneMapping}function Sd(C,H,W,j,G){H.isScene!==!0&&(H=Te),pe.resetTextureUnits();const le=H.fog,ve=j.isMeshStandardMaterial?H.environment:null,we=E===null?g.outputColorSpace:E.isXRRenderTarget===!0?E.texture.colorSpace:Zi,Me=(j.isMeshStandardMaterial?ke:He).get(j.envMap||ve),Ne=j.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,ze=!!W.attributes.tangent&&(!!j.normalMap||j.anisotropy>0),Ie=!!W.morphAttributes.position,Ze=!!W.morphAttributes.normal,rt=!!W.morphAttributes.color;let wt=Qn;j.toneMapped&&(E===null||E.isXRRenderTarget===!0)&&(wt=g.toneMapping);const vt=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,pt=vt!==void 0?vt.length:0,Ue=se.get(j),bt=p.state.lights;if(Ke===!0&&(Y===!0||C!==b)){const $t=C===b&&j.id===S;de.setState(j,C,$t)}let et=!1;j.version===Ue.__version?(Ue.needsLights&&Ue.lightsStateVersion!==bt.state.version||Ue.outputColorSpace!==we||G.isBatchedMesh&&Ue.batching===!1||!G.isBatchedMesh&&Ue.batching===!0||G.isBatchedMesh&&Ue.batchingColor===!0&&G.colorTexture===null||G.isBatchedMesh&&Ue.batchingColor===!1&&G.colorTexture!==null||G.isInstancedMesh&&Ue.instancing===!1||!G.isInstancedMesh&&Ue.instancing===!0||G.isSkinnedMesh&&Ue.skinning===!1||!G.isSkinnedMesh&&Ue.skinning===!0||G.isInstancedMesh&&Ue.instancingColor===!0&&G.instanceColor===null||G.isInstancedMesh&&Ue.instancingColor===!1&&G.instanceColor!==null||G.isInstancedMesh&&Ue.instancingMorph===!0&&G.morphTexture===null||G.isInstancedMesh&&Ue.instancingMorph===!1&&G.morphTexture!==null||Ue.envMap!==Me||j.fog===!0&&Ue.fog!==le||Ue.numClippingPlanes!==void 0&&(Ue.numClippingPlanes!==de.numPlanes||Ue.numIntersection!==de.numIntersection)||Ue.vertexAlphas!==Ne||Ue.vertexTangents!==ze||Ue.morphTargets!==Ie||Ue.morphNormals!==Ze||Ue.morphColors!==rt||Ue.toneMapping!==wt||Ue.morphTargetsCount!==pt)&&(et=!0):(et=!0,Ue.__version=j.version);let en=Ue.currentProgram;et===!0&&(en=Bs(j,H,G));let Ei=!1,tn=!1,is=!1;const Mt=en.getUniforms(),an=Ue.uniforms;if(Z.useProgram(en.program)&&(Ei=!0,tn=!0,is=!0),j.id!==S&&(S=j.id,tn=!0),Ei||b!==C){Z.buffers.depth.getReversed()&&C.reversedDepth!==!0&&(C._reversedDepth=!0,C.updateProjectionMatrix()),Mt.setValue(U,"projectionMatrix",C.projectionMatrix),Mt.setValue(U,"viewMatrix",C.matrixWorldInverse);const qt=Mt.map.cameraPosition;qt!==void 0&&qt.setValue(U,Se.setFromMatrixPosition(C.matrixWorld)),J.logarithmicDepthBuffer&&Mt.setValue(U,"logDepthBufFC",2/(Math.log(C.far+1)/Math.LN2)),(j.isMeshPhongMaterial||j.isMeshToonMaterial||j.isMeshLambertMaterial||j.isMeshBasicMaterial||j.isMeshStandardMaterial||j.isShaderMaterial)&&Mt.setValue(U,"isOrthographic",C.isOrthographicCamera===!0),b!==C&&(b=C,tn=!0,is=!0)}if(G.isSkinnedMesh){Mt.setOptional(U,G,"bindMatrix"),Mt.setOptional(U,G,"bindMatrixInverse");const $t=G.skeleton;$t&&($t.boneTexture===null&&$t.computeBoneTexture(),Mt.setValue(U,"boneTexture",$t.boneTexture,pe))}G.isBatchedMesh&&(Mt.setOptional(U,G,"batchingTexture"),Mt.setValue(U,"batchingTexture",G._matricesTexture,pe),Mt.setOptional(U,G,"batchingIdTexture"),Mt.setValue(U,"batchingIdTexture",G._indirectTexture,pe),Mt.setOptional(U,G,"batchingColorTexture"),G._colorsTexture!==null&&Mt.setValue(U,"batchingColorTexture",G._colorsTexture,pe));const rn=W.morphAttributes;if((rn.position!==void 0||rn.normal!==void 0||rn.color!==void 0)&&ae.update(G,W,en),(tn||Ue.receiveShadow!==G.receiveShadow)&&(Ue.receiveShadow=G.receiveShadow,Mt.setValue(U,"receiveShadow",G.receiveShadow)),j.isMeshGouraudMaterial&&j.envMap!==null&&(an.envMap.value=Me,an.flipEnvMap.value=Me.isCubeTexture&&Me.isRenderTargetTexture===!1?-1:1),j.isMeshStandardMaterial&&j.envMap===null&&H.environment!==null&&(an.envMapIntensity.value=H.environmentIntensity),tn&&(Mt.setValue(U,"toneMappingExposure",g.toneMappingExposure),Ue.needsLights&&Ed(an,is),le&&j.fog===!0&&te.refreshFogUniforms(an,le),te.refreshMaterialUniforms(an,j,$,B,p.state.transmissionRenderTarget[C.id]),wa.upload(U,Yo(Ue),an,pe)),j.isShaderMaterial&&j.uniformsNeedUpdate===!0&&(wa.upload(U,Yo(Ue),an,pe),j.uniformsNeedUpdate=!1),j.isSpriteMaterial&&Mt.setValue(U,"center",G.center),Mt.setValue(U,"modelViewMatrix",G.modelViewMatrix),Mt.setValue(U,"normalMatrix",G.normalMatrix),Mt.setValue(U,"modelMatrix",G.matrixWorld),j.isShaderMaterial||j.isRawShaderMaterial){const $t=j.uniformsGroups;for(let qt=0,Ha=$t.length;qt<Ha;qt++){const si=$t[qt];Ve.update(si,en),Ve.bind(si,en)}}return en}function Ed(C,H){C.ambientLightColor.needsUpdate=H,C.lightProbe.needsUpdate=H,C.directionalLights.needsUpdate=H,C.directionalLightShadows.needsUpdate=H,C.pointLights.needsUpdate=H,C.pointLightShadows.needsUpdate=H,C.spotLights.needsUpdate=H,C.spotLightShadows.needsUpdate=H,C.rectAreaLights.needsUpdate=H,C.hemisphereLights.needsUpdate=H}function wd(C){return C.isMeshLambertMaterial||C.isMeshToonMaterial||C.isMeshPhongMaterial||C.isMeshStandardMaterial||C.isShadowMaterial||C.isShaderMaterial&&C.lights===!0}this.getActiveCubeFace=function(){return A},this.getActiveMipmapLevel=function(){return y},this.getRenderTarget=function(){return E},this.setRenderTargetTextures=function(C,H,W){const j=se.get(C);j.__autoAllocateDepthBuffer=C.resolveDepthBuffer===!1,j.__autoAllocateDepthBuffer===!1&&(j.__useRenderToTexture=!1),se.get(C.texture).__webglTexture=H,se.get(C.depthTexture).__webglTexture=j.__autoAllocateDepthBuffer?void 0:W,j.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(C,H){const W=se.get(C);W.__webglFramebuffer=H,W.__useDefaultFramebuffer=H===void 0};const Td=U.createFramebuffer();this.setRenderTarget=function(C,H=0,W=0){E=C,A=H,y=W;let j=!0,G=null,le=!1,ve=!1;if(C){const Me=se.get(C);if(Me.__useDefaultFramebuffer!==void 0)Z.bindFramebuffer(U.FRAMEBUFFER,null),j=!1;else if(Me.__webglFramebuffer===void 0)pe.setupRenderTarget(C);else if(Me.__hasExternalTextures)pe.rebindTextures(C,se.get(C.texture).__webglTexture,se.get(C.depthTexture).__webglTexture);else if(C.depthBuffer){const Ie=C.depthTexture;if(Me.__boundDepthTexture!==Ie){if(Ie!==null&&se.has(Ie)&&(C.width!==Ie.image.width||C.height!==Ie.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");pe.setupDepthRenderbuffer(C)}}const Ne=C.texture;(Ne.isData3DTexture||Ne.isDataArrayTexture||Ne.isCompressedArrayTexture)&&(ve=!0);const ze=se.get(C).__webglFramebuffer;C.isWebGLCubeRenderTarget?(Array.isArray(ze[H])?G=ze[H][W]:G=ze[H],le=!0):C.samples>0&&pe.useMultisampledRTT(C)===!1?G=se.get(C).__webglMultisampledFramebuffer:Array.isArray(ze)?G=ze[W]:G=ze,R.copy(C.viewport),I.copy(C.scissor),L=C.scissorTest}else R.copy(ge).multiplyScalar($).floor(),I.copy(Oe).multiplyScalar($).floor(),L=qe;if(W!==0&&(G=Td),Z.bindFramebuffer(U.FRAMEBUFFER,G)&&j&&Z.drawBuffers(C,G),Z.viewport(R),Z.scissor(I),Z.setScissorTest(L),le){const Me=se.get(C.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_CUBE_MAP_POSITIVE_X+H,Me.__webglTexture,W)}else if(ve){const Me=H;for(let Ne=0;Ne<C.textures.length;Ne++){const ze=se.get(C.textures[Ne]);U.framebufferTextureLayer(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0+Ne,ze.__webglTexture,W,Me)}}else if(C!==null&&W!==0){const Me=se.get(C.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,Me.__webglTexture,W)}S=-1},this.readRenderTargetPixels=function(C,H,W,j,G,le,ve,we=0){if(!(C&&C.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Me=se.get(C).__webglFramebuffer;if(C.isWebGLCubeRenderTarget&&ve!==void 0&&(Me=Me[ve]),Me){Z.bindFramebuffer(U.FRAMEBUFFER,Me);try{const Ne=C.textures[we],ze=Ne.format,Ie=Ne.type;if(!J.textureFormatReadable(ze)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!J.textureTypeReadable(Ie)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}H>=0&&H<=C.width-j&&W>=0&&W<=C.height-G&&(C.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+we),U.readPixels(H,W,j,G,Le.convert(ze),Le.convert(Ie),le))}finally{const Ne=E!==null?se.get(E).__webglFramebuffer:null;Z.bindFramebuffer(U.FRAMEBUFFER,Ne)}}},this.readRenderTargetPixelsAsync=async function(C,H,W,j,G,le,ve,we=0){if(!(C&&C.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Me=se.get(C).__webglFramebuffer;if(C.isWebGLCubeRenderTarget&&ve!==void 0&&(Me=Me[ve]),Me)if(H>=0&&H<=C.width-j&&W>=0&&W<=C.height-G){Z.bindFramebuffer(U.FRAMEBUFFER,Me);const Ne=C.textures[we],ze=Ne.format,Ie=Ne.type;if(!J.textureFormatReadable(ze))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!J.textureTypeReadable(Ie))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Ze=U.createBuffer();U.bindBuffer(U.PIXEL_PACK_BUFFER,Ze),U.bufferData(U.PIXEL_PACK_BUFFER,le.byteLength,U.STREAM_READ),C.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+we),U.readPixels(H,W,j,G,Le.convert(ze),Le.convert(Ie),0);const rt=E!==null?se.get(E).__webglFramebuffer:null;Z.bindFramebuffer(U.FRAMEBUFFER,rt);const wt=U.fenceSync(U.SYNC_GPU_COMMANDS_COMPLETE,0);return U.flush(),await Qu(U,wt,4),U.bindBuffer(U.PIXEL_PACK_BUFFER,Ze),U.getBufferSubData(U.PIXEL_PACK_BUFFER,0,le),U.deleteBuffer(Ze),U.deleteSync(wt),le}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(C,H=null,W=0){const j=Math.pow(2,-W),G=Math.floor(C.image.width*j),le=Math.floor(C.image.height*j),ve=H!==null?H.x:0,we=H!==null?H.y:0;pe.setTexture2D(C,0),U.copyTexSubImage2D(U.TEXTURE_2D,W,0,0,ve,we,G,le),Z.unbindTexture()};const Ad=U.createFramebuffer(),Cd=U.createFramebuffer();this.copyTextureToTexture=function(C,H,W=null,j=null,G=0,le=null){le===null&&(G!==0?(Rs("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),le=G,G=0):le=0);let ve,we,Me,Ne,ze,Ie,Ze,rt,wt;const vt=C.isCompressedTexture?C.mipmaps[le]:C.image;if(W!==null)ve=W.max.x-W.min.x,we=W.max.y-W.min.y,Me=W.isBox3?W.max.z-W.min.z:1,Ne=W.min.x,ze=W.min.y,Ie=W.isBox3?W.min.z:0;else{const rn=Math.pow(2,-G);ve=Math.floor(vt.width*rn),we=Math.floor(vt.height*rn),C.isDataArrayTexture?Me=vt.depth:C.isData3DTexture?Me=Math.floor(vt.depth*rn):Me=1,Ne=0,ze=0,Ie=0}j!==null?(Ze=j.x,rt=j.y,wt=j.z):(Ze=0,rt=0,wt=0);const pt=Le.convert(H.format),Ue=Le.convert(H.type);let bt;H.isData3DTexture?(pe.setTexture3D(H,0),bt=U.TEXTURE_3D):H.isDataArrayTexture||H.isCompressedArrayTexture?(pe.setTexture2DArray(H,0),bt=U.TEXTURE_2D_ARRAY):(pe.setTexture2D(H,0),bt=U.TEXTURE_2D),U.pixelStorei(U.UNPACK_FLIP_Y_WEBGL,H.flipY),U.pixelStorei(U.UNPACK_PREMULTIPLY_ALPHA_WEBGL,H.premultiplyAlpha),U.pixelStorei(U.UNPACK_ALIGNMENT,H.unpackAlignment);const et=U.getParameter(U.UNPACK_ROW_LENGTH),en=U.getParameter(U.UNPACK_IMAGE_HEIGHT),Ei=U.getParameter(U.UNPACK_SKIP_PIXELS),tn=U.getParameter(U.UNPACK_SKIP_ROWS),is=U.getParameter(U.UNPACK_SKIP_IMAGES);U.pixelStorei(U.UNPACK_ROW_LENGTH,vt.width),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,vt.height),U.pixelStorei(U.UNPACK_SKIP_PIXELS,Ne),U.pixelStorei(U.UNPACK_SKIP_ROWS,ze),U.pixelStorei(U.UNPACK_SKIP_IMAGES,Ie);const Mt=C.isDataArrayTexture||C.isData3DTexture,an=H.isDataArrayTexture||H.isData3DTexture;if(C.isDepthTexture){const rn=se.get(C),$t=se.get(H),qt=se.get(rn.__renderTarget),Ha=se.get($t.__renderTarget);Z.bindFramebuffer(U.READ_FRAMEBUFFER,qt.__webglFramebuffer),Z.bindFramebuffer(U.DRAW_FRAMEBUFFER,Ha.__webglFramebuffer);for(let si=0;si<Me;si++)Mt&&(U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,se.get(C).__webglTexture,G,Ie+si),U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,se.get(H).__webglTexture,le,wt+si)),U.blitFramebuffer(Ne,ze,ve,we,Ze,rt,ve,we,U.DEPTH_BUFFER_BIT,U.NEAREST);Z.bindFramebuffer(U.READ_FRAMEBUFFER,null),Z.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else if(G!==0||C.isRenderTargetTexture||se.has(C)){const rn=se.get(C),$t=se.get(H);Z.bindFramebuffer(U.READ_FRAMEBUFFER,Ad),Z.bindFramebuffer(U.DRAW_FRAMEBUFFER,Cd);for(let qt=0;qt<Me;qt++)Mt?U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,rn.__webglTexture,G,Ie+qt):U.framebufferTexture2D(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,rn.__webglTexture,G),an?U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,$t.__webglTexture,le,wt+qt):U.framebufferTexture2D(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,$t.__webglTexture,le),G!==0?U.blitFramebuffer(Ne,ze,ve,we,Ze,rt,ve,we,U.COLOR_BUFFER_BIT,U.NEAREST):an?U.copyTexSubImage3D(bt,le,Ze,rt,wt+qt,Ne,ze,ve,we):U.copyTexSubImage2D(bt,le,Ze,rt,Ne,ze,ve,we);Z.bindFramebuffer(U.READ_FRAMEBUFFER,null),Z.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else an?C.isDataTexture||C.isData3DTexture?U.texSubImage3D(bt,le,Ze,rt,wt,ve,we,Me,pt,Ue,vt.data):H.isCompressedArrayTexture?U.compressedTexSubImage3D(bt,le,Ze,rt,wt,ve,we,Me,pt,vt.data):U.texSubImage3D(bt,le,Ze,rt,wt,ve,we,Me,pt,Ue,vt):C.isDataTexture?U.texSubImage2D(U.TEXTURE_2D,le,Ze,rt,ve,we,pt,Ue,vt.data):C.isCompressedTexture?U.compressedTexSubImage2D(U.TEXTURE_2D,le,Ze,rt,vt.width,vt.height,pt,vt.data):U.texSubImage2D(U.TEXTURE_2D,le,Ze,rt,ve,we,pt,Ue,vt);U.pixelStorei(U.UNPACK_ROW_LENGTH,et),U.pixelStorei(U.UNPACK_IMAGE_HEIGHT,en),U.pixelStorei(U.UNPACK_SKIP_PIXELS,Ei),U.pixelStorei(U.UNPACK_SKIP_ROWS,tn),U.pixelStorei(U.UNPACK_SKIP_IMAGES,is),le===0&&H.generateMipmaps&&U.generateMipmap(bt),Z.unbindTexture()},this.initRenderTarget=function(C){se.get(C).__webglFramebuffer===void 0&&pe.setupRenderTarget(C)},this.initTexture=function(C){C.isCubeTexture?pe.setTextureCube(C,0):C.isData3DTexture?pe.setTexture3D(C,0):C.isDataArrayTexture||C.isCompressedArrayTexture?pe.setTexture2DArray(C,0):pe.setTexture2D(C,0),Z.unbindTexture()},this.resetState=function(){A=0,y=0,E=null,Z.reset(),_e.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return wn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=tt._getDrawingBufferColorSpace(e),t.unpackColorSpace=tt._getUnpackColorSpace()}}const rc={type:"change"},Vo={type:"start"},pd={type:"end"},ga=new Fa,oc=new Zn,tv=Math.cos(70*Ju.DEG2RAD),Lt=new D,Zt=2*Math.PI,lt={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},Er=1e-6;class nv extends od{constructor(e,t=null){super(e,t),this.state=lt.NONE,this.target=new D,this.cursor=new D,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:$i.ROTATE,MIDDLE:$i.DOLLY,RIGHT:$i.PAN},this.touches={ONE:Bi.ROTATE,TWO:Bi.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new D,this._lastQuaternion=new zt,this._lastTargetPosition=new D,this._quat=new zt().setFromUnitVectors(e.up,new D(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Ul,this._sphericalDelta=new Ul,this._scale=1,this._panOffset=new D,this._rotateStart=new oe,this._rotateEnd=new oe,this._rotateDelta=new oe,this._panStart=new oe,this._panEnd=new oe,this._panDelta=new oe,this._dollyStart=new oe,this._dollyEnd=new oe,this._dollyDelta=new oe,this._dollyDirection=new D,this._mouse=new oe,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=sv.bind(this),this._onPointerDown=iv.bind(this),this._onPointerUp=av.bind(this),this._onContextMenu=hv.bind(this),this._onMouseWheel=lv.bind(this),this._onKeyDown=cv.bind(this),this._onTouchStart=dv.bind(this),this._onTouchMove=uv.bind(this),this._onMouseDown=rv.bind(this),this._onMouseMove=ov.bind(this),this._interceptControlDown=pv.bind(this),this._interceptControlUp=fv.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(rc),this.update(),this.state=lt.NONE}update(e=null){const t=this.object.position;Lt.copy(t).sub(this.target),Lt.applyQuaternion(this._quat),this._spherical.setFromVector3(Lt),this.autoRotate&&this.state===lt.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(i)&&isFinite(s)&&(i<-Math.PI?i+=Zt:i>Math.PI&&(i-=Zt),s<-Math.PI?s+=Zt:s>Math.PI&&(s-=Zt),i<=s?this._spherical.theta=Math.max(i,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+s)/2?Math.max(i,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let a=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const r=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),a=r!=this._spherical.radius}if(Lt.setFromSpherical(this._spherical),Lt.applyQuaternion(this._quatInverse),t.copy(this.target).add(Lt),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let r=null;if(this.object.isPerspectiveCamera){const o=Lt.length();r=this._clampDistance(o*this._scale);const l=o-r;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),a=!!l}else if(this.object.isOrthographicCamera){const o=new D(this._mouse.x,this._mouse.y,0);o.unproject(this.object);const l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),a=l!==this.object.zoom;const c=new D(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(o),this.object.updateMatrixWorld(),r=Lt.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;r!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(r).add(this.object.position):(ga.origin.copy(this.object.position),ga.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(ga.direction))<tv?this.object.lookAt(this.target):(oc.setFromNormalAndCoplanarPoint(this.object.up,this.target),ga.intersectPlane(oc,this.target))))}else if(this.object.isOrthographicCamera){const r=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),r!==this.object.zoom&&(this.object.updateProjectionMatrix(),a=!0)}return this._scale=1,this._performCursorZoom=!1,a||this._lastPosition.distanceToSquared(this.object.position)>Er||8*(1-this._lastQuaternion.dot(this.object.quaternion))>Er||this._lastTargetPosition.distanceToSquared(this.target)>Er?(this.dispatchEvent(rc),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?Zt/60*this.autoRotateSpeed*e:Zt/60/60*this.autoRotateSpeed}_getZoomScale(e){const t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){Lt.setFromMatrixColumn(t,0),Lt.multiplyScalar(-e),this._panOffset.add(Lt)}_panUp(e,t){this.screenSpacePanning===!0?Lt.setFromMatrixColumn(t,1):(Lt.setFromMatrixColumn(t,0),Lt.crossVectors(this.object.up,Lt)),Lt.multiplyScalar(e),this._panOffset.add(Lt)}_pan(e,t){const i=this.domElement;if(this.object.isPerspectiveCamera){const s=this.object.position;Lt.copy(s).sub(this.target);let a=Lt.length();a*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*a/i.clientHeight,this.object.matrix),this._panUp(2*t*a/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const i=this.domElement.getBoundingClientRect(),s=e-i.left,a=t-i.top,r=i.width,o=i.height;this._mouse.x=s/r*2-1,this._mouse.y=-(a/o)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(Zt*this._rotateDelta.x/t.clientHeight),this._rotateUp(Zt*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(Zt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-Zt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(Zt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-Zt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._rotateStart.set(i,s)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panStart.set(i,s)}}_handleTouchStartDolly(e){const t=this._getSecondPointerPosition(e),i=e.pageX-t.x,s=e.pageY-t.y,a=Math.sqrt(i*i+s*s);this._dollyStart.set(0,a)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const i=this._getSecondPointerPosition(e),s=.5*(e.pageX+i.x),a=.5*(e.pageY+i.y);this._rotateEnd.set(s,a)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(Zt*this._rotateDelta.x/t.clientHeight),this._rotateUp(Zt*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panEnd.set(i,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const t=this._getSecondPointerPosition(e),i=e.pageX-t.x,s=e.pageY-t.y,a=Math.sqrt(i*i+s*s);this._dollyEnd.set(0,a),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const r=(e.pageX+t.x)*.5,o=(e.pageY+t.y)*.5;this._updateZoomParameters(r,o)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new oe,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){const t=e.deltaMode,i={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}}function iv(n){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(n.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(n)&&(this._addPointer(n),n.pointerType==="touch"?this._onTouchStart(n):this._onMouseDown(n)))}function sv(n){this.enabled!==!1&&(n.pointerType==="touch"?this._onTouchMove(n):this._onMouseMove(n))}function av(n){switch(this._removePointer(n),this._pointers.length){case 0:this.domElement.releasePointerCapture(n.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(pd),this.state=lt.NONE;break;case 1:const e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function rv(n){let e;switch(n.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case $i.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(n),this.state=lt.DOLLY;break;case $i.ROTATE:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=lt.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=lt.ROTATE}break;case $i.PAN:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=lt.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=lt.PAN}break;default:this.state=lt.NONE}this.state!==lt.NONE&&this.dispatchEvent(Vo)}function ov(n){switch(this.state){case lt.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(n);break;case lt.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(n);break;case lt.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(n);break}}function lv(n){this.enabled===!1||this.enableZoom===!1||this.state!==lt.NONE||(n.preventDefault(),this.dispatchEvent(Vo),this._handleMouseWheel(this._customWheelEvent(n)),this.dispatchEvent(pd))}function cv(n){this.enabled!==!1&&this._handleKeyDown(n)}function dv(n){switch(this._trackPointer(n),this._pointers.length){case 1:switch(this.touches.ONE){case Bi.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(n),this.state=lt.TOUCH_ROTATE;break;case Bi.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(n),this.state=lt.TOUCH_PAN;break;default:this.state=lt.NONE}break;case 2:switch(this.touches.TWO){case Bi.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(n),this.state=lt.TOUCH_DOLLY_PAN;break;case Bi.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(n),this.state=lt.TOUCH_DOLLY_ROTATE;break;default:this.state=lt.NONE}break;default:this.state=lt.NONE}this.state!==lt.NONE&&this.dispatchEvent(Vo)}function uv(n){switch(this._trackPointer(n),this.state){case lt.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(n),this.update();break;case lt.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(n),this.update();break;case lt.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(n),this.update();break;case lt.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(n),this.update();break;default:this.state=lt.NONE}}function hv(n){this.enabled!==!1&&n.preventDefault()}function pv(n){n.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function fv(n){n.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const ui=new rd,Vt=new D,qn=new D,xt=new zt,lc={X:new D(1,0,0),Y:new D(0,1,0),Z:new D(0,0,1)},wr={type:"change"},cc={type:"mouseDown",mode:null},dc={type:"mouseUp",mode:null},uc={type:"objectChange"};class mv extends od{constructor(e,t=null){super(void 0,t);const i=new bv(this);this._root=i;const s=new Mv;this._gizmo=s,i.add(s);const a=new Sv;this._plane=a,i.add(a);const r=this;function o(v,g){let w=g;Object.defineProperty(r,v,{get:function(){return w!==void 0?w:g},set:function(A){w!==A&&(w=A,a[v]=A,s[v]=A,r.dispatchEvent({type:v+"-changed",value:A}),r.dispatchEvent(wr))}}),r[v]=g,a[v]=g,s[v]=g}o("camera",e),o("object",void 0),o("enabled",!0),o("axis",null),o("mode","translate"),o("translationSnap",null),o("rotationSnap",null),o("scaleSnap",null),o("space","world"),o("size",1),o("dragging",!1),o("showX",!0),o("showY",!0),o("showZ",!0),o("minX",-1/0),o("maxX",1/0),o("minY",-1/0),o("maxY",1/0),o("minZ",-1/0),o("maxZ",1/0);const l=new D,c=new D,d=new zt,u=new zt,h=new D,m=new zt,_=new D,x=new D,f=new D,p=0,M=new D;o("worldPosition",l),o("worldPositionStart",c),o("worldQuaternion",d),o("worldQuaternionStart",u),o("cameraPosition",h),o("cameraQuaternion",m),o("pointStart",_),o("pointEnd",x),o("rotationAxis",f),o("rotationAngle",p),o("eye",M),this._offset=new D,this._startNorm=new D,this._endNorm=new D,this._cameraScale=new D,this._parentPosition=new D,this._parentQuaternion=new zt,this._parentQuaternionInv=new zt,this._parentScale=new D,this._worldScaleStart=new D,this._worldQuaternionInv=new zt,this._worldScale=new D,this._positionStart=new D,this._quaternionStart=new zt,this._scaleStart=new D,this._getPointer=gv.bind(this),this._onPointerDown=vv.bind(this),this._onPointerHover=_v.bind(this),this._onPointerMove=xv.bind(this),this._onPointerUp=yv.bind(this),t!==null&&this.connect(t)}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointermove",this._onPointerHover),this.domElement.addEventListener("pointerup",this._onPointerUp),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerHover),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.style.touchAction="auto"}getHelper(){return this._root}pointerHover(e){if(this.object===void 0||this.dragging===!0)return;e!==null&&ui.setFromCamera(e,this.camera);const t=Tr(this._gizmo.picker[this.mode],ui);t?this.axis=t.object.name:this.axis=null}pointerDown(e){if(!(this.object===void 0||this.dragging===!0||e!=null&&e.button!==0)&&this.axis!==null){e!==null&&ui.setFromCamera(e,this.camera);const t=Tr(this._plane,ui,!0);t&&(this.object.updateMatrixWorld(),this.object.parent.updateMatrixWorld(),this._positionStart.copy(this.object.position),this._quaternionStart.copy(this.object.quaternion),this._scaleStart.copy(this.object.scale),this.object.matrixWorld.decompose(this.worldPositionStart,this.worldQuaternionStart,this._worldScaleStart),this.pointStart.copy(t.point).sub(this.worldPositionStart)),this.dragging=!0,cc.mode=this.mode,this.dispatchEvent(cc)}}pointerMove(e){const t=this.axis,i=this.mode,s=this.object;let a=this.space;if(i==="scale"?a="local":(t==="E"||t==="XYZE"||t==="XYZ")&&(a="world"),s===void 0||t===null||this.dragging===!1||e!==null&&e.button!==-1)return;e!==null&&ui.setFromCamera(e,this.camera);const r=Tr(this._plane,ui,!0);if(r){if(this.pointEnd.copy(r.point).sub(this.worldPositionStart),i==="translate")this._offset.copy(this.pointEnd).sub(this.pointStart),a==="local"&&t!=="XYZ"&&this._offset.applyQuaternion(this._worldQuaternionInv),t.indexOf("X")===-1&&(this._offset.x=0),t.indexOf("Y")===-1&&(this._offset.y=0),t.indexOf("Z")===-1&&(this._offset.z=0),a==="local"&&t!=="XYZ"?this._offset.applyQuaternion(this._quaternionStart).divide(this._parentScale):this._offset.applyQuaternion(this._parentQuaternionInv).divide(this._parentScale),s.position.copy(this._offset).add(this._positionStart),this.translationSnap&&(a==="local"&&(s.position.applyQuaternion(xt.copy(this._quaternionStart).invert()),t.search("X")!==-1&&(s.position.x=Math.round(s.position.x/this.translationSnap)*this.translationSnap),t.search("Y")!==-1&&(s.position.y=Math.round(s.position.y/this.translationSnap)*this.translationSnap),t.search("Z")!==-1&&(s.position.z=Math.round(s.position.z/this.translationSnap)*this.translationSnap),s.position.applyQuaternion(this._quaternionStart)),a==="world"&&(s.parent&&s.position.add(Vt.setFromMatrixPosition(s.parent.matrixWorld)),t.search("X")!==-1&&(s.position.x=Math.round(s.position.x/this.translationSnap)*this.translationSnap),t.search("Y")!==-1&&(s.position.y=Math.round(s.position.y/this.translationSnap)*this.translationSnap),t.search("Z")!==-1&&(s.position.z=Math.round(s.position.z/this.translationSnap)*this.translationSnap),s.parent&&s.position.sub(Vt.setFromMatrixPosition(s.parent.matrixWorld)))),s.position.x=Math.max(this.minX,Math.min(this.maxX,s.position.x)),s.position.y=Math.max(this.minY,Math.min(this.maxY,s.position.y)),s.position.z=Math.max(this.minZ,Math.min(this.maxZ,s.position.z));else if(i==="scale"){if(t.search("XYZ")!==-1){let o=this.pointEnd.length()/this.pointStart.length();this.pointEnd.dot(this.pointStart)<0&&(o*=-1),qn.set(o,o,o)}else Vt.copy(this.pointStart),qn.copy(this.pointEnd),Vt.applyQuaternion(this._worldQuaternionInv),qn.applyQuaternion(this._worldQuaternionInv),qn.divide(Vt),t.search("X")===-1&&(qn.x=1),t.search("Y")===-1&&(qn.y=1),t.search("Z")===-1&&(qn.z=1);s.scale.copy(this._scaleStart).multiply(qn),this.scaleSnap&&(t.search("X")!==-1&&(s.scale.x=Math.round(s.scale.x/this.scaleSnap)*this.scaleSnap||this.scaleSnap),t.search("Y")!==-1&&(s.scale.y=Math.round(s.scale.y/this.scaleSnap)*this.scaleSnap||this.scaleSnap),t.search("Z")!==-1&&(s.scale.z=Math.round(s.scale.z/this.scaleSnap)*this.scaleSnap||this.scaleSnap))}else if(i==="rotate"){this._offset.copy(this.pointEnd).sub(this.pointStart);const o=20/this.worldPosition.distanceTo(Vt.setFromMatrixPosition(this.camera.matrixWorld));let l=!1;t==="XYZE"?(this.rotationAxis.copy(this._offset).cross(this.eye).normalize(),this.rotationAngle=this._offset.dot(Vt.copy(this.rotationAxis).cross(this.eye))*o):(t==="X"||t==="Y"||t==="Z")&&(this.rotationAxis.copy(lc[t]),Vt.copy(lc[t]),a==="local"&&Vt.applyQuaternion(this.worldQuaternion),Vt.cross(this.eye),Vt.length()===0?l=!0:this.rotationAngle=this._offset.dot(Vt.normalize())*o),(t==="E"||l)&&(this.rotationAxis.copy(this.eye),this.rotationAngle=this.pointEnd.angleTo(this.pointStart),this._startNorm.copy(this.pointStart).normalize(),this._endNorm.copy(this.pointEnd).normalize(),this.rotationAngle*=this._endNorm.cross(this._startNorm).dot(this.eye)<0?1:-1),this.rotationSnap&&(this.rotationAngle=Math.round(this.rotationAngle/this.rotationSnap)*this.rotationSnap),a==="local"&&t!=="E"&&t!=="XYZE"?(s.quaternion.copy(this._quaternionStart),s.quaternion.multiply(xt.setFromAxisAngle(this.rotationAxis,this.rotationAngle)).normalize()):(this.rotationAxis.applyQuaternion(this._parentQuaternionInv),s.quaternion.copy(xt.setFromAxisAngle(this.rotationAxis,this.rotationAngle)),s.quaternion.multiply(this._quaternionStart).normalize())}this.dispatchEvent(wr),this.dispatchEvent(uc)}}pointerUp(e){e!==null&&e.button!==0||(this.dragging&&this.axis!==null&&(dc.mode=this.mode,this.dispatchEvent(dc)),this.dragging=!1,this.axis=null)}dispose(){this.disconnect(),this._root.dispose()}attach(e){return this.object=e,this._root.visible=!0,this}detach(){return this.object=void 0,this.axis=null,this._root.visible=!1,this}reset(){this.enabled&&this.dragging&&(this.object.position.copy(this._positionStart),this.object.quaternion.copy(this._quaternionStart),this.object.scale.copy(this._scaleStart),this.dispatchEvent(wr),this.dispatchEvent(uc),this.pointStart.copy(this.pointEnd))}getRaycaster(){return ui}getMode(){return this.mode}setMode(e){this.mode=e}setTranslationSnap(e){this.translationSnap=e}setRotationSnap(e){this.rotationSnap=e}setScaleSnap(e){this.scaleSnap=e}setSize(e){this.size=e}setSpace(e){this.space=e}setColors(e,t,i,s){const a=this._gizmo.materialLib;a.xAxis.color.set(e),a.yAxis.color.set(t),a.zAxis.color.set(i),a.active.color.set(s),a.xAxisTransparent.color.set(e),a.yAxisTransparent.color.set(t),a.zAxisTransparent.color.set(i),a.activeTransparent.color.set(s),a.xAxis._color&&a.xAxis._color.set(e),a.yAxis._color&&a.yAxis._color.set(t),a.zAxis._color&&a.zAxis._color.set(i),a.active._color&&a.active._color.set(s),a.xAxisTransparent._color&&a.xAxisTransparent._color.set(e),a.yAxisTransparent._color&&a.yAxisTransparent._color.set(t),a.zAxisTransparent._color&&a.zAxisTransparent._color.set(i),a.activeTransparent._color&&a.activeTransparent._color.set(s)}}function gv(n){if(this.domElement.ownerDocument.pointerLockElement)return{x:0,y:0,button:n.button};{const e=this.domElement.getBoundingClientRect();return{x:(n.clientX-e.left)/e.width*2-1,y:-(n.clientY-e.top)/e.height*2+1,button:n.button}}}function _v(n){if(this.enabled)switch(n.pointerType){case"mouse":case"pen":this.pointerHover(this._getPointer(n));break}}function vv(n){this.enabled&&(document.pointerLockElement||this.domElement.setPointerCapture(n.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.pointerHover(this._getPointer(n)),this.pointerDown(this._getPointer(n)))}function xv(n){this.enabled&&this.pointerMove(this._getPointer(n))}function yv(n){this.enabled&&(this.domElement.releasePointerCapture(n.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.pointerUp(this._getPointer(n)))}function Tr(n,e,t){const i=e.intersectObject(n,!0);for(let s=0;s<i.length;s++)if(i[s].object.visible||t)return i[s];return!1}const _a=new _n,ft=new D(0,1,0),hc=new D(0,0,0),pc=new dt,va=new zt,Ta=new zt,yn=new D,fc=new dt,gs=new D(1,0,0),fi=new D(0,1,0),_s=new D(0,0,1),xa=new D,ds=new D,us=new D;class bv extends Ct{constructor(e){super(),this.isTransformControlsRoot=!0,this.controls=e,this.visible=!1}updateMatrixWorld(e){const t=this.controls;t.object!==void 0&&(t.object.updateMatrixWorld(),t.object.parent===null?console.error("TransformControls: The attached 3D object must be a part of the scene graph."):t.object.parent.matrixWorld.decompose(t._parentPosition,t._parentQuaternion,t._parentScale),t.object.matrixWorld.decompose(t.worldPosition,t.worldQuaternion,t._worldScale),t._parentQuaternionInv.copy(t._parentQuaternion).invert(),t._worldQuaternionInv.copy(t.worldQuaternion).invert()),t.camera.updateMatrixWorld(),t.camera.matrixWorld.decompose(t.cameraPosition,t.cameraQuaternion,t._cameraScale),t.camera.isOrthographicCamera?t.camera.getWorldDirection(t.eye).negate():t.eye.copy(t.cameraPosition).sub(t.worldPosition).normalize(),super.updateMatrixWorld(e)}dispose(){this.traverse(function(e){e.geometry&&e.geometry.dispose(),e.material&&e.material.dispose()})}}class Mv extends Ct{constructor(){super(),this.isTransformControlsGizmo=!0,this.type="TransformControlsGizmo";const e=new Oa({depthTest:!1,depthWrite:!1,fog:!1,toneMapped:!1,transparent:!0}),t=new Ki({depthTest:!1,depthWrite:!1,fog:!1,toneMapped:!1,transparent:!0}),i=e.clone();i.opacity=.15;const s=t.clone();s.opacity=.5;const a=e.clone();a.color.setHex(16711680);const r=e.clone();r.color.setHex(65280);const o=e.clone();o.color.setHex(255);const l=e.clone();l.color.setHex(16711680),l.opacity=.5;const c=e.clone();c.color.setHex(65280),c.opacity=.5;const d=e.clone();d.color.setHex(255),d.opacity=.5;const u=e.clone();u.opacity=.25;const h=e.clone();h.color.setHex(16776960),h.opacity=.25;const m=e.clone();m.color.setHex(16776960);const _=e.clone();_.color.setHex(7895160),this.materialLib={xAxis:a,yAxis:r,zAxis:o,active:m,xAxisTransparent:l,yAxisTransparent:c,zAxisTransparent:d,activeTransparent:h};const x=new Ot(0,.04,.1,12);x.translate(0,.05,0);const f=new St(.08,.08,.08);f.translate(0,.04,0);const p=new Ft;p.setAttribute("position",new at([0,0,0,1,0,0],3));const M=new Ot(.0075,.0075,.5,3);M.translate(0,.25,0);function v(N,F){const B=new gi(N,.0075,3,64,F*Math.PI*2);return B.rotateY(Math.PI/2),B.rotateX(Math.PI/2),B}function g(){const N=new Ft;return N.setAttribute("position",new at([0,0,0,1,1,1],3)),N}const w={X:[[new be(x,a),[.5,0,0],[0,0,-Math.PI/2]],[new be(x,a),[-.5,0,0],[0,0,Math.PI/2]],[new be(M,a),[0,0,0],[0,0,-Math.PI/2]]],Y:[[new be(x,r),[0,.5,0]],[new be(x,r),[0,-.5,0],[Math.PI,0,0]],[new be(M,r)]],Z:[[new be(x,o),[0,0,.5],[Math.PI/2,0,0]],[new be(x,o),[0,0,-.5],[-Math.PI/2,0,0]],[new be(M,o),null,[Math.PI/2,0,0]]],XYZ:[[new be(new Gi(.1,0),u),[0,0,0]]],XY:[[new be(new St(.15,.15,.01),d),[.15,.15,0]]],YZ:[[new be(new St(.15,.15,.01),l),[0,.15,.15],[0,Math.PI/2,0]]],XZ:[[new be(new St(.15,.15,.01),c),[.15,0,.15],[-Math.PI/2,0,0]]]},A={X:[[new be(new Ot(.2,0,.6,4),i),[.3,0,0],[0,0,-Math.PI/2]],[new be(new Ot(.2,0,.6,4),i),[-.3,0,0],[0,0,Math.PI/2]]],Y:[[new be(new Ot(.2,0,.6,4),i),[0,.3,0]],[new be(new Ot(.2,0,.6,4),i),[0,-.3,0],[0,0,Math.PI]]],Z:[[new be(new Ot(.2,0,.6,4),i),[0,0,.3],[Math.PI/2,0,0]],[new be(new Ot(.2,0,.6,4),i),[0,0,-.3],[-Math.PI/2,0,0]]],XYZ:[[new be(new Gi(.2,0),i)]],XY:[[new be(new St(.2,.2,.01),i),[.15,.15,0]]],YZ:[[new be(new St(.2,.2,.01),i),[0,.15,.15],[0,Math.PI/2,0]]],XZ:[[new be(new St(.2,.2,.01),i),[.15,0,.15],[-Math.PI/2,0,0]]]},y={START:[[new be(new Gi(.01,2),s),null,null,null,"helper"]],END:[[new be(new Gi(.01,2),s),null,null,null,"helper"]],DELTA:[[new On(g(),s),null,null,null,"helper"]],X:[[new On(p,s),[-1e3,0,0],null,[1e6,1,1],"helper"]],Y:[[new On(p,s),[0,-1e3,0],[0,0,Math.PI/2],[1e6,1,1],"helper"]],Z:[[new On(p,s),[0,0,-1e3],[0,-Math.PI/2,0],[1e6,1,1],"helper"]]},E={XYZE:[[new be(v(.5,1),_),null,[0,Math.PI/2,0]]],X:[[new be(v(.5,.5),a)]],Y:[[new be(v(.5,.5),r),null,[0,0,-Math.PI/2]]],Z:[[new be(v(.5,.5),o),null,[0,Math.PI/2,0]]],E:[[new be(v(.75,1),h),null,[0,Math.PI/2,0]]]},S={AXIS:[[new On(p,s),[-1e3,0,0],null,[1e6,1,1],"helper"]]},b={XYZE:[[new be(new Fs(.25,10,8),i)]],X:[[new be(new gi(.5,.1,4,24),i),[0,0,0],[0,-Math.PI/2,-Math.PI/2]]],Y:[[new be(new gi(.5,.1,4,24),i),[0,0,0],[Math.PI/2,0,0]]],Z:[[new be(new gi(.5,.1,4,24),i),[0,0,0],[0,0,-Math.PI/2]]],E:[[new be(new gi(.75,.1,2,24),i)]]},R={X:[[new be(f,a),[.5,0,0],[0,0,-Math.PI/2]],[new be(M,a),[0,0,0],[0,0,-Math.PI/2]],[new be(f,a),[-.5,0,0],[0,0,Math.PI/2]]],Y:[[new be(f,r),[0,.5,0]],[new be(M,r)],[new be(f,r),[0,-.5,0],[0,0,Math.PI]]],Z:[[new be(f,o),[0,0,.5],[Math.PI/2,0,0]],[new be(M,o),[0,0,0],[Math.PI/2,0,0]],[new be(f,o),[0,0,-.5],[-Math.PI/2,0,0]]],XY:[[new be(new St(.15,.15,.01),d),[.15,.15,0]]],YZ:[[new be(new St(.15,.15,.01),l),[0,.15,.15],[0,Math.PI/2,0]]],XZ:[[new be(new St(.15,.15,.01),c),[.15,0,.15],[-Math.PI/2,0,0]]],XYZ:[[new be(new St(.1,.1,.1),u)]]},I={X:[[new be(new Ot(.2,0,.6,4),i),[.3,0,0],[0,0,-Math.PI/2]],[new be(new Ot(.2,0,.6,4),i),[-.3,0,0],[0,0,Math.PI/2]]],Y:[[new be(new Ot(.2,0,.6,4),i),[0,.3,0]],[new be(new Ot(.2,0,.6,4),i),[0,-.3,0],[0,0,Math.PI]]],Z:[[new be(new Ot(.2,0,.6,4),i),[0,0,.3],[Math.PI/2,0,0]],[new be(new Ot(.2,0,.6,4),i),[0,0,-.3],[-Math.PI/2,0,0]]],XY:[[new be(new St(.2,.2,.01),i),[.15,.15,0]]],YZ:[[new be(new St(.2,.2,.01),i),[0,.15,.15],[0,Math.PI/2,0]]],XZ:[[new be(new St(.2,.2,.01),i),[.15,0,.15],[-Math.PI/2,0,0]]],XYZ:[[new be(new St(.2,.2,.2),i),[0,0,0]]]},L={X:[[new On(p,s),[-1e3,0,0],null,[1e6,1,1],"helper"]],Y:[[new On(p,s),[0,-1e3,0],[0,0,Math.PI/2],[1e6,1,1],"helper"]],Z:[[new On(p,s),[0,0,-1e3],[0,-Math.PI/2,0],[1e6,1,1],"helper"]]};function z(N){const F=new Ct;for(const B in N)for(let $=N[B].length;$--;){const K=N[B][$][0].clone(),ue=N[B][$][1],ge=N[B][$][2],Oe=N[B][$][3],qe=N[B][$][4];K.name=B,K.tag=qe,ue&&K.position.set(ue[0],ue[1],ue[2]),ge&&K.rotation.set(ge[0],ge[1],ge[2]),Oe&&K.scale.set(Oe[0],Oe[1],Oe[2]),K.updateMatrix();const Qe=K.geometry.clone();Qe.applyMatrix4(K.matrix),K.geometry=Qe,K.renderOrder=1/0,K.position.set(0,0,0),K.rotation.set(0,0,0),K.scale.set(1,1,1),F.add(K)}return F}this.gizmo={},this.picker={},this.helper={},this.add(this.gizmo.translate=z(w)),this.add(this.gizmo.rotate=z(E)),this.add(this.gizmo.scale=z(R)),this.add(this.picker.translate=z(A)),this.add(this.picker.rotate=z(b)),this.add(this.picker.scale=z(I)),this.add(this.helper.translate=z(y)),this.add(this.helper.rotate=z(S)),this.add(this.helper.scale=z(L)),this.picker.translate.visible=!1,this.picker.rotate.visible=!1,this.picker.scale.visible=!1}updateMatrixWorld(e){const i=(this.mode==="scale"?"local":this.space)==="local"?this.worldQuaternion:Ta;this.gizmo.translate.visible=this.mode==="translate",this.gizmo.rotate.visible=this.mode==="rotate",this.gizmo.scale.visible=this.mode==="scale",this.helper.translate.visible=this.mode==="translate",this.helper.rotate.visible=this.mode==="rotate",this.helper.scale.visible=this.mode==="scale";let s=[];s=s.concat(this.picker[this.mode].children),s=s.concat(this.gizmo[this.mode].children),s=s.concat(this.helper[this.mode].children);for(let a=0;a<s.length;a++){const r=s[a];r.visible=!0,r.rotation.set(0,0,0),r.position.copy(this.worldPosition);let o;if(this.camera.isOrthographicCamera?o=(this.camera.top-this.camera.bottom)/this.camera.zoom:o=this.worldPosition.distanceTo(this.cameraPosition)*Math.min(1.9*Math.tan(Math.PI*this.camera.fov/360)/this.camera.zoom,7),r.scale.set(1,1,1).multiplyScalar(o*this.size/4),r.tag==="helper"){r.visible=!1,r.name==="AXIS"?(r.visible=!!this.axis,this.axis==="X"&&(xt.setFromEuler(_a.set(0,0,0)),r.quaternion.copy(i).multiply(xt),Math.abs(ft.copy(gs).applyQuaternion(i).dot(this.eye))>.9&&(r.visible=!1)),this.axis==="Y"&&(xt.setFromEuler(_a.set(0,0,Math.PI/2)),r.quaternion.copy(i).multiply(xt),Math.abs(ft.copy(fi).applyQuaternion(i).dot(this.eye))>.9&&(r.visible=!1)),this.axis==="Z"&&(xt.setFromEuler(_a.set(0,Math.PI/2,0)),r.quaternion.copy(i).multiply(xt),Math.abs(ft.copy(_s).applyQuaternion(i).dot(this.eye))>.9&&(r.visible=!1)),this.axis==="XYZE"&&(xt.setFromEuler(_a.set(0,Math.PI/2,0)),ft.copy(this.rotationAxis),r.quaternion.setFromRotationMatrix(pc.lookAt(hc,ft,fi)),r.quaternion.multiply(xt),r.visible=this.dragging),this.axis==="E"&&(r.visible=!1)):r.name==="START"?(r.position.copy(this.worldPositionStart),r.visible=this.dragging):r.name==="END"?(r.position.copy(this.worldPosition),r.visible=this.dragging):r.name==="DELTA"?(r.position.copy(this.worldPositionStart),r.quaternion.copy(this.worldQuaternionStart),Vt.set(1e-10,1e-10,1e-10).add(this.worldPositionStart).sub(this.worldPosition).multiplyScalar(-1),Vt.applyQuaternion(this.worldQuaternionStart.clone().invert()),r.scale.copy(Vt),r.visible=this.dragging):(r.quaternion.copy(i),this.dragging?r.position.copy(this.worldPositionStart):r.position.copy(this.worldPosition),this.axis&&(r.visible=this.axis.search(r.name)!==-1));continue}r.quaternion.copy(i),this.mode==="translate"||this.mode==="scale"?(r.name==="X"&&Math.abs(ft.copy(gs).applyQuaternion(i).dot(this.eye))>.99&&(r.scale.set(1e-10,1e-10,1e-10),r.visible=!1),r.name==="Y"&&Math.abs(ft.copy(fi).applyQuaternion(i).dot(this.eye))>.99&&(r.scale.set(1e-10,1e-10,1e-10),r.visible=!1),r.name==="Z"&&Math.abs(ft.copy(_s).applyQuaternion(i).dot(this.eye))>.99&&(r.scale.set(1e-10,1e-10,1e-10),r.visible=!1),r.name==="XY"&&Math.abs(ft.copy(_s).applyQuaternion(i).dot(this.eye))<.2&&(r.scale.set(1e-10,1e-10,1e-10),r.visible=!1),r.name==="YZ"&&Math.abs(ft.copy(gs).applyQuaternion(i).dot(this.eye))<.2&&(r.scale.set(1e-10,1e-10,1e-10),r.visible=!1),r.name==="XZ"&&Math.abs(ft.copy(fi).applyQuaternion(i).dot(this.eye))<.2&&(r.scale.set(1e-10,1e-10,1e-10),r.visible=!1)):this.mode==="rotate"&&(va.copy(i),ft.copy(this.eye).applyQuaternion(xt.copy(i).invert()),r.name.search("E")!==-1&&r.quaternion.setFromRotationMatrix(pc.lookAt(this.eye,hc,fi)),r.name==="X"&&(xt.setFromAxisAngle(gs,Math.atan2(-ft.y,ft.z)),xt.multiplyQuaternions(va,xt),r.quaternion.copy(xt)),r.name==="Y"&&(xt.setFromAxisAngle(fi,Math.atan2(ft.x,ft.z)),xt.multiplyQuaternions(va,xt),r.quaternion.copy(xt)),r.name==="Z"&&(xt.setFromAxisAngle(_s,Math.atan2(ft.y,ft.x)),xt.multiplyQuaternions(va,xt),r.quaternion.copy(xt))),r.visible=r.visible&&(r.name.indexOf("X")===-1||this.showX),r.visible=r.visible&&(r.name.indexOf("Y")===-1||this.showY),r.visible=r.visible&&(r.name.indexOf("Z")===-1||this.showZ),r.visible=r.visible&&(r.name.indexOf("E")===-1||this.showX&&this.showY&&this.showZ),r.material._color=r.material._color||r.material.color.clone(),r.material._opacity=r.material._opacity||r.material.opacity,r.material.color.copy(r.material._color),r.material.opacity=r.material._opacity,this.enabled&&this.axis&&(r.name===this.axis?(r.material.color.copy(this.materialLib.active.color),r.material.opacity=1):this.axis.split("").some(function(l){return r.name===l})&&(r.material.color.copy(this.materialLib.active.color),r.material.opacity=1))}super.updateMatrixWorld(e)}}class Sv extends be{constructor(){super(new Ns(1e5,1e5,2,2),new Oa({visible:!1,wireframe:!0,side:fn,transparent:!0,opacity:.1,toneMapped:!1})),this.isTransformControlsPlane=!0,this.type="TransformControlsPlane"}updateMatrixWorld(e){let t=this.space;switch(this.position.copy(this.worldPosition),this.mode==="scale"&&(t="local"),xa.copy(gs).applyQuaternion(t==="local"?this.worldQuaternion:Ta),ds.copy(fi).applyQuaternion(t==="local"?this.worldQuaternion:Ta),us.copy(_s).applyQuaternion(t==="local"?this.worldQuaternion:Ta),ft.copy(ds),this.mode){case"translate":case"scale":switch(this.axis){case"X":ft.copy(this.eye).cross(xa),yn.copy(xa).cross(ft);break;case"Y":ft.copy(this.eye).cross(ds),yn.copy(ds).cross(ft);break;case"Z":ft.copy(this.eye).cross(us),yn.copy(us).cross(ft);break;case"XY":yn.copy(us);break;case"YZ":yn.copy(xa);break;case"XZ":ft.copy(us),yn.copy(ds);break;case"XYZ":case"E":yn.set(0,0,0);break}break;case"rotate":default:yn.set(0,0,0)}yn.length()===0?this.quaternion.copy(this.cameraQuaternion):(fc.lookAt(Vt.set(0,0,0),yn,ft),this.quaternion.setFromRotationMatrix(fc)),super.updateMatrixWorld(e)}}function mc(n,e,t){var s,a;if(n.dimension==="2d"&&e===2)return 0;if(n.mesh_type==="explicit"&&((s=n.mesh_coordinates)!=null&&s[e])){const r=n.mesh_coordinates[e];let o=0,l=r.length-1;for(;l-o>1;){const c=o+l>>1;r[c]<t?o=c:l=c}return Math.abs(r[o]-t)<=Math.abs(r[l]-t)?r[o]:r[l]}const i=((a=n.mesh_steps)==null?void 0:a[e])??n.mesh;return Math.round(t/i)*i}function Ev(n,e,t){var r,o,l;if(n.dimension==="2d"&&e===2)return 0;const i=(r=n.boundaries)==null?void 0:r["xyz"[e]+"_"+t];if(i&&i.kind!=="pml")return 0;const s=(i==null?void 0:i.layers)??n.pml_cells,a=(o=n.mesh_coordinates)==null?void 0:o[e];return n.mesh_type==="explicit"&&a?t==="min"?a[s]-a[0]:a.at(-1)-a.at(-s-1):s*(((l=n.mesh_steps)==null?void 0:l[e])??n.mesh)}function wv(n,e,t,i){n.mesh_type??(n.mesh_type="uniform"),n.material_sampling??(n.material_sampling="cell"),n.interface_method??(n.interface_method="staircase"),n.subpixel_quadrature??(n.subpixel_quadrature=8),n.mesh_max??(n.mesh_max=.15),n.mesh_grading??(n.mesh_grading=1.25),n.mesh_ppw??(n.mesh_ppw=24),n.mesh_auto_refine??(n.mesh_auto_refine=!0),n.mesh_refinements??(n.mesh_refinements=[]);const s=n.mesh_type==="graded",a=n.mesh_type==="explicit",r=!!n.mesh_steps;return t("mesh type","mesh_type",n.mesh_type,[["uniform","Uniform"],["graded","Graded · local refinement"],...a?[["explicit","Explicit node arrays"]]:[]])+(a?'<p class="property-help">Frozen node arrays. Geometry edits keep these nodes. Edit the arrays or select a generated mesh to change the grid.</p>':`<label class="enabled-row"><input type="checkbox" data-axis-steps ${r?"checked":""}> Independent axis spacing</label>`+(r?n.mesh_steps.map((o,l)=>e("d"+"xyz"[l],`mesh_steps.${l}`,o,"µm",{min:.001})).join(""):e(s?"fine mesh step":"dx = dy = dz","mesh",n.mesh,"µm",{min:.001})))+t("interface method","interface_method",n.interface_method,[["staircase","Staircase"],["subpixel","Subpixel · experimental dielectric"]])+t("interface sampling","material_sampling",n.material_sampling,s||a||r||n.interface_method==="subpixel"?[["yee","Yee component locations"]]:[["cell","Cell centers (legacy)"],["yee","Yee component locations"]])+(n.interface_method==="subpixel"?e("face quadrature order","subpixel_quadrature",n.subpixel_quadrature,"",{min:2,max:32,step:1})+'<p class="property-help">Lossless dielectrics and constant spacing on each axis only. Compare quadrature orders and mesh refinement. Curved-interface accuracy is under validation, especially at high index contrast.</p>':"")+`<label class="enabled-row"><input type="checkbox" data-fixed-dt ${n.time_step_override?"checked":""}> Set a smaller fixed time step</label>`+(n.time_step_override?e("time step","time_step_override",n.time_step_override*1e15,"fs",{min:1e-6,scale:1e-15}):"")+(s?e("maximum step","mesh_max",n.mesh_max,"µm",{min:n.mesh})+e("grading factor","mesh_grading",n.mesh_grading,"",{min:1.05})+e("background cells / λ","mesh_ppw",n.mesh_ppw,"",{min:6})+`<label class="enabled-row"><input type="checkbox" data-path="mesh_auto_refine" ${n.mesh_auto_refine?"checked":""}> Refine structures, sources and monitors</label><p class="property-help">Fine spacing is retained in refinement regions and PML. The wavelength setting caps the background step. The timestep stays fixed by the fine spacing.</p>`+n.mesh_refinements.map((o,l)=>`<details class="boundary-options"><summary>${i(o.name)}</summary><label class="enabled-row"><input type="checkbox" data-path="mesh_refinements.${l}.enabled" ${o.enabled?"checked":""}> Enabled</label>${o.center.map((c,d)=>e("xyz"[d],`mesh_refinements.${l}.center.${d}`,c,"µm")).join("")}${o.size.map((c,d)=>e("xyz"[d]+" span",`mesh_refinements.${l}.size.${d}`,c,"µm",{min:.001})).join("")}<button data-action="mesh-remove" data-index="${l}">Remove refinement</button></details>`).join("")+'<button data-action="mesh-add">+ Add refinement region</button><button data-action="mesh-freeze">Freeze automatic refinements</button>':"")+`<button data-action="mesh-nodes">Edit explicit node arrays</button><button data-action="mesh-preview">Preview simulation mesh</button><p class="property-help">Yee sampling places materials at each electric field component. ${n.interface_method==="subpixel"?"Subpixel also couples neighboring components across interfaces. The permittivity image shows only the reciprocal diagonal of that operator.":"Staircase interfaces follow the grid."} Test mesh convergence for the required accuracy.</p>`}function Tv({state:n,api:e,esc:t,commit:i}){const s=document.createElement("dialog");s.className="mesh-dialog",document.body.append(s);let a,r="xy";const o=c=>s.querySelector(c);function l(){const c=o("canvas"),d=c.getContext("2d");c.width=1e3,c.height=600;const[u,h]=[...r].map(y=>"xyz".indexOf(y)),m=a.nodes_um,_=m[u],x=m[h],f=_.at(-1)-_[0],p=x.at(-1)-x[0],M=Math.min(880/f,480/p),v=(1e3-f*M)/2,g=(600-p*M)/2,w=y=>v+(y-_[0])*M,A=y=>g+(x.at(-1)-y)*M;d.fillStyle="#101c2b",d.fillRect(0,0,1e3,600);for(const y of a.refinements)d.fillStyle="rgba(71,191,169,.13)",d.fillRect(w(y.center[u]-y.size[u]/2),A(y.center[h]+y.size[h]/2),y.size[u]*M,y.size[h]*M);d.save(),d.beginPath(),d.rect(v,g,f*M,p*M),d.clip(),d.strokeStyle="#7087a56e",d.lineWidth=.7,d.beginPath();for(const y of _)d.moveTo(w(y),g),d.lineTo(w(y),g+p*M);for(const y of x)d.moveTo(v,A(y)),d.lineTo(v+f*M,A(y));d.stroke();for(const y of a.structures)d.strokeStyle="#ecb86a",d.lineWidth=2,d.strokeRect(w(y.center[u]-y.size[u]/2),A(y.center[h]+y.size[h]/2),y.size[u]*M,y.size[h]*M);d.restore(),d.fillStyle="#d9e7f5",d.font="15px system-ui",d.textAlign="center",d.fillText(`${r[0]} (µm) · ${_[0].toPrecision(4)} … ${_.at(-1).toPrecision(4)}`,500,585),d.save(),d.translate(20,300),d.rotate(-Math.PI/2),d.fillText(`${r[1]} (µm) · ${x[0].toPrecision(4)} … ${x.at(-1).toPrecision(4)}`,0,0),d.restore()}return{async open(){a=await e("/mesh/preview",n.project);const c=a.summary;s.innerHTML=`<div class="fsp-heading"><h2>Simulation mesh</h2><button data-dismiss>Close</button></div><div class="mesh-metrics"><strong>${c.shape.join(" × ")} cells</strong><span>${c.cell_reduction_percent.toFixed(1)}% fewer cells than uniform</span><span>~${c.estimated_memory_mb} MB · Δt ${c.dt_fs.toFixed(4)} fs</span></div><label>Projection <select aria-label="Mesh projection">${(n.project.region.dimension==="2d"?["xy"]:["xy","xz","yz"]).map(d=>`<option>${d}</option>`).join("")}</select></label><canvas aria-label="Simulation mesh grid"></canvas><p>Gold: structure bounds. Green: refinement bounds projected onto this view. Grid lines show actual cell boundaries${a.preview_decimated?" (preview decimated to 1,000 lines per axis)":""}. Refinements extend across coordinate planes.</p><p>Step range: ${c.axis_min_step_um.map((d,u)=>`${"xyz"[u]} ${d.toPrecision(4)}–${c.axis_max_step_um[u].toPrecision(4)} µm`).join(" · ")}. Largest adjacent ratio: ${c.max_adjacent_ratio.toFixed(3)}.</p>`,r="xy",o("[data-dismiss]").onclick=()=>s.close(),o("select").onchange=d=>{r=d.target.value,l()},s.showModal(),l()},async freeze(){const c=await e("/mesh/freeze",n.project);i(c)},async editNodes(){const{nodes_um:c}=await e("/mesh/coordinates",n.project);s.innerHTML='<div class="fsp-heading"><h2>Explicit mesh nodes</h2><button data-dismiss>Close</button></div><p>Coordinates in µm. Each axis must increase strictly and be centered on zero. Array endpoints set the domain spans. In 2D, z needs exactly two endpoints. Changing geometry will keep this grid.</p>'+c.map((d,u)=>`<label>${"xyz"[u]} nodes (µm)<textarea aria-label="${"xyz"[u]} mesh nodes" data-node-axis="${u}" rows="5" style="width:100%">${d.join(", ")}</textarea></label>`).join("")+'<p data-node-error role="alert"></p><button data-apply-nodes>Apply node arrays</button>',o("[data-dismiss]").onclick=()=>s.close(),o("[data-apply-nodes]").onclick=async()=>{try{const d=[...s.querySelectorAll("[data-node-axis]")].map(m=>m.value.trim().split(/[\s,]+/).filter(Boolean).map(Number));if(d.some(m=>m.length<2||m.some(_=>!Number.isFinite(_))))throw Error("Enter at least two finite numbers for each axis.");const u=structuredClone(n.project);Object.assign(u.region,{mesh_type:"explicit",mesh_steps:null,mesh_coordinates:d,size:d.map(m=>m.at(-1)-m[0]),material_sampling:"yee",mesh_auto_refine:!1});const h=await e("/validate",u);i(h.project),s.close()}catch(d){o("[data-node-error]").textContent=d.message}},s.showModal()},add(){const c=structuredClone(n.project);c.region.mesh_refinements.push({name:`Refinement ${c.region.mesh_refinements.length+1}`,center:[0,0,0],size:[1,1,1],enabled:!0}),i(c)},remove(c){const d=structuredClone(n.project);d.region.mesh_refinements.splice(c,1),i(d)}}}function ka(n){return n.rotation??(n.rotation=0),n.rotation_axes??(n.rotation_axes=["z","x","y"]),n.rotation_angles??(n.rotation_angles=[0,0,0]),n.make_ellipsoid??(n.make_ellipsoid=!1),n.radius_2??(n.radius_2=.5),n.radius_3??(n.radius_3=.5),n.inner_radius_2??(n.inner_radius_2=.3),n.theta_start??(n.theta_start=0),n.theta_stop??(n.theta_stop=360),n.vertices??(n.vertices=[[-.5,-.5],[.5,-.5],[0,.5]]),n}function Av(n){const e=new dt().makeRotationZ((n.rotation||0)*Math.PI/180);return(n.rotation_axes||["z","x","y"]).forEach((t,i)=>{var a;if(t==="none")return;const s=new D;s.setComponent("xyz".indexOf(t),1),e.premultiply(new dt().makeRotationAxis(s,(((a=n.rotation_angles)==null?void 0:a[i])||0)*Math.PI/180))}),e}function Cv(n){const e=n.radius,t=n.make_ellipsoid?n.radius_2:e,i=n.make_ellipsoid?n.radius_3:e;if(n.kind==="rectangle")return new St(...n.size);if(n.kind==="sphere")return new Fs(1,48,32).scale(e,t,i);if(n.kind==="circle")return new Ot(1,1,n.size[2],96).rotateX(Math.PI/2).scale(e,t,1);let s;if(n.kind==="polygon")s=new Ea(n.vertices.map(a=>new oe(...a)));else if(n.kind==="ring"){const a=(n.theta_stop??360)-(n.theta_start??0),r=(a%360+360)%360||360,o=r===360,l=Math.max(3,Math.ceil(96*r/360)),c=(h,m)=>Array.from({length:o?l:l+1},(_,x)=>{const f=((n.theta_start??0)+r*x/l)*Math.PI/180,p=Math.cos(f),M=Math.sin(f),v=1/Math.sqrt((p/h)**2+(M/m)**2);return new oe(v*p,v*M)}),d=c(e,t),u=n.inner_radius>0?c(n.inner_radius,n.make_ellipsoid?n.inner_radius_2:n.inner_radius):[];o?(s=new Ea(d),u.length&&s.holes.push(new Mo(u.reverse()))):s=new Ea([...d,...u.length?u.reverse():[new oe(0,0)]])}if(!s)throw Error("Unsupported CAD solid: "+n.kind);return new Ho(s,{depth:n.size[2],steps:1,bevelEnabled:!1}).translate(0,0,-n.size[2]/2)}const hi=new Map;function fd(n){ka(n);const e=JSON.stringify([n.kind,n.size,n.radius,n.inner_radius,n.make_ellipsoid,n.radius_2,n.radius_3,n.inner_radius_2,n.theta_start,n.theta_stop,n.vertices,n.rotation,n.rotation_axes,n.rotation_angles]);if(hi.has(e))return hi.get(e);const t=Cv(n).applyMatrix4(Av(n)),i=t.index?t.toNonIndexed():t.clone(),s=new yo(t,20),a={geometry:t,points:Array.from(i.attributes.position.array),edges:Array.from(s.attributes.position.array),projections:{}};if(i.dispose(),s.dispose(),hi.set(e,a),hi.size>128){const r=hi.keys().next().value;hi.get(r).geometry.dispose(),hi.delete(r)}return a}function Rv(n){return fd(n).geometry.clone()}function md(n,e){const t=fd(n),i=e.join("");if(t.projections[i])return t.projections[i];const s=[],a=[];let r=1/0,o=-1/0;for(let l=0;l<t.points.length;l+=9){const c=[0,3,6].map(u=>[t.points[l+u+e[0]],t.points[l+u+e[1]]]),d=(c[1][0]-c[0][0])*(c[2][1]-c[0][1])-(c[1][1]-c[0][1])*(c[2][0]-c[0][0]);if(!(Math.abs(d)<1e-18)){d<0&&([c[1],c[2]]=[c[2],c[1]]),s.push(c);for(const u of c)r=Math.min(r,u[1]),o=Math.max(o,u[1])}}for(let l=0;l<t.edges.length;l+=6)a.push([0,3].map(c=>[t.edges[l+c+e[0]],t.edges[l+c+e[1]]]));return t.projections[i]={triangles:s,edges:a,low:r,high:o}}function Pv(n,e,t,i){const s=[e[0]-n.center[t[0]],e[1]-n.center[t[1]]],a=md(n,t);return a.triangles.some(r=>r.every((o,l)=>{const c=r[(l+1)%3];return(c[0]-o[0])*(s[1]-o[1])-(c[1]-o[1])*(s[0]-o[0])>=-1e-12}))?!0:a.edges.some(([r,o])=>{const l=o[0]-r[0],c=o[1]-r[1],d=l*l+c*c,u=d?Math.max(0,Math.min(1,((s[0]-r[0])*l+(s[1]-r[1])*c)/d)):0;return Math.hypot(s[0]-r[0]-u*l,s[1]-r[1]-u*c)<=i})}function Lv(n,e){ka(n);let t="";return["circle","sphere","ring"].includes(n.kind)&&(t+=`<label class="enabled-row"><input type="checkbox" data-path="make_ellipsoid" ${n.make_ellipsoid?"checked":""}> Elliptical radii</label>`,n.make_ellipsoid&&(t+=e("radius 2","radius_2",n.radius_2,"µm",{min:.001})+(n.kind==="sphere"?e("radius 3","radius_3",n.radius_3,"µm",{min:.001}):"")+(n.kind==="ring"?e("inner radius 2","inner_radius_2",n.inner_radius_2,"µm",{min:0}):""))),n.kind==="ring"&&(t+=e("theta start","theta_start",n.theta_start,"deg")+e("theta stop","theta_stop",n.theta_stop,"deg")+'<p class="property-help">Counterclockwise arc in the local XY plane, wrapping through 360°. Angles are polar angles even for elliptical rings.</p>'),n.kind==="polygon"&&(t+=`<button data-action="geometry-vertices">Edit polygon vertices</button><p class="property-help">${n.vertices.length} local XY vertices, extruded along local z. One simple contour without holes.</p>`),t}function Dv(n,e,t){return ka(n),e("z rotation","rotation",n.rotation,"deg")+n.rotation_axes.map((i,s)=>t(["first","second","third"][s]+" axis",`rotation_axes.${s}`,i,["none","x","y","z"])+e("rotation "+(s+1),`rotation_angles.${s}`,n.rotation_angles[s],"deg")).join("")+'<p class="property-help">Right-handed rotations about fixed world axes. Apply the legacy z angle, then rotations 1, 2 and 3 about the object center. CAD views show projections. A 2D calculation samples z = 0.</p>'}function Iv({state:n,api:e,esc:t,commit:i}){const s=document.createElement("dialog");return s.className="geometry-dialog",document.body.append(s),{open(a){const r=n.project.structures.find(o=>o.id===a);!r||r.kind!=="polygon"||(s.innerHTML=`<div class="fsp-heading"><h2>Polygon vertices</h2><button data-dismiss>Close</button></div><p>Local x, y pairs in µm, one pair per line. Clockwise or counterclockwise. Do not repeat the first vertex.</p><textarea aria-label="Polygon vertices" rows="12" style="width:100%;font-family:monospace">${t(r.vertices.map(o=>o.join(", ")).join(`
`))}</textarea><p role="alert"></p><button data-apply>Apply vertices</button>`,s.querySelector("[data-dismiss]").onclick=()=>s.close(),s.querySelector("[data-apply]").onclick=async()=>{try{const o=s.querySelector("textarea").value.trim().split(/\r?\n/).map(d=>d.trim().split(/[\s,]+/).map(Number));if(o.some(d=>d.length!==2||d.some(u=>!Number.isFinite(u))))throw Error("Each row needs two finite numbers.");const l=structuredClone(n.project);l.structures.find(d=>d.id===a).vertices=o;const c=await e("/validate",l);i(c.project),s.close()}catch(o){s.querySelector('[role="alert"]').textContent=o.message}},s.showModal())}}}const Nn={region:"#d2a129",source:"#d44955",monitor:"#e3a72c",selected:"#187be7"};class Uv{constructor(e,t,i,s,a){this.state=t,this.select=i,this.change=s,this.edited=a,this.zoom={xy:1,xz:1,yz:1},this.canvases={},e.innerHTML=["xy","perspective","xz","yz"].map(r=>`<div class="viewport ${r}" data-view="${r}"><div class="view-label">${r==="perspective"?"Perspective":r.toUpperCase()+" plane"}<span>${r==="perspective"?"Orbit · left drag / Pan · right drag":"Select · drag to move / scroll to zoom"}</span></div>${r!=="perspective"?"<canvas></canvas>":'<div class="three-view"></div>'}</div>`).join("");for(const[r,o]of Object.entries({xy:[0,1],xz:[0,2],yz:[1,2]})){const l=e.querySelector(`.${r} canvas`);this.canvases[r]={canvas:l,axes:o},l.addEventListener("wheel",c=>{c.preventDefault(),this.zoom[r]=Math.max(.5,Math.min(8,this.zoom[r]*Math.exp(-c.deltaY*.001))),this.draw2d(r)},{passive:!1}),l.addEventListener("pointerdown",c=>this.down(c,r)),l.addEventListener("pointermove",c=>this.move(c,r)),l.addEventListener("pointerup",c=>this.up(c,r)),l.addEventListener("dblclick",()=>{var c;return(c=document.querySelector("#properties input"))==null?void 0:c.focus()})}this.initThree(e.querySelector(".three-view")),this.resizeObserver=new ResizeObserver(()=>this.render()),this.resizeObserver.observe(e)}objects(){const e=this.state.project;return[...e.structures.map(t=>({...t,category:"structure"})),...e.sources.map(t=>({...t,category:"source"})),...e.monitors.map(t=>({...t,category:"monitor"}))]}bounds(e){return e.kind==="sphere"?[e.radius*2,e.radius*2,e.radius*2]:["circle","ring"].includes(e.kind)?[e.radius*2,e.radius*2,e.size[2]]:e.size||[.12,.12,.12]}metrics(e){const{canvas:t,axes:i}=this.canvases[e],s=t.getBoundingClientRect(),a=this.state.project.region.size;return{w:s.width,h:s.height,scale:Math.min((s.width-65)/a[i[0]],(s.height-50)/a[i[1]])*.84*this.zoom[e],axes:i}}world(e,t){const{canvas:i}=this.canvases[t],s=i.getBoundingClientRect(),a=this.metrics(t);return[(e.clientX-s.left-a.w/2)/a.scale,-(e.clientY-s.top-a.h/2)/a.scale]}hit(e,t,i,s){if(e.category==="structure")return Pv(e,t,i,s);const a=this.bounds(e);let r=t[0]-e.center[i[0]],o=t[1]-e.center[i[1]];if(i[0]===0&&i[1]===1&&e.category==="structure"){if(["circle","sphere","ring"].includes(e.kind)){const c=Math.hypot(r,o);return c<=e.radius+s&&(e.kind!=="ring"||c>=e.inner_radius-s)}const l=(e.rotation||0)*Math.PI/180;[r,o]=[Math.cos(l)*r+Math.sin(l)*o,-Math.sin(l)*r+Math.cos(l)*o]}return Math.abs(r)<=Math.max(a[i[0]]/2,s)&&Math.abs(o)<=Math.max(a[i[1]]/2,s)}down(e,t){if(e.button!==0)return;const i=this.metrics(t),s=this.world(e,t),r=this.objects().filter(o=>o.enabled).reverse().find(o=>this.hit(o,s,i.axes,7/i.scale));this.select((r==null?void 0:r.id)||"fdtd"),r&&this.state.mode==="layout"&&(this.drag={id:r.id,start:s,center:[...r.center],axes:i.axes,name:t,moved:!1},e.target.setPointerCapture(e.pointerId))}move(e,t){if(!this.drag||this.drag.name!==t)return;const i=this.world(e,t),s=this.drag,a=this.state.project,r=[...s.center];s.axes.forEach((o,l)=>{if(o===2&&a.region.dimension==="2d")return;const c=s.center[o]+i[l]-s.start[l];r[o]=this.state.snap?mc(a.region,o,c):c}),!(!s.moved&&Math.hypot(i[0]-s.start[0],i[1]-s.start[1])<.02)&&(s.moved||this.edited(),s.moved=!0,this.change(s.id,{center:r},!1),this.render())}up(){var e;(e=this.drag)!=null&&e.moved&&this.change(this.drag.id,{},!0),this.drag=null}draw2d(e){const{canvas:t,axes:i}=this.canvases[e],s=this.metrics(e),a=this.state.project;if(s.w<1||s.h<1)return;const r=window.devicePixelRatio||1;t.width=s.w*r,t.height=s.h*r;const o=t.getContext("2d");o.scale(r,r),o.fillStyle="#fafbfd",o.fillRect(0,0,s.w,s.h);const l=y=>s.w/2+y*s.scale,c=y=>s.h/2-y*s.scale,d=45/s.scale,u=10**Math.floor(Math.log10(d)),h=[1,2,5,10].find(y=>y*u>=d)*u,m=Math.max(0,-Math.floor(Math.log10(h)));o.font="10px ui-monospace, monospace",o.textAlign="center";for(let y=0;y<2;y++){const E=(y===0?s.w:s.h)/s.scale;for(let S=Math.ceil(-E/2/h)*h;S<=E/2;S+=h){const b=y===0?l(S):c(S);o.strokeStyle=Math.abs(S)<1e-7?"#bac8d8":"#e6ebf2",o.lineWidth=1,o.beginPath(),y===0?(o.moveTo(b,0),o.lineTo(b,s.h),o.fillStyle="#8b98a9",o.fillText(S.toFixed(m),b,s.h-9)):(o.moveTo(0,b),o.lineTo(s.w,b),o.fillStyle="#8b98a9",o.fillText(S.toFixed(m),18,b-4)),o.stroke()}}const _=a.region.size[i[0]]*s.scale,x=a.region.size[i[1]]*s.scale,f=s.w/2-_/2,p=s.h/2-x/2;o.fillStyle="#f0c85612",o.fillRect(f,p,_,x),o.strokeStyle=Nn.region,o.setLineDash([6,4]),o.strokeRect(f,p,_,x),o.setLineDash([]);const M=(y,E)=>Ev(a.region,y,E)*s.scale,v=M(i[0],"min"),g=M(i[0],"max"),w=M(i[1],"min"),A=M(i[1],"max");o.fillStyle="#d8ae3d12",o.fillRect(f,p,_,A),o.fillRect(f,p+x-w,_,w),o.fillRect(f,p,v,x),o.fillRect(f+_-g,p,g,x);for(const y of this.objects()){if(!y.enabled)continue;const E=this.bounds(y),S=l(y.center[i[0]]),b=c(y.center[i[1]]),R=Math.max(E[i[0]]*s.scale,3),I=Math.max(E[i[1]]*s.scale,3),L=y.id===this.state.selected,z=a.materials.find(N=>N.name===y.material);if(o.save(),o.translate(S,b),o.strokeStyle=L?Nn.selected:y.category==="source"?Nn.source:y.category==="monitor"?Nn.monitor:(z==null?void 0:z.color)||"#69a1e8",o.lineWidth=L?2:1.5,o.fillStyle=y.kind==="tfsf"?"#3ba89710":y.category==="structure"?((z==null?void 0:z.color)||"#69a1e8")+"55":"#ffffff88",o.beginPath(),y.kind==="tfsf"&&o.setLineDash([5,3]),y.category==="structure"){const N=md(y,i);for(const F of N.triangles){o.moveTo(F[0][0]*s.scale,-F[0][1]*s.scale);for(const B of F.slice(1))o.lineTo(B[0]*s.scale,-B[1]*s.scale);o.closePath()}o.fill(),o.beginPath();for(const[F,B]of N.edges)o.moveTo(F[0]*s.scale,-F[1]*s.scale),o.lineTo(B[0]*s.scale,-B[1]*s.scale);o.stroke(),L&&(o.fillStyle=Nn.selected,o.font="11px Inter,Segoe UI,sans-serif",o.fillText(y.name,0,-N.high*s.scale-9))}else y.category==="monitor"&&y.kind!=="field"?(o.moveTo(-7,0),o.lineTo(7,0),o.moveTo(0,-7),o.lineTo(0,7),o.stroke(),o.beginPath(),o.arc(0,0,4,0,2*Math.PI),o.stroke()):y.category==="source"&&y.kind==="point"?(o.arc(0,0,5,0,2*Math.PI),o.fillStyle=Nn.source,o.fill(),o.stroke()):(e==="xy"&&["circle","ring"].includes(y.kind)||y.kind==="sphere"?(o.ellipse(0,0,R/2,I/2,0,0,Math.PI*2),y.kind==="ring"&&o.ellipse(0,0,y.inner_radius*s.scale,y.inner_radius*s.scale,0,0,Math.PI*2,!0)):o.rect(-R/2,-I/2,R,I),o.fill("evenodd"),o.stroke());L&&y.category!=="structure"&&(o.fillStyle="#187be7",o.font="11px Inter,Segoe UI,sans-serif",o.fillText(y.name,0,-I/2-9)),o.restore()}o.fillStyle="#617187",o.textAlign="right",o.font="10px Segoe UI",o.fillText(`${"xyz"[i[0]]} / ${"xyz"[i[1]]} (µm)`,s.w-10,s.h-9),a.region.dimension==="2d"&&e!=="xy"&&(o.fillStyle="#8591a2",o.textAlign="left",o.fillText("2D: simulation at z = 0",10,18))}initThree(e){this.host=e,this.scene=new Eh,this.scene.background=new Xe("#f3f6fa"),this.camera=new cn(40,1,.01,1e3),this.camera.up.set(0,0,1),this.camera.position.set(10,-12,10),this.renderer=new ev({antialias:!0}),this.renderer.setPixelRatio(Math.min(devicePixelRatio,2)),e.appendChild(this.renderer.domElement),this.orbit=new nv(this.camera,this.renderer.domElement),this.orbit.enableDamping=!0,this.scene.add(new dp(16777215,10728907,2.5));const t=new pp(16777215,2);t.position.set(5,-3,8),this.scene.add(t),this.scene.add(new gp(1.5)),this.group=new ps,this.scene.add(this.group),this.transform=new mv(this.camera,this.renderer.domElement),this.scene.add(this.transform.getHelper()),this.transform.addEventListener("dragging-changed",a=>{this.orbit.enabled=!a.value,a.value?this.edited():this.transform.object&&this.change(this.transform.object.userData.id,{},!0)}),this.transform.addEventListener("objectChange",()=>{const a=this.transform.object;if(!a)return;let r=a.position.toArray();this.state.snap&&(r=r.map((o,l)=>mc(this.state.project.region,l,o))),this.change(a.userData.id,{center:r},!1);for(const o of Object.keys(this.canvases))this.draw2d(o)});let i;this.renderer.domElement.addEventListener("pointerdown",a=>{i=[a.clientX,a.clientY]}),this.renderer.domElement.addEventListener("pointerup",a=>{if(!i||Math.hypot(a.clientX-i[0],a.clientY-i[1])>4||this.transform.axis)return;const r=e.getBoundingClientRect(),o=new rd;o.setFromCamera(new oe((a.clientX-r.left)/r.width*2-1,-(a.clientY-r.top)/r.height*2+1),this.camera);const l=o.intersectObjects(this.group.children,!0).find(c=>c.object.userData.id);l&&this.select(l.object.userData.id)});const s=()=>{requestAnimationFrame(s),this.orbit.update(),this.renderer.render(this.scene,this.camera)};s()}renderThree(){var r;if(this.transform.dragging)return;this.transform.detach(),this.group.traverse(o=>{var l;if((l=o.geometry)==null||l.dispose(),o.material)for(const c of Array.isArray(o.material)?o.material:[o.material])c.dispose()}),this.group.clear();const e=this.state.project,t=new Da(new yo(new St(...e.region.size)),new Ki({color:Nn.region}));this.group.add(t);const i=new mp(Math.max(...e.region.size)*1.4,20,"#b7c5d5","#dfe6ee");i.rotateX(Math.PI/2),i.position.z=-e.region.size[2]/2,this.group.add(i);for(const o of this.objects()){if(!o.enabled)continue;let l;o.category==="structure"?l=Rv(o):o.category==="monitor"&&o.kind!=="field"||o.kind==="point"?l=new Fs(.07,12,8):l=new St(...(o.size||[.1,.1,.1]).map(u=>Math.max(u,.02)));const c=o.category==="source"?Nn.source:o.category==="monitor"?Nn.monitor:((r=e.materials.find(u=>u.name===o.material))==null?void 0:r.color)||"#69a1e8",d=new be(l,new op({color:c,transparent:!0,opacity:o.kind==="tfsf"?.08:o.category==="structure"?.66:.9,roughness:.5,metalness:.08,side:fn}));d.position.fromArray(o.center),d.userData.id=o.id,d.add(new Da(new yo(l),new Ki({color:o.id===this.state.selected?"#147be7":c,transparent:!0,opacity:.7}))),this.group.add(d),o.id===this.state.selected&&this.state.mode==="layout"&&(this.transform.attach(d),this.transform.showZ=e.region.dimension!=="2d",this.transform.setTranslationSnap(this.state.snap&&!e.region.mesh_steps&&e.region.mesh_type!=="explicit"?e.region.mesh:null))}const{width:s,height:a}=this.host.getBoundingClientRect();s>0&&a>0&&(this.camera.aspect=s/a,this.camera.updateProjectionMatrix(),this.renderer.setSize(s,a))}fit(){this.zoom={xy:1,xz:1,yz:1};const e=Math.max(...this.state.project.region.size);this.camera.position.set(e*1.15,-e*1.4,e*1.05),this.orbit.target.set(0,0,0),this.render()}render(){for(const e of Object.keys(this.canvases))this.draw2d(e);this.renderThree()}}function Nv(n,e,t,i,s=null,a="reduced field"){const r=n.getBoundingClientRect(),o=devicePixelRatio||1;n.width=r.width*o,n.height=r.height*o;const l=n.getContext("2d");if(l.scale(o,o),l.fillStyle="#f8fafc",l.fillRect(0,0,r.width,r.height),!(e!=null&&e.length)){l.fillStyle="#718196",l.font="14px Segoe UI",l.textAlign="center",l.fillText("Run a simulation to visualize the field",r.width/2,r.height/2);return}const c=e.length,d=e[0].length,u=document.createElement("canvas");u.width=c,u.height=d;const h=u.getContext("2d"),m=h.createImageData(c,d);let _=s||Math.max(...e.flat().map(Math.abs),1e-20);for(let g=0;g<c;g++)for(let w=0;w<d;w++){const A=Math.max(-1,Math.min(1,e[g][w]/_)),y=((d-1-w)*c+g)*4;m.data[y]=A>0?250:Math.round(246+A*210),m.data[y+1]=Math.round(248-Math.abs(A)*184),m.data[y+2]=A<0?250:Math.round(248-A*207),m.data[y+3]=255}h.putImageData(m,0,0);const x=Math.min((r.width-110)/t[0],(r.height-80)/t[1]),f=t[0]*x,p=t[1]*x,M=(r.width-f)/2,v=(r.height-p)/2;l.imageSmoothingEnabled=!1,l.drawImage(u,M,v,f,p),l.strokeStyle="#c4cfdb",l.strokeRect(M,v,f,p),l.fillStyle="#607086",l.font="11px ui-monospace,monospace",l.textAlign="center",l.fillText(`${-t[0]/2}`,M,v+p+18),l.fillText("0",M+f/2,v+p+18),l.fillText(`${t[0]/2} µm`,M+f,v+p+18),l.textAlign="right",l.fillText(`${t[1]/2}`,M-8,v+8),l.fillText(`${-t[1]/2}`,M-8,v+p),l.textAlign="left",l.fillText(`${i} · ±${_.toExponential(2)} (${a})`,M,v-13)}function Os(n,e,t=!1,i=!1){const s=n.getBoundingClientRect(),a=devicePixelRatio||1;n.width=s.width*a,n.height=s.height*a;const r=n.getContext("2d");if(r.scale(a,a),r.clearRect(0,0,s.width,s.height),!(e!=null&&e.length)){r.fillStyle="#8491a2",r.font="12px Segoe UI",r.fillText("Point monitor signals appear after a run.",30,35);return}const o=g=>t?i?g.wavelength_um:g.frequency_thz:g.time_fs,l=s.width-75,c=s.height-48,d=55,u=15,h=e.flatMap(g=>t?g.spectrum:g.signal),m=e.flatMap(o),_=h.reduce((g,w)=>Number.isFinite(w)?Math.max(g,Math.abs(w)):g,0)||1,x=t?m.reduce((g,w)=>Math.min(g,w),1/0):0,f=m.reduce((g,w)=>Math.max(g,w),x+1e-6),p=t&&!e.some(g=>g.signed)?0:-_;r.strokeStyle="#e0e6ed",r.font="10px monospace",r.fillStyle="#738197";for(let g=0;g<=4;g++){const w=u+g*c/4;r.beginPath(),r.moveTo(d,w),r.lineTo(d+l,w),r.stroke(),r.fillText((_-(_-p)*g/4).toExponential(1),2,w+3),r.fillText((x+(f-x)*g/4).toFixed(i&&t?2:0),d+l*g/4-7,u+c+17)}e.forEach((g,w)=>{const A=o(g),y=t?g.spectrum:g.signal;r.strokeStyle=["#237ddd","#e39127","#875adb","#22a184"][w%4],r.beginPath();let E=!1;A.forEach((S,b)=>{if(!Number.isFinite(y[b])){E=!1;return}const R=d+(S-x)/(f-x)*l,I=u+(_-y[b])/(_-p)*c;E?r.lineTo(R,I):r.moveTo(R,I),E=!0}),r.stroke(),A.length===1&&(r.beginPath(),r.arc(d,u+(_-y[0])/(_-p)*c,3,0,2*Math.PI),r.fillStyle=r.strokeStyle,r.fill()),r.fillStyle=r.strokeStyle,r.fillText(g.name,d+10+w*120,12),!t&&g.window&&(r.strokeStyle="#24a79b",r.setLineDash([3,3]),r.beginPath(),A.forEach((S,b)=>{const R=d+(S-x)/(f-x)*l,I=u+(1-g.window[b])*c/2;b?r.lineTo(R,I):r.moveTo(R,I)}),r.stroke(),r.setLineDash([]))});const M=e[0],v=M.spectrum_settings;r.fillStyle="#728296",r.textAlign="right",r.fillText(t?M.spectrum_label||`${i?"Wavelength (µm)":"Frequency (THz)"} · ${(v==null?void 0:v.apodization)||"hann"} · |${(v==null?void 0:v.sampling)==="fft"?"FFT":"DFT"}| (${M.spectrum_units||"reduced field"})`:M.time_label||`Time (fs) · real field${M.window?"; dashed: window (0–1)":""}`,s.width-20,s.height-3)}function Fv({esc:n,toast:e,log:t}){const i=document.createElement("dialog");i.id="fsp-dialog",document.body.append(i);const s=document.createElement("input");s.type="file",s.accept=".fsp",s.hidden=!0,document.body.append(s);let a=null,r="",o=!1,l="",c=new Map;async function d(g,w){const A=await fetch("/api/fsp"+g,w),y=await A.json();if(!A.ok)throw Error(typeof y.detail=="string"?y.detail:JSON.stringify(y.detail));return y}function u(){if(!(a!=null&&a.inspection))return[];const g=a.inspection;return[...g.objects.map(w=>({...w,editable:!0})),...Object.entries(g.globals).map(([w,A])=>({id:"Global "+w,...A})),...Object.entries(g.referenced_materials).map(([w,A])=>({id:"Material: "+w,...A}))]}function h(){return u().find(g=>g.id===r)}function m(g,w){return JSON.stringify([g,w])}function _(g){i.querySelector("#fsp-status").textContent=g}function x(){const g=a==null?void 0:a.inspection;i.innerHTML=`<div class="fsp-heading"><div><h2>FSP project inspector</h2><span>${n((a==null?void 0:a.filename)||"Open a Lumerical project")}</span></div><button data-fsp="close" aria-label="Close FSP inspector">Close</button></div>
   <p class="fsp-notice">Installed Lumerical bridge · <strong>Native GPU execution unavailable</strong><br>Original settings are retained. Values below use Lumerical SI units: metres, seconds and Hz. Edited exports clear saved simulation results.</p>
   <div class="fsp-toolbar"><button data-fsp="open" ${o?"disabled":""}>Open .fsp</button><button data-fsp="original" ${!g||o?"disabled":""}>Download original .fsp</button><button data-fsp="archive" ${!g||o?"disabled":""}>Preservation archive</button><button data-fsp="export" ${!c.size||o?"disabled":""}>Save edited .fsp <span id="fsp-patch-count">(${c.size})</span></button></div>
   <div id="fsp-status" role="status">${o?"Reading with Lumerical…":g?`${g.objects.length} objects · Lumerical ${n(g.bridge.vendor_version)} · ${c.size} pending edits`:"Select an FSP file. The GPU workstation reads it in a separate Lumerical session."}</div>
   <div class="fsp-body"><div id="fsp-tree">${u().map(w=>`<button data-fsp-object="${n(w.id)}" class="${r===w.id?"active":""}"><span>${n(w.id)}</span><small>${n(w.properties.type||"Settings")}</small></button>`).join("")}</div><section class="fsp-details"><input id="fsp-filter" placeholder="Filter properties (e.g. wavelength, pml, apodization)" aria-label="Filter FSP properties" value="${n(l)}"><div id="fsp-properties"></div></section></div>
   ${g?`<details class="fsp-diagnostics"><summary>Native compatibility: ${g.native_execution.issues.length} unresolved items</summary><ul>${g.native_execution.issues.map(w=>`<li><b>${n(w.object_id||"Project")}</b>: ${n(w.message)}</li>`).join("")}${g.read_diagnostics.map(w=>`<li>${n(w.object_id)}: ${n(w.message)}</li>`).join("")}</ul></details>`:""}`,f(),i.querySelector("#fsp-filter").oninput=w=>{l=w.target.value,f()}}function f(){const g=h(),w=i.querySelector("#fsp-properties");if(!g){w.innerHTML="<p>Select an object to inspect its complete property list.</p>";return}const A=Object.entries(g.properties).filter(([y])=>y.toLowerCase().includes(l.toLowerCase()));w.innerHTML=`<h3>${n(g.id)}</h3>${A.map(([y,E])=>{const S=c.get(m(g.id,y)),b=S?S.value:E,R=g.editable&&!["name","type","script","setup script","analysis script"].includes(y)&&["number","string","boolean"].includes(typeof b)&&!String(b).includes(`
`)&&String(b).length<2e3,I=typeof b=="object"?JSON.stringify(b,null,2):String(b);return`<label class="fsp-property ${S?"modified":""}"><span>${n(y)}</span>${R?`<input data-fsp-property="${n(y)}" aria-label="FSP ${n(y)}" type="${typeof b=="number"?"number":typeof b=="boolean"?"checkbox":"text"}" step="any" ${typeof b=="boolean"?b?"checked":"":`value="${n(I)}"`} ${o?"disabled":""}>`:`<pre>${n(I)}</pre>`}</label>`}).join("")}${Object.entries(g.read_errors||{}).map(([y,E])=>`<p class="error">${n(y)}: ${n(E)}</p>`).join("")}`,w.querySelectorAll("[data-fsp-property]").forEach(y=>y.onchange=()=>{const E=y.dataset.fspProperty,S=y.type==="number"?Number(y.value):y.type==="checkbox"?y.checked:y.value;if(y.type==="number"&&(!y.value||!Number.isFinite(S))){e("Enter a finite number."),f();return}S===g.properties[E]?c.delete(m(g.id,E)):c.set(m(g.id,E),{object_id:g.id,property:E,value:S}),y.closest("label").classList.toggle("modified",c.has(m(g.id,E))),i.querySelector("#fsp-patch-count").textContent=`(${c.size})`,i.querySelector('[data-fsp="export"]').disabled=!c.size||o,_(`${c.size} pending edits. Save edited .fsp verifies each saved value in Lumerical.`)})}async function p(g){for(;;){const w=await d("/"+g);if(_(w.status==="queued"?"Waiting for Lumerical bridge…":"Reading and verifying project settings…"),w.status==="failed")throw Error(w.error);if(w.status==="ready")return w;await new Promise(A=>setTimeout(A,700))}}function M(g){const w=document.createElement("a");w.href="/api/fsp/"+a.id+"/"+g,w.download="",w.click()}async function v(g){var w,A;if(!o){o=!0,c.clear(),l="",r="",a=null,x(),i.open||i.showModal();try{_("Uploading "+g.name+"…");const y=await d("/import",{method:"POST",headers:{"Content-Type":"application/octet-stream","X-Filename":encodeURIComponent(g.name)},body:g});a=await p(y.id),r=((w=a.inspection.objects.find(E=>E.properties.type==="FDTD"))==null?void 0:w.id)||((A=a.inspection.objects[0])==null?void 0:A.id),t("Inspected "+g.name+" through Lumerical. Native GPU execution of this FSP remains unavailable.")}catch(y){e(y.message),t("FSP: "+y.message,"error")}finally{o=!1,x()}}}return s.onchange=()=>{const g=s.files[0];s.value="",g&&v(g)},i.addEventListener("click",async g=>{const w=g.target.closest("button");if(!w||w.disabled)return;if(w.dataset.fspObject){r=w.dataset.fspObject,x();return}const A=w.dataset.fsp;if(A==="close"){i.close();return}if(A==="open"){s.click();return}if(A==="original"){M("download");return}if(A==="archive"){M("archive");return}if(A==="export"){o=!0,x();try{const y=await d("/"+a.id+"/export",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({patches:[...c.values()]})}),E=await p(y.id),S=document.createElement("a");S.href="/api/fsp/"+E.id+"/download",S.download="",S.click(),c.clear(),a=E,t("Saved "+E.filename+" and verified "+E.export_verification.patches.length+" property edits by reopening in Lumerical.")}catch(y){e(y.message),t("FSP export failed: "+y.message,"error")}finally{o=!1,x()}}}),{openFile:v,open(){x(),i.open||i.showModal()}}}function Ov({esc:n,toast:e,log:t,loadProject:i,getProject:s}){const a=document.createElement("dialog");a.id="fsp-native-dialog",document.body.append(a);const r=document.createElement("input");r.type="file",r.accept=".fsp",r.id="fsp-native-input",r.hidden=!0,document.body.append(r);let o=null,l=null,c=!1,d="";function u(){var g,w,A,y;const x=o==null?void 0:o.conversion,f=x==null?void 0:x.project,p=s(),M=[...(p==null?void 0:p.structures)||[],...(p==null?void 0:p.sources)||[],...(p==null?void 0:p.monitors)||[]],v=E=>{const S=M.find(b=>E.startsWith(b.id+"."));return S?S.name+": "+E.slice(S.id.length+1):E};a.innerHTML=`<div class="fsp-heading"><div><h2>Import FSP for GPU</h2><span>${n((o==null?void 0:o.filename)||"Independent scene import")}</span></div><button data-native="close">Close</button></div>
   <p>Reads supported layout settings without Lumerical. The original FSP is retained. A converted scene uses the native solver and its documented numerical definitions.</p>
   <div class="fsp-toolbar"><button data-native="open" ${c?"disabled":""}>Choose .fsp</button><button data-native="load" ${!f||c?"disabled":""}>Open converted scene</button>${x?'<button data-native="original">Download original .fsp</button><button data-native="report">Conversion report</button>':""}<button data-native="export" ${!f||c?"disabled":""}>Export current scene</button></div>
   <p id="fsp-native-status" role="status">${c?"Processing FSP settings…":d?n(d):l?"Scene export verified · download below":x?f?"Ready to open · review calculation differences below":"Cannot run this FSP yet · unsupported settings below":"Choose an FSP file to check and convert."}</p>
   ${l?`<p><button data-native="edited">Download edited .fsp</button> <button data-native="write-report">Scene export report</button></p>${l.export_verification.native_only_settings.length?`<details><summary>Native JSON retains additional settings</summary><ul>${l.export_verification.native_only_settings.map(E=>`<li>${n(v(E))}</li>`).join("")}</ul></details>`:""}`:""}
   ${(g=l==null?void 0:l.export_verification.structure_list)!=null&&g.changed?`<p data-native-structure-export>Structure list saved: ${l.export_verification.structure_list.added.length} added · ${l.export_verification.structure_list.removed.length} removed · ${l.export_verification.structure_list.output_order.length} total. Native order and material priority verified. Reimport the edited file to use its updated object IDs. New object records have not been verified in external readers.</p>`:""}
   ${(w=l==null?void 0:l.export_verification.source_list)!=null&&w.changed?`<p data-native-source-export>Source list saved: ${l.export_verification.source_list.added.length} added · ${l.export_verification.source_list.removed.length} removed · ${l.export_verification.source_list.output_order.length} total. Native waveforms and order verified.</p>`:""}
   ${(A=l==null?void 0:l.export_verification.monitor_list)!=null&&A.changed?`<p data-native-monitor-export>Monitor list saved: ${l.export_verification.monitor_list.added.length} added · ${l.export_verification.monitor_list.removed.length} removed · ${l.export_verification.monitor_list.output_order.length} outputs. ${l.export_verification.monitor_list.splits.length} component records separated. Native sampling and output order verified. Reimport the edited file before further FSP edits. External reader acceptance is unverified.</p>`:""}
   ${(y=l==null?void 0:l.export_verification.mesh_export)!=null&&y.nodes_changed?`<p data-native-mesh-export>Mesh updated: ${l.export_verification.mesh_export.shape_before.join(" × ")} → ${l.export_verification.mesh_export.shape_after.join(" × ")} cells. Native reimport verified. External remeshing has not been verified.</p>`:""}
   ${f?'<p class="property-help">Exports mapped primitive, electric source and monitor additions, deletions, duplicates and order, source pulses, monitor spectra, duration, PML/Periodic settings and uniform mesh spacing/spans. New sources need explicit or ranged pulse settings. New time monitors need FFT with no apodization. Uniform isotropic export requires Cell centers sampling, and independent unequal axis spacing requires Yee sampling. Edited graded/explicit meshes and groups are not exported yet. Save native JSON to retain every native option and inheritance link.</p>':""}
   ${f?`<p>Original import: <b>${f.region.dimension.toUpperCase()}</b> · ${f.structures.length} structures · ${f.sources.length} sources · ${f.monitors.length} monitors · ${f.region.steps} steps</p>`:""}
   ${x?`<div class="native-issues">${x.issues.map(E=>`<p class="${E.severity==="error"?"error":"warning"}"><b>${n(E.object_id)}</b><br>${n(E.message)}</p>`).join("")}</div><p class="property-help">Coordinate origin in the source FSP: ${x.origin_m.map(E=>(E*1e6).toPrecision(5)).join(", ")} µm. Differences and source fingerprint remain in the saved native project.</p>`:""}`}async function h(x,f){const p=await fetch("/api/fsp"+x,f),M=await p.json();if(!p.ok)throw Error(M.detail||"FSP conversion failed");return M}async function m(x){for(;;){const f=await h("/"+x);if(f.status==="failed")throw Error(f.error);if(f.status==="ready")return f;await new Promise(p=>setTimeout(p,400))}}async function _(x){if(!c){o=null,l=null,d="",c=!0,u(),a.open||a.showModal();try{const f=await h("/native-import",{method:"POST",headers:{"Content-Type":"application/octet-stream","X-Filename":encodeURIComponent(x.name)},body:x});o=await m(f.id),t(x.name+": "+(o.conversion.project?"native scene conversion ready.":"native execution blocked by unsupported settings."),o.conversion.project?"info":"warning")}catch(f){d=f.message,e(d),t("FSP conversion: "+d,"error")}finally{c=!1,u()}}}return r.onchange=()=>{const x=r.files[0];r.value="",x&&_(x)},a.onclick=async x=>{var p,M;const f=(p=x.target.closest("[data-native]"))==null?void 0:p.dataset.native;if(f==="close"&&a.close(),f==="open"&&r.click(),f==="load"&&(o!=null&&o.conversion.project))try{await i(o.conversion.project),a.close()}catch(v){e(v.message)}if(f==="original"||f==="report"){const v=document.createElement("a");v.href="/api/fsp/"+o.id+(f==="original"?"/download":"/conversion"),v.download="",v.click()}if(f==="edited"||f==="write-report"){const v=document.createElement("a");v.href="/api/fsp/"+l.id+(f==="edited"?"/download":"/write-report"),v.download="",v.click()}if(f==="export"&&!c){c=!0,d="",l=null,u();try{const v=await h("/"+o.id+"/native-scene-export",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(s())});l=await m(v.id),t("Independent scene export verified."+((M=l.export_verification.mesh_export)!=null&&M.nodes_changed?" Mesh nodes updated.":""))}catch(v){d=v.message,e(d),t("FSP scene export: "+d,"error")}finally{c=!1,u()}}},{open(){u(),a.open||a.showModal()},openFile:_}}function zv({esc:n,toast:e,log:t,getProject:i,loadProject:s}){const a=document.createElement("dialog");a.id="gds-dialog",a.className="gds-dialog",document.body.append(a);let r=null,o=null,l=null,c=!1;async function d(f,p){const M=await fetch("/api/gds/"+f,p),v=await M.json();if(!M.ok)throw Error(typeof v.detail=="string"?v.detail:JSON.stringify(v.detail));return v}function u(){return JSON.stringify([...a.querySelectorAll("input,select,textarea")].map(f=>[f.value,f.checked]))}function h(){o=null,a.querySelector('[data-gds="apply"]').disabled=!0,a.querySelector('[data-gds="report"]').disabled=!0}function m(f){a.querySelector("#gds-status").textContent=f}function _(f,p){const M=URL.createObjectURL(new Blob([JSON.stringify(p,null,2)],{type:"application/json"})),v=document.createElement("a");v.href=M,v.download=f,v.click(),setTimeout(()=>URL.revokeObjectURL(M),1e3)}function x(){const f=[...new Set(((r==null?void 0:r.cells)||[]).flatMap(p=>p.geometry_pairs.map(M=>M.join("/"))))].sort();a.innerHTML=`<div class="fsp-heading"><h2>Import GDS geometry</h2><button data-gds="close">Close</button></div>
   <p>Select a cell and explicitly assign each included layer its physical Z bounds (µm) and an existing project material. No sources or fabrication materials are inferred.</p>
   <input id="gds-input" aria-label="GDS file" type="file" accept=".gds,.gdsii"><p id="gds-status" role="status">${r?n(r.filename):"Choose a GDSII file (maximum 32 MB)."}</p>
   ${r?`<label>Cell <select id="gds-cell">${r.cells.map(p=>`<option>${n(p.name)}</option>`).join("")}</select></label>
   <p>Pairs below include all library cells. Select pairs present in the selected cell hierarchy. Duplicate a row to extrude the same pair at multiple Z intervals.</p>
   <table><thead><tr><th>Include</th><th>Layer / datatype</th><th>Z min (µm)</th><th>Z max (µm)</th><th>Material</th><th></th></tr></thead><tbody id="gds-stack">${f.map(p=>`<tr data-pair="${p}"><td><input type="checkbox" aria-label="Include ${p}"></td><td>${p}</td><td><input size="8" type="number" step="any" aria-label="Z min ${p}"></td><td><input size="8" type="number" step="any" aria-label="Z max ${p}"></td><td><select aria-label="Material ${p}"><option value="">Select material</option>${i().materials.map(M=>`<option value="${n(M.name)}">${n(M.name)}</option>`).join("")}</select></td><td><button data-gds="duplicate">Duplicate</button></td></tr>`).join("")}</tbody></table>
   <p><label>Unmapped geometry <select id="gds-unmapped"><option value="error">Reject (strict)</option><option value="report">Omit and record in report</option></select></label></p>
   <p><label><input id="gds-replace" type="checkbox"> Replace current structures (sources, monitors and materials stay in the project)</label></p>
   <details><summary>Optional TEXT port metadata contracts</summary><p>JSON array using layer, datatype (= TEXTTYPE), z_min, z_max, width_um and normal_xy. Metadata only, no source/detector integration. Available TEXT pairs: ${n(JSON.stringify([...new Set(r.cells.flatMap(p=>p.text_pairs.map(M=>M.join("/"))))]))}</p><textarea id="gds-ports" aria-label="Port contracts" rows="3" style="width:100%">[]</textarea></details>
   <button data-gds="preview">Preview conversion</button>`:""}
   <button data-gds="apply" disabled>Apply imported geometry</button><button data-gds="report" disabled>Download report</button><pre id="gds-report" style="max-height:240px;overflow:auto;white-space:pre-wrap"></pre>`,a.querySelector("#gds-input").onchange=async p=>{const M=p.target.files[0];if(!(!M||c)){c=!0,h(),m("Inspecting GDS…");try{r=await d("inspect",{method:"POST",headers:{"Content-Type":"application/octet-stream","X-Filename":encodeURIComponent(M.name)},body:M}),x()}catch(v){m(v.message)}finally{c=!1}}}}return a.addEventListener("input",f=>{f.target.id!=="gds-input"&&h()}),a.addEventListener("click",async f=>{var M;const p=(M=f.target.closest("[data-gds]"))==null?void 0:M.dataset.gds;if(!(!p||c)){if(p==="close"){a.close();return}if(p==="duplicate"){const v=f.target.closest("tr");v.after(v.cloneNode(!0)),h();return}if(p==="report"){_("gds-import-report.json",o.report);return}c=!0;try{if(p==="preview"){h();const v=[];for(const w of a.querySelectorAll("#gds-stack tr")){const A=w.querySelectorAll("input");if(!A[0].checked)continue;if(!A[1].value||!A[2].value||!w.querySelector("select").value)throw Error("Every included row needs explicit Z bounds and material.");const[y,E]=w.dataset.pair.split("/").map(Number);v.push({layer:y,datatype:E,z_min:Number(A[1].value),z_max:Number(A[2].value),material:w.querySelector("select").value})}l=JSON.stringify(i());const g=u();if(m("Converting and validating native geometry…"),o=await d(r.id+"/convert",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({project:JSON.parse(l),cell:a.querySelector("#gds-cell").value,layers:v,port_layers:JSON.parse(a.querySelector("#gds-ports").value),unmapped:a.querySelector("#gds-unmapped").value,replace_geometry:a.querySelector("#gds-replace").checked})}),g!==u())throw h(),Error("Import settings changed during conversion. Preview again.");a.querySelector("#gds-report").textContent=JSON.stringify(o.report,null,2),m("Ready to apply. Review the report and bounds; the FDTD region is unchanged."),a.querySelector('[data-gds="apply"]').disabled=!1,a.querySelector('[data-gds="report"]').disabled=!1}else if(p==="apply"){if(l!==JSON.stringify(i()))throw h(),Error("Project changed after preview. Preview again before applying.");await s(o.project),a.close(),t("Imported GDS native geometry. Port metadata is available in the separate conversion report."),e("GDS geometry imported")}}catch(v){m(v.message)}finally{c=!1}}}),{open(){r=null,o=null,x(),a.showModal()}}}const gd={wavelength:1.55,pulse:"gaussian",pulse_cycles:3,time_definition:"cycles",pulse_length:2e-14,pulse_offset:5e-14,signal:null,wavelength_start:1.3,wavelength_stop:1.8,optimize_for_short_pulse:!0,eliminate_discontinuities:!1,chirp_bandwidth_hz:1e14};function kv(n,e,t){const i=n.theta!=null,s=n.injection==="oneway";return(i?s?'<p class="property-help">Electric polarization. Its magnetic partner is generated automatically.</p>':`<label class="property-row"><span>field type</span><select aria-label="field type" data-source-family><option value="E" ${n.component[0]==="E"?"selected":""}>Electric</option><option value="H" ${n.component[0]==="H"?"selected":""}>Magnetic</option></select></label>`:t("polarization","component",n.component,s?["Ex","Ey","Ez"].filter(r=>r[1]!==n.normal):["Ex","Ey","Ez","Hx","Hy","Hz"]))+`<label class="enabled-row"><input type="checkbox" data-source-vector ${i?"checked":""}> Use theta / phi orientation</label>`+(i?e("theta","theta",n.theta,"deg",{min:0,max:180})+e("phi","phi",n.phi??0,"deg")+'<p class="property-help">Theta is measured from +z. Phi turns from +x toward +y. The source has unit vector (sin θ cos φ, sin θ sin φ, cos θ).</p>':"")}function Bv(n,e,t,i){return n.kind==="tfsf"?i("propagation axis","normal",n.normal??"x",e.dimension==="2d"?["x","y"]:["x","y","z"])+i("direction","direction",n.direction??"+",[["+","Forward (+axis)"],["-","Backward (-axis)"]])+t("incident PML layers","incident_pml_cells",n.incident_pml_cells??96,"",{min:32,max:512,step:1})+'<p class="property-help">Normal-incidence TFSF box. Inside contains total fields and outside contains scattered fields. Keep the scatterer away from every face, with homogeneous background on the faces and PML on all active domain boundaries.</p>':n.kind!=="plane"?"":i("injection","injection",n.injection??"soft",[["soft","Soft sheet / bidirectional"],["oneway","One-way plane / normal incidence"]])+(n.injection==="oneway"?i("propagation axis","normal",n.normal??"x",e.dimension==="2d"?["x","y"]:["x","y","z"])+i("direction","direction",n.direction??"+",[["+","Forward (+axis)"],["-","Backward (-axis)"]])+t("incident PML layers","incident_pml_cells",n.incident_pml_cells??96,"",{min:32,max:512,step:1}):"")+'<p class="property-help">Selecting one-way fills the transverse cell, sets its boundaries to Periodic and the propagation boundaries to PML. Place its full plane in homogeneous background. This source does not select a waveguide mode or an oblique angle.</p>'}function gc(n,e,{boundaries:t=!1}={}){if(n.kind==="tfsf"){e.dimension==="2d"&&n.normal==="z"&&(n.normal="x"),(n.component[0]!=="E"||n.component[1]===n.normal)&&(n.component=n.normal==="z"?"Ex":"Ez",n.theta=null,n.phi=0);return}if(n.injection!=="oneway")return;n.normal??(n.normal="x"),n.direction??(n.direction="+"),e.dimension==="2d"&&n.normal==="z"&&(n.normal="x");const i="xyz".indexOf(n.normal),s=e.dimension==="2d"?2:3;n.size=[0,0,0];for(let a=0;a<s;a++)if(a!==i&&(n.center[a]=0,n.size[a]=Math.ceil(e.size[a]/e.mesh-1e-12)*e.mesh),t){for(const r of["min","max"])e.boundaries["xyz"[a]+"_"+r].kind=a===i?"pml":"periodic";e.bloch_phase[a]=0}(n.component[0]!=="E"||n.component[1]===n.normal)&&(n.component="E"+(i===2?"x":"z"),n.theta=null,n.phi=0)}function $o(n){const e=299792458/(n.wavelength_stop*1e-6),t=299792458/(n.wavelength_start*1e-6),i=(e+t)/2,s=(n.optimize_for_short_pulse?2:8)/(t+.01*e),a=s/(2*Math.sqrt(Math.log(2)));return{wavelength:299792458/i*1e6,length:s,offset:1.1*Math.sqrt(2*Math.log(1e4))*a,span:t-e,chirped:t-e>Math.sqrt(Math.log(2))/(Math.PI*a)}}function _d(n,e,t){const i=["wavelength","frequency"].includes(n.time_definition),s=i?$o(n):null;n[e]=t,e==="pulse"&&t==="broadband"&&!i&&(n.time_definition="wavelength",n.eliminate_discontinuities=!0),(e==="pulse"&&t!=="broadband"&&i||e==="time_definition"&&t==="standard"&&i)&&(n.time_definition="standard",n.wavelength=s.wavelength,n.pulse_length=s.length,n.pulse_offset=s.offset,n.chirp_bandwidth_hz=Math.max(s.span,1),e==="time_definition"&&!s.chirped&&(n.pulse="gaussian"))}function vd(n,e,t,i=""){for(const[l,c]of Object.entries(gd))n[l]??(n[l]=c);const s=n.pulse==="broadband",a=["wavelength","frequency"].includes(n.time_definition),r=(l,c)=>`<label class="enabled-row"><input type="checkbox" aria-label="${i}${l}" data-path="${c}" ${n[c]?"checked":""}> ${l}</label>`;let o=t("pulse","pulse",n.pulse,[["gaussian","Gaussian"],["broadband","Broadband / automatic range"],["continuous","Continuous wave"],...n.signal?[["sampled","User time signal"]]:[]]);if(n.pulse==="sampled")return e("wavelength","wavelength",n.wavelength,"µm",{min:.001})+o+`<p class="property-help">${n.signal.time_s.length.toLocaleString()} time/amplitude/phase samples. Time in seconds, phase in radians.</p>`;if(o+=t("time definition","time_definition",n.time_definition,s?[["wavelength","Wavelength range"],["frequency","Frequency range"],["standard","Time domain"]]:[["cycles","Pulse cycles"],["standard","Standard time domain"]]),a){n.time_definition==="wavelength"?o+=e("wavelength start","wavelength_start",n.wavelength_start,"µm",{min:.001})+e("wavelength stop","wavelength_stop",n.wavelength_stop,"µm",{min:.001}):o+=e("frequency start","wavelength_stop",299.792458/n.wavelength_stop,"THz",{min:.001,reciprocal:299.792458})+e("frequency stop","wavelength_start",299.792458/n.wavelength_start,"THz",{min:.001,reciprocal:299.792458});const l=$o(n);o+=r("Optimize for short pulse","optimize_for_short_pulse")+`<p class="property-help" data-source-band-summary>${l.chirped?"Chirped":"Standard"} Gaussian · center ${l.wavelength.toFixed(5)} µm · power FWHM ${(l.length*1e15).toFixed(4)} fs · offset ${(l.offset*1e15).toFixed(4)} fs. The spectrum extends beyond the requested range.</p>`}else o+=e("wavelength","wavelength",n.wavelength,"µm",{min:.001}),o+=n.time_definition==="standard"?e("pulselength (power FWHM)","pulse_length",n.pulse_length*1e15,"fs",{min:.001,scale:1e-15})+(n.pulse!=="continuous"?e("offset","pulse_offset",n.pulse_offset*1e15,"fs",{min:0,scale:1e-15}):""):e("pulse width","pulse_cycles",n.pulse_cycles,"cycles",{min:1}),s&&(o+=e("chirp bandwidth","chirp_bandwidth_hz",n.chirp_bandwidth_hz*1e-12,"THz",{min:.001,scale:1e12}));return n.pulse!=="continuous"&&(o+=r("Eliminate discontinuities","eliminate_discontinuities")),o}function Hv(n,e="signal.csv"){var s;if(e.toLowerCase().endsWith(".json"))return JSON.parse(n);const t=n.replace(/^\uFEFF/,"").trim().split(/\r?\n/).filter(a=>a.trim());if(((s=t.shift())==null?void 0:s.trim())!=="time_s,amplitude,phase_rad")throw Error("CSV header must be time_s,amplitude,phase_rad. Use seconds and unwrapped radians.");const i={time_s:[],amplitude:[],phase_rad:[]};return t.forEach((a,r)=>{const o=a.split(",");if(o.length!==3||o.some(l=>!l.trim()||!Number.isFinite(Number(l))))throw Error(`Invalid numeric data on CSV row ${r+2}.`);Object.keys(i).forEach((l,c)=>i[l].push(Number(o[c])))}),i}function Gv({state:n,api:e,esc:t,commit:i,toast:s}){const a=document.createElement("dialog");a.className="source-dialog",document.body.append(a);const r=M=>a.querySelector(M),o=()=>a.close(),l=M=>{a.innerHTML=M,a.showModal(),a.querySelectorAll("[data-source-close]").forEach(v=>v.onclick=o)},c=M=>{r('[role="alert"]').textContent=M.message},d=M=>{const v=["time_s,amplitude,phase_rad",...M.time_s.map((A,y)=>[A,M.amplitude[y],M.phase_rad[y]].join(","))].join(`
`),g=URL.createObjectURL(new Blob([v],{type:"text/csv"})),w=document.createElement("a");w.href=g,w.download="source-signal.csv",w.click(),setTimeout(()=>URL.revokeObjectURL(g),1e3)},u=M=>M?`${M.time_s.length.toLocaleString()} samples · ${(M.time_s[0]*1e15).toFixed(3)}–${(M.time_s.at(-1)*1e15).toFixed(3)} fs`:"No time signal loaded",h=M=>M?`<table><thead><tr><th>Time (fs)</th><th>Amplitude</th><th>Phase (rad)</th></tr></thead><tbody>${M.time_s.slice(0,6).map((v,g)=>`<tr><td>${(v*1e15).toPrecision(6)}</td><td>${M.amplitude[g].toPrecision(6)}</td><td>${M.phase_rad[g].toPrecision(6)}</td></tr>`).join("")}</tbody></table>`:"",m='<label class="signal-file">Load time signal (CSV or JSON)<input type="file" accept=".csv,.json" aria-label="Time signal file"></label><p class="property-help">CSV: time_s,amplitude,phase_rad. Time is in seconds; phase is unwrapped radians. JSON uses arrays with the same names. 2–100,000 strictly increasing times. Amplitude and phase are interpolated separately; injection is zero outside the table.</p>';async function _(M,v,g){if(M.size>16e6)throw Error("Time signal file exceeds 16 MB.");const w=Hv(await M.text(),M.name);return g.signal=w,g.pulse="sampled",["wavelength","frequency"].includes(g.time_definition)&&(g.time_definition="standard"),(await e("/validate",v)).project}async function x(M){if(n.mode!=="layout")return;let v=structuredClone(n.project),g=v.sources.find(A=>A.id===M);if(!g||g.use_global_source)throw Error("Edit the global source settings for an inherited signal.");l(`<h2>Time signal · ${t(g.name)}</h2>${m}<div class="signal-summary"></div><div class="signal-table"></div><p role="alert" class="error"></p><div class="dialog-actions"><button data-export>Download CSV</button><button data-source-close>Cancel</button><button data-apply class="primary">Apply time signal</button></div>`);const w=()=>{r(".signal-summary").textContent=u(g.signal),r(".signal-table").innerHTML=h(g.signal),r("[data-export]").disabled=!g.signal,r("[data-apply]").disabled=!g.signal};w(),r('[type="file"]').onchange=async A=>{const y=A.target.files[0];if(y)try{const E=structuredClone(v),S=E.sources.find(R=>R.id===M);v=await _(y,E,S),g=v.sources.find(R=>R.id===M),r('[role="alert"]').textContent="",w()}catch(E){c(E)}finally{r('[type="file"]').value=""}},r("[data-export]").onclick=()=>d(g.signal),r("[data-apply]").onclick=async()=>{try{g.pulse="sampled",["wavelength","frequency"].includes(g.time_definition)&&(g.time_definition="standard");const A=await e("/validate",v);i(A.project),o()}catch(A){c(A)}}}async function f(){if(n.mode!=="layout")return;let M=structuredClone(n.project);M.global_source??(M.global_source=structuredClone(gd));const v=(A,y,E,S="",b={})=>{const R={wavelength:"wavelength (µm)","pulselength (power FWHM)":"pulselength (fs)",offset:"offset (fs)","pulse width":"pulse cycles"}[A]||A;return`<label class="property-row"><span>${A}</span><input aria-label="global ${R}" data-path="${y}" type="number" step="any" data-scale="${b.scale||1}" ${b.reciprocal?`data-reciprocal="${b.reciprocal}"`:""} value="${E}"><small>${S}</small></label>`},g=(A,y,E,S)=>`<label class="property-row"><span>${A}</span><select aria-label="global ${A}" data-path="${y}">${S.map(([b,R])=>`<option value="${b}" ${b===E?"selected":""}>${R}</option>`).join("")}</select></label>`,w=()=>{const A=M.global_source;a.innerHTML=`<h2>Global source settings</h2><p>Shared temporal settings for sources with “Use global source settings” enabled. Each source keeps its own amplitude, phase and position.</p>${vd(A,v,g,"global ")}${m}<div class="signal-summary">${u(A.signal)}</div><p role="alert" class="error"></p><div class="dialog-actions"><button data-export ${A.signal?"":"disabled"}>Download signal CSV</button><button data-source-close>Cancel</button><button data-apply class="primary">Apply global settings</button></div>`,r("[data-source-close]").onclick=o,a.querySelectorAll("[data-path]").forEach(y=>y.onchange=()=>{const E=y.type==="checkbox"?y.checked:y.type==="number"?y.dataset.reciprocal?Number(y.dataset.reciprocal)/Number(y.value):Number(y.value)*Number(y.dataset.scale||1):y.value;if(_d(A,y.dataset.path,E),y.type!=="number")w();else if(r("[data-source-band-summary]")){const S=$o(A);r("[data-source-band-summary]").textContent=`${S.chirped?"Chirped":"Standard"} Gaussian · center ${S.wavelength.toFixed(5)} µm · power FWHM ${(S.length*1e15).toFixed(4)} fs · offset ${(S.offset*1e15).toFixed(4)} fs. The spectrum extends beyond the requested range.`}}),r('[type="file"]').onchange=async y=>{const E=y.target.files[0];if(E)try{const S=structuredClone(M);M=await _(E,S,S.global_source),w()}catch(S){c(S)}},r("[data-export]").onclick=()=>d(A.signal),r("[data-apply]").onclick=async()=>{try{const y=await e("/validate",M);i(y.project),o()}catch(y){c(y)}}};w(),a.showModal()}async function p(M){const v=structuredClone(n.project);l('<h2>Source time signal and spectrum</h2><p>Computing the injection at the current mesh time step…</p><p role="alert" class="error"></p><div class="dialog-actions"><button data-source-close>Close</button></div>');try{const g=await e("/sources/"+encodeURIComponent(M)+"/preview",v);if(!a.open)return;a.innerHTML=`<h2>Source preview · ${t(g.name)}</h2><p>${g.inherited?"Global":"Local"} pulse settings · ${g.enabled?"Enabled":"Disabled: zero injection"} · Δt ${g.dt_fs.toFixed(5)} fs · ${g.signal.length.toLocaleString()} samples</p>${g.pulse_parameters?`<p>${g.pulse_parameters.chirped?"Chirped":"Unchirped"} carrier · center ${g.pulse_parameters.center_wavelength_um.toFixed(5)} µm · power FWHM ${(g.pulse_parameters.pulse_length_s*1e15).toFixed(4)} fs</p>`:""}<div class="source-plot-tabs"><button data-mode="time" class="active">Time signal</button><button data-mode="spectrum">Spectrum</button><select aria-label="Source spectrum axis" hidden><option value="frequency">Frequency</option><option value="wavelength">Wavelength</option></select></div><canvas aria-label="Source waveform"></canvas><p>${t(g.note)}</p><div class="dialog-actions"><button data-source-close>Close</button></div>`;let w=!1;const A=()=>Os(r("canvas"),[g],w,r("select").value==="wavelength");a.querySelectorAll("[data-mode]").forEach(y=>y.onclick=()=>{w=y.dataset.mode==="spectrum",r("select").hidden=!w,a.querySelectorAll("[data-mode]").forEach(E=>E.classList.toggle("active",E===y)),A()}),r("select").onchange=A,r("[data-source-close]").onclick=o,A()}catch(g){a.open?c(g):s(g.message)}}return{signal:x,globals:f,preview:p}}function Vv({host:n,material:e,editable:t,api:i,esc:s,begin:a,current:r,invalidate:o,timestep:l,use:c}){var x,f,p;const d=M=>n.querySelector(M),u=e.fit_band_um||[((x=e.samples)==null?void 0:x.wavelength_um[0])||"",((f=e.samples)==null?void 0:f.wavelength_um.at(-1))||""];n.innerHTML=`<details class="material-fit"><summary>Measured optical data · import and fit</summary>
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
 <canvas aria-label="Measured and fitted optical response"></canvas></details>`;let h=null;const m=M=>{d(".fit-status").textContent=M};function _(){h=null,d("[data-use-fit]").disabled=!0,o(),m("Inputs changed. Fit again to update the candidate.");const M=d("canvas");M.getContext("2d").clearRect(0,0,M.width,M.height)}return n.querySelectorAll("input,select,textarea").forEach(M=>M.oninput=_),n.querySelectorAll('textarea,[aria-label="Optical data columns"],[aria-label="Optical wavelength unit"],[aria-label="Optical data file"]').forEach(M=>M.addEventListener("input",()=>{d("[data-fit]").disabled=!0})),d('[aria-label="Optical data file"]').onchange=async M=>{const v=a(),g=M.target.files[0];if(g){if(g.size>2e6){m("Optical data file exceeds 2 MB.");return}try{const w=await g.text();if(!r(v))return;d("textarea").value=w,d('[aria-label="Optical data reference"]').value=g.name,_()}catch(w){r(v)&&m(w.message)}}},d("[data-import]").onclick=async()=>{const M=a();m("Reading optical samples…");try{const v=await i("/materials/data",{text:d("textarea").value,kind:d('[aria-label="Optical data columns"]').value,unit:d('[aria-label="Optical wavelength unit"]').value,reference:d('[aria-label="Optical data reference"]').value});if(!r(M))return;e.samples=v,e.fit_band_um=null,e.fit_dt_s=null,h=null,d('[aria-label="Fit wavelength start"]').value=v.wavelength_um[0],d('[aria-label="Fit wavelength stop"]').value=v.wavelength_um.at(-1),d("[data-data-status]").textContent=`${v.wavelength_um.length} samples · ${v.wavelength_um[0]}–${v.wavelength_um.at(-1)} µm`,d("[data-fit]").disabled=!t,d("[data-use-fit]").disabled=!0,o(),m("Data imported. Fit to create simulation coefficients.")}catch(v){r(M)&&m(v.message)}},d("[data-fit]").onclick=async()=>{const M=a();h=null,d("[data-use-fit]").disabled=!0,m("Fitting passive oscillators…");try{const v={max_poles:Number(d('[aria-label="Maximum fit poles"]').value),tolerance:Number(d('[aria-label="Fit tolerance"]').value),wavelength_range_um:[Number(d('[aria-label="Fit wavelength start"]').value),Number(d('[aria-label="Fit wavelength stop"]').value)],include_drude:d('[aria-label="Include Drude pole"]').checked,target:d('[aria-label="Fit response"]').value},g=structuredClone(e.samples);if(g.reference=d('[aria-label="Optical data reference"]').value,v.dt_s=await l(),!r(M))return;const w=await i("/materials/fit",{data:g,options:v,name:e.name,color:e.color});if(!r(M))return;h=w;const A=w.report,y=A.target==="ade"?"numerical":"fitted";Os(d("canvas"),[["measured_n","n (data)"],["measured_k","k (data)"],[`${y}_n`,"n (fit)"],[`${y}_k`,"k (fit)"]].map(([E,S])=>({name:S,wavelength_um:A.wavelength_um,spectrum:A[E],spectrum_label:"Wavelength (µm) · measured and fitted n + i k"})),!0,!0),m(`${A.converged?"Tolerance met":"Tolerance NOT met"} · ${A.pole_count} poles · ${A.sample_count} samples · analytic RMS ${A.analytic.normalized_rms.toExponential(3)} · FDTD RMS ${A.ade.normalized_rms.toExponential(3)} at Δt ${(A.dt_s*1e15).toPrecision(5)} fs · ${A.seconds.toFixed(2)} s. ${A.converged?"Use fitted material, then Apply materials to save.":"Adjust the fit band or pole limit. Current coefficients have not changed."}`),d("[data-use-fit]").disabled=!t||!A.converged}catch(v){r(M)&&m(v.message)}},d("[data-use-fit]").onclick=()=>{h!=null&&h.report.converged&&c(h.material)},{invalidate(){h=null,d("[data-use-fit]").disabled=!0,m("Material parameters changed. Fit again to update the candidate.")}}}const _c={model:"dielectric",index:1.5,color:"#60bdaa",epsilon_inf:1,plasma_rad_s:2e15,collision_rad_s:1e14,resonance_rad_s:2e15,linewidth_rad_s:1e14,delta_epsilon:1,poles:[],epsilon_tensor:[2.25,2.25,2.25,0,0,0]};function $v({state:n,api:e,esc:t,toast:i,commit:s}){const a=document.createElement("dialog");a.className="material-dialog",document.body.append(a);let r,o=0,l=0,c;a.onclose=()=>{l++};const d=v=>a.querySelector(v),u=(v,g,w="",A=0)=>`<label class="material-field"><span>${v}</span><input aria-label="${v}" data-material-field="${g}" type="${g==="name"?"text":g==="color"?"color":"number"}" value="${t(r.materials[o][g])}" ${g==="name"?'maxlength="100"':`min="${A}" step="any"`}><small>${w}</small></label>`,h=()=>({resonance_rad_s:2e15,strength_rad_s_squared:4e30,damping_rad_s:1e14});function m(v){return`<div class="pole-editor">${v.poles.map((g,w)=>`<details open class="boundary-options"><summary>Pole ${w+1}</summary>${[["Resonance","resonance_rad_s","rad/s",0],["Oscillator strength","strength_rad_s_squared","rad²/s²",1e-30],["Damping","damping_rad_s","rad/s",0]].map(([A,y,E,S])=>`<label class="material-field"><span>${A}</span><input aria-label="Pole ${w+1} ${A}" type="number" min="${S}" step="any" data-pole-index="${w}" data-pole-field="${y}" value="${t(g[y])}"><small>${E}</small></label>`).join("")}<button data-remove-pole="${w}" ${v.poles.length<2?"disabled":""}>Remove pole ${w+1}</button></details>`).join("")}<button data-add-pole ${v.poles.length>=16?"disabled":""}>+ Add pole</button><p>Set resonance to zero for a Drude pole. Strength must be positive and damping nonnegative. Measured optical samples can be fitted below.</p></div>`}function _(v){return`<div class="tensor-material-editor"><p>Real symmetric relative permittivity in the Cartesian x, y, z basis. Principal permittivities must be at least 1.</p>${["xx","yy","zz","xy","xz","yz"].map((g,w)=>`<label class="material-field"><span>ε${g}</span><input aria-label="Tensor epsilon ${g}" data-tensor-index="${w}" type="number" step="any" value="${t(v.epsilon_tensor[w])}"><small>relative</small></label>`).join("")}<p>Uniform 3D grid, resident FP32, point sources and monitors. Periodic/Bloch boundaries or PML with a fixed isotropic exterior. Geometry is sampled at common nodes.</p><button data-tensor-sampling>Use supported tensor sampling</button><p>This stages staircase geometry and Yee field sampling. Apply materials saves both changes.</p></div>`}function x(){return"Tensor material: six Cartesian coefficients are used directly. Scalar n / k and isotropic optical-data fitting do not apply."}function f(){l++;const v=r.materials[o];Object.entries(_c).forEach(([g,w])=>v[g]??(v[g]=structuredClone(w))),a.innerHTML=`<div class="fsp-heading"><h2>Material database</h2><button data-dismiss>Close</button></div><p>Dielectric, full symmetric tensor, Drude, Lorentz and multiple passive poles.</p><div class="material-workspace"><aside><select size="8" aria-label="Material list">${r.materials.map((g,w)=>`<option value="${w}" ${w===o?"selected":""}>${t(g.name)}</option>`).join("")}</select><button data-add-material>+ Add material</button></aside><section><fieldset ${n.mode!=="layout"?"disabled":""}>${u("Material name","name")}${u("Display color","color")}<label class="material-field"><span>Material model</span><select aria-label="Material model" data-material-field="model">${[["dielectric","Dielectric"],["tensor","Symmetric dielectric tensor"],["drude","Plasma (Drude)"],["lorentz","Lorentz"],["multipole","Multiple Drude / Lorentz poles"]].map(([g,w])=>`<option value="${g}" ${v.model===g?"selected":""}>${w}</option>`).join("")}</select></label>${v.model==="tensor"?_(v):v.model==="dielectric"?u("Refractive index","index","",1):u("Permittivity (epsilon infinity)","epsilon_inf","",1)}${v.model==="drude"?u("Plasma resonance","plasma_rad_s","rad/s")+u("Plasma collision","collision_rad_s","rad/s"):v.model==="lorentz"?u("Lorentz permittivity","delta_epsilon")+u("Lorentz resonance","resonance_rad_s","rad/s")+u("Lorentz linewidth","linewidth_rad_s","rad/s"):v.model==="multipole"?m(v):""}</fieldset><p class="material-formula">${v.model==="tensor"?"ε = [[εxx, εxy, εxz], [εxy, εyy, εyz], [εxz, εyz, εzz]]":v.model==="dielectric"?"ε = n²":v.model==="drude"?"ε(ω) = ε∞ − ωp² / (ω² + i γ ω)":v.model==="multipole"?"ε(ω) = ε∞ + Σ Aⱼ / (ωⱼ² − ω² − i γⱼ ω)":"ε(ω) = ε∞ + Δε ω₀² / (ω₀² − ω² − 2 i δ ω)"}${v.model==="tensor"?"":"<br>Frequency parameters above are angular frequencies, in rad/s."}</p></section></div><div data-optical-fit></div><div class="material-range"><label>Wavelength start (µm) <input aria-label="Material wavelength start" type="number" value="1.3" min="0.001" step=".01"></label><label>Wavelength stop (µm) <input aria-label="Material wavelength stop" type="number" value="1.8" min="0.001" step=".01"></label><button data-preview>Plot n / k</button></div><canvas></canvas><p class="material-status" role="status">Preview includes the current simulation timestep.</p><div class="dialog-actions"><button data-apply ${n.mode!=="layout"?"disabled":""}>Apply materials</button><button data-dismiss>Cancel</button></div>`,c=v.model==="tensor"?null:Vv({host:d("[data-optical-fit]"),material:v,editable:n.mode==="layout",api:e,esc:t,begin:()=>++l,current:g=>g===l&&a.open,invalidate:p,timestep:async()=>(await e("/validate",r)).dt_fs*1e-15,use:g=>{r.materials[o]=g,f(),M()}}),d('[aria-label="Material list"]').onchange=g=>{o=+g.target.value,f()},d("[data-add-material]").disabled=n.mode!=="layout",d("[data-add-material]").onclick=()=>{let g=r.materials.length;for(;r.materials.some(w=>w.name===`Custom material ${g}`);)g++;r.materials.push({...structuredClone(_c),name:`Custom material ${g}`}),o=r.materials.length-1,f()},a.querySelectorAll("[data-material-field]").forEach(g=>g.onchange=()=>{const w=g.dataset.materialField,A=v.name;if(w==="name"&&(!g.value.trim()||r.materials.some((y,E)=>E!==o&&y.name===g.value))){g.value=A,d(".material-status").textContent="Material names must be nonempty and unique.";return}v[w]=["name","model","color"].includes(w)?g.value:Number(g.value),w==="name"&&r.structures.forEach(y=>{y.material===A&&(y.material=v.name)}),w==="model"&&v.model==="multipole"&&!v.poles.length&&v.poles.push(h()),w==="model"||w==="name"?f():p()}),a.querySelectorAll(".material-range input").forEach(g=>g.onchange=p),a.querySelectorAll("[data-dismiss]").forEach(g=>g.onclick=()=>a.close()),d("[data-add-pole]")&&(d("[data-add-pole]").onclick=()=>{v.poles.length<16&&(v.poles.push(h()),f())}),a.querySelectorAll("[data-remove-pole]").forEach(g=>g.onclick=()=>{v.poles.splice(+g.dataset.removePole,1),f()}),a.querySelectorAll("[data-pole-field]").forEach(g=>g.onchange=()=>{v.poles[+g.dataset.poleIndex][g.dataset.poleField]=Number(g.value),p()}),a.querySelectorAll("[data-material-field],[data-pole-field]").forEach(g=>g.addEventListener("input",p)),a.querySelectorAll("[data-tensor-index]").forEach(g=>{g.onchange=()=>{v.epsilon_tensor[+g.dataset.tensorIndex]=Number(g.value),p()},g.addEventListener("input",p)}),d("[data-tensor-sampling]")&&(d("[data-tensor-sampling]").onclick=()=>{r.region.interface_method="staircase",r.region.material_sampling="yee",p(),d(".material-status").textContent="Staircase geometry and Yee field sampling staged. Apply materials to save."}),d("[data-preview]").disabled=v.model==="tensor",d(".material-range").hidden=v.model==="tensor",d(".material-range + canvas").hidden=v.model==="tensor",v.model==="tensor"&&(d(".material-status").textContent=x()),d("[data-preview]").onclick=M,d("[data-apply]").onclick=async()=>{try{const g=await e("/validate",r);s(g.project),a.close()}catch(g){d(".material-status").textContent=g.message,i(g.message)}}}function p(){l++,c==null||c.invalidate();const v=d(".material-range + canvas");v.getContext("2d").clearRect(0,0,v.width,v.height),d(".material-status").textContent=r.materials[o].model==="tensor"?x():"Parameters changed. Select Plot n / k to refresh."}async function M(){if(r.materials[o].model==="tensor"){d(".material-status").textContent=x();return}const v=++l;try{const g=Number(d('[aria-label="Material wavelength start"]').value),w=Number(d('[aria-label="Material wavelength stop"]').value),A=(await e("/validate",r)).dt_fs;if(v!==l)return;const y=await e(`/materials/preview?wavelength_start=${g}&wavelength_stop=${w}&dt_fs=${A}`,r.materials[o]);if(v!==l)return;Os(d(".material-range + canvas"),["n","k","numerical_n","numerical_k"].map((E,S)=>({name:["n (analytic)","k (analytic)","n (ADE)","k (ADE)"][S],wavelength_um:y.wavelength_um,spectrum:y[E],spectrum_label:"Wavelength (µm) · complex index n + i k"})),!0,!0),d(".material-status").textContent=`${y.wavelength_um.length} wavelengths · analytic response and ADE at Δt = ${A.toPrecision(5)} fs. Positive k means absorption.${y.samples?` Retained samples: analytic RMS ${y.samples.analytic.normalized_rms.toExponential(3)}, FDTD RMS ${y.samples.ade.normalized_rms.toExponential(3)}.`:""}`}catch(g){v===l&&(d(".material-status").textContent=g.message)}}return{open(){r=structuredClone(n.project),o=0,f(),a.showModal()}}}function Wv({api:n,esc:e}){const t=document.createElement("dialog");t.className="capability-dialog",document.body.append(t);let i;const s=r=>t.querySelector(r);function a(){const r=s("[data-search]").value.toLowerCase(),o=s("[data-status]").value,l=s("[data-category]").value,c=s("[data-priority]").value,d=i.features.filter(u=>(!o||u.native===o)&&(!l||u.category===l)&&(!c||u.product_priority===c)&&(!s("[data-remaining]").checked||u.remaining)&&[u.name,u.category,u.scope,u.workstream_title].join(" ").toLowerCase().includes(r)).sort((u,h)=>u.delivery_rank-h.delivery_rank||u.name.localeCompare(h.name));s(".capability-count").textContent=`${d.length.toLocaleString()} / ${i.features.length.toLocaleString()} entries`,s("tbody").innerHTML=d.map(u=>`<tr><td>${u.native==="implemented"?"☑":"☐"}</td><td><b>${e(u.product_priority)}</b><small>${e(i.decision_labels[u.decision])}</small></td><td><small>${e(u.workstream_title)} · ${e(u.category)}</small>${u.reference?`<a href="${e(u.reference)}" target="_blank" rel="noopener">${e(u.name)}</a>`:`<span>${e(u.name)}</span>`}</td>${["native","python","ui","fsp"].map(h=>`<td><span class="cap-status ${u[h]}">${e(i.status_labels[u[h]])}</span></td>`).join("")}<td>${e(u.scope)}<small>${e(u.priority_reason)}</small>${u.evidence.length?`<small>${u.evidence.map(e).join(" · ")}</small>`:""}</td></tr>`).join("")}return{async open(){i=await n("/capabilities"),t.innerHTML=`<div class="fsp-heading"><h2>Feature priorities and checklist</h2><button data-close-panel>Close</button></div><p>${e(i.priority_note)}</p><p>${Object.entries(i.remaining_priority_counts).sort().map(([r,o])=>`${e(r)}: ${o} remaining entries`).join(" · ")}</p><div class="capability-filters"><input data-search aria-label="Search capabilities" placeholder="Search feature or property"><select data-priority aria-label="Capability priority"><option value="">All priorities</option>${Object.entries(i.priority_labels).map(([r,o])=>`<option value="${r}">${e(o)}</option>`).join("")}</select><select data-status aria-label="Capability status"><option value="">All statuses</option>${Object.entries(i.status_labels).map(([r,o])=>`<option value="${r}">${e(o)}</option>`).join("")}</select><select data-category aria-label="Capability category"><option value="">All categories</option>${[...new Set(i.features.map(r=>r.category))].map(r=>`<option>${e(r)}</option>`).join("")}</select><label><input data-remaining type="checkbox" aria-label="Remaining work only"> Remaining work only</label><a href="/api/capabilities" target="_blank">JSON</a><span class="capability-count"></span></div><div class="capability-table"><table><thead><tr><th></th><th>Priority</th><th>Feature / property</th><th>Native engine</th><th>Python</th><th>UI</th><th>Independent FSP</th><th>Scope / reason / evidence</th></tr></thead><tbody></tbody></table></div>`,s("[data-close-panel]").onclick=()=>t.close(),s("[data-search]").oninput=a;for(const r of["data-status","data-category","data-priority","data-remaining"])s("["+r+"]").onchange=a;a(),t.showModal()}}}function jv({esc:n}){const e=document.createElement("dialog");e.className="inverse-design-dialog",document.body.append(e);const t=E=>e.querySelector(E),i="torchfdtd.periodicDesign.v1",s=i+".job";let a,r=localStorage.getItem(s),o,l=!1,c=null,d=!1,u=!1;async function h(E,S){var I;const b=await fetch("/api/"+E,S===void 0?{}:{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(S)}),R=(I=b.headers.get("content-type"))!=null&&I.includes("json")?await b.json():await b.text();if(!b.ok)throw Error(typeof R.detail=="string"?R.detail:JSON.stringify(R.detail||R));return R}function m(){localStorage.setItem(i,JSON.stringify(a))}function _(E,S,b="application/json"){const R=URL.createObjectURL(new Blob([E],{type:b})),I=document.createElement("a");I.href=R,I.download=S,I.click(),setTimeout(()=>URL.revokeObjectURL(R),1e3)}function x(E){t("[data-design-status]").textContent=E.message}const f=(E,S,b,R="any")=>`<label>${E}<input aria-label="${E}" data-key="${S}" type="number" step="${R}" value="${n(b)}"></label>`,p=(E,S,b)=>`<label>${E}<select aria-label="${E}" data-key="${S}">${b.map(([R,I])=>`<option value="${R}" ${a[S]===R?"selected":""}>${I}</option>`).join("")}</select></label>`;function M(){var L;const E=d&&((L=c==null?void 0:c.progress)!=null&&L.density_preview)?c.progress.density_preview:a.initial_density,S=t("[data-density]"),b=S.getContext("2d"),R=E.length,I=E[0].length;b.clearRect(0,0,S.width,S.height);for(let z=0;z<R;z++)for(let N=0;N<I;N++){const F=Math.max(0,Math.min(1,Number(E[z][N])));b.fillStyle=`rgb(${Math.round(18+207*F)},${Math.round(39+190*F)},${Math.round(65+95*F)})`,b.fillRect(z*S.width/R,(I-1-N)*S.height/I,Math.ceil(S.width/R),Math.ceil(S.height/I))}t("[data-density-caption]").textContent=(d?"Latest evaluated density":"Initial density")+` · x: ${R}, y: ${I} · 0 background / 1 design material`}function v(E){l=E,e.querySelectorAll("fieldset").forEach(S=>S.disabled=E),t("[data-start-design]").disabled=E,t("[data-plan-design]").disabled=E,t("[data-stop-design]").disabled=!E,t("[data-load-design]").disabled=E,t("[data-use-seed]").disabled=E||!(c!=null&&c.summary)}function g(){e.innerHTML=`<div class="fsp-heading"><div><h2>Inverse design · periodic layer</h2><p>FP32 · Torch adjoint · automatic memory placement</p></div><button data-close-design>Close</button></div>
  <p class="design-scope">Optimize a continuous density layer at one wavelength. This setup is separate from the CAD scene. Fixed materials, periodic x/y boundaries and PML in z. Mesh convergence and fabrication constraints require separate validation.</p>
  <div class="design-grid"><section class="design-settings"><fieldset><legend>Structure & illumination</legend>
   ${f("Wavelength (µm)","wavelength_um",a.wavelength_um)}
   ${f("Period x (µm)","period_um.0",a.period_um[0])}${f("Period y (µm)","period_um.1",a.period_um[1])}
   ${f("Layer height (µm)","height_um",a.height_um)}${f("Detector offset (µm)","detector_offset_um",a.detector_offset_um)}
   ${f("Background index","background_index",a.background_index)}${f("Design index","design_index",a.design_index)}
   ${f("Incidence θ (degrees)","theta_deg",a.theta_deg)}${f("Azimuth φ (degrees)","phi_deg",a.phi_deg)}
   ${f("Mesh (µm)","mesh_um",a.mesh_um)}${f("Time steps","steps",a.steps,1)}${f("PML cells","pml_cells",a.pml_cells,1)}
  </fieldset><fieldset><legend>Objective & optimizer</legend><p>Maximize weighted quadrant power, averaged over two polarizations.</p>
   ${["R","G2","G1","B"].map((b,R)=>f(b+" weight","objective_weights."+R,a.objective_weights[R])).join("")}
   ${f("Adam updates","iterations",a.iterations,1)}${f("Learning rate","learning_rate",a.learning_rate)}
  </fieldset><fieldset><legend>Memory & execution</legend>
   ${p("Compute device","device",[["cpu","CPU"],["cuda","CUDA GPU"]])}
   ${p("Execution mode","execution",[["auto","Automatic"],["resident","Resident"],["recorded","Boundary-history adjoint"],["dram","DRAM streaming"],["file","File streaming"]])}
   ${f("GPU budget (GiB)","gpu_budget_gib",a.gpu_budget_gib)}${f("DRAM budget (GiB)","host_budget_gib",a.host_budget_gib)}
   ${a.execution==="recorded"?`
    ${p("Boundary history","recorded_trace_storage",[["cpu","CPU RAM"],["device","Compute device"]])}
    ${f("Transfer block (steps)","recorded_trace_chunk_steps",a.recorded_trace_chunk_steps,1)}
    ${f("Fixed collar (cells)","recorded_collar_cells",a.recorded_collar_cells,1)}
    <p data-recorded-scope>Reconstruct the lossless design interior from boundary history. Fields remain on the compute device. The layer and source must fit inside the fixed exterior collar. CUDA with CPU history uses asynchronous transfers.</p>
   `:`${f("Checkpoints","checkpoints",a.checkpoints,1)}${f("Maximum slab width","slab_width",a.slab_width,1)}${f("Temporal depth","temporal_depth",a.temporal_depth,1)}
    <details><summary>Optional file backing</summary><label>State directory<input aria-label="State directory" data-key="state_directory" value="${n(a.state_directory||"")}"></label>
    ${f("File budget (GiB)","disk_budget_gib",a.disk_budget_gib??"")}${f("Keep disk free (GiB)","disk_free_reserve_gib",a.disk_free_reserve_gib)}<p>Used only when explicitly configured. Default free-space reserve: 100 GiB.</p></details>`}
  </fieldset></section>
  <section class="design-density"><h3>Design region</h3><canvas data-density width="512" height="512" aria-label="Density editor"></canvas><p data-density-caption></p>
   <fieldset><legend>Initial density</legend><div class="design-density-tools"><label>x pixels<input aria-label="Density x pixels" data-nx type="number" value="${a.initial_density.length}" min="1" max="1024"></label><label>y pixels<input aria-label="Density y pixels" data-ny type="number" value="${a.initial_density[0].length}" min="1" max="1024"></label><label>Paint value<input aria-label="Density paint value" data-paint type="number" value="0.5" min="0" max="1" step="0.1"></label></div><button data-reset-density>Fill / resize initial density</button><button data-show-initial>Show initial density</button><p>Click or drag to paint. x increases right and y increases upward.</p></fieldset>
   <div class="design-file-tools"><button data-save-design>Save setup JSON</button><button data-load-design>Load setup JSON</button><button data-export-design>Export Python</button><input data-import-design type="file" accept=".json" hidden></div>
   <button data-use-seed disabled>Use evaluated result as new seed</button>
  </section>
  <section class="design-run"><h3>Execution plan</h3><button data-plan-design>Check memory</button><p data-plan-summary>No fields or trial simulations are run by the memory check.</p>
   <div class="design-run-buttons"><button data-start-design>Run inverse design</button><button data-stop-design disabled>Stop</button></div><p data-design-status role="status">Ready</p><p class="design-stop-note">Stop takes effect between solver calls. Closing this panel keeps the job running.</p>
   <h3>Evaluated objective</h3><table><thead><tr><th>Update</th><th>Score ↑</th><th>Gradient L2</th></tr></thead><tbody data-design-history></tbody></table><a data-design-download hidden>Download evaluated designs</a>
  </section></div>`,t("[data-close-design]").onclick=()=>e.close(),e.querySelectorAll("[data-key]").forEach(b=>b.onchange=()=>{const[R,I]=b.dataset.key.split(".");let L=b.type==="number"?b.value===""?null:Number(b.value):b.value;R==="state_directory"&&!L&&(L=null),I!==void 0?a[R][Number(I)]=L:a[R]=L,m(),d=!1,R==="execution"?g():M(),t("[data-plan-summary]").textContent="Settings changed. Check memory before running."}),t("[data-reset-density]").onclick=()=>{try{const b=Number(t("[data-nx]").value),R=Number(t("[data-ny]").value),I=Number(t("[data-paint]").value);if(!Number.isInteger(b)||!Number.isInteger(R)||b<1||R<1||b*R>1048576||I<0||I>1)throw Error("Use positive pixel counts and a density in [0,1].");a.initial_density=Array.from({length:b},()=>Array(R).fill(I)),m(),d=!1,M(),t("[data-plan-summary]").textContent="Settings changed. Check memory before running."}catch(b){x(b)}},t("[data-show-initial]").onclick=()=>{d=!1,M()};const E=t("[data-density]");function S(b){if(l||d)return;const R=E.getBoundingClientRect(),I=a.initial_density,L=Number(t("[data-paint]").value);if(!Number.isFinite(L)||L<0||L>1)return;const z=Math.min(I.length-1,Math.max(0,Math.floor((b.clientX-R.left)/R.width*I.length))),N=Math.min(I[0].length-1,Math.max(0,I[0].length-1-Math.floor((b.clientY-R.top)/R.height*I[0].length)));I[z][N]=L,M()}E.onpointerdown=b=>{u=!0,E.setPointerCapture(b.pointerId),S(b)},E.onpointermove=b=>{u&&S(b)},E.onpointerup=()=>{u=!1,m()},t("[data-plan-design]").onclick=async()=>{try{const b=await h("design/plan",a);w(b)}catch(b){x(b)}},t("[data-start-design]").onclick=async()=>{try{v(!0),c=null,r=(await h("design/jobs",a)).id,localStorage.setItem(s,r),await y()}catch(b){v(!1),x(b)}},t("[data-stop-design]").onclick=async()=>{try{await h("jobs/"+r+"/cancel",{}),t("[data-design-status]").textContent="Stop requested. Waiting for the current solver call."}catch(b){x(b)}},t("[data-save-design]").onclick=()=>_(JSON.stringify(a,null,2),"periodic-design.json"),t("[data-export-design]").onclick=async()=>{try{_(await h("design/python",a),"periodic_design.py","text/x-python")}catch(b){x(b)}},t("[data-load-design]").onclick=()=>t("[data-import-design]").click(),t("[data-import-design]").onchange=async b=>{try{const R=b.target.files[0];if(!R)return;const I=JSON.parse(await R.text());a=await h("design/config",I),m(),d=!1,c=null,r=null,localStorage.removeItem(s),g()}catch(R){x(R)}},t("[data-use-seed]").onclick=async()=>{try{const b=await h("design/jobs/"+r+"/download");if(!b.last_evaluated)throw Error("No evaluated density is available.");a={...b.config,initial_density:b.last_evaluated.density},m(),d=!1,c=null,r=null,localStorage.removeItem(s),g()}catch(b){x(b)}},M(),v(l),c&&A(c)}function w(E){var b;const S=((b=E.selection)==null?void 0:b.mode)||E.execution;t("[data-plan-summary]").textContent=`${E.device==="cuda"?"CUDA GPU":"CPU"} · ${S} · FP32
GPU ${(E.gpu_reservation_bytes/1024**3).toFixed(3)} GiB · DRAM ${(E.total_host_reservation_bytes/1024**3).toFixed(3)} GiB · file ${(E.disk_reservation_bytes/1024**3).toFixed(3)} GiB reserved. No calibration solves.`}function A(E){var I;c=E;const S=E.progress||{};v(["queued","running"].includes(E.status));const b=JSON.stringify(E.config)===JSON.stringify(a);t("[data-design-status]").textContent=E.error||`${l&&E.cancel_requested?"Stopping":E.status} · ${S.stage||"waiting"} · ${S.updates_completed||0} / ${((I=E.config)==null?void 0:I.iterations)||a.iterations} updates`,S.plan&&b?w(S.plan):b||(t("[data-plan-summary]").textContent="Settings differ from the displayed run. Check memory for this setup."),t("[data-design-history]").innerHTML=(S.history||[]).map(L=>`<tr><td>${L.update}</td><td>${L.objective.toPrecision(7)}</td><td>${L.gradient_l2===void 0?"—":L.gradient_l2.toExponential(3)}</td></tr>`).join(""),S.density_preview&&b&&(d=!0,M());const R=t("[data-design-download]");R.hidden=!E.summary,R.href="/api/design/jobs/"+r+"/download"}async function y(){clearTimeout(o);try{const E=await h("jobs/"+r);A(E),l&&e.open&&(o=setTimeout(y,1500))}catch(E){v(!1),x(E)}}return e.addEventListener("close",()=>clearTimeout(o)),{async open(){if(!a){const E=await h("design/defaults");try{const S=JSON.parse(localStorage.getItem(i));a=S?await h("design/config",S):E}catch{a=E}if(!localStorage.getItem(i)){const S=await h("health");a.device=S.cuda?"cuda":"cpu"}}g(),e.showModal(),r&&await y()}}}function Xv(n,e){const t={auto_shutoff:!1,decay_threshold:1e-6,check_interval:50,consecutive_checks:3,min_steps:100,source_tail_amplitude:1e-8,after_source_s:0,divergence_check:!0,growth_limit:1e6,field_limit:null};n.run_control??(n.run_control={});const i=n.run_control;for(const[a,r]of Object.entries(t))i[a]===void 0&&(i[a]=r);const s=(a,r,o="",l={})=>e(a,"run_control."+r,i[r],o,l);return`<label class="enabled-row"><input aria-label="Automatic decay shutoff" type="checkbox" data-path="run_control.auto_shutoff" ${i.auto_shutoff?"checked":""}> Automatic decay shutoff</label>`+s("decay threshold","decay_threshold","",{min:1e-15})+s("check every","check_interval","steps",{min:1,step:1})+s("consecutive low checks","consecutive_checks","",{min:2,step:1})+s("minimum time steps","min_steps","",{min:10,step:1})+s("source tail cutoff","source_tail_amplitude","",{min:1e-15})+e("wait after source","run_control.after_source_s",i.after_source_s*1e15,"fs",{min:0,scale:1e-15})+`<label class="enabled-row"><input aria-label="Divergence checking" type="checkbox" data-path="run_control.divergence_check" ${i.divergence_check?"checked":""}> Divergence checking</label>`+s("post-source growth limit","growth_limit","",{min:1.01})+`<label class="enabled-row"><input aria-label="Absolute field limit" type="checkbox" data-run-field-limit ${i.field_limit!==null?"checked":""}> Absolute field limit</label>`+(i.field_limit!==null?s("maximum field magnitude","field_limit","",{min:1e-30}):"")+'<p class="property-help">Decay threshold and growth limit are ratios of the whole-domain state norm. Source tail cutoff is a relative envelope amplitude. Absolute field limits use reduced field units. All finite sources must finish before decay checks. Continuous sources disable automatic termination. Confirm spectra with a longer run.</p>'}async function qv({state:n,api:e,esc:t,toast:i}){const s=n.job;if(!s)throw Error("Complete a 3D run with a six-field frequency plane first.");const[a,r]=await Promise.all([e(`/jobs/${s}/diffraction-monitors`),e("/jobs")]);if(!a.length)throw Error("Add a full-cell frequency monitor and record all six E/H fields, then rerun.");const o=document.createElement("dialog");o.className="radiation-dialog monitor-dialog",o.style.width="min(1000px,92vw)",document.body.append(o);const l=h=>o.querySelector(h);o.innerHTML=`<div class="fsp-heading"><h2>Diffraction orders</h2><button data-close>Close</button></div>
 <p>Requires a complete periodic unit-cell plane with six collocated E/H fields in a homogeneous lossless isotropic medium outside PML. This is not an isolated-object far-field projection.</p>
 <label>Stored plane <select aria-label="Diffraction plane">${a.map(h=>`<option value="${t(h.id)}">${t(h.name)} (+${h.normal})</option>`).join("")}</select></label>
 <label>Frequency <select aria-label="Diffraction frequency"></select></label>
 <label>Exterior refractive index <input aria-label="Exterior refractive index" type="number" min="0.001" max="20" step="0.01" value="1"></label>
 <label>Integer orders (m,n per line)<textarea aria-label="Diffraction orders" rows="3">0,0</textarea></label>
 <label>Matched reference <select aria-label="Diffraction reference"><option value="">Raw directional powers only</option>${r.filter(h=>h.id!==s&&h.status==="completed").map(h=>`<option value="${t(h.id)}">${t(h.name)} (${t(h.id.slice(0,8))})</option>`).join("")}</select></label>
 <label><input type="checkbox" aria-label="Subtract incident diffraction fields"> Subtract matched incident fields before normalized power</label>
 <label><input type="checkbox" aria-label="Confirm diffraction exterior"> I confirm both planes are in the declared homogeneous, lossless isotropic exterior, outside PML.</label>
 <button data-calculate>Calculate diffraction</button><p role="status"></p><div data-results></div>`;let c=0;function d(){c++,l("[data-results]").innerHTML="",l('[role="status"]').textContent="",l("[data-calculate]").disabled=!1}function u(){const h=a.find(m=>m.id===l('[aria-label="Diffraction plane"]').value);l('[aria-label="Diffraction frequency"]').innerHTML=h.frequency_thz.map((m,_)=>`<option value="${_}">${m.toPrecision(7)} THz</option>`).join(""),l("[data-results]").innerHTML=""}l('[aria-label="Diffraction plane"]').onchange=u,u(),o.querySelectorAll("input,select,textarea").forEach(h=>{h.addEventListener("input",d),h.addEventListener("change",d)}),l("[data-close]").onclick=()=>o.close(),o.addEventListener("close",()=>{c++,o.remove()},{once:!0}),l("[data-calculate]").onclick=async()=>{const h=++c,m=l("[data-calculate]");m.disabled=!0,l("[data-results]").innerHTML="";try{const _=l('[aria-label="Diffraction orders"]').value.trim().split(/\n+/).map(M=>M.trim().split(/[\s,]+/).map(Number));if(!_.length||_.some(M=>M.length!==2||M.some(v=>!Number.isInteger(v))))throw Error("Enter one pair of integers per line, for example 0,0.");const x=l('[aria-label="Diffraction reference"]').value,f=await e(`/jobs/${s}/diffraction`,{monitor:l('[aria-label="Diffraction plane"]').value,frequency_index:Number(l('[aria-label="Diffraction frequency"]').value),orders:_,refractive_index:Number(l('[aria-label="Exterior refractive index"]').value),reference:x||null,subtract_incident:l('[aria-label="Subtract incident diffraction fields"]').checked,confirm_homogeneous_exterior:l('[aria-label="Confirm diffraction exterior"]').checked});if(h!==c)return;const p=M=>Number(M).toExponential(6);l('[role="status"]').textContent=`${f.frequency_thz.toPrecision(7)} THz; orders along ${f.transverse_axes.join(", ")}. ${f.normalized?"Reference-normalized efficiencies shown alongside raw directional powers.":"Raw directional powers only, not efficiencies."}`,l("[data-results]").innerHTML=`<table style="width:100%;text-align:left;border-spacing:8px"><thead><tr><th>Order</th><th>Type</th><th>+ normal raw power</th><th>- normal raw power</th>${f.normalized?"<th>Forward efficiency</th><th>Backward efficiency</th>":""}</tr></thead><tbody>${f.orders.map((M,v)=>`<tr><td>${M.join(", ")}</td><td>${f.propagating[v]?"Propagating":"Evanescent (zero real power)"}</td><td>${p(f.forward_power[v])}</td><td>${p(f.backward_power[v])}</td>${f.normalized?`<td>${p(f.forward_efficiency[v])}</td><td>${p(f.backward_efficiency[v])}</td>`:""}</tr>`).join("")}</tbody></table><p>Raw units: ${t(f.units)}. ${t(f.note)}${f.subtract_incident?" Normalized columns use incident-subtracted fields; raw columns retain total fields.":""}</p>`}catch(_){h===c&&(l('[role="status"]').textContent=_.message,i(_.message))}finally{h===c&&(m.disabled=!1)}},o.showModal()}const Ar=["x_min","x_max","y_min","y_max","z_min","z_max"],vc={x_min:"X minimum",x_max:"X maximum",y_min:"Y minimum",y_max:"Y maximum",z_min:"Z minimum",z_max:"Z maximum"};function Cr(n,e,t="application/json"){const i=URL.createObjectURL(new Blob([typeof n=="string"?n:JSON.stringify(n,null,2)],{type:t})),s=document.createElement("a");s.href=i,s.download=e,s.click(),setTimeout(()=>URL.revokeObjectURL(i),1e3)}async function Yv({state:n,api:e,esc:t,toast:i}){const s=n.job;if(!s)throw Error("Complete a run with six closed-box frequency planes first.");const[a,r]=await Promise.all([e(`/jobs/${s}/farfield-monitors`),e("/jobs")]),o=a.monitors||[],l=document.createElement("dialog");l.className="farfield-dialog",document.body.append(l);const c=y=>l.querySelector(y);let d=0,u=!1,h=null;const m=(y,E,S)=>`<label>${t(y)}<input aria-label="${t(y)}" data-number="${E}" type="number" step="any" value="${S}"></label>`;l.innerHTML=`<header><div><h2>Closed-box far field</h2><p>Stored run: ${t(a.name||s)}</p></div><button data-close>Close</button></header>
 <p>Project radiation from six stored frequency planes. This performs CPU postprocessing only and does not run FDTD. Closing this window discards pending results but does not cancel server calculation.</p>
 <p data-scope>${a.isolated_pml?"All outer faces use PML.":"This run is not an isolated all-PML domain. The backend will reject unsupported boundaries."} ${t(a.note||"")}</p>
 <div class="farfield-grid"><fieldset><legend>Six closed-box faces</legend>${Ar.map(y=>`<label>${vc[y]}<select aria-label="${vc[y]} face" data-face="${y}"><option value="">Select stored plane</option>${o.filter(E=>E.normal===y[0]).map(E=>`<option value="${t(E.id)}">${t(E.name)} · ${t(E.position_um)} µm · ${E.points} points</option>`).join("")}</select></label>`).join("")}<button data-fill>Fill bounds from selected planes</button><p>Minimum faces retain native positive-axis fields. Outward signs are applied automatically.</p></fieldset>
 <fieldset><legend>Surface and exterior</legend>${["x","y","z"].map((y,E)=>m(`${y.toUpperCase()} lower bound (µm)`,`bounds.${E}.0`,-1)+m(`${y.toUpperCase()} upper bound (µm)`,`bounds.${E}.1`,1)).join("")}${m("Exterior refractive index","index",a.background_index||1)}<label>Stored frequency<select aria-label="Far-field frequency" data-frequency></select></label><p>Bounds must match all face extents and stay inside the PML-free region. No frequency interpolation.</p></fieldset>
 <fieldset><legend>Directions and phase</legend>${m("Theta start (degrees)","theta.start",0)+m("Theta stop (degrees)","theta.stop",180)+m("Theta samples","theta.count",19)+m("Phi start (degrees)","phi.start",0)+m("Phi stop (degrees, excluded)","phi.stop",360)+m("Phi samples","phi.count",36)}${["x","y","z"].map((y,E)=>m(`Phase origin ${y} (µm)`,`origin.${E}`,0)).join("")}<p>Theta starts at +z. Phi rotates from +x toward +y. Theta includes both endpoints, phi excludes its stop. Maximum 8192 directions.</p></fieldset>
 <fieldset><legend>Reference and physical scope</legend><label>Reference run<select aria-label="Far-field reference" data-reference><option value="">Total fields, no reference</option>${r.filter(y=>y.id!==s&&y.status==="completed").map(y=>`<option value="${t(y.id)}">${t(y.name)} (${t(y.id.slice(0,8))})</option>`).join("")}</select></label><label class="farfield-check"><input type="checkbox" data-subtract aria-label="Subtract matched incident fields"> Subtract matched complex E/H on all six faces</label><p>Reference runs must contain the same face IDs and matching source, mesh, duration and monitor settings. Subtraction produces scattered fields, not normalized efficiency.</p><label class="farfield-check"><input type="checkbox" data-confirm aria-label="Confirm homogeneous closed surface"> I confirm a closed surface in the declared homogeneous, lossless isotropic exterior, outside PML, enclosing the radiating objects. For total fields it encloses sources. For scattering the matched incident source does not cross a measurement face.</label></fieldset></div>
 <div class="farfield-actions"><button data-calculate>Calculate far field</button><button data-setup>Export setup JSON</button></div><p role="status">Choose all six faces and confirm the surface assumptions.</p><div data-results></div>`;const _=()=>Ar.map(y=>o.find(E=>E.id===c(`[data-face="${y}"]`).value));function x(){const y=c("[data-frequency]").value,E=_(),S=E.every(Boolean)&&E.every(b=>JSON.stringify(b.frequency_thz)===JSON.stringify(E[0].frequency_thz));c("[data-frequency]").innerHTML=S?E[0].frequency_thz.map((b,R)=>`<option value="${R}">${Number(b).toPrecision(7)} THz</option>`).join(""):'<option value="">Select six planes with identical frequency lists</option>',S&&Number(y)<E[0].frequency_thz.length&&(c("[data-frequency]").value=y||"0")}function f(){_().forEach((y,E)=>{y&&(c(`[data-number="bounds.${Math.floor(E/2)}.${E%2}"]`).value=y.position_um)})}for(const y of["x","y","z"]){const E=o.filter(S=>S.normal===y).sort((S,b)=>S.position_um-b.position_um);E.length===2&&E[0].position_um<E[1].position_um&&(c(`[data-face="${y}_min"]`).value=E[0].id,c(`[data-face="${y}_max"]`).value=E[1].id)}f(),x();function p(){d++,h=null,c("[data-results]").replaceChildren(),c('[role="status"]').textContent="Setup changed. Calculate when ready.",c("[data-calculate]").disabled=!1}l.querySelectorAll("input,select").forEach(y=>{y.addEventListener("input",p),y.addEventListener("change",()=>{p(),y.dataset.face&&x()})}),c("[data-fill]").onclick=()=>{f(),p()};function M(){const y=z=>{const N=c(`[data-number="${z}"]`).value;if(N.trim()===""||!Number.isFinite(Number(N)))throw Error("Enter finite numerical settings.");return Number(N)},E=Object.fromEntries(Ar.map(z=>[z,c(`[data-face="${z}"]`).value]));if(new Set(Object.values(E)).size!==6||Object.values(E).some(z=>!z))throw Error("Select six distinct stored planes.");const S=c("[data-frequency]").value;if(S==="")throw Error("All faces need identical stored frequency lists.");const b={start:y("theta.start"),stop:y("theta.stop"),count:y("theta.count")},R={start:y("phi.start"),stop:y("phi.stop"),count:y("phi.count")};if(![b.count,R.count].every(z=>Number.isInteger(z)&&z>=2)||b.count*R.count>8192)throw Error("Use at least two samples per angular axis and at most 8192 directions.");if(b.start<0||b.stop>180||b.stop<=b.start||R.start<0||R.stop>360||R.stop<=R.start)throw Error("Theta must increase within 0–180 degrees. Phi must increase within 0–360 degrees.");const I=c("[data-reference]").value||null,L=c("[data-subtract]").checked;if(!!I!==L)throw Error("Choose a matched reference and enable complex-field subtraction together.");return{version:1,faces:E,frequency_index:Number(S),bounds_um:[0,1,2].map(z=>[y(`bounds.${z}.0`),y(`bounds.${z}.1`)]),refractive_index:y("index"),phase_origin_um:[0,1,2].map(z=>y(`origin.${z}`)),theta_deg:b,phi_deg:R,reference:I,subtract_incident:L,confirm_homogeneous_closed_surface:c("[data-confirm]").checked}}function v(y){c('[role="status"]').textContent=y.message,i(y.message)}c("[data-setup]").onclick=()=>{try{Cr({job_id:s,request:M()},"farfield-setup.json")}catch(y){v(y)}},c("[data-calculate]").onclick=async()=>{const y=++d;h=null,c("[data-results]").replaceChildren();try{const E=M();if(!E.confirm_homogeneous_closed_surface)throw Error("Confirm the homogeneous closed-surface assumptions first.");c("[data-calculate]").disabled=!0,c('[role="status"]').textContent="Projecting stored fields on CPU…";const S=await e(`/jobs/${s}/farfield`,E);if(u||y!==d)return;h=S,g()}catch(E){!u&&y===d&&v(E)}finally{!u&&y===d&&(c("[data-calculate]").disabled=!1)}};function g(){c('[role="status"]').textContent=`${Number(h.frequency_thz).toPrecision(7)} THz · ${h.field_kind==="scattered"?"Scattered":"Total"} fields · ${h.directions.length} directions. ${h.zero_pattern?"Zero pattern. ":""}${h.note||""}`,c("[data-results]").innerHTML=`<h3>Angular radiation pattern</h3><p>Raw quantity: reduced spectral power per steradian (${t(h.intensity_units)}). This is not calibrated W/sr or an efficiency.</p><label>Display scale<select aria-label="Far-field display scale" data-scale><option value="relative">Relative intensity I / max(I)</option><option value="raw">Raw reduced spectral intensity</option></select></label><canvas data-heat width="800" height="370" aria-label="Far-field angular heatmap"></canvas><p data-range></p><div class="farfield-grid"><section><label>Theta cut at phi<select data-phi-cut aria-label="Theta cut at phi">${h.phi_deg.map((y,E)=>`<option value="${E}">${y}°</option>`).join("")}</select></label><canvas data-theta-canvas width="500" height="260" aria-label="Theta intensity cut"></canvas></section><section><label>Phi cut at theta<select data-theta-cut-select aria-label="Phi cut at theta">${h.theta_deg.map((y,E)=>`<option value="${E}">${y}°</option>`).join("")}</select></label><canvas data-phi-canvas width="500" height="260" aria-label="Phi intensity cut"></canvas></section></div><p>Complex amplitude is A in E(r) = A exp(ikr) / r, in ${t(h.amplitude_units)}. Phase origin: ${t(h.phase_origin_um.join(", "))} µm.</p><div class="farfield-actions"><button data-result-json>Export result JSON</button><button data-csv>Export direction CSV</button></div><details><summary>Result identity and admission</summary><p>Request digest: <code>${t(h.request_digest)}</code></p><pre>${t(JSON.stringify(h.report,null,2))}</pre></details>`,c("[data-scale]").onchange=w,c("[data-phi-cut]").onchange=w,c("[data-theta-cut-select]").onchange=w,c("[data-result-json]").onclick=()=>Cr(h,"farfield-result.json"),c("[data-csv]").onclick=()=>{const y=[["theta_deg","phi_deg","sx","sy","sz","intensity_reduced_EH_s2_m2_per_sr","relative_intensity","Ax_real","Ay_real","Az_real","Ax_imag","Ay_imag","Az_imag"]];h.theta_deg.forEach((E,S)=>h.phi_deg.forEach((b,R)=>{const I=S*h.phi_deg.length+R;y.push([E,b,...h.directions[I],h.intensity[S][R],h.relative_intensity[S][R],...h.electric_real[I],...h.electric_imag[I]])})),Cr(y.map(E=>E.join(",")).join(`
`)+`
`,"farfield-directions.csv","text/csv")},w()}function w(){const y=c("[data-scale]").value==="raw"?h.intensity:h.relative_intensity,E=Math.max(0,...y.flat()),S=y.length,b=y[0].length,R=c("[data-heat]"),I=R.getContext("2d");I.clearRect(0,0,R.width,R.height);const L=65,z=20,N=R.width-L-25,F=R.height-z-55;for(let B=0;B<S;B++)for(let $=0;$<b;$++){const K=E>0?y[B][$]/E:0;I.fillStyle=`hsl(${240-240*K} 85% ${25+30*K}%)`,I.fillRect(L+$*N/b,z+B*F/S,N/b+1,F/S+1)}I.fillStyle="#26394c",I.font="14px sans-serif",I.fillText(`Phi (degrees): ${h.phi_deg[0]} to ${h.phi_deg.at(-1)}`,L,R.height-12),I.fillText(`Theta ${h.theta_deg[0]}°`,4,z+12),I.fillText(`${h.theta_deg.at(-1)}°`,18,z+F),c("[data-range]").textContent=`Color range: 0 to ${E.toExponential(6)} ${c("[data-scale]").value==="raw"?h.intensity_units:"(relative)"}.`,A(c("[data-theta-canvas]"),h.theta_deg,y.map(B=>B[Number(c("[data-phi-cut]").value)]),"Theta (degrees)"),A(c("[data-phi-canvas]"),h.phi_deg,y[Number(c("[data-theta-cut-select]").value)],"Phi (degrees)")}function A(y,E,S,b){const R=y.getContext("2d"),I=Math.max(0,...S),L=65,z=25,N=y.width-85,F=y.height-75;R.clearRect(0,0,y.width,y.height),R.strokeStyle="#bccbd7",R.strokeRect(L,z,N,F),R.beginPath(),R.strokeStyle="#146ba5",S.forEach((B,$)=>{const K=L+(E[$]-E[0])/(E.at(-1)-E[0]||1)*N,ue=z+F-(I?B/I:0)*F;$?R.lineTo(K,ue):R.moveTo(K,ue)}),R.stroke(),R.fillStyle="#26394c",R.font="12px sans-serif",R.fillText(I.toExponential(2),3,z+5),R.fillText("0",45,z+F),R.fillText(`${b}: ${E[0]} to ${E.at(-1)}`,L,y.height-12)}return c("[data-close]").onclick=()=>l.close(),l.addEventListener("close",()=>{u=!0,d++,h=null,l.remove()},{once:!0}),l.showModal(),l}function xd(n,e,t,{plane:i=!1,prefix:s="spectrum."}={}){const a=n.sampling,r=[...i?[]:[["fft","FFT bins"]],["frequency","Uniform frequency"],["wavelength","Uniform wavelength"],["chebyshev","Chebyshev nodes"],["custom","Custom frequencies"]];return t("sample spacing",s+"sampling",a,r)+(a==="custom"?`<label class="monitor-custom">Frequencies (THz)<textarea data-frequency-table data-prefix="${s}" aria-label="Custom frequencies (THz)">${(n.custom_frequencies_hz||[]).map(o=>o*1e-12).join(`
`)}</textarea></label>`:a!=="fft"?`<label class="enabled-row"><input type="checkbox" data-path="${s}use_source_limits" ${n.use_source_limits?"checked":""}> Use source wavelength limits</label><fieldset ${n.use_source_limits?"disabled":""}>`+e("minimum wavelength",s+"wavelength_start",n.wavelength_start,"µm",{min:.001})+e("maximum wavelength",s+"wavelength_stop",n.wavelength_stop,"µm",{min:.001})+"</fieldset>"+e("frequency points",s+"frequency_points",n.frequency_points,"",{min:1,step:1})+(a==="chebyshev"?t("Chebyshev node rule",s+"chebyshev_nodes",n.chebyshev_nodes||"roots",[["roots","Roots (interior)"],["lobatto","Lobatto (include endpoints)"]])+`<label class="enabled-row"><input type="checkbox" data-path="${s}chebyshev_wavelength" ${n.chebyshev_wavelength?"checked":""}> Chebyshev nodes in wavelength</label>`:""):"")}function Zv(n,e,t,i){const s=n.record_fields??["Ex","Ey","Ez","Hx","Hy","Hz"],a=n.record_poynting??["x","y","z"],r=n.downsample_xyz??[n.downsample||1,n.downsample||1,n.downsample||1],o=(l,c,d)=>c.map(u=>`<label class="enabled-row"><input type="checkbox" data-record-family="${l}" value="${u}" ${d.includes(u)?"checked":""}> Record ${l==="record_poynting"?"P"+u:u}</label>`).join("");return i("normal axis","normal",n.normal,e.dimension==="2d"?["x","y"]:["x","y","z"])+["x","y","z"].filter(l=>l!==n.normal&&(e.dimension==="3d"||l!=="z")).map(l=>t("downsample "+l,"downsample_xyz."+"xyz".indexOf(l),r["xyz".indexOf(l)],"",{min:1,max:32,step:1})).join("")+i("spatial interpolation","spatial_interpolation",n.spatial_interpolation||"specified",[["specified","Specified plane"],["nearest","Nearest normal mesh node"]])+i("DFT accumulation precision","dft_precision",n.dft_precision||"field",[["field","Match solver precision"],["float64","Double precision"]])+o("record_fields",["Ex","Ey","Ez","Hx","Hy","Hz"],s)+o("record_poynting",["x","y","z"],a)+`<label class="enabled-row"><input type="checkbox" data-path="record_flux" ${n.record_flux!==!1?"checked":""}> Record signed flux</label><p class="property-help">Only fields required by the selected outputs are accumulated. Flux alone requires four tangential E/H components. Incident subtraction also requires storing those fields.</p><button data-action="flux-results">Open flux results</button>`}function Jv({state:n,api:e,esc:t,toast:i,commit:s,numeric:a,dropdown:r}){const o=document.createElement("dialog");o.className="monitor-dialog",document.body.append(o);const l=u=>o.querySelector(u);let c=0;function d(){o.querySelectorAll("[data-dismiss]").forEach(u=>u.onclick=()=>{c++,o.close()})}return{globals(){const u=structuredClone(n.project);u.global_monitor??(u.global_monitor={sampling:"frequency",wavelength_start:1.3,wavelength_stop:1.8,frequency_points:101,apodization:"none",apodization_center:2e-14,apodization_time_width:1e-14,custom_frequencies_hz:[],chebyshev_wavelength:!1});function h(){const m=u.global_monitor;o.innerHTML=`<div class="fsp-heading"><h2>Global monitor settings</h2><button data-dismiss>Close</button></div><fieldset ${n.mode!=="layout"?"disabled":""}>${xd(m,a,r,{plane:!0,prefix:""})}${r("apodization","apodization",m.apodization,["none","start","end","full"])}${a("apodization center","apodization_center",m.apodization_center*1e15,"fs",{scale:1e-15})}${a("apodization time width","apodization_time_width",m.apodization_time_width*1e15,"fs",{scale:1e-15})}<button data-apply>Apply monitor settings</button></fieldset><p class="monitor-status"></p>`,d(),o.querySelectorAll("[data-path]").forEach(x=>x.onchange=()=>{var f;m[x.dataset.path]=x.type==="checkbox"?x.checked:x.type==="number"?Number(x.value)*Number(x.dataset.scale||1):x.value,["sampling","use_source_limits"].includes(x.dataset.path)&&(m.sampling==="custom"&&!((f=m.custom_frequencies_hz)!=null&&f.length)&&(m.custom_frequencies_hz=[2e14]),h())});const _=l("[data-frequency-table]");_&&(_.onchange=()=>{m.custom_frequencies_hz=_.value.trim().split(/[\s,;]+/).filter(Boolean).map(x=>Number(x)*1e12)}),l("[data-apply]").onclick=async()=>{try{const x=await e("/validate",u);s(x.project),o.close()}catch(x){l(".monitor-status").textContent=x.message}}}h(),o.showModal()},async flux(){if(!n.job)throw Error("Run a project with a frequency monitor first.");const u=await e("/jobs/"+n.job),h=u.flux_monitors||[],m=await e("/jobs");o.innerHTML=`<div class="fsp-heading"><h2>Frequency fields / power flux</h2><button data-dismiss>Close</button></div><label>Monitor <select aria-label="Flux monitor">${h.map(x=>`<option value="${t(x.id)}">${t(x.name)} · +${x.normal}</option>`).join("")}</select></label><label>Reference run <select aria-label="Flux reference"><option value="">Raw signed flux</option>${m.filter(x=>x.id!==n.job&&x.flux_monitors.length).map(x=>`<option value="${x.id}">${t(x.name)} · ${x.id.slice(0,8)}</option>`).join("")}</select></label><label class="enabled-row"><input type="checkbox" aria-label="Subtract incident fields"> Subtract reference E/H before computing flux (reflection)</label><button data-plot-flux>Plot flux</button><button data-diffraction>Diffraction orders</button><button data-farfield>Closed-box far field</button><a href="/api/jobs/${n.job}/flux.csv">Export raw flux CSV</a><canvas></canvas><p class="monitor-status"></p><p>Flux is signed along the positive monitor normal. A reflected wave can be negative. Reference normalization requires identical sources, mesh, duration and unapodized monitors. For an air reference, freeze graded refinements before removing structures, then run both scenes with the same monitor IDs. Absolute watt calibration is not provided.</p>`,d();async function _(){const x=++c;try{const f=h.find(g=>g.id===l('[aria-label="Flux monitor"]').value),p=l('[aria-label="Flux reference"]').value,M=l('[aria-label="Subtract incident fields"]').checked;let v={...f,spectrum:f.flux,signed:!0,spectrum_label:`Wavelength (µm) · signed flux (${f.units})`};if(p){const g=await e(`/jobs/${n.job}/normalize-flux?reference=${encodeURIComponent(p)}&monitor=${encodeURIComponent(f.id)}&subtract_incident=${M}`);if(x!==c)return;v={...f,...g,spectrum:g.ratio,signed:!0,spectrum_label:"Wavelength (µm) · signed normalized flux"},l(".monitor-status").textContent=`${g.valid.filter(Boolean).length}/${g.valid.length} frequencies above the reference threshold. Reflection is negative for propagation opposite the positive normal.`}else l(".monitor-status").textContent=`${f.points} spatial samples · collocated E/H · ${f.flux.length} frequencies. Raw reduced flux is not normalized transmission.`;Os(l("canvas"),[v],!0,!0)}catch(f){x===c&&(l(".monitor-status").textContent=f.message,i(f.message))}}l("[data-diffraction]").onclick=async()=>{try{await qv({state:n,api:e,esc:t,toast:i}),o.close()}catch(x){i(x.message)}},l("[data-farfield]").onclick=async()=>{try{await Yv({state:n,api:e,esc:t,toast:i}),o.close()}catch(x){i(x.message)}},l("[data-plot-flux]").onclick=_,l("[data-plot-flux]").disabled=!h.length,o.showModal(),h.length?await _():l(".monitor-status").textContent="No raw flux recorded. Diffraction orders can use a stored six-field plane."}}}function Kv({state:n,api:e,esc:t,commit:i}){const s=document.createElement("dialog");s.className="boundary-dialog",document.body.append(s);const a=[["pml","PML"],["periodic","Periodic"],["bloch","Bloch"],["pec","PEC"],["antisymmetric","Anti-symmetric (PEC)"],["pmc","PMC"],["symmetric","Symmetric (PMC)"]],r=["x_min","x_max","y_min","y_max","z_min","z_max"];function o(){if(n.mode!=="layout")throw Error("Switch to Layout before editing boundaries.");const l=n.project,c=structuredClone(l);s.innerHTML=`<h2>Boundary conditions</h2><p>Apply the complete face configuration in one edit.</p><div class="dialog-buttons"><button data-boundary-preset="pmc">All PMC</button><button data-boundary-preset="pec">All PEC</button><button data-boundary-preset="pml">All PML</button></div>${r.map(u=>`<label class="property-row"><span>${t(u.replace("_"," "))}</span><select aria-label="${t(u.replace("_"," "))} boundary" data-face="${u}" ${u.startsWith("z_")&&c.region.dimension==="2d"?"disabled":""}>${a.map(([h,m])=>`<option value="${h}" ${c.region.boundaries[u].kind===h?"selected":""}>${m}</option>`).join("")}</select></label>`).join("")}<p class="property-help">PMC and magnetic symmetry support PEC/PMC walls and restricted endpoint CPML. Use real FP32, fixed Yee meshes, point electric sources and point E/H monitors. Mixed CPML additionally requires uniform equal-spacing axes and a fixed isotropic PML exterior. Periodic/Bloch mixing is unsupported. Active PML faces must have equal layers and sigma scale, kappa 1, alpha 0, polynomial 3 and alpha polynomial 0.</p><p class="property-help">Face selections change kinds only. The explicit profile button below also sets active PML parameters. Source, material and mesh settings are preserved. Bloch phases are cleared on axes changed away from Bloch.</p><button data-endpoint-profile>Set supported endpoint CPML profile</button><p class="property-help">Profile button: selected PML faces use default region layers, sigma scale 1, kappa 1, alpha 0, cubic grading. Endpoint target sampling differs from ordinary scalar-Yee PML. Keep sources/monitors outside PML and material in PML plus one cell equal to background.</p><p data-boundary-status role="status" aria-live="polite"></p><div class="dialog-actions"><button data-boundary-apply>Apply boundaries</button><button data-boundary-close>Cancel</button></div>`;const d=[...s.querySelectorAll("[data-face]")];s.querySelectorAll("[data-boundary-preset]").forEach(u=>u.onclick=()=>d.filter(h=>!h.disabled).forEach(h=>h.value=u.dataset.boundaryPreset)),s.querySelector("[data-endpoint-profile]").onclick=()=>{const u=d.filter(h=>!h.disabled&&h.value==="pml");u.forEach(h=>Object.assign(c.region.boundaries[h.dataset.face],{layers:null,sigma_scale:1,kappa:1,alpha:0,polynomial:3,alpha_polynomial:0})),s.querySelector("[data-boundary-status]").textContent=u.length?"Supported endpoint CPML profile staged for "+u.length+" selected PML faces. Apply to validate.":"Select at least one PML face first."},s.querySelector("[data-boundary-close]").onclick=()=>s.close(),s.querySelector("[data-boundary-apply]").onclick=async()=>{const u=[...s.querySelectorAll("button,select")],h=u.map(_=>_.disabled);u.forEach(_=>_.disabled=!0);const m=s.querySelector("[data-boundary-status]");m.textContent="Validating boundaries and project…";try{d.forEach(x=>c.region.boundaries[x.dataset.face].kind=x.value);for(const[x,f]of["x","y","z"].map((p,M)=>[p,M]))c.region.boundaries[x+"_min"].kind!=="bloch"&&c.region.boundaries[x+"_max"].kind!=="bloch"&&(c.region.bloch_phase[f]=0);const _=await e("/validate",c);if(n.project!==l||n.mode!=="layout")throw Error("The project changed. Close this dialog and open it again.");i(_.project),s.close()}catch(_){m.textContent=_.message}finally{u.forEach((_,x)=>_.disabled=h[x])}},s.showModal()}return{open:o}}const Ms=n=>structuredClone(n),Nt=n=>String(n??"").replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e]),vs=1024**3,Qv={validating:"Checking setup",preparing_modes:"Preparing port modes",admitting_material:"Checking material and memory limits",rasterizing:"Sampling project materials",calibration_and_forward:"Calibrating ports and solving fields",backward:"Calculating material derivatives",completed:"Results ready"},yd=n=>(n.sources||[]).find(e=>e.enabled!==!1);async function Yn(n,e){var s;const t=await fetch("/api/"+n,e===void 0?{}:{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)}),i=(s=t.headers.get("content-type"))!=null&&s.includes("json")?await t.json():await t.text();if(!t.ok)throw Error(typeof i.detail=="string"?i.detail:JSON.stringify(i.detail||i));return i}function xc(n,e,t="application/json"){const i=URL.createObjectURL(new Blob([n],{type:t})),s=document.createElement("a");s.href=i,s.download=e,s.click(),setTimeout(()=>URL.revokeObjectURL(i),1e3)}function e0(n){var o,l,c;const e=yd(n),t=(e==null?void 0:e.normal)||"x",i="xyz".indexOf(t),s=((l=(o=n.region)==null?void 0:o.size)==null?void 0:l[i])||4,a=((c=n.region)==null?void 0:c.mesh)||.1,r=d=>Math.round(d/a)*a;return{version:1,project:Ms(n),normal:t,ports:[{name:"left",coordinate_um:r(-s*.15),source_coordinate_um:r(-s*.25),direction:1,mode_indices:[0]},{name:"right",coordinate_um:r(s*.15),source_coordinate_um:r(s*.25),direction:-1,mode_indices:[0]}],num_modes:1,open_ports:null,execution:{device:"cpu",checkpoints:4,gpu_budget_bytes:null,host_budget_bytes:8*vs,resident_budget_bytes:null,network_budget_bytes:256*1024**2,output_budget_bytes:64*1024**2},objective:{output_channel:["right",0],input_channel:["left",0],quantity:"power"},differentiate_materials:[]}}function t0(n){var i;if((n==null?void 0:n.version)!==1||!((i=n.project)!=null&&i.region)||!Array.isArray(n.ports)||n.ports.length!==2||!n.execution||!["x","y","z"].includes(n.normal))throw Error("Choose a version 1 mode-network setup, not a Project file.");if(n.ports.some(s=>typeof s.name!="string"||!Array.isArray(s.mode_indices)))throw Error("The setup needs two named ports with mode lists.");if(!Array.isArray(n.differentiate_materials))throw Error("The setup needs a material selection list.");const e=s=>typeof s=="number"&&Number.isFinite(s);if(!Array.isArray(n.project.materials)||n.project.materials.some(s=>!s||typeof s.name!="string")||!Array.isArray(n.project.sources)||n.project.sources.some(s=>!s||typeof s!="object"))throw Error("The setup contains an invalid Project.");if(!Number.isInteger(n.num_modes)||n.num_modes<1||n.ports.some(s=>!e(s.coordinate_um)||!e(s.source_coordinate_um)||![1,-1].includes(s.direction)||!s.mode_indices.length||s.mode_indices.some(a=>!Number.isInteger(a)||a<0)))throw Error("Check the port coordinates, directions and mode indices.");const t=n.execution;if(!["cpu","cuda"].includes(t.device)||!Number.isInteger(t.checkpoints)||t.checkpoints<0||["host_budget_bytes","network_budget_bytes","output_budget_bytes"].some(s=>!e(t[s])||t[s]<=0)||["gpu_budget_bytes","resident_budget_bytes"].some(s=>t[s]!==null&&(!e(t[s])||t[s]<=0)))throw Error("The setup contains invalid execution limits.");if(n.open_ports!==null&&(!n.open_ports||!e(n.open_ports.cladding_epsilon)||!e(n.open_ports.mode_budget_bytes)||!e(n.open_ports.confinement_tolerance)||n.open_ports.target_neff!==null&&!e(n.open_ports.target_neff)))throw Error("The setup contains invalid open-guide settings.");if(n.objective!==null&&(!n.objective||!["real","imag","power"].includes(n.objective.quantity)||["input_channel","output_channel"].some(s=>!Array.isArray(n.objective[s])||n.objective[s].length!==2)))throw Error("The setup contains an invalid S objective.");return Ms(n)}async function n0(n,{toast:e=()=>{}}={}){if(!(n!=null&&n.region))throw Error("Open a project before setting up mode ports.");let t=e0(n),i=0,s=!1,a=null,r=!1,o=null,l=null;const c=new Set,d=document.createElement("dialog");d.className="mode-network-dialog",document.body.append(d);const u=L=>d.querySelector(L),h=L=>{u("[data-status]").textContent=L},m=L=>{h(L.message),e(L.message)},_=()=>t.ports.flatMap(L=>L.mode_indices.map(z=>[L.name,z])),x=()=>yd(t.project),f=(L,z,N,{type:F="number",optional:B=!1,step:$="any"}={})=>`<label>${Nt(L)}<input aria-label="${Nt(L)}" data-path="${z}" type="${F}" value="${Nt(N??"")}" ${F==="number"?`step="${$}"`:""} ${B?"data-optional":""}></label>`,p=(L,z,N,F)=>`<label>${Nt(L)}<select aria-label="${Nt(L)}" data-path="${z}">${F.map(([B,$])=>`<option value="${Nt(B)}" ${String(N)===String(B)?"selected":""}>${Nt($)}</option>`).join("")}</select></label>`;function M(){u("[data-run]").disabled=r||!!a||c.size>0;for(const L of["validate","python","export"])u(`[data-${L}]`).disabled=c.size>0;u("[data-cancel]").disabled=!a&&!r}function v(){i++,l=null,u("[data-results]").replaceChildren(),u("[data-downloads]").replaceChildren(),h(a?"Setup changed. The earlier run is still active; its result will not replace this setup.":"Setup changed. Validate before running.")}function g(L,z){const N=L.split(".");let F=t;for(const B of N.slice(0,-1))F=F[B];F[N.at(-1)]=z}function w(){const L=_().map(z=>[JSON.stringify(z),`${z[0]} · mode ${z[1]}`]);return`<label><input type="checkbox" data-objective ${t.objective?"checked":""}> Evaluate a selected S entry</label>${t.objective?p("S quantity","objective.quantity",t.objective.quantity,[["power","Power |S|²"],["real","Real S"],["imag","Imaginary S"]])+p("Output channel","objective.output_channel",JSON.stringify(t.objective.output_channel),L)+p("Input channel","objective.input_channel",JSON.stringify(t.objective.input_channel),L):""}`}function A(){const L=x(),z=t.project.materials||[];d.innerHTML=`<header><div><h2>Mode ports</h2><p>Two opposing fixed-mode ports · ${Nt(t.normal)} direction</p></div><button data-close>Close</button></header>
   <p>Closing this window cancels its active run. This setup uses its own copy of the current project. Main-scene edits do not change it. Mode profiles and port sections stay fixed; selected material derivatives apply only in the allowed interior.</p>
   <div class="mode-network-grid"><fieldset><legend>Port phase planes</legend>${t.ports.map((N,F)=>`<section class="mode-port-row"><h3>${F?"Right port · inward −":"Left port · inward +"}</h3>${f(`${F?"Right":"Left"} port name`,`ports.${F}.name`,N.name,{type:"text"})}${f(`${F?"Right":"Left"} phase plane (µm)`,`ports.${F}.coordinate_um`,N.coordinate_um)}${f(`${F?"Right":"Left"} source plane (µm)`,`ports.${F}.source_coordinate_um`,N.source_coordinate_um)}${f(`${F?"Right":"Left"} mode indices`,`ports.${F}.mode_indices`,N.mode_indices.join(", "),{type:"text"})}</section>`).join("")}
   ${f("Number of solved modes","num_modes",t.num_modes,{step:1})}<p>Phase planes and sources must align with the grid. Sources lie outside the two phase planes.</p></fieldset>
   <fieldset><legend>Guide and illumination</legend>${p("Transverse boundary","boundary",t.open_ports?"open":"periodic",[["periodic","Periodic cell"],["open","Open guide with PML"]])}
   ${t.open_ports?f("Cladding permittivity","open_ports.cladding_epsilon",t.open_ports.cladding_epsilon)+f("Target effective index","open_ports.target_neff",t.open_ports.target_neff,{optional:!0})+f("Mode budget (GiB)","open_ports.mode_budget_bytes",t.open_ports.mode_budget_bytes/vs)+f("Maximum tail fraction","open_ports.confinement_tolerance",t.open_ports.confinement_tolerance):""}
   <p>Propagation normal: <strong>${Nt(t.normal)}</strong>, from the enabled source. Boundary choices must match the project.</p>
   ${L?f("Carrier wavelength (µm)","carrier",L.wavelength)+f("Pulse cycles","cycles",L.pulse_cycles??2):"<p>Add one enabled plane source in the main project, then reopen this setup.</p>"}
   ${f("Time steps","project.region.steps",t.project.region.steps,{step:1})}<p>Requires one soft Gaussian plane source. Material, source and boundary support are checked by validation.</p></fieldset>
   <fieldset><legend>Execution</legend>${p("Compute device","execution.device",t.execution.device,[["cpu","CPU"],["cuda","CUDA GPU"]])}${f("Checkpoints","execution.checkpoints",t.execution.checkpoints,{step:1})}
   ${[["Host budget (GiB)","host_budget_bytes"],["GPU budget (GiB)","gpu_budget_bytes"],["Resident budget (GiB)","resident_budget_bytes"],["Network budget (GiB)","network_budget_bytes"],["Output budget (GiB)","output_budget_bytes"]].map(([N,F])=>f(N,`execution.${F}`,t.execution[F]==null?null:t.execution[F]/vs,{optional:["gpu_budget_bytes","resident_budget_bytes"].includes(F)})).join("")}<p>Blank GPU or resident limits use backend defaults. Limits include the separately admitted solver and fixed mode preparation.</p></fieldset>
   <fieldset><legend>Objective and material derivatives</legend><div data-objective-controls>${w()}</div><h3>Differentiate permittivity</h3>${z.map(N=>`<label class="mode-material"><input type="checkbox" data-material="${Nt(N.name)}" ${t.differentiate_materials.includes(N.name)?"checked":""}> ${Nt(N.name)} <small>${Nt(N.model||"dielectric")}</small></label>`).join("")||"<p>No named materials in this project.</p>"}<p>Choose an objective to request material derivatives. Fixed source, port and PML regions are excluded. This does not differentiate the eigenmodes.</p></fieldset></div>
   <div class="mode-network-actions"><button data-import>Import setup</button><button data-export>Export setup JSON</button><button data-python>Export Python</button><input data-file type="file" accept=".json,application/json" hidden><button data-validate>Validate setup</button><button data-run>Run mode network</button><button data-cancel>Cancel run</button></div>
   <p data-status role="status">Ready to validate. Validation does not run the field simulation.</p><div data-results></div><div data-downloads></div>`,y(),M()}function y(){d.querySelectorAll("[data-path]").forEach(L=>{const z=N=>{try{const F=L.dataset.path;let B=L.value;if(L.type==="number"){if(B===""&&L.hasAttribute("data-optional"))B=null;else{if(B.trim()===""||!Number.isFinite(Number(B)))throw Error("Enter a finite number.");B=Number(B)}F.endsWith("_bytes")&&B!==null&&(B=Math.round(B*vs))}if(F==="boundary")t.open_ports=B==="open"?{cladding_epsilon:(t.project.region.background_index||1)**2,mode_budget_bytes:2*vs,target_neff:null,confinement_tolerance:1e-4}:null;else if(F.endsWith("mode_indices")){if(B=B.split(",").map($=>$.trim()),B.some($=>!/^\d+$/.test($)))throw Error("Enter nonnegative mode indices separated by commas.");g(F,B.map(Number))}else F.startsWith("objective.")&&F.endsWith("_channel")?g(F,JSON.parse(B)):F==="carrier"?x().wavelength=B:F==="cycles"?x().pulse_cycles=B:g(F,B);if(F.startsWith("ports.")&&t.objective){const $=_();t.objective.output_channel=$.find(K=>JSON.stringify(K)===JSON.stringify(t.objective.output_channel))||$.at(-1),t.objective.input_channel=$.find(K=>JSON.stringify(K)===JSON.stringify(t.objective.input_channel))||$[0]}c.delete(F),v(),M(),N&&c.size===0&&(F==="boundary"||F.startsWith("ports."))&&(A(),h("Setup changed. Validate before running."))}catch(F){c.add(L.dataset.path),v(),M(),m(F)}};L.addEventListener("input",()=>z(!1)),L.addEventListener("change",()=>z(!0))}),u("[data-objective]").onchange=L=>{t.objective=L.target.checked?{output_channel:_().at(-1),input_channel:_()[0],quantity:"power"}:null,v(),A()},d.querySelectorAll("[data-material]").forEach(L=>L.onchange=()=>{t.differentiate_materials=[...d.querySelectorAll("[data-material]:checked")].map(z=>z.dataset.material),v()}),u("[data-close]").onclick=()=>d.close(),u("[data-export]").onclick=()=>xc(JSON.stringify(t,null,2),"mode-network-v1.json"),u("[data-import]").onclick=()=>u("[data-file]").click(),u("[data-file]").onchange=async L=>{const z=L.target.files[0];if(!z)return;const N=++i;try{const F=t0(JSON.parse(await z.text()));if(s||N!==i)return;t=F,c.clear(),v(),A(),h("Setup imported. Validate before running.")}catch(F){!s&&N===i&&m(F)}finally{L.target.value=""}},u("[data-validate]").onclick=()=>E(),u("[data-python]").onclick=async()=>{const L=i,z=Ms(t);try{const N=await Yn("mode-networks/python",z);if(s||L!==i)return;const F=typeof N=="string"?N:N.python;if(typeof F!="string")throw Error("Python export returned no source.");xc(F,"mode_network.py","text/x-python"),h("Python exported for this setup.")}catch(N){!s&&L===i&&m(N)}},u("[data-run]").onclick=R,u("[data-cancel]").onclick=I}async function E(){const L=i,z=Ms(t);h("Validating setup…");try{const N=await Yn("mode-networks/validate",z);if(s||L!==i)return;l=JSON.stringify(z),h(`Setup validated. ${N.summary||"Ready for an explicitly requested run."}`)}catch(N){!s&&L===i&&m(N)}}function S(L){if(!Array.isArray(L.channels)||!Array.isArray(L.s_real)||!Array.isArray(L.s_imag))throw Error("The completed job has no S matrix.");const z=F=>`${F[0]} · ${F[1]}`,N=F=>Number(F).toPrecision(6);u("[data-results]").innerHTML=`<h3>Complex S matrix</h3><p>Rows: outgoing channel. Columns: incident channel. Phase planes: ${Nt((L.phase_planes_um||[]).join(", "))} µm.</p><div class="mode-network-table"><table><thead><tr><th>Output / input</th>${L.channels.map(F=>`<th>${Nt(z(F))}</th>`).join("")}</tr></thead><tbody>${L.channels.map((F,B)=>`<tr><th>${Nt(z(F))}</th>${L.channels.map(($,K)=>{const ue=L.s_real[B][K],ge=L.s_imag[B][K];return`<td>${N(ue)} ${ge<0?"−":"+"} ${N(Math.abs(ge))}i<small>|S|² ${N(ue*ue+ge*ge)}</small></td>`}).join("")}</tr>`).join("")}</tbody></table></div><p>Selected objective: ${L.objective==null?"Not requested":N(L.objective)}</p><h3>Material permittivity derivatives</h3>${Object.entries(L.material_gradients||{}).length?`<table><thead><tr><th>Material</th><th>d objective / d epsilon</th></tr></thead><tbody>${Object.entries(L.material_gradients).map(([F,B])=>`<tr><td>${Nt(F)}</td><td>${N(B)}</td></tr>`).join("")}</tbody></table>`:"<p>No material derivatives requested.</p>"}<details><summary>Run identity and preparation</summary><p>Request digest: <code data-request-digest>${Nt(L.request_digest||"Unavailable")}</code></p><pre>${Nt(JSON.stringify({modes:L.mode_summaries,admission:L.admission},null,2))}</pre></details>`}async function b(L){var z,N,F;if(!(s||a!==L))try{const B=await Yn(`mode-network-jobs/${encodeURIComponent(L.id)}`);if(s||a!==L)return;const $=["completed","failed","cancelled","canceled"].includes(B.status);if(L.generation===i){const K=typeof B.progress=="string"?B.progress:((z=B.progress)==null?void 0:z.message)||Qv[(N=B.progress)==null?void 0:N.phase]||((F=B.progress)==null?void 0:F.phase);h(`${B.status}${K?" · "+K:""}`),B.status==="completed"&&(S(B.result),u("[data-downloads]").innerHTML=`<a href="/api/mode-network-jobs/${encodeURIComponent(L.id)}/download" download>Download NPZ</a> <a href="/api/mode-network-jobs/${encodeURIComponent(L.id)}/s.csv" download>Download S CSV</a>`),B.status==="failed"&&h(`Failed: ${typeof B.error=="string"?B.error:JSON.stringify(B.error||"See server log")}`)}else h($?"Earlier run finished. Validate and run the edited setup when ready.":"Earlier setup is still running. Cancel it before starting this setup.");if($){a=null,M();return}o=setTimeout(()=>b(L),750)}catch(B){!s&&a===L&&(m(B),o=setTimeout(()=>b(L),2e3))}}async function R(){if(a||r)return;const L=i,z=Ms(t);r=!0,M();try{if(l!==JSON.stringify(z)&&(h("Validating before submission…"),await Yn("mode-networks/validate",z)),s||L!==i)return;h("Submitting to the shared queue…");const N=await Yn("mode-network-jobs",z);if(!N.id)throw Error("Job submission returned no identifier.");if(s||L!==i){await Yn(`mode-network-jobs/${encodeURIComponent(N.id)}/cancel`,{});return}a={id:N.id,generation:L},h(N.status||"queued"),b(a)}catch(N){!s&&L===i&&m(N)}finally{r=!1,s||M()}}async function I(){if(r&&!a){i++,h("Submission cancelled. Any accepted worker will be stopped.");return}if(!a)return;const L=a;try{await Yn(`mode-network-jobs/${encodeURIComponent(L.id)}/cancel`,{}),!s&&a===L&&h("Cancellation requested. Waiting for the worker to stop.")}catch(z){s||m(z)}}return d.addEventListener("close",()=>{s=!0,i++,clearTimeout(o),a&&Yn(`mode-network-jobs/${encodeURIComponent(a.id)}/cancel`,{}).catch(()=>{}),d.remove()},{once:!0}),A(),d.showModal(),d}const i0={Waves:ou,FolderOpen:Vd,Save:Qd,FileCode2:Gd,Box:Nd,Cylinder:Bd,Circle:zd,Orbit:Xd,Scan:eu,Radio:Zd,MoveRight:jd,Activity:Ud,Copy:kd,Trash2:au,Maximize:Wd,PencilRuler:qd,Play:Yd,Square:iu,Settings2:tu,Undo2:ru,Redo2:Jd,GitCommitHorizontal:$d,CircleDot:Od,Shapes:nu,ChartNoAxesCombined:Fd,Terminal:su,Download:Hd,RefreshCw:Kd};try{for(const n of Object.keys(localStorage)){if(!n.startsWith("photonweave."))continue;const e="torchfdtd."+n.slice(12);localStorage.getItem(e)===null&&localStorage.setItem(e,localStorage.getItem(n))}}catch{}const ye=n=>document.querySelector(n),ni=n=>[...document.querySelectorAll(n)],ut=n=>String(n).replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e]),Be=n=>`<i data-lucide="${n}"></i>`,O={project:null,selected:"fdtd",mode:"layout",snap:!0,history:[],future:[],job:null,results:null,frame:0,tab:"geometry",bottom:"messages",dirty:!1};let st,bn,yc,ki,Jt;const Rr=[];ye("#app").innerHTML=`
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
<input id="file-input" type="file" accept=".json,.fsp" hidden><dialog id="dialog"><div id="dialog-content"></div></dialog><div id="toast" role="alert" hidden></div>`;function zs(){lu({icons:i0,attrs:{"stroke-width":1.65}})}function At(n,e="info"){Rr.push({text:n,kind:e,time:new Date().toLocaleTimeString("en-GB")}),ye("#messages").innerHTML=Rr.slice(-100).map(t=>`<div class="log ${t.kind}"><time>${t.time}</time><span>${ut(t.text)}</span></div>`).join(""),ye("#messages").scrollTop=ye("#messages").scrollHeight,ye("#log-count").textContent=Rr.length}function Bt(n){ye("#toast").textContent=n,ye("#toast").hidden=!1,setTimeout(()=>ye("#toast").hidden=!0,5e3)}async function yt(n,e){var i;const t=await fetch("/api"+n,e===void 0?{}:{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});if(!t.ok){let s;try{s=await t.json()}catch{throw Error(`Server returned ${t.status}`)}throw Error(Array.isArray(s.detail)?s.detail.map(a=>a.loc.join(".")+": "+a.msg).join(`
`):s.detail||`Server returned ${t.status}`)}return(i=t.headers.get("content-type"))!=null&&i.includes("json")?t.json():t.text()}function Ss(){return[...O.project.structures,...O.project.sources,...O.project.monitors].find(n=>n.id===O.selected)}function Ao(n){return O.project.structures.some(e=>e.id===n)?"structures":O.project.sources.some(e=>e.id===n)?"sources":"monitors"}function _t(){O.history.push(JSON.stringify(O.project)),O.history.length>80&&O.history.shift(),O.future=[]}function ct(){O.dirty=!0;try{localStorage.setItem("torchfdtd.project.v1",JSON.stringify(O.project))}catch{Bt("Browser storage is full. Use Save to keep this project before closing or reloading."),At("Automatic browser save failed. Export this project with Save to retain the current settings.","warning")}}function s0(n,e,t=!0){Object.assign([...O.project.structures,...O.project.sources,...O.project.monitors].find(i=>i.id===n)||{},e),t&&(ct(),kt(),Xt(),it())}function Sn(n){O.selected=n,Xt(),kt(),st==null||st.render()}function vn(n){O.mode=n,ye("#mode-badge").textContent=n.toUpperCase(),ye("#mode-badge").className="mode-badge "+n,ni(".editable").forEach(e=>e.disabled=n!=="layout"),ye("#run-button").disabled=n!=="layout",ye("#stop-button").disabled=n!=="running",ye("#layout-button").disabled=n==="running",ni("[data-example]").forEach(e=>e.disabled=n==="running"),kt(),st==null||st.render()}function Xt(){const n=O.project;ye("#project-title").textContent=n.name,ye("#object-count").textContent=n.structures.length+n.sources.length+n.monitors.length+1;const e=(t,i,s="")=>`<button class="tree-row ${O.selected===t.id?"selected":""} ${s}" data-select="${ut(t.id)}"><span class="tree-icon">${Be(i)}</span><span>${ut(t.name)}</span>${t.enabled===!1?"<small>off</small>":""}</button>`;ye("#tree").innerHTML=`<div class="tree-root">${Be("folder-open")} model</div>${e({id:"fdtd",name:"FDTD"},"scan","region-row")}<div class="tree-group">Structures <span>${n.structures.length}</span></div>${n.structures.map(t=>e(t,{rectangle:"box",circle:"cylinder",ring:"circle",sphere:"orbit",polygon:"shapes"}[t.kind])).join("")}<div class="tree-group">Sources <span>${n.sources.length}</span></div>${n.sources.map(t=>e(t,"radio","source-row")).join("")}<div class="tree-group">Monitors <span>${n.monitors.length}</span></div>${n.monitors.map(t=>e(t,"activity","monitor-row")).join("")}`,zs()}function Je(n,e,t,i="",s={}){var a;return`<label class="property-row"><span>${n}</span><div><input aria-label="${n}" data-path="${e}" data-scale="${s.scale||1}" ${s.reciprocal?`data-reciprocal="${s.reciprocal}"`:""} type="number" value="${Number(((a=t.toPrecision)==null?void 0:a.call(t,12))??t)}" step="${s.step||"any"}" ${s.min!==void 0?`min="${s.min}"`:""}><small>${i}</small></div></label>`}function Pt(n,e,t,i){return`<label class="property-row"><span>${n}</span><select aria-label="${n}" data-path="${e}">${i.map(s=>{const[a,r]=Array.isArray(s)?s:[s,s];return`<option value="${ut(a)}" ${a===t?"selected":""}>${ut(r)}</option>`}).join("")}</select></label>`}function Wt(n,e){return`<section class="property-section"><h3>${n}</h3>${e}</section>`}function kt(){var s,a;if(!O.project)return;const n=O.project,e=Ss(),t=n.region;ye("#property-type").textContent=e?e.kind||"monitor":"solver";let i="";if(!e)i=`<div class="object-title">${Be("scan")}<div><strong>FDTD</strong><small>Simulation region</small></div></div>`,i+=Wt("General",Pt("dimension","dimension",t.dimension,[["2d","2D (XY)"],["3d","3D"]])+Pt("resource","backend",t.backend,[["auto","GPU if available"],["cuda","GPU · CUDA"],["cpu","CPU"]])+Pt("precision","precision",t.precision,["float32","float64"])+Pt("CUDA kernel","cuda_kernel",t.cuda_kernel||"torch",[["torch","PyTorch reference"],["fused","Fused Yee / CPML (experimental)"]])+Pt("Frequency monitor kernel","cuda_monitor_kernel",t.cuda_monitor_kernel||"torch",[["torch","PyTorch reference"],["fused","Shared CUDA plane DFT (experimental)"]])),i+=Wt("Geometry",t.size.map((r,o)=>Je("xyz"[o]+" span","size."+o,r,"µm",{min:.01})).join("")),i+=Wt("Mesh settings",wv(t,Je,Pt,ut)),i+=Wt("Boundary conditions",Je("PML layers","pml_cells",t.pml_cells,"cells",{step:1,min:3})+["x","y",...t.dimension==="3d"?["z"]:[]].map((r,o)=>["min","max"].map(c=>{const d=r+"_"+c,u=t.boundaries[d];return Pt(r+" "+c+" bc","boundaries."+d+".kind",u.kind,[["pml","PML"],["periodic","Periodic"],["bloch","Bloch"],["pec","PEC"],["antisymmetric","Anti-symmetric (PEC)"],["pmc","PMC"],["symmetric","Symmetric (PMC)"]])+(u.kind==="pml"?`<details class="boundary-options"><summary>${r} ${c} PML settings</summary>${Je(r+" "+c+" layers","boundaries."+d+".layers",u.layers??t.pml_cells,"cells",{step:1,min:3})}<label class="enabled-row"><input type="checkbox" data-boundary-default="${d}" ${u.layers===null?"checked":""}> Use default layers</label>${Je("sigma scale","boundaries."+d+".sigma_scale",u.sigma_scale)}${Je("kappa","boundaries."+d+".kappa",u.kappa)}${Je("alpha","boundaries."+d+".alpha",u.alpha)}${Je("polynomial","boundaries."+d+".polynomial",u.polynomial)}${Je("alpha polynomial","boundaries."+d+".alpha_polynomial",u.alpha_polynomial)}</details>`:"")}).join("")+(t.boundaries[r+"_min"].kind==="bloch"?Je("Bloch phase "+r,"bloch_phase."+o,t.bloch_phase[o],"rad"):"")).join("")+Je("background index","background_index",t.background_index,"",{min:1})+'<button data-action="boundary-editor">Edit six faces together</button><p class="property-help">Cyclic boundaries are paired. Bloch phase is the phase gained over one positive unit-cell translation. PMC and magnetic symmetry support PEC/PMC walls or restricted endpoint CPML with point sources/monitors. Use the six-face editor for the supported CPML profile.</p>'),i+=Wt("Simulation time",Je("dt stability factor","courant_factor",t.courant_factor??.99,"",{min:.01})+Je("time steps","steps",t.steps,"",{step:1,min:10})+Je("snapshot every","snapshot_interval",t.snapshot_interval,"steps",{step:1,min:1})),i+=Wt("Termination and diagnostics",Xv(t,Je)),i+=Wt("Field output",Pt("component","field",t.field,["Ex","Ey","Ez","Hx","Hy","Hz"])+Pt("plane normal","slice_axis",t.slice_axis,t.dimension==="2d"?["z"]:["x","y","z"])+Je("plane position","slice_position",t.slice_position,"µm")+Pt("field display","complex_display",t.complex_display,[["real","Real"],["imag","Imaginary"],["magnitude","Magnitude"],["phase","Phase (rad)"]]));else{const r=Ao(e.id),o=r==="structures",l=r==="sources";i=`<div class="object-title">${Be(o?"box":l?"radio":"activity")}<div><strong>${ut(e.name)}</strong><small>${o?e.kind:l?e.kind+" source":e.kind==="field"?"Frequency / flux monitor":"Point time monitor"}</small></div></div><label class="property-row name-row"><span>name</span><input aria-label="name" data-path="name" value="${ut(e.name)}"></label><label class="enabled-row"><input type="checkbox" data-path="enabled" ${e.enabled?"checked":""}> Enabled in simulation</label>`;const c=e.kind==="field"?[0,1,2].filter(d=>d!=="xyz".indexOf(e.normal)&&(t.dimension==="3d"||d<2)):e.kind==="tfsf"?[0,1,2].filter(d=>t.dimension==="3d"||d<2):e.kind==="rectangle"||e.kind==="plane"?[0,1,2]:["circle","ring","polygon"].includes(e.kind)?[2]:[];if(i+=Wt("Geometry",e.center.map((d,u)=>Je("xyz"[u],"center."+u,d,"µm")).join("")+c.map(d=>Je("xyz"[d]+" span","size."+d,e.size[d],"µm",{min:o?.001:0})).join("")+(["circle","sphere","ring"].includes(e.kind)?Je("radius","radius",e.radius,"µm",{min:.001}):"")+(e.kind==="ring"?Je("inner radius","inner_radius",e.inner_radius,"µm",{min:0}):"")+(o?Lv(e,Je):"")),o&&(i+=Wt("Material",Pt("material","material",e.material,n.materials.map(d=>d.name))+`<div class="static-row">refractive index <b>${(((s=n.materials.find(d=>d.name===e.material))==null?void 0:s.model)||"dielectric")==="dielectric"?(a=n.materials.find(d=>d.name===e.material))==null?void 0:a.index:"dispersive"}</b></div>`+Je("mesh order","mesh_order",e.mesh_order,"",{step:1,min:1})+'<p class="property-help">Lower order takes priority in overlaps. Open Materials to edit dielectric, Drude or Lorentz parameters and inspect n/k.</p>'),i+=Wt("Rotation",Dv(e,Je,Pt))),o){const d=n.structures.findIndex(u=>u.id===e.id);i+=Wt("Structure order",`<button data-action="structure-earlier" ${d===0?"disabled":""}>Move earlier in tree</button><button data-action="structure-later" ${d===n.structures.length-1?"disabled":""}>Move later in tree</button><p class="property-help">When mesh orders are equal, the later structure takes priority in overlaps.</p>`)}if(l){e.time_definition??(e.time_definition="cycles"),e.pulse_length??(e.pulse_length=2e-14),e.pulse_offset??(e.pulse_offset=5e-14),e.phase??(e.phase=0);const d=e.use_global_source?n.global_source:e;i+=Wt("Source settings",Bv(e,t,Je,Pt)+kv(e,Je,Pt)+`<label class="enabled-row"><input type="checkbox" data-path="use_global_source" ${e.use_global_source?"checked":""} ${n.global_source?"":"disabled"}> Use global source settings</label><button data-action="global-source">Edit global source settings</button>${n.global_source?"":'<p class="property-help">Imported global settings are unavailable. Configure them before enabling inheritance.</p>'}`+(d?`<fieldset ${e.use_global_source?"disabled":""}>`+vd(d,Je,Pt)+'<button data-action="source-signal">Load / edit time signal</button></fieldset>':"")+Je("phase","phase",e.phase,"deg")+Je("amplitude","amplitude",e.amplitude,"",{min:.001})+`<button data-action="source-preview">Preview time signal / spectrum</button><p class="property-help">${e.kind==="tfsf"?"Closed box with six-face E/H corrections and a live incident Yee line. Source preview shows the incident field at the entry face.":e.injection==="oneway"?"Normal-incidence discrete E/H plane with an eight-cell incident-line delay. Amplitude scales the incident-line soft drive. Source preview includes both corrections.":e.kind==="plane"?"Bidirectional E/H sheet. Bloch axes apply the unit-cell phase across the sheet.":"Reduced electric or magnetic point excitation. Magnetic sources use the H half-step time. Vector orientation may excite both 2D polarizations."}</p>`)}if(!o&&!l){e.spectrum??(e.spectrum={sampling:"fft",wavelength_start:1.3,wavelength_stop:1.8,frequency_points:101,apodization:"hann",apodization_center:2e-14,apodization_time_width:1e-14});const d=e.use_global_monitor?n.global_monitor:e.spectrum,u=e.use_global_monitor&&e.inherit_apodization!==!1,h=u?d:e.spectrum;i+=Wt("Monitor settings",(e.kind==="field"?Zv(e,t,Je,Pt):Pt("component","component",e.component,["Ex","Ey","Ez","Hx","Hy","Hz"])+'<p class="property-help">Records one Yee field component at every time step. DFT downsampling affects spectral processing only.</p>')+Je("DFT time downsample","time_downsample",e.time_downsample||1,"",{min:1,step:1})+`<label class="enabled-row"><input type="checkbox" data-path="use_global_monitor" ${e.use_global_monitor?"checked":""}> Use global monitor settings</label>${e.use_global_monitor?`<label class="enabled-row"><input type="checkbox" data-path="inherit_apodization" ${u?"checked":""}> Inherit global apodization</label>`:""}<button data-action="global-monitor">Edit global monitor settings</button>`),i+=Wt("Frequency / wavelength",`<fieldset ${e.use_global_monitor?"disabled":""}>`+xd(d,Je,Pt,{plane:e.kind==="field"})+'</fieldset><p class="property-help">DFT values are unnormalized field integrals. Power ratios require a matching air reference.</p>'),i+=Wt("Apodization",`<fieldset ${u?"disabled":""}>`+Pt("apodization","spectrum.apodization",h.apodization,[["none","None"],["start","Start"],["end","End"],["full","Full"],...e.kind==="field"?[]:[["hann","Hann (legacy FFT)"]]])+(["start","end","full"].includes(h.apodization)?Je("apodization center","spectrum.apodization_center",h.apodization_center*1e15,"fs",{min:0,scale:1e-15})+Je("apodization time width","spectrum.apodization_time_width",h.apodization_time_width*1e15,"fs",{min:.001,scale:1e-15})+'<p class="property-help">Width is the intensity FWHM of the Gaussian window. Apodized spectra are not normalized transmission or absolute intensity.</p>':"")+"</fieldset>")}}ye("#properties").innerHTML=`<fieldset ${O.mode!=="layout"?"disabled":""}>${i}</fieldset>`,zs(),a0(),ye("#properties").querySelectorAll("[data-path]").forEach(r=>r.addEventListener("change",()=>{var u;if(O.mode!=="layout")return;_t();const o=Ss()||n.region,l=r.dataset.path.split(".");l[0]==="downsample_xyz"&&!o.downsample_xyz&&(o.downsample_xyz=[o.downsample||1,o.downsample||1,o.downsample||1]);let c=o;for(const h of l.slice(0,-1))c=c[h];const d=r.type==="checkbox"?r.checked:r.type==="number"?r.dataset.reciprocal?Number(r.dataset.reciprocal)/Number(r.value):Number(r.value)*Number(r.dataset.scale||1):r.value;if(l.length===1&&n.sources.includes(o)?_d(o,l[0],d):c[l.at(-1)]=d,o===t&&l[0]==="mesh_type"&&d==="graded"&&(t.material_sampling="yee",t.mesh_max=Math.max(t.mesh_max,t.mesh)),o===t&&l[0]==="interface_method"&&d==="subpixel"&&(t.material_sampling="yee"),o===t&&l[0]==="mesh_type"&&d!=="explicit"&&(t.mesh_coordinates=null),n.sources.includes(o)&&["injection","normal"].includes(l[0])&&gc(o,t,{boundaries:!0}),o.kind==="field"&&l[0]==="normal"){const h=o.size.indexOf(0),m="xyz".indexOf(d);h!==m&&(o.size[h]=Math.min(1,t.size[h]/2),o.size[m]=0)}if(l.join(".")==="spectrum.sampling"&&d==="custom"&&!((u=o.spectrum.custom_frequencies_hz)!=null&&u.length)&&(o.spectrum.custom_frequencies_hz=[2e14]),l.join(".")==="spectrum.sampling"&&r.value!=="fft"&&o.spectrum.apodization==="hann"&&(o.spectrum.apodization="none"),l.join(".")==="spectrum.sampling"&&d==="fft"&&(o.spectrum.use_source_limits=!1),o===t&&l[0]==="boundaries"&&l[2]==="kind"){const[h,m]=l[1].split("_"),_=r.value,x=h+"_"+(m==="min"?"max":"min");(["periodic","bloch"].includes(_)||["periodic","bloch"].includes(t.boundaries[x].kind))&&(t.boundaries[x].kind=_),_!=="bloch"&&(t.bloch_phase["xyz".indexOf(h)]=0)}o===t&&l[0]==="dimension"&&t.dimension==="2d"&&(t.slice_axis="z",t.slice_position=0,t.bloch_phase[2]=0,t.boundaries.z_min.kind="pml",t.boundaries.z_max.kind="pml",n.sources.forEach(h=>h.center[2]=0),n.monitors.forEach(h=>{h.center[2]=0,h.kind==="field"&&h.normal==="z"&&(h.normal="x",h.size[0]=0,h.size[2]=1)})),o===t&&l[0]==="dimension"&&t.mesh_type==="explicit"&&(t.mesh_type="uniform",t.mesh_coordinates=null),o===t&&["size","mesh","dimension"].includes(l[0])&&n.sources.forEach(h=>gc(h,t)),ct(),Xt(),st.render(),kt(),it()})),ye("#properties").querySelectorAll("[data-record-family]").forEach(r=>r.onchange=()=>{if(O.mode!=="layout")return;_t();const o=r.dataset.recordFamily,l=o==="record_fields"?["Ex","Ey","Ez","Hx","Hy","Hz"]:["x","y","z"],c=new Set(e[o]??l);r.checked?c.add(r.value):c.delete(r.value),e[o]=l.filter(d=>c.has(d)),ct(),kt(),it()}),ye("#properties").querySelectorAll("[data-source-vector]").forEach(r=>r.onchange=()=>{O.mode==="layout"&&(_t(),e.theta=r.checked?e.component[1]==="z"?0:90:null,e.phi=e.component[1]==="y"?90:0,ct(),kt(),st.render(),it())}),ye("#properties").querySelectorAll("[data-source-family]").forEach(r=>r.onchange=()=>{O.mode==="layout"&&(_t(),e.component=r.value+e.component[1],ct(),kt(),st.render(),it())}),ye("#properties").querySelectorAll("[data-frequency-table]").forEach(r=>r.onchange=()=>{O.mode==="layout"&&(_t(),e.spectrum.custom_frequencies_hz=r.value.trim().split(/[\s,;]+/).filter(Boolean).map(o=>Number(o)*1e12),ct(),it())}),ye("#properties").querySelectorAll("[data-run-field-limit]").forEach(r=>r.onchange=()=>{O.mode==="layout"&&(_t(),t.run_control.field_limit=r.checked?1e6:null,ct(),kt(),it())}),ye("#properties").querySelectorAll("[data-axis-steps]").forEach(r=>r.onchange=()=>{O.mode==="layout"&&(_t(),t.mesh_steps=r.checked?[t.mesh,t.mesh,t.mesh]:null,r.checked&&(t.material_sampling="yee"),ct(),kt(),st.render(),it())}),ye("#properties").querySelectorAll("[data-fixed-dt]").forEach(r=>r.onchange=()=>{O.mode==="layout"&&(_t(),t.time_step_override=r.checked?((Jt==null?void 0:Jt.dt_fs)??.01)*5e-16:null,ct(),kt(),it())})}function a0(){ni("[data-boundary-default]").forEach(n=>n.onchange=()=>{if(O.mode!=="layout")return;_t();const e=O.project.region;e.boundaries[n.dataset.boundaryDefault].layers=n.checked?null:e.pml_cells,ct(),kt(),st.render(),it()})}async function it(){try{return Jt=await yt("/validate",O.project),ye("#mesh-summary").innerHTML=`<strong>${Jt.shape.join(" × ")}</strong><span>${Jt.cells.toLocaleString()} cells · ~${Number(Jt.estimated_memory_mb).toFixed(1)} MB</span>${Jt.mesh_type==="graded"?`<span>${Jt.cell_reduction_percent.toFixed(1)}% fewer cells than uniform</span>`:""}<span>Δt ${Jt.dt_fs.toFixed(4)} fs · ${Jt.duration_fs.toFixed(1)} fs total</span>${Jt.warnings.map(n=>`<p class="warning">${ut(n)}</p>`).join("")}`,ye("#footer-grid").textContent=Jt.shape.join(" × ")+" cells",!0}catch(n){return ye("#mesh-summary").innerHTML=`<p class="warning error">${ut(n.message)}</p>`,!1}}function r0(n){var s;if(O.mode!=="layout"||!O.project||!st)return;_t();const e=crypto.randomUUID(),t={id:e,name:n+"_"+(O.project.structures.length+O.project.sources.length+O.project.monitors.length+1),center:[0,0,0],enabled:!0};if(["rectangle","circle","ring","sphere","polygon"].includes(n))O.project.structures.push(ka({...t,kind:n,size:[1,1,.5],radius:.5,inner_radius:.3,rotation:0,material:((s=O.project.materials.find(a=>a.name.startsWith("SiN")))==null?void 0:s.name)||O.project.materials[0].name,mesh_order:2}));else if(n==="field")O.project.monitors.push({...t,kind:"field",component:"Ez",normal:"x",size:[0,Math.min(1,O.project.region.size[1]/3),O.project.import_provenance&&O.project.region.dimension==="2d"?1:Math.min(1,O.project.region.size[2]/3)],downsample:1,use_global_monitor:!1,spectrum:{sampling:"frequency",wavelength_start:1.3,wavelength_stop:1.8,frequency_points:41,apodization:"none",apodization_center:2e-14,apodization_time_width:1e-14}});else if(n==="monitor")O.project.monitors.push({...t,component:"Ez",...O.project.import_provenance?{spectrum:{sampling:"fft",apodization:"none"}}:{}});else if(n==="tfsf"){const a=O.project.region,r=a.dimension==="2d"?2:3,o=a.size.map((l,c)=>c>=r?0:Math.max(3*a.mesh,Math.min(2,l-2*(Math.max(a.boundaries["xyz"[c]+"_min"].layers??a.pml_cells,a.boundaries["xyz"[c]+"_max"].layers??a.pml_cells)+3)*a.mesh)));O.project.sources.push({...t,kind:n,injection:"oneway",normal:"x",direction:"+",size:o,component:"Ez",wavelength:1.55,amplitude:1,pulse:"gaussian",pulse_cycles:3,incident_pml_cells:96})}else O.project.sources.push({...t,kind:n,size:[0,1,0],component:"Ez",wavelength:1.55,amplitude:1,pulse:"gaussian",pulse_cycles:3});const i=O.project.sources.find(a=>a.id===e);i&&O.project.import_provenance&&Object.assign(i,{time_definition:"standard",pulse_length:2e-14,pulse_offset:5e-14}),ct(),Sn(e),it(),At("Added "+t.name+". Drag in a viewport or edit its properties.")}function bc(n,e,t="application/json"){const i=URL.createObjectURL(new Blob([n],{type:t})),s=document.createElement("a");s.href=i,s.download=e,s.click(),setTimeout(()=>URL.revokeObjectURL(i),1e3)}function Bn(n){O.tab=n,ni("[data-tab]").forEach(e=>e.classList.toggle("active",e.dataset.tab===n)),ye("#viewports").hidden=n!=="geometry",ye("#field-view").hidden=n!=="fields",n==="geometry"?st.render():Hn()}function bd(n){O.bottom=n,ni("[data-bottom]").forEach(e=>e.classList.toggle("active",e.dataset.bottom===n)),ye("#messages").hidden=n!=="messages",ye("#python-editor").hidden=n!=="python",n==="python"&&yt("/python",O.project).then(e=>ye("#python-editor").value=e).catch(e=>Bt(e.message))}function Hn(){var r,o,l;const n=O.project.region,e="xyz".indexOf(n.slice_axis),t=(((o=(r=O.results)==null?void 0:r.summary)==null?void 0:o.actual_size_um)||n.size).filter((c,d)=>d!==e),i=O.results,s=(i==null?void 0:i.frames[O.frame])||O.liveFrame;ye("#field-label").textContent=n.field+" · "+n.complex_display+" · "+["YZ","XZ","XY"][e]+" plane",ye("#frame-label").textContent=i?"Step "+i.frame_steps[O.frame]:"Live field",ye("#frame-slider").max=Math.max(0,((i==null?void 0:i.frames.length)||1)-1),ye("#frame-slider").value=O.frame;const a=O.monitors||[];a.some(c=>c.id===O.plotMonitor)||(O.plotMonitor=(l=a[0])==null?void 0:l.id),ye("#plot-monitor").innerHTML=a.map(c=>`<option value="${ut(c.id)}" ${c.id===O.plotMonitor?"selected":""}>${ut(c.name)} · ${c.component}</option>`).join(""),ye("#plot-axis").hidden=!O.spectrum,Nv(ye("#field-canvas"),s,t,n.field+" "+n.complex_display,n.complex_display==="phase"?Math.PI:i==null?void 0:i.max,n.complex_display==="phase"?"rad":"reduced field"),Os(ye("#monitor-canvas"),a.filter(c=>c.id===O.plotMonitor),O.spectrum,ye("#plot-axis").value==="wavelength")}async function o0(){if(O.mode==="layout"){if(!await it()){Bt("Fix the highlighted project settings before running.");return}try{O.results=null,O.monitors=null,O.liveFrame=null;const n=await yt("/jobs",O.project);O.job=n.id,localStorage.setItem("torchfdtd.activeJob",n.id),vn("running"),Bn("fields"),At("Submitted "+O.project.name+" · "+O.project.region.backend+" · "+O.project.region.precision),Jt.warnings.forEach(e=>At(e,"warning")),Ia()}catch(n){At(n.message,"error"),Bt(n.message)}}}async function Ia(){try{const n=await yt("/jobs/"+O.job),e=n.progress,t=Math.round(100*e.step/e.total);if(ye("#progress-bar").style.width=t+"%",ye("#progress-label").textContent=t+"%",ye("#status-text").textContent=n.status==="queued"?"Queued on solver":n.status==="running"?"Calculating fields…":n.status,O.liveFrame=e.frame,O.tab==="fields"&&Hn(),["completed","cancelled","failed"].includes(n.status)){if(n.status==="failed"){localStorage.removeItem("torchfdtd.activeJob"),vn("analysis"),At(n.error,"error"),Bt(n.error);return}ye("#status-text").textContent="Calculation complete · loading field results…";const i=await yt("/jobs/"+O.job+"/fields");let s=1e-20;i.frames.forEach(a=>a.forEach(r=>r.forEach(o=>s=Math.max(s,Math.abs(o))))),i.max=s,O.results=i,O.frame=Math.max(0,i.frames.length-1),O.monitors=n.monitors,localStorage.removeItem("torchfdtd.activeJob"),vn("analysis"),ye("#status-text").textContent=n.status,ye("#results-tree").innerHTML=`<button data-tab="fields">${Be("chart-no-axes-combined")} ${ut(O.project.region.field)} field snapshots</button>${n.monitors.map(a=>`<button data-tab="fields">${Be("activity")} ${ut(a.name)} · ${a.component}</button>`).join("")}<div class="run-summary"><b>${n.summary.seconds.toFixed(2)} s</b> solver loop<br>${n.summary.backend.toUpperCase()}${n.summary.cuda_graph?" · CUDA graph":""}${n.summary.cuda_kernel==="fused"?" · fused Yee / CPML":""}${n.summary.cuda_monitor_kernel==="fused"?" · shared plane DFT":""}<br>${n.summary.mcells_per_second.toFixed(1)} Mcells/s<br>${n.summary.gpu?ut(n.summary.gpu):"CPU"}<br>${n.summary.auto_shutoff?"Decay threshold reached":n.summary.cancelled?"Cancelled":"Step limit reached"}<br>${n.summary.steps} / ${n.summary.requested_steps??n.summary.steps} steps</div>`,zs(),Hn(),At(`${n.status}: ${n.summary.steps} steps in ${n.summary.seconds.toFixed(3)} s, ${n.summary.mcells_per_second.toFixed(1)} Mcells/s. Setup ${n.summary.setup_seconds.toFixed(2)} s.`),n.summary.warnings.forEach(a=>At(a,"warning"));return}yc=setTimeout(Ia,400)}catch(n){At("Connection lost: "+n.message+". Retrying the same job…","warning"),yc=setTimeout(Ia,2e3)}}function Mc(n){ye("#dialog-content").innerHTML=n+'<div class="dialog-actions"><button data-close>Close</button></div>',ye("#dialog").showModal(),zs()}function Sc(){d0.open()}const Md=Fv({esc:ut,toast:Bt,log:At}),l0=Ov({esc:ut,toast:Bt,log:At,getProject:()=>O.project,loadProject:async n=>{if(O.mode==="running")throw Error("Wait for the active simulation to finish before opening a scene.");const e=await yt("/validate",n);_t(),O.project=e.project,O.selected="fdtd",O.results=null,O.monitors=null,O.liveFrame=null,O.job=null,ye("#results-tree").innerHTML='<div class="muted empty-hint">Run to calculate the imported scene.</div>',ct(),vn("layout"),Bn("geometry"),Xt(),st.fit(),await it(),At("Opened independently converted FSP scene. Conversion differences are retained with the project.")}}),c0=zv({esc:ut,toast:Bt,log:At,getProject:()=>O.project,loadProject:async n=>{if(O.mode!=="layout")throw Error("Switch to Layout before importing geometry.");const e=await yt("/validate",n);_t(),O.project=e.project,O.selected="fdtd",O.results=null,O.monitors=null,O.liveFrame=null,O.job=null,ye("#results-tree").innerHTML='<div class="muted empty-hint">Run to calculate the imported scene.</div>',ct(),vn("layout"),Bn("geometry"),Xt(),st.fit(),await it()}}),d0=$v({state:O,api:yt,esc:ut,toast:Bt,commit:n=>{if(O.mode!=="layout")throw Error("Switch to Layout before editing.");_t(),O.project=n,ct(),kt(),Xt(),st.render(),it()}}),hs=Tv({state:O,api:yt,esc:ut,commit:n=>{if(O.mode!=="layout")throw Error("Switch to Layout before editing.");_t(),O.project=n,ct(),kt(),st.render(),it()}}),Pr=Gv({state:O,api:yt,esc:ut,toast:Bt,commit:n=>{if(O.mode!=="layout")throw Error("Switch to Layout before editing.");_t(),O.project=n,ct(),kt(),Xt(),st.render(),it()}}),u0=Iv({state:O,api:yt,esc:ut,commit:n=>{if(O.mode!=="layout")throw Error("Switch to Layout before editing.");_t(),O.project=n,ct(),kt(),Xt(),st.render(),it()}}),h0=Wv({api:yt,esc:ut}),p0=jv({esc:ut}),Ec=Jv({state:O,api:yt,esc:ut,toast:Bt,numeric:Je,dropdown:Pt,commit:n=>{if(O.mode!=="layout")throw Error("Switch to Layout before editing.");_t(),O.project=n,ct(),kt(),Xt(),st.render(),it()}}),f0=Kv({state:O,api:yt,esc:ut,commit:n=>{if(O.mode!=="layout")throw Error("Switch to Layout before editing.");_t(),O.project=n,ct(),kt(),Xt(),st.render(),it()}}),Es={"boundary-editor":()=>f0.open(),gds:()=>{O.mode==="layout"&&c0.open()},"geometry-vertices":()=>u0.open(O.selected),capabilities:()=>h0.open(),"inverse-design":()=>p0.open(),"global-monitor":()=>Ec.globals(),"flux-results":()=>Ec.flux(),"mesh-preview":()=>hs.open(),"mesh-freeze":()=>hs.freeze(),"mesh-nodes":()=>hs.editNodes(),"mesh-add":()=>hs.add(),"mesh-remove":n=>hs.remove(Number(n.dataset.index)),"global-source":()=>Pr.globals(),"source-signal":()=>Pr.signal(O.selected),"source-preview":()=>Pr.preview(O.selected),fsp:()=>Md.open(),"fsp-native":()=>{O.mode==="layout"&&l0.open()},new:()=>{O.mode!=="running"&&Mc('<h2>Project files</h2><p>Save your current project before opening another design.</p><div class="dialog-buttons"><button data-action="save">Save current project</button><button data-action="open">Open project (.json)</button><button data-action="blank">New empty project</button></div>')},blank:async()=>{if(O.mode==="running")return;_t();const n=await yt("/examples/waveguide");n.name="Untitled",n.structures=[],n.sources=[],n.monitors=[],O.project=n,O.selected="fdtd",O.results=null,O.monitors=null,O.liveFrame=null,ct(),vn("layout"),Bn("geometry"),Xt(),it(),ye("#dialog").close()},save:()=>{bc(JSON.stringify(O.project,null,2),O.project.name.replace(/[^a-z0-9]/gi,"_")+".json"),O.dirty=!1,At("Project saved as JSON. Load the same file from Python with Project.load().")},open:()=>{O.mode!=="running"&&ye("#file-input").click()},region:()=>Sn("fdtd"),fit:()=>st.fit(),materials:Sc,undo:()=>{O.mode!=="layout"||!O.history.length||(O.future.push(JSON.stringify(O.project)),O.project=JSON.parse(O.history.pop()),ct(),Sn("fdtd"),it())},redo:()=>{O.mode!=="layout"||!O.future.length||(O.history.push(JSON.stringify(O.project)),O.project=JSON.parse(O.future.pop()),ct(),Sn("fdtd"),it())},delete:()=>{if(O.mode!=="layout"||!Ss())return;_t();const n=Ao(O.selected);O.project[n]=O.project[n].filter(e=>e.id!==O.selected),ct(),Sn("fdtd"),it()},duplicate:()=>{if(O.mode!=="layout"||!Ss())return;_t();const n=structuredClone(Ss());n.id=crypto.randomUUID(),n.name+="_copy",n.center[0]+=.2,O.project[Ao(O.selected)].push(n),ct(),Sn(n.id),it()},"structure-earlier":()=>wc(-1),"structure-later":()=>wc(1),layout:()=>{O.mode!=="running"&&(O.results=null,O.liveFrame=null,O.monitors=null,O.job=null,ye("#results-tree").innerHTML='<div class="muted empty-hint">Run again to calculate this layout.</div>',vn("layout"),Bn("geometry"),At("Layout mode. Prior result downloads remain on the solver; the current visualizer was cleared."))},run:o0,stop:async()=>{O.job&&(await yt("/jobs/"+O.job+"/cancel",{}),At("Stop requested. Waiting for the current time step to finish."))},validate:it,python:()=>bd("python"),"export-python":async()=>{bc(await yt("/python",O.project),"simulation.py","text/x-python")},"mode-ports":()=>n0(O.project,{toast:Bt}),download:()=>{O.results?window.location.href="/api/jobs/"+O.job+"/download":Bt("Run the simulation first.")},csv:()=>{O.results?window.location.href="/api/jobs/"+O.job+(O.spectrum?"/spectra.csv":"/monitors.csv"):Bt("Run the simulation first.")},playback:()=>{var n;if(ki){clearInterval(ki),ki=null;return}(n=O.results)!=null&&n.frames.length&&(ki=setInterval(()=>{if(!O.results){clearInterval(ki),ki=null;return}O.frame=(O.frame+1)%O.results.frames.length,Hn()},80))},"add-material":()=>{_t(),O.project.materials.push({name:"Custom dielectric "+O.project.materials.length,index:1.5,color:"#60bdaa"}),ct(),ye("#dialog").close(),Sc()},help:()=>Mc("<h2>From Lumerical to TorchFDTD</h2><p>The workbench follows the familiar Objects Tree, CAD views, FDTD region and Layout / Analysis workflow.</p><ol><li>Add a Rectangle, Circle, Ring or Sphere from the Design ribbon.</li><li>Select an object in the tree or any viewport. Drag to move. Edit x, y, z, spans, material and mesh order in Object properties.</li><li>Select FDTD to set dimension, mesh, PML and simulation time steps.</li><li>Add a dipole or bidirectional sheet source and point time monitors.</li><li>Run on the connected solver. Inspect field snapshots, time traces and field spectra.</li><li>Switch to Layout to edit, or export JSON, Python and NPZ results.</li></ol><p><b>Shortcuts:</b> Ctrl+S save · Ctrl+O open · Ctrl+D duplicate · Delete remove · Ctrl+Z undo · Ctrl+Y redo · F fit.</p><p>This is an independent open-source workbench. The FSP inspector reads and edits .fsp settings through an installed, licensed Lumerical API. FSP → GPU independently imports a verified subset of layout settings and displays unsupported settings and numerical differences. Arbitrary FSP execution and .lsf execution remain unimplemented. See Feature checklist for the supported physics and execution modes. PMC cavities currently use point electric sources and point monitors. General material, port and boundary combinations remain under development.</p>")};function wc(n){if(O.mode!=="layout")return;const e=O.project.structures,t=e.findIndex(s=>s.id===O.selected),i=t+n;t<0||i<0||i>=e.length||(_t(),[e[t],e[i]]=[e[i],e[t]],ct(),Sn(O.selected),it())}document.addEventListener("click",async n=>{var t;const e=n.target.closest("button");if(!(!e||e.disabled||!O.project||!st))try{if(e.dataset.action&&await((t=Es[e.dataset.action])==null?void 0:t.call(Es,e)),e.dataset.add&&r0(e.dataset.add),e.dataset.select&&Sn(e.dataset.select),e.dataset.tab&&Bn(e.dataset.tab),e.dataset.bottom&&bd(e.dataset.bottom),e.dataset.plot&&(O.spectrum=e.dataset.plot==="spectrum",ni("[data-plot]").forEach(i=>i.classList.toggle("active",i===e)),Hn()),e.dataset.example){if(O.mode==="running")return;_t(),O.project=await yt("/examples/"+e.dataset.example),O.results=null,O.monitors=null,O.liveFrame=null,O.selected="fdtd",ct(),vn("layout"),Bn("geometry"),Xt(),st.fit(),it(),At("Opened example: "+O.project.name)}e.dataset.ribbon&&(ni("[data-ribbon]").forEach(i=>i.classList.toggle("active",i===e)),e.dataset.ribbon==="simulation"&&Sn("fdtd"),e.dataset.ribbon==="view"&&st.fit()),e.hasAttribute("data-close")&&ye("#dialog").close()}catch(i){Bt(i.message),At(i.message,"error")}});ye("#file-input").onchange=async n=>{const e=n.target.files[0];if(e){if(e.name.toLowerCase().endsWith(".fsp")){n.target.value="",ye("#dialog").close(),await Md.openFile(e);return}try{const t=JSON.parse(await e.text()),i=await yt("/validate",t);_t(),O.project=i.project,O.selected="fdtd",O.results=null,O.monitors=null,O.liveFrame=null,ct(),vn("layout"),Bn("geometry"),Xt(),st.fit(),it(),ye("#dialog").close(),At("Opened "+e.name)}catch(t){Bt(t.message)}n.target.value=""}};ye("#snap").onchange=n=>O.snap=n.target.checked;ye("#frame-slider").oninput=n=>{O.frame=Number(n.target.value),Hn()};document.addEventListener("keydown",n=>{if(!O.project||!st||document.querySelector("dialog[open]")||["INPUT","TEXTAREA","SELECT"].includes(document.activeElement.tagName))return;const e=n.key.toLowerCase();n.ctrlKey&&["s","o","d","z","y"].includes(e)?(n.preventDefault(),Es[{s:"save",o:"open",d:"duplicate",z:"undo",y:"redo"}[e]]()):n.key==="Delete"?Es.delete():e==="f"&&st.fit()});ye("#plot-monitor").onchange=n=>{O.plotMonitor=n.target.value,Hn()};ye("#plot-axis").onchange=()=>Hn();window.addEventListener("resize",()=>{O.tab==="fields"&&Hn()});async function m0(){try{bn=await yt("/health"),ye(".version").textContent="DEVELOPMENT"+(bn.version?" · "+bn.version:""),ye("#connection").innerHTML=`<span class="dot"></span>${bn.cuda?ut(bn.gpu):"CPU solver"} <small>${ut(bn.hostname)}</small>`,ye("#footer-device").textContent=bn.cuda?"CUDA · "+bn.gpu_memory_gb+" GB":"CPU";const n=localStorage.getItem("torchfdtd.project.v1");try{O.project=n?(await yt("/validate",JSON.parse(n))).project:await yt("/examples/waveguide")}catch{O.project=await yt("/examples/waveguide")}st=new Uv(ye("#viewports"),O,Sn,s0,_t),Xt(),vn("layout"),st.fit(),await it(),At("Connected to "+bn.hostname+" · "+bn.engine+"."),At("Select an object to edit. Add structures, configure FDTD and Run. Python and JSON use the same project model.");const e=localStorage.getItem("torchfdtd.activeJob");if(e)try{const t=await yt("/jobs/"+e);O.project=t.project,O.job=e,vn("running"),Xt(),Bn("fields"),Ia()}catch{localStorage.removeItem("torchfdtd.activeJob")}}catch(n){ye("#connection").textContent="Solver unavailable",At(n.message,"error"),Bt("Cannot connect to the solver. Start torchfdtd serve and reload.")}zs()}ni(".editable").forEach(n=>n.disabled=!0);ye("#run-button").disabled=!0;m0();
