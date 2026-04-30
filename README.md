<p align="center">
	<img src="https://img.shields.io/npm/v/riza?label=version&color=%2300a020&style=flat-square"/>
	<img src="https://img.shields.io/npm/dt/riza?color=%23a000a0&style=flat-square"/>
	<img src="https://img.shields.io/bundlephobia/min/riza/latest?color=%2300a0b0&style=flat-square"/>
</p>

<br/>

<img src="./docs/logo-512.png" style="width: 300px;" />

<br/>

Riza is a UI library that provides functionality to build custom elements, supports connecting directly to [Wind](https://github.com/rsthn/rose-core/blob/master/Wind.md) compliant APIs and several pre-made elements to develop web applications fast.

## Installation

You can use your favorite package manager to install the library, or use the standalone files from the `dist` folder and include the respective flavor (ESM or global) in your `index.html` file.

### Without a bundler

If you don't want to set up a build pipeline, you can import the pre-built ESM module directly from the `dist` folder using a regular `<script type="module">` tag:

```html
<script type="module" src="dist/riza.js"></script>
```

This exposes the full `riza` API on `globalThis.riza`, so `Element`, `Router`, `Api`, `signal`, etc. are immediately available in any other inline or module script on the page &mdash; no bundler, no package manager.

<small>**NOTE:** All definitions exported by [Rinn](https://github.com/rsthn/rinn/) will be available as direct exports right from the `riza` package.</small>

### Getting Started

You can either import riza directly in your ESM project by installing the package, or you can create a new project using the default minimalistic template using:

```bash
pnpm dlx riza new <my-project>
```

This scaffolds a JSX-based project &mdash; the **modern** way to use Riza, covered in [Modern Approach (JSX)](#modern-approach-jsx). If you prefer the **classic** approach (plain JS, optionally without a bundler), pass the `classic` template:

```bash
pnpm dlx riza new classic <my-project>
```

The source files can be easily modified and are located in the `src` folder. The app component is in the `app.jsx` file (or `app.js` for the classic template). Edit it if you like, and run the development server to view the results:

```bash
pnpm dev
```

Now you will see on screen what port was used to spin up the server, it is usually port `1234` so you can direct your browser to [http://localhost:1234/](http://localhost:1234/) and see the app results.

Note that this dev mode enables HMR with [Parcel](https://github.com/parcel-bundler/parcel) so feel free to edit the source files and see the results on screen. When you're done use `CTRL+C` to break and exit the server.

<br/>

## Documentation

### Table of Contents

- **[The Element Class](#the-element-class)** &mdash; build custom HTML5 elements with lifecycle hooks, events, models, and scoped styles.
    - [Registering a Custom Element](#registering-a-custom-element)
    - [Lifecycle](#lifecycle)
    - [Events](#events)
    - [Built-in Action Handlers](#built-in-action-handlers)
    - [References (`data-ref`, `data-xref`, `data-root`)](#references)
    - [Rinn Expressions](#rinn-expressions)
    - [Models and Data Binding](#models-and-data-binding)
    - [Scoped Styles](#scoped-styles)
    - [Routes](#routes)
    - [Composition and Inheritance](#composition-and-inheritance)
    - [Extending and Hooking Existing Elements](#extending-and-hooking-existing-elements)
    - [Utility Methods](#utility-methods)
- **[Reactivity with Signals](#reactivity-with-signals)** &mdash; reactive values that can drive model fields and the HTML bound to them.
- **[Modern Approach (JSX)](#modern-approach-jsx)** &mdash; build elements and templates with JSX through `babel-plugin-riza`.

Additional reference material for the bundled modules and pre-made elements can be found in the [docs](./docs/README.md) folder.

<br/>

### The Element Class

The heart of Riza is the `Element` class. It is the base used to define every custom HTML5 element in your app, and provides lifecycle hooks, declarative event/route binding, model-driven data binding, scoped styles, references, and a small toolbox of utilities to keep your component code short and readable.

<br/>

### Registering a Custom Element

Custom elements are created by calling `Element.register(name, ...prototypes)`. The first argument is the tag name (it must contain a hyphen, per the HTML5 spec); the remaining arguments are prototype objects that will be merged into the final element class. The default `Element` prototype is always applied.

```js
import { Element } from 'riza';

Element.register('my-greeting', {
    init: function() {
        this.setInnerHTML('<h1>Hello, world!</h1>');
    }
});
```

```html
<my-greeting></my-greeting>
```

You can pass several prototypes (objects, or *names* of previously registered elements as strings) to compose behavior:

```js
Element.register('my-card', SomeMixin, 'r-panel', {
    init: function() {
        this.classList.add('card');
    }
});
```

When a prototype is referenced by name, its functions become available through `this._super[name]` so you can explicitly call into them.

<br/>

### Lifecycle

`Element` calls a sequence of methods as the element moves from construction to fully connected. Override only the ones you need.

| Method | When it runs |
|---|---|
| `onCreated()` | Right after the constructor; the element exists but is *not yet* in the DOM. |
| `init()` | Once the element is being initialized (first connect). Its own children are not guaranteed to be ready yet. |
| `ready()` | When all custom-element children of this element have finished initializing. Safe place to query/manipulate child elements. |
| `rready()` | After `ready` AND after the element's root (the closest ancestor with `isRoot: true`) is also ready. |
| `onConnected()` | The element was attached to the DOM tree (also re-fires on re-attachment). |
| `onDisconnected()` | The element was removed from the DOM tree. |

```js
Element.register('my-widget', {
    onCreated: function() {
        // Element exists, not yet attached. Do not touch children.
    },

    init: function() {
        this.setInnerHTML('<button class="go">Go</button><span class="out"></span>');
    },

    ready: function() {
        // Children are present in the DOM and ready.
        this.out = this.querySelector('.out');
    },

    rready: function() {
        // Self ready AND root ready.
    },

    onConnected: function() {
        console.log('attached to', this.parentElement.tagName);
    },

    onDisconnected: function() {
        console.log('detached');
    }
});
```

If you need to run code only once the element is fully ready, you can also use `whenReady(callback)` from outside the element.

<br/>

### Events

Events are declared in two equivalent ways. Both forms support the same selector syntax.

**As an `events` map:**

```js
Element.register('my-counter', {
    n: 0,

    init: function() {
        this.setInnerHTML('<button class="inc">+</button><span class="value">0</span>');
    },

    events: {
        'click .inc': function() {
            this.n++;
            this.querySelector('.value').textContent = this.n;
        }
    }
});
```

**As `event ...`-prefixed methods** (automatically moved to the events map at registration):

```js
Element.register('my-counter', {
    'event click .inc': function() {
        // ...
    }
});
```

#### Selector syntax

| Form | Meaning |
|---|---|
| `click .button` | Delegated DOM event on any descendant matching the selector. |
| `click &this` | DOM event on this element itself. |
| `click &name` | Delegated event on the descendant with `data-ref="name"`. |
| `click @name` | Listens to a property of `this` (an `EventDispatcher`). `@this` targets the element itself. |
| `#fieldName` | Fires on `propertyChanged.fieldName` of the element's model. |
| `keyup(13) input` | Filters by key-code argument. Same syntax works with `keydown`. |
| `myevt` | Bare event name, fires on this element (no delegation). |

Inside any handler the receiver is the element instance (`this`). The event object is augmented with:

- `evt.source` &mdash; the matched element (the one the selector targeted).
- `evt.params` / `evt.detail` &mdash; payload from `dispatch`.
- `evt.continuePropagation = true` &mdash; opt back into bubbling/further matches; otherwise propagation is stopped.

> **Default behavior — preventDefault + stopPropagation.** After a Riza event handler runs, the framework automatically calls `evt.preventDefault()` and `evt.stopPropagation()` for you. **Do not call them yourself** &mdash; it's redundant noise. If you actually want the event to keep propagating (let other handlers see it, let the browser do its default thing, let it bubble out of the modal/widget you're listening on), set `evt.continuePropagation = true` before returning &mdash; or `return true` from the handler, which is equivalent. This is the only knob you need; treat `preventDefault`/`stopPropagation` calls in handler code as a code smell.

Dispatching events:

```js
this.dispatch('thingHappened', { id: 42 });   // bubbles up
this.trigger('thingHappened', { id: 42 });    // local-only, calls onThinghappened if defined
this.dispatchOn(otherElem, 'ping');           // dispatch on a different element
```

If the element defines a method named `on<eventName>` (lowercased, dashes removed), `dispatch`/`trigger` will call it directly &mdash; this is what powers JSX bindings like `onPanelShown={ ... }`.

<br/>

### Built-in Action Handlers

Any descendant with `data-action="<name> <args...>"` will, on click, invoke the method `name` on the *root* custom element. `data-long-press` and `data-enter` (Enter key on inputs) work the same way.

```html
<my-card>
    <button data-action="save">Save</button>
    <button data-action="remove 42">Delete</button>
</my-card>
```

```js
Element.register('my-card', {
    save: function(args, evt) {
        console.log('saving');
    },
    remove: function(args, evt) {
        console.log('removing id', args[1]);   // "42"
    }
});
```

A few utility actions are built in &mdash; their names start with `:` so they can't collide with user methods:

| Action | Effect |
|---|---|
| `:toggleClass <class> [<selector>]` | Toggle a CSS class on the source (or on `selector`). |
| `:setClass <class> [<selector>]` | Add a CSS class. |
| `:volatileClass <class> [<selector>]` | Add a class; remove it on the next click anywhere. |
| `:toggleClassUnique <class> <parentSel> <childSel>` | Toggle, ensuring at most one matched child has the class. |
| `:setClassUnique <class> <parentSel> <childSel>` | Set, ensuring only this element among siblings has the class. |

```html
<button data-action=":toggleClass active">Toggle</button>
```

`data-long-press` additionally fires a `long-press` (after ~500ms hold) and `short-press` (on quick release) event so you can offer two interactions on the same element.

<br/>

### References

Riza provides three lightweight ways to get a hold of a DOM element from inside (or outside) your component.

- `data-root="true"` &mdash; marks the element as a *root* (same as `isRoot: true` on the prototype). Roots are the targets that receive references from descendants.
- `data-ref="name"` &mdash; assigns the element to its closest custom root as `root.name`. The root receives `onRefAdded(name, element)` / `onRefRemoved(name, element)` callbacks.
- `data-xref="name"` &mdash; binds the element to `globalThis.name` for the time it's connected to the DOM.

```js
Element.register('my-form', {
    isRoot: true,

    init: function() {
        this.setInnerHTML(`
            <input data-ref="username" />
            <button data-ref="submit">OK</button>
        `);
    },

    ready: function() {
        this.username.value = '';
        this.submit.disabled = true;
    },

    onRefAdded: function(name, elem) {
        console.log('ref added:', name);
    }
});
```

<br/>

### Rinn Expressions

All template expressions used by Riza (in `data-watch` content, `data-visible`, `data-attr`, etc.) are evaluated by [Rinn's](https://github.com/rsthn/rinn/) `Template` engine. They are **not** JavaScript &mdash; they are a small Lisp-like expression language with these basic rules:

- The placeholder delimiters are square brackets: `[ ... ]`.
- The first token inside the brackets is either an **expression function** (`eq`, `if`, `each`, ...) or a **variable name** (a property in the data context, i.e. the model).
- Subsequent tokens are arguments. Tokens are separated by whitespace.
- Strings can be written with `"..."` or `'...'`. Inner brackets (`[...]`) act as nested expressions.
- Output is HTML-escaped by default. Prefix the variable with `!` to output raw HTML: `[!body_html]`.

#### Variable substitution

```html
Hello, [name]!                  <!-- escaped -->
[user.profile.email]            <!-- nested property access -->
[!html_blob]                    <!-- raw, do not escape -->
```

> **Safe by default.** `[name]` always HTML-escapes the value &mdash; characters like `<`, `>`, and `&` are converted to their entity form, so user-supplied content can never break out of the surrounding markup or inject elements. Only use the raw form `[!name]` when the value is *trusted* HTML you intend to render as-is (a server-rendered fragment, a hard-coded snippet, etc.).

#### Function calls

Functions take the form `[name arg1 arg2 ...]`. A handful of the most useful ones:

| Expression | Result |
|---|---|
| `[eq a b]` / `[ne a b]` | Equality / inequality. |
| `[lt a b]` / `[le a b]` / `[gt a b]` / `[ge a b]` | Numeric comparisons. |
| `[and a b ...]` / `[or a b ...]` / `[not a]` | Boolean logic. |
| `[isnull x]` / `[isnotnull x]` / `[iszero x]` | Null / zero checks. |
| `[+ a b ...]` / `[- a b]` / `[* a b]` / `[/ a b]` / `[mod a b]` | Arithmetic (also `sum`, `sub`, `mul`, `div`). |
| `[? cond valueA valueB]` | Ternary (returns `obj` value). |
| `[?? a b]` | Returns `a` if truthy, otherwise `b`. |
| `[if cond v1 elif cond v2 else v3]` | Conditional (returns text). |
| `[switch x case1 v1 case2 v2 default vd]` | Switch / case. |
| `[upper s]` / `[lower s]` / `[trim s]` | String case / trim. |
| `[substr start [count] s]` | Substring. |
| `[replace search repl text]` | Search-and-replace. |
| `[len x]` / `[int x]` / `[str x]` / `[float x]` | Length / type coercion. |
| `[join sep list]` / `[split sep s]` | Array <-> string. |
| `[keys obj]` / `[values obj]` | Object introspection. |
| `[each i list <template>]` | Concatenate the template once per item; `i#` is the key, `i##` is the numeric index. |
| `[map i list <expr>]` / `[filter i list <expr>]` | Functional list ops. |
| `[set name value]` / `[unset name]` | Mutate the data context. |

Many functions also have a `?`-suffixed alias (`eq?`, `lt?`, `null?`) when you prefer a more readable boolean form.

#### Examples

```html
<!-- show full name -->
<div data-watch="first|last">
    [first] [last]
</div>

<!-- conditional content -->
<span data-watch="status">
    [if [eq status 'ok'] 'All good' elif [eq status 'warn'] 'Heads up' else 'Error']
</span>

<!-- list rendering -->
<ul data-watch="items">
    [each item items <li>[item.label] - $[item.price]</li>]
</ul>

<!-- visibility based on a model field -->
<div data-visible="[ne email '']">Has email</div>
<div data-visible="[gt count 0]">There are items</div>

<!-- bind a DOM property to an expression -->
<a data-attr="href: /user/[id]; title: [name]">profile</a>
```

The `data-visible` and `data-attr` values are themselves Rinn templates &mdash; you can write either a bare placeholder like `[expr]` or any combination of literals and expressions. The template's data context is the element's model, so any model property is reachable by name.

<br/>

### Models and Data Binding

Every element can be paired with a Rinn `Model`. Set the model type with `modelt` (defaults to `Model`) and an initial value with `model`. Once the model is set, descendants with the binding attributes below stay in sync automatically. Bindings are only collected on elements where `isRoot: true` (or `data-root="true"`).

| Attribute | Purpose |
|---|---|
| `data-watch="field1\|field2"` | Re-render the element's `innerHTML` (as a Rinn template) whenever any matching field changes. |
| `data-visible="expr"` | Toggle `display: none` based on a Rinn expression. |
| `data-attr="name: expr; other: expr"` | Update one or more properties when the model changes (each `expr` is a Rinn template). |
| `data-property="fieldName"` | Two-way binding for inputs (`input`, `select`, `textarea`, `checkbox`, `radio`, custom `field` types). |

The value of `data-watch` is a list of model field names (separated by `|`); whenever any one of them changes, the element's `innerHTML` is re-rendered using its captured template. The placeholders inside that HTML are [Rinn expressions](#rinn-expressions) &mdash; written with `[ ... ]`.

Each of these has a `data-self-*` variant that targets the element itself instead of descendants (`data-self-watch`, `data-self-visible`, `data-self-attr`, `data-self-property`).

```js
Element.register('user-card', {
    isRoot: true,
    model: { name: '', email: '' },

    init: function() {
        this.setInnerHTML(`
            <div data-watch="name|email">
                <strong>[name]</strong> &lt;[email]&gt;
            </div>
            <input data-property="name" placeholder="Name" />
            <span data-visible="[ne email '']">has email</span>
        `);
    }
});
```

```js
const card = document.querySelector('user-card');
card.model.set('name', 'Ada');
```

> **Caveat — `data-watch` re-renders do NOT re-collect inner wirings.** When `data-watch` fires it does `element.innerHTML = template(data)` and that's it. It does not re-run the binding/ref collection pass. Anything inside the re-rendered HTML that depends on per-element wiring is silently broken after the first re-render:
>
> - `data-ref` &mdash; the original element (with the registered ref) is detached; the new element is never registered, and `root.<refName>` keeps pointing at the detached one.
> - `data-property` &mdash; `onchange` / `onblur` handlers never get attached to the new input, so typing doesn't update the model.
> - `data-visible`, `data-attr` &mdash; never registered for the new element.
> - Nested `data-watch` &mdash; the inner template was captured at the *outer*'s collection time, but after the outer re-renders, the new inner DOM node isn't tracked, so it stops reacting.
>
> `data-action` is fine inside a `data-watch` (delegation lives at the root, not on the element), and so are inert children with `[expr]` substitutions baked into the captured template.
>
> **Rule of thumb:** put `data-watch` only on small "leaves". Anything that needs `data-ref` / `data-property` / `data-visible` / `data-attr` must live OUTSIDE any `data-watch` &mdash; as a sibling of the watcher, not inside it. For each independently-reactive piece, use a separate sibling `data-watch` rather than nesting them.

You can also bind a model declaratively from markup using `data-model="path.to.global"` &mdash; the path resolves against `global`, or starting with `this`/`root` to start from the element or its root.

Override the following methods to react to model changes manually:

```js
onModelChanged: function(evt, args) { /* model replaced or bulk update */ },
onModelPropertyChanging: function(evt, args) { /* args.name, args.value */ },
onModelPropertyChanged: function(evt, args) { /* fired AFTER bindings update */ },
onModelPropertyRemoved: function(evt, args) { /* args.name */ }
```

<br/>

### Scoped Styles

Set `styles` on the prototype to inject CSS into the document the first time an instance is created. The token `@` (followed by space or `{`) is rewritten to the element's tag name &mdash; this is how you write rules that only apply within your component.

```js
Element.register('badge-pill', {
    styles: `
        @ {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            border-radius: 999px;
            background: #eee;
        }
        @ .count {
            font-weight: bold;
            margin-left: 0.5rem;
        }
    `,

    init: function() {
        this.setInnerHTML('<span>Notifications</span><span class="count">3</span>');
    }
});
```

The injected rules become `badge-pill { ... }` and `badge-pill .count { ... }` &mdash; no leakage to other elements.

<br/>

### Routes

Elements can declare hash-based routes that map to methods, similar to the `events` map. Routes are bound on connect and unbound on disconnect.

```js
Element.register('my-app', {
    routes: {
        '/home/':       'showHome',
        '/users/:id/':  function(evt, args) { this.showUser(args.id); },
        '!/users/:id/': 'leaveUser'   // leading ! = on-unroute handler
    },

    showHome: function() { /* ... */ },
    showUser: function(id) { /* ... */ },
    leaveUser: function() { /* ... */ }
});
```

The `route ...`-prefixed method shorthand also works (mirrors the `event ...` form):

```js
'route /home/': function() { /* ... */ }
```

<br/>

### Composition and Inheritance

`Element.register(name, ...prototypes)` accepts both plain objects and the names of previously registered elements. Object prototypes are merged in order; named prototypes additionally expose their methods through `this._super[name]` so you can call them explicitly.

```js
Element.register('base-button', {
    init: function() {
        this.classList.add('btn');
    },
    click: function() {
        console.log('base click');
    }
});

Element.register('fancy-button', 'base-button', {
    init: function() {
        // base-button's init was already merged in, but you can also reach it via _super:
        this._super['base-button'].init();
        this.classList.add('btn-fancy');
    },
    click: function() {
        this._super['base-button'].click();
        console.log('fancy click');
    }
});
```

<br/>

### Extending and Hooking Existing Elements

After an element is registered you can still add to it (handy for plugins or for tweaking pre-made elements like `r-form`):

```js
Element.expand('r-form', {
    'event submit form': function(evt) {
        console.log('form submitted');
        evt.continuePropagation = true;
    }
});

const hook = Element.hookAppend('r-form', 'submit', function() {
    console.log('after submit');
});

// ...later
hook.unhook();
```

`hookPrepend` and `hookAppend` wrap an existing method; both return an object with an `unhook()` to remove the hook.

<br/>

### Utility Methods

A short reference of helpers available on every registered element:

**DOM / styling**

- `addClass('a b -c +d')` &mdash; add class names; prefixes `+` add and `-` remove.
- `removeClass('a b')` &mdash; remove class names.
- `setStyle('color: red; font-size: 14px')` &mdash; set styles via a CSS-like string (camelCases property names).
- `setInnerHTML(html)` / `getInnerHTML()` &mdash; set/get innerHTML, with internal probe nodes filtered out.

**Lifecycle / readiness**

- `whenReady(callback)` &mdash; run `callback` immediately if ready, otherwise on the next `_ready`.
- `markReady()` / `checkReady()` &mdash; manually drive readiness (rarely needed).

**Models**

- `setModel(model, update=true)` &mdash; set/replace the model and re-bind listeners.
- `getModel()` &mdash; return the current model.
- `getFieldByPath('this.foo.bar' | 'root.x' | 'global.path')` &mdash; safe dotted-path lookup.
- `getRoot()` &mdash; return (and cache) the closest ancestor with `isRoot: true`.

**Events**

- `listen(eventName, [selector,] handler)` &mdash; attach a listener; returns `{ remove() }`.
- `bindEvents(map)` / `bindRoutes()` &mdash; usually called for you, but available if you build the maps dynamically.
- `dispatch(name, args, bubbles=true)` &mdash; fire a (bubbling) event; calls `on<name>` first if defined.
- `trigger(name, args)` &mdash; local fire that *only* invokes `on<name>`.
- `dispatchOn(elem, name, args, bubbles)` &mdash; same as `dispatch`, but on a different element.

**Element registration**

- `Element.register(name, ...protos)` &mdash; define a new custom element.
- `Element.expand(name, ...protos)` &mdash; merge additional prototypes into an already-registered element.
- `Element.hookAppend(name, fn, hook)` / `Element.hookPrepend(name, fn, hook)` &mdash; wrap a method on a registered element.

<br/>

### Reactivity with Signals

Riza re-exports the [`riza-signal`](./packages/riza-signal) primitives &mdash; `signal`, `expr`, `watch`, and `validator` &mdash; so any consumer of `riza` gets reactive values, derived values, and side-effect handlers without an extra dependency. Updates are batched via `queueMicrotask`, so a chain of synchronous writes triggers a single downstream evaluation. The full reference (type coercion, validators, manual subscription) lives in the [`riza-signal` README](./packages/riza-signal/README.md).

```js
import { signal, expr, watch } from 'riza';

const a = signal(2);
const b = signal(3);

const sum = expr([a, b], (x, y) => x + y);

watch([sum], (v) => console.log('sum is', v));
// → sum is 5

a.value = 10;
// → sum is 13
```

#### Driving a model field

In Riza, the most useful pattern is to pipe a signal into a custom element's model. Once the model field updates, every binding in the element's HTML (`data-watch`, `data-visible`, `data-attr`, ...) re-renders for free.

```js
import { Element, signal, watch } from 'riza';

const username = signal('');

Element.register('greeting-card', {
    isRoot: true,
    model: { name: '' },

    init: function() {
        this.setInnerHTML(`<h2 data-watch="name">Hello, [name]!</h2>`);

        // Whenever `username` changes, update the model field
        // and the bound HTML re-renders automatically.
        watch([username], (v) => this.model.set('name', v));
    }
});

document.body.appendChild(document.createElement('greeting-card'));

username.value = 'Ada';     // → "Hello, Ada!"
username.value = 'Grace';   // → "Hello, Grace!"
```

The same approach works for any signal-driven state &mdash; route params, fetch results, app-wide flags &mdash; and any number of elements can subscribe to the same signal.

#### Rinn re-exports

For convenience, every public symbol from [Rinn](https://github.com/rsthn/rinn) is also re-exported by `riza`:

```js
import { Rinn, Class, Event, EventDispatcher, Model, ModelList, Schema, Flattenable, Collection, Template } from 'riza';
```

So `Model`, `Template`, and friends never need a separate import.

<br/>

### Modern Approach (JSX)

Everything covered above is the **classic** approach &mdash; defining elements with `Element.register(...)` and authoring markup as HTML strings or via `setInnerHTML`. It works with any toolchain (or none at all, via the `<script type="module" src="dist/riza.js">` flavor) and is the most direct way to use Riza.

The **modern** approach swaps HTML strings for JSX and runs your source through [`babel-plugin-riza`](./packages/babel-plugin-riza). JSX returns real DOM nodes, so element references are typed values rather than `querySelector` lookups, and JSX expressions can be wired directly to signals for reactive rendering. This is what `riza new <project>` sets up for you by default.

#### Scaffold a JSX project

```bash
pnpm dlx riza new <my-project>
cd <my-project>
pnpm dev
```

The generated project uses Parcel for bundling and HMR; the entry point is `src/app.jsx`. The smallest possible app from the template looks like this:

```jsx
import "./css/xui.css"
import "./heart-beat"

export default () =>
    <div>
        <heart-beat></heart-beat>
    </div>
;
```

A custom element written as a JSX-friendly module &mdash; reused by `app.jsx` above &mdash; is just a regular `Element.register` call:

```jsx
import { Element } from 'riza';

Element.register('heart-beat', {
    contents: `
        <div>
            <span><img src="logo-512.png" /></span>
        </div>
    `,

    styles: `
        @ { font-family: Inter; text-align: center; }
        @ img { width: 14rem; }
    `
});
```

You can find the full minimal template under [`bin/minimal/src`](./bin/minimal/src) &mdash; in particular [`bin/minimal/src/app.jsx`](./bin/minimal/src/app.jsx) and [`bin/minimal/src/heart-beat.jsx`](./bin/minimal/src/heart-beat.jsx).

#### Stick with the classic flow

If you'd rather skip the bundler entirely, both options remain available:

- Drop a `<script type="module" src="dist/riza.js">` into your HTML and write plain JS. See [Without a bundler](#without-a-bundler).
- Scaffold a Parcel-based classic project with `pnpm dlx riza new classic <my-project>`.

A dedicated section covering JSX templates, signal bindings, and the JSX-specific helpers will be added later.

<br/>

### A Complete Example

A small to-do component using most of the building blocks above. A runnable version of this app (HTML + JS) is available in the [samples](./samples) folder &mdash; open [`samples/todo.html`](./samples/todo.html) directly in a browser to try it.

```js
import { Element } from 'riza';

Element.register('todo-app', {
    isRoot: true,
    model: { input: '', count: 0 },

    styles: `
        @ { display: block; padding: 1rem; font-family: sans-serif; }
        @ ul { list-style: none; padding: 0; }
        @ li { padding: 0.25rem 0; }
        @ .done { text-decoration: line-through; opacity: 0.6; }
    `,

    init: function() {
        this.setInnerHTML(`
            <h2>Tasks (<span data-watch="count">[count]</span>)</h2>
            <input data-property="input" data-enter="add" placeholder="What needs doing?" />
            <button data-action="add">Add</button>
            <ul data-ref="list"></ul>
        `);
    },

    add: function() {
        const text = (this.model.get('input') || '').trim();
        if (!text) return;

        const li = document.createElement('li');
        li.textContent = text;
        li.dataset.action = ':toggleClass done';
        this.list.appendChild(li);

        this.model.set('count', this.model.get('count') + 1);
        this.model.set('input', '');
    }
});
```

```html
<todo-app></todo-app>
```

<br/>

For documentation on the pre-made elements (`r-form`, `r-list`, `r-panel`, `r-tabs`, etc.) and on supporting modules like `Api`, `Router`, `DataSource`, and `DataList`, see the [docs](./docs/README.md) folder.
