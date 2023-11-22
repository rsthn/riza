
import { Element } from 'riza';
import fs from 'fs';
import utils from '../utils';
import workflow from '../workflow';

Element.register('r-splash',
{
	contents: fs.readFileSync(__dirname + '/splash.html'),

	init: function()
	{
		this.addClass('text-center vertical-center');

		utils.runAfter(500, () =>
		{
			this.dataset.anim = 'fade-out';
			workflow.continueTo('home');
		});
	}
});
