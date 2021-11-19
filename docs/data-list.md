# DataList

Provides several methods to quickly interface with a remote data-source as defined by [Wind](./wind.md#data-sources).

```js
import { DataList } from 'riza';
```

<br/>

# Properties

### `debounceDelay` : int
Delay in milliseconds to wait before actually executing a refresh. Useful to prevent refreshing the data source multiple times in a short period of time (default is 250ms).

### `request` : object
Request parameters sent on every API request. Filter, ordering and pagination parameters are maintained in this object.

<br/>

# Methods

### `constructor` (`f`: string, `config`: object) : void
### `constructor` (`f`: string) : void

Constructs the data list with the specified optional `config` parameters, any of the properties of this object can be specified in the config. The given `f` parameter is passed directly as a request parameter to the API.

<br/>

### `refresh` (`callback`: () => void) : void

Executes an API request to retrieve the data for the list (uses debounce to prevent too-quick refreshes). Results are placed in the `ModelList` using the `setData` method.
