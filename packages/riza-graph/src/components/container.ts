
import Canvas from '../canvas';
import Shape from './shape';

export default class Container extends Shape
{
    items: Shape[];

    constructor() {
        super();
        this.items = [];
    }

    add (shapes: Shape[]) : this;
    add (shape: Shape) : this;
    add (value: Shape[] | Shape) : this
    {
        if (Array.isArray(value)) {
            value.forEach((s) => this.add(s));
            return this;
        }

        if (this.items.indexOf(value) === -1) {
            this.items.push(value);
            this.onAdded(value);
        }

        return this;
    }

    find (x: number, y: number) : Shape | null {
        return this.items.findLast((s) => s.bounds.intersectsCoords(x, y)) ?? null;
    }

    findIndex (x: number, y: number) : number {
        return this.items.findLastIndex((s) => s.bounds.intersectsCoords(x, y));
    }

    onAdded (shape: Shape) {}

    override draw (g: Canvas) {
        this.items.forEach((s) => s.draw(g));
    }
}
