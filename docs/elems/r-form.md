# r-form

Provides functionality to send forms using [Api](../api.md). Per-field error messages and per-form messages (success or error) are automatically handled.

- Note that only input element, textareas, selects or custom inputs having attribute `[data-field]` will be considered an actual field of the form.
- Default values of `[data-field]` elements are specified by setting their `[data-default]` attribute.

<br/>

|Attribute|Required|Description
|---------|--------|-----------
|`data-form-action`|Required|Name of the target API function to which the form data will be sent, this value is the `f` request<br/>parameter. If none provided the form will not be sent.<br/>When manual submit is desired, or if form data needs to be processed manually, this attribute can be<br/>ignored, but the property `formAction` of this element must be set to a function receiving parameters<br/>`object data` and `void callback (object res)`.
|`data-strict`|Optional|When set to `false`, any field found in the form's model will be sent to the API function.<br/>Otherwise, only fields having their respective `[data-field]` element are sent.<br/>Defaults to `true`.
|`data-errors-at`|Optional|Indicates where to add the `span.field-error` elements when a field has an error.<br/>Possible values are `top` (added to the top of the container), `bottom` (added to the<br/> bottom of the container) or `default` (added right after the `[data-field]` element).

<br/>

## CSS

```css
.x-hidden {
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
	<span class="loading-indicator">Loading ...</span>

</r-form>
```

<br/>

# Events

### `formSuccess` { `res`: _object_ } 
Fired when the API function returns response code `200`. The `res` parameter has the API's response object.

### `formError` { `res`: _object_ }
Fired when the API returns response code `407`, `409` or any other than `200`. The `res` parameter has the API's response object.

<br/>

# Methods

### `clearMarkers` ()
Clears the markers of the form to return it to its initial visual state. It will:

- Remove the `.busy` class from the form.
- Add class `.x-hidden` to all `.message` and `.loading-indicator` elements.
- Remove all `span.field-error` elements.
- And, remove class `.field-error` and `.is-invalid` from all elements.

<br/>

### `reset` ()
Reset's the form fields to their default values, when no default values are specified, empty strings will be used, or an integer zero (0) in checkbox elements.

<br/>

### `submit` ()
Submits the form to the target API function.

<br/>

# Notes

- When the form submission is in progress, the form element will get CSS class `.busy`, and this class will be removed when the call is completed. This feature can be used to create loading spinners.

- The `.loading-indicator` element (when present) is hidden by default (with `.x-hidden`) and shown when the form is being submitted.

- When the API returns non-200 response code and an `error` field, it will be placed in the `.message.error` element.

- When the API returns 200 response code, and a `message` field, it will be placed in the `.message.success` element.
