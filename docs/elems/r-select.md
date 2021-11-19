# r-select

Select box populated from a `ModelList`. Any change to the contents of the `ModelList` will result in automatic update of the options of the select. Can be used as a regular input element.

Operation is to create an actual `<select>` with the same attributes as the `r-select` and then put it in place of the `r-select`, this latter will then be hidden from view (but remain in the parent element).


|Attribute|Required|Description
|---------|--------|-----------
|`data-list`|Required|Path to a `ModelList`<sup>1</sup> object, such as the one provided by `DataSource` properties<sup>2</sup> `list` and `enum`.
|`data-blank`|Optional|When specified, an empty value option will be added to the select as first option, with label set to the value of this attribute.

<br/>

> <sup>1</sup> The only restriction is that the items in the list must have the fields `id` or `value` to be used as value of the option, and `label` or `name` to be used as text of the option.

> <sup>2</sup> When a `ModelList` linked to a `DataSource` is provided, the `includeEnum` property of the data source will be automatically set to true.

<br/>

## Example

```html
<r-select data-list="dataList" data-blank="Select ..."></r-select>
```

```js
import { ModelList } from 'riza';

window.dataList = new ModelList();

dataList.push({ id: 1, label: 'Red' });
dataList.push({ id: 2, label: 'Green' });
dataList.push({ id: 3, label: 'Blue' });
```
