import {Rinn as $j3ZoB$Rinn, Class as $j3ZoB$Class, Event as $j3ZoB$Event, EventDispatcher as $j3ZoB$EventDispatcher, Model as $j3ZoB$Model, ModelList as $j3ZoB$ModelList, Schema as $j3ZoB$Schema, Flattenable as $j3ZoB$Flattenable, Collection as $j3ZoB$Collection, Template as $j3ZoB$Template} from "rinn";
import $j3ZoB$base64 from "base-64";
import $j3ZoB$nodefetch from "node-fetch";

var $parcel$global =
typeof globalThis !== 'undefined'
  ? globalThis
  : typeof self !== 'undefined'
  ? self
  : typeof window !== 'undefined'
  ? window
  : typeof global !== 'undefined'
  ? global
  : {};

/*
**	The Router is a special module that detects local URL changes (when a hash-change occurs) and
**	forwards events to the appropriate handlers.
*/ const $cdbdea0eedb44c97$var$_Router = {
    Route: $j3ZoB$EventDispatcher.extend({
        /*
		**	Regular expression for the route. This is generated from a simpler expression provided
		**	in the constructor.
		*/ routeRegex: null,
        /*
		**	Original route string value.
		*/ value: null,
        /*
		**	Map with the indices and the names of each paremeter obtained from the route expression.
		*/ params: null,
        /*
		**	Arguments obtained from the current route (uses `params` to determine name of arguments).
		*/ args: null,
        /*
		**	Arguments string obtained from the last route dispatch. Used to check if the arguments changed.
		*/ s_args: null,
        /*
		**	Indicates if the route is active because of a past positive dispatch.
		*/ active: false,
        /*
		**	Indicates if the params have changed since last event. Transition from inactive to active route will always set this value to true.
		*/ changed: false,
        /*
		**	Constructor of the route, the specified argument is a route expression.
		**
		**	>> void __ctor (string route);
		*/ __ctor: function(route) {
            this._super.EventDispatcher.__ctor();
            this._compileRoute(this.value = route);
        },
        /*
		**	Transforms the specified route expression into a regular expression and a set of parameter
		**	names and stores them in the 'param' array.
		**
		**	>> void _compileRoute (string route);
		*/ _compileRoute: function(route) {
            this.params = [];
            route = route.replace(/\/\*\//g, '/.+/');
            while(true){
                var m = /:([!@A-Za-z0-9_-]+)/.exec(route);
                if (!m) break;
                route = route.replace(m[0], '([^/]+)');
                this.params.push(m[1]);
            }
            this.routeRegex = '^' + route.replace(/##/g, '');
        },
        /*
		**	Adds a handler to the route dispatcher. The handler can be removed later using removeHandler and
		**	specifying the same parameters. If unrouted boolean is specified the event to listen to will be
		**	the unrouted event (when the route changes and the route is not activated).
		**
		**	void addHandler (handler: function, unrouted: bool);
		*/ addHandler: function(handler, unrouted) {
            this.addEventListener((unrouted === true ? 'un' : '') + 'routed', handler, null);
        },
        /*
		**	Removes a handler from the route dispatcher.
		**
		**	void removeHandler (handler: function, unrouted: bool);
		*/ removeHandler: function(handler, unrouted) {
            this.removeEventListener((unrouted === true ? 'un' : '') + 'routed', handler, null);
        },
        /*
		**	Verifies if the specified route matches the internal route and if so dispatches a (depends on doUnroute parameter) "routed" or "unrouted" event with the
		**	parameters obtained from the location to all attached handlers.
		**
		**	void dispatch (route:string, doUnroute:bool);
		*/ dispatch: function(route) {
            var matches = route.match(this.routeRegex);
            if (!matches) {
                this.s_args = null;
                if (this.active) this.dispatchEvent('unrouted', {
                    route: this
                });
                this.active = false;
                return;
            }
            var args = {
                route: this
            };
            var str = '';
            for(var i = 0; i < this.params.length; i++){
                args[this.params[i]] = matches[i + 1];
                str += '_' + matches[i + 1];
            }
            this.changed = str != this.s_args;
            this.s_args = str;
            this.dispatchEvent('routed', this.args = args);
            this.active = true;
        }
    }),
    /*
	**	Map with route objects. The key of the map is the route and the value a handler.
	*/ routes: {
    },
    /*
	**	Sorted list of routes. Smaller routes are processed first than larger ones. This array stores
	**	only the keys to the Router.routes map.
	*/ sortedRoutes: [],
    /*
	**	Indicates the number of times the onLocationChanged handler should ignore the hash change event.
	*/ ignoreHashChangeEvent: 0,
    /*
	**	Current relative location (everything after the location hash symbol).
	*/ location: '',
    /*
	**	Current relative location as an array of elements (obtained by splitting the location by slash).
	*/ args: [],
    /*
	**	Initializes the router module. Ensure to call `refresh` once to force a hashchange when the page loads.
	*/ init: function() {
        if (this.alreadyAttached) return;
        this.alreadyAttached = true;
        if ('onhashchange' in globalThis) globalThis.onhashchange = this.onLocationChanged.bind(this);
    },
    /*
	**	Refreshes the current route by forcing a hashchange event.
	*/ refresh: function() {
        this.onLocationChanged();
    },
    /*
	**	Changes the current location and optionally prevents a trigger of the hashchange event.
	*/ setRoute: function(route, silent) {
        var location = this.realLocation(route);
        if (location == this.location) return;
        if (silent) this.ignoreHashChangeEvent++;
        globalThis.location.hash = location;
    },
    /*
	**	Adds the specified route to the routing map. When the specified route is detected, the `onRoute` handler will be called, and then
	**	when the route exits `onUnroute` will be called.
	*/ addRoute: function(route, onRoute, onUnroute) {
        if (!this.routes[route]) {
            this.routes[route] = new this.Route(route);
            this.sortedRoutes.push(route);
            this.sortedRoutes.sort((a, b)=>{
                return this.routes[a].routeRegex.length - this.routes[b].routeRegex.length;
            });
        }
        if (onUnroute !== undefined) {
            this.routes[route].addHandler(onRoute, false);
            this.routes[route].addHandler(onUnroute, true);
        } else this.routes[route].addHandler(onRoute, false);
        return this.routes[route];
    },
    /*
	**	Adds the specified routes to the routing map. The routes map should contain the route expression
	**	in the key of the map and a handler function in the value.
	*/ addRoutes: function(routes) {
        for(var i in routes){
            if (!this.routes[i]) {
                this.routes[i] = new this.Route(i);
                this.sortedRoutes.push(i);
            }
            this.routes[i].addHandler(routes[i], false);
        }
        this.sortedRoutes.sort((a, b)=>{
            return this.routes[a].routeRegex.length - this.routes[b].routeRegex.length;
        });
    },
    /*
	**	Removes the specified route from the routing map.
	*/ removeRoute: function(route, onRoute, onUnroute) {
        if (!this.routes[route]) return;
        if (onUnroute !== undefined) {
            this.routes[route].removeHandler(onRoute, false);
            this.routes[route].removeHandler(onUnroute, true);
        } else this.routes[route].removeHandler(onRoute);
    },
    /*
	**	Removes the specified routes from the routing map. The routes map should contain the route
	**	expression in the key of the map and a handler function in the value.
	*/ removeRoutes: function(routes) {
        for(var i in routes){
            if (!this.routes[i]) continue;
            this.routes[i].removeHandler(routes[i]);
        }
    },
    /*
	**	Given a formatted location and a previous one it will return the correct real location.
	*/ realLocation: function(cLocation, pLocation) {
        if (!pLocation) pLocation = this.location;
        if (!pLocation) pLocation = ' ';
        var state = 0, i = 0, j = 0, k;
        var rLocation = '';
        while(state != -1 && i < cLocation.length && j < pLocation.length)switch(state){
            case 0:
                if (cLocation.substr(i++, 1) == '*') {
                    state = 1;
                    break;
                }
                if (cLocation.substr(i - 1, 1) != pLocation.substr(j++, 1)) {
                    rLocation += cLocation.substr(i - 1);
                    state = -1;
                    break;
                }
                rLocation += pLocation.substr(j - 1, 1);
                break;
            case 1:
                if (cLocation.substr(i, 1) == '*') {
                    state = 3;
                    i++;
                    break;
                }
                state = 2;
                break;
            case 2:
                k = pLocation.indexOf(cLocation.substr(i, 1), j);
                if (k == -1) {
                    rLocation += pLocation.substr(j) + cLocation.substr(i);
                    state = -1;
                    break;
                }
                rLocation += pLocation.substr(j, k - j);
                state = 0;
                j = k;
                break;
            case 3:
                k = pLocation.lastIndexOf(cLocation.substr(i, 1));
                if (k == -1) {
                    rLocation += cLocation.substr(i);
                    state = -1;
                    break;
                }
                rLocation += pLocation.substr(j, k - j);
                state = 0;
                j = k;
                break;
        }
        if (state != -1) rLocation += cLocation.substr(i);
        return rLocation.trim();
    },
    /*
	**	Event handler called when the location hash changes.
	*/ onLocationChanged: function() {
        var cLocation = location.hash.substr(1);
        var rLocation = this.realLocation(cLocation);
        if (cLocation != rLocation) {
            globalThis.location.replace('#' + rLocation);
            return;
        }
        this.location = cLocation;
        this.args = this.location.split('/');
        if (this.ignoreHashChangeEvent > 0) {
            this.ignoreHashChangeEvent--;
            return;
        }
        for(var i = 0; i < this.sortedRoutes.length; i++)this.routes[this.sortedRoutes[i]].dispatch(this.location);
    },
    /*
	**	Navigates to the given hash-based URL.
	*/ navigate: function(location, replace = false) {
        location = this.realLocation(location);
        if (globalThis.location.hash == '#' + location) {
            this.refresh();
            return;
        }
        if (replace) globalThis.location.replace('#' + location);
        else globalThis.location.hash = location;
    }
};
$cdbdea0eedb44c97$var$_Router.init();
var $cdbdea0eedb44c97$export$2e2bcd8739ae039 = $cdbdea0eedb44c97$var$_Router;



/**
 * 	Map containing the original prototypes for all registered elements.
 */ const $f2f01f7f560a1091$var$elementPrototypes = {
};
/**
 * 	Map containing the final classes for all registered elements.
 */ const $f2f01f7f560a1091$var$elementClasses = {
};
/**
 * 	Base class for custom elements. Provides support for model-triggered events, easy definition of handlers for events originated in
 * 	self or child-elements, and several utility methods.
 */ const $f2f01f7f560a1091$var$Element = {
    /**
	 * 	Internal element ID. Added as namespace to model events. Ensures that certain model events are run locally only, not affecting other event handlers.
	 */ eid: null,
    /**
	 * 	Indicates if the element is a root element, that is, the target element to attach child elements having `data-ref` attribute.
	 */ isRoot: true,
    /**
	 * 	Root element to which this element is attached (when applicable).
	 */ root: null,
    /**
	 * 	Indicates ready-state of the element. Possible values are: 0: "Not ready", 1: "Children Initialized", and 2: "Parent Ready".
	 */ isReady: 0,
    readyReenter: 0,
    readyLocked: 0,
    /**
	 * 	Model type (class) for the element's model.
	 */ modelt: $j3ZoB$Model,
    /**
	 * 	Data model related to the element.
	 */ model: null,
    /**
	 * 	Events map.
	 */ events: {
        'click [data-action]': function(evt) {
            let opts = evt.source.dataset.action.split(' ');
            if (opts[0] in this) this[opts[0]]({
                ...evt.params,
                ...evt.source.dataset,
                ...opts,
                length: opts.length
            }, evt);
            else evt.continuePropagation = true;
        },
        'keyup(13) input[data-enter]': function(evt) {
            let opts = evt.source.dataset.enter.split(' ');
            if (opts[0] in this) this[opts[0]]({
                ...evt.params,
                ...evt.source.dataset,
                ...opts,
                length: opts.length
            }, evt);
            else evt.continuePropagation = true;
        }
    },
    /**
	 * 	Element constructor.
	 */ __ctor: function() {
        this._list_watch = [];
        this._list_visible = [];
        this._list_property = [];
        if ('root' in this.dataset) {
            if (this.dataset.root == 'false') this.isRoot = false;
        }
        this.style.display = 'block';
        this.eid = Math.random().toString().substr(2);
        if (this.model != null) {
            let tmp = this.model;
            this.model = null;
            this.setModel(tmp, false);
        }
        Object.keys(this._super).reverse().forEach((i)=>{
            if ('init' in this._super[i]) this._super[i].init();
        });
        if ($f2f01f7f560a1091$var$Element.debug) console.log('>> ' + this.tagName + ' INIT ON ' + this.parentElement.tagName);
        this.init();
        if (this.events) this.bindEvents(this.events);
        setTimeout(()=>{
            if (this.tagName.toLowerCase() !== 'r-dom-probe') this.appendChild(document.createElement('r-dom-probe'));
            else this.markReady();
        }, 0);
    },
    /**
	 * 	Initializes the element. Called after construction of the instance.
	 */ init: function() {
    },
    /**
	 * 	Executed when the children of the element are ready.
	 */ ready: function() {
    },
    /**
	 * 	Executed after ready and after the root is also ready.
	 */ rready: function() {
    },
    /**
	 * 	Marks the element as ready.
	 */ markReady: function(list = null) {
        this.readyLocked++;
        if (!this.isReady) {
            this.isReady = 1;
            // Set model is `model` property was set in the element.
            if ('model' in this.dataset) {
                let ref = this.getFieldByPath(this.dataset.model);
                if (ref) this.setModel(ref);
            }
            // Run ready methods in class hierarchy.
            Object.keys(this._super).reverse().forEach((i)=>{
                if ('ready' in this._super[i]) this._super[i].ready();
            });
            if ($f2f01f7f560a1091$var$Element.debug) console.log('>> ' + this.tagName + ' READY');
            this.ready();
            this.collectWatchers();
        } else this.collectWatchers();
        let root = this.findCustomParent(this);
        if ($f2f01f7f560a1091$var$Element.debug) console.log(this.tagName + ' ROOT IS ' + (root ? root.tagName : 'NULL'));
        if (root && root.isReady === 0 && this.isReady != 0) root.checkReady();
        let rootReady = false;
        if (root && root.isReady === 2 && this.isReady !== 2) {
            this.getRoot();
            if (this.root && this.dataset.ref) {
                if ($f2f01f7f560a1091$var$Element.debug) console.log(this.tagName + ' REF AS `' + this.dataset.ref + '` ON ' + this.root.tagName);
                this.root[this.dataset.ref] = this;
                this.root.onRefAdded(this.dataset.ref, this);
            }
            rootReady = true;
        }
        if (!root && this.isReady !== 2) rootReady = true;
        if (rootReady) {
            this.isReady = 2;
            if (list !== null) for (let elem of list)elem.checkReady();
            if ($f2f01f7f560a1091$var$Element.debug) console.log('>> ' + this.tagName + ' RREADY');
            Object.keys(this._super).reverse().forEach((i)=>{
                if ('rready' in this._super[i]) this._super[i].rready();
            });
            this.rready();
        }
        this.readyLocked--;
        if (this.readyReenter && !this.readyLocked) {
            this.readyReenter = false;
            this.checkReady();
        }
        if (this.tagName.toLowerCase() === 'r-dom-probe') this.remove();
    },
    /**
	 *	Checks if all children are ready and fires the appropriate function (`ready` and/or `rready`).
	 */ checkReady: function() {
        if (this.childNodes.length == 0) return;
        if (this.readyLocked) {
            this.readyReenter = true;
            return;
        }
        let isReady = true;
        let list = [];
        let result = document.evaluate(".//*[contains(name(),'-')]", this, null, XPathResult.ANY_TYPE, null);
        if ($f2f01f7f560a1091$var$Element.debug) console.log('# CHECKING ' + this.tagName);
        while(true){
            let elem = result.iterateNext();
            if (!elem) break;
            if (elem === this) continue;
            let root = this.findCustomParent(elem);
            if (root !== this) continue;
            if ($f2f01f7f560a1091$var$Element.debug) console.log('   ' + elem.tagName + ' = ' + elem.isReady);
            if (!elem.isReady) isReady = false;
            list.push(elem);
        }
        if (!isReady) return;
        this.markReady(list);
    },
    /**
	 * 	Returns the value of a field given its path. Starts from `global`, unless the first item in the path is `this`, in which case it will start from the element.
	 */ getFieldByPath: function(path) {
        if (!path) return null;
        let tmp = path.split('.');
        let ref = $parcel$global;
        if (tmp.length && tmp[0] == 'this') {
            ref = this;
            tmp.shift();
        }
        if (tmp.length && tmp[0] == 'root') {
            ref = this.getRoot();
            tmp.shift();
        }
        while(ref != null && tmp.length != 0)ref = ref[tmp.shift()];
        return ref;
    },
    /**
	 * 	Returns the root of the element (that is, the `root` property). If not set it will attempt to find the root first.
	 */ getRoot: function() {
        return this.root ? this.root : this.root = this.findRoot();
    },
    /**
	 * 	Sets the model of the element and executes the `modelChanged` event handler (unless `update` is set to false).
	 */ setModel: function(model, update = true) {
        if (!model) return this;
        model = $j3ZoB$Rinn.ensureTypeOf(this.modelt, model);
        if (this.model !== model) {
            if (this.model != null) {
                this.model.removeEventListener(this.eid + ':modelChanged', this.onModelPreChanged, this);
                this.model.removeEventListener(this.eid + ':propertyChanging', this.onModelPropertyChanging, this);
                this.model.removeEventListener(this.eid + ':propertyChanged', this.onModelPropertyPreChanged, this);
                this.model.removeEventListener(this.eid + ':propertyRemoved', this.onModelPropertyRemoved, this);
            }
            this.model = model;
            this.model.addEventListener(this.eid + ':modelChanged', this.onModelPreChanged, this);
            this.model.addEventListener(this.eid + ':propertyChanging', this.onModelPropertyChanging, this);
            this.model.addEventListener(this.eid + ':propertyChanged', this.onModelPropertyPreChanged, this);
            this.model.addEventListener(this.eid + ':propertyRemoved', this.onModelPropertyRemoved, this);
        }
        if (update !== false) this.model.setNamespace(this.eid).update(true).setNamespace(null);
        return this;
    },
    /**
	 * 	Returns the model of the element. Added for symmetry only, exactly the same as accesing public property `model` of this class.
	 */ getModel: function() {
        return this.model;
    },
    /**
	 * 	Adds one or more CSS classes (separated by space) to the element.
	 */ addClass: function(classString) {
        if (!classString) return this;
        classString.split(' ').forEach((i)=>{
            i = i.trim();
            if (!i) return;
            if (i[0] == '-' || i[0] == '+') this.classList[i[0] == '-' ? 'remove' : 'add'](i.substr(1));
            else this.classList.add(i);
        });
        return this;
    },
    /**
	 * 	Removes one or more CSS classes (separated by space) from the element.
	 */ removeClass: function(classString) {
        if (!classString) return this;
        classString.split(' ').forEach((i)=>{
            i = i.trim();
            if (!i) return;
            if (i[0] == '-' || i[0] == '+') this.classList[i[0] == '-' ? 'remove' : 'add'](i.substr(1));
            else this.classList.remove(i);
        });
        return this;
    },
    /**
	 * 	Sets one or more style properties to the element (separated by semi-colon).
	 */ setStyle: function(styleString) {
        if (!styleString) return this;
        styleString.split(';').forEach((i)=>{
            let j = (i = i.trim()).indexOf(':');
            if (j == -1) return;
            let name = i.substr(0, j).trim();
            for(let k = name.indexOf('-'); k != -1; k = name.indexOf('-'))name = name.substr(0, k) + name.substr(k + 1, 1).toUpperCase() + name.substr(k + 2);
            this.style[name] = i.substr(j + 1).trim();
        });
        return this;
    },
    /**
	 * 	Returns the width of the specified element (or of itself it none provided), uses `getBoundingClientRect`.
	 */ getWidth: function(elem = null) {
        return (elem || this).getBoundingClientRect().width;
    },
    /**
	 * 	Returns the height of the specified element (or of itself it none provided), uses `getBoundingClientRect`.
	 */ getHeight: function(elem = null) {
        return (elem || this).getBoundingClientRect().height;
    },
    /**
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
	*/ bindEvents: function(events) {
        for(var evtstr in events){
            let hdl = events[evtstr];
            if ($j3ZoB$Rinn.typeOf(hdl) == 'string') hdl = this[hdl];
            hdl = hdl.bind(this);
            var i = evtstr.indexOf(' ');
            var name = i == -1 ? evtstr : evtstr.substr(0, i);
            var selector = i == -1 ? '' : evtstr.substr(i + 1);
            let args = null;
            var j = name.indexOf('(');
            if (j != -1) {
                args = name.substr(j + 1, name.length - j - 2).split(',');
                name = name.substr(0, j);
            }
            if (selector[0] == '@') {
                if (selector != '@this') {
                    this[selector.substr(1)].addEventListener(name, hdl);
                    continue;
                }
                selector = this;
            } else if (selector[0] == '&') {
                if (selector != '&this') selector = "[data-ref='" + selector.substr(1) + "']";
                else selector = this;
            }
            if (name.substr(0, 1) == '#') {
                this.listen('propertyChanged.' + name.substr(1), this, hdl);
                continue;
            }
            if (args != null) switch(name){
                case 'keyup':
                case 'keydown':
                    this.listen(name, selector, function(evt) {
                        if ($j3ZoB$Rinn.indexOf(args, evt.keyCode.toString()) != -1) return hdl(evt, args);
                        evt.continuePropagation = true;
                    });
                    continue;
            }
            this.listen(name, selector, hdl);
        }
        return this;
    },
    /**
	**	Executes the underlying event handler given an event and a selector. Called internally by listen().
	**
	**	>> void _eventHandler (event evt, string selector, function handler);
	*/ _eventHandler: function(evt, selector, handler) {
        if (evt.continuePropagation === false) return;
        evt.continuePropagation = true;
        evt.source = evt.target;
        if (selector && selector instanceof HTMLElement) {
            if (evt.source === selector) {
                evt.continuePropagation = false;
                if (handler.call(this, evt, evt.detail) === true) evt.continuePropagation = true;
            }
        } else if (selector && selector != '*') {
            let elems = this.querySelectorAll(selector);
            while(evt.source !== this){
                let i = $j3ZoB$Rinn.indexOf(elems, evt.source, true);
                if (i !== -1) {
                    evt.continuePropagation = false;
                    if (handler.call(this, evt, evt.detail) === true) evt.continuePropagation = true;
                    break;
                } else evt.source = evt.source.parentElement;
            }
        } else {
            evt.continuePropagation = false;
            if (handler.call(this, evt, evt.detail) === true) evt.continuePropagation = true;
        }
        if (evt.continuePropagation === false) {
            evt.preventDefault();
            evt.stopPropagation();
        }
    },
    /**
	**	Listens for an event on elements matching the specified selector, returns an object with a single method `remove` used
	**	to remove the listener when it is no longer needed.
	**
	**	>> object listen (string eventName, string selector, function handler);
	**	>> object listen (string eventName, function handler);
	*/ listen: function(eventName, selector, handler) {
        let eventCatcher = false;
        let eventImmediate = false;
        if ($j3ZoB$Rinn.typeOf(selector) == 'function') {
            handler = selector;
            selector = null;
        }
        if (eventName[eventName.length - 1] == '!') {
            eventName = eventName.substr(0, eventName.length - 1);
            eventCatcher = true;
        }
        if (eventName[0] == '!') {
            eventName = eventName.substr(1);
            eventImmediate = true;
        }
        let callback0 = null;
        let callback1 = null;
        let self = this;
        this.addEventListener(eventName, callback0 = (evt)=>{
            if (evt.continuePropagation === false) return;
            if (!evt.firstCapture) {
                evt.firstCapture = this;
                evt.firstCaptureCount = 0;
                evt.queue = [];
            }
            if (evt.firstCapture === this) evt.firstCaptureCount++;
            if (eventCatcher == true) evt.queue.push([
                this,
                selector,
                handler
            ]);
            if (eventImmediate == true) this._eventHandler(evt, selector, handler);
        }, true);
        this.addEventListener(eventName, callback1 = (evt)=>{
            if (evt.continuePropagation === false) return;
            if (eventCatcher != true && eventImmediate != true) this._eventHandler(evt, selector, handler);
            if (evt.firstCapture === this && evt.continuePropagation !== false) {
                if (--evt.firstCaptureCount == 0) {
                    while(evt.queue.length){
                        let q = evt.queue.pop();
                        q[0]._eventHandler(evt, q[1], q[2]);
                    }
                    evt.continuePropagation = false;
                }
            }
        }, false);
        return {
            removed: false,
            remove: function() {
                if (this.removed) return;
                this.removed = true;
                self.removeEventListener(eventName, callback0, true);
                self.removeEventListener(eventName, callback1, false);
            }
        };
    },
    /**
	**	Creates an event object for later dispatch.
	*/ createEventObject: function(eventName, args, bubbles) {
        let evt;
        if (eventName == 'click') evt = new MouseEvent(eventName, {
            bubbles: bubbles,
            detail: args
        });
        else evt = new CustomEvent(eventName, {
            bubbles: bubbles,
            detail: args
        });
        return evt;
    },
    /**
	**	Dispatches a new event with the specified name and the given arguments.
	*/ dispatch: function(eventName, args = null, bubbles = true) {
        this.dispatchEvent(this.createEventObject(eventName, args, bubbles));
    },
    /**
	**	Dispatches a new event on the specified element with the given name and arguments (uses `CustomEvent`).
	*/ dispatchOn: function(elem, eventName, args = null, bubbles = true) {
        elem.dispatchEvent(this.createEventObject(eventName, args, bubbles));
    },
    /**
	**	Sets the innerHTML property of the element and runs some post set-content tasks.
	**
	**	>> void setInnerHTML (value);
	*/ setInnerHTML: function(value) {
        this.readyLocked++;
        this.innerHTML = value;
        this.readyLocked--;
    },
    /**
	**	Collects all watchers (data-watch, data-visible, data-property), that depend on the model, should be invoked when the structure
	**	of the element changed (added/removed children). This is automatically called when the setInnerHTML method is called.
	**
	**	Note that for 3rd party libs that add children to this element (which could probably have a watcher) will possibly result in
	**	duplication of the added elements when compiling the innerHTML template. To prevent this add the 'pseudo' CSS class to any
	**	element that should not be added to the HTML template.
	**
	**	>> void collectWatchers ();
	*/ collectWatchers: function() {
        let self = this;
        let modified = false;
        let list;
        if (!this.isRoot) return;
        let _list_watch_length = this._list_watch.length;
        let _list_visible_length = this._list_visible.length;
        let _list_property_length = this._list_property.length;
        /* *** */ list = this.querySelectorAll('[data-watch]');
        for(let i3 = 0; i3 < list.length; i3++){
            for (let j of list[i3].querySelectorAll('.pseudo'))j.remove();
            list[i3]._template = $j3ZoB$Template.compile(list[i3].innerHTML);
            list[i3]._watch = new RegExp('^(' + list[i3].dataset.watch + ')$');
            list[i3].innerHTML = '';
            list[i3].removeAttribute('data-watch');
            this._list_watch.push(list[i3]);
        }
        if ('selfWatch' in this.dataset) {
            for (let j of this.querySelectorAll('.pseudo'))j.remove();
            this._template = $j3ZoB$Template.compile(this.innerHTML);
            this._watch = new RegExp('^(' + this.dataset.selfWatch + ')$');
            this.innerHTML = '';
            this.removeAttribute('data-self-watch');
            this._list_watch.push(this);
        }
        /* *** */ list = this.querySelectorAll('[data-visible]');
        for(let i1 = 0; i1 < list.length; i1++){
            list[i1]._visible = $j3ZoB$Template.compile(list[i1].dataset.visible);
            list[i1].removeAttribute('data-visible');
            this._list_visible.push(list[i1]);
        }
        if ('selfVisible' in this.dataset) {
            this._visible = $j3ZoB$Template.compile(this.dataset.selfVisible);
            this.removeAttribute('data-self-visible');
            this._list_visible.push(this);
        }
        /* *** */ list = this.querySelectorAll('[data-property]');
        for(let i2 = 0; i2 < list.length; i2++){
            list[i2].onchange = list[i2].onblur = function() {
                switch(this.type){
                    case 'radio':
                        if (this.checked) self.getModel().set(this.name, this.value);
                        break;
                    case 'checkbox':
                        self.getModel().set(this.name, this.checked ? '1' : '0');
                        break;
                    case 'field':
                        self.getModel().set(this.name, this.getValue());
                        break;
                    default:
                        self.getModel().set(this.name, this.value);
                        break;
                }
            };
            if (list[i2].tagName == 'SELECT') list[i2].onmouseup = function() {
                self.getModel().set(this.name, this.value);
            };
            list[i2].name = list[i2].dataset.property;
            list[i2].removeAttribute('data-property');
            this._list_property.push(list[i2]);
        }
        if ('selfProperty' in this.dataset) {
            this.onchange = this.onblur = function() {
                switch(this.type){
                    case 'radio':
                        if (this.checked) self.getModel().set(this.name, this.value);
                        break;
                    case 'checkbox':
                        self.getModel().set(this.name, this.checked ? '1' : '0');
                        break;
                    case 'field':
                        self.getModel().set(this.name, this.getValue());
                        break;
                    default:
                        self.getModel().set(this.name, this.value);
                        break;
                }
            };
            if (this.tagName == 'SELECT') this.onmouseup = function() {
                self.getModel().set(this.name, this.value);
            };
            this.name = this.dataset.selfProperty;
            this.removeAttribute('data-self-property');
            this._list_property.push(this);
        }
        /* *** */ this._list_watch = this._list_watch.filter((i)=>i.parentElement != null
        );
        if (_list_watch_length != this._list_watch.length) modified = true;
        this._list_visible = this._list_visible.filter((i)=>i.parentElement != null
        );
        if (_list_visible_length != this._list_visible.length) modified = true;
        this._list_property = this._list_property.filter((i)=>i.parentElement != null
        );
        if (_list_property_length != this._list_property.length) modified = true;
        if (this.model != null && modified) this.model.setNamespace(this.eid).update(true).setNamespace(null);
    },
    /**
	**	Executed when the element is created and yet not attached to the DOM tree.
	*/ onCreated: function() {
    },
    /**
	**	Executed when the element is attached to the DOM tree.
	*/ onConnected: function() {
    },
    /**
	**	Executed when the element is no longer a part of the DOM tree.
	*/ onDisconnected: function() {
    },
    /**
	**	Executed on the root element when a child element has `data-ref` attribute and it was added to it.
	*/ onRefAdded: function(name, element) {
    },
    /**
	**	Executed on the root element when a child element has `data-ref` attribute and it was removed from it.
	*/ onRefRemoved: function(name, element) {
    },
    /**
	**	Event handler invoked when the model has changed, executed before onModelChanged() to update internal dependencies,
	**	should not be overriden or elements watching the model will not be updated.
	**
	**	>> void onModelPreChanged (evt, args);
	*/ onModelPreChanged: function(evt, args) {
        let data = this.getModel().get();
        for(let i = 0; i < this._list_watch.length; i++)for (let j of args.fields){
            if (!this._list_watch[i]._watch.test(j)) continue;
            this._list_watch[i].innerHTML = this._list_watch[i]._template(data);
            break;
        }
        for(let i4 = 0; i4 < this._list_visible.length; i4++)if (!!this._list_visible[i4]._visible(data, 'arg')) this._list_visible[i4].style.removeProperty('display');
        else this._list_visible[i4].style.setProperty('display', 'none', 'important');
        this.onModelChanged(evt, args);
    },
    /**
	**	Event handler invoked when the model has changed.
	*/ onModelChanged: function(evt, args) {
    },
    /**
	**	Event handler invoked when a property of the model is changing. Fields `name` and `value` can be found in the `args` object.
	*/ onModelPropertyChanging: function(evt, args) {
    },
    /**
	**	Event handler invoked when a property of the model has changed, executed before onModelPropertyChanged() to update internal
	**	dependencies. Automatically triggers internal events named `propertyChanged.<propertyName>` and `propertyChanged`.
	**	Should not be overriden or elements depending on the property will not be updated.
	*/ onModelPropertyPreChanged: function(evt, args) {
        for(let i = 0; i < this._list_property.length; i++)if (this._list_property[i].name == args.name) {
            let trigger = true;
            switch(this._list_property[i].type){
                case 'radio':
                    if (this._list_property[i].value != args.value) {
                        this._list_property[i].parentElement.classList.remove('active');
                        continue;
                    }
                    this._list_property[i].checked = true;
                    this._list_property[i].parentElement.classList.add('active');
                    break;
                case 'checkbox':
                    if (~~args.value) {
                        this._list_property[i].checked = true;
                        this._list_property[i].parentElement.classList.add('active');
                    } else {
                        this._list_property[i].checked = false;
                        this._list_property[i].parentElement.classList.remove('active');
                    }
                    break;
                case 'field':
                    this._list_property[i].val = this._list_property[i].dataset.value = args.value;
                    this._list_property[i].setValue(args.value);
                    trigger = false;
                    break;
                default:
                    this._list_property[i].value = args.value;
                    this._list_property[i].val = this._list_property[i].dataset.value = args.value;
                    if (this._list_property[i].value != args.value) trigger = false;
                    break;
            }
            if (trigger && this._list_property[i].onchange) this._list_property[i].onchange();
        }
        this.dispatch('propertyChanged.' + args.name, args, false);
        this.dispatch('propertyChanged', args, false);
        this.onModelPropertyChanged(evt, args);
    },
    /**
	**	Event handler invoked when a property of the model has changed.
	*/ onModelPropertyChanged: function(evt, args) {
    },
    /**
	**	Event handler invoked when a property of the model is removed. Field `name` can be found in the `args` object.
	*/ onModelPropertyRemoved: function(evt, args) {
    },
    /*
	**	Runs the following preparation procedures on the specified prototype:
	**		- All functions named 'event <event-name> [event-selector]' will be moved to the 'events' map.
	**
	**	>> void preparePrototype (object proto);
	*/ preparePrototype: function(proto) {
        if (proto.__prototypePrepared === true) return;
        proto.__prototypePrepared = true;
        if (!('events' in proto)) proto.events = {
        };
        for(let i in proto)if (i.startsWith('event ')) {
            proto.events[i.substr(6)] = proto[i];
            delete proto[i];
        }
    },
    /*
	**	Registers a new custom element with the specified name. Extra functionality can be added with one or more prototypes, by default
	**	all elements also get the `Element` prototype. Note that the final prototypes of all registered elements are stored, and if you want
	**	to inherit another element's prototype just provide its name (string) in the protos argument list.
	**
	**	>> class register (string name, ...(object|string) protos);
	*/ register: function(name, ...protos) {
        const newElement = class _class extends HTMLElement {
            findRoot(srcElement) {
                let elem = srcElement ? srcElement : this.parentElement;
                while(elem != null){
                    if ('isRoot' in elem && elem.isRoot === true) return elem;
                    elem = elem.parentElement;
                }
                return null;
            }
            findCustomParent(srcElement) {
                let elem = srcElement ? srcElement.parentElement : this.parentElement;
                while(elem != null){
                    if (elem.tagName.indexOf('-') !== -1) return elem;
                    elem = elem.parentElement;
                }
                return null;
            }
            connectReference(root = null, flags = 255) {
                if (!this.root && (flags & 1) == 1) {
                    if (root == null) root = this.findRoot();
                    if (root != null) {
                        if (this.dataset.ref) root[this.dataset.ref] = this;
                        this.root = root;
                    }
                }
            }
            connectedCallback() {
                this.connectReference(null, 1);
                if (this.invokeConstructor) {
                    this.invokeConstructor = false;
                    this.__ctor();
                }
                this.connectReference(null, 2);
                this.onConnected();
                if (this.dataset.xref) globalThis[this.dataset.xref] = this;
            }
            disconnectedCallback() {
                if (this.root) {
                    if (this.dataset.ref) {
                        this.root.onRefRemoved(this.dataset.ref, this);
                        delete this.root[this.dataset.ref];
                    }
                    this.root = null;
                }
                this.onDisconnected();
                if (this.dataset.xref) delete globalThis[this.dataset.xref];
            }
            constructor(){
                super();
                this.invokeConstructor = true;
                if ($f2f01f7f560a1091$var$Element.debug) console.log('CREATED ' + this.tagName);
                this._super = {
                };
                for (let i of Object.entries(this.constructor.prototype._super)){
                    this._super[i[0]] = {
                    };
                    for (let j of Object.entries(i[1]))this._super[i[0]][j[0]] = j[1].bind(this);
                }
                this.onCreated();
            }
        };
        $j3ZoB$Rinn.override(newElement.prototype, $f2f01f7f560a1091$var$Element);
        const proto = {
        };
        const _super = {
        };
        const events = $j3ZoB$Rinn.clone($f2f01f7f560a1091$var$Element.events);
        let __init = true;
        let __ready = true;
        let __rready = true;
        let __check;
        for(let i5 = 0; i5 < protos.length; i5++){
            if (!protos[i5]) continue;
            if ($j3ZoB$Rinn.typeOf(protos[i5]) == 'string') {
                const name = protos[i5];
                protos[i5] = $f2f01f7f560a1091$var$elementPrototypes[name];
                if (!protos[i5]) continue;
                _super[name] = {
                };
                for(let f in protos[i5]){
                    if ($j3ZoB$Rinn.typeOf(protos[i5][f]) != 'function') continue;
                    _super[name][f] = protos[i5][f];
                }
                __init = false;
                __ready = false;
                __rready = false;
                __check = false;
            } else {
                $f2f01f7f560a1091$var$Element.preparePrototype(protos[i5]);
                __check = true;
            }
            if ('_super' in protos[i5]) $j3ZoB$Rinn.override(_super, protos[i5]._super);
            if ('events' in protos[i5]) $j3ZoB$Rinn.override(events, protos[i5].events);
            $j3ZoB$Rinn.override(newElement.prototype, protos[i5]);
            $j3ZoB$Rinn.override(proto, protos[i5]);
            if (__check) {
                if (!__init && 'init' in protos[i5]) __init = true;
                if (!__ready && 'ready' in protos[i5]) __ready = true;
                if (!__rready && 'rready' in protos[i5]) __rready = true;
            }
        }
        let dummy = function() {
        };
        if (!__init) {
            newElement.prototype.init = dummy;
            proto.init = dummy;
        }
        if (!__ready) {
            newElement.prototype.ready = dummy;
            proto.ready = dummy;
        }
        if (!__rready) {
            newElement.prototype.rready = dummy;
            proto.rready = dummy;
        }
        newElement.prototype._super = _super;
        newElement.prototype.events = events;
        proto._super = _super;
        proto.events = events;
        customElements.define(name, newElement);
        $f2f01f7f560a1091$var$elementPrototypes[name] = proto;
        $f2f01f7f560a1091$var$elementClasses[name] = newElement;
        return newElement;
    },
    /*
	**	Expands an already created custom element with the specified prototype(s).
	**
	**	>> void expand (string elementName, ...object protos);
	*/ expand: function(name, ...protos) {
        if (!(name in $f2f01f7f560a1091$var$elementPrototypes)) return;
        const self = $f2f01f7f560a1091$var$elementPrototypes[name];
        const elem = $f2f01f7f560a1091$var$elementClasses[name];
        const _super = self._super;
        const events = self.events;
        for (let proto of protos){
            $f2f01f7f560a1091$var$Element.preparePrototype(proto);
            if ('_super' in proto) $j3ZoB$Rinn.override(_super, proto._super);
            if ('events' in proto) $j3ZoB$Rinn.override(events, proto.events);
            $j3ZoB$Rinn.override(elem.prototype, proto);
            $j3ZoB$Rinn.override(self, proto);
        }
        elem.prototype._super = _super;
        elem.prototype.events = events;
        self._super = _super;
        self.events = events;
    },
    /*
	**	Appends a hook to a function of a custom element.
	*/ hookAppend: function(name, functionName, newFunction) {
        if (!(name in $f2f01f7f560a1091$var$elementPrototypes)) return;
        let hook1 = $j3ZoB$Rinn.hookAppend($f2f01f7f560a1091$var$elementPrototypes[name], functionName, newFunction);
        let hook2 = $j3ZoB$Rinn.hookAppend($f2f01f7f560a1091$var$elementClasses[name].prototype, functionName, newFunction);
        return {
            unhook: function() {
                hook1.unhook();
                hook2.unhook();
            }
        };
    },
    /*
	**	Prepends a hook to a function of a custom element.
	*/ hookPrepend: function(name, functionName, newFunction) {
        if (!(name in $f2f01f7f560a1091$var$elementPrototypes)) return;
        let hook1 = $j3ZoB$Rinn.hookPrepend($f2f01f7f560a1091$var$elementPrototypes[name], functionName, newFunction);
        let hook2 = $j3ZoB$Rinn.hookPrepend($f2f01f7f560a1091$var$elementClasses[name].prototype, functionName, newFunction);
        return {
            unhook: function() {
                hook1.unhook();
                hook2.unhook();
            }
        };
    },
    /**
	**	Built-in action handlers.
	*/ /**
	**	:toggleClass <className> [<selector>]
	**
	**	Toggles a CSS class on the element.
	*/ ':toggleClass': function(args, evt) {
        let elem = evt.source;
        if ('2' in args) elem = document.querySelector(args[2]);
        if (!elem) return;
        if (elem.classList.contains(args[1])) elem.classList.remove(args[1]);
        else elem.classList.add(args[1]);
    },
    /**
	**	:setClass <className> [<selector>]
	**
	**	Sets a CSS class on the element.
	*/ ':setClass': function(args, evt) {
        let elem = evt.source;
        if ('2' in args) elem = document.querySelector(args[2]);
        if (!elem) return;
        elem.classList.add(args[1]);
    },
    /**
	**	:volatileClass <className> [<selector>]
	**
	**	Adds the CSS class to the element and any click outside will cause it to be removed.
	*/ ':volatileClass': function(args, evt) {
        let elem = evt.source;
        if ('2' in args) elem = document.querySelector(args[2]);
        if (!elem) return;
        elem.classList.add(args[1]);
        let fn = ()=>{
            window.removeEventListener('click', fn, true);
            elem.classList.remove(args[1]);
        };
        window.addEventListener('click', fn, true);
    },
    /**
	**	:toggleClassUnique <className> <parentSelector> <childSelector>
	**
	**	Toggles a CSS class on the element and only one element in the selected parent can have the class.
	*/ ':toggleClassUnique': function(args, evt) {
        let elem1 = evt.source;
        if (!elem1) return;
        if (elem1.classList.contains(args[1])) elem1.classList.remove(args[1]);
        else {
            elem1.querySelectorParent(args[2]).querySelectorAll(args[3]).forEach((elem)=>elem.classList.remove(args[1])
            );
            elem1.classList.add(args[1]);
        }
    },
    /**
	**	:setClassUnique <className> <parentSelector> <childSelector>
	**
	**	Sets a CSS class on the element and only that element in the selected parent can have the class.
	*/ ':setClassUnique': function(args, evt) {
        let elem2 = evt.source;
        if (!elem2) return;
        elem2.querySelectorParent(args[2]).querySelectorAll(args[3]).forEach((elem)=>elem.classList.remove(args[1])
        );
        elem2.classList.add(args[1]);
    }
};
$f2f01f7f560a1091$var$Element.debug = false;
$f2f01f7f560a1091$var$Element.register('r-elem', {
});
$f2f01f7f560a1091$var$Element.register('r-dom-probe', {
});
/* ****************************************** */ /**
**	Finds the parent element given a selector.
*/ HTMLElement.prototype.querySelectorParent = function(selector) {
    let elem = this;
    while(elem != null){
        if (elem.matches(selector)) break;
        elem = elem.parentElement;
    }
    return elem;
};
var $f2f01f7f560a1091$export$2e2bcd8739ae039 = $f2f01f7f560a1091$var$Element;




if (!('fetch' in $parcel$global)) $parcel$global.fetch = $j3ZoB$nodefetch;
/**
**	API interface utility functions.
*/ const $03dfb5b808851c4b$var$Api = {
    /**
	**	Flags constants.
	*/ REQUEST_PACKAGE_SUPPORTED: 1,
    REQ64_SUPPORTED: 2,
    JSON_RESPONSE_SUPPORTED: 4,
    XML_RESPONSE_SUPPORTED: 8,
    INCLUDE_CREDENTIALS: 16,
    /**
	**	Target URL for all the API requests. Set by calling `setEndPoint`.
	*/ apiUrl: "/api",
    /**
	**	Capabilities flag.
	*/ flags: 0,
    /**
	**	Indicates if all request data will be packed into a req64 parameter instead of individual fields.
	*/ useReq64: false,
    /**
	**	Number of retries to execute each API call before giving up and invoking error handlers.
	*/ retries: 0,
    /**
	**	Headers for the request.
	*/ headers: {
    },
    /**
	**	Level of the current request. Used to detect nested requests.
	*/ _requestLevel: 0,
    /**
	**	Indicates if all API calls should be bundled in a request package. Activated by calling the packageBegin() function and finished with packageEnd().
	*/ _requestPackage: 0,
    /**
	**	When in package-mode, this contains the package data to be sent upon a call to packageEnd().
	*/ _packageData: [],
    /**
	**	Sets the API end-point URL address.
	*/ setEndPoint: function(apiUrl, flags = null) {
        if (flags === null) flags = $03dfb5b808851c4b$var$Api.REQUEST_PACKAGE_SUPPORTED | $03dfb5b808851c4b$var$Api.REQ64_SUPPORTED | $03dfb5b808851c4b$var$Api.JSON_RESPONSE_SUPPORTED | $03dfb5b808851c4b$var$Api.XML_RESPONSE_SUPPORTED | $03dfb5b808851c4b$var$Api.INCLUDE_CREDENTIALS;
        this.apiUrl = apiUrl;
        this.flags = flags;
        return this;
    },
    /**
	**	Overridable filter that processes the response from the server and returns true if it was successful. The `res` parameter indicates the response data, and `req` the request data.
	*/ responseFilter: function(res, req) {
        return true;
    },
    /**
	**	Starts "package-mode" (using the `rpkg` field). Any API calls after this will be bundled together.
	*/ packageBegin: function() {
        if (!(this.flags & $03dfb5b808851c4b$var$Api.REQUEST_PACKAGE_SUPPORTED)) return;
        this._requestPackage++;
    },
    /**
	**	Finishes "package-mode" and a single API request with the currently constructed package will be sent.
	*/ packageEnd: function(callback) {
        if (!(this.flags & $03dfb5b808851c4b$var$Api.REQUEST_PACKAGE_SUPPORTED)) return;
        if (!this._requestPackage) return;
        if (--this._requestPackage) return;
        this.packageSend(callback);
    },
    /**
	**	Starts package-mode, executes the callback and finishes package-mode. Therefore any requests made by the callback will be packed together.
	*/ packRequests: function(callback, responseCallback = null) {
        if (!(this.flags & $03dfb5b808851c4b$var$Api.REQUEST_PACKAGE_SUPPORTED)) return;
        this.packageBegin();
        callback();
        this.packageEnd(responseCallback);
    },
    /**
	**	Sends a single API request with the currently constructed package and maintains package-mode.
	*/ packageSend: function(callback) {
        if (!(this.flags & $03dfb5b808851c4b$var$Api.REQUEST_PACKAGE_SUPPORTED)) return;
        if (!this._packageData.length) return;
        let _packageData = this._packageData;
        this._packageData = [];
        var rpkg = "";
        for(var i1 = 0; i1 < _packageData.length; i1++)rpkg += "r" + i1 + "," + $j3ZoB$base64.encode(this.encodeParams(_packageData[i1][2])) + ";";
        this._showProgress();
        this.apiCall({
            rpkg: rpkg
        }, (res, req)=>{
            this._hideProgress();
            for(let i = 0; i < _packageData.length; i++)try {
                var response = res["r" + i];
                if (!response) {
                    if (_packageData[i][1] != null) _packageData[i][1](_packageData[i][2]);
                    continue;
                }
                if (_packageData[i][0] != null) {
                    if (this.responseFilter(response, _packageData[i][2])) _packageData[i][0](response, _packageData[i][2]);
                }
            } catch (e) {
            }
            if (callback) callback();
        }, (req)=>{
            this._hideProgress();
            for(let i = 0; i < _packageData.length; i++)if (_packageData[i][1] != null) _packageData[i][1](_packageData[i][2]);
        });
    },
    /**
	**	Adds CSS class 'busy' to the HTML root element, works only if running inside a browser.
	*/ _showProgress: function() {
        if ('document' in $parcel$global) {
            this._requestLevel++;
            if (this._requestLevel > 0) $parcel$global.document.documentElement.classList.add('busy');
        }
    },
    /**
	**	Removes the 'busy' CSS class from the HTML element.
	*/ _hideProgress: function() {
        if ('document' in $parcel$global) {
            this._requestLevel--;
            if (this._requestLevel) return;
            setTimeout(()=>{
                if (this._requestLevel === 0) $parcel$global.document.documentElement.classList.remove('busy');
            }, 250);
        }
    },
    /**
	 * 	Sets an HTTP header.
	 */ header: function(name, value) {
        if (value === null) delete this.headers[name];
        else this.headers[name] = value;
        return this;
    },
    /**
	**	Returns a parameter string for a GET request given an object with fields.
	*/ encodeParams: function(obj) {
        let s = [];
        if (obj instanceof FormData) for (let i of obj.entries())s.push(encodeURIComponent(i[0]) + '=' + encodeURIComponent(i[1]));
        else for(let i2 in obj)s.push(encodeURIComponent(i2) + '=' + encodeURIComponent(obj[i2]));
        return s.join('&');
    },
    /**
	**	Executes an API call to the URL stored in the `apiUrl` property. By default `httpMethod` is "auto", which will determine the best depending on the data to
	**	be sent. Any connection error will be reported to the `failure` callback, and similarly any success to the `success` callback. The `params` object can be
	**	a FormData object or just a regular object.
	*/ apiCall: function(params, success, failure, httpMethod, retries) {
        let url = this.apiUrl + '?_=' + Date.now();
        if (httpMethod) {
            httpMethod = httpMethod.toUpperCase();
            if (httpMethod != 'GET' && httpMethod != 'POST') httpMethod = 'auto';
        } else httpMethod = 'auto';
        if (retries === undefined) retries = this.retries;
        if (this._requestPackage && this.flags & $03dfb5b808851c4b$var$Api.REQUEST_PACKAGE_SUPPORTED) {
            if (!(params instanceof FormData)) params = {
                ...params
            };
            this._packageData.push([
                success,
                failure,
                params
            ]);
            return;
        }
        this._showProgress();
        let data = params;
        let options = {
            mode: 'cors',
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml,application/json;q=0.9',
                ...this.headers
            },
            method: httpMethod,
            body: null,
            multipart: false
        };
        if (this.flags & $03dfb5b808851c4b$var$Api.INCLUDE_CREDENTIALS) options.credentials = 'include';
        if (typeof data !== 'string' && !(data instanceof Blob)) {
            if (!(data instanceof FormData)) {
                data = new FormData();
                for(let i in params)if (params[i] instanceof File || params[i] instanceof Blob) data.append(i, params[i], params[i].name);
                else data.append(i, params[i]);
            }
            for (let i of data.entries())if (i[1] instanceof File || i[1] instanceof Blob) {
                options.method = 'POST';
                options.multipart = true;
                break;
            }
            if (this.useReq64 && this.flags & $03dfb5b808851c4b$var$Api.REQ64_SUPPORTED && !options.multipart) {
                let tmp = new FormData();
                tmp.append('req64', $j3ZoB$base64.encode(this.encodeParams(data)));
                data = tmp;
            }
            if (options.method == 'auto') {
                let l = 0;
                options.method = 'GET';
                for (let i of data.entries()){
                    l += i[0].length + i[1].length + 2;
                    if (l > 960) {
                        options.method = 'POST';
                        break;
                    }
                }
            }
            if (options.method == 'GET') url += '&' + this.encodeParams(data);
            else if (!options.multipart) {
                options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
                options.body = this.encodeParams(data);
            } else options.body = data;
        } else {
            if (typeof data === 'string') {
                if (data[0] === '<') {
                    if (data.endsWith('</soap:Envelope>')) options.headers['Content-Type'] = 'application/soap+xml';
                    else options.headers['Content-Type'] = 'application/xml';
                } else if (data[0] === '{') options.headers['Content-Type'] = 'application/json';
                else options.headers['Content-Type'] = 'application/octet-stream';
            } else options.headers['Content-Type'] = data.type;
            options.body = data;
        }
        $parcel$global.fetch(url, options).then((result)=>this.decodeResult(result)
        ).then((result)=>{
            this._hideProgress();
            if (!success) return;
            if (this.responseFilter(result, params)) try {
                success(result, params);
            } catch (e) {
            }
        }).catch((err)=>{
            this._hideProgress();
            if (retries == 0) {
                if (failure) failure(params);
            } else this.apiCall(data, success, failure, httpMethod, retries - 1);
        });
    },
    /**
	**	Decodes a result obtained using fetch into a usable object.
	*/ decodeResult: function(result) {
        let type = result.headers.get('content-type').split(';')[0].toLowerCase();
        if (this.flags & $03dfb5b808851c4b$var$Api.JSON_RESPONSE_SUPPORTED && type.indexOf('json') !== -1) return result.json();
        if (this.flags & $03dfb5b808851c4b$var$Api.XML_RESPONSE_SUPPORTED && type.indexOf('xml') !== -1) return new Promise((resolve, reject)=>{
            result.text().then((data)=>{
                data = (new DOMParser).parseFromString(data, 'text/xml');
                resolve(data);
            }).catch(reject);
        });
        return result.blob();
    },
    /**
	**	Makes a blob with the specified data and type.
	*/ getBlob: function(data, type) {
        return new Blob([
            data
        ], {
            type: type
        });
    },
    /**
	**	Provided access to the base64 module to encode/decode data.
	*/ base64: {
        encode: function(value) {
            return $j3ZoB$base64.encode(value);
        },
        decode: function(value) {
            return $j3ZoB$base64.decode(value);
        }
    },
    /**
	**	Executes a POST API call.
	*/ post: function(params, success, failure) {
        return this.apiCall(params, success, failure, 'POST');
    },
    /**
	**	Executes a GET API call.
	*/ get: function(params, success, failure) {
        return this.apiCall(params, success, failure, 'GET');
    },
    /**
	**	Executes an automatic API call, returns a promise.
	*/ fetch: function(params) {
        return new Promise((resolve, reject)=>{
            this.apiCall(params, resolve, reject);
        });
    },
    /**
	**	Executes an automatic API call, returns a promise.
	*/ makeUrl: function(data) {
        return this.apiUrl + (this.apiUrl.indexOf('?') == -1 ? '?' : '&') + this.encodeParams(data);
    }
};
var $03dfb5b808851c4b$export$2e2bcd8739ae039 = $03dfb5b808851c4b$var$Api;




var /*
**	Provides several methods to quickly interface with a remote data-source as defined by Wind.
*/ $c92d48c08b86e527$export$2e2bcd8739ae039 = $j3ZoB$EventDispatcher.extend({
    className: 'DataSource',
    debounceDelay: 250,
    request: null,
    includeCount: false,
    includeEnum: false,
    includeList: true,
    eid: null,
    count: 0,
    list: null,
    enum: null,
    /*
	**	Constructs the data source with the specified optional `config` parameters, any of the properties of this object can be specified
	**	in the config. Uses the given basePath as prefix for the `f` parameter for subsequent API operations, a basePath of `candies` will
	**	result in calls to `candies.list`, `candies.count`, etc.
	*/ __ctor: function(basePath, config) {
        this._super.EventDispatcher.__ctor();
        this.basePath = basePath;
        if (config) Object.assign(this, config);
        this.request = new $j3ZoB$Model(this.request);
        this.eid = Math.random().toString().substr(2);
        this.count = 0;
        this.list = new $j3ZoB$ModelList();
        this.list.dataSource = this;
        this.enum = new $j3ZoB$ModelList();
        this.enum.dataSource = this;
        this.request.addEventListener(this.eid + ':propertyChanged', this.forwardRequestEvent, this);
        this.list.addEventListener(this.eid + ':itemsCleared', this.forwardListEvent, this);
        this.list.addEventListener(this.eid + ':itemsChanged', this.forwardListEvent, this);
        this.list.addEventListener(this.eid + ':itemRemoved', this.forwardListEvent, this);
        this.list.addEventListener(this.eid + ':itemChanged', this.forwardListEvent, this);
        this.list.addEventListener(this.eid + ':itemAdded', this.forwardListEvent, this);
        this.enum.addEventListener(this.eid + ':itemsCleared', this.forwardEnumEvent, this);
        this.enum.addEventListener(this.eid + ':itemsChanged', this.forwardEnumEvent, this);
        this.enum.addEventListener(this.eid + ':itemRemoved', this.forwardEnumEvent, this);
        this.enum.addEventListener(this.eid + ':itemChanged', this.forwardEnumEvent, this);
        this.enum.addEventListener(this.eid + ':itemAdded', this.forwardEnumEvent, this);
    },
    forwardRequestEvent: function(evt, args) {
        this.prepareEvent('request' + evt.name[0].toUpperCase() + evt.name.substr(1), args).setSource(evt.source).resume();
    },
    forwardListEvent: function(evt, args) {
        this.prepareEvent('list' + evt.name[0].toUpperCase() + evt.name.substr(1), args).setSource(evt.source).resume();
    },
    forwardEnumEvent: function(evt, args) {
        this.prepareEvent('enum' + evt.name[0].toUpperCase() + evt.name.substr(1), args).setSource(evt.source).resume();
    },
    /*
	**	Executes one or more API functions (depending on `includeCount`, `includeEnum` and `includeList` properties) to retrieve the
	**	required data (uses debounce to prevent too-quick refreshes).
	**
	**	Refresh mode can be: order, filter, range or full. Setting `mode` to `true` will cause a full refresh without debouncing.
	*/ refresh: function(mode = 'full', callback = null) {
        if (typeof mode == 'function') {
            callback = mode;
            mode = 'full';
        }
        if (this._timeout) {
            clearTimeout(this._timeout);
            this._timeout = null;
        }
        const fn = ()=>{
            this._timeout = null;
            $03dfb5b808851c4b$export$2e2bcd8739ae039.packageBegin();
            if (this.includeCount && (mode == 'full' || mode == 'filter')) this.fetchCount();
            if (this.includeEnum && mode == 'full') this.fetchEnum();
            if (this.includeList) this.fetchList();
            $03dfb5b808851c4b$export$2e2bcd8739ae039.packageEnd(callback);
        };
        if (mode === true) {
            mode = 'full';
            fn();
        } else this._timeout = setTimeout(fn, this.debounceDelay);
    },
    /*
	**	Searches for the item in `list` that matches the specified `fields` and sends it to the callback. If no item is found (or if `forced` is true),
	**	a call to API function `.get` will be executed with the fields as request parameters. Returns a promise.
	*/ fetch: function(fields, forced = false) {
        return new Promise((resolve, reject)=>{
            let item = forced == true ? null : this.list.find(fields, true);
            if (!item) this.fetchOne(fields, (r)=>{
                if (r && r.response == 200) {
                    if (r.data.length > 0) resolve(r.data[0]);
                    else reject(r);
                } else reject(r);
            });
            else resolve(item.get());
        });
    },
    /*
	**	Removes an item from the remote data source by executing the `.delete` API function, passes the given `fields` as request
	**	parameters. Returns a promise.
	*/ delete: function(params) {
        return new Promise((resolve, reject)=>{
            this.fetchDelete(params, (r)=>{
                if (r.response == 200) resolve(r);
                else reject(r.error);
            });
        });
    },
    fetchList: function() {
        let data = {
            ...this.request.get()
        };
        data.f = this.basePath + '.list';
        this.dispatchEvent('listLoading');
        $03dfb5b808851c4b$export$2e2bcd8739ae039.fetch(data).then((r)=>{
            this.list.setData(r.response == 200 ? r.data : null);
            this.dispatchEvent('listLoaded');
            this.dispatchEvent('listChanged');
        });
    },
    fetchEnum: function() {
        let data = {
            ...this.request.get()
        };
        data.f = this.basePath + '.enum';
        this.dispatchEvent('enumLoading');
        $03dfb5b808851c4b$export$2e2bcd8739ae039.fetch(data).then((r)=>{
            this.enum.setData(r.response == 200 ? r.data : null);
            this.dispatchEvent('enumLoaded');
            this.dispatchEvent('enumChanged');
        });
    },
    fetchCount: function() {
        let data = {
            ...this.request.get()
        };
        data.f = this.basePath + '.count';
        this.dispatchEvent('countLoading');
        $03dfb5b808851c4b$export$2e2bcd8739ae039.fetch(data).then((r)=>{
            this.count = r.response == 200 ? r.count : 0;
            this.dispatchEvent('countLoaded');
            this.dispatchEvent('countChanged');
        });
    },
    fetchOne: function(params, callback) {
        let data = {
            ...this.request.get(),
            ...params
        };
        data.f = this.basePath + '.get';
        $03dfb5b808851c4b$export$2e2bcd8739ae039.fetch(data).then((r)=>{
            callback(r);
        });
    },
    fetchDelete: function(params, callback) {
        let data = {
            ...this.request.get(),
            ...params
        };
        data.f = this.basePath + '.delete';
        $03dfb5b808851c4b$export$2e2bcd8739ae039.fetch(data).then((r)=>{
            callback(r);
        });
    },
    fetchData: function(params) {
        let data = {
            ...this.request.get(),
            ...params
        };
        if (data.f[0] == '.') data.f = this.basePath + data.f;
        return $03dfb5b808851c4b$export$2e2bcd8739ae039.fetch(data);
    },
    makeUrl: function(params) {
        let data = {
            ...this.request.get(),
            ...params
        };
        if (data.f[0] == '.') data.f = this.basePath + data.f;
        return $03dfb5b808851c4b$export$2e2bcd8739ae039.makeUrl(data);
    }
});




var /*
**	Provides an interface to connect with a listing API function.
*/ $3f534db4f9a2dc0d$export$2e2bcd8739ae039 = $j3ZoB$ModelList.extend({
    className: 'DataList',
    debounceDelay: 250,
    request: null,
    eid: null,
    /*
	**	Constructs the data list with the specified optional `config` parameters, any of the properties of this object can be specified
	**	in the config. The given `f` parameter is passed directly as a request parameter to the API.
	*/ __ctor: function(f, config = null) {
        this._super.ModelList.__ctor();
        if (config !== null) Object.assign(this, config);
        if (!this.request) this.request = {
        };
        this.request.f = f;
        this.request = new $j3ZoB$Model(this.request);
        this.eid = Math.random().toString().substr(2);
        this.dataList = this;
        this.request.addEventListener(this.eid + ':propertyChanged', this.forwardRequestEvent, this);
    },
    forwardRequestEvent: function(evt, args) {
        this.prepareEvent('request' + evt.name[0].toUpperCase() + evt.name.substr(1), args).setSource(evt.source).resume();
    },
    /*
	**	Executes a request to retrieve the data for the list (uses debounce to prevent too-quick refreshes).
	*/ refresh: function(callback = null, _callback = null) {
        if (this._timeout) {
            clearTimeout(this._timeout);
            this._timeout = null;
        }
        if (callback === true) {
            this.dispatchEvent('listLoading');
            $03dfb5b808851c4b$export$2e2bcd8739ae039.fetch(this.request.get()).then((r)=>{
                this.setData(r.response == 200 ? r.data : null);
                this.dispatchEvent('listLoaded');
                this.dispatchEvent('listChanged');
                if (_callback !== null) _callback();
            });
            return;
        }
        const fn = ()=>{
            this.refresh(true, callback);
        };
        this._timeout = setTimeout(fn, this.debounceDelay);
    }
});


/*
**	riza/easing
**
**	Copyright (c) 2016-2021, RedStar Technologies, All rights reserved.
**	https://www.rsthn.com/
**
**	THIS LIBRARY IS PROVIDED BY REDSTAR TECHNOLOGIES "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES,
**	INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A 
**	PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL REDSTAR TECHNOLOGIES BE LIABLE FOR ANY
**	DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT 
**	NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; 
**	OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, 
**	STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE
**	USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/ /**
**	Collection of useful easing functions (imported from Cherry source code).
*/ const $b01cf61b5fd2eff8$var$Easing = {
    /**
	**	Interpolates numeric values between two objects (`src` and `dst`) using the specified `duration` (in seconds) and `easing` function. Note that all four parameters
	**	`src`, `dst`, `duration` and `easing` must be objects having the same number of values.
	*/ interpolate: function(src, dst, duration, easing, callback /* function(data, isFinished) */ ) {
        let time = {
        };
        let data = {
        };
        let count = 0;
        for(let x in src){
            time[x] = 0;
            data[x] = src[x];
            count++;
        }
        let lastTime = Date.now() / 1000;
        let dt = 0;
        let interpolator = function() {
            let curTime = Date.now() / 1000;
            dt = curTime - lastTime;
            lastTime = curTime;
            for(let x in time){
                if (time[x] == duration[x]) continue;
                time[x] += dt;
                if (time[x] >= duration[x]) {
                    time[x] = duration[x];
                    count--;
                }
                let t = easing[x](time[x] / duration[x]);
                data[x] = (1 - t) * src[x] + t * dst[x];
            }
            callback(data, count == 0);
            if (count != 0) requestAnimationFrame(interpolator);
        };
        interpolator();
    },
    /* ******************************************** */ Linear: {
        IN: function(t) {
            return t;
        },
        OUT: function(t) {
            return t;
        },
        IN_OUT: function(t) {
            return t;
        }
    },
    /* ******************************************** */ Back: {
        k: 1.70158,
        IN: function(t, k) {
            if (k === undefined) k = $b01cf61b5fd2eff8$var$Easing.Back.k;
            return t * t * ((k + 1) * t - k);
        },
        OUT: function(t, k) {
            return 1 - $b01cf61b5fd2eff8$var$Easing.Back.IN(1 - t, k);
        },
        IN_OUT: function(t, k) {
            if (t < 0.5) return $b01cf61b5fd2eff8$var$Easing.Back.IN(t * 2, k) / 2;
            else return $b01cf61b5fd2eff8$var$Easing.Back.OUT((t - 0.5) * 2, k) / 2 + 0.5;
        }
    },
    /* ******************************************** */ Bounce: {
        getConst: function(t) {
            if (t < 1 / 2.75) return 7.5625 * t * t;
            else if (t < 2 / 2.75) return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
            else if (t < 2.5 / 2.75) return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
            return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
        },
        IN: function(t) {
            return 1 - $b01cf61b5fd2eff8$var$Easing.Bounce.getConst(1 - t);
        },
        OUT: function(t) {
            return $b01cf61b5fd2eff8$var$Easing.Bounce.getConst(t);
        },
        IN_OUT: function(t) {
            if (t < 0.5) return (1 - $b01cf61b5fd2eff8$var$Easing.Bounce.getConst(1 - 2 * t)) / 2;
            else return $b01cf61b5fd2eff8$var$Easing.Bounce.getConst((t - 0.5) * 2) / 2 + 0.5;
        }
    },
    /* ******************************************** */ Circ: {
        IN: function(t) {
            return 1 - Math.sqrt(1 - t * t);
        },
        OUT: function(t) {
            return 1 - $b01cf61b5fd2eff8$var$Easing.Circ.IN(1 - t);
        },
        IN_OUT: function(t) {
            if (t < 0.5) return $b01cf61b5fd2eff8$var$Easing.Circ.IN(t * 2) / 2;
            else return $b01cf61b5fd2eff8$var$Easing.Circ.OUT((t - 0.5) * 2) / 2 + 0.5;
        }
    },
    /* ******************************************** */ Cubic: {
        IN: function(t) {
            return t * t * t;
        },
        OUT: function(t) {
            return 1 - $b01cf61b5fd2eff8$var$Easing.Cubic.IN(1 - t);
        },
        IN_OUT: function(t) {
            if (t < 0.5) return $b01cf61b5fd2eff8$var$Easing.Cubic.IN(t * 2) / 2;
            else return $b01cf61b5fd2eff8$var$Easing.Cubic.OUT((t - 0.5) * 2) / 2 + 0.5;
        }
    },
    /* ******************************************** */ Expo: {
        IN: function(t) {
            return Math.pow(2, 12 * (t - 1));
        },
        OUT: function(t) {
            return -Math.pow(2, -12 * t) + 1;
        },
        IN_OUT: function(t) {
            if ((t *= 2) < 1) return Math.pow(2, 12 * (t - 1)) / 2;
            else return (-Math.pow(2, -12 * (t - 1)) + 2) / 2;
        }
    },
    /* ******************************************** */ Power: {
        p: 12,
        IN: function(t) {
            return Math.pow(t, $b01cf61b5fd2eff8$var$Easing.Power.p);
        },
        OUT: function(t) {
            return 1 - $b01cf61b5fd2eff8$var$Easing.Power.IN(1 - t);
        },
        IN_OUT: function(t) {
            if (t < 0.5) return $b01cf61b5fd2eff8$var$Easing.Power.IN(t * 2) / 2;
            else return $b01cf61b5fd2eff8$var$Easing.Power.OUT((t - 0.5) * 2) / 2 + 0.5;
        }
    },
    /* ******************************************** */ Quad: {
        IN: function(t) {
            return t * t;
        },
        OUT: function(t) {
            return 1 - $b01cf61b5fd2eff8$var$Easing.Quad.IN(1 - t);
        },
        IN_OUT: function(t) {
            if (t < 0.5) return $b01cf61b5fd2eff8$var$Easing.Quad.IN(t * 2) / 2;
            else return $b01cf61b5fd2eff8$var$Easing.Quad.OUT((t - 0.5) * 2) / 2 + 0.5;
        }
    },
    /* ******************************************** */ Quartic: {
        IN: function(t) {
            return t * t * t * t;
        },
        OUT: function(t) {
            return 1 - $b01cf61b5fd2eff8$var$Easing.Quartic.IN(1 - t);
        },
        IN_OUT: function(t) {
            if (t < 0.5) return $b01cf61b5fd2eff8$var$Easing.Quartic.IN(t * 2) / 2;
            else return $b01cf61b5fd2eff8$var$Easing.Quartic.OUT((t - 0.5) * 2) / 2 + 0.5;
        }
    },
    /* ******************************************** */ Quintic: {
        IN: function(t) {
            return t * t * t * t * t;
        },
        OUT: function(t) {
            return 1 - $b01cf61b5fd2eff8$var$Easing.Quintic.IN(1 - t);
        },
        IN_OUT: function(t) {
            if (t < 0.5) return $b01cf61b5fd2eff8$var$Easing.Quintic.IN(t * 2) / 2;
            else return $b01cf61b5fd2eff8$var$Easing.Quintic.OUT((t - 0.5) * 2) / 2 + 0.5;
        }
    },
    /* ******************************************** */ Sine: {
        IN: function(t) {
            return 1 - Math.sin(1.5708 * (1 - t));
        },
        OUT: function(t) {
            return Math.sin(1.5708 * t);
        },
        IN_OUT: function(t) {
            return (Math.cos(3.1416 * t) - 1) / -2;
        }
    },
    /* ******************************************** */ Step: {
        IN: function(t) {
            return t != 1 ? 0 : 1;
        },
        OUT: function(t) {
            return t != 1 ? 0 : 1;
        },
        IN_OUT: function(t) {
            return t != 1 ? 0 : 1;
        }
    }
};
var $b01cf61b5fd2eff8$export$2e2bcd8739ae039 = $b01cf61b5fd2eff8$var$Easing;



/**
**	Class to animate properties using rules (imported from Cherry source code).
*/ const $3807f10d3d8a70da$var$Anim = $j3ZoB$Class.extend({
    list: null,
    initialData: null,
    data: null,
    stack: null,
    block: null,
    timeScale: 1,
    time: 0,
    blockTime: 0,
    index: 0,
    paused: false,
    finished: false,
    onFinishedCallback: null,
    onUpdatedCallback: null,
    __ctor: function() {
        this.list = [];
        this.initialData = {
        };
        this.data = {
        };
        this.stack = [];
        this.block = this.list;
        this.reset();
    },
    __dtor: function() {
    },
    clone: function() {
        let a = new $3807f10d3d8a70da$var$Anim();
        a.list = this.list;
        a.initialData = this.initialData;
        return a.reset();
    },
    onFinished: function(callback) {
        this.onFinishedCallback = callback;
        return this;
    },
    onUpdated: function(callback) {
        this.onUpdatedCallback = callback;
        return this;
    },
    // Resets the animation to its initial state.
    reset: function() {
        this.stack.length = 0;
        this.blockTime = 0;
        this.time = 0;
        this.index = 0;
        this.block = this.list;
        this.paused = true;
        this.finished = false;
        this.handle = null;
        for(let i in this.initialData)this.data[i] = this.initialData[i];
        return this;
    },
    // Sets the initial data.
    initial: function(data) {
        this.initialData = data;
        return this.reset();
    },
    // Sets the time scale (animation speed).
    speed: function(value) {
        this.timeScale = value > 0 ? value : 1;
        return this;
    },
    // Sets the output data object.
    setOutput: function(data) {
        this.data = data;
        return this;
    },
    // Pauses the animation.
    pause: function() {
        if (this.paused) return;
        clearInterval(this.handle);
        this.paused = true;
    },
    // Resumes the animation.
    resume: function() {
        if (!this.paused) return;
        let lastTime = Date.now() / 1000;
        this.handle = setInterval(()=>{
            let curTime = Date.now() / 1000;
            let dt = curTime - lastTime;
            lastTime = curTime;
            this.update(dt);
            if (this.onUpdatedCallback) this.onUpdatedCallback(this.data, this);
        }, 16);
        if (this.onUpdatedCallback) this.onUpdatedCallback(this.data, this);
        this.paused = false;
    },
    // Updates the animation by the specified delta time (seconds).
    update: function(dt) {
        if (this.paused) return false;
        if (this.index >= this.block.length) return true;
        let i = 0;
        let _block;
        let _index;
        let _blockTime;
        this.time += dt * this.timeScale;
        while(this.index < this.block.length){
            let cmd = this.block[this.index];
            let duration;
            switch(cmd.op){
                case "parallel":
                    if (cmd.started == false) {
                        cmd.blocks.length = 0;
                        cmd.started = true;
                        for(i = 0; i < cmd.block.length; i++){
                            cmd.blocks.push([
                                cmd.block[i]
                            ]);
                            cmd.indices[i] = 0;
                            cmd.blockTimes[i] = this.blockTime;
                        }
                    }
                    _block = this.block;
                    _index = this.index;
                    _blockTime = this.blockTime;
                    let n = 0;
                    let blockTime = _blockTime;
                    for(i = 0; i < cmd.blocks.length; i++){
                        this.block = cmd.blocks[i];
                        this.index = cmd.indices[i];
                        this.blockTime = cmd.blockTimes[i];
                        if (this.update(0) === true) n++;
                        if (this.blockTime > blockTime) blockTime = this.blockTime;
                        cmd.blockTimes[i] = this.blockTime;
                        cmd.blocks[i] = this.block;
                        cmd.indices[i] = this.index;
                    }
                    this.block = _block;
                    this.index = _index;
                    this.blockTime = _blockTime;
                    if (cmd.fn) cmd.fn.call(this);
                    if (n != cmd.blocks.length) return false;
                    cmd.started = false;
                    this.blockTime = blockTime;
                    this.index++;
                    break;
                case "serial":
                    if (cmd.started == false) {
                        cmd._block = cmd.block;
                        cmd._index = 0;
                        cmd._blockTime = this.blockTime;
                        cmd.started = true;
                    }
                    _block = this.block;
                    _index = this.index;
                    _blockTime = this.blockTime;
                    this.block = cmd._block;
                    this.index = cmd._index;
                    this.blockTime = cmd._blockTime;
                    i = this.update(0);
                    cmd._block = this.block;
                    cmd._index = this.index;
                    cmd._blockTime = this.blockTime;
                    this.block = _block;
                    this.index = _index;
                    this.blockTime = _blockTime;
                    if (cmd.fn) cmd.fn.call(this);
                    if (i !== true) return false;
                    cmd.started = false;
                    this.blockTime = cmd._blockTime;
                    this.index++;
                    break;
                case "repeat":
                    if (cmd.started == false) {
                        cmd._block = cmd.block;
                        cmd._index = 0;
                        cmd._blockTime = this.blockTime;
                        cmd._count = cmd.count;
                        cmd.started = true;
                    }
                    _block = this.block;
                    _index = this.index;
                    _blockTime = this.blockTime;
                    this.block = cmd._block;
                    this.index = cmd._index;
                    this.blockTime = cmd._blockTime;
                    i = this.update(0);
                    cmd._block = this.block;
                    cmd._index = this.index;
                    cmd._blockTime = this.blockTime;
                    this.block = _block;
                    this.index = _index;
                    this.blockTime = _blockTime;
                    if (cmd.fn) cmd.fn.call(this);
                    if (i !== true) return false;
                    if (cmd._count <= 1) {
                        cmd.started = false;
                        this.blockTime = cmd._blockTime;
                        this.index++;
                        return false;
                    } else {
                        cmd._index = 0;
                        cmd._count--;
                        return false;
                    }
                    break;
                case "set":
                    this.data[cmd.field] = cmd.value;
                    this.index++;
                    break;
                case "restart":
                    this.index = 0;
                    break;
                case "wait":
                    duration = $j3ZoB$Rinn.typeOf(cmd.duration) == "string" ? this.data[cmd.duration] : cmd.duration;
                    if (this.time < this.blockTime + duration) return false;
                    this.blockTime += duration;
                    this.index++;
                    break;
                case "range":
                    if (cmd.started == false) {
                        if (cmd.startValue === null) cmd._startValue = this.data[cmd.field];
                        else cmd._startValue = cmd.startValue;
                        cmd._endValue = cmd.endValue;
                        cmd.started = true;
                    }
                    duration = $j3ZoB$Rinn.typeOf(cmd.duration) == "string" ? this.data[cmd.duration] : cmd.duration;
                    if (this.time < this.blockTime + duration) dt = (this.time - this.blockTime) / duration;
                    else dt = 1;
                    if (cmd.easing && dt != 1) this.data[cmd.field] = cmd.easing(dt) * (cmd._endValue - cmd._startValue) + cmd._startValue;
                    else this.data[cmd.field] = dt * (cmd._endValue - cmd._startValue) + cmd._startValue;
                    if (dt != 1) return false;
                    cmd.started = false;
                    this.blockTime += duration;
                    this.index++;
                    break;
                case "rand":
                    if (cmd.started == false) {
                        cmd.started = true;
                        cmd.last = null;
                    }
                    duration = $j3ZoB$Rinn.typeOf(cmd.duration) == "string" ? this.data[cmd.duration] : cmd.duration;
                    if (this.time < this.blockTime + duration) dt = (this.time - this.blockTime) / duration;
                    else dt = 1;
                    if (cmd.easing && dt != 1) cmd.cur = ~~(cmd.easing(dt) * cmd.count);
                    else cmd.cur = ~~(dt * cmd.count);
                    if (cmd.cur != cmd.last) {
                        while(true){
                            i = ~~(Math.random() * (cmd.endValue - cmd.startValue + 1)) + cmd.startValue;
                            if (i != this.data[cmd.field]) break;
                        }
                        this.data[cmd.field] = i;
                        cmd.last = cmd.cur;
                    }
                    if (dt != 1) return false;
                    cmd.started = false;
                    this.blockTime += duration;
                    this.index++;
                    break;
                case "randt":
                    duration = $j3ZoB$Rinn.typeOf(cmd.duration) == "string" ? this.data[cmd.duration] : cmd.duration;
                    if (this.time < this.blockTime + duration) dt = (this.time - this.blockTime) / duration;
                    else dt = 1;
                    if (cmd.easing && dt != 1) i = cmd.easing(dt) * (cmd.count - 1);
                    else i = dt * (cmd.count - 1);
                    this.data[cmd.field] = cmd.table[~~((i + cmd.count) % cmd.count)];
                    if (dt != 1) return false;
                    this.blockTime += duration;
                    this.index++;
                    break;
                case "play":
                    cmd.snd.play();
                    this.index++;
                    break;
                case "exec":
                    cmd.fn.call(this, this);
                    this.index++;
                    break;
            }
        }
        if (this.block == this.list) {
            if (!this.finished && this.onFinishedCallback != null) this.onFinishedCallback();
            this.pause();
            this.finished = true;
        }
        return true;
    },
    // Runs the subsequent commands in parallel. Should end the parallel block by calling end().
    parallel: function() {
        let block = [];
        this.block.push({
            op: "parallel",
            started: false,
            block: block,
            blocks: [],
            indices: [],
            blockTimes: []
        });
        this.stack.push(this.block);
        this.block = block;
        return this;
    },
    // Runs the subsequent commands in series. Should end the serial block by calling end().
    serial: function() {
        let block = [];
        this.block.push({
            op: "serial",
            started: false,
            block: block
        });
        this.stack.push(this.block);
        this.block = block;
        return this;
    },
    // Repeats a block the specified number of times.
    repeat: function(count) {
        let block = [];
        this.block.push({
            op: "repeat",
            started: false,
            block: block,
            count: count
        });
        this.stack.push(this.block);
        this.block = block;
        return this;
    },
    // Sets the callback of the current block.
    callback: function(fn) {
        let block = this.stack[this.stack.length - 1];
        block[block.length - 1].fn = fn;
        return this;
    },
    // Ends a parallel(), serial() or repeat() block.
    end: function() {
        this.block = this.stack.pop();
        return this;
    },
    // Sets the value of a variable.
    set: function(field, value) {
        this.block.push({
            op: "set",
            field: field,
            value: value
        });
        return this;
    },
    // Restarts the current block.
    restart: function(duration) {
        this.block.push({
            op: "restart"
        });
        return this;
    },
    // Waits for the specified duration.
    wait: function(duration) {
        this.block.push({
            op: "wait",
            duration: duration
        });
        return this;
    },
    // Sets the range of a variable.
    range: function(field, duration, startValue, endValue, easing) {
        this.block.push({
            op: "range",
            started: false,
            field: field,
            duration: duration,
            startValue: startValue,
            endValue: endValue,
            easing: easing ? easing : null
        });
        return this;
    },
    // Generates a certain amount of random numbers in the given range (inclusive).
    rand: function(field, duration, count, startValue, endValue, easing) {
        this.block.push({
            op: "rand",
            started: false,
            field: field,
            duration: duration,
            count: count,
            startValue: startValue,
            endValue: endValue,
            easing: easing ? easing : null
        });
        return this;
    },
    // Generates a certain amount of random numbers in the given range (inclusive). This uses a static random table to determine the next values.
    randt: function(field, duration, count, startValue, endValue, easing) {
        let table = [];
        for(let i = 0; i < count; i++)table.push(i % (endValue - startValue + 1) + startValue);
        for(let i1 = count >> 2; i1 > 0; i1--){
            let a = ~~(Math.random() * count);
            let b = ~~(Math.random() * count);
            let c = table[b];
            table[b] = table[a];
            table[a] = c;
        }
        this.block.push({
            op: "randt",
            field: field,
            duration: duration,
            count: count,
            startValue: startValue,
            endValue: endValue,
            table: table,
            easing: easing ? easing : null
        });
        return this;
    },
    // Plays a sound.
    play: function(snd) {
        this.block.push({
            op: "play",
            snd: snd
        });
        return this;
    },
    // Executes a function.
    exec: function(fn) {
        this.block.push({
            op: "exec",
            fn: fn
        });
        return this;
    }
});
var $3807f10d3d8a70da$export$2e2bcd8739ae039 = $3807f10d3d8a70da$var$Anim;




var $a23af1cab366283c$export$2e2bcd8739ae039 = $f2f01f7f560a1091$export$2e2bcd8739ae039.register('r-tabs', {
    /*
	**	Container element for tab content.
	*/ container: null,
    /**
	**	Element events.
	*/ 'event click [data-name]': function(evt) {
        evt.continuePropagation = true;
        if (this.dataset.baseRoute) {
            location = "#" + $cdbdea0eedb44c97$export$2e2bcd8739ae039.realLocation(this.dataset.baseRoute.replace('@', evt.source.dataset.name));
            return;
        }
        this.selectTab(evt.source.dataset.name);
    },
    /**
	**	Initializes the Tabs element.
	*/ init: function() {
        this._routeHandler = (evt, args)=>{
            if ($cdbdea0eedb44c97$export$2e2bcd8739ae039.location != '') this.querySelectorAll("[href]").forEach((link)=>{
                if (!link.href) return;
                if ($cdbdea0eedb44c97$export$2e2bcd8739ae039.location.startsWith(link.href.substr(link.href.indexOf('#') + 1))) link.classList.add('active');
                else link.classList.remove('active');
            });
            if (!args.route.changed) return;
            this.showTab(args.tabName);
        };
    },
    /**
	**	Executed when the children of the element are ready.
	*/ ready: function() {
        if ("container" in this.dataset) {
            if (this.dataset.container == ':previousElement') this.container = this.previousElementSibling;
            else if (this.dataset.container == ':nextElement') this.container = this.nextElementSibling;
            else if (this.dataset.container == ':none') this.container = null;
            else this.container = document.querySelector(this.dataset.container);
        } else this.container = this.nextElementSibling;
        this._hideTabsExcept(this.dataset.initial);
    },
    /**
	**	Adds a handler to Router if the data-base-route attribute was set.
	*/ onConnected: function() {
        if (this.dataset.baseRoute) $cdbdea0eedb44c97$export$2e2bcd8739ae039.addRoute(this.dataset.baseRoute.replace('@', ':tabName'), this._routeHandler);
    },
    /**
	**	Removes a handler previously added to Router if the data-base-route attribute was set.
	*/ onDisconnected: function() {
        if (this.dataset.baseRoute) $cdbdea0eedb44c97$export$2e2bcd8739ae039.removeRoute(this.dataset.baseRoute.replace('@', ':tabName'), this._routeHandler);
    },
    /**
	**	Hides all tabs except the one with the specified exceptName, if none specified then all tabs will be hidden (adds `.x-hidden` CSS class),
	**	additionally the respective link item in the tab definition will have class `.active`.
	*/ _hideTabsExcept: function(exceptName) {
        if (!exceptName) exceptName = '';
        if (this.container != null) this.container.querySelectorAll(':scope > [data-name]').forEach((i)=>{
            if (i.dataset.name == exceptName) {
                i.classList.remove('x-hidden');
                this.dispatch('tabShown', {
                    name: i.dataset.name,
                    el: i
                });
            } else {
                i.classList.add('x-hidden');
                this.dispatch('tabHidden', {
                    name: i.dataset.name,
                    el: i
                });
            }
        });
        this.querySelectorAll("[data-name]").forEach((link)=>{
            if (link.dataset.name == exceptName) link.classList.add('active');
            else link.classList.remove('active');
        });
        this.dispatch('tabChanged', {
            name: exceptName
        });
    },
    /**
	**	Shows the tab with the specified name, ignores `data-base-route` and current route as well.
	*/ showTab: function(name) {
        return this._hideTabsExcept(name);
    },
    /**
	**	Shows a tab given its name. The route will be changed automatically if `data-base-route` is enabled.
	*/ selectTab: function(name) {
        if (this.dataset.baseRoute) {
            const hash = "#" + $cdbdea0eedb44c97$export$2e2bcd8739ae039.realLocation(this.dataset.baseRoute.replace('@', name));
            if (location.hash != hash) {
                location = hash;
                return;
            }
        }
        this.showTab(name);
    }
});





var $653d148303270476$export$2e2bcd8739ae039 = $f2f01f7f560a1091$export$2e2bcd8739ae039.register('r-form', {
    /**
	**	Element events.
	*/ events: {
        'change [data-field]': '_fieldChanged',
        'click input[type=reset]': 'reset',
        'click .reset': 'reset',
        'click input[type=submit]': 'submit',
        'click button[type=submit]': 'submit',
        'click .submit': 'submit',
        'submit form': 'submit'
    },
    /*
	**	Initial form model.
	*/ model: {
    },
    /**
	**	Executed when the children of the element are ready.
	*/ ready: function() {
        let formElement = document.createElement('form');
        formElement.append(...this.childNodes);
        this.append(formElement);
        let def = {
        };
        let names = this.model.get();
        this.querySelectorAll('[data-field]').forEach((i)=>{
            i.name = i.dataset.field;
            names[i.name] = i.type;
            let val = i.dataset.default;
            if (val == undefined) switch(i.type){
                case 'radio':
                    if (!i.checked) return;
                    val = i.value;
                    break;
                case 'checkbox':
                    val = i.checked ? '1' : '0';
                    break;
                case 'field':
                    val = i.getValue();
                    break;
                case 'file':
                    val = '';
                    break;
                default:
                    val = '';
                    break;
            }
            def[i.dataset.field] = val;
        });
        for(let name in names)if (name in def) names[name] = def[name];
        else names[name] = '';
        def = names;
        this.model.defaults = def;
        this.model.reset();
        this.clearMarkers();
    },
    /*
	**	Transforms an string returned by the server to a local representation.
	*/ filterString: function(str, r) {
        if (!str || !('messages' in $parcel$global)) return str;
        if (str.startsWith('@messages.')) {
            if (str.substr(10) in $parcel$global.messages) str = $j3ZoB$Template.eval($parcel$global.messages[str.substr(10)], r);
        }
        return str;
    },
    _change: function(elem) {
        if ('createEvent' in document) {
            let evt = document.createEvent('HTMLEvents');
            evt.initEvent('change', false, true);
            elem.dispatchEvent(evt);
        } else elem.fireEvent('onchange');
    },
    _setField: function(f, value, silent) {
        if (!f) return;
        for (f of this.querySelectorAll('[data-field="' + f + '"]'))switch(f.type || f.tagName.toLowerCase()){
            case 'select':
                f.val = f.dataset.value = f.multiple ? value ? value.split(',') : value : value;
                f.value = f.val = f.dataset.value;
                if (silent !== true) this._change(f);
                break;
            case 'checkbox':
                f.checked = parseInt(value) ? true : false;
                break;
            case 'radio':
                f.checked = value == f.value;
                break;
            case 'field':
                f.val = f.dataset.value = value;
                f.setValue(value);
                break;
            case 'file':
                if (value instanceof File || value instanceof Blob) {
                    f.val = value;
                    f.dataset.value = value;
                } else if (value instanceof FileList) {
                    f.val = value;
                    f.dataset.value = value;
                } else {
                    f.val = f.dataset.value = '';
                    f.value = '';
                }
                break;
            default:
                f.val = f.dataset.value = value;
                f.value = value;
                if (silent !== true) this._change(f);
                break;
        }
    },
    _getField: function(f, _value = null, fromFileFields = false) {
        if (!f) return null;
        if (typeof f != 'string') {
            let value = f.value == null ? f.val : f.value;
            if (value === null) value = _value;
            switch(f.type || f.tagName.toLowerCase()){
                case 'select':
                    _value = f.multiple ? value ? value.join(',') : value : value;
                    break;
                case 'checkbox':
                    _value = f.checked ? '1' : '0';
                    break;
                case 'radio':
                    if (f.checked) _value = f.value;
                    break;
                case 'field':
                    _value = f.getValue();
                    break;
                case 'file':
                    _value = fromFileFields ? f.files && f.files.length ? f.multiple ? f.files : f.files[0] : null : f.val;
                    break;
                default:
                    _value = value;
                    break;
            }
            return _value === null ? '' : _value;
        }
        _value = null;
        for (f of this.querySelectorAll('[data-field="' + f + '"]'))_value = this._getField(f, _value);
        return _value === null ? '' : _value;
    },
    getField: function(name) {
        return this._getField(name);
    },
    clearMarkers: function() {
        this.classList.remove('busy');
        this.querySelectorAll('.message').forEach((i)=>i.classList.add('x-hidden')
        );
        this.querySelectorAll('span.field-error').forEach((i)=>i.remove()
        );
        this.querySelectorAll('.field-error').forEach((i)=>{
            i.classList.remove('field-error');
            i.classList.remove('is-invalid');
        });
        this.querySelectorAll('.field-passed').forEach((i)=>i.classList.remove('field-passed')
        );
    },
    _fieldChanged: function(evt) {
        let f = evt.source;
        if (f.type == 'file') this.model.set(f.dataset.field, this._getField(f, null, true), true);
        else this.model.set(f.dataset.field, this._getField(f));
        evt.continuePropagation = true;
    },
    onModelPropertyChanged: function(evt, args) {
        this._setField(args.name, args.value);
    },
    _onSuccess: function(r) {
        this.classList.remove('busy');
        let tmp;
        this.dispatch('formSuccess', r);
        if (r.message && (tmp = this.querySelector('.message.success')) != null) {
            tmp.innerHTML = this.filterString(r.message, r).replace(/\n/g, '<br/>');
            tmp.classList.remove('x-hidden');
            tmp.onanimationend = ()=>tmp.classList.add('x-hidden')
            ;
        }
    },
    _onFailure: function(r) {
        this.classList.remove('busy');
        let tmp;
        this.dispatch('formError', r);
        if (r.fields) {
            for(let i in r.fields){
                let f = this.querySelector('[data-field-container="' + i + '"]');
                if (!f) {
                    f = this.querySelector('[data-field="' + i + '"]');
                    if (!f) continue;
                }
                let tmp1 = document.createElement('span');
                tmp1.classList.add('field-error');
                tmp1.innerHTML = this.filterString(r.fields[i], r).replace(/\n/g, '<br/>');
                f.classList.add('field-error');
                f.classList.add('is-invalid');
                if (this.dataset.errorsAt == 'bottom') f.parentElement.append(tmp1);
                else if (this.dataset.errorsAt == 'top') f.parentElement.prepend(tmp1);
                else f.parentElement.insertBefore(tmp1, f.nextElementSibling);
                setTimeout(function(tmp) {
                    return function() {
                        tmp.classList.add('active');
                    };
                }(tmp1), 25);
            }
            if (r.error && (tmp = this.querySelector('.message.error')) != null) {
                tmp.innerHTML = this.filterString(r.error, r).replace(/\n/g, '<br/>');
                tmp.classList.remove('x-hidden');
                tmp.onanimationend = ()=>tmp.classList.add('x-hidden')
                ;
            }
        } else if ((tmp = this.querySelector('.message.error')) != null) {
            tmp.innerHTML = this.filterString(r.error, r).replace(/\n/g, '<br/>') || 'Error: ' + r.response;
            tmp.classList.remove('x-hidden');
            tmp.onanimationend = ()=>tmp.classList.add('x-hidden')
            ;
        }
    },
    reset: function(nsilent) {
        this.model.reset(nsilent);
        this.clearMarkers();
        if (nsilent === false) for(var i in this.model.data)this._setField(i, this.model.data[i], true);
        return false;
    },
    submit: function() {
        if (this.classList.contains('busy')) return;
        let data = {
        };
        if (this.dataset.strict == 'false') Object.assign(data, this.model.get());
        let list = {
        };
        this.querySelectorAll('[data-field]').forEach((e)=>list[e.dataset.field] = true
        );
        Object.keys(list).forEach((f)=>data[f] = this._getField(f)
        );
        this.model.set(data);
        let f1 = this.dataset.formAction || this.formAction;
        if (!f1) return;
        this.clearMarkers();
        this.classList.add('busy');
        if (typeof f1 != 'function') {
            data.f = f1;
            var _method;
            $03dfb5b808851c4b$export$2e2bcd8739ae039.apiCall(data, (r)=>this[r.response == 200 ? '_onSuccess' : '_onFailure'](r)
            , (r)=>this._onFailure({
                    error: 'Unable to execute request.'
                })
            , (_method = this.dataset.method) !== null && _method !== void 0 ? _method : 'POST');
        } else f1(data, (r)=>this[r.response == 200 ? '_onSuccess' : '_onFailure'](r)
        );
    }
});




var $eccb61e2eee7209a$export$2e2bcd8739ae039 = $f2f01f7f560a1091$export$2e2bcd8739ae039.register('r-panel', {
    /**
	**	Route object used by this element.
	*/ route: null,
    /**
	**	Initializes the element.
	*/ init: function() {
        this.style.display = '';
        // Executed then the panel route is activated.
        this._onActivate = (evt, args)=>{
            if (!args.route.changed) return;
            this.show(true);
        };
        // Executed then the panel route is deactivated.
        this._onDeactivate = (evt, args)=>{
            this.hide();
        };
        this.hide();
    },
    /**
	**	Adds a handler to Router if the data-route attribute was set.
	*/ onConnected: function() {
        if (this.dataset.route) {
            this.route = $cdbdea0eedb44c97$export$2e2bcd8739ae039.addRoute(this.dataset.route, this._onActivate, this._onDeactivate);
            this.classList.remove('active');
        } else this.classList.add('active');
    },
    /**
	**	Removes a handler previously added to Router if the data-route attribute was set.
	*/ onDisconnected: function() {
        if (this.dataset.route) $cdbdea0eedb44c97$export$2e2bcd8739ae039.removeRoute(this.dataset.route, this._onActivate, this._onDeactivate);
    },
    /**
	**	Hides the panel by removing the `active` class from the element. Fires `panelHidden` event.
	*/ hide: function() {
        this.classList.remove('active');
        this.dispatch('panelHidden', this.route ? this.route.args : {
        });
    },
    /**
	**	Shows the panel visible by adding `active` class to the element. If `silent` is true and `data-route` enabled, the current route
	**	will not be updated. Fires `panelShown` event.
	*/ show: function(silent = false) {
        if (this.dataset.route && !silent) {
            let hash = "#" + this.dataset.route;
            if (window.location.hash.substr(0, hash.length) != hash) {
                window.location = hash;
                return;
            }
        }
        this.classList.add('active');
        this.dispatch('panelShown', this.route ? this.route.args : {
        });
    }
});




var /*
**	Connects to a ModelList and renders its contents using a template. When using "dynamic" template, the contents can be other custom elements, and
**	the model of each item can be accessed by using data-model=":list-item", which will cause the item model to be added to the element.
**
**	Additionally root attribute data-wrap can be set to 'true' to wrap the template contents inside a div with a data-iid representing the ID of the
**	item, this will cause any changes to items to affect only the specific item in question.
*/ $714a04be6cb9a277$export$2e2bcd8739ae039 = $f2f01f7f560a1091$export$2e2bcd8739ae039.register('r-list', {
    list: null,
    container: null,
    template: null,
    isEmpty: false,
    isDynamicTemplate: false,
    /**
	**	Executed when the children of the element are ready.
	*/ ready: function() {
        this.container = this.querySelector(this.dataset.container || '.x-data');
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.className = 'x-data';
            this.appendChild(this.container);
        }
        let tmp = this.template_elem = this.querySelector('template');
        if (tmp) {
            if (tmp.dataset.mode != 'dynamic') this.template = $j3ZoB$Template.compile(tmp.innerHTML);
            else {
                this.template = ()=>tmp.innerHTML
                ;
                this.isDynamicTemplate = true;
            }
            tmp.remove();
        } else this.template = ()=>''
        ;
        this.container.textContent = ' ';
        this.setEmpty(null);
        this.setLoading(null);
    },
    /**
	**	Executed when the children of the element are ready.
	*/ rready: function() {
        let list = this.getFieldByPath(this.dataset.list);
        if (!list) {
            console.error('List not found: ' + this.dataset.list);
            return;
        }
        this.setList(list);
    },
    /*
	**	Indicates if the list is empty. Elements having x-empty, x-not-empty and x-empty-null will be updated.
	*/ setEmpty: function(value) {
        if (this.isEmpty === value) return;
        if (value === true) {
            this.querySelectorAll('.x-empty').forEach((i)=>i.classList.remove('x-hidden')
            );
            this.querySelectorAll('.x-not-empty').forEach((i)=>i.classList.add('x-hidden')
            );
            this.querySelectorAll('.x-empty-null').forEach((i)=>i.classList.add('x-hidden')
            );
        } else if (value === false) {
            this.querySelectorAll('.x-empty').forEach((i)=>i.classList.add('x-hidden')
            );
            this.querySelectorAll('.x-not-empty').forEach((i)=>i.classList.remove('x-hidden')
            );
            this.querySelectorAll('.x-empty-null').forEach((i)=>i.classList.add('x-hidden')
            );
        } else {
            this.querySelectorAll('.x-empty').forEach((i)=>i.classList.add('x-hidden')
            );
            this.querySelectorAll('.x-not-empty').forEach((i)=>i.classList.add('x-hidden')
            );
            this.querySelectorAll('.x-empty-null').forEach((i)=>i.classList.remove('x-hidden')
            );
        }
        this.isEmpty = value;
    },
    /*
	**	Indicates if the list is loading. Elements having x-loading will be updated.
	*/ setLoading: function(value) {
        if (value === true) this.querySelectorAll('.x-loading').forEach((i)=>i.classList.remove('x-hidden')
        );
        else this.querySelectorAll('.x-loading').forEach((i)=>i.classList.add('x-hidden')
        );
    },
    /**
	**	Sets the list model-list of the element.
	*/ setList: function(list) {
        if (!list || !$j3ZoB$Rinn.isInstanceOf(list, $j3ZoB$ModelList) || this.list === list) return;
        if (this.list != null) {
            if (this.list.dataSource) this.list.dataSource.removeEventListener(this.eid + ':*');
            if (this.list.dataList) this.list.dataList.removeEventListener(this.eid + ':*');
            this.list.removeEventListener(this.eid + ':*');
        }
        this.list = list;
        if (this.list.dataSource) {
            this.list.dataSource.addEventListener(this.eid + ':listLoading', this.onLoading, this);
            this.list.dataSource.addEventListener(this.eid + ':listLoaded', this.onLoaded, this);
        }
        if (this.list.dataList) {
            this.list.dataList.addEventListener(this.eid + ':listLoading', this.onLoading, this);
            this.list.dataList.addEventListener(this.eid + ':listLoaded', this.onLoaded, this);
        }
        this.list.addEventListener(this.eid + ':itemsCleared', this.onItemsCleared, this);
        this.list.addEventListener(this.eid + ':itemsChanged', this.onItemsChanged, this);
        this.list.addEventListener(this.eid + ':itemRemoved', this.onItemRemoved, this);
        this.list.addEventListener(this.eid + ':itemChanged', this.onItemChanged, this);
        this.list.addEventListener(this.eid + ':itemAdded', this.onItemAdded, this);
    },
    /*
	**	Builds an item (inside a div) to be added to the container.
	*/ buildItem: function(iid, data, asHtml = false) {
        let html = this.template(data.get());
        if (asHtml) return html;
        let elem = document.createElement('div');
        elem.dataset.iid = iid;
        elem.innerHTML = html;
        elem.querySelectorAll('[data-model=":list-item"]').forEach((i)=>{
            i.model = data;
            i.dataset.model = "this.model";
        });
        for (let attr of this.template_elem.attributes){
            if (attr.nodeName.startsWith('data-_') || attr.nodeName == 'data-mode') continue;
            elem.setAttribute(attr.nodeName, attr.nodeValue);
        }
        return elem;
    },
    /*
	**	Executed when the list is loading.
	*/ onLoading: function() {
        this.setLoading(true);
    },
    /*
	**	Executed when the list finished loading.
	*/ onLoaded: function() {
        this.setLoading(false);
    },
    /*
	**	Executed when the list is cleared.
	*/ onItemsCleared: function() {
        this.container._timeout = setTimeout(()=>{
            this.setEmpty(true);
            this.container._timeout = null;
            this.container.textContent = '';
        }, 300);
    },
    /*
	**	Executed when the items of the list changed.
	*/ onItemsChanged: function() {
        if (this.list.length() == 0) return;
        if (this.container._timeout) clearTimeout(this.container._timeout);
        this.container._timeout = null;
        this.container.textContent = '';
        let i = 0;
        for (let data of this.list.getData())if (this.dataset.wrap != 'false') this.container.append(this.buildItem(this.list.itemId[i++], data));
        else this.container.innerHTML += this.buildItem(this.list.itemId[i++], data, true);
        this.setEmpty(i == 0);
    },
    /*
	**	Executed when an item is removed from the list.
	*/ onItemRemoved: function(evt, args) {
        if (this.dataset.wrap == 'false') {
            this.onItemsChanged();
            return;
        }
        let elem = this.container.querySelector('[data-iid="' + args.id + '"]');
        if (!elem) return;
        elem.remove();
        this.setEmpty(this.list.length() == 0);
    },
    /*
	**	Executed when an item changes.
	*/ onItemChanged: function(evt, args) {
        if (this.isDynamicTemplate) return;
        if (this.dataset.wrap == 'false') {
            this.onItemsChanged();
            return;
        }
        let elem = this.container.querySelector('[data-iid="' + args.id + '"]');
        if (!elem) return;
        elem.innerHTML = this.template(args.item);
    },
    /*
	**	Executed when an item is added to the list.
	*/ onItemAdded: function(evt, args) {
        if (args.position == 'head') {
            if (this.dataset.wrap != 'false') this.container.prepend(this.buildItem(args.id, args.item));
            else this.container.innerHTML = this.buildItem(args.id, args.item, true) + this.container.innerHTML;
        } else if (this.dataset.wrap != 'false') this.container.append(this.buildItem(args.id, args.item));
        else this.container.innerHTML += this.buildItem(args.id, args.item, true);
        this.setEmpty(false);
    },
    /**
	 * 	Forces re-rendering of the element.
	 */ refresh: function() {
        this.onItemsChanged();
    }
});



