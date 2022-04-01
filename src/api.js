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

const Api =
{
	/**
	**	Flags constants.
	*/
	REQUEST_PACKAGE_SUPPORTED:	0x01,
	REQ64_SUPPORTED: 			0x02,
	JSON_RESPONSE_SUPPORTED: 	0x04,
	XML_RESPONSE_SUPPORTED: 	0x08,
	INCLUDE_CREDENTIALS:		0x10,
	UNIQUE_STAMP:				0x20,

	/**
	**	Target URL for all the API requests. Set by calling `setEndPoint`.
	*/
	apiUrl: "/api",

	/**
	**	Capabilities flag.
	*/
	flags: 0,

	/**
	**	Indicates if all request data will be packed into a req64 parameter instead of individual fields.
	*/
	useReq64: false,

	/**
	**	Number of retries to execute each API call before giving up and invoking error handlers.
	*/
	retries: 0,

	/**
	**	Headers for the request.
	*/
	headers: { },

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
	setEndPoint: function (apiUrl, flags=null)
	{
		if (flags === null)
			flags = Api.REQUEST_PACKAGE_SUPPORTED | Api.REQ64_SUPPORTED | Api.JSON_RESPONSE_SUPPORTED | Api.XML_RESPONSE_SUPPORTED | Api.INCLUDE_CREDENTIALS | Api.UNIQUE_STAMP;

		this.apiUrl = apiUrl;
		this.flags = flags;

		return this;
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
		if (!(this.flags & Api.REQUEST_PACKAGE_SUPPORTED))
			return;

		this._requestPackage++;
	},

	/**
	**	Finishes "package-mode" and a single API request with the currently constructed package will be sent.
	*/
	packageEnd: function (callback)
	{
		if (!(this.flags & Api.REQUEST_PACKAGE_SUPPORTED))
			return;

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
		if (!(this.flags & Api.REQUEST_PACKAGE_SUPPORTED))
		{
			return;
		}

		this.packageBegin();
		callback();
		this.packageEnd(responseCallback);
	},

	/**
	**	Sends a single API request with the currently constructed package and maintains package-mode.
	*/
	packageSend: function (callback)
	{
		if (!(this.flags & Api.REQUEST_PACKAGE_SUPPORTED))
			return;

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
		if ('document' in global)
		{
			this._requestLevel--;
			if (this._requestLevel) return;

			setTimeout(() => {
				if (this._requestLevel === 0)
					global.document.documentElement.classList.remove('busy');
			}, 250);
		}
	},

	/**
	 * 	Sets an HTTP header.
	 */
	header: function (name, value)
	{
		if (value === null)
			delete this.headers[name];
		else
			this.headers[name] = value;

		return this;
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
	 * Returns a URL given a relative or absolute URL.
	 */
	getUrl: function (url)
	{
		if (url.indexOf('//') !== -1)
			return url;

		return this.apiUrl + url;
	},

	/**
	 * Appends a parameter to the URL.
	 */
	appendParam: function (url, param)
	{
		return url + (url.indexOf('?') == -1 ? '?' : '&') + param;
	},

	/**
	**	Executes an API call to the URL stored in the `apiUrl` property. By default `httpMethod` is "auto", which will determine the best depending on the data to
	**	be sent. Any connection error will be reported to the `failure` callback, and similarly any success to the `success` callback. The `params` object can be
	**	a FormData object or just a regular object.
	*/
	apiCall: function (params, success, failure, httpMethod=null, retries=null, relativeUrl='')
	{
		let url = this.getUrl(relativeUrl);

		if (this.flags & Api.UNIQUE_STAMP)
			url = this.appendParam(url, '_='+Date.now());

		httpMethod = httpMethod ? httpMethod.toUpperCase() : null;
		if (httpMethod != 'GET' && httpMethod != 'POST')
			httpMethod = 'auto';

		if (retries === null)
			retries = this.retries;

		if (this._requestPackage && (this.flags & Api.REQUEST_PACKAGE_SUPPORTED))
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
			mode: 'cors',
			headers: {
				'Accept': 'text/html,application/xhtml+xml,application/xml,application/json;q=0.9',
				...this.headers
			},
			method: httpMethod,
			body: null,
			multipart: false
		};

		if (this.flags & Api.INCLUDE_CREDENTIALS)
			options.credentials = 'include';

		if (typeof(data) !== 'string' && !(data instanceof Blob))
		{
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

			if (this.useReq64 && (this.flags & Api.REQ64_SUPPORTED) && !options.multipart)
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
		}
		else
		{
			if (typeof(data) === 'string')
			{
				if (data[0] === '<')
				{
					if (data.endsWith('</soap:Envelope>'))
						options.headers['Content-Type'] = 'application/soap+xml';
					else
						options.headers['Content-Type'] = 'application/xml';
				}
				else
				{
					if (data[0] === '{')
						options.headers['Content-Type'] = 'application/json';
					else
						options.headers['Content-Type'] = 'application/octet-stream';
				}
			}
			else
				options.headers['Content-Type'] = data.type;

			options.method = 'POST';
			options.body = data;
		}

		global.fetch(url, options)
		.then(result => this.decodeResult(result))
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
				this.apiCall (data, success, failure, httpMethod, retries-1, relativeUrl);
			}
		});
	},

	/**
	**	Decodes a result obtained using fetch into a usable object.
	*/
	decodeResult: function (result)
	{
		let type = result.headers.get('content-type').split(';')[0].toLowerCase();

		if ((this.flags & Api.JSON_RESPONSE_SUPPORTED) && type.indexOf('json') !== -1)
			return result.json();

		if ((this.flags & Api.XML_RESPONSE_SUPPORTED) && type.indexOf('xml') !== -1)
		{
			return new Promise((resolve, reject) =>
			{
				result.text().then(data =>
				{
					data = (new DOMParser).parseFromString(data, 'text/xml');
					resolve(data);
				})
				.catch(reject);
			});
		}

		return result.blob();
	},

	/**
	**	Makes a blob with the specified data and type.
	*/
	getBlob: function (data, type)
	{
		return new Blob ([data], { type: type });
	},

	/**
	**	Provided access to the base64 module to encode/decode data.
	*/
	base64:
	{
		encode: function (value)
		{
			return base64.encode(value);
		},

		decode: function (value)
		{
			return base64.decode(value);
		}
	},

	/**
	**	Executes a POST API call.
	*/
	post: function (params, success=null, failure=null)
	{
		return this.apiCall(params, success, failure, 'POST');
	},

	/**
	**	Executes a GET API call.
	*/
	get: function (params, success=null, failure=null)
	{
		return this.apiCall(params, success, failure, 'GET');
	},

	/**
	**	Executes an automatic API call, returns a promise.
	*/
	fetch: function (url, params=null)
	{
		if (params === null)
		{
			if (typeof(url) !== 'string')
			{
				params = url;
				url = '';
			}
		}

		return new Promise((resolve, reject) => {
			this.apiCall(params, resolve, reject, null, null, url);
		});
	},

	/**
	**	Builds a URL from the given data.
	*/
	makeUrl: function (url, params=null)
	{
		if (params === null)
		{
			if (typeof(url) !== 'string')
			{
				params = url;
				url = '';
			}
		}

		return this.appendParam(this.getUrl(url), this.encodeParams(params));
	}
};

export default Api;
