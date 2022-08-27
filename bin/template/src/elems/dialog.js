
import { Element } from 'riza';

import './dialog.css';

export default Element.register('r-dialog',
{
	isRoot: false,
	modal: false,

	init: function()
	{
		let div = document.createElement('div');

		while (this.children.length > 0)
			div.append(this.children[0]);

		this.appendChild(div);
	},

	show: function (modal=false)
	{
		this.addClass('active');
		this.modal = modal;

		this.oldBack = global.back;
		global.back = this.back.bind(this);

		return this;
	},

	hide: function (callback=null)
	{
		this.removeClass('active');
		global.back = this.oldBack;

		if (callback !== null)
			setTimeout (callback, 250);
	},

	cancel: function()
	{
		return true;
	},

	isVisible: function()
	{
		return this.classList.contains('active');
	},

	back: function()
	{
		if (this.modal)
			return;

		if (this.cancel() === true)
			this.hide();
	},

	'event click &this': function()
	{
		this.back();
	}
});