var $a88b97fa7f2abc94$export$2e2bcd8739ae039 = $f2f01f7f560a1091$export$2e2bcd8739ae039.register('r-item', {
    /**
	**	Initializes the element.
	*/ init: function() {
    },
    /**
	**	Executed when the children and root are ready.
	*/ rready: function() {
        let model = this.getFieldByPath(this.dataset.model);
        if (!model) model = {
        };
        this.setModel(model);
    }
});





var /*
**	Connects to a data source to provide pagination features.
*/ $e4e0c6c826f2c695$export$2e2bcd8739ae039 = $f2f01f7f560a1091$export$2e2bcd8739ae039.register('r-paginator', {
    source: null,
    template: null,
    /**
	**	Initializes the element.
	*/ init: function() {
        this.setModel({
            offsetStart: 0,
            offsetEnd: 0,
            count: 0,
            offset: 0,
            currentPageSize: this.dataset.pageSize || 25,
            pageSize: this.dataset.pageSize || 25
        });
        this.listen('propertyChanged.pageSize', (evt, args)=>{
            if (this.model.get('currentPageSize') == args.value) return;
            this.model.set('currentPageSize', args.value);
            this.updateOffset('range');
        });
    },
    /**
	**	Executed when the children of the element are ready.
	*/ rready: function() {
        let source = this.getFieldByPath(this.dataset.source);
        if (!source) {
            console.error('data-source not found: ' + this.dataset.source);
            return;
        }
        this.setSource(source);
    },
    /**
	**	Sets the source model-list of the paginator.
	*/ setSource: function(source) {
        if (!source || !$j3ZoB$Rinn.isInstanceOf(source, $c92d48c08b86e527$export$2e2bcd8739ae039) || this.source === source) return;
        if (this.source != null) {
            this.source.removeEventListener(this.eid + ':*');
            this.source.includeCount = false;
        }
        this.source = source;
        this.source.includeCount = true;
        this.updateOffset();
        this.source.addEventListener(this.eid + ':requestPropertyChanged', this.onRequestPropertyChanged, this);
        this.source.addEventListener(this.eid + ':countChanged', this.onCountChanged, this);
        this.source.addEventListener(this.eid + ':listItemRemoved', this.onItemRemoved, this);
        this.source.addEventListener(this.eid + ':listItemAdded', this.onItemAdded, this);
        this.source.setNamespace(this.eid);
        this.source.request.update(true);
        this.source.setNamespace(null);
    },
    /*
	**	Updates several offset related fields in the paginator model. Optionally refreshes the data source with the specified mode.
	*/ updateOffset: function(mode = null) {
        this.model.set('offsetStart', this.model.get('count') != 0 ? this.model.get('offset') + 1 : 0);
        this.model.set('offsetEnd', Math.min(this.model.get('count'), this.model.get('offsetStart') + this.model.getInt('pageSize') - 1));
        this.model.update('count');
        let _count = this.source.request.get('count');
        let _offset = this.source.request.get('offset');
        this.source.request.set('count', this.model.getInt('pageSize'));
        this.source.request.set('offset', this.model.get('offset'));
        if (mode && (_count != this.source.request.get('count') || _offset != this.source.request.get('offset'))) this.source.refresh(mode);
    },
    /*
	**	Event handler invoked when a property of the source request changes. The property is copied to the local model.
	*/ onRequestPropertyChanged: function(evt, args) {
        if (args.name == 'count' || args.name == 'offset') return;
        this.model.set(args.name, args.value);
    },
    /*
	**	Event handler invoked when a property of the model has changed. The property is copied to the data source request model.
	*/ onModelPropertyChanged: function(evt, args) {
        let ignored = [
            'offsetStart',
            'offsetEnd',
            'count',
            'offset',
            'currentPageSize',
            'pageSize'
        ];
        if (ignored.indexOf(args.name) != -1) return;
        if (this.source.request.get(args.name) == args.value) return;
        this.source.request.set(args.name, args.value);
        this.source.refresh('filter');
    },
    /*
	**	Executed when the remote count changes.
	*/ onCountChanged: function(evt, args) {
        this.model.set('count', evt.source.count, false);
        this.updateOffset();
    },
    /*
	**	Executed when an item is removed from the list.
	*/ onItemRemoved: function(evt, args) {
        this.model.set('count', this.model.getInt('count') - 1, false);
        this.updateOffset();
    },
    /*
	**	Executed when an item is added to the list.
	*/ onItemAdded: function(evt, args) {
        this.model.set('count', this.model.getInt('count') + 1, false);
        this.updateOffset();
    },
    /*
	**	Moves to the previous page.
	*/ prevPage: function() {
        if (this.model.get('offset') <= 0) return;
        let offs = this.model.get('offset') - this.model.getInt('pageSize');
        if (offs < 0) offs = 0;
        this.model.set('offset', offs);
        this.updateOffset('range');
    },
    /*
	**	Moves to the next page.
	*/ nextPage: function() {
        let offs = this.model.get('offset') + this.model.getInt('pageSize');
        if (offs >= this.model.get('count')) return;
        this.model.set('offset', offs);
        this.updateOffset('range');
    },
    /*
	**	Moves to the first page.
	*/ firstPage: function() {
        this.model.set('offset', 0);
        this.updateOffset('range');
    },
    /*
	**	Moves to the last page.
	*/ lastPage: function() {
        let offs = this.model.get('count') - this.model.getInt('pageSize');
        if (offs < 0) offs = 0;
        this.model.set('offset', offs);
        this.updateOffset('range');
    },
    /*
	**	Refreshes the data source.
	*/ refresh: function() {
        this.source.refresh('full');
    },
    /*
	**	Clears (set to empty) the specified fields from the data source's request parameters.
	*/ clear: function(args) {
        for(let i = 0; i < args.length; i++)this.model.set(args[i], '');
    }
});





