
import { Rinn } from 'rinn';

//!class db

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
     * @param {(db: IDBDatabase, txn: IDBTransaction, oldVersion: number) => void} upgradeCallback
     * @returns {Promise<void>}
     * !static init (dbName: string, version: number, upgradeCallback: (db: IDBDatabase, txn: IDBTransaction, oldVersion: number) => void) : Promise<void>;
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

            let req = indexedDB.open(dbName, version);
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
     * !static index (storeName: string, indexName: string) : IDBIndex;
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
     * @param {string|IDBIndex|IDBObjectStore} storeName
     * @param {string} id
     * @param { (value:object, cursor:IDBCursor) => Promise<boolean> } callback
     * @returns {Promise<void>}
     * !static forEach (storeName: string|IDBIndex|IDBObjectStore, id: string, callback: (value:object, cursor:IDBCursor) => Promise<boolean>) : Promise<void>;
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

            if (typeof(storeName) === 'string')
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
     * Returns the count of all records from the specified data store.
     * @param {string|IDBIndex|IDBObjectStore} storeName
     * @returns {Promise<number>}
     * !static count (storeName: string|IDBIndex|IDBObjectStore) : Promise<number>;
     */
    count: function (storeName)
    {
        this.ensureConnected();

        return new Promise((resolve, reject) =>
        {
            let store;

            if (typeof(storeName) === 'string')
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
     * Returns all records from the specified data store.
     * @param {string|IDBIndex|IDBObjectStore} storeName
     * @param {string|number|Array<string|number>} filter
     * @returns {Promise<Array<object>>}
     * !static getAll (storeName: string|IDBIndex|IDBObjectStore, filter?: string|number|Array<string|number>) : Promise<Array<object>>;
     */
    getAll: function (storeName, filter=null)
    {
        this.ensureConnected();

        return new Promise((resolve, reject) =>
        {
            let store;

            if (typeof(storeName) === 'string')
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
     * Returns all keys from the specified data store.
     * @param {string|IDBIndex|IDBObjectStore} storeName
     * @param {string|number|Array<string|number>} filter
     * @returns {Promise<Array<string|number|Array<string|number>>>}
     * !static getAllKeys (storeName: string|IDBIndex|IDBObjectStore, filter?: string|number|Array<string|number>) : Promise<Array<object>>;
     */
    getAllKeys: function (storeName, filter=null)
    {
        this.ensureConnected();

        return new Promise((resolve, reject) =>
        {
            let store;

            if (typeof(storeName) === 'string')
                store = this.db.transaction(storeName, 'readonly').objectStore(storeName);
            else
                store = storeName;

            let request = store.getAllKeys(filter);

            request.onsuccess = (evt) => {
                resolve(evt.target.result);
            };

            request.onerror = (evt) => {
                reject(evt.target.error);
            };
        });
    },

    /**
     * Loads a list of records having unique values from the specified data store and returns the entire object or just the specified field.
     * @param {string|IDBIndex|IDBObjectStore} storeName
     * @param {string} [field]
     * @returns {Promise<Array<number|string|object>>}
     * !static getAllUnique (storeName: string|IDBIndex|IDBObjectStore) : Promise<Array<number|string|object>>;
     */
    getAllUnique: function (storeName, fieldName=null)
    {
        this.ensureConnected();

        return new Promise((resolve, reject) =>
        {
            let store;

            if (typeof(storeName) === 'string')
                store = this.db.transaction(storeName, 'readonly').objectStore(storeName);
            else
                store = storeName;

            let request = store.openCursor(null, 'nextunique');
            let list = [];

            request.onsuccess = (event) =>
            {
                let cursor = event.target.result;
                if (!cursor)
                {
                    resolve(list);
                    return;
                }

                list.push(fieldName ? cursor.value[fieldName] : cursor.value);
                cursor.continue();
            };

            request.onerror = (evt) => {
                reject(evt.target.error);
            };
        });
    },

    /**
     * Returns a single record from the specified data store.
     * @param {string|IDBIndex|IDBObjectStore} storeName
     * @param {string|number|Array<string|number>} id
     * @returns {Promise<object>}
     * !static get (storeName: string|IDBIndex|IDBObjectStore, id: string|number|Array<string|number>) : Promise<object>;
     */
    get: function (storeName, id)
    {
        this.ensureConnected();

        return new Promise((resolve, reject) =>
        {
            let store;

            if (typeof(storeName) === 'string')
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
     * !static put (storeName: string, data: object) : Promise<void>;
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
     * Returns a variable from the system table.
     * @param {string} name - Name of the property to read.
     * @param {boolean} full - When `true` the entire object will be returned.
     * @returns {any}
     * !static sysGet (name: string, full?: boolean) : any;
     */
    sysGet: async function (name, full=false)
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
     * !static sysPut (name: string, value: any, full?: boolean) : void;
     */
    sysPut: async function (name, value, full=false)
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
     * Returns a single record from the specified data store that matches the `partial` object and does NOT match the `notPartial` object.
     * @param {string|IDBIndex|IDBObjectStore} storeName
     * @param {object} [partial]
     * @param {object} [notPartial]
     * @returns {Promise<object>}
     * !static findOne (storeName: string|IDBIndex|IDBObjectStore, partial?: object, notPartial?: object) : Promise<object>;
     */
    findOne: function (storeName, partial=null, notPartial=null)
    {
        this.ensureConnected();

        return new Promise((resolve, reject) =>
        {
            let store;

            if (typeof(storeName) === 'string')
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
     * !static delete (storeName: string, id: string|number|Array<string|number>) : Promise<void>;
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
     * Deletes all items in the specified store.
     * @param {string|IDBIndex|IDBObjectStore} storeName
     * @param {string|number|Array<string|number>} id
     * @returns {Promise<void>}
     * !static deleteAll (storeName: string|IDBIndex|IDBObjectStore, id: string|number|Array<string|number>) : Promise<void>;
     */
    deleteAll: function (storeName, id=null)
    {
        return this.forEach(storeName, id, async (value, cursor) => {
            await cursor.delete();
        });
    },

    /**
     * Inserts a new record in the specified data store.
     * @param {string} storeName
     * @param {object} data
     * @returns {Promise<void>}
     * !static insert (storeName: string, data: object) : Promise<void>;
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

//!/class
