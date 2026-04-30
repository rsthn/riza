export class Route
{
	/**
	 * Regular expression for the route. Generated from the simpler expression provided in the constructor.
	 */
	routeRegex: string;

	/**
	 * Original route string value.
	 */
	value: string;

	/**
	 * List of parameter names obtained from the route expression (in order of appearance).
	 */
	params: Array<string>;

	/**
	 * Arguments obtained from the current route (uses `params` to determine the name of each argument).
	 */
	args: object;

	/**
	 * Arguments string obtained from the last route dispatch. Used to check if the arguments changed.
	 */
	s_args: string;

	/**
	 * Indicates if the route is active because of a past positive dispatch.
	 */
	active: boolean;

	/**
	 * Indicates if the params have changed since the last event. The transition from inactive to active route will always set this value to true.
	 */
	changed: boolean;

	/**
	 * Constructor of the route, the specified argument is a route expression.
	 * @param {string} route
	 */
	constructor (route: string);

	/**
	 * Adds a handler to the route dispatcher. The handler can be removed later using `removeHandler` and
	 * specifying the same parameters. If `unrouted` is `true` the event to listen to will be the
	 * `unrouted` event (when the route changes and the route is not activated).
	 * @param {(args: object) => void} handler
	 * @param {boolean} unrouted
	 * @param {object} context
	 */
	addHandler (handler: (args: object) => void, unrouted?: boolean, context?: object) : void;

	/**
	 * Removes a handler from the route dispatcher.
	 * @param {(args: object) => void} handler
	 * @param {boolean} unrouted
	 * @param {object} context
	 */
	removeHandler (handler: (args: object) => void, unrouted?: boolean, context?: object) : void;

	/**
	 * Verifies if the specified location matches the internal route and dispatches either a `routed` or `unrouted` event with the
	 * parameters obtained from the location to all attached handlers.
	 * @param {string} route
	 */
	dispatch (route: string) : void;

}

export class Router
{
	 /** Reference to the Route class used to construct route instances. */
	 static Route: typeof Route;
	 /** Map of route objects keyed by route expression. */
	 static routes: Record<string, Route>;
	 /** Sorted list of route keys (smaller routes first). */
	 static sortedRoutes: Array<string>;
	 /** Number of upcoming hashchange events that the location-changed handler should ignore. */
	 static ignoreHashChangeEvent: number;
	 /** Current relative location (everything after the location hash symbol). */
	 static location: string;
	 /** Current relative location as an array of segments (obtained by splitting the location by `/`). */
	 static args: Array<string>;
	/**
	 * Initializes the router module. Ensure to call `refresh` once to force a hashchange when the page loads.
	 */
	static init () : void;

	/**
	 * Refreshes the current route by forcing a hashchange event.
	 */
	static refresh () : void;

	/**
	 * Changes the current location and optionally prevents a trigger of the hashchange event.
	 * @param {string} route
	 * @param {boolean} silent
	 */
	static setRoute (route: string, silent?: boolean) : void;

	/**
	 * Adds the specified route to the routing map. When the specified route is detected, the `onRoute` handler will be called, and then
	 * when the route exits `onUnroute` will be called.
	 * @param {string} route
	 * @param {(args: object) => void} onRoute
	 * @param {(args: object) => void} onUnroute
	 * @returns {Route}
	 */
	static addRoute (route: string, onRoute: (args: object) => void, onUnroute?: (args: object) => void) : Route;

	/**
	 * Returns the Route object for the specified route, creating it if it doesn't exist yet.
	 * @param {string} route
	 * @returns {Route}
	 */
	static getRoute (route: string) : Route;

	/**
	 * Adds the specified routes to the routing map. The `routes` object should map a route expression (key) to a handler (value).
	 * @param {Record<string, (args: object) => void>} routes
	 */
	static addRoutes (routes: Record<string, (args: object) => void>) : void;

	/**
	 * Removes the specified route from the routing map.
	 * @param {string} route
	 * @param {(args: object) => void} onRoute
	 * @param {(args: object) => void} onUnroute
	 */
	static removeRoute (route: string, onRoute: (args: object) => void, onUnroute?: (args: object) => void) : void;

	/**
	 * Removes the specified routes from the routing map. The `routes` object should map a route expression (key) to a handler (value).
	 * @param {Record<string, (args: object) => void>} routes
	 */
	static removeRoutes (routes: Record<string, (args: object) => void>) : void;

	/**
	 * Given a formatted location and a previous one (defaults to the current location) returns the correct real location.
	 * @param {string} cLocation
	 * @param {string} pLocation
	 * @returns {string}
	 */
	static realLocation (cLocation: string, pLocation?: string) : string;

	/**
	 * Event handler called when the location hash changes.
	 */
	static onLocationChanged () : void;

	/**
	 * Navigates to the given hash-based URL.
	 * @param {string} location
	 * @param {boolean} replace
	 */
	static navigate (location: string, replace?: boolean) : void;

}
export class Element
{
	 /** Enables verbose debug logging for element lifecycle events. */
	 static debug: boolean;
	/**
	 * Internal element ID. Added as namespace to model events. Ensures that certain model events are run locally only, not affecting other event handlers.
	 */
	eid: string;