var /*
**	Connects to a DataSource and renders its contents as a table.
*/ $54901aecda702d75$export$2e2bcd8739ae039 = $f2f01f7f560a1091$export$2e2bcd8739ae039.register('r-table', {
    source: null,
    template: null,
    container: null,
    isEmpty: null,
    /**
	**	Initializes the element.
	*/ init: function() {
        this.setModel({
        });
    },
    /**
	**	Executed when the children of the element are ready.
	*/ ready: function() {
        this.container = this.querySelector(this.dataset.container || 'tbody.x-data');
        if (!this.container) throw new Error('r-table requires a container');
        if (this.container.dataset.mode != 'dynamic') this.template = $j3ZoB$Template.compile(this.container.innerHTML);
        else this.template = ()=>this.container.innerHTML
        ;
        this.temporalBody = document.createElement('tbody');
        this.container.textContent = ' ';
        this.setEmpty(true);
    },
    /**
	**	Executed when the children and root elements are ready.
	*/ rready: function() {
        let source = this.getFieldByPath(this.dataset.source);
        if (!source) {
            console.error('data-source not found: ' + this.dataset.source);
            return;
        }
        this.setSource(source);
    },
    /*
	**	Indicates if the table is empty. Elements having .x-not-empty will be hidden.
	*/ setEmpty: function(value) {
        if (this.isEmpty === value) return;
        if (value) {
            this.querySelectorAll('.x-empty').forEach((i)=>i.classList.remove('x-hidden')
            );
            this.querySelectorAll('.x-not-empty').forEach((i)=>i.classList.add('x-hidden')
            );
        } else {
            this.querySelectorAll('.x-empty').forEach((i)=>i.classList.add('x-hidden')
            );
            this.querySelectorAll('.x-not-empty').forEach((i)=>i.classList.remove('x-hidden')
            );
        }
        this.isEmpty = value;
    },
    /**
	**	Sets the data source of the element.
	*/ setSource: function(source) {
        if (!source || !$j3ZoB$Rinn.isInstanceOf(source, $c92d48c08b86e527$export$2e2bcd8739ae039) || this.source === source) return;
        if (this.source != null) this.source.removeEventListener(this.eid + ':*');
        this.source = source;
        this.source.addEventListener(this.eid + ':requestPropertyChanged', this.onRequestPropertyChanged, this);
        this.source.addEventListener(this.eid + ':listItemsCleared', this.onItemsCleared, this);
        this.source.addEventListener(this.eid + ':listItemsChanged', this.onItemsChanged, this);
        this.source.addEventListener(this.eid + ':listItemRemoved', this.onItemRemoved, this);
        this.source.addEventListener(this.eid + ':listItemChanged', this.onItemChanged, this);
        this.source.addEventListener(this.eid + ':listItemAdded', this.onItemAdded, this);
        this.source.setNamespace(this.eid);
        this.source.request.update(true);
        this.source.setNamespace(null);
    },
    /*
	**	Event handler invoked when a property of the source request changes. The property is copied to the local model.
	*/ onRequestPropertyChanged: function(evt, args) {
        this.model.set(args.name, args.value);
        if (args.name == 'sort') this.querySelectorAll('thead [data-sort]').forEach((i)=>i.dataset.order = ''
        );
        else if (args.name == 'order') {
            let elem = this.querySelector('thead [data-sort="' + evt.source.get('sort') + '"]');
            if (elem) elem.dataset.order = args.value;
        }
    },
    /*
	**	Event handler invoked when a property of the model has changed. The property is copied to the data source request model.
	*/ onModelPropertyChanged: function(evt, args) {
        if (this.source.request.get(args.name) == args.value) return;
        this.source.request.set(args.name, args.value);
        let ignored = [
            'count',
            'offset'
        ];
        if (ignored.indexOf(args.name) != -1) return;
        this.source.refresh('filter');
    },
    /*
	**	Event handler invoked when a property of the model is removed.
	*/ onModelPropertyRemoved: function(evt, args) {
        if (typeof args.fields == 'string') this.source.request.remove(i);
        else args.fields.forEach((i)=>this.source.request.remove(i)
        );
        this.source.refresh('filter');
    },
    /*
	**	Builds an item to be added to the container.
	*/ buildItem: function(iid, data) {
        let elem = this.temporalBody;
        elem.innerHTML = this.template(data.get());
        elem.querySelectorAll('[data-model=":list-item"]').forEach((i)=>{
            i.model = data;
            i.dataset.model = "this.model";
        });
        elem = elem.firstElementChild;
        elem.dataset.iid = iid;
        return elem;
    },
    /*
	**	Executed when the list is cleared.
	*/ onItemsCleared: function(evt, args) {
        this.container._timeout = setTimeout(()=>{
            this.setEmpty(true);
            this.container._timeout = null;
            this.container.textContent = '';
        }, 300);
    },
    /*
	**	Executed when the items of the list changed.
	*/ onItemsChanged: function(evt, args) {
        if (this.source.list.length() == 0) return;
        if (this.container._timeout) clearTimeout(this.container._timeout);
        this.container._timeout = null;
        this.container.textContent = '';
        let i = 0;
        for (let data of this.source.list.getData())this.container.append(this.buildItem(this.source.list.itemId[i++], data));
        this.setEmpty(i == 0);
    },
    /*
	**	Executed when an item is removed from the list.
	*/ onItemRemoved: function(evt, args) {
        let elem = this.container.querySelector('[data-iid="' + args.id + '"]');
        if (!elem) return;
        elem.remove();
        this.setEmpty(this.source.list.length() == 0);
    },
    /*
	**	Executed when an item changes.
	*/ onItemChanged: function(evt, args) {
        let elem = this.container.querySelector('[data-iid="' + args.id + '"]');
        if (!elem) return;
        let _elem = this.buildItem(args.id, args.item);
        this.container.replaceChild(_elem, elem);
    },
    /*
	**	Executed when an item is added to the list.
	*/ onItemAdded: function(evt, args) {
        if (args.position == 'head') this.container.prepend(this.buildItem(args.id, args.item));
        else this.container.append(this.buildItem(args.id, args.item));
        this.setEmpty(false);
    },
    /*
	**	Handles clicks to data-sort elements.
	*/ "event click thead [data-sort]": function(evt, args) {
        if (this.source.request.get('sort') == evt.source.dataset.sort) {
            this.source.request.set('order', this.source.request.get('order') == 'asc' ? 'desc' : 'asc');
            this.source.refresh('order');
        } else {
            this.source.request.set('sort', evt.source.dataset.sort);
            this.source.request.set('order', 'asc', true);
            this.source.refresh('order');
        }
    },
    /*
	**	Refreshes the data source.
	*/ refresh: function() {
        this.source.refresh('full');
    },
    /*
	**	Clears (set to empty) the specified fields from the data source's request parameters.
	*/ clear: function(args) {
        for(let i = 0; i < args.length; i++)this.model.set(args[i], '');
    }
});




