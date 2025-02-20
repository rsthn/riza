
import Canvas from '../canvas';
import Bounds from '../geom/bounds';

export default class Shape
{
    bounds: Bounds;

    fillColor: string = '#000';
    strokeColor: string = null;
    lineWidth: number = 1.0;

    constructor (x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
        this.bounds = new Bounds(x, y, width, height);
    }

    draw (g: Canvas) {
        g.drawRect(
            this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height,
            'rgba(255,0,0,0.5)'
        );
    }
}
