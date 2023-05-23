
/**
 * Indicates if signal debugging is enabled. When so, every signal change will be logged to the console.
 */
export let debugSignals = false;

/**
 * Signal class.
 */
export class Signal
{
	#value;
	#defvalue;
	#listeners;
	#label;

	constructor (value, defvalue)
	{
		this.#value = value;
		this.#label = null;

		this.#defvalue = defvalue;
		this.#listeners = [];
	}

	get value() {
		return this.#value;
	}

	set value(val) {
		if (this.#value === val) return;
		this.#value = val;
		this.notify();
	}

	label (value=null)
	{
		if (value === null)
			return this.#label;
		this.#label = value;
		return this;
	}

	reset() {
		this.value = this.#defvalue;
	}

	connect (callback) {
		this.#listeners.push(callback);
	}

	notify()
	{
		if (debugSignals)
			console.log('CHANGED', this.#label, this.#listeners.length);

		for (let callback of this.#listeners)
			callback();
	}
};

/**
 * Creates a new signal object.
 * @param {*} value?
 * @param {*} defaultValue?
 * @returns {Signal}
 */
export function signal (value=null, defaultValue=null)
{
	return new Signal (value, defaultValue);
}

/**
 * Creates a new signal as an expression of the specified signals evaluated by the given function.
 * @param {Array<Signal|*>} signals 
 * @param {Function} evaluator 
 * @returns {Signal}
 */
export function expr (signals, evaluator)
{
	let active = [];
	let notified = false;

	for (let i = 0; i < signals.length; i++)
	{
		if (signals[i] instanceof Signal)
			active.push([i, signals[i]]);
	}

	if (!active.length)
		return evaluator(...signals);

	const sgn = signal();

	const update = function() {
		for (let i of active)
			signals[i[0]] = i[1].value;
		sgn.value = evaluator(...signals);
		notified = false;
	};

	const debouncer = function() {
		if (notified) return;
		notified = true;
		queueMicrotask(update);
	};

	for (let i of active)
		i[1].connect(debouncer);

	update();
	return sgn;
}

/**
 * Creates a new watcher, such that if any signal changes the evaluator will be run.
 * @param {Array<Signal|*>} signals 
 * @param {Function} evaluator 
 * @param {boolean} initialRun? Set to `false` to disable the initial run of the evaluator.
 */
export function watch (signals, evaluator, initialRun=true)
{
	let active = [];
	let notified = false;

	for (let i = 0; i < signals.length; i++)
	{
		if (signals[i] instanceof Signal)
			active.push([i, signals[i]]);
	}

	if (!active.length) {
		if (initialRun) evaluator(...signals);
		return;
	}

	const update = function() {
		for (let i of active)
			signals[i[0]] = i[1].value;
		evaluator(...signals);
		notified = false;
	};

	const debouncer = function() {
		if (notified) return;
		notified = true;
		queueMicrotask(update);
	};

	for (let i of active)
		i[1].connect(debouncer);

	if (initialRun) update();
}

/**
 * Helper functions used by the JSX transformer.
 */
export const helpers =
{
	/**
	 * Special object to tag dynamic attributes.
	 */
	DYNAMIC: { },

	/**
	 * Sets the value of a property inside an object.
	 * @param {Element|Text} root
	 * @param {string[]} path
	 * @param {number} lastIndex
	 * @param {object} value
	 */
	setValue: function (root, path, lastIndex, value)
	{
		// Object used to set `style` or `class` attribute.
		if (path.length === 1 && typeof(value) === 'object')
		{
			switch (path[0])
			{
				case 'style':
					for (let i in value)
						watch([i, value[i]], (i, value) => root.style[i] = value);
					return;

				case 'class':
				case 'className':
				case 'classList':
					if (value instanceof Array)
					{
						watch([value], (value) => {
							root.className = '';
							for (let i in value)
								root.classList.add(value[i]);
						});
					}
					else {
						for (let i in value)
							watch([i, value[i]], (i, value) => root.classList[value == true ? 'add' : 'remove'](i));
					}
					return;
			}
		}

		// Specific CSS class such as `class:hidden`.
		if (path.length === 2 && (path[0] === 'class' || path[0] === 'className' || path[0] === 'classList'))
		{
			watch([path[1], value], (i, value) => root.classList[value == true ? 'add' : 'remove'](i));
			return;
		}

		// Any other attribute/property.
		for (let i = 0; i < lastIndex && root; i++)
			root = root[path[i]];

		if (root)
			watch([path[lastIndex], value], (name, value) => root[name] = value);
	},

	/**
	 * Creates a setter for a specified path inside an object.
	 * @param {string[]} path 
	 * @returns {(root: Element|Text, value: object) => void}
	 */
	createSetter: function (path)
	{
		const n = path.length-1;

		return function (root, value) {
			helpers.setValue(root, path, n, value);
		};
	},

	/**
	 * Ensures the provided value is a node or a node-compatible (such as an array of nodes).
	 * @param {*} value
	 * @returns {Node|Array<Node>}
	 */
	ensureNode: function (value)
	{
		if (value instanceof Array) {
			for (let i = 0; i < value.length; i++)
				value[i] = helpers.ensureNode(value[i]);
			return value;
		}

		if (!(value instanceof Node))
			return document.createTextNode(value);

		return value;
	},

	/**
	 * Replaces the specified refNode by a newNode and returns the new reference node.
	 * @param {Node} parent
	 * @param {Node|Array<Node>} refNode
	 * @param {Node|Array<Node>} newNode
	 * @returns {Node|Array<Node>}
	 */
	replaceNode: function (parent, refNode, newNode, appendChild=false)
	{
		// When refNode is an array, remove all those nodes but leave just one for reference.
		if (refNode instanceof Array)
		{
			while (refNode.length > 1) {
				let tmp = refNode.shift();
				if (tmp.parentElement === parent)
					tmp.remove();
			}
			refNode = refNode.shift();
		}

		let newRefNode = newNode;
		let firstNode = newNode;

		// When newNode is an array, create a document fragment for faster append of all children.
		if (newNode instanceof Array)
		{
			let frag = document.createDocumentFragment();
			newRefNode = [];

			for (let i = 0; i < newNode.length; i++) {
				newRefNode.push(newNode[i]);
				frag.appendChild(newNode[i]);
			}

			firstNode = newNode[0];
			newNode = frag;
		}

		if (appendChild === false)
		{
			refNode.replaceWith(newNode);

			let tmpNode = document.createComment('');
			firstNode.parentElement.insertBefore(tmpNode, firstNode);

			if (!(newRefNode instanceof Array))
				newRefNode = [ newRefNode ];

			newRefNode.push(tmpNode);
		}
		else
			refNode.appendChild(newNode);

		return newRefNode;
	},

	/**
	 * Creates a DOM node replacer.
	 * @param {Element|Text|Array<Element|Text>} refNode
	 * @returns {(root: Element|Text, newNode: any) => void}
	 */
	createReplacer: function (refNode)
	{
		return function (root, newNode) {
			refNode = helpers.replaceNode(root, refNode, helpers.ensureNode(newNode));
		};
	},

	/**
	 * Creates a function that builds an element.
	 * @param {string} tagName - Tag of the element to create.
	 * @param {array} attributes - Array of name-value pairs. When dynamic attributes are present use the helpers.DYNAMIC as value placeholder.
	 * @param {Array<Element|Text|string|null>} children - When dynamic children are present use the placeholder `null`.
	 * @returns { (runtimeAttributeValues: Array<string>, runtimeChildren: Array<Element|Text|Array<Element|Text>>) => HTMLElement }
	 */
	create: function (tagName, attributes, children)
	{
		// Attach static attributes.
		let baseElement = document.createElement(tagName);
		let dynamicAttributes = [];

		for (let i = 0; i < attributes.length; i += 2)
		{
			let path = null;

			if (attributes[i].indexOf(':') !== -1)
				path = attributes[i].split(':');
			else
				path = [attributes[i]];

			if (attributes[i+1] !== helpers.DYNAMIC) {
				helpers.setValue(baseElement, path, path.length-1, attributes[i+1]);
				continue;
			}

			dynamicAttributes.push(helpers.createSetter(path));
		}

		// Attach static children.
		let dynamicChildrenIndices = [];
		let dynamicBuild = false;
		let firstBuild = true;

		// Get indices of dynamic children and detect if any child is a custom element.
		for (let i in children)
		{
			if (children[i].isCustom === true)
				dynamicBuild = true;

			if (children[i] === helpers.DYNAMIC)
				dynamicChildrenIndices.push(i);
		}

		// Create and return the element builder fuction.
		const N = dynamicAttributes.length;
		const M = dynamicChildrenIndices.length;

		return function (runtimeDynamicAttributes, runtimeChildren, spreadAttributes=null)
		{
			let elem = null;

			if (firstBuild || dynamicBuild)
			{
				let target = dynamicBuild ? baseElement.cloneNode(true) : baseElement;
				for (let i in children)
				{
					if (children[i] instanceof Array)
						throw new Error('Document fragments not fully supported!');
		
					helpers.replaceNode(target, target, helpers.ensureNode(children[i]), true);
				}

				if (dynamicBuild) elem = target;
				firstBuild = false;
			}

			if (elem === null)
				elem = baseElement.cloneNode(true);

			const dynamicChildren = dynamicChildrenIndices.map(idx => helpers.createReplacer(elem.childNodes[idx]));

			for (let i = 0; i < N; i++)
				dynamicAttributes[i](elem, runtimeDynamicAttributes[i]);

			for (let i = 0; i < M; i++)
				watch([runtimeChildren[i], i], (val, i) => dynamicChildren[i](elem, val));

			if (spreadAttributes !== null)
			{
				for (let attributes of spreadAttributes)
				{
					for (let i in attributes)
					{
						let path = null;

						if (i.indexOf(':') !== -1)
							path = i.split(':');
						else
							path = [i];

						helpers.setValue(elem, path, path.length-1, attributes[i]);
					}
				}
			}

			elem.isCustom = true;
			return elem;
		};
	}
};