var /*
**	Connects to a ModelList and renders its contents as a <select> element.
*/ $6f796319a51b6aea$export$2e2bcd8739ae039 = $f2f01f7f560a1091$export$2e2bcd8739ae039.register('r-select', {
    list: null,
    container: null,
    value: '',
    /**
	**	Initializes the element.
	*/ init: function() {
        this.container = document.createElement('select');
        this.parentElement.insertBefore(this.container, this);
        let list = [];
        for (let attr of this.attributes){
            if (attr.nodeName.startsWith('data-_') || attr.nodeName == 'data-list' || attr.nodeName == 'data-blank') continue;
            this.container.setAttribute(attr.nodeName, attr.nodeValue);
            list.push(attr.nodeName);
        }
        list.forEach((i)=>this.removeAttribute(i)
        );
        this.textContent = ' ';
        this.style.display = 'none';
    },
    /**
	**	Executed when the children and parent of the element are ready.
	*/ rready: function() {
        let list = this.getFieldByPath(this.dataset.list);
        if (!list) {
            console.error('List not found: ' + this.dataset.list);
            return;
        }
        this.setList(list);
        if (this.parentElement.lastElementChild !== this) this.parentElement.append(this);
    },
    /**
	**	Sets the list model-list of the element.
	*/ setList: function(list) {
        if (!list || !$j3ZoB$Rinn.isInstanceOf(list, $j3ZoB$ModelList) || this.list === list) return;
        if (this.list != null) this.list.removeEventListener(this.eid + ':*');
        this.list = list;
        if (this.list.dataSource) this.list.dataSource.includeEnum = true;
        this.list.addEventListener(this.eid + ':itemsCleared', this.onItemsCleared, this);
        this.list.addEventListener(this.eid + ':itemsChanged', this.onItemsChanged, this);
        this.list.addEventListener(this.eid + ':itemRemoved', this.onItemsChanged, this);
        this.list.addEventListener(this.eid + ':itemChanged', this.onItemsChanged, this);
        this.list.addEventListener(this.eid + ':itemAdded', this.onItemsChanged, this);
        this.onItemsChanged();
    },
    /*
	**	Executed when the list is cleared.
	*/ onItemsCleared: function(evt, args) {
        this.container.textContent = '';
    },
    /*
	**	Executed when the items of the list changed.
	*/ onItemsChanged: function(evt, args) {
        if (this.list.length() == 0) return;
        let list = this.list.getData();
        let value, label, s = '';
        if (list[0].has('value')) value = 'value';
        else if (list[0].has('id')) value = 'id';
        if (list[0].has('label')) label = 'label';
        else if (list[0].has('name')) label = 'name';
        if ('blank' in this.dataset) s += '<option value="">' + this.dataset.blank + '</option>';
        if (list[0].has('group')) {
            let groups = {
            };
            list.forEach((i)=>groups[i.get('group')] = null
            );
            for(let i1 in groups)groups[i1] = {
                name: i1,
                list: []
            };
            list.forEach((i)=>groups[i.get('group')].list.push(i)
            );
            groups = Object.values(groups);
            groups.forEach((g)=>{
                s += '<optgroup label="' + g.name + '">';
                g.list.forEach((i)=>s += '<option value="' + i.get(value) + '">' + i.get(label) + '</option>'
                );
                s += '</optgroup>';
            });
        } else list.forEach((i)=>s += '<option value="' + i.get(value) + '">' + i.get(label) + '</option>'
        );
        this.container.innerHTML = s;
        this.container.value = this.container.dataset.value;
    },
    /**
	 * 	Forces re-rendering of the element.
	 */ refresh: function() {
        this.onItemsChanged();
    }
});



