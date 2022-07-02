
import { Rinn } from 'rinn';

export default
{
	/**
	 * Database connection.
	 */
	db: null,

	/**
	 * Initializes the database connection.
	 * @param {string} dbName
	 * @param {number} version
	 * @param {(db: IDBDatabase, txn: IDBTransaction, version: number) => void} upgradeCallback
	 * @returns {Promise<void>}
	 */
	init: function (dbName, version, upgradeCallback)
	{
		return new Promise((resolve, reject) =>
		{
			if (!global.indexedDB)
			{
				reject ('IndexedDB is not available in your system.');
				return;
			}

			req = indexedDB.open(dbName, version);
			req.onerror = (evt) =>
			{
				let err = evt.target.error + '';

				if (err.indexOf('AbortError') !== -1)
					err = "\n" + req.message;

				reject('Unable to open database: ' + err);
				return;
			};

			req.onupgradeneeded = async (evt) =>
			{
				try
				{
					const db = evt.target.result;
					const txn = evt.target.transaction;

					if (evt.oldVersion < 1)
						db.createObjectStore('system', { keyPath: ['name'] });

					await upgradeCallback(db, txn, evt.oldVersion);
				}
				catch (e) {
					req.message = e.message;
					req.transaction.abort();
				}
			};

			req.onsuccess = async (evt) =>
			{
				this.db = evt.target.result;
				resolve();
			};
		});
	},

	/**
	 * Ensures the database is ready to be used, or throws an exception.
	 */
	ensureConnected: function()
	{
		if (!this.db)
			alert('Error: Database not initialized.');
	},
 
	/**
	 * Returns an index object for later use with methods that accept an IDBIndex in the `storeName` parameter.
	 * @param {string} storeName
	 * @param {string} indexName
	 * @returns {IDBIndex}
	 */
	index: function (storeName, indexName)
	{
		this.ensureConnected();

		let store = this.db.transaction(storeName, 'readwrite').objectStore(storeName);

		let index = store.index(indexName);
		if (!index) throw new Error ('Unable to find index `' + indexName + '` in store ' + storeName);

		return index;
	},

	/**
	 * Runs a callback for each record in a data store.
	 * @param {string|IDBIndex} storeName
	 * @param {string} id
	 * @param { (value:object, cursor:IDBCursor) => Promise<boolean> } callback
	 * @returns {Promise<void>}
	 */
	forEach: function (storeName, id, callback)
	{
		this.ensureConnected();

		if (typeof(id) === 'function')
		{
			callback = id;
			id = null;
		}

		return new Promise(async (resolve, reject) =>
		{
			let request, store;

			if (!(storeName instanceof IDBIndex))
				store = this.db.transaction(storeName, 'readwrite').objectStore(storeName);
			else
				store = storeName;

			if (id === null)
				request = store.openCursor();
			else
				request = store.openCursor(id);

			request.onsuccess = async (event) =>
			{
				let cursor = event.target.result;
				if (!cursor)
				{
					resolve();
					return;
				}

				let result = await callback (cursor.value, cursor);
				if (result === false)
				{
					resolve();
					return;
				}

				cursor.continue();
			};

			request.onerror = (evt) => {
				reject(evt.target.error);
			};
		});
	},

	/**
	 * Loads the count of all records from the specified data store.
	 * @param {string|IDBIndex} storeName
	 * @returns {Promise<number>}
	 */
	count: function (storeName)
	{
		this.ensureConnected();

		return new Promise((resolve, reject) =>
		{
			let store;

			if (!(storeName instanceof IDBIndex))
				store = this.db.transaction(storeName, 'readonly').objectStore(storeName);
			else
				store = storeName;

			let request = store.count();

			request.onsuccess = (evt) => {
				resolve(evt.target.result);
			};

			request.onerror = (evt) => {
				reject(evt.target.error);
			};
		});
	},

	/**
	 * Loads all records from the specified data store.
	 * @param {string|IDBIndex} storeName
	 * @param {string|number|Array<string|number>} filter
	 * @returns {Promise<Array<object>>}
	 */
	getAll: function (storeName, filter=null)
	{
		this.ensureConnected();

		return new Promise((resolve, reject) =>
		{
			let store;

			if (!(storeName instanceof IDBIndex))
				store = this.db.transaction(storeName, 'readonly').objectStore(storeName);
			else
				store = storeName;

			let request = store.getAll(filter);

			request.onsuccess = (evt) => {
				resolve(evt.target.result);
			};

			request.onerror = (evt) => {
				reject(evt.target.error);
			};
		});
	},

	/**
	 * Loads a single record from the specified data store.
	 * @param {string|IDBIndex} storeName
	 * @param {string|number|Array<string|number>} id
	 * @returns {Promise<object>}
	 */
	get: function (storeName, id)
	{
		this.ensureConnected();

		return new Promise((resolve, reject) =>
		{
			let store;

			if (!(storeName instanceof IDBIndex))
				store = this.db.transaction(storeName, 'readonly').objectStore(storeName);
			else
				store = storeName;

			let request = store.get(id);

			request.onsuccess = (evt) => {
				resolve(evt.target.result || null);
			};

			request.onerror = (evt) => {
				reject(evt.target.error);
			};
		});
	},


	/**
	 * Adds or overwrites a record in the specified data store (data must include the primary key).
	 * @param {string} storeName
	 * @param {object} data
	 * @returns {Promise<void>}
	 */
	put: function (storeName, data)
	{
		this.ensureConnected();

		return new Promise((resolve, reject) =>
		{
			let store = this.db.transaction(storeName, 'readwrite').objectStore(storeName);
			let request = store.put(data);

			request.onsuccess = (evt) => {
				resolve();
			};

			request.onerror = (evt) => {
				reject(evt.target.error);
			};
		});
	},

	/**
	 * Loads a variable from the system table.
	 * @param {string} name - Name of the property to read.
	 * @param {boolean} full - When `true` the entire object will be returned.
	 * @returns {any}
	 */
	sysRead: async function (name, full=false)
	{
		let data = await this.get('system', [name]);
		return data ? (full ? data : data.value) : null;
	},

	/**
	 * Writes a variable to the system table.
	 * @param {string} name - Name of the property to write.
	 * @param {any} value - Value to write.
	 * @param {boolean} full - When `true` the entire value will be written as-is.
	 * @returns {void}
	 */
	sysWrite: async function (name, value, full=false)
	{
		if (full)
		{
			value.name = name;
			await this.put('system', value);
		}
		else
			await this.put('system', { name: name, value: value });
	},

	/**
	 * Loads a single record from the specified data store that matches the `partial` object and does NOT match the `notPartial` object.
	 * @param {string|IDBIndex} storeName
	 * @param {object} [partial]
	 * @param {object} [notPartial]
	 * @returns {Promise<object>}
	 */
	findOne: function (storeName, partial=null, notPartial=null)
	{
		this.ensureConnected();

		return new Promise((resolve, reject) =>
		{
			let store;

			if (!(storeName instanceof IDBIndex))
				store = this.db.transaction(storeName, 'readonly').objectStore(storeName);
			else
				store = storeName;

			let request = store.openCursor();

			request.onsuccess = (event) =>
			{
				let cursor = event.target.result;
				if (!cursor)
				{
					resolve(null);
					return;
				}

				if (partial === null || Rinn.partialCompare(cursor.value, partial))
				{
					if (notPartial !== null)
					{
						if (Rinn.partialCompare(cursor.value, notPartial))
						{
							cursor.continue();
							return;
						}
					}

					resolve(cursor.value);
					return;
				}

				cursor.continue();
			};

			request.onerror = (evt) => {
				reject(evt.target.error);
			};
		});
	},

	/**
	 * Deletes a record from the specified data store.
	 * @param {string} storeName
	 * @param {string|number|Array<string|number>} id
	 * @returns {Promise<void>}
	 */
	delete: function (storeName, id)
	{
		this.ensureConnected();

		return new Promise((resolve, reject) =>
		{
			let store = this.db.transaction(storeName, 'readwrite').objectStore(storeName);

			let request = store.delete(id);
			request.onsuccess = (evt) => {
				resolve();
			};

			request.onerror = (evt) => {
				reject(evt.target.error);
			};
		});
	},

	/**
	 * 	Returns all items in the specified index.
	 *
	 * 	@param {IDBIndex} idbIndex
	 * 	@param {string} id
	 * 	@returns Promise => object
	 */
	deleteAll: function (idbIndex, id=null)
	{
		return this.forEach(idbIndex, id, async (value, cursor) => {
			await cursor.delete();
		});
	},

	/**
	 * Inserts a new record in the specified data store.
	 * @param {string} storeName
	 * @param {object} data
	 * @returns {Promise<void>}
	 */
	insert: function (storeName, data)
	{
		this.ensureConnected();

		return new Promise((resolve, reject) =>
		{
			let store = this.db.transaction(storeName, 'readwrite').objectStore(storeName);
			let request = store.add(data);

			request.onsuccess = (evt) => {
				resolve();
			};

			request.onerror = (evt) => {
				reject(evt.target.error);
			};
		});
	}
};
