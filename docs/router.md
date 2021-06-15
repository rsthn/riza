# Router

The Router is a module that detects local URL changes (when a hash-change occurs, that is, the part of the URL located after the hash `#` symbol) and forwards events to the appropriate handlers.

```js
const { Router } = require('riza');
```

```js
const { Router } = riza;
```

<br/>

# Properties

#### string `location`
Current relative location (everything after the hash symbol).

#### array[string] `args`
Current relative location as an array of elements (obtained by splitting the relative location by slash).

<br/>

# Methods

#### void `init` ()
Initializes the router module. Note that most browsers do not trigger a `hashchange` event for a second time if you reload the page and you're already on some hash URL, ensure to call `refresh` just once after the page/app loads to force a hashchange event.

<br/>

#### void `refresh` ()
Refreshes the current route by forcing a hashchange event.

<br/>

#### void `setRoute` ( string route, bool silent=false )
Changes the current location and optionally prevents triggering the hashchange event.

<br/>

#### Route `addRoute` ( string route, void onRoute (object evt, object args), void onUnroute (object evt) )
#### Route `addRoute` ( string route, void onRoute (object evt, object args) )
Adds the specified route to the routing map. When the specified route is detected, the `onRoute` handler will be called, and when the route exits `onUnroute` will be called.

Routes can have capture specifiers, those are identifiers preceeded by a `:` symbol. For example a route of the form `/users/:user_id/view` will cause you to get a variable named `user_id` in your `args` parameter when the callback is executed, such that a location like `/users/12/view` will make your `args.user_id` to have the value of 12.

<br/>

#### void `addRoutes` ( object routes )
Adds the specified routes to the routing map. The `routes` map should contain the route expression in the key of the map and a handler function in the value.

<br/>

#### void `removeRoute` ( string route, void onRoute (object evt, object args), void onUnroute (object evt) )
#### void `removeRoute` ( string route, void onRoute (object evt, object args) )
Removes the specified route from the routing map.

<br/>

#### void `removeRoutes` ( object routes )
Removes the specified routes from the routing map. The routes map should contain the route expression in the key of the map and a handler function in the value.

<br/>

#### string `realLocation` ( string cLocation, string pLocation )
Given a formatted location and a previous one it will return the correct real location.

<br/>

#### void `navigate` (string location, bool replace=false)
Navigates to the given relative location.