/*
**	riza/utils
**
**	Copyright (c) 2013-2021, RedStar Technologies, All rights reserved.
**	https://www.rsthn.com/
**
**	THIS LIBRARY IS PROVIDED BY REDSTAR TECHNOLOGIES "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES,
**	INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A 
**	PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL REDSTAR TECHNOLOGIES BE LIABLE FOR ANY
**	DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT 
**	NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; 
**	OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, 
**	STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE
**	USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/ const $f15dd1abb49aad26$var$Utils = {
    /**
	**	Forces the browser to show a download dialog.
	*/ showDownload: function(filename, dataUrl) {
        var link = document.createElement("a");
        link.href = dataUrl;
        link.style.display = 'none';
        link.download = filename;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },
    /**
	**	Forces the browser to show a file selection dialog.
	*/ showFilePicker: function(allowMultiple, accept, callback) {
        var input = document.createElement("input");
        input.type = "file";
        input.accept = accept;
        input.style.display = 'none';
        input.multiple = allowMultiple;
        document.body.appendChild(input);
        input.onchange = function() {
            callback(input.files);
        };
        document.body.onfocus = function() {
            document.body.onfocus = null;
            document.body.removeChild(input);
        };
        input.click();
    },
    /**
	**	Loads a URL using FileReader and returns as a dataURL.
	*/ loadAsDataUrl: function(file, callback) {
        var reader = new FileReader();
        reader.onload = function(e) {
            callback(e.target.result, null);
        };
        reader.onerror = function(e) {
            callback(null, e);
        };
        reader.readAsDataURL(file);
    },
    /**
	**	Loads a URL using FileReader and returns as text.
	*/ loadAsText: function(file, callback) {
        var reader = new FileReader();
        reader.onload = function(e) {
            callback(e.target.result);
        };
        reader.readAsText(file);
    },
    /**
	**	Loads a URL using FileReader and returns as an array buffer.
	*/ loadAsArrayBuffer: function(file, callback) {
        var reader = new FileReader();
        reader.onload = function(e) {
            callback(e.target.result);
        };
        reader.readAsArrayBuffer(file);
    },
    /**
	**	Loads an array of URLs using FileReader and returns them as data url.
	*/ loadAllAsDataUrl: function(fileList, callback) {
        var result = [];
        if (!fileList || !fileList.length) {
            callback(result);
            return;
        }
        var loadNext = function(i) {
            if (i == fileList.length) {
                callback(result);
                return;
            }
            $f15dd1abb49aad26$var$Utils.loadAsDataUrl(fileList[i], function(url, err) {
                if (!err) result.push({
                    name: fileList[i].name,
                    size: fileList[i].size,
                    url: url
                });
                loadNext(i + 1);
            });
        };
        loadNext(0);
    },
    /*
	**	Loads a URL as an image.
	*/ loadImageFromUrl: function(url, callback) {
        let image = new Image();
        image.onload = ()=>callback(image)
        ;
        image.onerror = ()=>callback(null)
        ;
        image.src = url;
    }
};
var $f15dd1abb49aad26$export$2e2bcd8739ae039 = $f15dd1abb49aad26$var$Utils;


