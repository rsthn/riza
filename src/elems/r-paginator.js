/*
	<r-paginator data-source="window.dataSource1" data-page-size="25">
		<span data-watch="count">Showing [offsetStart] to [offsetEnd] out of [count]</span>

		<button data-action="firstPage">First</button>
		<button data-action="prevPage">&laquo;</button>
		<button data-action="nextPage">&raquo;</button>
		<button data-action="lastPage">Last</button>
		<button data-action="refresh">Refresh</button>

		<input type="text" data-property="pageSize" />
	</r-paginator>
*/

import { Rinn } from 'rinn';
import Element from '../element.js';
import DataSource from '../data-source.js';

/*
**	Connects to a data source to provide pagination features.
*/

export default Element.register ('r-paginator',
{
	source: null,
	template: null,

	/**
	**	Initializes the element.
	*/
	init: function()
	{
		this.setModel({
			offsetStart: 0,
			offsetEnd: 0,
			count: 0, offset: 0,
			currentPageSize: this.dataset.pageSize || 25,
			pageSize: this.dataset.pageSize || 25
		});

		this.listen('propertyChanged.pageSize', (evt, args) =>
		{
			if (this.model.get('currentPageSize') == args.value)
				return;

			this.model.set('currentPageSize', args.value);
			this.updateOffset('range');
		});
	},

	/**
	**	Executed when the children of the element are ready.
	*/
	rready: function()
	{
		let source = this.getFieldByPath(this.dataset.source);
		if (!source) {
			if (this.dataset.source) console.error('data-source not found: ' + this.dataset.source);
			return;
		}

		this.setSource(source);
	},

	/**
	**	Sets the source model-list of the paginator.
	*/
	setSource: function (source)
	{
		if (!source || !Rinn.isInstanceOf(source, DataSource) || this.source === source)
			return;

		if (this.source != null)
		{
			this.source.removeEventListener (this.eid+':*');
			this.source.includeCount = false;
		}

		this.source = source;

		this.source.includeCount = true;
		this.updateOffset();

		this.source.addEventListener (this.eid+':requestPropertyChanged', this.onRequestPropertyChanged, this);
		this.source.addEventListener (this.eid+':countChanged', this.onCountChanged, this);
		this.source.addEventListener (this.eid+':listItemRemoved', this.onItemRemoved, this);
		this.source.addEventListener (this.eid+':listItemAdded', this.onItemAdded, this);

		this.source.setNamespace(this.eid);
		this.source.request.update(true);
		this.source.setNamespace(null);
	},

	/*
	**	Updates several offset related fields in the paginator model. Optionally refreshes the data source with the specified mode.
	*/
	updateOffset: function(mode=null)
	{
		this.model.set('offsetStart', this.model.get('count') != 0 ? this.model.get('offset') + 1 : 0);
		this.model.set('offsetEnd', Math.min(this.model.get('count'), this.model.get('offsetStart') + this.model.getInt('pageSize') - 1));
		this.model.update('count');

		let _count = this.source.request.get('count');
		let _offset = this.source.request.get('offset');

		this.source.request.set('count', this.model.getInt('pageSize'));
		this.source.request.set('offset', this.model.get('offset'));

		if (mode && (_count != this.source.request.get('count') || _offset != this.source.request.get('offset')))
			this.source.refresh(mode);
	},

	/*
	**	Event handler invoked when a property of the source request changes. The property is copied to the local model.
	*/
	onRequestPropertyChanged: function(evt, args)
	{
		if (args.name == 'count' || args.name == 'offset')
			return;

		this.model.set(args.name, args.value);
	},

	/*
	**	Event handler invoked when a property of the model has changed. The property is copied to the data source request model.
	*/
	onModelPropertyChanged: function (evt, args)
	{
		let ignored = [
			'offsetStart',
			'offsetEnd',
			'count',
			'offset',
			'currentPageSize',
			'pageSize'
		];

		if (ignored.indexOf(args.name) != -1)
			return;

		if (this.source.request.get(args.name) == args.value)
			return;

		this.source.request.set(args.name, args.value);
		this.source.refresh('filter');
	},

	/*
	**	Executed when the remote count changes.
	*/
	onCountChanged: function(evt, args)
	{
		this.model.set('count', evt.source.count, false);
		this.updateOffset();
	},

	/*
	**	Executed when an item is removed from the list.
	*/
	onItemRemoved: function(evt, args)
	{
		this.model.set('count', this.model.getInt('count') - 1, false);
		this.updateOffset();
	},

	/*
	**	Executed when an item is added to the list.
	*/
	onItemAdded: function(evt, args)
	{
		this.model.set('count', this.model.getInt('count') + 1, false);
		this.updateOffset();
	},

	/*
	**	Moves to the previous page.
	*/
	prevPage: function()
	{
		if (this.model.get('offset') <= 0)
			return;

		let offs = this.model.get('offset') - this.model.getInt('pageSize');
		if (offs < 0) offs = 0;

		this.model.set('offset', offs);
		this.updateOffset('range');
	},

	/*
	**	Moves to the next page.
	*/
	nextPage: function()
	{
		let offs = this.model.get('offset') + this.model.getInt('pageSize');
		if (offs >= this.model.get('count')) return;

		this.model.set('offset', offs);
		this.updateOffset('range');
	},

	/*
	**	Moves to the first page.
	*/
	firstPage: function()
	{
		this.model.set('offset', 0);
		this.updateOffset('range');
	},

	/*
	**	Moves to the last page.
	*/
	lastPage: function()
	{
		let offs = this.model.get('count') - this.model.getInt('pageSize');
		if (offs < 0) offs = 0;

		this.model.set('offset', offs);
		this.updateOffset('range');
	},

	/*
	**	Refreshes the data source.
	*/
	refresh: function()
	{
		this.source.refresh('full');
	},

	/*
	**	Clears (set to empty) the specified fields from the data source's request parameters.
	*/
	clear: function(args)
	{
		for (let i = 0; i < args.length; i++)
			this.model.set(args[i], '');
	}
});
