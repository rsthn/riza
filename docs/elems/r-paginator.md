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

### `pageSize`: _int_
Number of items to show per page (default is 25).

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