var $60ded19ad3520ba6$export$2e2bcd8739ae039 = $f2f01f7f560a1091$export$2e2bcd8739ae039.register('r-image-cropper', {
    /*
	**	Default aspect ratio.
	*/ aspectRatio: 1,
    /*
	**	Current image scale.
	*/ imageScale0: 0,
    imageScale: 1,
    /*
	**	Image translation offsets.
	*/ imageOffsX: 0,
    imageOffsY: 0,
    /*
	**	Pointer contexts.
	*/ pointerA: null,
    pointerB: null,
    /*
	**	Client bounding box.
	*/ bounds: null,
    /*
	**	Initializes the element.
	*/ init: function() {
        this.canvas = document.createElement('canvas');
        this.appendChild(this.canvas);
        this.g = this.canvas.getContext('2d');
        this.pointerA = {
            id: null,
            active: false,
            sx: 0,
            sy: 0,
            cx: 0,
            cy: 0,
            ix: 0,
            iy: 0
        };
        this.pointerB = {
            id: null,
            active: false,
            sx: 0,
            sy: 0,
            cx: 0,
            cy: 0,
            ix: 0,
            iy: 0
        };
        this.log = document.createElement('div');
        this.appendChild(this.log);
    },
    /*
	**	Sets the image for the cropper from an image URL.
	*/ setImageUrl: function(url) {
        $f15dd1abb49aad26$export$2e2bcd8739ae039.loadImageFromUrl(url, (image)=>{
            this.setImage(image);
        });
    },
    /*
	**	Sets the image for the cropper from an HTML File object.
	*/ setImageFile: function(file) {
        $f15dd1abb49aad26$export$2e2bcd8739ae039.loadAsDataUrl(file, (url)=>{
            $f15dd1abb49aad26$export$2e2bcd8739ae039.loadImageFromUrl(url, (image)=>{
                this.setImage(image);
            });
        });
    },
    /*
	**	Sets the cropper image from an HTML Image element.
	*/ setImage: function(image) {
        this.image = image;
        this.reset();
        this.imageScale = Math.max(this.canvas.width / this.image.width, this.canvas.height / this.image.height);
        this.imageOffsX = (this.canvas.width - this.imageScale * this.image.width) * 0.5;
        this.imageOffsY = (this.canvas.height - this.imageScale * this.image.height) * 0.5;
        this.render();
    },
    /*
	**	Returns the blob and URL representing the current canvas state.
	*/ getBlobAndUrl: function(callback, type = 'image/png', quality = 0.9) {
        this.canvas.toBlob((blob)=>{
            callback(blob, URL.createObjectURL(blob));
        }, type, quality);
    },
    /*
	**	Auto-resizes the canvas to ensure the aspect ratio is maintained.
	*/ reset: function() {
        this.bounds = this.getBoundingClientRect();
        this.canvas.width = this.bounds.width;
        this.canvas.height = this.bounds.width / this.aspectRatio;
    },
    /*
	**	Auto-resizes the canvas to ensure the aspect ratio is maintained and renders the image.
	*/ render: function() {
        this.canvas.width = this.canvas.width;
        this.g.fillStyle = '#000';
        this.g.beginPath();
        this.g.rect(0, 0, this.canvas.width, this.canvas.height);
        this.g.fill();
        this.g.translate(this.imageOffsX, this.imageOffsY);
        this.g.scale(this.imageScale, this.imageScale);
        this.g.drawImage(this.image, 0, 0);
    },
    /*
	**	Translates the image by the given offsets.
	*/ translateImage: function(offsX, offsY) {
        this.imageOffsX += offsX;
        this.imageOffsY += offsY;
        this.render(true);
    },
    /*
	**	Handle mouse events on the canvas.
	*/ "event mousemove canvas": function(evt) {
        if (this.pointerA.active) {
            this.pointerA.cx = evt.clientX;
            this.pointerA.cy = evt.clientY;
            this.translateImage(this.pointerA.cx - this.pointerA.sx, this.pointerA.cy - this.pointerA.sy);
            this.pointerA.sx = this.pointerA.cx;
            this.pointerA.sy = this.pointerA.cy;
        }
        this.pointerA.ix = (evt.clientX - this.bounds.left - this.imageOffsX) / this.imageScale;
        this.pointerA.iy = (evt.clientY - this.bounds.top - this.imageOffsY) / this.imageScale;
    },
    "event mousedown canvas": function(evt) {
        this.pointerA.active = true;
        this.pointerA.sx = evt.clientX;
        this.pointerA.sy = evt.clientY;
    },
    "event mouseup canvas": function(evt) {
        this.pointerA.active = false;
    },
    "event wheel canvas": function(evt) {
        if (evt.deltaY > 0) this.imageScale -= 0.045;
        else this.imageScale += 0.045;
        if (this.imageScale < 0.1) this.imageScale = 0.1;
        this.imageOffsX += -this.pointerA.ix * this.imageScale + (evt.clientX - this.bounds.left) - this.imageOffsX;
        this.imageOffsY += -this.pointerA.iy * this.imageScale + (evt.clientY - this.bounds.top) - this.imageOffsY;
        this.render();
    },
    /*
	**	Handle touch events on the canvas.
	*/ "event touchmove canvas": function(evt) {
        for (let i of evt.changedTouches){
            if (this.pointerA.id == i.identifier) {
                this.pointerA.cx = i.clientX;
                this.pointerA.cy = i.clientY;
            } else if (this.pointerB.id == i.identifier) {
                this.pointerB.cx = i.clientX;
                this.pointerB.cy = i.clientY;
            }
        }
        if (this.pointerA.active && this.pointerB.active) {
            let d0 = Math.sqrt(Math.pow(this.pointerA.sx - this.pointerB.sx, 2) + Math.pow(this.pointerA.sy - this.pointerB.sy, 2));
            let d1 = Math.sqrt(Math.pow(this.pointerA.cx - this.pointerB.cx, 2) + Math.pow(this.pointerA.cy - this.pointerB.cy, 2));
            let d = d1 - d0;
            this.imageScale += d / 10 * 0.025;
            if (this.imageScale < 0.1) this.imageScale = 0.1;
            this.imageOffsX += -this.pointerA.ix * this.imageScale + (this.pointerA.cx - this.bounds.left) - this.imageOffsX;
            this.imageOffsY += -this.pointerA.iy * this.imageScale + (this.pointerA.cy - this.bounds.top) - this.imageOffsY;
            this.pointerA.sx = this.pointerA.cx;
            this.pointerA.sy = this.pointerA.cy;
            this.pointerB.sx = this.pointerB.cx;
            this.pointerB.sy = this.pointerB.cy;
            this.render();
        } else {
            let p = this.pointerA.active ? this.pointerA : this.pointerB.active ? this.pointerB : null;
            if (!p) return;
            this.translateImage(p.cx - p.sx, p.cy - p.sy);
            p.sx = p.cx;
            p.sy = p.cy;
        }
    },
    "event touchstart canvas": function(evt) {
        this.imageScale0 = this.imageScale;
        for (let i of evt.changedTouches){
            if (this.pointerA.id === null) {
                this.pointerA.id = i.identifier;
                this.pointerA.active = true;
                this.pointerA.sx = i.clientX;
                this.pointerA.sy = i.clientY;
                this.pointerA.ix = (i.clientX - this.bounds.left - this.imageOffsX) / this.imageScale;
                this.pointerA.iy = (i.clientY - this.bounds.top - this.imageOffsY) / this.imageScale;
            } else if (this.pointerB.id === null) {
                this.pointerB.id = i.identifier;
                this.pointerB.active = true;
                this.pointerB.sx = i.clientX;
                this.pointerB.sy = i.clientY;
                this.pointerB.ix = (i.clientX - this.bounds.left - this.imageOffsX) / this.imageScale;
                this.pointerB.iy = (i.clientY - this.bounds.top - this.imageOffsY) / this.imageScale;
            }
        }
    },
    "event touchend canvas": function(evt) {
        for (let i of evt.changedTouches){
            if (this.pointerA.id == i.identifier) {
                this.pointerA.id = null;
                this.pointerA.active = false;
            } else if (this.pointerB.id == i.identifier) {
                this.pointerB.id = null;
                this.pointerB.active = false;
            }
        }
    },
    "event touchcancel canvas": function(evt) {
        for (let i of evt.changedTouches){
            if (this.pointerA.id == i.identifier) {
                this.pointerA.id = null;
                this.pointerA.active = false;
            } else if (this.pointerB.id == i.identifier) {
                this.pointerB.id = null;
                this.pointerB.active = false;
            }
        }
    }
});


