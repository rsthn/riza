
/**
 * Manages and defines the application workflow states.
 */

import { INITIAL } from './dependencies';
import utils from './utils';

/**
 * Root element.
 */
let root = null;

/**
 * Workflow state change lock flag.
 */
let _locked = false;

/**
 * Current workflow state.
 */
let state = null;

/**
 * Active element.
 */
let activeElement = null;

/**
 * Current arguments.
 */
let args = null;

/**
 * Sets the root element and initializes the contents to the initial workflow state.
 * @param {Element} rootElement
 */
function init (rootElement)
{
	state = INITIAL;
	root = rootElement;

	update();
}

/**
 * Sets the contents of the root element to "<r-X></r-X>" where "X" is the current workflow state value.
 * @param {boolean} keepActive - Indicates if the active element should be maintained inside the root element.
 * @returns {Element} - Previously active element.
 */
function update (keepActive=false)
{
	let activeElem = activeElement;
	if (activeElem !== null && !keepActive)
	{
		utils.runAfter(1000, () => {
			activeElem.remove();
		});
	}

	activeElement = document.createElement('r-' + state);
	activeElement.args = { ...args };
	root.appendChild(activeElement);

	if ('created' in activeElement)
		activeElement.created();

	return activeElem;
}

/**
 * Restores the element r-X where X is the current workflow state value.
 * @param {boolean} keepActive - Indicates if the active element should be maintained inside the root element.
 * @returns {Element} - Previously active element.
 */
function restore (keepActive=false)
{
	let activeElem = activeElement;
	if (activeElem !== null && !keepActive)
	{
		utils.runAfter(1000, () => {
			activeElem.remove();
		});
	}

	activeElement = root.querySelector('r-' + state);
	if (activeElement)
	{
		activeElement.args = { ...activeElement.args, ...args };

		if ('restored' in activeElement)
			activeElement.restored();
	}
	else
	{
		activeElement = document.createElement('r-' + state);
		activeElement.args = { ...args };
		root.appendChild(activeElement);
	
		if ('created' in activeElement)
			activeElement.created();
	}

	return activeElem;
}

/**
 * Sets or returns the workflow lock flag. When the workflow is locked, no state change will be allowed.
 * @param {boolean} [value]
 * @returns {boolean|void}
 */
function locked (value=null)
{
	if (value === null)
		return _locked;

	_locked = value;
}

/**
 * Continues to the specified state.
 * @param {string} newState
 * @param {object} [newArgs]
 * @param {boolean} [keepActive]
 * @returns {Element|null}
 */
function continueTo (newState, newArgs=null, keepActive=false)
{
	if (_locked) return null;

	state = newState;
	args = newArgs || { };

	return update(keepActive);
}

/**
 * Returns to a previous state (must have had called `continueTo` with `keepActive` set to `true`).
 * @param {string} newState
 * @param {object} [newArgs]
 * @param {boolean} [keepActive]
 * @returns {Element|null}
 */
function returnTo (newState, newArgs=null, keepActive=false)
{
	if (_locked) return null;

	state = newState;
	args = newArgs || { };

	return restore(keepActive);
}

/**
 * Detect `continueTo` event.
 */
EventBus.watch('continueTo', (value) => {
	continueTo(value.state, value, value.keepActive ?? false);
});

/**
 * Detect `returnTo` event.
 */
EventBus.watch('returnTo', (value) => {
	returnTo(value.state, value, value.keepActive ?? false);
});

export default
{
	init,
	locked,
	continueTo,
	returnTo
};
