
import CustomDialog from './elems/custom-dialog';

/**
 * Month names.
 */
let monthName = [
	'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
	'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

/**
 * Returns an object containing the differences between the given objects.
 * @param {object} oldObject
 * @param {object} newObject
 * @returns {object}
 */
function getDiff (oldObject, newObject)
{
	let diffObject = { };

	for (let i in newObject)
	{
		if (i in oldObject)
		{
			if (oldObject[i] != newObject[i])
				diffObject[i] = newObject[i];
		}
		else
			diffObject[i] = newObject[i];
	}

	return diffObject;
}

/**
 * Converts the given value to a string.
 * @param {any} value
 * @returns {string}
 */
function str (value)
{
	return (value+'');
}

/**
 * Converts the given value to an integer.
 * @param {any} value
 * @returns {number}
 */
function int (value)
{
	return ~~(value);
}

/**
 * Returns the first non-null and non-undefined value in an argument list, or `null` if none found.
 * @param {any} ...values
 * @returns {any}
 */
function coalesce (...values)
{
	for (let i = 0; i < values.length; i++)
	{
		if (values[i] !== undefined && values[i] !== null)
			return values[i];
	}

	return null;
}

/**
 * Returns a promise that resolves after the given number of milliseconds.
 * @param {number} milliseconds
 * @returns {Promise<void>}
 */
function wait (milliseconds)
{
	return new Promise((resolve, reject) => {
		setTimeout(resolve, milliseconds);
	});
}

/**
 * Returns a map using the specified field as the key.
 * @param {Array<object>} data
 * @param {string} field
 * @returns {object}
 */
function mapify (data, field)
{
	let _data = { };

	for (let i = 0; i < data.length; i++)
		_data[data[i][field]] = data[i];

	return _data;
}

/**
 * Executes the callback after the given number of milliseconds.
 * @param {number} milliseconds
 * @param {function} callback
 */
function runAfter (milliseconds, callback)
{
	setTimeout(callback, milliseconds);
}

/**
 * Shows an information popup.
 * @param {string} text
 * @param {object} [options]
 * @returns {Promise<any>}
 */
function popupInfo (text, options=null)
{
	let dialog = new CustomDialog();
	document.body.appendChild(dialog);

	dialog.setType('info');
	dialog.model.set('title', global.messages.info);
	dialog.model.set('text', text);

	dialog.model.set('buttons', [
		{ value: true, label: global.messages.ok, class: 'btn-primary px-4' },
	]);

	if (options)
		dialog.model.set(options);

	runAfter(0, () => dialog.show());

	global.currentDialog = dialog;
	return dialog.wait();
}

/**
 * Shows an error popup.
 * @param {string} text
 * @param {object} [options]
 * @returns {Promise<any>}
 */
function popupError (text, options=null)
{
	let dialog = new CustomDialog();
	document.body.appendChild(dialog);

	dialog.setType('error');
	dialog.model.set('title', global.messages.error);
	dialog.model.set('text', text);

	dialog.model.set('buttons', [
		{ value: true, label: global.messages.ok, class: 'btn-primary px-4' },
	]);

	if (options)
		dialog.model.set(options);

	runAfter(0, () => dialog.show());

	global.currentDialog = dialog;
	return dialog.wait();
}

/**
 * Shows a confirmation popup.
 * @param {string} text
 * @param {object} [options]
 * @returns {Promise<any>}
 */
function popupConfirm (text, options=null)
{
	let dialog = new CustomDialog();
	document.body.appendChild(dialog);

	dialog.setType('confirm');
	dialog.model.set('title', global.messages.confirm);
	dialog.model.set('text', text);

	dialog.model.set('buttons', [
		{ value: false, label: global.messages.no },
		{ value: true, label: global.messages.yes, class: 'btn-primary px-4' }
	]);

	if (options)
		dialog.model.set(options);

	runAfter(0, () => dialog.show());

	global.currentDialog = dialog;
	return dialog.wait();
}

/**
 * Aligns a number to be two digits.
 * @param {string|number} value
 * @returns {string}
 */
function align2 (value)
{
	return (value/100).toFixed(2).substr(2);
}

/**
 * Parses the given date string.
 * @param {string|Date} value 
 * @returns {Date}
 */
function parseDate (value)
{
	if (typeof(value) === 'Date')
		return value;

	if (value.length <= 10)
		value += ' 00:00';

	return new Date(str(value));
}

/**
 * Formats the given datetime to standard format: YYYY-MM-DD hh:mm.
 * @param {string|Date} value
 * @returns {string}
 */
function formatDateTime (value)
{
	value = parseDate(value);
	return value.getFullYear() + '-' + align2(value.getMonth() + 1) + '-' + align2(value.getDate()) + ' ' + align2(value.getHours()) + ':' + align2(value.getMinutes());
}

/**
 * Formats the given datetime to short format: monthName DD hh:mm.
 * @param {string|Date} value
 * @returns {string}
 */
function formatShortDateTime (value)
{
	value = parseDate(value);
	return monthName[value.getMonth()] + ' ' + align2(value.getDate()) + ' ' + align2(value.getHours()) + ':' + align2(value.getMinutes());
}

/**
 * Formats the given datetime to standard date format: YYYY-MM-DD.
 * @param {string|Date} value
 * @returns {string}
 */
function formatDate (value)
{
	value = parseDate(value);
	return value.getFullYear() + '-' + align2(value.getMonth() + 1) + '-' + align2(value.getDate());
}

/**
 * Formats the given datetime to short date format: monthName DD.
 * @param {string|Date} value
 * @returns {string}
 */
function formatShortDate (value)
{
	value = parseDate(value);
	return monthName[value.getMonth()] + ' ' + align2(value.getDate());
}

/**
 * Formats the given value (in minutes) to hours and minutes in HH:MM format.
 * @param {number} value
 * @returns {string}
 */
function formatDuration (value)
{
	return align2(int(value / 60)) + ':' + align2(value % 60);
}

/**
 * Returns the elapsed time (in minutes) between the given date objects.
 * @param {string|Date} date2 
 * @param {string|Date} date1 
 * @returns {number}
 */
function elapsedTime (date2, date1)
{
	return int((parseDate(date2) - parseDate(date1)) / (60*1000));
}

/**
 * Return a negative number if date1 is before date2, 0 if they are equal, and a positive number if date1 is after date2.
 * @param {string|Date} date1 
 * @param {string|Date} date2 
 * @returns {number}
 */
function dateCompare (date1, date2)
{
	if (date1.getFullYear() != date2.getFullYear())
		return date1.getFullYear() - date2.getFullYear();

	if (date1.getMonth() != date2.getMonth())
		return date1.getMonth() - date2.getMonth();

	return date1.getDate() - date2.getDate();
}

export default
{
	monthName,
	getDiff,
	str,
	int,
	coalesce,
	wait,
	mapify,
	runAfter,
	popupInfo,
	popupError,
	popupConfirm,

	align2,
	parseDate,
	formatDateTime,
	formatShortDateTime,
	formatDate,
	formatShortDate,
	formatDuration,
	elapsedTime,
	dateCompare,
};