	/**
	 * Name of the element, set by `registerElement`.
	 */
	elementName: string;

	/**
	 * Indicates if the element is a root element, that is, the target element to attach child elements having `data-ref` attribute.
	 */
	isRoot: boolean;

	/**
	 * Root element to which this element is attached (when applicable).
	 */
	root: Element;

	/**
	 * Indicates ready-state of the element. Possible values are: 0 (Not ready), 1 (Children Initialized) and 2 (Parent Ready).
	 */
	isReady: number;

	/**
	 * Model type (class) for the element's model.
	 */
	modelt: any;

	/**
	 * Data model related to the element.
	 */
	model: any;

	/**
	 * Contents of the element. When set, the innerHTML will be set to this value.
	 */
	contents: string;

	/**
	 * CSS style for the element (use selector "@" for scoped styles).
	 */
	styles: string;

	/**
	 * Events map.
	 */
	events: Record<string, ((evt: any) => void) | string>;

	/**
	 * Routes map. Maps route expressions (or `!route` for unrouted handlers) to handler functions or method names on the element.
	 */
	routes: Record<string, ((evt: any, args: any) => void) | string>;

	/**
	 * Element constructor. Invoked automatically when the custom element is connected to the DOM.
	 */
	constructor ();

	/**
	 * Initializes the element. Called after construction of the instance. Override in subclasses.
	 */
	init () : void;

	/**
	 * Executed when the children of the element are ready. Override in subclasses.
	 */
	ready () : void;

	/**
	 * Executed after `ready` and after the root is also ready. Override in subclasses.
	 */
	rready () : void;

	/**
	 * Marks the element as ready and walks the lifecycle phases.
	 * @param {Array<any>} list
	 */
	markReady (list?: Array<any>) : void;

	/**
	 * Checks if all children are ready and fires the appropriate function (`ready` and/or `rready`).
	 */
	checkReady () : void;

	/**
	 * Returns the value of a field given its path. Starts from `global`, unless the first item in the path is `this`, in which case it will start from the element. If the first item is `root`, it will start from the root element.
	 * @param {string} path
	 * @returns {any}
	 */
	getFieldByPath (path: string) : any;

	/**
	 * Returns the root of the element (that is, the `root` property). If not set, it will attempt to find the root first.
	 * @returns {Element}
	 */
	getRoot () : Element;

	/**
	 * Sets the model of the element and executes the `modelChanged` event handler (unless `update` is set to false).
	 * @param {any} model
	 * @param {boolean} update
	 * @returns {Element}
	 */
	setModel (model: any, update?: boolean) : Element;

	/**
	 * Returns the model of the element. Equivalent to accessing the public `model` property.
	 * @returns {any}
	 */
	getModel () : any;

	/**
	 * Adds one or more CSS classes (separated by space) to the element. Class names prefixed with `+` are added; class names prefixed with `-` are removed.
	 * @param {string} classString
	 * @returns {Element}
	 */
	addClass (classString: string) : Element;

	/**
	 * Removes one or more CSS classes (separated by space) from the element. Class names prefixed with `+` are added; class names prefixed with `-` are removed.
	 * @param {string} classString
	 * @returns {Element}
	 */
	removeClass (classString: string) : Element;

	/**
	 * Sets one or more style properties on the element (separated by semi-colon, in `name: value` form).
	 * @param {string} styleString
	 * @returns {Element}
	 */
	setStyle (styleString: string) : Element;

	/**
	 * Returns the width of the specified element (or of itself if none provided) using `getBoundingClientRect`.
	 * @param {HTMLElement} elem
	 * @returns {number}
	 */
	getWidth (elem?: HTMLElement) : number;

	/**
	 * Returns the height of the specified element (or of itself if none provided) using `getBoundingClientRect`.
	 * @param {HTMLElement} elem
	 * @returns {number}
	 */
	getHeight (elem?: HTMLElement) : number;

	/**
	 * Binds all events in the specified map to the element. The events map keys follow the syntax: `"click .button"` (delegated event), `"myevt &this"` (self event), `"myevt"` (element event), `"myevt @objName"` (EventDispatcher event), `"#propname"` (property-changed event), or `"keyup(10) .input"` (delegated event with parameters).
	 * @param {Record<string, ((evt: any) => void) | string>} events
	 * @returns {Element}
	 */
	bindEvents (events: Record<string, ((evt: any) => void) | string>) : Element;

	/**
	 * Binds all routes in the `routes` map to the Router. Route keys prefixed with `!` are bound as unroute handlers.
	 */
	bindRoutes () : void;

	/**
	 * Unbinds all routes added by `bindRoutes`.
	 */
	unbindRoutes () : void;

	/**
	 * Listens for an event on elements matching the specified selector. Returns an object with a `remove` method to unbind the listener when no longer needed. The `selector` parameter is optional; when omitted, the second argument is treated as the handler.
	 * @param {string} eventName
	 * @param {string|((evt: any) => void)} selector
	 * @param {(evt: any) => void} handler
	 * @returns {{ remove: () => void }}
	 */
	listen (eventName: string, selector: string | ((evt: any) => void), handler?: (evt: any) => void) : { remove: () => void };

