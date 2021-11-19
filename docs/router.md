# Router

The Router is a module that detects local URL changes (when a hash-change occurs, that is, the part of the URL located after the hash `#` symbol) and forwards events to the appropriate handlers.

```js
import { Router } from 'riza';
```

<br/>

# Properties

### `location` : string
Current relative location (everything after the hash symbol).

### `args` : Array\<string>
Current relative location as an array of elements (obtained by splitting the relative location by slash).

<br/>

# Methods

### `init` () : void
Initializes the router module. Note that most browsers do not trigger a `hashchange` event for a second time if you reload the page and you're already on some hash URL, ensure to call `refresh` just once after the page/app loads to force a hashchange event.

<br/>

### `refresh` () : void
Refreshes the current route by forcing a hashchange event.

<br/>

### `setRoute` ( `route`: string, `silent`: boolean=false ) : void
Changes the current location and optionally prevents triggering the hashchange event.

<br/>

### `addRoute` ( `route`: string, `onRoute`: (evt: object, args: object) => void, `onUnroute`: (evt: object) => void ) : void
### `addRoute` ( `route`: string, `onRoute`: (evt: object, args: object) => void ) : void
Adds the specified route to the routing map. When the specified route is detected, the `onRoute` handler will be called, and when the route exits `onUnroute` will be called.

Routes can have capture specifiers, those are identifiers preceeded by a `:` symbol. For example a route of the form `/users/:user_id/view` will cause you to get a variable named `user_id` in your `args` parameter when the callback is executed, such that a location like `/users/12/view` will make your `args.user_id` to have the value of 12.

<br/>

### `addRoutes` ( `routes`: object ) : void
Adds the specified routes to the routing map. The `routes` map should contain the route expression in the key of the map and a handler function in the value.

<br/>

### `removeRoute` ( `route`: string, `onRoute`: (evt: object, args: object) => void, `onUnroute`: (evt: object) => void ) : void
### `removeRoute` ( `route`: string, `onRoute`: (evt: object, args: object) => void ) : void
Removes the specified route from the routing map.

<br/>

### `removeRoutes` ( `routes`: object ) : void
Removes the specified routes from the routing map. The routes map should contain the route expression in the key of the map and a handler function in the value.

<br/>

### `realLocation` ( `cLocation`: string, `pLocation`: string ) : string
Given a formatted location and a previous one it will return the correct real location.

<br/>

### `navigate` (`location`: string, `replace`: boolean=false) : void
Navigates to the given relative location.
