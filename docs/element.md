# Element

Base class for custom elements. Provides support for model-triggered events, watchers, handlers for events originated in the element or child-elements, and several utility methods.

The real name of this class is `Element`, however we provide an alternative alias named `CElement` which can be imported without colliding with existing libraries having another class named `Element`.

```js
import { Element } from 'riza';

// Or:
import { CElement } from 'riza';
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

	'event click button': function() {
		this.model.set('count', this.model.getInt('count') + 1);
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

> <sup>1</sup>Ensure your custom element name has at least one letter before a hyphen (i.e. `x-myelem`), because the official specification of Custom Elements does not allow custom elements having just one-word names.

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
        'click b.red': function (evt)
        {
            console.log('Element is => ' + evt.source);
        }
    }
});
```

Or the handler can be defined in the class as a function property, like this:

```js
Element.register('test-elem',
{
    'event click b.red': function (evt)
    {
    }
});
```

Both are equivalent, and in both cases the callback will get a parameter `evt` which is the actual event fired from the browser with the following additional fields:

- `source` (HTMLElement) The actual element that is the source of the event.
- `continuePropagation` (boolean) Indicates if further upwards propagation should be continued.

Whenever handling events from `Element` the mentioned fields must be used to determine source element and to control propagation instead of the default browser ones, otherwise possibly undefined behavior could be introduced.

When `Element` detects an event and a suitable event handler, it will:
- Set `continuePropagation` field to `false`.
- Execute event handler.
- If `continuePropagation` is still false, prevents default handler and stops propagation of the event. Otherwise, it will allow it to continug bubbling up.

Therefore, if bubbling-up is desired, ensure to set `continuePropagation` to true before leaving the event handler.

<br/>

# Properties

### *readonly* `eid` : string

Internal element ID. Added as namespace to model events. Ensures that certain model events are run locally only, not affecting other event handlers.

### `isRoot` : boolean
Indicates if the element is a root element, that is, the target element to attach child elements having `data-ref` attribute. Default is `true`.

### *readonly* `root` : HTMLElement
Root element to which this element is attached (when applicable).

### *readonly* `isReady` : number
Indicates ready-state of the element. Possible values are: 0: "Not ready", 1: "Children Initialized", and 2: "Parent Ready".

### `modelt` : constructor
Model type (class) for the element's model. Defaults to `Model`.

### `model` : object
Data model related to the element. Defaults to `null`.

<br/>

# Methods

### `init` () : void
Initializes the element. Called after construction of the instance.

<br/>

### `ready` () : void
Executed when the children of the element are ready.

<br/>

### `rready` () : void
Executed after `ready` and after the root is also ready.

<br/>

### `getFieldByPath` (`path`: string) : object
Returns the value of a field given its path. Starts from `global` unless the first item in the path is `this`, in which case it will start from the element.

<br/>

### `getRoot` () : Element
Returns the root of the element (that is, the `root` property). If not set it will attempt to find the root first.

<br/>

### `setModel` (`model`: Model, `update`: boolean=true) : Element
Sets the model of the element and executes the `modelChanged` event handler (unless `update` is set to false).

<br/>

### `getModel` () : Model
Returns the model of the element. Added for symmetry only, exactly the same as accesing public property `model` of this class.

<br/>

### `addClass` (`classString`: string) : Element
Adds one or more CSS classes (separated by space) to the element.

<br/>

### `removeClass` (`classString`: string) : Element
Removes one or more CSS classes (separated by space) from the element.

<br/>

### `setStyle` (`styleString`: string) : Element
Sets one or more style properties to the element (separated by semi-colon).

<br/>

### `getWidth` (`element`: HTMLElement) : number
### `getWidth` () : number
Returns the width of the specified element (or of itself it none provided), uses `getBoundingClientRect`.

<br/>

### `getHeight` (element: HTMLElement) : number
### `getHeight` () : number
Returns the height of the specified element (or of itself it none provided), uses `getBoundingClientRect`.

<br/>

### `listen` ( `eventName`: string, `selector`: string, `handler`: (evt: object) => void ) : object
### `listen` ( `eventName`: string, `handler`: (evt: object) => void ) : object
Listens for an event on elements matching the specified selector, returns an object with a single method `remove` used to remove the listener when it is no longer needed.

<br/>

### `dispatch` (`eventName`: string, `args`: object=null, `bubbles`: boolean=true) : void
Dispatches a new event with the specified name and the given arguments.

<br/>

### `dispatchOn` (`elem`: HTMLElement, `eventName`: string, `args`: object=null, `bubbles`: boolean=true) : void
Dispatches a new event on the specified element with the given name and arguments (uses `CustomEvent`).

<br/>

### `setInnerHTML` (`value`: string) : void
Sets the innerHTML property of the element and runs some post set-content tasks.

<br/>

### `onCreated` () : void
Executed when the element is created and yet not attached to the DOM tree.

<br/>

### `onConnected` () : void
Executed when the element is attached to the DOM tree.

<br/>

### `onDisconnected` () : void
Executed when the element is no longer a part of the DOM tree.

<br/>

### `onRefAdded` (`name`: string) : void
Executed on the root element when a child element has `data-ref` attribute and it was added to it.

<br/>

### `onRefRemoved` (`name`: string) : void
Executed on the root element when a child element has `data-ref` attribute and it was removed from it.

<br/>

### `onModelChanged` (`evt`: object, `args`: object) : void
Event handler invoked when the model has changed.

<br/>

### `onModelPropertyChanging` (`evt`: object, `args`: object) : void
Event handler invoked when a property of the model is changing. Fields `name` and `value` can be found in the `args` object.

<br/>

### `onModelPropertyChanged` (`evt`: object, `args`: object) : void
Event handler invoked when a property of the model has changed. Should be overriden only if required. Automatically triggers internal events named `propertyChanged.<propertyName>` and `propertyChanged`.

<br/>

### `onModelPropertyRemoved` (`evt`: object, `args`: object) : void
Event handler invoked when a property of the model is removed. Field `name` can be found in the `args` object.

<br/>

### `register` (`name`: string, `protos`: ...object) : constructor
Registers a new custom element with the specified name. Extra functionality can be added with one or more prototypes, by default all elements also get the `Element` prototype. Note that the final prototypes of all registered elements are stored, and if you want to inherit another element's prototype just provide its name (string) in the protos argument list.

<br/>

### `expand` (`elementName`: string, `protos`: ...object) : void
Expands an already created custom element with the specified prototype(s).