	/**
	 * Creates an event object for later dispatch.
	 * @param {string} eventName
	 * @param {any} args
	 * @param {boolean} bubbles
	 * @returns {Event}
	 */
	createEventObject (eventName: string, args: any, bubbles: boolean) : Event;

	/**
	 * Dispatches a new event with the specified name and the given arguments.
	 * @param {string} eventName
	 * @param {any} args
	 * @param {boolean} bubbles
	 * @returns {Element}
	 */
	dispatch (eventName: string, args?: any, bubbles?: boolean) : Element;

	/**
	 * Dispatches a local event, does not bubble up, and invokes only the local event handler (if present).
	 * @param {string} eventName
	 * @param {any} args
	 * @returns {Element}
	 */
	trigger (eventName: string, args?: any) : Element;

	/**
	 * Dispatches a new event on the specified element with the given name and arguments (uses `CustomEvent`).
	 * @param {HTMLElement} elem
	 * @param {string} eventName
	 * @param {any} args
	 * @param {boolean} bubbles
	 * @returns {Element}
	 */
	dispatchOn (elem: HTMLElement, eventName: string, args?: any, bubbles?: boolean) : Element;

	/**
	 * Sets the `innerHTML` property of the element and runs the post set-content tasks.
	 * @param {string} value
	 * @returns {Element}
	 */
	setInnerHTML (value: string) : Element;

	/**
	 * Returns the cleaned-up `innerHTML` of the element (with internal `rr-dom-probe` markers stripped).
	 * @returns {string}
	 */
	getInnerHTML () : string;

	/**
	 * Collects all watchers (`data-watch`, `data-visible`, `data-attr`, `data-property`) that depend on the model. Should be invoked when the
	 * structure of the element changes (children added/removed). Automatically called by `setInnerHTML`.
	 *
	 * Third-party libs that add children to this element may cause duplication of added elements when compiling the `innerHTML` template. To prevent this, add the `pseudo` CSS class to any element that should not be added to the HTML template.
	 */
	collectWatchers () : void;

	/**
	 * Executed when the element is created and not yet attached to the DOM tree. Override in subclasses.
	 */
	onCreated () : void;

	/**
	 * Executes the callback (just once) when the element is ready.
	 * @param {() => void} callback
	 * @returns {Element}
	 */
	whenReady (callback: () => void) : Element;

	/**
	 * Internal lifecycle hook invoked when the element is attached to the DOM tree. Calls `bindRoutes`, `onConnected` and triggers the `connected` event.
	 */
	elementConnected () : void;

	/**
	 * Internal lifecycle hook invoked when the element is removed from the DOM tree. Calls `unbindRoutes`, `onDisconnected` and triggers the `disconnected` event.
	 */
	elementDisconnected () : void;

	/**
	 * Executed when the element is attached to the DOM tree. Override in subclasses.
	 */
	onConnected () : void;

	/**
	 * Executed when the element is no longer part of the DOM tree. Override in subclasses.
	 */
	onDisconnected () : void;

	/**
	 * Executed on the root element when a child with a `data-ref` attribute is added to it.
	 * @param {string} name
	 * @param {HTMLElement} element
	 */
	onRefAdded (name: string, element: HTMLElement) : void;

	/**
	 * Executed on the root element when a child with a `data-ref` attribute is removed from it.
	 * @param {string} name
	 * @param {HTMLElement} element
	 */
	onRefRemoved (name: string, element: HTMLElement) : void;

	/**
	 * Event handler invoked when the model has changed. Executed before `onModelChanged` to update internal dependencies.
	 * Should NOT be overridden — overriding will break elements that watch the model.
	 * @param {any} evt
	 * @param {any} args
	 */
	onModelPreChanged (evt: any, args: any) : void;

	/**
	 * Event handler invoked when the model has changed. Override in subclasses.
	 * @param {any} evt
	 * @param {any} args
	 */
	onModelChanged (evt: any, args: any) : void;

	/**
	 * Event handler invoked when a property of the model is changing. Fields `name` and `value` are found in `args`.
	 * @param {any} evt
	 * @param {any} args
	 */
	onModelPropertyChanging (evt: any, args: any) : void;

	/**
	 * Event handler invoked when a property of the model has changed. Executed before `onModelPropertyChanged` to update internal
	 * dependencies and trigger `propertyChanged.<propertyName>` and `propertyChanged` events.
	 * Should NOT be overridden — overriding will break elements that depend on the property.
	 * @param {any} evt
	 * @param {any} args
	 */
	onModelPropertyPreChanged (evt: any, args: any) : void;

	/**
	 * Event handler invoked when a property of the model has changed. Override in subclasses.
	 * @param {any} evt
	 * @param {any} args
	 */
	onModelPropertyChanged (evt: any, args: any) : void;

	/**
	 * Event handler invoked when a property of the model is removed. Field `name` is found in `args`. Override in subclasses.
	 * @param {any} evt
	 * @param {any} args
	 */
	onModelPropertyRemoved (evt: any, args: any) : void;

