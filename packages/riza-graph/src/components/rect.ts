
import Canvas from '../canvas';
import Shape from './shape';

export default class Rect extends Shape
{
    constructor (
        x: number, y: number, width: number, height: number, 
        fillColor: string = '#000',
        strokeColor: string = null,
        lineWidth: number = 1.0,
    ) {
        super(x, y, width, height);

        this.fillColor = fillColor;
        this.strokeColor = strokeColor;
        this.lineWidth = lineWidth;
    }

    override draw (g: Canvas) {
        g.drawRect(
            this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height,
            this.fillColor, this.strokeColor, this.lineWidth
        );
    }
}
