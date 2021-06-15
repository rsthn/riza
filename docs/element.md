# Element

Base class for custom elements. Provides support for model-triggered events, watchers, handlers for events originated in the element or child-elements, and several utility methods.

```js
const { Element } = require('riza');
```

```js
const { Element } = riza;
```

<br/>

# Usage

Custom elements can be defined easily by using the `register` method of `Element`, after which it will be available to be used in HTML as any other element.

Say we want to make a simple `click-counter` element:

```js
Element.register('click-counter',
{
    model: {
        count: 0
    },

    events: {
        "click button": function() {
            this.model.set('count', this.model.get('count') + 1);
        }
    },

    init: function()
    {
        this.setInnerHTML(`
            <b data-watch="count">
                You have clicked me [count] times.
            </b>

            <button>Click</button>
        `);
    }
});
```

We can now use it from HTML, as any other element<sup>1</sup>:

```html
<click-counter></click-counter>
```

And it will show a bold label with a button, which when clicked will increase a counter. Using our `Element` class will provide much more functionality and flexibility than regular custom elements.

> <sup>1</sup>Ensure your custom element name has at least one letter before a hyphen (i.e. `x-myelem`), because the spec does not allow custom elements having just one-word names.

<br/>

# Attributes

|Attribute|Description
|---------|-----------
|`data-ref`|Sets a reference to the element in the root. Useful to give a name to the element and be able to access it from the root.
|`data-xref`|Sets a reference to the element in the global context (window). The element will be globally available given its name.

<br/>

# Event Handlers

Event handlers can be defined in either the `events` field, or right in the class itself (as a function) by prefixing the name with "event". In either case an `event-selector` string is required, that is, the **event name** followed by a **selector**.

<br/>

Say we have a `test-elem` element, and we want to catch the **click** event on all child elements **b** having class **red**. The `events` property would look like this:

```js
Element.register('test-elem',
{
    events: {
        "click b.red": function (evt)
        {
            console.log("Element is => " + evt.source);
        }
    }
});
```

Or the handler can be defined in the class as a function property, like this:

```js
Element.register('test-elem',
{
    "event click b.red": function (evt)
    {
    }
});
```

Both are equivalent, and in both cases the callback will get a parameter `evt` which is the actual event fired from the browser with the following additional fields:

- `source` (HTMLElement) The actual element that is the source of the event.
- `continuePropagation` (bool) Indicates if further upwards propagation should be continued.

Whenever handling events from `Element` the mentioned fields must be used to determine source element and to control propagation instead of the default browser ones, otherwise possibly undefined behavior could be introduced.

When `Element` detects an event and a suitable event handler, it will:
- Set `continuePropagation` field to `false`.
- Execute event handler.
- If `continuePropagation` is false, prevents default handler and stops propagation of the event. Otherwise, it will allow it to continug bubbling up.

Therefore, if bubbling-up is desired, ensure to set `continuePropagation` to true before leaving the event handler.

<br/>

# Properties

#### string `eid`

Internal element ID. Added as namespace to model events. Ensures that certain model events are run locally only, not affecting other event handlers.

#### bool `isRoot`
Indicates if the element is a root element, that is, the target element to attach child elements having `data-ref` attribute. Default is true.

#### object `root`
Root element to which this element is attached (when applicable).

#### int `isReady`
Indicates ready-state of the element. Possible values are: 0: "Not ready", 1: "Children Initialized", and 2: "Parent Ready".

#### object `refs`
All children elements having the `data-ref` attribute are added to this map (and to the element itself).

#### class `modelt`
Model type (class) for the element's model. Defaults to `Model`.

#### object `model`
Data model related to the element. Defaults to `null`.

<br/>

# Methods

#### void `init` ()
Initializes the element. Called after construction of the instance.

<br/>

#### void `ready` ()
Executed when the children of the element are ready.

<br/>

#### void `rready` ()
Executed after `ready` and after the root is also ready.

<br/>

#### object `getFieldByPath` (string path)
Returns the value of a field given its path. Starts from `global` unless the first item in the path is `this`, in which case it will start from the element.

<br/>

#### Element `getRoot` ()
Returns the root of the element (that is, the `root` property). If not set it will attempt to find the root first.

<br/>

#### Element `setModel` (Model model, bool update=true);
Sets the model of the element and executes the `modelChanged` event handler (unless `update` is set to false).

<br/>

#### Model `getModel` ()
Returns the model of the element. Added for symmetry only, exactly the same as accesing public property `model` of this class.

<br/>

#### Element `addClass` (string classString)
Adds one or more CSS classes (separated by space) to the element.

<br/>

#### Element `removeClass` (string classString)
Removes one or more CSS classes (separated by space) from the element.

<br/>

#### Element `setStyle` (string styleString)
Sets one or more style properties to the element (separated by semi-colon).

<br/>

#### float `getWidth` (HTMLElement element)
#### float `getWidth` ()
Returns the width of the specified element (or of itself it none provided), uses `getBoundingClientRect`.

<br/>

#### float `getHeight` (HTMLElement element)
#### float `getHeight` ()
Returns the height of the specified element (or of itself it none provided), uses `getBoundingClientRect`.

<br/>

#### object `listen` ( string eventName, string selector, void handler (object evt) )
#### object `listen` ( string eventName, void handler (object evt) )
Listens for an event on elements matching the specified selector, returns an object with a single method `remove` used to remove the listener when it is no longer needed.

<br/>

#### void `dispatch` (string eventName, object args=null, bool bubbles=true)
Dispatches a new event with the specified name and the given arguments.

<br/>

#### void `dispatchOn` (HTMLElement elem, string eventName, object args=null, bool bubbles=true)
Dispatches a new event on the specified element with the given name and arguments (uses `CustomEvent`).

<br/>

#### void `setInnerHTML` (string value)
Sets the innerHTML property of the element and runs some post set-content tasks.

<br/>

#### void `onCreated` ()
Executed when the element is created and yet not attached to the DOM tree.

<br/>

#### void `onConnected` ()
Executed when the element is attached to the DOM tree.

<br/>

#### void `onDisconnected` ()
Executed when the element is no longer a part of the DOM tree.

<br/>

#### void `onRefAdded` (string name)
Executed on the root element when a child element has `data-ref` attribute and it was added to it.

<br/>

#### void `onRefRemoved` (string name)
Executed on the root element when a child element has `data-ref` attribute and it was removed from it.

<br/>

#### void `onModelChanged` (object evt, object args)
Event handler invoked when the model has changed.

<br/>

#### void `onModelPropertyChanging` (object evt, object args)
Event handler invoked when a property of the model is changing. Fields `name` and `value` can be found in the `args` object.

<br/>

#### void `onModelPropertyChanged` (object evt, object args)
Event handler invoked when a property of the model has changed. Should be overriden only if required. Automatically triggers internal events named `propertyChanged.<propertyName>` and `propertyChanged`.

<br/>

#### void `onModelPropertyRemoved` (object evt, object args)
Event handler invoked when a property of the model is removed. Field `name` can be found in the `args` object.

<br/>

#### class `register` (string name, ...object protos)
Registers a new custom element with the specified name. Extra functionality can be added with one or more prototypes, by default all elements also get the `Element` prototype. Note that the final prototypes of all registered elements are stored, and if you want to inherit another element's prototype just provide its name (string) in the protos argument list.

<br/>

#### void `expand` (string elementName, ...object protos)
Expands an already created custom element with the specified prototype(s).
