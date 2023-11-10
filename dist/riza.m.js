import{Rinn as t,Class as e,Event as s,EventDispatcher as n,Model as o,ModelList as a,Schema as r,Flattenable as l,Collection as h,Template as c}from"rinn";import u from"base-64";import{signal as d,expr as f,watch as p,validator as m}from"riza-signal";var g=globalThis;/*
**	The Router is a special module that detects local URL changes (when a hash-change occurs) and
**	forwards events to the appropriate handlers.
*/let b={Route:n.extend({/*
		**	Regular expression for the route. This is generated from a simpler expression provided
		**	in the constructor.
		*/routeRegex:null,/*
		**	Original route string value.
		*/value:null,/*
		**	Map with the indices and the names of each paremeter obtained from the route expression.
		*/params:null,/*
		**	Arguments obtained from the current route (uses `params` to determine name of arguments).
		*/args:null,/*
		**	Arguments string obtained from the last route dispatch. Used to check if the arguments changed.
		*/s_args:null,/*
		**	Indicates if the route is active because of a past positive dispatch.
		*/active:!1,/*
		**	Indicates if the params have changed since last event. Transition from inactive to active route will always set this value to true.
		*/changed:!1,/*
		**	Constructor of the route, the specified argument is a route expression.
		**
		**	>> void __ctor (string route);
		*/__ctor:function(t){this._super.EventDispatcher.__ctor(),this._compileRoute(this.value=t)},/*
		**	Transforms the specified route expression into a regular expression and a set of parameter
		**	names and stores them in the 'param' array.
		**
		**	>> void _compileRoute (string route);
		*/_compileRoute:function(t){for(this.params=[],t=t.replace(/\/\*\//g,"/.+/");;){var e=/:([!@A-Za-z0-9_-]+)/.exec(t);if(!e)break;t=t.replace(e[0],"([^/]+)"),this.params.push(e[1])}this.routeRegex="^"+t.replace(/##/g,"")},/*
		**	Adds a handler to the route dispatcher. The handler can be removed later using removeHandler and
		**	specifying the same parameters. If unrouted boolean is specified the event to listen to will be
		**	the unrouted event (when the route changes and the route is not activated).
		**
		**	void addHandler (handler: function, unrouted: bool, context:object=null);
		*/addHandler:function(t,e=!1,s=null){this.addEventListener((!0===e?"un":"")+"routed",t,s)},/*
		**	Removes a handler from the route dispatcher.
		**
		**	void removeHandler (handler: function, unrouted: bool, context: object=null);
		*/removeHandler:function(t,e=!1,s=null){this.removeEventListener((!0===e?"un":"")+"routed",t,s)},/*
		**	Verifies if the specified route matches the internal route and if so dispatches a (depends on doUnroute parameter) "routed" or "unrouted" event with the
		**	parameters obtained from the location to all attached handlers.
		**
		**	void dispatch (route:string, doUnroute:bool);
		*/dispatch:function(t){var e=t.match(this.routeRegex);if(!e){this.s_args=null,this.active&&this.dispatchEvent("unrouted",{route:this}),this.active=!1;return}for(var s={route:this},n="",o=0;o<this.params.length;o++)s[this.params[o]]=e[o+1],n+="_"+e[o+1];this.changed=n!=this.s_args,this.s_args=n,this.dispatchEvent("routed",this.args=s),this.active=!0}}),/*
	**	Map with route objects. The key of the map is the route and the value a handler.
	*/routes:{},/*
	**	Sorted list of routes. Smaller routes are processed first than larger ones. This array stores
	**	only the keys to the Router.routes map.
	*/sortedRoutes:[],/*
	**	Indicates the number of times the onLocationChanged handler should ignore the hash change event.
	*/ignoreHashChangeEvent:0,/*
	**	Current relative location (everything after the location hash symbol).
	*/location:"",/*
	**	Current relative location as an array of elements (obtained by splitting the location by slash).
	*/args:[],/*
	**	Initializes the router module. Ensure to call `refresh` once to force a hashchange when the page loads.
	*/init:function(){!this.alreadyAttached&&(this.alreadyAttached=!0,"onhashchange"in globalThis&&(globalThis.onhashchange=this.onLocationChanged.bind(this)))},/*
	**	Refreshes the current route by forcing a hashchange event.
	*/refresh:function(){this.onLocationChanged()},/*
	**	Changes the current location and optionally prevents a trigger of the hashchange event.
	*/setRoute:function(t,e){var s=this.realLocation(t);s!=this.location&&(e&&this.ignoreHashChangeEvent++,globalThis.location.hash=s)},/*
	**	Adds the specified route to the routing map. When the specified route is detected, the `onRoute` handler will be called, and then
	**	when the route exits `onUnroute` will be called.
	*/addRoute:function(t,e,s=null){return this.routes[t]||(this.routes[t]=new this.Route(t),this.sortedRoutes.push(t),this.sortedRoutes.sort((t,e)=>this.routes[t].routeRegex.length-this.routes[e].routeRegex.length)),null!==s?(this.routes[t].addHandler(e,!1),this.routes[t].addHandler(s,!0)):this.routes[t].addHandler(e,!1),this.routes[t]},/*
	**	Returns the Route object for the specified route.
	*/getRoute:function(t){return this.routes[t]||(this.routes[t]=new this.Route(t),this.sortedRoutes.push(t),this.sortedRoutes.sort((t,e)=>this.routes[t].routeRegex.length-this.routes[e].routeRegex.length)),this.routes[t]},/*
	**	Adds the specified routes to the routing map. The routes map should contain the route expression
	**	in the key of the map and a handler function in the value.
	*/addRoutes:function(t){for(var e in t)this.routes[e]||(this.routes[e]=new this.Route(e),this.sortedRoutes.push(e)),this.routes[e].addHandler(t[e],!1);this.sortedRoutes.sort((t,e)=>this.routes[t].routeRegex.length-this.routes[e].routeRegex.length)},/*
	**	Removes the specified route from the routing map.
	*/removeRoute:function(t,e,s){this.routes[t]&&(void 0!==s?(this.routes[t].removeHandler(e,!1),this.routes[t].removeHandler(s,!0)):this.routes[t].removeHandler(e))},/*
	**	Removes the specified routes from the routing map. The routes map should contain the route
	**	expression in the key of the map and a handler function in the value.
	*/removeRoutes:function(t){for(var e in t)this.routes[e]&&this.routes[e].removeHandler(t[e])},/*
	**	Given a formatted location and a previous one it will return the correct real location.
	*/realLocation:function(t,e){e||(e=this.location),e||(e=" ");for(var s,n=0,o=0,a=0,r="";-1!=n&&o<t.length&&a<e.length;)switch(n){case 0:if("*"==t.substr(o++,1)){n=1;break}if(t.substr(o-1,1)!=e.substr(a++,1)){r+=t.substr(o-1),n=-1;break}r+=e.substr(a-1,1);break;case 1:if("*"==t.substr(o,1)){n=3,o++;break}n=2;break;case 2:if(-1==(s=e.indexOf(t.substr(o,1),a))){r+=e.substr(a)+t.substr(o),n=-1;break}r+=e.substr(a,s-a),n=0,a=s;break;case 3:if(-1==(s=e.lastIndexOf(t.substr(o,1)))){r+=t.substr(o),n=-1;break}r+=e.substr(a,s-a),n=0,a=s}return -1!=n&&(r+=t.substr(o)),r.trim()},/*
	**	Event handler called when the location hash changes.
	*/onLocationChanged:function(){var t=location.hash.substr(1),e=this.realLocation(t);if(t!=e){globalThis.location.replace("#"+e);return}if(this.location=t,this.args=this.location.split("/"),this.ignoreHashChangeEvent>0){this.ignoreHashChangeEvent--;return}for(var s=0;s<this.sortedRoutes.length;s++)this.routes[this.sortedRoutes[s]].dispatch(this.location)},/*
	**	Navigates to the given hash-based URL.
	*/navigate:function(t,e=!1){if(t=this.realLocation(t),globalThis.location.hash=="#"+t){this.refresh();return}e?globalThis.location.replace("#"+t):globalThis.location.hash=t}};b.init();/**
 * Map containing the original prototypes for all registered elements.
 */let v={},y={},_={/**
     * Internal element ID. Added as namespace to model events. Ensures that certain model events are run locally only, not affecting other event handlers.
     */eid:null,/**
     * Indicates if the element is a root element, that is, the target element to attach child elements having `data-ref` attribute.
     */isRoot:!1,/**
     * Root element to which this element is attached (when applicable).
     */root:null,/**
     * Indicates ready-state of the element. Possible values are: 0: "Not ready", 1: "Children Initialized", and 2: "Parent Ready".
     */isReady:0,readyReenter:0,readyLocked:0,/**
     * Model type (class) for the element's model.
     */modelt:o,/**
     * Data model related to the element.
     */model:null,/**
     * Contents of the element. When set, the innerHTML will be set to this value.
     */contents:null,/**
     * 	Events map.
     */events:{"mousedown [data-long-press]":function(t){if(t.continuePropagation=!0,t.source._long_press)return;let e=t.source;e._long_press=setTimeout(()=>{let t=e._pos_fx-e._pos_sx,s=e._pos_fy-e._pos_sy;e._long_press=null,5>Math.sqrt(t*t+s*s)&&(e._long_press=!1,this.dispatchOn(e,"long-press"))},500),e._pos_sx=t.clientX,e._pos_sy=t.clientY,e._pos_fx=t.clientX,e._pos_fy=t.clientY},"mousemove [data-long-press]":function(t){t.continuePropagation=!0,t.source._long_press&&(t.source._pos_fx=t.clientX,t.source._pos_fy=t.clientY)},"touchstart [data-long-press]":function(t){if(t.continuePropagation=!0,t.source._long_press)return;let e=t.source;e._long_press=setTimeout(()=>{let t=e._pos_fx-e._pos_sx,s=e._pos_fy-e._pos_sy;e._long_press=null,5>Math.sqrt(t*t+s*s)&&(e._long_press=!1,this.dispatchOn(e,"long-press"))},500),e._pos_sx=t.touches[0].clientX,e._pos_sy=t.touches[0].clientY,e._pos_fx=t.touches[0].clientX,e._pos_fy=t.touches[0].clientY},"touchmove [data-long-press]":function(t){t.continuePropagation=!0,t.source._long_press&&(t.source._pos_fx=t.touches[0].clientX,t.source._pos_fy=t.touches[0].clientY)},"mouseup [data-long-press]":function(t){!1!==t.source._long_press&&(t.source._long_press&&(clearTimeout(t.source._long_press),t.source._long_press=null),t.continuePropagation=!0)},"touchend [data-long-press]":function(t){!1!==t.source._long_press&&(t.source._long_press&&(clearTimeout(t.source._long_press),t.source._long_press=null),t.continuePropagation=!0)},"click [data-action]":function(t){if(!1===t.source._long_press)return;let e=t.source.dataset.action.split(" ");e[0]in this?this[e[0]]({...t.params,...t.source.dataset,...e,length:e.length},t):t.continuePropagation=!0},"long-press [data-long-press]":function(t){let e=t.source.dataset.longPress.split(" ");e[0]in this?this[e[0]]({...t.params,...t.source.dataset,...e,length:e.length},t):t.continuePropagation=!0},"keyup(13) input[data-enter]":function(t){let e=t.source.dataset.enter.split(" ");e[0]in this?this[e[0]]({...t.params,...t.source.dataset,...e,length:e.length},t):t.continuePropagation=!0}},/**
     * Internal routes map, set by `bindRoutes`.
     */routes:null,/**
     * 	Element constructor.
     */__ctor:function(){if(this._list_watch=[],this._list_visible=[],this._list_attr=[],this._list_property=[],"root"in this.dataset&&(this.isRoot="true"===this.dataset.root),this.style.display="block",this.eid=Math.random().toString().substr(2),null!=this.model){let t=this.model;this.model=null,this.setModel(t,!1)}Object.keys(this._super).reverse().forEach(t=>{"init"in this._super[t]&&this._super[t].init()}),_.debug&&console.log(">> "+this.tagName+" INIT ON "+this.parentElement.tagName),this.init(),this.events&&this.bindEvents(this.events),this.contents&&this.setInnerHTML(this.contents),setTimeout(()=>{"r-dom-probe"!==this.tagName.toLowerCase()?this.appendChild(document.createElement("r-dom-probe")):this.markReady()},0)},/**
     * 	Initializes the element. Called after construction of the instance.
     */init:function(){},/**
     * 	Executed when the children of the element are ready.
     */ready:function(){},/**
     * 	Executed after ready and after the root is also ready.
     */rready:function(){},/**
     * 	Marks the element as ready.
     */markReady:function(t=null){if(this.readyLocked++,this.isReady)this.collectWatchers();else{// Set model is `model` property was set in the element.
if(this.isReady=1,"model"in this.dataset){let t=this.getFieldByPath(this.dataset.model);t&&this.setModel(t)}// Run ready methods in class hierarchy.
Object.keys(this._super).reverse().forEach(t=>{"ready"in this._super[t]&&this._super[t].ready()}),_.debug&&console.log(">> "+this.tagName+" READY"),this.ready(),this.onready&&this.onready(this),this.collectWatchers()}let e=this.findCustomParent(this);_.debug&&console.log(this.tagName+" ROOT IS "+(e?e.tagName:"NULL")),e&&0===e.isReady&&0!=this.isReady&&e.checkReady();let s=!1;if(e&&2===e.isReady&&2!==this.isReady&&(this.getRoot(),this.root&&this.dataset.ref&&(_.debug&&console.log(this.tagName+" REF AS `"+this.dataset.ref+"` ON "+this.root.tagName),this.root[this.dataset.ref]=this,this.root.onRefAdded(this.dataset.ref,this)),s=!0),e||2===this.isReady||(s=!0),s){if(this.isReady=2,null!==t)for(let e of t)e.checkReady();_.debug&&console.log(">> "+this.tagName+" RREADY"),Object.keys(this._super).reverse().forEach(t=>{"rready"in this._super[t]&&this._super[t].rready()}),this.rready(),this.onrootready&&this.onrootready(this)}this.readyLocked--,this.readyReenter&&!this.readyLocked&&(this.readyReenter=!1,this.checkReady()),"r-dom-probe"===this.tagName.toLowerCase()&&this.remove()},/**
     *	Checks if all children are ready and fires the appropriate function (`ready` and/or `rready`).
     */checkReady:function(){if(0==this.childNodes.length)return;if(this.readyLocked){this.readyReenter=!0;return}let t=!0,e=[],s=document.evaluate(".//*[contains(name(),'-')]",this,null,XPathResult.ANY_TYPE,null);for(_.debug&&console.log("# CHECKING "+this.tagName);;){let n=s.iterateNext();if(!n)break;n!==this&&this.findCustomParent(n)===this&&(_.debug&&console.log("   "+n.tagName+" = "+n.isReady),n.isReady||(t=!1),e.push(n))}t&&this.markReady(e)},/**
     * 	Returns the value of a field given its path. Starts from `global`, unless the first item in the path is `this`, in which case it will start from the element.
     */getFieldByPath:function(t){if(!t)return null;if("string"!=typeof t)return t;let e=t.split("."),s=g;for(e.length&&"this"==e[0]&&(s=this,e.shift()),e.length&&"root"==e[0]&&(s=this.getRoot(),e.shift());null!=s&&0!=e.length;)s=s[e.shift()];return s},/**
     * 	Returns the root of the element (that is, the `root` property). If not set it will attempt to find the root first.
     */getRoot:function(){return this.root?this.root:this.root=this.findRoot()},/**
     * 	Sets the model of the element and executes the `modelChanged` event handler (unless `update` is set to false).
     */setModel:function(e,s=!0){return e&&(e=t.ensureTypeOf(this.modelt,e),this.model!==e&&(null!=this.model&&(this.model.removeEventListener(this.eid+":modelChanged",this.onModelPreChanged,this),this.model.removeEventListener(this.eid+":propertyChanging",this.onModelPropertyChanging,this),this.model.removeEventListener(this.eid+":propertyChanged",this.onModelPropertyPreChanged,this),this.model.removeEventListener(this.eid+":propertyRemoved",this.onModelPropertyRemoved,this)),this.model=e,this.model.addEventListener(this.eid+":modelChanged",this.onModelPreChanged,this),this.model.addEventListener(this.eid+":propertyChanging",this.onModelPropertyChanging,this),this.model.addEventListener(this.eid+":propertyChanged",this.onModelPropertyPreChanged,this),this.model.addEventListener(this.eid+":propertyRemoved",this.onModelPropertyRemoved,this)),!1!==s&&this.model.setNamespace(this.eid).update(!0).setNamespace(null)),this},/**
     * 	Returns the model of the element. Added for symmetry only, exactly the same as accesing public property `model` of this class.
     */getModel:function(){return this.model},/**
     * 	Adds one or more CSS classes (separated by space) to the element.
     */addClass:function(t){return t&&t.split(" ").forEach(t=>{(t=t.trim())&&("-"==t[0]||"+"==t[0]?this.classList["-"==t[0]?"remove":"add"](t.substr(1)):this.classList.add(t))}),this},/**
     * 	Removes one or more CSS classes (separated by space) from the element.
     */removeClass:function(t){return t&&t.split(" ").forEach(t=>{(t=t.trim())&&("-"==t[0]||"+"==t[0]?this.classList["-"==t[0]?"remove":"add"](t.substr(1)):this.classList.remove(t))}),this},/**
     * 	Sets one or more style properties to the element (separated by semi-colon).
     */setStyle:function(t){return t&&t.split(";").forEach(t=>{let e=(t=t.trim()).indexOf(":");if(-1==e)return;let s=t.substr(0,e).trim();for(let t=s.indexOf("-");-1!=t;t=s.indexOf("-"))s=s.substr(0,t)+s.substr(t+1,1).toUpperCase()+s.substr(t+2);this.style[s]=t.substr(e+1).trim()}),this},/**
     * 	Returns the width of the specified element (or of itself it none provided), uses `getBoundingClientRect`.
     */getWidth:function(t=null){return(t||this).getBoundingClientRect().width},/**
     * 	Returns the height of the specified element (or of itself it none provided), uses `getBoundingClientRect`.
     */getHeight:function(t=null){return(t||this).getBoundingClientRect().height},/**
    **	Binds all events in the specified map to the element, the events map can have one of the following forms:
    **
    **		"click .button": "doSomething",		(Delegated Event)
    **		"click .button": function() { },	(Delegated Event)
    **		"myevt &this": "...",				(Self Event)
    **		"myevt": "...",						(Element Event)
    **		"myevt @objName": "...",			(EventDispatcher Event)
    **		"#propname": "...",					(Property Changed Event)
    **		"keyup(10) .input": "..."			(Delegated Event with Parameters)
    **
    **	>> Element bindEvents (object events);
    */bindEvents:function(e){for(let r in e){let l=e[r];"string"==t.typeOf(l)&&(l=this[l]),l=l.bind(this);var s=r.indexOf(" "),n=-1==s?r:r.substr(0,s),o=-1==s?"":r.substr(s+1);let h=null;var a=n.indexOf("(");if(-1!=a&&(h=n.substr(a+1,n.length-a-2).split(","),n=n.substr(0,a)),"@"==o[0]){if("@this"!=o){this[o.substr(1)].addEventListener(n,l);continue}o=this}else"&"==o[0]&&(o="&this"!=o?"[data-ref='"+o.substr(1)+"']":this);if("#"==n.substr(0,1)){this.listen("propertyChanged."+n.substr(1),this,l);continue}if(null!=h)switch(n){case"keyup":case"keydown":this.listen(n,o,function(e){if(-1!=t.indexOf(h,e.keyCode.toString()))return l(e,h);e.continuePropagation=!0});continue}this.listen(n,o,l)}return this},/**
    **	Binds all routes in the specified map to the Router object.
    **
    **		"route-path": "doSomething"						On-Route
    **		"route-path": function (evt, args) { }			On-Route
    **		"!route-path": "doSomething"					On-UnRoute
    **		"!route-path": function (evt, args) { }			On-UnRoute
    **
    **	>> Element bindRoutes ();
    */bindRoutes:function(){if(this.routes)for(let e in this.routes){let s="!"===e[0]?b.getRoute(e.substr(1)):b.getRoute(e),n=this.routes[e];"string"===t.typeOf(n)&&(n=this[n]),"!"===e[0]?s.addHandler(n,!0,this):s.addHandler(n,!1,this)}},/**
     * Unbinds all routes added by bindRoutes.
     */unbindRoutes:function(){if(this.routes)for(let e in this.routes){let s="!"===e[0]?b.getRoute(e.substr(1)):b.getRoute(e),n=this.routes[e];"string"===t.typeOf(n)&&(n=this[n]),"!"===e[0]?s.removeHandler(n,!0,this):s.removeHandler(n,!1,this)}},/**
    **	Executes the underlying event handler given an event and a selector. Called internally by listen().
    **
    **	>> void _eventHandler (event evt, string selector, function handler);
    */_eventHandler:function(e,s,n){if(!1!==e.continuePropagation){if(e.continuePropagation=!0,e.source=e.target,s&&s instanceof HTMLElement)e.source===s&&(e.continuePropagation=!1,!0===n.call(this,e,e.detail)&&(e.continuePropagation=!0));else if(s&&"*"!=s){let o=this.querySelectorAll(s);for(;e.source!==this;){if(-1!==t.indexOf(o,e.source,!0)){e.continuePropagation=!1,!0===n.call(this,e,e.detail)&&(e.continuePropagation=!0);break}e.source=e.source.parentElement}}else e.continuePropagation=!1,!0===n.call(this,e,e.detail)&&(e.continuePropagation=!0);!1===e.continuePropagation&&(e.preventDefault(),e.stopPropagation())}},/**
    **	Listens for an event on elements matching the specified selector, returns an object with a single method `remove` used
    **	to remove the listener when it is no longer needed.
    **
    **	>> object listen (string eventName, string selector, function handler);
    **	>> object listen (string eventName, function handler);
    */listen:function(e,s,n){let o=!1,a=!1;"function"==t.typeOf(s)&&(n=s,s=null),"!"==e[e.length-1]&&(e=e.substr(0,e.length-1),o=!0),"!"==e[0]&&(e=e.substr(1),a=!0);let r=null,l=null,h=this;return this.addEventListener(e,r=t=>{!1!==t.continuePropagation&&(t.firstCapture||(t.firstCapture=this,t.firstCaptureCount=0,t.queue=[]),t.firstCapture===this&&t.firstCaptureCount++,!0==o&&t.queue.push([this,s,n]),!0==a&&this._eventHandler(t,s,n))},!0),this.addEventListener(e,l=t=>{if(!1!==t.continuePropagation&&(!0!=o&&!0!=a&&this._eventHandler(t,s,n),t.firstCapture===this&&!1!==t.continuePropagation&&0==--t.firstCaptureCount)){for(;t.queue.length;){let e=t.queue.pop();e[0]._eventHandler(t,e[1],e[2])}t.continuePropagation=!1}},!1),{removed:!1,remove:function(){this.removed||(this.removed=!0,h.removeEventListener(e,r,!0),h.removeEventListener(e,l,!1))}}},/**
    **	Creates an event object for later dispatch.
    */createEventObject:function(t,e,s){return"click"==t?new MouseEvent(t,{bubbles:s,detail:e}):new CustomEvent(t,{bubbles:s,detail:e})},/**
    **	Dispatches a new event with the specified name and the given arguments.
    */dispatch:function(t,e=null,s=!0){let n="on"+t.toLowerCase();if(n in this){this[n](e,this);return}this.dispatchEvent(this.createEventObject(t,e,s))},/**
    **	Dispatches a new event on the specified element with the given name and arguments (uses `CustomEvent`).
    */dispatchOn:function(t,e,s=null,n=!0){t.dispatchEvent(this.createEventObject(e,s,n))},/**
    **	Sets the innerHTML property of the element and runs some post set-content tasks.
    **
    **	>> void setInnerHTML (value);
    */setInnerHTML:function(t){this.readyLocked++,this.innerHTML=t,this.readyLocked--},/**
    **	Collects all watchers (data-watch, data-visible, data-attr, data-property), that depend on the model, should be invoked when the
    **  structure of the element changed (added/removed children). This is automatically called when the setInnerHTML method is called.
    **
    **	Note that for 3rd party libs that add children to this element (which could probably have a watcher) will possibly result in
    **	duplication of the added elements when compiling the innerHTML template. To prevent this add the 'pseudo' CSS class to any
    **	element that should not be added to the HTML template.
    **
    **	>> void collectWatchers ();
    */collectWatchers:function(){let t,e=this,s=!1;if(!this.isRoot)return;let n=this._list_watch.length,o=this._list_visible.length,a=this._list_attr.length,r=this._list_property.length;/* *** */t=this.querySelectorAll("[data-watch]");for(let e=0;e<t.length;e++){for(let s of t[e].querySelectorAll(".pseudo"))s.remove();t[e]._template=c.compile(t[e].innerHTML),t[e]._watch=RegExp("^("+t[e].dataset.watch+")$"),t[e].innerHTML="",t[e].removeAttribute("data-watch"),this._list_watch.push(t[e])}if("selfWatch"in this.dataset){for(let t of this.querySelectorAll(".pseudo"))t.remove();this._template=c.compile(this.innerHTML),this._watch=RegExp("^("+this.dataset.selfWatch+")$"),this.innerHTML="",this.removeAttribute("data-self-watch"),this._list_watch.push(this)}/* *** */t=this.querySelectorAll("[data-visible]");for(let e=0;e<t.length;e++)t[e]._visible=c.compile(t[e].dataset.visible),t[e].removeAttribute("data-visible"),this._list_visible.push(t[e]);"selfVisible"in this.dataset&&(this._visible=c.compile(this.dataset.selfVisible),this.removeAttribute("data-self-visible"),this._list_visible.push(this)),/* *** */t=this.querySelectorAll("[data-attr]");for(let e=0;e<t.length;e++){for(let s of(t[e]._attr=[],t[e].dataset.attr.split(";")))2==(s=s.split(":")).length&&t[e]._attr.push({name:s[0].trim(),value:c.compile(s[1].trim())});t[e].removeAttribute("data-attr"),this._list_attr.push(t[e])}if("selfAttr"in this.dataset){for(let t of(this._attr=[],this.dataset.selfAttr.split(";")))2==(t=t.split(":")).length&&this._attr.push({name:t[0].trim(),value:c.compile(t[1].trim())});this.removeAttribute("data-self-attr"),this._list_attr.push(this)}/* *** */t=this.querySelectorAll("[data-property]");for(let s=0;s<t.length;s++)t[s].onchange=t[s].onblur=function(){switch(this.type){case"radio":this.checked&&e.getModel().set(this.name,this.value);break;case"checkbox":e.getModel().set(this.name,this.checked?"1":"0");break;case"field":e.getModel().set(this.name,this.getValue());break;default:e.getModel().set(this.name,this.value)}},"SELECT"==t[s].tagName&&(t[s].onmouseup=function(){e.getModel().set(this.name,this.value)}),t[s].name=t[s].dataset.property,t[s].removeAttribute("data-property"),this._list_property.push(t[s]);"selfProperty"in this.dataset&&(this.onchange=this.onblur=function(){switch(this.type){case"radio":this.checked&&e.getModel().set(this.name,this.value);break;case"checkbox":e.getModel().set(this.name,this.checked?"1":"0");break;case"field":e.getModel().set(this.name,this.getValue());break;default:e.getModel().set(this.name,this.value)}},"SELECT"==this.tagName&&(this.onmouseup=function(){e.getModel().set(this.name,this.value)}),this.name=this.dataset.selfProperty,this.removeAttribute("data-self-property"),this._list_property.push(this)),/* *** */this._list_watch=this._list_watch.filter(t=>null!=t.parentElement),n!=this._list_watch.length&&(s=!0),this._list_visible=this._list_visible.filter(t=>null!=t.parentElement),o!=this._list_visible.length&&(s=!0),this._list_attr=this._list_attr.filter(t=>null!=t.parentElement),a!=this._list_attr.length&&(s=!0),this._list_property=this._list_property.filter(t=>null!=t.parentElement),r!=this._list_property.length&&(s=!0),null!=this.model&&s&&this.model.setNamespace(this.eid).update(!0).setNamespace(null)},/**
    **	Executed when the element is created and yet not attached to the DOM tree.
    */onCreated:function(){},/**
     * Executed when the element is attached to the DOM tree.
     */elementConnected:function(){this.bindRoutes(),this.onConnected()},/**
     * Executed when the element is no longer a part of the DOM tree.
     */elementDisconnected:function(){this.unbindRoutes()},/**
    **	Executed when the element is attached to the DOM tree.
    */onConnected:function(){this.onconnected&&this.onconnected(this)},/**
    **	Executed when the element is no longer a part of the DOM tree.
    */onDisconnected:function(){this.ondisconnected&&this.ondisconnected(this)},/**
    **	Executed on the root element when a child element has `data-ref` attribute and it was added to it.
    */onRefAdded:function(t,e){},/**
    **	Executed on the root element when a child element has `data-ref` attribute and it was removed from it.
    */onRefRemoved:function(t,e){},/**
    **	Event handler invoked when the model has changed, executed before onModelChanged() to update internal dependencies,
    **	should not be overriden or elements watching the model will not be updated.
    **
    **	>> void onModelPreChanged (evt, args);
    */onModelPreChanged:function(t,e){let s=this.getModel().get();for(let t=0;t<this._list_watch.length;t++)for(let n of e.fields)if(this._list_watch[t]._watch.test(n)){this._list_watch[t].innerHTML=this._list_watch[t]._template(s);break}for(let t=0;t<this._list_visible.length;t++)this._list_visible[t]._visible(s,"arg")?this._list_visible[t].style.removeProperty("display"):this._list_visible[t].style.setProperty("display","none","important");for(let t=0;t<this._list_attr.length;t++)for(let e of this._list_attr[t]._attr)this._list_attr[t][e.name]=e.value(s,"arg");this.onModelChanged(t,e)},/**
    **	Event handler invoked when the model has changed.
    */onModelChanged:function(t,e){},/**
    **	Event handler invoked when a property of the model is changing. Fields `name` and `value` can be found in the `args` object.
    */onModelPropertyChanging:function(t,e){},/**
    **	Event handler invoked when a property of the model has changed, executed before onModelPropertyChanged() to update internal
    **	dependencies. Automatically triggers internal events named `propertyChanged.<propertyName>` and `propertyChanged`.
    **	Should not be overriden or elements depending on the property will not be updated.
    */onModelPropertyPreChanged:function(t,e){for(let t=0;t<this._list_property.length;t++)if(this._list_property[t].name==e.name){let s=!0;switch(this._list_property[t].type){case"radio":if(this._list_property[t].value!=e.value){this._list_property[t].parentElement.classList.remove("active");continue}this._list_property[t].checked=!0,this._list_property[t].parentElement.classList.add("active");break;case"checkbox":~~e.value?(this._list_property[t].checked=!0,this._list_property[t].parentElement.classList.add("active")):(this._list_property[t].checked=!1,this._list_property[t].parentElement.classList.remove("active"));break;case"field":this._list_property[t].val=this._list_property[t].dataset.value=e.value,this._list_property[t].setValue(e.value),s=!1;break;default:this._list_property[t].value=e.value,this._list_property[t].val=this._list_property[t].dataset.value=e.value,this._list_property[t].value!=e.value&&(s=!1)}s&&this._list_property[t].onchange&&this._list_property[t].onchange()}this.dispatch("propertyChanged."+e.name,e,!1),this.dispatch("propertyChanged",e,!1),this.onModelPropertyChanged(t,e)},/**
    **	Event handler invoked when a property of the model has changed.
    */onModelPropertyChanged:function(t,e){},/**
    **	Event handler invoked when a property of the model is removed. Field `name` can be found in the `args` object.
    */onModelPropertyRemoved:function(t,e){},/*
    **	Runs the following preparation procedures on the specified prototype:
    **		- All functions named 'event <event-name> [event-selector]' will be moved to the 'events' map.
    **		- All functions named 'route <route-path>' will be moved to the 'routes' map.
    **
    **	>> void preparePrototype (object proto);
    */preparePrototype:function(t){if(!0!==t.__prototypePrepared)for(let e in t.__prototypePrepared=!0,t.hasOwnProperty("events")&&t.events||(t.events={}),t.hasOwnProperty("routes")&&t.routes||(t.routes={}),t)e.startsWith("event ")?(t.events[e.substr(6)]=t[e],delete t[e]):e.startsWith("route ")&&(t.routes[e.substr(6)]=t[e],delete t[e])},/*
    **	Registers a new custom element with the specified name. Extra functionality can be added with one or more prototypes, by default
    **	all elements also get the `Element` prototype. Note that the final prototypes of all registered elements are stored, and if you want
    **	to inherit another element's prototype just provide its name (string) in the protos argument list.
    **
    **	>> class register (string name, ...(object|string) protos);
    */register:function(e,...s){let n;let o=class extends HTMLElement{constructor(){for(let t of(super(),this.invokeConstructor=!0,_.debug&&console.log("CREATED "+this.tagName),this._super={},Object.entries(this.constructor.prototype._super)))for(let e of(this._super[t[0]]={},Object.entries(t[1])))this._super[t[0]][e[0]]=e[1].bind(this);this.onCreated()}findRoot(t){let e=t||this.parentElement;for(;null!=e;){if("isRoot"in e&&!0===e.isRoot)return e;e=e.parentElement}return null}findCustomParent(t){let e=t?t.parentElement:this.parentElement;for(;null!=e;){if(-1!==e.tagName.indexOf("-"))return e;e=e.parentElement}return null}connectReference(t=null,e=255){this.root||(1&e)!=1||(null==t&&(t=this.findRoot()),null==t||(this.dataset.ref&&(t[this.dataset.ref]=this),this.root=t))}connectedCallback(){this.connectReference(null,1),this.invokeConstructor&&(this.invokeConstructor=!1,this.__ctor()),this.connectReference(null,2),this.elementConnected(),this.dataset.xref&&(globalThis[this.dataset.xref]=this)}disconnectedCallback(){this.root&&(this.dataset.ref&&(this.root.onRefRemoved(this.dataset.ref,this),delete this.root[this.dataset.ref]),this.root=null),this.elementDisconnected(),this.dataset.xref&&delete globalThis[this.dataset.xref]}};t.override(o.prototype,_);let a={},r={},l=t.clone(_.events),h=!0,c=!0,u=!0;for(let e=0;e<s.length;e++)if(s[e]){if("string"==t.typeOf(s[e])){let o=s[e];if(s[e]=v[o],!s[e])continue;for(let n in r[o]={},s[e])"function"==t.typeOf(s[e][n])&&(r[o][n]=s[e][n]);h=!1,c=!1,u=!1,n=!1}else _.preparePrototype(s[e]),n=!0;"_super"in s[e]&&t.override(r,s[e]._super),"events"in s[e]&&t.override(l,s[e].events),t.override(o.prototype,s[e]),t.override(a,s[e]),n&&(!h&&"init"in s[e]&&(h=!0),!c&&"ready"in s[e]&&(c=!0),!u&&"rready"in s[e]&&(u=!0))}let d=function(){};return h||(o.prototype.init=d,a.init=d),c||(o.prototype.ready=d,a.ready=d),u||(o.prototype.rready=d,a.rready=d),o.prototype._super=r,o.prototype.events=l,a._super=r,a.events=l,customElements.define(e,o),v[e]=a,y[e]=o,o},/*
    **	Expands an already created custom element with the specified prototype(s).
    **
    **	>> void expand (string elementName, ...object protos);
    */expand:function(e,...s){if(!(e in v))return;let n=v[e],o=y[e],a=n._super,r=n.events;for(let e of s)_.preparePrototype(e),"_super"in e&&t.override(a,e._super),"events"in e&&t.override(r,e.events),t.override(o.prototype,e),t.override(n,e);o.prototype._super=a,o.prototype.events=r,n._super=a,n.events=r},/*
    **	Appends a hook to a function of a custom element.
    */hookAppend:function(e,s,n){if(!(e in v))return;let o=t.hookAppend(v[e],s,n),a=t.hookAppend(y[e].prototype,s,n);return{unhook:function(){o.unhook(),a.unhook()}}},/*
    **	Prepends a hook to a function of a custom element.
    */hookPrepend:function(e,s,n){if(!(e in v))return;let o=t.hookPrepend(v[e],s,n),a=t.hookPrepend(y[e].prototype,s,n);return{unhook:function(){o.unhook(),a.unhook()}}},/**
    **	Built-in action handlers.
    *//**
    **	:toggleClass <className> [<selector>]
    **
    **	Toggles a CSS class on the element.
    */":toggleClass":function(t,e){let s=e.source;"2"in t&&(s=document.querySelector(t[2])),s&&(s.classList.contains(t[1])?s.classList.remove(t[1]):s.classList.add(t[1]))},/**
    **	:setClass <className> [<selector>]
    **
    **	Sets a CSS class on the element.
    */":setClass":function(t,e){let s=e.source;"2"in t&&(s=document.querySelector(t[2])),s&&s.classList.add(t[1])},/**
    **	:volatileClass <className> [<selector>]
    **
    **	Adds the CSS class to the element and any click outside will cause it to be removed.
    */":volatileClass":function(t,e){let s=e.source;if("2"in t&&(s=document.querySelector(t[2])),!s)return;s.classList.add(t[1]);let n=()=>{window.removeEventListener("click",n,!0),s.classList.remove(t[1])};window.addEventListener("click",n,!0)},/**
    **	:toggleClassUnique <className> <parentSelector> <childSelector>
    **
    **	Toggles a CSS class on the element and only one element in the selected parent can have the class.
    */":toggleClassUnique":function(t,e){let s=e.source;s&&(s.classList.contains(t[1])?s.classList.remove(t[1]):(s.querySelectorParent(t[2]).querySelectorAll(t[3]).forEach(e=>e.classList.remove(t[1])),s.classList.add(t[1])))},/**
    **	:setClassUnique <className> <parentSelector> <childSelector>
    **
    **	Sets a CSS class on the element and only that element in the selected parent can have the class.
    */":setClassUnique":function(t,e){let s=e.source;s&&(s.querySelectorParent(t[2]).querySelectorAll(t[3]).forEach(e=>e.classList.remove(t[1])),s.classList.add(t[1]))}};_.debug=!1,_.register("r-elem",{}),_.register("r-dom-probe",{}),/* ****************************************** *//**
 * Finds the parent element given a selector.
 */HTMLElement.prototype.querySelectorParent=function(t){let e=this;for(;null!=e&&!e.matches(t);)e=e.parentElement;return e};/**
 * API interface utility functions.
 */let E={/**
	 * Flags constants.
	 */REQUEST_PACKAGE_SUPPORTED:1,REQ64_SUPPORTED:2,JSON_RESPONSE_SUPPORTED:4,XML_RESPONSE_SUPPORTED:8,INCLUDE_CREDENTIALS:16,UNIQUE_STAMP:32,DISABLE_CORS:64,/**
	 * Target URL for all the API requests. Set by calling `setEndPoint`.
	 */apiUrl:"/api",/**
	 * Capabilities flag.
	 */flags:63,/**
	 * Indicates if all request data will be packed into a req64 parameter instead of individual fields.
	 */useReq64:!1,/**
	 * Number of retries to execute each API call before giving up and invoking error handlers.
	 */retries:0,/**
	 * Headers for the request.
	 */headers:{},/**
	 * Level of the current request. Used to detect nested requests.
	 */_requestLevel:0,/**
	 * Indicates if all API calls should be bundled in a request package. Activated by calling the packageBegin() function and finished with packageEnd().
	 */_requestPackage:0,/**
	 * When in package-mode, this contains the package data to be sent upon a call to packageEnd().
	 */_packageData:[],/**
	 * Sets the API end-point URL address.
	 */setEndPoint:function(t,e=null){return this.apiUrl=t,this.flags=e??this.flags,this},/**
	 * Overridable filter that processes the response from the server and returns true if it was successful. The `res` parameter indicates the response data, and `req` the request data.
	 */responseFilter:function(t,e){return!0},/**
	 * Starts "package-mode" (using the `rpkg` field). Any API calls after this will be bundled together.
	 */packageBegin:function(){this.flags&E.REQUEST_PACKAGE_SUPPORTED&&this._requestPackage++},/**
	 * Finishes "package-mode" and a single API request with the currently constructed package will be sent.
	 */packageEnd:function(t){this.flags&E.REQUEST_PACKAGE_SUPPORTED&&this._requestPackage&&(--this._requestPackage||this.packageSend(t))},/**
	 * Starts package-mode, executes the callback and finishes package-mode. Therefore any requests made by the callback will be packed together.
	 */batch:function(t,e=null){if(!(this.flags&E.REQUEST_PACKAGE_SUPPORTED)){t(),e&&e();return}this.packageBegin(),t(),this.packageEnd(e)},/**
	 * Sends a single API request with the currently constructed package and maintains package-mode.
	 */packageSend:function(t){if(!(this.flags&E.REQUEST_PACKAGE_SUPPORTED)||!this._packageData.length)return;let e=this._packageData;this._packageData=[];for(var s="",n=0;n<e.length;n++)s+="r"+n+","+u.encode(this.encodeParams(e[n][2]))+";";this._showProgress(),this.apiCall({rpkg:s},(s,n)=>{this._hideProgress();for(let t=0;t<e.length;t++)try{var o=s["r"+t];if(!o){null!=e[t][1]&&e[t][1](e[t][2]);continue}null!=e[t][0]&&this.responseFilter(o,e[t][2])&&e[t][0](o,e[t][2])}catch(t){}t&&t()},t=>{this._hideProgress();for(let t=0;t<e.length;t++)null!=e[t][1]&&e[t][1](e[t][2])})},/**
	 * Adds CSS class 'busy' to the HTML root element, works only if running inside a browser.
	 */_showProgress:function(){"document"in g&&(this._requestLevel++,this._requestLevel>0&&g.document.documentElement.classList.add("busy"))},/**
	 * Removes the 'busy' CSS class from the HTML element.
	 */_hideProgress:function(){"document"in g&&(this._requestLevel--,this._requestLevel||setTimeout(()=>{0===this._requestLevel&&g.document.documentElement.classList.remove("busy")},250))},/**
	 * Sets an HTTP header.
	 */header:function(t,e){return null===e?delete this.headers[t]:this.headers[t]=e,this},/**
	 * Returns a parameter string for a GET request given an object with fields.
	 */encodeParams:function(t){let e=[];if(t instanceof FormData)for(let s of t.entries())e.push(encodeURIComponent(s[0])+"="+encodeURIComponent(s[1]));else for(let s in t)e.push(encodeURIComponent(s)+"="+encodeURIComponent(t[s]));return e.join("&")},/**
	 * Returns a URL given a relative or absolute URL.
	 */getUrl:function(t){return -1!==t.indexOf("//")?t:this.apiUrl+t},/**
	 * Appends a parameter to the URL.
	 */appendParam:function(t,e){return t+(-1==t.indexOf("?")?"?":"&")+e},/**
	 * Executes an API call to the URL stored in the `apiUrl` property. By default `httpMethod` is "auto", which will determine the best depending on the data to
	 * be sent. Any connection error will be reported to the `failure` callback, and similarly any success to the `success` callback. The `params` object can be
	 * a FormData object or just a regular object.
	 */apiCall:function(t,e,s,n=null,o=null,a=""){let r=this.getUrl(a);if(this.flags&E.UNIQUE_STAMP&&(r=this.appendParam(r,"_="+Date.now())),"GET"!=(n=n?n.toUpperCase():null)&&"POST"!=n&&(n="auto"),null===o&&(o=this.retries),this._requestPackage&&this.flags&E.REQUEST_PACKAGE_SUPPORTED){t instanceof FormData||(t={...t}),this._packageData.push([e,s,t]);return}this._showProgress();let l=t,h={mode:this.flags&E.DISABLE_CORS?"no-cors":"cors",headers:{Accept:"text/html,application/xhtml+xml,application/xml,application/json;q=0.9",...this.headers},method:n,body:null,multipart:!1};if(this.flags&E.INCLUDE_CREDENTIALS&&(h.credentials="include"),"string"==typeof l||l instanceof Blob)"string"==typeof l?"<"===l[0]?l.endsWith("</soap:Envelope>")?h.headers["Content-Type"]="application/soap+xml":h.headers["Content-Type"]="application/xml":"{"===l[0]||"["===l[0]?h.headers["Content-Type"]="application/json":h.headers["Content-Type"]="application/octet-stream":h.headers["Content-Type"]=l.type,h.method="POST",h.body=l;else{if(!(l instanceof FormData))for(let e in l=new FormData,t)t[e]instanceof File||t[e]instanceof Blob?l.append(e,t[e],t[e].name):l.append(e,t[e]);for(let t of l.entries())if(t[1]instanceof File||t[1]instanceof Blob){h.method="POST",h.multipart=!0;break}if(this.useReq64&&this.flags&E.REQ64_SUPPORTED&&!h.multipart){let t=new FormData;t.append("req64",u.encode(this.encodeParams(l))),l=t}if("auto"==h.method){let t=0;for(let e of(h.method="GET",l.entries()))if((t+=e[0].length+e[1].length+2)>960){h.method="POST";break}}"GET"==h.method?r=this.appendParam(r,this.encodeParams(l)):h.multipart?h.body=l:(h.headers["Content-Type"]="application/x-www-form-urlencoded",h.body=this.encodeParams(l))}g.fetch(r,h).then(t=>this.decodeResult(t)).then(s=>{if(this._hideProgress(),e&&this.responseFilter(s,t))try{e(s,t)}catch(t){}}).catch(r=>{this._hideProgress(),0==o?s&&s(r,t):this.apiCall(l,e,s,n,o-1,a)})},/**
	 * Decodes a result obtained using fetch into a usable object.
	 */decodeResult:function(t){let e=t.headers.get("content-type").split(";")[0].toLowerCase();return this.flags&E.JSON_RESPONSE_SUPPORTED&&-1!==e.indexOf("json")?t.json():this.flags&E.XML_RESPONSE_SUPPORTED&&-1!==e.indexOf("xml")?new Promise((e,s)=>{t.text().then(t=>{e(t=(new DOMParser).parseFromString(t,"text/xml"))}).catch(s)}):t.blob()},/**
	 * Makes a blob with the specified data and type.
	 */getBlob:function(t,e){return new Blob([t],{type:e})},/**
	 * Provided access to the base64 module to encode/decode data.
	 */base64:{encode:function(t){return u.encode(t)},decode:function(t){return u.decode(t)}},/**
	 * Executes an API request, returns a promise.
	 */request:function(t,e,s=null){return null===s&&"string"!=typeof e&&(s=e,e=""),new Promise((n,o)=>{this.apiCall(s,n,o,null,t,e)})},/**
	 * Executes a POST API call.
	 */post:function(t,e=null,s=null){return this.apiCall(t,e,s,"POST")},/**
	 * Executes a GET API call.
	 */get:function(t,e=null,s=null){return this.apiCall(t,e,s,"GET")},/**
	 * Executes an automatic API call, returns a promise.
	 */fetch:function(t,e=null){return null===e&&"string"!=typeof t&&(e=t,t=""),new Promise((s,n)=>{this.apiCall(e,s,n,null,null,t)})},/**
	 * Builds a URL from the given data.
	 */makeUrl:function(t,e=null){return null===e&&"string"!=typeof t&&(e=t,t=""),this.appendParam(this.getUrl(t),this.encodeParams(e))}};var /*
**	Provides several methods to quickly interface with a remote data-source as defined by Wind.
*/k=n.extend({className:"DataSource",debounceDelay:250,request:null,includeCount:!1,includeEnum:!1,includeList:!0,eid:null,count:0,list:null,enum:null,/*
	**	Constructs the data source with the specified optional `config` parameters, any of the properties of this object can be specified
	**	in the config. Uses the given basePath as prefix for the `f` parameter for subsequent API operations, a basePath of `candies` will
	**	result in calls to `candies.list`, `candies.count`, etc.
	*/__ctor:function(t,e){this._super.EventDispatcher.__ctor(),this.basePath=t,e&&Object.assign(this,e),this.request=new o(this.request),this.eid=Math.random().toString().substr(2),this.count=0,this.list=new a,this.list.dataSource=this,this.enum=new a,this.enum.dataSource=this,this.request.addEventListener(this.eid+":propertyChanged",this.forwardRequestEvent,this),this.list.addEventListener(this.eid+":itemsCleared",this.forwardListEvent,this),this.list.addEventListener(this.eid+":itemsChanged",this.forwardListEvent,this),this.list.addEventListener(this.eid+":itemRemoved",this.forwardListEvent,this),this.list.addEventListener(this.eid+":itemChanged",this.forwardListEvent,this),this.list.addEventListener(this.eid+":itemAdded",this.forwardListEvent,this),this.enum.addEventListener(this.eid+":itemsCleared",this.forwardEnumEvent,this),this.enum.addEventListener(this.eid+":itemsChanged",this.forwardEnumEvent,this),this.enum.addEventListener(this.eid+":itemRemoved",this.forwardEnumEvent,this),this.enum.addEventListener(this.eid+":itemChanged",this.forwardEnumEvent,this),this.enum.addEventListener(this.eid+":itemAdded",this.forwardEnumEvent,this)},forwardRequestEvent:function(t,e){this.prepareEvent("request"+t.name[0].toUpperCase()+t.name.substr(1),e).setSource(t.source).resume()},forwardListEvent:function(t,e){this.prepareEvent("list"+t.name[0].toUpperCase()+t.name.substr(1),e).setSource(t.source).resume()},forwardEnumEvent:function(t,e){this.prepareEvent("enum"+t.name[0].toUpperCase()+t.name.substr(1),e).setSource(t.source).resume()},/*
	**	Executes one or more API functions (depending on `includeCount`, `includeEnum` and `includeList` properties) to retrieve the
	**	required data (uses debounce to prevent too-quick refreshes).
	**
	**	Refresh mode can be: order, filter, range, enum or full. Setting `mode` to `true` will cause a full refresh without debouncing.
	*/refresh:function(t="full",e=null){"function"==typeof t&&(e=t,t="full"),this._timeout&&(clearTimeout(this._timeout),this._timeout=null);let s=()=>{this._timeout=null,E.packageBegin(),this.includeCount&&("full"===t||"filter"===t)&&this.fetchCount(),this.includeEnum&&("full"===t||"enum"===t)&&this.fetchEnum(),this.includeList&&"enum"!==t&&this.fetchList(),E.packageEnd(e)};!0===t?(t="full",s()):this._timeout=setTimeout(s,this.debounceDelay)},/*
	**	Searches for the item in `list` that matches the specified `fields` and sends it to the callback. If no item is found (or if `forced` is true),
	**	a call to API function `.get` will be executed with the fields as request parameters. Returns a promise.
	*/fetch:function(t,e=!1){return new Promise((s,n)=>{let o=!0==e?null:this.list.find(t,!0);o?s(o.get()):this.fetchOne(t,t=>{t&&200==t.response&&t.data.length>0?s(t.data[0]):n(t)})})},/*
	**	Removes an item from the remote data source by executing the `.delete` API function, passes the given `fields` as request
	**	parameters. Returns a promise.
	*/delete:function(t){return new Promise((e,s)=>{this.fetchDelete(t,t=>{200==t.response?e(t):s(t.error)})})},fetchList:function(){let t={...this.request.get()};t.f=this.basePath+".list",this.dispatchEvent("listLoading"),E.fetch(t).then(t=>{this.list.setData(200==t.response?t.data:null),this.dispatchEvent("listLoaded"),this.dispatchEvent("listChanged")})},fetchEnum:function(){let t={...this.request.get()};t.f=this.basePath+".enum",this.dispatchEvent("enumLoading"),E.fetch(t).then(t=>{this.enum.setData(200==t.response?t.data:null),this.dispatchEvent("enumLoaded"),this.dispatchEvent("enumChanged")})},fetchCount:function(){let t={...this.request.get()};t.f=this.basePath+".count",this.dispatchEvent("countLoading"),E.fetch(t).then(t=>{this.count=200==t.response?t.count:0,this.dispatchEvent("countLoaded"),this.dispatchEvent("countChanged")})},fetchOne:function(t,e){let s={...this.request.get(),...t};s.f=this.basePath+".get",E.fetch(s).then(t=>{e(t)})},fetchDelete:function(t,e){let s={...this.request.get(),...t};s.f=this.basePath+".delete",E.fetch(s).then(t=>{e(t)})},fetchData:function(t){let e={...this.request.get(),...t};return"."==e.f[0]&&(e.f=this.basePath+e.f),E.fetch(e)},makeUrl:function(t){let e={...this.request.get(),...t};return"."==e.f[0]&&(e.f=this.basePath+e.f),E.makeUrl(e)}}),/*
**	Provides an interface to connect with a listing API function.
*/L=a.extend({className:"DataList",debounceDelay:250,request:null,eid:null,/*
	**	Constructs the data list with the specified optional `config` parameters, any of the properties of this object can be specified
	**	in the config. The given `f` parameter is passed directly as a request parameter to the API.
	*/__ctor:function(t,e=null){this._super.ModelList.__ctor(),null!==e&&Object.assign(this,e),this.request||(this.request={}),this.request.f=t,this.request=new o(this.request),this.eid=Math.random().toString().substr(2),this.dataList=this,this.request.addEventListener(this.eid+":propertyChanged",this.forwardRequestEvent,this)},forwardRequestEvent:function(t,e){this.prepareEvent("request"+t.name[0].toUpperCase()+t.name.substr(1),e).setSource(t.source).resume()},/*
	**	Executes a request to retrieve the data for the list (uses debounce to prevent too-quick refreshes).
	*/refresh:function(t=null,e=null){if(this._timeout&&(clearTimeout(this._timeout),this._timeout=null),!0===t){this.dispatchEvent("listLoading"),E.fetch(this.request.get()).then(t=>{this.setData(200==t.response?t.data:null),this.dispatchEvent("listLoaded"),this.dispatchEvent("listChanged"),null!==e&&e()});return}this._timeout=setTimeout(()=>{this.refresh(!0,t)},this.debounceDelay)}});/**
**	Collection of useful easing functions (imported from Cherry source code).
*/let C={/**
	**	Interpolates numeric values between two objects (`src` and `dst`) using the specified `duration` (in seconds) and `easing` function. Note
	**	that all four parameters `src`, `dst`, `duration` and `easing` must be objects having the same number of values.
	*/interpolate:function(t,e,s,n,o/* function(data, isFinished) */){let a={},r={},l=0;for(let e in t)a[e]=0,r[e]=t[e],l++;let h=Date.now()/1e3,c=0,u=function(){let d=Date.now()/1e3;for(let o in c=d-h,h=d,a){if(a[o]==s[o])continue;a[o]+=c,a[o]>=s[o]&&(a[o]=s[o],l--);let h=n[o](a[o]/s[o]);r[o]=(1-h)*t[o]+h*e[o]}o(r,0==l),0!=l&&requestAnimationFrame(u)};u()},/* ******************************************** */Linear:{IN:function(t){return t},OUT:function(t){return t},IN_OUT:function(t){return t}},/* ******************************************** */Back:{k:1.70158,IN:function(t,e){return void 0===e&&(e=C.Back.k),t*t*((e+1)*t-e)},OUT:function(t,e){return 1-C.Back.IN(1-t,e)},IN_OUT:function(t,e){return t<.5?C.Back.IN(2*t,e)/2:C.Back.OUT((t-.5)*2,e)/2+.5}},/* ******************************************** */Bounce:{getConst:function(t){return t<1/2.75?7.5625*t*t:t<2/2.75?7.5625*(t-=1.5/2.75)*t+.75:t<2.5/2.75?7.5625*(t-=2.25/2.75)*t+.9375:7.5625*(t-=2.625/2.75)*t+.984375},IN:function(t){return 1-C.Bounce.getConst(1-t)},OUT:function(t){return C.Bounce.getConst(t)},IN_OUT:function(t){return t<.5?(1-C.Bounce.getConst(1-2*t))/2:C.Bounce.getConst((t-.5)*2)/2+.5}},/* ******************************************** */Circ:{IN:function(t){return 1-Math.sqrt(1-t*t)},OUT:function(t){return 1-C.Circ.IN(1-t)},IN_OUT:function(t){return t<.5?C.Circ.IN(2*t)/2:C.Circ.OUT((t-.5)*2)/2+.5}},/* ******************************************** */Cubic:{IN:function(t){return t*t*t},OUT:function(t){return 1-C.Cubic.IN(1-t)},IN_OUT:function(t){return t<.5?C.Cubic.IN(2*t)/2:C.Cubic.OUT((t-.5)*2)/2+.5}},/* ******************************************** */Expo:{IN:function(t){return Math.pow(2,12*(t-1))},OUT:function(t){return-Math.pow(2,-12*t)+1},IN_OUT:function(t){return(t*=2)<1?Math.pow(2,12*(t-1))/2:(-Math.pow(2,-12*(t-1))+2)/2}},/* ******************************************** */Power:{p:12,IN:function(t){return Math.pow(t,C.Power.p)},OUT:function(t){return 1-C.Power.IN(1-t)},IN_OUT:function(t){return t<.5?C.Power.IN(2*t)/2:C.Power.OUT((t-.5)*2)/2+.5}},/* ******************************************** */Quad:{IN:function(t){return t*t},OUT:function(t){return 1-C.Quad.IN(1-t)},IN_OUT:function(t){return t<.5?C.Quad.IN(2*t)/2:C.Quad.OUT((t-.5)*2)/2+.5}},/* ******************************************** */Quartic:{IN:function(t){return t*t*t*t},OUT:function(t){return 1-C.Quartic.IN(1-t)},IN_OUT:function(t){return t<.5?C.Quartic.IN(2*t)/2:C.Quartic.OUT((t-.5)*2)/2+.5}},/* ******************************************** */Quintic:{IN:function(t){return t*t*t*t*t},OUT:function(t){return 1-C.Quintic.IN(1-t)},IN_OUT:function(t){return t<.5?C.Quintic.IN(2*t)/2:C.Quintic.OUT((t-.5)*2)/2+.5}},/* ******************************************** */Sine:{IN:function(t){return 1-Math.sin(1.5708*(1-t))},OUT:function(t){return Math.sin(1.5708*t)},IN_OUT:function(t){return-((Math.cos(3.1416*t)-1)/2)}},/* ******************************************** */Step:{IN:function(t){return 1!=t?0:1},OUT:function(t){return 1!=t?0:1},IN_OUT:function(t){return 1!=t?0:1}}},S=e.extend({list:null,initialData:null,data:null,stack:null,block:null,timeScale:1,time:0,blockTime:0,index:0,paused:!1,finished:!1,onFinishedCallback:null,onUpdatedCallback:null,__ctor:function(){this.list=[],this.initialData={},this.data={},this.stack=[],this.block=this.list,this.reset()},__dtor:function(){},clone:function(){let t=new S;return t.list=this.list,t.initialData=this.initialData,t.reset()},onFinished:function(t){return this.onFinishedCallback=t,this},onUpdated:function(t){return this.onUpdatedCallback=t,this},// Resets the animation to its initial state.
reset:function(){for(let t in this.stack.length=0,this.blockTime=0,this.time=0,this.index=0,this.block=this.list,this.paused=!0,this.finished=!1,this.handle=null,this.initialData)this.data[t]=this.initialData[t];return this},// Sets the initial data.
initial:function(t){return this.initialData=t,this.reset()},// Sets the time scale (animation speed).
speed:function(t){return this.timeScale=t>0?t:1,this},// Sets the output data object.
setOutput:function(t){return this.data=t,this},// Pauses the animation.
pause:function(){this.paused||(clearInterval(this.handle),this.paused=!0)},// Resumes the animation.
resume:function(){if(!this.paused)return;let t=Date.now()/1e3;this.handle=setInterval(()=>{let e=Date.now()/1e3,s=e-t;t=e,this.update(s),this.onUpdatedCallback&&this.onUpdatedCallback(this.data,this)},16),this.onUpdatedCallback&&this.onUpdatedCallback(this.data,this),this.paused=!1},// Updates the animation by the specified delta time (seconds).
update:function(e){let s,n,o;if(this.paused)return!1;if(this.index>=this.block.length)return!0;let a=0;for(this.time+=e*this.timeScale;this.index<this.block.length;){let r,l=this.block[this.index];switch(l.op){case"parallel":if(!1==l.started)for(a=0,l.blocks.length=0,l.started=!0;a<l.block.length;a++)l.blocks.push([l.block[a]]),l.indices[a]=0,l.blockTimes[a]=this.blockTime;s=this.block,n=this.index;let h=0,c=o=this.blockTime;for(a=0;a<l.blocks.length;a++)this.block=l.blocks[a],this.index=l.indices[a],this.blockTime=l.blockTimes[a],!0===this.update(0)&&h++,this.blockTime>c&&(c=this.blockTime),l.blockTimes[a]=this.blockTime,l.blocks[a]=this.block,l.indices[a]=this.index;if(this.block=s,this.index=n,this.blockTime=o,l.fn&&l.fn.call(this),h!=l.blocks.length)return!1;l.started=!1,this.blockTime=c,this.index++;break;case"serial":if(!1==l.started&&(l._block=l.block,l._index=0,l._blockTime=this.blockTime,l.started=!0),s=this.block,n=this.index,o=this.blockTime,this.block=l._block,this.index=l._index,this.blockTime=l._blockTime,a=this.update(0),l._block=this.block,l._index=this.index,l._blockTime=this.blockTime,this.block=s,this.index=n,this.blockTime=o,l.fn&&l.fn.call(this),!0!==a)return!1;l.started=!1,this.blockTime=l._blockTime,this.index++;break;case"repeat":if(!1==l.started&&(l._block=l.block,l._index=0,l._blockTime=this.blockTime,l._count=l.count,l.started=!0),s=this.block,n=this.index,o=this.blockTime,this.block=l._block,this.index=l._index,this.blockTime=l._blockTime,a=this.update(0),l._block=this.block,l._index=this.index,l._blockTime=this.blockTime,this.block=s,this.index=n,this.blockTime=o,l.fn&&l.fn.call(this),!0!==a)return!1;if(l._count<=1)return l.started=!1,this.blockTime=l._blockTime,this.index++,!1;return l._index=0,l._count--,!1;case"set":this.data[l.field]=l.value,this.index++;break;case"restart":this.index=0;break;case"wait":if(r="string"==t.typeOf(l.duration)?this.data[l.duration]:l.duration,this.time<this.blockTime+r)return!1;this.blockTime+=r,this.index++;break;case"range":if(!1==l.started&&(null===l.startValue?l._startValue=this.data[l.field]:l._startValue=l.startValue,l._endValue=l.endValue,l.started=!0),r="string"==t.typeOf(l.duration)?this.data[l.duration]:l.duration,e=this.time<this.blockTime+r?(this.time-this.blockTime)/r:1,l.easing&&1!=e?this.data[l.field]=l.easing(e)*(l._endValue-l._startValue)+l._startValue:this.data[l.field]=e*(l._endValue-l._startValue)+l._startValue,1!=e)return!1;l.started=!1,this.blockTime+=r,this.index++;break;case"rand":if(!1==l.started&&(l.started=!0,l.last=null),r="string"==t.typeOf(l.duration)?this.data[l.duration]:l.duration,e=this.time<this.blockTime+r?(this.time-this.blockTime)/r:1,l.easing&&1!=e?l.cur=~~(l.easing(e)*l.count):l.cur=~~(e*l.count),l.cur!=l.last){for(;(a=~~(Math.random()*(l.endValue-l.startValue+1))+l.startValue)==this.data[l.field];);this.data[l.field]=a,l.last=l.cur}if(1!=e)return!1;l.started=!1,this.blockTime+=r,this.index++;break;case"randt":if(r="string"==t.typeOf(l.duration)?this.data[l.duration]:l.duration,e=this.time<this.blockTime+r?(this.time-this.blockTime)/r:1,a=l.easing&&1!=e?l.easing(e)*(l.count-1):e*(l.count-1),this.data[l.field]=l.table[~~((a+l.count)%l.count)],1!=e)return!1;this.blockTime+=r,this.index++;break;case"play":l.snd.play(),this.index++;break;case"exec":l.fn.call(this,this),this.index++}}return this.block==this.list&&(this.finished||null==this.onFinishedCallback||this.onFinishedCallback(),this.pause(),this.finished=!0),!0},// Runs the subsequent commands in parallel. Should end the parallel block by calling end().
parallel:function(){let t=[];return this.block.push({op:"parallel",started:!1,block:t,blocks:[],indices:[],blockTimes:[]}),this.stack.push(this.block),this.block=t,this},// Runs the subsequent commands in series. Should end the serial block by calling end().
serial:function(){let t=[];return this.block.push({op:"serial",started:!1,block:t}),this.stack.push(this.block),this.block=t,this},// Repeats a block the specified number of times.
repeat:function(t){let e=[];return this.block.push({op:"repeat",started:!1,block:e,count:t}),this.stack.push(this.block),this.block=e,this},// Sets the callback of the current block.
callback:function(t){let e=this.stack[this.stack.length-1];return e[e.length-1].fn=t,this},// Ends a parallel(), serial() or repeat() block.
end:function(){return this.block=this.stack.pop(),this},// Sets the value of a variable.
set:function(t,e){return this.block.push({op:"set",field:t,value:e}),this},// Restarts the current block.
restart:function(t){return this.block.push({op:"restart"}),this},// Waits for the specified duration.
wait:function(t){return this.block.push({op:"wait",duration:t}),this},// Sets the range of a variable.
range:function(t,e,s,n,o){return this.block.push({op:"range",started:!1,field:t,duration:e,startValue:s,endValue:n,easing:o||null}),this},// Generates a certain amount of random numbers in the given range (inclusive).
rand:function(t,e,s,n,o,a){return this.block.push({op:"rand",started:!1,field:t,duration:e,count:s,startValue:n,endValue:o,easing:a||null}),this},// Generates a certain amount of random numbers in the given range (inclusive). This uses a static random table to determine the next values.
randt:function(t,e,s,n,o,a){let r=[];for(let t=0;t<s;t++)r.push(t%(o-n+1)+n);for(let t=s>>2;t>0;t--){let t=~~(Math.random()*s),e=~~(Math.random()*s),n=r[e];r[e]=r[t],r[t]=n}return this.block.push({op:"randt",field:t,duration:e,count:s,startValue:n,endValue:o,table:r,easing:a||null}),this},// Plays a sound.
play:function(t){return this.block.push({op:"play",snd:t}),this},// Executes a function.
exec:function(t){return this.block.push({op:"exec",fn:t}),this}});/*
    <r-tabs data-container="div.tab-container" data-base-route="@" data-initial="tab1">
        <a data-name="tab1">Tab-1</a>
        <a data-name="tab2">Tab-2</a>
        <a data-name="tab3">Tab-3</a>
    </r-tabs>

    <div class="tab-container">
        <div data-name="tab1">
            This is tab-1.
        </div>

        <div data-name="tab2">
            This is tab-2.
        </div>

        <div data-name="tab3">
            This is tab-3.
        </div>
    </div>

    .is-hidden {
        display: none;
    }

    r-tabs [data-name].is-active {
        font-weight: bold;
    }
*/var x=_.register("r-tabs",{/**
     * Container element for tab content.
     */container:null,/**
     * Active tab name.
     */activeTab:null,/**
    **	Element events.
    */"event click [data-name]":function(t){if(t.continuePropagation=!0,this.dataset.baseRoute){location="#"+b.realLocation(this.dataset.baseRoute.replace("@",t.source.dataset.name));return}this.selectTab(t.source.dataset.name)},/**
    **	Initializes the Tabs element.
    */init:function(){this._routeHandler=(t,e)=>{""!=b.location&&this.querySelectorAll("[href]").forEach(t=>{t.href&&(b.location.startsWith(t.href.substr(t.href.indexOf("#")+1))?(t.classList.add("is-active"),t.classList.remove("is-inactive")):(t.classList.add("is-inactive"),t.classList.remove("is-active")),t.classList.remove("anim-ended"),t.onanimationend=()=>{t.onanimationend=null,t.classList.add("anim-ended")})}),e.route.changed&&this.showTab(e.tabName)}},/**
    **	Executed when the children of the element are ready.
    */ready:function(){"container"in this.dataset?":previousElement"==this.dataset.container?this.container=this.previousElementSibling:":nextElement"==this.dataset.container?this.container=this.nextElementSibling:":none"==this.dataset.container?this.container=null:this.container=document.querySelector(this.dataset.container):this.container=this.nextElementSibling,this._hideTabsExcept(this.dataset.initial)},/**
    **	Adds a handler to Router if the data-base-route attribute was set.
    */onConnected:function(){this.dataset.baseRoute&&b.addRoute(this.dataset.baseRoute.replace("@",":tabName"),this._routeHandler)},/**
    **	Removes a handler previously added to Router if the data-base-route attribute was set.
    */onDisconnected:function(){this.dataset.baseRoute&&b.removeRoute(this.dataset.baseRoute.replace("@",":tabName"),this._routeHandler)},/**
    **	Hides all tabs except the one with the specified exceptName, if none specified then all tabs will be hidden (adds `.is-hidden` CSS class),
    **	additionally the respective link item in the tab definition will have class `.is-active`.
    */_hideTabsExcept:function(t){t||(t=""),null!=this.container&&this.container.querySelectorAll(":scope > [data-name]").forEach(e=>{e.dataset.name===t?(e.classList.remove("is-hidden"),this.dispatch("tabShown",{name:e.dataset.name,el:e})):(e.classList.add("is-hidden"),this.dispatch("tabHidden",{name:e.dataset.name,el:e}))}),this.querySelectorAll("[data-name]").forEach(e=>{e.dataset.name===t?(e.classList.add("is-active"),e.classList.remove("is-inactive")):(e.classList.add("is-inactive"),e.classList.remove("is-active")),e.classList.remove("anim-ended"),e.onanimationend=()=>{e.onanimationend=null,e.classList.add("anim-ended")}}),this.activeTab=t,this.dispatch("tabChanged",{name:t,el:this})},/**
    **	Shows the tab with the specified name, ignores `data-base-route` and current route as well.
    */showTab:function(t){return this._hideTabsExcept(t)},/**
    **	Shows a tab given its name. The route will be changed automatically if `data-base-route` is enabled.
    */selectTab:function(t){if(this.dataset.baseRoute){let e="#"+b.realLocation(this.dataset.baseRoute.replace("@",t));if(location.hash!=e){location=e;return}}this.showTab(t)}}),T=_.register("r-form",{/**
    **	Element events.
    */events:{"change [data-field]":"_fieldChanged","click input[type=reset]":"reset","click .reset":"reset","click input[type=submit]":"submit","click button[type=submit]":"submit","click .submit":"submit","submit form":"submit"},/*
    **	Initial form model.
    */model:{},/**
    **	Executed when the children of the element are ready.
    */ready:function(){let t=document.createElement("form");t.append(...this.childNodes),this.append(t);let e={},s=this.model.get();for(let t in this.querySelectorAll("[data-field]").forEach(t=>{t.name=t.dataset.field,s[t.name]=t.type;let n=t.dataset.default;if(void 0==n)switch(t.type){case"radio":if(!t.checked)return;n=t.value;break;case"checkbox":n=t.checked?"1":"0";break;case"field":n=t.getValue();break;default:n=""}e[t.dataset.field]=n}),s)t in e?s[t]=e[t]:s[t]="";e=s,this.model.defaults=e,this.model.reset(),this.clearMarkers()},/*
    **	Transforms an string returned by the server to a local representation.
    */filterString:function(t,e){return t&&"messages"in g&&t.startsWith("@messages.")&&t.substr(10) in g.messages&&(t=c.eval(g.messages[t.substr(10)],e)),t},_change:function(t){if("createEvent"in document){let e=document.createEvent("HTMLEvents");e.initEvent("change",!1,!0),t.dispatchEvent(e)}else t.fireEvent("onchange")},_setField:function(t,e,s){if(t)for(t of this.querySelectorAll('[data-field="'+t+'"]'))switch(t.type||t.tagName.toLowerCase()){case"select":t.val=t.dataset.value=t.multiple&&e?e.split(","):e,t.value=t.val=t.dataset.value,!0!==s&&this._change(t);break;case"checkbox":t.checked=!!parseInt(e);break;case"radio":t.checked=e==t.value;break;case"field":t.val=t.dataset.value=e,t.setValue(e);break;case"file":e instanceof File||e instanceof Blob?(t.val=e,t.dataset.value=e):e instanceof FileList?(t.val=e,t.dataset.value=e):(t.val=t.dataset.value="",t.value="");break;default:t.val=t.dataset.value=e,t.value=e,!0!==s&&this._change(t)}},_getField:function(t,e=null,s=!1){if(!t)return null;if("string"!=typeof t){let n=null==t.value?t.val:t.value;switch(null===n&&(n=e),t.type||t.tagName.toLowerCase()){case"select":e=t.multiple&&n?n.join(","):n;break;case"checkbox":e=t.checked?"1":"0";break;case"radio":t.checked&&(e=t.value);break;case"field":e=t.getValue();break;case"file":e=s?t.files&&t.files.length?t.multiple?t.files:t.files[0]:null:t.val;break;default:e=n}return null===e?"":e}for(t of(e=null,this.querySelectorAll('[data-field="'+t+'"]')))e=this._getField(t,e);return null===e?"":e},getField:function(t){return this._getField(t)},clearMarkers:function(){this.classList.remove("busy"),this.querySelectorAll(".message").forEach(t=>t.classList.add("is-hidden")),this.querySelectorAll("span.field-error").forEach(t=>t.remove()),this.querySelectorAll(".field-error").forEach(t=>{t.classList.remove("field-error"),t.classList.remove("is-invalid")}),this.querySelectorAll(".field-passed").forEach(t=>t.classList.remove("field-passed"))},_fieldChanged:function(t){let e=t.source;"file"==e.type?this.model.set(e.dataset.field,this._getField(e,null,!0),!0):this.model.set(e.dataset.field,this._getField(e)),t.continuePropagation=!0},onModelPropertyChanged:function(t,e){this._setField(e.name,e.value)},_onSuccess:function(t){let e;this.classList.remove("busy"),this.clearMarkers(),this.dispatch("formSuccess",t),t.message&&null!=(e=this.querySelector(".message.success"))&&(e.innerHTML=this.filterString(t.message,t).replace(/\n/g,"<br/>"),e.classList.remove("is-hidden"),e.onanimationend=()=>e.classList.add("is-hidden"))},_onFailure:function(t){let e;if(this.classList.remove("busy"),this.clearMarkers(),this.dispatch("formError",t),t.fields){for(let e in t.fields){let s=this.querySelector('[data-field-container="'+e+'"]');if(!s&&!(s=this.querySelector('[data-field="'+e+'"]')))continue;let n=document.createElement("span");n.classList.add("field-error"),n.innerHTML=this.filterString(t.fields[e],t).replace(/\n/g,"<br/>"),s.classList.add("field-error"),s.classList.add("is-invalid"),"bottom"==this.dataset.errorsAt?s.parentElement.append(n):"top"==this.dataset.errorsAt?s.parentElement.prepend(n):s.parentElement.insertBefore(n,s.nextElementSibling),setTimeout(function(t){return function(){t.classList.add("active")}}(n),25)}t.error&&null!=(e=this.querySelector(".message.error"))&&(e.innerHTML=this.filterString(t.error,t).replace(/\n/g,"<br/>"),e.classList.remove("is-hidden"),e.onanimationend=()=>e.classList.add("is-hidden"))}else null!=(e=this.querySelector(".message.error"))&&(e.innerHTML=this.filterString(t.error,t).replace(/\n/g,"<br/>")||"Error: "+t.response,e.classList.remove("is-hidden"),e.onanimationend=()=>e.classList.add("is-hidden"))},reset:function(t){if(this.model.reset(t),this.clearMarkers(),!1===t)for(var e in this.model.data)this._setField(e,this.model.data[e],!0);return!1},submit:function(){if(this.classList.contains("busy"))return;let t={};"false"==this.dataset.strict&&Object.assign(t,this.model.get());let e={};this.querySelectorAll("[data-field]").forEach(t=>e[t.dataset.field]=!0),Object.keys(e).forEach(e=>t[e]=this._getField(e)),this.dispatch("beforeSubmit",t),this.model.set(t);let s=this.dataset.formAction||this.formAction;s&&(this.classList.add("busy"),"function"!=typeof s?(t.f=s,E.apiCall(t,t=>this[200==t.response?"_onSuccess":"_onFailure"](t),t=>this._onFailure({error:"Unable to execute request."}),this.dataset.method??"POST")):s(t,t=>this[200==t.response?"_onSuccess":"_onFailure"](t)))}}),P=_.register("r-panel",{/**
     * Route object used by this element.
     */route:null,/**
     * Initializes the element.
     */init:function(){this.style.display="",// Executed then the panel route is activated.
this._onActivate=(t,e)=>{e.route.changed&&this.show(!0)},// Executed then the panel route is deactivated.
this._onDeactivate=(t,e)=>{this.hide()},this.hide()},/**
     * Adds a handler to Router if the data-route attribute was set.
     */onConnected:function(){this.dataset.route?(this.route=b.addRoute(this.dataset.route,this._onActivate,this._onDeactivate),this.classList.remove("is-active"),this.classList.add("is-inactive")):(this.classList.add("is-active"),this.classList.remove("is-inactive")),this.classList.add("anim-ended")},/**
     * Removes a handler previously added to Router if the data-route attribute was set.
     */onDisconnected:function(){this.dataset.route&&b.removeRoute(this.dataset.route,this._onActivate,this._onDeactivate)},/**
     * Hides the panel by removing the `is-active` and adding `is-inactive` class to the element. Fires `panelHidden` event.
     */hide:function(){this.dispatch("panelHidden",this.route?this.route.args:{}),this.classList.remove("anim-ended"),this.classList.remove("is-active"),this.classList.add("is-inactive"),this.onanimationend=()=>{this.classList.add("anim-ended"),this.onanimationend=null}},/**
     * Shows the panel visible by adding `is-active` and removing `is-inactive` class from the element. If `silent` is true and `data-route` enabled,
     * the current route will not be updated. Fires `panelShown` event.
     * @param {boolean} silent 
     */show:function(t=!1){if(this.dataset.route&&!t){let t="#"+this.dataset.route;if(window.location.hash.substr(0,t.length)!=t){window.location=t;return}}this.dispatch("panelShown",this.route?this.route.args:{}),this.classList.remove("anim-ended"),this.classList.remove("is-inactive"),this.classList.add("is-active"),this.onanimationend=()=>{this.classList.add("anim-ended"),this.onanimationend=null}},/**
     * Toggles the visibility of the panel. If `silent` is true and `data-route` enabled, the current route will not be updated.
     */toggleVisibility:function(t=!1){this.classList.contains("is-active")?this.hide():this.show(t)}}),/*
**	Connects to a ModelList and renders its contents using a template. When using "dynamic" template, the contents can be other custom elements, and
**	the model of each item can be accessed by using data-model=":list-item", which will cause the item model to be added to the element.
**
**	Additionally root attribute data-wrap can be set to 'true' to wrap the template contents inside a div with a data-iid representing the ID of the
**	item, this will cause any changes to items to affect only the specific item in question.
*/A=_.register("r-list",{list:null,container:null,template:null,isEmpty:!1,isDynamicTemplate:!1,/**
    **	Executed when the children of the element are ready.
    */ready:function(){this.container=this.querySelector(this.dataset.container||".x-data"),this.container||(this.container=document.createElement("div"),this.container.className="x-data",this.appendChild(this.container));let t=this.template_elem=this.querySelector("template");t?("dynamic"!=t.dataset.mode?this.template=c.compile(t.innerHTML):(this.template=()=>t.innerHTML,this.isDynamicTemplate=!0),t.remove()):this.template=()=>"",this.container.textContent=" ",this.setEmpty(null),this.setLoading(null)},/**
    **	Executed when the children of the element are ready.
    */rready:function(){let t=this.dataList??this.getFieldByPath(this.dataset.list);if(!t){this.dataset.list&&console.error("data-list not found: "+this.dataset.list);return}this.setList(t)},/*
    **	Indicates if the list is empty. Elements having x-empty, x-not-empty and x-empty-null will be updated.
    */setEmpty:function(t){this.isEmpty!==t&&(!0===t?(this.querySelectorAll(".x-empty").forEach(t=>t.classList.remove("is-hidden")),this.querySelectorAll(".x-not-empty").forEach(t=>t.classList.add("is-hidden")),this.querySelectorAll(".x-empty-null").forEach(t=>t.classList.add("is-hidden"))):!1===t?(this.querySelectorAll(".x-empty").forEach(t=>t.classList.add("is-hidden")),this.querySelectorAll(".x-not-empty").forEach(t=>t.classList.remove("is-hidden")),this.querySelectorAll(".x-empty-null").forEach(t=>t.classList.add("is-hidden"))):(this.querySelectorAll(".x-empty").forEach(t=>t.classList.add("is-hidden")),this.querySelectorAll(".x-not-empty").forEach(t=>t.classList.add("is-hidden")),this.querySelectorAll(".x-empty-null").forEach(t=>t.classList.remove("is-hidden"))),this.isEmpty=t)},/*
    **	Indicates if the list is loading. Elements having is-loading will be updated.
    */setLoading:function(t){!0===t?this.querySelectorAll(".is-loading").forEach(t=>t.classList.remove("is-hidden")):this.querySelectorAll(".is-loading").forEach(t=>t.classList.add("is-hidden"))},/**
    **	Sets the list model-list of the element.
    */setList:function(e){e&&t.isInstanceOf(e,a)&&this.list!==e&&(null!=this.list&&(this.list.dataSource&&this.list.dataSource.removeEventListener(this.eid+":*"),this.list.dataList&&this.list.dataList.removeEventListener(this.eid+":*"),this.list.removeEventListener(this.eid+":*")),this.list=e,this.list.dataSource&&(this.list.dataSource.addEventListener(this.eid+":listLoading",this.onLoading,this),this.list.dataSource.addEventListener(this.eid+":listLoaded",this.onLoaded,this)),this.list.dataList&&(this.list.dataList.addEventListener(this.eid+":listLoading",this.onLoading,this),this.list.dataList.addEventListener(this.eid+":listLoaded",this.onLoaded,this)),this.list.addEventListener(this.eid+":itemsCleared",this.onItemsCleared,this),this.list.addEventListener(this.eid+":itemsChanged",this.onItemsChanged,this),this.list.addEventListener(this.eid+":itemRemoved",this.onItemRemoved,this),this.list.addEventListener(this.eid+":itemChanged",this.onItemChanged,this),this.list.addEventListener(this.eid+":itemAdded",this.onItemAdded,this))},/*
    **	Builds an item (inside a div) to be added to the container.
    */buildItem:function(t,e,s=!1){if(this.content){let s=this.content(e.get(),e);return s.dataset.iid=t,s}if(this.container.content){let s=this.container.content(e.get(),e);return s.dataset.iid=t,s}let n=this.template(e.get());if(s)return n;let o=document.createElement("div");for(let s of(o.dataset.iid=t,o.innerHTML=n,o.querySelectorAll('[data-model=":list-item"]').forEach(t=>{t.model=e,t.dataset.model="this.model"}),this.template_elem.attributes))s.nodeName.startsWith("data-_")||"data-mode"==s.nodeName||o.setAttribute(s.nodeName,s.nodeValue);return o},/*
    **	Executed when the list is loading.
    */onLoading:function(){this.setLoading(!0)},/*
    **	Executed when the list finished loading.
    */onLoaded:function(){this.setLoading(!1)},/*
    **	Executed when the list is cleared.
    */onItemsCleared:function(){this.container._timeout=setTimeout(()=>{this.setEmpty(!0),this.container._timeout=null,this.container.textContent=""},300)},/*
    **	Executed when the items of the list changed.
    */onItemsChanged:function(){if(0==this.list.length())return;this.container._timeout&&clearTimeout(this.container._timeout),this.container._timeout=null,this.container.textContent="";let t=0;for(let e of this.list.getData())"false"!=this.dataset.wrap?this.container.append(this.buildItem(this.list.itemId[t++],e)):this.container.innerHTML+=this.buildItem(this.list.itemId[t++],e,!0);this.setEmpty(0==t)},/*
    **	Executed when an item is removed from the list.
    */onItemRemoved:function(t,e){if("false"==this.dataset.wrap){this.onItemsChanged();return}let s=this.container.querySelector('[data-iid="'+e.id+'"]');s&&(s.remove(),this.setEmpty(0==this.list.length()))},/*
    **	Executed when an item changes.
    */onItemChanged:function(t,e){if(this.isDynamicTemplate)return;if("false"==this.dataset.wrap){this.onItemsChanged();return}let s=this.container.querySelector('[data-iid="'+e.id+'"]');s&&(s.innerHTML=this.template(e.item))},/*
    **	Executed when an item is added to the list.
    */onItemAdded:function(t,e){"head"==e.position?"false"!=this.dataset.wrap?this.container.prepend(this.buildItem(e.id,e.item)):this.container.innerHTML=this.buildItem(e.id,e.item,!0)+this.container.innerHTML:"false"!=this.dataset.wrap?this.container.append(this.buildItem(e.id,e.item)):this.container.innerHTML+=this.buildItem(e.id,e.item,!0),this.setEmpty(!1)},/**
     * 	Forces re-rendering of the element.
     */refresh:function(){this.onItemsChanged()}}),R=_.register("r-item",{/**
    **	Initializes the element.
    */init:function(){},/**
    **	Executed when the children and root are ready.
    */rready:function(){let t=this.dataModel??this.getFieldByPath(this.dataset.model);t||(t={}),this.setModel(t)}}),/*
**	Connects to a data source to provide pagination features.
*/w=_.register("r-paginator",{source:null,template:null,/**
    **	Initializes the element.
    */init:function(){this.setModel({offsetStart:0,offsetEnd:0,count:0,offset:0,currentPageSize:this.dataset.pageSize||25,pageSize:this.dataset.pageSize||25}),this.listen("propertyChanged.pageSize",(t,e)=>{this.model.get("currentPageSize")!=e.value&&(this.model.set("currentPageSize",e.value),this.updateOffset("range"))})},rready:function(){let t=this.dataSource??this.getFieldByPath(this.dataset.source);if(!t){this.dataset.source&&console.error("data-source not found: "+this.dataset.source);return}this.setSource(t)},/**
    **	Sets the source model-list of the paginator.
    */setSource:function(e){e&&t.isInstanceOf(e,k)&&this.source!==e&&(null!=this.source&&(this.source.removeEventListener(this.eid+":*"),this.source.includeCount=!1),this.source=e,this.source.includeCount=!0,this.updateOffset(),this.source.addEventListener(this.eid+":requestPropertyChanged",this.onRequestPropertyChanged,this),this.source.addEventListener(this.eid+":countChanged",this.onCountChanged,this),this.source.addEventListener(this.eid+":listItemRemoved",this.onItemRemoved,this),this.source.addEventListener(this.eid+":listItemAdded",this.onItemAdded,this),this.source.setNamespace(this.eid),this.source.request.update(!0),this.source.setNamespace(null))},/*
    **	Updates several offset related fields in the paginator model. Optionally refreshes the data source with the specified mode.
    */updateOffset:function(t=null){this.model.set("offsetStart",0!=this.model.get("count")?this.model.get("offset")+1:0),this.model.set("offsetEnd",Math.min(this.model.get("count"),this.model.get("offsetStart")+this.model.getInt("pageSize")-1)),this.model.update("count");let e=this.source.request.get("count"),s=this.source.request.get("offset");this.source.request.set("count",this.model.getInt("pageSize")),this.source.request.set("offset",this.model.get("offset")),t&&(e!=this.source.request.get("count")||s!=this.source.request.get("offset"))&&this.source.refresh(t)},/*
    **	Event handler invoked when a property of the source request changes. The property is copied to the local model.
    */onRequestPropertyChanged:function(t,e){"count"!=e.name&&"offset"!=e.name&&this.model.set(e.name,e.value)},/*
    **	Event handler invoked when a property of the model has changed. The property is copied to the data source request model.
    */onModelPropertyChanged:function(t,e){-1==["offsetStart","offsetEnd","count","offset","currentPageSize","pageSize"].indexOf(e.name)&&this.source.request.get(e.name)!=e.value&&(this.source.request.set(e.name,e.value),this.source.refresh("filter"))},/*
    **	Executed when the remote count changes.
    */onCountChanged:function(t,e){this.model.set("count",t.source.count,!1),this.updateOffset()},/*
    **	Executed when an item is removed from the list.
    */onItemRemoved:function(t,e){this.model.set("count",this.model.getInt("count")-1,!1),this.updateOffset()},/*
    **	Executed when an item is added to the list.
    */onItemAdded:function(t,e){this.model.set("count",this.model.getInt("count")+1,!1),this.updateOffset()},/*
    **	Moves to the previous page.
    */prevPage:function(){if(0>=this.model.get("offset"))return;let t=this.model.get("offset")-this.model.getInt("pageSize");t<0&&(t=0),this.model.set("offset",t),this.updateOffset("range")},/*
    **	Moves to the next page.
    */nextPage:function(){let t=this.model.get("offset")+this.model.getInt("pageSize");t>=this.model.get("count")||(this.model.set("offset",t),this.updateOffset("range"))},/*
    **	Moves to the first page.
    */firstPage:function(){this.model.set("offset",0),this.updateOffset("range")},/*
    **	Moves to the last page.
    */lastPage:function(){let t=this.model.get("count")-this.model.getInt("pageSize");t<0&&(t=0),this.model.set("offset",t),this.updateOffset("range")},/*
    **	Refreshes the data source.
    */refresh:function(){this.source.refresh("full")},/*
    **	Clears (set to empty) the specified fields from the data source's request parameters.
    */clear:function(t){for(let e=0;e<t.length;e++)this.model.set(t[e],"")}}),/*
**	Connects to a DataSource and renders its contents as a table.
*/O=_.register("r-table",{source:null,template:null,container:null,isEmpty:null,/**
    **	Initializes the element.
    */init:function(){this.setModel({})},/**
    **	Executed when the children of the element are ready.
    */ready:function(){if(this.container=this.querySelector(this.dataset.container||"tbody.x-data"),!this.container)throw Error("r-table requires a container");"dynamic"!=this.container.dataset.mode?this.template=c.compile(this.container.innerHTML):this.template=()=>this.container.innerHTML,this.temporalBody=document.createElement("tbody"),this.container.textContent=" ",this.setEmpty(!0)},/**
    **	Executed when the children and root elements are ready.
    */rready:function(){let t=this.dataSource??this.getFieldByPath(this.dataset.source);if(!t){this.dataset.source&&console.error("data-source not found: "+this.dataset.source);return}this.setSource(t)},/*
    **	Indicates if the table is empty. Elements having .x-not-empty will be hidden.
    */setEmpty:function(t){this.isEmpty!==t&&(t?(this.querySelectorAll(".x-empty").forEach(t=>t.classList.remove("is-hidden")),this.querySelectorAll(".x-not-empty").forEach(t=>t.classList.add("is-hidden"))):(this.querySelectorAll(".x-empty").forEach(t=>t.classList.add("is-hidden")),this.querySelectorAll(".x-not-empty").forEach(t=>t.classList.remove("is-hidden"))),this.isEmpty=t)},/**
    **	Sets the data source of the element.
    */setSource:function(e){e&&t.isInstanceOf(e,k)&&this.source!==e&&(null!=this.source&&this.source.removeEventListener(this.eid+":*"),this.source=e,this.source.addEventListener(this.eid+":requestPropertyChanged",this.onRequestPropertyChanged,this),this.source.addEventListener(this.eid+":listItemsCleared",this.onItemsCleared,this),this.source.addEventListener(this.eid+":listItemsChanged",this.onItemsChanged,this),this.source.addEventListener(this.eid+":listItemRemoved",this.onItemRemoved,this),this.source.addEventListener(this.eid+":listItemChanged",this.onItemChanged,this),this.source.addEventListener(this.eid+":listItemAdded",this.onItemAdded,this),this.source.setNamespace(this.eid),this.source.request.update(!0),this.source.setNamespace(null))},/*
    **	Event handler invoked when a property of the source request changes. The property is copied to the local model.
    */onRequestPropertyChanged:function(t,e){if(this.model.set(e.name,e.value),"sort"==e.name)this.querySelectorAll("thead [data-sort]").forEach(t=>t.dataset.order="");else if("order"==e.name){let s=this.querySelector('thead [data-sort="'+t.source.get("sort")+'"]');s&&(s.dataset.order=e.value)}},/*
    **	Event handler invoked when a property of the model has changed. The property is copied to the data source request model.
    */onModelPropertyChanged:function(t,e){this.source.request.get(e.name)!=e.value&&(this.source.request.set(e.name,e.value),-1==["count","offset"].indexOf(e.name)&&this.source.refresh("filter"))},/*
    **	Event handler invoked when a property of the model is removed.
    */onModelPropertyRemoved:function(t,e){"string"==typeof e.fields?this.source.request.remove(i):e.fields.forEach(t=>this.source.request.remove(t)),this.source.refresh("filter")},/*
    **	Builds an item to be added to the container.
    */buildItem:function(t,e){if(this.container.content){let s=this.container.content(e.get(),e);return s.dataset.iid=t,s}let s=this.temporalBody;return s.innerHTML=this.template(e.get()),s.querySelectorAll('[data-model=":list-item"]').forEach(t=>{t.model=e,t.dataset.model="this.model"}),(s=s.firstElementChild).dataset.iid=t,s},/*
    **	Executed when the list is cleared.
    */onItemsCleared:function(t,e){this.container._timeout=setTimeout(()=>{this.setEmpty(!0),this.container._timeout=null,this.container.textContent=""},300)},/*
    **	Executed when the items of the list changed.
    */onItemsChanged:function(t,e){if(0==this.source.list.length())return;this.container._timeout&&clearTimeout(this.container._timeout),this.container._timeout=null,this.container.textContent="";let s=0;for(let t of this.source.list.getData())this.container.append(this.buildItem(this.source.list.itemId[s++],t));this.setEmpty(0==s)},/*
    **	Executed when an item is removed from the list.
    */onItemRemoved:function(t,e){let s=this.container.querySelector('[data-iid="'+e.id+'"]');s&&(s.remove(),this.setEmpty(0==this.source.list.length()))},/*
    **	Executed when an item changes.
    */onItemChanged:function(t,e){let s=this.container.querySelector('[data-iid="'+e.id+'"]');if(!s)return;let n=this.buildItem(e.id,e.item);this.container.replaceChild(n,s)},/*
    **	Executed when an item is added to the list.
    */onItemAdded:function(t,e){"head"==e.position?this.container.prepend(this.buildItem(e.id,e.item)):this.container.append(this.buildItem(e.id,e.item)),this.setEmpty(!1)},/*
    **	Handles clicks to data-sort elements.
    */"event click thead [data-sort]":function(t,e){this.source.request.get("sort")==t.source.dataset.sort?this.source.request.set("order","asc"==this.source.request.get("order")?"desc":"asc"):(this.source.request.set("sort",t.source.dataset.sort),this.source.request.set("order","asc",!0)),this.source.refresh("order")},/*
    **	Refreshes the data source.
    */refresh:function(){this.source.refresh("full")},/*
    **	Clears (set to empty) the specified fields from the data source's request parameters.
    */clear:function(t){for(let e=0;e<t.length;e++)this.model.set(t[e],"")}}),/*
**	Connects to a ModelList and renders its contents as a <select> element.
*/I=_.register("r-select",{list:null,container:null,value:"",/**
    **	Initializes the element.
    */init:function(){this.container=document.createElement("select"),this.parentElement.insertBefore(this.container,this);let t=[];for(let e of this.attributes)e.nodeName.startsWith("data-_")||"data-list"==e.nodeName||"data-blank"==e.nodeName||(this.container.setAttribute(e.nodeName,e.nodeValue),t.push(e.nodeName));this.disabled&&(this.container.disabled=this.disabled),t.forEach(t=>this.removeAttribute(t)),this.textContent=" ",this.style.display="none"},/**
    **	Executed when the children and parent of the element are ready.
    */rready:function(){let t=this.dataList??this.getFieldByPath(this.dataset.list);if(!t){this.dataset.list&&console.error("data-list not found: "+this.dataset.list);return}this.setList(t),this.parentElement.lastElementChild!==this&&this.parentElement.append(this)},/**
    **	Sets the list model-list of the element.
    */setList:function(e){e&&t.isInstanceOf(e,a)&&this.list!==e&&(null!=this.list&&this.list.removeEventListener(this.eid+":*"),this.list=e,this.list.dataSource&&(this.list.dataSource.includeEnum=!0),this.list.addEventListener(this.eid+":itemsCleared",this.onItemsCleared,this),this.list.addEventListener(this.eid+":itemsChanged",this.onItemsChanged,this),this.list.addEventListener(this.eid+":itemRemoved",this.onItemsChanged,this),this.list.addEventListener(this.eid+":itemChanged",this.onItemsChanged,this),this.list.addEventListener(this.eid+":itemAdded",this.onItemsChanged,this),this.onItemsChanged())},/*
    **	Executed when the list is cleared.
    */onItemsCleared:function(t,e){this.container.textContent=""},/*
    **	Executed when the items of the list changed.
    */onItemsChanged:function(t,e){if(0==this.list.length())return;let s=this.list.getData(),n,o,a="";if(s[0].has("value")?n="value":s[0].has("id")&&(n="id"),s[0].has("label")?o="label":s[0].has("name")&&(o="name"),"blank"in this.dataset&&(a+='<option value="">'+this.dataset.blank+"</option>"),s[0].has("group")){let t={};for(let e in s.forEach(e=>t[e.get("group")]=null),t)t[e]={name:e,list:[]};s.forEach(e=>t[e.get("group")].list.push(e)),(t=Object.values(t)).forEach(t=>{a+='<optgroup label="'+t.name+'">',t.list.forEach(t=>a+='<option value="'+t.get(n)+'">'+t.get(o)+"</option>"),a+="</optgroup>"})}else s.forEach(t=>a+='<option value="'+t.get(n)+'">'+t.get(o)+"</option>");this.container.innerHTML=a,this.container.value=this.container.dataset.value},/**
     * 	Forces re-rendering of the element.
     */refresh:function(){this.onItemsChanged()}});/*
    <r-image-cropper>
    </r-image-cropper>
*/let N={/**
     * Forces the browser to show a download dialog.
     * @param {string} filename
     * @param {string} url
     */showDownload:function(t,e){let s=document.createElement("a");s.href=e,s.style.display="none",s.download=t,s.target="_blank",document.body.appendChild(s),s.click(),document.body.removeChild(s)},/**
     * Forces the browser to show a file selection dialog.
     * @param {boolean} allowMultiple
     * @param {string} accept 
     * @param {function(File[])} callback 
     */showFilePicker:function(t,e,s){let n=document.createElement("input");n.type="file",n.accept=e,n.style.display="none",n.multiple=t,document.body.appendChild(n),n.onchange=function(){s(n.files)},document.body.onfocus=function(){document.body.onfocus=null,document.body.removeChild(n)},n.click()},/**
     * Loads a file or blob and returns the content as a dataURL.
     * @param {File|Blob} file
     * @param {function(string)} callback
     */loadAsDataUrl:function(t,e){let s=new FileReader;s.onload=function(t){e(t.target.result,null)},s.onerror=function(t){e(null,t)},s.readAsDataURL(t)},/**
     * Loads a file or blob and returns the content as text.
     * @param {File|Blob} file
     * @param {function(string)} callback
     */loadAsText:function(t,e){let s=new FileReader;s.onload=function(t){e(t.target.result)},s.readAsText(t)},/**
     * Loads a file or blob and returns the content as array buffer.
     * @param {File|Blob} file
     * @param {function(ArrayBuffer)} callback
     */loadAsArrayBuffer:function(t,e){let s=new FileReader;s.onload=function(t){e(t.target.result)},s.readAsArrayBuffer(t)},/**
     * Loads a list of files or blobs and returns the content as dataURLs.
     * @param {Array<File|Blob>} fileList
     * @param {function([{ name:string, size:number, url:string }])} callback
     */loadAllAsDataUrl:function(t,e){let s=[];if(!t||!t.length){e(s);return}let n=function(o){if(o==t.length){e(s);return}N.loadAsDataUrl(t[o],function(e,a){a||s.push({name:t[o].name,size:t[o].size,url:e}),n(o+1)})};n(0)},/**
     * Loads an image from a url and returns it as an Image object.
     * @param {string} url
     * @param {function(Image)} callback
     */loadImageFromUrl:function(t,e){let s=new Image;s.onload=()=>e(s),s.onerror=()=>e(null),s.src=t}};var q=_.register("r-image-cropper",{/*
    **	Default aspect ratio.
    */aspectRatio:1,/*
    **	Current image scale.
    */imageScale0:0,imageScale:1,/*
    **	Image translation offsets.
    */imageOffsX:0,imageOffsY:0,/*
    **	Pointer contexts.
    */pointerA:null,pointerB:null,/*
    **	Client bounding box.
    */bounds:null,/*
    **	Initializes the element.
    */init:function(){this.canvas=document.createElement("canvas"),this.appendChild(this.canvas),this.g=this.canvas.getContext("2d"),this.pointerA={id:null,active:!1,sx:0,sy:0,cx:0,cy:0,ix:0,iy:0},this.pointerB={id:null,active:!1,sx:0,sy:0,cx:0,cy:0,ix:0,iy:0},this.log=document.createElement("div"),this.appendChild(this.log)},/*
    **	Sets the image for the cropper from an image URL.
    */setImageUrl:function(t){N.loadImageFromUrl(t,t=>{this.setImage(t)})},/*
    **	Sets the image for the cropper from an HTML File object.
    */setImageFile:function(t){N.loadAsDataUrl(t,t=>{N.loadImageFromUrl(t,t=>{this.setImage(t)})})},/*
    **	Sets the cropper image from an HTML Image element.
    */setImage:function(t){this.image=t,this.reset(),this.imageScale=Math.max(this.canvas.width/this.image.width,this.canvas.height/this.image.height),this.imageOffsX=(this.canvas.width-this.imageScale*this.image.width)*.5,this.imageOffsY=(this.canvas.height-this.imageScale*this.image.height)*.5,this.render()},/*
    **	Returns the blob and URL representing the current canvas state.
    */getBlobAndUrl:function(t,e="image/png",s=.9){this.canvas.toBlob(e=>{t(e,URL.createObjectURL(e))},e,s)},/*
    **	Auto-resizes the canvas to ensure the aspect ratio is maintained.
    */reset:function(){this.bounds=this.getBoundingClientRect(),this.canvas.width=this.bounds.width,this.canvas.height=this.bounds.width/this.aspectRatio},/*
    **	Auto-resizes the canvas to ensure the aspect ratio is maintained and renders the image.
    */render:function(){this.canvas.width=this.canvas.width,this.g.fillStyle="#000",this.g.beginPath(),this.g.rect(0,0,this.canvas.width,this.canvas.height),this.g.fill(),this.g.translate(this.imageOffsX,this.imageOffsY),this.g.scale(this.imageScale,this.imageScale),this.g.drawImage(this.image,0,0)},/*
    **	Translates the image by the given offsets.
    */translateImage:function(t,e){this.imageOffsX+=t,this.imageOffsY+=e,this.render(!0)},/*
    **	Handle mouse events on the canvas.
    */"event mousemove canvas":function(t){this.pointerA.active&&(this.pointerA.cx=t.clientX,this.pointerA.cy=t.clientY,this.translateImage(this.pointerA.cx-this.pointerA.sx,this.pointerA.cy-this.pointerA.sy),this.pointerA.sx=this.pointerA.cx,this.pointerA.sy=this.pointerA.cy),this.pointerA.ix=(t.clientX-this.bounds.left-this.imageOffsX)/this.imageScale,this.pointerA.iy=(t.clientY-this.bounds.top-this.imageOffsY)/this.imageScale},"event mousedown canvas":function(t){this.pointerA.active=!0,this.pointerA.sx=t.clientX,this.pointerA.sy=t.clientY},"event mouseup canvas":function(t){this.pointerA.active=!1},"event wheel canvas":function(t){t.deltaY>0?this.imageScale-=.045:this.imageScale+=.045,this.imageScale<.1&&(this.imageScale=.1),this.imageOffsX+=-this.pointerA.ix*this.imageScale+(t.clientX-this.bounds.left)-this.imageOffsX,this.imageOffsY+=-this.pointerA.iy*this.imageScale+(t.clientY-this.bounds.top)-this.imageOffsY,this.render()},/*
    **	Handle touch events on the canvas.
    */"event touchmove canvas":function(t){for(let e of t.changedTouches)this.pointerA.id==e.identifier?(this.pointerA.cx=e.clientX,this.pointerA.cy=e.clientY):this.pointerB.id==e.identifier&&(this.pointerB.cx=e.clientX,this.pointerB.cy=e.clientY);if(this.pointerA.active&&this.pointerB.active){let t=Math.sqrt(Math.pow(this.pointerA.sx-this.pointerB.sx,2)+Math.pow(this.pointerA.sy-this.pointerB.sy,2)),e=Math.sqrt(Math.pow(this.pointerA.cx-this.pointerB.cx,2)+Math.pow(this.pointerA.cy-this.pointerB.cy,2));this.imageScale+=(e-t)/10*.025,this.imageScale<.1&&(this.imageScale=.1),this.imageOffsX+=-this.pointerA.ix*this.imageScale+(this.pointerA.cx-this.bounds.left)-this.imageOffsX,this.imageOffsY+=-this.pointerA.iy*this.imageScale+(this.pointerA.cy-this.bounds.top)-this.imageOffsY,this.pointerA.sx=this.pointerA.cx,this.pointerA.sy=this.pointerA.cy,this.pointerB.sx=this.pointerB.cx,this.pointerB.sy=this.pointerB.cy,this.render()}else{let t=this.pointerA.active?this.pointerA:this.pointerB.active?this.pointerB:null;if(!t)return;this.translateImage(t.cx-t.sx,t.cy-t.sy),t.sx=t.cx,t.sy=t.cy}},"event touchstart canvas":function(t){for(let e of(this.imageScale0=this.imageScale,t.changedTouches))null===this.pointerA.id?(this.pointerA.id=e.identifier,this.pointerA.active=!0,this.pointerA.sx=e.clientX,this.pointerA.sy=e.clientY,this.pointerA.ix=(e.clientX-this.bounds.left-this.imageOffsX)/this.imageScale,this.pointerA.iy=(e.clientY-this.bounds.top-this.imageOffsY)/this.imageScale):null===this.pointerB.id&&(this.pointerB.id=e.identifier,this.pointerB.active=!0,this.pointerB.sx=e.clientX,this.pointerB.sy=e.clientY,this.pointerB.ix=(e.clientX-this.bounds.left-this.imageOffsX)/this.imageScale,this.pointerB.iy=(e.clientY-this.bounds.top-this.imageOffsY)/this.imageScale)},"event touchend canvas":function(t){for(let e of t.changedTouches)this.pointerA.id==e.identifier?(this.pointerA.id=null,this.pointerA.active=!1):this.pointerB.id==e.identifier&&(this.pointerB.id=null,this.pointerB.active=!1)},"event touchcancel canvas":function(t){for(let e of t.changedTouches)this.pointerA.id==e.identifier?(this.pointerA.id=null,this.pointerA.active=!1):this.pointerB.id==e.identifier&&(this.pointerB.id=null,this.pointerB.active=!1)}});let M={E_NONE:0,E_PERMISSION_DENIED:32769,E_POSITION_UNAVAILABLE:32770,E_TIMEOUT:32771,E_UNSUPPORTED:32772,E_UNKNOWN:32777,supported:null,status:null,indicatorOn:function(){g.document.documentElement.classList.add("busy-geo")},indicatorOff:function(){g.document.documentElement.classList.remove("busy-geo")},/**
     * Initializes the geolocation interface. Returns boolean indicating whether geolocation
     * is supported on the device.
     * @returns {boolean}
     */init:function(){return this.supported=!!navigator.geolocation,this.supported},/**
     * Single-shot positioning operation.
     * @returns {Promise<{  }>}
     */getCurrentPosition:function(){null===this.supported&&this.init();let t=this.status={cancelled:!1};return new Promise(async(e,s)=>{if(this.indicatorOn(),!this.supported){this.status===t&&(this.status=null),t.cancelled||this.indicatorOff(),s({status:t,code:M.E_UNSUPPORTED,message:"Geolocation is not supported on this device."});return}navigator.geolocation.getCurrentPosition(s=>{this.status===t&&(this.status=null),t.cancelled||this.indicatorOff(),s.status=t,e(s)},e=>{let n;switch(this.status===t&&(this.status=null),t.cancelled||this.indicatorOff(),e.code){case 1:n=M.E_PERMISSION_DENIED;break;case 2:n=M.E_POSITION_UNAVAILABLE;break;case 3:n=M.E_TIMEOUT;break;default:n=M.E_UNKNOWN,e.message="Unable to get the current location."}s({status:t,code:n,message:e.message})},{enableHighAccuracy:!0})})},/**
     * Cancels the active positioning operation (if any).
     */cancel:function(){null!==this.status&&(this.status.cancelled||this.indicatorOff(),this.status.cancelled=!0,this.status=null)}},U=d,D=f,$=p,B=m,H={/**
     * Special object to tag dynamic attributes.
     */DYNAMIC:{},/**
     * Sets the value of a property inside an object.
     * @param {Element|Text} root
     * @param {string[]} path
     * @param {number} lastIndex
     * @param {object} value
     */setValue:function(t,e,s,n){if(("class"===e[0]||"classList"===e[0])&&(e[0]="className"),e.length>1&&"trait"===e[0]){switch(e[1]){case"valueSignal":case"value":t.onchange=t=>n.set(t.currentTarget.value),$([n],e=>t.value=e);break;case"inputSignal":case"input":t.oninput=t=>n.set(t.currentTarget.value),$([n],e=>t.value=e);break;case"checked":t.onchange=t=>n.set(t.currentTarget.checked),$([n],e=>t.checked=e);break;case"selected":t.onchange=t=>n.set(t.currentTarget.selected),$([n],e=>t.selected=e);break;default:console.error("Unknown trait: "+e[1])}return}// Object used to set `style` or `class` attribute.
if(1===e.length&&"object"==typeof n)switch(e[0]){case"style":for(let e in n)$([e,n[e]],(e,s)=>t.style[e]=s);return;case"className":if(n instanceof Array)$([n],e=>{for(let s in t.className="",e)t.classList.add(e[s])});else for(let e in n)$([e,n[e]],(e,s)=>t.classList[!0==s?"add":"remove"](e));return}// Specific CSS class such as `class:hidden`.
if(2===e.length&&"className"===e[0]){$([e[1],n],(e,s)=>t.classList[!0==s?"add":"remove"](e));return}// Any other attribute/property.
for(let n=0;n<s&&t;n++)t=t[e[n]];if(!t)return;let o=e[s];o.startsWith("on")&&(o=o.toLowerCase()),$([o,n],(e,s)=>t[e]=s)},/**
     * Creates a setter for a specified path inside an object.
     * @param {string[]} path 
     * @returns {(root: Element|Text, value: object) => void}
     */createSetter:function(t){let e=t.length-1;return function(s,n){H.setValue(s,t,e,n)}},/**
     * Copies the event listeners and custom properties from `node` to `newNode`.
     * @param {Element} node
     * @param {Element} newNode
     * @returns {Element}
     */copyProps:function(t,e){// Copy property event listeners.
for(let s in t)!(!s.startsWith("on")||s.startsWith("onmoz"))&&t[s]&&(e[s]=t[s]);// Copy custom properties.
for(let s of Object.getOwnPropertyNames(t))~~s!=s&&(e[s]=t[s]);return e},/**
     * Clones an element node and ensures certain properties are copied over.
     * @param {Element} node
     * @param {boolean} [deep=false]
     */cloneNode:function(t,e=!1){if(!e&&!0===t.isCustom)throw Error("cloneNode only available as deep clone for custom elements.");if(e&&!0===t.isCustom)return t.cloneNodeCustom();let s=t.cloneNode();if(e)for(let e of t.childNodes)s.appendChild(H.cloneNode(e,!0));return(// Copy handlers and properties.
H.copyProps(t,s),"oncreated"in s&&s.oncreated(s),s)},/**
     * Ensures the provided value is a node or a node-compatible (such as an array of nodes).
     * @param {Node|Array<Node|string>|string} value
     * @param {boolean} [cloneNode=false]
     * @returns {Node|Array<Node>}
     */ensureNode:function(t,e=!1){if(t instanceof Array){for(let s=0;s<t.length;s++)t[s]=H.ensureNode(t[s],e);return t}return t instanceof Node?e?H.cloneNode(t,!0):t:document.createTextNode(t)},/**
     * Replaces the specified refNode by a newNode and returns the new reference node.
     * @param {Node} parent
     * @param {Node|Array<Node>} refNode
     * @param {Node|Array<Node>} newNode
     * @returns {Node|Array<Node>}
     */replaceNode:function(t,e,s,n=!1){// When refNode is an array, remove all those nodes but leave just one for reference.
if(e instanceof Array){for(;e.length>1;){let s=e.shift();s.parentElement===t&&s.remove()}e=e.shift()}let o=s,a=s;// When newNode is an array, create a document fragment for faster append of all children.
if(s instanceof Array){let t=document.createDocumentFragment();o=[],0==s.length&&(s=[document.createTextNode("")]);for(let e=0;e<s.length;e++)o.push(s[e]),t.appendChild(s[e]);a=s[0],s=t}if(!1===n){e.replaceWith(s);let t=document.createComment("");a.parentElement.insertBefore(t,a),o instanceof Array||(o=[o]),o.push(t)}else e.appendChild(s);return o},/**
     * Creates a DOM node replacer.
     * @param {Element|Text|Array<Element|Text>} refNode
     * @returns {(root: Element|Text, newNode: any) => void}
     */createReplacer:function(t){return function(e,s){t=H.replaceNode(e,t,H.ensureNode(s))}},/**
     * Creates a function that builds an element.
     * @param {string} tagName - Tag of the element to create.
     * @param {array} attributes - Array of name-value pairs. When dynamic attributes are present use the helpers.DYNAMIC as value placeholder.
     * @param {Array<Element|Text|string|null>} children - When dynamic children are present use the placeholder `null`.
     * @returns { (runtimeAttributeValues: Array<string>, runtimeChildren: Array<Element|Text|Array<Element|Text>>) => HTMLElement }
     */create:function(t,e,s){// Attach static attributes.
let n=document.createElement(t),o=[];for(let t=0;t<e.length;t+=2){let s=null;if(s=-1!==e[t].indexOf(":")?e[t].split(":"):[e[t]],e[t+1]!==H.DYNAMIC){H.setValue(n,s,s.length-1,e[t+1]);continue}o.push(H.createSetter(s))}// Attach static children.
let a=[],r=!1,l=!0;// Get indices of dynamic children and detect if any child is a custom element.
for(let t in s)!0===s[t].isCustom&&(r=!0),s[t]===H.DYNAMIC&&a.push(t);// Create and return the element builder fuction.
let h=o.length,c=a.length;return function(t,e,u=null){let d=(e,f=null)=>{let p=null;if(l||r){let t=r?H.cloneNode(n):n;for(let e in s){if(s[e]instanceof Array)throw Error("Document fragments not fully supported!");H.replaceNode(t,t,H.ensureNode(s[e],!0),!0)}r&&(p=t),l=!1}null===p&&(p=H.cloneNode(n,!0));let m="oncreated"in p,g=a.map(t=>H.createReplacer(p.childNodes[t]));for(let e=0;e<h;e++)o[e](p,t[e]);for(let t=0;t<c;t++)$([e[t],t],(t,e)=>g[e](p,t));if(null!==u)for(let t of u)for(let e in t){let s=null;s=-1!==e.indexOf(":")?e.split(":"):[e],H.setValue(p,s,s.length-1,t[e])}return null!==f&&H.copyProps(f,p),!m&&"oncreated"in p&&p.oncreated(p),p.isCustom=!0,p.cloneNode=()=>{throw Error("Use of cloneNode is forbidden in custom elements, use cloneNodeCustom instead.")},p.cloneNodeCustom=()=>d(e.map(t=>t instanceof Node&&!0===t.isCustom?t.cloneNodeCustom():t),p),p};return d(e)}}},F=b,V=_,Y=_,j=E,X=k,Q=L,z=C,W=S,G={Tabs:x,Form:T,Panel:P,List:A,Item:R,Paginator:w,Table:O,Select:I,ImageCropper:q},K=N,J={/**
	 * Database connection.
	 */db:null,/**
	 * Initializes the database connection.
	 * @param {string} dbName
	 * @param {number} version
	 * @param {(db: IDBDatabase, txn: IDBTransaction, oldVersion: number) => void} upgradeCallback
	 * @returns {Promise<void>}
	 * !static init (dbName: string, version: number, upgradeCallback: (db: IDBDatabase, txn: IDBTransaction, oldVersion: number) => void) : Promise<void>;
	 */init:function(t,e,s){return new Promise((n,o)=>{if(!g.indexedDB){o("IndexedDB is not available in your system.");return}let a=indexedDB.open(t,e);a.onerror=t=>{let e=t.target.error+"";-1!==e.indexOf("AbortError")&&(e="\n"+a.message),o("Unable to open database: "+e)},a.onupgradeneeded=async t=>{try{let e=t.target.result,n=t.target.transaction;t.oldVersion<1&&e.createObjectStore("system",{keyPath:["name"]}),await s(e,n,t.oldVersion)}catch(t){a.message=t.message,a.transaction.abort()}},a.onsuccess=async t=>{this.db=t.target.result,n()}})},/**
	 * Ensures the database is ready to be used, or throws an exception.
	 */ensureConnected:function(){this.db||alert("Error: Database not initialized.")},/**
	 * Returns an index object for later use with methods that accept an IDBIndex in the `storeName` parameter.
	 * @param {string} storeName
	 * @param {string} indexName
	 * @returns {IDBIndex}
	 * !static index (storeName: string, indexName: string) : IDBIndex;
	 */index:function(t,e){this.ensureConnected();let s=this.db.transaction(t,"readwrite").objectStore(t).index(e);if(!s)throw Error("Unable to find index `"+e+"` in store "+t);return s},/**
	 * Runs a callback for each record in a data store.
	 * @param {string|IDBIndex|IDBObjectStore} storeName
	 * @param {string} id
	 * @param { (value:object, cursor:IDBCursor) => Promise<boolean> } callback
	 * @returns {Promise<void>}
	 * !static forEach (storeName: string|IDBIndex|IDBObjectStore, id: string, callback: (value:object, cursor:IDBCursor) => Promise<boolean>) : Promise<void>;
	 */forEach:function(t,e,s){return this.ensureConnected(),"function"==typeof e&&(s=e,e=null),new Promise(async(n,o)=>{let a,r;r="string"==typeof t?this.db.transaction(t,"readwrite").objectStore(t):t,(a=null===e?r.openCursor():r.openCursor(e)).onsuccess=async t=>{let e=t.target.result;if(!e||!1===await s(e.value,e)){n();return}e.continue()},a.onerror=t=>{o(t.target.error)}})},/**
	 * Returns the count of all records from the specified data store.
	 * @param {string|IDBIndex|IDBObjectStore} storeName
	 * @returns {Promise<number>}
	 * !static count (storeName: string|IDBIndex|IDBObjectStore) : Promise<number>;
	 */count:function(t){return this.ensureConnected(),new Promise((e,s)=>{let n=("string"==typeof t?this.db.transaction(t,"readonly").objectStore(t):t).count();n.onsuccess=t=>{e(t.target.result)},n.onerror=t=>{s(t.target.error)}})},/**
	 * Returns all records from the specified data store.
	 * @param {string|IDBIndex|IDBObjectStore} storeName
	 * @param {string|number|Array<string|number>} filter
	 * @returns {Promise<Array<object>>}
	 * !static getAll (storeName: string|IDBIndex|IDBObjectStore, filter?: string|number|Array<string|number>) : Promise<Array<object>>;
	 */getAll:function(t,e=null){return this.ensureConnected(),new Promise((s,n)=>{let o=("string"==typeof t?this.db.transaction(t,"readonly").objectStore(t):t).getAll(e);o.onsuccess=t=>{s(t.target.result)},o.onerror=t=>{n(t.target.error)}})},/**
	 * Returns all keys from the specified data store.
	 * @param {string|IDBIndex|IDBObjectStore} storeName
	 * @param {string|number|Array<string|number>} filter
	 * @returns {Promise<Array<string|number|Array<string|number>>>}
	 * !static getAllKeys (storeName: string|IDBIndex|IDBObjectStore, filter?: string|number|Array<string|number>) : Promise<Array<object>>;
	 */getAllKeys:function(t,e=null){return this.ensureConnected(),new Promise((s,n)=>{let o=("string"==typeof t?this.db.transaction(t,"readonly").objectStore(t):t).getAllKeys(e);o.onsuccess=t=>{s(t.target.result)},o.onerror=t=>{n(t.target.error)}})},/**
	 * Loads a list of records having unique values from the specified data store and returns the entire object or just the specified field.
	 * @param {string|IDBIndex|IDBObjectStore} storeName
	 * @param {string} [field]
	 * @returns {Promise<Array<number|string|object>>}
	 * !static getAllUnique (storeName: string|IDBIndex|IDBObjectStore) : Promise<Array<number|string|object>>;
	 */getAllUnique:function(t,e=null){return this.ensureConnected(),new Promise((s,n)=>{let o=("string"==typeof t?this.db.transaction(t,"readonly").objectStore(t):t).openCursor(null,"nextunique"),a=[];o.onsuccess=t=>{let n=t.target.result;if(!n){s(a);return}a.push(e?n.value[e]:n.value),n.continue()},o.onerror=t=>{n(t.target.error)}})},/**
	 * Returns a single record from the specified data store.
	 * @param {string|IDBIndex|IDBObjectStore} storeName
	 * @param {string|number|Array<string|number>} id
	 * @returns {Promise<object>}
	 * !static get (storeName: string|IDBIndex|IDBObjectStore, id: string|number|Array<string|number>) : Promise<object>;
	 */get:function(t,e){return this.ensureConnected(),new Promise((s,n)=>{let o=("string"==typeof t?this.db.transaction(t,"readonly").objectStore(t):t).get(e);o.onsuccess=t=>{s(t.target.result||null)},o.onerror=t=>{n(t.target.error)}})},/**
	 * Adds or overwrites a record in the specified data store (data must include the primary key).
	 * @param {string} storeName
	 * @param {object} data
	 * @returns {Promise<void>}
	 * !static put (storeName: string, data: object) : Promise<void>;
	 */put:function(t,e){return this.ensureConnected(),new Promise((s,n)=>{let o=this.db.transaction(t,"readwrite").objectStore(t).put(e);o.onsuccess=t=>{s()},o.onerror=t=>{n(t.target.error)}})},/**
	 * Returns a variable from the system table.
	 * @param {string} name - Name of the property to read.
	 * @param {boolean} full - When `true` the entire object will be returned.
	 * @returns {any}
	 * !static sysGet (name: string, full?: boolean) : any;
	 */sysGet:async function(t,e=!1){let s=await this.get("system",[t]);return s?e?s:s.value:null},/**
	 * Writes a variable to the system table.
	 * @param {string} name - Name of the property to write.
	 * @param {any} value - Value to write.
	 * @param {boolean} full - When `true` the entire value will be written as-is.
	 * @returns {void}
	 * !static sysPut (name: string, value: any, full?: boolean) : void;
	 */sysPut:async function(t,e,s=!1){s?(e.name=t,await this.put("system",e)):await this.put("system",{name:t,value:e})},/**
	 * Returns a single record from the specified data store that matches the `partial` object and does NOT match the `notPartial` object.
	 * @param {string|IDBIndex|IDBObjectStore} storeName
	 * @param {object} [partial]
	 * @param {object} [notPartial]
	 * @returns {Promise<object>}
	 * !static findOne (storeName: string|IDBIndex|IDBObjectStore, partial?: object, notPartial?: object) : Promise<object>;
	 */findOne:function(e,s=null,n=null){return this.ensureConnected(),new Promise((o,a)=>{let r=("string"==typeof e?this.db.transaction(e,"readonly").objectStore(e):e).openCursor();r.onsuccess=e=>{let a=e.target.result;if(!a){o(null);return}if(null===s||t.partialCompare(a.value,s)){if(null!==n&&t.partialCompare(a.value,n)){a.continue();return}o(a.value);return}a.continue()},r.onerror=t=>{a(t.target.error)}})},/**
	 * Deletes a record from the specified data store.
	 * @param {string} storeName
	 * @param {string|number|Array<string|number>} id
	 * @returns {Promise<void>}
	 * !static delete (storeName: string, id: string|number|Array<string|number>) : Promise<void>;
	 */delete:function(t,e){return this.ensureConnected(),new Promise((s,n)=>{let o=this.db.transaction(t,"readwrite").objectStore(t).delete(e);o.onsuccess=t=>{s()},o.onerror=t=>{n(t.target.error)}})},/**
	 * Deletes all items in the specified store.
	 * @param {string|IDBIndex|IDBObjectStore} storeName
	 * @param {string|number|Array<string|number>} id
	 * @returns {Promise<void>}
	 * !static deleteAll (storeName: string|IDBIndex|IDBObjectStore, id: string|number|Array<string|number>) : Promise<void>;
	 */deleteAll:function(t,e=null){return this.forEach(t,e,async(t,e)=>{await e.delete()})},/**
	 * Inserts a new record in the specified data store.
	 * @param {string} storeName
	 * @param {object} data
	 * @returns {Promise<void>}
	 * !static insert (storeName: string, data: object) : Promise<void>;
	 */insert:function(t,e){return this.ensureConnected(),new Promise((s,n)=>{let o=this.db.transaction(t,"readwrite").objectStore(t).add(e);o.onsuccess=t=>{s()},o.onerror=t=>{n(t.target.error)}})}},Z=M,tt=t,te=e,ti=s,ts=n,tn=o,to=a,ta=r,tr=l,tl=h,th=c;export{F as Router,V as Element,Y as CElement,j as Api,X as DataSource,Q as DataList,z as Easing,W as Anim,G as Elements,K as Utils,J as db,Z as geo,tt as Rinn,te as Class,ti as Event,ts as EventDispatcher,tn as Model,to as ModelList,ta as Schema,tr as Flattenable,tl as Collection,th as Template,U as signal,D as expr,$ as watch,B as validator,H as helpers};//# sourceMappingURL=riza.m.js.map

//# sourceMappingURL=riza.m.js.map
