
import Canvas from '../canvas';
import Container from './container';
import Guidelines from './guidelines';
import Shape from './shape';

export default class Grid extends Container
{
    cellSize: number = 64;

    gx: Guidelines;
    gy: Guidelines;

    constructor() {
        super();
        this.gx = new Guidelines();
        this.gy = new Guidelines();
    }

    override onAdded (shape: Shape) {
        this.addShapeGuidelines(shape);
    }

    addShapeGuidelines (shape: Shape) {
        this.gx.add(shape.bounds.x);
        this.gx.add(shape.bounds.x2);
        this.gy.add(shape.bounds.y);
        this.gy.add(shape.bounds.y2);
    }

    removeShapeGuidelines (shape: Shape) {
        this.gx.remove(shape.bounds.x);
        this.gx.remove(shape.bounds.x2);
        this.gy.remove(shape.bounds.y);
        this.gy.remove(shape.bounds.y2);
    }

    override draw (g: Canvas)
    {
        this.bounds.width = g.width;
        this.bounds.height = g.height;

        this.gx.forEach((x) => {
            g.drawLine(x, 0, x, g.height, 'rgba(255,0,0,0.25)');
        });

        this.gy.forEach((y) => {
            g.drawLine(0, y, g.width, y, 'rgba(255,0,0,0.25)');
        });

        this.bounds.forEachHLine(this.cellSize, (x, y, s) => {
            g.drawLine(x, y, x + s, y, 'rgba(0,0,0,0.1)');
        });

        this.bounds.forEachVLine(this.cellSize, (x, y, s) => {
            g.drawLine(x, y, x, y + s, 'rgba(0,0,0,0.1)');
        });

        super.draw(g);
    }
}
