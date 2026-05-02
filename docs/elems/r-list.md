# r-list

Connects to a `ModelList` and renders its contents using a template. Each item in the source list is fed to the template, the result is wrapped in a `<div>` (when `data-wrap` is enabled) and finally added to the target container.

|Attribute|Required|Description
|---------|--------|-----------
|`data-list`|Required|Path to a `ModelList` object, such as the one provided by `DataSource` properties `list` and `enum`.
|`data-container`|Optional|Selector of the container where items are placed. If none is provided `.x-data` will be used. If the selector matches no element, an empty `<div class="x-data">` is created and appended automatically.
|`data-wrap`|Optional|When set to `false`, the rendered template HTML is concatenated directly into the container instead of being wrapped in a `<div data-iid="...">`. Defaults to `true`. Disabling wrapping forces a full re-render on item changes (no per-item diffing).

<br/>

# Template

The first `<template>` child of the `r-list` is used to render each item.

```html
<template data-mode="static|dynamic">
    <!-- item markup -->
</template>
```

|Template attribute|Description
|------------------|-----------
|`data-mode`|`static` (default): the template is compiled once and re-evaluated per item with the item data. `dynamic`: the raw `innerHTML` is re-read on every render — use when the template itself contains other custom elements (e.g. `data-model=":list-item"`) that need to be re-instantiated. Item-level updates are skipped in dynamic mode (full re-renders only).

Any attribute on the `<template>` element (other than `data-mode` and Riza's internal `data-_*` markers) is copied onto each generated wrapper `<div>`. Use this to apply CSS classes, ARIA roles, etc to every item.

Within an item template, you can use `data-model=":list-item"` on a child element to bind that element's model to the current item — this is what makes nested `r-item`/`r-form`/etc work inside a row.

<br/>

# CSS Classes and Attributes

### `.x-empty`
Add to elements that should be shown only when **there are no items** in the data source (after at least one load).

### `.x-not-empty`
Add to elements that should be shown only when **there are items** in the data source.

### `.x-empty-null`
Add to elements that should be shown only **before the first load** (initial undefined state, distinct from "loaded but empty"). Useful for showing placeholders or instructions before any data has been fetched.

### `.is-loading`
Add to elements that should be shown only **while the underlying data source / data list is loading**. Hidden when the load completes.

<br/>

## CSS

```css
.is-hidden {
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

    <div class="x-empty-null">Loading…</div>
    <div class="x-empty">No matches found.</div>
    <div class="is-loading">Refreshing…</div>

    <div class="x-data">
    </div>

</r-list>
```

<br/>

# Methods

### `setList` (`list`: _ModelList_)
Replaces the bound list. Detaches event listeners from the previous list (and its `dataSource`/`dataList` if any) and attaches them to the new one. No-op if the same list is passed in.

### `refresh` ()
Forces a full re-render of all items currently in the list (equivalent to a fresh `itemsChanged` event).

<br/>

<small>NOTE: When using JSX, you can use the `dataList` property directly with a `ModelList` object instead of passing a name via `data-list`. Additionally the `content` property (function callback `content(itemData, itemModel) → HTMLElement`) of `r-list` can be used in place of a `<template>` to format each item — when present it takes precedence over the template, and the returned element is used directly (with `data-iid` set on it).</small>
