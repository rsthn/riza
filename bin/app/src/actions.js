
import { Router, Api } from 'riza';
import { authStatus, userData } from './signals';

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
 * Checks if the user is authenticated.
 */
export async function checkAuth (callback=null)
{
    Api.fetch('account/get').then(r =>
    {
        if (r.response != 200) {
            authStatus.set(authStatus.NOT_AUTH);
        }
        else {
            authStatus.set(authStatus.AUTH);
            userData.set(r);
        }

        if (callback !== null && typeof(callback) === 'function')
            callback();
    });
}

/**
 * Logs out the user.
 */
export function logout()
{
    Api.fetch('auth/logout').then(r => {
        location.reload();
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
    if (!confirm('Are you sure you want to delete this record?'))
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
    ds.fetch(params).then(r => {
        form.model.set(r);
        if (callback) callback(r);
    }).catch((errmsg => {
        console.error(errmsg);
        err(errmsg);
    }));
}
