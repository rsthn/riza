
/**
 * Formats a number with the given format.
 * @param {number} value
 * @param {string} format
 * @returns {string}
 */
export function formatNumber (value, format=".2,") {
    let decimalPlaces = parseInt(format[1]);
    let isNegative = value < 0;

    value = Math.abs(value);
    let integerPart = Math.floor(value).toString();
    let decimalPart = (value - Math.floor(value)).toFixed(decimalPlaces).substring(2);

    let result = "";
    let i = 0;
    for (let j = integerPart.length-1; j >= 0; j--) {
        if (i > 0 && i % 3 === 0)
            result = format[2] + result;
        result = integerPart[j] + result;
        i++;
    }

    if (decimalPlaces > 0)
        result += format[0] + decimalPart;

    return isNegative ? "-" + result : result;
}

/**
 * Returns the date part of a date object as YYYY-MM-DD.
 * @param {Date} date
 * @returns {string}
 */
export function formatDate (date=null) {
    if (date == null) date = new Date();
    return date.getFullYear() + '-' + (date.getMonth() + 1).toString().padStart(2, '0') + '-' + date.getDate().toString().padStart(2, '0');
}

/**
 * Returns the time part of a date object as HH:MM.
 * @param {Date} date
 * @returns {string}
 */
export function formatTime (date=null) {
    if (date == null) date = new Date();
    return date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0');
}

/**
 * Returns the HMAC of a message.
 * @param {string} hashName (i.e. SHA-512)
 * @param {string} key
 * @param {string} message
 * @returns {string}
 */
export async function HMAC (hashName, key, message) {
    key = await crypto.subtle.importKey(
        "raw", new TextEncoder().encode(key),
        { name: "HMAC", hash: { name: hashName } }, 
        false, ["sign"]
    );
    message = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
    return Array.from(new Uint8Array(message)).map(x => x.toString(16).padStart(2, '0')).join('');
}
