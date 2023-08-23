
import { expr } from 'riza';

/**
 * Returns a function that toggles the specified boolean signal.
 * @param {Signal} signal
 * @returns {function}
 */
export function toggle (signal) {
    return function() {
        signal.value = !signal.value;
        return signal.value;
    };
}

/**
 * Returns a signal representing the logical NOT of the input.
 * @param {Signal} input
 * @returns {Signal}
 */
export function not (input) {
    return expr([input], (value) => !value);
}
