
import { Rinn, Model, Template } from 'rinn';
import Router from './router.js';

/**
 * Map containing the original prototypes for all registered elements.
 */
const elementPrototypes = { };

/**
 * Map containing the final classes for all registered elements.
 */
const elementClasses = { };

/**
 * Contains the state of the current long-press operation.
 */
let longPressState = { elem: null, state: null };

/**
 * Base class for custom elements. Provides support for model-triggered events, easy definition of handlers for events originated in
 * self or child-elements, and several utility methods.
 */

//!class Element

//! /** Enables verbose debug logging for element lifecycle events. */
//! static debug: boolean;

const Element =
{
    /**
     * Internal element ID. Added as namespace to model events. Ensures that certain model events are run locally only, not affecting other event handlers.
     * !eid: string;
     */
    eid: null,

    /**
     * Name of the element, set by `registerElement`.
     * !elementName: string;
     */
    elementName: null,

    /**
     * Indicates if the element is a root element, that is, the target element to attach child elements having `data-ref` attribute.
     * !isRoot: boolean;
     */
    isRoot: false,

    /**
     * Root element to which this element is attached (when applicable).
     * !root: Element;
     */
    root: null,

    /**
     * Indicates ready-state of the element. Possible values are: 0 (Not ready), 1 (Children Initialized) and 2 (Parent Ready).
     * !isReady: number;
     */
    isReady: 0,

    /**
     * Model type (class) for the element's model.
     * !modelt: any;
     */
    modelt: Model,

    /**
     * Data model related to the element.
     * !model: any;
     */
    model: null,

    /**
     * Contents of the element. When set, the innerHTML will be set to this value.
     * !contents: string;
     */
    contents: null,

    /**
     * CSS style for the element (use selector "@" for scoped styles).
     * !styles: string;
     */
    styles: '',

    /**
     * Events map.
     * !events: Record<string, ((evt: any) => void) | string>;
     */
    events:
    {
        'mousedown [data-long-press]': function (evt)
        {
            evt.continuePropagation = true;
            if (longPressState.state) return;
            evt.continuePropagation = false;

            let elem = evt.source;
            longPressState.elem = elem;
            longPressState.state = setTimeout(() =>
            {
                let dx = elem._pos_fx - elem._pos_sx;
                let dy = elem._pos_fy - elem._pos_sy;
                longPressState.state = null;

                let d = Math.sqrt(dx*dx + dy*dy);
                if (d < 5 && longPressState.elem === elem) {
                    longPressState.state = false;
                    this.dispatchOn(elem, 'long-press');
                }
            },
            500);

            elem._pos_sx = evt.clientX;
            elem._pos_sy = evt.clientY;
            elem._pos_fx = evt.clientX;
            elem._pos_fy = evt.clientY;
        },

        'mousemove [data-long-press]': function (evt)
        {
            evt.continuePropagation = true;
            if (!longPressState.state) return;
            evt.continuePropagation = false;

            evt.source._pos_fx = evt.clientX;
            evt.source._pos_fy = evt.clientY;
        },

        'mouseup [data-long-press]': function (evt)
        {
            if (longPressState.state === false)
                return;

            if (longPressState.state) {
                clearTimeout(longPressState.state);
                longPressState.state = null;
            }

            if (longPressState.elem === evt.source)
                this.dispatchOn(evt.source, 'short-press', [], false);
        },

        'touchstart [data-long-press]': function (evt)
        {
            evt.continuePropagation = true;
            if (longPressState.state) return;

            let elem = evt.source;
            longPressState.elem = elem;
            longPressState.state = setTimeout(() => {
                let dx = elem._pos_fx - elem._pos_sx;
                let dy = elem._pos_fy - elem._pos_sy;
                longPressState.state = null;

                let d = Math.sqrt(dx*dx + dy*dy);
                if (d < 5 && longPressState.elem === elem) {
                    longPressState.state = false;
                    this.dispatchOn(elem, 'long-press');
                }
            }, 500);

            elem._pos_sx = evt.touches[0].clientX;
            elem._pos_sy = evt.touches[0].clientY;
            elem._pos_fx = evt.touches[0].clientX;
            elem._pos_fy = evt.touches[0].clientY;
        },

        'touchmove [data-long-press]': function (evt)
        {
            evt.continuePropagation = true;
            if (!longPressState.state) return;

            evt.source._pos_fx = evt.touches[0].clientX;
            evt.source._pos_fy = evt.touches[0].clientY;
        },

        'touchend [data-long-press]': function (evt)
        {
            if (longPressState.state === false)
                return;
    
            if (longPressState.state) {
                clearTimeout(longPressState.state);
                longPressState.state = null;
            }

            if (longPressState.elem === evt.source)
                this.dispatchOn(evt.source, 'short-press', null, false);
        },

        'click [data-action]': function(evt)
        {
            if (longPressState.state === false)
                return;

            let opts = evt.source.dataset.action.split(' ');

            if (opts[0] in this)
                this[opts[0]] ({ ...evt.params, ...evt.source.dataset, ...opts, length: opts.length }, evt);
            else
                evt.continuePropagation = true;
        },

        'long-press [data-long-press]': function(evt)
        {
            let opts = evt.source.dataset.longPress.split(' ');

            if (opts[0] in this)
                this[opts[0]] ({ ...evt.params, ...evt.source.dataset, ...opts, length: opts.length }, evt);
            else
                evt.continuePropagation = true;
        },

        'keyup(13) input[data-enter]': function(evt)
        {
            let opts = evt.source.dataset.enter.split(' ');

            if (opts[0] in this)
                this[opts[0]] ({ ...evt.params, ...evt.source.dataset, ...opts, length: opts.length }, evt);
            else
                evt.continuePropagation = true;
        }
    },

    /**
     * Routes map. Maps route expressions (or `!route` for unrouted handlers) to handler functions or method names on the element.
     * !routes: Record<string, ((evt: any, args: any) => void) | string>;
     */
    routes: null,

    __readyReenter: 0,
    __readyLocked: 0,
    __readyStyles: false,

    /**
     * Element constructor. Invoked automatically when the custom element is connected to the DOM.
     * !constructor ();
     */
    __ctor: function()
    {
        this._list_watch = [];
        this._list_visible = [];
        this._list_attr = [];
        this._list_property = [];

        if ('root' in this.dataset)
            this.isRoot = this.dataset.root === 'true';

        this.style.display = 'block';
        this.eid = Math.random().toString().substr(2);

        if (this.model != null) {
            let tmp = this.model;
            this.model = null;
            this.setModel(tmp, false);
        }

        Object.keys(this._super).reverse().forEach(i => {
            if ('init' in this._super[i])
                this._super[i].init();
        });

        if (Element.debug)
            console.log('>> ' + this.tagName + ' INIT ON ' + this.parentElement.tagName);

        this.init();

        if (this.events)
            this.bindEvents(this.events);

        if (this.styles && !this.constructor.prototype.__readyStyles) {
            const style = document.createElement('style');
            style.innerHTML = this.styles.replace(/@(?=\s|\{)/g, this.elementName);
            document.head.appendChild(style);
            this.constructor.prototype.__readyStyles = true;
        }

        if (this.contents)
            this.setInnerHTML(this.contents);

        setTimeout(() => {
            if (this.tagName.toLowerCase() !== 'rr-dom-probe')
                this.appendChild(document.createElement('rr-dom-probe'));
            else
                this.markReady();
        }, 0);
    },

    /**
     * Initializes the element. Called after construction of the instance. Override in subclasses.
     * !init () : void;
     */
    init: function()
    {
    },

    /**
     * Executed when the children of the element are ready. Override in subclasses.
     * !ready () : void;
     */
    ready: function()
    {
    },

    /**
     * Internal wrapper around `ready`. When the element is a root, scans descendants for the `data-ref` attribute and stores
     * each match on the element as `this[<ref-name>]`. Consumed attributes are renamed to `data-_ref` so an outer root that runs
     * later does not claim them again. Finally invokes `ready`.
     */
    _ready: function()
    {
        if (this.isRoot)
        {
            const list = this.querySelectorAll('[data-ref]:not([data-_ref])');
            for (let i = 0; i < list.length; i++)
            {
                const elem = list[i];
                const name = elem.dataset.ref;

                this[name] = elem;
                this.onRefAdded(name, elem);

                elem.setAttribute('data-_ref', '1');
            }
        }

        this.ready();
    },

    /**
     * Executed after `ready` and after the root is also ready. Override in subclasses.
     * !rready () : void;
     */
    rready: function()
    {
    },

    /**
     * Marks the element as ready and walks the lifecycle phases.
     * @param {Array<any>} list
     * !markReady (list?: Array<any>) : void;
     */
    markReady: function (list=null)
    {
        this.__readyLocked++;

        if (!this.isReady)
        {
            this.isReady = 1;

            // Set model if `model` property was set in the element.
            if ('model' in this.dataset) {
                let ref = this.getFieldByPath(this.dataset.model);
                if (ref) this.setModel(ref);
            }

            // Run ready methods in class hierarchy.
            Object.keys(this._super).reverse().forEach(i => {
                if ('_ready' in this._super[i])
                    this._super[i]._ready();
            });

            if (Element.debug)
                console.log('>> ' + this.tagName + ' READY');

            this._ready();
            this.trigger('ready').dispatch('_ready', null, false);
            this.collectWatchers();
        }
        else
            this.collectWatchers();

        let root = this.findCustomParent(this);

        if (Element.debug)
            console.log(this.tagName + ' ROOT IS ' + (root ? root.tagName : 'NULL'));

        if (root && root.isReady === 0 && this.isReady != 0)
            root.checkReady();

        let rootReady = false;

        if (root && root.isReady === 2 && this.isReady !== 2)
        {
            this.getRoot();
            if (this.root && this.dataset.ref) {
                if (Element.debug)
                    console.log(this.tagName + ' REF AS `' + this.dataset.ref + '` ON ' + this.root.tagName);

                this.root[this.dataset.ref] = this;
                this.root.onRefAdded (this.dataset.ref, this);
            }

            rootReady = true;
        }

        if (!root && this.isReady !== 2) {
            rootReady = true;
        }

        if (rootReady)
        {
            this.isReady = 2;

            if (list !== null) {
                for (let elem of list)
                    elem.checkReady();
            }

            if (Element.debug)
                console.log('>> ' + this.tagName + ' RREADY');

            Object.keys(this._super).reverse().forEach(i => {
                if ('rready' in this._super[i])
                    this._super[i].rready();
            });

            this.rready();
            this.trigger('rootready');
        }

        this.__readyLocked--;

        if (this.__readyReenter && !this.__readyLocked) {
            this.__readyReenter = false;
            this.checkReady();
        }

        if (this.tagName.toLowerCase() === 'rr-dom-probe')
            this.remove();
    },

    /**
     * Checks if all children are ready and fires the appropriate function (`ready` and/or `rready`).
     * !checkReady () : void;
     */
    checkReady: function()
    {
        if (this.childNodes.length == 0)
            return;

        if (this.__readyLocked)
        {
            this.__readyReenter = true;
            return;
        }

        let isReady = true;
        let list = [];

        let result = document.evaluate(".//*[contains(name(),'-')]", this, null, XPathResult.ANY_TYPE, null);

        if (Element.debug)
            console.log('# CHECKING ' + this.tagName);

        while (true)
        {
            let elem = result.iterateNext();
            if (!elem) break;

            if (elem === this)
                continue;

            let root = this.findCustomParent(elem);
            if (root !== this) continue;

            if (Element.debug)
                console.log('   ' + elem.tagName + ' = ' + elem.isReady);

            if (!elem.isReady)
                isReady = false;

            list.push(elem);
        }

        if (!isReady) return;

        this.markReady(list);
    },

    /**
     * Returns the value of a field given its path. Starts from `global`, unless the first item in the path is `this`, in which case it will start from the element. If the first item is `root`, it will start from the root element.
     * @param {string} path
     * @returns {any}
     * !getFieldByPath (path: string) : any;
     */
    getFieldByPath: function(path)
    {
        if (!path) return null;

        if (typeof(path) !== 'string')
            return path;

        let tmp = path.split('.');
        let ref = global;

        if (tmp.length && tmp[0] == 'this')
        {
            ref = this;
            tmp.shift();
        }

        if (tmp.length && tmp[0] == 'root')
        {
            ref = this.getRoot();
            tmp.shift();
        }

        while (ref != null && tmp.length != 0)
            ref = ref[tmp.shift()];

        return ref;
    },

    /**
     * Returns the root of the element (that is, the `root` property). If not set, it will attempt to find the root first.
     * @returns {Element}
     * !getRoot () : Element;
     */
    getRoot: function() {
        return this.root ? this.root : (this.root = this.findRoot());
    },

    /**
     * Sets the model of the element and executes the `modelChanged` event handler (unless `update` is set to false).
     * @param {any} model
     * @param {boolean} update
     * @returns {Element}
     * !setModel (model: any, update?: boolean) : Element;
     */
    setModel: function (model, update=true)
    {
        if (!model) return this;

        model = Rinn.ensureTypeOf(this.modelt, model);

        if (this.model !== model)
        {
            if (this.model != null)
            {
                this.model.removeEventListener (this.eid+':modelChanged', this.onModelPreChanged, this);
                this.model.removeEventListener (this.eid+':propertyChanging', this.onModelPropertyChanging, this);
                this.model.removeEventListener (this.eid+':propertyChanged', this.onModelPropertyPreChanged, this);
                this.model.removeEventListener (this.eid+':propertyRemoved', this.onModelPropertyRemoved, this);
            }

            this.model = model;

            this.model.addEventListener (this.eid+':modelChanged', this.onModelPreChanged, this);
            this.model.addEventListener (this.eid+':propertyChanging', this.onModelPropertyChanging, this);
            this.model.addEventListener (this.eid+':propertyChanged', this.onModelPropertyPreChanged, this);
            this.model.addEventListener (this.eid+':propertyRemoved', this.onModelPropertyRemoved, this);
        }

        if (update !== false)
            this.model.setNamespace(this.eid).update(true).setNamespace(null);

        return this;
    },

    /**
     * Returns the model of the element. Equivalent to accessing the public `model` property.
     * @returns {any}
     * !getModel () : any;
     */
    getModel: function ()
    {
        return this.model;
    },

    /**
     * Adds one or more CSS classes (separated by space) to the element. Class names prefixed with `+` are added; class names prefixed with `-` are removed.
     * @param {string} classString
     * @returns {Element}
     * !addClass (classString: string) : Element;
     */
    addClass: function (classString)
    {
        if (!classString) return this;

        classString.split(' ').forEach(i =>
        {
            i = i.trim();
            if (!i) return;

            if (i[0] == '-' || i[0] == '+')
                this.classList[i[0] == '-' ? 'remove' : 'add'](i.substr(1));
            else
                this.classList.add(i);
        });

        return this;
    },

    /**
     * Removes one or more CSS classes (separated by space) from the element. Class names prefixed with `+` are added; class names prefixed with `-` are removed.
     * @param {string} classString
     * @returns {Element}
     * !removeClass (classString: string) : Element;
     */
    removeClass: function (classString)
    {
        if (!classString) return this;

        classString.split(' ').forEach(i =>
        {
            i = i.trim();
            if (!i) return;

            if (i[0] == '-' || i[0] == '+')
                this.classList[i[0] == '-' ? 'remove' : 'add'](i.substr(1));
            else
                this.classList.remove(i);
        });

        return this;
    },

    /**
     * Sets one or more style properties on the element (separated by semi-colon, in `name: value` form).
     * @param {string} styleString
     * @returns {Element}
     * !setStyle (styleString: string) : Element;
     */
    setStyle: function (styleString)
    {
        if (!styleString) return this;

        styleString.split(';').forEach(i => {
            let j = (i = i.trim()).indexOf(':');
            if (j == -1) return;

            let name = i.substr(0, j).trim();
            for (let k = name.indexOf('-'); k != -1; k = name.indexOf('-')) {
                name = name.substr(0, k) + name.substr(k+1, 1).toUpperCase() + name.substr(k+2);
            }

            this.style[name] = i.substr(j+1).trim();
        });

        return this;
    },

    /**
     * Returns the width of the specified element (or of itself if none provided) using `getBoundingClientRect`.
     * @param {HTMLElement} elem
     * @returns {number}
     * !getWidth (elem?: HTMLElement) : number;
     */
    getWidth: function (elem=null)
    {
        return (elem || this).getBoundingClientRect().width;
    },

    /**
     * Returns the height of the specified element (or of itself if none provided) using `getBoundingClientRect`.
     * @param {HTMLElement} elem
     * @returns {number}
     * !getHeight (elem?: HTMLElement) : number;
     */
    getHeight: function (elem=null)
    {
        return (elem || this).getBoundingClientRect().height;
    },

    /**
     * Binds all events in the specified map to the element. The events map keys follow the syntax: `"click .button"` (delegated event), `"myevt &this"` (self event), `"myevt"` (element event), `"myevt @objName"` (EventDispatcher event), `"#propname"` (property-changed event), or `"keyup(10) .input"` (delegated event with parameters).
     * @param {Record<string, ((evt: any) => void) | string>} events
     * @returns {Element}
     * !bindEvents (events: Record<string, ((evt: any) => void) | string>) : Element;
     */
    bindEvents: function (events)
    {
        for (let evtstr in events)
        {
            let hdl = events[evtstr];

            if (Rinn.typeOf(hdl) == 'string')
                hdl = this[hdl];

            hdl = hdl.bind(this);

            var i = evtstr.indexOf(' ');

            var name = i == -1 ? evtstr : evtstr.substr(0, i);
            var selector = i == -1 ? '' : evtstr.substr(i + 1);

            let args = null;

            var j = name.indexOf('(');
            if (j != -1)
            {
                args = name.substr(j+1, name.length-j-2).split(',');
                name = name.substr(0, j);
            }

            if (selector[0] == '@')
            {
                if (selector != '@this')
                {
                    this[selector.substr(1)].addEventListener(name, hdl);
                    continue;
                }

                selector = this;
            }
            else if (selector[0] == '&')
            {
                if (selector != '&this')
                    selector = "[data-ref='"+selector.substr(1)+"']";
                else
                    selector = this;
            }

            if (name.substr(0, 1) == '#')
            {
                this.listen('propertyChanged.'+name.substr(1), this, hdl);
                continue;
            }

            if (args != null)
            {
                switch (name)
                {
                    case 'keyup': case 'keydown':
                        this.listen(name, selector, function (evt)
                        {
                            if (Rinn.indexOf(args, evt.keyCode.toString()) != -1)
                                return hdl (evt, args);

                            evt.continuePropagation = true;
                        });

                        continue;
                }
            }

            this.listen(name, selector, hdl);
        }

        return this;
    },

    /**
     * Binds all routes in the `routes` map to the Router. Route keys prefixed with `!` are bound as unroute handlers.
     * !bindRoutes () : void;
     */
    bindRoutes: function ()
    {
        if (!this.routes)
            return;

        for (let routeStr in this.routes)
        {
            let route = routeStr[0] === '!' ? Router.getRoute(routeStr.substr(1)) : Router.getRoute(routeStr);
            let handler = this.routes[routeStr];

            if (Rinn.typeOf(handler) === 'string')
                handler = this[handler];

            if (routeStr[0] === '!')
                route.addHandler(handler, true, this);
            else
                route.addHandler(handler, false, this);
        }
    },

    /**
     * Unbinds all routes added by `bindRoutes`.
     * !unbindRoutes () : void;
     */
    unbindRoutes: function ()
    {
        if (!this.routes)
            return;

        for (let routeStr in this.routes)
        {
            let route = routeStr[0] === '!' ? Router.getRoute(routeStr.substr(1)) : Router.getRoute(routeStr);
            let handler = this.routes[routeStr];

            if (Rinn.typeOf(handler) === 'string')
                handler = this[handler];

            if (routeStr[0] === '!')
                route.removeHandler(handler, true, this);
            else
                route.removeHandler(handler, false, this);
        }
    },

    /**
    **	Executes the underlying event handler given an event and a selector. Called internally by listen().
    **
    **	>> void _eventHandler (event evt, string selector, function handler);
    */
    _eventHandler: function (evt, selector, handler)
    {
        if (evt.continuePropagation === false)
            return;

        evt.continuePropagation = true;
        evt.source = evt.target;

        if (selector && selector instanceof HTMLElement) {
            if (evt.source === selector) {
                evt.continuePropagation = false;
                if (handler.call (this, evt, evt.detail) === true)
                    evt.continuePropagation = true;
            }
        }
        else if (selector && selector != '*') {
            let elems = this.querySelectorAll(selector);
            while (evt.source && evt.source !== this) {
                let i = Rinn.indexOf (elems, evt.source, true);
                if (i !== -1) {
                    evt.continuePropagation = false;
                    if (handler.call (this, evt, evt.detail) === true)
                        evt.continuePropagation = true;
                    break;
                }
                else {
                    evt.source = evt.source.parentElement;
                }
            }
        }
        else {
            evt.continuePropagation = false;
            if (handler.call (this, evt, evt.detail) === true)
                evt.continuePropagation = true;
        }

        if (evt.continuePropagation === false) {
            evt.preventDefault();
            evt.stopPropagation();
        }
    },

    /**
     * Listens for an event on elements matching the specified selector. Returns an object with a `remove` method to unbind the listener when no longer needed. The `selector` parameter is optional; when omitted, the second argument is treated as the handler.
     * @param {string} eventName
     * @param {string|((evt: any) => void)} selector
     * @param {(evt: any) => void} handler
     * @returns {{ remove: () => void }}
     * !listen (eventName: string, selector: string | ((evt: any) => void), handler?: (evt: any) => void) : { remove: () => void };
     */
    listen: function (eventName, selector, handler)
    {
        let eventCatcher = false;
        let eventImmediate = false;

        if (Rinn.typeOf(selector) == 'function') {
            handler = selector;
            selector = null;
        }

        if (eventName[eventName.length-1] == '!') {
            eventName = eventName.substr(0, eventName.length-1);
            eventCatcher = true;
        }

        if (eventName[0] == '!') {
            eventName = eventName.substr(1);
            eventImmediate = true;
        }

        let callback0 = null;
        let callback1 = null;
        let self = this;

        this.addEventListener(eventName, callback0 = (evt) =>
        {
            if (evt.continuePropagation === false)
                return;

            if (!evt.firstCapture) {
                evt.firstCapture = this;
                evt.firstCaptureCount = 0;
                evt.queue = [];
            }

            if (evt.firstCapture === this)
                evt.firstCaptureCount++;

            if (eventCatcher == true)
                evt.queue.push([this, selector, handler]);

            if (eventImmediate == true)
                this._eventHandler(evt, selector, handler);
        },
        true);

        this.addEventListener (eventName, callback1 = (evt) =>
        {
            if (evt.continuePropagation === false)
                return;

            if (eventCatcher !== true && eventImmediate !== true)
                this._eventHandler(evt, selector, handler);

            if (evt.firstCapture === this && evt.continuePropagation !== false)
            {
                if (--evt.firstCaptureCount == 0)
                {
                    while (evt.queue.length) {
                        let q = evt.queue.pop();
                        q[0]._eventHandler(evt, q[1], q[2]);
                    }

                    evt.continuePropagation = false;
                }
            }
        },
        false);

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
     * Creates an event object for later dispatch.
     * @param {string} eventName
     * @param {any} args
     * @param {boolean} bubbles
     * @returns {Event}
     * !createEventObject (eventName: string, args: any, bubbles: boolean) : Event;
     */
    createEventObject: function(eventName, args, bubbles) {
        if (eventName == 'click')
            return new MouseEvent(eventName, { bubbles: bubbles, detail: args });
        return new CustomEvent (eventName, { bubbles: bubbles, detail: args });
    },

    /**
     * Dispatches a new event with the specified name and the given arguments.
     * @param {string} eventName
     * @param {any} args
     * @param {boolean} bubbles
     * @returns {Element}
     * !dispatch (eventName: string, args?: any, bubbles?: boolean) : Element;
     */
    dispatch: function (eventName, args=null, bubbles=true)
    {
        let propName = 'on' + eventName.toLowerCase();
        if (propName in this) {
            this[propName] (args, this);
            return this;
        }

        this.dispatchEvent(this.createEventObject(eventName, args, bubbles));
        return this;
    },

    /**
     * Dispatches a local event, does not bubble up, and invokes only the local event handler (if present).
     * @param {string} eventName
     * @param {any} args
     * @returns {Element}
     * !trigger (eventName: string, args?: any) : Element;
     */
    trigger: function (eventName, args=null)
    {
        let propName = 'on' + eventName.replace(/-/g, '').toLowerCase();
        if (!(propName in this)) return this;

        this[propName] (args, this);
        return this;
    },

    /**
     * Dispatches a new event on the specified element with the given name and arguments (uses `CustomEvent`).
     * @param {HTMLElement} elem
     * @param {string} eventName
     * @param {any} args
     * @param {boolean} bubbles
     * @returns {Element}
     * !dispatchOn (elem: HTMLElement, eventName: string, args?: any, bubbles?: boolean) : Element;
     */
    dispatchOn: function (elem, eventName, args=null, bubbles=true)
    {
        let propName = 'on' + eventName.replace(/-/g, '').toLowerCase();
        if ((propName in elem) && elem[propName] != null) {
            elem[propName] (args, elem);
            return this;
        }

        elem.dispatchEvent(this.createEventObject(eventName, args, bubbles));
        return this;
    },

    /**
     * Sets the `innerHTML` property of the element and runs the post set-content tasks.
     * @param {string} value
     * @returns {Element}
     * !setInnerHTML (value: string) : Element;
     */
    setInnerHTML: function (value) {
        this.__readyLocked++;
        this.innerHTML = value;
        this.__readyLocked--;
        return this;
    },

    /**
     * Returns the cleaned-up `innerHTML` of the element (with internal `rr-dom-probe` markers stripped).
     * @returns {string}
     * !getInnerHTML () : string;
     */
    getInnerHTML: function() {
        return this.innerHTML.replace(/<rr-dom-probe.+?><\/rr-dom-probe>/g, '').trim();
    },

    /**
     * Collects all watchers (`data-watch`, `data-visible`, `data-attr`, `data-property`) that depend on the model. Should be invoked when the
     * structure of the element changes (children added/removed). Automatically called by `setInnerHTML`.
     *
     * Third-party libs that add children to this element may cause duplication of added elements when compiling the `innerHTML` template. To prevent this, add the `pseudo` CSS class to any element that should not be added to the HTML template.
     * !collectWatchers () : void;
     */
    collectWatchers: function ()
    {
        let self = this;
        let modified = false;
        let list;

        if (!this.isRoot) return;

        let _list_watch_length = this._list_watch.length;
        let _list_visible_length = this._list_visible.length;
        let _list_attr_length = this._list_attr.length;
        let _list_property_length = this._list_property.length;

        /* *** */
        list = this.querySelectorAll('[data-watch]');
        for (let i = 0; i < list.length; i++)
        {
            for (let j of list[i].querySelectorAll('.pseudo'))
                j.remove();

            list[i]._template = Template.compile(list[i].innerHTML);
            list[i]._watch = new RegExp('^(' + list[i].dataset.watch + ')$');
            list[i].innerHTML = '';

            list[i].removeAttribute('data-watch');
            this._list_watch.push(list[i]);
        }

        if ('selfWatch' in this.dataset)
        {
            for (let j of this.querySelectorAll('.pseudo'))
                j.remove();

            this._template = Template.compile(this.innerHTML);
            this._watch = new RegExp('^(' + this.dataset.selfWatch + ')$');
            this.innerHTML = '';

            this.removeAttribute('data-self-watch');
            this._list_watch.push(this);
        }

        /* *** */
        list = this.querySelectorAll('[data-visible]');
        for (let i = 0; i < list.length; i++)
        {
            list[i]._visible = Template.compile(list[i].dataset.visible);

            list[i].removeAttribute('data-visible');
            this._list_visible.push(list[i]);
        }

        if ('selfVisible' in this.dataset)
        {
            this._visible = Template.compile(this.dataset.selfVisible);

            this.removeAttribute('data-self-visible');
            this._list_visible.push(this);
        }

        /* *** */
        list = this.querySelectorAll('[data-attr]');
        for (let i = 0; i < list.length; i++)
        {
            list[i]._attr = [];

            for (let j of list[i].dataset.attr.split(';'))
            {
                j = j.split(':');
                if (j.length != 2) continue;

                list[i]._attr.push({
                    name: j[0].trim(),
                    value: Template.compile(j[1].trim())
                });
            }

            list[i].removeAttribute('data-attr');
            this._list_attr.push(list[i]);
        }

        if ('selfAttr' in this.dataset)
        {
            this._attr = [];

            for (let j of this.dataset.selfAttr.split(';'))
            {
                j = j.split(':');
                if (j.length != 2) continue;

                this._attr.push({
                    name: j[0].trim(),
                    value: Template.compile(j[1].trim())
                });
            }

            this.removeAttribute('data-self-attr');
            this._list_attr.push(this);
        }

        /* *** */
        const property_ = 'riza_data_property' in globalThis ? globalThis.riza_data_property : 'property';
        list = this.querySelectorAll(`[data-${property_}]`);
        for (let i = 0; i < list.length; i++)
        {
            list[i].onchange = list[i].onblur = function()
            {
                switch (this.type)
                {
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

            if (list[i].tagName === 'SELECT') {
                list[i].onmouseup = function() {
                    self.getModel().set(this.name, this.value);
                };
            }

            list[i].name = list[i].dataset[property_];
            list[i].removeAttribute(`data-${property_}`);
            this._list_property.push(list[i]);
        }

        if ('selfProperty' in this.dataset)
        {
            this.onchange = this.onblur = function()
            {
                switch (this.type)
                {
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

            if (this.tagName == 'SELECT') {
                this.onmouseup = function() {
                    self.getModel().set(this.name, this.value);
                };
            }

            this.name = this.dataset.selfProperty;

            this.removeAttribute('data-self-property');
            this._list_property.push(this);
        }

        /* *** */
        this._list_watch = this._list_watch.filter(i => i.parentElement != null);
        if (_list_watch_length != this._list_watch.length) modified = true;

        this._list_visible = this._list_visible.filter(i => i.parentElement != null);
        if (_list_visible_length != this._list_visible.length) modified = true;

        this._list_attr = this._list_attr.filter(i => i.parentElement != null);
        if (_list_attr_length != this._list_attr.length) modified = true;

        this._list_property = this._list_property.filter(i => i.parentElement != null);
        if (_list_property_length != this._list_property.length) modified = true;

        if (this.model != null && modified)
            this.model.setNamespace(this.eid).update(true).setNamespace(null);
    },

    /**
     * Executed when the element is created and not yet attached to the DOM tree. Override in subclasses.
     * !onCreated () : void;
     */
    onCreated: function()
    {
    },

    /**
     * Executes the callback (just once) when the element is ready.
     * @param {() => void} callback
     * @returns {Element}
     * !whenReady (callback: () => void) : Element;
     */
    whenReady: function(callback)
    {
        if (this.isReady) {
            callback();
            return this;
        }

        let hdl = this.listen('_ready', this, () => {
            hdl.remove();
            callback();
        });

        return this;
    },

    /**
     * Internal lifecycle hook invoked when the element is attached to the DOM tree. Calls `bindRoutes`, `onConnected` and triggers the `connected` event.
     * !elementConnected () : void;
     */
    elementConnected: function()
    {
        this.bindRoutes();
        this.onConnected();
        this.trigger('connected');
    },

    /**
     * Internal lifecycle hook invoked when the element is removed from the DOM tree. Calls `unbindRoutes`, `onDisconnected` and triggers the `disconnected` event.
     * !elementDisconnected () : void;
     */
    elementDisconnected: function()
    {
        this.unbindRoutes();
        this.onDisconnected();
        this.trigger('disconnected');
    },

    /**
     * Executed when the element is attached to the DOM tree. Override in subclasses.
     * !onConnected () : void;
     */
    onConnected: function()
    {
    },

    /**
     * Executed when the element is no longer part of the DOM tree. Override in subclasses.
     * !onDisconnected () : void;
     */
    onDisconnected: function()
    {
    },

    /**
     * Executed on the root element when a child with a `data-ref` attribute is added to it.
     * @param {string} name
     * @param {HTMLElement} element
     * !onRefAdded (name: string, element: HTMLElement) : void;
     */
    onRefAdded: function (name, element)
    {
    },

    /**
     * Executed on the root element when a child with a `data-ref` attribute is removed from it.
     * @param {string} name
     * @param {HTMLElement} element
     * !onRefRemoved (name: string, element: HTMLElement) : void;
     */
    onRefRemoved: function (name, element)
    {
    },

    /**
     * Event handler invoked when the model has changed. Executed before `onModelChanged` to update internal dependencies.
     * Should NOT be overridden — overriding will break elements that watch the model.
     * @param {any} evt
     * @param {any} args
     * !onModelPreChanged (evt: any, args: any) : void;
     */
    onModelPreChanged: function (evt, args)
    {
        let data = this.getModel().get();

        for (let i = 0; i < this._list_watch.length; i++)
        {
            for (let j of args.fields)
            {
                if (!this._list_watch[i]._watch.test(j))
                    continue;

                this._list_watch[i].innerHTML = this._list_watch[i]._template(data);
                break;
            }
        }

        for (let i = 0; i < this._list_visible.length; i++)
        {
            if (!!this._list_visible[i]._visible(data, 'arg'))
                this._list_visible[i].style.removeProperty('display');
            else
                this._list_visible[i].style.setProperty('display', 'none', 'important');
        }

        for (let i = 0; i < this._list_attr.length; i++)
        {
            for (let j of this._list_attr[i]._attr)
                this._list_attr[i][j.name] = j.value(data, 'arg');
        }

        this.onModelChanged(evt, args);
    },

    /**
     * Event handler invoked when the model has changed. Override in subclasses.
     * @param {any} evt
     * @param {any} args
     * !onModelChanged (evt: any, args: any) : void;
     */
    onModelChanged: function (evt, args) // @override
    {
    },

    /**
     * Event handler invoked when a property of the model is changing. Fields `name` and `value` are found in `args`.
     * @param {any} evt
     * @param {any} args
     * !onModelPropertyChanging (evt: any, args: any) : void;
     */
    onModelPropertyChanging: function (evt, args) // @override
    {
    },

    /**
     * Event handler invoked when a property of the model has changed. Executed before `onModelPropertyChanged` to update internal
     * dependencies and trigger `propertyChanged.<propertyName>` and `propertyChanged` events.
     * Should NOT be overridden — overriding will break elements that depend on the property.
     * @param {any} evt
     * @param {any} args
     * !onModelPropertyPreChanged (evt: any, args: any) : void;
     */
    onModelPropertyPreChanged: function (evt, args)
    {
        for (let i = 0; i < this._list_property.length; i++)
        {
            if (this._list_property[i].name == args.name)
            {
                let trigger = true;

                switch (this._list_property[i].type)
                {
                    case 'radio':
                        if (this._list_property[i].value != args.value)
                        {
                            this._list_property[i].parentElement.classList.remove('active');
                            continue;
                        }

                        this._list_property[i].checked = true;
                        this._list_property[i].parentElement.classList.add('active');
                        break;

                    case 'checkbox':
                        if (~~args.value)
                        {
                            this._list_property[i].checked = true;
                            this._list_property[i].parentElement.classList.add('active');
                        }
                        else
                        {
                            this._list_property[i].checked = false;
                            this._list_property[i].parentElement.classList.remove('active');
                        }

                        break;

                    case 'field':
                        this._list_property[i].val = this._list_property[i].dataset.value = args.value;	
                        this._list_property[i].setValue (args.value);
                        trigger = false;
                        break;

                    default:
                        this._list_property[i].value = args.value;
                        this._list_property[i].val = this._list_property[i].dataset.value = args.value;	

                        if (this._list_property[i].value != args.value)
                            trigger = false;

                        break;
                }

                if (trigger && this._list_property[i].onchange)
                    this._list_property[i].onchange();
            }
        }

        this.dispatch('propertyChanged.' + args.name, args, false);
        this.dispatch('propertyChanged', args, false);
        this.onModelPropertyChanged(evt, args);
    },

    /**
     * Event handler invoked when a property of the model has changed. Override in subclasses.
     * @param {any} evt
     * @param {any} args
     * !onModelPropertyChanged (evt: any, args: any) : void;
     */
    onModelPropertyChanged: function (evt, args) // @override
    {
    },

    /**
     * Event handler invoked when a property of the model is removed. Field `name` is found in `args`. Override in subclasses.
     * @param {any} evt
     * @param {any} args
     * !onModelPropertyRemoved (evt: any, args: any) : void;
     */
    onModelPropertyRemoved: function (evt, args) // @override
    {
    },

    /**
     * Prepares a prototype before registration: methods named `event <event-name> [<event-selector>]` are moved to the `events` map and methods named `route <route-path>` are moved to the `routes` map.
     * @param {object} proto
     * !static preparePrototype (proto: object) : void;
     */
    preparePrototype: function (proto)
    {
        if (proto.__prototypePrepared === true)
            return;

        proto.__prototypePrepared = true;

        if (!proto.hasOwnProperty('events') || !proto.events)
            proto.events = { };

        if (!proto.hasOwnProperty('routes') || !proto.routes)
            proto.routes = { };

        for (let i in proto)
        {
            if (i.startsWith('event '))
            {
                proto.events[i.substr(6)] = proto[i];
                delete proto[i];
            }
            else if (i.startsWith('route '))
            {
                proto.routes[i.substr(6)] = proto[i];
                delete proto[i];
            }
        }
    },

    /**
     * Registers a new custom element with the specified name. Extra functionality can be added with one or more prototypes — by default
     * all elements also get the `Element` prototype. Final prototypes of registered elements are stored; to inherit another element's prototype, pass its name (string) in the `protos` list.
     * @param {string} name
     * @param {...(object|string)} protos
     * @returns {typeof HTMLElement}
     * !static register (name: string, ...protos: Array<object|string>) : typeof HTMLElement;
     */
    register: function (name, ...protos)
    {
        if ('riza_element_prefix' in globalThis && name.startsWith('r-'))
            name = globalThis.riza_element_prefix + name.substring(1);

        const newElement = class extends HTMLElement
        {
            constructor()
            {
                super();
                this.invokeConstructor = true;

                if (Element.debug)
                    console.log('CREATED ' + this.tagName);

                this._super = { };

                for (let i of Object.entries(this.constructor.prototype._super))
                {
                    this._super[i[0]] = { };

                    for (let j of Object.entries(i[1])) {
                        this._super[i[0]][j[0]] = j[1].bind(this);
                    }
                }

                this.elementName = name;
                this.onCreated();
            }

            findRoot (srcElement=null)
            {
                let elem = srcElement ? srcElement : this.parentElement;
                while (elem != null) {
                    if ('isRoot' in elem && elem.isRoot === true)
                        return elem;
                    elem = elem.parentElement;
                }

                return null;
            }

            findCustomParent (srcElement=null)
            {
                let elem = srcElement ? srcElement.parentElement : this.parentElement;
                while (elem != null) {
                    if (elem.tagName.indexOf('-') !== -1)
                        return elem;
                    elem = elem.parentElement;
                }

                return null;
            }

            connectReference (root=null, flags=255)
            {
                if (!this.root && (flags & 1) == 1) {
                    if (root == null) root = this.findRoot();
                    if (root != null)
                        this.root = root;
                }
            }

            connectedCallback ()
            {
                this.connectReference(null, 1);
                if (this.invokeConstructor) {
                    this.invokeConstructor = false;
                    this.__ctor();
                }

                this.connectReference(null, 2);
                this.elementConnected();

                if (this.dataset.xref)
                    globalThis[this.dataset.xref] = this;
            }

            disconnectedCallback()
            {
                if (this.root) {
                    const refName = this.dataset.ref || this.dataset._ref;
                    if (refName) {
                        this.root.onRefRemoved (refName, this);
                        delete this.root[refName];
                    }
                    this.root = null;
                }

                this.elementDisconnected();

                if (this.dataset.xref)
                    delete globalThis[this.dataset.xref];
            }
        };

        Rinn.override (newElement.prototype, Element);

        const proto = { };
        const _super = { };
        const events = Rinn.clone(Element.events);
        let styles = Element.styles;

        let __init = true;
        let __ready = true;
        let __rready = true;
        let __check;

        for (let i = 0; i < protos.length; i++)
        {
            if (!protos[i]) continue;

            if (Rinn.typeOf(protos[i]) == 'string')
            {
                const name = protos[i];
                protos[i] = elementPrototypes[name];
                if (!protos[i])
                    continue;

                _super[name] = { };

                for (let f in protos[i]) {
                    if (Rinn.typeOf(protos[i][f]) != 'function')
                        continue;
                    _super[name][f] = protos[i][f];
                }

                __init = false;
                __ready = false;
                __rready = false;
                __check = false;
            }
            else {
                Element.preparePrototype(protos[i]);
                __check = true;
            }

            if ('_super' in protos[i])
                Rinn.override(_super, protos[i]._super);

            if ('events' in protos[i])
                Rinn.override(events, protos[i].events);

            if ('styles' in protos[i])
                styles += '\n' + protos[i].styles;

            Rinn.override (newElement.prototype, protos[i]);
            Rinn.override (proto, protos[i]);

            if (__check) {
                if (!__init && 'init' in protos[i]) __init = true;
                if (!__ready && 'ready' in protos[i]) __ready = true;
                if (!__rready && 'rready' in protos[i]) __rready = true;
            }
        }

        let dummy = function(){};

        if (!__init)
        {
            newElement.prototype.init = dummy;
            proto.init = dummy;
        }

        if (!__ready)
        {
            newElement.prototype.ready = dummy;
            proto.ready = dummy;
        }

        if (!__rready)
        {
            newElement.prototype.rready = dummy;
            proto.rready = dummy;
        }

        newElement.prototype._super = _super;
        newElement.prototype.events = events;
        newElement.prototype.styles = styles;

        proto._super = _super;
        proto.events = events;
        proto.styles = styles;

        customElements.define (name, newElement);

        elementPrototypes[name] = proto;
        elementClasses[name] = newElement;

        return newElement;
    },

    /**
     * Expands an already-registered custom element with the specified prototype(s).
     * @param {string} name
     * @param {...object} protos
     * !static expand (name: string, ...protos: Array<object>) : void;
     */
    expand: function (name, ...protos)
    {
        if (!(name in elementPrototypes))
            return;

        const self = elementPrototypes[name];
        const elem = elementClasses[name];

        const _super = self._super;
        const events = self.events;

        for (let proto of protos)
        {
            Element.preparePrototype(proto);

            if ('_super' in proto)
                Rinn.override (_super, proto._super);

            if ('events' in proto)
                Rinn.override (events, proto.events);

            Rinn.override (elem.prototype, proto);
            Rinn.override (self, proto);
        }

        elem.prototype._super = _super;
        elem.prototype.events = events;

        self._super = _super;
        self.events = events;
    },

    /**
     * Appends a hook to a function of a registered custom element. Returns an object with an `unhook` method to remove the hook.
     * @param {string} name
     * @param {string} functionName
     * @param {(...args: any[]) => any} newFunction
     * @returns {{ unhook: () => void }}
     * !static hookAppend (name: string, functionName: string, newFunction: (...args: Array<any>) => any) : { unhook: () => void };
     */
    hookAppend: function (name, functionName, newFunction)
    {
        if (!(name in elementPrototypes))
            return;

        let hook1 = Rinn.hookAppend(elementPrototypes[name], functionName, newFunction);
        let hook2 = Rinn.hookAppend(elementClasses[name].prototype, functionName, newFunction);

        return { 
            unhook: function() {
                hook1.unhook();
                hook2.unhook();
            }
        };
    },

    /**
     * Prepends a hook to a function of a registered custom element. Returns an object with an `unhook` method to remove the hook.
     * @param {string} name
     * @param {string} functionName
     * @param {(...args: any[]) => any} newFunction
     * @returns {{ unhook: () => void }}
     * !static hookPrepend (name: string, functionName: string, newFunction: (...args: Array<any>) => any) : { unhook: () => void };
     */
    hookPrepend: function (name, functionName, newFunction)
    {
        if (!(name in elementPrototypes))
            return;

        let hook1 = Rinn.hookPrepend(elementPrototypes[name], functionName, newFunction);
        let hook2 = Rinn.hookPrepend(elementClasses[name].prototype, functionName, newFunction);

        return { 
            unhook: function() {
                hook1.unhook();
                hook2.unhook();
            }
        };
    },

    /**
    **	Built-in action handlers.
    */

    /**
    **	:toggleClass <className> [<selector>]
    **
    **	Toggles a CSS class on the element.
    */
    ':toggleClass': function (args, evt)
    {
        let elem = evt.source;

        if ('2' in args)
            elem = document.querySelector(args[2]);

        if (!elem) return;

        if (elem.classList.contains(args[1]))
            elem.classList.remove(args[1]);
        else
            elem.classList.add(args[1]);
    },

    /**
    **	:setClass <className> [<selector>]
    **
    **	Sets a CSS class on the element.
    */
    ':setClass': function (args, evt)
    {
        let elem = evt.source;

        if ('2' in args)
            elem = document.querySelector(args[2]);

        if (!elem) return;

        elem.classList.add(args[1]);
    },

    /**
    **	:volatileClass <className> [<selector>]
    **
    **	Adds the CSS class to the element and any click outside will cause it to be removed.
    */
    ':volatileClass': function (args, evt)
    {
        let elem = evt.source;

        if ('2' in args)
            elem = document.querySelector(args[2]);

        if (!elem) return;

        elem.classList.add(args[1]);

        let fn = () => {
            window.removeEventListener('click', fn, true);
            elem.classList.remove(args[1]);
        };

        window.addEventListener('click', fn, true);
    },

    /**
    **	:toggleClassUnique <className> <parentSelector> <childSelector>
    **
    **	Toggles a CSS class on the element and only one element in the selected parent can have the class.
    */
    ':toggleClassUnique': function (args, evt)
    {
        let elem = evt.source;
        if (!elem) return;

        if (elem.classList.contains(args[1]))
        {
            elem.classList.remove(args[1]);
        }
        else
        {
            elem.querySelectorParent(args[2]).querySelectorAll(args[3]).forEach(elem => elem.classList.remove(args[1]));
            elem.classList.add(args[1]);
        }
    },

    /**
    **	:setClassUnique <className> <parentSelector> <childSelector>
    **
    **	Sets a CSS class on the element and only that element in the selected parent can have the class.
    */
    ':setClassUnique': function (args, evt)
    {
        let elem = evt.source;
        if (!elem) return;

        elem.querySelectorParent(args[2]).querySelectorAll(args[3]).forEach(elem => elem.classList.remove(args[1]));
        elem.classList.add(args[1]);
    }
};

//!/class

//! /** Alias for `Element` (avoids conflict with the DOM `Element` global in user code). */
//! export const CElement: typeof Element;

Element.debug = false;

Element.register('r-elem', {
});

Element.register ('rr-dom-probe', {
});

/* ****************************************** */

/**
 * Finds the parent element given a selector. Includes the current element in the search.
 */
HTMLElement.prototype.querySelectorParent = function (selector)
{
    let elem = this;
    while (elem != null) {
        if (elem.matches(selector))
            break;
        elem = elem.parentElement;
    }
    return elem;
};

/**
 * Returns the first parent element with the [data-root] attribute.
 */
HTMLElement.prototype.getRoot = function()
{
    return this.parentElement.querySelectorParent('[data-root]');
};

export default Element;
