/*
	<r-tabs data-container="div.tab-container" data-base-route="@" data-initial="tab1">
		<a data-name="tab1">Tab-1</a>
		<a data-name="tab2">Tab-2</a>
		<a data-name="tab3">Tab-3</a>
	</r-tabs>

	<div class="tab-container">
		<div data-name="tab1">
			This is tab-1.
		</div>

		<div data-name="tab2">
			This is tab-2.
		</div>

		<div data-name="tab3">
			This is tab-3.
		</div>
	</div>

	.x-hidden {
		display: none;
	}

	r-tabs [data-name].active {
		font-weight: bold;
	}
*/

import Element from '../element.js';
import Router from '../router.js';

export default Element.register ('r-tabs',
{
	/**
	 * Container element for tab content.
	 */
	container: null,

	/**
	 * Active tab name.
	 */
	activeTab: null,

	/**
	**	Element events.
	*/
	'event click [data-name]': function (evt)
	{
		evt.continuePropagation = true;

		if (this.dataset.baseRoute)
		{
			location = "#" + Router.realLocation(this.dataset.baseRoute.replace('@', evt.source.dataset.name));
			return;
		}

		this.selectTab (evt.source.dataset.name);
	},

	/**
	**	Initializes the Tabs element.
	*/
	init: function()
	{
		this._routeHandler = (evt, args) =>
		{
			if (Router.location != '')
			{
				this.querySelectorAll("[href]").forEach(link =>
				{
					if (!link.href) return;

					if (Router.location.startsWith(link.href.substr(link.href.indexOf('#')+1))) {
						link.classList.add('active');
						link.classList.add('is-active');
					}
					else {
						link.classList.remove('active');
						link.classList.remove('is-active');
					}
				});
			}

			if (!args.route.changed)
				return;

			this.showTab (args.tabName);
		};
	},

	/**
	**	Executed when the children of the element are ready.
	*/
	ready: function()
	{
		if ("container" in this.dataset)
		{
			if (this.dataset.container == ':previousElement')
				this.container = this.previousElementSibling;
			else if (this.dataset.container == ':nextElement')
				this.container = this.nextElementSibling;
			else if (this.dataset.container == ':none')
				this.container = null;
			else
				this.container = document.querySelector(this.dataset.container);
		}
		else
			this.container = this.nextElementSibling;

		this._hideTabsExcept(this.dataset.initial);
	},

	/**
	**	Adds a handler to Router if the data-base-route attribute was set.
	*/
	onConnected: function()
	{
		if (this.dataset.baseRoute)
			Router.addRoute (this.dataset.baseRoute.replace('@', ':tabName'), this._routeHandler);
	},

	/**
	**	Removes a handler previously added to Router if the data-base-route attribute was set.
	*/
	onDisconnected: function()
	{
		if (this.dataset.baseRoute)
			Router.removeRoute(this.dataset.baseRoute.replace('@', ':tabName'), this._routeHandler);
	},

	/**
	**	Hides all tabs except the one with the specified exceptName, if none specified then all tabs will be hidden (adds `.x-hidden` CSS class),
	**	additionally the respective link item in the tab definition will have class `.active` and `.is-active`.
	*/
	_hideTabsExcept: function (exceptName)
	{
		if (!exceptName) exceptName = '';

		if (this.container != null)
		{
			this.container.querySelectorAll(':scope > [data-name]').forEach(i =>
			{
				if (i.dataset.name == exceptName)
				{
					i.classList.remove('x-hidden');
					this.dispatch('tabShown', { name: i.dataset.name, el: i });
				}
				else
				{
					i.classList.add('x-hidden');
					this.dispatch('tabHidden', { name: i.dataset.name, el: i });
				}
			});
		}

		this.querySelectorAll("[data-name]").forEach(link =>
		{
			if (link.dataset.name == exceptName) {
				link.classList.add('active');
				link.classList.add('is-active');
			} else {
				link.classList.remove('active');
				link.classList.remove('is-active');
			}
		});

		this.activeTab = exceptName;
		this.dispatch('tabChanged', { name: exceptName, el: this });
	},

	/**
	**	Shows the tab with the specified name, ignores `data-base-route` and current route as well.
	*/
	showTab: function (name)
	{
		return this._hideTabsExcept (name);
	},

	/**
	**	Shows a tab given its name. The route will be changed automatically if `data-base-route` is enabled.
	*/
	selectTab: function (name)
	{
		if (this.dataset.baseRoute)
		{
			const hash = "#" + Router.realLocation(this.dataset.baseRoute.replace('@', name));

			if (location.hash != hash)
			{
				location = hash;
				return;
			}
		}

		this.showTab (name);
	}
});
