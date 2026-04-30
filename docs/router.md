# Router

The Router is a module that detects local URL changes (when a hash-change occurs, that is, the part of the URL located after the hash `#` symbol) and forwards events to the appropriate handlers.

```js
import { Router } from 'riza';
```

<br/>

## Properties

### `location` : string
Current relative location (everything after the hash symbol).

### `args` : Array\<string>
Current relative location as an array of elements (obtained by splitting the relative location by slash).

<br/>

## Methods

### `init` () : void
Initializes the router module. The module auto-initializes itself on import, so calling this is normally unnecessary. Note that most browsers do not trigger a `hashchange` event for a second time if you reload the page and you're already on some hash URL, so you should call `refresh` once after the page/app loads to force a hashchange event.

<br/>

### `refresh` () : void
Refreshes the current route by forcing a hashchange event.

<br/>

### `setRoute` ( `route`: string, `silent`: boolean=false ) : void
Changes the current location and optionally prevents triggering the hashchange event.

<br/>

### `addRoute` ( `route`: string, `onRoute`: (evt: object, args: object) => void, `onUnroute`: (evt: object, args: object) => void ) : [Route](#route)
### `addRoute` ( `route`: string, `onRoute`: (evt: object, args: object) => void ) : [Route](#route)
Adds the specified route to the routing map. When the specified route is detected, the `onRoute` handler will be called, and when the route exits `onUnroute` will be called. Returns the [`Route`](#route) object associated with the path (creating it if it didn't exist).

Routes can have capture specifiers, those are identifiers preceeded by a `:` symbol. For example a route of the form `/users/:user_id/view` will cause you to get a variable named `user_id` in your `args` parameter when the callback is executed, such that a location like `/users/12/view` will make your `args.user_id` to have the value of 12.

<br/>

### `getRoute` ( `route`: string ) : [Route](#route)
Returns the [`Route`](#route) object associated with the given path, creating one if it doesn't already exist. Useful when you want a handle on the route to attach handlers manually via [`Route.addHandler`](#route).

<br/>

### `addRoutes` ( `routes`: object ) : void
Adds the specified routes to the routing map. The `routes` map should contain the route expression in the key of the map and a handler function in the value.

<br/>

### `removeRoute` ( `route`: string, `onRoute`: (evt: object, args: object) => void, `onUnroute`: (evt: object, args: object) => void ) : void
### `removeRoute` ( `route`: string, `onRoute`: (evt: object, args: object) => void ) : void
Removes the specified route from the routing map.

<br/>

### `removeRoutes` ( `routes`: object ) : void
Removes the specified routes from the routing map. The routes map should contain the route expression in the key of the map and a handler function in the value.

<br/>

### `realLocation` ( `cLocation`: string, `pLocation`: string=null ) : string
Given a formatted location and an optional previous one it will return the correct real location. When `pLocation` is omitted, the current `location` is used.

<br/>

### `navigate` (`location`: string, `replace`: boolean=false) : void
Navigates to the given relative location.

<br/>

## Route

Returned by [`addRoute`](#addroute--route-string-onroute-evt-object-args-object--void-onunroute-evt-object-args-object--void--routeroute) and [`getRoute`](#getroute--route-string--routeroute), and exposed via `Router.Route` as the underlying class. Extends `EventDispatcher`.

### Properties

#### `value` : string
The original route expression that was used to construct the route.

#### `params` : Array\<string>
The names of the capture parameters declared in the route expression.

#### `args` : object
The parameters captured during the most recent positive match. Also passed to `routed` handlers.

#### `active` : boolean
`true` while the route is currently matched by the location.

#### `changed` : boolean
`true` when one or more captured parameters changed value relative to the previous dispatch (a transition from inactive to active also sets this to `true`).

### Methods

#### `addHandler` ( `handler`: (evt: object, args: object) => void, `unrouted`: boolean=false, `context`: object=null ) : void
Attaches a handler. When `unrouted` is `true` the handler will be invoked when the route exits instead of when it enters.

#### `removeHandler` ( `handler`: function, `unrouted`: boolean=false, `context`: object=null ) : void
Detaches a handler that was previously attached via `addHandler`. The same `unrouted` and `context` values must be supplied.
