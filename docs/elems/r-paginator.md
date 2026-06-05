# r-paginator

Provides pagination functionality to any `DataSource`. When a property of the paginator's model changes (primarily related to page and count) the data source will be automatically refreshed.

|Attribute|Required|Description
|---------|--------|-----------
|`data-source`|Optional|Path to a `DataSource` object. The `includeCount` property of the `DataSource` will be automatically set by this element.
|`data-page-size`|Optional|Number of items to show per page (default is 25).

<br/>

# Model

Filtering can be achieved by creating input elements that alter the model of the paginator (using `data-property` watchers). Any updated field that is not a special field (i.e. the ones mentioned in this section), will be copied to the `request` map of the data source (and viceversa).

<br/>

### `offsetStart`: _int_
Offset of the first item (starts from 1) in the data source (list).

### `offsetEnd`: _int_
Offset of the last item in the data source (list).

### `count`: _int_
Total number of items in the data source.

### `offset`: _int_
Zero-based offset of the first item on the current page. This is pushed model→request (via `updateOffset`) but the binding is one-directional: changes to the request's `offset` (and `count`) are not copied back to the model.

### `pageSize`: _int_
Number of items to show per page (default is 25). Updating this triggers a `range` refresh only when the value actually changes (it is ignored if equal to `currentPageSize`, and the refresh is further skipped if the request's `count`/`offset` did not change).

### `currentPageSize`: _int_
The page size most recently applied to the data source. Internally tracked so that updates to `pageSize` only trigger a refresh when the value actually changes.

<br/>

# Methods

> The following methods can be accessed directly using `[data-action]` property in any child element.

### `prevPage` ()
Moves to the previous page.

### `nextPage` ()
Moves to the next page.

### `firstPage` ()
Moves to the first page.

### `lastPage` ()
Moves to the last page.

### `refresh` ()
Refreshes the data source.

### `clear` (`fieldNames`: _Array\<string\>_)
Clears (set to empty) the specified fields from the data source's request parameters.

### `setSource` (`source`: _DataSource_)
Replaces the bound data source. Detaches listeners from the previous source (and clears its `includeCount` flag), then attaches to the new source and enables `includeCount`. No-op if the same source is passed in, or if the argument is falsy or not a `DataSource` instance.

<br/>

## Example

```html
<r-paginator data-source="dataSource" data-page-size="50">
    <span data-watch="count">Showing [offsetStart] to [offsetEnd] out of [count]</span>

    <button data-action="firstPage">First</button>
    <button data-action="prevPage">&laquo;</button>
    <button data-action="nextPage">&raquo;</button>
    <button data-action="lastPage">Last</button>
    <button data-action="refresh">Refresh</button>

    <input type="text" data-property="pageSize" />
</r-paginator>
```

<small>NOTE: When using JSX, you can use the `dataSource` property directly with a `DataSource` object instead of passing a name via `data-source`.</small>
