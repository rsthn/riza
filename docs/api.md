# Api

Provides functions to interact with a web service compliant with the behavior defined by [Wind](./wind.md).

```js
const { Api } = require('@rsthn/riza');
```

```js
const { Api } = riza;
```

<br/>

# Properties

#### string `apiUrl`
Target URL for all the API requests. Set by calling `setEndPoint` (default is "/api").

#### int `retries`
Number of retries to execute each API call before giving up and invoking error handlers (default is 1).

<br/>

# Methods

#### void `setEndPoint` (string apiUrl)
Sets the API end-point URL address.

<br/>

#### bool `responseFilter` (object res, object req)
Overridable filter that processes the response from the server and returns true if it was successful. The `res` parameter indicates the response data, and `req` the request data.

<br/>

#### void `packageBegin` ()
Starts "package-mode" (using the `rpkg` field). Any API calls after this will be bundled together.

<br/>

#### void `packageEnd` ()
Finishes "package-mode" and a single API request with the currently constructed package will be sent.

<br/>

#### void `packRequests` ( void callback () )
Starts package-mode, executes the callback and finishes package-mode. Therefore any requests made by the callback will be packed together.

<br/>

#### void `apiCall` ( object params, void success (object res, object req), void failure (object req), string httpMethod )
#### void `apiCall` ( object params, void success (object res, object req), void failure (object req) )
#### void `apiCall` ( object params, void success (object res, object req) )
Executes an API call to the URL stored in the `apiUrl` property. By default `httpMethod` is "auto", which will determine the best depending on the data to be sent. Any connection error will be reported to the `failure` callback, and similarly any success to the `success` callback. The `params` object can be a FormData object or just a regular object.

<br/>

#### void `post` ( object params, void success (object res, object req), void failure (object req) )
#### void `post` ( object params, void success (object res, object req) )
Similar to `apiCall` but forces a POST request.

<br/>

#### void `get` ( object params, void success (object res, object req), void failure (object req) )
#### void `get` ( object params, void success (object res, object req) )
Similar to `apiCall` but forces a GET request.

<br/>

#### Promise `fetch` ( object params )
Identical to `apiCall` but returns a promise.

<br/>

# Notes

- When an API call is in progress, the root `html` element will get CSS class `.busy`, and this class will be removed when the call is completed. This feature can be used to create loading spinners.
