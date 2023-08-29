
/**
 * Indicates if signal debugging is enabled. When so, every signal change will be logged to the console.
 */
export let debugSignals = false;

/**
 * Signal class.
 */
export class Signal
{
    #value;
    #defvalue;
    #listeners;
    #label;

    constructor (value, defvalue)
    {
        this.#value = value;
        this.#label = null;

        this.#defvalue = defvalue;
        this.#listeners = [];
    }

    get value() {
        return this.#value;
    }

    set value(val) {
        if (this.#value === val) return;
        this.#value = val;
        this.notify();
    }

    get() {
        return this.value;
    }

    set(value, forced=false) {
        if (this.#value === value && forced !== true) return;
        this.#value = value;
        this.notify();
        return this;
    }

    label (value=null)
    {
        if (value === null)
            return this.#label;
        this.#label = value;
        return this;
    }

    reset() {
        this.value = this.#defvalue;
        return this;
    }

    connect (callback) {
        this.#listeners.push(callback);
        return this;
    }

    notify()
    {
        if (debugSignals)
            console.log('CHANGED', this.#label, this.#listeners.length);

        for (let callback of this.#listeners)
            callback();
    }
};

/**
 * Creates a new signal object.
 * @param {*} value?
 * @param {*} defaultValue?
 * @returns {Signal}
 */
export function signal (value=null, defaultValue=null)
{
    return new Signal (value, defaultValue);
}

/**
 * Creates a new signal as an expression of the specified signals evaluated by the given function.
 * @param {Array<Signal|*>} signals 
 * @param {Function} evaluator 
 * @returns {Signal}
 */
export function expr (signals, evaluator)
{
    let active = [];
    let notified = false;

    for (let i = 0; i < signals.length; i++)
    {
        if (signals[i] instanceof Signal)
            active.push([i, signals[i]]);
    }

    if (!active.length)
        return evaluator(...signals);

    const sgn = signal();

    const update = function() {
        for (let i of active)
            signals[i[0]] = i[1].value;
        sgn.value = evaluator(...signals);
        notified = false;
    };

    const debouncer = function() {
        if (notified) return;
        notified = true;
        queueMicrotask(update);
    };

    for (let i of active)
        i[1].connect(debouncer);

    update();
    return sgn;
}

/**
 * Creates a new watcher, such that if any signal changes the evaluator will be run.
 * @param {Array<Signal|*>} signals 
 * @param {Function} evaluator 
 * @param {boolean} initialRun? Set to `false` to disable the initial run of the evaluator.
 */
export function watch (signals, evaluator, initialRun=true)
{
    let active = [];
    let notified = false;

    for (let i = 0; i < signals.length; i++)
    {
        if (signals[i] instanceof Signal)
            active.push([i, signals[i]]);
    }

    if (!active.length) {
        if (initialRun) evaluator(...signals);
        return;
    }

    const update = function() {
        for (let i of active)
            signals[i[0]] = i[1].value;
        evaluator(...signals);
        notified = false;
    };

    const debouncer = function() {
        if (notified) return;
        notified = true;
        queueMicrotask(update);
    };

    for (let i of active)
        i[1].connect(debouncer);

    if (initialRun) update();
}
