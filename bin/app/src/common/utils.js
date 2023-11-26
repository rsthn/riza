
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
 * Returns the HMAC of a message using SHA-512.
 * @param {string} key
 * @param {string} message
 * @returns {string}
 */
export async function HMAC (key, message) {
    key = await crypto.subtle.importKey(
        "raw", new TextEncoder().encode(key),
        { name: "HMAC", hash: { name: "SHA-512" } }, 
        false, ["sign"]
    );
    message = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
    return Array.from(new Uint8Array(message)).map(x => x.toString(16).padStart(2, '0')).join('');
}
