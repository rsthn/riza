
import { expr, watch } from 'riza';
import { userData } from '../signals';

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
 * Returns a function that sets the value of a signal.
 * @param {Signal} signal
 * @param {any} value
 * @returns {function}
 */
export function set (signal, value) {
    return function() {
        signal.set(value);
    };
}

/**
 * Executes a function when the condition is `true`.
 * @param {Signal} condition
 * @param {Function} fn
 */
export function when (condition, fn) {
    watch([condition], (condition) => {
        if (condition)
            fn();
    });
}

/**
 * Executes a function when the condition is `false`.
 * @param {Signal} condition
 * @param {Function} fn
 */
export function whenNot (condition, fn) {
    watch([condition], (condition) => {
        if (!condition)
            fn();
    });
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
 * Returns a signal representing the logical AND of the inputs.
 * @param {Signal} inputs
 * @returns {Signal}
 */
export function and (...inputs) {
    return expr(inputs, (...values) => values.every(val => val == true));
}

/**
 * Returns a signal representing the logical OR of the inputs.
 * @param {Signal} inputs
 * @returns {Signal}
 */
export function or (...inputs) {
    return expr(inputs, (...values) => values.some(val => val == true));
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

/**
 * Returns a signal that outputs `result` if `condition` is `null`, otherwise outputs `alternative`.
 * @param {Signal} condition
 * @param {*} [result]
 * @param {*} [alternative]
 * @returns {Signal}
 */
export function ifNull (condition, result=true, alternative=false) {
    return expr([condition], (condition) => condition === null ? result : alternative);
}

/**
 * Returns a signal that outputs `result` if `condition` is not `null`, otherwise outputs `alternative`.
 * @param {Signal} condition
 * @param {*} [result]
 * @param {*} [alternative]
 * @returns {Signal}
 */
export function ifNotNull (condition, result=true, alternative=false) {
    return expr([condition], (condition) => condition === null ? result : alternative);
}

/**
 * Returns a signal that outputs `result` if `condition` is equal to the given value, otherwise outputs `alternative`.
 * @param {Signal} condition
 * @param {*} value
 * @param {*} [result]
 * @param {*} [alternative]
 * @returns {Signal}
 */
export function eq (condition, value, result=true, alternative=false) {
    return expr([condition], (condition) => condition == value ? result : alternative);
}

/**
 * Returns a signal that outputs `result` if `condition` is NOT equal to the given value, otherwise outputs `alternative`.
 * @param {Signal} condition
 * @param {*} value
 * @param {*} [result]
 * @param {*} [alternative]
 * @returns {Signal}
 */
export function neq (condition, value, result=true, alternative=false) {
    return expr([condition], (condition) => condition != value ? result : alternative);
}

/**
 * Returns a signal that outputs `trueVal` if the current user has certain privilege or `falseVal` otherwise.
 * @param {*} privileges
 * @param {*} [trueVal]
 * @param {*} [falseVal]
 * @returns {Signal}
 */
export function hasPrivilege (privileges, trueVal=true, falseVal=false)
{
    if (typeof(privileges) === 'string')
        privileges = [ privileges ];

    return expr([ userData ], (userData) => {
        if (!userData.privileges)
            return falseVal;
        return userData.privileges.some(privilege => privileges.includes(privilege)) ? trueVal : falseVal;
    });
}
