# r-form

Provides functionality to send forms using [Api](../api.md). Per-field error messages and per-form messages (success or error) are automatically handled.

- Note that only input element, textareas, selects or custom inputs having attribute `[data-field]` will be considered an actual field of the form.
- Default values of `[data-field]` elements are specified by setting their `[data-default]` attribute.

<br/>

|Attribute|Required|Description
|---------|--------|-----------
|`data-form-action`|Required|Name of the target API function to which the form data will be sent.<br/>Accepts both the dot-style function name (sent as the `f` request parameter, e.g.<br/>`data-form-action="auth.login"`) and a path-style URL fragment appended to the API<br/>base URL (e.g. `data-form-action="auth/login"`, which posts to `<apiUrl>/auth/login`).<br/>If none provided the form will not be sent.<br/>When manual submit is desired, or if form data needs to be processed manually, this attribute can be<br/>ignored, but the property `formAction` of this element must be set to a function receiving parameters<br/>`object data` and `void callback (object res)`.
|`data-strict`|Optional|When set to `false`, any field found in the form's model will be sent to the API function.<br/>Otherwise, only fields having their respective `[data-field]` element are sent.<br/>Defaults to `true`.
|`data-errors-at`|Optional|Indicates where to add the `span.field-error` elements when a field has an error.<br/>Possible values are `top` (added to the top of the container), `bottom` (added to the<br/> bottom of the container) or `default` (added right after the `[data-field]` element).
|`data-method`|Optional|HTTP method used for the API call.<br/>Defaults to `POST`.

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
    <span class="loading-indicator">Loading ...</span>

</r-form>
```

<br/>

# Events

### `beforeSubmit` { `data`: _object_ }
Fired right before the form data is sent. The `data` parameter has the collected field values, and can be inspected before the request goes out.

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
- And, remove class `.field-passed` from all elements.

<br/>

### `getField` ( `name` )
Returns the current value of the field identified by `name` (its `[data-field]` value).

<br/>

### `reset` ( [`nsilent`] )
Reset's the form fields to their default values, when no default values are specified, empty strings will be used, or an integer zero (0) in checkbox elements.

When `nsilent` is `false`, the underlying field elements are also explicitly re-populated with the reset model values.

<br/>

### `submit` ()
Submits the form to the target API function.

<br/>

# Properties & Hooks

These are optional properties/callbacks that can be set on the element to customize its behavior.

### `formAction`
Function alternative to the `data-form-action` attribute. When set, it is invoked on submit with `(object data, void callback (object res))` instead of performing an API call.

### `constraints`
When set, the collected form data is passed through a `Model` (from `rinn`) using these constraints before submission, allowing field values to be validated/filtered/transformed.

### `preprocess` ( `data` )
Optional `async` hook invoked after `beforeSubmit` and before the request is sent. Receives the collected `data` object and may mutate it (or perform asynchronous work).

### `onfieldchanged` ( `field`, `value`, `form` )
Optional callback invoked whenever a field is set programmatically. Its return value is used as the value written to the field element.

<br/>

# Notes

- When the form submission is in progress, the form element will get CSS class `.busy`, and this class will be removed when the call is completed. This feature can be used to create loading spinners (e.g. the `.loading-indicator` element in the example above is driven purely by CSS off the form's `.busy` class — the component does not toggle it directly).

- When the API returns non-200 response code and an `error` field, it will be placed in the `.message.error` element.

- When the API returns 200 response code, and a `message` field, it will be placed in the `.message.success` element.
