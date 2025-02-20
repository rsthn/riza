
class Pointer
{
    id : number;
    active : boolean = false;
    dragging : boolean = false;

    sx : number = 0;
    sy : number = 0;
    x : number = 0;
    y : number = 0;
    dx : number = 0;
    dy : number = 0;

    button : number = 0;
    wheelDelta : number = 0;
    wheelAccum : number = 0;

    constructor (id) {
        this.id = id;
    }

    updatePosition (x: number, y: number, setStart: boolean = false) : this
    {
        this.x = x;
        this.y = y;

        if (setStart) {
            this.sx = x;
            this.sy = y;
        }

        return this;
    }

    setDragOffset (x: number, y: number) : this {
        this.sx = this.x - x;
        this.sy = this.y - y;
        return this;
    }

    updateDelta() : this {
        this.dx = this.x - this.sx;
        this.dy = this.y - this.sy;
        return this;
    }

    resetDelta() : this {
        this.sx = this.x;
        this.sy = this.y;
        return this;
    }

    updateWheel (delta: number) : this {
        this.wheelDelta = delta;
        this.wheelAccum += delta;
        return this;
    }
}

export let pointers: Pointer[] = [
    new Pointer(0)
];

export type PointerEventHandler = (p: Pointer, pointers: Pointer[]) => void;


/**
 * Pointer event handlers.
 */
let _onContextMenu: PointerEventHandler = () => { };
let _onWheel: PointerEventHandler = () => { };
let _onPointerUp: PointerEventHandler = () => { };
let _onPointerDown: PointerEventHandler = () => { };
let _onPointerMove: PointerEventHandler = () => { };
let _onDragStart: PointerEventHandler = () => { };
let _onDragStop: PointerEventHandler = () => { };
let _onDragMove: PointerEventHandler = () => { };

export function onContextMenu (handler: PointerEventHandler) {
    _onContextMenu = handler;
}
export function onWheel (handler: PointerEventHandler) {
    _onWheel = handler;
}
export function onPointerUp (handler: PointerEventHandler) {
    _onPointerUp = handler;
}
export function onPointerDown (handler: PointerEventHandler) {
    _onPointerDown = handler;
}
export function onPointerMove (handler: PointerEventHandler) {
    _onPointerMove = handler;
}
export function onDragStart (handler: PointerEventHandler) {
    _onDragStart = handler;
}
export function onDragStop (handler: PointerEventHandler) {
    _onDragStop = handler;
}
export function onDragMove (handler: PointerEventHandler) {
    _onDragMove = handler;
}

/**
 * Attach pointer event handlers to the given element.
 */
export function attachHandler (elem: HTMLElement)
{
    // Attach pointer event handlers if pointer-events are available.
    if ("ontouchstart" in window)
    {
        elem.ontouchstart = function (evt)
        {
            evt.preventDefault();

            let touches = evt.changedTouches;
            for (let i = 0; i < touches.length; i++)
            {
                if (!pointers[touches[i].identifier])
                    pointers[touches[i].identifier] = new Pointer(touches[i].identifier);

                let p = pointers[touches[i].identifier];
                p.active = true;
                p.dragging = false;
                p.button = 1;

                //p.startTime = hrnow();
                p.updatePosition(touches[i].clientX, touches[i].clientY, true);
                _onPointerDown(p, pointers);
            }

            return false;
        };

        elem.ontouchend = function (evt)
        {
            evt.preventDefault();

            let touches = evt.changedTouches;
            for (let i = 0; i < touches.length; i++)
            {
                if (!pointers[touches[i].identifier])
                    continue;

                let p = pointers[touches[i].identifier];
                //p.endTime = hrnow();
                //p.deltaTime = p.endTime - p.startTime;
                p.updatePosition(touches[i].clientX, touches[i].clientY);

                if (p.dragging)
                    _onDragStop(p, pointers);

                _onPointerUp(p, pointers);
                p.active = false;
                p.dragging = false;
                p.button = 0;
            }

            return false;
        };

        elem.ontouchcancel = function (evt)
        {
            evt.preventDefault();

            let touches = evt.changedTouches;
            for (let i = 0; i < touches.length; i++)
            {
                if (!pointers[touches[i].identifier])
                    continue;

                let p = pointers[touches[i].identifier];
                p.updatePosition(touches[i].clientX, touches[i].clientY);

                if (p.dragging)
                    _onDragStop(p, pointers);
                else
                    _onPointerUp(p, pointers);

                p.active = false;
                p.dragging = false;
                p.button = 0;
            }

            return false;
        };

        elem.ontouchmove = function (evt)
        {
            evt.preventDefault();

            let touches = evt.changedTouches;
            for (let i = 0; i < touches.length; i++)
            {
                if (!pointers[touches[i].identifier])
                    continue;

                let p = pointers[touches[i].identifier];
                if (p.active && !p.dragging) {
                    _onDragStart(p, pointers);
                    p.dragging = true;
                }

                p.updatePosition(touches[i].clientX, touches[i].clientY);
                p.updateDelta();

                if (p.dragging)
                    _onDragMove(p, pointers);
                else
                    _onPointerMove(p, pointers);
            }

            return false;
        };

        return;
    }

    // Attach mouse event handlers when pointer-events are not available.
    elem.oncontextmenu = function(evt) {
        evt.preventDefault();
        _onContextMenu(pointers[0], pointers);
        return false;
    };

    elem.onwheel = function(evt) {
        evt.preventDefault();
        pointers[0].updatePosition(evt.clientX, evt.clientY)
                   .updateWheel(evt.deltaY);

        _onWheel(pointers[0], pointers);
        return false;
    };

    elem.onmousedown = function(evt)
    {
        evt.preventDefault();
        pointers[0].updatePosition(evt.clientX, evt.clientY, true);

        pointers[0].active = true;
        pointers[0].dragging = false;
        pointers[0].button = evt.which;

        _onPointerDown(pointers[0], pointers);
        return false;
    };

    elem.onmouseup = function (evt)
    {
        evt.preventDefault();
        pointers[0].updatePosition(evt.clientX, evt.clientY);

        if (pointers[0].dragging)
            _onDragStop(pointers[0], pointers);

        _onPointerUp(pointers[0], pointers);
        pointers[0].active = false;
        pointers[0].dragging = false;
        pointers[0].button = 0;
    };

    elem.onmousemove = function (evt)
    {
        evt.preventDefault();

        if (pointers[0].active && !pointers[0].dragging) {
            _onDragStart(pointers[0], pointers);
            pointers[0].dragging = true;
        }

        pointers[0].updatePosition(evt.clientX, evt.clientY)
                   .updateDelta();

        if (pointers[0].dragging)
            _onDragMove(pointers[0], pointers);
        else
            _onPointerMove(pointers[0], pointers);

        return false;
    };
}
