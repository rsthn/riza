
import { Element } from 'riza';

export default Element.register('custom-dialog',
{
	model: {
		title: 'Title',
		text: '',
		buttons: [
			{ value: 'ok', label: 'Ok' }
		]
	},

	resolve: null,

	init: function()
	{
		this.setInnerHTML(`
		<r-dialog class="bottom">
			<b data-watch="title">[!title]</b>

			<div>
				<div class="mb-4" data-watch="text">[!text]</div>

				<div class="buttons text-end" data-watch="buttons">
					[each i [buttons] [@
						<span class="btn btn-sm px-3 ms-1 [? [i.class] [i.class] btn-secondary]" data-action="action" data-index="[i#]">[i.label]</span>
					]]
				</div>
			</div>
		</r-dialog>
		`);
	},

	ready: function()
	{
		this.querySelector('r-dialog').cancel = this.cancel.bind(this);
	},

	setType: function (type)
	{
		this.querySelector('r-dialog').classList.add(type);
	},

	show: function()
	{
		this.querySelector('r-dialog').show();

		this.oldBack = global.back;
		global.back = () => this.cancel();
	},

	hide: function(callback)
	{
		if (this.oldBack) {
			global.back = this.oldBack;
			this.oldBack = null;
		}

		this.querySelector('r-dialog').hide(callback);
	},

	destroy: function(value)
	{
		this.hide(() => {
			this.remove();

			if (this.resolve)
				this.resolve(value);
		});
	},

	cancel: function()
	{
		this.destroy(null);
	},

	action: function (args)
	{
		this.destroy(this.model.data.buttons[args.index].value);
	},

	wait: function()
	{
		return new Promise ((resolve, reject) => {
			this.resolve = resolve;
		});
	}
});
