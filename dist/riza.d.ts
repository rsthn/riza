export class Api
{
	/**
	 * Sets the API's base URL address.
	 * @param {string} baseURL
	 * @param {number} flags
	 */
	static setBaseUrl (baseURL: string, flags?: number) : Api;

	/**
	 * Overridable filter that processes the response from the server and returns `true` if it was successful.
	 * The `res` parameter indicates the response data, and `req` the request data.
	 * @param {object} res
	 * @param {object} req
	 */
	static responseFilter (res: object, req: object) : boolean;

	/**
	 * Starts package-mode (using the `rpkg` field). Any API calls after this will be bundled together, note that the
	 * feature flag `REQUEST_PACKAGE_SUPPORTED` must be set.
	 */
	static packageBegin() : void;

	/**
	 * Finishes package-mode and if there is any data in the package a single API request will be sent, when the package
	 * is sent the `callback` will be invoked. Note that the feature flag `REQUEST_PACKAGE_SUPPORTED` must be set.
	 * @param {function} callback
	 */
	static packageEnd (callback: function) : void;

	/**
	 * Utility function to batch together multiple API calls, requires feature flag `REQUEST_PACKAGE_SUPPORTED` to be set. Any
	 * API calls made during the callback will be bundled together and sent in a single request. When the request is sent
	 * the `responseCallback` will be invoked.
	 * @param {function} callback
	 * @param {function} responseCallback
	 */
	static batch (callback: function, responseCallback?: function) : void;

	/**
	 * Sends a single API request with the currently constructed package and maintains package-mode. After the request
	 * is sent the `callback` will be invoked. Note that the feature flag `REQUEST_PACKAGE_SUPPORTED` must be set.
	 */
	static packageSend (callback: function) : void;

	/**
	 * Sets an HTTP header.
	 * @deprecated
	 * @param {string} name
	 * @param {string} value
	 */
	static header (name: string, value: string) : Api;

	/**
	 * Sets global HTTP headers for subsequent requests. When `update` is `true` existing headers will be updated rather
	 * than replaced, and any header with a `null` value will be removed.
	 * @param {object} values
	 * @param {boolean} update
	 */
	static headers (values: object, update: boolean = false) : Api;

	/**
	 * Encodes parameters into a query string safe for use in URLs.
	 * @param {object|FormData} obj
	 */
	static encodeParams (obj: object|FormData) : string;

	/**
	 * Appends a parameter to the given URL.
	 * @param {string} url
	 * @param {object} queryParams
	 */
	static appendParams (url: string, queryParams: object) : string;

	/**
	 * Returns an absolute URL formed with the given relative URL (or absolute URL) and the provided query parameters.
	 * @param {string} url
	 * @param {object} queryParams
	 */
	static getAbsoluteUrl (url: string, queryParams: object) : string;

	/**
	 * Makes a blob with the specified data and type.
	 * @param {string} data
	 * @param {string} type
	 */
	static getBlob (data: string, type: string) : Blob

	/**
	 * Executes an API request.
	 * @param {string} method
	 * @param {string} url
	 * @param {object} query
	 * @param {string|object|Blob} body
	 */
	static request (method: string, url: string, query?: object, body?: object) : Promise

}






export class db
{
	/**
	 * Initializes the database connection.
	 * @param {string} dbName
	 * @param {number} version
	 * @param {(db: IDBDatabase, txn: IDBTransaction, oldVersion: number) => void} upgradeCallback
	 * @returns {Promise<void>}
	 */
	static init (dbName: string, version: number, upgradeCallback: (db: IDBDatabase, txn: IDBTransaction, oldVersion: number) => void) : Promise<void>;

	/**
	 * Returns an index object for later use with methods that accept an IDBIndex in the `storeName` parameter.
	 * @param {string} storeName
	 * @param {string} indexName
	 * @returns {IDBIndex}
	 */
	static index (storeName: string, indexName: string) : IDBIndex;

	/**
	 * Runs a callback for each record in a data store.
	 * @param {string|IDBIndex|IDBObjectStore} storeName
	 * @param {string} id
	 * @param { (value:object, cursor:IDBCursor) => Promise<boolean> } callback
	 * @returns {Promise<void>}
	 */
	static forEach (storeName: string|IDBIndex|IDBObjectStore, id: string, callback: (value:object, cursor:IDBCursor) => Promise<boolean>) : Promise<void>;

