function t(t,e,s,i){var n,o=arguments.length,r=o<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,s):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,s,i);else for(var a=t.length-1;a>=0;a--)(n=t[a])&&(r=(o<3?n(r):o>3?n(e,s,r):n(e,s))||r);return o>3&&r&&Object.defineProperty(e,s,r),r}"function"==typeof SuppressedError&&SuppressedError;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e=globalThis,s=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),n=new WeakMap;let o=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(s&&void 0===t){const s=void 0!==e&&1===e.length;s&&(t=n.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&n.set(e,t))}return t}toString(){return this.cssText}};const r=(t,...e)=>{const s=1===t.length?t[0]:e.reduce((e,s,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[i+1],t[0]);return new o(s,t,i)},a=s?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return(t=>new o("string"==typeof t?t:t+"",void 0,i))(e)})(t):t,{is:l,defineProperty:c,getOwnPropertyDescriptor:h,getOwnPropertyNames:d,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,f=globalThis,g=f.trustedTypes,$=g?g.emptyScript:"",_=f.reactiveElementPolyfillSupport,m=(t,e)=>t,y={toAttribute(t,e){switch(e){case Boolean:t=t?$:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},v=(t,e)=>!l(t,e),x={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:v};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),f.litPropertyMetadata??=new WeakMap;let b=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=x){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);void 0!==i&&c(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:n}=h(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:i,set(e){const o=i?.call(this);n?.call(this,e),this.requestUpdate(t,o,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??x}static _$Ei(){if(this.hasOwnProperty(m("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(m("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(m("properties"))){const t=this.properties,e=[...d(t),...p(t)];for(const s of e)this.createProperty(s,t[s])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const s=this._$Eu(t,e);void 0!==s&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,i)=>{if(s)t.adoptedStyleSheets=i.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const s of i){const i=document.createElement("style"),n=e.litNonce;void 0!==n&&i.setAttribute("nonce",n),i.textContent=s.cssText,t.appendChild(i)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(void 0!==i&&!0===s.reflect){const n=(void 0!==s.converter?.toAttribute?s.converter:y).toAttribute(e,s.type);this._$Em=t,null==n?this.removeAttribute(i):this.setAttribute(i,n),this._$Em=null}}_$AK(t,e){const s=this.constructor,i=s._$Eh.get(t);if(void 0!==i&&this._$Em!==i){const t=s.getPropertyOptions(i),n="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:y;this._$Em=i;const o=n.fromAttribute(e,t.type);this[i]=o??this._$Ej?.get(i)??o,this._$Em=null}}requestUpdate(t,e,s,i=!1,n){if(void 0!==t){const o=this.constructor;if(!1===i&&(n=this[t]),s??=o.getPropertyOptions(t),!((s.hasChanged??v)(n,e)||s.useDefault&&s.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,s))))return;this.C(t,e,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:n},o){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),!0!==n||void 0!==o)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),!0===i&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,s]of t){const{wrapped:t}=s,i=this[e];!0!==t||this._$AL.has(e)||void 0===i||this.C(e,void 0,s,i)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};b.elementStyles=[],b.shadowRootOptions={mode:"open"},b[m("elementProperties")]=new Map,b[m("finalized")]=new Map,_?.({ReactiveElement:b}),(f.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const w=globalThis,A=t=>t,S=w.trustedTypes,C=S?S.createPolicy("lit-html",{createHTML:t=>t}):void 0,E="$lit$",k=`lit$${Math.random().toFixed(9).slice(2)}$`,M="?"+k,T=`<${M}>`,H=document,P=()=>H.createComment(""),O=t=>null===t||"object"!=typeof t&&"function"!=typeof t,I=Array.isArray,D="[ \t\n\f\r]",U=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,L=/-->/g,N=/>/g,R=RegExp(`>|${D}(?:([^\\s"'>=/]+)(${D}*=${D}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),j=/'/g,z=/"/g,B=/^(?:script|style|textarea|title)$/i,W=t=>(e,...s)=>({_$litType$:t,strings:e,values:s}),Y=W(1),F=W(2),q=Symbol.for("lit-noChange"),G=Symbol.for("lit-nothing"),K=new WeakMap,V=H.createTreeWalker(H,129);function J(t,e){if(!I(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==C?C.createHTML(e):e}const Z=(t,e)=>{const s=t.length-1,i=[];let n,o=2===e?"<svg>":3===e?"<math>":"",r=U;for(let e=0;e<s;e++){const s=t[e];let a,l,c=-1,h=0;for(;h<s.length&&(r.lastIndex=h,l=r.exec(s),null!==l);)h=r.lastIndex,r===U?"!--"===l[1]?r=L:void 0!==l[1]?r=N:void 0!==l[2]?(B.test(l[2])&&(n=RegExp("</"+l[2],"g")),r=R):void 0!==l[3]&&(r=R):r===R?">"===l[0]?(r=n??U,c=-1):void 0===l[1]?c=-2:(c=r.lastIndex-l[2].length,a=l[1],r=void 0===l[3]?R:'"'===l[3]?z:j):r===z||r===j?r=R:r===L||r===N?r=U:(r=R,n=void 0);const d=r===R&&t[e+1].startsWith("/>")?" ":"";o+=r===U?s+T:c>=0?(i.push(a),s.slice(0,c)+E+s.slice(c)+k+d):s+k+(-2===c?e:d)}return[J(t,o+(t[s]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),i]};class Q{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,o=0;const r=t.length-1,a=this.parts,[l,c]=Z(t,e);if(this.el=Q.createElement(l,s),V.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(i=V.nextNode())&&a.length<r;){if(1===i.nodeType){if(i.hasAttributes())for(const t of i.getAttributeNames())if(t.endsWith(E)){const e=c[o++],s=i.getAttribute(t).split(k),r=/([.?@])?(.*)/.exec(e);a.push({type:1,index:n,name:r[2],strings:s,ctor:"."===r[1]?it:"?"===r[1]?nt:"@"===r[1]?ot:st}),i.removeAttribute(t)}else t.startsWith(k)&&(a.push({type:6,index:n}),i.removeAttribute(t));if(B.test(i.tagName)){const t=i.textContent.split(k),e=t.length-1;if(e>0){i.textContent=S?S.emptyScript:"";for(let s=0;s<e;s++)i.append(t[s],P()),V.nextNode(),a.push({type:2,index:++n});i.append(t[e],P())}}}else if(8===i.nodeType)if(i.data===M)a.push({type:2,index:n});else{let t=-1;for(;-1!==(t=i.data.indexOf(k,t+1));)a.push({type:7,index:n}),t+=k.length-1}n++}}static createElement(t,e){const s=H.createElement("template");return s.innerHTML=t,s}}function X(t,e,s=t,i){if(e===q)return e;let n=void 0!==i?s._$Co?.[i]:s._$Cl;const o=O(e)?void 0:e._$litDirective$;return n?.constructor!==o&&(n?._$AO?.(!1),void 0===o?n=void 0:(n=new o(t),n._$AT(t,s,i)),void 0!==i?(s._$Co??=[])[i]=n:s._$Cl=n),void 0!==n&&(e=X(t,n._$AS(t,e.values),n,i)),e}class tt{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??H).importNode(e,!0);V.currentNode=i;let n=V.nextNode(),o=0,r=0,a=s[0];for(;void 0!==a;){if(o===a.index){let e;2===a.type?e=new et(n,n.nextSibling,this,t):1===a.type?e=new a.ctor(n,a.name,a.strings,this,t):6===a.type&&(e=new rt(n,this,t)),this._$AV.push(e),a=s[++r]}o!==a?.index&&(n=V.nextNode(),o++)}return V.currentNode=H,i}p(t){let e=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class et{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=G,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=X(this,t,e),O(t)?t===G||null==t||""===t?(this._$AH!==G&&this._$AR(),this._$AH=G):t!==this._$AH&&t!==q&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>I(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==G&&O(this._$AH)?this._$AA.nextSibling.data=t:this.T(H.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,i="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=Q.createElement(J(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{const t=new tt(i,this),s=t.u(this.options);t.p(e),this.T(s),this._$AH=t}}_$AC(t){let e=K.get(t.strings);return void 0===e&&K.set(t.strings,e=new Q(t)),e}k(t){I(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const n of t)i===e.length?e.push(s=new et(this.O(P()),this.O(P()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=A(t).nextSibling;A(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class st{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,n){this.type=1,this._$AH=G,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=G}_$AI(t,e=this,s,i){const n=this.strings;let o=!1;if(void 0===n)t=X(this,t,e,0),o=!O(t)||t!==this._$AH&&t!==q,o&&(this._$AH=t);else{const i=t;let r,a;for(t=n[0],r=0;r<n.length-1;r++)a=X(this,i[s+r],e,r),a===q&&(a=this._$AH[r]),o||=!O(a)||a!==this._$AH[r],a===G?t=G:t!==G&&(t+=(a??"")+n[r+1]),this._$AH[r]=a}o&&!i&&this.j(t)}j(t){t===G?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class it extends st{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===G?void 0:t}}class nt extends st{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==G)}}class ot extends st{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){if((t=X(this,t,e,0)??G)===q)return;const s=this._$AH,i=t===G&&s!==G||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==G&&(s===G||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class rt{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){X(this,t)}}const at=w.litHtmlPolyfillSupport;at?.(Q,et),(w.litHtmlVersions??=[]).push("3.3.2");const lt=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class ct extends b{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,s)=>{const i=s?.renderBefore??e;let n=i._$litPart$;if(void 0===n){const t=s?.renderBefore??null;i._$litPart$=n=new et(e.insertBefore(P(),t),t,void 0,s??{})}return n._$AI(t),n})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return q}}ct._$litElement$=!0,ct.finalized=!0,lt.litElementHydrateSupport?.({LitElement:ct});const ht=lt.litElementPolyfillSupport;ht?.({LitElement:ct}),(lt.litElementVersions??=[]).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const dt=t=>(e,s)=>{void 0!==s?s.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},pt={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:v},ut=(t=pt,e,s)=>{const{kind:i,metadata:n}=s;let o=globalThis.litPropertyMetadata.get(n);if(void 0===o&&globalThis.litPropertyMetadata.set(n,o=new Map),"setter"===i&&((t=Object.create(t)).wrapped=!0),o.set(s.name,t),"accessor"===i){const{name:i}=s;return{set(s){const n=e.get.call(this);e.set.call(this,s),this.requestUpdate(i,n,t,!0,s)},init(e){return void 0!==e&&this.C(i,void 0,t,e),e}}}if("setter"===i){const{name:i}=s;return function(s){const n=this[i];e.call(this,s),this.requestUpdate(i,n,t,!0,s)}}throw Error("Unsupported decorator location: "+i)};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function ft(t){return function(t){return(e,s)=>"object"==typeof s?ut(t,e,s):((t,e,s)=>{const i=e.hasOwnProperty(s);return e.constructor.createProperty(s,t),i?Object.getOwnPropertyDescriptor(e,s):void 0})(t,e,s)}({...t,state:!0,attribute:!1})}function gt(t){if(t)return"string"==typeof t?[{entity:t}]:t}const $t={startHour:0,endHour:24,viewBoxWidth:1e3,axisY:28,laneHeight:26,laneGap:4,axisLaneGap:14,paddingLeft:20,paddingRight:10,calendarLineSpacing:3,curveRadius:12};function _t(t,e){const s=(t-e.startHour)/(e.endHour-e.startHour),i=Math.max(0,Math.min(1,s)),n=e.viewBoxWidth-e.paddingLeft-e.paddingRight;return e.paddingLeft+i*n}function mt(t,e){const s=new Date,i=new Date(s.getFullYear(),s.getMonth(),s.getDate()).getTime(),n=((t.getTime()-i)/36e5-e.startHour)/(e.endHour-e.startHour),o=Math.max(0,Math.min(1,n)),r=e.viewBoxWidth-e.paddingLeft-e.paddingRight;return e.paddingLeft+o*r}function yt(t,e){return e.axisY+e.axisLaneGap+t*(e.laneHeight+e.laneGap)}function vt(t,e,s,i){const n=Math.max(s,1);return(yt(0,i)+(yt(n-1,i)+i.laneHeight))/2-(e-1)*i.calendarLineSpacing/2+t*i.calendarLineSpacing}function xt(t){const e=t.replace("#","");return[parseInt(e.slice(0,2),16),parseInt(e.slice(2,4),16),parseInt(e.slice(4,6),16)]}function bt(t){return(t/=255)<=.04045?t/12.92:((t+.055)/1.055)**2.4}function wt(t){return t=function(t){return Math.max(0,Math.min(1,t))}(t),255*(t<=.0031308?12.92*t:1.055*t**(1/2.4)-.055)}function At([t,e,s]){const i=bt(t),n=bt(e),o=bt(s),r=Math.cbrt(.4122214708*i+.5363325363*n+.0514459929*o),a=Math.cbrt(.2119034982*i+.6806995451*n+.1073969566*o),l=Math.cbrt(.0883024619*i+.2817188376*n+.6299787005*o);return[.2104542553*r+.793617785*a-.0040720468*l,1.9779984951*r-2.428592205*a+.4505937099*l,.0259040371*r+.7827717662*a-.808675766*l]}function St(t){const e=t.map(At),s=e.length;let i=0,n=0,o=0,r=0;for(const[t,s,a]of e){i+=t;const e=Math.sqrt(s*s+a*a),l=Math.atan2(a,s);r+=e,n+=Math.sin(l),o+=Math.cos(l)}i/=s,r/=s;const a=Math.atan2(n/s,o/s);return function([t,e,s]){const i=t+.3963377774*e+.2158037573*s,n=t-.1055613458*e-.0638541728*s,o=t-.0894841775*e-1.291485548*s,r=i*i*i,a=n*n*n,l=o*o*o;return[wt(4.0767416621*r-3.3077115913*a+.2309699292*l),wt(-1.2684380046*r+2.6097574011*a-.3413193965*l),wt(-.0041960863*r-.7034186147*a+1.707614701*l)]}([i,r*Math.cos(a),r*Math.sin(a)])}function Ct(t){return e=>1===e.length?e[0]:function([t,e,s]){const i=t=>Math.round(Math.max(0,Math.min(255,t))).toString(16).padStart(2,"0");return`#${i(t)}${i(e)}${i(s)}`}(t(e.map(xt)))}const Et={colorblind:{name:"colorblind",label:"Colorblind-safe (Tol)",baseColors:["#0077BB","#EE7733","#CC3399","#009988"],mix:Ct(St)},additive:{name:"additive",label:"Additive (light)",baseColors:["#E03030","#30B040","#3060E0","#E0A020"],mix:Ct(function(t){const e=t.length,s=[0,0,0];for(const e of t)s[0]+=e[0],s[1]+=e[1],s[2]+=e[2];s[0]/=e,s[1]/=e,s[2]/=e;const i=(s[0]+s[1]+s[2])/3;return[i+1.4*(s[0]-i),i+1.4*(s[1]-i),i+1.4*(s[2]-i)]})},subtractive:{name:"subtractive",label:"Subtractive (paint)",baseColors:["#00AACC","#CC00AA","#AACC00","#888888"],mix:Ct(function(t){let e=1,s=1,i=1;for(const n of t)e*=n[0]/255,s*=n[1]/255,i*=n[2]/255;return[255*(e+.3*(1-e)),255*(s+.3*(1-s)),255*(i+.3*(1-i))]})},oklch:{name:"oklch",label:"Perceptual (OKLCH)",baseColors:["#E05060","#4098E0","#40C070","#B060D0"],mix:Ct(St)}},kt="colorblind";function Mt(t){return Et[t||kt]||Et[kt]}function Tt(t,e){return e.baseColors[t%e.baseColors.length]}function Ht(t,e,s){const i=t.map(t=>e.indexOf(t)).filter(t=>t>=0).map(t=>Tt(t,s));return 0===i.length?"#888":s.mix(i)}function Pt(t,e,s,i=$t,n,o="dimmed",r=!1){const a=n||Mt(),l=e.map(t=>t.id),c=function(t){return 0===t.length?0:Math.max(...t.map(t=>t.lane))+1}(t),h=function(t,e){return 0===t?e.axisY+30:yt(t-1,e)+e.laneHeight+10}(c,i),d=r&&e.length>0?function(t,e,s){const i=_t(s.startHour+.25,s)-_t(s.startHour,s);let n=_t(s.startHour,s)+5;return t.map((o,r)=>{const a=6.5,l=Math.max(o.name.length*a+14,40),c=vt(r,t.length,e,s),h={calIndex:r,x:n,width:l,homeY:c,text:o.name,color:o.color};return n+=l+i,h})}(e,c,i):void 0;return F`
    <svg viewBox="0 0 ${i.viewBoxWidth} ${h}"
         preserveAspectRatio="xMidYMid meet"
         xmlns="http://www.w3.org/2000/svg"
         style="width:100%;display:block">
      ${function(t){const e=_t(t.startHour,t),s=_t(t.endHour,t),i=[];for(let e=t.startHour;e<=t.endHour;e++){const s=_t(e,t),n=e%3==0,o=n?6:3;i.push(F`
      <line x1="${s}" y1="${t.axisY-o}"
            x2="${s}" y2="${t.axisY+o}"
            stroke="var(--secondary-text-color, #888)"
            stroke-width="${n?1:.5}" />
      ${n?F`
          <text x="${s}" y="${t.axisY-10}"
                text-anchor="middle"
                fill="var(--secondary-text-color, #888)"
                font-size="9">
            ${e}
          </text>`:G}
    `)}return F`
    <line x1="${e}" y1="${t.axisY}"
          x2="${s}"   y2="${t.axisY}"
          stroke="var(--divider-color, #ccc)" stroke-width="1" />
    ${i}
  `}(i)}
      ${function(t,e,s){const i=t.getHours()+t.getMinutes()/60;if(i<s.startHour||i>s.endHour)return F``;const n=mt(t,s);return F`
    <line x1="${n}" y1="0" x2="${n}" y2="${e}"
          stroke="var(--primary-color, #03a9f4)"
          stroke-width="1.5" opacity="0.6" />
  `}(s,h,i)}
      ${e.map((s,n)=>function(t,e,s,i,n,o,r,a){const l=vt(i,n,o,r),c=s.filter(e=>e.calendarIds.includes(t)).sort((t,e)=>t.start.getTime()-e.start.getTime()),h=_t(r.startHour,r),d=_t(r.endHour,r),p=r.curveRadius;function u(t,e,s){let n=e;if(!a?.length)return n;const o=a.filter(t=>t.x+t.width>n&&t.x<s).sort((t,e)=>t.x-e.x);for(const e of o){const s=Math.max(e.x,n),o=e.x+e.width;if(s>n&&(t.push(`L ${s} ${l}`),n=s),e.calIndex===i)n=o,t.push(`M ${n} ${l}`);else{const s=i<e.calIndex?-1:1,r=l+6*s;t.push(`C ${e.x+.25*e.width} ${r} ${e.x+.75*e.width} ${r} ${o} ${l}`),n=o}}return n}if(0===c.length){if(!a?.length)return F`
        <line x1="${h}" y1="${l}" x2="${d}" y2="${l}"
              stroke="${e}" stroke-width="1.5" opacity="0.5" />
      `;const t=[`M ${h} ${l}`];return u(t,h,d)<d&&t.push(`L ${d} ${l}`),F`
      <path d="${t.join(" ")}" fill="none"
            stroke="${e}" stroke-width="1.5" opacity="0.5" />
    `}const f=[];let g=h,$=l;if(f.push(`M ${g} ${$}`),a?.length){g=u(f,g,mt(c[0].start,r))}for(let t=0;t<c.length;t++){const e=c[t],s=yt(e.lane,r)+r.laneHeight/2,i=Math.max(mt(e.start,r),g),n=Math.max(mt(e.end,r),i);if($===l){const t=Math.max(g,i-p);t>g&&(f.push(`L ${t} ${l}`),g=t);const e=Math.max(g,i),n=(g+e)/2;f.push(`C ${n} ${l} ${n} ${s} ${e} ${s}`),g=e,$=s}else if($!==s){const t=Math.max(g,Math.min(g+p,i)),e=(g+t)/2;f.push(`C ${e} ${$} ${e} ${s} ${t} ${s}`),t<i&&f.push(`L ${i} ${s}`),g=Math.max(g,i),$=s}n>g&&(f.push(`L ${n} ${s}`),g=n);if((c[t+1]?mt(c[t+1].start,r):d)-g>2*p+4){const t=g+p,e=(g+t)/2;f.push(`C ${e} ${$} ${e} ${l} ${t} ${l}`),g=t,$=l}}if($!==l){const t=Math.min(g+p,d),e=(g+t)/2;f.push(`C ${e} ${$} ${e} ${l} ${t} ${l}`),g=t,$=l}g<d&&f.push(`L ${d} ${l}`);return F`
    <path d="${f.join(" ")}" fill="none"
          stroke="${e}" stroke-width="1.5" opacity="0.8" />
  `}(s.id,s.color,t,n,e.length,c,i,d))}
      ${function(t,e,s,i,n){return F`${t.map(t=>{const o=mt(t.start,i),r=mt(t.end,i),a=yt(t.lane,i),l=Math.max(r-o,4),c=i.laneHeight,h=Ht(t.calendarIds,e,s),d="normal"!==n,p=!!t.work,u=p&&d?"0.07":"0.15",f=p&&d?"3,2":"none";if(t.envelope&&t.children?.length){return F`
        <g>
          <rect x="${o}" y="${a}" width="${l}" height="${c}"
                rx="4" ry="4"
                fill="var(--card-background-color, #fff)"
                stroke="none" />
          <rect x="${o}" y="${a}" width="${l}" height="${c}"
                rx="4" ry="4"
                fill="${h}" fill-opacity="${d?"0.08":"0.15"}"
                stroke="${h}" stroke-width="1"
                stroke-dasharray="${"none"}" />
          ${l>40?F`
              <text x="${o+4}" y="${a+8}"
                    dominant-baseline="central"
                    font-size="7"
                    fill="var(--secondary-text-color, #888)"
                    pointer-events="none"
                    opacity="0.7">
                ${t.title}
              </text>`:G}
          ${t.children.map(n=>{const o=mt(n.start,i),r=mt(n.end,i),l=Math.max(r-o,3),h=Ht(n.calendarIds.length?n.calendarIds:t.calendarIds,e,s);return F`
              <rect x="${o}" y="${a}" width="${l}" height="${c}"
                    rx="3" ry="3"
                    fill="${h}" fill-opacity="${d?"0.14":"0.30"}"
                    stroke="${h}" stroke-width="0.75"
                    stroke-dasharray="${d?"3,2":"none"}" />
            `})}
        </g>
      `}return F`
      <g>
        <rect x="${o}" y="${a}" width="${l}" height="${c}"
              rx="4" ry="4"
              fill="var(--card-background-color, #fff)"
              stroke="none" />
        <rect x="${o}" y="${a}" width="${l}" height="${c}"
              rx="4" ry="4"
              fill="${h}" fill-opacity="${u}"
              stroke="${h}" stroke-width="1"
              stroke-dasharray="${f}" />
        ${!p&&l>40?F`
            <text x="${o+4}" y="${a+c/2}"
                  dominant-baseline="central"
                  font-size="10"
                  fill="var(--primary-text-color, #333)"
                  pointer-events="none">
              ${t.title}
            </text>`:G}
      </g>
    `})}`}(t,l,a,i,o)}
      ${d?function(t){return F`${t.map(t=>F`
    <text x="${t.x+t.width/2}" y="${t.homeY}"
          text-anchor="middle"
          dominant-baseline="central"
          font-size="10"
          font-weight="500"
          fill="${t.color}"
          pointer-events="none">
      ${t.text}
    </text>
  `)}`}(d):G}
      ${function(t,e){const s=t.getHours()+t.getMinutes()/60;if(s<e.startHour||s>e.endHour)return F``;const i=mt(t,e);return F`
    <circle cx="${i}" cy="${e.axisY}" r="3"
            fill="var(--primary-color, #03a9f4)" />
  `}(s,i)}
    </svg>
  `}const Ot=["calendarA","calendarB","calendarC","calendarD"],It=["A","B","C","D"],Dt=["emailA","emailB","emailC","emailD"],Ut=["nameA","nameB","nameC","nameD"],Lt=["personA","personB","personC","personD"];function Nt(t){const e={type:t.type,colorScheme:t.colorScheme,workStyle:t.workStyle,showDeclined:t.showDeclined,showTentative:t.showTentative,inlineLabels:t.inlineLabels};for(let s=0;s<Ot.length;s++){const i=gt(t[Ot[s]]);i&&(e[Ot[s]]=i);const n=t[Dt[s]];n&&(e[Dt[s]]=n);const o=t[Ut[s]];o&&(e[Ut[s]]=o);const r=t[Lt[s]];r&&(e[Lt[s]]=r)}return e}const Rt=[{value:"dimmed",label:"Dimmed (dashed border, lower opacity)"},{value:"normal",label:"No distinction"}];let jt=class extends ct{constructor(){super(...arguments),this._expandedSlot=null}set hass(t){this._hass=t}setConfig(t){this._config=Nt(t)}_fireChange(){this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0}))}_schemeChanged(t){const e=t.target;this._config={...this._config,colorScheme:e.value},this._fireChange()}_workStyleChanged(t){const e=t.target;this._config={...this._config,workStyle:e.value},this._fireChange()}_toggleShowDeclined(){this._config={...this._config,showDeclined:!this._config.showDeclined},this._fireChange()}_toggleShowTentative(){this._config={...this._config,showTentative:!(this._config.showTentative??1)},this._fireChange()}_toggleInlineLabels(){this._config={...this._config,inlineLabels:!this._config.inlineLabels},this._fireChange()}_addEntity(t,e){if(!e)return;const s=this._config[t]||[];s.some(t=>t.entity===e)||(this._config={...this._config,[t]:[...s,{entity:e}]},this._fireChange())}_removeEntity(t,e){const s=(this._config[t]||[]).filter((t,s)=>s!==e),i={...this._config};0===s.length?delete i[t]:i[t]=s,this._config=i,this._fireChange()}_emailChanged(t,e){const s=Dt[t],i={...this._config};e?i[s]=e:delete i[s],this._config=i,this._fireChange()}_nameChanged(t,e){const s=Ut[t],i={...this._config};e?i[s]=e:delete i[s],this._config=i,this._fireChange()}_personChanged(t,e){const s=Lt[t],i={...this._config};e?i[s]=e:delete i[s],this._config=i,this._fireChange()}_getPersonEntities(){return this._hass?Object.keys(this._hass.states).filter(t=>t.startsWith("person.")).sort():[]}_toggleWork(t,e){const s=(this._config[t]||[]).map((t,s)=>s===e?{...t,work:!t.work}:t);this._config={...this._config,[t]:s},this._fireChange()}_toggleSlot(t){this._expandedSlot=this._expandedSlot===t?null:t}_getCalendarEntities(){return this._hass?Object.keys(this._hass.states).filter(t=>t.startsWith("calendar.")).sort():[]}_friendlyName(t){return this._hass?.states[t]?.attributes?.friendly_name||t}render(){const t=Mt(this._config?.colorScheme),e=this._getCalendarEntities();return Y`
      <div class="editor">
        <div class="section">
          <div class="section-header">
            <ha-icon icon="mdi:cog"></ha-icon>
            <span>General</span>
          </div>
          <div class="section-content column">
            <label class="field-label">Color Scheme</label>
            <select
              .value=${this._config?.colorScheme||"colorblind"}
              @change=${this._schemeChanged}
            >
              ${Object.values(Et).map(t=>Y`
                  <option value=${t.name} ?selected=${t.name===(this._config?.colorScheme||"colorblind")}>
                    ${t.label}
                  </option>
                `)}
            </select>
            <label class="field-label">Work Event Style</label>
            <select
              .value=${this._config?.workStyle||"dimmed"}
              @change=${this._workStyleChanged}
            >
              ${Rt.map(t=>Y`
                  <option value=${t.value} ?selected=${t.value===(this._config?.workStyle||"dimmed")}>
                    ${t.label}
                  </option>
                `)}
            </select>
            <label class="field-label">Attendance</label>
            <label class="toggle-row">
              <input
                type="checkbox"
                .checked=${this._config?.showTentative??!0}
                @change=${this._toggleShowTentative}
              />
              Show tentative events
            </label>
            <label class="toggle-row">
              <input
                type="checkbox"
                .checked=${this._config?.showDeclined??!1}
                @change=${this._toggleShowDeclined}
              />
              Show declined events
            </label>
            <label class="field-label">Labels</label>
            <label class="toggle-row">
              <input
                type="checkbox"
                .checked=${this._config?.inlineLabels??!1}
                @change=${this._toggleInlineLabels}
              />
              Inline labels on calendar lines
            </label>
          </div>
        </div>

        ${Ot.map((s,i)=>{const n=It[i],o=this._config?.[Ut[i]],r=o||`Calendar ${n}`,a=Tt(i,t),l=this._config?.[s]||[],c=this._expandedSlot===i,h=l.length>0?l.map(t=>this._friendlyName(t.entity)).join(", "):"(not set)";return Y`
            <div class="section">
              <div
                class="section-header clickable"
                @click=${()=>this._toggleSlot(i)}
              >
                <span class="color-dot" style="background:${a}"></span>
                <span class="slot-title">
                  ${r}
                  ${l.length>0?Y` — <em>${h}</em>`:Y` <span class="unset">${h}</span>`}
                </span>
                <ha-icon
                  icon=${c?"mdi:chevron-up":"mdi:chevron-down"}
                ></ha-icon>
              </div>
              ${c?Y`
                    <div class="section-content column">
                      <label class="field-label">Name</label>
                      <input
                        type="text"
                        class="email-input"
                        placeholder="e.g. Alice, Bob…"
                        .value=${this._config?.[Ut[i]]||""}
                        @change=${t=>this._nameChanged(i,t.target.value.trim())}
                      />
                      <label class="field-label">Person entity</label>
                      <select
                        .value=${this._config?.[Lt[i]]||""}
                        @change=${t=>this._personChanged(i,t.target.value)}
                      >
                        <option value="">— None —</option>
                        ${this._getPersonEntities().map(t=>Y`
                            <option value=${t}
                              ?selected=${t===(this._config?.[Lt[i]]||"")}>
                              ${this._friendlyName(t)}
                            </option>
                          `)}
                      </select>
                      ${l.length>0?Y`
                            <div class="entity-list">
                              ${l.map((t,e)=>Y`
                                  <div class="entity-row">
                                    <span class="entity-name">
                                      ${this._friendlyName(t.entity)}
                                    </span>
                                    <label class="work-toggle">
                                      <input
                                        type="checkbox"
                                        .checked=${!!t.work}
                                        @change=${()=>this._toggleWork(s,e)}
                                      />
                                      Work
                                    </label>
                                    <button
                                      class="remove-btn"
                                      @click=${()=>this._removeEntity(s,e)}
                                    >
                                      ×
                                    </button>
                                  </div>
                                `)}
                            </div>
                          `:""}
                      <select
                        @change=${t=>{const e=t.target;this._addEntity(s,e.value),e.value=""}}
                      >
                        <option value="">+ Add calendar…</option>
                        ${e.filter(t=>!l.some(e=>e.entity===t)).map(t=>Y`
                              <option value=${t}>
                                ${this._friendlyName(t)}
                              </option>
                            `)}
                      </select>
                      <label class="field-label">Owner email (for attendance filtering)</label>
                      <input
                        type="email"
                        class="email-input"
                        placeholder="user@example.com"
                        .value=${this._config?.[Dt[i]]||""}
                        @change=${t=>this._emailChanged(i,t.target.value.trim())}
                      />
                    </div>
                  `:""}
            </div>
          `})}
      </div>
    `}};function zt(t,e){return t.dateTime?new Date(t.dateTime):t.date?new Date(t.date+"T00:00:00"):e}jt.styles=r`
    .editor {
      padding: 8px 0;
    }
    .section {
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 8px;
      margin-bottom: 8px;
      overflow: hidden;
    }
    .section-header {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 12px;
      font-size: 14px;
      font-weight: 500;
      color: var(--primary-text-color);
      background: var(--card-background-color, #fff);
    }
    .section-header.clickable {
      cursor: pointer;
    }
    .section-header.clickable:hover {
      background: var(--secondary-background-color, #f5f5f5);
    }
    .slot-title {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .slot-title em {
      font-weight: 400;
      color: var(--secondary-text-color);
    }
    .unset {
      color: var(--secondary-text-color);
      font-weight: 400;
    }
    .color-dot {
      display: inline-block;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .section-content {
      padding: 8px 12px 12px;
      display: flex;
      gap: 8px;
      align-items: center;
    }
    .section-content.column {
      flex-direction: column;
      align-items: stretch;
    }
    .field-label {
      font-size: 12px;
      font-weight: 500;
      color: var(--secondary-text-color);
      margin-bottom: -4px;
    }
    .toggle-row {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      color: var(--primary-text-color);
      cursor: pointer;
    }
    .toggle-row input {
      cursor: pointer;
    }
    select {
      padding: 8px;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      font-size: 14px;
    }
    .email-input {
      padding: 8px;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      font-size: 13px;
    }
    .entity-list {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .entity-row {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 4px 8px;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
      font-size: 13px;
    }
    .entity-name {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .work-toggle {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: var(--secondary-text-color);
      white-space: nowrap;
      cursor: pointer;
    }
    .work-toggle input {
      cursor: pointer;
    }
    .remove-btn {
      width: 24px;
      height: 24px;
      border: none;
      background: none;
      color: var(--error-color, #db4437);
      font-size: 16px;
      cursor: pointer;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .remove-btn:hover {
      background: var(--error-color, #db4437);
      color: #fff;
    }
  `,t([ft()],jt.prototype,"_config",void 0),t([ft()],jt.prototype,"_hass",void 0),t([ft()],jt.prototype,"_expandedSlot",void 0),jt=t([dt("sideways-calendar-card-editor")],jt);let Bt=class extends ct{constructor(){super(...arguments),this._events=[],this._calendars=[],this._now=new Date,this._lastFetchKey=""}_entityToSlots(){const t=new Map;for(const e of Ot){const s=this._config?.[e];if(s)for(const i of s){const s=t.get(i.entity);s?s.includes(e)||s.push(e):t.set(i.entity,[e])}}return t}_slotToEmail(){const t=new Map;for(let e=0;e<Ot.length;e++){const s=this._config?.[Dt[e]];s&&t.set(Ot[e],s.toLowerCase())}return t}_workEntities(){const t=new Set;for(const e of Ot){const s=this._config?.[e];if(s)for(const e of s)e.work&&t.add(e.entity)}return t}_allEntityIds(){const t=[];for(const e of Ot){const s=this._config?.[e];if(s)for(const e of s)t.includes(e.entity)||t.push(e.entity)}return t}_activeSlots(){return Ot.filter(t=>(this._config?.[t]?.length??0)>0)}set hass(t){this._hass=t,this._tryFetchEvents(),this.requestUpdate()}get hass(){return this._hass}connectedCallback(){super.connectedCallback(),this._timer=window.setInterval(()=>{this._now=new Date},6e4)}disconnectedCallback(){super.disconnectedCallback(),this._timer&&(clearInterval(this._timer),this._timer=void 0)}setConfig(t){this._config=Nt(t),this._lastFetchKey="",this._buildCalendarInfos(),this._tryFetchEvents()}getCardSize(){return 3}getGridOptions(){return{rows:"auto",columns:"full",min_rows:2,min_columns:6}}static getStubConfig(t){const e=Object.keys(t.states).filter(t=>t.startsWith("calendar.")),s={};for(let t=0;t<Math.min(e.length,4);t++)s[Ot[t]]=[{entity:e[t]}];return s}static getConfigElement(){return document.createElement("sideways-calendar-card-editor")}_buildCalendarInfos(){const t=Mt(this._config?.colorScheme),e=this._activeSlots();this._calendars=e.map((e,s)=>{const i=Ot.indexOf(e),n=this._config?.[Ut[i]],o=this._config[e],r=this._hass?.states[o[0].entity]?.attributes?.friendly_name||o[0].entity;return{id:e,name:n||r,color:Tt(s,t)}})}_tryFetchEvents(){if(!this._hass||!this._config)return;const t=`${(new Date).toISOString().split("T")[0]}|${this._allEntityIds().join(",")}`;t!==this._lastFetchKey&&(this._lastFetchKey=t,this._buildCalendarInfos(),this._fetchEvents())}async _fetchEvents(){const t=this._hass,e=this._allEntityIds();if(0===e.length)return void(this._events=[]);const s=this._entityToSlots(),i=this._slotToEmail(),n=this._workEntities(),o=this._config?.showDeclined??!1,r=this._config?.showTentative??!0,a=new Date,l=new Date(a.getFullYear(),a.getMonth(),a.getDate()),c=new Date(a.getFullYear(),a.getMonth(),a.getDate()+1),h=l.toISOString(),d=c.toISOString(),p=new Map,u=new Map;await Promise.all(e.map(async e=>{const a=s.get(e);if(!a?.length)return;const f=n.has(e);try{const s=await t.callApi("GET",`calendars/${e}?start=${h}&end=${d}`);for(const t of s){const e=zt(t.start,l),s=zt(t.end,c),n=new Date(Math.max(e.getTime(),l.getTime())),h=new Date(Math.min(s.getTime(),c.getTime()));for(const s of a){const a=i.get(s);if(t.attendees?.length&&a){const e=t.attendees.find(t=>t.email?.toLowerCase()===a);if(e){if("declined"===e.response&&!o)continue;if("tentative"===e.response&&!r)continue}}const l={id:`${s}|${t.summary}|${e.toISOString()}`,start:n,end:h,title:t.summary,calendarIds:[s],work:f},c=f?u:p;c.has(s)||c.set(s,[]),c.get(s).push(l)}}}catch(t){console.error(`Failed to fetch events for ${e}:`,t)}}));const f=[],g=new Set;for(const t of Ot){const e=p.get(t)||[],s=u.get(t)||[];for(const t of e){if(/^work/i.test(t.title)&&s.length>0){const e=s.filter(e=>e.start.getTime()>=t.start.getTime()&&e.end.getTime()<=t.end.getTime());if(e.length>0){t.envelope=!0,t.children=e;for(const t of e)g.add(t.id)}}f.push(t)}for(const t of s)g.has(t.id)||f.push(t)}const $=t=>Math.round(t.getTime()/6e4),_=new Map;for(const t of f){const e=`${t.title.trim()}|${$(t.start)}|${$(t.end)}`,s=_.get(e);if(s){for(const e of t.calendarIds)s.calendarIds.includes(e)||s.calendarIds.push(e);if(t.work||(s.work=!1),t.envelope){s.envelope=!0;const e=s.children||[],i=new Set(e.map(t=>`${t.title}|${$(t.start)}|${$(t.end)}`));for(const s of t.children||[]){const t=`${s.title}|${$(s.start)}|${$(s.end)}`;if(i.has(t)){const i=e.find(e=>`${e.title}|${$(e.start)}|${$(e.end)}`===t);for(const t of s.calendarIds)i.calendarIds.includes(t)||i.calendarIds.push(t)}else e.push(s),i.add(t)}s.children=e}}else _.set(e,t)}this._events=function(t){const e=[...t].sort((t,e)=>t.start.getTime()-e.start.getTime()),s=[];return e.map(t=>{let e=s.findIndex(e=>e<=t.start.getTime());return-1===e&&(e=s.length,s.push(0)),s[e]=t.end.getTime(),{...t,lane:e}})}([..._.values()])}render(){const t=this._hass?.user?.name||"User",e=Mt(this._config?.colorScheme),s=this._calendars.map(t=>t.id),i=this._config?.workStyle||"dimmed",n=this._config?.inlineLabels??!1,o=this._calendars.map(t=>t.name),r=[];if(this._calendars.length>1){const t=new Set;for(const i of this._events){if(i.calendarIds.length<2)continue;const n=[...i.calendarIds].sort().join("|");if(t.has(n))continue;t.add(n);const a=i.calendarIds.map(t=>{const e=s.indexOf(t);return e>=0?o[e]:t}).join(" + ");r.push({label:a,ids:i.calendarIds,color:Ht(i.calendarIds,s,e)})}}return Y`
      <ha-card header="${t}'s Calendar">
        <div class="card-content">
          ${0===this._calendars.length?Y`<p class="empty">No calendars configured.</p>`:Pt(this._events,this._calendars,this._now,void 0,e,i,n)}
          ${r.length>0?Y`
              <div class="legend">
                ${r.map(t=>Y`
                    <span class="legend-item">
                      <span class="legend-swatch" style="background:${t.color}"></span>
                      ${t.label}
                    </span>
                  `)}
              </div>`:""}
        </div>
      </ha-card>
    `}};Bt.styles=r`
    :host {
      display: block;
      height: 100%;
    }
    ha-card {
      height: 100%;
      box-sizing: border-box;
      overflow: hidden;
    }
    .card-content {
      padding: 0 16px 16px;
    }
    .empty {
      color: var(--secondary-text-color);
      font-style: italic;
    }
    .legend {
      display: flex;
      flex-wrap: wrap;
      gap: 8px 12px;
      padding-top: 8px;
      font-size: 11px;
      color: var(--secondary-text-color);
    }
    .legend-item {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .legend-swatch {
      display: inline-block;
      width: 12px;
      height: 12px;
      border-radius: 2px;
    }
  `,t([ft()],Bt.prototype,"_config",void 0),t([ft()],Bt.prototype,"_events",void 0),t([ft()],Bt.prototype,"_calendars",void 0),t([ft()],Bt.prototype,"_now",void 0),Bt=t([dt("sideways-calendar-card")],Bt),window.customCards=window.customCards||[],window.customCards.push({type:"sideways-calendar-card",name:"Sideways Calendar Card",description:"A horizontal 24-hour timeline of your day with git-branch-style calendar lines."});export{Bt as SidewaysCalendarCard};
