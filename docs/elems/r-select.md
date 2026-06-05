# r-select

Select box populated from a `ModelList`. Any change to the contents of the `ModelList` will result in automatic update of the options of the select. Can be used as a regular input element.

Operation is to create an actual `<select>` with the same attributes as the `r-select` and then put it in place of the `r-select`, this latter will then be hidden from view (but remain in the parent element).


|Attribute|Required|Description
|---------|--------|-----------
|`data-list`|Optional<sup>3</sup>|Path to a `ModelList`<sup>1</sup> object, such as the one provided by `DataSource` properties<sup>2</sup> `list` and `enum`.
|`data-value`|Optional|Sets the value of the initially-selected option. It is copied onto the underlying `<select>` and consumed on each render.
|`data-blank`|Optional|When specified, an empty value option will be added to the select as first option, with label set to the value of this attribute.
|`data-option-value`|Optional|Name of the field to use as the `value` of each `<option>`. Overrides the default auto-detection (`value` then `id`).
|`data-option-label`|Optional|Name of the field to use as the visible text of each `<option>`. Overrides the default auto-detection (`label` then `name`).
|`disabled`|Optional|Forwarded to the underlying `<select>` to disable it.

<br/>

All attributes other than `data-list`, `data-blank`, `data-option-value`, `data-option-label`, and `data-_*` (internal) are forwarded to the underlying `<select>`. For example, `disabled` is propagated as-is.

<br/>

> <sup>1</sup> The default behavior is: items in the list must have the field `id` or `value` to be used as value of the option, and `label` or `name` to be used as text of the option. Use `data-option-value` / `data-option-label` to point at different field names.

> <sup>2</sup> When a `ModelList` linked to a `DataSource` is provided, the `includeEnum` property of the data source will be automatically set to true.

> <sup>3</sup> Exactly one of the `dataList` property or the `data-list` attribute is needed to bind a list. If neither is present the element simply no-ops without error. An error is only logged when `data-list` was given but its path did not resolve.

<br/>

# Option Groups

If items in the list have a `group` field, options will be grouped automatically into `<optgroup>` blocks, one per distinct `group` value. The `label` of each `<optgroup>` is the group value itself. Items without a `group` field render as a flat list of `<option>` elements.

<br/>

# Properties

### `dataList` (_ModelList_)
The primary programmatic binding for the list. Set it from JS or JSX with a `ModelList` object. It is checked first, before falling back to the `data-list` attribute path.

<br/>

# Methods

### `setList` (`list`: _ModelList_)
Replaces the bound list. Detaches event listeners from the previous list and attaches them to the new one. No-op if the same list is passed in.

### `refresh` ()
Forces a full re-render of the underlying `<select>` from the current list contents.

<br/>

## Example

```js
import { ModelList } from 'riza';

window.dataList = new ModelList();

dataList.push({ id: 1, label: 'Red' });
dataList.push({ id: 2, label: 'Green' });
dataList.push({ id: 3, label: 'Blue' });
```

```html
<r-select data-list="dataList" data-blank="Select ..."></r-select>
```

## Example with custom field names and groups

```js
window.foods = new ModelList();
foods.push({ code: 'A1', title: 'Apple',  group: 'Fruit' });
foods.push({ code: 'A2', title: 'Banana', group: 'Fruit' });
foods.push({ code: 'B1', title: 'Carrot', group: 'Vegetable' });
```

```html
<r-select
    data-list="foods"
    data-option-value="code"
    data-option-label="title"
    data-blank="Pick one ...">
</r-select>
```

<small>NOTE: When using JSX, you can set the `dataList` property directly with a `ModelList` object instead of passing a name via `data-list`.</small>
