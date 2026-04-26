export interface ILinePoint {
    x: number,
    y: number,
    anchor: SVGGraphicsElement
}

export class PolyLine {

    private static SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

    private _points: ILinePoint[] = new Array<ILinePoint>();
    private _lineElem: SVGPolylineElement;
    private _groupElem: SVGGElement;

    constructor(private svgRoot: SVGSVGElement) {

        this._lineElem = document.createElementNS(PolyLine.SVG_NAMESPACE, 'polyline') as SVGPolylineElement;
        this._lineElem.setAttribute('stroke', '#000000');
        this._lineElem.setAttribute('stroke-width', '1');
        this._lineElem.setAttribute('fill', 'none');

        this._groupElem = document.createElementNS(PolyLine.SVG_NAMESPACE, 'g') as SVGGElement;
        this._groupElem.appendChild(this._lineElem);
    }

    public get elemCnr(): SVGGElement {
        return this._groupElem;
    }

    public get nrOfPoints(): number {
        return this._points.length
    }
    
    public addPoint(x: number, y: number): number {

        const anchor = document.createElementNS(PolyLine.SVG_NAMESPACE, 'rect') as SVGRectElement;
        anchor.setAttribute('x', x.toString());
        anchor.setAttribute('y', y.toString());
        anchor.setAttribute('class', 'anchor');
        this._groupElem.appendChild(anchor);

        this._points.push({
            x: x,
            y: y,
            anchor: anchor
        })
        this.updatePointsAttr();
        return this._points.length - 1;
    }

    public removePoint(idx: number) {
        if (idx <= this._points.length - 1) {
            this._points[idx].anchor.remove();
            this._points.splice(idx, 1);
            this.updatePointsAttr();
        }
    }

    public modifyPoint(idx: number, x: number, y: number) {
        if (idx <= this._points.length - 1) {
            this._points[idx].x = x;
            this._points[idx].y = y;
            this._points[idx].anchor.setAttribute('x', x.toString());
            this._points[idx].anchor.setAttribute('y', y.toString());
            this.updatePointsAttr();
        }
    }

    private updatePointsAttr() {

        let pointsAttr = '';
        this._points.forEach(point => {
            pointsAttr += `${point.x},${point.y} `
        })
        this._lineElem.setAttribute('points', pointsAttr.trim());
    }
}