	/**
	 * Prepares a prototype before registration: methods named `event <event-name> <event-selector>` are moved to the `events` map and methods named `route <route-path>` are moved to the `routes` map.
	 * @param {object} proto
	 */
	static preparePrototype (proto: object) : void;

	/**
	 * Registers a new custom element with the specified name. Extra functionality can be added with one or more prototypes — by default
	 * all elements also get the `Element` prototype. Final prototypes of registered elements are stored; to inherit another element's prototype, pass its name (string) in the `protos` list.
	 * @param {string} name
	 * @param {...(object|string)} protos
	 * @returns {typeof HTMLElement}
	 */
	static register (name: string, ...protos: Array<object|string>) : typeof HTMLElement;

	/**
	 * Expands an already-registered custom element with the specified prototype(s).
	 * @param {string} name
	 * @param {...object} protos
	 */
	static expand (name: string, ...protos: Array<object>) : void;

	/**
	 * Appends a hook to a function of a registered custom element. Returns an object with an `unhook` method to remove the hook.
	 * @param {string} name
	 * @param {string} functionName
	 * @param {(...args: any) => any} newFunction
	 * @returns {{ unhook: () => void }}
	 */
	static hookAppend (name: string, functionName: string, newFunction: (...args: Array<any>) => any) : { unhook: () => void };

	/**
	 * Prepends a hook to a function of a registered custom element. Returns an object with an `unhook` method to remove the hook.
	 * @param {string} name
	 * @param {string} functionName
	 * @param {(...args: any) => any} newFunction
	 * @returns {{ unhook: () => void }}
	 */
	static hookPrepend (name: string, functionName: string, newFunction: (...args: Array<any>) => any) : { unhook: () => void };

}

 /** Alias for `Element` (avoids conflict with the DOM `Element` global in user code). */
 export const CElement: typeof Element;
export class Api
{
	/**
	 * Sets the API's base URL address.
	 * @param {string} baseURL
	 * @param {number} flags
	 */
	static setBaseUrl (baseURL: string, flags?: number) : Api;

	/**
	 * Overridable filter that processes the response from the server and returns `true` if it was successful.
	 * The `res` parameter indicates the response data, and `req` the request data.
	 * @param {object} res
	 * @param {object} req
	 */
	static responseFilter (res: object, req: object) : boolean;

	/**
	 * Starts package-mode (using the `rpkg` field). Any API calls after this will be bundled together, note that the
	 * feature flag `REQUEST_PACKAGE_SUPPORTED` must be set.
	 */
	static packageBegin() : void;

	/**
	 * Finishes package-mode and if there is any data in the package a single API request will be sent, when the package
	 * is sent the `callback` will be invoked. Note that the feature flag `REQUEST_PACKAGE_SUPPORTED` must be set.
	 * @param {function} callback
	 */
	static packageEnd (callback: function) : void;

	/**
	 * Utility function to batch together multiple API calls, requires feature flag `REQUEST_PACKAGE_SUPPORTED` to be set. Any
	 * API calls made during the callback will be bundled together and sent in a single request. When the request is sent
	 * the `responseCallback` will be invoked.
	 * @param {function} callback
	 * @param {function} responseCallback
	 */
	static batch (callback: function, responseCallback?: function) : void;

	/**
	 * Sends a single API request with the currently constructed package and maintains package-mode. After the request
	 * is sent the `callback` will be invoked. Note that the feature flag `REQUEST_PACKAGE_SUPPORTED` must be set.
	 */
	static packageSend (callback: function) : void;

	/**
	 * Sets an HTTP header.
	 * @deprecated
	 * @param {string} name
	 * @param {string} value
	 */
	static header (name: string, value: string) : Api;

	/**
	 * Sets global HTTP headers for subsequent requests. When `update` is `true` existing headers will be updated rather
	 * than replaced, and any header with a `null` value will be removed.
	 * @param {object} values
	 * @param {boolean} update
	 */
	static headers (values: object, update: boolean = false) : Api;

	/**
	 * Encodes parameters into a query string safe for use in URLs.
	 * @param {object|FormData} obj
	 */
	static encodeParams (obj: object|FormData) : string;

	/**
	 * Appends a parameter to the given URL.
	 * @param {string} url
	 * @param {object} queryParams
	 */
	static appendParams (url: string, queryParams: object) : string;

	/**
	 * Returns an absolute URL formed with the given relative URL (or absolute URL) and the provided query parameters.
	 * @param {string} url
	 * @param {object} queryParams
	 */
	static getAbsoluteUrl (url: string, queryParams: object) : string;

	/**
	 * Makes a blob with the specified data and type.
	 * @param {string} data
	 * @param {string} type
	 */
	static getBlob (data: string, type: string) : Blob

