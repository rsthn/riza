
import { Element } from 'riza';
import fs from 'fs';

Element.register('r-splash',
{
	init: function()
	{
		this.addClass('text-center vertical-center');

		this.setInnerHTML(fs.readFileSync(__dirname + '/splash.html'));

		runAfter(500, () => {
			this.dataset.anim = 'fade-out';
			continueTo ('home', { anim: 'fade-in' });
		});
	}
});
