
import { List } from './utils-jsx';

/**
 */
let activeWatcher = null;
let signalsPropagating = false;

/**
 */
let propagationQueue = List.create();
let propagationMicroTask = false;

/**
 */
function propagate (signal)
{
	if (signal.isPropagating === true)
		return;

	signal.isPropagating = true;

	let currentWatchers = signal.watchers;
	signal.watchers = List.create();

	while (currentWatchers.length) {
		currentWatchers.shift()();
	}

	currentWatchers.free();

	signal.isPropagating = false;
	signal.wasQueued = false;
}

/**
 */
function propagateQueue ()
{
	signalsPropagating = true;

	while (propagationQueue.length) {
		propagate(propagationQueue.shift());
	}

	signalsPropagating = false;
	propagationMicroTask = false;
}

/**
 */
function accessorHandler (signal, newValue, forced)
{
	if (newValue === undefined)
	{
		if (activeWatcher !== null)
		{
			if (signal.watchers.find(activeWatcher) === null)
				signal.watchers.push(activeWatcher);
		}

		return signal.value;
	}

	// Do not trigger any propagation if the new value is the same as the current one.
	if (signal.value === newValue && forced === false)
		return signal.accessor;

	signal.previousValue = signal.value;
	signal.value = newValue;
	signal.accessor.value = newValue;

	if (signalsPropagating === true)
	{
		if (signal.isPropagating)
			return signal.accessor;

		if (signal.wasQueued === false)
		{
			propagationQueue.push(signal);
			signal.wasQueued = true;

			if (propagationMicroTask === false)
			{
				queueMicrotask(propagateQueue);
				propagationMicroTask = true;
			}
		}

		return signal.accessor;
	}

	signalsPropagating = true;
	propagate(signal);
	signalsPropagating = false;

	return signal.accessor;
}

/**
 * Creates a new signal.
 * @param {any} value?
 */
export function signal (value=null)
{
	const data = {
		watchers: List.create(),
		value: value,
		default: value,
		isPropagating: false,
		wasQueued: false
	};

	data.accessor = (newValue=undefined, forced=false) => {
		return accessorHandler (data, newValue, forced);
	};

	Object.assign(data.accessor, {
		get() {
			return data.value;
		},

		set(value) {
			data.value = value;
			return value;
		}
	});

	return data.accessor;
}

/**
 * Creates a new signal side effect.
 * @param {function} fn
 */
export function effect (fn, id=null)
{
	let previousWatcher = null;
	let active = false;

	const watcher = function()
	{
		if (active === true) return;
		active = true;

		previousWatcher = activeWatcher;
		activeWatcher = watcher;

		try {
			fn();
		}
		finally {
		}

		activeWatcher = previousWatcher;
		active = false;
	};

	watcher.id = id;
	watcher();

	return watcher;
}

/**
 * Creates a new variable.
 * @param {any} value?
 */
export function variable (value=null)
{
	let accessor = (newValue=undefined) =>
	{
		if (newValue === undefined)
			return accessor.value;

		accessor.value = newValue;
		return accessor;
	};

	accessor.value = value;
	return accessor;
}

/**
 * Helper functions.
 */
export const _helpers =
{
	/**
	 * Replaces a node by the specified value and returns a new node. If the value is a string it will be converted to a node first. And
	 * if the value is `null` the current node will be returned.
	 * @param {Node} node
	 * @param {Node|string|null|Array<Node|string>} value
	 * @param {string} placeholder
	 * @returns {Node}
	 */
	replaceNode: function (node, value, placeholder)
	{
		let result = value;

		if (node instanceof Array)
		{
			if (value instanceof Array)
			{
				// Clear children.
				if (value.length == 0)
				{
					while (node.length > 1)
						node.pop().remove();

					value = document.createElement(placeholder);
					node[0].replaceWith(value);
					return value;
				}

				let parent = node[0].parentElement;
				let ref = parent.lastChild;

				if (ref === null || ref !== value[value.length-1])
				{
					//console.log('CHANGING BOTTOM');
					ref = value[value.length-1];
					parent.appendChild(ref);
				}

				for (let i of node)
					i._marked = false;

				ref._marked = true;
				let n = 0;

				for (let i = value.length-2; i >= 0; i--)
				{
					value[i]._marked = true;

					if (value[i].nextSibling === value[i+1])
						continue;

					parent.insertBefore(value[i], value[i+1]);
					n++;
				}

				//console.log('MOVED ', n);
				n = 0;

				for (let i of node)
				{
					if (i._marked === true)
						continue;

					i.remove();
					n++;
				}

				//console.log('REMOVED ', n);
				return [...value];
			}

			while (node.length > 1)
				node.pop().remove();

			node = node.length ? node[0] : null;
		}

		if (value === null || value === undefined)
			result = value = document.createElement(placeholder);

		if (value instanceof Array)
		{
			let elem = document.createDocumentFragment();
			result = [];

			for (let i of value)
			{
				if (!(i instanceof Node))
				{
					if (i instanceof Array)
					{
						let t = document.createElement('div');
						t.innerHTML = i[0];
						i = t.children[0];
					}
					else
						i = document.createTextNode(i);
				}

				result.push(i);
				elem.appendChild(i);
			}

			value = elem;

			if (result.length == 0)
				result = value = document.createElement(placeholder);
		}
		else
		{
			if (!(value instanceof Node))
				result = value = document.createTextNode(value);
		}

		if (node === null)
			return result;

		node.replaceWith(value);
		return result;
	},

	/**
	 * Spreads the given attributes on the node.
	 * @param {Node} node
	 * @param {object} data 
	 */
	spreadAttributes (node, data)
	{
		for (let i in data)
			this.setAttribute(node, i, data[i]);
	},

	/**
	 * Sets an attribute of a node.
	 * @param {Node} node
	 * @param {string} name
	 * @param {string|Array|object} data
	 */
	setAttribute (node, name, data)
	{
		if (data instanceof Array)
		{
			if (name === 'class' || name === 'className')
				node.className = data.join(' ');
			else
				node[name] = data;
		}
		else
		{
			if (name === 'style' && typeof data !== 'string')
			{
				Object.assign(node.style, data);
			}
			else if (name.startsWith('data-'))
			{
				node.dataset[name.substring(5)] = data;
			}
			else if (name.startsWith('on'))
			{
				node[name.toLowerCase()] = data;
			}
			else
			{
				if (!(name in node))
					node.setAttribute(name, data);
				else
					node[name] = data;
			}
		}
	},

	/**
	 * Deep clones a node or an array of nodes.
	 * @param {Node|Array<Node>} node
	 */
	clone (node)
	{
		if (node instanceof Array)
			return node.map(i => i.cloneNode(true));

		return node.cloneNode(true);
	}
};