var $ddafb9752a9ba425$export$2e2bcd8739ae039 = {
    Tabs: $a23af1cab366283c$export$2e2bcd8739ae039,
    Form: $653d148303270476$export$2e2bcd8739ae039,
    Panel: $eccb61e2eee7209a$export$2e2bcd8739ae039,
    List: $714a04be6cb9a277$export$2e2bcd8739ae039,
    Item: $a88b97fa7f2abc94$export$2e2bcd8739ae039,
    Paginator: $e4e0c6c826f2c695$export$2e2bcd8739ae039,
    Table: $54901aecda702d75$export$2e2bcd8739ae039,
    Select: $6f796319a51b6aea$export$2e2bcd8739ae039,
    ImageCropper: $60ded19ad3520ba6$export$2e2bcd8739ae039
};




const $8832174729c85c16$export$55185c17a0fcbe46 = $cdbdea0eedb44c97$export$2e2bcd8739ae039;
const $8832174729c85c16$export$db77ccec0bb4ccac = $f2f01f7f560a1091$export$2e2bcd8739ae039;
const $8832174729c85c16$export$9864de54bd63ed8a = $f2f01f7f560a1091$export$2e2bcd8739ae039;
const $8832174729c85c16$export$bf71da7aebe9ddc1 = $03dfb5b808851c4b$export$2e2bcd8739ae039;
const $8832174729c85c16$export$accd73d198d77d2f = $c92d48c08b86e527$export$2e2bcd8739ae039;
const $8832174729c85c16$export$d3568da47c78d35c = $3f534db4f9a2dc0d$export$2e2bcd8739ae039;
const $8832174729c85c16$export$cea96571ebbff9dd = $b01cf61b5fd2eff8$export$2e2bcd8739ae039;
const $8832174729c85c16$export$deefd61317ad2797 = $3807f10d3d8a70da$export$2e2bcd8739ae039;
const $8832174729c85c16$export$3abb4be70fa2c84e = $ddafb9752a9ba425$export$2e2bcd8739ae039;
const $8832174729c85c16$export$d2ca453b913dcdea = $f15dd1abb49aad26$export$2e2bcd8739ae039;
const $8832174729c85c16$export$eefcfe56efaaa57d = $j3ZoB$Rinn;
const $8832174729c85c16$export$4c85e640eb41c31b = $j3ZoB$Class;
const $8832174729c85c16$export$d61e24a684f9e51 = $j3ZoB$Event;
const $8832174729c85c16$export$ec8b666c5fe2c75a = $j3ZoB$EventDispatcher;
const $8832174729c85c16$export$a1edc412be3e1841 = $j3ZoB$Model;
const $8832174729c85c16$export$59eced47f477f85a = $j3ZoB$ModelList;
const $8832174729c85c16$export$19342e026b58ebb7 = $j3ZoB$Schema;
const $8832174729c85c16$export$3a9581c9ade29768 = $j3ZoB$Flattenable;
const $8832174729c85c16$export$fb8073518f34e6ec = $j3ZoB$Collection;
const $8832174729c85c16$export$14416b8d99d47caa = $j3ZoB$Template;


