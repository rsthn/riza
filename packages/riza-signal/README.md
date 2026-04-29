# riza-signal

A small reactive primitive for JavaScript. The public API is four functions — `signal`, `expr`, `watch`, `validator` — for holding values, deriving values, reacting to changes, and constraining writes. Updates are batched via `queueMicrotask`, so a chain of synchronous changes only triggers one downstream evaluation.

Part of the [Riza](https://github.com/rsthn/riza) ecosystem.

## Installation

```bash
npm install riza-signal
```

```js
import { signal, expr, watch, validator } from 'riza-signal';
```

The package is ESM-only (`"type": "module"`).

## Quick start

```js
import { signal, expr, watch } from 'riza-signal';

const a = signal(2);
const b = signal(3);

const sum = expr([a, b], (x, y) => x + y);

watch([sum], (v) => console.log('sum is', v));
// → sum is 5

a.value = 10;
// → sum is 13
```

## API

### `signal(value?, defaultValue?)`

Creates a reactive value holder. `defaultValue` is what `reset()` reverts to.

```js
const count = signal(0, 0);

count.value = 5;          // write
console.log(count.value); // read
count.reset();            // back to 0
```

The returned object exposes:

| Member | Description |
|---|---|
| `value`            | Get/set the current value. Writing a value equal to the current one is a no-op (no listeners fire). |
| `get()`            | Returns the current value. |
| `set(value, forced=false)` | Writes a value. With `forced=true`, listeners fire even when the value is unchanged. Returns the signal. |
| `is(type)`         | Sets a type tag and enables coercion. Pass `'*'` to disable. Returns the signal. |
| `type`             | The configured type tag (`'string' \| 'bool' \| 'int' \| 'number' \| '*'`). |
| `reset()`          | Restores the default value supplied to `signal(...)`. Returns the signal. |
| `connect(cb)`      | Subscribes a callback. Receives the new value. Returns the signal. |
| `disconnect(cb)`   | Unsubscribes a callback. Returns the signal. |
| `emit()` / `notify()` | Manually fires listeners with the current value. |
| `getter` / `setter`   | Pre-bound `get` / `set` functions, handy for passing around. |

#### Type coercion

When a type is set with `.is(...)`, written values are coerced on the way in:

| Type | Coercion |
|---|---|
| `'string'` | `String(val)` |
| `'int'`    | `~~val` (truncated to 32-bit integer) |
| `'number'` | `parseFloat(val)` |
| `'bool'`   | `true`/`false`; strings `"true"` and `"1"` map to `true` |
| `'*'`      | no coercion |

```js
const flag = signal(false).is('bool');
flag.set('1');        // stored as true
flag.value = 'true';  // stored as true
```

### `expr(signals, evaluator)`

Builds a derived signal whose value is `evaluator(...signals)`. Any entry in the array that isn't a signal is passed through as-is. The result re-evaluates whenever any input signal changes.

If none of the inputs are signals, `expr` returns the evaluator's return value directly (not wrapped).

```js
const first = signal('Ada');
const last  = signal('Lovelace');

const fullName = expr([first, last], (f, l) => `${f} ${l}`);
console.log(fullName.value); // "Ada Lovelace"

first.value = 'Grace';
queueMicrotask(() => console.log(fullName.value)); // "Grace Lovelace"
```

Updates are debounced with `queueMicrotask`, so multiple synchronous writes to inputs collapse into a single recompute.

### `watch(signals, evaluator, initialRun=true)`

Like `expr`, but for side-effects — no return value. The evaluator runs once immediately (unless `initialRun` is `false`) and again whenever any input signal changes.

```js
const query = signal('');

watch([query], (q) => {
    if (q) fetch(`/search?q=${encodeURIComponent(q)}`);
});
```

### `validator(signal, rules)`  &nbsp;/&nbsp;  `validator(name, handler)`

Two overloads:

**Apply rules to a signal.** Each key in `rules` is a registered validator name; its value is the rule's parameter. The signal is watched, and on every change the rules run in order. A rule returning `false` halts the chain for that update.

```js
const age = signal(0);
validator(age, { min: 0, max: 120 });

age.value = -5;   // clamped to 0
age.value = 999;  // clamped to 120
```

**Register a new rule.** Pass a string name and a handler `(signal, param) => boolean | void`. Return `false` to stop subsequent rules.

```js
validator('even', (sgn) => {
    if (sgn.get() % 2 !== 0) sgn.set(sgn.get() + 1);
});

const n = signal(0);
validator(n, { even: true, max: 10 });
```

Built-in rules: `min`, `max` (both clamp).

## Notes

- Listeners attached via `connect()` are invoked synchronously on each write, but `expr` / `watch` debounce reactions via `queueMicrotask`, so the evaluator runs once per microtask flush regardless of how many inputs were touched.
- Requires a runtime that supports private class fields and `queueMicrotask` (any current browser or Node 16+).