	/**
	 * Executes an API request.
	 * @param {string} method
	 * @param {string} url
	 * @param {object} query
	 * @param {string|object|Blob} body
	 */
	static request (method: string, url: string, query?: object, body?: object) : Promise

}
export class DataSource
{
	 /** Class name identifier. */
	 className: string;
	 /** Debounce delay (in milliseconds) used by `refresh`. Defaults to 250. */
	 debounceDelay: number;
	 /** The base path used as prefix for the `f` parameter in API operations. */
	 basePath: string;
	 /** Request model whose properties are forwarded as parameters to API calls. */
	 request: any;
	 /** When `true`, `refresh` will fetch the count via the `.count` API function. */
	 includeCount: boolean;
	 /** When `true`, `refresh` will fetch the enumeration via the `.enum` API function. */
	 includeEnum: boolean;
	 /** When `true`, `refresh` will fetch the list via the `.list` API function. Defaults to `true`. */
	 includeList: boolean;
	 /** Internal event-id used to namespace forwarded events. */
	 eid: string;
	 /** Total record count, populated when `includeCount` is enabled. */
	 count: number;
	 /** ModelList holding the fetched list of records. */
	 list: any;
	 /** ModelList holding the fetched enumeration. */
	 enum: any;
	 /** Map of named global data sources keyed by their name. */
	 static globals: Record<string, DataSource>;
	 /**
	  * Returns a data source by name or creates a new one if it doesn't exist (when `create` is `true`).
	  * @param name The name of the data source. A scope can be added as a prefix, separated by a colon.
	  * @param create Whether to create the data source if it doesn't exist.
	  */
	 static get (name: string, create?: boolean) : DataSource;
	/**
	 * Constructs the data source with the specified optional `config` parameters, any of the properties of this object can be specified
	 * in the config. Uses the given basePath as prefix for the `f` parameter for subsequent API operations, a basePath of `candies` will
	 * result in calls to `candies.list`, `candies.count`, etc.
	 * @param {string} basePath
	 * @param {object} config
	 */
	constructor (basePath: string, config?: object);

	/**
	 * Executes one or more API functions (depending on `includeCount`, `includeEnum` and `includeList` properties) to retrieve the
	 * required data (uses debounce to prevent too-quick refreshes).
	 *
	 * Refresh mode can be: `order`, `filter`, `range`, `enum` or `full`. Setting `mode` to `true` will cause a full refresh without debouncing.
	 * @param {string|boolean} mode
	 * @param {(r: any) => void} callback
	 */
	refresh (mode?: string|boolean|((r: any) => void), callback?: (r: any) => void) : void;

	/**
	 * Searches for the item in `list` that matches the specified `fields` and sends it to the callback. If no item is found (or if `forced` is true),
	 * a call to API function `.get` will be executed with the fields as request parameters. Returns a promise.
	 * @param {object} fields
	 * @param {boolean} forced
	 * @returns {Promise<any>}
	 */
	fetch (fields: object, forced?: boolean) : Promise<any>;

	/**
	 * Removes an item from the remote data source by executing the `.delete` API function, passes the given `params` as request
	 * parameters. Returns a promise.
	 * @param {object} params
	 * @returns {Promise<any>}
	 */
	delete (params: object) : Promise<any>;

	/**
	 * Fetches the list via the `.list` API function and populates the `list` property.
	 */
	fetchList () : void;

	/**
	 * Fetches the enumeration via the `.enum` API function and populates the `enum` property.
	 */
	fetchEnum () : void;

	/**
	 * Fetches the record count via the `.count` API function and populates the `count` property.
	 */
	fetchCount () : void;

	/**
	 * Fetches a single record via the `.get` API function, passing the merged request and `params` as parameters.
	 * @param {object} params
	 * @param {(r: any) => void} callback
	 */
	fetchOne (params: object, callback: (r: any) => void) : void;

	/**
	 * Calls the `.delete` API function, passing the merged request and `params` as parameters.
	 * @param {object} params
	 * @param {(r: any) => void} callback
	 */
	fetchDelete (params: object, callback: (r: any) => void) : void;

	/**
	 * Sends an arbitrary API request, merging the data source's `request` properties with `params`. If `params.f` starts with `.` it is
	 * automatically prefixed with the configured `basePath`.
	 * @param {object} params
	 * @returns {Promise<any>}
	 */
	fetchData (params: object) : Promise<any>;

	/**
	 * Builds an absolute URL for an arbitrary API call, merging the data source's `request` properties with `params`. If `params.f` starts
	 * with `.` it is automatically prefixed with the configured `basePath`.
	 * @param {object} params
	 * @returns {string}
	 */
	makeUrl (params: object) : string;

}
export class DataList
{
	 /** Class name identifier. */
	 className: string;
	 /** Debounce delay (in milliseconds) used by `refresh`. Defaults to 250. */
	 debounceDelay: number;
	 /** Request model whose properties are forwarded as parameters to the listing API call. */
	 request: any;
	 /** Internal event-id used to namespace forwarded events. */
	 eid: string;
	 /** Map of named global data lists keyed by their name. */
	 static globals: Record<string, DataList>;
	 /**
	  * Returns a data list by name or creates a new one if it doesn't exist (when `create` is `true`).
	  * @param name The name of the data list. A scope can be added as a prefix, separated by a colon.
	  * @param create Whether to create the data list if it doesn't exist.
	  */
	 static get (name: string, create?: boolean) : DataList;
	/**
	 * Constructs the data list with the specified optional `config` parameters, any of the properties of this object can be specified
	 * in the config. The given `f` parameter is passed directly as a request parameter to the API.
	 * @param {string} f
	 * @param {object} config
	 */
	constructor (f: string, config?: object);

