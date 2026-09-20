(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))i(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vc=(n,e,t=[])=>{const i=document.createElementNS("http://www.w3.org/2000/svg",n);return Object.keys(e).forEach(s=>{i.setAttribute(s,String(e[s]))}),t.length&&t.forEach(s=>{const r=vc(...s);i.appendChild(r)}),i};var yh=([n,e,t])=>vc(n,e,t);/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const bh=n=>Array.from(n.attributes).reduce((e,t)=>(e[t.name]=t.value,e),{}),Mh=n=>typeof n=="string"?n:!n||!n.class?"":n.class&&typeof n.class=="string"?n.class.split(" "):n.class&&Array.isArray(n.class)?n.class:"",Sh=n=>n.flatMap(Mh).map(t=>t.trim()).filter(Boolean).filter((t,i,s)=>s.indexOf(t)===i).join(" "),Eh=n=>n.replace(/(\w)(\w*)(_|-|\s*)/g,(e,t,i)=>t.toUpperCase()+i.toLowerCase()),$o=(n,{nameAttr:e,icons:t,attrs:i})=>{var _;const s=n.getAttribute(e);if(s==null)return;const r=Eh(s),a=t[r];if(!a)return console.warn(`${n.outerHTML} icon name was not found in the provided icons object.`);const o=bh(n),[l,c,h]=a,u={...c,"data-lucide":s,...i,...o},f=Sh(["lucide",`lucide-${s}`,o,i]);f&&Object.assign(u,{class:f});const m=yh([l,u,h]);return(_=n.parentNode)==null?void 0:_.replaceChild(m,n)};/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ht={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"};/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wh=["svg",ht,[["path",{d:"M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Th=["svg",ht,[["path",{d:"M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"}],["path",{d:"m3.3 7 8.7 5 8.7-5"}],["path",{d:"M12 22V12"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ah=["svg",ht,[["path",{d:"M12 16v5"}],["path",{d:"M16 14v7"}],["path",{d:"M20 10v11"}],["path",{d:"m22 3-8.646 8.646a.5.5 0 0 1-.708 0L9.354 8.354a.5.5 0 0 0-.707 0L2 15"}],["path",{d:"M4 18v3"}],["path",{d:"M8 14v7"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Rh=["svg",ht,[["circle",{cx:"12",cy:"12",r:"10"}],["circle",{cx:"12",cy:"12",r:"1"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ch=["svg",ht,[["circle",{cx:"12",cy:"12",r:"10"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ph=["svg",ht,[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Lh=["svg",ht,[["ellipse",{cx:"12",cy:"5",rx:"9",ry:"3"}],["path",{d:"M3 5v14a9 3 0 0 0 18 0V5"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Dh=["svg",ht,[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}],["polyline",{points:"7 10 12 15 17 10"}],["line",{x1:"12",x2:"12",y1:"15",y2:"3"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ih=["svg",ht,[["path",{d:"M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4"}],["path",{d:"m5 12-3 3 3 3"}],["path",{d:"m9 18 3-3-3-3"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Uh=["svg",ht,[["path",{d:"m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Nh=["svg",ht,[["circle",{cx:"12",cy:"12",r:"3"}],["line",{x1:"3",x2:"9",y1:"12",y2:"12"}],["line",{x1:"15",x2:"21",y1:"12",y2:"12"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fh=["svg",ht,[["path",{d:"M8 3H5a2 2 0 0 0-2 2v3"}],["path",{d:"M21 8V5a2 2 0 0 0-2-2h-3"}],["path",{d:"M3 16v3a2 2 0 0 0 2 2h3"}],["path",{d:"M16 21h3a2 2 0 0 0 2-2v-3"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Oh=["svg",ht,[["path",{d:"M18 8L22 12L18 16"}],["path",{d:"M2 12H22"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zh=["svg",ht,[["circle",{cx:"12",cy:"12",r:"3"}],["circle",{cx:"19",cy:"5",r:"2"}],["circle",{cx:"5",cy:"19",r:"2"}],["path",{d:"M10.4 21.9a10 10 0 0 0 9.941-15.416"}],["path",{d:"M13.5 2.1a10 10 0 0 0-9.841 15.416"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Bh=["svg",ht,[["path",{d:"M13 7 8.7 2.7a2.41 2.41 0 0 0-3.4 0L2.7 5.3a2.41 2.41 0 0 0 0 3.4L7 13"}],["path",{d:"m8 6 2-2"}],["path",{d:"m18 16 2-2"}],["path",{d:"m17 11 4.3 4.3c.94.94.94 2.46 0 3.4l-2.6 2.6c-.94.94-2.46.94-3.4 0L11 17"}],["path",{d:"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"}],["path",{d:"m15 5 4 4"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const kh=["svg",ht,[["polygon",{points:"6 3 20 12 6 21 6 3"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Hh=["svg",ht,[["path",{d:"M4.9 19.1C1 15.2 1 8.8 4.9 4.9"}],["path",{d:"M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"}],["circle",{cx:"12",cy:"12",r:"2"}],["path",{d:"M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"}],["path",{d:"M19.1 4.9C23 8.8 23 15.1 19.1 19"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vh=["svg",ht,[["path",{d:"m15 14 5-5-5-5"}],["path",{d:"M20 9H9.5A5.5 5.5 0 0 0 4 14.5A5.5 5.5 0 0 0 9.5 20H13"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gh=["svg",ht,[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"}],["path",{d:"M21 3v5h-5"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"}],["path",{d:"M8 16H3v5"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Wh=["svg",ht,[["path",{d:"M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"}],["path",{d:"M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"}],["path",{d:"M7 3v4a1 1 0 0 0 1 1h7"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $h=["svg",ht,[["path",{d:"M3 7V5a2 2 0 0 1 2-2h2"}],["path",{d:"M17 3h2a2 2 0 0 1 2 2v2"}],["path",{d:"M21 17v2a2 2 0 0 1-2 2h-2"}],["path",{d:"M7 21H5a2 2 0 0 1-2-2v-2"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xh=["svg",ht,[["path",{d:"M20 7h-9"}],["path",{d:"M14 17H5"}],["circle",{cx:"17",cy:"17",r:"3"}],["circle",{cx:"7",cy:"7",r:"3"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jh=["svg",ht,[["path",{d:"M8.3 10a.7.7 0 0 1-.626-1.079L11.4 3a.7.7 0 0 1 1.198-.043L16.3 8.9a.7.7 0 0 1-.572 1.1Z"}],["rect",{x:"3",y:"14",width:"7",height:"7",rx:"1"}],["circle",{cx:"17.5",cy:"17.5",r:"3.5"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qh=["svg",ht,[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Yh=["svg",ht,[["polyline",{points:"4 17 10 11 4 5"}],["line",{x1:"12",x2:"20",y1:"19",y2:"19"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zh=["svg",ht,[["path",{d:"M3 6h18"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"}],["line",{x1:"10",x2:"10",y1:"11",y2:"17"}],["line",{x1:"14",x2:"14",y1:"11",y2:"17"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Jh=["svg",ht,[["path",{d:"M9 14 4 9l5-5"}],["path",{d:"M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Kh=["svg",ht,[["path",{d:"M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"}],["path",{d:"M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"}],["path",{d:"M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"}]]];/**
 * @license lucide v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qh=({icons:n={},nameAttr:e="data-lucide",attrs:t={}}={})=>{if(!Object.values(n).length)throw new Error(`Please provide an icons object.
If you want to use all the icons you can import it like:
 \`import { createIcons, icons } from 'lucide';
lucide.createIcons({icons});\``);if(typeof document>"u")throw new Error("`createIcons()` only works in a browser environment.");const i=document.querySelectorAll(`[${e}]`);if(Array.from(i).forEach(s=>$o(s,{nameAttr:e,icons:n,attrs:t})),e==="data-lucide"){const s=document.querySelectorAll("[icon-name]");s.length>0&&(console.warn("[Lucide] Some icons were found with the now deprecated icon-name attribute. These will still be replaced for backwards compatibility, but will no longer be supported in v1.0 and you should switch to data-lucide"),Array.from(s).forEach(r=>$o(r,{nameAttr:"icon-name",icons:n,attrs:t})))}};/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Mo="180",Vi={ROTATE:0,DOLLY:1,PAN:2},zi={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},eu=0,Xo=1,tu=2,xc=1,nu=2,Nn=3,Jn=0,Zt=1,fn=2,Yn=0,Gi=1,jo=2,qo=3,Yo=4,iu=5,fi=100,su=101,ru=102,au=103,ou=104,lu=200,cu=201,hu=202,uu=203,wa=204,Ta=205,du=206,fu=207,pu=208,mu=209,gu=210,_u=211,vu=212,xu=213,yu=214,Aa=0,Ra=1,Ca=2,$i=3,Pa=4,La=5,Da=6,Ia=7,yc=0,bu=1,Mu=2,Zn=0,Su=1,Eu=2,wu=3,Tu=4,Au=5,Ru=6,Cu=7,bc=300,Xi=301,ji=302,Ua=303,Na=304,Pr=306,Fa=1e3,gi=1001,Oa=1002,mn=1003,Pu=1004,Os=1005,Mn=1006,zr=1007,_i=1008,wn=1009,Mc=1010,Sc=1011,bs=1012,So=1013,vi=1014,On=1015,Cs=1016,Eo=1017,wo=1018,Ms=1020,Ec=35902,wc=35899,Tc=1021,Ac=1022,pn=1023,Ss=1026,Es=1027,Rc=1028,To=1029,Cc=1030,Ao=1031,Ro=1033,gr=33776,_r=33777,vr=33778,xr=33779,za=35840,Ba=35841,ka=35842,Ha=35843,Va=36196,Ga=37492,Wa=37496,$a=37808,Xa=37809,ja=37810,qa=37811,Ya=37812,Za=37813,Ja=37814,Ka=37815,Qa=37816,eo=37817,to=37818,no=37819,io=37820,so=37821,ro=36492,ao=36494,oo=36495,lo=36283,co=36284,ho=36285,uo=36286,Lu=3200,Du=3201,Pc=0,Iu=1,qn="",on="srgb",qi="srgb-linear",Sr="linear",rt="srgb",Si=7680,Zo=519,Uu=512,Nu=513,Fu=514,Lc=515,Ou=516,zu=517,Bu=518,ku=519,Jo=35044,Ko="300 es",Sn=2e3,Er=2001;class bi{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){const i=this._listeners;if(i===void 0)return;const s=i[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const i=t[e.type];if(i!==void 0){e.target=this;const s=i.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,e);e.target=null}}}const zt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],gs=Math.PI/180,fo=180/Math.PI;function Ki(){const n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(zt[n&255]+zt[n>>8&255]+zt[n>>16&255]+zt[n>>24&255]+"-"+zt[e&255]+zt[e>>8&255]+"-"+zt[e>>16&15|64]+zt[e>>24&255]+"-"+zt[t&63|128]+zt[t>>8&255]+"-"+zt[t>>16&255]+zt[t>>24&255]+zt[i&255]+zt[i>>8&255]+zt[i>>16&255]+zt[i>>24&255]).toLowerCase()}function Xe(n,e,t){return Math.max(e,Math.min(t,n))}function Hu(n,e){return(n%e+e)%e}function Br(n,e,t){return(1-t)*n+t*e}function ns(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function jt(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const Vu={DEG2RAD:gs};class oe{constructor(e=0,t=0){oe.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,i=this.y,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6],this.y=s[1]*t+s[4]*i+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Xe(this.x,e.x,t.x),this.y=Xe(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Xe(this.x,e,t),this.y=Xe(this.y,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Xe(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Xe(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const i=Math.cos(t),s=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*i-a*s+e.x,this.y=r*s+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Ot{constructor(e=0,t=0,i=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=s}static slerpFlat(e,t,i,s,r,a,o){let l=i[s+0],c=i[s+1],h=i[s+2],u=i[s+3];const f=r[a+0],m=r[a+1],_=r[a+2],v=r[a+3];if(o===0){e[t+0]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u;return}if(o===1){e[t+0]=f,e[t+1]=m,e[t+2]=_,e[t+3]=v;return}if(u!==v||l!==f||c!==m||h!==_){let p=1-o;const d=l*f+c*m+h*_+u*v,x=d>=0?1:-1,y=1-d*d;if(y>Number.EPSILON){const w=Math.sqrt(y),T=Math.atan2(w,d*x);p=Math.sin(p*T)/w,o=Math.sin(o*T)/w}const g=o*x;if(l=l*p+f*g,c=c*p+m*g,h=h*p+_*g,u=u*p+v*g,p===1-o){const w=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=w,c*=w,h*=w,u*=w}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=u}static multiplyQuaternionsFlat(e,t,i,s,r,a){const o=i[s],l=i[s+1],c=i[s+2],h=i[s+3],u=r[a],f=r[a+1],m=r[a+2],_=r[a+3];return e[t]=o*_+h*u+l*m-c*f,e[t+1]=l*_+h*f+c*u-o*m,e[t+2]=c*_+h*m+o*f-l*u,e[t+3]=h*_-o*u-l*f-c*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,s){return this._x=e,this._y=t,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const i=e._x,s=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(i/2),h=o(s/2),u=o(r/2),f=l(i/2),m=l(s/2),_=l(r/2);switch(a){case"XYZ":this._x=f*h*u+c*m*_,this._y=c*m*u-f*h*_,this._z=c*h*_+f*m*u,this._w=c*h*u-f*m*_;break;case"YXZ":this._x=f*h*u+c*m*_,this._y=c*m*u-f*h*_,this._z=c*h*_-f*m*u,this._w=c*h*u+f*m*_;break;case"ZXY":this._x=f*h*u-c*m*_,this._y=c*m*u+f*h*_,this._z=c*h*_+f*m*u,this._w=c*h*u-f*m*_;break;case"ZYX":this._x=f*h*u-c*m*_,this._y=c*m*u+f*h*_,this._z=c*h*_-f*m*u,this._w=c*h*u+f*m*_;break;case"YZX":this._x=f*h*u+c*m*_,this._y=c*m*u+f*h*_,this._z=c*h*_-f*m*u,this._w=c*h*u-f*m*_;break;case"XZY":this._x=f*h*u-c*m*_,this._y=c*m*u-f*h*_,this._z=c*h*_+f*m*u,this._w=c*h*u+f*m*_;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const i=t/2,s=Math.sin(i);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,i=t[0],s=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],h=t[6],u=t[10],f=i+o+u;if(f>0){const m=.5/Math.sqrt(f+1);this._w=.25/m,this._x=(h-l)*m,this._y=(r-c)*m,this._z=(a-s)*m}else if(i>o&&i>u){const m=2*Math.sqrt(1+i-o-u);this._w=(h-l)/m,this._x=.25*m,this._y=(s+a)/m,this._z=(r+c)/m}else if(o>u){const m=2*Math.sqrt(1+o-i-u);this._w=(r-c)/m,this._x=(s+a)/m,this._y=.25*m,this._z=(l+h)/m}else{const m=2*Math.sqrt(1+u-i-o);this._w=(a-s)/m,this._x=(r+c)/m,this._y=(l+h)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Xe(this.dot(e),-1,1)))}rotateTowards(e,t){const i=this.angleTo(e);if(i===0)return this;const s=Math.min(1,t/i);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const i=e._x,s=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=i*h+a*o+s*c-r*l,this._y=s*h+a*l+r*o-i*c,this._z=r*h+a*c+i*l-s*o,this._w=a*h-i*o-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const i=this._x,s=this._y,r=this._z,a=this._w;let o=a*e._w+i*e._x+s*e._y+r*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=i,this._y=s,this._z=r,this;const l=1-o*o;if(l<=Number.EPSILON){const m=1-t;return this._w=m*a+t*this._w,this._x=m*i+t*this._x,this._y=m*s+t*this._y,this._z=m*r+t*this._z,this.normalize(),this}const c=Math.sqrt(l),h=Math.atan2(c,o),u=Math.sin((1-t)*h)/c,f=Math.sin(t*h)/c;return this._w=a*u+this._w*f,this._x=i*u+this._x*f,this._y=s*u+this._y*f,this._z=r*u+this._z*f,this._onChangeCallback(),this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class L{constructor(e=0,t=0,i=0){L.prototype.isVector3=!0,this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Qo.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Qo.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6]*s,this.y=r[1]*t+r[4]*i+r[7]*s,this.z=r[2]*t+r[5]*i+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,r=e.elements,a=1/(r[3]*t+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*i+r[8]*s+r[12])*a,this.y=(r[1]*t+r[5]*i+r[9]*s+r[13])*a,this.z=(r[2]*t+r[6]*i+r[10]*s+r[14])*a,this}applyQuaternion(e){const t=this.x,i=this.y,s=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*s-o*i),h=2*(o*t-r*s),u=2*(r*i-a*t);return this.x=t+l*c+a*u-o*h,this.y=i+l*h+o*c-r*u,this.z=s+l*u+r*h-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,i=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*i+r[8]*s,this.y=r[1]*t+r[5]*i+r[9]*s,this.z=r[2]*t+r[6]*i+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Xe(this.x,e.x,t.x),this.y=Xe(this.y,e.y,t.y),this.z=Xe(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Xe(this.x,e,t),this.y=Xe(this.y,e,t),this.z=Xe(this.z,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Xe(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const i=e.x,s=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=s*l-r*o,this.y=r*a-i*l,this.z=i*o-s*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return kr.copy(this).projectOnVector(e),this.sub(kr)}reflect(e){return this.sub(kr.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const i=this.dot(e)/t;return Math.acos(Xe(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,i=this.y-e.y,s=this.z-e.z;return t*t+i*i+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){const s=Math.sin(t)*e;return this.x=s*Math.sin(i),this.y=Math.cos(t)*e,this.z=s*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const kr=new L,Qo=new Ot;class We{constructor(e,t,i,s,r,a,o,l,c){We.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,a,o,l,c)}set(e,t,i,s,r,a,o,l,c){const h=this.elements;return h[0]=e,h[1]=s,h[2]=o,h[3]=t,h[4]=r,h[5]=l,h[6]=i,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,r=this.elements,a=i[0],o=i[3],l=i[6],c=i[1],h=i[4],u=i[7],f=i[2],m=i[5],_=i[8],v=s[0],p=s[3],d=s[6],x=s[1],y=s[4],g=s[7],w=s[2],T=s[5],S=s[8];return r[0]=a*v+o*x+l*w,r[3]=a*p+o*y+l*T,r[6]=a*d+o*g+l*S,r[1]=c*v+h*x+u*w,r[4]=c*p+h*y+u*T,r[7]=c*d+h*g+u*S,r[2]=f*v+m*x+_*w,r[5]=f*p+m*y+_*T,r[8]=f*d+m*g+_*S,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*a*h-t*o*c-i*r*h+i*o*l+s*r*c-s*a*l}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=h*a-o*c,f=o*l-h*r,m=c*r-a*l,_=t*u+i*f+s*m;if(_===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/_;return e[0]=u*v,e[1]=(s*c-h*i)*v,e[2]=(o*i-s*a)*v,e[3]=f*v,e[4]=(h*t-s*l)*v,e[5]=(s*r-o*t)*v,e[6]=m*v,e[7]=(i*l-c*t)*v,e[8]=(a*t-i*r)*v,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,s,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(i*l,i*c,-i*(l*a+c*o)+a+e,-s*c,s*l,-s*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(Hr.makeScale(e,t)),this}rotate(e){return this.premultiply(Hr.makeRotation(-e)),this}translate(e,t){return this.premultiply(Hr.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<9;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Hr=new We;function Dc(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function wr(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function Gu(){const n=wr("canvas");return n.style.display="block",n}const el={};function ws(n){n in el||(el[n]=!0,console.warn(n))}function Wu(n,e,t){return new Promise(function(i,s){function r(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:i()}}setTimeout(r,t)})}const tl=new We().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),nl=new We().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function $u(){const n={enabled:!0,workingColorSpace:qi,spaces:{},convert:function(s,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===rt&&(s.r=zn(s.r),s.g=zn(s.g),s.b=zn(s.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===rt&&(s.r=Wi(s.r),s.g=Wi(s.g),s.b=Wi(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===qn?Sr:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return ws("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return ws("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(s,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[qi]:{primaries:e,whitePoint:i,transfer:Sr,toXYZ:tl,fromXYZ:nl,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:on},outputColorSpaceConfig:{drawingBufferColorSpace:on}},[on]:{primaries:e,whitePoint:i,transfer:rt,toXYZ:tl,fromXYZ:nl,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:on}}}),n}const tt=$u();function zn(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function Wi(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let Ei;class Xu{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{Ei===void 0&&(Ei=wr("canvas")),Ei.width=e.width,Ei.height=e.height;const s=Ei.getContext("2d");e instanceof ImageData?s.putImageData(e,0,0):s.drawImage(e,0,0,e.width,e.height),i=Ei}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=wr("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const s=i.getImageData(0,0,e.width,e.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=zn(r[a]/255)*255;return i.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(zn(t[i]/255)*255):t[i]=zn(t[i]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let ju=0;class Co{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:ju++}),this.uuid=Ki(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(Vr(s[a].image)):r.push(Vr(s[a]))}else r=Vr(s);i.url=r}return t||(e.images[this.uuid]=i),i}}function Vr(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?Xu.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let qu=0;const Gr=new L;class Jt extends bi{constructor(e=Jt.DEFAULT_IMAGE,t=Jt.DEFAULT_MAPPING,i=gi,s=gi,r=Mn,a=_i,o=pn,l=wn,c=Jt.DEFAULT_ANISOTROPY,h=qn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:qu++}),this.uuid=Ki(),this.name="",this.source=new Co(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new oe(0,0),this.repeat=new oe(1,1),this.center=new oe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new We,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Gr).x}get height(){return this.source.getSize(Gr).y}get depth(){return this.source.getSize(Gr).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const i=e[t];if(i===void 0){console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==bc)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Fa:e.x=e.x-Math.floor(e.x);break;case gi:e.x=e.x<0?0:1;break;case Oa:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Fa:e.y=e.y-Math.floor(e.y);break;case gi:e.y=e.y<0?0:1;break;case Oa:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Jt.DEFAULT_IMAGE=null;Jt.DEFAULT_MAPPING=bc;Jt.DEFAULT_ANISOTROPY=1;class wt{constructor(e=0,t=0,i=0,s=1){wt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=i,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,s){return this.x=e,this.y=t,this.z=i,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,i=this.y,s=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*i+a[8]*s+a[12]*r,this.y=a[1]*t+a[5]*i+a[9]*s+a[13]*r,this.z=a[2]*t+a[6]*i+a[10]*s+a[14]*r,this.w=a[3]*t+a[7]*i+a[11]*s+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,s,r;const l=e.elements,c=l[0],h=l[4],u=l[8],f=l[1],m=l[5],_=l[9],v=l[2],p=l[6],d=l[10];if(Math.abs(h-f)<.01&&Math.abs(u-v)<.01&&Math.abs(_-p)<.01){if(Math.abs(h+f)<.1&&Math.abs(u+v)<.1&&Math.abs(_+p)<.1&&Math.abs(c+m+d-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const y=(c+1)/2,g=(m+1)/2,w=(d+1)/2,T=(h+f)/4,S=(u+v)/4,R=(_+p)/4;return y>g&&y>w?y<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(y),s=T/i,r=S/i):g>w?g<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(g),i=T/s,r=R/s):w<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(w),i=S/r,s=R/r),this.set(i,s,r,t),this}let x=Math.sqrt((p-_)*(p-_)+(u-v)*(u-v)+(f-h)*(f-h));return Math.abs(x)<.001&&(x=1),this.x=(p-_)/x,this.y=(u-v)/x,this.z=(f-h)/x,this.w=Math.acos((c+m+d-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Xe(this.x,e.x,t.x),this.y=Xe(this.y,e.y,t.y),this.z=Xe(this.z,e.z,t.z),this.w=Xe(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Xe(this.x,e,t),this.y=Xe(this.y,e,t),this.z=Xe(this.z,e,t),this.w=Xe(this.w,e,t),this}clampLength(e,t){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Xe(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Yu extends bi{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Mn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new wt(0,0,e,t),this.scissorTest=!1,this.viewport=new wt(0,0,e,t);const s={width:e,height:t,depth:i.depth},r=new Jt(s);this.textures=[];const a=i.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(e={}){const t={minFilter:Mn,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=i,this.textures[s].isArrayTexture=this.textures[s].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const s=Object.assign({},e.textures[t].image);this.textures[t].source=new Co(s)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class xi extends Yu{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}}class Ic extends Jt{constructor(e=null,t=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=mn,this.minFilter=mn,this.wrapR=gi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Zu extends Jt{constructor(e=null,t=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:s},this.magFilter=mn,this.minFilter=mn,this.wrapR=gi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Ps{constructor(e=new L(1/0,1/0,1/0),t=new L(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(hn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(hn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const i=hn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const r=i.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,hn):hn.fromBufferAttribute(r,a),hn.applyMatrix4(e.matrixWorld),this.expandByPoint(hn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),zs.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),zs.copy(i.boundingBox)),zs.applyMatrix4(e.matrixWorld),this.union(zs)}const s=e.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,hn),hn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(is),Bs.subVectors(this.max,is),wi.subVectors(e.a,is),Ti.subVectors(e.b,is),Ai.subVectors(e.c,is),kn.subVectors(Ti,wi),Hn.subVectors(Ai,Ti),ii.subVectors(wi,Ai);let t=[0,-kn.z,kn.y,0,-Hn.z,Hn.y,0,-ii.z,ii.y,kn.z,0,-kn.x,Hn.z,0,-Hn.x,ii.z,0,-ii.x,-kn.y,kn.x,0,-Hn.y,Hn.x,0,-ii.y,ii.x,0];return!Wr(t,wi,Ti,Ai,Bs)||(t=[1,0,0,0,1,0,0,0,1],!Wr(t,wi,Ti,Ai,Bs))?!1:(ks.crossVectors(kn,Hn),t=[ks.x,ks.y,ks.z],Wr(t,wi,Ti,Ai,Bs))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,hn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(hn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Cn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Cn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Cn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Cn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Cn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Cn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Cn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Cn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Cn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Cn=[new L,new L,new L,new L,new L,new L,new L,new L],hn=new L,zs=new Ps,wi=new L,Ti=new L,Ai=new L,kn=new L,Hn=new L,ii=new L,is=new L,Bs=new L,ks=new L,si=new L;function Wr(n,e,t,i,s){for(let r=0,a=n.length-3;r<=a;r+=3){si.fromArray(n,r);const o=s.x*Math.abs(si.x)+s.y*Math.abs(si.y)+s.z*Math.abs(si.z),l=e.dot(si),c=t.dot(si),h=i.dot(si);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const Ju=new Ps,ss=new L,$r=new L;class Lr{constructor(e=new L,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const i=this.center;t!==void 0?i.copy(t):Ju.setFromPoints(e).getCenter(i);let s=0;for(let r=0,a=e.length;r<a;r++)s=Math.max(s,i.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ss.subVectors(e,this.center);const t=ss.lengthSq();if(t>this.radius*this.radius){const i=Math.sqrt(t),s=(i-this.radius)*.5;this.center.addScaledVector(ss,s/i),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):($r.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ss.copy(e.center).add($r)),this.expandByPoint(ss.copy(e.center).sub($r))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}const Pn=new L,Xr=new L,Hs=new L,Vn=new L,jr=new L,Vs=new L,qr=new L;class Dr{constructor(e=new L,t=new L(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Pn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Pn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Pn.copy(this.origin).addScaledVector(this.direction,t),Pn.distanceToSquared(e))}distanceSqToSegment(e,t,i,s){Xr.copy(e).add(t).multiplyScalar(.5),Hs.copy(t).sub(e).normalize(),Vn.copy(this.origin).sub(Xr);const r=e.distanceTo(t)*.5,a=-this.direction.dot(Hs),o=Vn.dot(this.direction),l=-Vn.dot(Hs),c=Vn.lengthSq(),h=Math.abs(1-a*a);let u,f,m,_;if(h>0)if(u=a*l-o,f=a*o-l,_=r*h,u>=0)if(f>=-_)if(f<=_){const v=1/h;u*=v,f*=v,m=u*(u+a*f+2*o)+f*(a*u+f+2*l)+c}else f=r,u=Math.max(0,-(a*f+o)),m=-u*u+f*(f+2*l)+c;else f=-r,u=Math.max(0,-(a*f+o)),m=-u*u+f*(f+2*l)+c;else f<=-_?(u=Math.max(0,-(-a*r+o)),f=u>0?-r:Math.min(Math.max(-r,-l),r),m=-u*u+f*(f+2*l)+c):f<=_?(u=0,f=Math.min(Math.max(-r,-l),r),m=f*(f+2*l)+c):(u=Math.max(0,-(a*r+o)),f=u>0?r:Math.min(Math.max(-r,-l),r),m=-u*u+f*(f+2*l)+c);else f=a>0?-r:r,u=Math.max(0,-(a*f+o)),m=-u*u+f*(f+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Xr).addScaledVector(Hs,f),m}intersectSphere(e,t){Pn.subVectors(e.center,this.origin);const i=Pn.dot(this.direction),s=Pn.dot(Pn)-i*i,r=e.radius*e.radius;if(s>r)return null;const a=Math.sqrt(r-s),o=i-a,l=i+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){const i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,s,r,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,f=this.origin;return c>=0?(i=(e.min.x-f.x)*c,s=(e.max.x-f.x)*c):(i=(e.max.x-f.x)*c,s=(e.min.x-f.x)*c),h>=0?(r=(e.min.y-f.y)*h,a=(e.max.y-f.y)*h):(r=(e.max.y-f.y)*h,a=(e.min.y-f.y)*h),i>a||r>s||((r>i||isNaN(i))&&(i=r),(a<s||isNaN(s))&&(s=a),u>=0?(o=(e.min.z-f.z)*u,l=(e.max.z-f.z)*u):(o=(e.max.z-f.z)*u,l=(e.min.z-f.z)*u),i>l||o>s)||((o>i||i!==i)&&(i=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(i>=0?i:s,t)}intersectsBox(e){return this.intersectBox(e,Pn)!==null}intersectTriangle(e,t,i,s,r){jr.subVectors(t,e),Vs.subVectors(i,e),qr.crossVectors(jr,Vs);let a=this.direction.dot(qr),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Vn.subVectors(this.origin,e);const l=o*this.direction.dot(Vs.crossVectors(Vn,Vs));if(l<0)return null;const c=o*this.direction.dot(jr.cross(Vn));if(c<0||l+c>a)return null;const h=-o*Vn.dot(qr);return h<0?null:this.at(h/a,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ct{constructor(e,t,i,s,r,a,o,l,c,h,u,f,m,_,v,p){ct.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,s,r,a,o,l,c,h,u,f,m,_,v,p)}set(e,t,i,s,r,a,o,l,c,h,u,f,m,_,v,p){const d=this.elements;return d[0]=e,d[4]=t,d[8]=i,d[12]=s,d[1]=r,d[5]=a,d[9]=o,d[13]=l,d[2]=c,d[6]=h,d[10]=u,d[14]=f,d[3]=m,d[7]=_,d[11]=v,d[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ct().fromArray(this.elements)}copy(e){const t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){const t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,i=e.elements,s=1/Ri.setFromMatrixColumn(e,0).length(),r=1/Ri.setFromMatrixColumn(e,1).length(),a=1/Ri.setFromMatrixColumn(e,2).length();return t[0]=i[0]*s,t[1]=i[1]*s,t[2]=i[2]*s,t[3]=0,t[4]=i[4]*r,t[5]=i[5]*r,t[6]=i[6]*r,t[7]=0,t[8]=i[8]*a,t[9]=i[9]*a,t[10]=i[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,i=e.x,s=e.y,r=e.z,a=Math.cos(i),o=Math.sin(i),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),u=Math.sin(r);if(e.order==="XYZ"){const f=a*h,m=a*u,_=o*h,v=o*u;t[0]=l*h,t[4]=-l*u,t[8]=c,t[1]=m+_*c,t[5]=f-v*c,t[9]=-o*l,t[2]=v-f*c,t[6]=_+m*c,t[10]=a*l}else if(e.order==="YXZ"){const f=l*h,m=l*u,_=c*h,v=c*u;t[0]=f+v*o,t[4]=_*o-m,t[8]=a*c,t[1]=a*u,t[5]=a*h,t[9]=-o,t[2]=m*o-_,t[6]=v+f*o,t[10]=a*l}else if(e.order==="ZXY"){const f=l*h,m=l*u,_=c*h,v=c*u;t[0]=f-v*o,t[4]=-a*u,t[8]=_+m*o,t[1]=m+_*o,t[5]=a*h,t[9]=v-f*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const f=a*h,m=a*u,_=o*h,v=o*u;t[0]=l*h,t[4]=_*c-m,t[8]=f*c+v,t[1]=l*u,t[5]=v*c+f,t[9]=m*c-_,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const f=a*l,m=a*c,_=o*l,v=o*c;t[0]=l*h,t[4]=v-f*u,t[8]=_*u+m,t[1]=u,t[5]=a*h,t[9]=-o*h,t[2]=-c*h,t[6]=m*u+_,t[10]=f-v*u}else if(e.order==="XZY"){const f=a*l,m=a*c,_=o*l,v=o*c;t[0]=l*h,t[4]=-u,t[8]=c*h,t[1]=f*u+v,t[5]=a*h,t[9]=m*u-_,t[2]=_*u-m,t[6]=o*h,t[10]=v*u+f}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Ku,e,Qu)}lookAt(e,t,i){const s=this.elements;return en.subVectors(e,t),en.lengthSq()===0&&(en.z=1),en.normalize(),Gn.crossVectors(i,en),Gn.lengthSq()===0&&(Math.abs(i.z)===1?en.x+=1e-4:en.z+=1e-4,en.normalize(),Gn.crossVectors(i,en)),Gn.normalize(),Gs.crossVectors(en,Gn),s[0]=Gn.x,s[4]=Gs.x,s[8]=en.x,s[1]=Gn.y,s[5]=Gs.y,s[9]=en.y,s[2]=Gn.z,s[6]=Gs.z,s[10]=en.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const i=e.elements,s=t.elements,r=this.elements,a=i[0],o=i[4],l=i[8],c=i[12],h=i[1],u=i[5],f=i[9],m=i[13],_=i[2],v=i[6],p=i[10],d=i[14],x=i[3],y=i[7],g=i[11],w=i[15],T=s[0],S=s[4],R=s[8],M=s[12],b=s[1],C=s[5],I=s[9],B=s[13],H=s[2],k=s[6],W=s[10],q=s[14],$=s[3],ie=s[7],pe=s[11],be=s[15];return r[0]=a*T+o*b+l*H+c*$,r[4]=a*S+o*C+l*k+c*ie,r[8]=a*R+o*I+l*W+c*pe,r[12]=a*M+o*B+l*q+c*be,r[1]=h*T+u*b+f*H+m*$,r[5]=h*S+u*C+f*k+m*ie,r[9]=h*R+u*I+f*W+m*pe,r[13]=h*M+u*B+f*q+m*be,r[2]=_*T+v*b+p*H+d*$,r[6]=_*S+v*C+p*k+d*ie,r[10]=_*R+v*I+p*W+d*pe,r[14]=_*M+v*B+p*q+d*be,r[3]=x*T+y*b+g*H+w*$,r[7]=x*S+y*C+g*k+w*ie,r[11]=x*R+y*I+g*W+w*pe,r[15]=x*M+y*B+g*q+w*be,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],i=e[4],s=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],h=e[2],u=e[6],f=e[10],m=e[14],_=e[3],v=e[7],p=e[11],d=e[15];return _*(+r*l*u-s*c*u-r*o*f+i*c*f+s*o*m-i*l*m)+v*(+t*l*m-t*c*f+r*a*f-s*a*m+s*c*h-r*l*h)+p*(+t*c*u-t*o*m-r*a*u+i*a*m+r*o*h-i*c*h)+d*(-s*o*h-t*l*u+t*o*f+s*a*u-i*a*f+i*l*h)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=i),this}invert(){const e=this.elements,t=e[0],i=e[1],s=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],u=e[9],f=e[10],m=e[11],_=e[12],v=e[13],p=e[14],d=e[15],x=u*p*c-v*f*c+v*l*m-o*p*m-u*l*d+o*f*d,y=_*f*c-h*p*c-_*l*m+a*p*m+h*l*d-a*f*d,g=h*v*c-_*u*c+_*o*m-a*v*m-h*o*d+a*u*d,w=_*u*l-h*v*l-_*o*f+a*v*f+h*o*p-a*u*p,T=t*x+i*y+s*g+r*w;if(T===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const S=1/T;return e[0]=x*S,e[1]=(v*f*r-u*p*r-v*s*m+i*p*m+u*s*d-i*f*d)*S,e[2]=(o*p*r-v*l*r+v*s*c-i*p*c-o*s*d+i*l*d)*S,e[3]=(u*l*r-o*f*r-u*s*c+i*f*c+o*s*m-i*l*m)*S,e[4]=y*S,e[5]=(h*p*r-_*f*r+_*s*m-t*p*m-h*s*d+t*f*d)*S,e[6]=(_*l*r-a*p*r-_*s*c+t*p*c+a*s*d-t*l*d)*S,e[7]=(a*f*r-h*l*r+h*s*c-t*f*c-a*s*m+t*l*m)*S,e[8]=g*S,e[9]=(_*u*r-h*v*r-_*i*m+t*v*m+h*i*d-t*u*d)*S,e[10]=(a*v*r-_*o*r+_*i*c-t*v*c-a*i*d+t*o*d)*S,e[11]=(h*o*r-a*u*r-h*i*c+t*u*c+a*i*m-t*o*m)*S,e[12]=w*S,e[13]=(h*v*s-_*u*s+_*i*f-t*v*f-h*i*p+t*u*p)*S,e[14]=(_*o*s-a*v*s-_*i*l+t*v*l+a*i*p-t*o*p)*S,e[15]=(a*u*s-h*o*s+h*i*l-t*u*l-a*i*f+t*o*f)*S,this}scale(e){const t=this.elements,i=e.x,s=e.y,r=e.z;return t[0]*=i,t[4]*=s,t[8]*=r,t[1]*=i,t[5]*=s,t[9]*=r,t[2]*=i,t[6]*=s,t[10]*=r,t[3]*=i,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,s))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const i=Math.cos(t),s=Math.sin(t),r=1-i,a=e.x,o=e.y,l=e.z,c=r*a,h=r*o;return this.set(c*a+i,c*o-s*l,c*l+s*o,0,c*o+s*l,h*o+i,h*l-s*a,0,c*l-s*o,h*l+s*a,r*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,s,r,a){return this.set(1,i,r,0,e,1,a,0,t,s,1,0,0,0,0,1),this}compose(e,t,i){const s=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,h=a+a,u=o+o,f=r*c,m=r*h,_=r*u,v=a*h,p=a*u,d=o*u,x=l*c,y=l*h,g=l*u,w=i.x,T=i.y,S=i.z;return s[0]=(1-(v+d))*w,s[1]=(m+g)*w,s[2]=(_-y)*w,s[3]=0,s[4]=(m-g)*T,s[5]=(1-(f+d))*T,s[6]=(p+x)*T,s[7]=0,s[8]=(_+y)*S,s[9]=(p-x)*S,s[10]=(1-(f+v))*S,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,i){const s=this.elements;let r=Ri.set(s[0],s[1],s[2]).length();const a=Ri.set(s[4],s[5],s[6]).length(),o=Ri.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],un.copy(this);const c=1/r,h=1/a,u=1/o;return un.elements[0]*=c,un.elements[1]*=c,un.elements[2]*=c,un.elements[4]*=h,un.elements[5]*=h,un.elements[6]*=h,un.elements[8]*=u,un.elements[9]*=u,un.elements[10]*=u,t.setFromRotationMatrix(un),i.x=r,i.y=a,i.z=o,this}makePerspective(e,t,i,s,r,a,o=Sn,l=!1){const c=this.elements,h=2*r/(t-e),u=2*r/(i-s),f=(t+e)/(t-e),m=(i+s)/(i-s);let _,v;if(l)_=r/(a-r),v=a*r/(a-r);else if(o===Sn)_=-(a+r)/(a-r),v=-2*a*r/(a-r);else if(o===Er)_=-a/(a-r),v=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=f,c[12]=0,c[1]=0,c[5]=u,c[9]=m,c[13]=0,c[2]=0,c[6]=0,c[10]=_,c[14]=v,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,i,s,r,a,o=Sn,l=!1){const c=this.elements,h=2/(t-e),u=2/(i-s),f=-(t+e)/(t-e),m=-(i+s)/(i-s);let _,v;if(l)_=1/(a-r),v=a/(a-r);else if(o===Sn)_=-2/(a-r),v=-(a+r)/(a-r);else if(o===Er)_=-1/(a-r),v=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=f,c[1]=0,c[5]=u,c[9]=0,c[13]=m,c[2]=0,c[6]=0,c[10]=_,c[14]=v,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,i=e.elements;for(let s=0;s<16;s++)if(t[s]!==i[s])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){const i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}}const Ri=new L,un=new ct,Ku=new L(0,0,0),Qu=new L(1,1,1),Gn=new L,Gs=new L,en=new L,il=new ct,sl=new Ot;class gn{constructor(e=0,t=0,i=0,s=gn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,s=this._order){return this._x=e,this._y=t,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){const s=e.elements,r=s[0],a=s[4],o=s[8],l=s[1],c=s[5],h=s[9],u=s[2],f=s[6],m=s[10];switch(t){case"XYZ":this._y=Math.asin(Xe(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,m),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(f,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Xe(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,m),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(Xe(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-u,m),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Xe(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(f,m),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(Xe(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(o,m));break;case"XZY":this._z=Math.asin(-Xe(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(f,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,m),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return il.makeRotationFromQuaternion(e),this.setFromRotationMatrix(il,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return sl.setFromEuler(this),this.setFromQuaternion(sl,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}gn.DEFAULT_ORDER="XYZ";class Po{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let ed=0;const rl=new L,Ci=new Ot,Ln=new ct,Ws=new L,rs=new L,td=new L,nd=new Ot,al=new L(1,0,0),ol=new L(0,1,0),ll=new L(0,0,1),cl={type:"added"},id={type:"removed"},Pi={type:"childadded",child:null},Yr={type:"childremoved",child:null};class Rt extends bi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:ed++}),this.uuid=Ki(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Rt.DEFAULT_UP.clone();const e=new L,t=new gn,i=new Ot,s=new L(1,1,1);function r(){i.setFromEuler(t,!1)}function a(){t.setFromQuaternion(i,void 0,!1)}t._onChange(r),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new ct},normalMatrix:{value:new We}}),this.matrix=new ct,this.matrixWorld=new ct,this.matrixAutoUpdate=Rt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Rt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Po,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Ci.setFromAxisAngle(e,t),this.quaternion.multiply(Ci),this}rotateOnWorldAxis(e,t){return Ci.setFromAxisAngle(e,t),this.quaternion.premultiply(Ci),this}rotateX(e){return this.rotateOnAxis(al,e)}rotateY(e){return this.rotateOnAxis(ol,e)}rotateZ(e){return this.rotateOnAxis(ll,e)}translateOnAxis(e,t){return rl.copy(e).applyQuaternion(this.quaternion),this.position.add(rl.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(al,e)}translateY(e){return this.translateOnAxis(ol,e)}translateZ(e){return this.translateOnAxis(ll,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Ln.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?Ws.copy(e):Ws.set(e,t,i);const s=this.parent;this.updateWorldMatrix(!0,!1),rs.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ln.lookAt(rs,Ws,this.up):Ln.lookAt(Ws,rs,this.up),this.quaternion.setFromRotationMatrix(Ln),s&&(Ln.extractRotation(s.matrixWorld),Ci.setFromRotationMatrix(Ln),this.quaternion.premultiply(Ci.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(cl),Pi.child=e,this.dispatchEvent(Pi),Pi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(id),Yr.child=e,this.dispatchEvent(Yr),Yr.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Ln.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Ln.multiply(e.parent.matrixWorld)),e.applyMatrix4(Ln),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(cl),Pi.child=e,this.dispatchEvent(Pi),Pi.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,s=this.children.length;i<s;i++){const a=this.children[i].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(rs,e,td),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(rs,nd,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let i=0,s=t.length;i<s;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(e),s.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const u=l[c];r(e.shapes,u)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));s.material=o}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];s.animations.push(r(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),h=a(e.images),u=a(e.shapes),f=a(e.skeletons),m=a(e.animations),_=a(e.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),h.length>0&&(i.images=h),u.length>0&&(i.shapes=u),f.length>0&&(i.skeletons=f),m.length>0&&(i.animations=m),_.length>0&&(i.nodes=_)}return i.object=s,i;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){const s=e.children[i];this.add(s.clone())}return this}}Rt.DEFAULT_UP=new L(0,1,0);Rt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Rt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const dn=new L,Dn=new L,Zr=new L,In=new L,Li=new L,Di=new L,hl=new L,Jr=new L,Kr=new L,Qr=new L,ea=new wt,ta=new wt,na=new wt;class cn{constructor(e=new L,t=new L,i=new L){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,s){s.subVectors(i,t),dn.subVectors(e,t),s.cross(dn);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,i,s,r){dn.subVectors(s,t),Dn.subVectors(i,t),Zr.subVectors(e,t);const a=dn.dot(dn),o=dn.dot(Dn),l=dn.dot(Zr),c=Dn.dot(Dn),h=Dn.dot(Zr),u=a*c-o*o;if(u===0)return r.set(0,0,0),null;const f=1/u,m=(c*l-o*h)*f,_=(a*h-o*l)*f;return r.set(1-m-_,_,m)}static containsPoint(e,t,i,s){return this.getBarycoord(e,t,i,s,In)===null?!1:In.x>=0&&In.y>=0&&In.x+In.y<=1}static getInterpolation(e,t,i,s,r,a,o,l){return this.getBarycoord(e,t,i,s,In)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,In.x),l.addScaledVector(a,In.y),l.addScaledVector(o,In.z),l)}static getInterpolatedAttribute(e,t,i,s,r,a){return ea.setScalar(0),ta.setScalar(0),na.setScalar(0),ea.fromBufferAttribute(e,t),ta.fromBufferAttribute(e,i),na.fromBufferAttribute(e,s),a.setScalar(0),a.addScaledVector(ea,r.x),a.addScaledVector(ta,r.y),a.addScaledVector(na,r.z),a}static isFrontFacing(e,t,i,s){return dn.subVectors(i,t),Dn.subVectors(e,t),dn.cross(Dn).dot(s)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,s){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,i,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return dn.subVectors(this.c,this.b),Dn.subVectors(this.a,this.b),dn.cross(Dn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return cn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return cn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,s,r){return cn.getInterpolation(e,this.a,this.b,this.c,t,i,s,r)}containsPoint(e){return cn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return cn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const i=this.a,s=this.b,r=this.c;let a,o;Li.subVectors(s,i),Di.subVectors(r,i),Jr.subVectors(e,i);const l=Li.dot(Jr),c=Di.dot(Jr);if(l<=0&&c<=0)return t.copy(i);Kr.subVectors(e,s);const h=Li.dot(Kr),u=Di.dot(Kr);if(h>=0&&u<=h)return t.copy(s);const f=l*u-h*c;if(f<=0&&l>=0&&h<=0)return a=l/(l-h),t.copy(i).addScaledVector(Li,a);Qr.subVectors(e,r);const m=Li.dot(Qr),_=Di.dot(Qr);if(_>=0&&m<=_)return t.copy(r);const v=m*c-l*_;if(v<=0&&c>=0&&_<=0)return o=c/(c-_),t.copy(i).addScaledVector(Di,o);const p=h*_-m*u;if(p<=0&&u-h>=0&&m-_>=0)return hl.subVectors(r,s),o=(u-h)/(u-h+(m-_)),t.copy(s).addScaledVector(hl,o);const d=1/(p+v+f);return a=v*d,o=f*d,t.copy(i).addScaledVector(Li,a).addScaledVector(Di,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Uc={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Wn={h:0,s:0,l:0},$s={h:0,s:0,l:0};function ia(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}class je{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=on){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,tt.colorSpaceToWorking(this,t),this}setRGB(e,t,i,s=tt.workingColorSpace){return this.r=e,this.g=t,this.b=i,tt.colorSpaceToWorking(this,s),this}setHSL(e,t,i,s=tt.workingColorSpace){if(e=Hu(e,1),t=Xe(t,0,1),i=Xe(i,0,1),t===0)this.r=this.g=this.b=i;else{const r=i<=.5?i*(1+t):i+t-i*t,a=2*i-r;this.r=ia(a,r,e+1/3),this.g=ia(a,r,e),this.b=ia(a,r,e-1/3)}return tt.colorSpaceToWorking(this,s),this}setStyle(e,t=on){function i(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=on){const i=Uc[e.toLowerCase()];return i!==void 0?this.setHex(i,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=zn(e.r),this.g=zn(e.g),this.b=zn(e.b),this}copyLinearToSRGB(e){return this.r=Wi(e.r),this.g=Wi(e.g),this.b=Wi(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=on){return tt.workingToColorSpace(Bt.copy(this),e),Math.round(Xe(Bt.r*255,0,255))*65536+Math.round(Xe(Bt.g*255,0,255))*256+Math.round(Xe(Bt.b*255,0,255))}getHexString(e=on){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=tt.workingColorSpace){tt.workingToColorSpace(Bt.copy(this),t);const i=Bt.r,s=Bt.g,r=Bt.b,a=Math.max(i,s,r),o=Math.min(i,s,r);let l,c;const h=(o+a)/2;if(o===a)l=0,c=0;else{const u=a-o;switch(c=h<=.5?u/(a+o):u/(2-a-o),a){case i:l=(s-r)/u+(s<r?6:0);break;case s:l=(r-i)/u+2;break;case r:l=(i-s)/u+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=tt.workingColorSpace){return tt.workingToColorSpace(Bt.copy(this),t),e.r=Bt.r,e.g=Bt.g,e.b=Bt.b,e}getStyle(e=on){tt.workingToColorSpace(Bt.copy(this),e);const t=Bt.r,i=Bt.g,s=Bt.b;return e!==on?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(e,t,i){return this.getHSL(Wn),this.setHSL(Wn.h+e,Wn.s+t,Wn.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(Wn),e.getHSL($s);const i=Br(Wn.h,$s.h,t),s=Br(Wn.s,$s.s,t),r=Br(Wn.l,$s.l,t);return this.setHSL(i,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,i=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*i+r[6]*s,this.g=r[1]*t+r[4]*i+r[7]*s,this.b=r[2]*t+r[5]*i+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Bt=new je;je.NAMES=Uc;let sd=0;class Qi extends bi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:sd++}),this.uuid=Ki(),this.name="",this.type="Material",this.blending=Gi,this.side=Jn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=wa,this.blendDst=Ta,this.blendEquation=fi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new je(0,0,0),this.blendAlpha=0,this.depthFunc=$i,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Zo,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Si,this.stencilZFail=Si,this.stencilZPass=Si,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const i=e[t];if(i===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[t]=i}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Gi&&(i.blending=this.blending),this.side!==Jn&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==wa&&(i.blendSrc=this.blendSrc),this.blendDst!==Ta&&(i.blendDst=this.blendDst),this.blendEquation!==fi&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==$i&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Zo&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Si&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Si&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Si&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(t){const r=s(e.textures),a=s(e.images);r.length>0&&(i.textures=r),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let i=null;if(t!==null){const s=t.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=t[r].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class Ir extends Qi{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new je(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new gn,this.combine=yc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Ct=new L,Xs=new oe;let rd=0;class En{constructor(e,t,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:rd++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=Jo,this.updateRanges=[],this.gpuType=On,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[i+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)Xs.fromBufferAttribute(this,t),Xs.applyMatrix3(e),this.setXY(t,Xs.x,Xs.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)Ct.fromBufferAttribute(this,t),Ct.applyMatrix3(e),this.setXYZ(t,Ct.x,Ct.y,Ct.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)Ct.fromBufferAttribute(this,t),Ct.applyMatrix4(e),this.setXYZ(t,Ct.x,Ct.y,Ct.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)Ct.fromBufferAttribute(this,t),Ct.applyNormalMatrix(e),this.setXYZ(t,Ct.x,Ct.y,Ct.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)Ct.fromBufferAttribute(this,t),Ct.transformDirection(e),this.setXYZ(t,Ct.x,Ct.y,Ct.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=ns(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=jt(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=ns(t,this.array)),t}setX(e,t){return this.normalized&&(t=jt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=ns(t,this.array)),t}setY(e,t){return this.normalized&&(t=jt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=ns(t,this.array)),t}setZ(e,t){return this.normalized&&(t=jt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=ns(t,this.array)),t}setW(e,t){return this.normalized&&(t=jt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=jt(t,this.array),i=jt(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,s){return e*=this.itemSize,this.normalized&&(t=jt(t,this.array),i=jt(i,this.array),s=jt(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this}setXYZW(e,t,i,s,r){return e*=this.itemSize,this.normalized&&(t=jt(t,this.array),i=jt(i,this.array),s=jt(s,this.array),r=jt(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Jo&&(e.usage=this.usage),e}}class Nc extends En{constructor(e,t,i){super(new Uint16Array(e),t,i)}}class Fc extends En{constructor(e,t,i){super(new Uint32Array(e),t,i)}}class it extends En{constructor(e,t,i){super(new Float32Array(e),t,i)}}let ad=0;const an=new ct,sa=new Rt,Ii=new L,tn=new Ps,as=new Ps,Ut=new L;class Nt extends bi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:ad++}),this.uuid=Ki(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Dc(e)?Fc:Nc)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const r=new We().getNormalMatrix(e);i.applyNormalMatrix(r),i.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return an.makeRotationFromQuaternion(e),this.applyMatrix4(an),this}rotateX(e){return an.makeRotationX(e),this.applyMatrix4(an),this}rotateY(e){return an.makeRotationY(e),this.applyMatrix4(an),this}rotateZ(e){return an.makeRotationZ(e),this.applyMatrix4(an),this}translate(e,t,i){return an.makeTranslation(e,t,i),this.applyMatrix4(an),this}scale(e,t,i){return an.makeScale(e,t,i),this.applyMatrix4(an),this}lookAt(e){return sa.lookAt(e),sa.updateMatrix(),this.applyMatrix4(sa.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ii).negate(),this.translate(Ii.x,Ii.y,Ii.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const i=[];for(let s=0,r=e.length;s<r;s++){const a=e[s];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new it(i,3))}else{const i=Math.min(e.length,t.count);for(let s=0;s<i;s++){const r=e[s];t.setXYZ(s,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ps);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new L(-1/0,-1/0,-1/0),new L(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,s=t.length;i<s;i++){const r=t[i];tn.setFromBufferAttribute(r),this.morphTargetsRelative?(Ut.addVectors(this.boundingBox.min,tn.min),this.boundingBox.expandByPoint(Ut),Ut.addVectors(this.boundingBox.max,tn.max),this.boundingBox.expandByPoint(Ut)):(this.boundingBox.expandByPoint(tn.min),this.boundingBox.expandByPoint(tn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Lr);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new L,1/0);return}if(e){const i=this.boundingSphere.center;if(tn.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];as.setFromBufferAttribute(o),this.morphTargetsRelative?(Ut.addVectors(tn.min,as.min),tn.expandByPoint(Ut),Ut.addVectors(tn.max,as.max),tn.expandByPoint(Ut)):(tn.expandByPoint(as.min),tn.expandByPoint(as.max))}tn.getCenter(i);let s=0;for(let r=0,a=e.count;r<a;r++)Ut.fromBufferAttribute(e,r),s=Math.max(s,i.distanceToSquared(Ut));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)Ut.fromBufferAttribute(o,c),l&&(Ii.fromBufferAttribute(e,c),Ut.add(Ii)),s=Math.max(s,i.distanceToSquared(Ut))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new En(new Float32Array(4*i.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let R=0;R<i.count;R++)o[R]=new L,l[R]=new L;const c=new L,h=new L,u=new L,f=new oe,m=new oe,_=new oe,v=new L,p=new L;function d(R,M,b){c.fromBufferAttribute(i,R),h.fromBufferAttribute(i,M),u.fromBufferAttribute(i,b),f.fromBufferAttribute(r,R),m.fromBufferAttribute(r,M),_.fromBufferAttribute(r,b),h.sub(c),u.sub(c),m.sub(f),_.sub(f);const C=1/(m.x*_.y-_.x*m.y);isFinite(C)&&(v.copy(h).multiplyScalar(_.y).addScaledVector(u,-m.y).multiplyScalar(C),p.copy(u).multiplyScalar(m.x).addScaledVector(h,-_.x).multiplyScalar(C),o[R].add(v),o[M].add(v),o[b].add(v),l[R].add(p),l[M].add(p),l[b].add(p))}let x=this.groups;x.length===0&&(x=[{start:0,count:e.count}]);for(let R=0,M=x.length;R<M;++R){const b=x[R],C=b.start,I=b.count;for(let B=C,H=C+I;B<H;B+=3)d(e.getX(B+0),e.getX(B+1),e.getX(B+2))}const y=new L,g=new L,w=new L,T=new L;function S(R){w.fromBufferAttribute(s,R),T.copy(w);const M=o[R];y.copy(M),y.sub(w.multiplyScalar(w.dot(M))).normalize(),g.crossVectors(T,M);const C=g.dot(l[R])<0?-1:1;a.setXYZW(R,y.x,y.y,y.z,C)}for(let R=0,M=x.length;R<M;++R){const b=x[R],C=b.start,I=b.count;for(let B=C,H=C+I;B<H;B+=3)S(e.getX(B+0)),S(e.getX(B+1)),S(e.getX(B+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new En(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let f=0,m=i.count;f<m;f++)i.setXYZ(f,0,0,0);const s=new L,r=new L,a=new L,o=new L,l=new L,c=new L,h=new L,u=new L;if(e)for(let f=0,m=e.count;f<m;f+=3){const _=e.getX(f+0),v=e.getX(f+1),p=e.getX(f+2);s.fromBufferAttribute(t,_),r.fromBufferAttribute(t,v),a.fromBufferAttribute(t,p),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),o.fromBufferAttribute(i,_),l.fromBufferAttribute(i,v),c.fromBufferAttribute(i,p),o.add(h),l.add(h),c.add(h),i.setXYZ(_,o.x,o.y,o.z),i.setXYZ(v,l.x,l.y,l.z),i.setXYZ(p,c.x,c.y,c.z)}else for(let f=0,m=t.count;f<m;f+=3)s.fromBufferAttribute(t,f+0),r.fromBufferAttribute(t,f+1),a.fromBufferAttribute(t,f+2),h.subVectors(a,r),u.subVectors(s,r),h.cross(u),i.setXYZ(f+0,h.x,h.y,h.z),i.setXYZ(f+1,h.x,h.y,h.z),i.setXYZ(f+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)Ut.fromBufferAttribute(e,t),Ut.normalize(),e.setXYZ(t,Ut.x,Ut.y,Ut.z)}toNonIndexed(){function e(o,l){const c=o.array,h=o.itemSize,u=o.normalized,f=new c.constructor(l.length*h);let m=0,_=0;for(let v=0,p=l.length;v<p;v++){o.isInterleavedBufferAttribute?m=l[v]*o.data.stride+o.offset:m=l[v]*h;for(let d=0;d<h;d++)f[_++]=c[m++]}return new En(f,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Nt,i=this.index.array,s=this.attributes;for(const o in s){const l=s[o],c=e(l,i);t.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let h=0,u=c.length;h<u;h++){const f=c[h],m=e(f,i);l.push(m)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let u=0,f=c.length;u<f;u++){const m=c[u];h.push(m.toJSON(e.data))}h.length>0&&(s[l]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const s=e.attributes;for(const c in s){const h=s[c];this.setAttribute(c,h.clone(t))}const r=e.morphAttributes;for(const c in r){const h=[],u=r[c];for(let f=0,m=u.length;f<m;f++)h.push(u[f].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,h=a.length;c<h;c++){const u=a[c];this.addGroup(u.start,u.count,u.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const ul=new ct,ri=new Dr,js=new Lr,dl=new L,qs=new L,Ys=new L,Zs=new L,ra=new L,Js=new L,fl=new L,Ks=new L;class ye extends Rt{constructor(e=new Nt,t=new Ir){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,a=i.morphTargetsRelative;t.fromBufferAttribute(s,e);const o=this.morphTargetInfluences;if(r&&o){Js.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=o[l],u=r[l];h!==0&&(ra.fromBufferAttribute(u,e),a?Js.addScaledVector(ra,h):Js.addScaledVector(ra.sub(t),h))}t.add(Js)}return t}raycast(e,t){const i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),js.copy(i.boundingSphere),js.applyMatrix4(r),ri.copy(e.ray).recast(e.near),!(js.containsPoint(ri.origin)===!1&&(ri.intersectSphere(js,dl)===null||ri.origin.distanceToSquared(dl)>(e.far-e.near)**2))&&(ul.copy(r).invert(),ri.copy(e.ray).applyMatrix4(ul),!(i.boundingBox!==null&&ri.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,ri)))}_computeIntersections(e,t,i){let s;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,f=r.groups,m=r.drawRange;if(o!==null)if(Array.isArray(a))for(let _=0,v=f.length;_<v;_++){const p=f[_],d=a[p.materialIndex],x=Math.max(p.start,m.start),y=Math.min(o.count,Math.min(p.start+p.count,m.start+m.count));for(let g=x,w=y;g<w;g+=3){const T=o.getX(g),S=o.getX(g+1),R=o.getX(g+2);s=Qs(this,d,e,i,c,h,u,T,S,R),s&&(s.faceIndex=Math.floor(g/3),s.face.materialIndex=p.materialIndex,t.push(s))}}else{const _=Math.max(0,m.start),v=Math.min(o.count,m.start+m.count);for(let p=_,d=v;p<d;p+=3){const x=o.getX(p),y=o.getX(p+1),g=o.getX(p+2);s=Qs(this,a,e,i,c,h,u,x,y,g),s&&(s.faceIndex=Math.floor(p/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let _=0,v=f.length;_<v;_++){const p=f[_],d=a[p.materialIndex],x=Math.max(p.start,m.start),y=Math.min(l.count,Math.min(p.start+p.count,m.start+m.count));for(let g=x,w=y;g<w;g+=3){const T=g,S=g+1,R=g+2;s=Qs(this,d,e,i,c,h,u,T,S,R),s&&(s.faceIndex=Math.floor(g/3),s.face.materialIndex=p.materialIndex,t.push(s))}}else{const _=Math.max(0,m.start),v=Math.min(l.count,m.start+m.count);for(let p=_,d=v;p<d;p+=3){const x=p,y=p+1,g=p+2;s=Qs(this,a,e,i,c,h,u,x,y,g),s&&(s.faceIndex=Math.floor(p/3),t.push(s))}}}}function od(n,e,t,i,s,r,a,o){let l;if(e.side===Zt?l=i.intersectTriangle(a,r,s,!0,o):l=i.intersectTriangle(s,r,a,e.side===Jn,o),l===null)return null;Ks.copy(o),Ks.applyMatrix4(n.matrixWorld);const c=t.ray.origin.distanceTo(Ks);return c<t.near||c>t.far?null:{distance:c,point:Ks.clone(),object:n}}function Qs(n,e,t,i,s,r,a,o,l,c){n.getVertexPosition(o,qs),n.getVertexPosition(l,Ys),n.getVertexPosition(c,Zs);const h=od(n,e,t,i,qs,Ys,Zs,fl);if(h){const u=new L;cn.getBarycoord(fl,qs,Ys,Zs,u),s&&(h.uv=cn.getInterpolatedAttribute(s,o,l,c,u,new oe)),r&&(h.uv1=cn.getInterpolatedAttribute(r,o,l,c,u,new oe)),a&&(h.normal=cn.getInterpolatedAttribute(a,o,l,c,u,new L),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));const f={a:o,b:l,c,normal:new L,materialIndex:0};cn.getNormal(qs,Ys,Zs,f.normal),h.face=f,h.barycoord=u}return h}class Mt extends Nt{constructor(e=1,t=1,i=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:s,heightSegments:r,depthSegments:a};const o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],h=[],u=[];let f=0,m=0;_("z","y","x",-1,-1,i,t,e,a,r,0),_("z","y","x",1,-1,i,t,-e,a,r,1),_("x","z","y",1,1,e,i,t,s,a,2),_("x","z","y",1,-1,e,i,-t,s,a,3),_("x","y","z",1,-1,e,t,i,s,r,4),_("x","y","z",-1,-1,e,t,-i,s,r,5),this.setIndex(l),this.setAttribute("position",new it(c,3)),this.setAttribute("normal",new it(h,3)),this.setAttribute("uv",new it(u,2));function _(v,p,d,x,y,g,w,T,S,R,M){const b=g/S,C=w/R,I=g/2,B=w/2,H=T/2,k=S+1,W=R+1;let q=0,$=0;const ie=new L;for(let pe=0;pe<W;pe++){const be=pe*C-B;for(let Oe=0;Oe<k;Oe++){const qe=Oe*b-I;ie[v]=qe*x,ie[p]=be*y,ie[d]=H,c.push(ie.x,ie.y,ie.z),ie[v]=0,ie[p]=0,ie[d]=T>0?1:-1,h.push(ie.x,ie.y,ie.z),u.push(Oe/S),u.push(1-pe/R),q+=1}}for(let pe=0;pe<R;pe++)for(let be=0;be<S;be++){const Oe=f+be+k*pe,qe=f+be+k*(pe+1),Qe=f+(be+1)+k*(pe+1),Ke=f+(be+1)+k*pe;l.push(Oe,qe,Ke),l.push(qe,Qe,Ke),$+=6}o.addGroup(m,$,M),m+=$,f+=q}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Mt(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Yi(n){const e={};for(const t in n){e[t]={};for(const i in n[t]){const s=n[t][i];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=s.clone():Array.isArray(s)?e[t][i]=s.slice():e[t][i]=s}}return e}function Wt(n){const e={};for(let t=0;t<n.length;t++){const i=Yi(n[t]);for(const s in i)e[s]=i[s]}return e}function ld(n){const e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function Oc(n){const e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:tt.workingColorSpace}const cd={clone:Yi,merge:Wt};var hd=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,ud=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Kn extends Qi{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=hd,this.fragmentShader=ud,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Yi(e.uniforms),this.uniformsGroups=ld(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const a=this.uniforms[s].value;a&&a.isTexture?t.uniforms[s]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[s]={type:"m4",value:a.toArray()}:t.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const i={};for(const s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}}class zc extends Rt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ct,this.projectionMatrix=new ct,this.projectionMatrixInverse=new ct,this.coordinateSystem=Sn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const $n=new L,pl=new oe,ml=new oe;class ln extends zc{constructor(e=50,t=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=fo*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(gs*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return fo*2*Math.atan(Math.tan(gs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){$n.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set($n.x,$n.y).multiplyScalar(-e/$n.z),$n.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set($n.x,$n.y).multiplyScalar(-e/$n.z)}getViewSize(e,t){return this.getViewBounds(e,pl,ml),t.subVectors(ml,pl)}setViewOffset(e,t,i,s,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(gs*.5*this.fov)/this.zoom,i=2*t,s=this.aspect*i,r=-.5*s;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*s/l,t-=a.offsetY*i/c,s*=a.width/l,i*=a.height/c}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Ui=-90,Ni=1;class dd extends Rt{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new ln(Ui,Ni,e,t);s.layers=this.layers,this.add(s);const r=new ln(Ui,Ni,e,t);r.layers=this.layers,this.add(r);const a=new ln(Ui,Ni,e,t);a.layers=this.layers,this.add(a);const o=new ln(Ui,Ni,e,t);o.layers=this.layers,this.add(o);const l=new ln(Ui,Ni,e,t);l.layers=this.layers,this.add(l);const c=new ln(Ui,Ni,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[i,s,r,a,o,l]=t;for(const c of t)this.remove(c);if(e===Sn)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Er)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,h]=this.children,u=e.getRenderTarget(),f=e.getActiveCubeFace(),m=e.getActiveMipmapLevel(),_=e.xr.enabled;e.xr.enabled=!1;const v=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,s),e.render(t,r),e.setRenderTarget(i,1,s),e.render(t,a),e.setRenderTarget(i,2,s),e.render(t,o),e.setRenderTarget(i,3,s),e.render(t,l),e.setRenderTarget(i,4,s),e.render(t,c),i.texture.generateMipmaps=v,e.setRenderTarget(i,5,s),e.render(t,h),e.setRenderTarget(u,f,m),e.xr.enabled=_,i.texture.needsPMREMUpdate=!0}}class Bc extends Jt{constructor(e=[],t=Xi,i,s,r,a,o,l,c,h){super(e,t,i,s,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class fd extends xi{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},s=[i,i,i,i,i,i];this.texture=new Bc(s),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Mt(5,5,5),r=new Kn({name:"CubemapFromEquirect",uniforms:Yi(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Zt,blending:Yn});r.uniforms.tEquirect.value=t;const a=new ye(s,r),o=t.minFilter;return t.minFilter===_i&&(t.minFilter=Mn),new dd(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,i=!0,s=!0){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,i,s);e.setRenderTarget(r)}}class us extends Rt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const pd={type:"move"};class aa{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new us,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new us,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new L,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new L),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new us,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new L,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new L),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let s=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const v of e.hand.values()){const p=t.getJointPose(v,i),d=this._getHandJoint(c,v);p!==null&&(d.matrix.fromArray(p.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,d.jointRadius=p.radius),d.visible=p!==null}const h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],f=h.position.distanceTo(u.position),m=.02,_=.005;c.inputState.pinching&&f>m+_?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&f<=m-_&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,i),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(s=t.getPose(e.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(pd)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const i=new us;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}}class md extends Rt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new gn,this.environmentIntensity=1,this.environmentRotation=new gn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}const oa=new L,gd=new L,_d=new We;class jn{constructor(e=new L(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,s){return this.normal.set(e,t,i),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){const s=oa.subVectors(i,t).cross(gd.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const i=e.delta(oa),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(i,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const i=t||_d.getNormalMatrix(e),s=this.coplanarPoint(oa).applyMatrix4(e),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ai=new Lr,vd=new oe(.5,.5),er=new L;class Lo{constructor(e=new jn,t=new jn,i=new jn,s=new jn,r=new jn,a=new jn){this.planes=[e,t,i,s,r,a]}set(e,t,i,s,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(i),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=Sn,i=!1){const s=this.planes,r=e.elements,a=r[0],o=r[1],l=r[2],c=r[3],h=r[4],u=r[5],f=r[6],m=r[7],_=r[8],v=r[9],p=r[10],d=r[11],x=r[12],y=r[13],g=r[14],w=r[15];if(s[0].setComponents(c-a,m-h,d-_,w-x).normalize(),s[1].setComponents(c+a,m+h,d+_,w+x).normalize(),s[2].setComponents(c+o,m+u,d+v,w+y).normalize(),s[3].setComponents(c-o,m-u,d-v,w-y).normalize(),i)s[4].setComponents(l,f,p,g).normalize(),s[5].setComponents(c-l,m-f,d-p,w-g).normalize();else if(s[4].setComponents(c-l,m-f,d-p,w-g).normalize(),t===Sn)s[5].setComponents(c+l,m+f,d+p,w+g).normalize();else if(t===Er)s[5].setComponents(l,f,p,g).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ai.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),ai.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ai)}intersectsSprite(e){ai.center.set(0,0,0);const t=vd.distanceTo(e.center);return ai.radius=.7071067811865476+t,ai.applyMatrix4(e.matrixWorld),this.intersectsSphere(ai)}intersectsSphere(e){const t=this.planes,i=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let i=0;i<6;i++){const s=t[i];if(er.x=s.normal.x>0?e.max.x:e.min.x,er.y=s.normal.y>0?e.max.y:e.min.y,er.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(er)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Zi extends Qi{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new je(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Tr=new L,Ar=new L,gl=new ct,os=new Dr,tr=new Lr,la=new L,_l=new L;class Fn extends Rt{constructor(e=new Nt,t=new Zi){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[0];for(let s=1,r=t.count;s<r;s++)Tr.fromBufferAttribute(t,s-1),Ar.fromBufferAttribute(t,s),i[s]=i[s-1],i[s]+=Tr.distanceTo(Ar);e.setAttribute("lineDistance",new it(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const i=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),tr.copy(i.boundingSphere),tr.applyMatrix4(s),tr.radius+=r,e.ray.intersectsSphere(tr)===!1)return;gl.copy(s).invert(),os.copy(e.ray).applyMatrix4(gl);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,h=i.index,f=i.attributes.position;if(h!==null){const m=Math.max(0,a.start),_=Math.min(h.count,a.start+a.count);for(let v=m,p=_-1;v<p;v+=c){const d=h.getX(v),x=h.getX(v+1),y=nr(this,e,os,l,d,x,v);y&&t.push(y)}if(this.isLineLoop){const v=h.getX(_-1),p=h.getX(m),d=nr(this,e,os,l,v,p,_-1);d&&t.push(d)}}else{const m=Math.max(0,a.start),_=Math.min(f.count,a.start+a.count);for(let v=m,p=_-1;v<p;v+=c){const d=nr(this,e,os,l,v,v+1,v);d&&t.push(d)}if(this.isLineLoop){const v=nr(this,e,os,l,_-1,m,_-1);v&&t.push(v)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){const s=t[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){const o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function nr(n,e,t,i,s,r,a){const o=n.geometry.attributes.position;if(Tr.fromBufferAttribute(o,s),Ar.fromBufferAttribute(o,r),t.distanceSqToSegment(Tr,Ar,la,_l)>i)return;la.applyMatrix4(n.matrixWorld);const c=e.ray.origin.distanceTo(la);if(!(c<e.near||c>e.far))return{distance:c,point:_l.clone().applyMatrix4(n.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:n}}const vl=new L,xl=new L;class Rr extends Fn{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,i=[];for(let s=0,r=t.count;s<r;s+=2)vl.fromBufferAttribute(t,s),xl.fromBufferAttribute(t,s+1),i[s]=s===0?0:i[s-1],i[s+1]=i[s]+vl.distanceTo(xl);e.setAttribute("lineDistance",new it(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class kc extends Jt{constructor(e,t,i=vi,s,r,a,o=mn,l=mn,c,h=Ss,u=1){if(h!==Ss&&h!==Es)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const f={width:e,height:t,depth:u};super(f,s,r,a,o,l,h,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Co(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class Hc extends Jt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class Ft extends Nt{constructor(e=1,t=1,i=1,s=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:i,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};const c=this;s=Math.floor(s),r=Math.floor(r);const h=[],u=[],f=[],m=[];let _=0;const v=[],p=i/2;let d=0;x(),a===!1&&(e>0&&y(!0),t>0&&y(!1)),this.setIndex(h),this.setAttribute("position",new it(u,3)),this.setAttribute("normal",new it(f,3)),this.setAttribute("uv",new it(m,2));function x(){const g=new L,w=new L;let T=0;const S=(t-e)/i;for(let R=0;R<=r;R++){const M=[],b=R/r,C=b*(t-e)+e;for(let I=0;I<=s;I++){const B=I/s,H=B*l+o,k=Math.sin(H),W=Math.cos(H);w.x=C*k,w.y=-b*i+p,w.z=C*W,u.push(w.x,w.y,w.z),g.set(k,S,W).normalize(),f.push(g.x,g.y,g.z),m.push(B,1-b),M.push(_++)}v.push(M)}for(let R=0;R<s;R++)for(let M=0;M<r;M++){const b=v[M][R],C=v[M+1][R],I=v[M+1][R+1],B=v[M][R+1];(e>0||M!==0)&&(h.push(b,C,B),T+=3),(t>0||M!==r-1)&&(h.push(C,I,B),T+=3)}c.addGroup(d,T,0),d+=T}function y(g){const w=_,T=new oe,S=new L;let R=0;const M=g===!0?e:t,b=g===!0?1:-1;for(let I=1;I<=s;I++)u.push(0,p*b,0),f.push(0,b,0),m.push(.5,.5),_++;const C=_;for(let I=0;I<=s;I++){const H=I/s*l+o,k=Math.cos(H),W=Math.sin(H);S.x=M*W,S.y=p*b,S.z=M*k,u.push(S.x,S.y,S.z),f.push(0,b,0),T.x=k*.5+.5,T.y=W*.5*b+.5,m.push(T.x,T.y),_++}for(let I=0;I<s;I++){const B=w+I,H=C+I;g===!0?h.push(H,H+1,B):h.push(H+1,H,B),R+=3}c.addGroup(d,R,g===!0?1:2),d+=R}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ft(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Do extends Nt{constructor(e=[],t=[],i=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:i,detail:s};const r=[],a=[];o(s),c(i),h(),this.setAttribute("position",new it(r,3)),this.setAttribute("normal",new it(r.slice(),3)),this.setAttribute("uv",new it(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(x){const y=new L,g=new L,w=new L;for(let T=0;T<t.length;T+=3)m(t[T+0],y),m(t[T+1],g),m(t[T+2],w),l(y,g,w,x)}function l(x,y,g,w){const T=w+1,S=[];for(let R=0;R<=T;R++){S[R]=[];const M=x.clone().lerp(g,R/T),b=y.clone().lerp(g,R/T),C=T-R;for(let I=0;I<=C;I++)I===0&&R===T?S[R][I]=M:S[R][I]=M.clone().lerp(b,I/C)}for(let R=0;R<T;R++)for(let M=0;M<2*(T-R)-1;M++){const b=Math.floor(M/2);M%2===0?(f(S[R][b+1]),f(S[R+1][b]),f(S[R][b])):(f(S[R][b+1]),f(S[R+1][b+1]),f(S[R+1][b]))}}function c(x){const y=new L;for(let g=0;g<r.length;g+=3)y.x=r[g+0],y.y=r[g+1],y.z=r[g+2],y.normalize().multiplyScalar(x),r[g+0]=y.x,r[g+1]=y.y,r[g+2]=y.z}function h(){const x=new L;for(let y=0;y<r.length;y+=3){x.x=r[y+0],x.y=r[y+1],x.z=r[y+2];const g=p(x)/2/Math.PI+.5,w=d(x)/Math.PI+.5;a.push(g,1-w)}_(),u()}function u(){for(let x=0;x<a.length;x+=6){const y=a[x+0],g=a[x+2],w=a[x+4],T=Math.max(y,g,w),S=Math.min(y,g,w);T>.9&&S<.1&&(y<.2&&(a[x+0]+=1),g<.2&&(a[x+2]+=1),w<.2&&(a[x+4]+=1))}}function f(x){r.push(x.x,x.y,x.z)}function m(x,y){const g=x*3;y.x=e[g+0],y.y=e[g+1],y.z=e[g+2]}function _(){const x=new L,y=new L,g=new L,w=new L,T=new oe,S=new oe,R=new oe;for(let M=0,b=0;M<r.length;M+=9,b+=6){x.set(r[M+0],r[M+1],r[M+2]),y.set(r[M+3],r[M+4],r[M+5]),g.set(r[M+6],r[M+7],r[M+8]),T.set(a[b+0],a[b+1]),S.set(a[b+2],a[b+3]),R.set(a[b+4],a[b+5]),w.copy(x).add(y).add(g).divideScalar(3);const C=p(w);v(T,b+0,x,C),v(S,b+2,y,C),v(R,b+4,g,C)}}function v(x,y,g,w){w<0&&x.x===1&&(a[y]=x.x-1),g.x===0&&g.z===0&&(a[y]=w/2/Math.PI+.5)}function p(x){return Math.atan2(x.z,-x.x)}function d(x){return Math.atan2(-x.y,Math.sqrt(x.x*x.x+x.z*x.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Do(e.vertices,e.indices,e.radius,e.details)}}const ir=new L,sr=new L,ca=new L,rr=new cn;class po extends Nt{constructor(e=null,t=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:e,thresholdAngle:t},e!==null){const s=Math.pow(10,4),r=Math.cos(gs*t),a=e.getIndex(),o=e.getAttribute("position"),l=a?a.count:o.count,c=[0,0,0],h=["a","b","c"],u=new Array(3),f={},m=[];for(let _=0;_<l;_+=3){a?(c[0]=a.getX(_),c[1]=a.getX(_+1),c[2]=a.getX(_+2)):(c[0]=_,c[1]=_+1,c[2]=_+2);const{a:v,b:p,c:d}=rr;if(v.fromBufferAttribute(o,c[0]),p.fromBufferAttribute(o,c[1]),d.fromBufferAttribute(o,c[2]),rr.getNormal(ca),u[0]=`${Math.round(v.x*s)},${Math.round(v.y*s)},${Math.round(v.z*s)}`,u[1]=`${Math.round(p.x*s)},${Math.round(p.y*s)},${Math.round(p.z*s)}`,u[2]=`${Math.round(d.x*s)},${Math.round(d.y*s)},${Math.round(d.z*s)}`,!(u[0]===u[1]||u[1]===u[2]||u[2]===u[0]))for(let x=0;x<3;x++){const y=(x+1)%3,g=u[x],w=u[y],T=rr[h[x]],S=rr[h[y]],R=`${g}_${w}`,M=`${w}_${g}`;M in f&&f[M]?(ca.dot(f[M].normal)<=r&&(m.push(T.x,T.y,T.z),m.push(S.x,S.y,S.z)),f[M]=null):R in f||(f[R]={index0:c[x],index1:c[y],normal:ca.clone()})}}for(const _ in f)if(f[_]){const{index0:v,index1:p}=f[_];ir.fromBufferAttribute(o,v),sr.fromBufferAttribute(o,p),m.push(ir.x,ir.y,ir.z),m.push(sr.x,sr.y,sr.z)}this.setAttribute("position",new it(m,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}}class An{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){console.warn("THREE.Curve: .getPoint() not implemented.")}getPointAt(e,t){const i=this.getUtoTmapping(e);return this.getPoint(i,t)}getPoints(e=5){const t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return t}getSpacedPoints(e=5){const t=[];for(let i=0;i<=e;i++)t.push(this.getPointAt(i/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let i,s=this.getPoint(0),r=0;t.push(0);for(let a=1;a<=e;a++)i=this.getPoint(a/e),r+=i.distanceTo(s),t.push(r),s=i;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){const i=this.getLengths();let s=0;const r=i.length;let a;t?a=t:a=e*i[r-1];let o=0,l=r-1,c;for(;o<=l;)if(s=Math.floor(o+(l-o)/2),c=i[s]-a,c<0)o=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,i[s]===a)return s/(r-1);const h=i[s],f=i[s+1]-h,m=(a-h)/f;return(s+m)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);const a=this.getPoint(s),o=this.getPoint(r),l=t||(a.isVector2?new oe:new L);return l.copy(o).sub(a).normalize(),l}getTangentAt(e,t){const i=this.getUtoTmapping(e);return this.getTangent(i,t)}computeFrenetFrames(e,t=!1){const i=new L,s=[],r=[],a=[],o=new L,l=new ct;for(let m=0;m<=e;m++){const _=m/e;s[m]=this.getTangentAt(_,new L)}r[0]=new L,a[0]=new L;let c=Number.MAX_VALUE;const h=Math.abs(s[0].x),u=Math.abs(s[0].y),f=Math.abs(s[0].z);h<=c&&(c=h,i.set(1,0,0)),u<=c&&(c=u,i.set(0,1,0)),f<=c&&i.set(0,0,1),o.crossVectors(s[0],i).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let m=1;m<=e;m++){if(r[m]=r[m-1].clone(),a[m]=a[m-1].clone(),o.crossVectors(s[m-1],s[m]),o.length()>Number.EPSILON){o.normalize();const _=Math.acos(Xe(s[m-1].dot(s[m]),-1,1));r[m].applyMatrix4(l.makeRotationAxis(o,_))}a[m].crossVectors(s[m],r[m])}if(t===!0){let m=Math.acos(Xe(r[0].dot(r[e]),-1,1));m/=e,s[0].dot(o.crossVectors(r[0],r[e]))>0&&(m=-m);for(let _=1;_<=e;_++)r[_].applyMatrix4(l.makeRotationAxis(s[_],m*_)),a[_].crossVectors(s[_],r[_])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class Io extends An{constructor(e=0,t=0,i=1,s=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=i,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(e,t=new oe){const i=t,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);const o=this.aStartAngle+e*r;let l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),f=l-this.aX,m=c-this.aY;l=f*h-m*u+this.aX,c=f*u+m*h+this.aY}return i.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class xd extends Io{constructor(e,t,i,s,r,a){super(e,t,i,i,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function Uo(){let n=0,e=0,t=0,i=0;function s(r,a,o,l){n=r,e=o,t=-3*r+3*a-2*o-l,i=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){s(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,h,u){let f=(a-r)/c-(o-r)/(c+h)+(o-a)/h,m=(o-a)/h-(l-a)/(h+u)+(l-o)/u;f*=h,m*=h,s(a,o,f,m)},calc:function(r){const a=r*r,o=a*r;return n+e*r+t*a+i*o}}}const ar=new L,ha=new Uo,ua=new Uo,da=new Uo;class yd extends An{constructor(e=[],t=!1,i="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=i,this.tension=s}getPoint(e,t=new L){const i=t,s=this.points,r=s.length,a=(r-(this.closed?0:1))*e;let o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,h;this.closed||o>0?c=s[(o-1)%r]:(ar.subVectors(s[0],s[1]).add(s[0]),c=ar);const u=s[o%r],f=s[(o+1)%r];if(this.closed||o+2<r?h=s[(o+2)%r]:(ar.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=ar),this.curveType==="centripetal"||this.curveType==="chordal"){const m=this.curveType==="chordal"?.5:.25;let _=Math.pow(c.distanceToSquared(u),m),v=Math.pow(u.distanceToSquared(f),m),p=Math.pow(f.distanceToSquared(h),m);v<1e-4&&(v=1),_<1e-4&&(_=v),p<1e-4&&(p=v),ha.initNonuniformCatmullRom(c.x,u.x,f.x,h.x,_,v,p),ua.initNonuniformCatmullRom(c.y,u.y,f.y,h.y,_,v,p),da.initNonuniformCatmullRom(c.z,u.z,f.z,h.z,_,v,p)}else this.curveType==="catmullrom"&&(ha.initCatmullRom(c.x,u.x,f.x,h.x,this.tension),ua.initCatmullRom(c.y,u.y,f.y,h.y,this.tension),da.initCatmullRom(c.z,u.z,f.z,h.z,this.tension));return i.set(ha.calc(l),ua.calc(l),da.calc(l)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){const s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const s=e.points[t];this.points.push(new L().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function yl(n,e,t,i,s){const r=(i-e)*.5,a=(s-t)*.5,o=n*n,l=n*o;return(2*t-2*i+r+a)*l+(-3*t+3*i-2*r-a)*o+r*n+t}function bd(n,e){const t=1-n;return t*t*e}function Md(n,e){return 2*(1-n)*n*e}function Sd(n,e){return n*n*e}function _s(n,e,t,i){return bd(n,e)+Md(n,t)+Sd(n,i)}function Ed(n,e){const t=1-n;return t*t*t*e}function wd(n,e){const t=1-n;return 3*t*t*n*e}function Td(n,e){return 3*(1-n)*n*n*e}function Ad(n,e){return n*n*n*e}function vs(n,e,t,i,s){return Ed(n,e)+wd(n,t)+Td(n,i)+Ad(n,s)}class Vc extends An{constructor(e=new oe,t=new oe,i=new oe,s=new oe){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=i,this.v3=s}getPoint(e,t=new oe){const i=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return i.set(vs(e,s.x,r.x,a.x,o.x),vs(e,s.y,r.y,a.y,o.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class Rd extends An{constructor(e=new L,t=new L,i=new L,s=new L){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=i,this.v3=s}getPoint(e,t=new L){const i=t,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return i.set(vs(e,s.x,r.x,a.x,o.x),vs(e,s.y,r.y,a.y,o.y),vs(e,s.z,r.z,a.z,o.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class Gc extends An{constructor(e=new oe,t=new oe){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new oe){const i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new oe){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Cd extends An{constructor(e=new L,t=new L){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new L){const i=t;return e===1?i.copy(this.v2):(i.copy(this.v2).sub(this.v1),i.multiplyScalar(e).add(this.v1)),i}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new L){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Wc extends An{constructor(e=new oe,t=new oe,i=new oe){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new oe){const i=t,s=this.v0,r=this.v1,a=this.v2;return i.set(_s(e,s.x,r.x,a.x),_s(e,s.y,r.y,a.y)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Pd extends An{constructor(e=new L,t=new L,i=new L){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=i}getPoint(e,t=new L){const i=t,s=this.v0,r=this.v1,a=this.v2;return i.set(_s(e,s.x,r.x,a.x),_s(e,s.y,r.y,a.y),_s(e,s.z,r.z,a.z)),i}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class $c extends An{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new oe){const i=t,s=this.points,r=(s.length-1)*e,a=Math.floor(r),o=r-a,l=s[a===0?a:a-1],c=s[a],h=s[a>s.length-2?s.length-1:a+1],u=s[a>s.length-3?s.length-1:a+2];return i.set(yl(o,l.x,c.x,h.x,u.x),yl(o,l.y,c.y,h.y,u.y)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const s=e.points[t];this.points.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){const s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){const s=e.points[t];this.points.push(new oe().fromArray(s))}return this}}var mo=Object.freeze({__proto__:null,ArcCurve:xd,CatmullRomCurve3:yd,CubicBezierCurve:Vc,CubicBezierCurve3:Rd,EllipseCurve:Io,LineCurve:Gc,LineCurve3:Cd,QuadraticBezierCurve:Wc,QuadraticBezierCurve3:Pd,SplineCurve:$c});class Ld extends An{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const i=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new mo[i](t,e))}return this}getPoint(e,t){const i=e*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=i){const a=s[r]-i,o=this.curves[r],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,t)}r++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let i=0,s=this.curves.length;i<s;i++)t+=this.curves[i].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let i;for(let s=0,r=this.curves;s<r.length;s++){const a=r[s],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,l=a.getPoints(o);for(let c=0;c<l.length;c++){const h=l[c];i&&i.equals(h)||(t.push(h),i=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){const s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,i=this.curves.length;t<i;t++){const s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,i=e.curves.length;t<i;t++){const s=e.curves[t];this.curves.push(new mo[s.type]().fromJSON(s))}return this}}class go extends Ld{constructor(e){super(),this.type="Path",this.currentPoint=new oe,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,i=e.length;t<i;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const i=new Gc(this.currentPoint.clone(),new oe(e,t));return this.curves.push(i),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,i,s){const r=new Wc(this.currentPoint.clone(),new oe(e,t),new oe(i,s));return this.curves.push(r),this.currentPoint.set(i,s),this}bezierCurveTo(e,t,i,s,r,a){const o=new Vc(this.currentPoint.clone(),new oe(e,t),new oe(i,s),new oe(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),i=new $c(t);return this.curves.push(i),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,i,s,r,a){const o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+o,t+l,i,s,r,a),this}absarc(e,t,i,s,r,a){return this.absellipse(e,t,i,i,s,r,a),this}ellipse(e,t,i,s,r,a,o,l){const c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+c,t+h,i,s,r,a,o,l),this}absellipse(e,t,i,s,r,a,o,l){const c=new Io(e,t,i,s,r,a,o,l);if(this.curves.length>0){const u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);const h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class yr extends go{constructor(e){super(e),this.uuid=Ki(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let i=0,s=this.holes.length;i<s;i++)t[i]=this.holes[i].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){const s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,i=this.holes.length;t<i;t++){const s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,i=e.holes.length;t<i;t++){const s=e.holes[t];this.holes.push(new go().fromJSON(s))}return this}}function Dd(n,e,t=2){const i=e&&e.length,s=i?e[0]*t:n.length;let r=Xc(n,0,s,t,!0);const a=[];if(!r||r.next===r.prev)return a;let o,l,c;if(i&&(r=Od(n,e,r,t)),n.length>80*t){o=1/0,l=1/0;let h=-1/0,u=-1/0;for(let f=t;f<s;f+=t){const m=n[f],_=n[f+1];m<o&&(o=m),_<l&&(l=_),m>h&&(h=m),_>u&&(u=_)}c=Math.max(h-o,u-l),c=c!==0?32767/c:0}return Ts(r,a,t,o,l,c,0),a}function Xc(n,e,t,i,s){let r;if(s===qd(n,e,t,i)>0)for(let a=e;a<t;a+=i)r=bl(a/i|0,n[a],n[a+1],r);else for(let a=t-i;a>=e;a-=i)r=bl(a/i|0,n[a],n[a+1],r);return r&&Ji(r,r.next)&&(Rs(r),r=r.next),r}function yi(n,e){if(!n)return n;e||(e=n);let t=n,i;do if(i=!1,!t.steiner&&(Ji(t,t.next)||St(t.prev,t,t.next)===0)){if(Rs(t),t=e=t.prev,t===t.next)break;i=!0}else t=t.next;while(i||t!==e);return e}function Ts(n,e,t,i,s,r,a){if(!n)return;!a&&r&&Vd(n,i,s,r);let o=n;for(;n.prev!==n.next;){const l=n.prev,c=n.next;if(r?Ud(n,i,s,r):Id(n)){e.push(l.i,n.i,c.i),Rs(n),n=c.next,o=c.next;continue}if(n=c,n===o){a?a===1?(n=Nd(yi(n),e),Ts(n,e,t,i,s,r,2)):a===2&&Fd(n,e,t,i,s,r):Ts(yi(n),e,t,i,s,r,1);break}}}function Id(n){const e=n.prev,t=n,i=n.next;if(St(e,t,i)>=0)return!1;const s=e.x,r=t.x,a=i.x,o=e.y,l=t.y,c=i.y,h=Math.min(s,r,a),u=Math.min(o,l,c),f=Math.max(s,r,a),m=Math.max(o,l,c);let _=i.next;for(;_!==e;){if(_.x>=h&&_.x<=f&&_.y>=u&&_.y<=m&&ds(s,o,r,l,a,c,_.x,_.y)&&St(_.prev,_,_.next)>=0)return!1;_=_.next}return!0}function Ud(n,e,t,i){const s=n.prev,r=n,a=n.next;if(St(s,r,a)>=0)return!1;const o=s.x,l=r.x,c=a.x,h=s.y,u=r.y,f=a.y,m=Math.min(o,l,c),_=Math.min(h,u,f),v=Math.max(o,l,c),p=Math.max(h,u,f),d=_o(m,_,e,t,i),x=_o(v,p,e,t,i);let y=n.prevZ,g=n.nextZ;for(;y&&y.z>=d&&g&&g.z<=x;){if(y.x>=m&&y.x<=v&&y.y>=_&&y.y<=p&&y!==s&&y!==a&&ds(o,h,l,u,c,f,y.x,y.y)&&St(y.prev,y,y.next)>=0||(y=y.prevZ,g.x>=m&&g.x<=v&&g.y>=_&&g.y<=p&&g!==s&&g!==a&&ds(o,h,l,u,c,f,g.x,g.y)&&St(g.prev,g,g.next)>=0))return!1;g=g.nextZ}for(;y&&y.z>=d;){if(y.x>=m&&y.x<=v&&y.y>=_&&y.y<=p&&y!==s&&y!==a&&ds(o,h,l,u,c,f,y.x,y.y)&&St(y.prev,y,y.next)>=0)return!1;y=y.prevZ}for(;g&&g.z<=x;){if(g.x>=m&&g.x<=v&&g.y>=_&&g.y<=p&&g!==s&&g!==a&&ds(o,h,l,u,c,f,g.x,g.y)&&St(g.prev,g,g.next)>=0)return!1;g=g.nextZ}return!0}function Nd(n,e){let t=n;do{const i=t.prev,s=t.next.next;!Ji(i,s)&&qc(i,t,t.next,s)&&As(i,s)&&As(s,i)&&(e.push(i.i,t.i,s.i),Rs(t),Rs(t.next),t=n=s),t=t.next}while(t!==n);return yi(t)}function Fd(n,e,t,i,s,r){let a=n;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&$d(a,o)){let l=Yc(a,o);a=yi(a,a.next),l=yi(l,l.next),Ts(a,e,t,i,s,r,0),Ts(l,e,t,i,s,r,0);return}o=o.next}a=a.next}while(a!==n)}function Od(n,e,t,i){const s=[];for(let r=0,a=e.length;r<a;r++){const o=e[r]*i,l=r<a-1?e[r+1]*i:n.length,c=Xc(n,o,l,i,!1);c===c.next&&(c.steiner=!0),s.push(Wd(c))}s.sort(zd);for(let r=0;r<s.length;r++)t=Bd(s[r],t);return t}function zd(n,e){let t=n.x-e.x;if(t===0&&(t=n.y-e.y,t===0)){const i=(n.next.y-n.y)/(n.next.x-n.x),s=(e.next.y-e.y)/(e.next.x-e.x);t=i-s}return t}function Bd(n,e){const t=kd(n,e);if(!t)return e;const i=Yc(t,n);return yi(i,i.next),yi(t,t.next)}function kd(n,e){let t=e;const i=n.x,s=n.y;let r=-1/0,a;if(Ji(n,t))return t;do{if(Ji(n,t.next))return t.next;if(s<=t.y&&s>=t.next.y&&t.next.y!==t.y){const u=t.x+(s-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(u<=i&&u>r&&(r=u,a=t.x<t.next.x?t:t.next,u===i))return a}t=t.next}while(t!==e);if(!a)return null;const o=a,l=a.x,c=a.y;let h=1/0;t=a;do{if(i>=t.x&&t.x>=l&&i!==t.x&&jc(s<c?i:r,s,l,c,s<c?r:i,s,t.x,t.y)){const u=Math.abs(s-t.y)/(i-t.x);As(t,n)&&(u<h||u===h&&(t.x>a.x||t.x===a.x&&Hd(a,t)))&&(a=t,h=u)}t=t.next}while(t!==o);return a}function Hd(n,e){return St(n.prev,n,e.prev)<0&&St(e.next,n,n.next)<0}function Vd(n,e,t,i){let s=n;do s.z===0&&(s.z=_o(s.x,s.y,e,t,i)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==n);s.prevZ.nextZ=null,s.prevZ=null,Gd(s)}function Gd(n){let e,t=1;do{let i=n,s;n=null;let r=null;for(e=0;i;){e++;let a=i,o=0;for(let c=0;c<t&&(o++,a=a.nextZ,!!a);c++);let l=t;for(;o>0||l>0&&a;)o!==0&&(l===0||!a||i.z<=a.z)?(s=i,i=i.nextZ,o--):(s=a,a=a.nextZ,l--),r?r.nextZ=s:n=s,s.prevZ=r,r=s;i=a}r.nextZ=null,t*=2}while(e>1);return n}function _o(n,e,t,i,s){return n=(n-t)*s|0,e=(e-i)*s|0,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,n|e<<1}function Wd(n){let e=n,t=n;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==n);return t}function jc(n,e,t,i,s,r,a,o){return(s-a)*(e-o)>=(n-a)*(r-o)&&(n-a)*(i-o)>=(t-a)*(e-o)&&(t-a)*(r-o)>=(s-a)*(i-o)}function ds(n,e,t,i,s,r,a,o){return!(n===a&&e===o)&&jc(n,e,t,i,s,r,a,o)}function $d(n,e){return n.next.i!==e.i&&n.prev.i!==e.i&&!Xd(n,e)&&(As(n,e)&&As(e,n)&&jd(n,e)&&(St(n.prev,n,e.prev)||St(n,e.prev,e))||Ji(n,e)&&St(n.prev,n,n.next)>0&&St(e.prev,e,e.next)>0)}function St(n,e,t){return(e.y-n.y)*(t.x-e.x)-(e.x-n.x)*(t.y-e.y)}function Ji(n,e){return n.x===e.x&&n.y===e.y}function qc(n,e,t,i){const s=lr(St(n,e,t)),r=lr(St(n,e,i)),a=lr(St(t,i,n)),o=lr(St(t,i,e));return!!(s!==r&&a!==o||s===0&&or(n,t,e)||r===0&&or(n,i,e)||a===0&&or(t,n,i)||o===0&&or(t,e,i))}function or(n,e,t){return e.x<=Math.max(n.x,t.x)&&e.x>=Math.min(n.x,t.x)&&e.y<=Math.max(n.y,t.y)&&e.y>=Math.min(n.y,t.y)}function lr(n){return n>0?1:n<0?-1:0}function Xd(n,e){let t=n;do{if(t.i!==n.i&&t.next.i!==n.i&&t.i!==e.i&&t.next.i!==e.i&&qc(t,t.next,n,e))return!0;t=t.next}while(t!==n);return!1}function As(n,e){return St(n.prev,n,n.next)<0?St(n,e,n.next)>=0&&St(n,n.prev,e)>=0:St(n,e,n.prev)<0||St(n,n.next,e)<0}function jd(n,e){let t=n,i=!1;const s=(n.x+e.x)/2,r=(n.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&s<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(i=!i),t=t.next;while(t!==n);return i}function Yc(n,e){const t=vo(n.i,n.x,n.y),i=vo(e.i,e.x,e.y),s=n.next,r=e.prev;return n.next=e,e.prev=n,t.next=s,s.prev=t,i.next=t,t.prev=i,r.next=i,i.prev=r,i}function bl(n,e,t,i){const s=vo(n,e,t);return i?(s.next=i.next,s.prev=i,i.next.prev=s,i.next=s):(s.prev=s,s.next=s),s}function Rs(n){n.next.prev=n.prev,n.prev.next=n.next,n.prevZ&&(n.prevZ.nextZ=n.nextZ),n.nextZ&&(n.nextZ.prevZ=n.prevZ)}function vo(n,e,t){return{i:n,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function qd(n,e,t,i){let s=0;for(let r=e,a=t-i;r<t;r+=i)s+=(n[a]-n[r])*(n[r+1]+n[a+1]),a=r;return s}class Yd{static triangulate(e,t,i=2){return Dd(e,t,i)}}class Bi{static area(e){const t=e.length;let i=0;for(let s=t-1,r=0;r<t;s=r++)i+=e[s].x*e[r].y-e[r].x*e[s].y;return i*.5}static isClockWise(e){return Bi.area(e)<0}static triangulateShape(e,t){const i=[],s=[],r=[];Ml(e),Sl(i,e);let a=e.length;t.forEach(Ml);for(let l=0;l<t.length;l++)s.push(a),a+=t[l].length,Sl(i,t[l]);const o=Yd.triangulate(i,s);for(let l=0;l<o.length;l+=3)r.push(o.slice(l,l+3));return r}}function Ml(n){const e=n.length;e>2&&n[e-1].equals(n[0])&&n.pop()}function Sl(n,e){for(let t=0;t<e.length;t++)n.push(e[t].x),n.push(e[t].y)}class No extends Nt{constructor(e=new yr([new oe(.5,.5),new oe(-.5,.5),new oe(-.5,-.5),new oe(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];const i=this,s=[],r=[];for(let o=0,l=e.length;o<l;o++){const c=e[o];a(c)}this.setAttribute("position",new it(s,3)),this.setAttribute("uv",new it(r,2)),this.computeVertexNormals();function a(o){const l=[],c=t.curveSegments!==void 0?t.curveSegments:12,h=t.steps!==void 0?t.steps:1,u=t.depth!==void 0?t.depth:1;let f=t.bevelEnabled!==void 0?t.bevelEnabled:!0,m=t.bevelThickness!==void 0?t.bevelThickness:.2,_=t.bevelSize!==void 0?t.bevelSize:m-.1,v=t.bevelOffset!==void 0?t.bevelOffset:0,p=t.bevelSegments!==void 0?t.bevelSegments:3;const d=t.extrudePath,x=t.UVGenerator!==void 0?t.UVGenerator:Zd;let y,g=!1,w,T,S,R;d&&(y=d.getSpacedPoints(h),g=!0,f=!1,w=d.computeFrenetFrames(h,!1),T=new L,S=new L,R=new L),f||(p=0,m=0,_=0,v=0);const M=o.extractPoints(c);let b=M.shape;const C=M.holes;if(!Bi.isClockWise(b)){b=b.reverse();for(let te=0,K=C.length;te<K;te++){const J=C[te];Bi.isClockWise(J)&&(C[te]=J.reverse())}}function B(te){const J=10000000000000001e-36;let Z=te[0];for(let ue=1;ue<=te.length;ue++){const se=ue%te.length,de=te[se],ke=de.x-Z.x,Be=de.y-Z.y,P=ke*ke+Be*Be,E=Math.max(Math.abs(de.x),Math.abs(de.y),Math.abs(Z.x),Math.abs(Z.y)),z=J*E*E;if(P<=z){te.splice(se,1),ue--;continue}Z=de}}B(b),C.forEach(B);const H=C.length,k=b;for(let te=0;te<H;te++){const K=C[te];b=b.concat(K)}function W(te,K,J){return K||console.error("THREE.ExtrudeGeometry: vec does not exist"),te.clone().addScaledVector(K,J)}const q=b.length;function $(te,K,J){let Z,ue,se;const de=te.x-K.x,ke=te.y-K.y,Be=J.x-te.x,P=J.y-te.y,E=de*de+ke*ke,z=de*P-ke*Be;if(Math.abs(z)>Number.EPSILON){const X=Math.sqrt(E),ee=Math.sqrt(Be*Be+P*P),j=K.x-ke/X,Pe=K.y+de/X,he=J.x-P/ee,Ae=J.y+Be/ee,Re=((he-j)*P-(Ae-Pe)*Be)/(de*P-ke*Be);Z=j+de*Re-te.x,ue=Pe+ke*Re-te.y;const re=Z*Z+ue*ue;if(re<=2)return new oe(Z,ue);se=Math.sqrt(re/2)}else{let X=!1;de>Number.EPSILON?Be>Number.EPSILON&&(X=!0):de<-Number.EPSILON?Be<-Number.EPSILON&&(X=!0):Math.sign(ke)===Math.sign(P)&&(X=!0),X?(Z=-ke,ue=de,se=Math.sqrt(E)):(Z=de,ue=ke,se=Math.sqrt(E/2))}return new oe(Z/se,ue/se)}const ie=[];for(let te=0,K=k.length,J=K-1,Z=te+1;te<K;te++,J++,Z++)J===K&&(J=0),Z===K&&(Z=0),ie[te]=$(k[te],k[J],k[Z]);const pe=[];let be,Oe=ie.concat();for(let te=0,K=H;te<K;te++){const J=C[te];be=[];for(let Z=0,ue=J.length,se=ue-1,de=Z+1;Z<ue;Z++,se++,de++)se===ue&&(se=0),de===ue&&(de=0),be[Z]=$(J[Z],J[se],J[de]);pe.push(be),Oe=Oe.concat(be)}let qe;if(p===0)qe=Bi.triangulateShape(k,C);else{const te=[],K=[];for(let J=0;J<p;J++){const Z=J/p,ue=m*Math.cos(Z*Math.PI/2),se=_*Math.sin(Z*Math.PI/2)+v;for(let de=0,ke=k.length;de<ke;de++){const Be=W(k[de],ie[de],se);De(Be.x,Be.y,-ue),Z===0&&te.push(Be)}for(let de=0,ke=H;de<ke;de++){const Be=C[de];be=pe[de];const P=[];for(let E=0,z=Be.length;E<z;E++){const X=W(Be[E],be[E],se);De(X.x,X.y,-ue),Z===0&&P.push(X)}Z===0&&K.push(P)}}qe=Bi.triangulateShape(te,K)}const Qe=qe.length,Ke=_+v;for(let te=0;te<q;te++){const K=f?W(b[te],Oe[te],Ke):b[te];g?(S.copy(w.normals[0]).multiplyScalar(K.x),T.copy(w.binormals[0]).multiplyScalar(K.y),R.copy(y[0]).add(S).add(T),De(R.x,R.y,R.z)):De(K.x,K.y,0)}for(let te=1;te<=h;te++)for(let K=0;K<q;K++){const J=f?W(b[K],Oe[K],Ke):b[K];g?(S.copy(w.normals[te]).multiplyScalar(J.x),T.copy(w.binormals[te]).multiplyScalar(J.y),R.copy(y[te]).add(S).add(T),De(R.x,R.y,R.z)):De(J.x,J.y,u/h*te)}for(let te=p-1;te>=0;te--){const K=te/p,J=m*Math.cos(K*Math.PI/2),Z=_*Math.sin(K*Math.PI/2)+v;for(let ue=0,se=k.length;ue<se;ue++){const de=W(k[ue],ie[ue],Z);De(de.x,de.y,u+J)}for(let ue=0,se=C.length;ue<se;ue++){const de=C[ue];be=pe[ue];for(let ke=0,Be=de.length;ke<Be;ke++){const P=W(de[ke],be[ke],Z);g?De(P.x,P.y+y[h-1].y,y[h-1].x+J):De(P.x,P.y,u+J)}}}Y(),ne();function Y(){const te=s.length/3;if(f){let K=0,J=q*K;for(let Z=0;Z<Qe;Z++){const ue=qe[Z];Te(ue[2]+J,ue[1]+J,ue[0]+J)}K=h+p*2,J=q*K;for(let Z=0;Z<Qe;Z++){const ue=qe[Z];Te(ue[0]+J,ue[1]+J,ue[2]+J)}}else{for(let K=0;K<Qe;K++){const J=qe[K];Te(J[2],J[1],J[0])}for(let K=0;K<Qe;K++){const J=qe[K];Te(J[0]+q*h,J[1]+q*h,J[2]+q*h)}}i.addGroup(te,s.length/3-te,0)}function ne(){const te=s.length/3;let K=0;Se(k,K),K+=k.length;for(let J=0,Z=C.length;J<Z;J++){const ue=C[J];Se(ue,K),K+=ue.length}i.addGroup(te,s.length/3-te,1)}function Se(te,K){let J=te.length;for(;--J>=0;){const Z=J;let ue=J-1;ue<0&&(ue=te.length-1);for(let se=0,de=h+p*2;se<de;se++){const ke=q*se,Be=q*(se+1),P=K+Z+ke,E=K+ue+ke,z=K+ue+Be,X=K+Z+Be;Ye(P,E,z,X)}}}function De(te,K,J){l.push(te),l.push(K),l.push(J)}function Te(te,K,J){ft(te),ft(K),ft(J);const Z=s.length/3,ue=x.generateTopUV(i,s,Z-3,Z-2,Z-1);D(ue[0]),D(ue[1]),D(ue[2])}function Ye(te,K,J,Z){ft(te),ft(K),ft(Z),ft(K),ft(J),ft(Z);const ue=s.length/3,se=x.generateSideWallUV(i,s,ue-6,ue-3,ue-2,ue-1);D(se[0]),D(se[1]),D(se[3]),D(se[1]),D(se[2]),D(se[3])}function ft(te){s.push(l[te*3+0]),s.push(l[te*3+1]),s.push(l[te*3+2])}function D(te){r.push(te.x),r.push(te.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes,i=this.parameters.options;return Jd(t,i,e)}static fromJSON(e,t){const i=[];for(let r=0,a=e.shapes.length;r<a;r++){const o=t[e.shapes[r]];i.push(o)}const s=e.options.extrudePath;return s!==void 0&&(e.options.extrudePath=new mo[s.type]().fromJSON(s)),new No(i,e.options)}}const Zd={generateTopUV:function(n,e,t,i,s){const r=e[t*3],a=e[t*3+1],o=e[i*3],l=e[i*3+1],c=e[s*3],h=e[s*3+1];return[new oe(r,a),new oe(o,l),new oe(c,h)]},generateSideWallUV:function(n,e,t,i,s,r){const a=e[t*3],o=e[t*3+1],l=e[t*3+2],c=e[i*3],h=e[i*3+1],u=e[i*3+2],f=e[s*3],m=e[s*3+1],_=e[s*3+2],v=e[r*3],p=e[r*3+1],d=e[r*3+2];return Math.abs(o-h)<Math.abs(a-c)?[new oe(a,1-l),new oe(c,1-u),new oe(f,1-_),new oe(v,1-d)]:[new oe(o,1-l),new oe(h,1-u),new oe(m,1-_),new oe(p,1-d)]}};function Jd(n,e,t){if(t.shapes=[],Array.isArray(n))for(let i=0,s=n.length;i<s;i++){const r=n[i];t.shapes.push(r.uuid)}else t.shapes.push(n.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}class ki extends Do{constructor(e=1,t=0){const i=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],s=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(i,s,e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new ki(e.radius,e.detail)}}class Ls extends Nt{constructor(e=1,t=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:s};const r=e/2,a=t/2,o=Math.floor(i),l=Math.floor(s),c=o+1,h=l+1,u=e/o,f=t/l,m=[],_=[],v=[],p=[];for(let d=0;d<h;d++){const x=d*f-a;for(let y=0;y<c;y++){const g=y*u-r;_.push(g,-x,0),v.push(0,0,1),p.push(y/o),p.push(1-d/l)}}for(let d=0;d<l;d++)for(let x=0;x<o;x++){const y=x+c*d,g=x+c*(d+1),w=x+1+c*(d+1),T=x+1+c*d;m.push(y,g,T),m.push(g,w,T)}this.setIndex(m),this.setAttribute("position",new it(_,3)),this.setAttribute("normal",new it(v,3)),this.setAttribute("uv",new it(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ls(e.width,e.height,e.widthSegments,e.heightSegments)}}class Ds extends Nt{constructor(e=1,t=32,i=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:i,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),i=Math.max(2,Math.floor(i));const l=Math.min(a+o,Math.PI);let c=0;const h=[],u=new L,f=new L,m=[],_=[],v=[],p=[];for(let d=0;d<=i;d++){const x=[],y=d/i;let g=0;d===0&&a===0?g=.5/t:d===i&&l===Math.PI&&(g=-.5/t);for(let w=0;w<=t;w++){const T=w/t;u.x=-e*Math.cos(s+T*r)*Math.sin(a+y*o),u.y=e*Math.cos(a+y*o),u.z=e*Math.sin(s+T*r)*Math.sin(a+y*o),_.push(u.x,u.y,u.z),f.copy(u).normalize(),v.push(f.x,f.y,f.z),p.push(T+g,1-y),x.push(c++)}h.push(x)}for(let d=0;d<i;d++)for(let x=0;x<t;x++){const y=h[d][x+1],g=h[d][x],w=h[d+1][x],T=h[d+1][x+1];(d!==0||a>0)&&m.push(y,g,T),(d!==i-1||l<Math.PI)&&m.push(g,w,T)}this.setIndex(m),this.setAttribute("position",new it(_,3)),this.setAttribute("normal",new it(v,3)),this.setAttribute("uv",new it(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ds(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class pi extends Nt{constructor(e=1,t=.4,i=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:i,tubularSegments:s,arc:r},i=Math.floor(i),s=Math.floor(s);const a=[],o=[],l=[],c=[],h=new L,u=new L,f=new L;for(let m=0;m<=i;m++)for(let _=0;_<=s;_++){const v=_/s*r,p=m/i*Math.PI*2;u.x=(e+t*Math.cos(p))*Math.cos(v),u.y=(e+t*Math.cos(p))*Math.sin(v),u.z=t*Math.sin(p),o.push(u.x,u.y,u.z),h.x=e*Math.cos(v),h.y=e*Math.sin(v),f.subVectors(u,h).normalize(),l.push(f.x,f.y,f.z),c.push(_/s),c.push(m/i)}for(let m=1;m<=i;m++)for(let _=1;_<=s;_++){const v=(s+1)*m+_-1,p=(s+1)*(m-1)+_-1,d=(s+1)*(m-1)+_,x=(s+1)*m+_;a.push(v,p,x),a.push(p,d,x)}this.setIndex(a),this.setAttribute("position",new it(o,3)),this.setAttribute("normal",new it(l,3)),this.setAttribute("uv",new it(c,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new pi(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc)}}class Kd extends Qi{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new je(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new je(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Pc,this.normalScale=new oe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new gn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Qd extends Qi{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Lu,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class ef extends Qi{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class Zc extends Rt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new je(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class tf extends Zc{constructor(e,t,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Rt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new je(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const fa=new ct,El=new L,wl=new L;class nf{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new oe(512,512),this.mapType=wn,this.map=null,this.mapPass=null,this.matrix=new ct,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Lo,this._frameExtents=new oe(1,1),this._viewportCount=1,this._viewports=[new wt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,i=this.matrix;El.setFromMatrixPosition(e.matrixWorld),t.position.copy(El),wl.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(wl),t.updateMatrixWorld(),fa.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(fa,t.coordinateSystem,t.reversedDepth),t.reversedDepth?i.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(fa)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class Jc extends zc{constructor(e=-1,t=1,i=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=i-e,a=i+e,o=s+t,l=s-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class sf extends nf{constructor(){super(new Jc(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class rf extends Zc{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Rt.DEFAULT_UP),this.updateMatrix(),this.target=new Rt,this.shadow=new sf}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class af extends ln{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}const Tl=new ct;class Kc{constructor(e,t,i=0,s=1/0){this.ray=new Dr(e,t),this.near=i,this.far=s,this.camera=null,this.layers=new Po,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Tl.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Tl),this}intersectObject(e,t=!0,i=[]){return xo(e,this,i,t),i.sort(Al),i}intersectObjects(e,t=!0,i=[]){for(let s=0,r=e.length;s<r;s++)xo(e[s],this,i,t);return i.sort(Al),i}}function Al(n,e){return n.distance-e.distance}function xo(n,e,t,i){let s=!0;if(n.layers.test(e.layers)&&n.raycast(e,t)===!1&&(s=!1),s===!0&&i===!0){const r=n.children;for(let a=0,o=r.length;a<o;a++)xo(r[a],e,t,!0)}}class Rl{constructor(e=1,t=0,i=0){this.radius=e,this.phi=t,this.theta=i}set(e,t,i){return this.radius=e,this.phi=t,this.theta=i,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Xe(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,i){return this.radius=Math.sqrt(e*e+t*t+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,i),this.phi=Math.acos(Xe(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class of extends Rr{constructor(e=10,t=10,i=4473924,s=8947848){i=new je(i),s=new je(s);const r=t/2,a=e/t,o=e/2,l=[],c=[];for(let f=0,m=0,_=-o;f<=t;f++,_+=a){l.push(-o,0,_,o,0,_),l.push(_,0,-o,_,0,o);const v=f===r?i:s;v.toArray(c,m),m+=3,v.toArray(c,m),m+=3,v.toArray(c,m),m+=3,v.toArray(c,m),m+=3}const h=new Nt;h.setAttribute("position",new it(l,3)),h.setAttribute("color",new it(c,3));const u=new Zi({vertexColors:!0,toneMapped:!1});super(h,u),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}class lf extends Rr{constructor(e=1){const t=[0,0,0,e,0,0,0,0,0,0,e,0,0,0,0,0,0,e],i=[1,0,0,1,.6,0,0,1,0,.6,1,0,0,0,1,0,.6,1],s=new Nt;s.setAttribute("position",new it(t,3)),s.setAttribute("color",new it(i,3));const r=new Zi({vertexColors:!0,toneMapped:!1});super(s,r),this.type="AxesHelper"}setColors(e,t,i){const s=new je,r=this.geometry.attributes.color.array;return s.set(e),s.toArray(r,0),s.toArray(r,3),s.set(t),s.toArray(r,6),s.toArray(r,9),s.set(i),s.toArray(r,12),s.toArray(r,15),this.geometry.attributes.color.needsUpdate=!0,this}dispose(){this.geometry.dispose(),this.material.dispose()}}class Qc extends bi{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){if(e===void 0){console.warn("THREE.Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}}function Cl(n,e,t,i){const s=cf(i);switch(t){case Tc:return n*e;case Rc:return n*e/s.components*s.byteLength;case To:return n*e/s.components*s.byteLength;case Cc:return n*e*2/s.components*s.byteLength;case Ao:return n*e*2/s.components*s.byteLength;case Ac:return n*e*3/s.components*s.byteLength;case pn:return n*e*4/s.components*s.byteLength;case Ro:return n*e*4/s.components*s.byteLength;case gr:case _r:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case vr:case xr:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Ba:case Ha:return Math.max(n,16)*Math.max(e,8)/4;case za:case ka:return Math.max(n,8)*Math.max(e,8)/2;case Va:case Ga:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Wa:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case $a:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case Xa:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case ja:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case qa:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case Ya:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case Za:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case Ja:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case Ka:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case Qa:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case eo:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case to:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case no:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case io:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case so:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case ro:case ao:case oo:return Math.ceil(n/4)*Math.ceil(e/4)*16;case lo:case co:return Math.ceil(n/4)*Math.ceil(e/4)*8;case ho:case uo:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function cf(n){switch(n){case wn:case Mc:return{byteLength:1,components:1};case bs:case Sc:case Cs:return{byteLength:2,components:1};case Eo:case wo:return{byteLength:2,components:4};case vi:case So:case On:return{byteLength:4,components:1};case Ec:case wc:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Mo}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Mo);/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function eh(){let n=null,e=!1,t=null,i=null;function s(r,a){t(r,a),i=n.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(i=n.requestAnimationFrame(s),e=!0)},stop:function(){n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){n=r}}}function hf(n){const e=new WeakMap;function t(o,l){const c=o.array,h=o.usage,u=c.byteLength,f=n.createBuffer();n.bindBuffer(l,f),n.bufferData(l,c,h),o.onUploadCallback();let m;if(c instanceof Float32Array)m=n.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)m=n.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?m=n.HALF_FLOAT:m=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)m=n.SHORT;else if(c instanceof Uint32Array)m=n.UNSIGNED_INT;else if(c instanceof Int32Array)m=n.INT;else if(c instanceof Int8Array)m=n.BYTE;else if(c instanceof Uint8Array)m=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)m=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:f,type:m,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:u}}function i(o,l,c){const h=l.array,u=l.updateRanges;if(n.bindBuffer(c,o),u.length===0)n.bufferSubData(c,0,h);else{u.sort((m,_)=>m.start-_.start);let f=0;for(let m=1;m<u.length;m++){const _=u[f],v=u[m];v.start<=_.start+_.count+1?_.count=Math.max(_.count,v.start+v.count-_.start):(++f,u[f]=v)}u.length=f+1;for(let m=0,_=u.length;m<_;m++){const v=u[m];n.bufferSubData(c,v.start*h.BYTES_PER_ELEMENT,h,v.start,v.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(n.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:s,remove:r,update:a}}var uf=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,df=`#ifdef USE_ALPHAHASH
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
#endif`,Rf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Cf=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Hf="gl_FragColor = linearToOutputTexel( gl_FragColor );",Vf=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Gf=`#ifdef USE_ENVMAP
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
#endif`,Wf=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,$f=`#ifdef USE_ENVMAP
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
#endif`,Xf=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,jf=`#ifdef USE_ENVMAP
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
}`,hp=`
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
#endif`,dp=`#if defined( RE_IndirectDiffuse )
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
#endif`,Rp=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Cp=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
gl_Position = projectionMatrix * mvPosition;`,Vp=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Gp=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Wp=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,$p=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Xp=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,jp=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`;const hm=`varying vec2 vUv;
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
}`,dm=`varying vec3 vWorldDirection;
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
}`,Rm=`#define MATCAP
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
}`,Cm=`#define MATCAP
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
}`,Vm=`uniform float rotation;
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
}`,Gm=`uniform vec3 diffuse;
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
}`,$e={alphahash_fragment:uf,alphahash_pars_fragment:df,alphamap_fragment:ff,alphamap_pars_fragment:pf,alphatest_fragment:mf,alphatest_pars_fragment:gf,aomap_fragment:_f,aomap_pars_fragment:vf,batching_pars_vertex:xf,batching_vertex:yf,begin_vertex:bf,beginnormal_vertex:Mf,bsdfs:Sf,iridescence_fragment:Ef,bumpmap_pars_fragment:wf,clipping_planes_fragment:Tf,clipping_planes_pars_fragment:Af,clipping_planes_pars_vertex:Rf,clipping_planes_vertex:Cf,color_fragment:Pf,color_pars_fragment:Lf,color_pars_vertex:Df,color_vertex:If,common:Uf,cube_uv_reflection_fragment:Nf,defaultnormal_vertex:Ff,displacementmap_pars_vertex:Of,displacementmap_vertex:zf,emissivemap_fragment:Bf,emissivemap_pars_fragment:kf,colorspace_fragment:Hf,colorspace_pars_fragment:Vf,envmap_fragment:Gf,envmap_common_pars_fragment:Wf,envmap_pars_fragment:$f,envmap_pars_vertex:Xf,envmap_physical_pars_fragment:ip,envmap_vertex:jf,fog_vertex:qf,fog_pars_vertex:Yf,fog_fragment:Zf,fog_pars_fragment:Jf,gradientmap_pars_fragment:Kf,lightmap_pars_fragment:Qf,lights_lambert_fragment:ep,lights_lambert_pars_fragment:tp,lights_pars_begin:np,lights_toon_fragment:sp,lights_toon_pars_fragment:rp,lights_phong_fragment:ap,lights_phong_pars_fragment:op,lights_physical_fragment:lp,lights_physical_pars_fragment:cp,lights_fragment_begin:hp,lights_fragment_maps:up,lights_fragment_end:dp,logdepthbuf_fragment:fp,logdepthbuf_pars_fragment:pp,logdepthbuf_pars_vertex:mp,logdepthbuf_vertex:gp,map_fragment:_p,map_pars_fragment:vp,map_particle_fragment:xp,map_particle_pars_fragment:yp,metalnessmap_fragment:bp,metalnessmap_pars_fragment:Mp,morphinstance_vertex:Sp,morphcolor_vertex:Ep,morphnormal_vertex:wp,morphtarget_pars_vertex:Tp,morphtarget_vertex:Ap,normal_fragment_begin:Rp,normal_fragment_maps:Cp,normal_pars_fragment:Pp,normal_pars_vertex:Lp,normal_vertex:Dp,normalmap_pars_fragment:Ip,clearcoat_normal_fragment_begin:Up,clearcoat_normal_fragment_maps:Np,clearcoat_pars_fragment:Fp,iridescence_pars_fragment:Op,opaque_fragment:zp,packing:Bp,premultiplied_alpha_fragment:kp,project_vertex:Hp,dithering_fragment:Vp,dithering_pars_fragment:Gp,roughnessmap_fragment:Wp,roughnessmap_pars_fragment:$p,shadowmap_pars_fragment:Xp,shadowmap_pars_vertex:jp,shadowmap_vertex:qp,shadowmask_pars_fragment:Yp,skinbase_vertex:Zp,skinning_pars_vertex:Jp,skinning_vertex:Kp,skinnormal_vertex:Qp,specularmap_fragment:em,specularmap_pars_fragment:tm,tonemapping_fragment:nm,tonemapping_pars_fragment:im,transmission_fragment:sm,transmission_pars_fragment:rm,uv_pars_fragment:am,uv_pars_vertex:om,uv_vertex:lm,worldpos_vertex:cm,background_vert:hm,background_frag:um,backgroundCube_vert:dm,backgroundCube_frag:fm,cube_vert:pm,cube_frag:mm,depth_vert:gm,depth_frag:_m,distanceRGBA_vert:vm,distanceRGBA_frag:xm,equirect_vert:ym,equirect_frag:bm,linedashed_vert:Mm,linedashed_frag:Sm,meshbasic_vert:Em,meshbasic_frag:wm,meshlambert_vert:Tm,meshlambert_frag:Am,meshmatcap_vert:Rm,meshmatcap_frag:Cm,meshnormal_vert:Pm,meshnormal_frag:Lm,meshphong_vert:Dm,meshphong_frag:Im,meshphysical_vert:Um,meshphysical_frag:Nm,meshtoon_vert:Fm,meshtoon_frag:Om,points_vert:zm,points_frag:Bm,shadow_vert:km,shadow_frag:Hm,sprite_vert:Vm,sprite_frag:Gm},me={common:{diffuse:{value:new je(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new We},alphaMap:{value:null},alphaMapTransform:{value:new We},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new We}},envmap:{envMap:{value:null},envMapRotation:{value:new We},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new We}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new We}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new We},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new We},normalScale:{value:new oe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new We},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new We}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new We}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new We}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new je(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new je(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new We},alphaTest:{value:0},uvTransform:{value:new We}},sprite:{diffuse:{value:new je(16777215)},opacity:{value:1},center:{value:new oe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new We},alphaMap:{value:null},alphaMapTransform:{value:new We},alphaTest:{value:0}}},yn={basic:{uniforms:Wt([me.common,me.specularmap,me.envmap,me.aomap,me.lightmap,me.fog]),vertexShader:$e.meshbasic_vert,fragmentShader:$e.meshbasic_frag},lambert:{uniforms:Wt([me.common,me.specularmap,me.envmap,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.fog,me.lights,{emissive:{value:new je(0)}}]),vertexShader:$e.meshlambert_vert,fragmentShader:$e.meshlambert_frag},phong:{uniforms:Wt([me.common,me.specularmap,me.envmap,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.fog,me.lights,{emissive:{value:new je(0)},specular:{value:new je(1118481)},shininess:{value:30}}]),vertexShader:$e.meshphong_vert,fragmentShader:$e.meshphong_frag},standard:{uniforms:Wt([me.common,me.envmap,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.roughnessmap,me.metalnessmap,me.fog,me.lights,{emissive:{value:new je(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:$e.meshphysical_vert,fragmentShader:$e.meshphysical_frag},toon:{uniforms:Wt([me.common,me.aomap,me.lightmap,me.emissivemap,me.bumpmap,me.normalmap,me.displacementmap,me.gradientmap,me.fog,me.lights,{emissive:{value:new je(0)}}]),vertexShader:$e.meshtoon_vert,fragmentShader:$e.meshtoon_frag},matcap:{uniforms:Wt([me.common,me.bumpmap,me.normalmap,me.displacementmap,me.fog,{matcap:{value:null}}]),vertexShader:$e.meshmatcap_vert,fragmentShader:$e.meshmatcap_frag},points:{uniforms:Wt([me.points,me.fog]),vertexShader:$e.points_vert,fragmentShader:$e.points_frag},dashed:{uniforms:Wt([me.common,me.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:$e.linedashed_vert,fragmentShader:$e.linedashed_frag},depth:{uniforms:Wt([me.common,me.displacementmap]),vertexShader:$e.depth_vert,fragmentShader:$e.depth_frag},normal:{uniforms:Wt([me.common,me.bumpmap,me.normalmap,me.displacementmap,{opacity:{value:1}}]),vertexShader:$e.meshnormal_vert,fragmentShader:$e.meshnormal_frag},sprite:{uniforms:Wt([me.sprite,me.fog]),vertexShader:$e.sprite_vert,fragmentShader:$e.sprite_frag},background:{uniforms:{uvTransform:{value:new We},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:$e.background_vert,fragmentShader:$e.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new We}},vertexShader:$e.backgroundCube_vert,fragmentShader:$e.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:$e.cube_vert,fragmentShader:$e.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:$e.equirect_vert,fragmentShader:$e.equirect_frag},distanceRGBA:{uniforms:Wt([me.common,me.displacementmap,{referencePosition:{value:new L},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:$e.distanceRGBA_vert,fragmentShader:$e.distanceRGBA_frag},shadow:{uniforms:Wt([me.lights,me.fog,{color:{value:new je(0)},opacity:{value:1}}]),vertexShader:$e.shadow_vert,fragmentShader:$e.shadow_frag}};yn.physical={uniforms:Wt([yn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new We},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new We},clearcoatNormalScale:{value:new oe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new We},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new We},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new We},sheen:{value:0},sheenColor:{value:new je(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new We},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new We},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new We},transmissionSamplerSize:{value:new oe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new We},attenuationDistance:{value:0},attenuationColor:{value:new je(0)},specularColor:{value:new je(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new We},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new We},anisotropyVector:{value:new oe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new We}}]),vertexShader:$e.meshphysical_vert,fragmentShader:$e.meshphysical_frag};const cr={r:0,b:0,g:0},oi=new gn,Wm=new ct;function $m(n,e,t,i,s,r,a){const o=new je(0);let l=r===!0?0:1,c,h,u=null,f=0,m=null;function _(y){let g=y.isScene===!0?y.background:null;return g&&g.isTexture&&(g=(y.backgroundBlurriness>0?t:e).get(g)),g}function v(y){let g=!1;const w=_(y);w===null?d(o,l):w&&w.isColor&&(d(w,1),g=!0);const T=n.xr.getEnvironmentBlendMode();T==="additive"?i.buffers.color.setClear(0,0,0,1,a):T==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(n.autoClear||g)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function p(y,g){const w=_(g);w&&(w.isCubeTexture||w.mapping===Pr)?(h===void 0&&(h=new ye(new Mt(1,1,1),new Kn({name:"BackgroundCubeMaterial",uniforms:Yi(yn.backgroundCube.uniforms),vertexShader:yn.backgroundCube.vertexShader,fragmentShader:yn.backgroundCube.fragmentShader,side:Zt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(T,S,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),oi.copy(g.backgroundRotation),oi.x*=-1,oi.y*=-1,oi.z*=-1,w.isCubeTexture&&w.isRenderTargetTexture===!1&&(oi.y*=-1,oi.z*=-1),h.material.uniforms.envMap.value=w,h.material.uniforms.flipEnvMap.value=w.isCubeTexture&&w.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=g.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=g.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Wm.makeRotationFromEuler(oi)),h.material.toneMapped=tt.getTransfer(w.colorSpace)!==rt,(u!==w||f!==w.version||m!==n.toneMapping)&&(h.material.needsUpdate=!0,u=w,f=w.version,m=n.toneMapping),h.layers.enableAll(),y.unshift(h,h.geometry,h.material,0,0,null)):w&&w.isTexture&&(c===void 0&&(c=new ye(new Ls(2,2),new Kn({name:"BackgroundMaterial",uniforms:Yi(yn.background.uniforms),vertexShader:yn.background.vertexShader,fragmentShader:yn.background.fragmentShader,side:Jn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=w,c.material.uniforms.backgroundIntensity.value=g.backgroundIntensity,c.material.toneMapped=tt.getTransfer(w.colorSpace)!==rt,w.matrixAutoUpdate===!0&&w.updateMatrix(),c.material.uniforms.uvTransform.value.copy(w.matrix),(u!==w||f!==w.version||m!==n.toneMapping)&&(c.material.needsUpdate=!0,u=w,f=w.version,m=n.toneMapping),c.layers.enableAll(),y.unshift(c,c.geometry,c.material,0,0,null))}function d(y,g){y.getRGB(cr,Oc(n)),i.buffers.color.setClear(cr.r,cr.g,cr.b,g,a)}function x(){h!==void 0&&(h.geometry.dispose(),h.material.dispose(),h=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(y,g=1){o.set(y),l=g,d(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(y){l=y,d(o,l)},render:v,addToRenderList:p,dispose:x}}function Xm(n,e){const t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=f(null);let r=s,a=!1;function o(b,C,I,B,H){let k=!1;const W=u(B,I,C);r!==W&&(r=W,c(r.object)),k=m(b,B,I,H),k&&_(b,B,I,H),H!==null&&e.update(H,n.ELEMENT_ARRAY_BUFFER),(k||a)&&(a=!1,g(b,C,I,B),H!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(H).buffer))}function l(){return n.createVertexArray()}function c(b){return n.bindVertexArray(b)}function h(b){return n.deleteVertexArray(b)}function u(b,C,I){const B=I.wireframe===!0;let H=i[b.id];H===void 0&&(H={},i[b.id]=H);let k=H[C.id];k===void 0&&(k={},H[C.id]=k);let W=k[B];return W===void 0&&(W=f(l()),k[B]=W),W}function f(b){const C=[],I=[],B=[];for(let H=0;H<t;H++)C[H]=0,I[H]=0,B[H]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:C,enabledAttributes:I,attributeDivisors:B,object:b,attributes:{},index:null}}function m(b,C,I,B){const H=r.attributes,k=C.attributes;let W=0;const q=I.getAttributes();for(const $ in q)if(q[$].location>=0){const pe=H[$];let be=k[$];if(be===void 0&&($==="instanceMatrix"&&b.instanceMatrix&&(be=b.instanceMatrix),$==="instanceColor"&&b.instanceColor&&(be=b.instanceColor)),pe===void 0||pe.attribute!==be||be&&pe.data!==be.data)return!0;W++}return r.attributesNum!==W||r.index!==B}function _(b,C,I,B){const H={},k=C.attributes;let W=0;const q=I.getAttributes();for(const $ in q)if(q[$].location>=0){let pe=k[$];pe===void 0&&($==="instanceMatrix"&&b.instanceMatrix&&(pe=b.instanceMatrix),$==="instanceColor"&&b.instanceColor&&(pe=b.instanceColor));const be={};be.attribute=pe,pe&&pe.data&&(be.data=pe.data),H[$]=be,W++}r.attributes=H,r.attributesNum=W,r.index=B}function v(){const b=r.newAttributes;for(let C=0,I=b.length;C<I;C++)b[C]=0}function p(b){d(b,0)}function d(b,C){const I=r.newAttributes,B=r.enabledAttributes,H=r.attributeDivisors;I[b]=1,B[b]===0&&(n.enableVertexAttribArray(b),B[b]=1),H[b]!==C&&(n.vertexAttribDivisor(b,C),H[b]=C)}function x(){const b=r.newAttributes,C=r.enabledAttributes;for(let I=0,B=C.length;I<B;I++)C[I]!==b[I]&&(n.disableVertexAttribArray(I),C[I]=0)}function y(b,C,I,B,H,k,W){W===!0?n.vertexAttribIPointer(b,C,I,H,k):n.vertexAttribPointer(b,C,I,B,H,k)}function g(b,C,I,B){v();const H=B.attributes,k=I.getAttributes(),W=C.defaultAttributeValues;for(const q in k){const $=k[q];if($.location>=0){let ie=H[q];if(ie===void 0&&(q==="instanceMatrix"&&b.instanceMatrix&&(ie=b.instanceMatrix),q==="instanceColor"&&b.instanceColor&&(ie=b.instanceColor)),ie!==void 0){const pe=ie.normalized,be=ie.itemSize,Oe=e.get(ie);if(Oe===void 0)continue;const qe=Oe.buffer,Qe=Oe.type,Ke=Oe.bytesPerElement,Y=Qe===n.INT||Qe===n.UNSIGNED_INT||ie.gpuType===So;if(ie.isInterleavedBufferAttribute){const ne=ie.data,Se=ne.stride,De=ie.offset;if(ne.isInstancedInterleavedBuffer){for(let Te=0;Te<$.locationSize;Te++)d($.location+Te,ne.meshPerAttribute);b.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=ne.meshPerAttribute*ne.count)}else for(let Te=0;Te<$.locationSize;Te++)p($.location+Te);n.bindBuffer(n.ARRAY_BUFFER,qe);for(let Te=0;Te<$.locationSize;Te++)y($.location+Te,be/$.locationSize,Qe,pe,Se*Ke,(De+be/$.locationSize*Te)*Ke,Y)}else{if(ie.isInstancedBufferAttribute){for(let ne=0;ne<$.locationSize;ne++)d($.location+ne,ie.meshPerAttribute);b.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=ie.meshPerAttribute*ie.count)}else for(let ne=0;ne<$.locationSize;ne++)p($.location+ne);n.bindBuffer(n.ARRAY_BUFFER,qe);for(let ne=0;ne<$.locationSize;ne++)y($.location+ne,be/$.locationSize,Qe,pe,be*Ke,be/$.locationSize*ne*Ke,Y)}}else if(W!==void 0){const pe=W[q];if(pe!==void 0)switch(pe.length){case 2:n.vertexAttrib2fv($.location,pe);break;case 3:n.vertexAttrib3fv($.location,pe);break;case 4:n.vertexAttrib4fv($.location,pe);break;default:n.vertexAttrib1fv($.location,pe)}}}}x()}function w(){R();for(const b in i){const C=i[b];for(const I in C){const B=C[I];for(const H in B)h(B[H].object),delete B[H];delete C[I]}delete i[b]}}function T(b){if(i[b.id]===void 0)return;const C=i[b.id];for(const I in C){const B=C[I];for(const H in B)h(B[H].object),delete B[H];delete C[I]}delete i[b.id]}function S(b){for(const C in i){const I=i[C];if(I[b.id]===void 0)continue;const B=I[b.id];for(const H in B)h(B[H].object),delete B[H];delete I[b.id]}}function R(){M(),a=!0,r!==s&&(r=s,c(r.object))}function M(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:R,resetDefaultState:M,dispose:w,releaseStatesOfGeometry:T,releaseStatesOfProgram:S,initAttributes:v,enableAttribute:p,disableUnusedAttributes:x}}function jm(n,e,t){let i;function s(c){i=c}function r(c,h){n.drawArrays(i,c,h),t.update(h,i,1)}function a(c,h,u){u!==0&&(n.drawArraysInstanced(i,c,h,u),t.update(h,i,u))}function o(c,h,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,h,0,u);let m=0;for(let _=0;_<u;_++)m+=h[_];t.update(m,i,1)}function l(c,h,u,f){if(u===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let _=0;_<c.length;_++)a(c[_],h[_],f[_]);else{m.multiDrawArraysInstancedWEBGL(i,c,0,h,0,f,0,u);let _=0;for(let v=0;v<u;v++)_+=h[v]*f[v];t.update(_,i,1)}}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function qm(n,e,t,i){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const S=e.get("EXT_texture_filter_anisotropic");s=n.getParameter(S.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(S){return!(S!==pn&&i.convert(S)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(S){const R=S===Cs&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(S!==wn&&i.convert(S)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&S!==On&&!R)}function l(S){if(S==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";S="mediump"}return S==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const h=l(c);h!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const u=t.logarithmicDepthBuffer===!0,f=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),m=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),_=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=n.getParameter(n.MAX_TEXTURE_SIZE),p=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),d=n.getParameter(n.MAX_VERTEX_ATTRIBS),x=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),y=n.getParameter(n.MAX_VARYING_VECTORS),g=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),w=_>0,T=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:u,reversedDepthBuffer:f,maxTextures:m,maxVertexTextures:_,maxTextureSize:v,maxCubemapSize:p,maxAttributes:d,maxVertexUniforms:x,maxVaryings:y,maxFragmentUniforms:g,vertexTextures:w,maxSamples:T}}function Ym(n){const e=this;let t=null,i=0,s=!1,r=!1;const a=new jn,o=new We,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,f){const m=u.length!==0||f||i!==0||s;return s=f,i=u.length,m},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,f){t=h(u,f,0)},this.setState=function(u,f,m){const _=u.clippingPlanes,v=u.clipIntersection,p=u.clipShadows,d=n.get(u);if(!s||_===null||_.length===0||r&&!p)r?h(null):c();else{const x=r?0:i,y=x*4;let g=d.clippingState||null;l.value=g,g=h(_,f,y,m);for(let w=0;w!==y;++w)g[w]=t[w];d.clippingState=g,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=x}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function h(u,f,m,_){const v=u!==null?u.length:0;let p=null;if(v!==0){if(p=l.value,_!==!0||p===null){const d=m+v*4,x=f.matrixWorldInverse;o.getNormalMatrix(x),(p===null||p.length<d)&&(p=new Float32Array(d));for(let y=0,g=m;y!==v;++y,g+=4)a.copy(u[y]).applyMatrix4(x,o),a.normal.toArray(p,g),p[g+3]=a.constant}l.value=p,l.needsUpdate=!0}return e.numPlanes=v,e.numIntersection=0,p}}function Zm(n){let e=new WeakMap;function t(a,o){return o===Ua?a.mapping=Xi:o===Na&&(a.mapping=ji),a}function i(a){if(a&&a.isTexture){const o=a.mapping;if(o===Ua||o===Na)if(e.has(a)){const l=e.get(a).texture;return t(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new fd(l.height);return c.fromEquirectangularTexture(n,a),e.set(a,c),a.addEventListener("dispose",s),t(c.texture,a.mapping)}else return null}}return a}function s(a){const o=a.target;o.removeEventListener("dispose",s);const l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function r(){e=new WeakMap}return{get:i,dispose:r}}const Hi=4,Pl=[.125,.215,.35,.446,.526,.582],mi=20,pa=new Jc,Ll=new je;let ma=null,ga=0,_a=0,va=!1;const ui=(1+Math.sqrt(5))/2,Fi=1/ui,Dl=[new L(-ui,Fi,0),new L(ui,Fi,0),new L(-Fi,0,ui),new L(Fi,0,ui),new L(0,ui,-Fi),new L(0,ui,Fi),new L(-1,1,-1),new L(1,1,-1),new L(-1,1,1),new L(1,1,1)],Jm=new L;class Il{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,i=.1,s=100,r={}){const{size:a=256,position:o=Jm}=r;ma=this._renderer.getRenderTarget(),ga=this._renderer.getActiveCubeFace(),_a=this._renderer.getActiveMipmapLevel(),va=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,i,s,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Fl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Nl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(ma,ga,_a),this._renderer.xr.enabled=va,e.scissorTest=!1,hr(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Xi||e.mapping===ji?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),ma=this._renderer.getRenderTarget(),ga=this._renderer.getActiveCubeFace(),_a=this._renderer.getActiveMipmapLevel(),va=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:Mn,minFilter:Mn,generateMipmaps:!1,type:Cs,format:pn,colorSpace:qi,depthBuffer:!1},s=Ul(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Ul(e,t,i);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Km(r)),this._blurMaterial=Qm(r,e,t)}return s}_compileMaterial(e){const t=new ye(this._lodPlanes[0],e);this._renderer.compile(t,pa)}_sceneToCubeUV(e,t,i,s,r){const l=new ln(90,1,t,i),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,f=u.autoClear,m=u.toneMapping;u.getClearColor(Ll),u.toneMapping=Zn,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(s),u.clearDepth(),u.setRenderTarget(null));const v=new Ir({name:"PMREM.Background",side:Zt,depthWrite:!1,depthTest:!1}),p=new ye(new Mt,v);let d=!1;const x=e.background;x?x.isColor&&(v.color.copy(x),e.background=null,d=!0):(v.color.copy(Ll),d=!0);for(let y=0;y<6;y++){const g=y%3;g===0?(l.up.set(0,c[y],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[y],r.y,r.z)):g===1?(l.up.set(0,0,c[y]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[y],r.z)):(l.up.set(0,c[y],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[y]));const w=this._cubeSize;hr(s,g*w,y>2?w:0,w,w),u.setRenderTarget(s),d&&u.render(p,l),u.render(e,l)}p.geometry.dispose(),p.material.dispose(),u.toneMapping=m,u.autoClear=f,e.background=x}_textureToCubeUV(e,t){const i=this._renderer,s=e.mapping===Xi||e.mapping===ji;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Fl()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Nl());const r=s?this._cubemapMaterial:this._equirectMaterial,a=new ye(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=e;const l=this._cubeSize;hr(t,0,0,3*l,2*l),i.setRenderTarget(t),i.render(a,pa)}_applyPMREM(e){const t=this._renderer,i=t.autoClear;t.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const a=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=Dl[(s-r-1)%Dl.length];this._blur(e,r-1,r,a,o)}t.autoClear=i}_blur(e,t,i,s,r){const a=this._pingPongRenderTarget;this._halfBlur(e,a,t,i,s,"latitudinal",r),this._halfBlur(a,e,i,i,s,"longitudinal",r)}_halfBlur(e,t,i,s,r,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new ye(this._lodPlanes[s],c),f=c.uniforms,m=this._sizeLods[i]-1,_=isFinite(r)?Math.PI/(2*m):2*Math.PI/(2*mi-1),v=r/_,p=isFinite(r)?1+Math.floor(h*v):mi;p>mi&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${mi}`);const d=[];let x=0;for(let S=0;S<mi;++S){const R=S/v,M=Math.exp(-R*R/2);d.push(M),S===0?x+=M:S<p&&(x+=2*M)}for(let S=0;S<d.length;S++)d[S]=d[S]/x;f.envMap.value=e.texture,f.samples.value=p,f.weights.value=d,f.latitudinal.value=a==="latitudinal",o&&(f.poleAxis.value=o);const{_lodMax:y}=this;f.dTheta.value=_,f.mipInt.value=y-i;const g=this._sizeLods[s],w=3*g*(s>y-Hi?s-y+Hi:0),T=4*(this._cubeSize-g);hr(t,w,T,3*g,2*g),l.setRenderTarget(t),l.render(u,pa)}}function Km(n){const e=[],t=[],i=[];let s=n;const r=n-Hi+1+Pl.length;for(let a=0;a<r;a++){const o=Math.pow(2,s);t.push(o);let l=1/o;a>n-Hi?l=Pl[a-n+Hi-1]:a===0&&(l=0),i.push(l);const c=1/(o-2),h=-c,u=1+c,f=[h,h,u,h,u,u,h,h,u,u,h,u],m=6,_=6,v=3,p=2,d=1,x=new Float32Array(v*_*m),y=new Float32Array(p*_*m),g=new Float32Array(d*_*m);for(let T=0;T<m;T++){const S=T%3*2/3-1,R=T>2?0:-1,M=[S,R,0,S+2/3,R,0,S+2/3,R+1,0,S,R,0,S+2/3,R+1,0,S,R+1,0];x.set(M,v*_*T),y.set(f,p*_*T);const b=[T,T,T,T,T,T];g.set(b,d*_*T)}const w=new Nt;w.setAttribute("position",new En(x,v)),w.setAttribute("uv",new En(y,p)),w.setAttribute("faceIndex",new En(g,d)),e.push(w),s>Hi&&s--}return{lodPlanes:e,sizeLods:t,sigmas:i}}function Ul(n,e,t){const i=new xi(n,e,t);return i.texture.mapping=Pr,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function hr(n,e,t,i,s){n.viewport.set(e,t,i,s),n.scissor.set(e,t,i,s)}function Qm(n,e,t){const i=new Float32Array(mi),s=new L(0,1,0);return new Kn({name:"SphericalGaussianBlur",defines:{n:mi,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Fo(),fragmentShader:`

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
		`,blending:Yn,depthTest:!1,depthWrite:!1})}function Nl(){return new Kn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Fo(),fragmentShader:`

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
		`,blending:Yn,depthTest:!1,depthWrite:!1})}function Fl(){return new Kn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Fo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Yn,depthTest:!1,depthWrite:!1})}function Fo(){return`

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
	`}function eg(n){let e=new WeakMap,t=null;function i(o){if(o&&o.isTexture){const l=o.mapping,c=l===Ua||l===Na,h=l===Xi||l===ji;if(c||h){let u=e.get(o);const f=u!==void 0?u.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==f)return t===null&&(t=new Il(n)),u=c?t.fromEquirectangular(o,u):t.fromCubemap(o,u),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),u.texture;if(u!==void 0)return u.texture;{const m=o.image;return c&&m&&m.height>0||h&&m&&s(m)?(t===null&&(t=new Il(n)),u=c?t.fromEquirectangular(o):t.fromCubemap(o),u.texture.pmremVersion=o.pmremVersion,e.set(o,u),o.addEventListener("dispose",r),u.texture):null}}}return o}function s(o){let l=0;const c=6;for(let h=0;h<c;h++)o[h]!==void 0&&l++;return l===c}function r(o){const l=o.target;l.removeEventListener("dispose",r);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function a(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:i,dispose:a}}function tg(n){const e={};function t(i){if(e[i]!==void 0)return e[i];let s;switch(i){case"WEBGL_depth_texture":s=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=n.getExtension(i)}return e[i]=s,s}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){const s=t(i);return s===null&&ws("THREE.WebGLRenderer: "+i+" extension not supported."),s}}}function ng(n,e,t,i){const s={},r=new WeakMap;function a(u){const f=u.target;f.index!==null&&e.remove(f.index);for(const _ in f.attributes)e.remove(f.attributes[_]);f.removeEventListener("dispose",a),delete s[f.id];const m=r.get(f);m&&(e.remove(m),r.delete(f)),i.releaseStatesOfGeometry(f),f.isInstancedBufferGeometry===!0&&delete f._maxInstanceCount,t.memory.geometries--}function o(u,f){return s[f.id]===!0||(f.addEventListener("dispose",a),s[f.id]=!0,t.memory.geometries++),f}function l(u){const f=u.attributes;for(const m in f)e.update(f[m],n.ARRAY_BUFFER)}function c(u){const f=[],m=u.index,_=u.attributes.position;let v=0;if(m!==null){const x=m.array;v=m.version;for(let y=0,g=x.length;y<g;y+=3){const w=x[y+0],T=x[y+1],S=x[y+2];f.push(w,T,T,S,S,w)}}else if(_!==void 0){const x=_.array;v=_.version;for(let y=0,g=x.length/3-1;y<g;y+=3){const w=y+0,T=y+1,S=y+2;f.push(w,T,T,S,S,w)}}else return;const p=new(Dc(f)?Fc:Nc)(f,1);p.version=v;const d=r.get(u);d&&e.remove(d),r.set(u,p)}function h(u){const f=r.get(u);if(f){const m=u.index;m!==null&&f.version<m.version&&c(u)}else c(u);return r.get(u)}return{get:o,update:l,getWireframeAttribute:h}}function ig(n,e,t){let i;function s(f){i=f}let r,a;function o(f){r=f.type,a=f.bytesPerElement}function l(f,m){n.drawElements(i,m,r,f*a),t.update(m,i,1)}function c(f,m,_){_!==0&&(n.drawElementsInstanced(i,m,r,f*a,_),t.update(m,i,_))}function h(f,m,_){if(_===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,m,0,r,f,0,_);let p=0;for(let d=0;d<_;d++)p+=m[d];t.update(p,i,1)}function u(f,m,_,v){if(_===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let d=0;d<f.length;d++)c(f[d]/a,m[d],v[d]);else{p.multiDrawElementsInstancedWEBGL(i,m,0,r,f,0,v,0,_);let d=0;for(let x=0;x<_;x++)d+=m[x]*v[x];t.update(d,i,1)}}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function sg(n){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,a,o){switch(t.calls++,a){case n.TRIANGLES:t.triangles+=o*(r/3);break;case n.LINES:t.lines+=o*(r/2);break;case n.LINE_STRIP:t.lines+=o*(r-1);break;case n.LINE_LOOP:t.lines+=o*r;break;case n.POINTS:t.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:i}}function rg(n,e,t){const i=new WeakMap,s=new wt;function r(a,o,l){const c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=h!==void 0?h.length:0;let f=i.get(o);if(f===void 0||f.count!==u){let b=function(){R.dispose(),i.delete(o),o.removeEventListener("dispose",b)};var m=b;f!==void 0&&f.texture.dispose();const _=o.morphAttributes.position!==void 0,v=o.morphAttributes.normal!==void 0,p=o.morphAttributes.color!==void 0,d=o.morphAttributes.position||[],x=o.morphAttributes.normal||[],y=o.morphAttributes.color||[];let g=0;_===!0&&(g=1),v===!0&&(g=2),p===!0&&(g=3);let w=o.attributes.position.count*g,T=1;w>e.maxTextureSize&&(T=Math.ceil(w/e.maxTextureSize),w=e.maxTextureSize);const S=new Float32Array(w*T*4*u),R=new Ic(S,w,T,u);R.type=On,R.needsUpdate=!0;const M=g*4;for(let C=0;C<u;C++){const I=d[C],B=x[C],H=y[C],k=w*T*4*C;for(let W=0;W<I.count;W++){const q=W*M;_===!0&&(s.fromBufferAttribute(I,W),S[k+q+0]=s.x,S[k+q+1]=s.y,S[k+q+2]=s.z,S[k+q+3]=0),v===!0&&(s.fromBufferAttribute(B,W),S[k+q+4]=s.x,S[k+q+5]=s.y,S[k+q+6]=s.z,S[k+q+7]=0),p===!0&&(s.fromBufferAttribute(H,W),S[k+q+8]=s.x,S[k+q+9]=s.y,S[k+q+10]=s.z,S[k+q+11]=H.itemSize===4?s.w:1)}}f={count:u,texture:R,size:new oe(w,T)},i.set(o,f),o.addEventListener("dispose",b)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",a.morphTexture,t);else{let _=0;for(let p=0;p<c.length;p++)_+=c[p];const v=o.morphTargetsRelative?1:1-_;l.getUniforms().setValue(n,"morphTargetBaseInfluence",v),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",f.texture,t),l.getUniforms().setValue(n,"morphTargetsTextureSize",f.size)}return{update:r}}function ag(n,e,t,i){let s=new WeakMap;function r(l){const c=i.render.frame,h=l.geometry,u=e.get(l,h);if(s.get(u)!==c&&(e.update(u),s.set(u,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),s.get(l)!==c&&(t.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,n.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){const f=l.skeleton;s.get(f)!==c&&(f.update(),s.set(f,c))}return u}function a(){s=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:a}}const th=new Jt,Ol=new kc(1,1),nh=new Ic,ih=new Zu,sh=new Bc,zl=[],Bl=[],kl=new Float32Array(16),Hl=new Float32Array(9),Vl=new Float32Array(4);function es(n,e,t){const i=n[0];if(i<=0||i>0)return n;const s=e*t;let r=zl[s];if(r===void 0&&(r=new Float32Array(s),zl[s]=r),e!==0){i.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,n[a].toArray(r,o)}return r}function Dt(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function It(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function Ur(n,e){let t=Bl[e];t===void 0&&(t=new Int32Array(e),Bl[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function og(n,e){const t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function lg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Dt(t,e))return;n.uniform2fv(this.addr,e),It(t,e)}}function cg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Dt(t,e))return;n.uniform3fv(this.addr,e),It(t,e)}}function hg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Dt(t,e))return;n.uniform4fv(this.addr,e),It(t,e)}}function ug(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Dt(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),It(t,e)}else{if(Dt(t,i))return;Vl.set(i),n.uniformMatrix2fv(this.addr,!1,Vl),It(t,i)}}function dg(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Dt(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),It(t,e)}else{if(Dt(t,i))return;Hl.set(i),n.uniformMatrix3fv(this.addr,!1,Hl),It(t,i)}}function fg(n,e){const t=this.cache,i=e.elements;if(i===void 0){if(Dt(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),It(t,e)}else{if(Dt(t,i))return;kl.set(i),n.uniformMatrix4fv(this.addr,!1,kl),It(t,i)}}function pg(n,e){const t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function mg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Dt(t,e))return;n.uniform2iv(this.addr,e),It(t,e)}}function gg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Dt(t,e))return;n.uniform3iv(this.addr,e),It(t,e)}}function _g(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Dt(t,e))return;n.uniform4iv(this.addr,e),It(t,e)}}function vg(n,e){const t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function xg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Dt(t,e))return;n.uniform2uiv(this.addr,e),It(t,e)}}function yg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Dt(t,e))return;n.uniform3uiv(this.addr,e),It(t,e)}}function bg(n,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Dt(t,e))return;n.uniform4uiv(this.addr,e),It(t,e)}}function Mg(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_2D_SHADOW?(Ol.compareFunction=Lc,r=Ol):r=th,t.setTexture2D(e||r,s)}function Sg(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture3D(e||ih,s)}function Eg(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTextureCube(e||sh,s)}function wg(n,e,t){const i=this.cache,s=t.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),t.setTexture2DArray(e||nh,s)}function Tg(n){switch(n){case 5126:return og;case 35664:return lg;case 35665:return cg;case 35666:return hg;case 35674:return ug;case 35675:return dg;case 35676:return fg;case 5124:case 35670:return pg;case 35667:case 35671:return mg;case 35668:case 35672:return gg;case 35669:case 35673:return _g;case 5125:return vg;case 36294:return xg;case 36295:return yg;case 36296:return bg;case 35678:case 36198:case 36298:case 36306:case 35682:return Mg;case 35679:case 36299:case 36307:return Sg;case 35680:case 36300:case 36308:case 36293:return Eg;case 36289:case 36303:case 36311:case 36292:return wg}}function Ag(n,e){n.uniform1fv(this.addr,e)}function Rg(n,e){const t=es(e,this.size,2);n.uniform2fv(this.addr,t)}function Cg(n,e){const t=es(e,this.size,3);n.uniform3fv(this.addr,t)}function Pg(n,e){const t=es(e,this.size,4);n.uniform4fv(this.addr,t)}function Lg(n,e){const t=es(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function Dg(n,e){const t=es(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function Ig(n,e){const t=es(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function Ug(n,e){n.uniform1iv(this.addr,e)}function Ng(n,e){n.uniform2iv(this.addr,e)}function Fg(n,e){n.uniform3iv(this.addr,e)}function Og(n,e){n.uniform4iv(this.addr,e)}function zg(n,e){n.uniform1uiv(this.addr,e)}function Bg(n,e){n.uniform2uiv(this.addr,e)}function kg(n,e){n.uniform3uiv(this.addr,e)}function Hg(n,e){n.uniform4uiv(this.addr,e)}function Vg(n,e,t){const i=this.cache,s=e.length,r=Ur(t,s);Dt(i,r)||(n.uniform1iv(this.addr,r),It(i,r));for(let a=0;a!==s;++a)t.setTexture2D(e[a]||th,r[a])}function Gg(n,e,t){const i=this.cache,s=e.length,r=Ur(t,s);Dt(i,r)||(n.uniform1iv(this.addr,r),It(i,r));for(let a=0;a!==s;++a)t.setTexture3D(e[a]||ih,r[a])}function Wg(n,e,t){const i=this.cache,s=e.length,r=Ur(t,s);Dt(i,r)||(n.uniform1iv(this.addr,r),It(i,r));for(let a=0;a!==s;++a)t.setTextureCube(e[a]||sh,r[a])}function $g(n,e,t){const i=this.cache,s=e.length,r=Ur(t,s);Dt(i,r)||(n.uniform1iv(this.addr,r),It(i,r));for(let a=0;a!==s;++a)t.setTexture2DArray(e[a]||nh,r[a])}function Xg(n){switch(n){case 5126:return Ag;case 35664:return Rg;case 35665:return Cg;case 35666:return Pg;case 35674:return Lg;case 35675:return Dg;case 35676:return Ig;case 5124:case 35670:return Ug;case 35667:case 35671:return Ng;case 35668:case 35672:return Fg;case 35669:case 35673:return Og;case 5125:return zg;case 36294:return Bg;case 36295:return kg;case 36296:return Hg;case 35678:case 36198:case 36298:case 36306:case 35682:return Vg;case 35679:case 36299:case 36307:return Gg;case 35680:case 36300:case 36308:case 36293:return Wg;case 36289:case 36303:case 36311:case 36292:return $g}}class jg{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=Tg(t.type)}}class qg{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Xg(t.type)}}class Yg{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){const s=this.seq;for(let r=0,a=s.length;r!==a;++r){const o=s[r];o.setValue(e,t[o.id],i)}}}const xa=/(\w+)(\])?(\[|\.)?/g;function Gl(n,e){n.seq.push(e),n.map[e.id]=e}function Zg(n,e,t){const i=n.name,s=i.length;for(xa.lastIndex=0;;){const r=xa.exec(i),a=xa.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===s){Gl(t,c===void 0?new jg(o,n,e):new qg(o,n,e));break}else{let u=t.map[o];u===void 0&&(u=new Yg(o),Gl(t,u)),t=u}}}class br{constructor(e,t){this.seq=[],this.map={};const i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<i;++s){const r=e.getActiveUniform(t,s),a=e.getUniformLocation(t,r.name);Zg(r,a,this)}}setValue(e,t,i,s){const r=this.map[t];r!==void 0&&r.setValue(e,i,s)}setOptional(e,t,i){const s=t[i];s!==void 0&&this.setValue(e,i,s)}static upload(e,t,i,s){for(let r=0,a=t.length;r!==a;++r){const o=t[r],l=i[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,s)}}static seqWithValue(e,t){const i=[];for(let s=0,r=e.length;s!==r;++s){const a=e[s];a.id in t&&i.push(a)}return i}}function Wl(n,e,t){const i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}const Jg=37297;let Kg=0;function Qg(n,e){const t=n.split(`
`),i=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=s;a<r;a++){const o=a+1;i.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return i.join(`
`)}const $l=new We;function e_(n){tt._getMatrix($l,tt.workingColorSpace,n);const e=`mat3( ${$l.elements.map(t=>t.toFixed(4))} )`;switch(tt.getTransfer(n)){case Sr:return[e,"LinearTransferOETF"];case rt:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function Xl(n,e,t){const i=n.getShaderParameter(e,n.COMPILE_STATUS),r=(n.getShaderInfoLog(e)||"").trim();if(i&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+Qg(n.getShaderSource(e),o)}else return r}function t_(n,e){const t=e_(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function n_(n,e){let t;switch(e){case Su:t="Linear";break;case Eu:t="Reinhard";break;case wu:t="Cineon";break;case Tu:t="ACESFilmic";break;case Ru:t="AgX";break;case Cu:t="Neutral";break;case Au:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const ur=new L;function i_(){tt.getLuminanceCoefficients(ur);const n=ur.x.toFixed(4),e=ur.y.toFixed(4),t=ur.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function s_(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(fs).join(`
`)}function r_(n){const e=[];for(const t in n){const i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function a_(n,e){const t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){const r=n.getActiveAttrib(e,s),a=r.name;let o=1;r.type===n.FLOAT_MAT2&&(o=2),r.type===n.FLOAT_MAT3&&(o=3),r.type===n.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:n.getAttribLocation(e,a),locationSize:o}}return t}function fs(n){return n!==""}function jl(n,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function ql(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const o_=/^[ \t]*#include +<([\w\d./]+)>/gm;function yo(n){return n.replace(o_,c_)}const l_=new Map;function c_(n,e){let t=$e[e];if(t===void 0){const i=l_.get(e);if(i!==void 0)t=$e[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return yo(t)}const h_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Yl(n){return n.replace(h_,u_)}function u_(n,e,t,i){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Zl(n){let e=`precision ${n.precision} float;
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
#define LOW_PRECISION`),e}function d_(n){let e="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===xc?e="SHADOWMAP_TYPE_PCF":n.shadowMapType===nu?e="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===Nn&&(e="SHADOWMAP_TYPE_VSM"),e}function f_(n){let e="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case Xi:case ji:e="ENVMAP_TYPE_CUBE";break;case Pr:e="ENVMAP_TYPE_CUBE_UV";break}return e}function p_(n){let e="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case ji:e="ENVMAP_MODE_REFRACTION";break}return e}function m_(n){let e="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case yc:e="ENVMAP_BLENDING_MULTIPLY";break;case bu:e="ENVMAP_BLENDING_MIX";break;case Mu:e="ENVMAP_BLENDING_ADD";break}return e}function g_(n){const e=n.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function __(n,e,t,i){const s=n.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=d_(t),c=f_(t),h=p_(t),u=m_(t),f=g_(t),m=s_(t),_=r_(r),v=s.createProgram();let p,d,x=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(fs).join(`
`),p.length>0&&(p+=`
`),d=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_].filter(fs).join(`
`),d.length>0&&(d+=`
`)):(p=[Zl(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(fs).join(`
`),d=[Zl(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,_,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+u:"",f?"#define CUBEUV_TEXEL_WIDTH "+f.texelWidth:"",f?"#define CUBEUV_TEXEL_HEIGHT "+f.texelHeight:"",f?"#define CUBEUV_MAX_MIP "+f.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Zn?"#define TONE_MAPPING":"",t.toneMapping!==Zn?$e.tonemapping_pars_fragment:"",t.toneMapping!==Zn?n_("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",$e.colorspace_pars_fragment,t_("linearToOutputTexel",t.outputColorSpace),i_(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(fs).join(`
`)),a=yo(a),a=jl(a,t),a=ql(a,t),o=yo(o),o=jl(o,t),o=ql(o,t),a=Yl(a),o=Yl(o),t.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,p=[m,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,d=["#define varying in",t.glslVersion===Ko?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Ko?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+d);const y=x+p+a,g=x+d+o,w=Wl(s,s.VERTEX_SHADER,y),T=Wl(s,s.FRAGMENT_SHADER,g);s.attachShader(v,w),s.attachShader(v,T),t.index0AttributeName!==void 0?s.bindAttribLocation(v,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(v,0,"position"),s.linkProgram(v);function S(C){if(n.debug.checkShaderErrors){const I=s.getProgramInfoLog(v)||"",B=s.getShaderInfoLog(w)||"",H=s.getShaderInfoLog(T)||"",k=I.trim(),W=B.trim(),q=H.trim();let $=!0,ie=!0;if(s.getProgramParameter(v,s.LINK_STATUS)===!1)if($=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,v,w,T);else{const pe=Xl(s,w,"vertex"),be=Xl(s,T,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(v,s.VALIDATE_STATUS)+`

Material Name: `+C.name+`
Material Type: `+C.type+`

Program Info Log: `+k+`
`+pe+`
`+be)}else k!==""?console.warn("THREE.WebGLProgram: Program Info Log:",k):(W===""||q==="")&&(ie=!1);ie&&(C.diagnostics={runnable:$,programLog:k,vertexShader:{log:W,prefix:p},fragmentShader:{log:q,prefix:d}})}s.deleteShader(w),s.deleteShader(T),R=new br(s,v),M=a_(s,v)}let R;this.getUniforms=function(){return R===void 0&&S(this),R};let M;this.getAttributes=function(){return M===void 0&&S(this),M};let b=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return b===!1&&(b=s.getProgramParameter(v,Jg)),b},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(v),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Kg++,this.cacheKey=e,this.usedTimes=1,this.program=v,this.vertexShader=w,this.fragmentShader=T,this}let v_=0;class x_{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,i=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(i),a=this._getShaderCacheForMaterial(e);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){const t=this.shaderCache;let i=t.get(e);return i===void 0&&(i=new y_(e),t.set(e,i)),i}}class y_{constructor(e){this.id=v_++,this.code=e,this.usedTimes=0}}function b_(n,e,t,i,s,r,a){const o=new Po,l=new x_,c=new Set,h=[],u=s.logarithmicDepthBuffer,f=s.vertexTextures;let m=s.precision;const _={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(M){return c.add(M),M===0?"uv":`uv${M}`}function p(M,b,C,I,B){const H=I.fog,k=B.geometry,W=M.isMeshStandardMaterial?I.environment:null,q=(M.isMeshStandardMaterial?t:e).get(M.envMap||W),$=q&&q.mapping===Pr?q.image.height:null,ie=_[M.type];M.precision!==null&&(m=s.getMaxPrecision(M.precision),m!==M.precision&&console.warn("THREE.WebGLProgram.getParameters:",M.precision,"not supported, using",m,"instead."));const pe=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,be=pe!==void 0?pe.length:0;let Oe=0;k.morphAttributes.position!==void 0&&(Oe=1),k.morphAttributes.normal!==void 0&&(Oe=2),k.morphAttributes.color!==void 0&&(Oe=3);let qe,Qe,Ke,Y;if(ie){const nt=yn[ie];qe=nt.vertexShader,Qe=nt.fragmentShader}else qe=M.vertexShader,Qe=M.fragmentShader,l.update(M),Ke=l.getVertexShaderID(M),Y=l.getFragmentShaderID(M);const ne=n.getRenderTarget(),Se=n.state.buffers.depth.getReversed(),De=B.isInstancedMesh===!0,Te=B.isBatchedMesh===!0,Ye=!!M.map,ft=!!M.matcap,D=!!q,te=!!M.aoMap,K=!!M.lightMap,J=!!M.bumpMap,Z=!!M.normalMap,ue=!!M.displacementMap,se=!!M.emissiveMap,de=!!M.metalnessMap,ke=!!M.roughnessMap,Be=M.anisotropy>0,P=M.clearcoat>0,E=M.dispersion>0,z=M.iridescence>0,X=M.sheen>0,ee=M.transmission>0,j=Be&&!!M.anisotropyMap,Pe=P&&!!M.clearcoatMap,he=P&&!!M.clearcoatNormalMap,Ae=P&&!!M.clearcoatRoughnessMap,Re=z&&!!M.iridescenceMap,re=z&&!!M.iridescenceThicknessMap,ve=X&&!!M.sheenColorMap,Fe=X&&!!M.sheenRoughnessMap,Le=!!M.specularMap,ge=!!M.specularColorMap,Ge=!!M.specularIntensityMap,N=ee&&!!M.transmissionMap,ce=ee&&!!M.thicknessMap,fe=!!M.gradientMap,Ee=!!M.alphaMap,ae=M.alphaTest>0,Q=!!M.alphaHash,Ce=!!M.extensions;let He=Zn;M.toneMapped&&(ne===null||ne.isXRRenderTarget===!0)&&(He=n.toneMapping);const pt={shaderID:ie,shaderType:M.type,shaderName:M.name,vertexShader:qe,fragmentShader:Qe,defines:M.defines,customVertexShaderID:Ke,customFragmentShaderID:Y,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:m,batching:Te,batchingColor:Te&&B._colorsTexture!==null,instancing:De,instancingColor:De&&B.instanceColor!==null,instancingMorph:De&&B.morphTexture!==null,supportsVertexTextures:f,outputColorSpace:ne===null?n.outputColorSpace:ne.isXRRenderTarget===!0?ne.texture.colorSpace:qi,alphaToCoverage:!!M.alphaToCoverage,map:Ye,matcap:ft,envMap:D,envMapMode:D&&q.mapping,envMapCubeUVHeight:$,aoMap:te,lightMap:K,bumpMap:J,normalMap:Z,displacementMap:f&&ue,emissiveMap:se,normalMapObjectSpace:Z&&M.normalMapType===Iu,normalMapTangentSpace:Z&&M.normalMapType===Pc,metalnessMap:de,roughnessMap:ke,anisotropy:Be,anisotropyMap:j,clearcoat:P,clearcoatMap:Pe,clearcoatNormalMap:he,clearcoatRoughnessMap:Ae,dispersion:E,iridescence:z,iridescenceMap:Re,iridescenceThicknessMap:re,sheen:X,sheenColorMap:ve,sheenRoughnessMap:Fe,specularMap:Le,specularColorMap:ge,specularIntensityMap:Ge,transmission:ee,transmissionMap:N,thicknessMap:ce,gradientMap:fe,opaque:M.transparent===!1&&M.blending===Gi&&M.alphaToCoverage===!1,alphaMap:Ee,alphaTest:ae,alphaHash:Q,combine:M.combine,mapUv:Ye&&v(M.map.channel),aoMapUv:te&&v(M.aoMap.channel),lightMapUv:K&&v(M.lightMap.channel),bumpMapUv:J&&v(M.bumpMap.channel),normalMapUv:Z&&v(M.normalMap.channel),displacementMapUv:ue&&v(M.displacementMap.channel),emissiveMapUv:se&&v(M.emissiveMap.channel),metalnessMapUv:de&&v(M.metalnessMap.channel),roughnessMapUv:ke&&v(M.roughnessMap.channel),anisotropyMapUv:j&&v(M.anisotropyMap.channel),clearcoatMapUv:Pe&&v(M.clearcoatMap.channel),clearcoatNormalMapUv:he&&v(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Ae&&v(M.clearcoatRoughnessMap.channel),iridescenceMapUv:Re&&v(M.iridescenceMap.channel),iridescenceThicknessMapUv:re&&v(M.iridescenceThicknessMap.channel),sheenColorMapUv:ve&&v(M.sheenColorMap.channel),sheenRoughnessMapUv:Fe&&v(M.sheenRoughnessMap.channel),specularMapUv:Le&&v(M.specularMap.channel),specularColorMapUv:ge&&v(M.specularColorMap.channel),specularIntensityMapUv:Ge&&v(M.specularIntensityMap.channel),transmissionMapUv:N&&v(M.transmissionMap.channel),thicknessMapUv:ce&&v(M.thicknessMap.channel),alphaMapUv:Ee&&v(M.alphaMap.channel),vertexTangents:!!k.attributes.tangent&&(Z||Be),vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,pointsUvs:B.isPoints===!0&&!!k.attributes.uv&&(Ye||Ee),fog:!!H,useFog:M.fog===!0,fogExp2:!!H&&H.isFogExp2,flatShading:M.flatShading===!0&&M.wireframe===!1,sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:Se,skinning:B.isSkinnedMesh===!0,morphTargets:k.morphAttributes.position!==void 0,morphNormals:k.morphAttributes.normal!==void 0,morphColors:k.morphAttributes.color!==void 0,morphTargetsCount:be,morphTextureStride:Oe,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:M.dithering,shadowMapEnabled:n.shadowMap.enabled&&C.length>0,shadowMapType:n.shadowMap.type,toneMapping:He,decodeVideoTexture:Ye&&M.map.isVideoTexture===!0&&tt.getTransfer(M.map.colorSpace)===rt,decodeVideoTextureEmissive:se&&M.emissiveMap.isVideoTexture===!0&&tt.getTransfer(M.emissiveMap.colorSpace)===rt,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===fn,flipSided:M.side===Zt,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionClipCullDistance:Ce&&M.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Ce&&M.extensions.multiDraw===!0||Te)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()};return pt.vertexUv1s=c.has(1),pt.vertexUv2s=c.has(2),pt.vertexUv3s=c.has(3),c.clear(),pt}function d(M){const b=[];if(M.shaderID?b.push(M.shaderID):(b.push(M.customVertexShaderID),b.push(M.customFragmentShaderID)),M.defines!==void 0)for(const C in M.defines)b.push(C),b.push(M.defines[C]);return M.isRawShaderMaterial===!1&&(x(b,M),y(b,M),b.push(n.outputColorSpace)),b.push(M.customProgramCacheKey),b.join()}function x(M,b){M.push(b.precision),M.push(b.outputColorSpace),M.push(b.envMapMode),M.push(b.envMapCubeUVHeight),M.push(b.mapUv),M.push(b.alphaMapUv),M.push(b.lightMapUv),M.push(b.aoMapUv),M.push(b.bumpMapUv),M.push(b.normalMapUv),M.push(b.displacementMapUv),M.push(b.emissiveMapUv),M.push(b.metalnessMapUv),M.push(b.roughnessMapUv),M.push(b.anisotropyMapUv),M.push(b.clearcoatMapUv),M.push(b.clearcoatNormalMapUv),M.push(b.clearcoatRoughnessMapUv),M.push(b.iridescenceMapUv),M.push(b.iridescenceThicknessMapUv),M.push(b.sheenColorMapUv),M.push(b.sheenRoughnessMapUv),M.push(b.specularMapUv),M.push(b.specularColorMapUv),M.push(b.specularIntensityMapUv),M.push(b.transmissionMapUv),M.push(b.thicknessMapUv),M.push(b.combine),M.push(b.fogExp2),M.push(b.sizeAttenuation),M.push(b.morphTargetsCount),M.push(b.morphAttributeCount),M.push(b.numDirLights),M.push(b.numPointLights),M.push(b.numSpotLights),M.push(b.numSpotLightMaps),M.push(b.numHemiLights),M.push(b.numRectAreaLights),M.push(b.numDirLightShadows),M.push(b.numPointLightShadows),M.push(b.numSpotLightShadows),M.push(b.numSpotLightShadowsWithMaps),M.push(b.numLightProbes),M.push(b.shadowMapType),M.push(b.toneMapping),M.push(b.numClippingPlanes),M.push(b.numClipIntersection),M.push(b.depthPacking)}function y(M,b){o.disableAll(),b.supportsVertexTextures&&o.enable(0),b.instancing&&o.enable(1),b.instancingColor&&o.enable(2),b.instancingMorph&&o.enable(3),b.matcap&&o.enable(4),b.envMap&&o.enable(5),b.normalMapObjectSpace&&o.enable(6),b.normalMapTangentSpace&&o.enable(7),b.clearcoat&&o.enable(8),b.iridescence&&o.enable(9),b.alphaTest&&o.enable(10),b.vertexColors&&o.enable(11),b.vertexAlphas&&o.enable(12),b.vertexUv1s&&o.enable(13),b.vertexUv2s&&o.enable(14),b.vertexUv3s&&o.enable(15),b.vertexTangents&&o.enable(16),b.anisotropy&&o.enable(17),b.alphaHash&&o.enable(18),b.batching&&o.enable(19),b.dispersion&&o.enable(20),b.batchingColor&&o.enable(21),b.gradientMap&&o.enable(22),M.push(o.mask),o.disableAll(),b.fog&&o.enable(0),b.useFog&&o.enable(1),b.flatShading&&o.enable(2),b.logarithmicDepthBuffer&&o.enable(3),b.reversedDepthBuffer&&o.enable(4),b.skinning&&o.enable(5),b.morphTargets&&o.enable(6),b.morphNormals&&o.enable(7),b.morphColors&&o.enable(8),b.premultipliedAlpha&&o.enable(9),b.shadowMapEnabled&&o.enable(10),b.doubleSided&&o.enable(11),b.flipSided&&o.enable(12),b.useDepthPacking&&o.enable(13),b.dithering&&o.enable(14),b.transmission&&o.enable(15),b.sheen&&o.enable(16),b.opaque&&o.enable(17),b.pointsUvs&&o.enable(18),b.decodeVideoTexture&&o.enable(19),b.decodeVideoTextureEmissive&&o.enable(20),b.alphaToCoverage&&o.enable(21),M.push(o.mask)}function g(M){const b=_[M.type];let C;if(b){const I=yn[b];C=cd.clone(I.uniforms)}else C=M.uniforms;return C}function w(M,b){let C;for(let I=0,B=h.length;I<B;I++){const H=h[I];if(H.cacheKey===b){C=H,++C.usedTimes;break}}return C===void 0&&(C=new __(n,b,M,r),h.push(C)),C}function T(M){if(--M.usedTimes===0){const b=h.indexOf(M);h[b]=h[h.length-1],h.pop(),M.destroy()}}function S(M){l.remove(M)}function R(){l.dispose()}return{getParameters:p,getProgramCacheKey:d,getUniforms:g,acquireProgram:w,releaseProgram:T,releaseShaderCache:S,programs:h,dispose:R}}function M_(){let n=new WeakMap;function e(a){return n.has(a)}function t(a){let o=n.get(a);return o===void 0&&(o={},n.set(a,o)),o}function i(a){n.delete(a)}function s(a,o,l){n.get(a)[o]=l}function r(){n=new WeakMap}return{has:e,get:t,remove:i,update:s,dispose:r}}function S_(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.z!==e.z?n.z-e.z:n.id-e.id}function Jl(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function Kl(){const n=[];let e=0;const t=[],i=[],s=[];function r(){e=0,t.length=0,i.length=0,s.length=0}function a(u,f,m,_,v,p){let d=n[e];return d===void 0?(d={id:u.id,object:u,geometry:f,material:m,groupOrder:_,renderOrder:u.renderOrder,z:v,group:p},n[e]=d):(d.id=u.id,d.object=u,d.geometry=f,d.material=m,d.groupOrder=_,d.renderOrder=u.renderOrder,d.z=v,d.group=p),e++,d}function o(u,f,m,_,v,p){const d=a(u,f,m,_,v,p);m.transmission>0?i.push(d):m.transparent===!0?s.push(d):t.push(d)}function l(u,f,m,_,v,p){const d=a(u,f,m,_,v,p);m.transmission>0?i.unshift(d):m.transparent===!0?s.unshift(d):t.unshift(d)}function c(u,f){t.length>1&&t.sort(u||S_),i.length>1&&i.sort(f||Jl),s.length>1&&s.sort(f||Jl)}function h(){for(let u=e,f=n.length;u<f;u++){const m=n[u];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:i,transparent:s,init:r,push:o,unshift:l,finish:h,sort:c}}function E_(){let n=new WeakMap;function e(i,s){const r=n.get(i);let a;return r===void 0?(a=new Kl,n.set(i,[a])):s>=r.length?(a=new Kl,r.push(a)):a=r[s],a}function t(){n=new WeakMap}return{get:e,dispose:t}}function w_(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new L,color:new je};break;case"SpotLight":t={position:new L,direction:new L,color:new je,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new L,color:new je,distance:0,decay:0};break;case"HemisphereLight":t={direction:new L,skyColor:new je,groundColor:new je};break;case"RectAreaLight":t={color:new je,position:new L,halfWidth:new L,halfHeight:new L};break}return n[e.id]=t,t}}}function T_(){const n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new oe};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new oe};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new oe,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}let A_=0;function R_(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function C_(n){const e=new w_,t=T_(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new L);const s=new L,r=new ct,a=new ct;function o(c){let h=0,u=0,f=0;for(let M=0;M<9;M++)i.probe[M].set(0,0,0);let m=0,_=0,v=0,p=0,d=0,x=0,y=0,g=0,w=0,T=0,S=0;c.sort(R_);for(let M=0,b=c.length;M<b;M++){const C=c[M],I=C.color,B=C.intensity,H=C.distance,k=C.shadow&&C.shadow.map?C.shadow.map.texture:null;if(C.isAmbientLight)h+=I.r*B,u+=I.g*B,f+=I.b*B;else if(C.isLightProbe){for(let W=0;W<9;W++)i.probe[W].addScaledVector(C.sh.coefficients[W],B);S++}else if(C.isDirectionalLight){const W=e.get(C);if(W.color.copy(C.color).multiplyScalar(C.intensity),C.castShadow){const q=C.shadow,$=t.get(C);$.shadowIntensity=q.intensity,$.shadowBias=q.bias,$.shadowNormalBias=q.normalBias,$.shadowRadius=q.radius,$.shadowMapSize=q.mapSize,i.directionalShadow[m]=$,i.directionalShadowMap[m]=k,i.directionalShadowMatrix[m]=C.shadow.matrix,x++}i.directional[m]=W,m++}else if(C.isSpotLight){const W=e.get(C);W.position.setFromMatrixPosition(C.matrixWorld),W.color.copy(I).multiplyScalar(B),W.distance=H,W.coneCos=Math.cos(C.angle),W.penumbraCos=Math.cos(C.angle*(1-C.penumbra)),W.decay=C.decay,i.spot[v]=W;const q=C.shadow;if(C.map&&(i.spotLightMap[w]=C.map,w++,q.updateMatrices(C),C.castShadow&&T++),i.spotLightMatrix[v]=q.matrix,C.castShadow){const $=t.get(C);$.shadowIntensity=q.intensity,$.shadowBias=q.bias,$.shadowNormalBias=q.normalBias,$.shadowRadius=q.radius,$.shadowMapSize=q.mapSize,i.spotShadow[v]=$,i.spotShadowMap[v]=k,g++}v++}else if(C.isRectAreaLight){const W=e.get(C);W.color.copy(I).multiplyScalar(B),W.halfWidth.set(C.width*.5,0,0),W.halfHeight.set(0,C.height*.5,0),i.rectArea[p]=W,p++}else if(C.isPointLight){const W=e.get(C);if(W.color.copy(C.color).multiplyScalar(C.intensity),W.distance=C.distance,W.decay=C.decay,C.castShadow){const q=C.shadow,$=t.get(C);$.shadowIntensity=q.intensity,$.shadowBias=q.bias,$.shadowNormalBias=q.normalBias,$.shadowRadius=q.radius,$.shadowMapSize=q.mapSize,$.shadowCameraNear=q.camera.near,$.shadowCameraFar=q.camera.far,i.pointShadow[_]=$,i.pointShadowMap[_]=k,i.pointShadowMatrix[_]=C.shadow.matrix,y++}i.point[_]=W,_++}else if(C.isHemisphereLight){const W=e.get(C);W.skyColor.copy(C.color).multiplyScalar(B),W.groundColor.copy(C.groundColor).multiplyScalar(B),i.hemi[d]=W,d++}}p>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=me.LTC_FLOAT_1,i.rectAreaLTC2=me.LTC_FLOAT_2):(i.rectAreaLTC1=me.LTC_HALF_1,i.rectAreaLTC2=me.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=u,i.ambient[2]=f;const R=i.hash;(R.directionalLength!==m||R.pointLength!==_||R.spotLength!==v||R.rectAreaLength!==p||R.hemiLength!==d||R.numDirectionalShadows!==x||R.numPointShadows!==y||R.numSpotShadows!==g||R.numSpotMaps!==w||R.numLightProbes!==S)&&(i.directional.length=m,i.spot.length=v,i.rectArea.length=p,i.point.length=_,i.hemi.length=d,i.directionalShadow.length=x,i.directionalShadowMap.length=x,i.pointShadow.length=y,i.pointShadowMap.length=y,i.spotShadow.length=g,i.spotShadowMap.length=g,i.directionalShadowMatrix.length=x,i.pointShadowMatrix.length=y,i.spotLightMatrix.length=g+w-T,i.spotLightMap.length=w,i.numSpotLightShadowsWithMaps=T,i.numLightProbes=S,R.directionalLength=m,R.pointLength=_,R.spotLength=v,R.rectAreaLength=p,R.hemiLength=d,R.numDirectionalShadows=x,R.numPointShadows=y,R.numSpotShadows=g,R.numSpotMaps=w,R.numLightProbes=S,i.version=A_++)}function l(c,h){let u=0,f=0,m=0,_=0,v=0;const p=h.matrixWorldInverse;for(let d=0,x=c.length;d<x;d++){const y=c[d];if(y.isDirectionalLight){const g=i.directional[u];g.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),g.direction.sub(s),g.direction.transformDirection(p),u++}else if(y.isSpotLight){const g=i.spot[m];g.position.setFromMatrixPosition(y.matrixWorld),g.position.applyMatrix4(p),g.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),g.direction.sub(s),g.direction.transformDirection(p),m++}else if(y.isRectAreaLight){const g=i.rectArea[_];g.position.setFromMatrixPosition(y.matrixWorld),g.position.applyMatrix4(p),a.identity(),r.copy(y.matrixWorld),r.premultiply(p),a.extractRotation(r),g.halfWidth.set(y.width*.5,0,0),g.halfHeight.set(0,y.height*.5,0),g.halfWidth.applyMatrix4(a),g.halfHeight.applyMatrix4(a),_++}else if(y.isPointLight){const g=i.point[f];g.position.setFromMatrixPosition(y.matrixWorld),g.position.applyMatrix4(p),f++}else if(y.isHemisphereLight){const g=i.hemi[v];g.direction.setFromMatrixPosition(y.matrixWorld),g.direction.transformDirection(p),v++}}}return{setup:o,setupView:l,state:i}}function Ql(n){const e=new C_(n),t=[],i=[];function s(h){c.camera=h,t.length=0,i.length=0}function r(h){t.push(h)}function a(h){i.push(h)}function o(){e.setup(t)}function l(h){e.setupView(t,h)}const c={lightsArray:t,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:o,setupLightsView:l,pushLight:r,pushShadow:a}}function P_(n){let e=new WeakMap;function t(s,r=0){const a=e.get(s);let o;return a===void 0?(o=new Ql(n),e.set(s,[o])):r>=a.length?(o=new Ql(n),a.push(o)):o=a[r],o}function i(){e=new WeakMap}return{get:t,dispose:i}}const L_=`void main() {
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
}`;function I_(n,e,t){let i=new Lo;const s=new oe,r=new oe,a=new wt,o=new Qd({depthPacking:Du}),l=new ef,c={},h=t.maxTextureSize,u={[Jn]:Zt,[Zt]:Jn,[fn]:fn},f=new Kn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new oe},radius:{value:4}},vertexShader:L_,fragmentShader:D_}),m=f.clone();m.defines.HORIZONTAL_PASS=1;const _=new Nt;_.setAttribute("position",new En(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new ye(_,f),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=xc;let d=this.type;this.render=function(T,S,R){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||T.length===0)return;const M=n.getRenderTarget(),b=n.getActiveCubeFace(),C=n.getActiveMipmapLevel(),I=n.state;I.setBlending(Yn),I.buffers.depth.getReversed()===!0?I.buffers.color.setClear(0,0,0,0):I.buffers.color.setClear(1,1,1,1),I.buffers.depth.setTest(!0),I.setScissorTest(!1);const B=d!==Nn&&this.type===Nn,H=d===Nn&&this.type!==Nn;for(let k=0,W=T.length;k<W;k++){const q=T[k],$=q.shadow;if($===void 0){console.warn("THREE.WebGLShadowMap:",q,"has no shadow.");continue}if($.autoUpdate===!1&&$.needsUpdate===!1)continue;s.copy($.mapSize);const ie=$.getFrameExtents();if(s.multiply(ie),r.copy($.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/ie.x),s.x=r.x*ie.x,$.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/ie.y),s.y=r.y*ie.y,$.mapSize.y=r.y)),$.map===null||B===!0||H===!0){const be=this.type!==Nn?{minFilter:mn,magFilter:mn}:{};$.map!==null&&$.map.dispose(),$.map=new xi(s.x,s.y,be),$.map.texture.name=q.name+".shadowMap",$.camera.updateProjectionMatrix()}n.setRenderTarget($.map),n.clear();const pe=$.getViewportCount();for(let be=0;be<pe;be++){const Oe=$.getViewport(be);a.set(r.x*Oe.x,r.y*Oe.y,r.x*Oe.z,r.y*Oe.w),I.viewport(a),$.updateMatrices(q,be),i=$.getFrustum(),g(S,R,$.camera,q,this.type)}$.isPointLightShadow!==!0&&this.type===Nn&&x($,R),$.needsUpdate=!1}d=this.type,p.needsUpdate=!1,n.setRenderTarget(M,b,C)};function x(T,S){const R=e.update(v);f.defines.VSM_SAMPLES!==T.blurSamples&&(f.defines.VSM_SAMPLES=T.blurSamples,m.defines.VSM_SAMPLES=T.blurSamples,f.needsUpdate=!0,m.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new xi(s.x,s.y)),f.uniforms.shadow_pass.value=T.map.texture,f.uniforms.resolution.value=T.mapSize,f.uniforms.radius.value=T.radius,n.setRenderTarget(T.mapPass),n.clear(),n.renderBufferDirect(S,null,R,f,v,null),m.uniforms.shadow_pass.value=T.mapPass.texture,m.uniforms.resolution.value=T.mapSize,m.uniforms.radius.value=T.radius,n.setRenderTarget(T.map),n.clear(),n.renderBufferDirect(S,null,R,m,v,null)}function y(T,S,R,M){let b=null;const C=R.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(C!==void 0)b=C;else if(b=R.isPointLight===!0?l:o,n.localClippingEnabled&&S.clipShadows===!0&&Array.isArray(S.clippingPlanes)&&S.clippingPlanes.length!==0||S.displacementMap&&S.displacementScale!==0||S.alphaMap&&S.alphaTest>0||S.map&&S.alphaTest>0||S.alphaToCoverage===!0){const I=b.uuid,B=S.uuid;let H=c[I];H===void 0&&(H={},c[I]=H);let k=H[B];k===void 0&&(k=b.clone(),H[B]=k,S.addEventListener("dispose",w)),b=k}if(b.visible=S.visible,b.wireframe=S.wireframe,M===Nn?b.side=S.shadowSide!==null?S.shadowSide:S.side:b.side=S.shadowSide!==null?S.shadowSide:u[S.side],b.alphaMap=S.alphaMap,b.alphaTest=S.alphaToCoverage===!0?.5:S.alphaTest,b.map=S.map,b.clipShadows=S.clipShadows,b.clippingPlanes=S.clippingPlanes,b.clipIntersection=S.clipIntersection,b.displacementMap=S.displacementMap,b.displacementScale=S.displacementScale,b.displacementBias=S.displacementBias,b.wireframeLinewidth=S.wireframeLinewidth,b.linewidth=S.linewidth,R.isPointLight===!0&&b.isMeshDistanceMaterial===!0){const I=n.properties.get(b);I.light=R}return b}function g(T,S,R,M,b){if(T.visible===!1)return;if(T.layers.test(S.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&b===Nn)&&(!T.frustumCulled||i.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(R.matrixWorldInverse,T.matrixWorld);const B=e.update(T),H=T.material;if(Array.isArray(H)){const k=B.groups;for(let W=0,q=k.length;W<q;W++){const $=k[W],ie=H[$.materialIndex];if(ie&&ie.visible){const pe=y(T,ie,M,b);T.onBeforeShadow(n,T,S,R,B,pe,$),n.renderBufferDirect(R,null,B,pe,T,$),T.onAfterShadow(n,T,S,R,B,pe,$)}}}else if(H.visible){const k=y(T,H,M,b);T.onBeforeShadow(n,T,S,R,B,k,null),n.renderBufferDirect(R,null,B,k,T,null),T.onAfterShadow(n,T,S,R,B,k,null)}}const I=T.children;for(let B=0,H=I.length;B<H;B++)g(I[B],S,R,M,b)}function w(T){T.target.removeEventListener("dispose",w);for(const R in c){const M=c[R],b=T.target.uuid;b in M&&(M[b].dispose(),delete M[b])}}}const U_={[Aa]:Ra,[Ca]:Da,[Pa]:Ia,[$i]:La,[Ra]:Aa,[Da]:Ca,[Ia]:Pa,[La]:$i};function N_(n,e){function t(){let N=!1;const ce=new wt;let fe=null;const Ee=new wt(0,0,0,0);return{setMask:function(ae){fe!==ae&&!N&&(n.colorMask(ae,ae,ae,ae),fe=ae)},setLocked:function(ae){N=ae},setClear:function(ae,Q,Ce,He,pt){pt===!0&&(ae*=He,Q*=He,Ce*=He),ce.set(ae,Q,Ce,He),Ee.equals(ce)===!1&&(n.clearColor(ae,Q,Ce,He),Ee.copy(ce))},reset:function(){N=!1,fe=null,Ee.set(-1,0,0,0)}}}function i(){let N=!1,ce=!1,fe=null,Ee=null,ae=null;return{setReversed:function(Q){if(ce!==Q){const Ce=e.get("EXT_clip_control");Q?Ce.clipControlEXT(Ce.LOWER_LEFT_EXT,Ce.ZERO_TO_ONE_EXT):Ce.clipControlEXT(Ce.LOWER_LEFT_EXT,Ce.NEGATIVE_ONE_TO_ONE_EXT),ce=Q;const He=ae;ae=null,this.setClear(He)}},getReversed:function(){return ce},setTest:function(Q){Q?ne(n.DEPTH_TEST):Se(n.DEPTH_TEST)},setMask:function(Q){fe!==Q&&!N&&(n.depthMask(Q),fe=Q)},setFunc:function(Q){if(ce&&(Q=U_[Q]),Ee!==Q){switch(Q){case Aa:n.depthFunc(n.NEVER);break;case Ra:n.depthFunc(n.ALWAYS);break;case Ca:n.depthFunc(n.LESS);break;case $i:n.depthFunc(n.LEQUAL);break;case Pa:n.depthFunc(n.EQUAL);break;case La:n.depthFunc(n.GEQUAL);break;case Da:n.depthFunc(n.GREATER);break;case Ia:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}Ee=Q}},setLocked:function(Q){N=Q},setClear:function(Q){ae!==Q&&(ce&&(Q=1-Q),n.clearDepth(Q),ae=Q)},reset:function(){N=!1,fe=null,Ee=null,ae=null,ce=!1}}}function s(){let N=!1,ce=null,fe=null,Ee=null,ae=null,Q=null,Ce=null,He=null,pt=null;return{setTest:function(nt){N||(nt?ne(n.STENCIL_TEST):Se(n.STENCIL_TEST))},setMask:function(nt){ce!==nt&&!N&&(n.stencilMask(nt),ce=nt)},setFunc:function(nt,Rn,_n){(fe!==nt||Ee!==Rn||ae!==_n)&&(n.stencilFunc(nt,Rn,_n),fe=nt,Ee=Rn,ae=_n)},setOp:function(nt,Rn,_n){(Q!==nt||Ce!==Rn||He!==_n)&&(n.stencilOp(nt,Rn,_n),Q=nt,Ce=Rn,He=_n)},setLocked:function(nt){N=nt},setClear:function(nt){pt!==nt&&(n.clearStencil(nt),pt=nt)},reset:function(){N=!1,ce=null,fe=null,Ee=null,ae=null,Q=null,Ce=null,He=null,pt=null}}}const r=new t,a=new i,o=new s,l=new WeakMap,c=new WeakMap;let h={},u={},f=new WeakMap,m=[],_=null,v=!1,p=null,d=null,x=null,y=null,g=null,w=null,T=null,S=new je(0,0,0),R=0,M=!1,b=null,C=null,I=null,B=null,H=null;const k=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let W=!1,q=0;const $=n.getParameter(n.VERSION);$.indexOf("WebGL")!==-1?(q=parseFloat(/^WebGL (\d)/.exec($)[1]),W=q>=1):$.indexOf("OpenGL ES")!==-1&&(q=parseFloat(/^OpenGL ES (\d)/.exec($)[1]),W=q>=2);let ie=null,pe={};const be=n.getParameter(n.SCISSOR_BOX),Oe=n.getParameter(n.VIEWPORT),qe=new wt().fromArray(be),Qe=new wt().fromArray(Oe);function Ke(N,ce,fe,Ee){const ae=new Uint8Array(4),Q=n.createTexture();n.bindTexture(N,Q),n.texParameteri(N,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(N,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Ce=0;Ce<fe;Ce++)N===n.TEXTURE_3D||N===n.TEXTURE_2D_ARRAY?n.texImage3D(ce,0,n.RGBA,1,1,Ee,0,n.RGBA,n.UNSIGNED_BYTE,ae):n.texImage2D(ce+Ce,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,ae);return Q}const Y={};Y[n.TEXTURE_2D]=Ke(n.TEXTURE_2D,n.TEXTURE_2D,1),Y[n.TEXTURE_CUBE_MAP]=Ke(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),Y[n.TEXTURE_2D_ARRAY]=Ke(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),Y[n.TEXTURE_3D]=Ke(n.TEXTURE_3D,n.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),ne(n.DEPTH_TEST),a.setFunc($i),J(!1),Z(Xo),ne(n.CULL_FACE),te(Yn);function ne(N){h[N]!==!0&&(n.enable(N),h[N]=!0)}function Se(N){h[N]!==!1&&(n.disable(N),h[N]=!1)}function De(N,ce){return u[N]!==ce?(n.bindFramebuffer(N,ce),u[N]=ce,N===n.DRAW_FRAMEBUFFER&&(u[n.FRAMEBUFFER]=ce),N===n.FRAMEBUFFER&&(u[n.DRAW_FRAMEBUFFER]=ce),!0):!1}function Te(N,ce){let fe=m,Ee=!1;if(N){fe=f.get(ce),fe===void 0&&(fe=[],f.set(ce,fe));const ae=N.textures;if(fe.length!==ae.length||fe[0]!==n.COLOR_ATTACHMENT0){for(let Q=0,Ce=ae.length;Q<Ce;Q++)fe[Q]=n.COLOR_ATTACHMENT0+Q;fe.length=ae.length,Ee=!0}}else fe[0]!==n.BACK&&(fe[0]=n.BACK,Ee=!0);Ee&&n.drawBuffers(fe)}function Ye(N){return _!==N?(n.useProgram(N),_=N,!0):!1}const ft={[fi]:n.FUNC_ADD,[su]:n.FUNC_SUBTRACT,[ru]:n.FUNC_REVERSE_SUBTRACT};ft[au]=n.MIN,ft[ou]=n.MAX;const D={[lu]:n.ZERO,[cu]:n.ONE,[hu]:n.SRC_COLOR,[wa]:n.SRC_ALPHA,[gu]:n.SRC_ALPHA_SATURATE,[pu]:n.DST_COLOR,[du]:n.DST_ALPHA,[uu]:n.ONE_MINUS_SRC_COLOR,[Ta]:n.ONE_MINUS_SRC_ALPHA,[mu]:n.ONE_MINUS_DST_COLOR,[fu]:n.ONE_MINUS_DST_ALPHA,[_u]:n.CONSTANT_COLOR,[vu]:n.ONE_MINUS_CONSTANT_COLOR,[xu]:n.CONSTANT_ALPHA,[yu]:n.ONE_MINUS_CONSTANT_ALPHA};function te(N,ce,fe,Ee,ae,Q,Ce,He,pt,nt){if(N===Yn){v===!0&&(Se(n.BLEND),v=!1);return}if(v===!1&&(ne(n.BLEND),v=!0),N!==iu){if(N!==p||nt!==M){if((d!==fi||g!==fi)&&(n.blendEquation(n.FUNC_ADD),d=fi,g=fi),nt)switch(N){case Gi:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case jo:n.blendFunc(n.ONE,n.ONE);break;case qo:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Yo:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}else switch(N){case Gi:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case jo:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case qo:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Yo:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",N);break}x=null,y=null,w=null,T=null,S.set(0,0,0),R=0,p=N,M=nt}return}ae=ae||ce,Q=Q||fe,Ce=Ce||Ee,(ce!==d||ae!==g)&&(n.blendEquationSeparate(ft[ce],ft[ae]),d=ce,g=ae),(fe!==x||Ee!==y||Q!==w||Ce!==T)&&(n.blendFuncSeparate(D[fe],D[Ee],D[Q],D[Ce]),x=fe,y=Ee,w=Q,T=Ce),(He.equals(S)===!1||pt!==R)&&(n.blendColor(He.r,He.g,He.b,pt),S.copy(He),R=pt),p=N,M=!1}function K(N,ce){N.side===fn?Se(n.CULL_FACE):ne(n.CULL_FACE);let fe=N.side===Zt;ce&&(fe=!fe),J(fe),N.blending===Gi&&N.transparent===!1?te(Yn):te(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.blendColor,N.blendAlpha,N.premultipliedAlpha),a.setFunc(N.depthFunc),a.setTest(N.depthTest),a.setMask(N.depthWrite),r.setMask(N.colorWrite);const Ee=N.stencilWrite;o.setTest(Ee),Ee&&(o.setMask(N.stencilWriteMask),o.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),o.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass)),se(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?ne(n.SAMPLE_ALPHA_TO_COVERAGE):Se(n.SAMPLE_ALPHA_TO_COVERAGE)}function J(N){b!==N&&(N?n.frontFace(n.CW):n.frontFace(n.CCW),b=N)}function Z(N){N!==eu?(ne(n.CULL_FACE),N!==C&&(N===Xo?n.cullFace(n.BACK):N===tu?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):Se(n.CULL_FACE),C=N}function ue(N){N!==I&&(W&&n.lineWidth(N),I=N)}function se(N,ce,fe){N?(ne(n.POLYGON_OFFSET_FILL),(B!==ce||H!==fe)&&(n.polygonOffset(ce,fe),B=ce,H=fe)):Se(n.POLYGON_OFFSET_FILL)}function de(N){N?ne(n.SCISSOR_TEST):Se(n.SCISSOR_TEST)}function ke(N){N===void 0&&(N=n.TEXTURE0+k-1),ie!==N&&(n.activeTexture(N),ie=N)}function Be(N,ce,fe){fe===void 0&&(ie===null?fe=n.TEXTURE0+k-1:fe=ie);let Ee=pe[fe];Ee===void 0&&(Ee={type:void 0,texture:void 0},pe[fe]=Ee),(Ee.type!==N||Ee.texture!==ce)&&(ie!==fe&&(n.activeTexture(fe),ie=fe),n.bindTexture(N,ce||Y[N]),Ee.type=N,Ee.texture=ce)}function P(){const N=pe[ie];N!==void 0&&N.type!==void 0&&(n.bindTexture(N.type,null),N.type=void 0,N.texture=void 0)}function E(){try{n.compressedTexImage2D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function z(){try{n.compressedTexImage3D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function X(){try{n.texSubImage2D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function ee(){try{n.texSubImage3D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function j(){try{n.compressedTexSubImage2D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Pe(){try{n.compressedTexSubImage3D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function he(){try{n.texStorage2D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Ae(){try{n.texStorage3D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function Re(){try{n.texImage2D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function re(){try{n.texImage3D(...arguments)}catch(N){console.error("THREE.WebGLState:",N)}}function ve(N){qe.equals(N)===!1&&(n.scissor(N.x,N.y,N.z,N.w),qe.copy(N))}function Fe(N){Qe.equals(N)===!1&&(n.viewport(N.x,N.y,N.z,N.w),Qe.copy(N))}function Le(N,ce){let fe=c.get(ce);fe===void 0&&(fe=new WeakMap,c.set(ce,fe));let Ee=fe.get(N);Ee===void 0&&(Ee=n.getUniformBlockIndex(ce,N.name),fe.set(N,Ee))}function ge(N,ce){const Ee=c.get(ce).get(N);l.get(ce)!==Ee&&(n.uniformBlockBinding(ce,Ee,N.__bindingPointIndex),l.set(ce,Ee))}function Ge(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),a.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),h={},ie=null,pe={},u={},f=new WeakMap,m=[],_=null,v=!1,p=null,d=null,x=null,y=null,g=null,w=null,T=null,S=new je(0,0,0),R=0,M=!1,b=null,C=null,I=null,B=null,H=null,qe.set(0,0,n.canvas.width,n.canvas.height),Qe.set(0,0,n.canvas.width,n.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:ne,disable:Se,bindFramebuffer:De,drawBuffers:Te,useProgram:Ye,setBlending:te,setMaterial:K,setFlipSided:J,setCullFace:Z,setLineWidth:ue,setPolygonOffset:se,setScissorTest:de,activeTexture:ke,bindTexture:Be,unbindTexture:P,compressedTexImage2D:E,compressedTexImage3D:z,texImage2D:Re,texImage3D:re,updateUBOMapping:Le,uniformBlockBinding:ge,texStorage2D:he,texStorage3D:Ae,texSubImage2D:X,texSubImage3D:ee,compressedTexSubImage2D:j,compressedTexSubImage3D:Pe,scissor:ve,viewport:Fe,reset:Ge}}function F_(n,e,t,i,s,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new oe,h=new WeakMap;let u;const f=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function _(P,E){return m?new OffscreenCanvas(P,E):wr("canvas")}function v(P,E,z){let X=1;const ee=Be(P);if((ee.width>z||ee.height>z)&&(X=z/Math.max(ee.width,ee.height)),X<1)if(typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&P instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&P instanceof ImageBitmap||typeof VideoFrame<"u"&&P instanceof VideoFrame){const j=Math.floor(X*ee.width),Pe=Math.floor(X*ee.height);u===void 0&&(u=_(j,Pe));const he=E?_(j,Pe):u;return he.width=j,he.height=Pe,he.getContext("2d").drawImage(P,0,0,j,Pe),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ee.width+"x"+ee.height+") to ("+j+"x"+Pe+")."),he}else return"data"in P&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ee.width+"x"+ee.height+")."),P;return P}function p(P){return P.generateMipmaps}function d(P){n.generateMipmap(P)}function x(P){return P.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:P.isWebGL3DRenderTarget?n.TEXTURE_3D:P.isWebGLArrayRenderTarget||P.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function y(P,E,z,X,ee=!1){if(P!==null){if(n[P]!==void 0)return n[P];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+P+"'")}let j=E;if(E===n.RED&&(z===n.FLOAT&&(j=n.R32F),z===n.HALF_FLOAT&&(j=n.R16F),z===n.UNSIGNED_BYTE&&(j=n.R8)),E===n.RED_INTEGER&&(z===n.UNSIGNED_BYTE&&(j=n.R8UI),z===n.UNSIGNED_SHORT&&(j=n.R16UI),z===n.UNSIGNED_INT&&(j=n.R32UI),z===n.BYTE&&(j=n.R8I),z===n.SHORT&&(j=n.R16I),z===n.INT&&(j=n.R32I)),E===n.RG&&(z===n.FLOAT&&(j=n.RG32F),z===n.HALF_FLOAT&&(j=n.RG16F),z===n.UNSIGNED_BYTE&&(j=n.RG8)),E===n.RG_INTEGER&&(z===n.UNSIGNED_BYTE&&(j=n.RG8UI),z===n.UNSIGNED_SHORT&&(j=n.RG16UI),z===n.UNSIGNED_INT&&(j=n.RG32UI),z===n.BYTE&&(j=n.RG8I),z===n.SHORT&&(j=n.RG16I),z===n.INT&&(j=n.RG32I)),E===n.RGB_INTEGER&&(z===n.UNSIGNED_BYTE&&(j=n.RGB8UI),z===n.UNSIGNED_SHORT&&(j=n.RGB16UI),z===n.UNSIGNED_INT&&(j=n.RGB32UI),z===n.BYTE&&(j=n.RGB8I),z===n.SHORT&&(j=n.RGB16I),z===n.INT&&(j=n.RGB32I)),E===n.RGBA_INTEGER&&(z===n.UNSIGNED_BYTE&&(j=n.RGBA8UI),z===n.UNSIGNED_SHORT&&(j=n.RGBA16UI),z===n.UNSIGNED_INT&&(j=n.RGBA32UI),z===n.BYTE&&(j=n.RGBA8I),z===n.SHORT&&(j=n.RGBA16I),z===n.INT&&(j=n.RGBA32I)),E===n.RGB&&(z===n.UNSIGNED_INT_5_9_9_9_REV&&(j=n.RGB9_E5),z===n.UNSIGNED_INT_10F_11F_11F_REV&&(j=n.R11F_G11F_B10F)),E===n.RGBA){const Pe=ee?Sr:tt.getTransfer(X);z===n.FLOAT&&(j=n.RGBA32F),z===n.HALF_FLOAT&&(j=n.RGBA16F),z===n.UNSIGNED_BYTE&&(j=Pe===rt?n.SRGB8_ALPHA8:n.RGBA8),z===n.UNSIGNED_SHORT_4_4_4_4&&(j=n.RGBA4),z===n.UNSIGNED_SHORT_5_5_5_1&&(j=n.RGB5_A1)}return(j===n.R16F||j===n.R32F||j===n.RG16F||j===n.RG32F||j===n.RGBA16F||j===n.RGBA32F)&&e.get("EXT_color_buffer_float"),j}function g(P,E){let z;return P?E===null||E===vi||E===Ms?z=n.DEPTH24_STENCIL8:E===On?z=n.DEPTH32F_STENCIL8:E===bs&&(z=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):E===null||E===vi||E===Ms?z=n.DEPTH_COMPONENT24:E===On?z=n.DEPTH_COMPONENT32F:E===bs&&(z=n.DEPTH_COMPONENT16),z}function w(P,E){return p(P)===!0||P.isFramebufferTexture&&P.minFilter!==mn&&P.minFilter!==Mn?Math.log2(Math.max(E.width,E.height))+1:P.mipmaps!==void 0&&P.mipmaps.length>0?P.mipmaps.length:P.isCompressedTexture&&Array.isArray(P.image)?E.mipmaps.length:1}function T(P){const E=P.target;E.removeEventListener("dispose",T),R(E),E.isVideoTexture&&h.delete(E)}function S(P){const E=P.target;E.removeEventListener("dispose",S),b(E)}function R(P){const E=i.get(P);if(E.__webglInit===void 0)return;const z=P.source,X=f.get(z);if(X){const ee=X[E.__cacheKey];ee.usedTimes--,ee.usedTimes===0&&M(P),Object.keys(X).length===0&&f.delete(z)}i.remove(P)}function M(P){const E=i.get(P);n.deleteTexture(E.__webglTexture);const z=P.source,X=f.get(z);delete X[E.__cacheKey],a.memory.textures--}function b(P){const E=i.get(P);if(P.depthTexture&&(P.depthTexture.dispose(),i.remove(P.depthTexture)),P.isWebGLCubeRenderTarget)for(let X=0;X<6;X++){if(Array.isArray(E.__webglFramebuffer[X]))for(let ee=0;ee<E.__webglFramebuffer[X].length;ee++)n.deleteFramebuffer(E.__webglFramebuffer[X][ee]);else n.deleteFramebuffer(E.__webglFramebuffer[X]);E.__webglDepthbuffer&&n.deleteRenderbuffer(E.__webglDepthbuffer[X])}else{if(Array.isArray(E.__webglFramebuffer))for(let X=0;X<E.__webglFramebuffer.length;X++)n.deleteFramebuffer(E.__webglFramebuffer[X]);else n.deleteFramebuffer(E.__webglFramebuffer);if(E.__webglDepthbuffer&&n.deleteRenderbuffer(E.__webglDepthbuffer),E.__webglMultisampledFramebuffer&&n.deleteFramebuffer(E.__webglMultisampledFramebuffer),E.__webglColorRenderbuffer)for(let X=0;X<E.__webglColorRenderbuffer.length;X++)E.__webglColorRenderbuffer[X]&&n.deleteRenderbuffer(E.__webglColorRenderbuffer[X]);E.__webglDepthRenderbuffer&&n.deleteRenderbuffer(E.__webglDepthRenderbuffer)}const z=P.textures;for(let X=0,ee=z.length;X<ee;X++){const j=i.get(z[X]);j.__webglTexture&&(n.deleteTexture(j.__webglTexture),a.memory.textures--),i.remove(z[X])}i.remove(P)}let C=0;function I(){C=0}function B(){const P=C;return P>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+P+" texture units while this GPU supports only "+s.maxTextures),C+=1,P}function H(P){const E=[];return E.push(P.wrapS),E.push(P.wrapT),E.push(P.wrapR||0),E.push(P.magFilter),E.push(P.minFilter),E.push(P.anisotropy),E.push(P.internalFormat),E.push(P.format),E.push(P.type),E.push(P.generateMipmaps),E.push(P.premultiplyAlpha),E.push(P.flipY),E.push(P.unpackAlignment),E.push(P.colorSpace),E.join()}function k(P,E){const z=i.get(P);if(P.isVideoTexture&&de(P),P.isRenderTargetTexture===!1&&P.isExternalTexture!==!0&&P.version>0&&z.__version!==P.version){const X=P.image;if(X===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(X.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Y(z,P,E);return}}else P.isExternalTexture&&(z.__webglTexture=P.sourceTexture?P.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,z.__webglTexture,n.TEXTURE0+E)}function W(P,E){const z=i.get(P);if(P.isRenderTargetTexture===!1&&P.version>0&&z.__version!==P.version){Y(z,P,E);return}t.bindTexture(n.TEXTURE_2D_ARRAY,z.__webglTexture,n.TEXTURE0+E)}function q(P,E){const z=i.get(P);if(P.isRenderTargetTexture===!1&&P.version>0&&z.__version!==P.version){Y(z,P,E);return}t.bindTexture(n.TEXTURE_3D,z.__webglTexture,n.TEXTURE0+E)}function $(P,E){const z=i.get(P);if(P.version>0&&z.__version!==P.version){ne(z,P,E);return}t.bindTexture(n.TEXTURE_CUBE_MAP,z.__webglTexture,n.TEXTURE0+E)}const ie={[Fa]:n.REPEAT,[gi]:n.CLAMP_TO_EDGE,[Oa]:n.MIRRORED_REPEAT},pe={[mn]:n.NEAREST,[Pu]:n.NEAREST_MIPMAP_NEAREST,[Os]:n.NEAREST_MIPMAP_LINEAR,[Mn]:n.LINEAR,[zr]:n.LINEAR_MIPMAP_NEAREST,[_i]:n.LINEAR_MIPMAP_LINEAR},be={[Uu]:n.NEVER,[ku]:n.ALWAYS,[Nu]:n.LESS,[Lc]:n.LEQUAL,[Fu]:n.EQUAL,[Bu]:n.GEQUAL,[Ou]:n.GREATER,[zu]:n.NOTEQUAL};function Oe(P,E){if(E.type===On&&e.has("OES_texture_float_linear")===!1&&(E.magFilter===Mn||E.magFilter===zr||E.magFilter===Os||E.magFilter===_i||E.minFilter===Mn||E.minFilter===zr||E.minFilter===Os||E.minFilter===_i)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(P,n.TEXTURE_WRAP_S,ie[E.wrapS]),n.texParameteri(P,n.TEXTURE_WRAP_T,ie[E.wrapT]),(P===n.TEXTURE_3D||P===n.TEXTURE_2D_ARRAY)&&n.texParameteri(P,n.TEXTURE_WRAP_R,ie[E.wrapR]),n.texParameteri(P,n.TEXTURE_MAG_FILTER,pe[E.magFilter]),n.texParameteri(P,n.TEXTURE_MIN_FILTER,pe[E.minFilter]),E.compareFunction&&(n.texParameteri(P,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(P,n.TEXTURE_COMPARE_FUNC,be[E.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(E.magFilter===mn||E.minFilter!==Os&&E.minFilter!==_i||E.type===On&&e.has("OES_texture_float_linear")===!1)return;if(E.anisotropy>1||i.get(E).__currentAnisotropy){const z=e.get("EXT_texture_filter_anisotropic");n.texParameterf(P,z.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(E.anisotropy,s.getMaxAnisotropy())),i.get(E).__currentAnisotropy=E.anisotropy}}}function qe(P,E){let z=!1;P.__webglInit===void 0&&(P.__webglInit=!0,E.addEventListener("dispose",T));const X=E.source;let ee=f.get(X);ee===void 0&&(ee={},f.set(X,ee));const j=H(E);if(j!==P.__cacheKey){ee[j]===void 0&&(ee[j]={texture:n.createTexture(),usedTimes:0},a.memory.textures++,z=!0),ee[j].usedTimes++;const Pe=ee[P.__cacheKey];Pe!==void 0&&(ee[P.__cacheKey].usedTimes--,Pe.usedTimes===0&&M(E)),P.__cacheKey=j,P.__webglTexture=ee[j].texture}return z}function Qe(P,E,z){return Math.floor(Math.floor(P/z)/E)}function Ke(P,E,z,X){const j=P.updateRanges;if(j.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,E.width,E.height,z,X,E.data);else{j.sort((re,ve)=>re.start-ve.start);let Pe=0;for(let re=1;re<j.length;re++){const ve=j[Pe],Fe=j[re],Le=ve.start+ve.count,ge=Qe(Fe.start,E.width,4),Ge=Qe(ve.start,E.width,4);Fe.start<=Le+1&&ge===Ge&&Qe(Fe.start+Fe.count-1,E.width,4)===ge?ve.count=Math.max(ve.count,Fe.start+Fe.count-ve.start):(++Pe,j[Pe]=Fe)}j.length=Pe+1;const he=n.getParameter(n.UNPACK_ROW_LENGTH),Ae=n.getParameter(n.UNPACK_SKIP_PIXELS),Re=n.getParameter(n.UNPACK_SKIP_ROWS);n.pixelStorei(n.UNPACK_ROW_LENGTH,E.width);for(let re=0,ve=j.length;re<ve;re++){const Fe=j[re],Le=Math.floor(Fe.start/4),ge=Math.ceil(Fe.count/4),Ge=Le%E.width,N=Math.floor(Le/E.width),ce=ge,fe=1;n.pixelStorei(n.UNPACK_SKIP_PIXELS,Ge),n.pixelStorei(n.UNPACK_SKIP_ROWS,N),t.texSubImage2D(n.TEXTURE_2D,0,Ge,N,ce,fe,z,X,E.data)}P.clearUpdateRanges(),n.pixelStorei(n.UNPACK_ROW_LENGTH,he),n.pixelStorei(n.UNPACK_SKIP_PIXELS,Ae),n.pixelStorei(n.UNPACK_SKIP_ROWS,Re)}}function Y(P,E,z){let X=n.TEXTURE_2D;(E.isDataArrayTexture||E.isCompressedArrayTexture)&&(X=n.TEXTURE_2D_ARRAY),E.isData3DTexture&&(X=n.TEXTURE_3D);const ee=qe(P,E),j=E.source;t.bindTexture(X,P.__webglTexture,n.TEXTURE0+z);const Pe=i.get(j);if(j.version!==Pe.__version||ee===!0){t.activeTexture(n.TEXTURE0+z);const he=tt.getPrimaries(tt.workingColorSpace),Ae=E.colorSpace===qn?null:tt.getPrimaries(E.colorSpace),Re=E.colorSpace===qn||he===Ae?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,E.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,E.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Re);let re=v(E.image,!1,s.maxTextureSize);re=ke(E,re);const ve=r.convert(E.format,E.colorSpace),Fe=r.convert(E.type);let Le=y(E.internalFormat,ve,Fe,E.colorSpace,E.isVideoTexture);Oe(X,E);let ge;const Ge=E.mipmaps,N=E.isVideoTexture!==!0,ce=Pe.__version===void 0||ee===!0,fe=j.dataReady,Ee=w(E,re);if(E.isDepthTexture)Le=g(E.format===Es,E.type),ce&&(N?t.texStorage2D(n.TEXTURE_2D,1,Le,re.width,re.height):t.texImage2D(n.TEXTURE_2D,0,Le,re.width,re.height,0,ve,Fe,null));else if(E.isDataTexture)if(Ge.length>0){N&&ce&&t.texStorage2D(n.TEXTURE_2D,Ee,Le,Ge[0].width,Ge[0].height);for(let ae=0,Q=Ge.length;ae<Q;ae++)ge=Ge[ae],N?fe&&t.texSubImage2D(n.TEXTURE_2D,ae,0,0,ge.width,ge.height,ve,Fe,ge.data):t.texImage2D(n.TEXTURE_2D,ae,Le,ge.width,ge.height,0,ve,Fe,ge.data);E.generateMipmaps=!1}else N?(ce&&t.texStorage2D(n.TEXTURE_2D,Ee,Le,re.width,re.height),fe&&Ke(E,re,ve,Fe)):t.texImage2D(n.TEXTURE_2D,0,Le,re.width,re.height,0,ve,Fe,re.data);else if(E.isCompressedTexture)if(E.isCompressedArrayTexture){N&&ce&&t.texStorage3D(n.TEXTURE_2D_ARRAY,Ee,Le,Ge[0].width,Ge[0].height,re.depth);for(let ae=0,Q=Ge.length;ae<Q;ae++)if(ge=Ge[ae],E.format!==pn)if(ve!==null)if(N){if(fe)if(E.layerUpdates.size>0){const Ce=Cl(ge.width,ge.height,E.format,E.type);for(const He of E.layerUpdates){const pt=ge.data.subarray(He*Ce/ge.data.BYTES_PER_ELEMENT,(He+1)*Ce/ge.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,ae,0,0,He,ge.width,ge.height,1,ve,pt)}E.clearLayerUpdates()}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,ae,0,0,0,ge.width,ge.height,re.depth,ve,ge.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,ae,Le,ge.width,ge.height,re.depth,0,ge.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else N?fe&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,ae,0,0,0,ge.width,ge.height,re.depth,ve,Fe,ge.data):t.texImage3D(n.TEXTURE_2D_ARRAY,ae,Le,ge.width,ge.height,re.depth,0,ve,Fe,ge.data)}else{N&&ce&&t.texStorage2D(n.TEXTURE_2D,Ee,Le,Ge[0].width,Ge[0].height);for(let ae=0,Q=Ge.length;ae<Q;ae++)ge=Ge[ae],E.format!==pn?ve!==null?N?fe&&t.compressedTexSubImage2D(n.TEXTURE_2D,ae,0,0,ge.width,ge.height,ve,ge.data):t.compressedTexImage2D(n.TEXTURE_2D,ae,Le,ge.width,ge.height,0,ge.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):N?fe&&t.texSubImage2D(n.TEXTURE_2D,ae,0,0,ge.width,ge.height,ve,Fe,ge.data):t.texImage2D(n.TEXTURE_2D,ae,Le,ge.width,ge.height,0,ve,Fe,ge.data)}else if(E.isDataArrayTexture)if(N){if(ce&&t.texStorage3D(n.TEXTURE_2D_ARRAY,Ee,Le,re.width,re.height,re.depth),fe)if(E.layerUpdates.size>0){const ae=Cl(re.width,re.height,E.format,E.type);for(const Q of E.layerUpdates){const Ce=re.data.subarray(Q*ae/re.data.BYTES_PER_ELEMENT,(Q+1)*ae/re.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,Q,re.width,re.height,1,ve,Fe,Ce)}E.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,re.width,re.height,re.depth,ve,Fe,re.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,Le,re.width,re.height,re.depth,0,ve,Fe,re.data);else if(E.isData3DTexture)N?(ce&&t.texStorage3D(n.TEXTURE_3D,Ee,Le,re.width,re.height,re.depth),fe&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,re.width,re.height,re.depth,ve,Fe,re.data)):t.texImage3D(n.TEXTURE_3D,0,Le,re.width,re.height,re.depth,0,ve,Fe,re.data);else if(E.isFramebufferTexture){if(ce)if(N)t.texStorage2D(n.TEXTURE_2D,Ee,Le,re.width,re.height);else{let ae=re.width,Q=re.height;for(let Ce=0;Ce<Ee;Ce++)t.texImage2D(n.TEXTURE_2D,Ce,Le,ae,Q,0,ve,Fe,null),ae>>=1,Q>>=1}}else if(Ge.length>0){if(N&&ce){const ae=Be(Ge[0]);t.texStorage2D(n.TEXTURE_2D,Ee,Le,ae.width,ae.height)}for(let ae=0,Q=Ge.length;ae<Q;ae++)ge=Ge[ae],N?fe&&t.texSubImage2D(n.TEXTURE_2D,ae,0,0,ve,Fe,ge):t.texImage2D(n.TEXTURE_2D,ae,Le,ve,Fe,ge);E.generateMipmaps=!1}else if(N){if(ce){const ae=Be(re);t.texStorage2D(n.TEXTURE_2D,Ee,Le,ae.width,ae.height)}fe&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,ve,Fe,re)}else t.texImage2D(n.TEXTURE_2D,0,Le,ve,Fe,re);p(E)&&d(X),Pe.__version=j.version,E.onUpdate&&E.onUpdate(E)}P.__version=E.version}function ne(P,E,z){if(E.image.length!==6)return;const X=qe(P,E),ee=E.source;t.bindTexture(n.TEXTURE_CUBE_MAP,P.__webglTexture,n.TEXTURE0+z);const j=i.get(ee);if(ee.version!==j.__version||X===!0){t.activeTexture(n.TEXTURE0+z);const Pe=tt.getPrimaries(tt.workingColorSpace),he=E.colorSpace===qn?null:tt.getPrimaries(E.colorSpace),Ae=E.colorSpace===qn||Pe===he?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,E.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,E.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ae);const Re=E.isCompressedTexture||E.image[0].isCompressedTexture,re=E.image[0]&&E.image[0].isDataTexture,ve=[];for(let Q=0;Q<6;Q++)!Re&&!re?ve[Q]=v(E.image[Q],!0,s.maxCubemapSize):ve[Q]=re?E.image[Q].image:E.image[Q],ve[Q]=ke(E,ve[Q]);const Fe=ve[0],Le=r.convert(E.format,E.colorSpace),ge=r.convert(E.type),Ge=y(E.internalFormat,Le,ge,E.colorSpace),N=E.isVideoTexture!==!0,ce=j.__version===void 0||X===!0,fe=ee.dataReady;let Ee=w(E,Fe);Oe(n.TEXTURE_CUBE_MAP,E);let ae;if(Re){N&&ce&&t.texStorage2D(n.TEXTURE_CUBE_MAP,Ee,Ge,Fe.width,Fe.height);for(let Q=0;Q<6;Q++){ae=ve[Q].mipmaps;for(let Ce=0;Ce<ae.length;Ce++){const He=ae[Ce];E.format!==pn?Le!==null?N?fe&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Ce,0,0,He.width,He.height,Le,He.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Ce,Ge,He.width,He.height,0,He.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):N?fe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Ce,0,0,He.width,He.height,Le,ge,He.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Ce,Ge,He.width,He.height,0,Le,ge,He.data)}}}else{if(ae=E.mipmaps,N&&ce){ae.length>0&&Ee++;const Q=Be(ve[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,Ee,Ge,Q.width,Q.height)}for(let Q=0;Q<6;Q++)if(re){N?fe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,0,0,ve[Q].width,ve[Q].height,Le,ge,ve[Q].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,Ge,ve[Q].width,ve[Q].height,0,Le,ge,ve[Q].data);for(let Ce=0;Ce<ae.length;Ce++){const pt=ae[Ce].image[Q].image;N?fe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Ce+1,0,0,pt.width,pt.height,Le,ge,pt.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Ce+1,Ge,pt.width,pt.height,0,Le,ge,pt.data)}}else{N?fe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,0,0,Le,ge,ve[Q]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,0,Ge,Le,ge,ve[Q]);for(let Ce=0;Ce<ae.length;Ce++){const He=ae[Ce];N?fe&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Ce+1,0,0,Le,ge,He.image[Q]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+Q,Ce+1,Ge,Le,ge,He.image[Q])}}}p(E)&&d(n.TEXTURE_CUBE_MAP),j.__version=ee.version,E.onUpdate&&E.onUpdate(E)}P.__version=E.version}function Se(P,E,z,X,ee,j){const Pe=r.convert(z.format,z.colorSpace),he=r.convert(z.type),Ae=y(z.internalFormat,Pe,he,z.colorSpace),Re=i.get(E),re=i.get(z);if(re.__renderTarget=E,!Re.__hasExternalTextures){const ve=Math.max(1,E.width>>j),Fe=Math.max(1,E.height>>j);ee===n.TEXTURE_3D||ee===n.TEXTURE_2D_ARRAY?t.texImage3D(ee,j,Ae,ve,Fe,E.depth,0,Pe,he,null):t.texImage2D(ee,j,Ae,ve,Fe,0,Pe,he,null)}t.bindFramebuffer(n.FRAMEBUFFER,P),se(E)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,X,ee,re.__webglTexture,0,ue(E)):(ee===n.TEXTURE_2D||ee>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&ee<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,X,ee,re.__webglTexture,j),t.bindFramebuffer(n.FRAMEBUFFER,null)}function De(P,E,z){if(n.bindRenderbuffer(n.RENDERBUFFER,P),E.depthBuffer){const X=E.depthTexture,ee=X&&X.isDepthTexture?X.type:null,j=g(E.stencilBuffer,ee),Pe=E.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,he=ue(E);se(E)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,he,j,E.width,E.height):z?n.renderbufferStorageMultisample(n.RENDERBUFFER,he,j,E.width,E.height):n.renderbufferStorage(n.RENDERBUFFER,j,E.width,E.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,Pe,n.RENDERBUFFER,P)}else{const X=E.textures;for(let ee=0;ee<X.length;ee++){const j=X[ee],Pe=r.convert(j.format,j.colorSpace),he=r.convert(j.type),Ae=y(j.internalFormat,Pe,he,j.colorSpace),Re=ue(E);z&&se(E)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Re,Ae,E.width,E.height):se(E)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Re,Ae,E.width,E.height):n.renderbufferStorage(n.RENDERBUFFER,Ae,E.width,E.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function Te(P,E){if(E&&E.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(n.FRAMEBUFFER,P),!(E.depthTexture&&E.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const X=i.get(E.depthTexture);X.__renderTarget=E,(!X.__webglTexture||E.depthTexture.image.width!==E.width||E.depthTexture.image.height!==E.height)&&(E.depthTexture.image.width=E.width,E.depthTexture.image.height=E.height,E.depthTexture.needsUpdate=!0),k(E.depthTexture,0);const ee=X.__webglTexture,j=ue(E);if(E.depthTexture.format===Ss)se(E)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,ee,0,j):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,ee,0);else if(E.depthTexture.format===Es)se(E)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,ee,0,j):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,ee,0);else throw new Error("Unknown depthTexture format")}function Ye(P){const E=i.get(P),z=P.isWebGLCubeRenderTarget===!0;if(E.__boundDepthTexture!==P.depthTexture){const X=P.depthTexture;if(E.__depthDisposeCallback&&E.__depthDisposeCallback(),X){const ee=()=>{delete E.__boundDepthTexture,delete E.__depthDisposeCallback,X.removeEventListener("dispose",ee)};X.addEventListener("dispose",ee),E.__depthDisposeCallback=ee}E.__boundDepthTexture=X}if(P.depthTexture&&!E.__autoAllocateDepthBuffer){if(z)throw new Error("target.depthTexture not supported in Cube render targets");const X=P.texture.mipmaps;X&&X.length>0?Te(E.__webglFramebuffer[0],P):Te(E.__webglFramebuffer,P)}else if(z){E.__webglDepthbuffer=[];for(let X=0;X<6;X++)if(t.bindFramebuffer(n.FRAMEBUFFER,E.__webglFramebuffer[X]),E.__webglDepthbuffer[X]===void 0)E.__webglDepthbuffer[X]=n.createRenderbuffer(),De(E.__webglDepthbuffer[X],P,!1);else{const ee=P.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,j=E.__webglDepthbuffer[X];n.bindRenderbuffer(n.RENDERBUFFER,j),n.framebufferRenderbuffer(n.FRAMEBUFFER,ee,n.RENDERBUFFER,j)}}else{const X=P.texture.mipmaps;if(X&&X.length>0?t.bindFramebuffer(n.FRAMEBUFFER,E.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,E.__webglFramebuffer),E.__webglDepthbuffer===void 0)E.__webglDepthbuffer=n.createRenderbuffer(),De(E.__webglDepthbuffer,P,!1);else{const ee=P.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,j=E.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,j),n.framebufferRenderbuffer(n.FRAMEBUFFER,ee,n.RENDERBUFFER,j)}}t.bindFramebuffer(n.FRAMEBUFFER,null)}function ft(P,E,z){const X=i.get(P);E!==void 0&&Se(X.__webglFramebuffer,P,P.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),z!==void 0&&Ye(P)}function D(P){const E=P.texture,z=i.get(P),X=i.get(E);P.addEventListener("dispose",S);const ee=P.textures,j=P.isWebGLCubeRenderTarget===!0,Pe=ee.length>1;if(Pe||(X.__webglTexture===void 0&&(X.__webglTexture=n.createTexture()),X.__version=E.version,a.memory.textures++),j){z.__webglFramebuffer=[];for(let he=0;he<6;he++)if(E.mipmaps&&E.mipmaps.length>0){z.__webglFramebuffer[he]=[];for(let Ae=0;Ae<E.mipmaps.length;Ae++)z.__webglFramebuffer[he][Ae]=n.createFramebuffer()}else z.__webglFramebuffer[he]=n.createFramebuffer()}else{if(E.mipmaps&&E.mipmaps.length>0){z.__webglFramebuffer=[];for(let he=0;he<E.mipmaps.length;he++)z.__webglFramebuffer[he]=n.createFramebuffer()}else z.__webglFramebuffer=n.createFramebuffer();if(Pe)for(let he=0,Ae=ee.length;he<Ae;he++){const Re=i.get(ee[he]);Re.__webglTexture===void 0&&(Re.__webglTexture=n.createTexture(),a.memory.textures++)}if(P.samples>0&&se(P)===!1){z.__webglMultisampledFramebuffer=n.createFramebuffer(),z.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,z.__webglMultisampledFramebuffer);for(let he=0;he<ee.length;he++){const Ae=ee[he];z.__webglColorRenderbuffer[he]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,z.__webglColorRenderbuffer[he]);const Re=r.convert(Ae.format,Ae.colorSpace),re=r.convert(Ae.type),ve=y(Ae.internalFormat,Re,re,Ae.colorSpace,P.isXRRenderTarget===!0),Fe=ue(P);n.renderbufferStorageMultisample(n.RENDERBUFFER,Fe,ve,P.width,P.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+he,n.RENDERBUFFER,z.__webglColorRenderbuffer[he])}n.bindRenderbuffer(n.RENDERBUFFER,null),P.depthBuffer&&(z.__webglDepthRenderbuffer=n.createRenderbuffer(),De(z.__webglDepthRenderbuffer,P,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(j){t.bindTexture(n.TEXTURE_CUBE_MAP,X.__webglTexture),Oe(n.TEXTURE_CUBE_MAP,E);for(let he=0;he<6;he++)if(E.mipmaps&&E.mipmaps.length>0)for(let Ae=0;Ae<E.mipmaps.length;Ae++)Se(z.__webglFramebuffer[he][Ae],P,E,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+he,Ae);else Se(z.__webglFramebuffer[he],P,E,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+he,0);p(E)&&d(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Pe){for(let he=0,Ae=ee.length;he<Ae;he++){const Re=ee[he],re=i.get(Re);let ve=n.TEXTURE_2D;(P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(ve=P.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(ve,re.__webglTexture),Oe(ve,Re),Se(z.__webglFramebuffer,P,Re,n.COLOR_ATTACHMENT0+he,ve,0),p(Re)&&d(ve)}t.unbindTexture()}else{let he=n.TEXTURE_2D;if((P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(he=P.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(he,X.__webglTexture),Oe(he,E),E.mipmaps&&E.mipmaps.length>0)for(let Ae=0;Ae<E.mipmaps.length;Ae++)Se(z.__webglFramebuffer[Ae],P,E,n.COLOR_ATTACHMENT0,he,Ae);else Se(z.__webglFramebuffer,P,E,n.COLOR_ATTACHMENT0,he,0);p(E)&&d(he),t.unbindTexture()}P.depthBuffer&&Ye(P)}function te(P){const E=P.textures;for(let z=0,X=E.length;z<X;z++){const ee=E[z];if(p(ee)){const j=x(P),Pe=i.get(ee).__webglTexture;t.bindTexture(j,Pe),d(j),t.unbindTexture()}}}const K=[],J=[];function Z(P){if(P.samples>0){if(se(P)===!1){const E=P.textures,z=P.width,X=P.height;let ee=n.COLOR_BUFFER_BIT;const j=P.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Pe=i.get(P),he=E.length>1;if(he)for(let Re=0;Re<E.length;Re++)t.bindFramebuffer(n.FRAMEBUFFER,Pe.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Re,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,Pe.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Re,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,Pe.__webglMultisampledFramebuffer);const Ae=P.texture.mipmaps;Ae&&Ae.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Pe.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Pe.__webglFramebuffer);for(let Re=0;Re<E.length;Re++){if(P.resolveDepthBuffer&&(P.depthBuffer&&(ee|=n.DEPTH_BUFFER_BIT),P.stencilBuffer&&P.resolveStencilBuffer&&(ee|=n.STENCIL_BUFFER_BIT)),he){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,Pe.__webglColorRenderbuffer[Re]);const re=i.get(E[Re]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,re,0)}n.blitFramebuffer(0,0,z,X,0,0,z,X,ee,n.NEAREST),l===!0&&(K.length=0,J.length=0,K.push(n.COLOR_ATTACHMENT0+Re),P.depthBuffer&&P.resolveDepthBuffer===!1&&(K.push(j),J.push(j),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,J)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,K))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),he)for(let Re=0;Re<E.length;Re++){t.bindFramebuffer(n.FRAMEBUFFER,Pe.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+Re,n.RENDERBUFFER,Pe.__webglColorRenderbuffer[Re]);const re=i.get(E[Re]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,Pe.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+Re,n.TEXTURE_2D,re,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,Pe.__webglMultisampledFramebuffer)}else if(P.depthBuffer&&P.resolveDepthBuffer===!1&&l){const E=P.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[E])}}}function ue(P){return Math.min(s.maxSamples,P.samples)}function se(P){const E=i.get(P);return P.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&E.__useRenderToTexture!==!1}function de(P){const E=a.render.frame;h.get(P)!==E&&(h.set(P,E),P.update())}function ke(P,E){const z=P.colorSpace,X=P.format,ee=P.type;return P.isCompressedTexture===!0||P.isVideoTexture===!0||z!==qi&&z!==qn&&(tt.getTransfer(z)===rt?(X!==pn||ee!==wn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",z)),E}function Be(P){return typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement?(c.width=P.naturalWidth||P.width,c.height=P.naturalHeight||P.height):typeof VideoFrame<"u"&&P instanceof VideoFrame?(c.width=P.displayWidth,c.height=P.displayHeight):(c.width=P.width,c.height=P.height),c}this.allocateTextureUnit=B,this.resetTextureUnits=I,this.setTexture2D=k,this.setTexture2DArray=W,this.setTexture3D=q,this.setTextureCube=$,this.rebindTextures=ft,this.setupRenderTarget=D,this.updateRenderTargetMipmap=te,this.updateMultisampleRenderTarget=Z,this.setupDepthRenderbuffer=Ye,this.setupFrameBufferTexture=Se,this.useMultisampledRTT=se}function O_(n,e){function t(i,s=qn){let r;const a=tt.getTransfer(s);if(i===wn)return n.UNSIGNED_BYTE;if(i===Eo)return n.UNSIGNED_SHORT_4_4_4_4;if(i===wo)return n.UNSIGNED_SHORT_5_5_5_1;if(i===Ec)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===wc)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===Mc)return n.BYTE;if(i===Sc)return n.SHORT;if(i===bs)return n.UNSIGNED_SHORT;if(i===So)return n.INT;if(i===vi)return n.UNSIGNED_INT;if(i===On)return n.FLOAT;if(i===Cs)return n.HALF_FLOAT;if(i===Tc)return n.ALPHA;if(i===Ac)return n.RGB;if(i===pn)return n.RGBA;if(i===Ss)return n.DEPTH_COMPONENT;if(i===Es)return n.DEPTH_STENCIL;if(i===Rc)return n.RED;if(i===To)return n.RED_INTEGER;if(i===Cc)return n.RG;if(i===Ao)return n.RG_INTEGER;if(i===Ro)return n.RGBA_INTEGER;if(i===gr||i===_r||i===vr||i===xr)if(a===rt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===gr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===_r)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===vr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===xr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===gr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===_r)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===vr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===xr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===za||i===Ba||i===ka||i===Ha)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===za)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Ba)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===ka)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Ha)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Va||i===Ga||i===Wa)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(i===Va||i===Ga)return a===rt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===Wa)return a===rt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===$a||i===Xa||i===ja||i===qa||i===Ya||i===Za||i===Ja||i===Ka||i===Qa||i===eo||i===to||i===no||i===io||i===so)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(i===$a)return a===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Xa)return a===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===ja)return a===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===qa)return a===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Ya)return a===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Za)return a===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Ja)return a===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Ka)return a===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Qa)return a===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===eo)return a===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===to)return a===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===no)return a===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===io)return a===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===so)return a===rt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===ro||i===ao||i===oo)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(i===ro)return a===rt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===ao)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===oo)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===lo||i===co||i===ho||i===uo)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(i===lo)return r.COMPRESSED_RED_RGTC1_EXT;if(i===co)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===ho)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===uo)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Ms?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}const z_=`
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

}`;class k_{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const i=new Hc(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,i=new Kn({vertexShader:z_,fragmentShader:B_,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new ye(new Ls(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class H_ extends bi{constructor(e,t){super();const i=this;let s=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,u=null,f=null,m=null,_=null;const v=typeof XRWebGLBinding<"u",p=new k_,d={},x=t.getContextAttributes();let y=null,g=null;const w=[],T=[],S=new oe;let R=null;const M=new ln;M.viewport=new wt;const b=new ln;b.viewport=new wt;const C=[M,b],I=new af;let B=null,H=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let ne=w[Y];return ne===void 0&&(ne=new aa,w[Y]=ne),ne.getTargetRaySpace()},this.getControllerGrip=function(Y){let ne=w[Y];return ne===void 0&&(ne=new aa,w[Y]=ne),ne.getGripSpace()},this.getHand=function(Y){let ne=w[Y];return ne===void 0&&(ne=new aa,w[Y]=ne),ne.getHandSpace()};function k(Y){const ne=T.indexOf(Y.inputSource);if(ne===-1)return;const Se=w[ne];Se!==void 0&&(Se.update(Y.inputSource,Y.frame,c||a),Se.dispatchEvent({type:Y.type,data:Y.inputSource}))}function W(){s.removeEventListener("select",k),s.removeEventListener("selectstart",k),s.removeEventListener("selectend",k),s.removeEventListener("squeeze",k),s.removeEventListener("squeezestart",k),s.removeEventListener("squeezeend",k),s.removeEventListener("end",W),s.removeEventListener("inputsourceschange",q);for(let Y=0;Y<w.length;Y++){const ne=T[Y];ne!==null&&(T[Y]=null,w[Y].disconnect(ne))}B=null,H=null,p.reset();for(const Y in d)delete d[Y];e.setRenderTarget(y),m=null,f=null,u=null,s=null,g=null,Ke.stop(),i.isPresenting=!1,e.setPixelRatio(R),e.setSize(S.width,S.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){r=Y,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){o=Y,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(Y){c=Y},this.getBaseLayer=function(){return f!==null?f:m},this.getBinding=function(){return u===null&&v&&(u=new XRWebGLBinding(s,t)),u},this.getFrame=function(){return _},this.getSession=function(){return s},this.setSession=async function(Y){if(s=Y,s!==null){if(y=e.getRenderTarget(),s.addEventListener("select",k),s.addEventListener("selectstart",k),s.addEventListener("selectend",k),s.addEventListener("squeeze",k),s.addEventListener("squeezestart",k),s.addEventListener("squeezeend",k),s.addEventListener("end",W),s.addEventListener("inputsourceschange",q),x.xrCompatible!==!0&&await t.makeXRCompatible(),R=e.getPixelRatio(),e.getSize(S),v&&"createProjectionLayer"in XRWebGLBinding.prototype){let Se=null,De=null,Te=null;x.depth&&(Te=x.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Se=x.stencil?Es:Ss,De=x.stencil?Ms:vi);const Ye={colorFormat:t.RGBA8,depthFormat:Te,scaleFactor:r};u=this.getBinding(),f=u.createProjectionLayer(Ye),s.updateRenderState({layers:[f]}),e.setPixelRatio(1),e.setSize(f.textureWidth,f.textureHeight,!1),g=new xi(f.textureWidth,f.textureHeight,{format:pn,type:wn,depthTexture:new kc(f.textureWidth,f.textureHeight,De,void 0,void 0,void 0,void 0,void 0,void 0,Se),stencilBuffer:x.stencil,colorSpace:e.outputColorSpace,samples:x.antialias?4:0,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}else{const Se={antialias:x.antialias,alpha:!0,depth:x.depth,stencil:x.stencil,framebufferScaleFactor:r};m=new XRWebGLLayer(s,t,Se),s.updateRenderState({baseLayer:m}),e.setPixelRatio(1),e.setSize(m.framebufferWidth,m.framebufferHeight,!1),g=new xi(m.framebufferWidth,m.framebufferHeight,{format:pn,type:wn,colorSpace:e.outputColorSpace,stencilBuffer:x.stencil,resolveDepthBuffer:m.ignoreDepthValues===!1,resolveStencilBuffer:m.ignoreDepthValues===!1})}g.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await s.requestReferenceSpace(o),Ke.setContext(s),Ke.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return p.getDepthTexture()};function q(Y){for(let ne=0;ne<Y.removed.length;ne++){const Se=Y.removed[ne],De=T.indexOf(Se);De>=0&&(T[De]=null,w[De].disconnect(Se))}for(let ne=0;ne<Y.added.length;ne++){const Se=Y.added[ne];let De=T.indexOf(Se);if(De===-1){for(let Ye=0;Ye<w.length;Ye++)if(Ye>=T.length){T.push(Se),De=Ye;break}else if(T[Ye]===null){T[Ye]=Se,De=Ye;break}if(De===-1)break}const Te=w[De];Te&&Te.connect(Se)}}const $=new L,ie=new L;function pe(Y,ne,Se){$.setFromMatrixPosition(ne.matrixWorld),ie.setFromMatrixPosition(Se.matrixWorld);const De=$.distanceTo(ie),Te=ne.projectionMatrix.elements,Ye=Se.projectionMatrix.elements,ft=Te[14]/(Te[10]-1),D=Te[14]/(Te[10]+1),te=(Te[9]+1)/Te[5],K=(Te[9]-1)/Te[5],J=(Te[8]-1)/Te[0],Z=(Ye[8]+1)/Ye[0],ue=ft*J,se=ft*Z,de=De/(-J+Z),ke=de*-J;if(ne.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(ke),Y.translateZ(de),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),Te[10]===-1)Y.projectionMatrix.copy(ne.projectionMatrix),Y.projectionMatrixInverse.copy(ne.projectionMatrixInverse);else{const Be=ft+de,P=D+de,E=ue-ke,z=se+(De-ke),X=te*D/P*Be,ee=K*D/P*Be;Y.projectionMatrix.makePerspective(E,z,X,ee,Be,P),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function be(Y,ne){ne===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(ne.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(s===null)return;let ne=Y.near,Se=Y.far;p.texture!==null&&(p.depthNear>0&&(ne=p.depthNear),p.depthFar>0&&(Se=p.depthFar)),I.near=b.near=M.near=ne,I.far=b.far=M.far=Se,(B!==I.near||H!==I.far)&&(s.updateRenderState({depthNear:I.near,depthFar:I.far}),B=I.near,H=I.far),I.layers.mask=Y.layers.mask|6,M.layers.mask=I.layers.mask&3,b.layers.mask=I.layers.mask&5;const De=Y.parent,Te=I.cameras;be(I,De);for(let Ye=0;Ye<Te.length;Ye++)be(Te[Ye],De);Te.length===2?pe(I,M,b):I.projectionMatrix.copy(M.projectionMatrix),Oe(Y,I,De)};function Oe(Y,ne,Se){Se===null?Y.matrix.copy(ne.matrixWorld):(Y.matrix.copy(Se.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(ne.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(ne.projectionMatrix),Y.projectionMatrixInverse.copy(ne.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=fo*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return I},this.getFoveation=function(){if(!(f===null&&m===null))return l},this.setFoveation=function(Y){l=Y,f!==null&&(f.fixedFoveation=Y),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=Y)},this.hasDepthSensing=function(){return p.texture!==null},this.getDepthSensingMesh=function(){return p.getMesh(I)},this.getCameraTexture=function(Y){return d[Y]};let qe=null;function Qe(Y,ne){if(h=ne.getViewerPose(c||a),_=ne,h!==null){const Se=h.views;m!==null&&(e.setRenderTargetFramebuffer(g,m.framebuffer),e.setRenderTarget(g));let De=!1;Se.length!==I.cameras.length&&(I.cameras.length=0,De=!0);for(let D=0;D<Se.length;D++){const te=Se[D];let K=null;if(m!==null)K=m.getViewport(te);else{const Z=u.getViewSubImage(f,te);K=Z.viewport,D===0&&(e.setRenderTargetTextures(g,Z.colorTexture,Z.depthStencilTexture),e.setRenderTarget(g))}let J=C[D];J===void 0&&(J=new ln,J.layers.enable(D),J.viewport=new wt,C[D]=J),J.matrix.fromArray(te.transform.matrix),J.matrix.decompose(J.position,J.quaternion,J.scale),J.projectionMatrix.fromArray(te.projectionMatrix),J.projectionMatrixInverse.copy(J.projectionMatrix).invert(),J.viewport.set(K.x,K.y,K.width,K.height),D===0&&(I.matrix.copy(J.matrix),I.matrix.decompose(I.position,I.quaternion,I.scale)),De===!0&&I.cameras.push(J)}const Te=s.enabledFeatures;if(Te&&Te.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&v){u=i.getBinding();const D=u.getDepthInformation(Se[0]);D&&D.isValid&&D.texture&&p.init(D,s.renderState)}if(Te&&Te.includes("camera-access")&&v){e.state.unbindTexture(),u=i.getBinding();for(let D=0;D<Se.length;D++){const te=Se[D].camera;if(te){let K=d[te];K||(K=new Hc,d[te]=K);const J=u.getCameraImage(te);K.sourceTexture=J}}}}for(let Se=0;Se<w.length;Se++){const De=T[Se],Te=w[Se];De!==null&&Te!==void 0&&Te.update(De,ne,c||a)}qe&&qe(Y,ne),ne.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:ne}),_=null}const Ke=new eh;Ke.setAnimationLoop(Qe),this.setAnimationLoop=function(Y){qe=Y},this.dispose=function(){}}}const li=new gn,V_=new ct;function G_(n,e){function t(p,d){p.matrixAutoUpdate===!0&&p.updateMatrix(),d.value.copy(p.matrix)}function i(p,d){d.color.getRGB(p.fogColor.value,Oc(n)),d.isFog?(p.fogNear.value=d.near,p.fogFar.value=d.far):d.isFogExp2&&(p.fogDensity.value=d.density)}function s(p,d,x,y,g){d.isMeshBasicMaterial||d.isMeshLambertMaterial?r(p,d):d.isMeshToonMaterial?(r(p,d),u(p,d)):d.isMeshPhongMaterial?(r(p,d),h(p,d)):d.isMeshStandardMaterial?(r(p,d),f(p,d),d.isMeshPhysicalMaterial&&m(p,d,g)):d.isMeshMatcapMaterial?(r(p,d),_(p,d)):d.isMeshDepthMaterial?r(p,d):d.isMeshDistanceMaterial?(r(p,d),v(p,d)):d.isMeshNormalMaterial?r(p,d):d.isLineBasicMaterial?(a(p,d),d.isLineDashedMaterial&&o(p,d)):d.isPointsMaterial?l(p,d,x,y):d.isSpriteMaterial?c(p,d):d.isShadowMaterial?(p.color.value.copy(d.color),p.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function r(p,d){p.opacity.value=d.opacity,d.color&&p.diffuse.value.copy(d.color),d.emissive&&p.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(p.map.value=d.map,t(d.map,p.mapTransform)),d.alphaMap&&(p.alphaMap.value=d.alphaMap,t(d.alphaMap,p.alphaMapTransform)),d.bumpMap&&(p.bumpMap.value=d.bumpMap,t(d.bumpMap,p.bumpMapTransform),p.bumpScale.value=d.bumpScale,d.side===Zt&&(p.bumpScale.value*=-1)),d.normalMap&&(p.normalMap.value=d.normalMap,t(d.normalMap,p.normalMapTransform),p.normalScale.value.copy(d.normalScale),d.side===Zt&&p.normalScale.value.negate()),d.displacementMap&&(p.displacementMap.value=d.displacementMap,t(d.displacementMap,p.displacementMapTransform),p.displacementScale.value=d.displacementScale,p.displacementBias.value=d.displacementBias),d.emissiveMap&&(p.emissiveMap.value=d.emissiveMap,t(d.emissiveMap,p.emissiveMapTransform)),d.specularMap&&(p.specularMap.value=d.specularMap,t(d.specularMap,p.specularMapTransform)),d.alphaTest>0&&(p.alphaTest.value=d.alphaTest);const x=e.get(d),y=x.envMap,g=x.envMapRotation;y&&(p.envMap.value=y,li.copy(g),li.x*=-1,li.y*=-1,li.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(li.y*=-1,li.z*=-1),p.envMapRotation.value.setFromMatrix4(V_.makeRotationFromEuler(li)),p.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=d.reflectivity,p.ior.value=d.ior,p.refractionRatio.value=d.refractionRatio),d.lightMap&&(p.lightMap.value=d.lightMap,p.lightMapIntensity.value=d.lightMapIntensity,t(d.lightMap,p.lightMapTransform)),d.aoMap&&(p.aoMap.value=d.aoMap,p.aoMapIntensity.value=d.aoMapIntensity,t(d.aoMap,p.aoMapTransform))}function a(p,d){p.diffuse.value.copy(d.color),p.opacity.value=d.opacity,d.map&&(p.map.value=d.map,t(d.map,p.mapTransform))}function o(p,d){p.dashSize.value=d.dashSize,p.totalSize.value=d.dashSize+d.gapSize,p.scale.value=d.scale}function l(p,d,x,y){p.diffuse.value.copy(d.color),p.opacity.value=d.opacity,p.size.value=d.size*x,p.scale.value=y*.5,d.map&&(p.map.value=d.map,t(d.map,p.uvTransform)),d.alphaMap&&(p.alphaMap.value=d.alphaMap,t(d.alphaMap,p.alphaMapTransform)),d.alphaTest>0&&(p.alphaTest.value=d.alphaTest)}function c(p,d){p.diffuse.value.copy(d.color),p.opacity.value=d.opacity,p.rotation.value=d.rotation,d.map&&(p.map.value=d.map,t(d.map,p.mapTransform)),d.alphaMap&&(p.alphaMap.value=d.alphaMap,t(d.alphaMap,p.alphaMapTransform)),d.alphaTest>0&&(p.alphaTest.value=d.alphaTest)}function h(p,d){p.specular.value.copy(d.specular),p.shininess.value=Math.max(d.shininess,1e-4)}function u(p,d){d.gradientMap&&(p.gradientMap.value=d.gradientMap)}function f(p,d){p.metalness.value=d.metalness,d.metalnessMap&&(p.metalnessMap.value=d.metalnessMap,t(d.metalnessMap,p.metalnessMapTransform)),p.roughness.value=d.roughness,d.roughnessMap&&(p.roughnessMap.value=d.roughnessMap,t(d.roughnessMap,p.roughnessMapTransform)),d.envMap&&(p.envMapIntensity.value=d.envMapIntensity)}function m(p,d,x){p.ior.value=d.ior,d.sheen>0&&(p.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),p.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(p.sheenColorMap.value=d.sheenColorMap,t(d.sheenColorMap,p.sheenColorMapTransform)),d.sheenRoughnessMap&&(p.sheenRoughnessMap.value=d.sheenRoughnessMap,t(d.sheenRoughnessMap,p.sheenRoughnessMapTransform))),d.clearcoat>0&&(p.clearcoat.value=d.clearcoat,p.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(p.clearcoatMap.value=d.clearcoatMap,t(d.clearcoatMap,p.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,t(d.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(p.clearcoatNormalMap.value=d.clearcoatNormalMap,t(d.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===Zt&&p.clearcoatNormalScale.value.negate())),d.dispersion>0&&(p.dispersion.value=d.dispersion),d.iridescence>0&&(p.iridescence.value=d.iridescence,p.iridescenceIOR.value=d.iridescenceIOR,p.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(p.iridescenceMap.value=d.iridescenceMap,t(d.iridescenceMap,p.iridescenceMapTransform)),d.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=d.iridescenceThicknessMap,t(d.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),d.transmission>0&&(p.transmission.value=d.transmission,p.transmissionSamplerMap.value=x.texture,p.transmissionSamplerSize.value.set(x.width,x.height),d.transmissionMap&&(p.transmissionMap.value=d.transmissionMap,t(d.transmissionMap,p.transmissionMapTransform)),p.thickness.value=d.thickness,d.thicknessMap&&(p.thicknessMap.value=d.thicknessMap,t(d.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=d.attenuationDistance,p.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(p.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(p.anisotropyMap.value=d.anisotropyMap,t(d.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=d.specularIntensity,p.specularColor.value.copy(d.specularColor),d.specularColorMap&&(p.specularColorMap.value=d.specularColorMap,t(d.specularColorMap,p.specularColorMapTransform)),d.specularIntensityMap&&(p.specularIntensityMap.value=d.specularIntensityMap,t(d.specularIntensityMap,p.specularIntensityMapTransform))}function _(p,d){d.matcap&&(p.matcap.value=d.matcap)}function v(p,d){const x=e.get(d).light;p.referencePosition.value.setFromMatrixPosition(x.matrixWorld),p.nearDistance.value=x.shadow.camera.near,p.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function W_(n,e,t,i){let s={},r={},a=[];const o=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(x,y){const g=y.program;i.uniformBlockBinding(x,g)}function c(x,y){let g=s[x.id];g===void 0&&(_(x),g=h(x),s[x.id]=g,x.addEventListener("dispose",p));const w=y.program;i.updateUBOMapping(x,w);const T=e.render.frame;r[x.id]!==T&&(f(x),r[x.id]=T)}function h(x){const y=u();x.__bindingPointIndex=y;const g=n.createBuffer(),w=x.__size,T=x.usage;return n.bindBuffer(n.UNIFORM_BUFFER,g),n.bufferData(n.UNIFORM_BUFFER,w,T),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,y,g),g}function u(){for(let x=0;x<o;x++)if(a.indexOf(x)===-1)return a.push(x),x;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function f(x){const y=s[x.id],g=x.uniforms,w=x.__cache;n.bindBuffer(n.UNIFORM_BUFFER,y);for(let T=0,S=g.length;T<S;T++){const R=Array.isArray(g[T])?g[T]:[g[T]];for(let M=0,b=R.length;M<b;M++){const C=R[M];if(m(C,T,M,w)===!0){const I=C.__offset,B=Array.isArray(C.value)?C.value:[C.value];let H=0;for(let k=0;k<B.length;k++){const W=B[k],q=v(W);typeof W=="number"||typeof W=="boolean"?(C.__data[0]=W,n.bufferSubData(n.UNIFORM_BUFFER,I+H,C.__data)):W.isMatrix3?(C.__data[0]=W.elements[0],C.__data[1]=W.elements[1],C.__data[2]=W.elements[2],C.__data[3]=0,C.__data[4]=W.elements[3],C.__data[5]=W.elements[4],C.__data[6]=W.elements[5],C.__data[7]=0,C.__data[8]=W.elements[6],C.__data[9]=W.elements[7],C.__data[10]=W.elements[8],C.__data[11]=0):(W.toArray(C.__data,H),H+=q.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,I,C.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function m(x,y,g,w){const T=x.value,S=y+"_"+g;if(w[S]===void 0)return typeof T=="number"||typeof T=="boolean"?w[S]=T:w[S]=T.clone(),!0;{const R=w[S];if(typeof T=="number"||typeof T=="boolean"){if(R!==T)return w[S]=T,!0}else if(R.equals(T)===!1)return R.copy(T),!0}return!1}function _(x){const y=x.uniforms;let g=0;const w=16;for(let S=0,R=y.length;S<R;S++){const M=Array.isArray(y[S])?y[S]:[y[S]];for(let b=0,C=M.length;b<C;b++){const I=M[b],B=Array.isArray(I.value)?I.value:[I.value];for(let H=0,k=B.length;H<k;H++){const W=B[H],q=v(W),$=g%w,ie=$%q.boundary,pe=$+ie;g+=ie,pe!==0&&w-pe<q.storage&&(g+=w-pe),I.__data=new Float32Array(q.storage/Float32Array.BYTES_PER_ELEMENT),I.__offset=g,g+=q.storage}}}const T=g%w;return T>0&&(g+=w-T),x.__size=g,x.__cache={},this}function v(x){const y={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(y.boundary=4,y.storage=4):x.isVector2?(y.boundary=8,y.storage=8):x.isVector3||x.isColor?(y.boundary=16,y.storage=12):x.isVector4?(y.boundary=16,y.storage=16):x.isMatrix3?(y.boundary=48,y.storage=48):x.isMatrix4?(y.boundary=64,y.storage=64):x.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",x),y}function p(x){const y=x.target;y.removeEventListener("dispose",p);const g=a.indexOf(y.__bindingPointIndex);a.splice(g,1),n.deleteBuffer(s[y.id]),delete s[y.id],delete r[y.id]}function d(){for(const x in s)n.deleteBuffer(s[x]);a=[],s={},r={}}return{bind:l,update:c,dispose:d}}class $_{constructor(e={}){const{canvas:t=Gu(),context:i=null,depth:s=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:f=!1}=e;this.isWebGLRenderer=!0;let m;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");m=i.getContextAttributes().alpha}else m=a;const _=new Uint32Array(4),v=new Int32Array(4);let p=null,d=null;const x=[],y=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Zn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const g=this;let w=!1;this._outputColorSpace=on;let T=0,S=0,R=null,M=-1,b=null;const C=new wt,I=new wt;let B=null;const H=new je(0);let k=0,W=t.width,q=t.height,$=1,ie=null,pe=null;const be=new wt(0,0,W,q),Oe=new wt(0,0,W,q);let qe=!1;const Qe=new Lo;let Ke=!1,Y=!1;const ne=new ct,Se=new L,De=new wt,Te={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Ye=!1;function ft(){return R===null?$:1}let D=i;function te(A,F){return t.getContext(A,F)}try{const A={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Mo}`),t.addEventListener("webglcontextlost",fe,!1),t.addEventListener("webglcontextrestored",Ee,!1),t.addEventListener("webglcontextcreationerror",ae,!1),D===null){const F="webgl2";if(D=te(F,A),D===null)throw te(F)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(A){throw console.error("THREE.WebGLRenderer: "+A.message),A}let K,J,Z,ue,se,de,ke,Be,P,E,z,X,ee,j,Pe,he,Ae,Re,re,ve,Fe,Le,ge,Ge;function N(){K=new tg(D),K.init(),Le=new O_(D,K),J=new qm(D,K,e,Le),Z=new N_(D,K),J.reversedDepthBuffer&&f&&Z.buffers.depth.setReversed(!0),ue=new sg(D),se=new M_,de=new F_(D,K,Z,se,J,Le,ue),ke=new Zm(g),Be=new eg(g),P=new hf(D),ge=new Xm(D,P),E=new ng(D,P,ue,ge),z=new ag(D,E,P,ue),re=new rg(D,J,de),he=new Ym(se),X=new b_(g,ke,Be,K,J,ge,he),ee=new G_(g,se),j=new E_,Pe=new P_(K),Re=new $m(g,ke,Be,Z,z,m,l),Ae=new I_(g,z,J),Ge=new W_(D,ue,J,Z),ve=new jm(D,K,ue),Fe=new ig(D,K,ue),ue.programs=X.programs,g.capabilities=J,g.extensions=K,g.properties=se,g.renderLists=j,g.shadowMap=Ae,g.state=Z,g.info=ue}N();const ce=new H_(g,D);this.xr=ce,this.getContext=function(){return D},this.getContextAttributes=function(){return D.getContextAttributes()},this.forceContextLoss=function(){const A=K.get("WEBGL_lose_context");A&&A.loseContext()},this.forceContextRestore=function(){const A=K.get("WEBGL_lose_context");A&&A.restoreContext()},this.getPixelRatio=function(){return $},this.setPixelRatio=function(A){A!==void 0&&($=A,this.setSize(W,q,!1))},this.getSize=function(A){return A.set(W,q)},this.setSize=function(A,F,V=!0){if(ce.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}W=A,q=F,t.width=Math.floor(A*$),t.height=Math.floor(F*$),V===!0&&(t.style.width=A+"px",t.style.height=F+"px"),this.setViewport(0,0,A,F)},this.getDrawingBufferSize=function(A){return A.set(W*$,q*$).floor()},this.setDrawingBufferSize=function(A,F,V){W=A,q=F,$=V,t.width=Math.floor(A*V),t.height=Math.floor(F*V),this.setViewport(0,0,A,F)},this.getCurrentViewport=function(A){return A.copy(C)},this.getViewport=function(A){return A.copy(be)},this.setViewport=function(A,F,V,G){A.isVector4?be.set(A.x,A.y,A.z,A.w):be.set(A,F,V,G),Z.viewport(C.copy(be).multiplyScalar($).round())},this.getScissor=function(A){return A.copy(Oe)},this.setScissor=function(A,F,V,G){A.isVector4?Oe.set(A.x,A.y,A.z,A.w):Oe.set(A,F,V,G),Z.scissor(I.copy(Oe).multiplyScalar($).round())},this.getScissorTest=function(){return qe},this.setScissorTest=function(A){Z.setScissorTest(qe=A)},this.setOpaqueSort=function(A){ie=A},this.setTransparentSort=function(A){pe=A},this.getClearColor=function(A){return A.copy(Re.getClearColor())},this.setClearColor=function(){Re.setClearColor(...arguments)},this.getClearAlpha=function(){return Re.getClearAlpha()},this.setClearAlpha=function(){Re.setClearAlpha(...arguments)},this.clear=function(A=!0,F=!0,V=!0){let G=0;if(A){let O=!1;if(R!==null){const le=R.texture.format;O=le===Ro||le===Ao||le===To}if(O){const le=R.texture.type,_e=le===wn||le===vi||le===bs||le===Ms||le===Eo||le===wo,we=Re.getClearColor(),Me=Re.getClearAlpha(),Ne=we.r,ze=we.g,Ie=we.b;_e?(_[0]=Ne,_[1]=ze,_[2]=Ie,_[3]=Me,D.clearBufferuiv(D.COLOR,0,_)):(v[0]=Ne,v[1]=ze,v[2]=Ie,v[3]=Me,D.clearBufferiv(D.COLOR,0,v))}else G|=D.COLOR_BUFFER_BIT}F&&(G|=D.DEPTH_BUFFER_BIT),V&&(G|=D.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),D.clear(G)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",fe,!1),t.removeEventListener("webglcontextrestored",Ee,!1),t.removeEventListener("webglcontextcreationerror",ae,!1),Re.dispose(),j.dispose(),Pe.dispose(),se.dispose(),ke.dispose(),Be.dispose(),z.dispose(),ge.dispose(),Ge.dispose(),X.dispose(),ce.dispose(),ce.removeEventListener("sessionstart",_n),ce.removeEventListener("sessionend",Bo),ti.stop()};function fe(A){A.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),w=!0}function Ee(){console.log("THREE.WebGLRenderer: Context Restored."),w=!1;const A=ue.autoReset,F=Ae.enabled,V=Ae.autoUpdate,G=Ae.needsUpdate,O=Ae.type;N(),ue.autoReset=A,Ae.enabled=F,Ae.autoUpdate=V,Ae.needsUpdate=G,Ae.type=O}function ae(A){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",A.statusMessage)}function Q(A){const F=A.target;F.removeEventListener("dispose",Q),Ce(F)}function Ce(A){He(A),se.remove(A)}function He(A){const F=se.get(A).programs;F!==void 0&&(F.forEach(function(V){X.releaseProgram(V)}),A.isShaderMaterial&&X.releaseShaderCache(A))}this.renderBufferDirect=function(A,F,V,G,O,le){F===null&&(F=Te);const _e=O.isMesh&&O.matrixWorld.determinant()<0,we=ph(A,F,V,G,O);Z.setMaterial(G,_e);let Me=V.index,Ne=1;if(G.wireframe===!0){if(Me=E.getWireframeAttribute(V),Me===void 0)return;Ne=2}const ze=V.drawRange,Ie=V.attributes.position;let Ze=ze.start*Ne,st=(ze.start+ze.count)*Ne;le!==null&&(Ze=Math.max(Ze,le.start*Ne),st=Math.min(st,(le.start+le.count)*Ne)),Me!==null?(Ze=Math.max(Ze,0),st=Math.min(st,Me.count)):Ie!=null&&(Ze=Math.max(Ze,0),st=Math.min(st,Ie.count));const Et=st-Ze;if(Et<0||Et===1/0)return;ge.setup(O,G,we,V,Me);let _t,ut=ve;if(Me!==null&&(_t=P.get(Me),ut=Fe,ut.setIndex(_t)),O.isMesh)G.wireframe===!0?(Z.setLineWidth(G.wireframeLinewidth*ft()),ut.setMode(D.LINES)):ut.setMode(D.TRIANGLES);else if(O.isLine){let Ue=G.linewidth;Ue===void 0&&(Ue=1),Z.setLineWidth(Ue*ft()),O.isLineSegments?ut.setMode(D.LINES):O.isLineLoop?ut.setMode(D.LINE_LOOP):ut.setMode(D.LINE_STRIP)}else O.isPoints?ut.setMode(D.POINTS):O.isSprite&&ut.setMode(D.TRIANGLES);if(O.isBatchedMesh)if(O._multiDrawInstances!==null)ws("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),ut.renderMultiDrawInstances(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount,O._multiDrawInstances);else if(K.get("WEBGL_multi_draw"))ut.renderMultiDraw(O._multiDrawStarts,O._multiDrawCounts,O._multiDrawCount);else{const Ue=O._multiDrawStarts,yt=O._multiDrawCounts,et=O._multiDrawCount,Kt=Me?P.get(Me).bytesPerElement:1,Mi=se.get(G).currentProgram.getUniforms();for(let Qt=0;Qt<et;Qt++)Mi.setValue(D,"_gl_DrawID",Qt),ut.render(Ue[Qt]/Kt,yt[Qt])}else if(O.isInstancedMesh)ut.renderInstances(Ze,Et,O.count);else if(V.isInstancedBufferGeometry){const Ue=V._maxInstanceCount!==void 0?V._maxInstanceCount:1/0,yt=Math.min(V.instanceCount,Ue);ut.renderInstances(Ze,Et,yt)}else ut.render(Ze,Et)};function pt(A,F,V){A.transparent===!0&&A.side===fn&&A.forceSinglePass===!1?(A.side=Zt,A.needsUpdate=!0,Fs(A,F,V),A.side=Jn,A.needsUpdate=!0,Fs(A,F,V),A.side=fn):Fs(A,F,V)}this.compile=function(A,F,V=null){V===null&&(V=A),d=Pe.get(V),d.init(F),y.push(d),V.traverseVisible(function(O){O.isLight&&O.layers.test(F.layers)&&(d.pushLight(O),O.castShadow&&d.pushShadow(O))}),A!==V&&A.traverseVisible(function(O){O.isLight&&O.layers.test(F.layers)&&(d.pushLight(O),O.castShadow&&d.pushShadow(O))}),d.setupLights();const G=new Set;return A.traverse(function(O){if(!(O.isMesh||O.isPoints||O.isLine||O.isSprite))return;const le=O.material;if(le)if(Array.isArray(le))for(let _e=0;_e<le.length;_e++){const we=le[_e];pt(we,V,O),G.add(we)}else pt(le,V,O),G.add(le)}),d=y.pop(),G},this.compileAsync=function(A,F,V=null){const G=this.compile(A,F,V);return new Promise(O=>{function le(){if(G.forEach(function(_e){se.get(_e).currentProgram.isReady()&&G.delete(_e)}),G.size===0){O(A);return}setTimeout(le,10)}K.get("KHR_parallel_shader_compile")!==null?le():setTimeout(le,10)})};let nt=null;function Rn(A){nt&&nt(A)}function _n(){ti.stop()}function Bo(){ti.start()}const ti=new eh;ti.setAnimationLoop(Rn),typeof self<"u"&&ti.setContext(self),this.setAnimationLoop=function(A){nt=A,ce.setAnimationLoop(A),A===null?ti.stop():ti.start()},ce.addEventListener("sessionstart",_n),ce.addEventListener("sessionend",Bo),this.render=function(A,F){if(F!==void 0&&F.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(w===!0)return;if(A.matrixWorldAutoUpdate===!0&&A.updateMatrixWorld(),F.parent===null&&F.matrixWorldAutoUpdate===!0&&F.updateMatrixWorld(),ce.enabled===!0&&ce.isPresenting===!0&&(ce.cameraAutoUpdate===!0&&ce.updateCamera(F),F=ce.getCamera()),A.isScene===!0&&A.onBeforeRender(g,A,F,R),d=Pe.get(A,y.length),d.init(F),y.push(d),ne.multiplyMatrices(F.projectionMatrix,F.matrixWorldInverse),Qe.setFromProjectionMatrix(ne,Sn,F.reversedDepth),Y=this.localClippingEnabled,Ke=he.init(this.clippingPlanes,Y),p=j.get(A,x.length),p.init(),x.push(p),ce.enabled===!0&&ce.isPresenting===!0){const le=g.xr.getDepthSensingMesh();le!==null&&Fr(le,F,-1/0,g.sortObjects)}Fr(A,F,0,g.sortObjects),p.finish(),g.sortObjects===!0&&p.sort(ie,pe),Ye=ce.enabled===!1||ce.isPresenting===!1||ce.hasDepthSensing()===!1,Ye&&Re.addToRenderList(p,A),this.info.render.frame++,Ke===!0&&he.beginShadows();const V=d.state.shadowsArray;Ae.render(V,A,F),Ke===!0&&he.endShadows(),this.info.autoReset===!0&&this.info.reset();const G=p.opaque,O=p.transmissive;if(d.setupLights(),F.isArrayCamera){const le=F.cameras;if(O.length>0)for(let _e=0,we=le.length;_e<we;_e++){const Me=le[_e];Ho(G,O,A,Me)}Ye&&Re.render(A);for(let _e=0,we=le.length;_e<we;_e++){const Me=le[_e];ko(p,A,Me,Me.viewport)}}else O.length>0&&Ho(G,O,A,F),Ye&&Re.render(A),ko(p,A,F);R!==null&&S===0&&(de.updateMultisampleRenderTarget(R),de.updateRenderTargetMipmap(R)),A.isScene===!0&&A.onAfterRender(g,A,F),ge.resetDefaultState(),M=-1,b=null,y.pop(),y.length>0?(d=y[y.length-1],Ke===!0&&he.setGlobalState(g.clippingPlanes,d.state.camera)):d=null,x.pop(),x.length>0?p=x[x.length-1]:p=null};function Fr(A,F,V,G){if(A.visible===!1)return;if(A.layers.test(F.layers)){if(A.isGroup)V=A.renderOrder;else if(A.isLOD)A.autoUpdate===!0&&A.update(F);else if(A.isLight)d.pushLight(A),A.castShadow&&d.pushShadow(A);else if(A.isSprite){if(!A.frustumCulled||Qe.intersectsSprite(A)){G&&De.setFromMatrixPosition(A.matrixWorld).applyMatrix4(ne);const _e=z.update(A),we=A.material;we.visible&&p.push(A,_e,we,V,De.z,null)}}else if((A.isMesh||A.isLine||A.isPoints)&&(!A.frustumCulled||Qe.intersectsObject(A))){const _e=z.update(A),we=A.material;if(G&&(A.boundingSphere!==void 0?(A.boundingSphere===null&&A.computeBoundingSphere(),De.copy(A.boundingSphere.center)):(_e.boundingSphere===null&&_e.computeBoundingSphere(),De.copy(_e.boundingSphere.center)),De.applyMatrix4(A.matrixWorld).applyMatrix4(ne)),Array.isArray(we)){const Me=_e.groups;for(let Ne=0,ze=Me.length;Ne<ze;Ne++){const Ie=Me[Ne],Ze=we[Ie.materialIndex];Ze&&Ze.visible&&p.push(A,_e,Ze,V,De.z,Ie)}}else we.visible&&p.push(A,_e,we,V,De.z,null)}}const le=A.children;for(let _e=0,we=le.length;_e<we;_e++)Fr(le[_e],F,V,G)}function ko(A,F,V,G){const O=A.opaque,le=A.transmissive,_e=A.transparent;d.setupLightsView(V),Ke===!0&&he.setGlobalState(g.clippingPlanes,V),G&&Z.viewport(C.copy(G)),O.length>0&&Ns(O,F,V),le.length>0&&Ns(le,F,V),_e.length>0&&Ns(_e,F,V),Z.buffers.depth.setTest(!0),Z.buffers.depth.setMask(!0),Z.buffers.color.setMask(!0),Z.setPolygonOffset(!1)}function Ho(A,F,V,G){if((V.isScene===!0?V.overrideMaterial:null)!==null)return;d.state.transmissionRenderTarget[G.id]===void 0&&(d.state.transmissionRenderTarget[G.id]=new xi(1,1,{generateMipmaps:!0,type:K.has("EXT_color_buffer_half_float")||K.has("EXT_color_buffer_float")?Cs:wn,minFilter:_i,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:tt.workingColorSpace}));const le=d.state.transmissionRenderTarget[G.id],_e=G.viewport||C;le.setSize(_e.z*g.transmissionResolutionScale,_e.w*g.transmissionResolutionScale);const we=g.getRenderTarget(),Me=g.getActiveCubeFace(),Ne=g.getActiveMipmapLevel();g.setRenderTarget(le),g.getClearColor(H),k=g.getClearAlpha(),k<1&&g.setClearColor(16777215,.5),g.clear(),Ye&&Re.render(V);const ze=g.toneMapping;g.toneMapping=Zn;const Ie=G.viewport;if(G.viewport!==void 0&&(G.viewport=void 0),d.setupLightsView(G),Ke===!0&&he.setGlobalState(g.clippingPlanes,G),Ns(A,V,G),de.updateMultisampleRenderTarget(le),de.updateRenderTargetMipmap(le),K.has("WEBGL_multisampled_render_to_texture")===!1){let Ze=!1;for(let st=0,Et=F.length;st<Et;st++){const _t=F[st],ut=_t.object,Ue=_t.geometry,yt=_t.material,et=_t.group;if(yt.side===fn&&ut.layers.test(G.layers)){const Kt=yt.side;yt.side=Zt,yt.needsUpdate=!0,Vo(ut,V,G,Ue,yt,et),yt.side=Kt,yt.needsUpdate=!0,Ze=!0}}Ze===!0&&(de.updateMultisampleRenderTarget(le),de.updateRenderTargetMipmap(le))}g.setRenderTarget(we,Me,Ne),g.setClearColor(H,k),Ie!==void 0&&(G.viewport=Ie),g.toneMapping=ze}function Ns(A,F,V){const G=F.isScene===!0?F.overrideMaterial:null;for(let O=0,le=A.length;O<le;O++){const _e=A[O],we=_e.object,Me=_e.geometry,Ne=_e.group;let ze=_e.material;ze.allowOverride===!0&&G!==null&&(ze=G),we.layers.test(V.layers)&&Vo(we,F,V,Me,ze,Ne)}}function Vo(A,F,V,G,O,le){A.onBeforeRender(g,F,V,G,O,le),A.modelViewMatrix.multiplyMatrices(V.matrixWorldInverse,A.matrixWorld),A.normalMatrix.getNormalMatrix(A.modelViewMatrix),O.onBeforeRender(g,F,V,G,A,le),O.transparent===!0&&O.side===fn&&O.forceSinglePass===!1?(O.side=Zt,O.needsUpdate=!0,g.renderBufferDirect(V,F,G,O,A,le),O.side=Jn,O.needsUpdate=!0,g.renderBufferDirect(V,F,G,O,A,le),O.side=fn):g.renderBufferDirect(V,F,G,O,A,le),A.onAfterRender(g,F,V,G,O,le)}function Fs(A,F,V){F.isScene!==!0&&(F=Te);const G=se.get(A),O=d.state.lights,le=d.state.shadowsArray,_e=O.state.version,we=X.getParameters(A,O.state,le,F,V),Me=X.getProgramCacheKey(we);let Ne=G.programs;G.environment=A.isMeshStandardMaterial?F.environment:null,G.fog=F.fog,G.envMap=(A.isMeshStandardMaterial?Be:ke).get(A.envMap||G.environment),G.envMapRotation=G.environment!==null&&A.envMap===null?F.environmentRotation:A.envMapRotation,Ne===void 0&&(A.addEventListener("dispose",Q),Ne=new Map,G.programs=Ne);let ze=Ne.get(Me);if(ze!==void 0){if(G.currentProgram===ze&&G.lightsStateVersion===_e)return Wo(A,we),ze}else we.uniforms=X.getUniforms(A),A.onBeforeCompile(we,g),ze=X.acquireProgram(we,Me),Ne.set(Me,ze),G.uniforms=we.uniforms;const Ie=G.uniforms;return(!A.isShaderMaterial&&!A.isRawShaderMaterial||A.clipping===!0)&&(Ie.clippingPlanes=he.uniform),Wo(A,we),G.needsLights=gh(A),G.lightsStateVersion=_e,G.needsLights&&(Ie.ambientLightColor.value=O.state.ambient,Ie.lightProbe.value=O.state.probe,Ie.directionalLights.value=O.state.directional,Ie.directionalLightShadows.value=O.state.directionalShadow,Ie.spotLights.value=O.state.spot,Ie.spotLightShadows.value=O.state.spotShadow,Ie.rectAreaLights.value=O.state.rectArea,Ie.ltc_1.value=O.state.rectAreaLTC1,Ie.ltc_2.value=O.state.rectAreaLTC2,Ie.pointLights.value=O.state.point,Ie.pointLightShadows.value=O.state.pointShadow,Ie.hemisphereLights.value=O.state.hemi,Ie.directionalShadowMap.value=O.state.directionalShadowMap,Ie.directionalShadowMatrix.value=O.state.directionalShadowMatrix,Ie.spotShadowMap.value=O.state.spotShadowMap,Ie.spotLightMatrix.value=O.state.spotLightMatrix,Ie.spotLightMap.value=O.state.spotLightMap,Ie.pointShadowMap.value=O.state.pointShadowMap,Ie.pointShadowMatrix.value=O.state.pointShadowMatrix),G.currentProgram=ze,G.uniformsList=null,ze}function Go(A){if(A.uniformsList===null){const F=A.currentProgram.getUniforms();A.uniformsList=br.seqWithValue(F.seq,A.uniforms)}return A.uniformsList}function Wo(A,F){const V=se.get(A);V.outputColorSpace=F.outputColorSpace,V.batching=F.batching,V.batchingColor=F.batchingColor,V.instancing=F.instancing,V.instancingColor=F.instancingColor,V.instancingMorph=F.instancingMorph,V.skinning=F.skinning,V.morphTargets=F.morphTargets,V.morphNormals=F.morphNormals,V.morphColors=F.morphColors,V.morphTargetsCount=F.morphTargetsCount,V.numClippingPlanes=F.numClippingPlanes,V.numIntersection=F.numClipIntersection,V.vertexAlphas=F.vertexAlphas,V.vertexTangents=F.vertexTangents,V.toneMapping=F.toneMapping}function ph(A,F,V,G,O){F.isScene!==!0&&(F=Te),de.resetTextureUnits();const le=F.fog,_e=G.isMeshStandardMaterial?F.environment:null,we=R===null?g.outputColorSpace:R.isXRRenderTarget===!0?R.texture.colorSpace:qi,Me=(G.isMeshStandardMaterial?Be:ke).get(G.envMap||_e),Ne=G.vertexColors===!0&&!!V.attributes.color&&V.attributes.color.itemSize===4,ze=!!V.attributes.tangent&&(!!G.normalMap||G.anisotropy>0),Ie=!!V.morphAttributes.position,Ze=!!V.morphAttributes.normal,st=!!V.morphAttributes.color;let Et=Zn;G.toneMapped&&(R===null||R.isXRRenderTarget===!0)&&(Et=g.toneMapping);const _t=V.morphAttributes.position||V.morphAttributes.normal||V.morphAttributes.color,ut=_t!==void 0?_t.length:0,Ue=se.get(G),yt=d.state.lights;if(Ke===!0&&(Y===!0||A!==b)){const Vt=A===b&&G.id===M;he.setState(G,A,Vt)}let et=!1;G.version===Ue.__version?(Ue.needsLights&&Ue.lightsStateVersion!==yt.state.version||Ue.outputColorSpace!==we||O.isBatchedMesh&&Ue.batching===!1||!O.isBatchedMesh&&Ue.batching===!0||O.isBatchedMesh&&Ue.batchingColor===!0&&O.colorTexture===null||O.isBatchedMesh&&Ue.batchingColor===!1&&O.colorTexture!==null||O.isInstancedMesh&&Ue.instancing===!1||!O.isInstancedMesh&&Ue.instancing===!0||O.isSkinnedMesh&&Ue.skinning===!1||!O.isSkinnedMesh&&Ue.skinning===!0||O.isInstancedMesh&&Ue.instancingColor===!0&&O.instanceColor===null||O.isInstancedMesh&&Ue.instancingColor===!1&&O.instanceColor!==null||O.isInstancedMesh&&Ue.instancingMorph===!0&&O.morphTexture===null||O.isInstancedMesh&&Ue.instancingMorph===!1&&O.morphTexture!==null||Ue.envMap!==Me||G.fog===!0&&Ue.fog!==le||Ue.numClippingPlanes!==void 0&&(Ue.numClippingPlanes!==he.numPlanes||Ue.numIntersection!==he.numIntersection)||Ue.vertexAlphas!==Ne||Ue.vertexTangents!==ze||Ue.morphTargets!==Ie||Ue.morphNormals!==Ze||Ue.morphColors!==st||Ue.toneMapping!==Et||Ue.morphTargetsCount!==ut)&&(et=!0):(et=!0,Ue.__version=G.version);let Kt=Ue.currentProgram;et===!0&&(Kt=Fs(G,F,O));let Mi=!1,Qt=!1,ts=!1;const bt=Kt.getUniforms(),sn=Ue.uniforms;if(Z.useProgram(Kt.program)&&(Mi=!0,Qt=!0,ts=!0),G.id!==M&&(M=G.id,Qt=!0),Mi||b!==A){Z.buffers.depth.getReversed()&&A.reversedDepth!==!0&&(A._reversedDepth=!0,A.updateProjectionMatrix()),bt.setValue(D,"projectionMatrix",A.projectionMatrix),bt.setValue(D,"viewMatrix",A.matrixWorldInverse);const Xt=bt.map.cameraPosition;Xt!==void 0&&Xt.setValue(D,Se.setFromMatrixPosition(A.matrixWorld)),J.logarithmicDepthBuffer&&bt.setValue(D,"logDepthBufFC",2/(Math.log(A.far+1)/Math.LN2)),(G.isMeshPhongMaterial||G.isMeshToonMaterial||G.isMeshLambertMaterial||G.isMeshBasicMaterial||G.isMeshStandardMaterial||G.isShaderMaterial)&&bt.setValue(D,"isOrthographic",A.isOrthographicCamera===!0),b!==A&&(b=A,Qt=!0,ts=!0)}if(O.isSkinnedMesh){bt.setOptional(D,O,"bindMatrix"),bt.setOptional(D,O,"bindMatrixInverse");const Vt=O.skeleton;Vt&&(Vt.boneTexture===null&&Vt.computeBoneTexture(),bt.setValue(D,"boneTexture",Vt.boneTexture,de))}O.isBatchedMesh&&(bt.setOptional(D,O,"batchingTexture"),bt.setValue(D,"batchingTexture",O._matricesTexture,de),bt.setOptional(D,O,"batchingIdTexture"),bt.setValue(D,"batchingIdTexture",O._indirectTexture,de),bt.setOptional(D,O,"batchingColorTexture"),O._colorsTexture!==null&&bt.setValue(D,"batchingColorTexture",O._colorsTexture,de));const rn=V.morphAttributes;if((rn.position!==void 0||rn.normal!==void 0||rn.color!==void 0)&&re.update(O,V,Kt),(Qt||Ue.receiveShadow!==O.receiveShadow)&&(Ue.receiveShadow=O.receiveShadow,bt.setValue(D,"receiveShadow",O.receiveShadow)),G.isMeshGouraudMaterial&&G.envMap!==null&&(sn.envMap.value=Me,sn.flipEnvMap.value=Me.isCubeTexture&&Me.isRenderTargetTexture===!1?-1:1),G.isMeshStandardMaterial&&G.envMap===null&&F.environment!==null&&(sn.envMapIntensity.value=F.environmentIntensity),Qt&&(bt.setValue(D,"toneMappingExposure",g.toneMappingExposure),Ue.needsLights&&mh(sn,ts),le&&G.fog===!0&&ee.refreshFogUniforms(sn,le),ee.refreshMaterialUniforms(sn,G,$,q,d.state.transmissionRenderTarget[A.id]),br.upload(D,Go(Ue),sn,de)),G.isShaderMaterial&&G.uniformsNeedUpdate===!0&&(br.upload(D,Go(Ue),sn,de),G.uniformsNeedUpdate=!1),G.isSpriteMaterial&&bt.setValue(D,"center",O.center),bt.setValue(D,"modelViewMatrix",O.modelViewMatrix),bt.setValue(D,"normalMatrix",O.normalMatrix),bt.setValue(D,"modelMatrix",O.matrixWorld),G.isShaderMaterial||G.isRawShaderMaterial){const Vt=G.uniformsGroups;for(let Xt=0,Or=Vt.length;Xt<Or;Xt++){const ni=Vt[Xt];Ge.update(ni,Kt),Ge.bind(ni,Kt)}}return Kt}function mh(A,F){A.ambientLightColor.needsUpdate=F,A.lightProbe.needsUpdate=F,A.directionalLights.needsUpdate=F,A.directionalLightShadows.needsUpdate=F,A.pointLights.needsUpdate=F,A.pointLightShadows.needsUpdate=F,A.spotLights.needsUpdate=F,A.spotLightShadows.needsUpdate=F,A.rectAreaLights.needsUpdate=F,A.hemisphereLights.needsUpdate=F}function gh(A){return A.isMeshLambertMaterial||A.isMeshToonMaterial||A.isMeshPhongMaterial||A.isMeshStandardMaterial||A.isShadowMaterial||A.isShaderMaterial&&A.lights===!0}this.getActiveCubeFace=function(){return T},this.getActiveMipmapLevel=function(){return S},this.getRenderTarget=function(){return R},this.setRenderTargetTextures=function(A,F,V){const G=se.get(A);G.__autoAllocateDepthBuffer=A.resolveDepthBuffer===!1,G.__autoAllocateDepthBuffer===!1&&(G.__useRenderToTexture=!1),se.get(A.texture).__webglTexture=F,se.get(A.depthTexture).__webglTexture=G.__autoAllocateDepthBuffer?void 0:V,G.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(A,F){const V=se.get(A);V.__webglFramebuffer=F,V.__useDefaultFramebuffer=F===void 0};const _h=D.createFramebuffer();this.setRenderTarget=function(A,F=0,V=0){R=A,T=F,S=V;let G=!0,O=null,le=!1,_e=!1;if(A){const Me=se.get(A);if(Me.__useDefaultFramebuffer!==void 0)Z.bindFramebuffer(D.FRAMEBUFFER,null),G=!1;else if(Me.__webglFramebuffer===void 0)de.setupRenderTarget(A);else if(Me.__hasExternalTextures)de.rebindTextures(A,se.get(A.texture).__webglTexture,se.get(A.depthTexture).__webglTexture);else if(A.depthBuffer){const Ie=A.depthTexture;if(Me.__boundDepthTexture!==Ie){if(Ie!==null&&se.has(Ie)&&(A.width!==Ie.image.width||A.height!==Ie.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");de.setupDepthRenderbuffer(A)}}const Ne=A.texture;(Ne.isData3DTexture||Ne.isDataArrayTexture||Ne.isCompressedArrayTexture)&&(_e=!0);const ze=se.get(A).__webglFramebuffer;A.isWebGLCubeRenderTarget?(Array.isArray(ze[F])?O=ze[F][V]:O=ze[F],le=!0):A.samples>0&&de.useMultisampledRTT(A)===!1?O=se.get(A).__webglMultisampledFramebuffer:Array.isArray(ze)?O=ze[V]:O=ze,C.copy(A.viewport),I.copy(A.scissor),B=A.scissorTest}else C.copy(be).multiplyScalar($).floor(),I.copy(Oe).multiplyScalar($).floor(),B=qe;if(V!==0&&(O=_h),Z.bindFramebuffer(D.FRAMEBUFFER,O)&&G&&Z.drawBuffers(A,O),Z.viewport(C),Z.scissor(I),Z.setScissorTest(B),le){const Me=se.get(A.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_CUBE_MAP_POSITIVE_X+F,Me.__webglTexture,V)}else if(_e){const Me=F;for(let Ne=0;Ne<A.textures.length;Ne++){const ze=se.get(A.textures[Ne]);D.framebufferTextureLayer(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0+Ne,ze.__webglTexture,V,Me)}}else if(A!==null&&V!==0){const Me=se.get(A.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,Me.__webglTexture,V)}M=-1},this.readRenderTargetPixels=function(A,F,V,G,O,le,_e,we=0){if(!(A&&A.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Me=se.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&_e!==void 0&&(Me=Me[_e]),Me){Z.bindFramebuffer(D.FRAMEBUFFER,Me);try{const Ne=A.textures[we],ze=Ne.format,Ie=Ne.type;if(!J.textureFormatReadable(ze)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!J.textureTypeReadable(Ie)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}F>=0&&F<=A.width-G&&V>=0&&V<=A.height-O&&(A.textures.length>1&&D.readBuffer(D.COLOR_ATTACHMENT0+we),D.readPixels(F,V,G,O,Le.convert(ze),Le.convert(Ie),le))}finally{const Ne=R!==null?se.get(R).__webglFramebuffer:null;Z.bindFramebuffer(D.FRAMEBUFFER,Ne)}}},this.readRenderTargetPixelsAsync=async function(A,F,V,G,O,le,_e,we=0){if(!(A&&A.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Me=se.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&_e!==void 0&&(Me=Me[_e]),Me)if(F>=0&&F<=A.width-G&&V>=0&&V<=A.height-O){Z.bindFramebuffer(D.FRAMEBUFFER,Me);const Ne=A.textures[we],ze=Ne.format,Ie=Ne.type;if(!J.textureFormatReadable(ze))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!J.textureTypeReadable(Ie))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Ze=D.createBuffer();D.bindBuffer(D.PIXEL_PACK_BUFFER,Ze),D.bufferData(D.PIXEL_PACK_BUFFER,le.byteLength,D.STREAM_READ),A.textures.length>1&&D.readBuffer(D.COLOR_ATTACHMENT0+we),D.readPixels(F,V,G,O,Le.convert(ze),Le.convert(Ie),0);const st=R!==null?se.get(R).__webglFramebuffer:null;Z.bindFramebuffer(D.FRAMEBUFFER,st);const Et=D.fenceSync(D.SYNC_GPU_COMMANDS_COMPLETE,0);return D.flush(),await Wu(D,Et,4),D.bindBuffer(D.PIXEL_PACK_BUFFER,Ze),D.getBufferSubData(D.PIXEL_PACK_BUFFER,0,le),D.deleteBuffer(Ze),D.deleteSync(Et),le}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(A,F=null,V=0){const G=Math.pow(2,-V),O=Math.floor(A.image.width*G),le=Math.floor(A.image.height*G),_e=F!==null?F.x:0,we=F!==null?F.y:0;de.setTexture2D(A,0),D.copyTexSubImage2D(D.TEXTURE_2D,V,0,0,_e,we,O,le),Z.unbindTexture()};const vh=D.createFramebuffer(),xh=D.createFramebuffer();this.copyTextureToTexture=function(A,F,V=null,G=null,O=0,le=null){le===null&&(O!==0?(ws("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),le=O,O=0):le=0);let _e,we,Me,Ne,ze,Ie,Ze,st,Et;const _t=A.isCompressedTexture?A.mipmaps[le]:A.image;if(V!==null)_e=V.max.x-V.min.x,we=V.max.y-V.min.y,Me=V.isBox3?V.max.z-V.min.z:1,Ne=V.min.x,ze=V.min.y,Ie=V.isBox3?V.min.z:0;else{const rn=Math.pow(2,-O);_e=Math.floor(_t.width*rn),we=Math.floor(_t.height*rn),A.isDataArrayTexture?Me=_t.depth:A.isData3DTexture?Me=Math.floor(_t.depth*rn):Me=1,Ne=0,ze=0,Ie=0}G!==null?(Ze=G.x,st=G.y,Et=G.z):(Ze=0,st=0,Et=0);const ut=Le.convert(F.format),Ue=Le.convert(F.type);let yt;F.isData3DTexture?(de.setTexture3D(F,0),yt=D.TEXTURE_3D):F.isDataArrayTexture||F.isCompressedArrayTexture?(de.setTexture2DArray(F,0),yt=D.TEXTURE_2D_ARRAY):(de.setTexture2D(F,0),yt=D.TEXTURE_2D),D.pixelStorei(D.UNPACK_FLIP_Y_WEBGL,F.flipY),D.pixelStorei(D.UNPACK_PREMULTIPLY_ALPHA_WEBGL,F.premultiplyAlpha),D.pixelStorei(D.UNPACK_ALIGNMENT,F.unpackAlignment);const et=D.getParameter(D.UNPACK_ROW_LENGTH),Kt=D.getParameter(D.UNPACK_IMAGE_HEIGHT),Mi=D.getParameter(D.UNPACK_SKIP_PIXELS),Qt=D.getParameter(D.UNPACK_SKIP_ROWS),ts=D.getParameter(D.UNPACK_SKIP_IMAGES);D.pixelStorei(D.UNPACK_ROW_LENGTH,_t.width),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,_t.height),D.pixelStorei(D.UNPACK_SKIP_PIXELS,Ne),D.pixelStorei(D.UNPACK_SKIP_ROWS,ze),D.pixelStorei(D.UNPACK_SKIP_IMAGES,Ie);const bt=A.isDataArrayTexture||A.isData3DTexture,sn=F.isDataArrayTexture||F.isData3DTexture;if(A.isDepthTexture){const rn=se.get(A),Vt=se.get(F),Xt=se.get(rn.__renderTarget),Or=se.get(Vt.__renderTarget);Z.bindFramebuffer(D.READ_FRAMEBUFFER,Xt.__webglFramebuffer),Z.bindFramebuffer(D.DRAW_FRAMEBUFFER,Or.__webglFramebuffer);for(let ni=0;ni<Me;ni++)bt&&(D.framebufferTextureLayer(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,se.get(A).__webglTexture,O,Ie+ni),D.framebufferTextureLayer(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,se.get(F).__webglTexture,le,Et+ni)),D.blitFramebuffer(Ne,ze,_e,we,Ze,st,_e,we,D.DEPTH_BUFFER_BIT,D.NEAREST);Z.bindFramebuffer(D.READ_FRAMEBUFFER,null),Z.bindFramebuffer(D.DRAW_FRAMEBUFFER,null)}else if(O!==0||A.isRenderTargetTexture||se.has(A)){const rn=se.get(A),Vt=se.get(F);Z.bindFramebuffer(D.READ_FRAMEBUFFER,vh),Z.bindFramebuffer(D.DRAW_FRAMEBUFFER,xh);for(let Xt=0;Xt<Me;Xt++)bt?D.framebufferTextureLayer(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,rn.__webglTexture,O,Ie+Xt):D.framebufferTexture2D(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,rn.__webglTexture,O),sn?D.framebufferTextureLayer(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,Vt.__webglTexture,le,Et+Xt):D.framebufferTexture2D(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,Vt.__webglTexture,le),O!==0?D.blitFramebuffer(Ne,ze,_e,we,Ze,st,_e,we,D.COLOR_BUFFER_BIT,D.NEAREST):sn?D.copyTexSubImage3D(yt,le,Ze,st,Et+Xt,Ne,ze,_e,we):D.copyTexSubImage2D(yt,le,Ze,st,Ne,ze,_e,we);Z.bindFramebuffer(D.READ_FRAMEBUFFER,null),Z.bindFramebuffer(D.DRAW_FRAMEBUFFER,null)}else sn?A.isDataTexture||A.isData3DTexture?D.texSubImage3D(yt,le,Ze,st,Et,_e,we,Me,ut,Ue,_t.data):F.isCompressedArrayTexture?D.compressedTexSubImage3D(yt,le,Ze,st,Et,_e,we,Me,ut,_t.data):D.texSubImage3D(yt,le,Ze,st,Et,_e,we,Me,ut,Ue,_t):A.isDataTexture?D.texSubImage2D(D.TEXTURE_2D,le,Ze,st,_e,we,ut,Ue,_t.data):A.isCompressedTexture?D.compressedTexSubImage2D(D.TEXTURE_2D,le,Ze,st,_t.width,_t.height,ut,_t.data):D.texSubImage2D(D.TEXTURE_2D,le,Ze,st,_e,we,ut,Ue,_t);D.pixelStorei(D.UNPACK_ROW_LENGTH,et),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,Kt),D.pixelStorei(D.UNPACK_SKIP_PIXELS,Mi),D.pixelStorei(D.UNPACK_SKIP_ROWS,Qt),D.pixelStorei(D.UNPACK_SKIP_IMAGES,ts),le===0&&F.generateMipmaps&&D.generateMipmap(yt),Z.unbindTexture()},this.initRenderTarget=function(A){se.get(A).__webglFramebuffer===void 0&&de.setupRenderTarget(A)},this.initTexture=function(A){A.isCubeTexture?de.setTextureCube(A,0):A.isData3DTexture?de.setTexture3D(A,0):A.isDataArrayTexture||A.isCompressedArrayTexture?de.setTexture2DArray(A,0):de.setTexture2D(A,0),Z.unbindTexture()},this.resetState=function(){T=0,S=0,R=null,Z.reset(),ge.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Sn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=tt._getDrawingBufferColorSpace(e),t.unpackColorSpace=tt._getUnpackColorSpace()}}const ec={type:"change"},Oo={type:"start"},rh={type:"end"},dr=new Dr,tc=new jn,X_=Math.cos(70*Vu.DEG2RAD),Lt=new L,qt=2*Math.PI,at={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},ya=1e-6;class j_ extends Qc{constructor(e,t=null){super(e,t),this.state=at.NONE,this.target=new L,this.cursor=new L,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Vi.ROTATE,MIDDLE:Vi.DOLLY,RIGHT:Vi.PAN},this.touches={ONE:zi.ROTATE,TWO:zi.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new L,this._lastQuaternion=new Ot,this._lastTargetPosition=new L,this._quat=new Ot().setFromUnitVectors(e.up,new L(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Rl,this._sphericalDelta=new Rl,this._scale=1,this._panOffset=new L,this._rotateStart=new oe,this._rotateEnd=new oe,this._rotateDelta=new oe,this._panStart=new oe,this._panEnd=new oe,this._panDelta=new oe,this._dollyStart=new oe,this._dollyEnd=new oe,this._dollyDelta=new oe,this._dollyDirection=new L,this._mouse=new oe,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=Y_.bind(this),this._onPointerDown=q_.bind(this),this._onPointerUp=Z_.bind(this),this._onContextMenu=iv.bind(this),this._onMouseWheel=Q_.bind(this),this._onKeyDown=ev.bind(this),this._onTouchStart=tv.bind(this),this._onTouchMove=nv.bind(this),this._onMouseDown=J_.bind(this),this._onMouseMove=K_.bind(this),this._interceptControlDown=sv.bind(this),this._interceptControlUp=rv.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(ec),this.update(),this.state=at.NONE}update(e=null){const t=this.object.position;Lt.copy(t).sub(this.target),Lt.applyQuaternion(this._quat),this._spherical.setFromVector3(Lt),this.autoRotate&&this.state===at.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,s=this.maxAzimuthAngle;isFinite(i)&&isFinite(s)&&(i<-Math.PI?i+=qt:i>Math.PI&&(i-=qt),s<-Math.PI?s+=qt:s>Math.PI&&(s-=qt),i<=s?this._spherical.theta=Math.max(i,Math.min(s,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+s)/2?Math.max(i,this._spherical.theta):Math.min(s,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const a=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=a!=this._spherical.radius}if(Lt.setFromSpherical(this._spherical),Lt.applyQuaternion(this._quatInverse),t.copy(this.target).add(Lt),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let a=null;if(this.object.isPerspectiveCamera){const o=Lt.length();a=this._clampDistance(o*this._scale);const l=o-a;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),r=!!l}else if(this.object.isOrthographicCamera){const o=new L(this._mouse.x,this._mouse.y,0);o.unproject(this.object);const l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=l!==this.object.zoom;const c=new L(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(o),this.object.updateMatrixWorld(),a=Lt.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;a!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(a).add(this.object.position):(dr.origin.copy(this.object.position),dr.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(dr.direction))<X_?this.object.lookAt(this.target):(tc.setFromNormalAndCoplanarPoint(this.object.up,this.target),dr.intersectPlane(tc,this.target))))}else if(this.object.isOrthographicCamera){const a=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),a!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>ya||8*(1-this._lastQuaternion.dot(this.object.quaternion))>ya||this._lastTargetPosition.distanceToSquared(this.target)>ya?(this.dispatchEvent(ec),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?qt/60*this.autoRotateSpeed*e:qt/60/60*this.autoRotateSpeed}_getZoomScale(e){const t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){Lt.setFromMatrixColumn(t,0),Lt.multiplyScalar(-e),this._panOffset.add(Lt)}_panUp(e,t){this.screenSpacePanning===!0?Lt.setFromMatrixColumn(t,1):(Lt.setFromMatrixColumn(t,0),Lt.crossVectors(this.object.up,Lt)),Lt.multiplyScalar(e),this._panOffset.add(Lt)}_pan(e,t){const i=this.domElement;if(this.object.isPerspectiveCamera){const s=this.object.position;Lt.copy(s).sub(this.target);let r=Lt.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*r/i.clientHeight,this.object.matrix),this._panUp(2*t*r/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const i=this.domElement.getBoundingClientRect(),s=e-i.left,r=t-i.top,a=i.width,o=i.height;this._mouse.x=s/a*2-1,this._mouse.y=-(r/o)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(qt*this._rotateDelta.x/t.clientHeight),this._rotateUp(qt*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(qt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-qt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(qt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-qt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._rotateStart.set(i,s)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panStart.set(i,s)}}_handleTouchStartDolly(e){const t=this._getSecondPointerPosition(e),i=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(i*i+s*s);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const i=this._getSecondPointerPosition(e),s=.5*(e.pageX+i.x),r=.5*(e.pageY+i.y);this._rotateEnd.set(s,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(qt*this._rotateDelta.x/t.clientHeight),this._rotateUp(qt*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),i=.5*(e.pageX+t.x),s=.5*(e.pageY+t.y);this._panEnd.set(i,s)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const t=this._getSecondPointerPosition(e),i=e.pageX-t.x,s=e.pageY-t.y,r=Math.sqrt(i*i+s*s);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const a=(e.pageX+t.x)*.5,o=(e.pageY+t.y)*.5;this._updateZoomParameters(a,o)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new oe,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){const t=e.deltaMode,i={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}}function q_(n){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(n.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(n)&&(this._addPointer(n),n.pointerType==="touch"?this._onTouchStart(n):this._onMouseDown(n)))}function Y_(n){this.enabled!==!1&&(n.pointerType==="touch"?this._onTouchMove(n):this._onMouseMove(n))}function Z_(n){switch(this._removePointer(n),this._pointers.length){case 0:this.domElement.releasePointerCapture(n.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(rh),this.state=at.NONE;break;case 1:const e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function J_(n){let e;switch(n.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case Vi.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(n),this.state=at.DOLLY;break;case Vi.ROTATE:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=at.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=at.ROTATE}break;case Vi.PAN:if(n.ctrlKey||n.metaKey||n.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(n),this.state=at.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(n),this.state=at.PAN}break;default:this.state=at.NONE}this.state!==at.NONE&&this.dispatchEvent(Oo)}function K_(n){switch(this.state){case at.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(n);break;case at.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(n);break;case at.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(n);break}}function Q_(n){this.enabled===!1||this.enableZoom===!1||this.state!==at.NONE||(n.preventDefault(),this.dispatchEvent(Oo),this._handleMouseWheel(this._customWheelEvent(n)),this.dispatchEvent(rh))}function ev(n){this.enabled!==!1&&this._handleKeyDown(n)}function tv(n){switch(this._trackPointer(n),this._pointers.length){case 1:switch(this.touches.ONE){case zi.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(n),this.state=at.TOUCH_ROTATE;break;case zi.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(n),this.state=at.TOUCH_PAN;break;default:this.state=at.NONE}break;case 2:switch(this.touches.TWO){case zi.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(n),this.state=at.TOUCH_DOLLY_PAN;break;case zi.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(n),this.state=at.TOUCH_DOLLY_ROTATE;break;default:this.state=at.NONE}break;default:this.state=at.NONE}this.state!==at.NONE&&this.dispatchEvent(Oo)}function nv(n){switch(this._trackPointer(n),this.state){case at.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(n),this.update();break;case at.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(n),this.update();break;case at.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(n),this.update();break;case at.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(n),this.update();break;default:this.state=at.NONE}}function iv(n){this.enabled!==!1&&n.preventDefault()}function sv(n){n.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function rv(n){n.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const ci=new Kc,kt=new L,Xn=new L,vt=new Ot,nc={X:new L(1,0,0),Y:new L(0,1,0),Z:new L(0,0,1)},ba={type:"change"},ic={type:"mouseDown",mode:null},sc={type:"mouseUp",mode:null},rc={type:"objectChange"};class av extends Qc{constructor(e,t=null){super(void 0,t);const i=new dv(this);this._root=i;const s=new fv;this._gizmo=s,i.add(s);const r=new pv;this._plane=r,i.add(r);const a=this;function o(y,g){let w=g;Object.defineProperty(a,y,{get:function(){return w!==void 0?w:g},set:function(T){w!==T&&(w=T,r[y]=T,s[y]=T,a.dispatchEvent({type:y+"-changed",value:T}),a.dispatchEvent(ba))}}),a[y]=g,r[y]=g,s[y]=g}o("camera",e),o("object",void 0),o("enabled",!0),o("axis",null),o("mode","translate"),o("translationSnap",null),o("rotationSnap",null),o("scaleSnap",null),o("space","world"),o("size",1),o("dragging",!1),o("showX",!0),o("showY",!0),o("showZ",!0),o("minX",-1/0),o("maxX",1/0),o("minY",-1/0),o("maxY",1/0),o("minZ",-1/0),o("maxZ",1/0);const l=new L,c=new L,h=new Ot,u=new Ot,f=new L,m=new Ot,_=new L,v=new L,p=new L,d=0,x=new L;o("worldPosition",l),o("worldPositionStart",c),o("worldQuaternion",h),o("worldQuaternionStart",u),o("cameraPosition",f),o("cameraQuaternion",m),o("pointStart",_),o("pointEnd",v),o("rotationAxis",p),o("rotationAngle",d),o("eye",x),this._offset=new L,this._startNorm=new L,this._endNorm=new L,this._cameraScale=new L,this._parentPosition=new L,this._parentQuaternion=new Ot,this._parentQuaternionInv=new Ot,this._parentScale=new L,this._worldScaleStart=new L,this._worldQuaternionInv=new Ot,this._worldScale=new L,this._positionStart=new L,this._quaternionStart=new Ot,this._scaleStart=new L,this._getPointer=ov.bind(this),this._onPointerDown=cv.bind(this),this._onPointerHover=lv.bind(this),this._onPointerMove=hv.bind(this),this._onPointerUp=uv.bind(this),t!==null&&this.connect(t)}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointermove",this._onPointerHover),this.domElement.addEventListener("pointerup",this._onPointerUp),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerHover),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.style.touchAction="auto"}getHelper(){return this._root}pointerHover(e){if(this.object===void 0||this.dragging===!0)return;e!==null&&ci.setFromCamera(e,this.camera);const t=Ma(this._gizmo.picker[this.mode],ci);t?this.axis=t.object.name:this.axis=null}pointerDown(e){if(!(this.object===void 0||this.dragging===!0||e!=null&&e.button!==0)&&this.axis!==null){e!==null&&ci.setFromCamera(e,this.camera);const t=Ma(this._plane,ci,!0);t&&(this.object.updateMatrixWorld(),this.object.parent.updateMatrixWorld(),this._positionStart.copy(this.object.position),this._quaternionStart.copy(this.object.quaternion),this._scaleStart.copy(this.object.scale),this.object.matrixWorld.decompose(this.worldPositionStart,this.worldQuaternionStart,this._worldScaleStart),this.pointStart.copy(t.point).sub(this.worldPositionStart)),this.dragging=!0,ic.mode=this.mode,this.dispatchEvent(ic)}}pointerMove(e){const t=this.axis,i=this.mode,s=this.object;let r=this.space;if(i==="scale"?r="local":(t==="E"||t==="XYZE"||t==="XYZ")&&(r="world"),s===void 0||t===null||this.dragging===!1||e!==null&&e.button!==-1)return;e!==null&&ci.setFromCamera(e,this.camera);const a=Ma(this._plane,ci,!0);if(a){if(this.pointEnd.copy(a.point).sub(this.worldPositionStart),i==="translate")this._offset.copy(this.pointEnd).sub(this.pointStart),r==="local"&&t!=="XYZ"&&this._offset.applyQuaternion(this._worldQuaternionInv),t.indexOf("X")===-1&&(this._offset.x=0),t.indexOf("Y")===-1&&(this._offset.y=0),t.indexOf("Z")===-1&&(this._offset.z=0),r==="local"&&t!=="XYZ"?this._offset.applyQuaternion(this._quaternionStart).divide(this._parentScale):this._offset.applyQuaternion(this._parentQuaternionInv).divide(this._parentScale),s.position.copy(this._offset).add(this._positionStart),this.translationSnap&&(r==="local"&&(s.position.applyQuaternion(vt.copy(this._quaternionStart).invert()),t.search("X")!==-1&&(s.position.x=Math.round(s.position.x/this.translationSnap)*this.translationSnap),t.search("Y")!==-1&&(s.position.y=Math.round(s.position.y/this.translationSnap)*this.translationSnap),t.search("Z")!==-1&&(s.position.z=Math.round(s.position.z/this.translationSnap)*this.translationSnap),s.position.applyQuaternion(this._quaternionStart)),r==="world"&&(s.parent&&s.position.add(kt.setFromMatrixPosition(s.parent.matrixWorld)),t.search("X")!==-1&&(s.position.x=Math.round(s.position.x/this.translationSnap)*this.translationSnap),t.search("Y")!==-1&&(s.position.y=Math.round(s.position.y/this.translationSnap)*this.translationSnap),t.search("Z")!==-1&&(s.position.z=Math.round(s.position.z/this.translationSnap)*this.translationSnap),s.parent&&s.position.sub(kt.setFromMatrixPosition(s.parent.matrixWorld)))),s.position.x=Math.max(this.minX,Math.min(this.maxX,s.position.x)),s.position.y=Math.max(this.minY,Math.min(this.maxY,s.position.y)),s.position.z=Math.max(this.minZ,Math.min(this.maxZ,s.position.z));else if(i==="scale"){if(t.search("XYZ")!==-1){let o=this.pointEnd.length()/this.pointStart.length();this.pointEnd.dot(this.pointStart)<0&&(o*=-1),Xn.set(o,o,o)}else kt.copy(this.pointStart),Xn.copy(this.pointEnd),kt.applyQuaternion(this._worldQuaternionInv),Xn.applyQuaternion(this._worldQuaternionInv),Xn.divide(kt),t.search("X")===-1&&(Xn.x=1),t.search("Y")===-1&&(Xn.y=1),t.search("Z")===-1&&(Xn.z=1);s.scale.copy(this._scaleStart).multiply(Xn),this.scaleSnap&&(t.search("X")!==-1&&(s.scale.x=Math.round(s.scale.x/this.scaleSnap)*this.scaleSnap||this.scaleSnap),t.search("Y")!==-1&&(s.scale.y=Math.round(s.scale.y/this.scaleSnap)*this.scaleSnap||this.scaleSnap),t.search("Z")!==-1&&(s.scale.z=Math.round(s.scale.z/this.scaleSnap)*this.scaleSnap||this.scaleSnap))}else if(i==="rotate"){this._offset.copy(this.pointEnd).sub(this.pointStart);const o=20/this.worldPosition.distanceTo(kt.setFromMatrixPosition(this.camera.matrixWorld));let l=!1;t==="XYZE"?(this.rotationAxis.copy(this._offset).cross(this.eye).normalize(),this.rotationAngle=this._offset.dot(kt.copy(this.rotationAxis).cross(this.eye))*o):(t==="X"||t==="Y"||t==="Z")&&(this.rotationAxis.copy(nc[t]),kt.copy(nc[t]),r==="local"&&kt.applyQuaternion(this.worldQuaternion),kt.cross(this.eye),kt.length()===0?l=!0:this.rotationAngle=this._offset.dot(kt.normalize())*o),(t==="E"||l)&&(this.rotationAxis.copy(this.eye),this.rotationAngle=this.pointEnd.angleTo(this.pointStart),this._startNorm.copy(this.pointStart).normalize(),this._endNorm.copy(this.pointEnd).normalize(),this.rotationAngle*=this._endNorm.cross(this._startNorm).dot(this.eye)<0?1:-1),this.rotationSnap&&(this.rotationAngle=Math.round(this.rotationAngle/this.rotationSnap)*this.rotationSnap),r==="local"&&t!=="E"&&t!=="XYZE"?(s.quaternion.copy(this._quaternionStart),s.quaternion.multiply(vt.setFromAxisAngle(this.rotationAxis,this.rotationAngle)).normalize()):(this.rotationAxis.applyQuaternion(this._parentQuaternionInv),s.quaternion.copy(vt.setFromAxisAngle(this.rotationAxis,this.rotationAngle)),s.quaternion.multiply(this._quaternionStart).normalize())}this.dispatchEvent(ba),this.dispatchEvent(rc)}}pointerUp(e){e!==null&&e.button!==0||(this.dragging&&this.axis!==null&&(sc.mode=this.mode,this.dispatchEvent(sc)),this.dragging=!1,this.axis=null)}dispose(){this.disconnect(),this._root.dispose()}attach(e){return this.object=e,this._root.visible=!0,this}detach(){return this.object=void 0,this.axis=null,this._root.visible=!1,this}reset(){this.enabled&&this.dragging&&(this.object.position.copy(this._positionStart),this.object.quaternion.copy(this._quaternionStart),this.object.scale.copy(this._scaleStart),this.dispatchEvent(ba),this.dispatchEvent(rc),this.pointStart.copy(this.pointEnd))}getRaycaster(){return ci}getMode(){return this.mode}setMode(e){this.mode=e}setTranslationSnap(e){this.translationSnap=e}setRotationSnap(e){this.rotationSnap=e}setScaleSnap(e){this.scaleSnap=e}setSize(e){this.size=e}setSpace(e){this.space=e}setColors(e,t,i,s){const r=this._gizmo.materialLib;r.xAxis.color.set(e),r.yAxis.color.set(t),r.zAxis.color.set(i),r.active.color.set(s),r.xAxisTransparent.color.set(e),r.yAxisTransparent.color.set(t),r.zAxisTransparent.color.set(i),r.activeTransparent.color.set(s),r.xAxis._color&&r.xAxis._color.set(e),r.yAxis._color&&r.yAxis._color.set(t),r.zAxis._color&&r.zAxis._color.set(i),r.active._color&&r.active._color.set(s),r.xAxisTransparent._color&&r.xAxisTransparent._color.set(e),r.yAxisTransparent._color&&r.yAxisTransparent._color.set(t),r.zAxisTransparent._color&&r.zAxisTransparent._color.set(i),r.activeTransparent._color&&r.activeTransparent._color.set(s)}}function ov(n){if(this.domElement.ownerDocument.pointerLockElement)return{x:0,y:0,button:n.button};{const e=this.domElement.getBoundingClientRect();return{x:(n.clientX-e.left)/e.width*2-1,y:-(n.clientY-e.top)/e.height*2+1,button:n.button}}}function lv(n){if(this.enabled)switch(n.pointerType){case"mouse":case"pen":this.pointerHover(this._getPointer(n));break}}function cv(n){this.enabled&&(document.pointerLockElement||this.domElement.setPointerCapture(n.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.pointerHover(this._getPointer(n)),this.pointerDown(this._getPointer(n)))}function hv(n){this.enabled&&this.pointerMove(this._getPointer(n))}function uv(n){this.enabled&&(this.domElement.releasePointerCapture(n.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.pointerUp(this._getPointer(n)))}function Ma(n,e,t){const i=e.intersectObject(n,!0);for(let s=0;s<i.length;s++)if(i[s].object.visible||t)return i[s];return!1}const fr=new gn,dt=new L(0,1,0),ac=new L(0,0,0),oc=new ct,pr=new Ot,Mr=new Ot,vn=new L,lc=new ct,ps=new L(1,0,0),di=new L(0,1,0),ms=new L(0,0,1),mr=new L,ls=new L,cs=new L;class dv extends Rt{constructor(e){super(),this.isTransformControlsRoot=!0,this.controls=e,this.visible=!1}updateMatrixWorld(e){const t=this.controls;t.object!==void 0&&(t.object.updateMatrixWorld(),t.object.parent===null?console.error("TransformControls: The attached 3D object must be a part of the scene graph."):t.object.parent.matrixWorld.decompose(t._parentPosition,t._parentQuaternion,t._parentScale),t.object.matrixWorld.decompose(t.worldPosition,t.worldQuaternion,t._worldScale),t._parentQuaternionInv.copy(t._parentQuaternion).invert(),t._worldQuaternionInv.copy(t.worldQuaternion).invert()),t.camera.updateMatrixWorld(),t.camera.matrixWorld.decompose(t.cameraPosition,t.cameraQuaternion,t._cameraScale),t.camera.isOrthographicCamera?t.camera.getWorldDirection(t.eye).negate():t.eye.copy(t.cameraPosition).sub(t.worldPosition).normalize(),super.updateMatrixWorld(e)}dispose(){this.traverse(function(e){e.geometry&&e.geometry.dispose(),e.material&&e.material.dispose()})}}class fv extends Rt{constructor(){super(),this.isTransformControlsGizmo=!0,this.type="TransformControlsGizmo";const e=new Ir({depthTest:!1,depthWrite:!1,fog:!1,toneMapped:!1,transparent:!0}),t=new Zi({depthTest:!1,depthWrite:!1,fog:!1,toneMapped:!1,transparent:!0}),i=e.clone();i.opacity=.15;const s=t.clone();s.opacity=.5;const r=e.clone();r.color.setHex(16711680);const a=e.clone();a.color.setHex(65280);const o=e.clone();o.color.setHex(255);const l=e.clone();l.color.setHex(16711680),l.opacity=.5;const c=e.clone();c.color.setHex(65280),c.opacity=.5;const h=e.clone();h.color.setHex(255),h.opacity=.5;const u=e.clone();u.opacity=.25;const f=e.clone();f.color.setHex(16776960),f.opacity=.25;const m=e.clone();m.color.setHex(16776960);const _=e.clone();_.color.setHex(7895160),this.materialLib={xAxis:r,yAxis:a,zAxis:o,active:m,xAxisTransparent:l,yAxisTransparent:c,zAxisTransparent:h,activeTransparent:f};const v=new Ft(0,.04,.1,12);v.translate(0,.05,0);const p=new Mt(.08,.08,.08);p.translate(0,.04,0);const d=new Nt;d.setAttribute("position",new it([0,0,0,1,0,0],3));const x=new Ft(.0075,.0075,.5,3);x.translate(0,.25,0);function y(k,W){const q=new pi(k,.0075,3,64,W*Math.PI*2);return q.rotateY(Math.PI/2),q.rotateX(Math.PI/2),q}function g(){const k=new Nt;return k.setAttribute("position",new it([0,0,0,1,1,1],3)),k}const w={X:[[new ye(v,r),[.5,0,0],[0,0,-Math.PI/2]],[new ye(v,r),[-.5,0,0],[0,0,Math.PI/2]],[new ye(x,r),[0,0,0],[0,0,-Math.PI/2]]],Y:[[new ye(v,a),[0,.5,0]],[new ye(v,a),[0,-.5,0],[Math.PI,0,0]],[new ye(x,a)]],Z:[[new ye(v,o),[0,0,.5],[Math.PI/2,0,0]],[new ye(v,o),[0,0,-.5],[-Math.PI/2,0,0]],[new ye(x,o),null,[Math.PI/2,0,0]]],XYZ:[[new ye(new ki(.1,0),u),[0,0,0]]],XY:[[new ye(new Mt(.15,.15,.01),h),[.15,.15,0]]],YZ:[[new ye(new Mt(.15,.15,.01),l),[0,.15,.15],[0,Math.PI/2,0]]],XZ:[[new ye(new Mt(.15,.15,.01),c),[.15,0,.15],[-Math.PI/2,0,0]]]},T={X:[[new ye(new Ft(.2,0,.6,4),i),[.3,0,0],[0,0,-Math.PI/2]],[new ye(new Ft(.2,0,.6,4),i),[-.3,0,0],[0,0,Math.PI/2]]],Y:[[new ye(new Ft(.2,0,.6,4),i),[0,.3,0]],[new ye(new Ft(.2,0,.6,4),i),[0,-.3,0],[0,0,Math.PI]]],Z:[[new ye(new Ft(.2,0,.6,4),i),[0,0,.3],[Math.PI/2,0,0]],[new ye(new Ft(.2,0,.6,4),i),[0,0,-.3],[-Math.PI/2,0,0]]],XYZ:[[new ye(new ki(.2,0),i)]],XY:[[new ye(new Mt(.2,.2,.01),i),[.15,.15,0]]],YZ:[[new ye(new Mt(.2,.2,.01),i),[0,.15,.15],[0,Math.PI/2,0]]],XZ:[[new ye(new Mt(.2,.2,.01),i),[.15,0,.15],[-Math.PI/2,0,0]]]},S={START:[[new ye(new ki(.01,2),s),null,null,null,"helper"]],END:[[new ye(new ki(.01,2),s),null,null,null,"helper"]],DELTA:[[new Fn(g(),s),null,null,null,"helper"]],X:[[new Fn(d,s),[-1e3,0,0],null,[1e6,1,1],"helper"]],Y:[[new Fn(d,s),[0,-1e3,0],[0,0,Math.PI/2],[1e6,1,1],"helper"]],Z:[[new Fn(d,s),[0,0,-1e3],[0,-Math.PI/2,0],[1e6,1,1],"helper"]]},R={XYZE:[[new ye(y(.5,1),_),null,[0,Math.PI/2,0]]],X:[[new ye(y(.5,.5),r)]],Y:[[new ye(y(.5,.5),a),null,[0,0,-Math.PI/2]]],Z:[[new ye(y(.5,.5),o),null,[0,Math.PI/2,0]]],E:[[new ye(y(.75,1),f),null,[0,Math.PI/2,0]]]},M={AXIS:[[new Fn(d,s),[-1e3,0,0],null,[1e6,1,1],"helper"]]},b={XYZE:[[new ye(new Ds(.25,10,8),i)]],X:[[new ye(new pi(.5,.1,4,24),i),[0,0,0],[0,-Math.PI/2,-Math.PI/2]]],Y:[[new ye(new pi(.5,.1,4,24),i),[0,0,0],[Math.PI/2,0,0]]],Z:[[new ye(new pi(.5,.1,4,24),i),[0,0,0],[0,0,-Math.PI/2]]],E:[[new ye(new pi(.75,.1,2,24),i)]]},C={X:[[new ye(p,r),[.5,0,0],[0,0,-Math.PI/2]],[new ye(x,r),[0,0,0],[0,0,-Math.PI/2]],[new ye(p,r),[-.5,0,0],[0,0,Math.PI/2]]],Y:[[new ye(p,a),[0,.5,0]],[new ye(x,a)],[new ye(p,a),[0,-.5,0],[0,0,Math.PI]]],Z:[[new ye(p,o),[0,0,.5],[Math.PI/2,0,0]],[new ye(x,o),[0,0,0],[Math.PI/2,0,0]],[new ye(p,o),[0,0,-.5],[-Math.PI/2,0,0]]],XY:[[new ye(new Mt(.15,.15,.01),h),[.15,.15,0]]],YZ:[[new ye(new Mt(.15,.15,.01),l),[0,.15,.15],[0,Math.PI/2,0]]],XZ:[[new ye(new Mt(.15,.15,.01),c),[.15,0,.15],[-Math.PI/2,0,0]]],XYZ:[[new ye(new Mt(.1,.1,.1),u)]]},I={X:[[new ye(new Ft(.2,0,.6,4),i),[.3,0,0],[0,0,-Math.PI/2]],[new ye(new Ft(.2,0,.6,4),i),[-.3,0,0],[0,0,Math.PI/2]]],Y:[[new ye(new Ft(.2,0,.6,4),i),[0,.3,0]],[new ye(new Ft(.2,0,.6,4),i),[0,-.3,0],[0,0,Math.PI]]],Z:[[new ye(new Ft(.2,0,.6,4),i),[0,0,.3],[Math.PI/2,0,0]],[new ye(new Ft(.2,0,.6,4),i),[0,0,-.3],[-Math.PI/2,0,0]]],XY:[[new ye(new Mt(.2,.2,.01),i),[.15,.15,0]]],YZ:[[new ye(new Mt(.2,.2,.01),i),[0,.15,.15],[0,Math.PI/2,0]]],XZ:[[new ye(new Mt(.2,.2,.01),i),[.15,0,.15],[-Math.PI/2,0,0]]],XYZ:[[new ye(new Mt(.2,.2,.2),i),[0,0,0]]]},B={X:[[new Fn(d,s),[-1e3,0,0],null,[1e6,1,1],"helper"]],Y:[[new Fn(d,s),[0,-1e3,0],[0,0,Math.PI/2],[1e6,1,1],"helper"]],Z:[[new Fn(d,s),[0,0,-1e3],[0,-Math.PI/2,0],[1e6,1,1],"helper"]]};function H(k){const W=new Rt;for(const q in k)for(let $=k[q].length;$--;){const ie=k[q][$][0].clone(),pe=k[q][$][1],be=k[q][$][2],Oe=k[q][$][3],qe=k[q][$][4];ie.name=q,ie.tag=qe,pe&&ie.position.set(pe[0],pe[1],pe[2]),be&&ie.rotation.set(be[0],be[1],be[2]),Oe&&ie.scale.set(Oe[0],Oe[1],Oe[2]),ie.updateMatrix();const Qe=ie.geometry.clone();Qe.applyMatrix4(ie.matrix),ie.geometry=Qe,ie.renderOrder=1/0,ie.position.set(0,0,0),ie.rotation.set(0,0,0),ie.scale.set(1,1,1),W.add(ie)}return W}this.gizmo={},this.picker={},this.helper={},this.add(this.gizmo.translate=H(w)),this.add(this.gizmo.rotate=H(R)),this.add(this.gizmo.scale=H(C)),this.add(this.picker.translate=H(T)),this.add(this.picker.rotate=H(b)),this.add(this.picker.scale=H(I)),this.add(this.helper.translate=H(S)),this.add(this.helper.rotate=H(M)),this.add(this.helper.scale=H(B)),this.picker.translate.visible=!1,this.picker.rotate.visible=!1,this.picker.scale.visible=!1}updateMatrixWorld(e){const i=(this.mode==="scale"?"local":this.space)==="local"?this.worldQuaternion:Mr;this.gizmo.translate.visible=this.mode==="translate",this.gizmo.rotate.visible=this.mode==="rotate",this.gizmo.scale.visible=this.mode==="scale",this.helper.translate.visible=this.mode==="translate",this.helper.rotate.visible=this.mode==="rotate",this.helper.scale.visible=this.mode==="scale";let s=[];s=s.concat(this.picker[this.mode].children),s=s.concat(this.gizmo[this.mode].children),s=s.concat(this.helper[this.mode].children);for(let r=0;r<s.length;r++){const a=s[r];a.visible=!0,a.rotation.set(0,0,0),a.position.copy(this.worldPosition);let o;if(this.camera.isOrthographicCamera?o=(this.camera.top-this.camera.bottom)/this.camera.zoom:o=this.worldPosition.distanceTo(this.cameraPosition)*Math.min(1.9*Math.tan(Math.PI*this.camera.fov/360)/this.camera.zoom,7),a.scale.set(1,1,1).multiplyScalar(o*this.size/4),a.tag==="helper"){a.visible=!1,a.name==="AXIS"?(a.visible=!!this.axis,this.axis==="X"&&(vt.setFromEuler(fr.set(0,0,0)),a.quaternion.copy(i).multiply(vt),Math.abs(dt.copy(ps).applyQuaternion(i).dot(this.eye))>.9&&(a.visible=!1)),this.axis==="Y"&&(vt.setFromEuler(fr.set(0,0,Math.PI/2)),a.quaternion.copy(i).multiply(vt),Math.abs(dt.copy(di).applyQuaternion(i).dot(this.eye))>.9&&(a.visible=!1)),this.axis==="Z"&&(vt.setFromEuler(fr.set(0,Math.PI/2,0)),a.quaternion.copy(i).multiply(vt),Math.abs(dt.copy(ms).applyQuaternion(i).dot(this.eye))>.9&&(a.visible=!1)),this.axis==="XYZE"&&(vt.setFromEuler(fr.set(0,Math.PI/2,0)),dt.copy(this.rotationAxis),a.quaternion.setFromRotationMatrix(oc.lookAt(ac,dt,di)),a.quaternion.multiply(vt),a.visible=this.dragging),this.axis==="E"&&(a.visible=!1)):a.name==="START"?(a.position.copy(this.worldPositionStart),a.visible=this.dragging):a.name==="END"?(a.position.copy(this.worldPosition),a.visible=this.dragging):a.name==="DELTA"?(a.position.copy(this.worldPositionStart),a.quaternion.copy(this.worldQuaternionStart),kt.set(1e-10,1e-10,1e-10).add(this.worldPositionStart).sub(this.worldPosition).multiplyScalar(-1),kt.applyQuaternion(this.worldQuaternionStart.clone().invert()),a.scale.copy(kt),a.visible=this.dragging):(a.quaternion.copy(i),this.dragging?a.position.copy(this.worldPositionStart):a.position.copy(this.worldPosition),this.axis&&(a.visible=this.axis.search(a.name)!==-1));continue}a.quaternion.copy(i),this.mode==="translate"||this.mode==="scale"?(a.name==="X"&&Math.abs(dt.copy(ps).applyQuaternion(i).dot(this.eye))>.99&&(a.scale.set(1e-10,1e-10,1e-10),a.visible=!1),a.name==="Y"&&Math.abs(dt.copy(di).applyQuaternion(i).dot(this.eye))>.99&&(a.scale.set(1e-10,1e-10,1e-10),a.visible=!1),a.name==="Z"&&Math.abs(dt.copy(ms).applyQuaternion(i).dot(this.eye))>.99&&(a.scale.set(1e-10,1e-10,1e-10),a.visible=!1),a.name==="XY"&&Math.abs(dt.copy(ms).applyQuaternion(i).dot(this.eye))<.2&&(a.scale.set(1e-10,1e-10,1e-10),a.visible=!1),a.name==="YZ"&&Math.abs(dt.copy(ps).applyQuaternion(i).dot(this.eye))<.2&&(a.scale.set(1e-10,1e-10,1e-10),a.visible=!1),a.name==="XZ"&&Math.abs(dt.copy(di).applyQuaternion(i).dot(this.eye))<.2&&(a.scale.set(1e-10,1e-10,1e-10),a.visible=!1)):this.mode==="rotate"&&(pr.copy(i),dt.copy(this.eye).applyQuaternion(vt.copy(i).invert()),a.name.search("E")!==-1&&a.quaternion.setFromRotationMatrix(oc.lookAt(this.eye,ac,di)),a.name==="X"&&(vt.setFromAxisAngle(ps,Math.atan2(-dt.y,dt.z)),vt.multiplyQuaternions(pr,vt),a.quaternion.copy(vt)),a.name==="Y"&&(vt.setFromAxisAngle(di,Math.atan2(dt.x,dt.z)),vt.multiplyQuaternions(pr,vt),a.quaternion.copy(vt)),a.name==="Z"&&(vt.setFromAxisAngle(ms,Math.atan2(dt.y,dt.x)),vt.multiplyQuaternions(pr,vt),a.quaternion.copy(vt))),a.visible=a.visible&&(a.name.indexOf("X")===-1||this.showX),a.visible=a.visible&&(a.name.indexOf("Y")===-1||this.showY),a.visible=a.visible&&(a.name.indexOf("Z")===-1||this.showZ),a.visible=a.visible&&(a.name.indexOf("E")===-1||this.showX&&this.showY&&this.showZ),a.material._color=a.material._color||a.material.color.clone(),a.material._opacity=a.material._opacity||a.material.opacity,a.material.color.copy(a.material._color),a.material.opacity=a.material._opacity,this.enabled&&this.axis&&(a.name===this.axis?(a.material.color.copy(this.materialLib.active.color),a.material.opacity=1):this.axis.split("").some(function(l){return a.name===l})&&(a.material.color.copy(this.materialLib.active.color),a.material.opacity=1))}super.updateMatrixWorld(e)}}class pv extends ye{constructor(){super(new Ls(1e5,1e5,2,2),new Ir({visible:!1,wireframe:!0,side:fn,transparent:!0,opacity:.1,toneMapped:!1})),this.isTransformControlsPlane=!0,this.type="TransformControlsPlane"}updateMatrixWorld(e){let t=this.space;switch(this.position.copy(this.worldPosition),this.mode==="scale"&&(t="local"),mr.copy(ps).applyQuaternion(t==="local"?this.worldQuaternion:Mr),ls.copy(di).applyQuaternion(t==="local"?this.worldQuaternion:Mr),cs.copy(ms).applyQuaternion(t==="local"?this.worldQuaternion:Mr),dt.copy(ls),this.mode){case"translate":case"scale":switch(this.axis){case"X":dt.copy(this.eye).cross(mr),vn.copy(mr).cross(dt);break;case"Y":dt.copy(this.eye).cross(ls),vn.copy(ls).cross(dt);break;case"Z":dt.copy(this.eye).cross(cs),vn.copy(cs).cross(dt);break;case"XY":vn.copy(cs);break;case"YZ":vn.copy(mr);break;case"XZ":dt.copy(cs),vn.copy(ls);break;case"XYZ":case"E":vn.set(0,0,0);break}break;case"rotate":default:vn.set(0,0,0)}vn.length()===0?this.quaternion.copy(this.cameraQuaternion):(lc.lookAt(kt.set(0,0,0),vn,dt),this.quaternion.setFromRotationMatrix(lc)),super.updateMatrixWorld(e)}}function cc(n,e,t){var s,r;if(n.dimension==="2d"&&e===2)return 0;if(n.mesh_type==="explicit"&&((s=n.mesh_coordinates)!=null&&s[e])){const a=n.mesh_coordinates[e];let o=0,l=a.length-1;for(;l-o>1;){const c=o+l>>1;a[c]<t?o=c:l=c}return Math.abs(a[o]-t)<=Math.abs(a[l]-t)?a[o]:a[l]}const i=((r=n.mesh_steps)==null?void 0:r[e])??n.mesh;return Math.round(t/i)*i}function mv(n,e,t){var a,o,l;if(n.dimension==="2d"&&e===2)return 0;const i=(a=n.boundaries)==null?void 0:a["xyz"[e]+"_"+t];if(i&&i.kind!=="pml")return 0;const s=(i==null?void 0:i.layers)??n.pml_cells,r=(o=n.mesh_coordinates)==null?void 0:o[e];return n.mesh_type==="explicit"&&r?t==="min"?r[s]-r[0]:r.at(-1)-r.at(-s-1):s*(((l=n.mesh_steps)==null?void 0:l[e])??n.mesh)}function gv(n,e,t,i){n.mesh_type??(n.mesh_type="uniform"),n.material_sampling??(n.material_sampling="cell"),n.interface_method??(n.interface_method="staircase"),n.subpixel_quadrature??(n.subpixel_quadrature=8),n.mesh_max??(n.mesh_max=.15),n.mesh_grading??(n.mesh_grading=1.25),n.mesh_ppw??(n.mesh_ppw=24),n.mesh_auto_refine??(n.mesh_auto_refine=!0),n.mesh_refinements??(n.mesh_refinements=[]);const s=n.mesh_type==="graded",r=n.mesh_type==="explicit",a=!!n.mesh_steps;return t("mesh type","mesh_type",n.mesh_type,[["uniform","Uniform"],["graded","Graded · local refinement"],...r?[["explicit","Explicit node arrays"]]:[]])+(r?'<p class="property-help">Frozen node arrays. Geometry edits keep these nodes. Edit the arrays or select a generated mesh to change the grid.</p>':`<label class="enabled-row"><input type="checkbox" data-axis-steps ${a?"checked":""}> Independent axis spacing</label>`+(a?n.mesh_steps.map((o,l)=>e("d"+"xyz"[l],`mesh_steps.${l}`,o,"µm",{min:.001})).join(""):e(s?"fine mesh step":"dx = dy = dz","mesh",n.mesh,"µm",{min:.001})))+t("interface method","interface_method",n.interface_method,[["staircase","Staircase"],["subpixel","Subpixel · experimental dielectric"]])+t("interface sampling","material_sampling",n.material_sampling,s||r||a||n.interface_method==="subpixel"?[["yee","Yee component locations"]]:[["cell","Cell centers (legacy)"],["yee","Yee component locations"]])+(n.interface_method==="subpixel"?e("face quadrature order","subpixel_quadrature",n.subpixel_quadrature,"",{min:2,max:32,step:1})+'<p class="property-help">Lossless dielectrics and constant spacing on each axis only. Compare quadrature orders and mesh refinement. Curved-interface accuracy is under validation, especially at high index contrast.</p>':"")+`<label class="enabled-row"><input type="checkbox" data-fixed-dt ${n.time_step_override?"checked":""}> Set a smaller fixed time step</label>`+(n.time_step_override?e("time step","time_step_override",n.time_step_override*1e15,"fs",{min:1e-6,scale:1e-15}):"")+(s?e("maximum step","mesh_max",n.mesh_max,"µm",{min:n.mesh})+e("grading factor","mesh_grading",n.mesh_grading,"",{min:1.05})+e("background cells / λ","mesh_ppw",n.mesh_ppw,"",{min:6})+`<label class="enabled-row"><input type="checkbox" data-path="mesh_auto_refine" ${n.mesh_auto_refine?"checked":""}> Refine structures, sources and monitors</label><p class="property-help">Fine spacing is retained in refinement regions and PML. The wavelength setting caps the background step. The timestep stays fixed by the fine spacing.</p>`+n.mesh_refinements.map((o,l)=>`<details class="boundary-options"><summary>${i(o.name)}</summary><label class="enabled-row"><input type="checkbox" data-path="mesh_refinements.${l}.enabled" ${o.enabled?"checked":""}> Enabled</label>${o.center.map((c,h)=>e("xyz"[h],`mesh_refinements.${l}.center.${h}`,c,"µm")).join("")}${o.size.map((c,h)=>e("xyz"[h]+" span",`mesh_refinements.${l}.size.${h}`,c,"µm",{min:.001})).join("")}<button data-action="mesh-remove" data-index="${l}">Remove refinement</button></details>`).join("")+'<button data-action="mesh-add">+ Add refinement region</button><button data-action="mesh-freeze">Freeze automatic refinements</button>':"")+`<button data-action="mesh-nodes">Edit explicit node arrays</button><button data-action="mesh-preview">Preview simulation mesh</button><p class="property-help">Yee sampling places materials at each electric field component. ${n.interface_method==="subpixel"?"Subpixel also couples neighboring components across interfaces. The permittivity image shows only the reciprocal diagonal of that operator.":"Staircase interfaces follow the grid."} Test mesh convergence for the required accuracy.</p>`}function _v({state:n,api:e,esc:t,commit:i}){const s=document.createElement("dialog");s.className="mesh-dialog",document.body.append(s);let r,a="xy";const o=c=>s.querySelector(c);function l(){const c=o("canvas"),h=c.getContext("2d");c.width=1e3,c.height=600;const[u,f]=[...a].map(S=>"xyz".indexOf(S)),m=r.nodes_um,_=m[u],v=m[f],p=_.at(-1)-_[0],d=v.at(-1)-v[0],x=Math.min(880/p,480/d),y=(1e3-p*x)/2,g=(600-d*x)/2,w=S=>y+(S-_[0])*x,T=S=>g+(v.at(-1)-S)*x;h.fillStyle="#101c2b",h.fillRect(0,0,1e3,600);for(const S of r.refinements)h.fillStyle="rgba(71,191,169,.13)",h.fillRect(w(S.center[u]-S.size[u]/2),T(S.center[f]+S.size[f]/2),S.size[u]*x,S.size[f]*x);h.save(),h.beginPath(),h.rect(y,g,p*x,d*x),h.clip(),h.strokeStyle="#7087a56e",h.lineWidth=.7,h.beginPath();for(const S of _)h.moveTo(w(S),g),h.lineTo(w(S),g+d*x);for(const S of v)h.moveTo(y,T(S)),h.lineTo(y+p*x,T(S));h.stroke();for(const S of r.structures)h.strokeStyle="#ecb86a",h.lineWidth=2,h.strokeRect(w(S.center[u]-S.size[u]/2),T(S.center[f]+S.size[f]/2),S.size[u]*x,S.size[f]*x);h.restore(),h.fillStyle="#d9e7f5",h.font="15px system-ui",h.textAlign="center",h.fillText(`${a[0]} (µm) · ${_[0].toPrecision(4)} … ${_.at(-1).toPrecision(4)}`,500,585),h.save(),h.translate(20,300),h.rotate(-Math.PI/2),h.fillText(`${a[1]} (µm) · ${v[0].toPrecision(4)} … ${v.at(-1).toPrecision(4)}`,0,0),h.restore()}return{async open(){r=await e("/mesh/preview",n.project);const c=r.summary;s.innerHTML=`<div class="fsp-heading"><h2>Simulation mesh</h2><button data-dismiss>Close</button></div><div class="mesh-metrics"><strong>${c.shape.join(" × ")} cells</strong><span>${c.cell_reduction_percent.toFixed(1)}% fewer cells than uniform</span><span>~${c.estimated_memory_mb} MB · Δt ${c.dt_fs.toFixed(4)} fs</span></div><label>Projection <select aria-label="Mesh projection">${(n.project.region.dimension==="2d"?["xy"]:["xy","xz","yz"]).map(h=>`<option>${h}</option>`).join("")}</select></label><canvas aria-label="Simulation mesh grid"></canvas><p>Gold: structure bounds. Green: refinement bounds projected onto this view. Grid lines show actual cell boundaries${r.preview_decimated?" (preview decimated to 1,000 lines per axis)":""}. Refinements extend across coordinate planes.</p><p>Step range: ${c.axis_min_step_um.map((h,u)=>`${"xyz"[u]} ${h.toPrecision(4)}–${c.axis_max_step_um[u].toPrecision(4)} µm`).join(" · ")}. Largest adjacent ratio: ${c.max_adjacent_ratio.toFixed(3)}.</p>`,a="xy",o("[data-dismiss]").onclick=()=>s.close(),o("select").onchange=h=>{a=h.target.value,l()},s.showModal(),l()},async freeze(){const c=await e("/mesh/freeze",n.project);i(c)},async editNodes(){const{nodes_um:c}=await e("/mesh/coordinates",n.project);s.innerHTML='<div class="fsp-heading"><h2>Explicit mesh nodes</h2><button data-dismiss>Close</button></div><p>Coordinates in µm. Each axis must increase strictly and be centered on zero. Array endpoints set the domain spans. In 2D, z needs exactly two endpoints. Changing geometry will keep this grid.</p>'+c.map((h,u)=>`<label>${"xyz"[u]} nodes (µm)<textarea aria-label="${"xyz"[u]} mesh nodes" data-node-axis="${u}" rows="5" style="width:100%">${h.join(", ")}</textarea></label>`).join("")+'<p data-node-error role="alert"></p><button data-apply-nodes>Apply node arrays</button>',o("[data-dismiss]").onclick=()=>s.close(),o("[data-apply-nodes]").onclick=async()=>{try{const h=[...s.querySelectorAll("[data-node-axis]")].map(m=>m.value.trim().split(/[\s,]+/).filter(Boolean).map(Number));if(h.some(m=>m.length<2||m.some(_=>!Number.isFinite(_))))throw Error("Enter at least two finite numbers for each axis.");const u=structuredClone(n.project);Object.assign(u.region,{mesh_type:"explicit",mesh_steps:null,mesh_coordinates:h,size:h.map(m=>m.at(-1)-m[0]),material_sampling:"yee",mesh_auto_refine:!1});const f=await e("/validate",u);i(f.project),s.close()}catch(h){o("[data-node-error]").textContent=h.message}},s.showModal()},add(){const c=structuredClone(n.project);c.region.mesh_refinements.push({name:`Refinement ${c.region.mesh_refinements.length+1}`,center:[0,0,0],size:[1,1,1],enabled:!0}),i(c)},remove(c){const h=structuredClone(n.project);h.region.mesh_refinements.splice(c,1),i(h)}}}function Nr(n){return n.rotation??(n.rotation=0),n.rotation_axes??(n.rotation_axes=["z","x","y"]),n.rotation_angles??(n.rotation_angles=[0,0,0]),n.make_ellipsoid??(n.make_ellipsoid=!1),n.radius_2??(n.radius_2=.5),n.radius_3??(n.radius_3=.5),n.inner_radius_2??(n.inner_radius_2=.3),n.theta_start??(n.theta_start=0),n.theta_stop??(n.theta_stop=360),n.vertices??(n.vertices=[[-.5,-.5],[.5,-.5],[0,.5]]),n}function vv(n){const e=new ct().makeRotationZ((n.rotation||0)*Math.PI/180);return(n.rotation_axes||["z","x","y"]).forEach((t,i)=>{var r;if(t==="none")return;const s=new L;s.setComponent("xyz".indexOf(t),1),e.premultiply(new ct().makeRotationAxis(s,(((r=n.rotation_angles)==null?void 0:r[i])||0)*Math.PI/180))}),e}function xv(n){const e=n.radius,t=n.make_ellipsoid?n.radius_2:e,i=n.make_ellipsoid?n.radius_3:e;if(n.kind==="rectangle")return new Mt(...n.size);if(n.kind==="sphere")return new Ds(1,48,32).scale(e,t,i);if(n.kind==="circle")return new Ft(1,1,n.size[2],96).rotateX(Math.PI/2).scale(e,t,1);let s;if(n.kind==="polygon")s=new yr(n.vertices.map(r=>new oe(...r)));else if(n.kind==="ring"){const r=(n.theta_stop??360)-(n.theta_start??0),a=(r%360+360)%360||360,o=a===360,l=Math.max(3,Math.ceil(96*a/360)),c=(f,m)=>Array.from({length:o?l:l+1},(_,v)=>{const p=((n.theta_start??0)+a*v/l)*Math.PI/180,d=Math.cos(p),x=Math.sin(p),y=1/Math.sqrt((d/f)**2+(x/m)**2);return new oe(y*d,y*x)}),h=c(e,t),u=n.inner_radius>0?c(n.inner_radius,n.make_ellipsoid?n.inner_radius_2:n.inner_radius):[];o?(s=new yr(h),u.length&&s.holes.push(new go(u.reverse()))):s=new yr([...h,...u.length?u.reverse():[new oe(0,0)]])}if(!s)throw Error("Unsupported CAD solid: "+n.kind);return new No(s,{depth:n.size[2],steps:1,bevelEnabled:!1}).translate(0,0,-n.size[2]/2)}const hi=new Map;function ah(n){Nr(n);const e=JSON.stringify([n.kind,n.size,n.radius,n.inner_radius,n.make_ellipsoid,n.radius_2,n.radius_3,n.inner_radius_2,n.theta_start,n.theta_stop,n.vertices,n.rotation,n.rotation_axes,n.rotation_angles]);if(hi.has(e))return hi.get(e);const t=xv(n).applyMatrix4(vv(n)),i=t.index?t.toNonIndexed():t.clone(),s=new po(t,20),r={geometry:t,points:Array.from(i.attributes.position.array),edges:Array.from(s.attributes.position.array),projections:{}};if(i.dispose(),s.dispose(),hi.set(e,r),hi.size>128){const a=hi.keys().next().value;hi.get(a).geometry.dispose(),hi.delete(a)}return r}function yv(n){return ah(n).geometry.clone()}function oh(n,e){const t=ah(n),i=e.join("");if(t.projections[i])return t.projections[i];const s=[],r=[];let a=1/0,o=-1/0;for(let l=0;l<t.points.length;l+=9){const c=[0,3,6].map(u=>[t.points[l+u+e[0]],t.points[l+u+e[1]]]),h=(c[1][0]-c[0][0])*(c[2][1]-c[0][1])-(c[1][1]-c[0][1])*(c[2][0]-c[0][0]);if(!(Math.abs(h)<1e-18)){h<0&&([c[1],c[2]]=[c[2],c[1]]),s.push(c);for(const u of c)a=Math.min(a,u[1]),o=Math.max(o,u[1])}}for(let l=0;l<t.edges.length;l+=6)r.push([0,3].map(c=>[t.edges[l+c+e[0]],t.edges[l+c+e[1]]]));return t.projections[i]={triangles:s,edges:r,low:a,high:o}}function bv(n,e,t,i){const s=[e[0]-n.center[t[0]],e[1]-n.center[t[1]]],r=oh(n,t);return r.triangles.some(a=>a.every((o,l)=>{const c=a[(l+1)%3];return(c[0]-o[0])*(s[1]-o[1])-(c[1]-o[1])*(s[0]-o[0])>=-1e-12}))?!0:r.edges.some(([a,o])=>{const l=o[0]-a[0],c=o[1]-a[1],h=l*l+c*c,u=h?Math.max(0,Math.min(1,((s[0]-a[0])*l+(s[1]-a[1])*c)/h)):0;return Math.hypot(s[0]-a[0]-u*l,s[1]-a[1]-u*c)<=i})}function Mv(n,e){Nr(n);let t="";return["circle","sphere","ring"].includes(n.kind)&&(t+=`<label class="enabled-row"><input type="checkbox" data-path="make_ellipsoid" ${n.make_ellipsoid?"checked":""}> Elliptical radii</label>`,n.make_ellipsoid&&(t+=e("radius 2","radius_2",n.radius_2,"µm",{min:.001})+(n.kind==="sphere"?e("radius 3","radius_3",n.radius_3,"µm",{min:.001}):"")+(n.kind==="ring"?e("inner radius 2","inner_radius_2",n.inner_radius_2,"µm",{min:0}):""))),n.kind==="ring"&&(t+=e("theta start","theta_start",n.theta_start,"deg")+e("theta stop","theta_stop",n.theta_stop,"deg")+'<p class="property-help">Counterclockwise arc in the local XY plane, wrapping through 360°. Angles are polar angles even for elliptical rings.</p>'),n.kind==="polygon"&&(t+=`<button data-action="geometry-vertices">Edit polygon vertices</button><p class="property-help">${n.vertices.length} local XY vertices, extruded along local z. One simple contour without holes.</p>`),t}function Sv(n,e,t){return Nr(n),e("z rotation","rotation",n.rotation,"deg")+n.rotation_axes.map((i,s)=>t(["first","second","third"][s]+" axis",`rotation_axes.${s}`,i,["none","x","y","z"])+e("rotation "+(s+1),`rotation_angles.${s}`,n.rotation_angles[s],"deg")).join("")+'<p class="property-help">Right-handed rotations about fixed world axes. Apply the legacy z angle, then rotations 1, 2 and 3 about the object center. CAD views show projections. A 2D calculation samples z = 0.</p>'}function Ev({state:n,api:e,esc:t,commit:i}){const s=document.createElement("dialog");return s.className="geometry-dialog",document.body.append(s),{open(r){const a=n.project.structures.find(o=>o.id===r);!a||a.kind!=="polygon"||(s.innerHTML=`<div class="fsp-heading"><h2>Polygon vertices</h2><button data-dismiss>Close</button></div><p>Local x, y pairs in µm, one pair per line. Clockwise or counterclockwise. Do not repeat the first vertex.</p><textarea aria-label="Polygon vertices" rows="12" style="width:100%;font-family:monospace">${t(a.vertices.map(o=>o.join(", ")).join(`
`))}</textarea><p role="alert"></p><button data-apply>Apply vertices</button>`,s.querySelector("[data-dismiss]").onclick=()=>s.close(),s.querySelector("[data-apply]").onclick=async()=>{try{const o=s.querySelector("textarea").value.trim().split(/\r?\n/).map(h=>h.trim().split(/[\s,]+/).map(Number));if(o.some(h=>h.length!==2||h.some(u=>!Number.isFinite(u))))throw Error("Each row needs two finite numbers.");const l=structuredClone(n.project);l.structures.find(h=>h.id===r).vertices=o;const c=await e("/validate",l);i(c.project),s.close()}catch(o){s.querySelector('[role="alert"]').textContent=o.message}},s.showModal())}}}const Un={region:"#d2a129",source:"#d44955",monitor:"#e3a72c",selected:"#187be7"};class wv{constructor(e,t,i,s,r){this.state=t,this.select=i,this.change=s,this.edited=r,this.zoom={xy:1,xz:1,yz:1},this.canvases={},e.innerHTML=["xy","perspective","xz","yz"].map(a=>`<div class="viewport ${a}" data-view="${a}"><div class="view-label">${a==="perspective"?"Perspective":a.toUpperCase()+" plane"}<span>${a==="perspective"?"Orbit · left drag / Pan · right drag":"Select · drag to move / scroll to zoom"}</span></div>${a!=="perspective"?"<canvas></canvas>":'<div class="three-view"></div>'}</div>`).join("");for(const[a,o]of Object.entries({xy:[0,1],xz:[0,2],yz:[1,2]})){const l=e.querySelector(`.${a} canvas`);this.canvases[a]={canvas:l,axes:o},l.addEventListener("wheel",c=>{c.preventDefault(),this.zoom[a]=Math.max(.5,Math.min(8,this.zoom[a]*Math.exp(-c.deltaY*.001))),this.draw2d(a)},{passive:!1}),l.addEventListener("pointerdown",c=>this.down(c,a)),l.addEventListener("pointermove",c=>this.move(c,a)),l.addEventListener("pointerup",c=>this.up(c,a)),l.addEventListener("dblclick",()=>{var c;return(c=document.querySelector("#properties input"))==null?void 0:c.focus()})}this.initThree(e.querySelector(".three-view")),this.resizeObserver=new ResizeObserver(()=>this.render()),this.resizeObserver.observe(e)}objects(){const e=this.state.project;return[...e.structures.map(t=>({...t,category:"structure"})),...e.sources.map(t=>({...t,category:"source"})),...e.monitors.map(t=>({...t,category:"monitor"}))]}bounds(e){return e.kind==="sphere"?[e.radius*2,e.radius*2,e.radius*2]:["circle","ring"].includes(e.kind)?[e.radius*2,e.radius*2,e.size[2]]:e.size||[.12,.12,.12]}metrics(e){const{canvas:t,axes:i}=this.canvases[e],s=t.getBoundingClientRect(),r=this.state.project.region.size;return{w:s.width,h:s.height,scale:Math.min((s.width-65)/r[i[0]],(s.height-50)/r[i[1]])*.84*this.zoom[e],axes:i}}world(e,t){const{canvas:i}=this.canvases[t],s=i.getBoundingClientRect(),r=this.metrics(t);return[(e.clientX-s.left-r.w/2)/r.scale,-(e.clientY-s.top-r.h/2)/r.scale]}hit(e,t,i,s){if(e.category==="structure")return bv(e,t,i,s);const r=this.bounds(e);let a=t[0]-e.center[i[0]],o=t[1]-e.center[i[1]];if(i[0]===0&&i[1]===1&&e.category==="structure"){if(["circle","sphere","ring"].includes(e.kind)){const c=Math.hypot(a,o);return c<=e.radius+s&&(e.kind!=="ring"||c>=e.inner_radius-s)}const l=(e.rotation||0)*Math.PI/180;[a,o]=[Math.cos(l)*a+Math.sin(l)*o,-Math.sin(l)*a+Math.cos(l)*o]}return Math.abs(a)<=Math.max(r[i[0]]/2,s)&&Math.abs(o)<=Math.max(r[i[1]]/2,s)}down(e,t){if(e.button!==0)return;const i=this.metrics(t),s=this.world(e,t),a=this.objects().filter(o=>o.enabled).reverse().find(o=>this.hit(o,s,i.axes,7/i.scale));this.select((a==null?void 0:a.id)||"fdtd"),a&&this.state.mode==="layout"&&(this.drag={id:a.id,start:s,center:[...a.center],axes:i.axes,name:t,moved:!1},e.target.setPointerCapture(e.pointerId))}move(e,t){if(!this.drag||this.drag.name!==t)return;const i=this.world(e,t),s=this.drag,r=this.state.project,a=[...s.center];s.axes.forEach((o,l)=>{if(o===2&&r.region.dimension==="2d")return;const c=s.center[o]+i[l]-s.start[l];a[o]=this.state.snap?cc(r.region,o,c):c}),!(!s.moved&&Math.hypot(i[0]-s.start[0],i[1]-s.start[1])<.02)&&(s.moved||this.edited(),s.moved=!0,this.change(s.id,{center:a},!1),this.render())}up(){var e;(e=this.drag)!=null&&e.moved&&this.change(this.drag.id,{},!0),this.drag=null}draw2d(e){const{canvas:t,axes:i}=this.canvases[e],s=this.metrics(e),r=this.state.project;if(s.w<1||s.h<1)return;const a=window.devicePixelRatio||1;t.width=s.w*a,t.height=s.h*a;const o=t.getContext("2d");o.scale(a,a),o.fillStyle="#fafbfd",o.fillRect(0,0,s.w,s.h);const l=S=>s.w/2+S*s.scale,c=S=>s.h/2-S*s.scale,h=45/s.scale,u=10**Math.floor(Math.log10(h)),f=[1,2,5,10].find(S=>S*u>=h)*u,m=Math.max(0,-Math.floor(Math.log10(f)));o.font="10px ui-monospace, monospace",o.textAlign="center";for(let S=0;S<2;S++){const R=(S===0?s.w:s.h)/s.scale;for(let M=Math.ceil(-R/2/f)*f;M<=R/2;M+=f){const b=S===0?l(M):c(M);o.strokeStyle=Math.abs(M)<1e-7?"#bac8d8":"#e6ebf2",o.lineWidth=1,o.beginPath(),S===0?(o.moveTo(b,0),o.lineTo(b,s.h),o.fillStyle="#8b98a9",o.fillText(M.toFixed(m),b,s.h-9)):(o.moveTo(0,b),o.lineTo(s.w,b),o.fillStyle="#8b98a9",o.fillText(M.toFixed(m),18,b-4)),o.stroke()}}const _=r.region.size[i[0]]*s.scale,v=r.region.size[i[1]]*s.scale,p=s.w/2-_/2,d=s.h/2-v/2;o.fillStyle="#f0c85612",o.fillRect(p,d,_,v),o.strokeStyle=Un.region,o.setLineDash([6,4]),o.strokeRect(p,d,_,v),o.setLineDash([]);const x=(S,R)=>mv(r.region,S,R)*s.scale,y=x(i[0],"min"),g=x(i[0],"max"),w=x(i[1],"min"),T=x(i[1],"max");o.fillStyle="#d8ae3d12",o.fillRect(p,d,_,T),o.fillRect(p,d+v-w,_,w),o.fillRect(p,d,y,v),o.fillRect(p+_-g,d,g,v);for(const S of this.objects()){if(!S.enabled)continue;const R=this.bounds(S),M=l(S.center[i[0]]),b=c(S.center[i[1]]),C=Math.max(R[i[0]]*s.scale,3),I=Math.max(R[i[1]]*s.scale,3),B=S.id===this.state.selected,H=r.materials.find(k=>k.name===S.material);if(o.save(),o.translate(M,b),o.strokeStyle=B?Un.selected:S.category==="source"?Un.source:S.category==="monitor"?Un.monitor:(H==null?void 0:H.color)||"#69a1e8",o.lineWidth=B?2:1.5,o.fillStyle=S.kind==="tfsf"?"#3ba89710":S.category==="structure"?((H==null?void 0:H.color)||"#69a1e8")+"55":"#ffffff88",o.beginPath(),S.kind==="tfsf"&&o.setLineDash([5,3]),S.category==="structure"){const k=oh(S,i);for(const W of k.triangles){o.moveTo(W[0][0]*s.scale,-W[0][1]*s.scale);for(const q of W.slice(1))o.lineTo(q[0]*s.scale,-q[1]*s.scale);o.closePath()}o.fill(),o.beginPath();for(const[W,q]of k.edges)o.moveTo(W[0]*s.scale,-W[1]*s.scale),o.lineTo(q[0]*s.scale,-q[1]*s.scale);o.stroke(),B&&(o.fillStyle=Un.selected,o.font="11px Inter,Segoe UI,sans-serif",o.fillText(S.name,0,-k.high*s.scale-9))}else S.category==="monitor"&&S.kind!=="field"?(o.moveTo(-7,0),o.lineTo(7,0),o.moveTo(0,-7),o.lineTo(0,7),o.stroke(),o.beginPath(),o.arc(0,0,4,0,2*Math.PI),o.stroke()):S.category==="source"&&S.kind==="point"?(o.arc(0,0,5,0,2*Math.PI),o.fillStyle=Un.source,o.fill(),o.stroke()):(e==="xy"&&["circle","ring"].includes(S.kind)||S.kind==="sphere"?(o.ellipse(0,0,C/2,I/2,0,0,Math.PI*2),S.kind==="ring"&&o.ellipse(0,0,S.inner_radius*s.scale,S.inner_radius*s.scale,0,0,Math.PI*2,!0)):o.rect(-C/2,-I/2,C,I),o.fill("evenodd"),o.stroke());B&&S.category!=="structure"&&(o.fillStyle="#187be7",o.font="11px Inter,Segoe UI,sans-serif",o.fillText(S.name,0,-I/2-9)),o.restore()}o.fillStyle="#617187",o.textAlign="right",o.font="10px Segoe UI",o.fillText(`${"xyz"[i[0]]} / ${"xyz"[i[1]]} (µm)`,s.w-10,s.h-9),r.region.dimension==="2d"&&e!=="xy"&&(o.fillStyle="#8591a2",o.textAlign="left",o.fillText("2D: simulation at z = 0",10,18))}initThree(e){this.host=e,this.scene=new md,this.scene.background=new je("#f3f6fa"),this.camera=new ln(40,1,.01,1e3),this.camera.up.set(0,0,1),this.camera.position.set(10,-12,10),this.renderer=new $_({antialias:!0}),this.renderer.setPixelRatio(Math.min(devicePixelRatio,2)),e.appendChild(this.renderer.domElement),this.orbit=new j_(this.camera,this.renderer.domElement),this.orbit.enableDamping=!0,this.scene.add(new tf(16777215,10728907,2.5));const t=new rf(16777215,2);t.position.set(5,-3,8),this.scene.add(t),this.scene.add(new lf(1.5)),this.group=new us,this.scene.add(this.group),this.transform=new av(this.camera,this.renderer.domElement),this.scene.add(this.transform.getHelper()),this.transform.addEventListener("dragging-changed",r=>{this.orbit.enabled=!r.value,r.value?this.edited():this.transform.object&&this.change(this.transform.object.userData.id,{},!0)}),this.transform.addEventListener("objectChange",()=>{const r=this.transform.object;if(!r)return;let a=r.position.toArray();this.state.snap&&(a=a.map((o,l)=>cc(this.state.project.region,l,o))),this.change(r.userData.id,{center:a},!1);for(const o of Object.keys(this.canvases))this.draw2d(o)});let i;this.renderer.domElement.addEventListener("pointerdown",r=>{i=[r.clientX,r.clientY]}),this.renderer.domElement.addEventListener("pointerup",r=>{if(!i||Math.hypot(r.clientX-i[0],r.clientY-i[1])>4||this.transform.axis)return;const a=e.getBoundingClientRect(),o=new Kc;o.setFromCamera(new oe((r.clientX-a.left)/a.width*2-1,-(r.clientY-a.top)/a.height*2+1),this.camera);const l=o.intersectObjects(this.group.children,!0).find(c=>c.object.userData.id);l&&this.select(l.object.userData.id)});const s=()=>{requestAnimationFrame(s),this.orbit.update(),this.renderer.render(this.scene,this.camera)};s()}renderThree(){var a;if(this.transform.dragging)return;this.transform.detach(),this.group.traverse(o=>{var l;if((l=o.geometry)==null||l.dispose(),o.material)for(const c of Array.isArray(o.material)?o.material:[o.material])c.dispose()}),this.group.clear();const e=this.state.project,t=new Rr(new po(new Mt(...e.region.size)),new Zi({color:Un.region}));this.group.add(t);const i=new of(Math.max(...e.region.size)*1.4,20,"#b7c5d5","#dfe6ee");i.rotateX(Math.PI/2),i.position.z=-e.region.size[2]/2,this.group.add(i);for(const o of this.objects()){if(!o.enabled)continue;let l;o.category==="structure"?l=yv(o):o.category==="monitor"&&o.kind!=="field"||o.kind==="point"?l=new Ds(.07,12,8):l=new Mt(...(o.size||[.1,.1,.1]).map(u=>Math.max(u,.02)));const c=o.category==="source"?Un.source:o.category==="monitor"?Un.monitor:((a=e.materials.find(u=>u.name===o.material))==null?void 0:a.color)||"#69a1e8",h=new ye(l,new Kd({color:c,transparent:!0,opacity:o.kind==="tfsf"?.08:o.category==="structure"?.66:.9,roughness:.5,metalness:.08,side:fn}));h.position.fromArray(o.center),h.userData.id=o.id,h.add(new Rr(new po(l),new Zi({color:o.id===this.state.selected?"#147be7":c,transparent:!0,opacity:.7}))),this.group.add(h),o.id===this.state.selected&&this.state.mode==="layout"&&(this.transform.attach(h),this.transform.showZ=e.region.dimension!=="2d",this.transform.setTranslationSnap(this.state.snap&&!e.region.mesh_steps&&e.region.mesh_type!=="explicit"?e.region.mesh:null))}const{width:s,height:r}=this.host.getBoundingClientRect();s>0&&r>0&&(this.camera.aspect=s/r,this.camera.updateProjectionMatrix(),this.renderer.setSize(s,r))}fit(){this.zoom={xy:1,xz:1,yz:1};const e=Math.max(...this.state.project.region.size);this.camera.position.set(e*1.15,-e*1.4,e*1.05),this.orbit.target.set(0,0,0),this.render()}render(){for(const e of Object.keys(this.canvases))this.draw2d(e);this.renderThree()}}function Tv(n,e,t,i,s=null,r="reduced field"){const a=n.getBoundingClientRect(),o=devicePixelRatio||1;n.width=a.width*o,n.height=a.height*o;const l=n.getContext("2d");if(l.scale(o,o),l.fillStyle="#f8fafc",l.fillRect(0,0,a.width,a.height),!(e!=null&&e.length)){l.fillStyle="#718196",l.font="14px Segoe UI",l.textAlign="center",l.fillText("Run a simulation to visualize the field",a.width/2,a.height/2);return}const c=e.length,h=e[0].length,u=document.createElement("canvas");u.width=c,u.height=h;const f=u.getContext("2d"),m=f.createImageData(c,h);let _=s||Math.max(...e.flat().map(Math.abs),1e-20);for(let g=0;g<c;g++)for(let w=0;w<h;w++){const T=Math.max(-1,Math.min(1,e[g][w]/_)),S=((h-1-w)*c+g)*4;m.data[S]=T>0?250:Math.round(246+T*210),m.data[S+1]=Math.round(248-Math.abs(T)*184),m.data[S+2]=T<0?250:Math.round(248-T*207),m.data[S+3]=255}f.putImageData(m,0,0);const v=Math.min((a.width-110)/t[0],(a.height-80)/t[1]),p=t[0]*v,d=t[1]*v,x=(a.width-p)/2,y=(a.height-d)/2;l.imageSmoothingEnabled=!1,l.drawImage(u,x,y,p,d),l.strokeStyle="#c4cfdb",l.strokeRect(x,y,p,d),l.fillStyle="#607086",l.font="11px ui-monospace,monospace",l.textAlign="center",l.fillText(`${-t[0]/2}`,x,y+d+18),l.fillText("0",x+p/2,y+d+18),l.fillText(`${t[0]/2} µm`,x+p,y+d+18),l.textAlign="right",l.fillText(`${t[1]/2}`,x-8,y+8),l.fillText(`${-t[1]/2}`,x-8,y+d),l.textAlign="left",l.fillText(`${i} · ±${_.toExponential(2)} (${r})`,x,y-13)}function Is(n,e,t=!1,i=!1){const s=n.getBoundingClientRect(),r=devicePixelRatio||1;n.width=s.width*r,n.height=s.height*r;const a=n.getContext("2d");if(a.scale(r,r),a.clearRect(0,0,s.width,s.height),!(e!=null&&e.length)){a.fillStyle="#8491a2",a.font="12px Segoe UI",a.fillText("Point monitor signals appear after a run.",30,35);return}const o=g=>t?i?g.wavelength_um:g.frequency_thz:g.time_fs,l=s.width-75,c=s.height-48,h=55,u=15,f=e.flatMap(g=>t?g.spectrum:g.signal),m=e.flatMap(o),_=f.reduce((g,w)=>Number.isFinite(w)?Math.max(g,Math.abs(w)):g,0)||1,v=t?m.reduce((g,w)=>Math.min(g,w),1/0):0,p=m.reduce((g,w)=>Math.max(g,w),v+1e-6),d=t&&!e.some(g=>g.signed)?0:-_;a.strokeStyle="#e0e6ed",a.font="10px monospace",a.fillStyle="#738197";for(let g=0;g<=4;g++){const w=u+g*c/4;a.beginPath(),a.moveTo(h,w),a.lineTo(h+l,w),a.stroke(),a.fillText((_-(_-d)*g/4).toExponential(1),2,w+3),a.fillText((v+(p-v)*g/4).toFixed(i&&t?2:0),h+l*g/4-7,u+c+17)}e.forEach((g,w)=>{const T=o(g),S=t?g.spectrum:g.signal;a.strokeStyle=["#237ddd","#e39127","#875adb","#22a184"][w%4],a.beginPath();let R=!1;T.forEach((M,b)=>{if(!Number.isFinite(S[b])){R=!1;return}const C=h+(M-v)/(p-v)*l,I=u+(_-S[b])/(_-d)*c;R?a.lineTo(C,I):a.moveTo(C,I),R=!0}),a.stroke(),T.length===1&&(a.beginPath(),a.arc(h,u+(_-S[0])/(_-d)*c,3,0,2*Math.PI),a.fillStyle=a.strokeStyle,a.fill()),a.fillStyle=a.strokeStyle,a.fillText(g.name,h+10+w*120,12),!t&&g.window&&(a.strokeStyle="#24a79b",a.setLineDash([3,3]),a.beginPath(),T.forEach((M,b)=>{const C=h+(M-v)/(p-v)*l,I=u+(1-g.window[b])*c/2;b?a.lineTo(C,I):a.moveTo(C,I)}),a.stroke(),a.setLineDash([]))});const x=e[0],y=x.spectrum_settings;a.fillStyle="#728296",a.textAlign="right",a.fillText(t?x.spectrum_label||`${i?"Wavelength (µm)":"Frequency (THz)"} · ${(y==null?void 0:y.apodization)||"hann"} · |${(y==null?void 0:y.sampling)==="fft"?"FFT":"DFT"}| (${x.spectrum_units||"reduced field"})`:x.time_label||`Time (fs) · real field${x.window?"; dashed: window (0–1)":""}`,s.width-20,s.height-3)}function Av({esc:n,toast:e,log:t}){const i=document.createElement("dialog");i.id="fsp-dialog",document.body.append(i);const s=document.createElement("input");s.type="file",s.accept=".fsp",s.hidden=!0,document.body.append(s);let r=null,a="",o=!1,l="",c=new Map;async function h(g,w){const T=await fetch("/api/fsp"+g,w),S=await T.json();if(!T.ok)throw Error(typeof S.detail=="string"?S.detail:JSON.stringify(S.detail));return S}function u(){if(!(r!=null&&r.inspection))return[];const g=r.inspection;return[...g.objects.map(w=>({...w,editable:!0})),...Object.entries(g.globals).map(([w,T])=>({id:"Global "+w,...T})),...Object.entries(g.referenced_materials).map(([w,T])=>({id:"Material: "+w,...T}))]}function f(){return u().find(g=>g.id===a)}function m(g,w){return JSON.stringify([g,w])}function _(g){i.querySelector("#fsp-status").textContent=g}function v(){const g=r==null?void 0:r.inspection;i.innerHTML=`<div class="fsp-heading"><div><h2>FSP project inspector</h2><span>${n((r==null?void 0:r.filename)||"Open a Lumerical project")}</span></div><button data-fsp="close" aria-label="Close FSP inspector">Close</button></div>
   <p class="fsp-notice">Installed Lumerical bridge · <strong>Native GPU execution unavailable</strong><br>Original settings are retained. Values below use Lumerical SI units: metres, seconds and Hz. Edited exports clear saved simulation results.</p>
   <div class="fsp-toolbar"><button data-fsp="open" ${o?"disabled":""}>Open .fsp</button><button data-fsp="original" ${!g||o?"disabled":""}>Download original .fsp</button><button data-fsp="archive" ${!g||o?"disabled":""}>Preservation archive</button><button data-fsp="export" ${!c.size||o?"disabled":""}>Save edited .fsp <span id="fsp-patch-count">(${c.size})</span></button></div>
   <div id="fsp-status" role="status">${o?"Reading with Lumerical…":g?`${g.objects.length} objects · Lumerical ${n(g.bridge.vendor_version)} · ${c.size} pending edits`:"Select an FSP file. The GPU workstation reads it in a separate Lumerical session."}</div>
   <div class="fsp-body"><div id="fsp-tree">${u().map(w=>`<button data-fsp-object="${n(w.id)}" class="${a===w.id?"active":""}"><span>${n(w.id)}</span><small>${n(w.properties.type||"Settings")}</small></button>`).join("")}</div><section class="fsp-details"><input id="fsp-filter" placeholder="Filter properties (e.g. wavelength, pml, apodization)" aria-label="Filter FSP properties" value="${n(l)}"><div id="fsp-properties"></div></section></div>
   ${g?`<details class="fsp-diagnostics"><summary>Native compatibility: ${g.native_execution.issues.length} unresolved items</summary><ul>${g.native_execution.issues.map(w=>`<li><b>${n(w.object_id||"Project")}</b>: ${n(w.message)}</li>`).join("")}${g.read_diagnostics.map(w=>`<li>${n(w.object_id)}: ${n(w.message)}</li>`).join("")}</ul></details>`:""}`,p(),i.querySelector("#fsp-filter").oninput=w=>{l=w.target.value,p()}}function p(){const g=f(),w=i.querySelector("#fsp-properties");if(!g){w.innerHTML="<p>Select an object to inspect its complete property list.</p>";return}const T=Object.entries(g.properties).filter(([S])=>S.toLowerCase().includes(l.toLowerCase()));w.innerHTML=`<h3>${n(g.id)}</h3>${T.map(([S,R])=>{const M=c.get(m(g.id,S)),b=M?M.value:R,C=g.editable&&!["name","type","script","setup script","analysis script"].includes(S)&&["number","string","boolean"].includes(typeof b)&&!String(b).includes(`
`)&&String(b).length<2e3,I=typeof b=="object"?JSON.stringify(b,null,2):String(b);return`<label class="fsp-property ${M?"modified":""}"><span>${n(S)}</span>${C?`<input data-fsp-property="${n(S)}" aria-label="FSP ${n(S)}" type="${typeof b=="number"?"number":typeof b=="boolean"?"checkbox":"text"}" step="any" ${typeof b=="boolean"?b?"checked":"":`value="${n(I)}"`} ${o?"disabled":""}>`:`<pre>${n(I)}</pre>`}</label>`}).join("")}${Object.entries(g.read_errors||{}).map(([S,R])=>`<p class="error">${n(S)}: ${n(R)}</p>`).join("")}`,w.querySelectorAll("[data-fsp-property]").forEach(S=>S.onchange=()=>{const R=S.dataset.fspProperty,M=S.type==="number"?Number(S.value):S.type==="checkbox"?S.checked:S.value;if(S.type==="number"&&(!S.value||!Number.isFinite(M))){e("Enter a finite number."),p();return}M===g.properties[R]?c.delete(m(g.id,R)):c.set(m(g.id,R),{object_id:g.id,property:R,value:M}),S.closest("label").classList.toggle("modified",c.has(m(g.id,R))),i.querySelector("#fsp-patch-count").textContent=`(${c.size})`,i.querySelector('[data-fsp="export"]').disabled=!c.size||o,_(`${c.size} pending edits. Save edited .fsp verifies each saved value in Lumerical.`)})}async function d(g){for(;;){const w=await h("/"+g);if(_(w.status==="queued"?"Waiting for Lumerical bridge…":"Reading and verifying project settings…"),w.status==="failed")throw Error(w.error);if(w.status==="ready")return w;await new Promise(T=>setTimeout(T,700))}}function x(g){const w=document.createElement("a");w.href="/api/fsp/"+r.id+"/"+g,w.download="",w.click()}async function y(g){var w,T;if(!o){o=!0,c.clear(),l="",a="",r=null,v(),i.open||i.showModal();try{_("Uploading "+g.name+"…");const S=await h("/import",{method:"POST",headers:{"Content-Type":"application/octet-stream","X-Filename":encodeURIComponent(g.name)},body:g});r=await d(S.id),a=((w=r.inspection.objects.find(R=>R.properties.type==="FDTD"))==null?void 0:w.id)||((T=r.inspection.objects[0])==null?void 0:T.id),t("Inspected "+g.name+" through Lumerical. Native GPU execution of this FSP remains unavailable.")}catch(S){e(S.message),t("FSP: "+S.message,"error")}finally{o=!1,v()}}}return s.onchange=()=>{const g=s.files[0];s.value="",g&&y(g)},i.addEventListener("click",async g=>{const w=g.target.closest("button");if(!w||w.disabled)return;if(w.dataset.fspObject){a=w.dataset.fspObject,v();return}const T=w.dataset.fsp;if(T==="close"){i.close();return}if(T==="open"){s.click();return}if(T==="original"){x("download");return}if(T==="archive"){x("archive");return}if(T==="export"){o=!0,v();try{const S=await h("/"+r.id+"/export",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({patches:[...c.values()]})}),R=await d(S.id),M=document.createElement("a");M.href="/api/fsp/"+R.id+"/download",M.download="",M.click(),c.clear(),r=R,t("Saved "+R.filename+" and verified "+R.export_verification.patches.length+" property edits by reopening in Lumerical.")}catch(S){e(S.message),t("FSP export failed: "+S.message,"error")}finally{o=!1,v()}}}),{openFile:y,open(){v(),i.open||i.showModal()}}}function Rv({esc:n,toast:e,log:t,loadProject:i,getProject:s}){const r=document.createElement("dialog");r.id="fsp-native-dialog",document.body.append(r);const a=document.createElement("input");a.type="file",a.accept=".fsp",a.id="fsp-native-input",a.hidden=!0,document.body.append(a);let o=null,l=null,c=!1,h="";function u(){var g,w,T,S;const v=o==null?void 0:o.conversion,p=v==null?void 0:v.project,d=s(),x=[...(d==null?void 0:d.structures)||[],...(d==null?void 0:d.sources)||[],...(d==null?void 0:d.monitors)||[]],y=R=>{const M=x.find(b=>R.startsWith(b.id+"."));return M?M.name+": "+R.slice(M.id.length+1):R};r.innerHTML=`<div class="fsp-heading"><div><h2>Import FSP for GPU</h2><span>${n((o==null?void 0:o.filename)||"Independent scene import")}</span></div><button data-native="close">Close</button></div>
   <p>Reads supported layout settings without Lumerical. The original FSP is retained. A converted scene uses the native solver and its documented numerical definitions.</p>
   <div class="fsp-toolbar"><button data-native="open" ${c?"disabled":""}>Choose .fsp</button><button data-native="load" ${!p||c?"disabled":""}>Open converted scene</button>${v?'<button data-native="original">Download original .fsp</button><button data-native="report">Conversion report</button>':""}<button data-native="export" ${!p||c?"disabled":""}>Export current scene</button></div>
   <p id="fsp-native-status" role="status">${c?"Processing FSP settings…":h?n(h):l?"Scene export verified · download below":v?p?"Ready to open · review calculation differences below":"Cannot run this FSP yet · unsupported settings below":"Choose an FSP file to check and convert."}</p>
   ${l?`<p><button data-native="edited">Download edited .fsp</button> <button data-native="write-report">Scene export report</button></p>${l.export_verification.native_only_settings.length?`<details><summary>Native JSON retains additional settings</summary><ul>${l.export_verification.native_only_settings.map(R=>`<li>${n(y(R))}</li>`).join("")}</ul></details>`:""}`:""}
   ${(g=l==null?void 0:l.export_verification.structure_list)!=null&&g.changed?`<p data-native-structure-export>Structure list saved: ${l.export_verification.structure_list.added.length} added · ${l.export_verification.structure_list.removed.length} removed · ${l.export_verification.structure_list.output_order.length} total. Native order and material priority verified. Reimport the edited file to use its updated object IDs. New object records have not been verified in external readers.</p>`:""}
   ${(w=l==null?void 0:l.export_verification.source_list)!=null&&w.changed?`<p data-native-source-export>Source list saved: ${l.export_verification.source_list.added.length} added · ${l.export_verification.source_list.removed.length} removed · ${l.export_verification.source_list.output_order.length} total. Native waveforms and order verified.</p>`:""}
   ${(T=l==null?void 0:l.export_verification.monitor_list)!=null&&T.changed?`<p data-native-monitor-export>Monitor list saved: ${l.export_verification.monitor_list.added.length} added · ${l.export_verification.monitor_list.removed.length} removed · ${l.export_verification.monitor_list.output_order.length} outputs. ${l.export_verification.monitor_list.splits.length} component records separated. Native sampling and output order verified. Reimport the edited file before further FSP edits. External reader acceptance is unverified.</p>`:""}
   ${(S=l==null?void 0:l.export_verification.mesh_export)!=null&&S.nodes_changed?`<p data-native-mesh-export>Mesh updated: ${l.export_verification.mesh_export.shape_before.join(" × ")} → ${l.export_verification.mesh_export.shape_after.join(" × ")} cells. Native reimport verified. External remeshing has not been verified.</p>`:""}
   ${p?'<p class="property-help">Exports mapped primitive, electric source and monitor additions, deletions, duplicates and order, source pulses, monitor spectra, duration, PML/Periodic settings and uniform mesh spacing/spans. New sources need explicit or ranged pulse settings. New time monitors need FFT with no apodization. Uniform isotropic export requires Cell centers sampling, and independent unequal axis spacing requires Yee sampling. Edited graded/explicit meshes and groups are not exported yet. Save native JSON to retain every native option and inheritance link.</p>':""}
   ${p?`<p>Original import: <b>${p.region.dimension.toUpperCase()}</b> · ${p.structures.length} structures · ${p.sources.length} sources · ${p.monitors.length} monitors · ${p.region.steps} steps</p>`:""}
   ${v?`<div class="native-issues">${v.issues.map(R=>`<p class="${R.severity==="error"?"error":"warning"}"><b>${n(R.object_id)}</b><br>${n(R.message)}</p>`).join("")}</div><p class="property-help">Coordinate origin in the source FSP: ${v.origin_m.map(R=>(R*1e6).toPrecision(5)).join(", ")} µm. Differences and source fingerprint remain in the saved native project.</p>`:""}`}async function f(v,p){const d=await fetch("/api/fsp"+v,p),x=await d.json();if(!d.ok)throw Error(x.detail||"FSP conversion failed");return x}async function m(v){for(;;){const p=await f("/"+v);if(p.status==="failed")throw Error(p.error);if(p.status==="ready")return p;await new Promise(d=>setTimeout(d,400))}}async function _(v){if(!c){o=null,l=null,h="",c=!0,u(),r.open||r.showModal();try{const p=await f("/native-import",{method:"POST",headers:{"Content-Type":"application/octet-stream","X-Filename":encodeURIComponent(v.name)},body:v});o=await m(p.id),t(v.name+": "+(o.conversion.project?"native scene conversion ready.":"native execution blocked by unsupported settings."),o.conversion.project?"info":"warning")}catch(p){h=p.message,e(h),t("FSP conversion: "+h,"error")}finally{c=!1,u()}}}return a.onchange=()=>{const v=a.files[0];a.value="",v&&_(v)},r.onclick=async v=>{var d,x;const p=(d=v.target.closest("[data-native]"))==null?void 0:d.dataset.native;if(p==="close"&&r.close(),p==="open"&&a.click(),p==="load"&&(o!=null&&o.conversion.project))try{await i(o.conversion.project),r.close()}catch(y){e(y.message)}if(p==="original"||p==="report"){const y=document.createElement("a");y.href="/api/fsp/"+o.id+(p==="original"?"/download":"/conversion"),y.download="",y.click()}if(p==="edited"||p==="write-report"){const y=document.createElement("a");y.href="/api/fsp/"+l.id+(p==="edited"?"/download":"/write-report"),y.download="",y.click()}if(p==="export"&&!c){c=!0,h="",l=null,u();try{const y=await f("/"+o.id+"/native-scene-export",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(s())});l=await m(y.id),t("Independent scene export verified."+((x=l.export_verification.mesh_export)!=null&&x.nodes_changed?" Mesh nodes updated.":""))}catch(y){h=y.message,e(h),t("FSP scene export: "+h,"error")}finally{c=!1,u()}}},{open(){u(),r.open||r.showModal()},openFile:_}}const lh={wavelength:1.55,pulse:"gaussian",pulse_cycles:3,time_definition:"cycles",pulse_length:2e-14,pulse_offset:5e-14,signal:null,wavelength_start:1.3,wavelength_stop:1.8,optimize_for_short_pulse:!0,eliminate_discontinuities:!1,chirp_bandwidth_hz:1e14};function Cv(n,e,t){const i=n.theta!=null,s=n.injection==="oneway";return(i?s?'<p class="property-help">Electric polarization. Its magnetic partner is generated automatically.</p>':`<label class="property-row"><span>field type</span><select aria-label="field type" data-source-family><option value="E" ${n.component[0]==="E"?"selected":""}>Electric</option><option value="H" ${n.component[0]==="H"?"selected":""}>Magnetic</option></select></label>`:t("polarization","component",n.component,s?["Ex","Ey","Ez"].filter(a=>a[1]!==n.normal):["Ex","Ey","Ez","Hx","Hy","Hz"]))+`<label class="enabled-row"><input type="checkbox" data-source-vector ${i?"checked":""}> Use theta / phi orientation</label>`+(i?e("theta","theta",n.theta,"deg",{min:0,max:180})+e("phi","phi",n.phi??0,"deg")+'<p class="property-help">Theta is measured from +z. Phi turns from +x toward +y. The source has unit vector (sin θ cos φ, sin θ sin φ, cos θ).</p>':"")}function Pv(n,e,t,i){return n.kind==="tfsf"?i("propagation axis","normal",n.normal??"x",e.dimension==="2d"?["x","y"]:["x","y","z"])+i("direction","direction",n.direction??"+",[["+","Forward (+axis)"],["-","Backward (-axis)"]])+t("incident PML layers","incident_pml_cells",n.incident_pml_cells??96,"",{min:32,max:512,step:1})+'<p class="property-help">Normal-incidence TFSF box. Inside contains total fields and outside contains scattered fields. Keep the scatterer away from every face, with homogeneous background on the faces and PML on all active domain boundaries.</p>':n.kind!=="plane"?"":i("injection","injection",n.injection??"soft",[["soft","Soft sheet / bidirectional"],["oneway","One-way plane / normal incidence"]])+(n.injection==="oneway"?i("propagation axis","normal",n.normal??"x",e.dimension==="2d"?["x","y"]:["x","y","z"])+i("direction","direction",n.direction??"+",[["+","Forward (+axis)"],["-","Backward (-axis)"]])+t("incident PML layers","incident_pml_cells",n.incident_pml_cells??96,"",{min:32,max:512,step:1}):"")+'<p class="property-help">Selecting one-way fills the transverse cell, sets its boundaries to Periodic and the propagation boundaries to PML. Place its full plane in homogeneous background. This source does not select a waveguide mode or an oblique angle.</p>'}function hc(n,e,{boundaries:t=!1}={}){if(n.kind==="tfsf"){e.dimension==="2d"&&n.normal==="z"&&(n.normal="x"),(n.component[0]!=="E"||n.component[1]===n.normal)&&(n.component=n.normal==="z"?"Ex":"Ez",n.theta=null,n.phi=0);return}if(n.injection!=="oneway")return;n.normal??(n.normal="x"),n.direction??(n.direction="+"),e.dimension==="2d"&&n.normal==="z"&&(n.normal="x");const i="xyz".indexOf(n.normal),s=e.dimension==="2d"?2:3;n.size=[0,0,0];for(let r=0;r<s;r++)if(r!==i&&(n.center[r]=0,n.size[r]=Math.ceil(e.size[r]/e.mesh-1e-12)*e.mesh),t){for(const a of["min","max"])e.boundaries["xyz"[r]+"_"+a].kind=r===i?"pml":"periodic";e.bloch_phase[r]=0}(n.component[0]!=="E"||n.component[1]===n.normal)&&(n.component="E"+(i===2?"x":"z"),n.theta=null,n.phi=0)}function zo(n){const e=299792458/(n.wavelength_stop*1e-6),t=299792458/(n.wavelength_start*1e-6),i=(e+t)/2,s=(n.optimize_for_short_pulse?2:8)/(t+.01*e),r=s/(2*Math.sqrt(Math.log(2)));return{wavelength:299792458/i*1e6,length:s,offset:1.1*Math.sqrt(2*Math.log(1e4))*r,span:t-e,chirped:t-e>Math.sqrt(Math.log(2))/(Math.PI*r)}}function ch(n,e,t){const i=["wavelength","frequency"].includes(n.time_definition),s=i?zo(n):null;n[e]=t,e==="pulse"&&t==="broadband"&&!i&&(n.time_definition="wavelength",n.eliminate_discontinuities=!0),(e==="pulse"&&t!=="broadband"&&i||e==="time_definition"&&t==="standard"&&i)&&(n.time_definition="standard",n.wavelength=s.wavelength,n.pulse_length=s.length,n.pulse_offset=s.offset,n.chirp_bandwidth_hz=Math.max(s.span,1),e==="time_definition"&&!s.chirped&&(n.pulse="gaussian"))}function hh(n,e,t,i=""){for(const[l,c]of Object.entries(lh))n[l]??(n[l]=c);const s=n.pulse==="broadband",r=["wavelength","frequency"].includes(n.time_definition),a=(l,c)=>`<label class="enabled-row"><input type="checkbox" aria-label="${i}${l}" data-path="${c}" ${n[c]?"checked":""}> ${l}</label>`;let o=t("pulse","pulse",n.pulse,[["gaussian","Gaussian"],["broadband","Broadband / automatic range"],["continuous","Continuous wave"],...n.signal?[["sampled","User time signal"]]:[]]);if(n.pulse==="sampled")return e("wavelength","wavelength",n.wavelength,"µm",{min:.001})+o+`<p class="property-help">${n.signal.time_s.length.toLocaleString()} time/amplitude/phase samples. Time in seconds, phase in radians.</p>`;if(o+=t("time definition","time_definition",n.time_definition,s?[["wavelength","Wavelength range"],["frequency","Frequency range"],["standard","Time domain"]]:[["cycles","Pulse cycles"],["standard","Standard time domain"]]),r){n.time_definition==="wavelength"?o+=e("wavelength start","wavelength_start",n.wavelength_start,"µm",{min:.001})+e("wavelength stop","wavelength_stop",n.wavelength_stop,"µm",{min:.001}):o+=e("frequency start","wavelength_stop",299.792458/n.wavelength_stop,"THz",{min:.001,reciprocal:299.792458})+e("frequency stop","wavelength_start",299.792458/n.wavelength_start,"THz",{min:.001,reciprocal:299.792458});const l=zo(n);o+=a("Optimize for short pulse","optimize_for_short_pulse")+`<p class="property-help" data-source-band-summary>${l.chirped?"Chirped":"Standard"} Gaussian · center ${l.wavelength.toFixed(5)} µm · power FWHM ${(l.length*1e15).toFixed(4)} fs · offset ${(l.offset*1e15).toFixed(4)} fs. The spectrum extends beyond the requested range.</p>`}else o+=e("wavelength","wavelength",n.wavelength,"µm",{min:.001}),o+=n.time_definition==="standard"?e("pulselength (power FWHM)","pulse_length",n.pulse_length*1e15,"fs",{min:.001,scale:1e-15})+(n.pulse!=="continuous"?e("offset","pulse_offset",n.pulse_offset*1e15,"fs",{min:0,scale:1e-15}):""):e("pulse width","pulse_cycles",n.pulse_cycles,"cycles",{min:1}),s&&(o+=e("chirp bandwidth","chirp_bandwidth_hz",n.chirp_bandwidth_hz*1e-12,"THz",{min:.001,scale:1e12}));return n.pulse!=="continuous"&&(o+=a("Eliminate discontinuities","eliminate_discontinuities")),o}function Lv(n,e="signal.csv"){var s;if(e.toLowerCase().endsWith(".json"))return JSON.parse(n);const t=n.replace(/^\uFEFF/,"").trim().split(/\r?\n/).filter(r=>r.trim());if(((s=t.shift())==null?void 0:s.trim())!=="time_s,amplitude,phase_rad")throw Error("CSV header must be time_s,amplitude,phase_rad. Use seconds and unwrapped radians.");const i={time_s:[],amplitude:[],phase_rad:[]};return t.forEach((r,a)=>{const o=r.split(",");if(o.length!==3||o.some(l=>!l.trim()||!Number.isFinite(Number(l))))throw Error(`Invalid numeric data on CSV row ${a+2}.`);Object.keys(i).forEach((l,c)=>i[l].push(Number(o[c])))}),i}function Dv({state:n,api:e,esc:t,commit:i,toast:s}){const r=document.createElement("dialog");r.className="source-dialog",document.body.append(r);const a=x=>r.querySelector(x),o=()=>r.close(),l=x=>{r.innerHTML=x,r.showModal(),r.querySelectorAll("[data-source-close]").forEach(y=>y.onclick=o)},c=x=>{a('[role="alert"]').textContent=x.message},h=x=>{const y=["time_s,amplitude,phase_rad",...x.time_s.map((T,S)=>[T,x.amplitude[S],x.phase_rad[S]].join(","))].join(`
`),g=URL.createObjectURL(new Blob([y],{type:"text/csv"})),w=document.createElement("a");w.href=g,w.download="source-signal.csv",w.click(),setTimeout(()=>URL.revokeObjectURL(g),1e3)},u=x=>x?`${x.time_s.length.toLocaleString()} samples · ${(x.time_s[0]*1e15).toFixed(3)}–${(x.time_s.at(-1)*1e15).toFixed(3)} fs`:"No time signal loaded",f=x=>x?`<table><thead><tr><th>Time (fs)</th><th>Amplitude</th><th>Phase (rad)</th></tr></thead><tbody>${x.time_s.slice(0,6).map((y,g)=>`<tr><td>${(y*1e15).toPrecision(6)}</td><td>${x.amplitude[g].toPrecision(6)}</td><td>${x.phase_rad[g].toPrecision(6)}</td></tr>`).join("")}</tbody></table>`:"",m='<label class="signal-file">Load time signal (CSV or JSON)<input type="file" accept=".csv,.json" aria-label="Time signal file"></label><p class="property-help">CSV: time_s,amplitude,phase_rad. Time is in seconds; phase is unwrapped radians. JSON uses arrays with the same names. 2–100,000 strictly increasing times. Amplitude and phase are interpolated separately; injection is zero outside the table.</p>';async function _(x,y,g){if(x.size>16e6)throw Error("Time signal file exceeds 16 MB.");const w=Lv(await x.text(),x.name);return g.signal=w,g.pulse="sampled",["wavelength","frequency"].includes(g.time_definition)&&(g.time_definition="standard"),(await e("/validate",y)).project}async function v(x){if(n.mode!=="layout")return;let y=structuredClone(n.project),g=y.sources.find(T=>T.id===x);if(!g||g.use_global_source)throw Error("Edit the global source settings for an inherited signal.");l(`<h2>Time signal · ${t(g.name)}</h2>${m}<div class="signal-summary"></div><div class="signal-table"></div><p role="alert" class="error"></p><div class="dialog-actions"><button data-export>Download CSV</button><button data-source-close>Cancel</button><button data-apply class="primary">Apply time signal</button></div>`);const w=()=>{a(".signal-summary").textContent=u(g.signal),a(".signal-table").innerHTML=f(g.signal),a("[data-export]").disabled=!g.signal,a("[data-apply]").disabled=!g.signal};w(),a('[type="file"]').onchange=async T=>{const S=T.target.files[0];if(S)try{const R=structuredClone(y),M=R.sources.find(C=>C.id===x);y=await _(S,R,M),g=y.sources.find(C=>C.id===x),a('[role="alert"]').textContent="",w()}catch(R){c(R)}finally{a('[type="file"]').value=""}},a("[data-export]").onclick=()=>h(g.signal),a("[data-apply]").onclick=async()=>{try{g.pulse="sampled",["wavelength","frequency"].includes(g.time_definition)&&(g.time_definition="standard");const T=await e("/validate",y);i(T.project),o()}catch(T){c(T)}}}async function p(){if(n.mode!=="layout")return;let x=structuredClone(n.project);x.global_source??(x.global_source=structuredClone(lh));const y=(T,S,R,M="",b={})=>{const C={wavelength:"wavelength (µm)","pulselength (power FWHM)":"pulselength (fs)",offset:"offset (fs)","pulse width":"pulse cycles"}[T]||T;return`<label class="property-row"><span>${T}</span><input aria-label="global ${C}" data-path="${S}" type="number" step="any" data-scale="${b.scale||1}" ${b.reciprocal?`data-reciprocal="${b.reciprocal}"`:""} value="${R}"><small>${M}</small></label>`},g=(T,S,R,M)=>`<label class="property-row"><span>${T}</span><select aria-label="global ${T}" data-path="${S}">${M.map(([b,C])=>`<option value="${b}" ${b===R?"selected":""}>${C}</option>`).join("")}</select></label>`,w=()=>{const T=x.global_source;r.innerHTML=`<h2>Global source settings</h2><p>Shared temporal settings for sources with “Use global source settings” enabled. Each source keeps its own amplitude, phase and position.</p>${hh(T,y,g,"global ")}${m}<div class="signal-summary">${u(T.signal)}</div><p role="alert" class="error"></p><div class="dialog-actions"><button data-export ${T.signal?"":"disabled"}>Download signal CSV</button><button data-source-close>Cancel</button><button data-apply class="primary">Apply global settings</button></div>`,a("[data-source-close]").onclick=o,r.querySelectorAll("[data-path]").forEach(S=>S.onchange=()=>{const R=S.type==="checkbox"?S.checked:S.type==="number"?S.dataset.reciprocal?Number(S.dataset.reciprocal)/Number(S.value):Number(S.value)*Number(S.dataset.scale||1):S.value;if(ch(T,S.dataset.path,R),S.type!=="number")w();else if(a("[data-source-band-summary]")){const M=zo(T);a("[data-source-band-summary]").textContent=`${M.chirped?"Chirped":"Standard"} Gaussian · center ${M.wavelength.toFixed(5)} µm · power FWHM ${(M.length*1e15).toFixed(4)} fs · offset ${(M.offset*1e15).toFixed(4)} fs. The spectrum extends beyond the requested range.`}}),a('[type="file"]').onchange=async S=>{const R=S.target.files[0];if(R)try{const M=structuredClone(x);x=await _(R,M,M.global_source),w()}catch(M){c(M)}},a("[data-export]").onclick=()=>h(T.signal),a("[data-apply]").onclick=async()=>{try{const S=await e("/validate",x);i(S.project),o()}catch(S){c(S)}}};w(),r.showModal()}async function d(x){const y=structuredClone(n.project);l('<h2>Source time signal and spectrum</h2><p>Computing the injection at the current mesh time step…</p><p role="alert" class="error"></p><div class="dialog-actions"><button data-source-close>Close</button></div>');try{const g=await e("/sources/"+encodeURIComponent(x)+"/preview",y);if(!r.open)return;r.innerHTML=`<h2>Source preview · ${t(g.name)}</h2><p>${g.inherited?"Global":"Local"} pulse settings · ${g.enabled?"Enabled":"Disabled: zero injection"} · Δt ${g.dt_fs.toFixed(5)} fs · ${g.signal.length.toLocaleString()} samples</p>${g.pulse_parameters?`<p>${g.pulse_parameters.chirped?"Chirped":"Unchirped"} carrier · center ${g.pulse_parameters.center_wavelength_um.toFixed(5)} µm · power FWHM ${(g.pulse_parameters.pulse_length_s*1e15).toFixed(4)} fs</p>`:""}<div class="source-plot-tabs"><button data-mode="time" class="active">Time signal</button><button data-mode="spectrum">Spectrum</button><select aria-label="Source spectrum axis" hidden><option value="frequency">Frequency</option><option value="wavelength">Wavelength</option></select></div><canvas aria-label="Source waveform"></canvas><p>${t(g.note)}</p><div class="dialog-actions"><button data-source-close>Close</button></div>`;let w=!1;const T=()=>Is(a("canvas"),[g],w,a("select").value==="wavelength");r.querySelectorAll("[data-mode]").forEach(S=>S.onclick=()=>{w=S.dataset.mode==="spectrum",a("select").hidden=!w,r.querySelectorAll("[data-mode]").forEach(R=>R.classList.toggle("active",R===S)),T()}),a("select").onchange=T,a("[data-source-close]").onclick=o,T()}catch(g){r.open?c(g):s(g.message)}}return{signal:v,globals:p,preview:d}}function Iv({host:n,material:e,editable:t,api:i,esc:s,begin:r,current:a,invalidate:o,timestep:l,use:c}){var v,p,d;const h=x=>n.querySelector(x),u=e.fit_band_um||[((v=e.samples)==null?void 0:v.wavelength_um[0])||"",((p=e.samples)==null?void 0:p.wavelength_um.at(-1))||""];n.innerHTML=`<details class="material-fit"><summary>Measured optical data · import and fit</summary>
 <p>Supply your own passive isotropic n/k or complex permittivity samples. The table and its reference are saved with the project.</p>
 <fieldset ${t?"":"disabled"}>
 <div class="fit-controls"><label>Columns <select aria-label="Optical data columns"><option value="nk">Wavelength, n, k</option><option value="epsilon">Wavelength, ε real, ε imaginary</option></select></label>
 <label>Wavelength unit <select aria-label="Optical wavelength unit"><option value="um">µm</option><option value="nm">nm</option><option value="m">m</option></select></label>
 <label>CSV / text file <input aria-label="Optical data file" type="file" accept=".csv,.txt,.tsv"></label></div>
 <textarea aria-label="Optical data table" rows="5" placeholder="wavelength_um,n,k&#10;1.0,1.50,0.01&#10;1.5,1.49,0.01&#10;2.0,1.48,0.01"></textarea>
 <label class="fit-reference">Data reference <input aria-label="Optical data reference" maxlength="2000" value="${s(((d=e.samples)==null?void 0:d.reference)||"")}" placeholder="Citation or measurement description"></label>
 <button data-import>Import data</button><span data-data-status>${e.samples?`${e.samples.wavelength_um.length} samples retained`:"No samples imported"}</span>
 <div class="fit-controls"><label>Fit start (µm) <input aria-label="Fit wavelength start" type="number" step="any" min="0" value="${u[0]}"></label>
 <label>Fit stop (µm) <input aria-label="Fit wavelength stop" type="number" step="any" min="0" value="${u[1]}"></label>
 <label>Maximum poles <input aria-label="Maximum fit poles" type="number" min="1" max="16" value="6"></label>
 <label>RMS tolerance <input aria-label="Fit tolerance" type="number" min="0" max="1" step="any" value="0.001"></label>
 <label>Response <select aria-label="Fit response"><option value="analytic">Continuous material</option><option value="ade">FDTD at current timestep</option></select></label>
 <label><input aria-label="Include Drude pole" type="checkbox" checked> Include Drude pole</label></div>
 <button data-fit ${e.samples?"":"disabled"}>Fit optical data</button> <button data-use-fit disabled>Use fitted material</button>
 </fieldset><p class="fit-status" role="status">Fit accuracy applies inside the sampled band. Device accuracy also requires time and mesh convergence.</p>
 <canvas aria-label="Measured and fitted optical response"></canvas></details>`;let f=null;const m=x=>{h(".fit-status").textContent=x};function _(){f=null,h("[data-use-fit]").disabled=!0,o(),m("Inputs changed. Fit again to update the candidate.");const x=h("canvas");x.getContext("2d").clearRect(0,0,x.width,x.height)}return n.querySelectorAll("input,select,textarea").forEach(x=>x.oninput=_),n.querySelectorAll('textarea,[aria-label="Optical data columns"],[aria-label="Optical wavelength unit"],[aria-label="Optical data file"]').forEach(x=>x.addEventListener("input",()=>{h("[data-fit]").disabled=!0})),h('[aria-label="Optical data file"]').onchange=async x=>{const y=r(),g=x.target.files[0];if(g){if(g.size>2e6){m("Optical data file exceeds 2 MB.");return}try{const w=await g.text();if(!a(y))return;h("textarea").value=w,h('[aria-label="Optical data reference"]').value=g.name,_()}catch(w){a(y)&&m(w.message)}}},h("[data-import]").onclick=async()=>{const x=r();m("Reading optical samples…");try{const y=await i("/materials/data",{text:h("textarea").value,kind:h('[aria-label="Optical data columns"]').value,unit:h('[aria-label="Optical wavelength unit"]').value,reference:h('[aria-label="Optical data reference"]').value});if(!a(x))return;e.samples=y,e.fit_band_um=null,e.fit_dt_s=null,f=null,h('[aria-label="Fit wavelength start"]').value=y.wavelength_um[0],h('[aria-label="Fit wavelength stop"]').value=y.wavelength_um.at(-1),h("[data-data-status]").textContent=`${y.wavelength_um.length} samples · ${y.wavelength_um[0]}–${y.wavelength_um.at(-1)} µm`,h("[data-fit]").disabled=!t,h("[data-use-fit]").disabled=!0,o(),m("Data imported. Fit to create simulation coefficients.")}catch(y){a(x)&&m(y.message)}},h("[data-fit]").onclick=async()=>{const x=r();f=null,h("[data-use-fit]").disabled=!0,m("Fitting passive oscillators…");try{const y={max_poles:Number(h('[aria-label="Maximum fit poles"]').value),tolerance:Number(h('[aria-label="Fit tolerance"]').value),wavelength_range_um:[Number(h('[aria-label="Fit wavelength start"]').value),Number(h('[aria-label="Fit wavelength stop"]').value)],include_drude:h('[aria-label="Include Drude pole"]').checked,target:h('[aria-label="Fit response"]').value},g=structuredClone(e.samples);if(g.reference=h('[aria-label="Optical data reference"]').value,y.dt_s=await l(),!a(x))return;const w=await i("/materials/fit",{data:g,options:y,name:e.name,color:e.color});if(!a(x))return;f=w;const T=w.report,S=T.target==="ade"?"numerical":"fitted";Is(h("canvas"),[["measured_n","n (data)"],["measured_k","k (data)"],[`${S}_n`,"n (fit)"],[`${S}_k`,"k (fit)"]].map(([R,M])=>({name:M,wavelength_um:T.wavelength_um,spectrum:T[R],spectrum_label:"Wavelength (µm) · measured and fitted n + i k"})),!0,!0),m(`${T.converged?"Tolerance met":"Tolerance NOT met"} · ${T.pole_count} poles · ${T.sample_count} samples · analytic RMS ${T.analytic.normalized_rms.toExponential(3)} · FDTD RMS ${T.ade.normalized_rms.toExponential(3)} at Δt ${(T.dt_s*1e15).toPrecision(5)} fs · ${T.seconds.toFixed(2)} s. ${T.converged?"Use fitted material, then Apply materials to save.":"Adjust the fit band or pole limit. Current coefficients have not changed."}`),h("[data-use-fit]").disabled=!t||!T.converged}catch(y){a(x)&&m(y.message)}},h("[data-use-fit]").onclick=()=>{f!=null&&f.report.converged&&c(f.material)},{invalidate(){f=null,h("[data-use-fit]").disabled=!0,m("Material parameters changed. Fit again to update the candidate.")}}}const uc={model:"dielectric",index:1.5,color:"#60bdaa",epsilon_inf:1,plasma_rad_s:2e15,collision_rad_s:1e14,resonance_rad_s:2e15,linewidth_rad_s:1e14,delta_epsilon:1,poles:[]};function Uv({state:n,api:e,esc:t,toast:i,commit:s}){const r=document.createElement("dialog");r.className="material-dialog",document.body.append(r);let a,o=0,l=0,c;r.onclose=()=>{l++};const h=d=>r.querySelector(d),u=(d,x,y="",g=0)=>`<label class="material-field"><span>${d}</span><input aria-label="${d}" data-material-field="${x}" type="${x==="name"?"text":x==="color"?"color":"number"}" value="${t(a.materials[o][x])}" ${x==="name"?'maxlength="100"':`min="${g}" step="any"`}><small>${y}</small></label>`,f=()=>({resonance_rad_s:2e15,strength_rad_s_squared:4e30,damping_rad_s:1e14});function m(d){return`<div class="pole-editor">${d.poles.map((x,y)=>`<details open class="boundary-options"><summary>Pole ${y+1}</summary>${[["Resonance","resonance_rad_s","rad/s",0],["Oscillator strength","strength_rad_s_squared","rad²/s²",1e-30],["Damping","damping_rad_s","rad/s",0]].map(([g,w,T,S])=>`<label class="material-field"><span>${g}</span><input aria-label="Pole ${y+1} ${g}" type="number" min="${S}" step="any" data-pole-index="${y}" data-pole-field="${w}" value="${t(x[w])}"><small>${T}</small></label>`).join("")}<button data-remove-pole="${y}" ${d.poles.length<2?"disabled":""}>Remove pole ${y+1}</button></details>`).join("")}<button data-add-pole ${d.poles.length>=16?"disabled":""}>+ Add pole</button><p>Set resonance to zero for a Drude pole. Strength must be positive and damping nonnegative. Measured optical samples can be fitted below.</p></div>`}function _(){l++;const d=a.materials[o];Object.entries(uc).forEach(([x,y])=>d[x]??(d[x]=structuredClone(y))),r.innerHTML=`<div class="fsp-heading"><h2>Material database</h2><button data-dismiss>Close</button></div><p>Dielectric, Drude, Lorentz and multiple passive poles.</p><div class="material-workspace"><aside><select size="8" aria-label="Material list">${a.materials.map((x,y)=>`<option value="${y}" ${y===o?"selected":""}>${t(x.name)}</option>`).join("")}</select><button data-add-material>+ Add material</button></aside><section><fieldset ${n.mode!=="layout"?"disabled":""}>${u("Material name","name")}${u("Display color","color")}<label class="material-field"><span>Material model</span><select aria-label="Material model" data-material-field="model">${[["dielectric","Dielectric"],["drude","Plasma (Drude)"],["lorentz","Lorentz"],["multipole","Multiple Drude / Lorentz poles"]].map(([x,y])=>`<option value="${x}" ${d.model===x?"selected":""}>${y}</option>`).join("")}</select></label>${d.model==="dielectric"?u("Refractive index","index","",1):u("Permittivity (epsilon infinity)","epsilon_inf","",1)}${d.model==="drude"?u("Plasma resonance","plasma_rad_s","rad/s")+u("Plasma collision","collision_rad_s","rad/s"):d.model==="lorentz"?u("Lorentz permittivity","delta_epsilon")+u("Lorentz resonance","resonance_rad_s","rad/s")+u("Lorentz linewidth","linewidth_rad_s","rad/s"):d.model==="multipole"?m(d):""}</fieldset><p class="material-formula">${d.model==="dielectric"?"ε = n²":d.model==="drude"?"ε(ω) = ε∞ − ωp² / (ω² + i γ ω)":d.model==="multipole"?"ε(ω) = ε∞ + Σ Aⱼ / (ωⱼ² − ω² − i γⱼ ω)":"ε(ω) = ε∞ + Δε ω₀² / (ω₀² − ω² − 2 i δ ω)"}<br>Frequency parameters above are angular frequencies, in rad/s.</p></section></div><div data-optical-fit></div><div class="material-range"><label>Wavelength start (µm) <input aria-label="Material wavelength start" type="number" value="1.3" min="0.001" step=".01"></label><label>Wavelength stop (µm) <input aria-label="Material wavelength stop" type="number" value="1.8" min="0.001" step=".01"></label><button data-preview>Plot n / k</button></div><canvas></canvas><p class="material-status" role="status">Preview includes the current simulation timestep.</p><div class="dialog-actions"><button data-apply ${n.mode!=="layout"?"disabled":""}>Apply materials</button><button data-dismiss>Cancel</button></div>`,c=Iv({host:h("[data-optical-fit]"),material:d,editable:n.mode==="layout",api:e,esc:t,begin:()=>++l,current:x=>x===l&&r.open,invalidate:v,timestep:async()=>(await e("/validate",a)).dt_fs*1e-15,use:x=>{a.materials[o]=x,_(),p()}}),h('[aria-label="Material list"]').onchange=x=>{o=+x.target.value,_()},h("[data-add-material]").disabled=n.mode!=="layout",h("[data-add-material]").onclick=()=>{let x=a.materials.length;for(;a.materials.some(y=>y.name===`Custom material ${x}`);)x++;a.materials.push({...structuredClone(uc),name:`Custom material ${x}`}),o=a.materials.length-1,_()},r.querySelectorAll("[data-material-field]").forEach(x=>x.onchange=()=>{const y=x.dataset.materialField,g=d.name;if(y==="name"&&(!x.value.trim()||a.materials.some((w,T)=>T!==o&&w.name===x.value))){x.value=g,h(".material-status").textContent="Material names must be nonempty and unique.";return}d[y]=["name","model","color"].includes(y)?x.value:Number(x.value),y==="name"&&a.structures.forEach(w=>{w.material===g&&(w.material=d.name)}),y==="model"&&d.model==="multipole"&&!d.poles.length&&d.poles.push(f()),y==="model"||y==="name"?_():v()}),r.querySelectorAll(".material-range input").forEach(x=>x.onchange=v),r.querySelectorAll("[data-dismiss]").forEach(x=>x.onclick=()=>r.close()),h("[data-add-pole]")&&(h("[data-add-pole]").onclick=()=>{d.poles.length<16&&(d.poles.push(f()),_())}),r.querySelectorAll("[data-remove-pole]").forEach(x=>x.onclick=()=>{d.poles.splice(+x.dataset.removePole,1),_()}),r.querySelectorAll("[data-pole-field]").forEach(x=>x.onchange=()=>{d.poles[+x.dataset.poleIndex][x.dataset.poleField]=Number(x.value),v()}),r.querySelectorAll("[data-material-field],[data-pole-field]").forEach(x=>x.addEventListener("input",v)),h("[data-preview]").onclick=p,h("[data-apply]").onclick=async()=>{try{const x=await e("/validate",a);s(x.project),r.close()}catch(x){h(".material-status").textContent=x.message,i(x.message)}}}function v(){l++,c==null||c.invalidate();const d=h(".material-range + canvas");d.getContext("2d").clearRect(0,0,d.width,d.height),h(".material-status").textContent="Parameters changed. Select Plot n / k to refresh."}async function p(){const d=++l;try{const x=Number(h('[aria-label="Material wavelength start"]').value),y=Number(h('[aria-label="Material wavelength stop"]').value),g=(await e("/validate",a)).dt_fs;if(d!==l)return;const w=await e(`/materials/preview?wavelength_start=${x}&wavelength_stop=${y}&dt_fs=${g}`,a.materials[o]);if(d!==l)return;Is(h(".material-range + canvas"),["n","k","numerical_n","numerical_k"].map((T,S)=>({name:["n (analytic)","k (analytic)","n (ADE)","k (ADE)"][S],wavelength_um:w.wavelength_um,spectrum:w[T],spectrum_label:"Wavelength (µm) · complex index n + i k"})),!0,!0),h(".material-status").textContent=`${w.wavelength_um.length} wavelengths · analytic response and ADE at Δt = ${g.toPrecision(5)} fs. Positive k means absorption.${w.samples?` Retained samples: analytic RMS ${w.samples.analytic.normalized_rms.toExponential(3)}, FDTD RMS ${w.samples.ade.normalized_rms.toExponential(3)}.`:""}`}catch(x){d===l&&(h(".material-status").textContent=x.message)}}return{open(){a=structuredClone(n.project),o=0,_(),r.showModal()}}}function Nv({api:n,esc:e}){const t=document.createElement("dialog");t.className="capability-dialog",document.body.append(t);let i;const s=a=>t.querySelector(a);function r(){const a=s("[data-search]").value.toLowerCase(),o=s("[data-status]").value,l=s("[data-category]").value,c=s("[data-priority]").value,h=i.features.filter(u=>(!o||u.native===o)&&(!l||u.category===l)&&(!c||u.product_priority===c)&&(!s("[data-remaining]").checked||u.remaining)&&[u.name,u.category,u.scope,u.workstream_title].join(" ").toLowerCase().includes(a)).sort((u,f)=>u.delivery_rank-f.delivery_rank||u.name.localeCompare(f.name));s(".capability-count").textContent=`${h.length.toLocaleString()} / ${i.features.length.toLocaleString()} entries`,s("tbody").innerHTML=h.map(u=>`<tr><td>${u.native==="implemented"?"☑":"☐"}</td><td><b>${e(u.product_priority)}</b><small>${e(i.decision_labels[u.decision])}</small></td><td><small>${e(u.workstream_title)} · ${e(u.category)}</small>${u.reference?`<a href="${e(u.reference)}" target="_blank" rel="noopener">${e(u.name)}</a>`:`<span>${e(u.name)}</span>`}</td>${["native","python","ui","fsp"].map(f=>`<td><span class="cap-status ${u[f]}">${e(i.status_labels[u[f]])}</span></td>`).join("")}<td>${e(u.scope)}<small>${e(u.priority_reason)}</small>${u.evidence.length?`<small>${u.evidence.map(e).join(" · ")}</small>`:""}</td></tr>`).join("")}return{async open(){i=await n("/capabilities"),t.innerHTML=`<div class="fsp-heading"><h2>Feature priorities and checklist</h2><button data-close-panel>Close</button></div><p>${e(i.priority_note)}</p><p>${Object.entries(i.remaining_priority_counts).sort().map(([a,o])=>`${e(a)}: ${o} remaining entries`).join(" · ")}</p><div class="capability-filters"><input data-search aria-label="Search capabilities" placeholder="Search feature or property"><select data-priority aria-label="Capability priority"><option value="">All priorities</option>${Object.entries(i.priority_labels).map(([a,o])=>`<option value="${a}">${e(o)}</option>`).join("")}</select><select data-status aria-label="Capability status"><option value="">All statuses</option>${Object.entries(i.status_labels).map(([a,o])=>`<option value="${a}">${e(o)}</option>`).join("")}</select><select data-category aria-label="Capability category"><option value="">All categories</option>${[...new Set(i.features.map(a=>a.category))].map(a=>`<option>${e(a)}</option>`).join("")}</select><label><input data-remaining type="checkbox" aria-label="Remaining work only"> Remaining work only</label><a href="/api/capabilities" target="_blank">JSON</a><span class="capability-count"></span></div><div class="capability-table"><table><thead><tr><th></th><th>Priority</th><th>Feature / property</th><th>Native engine</th><th>Python</th><th>UI</th><th>Independent FSP</th><th>Scope / reason / evidence</th></tr></thead><tbody></tbody></table></div>`,s("[data-close-panel]").onclick=()=>t.close(),s("[data-search]").oninput=r;for(const a of["data-status","data-category","data-priority","data-remaining"])s("["+a+"]").onchange=r;r(),t.showModal()}}}function Fv({esc:n}){const e=document.createElement("dialog");e.className="inverse-design-dialog",document.body.append(e);const t=R=>e.querySelector(R),i="torchfdtd.periodicDesign.v1",s=i+".job";let r,a=localStorage.getItem(s),o,l=!1,c=null,h=!1,u=!1;async function f(R,M){var I;const b=await fetch("/api/"+R,M===void 0?{}:{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(M)}),C=(I=b.headers.get("content-type"))!=null&&I.includes("json")?await b.json():await b.text();if(!b.ok)throw Error(typeof C.detail=="string"?C.detail:JSON.stringify(C.detail||C));return C}function m(){localStorage.setItem(i,JSON.stringify(r))}function _(R,M,b="application/json"){const C=URL.createObjectURL(new Blob([R],{type:b})),I=document.createElement("a");I.href=C,I.download=M,I.click(),setTimeout(()=>URL.revokeObjectURL(C),1e3)}function v(R){t("[data-design-status]").textContent=R.message}const p=(R,M,b,C="any")=>`<label>${R}<input aria-label="${R}" data-key="${M}" type="number" step="${C}" value="${n(b)}"></label>`,d=(R,M,b)=>`<label>${R}<select aria-label="${R}" data-key="${M}">${b.map(([C,I])=>`<option value="${C}" ${r[M]===C?"selected":""}>${I}</option>`).join("")}</select></label>`;function x(){var B;const R=h&&((B=c==null?void 0:c.progress)!=null&&B.density_preview)?c.progress.density_preview:r.initial_density,M=t("[data-density]"),b=M.getContext("2d"),C=R.length,I=R[0].length;b.clearRect(0,0,M.width,M.height);for(let H=0;H<C;H++)for(let k=0;k<I;k++){const W=Math.max(0,Math.min(1,Number(R[H][k])));b.fillStyle=`rgb(${Math.round(18+207*W)},${Math.round(39+190*W)},${Math.round(65+95*W)})`,b.fillRect(H*M.width/C,(I-1-k)*M.height/I,Math.ceil(M.width/C),Math.ceil(M.height/I))}t("[data-density-caption]").textContent=(h?"Latest evaluated density":"Initial density")+` · x: ${C}, y: ${I} · 0 background / 1 design material`}function y(R){l=R,e.querySelectorAll("fieldset").forEach(M=>M.disabled=R),t("[data-start-design]").disabled=R,t("[data-plan-design]").disabled=R,t("[data-stop-design]").disabled=!R,t("[data-load-design]").disabled=R,t("[data-use-seed]").disabled=R||!(c!=null&&c.summary)}function g(){e.innerHTML=`<div class="fsp-heading"><div><h2>Inverse design · periodic layer</h2><p>FP32 · Torch adjoint · automatic memory placement</p></div><button data-close-design>Close</button></div>
  <p class="design-scope">Optimize a continuous density layer at one wavelength. This setup is separate from the CAD scene. Fixed materials, periodic x/y boundaries and PML in z. Mesh convergence and fabrication constraints require separate validation.</p>
  <div class="design-grid"><section class="design-settings"><fieldset><legend>Structure & illumination</legend>
   ${p("Wavelength (µm)","wavelength_um",r.wavelength_um)}
   ${p("Period x (µm)","period_um.0",r.period_um[0])}${p("Period y (µm)","period_um.1",r.period_um[1])}
   ${p("Layer height (µm)","height_um",r.height_um)}${p("Detector offset (µm)","detector_offset_um",r.detector_offset_um)}
   ${p("Background index","background_index",r.background_index)}${p("Design index","design_index",r.design_index)}
   ${p("Incidence θ (degrees)","theta_deg",r.theta_deg)}${p("Azimuth φ (degrees)","phi_deg",r.phi_deg)}
   ${p("Mesh (µm)","mesh_um",r.mesh_um)}${p("Time steps","steps",r.steps,1)}${p("PML cells","pml_cells",r.pml_cells,1)}
  </fieldset><fieldset><legend>Objective & optimizer</legend><p>Maximize weighted quadrant power, averaged over two polarizations.</p>
   ${["R","G2","G1","B"].map((b,C)=>p(b+" weight","objective_weights."+C,r.objective_weights[C])).join("")}
   ${p("Adam updates","iterations",r.iterations,1)}${p("Learning rate","learning_rate",r.learning_rate)}
  </fieldset><fieldset><legend>Memory & execution</legend>
   ${d("Compute device","device",[["cpu","CPU"],["cuda","CUDA GPU"]])}
   ${d("Execution mode","execution",[["auto","Automatic"],["resident","Resident"],["dram","DRAM streaming"],["file","File streaming"]])}
   ${p("GPU budget (GiB)","gpu_budget_gib",r.gpu_budget_gib)}${p("DRAM budget (GiB)","host_budget_gib",r.host_budget_gib)}
   ${p("Checkpoints","checkpoints",r.checkpoints,1)}${p("Maximum slab width","slab_width",r.slab_width,1)}${p("Temporal depth","temporal_depth",r.temporal_depth,1)}
   <details><summary>Optional file backing</summary><label>State directory<input aria-label="State directory" data-key="state_directory" value="${n(r.state_directory||"")}"></label>
   ${p("File budget (GiB)","disk_budget_gib",r.disk_budget_gib??"")}${p("Keep disk free (GiB)","disk_free_reserve_gib",r.disk_free_reserve_gib)}<p>Used only when explicitly configured. Default free-space reserve: 100 GiB.</p></details>
  </fieldset></section>
  <section class="design-density"><h3>Design region</h3><canvas data-density width="512" height="512" aria-label="Density editor"></canvas><p data-density-caption></p>
   <fieldset><legend>Initial density</legend><div class="design-density-tools"><label>x pixels<input aria-label="Density x pixels" data-nx type="number" value="${r.initial_density.length}" min="1" max="1024"></label><label>y pixels<input aria-label="Density y pixels" data-ny type="number" value="${r.initial_density[0].length}" min="1" max="1024"></label><label>Paint value<input aria-label="Density paint value" data-paint type="number" value="0.5" min="0" max="1" step="0.1"></label></div><button data-reset-density>Fill / resize initial density</button><button data-show-initial>Show initial density</button><p>Click or drag to paint. x increases right and y increases upward.</p></fieldset>
   <div class="design-file-tools"><button data-save-design>Save setup JSON</button><button data-load-design>Load setup JSON</button><button data-export-design>Export Python</button><input data-import-design type="file" accept=".json" hidden></div>
   <button data-use-seed disabled>Use evaluated result as new seed</button>
  </section>
  <section class="design-run"><h3>Execution plan</h3><button data-plan-design>Check memory</button><p data-plan-summary>No fields or trial simulations are run by the memory check.</p>
   <div class="design-run-buttons"><button data-start-design>Run inverse design</button><button data-stop-design disabled>Stop</button></div><p data-design-status role="status">Ready</p><p class="design-stop-note">Stop takes effect between solver calls. Closing this panel keeps the job running.</p>
   <h3>Evaluated objective</h3><table><thead><tr><th>Update</th><th>Score ↑</th><th>Gradient L2</th></tr></thead><tbody data-design-history></tbody></table><a data-design-download hidden>Download evaluated designs</a>
  </section></div>`,t("[data-close-design]").onclick=()=>e.close(),e.querySelectorAll("[data-key]").forEach(b=>b.onchange=()=>{const[C,I]=b.dataset.key.split(".");let B=b.type==="number"?b.value===""?null:Number(b.value):b.value;C==="state_directory"&&!B&&(B=null),I!==void 0?r[C][Number(I)]=B:r[C]=B,m(),h=!1,x(),t("[data-plan-summary]").textContent="Settings changed. Check memory before running."}),t("[data-reset-density]").onclick=()=>{try{const b=Number(t("[data-nx]").value),C=Number(t("[data-ny]").value),I=Number(t("[data-paint]").value);if(!Number.isInteger(b)||!Number.isInteger(C)||b<1||C<1||b*C>1048576||I<0||I>1)throw Error("Use positive pixel counts and a density in [0,1].");r.initial_density=Array.from({length:b},()=>Array(C).fill(I)),m(),h=!1,x(),t("[data-plan-summary]").textContent="Settings changed. Check memory before running."}catch(b){v(b)}},t("[data-show-initial]").onclick=()=>{h=!1,x()};const R=t("[data-density]");function M(b){if(l||h)return;const C=R.getBoundingClientRect(),I=r.initial_density,B=Number(t("[data-paint]").value);if(!Number.isFinite(B)||B<0||B>1)return;const H=Math.min(I.length-1,Math.max(0,Math.floor((b.clientX-C.left)/C.width*I.length))),k=Math.min(I[0].length-1,Math.max(0,I[0].length-1-Math.floor((b.clientY-C.top)/C.height*I[0].length)));I[H][k]=B,x()}R.onpointerdown=b=>{u=!0,R.setPointerCapture(b.pointerId),M(b)},R.onpointermove=b=>{u&&M(b)},R.onpointerup=()=>{u=!1,m()},t("[data-plan-design]").onclick=async()=>{try{const b=await f("design/plan",r);w(b)}catch(b){v(b)}},t("[data-start-design]").onclick=async()=>{try{y(!0),c=null,a=(await f("design/jobs",r)).id,localStorage.setItem(s,a),await S()}catch(b){y(!1),v(b)}},t("[data-stop-design]").onclick=async()=>{try{await f("jobs/"+a+"/cancel",{}),t("[data-design-status]").textContent="Stop requested. Waiting for the current solver call."}catch(b){v(b)}},t("[data-save-design]").onclick=()=>_(JSON.stringify(r,null,2),"periodic-design.json"),t("[data-export-design]").onclick=async()=>{try{_(await f("design/python",r),"periodic_design.py","text/x-python")}catch(b){v(b)}},t("[data-load-design]").onclick=()=>t("[data-import-design]").click(),t("[data-import-design]").onchange=async b=>{try{const C=b.target.files[0];if(!C)return;const I=JSON.parse(await C.text());r=await f("design/config",I),m(),h=!1,c=null,a=null,localStorage.removeItem(s),g()}catch(C){v(C)}},t("[data-use-seed]").onclick=async()=>{try{const b=await f("design/jobs/"+a+"/download");if(!b.last_evaluated)throw Error("No evaluated density is available.");r={...b.config,initial_density:b.last_evaluated.density},m(),h=!1,c=null,a=null,localStorage.removeItem(s),g()}catch(b){v(b)}},x(),y(l),c&&T(c)}function w(R){var b;const M=((b=R.selection)==null?void 0:b.mode)||R.execution;t("[data-plan-summary]").textContent=`${R.device==="cuda"?"CUDA GPU":"CPU"} · ${M} · FP32
GPU ${(R.gpu_reservation_bytes/1024**3).toFixed(3)} GiB · DRAM ${(R.total_host_reservation_bytes/1024**3).toFixed(3)} GiB · file ${(R.disk_reservation_bytes/1024**3).toFixed(3)} GiB reserved. No calibration solves.`}function T(R){var I;c=R;const M=R.progress||{};y(["queued","running"].includes(R.status));const b=JSON.stringify(R.config)===JSON.stringify(r);t("[data-design-status]").textContent=R.error||`${l&&R.cancel_requested?"Stopping":R.status} · ${M.stage||"waiting"} · ${M.updates_completed||0} / ${((I=R.config)==null?void 0:I.iterations)||r.iterations} updates`,M.plan&&b?w(M.plan):b||(t("[data-plan-summary]").textContent="Settings differ from the displayed run. Check memory for this setup."),t("[data-design-history]").innerHTML=(M.history||[]).map(B=>`<tr><td>${B.update}</td><td>${B.objective.toPrecision(7)}</td><td>${B.gradient_l2===void 0?"—":B.gradient_l2.toExponential(3)}</td></tr>`).join(""),M.density_preview&&b&&(h=!0,x());const C=t("[data-design-download]");C.hidden=!R.summary,C.href="/api/design/jobs/"+a+"/download"}async function S(){clearTimeout(o);try{const R=await f("jobs/"+a);T(R),l&&e.open&&(o=setTimeout(S,1500))}catch(R){y(!1),v(R)}}return e.addEventListener("close",()=>clearTimeout(o)),{async open(){if(!r){const R=await f("design/defaults");try{const M=JSON.parse(localStorage.getItem(i));r=M?await f("design/config",M):R}catch{r=R}if(!localStorage.getItem(i)){const M=await f("health");r.device=M.cuda?"cuda":"cpu"}}g(),e.showModal(),a&&await S()}}}function Ov(n,e){const t={auto_shutoff:!1,decay_threshold:1e-6,check_interval:50,consecutive_checks:3,min_steps:100,source_tail_amplitude:1e-8,after_source_s:0,divergence_check:!0,growth_limit:1e6,field_limit:null};n.run_control??(n.run_control={});const i=n.run_control;for(const[r,a]of Object.entries(t))i[r]===void 0&&(i[r]=a);const s=(r,a,o="",l={})=>e(r,"run_control."+a,i[a],o,l);return`<label class="enabled-row"><input aria-label="Automatic decay shutoff" type="checkbox" data-path="run_control.auto_shutoff" ${i.auto_shutoff?"checked":""}> Automatic decay shutoff</label>`+s("decay threshold","decay_threshold","",{min:1e-15})+s("check every","check_interval","steps",{min:1,step:1})+s("consecutive low checks","consecutive_checks","",{min:2,step:1})+s("minimum time steps","min_steps","",{min:10,step:1})+s("source tail cutoff","source_tail_amplitude","",{min:1e-15})+e("wait after source","run_control.after_source_s",i.after_source_s*1e15,"fs",{min:0,scale:1e-15})+`<label class="enabled-row"><input aria-label="Divergence checking" type="checkbox" data-path="run_control.divergence_check" ${i.divergence_check?"checked":""}> Divergence checking</label>`+s("post-source growth limit","growth_limit","",{min:1.01})+`<label class="enabled-row"><input aria-label="Absolute field limit" type="checkbox" data-run-field-limit ${i.field_limit!==null?"checked":""}> Absolute field limit</label>`+(i.field_limit!==null?s("maximum field magnitude","field_limit","",{min:1e-30}):"")+'<p class="property-help">Decay threshold and growth limit are ratios of the whole-domain state norm. Source tail cutoff is a relative envelope amplitude. Absolute field limits use reduced field units. All finite sources must finish before decay checks. Continuous sources disable automatic termination. Confirm spectra with a longer run.</p>'}function uh(n,e,t,{plane:i=!1,prefix:s="spectrum."}={}){const r=n.sampling,a=[...i?[]:[["fft","FFT bins"]],["frequency","Uniform frequency"],["wavelength","Uniform wavelength"],["chebyshev","Chebyshev nodes"],["custom","Custom frequencies"]];return t("sample spacing",s+"sampling",r,a)+(r==="custom"?`<label class="monitor-custom">Frequencies (THz)<textarea data-frequency-table data-prefix="${s}" aria-label="Custom frequencies (THz)">${(n.custom_frequencies_hz||[]).map(o=>o*1e-12).join(`
`)}</textarea></label>`:r!=="fft"?`<label class="enabled-row"><input type="checkbox" data-path="${s}use_source_limits" ${n.use_source_limits?"checked":""}> Use source wavelength limits</label><fieldset ${n.use_source_limits?"disabled":""}>`+e("minimum wavelength",s+"wavelength_start",n.wavelength_start,"µm",{min:.001})+e("maximum wavelength",s+"wavelength_stop",n.wavelength_stop,"µm",{min:.001})+"</fieldset>"+e("frequency points",s+"frequency_points",n.frequency_points,"",{min:1,step:1})+(r==="chebyshev"?t("Chebyshev node rule",s+"chebyshev_nodes",n.chebyshev_nodes||"roots",[["roots","Roots (interior)"],["lobatto","Lobatto (include endpoints)"]])+`<label class="enabled-row"><input type="checkbox" data-path="${s}chebyshev_wavelength" ${n.chebyshev_wavelength?"checked":""}> Chebyshev nodes in wavelength</label>`:""):"")}function zv(n,e,t,i){const s=n.record_fields??["Ex","Ey","Ez","Hx","Hy","Hz"],r=n.record_poynting??["x","y","z"],a=n.downsample_xyz??[n.downsample||1,n.downsample||1,n.downsample||1],o=(l,c,h)=>c.map(u=>`<label class="enabled-row"><input type="checkbox" data-record-family="${l}" value="${u}" ${h.includes(u)?"checked":""}> Record ${l==="record_poynting"?"P"+u:u}</label>`).join("");return i("normal axis","normal",n.normal,e.dimension==="2d"?["x","y"]:["x","y","z"])+["x","y","z"].filter(l=>l!==n.normal&&(e.dimension==="3d"||l!=="z")).map(l=>t("downsample "+l,"downsample_xyz."+"xyz".indexOf(l),a["xyz".indexOf(l)],"",{min:1,max:32,step:1})).join("")+i("spatial interpolation","spatial_interpolation",n.spatial_interpolation||"specified",[["specified","Specified plane"],["nearest","Nearest normal mesh node"]])+i("DFT accumulation precision","dft_precision",n.dft_precision||"field",[["field","Match solver precision"],["float64","Double precision"]])+o("record_fields",["Ex","Ey","Ez","Hx","Hy","Hz"],s)+o("record_poynting",["x","y","z"],r)+`<label class="enabled-row"><input type="checkbox" data-path="record_flux" ${n.record_flux!==!1?"checked":""}> Record signed flux</label><p class="property-help">Only fields required by the selected outputs are accumulated. Flux alone requires four tangential E/H components. Incident subtraction also requires storing those fields.</p><button data-action="flux-results">Open flux results</button>`}function Bv({state:n,api:e,esc:t,toast:i,commit:s,numeric:r,dropdown:a}){const o=document.createElement("dialog");o.className="monitor-dialog",document.body.append(o);const l=u=>o.querySelector(u);let c=0;function h(){o.querySelectorAll("[data-dismiss]").forEach(u=>u.onclick=()=>{c++,o.close()})}return{globals(){const u=structuredClone(n.project);u.global_monitor??(u.global_monitor={sampling:"frequency",wavelength_start:1.3,wavelength_stop:1.8,frequency_points:101,apodization:"none",apodization_center:2e-14,apodization_time_width:1e-14,custom_frequencies_hz:[],chebyshev_wavelength:!1});function f(){const m=u.global_monitor;o.innerHTML=`<div class="fsp-heading"><h2>Global monitor settings</h2><button data-dismiss>Close</button></div><fieldset ${n.mode!=="layout"?"disabled":""}>${uh(m,r,a,{plane:!0,prefix:""})}${a("apodization","apodization",m.apodization,["none","start","end","full"])}${r("apodization center","apodization_center",m.apodization_center*1e15,"fs",{scale:1e-15})}${r("apodization time width","apodization_time_width",m.apodization_time_width*1e15,"fs",{scale:1e-15})}<button data-apply>Apply monitor settings</button></fieldset><p class="monitor-status"></p>`,h(),o.querySelectorAll("[data-path]").forEach(v=>v.onchange=()=>{var p;m[v.dataset.path]=v.type==="checkbox"?v.checked:v.type==="number"?Number(v.value)*Number(v.dataset.scale||1):v.value,["sampling","use_source_limits"].includes(v.dataset.path)&&(m.sampling==="custom"&&!((p=m.custom_frequencies_hz)!=null&&p.length)&&(m.custom_frequencies_hz=[2e14]),f())});const _=l("[data-frequency-table]");_&&(_.onchange=()=>{m.custom_frequencies_hz=_.value.trim().split(/[\s,;]+/).filter(Boolean).map(v=>Number(v)*1e12)}),l("[data-apply]").onclick=async()=>{try{const v=await e("/validate",u);s(v.project),o.close()}catch(v){l(".monitor-status").textContent=v.message}}}f(),o.showModal()},async flux(){if(!n.job)throw Error("Run a project with a frequency monitor first.");const u=await e("/jobs/"+n.job),f=u.flux_monitors||[];if(!f.length)throw Error("This run has no distributed frequency monitors.");const m=await e("/jobs");o.innerHTML=`<div class="fsp-heading"><h2>Frequency fields / power flux</h2><button data-dismiss>Close</button></div><label>Monitor <select aria-label="Flux monitor">${f.map(v=>`<option value="${t(v.id)}">${t(v.name)} · +${v.normal}</option>`).join("")}</select></label><label>Reference run <select aria-label="Flux reference"><option value="">Raw signed flux</option>${m.filter(v=>v.id!==n.job&&v.flux_monitors.length).map(v=>`<option value="${v.id}">${t(v.name)} · ${v.id.slice(0,8)}</option>`).join("")}</select></label><label class="enabled-row"><input type="checkbox" aria-label="Subtract incident fields"> Subtract reference E/H before computing flux (reflection)</label><button data-plot-flux>Plot flux</button><a href="/api/jobs/${n.job}/flux.csv">Export raw flux CSV</a><canvas></canvas><p class="monitor-status"></p><p>Flux is signed along the positive monitor normal. A reflected wave can be negative. Reference normalization requires identical sources, mesh, duration and unapodized monitors. For an air reference, freeze graded refinements before removing structures, then run both scenes with the same monitor IDs. Absolute watt calibration is not provided.</p>`,h();async function _(){const v=++c;try{const p=f.find(g=>g.id===l('[aria-label="Flux monitor"]').value),d=l('[aria-label="Flux reference"]').value,x=l('[aria-label="Subtract incident fields"]').checked;let y={...p,spectrum:p.flux,signed:!0,spectrum_label:`Wavelength (µm) · signed flux (${p.units})`};if(d){const g=await e(`/jobs/${n.job}/normalize-flux?reference=${encodeURIComponent(d)}&monitor=${encodeURIComponent(p.id)}&subtract_incident=${x}`);if(v!==c)return;y={...p,...g,spectrum:g.ratio,signed:!0,spectrum_label:"Wavelength (µm) · signed normalized flux"},l(".monitor-status").textContent=`${g.valid.filter(Boolean).length}/${g.valid.length} frequencies above the reference threshold. Reflection is negative for propagation opposite the positive normal.`}else l(".monitor-status").textContent=`${p.points} spatial samples · collocated E/H · ${p.flux.length} frequencies. Raw reduced flux is not normalized transmission.`;Is(l("canvas"),[y],!0,!0)}catch(p){v===c&&(l(".monitor-status").textContent=p.message,i(p.message))}}l("[data-plot-flux]").onclick=_,o.showModal(),await _()}}}const kv={Waves:Kh,FolderOpen:Uh,Save:Wh,FileCode2:Ih,Box:Th,Cylinder:Lh,Circle:Ch,Orbit:zh,Scan:$h,Radio:Hh,MoveRight:Oh,Activity:wh,Copy:Ph,Trash2:Zh,Maximize:Fh,PencilRuler:Bh,Play:kh,Square:qh,Settings2:Xh,Undo2:Jh,Redo2:Vh,GitCommitHorizontal:Nh,CircleDot:Rh,Shapes:jh,ChartNoAxesCombined:Ah,Terminal:Yh,Download:Dh,RefreshCw:Gh};try{for(const n of Object.keys(localStorage)){if(!n.startsWith("photonweave."))continue;const e="torchfdtd."+n.slice(12);localStorage.getItem(e)===null&&localStorage.setItem(e,localStorage.getItem(n))}}catch{}const xe=n=>document.querySelector(n),Qn=n=>[...document.querySelectorAll(n)],gt=n=>String(n).replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e]),Ve=n=>`<i data-lucide="${n}"></i>`,U={project:null,selected:"fdtd",mode:"layout",snap:!0,history:[],future:[],job:null,results:null,frame:0,tab:"geometry",bottom:"messages",dirty:!1};let lt,xn,dc,Oi,Yt;const Sa=[];xe("#app").innerHTML=`
<header><div class="brand"><span class="brand-mark">${Ve("waves")}</span><strong>TorchFDTD</strong><span class="product">Workbench</span></div><div class="project-title" id="project-title"></div><div class="connection" id="connection"><span class="dot"></span>Connecting to solver…</div></header>
<nav class="menubar"><button data-action="new">File</button><button data-action="undo">Edit</button><button data-action="fit">View</button><button data-action="materials">Materials</button><button data-action="region">Simulation</button><button data-action="inverse-design">Inverse design</button><button data-action="capabilities">Feature checklist</button><button data-action="flux-results">Flux results</button><button data-action="help">Help</button><span class="version">DEVELOPMENT</span></nav>
<div class="ribbon-tabs"><button class="active" data-ribbon="design">Design</button><button data-ribbon="simulation">FDTD</button><button data-ribbon="view">View</button><span class="ribbon-note">Geometry and wavelength in µm</span></div>
<div class="ribbon">
 <div class="tool-group"><div class="tool-row"><button class="tool" data-action="open">${Ve("folder-open")}<span>Open</span></button><button class="tool" data-action="save">${Ve("save")}<span>Save</span></button><button class="tool" data-action="fsp">${Ve("folder-open")}<span>FSP inspect</span></button><button class="tool editable" data-action="fsp-native">${Ve("folder-open")}<span>FSP → GPU</span></button><button class="tool" data-action="python">${Ve("file-code-2")}<span>Python</span></button></div><label>Project</label></div>
 <div class="tool-group"><div class="tool-row"><button class="tool editable" data-add="rectangle">${Ve("box")}<span>Rectangle</span></button><button class="tool editable" data-add="circle">${Ve("cylinder")}<span>Circle</span></button><button class="tool editable" data-add="ring">${Ve("circle")}<span>Ring</span></button><button class="tool editable" data-add="sphere">${Ve("orbit")}<span>Sphere</span></button><button class="tool editable" data-add="polygon">${Ve("shapes")}<span>Polygon</span></button></div><label>Structures</label></div>
 <div class="tool-group"><div class="tool-row"><button class="tool" data-action="region">${Ve("scan")}<span>FDTD region</span></button><button class="tool editable" data-add="point">${Ve("radio")}<span>Dipole</span></button><button class="tool editable" data-add="plane">${Ve("move-right")}<span>Sheet source</span></button><button class="tool editable" data-add="tfsf">${Ve("scan")}<span>TFSF box</span></button><button class="tool editable" data-add="monitor">${Ve("activity")}<span>Time monitor</span></button><button class="tool editable" data-add="field">${Ve("activity")}<span>DFT / Flux</span></button></div><label>Simulation objects</label></div>
 <div class="tool-group"><div class="tool-row"><button class="tool editable" data-action="duplicate">${Ve("copy")}<span>Duplicate</span></button><button class="tool editable" data-action="delete">${Ve("trash-2")}<span>Delete</span></button><button class="tool" data-action="fit">${Ve("maximize")}<span>Fit view</span></button></div><label>Edit & view</label></div>
 <div class="tool-group run-tools"><div class="tool-row"><button class="tool" id="layout-button" data-action="layout">${Ve("pencil-ruler")}<span>Layout</span></button><button class="tool run" id="run-button" data-action="run">${Ve("play")}<span>Run</span></button><button class="tool stop" id="stop-button" data-action="stop" disabled>${Ve("square")}<span>Stop</span></button></div><label>Run simulation</label></div>
</div>
<main>
 <aside class="left-panel"><div class="panel-heading">Objects Tree <span id="object-count"></span></div><div class="tree-tools"><button data-action="region" title="Edit selected object">${Ve("settings-2")}</button><button data-action="undo" title="Undo (Ctrl+Z)">${Ve("undo-2")}</button><button data-action="redo" title="Redo (Ctrl+Y)">${Ve("redo-2")}</button><label><input type="checkbox" id="snap" checked> Snap</label></div><div id="tree"></div><div class="panel-heading results-heading">Results View</div><div id="results-tree" class="results-tree"><div class="muted empty-hint">Select Run to calculate fields<br>and monitor signals.</div></div><div class="left-footer"><span class="eyebrow">EXAMPLE PROJECTS</span><button data-example="waveguide">${Ve("git-commit-horizontal")}SiN waveguide<span>2D</span></button><button data-example="scatterer">${Ve("circle-dot")}Cylinder scattering<span>2D</span></button><button data-example="3d">${Ve("orbit")}Dielectric sphere<span>3D</span></button></div></aside>
 <section class="workspace"><div class="workspace-tabs"><button class="active" data-tab="geometry">${Ve("shapes")} Layout editor</button><button data-tab="fields">${Ve("chart-no-axes-combined")} Field visualizer</button><span class="mode-badge" id="mode-badge">LAYOUT</span></div><div id="viewports" class="viewports"></div><div id="field-view" hidden><div class="field-tools"><strong id="field-label">Ez · XY plane</strong><span id="frame-label">No data</span><button data-action="playback" title="Animate stored frames">${Ve("play")}</button><input type="range" id="frame-slider" min="0" max="0" value="0"><button data-action="download">${Ve("download")} NPZ</button></div><canvas id="field-canvas"></canvas><div class="plot-title"><strong>Point monitor</strong><select id="plot-monitor" aria-label="Plot monitor"></select><select id="plot-axis" aria-label="Spectrum axis" hidden><option value="frequency">Frequency</option><option value="wavelength">Wavelength</option></select><button data-plot="time" class="active">Time signal</button><button data-plot="spectrum">Field spectrum</button><button data-action="csv">${Ve("download")} CSV</button></div><canvas id="monitor-canvas"></canvas></div>
 <section class="bottom-panel"><div class="bottom-tabs"><button class="active" data-bottom="messages">${Ve("terminal")} Simulation log <span id="log-count"></span></button><button data-bottom="python">${Ve("file-code-2")} Python script</button><div class="bottom-actions"><button data-action="export-python">Export .py</button></div></div><div id="messages" role="log"></div><textarea id="python-editor" spellcheck="false" readonly hidden aria-label="Generated Python script"></textarea></section></section>
 <aside class="right-panel"><div class="panel-heading">Object properties <span id="property-type"></span></div><div id="properties"></div><div class="mesh-card"><div><span class="eyebrow">SIMULATION SUMMARY</span><button data-action="validate" title="Validate mesh and geometry">${Ve("refresh-cw")}</button></div><div id="mesh-summary">Validating project…</div></div></aside>
</main>
<footer><span id="status-text"><span class="dot"></span>Ready</span><span id="footer-grid"></span><div class="progress-track"><div id="progress-bar"></div></div><span id="progress-label"></span><span id="footer-device">Solver connecting</span></footer>
<input id="file-input" type="file" accept=".json,.fsp" hidden><dialog id="dialog"><div id="dialog-content"></div></dialog><div id="toast" role="alert" hidden></div>`;function Us(){Qh({icons:kv,attrs:{"stroke-width":1.65}})}function At(n,e="info"){Sa.push({text:n,kind:e,time:new Date().toLocaleTimeString("en-GB")}),xe("#messages").innerHTML=Sa.slice(-100).map(t=>`<div class="log ${t.kind}"><time>${t.time}</time><span>${gt(t.text)}</span></div>`).join(""),xe("#messages").scrollTop=xe("#messages").scrollHeight,xe("#log-count").textContent=Sa.length}function $t(n){xe("#toast").textContent=n,xe("#toast").hidden=!1,setTimeout(()=>xe("#toast").hidden=!0,5e3)}async function Tt(n,e){var i;const t=await fetch("/api"+n,e===void 0?{}:{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});if(!t.ok){let s;try{s=await t.json()}catch{throw Error(`Server returned ${t.status}`)}throw Error(Array.isArray(s.detail)?s.detail.map(r=>r.loc.join(".")+": "+r.msg).join(`
`):s.detail||`Server returned ${t.status}`)}return(i=t.headers.get("content-type"))!=null&&i.includes("json")?t.json():t.text()}function xs(){return[...U.project.structures,...U.project.sources,...U.project.monitors].find(n=>n.id===U.selected)}function bo(n){return U.project.structures.some(e=>e.id===n)?"structures":U.project.sources.some(e=>e.id===n)?"sources":"monitors"}function xt(){U.history.push(JSON.stringify(U.project)),U.history.length>80&&U.history.shift(),U.future=[]}function mt(){U.dirty=!0;try{localStorage.setItem("torchfdtd.project.v1",JSON.stringify(U.project))}catch{$t("Browser storage is full. Use Save to keep this project before closing or reloading."),At("Automatic browser save failed. Export this project with Save to retain the current settings.","warning")}}function Hv(n,e,t=!0){Object.assign([...U.project.structures,...U.project.sources,...U.project.monitors].find(i=>i.id===n)||{},e),t&&(mt(),Ht(),nn(),ot())}function bn(n){U.selected=n,nn(),Ht(),lt==null||lt.render()}function Tn(n){U.mode=n,xe("#mode-badge").textContent=n.toUpperCase(),xe("#mode-badge").className="mode-badge "+n,Qn(".editable").forEach(e=>e.disabled=n!=="layout"),xe("#run-button").disabled=n!=="layout",xe("#stop-button").disabled=n!=="running",xe("#layout-button").disabled=n==="running",Qn("[data-example]").forEach(e=>e.disabled=n==="running"),Ht(),lt==null||lt.render()}function nn(){const n=U.project;xe("#project-title").textContent=n.name,xe("#object-count").textContent=n.structures.length+n.sources.length+n.monitors.length+1;const e=(t,i,s="")=>`<button class="tree-row ${U.selected===t.id?"selected":""} ${s}" data-select="${gt(t.id)}"><span class="tree-icon">${Ve(i)}</span><span>${gt(t.name)}</span>${t.enabled===!1?"<small>off</small>":""}</button>`;xe("#tree").innerHTML=`<div class="tree-root">${Ve("folder-open")} model</div>${e({id:"fdtd",name:"FDTD"},"scan","region-row")}<div class="tree-group">Structures <span>${n.structures.length}</span></div>${n.structures.map(t=>e(t,{rectangle:"box",circle:"cylinder",ring:"circle",sphere:"orbit",polygon:"shapes"}[t.kind])).join("")}<div class="tree-group">Sources <span>${n.sources.length}</span></div>${n.sources.map(t=>e(t,"radio","source-row")).join("")}<div class="tree-group">Monitors <span>${n.monitors.length}</span></div>${n.monitors.map(t=>e(t,"activity","monitor-row")).join("")}`,Us()}function Je(n,e,t,i="",s={}){var r;return`<label class="property-row"><span>${n}</span><div><input aria-label="${n}" data-path="${e}" data-scale="${s.scale||1}" ${s.reciprocal?`data-reciprocal="${s.reciprocal}"`:""} type="number" value="${Number(((r=t.toPrecision)==null?void 0:r.call(t,12))??t)}" step="${s.step||"any"}" ${s.min!==void 0?`min="${s.min}"`:""}><small>${i}</small></div></label>`}function Pt(n,e,t,i){return`<label class="property-row"><span>${n}</span><select aria-label="${n}" data-path="${e}">${i.map(s=>{const[r,a]=Array.isArray(s)?s:[s,s];return`<option value="${gt(r)}" ${r===t?"selected":""}>${gt(a)}</option>`}).join("")}</select></label>`}function Gt(n,e){return`<section class="property-section"><h3>${n}</h3>${e}</section>`}function Ht(){var s,r;if(!U.project)return;const n=U.project,e=xs(),t=n.region;xe("#property-type").textContent=e?e.kind||"monitor":"solver";let i="";if(!e)i=`<div class="object-title">${Ve("scan")}<div><strong>FDTD</strong><small>Simulation region</small></div></div>`,i+=Gt("General",Pt("dimension","dimension",t.dimension,[["2d","2D (XY)"],["3d","3D"]])+Pt("resource","backend",t.backend,[["auto","GPU if available"],["cuda","GPU · CUDA"],["cpu","CPU · NumPy"]])+Pt("precision","precision",t.precision,["float32","float64"])+Pt("CUDA kernel","cuda_kernel",t.cuda_kernel||"torch",[["torch","PyTorch reference"],["fused","Fused Yee / CPML (experimental)"]])+Pt("Frequency monitor kernel","cuda_monitor_kernel",t.cuda_monitor_kernel||"torch",[["torch","PyTorch reference"],["fused","Shared CUDA plane DFT (experimental)"]])),i+=Gt("Geometry",t.size.map((a,o)=>Je("xyz"[o]+" span","size."+o,a,"µm",{min:.01})).join("")),i+=Gt("Mesh settings",gv(t,Je,Pt,gt)),i+=Gt("Boundary conditions",Je("PML layers","pml_cells",t.pml_cells,"cells",{step:1,min:3})+["x","y",...t.dimension==="3d"?["z"]:[]].map((a,o)=>["min","max"].map(c=>{const h=a+"_"+c,u=t.boundaries[h];return Pt(a+" "+c+" bc","boundaries."+h+".kind",u.kind,[["pml","PML"],["periodic","Periodic"],["bloch","Bloch"]])+(u.kind==="pml"?`<details class="boundary-options"><summary>${a} ${c} PML settings</summary>${Je(a+" "+c+" layers","boundaries."+h+".layers",u.layers??t.pml_cells,"cells",{step:1,min:3})}<label class="enabled-row"><input type="checkbox" data-boundary-default="${h}" ${u.layers===null?"checked":""}> Use default layers</label>${Je("sigma scale","boundaries."+h+".sigma_scale",u.sigma_scale)}${Je("kappa","boundaries."+h+".kappa",u.kappa)}${Je("alpha","boundaries."+h+".alpha",u.alpha)}${Je("polynomial","boundaries."+h+".polynomial",u.polynomial)}${Je("alpha polynomial","boundaries."+h+".alpha_polynomial",u.alpha_polynomial)}</details>`:"")}).join("")+(t.boundaries[a+"_min"].kind==="bloch"?Je("Bloch phase "+a,"bloch_phase."+o,t.bloch_phase[o],"rad"):"")).join("")+Je("background index","background_index",t.background_index,"",{min:1})+'<p class="property-help">Cyclic boundaries are paired. Bloch phase is the phase gained over one positive unit-cell translation. PML coefficients use the native CPML convention.</p>'),i+=Gt("Simulation time",Je("dt stability factor","courant_factor",t.courant_factor??.99,"",{min:.01})+Je("time steps","steps",t.steps,"",{step:1,min:10})+Je("snapshot every","snapshot_interval",t.snapshot_interval,"steps",{step:1,min:1})),i+=Gt("Termination and diagnostics",Ov(t,Je)),i+=Gt("Field output",Pt("component","field",t.field,["Ex","Ey","Ez","Hx","Hy","Hz"])+Pt("plane normal","slice_axis",t.slice_axis,t.dimension==="2d"?["z"]:["x","y","z"])+Je("plane position","slice_position",t.slice_position,"µm")+Pt("field display","complex_display",t.complex_display,[["real","Real"],["imag","Imaginary"],["magnitude","Magnitude"],["phase","Phase (rad)"]]));else{const a=bo(e.id),o=a==="structures",l=a==="sources";i=`<div class="object-title">${Ve(o?"box":l?"radio":"activity")}<div><strong>${gt(e.name)}</strong><small>${o?e.kind:l?e.kind+" source":e.kind==="field"?"Frequency / flux monitor":"Point time monitor"}</small></div></div><label class="property-row name-row"><span>name</span><input aria-label="name" data-path="name" value="${gt(e.name)}"></label><label class="enabled-row"><input type="checkbox" data-path="enabled" ${e.enabled?"checked":""}> Enabled in simulation</label>`;const c=e.kind==="field"?[0,1,2].filter(h=>h!=="xyz".indexOf(e.normal)&&(t.dimension==="3d"||h<2)):e.kind==="tfsf"?[0,1,2].filter(h=>t.dimension==="3d"||h<2):e.kind==="rectangle"||e.kind==="plane"?[0,1,2]:["circle","ring","polygon"].includes(e.kind)?[2]:[];if(i+=Gt("Geometry",e.center.map((h,u)=>Je("xyz"[u],"center."+u,h,"µm")).join("")+c.map(h=>Je("xyz"[h]+" span","size."+h,e.size[h],"µm",{min:o?.001:0})).join("")+(["circle","sphere","ring"].includes(e.kind)?Je("radius","radius",e.radius,"µm",{min:.001}):"")+(e.kind==="ring"?Je("inner radius","inner_radius",e.inner_radius,"µm",{min:0}):"")+(o?Mv(e,Je):"")),o&&(i+=Gt("Material",Pt("material","material",e.material,n.materials.map(h=>h.name))+`<div class="static-row">refractive index <b>${(((s=n.materials.find(h=>h.name===e.material))==null?void 0:s.model)||"dielectric")==="dielectric"?(r=n.materials.find(h=>h.name===e.material))==null?void 0:r.index:"dispersive"}</b></div>`+Je("mesh order","mesh_order",e.mesh_order,"",{step:1,min:1})+'<p class="property-help">Lower order takes priority in overlaps. Open Materials to edit dielectric, Drude or Lorentz parameters and inspect n/k.</p>'),i+=Gt("Rotation",Sv(e,Je,Pt))),o){const h=n.structures.findIndex(u=>u.id===e.id);i+=Gt("Structure order",`<button data-action="structure-earlier" ${h===0?"disabled":""}>Move earlier in tree</button><button data-action="structure-later" ${h===n.structures.length-1?"disabled":""}>Move later in tree</button><p class="property-help">When mesh orders are equal, the later structure takes priority in overlaps.</p>`)}if(l){e.time_definition??(e.time_definition="cycles"),e.pulse_length??(e.pulse_length=2e-14),e.pulse_offset??(e.pulse_offset=5e-14),e.phase??(e.phase=0);const h=e.use_global_source?n.global_source:e;i+=Gt("Source settings",Pv(e,t,Je,Pt)+Cv(e,Je,Pt)+`<label class="enabled-row"><input type="checkbox" data-path="use_global_source" ${e.use_global_source?"checked":""} ${n.global_source?"":"disabled"}> Use global source settings</label><button data-action="global-source">Edit global source settings</button>${n.global_source?"":'<p class="property-help">Imported global settings are unavailable. Configure them before enabling inheritance.</p>'}`+(h?`<fieldset ${e.use_global_source?"disabled":""}>`+hh(h,Je,Pt)+'<button data-action="source-signal">Load / edit time signal</button></fieldset>':"")+Je("phase","phase",e.phase,"deg")+Je("amplitude","amplitude",e.amplitude,"",{min:.001})+`<button data-action="source-preview">Preview time signal / spectrum</button><p class="property-help">${e.kind==="tfsf"?"Closed box with six-face E/H corrections and a live incident Yee line. Source preview shows the incident field at the entry face.":e.injection==="oneway"?"Normal-incidence discrete E/H plane with an eight-cell incident-line delay. Amplitude scales the incident-line soft drive. Source preview includes both corrections.":e.kind==="plane"?"Bidirectional E/H sheet. Bloch axes apply the unit-cell phase across the sheet.":"Reduced electric or magnetic point excitation. Magnetic sources use the H half-step time. Vector orientation may excite both 2D polarizations."}</p>`)}if(!o&&!l){e.spectrum??(e.spectrum={sampling:"fft",wavelength_start:1.3,wavelength_stop:1.8,frequency_points:101,apodization:"hann",apodization_center:2e-14,apodization_time_width:1e-14});const h=e.use_global_monitor?n.global_monitor:e.spectrum,u=e.use_global_monitor&&e.inherit_apodization!==!1,f=u?h:e.spectrum;i+=Gt("Monitor settings",(e.kind==="field"?zv(e,t,Je,Pt):Pt("component","component",e.component,["Ex","Ey","Ez","Hx","Hy","Hz"])+'<p class="property-help">Records one Yee field component at every time step. DFT downsampling affects spectral processing only.</p>')+Je("DFT time downsample","time_downsample",e.time_downsample||1,"",{min:1,step:1})+`<label class="enabled-row"><input type="checkbox" data-path="use_global_monitor" ${e.use_global_monitor?"checked":""}> Use global monitor settings</label>${e.use_global_monitor?`<label class="enabled-row"><input type="checkbox" data-path="inherit_apodization" ${u?"checked":""}> Inherit global apodization</label>`:""}<button data-action="global-monitor">Edit global monitor settings</button>`),i+=Gt("Frequency / wavelength",`<fieldset ${e.use_global_monitor?"disabled":""}>`+uh(h,Je,Pt,{plane:e.kind==="field"})+'</fieldset><p class="property-help">DFT values are unnormalized field integrals. Power ratios require a matching air reference.</p>'),i+=Gt("Apodization",`<fieldset ${u?"disabled":""}>`+Pt("apodization","spectrum.apodization",f.apodization,[["none","None"],["start","Start"],["end","End"],["full","Full"],...e.kind==="field"?[]:[["hann","Hann (legacy FFT)"]]])+(["start","end","full"].includes(f.apodization)?Je("apodization center","spectrum.apodization_center",f.apodization_center*1e15,"fs",{min:0,scale:1e-15})+Je("apodization time width","spectrum.apodization_time_width",f.apodization_time_width*1e15,"fs",{min:.001,scale:1e-15})+'<p class="property-help">Width is the intensity FWHM of the Gaussian window. Apodized spectra are not normalized transmission or absolute intensity.</p>':"")+"</fieldset>")}}xe("#properties").innerHTML=`<fieldset ${U.mode!=="layout"?"disabled":""}>${i}</fieldset>`,Us(),Vv(),xe("#properties").querySelectorAll("[data-path]").forEach(a=>a.addEventListener("change",()=>{var u;if(U.mode!=="layout")return;xt();const o=xs()||n.region,l=a.dataset.path.split(".");l[0]==="downsample_xyz"&&!o.downsample_xyz&&(o.downsample_xyz=[o.downsample||1,o.downsample||1,o.downsample||1]);let c=o;for(const f of l.slice(0,-1))c=c[f];const h=a.type==="checkbox"?a.checked:a.type==="number"?a.dataset.reciprocal?Number(a.dataset.reciprocal)/Number(a.value):Number(a.value)*Number(a.dataset.scale||1):a.value;if(l.length===1&&n.sources.includes(o)?ch(o,l[0],h):c[l.at(-1)]=h,o===t&&l[0]==="mesh_type"&&h==="graded"&&(t.material_sampling="yee",t.mesh_max=Math.max(t.mesh_max,t.mesh)),o===t&&l[0]==="interface_method"&&h==="subpixel"&&(t.material_sampling="yee"),o===t&&l[0]==="mesh_type"&&h!=="explicit"&&(t.mesh_coordinates=null),n.sources.includes(o)&&["injection","normal"].includes(l[0])&&hc(o,t,{boundaries:!0}),o.kind==="field"&&l[0]==="normal"){const f=o.size.indexOf(0),m="xyz".indexOf(h);f!==m&&(o.size[f]=Math.min(1,t.size[f]/2),o.size[m]=0)}if(l.join(".")==="spectrum.sampling"&&h==="custom"&&!((u=o.spectrum.custom_frequencies_hz)!=null&&u.length)&&(o.spectrum.custom_frequencies_hz=[2e14]),l.join(".")==="spectrum.sampling"&&a.value!=="fft"&&o.spectrum.apodization==="hann"&&(o.spectrum.apodization="none"),l.join(".")==="spectrum.sampling"&&h==="fft"&&(o.spectrum.use_source_limits=!1),o===t&&l[0]==="boundaries"&&l[2]==="kind"){const[f,m]=l[1].split("_"),_=a.value,v=f+"_"+(m==="min"?"max":"min");(_!=="pml"||t.boundaries[v].kind!=="pml")&&(t.boundaries[v].kind=_),_!=="bloch"&&(t.bloch_phase["xyz".indexOf(f)]=0)}o===t&&l[0]==="dimension"&&t.dimension==="2d"&&(t.slice_axis="z",t.slice_position=0,t.bloch_phase[2]=0,t.boundaries.z_min.kind="pml",t.boundaries.z_max.kind="pml",n.sources.forEach(f=>f.center[2]=0),n.monitors.forEach(f=>{f.center[2]=0,f.kind==="field"&&f.normal==="z"&&(f.normal="x",f.size[0]=0,f.size[2]=1)})),o===t&&l[0]==="dimension"&&t.mesh_type==="explicit"&&(t.mesh_type="uniform",t.mesh_coordinates=null),o===t&&["size","mesh","dimension"].includes(l[0])&&n.sources.forEach(f=>hc(f,t)),mt(),nn(),lt.render(),Ht(),ot()})),xe("#properties").querySelectorAll("[data-record-family]").forEach(a=>a.onchange=()=>{if(U.mode!=="layout")return;xt();const o=a.dataset.recordFamily,l=o==="record_fields"?["Ex","Ey","Ez","Hx","Hy","Hz"]:["x","y","z"],c=new Set(e[o]??l);a.checked?c.add(a.value):c.delete(a.value),e[o]=l.filter(h=>c.has(h)),mt(),Ht(),ot()}),xe("#properties").querySelectorAll("[data-source-vector]").forEach(a=>a.onchange=()=>{U.mode==="layout"&&(xt(),e.theta=a.checked?e.component[1]==="z"?0:90:null,e.phi=e.component[1]==="y"?90:0,mt(),Ht(),lt.render(),ot())}),xe("#properties").querySelectorAll("[data-source-family]").forEach(a=>a.onchange=()=>{U.mode==="layout"&&(xt(),e.component=a.value+e.component[1],mt(),Ht(),lt.render(),ot())}),xe("#properties").querySelectorAll("[data-frequency-table]").forEach(a=>a.onchange=()=>{U.mode==="layout"&&(xt(),e.spectrum.custom_frequencies_hz=a.value.trim().split(/[\s,;]+/).filter(Boolean).map(o=>Number(o)*1e12),mt(),ot())}),xe("#properties").querySelectorAll("[data-run-field-limit]").forEach(a=>a.onchange=()=>{U.mode==="layout"&&(xt(),t.run_control.field_limit=a.checked?1e6:null,mt(),Ht(),ot())}),xe("#properties").querySelectorAll("[data-axis-steps]").forEach(a=>a.onchange=()=>{U.mode==="layout"&&(xt(),t.mesh_steps=a.checked?[t.mesh,t.mesh,t.mesh]:null,a.checked&&(t.material_sampling="yee"),mt(),Ht(),lt.render(),ot())}),xe("#properties").querySelectorAll("[data-fixed-dt]").forEach(a=>a.onchange=()=>{U.mode==="layout"&&(xt(),t.time_step_override=a.checked?((Yt==null?void 0:Yt.dt_fs)??.01)*5e-16:null,mt(),Ht(),ot())})}function Vv(){Qn("[data-boundary-default]").forEach(n=>n.onchange=()=>{if(U.mode!=="layout")return;xt();const e=U.project.region;e.boundaries[n.dataset.boundaryDefault].layers=n.checked?null:e.pml_cells,mt(),Ht(),lt.render(),ot()})}async function ot(){try{return Yt=await Tt("/validate",U.project),xe("#mesh-summary").innerHTML=`<strong>${Yt.shape.join(" × ")}</strong><span>${Yt.cells.toLocaleString()} cells · ~${Yt.estimated_memory_mb} MB</span>${Yt.mesh_type==="graded"?`<span>${Yt.cell_reduction_percent.toFixed(1)}% fewer cells than uniform</span>`:""}<span>Δt ${Yt.dt_fs.toFixed(4)} fs · ${Yt.duration_fs.toFixed(1)} fs total</span>${Yt.warnings.map(n=>`<p class="warning">${gt(n)}</p>`).join("")}`,xe("#footer-grid").textContent=Yt.shape.join(" × ")+" cells",!0}catch(n){return xe("#mesh-summary").innerHTML=`<p class="warning error">${gt(n.message)}</p>`,!1}}function Gv(n){var s;if(U.mode!=="layout"||!U.project||!lt)return;xt();const e=crypto.randomUUID(),t={id:e,name:n+"_"+(U.project.structures.length+U.project.sources.length+U.project.monitors.length+1),center:[0,0,0],enabled:!0};if(["rectangle","circle","ring","sphere","polygon"].includes(n))U.project.structures.push(Nr({...t,kind:n,size:[1,1,.5],radius:.5,inner_radius:.3,rotation:0,material:((s=U.project.materials.find(r=>r.name.startsWith("SiN")))==null?void 0:s.name)||U.project.materials[0].name,mesh_order:2}));else if(n==="field")U.project.monitors.push({...t,kind:"field",component:"Ez",normal:"x",size:[0,Math.min(1,U.project.region.size[1]/3),U.project.import_provenance&&U.project.region.dimension==="2d"?1:Math.min(1,U.project.region.size[2]/3)],downsample:1,use_global_monitor:!1,spectrum:{sampling:"frequency",wavelength_start:1.3,wavelength_stop:1.8,frequency_points:41,apodization:"none",apodization_center:2e-14,apodization_time_width:1e-14}});else if(n==="monitor")U.project.monitors.push({...t,component:"Ez",...U.project.import_provenance?{spectrum:{sampling:"fft",apodization:"none"}}:{}});else if(n==="tfsf"){const r=U.project.region,a=r.dimension==="2d"?2:3,o=r.size.map((l,c)=>c>=a?0:Math.max(3*r.mesh,Math.min(2,l-2*(Math.max(r.boundaries["xyz"[c]+"_min"].layers??r.pml_cells,r.boundaries["xyz"[c]+"_max"].layers??r.pml_cells)+3)*r.mesh)));U.project.sources.push({...t,kind:n,injection:"oneway",normal:"x",direction:"+",size:o,component:"Ez",wavelength:1.55,amplitude:1,pulse:"gaussian",pulse_cycles:3,incident_pml_cells:96})}else U.project.sources.push({...t,kind:n,size:[0,1,0],component:"Ez",wavelength:1.55,amplitude:1,pulse:"gaussian",pulse_cycles:3});const i=U.project.sources.find(r=>r.id===e);i&&U.project.import_provenance&&Object.assign(i,{time_definition:"standard",pulse_length:2e-14,pulse_offset:5e-14}),mt(),bn(e),ot(),At("Added "+t.name+". Drag in a viewport or edit its properties.")}function fc(n,e,t="application/json"){const i=URL.createObjectURL(new Blob([n],{type:t})),s=document.createElement("a");s.href=i,s.download=e,s.click(),setTimeout(()=>URL.revokeObjectURL(i),1e3)}function ei(n){U.tab=n,Qn("[data-tab]").forEach(e=>e.classList.toggle("active",e.dataset.tab===n)),xe("#viewports").hidden=n!=="geometry",xe("#field-view").hidden=n!=="fields",n==="geometry"?lt.render():Bn()}function dh(n){U.bottom=n,Qn("[data-bottom]").forEach(e=>e.classList.toggle("active",e.dataset.bottom===n)),xe("#messages").hidden=n!=="messages",xe("#python-editor").hidden=n!=="python",n==="python"&&Tt("/python",U.project).then(e=>xe("#python-editor").value=e).catch(e=>$t(e.message))}function Bn(){var a,o,l;const n=U.project.region,e="xyz".indexOf(n.slice_axis),t=(((o=(a=U.results)==null?void 0:a.summary)==null?void 0:o.actual_size_um)||n.size).filter((c,h)=>h!==e),i=U.results,s=(i==null?void 0:i.frames[U.frame])||U.liveFrame;xe("#field-label").textContent=n.field+" · "+n.complex_display+" · "+["YZ","XZ","XY"][e]+" plane",xe("#frame-label").textContent=i?"Step "+i.frame_steps[U.frame]:"Live field",xe("#frame-slider").max=Math.max(0,((i==null?void 0:i.frames.length)||1)-1),xe("#frame-slider").value=U.frame;const r=U.monitors||[];r.some(c=>c.id===U.plotMonitor)||(U.plotMonitor=(l=r[0])==null?void 0:l.id),xe("#plot-monitor").innerHTML=r.map(c=>`<option value="${gt(c.id)}" ${c.id===U.plotMonitor?"selected":""}>${gt(c.name)} · ${c.component}</option>`).join(""),xe("#plot-axis").hidden=!U.spectrum,Tv(xe("#field-canvas"),s,t,n.field+" "+n.complex_display,n.complex_display==="phase"?Math.PI:i==null?void 0:i.max,n.complex_display==="phase"?"rad":"reduced field"),Is(xe("#monitor-canvas"),r.filter(c=>c.id===U.plotMonitor),U.spectrum,xe("#plot-axis").value==="wavelength")}async function Wv(){if(U.mode==="layout"){if(!await ot()){$t("Fix the highlighted project settings before running.");return}try{U.results=null,U.monitors=null,U.liveFrame=null;const n=await Tt("/jobs",U.project);U.job=n.id,localStorage.setItem("torchfdtd.activeJob",n.id),Tn("running"),ei("fields"),At("Submitted "+U.project.name+" · "+U.project.region.backend+" · "+U.project.region.precision),Yt.warnings.forEach(e=>At(e,"warning")),Cr()}catch(n){At(n.message,"error"),$t(n.message)}}}async function Cr(){try{const n=await Tt("/jobs/"+U.job),e=n.progress,t=Math.round(100*e.step/e.total);if(xe("#progress-bar").style.width=t+"%",xe("#progress-label").textContent=t+"%",xe("#status-text").textContent=n.status==="queued"?"Queued on solver":n.status==="running"?"Calculating fields…":n.status,U.liveFrame=e.frame,U.tab==="fields"&&Bn(),["completed","cancelled","failed"].includes(n.status)){if(n.status==="failed"){localStorage.removeItem("torchfdtd.activeJob"),Tn("analysis"),At(n.error,"error"),$t(n.error);return}xe("#status-text").textContent="Calculation complete · loading field results…";const i=await Tt("/jobs/"+U.job+"/fields");let s=1e-20;i.frames.forEach(r=>r.forEach(a=>a.forEach(o=>s=Math.max(s,Math.abs(o))))),i.max=s,U.results=i,U.frame=Math.max(0,i.frames.length-1),U.monitors=n.monitors,localStorage.removeItem("torchfdtd.activeJob"),Tn("analysis"),xe("#status-text").textContent=n.status,xe("#results-tree").innerHTML=`<button data-tab="fields">${Ve("chart-no-axes-combined")} ${gt(U.project.region.field)} field snapshots</button>${n.monitors.map(r=>`<button data-tab="fields">${Ve("activity")} ${gt(r.name)} · ${r.component}</button>`).join("")}<div class="run-summary"><b>${n.summary.seconds.toFixed(2)} s</b> solver loop<br>${n.summary.backend.toUpperCase()}${n.summary.cuda_graph?" · CUDA graph":""}${n.summary.cuda_kernel==="fused"?" · fused Yee / CPML":""}${n.summary.cuda_monitor_kernel==="fused"?" · shared plane DFT":""}<br>${n.summary.mcells_per_second.toFixed(1)} Mcells/s<br>${n.summary.gpu?gt(n.summary.gpu):"NumPy CPU"}<br>${n.summary.auto_shutoff?"Decay threshold reached":n.summary.cancelled?"Cancelled":"Step limit reached"}<br>${n.summary.steps} / ${n.summary.requested_steps??n.summary.steps} steps</div>`,Us(),Bn(),At(`${n.status}: ${n.summary.steps} steps in ${n.summary.seconds.toFixed(3)} s, ${n.summary.mcells_per_second.toFixed(1)} Mcells/s. Setup ${n.summary.setup_seconds.toFixed(2)} s.`),n.summary.warnings.forEach(r=>At(r,"warning"));return}dc=setTimeout(Cr,400)}catch(n){At("Connection lost: "+n.message+". Retrying the same job…","warning"),dc=setTimeout(Cr,2e3)}}function pc(n){xe("#dialog-content").innerHTML=n+'<div class="dialog-actions"><button data-close>Close</button></div>',xe("#dialog").showModal(),Us()}function mc(){Xv.open()}const fh=Av({esc:gt,toast:$t,log:At}),$v=Rv({esc:gt,toast:$t,log:At,getProject:()=>U.project,loadProject:async n=>{if(U.mode==="running")throw Error("Wait for the active simulation to finish before opening a scene.");const e=await Tt("/validate",n);xt(),U.project=e.project,U.selected="fdtd",U.results=null,U.monitors=null,U.liveFrame=null,U.job=null,xe("#results-tree").innerHTML='<div class="muted empty-hint">Run to calculate the imported scene.</div>',mt(),Tn("layout"),ei("geometry"),nn(),lt.fit(),await ot(),At("Opened independently converted FSP scene. Conversion differences are retained with the project.")}}),Xv=Uv({state:U,api:Tt,esc:gt,toast:$t,commit:n=>{if(U.mode!=="layout")throw Error("Switch to Layout before editing.");xt(),U.project=n,mt(),Ht(),nn(),lt.render(),ot()}}),hs=_v({state:U,api:Tt,esc:gt,commit:n=>{if(U.mode!=="layout")throw Error("Switch to Layout before editing.");xt(),U.project=n,mt(),Ht(),lt.render(),ot()}}),Ea=Dv({state:U,api:Tt,esc:gt,toast:$t,commit:n=>{if(U.mode!=="layout")throw Error("Switch to Layout before editing.");xt(),U.project=n,mt(),Ht(),nn(),lt.render(),ot()}}),jv=Ev({state:U,api:Tt,esc:gt,commit:n=>{if(U.mode!=="layout")throw Error("Switch to Layout before editing.");xt(),U.project=n,mt(),Ht(),nn(),lt.render(),ot()}}),qv=Nv({api:Tt,esc:gt}),Yv=Fv({esc:gt}),gc=Bv({state:U,api:Tt,esc:gt,toast:$t,numeric:Je,dropdown:Pt,commit:n=>{if(U.mode!=="layout")throw Error("Switch to Layout before editing.");xt(),U.project=n,mt(),Ht(),nn(),lt.render(),ot()}}),ys={"geometry-vertices":()=>jv.open(U.selected),capabilities:()=>qv.open(),"inverse-design":()=>Yv.open(),"global-monitor":()=>gc.globals(),"flux-results":()=>gc.flux(),"mesh-preview":()=>hs.open(),"mesh-freeze":()=>hs.freeze(),"mesh-nodes":()=>hs.editNodes(),"mesh-add":()=>hs.add(),"mesh-remove":n=>hs.remove(Number(n.dataset.index)),"global-source":()=>Ea.globals(),"source-signal":()=>Ea.signal(U.selected),"source-preview":()=>Ea.preview(U.selected),fsp:()=>fh.open(),"fsp-native":()=>{U.mode==="layout"&&$v.open()},new:()=>{U.mode!=="running"&&pc('<h2>Project files</h2><p>Save your current project before opening another design.</p><div class="dialog-buttons"><button data-action="save">Save current project</button><button data-action="open">Open project (.json)</button><button data-action="blank">New empty project</button></div>')},blank:async()=>{if(U.mode==="running")return;xt();const n=await Tt("/examples/waveguide");n.name="Untitled",n.structures=[],n.sources=[],n.monitors=[],U.project=n,U.selected="fdtd",U.results=null,U.monitors=null,U.liveFrame=null,mt(),Tn("layout"),ei("geometry"),nn(),ot(),xe("#dialog").close()},save:()=>{fc(JSON.stringify(U.project,null,2),U.project.name.replace(/[^a-z0-9]/gi,"_")+".json"),U.dirty=!1,At("Project saved as JSON. Load the same file from Python with Project.load().")},open:()=>{U.mode!=="running"&&xe("#file-input").click()},region:()=>bn("fdtd"),fit:()=>lt.fit(),materials:mc,undo:()=>{U.mode!=="layout"||!U.history.length||(U.future.push(JSON.stringify(U.project)),U.project=JSON.parse(U.history.pop()),mt(),bn("fdtd"),ot())},redo:()=>{U.mode!=="layout"||!U.future.length||(U.history.push(JSON.stringify(U.project)),U.project=JSON.parse(U.future.pop()),mt(),bn("fdtd"),ot())},delete:()=>{if(U.mode!=="layout"||!xs())return;xt();const n=bo(U.selected);U.project[n]=U.project[n].filter(e=>e.id!==U.selected),mt(),bn("fdtd"),ot()},duplicate:()=>{if(U.mode!=="layout"||!xs())return;xt();const n=structuredClone(xs());n.id=crypto.randomUUID(),n.name+="_copy",n.center[0]+=.2,U.project[bo(U.selected)].push(n),mt(),bn(n.id),ot()},"structure-earlier":()=>_c(-1),"structure-later":()=>_c(1),layout:()=>{U.mode!=="running"&&(U.results=null,U.liveFrame=null,U.monitors=null,U.job=null,xe("#results-tree").innerHTML='<div class="muted empty-hint">Run again to calculate this layout.</div>',Tn("layout"),ei("geometry"),At("Layout mode. Prior result downloads remain on the solver; the current visualizer was cleared."))},run:Wv,stop:async()=>{U.job&&(await Tt("/jobs/"+U.job+"/cancel",{}),At("Stop requested. Waiting for the current time step to finish."))},validate:ot,python:()=>dh("python"),"export-python":async()=>{fc(await Tt("/python",U.project),"simulation.py","text/x-python")},download:()=>{U.results?window.location.href="/api/jobs/"+U.job+"/download":$t("Run the simulation first.")},csv:()=>{U.results?window.location.href="/api/jobs/"+U.job+(U.spectrum?"/spectra.csv":"/monitors.csv"):$t("Run the simulation first.")},playback:()=>{var n;if(Oi){clearInterval(Oi),Oi=null;return}(n=U.results)!=null&&n.frames.length&&(Oi=setInterval(()=>{if(!U.results){clearInterval(Oi),Oi=null;return}U.frame=(U.frame+1)%U.results.frames.length,Bn()},80))},"add-material":()=>{xt(),U.project.materials.push({name:"Custom dielectric "+U.project.materials.length,index:1.5,color:"#60bdaa"}),mt(),xe("#dialog").close(),mc()},help:()=>pc("<h2>From Lumerical to TorchFDTD</h2><p>The workbench follows the familiar Objects Tree, CAD views, FDTD region and Layout / Analysis workflow.</p><ol><li>Add a Rectangle, Circle, Ring or Sphere from the Design ribbon.</li><li>Select an object in the tree or any viewport. Drag to move. Edit x, y, z, spans, material and mesh order in Object properties.</li><li>Select FDTD to set dimension, mesh, PML and simulation time steps.</li><li>Add a dipole or bidirectional sheet source and point time monitors.</li><li>Run on the connected solver. Inspect field snapshots, time traces and field spectra.</li><li>Switch to Layout to edit, or export JSON, Python and NPZ results.</li></ol><p><b>Shortcuts:</b> Ctrl+S save · Ctrl+O open · Ctrl+D duplicate · Delete remove · Ctrl+Z undo · Ctrl+Y redo · F fit.</p><p>This is an independent open-source workbench. The FSP inspector reads and edits .fsp settings through an installed, licensed Lumerical API. FSP → GPU independently imports a verified subset of layout settings and displays unsupported settings and numerical differences. Arbitrary FSP execution and .lsf execution remain unimplemented. Sampled-data material fitting, anisotropy, mode ports, normalized flux, conformal interfaces and full commercial-solver equivalence are not implemented.</p>")};function _c(n){if(U.mode!=="layout")return;const e=U.project.structures,t=e.findIndex(s=>s.id===U.selected),i=t+n;t<0||i<0||i>=e.length||(xt(),[e[t],e[i]]=[e[i],e[t]],mt(),bn(U.selected),ot())}document.addEventListener("click",async n=>{var t;const e=n.target.closest("button");if(!(!e||e.disabled||!U.project||!lt))try{if(e.dataset.action&&await((t=ys[e.dataset.action])==null?void 0:t.call(ys,e)),e.dataset.add&&Gv(e.dataset.add),e.dataset.select&&bn(e.dataset.select),e.dataset.tab&&ei(e.dataset.tab),e.dataset.bottom&&dh(e.dataset.bottom),e.dataset.plot&&(U.spectrum=e.dataset.plot==="spectrum",Qn("[data-plot]").forEach(i=>i.classList.toggle("active",i===e)),Bn()),e.dataset.example){if(U.mode==="running")return;xt(),U.project=await Tt("/examples/"+e.dataset.example),U.results=null,U.monitors=null,U.liveFrame=null,U.selected="fdtd",mt(),Tn("layout"),ei("geometry"),nn(),lt.fit(),ot(),At("Opened example: "+U.project.name)}e.dataset.ribbon&&(Qn("[data-ribbon]").forEach(i=>i.classList.toggle("active",i===e)),e.dataset.ribbon==="simulation"&&bn("fdtd"),e.dataset.ribbon==="view"&&lt.fit()),e.hasAttribute("data-close")&&xe("#dialog").close()}catch(i){$t(i.message),At(i.message,"error")}});xe("#file-input").onchange=async n=>{const e=n.target.files[0];if(e){if(e.name.toLowerCase().endsWith(".fsp")){n.target.value="",xe("#dialog").close(),await fh.openFile(e);return}try{const t=JSON.parse(await e.text()),i=await Tt("/validate",t);xt(),U.project=i.project,U.selected="fdtd",U.results=null,U.monitors=null,U.liveFrame=null,mt(),Tn("layout"),ei("geometry"),nn(),lt.fit(),ot(),xe("#dialog").close(),At("Opened "+e.name)}catch(t){$t(t.message)}n.target.value=""}};xe("#snap").onchange=n=>U.snap=n.target.checked;xe("#frame-slider").oninput=n=>{U.frame=Number(n.target.value),Bn()};document.addEventListener("keydown",n=>{if(!U.project||!lt||document.querySelector("dialog[open]")||["INPUT","TEXTAREA","SELECT"].includes(document.activeElement.tagName))return;const e=n.key.toLowerCase();n.ctrlKey&&["s","o","d","z","y"].includes(e)?(n.preventDefault(),ys[{s:"save",o:"open",d:"duplicate",z:"undo",y:"redo"}[e]]()):n.key==="Delete"?ys.delete():e==="f"&&lt.fit()});xe("#plot-monitor").onchange=n=>{U.plotMonitor=n.target.value,Bn()};xe("#plot-axis").onchange=()=>Bn();window.addEventListener("resize",()=>{U.tab==="fields"&&Bn()});async function Zv(){try{xn=await Tt("/health"),xe(".version").textContent="DEVELOPMENT"+(xn.version?" · "+xn.version:""),xe("#connection").innerHTML=`<span class="dot"></span>${xn.cuda?gt(xn.gpu):"CPU solver"} <small>${gt(xn.hostname)}</small>`,xe("#footer-device").textContent=xn.cuda?"CUDA · "+xn.gpu_memory_gb+" GB":"CPU · NumPy";const n=localStorage.getItem("torchfdtd.project.v1");try{U.project=n?(await Tt("/validate",JSON.parse(n))).project:await Tt("/examples/waveguide")}catch{U.project=await Tt("/examples/waveguide")}lt=new wv(xe("#viewports"),U,bn,Hv,xt),nn(),Tn("layout"),lt.fit(),await ot(),At("Connected to "+xn.hostname+" · "+xn.engine+"."),At("Select an object to edit. Add structures, configure FDTD and Run. Python and JSON use the same project model.");const e=localStorage.getItem("torchfdtd.activeJob");if(e)try{const t=await Tt("/jobs/"+e);U.project=t.project,U.job=e,Tn("running"),nn(),ei("fields"),Cr()}catch{localStorage.removeItem("torchfdtd.activeJob")}}catch(n){xe("#connection").textContent="Solver unavailable",At(n.message,"error"),$t("Cannot connect to the solver. Start torchfdtd serve and reload.")}Us()}Qn(".editable").forEach(n=>n.disabled=!0);xe("#run-button").disabled=!0;Zv();
