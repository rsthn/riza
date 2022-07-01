
import { Element } from 'riza';
import fs from 'fs';

Element.register('r-home',
{
	contents: fs.readFileSync(__dirname + '/home.html'),
	model: { },

	init: function()
	{
		this.addClass('fill-parent d-flex flex-column');
		this.dataset.anim = this.args.anim || 'fade-in';

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
