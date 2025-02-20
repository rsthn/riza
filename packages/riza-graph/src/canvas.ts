
import { attachHandler } from "./pointer";

export default class Canvas
{
    private g: CanvasRenderingContext2D;

    /**
     * Creates a new interface attached to the specified canvas element.
     */
    constructor (canvas: HTMLCanvasElement);
    /**
     * Creates a new interface attached to a canvas that will be created and added to the page.
     * @param isPrimary When `true` (default) fullscreen and pointer-events will be enabled.
     */
    constructor (isPrimary?: boolean);

    constructor (canvas: HTMLCanvasElement | boolean = true)
    {
        let isMain = canvas === true;

        if (typeof canvas === 'boolean') {
            canvas = document.createElement('canvas');
            document.body.appendChild(canvas);
        }

        let context2d = canvas.getContext('2d');
        if (context2d === null)
            throw new Error('Failed to get 2D context');

        this.g = context2d;
        this.backgroundColor = '#ffffff';

        if (isMain) {
            this.fullscreen();
            attachHandler(canvas);
        }
    }

    /**
     * Underlying canvas element.
     */
    get canvasElement() : HTMLCanvasElement {
        return this.g.canvas;
    }

    /**
     * Set canvas to fullscreen.
     */
    fullscreen() : this
    {
        this.g.canvas.width = window.innerWidth;
        this.g.canvas.height = window.innerHeight;

        Object.assign(this.g.canvas.style, {
            position: 'absolute',
            top: '0px',
            left: '0px'
        });

        return this;
    }

    /**
     * Background color of the canvas.
     */
    get backgroundColor() : string {
        return this.g.canvas.style.backgroundColor;
    }
    set backgroundColor(color: string) {
        this.g.canvas.style.backgroundColor = color;
    }

    /**
     * Width of the canvas.
     */
    get width() : number {
        return this.g.canvas.width;
    }
    set width(width: number) {
        this.g.canvas.width = width;
    }

    /**
     * Height of the canvas.
     */
    get height() : number {
        return this.g.canvas.height;
    }
    set height(height: number) {
        this.g.canvas.height = height;
    }

    /**
     * Clears the canvas to the default background color.
     */
    clear() : this {
        this.g.canvas.width = this.g.canvas.width;
        return this;
    }

    /**
     * Draws a line between the specified coordinates.
     */
    drawLine (
        x1: number, y1: number,
        x2: number, y2: number,
        lineColor: string = null,
        lineWidth: number = 1.0,
    ) : this
    {
        if (lineColor === null || lineWidth <= 0.0)
            return this;

        this.g.beginPath();
        this.g.moveTo(x1, y1);
        this.g.lineTo(x2, y2);

        this.g.strokeStyle = lineColor;
        this.g.lineWidth = lineWidth;
        this.g.stroke();
        return this;
    }

    /**
     * Draws a rectangle at the specified coordinates, with optional fill and stroke colors.
     */
    drawRect (
        x: number, y: number, width: number, height: number,
        fillColor: string = null, 
        strokeColor: string = null,
        lineWidth: number = 1.0,
    ) : this
    {
        if (fillColor !== null) {
            this.g.fillStyle = fillColor;
            this.g.fillRect(x, y, width, height);
        }

        if (strokeColor !== null) {
            this.g.lineWidth = lineWidth;
            this.g.strokeStyle = strokeColor;
            this.g.strokeRect(x, y, width, height);
        }

        return this;
    }

};
