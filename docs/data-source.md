# DataSource

Provides several methods to quickly interface with a remote data-source as defined by [Wind](./wind.md#data-sources).

```js
const { DataSource } = require('riza');
```

```js
const { DataSource } = riza;
```

<br/>

# Properties

#### int `debounceDelay`
Delay in milliseconds to wait before actually executing a refresh. Useful to prevent refreshing the data source multiple times in a short period of time (default is 250ms).

#### object `request`
Request parameters sent on every API request. Filter, ordering and pagination parameters are maintained in this object.

#### int `count`
Value of field `count` obtained after executing `.count` API function. Describes the total number of items in the dataset that match the current filters.

#### ModelList `list`
Result set obtained after executing the `.list` API function.

#### ModelList `enum`
Result set obtained after executing the `.enum` API function.

#### bool `includeCount`
Indicates if `count` property should be populated from the `.count` API function. Automatically set to true by certain custom elements. Default is false.

#### bool `includeEnum`
Indicates if `enum` property should be populated from the `.enum` API function. Automatically set to true by certain custom elements. Default is false.

#### bool `includeList`
Indicates if `list` property should be populated from the `.list` API function. Default is true.

<br/>

# Methods

#### void `DataSource` (string basePath, object config)
#### void `DataSource` (string basePath)

Constructs the data source with the specified optional `config` parameters, any of the properties of this object can be specified in the config. Uses the given basePath as prefix for the `f` parameter for subsequent API operations, a basePath of `candies` will result in calls to `candies.list`, `candies.count`, etc.

<br/>

#### void `refresh` (string mode='full')

Executes one or more API functions (depending on `includeCount`, `includeEnum` and `includeList` properties) to retrieve the required data (uses debounce to prevent too-quick refreshes).

The `mode` parameter specifies the reason of the refresh and helps the DataSource to determine which API functions to call. Let's assume that a data source has all include* properties set to true, the `mode` parameter controls which are actually called as follows:

| Mode |`.count`|`.list`|`.enum`|Description|
|------|--------|-------|------|------------|
|`order` | |✔| |Changed column used to sort data.
|`filter`|✔|✔| |Changed data filters.
|`range` | |✔| |Changed pagination range.
|`full`  |✔|✔|✔|Full Refresh

<br/>

#### Promise `fetch` (object fields, bool forced=false)

Searches for the item in `list` that matches the specified `fields` and sends it to the callback. If no item is found (or if `forced` is true), a call to API function `.get` will be executed with the fields as request parameters. Returns a promise.

<br/>

#### Promise `delete` (object fields)

Removes an item from the remote data source by executing the `.delete` API function, passes the given `fields` as request parameters. Returns a promise.
