import { AbstractShape } from "./abstractshape";

interface IPolygonePoint {
    x: number,
    y: number
}

export class PolygoneShape extends AbstractShape {

    private _polygon: SVGPolygonElement;
    private _points: IPolygonePoint[] = new Array<IPolygonePoint>();

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

        const point = {
            x: x,
            y: y
        }
        this._points.push(point);
        this.recalcPointsAttr();
        return this._points.length;
    }

    public modifyPoint(idx: number, x: number, y: number) {

        if(idx <= this._points.length - 1) {
            this._points[idx].x = x;
            this._points[idx].y = y;
            this.recalcPointsAttr();
        }
    }

    public  normalizePoints() {

        console.log('normalizeP');
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

        this._points.forEach(point => {
            point.x -= minX;
            point.y -= minY;
        })
        this.recalcPointsAttr();
        this.posX = minX;
        this.posY = minY;
        this.width = maxX - minX;
        this.height = maxY - minY;
    }


    private recalcPointsAttr() {

        let attr = '';
        this._points.forEach(point => {
            attr += `${point.x},${point.y} `;
        })
        this._polygon.setAttribute('points', attr.trim());
    }

    onResizeImpl(newWidth: number, newHeight: number): void {
        let attr = '';
        this._points.forEach(point => {
            attr += `${point.x},${point.y} `;
        })
        this._polygon.setAttribute('points', attr.trim());
    }
}