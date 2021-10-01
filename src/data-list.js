/*
**	riza/data-list
**
**	Copyright (c) 2013-2021, RedStar Technologies, All rights reserved.
**	https://www.rsthn.com/
**
**	THIS LIBRARY IS PROVIDED BY REDSTAR TECHNOLOGIES "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES,
**	INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A 
**	PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL REDSTAR TECHNOLOGIES BE LIABLE FOR ANY
**	DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT 
**	NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; 
**	OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, 
**	STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE
**	USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

import { Model, ModelList } from '@rsthn/rin';
import Api from './api.js';

/*
**	Provides several methods to quickly interface with a remote data-source as defined by Wind.
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
	},
});
