
/**
 * Returns the translated string to the currently active language.
 * @param {string} value
 * @param {...*} args
 * @returns {string}
 */
export function tr (value, ...args) {
    if (value.indexOf('@@') !== -1) {
        value = value.split('@@');
        for (let i = 1; i < value.length; i++) {
            value[i-1] += args[i-1];
        }
        value = value.join('');
    }

    return value;
}
