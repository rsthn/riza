# Api

Provides functions to interact with an API compliant with the behavior defined by [Wind](https://github.com/rsthn/rose-core/blob/master/Wind.md).

```js
import { Api } from 'riza';
```

<br/>

# Properties

### `apiUrl` : string
Target URL for all the API requests. Set by calling `setEndPoint` (default is "/api").

### `retries` : int
Number of retries to execute each API call before giving up and invoking error handlers (default is 1).

<br/>

# Methods

### `setEndPoint` ( `apiUrl`: string ) : void
Sets the API end-point URL address.

<br/>

### `responseFilter` ( `res`: object, `req`: object ) : boolean
Overridable filter that processes the response from the server and returns true if it was successful. The `res` parameter indicates the response data, and `req` the request data.

<br/>

### `packageBegin` () : void
Starts "package-mode" (using the `rpkg` field). Any API calls after this will be bundled together.

<br/>

### `packageEnd` () : void
Finishes "package-mode" and a single API request with the currently constructed package will be sent.

<br/>

### `packRequests` ( `callback`: () => void ) : void
Starts package-mode, executes the callback and finishes package-mode. Therefore any requests made by the callback will be packed together.

<br/>

### `apiCall` ( `params`: object, `success`: (res: object, req: object) => void, `failure`: (req: object) => void, `httpMethod`: string ) : void
### `apiCall` ( `params`: object, `success`: (res: object, req: object) => void, `failure`: (req: object) => void ) : void
### `apiCall` ( `params`: object, `success`: (res: object, req: object) => void ) : void
Executes an API call to the URL stored in the `apiUrl` property. By default `httpMethod` is "auto", which will determine the best depending on the data to be sent. Any connection error will be reported to the `failure` callback, and similarly any success to the `success` callback. The `params` object can be a FormData object or just a regular object.

<br/>

### `post` ( `params`: object, `success`: (res: object, req: object) => void, `failure`: (req: object) => void ) : void
### `post` ( `params`: object, `success`: (res: object, req: object) => void ) : void
Similar to `apiCall` but forces a POST request.

<br/>

### `get` ( `params`: object, `success` (res: object, req: object) => void, `failure`: (req: object) => void ) : void
### `get` ( `params`: object, `success` (res: object, req: object) => void ) : void
Similar to `apiCall` but forces a GET request.

<br/>

### `fetch` ( params: object ) : Promise\<object>
Identical to `apiCall` but returns a promise.

<br/>

# Notes

- When an API call is in progress, the root `html` element will get CSS class `.busy`, and this class will be removed when the call is completed. This feature can be used to create global loading spinners.
