# r-list

Connects to a `ModelList` and renders its contents using a template. Each item in the source list will be fed to the template, the result is wrapped in a `<div>` and finally added to the target container.

|Attribute|Required|Description
|---------|--------|-----------
|`data-list`|Required|Path to a `ModelList` object, such as the one provided by `DataSource` properties `list` and `enum`.
|`data-container`|Optional|Selector of the container where items are placed. If none is provided `.x-data` will be used.

<br/>

# CSS Classes and Attributes

### `.x-empty`
Add to elements that should be shown only when **there are no items** in the data source.

### `.x-not-empty`
Add to elements that should be shown only when **there are items** in the data source.

<br/>

## CSS

```css
.x-hidden {
    display: none;
}
```

<br/>

## Example

```html
<r-list data-list="dataList">

    <template>
        <b>[first_name] [last_name]</b>
    </template>

    <div class="x-data">
    </div>

</r-list>
```

<small>NOTE: When using JSX, you can use the `dataList` property directly with a `DataList` object instead of passing a name via `data-list`. Additionally the `content` property (function callback) of `r-list` can also be used to format each item in the list.</small>
