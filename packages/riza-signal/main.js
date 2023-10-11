
/**
 * Signal class.
 */
export class Signal
{
    #value;
    #defvalue;
    #listeners;
    #type;

    /**
     * Creates a new signal object.
     * @param {*} value
     * @param {*} defvalue
     */
    constructor (value=null, defvalue=null)
    {
        this.#value = value;
        this.#type = null;

        if (value !== null) {
            if (typeof value === 'string')
                this.#type = 'string';
            else if (typeof value === 'number')
                this.#type = ~~value === value ? 'int' : 'number';
            else if (typeof value === 'boolean')
                this.#type = 'bool';
        }

        this.#defvalue = defvalue;
        this.#listeners = [];
    }

    /**
     * Sets the type of the signal.
     * @param {'string'|'bool'|'int'|'number'|'*'} type 
     * @returns {Signal}
     */
    as(type) {
        this.#type = type === '*' ? null : type;
        return this;
    }

    /**
     * Transforms the given value to the type of the signal.
     * @param {*} val 
     * @returns {*}
     */
    transform (val)
    {
        if (this.#type === null)
            return val;

        if (this.#type === 'string')
            return typeof val === 'string' ? val : val.toString();

        if (this.#type === 'int')
            return ~~val;

        if (this.#type === 'number')
            return typeof val === 'number' ? val : parseFloat(val);

        if (this.#type === 'bool')
        {
            if (typeof val === 'boolean')
                return val;

            if (typeof val === 'string')
                return val === 'true' || val === '1';

            return !!val;
        }

        return null;
    }

    /**
     * Returns the type of the signal.
     * @returns {'string'|'bool'|'int'|'number'|'*'}
     */
    get type() {
        return this.#type === null ? '*' : this.#type;
    }

    /**
     * Returns the value of the signal.
     * @returns {*}
     */
    get value() {
        return this.#value;
    }

    /**
     * Sets the value of the signal.
     * @param {*} val
     */
    set value(val) {
        val = this.transform(val);
        if (this.#value === val) return;
        this.#value = val;
        this.notify();
    }

    /**
     * Returns the value of the signal.
     * @returns {*}
     */
    get() {
        return this.value;
    }

    /**
     * Sets the value of the signal, when `forced` is true the signal will be updated even if its value is the same.
     * @param {*} value
     * @param {boolean} [forced]
     * @returns {Signal}
     */
    set(value, forced=false) {
        value = this.transform(value);
        if (this.#value === value && forced !== true) return;
        this.#value = value;
        this.notify();
        return this;
    }

    /**
     * Resets the value of the signal to its default value.
     * @returns {Signal}
     */
    reset() {
        this.value = this.#defvalue;
        return this;
    }

    /**
     * Connects a callback to the signal.
     * @param {function} callback
     * @returns {Signal}
     */
    connect (callback) {
        this.#listeners.push(callback);
        return this;
    }

    /**
     * Notifies all the listeners of the signal that it has changed its value.
     */
    notify() {
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
