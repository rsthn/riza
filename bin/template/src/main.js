
import { Element } from 'riza';

Element.register('r-app',
{
	init: function() {
		this.setInnerHTML(`
			Hello World
		`);
	}
});
