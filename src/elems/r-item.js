/*
	<r-item data-model="window.model1">
	</r-item>
*/

import Element from '../element.js';

export default Element.register ('r-item',
{
	/**
	**	Initializes the element.
	*/
	init: function()
	{
	},

	/**
	**	Executed when the children and root are ready.
	*/
	rready: function()
	{
		let model = this.getFieldByPath(this.dataset.model);
		if (!model) model = { };

		this.setModel (model);
	}
});
