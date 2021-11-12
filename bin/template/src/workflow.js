
/**
 * 	Import all workflow elements.
 */
import { INITIAL } from './dependencies.js';

/**
 * 	Manages and defines the application workflow states.
 */
const Workflow =
{
	/**
	 * 	Root element.
	 */
	root: null,

	/**
	 * 	Workflow state change lock flag.
	 */
	_locked: false,

	/**
	 * 	Current workflow state.
	 */
	currentState: null,

	/**
	 * 	Current element.
	 */
	currentElement: null,

	/**
	 * 	Current arguments.
	 */
	args: null,

	/**
	 * 	Sets the root element and initializes the contents to the initial workflow state.
	 *
	 * 	@param {Element} root - Root HTML element where the panel contents will be set.
	 */
	start: function (root)
	{
		this.currentState = INITIAL;
		this.root = root;

		this.update();
	},

	/**
	 * 	Sets the contents of the root element to "<r-X></r-X>" where "X" is the current state value.
	 *
	 * 	@param {boolean} keepCurrent
	 * 	@param {boolean} restoreCurrent
	 * 	@returns {Element}
	 */
	update: function (keepCurrent=false, restoreCurrent=false)
	{
		let currentElement = this.currentElement;

		if (currentElement !== null && !keepCurrent)
		{
			runAfter(1000, () => {
				currentElement.remove();
			});
		}

		if (restoreCurrent)
		{
			this.currentElement = this.root.querySelector('r-' + this.currentState);
			if (this.currentElement)
			{
				this.currentElement.args = { ...this.currentElement.args, ...this.args };

				if ('restored' in this.currentElement)
					this.currentElement.restored(false);

				return currentElement;
			}
		}

		this.currentElement = document.createElement('r-' + this.currentState);
		this.currentElement.args = { ...this.args };
		this.root.appendChild(this.currentElement);

		if ('restored' in this.currentElement)
			this.currentElement.restored(true);

		return currentElement;
	},

	/**
	 * 	Sets the workflow lock flag. When the workflow is locked, no state change will be allowed.
	 *
	 * 	@param {boolean} value
	 * 	@returns {Workflow}
	 */
	locked: function (value=null)
	{
		if (value === null)
			return this._locked;

		this._locked = value;
		return this;
	},

	/**
	 * 	Continues to the specified state.
	 *
	 * 	@param {string} state 
	 * 	@param {any} args
	 * 	@param {boolean} keepCurrent
	 *
	 * 	@returns {Element|null}
	 */
	continueTo: function (state, args=null, keepCurrent=false)
	{
		if (this._locked)
			return null;

		this.currentState = state;
		this.args = args || { };

		return this.update(keepCurrent);
	},

	/**
	 * 	Returns to a previous state (must have called continueTo before with `keepCurrent` set to `true`).
	 *
	 * 	@param {string} state 
	 * 	@param {any} args
	 * 	@param {boolean} keepCurrent
	 *
	 * 	@returns {Element|null}
	 */
	returnTo: function (state, args=null, keepCurrent=false)
	{
		if (this._locked)
			return null;

		this.currentState = state;
		this.args = args || { };

		return this.update(keepCurrent, true);
	}

};

export default Workflow;
