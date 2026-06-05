# r-panel

Content panel with router support. Useful to easily show/hide content based on the current route. Flexible CSS classes control the state to allow animations when desired. To manually set some `r-panel` as visible by default simply set its CSS class to `is-active`.

|Attribute|Required|Description
|---------|--------|-----------
|`data-route`|Optional|Route required to activate the panel. When the route is activated the panel will be shown and when route is deactivated the panel will be hidden. If no route is provided, the panel will be visible at all times.

<br/>

# CSS Classes

The panel toggles a small set of classes that you can hook into for styling and animation:

|Class|Meaning
|-----|-------
|`is-active`|The panel is currently shown.
|`is-inactive`|The panel is currently hidden.
|`anim-out`|Added during the hide transition. Useful as an "exit" animation hook.
|`anim-ended`|Added once the most recent animation finishes (or immediately when no animation is in flight). Useful to apply terminal styles only after the transition settles.

<br/>

# Events

### `panelHidden` { `...args` }
Dispatched whenever the panel is hidden (any `hide()` call, including the initial hide and via `toggleVisibility`). The event arguments contain the route arguments (same shape as `panelShown`), or an empty object if the panel has no `data-route`.

<br/>

### `panelShown` { `...args` }
Dispatched whenever the panel is shown (any `show()` call, including panels with no `data-route` and via `toggleVisibility`). The event arguments contain the route arguments. For example, for the following:

```html
<r-panel data-route="users/edit/:id">
    Test
</r-panel>
```

The `id` part is a route parameter, and thus its value (argument) will be passed to the `panelShown` event when it is triggered.

<br/>

# Methods

### `show` (`silent`: _bool_ = false)
Adds the `is-active` class to the panel element (and removes `is-inactive`), making it visible (if the CSS is properly configured). If `silent` is true and `data-route` enabled, the current route will **not** be updated. Fires the `panelShown` event.

<br/>

### `hide` ()
Hides the panel by removing the `is-active` class and adding `is-inactive` and `anim-out` to the element. Fires the `panelHidden` event.

<br/>

### `toggleVisibility` (`silent`: _bool_ = false)
Toggles between `show` and `hide` based on the current state. The `silent` argument is forwarded to `show` only.

<br/>

## CSS

```css
r-panel {
    display: block;
}

r-panel:not(.is-active) {
    display: none;
}
```

## Example

```html
<r-panel data-route="account/panel1">
    This is panel 1.
</r-panel>

<r-panel data-route="account/panel2">
    This is panel 2.
</r-panel>

<hr/>

<a href="#account/panel1">Show Panel 1</a>
<a href="#account/panel2">Show Panel 2</a>
```

## Nested Example

```html
<r-panel data-route="account/panel1">
    This is panel 1.
</r-panel>

<r-panel data-route="account/panel2">
    This is panel 2.

    <r-panel data-route="account/panel2/a">
        Hello World
    </r-panel>

    <r-panel data-route="account/panel2/b">
        Good night
    </r-panel>

    <br/>

    <a href="#account/panel2/a">Show A</a>
    <a href="#account/panel2/b">Show B</a>
</r-panel>

<hr/>

<a href="#account/panel1">Show Panel 1</a>
<a href="#account/panel2">Show Panel 2</a>
```
