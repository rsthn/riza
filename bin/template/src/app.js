
import { Api, Model, Element } from 'riza';
import Workflow from './workflow.js';

import Dialog from './elems/dialog.js';
import CustomDialog from './elems/custom-dialog.js';

/**
 * 	The API end point is loaded from the active .env file.
 */
if (process.env.apiUrl)
	Api.setEndPoint (process.env.apiUrl);

/**
 * 	Allocate global variables.
 */
global.global = global;
global.context = new Model();

/**
 * 	Import message strings and make them available to the global scope (automatically used by r-form elements).
 */
import messages from './messages.js';
global.messages = messages;

/**
 * 	Global helper functions.
 */

global.getDiff = function (oldObject, newObject)
{
	let diffObject = { };

	for (let i in newObject)
	{
		if (i in oldObject)
		{
			if (oldObject[i] != newObject[i])
				diffObject[i] = newObject[i];
		}
		else
			diffObject[i] = newObject[i];
	}

	return diffObject;
};

global.str = function (value)
{
	return (value+'');
};

global.coalesce = function (...args)
{
	for (let i = 0; i < args.length; i++)
	{
		if (args[i] !== undefined && args[i] !== null)
			return args[i];
	}
};

global.wait = function (delay)
{
	return new Promise((resolve, reject) => {
		setTimeout(resolve, delay);
	});
};

global.mapify = function (data, field)
{
	let _data = { };

	for (let i = 0; i < data.length; i++)
		_data[data[i][field]] = data[i];

	return _data;
};

global.runAfter = function (delay, callback)
{
	setTimeout(callback, delay);
};

global.scrollToTop = function (elem)
{
	elem.scrollTo(0, 0);
};

global.continueTo = function (name, args, keepCurrent=false)
{
	return Workflow.continueTo(name, args, keepCurrent);
};

global.returnTo = function (name, args, keepCurrent=false)
{
	return Workflow.returnTo(name, args, keepCurrent);
};

global.popupInfo = function (text, options=null)
{
	let dialog = new CustomDialog();
	document.body.appendChild(dialog);

	dialog.setType('info');
	dialog.model.set('title', global.messages.info);
	dialog.model.set('text', text);

	dialog.model.set('buttons', [
		{ value: true, label: global.messages.ok, class: 'btn-primary px-4' },
	]);

	if (options)
		dialog.model.set(options);

	runAfter(0, () => dialog.show());

	global.lastDialog = dialog;
	return dialog.wait();
};

global.popupError = function (text, options=null)
{
	let dialog = new CustomDialog();
	document.body.appendChild(dialog);

	dialog.setType('error');
	dialog.model.set('title', global.messages.error);
	dialog.model.set('text', text);

	dialog.model.set('buttons', [
		{ value: true, label: global.messages.ok, class: 'btn-primary px-4' },
	]);

	if (options)
		dialog.model.set(options);

	runAfter(0, () => dialog.show());

	global.lastDialog = dialog;
	return dialog.wait();
};

global.popupConfirm = function (text, options=null)
{
	let dialog = new CustomDialog();
	document.body.appendChild(dialog);

	dialog.setType('confirm');
	dialog.model.set('title', global.messages.confirm);
	dialog.model.set('text', text);

	dialog.model.set('buttons', [
		{ value: true, label: global.messages.yes, class: 'btn-primary px-4' },
		{ value: false, label: global.messages.no }
	]);

	if (options)
		dialog.model.set(options);

	runAfter(0, () => dialog.show());

	global.lastDialog = dialog;
	return dialog.wait();
};


/**
 * 	App element.
 */

Element.register('r-app',
{
	/**
	 * 	Starts the app workflow.
	 */
	rready: function()
	{
		Workflow.start(this.querySelector('.app-container'));
	},

	/**
	 * 	Sets the `data-anim` property of the element to the value of `data-click-anim` when it is clicked, useful to control CSS-level animations.
	 */
	'event !click [data-click-anim]': function(evt)
	{
		if (evt.source.skip === true)
		{
			evt.source.skip = false;
			return true;
		}

		evt.source.dataset.anim = evt.source.dataset.clickAnim;
	},

	/**
	 * 	Clears the `data-anim` property of the element when the animationend event is detected. Useful to control CSS-level animations.
	 */
	'event animationend [data-click-anim]': function(evt)
	{
		evt.source.dataset.anim = '';
		evt.source.skip = true;

		this.dispatchOn (evt.source, 'click');
	},

	/**
	 * 	Continues to the specified workflow state.
	 */
	'continueTo': function(args)
	{
		Workflow.continueTo(args[1], [args[2], args[3], args[4]]);
	}
});
