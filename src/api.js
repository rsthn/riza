
import base64 from 'base-64';

//!class Api

/**
 * API interface utility functions.
 */

const Api =
{
    /**
     * Flags constants.
     */
    REQUEST_PACKAGE_SUPPORTED:	0x01,
    REQ64_SUPPORTED: 			0x02,
    JSON_RESPONSE_SUPPORTED: 	0x04,
    XML_RESPONSE_SUPPORTED: 	0x08,
    INCLUDE_CREDENTIALS:		0x10,
    UNIQUE_STAMP:				0x20,
    DISABLE_CORS:				0x40,
    WIND_V3:                    0x80,

    /**
     * Target URL for all the API requests. Set by calling `setEndPoint`.
     */
    apiUrl: "/api",

    /**
     * Capabilities flag.
     */
    flags: 0x01 | 0x02 | 0x04 | 0x08 | 0x10 | 0x20,

    /**
     * Indicates if all request data will be packed into a req64 parameter instead of individual fields.
     */
    useReq64: false,

    /**
     * Number of retries to execute each API call before giving up and invoking error handlers.
     */
    retries: 0,

    /**
     * Headers for the request.
     */
    _headers: { },

    /**
     * Level of the current request. Used to detect nested requests.
     */
    _requestLevel: 0,

    /**
     * Indicates if all API calls should be bundled in a request package. Activated by calling the packageBegin() function and finished with packageEnd().
     */
    _requestPackage: 0,

    /**
     * When in package-mode, this contains the package data to be sent upon a call to packageEnd().
     */
    _packageData: [],

    /**
     * Sets the API's base URL address.
     * @param {string} baseURL
     * @param {number} flags
     * !static setBaseUrl (baseURL: string, flags?: number) : Api;
     */
    setBaseUrl: function (baseURL, flags=null)
    {
        this.apiUrl = baseURL;
        this.flags = flags ?? this.flags;

        return this;
    },

    setEndPoint: function (apiUrl, flags=null)
    {
        this.apiUrl = apiUrl;
        this.flags = flags ?? this.flags;

        return this;
    },

    /**
     * Overridable filter that processes the response from the server and returns `true` if it was successful.
     * The `res` parameter indicates the response data, and `req` the request data.
     * @param {object} res
     * @param {object} req
     * !static responseFilter (res: object, req: object) : boolean;
     */
    responseFilter: function (res, req)
    {
        return true;
    },

    /**
     * Starts package-mode (using the `rpkg` field). Any API calls after this will be bundled together, note that the
     * feature flag `REQUEST_PACKAGE_SUPPORTED` must be set.
     * !static packageBegin() : void;
     */
    packageBegin: function()
    {
        if (!(this.flags & Api.REQUEST_PACKAGE_SUPPORTED))
            return;

        this._requestPackage++;
    },

    /**
     * Finishes package-mode and if there is any data in the package a single API request will be sent, when the package
     * is sent the `callback` will be invoked. Note that the feature flag `REQUEST_PACKAGE_SUPPORTED` must be set.
     * @param {function} callback
     * !static packageEnd (callback: function) : void;
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
     * Utility function to batch together multiple API calls, requires feature flag `REQUEST_PACKAGE_SUPPORTED` to be set. Any
     * API calls made during the callback will be bundled together and sent in a single request. When the request is sent
     * the `responseCallback` will be invoked.
     * @param {function} callback
     * @param {function} responseCallback
     * !static batch (callback: function, responseCallback?: function) : void;
     */
    batch: function (callback, responseCallback=null)
    {
        if (!(this.flags & Api.REQUEST_PACKAGE_SUPPORTED)) {
            callback();
            if (responseCallback) responseCallback();
            return;
        }

        this.packageBegin();
        callback();
        this.packageEnd(responseCallback);
    },

    /**
     * Sends a single API request with the currently constructed package and maintains package-mode. After the request
     * is sent the `callback` will be invoked. Note that the feature flag `REQUEST_PACKAGE_SUPPORTED` must be set.
     * !static packageSend (callback: function) : void;
     */
    packageSend: function (callback)
    {
        if (!(this.flags & Api.REQUEST_PACKAGE_SUPPORTED))
            return;

        if (!this._packageData.length)
            return;

        let _packageData = this._packageData;
        this._packageData = [];

        let rpkg = "";
        for (let i = 0; i < _packageData.length; i++)
            rpkg += "r"+i+","+base64.encode(this.encodeParams(_packageData[i][2]))+";";

        this._showProgress();

        this.apiCall (
            { rpkg: rpkg },

            (res, req) => {
                this._hideProgress();
                for (let i = 0; i < _packageData.length; i++)
                {
                    try {
                        let response = res["r"+i];
                        if (!response) {
                            if (_packageData[i][1] != null) _packageData[i][1] (_packageData[i][2]);
                            continue;
                        }

                        if (_packageData[i][0] != null) {
                            if (this.responseFilter (response, _packageData[i][2]))
                                _packageData[i][0] (response, _packageData[i][2]);
                        }
                    }
                    catch (e) {
                    }
                }

                if (callback) callback();
            },

            (req) => {
                this._hideProgress();
                for (let i = 0; i < _packageData.length; i++) {
                    if (_packageData[i][1] != null) _packageData[i][1] (_packageData[i][2]);
                }
            }
        );
    },

    /**
     * Adds CSS class 'busy' to the HTML root element, works only if running inside a browser.
     */
    _showProgress: function ()
    {
        if ('document' in global) {
            this._requestLevel++;
            if (this._requestLevel > 0) global.document.documentElement.classList.add('busy');
        }
    },

    /**
     * Removes the 'busy' CSS class from the HTML element.
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
     * Sets an HTTP header.
     * @deprecated
     * @param {string} name
     * @param {string} value
     * !static header (name: string, value: string) : Api;
     */
    header: function (name, value)
    {
        if (value === null)
            delete this._headers[name];
        else
            this._headers[name] = value;

        return this;
    },

    /**
     * Sets global HTTP headers for subsequent requests. When `update` is `true` existing headers will be updated rather
     * than replaced, and any header with a `null` value will be removed.
     * @param {object} values
     * @param {boolean} update
     * !static headers (values: object, update: boolean = false) : Api;
     */
    headers: function (values, update=false)
    {
        if (!update) {
            this._headers = values;
            return this;
        }

        for (let name in values)
        {
            let value = values[name];
            if (value === null)
                delete this._headers[name];
            else
                this._headers[name] = value;
        }

        return this;
    },

    /**
     * Encodes parameters into a query string safe for use in URLs.
     * @param {object|FormData} obj
     * !static encodeParams (obj: object|FormData) : string;
     */
    encodeParams: function (obj)
    {
        let s = [];

        if (obj instanceof FormData) {
            for (let i of obj.entries())
                s.push(encodeURIComponent(i[0]) + '=' + encodeURIComponent(i[1]));
        }
        else {
            for (let i in obj)
                s.push(encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]));
        }

        return s.join('&');
    },

    /**
     * Appends a parameter to the given URL.
     * @param {string} url
     * @param {object} queryParams
     * !static appendParams (url: string, queryParams: object) : string;
     */
    appendParams: function (url, queryParams)
    {
        if (queryParams === null)
            return url;

        return url + (url.indexOf('?') === -1 ? '?' : '&') + this.encodeParams(queryParams);
    },

    /**
     * Returns an absolute URL formed with the given relative URL (or absolute URL) and the provided query parameters.
     * @param {string} url
     * @param {object} queryParams
     * !static getAbsoluteUrl (url: string, queryParams: object) : string;
     */
    getAbsoluteUrl: function (url, queryParams=null)
    {
        if (url.indexOf('//') !== -1)
            return this.appendParams(url, queryParams);

        return this.appendParams(this.apiUrl + url, queryParams);
    },

    /**
     * Returns whether the given HTTP method allows a body.
     * @param {string} method 
     */
    methodAllowsBody: function (method) {
        return method === 'POST' || method === 'PUT' || method === 'PATCH';
    },

    /**
     * Executes an API call to the URL stored in the `apiUrl` property. By default `httpMethod` is "auto", which will determine the best depending on the data to
     * be sent. Any connection error will be reported to the `failure` callback, and similarly any success to the `success` callback. The `params` object can be
     * a FormData object or just a regular object.
     */
    apiCall: function (params, success, failure, httpMethod=null, retries=null, relativeUrl='')
    {
        let url = this.getAbsoluteUrl(relativeUrl ?? '');

        if (this.flags & Api.UNIQUE_STAMP)
            url = this.appendParams(url, { "_": Date.now() });

        httpMethod = httpMethod ? httpMethod.toUpperCase() : null;
        if (httpMethod === null) httpMethod = 'auto';

        if (retries === null)
            retries = this.retries;

        if (this._requestPackage && (this.flags & Api.REQUEST_PACKAGE_SUPPORTED)) {
            if (!(params instanceof FormData))
                params = { ...params };
            this._packageData.push([ success, failure, params ]);
            return;
        }

        this._showProgress();

        let data = params;
        let options = {
            mode: this.flags & Api.DISABLE_CORS ? 'no-cors' : 'cors',
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml,application/json;q=0.9',
                ...this._headers
            },
            method: httpMethod,
            body: null,
            multipart: false
        };

        if (this.flags & Api.INCLUDE_CREDENTIALS)
            options.credentials = 'include';

        if (typeof(data) !== 'string' && !(data instanceof Blob))
        {
            if (!(data instanceof FormData)) {
                data = new FormData();
                for (let i in params) {
                    if ((params[i] instanceof File) || (params[i] instanceof Blob))
                        data.append(i, params[i], params[i].name);
                    else
                        data.append(i, params[i]);
                }
            }

            for (let i of data.entries())
            {
                if ((i[1] instanceof File) || (i[1] instanceof Blob)) {
                    if (options.method === 'auto') options.method = 'POST';
                    options.multipart = true;
                    break;
                }
            }

            if (this.useReq64 && (this.flags & Api.REQ64_SUPPORTED) && !options.multipart) {
                let tmp = new FormData();
                tmp.append('req64', base64.encode(this.encodeParams(data)));
                data = tmp;
            }

            if (options.method === 'auto') {
                let l = 0;
                options.method = 'GET';
                for (let i of data.entries()) {
                    l += i[0].length + i[1].length + 2;
                    if (l > 960) {
                        options.method = 'POST';
                        break;
                    }
                }	
            }

            if (!this.methodAllowsBody(options.method)) {
                url = this.appendParams(url, data);
            }
            else
            {
                if (!options.multipart) {
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
                    if (data[0] === '{' || data[0] === '[')
                        options.headers['Content-Type'] = 'application/json';
                    else
                        options.headers['Content-Type'] = 'application/octet-stream';
                }
            }
            else // Blob
                options.headers['Content-Type'] = data.type;

            if (options.method === 'auto') options.method = 'POST';
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
                if (failure) failure(err, params);
            } else {
                this.apiCall (data, success, failure, httpMethod, retries-1, relativeUrl);
            }
        });
    },

    /**
     * Decodes a result obtained using fetch into a usable object.
     */
    decodeResult: function (result)
    {
        let type = result.headers.get('content-type').split(';')[0].toLowerCase();
        if ((this.flags & Api.JSON_RESPONSE_SUPPORTED) && type.indexOf('json') !== -1)
        {
            if (this.flags & Api.WIND_V3) {
                return async function() {
                    let data = await result.json();
                    data.response = result.status;
                    return data;
                }();
            }

            return result.json();
        }

        if ((this.flags & Api.XML_RESPONSE_SUPPORTED) && type.indexOf('xml') !== -1)
        {
            return new Promise((resolve, reject) => {
                result.text().then(data => {
                    data = (new DOMParser).parseFromString(data, 'text/xml');
                    resolve(data);
                })
                .catch(reject);
            });
        }

        return result.blob();
    },

    /**
     * Makes a blob with the specified data and type.
     * @param {string} data
     * @param {string} type
     * !static getBlob (data: string, type: string) : Blob
     */
    getBlob: function (data, type) {
        return new Blob ([data], { type: type });
    },

    /**
     * Provided access to the base64 module to encode/decode data.
     */
    base64:
    {
        encode: function (value) {
            return base64.encode(value);
        },

        decode: function (value) {
            return base64.decode(value);
        }
    },

    /**
     * Executes an API request.
     * @param {string} method
     * @param {string} url
     * @param {object} query
     * @param {string|object|Blob} body
     * !static request (method: string, url: string, query?: object, body?: object) : Promise
     */
    request: function (method, url, query=null, body=null)
    {
        if (typeof(body) !== 'string' && !(body instanceof Blob) && this.methodAllowsBody(method))
            body = JSON.stringify(body);

        return new Promise((resolve, reject) => {
            this.apiCall(
                body,
                resolve, reject,
                method,
                null,
                this.getAbsoluteUrl(url, query)
            )
        });
    },

    post: function (url=null, params=null) {
        return this.fetch('POST', url, params);
    },

    get: function (url=null, params=null) {
        return this.fetch('GET', url, params);
    },

    put: function (url=null, params=null) {
        return this.fetch('PUT', url, params);
    },

    patch: function (url=null, params=null) {
        return this.fetch('PATCH', url, params);
    },

    delete: function (url=null, params=null) {
        return this.fetch('DELETE', url, params);
    },

    fetch: function (method, url=null, params=null)
    {
        // fetch (method, relativePath, params)
        // fetch (relativePath, params)
        let shift = true;
        if (typeof(method) === 'string') {
            let tmp = method.toUpperCase();
            if (tmp === 'GET' || tmp === 'POST' || tmp === 'PUT' || tmp === 'DELETE' || tmp === 'PATCH' || tmp === 'HEAD' || tmp === 'OPTIONS')
                shift = false;
        }

        if (shift) {
            params = url;
            url = method;
            method = null;
        }

        if (params === null) {
            if (typeof(url) !== 'string') {
                params = url;
                url = '';
            }
        }

        return new Promise((resolve, reject) => {
            this.apiCall(params, resolve, reject, method, null, url);
        });
    }
};

export default Api;

//!/class
