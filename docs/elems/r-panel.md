# r-panel

Content panel with router support. Useful to easily show/hide content based on the current route. Flexible CSS classes control the state to allow animations when desired. To manually set some `r-panel` as visible by default simply set its CSS class to `active`.

|Attribute|Required|Description
|---------|--------|-----------
|`data-route`|Optional|Route required to activate the panel. When the route is activated the panel will be shown and when route is deactivated the panel will be hidden. If no route is provided, the panel will be visible at all times.

<br/>

# Events

### `panelHidden`
Dispatched when the panel is hidden because of a change in the current route.

<br/>

### `panelShown` { `...args` }
Dispatched when the current route matches the panel's route, and thus the panel is shown. The event arguments contain the route arguments. For example, for the following:

```html
<r-panel data-route="users/edit/:id">
    Test
</r-panel>
```

The `id` part is a route parameter, and thus its value (argument) will be passed to the `panelShown` event when it is triggered.

<br/>

# Methods

### `show` (`silent`: _bool_ = false)
Sets the `active` class of the panel element, thus making it visible (if the CSS is properly configured). If `silent` is true and `data-route` enabled, the current route will **not** be updated. Fires the `panelShown` event.

<br/>

### `hide` ()
Hides the panel by removing the `active` class from the element. Fires `panelHidden` event.

<br/>

## CSS

```css
r-panel {
    display: block;
}

r-panel:not(.active) {
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
