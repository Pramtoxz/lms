import{r as s,g as p,c as f}from"./app-lU2qxvZh.js";/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w=r=>r.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),c=(...r)=>r.filter((e,t,o)=>!!e&&e.trim()!==""&&o.indexOf(e)===t).join(" ").trim();/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var g={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C=s.forwardRef(({color:r="currentColor",size:e=24,strokeWidth:t=2,absoluteStrokeWidth:o,className:n="",children:a,iconNode:i,...l},d)=>s.createElement("svg",{ref:d,...g,width:e,height:e,stroke:r,strokeWidth:o?Number(t)*24/Number(e):t,className:c("lucide",n),...l},[...i.map(([m,u])=>s.createElement(m,u)),...Array.isArray(a)?a:[a]]));/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h=(r,e)=>{const t=s.forwardRef(({className:o,...n},a)=>s.createElement(C,{ref:a,iconNode:e,className:c(`lucide-${w(r)}`,o),...n}));return t.displayName=`${r}`,t};/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x=[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]],E=h("LoaderCircle",x);var L=f();const b=p(L);export{E as L,b as R,h as c,L as r};
