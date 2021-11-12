
import { Element } from 'riza';
import fs from 'fs';

import './password.css';

Element.register('r-password',
{
	init: function()
	{
		this.setInnerHTML(fs.readFileSync(__dirname + '/password.html'));
		this.type = 'field';
	},

	ready: function()
	{
		this.input = this.querySelector('input');
	},

	'event click .fa-eye': function() {
		this.input.type = 'text';
		this.querySelector('.fa-eye').style.display = 'none';
		this.querySelector('.fa-eye-slash').style.display = '';
	},

	'event click .fa-eye-slash': function() {
		this.input.type = 'password';
		this.querySelector('.fa-eye').style.display = '';
		this.querySelector('.fa-eye-slash').style.display = 'none';
	},

	getValue: function()
	{
		return this.input.value;
	},

	setValue: function(value)
	{
		this.input.value = value;
	}
});