	/**
	 * Executes a request to retrieve the data for the list (uses debounce to prevent too-quick refreshes).
	 * @param {(() => void)|boolean} callback
	 */
	refresh (callback?: (() => void) | boolean) : void;

}
interface EasingFn
{
	 IN: (t: number, k?: number) => number;
	 OUT: (t: number, k?: number) => number;
	 IN_OUT: (t: number, k?: number) => number;
}

export class Easing
{
	/**
	 * Interpolates numeric values between two objects (`src` and `dst`) using the specified `duration` (in seconds) and `easing` function. Note
	 * that all four parameters `src`, `dst`, `duration` and `easing` must be objects having the same number of values.
	 * @param {object} src
	 * @param {object} dst
	 * @param {object} duration
	 * @param {object} easing
	 * @param {(data: object, isFinished: boolean) => void} callback
	 */
	static interpolate (src: object, dst: object, duration: object, easing: object, callback: (data: object, isFinished: boolean) => void) : void;

	 /** Linear easing functions. */
	 static Linear: EasingFn;
	 /** Back easing functions (accepts an optional `k` parameter to control overshoot, defaults to 1.70158). */
	 static Back: EasingFn & { k: number };
	 /** Bounce easing functions. */
	 static Bounce: EasingFn;
	 /** Circular easing functions. */
	 static Circ: EasingFn;
	 /** Cubic easing functions. */
	 static Cubic: EasingFn;
	 /** Exponential easing functions. */
	 static Expo: EasingFn;
	 /** Power easing functions (configurable via the `p` exponent, defaults to 12). */
	 static Power: EasingFn & { p: number };
	 /** Quadratic easing functions. */
	 static Quad: EasingFn;
	 /** Quartic easing functions. */
	 static Quartic: EasingFn;
	 /** Quintic easing functions. */
	 static Quintic: EasingFn;
	 /** Sine easing functions. */
	 static Sine: EasingFn;
	 /** Step easing functions. */
	 static Step: EasingFn;
}
export class Anim
{
	 /** Indicates whether the animation is currently paused. */
	 paused: boolean;
	 /** Indicates whether the animation has finished playing. */
	 finished: boolean;
	 /** Time scale (animation speed). */
	 timeScale: number;
	 /** Creates a new Anim instance. */
	 constructor();
	/**
	 * Returns a clone of the animation, sharing the same compiled list and initial data.
	 * @returns {Anim}
	 */
	clone () : Anim;

	/**
	 * Sets a callback to be invoked when the animation finishes.
	 * @param {() => void} callback
	 * @returns {Anim}
	 */
	onFinished (callback: () => void) : Anim;

	/**
	 * Sets a callback to be invoked on each update tick.
	 * @param {(data: object, anim: Anim) => void} callback
	 * @returns {Anim}
	 */
	onUpdated (callback: (data: object, anim: Anim) => void) : Anim;

	/**
	 * Resets the animation to its initial state.
	 * @returns {Anim}
	 */
	reset () : Anim;

	/**
	 * Sets the initial data object whose fields will be animated.
	 * @param {object} data
	 * @returns {Anim}
	 */
	initial (data: object) : Anim;

	/**
	 * Sets the time scale (animation speed). Must be greater than zero.
	 * @param {number} value
	 * @returns {Anim}
	 */
	speed (value: number) : Anim;

	/**
	 * Sets the output data object that will receive the animated values.
	 * @param {object} data
	 * @returns {Anim}
	 */
	setOutput (data: object) : Anim;

	/**
	 * Pauses the animation.
	 */
	pause () : void;

	/**
	 * Resumes the animation.
	 */
	resume () : void;

	/**
	 * Updates the animation by the specified delta time (seconds).
	 * @param {number} dt
	 * @returns {boolean}
	 */
	update (dt: number) : boolean;

	/**
	 * Runs the subsequent commands in parallel. Should end the parallel block by calling end().
	 * @returns {Anim}
	 */
	parallel () : Anim;

	/**
	 * Runs the subsequent commands in series. Should end the serial block by calling end().
	 * @returns {Anim}
	 */
	serial () : Anim;

	/**
	 * Repeats a block the specified number of times.
	 * @param {number} count
	 * @returns {Anim}
	 */
	repeat (count: number) : Anim;

	/**
	 * Sets the callback of the current block.
	 * @param {() => void} fn
	 * @returns {Anim}
	 */
	callback (fn: () => void) : Anim;

	/**
	 * Ends a parallel(), serial() or repeat() block.
	 * @returns {Anim}
	 */
	end () : Anim;

	/**
	 * Sets the value of a variable.
	 * @param {string} field
	 * @param {any} value
	 * @returns {Anim}
	 */
	set (field: string, value: any) : Anim;

	/**
	 * Restarts the current block.
	 * @param {number} duration
	 * @returns {Anim}
	 */
	restart (duration?: number) : Anim;

