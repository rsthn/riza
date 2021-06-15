/*
**	riza/api
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

import base64 from 'base-64';
import _fetch from 'node-fetch';

if (!('fetch' in global))
	global.fetch = _fetch;

/**
**	API interface utility functions.
*/

export default
{
	/**
	**	Target URL for all the API requests. Set by calling `setEndPoint`.
	*/
	apiUrl: "/api",

	/**
	**	Indicates if all request data will be packed into a req64 parameter instead of individual fields.
	*/
	useReq64: false,

	/**
	**	Number of retries to execute each API call before giving up and invoking error handlers.
	*/
	retries: 1,

	/**
	**	Level of the current request. Used to detect nested requests.
	*/
	_requestLevel: 0,

	/**
	**	Indicates if all API calls should be bundled in a request package. Activated by calling the packageBegin() function and finished with packageEnd().
	*/
	_requestPackage: 0,

	/**
	**	When in package-mode, this contains the package data to be sent upon a call to packageEnd().
	*/
	_packageData: [],

	/**
	**	Sets the API end-point URL address.
	*/
	setEndPoint: function (apiUrl)
	{
		this.apiUrl = apiUrl;
	},

	/**
	**	Overridable filter that processes the response from the server and returns true if it was successful. The `res` parameter indicates the response data, and `req` the request data.
	*/
	responseFilter: function (res, req)
	{
		return true;
	},

	/**
	**	Starts "package-mode" (using the `rpkg` field). Any API calls after this will be bundled together.
	*/
	packageBegin: function ()
	{
		this._requestPackage++;
	},

	/**
	**	Finishes "package-mode" and a single API request with the currently constructed package will be sent.
	*/
	packageEnd: function (callback)
	{
		if (!this._requestPackage)
			return;

		if (--this._requestPackage)
			return;

		this.packageSend(callback);
	},

	/**
	**	Starts package-mode, executes the callback and finishes package-mode. Therefore any requests made by the callback will be packed together.
	*/
	packRequests: function (callback, responseCallback=null)
	{
		this.packageBegin();
		callback();
		this.packageEnd(responseCallback);
	},

	/**
	**	Sends a single API request with the currently constructed package and maintains package-mode.
	*/
	packageSend: function (callback)
	{
		if (!this._packageData.length)
			return;

		let _packageData = this._packageData;
		this._packageData = [];

		var rpkg = "";

		for (var i = 0; i < _packageData.length; i++)
			rpkg += "r"+i+","+base64.encode(this.encodeParams(_packageData[i][2]))+";";

		this._showProgress();

		this.apiCall (
			{ rpkg: rpkg },

			(res, req) =>
			{
				this._hideProgress();

				for (let i = 0; i < _packageData.length; i++)
				{
					try
					{
						var response = res["r"+i];
						if (!response)
						{
							if (_packageData[i][1] != null) _packageData[i][1] (_packageData[i][2]);
							continue;
						}

						if (_packageData[i][0] != null)
						{
							if (this.responseFilter (response, _packageData[i][2]))
							{
								_packageData[i][0] (response, _packageData[i][2]);
							}
						}
					}
					catch (e) {
					}
				}

				if (callback) callback();
			},

			(req) =>
			{
				this._hideProgress();

				for (let i = 0; i < _packageData.length; i++)
				{
					if (_packageData[i][1] != null) _packageData[i][1] (_packageData[i][2]);
				}
			}
		);
	},

	/**
	**	Adds CSS class 'busy' to the HTML root element, works only if running inside a browser.
	*/
	_showProgress: function ()
	{
		if ('document' in global) {
			this._requestLevel++;
			if (this._requestLevel > 0) global.document.documentElement.classList.add('busy');
		}
	},

	/**
	**	Removes the 'busy' CSS class from the HTML element.
	*/
	_hideProgress: function ()
	{
		if ('document' in global) {
			this._requestLevel--;
			if (!this._requestLevel) global.document.documentElement.classList.remove('busy');
		}
	},

	/**
	**	Returns a parameter string for a GET request given an object with fields.
	*/
	encodeParams: function (obj)
	{
		let s = [];

		if (obj instanceof FormData)
		{
			for (let i of obj.entries())
				s.push(encodeURIComponent(i[0]) + '=' + encodeURIComponent(i[1]));
		}
		else
		{
			for (let i in obj)
				s.push(encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]));
		}

		return s.join('&');
	},

	/**
	**	Executes an API call to the URL stored in the `apiUrl` property. By default `httpMethod` is "auto", which will determine the best depending on the data to
	**	be sent. Any connection error will be reported to the `failure` callback, and similarly any success to the `success` callback. The `params` object can be
	**	a FormData object or just a regular object.
	*/
	apiCall: function (params, success, failure, httpMethod, retries)
	{
		let url = this.apiUrl + '?_=' + Date.now();

		if (httpMethod != 'GET' && httpMethod != 'POST')
			httpMethod = 'auto';

		if (retries === undefined)
			retries = this.retries;

		if (this._requestPackage)
		{
			if (!(params instanceof FormData))
				params = {...params};

			this._packageData.push([success, failure, params]);
			return;
		}

		this._showProgress();

		let data = params;

		let options =
		{
			credentials: 'include',
			mode: 'cors',
			headers: {
				'Accept': 'text/html,application/xhtml+xml,application/xml,application/json;q=0.9',
			},
			method: httpMethod,
			body: null,
			multipart: false
		};

		if (!(data instanceof FormData))
		{
			data = new FormData();

			for (let i in params)
			{
				if ((params[i] instanceof File) || (params[i] instanceof Blob))
					data.append(i, params[i], params[i].name);
				else
					data.append(i, params[i]);
			}
		}

		for (let i of data.entries())
		{
			if ((i[1] instanceof File) || (i[1] instanceof Blob))
			{
				options.method = 'POST';
				options.multipart = true;
				break;
			}
		}

		if (this.useReq64 && !options.multipart)
		{
			let tmp = new FormData();
			tmp.append('req64', base64.encode(this.encodeParams(data)));
			data = tmp;
		}

		if (options.method == 'auto')
		{
			let l = 0;

			options.method = 'GET';

			for (let i of data.entries())
			{
				l += i[0].length + i[1].length + 2;

				if (l > 960)
				{
					options.method = 'POST';
					break;
				}
			}	
		}

		if (options.method == 'GET')
		{
			url += '&' + this.encodeParams(data);
		}
		else
		{
			if (!options.multipart)
			{
				options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
				options.body = this.encodeParams(data);
			}
			else
				options.body = data;
		}

		global.fetch(url, options)
		.then(result => result.json())
		.then(result =>
		{
			this._hideProgress();
			if (!success) return

			if (this.responseFilter(result, params)) {
				try { success(result, params); } catch(e) { }
			}
		})
		.catch(err =>
		{
			this._hideProgress();

			if (retries == 0) {
				if (failure) failure(params);
			} else {
				this.apiCall (data, success, failure, httpMethod, retries-1);
			}
		});
	},

	/**
	**	Executes a POST API call.
	*/
	post: function (params, success, failure)
	{
		return this.apiCall(params, success, failure, 'POST');
	},

	/**
	**	Executes a GET API call.
	*/
	get: function (params, success, failure)
	{
		return this.apiCall(params, success, failure, 'GET');
	},

	/**
	**	Executes an automatic API call, returns a promise.
	*/
	fetch: function (params)
	{
		return new Promise((resolve, reject) => {
			this.apiCall(params, resolve, reject);
		});
	},

	/**
	**	Executes an automatic API call, returns a promise.
	*/
	makeUrl: function (data)
	{
		return this.apiUrl + (this.apiUrl.indexOf('?') == -1 ? '?' : '&') + this.encodeParams(data);
	}
};
