
import { expr, watch } from 'riza';

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
 * Creates a forwarding watcher, when the `condition` is `true` any change to `source` will be forwarded to the `destination` signal.
 * @param {Signal} condition
 * @param {Signal} source 
 * @param {Signal} destination 
 * @param {function} [transform]
 */
export function forward (condition, source, destination, transform=null)
{
    watch([condition, source], (condition, value) => {
        if (condition)
            destination.set(transform ? transform(value) : value);
    });
}

/**
 * Creates a mirroring watcher, when the `condition` is `true` any change to `source` will be mirrored to the `destination` signal and vice versa.
 * @param {Signal} condition
 * @param {Signal} source
 * @param {Signal} destination
 */
export function mirror (condition, source, destination)
{
    watch([condition, source], (condition, value) => {
        if (condition && value !== destination.value)
            destination.set(value);
    });

    watch([condition, destination], (condition, value) => {
        if (condition && value !== source.value)
            source.set(value);
    });
}

/**
 * Returns a signal representing the logical NOT of the input.
 * @param {Signal} input
 * @returns {Signal}
 */
export function not (input) {
    return expr([input], (value) => !value);
}

/**
 * Returns a signal that outputs `result` if `condition` is `true`, otherwise outputs `alternative`.
 * @param {Signal} condition
 * @param {*} result
 * @param {*} [alternative]
 * @returns {Signal}
 */
export function ifTrue (condition, result, alternative='') {
    return expr([condition], (condition) => condition ? result : alternative);
}

/**
 * Returns a signal that outputs `result` if `condition` is `false`, otherwise outputs `alternative`.
 * @param {Signal} condition
 * @param {*} result
 * @param {*} [alternative]
 * @returns {Signal}
 */
export function ifFalse (condition, result, alternative='') {
    return expr([condition], (condition) => !condition ? result : alternative);
}
