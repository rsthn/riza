
import { Model, ModelList } from 'rinn';
import Api from './api.js';

/*
**	Provides an interface to connect with a listing API function.
*/

export default ModelList.extend
({
	className: 'DataList',
	debounceDelay: 250,

	request: null,

	eid: null,

	/*
	**	Constructs the data list with the specified optional `config` parameters, any of the properties of this object can be specified
	**	in the config. The given `f` parameter is passed directly as a request parameter to the API.
	*/
	__ctor: function (f, config=null)
	{
		this._super.ModelList.__ctor();

		if (config !==  null)
			Object.assign(this, config);

		if (!this.request)
			this.request = { };

		this.request.f = f;
		this.request = new Model(this.request);

		this.eid = Math.random().toString().substr(2);
		this.dataList = this;

		this.request.addEventListener (this.eid+':propertyChanged', this.forwardRequestEvent, this);
	},

	forwardRequestEvent: function (evt, args)
	{
		this.prepareEvent('request' + evt.name[0].toUpperCase() + evt.name.substr(1), args).setSource(evt.source).resume();
	},

	/*
	**	Executes a request to retrieve the data for the list (uses debounce to prevent too-quick refreshes).
	*/
	refresh: function (callback=null, _callback=null)
	{
		if (this._timeout)
		{
			clearTimeout(this._timeout);
			this._timeout = null;
		}

		if (callback === true)
		{
			this.dispatchEvent('listLoading');

			Api.fetch(this.request.get()).then(r =>
			{
				this.setData(r.response == 200 ? r.data : null);
				this.dispatchEvent('listLoaded');
				this.dispatchEvent('listChanged');

				if (_callback !== null)
					_callback();
			});

			return;
		}

		const fn = () => {
			this.refresh(true, callback);
		};

		this._timeout = setTimeout(fn, this.debounceDelay);
	}
});
