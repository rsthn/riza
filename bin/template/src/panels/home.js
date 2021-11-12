
import { Element } from 'riza';
import fs from 'fs';

Element.register('r-home',
{
	model: { },

	init: function()
	{
		this.addClass('fill-parent d-flex flex-column');
		this.dataset.anim = 'fade-in';

		this.setInnerHTML(fs.readFileSync(__dirname + '/home.html'));
		this.refresh();
	},

	ready: function()
	{
		setInterval(() => this.refresh(), 1000);
	},

	refresh: function()
	{
		this.model.set('value', (new Date()).toLocaleTimeString());
	}
});
