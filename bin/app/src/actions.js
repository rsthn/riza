
import { Router, Api } from 'riza';
import { authStatus, userData } from './signals';
import { tr } from './common/i18n';
import { HMAC } from './common/utils';

/**
 * Navigates to the previous page.
 */
export function goBack() {
    history.back();
}

/**
 * Navigates to the specified location.
 * @param {string} location
 * @param {bool} [replace]
 */
export function navigate (location, replace=false, evt=null)
{
    if (evt) {
        evt.preventDefault();
        evt.stopPropagation();
    }

    if (Router.location !== location)
        Router.navigate(location, replace);
    else
        Router.refresh();
}

/**
 * Returns a function that executes the callback and prevents the propagation of the event.
 * @param {function} callback
 * @returns {function}
 */
export function runHandler (callback)
{
    return function(evt, ...args) {
        evt.preventDefault();
        evt.stopPropagation();
        callback(evt, ...args);
    };
}

/**
 * Checks if the user is authenticated.
 */
export function checkAuth (callback=null, tryDeviceAuth=true)
{
    Api.fetch('account/get').then(async r =>
    {
        if (r.response != 200)
        {
            if (tryDeviceAuth && localStorage.getItem('device_secret') !== null)
            {
                const data = {
                    timestamp: (new Date()).toISOString().split(".")[0].split("T").join(" "),
                    device_token: localStorage.getItem('device_token'),
                };
                data.signature = await HMAC('SHA-512', localStorage.getItem('device_secret'), JSON.stringify(data));

                Api.fetch('POST', 'auth/login-device', data).then(r => {
                    if (r.response == 200) {
                        localStorage.setItem('device_token', r.device_token);
                        checkAuth(callback, false);
                    }
                    else {
                        authStatus.set(authStatus.NOT_AUTH, true);
                        if (callback !== null && typeof(callback) === 'function')
                            callback();
                    }
                });
                return;
            }

            authStatus.set(authStatus.NOT_AUTH, true);
        }
        else {
            authStatus.set(authStatus.AUTH, true);
            userData.set(r);
        }

        if (callback !== null && typeof(callback) === 'function')
            callback();
    });
}

/**
 * Refreshes the user data.
 */
export function refreshUserData()
{
    Api.fetch('account/get').then(r => {
        if (r.response == 200)
            userData.set(r);
    });
}

/**
 * Logs out the user.
 */
export function logout()
{
    Api.fetch('auth/logout').then(r => {
        if (r.response == 200)
            localStorage.removeItem('device_secret');
        checkAuth();
    });

    return false;
}

/**
 * Clears all filters from an r-table.
 * @param {Event} evt 
 */
export function clearTableFilters (evt) {
    let model = evt.currentTarget.querySelectorParent('r-table').getModel();
    Object.keys(model.get()).filter(i => i.startsWith('filter_')).forEach(i => model.set(i, ''));
}

/**
 * Deletes the specified record using a data source.
 * @param {string} id 
 * @param {DataSource} ds
 */
export function deleteRecord (id, ds, callback=null)
{
    if (!confirm(tr('Are you sure you want to delete this record?')))
        return;

    ds.delete({ id }).then(() => {
        ds.refresh();
        if (callback) callback(); else goBack();
    }).catch(alert);
}

/**
 * Loads the specified record into an r-form.
 * @param {object} params
 * @param {DataSource} ds
 * @param {r-form} form
 * @param {function} err
 * @param {function} callback
 */
export function loadForm (params, ds, form, err, callback=null)
{
    form.reset();
    ds.fetch('POST', params).then(r => {
        form.model.set(r);
        if (callback) callback(r);
    }).catch((errmsg => {
        console.error(errmsg);
        err(errmsg);
    }));
}