	/**
	 * Returns the count of all records from the specified data store.
	 * @param {string|IDBIndex|IDBObjectStore} storeName
	 * @returns {Promise<number>}
	 */
	static count (storeName: string|IDBIndex|IDBObjectStore) : Promise<number>;

	/**
	 * Returns all records from the specified data store.
	 * @param {string|IDBIndex|IDBObjectStore} storeName
	 * @param {string|number|Array<string|number>} filter
	 * @returns {Promise<Array<object>>}
	 */
	static getAll (storeName: string|IDBIndex|IDBObjectStore, filter?: string|number|Array<string|number>) : Promise<Array<object>>;

	/**
	 * Returns all keys from the specified data store.
	 * @param {string|IDBIndex|IDBObjectStore} storeName
	 * @param {string|number|Array<string|number>} filter
	 * @returns {Promise<Array<string|number|Array<string|number>>>}
	 */
	static getAllKeys (storeName: string|IDBIndex|IDBObjectStore, filter?: string|number|Array<string|number>) : Promise<Array<object>>;

	/**
	 * Loads a list of records having unique values from the specified data store and returns the entire object or just the specified field.
	 * @param {string|IDBIndex|IDBObjectStore} storeName
	 * @param {string} 
	 * @returns {Promise<Array<number|string|object>>}
	 */
	static getAllUnique (storeName: string|IDBIndex|IDBObjectStore) : Promise<Array<number|string|object>>;

	/**
	 * Returns a single record from the specified data store.
	 * @param {string|IDBIndex|IDBObjectStore} storeName
	 * @param {string|number|Array<string|number>} id
	 * @returns {Promise<object>}
	 */
	static get (storeName: string|IDBIndex|IDBObjectStore, id: string|number|Array<string|number>) : Promise<object>;

	/**
	 * Adds or overwrites a record in the specified data store (data must include the primary key).
	 * @param {string} storeName
	 * @param {object} data
	 * @returns {Promise<void>}
	 */
	static put (storeName: string, data: object) : Promise<void>;

	/**
	 * Returns a variable from the system table.
	 * @param {string} name - Name of the property to read.
	 * @param {boolean} full - When `true` the entire object will be returned.
	 * @returns {any}
	 */
	static sysGet (name: string, full?: boolean) : any;

	/**
	 * Writes a variable to the system table.
	 * @param {string} name - Name of the property to write.
	 * @param {any} value - Value to write.
	 * @param {boolean} full - When `true` the entire value will be written as-is.
	 * @returns {void}
	 */
	static sysPut (name: string, value: any, full?: boolean) : void;

	/**
	 * Returns a single record from the specified data store that matches the `partial` object and does NOT match the `notPartial` object.
	 * @param {string|IDBIndex|IDBObjectStore} storeName
	 * @param {object} 
	 * @param {object} 
	 * @returns {Promise<object>}
	 */
	static findOne (storeName: string|IDBIndex|IDBObjectStore, partial?: object, notPartial?: object) : Promise<object>;

	/**
	 * Deletes a record from the specified data store.
	 * @param {string} storeName
	 * @param {string|number|Array<string|number>} id
	 * @returns {Promise<void>}
	 */
	static delete (storeName: string, id: string|number|Array<string|number>) : Promise<void>;

	/**
	 * Deletes all items in the specified store.
	 * @param {string|IDBIndex|IDBObjectStore} storeName
	 * @param {string|number|Array<string|number>} id
	 * @returns {Promise<void>}
	 */
	static deleteAll (storeName: string|IDBIndex|IDBObjectStore, id: string|number|Array<string|number>) : Promise<void>;

	/**
	 * Inserts a new record in the specified data store.
	 * @param {string} storeName
	 * @param {object} data
	 * @returns {Promise<void>}
	 */
	static insert (storeName: string, data: object) : Promise<void>;

}
export class geo
{
	/**
	 * Initializes the geolocation interface. Returns boolean indicating whether geolocation
	 * is supported on the device.
	 * @returns {boolean}
	 */
	static init() : boolean;

	/**
	 * Single-shot positioning operation. While the geolocation operation is in progress, the `.busy-geo` CSS class
	 * will be set in the `html` element. You can use this to display a spinner or other indicator.
	 * @returns {Promise<GeolocationPosition>}
	 */
	static getCurrentPosition() : Promise<GeolocationPosition>;

	/**
	 * Cancels the active positioning operation (if any).
	 */
	static cancel() : void;

}