	/**
	 * Waits for the specified duration (in seconds, or the name of a field whose value is the duration).
	 * @param {number|string} duration
	 * @returns {Anim}
	 */
	wait (duration: number|string) : Anim;

	/**
	 * Animates a variable over a numeric range using the specified duration and optional easing function.
	 * @param {string} field
	 * @param {number|string} duration
	 * @param {number} startValue
	 * @param {number} endValue
	 * @param {(t: number) => number} easing
	 * @returns {Anim}
	 */
	range (field: string, duration: number|string, startValue: number, endValue: number, easing?: (t: number) => number) : Anim;

	/**
	 * Generates a certain amount of random numbers in the given range (inclusive).
	 * @param {string} field
	 * @param {number|string} duration
	 * @param {number} count
	 * @param {number} startValue
	 * @param {number} endValue
	 * @param {(t: number) => number} easing
	 * @returns {Anim}
	 */
	rand (field: string, duration: number|string, count: number, startValue: number, endValue: number, easing?: (t: number) => number) : Anim;

	/**
	 * Generates a certain amount of random numbers in the given range (inclusive). This uses a static random table to determine the next values.
	 * @param {string} field
	 * @param {number|string} duration
	 * @param {number} count
	 * @param {number} startValue
	 * @param {number} endValue
	 * @param {(t: number) => number} easing
	 * @returns {Anim}
	 */
	randt (field: string, duration: number|string, count: number, startValue: number, endValue: number, easing?: (t: number) => number) : Anim;

	/**
	 * Plays a sound.
	 * @param {{ play: () => void }} snd
	 * @returns {Anim}
	 */
	play (snd: { play: () => void }) : Anim;

	/**
	 * Executes a function.
	 * @param {(anim: Anim) => void} fn
	 * @returns {Anim}
	 */
	exec (fn: (anim: Anim) => void) : Anim;

}
export class Elements
{
	 /** The `<r-tabs>` custom element class. */
	 static Tabs: typeof HTMLElement;
	 /** The `<r-form>` custom element class. */
	 static Form: typeof HTMLElement;
	 /** The `<r-panel>` custom element class. */
	 static Panel: typeof HTMLElement;
	 /** The `<r-list>` custom element class. */
	 static List: typeof HTMLElement;
	 /** The `<r-item>` custom element class. */
	 static Item: typeof HTMLElement;
	 /** The `<r-paginator>` custom element class. */
	 static Paginator: typeof HTMLElement;
	 /** The `<r-table>` custom element class. */
	 static Table: typeof HTMLElement;
	 /** The `<r-select>` custom element class. */
	 static Select: typeof HTMLElement;
	 /** The `<r-image-cropper>` custom element class. */
	 static ImageCropper: typeof HTMLElement;
}
export class Utils
{
	/**
	 * Forces the browser to show a download dialog.
	 * @param {string} filename
	 * @param {string} url
	 */
	static showDownload (filename: string, url: string) : void;

	/**
	 * Forces the browser to show a file selection dialog.
	 * @param {boolean} allowMultiple
	 * @param {string} accept
	 * @param {(files: FileList) => void} callback
	 */
	static showFilePicker (allowMultiple: boolean, accept: string, callback: (files: FileList) => void) : void;

	/**
	 * Loads a file or blob and returns the content as a dataURL.
	 * @param {File|Blob} file
	 * @param {function(string)} callback
	 */
	static loadAsDataUrl (file: File|Blob, callback: (url: string, err: any) => void) : void;

	/**
	 * Loads a file or blob and returns the base64 data.
	 * @param {File|Blob} file
	 */
	static loadAsBase64 (file: File|Blob) : Promise<string>;

	/**
	 * Loads a file or blob and returns the content as text.
	 * @param {File|Blob} file
	 * @param {function(string)} callback
	 */
	static loadAsText (file: File|Blob, callback: (text: string) => void) : void;

	/**
	 * Loads a file or blob and returns the content as array buffer.
	 * @param {File|Blob} file
	 * @param {function(ArrayBuffer)} callback
	 */
	static loadAsArrayBuffer (file: File|Blob, callback: (buffer: ArrayBuffer) => void) : void;

	/**
	 * Loads a list of files or blobs and returns the content as dataURLs.
	 * @param {Array<File|Blob>} fileList
	 * @param {(results: Array<{ name: string, size: number, url: string }>) => void} callback
	 */
	static loadAllAsDataUrl (fileList: Array<File|Blob>, callback: (results: Array<{ name: string, size: number, url: string }>) => void) : void;

	/**
	 * Loads an image from a url and returns it as an Image object.
	 * @param {string} url
	 * @param {function(Image)} callback
	 */
	static loadImageFromUrl (url: string, callback: (image: HTMLImageElement) => void) : void;

}
export class db
{
	/**
	 * Initializes the database connection.
	 * @param {string} dbName
	 * @param {number} version
	 * @param {(db: IDBDatabase, txn: IDBTransaction, oldVersion: number) => void} upgradeCallback
	 * @returns {Promise<void>}
	 */
	static init (dbName: string, version: number, upgradeCallback: (db: IDBDatabase, txn: IDBTransaction, oldVersion: number) => void) : Promise<void>;

