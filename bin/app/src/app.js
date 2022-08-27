
import './global';

import { Element, Router } from 'riza';
import workflow from './workflow';
import utils from './utils';

/**
 * Root element.
 */
Element.register('r-app',
{
	/**
	 * Starts the app.
	 */
	rready: function()
	{
		this.setModel(EventBus);
		EventBus.trigger('appLoaded');

		workflow.init(this.querySelector('.app-container'));
		utils.runAfter(100, () => Router.refresh());
	},

	/**
	 * Sets the `data-anim` property of the element to the value of `data-click-anim` when it is clicked, useful to control CSS-level animations.
	 */
	'event !click [data-click-anim]': function (evt)
	{
		if (evt.source.skipAnimation === true)
		{
			evt.source.skipAnimation = false;
			return true;
		}

		evt.source.dataset.anim = evt.source.dataset.clickAnim;
	},

	/**
	 * Clears the `data-anim` property of the element when the animationend event is detected and continues the usual click event.
	 */
	'event animationend [data-click-anim]': function (evt)
	{
		evt.source.dataset.anim = '';
		evt.source.skipAnimation = true;

		this.dispatchOn (evt.source, 'click');
	},

	/**
	 * Detects clicks on data-trigger elements and triggers the respective event.
	 */
	'event click [data-trigger]': function (evt)
	{
		EventBus.trigger(evt.source.dataset.trigger, evt.source.dataset);
	},

	/**
	 * Detects formSuccess events and triggers an event of the form `formSuccess|elementReference`.
	 */
	'event formSuccess': function (evt, result)
	{
		if (evt.source.dataset.ref)
			EventBus.trigger('formSuccess|'+evt.source.dataset.ref, result);
	},

	/**
	 * Detects formError events and triggers an event of the form `formError|elementReference`.
	 */
	'event formError': function (evt, result)
	{
		if (evt.source.dataset.ref)
			EventBus.trigger('formError|'+evt.source.dataset.ref, result);
	}
});
