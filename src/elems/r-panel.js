/*
    <r-panel data-route="name">
    </r-panel>

    r-panel {
        display: block;
    }

    r-panel:not(.active) {
        display: none;
    }

    r-panel.inactive {
    }

    r-panel.active {
    }
*/

import Element from '../element.js';
import Router from '../router.js';

export default Element.register ('r-panel',
{
	/**
	 * Route object used by this element.
	 */
	route: null,

	/**
	 * Initializes the element.
	 */
	init: function()
	{
		this.style.display = '';

		// Executed then the panel route is activated.
		this._onActivate = (evt, args) =>
		{
			if (!args.route.changed)
				return;

			this.show(true);
		};

		// Executed then the panel route is deactivated.
		this._onDeactivate = (evt, args) =>
		{
			this.hide();
		};

		this.hide();
	},

	/**
	 * Adds a handler to Router if the data-route attribute was set.
	 */
	onConnected: function()
	{
		if (this.dataset.route)
		{
			this.route = Router.addRoute (this.dataset.route, this._onActivate, this._onDeactivate);
			this.classList.remove('active');
		}
		else
			this.classList.add('active');
	},

	/**
	 * Removes a handler previously added to Router if the data-route attribute was set.
	 */
	onDisconnected: function()
	{
		if (this.dataset.route)
			Router.removeRoute(this.dataset.route, this._onActivate, this._onDeactivate);
	},

	/**
	 * Hides the panel by removing the `active` and adding `inactive` class to the element. Fires `panelHidden` event.
	 */
	hide: function ()
	{
		this.classList.remove('active');
		this.classList.add('inactive');
		this.dispatch('panelHidden', this.route ? this.route.args : { });
	},

	/**
	 * Shows the panel visible by adding `active` and removing `inactive` class from the element. If `silent` is true and `data-route` enabled,
	 * the current route will not be updated. Fires `panelShown` event.
	 * @param {boolean} silent 
	 */
	show: function (silent=false)
	{
		if (this.dataset.route && !silent)
		{
			let hash = "#" + this.dataset.route;

			if (window.location.hash.substr(0, hash.length) != hash)
			{
				window.location = hash;
				return;
			}
		}

		this.classList.remove('inactive');
		this.classList.add('active');
		this.dispatch('panelShown', this.route ? this.route.args : { });
	}
});