	/**
	 * Returns an index object for later use with methods that accept an IDBIndex in the `storeName` parameter.
	 * @param {string} storeName
	 * @param {string} indexName
	 * @returns {IDBIndex}
	 */
	static index (storeName: string, indexName: string) : IDBIndex;

	/**
	 * Runs a callback for each record in a data store.
	 * @param {string|IDBIndex|IDBObjectStore} storeName
	 * @param {string} id
	 * @param { (value:object, cursor:IDBCursor) => Promise<boolean> } callback
	 * @returns {Promise<void>}
	 */
	static forEach (storeName: string|IDBIndex|IDBObjectStore, id: string, callback: (value:object, cursor:IDBCursor) => Promise<boolean>) : Promise<void>;

	/**
	 * Returns the count of all records from the specified data store.
	 * @param {string|IDBIndex|IDBObjectStore} storeName
	 * @returns {Promise<number>}
	 */
	static count (storeName: string|IDBIndex|IDBObjectStore) : Promise<number>;

	/**
	 * Returns all records from the specified data store.
	 * @param {string|IDBIndex|IDBObjectStore} storeName
	 * @param {string|number|Array<string|number>} filter
	 * @returns {Promise<Array<object>>}
	 */
	static getAll (storeName: string|IDBIndex|IDBObjectStore, filter?: string|number|Array<string|number>) : Promise<Array<object>>;

	/**
	 * Returns all keys from the specified data store.
	 * @param {string|IDBIndex|IDBObjectStore} storeName
	 * @param {string|number|Array<string|number>} filter
	 * @returns {Promise<Array<string|number|Array<string|number>>>}
	 */
	static getAllKeys (storeName: string|IDBIndex|IDBObjectStore, filter?: string|number|Array<string|number>) : Promise<Array<object>>;

	/**
	 * Loads a list of records having unique values from the specified data store and returns the entire object or just the specified field.
	 * @param {string|IDBIndex|IDBObjectStore} storeName
	 * @param {string} 
	 * @returns {Promise<Array<number|string|object>>}
	 */
	static getAllUnique (storeName: string|IDBIndex|IDBObjectStore) : Promise<Array<number|string|object>>;

	/**
	 * Returns a single record from the specified data store.
	 * @param {string|IDBIndex|IDBObjectStore} storeName
	 * @param {string|number|Array<string|number>} id
	 * @returns {Promise<object>}
	 */
	static get (storeName: string|IDBIndex|IDBObjectStore, id: string|number|Array<string|number>) : Promise<object>;

	/**
	 * Adds or overwrites a record in the specified data store (data must include the primary key).
	 * @param {string} storeName
	 * @param {object} data
	 * @returns {Promise<void>}
	 */
	static put (storeName: string, data: object) : Promise<void>;

	/**
	 * Returns a variable from the system table.
	 * @param {string} name - Name of the property to read.
	 * @param {boolean} full - When `true` the entire object will be returned.
	 * @returns {any}
	 */
	static sysGet (name: string, full?: boolean) : any;

	/**
	 * Writes a variable to the system table.
	 * @param {string} name - Name of the property to write.
	 * @param {any} value - Value to write.
	 * @param {boolean} full - When `true` the entire value will be written as-is.
	 * @returns {void}
	 */
	static sysPut (name: string, value: any, full?: boolean) : void;

	/**
	 * Returns a single record from the specified data store that matches the `partial` object and does NOT match the `notPartial` object.
	 * @param {string|IDBIndex|IDBObjectStore} storeName
	 * @param {object} 
	 * @param {object} 
	 * @returns {Promise<object>}
	 */
	static findOne (storeName: string|IDBIndex|IDBObjectStore, partial?: object, notPartial?: object) : Promise<object>;

	/**
	 * Deletes a record from the specified data store.
	 * @param {string} storeName
	 * @param {string|number|Array<string|number>} id
	 * @returns {Promise<void>}
	 */
	static delete (storeName: string, id: string|number|Array<string|number>) : Promise<void>;

	/**
	 * Deletes all items in the specified store.
	 * @param {string|IDBIndex|IDBObjectStore} storeName
	 * @param {string|number|Array<string|number>} id
	 * @returns {Promise<void>}
	 */
	static deleteAll (storeName: string|IDBIndex|IDBObjectStore, id: string|number|Array<string|number>) : Promise<void>;

	/**
	 * Inserts a new record in the specified data store.
	 * @param {string} storeName
	 * @param {object} data
	 * @returns {Promise<void>}
	 */
	static insert (storeName: string, data: object) : Promise<void>;

}
export class geo
{
	/**
	 * Initializes the geolocation interface. Returns boolean indicating whether geolocation
	 * is supported on the device.
	 * @returns {boolean}
	 */
	static init() : boolean;

	/**
	 * Single-shot positioning operation. While the geolocation operation is in progress, the `.busy-geo` CSS class
	 * will be set in the `html` element. You can use this to display a spinner or other indicator.
	 * @returns {Promise<GeolocationPosition>}
	 */
	static getCurrentPosition() : Promise<GeolocationPosition>;

	/**
	 * Cancels the active positioning operation (if any).
	 */
	static cancel() : void;

}