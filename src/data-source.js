
import { Model, ModelList, EventDispatcher } from 'rinn';
import Api from './api.js';

/*
**	Provides several methods to quickly interface with a remote data-source as defined by Wind.
*/

export default EventDispatcher.extend
({
	className: 'DataSource',
	debounceDelay: 250,

	request: null,

	includeCount: false,
	includeEnum: false,
	includeList: true,

	eid: null,
	count: 0,
	list: null,
	enum: null,

	/*
	**	Constructs the data source with the specified optional `config` parameters, any of the properties of this object can be specified
	**	in the config. Uses the given basePath as prefix for the `f` parameter for subsequent API operations, a basePath of `candies` will
	**	result in calls to `candies.list`, `candies.count`, etc.
	*/
	__ctor: function (basePath, config)
	{
		this._super.EventDispatcher.__ctor();

		this.basePath = basePath;

		if (config) Object.assign(this, config);

		this.request = new Model(this.request);

		this.eid = Math.random().toString().substr(2);
		this.count = 0;

		this.list = new ModelList();
		this.list.dataSource = this;

		this.enum = new ModelList();
		this.enum.dataSource = this;

		this.request.addEventListener (this.eid+':propertyChanged', this.forwardRequestEvent, this);

		this.list.addEventListener (this.eid+':itemsCleared', this.forwardListEvent, this);
		this.list.addEventListener (this.eid+':itemsChanged', this.forwardListEvent, this);
		this.list.addEventListener (this.eid+':itemRemoved', this.forwardListEvent, this);
		this.list.addEventListener (this.eid+':itemChanged', this.forwardListEvent, this);
		this.list.addEventListener (this.eid+':itemAdded', this.forwardListEvent, this);

		this.enum.addEventListener (this.eid+':itemsCleared', this.forwardEnumEvent, this);
		this.enum.addEventListener (this.eid+':itemsChanged', this.forwardEnumEvent, this);
		this.enum.addEventListener (this.eid+':itemRemoved', this.forwardEnumEvent, this);
		this.enum.addEventListener (this.eid+':itemChanged', this.forwardEnumEvent, this);
		this.enum.addEventListener (this.eid+':itemAdded', this.forwardEnumEvent, this);
	},

	forwardRequestEvent: function (evt, args)
	{
		this.prepareEvent('request' + evt.name[0].toUpperCase() + evt.name.substr(1), args).setSource(evt.source).resume();
	},

	forwardListEvent: function (evt, args)
	{
		this.prepareEvent('list' + evt.name[0].toUpperCase() + evt.name.substr(1), args).setSource(evt.source).resume();
	},

	forwardEnumEvent: function (evt, args)
	{
		this.prepareEvent('enum' + evt.name[0].toUpperCase() + evt.name.substr(1), args).setSource(evt.source).resume();
	},

	/*
	**	Executes one or more API functions (depending on `includeCount`, `includeEnum` and `includeList` properties) to retrieve the
	**	required data (uses debounce to prevent too-quick refreshes).
	**
	**	Refresh mode can be: order, filter, range, enum or full. Setting `mode` to `true` will cause a full refresh without debouncing.
	*/
	refresh: function (mode='full', callback=null)
	{
		if (typeof(mode) == 'function') {
			callback = mode;
			mode = 'full';
		}

		if (this._timeout) {
			clearTimeout(this._timeout);
			this._timeout = null;
		}

		const fn = () =>
		{
			this._timeout = null;

			Api.packageBegin();

			if (this.includeCount && (mode === 'full' || mode === 'filter')) this.fetchCount();
			if (this.includeEnum && (mode === 'full' || mode === 'enum')) this.fetchEnum();
			if (this.includeList && mode !== 'enum') this.fetchList();

			Api.packageEnd(callback);
		};

		if (mode === true) {
			mode = 'full';
			fn();
		}
		else
			this._timeout = setTimeout(fn, this.debounceDelay);
	},

	/*
	**	Searches for the item in `list` that matches the specified `fields` and sends it to the callback. If no item is found (or if `forced` is true),
	**	a call to API function `.get` will be executed with the fields as request parameters. Returns a promise.
	*/
	fetch: function (fields, forced=false)
	{
		return new Promise((resolve, reject) =>
		{
			let item = forced == true ? null : this.list.find(fields, true);
			if (!item)
			{
				this.fetchOne(fields, (r) =>
				{
					if (r && r.response == 200)
					{
						if (r.data.length > 0)
							resolve(r.data[0]);
						else
							reject(r);
					}
					else
						reject(r);
				});
			}
			else
				resolve(item.get());
		});
	},

	/*
	**	Removes an item from the remote data source by executing the `.delete` API function, passes the given `fields` as request
	**	parameters. Returns a promise.
	*/
	delete: function (params)
	{
		return new Promise((resolve, reject) =>
		{
			this.fetchDelete(params, (r) =>
			{
				if (r.response == 200)
					resolve(r);
				else
					reject(r.error);
			});
		});
	},

	fetchList: function ()
	{
		let data = {...this.request.get()};

		data.f = this.basePath + '.list';

		this.dispatchEvent('listLoading');

		Api.fetch(data).then(r => {
			this.list.setData(r.response == 200 ? r.data : null);
			this.dispatchEvent('listLoaded');
			this.dispatchEvent('listChanged');
		});
	},

	fetchEnum: function ()
	{
		let data = {...this.request.get()};

		data.f = this.basePath + '.enum';

		this.dispatchEvent('enumLoading');

		Api.fetch(data).then(r => {
			this.enum.setData(r.response == 200 ? r.data : null);
			this.dispatchEvent('enumLoaded');
			this.dispatchEvent('enumChanged');
		});
	},

	fetchCount: function ()
	{
		let data = {...this.request.get()};

		data.f = this.basePath + '.count';

		this.dispatchEvent('countLoading');

		Api.fetch(data).then(r => {
			this.count = r.response == 200 ? r.count : 0;
			this.dispatchEvent('countLoaded');
			this.dispatchEvent('countChanged');
		});
	},

	fetchOne: function (params, callback)
	{
		let data = {...this.request.get(), ...params};

		data.f = this.basePath + '.get';

		Api.fetch(data).then(r => {
			callback(r);
		});
	},

	fetchDelete: function (params, callback)
	{
		let data = {...this.request.get(), ...params};

		data.f = this.basePath + '.delete';

		Api.fetch(data).then(r => {
			callback(r);
		});
	},

	fetchData: function (params)
	{
		let data = {...this.request.get(), ...params};

		if (data.f[0] == '.')
			data.f = this.basePath + data.f;

		return Api.fetch(data);
	},

	makeUrl: function (params)
	{
		let data = {...this.request.get(), ...params};

		if (data.f[0] == '.')
			data.f = this.basePath + data.f;

		return Api.makeUrl(data);
	}
});
