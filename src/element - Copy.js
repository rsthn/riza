/*
**	riza/element
**
**	Copyright (c) 2013-2021, RedStar Technologies, All rights reserved.
**	https://www.rsthn.com/
**
**	THIS LIBRARY IS PROVIDED BY REDSTAR TECHNOLOGIES "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES,
**	INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A 
**	PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL REDSTAR TECHNOLOGIES BE LIABLE FOR ANY
**	DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT 
**	NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; 
**	OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, 
**	STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE
**	USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

import { Rin, Model, Template } from '@rsthn/rin';

/**
**	Map containing the original prototypes for all registered elements.
*/
const elementPrototypes = { };

/**
**	Map containing the final classes for all registered elements.
*/
const elementClasses = { };


/*
**	Base class for custom elements. Provides support for model-triggered events, easy definition of handlers for events originated in
**	self or child-elements, and several utility methods.
*/

const Element = 
{
	/**
	**	Internal element ID. Added as namespace to model events. Ensures that certain model events are run locally only, not affecting other event handlers.
	*/
	eid: null,

	/**
	**	Indicates if the element is a root element, that is, the target element to attach child elements having `data-ref` attribute.
	*/
	isRoot: true,

	/**
	**	Root element to which this element is attached (when applicable).
	*/
	root: null,

	/**
	**	Indicates ready-state of the element. Possible values are: 0: "Not ready", 1: "Children Initialized", and 2: "Parent Ready".
	*/
	isReady: 0,

	/**
	**	All children elements having the `data-ref` attribute are added to this map (and to the element itself).
	*/
	refs: null,

	/**
	**	Model type (class) for the element's model.
	*/
	modelt: Model,

	/**
	**	Data model related to the element.
	*/
	model: null,

	/**
	**	Events map.
	*/
	events:
	{
		'click [data-action]': function(evt) {
			let opts = evt.source.dataset.action.split(' ');

			if (opts[0] in this)
				this[opts[0]] ({ ...evt.source.dataset, ...opts, length: opts.length }, evt);
			else
				evt.continuePropagation = true;
		},

		'keyup(13) input[data-enter]': function(evt) {
			let opts = evt.source.dataset.enter.split(' ');

			if (opts[0] in this)
				this[opts[0]] ({ ...evt.source.dataset, ...opts, length: opts.length }, evt);
			else
				evt.continuePropagation = true;
		}
	},

	/**
	**	Element constructor.
	*/
	__ctor: function()
	{
		this._list_watch = [];
		this._list_visible = [];
		this._list_property = [];

		if ('root' in this.dataset)
		{
			if (this.dataset.root == 'false')
				this.isRoot = false;
		}

		this.style.display = 'block';

		this.refs = { };
		this.eid = Math.random().toString().substr(2);

		if (this.model != null)
		{
			let tmp = this.model;
			this.model = null;
			this.setModel (tmp, false);
		}

		this._mutationObserver = true;

		Object.keys(this._super).reverse().forEach(i =>
		{
			if ('init' in this._super[i])
				this._super[i].init();
		});

		this.init();

		if (this.events)
			this.bindEvents (this.events);

		const ready = () =>
		{
			this.isReady = 1;

			if ('model' in this.dataset)
			{
				let ref = this.getFieldByPath(this.dataset.model);
				if (ref) this.setModel(ref);
			}
 
			Object.keys(this._super).reverse().forEach(i =>
			{
				if ('ready' in this._super[i])
					this._super[i].ready();
			});

			this.ready();

			if (this.root && this.dataset.ref)
				this.root.onRefAdded (this.dataset.ref, this);

			this.collectWatchers();

			let root = this.findCustomParent(this);
			if (root)
			{
				// Added element using append/prepend on the root but there are no mutation handlers.
				if (!root._mutationHandler)
				{
					if (root.isReady == 2)
					{
						this.rready();
						this.isReady = 2;
					}
				}
				else
					root._mutationHandler();
			}

			return root;
		};

		let timeout = null;

		this._mutationHandler = () =>
		{
			if (this.childNodes.length == 0)
				return;

			let is_ready = true;

			this.querySelectorAll('[data-_custom]').forEach(i =>
			{
				let root = this.findCustomParent(i);
				if (root !== this) return;

				if (!i.isReady) {
console.log(this.tagName + ' NOT READY => ' + i.tagName);
					is_ready = false;
				}
			});
console.log(this.tagName + ' => ' + is_ready);
			if (!is_ready) return;

			if (timeout) clearTimeout(timeout);

			timeout = setTimeout(() =>
			{
				timeout = null;

				let is_ready = true;
				let list = [];

				this.querySelectorAll('[data-_custom]').forEach(i =>
				{
					let root = this.findCustomParent(i);
					if (root !== this) return;

					if (!i.isReady) is_ready = false;
					if (i.isReady != 2) list.push(i);
				});
console.log('timeout ' + this.tagName + ' => ' + is_ready);
				if (!is_ready) return;

				for (let elem of this.querySelectorAll('[data-_pending=true]'))
				{
					let root = this.findRoot(elem.parentElement);
					if (root !== this) continue;

					if (elem.dataset._linked != 'true')
					{
//console.log('INIT ' + this.tagName + ' CONNECT ' + elem.tagName);//violet
						this[elem.dataset.ref] = elem;
						this.refs[elem.dataset.ref] = elem;

						elem.connectReference(this);
					}
				}

				this._mutationHandler = null;
				this._mutationObserver.disconnect();
				this._mutationObserver = null;

				let root = ready();

				for (let i of list)
				{
					i.rready();
					i.isReady = 2;
				}

				if (!root)
				{
					this.isReady = 2;
					this.rready();
				}
			},
			50);
		};

		this._mutationObserver = new MutationObserver (this._mutationHandler);
		this._mutationObserver.observe(this, { attributes: false, childList: true, subtree: false });

		this._mutationHandler();
	},

	/**
	**	Initializes the element. Called after construction of the instance.
	*/
	init: function()
	{
	},

	/**
	**	Executed when the children of the element are ready.
	*/
	ready: function()
	{
	},

	/**
	**	Executed after ready and after the root is also ready.
	*/
	rready: function()
	{
	},

	/*
	**	Returns the value of a field given its path. Starts from `global`, unless the first item in the path is `this`, in which case it will start from the element.
	*/
	getFieldByPath: function(path)
	{
		if (!path) return null;

		let tmp = path.split('.');
		let ref = global;

		if (tmp.length && tmp[0] == 'this')
		{
			ref = this;
			tmp.shift();
		}

		if (tmp.length && tmp[0] == 'root')
		{
			ref = this.getRoot();
			tmp.shift();
		}

		while (ref != null && tmp.length != 0)
			ref = ref[tmp.shift()];

		return ref;
	},

	/**
	**	Returns the root of the element (that is, the `root` property). If not set it will attempt to find the root first.
	*/
	getRoot: function()
	{
		return this.root ? this.root : (this.root = this.findRoot());
	},

	/**
	**	Sets the model of the element and executes the `modelChanged` event handler (unless `update` is set to false).
	*/
	setModel: function (model, update=true)
	{
		if (!model) return this;

		model = Rin.ensureTypeOf(this.modelt, model);

		if (this.model !== model)
		{
			if (this.model != null)
			{
				this.model.removeEventListener (this.eid+':modelChanged', this.onModelPreChanged, this);
				this.model.removeEventListener (this.eid+':propertyChanging', this.onModelPropertyChanging, this);
				this.model.removeEventListener (this.eid+':propertyChanged', this.onModelPropertyPreChanged, this);
				this.model.removeEventListener (this.eid+':propertyRemoved', this.onModelPropertyRemoved, this);
			}

			this.model = model;

			this.model.addEventListener (this.eid+':modelChanged', this.onModelPreChanged, this);
			this.model.addEventListener (this.eid+':propertyChanging', this.onModelPropertyChanging, this);
			this.model.addEventListener (this.eid+':propertyChanged', this.onModelPropertyPreChanged, this);
			this.model.addEventListener (this.eid+':propertyRemoved', this.onModelPropertyRemoved, this);
		}

		if (update !== false)
			this.model.setNamespace(this.eid).update(true).setNamespace(null);

		return this;
	},

	/**
	**	Returns the model of the element. Added for symmetry only, exactly the same as accesing public property `model` of this class.
	*/
	getModel: function ()
	{
		return this.model;
	},

	/*
	**	Adds one or more CSS classes (separated by space) to the element.
	*/
	addClass: function (classString)
	{
		if (!classString) return this;

		classString.split(' ').forEach(i =>
		{
			i = i.trim();
			if (!i) return;

			if (i[0] == '-' || i[0] == '+')
				this.classList[i[0] == '-' ? 'remove' : 'add'](i.substr(1));
			else
				this.classList.add(i);
		});

		return this;
	},

	/*
	**	Removes one or more CSS classes (separated by space) from the element.
	*/
	removeClass: function (classString)
	{
		if (!classString) return this;

		classString.split(' ').forEach(i =>
		{
			i = i.trim();
			if (!i) return;

			if (i[0] == '-' || i[0] == '+')
				this.classList[i[0] == '-' ? 'remove' : 'add'](i.substr(1));
			else
				this.classList.remove(i);
		});

		return this;
	},

	/*
	**	Sets one or more style properties to the element (separated by semi-colon).
	*/
	setStyle: function (styleString)
	{
		if (!styleString) return this;

		styleString.split(';').forEach(i => {
			let j = (i = i.trim()).indexOf(':');
			if (j == -1) return;

			let name = i.substr(0, j).trim();
			for (let k = name.indexOf('-'); k != -1; k = name.indexOf('-')) {
				name = name.substr(0, k) + name.substr(k+1, 1).toUpperCase() + name.substr(k+2);
			}

			this.style[name] = i.substr(j+1).trim();
		});

		return this;
	},

	/*
	**	Returns the width of the specified element (or of itself it none provided), uses `getBoundingClientRect`.
	*/
	getWidth: function (elem=null)
	{
		return (elem || this).getBoundingClientRect().width;
	},

	/*
	**	Returns the height of the specified element (or of itself it none provided), uses `getBoundingClientRect`.
	*/
	getHeight: function (elem=null)
	{
		return (elem || this).getBoundingClientRect().height;
	},

	/**
	**	Binds all events in the specified map to the element, the events map can have one of the following forms:
	**
	**		"click .button": "doSomething",		(Delegated Event)
	**		"click .button": function() { },	(Delegated Event)
	**		"myevt &this": "...",				(Self Event)
	**		"myevt": "...",						(Element Event)
	**		"myevt @objName": "...",			(EventDispatcher Event)
	**		"#propname": "...",					(Property Changed Event)
	**		"keyup(10) .input": "..."			(Delegated Event with Parameters)
	**
	**	>> Element bindEvents (object events);
	*/
	bindEvents: function (events)
	{
		for (var evtstr in events)
		{
			let hdl = events[evtstr];

			if (Rin.typeOf(hdl) == 'string')
				hdl = this[hdl];

			hdl = hdl.bind(this);

			var i = evtstr.indexOf(' ');

			var name = i == -1 ? evtstr : evtstr.substr(0, i);
			var selector = i == -1 ? '' : evtstr.substr(i + 1);

			let args = null;

			var j = name.indexOf('(');
			if (j != -1)
			{
				args = name.substr(j+1, name.length-j-2).split(',');
				name = name.substr(0, j);
			}

			if (selector[0] == '@')
			{
				if (selector != '@this')
				{
					this[selector.substr(1)].addEventListener(name, hdl);
					continue;
				}

				selector = this;
			}
			else if (selector[0] == '&')
			{
				if (selector != '&this')
					selector = "[data-ref='"+selector.substr(1)+"']";
				else
					selector = this;
			}

			if (name.substr(0, 1) == '#')
			{
				this.listen('propertyChanged.'+name.substr(1), this, hdl);
				continue;
			}

			if (args != null)
			{
				switch (name)
				{
					case 'keyup': case 'keydown':
						this.listen (name, selector, function (evt)
						{
							if (Rin.indexOf(args, evt.keyCode.toString()) != -1)
								return hdl (evt, args);

							evt.continuePropagation = true;
						});

						continue;
				}
			}

			this.listen (name, selector, hdl);
		}

		return this;
	},

	/**
	**	Executes the underlying event handler given an event and a selector. Called internally by listen().
	**
	**	>> void _eventHandler (event evt, string selector, function handler);
	*/
	_eventHandler: function (evt, selector, handler)
	{
		if (evt.continuePropagation === false)
			return;

		evt.continuePropagation = true;
		evt.source = evt.target;

		if (selector && selector instanceof HTMLElement)
		{
			if (evt.source === selector)
			{
				evt.continuePropagation = false;

				if (handler.call (this, evt, evt.detail) === true)
					evt.continuePropagation = true;
			}
		}
		else if (selector && selector != '*')
		{
			let elems = this.querySelectorAll(selector);

			while (evt.source !== this)
			{
				let i = Rin.indexOf (elems, evt.source, true);
				if (i !== -1)
				{
					evt.continuePropagation = false;

					if (handler.call (this, evt, evt.detail) === true)
						evt.continuePropagation = true;

					break;
				}
				else
				{
					evt.source = evt.source.parentElement;
				}
			}
		}
		else
		{
			evt.continuePropagation = false;

			if (handler.call (this, evt, evt.detail) === true)
				evt.continuePropagation = true;
		}

		if (evt.continuePropagation === false)
		{
			evt.preventDefault();
			evt.stopPropagation();
		}
	},

	/**
	**	Listens for an event on elements matching the specified selector, returns an object with a single method `remove` used
	**	to remove the listener when it is no longer needed.
	**
	**	>> object listen (string eventName, string selector, function handler);
	**	>> object listen (string eventName, function handler);
	*/
	listen: function (eventName, selector, handler)
	{
		let eventCatcher = false;
		let eventImmediate = false;

		if (Rin.typeOf(selector) == 'function')
		{
			handler = selector;
			selector = null;
		}

		if (eventName[eventName.length-1] == '!')
		{
			eventName = eventName.substr(0, eventName.length-1);
			eventCatcher = true;
		}

		if (eventName[0] == '!')
		{
			eventName = eventName.substr(1);
			eventImmediate = true;
		}

		let callback0 = null;
		let callback1 = null;
		let self = this;

		this.addEventListener (eventName, callback0 = (evt) =>
		{
			if (evt.continuePropagation === false)
				return;

			if (!evt.firstCapture)
			{
				evt.firstCapture = this;
				evt.firstCaptureCount = 0;
				evt.queue = [];
			}

			if (evt.firstCapture === this)
				evt.firstCaptureCount++;

			if (eventCatcher == true)
				evt.queue.push([this, selector, handler]);

			if (eventImmediate == true)
				this._eventHandler(evt, selector, handler);
		},
		true);

		this.addEventListener (eventName, callback1 = (evt) =>
		{
			if (evt.continuePropagation === false)
				return;

			if (eventCatcher != true && eventImmediate != true)
				this._eventHandler(evt, selector, handler);

			if (evt.firstCapture === this && evt.continuePropagation !== false)
			{
				if (--evt.firstCaptureCount == 0)
				{
					while (evt.queue.length)
					{
						let q = evt.queue.pop();
						q[0]._eventHandler(evt, q[1], q[2]);
					}

					evt.continuePropagation = false;
				}
			}
		},
		false);

		return {
			removed: false,
			remove: function() {
				if (this.removed) return;
				this.removed = true;
				self.removeEventListener(eventName, callback0, true);
				self.removeEventListener(eventName, callback1, false);
			}
		};
	},

	/**
	**	Creates X
	*/
	createEventObject: function(eventName, args, bubbles)
	{
		let evt;

		if (eventName == 'click')
			evt = new MouseEvent(eventName, { bubbles: bubbles, detail: args });
		else
			evt = new CustomEvent (eventName, { bubbles: bubbles, detail: args });

		return evt;
	},

	/**
	**	Dispatches a new event with the specified name and the given arguments.
	*/
	dispatch: function (eventName, args=null, bubbles=true)
	{
		this.dispatchEvent (this.createEventObject(eventName, args, bubbles));
	},

	/**
	**	Dispatches a new event on the specified element with the given name and arguments (uses `CustomEvent`).
	*/
	dispatchOn: function (elem, eventName, args=null, bubbles=true)
	{
		elem.dispatchEvent (this.createEventObject(eventName, args, bubbles));
	},

	/**
	**	Sets the innerHTML property of the element and runs some post set-content tasks.
	**
	**	>> void setInnerHTML (value);
	*/
	setInnerHTML: function (value)
	{
		if (this._mutationObserver === null)
		{
			let timeout = null;

			this._mutationHandler = () =>
			{
				if (this.childNodes.length == 0)
					return;

				let is_ready = true;

				this.querySelectorAll('[data-_custom]').forEach(i =>
				{
					let root = this.findCustomParent(i);
					if (root !== this) return;

					if (!i.isReady) is_ready = false;
				});

				if (!is_ready) return;

				if (timeout) clearTimeout(timeout);

				timeout = setTimeout(() =>
				{
					timeout = null;

					let is_ready = true;
					let list = [];

					this.querySelectorAll('[data-_custom]').forEach(i =>
					{
						let root = this.findCustomParent(i);
						if (root !== this) return;

						if (!i.isReady) is_ready = false;
						if (i.isReady != 2) list.push(i);
					});

					if (!is_ready) return;

					this._mutationHandler = null;

					this._mutationObserver.disconnect();
					this._mutationObserver = null;

					for (let i of list)
					{
						i.rready();
						i.isReady = 2;
					}

					this.collectWatchers();
				},
				50);
			};

			this._mutationObserver = new MutationObserver (this._mutationHandler);
			this._mutationObserver.observe(this, { attributes: false, childList: true, subtree: false });
		}

		this.innerHTML = value;
	},

	/**
	**	Collects all watchers (data-watch, data-visible, data-property), that depend on the model, should be invoked when the structure
	**	of the element changed (added/removed children). This is automatically called when the setInnerHTML method is called.
	**
	**	Note that for 3rd party libs that add children to this element (which could probably have a watcher) will possibly result in
	**	duplication of the added elements when compiling the innerHTML template. To prevent this add the 'pseudo' CSS class to any
	**	element that should not be added to the HTML template.
	**
	**	>> void collectWatchers ();
	*/
	collectWatchers: function ()
	{
		let self = this;
		let modified = false;
		let list;

		if (!this.isRoot) return;

		let _list_watch_length = this._list_watch.length;
		let _list_visible_length = this._list_visible.length;
		let _list_property_length = this._list_property.length;

		/* *** */
		list = this.querySelectorAll('[data-watch]');
		for (let i = 0; i < list.length; i++)
		{
			for (let j of list[i].querySelectorAll('.pseudo'))
				j.remove();

			list[i]._template = Template.compile(list[i].innerHTML);
			list[i]._watch = new RegExp('^(' + list[i].dataset.watch + ')$');
			list[i].innerHTML = '';

			list[i].removeAttribute('data-watch');
			this._list_watch.push(list[i]);
		}

		if ('selfWatch' in this.dataset)
		{
			for (let j of this.querySelectorAll('.pseudo'))
				j.remove();

			this._template = Template.compile(this.innerHTML);
			this._watch = new RegExp('^(' + this.dataset.selfWatch + ')$');
			this.innerHTML = '';

			this.removeAttribute('data-self-watch');
			this._list_watch.push(this);
		}

		/* *** */
		list = this.querySelectorAll('[data-visible]');
		for (let i = 0; i < list.length; i++)
		{
			list[i]._visible = Template.compile(list[i].dataset.visible);

			list[i].removeAttribute('data-visible');
			this._list_visible.push(list[i]);
		}

		if ('selfVisible' in this.dataset)
		{
			this._visible = Template.compile(this.dataset.selfVisible);

			this.removeAttribute('data-self-visible');
			this._list_visible.push(this);
		}

		/* *** */
		list = this.querySelectorAll('[data-property]');
		for (let i = 0; i < list.length; i++)
		{
			list[i].onchange = list[i].onblur = function()
			{
				switch (this.type)
				{
					case 'radio':
						if (this.checked) self.getModel().set(this.name, this.value);
						break;

					case 'checkbox':
						self.getModel().set(this.name, this.checked ? '1' : '0');
						break;

					case 'field':
						self.getModel().set(this.name, this.getValue());
						break;

					default:
						self.getModel().set(this.name, this.value);
						break;
				}
			};

			if (list[i].tagName == 'SELECT')
			{
				list[i].onmouseup = function()
				{
					self.getModel().set(this.name, this.value);
				};
			}

			list[i].name = list[i].dataset.property;

			list[i].removeAttribute('data-property');
			this._list_property.push(list[i]);
		}

		if ('selfProperty' in this.dataset)
		{
			this.onchange = this.onblur = function()
			{
				switch (this.type)
				{
					case 'radio':
						if (this.checked) self.getModel().set(this.name, this.value);
						break;

					case 'checkbox':
						self.getModel().set(this.name, this.checked ? '1' : '0');
						break;

					case 'field':
						self.getModel().set(this.name, this.getValue());
						break;

					default:
						self.getModel().set(this.name, this.value);
						break;
				}
			};

			if (this.tagName == 'SELECT')
			{
				this.onmouseup = function()
				{
					self.getModel().set(this.name, this.value);
				};
			}

			this.name = this.dataset.selfProperty;

			this.removeAttribute('data-self-property');
			this._list_property.push(this);
		}

		/* *** */
		this._list_watch = this._list_watch.filter(i => i.parentElement != null);
		if (_list_watch_length != this._list_watch.length) modified = true;

		this._list_visible = this._list_visible.filter(i => i.parentElement != null);
		if (_list_visible_length != this._list_visible.length) modified = true;

		this._list_property = this._list_property.filter(i => i.parentElement != null);
		if (_list_property_length != this._list_property.length) modified = true;

		if (this.model != null && modified)
			this.model.setNamespace(this.eid).update(true).setNamespace(null);
	},

	/**
	**	Executed when the element is created and yet not attached to the DOM tree.
	*/
	onCreated: function()
	{
	},

	/**
	**	Executed when the element is attached to the DOM tree.
	*/
	onConnected: function()
	{
	},

	/**
	**	Executed when the element is no longer a part of the DOM tree.
	*/
	onDisconnected: function()
	{
	},

	/**
	**	Executed on the root element when a child element has `data-ref` attribute and it was added to it.
	*/
	onRefAdded: function (name, element)
	{
	},

	/**
	**	Executed on the root element when a child element has `data-ref` attribute and it was removed from it.
	*/
	onRefRemoved: function (name, element)
	{
	},

	/**
	**	Event handler invoked when the model has changed, executed before onModelChanged() to update internal dependencies,
	**	should not be overriden or elements watching the model will not be updated.
	**
	**	>> void onModelPreChanged (evt, args);
	*/
	onModelPreChanged: function (evt, args)
	{
		let data = this.getModel().get();

		for (let i = 0; i < this._list_watch.length; i++)
		{
			for (let j of args.fields)
			{
				if (!this._list_watch[i]._watch.test(j))
					continue;

				this._list_watch[i].innerHTML = this._list_watch[i]._template(data);
				break;
			}
		}

		for (let i = 0; i < this._list_visible.length; i++)
		{
			if (this._list_visible[i]._visible(data, 'arg'))
				this._list_visible[i].style.removeProperty('display');
			else
				this._list_visible[i].style.display = 'none';
		}

		this.onModelChanged(evt, args);
	},

	/**
	**	Event handler invoked when the model has changed.
	*/
	onModelChanged: function (evt, args) // @override
	{
	},

	/**
	**	Event handler invoked when a property of the model is changing. Fields `name` and `value` can be found in the `args` object.
	*/
	onModelPropertyChanging: function (evt, args) // @override
	{
	},

	/**
	**	Event handler invoked when a property of the model has changed, executed before onModelPropertyChanged() to update internal
	**	dependencies. Automatically triggers internal events named `propertyChanged.<propertyName>` and `propertyChanged`.
	**	Should not be overriden or elements depending on the property will not be updated.
	*/
	onModelPropertyPreChanged: function (evt, args)
	{
		for (let i = 0; i < this._list_property.length; i++)
		{
			if (this._list_property[i].name == args.name)
			{
				let trigger = true;

				switch (this._list_property[i].type)
				{
					case 'radio':
						if (this._list_property[i].value != args.value)
						{
							this._list_property[i].parentElement.classList.remove('active');
							continue;
						}

						this._list_property[i].checked = true;
						this._list_property[i].parentElement.classList.add('active');
						break;

					case 'checkbox':
						if (~~args.value)
						{
							this._list_property[i].checked = true;
							this._list_property[i].parentElement.classList.add('active');
						}
						else
						{
							this._list_property[i].checked = false;
							this._list_property[i].parentElement.classList.remove('active');
						}

						break;

					case 'field':
						this._list_property[i].val = this._list_property[i].dataset.value = args.value;	
						this._list_property[i].setValue (args.value);
						trigger = false;
						break;

					default:
						this._list_property[i].value = args.value;
						this._list_property[i].val = this._list_property[i].dataset.value = args.value;	

						if (this._list_property[i].value != args.value)
							trigger = false;

						break;
				}

				if (trigger && this._list_property[i].onchange)
					this._list_property[i].onchange();
			}
		}

		this.dispatch ('propertyChanged.' + args.name, args, false);
		this.dispatch ('propertyChanged', args, false);

		this.onModelPropertyChanged(evt, args);
	},

	/**
	**	Event handler invoked when a property of the model has changed.
	*/
	onModelPropertyChanged: function (evt, args) // @override
	{
	},

	/**
	**	Event handler invoked when a property of the model is removed. Field `name` can be found in the `args` object.
	*/
	onModelPropertyRemoved: function (evt, args) // @override
	{
	},

	/*
	**	Runs the following preparation procedures on the specified prototype:
	**		- All functions named 'event <event-name> [event-selector]' will be moved to the 'events' map.
	**
	**	>> void preparePrototype (object proto);
	*/
	preparePrototype: function (proto)
	{
		if (proto.__prototypePrepared === true)
			return;

		proto.__prototypePrepared = true;

		if (!('events' in proto))
			proto.events = { };

		for (let i in proto)
		{
			if (i.startsWith('event '))
			{
				proto.events[i.substr(6)] = proto[i];
				delete proto[i];
			}
		}
	},

	/*
	**	Registers a new custom element with the specified name. Extra functionality can be added with one or more prototypes, by default
	**	all elements also get the `Element` prototype. Note that the final prototypes of all registered elements are stored, and if you want
	**	to inherit another element's prototype just provide its name (string) in the protos argument list.
	**
	**	>> class register (string name, ...(object|string) protos);
	*/
	register: function (name, ...protos)
	{
		const newElement = class extends HTMLElement
		{
			constructor()
			{
				super();
				this.invokeConstructor = true;

				this._super = { };

				for (let i of Object.entries(this.constructor.prototype._super))
				{
					this._super[i[0]] = { };

					for (let j of Object.entries(i[1])) {
						this._super[i[0]][j[0]] = j[1].bind(this);
					}
				}

				this.onCreated();
			}

			findRoot (srcElement)
			{
				let elem = srcElement ? srcElement : this.parentElement;

				while (elem != null)
				{
// if (this.dataset.ref) console.log(this.tagName + ' ' + this.dataset.ref + ' SEARCH ' + elem.tagName + ' , isRoot=' + elem.isRoot); //violet
					if ('isRoot' in elem && elem.isRoot == true)
						return elem;

					elem = elem.parentElement;
				}

				return null;
			}

			findCustomParent (srcElement)
			{
				let elem = srcElement ? srcElement.parentElement : this.parentElement;

				while (elem != null)
				{
					if (elem.dataset._custom == 'true')
						return elem;

					elem = elem.parentElement;
				}

				return null;
			}

			connectReference (root=null, flags=255)
			{
				if (!this.root && (flags & 1) == 1)
				{
					if (root == null) root = this.findRoot();
					if (root != null)
					{
						if (this.dataset.ref)
						{
//console.log('>> REF ' + this.dataset.ref + ' FOR ' + root.tagName);//violet
							root[this.dataset.ref] = this;
							root.refs[this.dataset.ref] = this;
						}

						delete this.dataset._pending;

						this.dataset._linked = 'true';
						this.root = root;
					}
					else
						this.dataset._pending = 'true';
				}

				//if (this.root && (flags & 2) == 2 && this.dataset.ref)
				//	this.root.onRefAdded (this.dataset.ref);
			}

			connectedCallback ()
			{
				this.connectReference(null, 1);

				if (this.invokeConstructor)
				{
					this.invokeConstructor = false;
					this.dataset._custom = 'true';

					this.__ctor();
				}

				this.connectReference(null, 2);
				this.onConnected();

				if (this.dataset.xref)
					globalThis[this.dataset.xref] = this;
			}

			disconnectedCallback()
			{
				if (this.root)
				{
					if (this.dataset.ref)
					{
						this.root.onRefRemoved (this.dataset.ref, this);

						delete this.root[this.dataset.ref];
						delete this.root.refs[this.dataset.ref];
					}

					delete this.dataset._pending;

					this.dataset._linked = 'false';
					this.root = null;
				}

				this.onDisconnected();

				if (this.dataset.xref)
					delete globalThis[this.dataset.xref];
			}
		};

		Rin.override (newElement.prototype, Element);

		const proto = { };
		const _super = { };
		const events = Rin.clone(Element.events);

		let __init = true;
		let __ready = true;
		let __rready = true;
		let __check;

		for (let i = 0; i < protos.length; i++)
		{
			if (!protos[i]) continue;

			if (Rin.typeOf(protos[i]) == 'string')
			{
				const name = protos[i];

				protos[i] = elementPrototypes[name];
				if (!protos[i]) continue;

				_super[name] = { };

				for (let f in protos[i])
				{
					if (Rin.typeOf(protos[i][f]) != 'function')
						continue;

					_super[name][f] = protos[i][f];
				}

				__init = false;
				__ready = false;
				__rready = false;
				__check = false;
			}
			else
			{
				Element.preparePrototype(protos[i]);
				__check = true;
			}

			if ('_super' in protos[i])
				Rin.override (_super, protos[i]._super);

			if ('events' in protos[i])
				Rin.override (events, protos[i].events);

			Rin.override (newElement.prototype, protos[i]);
			Rin.override (proto, protos[i]);

			if (__check)
			{
				if (!__init && 'init' in protos[i]) __init = true;
				if (!__ready && 'ready' in protos[i]) __ready = true;
				if (!__rready && 'rready' in protos[i]) __rready = true;
			}
		}

		let dummy = function(){};

		if (!__init)
		{
			newElement.prototype.init = dummy;
			proto.init = dummy;
		}

		if (!__ready)
		{
			newElement.prototype.ready = dummy;
			proto.ready = dummy;
		}

		if (!__rready)
		{
			newElement.prototype.rready = dummy;
			proto.rready = dummy;
		}

		newElement.prototype._super = _super;
		newElement.prototype.events = events;

		proto._super = _super;
		proto.events = events;

		customElements.define (name, newElement);

		elementPrototypes[name] = proto;
		elementClasses[name] = newElement;

		return newElement;
	},

	/*
	**	Expands an already created custom element with the specified prototype(s).
	**
	**	>> void expand (string elementName, ...object protos);
	*/
	expand: function (name, ...protos)
	{
		if (!(name in elementPrototypes))
			return;

		const self = elementPrototypes[name];
		const elem = elementClasses[name];

		const _super = self._super;
		const events = self.events;

		for (let proto of protos)
		{
			Element.preparePrototype(proto);

			if ('_super' in proto)
				Rin.override (_super, proto._super);

			if ('events' in proto)
				Rin.override (events, proto.events);

			Rin.override (elem.prototype, proto);
			Rin.override (self, proto);
		}

		elem.prototype._super = _super;
		elem.prototype.events = events;

		self._super = _super;
		self.events = events;
	},

	/*
	**	Appends a hook to a function of a custom element.
	*/
	hookAppend: function (name, functionName, newFunction)
	{
		if (!(name in elementPrototypes))
			return;

		let hook1 = Rin.hookAppend(elementPrototypes[name], functionName, newFunction);
		let hook2 = Rin.hookAppend(elementClasses[name].prototype, functionName, newFunction);

		return { 
			unhook: function() {
				hook1.unhook();
				hook2.unhook();
			}
		};
	},

	/*
	**	Prepends a hook to a function of a custom element.
	*/
	hookPrepend: function (name, functionName, newFunction)
	{
		if (!(name in elementPrototypes))
			return;

		let hook1 = Rin.hookPrepend(elementPrototypes[name], functionName, newFunction);
		let hook2 = Rin.hookPrepend(elementClasses[name].prototype, functionName, newFunction);

		return { 
			unhook: function() {
				hook1.unhook();
				hook2.unhook();
			}
		};
	},

	/**
	**	Built-in action handlers.
	*/

	/**
	**	:toggleClass <className> [<selector>]
	**
	**	Toggles a CSS class on the element.
	*/
	':toggleClass': function (args, evt)
	{
		let elem = evt.source;

		if ('2' in args)
			elem = document.querySelector(args[2]);

		if (!elem) return;

		if (elem.classList.contains(args[1]))
			elem.classList.remove(args[1]);
		else
			elem.classList.add(args[1]);
	},

	/**
	**	:setClass <className> [<selector>]
	**
	**	Sets a CSS class on the element.
	*/
	':setClass': function (args, evt)
	{
		let elem = evt.source;

		if ('2' in args)
			elem = document.querySelector(args[2]);

		if (!elem) return;

		elem.classList.add(args[1]);
	},

	/**
	**	:volatileClass <className> [<selector>]
	**
	**	Adds the CSS class to the element and any click outside will cause it to be removed.
	*/
	':volatileClass': function (args, evt)
	{
		let elem = evt.source;

		if ('2' in args)
			elem = document.querySelector(args[2]);

		if (!elem) return;

		elem.classList.add(args[1]);

		let fn = () => {
			window.removeEventListener('click', fn, true);
			elem.classList.remove(args[1]);
		};

		window.addEventListener('click', fn, true);
	},

	/**
	**	:toggleClassUnique <className> <parentSelector> <childSelector>
	**
	**	Toggles a CSS class on the element and only one element in the selected parent can have the class.
	*/
	':toggleClassUnique': function (args, evt)
	{
		let elem = evt.source;
		if (!elem) return;

		if (elem.classList.contains(args[1]))
		{
			elem.classList.remove(args[1]);
		}
		else
		{
			elem.querySelectorParent(args[2]).querySelectorAll(args[3]).forEach(elem => elem.classList.remove(args[1]));
			elem.classList.add(args[1]);
		}
	},

	/**
	**	:setClassUnique <className> <parentSelector> <childSelector>
	**
	**	Sets a CSS class on the element and only that element in the selected parent can have the class.
	*/
	':setClassUnique': function (args, evt)
	{
		let elem = evt.source;
		if (!elem) return;

		elem.querySelectorParent(args[2]).querySelectorAll(args[3]).forEach(elem => elem.classList.remove(args[1]));
		elem.classList.add(args[1]);
	}
};

Element.register('r-elem', {
});

/* ****************************************** */

/**
**	Finds the parent element given a selector.
*/
HTMLElement.prototype.querySelectorParent = function (selector)
{
	let elem = this;

	while (elem != null)
	{
		if (elem.matches(selector))
			break;

		elem = elem.parentElement;
	}

	return elem;
};

export default Element;
