# r-table

Connects to a DataSource and renders its contents as a table. Supports filtering and sorting (directly on the remote data source). The content of the `r-table` should be a `<table>` element defining the header and body of the table.

|Attribute|Required|Description
|---------|--------|-----------
|`data-source`|Required|Path to a DataSource object. Its `list` property will be used as input.
|`data-container`|Optional|Selector of the container where rows will be placed (must be a `<tbody>`). If none is provided `.x-data` will be used.

<br/>

## CSS

```css
.x-hidden {
    display: none;
}

th[data-sort] {
    pointer: cursor; text-decoration: underline;
}

th[data-sort][data-order="asc"]:after {
    content: "ASC";
}

th[data-sort][data-order="desc"]:after {
    content: "DESC";
}
```

## Example

```html
<r-table data-source="dataSource">
    <table>
        <tr>
            <th data-sort="col1">Col 1</th>
            <th>Col 2</th>
        </tr>

        <tbody class="x-data">
            <tr>
                <td>[col1]</td>
                <td>[col2]</td>
            </tr>
        </tbody>
    </table>
</r-table>
```

#### `.x-empty`
Add to elements that should be shown only when **there are no items** in the data source.

#### `.x-not-empty`
Add to elements that should be shown only when **there are items** in the data source.

#### `[data-sort]`
Add to th/td elements in thead, marks the column as sortable. When clicked the `sort` request parameter of the data source will be set to the value of this attribute with `order` set to `asc` by default. When clicking the column for a second time (or more times) the `order` parameter will be toggled from `asc` to `desc` and viceversa.

Note that the attribute `data-order` will be added to the column and set to either `asc` or `desc` indicating the active ordering mode of the column.

<br/>

# Model

Filtering can be achieved by creating input elements that alter the model of the table (using `data-property` watchers). Any updated field will be copied to the `request` map of the data source (and viceversa).

<br/>

# Methods

> The following methods can be accessed directly using `[data-action]` property in any child element.

### void `refresh` ()
Refreshes the data source.

### void `clear` (array fieldNames)
Clears (set to empty) the specified fields from the data source's request parameters.
