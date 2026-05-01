import { DragAnchor } from "../anchors/drag-anchor";
import { AbstractShape } from "./abstractshape";

export interface IPolygonePoint {
    x: number,
    y: number
}

export class PolygoneShape extends AbstractShape {

    private _polygon: SVGPolygonElement;
    private _points: IPolygonePoint[] = new Array<IPolygonePoint>();
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

    public get nrOfPoints(): number {
        return this._points.length;
    }

    /**
     * 
     * @param x 
     * @param y 
     */
    public addPoint(x: number, y: number): number {

        this._anchors.push(this.createResizeAnchor('any'));
        this._points.push({ x: x, y: y });
        this.recalcPointsAttr();
        this.recalcDimensions();
        return this._points.length;
    }

    protected onResizeImpl(newWidth: number, newHeight: number): void {

        let attr = '';
        for(let i = 0; i < this._points.length; ++i) {

            const point = this._points[i];
            attr += `${point.x},${point.y} `;

            this._anchors[i].setPosition(point.x, point.y);
        }
        this._polygon.setAttribute('points', attr.trim());
    }

    private recalcPointsAttr() {

        let attr = '';
        this._points.forEach(point => {
            attr += `${point.x},${point.y} `;
        })
        this._polygon.setAttribute('points', attr.trim());
    }


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