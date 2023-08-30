# r-tabs

Tabs element with router support. Listens for click events on any child having `data-name` attribute to select a tab with that respective name. Also listens for changes in the current route, and when it changes the respective tab will be selected.

Tab selection is done by locating an immediate children of the `container` having `data-name` with the desired value.

|Attribute|Required|Description
|---------|--------|-----------
|`data-container`|Optional|Selector of the container holding the tabs content. If not specified it will be assumed that the next sibling is the container.
|`data-base-route`|Optional|Specifies the base-route to use when detecting route change events. Use the at symbol `@` in place of the name of the selected tab. For example, base-route `/settings/@/` will cause tab named `test` to be selected if route `/settings/test/` is detected.
|`data-initial`|Optional|Name of the initial tab to show. If not set, use the `selectTab` method to manually select a tab.

<br/>

# Events

### `tabShown` { `name`: _string_, `el`: _HTMLElement_ }
Dispatched when a tab is shown. Event arguments are the `name` of the newly focused tab, and tab content element `el`.

### `tabHidden` { `name`: _string_, `el`: _HTMLElement_ }
Dispatched when a tab is hidden. Event arguments are the `name` of the just unfocused tab, and its tab content element `el`.

### `tabChanged` { `name`: _string_, `el`: _HTMLElement_ }
Dispatched when a tab changes, `name` is the newly focused tab, and `el` is the `r-tabs` element.

<br/>

# Methods

### `showTab` (`name`: _string_)
Shows the tab with the specified name, ignores `data-base-route` and current route as well.

<br/>

### `selectTab` (`name`: _string_)
Shows a tab given its name. The route will be changed automatically if `data-base-route` is enabled.

<br/>

## CSS

```css
.is-hidden {
    display: none;
}

r-tabs [data-name].active {
    font-weight: bold;
}
```

## Minimum Example

```html
<r-tabs>
    <a data-name="tab1">Tab-1</a>
    <a data-name="tab2">Tab-2</a>
    <a data-name="tab3">Tab-3</a>
</r-tabs>

<div>
    <div data-name="tab1">
        This is tab-1.
    </div>

    <div data-name="tab2">
        This is tab-2.
    </div>

    <div data-name="tab3">
        This is tab-3.
    </div>
</div>
```

## Example with Routes and Container

```html
<r-tabs data-container="div.tab-container" data-base-route="@" data-initial="tab1">
    <a data-name="tab1">Tab-1</a>
    <a data-name="tab2">Tab-2</a>
    <a data-name="tab3">Tab-3</a>
</r-tabs>

<div class="tab-container">
    <div data-name="tab1">
        This is tab-1.
    </div>

    <div data-name="tab2">
        This is tab-2.
    </div>

    <div data-name="tab3">
        This is tab-3.
    </div>
</div>
```

## Nested Example

```html
<r-tabs data-container="div.tab-container" data-base-route="@" data-initial="tab1">
    <a data-name="tab1">Tab-1</a>
    <a data-name="tab2">Tab-2</a>
    <a data-name="tab3">Tab-3</a>
</r-tabs>

<div class="tab-container">
    <div data-name="tab1">
        This is tab-1.
    </div>

    <div data-name="tab2">

        <r-tabs data-base-route="tab2/@" data-initial="a">
            <a data-name="a">A</a>
            <a data-name="b">B</a>
            <a data-name="c">C</a>
        </r-tabs>

        <div>
            <div data-name="a">The letter is A.</div>
            <div data-name="b">The letter is B.</div>
            <div data-name="c">The letter is C.</div>
        </div>
    </div>

    <div data-name="tab3">
        This is tab-3.
    </div>
</div>
```
