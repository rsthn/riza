# r-form

Provides functionality to send forms using [Api](../api.md). Per-field error messages and per-form messages (success or error) are automatically handled.

- Note that only input element, textareas, selects or custom inputs having attribute `[data-field]` will be considered an actual field of the form.
- Default values of `[data-field]` elements are specified by setting their `[data-default]` attribute.

<br/>

|Attribute|Required|Description
|---------|--------|-----------
|`data-form-action`|Required|Name of the target API function to which the form data will be sent, this value is the `f` request<br/>parameter. If none provided the form will not be sent.<br/>When manual submit is desired, or if form data needs to be processed manually, this attribute can be<br/>ignored, but the property `formAction` of this element must be set to a function receiving parameters<br/>`object data` and `void callback (object res)`.<br/>If the value contains a `/` it is treated as a modern endpoint path and the data is sent as JSON.
|`data-method`|Optional|HTTP method used to submit the form (e.g. `POST`, `GET`, `PUT`). Defaults to `POST`.
|`data-strict`|Optional|When set to `false`, any field found in the form's model will be sent to the API function.<br/>Otherwise, only fields having their respective `[data-field]` element are sent.<br/>Defaults to `true`.
|`data-errors-at`|Optional|Indicates where to add the `span.field-error` elements when a field has an error.<br/>Possible values are `top` (added to the top of the container), `bottom` (added to the<br/> bottom of the container) or `default` (added right after the `[data-field]` element).

<br/>

## CSS

```css
.is-hidden {
    display: none;
}

r-form span.field-error {
    display: block;
    color: red;
}

r-form .message.success {
    color: #080;
}

r-form .message.error {
    color: #c00;
}
```

## Example

```html
<r-form data-form-action="users.login">

    <input type="text" data-field="username" />
    <input type="password" data-field="password" />

    <div class="message error"></div>
    <div class="message success"></div>

    <br/>

    <input type="submit" value="Login" />

</r-form>
```

<br/>

# Events

### `beforeSubmit` { `data`: _object_ }
Fired right before the form data is sent. The `data` argument contains the payload that will be submitted (after `[data-field]` collection and any `constraints` filtering, and before `preprocess` runs). Useful to inspect or augment the request.

### `formSuccess` { `res`: _object_ }
Fired when the API function returns response code `200`. The `res` parameter has the API's response object.

### `formError` { `res`: _object_ }
Fired when the API returns response code `407`, `409` or any other than `200`. The `res` parameter has the API's response object.

<br/>

# Methods

### `clearMarkers` ()
Clears the markers of the form to return it to its initial visual state. It will:

- Remove the `.busy` class from the form.
- Add class `.is-hidden` to all `.message` elements.
- Remove all `span.field-error` elements.
- Remove class `.field-error` and `.is-invalid` from all elements.
- Remove class `.field-passed` from all elements.

<br/>

### `reset` (`nsilent`: _bool_ = undefined)
Resets the form fields to their default values. When no default values are specified, empty strings will be used, or string `'0'` for checkbox elements (string `'1'` when checked). When `nsilent` is `false`, every field DOM element is also re-synced from the model after the reset.

<br/>

### `submit` ()
Submits the form to the target API function using the configured HTTP method (`data-method`, default `POST`).

<br/>

### `getField` (`name`: _string_)
Returns the current value of the field with the given `[data-field]` name, normalized by field type (checkboxes return `'0'`/`'1'`, multi-selects return a comma-joined string, custom `field`-typed inputs use `getValue()`, etc).

<br/>

# Notes

- When the form submission is in progress, the form element will get CSS class `.busy`, and this class will be removed when the call is completed. This feature can be used to create loading spinners.

- When the API returns non-200 response code and an `error` field, it will be placed in the `.message.error` element.

- When the API returns 200 response code, and a `message` field, it will be placed in the `.message.success` element.

- If a `preprocess(data)` function is defined on the element, it will be `await`ed after `beforeSubmit` and before the request is sent — useful for asynchronous transforms such as uploading attachments.

- If a `constraints` object is defined on the element, the collected data will be filtered through `new Model(data, null, constraints).get()` before submit.
