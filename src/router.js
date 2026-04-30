
import { EventDispatcher } from 'rinn';

/**
 * The Router is a special module that detects local URL changes (when a hash-change occurs) and
 * forwards events to the appropriate handlers.
 */

//!class Route

const _Router =
{
    Route: EventDispatcher.extend
    ({
        /**
         * Regular expression for the route. Generated from the simpler expression provided in the constructor.
         * !routeRegex: string;
         */
        routeRegex: null,

        /**
         * Original route string value.
         * !value: string;
         */
        value: null,

        /**
         * List of parameter names obtained from the route expression (in order of appearance).
         * !params: Array<string>;
         */
        params: null,

        /**
         * Arguments obtained from the current route (uses `params` to determine the name of each argument).
         * !args: object;
         */
        args: null,

        /**
         * Arguments string obtained from the last route dispatch. Used to check if the arguments changed.
         * !s_args: string;
         */
        s_args: null,

        /**
         * Indicates if the route is active because of a past positive dispatch.
         * !active: boolean;
         */
        active: false,

        /**
         * Indicates if the params have changed since the last event. The transition from inactive to active route will always set this value to true.
         * !changed: boolean;
         */
        changed: false,

        /**
         * Constructor of the route, the specified argument is a route expression.
         * @param {string} route
         * !constructor (route: string);
         */
        __ctor: function (route)
        {
            this._super.EventDispatcher.__ctor();
            this._compileRoute (this.value = route);
        },

        /*
        **	Transforms the specified route expression into a regular expression and a set of parameter
        **	names and stores them in the 'param' array.
        **
        **	>> void _compileRoute (string route);
        */
        _compileRoute: function (route)
        {
            this.params = [];

            route = route.replace(/\/\*\//g, '/.+/');

            while (true)
            {
                let m = /:([!@A-Za-z0-9_-]+)/.exec(route);
                if (!m) break;
    
                route = route.replace(m[0], '([^/]+)');
                this.params.push (m[1]);
            }

            this.routeRegex = '^' + route.replace(/##/g, '');
        },

        /**
         * Adds a handler to the route dispatcher. The handler can be removed later using `removeHandler` and
         * specifying the same parameters. If `unrouted` is `true` the event to listen to will be the
         * `unrouted` event (when the route changes and the route is not activated).
         * @param {(args: object) => void} handler
         * @param {boolean} unrouted
         * @param {object} context
         * !addHandler (handler: (args: object) => void, unrouted?: boolean, context?: object) : void;
         */
        addHandler: function (handler, unrouted=false, context=null)
        {
            this.addEventListener ((unrouted === true ? 'un' : '') + 'routed', handler, context);
        },

        /**
         * Removes a handler from the route dispatcher.
         * @param {(args: object) => void} handler
         * @param {boolean} unrouted
         * @param {object} context
         * !removeHandler (handler: (args: object) => void, unrouted?: boolean, context?: object) : void;
         */
        removeHandler: function (handler, unrouted=false, context=null)
        {
            this.removeEventListener ((unrouted === true ? 'un' : '') + 'routed', handler, context);
        },

        /**
         * Verifies if the specified location matches the internal route and dispatches either a `routed` or `unrouted` event with the
         * parameters obtained from the location to all attached handlers.
         * @param {string} route
         * !dispatch (route: string) : void;
         */
        dispatch: function (route)
        {
            let matches = route.match(this.routeRegex);
            if (!matches)
            {
                this.s_args = null;

                if (this.active)
                    this.dispatchEvent ('unrouted', { route: this });

                this.active = false;
                return;
            }

            let args = { route: this };
            let str = '';

            for (let i = 0; i < this.params.length; i++)
            {
                args[this.params[i]] = matches[i+1];
                str += '_' + matches[i+1];
            }

            this.changed = str != this.s_args;
            this.s_args = str;

            this.dispatchEvent ('routed', this.args = args);
            this.active = true;
        }
    }),

    //!/class

    //!class Router

    //! /** Reference to the Route class used to construct route instances. */
    //! static Route: typeof Route;
    //! /** Map of route objects keyed by route expression. */
    //! static routes: Record<string, Route>;
    //! /** Sorted list of route keys (smaller routes first). */
    //! static sortedRoutes: Array<string>;
    //! /** Number of upcoming hashchange events that the location-changed handler should ignore. */
    //! static ignoreHashChangeEvent: number;
    //! /** Current relative location (everything after the location hash symbol). */
    //! static location: string;
    //! /** Current relative location as an array of segments (obtained by splitting the location by `/`). */
    //! static args: Array<string>;

    routes: { },

    sortedRoutes: [ ],

    ignoreHashChangeEvent: 0,

    location: '',

    args: [],

    /**
     * Initializes the router module. Ensure to call `refresh` once to force a hashchange when the page loads.
     * !static init () : void;
     */
    init: function ()
    {
        if (this.alreadyAttached)
            return;

        this.alreadyAttached = true;

        if ('onhashchange' in globalThis) {
            globalThis.onhashchange = this.onLocationChanged.bind(this);

            this.location = globalThis.location.hash.substring(1);
            this.args = this.location.split ('/');
        }
    },

    /**
     * Refreshes the current route by forcing a hashchange event.
     * !static refresh () : void;
     */
    refresh: function () {
        this.onLocationChanged();
    },

    /**
     * Changes the current location and optionally prevents a trigger of the hashchange event.
     * @param {string} route
     * @param {boolean} silent
     * !static setRoute (route: string, silent?: boolean) : void;
     */
    setRoute: function (route, silent)
    {
        let location = this.realLocation (route);
        if (location == this.location) return;

        if (silent) this.ignoreHashChangeEvent++;
        globalThis.location.hash = location;
    },

    /**
     * Adds the specified route to the routing map. When the specified route is detected, the `onRoute` handler will be called, and then
     * when the route exits `onUnroute` will be called.
     * @param {string} route
     * @param {(args: object) => void} onRoute
     * @param {(args: object) => void} onUnroute
     * @returns {Route}
     * !static addRoute (route: string, onRoute: (args: object) => void, onUnroute?: (args: object) => void) : Route;
     */
    addRoute: function (route, onRoute, onUnroute=null)
    {
        if (!this.routes[route]) {
            this.routes[route] = new this.Route (route);
            this.sortedRoutes.push (route);

            this.sortedRoutes.sort ((a, b) => {
                return this.routes[a].routeRegex.length - this.routes[b].routeRegex.length;
            });
        }

        if (onUnroute !== null) {
            this.routes[route].addHandler (onRoute, false);
            this.routes[route].addHandler (onUnroute, true);
        }
        else
            this.routes[route].addHandler (onRoute, false);

        return this.routes[route];
    },

    /**
     * Returns the Route object for the specified route, creating it if it doesn't exist yet.
     * @param {string} route
     * @returns {Route}
     * !static getRoute (route: string) : Route;
     */
    getRoute: function (route)
    {
        if (!this.routes[route])
        {
            this.routes[route] = new this.Route (route);
            this.sortedRoutes.push (route);

            this.sortedRoutes.sort ((a, b) => {
                return this.routes[a].routeRegex.length - this.routes[b].routeRegex.length;
            });
        }

        return this.routes[route];
    },

    /**
     * Adds the specified routes to the routing map. The `routes` object should map a route expression (key) to a handler (value).
     * @param {Record<string, (args: object) => void>} routes
     * !static addRoutes (routes: Record<string, (args: object) => void>) : void;
     */
    addRoutes: function (routes)
    {
        for (let i in routes)
        {
            if (!this.routes[i]) {
                this.routes[i] = new this.Route (i);
                this.sortedRoutes.push (i);
            }

            this.routes[i].addHandler (routes[i], false);
        }

        this.sortedRoutes.sort ((a, b) => {
            return this.routes[a].routeRegex.length - this.routes[b].routeRegex.length;
        });
    },

    /**
     * Removes the specified route from the routing map.
     * @param {string} route
     * @param {(args: object) => void} onRoute
     * @param {(args: object) => void} onUnroute
     * !static removeRoute (route: string, onRoute: (args: object) => void, onUnroute?: (args: object) => void) : void;
     */
    removeRoute: function (route, onRoute, onUnroute)
    {
        if (!this.routes[route]) return;

        if (onUnroute !== undefined) {
            this.routes[route].removeHandler (onRoute, false);
            this.routes[route].removeHandler (onUnroute, true);
        }
        else
            this.routes[route].removeHandler (onRoute);
    },

    /**
     * Removes the specified routes from the routing map. The `routes` object should map a route expression (key) to a handler (value).
     * @param {Record<string, (args: object) => void>} routes
     * !static removeRoutes (routes: Record<string, (args: object) => void>) : void;
     */
    removeRoutes: function (routes)
    {
        for (let i in routes)
        {
            if (!this.routes[i]) continue;
            this.routes[i].removeHandler (routes[i]);
        }
    },

    /**
     * Given a formatted location and a previous one (defaults to the current location) returns the correct real location.
     * @param {string} cLocation
     * @param {string} pLocation
     * @returns {string}
     * !static realLocation (cLocation: string, pLocation?: string) : string;
     */
    realLocation: function (cLocation, pLocation)
    {
        if (!pLocation) pLocation = this.location;
        if (!pLocation) pLocation = ' ';

        let state = 0, i = 0, j = 0, k;
        let rLocation = '';

        while (state != -1 && i < cLocation.length && j < pLocation.length)
        {
            switch (state)
            {
                case 0:
                    if (cLocation.substr(i++, 1) == '*') {
                        state = 1;
                        break;
                    }

                    if (cLocation.substr(i-1, 1) != pLocation.substr(j++, 1)) {
                        rLocation += cLocation.substr(i-1);
                        state = -1;
                        break;
                    }

                    rLocation += pLocation.substr(j-1, 1);
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

                    rLocation += pLocation.substr(j, k-j);

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

                    rLocation += pLocation.substr(j, k-j);

                    state = 0;
                    j = k;
                    break;
            }
        }

        if (state != -1)
            rLocation += cLocation.substr(i);

        return rLocation.trim();
    },

    /**
     * Event handler called when the location hash changes.
     * !static onLocationChanged () : void;
     */
    onLocationChanged: function ()
    {
        if (this.prevLocation !== this.location)
            this.prevLocation = this.location;

        let cLocation = globalThis.location.hash.substring(1);
        let rLocation = this.realLocation(cLocation);

        if (cLocation !== rLocation) {
            globalThis.location.replace('#' + rLocation);
            return;
        }

        this.location = cLocation;
        this.args = this.location.split ('/');

        if (this.ignoreHashChangeEvent > 0) {
            this.ignoreHashChangeEvent--;
            return;
        }

        for (let i = 0; i < this.sortedRoutes.length; i++)
            this.routes[this.sortedRoutes[i]].dispatch (this.location);
    },

    /**
     * Navigates to the given hash-based URL.
     * @param {string} location
     * @param {boolean} replace
     * !static navigate (location: string, replace?: boolean) : void;
     */
    navigate: function (location, replace=false)
    {
        location = this.realLocation(location);

        if (globalThis.location.hash == '#'+location) {
            this.refresh();
            return;
        }

        if (replace)
            globalThis.location.replace('#'+location);
        else
            globalThis.location.hash = location;
    }
};

//!/class

_Router.init();
export default _Router;
