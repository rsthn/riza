# r-panel

Content panel with router support. Useful to easily show/hide content based on the current route. Flexible CSS classes control the state to allow animations when desired. To manually set some `r-panel` as visible by default simply set its CSS class to `active`.

|Attribute|Required|Description
|---------|--------|-----------
|`data-route`|Optional|Route required to activate the panel. When the route is activated the panel will be shown and when route is deactivated the panel will be hidden. If no route is provided, the panel will be visible at all times.

<br/>

# Events

### `panelShown`
### `panelHidden`

<br/>

# Methods

### void `show` (bool silent=false)
Shows the panel visible by adding `active` class to the element. If `silent` is true and `data-route` enabled, the current route will not be updated. Fires `panelShown` event.

<br/>

### void `hide` ()
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
