# JSX

`babel-plugin-riza` compiles JSX into real DOM nodes — there is no virtual DOM and no diffing. An
element expression evaluates to an `HTMLElement` you can append, query and keep a reference to:

```jsx
const button = <button class="primary">Save</button>;
document.body.appendChild(button);
button.disabled = true;
```

<br/>

# Attributes are properties

This is the rule everything else follows from: attributes in a tag are **assigned as properties**,
not through `setAttribute`.

```jsx
<input id="email" type="email" autocomplete="email" />
```

compiles to `elem.id = 'email'`, `elem.type = 'email'`, `elem.autocomplete = 'email'`. That is
correct for `id`, `type`, `href`, `src`, `value`, `target`, `rel`, `role` and every other
*reflected* property, because writing the property updates the attribute.

It is **wrong for anything that does not reflect**. `<div aria-live="polite">` assigns a plain
`'aria-live'` JS property, which no stylesheet, selector or screen reader will ever see. The
attribute is simply never set.

Two names are handled for you:

- **`class`** and **`classList`** are renamed to `className`.
- **`data-*`** is rewritten to a `dataset` write — `data-field="name"` becomes
  `elem.dataset.field = 'name'`, which does set the real attribute. `data-form-action` becomes
  `dataset.formAction`, following the usual dash-to-camel rule.

Everything else you write yourself, using the property name rather than the attribute name:

| Attribute you want | Write in JSX | Notes |
|---|---|---|
| `for="email"` | `htmlFor="email"` | `for` is a reserved word; `htmlFor` is its property |
| `aria-label="Close"` | `ariaLabel="Close"` | ARIA reflects to camelCase properties |
| `aria-live`, `aria-pressed`, `aria-expanded`, `aria-current`, `aria-hidden` | `ariaLive`, `ariaPressed`, `ariaExpanded`, `ariaCurrent`, `ariaHidden` | same rule |
| `role="status"` | `role="status"` | already a reflected property |
| `data-anything` | `data-anything` | rewritten to `dataset` for you |

ARIA properties accept `null` to remove the attribute, which is handy when setting them later:

```js
link.ariaCurrent = isActive ? 'page' : null;
```

### What cannot be set from JSX

The ARIA attributes that hold **id references** have no string property counterpart —
`aria-controls`, and by the same token `aria-labelledby`, `aria-describedby`, `aria-owns`,
`aria-flowto` and `aria-activedescendant`. Their reflected properties (`ariaControlsElements` and
friends) take *element references*, not ids, so there is nothing for JSX to assign.

Set them imperatively after the node exists:

```jsx
const nav = <nav id="site-nav">…</nav>;
const burger = <button ariaExpanded="false">…</button>;

burger.setAttribute('aria-controls', 'site-nav');
```

<br/>

# Paths with `:`

An attribute name containing a colon is treated as a **path into the element** rather than a flat
property, so `style:color` assigns `elem.style.color`. That is the same mechanism `data-*` is
rewritten onto (`dataset:field`), and it works for any nested property:

```jsx
<div style:color="red" style:fontWeight="600">…</div>
```

<br/>

# Classes and styles as objects

`style` and `class` also accept objects, and their values may be signals — each key is watched
independently:

```jsx
<div style={{ color: theme, width: '100%' }}>…</div>

<div class={{ active: isOpen, disabled: isBusy }}>…</div>

<div class={ ['card', variant] }>…</div>
```

A single class can be toggled with the `class:` path form, which reads better than an object when
there is only one:

```jsx
<div class:hidden={ isHidden }>…</div>
```

<br/>

# Two-way binding with `trait:`

`trait:` binds a signal to a form control in **both** directions: the control is updated when the
signal changes, and the signal is updated when the user edits the control.

```jsx
const name = signal('');

<input trait:value={ name } />
```

| Trait | Element event it listens to | Writes to the signal |
|---|---|---|
| `trait:value` | `change` | `elem.value` |
| `trait:input` | `input` | `elem.value` |
| `trait:checked` | `change` | `elem.checked` |
| `trait:selected` | `change` | `elem.selected` |

`trait:value` and `trait:input` differ only in *when* the signal is updated — on commit
(blur/enter) versus on every keystroke. Each listens to its own event only: an `input` event does
not feed a `trait:value` binding, and a `change` event does not feed a `trait:input` one.

Two details worth knowing:

- The control is populated from the signal **as the binding is created**, so a signal with a value
  shows up in the field immediately; you do not need to seed the element separately.
- Later writes to the signal reach the DOM **asynchronously**. Reading `elem.value` back in the
  same tick as `signal.set(…)` gives you the old value — wait a tick if you need to observe it.

These traits install `onchange` / `oninput` on the element, so setting those handlers yourself on a
bound control replaces the binding.

<br/>

# Event handlers

Handler attributes are lowercased, so `onClick` and `onclick` are the same thing, and both assign
the DOM property:

```jsx
<button onclick={ () => this.save() }>Save</button>
```

The same applies to custom events dispatched by components. `dispatch()` looks for an
`on<eventname>` property first, so a `formSuccess` event is delivered to an `onFormSuccess` prop:

```jsx
<r-form onFormSuccess={ (result, form) => this.clear(form) }>…</r-form>
```

Note that this **replaces** the event rather than adding to it — see
[`dispatch`](element.md#dispatch-eventname-string-args-objectnull-bubbles-booleantrue--void).
