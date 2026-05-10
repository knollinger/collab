import { Point } from "../../models/point";
import { DragAnchor } from "../anchors/drag-anchor";
import { AbstractShape } from "./abstractshape";

export class PolygoneShape extends AbstractShape {

    private _polygon: SVGPolygonElement;
    private _points: Point[] = new Array<Point>();
    private _anchors: DragAnchor[] = new Array<DragAnchor>();

    /**
     * 
     * @param svgRoot 
     */
    constructor(svgRoot: SVGSVGElement) {

        const polygon = document.createElementNS(AbstractShape.SVG_NAMESPACE, 'polygon') as SVGPolygonElement;
        super('polygon', svgRoot, polygon);
        this._polygon = polygon;
    }

    /**
     * 
     * @param x 
     * @param y 
     */
    public addPoint(x: number, y: number): number {

        const point = new Point(x, y);
        this._anchors.push(this.createResizeAnchor('any', point));
        this._points.push(point);
        this.refresh();
        return this._points.length;
    }


    /**
     * 
     * @param idx 
     * @param x 
     * @param y 
     */
    public refresh() {

        this.recalcPointsAttr();
        this.recalcDimensions();
        this.onShapeChanged(this);
    }

    /**
     * 
     * @param newWidth 
     * @param newHeight 
     */
    protected onResizeImpl(newWidth: number, newHeight: number): void {

        let attr = '';
        for (let i = 0; i < this._points.length; ++i) {

            const point = this._points[i];
            attr += `${point.x},${point.y} `;

            this._anchors[i].setPosition(point.x, point.y);
        }
        this._polygon.setAttribute('points', attr.trim());
    }

    /**
     * 
     */
    private recalcPointsAttr() {

        let attr = '';
        this._points.forEach(point => {
            attr += `${point.x},${point.y} `;
        })
        this._polygon.setAttribute('points', attr.trim());
    }

    /**
     * 
     */
    private recalcDimensions() {

        let minX = Number.MAX_VALUE;
        let minY = Number.MAX_VALUE;
        let maxX = 0;
        let maxY = 0;

        this._points.forEach(point => {
            minX = Math.min(point.x, minX);
            minY = Math.min(point.y, minY);
            maxX = Math.max(point.x, maxX);
            maxY = Math.max(point.y, maxY);
        })
        this.width = maxX - minX;
        this.height = maxY - minY;
    }
}