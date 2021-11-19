# DataSource

Provides several methods to quickly interface with a remote data-source as defined by [Wind](./wind.md#data-sources).

```js
import { DataSource } from 'riza';
```

<br/>

# Properties

### `debounceDelay` : int
Delay in milliseconds to wait before actually executing a refresh. Useful to prevent refreshing the data source multiple times in a short period of time (default is 250ms).

### `request` : object
Request parameters sent on every API request. Filter, ordering and pagination parameters are maintained in this object.

### `count` : int
Value of field `count` obtained after executing `.count` API function. Describes the total number of items in the dataset that match the current filters.

### `list` : ModelList
Result set obtained after executing the `.list` API function.

### `enum` : ModelList
Result set obtained after executing the `.enum` API function.

### `includeCount` : boolean
Indicates if `count` property should be populated from the `.count` API function. Automatically set to true by certain custom elements. Default is false.

### `includeEnum` : boolean
Indicates if `enum` property should be populated from the `.enum` API function. Automatically set to true by certain custom elements. Default is false.

### `includeList` : boolean
Indicates if `list` property should be populated from the `.list` API function. Default is true.

<br/>

# Methods

### `constructor` (`basePath`: string, `config`: object) : void
### `constructor` (`basePath`: string) : void

Constructs the data source with the specified optional `config` parameters, any of the properties of this object can be specified in the config. Uses the given basePath as prefix for the `f` parameter for subsequent API operations, a basePath of `candies` will result in calls to `candies.list`, `candies.count`, etc.

<br/>

### `refresh` (`mode`: string='full') : void

Executes one or more API functions (depending on `includeCount`, `includeEnum` and `includeList` properties) to retrieve the required data (uses debounce to prevent too-quick refreshes).

The `mode` parameter specifies the reason of the refresh and helps the DataSource to determine which API functions to call. Let's assume that a data source has all include* properties set to true, the `mode` parameter controls which are actually called as follows:

| Mode |`.count`|`.list`|`.enum`|Description|
|------|--------|-------|------|------------|
|`order` | |✔| |Changed column used to sort data.
|`filter`|✔|✔| |Changed data filters.
|`range` | |✔| |Changed pagination range.
|`full`  |✔|✔|✔|Full Refresh

<br/>

### `fetch` (`fields`: object, `forced`: boolean=false) : Promise\<object>

Searches for the item in `list` that matches the specified `fields` and sends it to the callback. If no item is found (or if `forced` is true), a call to API function `.get` will be executed with the fields as request parameters. Returns a promise.

<br/>

### `delete` (`fields`: object) : Promise\<object>

Removes an item from the remote data source by executing the `.delete` API function, passes the given `fields` as request parameters. Returns a promise.

<br/>

### `fetchData` (`fields`: object) : Promise\<object>

Executes a data fetch with the specified fields (and the active request parameters) and returns a promise.

<br/>

### `makeUrl` (`fields`: object) : string

Returns a URL formed with the API end point, the specified fields and the active request parameters.
