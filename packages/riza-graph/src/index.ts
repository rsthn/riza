
import { frameTime } from './signals';
import { onContextMenu, onDragMove, onDragStart, onDragStop } from './pointer';
import Canvas from './canvas';
import Rect from './components/rect';
import Grid from './components/grid';

function nzleabs (a, b) {
    return Math.abs(a) < Math.abs(b) && a != 0 ? a : (b != 0 ? b : a);
}

(function ()
{
    let canvas = new Canvas();
    let grid = new Grid();

    let activeObject: Rect | null;

    grid.add([
        new Rect(250, 225,  100, 100, '#808'),
        new Rect(575, 210,  100, 100, '#880'),
        new Rect(460, 273,  100, 100, '#808'),
        new Rect(376, 249,  100, 100, '#880'),
    ]);

    onContextMenu(() => {
        console.log(grid.gx.values);
        console.log(grid.gy.values);
    });

    onDragStart((p) => {
        activeObject = grid.find(p.x, p.y);
        if (activeObject) {
            grid.removeShapeGuidelines(activeObject);
            p.setDragOffset(activeObject.bounds.x, activeObject.bounds.y);
        }
    });

    onDragMove((p) => {
        if (activeObject)
        {
            let x = p.dx;
            let y = p.dy;

            let tx0 = grid.gx.closest(x + activeObject.bounds.width) - activeObject.bounds.width;
            let tx1 = grid.gx.closest(x);
            x = nzleabs(tx0-x, tx1-x) + x;

            let ty0 = grid.gy.closest(y + activeObject.bounds.height) - activeObject.bounds.height;
            let ty1 = grid.gy.closest(y);
            y = nzleabs(ty0-y, ty1-y) + y;

            activeObject.bounds.set(x, y);
        }
    });

    onDragStop((p) => {
        if (activeObject) {
            grid.addShapeGuidelines(activeObject);
            activeObject = null;
        }
    });

    frameTime.connect(() => {
        canvas.clear();
        grid.draw(canvas);
    });

})
();
