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

    .is-hidden {
        display: none;
    }

    r-tabs [data-name].is-active {
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
     * Events.
     */
    'event click [data-name]': function (evt)
    {
        evt.continuePropagation = true;

        if (this.dataset.baseRoute) {
            location = "#" + Router.realLocation(this.dataset.baseRoute.replace('@', evt.source.dataset.name));
            return;
        }

        this.selectTab(evt.source.dataset.name);
    },

    /**
     * Initializes the element.
     */
    init: function()
    {
        this._routeHandler = (evt, args) =>
        {
            if (Router.location !== '')
            {
                let n = this.dataset.baseRoute.split('/').length;

                this.querySelectorAll("[href]").forEach(link =>
                {
                    if (!link.href) return;

                    if (Router.location.startsWith( link.href.substr(link.href.indexOf('#')+1).split('/').slice(0,n).join('/') )) {
                        link.classList.add('is-active');
                        link.classList.remove('is-inactive');
                    } else {
                        link.classList.add('is-inactive');
                        link.classList.remove('is-active');
                    }

                    link.classList.remove('anim-ended');
                    link.onanimationend = () => {
                        link.onanimationend = null;
                        link.classList.add('anim-ended');
                    };
                });
            }

            if (!args.route.changed)
                return;

            this.showTab(args.tabName);
        };
    },

    /**
     * Executed when the children of the element are ready.
     */
    ready: function()
    {
        if ("container" in this.dataset)
        {
            if (this.dataset.container === ':previousElement' || this.dataset.container === ':prev')
                this.container = this.previousElementSibling;
            else if (this.dataset.container === ':nextElement' || this.dataset.container === ':next')
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
     * Adds a handler to the router if the `data-base-route` attribute is set.
     */
    onConnected: function() {
        if (this.dataset.baseRoute)
            Router.addRoute (this.dataset.baseRoute.replace('@', ':tabName'), this._routeHandler);
    },

    /**
     * Removes a handler previously added to the router if the `data-base-route` attribute is set.
     */
    onDisconnected: function() {
        if (this.dataset.baseRoute)
            Router.removeRoute(this.dataset.baseRoute.replace('@', ':tabName'), this._routeHandler);
    },

    /**
     * Hides all tabs except the one with the specified name, if none specified then all tabs will be hidden (adds `.is-hidden` CSS class to the respective
     * tab container), additionally the respective link item in the tab definition will get class `.is-active` or `.is-inactive`.
     */
    _hideTabsExcept: function (exceptName)
    {
        if (!exceptName) exceptName = '';

        if (this.container != null)
        {
            this.container.querySelectorAll(':scope > [data-name]').forEach(i =>
            {
                if (i.dataset.name === exceptName) {
                    i.classList.remove('is-hidden');
                    this.dispatch('tabShown', { name: i.dataset.name, el: i });
                }
                else {
                    i.classList.add('is-hidden');
                    this.dispatch('tabHidden', { name: i.dataset.name, el: i });
                }
            });
        }

        this.querySelectorAll('[data-name]').forEach(link =>
        {
            if (link.dataset.name === exceptName) {
                link.classList.add('is-active');
                link.classList.remove('is-inactive');
            } else {
                link.classList.add('is-inactive');
                link.classList.remove('is-active');
            }

            link.classList.remove('anim-ended');
            link.onanimationend = () => {
                link.onanimationend = null;
                link.classList.add('anim-ended');
            };
        });

        this.activeTab = exceptName;
        this.dispatch('tabChanged', { name: exceptName, el: this });
    },

    /**
     * Shows the tab with the specified name, ignores `data-base-route` and current route as well.
     */
    showTab: function (name) {
        return this._hideTabsExcept(name);
    },

    /**
     * Shows a tab given its name. The route will be changed automatically if `data-base-route` is enabled.
     */
    selectTab: function (name)
    {
        if (this.dataset.baseRoute) {
            const hash = "#" + Router.realLocation(this.dataset.baseRoute.replace('@', name));
            if (location.hash != hash) {
                location = hash;
                return;
            }
        }

        this.showTab(name);
    }
});
