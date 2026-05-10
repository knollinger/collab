import { ResizeShapesGlassPane } from "../../glass-panes/resize-shape-glasspane";
import { Point } from "../../models/point";
import { AbstractShape } from "../shapes/abstractshape";

export type DragDirection = 'n' | 's' | 'w' | 'e' | 'nw' | 'sw' | 'ne' | 'se' | 'any';

/**
 * Zeichnet einen DragAnchor als SVGRectElement
 */
export class DragAnchor {


    protected static SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
    private static ANCHOR_WIDTH: number = 10;

    private _anchor: SVGRectElement;

    /**
     * 
     * @param svgRoot 
     * @param shape 
     * @param direction 
     */
    constructor(
        svgRoot: SVGSVGElement,
        shape: AbstractShape,
        direction: DragDirection,
        point?: Point) {

        this._anchor = document.createElementNS(DragAnchor.SVG_NAMESPACE, 'rect') as SVGRectElement;

        this._anchor.setAttribute('stroke-width', '2');
        this._anchor.setAttribute('stroke', 'cornflowerblue');
        this._anchor.setAttribute('fill', 'lightblue');
        this._anchor.setAttribute('width', DragAnchor.ANCHOR_WIDTH.toString());
        this._anchor.setAttribute('height', DragAnchor.ANCHOR_WIDTH.toString());
        this._anchor.setAttribute('class', `drag-${direction}`);

        this._anchor.addEventListener('mousedown', (evt: MouseEvent) => {
            evt.stopPropagation();
            new ResizeShapesGlassPane(svgRoot, shape, direction, point);
        });
    }

    /**
     * 
     * @param x 
     * @param y 
     */
    public setPosition(x: number, y: number) {

        this._anchor.setAttribute('x', (x - DragAnchor.ANCHOR_WIDTH / 2).toString());
        this._anchor.setAttribute('y', (y - DragAnchor.ANCHOR_WIDTH / 2).toString());
    }

    /**
     * 
     */
    public get svgElement(): SVGGraphicsElement {
        return this._anchor;
    }
}