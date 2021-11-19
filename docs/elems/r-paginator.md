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

### int `offsetStart`
Offset of the first item (starts from 1) in the data source (list).

### int `offsetEnd`
Offset of the last item in the data source (list).

### int `count`
Total number of items in the data source.

### int `pageSize`
Number of items to show per page (default is 25).

<br/>

# Methods

> The following methods can be accessed directly using `[data-action]` property in any child element.

### void `prevPage` ()
Moves to the previous page.

### void `nextPage` ()
Moves to the next page.

### void `firstPage` ()
Moves to the first page.

### void `lastPage` ()
Moves to the last page.

### void `refresh` ()
Refreshes the data source.

### void `clear` (array fieldNames)
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