export {$8832174729c85c16$export$55185c17a0fcbe46 as Router, $8832174729c85c16$export$db77ccec0bb4ccac as Element, $8832174729c85c16$export$9864de54bd63ed8a as CElement, $8832174729c85c16$export$bf71da7aebe9ddc1 as Api, $8832174729c85c16$export$accd73d198d77d2f as DataSource, $8832174729c85c16$export$d3568da47c78d35c as DataList, $8832174729c85c16$export$cea96571ebbff9dd as Easing, $8832174729c85c16$export$deefd61317ad2797 as Anim, $8832174729c85c16$export$3abb4be70fa2c84e as Elements, $8832174729c85c16$export$d2ca453b913dcdea as Utils, $8832174729c85c16$export$eefcfe56efaaa57d as Rinn, $8832174729c85c16$export$4c85e640eb41c31b as Class, $8832174729c85c16$export$d61e24a684f9e51 as Event, $8832174729c85c16$export$ec8b666c5fe2c75a as EventDispatcher, $8832174729c85c16$export$a1edc412be3e1841 as Model, $8832174729c85c16$export$59eced47f477f85a as ModelList, $8832174729c85c16$export$19342e026b58ebb7 as Schema, $8832174729c85c16$export$3a9581c9ade29768 as Flattenable, $8832174729c85c16$export$fb8073518f34e6ec as Collection, $8832174729c85c16$export$14416b8d99d47caa as Template};
//# sourceMappingURL=riza.js.map
