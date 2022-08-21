
import { List } from './utils.js';

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
}

/**
 */
function propagateQueue ()
{
	propagationMicroTask = false;

	signalsPropagating = true;

	while (propagationQueue.length) {
		propagate(propagationQueue.shift());
	}

	signalsPropagating = false;
}

/**
 */
function accessorHandler (signal, newValue)
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
	if (signal.value === newValue)
		return signal.accessor;

	signal.previousValue = signal.value;
	signal.value = newValue;

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
		isPropagating: false,
		wasQueued: false
	};

	data.accessor = (newValue=undefined) => {
		return accessorHandler (data, newValue);
	};

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
 * Replaces a node by the specified value returns the new node. If the value is a string it will be converted to a node first.
 * @param {Node} node
 * @param {Node|string} value
 * @returns {Node}
 */
export function replaceNode (node, value)
{
	if (!(value instanceof Node))
		value = document.createTextNode(value);

	node.replaceWith(value);
	return value;
}
