# r-item

Generic item with support to be connected to any model by using its `data-model` attribute, useful to take advantage of data watchers.

|Attribute|Required|Description
|---------|--------|-----------
|`data-model`|Optional|Path to a `Model` object to be used with the element. If none provided, the internal model will be used.

<br/>

## Properties

|Property|Description
|--------|-----------
|`dataModel`|`Model` object to be used with the element. When set directly on the element (e.g. by a parent such as an `r-list` row), it takes precedence over the `data-model` attribute. If neither resolves, an empty internal model is used.

<br/>

## Example

```html
<r-item data-model="m">
    <span data-watch="name">
        Good morning <b>[upper [name]]!</b>
    </span>
</r-item>
```

```js
import { Model } from 'riza';

window.m = new Model();

m.set('name', 'John Doe');
```
