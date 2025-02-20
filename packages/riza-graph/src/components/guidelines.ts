
export default class Guidelines
{
    private sorted: number[];

    values: Map<number, number>;

    constructor() {
        this.values = new Map();
        this.sorted = [];
    }

    add (value: number) : this
    {
        if (!this.values.has(value)) {
            this.values.set(value, 0);
            this.sorted.push(value);
            this.sorted = this.sorted.sort((a, b) => a - b);
        }

        this.values.set(value, this.values.get(value) + 1);
        return this;
    }

    remove (value: number) : this
    {
        if (!this.values.has(value))
            return this;

        let count = this.values.get(value) - 1;
        if (!count) {
            this.sorted.splice(this.sorted.indexOf(value), 1);
            this.values.delete(value);
        }
        else
            this.values.set(value, count);

        return this;
    }

    closest (ref: number, threshold: number = 10) : number
    {
        let start = 0;
        let end = this.sorted.length;

        let foundDelta = 0;
        let found;

        while (start < end)
        {
            let mid = ~~((start + end) >> 1);

            let delta = Math.abs(this.sorted[mid] - ref);
            if (delta <= threshold && (delta < foundDelta || foundDelta === 0)) {
                foundDelta = delta;
                found = mid;
            }

            if (this.sorted[mid] < ref)
                start = mid + 1;
            else
                end = mid;
        }

        return foundDelta ? this.sorted[found] : ref;
    }

    forEach (fn: (value: number) => void) : this {
        this.values.forEach((count, key) => count > 0 ? fn(key) : null);
        return this;
    }
}
