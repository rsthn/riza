
export default class Bounds
{
    x: number;
    y: number;
    width: number;
    height: number;

    constructor (x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    get x2() : number {
        return this.x + this.width - 1;
    }

    get y2() : number {
        return this.y + this.height - 1;
    }

    set (x: number, y: number) : this {
        this.x = x;
        this.y = y;
        return this;
    }

    /**
     * Translates the bounds by the specified amount in the x and y directions.
     */
    translate (dx: number, dy: number) : this {
        this.x += dx;
        this.y += dy;
        return this;
    }

    /**
     * Returns true if the bounds intersects the specified coordinates.
     */
    intersectsCoords (x: number, y: number, width: number = 1.0, height: number = 1.0) : boolean {
        let _x = Math.max(this.x, x);
        let _y = Math.max(this.y, y);
        let _width = Math.min(this.x + this.width, x + width) - _x;
        let _height = Math.min(this.y + this.height, y + height) - _y;
        return (_width > 0) && (_height > 0);
    }

    /**
     * Returns true if the bounds intersects the specified bounds.
     */
    intersectsBounds (bounds: Bounds) : boolean {
        return this.intersectsCoords(bounds.x, bounds.y, bounds.width, bounds.height);
    }

    /**
     * Runs the callback for each horizontal line spanned by the bounds using the specified delta.
     */
    forEachHLine (delta: number, fn: (x: number, y: number, s: number) => void) : this
    {
        if (delta <= 0) return this;
        for (let y = this.y; y < this.y + this.height; y += delta) {
            fn(this.x, y, this.width);
        }
        return this;
    }

    /**
     * Runs the callback for each vertical line spanned by the bounds using the specified delta.
     */
    forEachVLine (delta: number, fn: (x: number, y: number, s: number) => void) : this
    {
        if (delta <= 0) return this;
        for (let x = this.x; x < this.x + this.width; x += delta) {
            fn(x, this.y, this.height);
        }
        return this;
    }
}
